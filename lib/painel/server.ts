import { revalidatePath } from "next/cache";
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
      error: "Sessao expirada. Faca login novamente."
    };
  }

  const admin = createAdminClient();
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
      error: "Nao foi possivel carregar seu perfil agora."
    };
  }

  if (!data) {
    return {
      ok: false,
      status: 404,
      code: "profile_missing",
      error: "Cadastro incompleto. Refaca o cadastro ou fale com o suporte."
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

export function revalidateLawyerPages(
  lawyer: Pick<
    LawyerRow,
    | "slug"
    | "uf"
    | "city_slug"
    | "target_uf"
    | "target_city"
    | "extra_cities"
    | "specialties"
  >
): void {
  const paths = new Set<string>();
  paths.add("/");
  // URL canônica nova (Maio/2026) + URL legada que ainda faz redirect 301
  paths.add(`/advogado/${lawyer.slug}`);
  paths.add(`/p/${lawyer.slug}`);
  paths.add("/advogados");
  // Sitemap principal — força regeneração pra Google/Bing verem artigos novos
  paths.add("/sitemap.xml");

  const specs = Array.isArray(lawyer.specialties) ? lawyer.specialties : [];

  /**
   * Coleta todas as (uf, citySlug) onde o lawyer aparece: cidade principal,
   * target legado e cidades adicionais. Para cada uma, revalidamos a página
   * da cidade + uma página por especialidade do user (não todas as 15+
   * especialidades, só as relevantes — economiza ~90% das chamadas).
   */
  type CityPair = { uf: string; slug: string };
  const cityPairs: CityPair[] = [];
  cityPairs.push({ uf: lawyer.uf, slug: lawyer.city_slug });
  if (lawyer.target_uf && lawyer.target_city) {
    cityPairs.push({ uf: lawyer.target_uf, slug: lawyer.target_city });
  }
  const extras = Array.isArray(lawyer.extra_cities) ? lawyer.extra_cities : [];
  for (const city of extras) {
    if (city?.uf && city?.slug) {
      cityPairs.push({ uf: city.uf, slug: city.slug });
    }
  }

  for (const pair of cityPairs) {
    const ufLower = pair.uf.toLowerCase();
    // Página do estado (índice de cidades)
    paths.add(`/advogados/${ufLower}`);
    // Página da cidade
    paths.add(`/advogados/${ufLower}/${pair.slug}`);
    // Páginas por especialidade dessa cidade — só as que o user atua
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
      console.error("[painel] revalidatePath failed", path, err);
    }
  }
}

export const toPanelLawyer = (row: LawyerRow): PanelLawyerPayload =>
  mapLawyerRow(row);
