import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { RelatedQuestion } from "@/lib/supabase/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const CRON_SECRET = process.env.CRON_SECRET || "";

/** Máximo de artigos processados por execução (custo/latência). */
const MAX_BATCH = 5;

/** Tamanho máximo do corpo (texto puro) enviado ao modelo. */
const MAX_BODY_CHARS = 7000;

/**
 * Detecta "coluna não existe" (migration 0017 pendente). PostgREST retorna
 * mensagens como `column blog_articles.related_questions does not exist`
 * (42703) ou `Could not find the 'related_questions' column` no cache de
 * schema. Mesmo padrão de tolerância da migration 0016.
 */
const COLUMN_MISSING_RE = /column .* does not exist|could not find .* column/i;

const SYSTEM_PROMPT = `Você é um redator jurídico do AdvAqui, diretório de advogados do Brasil.

Sua tarefa: ler um artigo jurídico e gerar de 3 a 4 perguntas curtas que um LEIGO faria DEPOIS de ler esse artigo — dúvidas de acompanhamento que o texto desperta mas não responde em detalhe, formuladas exatamente como um brasileiro digitaria no Google.

REGRAS:
- 3 a 4 perguntas, cada uma com resposta de 40-80 palavras.
- Perguntas derivadas do PRÓPRIO conteúdo do artigo (não invente temas fora dele).
- Linguagem coloquial na pergunta; resposta clara, sem jargão desnecessário.
- Cite base legal quando couber (CLT, CC, CDC, CF etc.), sem exagerar.
- NÃO prometa resultados judiciais nem garanta êxito.
- NÃO repita perguntas já respondidas literalmente no artigo — busque o próximo passo do leitor.
- Texto puro nas respostas (sem HTML, sem markdown).
- Responda SOMENTE com JSON válido, sem texto fora do JSON, no formato:
{"questions":[{"question":"...","answer":"..."}]}`;

/** Remove tags HTML e comprime espaços — corpo do artigo vira texto puro. */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/** Parse tolerante: aceita code fences e prosa em volta; valida item a item. */
function parseQuestions(raw: string): RelatedQuestion[] {
  let text = raw.trim();
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced?.[1]) text = fenced[1].trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return [];
  text = text.slice(start, end + 1);

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return [];
  }

  const list = Array.isArray(parsed)
    ? parsed
    : Array.isArray((parsed as { questions?: unknown[] })?.questions)
      ? (parsed as { questions: unknown[] }).questions
      : [];

  const out: RelatedQuestion[] = [];
  for (const item of list) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const question = typeof o.question === "string" ? o.question.trim() : "";
    const answer = typeof o.answer === "string" ? o.answer.trim() : "";
    if (!question || !answer) continue;
    out.push({
      question: question.slice(0, 200),
      answer: answer.slice(0, 800)
    });
    if (out.length === 4) break;
  }
  return out;
}

type ArticleCandidate = {
  id: string;
  slug: string;
  title: string;
  category: string;
  body: string;
};

async function generateQuestions(
  apiKey: string,
  article: ArticleCandidate
): Promise<RelatedQuestion[]> {
  const bodyText = stripHtml(article.body).slice(0, MAX_BODY_CHARS);

  const chatMessages = [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: `Artigo (área: ${article.category}):\n\nTÍTULO: ${article.title}\n\nCONTEÚDO:\n${bodyText}`
    }
  ];

  const callOpenAI = (payload: Record<string, unknown>) =>
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

  // Modelo novo primeiro; se a API recusar (nome/params), cai pro antigo.
  let response = await callOpenAI({
    model: "gpt-5.4-mini",
    messages: chatMessages,
    max_completion_tokens: 2000
  });
  if (!response.ok) {
    const errText = await response.text();
    console.error(
      `[cron:article-related-questions] gpt-5.4-mini ${response.status}: ${errText} — fallback gpt-4o-mini`
    );
    response = await callOpenAI({
      model: "gpt-4o-mini",
      messages: chatMessages,
      max_tokens: 2000,
      temperature: 0.4,
      response_format: { type: "json_object" }
    });
  }

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "";
  const questions = parseQuestions(content);
  if (questions.length < 3) {
    throw new Error(
      `Resposta com menos de 3 perguntas válidas (${content.slice(0, 200)})`
    );
  }
  return questions;
}

/**
 * Gera "Perguntas relacionadas" para artigos do banco (roda 2x/semana via
 * crontab do VPS).
 *
 * Busca até 5 artigos published ainda sem related_questions, gera 3-4 Q&A
 * curtas derivadas do próprio conteúdo (dúvidas de acompanhamento de um
 * leigo) e grava em blog_articles.related_questions (jsonb). O artigo
 * renderiza a seção em <details> + FAQPage JSON-LD em /blog/[slug].
 *
 * Se a migration 0017 ainda não foi aplicada (coluna ausente), loga e retorna
 * sem falhar — não há onde persistir. Mesmo padrão de tolerância da 0016.
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") || "";
  if (!CRON_SECRET || token !== CRON_SECRET) {
    return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("[cron:article-related-questions] OPENAI_API_KEY não configurada");
    return NextResponse.json(
      { ok: false, error: "OPENAI_API_KEY não configurada" },
      { status: 503 }
    );
  }

  const countParam = req.nextUrl.searchParams.get("count");
  const count = Math.min(
    Math.max(1, parseInt(countParam || String(MAX_BATCH), 10) || MAX_BATCH),
    MAX_BATCH
  );

  // noStore: a URL do SELECT é idêntica entre chamadas, então o fetch patchado
  // do Next serviria o resultado do Data Cache — a rota religa sempre o mesmo
  // lote já processado.
  const supabase = createAdminClient({ noStore: true });

  const { data, error } = await supabase
    .from("blog_articles")
    .select("id, slug, title, category, body")
    .eq("status", "published")
    .is("related_questions", null)
    .order("published_at", { ascending: false })
    .limit(count);

  if (error && COLUMN_MISSING_RE.test(error.message)) {
    console.warn(
      "[cron:article-related-questions] migration 0017 pendente — nada a fazer:",
      error.message
    );
    return NextResponse.json({
      ok: true,
      processed: 0,
      persisted: false,
      note: "Coluna related_questions ausente (aplicar migration 0017)."
    });
  }
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const candidates = (data || []) as ArticleCandidate[];
  if (candidates.length === 0) {
    return NextResponse.json({ ok: true, processed: 0, results: [] });
  }

  const results: Array<{ ok: boolean; slug: string; questions?: number; error?: string }> = [];

  for (const article of candidates) {
    try {
      const questions = await generateQuestions(apiKey, article);

      const { error: updErr } = await supabase
        .from("blog_articles")
        .update({ related_questions: questions })
        .eq("id", article.id);

      if (updErr) {
        if (COLUMN_MISSING_RE.test(updErr.message)) {
          console.warn(
            "[cron:article-related-questions] migration 0017 pendente no UPDATE:",
            updErr.message
          );
          results.push({ ok: false, slug: article.slug, error: "Coluna ausente (migration 0017)." });
          break;
        }
        results.push({ ok: false, slug: article.slug, error: updErr.message });
      } else {
        results.push({ ok: true, slug: article.slug, questions: questions.length });
      }

      await new Promise((r) => setTimeout(r, 1500));
    } catch (err) {
      results.push({
        ok: false,
        slug: article.slug,
        error: err instanceof Error ? err.message : "Erro"
      });
    }
  }

  return NextResponse.json({
    ok: true,
    processed: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
    results
  });
}
