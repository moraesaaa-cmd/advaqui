import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/track
 *
 * Recebe um pageview do client-side e grava em public.site_visits.
 *
 * Body: { path: string, referer?: string, sessionId?: string }
 *
 * Privacidade:
 *   • IP truncado pra /24 (último octeto zerado) — LGPD-friendly, anônimo
 *   • Sem cookies, sem fingerprint, sem identificadores persistentes
 *   • sessionId é gerado no client (32 chars aleatórios) e expira ao fechar aba
 *   • Bots conhecidos são marcados (is_bot=true) mas ainda contados
 *
 * Defensive: se a tabela não existe (migration 0007 pendente), responde 204
 * silenciosamente — não quebra a página do usuário.
 *
 * Maio/2026 — Fase 4 da Página Profissional AdvAqui.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Lista mínima de bots conhecidos pra marcar com is_bot=true.
// Mantida curta — não é antispam, é só pra excluir do dashboard de "humanos".
const BOT_PATTERNS = [
  /googlebot/i,
  /bingbot/i,
  /yandexbot/i,
  /duckduckbot/i,
  /baiduspider/i,
  /facebookexternalhit/i,
  /twitterbot/i,
  /whatsapp/i,
  /telegrambot/i,
  /slurp/i,
  /applebot/i,
  /linkedinbot/i,
  /crawler/i,
  /spider/i,
  /bot\b/i
];

function classifyUA(ua: string): { isBot: boolean; label: string } {
  if (!ua) return { isBot: false, label: "unknown" };
  if (BOT_PATTERNS.some((re) => re.test(ua))) return { isBot: true, label: "bot" };
  if (/mobile|iphone|android/i.test(ua)) return { isBot: false, label: "mobile" };
  if (/tablet|ipad/i.test(ua)) return { isBot: false, label: "tablet" };
  return { isBot: false, label: "desktop" };
}

function truncateIp(ip: string): string {
  // IPv4 → último octeto zerado. IPv6 → mantém só os primeiros 4 grupos.
  if (!ip) return "";
  const cleaned = ip.split(",")[0].trim();
  if (cleaned.includes(":")) {
    // IPv6
    const groups = cleaned.split(":");
    return groups.slice(0, 4).join(":") + "::0";
  }
  const parts = cleaned.split(".");
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
  return "";
}

/**
 * Geolocalização best-effort do IP truncado (/24).
 *
 * Usada como fallback quando o proxy não envia headers de geo (caso do
 * Nginx no VPS). Consulta a API gratuita ipwho.is (HTTPS, sem chave) com
 * timeout curto e cache em memória por IP — assim a maioria das visitas
 * não dispara chamada externa e respeitamos o rate limit.
 *
 * Privacidade: geolocaliza o IP JÁ truncado (último octeto zerado), então
 * resolve no máximo até cidade/estado, nunca um endereço exato.
 *
 * Nunca lança: em qualquer falha/timeout retorna nulos e o insert segue.
 */
const geoCache = new Map<
  string,
  { country: string | null; region: string | null; city: string | null }
>();

async function geolocate(ip: string) {
  const fallback = { country: null, region: null, city: null };
  if (!ip || /^(10\.|127\.|0\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/.test(ip)) {
    return fallback;
  }
  const cached = geoCache.get(ip);
  if (cached) return cached;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 1500);
    const res = await fetch(
      `https://ipwho.is/${ip}?fields=success,country_code,region,city`,
      { signal: ctrl.signal }
    );
    clearTimeout(timer);
    if (!res.ok) return fallback;
    const j = (await res.json()) as {
      success?: boolean;
      country_code?: string;
      region?: string;
      city?: string;
    };
    const geo = j && j.success
      ? {
          country: j.country_code || null,
          region: j.region || null,
          city: j.city || null
        }
      : fallback;
    if (geoCache.size > 5000) geoCache.clear();
    geoCache.set(ip, geo);
    return geo;
  } catch {
    return fallback;
  }
}

export async function POST(req: Request) {
  let body: { path?: string; referer?: string; sessionId?: string };
  try {
    body = (await req.json()) as { path?: string; referer?: string; sessionId?: string };
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const path = typeof body.path === "string" ? body.path.slice(0, 250) : "";
  if (!path || !path.startsWith("/")) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const referer =
    typeof body.referer === "string"
      ? body.referer.split("?")[0].slice(0, 250) // sem query string
      : null;
  const sessionId =
    typeof body.sessionId === "string" && body.sessionId.length <= 64
      ? body.sessionId
      : null;

  const ua = req.headers.get("user-agent") || "";
  const { isBot, label } = classifyUA(ua);

  // Geo via headers (Cloudflare, Vercel, etc — quem suportar). Fallback null.
  const country =
    req.headers.get("cf-ipcountry") ||
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("x-geo-country") ||
    null;
  const region =
    req.headers.get("cf-region-code") ||
    req.headers.get("x-vercel-ip-country-region") ||
    req.headers.get("x-geo-region") ||
    null;
  const city =
    req.headers.get("cf-ipcity") ||
    req.headers.get("x-vercel-ip-city") ||
    req.headers.get("x-geo-city") ||
    null;

  const xff =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "";
  const ipTrunc = truncateIp(xff);

  // Geo: usa os headers do proxy se existirem; senão geolocaliza o IP /24
  // (best-effort, com cache + timeout — nunca quebra o tracking).
  let geoCountry = country ? country.slice(0, 4) : null;
  let geoRegion = region ? region.slice(0, 32) : null;
  let geoCity = city ? city.slice(0, 80) : null;
  if (!geoCountry && !geoRegion && !geoCity && ipTrunc && !isBot) {
    const g = await geolocate(ipTrunc);
    geoCountry = g.country ? g.country.slice(0, 4) : null;
    geoRegion = g.region ? g.region.slice(0, 32) : null;
    geoCity = g.city ? g.city.slice(0, 80) : null;
  }

  try {
    const admin = createAdminClient();
    const { error } = await admin.from("site_visits").insert({
      path,
      referer,
      session_id: sessionId,
      country: geoCountry,
      region: geoRegion,
      city: geoCity,
      user_agent_short: label,
      ip_trunc: ipTrunc || null,
      is_bot: isBot
    });

    if (error) {
      // Tabela não existe ainda — ignora silenciosamente
      if (/relation .+ does not exist/i.test(error.message)) {
        return new NextResponse(null, { status: 204 });
      }
      // Outros erros: log mas não quebra UX
      console.warn("[track] insert failed", error.message);
      return new NextResponse(null, { status: 204 });
    }
  } catch (err) {
    console.warn("[track] exception", err);
    return new NextResponse(null, { status: 204 });
  }

  return new NextResponse(null, { status: 204 });
}
