import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const CRON_SECRET = process.env.CRON_SECRET || "";

interface LogEntry {
  agent_name: string;
  action: string;
  status: "success" | "error" | "skipped" | "blocked";
  details: Record<string, unknown>;
  items_processed: number;
}

interface CheckResult {
  check: string;
  status: "ok" | "warning" | "critical" | "fixed";
  message: string;
  details?: Record<string, unknown>;
}

async function log(
  supabase: ReturnType<typeof createAdminClient>,
  action: string,
  status: LogEntry["status"],
  details: Record<string, unknown>,
  itemsProcessed = 0
) {
  await supabase.from("agent_logs").insert({
    agent_name: "seo_guardian",
    action,
    status,
    details,
    items_processed: itemsProcessed,
  });
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!CRON_SECRET || token !== CRON_SECRET) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const supabase = createAdminClient({ noStore: true });
  const startTime = Date.now();
  const results: CheckResult[] = [];
  let interventions = 0;

  // =========================================================
  // CHECK A: Articles unpublished that were previously published
  // =========================================================
  try {
    const { data: unpublished, error } = await supabase
      .from("blog_articles")
      .select("id, slug, title, status, published_at")
      .not("published_at", "is", null)
      .neq("status", "published");

    if (error) throw error;

    if (unpublished && unpublished.length > 0) {
      // Restore them to published
      const ids = unpublished.map((a) => a.id);
      const { error: updateError } = await supabase
        .from("blog_articles")
        .update({ status: "published" })
        .in("id", ids);

      if (updateError) throw updateError;

      interventions += unpublished.length;

      const restored = unpublished.map((a) => ({
        slug: a.slug,
        title: a.title,
        previousStatus: a.status,
      }));

      await log(
        supabase,
        "restored_unpublished_articles",
        "success",
        {
          count: unpublished.length,
          articles: restored,
          message:
            "Artigos com published_at que estavam fora de published foram restaurados",
        },
        unpublished.length
      );

      results.push({
        check: "unpublished_protection",
        status: "fixed",
        message: `${unpublished.length} artigo(s) restaurado(s) para published`,
        details: { articles: restored },
      });
    } else {
      results.push({
        check: "unpublished_protection",
        status: "ok",
        message: "Nenhum artigo publicado foi despublicado indevidamente",
      });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro desconhecido";
    await log(supabase, "check_unpublished_articles", "error", { error: msg });
    results.push({
      check: "unpublished_protection",
      status: "warning",
      message: `Erro ao verificar artigos despublicados: ${msg}`,
    });
  }

  // =========================================================
  // CHECK B: Articles with empty or very short body (< 100 chars)
  // =========================================================
  try {
    const { data: allArticles, error } = await supabase
      .from("blog_articles")
      .select("id, slug, title, body, status")
      .eq("status", "published");

    if (error) throw error;

    const shortArticles = (allArticles || []).filter(
      (a) => !a.body || a.body.length < 100
    );

    if (shortArticles.length > 0) {
      const flagged = shortArticles.map((a) => ({
        slug: a.slug,
        title: a.title,
        bodyLength: a.body?.length ?? 0,
      }));

      await log(
        supabase,
        "detected_short_articles",
        "skipped",
        {
          count: shortArticles.length,
          articles: flagged,
          message:
            "Artigos com body vazio ou muito curto detectados (nao modificados)",
        },
        shortArticles.length
      );

      results.push({
        check: "short_body_detection",
        status: "warning",
        message: `${shortArticles.length} artigo(s) com body < 100 caracteres`,
        details: { articles: flagged },
      });
    } else {
      results.push({
        check: "short_body_detection",
        status: "ok",
        message: "Todos os artigos publicados tem body adequado",
      });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro desconhecido";
    await log(supabase, "check_short_body", "error", { error: msg });
    results.push({
      check: "short_body_detection",
      status: "warning",
      message: `Erro ao verificar body dos artigos: ${msg}`,
    });
  }

  // =========================================================
  // CHECK C: Duplicate slugs
  // =========================================================
  try {
    const { data: slugRows, error } = await supabase
      .from("blog_articles")
      .select("slug");

    if (error) throw error;

    const slugCounts = new Map<string, number>();
    for (const row of slugRows || []) {
      slugCounts.set(row.slug, (slugCounts.get(row.slug) || 0) + 1);
    }

    const duplicates = Array.from(slugCounts.entries())
      .filter(([, count]) => count > 1)
      .map(([slug, count]) => ({ slug, count }));

    if (duplicates.length > 0) {
      await log(
        supabase,
        "detected_duplicate_slugs",
        "skipped",
        {
          count: duplicates.length,
          duplicates,
          message: "Slugs duplicados encontrados (nao modificados)",
        },
        duplicates.length
      );

      results.push({
        check: "duplicate_slugs",
        status: "warning",
        message: `${duplicates.length} slug(s) duplicado(s) encontrado(s)`,
        details: { duplicates },
      });
    } else {
      results.push({
        check: "duplicate_slugs",
        status: "ok",
        message: "Nenhum slug duplicado",
      });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro desconhecido";
    await log(supabase, "check_duplicate_slugs", "error", { error: msg });
    results.push({
      check: "duplicate_slugs",
      status: "warning",
      message: `Erro ao verificar slugs duplicados: ${msg}`,
    });
  }

  // =========================================================
  // CHECK D: Article count hasn't decreased since last run
  // =========================================================
  try {
    const { count: currentCount, error: countError } = await supabase
      .from("blog_articles")
      .select("id", { count: "exact", head: true })
      .eq("status", "published");

    if (countError) throw countError;

    const total = currentCount ?? 0;

    // Get last known count from agent_configs settings
    const { data: config, error: configError } = await supabase
      .from("agent_configs")
      .select("settings")
      .eq("agent_name", "seo_guardian")
      .single();

    if (configError && configError.code !== "PGRST116") throw configError;

    const lastCount =
      (config?.settings as Record<string, unknown>)?.last_article_count;
    const previousCount =
      typeof lastCount === "number" ? lastCount : null;

    if (previousCount !== null && total < previousCount) {
      const dropped = previousCount - total;

      await log(
        supabase,
        "article_count_dropped",
        "error",
        {
          previousCount,
          currentCount: total,
          dropped,
          severity: "CRITICAL",
          message: `Contagem de artigos CAIU de ${previousCount} para ${total} (-${dropped})`,
        },
        dropped
      );

      results.push({
        check: "article_count",
        status: "critical",
        message: `CRITICAL: contagem de artigos caiu de ${previousCount} para ${total} (-${dropped})`,
        details: { previousCount, currentCount: total, dropped },
      });
    } else {
      const grew =
        previousCount !== null ? total - previousCount : 0;

      results.push({
        check: "article_count",
        status: "ok",
        message:
          previousCount !== null
            ? `Contagem estavel: ${total} artigos publicados (+${grew} desde ultima verificacao)`
            : `Primeira verificacao: ${total} artigos publicados`,
        details: { previousCount, currentCount: total },
      });
    }

    // Store current count in settings for next run
    const currentSettings =
      (config?.settings as Record<string, unknown>) || {};
    const updatedSettings = {
      ...currentSettings,
      last_article_count: total,
      last_count_checked_at: new Date().toISOString(),
    };

    await supabase
      .from("agent_configs")
      .update({ settings: updatedSettings })
      .eq("agent_name", "seo_guardian");
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro desconhecido";
    await log(supabase, "check_article_count", "error", { error: msg });
    results.push({
      check: "article_count",
      status: "warning",
      message: `Erro ao verificar contagem de artigos: ${msg}`,
    });
  }

  // =========================================================
  // UPDATE agent_configs: last_run + total_runs
  // =========================================================
  try {
    const { data: config } = await supabase
      .from("agent_configs")
      .select("total_runs")
      .eq("agent_name", "seo_guardian")
      .single();

    const currentRuns =
      typeof config?.total_runs === "number" ? config.total_runs : 0;

    await supabase
      .from("agent_configs")
      .update({
        last_run: new Date().toISOString(),
        total_runs: currentRuns + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("agent_name", "seo_guardian");
  } catch {
    // Non-fatal: don't block the response
  }

  const durationMs = Date.now() - startTime;

  // Final summary log
  const hasIssues = results.some(
    (r) => r.status === "warning" || r.status === "critical"
  );
  await log(
    supabase,
    "guardian_run_complete",
    hasIssues ? "skipped" : "success",
    {
      durationMs,
      checksPerformed: results.length,
      interventions,
      results,
    },
    interventions
  );

  return NextResponse.json({
    ok: true,
    agent: "seo_guardian",
    durationMs,
    checksPerformed: results.length,
    interventions,
    results,
  });
}
