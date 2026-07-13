import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth/adminSession";
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
 * VISITANTE REAL = humano NO BRASIL (country='BR'). O AdvAqui é um produto
 * brasileiro; o grosso do tráfego "não-bot" vem de crawlers e scanners de
 * datacenters da China, Hong Kong, Singapura e EUA que mandam User-Agent de
 * navegador (logo escapam do filtro is_bot). Esse tráfego estrangeiro poluía
 * o ranking de cidades com "Beijing, Hong Kong, Singapore" e inflava as
 * contagens. Por isso as métricas de visitante e o ranking de cidade/estado
 * passam a filtrar country='BR'; o tráfego automatizado/exterior é devolvido
 * só em `automated24h` (e top países do exterior) para transparência.
 *
 * Auth: usa o cookie `advaqui_admin_session` (mesmo que o resto do /api/admin).
 * Defensive: se a tabela site_visits não existe (migration 0007 pendente),
 * retorna zeros sem quebrar.
 *
 * Maio/2026 — Fase 4 da Página Profissional AdvAqui.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Auth via cookie HMAC compartilhado com /api/admin (lib/auth/adminSession).

const emptyResponse = {
  ok: true,
  last24h: 0,
  last48h: 0,
  last7d: 0,
  activeNow: 0,
  // Tráfego automatizado (robôs/scanners do exterior) detectado nas últimas
  // 24h — NÃO entra nas contagens de visitantes acima. Mostrado à parte só
  // para transparência (o painel não esconde, mas também não conta como gente).
  automated24h: 0,
  topPaths: [] as Array<{ path: string; count: number }>,
  topCountries: [] as Array<{ country: string; count: number }>,
  topRegions: [] as Array<{ region: string; count: number }>,
  topCities: [] as Array<{ city: string; count: number }>,
  topReferrers: [] as Array<{ source: string; count: number }>,
  // Funil de conversão — eventos sintéticos "/e/{nome}" (cadastro-adv-passo1/
  // passo2/concluido, contato-whatsapp, contato-telefone, assistente-para-cadastro).
  funnel7d: [] as Array<{ event: string; count: number }>,
  funnel24h: [] as Array<{ event: string; count: number }>,
  recent: [] as Array<{
    path: string;
    country: string | null;
    region: string | null;
    city: string | null;
    ip_trunc: string | null;
    visited_at: string;
  }>,
  migrationPending: false
};

