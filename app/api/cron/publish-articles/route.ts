import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { BLOG_TOPICS } from "@/lib/data/blog-topics";
import { callAI, logAgentRun, touchAgentConfig } from "@/lib/ai/core";
import { validateArticleBody, sanitizeArticleHtml } from "@/lib/content/article-quality";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const CRON_SECRET = process.env.CRON_SECRET || "";

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function estimateReadingMinutes(html: string): number {
  const textOnly = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return Math.max(3, Math.round(textOnly.split(" ").length / 200));
}

async function getUsedTopicIndices(): Promise<Set<number>> {
  const supabase = createAdminClient({ noStore: true });
  const { data } = await supabase
    .from("blog_articles")
    .select("topic_index")
    .not("topic_index", "is", null);
  const indices = new Set<number>();
  if (data) {
    for (const row of data) {
      if (typeof row.topic_index === "number") indices.add(row.topic_index);
    }
  }
  return indices;
}

async function generateOne(topic: (typeof BLOG_TOPICS)[number]) {
  const systemPrompt = `Voce e um redator juridico brasileiro com 15 anos de experiencia, especialista em SEO e produção de conteudo para o AdvAqui — o maior diretorio de advogados do Brasil.

MISSÃO: Produzir artigos longos, completos e que RANQUEIEM no Google. Cada artigo deve ser a MELHOR resposta da internet para a busca do leitor.

REGRAS DE CONTEUDO:
- Minimo 2000 palavras (artigos curtos nao ranqueiam).
- Cite leis especificas com numero de artigo: CLT, CC, CDC, CF, CPC, leis especiais (ex: "Art. 477 da CLT", "Art. 42 do CDC").
- Inclua jurisprudencia recente quando relevante (STF, STJ, TST).
- Use exemplos praticos do cotidiano brasileiro com valores em reais.
- Tom: acessivel, empático, direto. O leitor é leigo, nao use jargao sem explicar.
- NUNCA prometa resultados judiciais nem percentuais de sucesso.
- O conteudo é INFORMATIVO — sempre diga que o leitor deve procurar um advogado.

ESTRUTURA OBRIGATORIA:
- 8 a 12 subtitulos (h2) para boa estrutura SEO.
- Primeiro paragrafo: resposta direta e objetiva à pergunta do titulo (Google Featured Snippet).
- Secoes com profundidade: cada h2 deve ter 150-300 palavras.
- Incluir uma secao "Passo a passo" ou "Como fazer" quando aplicavel.
- Incluir uma secao "Quando procurar um advogado" no final.
- Incluir uma secao "Perguntas frequentes" (FAQ) com 5 perguntas e respostas curtas no final do artigo.

FORMATAÇÃO HTML:
- Use APENAS: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <a>.
- NAO use markdown. NAO use # ou ** ou -.
- A secao FAQ deve usar <h2>Perguntas frequentes</h2> seguida de pares <h3>pergunta</h3><p>resposta</p>.

LINKS INTERNOS (inclua naturalmente no texto):
- /advogados — "encontrar advogados"
- /calculadoras — "calculadoras juridicas"
- /ferramentas — "ferramentas para advogados"
- /glossario — "glossario juridico"
- /blog — "mais artigos"
- /advogados-de/{area} — quando mencionar uma especialidade (ex: /advogados-de/trabalhista)
- /quanto-custa — quando falar de custos

SEO:
- O titulo deve conter a palavra-chave principal nos primeiros 60 caracteres.
- A meta description deve ter exatamente entre 140 e 155 caracteres, ser persuasiva e conter a palavra-chave.
- Use as palavras-chave naturalmente ao longo do texto (densidade 1-2%).`;

  const userPrompt = `Escreva um artigo juridico COMPLETO e EXTENSO (minimo 2000 palavras) sobre:

TITULO: ${topic.title}
CATEGORIA: ${topic.category}
PALAVRAS-CHAVE: ${topic.keywords.join(", ")}
PUBLICO-ALVO: ${topic.targetAudience}

IMPORTANTE: O artigo DEVE ter no minimo 2000 palavras de conteudo HTML. Artigos curtos serao rejeitados.

Retorne APENAS um JSON valido (sem texto fora do JSON):
{
  "title": "titulo final otimizado para SEO (max 60 chars)",
  "excerpt": "meta description persuasiva entre 140-155 caracteres com a palavra-chave principal",
  "body": "conteudo HTML completo do artigo (minimo 2000 palavras, incluindo secao FAQ com 5 perguntas no final)",
  "keywords": ["5 a 8 palavras-chave relevantes"],
  "faq": [
    {"question": "pergunta 1", "answer": "resposta concisa"},
    {"question": "pergunta 2", "answer": "resposta concisa"},
    {"question": "pergunta 3", "answer": "resposta concisa"},
    {"question": "pergunta 4", "answer": "resposta concisa"},
    {"question": "pergunta 5", "answer": "resposta concisa"}
  ]
}`;

  // Camada central: timeout/retry/custo/log ficam em lib/ai/core.ts.
  // log:false aqui — o run inteiro é logado uma vez no fim do GET (evita
  // uma linha de agent_logs por artigo além da linha do run).
  const r = await callAI({
    feature: "article_publisher",
    action: "generate_article",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    model: "gpt-4o-mini",
    maxTokens: 16000,
    temperature: 0.6,
    json: true,
    timeoutMs: 180_000,
    log: false
  });

  if (!r.ok) throw new Error(`OpenAI: ${r.erro}`);

  const parsed = JSON.parse(r.text) as {
    title: string;
    excerpt: string;
    body: string;
    keywords: string[];
    faq?: Array<{ question: string; answer: string }>;
  };

  if (parsed.excerpt && parsed.excerpt.length > 160) {
    parsed.excerpt = parsed.excerpt.slice(0, 157) + "...";
  }

  return { parsed, tokens: r.totalTokens, costUsd: r.costUsd };
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!CRON_SECRET || token !== CRON_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const countParam = req.nextUrl.searchParams.get("count");
  const count = Math.min(Math.max(1, parseInt(countParam || "1", 10) || 1), 5);

  const supabase = createAdminClient({ noStore: true });
  const used = await getUsedTopicIndices();

  const available = BLOG_TOPICS
    .map((t, i) => ({ topic: t, index: i }))
    .filter((c) => !used.has(c.index));

  if (available.length === 0) {
    return NextResponse.json({
      ok: true,
      message: "Todos os tópicos já foram publicados",
      remaining: 0
    });
  }

  const shuffled = available.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, available.length));

  const results: Array<{ ok: boolean; slug?: string; title?: string; error?: string }> = [];
  const runStart = Date.now();
  let runTokens = 0;
  let runCost = 0;

  for (const item of selected) {
    try {
      const { parsed: generated, tokens, costUsd } = await generateOne(item.topic);
      runTokens += tokens;
      runCost += costUsd;
      const baseSlug = slugify(generated.title || item.topic.title);
      let finalSlug = baseSlug;

      const { data: existing } = await supabase
        .from("blog_articles")
        .select("slug")
        .eq("slug", baseSlug)
        .maybeSingle();

      if (existing) finalSlug = `${baseSlug}-${Date.now().toString(36)}`;

      // PORTÃO ANTI-CORRUPÇÃO: não publica corpo vazio/fino/quebrado. Antes,
      // um body ruim do modelo virava URL de blog em branco no índice.
      const check = validateArticleBody(generated.body, { minWords: 900 });
      if (!check.ok) {
        results.push({ ok: false, error: `descartado (${check.reason}): ${finalSlug}` });
        continue;
      }
      const safeBody = sanitizeArticleHtml(generated.body);

      const { data: article, error } = await supabase
        .from("blog_articles")
        .insert({
          slug: finalSlug,
          title: generated.title || item.topic.title,
          excerpt: generated.excerpt,
          category: item.topic.category,
          body: safeBody,
          reading_minutes: estimateReadingMinutes(safeBody),
          author: "Equipe AdvAqui",
          published_at: new Date().toISOString(),
          status: "published",
          seo_keywords: generated.keywords || item.topic.keywords,
          topic_index: item.index
        })
        .select()
        .single();

      if (error) {
        results.push({ ok: false, error: error.message });
      } else {
        results.push({ ok: true, slug: article.slug, title: article.title });
      }

      if (selected.indexOf(item) < selected.length - 1) {
        await new Promise((r) => setTimeout(r, 2000));
      }
    } catch (err) {
      results.push({ ok: false, error: err instanceof Error ? err.message : "Erro" });
    }
  }

  const generatedCount = results.filter((r) => r.ok).length;
  const failedCount = results.filter((r) => !r.ok).length;

  // Observabilidade do run — alimenta agent_logs e o placar em agent_configs
  // (antes o publisher rodava 10x/dia sem registrar nada: total_runs ficava 0).
  await logAgentRun("article_publisher", "run_complete", {
    status: failedCount === 0 ? "success" : generatedCount > 0 ? "success" : "error",
    itemsProcessed: generatedCount,
    tokensUsed: runTokens,
    costUsd: runCost,
    durationMs: Date.now() - runStart,
    details: {
      failed: failedCount,
      slugs: results.filter((r) => r.ok).map((r) => r.slug),
      errors: results.filter((r) => !r.ok).map((r) => (r.error || "").slice(0, 120))
    }
  });
  await touchAgentConfig("article_publisher", "Publicador de Artigos", {
    tokensUsed: runTokens,
    costUsd: runCost
  });

  return NextResponse.json({
    ok: true,
    generated: generatedCount,
    failed: failedCount,
    remaining: available.length - generatedCount,
    results
  });
}
