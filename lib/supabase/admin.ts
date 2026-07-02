import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Cliente Supabase com SECRET KEY (service role).
 *
 * ATENÇÃO: este cliente IGNORA Row Level Security. Tem poder TOTAL sobre o banco.
 * Use APENAS em Route Handlers (server-side) que requerem acesso admin —
 * NUNCA expor em Client Components nem no navegador.
 *
 * Uso típico:
 *   import { createAdminClient } from "@/lib/supabase/admin";
 *   const admin = createAdminClient();
 *   const { data: lawyers } = await admin.from("lawyers").select("*");
 */
export function createAdminClient(options: { noStore?: boolean } = {}) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret) {
    throw new Error(
      "Supabase admin não configurado. Defina SUPABASE_SECRET_KEY no .env.local do servidor."
    );
  }
  return createSupabaseClient<Database>(url, secret, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    // noStore: bypassa o Data Cache do Next (fetch patchado cacheia GETs do
    // PostgREST quando a URL se repete entre requests). Obrigatório em rotas
    // de cron/admin que releem dados que elas mesmas acabaram de gravar —
    // sem isso o SELECT volta congelado num snapshot antigo enquanto o
    // UPDATE (PATCH, nunca cacheado) segue funcionando.
    ...(options.noStore
      ? {
          global: {
            fetch: (input: RequestInfo | URL, init?: RequestInit) =>
              fetch(input, { ...init, cache: "no-store" })
          }
        }
      : {})
  });
}
