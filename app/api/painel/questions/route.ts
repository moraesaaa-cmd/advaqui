import { NextResponse } from "next/server";
import { getCurrentLawyer } from "@/lib/painel/server";

/**
 * GET /api/painel/questions
 *
 * Lista todas as perguntas recebidas pelo advogado logado (pendentes,
 * aprovadas, respondidas, rejeitadas, spam, oculta). Ordenado mais recentes
 * primeiro.
 *
 * Defensive: se a tabela lawyer_questions não existe (migration 0006
 * pendente), retorna 503 amigável.
 *
 * Edição (responder/rejeitar/spam) em /api/painel/questions/[id]/route.ts.
 *
 * Maio/2026 — Fase 3 da Página Profissional AdvAqui.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const current = await getCurrentLawyer();
  if (!current.ok) return NextResponse.json(current, { status: current.status });

  const { data, error } = await current.admin
    .from("lawyer_questions")
    .select("*")
    .eq("lawyer_id", current.lawyer.id)
    .order("created_at", { ascending: false });

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
    console.error("[painel:questions GET] failed", error);
    return NextResponse.json(
      { ok: false, code: "read_failed", error: "Não foi possível carregar." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, questions: data || [] });
}
