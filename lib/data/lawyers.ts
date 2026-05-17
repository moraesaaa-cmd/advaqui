import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { LawyerRow, PublicLawyer, PlanStatus } from "@/lib/supabase/types";

/**
 * Funções server-side de acesso a `public.lawyers`.
 *
 * - Funções `get*` usam o cliente normal (respeita RLS).
 * - Funções `admin*` usam o cliente service_role (ignora RLS, só Route Handlers).
 * - Funções retornam tipo `Lawyer` (camelCase) compatível com os componentes
 *   existentes (LawyerCard, schema, sitemap).
 */

// Tipo público usado pelos componentes (camelCase, sem CPF).
export type Lawyer = {
  id: string;
  slug: string;
  name: string;
  oab: string;
  oabUf: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  cityName: string;
  citySlug: string;
  uf: string;
  specialties: string[];
  bio?: string;
  planStatus: PlanStatus;
  planStartDate?: string;
  planEndDate?: string;
  paymentDate?: string;
  featured?: boolean;
  verifiedOab?: boolean;
  targetCity?: string;
  targetUf?: string;
  createdAt: string;
};

export const mapLawyerRow = (row: LawyerRow | PublicLawyer): Lawyer => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  oab: row.oab,
  oabUf: row.oab_uf,
  email: row.email,
  phone: row.phone || undefined,
  whatsapp: row.whatsapp || undefined,
  address: row.address || undefined,
  cityName: row.city_name,
  citySlug: row.city_slug,
  uf: row.uf,
  specialties: row.specialties || [],
  bio: row.bio || undefined,
  planStatus: row.plan_status,
  planStartDate: row.plan_start_date || undefined,
  planEndDate: row.plan_end_date || undefined,
  paymentDate: row.payment_date || undefined,
  featured: row.featured,
  verifiedOab: row.verified_oab,
  targetCity: row.target_city || undefined,
  targetUf: row.target_uf || undefined,
  createdAt: row.created_at
});

// Colunas seguras para exposição pública (sem CPF).
const PUBLIC_COLUMNS =
  "id,slug,name,oab,oab_uf,email,phone,whatsapp,address,city_name,city_slug,uf,specialties,bio,plan_status,plan_start_date,plan_end_date,payment_date,featured,verified_oab,target_city,target_uf,created_at,updated_at";

/**
 * Lista advogados de uma cidade específica (uf+slug).
 * Inclui também advogados com `target_city/target_uf` apontando para essa cidade
 * (advogados redirecionados manualmente pelo admin).
 */
export async function getLawyersForCity(
  uf: string,
  citySlug: string
): Promise<Lawyer[]> {
  const supabase = createClient();
  const ufUpper = uf.toUpperCase();
  const { data, error } = await supabase
    .from("lawyers")
    .select(PUBLIC_COLUMNS)
    .or(
      `and(uf.eq.${ufUpper},city_slug.eq.${citySlug}),and(target_uf.eq.${ufUpper},target_city.eq.${citySlug})`
    )
    .order("plan_status", { ascending: false }) // active vem antes de free
    .order("featured", { ascending: false })
    .order("name", { ascending: true });

  if (error) {
    console.error("getLawyersForCity error:", error.message);
    return [];
  }
  return (data || []).map((r) => mapLawyerRow(r as PublicLawyer));
}

/**
 * Filtra advogados de uma cidade que tenham uma especialidade específica.
 */
export async function getLawyersBySpecialty(
  uf: string,
  citySlug: string,
  specialty: string
): Promise<Lawyer[]> {
  const all = await getLawyersForCity(uf, citySlug);
  return all.filter((l) => l.specialties.includes(specialty));
}

/**
 * Lista todos os advogados de um estado (qualquer cidade).
 */
export async function getLawyersForState(uf: string): Promise<Lawyer[]> {
  const supabase = createClient();
  const ufUpper = uf.toUpperCase();
  const { data, error } = await supabase
    .from("lawyers")
    .select(PUBLIC_COLUMNS)
    .eq("uf", ufUpper)
    .order("name", { ascending: true });

  if (error) {
    console.error("getLawyersForState error:", error.message);
    return [];
  }
  return (data || []).map((r) => mapLawyerRow(r as PublicLawyer));
}

/**
 * Busca um advogado pelo slug (URL pública /p/[slug]).
 */
export async function findLawyerBySlug(slug: string): Promise<Lawyer | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("lawyers")
    .select(PUBLIC_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("findLawyerBySlug error:", error.message);
    return null;
  }
  if (!data) return null;
  return mapLawyerRow(data as PublicLawyer);
}

/**
 * Lista todos os slugs públicos (usado em generateStaticParams).
 */
export async function getAllLawyerSlugs(): Promise<string[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("lawyers")
    .select("slug")
    .limit(1000);

  if (error) {
    console.error("getAllLawyerSlugs error:", error.message);
    return [];
  }
  return (data || []).map((r) => r.slug);
}

