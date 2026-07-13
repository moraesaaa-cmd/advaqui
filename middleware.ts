import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import citiesData from "@/data/cities.json";
import { SPECIALTIES } from "@/lib/data/specialties";

/* ---------------------------------------------------------------------------
 * 404 REAL para lixo estrutural nas famílias públicas.
 *
 * As páginas dinâmicas (force-dynamic/ISR) chamam notFound(), mas neste Next
 * 14.2 self-hosted o throw acontece com o stream já aberto e o status sai 200
 * (soft-404) — só as rotas com dynamicParams=false emitem 404 do roteador.
 * O corte é feito AQUI, antes do render: cidade/UF/área/tribunal inexistentes
 * respondem 404 de verdade para usuário e buscador. As dimensões de CONTEÚDO
 * (termo do glossário, artigo, serviço etc.) e de BANCO (perfil de advogado)
 * seguem com a defesa das próprias páginas (corpo de não-encontrado + noindex).
 *
 * Dados usados são pequenos e ESTÁVEIS (IBGE 5.571 cidades + 15 áreas) —
 * zero risco de 404 acidental em conteúdo novo.
 * ------------------------------------------------------------------------- */
type CityRow = { s: string; u: string };
const CITY_KEYS = new Set(
  (citiesData as CityRow[]).map((c) => `${c.u.toLowerCase()}:${c.s}`)
);
const UF_SET = new Set((citiesData as CityRow[]).map((c) => c.u.toLowerCase()));
const AREA_SET = new Set(SPECIALTIES.map((s) => s.slug));

const cityOk = (uf: string, slug: string) =>
  CITY_KEYS.has(`${uf.toLowerCase()}:${slug.toLowerCase()}`);
const cityUfOk = (param: string) => {
  const m = param.match(/^(.+)-([a-z]{2})$/i);
  return !!m && cityOk(m[2], m[1]);
};

const RE_ADVOGADOS_ESP = /^\/advogados\/([a-z]{2})\/([^/]+)\/([^/]+)\/?$/i;
const RE_ADVOGADOS_CIDADE = /^\/advogados\/([a-z]{2})\/([^/]+)\/?$/i;
const RE_ADVOGADOS_UF = /^\/advogados\/([a-z]{2})\/?$/i;
const RE_ADVOGADOS_DE_EM = /^\/advogados-de\/([^/]+)\/em\/([^/]+)\/?$/;
const RE_EM_CIDADE =
  /^\/(?:glossario|blog|guias|modelos|problemas-juridicos|quanto-custa|calculadoras)\/[^/]+\/em\/([^/]+)\/?$/;
const RE_JURIS_TEMA_EM = /^\/jurisprudencia\/(?:stf|stj)\/tema\/[^/]+\/em\/([^/]+)\/?$/;
const RE_UF_CIDADE = /^\/(?:tribunais|para-advogados|recurso-de-multa)\/([a-z]{2})\/([^/]+)\/?$/i;
const RE_JURIS_TRIBUNAL = /^\/jurisprudencia\/([^/]+)\/?$/;

function publicPathInvalid(pathname: string): boolean {
  let m = pathname.match(RE_ADVOGADOS_ESP);
  if (m) return !cityOk(m[1], m[2]) || !AREA_SET.has(m[3].toLowerCase());
  m = pathname.match(RE_ADVOGADOS_CIDADE);
  if (m) return !cityOk(m[1], m[2]);
  m = pathname.match(RE_ADVOGADOS_UF);
  if (m) return !UF_SET.has(m[1].toLowerCase());
  m = pathname.match(RE_ADVOGADOS_DE_EM);
  if (m) return !AREA_SET.has(m[1].toLowerCase()) || !cityUfOk(m[2]);
  m = pathname.match(RE_EM_CIDADE);
  if (m) return !cityUfOk(m[1]);
  m = pathname.match(RE_JURIS_TEMA_EM);
  if (m) return !cityUfOk(m[1]);
  m = pathname.match(RE_UF_CIDADE);
  if (m) return !UF_SET.has(m[1].toLowerCase()) || !cityOk(m[1], m[2]);
  m = pathname.match(RE_JURIS_TRIBUNAL);
  if (m) return m[1].toLowerCase() !== "stf" && m[1].toLowerCase() !== "stj";
  return false;
}

const NOT_FOUND_HTML = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Página não encontrada — AdvAqui</title><style>body{font-family:system-ui,-apple-system,sans-serif;background:#F7F6F1;color:#1A2433;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0}main{text-align:center;padding:32px;max-width:420px}h1{font-family:Georgia,serif;font-size:46px;margin:0 0 10px}p{color:#5A6678;line-height:1.5;margin:0 0 22px}a{display:inline-block;background:#0F1B2D;color:#fff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:600}</style></head><body><main><h1>404</h1><p>Esta página não existe ou o endereço está incompleto. Confira o link ou volte para o início.</p><a href="/">Ir para a página inicial</a></main></body></html>`;

/* Perfil de advogado é dado de BANCO — validação com cache em memória:
 * um SELECT de todos os slugs (tabela pequena, colunas públicas via RLS) a
 * cada 60s; slug fora do cache paga UMA consulta direta antes do 404, então
 * perfil recém-criado nunca é bloqueado. Qualquer falha de rede = fail-open
 * (jamais 404 indevido em perfil real). */
const RE_ADVOGADO_PERFIL = /^\/advogado\/([^/]+)\/?$/;
let lawyerSlugCache: { set: Set<string>; at: number } | null = null;

function supabaseRestHeaders(key: string): Record<string, string> {
  return { apikey: key, authorization: `Bearer ${key}` };
}

async function fetchLawyerSlugs(): Promise<Set<string> | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  try {
    const r = await fetch(`${url}/rest/v1/lawyers?select=slug&limit=5000`, {
      headers: supabaseRestHeaders(key),
      cache: "no-store"
    });
    if (!r.ok) return null;
    const rows = (await r.json()) as Array<{ slug?: string }>;
    return new Set(
      rows.map((x) => (x.slug || "").toLowerCase()).filter(Boolean)
    );
  } catch {
    return null;
  }
}

