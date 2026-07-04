import { NextResponse } from "next/server";
import { getCurrentLawyer } from "@/lib/painel/server";
import { callAI, type ChatMessage } from "@/lib/ai/core";

/**
 * POST /api/painel/question-draft — rascunho de resposta por IA para uma
 * pergunta de leitor (painel do advogado, /painel/perguntas).
 *
 * Body: { question: string } (máx 2000 chars).
 * Devolve { ok: true, draft } — o advogado SEMPRE edita/aprova antes de
 * publicar (o rascunho só preenche o textarea).
 *
 * Modelo: gpt-5.4-mini → fallback gpt-4o-mini (camada central lib/ai/core.ts:
 * timeout/retry/custo/log em agent_logs).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_QUESTION_CHARS = 2000;

/* ── Rate limit leve em memória: 20 rascunhos/dia por advogado ── */

const DAY_MS = 86_400_000;
const MAX_PER_DAY = 20;
const hits = new Map<string, number[]>();

function rateLimited(userId: string): boolean {
  const now = Date.now();
  const arr = (hits.get(userId) || []).filter((t) => now - t < DAY_MS);
  arr.push(now);
  hits.set(userId, arr);
  // Limpeza preguiçosa para não vazar memória
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= DAY_MS)) hits.delete(k);
    }
  }
  return arr.length > MAX_PER_DAY;
}

const SYSTEM_PROMPT =
  "Você redige um RASCUNHO de resposta pública que um advogado dará a uma pergunta jurídica enviada por uma pessoa leiga em um diretório jurídico. " +
  "Tom sóbrio, claro e respeitoso, em português do Brasil. " +
  "Estrutura: 2 a 4 parágrafos curtos, em texto corrido, sem markdown (proibido asteriscos, cerquilhas ou listas com hífen). " +
  "Conteúdo informativo e GERAL: explique o tema da pergunta em termos simples, sem analisar o caso concreto como se fosse consulta individual. " +
  "PROIBIDO: prometer ou garantir resultado; afirmar prazos ou valores como certeza; sugerir que a pessoa procure outro advogado; " +
  "referir-se a si mesmo ou a como o texto foi produzido. " +
  "Termine com um convite discreto para contato profissional, para avaliar os detalhes do caso. " +
  "Devolva SOMENTE o texto do rascunho, sem título, sem comentários e sem saudação do tipo 'Prezado'.";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, code: "invalid_json", error: "Requisição inválida." },
      { status: 400 }
    );
  }

  const current = await getCurrentLawyer();
  if (!current.ok) return NextResponse.json(current, { status: current.status });

  const question =
    typeof body.question === "string"
      ? body.question.trim().slice(0, MAX_QUESTION_CHARS)
      : "";
  if (question.length < 10) {
    return NextResponse.json(
      {
        ok: false,
        code: "question_invalida",
        error: "Envie a pergunta do leitor (pelo menos 10 caracteres)."
      },
      { status: 400 }
    );
  }

  if (rateLimited(current.lawyer.id)) {
    return NextResponse.json(
      {
        ok: false,
        code: "rate_limited",
        error: "Limite de 20 rascunhos por dia atingido. Tente novamente amanhã."
      },
      { status: 429 }
    );
  }

  const chatMessages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: `Pergunta do leitor:\n\n${question}` }
  ];

  // Modelo novo primeiro; se a API recusar, cai pro antigo (padrão do repo).
  let r = await callAI({
    feature: "question_draft",
    action: "draft",
    messages: chatMessages,
    model: "gpt-5.4-mini",
    maxTokens: 800,
    retries: 0,
    details: { lawyer_id: current.lawyer.id }
  });
  if (!r.ok) {
    console.error(`[painel:question-draft] gpt-5.4-mini falhou (${r.erro}) — fallback gpt-4o-mini`);
    r = await callAI({
      feature: "question_draft",
      action: "draft",
      messages: chatMessages,
      model: "gpt-4o-mini",
      maxTokens: 800,
      temperature: 0.6,
      retries: 1,
      details: { lawyer_id: current.lawyer.id }
    });
  }

  if (!r.ok) {
    console.error(`[painel:question-draft] OpenAI falhou: ${r.erro}`);
    const error =
      r.erro === "sem_chave"
        ? "A IA não está configurada no momento. Avise o suporte."
        : "Não foi possível gerar o rascunho agora. Tente novamente em instantes.";
    return NextResponse.json(
      { ok: false, code: "ia_indisponivel", error },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true, draft: r.text });
}
