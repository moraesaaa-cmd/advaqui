import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth/adminSession";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/agendamentos — lista os pedidos de agendamento (admin).
 * POST /api/admin/agendamentos — atualiza o status de um pedido.
 *
 * Auth pelo cookie admin (mesmo do resto do /api/admin). Defensive: se a
 * tabela não existe, devolve lista vazia com migrationPending.
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
      .from("agendamentos")
      .select("id,created_at,nome,contato,area,assunto,data_preferida,periodo,mensagem,status")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      if (/relation .+ does not exist/i.test(error.message)) {
        return NextResponse.json({ ok: true, agendamentos: [], migrationPending: true });
      }
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, agendamentos: data || [], migrationPending: false });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAdminRequest()) {
    return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });
  }
  let body: { id?: string; status?: string };
  try {
    body = (await req.json()) as { id?: string; status?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "Requisição inválida" }, { status: 400 });
  }
  const id = typeof body.id === "string" ? body.id : "";
  const status = typeof body.status === "string" ? body.status : "";
  if (!id || !["novo", "em_contato", "concluido", "descartado"].includes(status)) {
    return NextResponse.json({ ok: false, error: "Dados inválidos" }, { status: 400 });
  }
  try {
    const admin = createAdminClient();
    const { error } = await admin.from("agendamentos").update({ status }).eq("id", id);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
