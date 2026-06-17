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
  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: ["/painel/:path*", "/api/painel/:path*"],
};
