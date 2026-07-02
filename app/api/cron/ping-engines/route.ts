import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const CRON_SECRET = process.env.CRON_SECRET || "";
const SITE_URL = "https://advaqui.com";

const KEY_PAGES = [
  SITE_URL,
  `${SITE_URL}/advogados`,
  `${SITE_URL}/ferramentas`,
  `${SITE_URL}/planos`,
  `${SITE_URL}/para-advogados`,
  `${SITE_URL}/blog`,
  `${SITE_URL}/problemas-juridicos`,
  `${SITE_URL}/calculadoras`,
  `${SITE_URL}/glossario`,
  `${SITE_URL}/jurisprudencia`,
  `${SITE_URL}/guias`,
  `${SITE_URL}/modelos`,
  `${SITE_URL}/quanto-custa`,
  `${SITE_URL}/triagem`,
  `${SITE_URL}/diagnostico`,
  `${SITE_URL}/recurso-de-multa`,
];

type PingResult = { target: string; ok: boolean; status: number };

async function submitIndexNow(
  key: string,
  urls: string[]
): Promise<PingResult> {
  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: "advaqui.com",
        key,
        keyLocation: `${SITE_URL}/${key}.txt`,
        urlList: urls,
      }),
      signal: AbortSignal.timeout(15000),
    });
    return { target: "indexnow", ok: res.ok || res.status === 202, status: res.status };
  } catch {
    return { target: "indexnow", ok: false, status: 0 };
  }
}

async function submitBingIndexNow(
  key: string,
  urls: string[]
): Promise<PingResult> {
  try {
    const res = await fetch("https://www.bing.com/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: "advaqui.com",
        key,
        keyLocation: `${SITE_URL}/${key}.txt`,
        urlList: urls,
      }),
      signal: AbortSignal.timeout(15000),
    });
    return { target: "bing-indexnow", ok: res.ok || res.status === 202, status: res.status };
  } catch {
    return { target: "bing-indexnow", ok: false, status: 0 };
  }
}

async function submitYandexIndexNow(
  key: string,
  urls: string[]
): Promise<PingResult> {
  try {
    const res = await fetch("https://yandex.com/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: "advaqui.com",
        key,
        keyLocation: `${SITE_URL}/${key}.txt`,
        urlList: urls,
      }),
      signal: AbortSignal.timeout(15000),
    });
    return { target: "yandex-indexnow", ok: res.ok || res.status === 202, status: res.status };
  } catch {
    return { target: "yandex-indexnow", ok: false, status: 0 };
  }
}

async function submitNaverIndexNow(
  key: string,
  urls: string[]
): Promise<PingResult> {
  try {
    const res = await fetch("https://searchadvisor.naver.com/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: "advaqui.com",
        key,
        keyLocation: `${SITE_URL}/${key}.txt`,
        urlList: urls,
      }),
      signal: AbortSignal.timeout(15000),
    });
    return { target: "naver-indexnow", ok: res.ok || res.status === 202, status: res.status };
  } catch {
    return { target: "naver-indexnow", ok: false, status: 0 };
  }
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!CRON_SECRET || token !== CRON_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();
  const results: PingResult[] = [];

  const indexNowKey = process.env.INDEXNOW_KEY;
  if (!indexNowKey) {
    const durationMs = Date.now() - startTime;
    const supabase = createAdminClient({ noStore: true });
    await supabase.from("agent_logs").insert({
      agent_name: "ping_engines",
      action: "ping_sitemaps",
      status: "skipped",
      details: { reason: "INDEXNOW_KEY não configurada no .env.local" },
      items_processed: 0,
      duration_ms: durationMs,
    });
    return NextResponse.json({
      ok: true,
      message: "INDEXNOW_KEY não configurada — configure no .env.local do VPS",
      succeeded: 0,
      failed: 0,
      durationMs,
    });
  }

  const submissions = await Promise.allSettled([
    submitIndexNow(indexNowKey, KEY_PAGES),
    submitBingIndexNow(indexNowKey, KEY_PAGES),
    submitYandexIndexNow(indexNowKey, KEY_PAGES),
    submitNaverIndexNow(indexNowKey, KEY_PAGES),
  ]);

  for (const s of submissions) {
    results.push(s.status === "fulfilled" ? s.value : { target: "unknown", ok: false, status: 0 });
  }

  const succeeded = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;
  const durationMs = Date.now() - startTime;

  const supabase = createAdminClient({ noStore: true });
  await supabase.from("agent_logs").insert({
    agent_name: "ping_engines",
    action: "indexnow_submit",
    status: succeeded > 0 ? "success" : "error",
    details: { succeeded, failed, urls_submitted: KEY_PAGES.length, results },
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
