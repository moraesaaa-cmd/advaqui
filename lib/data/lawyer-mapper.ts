import type { LawyerRow, PublicLawyer, PlanStatus } from "@/lib/supabase/types";

/**
 * Tipos e mapeadores puros, **sem dependência de `next/headers`** —
 * podem ser importados por Client Components e Server Components.
 *
 * O arquivo `lib/data/lawyers.ts` re-exporta esses símbolos para manter
 * compatibilidade com código já existente que importa de `@/lib/data/lawyers`.
 *
 * IMPORTANTE — nunca adicione aqui imports que dependam de runtime Node.js
 * (ex.: `cookies` de `next/headers`, ou clientes Supabase server-side).
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
// Usado pelos selects do server-side em lawyers.ts.
export const PUBLIC_COLUMNS =
  "id,slug,name,oab,oab_uf,email,phone,whatsapp,address,city_name,city_slug,uf,specialties,bio,plan_status,plan_start_date,plan_end_date,payment_date,featured,verified_oab,target_city,target_uf,created_at,updated_at";
