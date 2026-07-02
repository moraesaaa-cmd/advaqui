import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const CRON_SECRET = process.env.CRON_SECRET || "";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!CRON_SECRET || token !== CRON_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();
  const supabase = createAdminClient({ noStore: true });

  const { data: leads, error: fetchError } = await supabase
    .from("leads")
    .select("id, area_juridica, ai_area, cidade, uf, resumo, ai_resumo")
    .eq("status", "novo")
    .is("matched_lawyer_id", null)
    .order("created_at", { ascending: true })
    .limit(20);

  if (fetchError) {
    await supabase.from("agent_logs").insert({
      agent_name: "lead_matcher",
      action: "fetch_leads",
      status: "error",
      details: { error: fetchError.message },
    });
    return NextResponse.json({ ok: false, error: fetchError.message }, { status: 500 });
  }

  if (!leads || leads.length === 0) {
    await supabase.from("agent_logs").insert({
      agent_name: "lead_matcher",
      action: "run",
      status: "skipped",
      details: { reason: "Nenhum lead novo para cruzar" },
      items_processed: 0,
      duration_ms: Date.now() - startTime,
    });
    return NextResponse.json({ ok: true, message: "Nenhum lead novo", matched: 0 });
  }

  // Pool de advogados buscado uma única vez (o filtro por UF é feito em JS,
  // com fallback target_uf → uf e target_city → city_name do cadastro —
  // target_* só existe preenchido para premium, o que esvaziava o pool).
  const { data: lawyers, error: lawyersError } = await supabase
    .from("lawyers")
    .select("id, name, slug, target_city, target_uf, city_name, uf, specialties, plan_status")
    .eq("verified_oab", true)
    .limit(200);

  if (lawyersError) {
    console.error("[cron:lead-matcher] fetch lawyers failed:", lawyersError.message);
    await supabase.from("agent_logs").insert({
      agent_name: "lead_matcher",
      action: "fetch_lawyers",
      status: "error",
      details: { error: lawyersError.message },
    });
    return NextResponse.json({ ok: false, error: lawyersError.message }, { status: 500 });
  }

  let matched = 0;

  for (const lead of leads) {
    const area = lead.ai_area || lead.area_juridica || "";
    const cidade = (lead.cidade || "").trim();
    const uf = (lead.uf || "").trim().toUpperCase();

    if (!area && !cidade) continue;
    if (!lawyers || lawyers.length === 0) continue;

    const areaLower = area.toLowerCase();
    const cidadeLower = cidade.toLowerCase();

    const scored = lawyers
      .map((l) => {
        // Fallback: área de atuação declarada (premium) ou cidade/UF do cadastro
        const effectiveUf = ((l.target_uf || l.uf || "") as string).trim().toUpperCase();
        const effectiveCity = ((l.target_city || l.city_name || "") as string).trim().toLowerCase();

        let score = 0;
        const specs = Array.isArray(l.specialties) ? l.specialties : [];

        if (areaLower && specs.some((s: string) => s.toLowerCase().includes(areaLower) || areaLower.includes(s.toLowerCase()))) {
          score += 50;
        }

        if (cidadeLower && effectiveCity === cidadeLower) score += 30;

        if (l.plan_status === "active") score += 20;

        return { lawyer: l, score, effectiveUf };
      })
      .filter((s) => !uf || s.effectiveUf === uf)
      .filter((s) => s.score >= 30)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    if (scored.length === 0) continue;

    const topMatch = scored[0].lawyer;

    const { error: updateError } = await supabase
      .from("leads")
      .update({
        matched_lawyer_id: topMatch.id,
        status: "qualificado",
      })
      .eq("id", lead.id);

    if (updateError) {
      // Antes o erro era engolido — a CHECK de status derrubava 100% dos
      // updates em silêncio. Agora todo updateError vira log.
      console.error("[cron:lead-matcher] update lead failed:", lead.id, updateError.message);
      await supabase.from("agent_logs").insert({
        agent_name: "lead_matcher",
        action: "match_lead",
        status: "error",
        details: {
          lead_id: lead.id,
          lawyer_id: topMatch.id,
          error: updateError.message,
        },
      });
    } else {
      matched++;
      await supabase.from("agent_logs").insert({
        agent_name: "lead_matcher",
        action: "match_lead",
        status: "success",
        details: {
          lead_id: lead.id,
          lawyer_id: topMatch.id,
          lawyer_name: topMatch.name,
          score: scored[0].score,
          candidates: scored.length,
        },
        items_processed: 1,
      });
    }
  }

  const durationMs = Date.now() - startTime;

  await supabase.from("agent_logs").insert({
    agent_name: "lead_matcher",
    action: "run_complete",
    status: "success",
    details: { total_leads: leads.length, matched },
    items_processed: matched,
    duration_ms: durationMs,
  });

  const { data: config } = await supabase
    .from("agent_configs")
    .select("total_runs")
    .eq("agent_name", "lead_matcher")
    .single();

  if (config) {
    await supabase
      .from("agent_configs")
      .update({
        last_run: new Date().toISOString(),
        total_runs: (config.total_runs || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("agent_name", "lead_matcher");
  }

  return NextResponse.json({ ok: true, matched, total: leads.length, durationMs });
}
