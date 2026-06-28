import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Rate limit — 10 mensagens / sessão (in-memory com TTL de 30 min)
// ---------------------------------------------------------------------------
const SESSION_TTL_MS = 30 * 60 * 1000;
const MAX_MESSAGES_PER_SESSION = 10;
const sessions = new Map<string, { count: number; ts: number }>();

let lastCleanup = Date.now();
function cleanupSessions() {
  const now = Date.now();
  if (now - lastCleanup < 5 * 60_000) return;
  lastCleanup = now;
  for (const [id, entry] of sessions) {
    if (now - entry.ts > SESSION_TTL_MS) sessions.delete(id);
  }
}

function isRateLimited(sessionId: string): boolean {
  cleanupSessions();
  const now = Date.now();
  const entry = sessions.get(sessionId);
  if (!entry || now - entry.ts > SESSION_TTL_MS) {
    sessions.set(sessionId, { count: 1, ts: now });
    return false;
  }
  entry.count += 1;
  entry.ts = now;
  return entry.count > MAX_MESSAGES_PER_SESSION;
}

// ---------------------------------------------------------------------------
// System prompt — triagem jurídica AdvAqui
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT = `Assistente de triagem do AdvAqui (diretório de advogados). Objetivo: identificar a área jurídica e a cidade do visitante em NO MÁXIMO 2 trocas de mensagem.

REGRAS:
- NUNCA dê conselho jurídico. Só triagem.
- Respostas de 1 a 2 frases. Seja direto, sem rodeios.
- Não repita o que o visitante disse. Não faça introduções.
- Português brasileiro, tom direto e acolhedor.

FLUXO RÁPIDO:
1. Visitante descreve situação → Você identifica a área e pergunta APENAS a cidade. Exemplo: "Entendi, isso é área trabalhista. Em qual cidade você está?"
2. Visitante informa cidade → Encerre a triagem IMEDIATAMENTE com o JSON abaixo. Não faça mais perguntas.

Se o visitante já informar cidade na primeira mensagem, encerre na primeira resposta.

Ao encerrar, inclua o JSON entre marcadores:
%%%TRIAGE_JSON%%%
{"area":"area","cidade":"cidade","uf":"UF","urgencia":"dias","resumo":"resumo curto"}
%%%END_TRIAGE_JSON%%%

Após o JSON, diga apenas: "Triagem informativa — procure um advogado para orientação."

Áreas: trabalhista, família, criminal, previdenciário, consumidor, imobiliário, tributário, empresarial, trânsito, saúde, ambiental, administrativo, civil, digital, eleitoral, internacional, contratual, inventário, outro.`;

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("[chat:triage] OPENAI_API_KEY não configurada");
    return NextResponse.json(
      { ok: false, error: "Serviço temporariamente indisponível." },
      { status: 503 }
    );
  }

  // Parse body
  let body: { messages?: Array<{ role: string; content: string }>; sessionId?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { ok: false, error: "JSON inválido." },
      { status: 400 }
    );
  }

  const { messages, sessionId } = body;

  if (!sessionId || typeof sessionId !== "string") {
    return NextResponse.json(
      { ok: false, error: "sessionId é obrigatório." },
      { status: 422 }
    );
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { ok: false, error: "messages é obrigatório e deve conter ao menos 1 item." },
      { status: 422 }
    );
  }

  // Rate limit por sessão
  if (isRateLimited(sessionId)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Você atingiu o limite de mensagens desta conversa. Atualize a página para iniciar uma nova."
      },
      { status: 429 }
    );
  }

  // Sanitize messages — keep only role + content, limit content length
  const sanitized = messages
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content.slice(0, 1000)
    }));

  if (sanitized.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Nenhuma mensagem válida." },
      { status: 422 }
    );
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...sanitized
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[chat:triage] OpenAI ${response.status}: ${errText}`);
      return NextResponse.json(
        { ok: false, error: "Erro ao processar. Tente novamente." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    const usage = data.usage;

    if (usage) {
      console.log(
        `[chat:triage] tokens — prompt: ${usage.prompt_tokens}, completion: ${usage.completion_tokens}, total: ${usage.total_tokens}`
      );
    }

    // Extract triage JSON if present
    let triage: {
      area?: string;
      cidade?: string;
      uf?: string;
      urgencia?: string;
      resumo?: string;
    } | null = null;

    const jsonMatch = content.match(
      /%%%TRIAGE_JSON%%%([\s\S]*?)%%%END_TRIAGE_JSON%%%/
    );
    if (jsonMatch?.[1]) {
      try {
        triage = JSON.parse(jsonMatch[1].trim());
      } catch {
        // JSON malformado — ignora silenciosamente
      }
    }

    // Clean the response: remove the JSON markers from the display message
    const displayContent = content
      .replace(/%%%TRIAGE_JSON%%%[\s\S]*?%%%END_TRIAGE_JSON%%%/, "")
      .trim();

    return NextResponse.json({
      ok: true,
      message: displayContent,
      triage,
      usage: usage
        ? {
            prompt_tokens: usage.prompt_tokens,
            completion_tokens: usage.completion_tokens,
            total_tokens: usage.total_tokens
          }
        : null
    });
  } catch (err) {
    console.error("[chat:triage] exception", err);
    return NextResponse.json(
      { ok: false, error: "Erro interno. Tente novamente." },
      { status: 500 }
    );
  }
}
