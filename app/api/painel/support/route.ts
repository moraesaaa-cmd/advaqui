import { NextResponse } from "next/server";
import { getCurrentLawyer } from "@/lib/painel/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { message?: unknown };
  try {
    body = (await req.json()) as { message?: unknown };
  } catch {
    return NextResponse.json(
      { ok: false, code: "invalid_json", error: "Requisicao invalida." },
      { status: 400 }
    );
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (message.length < 10) {
    return NextResponse.json(
      {
        ok: false,
        code: "message_too_short",
        error: "Escreva uma mensagem com pelo menos 10 caracteres."
      },
      { status: 400 }
    );
  }

  const current = await getCurrentLawyer();
  if (!current.ok) {
    return NextResponse.json(current, { status: current.status });
  }

  const { error } = await current.admin.from("messages").insert({
    from_user_id: current.lawyer.id,
    from_name: current.lawyer.name,
    from_email: current.lawyer.email,
    subject: "Suporte",
    body: message,
    source: "support"
  });

  if (error) {
    console.error("[painel] support message insert failed", error);
    return NextResponse.json(
      {
        ok: false,
        code: "support_insert_failed",
        error: error.message
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
