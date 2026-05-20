import { NextResponse } from "next/server";
import { getCurrentLawyer, revalidateLawyerPages } from "@/lib/painel/server";

/**
 * PATCH /api/painel/questions/[id]
 *
 * O advogado modera/responde uma pergunta recebida. Mudanças permitidas:
 *
 *   - status: aprovar, responder, rejeitar, marcar como spam, ocultar
 *   - answer: texto da resposta (obrigatório quando status='answered')
 *   - rejected_reason: motivo da rejeição (opcional)
 *
 * Sem DELETE — preferimos manter histórico, marcando como 'hidden' ou
 * 'rejected'.
 *
 * Maio/2026 — Fase 3.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type QuestionStatus =
  | "pending"
  | "approved"
  | "answered"
  | "rejected"
  | "spam"
  | "hidden";
const VALID_STATUSES: QuestionStatus[] = [
  "pending",
  "approved",
  "answered",
  "rejected",
  "spam",
  "hidden"
];

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, code: "invalid_json", error: "Requisição inválida." },
      { status: 400 }
    );
  }

  const current = await getCurrentLawyer();
  if (!current.ok) return NextResponse.json(current, { status: current.status });

  const update: Record<string, unknown> = {};

  if (typeof body.status === "string") {
    const s = body.status.trim();
    if (!VALID_STATUSES.includes(s as QuestionStatus)) {
      return NextResponse.json(
        { ok: false, code: "invalid_status", error: "Status inválido." },
        { status: 400 }
      );
    }
    update.status = s;
    if (s === "answered") update.answered_at = new Date().toISOString();
  }

  if (typeof body.answer === "string") {
    const t = body.answer.trim().slice(0, 5000);
    update.answer = t || null;
  }

  if (typeof body.rejected_reason === "string") {
    update.rejected_reason = body.rejected_reason.trim().slice(0, 300) || null;
  }

  // Guard: se for marcar como 'answered', precisa ter resposta.
  if (update.status === "answered") {
    const ans = typeof update.answer === "string" ? update.answer : "";
    if (!ans || ans.trim().length < 5) {
      return NextResponse.json(
        {
          ok: false,
          code: "answer_required",
          error: "Escreva uma resposta com pelo menos 5 caracteres antes de marcar como respondida."
        },
        { status: 400 }
      );
    }
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json(
      { ok: false, code: "nothing_to_update", error: "Nada para atualizar." },
      { status: 400 }
    );
  }

  const { data, error } = await current.admin
    .from("lawyer_questions")
    .update(update as Record<string, unknown> as never)
    .eq("id", params.id)
    .eq("lawyer_id", current.lawyer.id)
    .select("*")
    .maybeSingle();

  if (error) {
    if (/relation .+ does not exist/i.test(error.message)) {
      return NextResponse.json(
        {
          ok: false,
          code: "migration_pending",
          error: "Recurso ainda não foi liberado (migration 0006 pendente)."
        },
        { status: 503 }
      );
    }
    console.error("[painel:questions PATCH] failed", error);
    return NextResponse.json(
      { ok: false, code: "update_failed", error: error.message || "Erro ao salvar." },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { ok: false, code: "not_found", error: "Pergunta não encontrada." },
      { status: 404 }
    );
  }

  // Se virou 'answered' ou 'hidden', revalida pra refletir na página pública.
  revalidateLawyerPages(current.lawyer);

  return NextResponse.json({ ok: true, question: data });
}
