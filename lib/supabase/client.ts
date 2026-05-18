"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Cliente Supabase para Client Components.
 *
 * IMPORTANTE — singleton.
 * Cada chamada de createBrowserClient() cria uma instância COM SEU PRÓPRIO
 * cache local de sessão e seu próprio listener interno de cookies. Se cada
 * componente cliente instancia um novo, eles divergem: a sessão atualizada
 * em uma instância (ex: login) NÃO dispara onAuthStateChange registrado
 * em outra instância (ex: Header rendered antes).
 *
 * Sintoma reportado: "quando abro outra aba, parece deslogado". A nova aba
 * cria nova instância, lê cookies/localStorage, mas alguns navegadores
 * demoram ou não sincronizam imediatamente entre instâncias diferentes.
 *
 * Solução: uma única instância no escopo do módulo. Todas as chamadas
 * compartilham o mesmo cache, os mesmos listeners e a mesma sessão.
 *
 * Uso:
 *   import { createClient } from "@/lib/supabase/client";
 *   const supabase = createClient();
 */

let cachedClient: SupabaseClient<Database> | null = null;

export function createClient(): SupabaseClient<Database> {
  if (cachedClient) return cachedClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY no .env.local."
    );
  }

  cachedClient = createBrowserClient<Database>(url, key);
  return cachedClient;
}
