import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/recurso-pecas?token=...  → histórico de peças do cliente de multa.
 *
 * Resolve o cliente pelo access_token e lista as peças que ele já gerou no
 * painel (/recurso/painel). Leitura via service_role (tabela fechada por RLS).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token") || "";
  if (!token) return NextResponse.json({ ok: false }, { status: 400 });

  try {
    const admin = createAdminClient();
    const { data: cli } = await admin
      .from("recurso_clientes")
      .select("id")
      .eq("access_token", token)
      .maybeSingle();
    if (!cli) return NextResponse.json({ ok: false }, { status: 404 });

    const { data: pecas, error } = await admin
      .from("recurso_pecas")
      .select("id,fase,infracao,texto,created_at")
      .eq("cliente_id", cli.id)
      .order("created_at", { ascending: false });

    // Tabela ainda não criada (migration 0012 pendente) → devolve lista vazia.
    if (error) return NextResponse.json({ ok: true, pecas: [] });

    return NextResponse.json({ ok: true, pecas: pecas || [] });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
