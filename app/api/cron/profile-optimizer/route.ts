import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const CRON_SECRET = process.env.CRON_SECRET || "";

interface ProfileSuggestion {
  completeness: number;
  suggestions: string[];
  summary_suggestion: string;
  priority: "alta" | "media" | "baixa";
}

async function analyzeProfile(lawyer: {
  name: string;
  short_summary?: string | null;
  bio: string | null;
  specialties: string[] | null;
  target_city: string | null;
  target_uf: string | null;
  phone: string | null;
  whatsapp: string | null;
  website: string | null;
  plan_status: string | null;
}): Promise<{ suggestion: ProfileSuggestion; tokensUsed: number }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY nao configurada");

  const fields = [
    `Nome: ${lawyer.name}`,
    `Resumo: ${lawyer.short_summary || "(vazio)"}`,
    `Bio: ${lawyer.bio || "(vazio)"}`,
    `Especialidades: ${(lawyer.specialties || []).join(", ") || "(nenhuma)"}`,
    `Cidade: ${lawyer.target_city || "(vazio)"}, UF: ${lawyer.target_uf || ""}`,
    `Telefone: ${lawyer.phone ? "preenchido" : "vazio"}`,
    `WhatsApp: ${lawyer.whatsapp ? "preenchido" : "vazio"}`,
    `Site: ${lawyer.website ? "preenchido" : "vazio"}`,
    `Plano: ${lawyer.plan_status || "free"}`,
  ].join("\n");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Voce analisa perfis de advogados no AdvAqui e sugere melhorias para atrair mais clientes. " +
            "Retorne JSON com: completeness (0-100), suggestions (lista de ate 3 sugestoes curtas e praticas), " +
            "summary_suggestion (resumo profissional sugerido, max 160 chars), " +
            'priority ("alta" se completeness < 40, "media" se < 70, "baixa" se >= 70). ' +
            "Foque em: headline atrativa, bio com experiencia, especialidades claras, canais de contato.",
        },
        { role: "user", content: fields },
      ],
      max_tokens: 400,
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
  if (!content) throw new Error("Resposta vazia da OpenAI");

  const tokensUsed =
    (data.usage?.prompt_tokens || 0) + (data.usage?.completion_tokens || 0);

  return { suggestion: JSON.parse(content), tokensUsed };
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!CRON_SECRET || token !== CRON_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();
  const supabase = createAdminClient();

  const { data: lawyers, error: fetchError } = await supabase
    .from("lawyers")
    .select("id, name, short_summary, bio, specialties, target_city, target_uf, phone, whatsapp, website, plan_status")
    .is("profile_score", null)
    .order("created_at", { ascending: true })
    .limit(10);

  if (fetchError) {
    await supabase.from("agent_logs").insert({
      agent_name: "profile_optimizer",
      action: "fetch_lawyers",
      status: "error",
      details: { error: fetchError.message },
    });
    return NextResponse.json({ ok: false, error: fetchError.message }, { status: 500 });
  }

  if (!lawyers || lawyers.length === 0) {
    await supabase.from("agent_logs").insert({
      agent_name: "profile_optimizer",
      action: "run",
      status: "skipped",
      details: { reason: "Nenhum perfil novo para analisar" },
      items_processed: 0,
      duration_ms: Date.now() - startTime,
    });
    return NextResponse.json({ ok: true, message: "Nenhum perfil novo", optimized: 0 });
  }

  let optimized = 0;
  let totalTokens = 0;

  for (const lawyer of lawyers) {
    try {
      const { suggestion, tokensUsed } = await analyzeProfile(lawyer);
      totalTokens += tokensUsed;

      await supabase
        .from("lawyers")
        .update({
          profile_score: suggestion.completeness,
          profile_suggestions: suggestion.suggestions,
          ...((!lawyer.short_summary && suggestion.summary_suggestion)
            ? { short_summary: suggestion.summary_suggestion }
            : {}),
        })
        .eq("id", lawyer.id);

      await supabase.from("agent_logs").insert({
        agent_name: "profile_optimizer",
        action: "optimize_profile",
        status: "success",
        details: {
          lawyer_id: lawyer.id,
          lawyer_name: lawyer.name,
          completeness: suggestion.completeness,
          priority: suggestion.priority,
          suggestions_count: suggestion.suggestions.length,
        },
        items_processed: 1,
        tokens_used: tokensUsed,
      });

      optimized++;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erro desconhecido";
      await supabase.from("agent_logs").insert({
        agent_name: "profile_optimizer",
        action: "optimize_profile",
        status: "error",
        details: { lawyer_id: lawyer.id, error: errorMsg },
      });
    }
  }

  const durationMs = Date.now() - startTime;
  const estimatedCost = (totalTokens / 1000) * 0.0003;

  const { data: config } = await supabase
    .from("agent_configs")
    .select("total_runs, total_tokens, total_cost")
    .eq("agent_name", "profile_optimizer")
    .single();

  if (config) {
    await supabase
      .from("agent_configs")
      .update({
        last_run: new Date().toISOString(),
        total_runs: (config.total_runs || 0) + 1,
        total_tokens: (config.total_tokens || 0) + totalTokens,
        total_cost: Number(config.total_cost || 0) + estimatedCost,
        updated_at: new Date().toISOString(),
      })
      .eq("agent_name", "profile_optimizer");
  }

  await supabase.from("agent_logs").insert({
    agent_name: "profile_optimizer",
    action: "run_complete",
    status: "success",
    details: { total: lawyers.length, optimized, totalTokens },
    items_processed: optimized,
    tokens_used: totalTokens,
    cost_usd: estimatedCost,
    duration_ms: durationMs,
  });

  return NextResponse.json({ ok: true, optimized, totalTokens, durationMs });
}
