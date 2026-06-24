import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth/adminSession";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET  /api/admin/recurso-clientes — lista os clientes do recurso de multa.
 * POST /api/admin/recurso-clientes — ativa/cancela/reseta um cliente.
 *
 * Auth: cookie admin (isAdminRequest). É aqui que você LIBERA o acesso depois
 * de confirmar o Pix (status 'aguardando' → 'ativo', recursos_restantes = 3).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!isAdminRequest()) {
    return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });
  }
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("recurso_clientes")
      .select(
        "id,created_at,email,nome,telefone,fase,infracao,placa,ait,orgao,cidade,relato,status,recursos_restantes,access_token,activated_at"
      )
      .order("created_at", { ascending: false })
      .limit(300);
    if (error) {
      if (/relation .+ does not exist/i.test(error.message)) {
        return NextResponse.json({ ok: true, clientes: [], migrationPending: true });
      }
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, clientes: data || [], migrationPending: false });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAdminRequest()) {
    return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });
  }
  let body: { id?: string; action?: string };
  try {
    body = (await req.json()) as { id?: string; action?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "Requisição inválida" }, { status: 400 });
  }
  const id = typeof body.id === "string" ? body.id : "";
  const action = typeof body.action === "string" ? body.action : "";
  if (!id || !["ativar", "cancelar", "reativar"].includes(action)) {
    return NextResponse.json({ ok: false, error: "Dados inválidos" }, { status: 400 });
  }

  const patch =
    action === "cancelar"
      ? { status: "cancelado" }
      : { status: "ativo", recursos_restantes: 3, activated_at: new Date().toISOString() };

  try {
    const admin = createAdminClient();
    const { error } = await admin.from("recurso_clientes").update(patch).eq("id", id);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
