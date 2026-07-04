import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdminRequest } from "@/lib/auth/adminSession";
import { callAI, type ChatMessage } from "@/lib/ai/core";

/**
 * POST /api/consulta-processo/explicar  { movimentos: string[] }
 *
 * Recebe a lista de movimentações que o usuário acabou de consultar no
 * DataJud (/api/consulta-processo) e devolve uma explicação em linguagem
 * simples para pessoa leiga: onde o processo está, o que já aconteceu e o
 * próximo passo provável — sem prometer prazo nem resultado.
 *
 * Exige sessão Supabase (a página /processos já é gated pelo ToolGate).
 * As mensagens de erro são vistas por CLIENTE FINAL: nunca mencionar IA.
 *
 * Modelo: gpt-5.4-mini → fallback gpt-4o-mini (camada central lib/ai/core.ts:
 * timeout/retry/custo/log em agent_logs).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MOVIMENTOS = 60;
const MAX_CHARS_POR_MOVIMENTO = 300;

/* ── Rate limit leve em memória: 10 explicações/hora por usuário ── */

const HOUR_MS = 3_600_000;
const MAX_PER_HOUR = 10;
const hits = new Map<string, number[]>();

function rateLimited(userId: string): boolean {
  const now = Date.now();
  const arr = (hits.get(userId) || []).filter((t) => now - t < HOUR_MS);
  arr.push(now);
  hits.set(userId, arr);
  // Limpeza preguiçosa para não vazar memória
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= HOUR_MS)) hits.delete(k);
    }
  }
  return arr.length > MAX_PER_HOUR;
}

const SYSTEM_PROMPT =
  "Você explica andamentos de processos judiciais para uma pessoa leiga, em português do Brasil simples e direto. " +
  "Você receberá a lista de movimentações públicas de um processo, do MAIS RECENTE para o mais antigo, com datas quando disponíveis. " +
  "Devolva em TEXTO PURO (sem markdown, sem asteriscos, sem cerquilhas), exatamente nesta estrutura:\n\n" +
  "Onde o processo está agora\n" +
  "[1 parágrafo curto dizendo em que fase o processo se encontra hoje]\n\n" +
  "O que já aconteceu\n" +
  "[lista curta em ordem CRONOLÓGICA — do mais antigo para o mais recente —, uma linha por evento relevante começando com hífen; " +
  "inclua a data quando ela aparecer; agrupe movimentações repetitivas ou burocráticas em uma linha só]\n\n" +
  "Próximo passo provável\n" +
  "[1 linha, SEM prometer prazo nem resultado — use formulações como 'normalmente' ou 'em geral']\n\n" +
  "Regras: proibido juridiquês sem explicar em seguida com palavras comuns (ex.: 'concluso: o processo foi entregue ao juiz para decidir'); " +
  "não invente fatos, datas ou resultados que não estejam nas movimentações; nunca garanta resultado nem prazo; " +
  "não se refira a si mesmo nem a como o texto foi produzido; não dê conselho sobre o caso concreto.";

export async function POST(req: Request) {
  // Sessão obrigatória (mesma exigência do ToolGate da página /processos).
  // O ADMIN usa cookie HMAC próprio (sem sessão Supabase) — aceitar também.
  let userId = "admin";
  if (!isAdminRequest()) {
    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { ok: false, mensagem: "Faça login para usar este recurso." },
        { status: 401 }
      );
    }
    userId = user.id;
  }

  if (rateLimited(userId)) {
    return NextResponse.json(
      {
        ok: false,
        mensagem: "Você usou este recurso muitas vezes na última hora. Aguarde um pouco e tente de novo."
      },
      { status: 429 }
    );
  }

  let body: { movimentos?: unknown };
  try {
    body = (await req.json()) as { movimentos?: unknown };
  } catch {
    return NextResponse.json(
      { ok: false, mensagem: "Requisição inválida." },
      { status: 400 }
    );
  }

  const movimentos = (Array.isArray(body.movimentos) ? body.movimentos : [])
    .filter((m): m is string => typeof m === "string" && m.trim().length > 0)
    .slice(0, MAX_MOVIMENTOS)
    .map((m) => m.trim().slice(0, MAX_CHARS_POR_MOVIMENTO));

  if (movimentos.length === 0) {
    return NextResponse.json(
      { ok: false, mensagem: "Consulte um processo com movimentações primeiro." },
      { status: 400 }
    );
  }

  const chatMessages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: `Movimentações do processo (da mais recente para a mais antiga):\n\n${movimentos.join("\n")}`
    }
  ];

  // Modelo novo primeiro; se a API recusar, cai pro antigo (padrão do repo).
  let r = await callAI({
    feature: "explicar_andamentos",
    action: "explicar",
    messages: chatMessages,
    model: "gpt-5.4-mini",
    maxTokens: 900,
    retries: 0,
    details: { movimentos: movimentos.length }
  });
  if (!r.ok) {
    console.error(`[consulta-processo:explicar] gpt-5.4-mini falhou (${r.erro}) — fallback gpt-4o-mini`);
    r = await callAI({
      feature: "explicar_andamentos",
      action: "explicar",
      messages: chatMessages,
      model: "gpt-4o-mini",
      maxTokens: 900,
      temperature: 0.4,
      retries: 1,
      details: { movimentos: movimentos.length }
    });
  }

  if (!r.ok) {
    console.error(`[consulta-processo:explicar] OpenAI falhou: ${r.erro}`);
    // Mensagem vista por cliente final — nunca mencionar IA.
    return NextResponse.json(
      { ok: false, mensagem: "Não foi possível gerar agora. Tente novamente em instantes." },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true, texto: r.text });
}
