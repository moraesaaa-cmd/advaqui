import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const AGENT_NAME = "content_monitor";
const CRON_SECRET = process.env.CRON_SECRET || "";

export async function GET(req: NextRequest) {
  const start = Date.now();

  const token = req.nextUrl.searchParams.get("token");
  if (!CRON_SECRET || token !== CRON_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  try {
    // ── 1. Load previous run count from agent_configs ──────────────
    const { data: config } = await supabase
      .from("agent_configs")
      .select("settings, total_runs, total_tokens, total_cost")
      .eq("agent_name", AGENT_NAME)
      .single();

    const previousCount: number =
      (config?.settings as Record<string, unknown>)?.last_total_articles as number ?? 0;

    // ── 2. Count total published articles ──────────────────────────
    const { count: totalArticles } = await supabase
      .from("blog_articles")
      .select("*", { count: "exact", head: true })
      .eq("status", "published");

    const total = totalArticles ?? 0;

    // ── 3. Articles with reading_minutes < 4 (short content) ──────
    const { data: shortArticles } = await supabase
      .from("blog_articles")
      .select("id, slug, title, reading_minutes")
      .eq("status", "published")
      .lt("reading_minutes", 4);

    const shortList = shortArticles ?? [];

    // ── 4. Articles without FAQ section ────────────────────────────
    const { data: allPublished } = await supabase
      .from("blog_articles")
      .select("id, slug, title, body")
      .eq("status", "published");

    const missingFaq = (allPublished ?? []).filter((a) => {
      const lower = (a.body ?? "").toLowerCase();
      return !lower.includes("perguntas frequentes");
    });

    // ── 5. Articles published in last 24h ──────────────────────────
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { count: newIn24h } = await supabase
      .from("blog_articles")
      .select("*", { count: "exact", head: true })
      .eq("status", "published")
      .gte("published_at", twentyFourHoursAgo);

    const recentCount = newIn24h ?? 0;

    // ── 6. Calculate content health score (0-100) ──────────────────
    let score = 100;

    // Penalize short articles: -3 pts each, max -30
    score -= Math.min(shortList.length * 3, 30);

    // Penalize missing FAQ: -2 pts each, max -30
    score -= Math.min(missingFaq.length * 2, 30);

    // Penalize article count drop (possible deletions)
    if (previousCount > 0 && total < previousCount) {
      score -= Math.min((previousCount - total) * 5, 20);
    }

    // Bonus for fresh content
    if (recentCount > 0) {
      score = Math.min(score + 5, 100);
    }

    // Penalize if total is very low (under 10)
    if (total > 0 && total < 10) {
      score -= 10;
    }

    score = Math.max(0, Math.min(100, score));

    // ── 7. Determine overall status ────────────────────────────────
    let overallStatus: "ok" | "warning" | "error" | "critical" = "ok";
    if (score < 50) overallStatus = "critical";
    else if (score < 70) overallStatus = "error";
    else if (score < 85) overallStatus = "warning";

    // ── 8. Store findings in site_audits ───────────────────────────
    const auditDetails = {
      total_articles: total,
      previous_total: previousCount,
      new_in_24h: recentCount,
      short_articles_count: shortList.length,
      short_articles: shortList.map((a) => ({
        slug: a.slug,
        title: a.title,
        reading_minutes: a.reading_minutes,
      })),
      missing_faq_count: missingFaq.length,
      missing_faq: missingFaq.slice(0, 20).map((a) => ({
        slug: a.slug,
        title: a.title,
      })),
      content_health_score: score,
    };

    await supabase.from("site_audits").insert({
      audit_type: "content",
      status: overallStatus,
      details: auditDetails,
    });

    // ── 9. Log to agent_logs ───────────────────────────────────────
    const durationMs = Date.now() - start;

    await supabase.from("agent_logs").insert({
      agent_name: AGENT_NAME,
      action: "content_audit",
      status: "success",
      items_processed: total,
      duration_ms: durationMs,
      details: {
        total_articles: total,
        new_in_24h: recentCount,
        short_articles_count: shortList.length,
        missing_faq_count: missingFaq.length,
        content_health_score: score,
      },
    });

    // ── 10. Update agent_configs ───────────────────────────────────
    const prevSettings = (config?.settings ?? {}) as Record<string, unknown>;

    await supabase
      .from("agent_configs")
      .update({
        last_run: new Date().toISOString(),
        total_runs: (config as { total_runs?: number } | null)?.total_runs
          ? ((config as { total_runs: number }).total_runs + 1)
          : 1,
        settings: {
          ...prevSettings,
          last_total_articles: total,
          last_health_score: score,
          last_short_count: shortList.length,
          last_missing_faq_count: missingFaq.length,
        },
        updated_at: new Date().toISOString(),
      })
      .eq("agent_name", AGENT_NAME);

    // ── Response ───────────────────────────────────────────────────
    return NextResponse.json({
      ok: true,
      total_articles: total,
      new_in_24h: recentCount,
      short_articles_count: shortList.length,
      missing_faq_count: missingFaq.length,
      content_health_score: score,
      status: overallStatus,
      duration_ms: durationMs,
    });
  } catch (err) {
    const durationMs = Date.now() - start;

    await supabase.from("agent_logs").insert({
      agent_name: AGENT_NAME,
      action: "content_audit",
      status: "error",
      duration_ms: durationMs,
      details: { error: err instanceof Error ? err.message : "Unknown error" },
    });

    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
