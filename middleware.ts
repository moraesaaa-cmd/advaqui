import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

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
  matcher: ["/", "/painel/:path*", "/api/painel/:path*"],
};
