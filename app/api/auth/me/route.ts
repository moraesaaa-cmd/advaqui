import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminRequest } from "@/lib/auth/adminSession";
import { titleCaseNameBR } from "@/lib/utils/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/auth/me
 *
 * Único endpoint que o Header consulta pra saber QUEM é o visitante. Retorna:
 *   { kind: "admin", email }            — cookie HMAC admin presente
 *   { kind: "lawyer", name, firstName } — sessão Supabase ativa
 *   { kind: "anonymous" }                — sem nenhuma sessão
 *
 * Substitui a chamada `supabase.auth.getUser()` direta no Header, que dependia
 * de tipos do supabase-js + cookies sincronizados. Como o Supabase 2.106
 * pode demorar a hidratar a sessão no cliente, o Header às vezes mostrava
 * "Entrar" mesmo com user logado. Movendo o check pra server-side, eliminamos
 * essa janela de inconsistência.
 *
 * Cache: response sempre dinâmica (cookie httpOnly muda a cada login/logout).
 */
export async function GET() {
  // 1) Admin tem prioridade — cookie HMAC é só admin
  if (isAdminRequest()) {
    return NextResponse.json({
      kind: "admin",
      email: process.env.ADMIN_EMAIL || "admin@advaqui.com.br"
    });
  }

  // 2) Tenta sessão Supabase (advogado)
  try {
    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (user) {
      // Busca nome canônico em public.lawyers (mais confiável que user_metadata)
      const admin = createAdminClient();
      const { data } = await admin
        .from("lawyers")
        .select("name")
        .eq("id", user.id)
        .maybeSingle();

      const rawName =
        (data?.name as string | undefined) ||
        (user.user_metadata?.name as string | undefined) ||
        user.email ||
        "Advogado";
      const name = titleCaseNameBR(rawName);
      const firstName = name.trim().split(/\s+/)[0] || "Advogado";

      return NextResponse.json({ kind: "lawyer", name, firstName });
    }
  } catch (err) {
    console.error("[api/auth/me] supabase check failed", err);
  }

  return NextResponse.json({ kind: "anonymous" });
}
