import { NextRequest, NextResponse } from "next/server";
import { PLAN } from "@/lib/config";
import { getCurrentLawyer } from "@/lib/painel/server";
import { criarCobrancaPixPremium, getAsaasApiKey } from "@/lib/asaas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/painel/payment-pix — gera a cobrança PIX AUTOMÁTICA do premium.
 *
 * Cria a cobrança no Asaas com externalReference = id do advogado e devolve o
 * QR Code. A ativação do plano acontece SOZINHA quando o webhook
 * /api/webhooks/asaas recebe a confirmação do pagamento — sem "Já paguei" e
 * sem validação manual do admin.
 *
 * O CPF é exigido pelo gateway: usa o do cadastro; se faltar, aceita `cpf` no
 * corpo e o persiste no perfil.
 */
export async function POST(req: NextRequest) {
  if (!getAsaasApiKey()) {
    return NextResponse.json(
      { ok: false, code: "asaas_indisponivel", error: "Pagamento automático indisponível." },
      { status: 503 }
    );
  }

  const current = await getCurrentLawyer();
  if (!current.ok) {
    return NextResponse.json(current, { status: current.status });
  }

  // Não gerar cobrança para plano já ativo e vigente.
  const activeEndMs = current.lawyer.plan_end_date
    ? new Date(current.lawyer.plan_end_date).getTime()
    : 0;
  if (current.lawyer.plan_status === "active" && activeEndMs > Date.now()) {
    return NextResponse.json({ ok: true, alreadyActive: true });
  }

  // CPF: do cadastro ou informado agora (e então persistido).
  let cpf = (current.lawyer.cpf || "").replace(/\D+/g, "");
  if (!cpf) {
    const body = (await req.json().catch(() => ({}))) as { cpf?: string };
    const informado = (body.cpf || "").replace(/\D+/g, "");
    if (informado.length !== 11) {
      return NextResponse.json(
        {
          ok: false,
          code: "cpf_obrigatorio",
          error: "Informe seu CPF para gerar o PIX com confirmação automática."
        },
        { status: 400 }
      );
    }
    cpf = informado;
    const { error: cpfErr } = await current.admin
      .from("lawyers")
      .update({ cpf })
      .eq("id", current.lawyer.id);
    if (cpfErr) {
      console.error("[painel:payment-pix] falha ao salvar CPF", cpfErr);
    }
  }

  try {
    const cobranca = await criarCobrancaPixPremium({
      lawyerId: current.lawyer.id,
      nome: current.lawyer.name,
      cpf,
      email: current.lawyer.email,
      valorReais: PLAN.price,
      descricao: `AdvAqui Premium — ${PLAN.cycleDays} dias`
    });

    // Um único registro pendente por ciclo (mesma regra do fluxo manual):
    // reaproveita o pending recente, agora apontando para a cobrança do gateway.
    const now = new Date().toISOString();
    const { data: existingPending } = await current.admin
      .from("plan_history")
      .select("id")
      .eq("lawyer_id", current.lawyer.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingPending?.id) {
      await current.admin
        .from("plan_history")
        .update({ payment_date: now, txid: cobranca.paymentId, amount: PLAN.price })
        .eq("id", existingPending.id);
    } else {
      await current.admin.from("plan_history").insert({
        lawyer_id: current.lawyer.id,
        amount: PLAN.price,
        status: "pending",
        payment_date: now,
        txid: cobranca.paymentId
      });
    }

    return NextResponse.json({
      ok: true,
      paymentId: cobranca.paymentId,
      copiaECola: cobranca.copiaECola,
      qrCodeBase64: cobranca.qrCodeBase64
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Falha ao gerar a cobrança.";
    console.error("[painel:payment-pix]", msg);
    return NextResponse.json(
      { ok: false, code: "asaas_erro", error: msg },
      { status: 502 }
    );
  }
}