/**
 * Contagem total de advogados cadastrados.
 */
export async function getLawyerCount(): Promise<number> {
  const supabase = createClient();
  const { count, error } = await supabase
    .from("lawyers")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("getLawyerCount error:", error.message);
    return 0;
  }
  return count || 0;
}

/**
 * Retorna um mapa { uf: count } com a quantidade de advogados por estado.
 * Uma única query no banco, agregado no app — evita 27 queries separadas
 * pela página /advogados (diretório de estados).
 */
export async function getLawyerCountsByState(): Promise<Record<string, number>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("lawyers")
    .select("uf");

  if (error) {
    console.error("getLawyerCountsByState error:", error.message);
    return {};
  }
  const map: Record<string, number> = {};
  for (const r of data || []) {
    const uf = (r as { uf: string }).uf;
    if (uf) map[uf] = (map[uf] || 0) + 1;
  }
  return map;
}

/**
 * Retorna um mapa { citySlug: count } com a quantidade de advogados por cidade
 * de um estado. Usado pela página /advogados/[uf] que lista 100+ cidades.
 * Uma única query, agregado no app — evita N+1.
 */
export async function getLawyerCountsByCity(
  uf: string
): Promise<Record<string, number>> {
  const supabase = createClient();
  const ufUpper = uf.toUpperCase();
  const { data, error } = await supabase
    .from("lawyers")
    .select("city_slug")
    .eq("uf", ufUpper);

  if (error) {
    console.error("getLawyerCountsByCity error:", error.message);
    return {};
  }
  const map: Record<string, number> = {};
  for (const r of data || []) {
    const slug = (r as { city_slug: string }).city_slug;
    if (slug) map[slug] = (map[slug] || 0) + 1;
  }
  return map;
}

// =====================================================================
// FUNÇÕES ADMIN — usam service_role, ignoram RLS
// USE APENAS em Route Handlers protegidos por verificação admin
// =====================================================================

/**
 * Lista TODOS os advogados (incluindo CPF, status, etc).
 */
export async function adminListLawyers(): Promise<LawyerRow[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("lawyers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("adminListLawyers error:", error.message);
    return [];
  }
  return data || [];
}

/**
 * Ativa plano premium para um advogado por X dias.
 */
export async function adminActivatePremium(
  lawyerId: string,
  days = 30
): Promise<{ ok: boolean; error?: string }> {
  const admin = createAdminClient();
  const now = new Date();
  const expires = new Date(now);
  expires.setDate(expires.getDate() + days);

  const { error } = await admin
    .from("lawyers")
    .update({
      plan_status: "active",
      plan_start_date: now.toISOString(),
      plan_end_date: expires.toISOString()
    })
    .eq("id", lawyerId);

  if (error) return { ok: false, error: error.message };

  // Registra no histórico
  await admin.from("plan_history").insert({
    lawyer_id: lawyerId,
    amount: 59.9,
    status: "confirmed",
    payment_date: now.toISOString(),
    expires_at: expires.toISOString()
  });

  return { ok: true };
}

export async function adminDeactivatePremium(
  lawyerId: string
): Promise<{ ok: boolean; error?: string }> {
  const admin = createAdminClient();
  const { error } = await admin
    .from("lawyers")
    .update({
      plan_status: "free",
      plan_start_date: null,
      plan_end_date: null,
      featured: false
    })
    .eq("id", lawyerId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function adminToggleFeatured(
  lawyerId: string,
  value: boolean
): Promise<{ ok: boolean; error?: string }> {
  const admin = createAdminClient();
  const { error } = await admin
    .from("lawyers")
    .update({ featured: value })
    .eq("id", lawyerId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function adminToggleVerifiedOab(
  lawyerId: string,
  value: boolean
): Promise<{ ok: boolean; error?: string }> {
  const admin = createAdminClient();
  const { error } = await admin
    .from("lawyers")
    .update({ verified_oab: value })
    .eq("id", lawyerId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function adminDeleteLawyer(
  lawyerId: string
): Promise<{ ok: boolean; error?: string }> {
  const admin = createAdminClient();
  // Apaga em auth.users (cascade apaga lawyers via FK)
  const { error } = await admin.auth.admin.deleteUser(lawyerId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/**
 * Ordena uma lista de advogados conforme regras do produto:
 * - Premium ativos e/ou featured no topo
 * - Resto alfabético
 */
export function sortLawyers(list: Lawyer[]): Lawyer[] {
  return [...list].sort((a, b) => {
    const aPrem = a.planStatus === "active" || a.featured;
    const bPrem = b.planStatus === "active" || b.featured;
    if (aPrem && !bPrem) return -1;
    if (!aPrem && bPrem) return 1;
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return a.name.localeCompare(b.name, "pt-BR");
  });
}
