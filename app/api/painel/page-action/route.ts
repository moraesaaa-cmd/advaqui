import { NextResponse } from "next/server";
import { getCurrentLawyer, revalidateLawyerPages, toPanelLawyer } from "@/lib/painel/server";
import type { LawyerRow } from "@/lib/supabase/types";

/**
 * POST /api/painel/page-action
 *
 * Aplica uma ação de controle de publicação na Página Profissional do
 * advogado logado.
 *
 * Body: { action: "pause" | "republish", reason?: string }
 *
 * pause       → page_status = 'paused', is_public = false, is_indexable = false
 * republish   → page_status = 'published', is_public = true, is_indexable = true
 *
 * Defensive: se a migration 0006 não foi aplicada (colunas page_status, paused_at
 * etc. não existem), retorna erro amigável sem quebrar nada.
 *
 * Maio/2026 — Fase 3 da Página Profissional.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Action = "pause" | "republish";

const VALID_ACTIONS: Action[] = ["pause", "republish"];

export async function POST(req: Request) {
  let body: { action?: string; reason?: string };
  try {
    body = (await req.json()) as { action?: string; reason?: string };
  } catch {
    return NextResponse.json(
      { ok: false, code: "invalid_json", error: "Requisição inválida." },
      { status: 400 }
    );
  }

  const action = body.action as Action | undefined;
  if (!action || !VALID_ACTIONS.includes(action)) {
    return NextResponse.json(
      {
        ok: false,
        code: "invalid_action",
        error: "Ação inválida. Use 'pause' ou 'republish'."
      },
      { status: 400 }
    );
  }

  const current = await getCurrentLawyer();
  if (!current.ok) {
    return NextResponse.json(current, { status: current.status });
  }

  // Só permite controle pra premium ativo
  if (current.lawyer.plan_status !== "active") {
    return NextResponse.json(
      {
        ok: false,
        code: "premium_required",
        error:
          "Pausar e republicar a Página Profissional é um recurso do plano premium ativo."
      },
      { status: 403 }
    );
  }

  const now = new Date().toISOString();

  const update: Record<string, unknown> =
    action === "pause"
      ? {
          page_status: "paused",
          is_public: false,
          is_indexable: false,
          paused_at: now,
          last_unpublished_at: now,
          paused_reason:
            typeof body.reason === "string" && body.reason.trim()
              ? body.reason.trim().slice(0, 500)
              : null
        }
      : {
          page_status: "published",
          is_public: true,
          is_indexable: true,
          paused_at: null,
          paused_reason: null,
          last_published_at: now
        };

  const { data, error } = await current.admin
    .from("lawyers")
    .update(update as Record<string, unknown> as never)
    .eq("id", current.lawyer.id)
    .select("*")
    .maybeSingle();

  if (error && /column .+ does not exist/i.test(error.message)) {
    console.warn(
      "[painel:page-action] migration 0006 pending — page_status columns missing",
      error.message
    );
    return NextResponse.json(
      {
        ok: false,
        code: "migration_pending",
        error:
          "Recurso ainda não foi liberado no banco. Avise o suporte (migration 0006 pendente)."
      },
      { status: 503 }
    );
  }

  if (error || !data) {
    console.error("[painel:page-action] update failed", error);
    return NextResponse.json(
      {
        ok: false,
        code: "update_failed",
        error: error?.message || "Não foi possível atualizar a página."
      },
      { status: 500 }
    );
  }

  const row = data as LawyerRow;
  revalidateLawyerPages(row);

  return NextResponse.json({
    ok: true,
    action,
    lawyer: toPanelLawyer(row)
  });
}