async function lawyerSlugMissing(slug: string): Promise<boolean> {
  const now = Date.now();
  if (!lawyerSlugCache || now - lawyerSlugCache.at > 60_000) {
    const set = await fetchLawyerSlugs();
    if (set) lawyerSlugCache = { set, at: now };
  }
  const cached = lawyerSlugCache;
  if (!cached) return false; // sem cache utilizável → fail-open
  if (cached.set.has(slug.toLowerCase())) return false;
  // Miss: confirma direto no banco (cobre perfil criado nos últimos 60s).
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return false;
  try {
    const r = await fetch(
      `${url}/rest/v1/lawyers?select=slug&slug=eq.${encodeURIComponent(slug)}&limit=1`,
      { headers: supabaseRestHeaders(key), cache: "no-store" }
    );
    if (!r.ok) return false;
    const rows = (await r.json()) as unknown[];
    if (rows.length > 0) {
      cached.set.add(slug.toLowerCase());
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Renova a sessao do Supabase (refresh do access_token) a cada request das
 * rotas autenticadas do advogado, reescrevendo os cookies na resposta.
 *
 * Sem isto, quando o access_token expira (~1h) nenhuma rota renova o cookie:
 * o painel passa a mostrar "Sessao expirada. Faca login novamente." mesmo
 * havendo refresh_token valido. Corrige o achado de auth (ausencia de
 * middleware) que causava deslogamento silencioso e friccao de retencao.
 *
 * Escopo restrito a /painel e /api/painel: nao toca paginas publicas
 * (force-dynamic) nem o cookie HMAC do admin.
 */
export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;

  // www → non-www: canonical 301 (SEO — evita conteúdo duplicado)
  if (host.startsWith("www.")) {
    const u = request.nextUrl.clone();
    u.host = host.replace(/^www\./, "");
    return NextResponse.redirect(u, 301);
  }

  // Subdomínio multas.advaqui.com → serve a landing do recurso de multa
  // (/multas) no MESMO app. Só a raiz é reescrita; /multas, /api, /_next e
  // assets passam direto. Público de trânsito ≠ diretório de advogados.
  if (host.startsWith("multas.")) {
    if (pathname === "/") {
      const u = request.nextUrl.clone();
      u.pathname = "/multas";
      return NextResponse.rewrite(u);
    }
    return NextResponse.next();
  }

  // 404 real pré-render para caminhos públicos estruturalmente inválidos
  // (cidade/UF/área/tribunal que não existem na base).
  if (request.method === "GET" && publicPathInvalid(pathname)) {
    return new NextResponse(NOT_FOUND_HTML, {
      status: 404,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "x-robots-tag": "noindex",
        "cache-control": "public, max-age=300"
      }
    });
  }

  // Perfil de advogado inexistente → 404 real (slugs do banco com cache 60s).
  if (request.method === "GET") {
    const pm = pathname.match(RE_ADVOGADO_PERFIL);
    if (pm && (await lawyerSlugMissing(pm[1]))) {
      return new NextResponse(NOT_FOUND_HTML, {
        status: 404,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "x-robots-tag": "noindex",
          "cache-control": "public, max-age=60"
        }
      });
    }
  }

  // Fora de /painel e /api/painel não há o que renovar — evita rodar o
  // Supabase no resto (ex.: "/", incluído no matcher só para o subdomínio).
  if (!pathname.startsWith("/painel") && !pathname.startsWith("/api/painel")) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // getUser() valida e, se necessario, renova o token, disparando setAll com
  // os cookies atualizados na resposta.
  //
  // BLINDAGEM (Jun/2026): uma falha transitoria de rede com o Supabase
  // (VPS em Boston -> DB em Sao Paulo, cross-region) NAO pode derrubar a rota
  // com 500 e travar o painel/salvamento. Em erro, seguimos sem renovar; a
  // propria rota (getCurrentLawyer) trata a auth e devolve 401 limpo.
  try {
    await supabase.auth.getUser();
  } catch {
    // ignore — nunca bloqueia /painel ou o save por falha transitoria de auth
  }
  return response;
}

export const config = {
  // "/" entra para permitir a reescrita do subdomínio multas.* → /multas.
  // As famílias públicas entram para a validação estrutural (404 real).
  matcher: [
    "/",
    "/painel/:path*",
    "/api/painel/:path*",
    "/advogado/:path*",
    "/advogados/:path*",
    "/advogados-de/:path*",
    "/glossario/:path*",
    "/blog/:path*",
    "/guias/:path*",
    "/modelos/:path*",
    "/problemas-juridicos/:path*",
    "/quanto-custa/:path*",
    "/calculadoras/:path*",
    "/jurisprudencia/:path*",
    "/tribunais/:path*",
    "/para-advogados/:path*",
    "/recurso-de-multa/:path*",
  ],
};
