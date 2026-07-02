import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth/adminSession";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { LeadRow } from "@/lib/supabase/types";

/**
 * GET  /api/admin/leads — lista paginada de leads para o painel admin.
 *      Query params: page (1..N), status (filtro), uf (2 letras),
 *      busca (nome ou telefone). 50 por página, mais recentes primeiro.
 *      Cada lead vem com o transcript da conversa (migration 0019) e, quando
 *      houver advogado matcheado, nome + slug dele para link do perfil.
 *
 * POST /api/admin/leads — mutações:
 *      { action: "update-lead",  id, fields }  → campos whitelisted
 *      { action: "archive-lead", id }          → status = 'arquivado'
 *      { action: "delete-lead",  id }          → hard delete (audit antes)
 *
 * Toda mutação grava em audit_logs (migration 0001). Auth pelo cookie HMAC
 * de admin — mesmo esquema do restante do /api/admin.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

/** Valores aceitos pela CHECK constraint de leads.status (migration 0019). */
const LEAD_STATUSES = [
  "novo",
  "qualificado",
  "em_analise",
  "contato_realizado",
  "aguardando_docs",
  "proposta_enviada",
  "contratado",
  "perdido",
  "arquivado"
] as const;

/** Valores aceitos pela CHECK constraint de leads.prioridade. */
const PRIORIDADES = ["baixa", "normal", "alta", "urgente"] as const;

/** transcript consta em LeadRow (types.ts) desde a migration 0019. */
type LeadDbRow = LeadRow;

/** Identificação gravada no audit_logs (painel tem um único admin). */
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@advaqui.com";

type AdminDb = ReturnType<typeof createAdminClient>;

/**
 * Grava uma linha em audit_logs. A tabela não está no Database type
 * (types.ts), então o cast abre mão da checagem de nome de relação —
 * as colunas usadas são exatamente as da migration 0001.
 * Retorna false se a gravação falhar (o chamador decide se é fatal).
 */
async function logAudit(
  admin: AdminDb,
  action: string,
  targetId: string,
  details: Record<string, unknown>
): Promise<boolean> {
  const untyped = admin as unknown as SupabaseClient;
  const { error } = await untyped.from("audit_logs").insert({
    admin_email: ADMIN_EMAIL,
    action,
    target_id: targetId,
    target_type: "lead",
    details
  });
  if (error) {
    console.error("[admin/leads] Falha ao gravar audit_logs:", error.message);
    return false;
  }
  return true;
}

