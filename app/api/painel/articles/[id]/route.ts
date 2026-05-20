import { NextResponse } from "next/server";
import { getCurrentLawyer, revalidateLawyerPages } from "@/lib/painel/server";

/**
 *   PATCH  /api/painel/articles/[id]    → atualiza artigo (campos parciais)
 *   DELETE /api/painel/articles/[id]    → remove artigo
 *
 * Só o dono (auth.uid() = lawyer_id) consegue editar/deletar. O endpoint
 * usa admin client mas filtra explicitamente por lawyer_id pra garantia
 * dupla além do RLS.
 *
 * Maio/2026 — Fase 3 da Página Profissional AdvAqui.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ArticleStatus = "draft" | "scheduled" | "published" | "paused" | "archived";
const VALID_STATUSES: ArticleStatus[] = [
  "draft",
  "scheduled",
  "published",
  "paused",
  "archived"
];

const MIGRATION_PENDING_RESPONSE = () =>
  NextResponse.json(
    {
      ok: false,
      code: "migration_pending",
      error: "Recurso ainda não foi liberado no banco (migration 0006 pendente)."
    },
    { status: 503 }
  );

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
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
  if (typeof body.title === "string") update.title = body.title.trim().slice(0, 200);
  if (typeof body.summary === "string")
    update.summary = body.summary.trim().slice(0, 300) || null;
  if (typeof body.body === "string") {
    const text = body.body.trim().slice(0, 50000);
    update.body = text;
    const wc = text.split(/\s+/).filter(Boolean).length;
    update.word_count = wc;
    update.read_time_minutes = Math.max(1, Math.round(wc / 200));
  }
  if (typeof body.specialtySlug === "string")
    update.specialty_slug = body.specialtySlug.trim() || null;
  if (typeof body.status === "string" && VALID_STATUSES.includes(body.status as ArticleStatus)) {
    update.status = body.status;
    // Auto-popula published_at quando o status vira "published"
    if (body.status === "published") {
      update.published_at = new Date().toISOString();
      update.unpublished_at = null;
    } else if (body.status === "paused" || body.status === "archived") {
      update.unpublished_at = new Date().toISOString();
    }
  }
  if ("scheduledFor" in body) {
    update.scheduled_for =
      typeof body.scheduledFor === "string" && body.scheduledFor.trim()
        ? new Date(body.scheduledFor).toISOString()
        : null;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json(
      { ok: false, code: "nothing_to_update", error: "Nada para atualizar." },
      { status: 400 }
    );
  }

  const { data, error } = await current.admin
    .from("lawyer_articles")
    .update(update as Record<string, unknown> as never)
    .eq("id", params.id)
    .eq("lawyer_id", current.lawyer.id)
    .select("*")
    .maybeSingle();

  if (error) {
    if (/relation .+ does not exist/i.test(error.message)) return MIGRATION_PENDING_RESPONSE();
    console.error("[painel:articles PATCH] failed", error);
    return NextResponse.json(
      { ok: false, code: "update_failed", error: error.message || "Erro ao salvar." },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { ok: false, code: "not_found", error: "Artigo não encontrado." },
      { status: 404 }
    );
  }

  // Revalida a página pública do advogado pra refletir mudança.
  revalidateLawyerPages(current.lawyer);

  return NextResponse.json({ ok: true, article: data });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const current = await getCurrentLawyer();
  if (!current.ok) return NextResponse.json(current, { status: current.status });

  const { error } = await current.admin
    .from("lawyer_articles")
    .delete()
    .eq("id", params.id)
    .eq("lawyer_id", current.lawyer.id);

  if (error) {
    if (/relation .+ does not exist/i.test(error.message)) return MIGRATION_PENDING_RESPONSE();
    console.error("[painel:articles DELETE] failed", error);
    return NextResponse.json(
      { ok: false, code: "delete_failed", error: error.message || "Erro ao excluir." },
      { status: 500 }
    );
  }

  revalidateLawyerPages(current.lawyer);

  return NextResponse.json({ ok: true });
}
