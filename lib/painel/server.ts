import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { LawyerRow, ExtraCityRow } from "@/lib/supabase/types";
import { mapLawyerRow } from "@/lib/data/lawyer-mapper";
import { titleCaseNameBR } from "@/lib/utils/format";
import { slugify } from "@/lib/utils/slug";

type AdminClient = ReturnType<typeof createAdminClient>;

type AuthResult =
  | { ok: true; admin: AdminClient; lawyer: LawyerRow }
  | {
      ok: false;
      status: 401 | 404 | 500;
      code: "unauthorized" | "profile_missing" | "server_error";
      error: string;
    };

export type PanelLawyerPayload = ReturnType<typeof mapLawyerRow>;

const updateAuthName = async (
  admin: AdminClient,
  lawyerId: string,
  name: string
): Promise<void> => {
  try {
    await admin.auth.admin.updateUserById(lawyerId, {
      user_metadata: { name }
    });
  } catch (err) {
    console.warn("[painel] auth metadata name update failed", err);
  }
};

export async function normalizeLawyerName(
  admin: AdminClient,
  row: LawyerRow
): Promise<LawyerRow> {
  const normalized = titleCaseNameBR(row.name);
  if (!normalized || normalized === row.name) return row;

  const { data, error } = await admin
    .from("lawyers")
    .update({ name: normalized })
    .eq("id", row.id)
    .select("*")
    .maybeSingle();

  if (error || !data) {
    console.warn("[painel] lawyer name normalization failed", error?.message);
    return { ...row, name: normalized };
  }

  await updateAuthName(admin, row.id, normalized);
  return data as LawyerRow;
}

export async function getCurrentLawyer(): Promise<AuthResult> {
  const supabase = createClient();
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      ok: false,
      status: 401,
      code: "unauthorized",
      error: "Sessão expirada. Faça login novamente."
    };
  }

  // noStore: este SELECT roda em GET route handlers do painel com URL
  // constante por usuário — sem no-store, o Data Cache devolve o perfil
  // congelado depois de um PUT/PATCH que o alterou.
  const admin = createAdminClient({ noStore: true });
  const { data, error } = await admin
    .from("lawyers")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("[painel] profile load failed", error);
    return {
      ok: false,
      status: 500,
      code: "server_error",
      error: "Não foi possível carregar seu perfil agora."
    };
  }

  if (!data) {
    return {
      ok: false,
      status: 404,
      code: "profile_missing",
      error: "Cadastro incompleto. Refaça o cadastro ou fale com o suporte."
    };
  }

  const lawyer = await normalizeLawyerName(admin, data as LawyerRow);
  return { ok: true, admin, lawyer };
}

export function normalizeExtraCities(input: unknown): ExtraCityRow[] {
  if (!Array.isArray(input)) return [];

  const seen = new Set<string>();
  const normalized: ExtraCityRow[] = [];

  for (const item of input) {
    if (!item || typeof item !== "object") continue;
    const raw = item as Partial<ExtraCityRow>;
    const rawName = typeof raw.name === "string" ? raw.name.trim() : "";
    // Capitaliza para Title Case BR (consistente com cidade principal)
    const name = rawName ? titleCaseNameBR(rawName) : "";
    const uf = typeof raw.uf === "string" ? raw.uf.trim().toUpperCase() : "";
    const slug =
      typeof raw.slug === "string" && raw.slug.trim()
        ? raw.slug.trim().toLowerCase()
        : slugify(name);

    if (!name || !slug || !/^[A-Z]{2}$/.test(uf)) continue;

    const key = `${uf}:${slug}`;
    if (seen.has(key)) continue;
    seen.add(key);
    normalized.push({ name, slug, uf });
    if (normalized.length >= 9) break;
  }

  return normalized;
}

// Implementação unificada movida para lib/painel/revalidate.ts (usada também
// pelo /api/admin e pelo cron expire-premium). Re-export mantém os call sites
// existentes intactos.
export {
  revalidateLawyerPages,
  revalidateLawyerPagesById,
  type RevalidatableLawyer
} from "@/lib/painel/revalidate";

export const toPanelLawyer = (row: LawyerRow): PanelLawyerPayload =>
  mapLawyerRow(row);
