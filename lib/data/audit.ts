import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Auditoria de ações administrativas — tabela `public.audit_logs`
 * (migration 0001_initial_schema.sql).
 *
 * Colunas reais da tabela (conferidas na migration 0001):
 *   id uuid PK, admin_email text NOT NULL, action text NOT NULL,
 *   target_id uuid NULL, target_type text NULL, details jsonb NULL,
 *   created_at timestamptz NOT NULL default now().
 *
 * A tabela só é acessível via service_role (sem policy para anon/auth),
 * então todo acesso aqui usa `createAdminClient` — NUNCA importar este
 * módulo em Client Components.
 */

export type AuditLogRow = {
  id: string;
  admin_email: string;
  action: string;
  target_id: string | null;
  target_type: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
};

type AuditLogInsert = {
  admin_email: string;
  action: string;
  target_id: string | null;
  target_type: string | null;
  details: Record<string, unknown>;
};

/**
 * `audit_logs` existe no banco desde a migration 0001, mas não está declarada
 * no Database type mantido à mão em `lib/supabase/types.ts`. Este shape
 * mínimo tipa apenas as duas operações usadas aqui (insert e select
 * ordenado com limit), sem recorrer a `any`.
 */
type AuditClient = {
  from: (table: "audit_logs") => {
    insert: (
      row: AuditLogInsert
    ) => PromiseLike<{ error: { message: string } | null }>;
    select: (columns: string) => {
      order: (
        column: string,
        opts: { ascending: boolean }
      ) => {
        limit: (n: number) => PromiseLike<{
          data: AuditLogRow[] | null;
          error: { message: string } | null;
        }>;
      };
    };
  };
};

function auditClient(): AuditClient {
  // noStore: rotas admin releem o que acabaram de gravar — sem isso o
  // Data Cache do Next congela o SELECT num snapshot antigo.
  return createAdminClient({ noStore: true }) as unknown as AuditClient;
}

/**
 * Registra uma ação administrativa em `audit_logs`.
 *
 * NUNCA lança: falha no insert não pode quebrar a ação principal do admin
 * (ativar plano, excluir cadastro, etc). Erros vão para console.error.
 *
 * @param action   nome curto da ação (ex.: "activate-premium", "delete-lawyer")
 * @param targetId uuid do alvo (lawyer/mensagem) ou null
 * @param details  contexto mínimo útil (nome/email do alvo, campo alterado…)
 */
export async function logAdminAction(
  action: string,
  targetId: string | null,
  details: Record<string, unknown>
): Promise<void> {
  try {
    const db = auditClient();
    const { error } = await db.from("audit_logs").insert({
      admin_email: process.env.ADMIN_EMAIL || "admin@advaqui.com",
      action,
      target_id: targetId,
      target_type: action.includes("message") ? "message" : "lawyer",
      details
    });
    if (error) {
      console.error("[audit] insert em audit_logs falhou:", error.message);
    }
  } catch (err) {
    console.error("[audit] logAdminAction falhou:", err);
  }
}

/**
 * Lista as últimas ações administrativas (mais recentes primeiro).
 * Retorna [] em caso de erro — a exibição no painel é informativa,
 * nunca pode derrubar a página.
 */
export async function listAuditLogs(limit = 100): Promise<AuditLogRow[]> {
  try {
    const db = auditClient();
    const { data, error } = await db
      .from("audit_logs")
      .select("id,admin_email,action,target_id,target_type,details,created_at")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) {
      console.error("[audit] listAuditLogs falhou:", error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("[audit] listAuditLogs falhou:", err);
    return [];
  }
}
