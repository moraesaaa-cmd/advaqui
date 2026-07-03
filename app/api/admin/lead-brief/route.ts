import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth/adminSession";
import { createAdminClient } from "@/lib/supabase/admin";
import { callAI, type ChatMessage } from "@/lib/ai/core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * POST /api/admin/lead-brief — gera, para um lead específico:
 *   • resumo curto do caso (reusa ai_resumo do cron lead-analysis se já existir)
 *   • rascunho de mensagem de WhatsApp pronto para o admin enviar ao lead
 *
 * Body: { leadId: string } → { ok, resumo, whatsappDraft }
 *
 * Auth: cookie HMAC de admin (isAdminRequest), mesmo padrão de /api/admin.
 * Modelo: gpt-5.4-mini (max_completion_tokens) → fallback gpt-4o-mini,
 * mesmo padrão de chat/triage e cron/moderate-signups.
 *
 * Se o lead ainda não tinha ai_resumo, o resumo gerado aqui é persistido na
 * coluna ai_resumo (mesma que o cron usa — sem duplicar coluna nova).
 */

type Payload = { leadId?: string };

type Brief = { resumo: string; whatsappDraft: string };

export async function POST(req: Request) {
  if (!isAdminRequest()) {
    return NextResponse.json(
      { ok: false, error: "Não autorizado" },
      { status: 401 }
    );
  }

  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Requisição inválida" },
      { status: 400 }
    );
  }

  const leadId = typeof body.leadId === "string" ? body.leadId.trim() : "";
  if (!leadId) {
    return NextResponse.json(
      { ok: false, error: "leadId obrigatório" },
      { status: 400 }
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "OPENAI_API_KEY não configurada" },
      { status: 503 }
    );
  }

  const supabase = createAdminClient({ noStore: true });
  const { data: lead, error: fetchError } = await supabase
    .from("leads")
    .select(
      "id, nome, telefone, cidade, uf, area_juridica, resumo, ferramenta, origem, ai_resumo, ai_area, proxima_acao"
    )
    .eq("id", leadId)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json(
      { ok: false, error: fetchError.message },
      { status: 500 }
    );
  }
  if (!lead) {
    return NextResponse.json(
      { ok: false, error: "Lead não encontrado" },
      { status: 404 }
    );
  }

  const primeiroNome = (lead.nome || "").trim().split(/\s+/)[0] || "";

  const systemPrompt =
    "Você é o assistente interno da equipe do AdvAqui (diretório jurídico brasileiro). " +
    "Recebe os dados de um lead (pessoa que pediu contato no site) e retorna APENAS um JSON com dois campos:\n" +
    '  "resumo": 1-2 frases, em português, resumindo o caso do lead para o atendente ler rápido;\n' +
    '  "whatsappDraft": mensagem curta e cordial de WhatsApp que a EQUIPE DO ADVAQUI enviará ao lead.\n' +
    "Regras obrigatórias do whatsappDraft:\n" +
    `- Comece com "Olá${primeiroNome ? ", " + primeiroNome : ""}!" e se apresente como equipe do AdvAqui.\n` +
    "- Mencione que recebemos o contato dele sobre o tema/área e, se souber, a cidade.\n" +
    "- NUNCA prometa resultado, êxito, ganho de causa, prazo garantido ou qualquer garantia.\n" +
    "- NUNCA mencione inteligência artificial, IA, robô ou automação.\n" +
    "- Tom humano, respeitoso e direto; no máximo 4 frases curtas; sem emojis excessivos (no máximo 1).\n" +
    "- Termine perguntando a disponibilidade da pessoa para conversar (ex.: qual o melhor horário).";

  const leadData = [
    lead.nome && `Nome: ${lead.nome}`,
    lead.area_juridica && `Área jurídica: ${lead.area_juridica}`,
    lead.ai_area && `Área identificada na triagem interna: ${lead.ai_area}`,
    lead.resumo && `Relato do lead: ${lead.resumo}`,
    lead.ai_resumo && `Resumo já existente (triagem interna): ${lead.ai_resumo}`,
    lead.cidade && `Cidade: ${lead.cidade}`,
    lead.uf && `UF: ${lead.uf}`,
    (lead.origem || lead.ferramenta) &&
      `Origem no site: ${lead.origem || lead.ferramenta}`
  ]
    .filter(Boolean)
    .join("\n");

  const chatMessages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: leadData || "Lead sem dados preenchidos" }
  ];

  // Camada central (lib/ai/core.ts): modelo novo primeiro, fallback pro antigo;
  // timeout/custo/log em agent_logs.
  let r = await callAI({
    feature: "admin_lead_brief",
    action: "brief",
    messages: chatMessages,
    model: "gpt-5.4-mini",
    maxTokens: 600,
    json: true,
    retries: 0,
    log: false
  });
  if (!r.ok) {
    console.error(`[admin:lead-brief] gpt-5.4-mini falhou (${r.erro}) — fallback gpt-4o-mini`);
    r = await callAI({
      feature: "admin_lead_brief",
      action: "brief",
      messages: chatMessages,
      model: "gpt-4o-mini",
      maxTokens: 600,
      temperature: 0.3,
      json: true,
      retries: 1,
      details: { lead_id: leadId }
    });
  }

  if (!r.ok) {
    console.error(`[admin:lead-brief] OpenAI falhou: ${r.erro}`);
    return NextResponse.json(
      { ok: false, error: "Falha ao gerar mensagem (OpenAI)." },
      { status: 502 }
    );
  }

  const content = r.text;

  let brief: Brief;
  try {
    const parsed = JSON.parse(content) as Partial<Brief>;
    if (
      typeof parsed.resumo !== "string" ||
      typeof parsed.whatsappDraft !== "string" ||
      !parsed.resumo.trim() ||
      !parsed.whatsappDraft.trim()
    ) {
      throw new Error("campos ausentes");
    }
    brief = {
      resumo: parsed.resumo.trim(),
      whatsappDraft: parsed.whatsappDraft.trim()
    };
  } catch {
    console.error(
      `[admin:lead-brief] resposta sem JSON válido (${content.slice(0, 300)})`
    );
    return NextResponse.json(
      { ok: false, error: "Resposta da geração inválida. Tente de novo." },
      { status: 502 }
    );
  }

  // Persiste o resumo na coluna do cron (só se ainda não havia) — assim o
  // card já mostra o resumo em recarregamentos futuros sem custo extra.
  if (!lead.ai_resumo) {
    const { error: updateError } = await supabase
      .from("leads")
      .update({ ai_resumo: brief.resumo })
      .eq("id", leadId);
    if (updateError) {
      console.warn(
        `[admin:lead-brief] falha ao salvar ai_resumo: ${updateError.message}`
      );
    }
  }

  return NextResponse.json({
    ok: true,
    resumo: brief.resumo,
    whatsappDraft: brief.whatsappDraft
  });
}
