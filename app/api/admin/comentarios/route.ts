import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth/adminSession";
import { listParaAdmin, moderarComentario } from "@/lib/comentarios-decisoes";
import type { ComentarioStatus } from "@/lib/comentarios-decisoes";

/**
 * Moderação dos comentários de decisão (aba Comentários do admin).
 * GET  ?status=pendente|aprovado (sem filtro = todos)
 * POST { id, action: "aprovar" | "excluir" }
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAdminRequest()) {
    return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });
  }
  const url = new URL(req.url);
  const statusParam = url.searchParams.get("status");
  const status =
    statusParam === "pendente" || statusParam === "aprovado"
      ? (statusParam as ComentarioStatus)
      : undefined;
  const comentarios = await listParaAdmin(status);
  return NextResponse.json({ ok: true, comentarios });
}

export async function POST(req: Request) {
  if (!isAdminRequest()) {
    return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });
  }
  let body: { id?: string; action?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const id = (body.id || "").trim();
  const action = body.action === "aprovar" || body.action === "excluir" ? body.action : null;
  if (!id || !action) {
    return NextResponse.json({ ok: false, error: "Parâmetros inválidos" }, { status: 400 });
  }
  const done = await moderarComentario(id, action);
  if (!done) {
    return NextResponse.json({ ok: false, error: "Comentário não encontrado" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
