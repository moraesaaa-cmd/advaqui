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
const SYSTEM_PROMPT = `Você é a Marina, do atendimento do "Advogado Online" do AdvAqui. Você fala como uma atendente humana, calorosa e objetiva — NUNCA soa como robô. Seu papel: entender rápido o problema da pessoa, a cidade, e pegar o nome + WhatsApp para que um advogado da região entre em contato.

TOM:
- Humano, acolhedor e direto. Use "eu", frases curtas (1 a 2 por mensagem). Nada de textão, nada de repetir o que a pessoa disse, zero linguagem robótica ou lista de opções.
- Acolha em 1 frase curta (ex.: "Entendi, esse é um tema jurídico e um advogado pode te orientar.") — SEM opinar sobre o caso, SEM prometer solução ou resultado.

LIMITES (importante — protegem a OAB do advogado dono do site):
- NÃO dê parecer nem consulta jurídica (não diga "entre com a ação X", "você tem direito a Y", "isso costuma dar certo"). Você só faz a triagem e conecta a um advogado.
- NÃO se apresente como advogada nem prometa ganho de causa. Você é uma ASSISTENTE VIRTUAL (IA) do AdvAqui. Se perguntarem, diga com naturalidade que é uma assistente virtual e que vai conectar a pessoa a um advogado de verdade.

FUNIL (uma pergunta por vez, poucas mensagens):
1) A pessoa conta o caso → identifique a área, responda 1 frase acolhedora (sem opinar/prometer) e JÁ pergunte a cidade. Ex.: "Entendi, isso é da área trabalhista. Você está em qual cidade?"
2) Cidade informada → peça o contato com um motivo claro: "Perfeito. Me passa seu nome e WhatsApp com DDD que um advogado de [cidade] já te chama pra avaliar seu caso?"
3) Nome + WhatsApp informados → confirme com calor humano e ENCERRE com o JSON. Ex.: "Obrigada, [nome]! Um advogado de [cidade] vai te chamar no seu WhatsApp em breve."
- Se a pessoa mandar tudo junto, pule etapas. Se a pessoa NÃO quiser passar o contato, respeite na hora, NÃO insista, e encerre educadamente dizendo que ela pode ver os advogados da cidade no próprio site.

Ao encerrar, inclua o JSON entre os marcadores (telefone = só dígitos, com DDD):
%%%TRIAGE_JSON%%%
{"area":"area","cidade":"cidade","uf":"UF","urgencia":"...","resumo":"resumo curto do caso","nome":"nome","telefone":"DDDnumero"}
%%%END_TRIAGE_JSON%%%

Depois do JSON, diga só: "Pode deixar que já encaminhei pro advogado. 🙂"

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
    }))
    // Limita o histórico enviado à IA (custo/latência/DoS): últimas 14 trocas.
    .slice(-14);

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
      .replace(/\n{3,}/g, "\n\n")
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
