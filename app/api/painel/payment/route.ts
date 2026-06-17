import { NextResponse } from "next/server";
import { PLAN } from "@/lib/config";
import { getCurrentLawyer, revalidateLawyerPages, toPanelLawyer } from "@/lib/painel/server";
import type { LawyerRow } from "@/lib/supabase/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const current = await getCurrentLawyer();
  if (!current.ok) {
    return NextResponse.json(current, { status: current.status });
  }

  // Guard: nao rebaixar um advogado PREMIUM ATIVO. Se ele acessar a rota crua
  // /painel/pagamento e clicar "Ja paguei" ja estando active e com plano
  // vigente, manter o status — senao voltaria a "pending", sairia do topo e
  // perderia o selo ate um admin reativar (e poderia pagar 2x por confusao).
  const activeEndMs = current.lawyer.plan_end_date
    ? new Date(current.lawyer.plan_end_date).getTime()
    : 0;
  if (current.lawyer.plan_status === "active" && activeEndMs > Date.now()) {
    return NextResponse.json({
      ok: true,
      alreadyActive: true,
      lawyer: toPanelLawyer(current.lawyer)
    });
  }

  const now = new Date().toISOString();
  const { data, error } = await current.admin
    .from("lawyers")
    .update({
      plan_status: "pending",
      payment_date: now
    })
    .eq("id", current.lawyer.id)
    .select("*")
    .maybeSingle();

  if (error || !data) {
    console.error("[painel] payment status update failed", error);
    return NextResponse.json(
      {
        ok: false,
        code: "payment_update_failed",
        error: error?.message || "Nao foi possivel registrar o pagamento."
      },
      { status: 500 }
    );
  }

  // BUG FIX (Maio/2026): antes, cada clique do user em "Já paguei" criava UM
  // novo registro em plan_history. Resultado: histórico inchava com dezenas
  // de entries pending se o user clicasse várias vezes.
  //
  // Solução: se já existe um registro pending pra esse lawyer nas últimas
  // 48h, ATUALIZA esse registro em vez de criar novo. Cada CICLO de pagamento
  // tem só 1 entry no histórico (que vira "confirmed" quando admin ativa).
  const { data: existingPending } = await current.admin
    .from("plan_history")
    .select("id")
    .eq("lawyer_id", current.lawyer.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let historyError: { message?: string } | null = null;
  if (existingPending?.id) {
    const res = await current.admin
      .from("plan_history")
      .update({ payment_date: now })
      .eq("id", existingPending.id);
    historyError = res.error;
  } else {
    const res = await current.admin.from("plan_history").insert({
      lawyer_id: current.lawyer.id,
      amount: PLAN.price,
      status: "pending",
      payment_date: now,
      txid: `AdvAqui${current.lawyer.id.slice(0, 6).toUpperCase()}`
    });
    historyError = res.error;
  }

  if (historyError) {
    console.error("[painel] payment history insert failed", historyError);
    return NextResponse.json(
      {
        ok: false,
        code: "payment_history_failed",
        error:
          "O status foi sinalizado, mas o historico falhou. Avise o suporte antes de tentar novamente."
      },
      { status: 500 }
    );
  }

  const row = data as LawyerRow;
  revalidateLawyerPages(row);

  return NextResponse.json({
    ok: true,
    lawyer: toPanelLawyer(row),
    paymentDate: now
  });
}
