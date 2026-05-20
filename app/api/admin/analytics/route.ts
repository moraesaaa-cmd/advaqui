import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/analytics
 *
 * Retorna agregados de pageviews pro dashboard do admin:
 *   • last24h, last48h, last7d — contagem total de visitas humanas
 *   • activeNow — visitantes únicos (session_id) nos últimos 5 min
 *   • topPaths — páginas mais visitadas em 24h
 *   • topCountries — países com mais visitas em 24h
 *   • topRegions — estados (UF) com mais visitas em 24h
 *   • recent — últimas 20 visitas (path, country, region, city, ago)
 *
 * Bots (is_bot=true) são EXCLUÍDOS dos agregados — só conta humanos.
 *
 * Auth: usa o cookie `advaqui_admin` (mesmo que o resto do /api/admin).
 * Defensive: se a tabela site_visits não existe (migration 0007 pendente),
 * retorna zeros sem quebrar.
 *
 * Maio/2026 — Fase 4 da Página Profissional AdvAqui.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const isAdmin = (): boolean => {
  const c = cookies().get("advaqui_admin");
  return c?.value === "1";
};

const emptyResponse = {
  ok: true,
  last24h: 0,
  last48h: 0,
  last7d: 0,
  activeNow: 0,
  topPaths: [] as Array<{ path: string; count: number }>,
  topCountries: [] as Array<{ country: string; count: number }>,
  topRegions: [] as Array<{ region: string; count: number }>,
  topCities: [] as Array<{ city: string; count: number }>,
  recent: [] as Array<{
    path: string;
    country: string | null;
    region: string | null;
    city: string | null;
    visited_at: string;
  }>,
  migrationPending: false
};

export async function GET() {
  if (!isAdmin()) {
    return NextResponse.json(
      { ok: false, error: "Não autorizado" },
      { status: 401 }
    );
  }

  const admin = createAdminClient();
  const now = Date.now();
  const minus24h = new Date(now - 24 * 60 * 60 * 1000).toISOString();
  const minus48h = new Date(now - 48 * 60 * 60 * 1000).toISOString();
  const minus7d = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
  const minus5min = new Date(now - 5 * 60 * 1000).toISOString();

  try {
    // Counts paralelos: 24h, 48h, 7d, ativos agora (5min)
    const [c24, c48, c7d, cNow] = await Promise.all([
      admin
        .from("site_visits")
        .select("id", { count: "exact", head: true })
        .eq("is_bot", false)
        .gte("visited_at", minus24h),
      admin
        .from("site_visits")
        .select("id", { count: "exact", head: true })
        .eq("is_bot", false)
        .gte("visited_at", minus48h),
      admin
        .from("site_visits")
        .select("id", { count: "exact", head: true })
        .eq("is_bot", false)
        .gte("visited_at", minus7d),
      admin
        .from("site_visits")
        .select("session_id")
        .eq("is_bot", false)
        .gte("visited_at", minus5min)
        .not("session_id", "is", null)
        .limit(500)
    ]);

    // Se a tabela não existe, qualquer um desses retorna erro 42P01
    const tableMissing =
      (c24.error && /relation .+ does not exist/i.test(c24.error.message)) ||
      (c48.error && /relation .+ does not exist/i.test(c48.error.message)) ||
      (c7d.error && /relation .+ does not exist/i.test(c7d.error.message));

    if (tableMissing) {
      return NextResponse.json({ ...emptyResponse, migrationPending: true });
    }

    const activeSessionIds = new Set(
      (cNow.data || [])
        .map((r: { session_id: string | null }) => r.session_id)
        .filter(Boolean)
    );

    // Top páginas / países / regiões em 24h
    const { data: rows24, error: err24 } = await admin
      .from("site_visits")
      .select("path,country,region,city")
      .eq("is_bot", false)
      .gte("visited_at", minus24h)
      .limit(5000);

    const aggregate = (
      arr: Array<Record<string, string | null>>,
      key: string
    ): Array<{ key: string; count: number }> => {
      const counts = new Map<string, number>();
      for (const r of arr) {
        const v = r[key];
        if (!v) continue;
        counts.set(v, (counts.get(v) || 0) + 1);
      }
      return Array.from(counts.entries())
        .map(([k, count]) => ({ key: k, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    };

    const safeRows = err24 ? [] : (rows24 || []);
    const topPaths = aggregate(safeRows, "path").map((x) => ({
      path: x.key,
      count: x.count
    }));
    const topCountries = aggregate(safeRows, "country").map((x) => ({
      country: x.key,
      count: x.count
    }));
    const topRegions = aggregate(safeRows, "region").map((x) => ({
      region: x.key,
      count: x.count
    }));
    const topCities = aggregate(safeRows, "city").map((x) => ({
      city: x.key,
      count: x.count
    }));

    // Últimas 20 visitas
    const { data: recentData } = await admin
      .from("site_visits")
      .select("path,country,region,city,visited_at")
      .eq("is_bot", false)
      .order("visited_at", { ascending: false })
      .limit(20);

    return NextResponse.json({
      ok: true,
      last24h: c24.count || 0,
      last48h: c48.count || 0,
      last7d: c7d.count || 0,
      activeNow: activeSessionIds.size,
      topPaths,
      topCountries,
      topRegions,
      topCities,
      recent: recentData || [],
      migrationPending: false
    });
  } catch (err) {
    console.warn("[admin:analytics] failed", err);
    return NextResponse.json({ ...emptyResponse, migrationPending: true });
  }
}
