import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminRequest } from "@/lib/auth/adminSession";
import { createAdminClient } from "@/lib/supabase/admin";
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
 * Revalida páginas afetadas por uma mudança no perfil do advogado.
 * Chamado após activate/deactivate-premium, toggle-featured, toggle-verified-oab
 * e delete-lawyer para evitar cache de até 1h no SSG das páginas de cidade/UF/perfil.
 */
async function revalidateLawyerPages(lawyerId: string): Promise<void> {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("lawyers")
      .select("slug,uf,city_slug,target_uf,target_city,extra_cities")
      .eq("id", lawyerId)
      .maybeSingle();
    if (!data) return;
    const paths = new Set<string>();
    paths.add("/");
    paths.add(`/p/${data.slug}`);

    const uf = (data.uf as string).toLowerCase();
    paths.add(`/advogados/${uf}`);
    paths.add(`/advogados/${uf}/${data.city_slug}`);

    if (data.target_uf && data.target_city) {
      const tuf = (data.target_uf as string).toLowerCase();
      paths.add(`/advogados/${tuf}`);
      paths.add(`/advogados/${tuf}/${data.target_city}`);
    }

    // Inclui extra_cities (até 9 entradas)
    const extras = Array.isArray(data.extra_cities) ? data.extra_cities : [];
    for (const c of extras as Array<{ uf?: string; slug?: string }>) {
      if (c && typeof c.uf === "string" && typeof c.slug === "string") {
        const tuf = c.uf.toLowerCase();
        paths.add(`/advogados/${tuf}`);
        paths.add(`/advogados/${tuf}/${c.slug}`);
      }
    }

    for (const path of paths) {
      try {
        revalidatePath(path);
      } catch (err) {
        console.error("[admin] revalidatePath failed for", path, err);
      }
    }
  } catch (err) {
    console.error("[admin] revalidateLawyerPages failed", err);
  }
}

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
      if (result.ok) await revalidateLawyerPages(body.id);
      return NextResponse.json(result, { status: result.ok ? 200 : 500 });
    }
    case "deactivate-premium": {
      if (!body.id) return NextResponse.json({ ok: false, error: "ID ausente" }, { status: 400 });
      const result = await adminDeactivatePremium(body.id);
      if (result.ok) await revalidateLawyerPages(body.id);
      return NextResponse.json(result, { status: result.ok ? 200 : 500 });
    }
    case "toggle-featured": {
      if (!body.id) return NextResponse.json({ ok: false, error: "ID ausente" }, { status: 400 });
      const result = await adminToggleFeatured(body.id, !!body.value);
      if (result.ok) await revalidateLawyerPages(body.id);
      return NextResponse.json(result, { status: result.ok ? 200 : 500 });
    }
    case "toggle-verified-oab": {
      if (!body.id) return NextResponse.json({ ok: false, error: "ID ausente" }, { status: 400 });
      const result = await adminToggleVerifiedOab(body.id, !!body.value);
      if (result.ok) await revalidateLawyerPages(body.id);
      return NextResponse.json(result, { status: result.ok ? 200 : 500 });
    }
    case "delete-lawyer": {
      if (!body.id) return NextResponse.json({ ok: false, error: "ID ausente" }, { status: 400 });
      // Revalida ANTES do delete (depois não existe mais o lawyer para buscar slugs)
      await revalidateLawyerPages(body.id);
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
