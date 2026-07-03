import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminRequest } from "@/lib/auth/adminSession";
import { revalidateLawyerPagesById } from "@/lib/painel/revalidate";
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
import { logAdminAction, listAuditLogs } from "@/lib/data/audit";
import { callAI } from "@/lib/ai/core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Revalidação unificada (lib/painel/revalidate.ts) — mesma implementação do
 * painel e do cron expire-premium. Cobre perfil, home, /advogados, sitemap,
 * páginas de estado/cidade/especialidade e /advogados-de/[area]/em/[cidade],
 * com specialties normalizadas para o slug canônico das rotas.
 */
const revalidateLawyerPages = revalidateLawyerPagesById;

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
 *  - delete-message { id }
 *  - list-audit-logs (últimas 100 ações administrativas)
 *
 * Auditoria: os cases mutadores gravam em audit_logs via logAdminAction
 * (lib/data/audit.ts). Falha no log nunca quebra a ação principal.
 */

/**
 * Busca nome/email do advogado alvo para enriquecer o log de auditoria.
 * Nunca lança — em caso de erro devolve objeto vazio (o log sai só com o id).
 */
async function lawyerLogDetails(id: string): Promise<Record<string, unknown>> {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("lawyers")
      .select("name,email")
      .eq("id", id)
      .maybeSingle();
    return { name: data?.name ?? null, email: data?.email ?? null };
  } catch {
    return {};
  }
}

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
      if (result.ok) {
        await revalidateLawyerPages(body.id);
        await logAdminAction("activate-premium", body.id, {
          ...(await lawyerLogDetails(body.id)),
          dias: body.days ?? 30
        });
      }
      return NextResponse.json(result, { status: result.ok ? 200 : 500 });
    }
    case "deactivate-premium": {
      if (!body.id) return NextResponse.json({ ok: false, error: "ID ausente" }, { status: 400 });
      const result = await adminDeactivatePremium(body.id);
      if (result.ok) {
        await revalidateLawyerPages(body.id);
        await logAdminAction(
          "deactivate-premium",
          body.id,
          await lawyerLogDetails(body.id)
        );
      }
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

      // Contexto do alvo pra auditoria — buscado ANTES da mutação (no caso
      // de erro, nada é logado; no sucesso, log em cada branch abaixo).
      const planLogDetails = { ...(await lawyerLogDetails(body.id)), status };

      if (status === "active") {
        const result = await adminActivatePremium(body.id);
        if (!result.ok) {
          return NextResponse.json(result, { status: 500 });
        }
        await revalidateLawyerPages(body.id);
        await logAdminAction("set-plan-status", body.id, planLogDetails);
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
        await logAdminAction("set-plan-status", body.id, planLogDetails);
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
      await logAdminAction("set-plan-status", body.id, planLogDetails);
      return NextResponse.json({ ok: true });
    }
    case "toggle-featured": {
      if (!body.id) return NextResponse.json({ ok: false, error: "ID ausente" }, { status: 400 });
      const result = await adminToggleFeatured(body.id, !!body.value);
      if (result.ok) {
        await revalidateLawyerPages(body.id);
        await logAdminAction("toggle-featured", body.id, {
          ...(await lawyerLogDetails(body.id)),
          destaque: !!body.value
        });
      }
      return NextResponse.json(result, { status: result.ok ? 200 : 500 });
    }
    case "toggle-verified-oab": {
      if (!body.id) return NextResponse.json({ ok: false, error: "ID ausente" }, { status: 400 });
      const result = await adminToggleVerifiedOab(body.id, !!body.value);
      if (result.ok) {
        await revalidateLawyerPages(body.id);
        await logAdminAction("toggle-verified-oab", body.id, {
          ...(await lawyerLogDetails(body.id)),
          verificada: !!body.value
        });
      }
      return NextResponse.json(result, { status: result.ok ? 200 : 500 });
    }
    case "delete-lawyer": {
      if (!body.id) return NextResponse.json({ ok: false, error: "ID ausente" }, { status: 400 });
      // Revalida ANTES do delete (depois não existe mais o lawyer para buscar slugs)
      await revalidateLawyerPages(body.id);
      // Auditoria: gravada DENTRO de adminDeleteLawyer (lib/data/lawyers.ts),
      // que captura nome/email/oab antes do delete. Não logar aqui de novo.
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
    case "draft-message-reply": {
      // Rascunho de resposta por IA para uma mensagem de contato/suporte.
      // Não envia nada — só devolve o texto para o admin revisar e editar.
      if (!body.id)
        return NextResponse.json({ ok: false, error: "ID ausente" }, { status: 400 });
      const adminClient = createAdminClient({ noStore: true });
      const { data: message } = await adminClient
        .from("messages")
        .select("from_name, subject, body, source")
        .eq("id", body.id)
        .maybeSingle();
      if (!message)
        return NextResponse.json(
          { ok: false, error: "Mensagem não encontrada" },
          { status: 404 }
        );

      const primeiroNome =
        (message.from_name || "").trim().split(/\s+/)[0] || "";
      const r = await callAI({
        feature: "admin_message_reply",
        action: "draft_reply",
        messages: [
          {
            role: "system",
            content:
              "Você é o atendimento do AdvAqui (diretório de advogados brasileiro). " +
              "Redija uma resposta cordial, objetiva e humana para a mensagem recebida, " +
              "pronta para o atendente revisar e enviar. Português brasileiro, no máximo 5 frases. " +
              `Comece com "Olá${primeiroNome ? ", " + primeiroNome : ""}!". ` +
              "NUNCA mencione inteligência artificial, IA, robô ou automação. " +
              "NUNCA prometa resultado, êxito ou prazo garantido. " +
              "Se for dúvida jurídica, oriente a pessoa a buscar um advogado no site (sem dar parecer). " +
              "Devolva apenas o texto da resposta, sem assinatura de nome próprio."
          },
          {
            role: "user",
            content: [
              `Canal: ${message.source}`,
              `De: ${message.from_name}`,
              message.subject && `Assunto: ${message.subject}`,
              `Mensagem: ${message.body}`
            ]
              .filter(Boolean)
              .join("\n")
          }
        ],
        maxTokens: 500,
        temperature: 0.4
      });

      if (!r.ok)
        return NextResponse.json(
          { ok: false, error: "Não foi possível gerar o rascunho agora." },
          { status: 502 }
        );
      return NextResponse.json({ ok: true, draft: r.text });
    }
    case "set-email": {
      if (!body.id || !body.email)
        return NextResponse.json({ ok: false, error: "ID e email obrigatórios" }, { status: 400 });
      const admin = createAdminClient();
      const newEmail = body.email.trim().toLowerCase();
      // Captura o e-mail ANTERIOR antes de sobrescrever (para o log).
      const previous = await lawyerLogDetails(body.id);
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
      await logAdminAction("set-email", body.id, {
        name: previous.name ?? null,
        email_anterior: previous.email ?? null,
        email_novo: newEmail
      });
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
      // Auditoria: registra QUE a senha foi trocada — nunca a senha em si.
      await logAdminAction(
        "set-password",
        body.id,
        await lawyerLogDetails(body.id)
      );
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
      await logAdminAction("update-lawyer", body.id, {
        ...(await lawyerLogDetails(body.id)),
        campos: Object.keys(filtered)
      });
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
        await logAdminAction(
          "remove-photo",
          body.id,
          await lawyerLogDetails(body.id)
        );
        return NextResponse.json({ ok: true });
      }
      if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      await revalidateLawyerPages(body.id);
      await logAdminAction(
        "remove-photo",
        body.id,
        await lawyerLogDetails(body.id)
      );
      return NextResponse.json({ ok: true });
    }
    case "delete-message": {
      if (!body.id) return NextResponse.json({ ok: false, error: "ID ausente" }, { status: 400 });
      const admin = createAdminClient();
      // Captura o remetente ANTES do delete (para o log de auditoria).
      const { data: msg } = await admin
        .from("messages")
        .select("from_name,from_email,subject")
        .eq("id", body.id)
        .maybeSingle();
      const { error } = await admin.from("messages").delete().eq("id", body.id);
      if (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      }
      await logAdminAction("delete-message", body.id, {
        remetente: msg?.from_name ?? null,
        email: msg?.from_email ?? null,
        assunto: msg?.subject ?? null
      });
      return NextResponse.json({ ok: true });
    }
    case "list-audit-logs": {
      // Últimas 100 ações administrativas (exibidas na aba Resumo do /admin).
      const logs = await listAuditLogs(100);
      return NextResponse.json({ ok: true, logs });
    }
    case "list-articles": {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("blog_articles")
        .select("id,slug,title,category,status,reading_minutes,created_at,published_at,author_id,author_name")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true, articles: data ?? [] });
    }
    case "approve-article": {
      if (!body.id) return NextResponse.json({ ok: false, error: "ID ausente" }, { status: 400 });
      const supabase = createAdminClient();
      const { error } = await supabase
        .from("blog_articles")
        .update({ status: "published", published_at: new Date().toISOString() })
        .eq("id", body.id);
      if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      revalidatePath("/blog");
      return NextResponse.json({ ok: true, status: "published" });
    }
    case "reject-article": {
      if (!body.id) return NextResponse.json({ ok: false, error: "ID ausente" }, { status: 400 });
      const supabase = createAdminClient();
      const { error } = await supabase
        .from("blog_articles")
        .update({ status: "rejected" })
        .eq("id", body.id);
      if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      // O artigo pode ter estado publicado — revalida a listagem do blog
      // para ele sumir de lá imediatamente.
      revalidatePath("/blog");
      return NextResponse.json({ ok: true, status: "rejected" });
    }
    case "toggle-article-status": {
      if (!body.id) return NextResponse.json({ ok: false, error: "ID ausente" }, { status: 400 });
      const supabase = createAdminClient();
      const { data: article } = await supabase
        .from("blog_articles")
        .select("status,published_at")
        .eq("id", body.id)
        .maybeSingle();
      if (!article) return NextResponse.json({ ok: false, error: "Artigo não encontrado" }, { status: 404 });
      const newStatus = article.status === "published" ? "draft" : "published";
      const update: { status: string; published_at?: string } = { status: newStatus };
      // BUG FIX (Julho/2026): a condição antiga era `!article.status`, que
      // nunca é true (status sempre existe) — artigos publicados via toggle
      // ficavam sem published_at. O certo é checar published_at.
      if (newStatus === "published" && !article.published_at) {
        update.published_at = new Date().toISOString();
      }
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
