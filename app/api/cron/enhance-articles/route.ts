import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

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
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY não configurada");

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

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 16000,
      temperature: 0.5,
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Resposta vazia");

  return JSON.parse(content) as {
    body: string;
    excerpt: string | null;
    wordsAdded: number;
  };
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!CRON_SECRET || token !== CRON_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const limitParam = req.nextUrl.searchParams.get("limit");
  const limit = Math.min(Math.max(1, parseInt(limitParam || "3", 10) || 3), 5);

  const supabase = createAdminClient();

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

      const newReadingMinutes = estimateReadingMinutes(enhanced.body);

      const { error } = await supabase
        .from("blog_articles")
        .update({
          body: enhanced.body,
          reading_minutes: newReadingMinutes,
          ...(enhanced.excerpt ? { excerpt: enhanced.excerpt.slice(0, 160) } : {})
        })
        .eq("id", article.id);

      if (error) {
        results.push({ ok: false, slug: article.slug, error: error.message });
      } else {
        results.push({ ok: true, slug: article.slug, wordsAdded: enhanced.wordsAdded || 0 });
      }

      await new Promise((r) => setTimeout(r, 2000));
    } catch (err) {
      results.push({ ok: false, slug: article.slug, error: err instanceof Error ? err.message : "Erro" });
    }
  }

  return NextResponse.json({
    ok: true,
    enhanced: results.filter((r) => r.ok && (r.wordsAdded || 0) > 0).length,
    skipped: results.filter((r) => r.ok && (r.wordsAdded || 0) === 0).length,
    failed: results.filter((r) => !r.ok).length,
    results
  });
}
