import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const CRON_SECRET = process.env.CRON_SECRET || "";

// Após 3 falhas de análise, o lead é marcado com metadata.ai_skip=true e sai
// da fila — evita que um lead problemático bloqueie os demais para sempre.
const MAX_AI_ATTEMPTS = 3;

interface LeadAnalysis {
  resumo: string;
  area: string;
  score: number;
  proxima_acao: string;
}

async function analyzeLead(lead: {
  nome: string | null;
  area_juridica: string | null;
  resumo: string | null;
  cidade: string | null;
  uf: string | null;
  ferramenta: string | null;
}): Promise<{ analysis: LeadAnalysis; tokensUsed: number }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY nao configurada");

  const systemPrompt =
    "Voce e um assistente juridico do AdvAqui. Analise o lead e retorne JSON com: " +
    "resumo (1-2 frases resumindo o caso), " +
    "area (area juridica mais provavel), " +
    "score (0-100 indicando qualidade/urgencia do lead), " +
    "proxima_acao (sugestao de proxima acao para o atendente)";

  const leadData = [
    lead.nome && `Nome: ${lead.nome}`,
    lead.area_juridica && `Area juridica informada: ${lead.area_juridica}`,
    lead.resumo && `Resumo do caso: ${lead.resumo}`,
    lead.cidade && `Cidade: ${lead.cidade}`,
    lead.uf && `UF: ${lead.uf}`,
    lead.ferramenta && `Ferramenta utilizada: ${lead.ferramenta}`,
  ]
    .filter(Boolean)
    .join("\n");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: leadData || "Lead sem dados preenchidos" },
      ],
      max_tokens: 500,
      temperature: 0.3,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenAI retornou resposta vazia");

  const tokensUsed =
    (data.usage?.prompt_tokens || 0) + (data.usage?.completion_tokens || 0);

  const parsed = JSON.parse(content) as LeadAnalysis;

  return { analysis: parsed, tokensUsed };
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!CRON_SECRET || token !== CRON_SECRET) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const startTime = Date.now();
  const supabase = createAdminClient({ noStore: true });

  // Fetch unanalyzed leads — qualquer status. (O lead-matcher pode marcar
  // 'qualificado' antes da análise; exigir status='novo' deixava esses leads
  // sem ai_resumo para sempre.) Leads com metadata.ai_skip ficam fora da fila.
  const { data: rawLeads, error: fetchError } = await supabase
    .from("leads")
    .select("id, nome, area_juridica, resumo, cidade, uf, ferramenta, metadata")
    .is("ai_resumo", null)
    .order("created_at", { ascending: true })
    .limit(30);

  if (fetchError) {
    await supabase.from("agent_logs").insert({
      agent_name: "lead_analyzer",
      action: "fetch_leads",
      status: "error",
      details: { error: fetchError.message },
    });
    return NextResponse.json(
      { ok: false, error: fetchError.message },
      { status: 500 }
    );
  }

  // Filtra os que já esgotaram as tentativas (metadata.ai_skip) e limita o lote.
  const leads = (rawLeads ?? [])
    .filter((l) => {
      const meta = (l.metadata ?? {}) as Record<string, unknown>;
      return meta.ai_skip !== true;
    })
    .slice(0, 10);

  if (leads.length === 0) {
    await supabase.from("agent_logs").insert({
      agent_name: "lead_analyzer",
      action: "run",
      status: "skipped",
      details: { reason: "Nenhum lead pendente de análise" },
      items_processed: 0,
      duration_ms: Date.now() - startTime,
    });
    return NextResponse.json({
      ok: true,
      message: "Nenhum lead pendente de análise",
      analyzed: 0,
    });
  }

  // Registra a falha de análise no metadata do lead; na 3ª tentativa marca
  // ai_skip para o lead sair da fila (evita head-of-line blocking).
  const registerFailure = async (lead: {
    id: string;
    metadata: Record<string, unknown> | null;
  }): Promise<void> => {
    const meta =
      lead.metadata && typeof lead.metadata === "object"
        ? (lead.metadata as Record<string, unknown>)
        : {};
    const previous = typeof meta.ai_attempts === "number" ? meta.ai_attempts : 0;
    const attempts = previous + 1;
    const newMeta: Record<string, unknown> = { ...meta, ai_attempts: attempts };
    if (attempts >= MAX_AI_ATTEMPTS) newMeta.ai_skip = true;

    const { error: metaError } = await supabase
      .from("leads")
      .update({ metadata: newMeta })
      .eq("id", lead.id);

    if (metaError) {
      console.error(
        "[cron:lead-analysis] failure bookkeeping failed:",
        lead.id,
        metaError.message
      );
    }
  };

  let totalTokens = 0;
  let analyzed = 0;
  let failed = 0;
  const results: Array<{
    ok: boolean;
    leadId: string;
    score?: number;
    error?: string;
  }> = [];

  for (const lead of leads) {
    try {
      const { analysis, tokensUsed } = await analyzeLead(lead);
      totalTokens += tokensUsed;

      const score = Math.max(0, Math.min(100, Math.round(analysis.score)));

      let prioridade: string | undefined;
      if (score >= 90) {
        prioridade = "urgente";
      } else if (score >= 70) {
        prioridade = "alta";
      }

      const { error: updateError } = await supabase
        .from("leads")
        .update({
          ai_resumo: analysis.resumo,
          ai_area: analysis.area,
          ai_score: score,
          proxima_acao: analysis.proxima_acao,
          ...(prioridade ? { prioridade } : {}),
        })
        .eq("id", lead.id);

      if (updateError) {
        console.error(
          "[cron:lead-analysis] update lead failed:",
          lead.id,
          updateError.message
        );
        await supabase.from("agent_logs").insert({
          agent_name: "lead_analyzer",
          action: "update_lead",
          status: "error",
          details: { lead_id: lead.id, error: updateError.message },
        });
        await registerFailure(lead);
        results.push({ ok: false, leadId: lead.id, error: updateError.message });
        failed++;
        continue;
      }

      await supabase.from("agent_logs").insert({
        agent_name: "lead_analyzer",
        action: "analyze_lead",
        status: "success",
        details: {
          lead_id: lead.id,
          score,
          area: analysis.area,
          prioridade: prioridade || "normal",
        },
        items_processed: 1,
        tokens_used: tokensUsed,
      });

      results.push({ ok: true, leadId: lead.id, score });
      analyzed++;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erro desconhecido";

      console.error("[cron:lead-analysis] analyze failed:", lead.id, errorMsg);
      await supabase.from("agent_logs").insert({
        agent_name: "lead_analyzer",
        action: "analyze_lead",
        status: "error",
        details: { lead_id: lead.id, error: errorMsg },
      });
      await registerFailure(lead);

      results.push({ ok: false, leadId: lead.id, error: errorMsg });
      failed++;
    }
  }

  const durationMs = Date.now() - startTime;

  // Estimate cost: gpt-4o-mini input $0.15/1M, output $0.60/1M, avg ~$0.0003/1K tokens
  const estimatedCost = (totalTokens / 1000) * 0.0003;

  // Update agent_configs counters
  const { data: config } = await supabase
    .from("agent_configs")
    .select("total_runs, total_tokens, total_cost")
    .eq("agent_name", "lead_analyzer")
    .single();

  await supabase
    .from("agent_configs")
    .update({
      last_run: new Date().toISOString(),
      total_runs: (config?.total_runs || 0) + 1,
      total_tokens: (config?.total_tokens || 0) + totalTokens,
      total_cost: Number(config?.total_cost || 0) + estimatedCost,
      updated_at: new Date().toISOString(),
    })
    .eq("agent_name", "lead_analyzer");

  // Log the overall run
  await supabase.from("agent_logs").insert({
    agent_name: "lead_analyzer",
    action: "run_complete",
    status: failed === leads.length ? "error" : "success",
    details: {
      total_leads: leads.length,
      analyzed,
      failed,
    },
    items_processed: analyzed,
    tokens_used: totalTokens,
    cost_usd: estimatedCost,
    duration_ms: durationMs,
  });

  return NextResponse.json({
    ok: true,
    analyzed,
    failed,
    totalTokens,
    durationMs,
    results,
  });
}
