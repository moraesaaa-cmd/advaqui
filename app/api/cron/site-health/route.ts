import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const CRON_SECRET = process.env.CRON_SECRET || "";
const SITE_URL = "https://advaqui.com";

const KEY_PAGES = [
  "/",
  "/advogados",
  "/ferramentas",
  "/planos",
  "/para-advogados",
  "/blog",
  "/problemas-juridicos",
  "/calculadoras",
  "/glossario",
  "/jurisprudencia",
  "/guias",
  "/modelos",
  "/quanto-custa",
  "/triagem",
  "/diagnostico",
  "/recurso-de-multa",
  "/divorcio",
  "/previdencia",
  "/imobiliario",
  "/seguro-desemprego",
  "/montar-peticao",
  "/correcao-monetaria",
  "/atualizar-valor",
  "/calculadora-prazos",
  "/processos",
  "/criar-perfil",
  "/cadastro",
  "/lp/advogado-premium",
  "/sobre",
  "/faq",
  "/termos",
  "/privacidade",
  "/advogados/sp/sao-paulo",
  "/advogados/rj/rio-de-janeiro",
  "/advogados/mg/belo-horizonte",
  "/advogados/sp/sao-paulo/trabalhista",
  "/sitemap.xml",
];

type CheckResult = {
  path: string;
  status: number;
  ok: boolean;
  hasTitle: boolean;
  responseTimeMs: number;
};

async function checkPage(path: string): Promise<CheckResult> {
  const url = `${SITE_URL}${path}`;
  const start = Date.now();
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": "AdvAqui-SiteHealth/1.0" },
      signal: AbortSignal.timeout(15000),
      redirect: "follow",
    });
    const responseTimeMs = Date.now() - start;
    let hasTitle = true;

    if (res.ok && !path.endsWith(".xml")) {
      const html = await res.text();
      hasTitle = /<title[^>]*>.+<\/title>/i.test(html);
    }

    return { path, status: res.status, ok: res.ok, hasTitle, responseTimeMs };
  } catch {
    return { path, status: 0, ok: false, hasTitle: false, responseTimeMs: Date.now() - start };
  }
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!CRON_SECRET || token !== CRON_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();
  const results: CheckResult[] = [];

  const batchSize = 5;
  for (let i = 0; i < KEY_PAGES.length; i += batchSize) {
    const batch = KEY_PAGES.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(batch.map(checkPage));
    for (const r of batchResults) {
      if (r.status === "fulfilled") results.push(r.value);
    }
  }

  const healthy = results.filter((r) => r.ok);
  const broken = results.filter((r) => !r.ok);
  const slow = results.filter((r) => r.ok && r.responseTimeMs > 3000);
  const missingTitle = results.filter((r) => r.ok && !r.hasTitle && !r.path.endsWith(".xml"));
  const avgResponseTime = Math.round(
    results.reduce((sum, r) => sum + r.responseTimeMs, 0) / results.length
  );

  const durationMs = Date.now() - startTime;
  const supabase = createAdminClient({ noStore: true });

  await supabase.from("agent_logs").insert({
    agent_name: "site_health",
    action: "health_check",
    status: broken.length > 0 ? "warning" : "success",
    details: {
      total_pages: results.length,
      healthy: healthy.length,
      broken: broken.map((r) => ({ path: r.path, status: r.status })),
      slow: slow.map((r) => ({ path: r.path, ms: r.responseTimeMs })),
      missing_title: missingTitle.map((r) => r.path),
      avg_response_ms: avgResponseTime,
    },
    items_processed: results.length,
    duration_ms: durationMs,
  });

  const { data: config } = await supabase
    .from("agent_configs")
    .select("total_runs")
    .eq("agent_name", "site_health")
    .single();

  if (config) {
    await supabase
      .from("agent_configs")
      .update({
        last_run: new Date().toISOString(),
        total_runs: (config.total_runs || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("agent_name", "site_health");
  }

  return NextResponse.json({
    ok: true,
    summary: {
      total: results.length,
      healthy: healthy.length,
      broken: broken.length,
      slow: slow.length,
      missingTitle: missingTitle.length,
      avgResponseMs: avgResponseTime,
    },
    broken: broken.map((r) => ({ path: r.path, status: r.status })),
    slow: slow.map((r) => ({ path: r.path, ms: r.responseTimeMs })),
    durationMs,
  });
}
