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
 * Geolocalização best-effort do IP do visitante.
 *
 * Usada como fallback quando o proxy não envia headers de geo (caso do
 * Nginx no VPS). Consulta a API gratuita ip-api.com (sem chave) com
 * timeout curto e cache em memória por IP — assim a maioria das visitas
 * não dispara chamada externa e respeitamos o rate limit (45/min).
 *
 * Precisão: resolve pelo IP COMPLETO. Geolocalizar o IP já truncado (.0)
 * devolve a localização registrada do bloco /24 — tipicamente a capital ou
 * a matriz da operadora, não a cidade real do visitante. O IP completo é
 * usado apenas aqui, em memória; no banco gravamos somente a versão
 * truncada /24. Resolve no máximo até cidade/UF, nunca um endereço exato.
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
    const timer = setTimeout(() => ctrl.abort(), 3000);
    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,countryCode,regionName,city`,
      { signal: ctrl.signal, headers: { "User-Agent": "advaqui/1.0" } }
    );
    clearTimeout(timer);
    if (!res.ok) return fallback;
    const j = (await res.json()) as {
      status?: string;
      countryCode?: string;
      regionName?: string;
      city?: string;
    };
    const geo =
      j && j.status === "success"
        ? {
            country: j.countryCode || null,
            region: j.regionName || null,
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
  // IP completo do cliente (1º da cadeia XFF) — usado SÓ para geolocalizar,
  // nunca persistido. No banco gravamos apenas a versão truncada /24 (ipTrunc).
  const ipFull = xff.split(",")[0].trim();
  const ipTrunc = truncateIp(xff);

  // Geo: usa os headers do proxy se existirem; senão geolocaliza pelo IP
  // COMPLETO (precisão de cidade) — best-effort, com cache + timeout, nunca
  // quebra o tracking. Só o IP truncado /24 vai pro banco.
  let geoCountry = country ? country.slice(0, 4) : null;
  let geoRegion = region ? region.slice(0, 32) : null;
  let geoCity = city ? city.slice(0, 80) : null;
  if (!geoCountry && !geoRegion && !geoCity && ipFull && !isBot) {
    const g = await geolocate(ipFull);
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
