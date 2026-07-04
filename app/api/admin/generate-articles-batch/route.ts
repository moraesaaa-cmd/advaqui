import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth/adminSession";
import { createAdminClient } from "@/lib/supabase/admin";
import { BLOG_TOPICS } from "@/lib/data/blog-topics";
import { validateArticleBody, sanitizeArticleHtml } from "@/lib/content/article-quality";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/admin/generate-articles-batch
 *
 * Gera multiplos artigos juridicos em sequencia via OpenAI.
 * Requer sessao admin (cookie advaqui_admin_session).
 *
 * Body (JSON):
 *   - count: number       — quantos artigos gerar (max 15)
 *   - categories?: string[] — filtrar topicos por categorias (opcional)
 */

type RequestBody = {
  count: number;
  categories?: string[];
};

/** Remove acentos e gera slug kebab-case. */
function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

/** Busca indices de topicos ja usados. */
async function getUsedTopicIndices(): Promise<Set<number>> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("blog_articles")
    .select("topic_index")
    .not("topic_index", "is", null);
  const indices = new Set<number>();
  if (data) {
    for (const row of data) {
      if (typeof row.topic_index === "number") {
        indices.add(row.topic_index);
      }
    }
  }
  return indices;
}

/** Estima tempo de leitura baseado no conteudo HTML. */
function estimateReadingMinutes(html: string): number {
  const textOnly = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const wordCount = textOnly.split(" ").length;
  return Math.max(3, Math.round(wordCount / 200));
}

/** Gera um artigo via OpenAI. */
async function generateOne(topic: (typeof BLOG_TOPICS)[number]) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY não configurada");

  const systemPrompt = `Voce e um redator juridico brasileiro experiente que escreve para o AdvAqui, um diretorio de advogados.

REGRAS OBRIGATORIAS:
- Escreva artigos SEO-optimizados em portugues brasileiro para publico leigo.
- Cite leis especificas (CLT, CC, CDC, CF, CPC, leis especiais) com numero de artigo quando relevante.
- O conteudo e INFORMATIVO, nao constitui assessoria juridica (conformidade OAB).
- Sempre sugira que o leitor procure um advogado para seu caso especifico.
- Escreva em HTML puro usando tags: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>.
- NAO use markdown. NAO use # ou ** ou -.
- Minimo 1500 palavras de conteudo.
- Inclua uma secao final "Quando procurar um advogado" orientando o leitor.
- Tom: acessivel, claro, informativo. Evite jargao excessivo.
- Inclua exemplos praticos do dia a dia quando possivel.
- NAO prometa resultados judiciais nem percentuais de sucesso.
- O artigo deve ter entre 6 e 10 subtitulos (h2) para boa estrutura SEO.`;

  const userPrompt = `Escreva um artigo juridico completo sobre o seguinte tema:

TITULO: ${topic.title}
CATEGORIA: ${topic.category}
PALAVRAS-CHAVE: ${topic.keywords.join(", ")}
PUBLICO-ALVO: ${topic.targetAudience}

Retorne um JSON valido com esta estrutura (sem nenhum texto fora do JSON):
{
  "title": "titulo final do artigo (pode refinar o titulo sugerido)",
  "excerpt": "resumo de ate 160 caracteres para SEO, descrevendo o conteudo do artigo",
  "body": "conteudo HTML completo do artigo (minimo 1500 palavras)",
  "keywords": ["palavra1", "palavra2", "palavra3", "palavra4", "palavra5"]
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
      max_tokens: 6000,
      temperature: 0.7,
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenAI retornou resposta vazia");

  const parsed = JSON.parse(content) as {
    title: string;
    excerpt: string;
    body: string;
    keywords: string[];
  };

  if (parsed.excerpt && parsed.excerpt.length > 160) {
    parsed.excerpt = parsed.excerpt.slice(0, 157) + "...";
  }

  return parsed;
}

export async function POST(req: Request) {
  if (!isAdminRequest()) {
    return NextResponse.json(
      { ok: false, error: "Não autorizado" },
      { status: 401 }
    );
  }

  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Body JSON inválido" },
      { status: 400 }
    );
  }

  const count = Math.min(Math.max(1, body.count || 1), 15);
  const categoryFilter = body.categories?.map((c) => c.toLowerCase());

  const supabase = createAdminClient();
  const used = await getUsedTopicIndices();

  // Filtra topicos disponiveis
  let available = BLOG_TOPICS.map((t, i) => ({ topic: t, index: i })).filter(
    (c) => !used.has(c.index)
  );

  if (categoryFilter && categoryFilter.length > 0) {
    available = available.filter((c) =>
      categoryFilter.includes(c.topic.category.toLowerCase())
    );
  }

  if (available.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Nenhum tópico disponível (todos já foram usados)" },
      { status: 409 }
    );
  }

  // Embaralha e pega os primeiros `count`
  const shuffled = available.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, available.length));

  const results: Array<{
    ok: boolean;
    slug?: string;
    title?: string;
    category?: string;
    topic_index?: number;
    error?: string;
  }> = [];

  // Gera sequencialmente para evitar rate limit da OpenAI
  for (const item of selected) {
    try {
      const generated = await generateOne(item.topic);

      const baseSlug = slugify(generated.title || item.topic.title);
      let finalSlug = baseSlug;

      const { data: existing } = await supabase
        .from("blog_articles")
        .select("slug")
        .eq("slug", baseSlug)
        .maybeSingle();

      if (existing) {
        finalSlug = `${baseSlug}-${Date.now().toString(36)}`;
      }

      const qc = validateArticleBody(generated.body, { minWords: 900 });
      if (!qc.ok) {
        results.push({ ok: false, error: `descartado (${qc.reason}): ${finalSlug}` });
        continue;
      }
      const safeBody = sanitizeArticleHtml(generated.body);
      const readingMinutes = estimateReadingMinutes(safeBody);

      const { data: article, error } = await supabase
        .from("blog_articles")
        .insert({
          slug: finalSlug,
          title: generated.title || item.topic.title,
          excerpt: generated.excerpt,
          category: item.topic.category,
          body: safeBody,
          reading_minutes: readingMinutes,
          author: "Equipe AdvAqui",
          published_at: new Date().toISOString(),
          status: "published",
          seo_keywords: generated.keywords || item.topic.keywords,
          topic_index: item.index
        })
        .select()
        .single();

      if (error) {
        results.push({
          ok: false,
          topic_index: item.index,
          error: error.message
        });
      } else {
        results.push({
          ok: true,
          slug: article.slug,
          title: article.title,
          category: article.category,
          topic_index: item.index
        });
      }

      // Pausa de 1s entre chamadas para respeitar rate limits
      if (selected.indexOf(item) < selected.length - 1) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      console.error(
        `[generate-batch] Erro no topico ${item.index}:`,
        message
      );
      results.push({
        ok: false,
        topic_index: item.index,
        error: message
      });
    }
  }

  const succeeded = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;

  return NextResponse.json({
    ok: failed === 0,
    summary: { requested: count, generated: succeeded, failed },
    results
  });
}