export async function GET() {
  if (!isAdminRequest()) {
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
    // Counts paralelos: 24h, 48h, 7d, ativos agora (5min) — só humanos no BR.
    // cAuto24 = tráfego automatizado/exterior em 24h (não-bot, fora do BR),
    // contado à parte só para transparência.
    // Eventos de funil ("/e/…") ficam FORA das contagens de visita — são
    // ações, não pageviews.
    const [c24, c48, c7d, cNow, cAuto24] = await Promise.all([
      admin
        .from("site_visits")
        .select("id", { count: "exact", head: true })
        .eq("is_bot", false)
        .eq("country", "BR")
        .not("path", "like", "/e/%")
        .gte("visited_at", minus24h),
      admin
        .from("site_visits")
        .select("id", { count: "exact", head: true })
        .eq("is_bot", false)
        .eq("country", "BR")
        .not("path", "like", "/e/%")
        .gte("visited_at", minus48h),
      admin
        .from("site_visits")
        .select("id", { count: "exact", head: true })
        .eq("is_bot", false)
        .eq("country", "BR")
        .not("path", "like", "/e/%")
        .gte("visited_at", minus7d),
      admin
        .from("site_visits")
        .select("session_id")
        .eq("is_bot", false)
        .eq("country", "BR")
        .gte("visited_at", minus5min)
        .not("session_id", "is", null)
        .limit(500),
      admin
        .from("site_visits")
        .select("id", { count: "exact", head: true })
        .eq("is_bot", false)
        .or("country.neq.BR,country.is.null")
        .gte("visited_at", minus24h)
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

    // Top páginas / regiões / cidades em 24h — só visitantes humanos no BR.
    const { data: rows24, error: err24 } = await admin
      .from("site_visits")
      .select("path,country,region,city,referer")
      .eq("is_bot", false)
      .eq("country", "BR")
      .gte("visited_at", minus24h)
      .limit(5000);

    // Tráfego automatizado/exterior em 24h — agrupado por país, só para
    // o admin ver de onde vêm os robôs (China, Hong Kong, Singapura, EUA…).
    const { data: foreignRows } = await admin
      .from("site_visits")
      .select("country")
      .eq("is_bot", false)
      .or("country.neq.BR,country.is.null")
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
    const topPaths = aggregate(
      (safeRows as Array<Record<string, string | null>>).filter(
        (r) => !(r.path || "").startsWith("/e/")
      ),
      "path"
    ).map((x) => ({
      path: x.key,
      count: x.count
    }));

    // Funil de conversão — conta os eventos "/e/{nome}" (humanos, qualquer
    // país: eventos são raros e importam um a um). O sufixo depois do nome
    // (ex.: slug do advogado) é agrupado no evento-mãe.
    const [{ data: ev7 }, { data: ev24 }] = await Promise.all([
      admin
        .from("site_visits")
        .select("path")
        .eq("is_bot", false)
        .like("path", "/e/%")
        .gte("visited_at", minus7d)
        .limit(5000),
      admin
        .from("site_visits")
        .select("path")
        .eq("is_bot", false)
        .like("path", "/e/%")
        .gte("visited_at", minus24h)
        .limit(5000)
    ]);
    const groupEvents = (rows: Array<{ path: string | null }> | null) => {
      const m = new Map<string, number>();
      for (const r of rows || []) {
        const name = (r.path || "").split("/")[2] || "";
        if (!name) continue;
        m.set(name, (m.get(name) || 0) + 1);
      }
      return Array.from(m.entries())
        .map(([event, count]) => ({ event, count }))
        .sort((a, b) => b.count - a.count);
    };
    const funnel7d = groupEvents(ev7 as Array<{ path: string | null }> | null);
    const funnel24h = groupEvents(ev24 as Array<{ path: string | null }> | null);
    // Países do exterior (tráfego automatizado) — não são visitantes reais,
    // exibidos só para o admin saber a origem dos robôs.
    const topCountries = aggregate(
      (foreignRows || []) as Array<Record<string, string | null>>,
      "country"
    ).map((x) => ({
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

    // Origem do tráfego (de onde vieram): classifica o referer.
    //   vazio → "Direto"; advaqui.com → interno (ignorado); resto → host.
    const refCounts = new Map<string, number>();
    for (const r of safeRows as Array<Record<string, string | null>>) {
      const raw = r.referer || "";
      let label: string | null;
      if (!raw) {
        label = "Direto";
      } else {
        try {
          label = new URL(raw).hostname.replace(/^www\./, "");
        } catch {
          label = raw;
        }
        if (label && label.includes("advaqui")) label = null;
      }
      if (!label) continue;
      refCounts.set(label, (refCounts.get(label) || 0) + 1);
    }
    const topReferrers = Array.from(refCounts.entries())
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Últimas 20 visitas — só visitantes humanos no Brasil (feed ao vivo
    // real, sem o ruído de robôs estrangeiros batendo no site toda hora).
    const { data: recentData } = await admin
      .from("site_visits")
      .select("path,country,region,city,ip_trunc,visited_at")
      .eq("is_bot", false)
      .eq("country", "BR")
      .order("visited_at", { ascending: false })
      .limit(20);

    return NextResponse.json({
      ok: true,
      last24h: c24.count || 0,
      last48h: c48.count || 0,
      last7d: c7d.count || 0,
      activeNow: activeSessionIds.size,
      automated24h: cAuto24.count || 0,
      topPaths,
      topCountries,
      topRegions,
      topCities,
      topReferrers,
      funnel7d,
      funnel24h,
      recent: recentData || [],
      migrationPending: false
    });
  } catch (err) {
    console.warn("[admin:analytics] failed", err);
    return NextResponse.json({ ...emptyResponse, migrationPending: true });
  }
}
