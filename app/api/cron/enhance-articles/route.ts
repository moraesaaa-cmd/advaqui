import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { callAI, logAgentRun, touchAgentConfig } from "@/lib/ai/core";
import { canReplaceBody, sanitizeArticleHtml } from "@/lib/content/article-quality";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const CRON_SECRET = process.env.CRON_SECRET || "";

function estimateReadingMinutes(html: string): number {
  const textOnly = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return Math.max(3, Math.round(textOnly.split(" ").length / 200));
}

function wordCount(html: string): number {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().split(" ").length;
}

async function enhanceArticle(article: { title: string; body: string; category: string; excerpt: string }) {
  const currentWords = wordCount(article.body);
  const hasFaq = article.body.toLowerCase().includes("perguntas frequentes");

  const systemPrompt = `Voce e um editor juridico senior do AdvAqui. Sua tarefa e ENRIQUECER artigos juridicos existentes para melhorar o ranqueamento no Google.

REGRAS:
- Mantenha TODO o conteudo original intacto. Voce so ADICIONA, nunca remove.
- O conteudo e informativo, nao constitui assessoria juridica.
- Cite leis e artigos especificos quando adicionar conteudo.
- Use HTML: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <a>.
- Links internos: /advogados, /calculadoras, /ferramentas, /glossario, /quanto-custa.`;

  let taskDescription = "";

  if (currentWords < 1200) {
    taskDescription = `O artigo tem apenas ${currentWords} palavras. EXPANDA para pelo menos 1800 palavras:
- Adicione 2-3 novas secoes h2 com conteudo relevante (exemplos praticos, jurisprudencia, passo a passo).
- Aprofunde secoes existentes que estao superficiais.`;
  }

  if (!hasFaq) {
    taskDescription += `\n\nO artigo NAO tem secao de FAQ. ADICIONE ao final:
<h2>Perguntas frequentes</h2>
Seguida de 5 pares <h3>pergunta relevante?</h3><p>resposta concisa e util</p>`;
  }

  if (!taskDescription.trim()) {
    return null;
  }

  const userPrompt = `ARTIGO ATUAL:
Titulo: ${article.title}
Categoria: ${article.category}

CORPO HTML ATUAL:
${article.body}

---

TAREFA DE ENRIQUECIMENTO:
${taskDescription}

Retorne APENAS um JSON valido:
{
  "body": "corpo HTML COMPLETO do artigo enriquecido (conteudo original + novo conteudo adicionado)",
  "excerpt": "meta description melhorada entre 140-155 chars (ou null para manter a atual)",
  "wordsAdded": numero_aproximado_de_palavras_adicionadas
}`;

  // Camada central (lib/ai/core.ts): timeout/retry/custo; log do run no GET.
  const r = await callAI({
    feature: "article_enhancer",
    action: "enhance_article",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    model: "gpt-4o-mini",
    maxTokens: 16000,
    temperature: 0.5,
    json: true,
    timeoutMs: 180_000,
    log: false
  });

  if (!r.ok) throw new Error(`OpenAI: ${r.erro}`);

  const parsed = JSON.parse(r.text) as {
    body: string;
    excerpt: string | null;
    wordsAdded: number;
  };
  return { parsed, tokens: r.totalTokens, costUsd: r.costUsd };
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!CRON_SECRET || token !== CRON_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const limitParam = req.nextUrl.searchParams.get("limit");
  const limit = Math.min(Math.max(1, parseInt(limitParam || "3", 10) || 3), 5);

  const supabase = createAdminClient({ noStore: true });

  const { data: shortArticles } = await supabase
    .from("blog_articles")
    .select("id, slug, title, body, category, excerpt, reading_minutes")
    .eq("status", "published")
    .lt("reading_minutes", 7)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (!shortArticles || shortArticles.length === 0) {
    return NextResponse.json({
      ok: true,
      message: "Nenhum artigo precisa de enriquecimento",
      enhanced: 0
    });
  }

  const results: Array<{ ok: boolean; slug: string; wordsAdded?: number; error?: string }> = [];
  const runStart = Date.now();
  let runTokens = 0;
  let runCost = 0;

  for (const article of shortArticles) {
    try {
      const hasFaq = (article.body || "").toLowerCase().includes("perguntas frequentes");
      const words = wordCount(article.body || "");

      if (words >= 1200 && hasFaq) {
        results.push({ ok: true, slug: article.slug, wordsAdded: 0 });
        continue;
      }

      const enhanced = await enhanceArticle({
        title: article.title,
        body: article.body || "",
        category: article.category,
        excerpt: article.excerpt || ""
      });

      if (!enhanced) {
        results.push({ ok: true, slug: article.slug, wordsAdded: 0 });
        continue;
      }
      runTokens += enhanced.tokens;
      runCost += enhanced.costUsd;

      // PORTÃO ANTI-CORRUPÇÃO: só substitui o corpo se o novo for válido, não
      // encolher e preservar o conteúdo. Antes, uma reescrita ruim (mais curta
      // ou com HTML quebrado) sobrescrevia um artigo publicado todo dia — a
      // causa-raiz da "corrupção diária". Se não puder melhorar, deixa como está.
      const replace = canReplaceBody(article.body || "", enhanced.parsed.body);
      if (!replace.ok) {
        results.push({ ok: true, slug: article.slug, wordsAdded: 0, error: `mantido: ${replace.reason}` });
        continue;
      }
      const safeBody = sanitizeArticleHtml(enhanced.parsed.body);
      const newReadingMinutes = estimateReadingMinutes(safeBody);

      const { error } = await supabase
        .from("blog_articles")
        .update({
          body: safeBody,
          reading_minutes: newReadingMinutes,
          ...(enhanced.parsed.excerpt
            ? { excerpt: enhanced.parsed.excerpt.slice(0, 160) }
            : {})
        })
        .eq("id", article.id);

      if (error) {
        results.push({ ok: false, slug: article.slug, error: error.message });
      } else {
        results.push({
          ok: true,
          slug: article.slug,
          wordsAdded: enhanced.parsed.wordsAdded || 0
        });
      }

      await new Promise((r) => setTimeout(r, 2000));
    } catch (err) {
      results.push({ ok: false, slug: article.slug, error: err instanceof Error ? err.message : "Erro" });
    }
  }

  const enhancedCount = results.filter((r) => r.ok && (r.wordsAdded || 0) > 0).length;
  const failedCount = results.filter((r) => !r.ok).length;

  // Observabilidade do run (agent_logs + placar em agent_configs).
  await logAgentRun("article_enhancer", "run_complete", {
    status: failedCount === 0 ? "success" : enhancedCount > 0 ? "success" : "error",
    itemsProcessed: enhancedCount,
    tokensUsed: runTokens,
    costUsd: runCost,
    durationMs: Date.now() - runStart,
    details: {
      failed: failedCount,
      slugs: results.filter((r) => r.ok && (r.wordsAdded || 0) > 0).map((r) => r.slug)
    }
  });
  await touchAgentConfig("article_enhancer", "Enriquecedor de Artigos", {
    tokensUsed: runTokens,
    costUsd: runCost
  });

  return NextResponse.json({
    ok: true,
    enhanced: enhancedCount,
    skipped: results.filter((r) => r.ok && (r.wordsAdded || 0) === 0).length,
    failed: failedCount,
    results
  });
}
