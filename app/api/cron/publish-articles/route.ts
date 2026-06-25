import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { BLOG_TOPICS } from "@/lib/data/blog-topics";

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
  const supabase = createAdminClient();
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
- O artigo deve ter entre 6 e 10 subtitulos (h2) para boa estrutura SEO.
- Inclua links internos relevantes usando tags <a> para paginas do AdvAqui como /calculadoras, /advogados, /glossario, /ferramentas quando fizer sentido no contexto.`;

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
    throw new Error(`OpenAI ${response.status}: ${errText}`);
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

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!CRON_SECRET || token !== CRON_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const countParam = req.nextUrl.searchParams.get("count");
  const count = Math.min(Math.max(1, parseInt(countParam || "1", 10) || 1), 5);

  const supabase = createAdminClient();
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

      if (existing) finalSlug = `${baseSlug}-${Date.now().toString(36)}`;

      const { data: article, error } = await supabase
        .from("blog_articles")
        .insert({
          slug: finalSlug,
          title: generated.title || item.topic.title,
          excerpt: generated.excerpt,
          category: item.topic.category,
          body: generated.body,
          reading_minutes: estimateReadingMinutes(generated.body),
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
        await new Promise((r) => setTimeout(r, 1500));
      }
    } catch (err) {
      results.push({ ok: false, error: err instanceof Error ? err.message : "Erro" });
    }
  }

  return NextResponse.json({
    ok: true,
    generated: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
    remaining: available.length - results.filter((r) => r.ok).length,
    results
  });
}
