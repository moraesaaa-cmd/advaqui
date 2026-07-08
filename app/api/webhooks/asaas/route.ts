import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { PLAN } from "@/lib/config";
import { pagamentoAprovado } from "@/lib/asaas";
import {
  revalidateLawyerPages,
  type RevalidatableLawyer
} from "@/lib/painel/revalidate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/webhooks/asaas — ATIVAÇÃO AUTOMÁTICA do premium.
 *
 * O Asaas chama esta rota quando a cobrança muda de status. Com o pagamento
 * confirmado (RECEIVED/CONFIRMED/RECEIVED_IN_CASH), o plano do advogado
 * apontado em `externalReference` é ativado na hora: plan_status = active,
 * vigência de PLAN.cycleDays, histórico confirmado e páginas revalidadas.
 *
 * Segurança: exige o cabeçalho `asaas-access-token` igual a
 * ASAAS_WEBHOOK_TOKEN (comparação em tempo constante). Sem o env, FALHA
 * FECHADO. Idempotente: reprocessar o mesmo evento não duplica nada.
 */

function origemValida(recebido: string | null): boolean {
  const esperado = process.env.ASAAS_WEBHOOK_TOKEN;
  if (!esperado) return false;
  if (!recebido) return false;
  const a = Buffer.from(esperado);
  const b = Buffer.from(recebido);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  if (!origemValida(request.headers.get("asaas-access-token"))) {
    return NextResponse.json({ ok: false, error: "Não autorizado." }, { status: 401 });
  }

  let corpo: unknown = null;
  try {
    corpo = await request.json();
  } catch {
    corpo = null;
  }
  const obj = (corpo ?? {}) as Record<string, unknown>;
  const evento = typeof obj.event === "string" ? obj.event : "";
  const payment = (obj.payment ?? {}) as Record<string, unknown>;
  const paymentId = payment.id ? String(payment.id) : "";
  const statusAsaas = typeof payment.status === "string" ? payment.status : "";
  const lawyerId = payment.externalReference ? String(payment.externalReference) : "";

  // Só nos interessam eventos de cobrança PAGA com referência de advogado.
  if (!evento.startsWith("PAYMENT_") || !paymentId || !lawyerId) {
    return NextResponse.json({ ok: true, ignorado: true });
  }
  if (!pagamentoAprovado(statusAsaas)) {
    return NextResponse.json({ ok: true, ignorado: true, status: statusAsaas });
  }

  const supabase = createAdminClient({ noStore: true });

  // Advogado existe? (cobranças de outros sistemas são ignoradas com 200)
  const { data: lawyer, error: selErr } = await supabase
    .from("lawyers")
    .select(
      "id, name, email, slug, uf, city_slug, target_uf, target_city, extra_cities, specialties, plan_status, plan_end_date"
    )
    .eq("id", lawyerId)
    .maybeSingle();

  if (selErr) {
    console.error("[webhook:asaas] busca do advogado falhou", selErr);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  if (!lawyer) {
    return NextResponse.json({ ok: true, ignorado: true, motivo: "lawyer não encontrado" });
  }

  // Idempotência: este pagamento já foi conciliado?
  const { data: jaConfirmado } = await supabase
    .from("plan_history")
    .select("id")
    .eq("lawyer_id", lawyerId)
    .eq("txid", paymentId)
    .eq("status", "confirmed")
    .limit(1)
    .maybeSingle();

  if (jaConfirmado?.id) {
    return NextResponse.json({ ok: true, jaProcessado: true });
  }

  // Ativa o plano por PLAN.cycleDays a partir de agora.
  const agora = new Date();
  const fim = new Date(agora.getTime() + PLAN.cycleDays * 24 * 60 * 60 * 1000);
  const { error: updErr } = await supabase
    .from("lawyers")
    .update({
      plan_status: "active",
      plan_start_date: agora.toISOString(),
      plan_end_date: fim.toISOString(),
      payment_date: agora.toISOString()
    })
    .eq("id", lawyerId);

  if (updErr) {
    console.error("[webhook:asaas] ativação falhou", updErr);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  // Histórico: confirma o pending do ciclo (ou registra confirmado direto).
  const { data: pendente } = await supabase
    .from("plan_history")
    .select("id")
    .eq("lawyer_id", lawyerId)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (pendente?.id) {
    await supabase
      .from("plan_history")
      .update({
        status: "confirmed",
        txid: paymentId,
        amount: PLAN.price,
        payment_date: agora.toISOString()
      })
      .eq("id", pendente.id);
  } else {
    await supabase.from("plan_history").insert({
      lawyer_id: lawyerId,
      amount: PLAN.price,
      status: "confirmed",
      payment_date: agora.toISOString(),
      txid: paymentId
    });
  }

  // Sem revalidação as páginas com ISR mostrariam o estado antigo por até 1h.
  revalidateLawyerPages(lawyer as unknown as RevalidatableLawyer);

  return NextResponse.json({ ok: true, ativado: true });
}