export async function GET(req: Request) {
  if (!isAdminRequest()) {
    return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });
  }
  try {
    const admin = createAdminClient({ noStore: true });
    const url = new URL(req.url);

    const page = Math.max(1, Number.parseInt(url.searchParams.get("page") || "1", 10) || 1);
    const status = (url.searchParams.get("status") || "").trim();
    const uf = (url.searchParams.get("uf") || "").trim().toUpperCase();
    const busca = (url.searchParams.get("busca") || "").trim().slice(0, 80);

    let query = admin
      .from("leads")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if ((LEAD_STATUSES as readonly string[]).includes(status)) {
      query = query.eq("status", status);
    }
    if (/^[A-Z]{2}$/.test(uf)) {
      query = query.eq("uf", uf);
    }
    if (busca) {
      // Vírgula e parênteses quebram a sintaxe do .or() do PostgREST.
      const safe = busca.replace(/[,()%\\]/g, " ").trim();
      if (safe) {
        query = query.or(`nome.ilike.%${safe}%,telefone.ilike.%${safe}%`);
      }
    }

    const from = (page - 1) * PAGE_SIZE;
    const { data, error, count } = await query.range(from, from + PAGE_SIZE - 1);

    let rows: LeadDbRow[] = [];
    let total = 0;
    if (error) {
      // PGRST103 = range além do total (página fora do fim) → lista vazia.
      if (error.code !== "PGRST103") {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      }
    } else {
      rows = (data ?? []) as LeadDbRow[];
      total = count ?? rows.length;
    }

    // 2ª query: nome + slug dos advogados matcheados (para badge com link).
    const lawyerIds = Array.from(
      new Set(
        rows
          .map((r) => r.matched_lawyer_id)
          .filter((v): v is string => typeof v === "string" && v.length > 0)
      )
    );
    const lawyerById = new Map<string, { name: string; slug: string }>();
    if (lawyerIds.length > 0) {
      const { data: lawyers, error: lawyersError } = await admin
        .from("lawyers")
        .select("id,name,slug")
        .in("id", lawyerIds);
      if (lawyersError) {
        console.error("[admin/leads] Falha ao buscar advogados matcheados:", lawyersError.message);
      }
      for (const l of lawyers ?? []) {
        lawyerById.set(l.id, { name: l.name, slug: l.slug });
      }
    }

    // Contagem por status para o filtro (HEAD counts — barato, sem payload).
    const counts: Record<string, number> = {};
    await Promise.all(
      LEAD_STATUSES.map(async (s) => {
        const { count: c, error: cErr } = await admin
          .from("leads")
          .select("id", { count: "exact", head: true })
          .eq("status", s);
        counts[s] = cErr ? 0 : c ?? 0;
      })
    );

    const leads = rows.map((r) => ({
      ...r,
      matched_lawyer: r.matched_lawyer_id
        ? lawyerById.get(r.matched_lawyer_id) ?? null
        : null
    }));

    return NextResponse.json({
      ok: true,
      leads,
      total,
      page,
      pageSize: PAGE_SIZE,
      counts
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

/**
 * Whitelist dos campos editáveis via update-lead. Qualquer campo fora da
 * lista é ignorado; valor de tipo errado derruba a requisição com 400.
 */
function sanitizeLeadFields(
  raw: Record<string, unknown>
): { updates: Partial<LeadRow> } | { invalid: string } {
  const updates: Partial<LeadRow> = {};

  if ("status" in raw) {
    if (
      typeof raw.status !== "string" ||
      !(LEAD_STATUSES as readonly string[]).includes(raw.status)
    ) {
      return { invalid: "Status inválido" };
    }
    updates.status = raw.status;
  }
  if ("prioridade" in raw) {
    if (
      typeof raw.prioridade !== "string" ||
      !(PRIORIDADES as readonly string[]).includes(raw.prioridade)
    ) {
      return { invalid: "Prioridade inválida" };
    }
    updates.prioridade = raw.prioridade;
  }
  if ("observacoes" in raw) {
    if (raw.observacoes !== null && typeof raw.observacoes !== "string") {
      return { invalid: "Observações inválidas" };
    }
    const texto = typeof raw.observacoes === "string" ? raw.observacoes.trim().slice(0, 4000) : "";
    updates.observacoes = texto === "" ? null : texto;
  }
  if ("etiquetas" in raw) {
    if (
      !Array.isArray(raw.etiquetas) ||
      raw.etiquetas.some((e) => typeof e !== "string")
    ) {
      return { invalid: "Etiquetas inválidas" };
    }
    updates.etiquetas = (raw.etiquetas as string[])
      .map((e) => e.trim().slice(0, 60))
      .filter(Boolean)
      .slice(0, 20);
  }
  if ("proxima_acao" in raw) {
    if (raw.proxima_acao !== null && typeof raw.proxima_acao !== "string") {
      return { invalid: "Próxima ação inválida" };
    }
    const texto =
      typeof raw.proxima_acao === "string" ? raw.proxima_acao.trim().slice(0, 500) : "";
    updates.proxima_acao = texto === "" ? null : texto;
  }

  if (Object.keys(updates).length === 0) {
    return { invalid: "Nenhum campo editável informado" };
  }
  return { updates };
}

type PostBody = {
  action?: string;
  id?: string;
  fields?: Record<string, unknown>;
};

export async function POST(req: Request) {
  if (!isAdminRequest()) {
    return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });
  }

  let body: PostBody;
  try {
    body = (await req.json()) as PostBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Requisição inválida" }, { status: 400 });
  }

  const action = typeof body.action === "string" ? body.action : "";
  const id = typeof body.id === "string" ? body.id.trim() : "";
  if (!id) {
    return NextResponse.json({ ok: false, error: "Lead não informado" }, { status: 400 });
  }

  try {
    const admin = createAdminClient({ noStore: true });

    // -----------------------------------------------------------------
    // update-lead — edita campos whitelisted (status, prioridade,
    // observações, etiquetas, próxima ação).
    // -----------------------------------------------------------------
    if (action === "update-lead") {
      const raw = body.fields && typeof body.fields === "object" ? body.fields : {};
      const result = sanitizeLeadFields(raw);
      if ("invalid" in result) {
        return NextResponse.json({ ok: false, error: result.invalid }, { status: 400 });
      }
      const { data: updated, error } = await admin
        .from("leads")
        .update(result.updates)
        .eq("id", id)
        .select("id");
      if (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      }
      if (!updated || updated.length === 0) {
        return NextResponse.json({ ok: false, error: "Lead não encontrado" }, { status: 404 });
      }
      await logAudit(admin, "update-lead", id, { fields: result.updates });
      return NextResponse.json({ ok: true, updates: result.updates });
    }

    // -----------------------------------------------------------------
    // archive-lead — atalho para status = 'arquivado'.
    // -----------------------------------------------------------------
    if (action === "archive-lead") {
      const { data: updated, error } = await admin
        .from("leads")
        .update({ status: "arquivado" })
        .eq("id", id)
        .select("id");
      if (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      }
      if (!updated || updated.length === 0) {
        return NextResponse.json({ ok: false, error: "Lead não encontrado" }, { status: 404 });
      }
      await logAudit(admin, "archive-lead", id, { status: "arquivado" });
      return NextResponse.json({ ok: true });
    }

    // -----------------------------------------------------------------
    // delete-lead — hard delete. Grava PRIMEIRO no audit_logs (nome,
    // telefone, cidade) para restar um rastro; se o log falhar, aborta
    // sem apagar nada.
    // -----------------------------------------------------------------
    if (action === "delete-lead") {
      const { data: lead, error: findError } = await admin
        .from("leads")
        .select("id,nome,telefone,cidade,uf,area_juridica")
        .eq("id", id)
        .maybeSingle();
      if (findError) {
        return NextResponse.json({ ok: false, error: findError.message }, { status: 500 });
      }
      if (!lead) {
        return NextResponse.json({ ok: false, error: "Lead não encontrado" }, { status: 404 });
      }

      const logged = await logAudit(admin, "delete-lead", id, {
        nome: lead.nome,
        telefone: lead.telefone,
        cidade: lead.cidade,
        uf: lead.uf,
        area_juridica: lead.area_juridica
      });
      if (!logged) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "Não foi possível registrar a exclusão no histórico — nada foi apagado. Tente de novo."
          },
          { status: 500 }
        );
      }

      const { error: delError } = await admin.from("leads").delete().eq("id", id);
      if (delError) {
        return NextResponse.json({ ok: false, error: delError.message }, { status: 500 });
      }
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: false, error: "Ação desconhecida" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
