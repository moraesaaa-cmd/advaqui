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

  const { error: historyError } = await current.admin.from("plan_history").insert({
    lawyer_id: current.lawyer.id,
    amount: PLAN.price,
    status: "pending",
    payment_date: now,
    txid: `AdvAqui${current.lawyer.id.slice(0, 6).toUpperCase()}`
  });

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
