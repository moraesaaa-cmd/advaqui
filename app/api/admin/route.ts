import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth/adminSession";
import {
  adminListLawyers,
  adminActivatePremium,
  adminDeactivatePremium,
  adminToggleFeatured,
  adminToggleVerifiedOab,
  adminDeleteLawyer
} from "@/lib/data/lawyers";
import {
  adminListMessages,
  adminMarkMessageRead,
  adminReplyMessage
} from "@/lib/data/messages";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Endpoint admin unificado. Recebe `{ action: string, ...payload }` via POST.
 *
 * Verifica cookie httpOnly assinado (advaqui_admin_session) antes de cada ação.
 * Sem isso, retorna 401. Service_role do Supabase é usado internamente.
 *
 * Actions disponíveis:
 *  - list-lawyers
 *  - list-messages
 *  - activate-premium { id, days? }
 *  - deactivate-premium { id }
 *  - toggle-featured { id, value }
 *  - toggle-verified-oab { id, value }
 *  - delete-lawyer { id }
 *  - mark-message-read { id }
 *  - reply-message { id, reply }
 */

type Payload = {
  action?: string;
  id?: string;
  days?: number;
  value?: boolean;
  reply?: string;
};

export async function POST(req: Request) {
  if (!isAdminRequest()) {
    return NextResponse.json(
      { ok: false, error: "Não autorizado" },
      { status: 401 }
    );
  }

  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Requisição inválida" },
      { status: 400 }
    );
  }

  const { action } = body;

  switch (action) {
    case "list-lawyers": {
      const lawyers = await adminListLawyers();
      return NextResponse.json({ ok: true, lawyers });
    }
    case "list-messages": {
      const messages = await adminListMessages();
      return NextResponse.json({ ok: true, messages });
    }
    case "activate-premium": {
      if (!body.id) return NextResponse.json({ ok: false, error: "ID ausente" }, { status: 400 });
      const result = await adminActivatePremium(body.id, body.days);
      return NextResponse.json(result, { status: result.ok ? 200 : 500 });
    }
    case "deactivate-premium": {
      if (!body.id) return NextResponse.json({ ok: false, error: "ID ausente" }, { status: 400 });
      const result = await adminDeactivatePremium(body.id);
      return NextResponse.json(result, { status: result.ok ? 200 : 500 });
    }
    case "toggle-featured": {
      if (!body.id) return NextResponse.json({ ok: false, error: "ID ausente" }, { status: 400 });
      const result = await adminToggleFeatured(body.id, !!body.value);
      return NextResponse.json(result, { status: result.ok ? 200 : 500 });
    }
    case "toggle-verified-oab": {
      if (!body.id) return NextResponse.json({ ok: false, error: "ID ausente" }, { status: 400 });
      const result = await adminToggleVerifiedOab(body.id, !!body.value);
      return NextResponse.json(result, { status: result.ok ? 200 : 500 });
    }
    case "delete-lawyer": {
      if (!body.id) return NextResponse.json({ ok: false, error: "ID ausente" }, { status: 400 });
      const result = await adminDeleteLawyer(body.id);
      return NextResponse.json(result, { status: result.ok ? 200 : 500 });
    }
    case "mark-message-read": {
      if (!body.id) return NextResponse.json({ ok: false, error: "ID ausente" }, { status: 400 });
      const result = await adminMarkMessageRead(body.id);
      return NextResponse.json(result, { status: result.ok ? 200 : 500 });
    }
    case "reply-message": {
      if (!body.id || !body.reply)
        return NextResponse.json({ ok: false, error: "Parâmetros faltando" }, { status: 400 });
      // pega e-mail admin do env (deve estar configurado)
      const adminEmail = process.env.ADMIN_EMAIL || "admin@advaqui.com";
      const result = await adminReplyMessage({
        id: body.id,
        reply: body.reply,
        adminEmail
      });
      return NextResponse.json(result, { status: result.ok ? 200 : 500 });
    }
    default:
      return NextResponse.json(
        { ok: false, error: "Ação desconhecida" },
        { status: 400 }
      );
  }
}

/**
 * GET /api/admin → verifica se a sessão admin é válida (usado pela página /admin
 * para detectar acesso autorizado sem precisar fazer fetch de dados).
 */
export async function GET() {
  if (!isAdminRequest()) {
    return NextResponse.json(
      { ok: false, error: "Não autorizado" },
      { status: 401 }
    );
  }
  return NextResponse.json({ ok: true });
}
