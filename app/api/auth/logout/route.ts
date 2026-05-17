import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { clearAdminCookie } from "@/lib/auth/adminSession";

/**
 * Endpoint de logout — limpa:
 *  - Sessão Supabase do advogado (auth.signOut)
 *  - Cookie httpOnly admin (clearAdminCookie)
 *
 * Uso: fetch("/api/auth/logout", { method: "POST" })
 */
export const runtime = "nodejs";

export async function POST() {
  const supabase = createClient();
  await supabase.auth.signOut();

  const res = NextResponse.json({ ok: true });
  clearAdminCookie(res);
  return res;
}
