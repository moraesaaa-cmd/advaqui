"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

/**
 * Cliente Supabase para uso em Client Components (componentes com "use client").
 *
 * Lê a URL e a publishable key do `process.env`. Como ambas são `NEXT_PUBLIC_*`,
 * ficam disponíveis no navegador (e é seguro — a publishable key é desenhada
 * para ser pública, com RLS impondo segurança no banco).
 *
 * Uso:
 *   "use client";
 *   import { createClient } from "@/lib/supabase/client";
 *   const supabase = createClient();
 *   await supabase.auth.signInWithPassword({ email, password });
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY no .env.local."
    );
  }
  return createBrowserClient<Database>(url, key);
}
