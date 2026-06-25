import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth/adminSession";
import { createAdminClient } from "@/lib/supabase/admin";
import { BLOG_TOPICS } from "@/lib/data/blog-topics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/admin/generate-article
 *
 * Gera um artigo jurídico via OpenAI e salva no Supabase.
 * Requer sessão admin (cookie advaqui_admin_session).
 *
 * Body (JSON):
 *   - topicIndex?: number  — índice no BLOG_TOPICS (se omitido, escolhe aleatório não usado)
 *   - category?: string    — filtra tópicos por categoria antes de escolher aleatório
 */

type RequestBody = {
  topicIndex?: number;
  category?: string;
};

/** Remove acentos e gera slug kebab-case a partir de um titulo. */
function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

/** Busca índices de tópicos já usados na tabela blog_articles. */
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

/** Escolhe um tópico aleatório ainda não usado. */
async function pickUnusedTopic(
  category?: string
): Promise<{ topic: (typeof BLOG_TOPICS)[number]; index: number } | null> {
  const used = await getUsedTopicIndices();
  let candidates = BLOG_TOPICS.map((t, i) => ({ topic: t, index: i })).filter(
    (c) => !used.has(c.index)
  );
  if (category) {
    candidates = candidates.filter(
      (c) => c.topic.category.toLowerCase() === category.toLowerCase()
    );
  }
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

/** Chama a API OpenAI e retorna o artigo gerado. */
async function generateArticleContent(topic: (typeof BLOG_TOPICS)[number]) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY não configurada no .env.local");
  }

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
  if (!content) {
    throw new Error("OpenAI retornou resposta vazia");
  }

  const parsed = JSON.parse(content) as {
    title: string;
    excerpt: string;
    body: string;
    keywords: string[];
  };

  // Garante que excerpt nao passa de 160 chars
  if (parsed.excerpt && parsed.excerpt.length > 160) {
    parsed.excerpt = parsed.excerpt.slice(0, 157) + "...";
  }

  return parsed;
}

/** Estima tempo de leitura baseado no conteudo HTML. */
function estimateReadingMinutes(html: string): number {
  const textOnly = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const wordCount = textOnly.split(" ").length;
  return Math.max(3, Math.round(wordCount / 200));
}

export async function POST(req: Request) {
  if (!isAdminRequest()) {
    return NextResponse.json(
      { ok: false, error: "Não autorizado" },
      { status: 401 }
    );
  }

  let body: RequestBody = {};
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    // Body vazio e valido (escolhe topico aleatorio)
  }

  try {
    let topicIndex: number;
    let topic: (typeof BLOG_TOPICS)[number];

    if (typeof body.topicIndex === "number") {
      // Indice especifico
      if (body.topicIndex < 0 || body.topicIndex >= BLOG_TOPICS.length) {
        return NextResponse.json(
          { ok: false, error: `topicIndex fora do range (0-${BLOG_TOPICS.length - 1})` },
          { status: 400 }
        );
      }
      topicIndex = body.topicIndex;
      topic = BLOG_TOPICS[topicIndex];
    } else {
      // Escolhe aleatorio
      const pick = await pickUnusedTopic(body.category);
      if (!pick) {
        return NextResponse.json(
          {
            ok: false,
            error: body.category
              ? `Todos os topicos da categoria "${body.category}" ja foram usados`
              : "Todos os topicos ja foram usados"
          },
          { status: 409 }
        );
      }
      topicIndex = pick.index;
      topic = pick.topic;
    }

    // Gera conteudo via OpenAI
    const generated = await generateArticleContent(topic);

    // Cria slug unico
    const baseSlug = slugify(generated.title || topic.title);
    const supabase = createAdminClient();

    // Verifica se slug ja existe e adiciona sufixo se necessario
    let finalSlug = baseSlug;
    const { data: existing } = await supabase
      .from("blog_articles")
      .select("slug")
      .eq("slug", baseSlug)
      .maybeSingle();

    if (existing) {
      finalSlug = `${baseSlug}-${Date.now().toString(36)}`;
    }

    const readingMinutes = estimateReadingMinutes(generated.body);

    // Salva no banco
    const { data: article, error } = await supabase
      .from("blog_articles")
      .insert({
        slug: finalSlug,
        title: generated.title || topic.title,
        excerpt: generated.excerpt,
        category: topic.category,
        body: generated.body,
        reading_minutes: readingMinutes,
        author: "Equipe AdvAqui",
        published_at: new Date().toISOString(),
        status: "published",
        seo_keywords: generated.keywords || topic.keywords,
        topic_index: topicIndex
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      article: {
        id: article.id,
        slug: article.slug,
        title: article.title,
        category: article.category,
        reading_minutes: article.reading_minutes,
        published_at: article.published_at,
        topic_index: topicIndex,
        topic_title: topic.title
      }
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    console.error("[generate-article] Error:", message);
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
