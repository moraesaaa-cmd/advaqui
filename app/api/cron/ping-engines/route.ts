import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const CRON_SECRET = process.env.CRON_SECRET || "";
const SITE_URL = "https://advaqui.com";

const SITEMAPS = [
  `${SITE_URL}/sitemap.xml`,
  `${SITE_URL}/sitemap-advogados/sitemap.xml`,
  `${SITE_URL}/sitemap-artigos/sitemap.xml`,
  `${SITE_URL}/sitemap-problemas-cidades/sitemap.xml`,
];

const PING_TARGETS = [
  (url: string) => `https://www.google.com/ping?sitemap=${encodeURIComponent(url)}`,
  (url: string) => `https://www.bing.com/ping?sitemap=${encodeURIComponent(url)}`,
  (url: string) => `http://www.google.com/webmasters/sitemaps/ping?sitemap=${encodeURIComponent(url)}`,
];

async function pingUrl(url: string): Promise<{ url: string; ok: boolean; status: number }> {
  try {
    const res = await fetch(url, { method: "GET", signal: AbortSignal.timeout(10000) });
    return { url, ok: res.ok, status: res.status };
  } catch {
    return { url, ok: false, status: 0 };
  }
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!CRON_SECRET || token !== CRON_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();
  const results: Array<{ url: string; ok: boolean; status: number }> = [];

  for (const sitemap of SITEMAPS) {
    for (const buildUrl of PING_TARGETS) {
      const pingResult = await pingUrl(buildUrl(sitemap));
      results.push(pingResult);
    }
  }

  // IndexNow para Bing/Yandex — notifica URLs recentes
  const indexNowKey = process.env.INDEXNOW_KEY;
  if (indexNowKey) {
    try {
      const res = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host: "advaqui.com",
          key: indexNowKey,
          keyLocation: `${SITE_URL}/${indexNowKey}.txt`,
          urlList: [
            SITE_URL,
            `${SITE_URL}/advogados`,
            `${SITE_URL}/ferramentas`,
            `${SITE_URL}/planos`,
            `${SITE_URL}/para-advogados`,
            `${SITE_URL}/blog`,
            `${SITE_URL}/problemas-juridicos`,
          ],
        }),
      });
      results.push({ url: "indexnow", ok: res.ok, status: res.status });
    } catch {
      results.push({ url: "indexnow", ok: false, status: 0 });
    }
  }

  const succeeded = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;
  const durationMs = Date.now() - startTime;

  const supabase = createAdminClient();
  await supabase.from("agent_logs").insert({
    agent_name: "ping_engines",
    action: "ping_sitemaps",
    status: failed === results.length ? "error" : "success",
    details: { succeeded, failed, results },
    items_processed: succeeded,
    duration_ms: durationMs,
  });

  const { data: config } = await supabase
    .from("agent_configs")
    .select("total_runs")
    .eq("agent_name", "ping_engines")
    .single();

  if (config) {
    await supabase
      .from("agent_configs")
      .update({
        last_run: new Date().toISOString(),
        total_runs: (config.total_runs || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("agent_name", "ping_engines");
  }

  return NextResponse.json({ ok: true, succeeded, failed, durationMs, results });
}
