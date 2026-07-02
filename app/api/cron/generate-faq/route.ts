import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const CRON_SECRET = process.env.CRON_SECRET || "";

const FAQ_THEMES = [
  { area: "Trabalhista", prompts: [
    "Perguntas que trabalhadores brasileiros fazem ao Google sobre demissao, rescisao, FGTS, ferias, 13o, hora extra, assedio, acidente de trabalho",
    "Duvidas comuns de empregados domesticos sobre direitos, carteira, ferias, FGTS, rescisao",
    "Perguntas sobre trabalho remoto/home office: direitos, equipamentos, jornada, vale-transporte"
  ]},
  { area: "Família", prompts: [
    "Perguntas que brasileiros fazem sobre divorcio, pensao alimenticia, guarda de filhos, uniao estavel, partilha de bens",
    "Duvidas sobre heranca, inventario, testamento, ITCMD, partilha entre herdeiros",
    "Perguntas sobre adocao, reconhecimento de paternidade, alienacao parental"
  ]},
  { area: "Consumidor", prompts: [
    "Perguntas que consumidores brasileiros fazem sobre nome negativado, produto defeituoso, cobranca indevida, direito de arrependimento",
    "Duvidas sobre plano de saude, negativa de cobertura, reajuste abusivo, portabilidade",
    "Perguntas sobre golpes financeiros, fraude no Pix, clonagem de cartao, estelionato digital"
  ]},
  { area: "Previdenciário", prompts: [
    "Perguntas que segurados do INSS fazem sobre aposentadoria, auxilio-doenca, BPC/LOAS, pensao por morte, revisao de beneficio",
    "Duvidas de MEI e autonomos sobre contribuicao ao INSS, tempo de contribuicao, carencia"
  ]},
  { area: "Imobiliário", prompts: [
    "Perguntas de inquilinos e proprietarios sobre aluguel, despejo, reajuste, contrato, cauçao, fiador",
    "Duvidas sobre compra de imovel, financiamento, escritura, ITBI, registro"
  ]},
  { area: "Criminal", prompts: [
    "Perguntas que familiares de presos fazem sobre fianca, habeas corpus, audiencia custodia, regime de cumprimento de pena",
    "Duvidas sobre violencia domestica, medida protetiva, Lei Maria da Penha, denuncia"
  ]},
  { area: "Trânsito", prompts: [
    "Perguntas de motoristas sobre multa de transito, recurso, pontos na CNH, suspensao, cassação",
    "Duvidas sobre acidente de transito, seguro, culpa, indenizacao, perda total"
  ]},
  { area: "Digital/LGPD", prompts: [
    "Perguntas sobre vazamento de dados, LGPD, direito ao esquecimento, perfil falso, cyberbullying, revenge porn"
  ]},
  { area: "Tributário", prompts: [
    "Perguntas de MEI e pequenas empresas sobre impostos, Simples Nacional, nota fiscal, DAS",
    "Duvidas sobre IPTU, IPVA, imposto de renda, divida ativa, execucao fiscal"
  ]}
];

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

async function generateFaqArticle(area: string, prompt: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY não configurada");

  const systemPrompt = `Voce e um redator juridico do AdvAqui, diretorio de advogados do Brasil.

Sua tarefa: criar um artigo no formato "perguntas e respostas" que capture buscas long-tail do Google. O artigo deve parecer uma conversa entre um leigo e um especialista.

REGRAS:
- Cada pergunta deve ser formulada EXATAMENTE como um brasileiro digitaria no Google (linguagem coloquial).
- Cada resposta deve ter 80-150 palavras: clara, com base legal citada, e um CTA para procurar advogado.
- Minimo 12 perguntas por artigo.
- Cite artigos de lei especificos (CLT, CC, CDC, CF, etc).
- Use HTML: <h2> para o titulo do grupo, <h3> para cada pergunta, <p> para resposta.
- Inclua links internos: <a href="/advogados">encontrar advogado</a>, <a href="/calculadoras">calculadoras</a>, <a href="/ferramentas">ferramentas</a>.
- Tom: empático, direto, sem jargao desnecessario.
- NAO prometa resultados judiciais.
- Finalize com <h2>Precisa de orientacao profissional?</h2><p>texto curto indicando buscar advogado no AdvAqui</p>.`;

  const userPrompt = `Gere um artigo no formato "perguntas e respostas" para a area "${area}".

CONTEXTO DE BUSCA: ${prompt}

Retorne APENAS um JSON valido:
{
  "title": "titulo SEO-friendly no formato pergunta ou '15 Perguntas sobre X' (max 60 chars)",
  "excerpt": "meta description 140-155 chars",
  "body": "HTML completo com 12-15 perguntas e respostas detalhadas",
  "keywords": ["5-8 palavras-chave long-tail"]
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
      max_tokens: 12000,
      temperature: 0.65,
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
    title: string;
    excerpt: string;
    body: string;
    keywords: string[];
  };
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!CRON_SECRET || token !== CRON_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const countParam = req.nextUrl.searchParams.get("count");
  const count = Math.min(Math.max(1, parseInt(countParam || "2", 10) || 2), 5);

  const supabase = createAdminClient({ noStore: true });

  const { data: existingFaqs } = await supabase
    .from("blog_articles")
    .select("title")
    .like("slug", "%perguntas%");

  const existingTitles = new Set(
    (existingFaqs || []).map((a) => a.title.toLowerCase())
  );

  const allPrompts: Array<{ area: string; prompt: string }> = [];
  for (const theme of FAQ_THEMES) {
    for (const p of theme.prompts) {
      allPrompts.push({ area: theme.area, prompt: p });
    }
  }

  const shuffled = allPrompts.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

  const results: Array<{ ok: boolean; slug?: string; title?: string; error?: string }> = [];

  for (const item of selected) {
    try {
      const generated = await generateFaqArticle(item.area, item.prompt);

      if (existingTitles.has(generated.title.toLowerCase())) {
        results.push({ ok: true, slug: "skipped-duplicate", title: generated.title });
        continue;
      }

      const baseSlug = slugify(generated.title);
      let finalSlug = baseSlug;

      const { data: existing } = await supabase
        .from("blog_articles")
        .select("slug")
        .eq("slug", baseSlug)
        .maybeSingle();

      if (existing) finalSlug = `${baseSlug}-${Date.now().toString(36)}`;

      const textOnly = generated.body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      const readingMin = Math.max(3, Math.round(textOnly.split(" ").length / 200));

      const { data: article, error } = await supabase
        .from("blog_articles")
        .insert({
          slug: finalSlug,
          title: generated.title,
          excerpt: (generated.excerpt || "").slice(0, 160),
          category: item.area,
          body: generated.body,
          reading_minutes: readingMin,
          author: "Equipe AdvAqui",
          published_at: new Date().toISOString(),
          status: "published",
          seo_keywords: generated.keywords
        })
        .select()
        .single();

      if (error) {
        results.push({ ok: false, error: error.message });
      } else {
        results.push({ ok: true, slug: article.slug, title: article.title });
      }

      await new Promise((r) => setTimeout(r, 2000));
    } catch (err) {
      results.push({ ok: false, error: err instanceof Error ? err.message : "Erro" });
    }
  }

  return NextResponse.json({
    ok: true,
    generated: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
    results
  });
}
