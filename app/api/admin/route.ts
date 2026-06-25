import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminRequest } from "@/lib/auth/adminSession";
import { createAdminClient } from "@/lib/supabase/admin";
import type { LawyerRow } from "@/lib/supabase/types";
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
      .select("slug,uf,city_slug,target_uf,target_city,extra_cities,specialties")
      .eq("id", lawyerId)
      .maybeSingle();
    if (!data) return;
    const paths = new Set<string>();
    paths.add("/");
    paths.add(`/advogado/${data.slug}`);
    paths.add(`/p/${data.slug}`);
    paths.add("/advogados");

    const specs = Array.isArray(data.specialties)
      ? (data.specialties as string[])
      : [];

    // Coleta TODAS as cidades onde o lawyer aparece (principal, target, extras)
    type CityPair = { uf: string; slug: string };
    const cityPairs: CityPair[] = [];
    cityPairs.push({ uf: data.uf as string, slug: data.city_slug as string });
    if (data.target_uf && data.target_city) {
      cityPairs.push({ uf: data.target_uf as string, slug: data.target_city as string });
    }
    const extras = Array.isArray(data.extra_cities) ? data.extra_cities : [];
    for (const c of extras as Array<{ uf?: string; slug?: string }>) {
      if (c && typeof c.uf === "string" && typeof c.slug === "string") {
        cityPairs.push({ uf: c.uf, slug: c.slug });
      }
    }

    // Para cada cidade: índice + página + especialidades do user
    for (const pair of cityPairs) {
      const ufLower = pair.uf.toLowerCase();
      paths.add(`/advogados/${ufLower}`);
      paths.add(`/advogados/${ufLower}/${pair.slug}`);
      for (const sp of specs) {
        if (typeof sp === "string" && sp) {
          paths.add(`/advogados/${ufLower}/${pair.slug}/${sp}`);
        }
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
  email?: string;
  password?: string;
  fields?: Record<string, unknown>;
  /** Para action "set-plan-status": free | pending | active | expired | cancelled. */
  status?: string;
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
    case "set-plan-status": {
      // Altera plan_status do user e aplica regras de negócio coerentes
      // (Fase 8 — Maio/2026):
      //   • 'active'                      → reusa adminActivatePremium
      //                                     (seta plan_start_date, plan_end_date
      //                                      e cria/atualiza plan_history)
      //   • 'free' | 'expired' | 'cancelled' → reusa adminDeactivatePremium e
      //                                     ajusta plan_status final
      //                                     (zera datas e featured=false)
      //   • 'pending'                     → só atualiza plan_status, mantém
      //                                     datas e featured (aguardando ativação)
      //
      // Resultado: ao mudar pra free, o user perde benefícios premium
      // imediatamente (sai do TOPO, perde selo dourado, etc).
      if (!body.id) return NextResponse.json({ ok: false, error: "ID ausente" }, { status: 400 });
      const status = typeof body.status === "string" ? body.status.trim() : "";
      const VALID_STATUS = ["free", "pending", "active", "expired", "cancelled"] as const;
      if (!(VALID_STATUS as ReadonlyArray<string>).includes(status)) {
        return NextResponse.json(
          { ok: false, error: "Status inválido. Use free, pending, active, expired ou cancelled." },
          { status: 400 }
        );
      }

      if (status === "active") {
        const result = await adminActivatePremium(body.id);
        if (!result.ok) {
          return NextResponse.json(result, { status: 500 });
        }
        await revalidateLawyerPages(body.id);
        return NextResponse.json({ ok: true });
      }

      if (status === "free" || status === "expired" || status === "cancelled") {
        // Reusa lógica de desativação (zera datas + featured) e, se o destino
        // for diferente de 'free', sobreescreve plan_status pra refletir a
        // intenção do admin (expired/cancelled).
        const result = await adminDeactivatePremium(body.id);
        if (!result.ok) {
          return NextResponse.json(result, { status: 500 });
        }
        if (status !== "free") {
          const admin = createAdminClient();
          const { error } = await admin
            .from("lawyers")
            .update({ plan_status: status } as Partial<LawyerRow>)
            .eq("id", body.id);
          if (error) {
            return NextResponse.json(
              { ok: false, error: error.message || "Erro ao atualizar status." },
              { status: 500 }
            );
          }
        }
        await revalidateLawyerPages(body.id);
        return NextResponse.json({ ok: true });
      }

      // status === "pending" — só atualiza plan_status (aguardando ativação).
      const admin = createAdminClient();
      const { error } = await admin
        .from("lawyers")
        .update({ plan_status: status } as Partial<LawyerRow>)
        .eq("id", body.id);
      if (error) {
        return NextResponse.json(
          { ok: false, error: error.message || "Erro ao atualizar status." },
          { status: 500 }
        );
      }
      await revalidateLawyerPages(body.id);
      return NextResponse.json({ ok: true });
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
    case "set-email": {
      if (!body.id || !body.email)
        return NextResponse.json({ ok: false, error: "ID e email obrigatórios" }, { status: 400 });
      const admin = createAdminClient();
      const newEmail = body.email.trim().toLowerCase();
      // Atualiza auth.users (canonical) + public.lawyers (espelho)
      const { error: authError } = await admin.auth.admin.updateUserById(body.id, {
        email: newEmail,
        email_confirm: true
      });
      if (authError) {
        return NextResponse.json({ ok: false, error: authError.message }, { status: 500 });
      }
      const { error: rowError } = await admin
        .from("lawyers")
        .update({ email: newEmail })
        .eq("id", body.id);
      if (rowError) {
        return NextResponse.json({ ok: false, error: rowError.message }, { status: 500 });
      }
      await revalidateLawyerPages(body.id);
      return NextResponse.json({ ok: true });
    }
    case "set-password": {
      if (!body.id || !body.password)
        return NextResponse.json({ ok: false, error: "ID e nova senha obrigatórios" }, { status: 400 });
      if (body.password.length < 8) {
        return NextResponse.json(
          { ok: false, error: "Senha precisa ter pelo menos 8 caracteres" },
          { status: 400 }
        );
      }
      const admin = createAdminClient();
      const { error } = await admin.auth.admin.updateUserById(body.id, {
        password: body.password
      });
      if (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      }
      return NextResponse.json({ ok: true });
    }
    case "send-magic-link": {
      // Gera link de login direto (passwordless) que o admin pode entregar
      // ao advogado quando ele esquecer a senha. Substitui a necessidade de
      // saber a senha original (que e bcrypt e nao pode ser recuperada).
      // Link expira em 1h por padrao do Supabase.
      if (!body.id)
        return NextResponse.json({ ok: false, error: "ID obrigatório" }, { status: 400 });
      const admin = createAdminClient();
      const { data: userRes } = await admin.auth.admin.getUserById(body.id);
      const email = userRes?.user?.email;
      if (!email) {
        return NextResponse.json(
          { ok: false, error: "E-mail do usuário não encontrado" },
          { status: 404 }
        );
      }
      const { data, error } = await admin.auth.admin.generateLink({
        type: "magiclink",
        email
      });
      if (error || !data?.properties?.action_link) {
        return NextResponse.json(
          { ok: false, error: error?.message || "Erro ao gerar magic link" },
          { status: 500 }
        );
      }
      return NextResponse.json({
        ok: true,
        magicLink: data.properties.action_link,
        email,
        expiresInHours: 1
      });
    }
    case "get-lawyer-full": {
      if (!body.id)
        return NextResponse.json({ ok: false, error: "ID obrigatório" }, { status: 400 });
      const admin = createAdminClient();
      // Carrega 4 coisas em paralelo: lawyer (TUDO incluindo CPF), auth user
      // (data de criacao, ultimo login, email confirmation), historico de
      // pagamentos e mensagens enviadas por esse advogado.
      const [lawyerRes, authRes, planHistRes, msgsRes] = await Promise.all([
        admin.from("lawyers").select("*").eq("id", body.id).maybeSingle(),
        admin.auth.admin.getUserById(body.id),
        admin
          .from("plan_history")
          .select("*")
          .eq("lawyer_id", body.id)
          .order("created_at", { ascending: false }),
        admin
          .from("messages")
          .select("*")
          .eq("from_user_id", body.id)
          .order("created_at", { ascending: false })
          .limit(100)
      ]);

      if (lawyerRes.error || !lawyerRes.data) {
        return NextResponse.json(
          { ok: false, error: lawyerRes.error?.message || "Advogado não encontrado" },
          { status: 404 }
        );
      }

      // Filtra dados sensiveis do auth que nao queremos enviar pro client
      const authUser = authRes.data?.user;
      const authSummary = authUser
        ? {
            id: authUser.id,
            email: authUser.email,
            email_confirmed_at: authUser.email_confirmed_at,
            phone: authUser.phone,
            last_sign_in_at: authUser.last_sign_in_at,
            created_at: authUser.created_at,
            updated_at: authUser.updated_at,
            user_metadata: authUser.user_metadata,
            app_metadata: authUser.app_metadata
          }
        : null;

      return NextResponse.json({
        ok: true,
        lawyer: lawyerRes.data,
        authUser: authSummary,
        planHistory: planHistRes.data || [],
        messages: msgsRes.data || []
      });
    }
    case "update-lawyer": {
      if (!body.id || !body.fields)
        return NextResponse.json({ ok: false, error: "ID e fields obrigatórios" }, { status: 400 });
      // Whitelist tipada de campos editaveis pelo admin (evita inject de
      // plan_status etc). Usar `keyof LawyerRow` garante que o filtro casa
      // com `Partial<LawyerRow>` que o supabase-js 2.106 espera no update.
      //
      // Em Maio/2026 (migration 0005) foram adicionados: photo_url, website,
      // instagram, linkedin, office_hours. Admin precisa de poder pleno.
      const ALLOWED: ReadonlyArray<keyof LawyerRow> = [
        "name", "phone", "whatsapp", "address", "city_name", "city_slug",
        "uf", "oab", "oab_uf", "bio", "specialties", "target_city",
        "target_uf", "extra_cities", "verified_oab", "featured",
        "photo_url", "website", "instagram", "linkedin", "office_hours"
      ];
      // Campos da migration 0005 — caso migration não esteja aplicada,
      // descartamos esses campos no retry abaixo (mesma estratégia do
      // /api/painel/profile).
      const PREMIUM_NEW_COLS: ReadonlyArray<keyof LawyerRow> = [
        "photo_url", "website", "instagram", "linkedin", "office_hours"
      ];
      // Normaliza URLs (website) — auto-prepende https:// se ausente,
      // rejeita protocolos perigosos. Espelha lógica de /api/painel/profile.
      const normalizeUrl = (raw: unknown): string | null => {
        if (typeof raw !== "string") return null;
        const t = raw.trim().slice(0, 250);
        if (!t) return null;
        const lower = t.toLowerCase();
        if (lower.startsWith("javascript:") || lower.startsWith("data:")) return null;
        if (!/^https?:\/\//i.test(t)) return `https://${t}`;
        return t;
      };

      // Normaliza handle Instagram/LinkedIn — remove @ e URL.
      const normalizeHandle = (raw: unknown, max: number): string | null => {
        if (typeof raw !== "string") return null;
        const t = raw.trim().slice(0, max);
        if (!t) return null;
        const m = t.match(/(?:instagram\.com|linkedin\.com\/in)\/([^/?#]+)/i);
        if (m) return m[1].replace(/^@/, "").trim() || null;
        return t.replace(/^@/, "").trim() || null;
      };

      const filtered: Partial<LawyerRow> = {};
      for (const key of ALLOWED) {
        if (key in body.fields) {
          let v = body.fields[key];
          // Normalização defensiva conforme o tipo do campo
          if (key === "website") v = normalizeUrl(v);
          else if (key === "instagram") v = normalizeHandle(v, 60);
          else if (key === "linkedin") v = normalizeHandle(v, 100);
          (filtered as Record<string, unknown>)[key] = v;
        }
      }
      if (Object.keys(filtered).length === 0) {
        return NextResponse.json({ ok: false, error: "Nenhum campo válido" }, { status: 400 });
      }
      const admin = createAdminClient();
      let { error } = await admin
        .from("lawyers")
        .update(filtered)
        .eq("id", body.id);

      if (error && /column .+ does not exist/i.test(error.message)) {
        console.warn("[admin] migration 0005 pending — retrying without new cols");
        const safeUpdate: Partial<LawyerRow> = { ...filtered };
        for (const col of PREMIUM_NEW_COLS) {
          delete safeUpdate[col];
        }
        if (Object.keys(safeUpdate).length === 0) {
          return NextResponse.json({
            ok: false,
            error: "Migration 0005 ainda não foi aplicada. Aplique no Supabase para editar foto/redes/horarios."
          }, { status: 503 });
        }
        const retry = await admin
          .from("lawyers")
          .update(safeUpdate)
          .eq("id", body.id);
        error = retry.error;
      }

      if (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      }
      // Sync de name no auth.users.user_metadata se foi alterado
      if (filtered.name && typeof filtered.name === "string") {
        try {
          await admin.auth.admin.updateUserById(body.id, {
            user_metadata: { name: filtered.name }
          });
        } catch (err) {
          console.warn("[admin] auth metadata sync failed", err);
        }
      }
      await revalidateLawyerPages(body.id);
      return NextResponse.json({ ok: true });
    }
    case "remove-photo": {
      if (!body.id) return NextResponse.json({ ok: false, error: "ID obrigatório" }, { status: 400 });
      const admin = createAdminClient();
      // Apaga arquivos no Storage (qualquer extensão que possa existir)
      const possible = [`${body.id}.jpg`, `${body.id}.png`, `${body.id}.webp`];
      await admin.storage.from("avatars").remove(possible).catch(() => {
        // ignora — pode não existir bucket ou arquivos
      });
      // Zera coluna photo_url
      const { error } = await admin
        .from("lawyers")
        .update({ photo_url: null } as Partial<LawyerRow>)
        .eq("id", body.id);
      if (error && /column .+ does not exist/i.test(error.message)) {
        // Migration pendente — não há nada a fazer no banco
        return NextResponse.json({ ok: true });
      }
      if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      await revalidateLawyerPages(body.id);
      return NextResponse.json({ ok: true });
    }
    case "list-articles": {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("blog_articles")
        .select("id,slug,title,category,status,reading_minutes,created_at,published_at")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true, articles: data ?? [] });
    }
    case "toggle-article-status": {
      if (!body.id) return NextResponse.json({ ok: false, error: "ID ausente" }, { status: 400 });
      const supabase = createAdminClient();
      const { data: article } = await supabase
        .from("blog_articles")
        .select("status")
        .eq("id", body.id)
        .maybeSingle();
      if (!article) return NextResponse.json({ ok: false, error: "Artigo não encontrado" }, { status: 404 });
      const newStatus = article.status === "published" ? "draft" : "published";
      const update: { status: string; published_at?: string } = { status: newStatus };
      if (newStatus === "published" && !article.status) update.published_at = new Date().toISOString();
      const { error } = await supabase.from("blog_articles").update(update).eq("id", body.id);
      if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      revalidatePath("/blog");
      return NextResponse.json({ ok: true, status: newStatus });
    }
    case "delete-article": {
      if (!body.id) return NextResponse.json({ ok: false, error: "ID ausente" }, { status: 400 });
      const supabase = createAdminClient();
      const { error } = await supabase.from("blog_articles").delete().eq("id", body.id);
      if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      revalidatePath("/blog");
      return NextResponse.json({ ok: true });
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
