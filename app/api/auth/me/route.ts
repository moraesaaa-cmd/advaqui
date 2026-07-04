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
 *   { kind: "admin", email }             — cookie HMAC admin presente
 *   { kind: "citizen", name, firstName } — sessão Supabase com
 *                                          user_metadata.account_type="cidadao"
 *                                          (conta grátis das ferramentas)
 *   { kind: "lawyer", name, firstName }  — demais sessões Supabase
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
      // Conta de cidadão (cadastro rápido das ferramentas): não tem linha em
      // lawyers — resolve direto pelo metadata, sem consultar o banco.
      if (user.user_metadata?.account_type === "cidadao") {
        const rawName =
          (user.user_metadata?.name as string | undefined) || user.email || "Visitante";
        const name = titleCaseNameBR(rawName);
        return NextResponse.json({
          kind: "citizen",
          name,
          firstName: name.trim().split(/\s+/)[0] || "Visitante"
        });
      }

      // Busca nome canônico + plan_status em public.lawyers (mais confiável
      // que user_metadata). plan_status alimenta UI que distingue
      // lawyer-free vs lawyer-premium (ex: CTA "ativar premium" desaparece
      // quando o user já é premium ativo).
      const admin = createAdminClient();
      const { data } = await admin
        .from("lawyers")
        .select("name,plan_status")
        .eq("id", user.id)
        .maybeSingle();

      const rawName =
        (data?.name as string | undefined) ||
        (user.user_metadata?.name as string | undefined) ||
        user.email ||
        "Advogado";
      const name = titleCaseNameBR(rawName);
      const firstName = name.trim().split(/\s+/)[0] || "Advogado";
      const planStatus =
        (data?.plan_status as string | undefined) || "free";

      return NextResponse.json({
        kind: "lawyer",
        name,
        firstName,
        planStatus
      });
    }
  } catch (err) {
    console.error("[api/auth/me] supabase check failed", err);
  }

  return NextResponse.json({ kind: "anonymous" });
}
