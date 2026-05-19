import type { LawyerRow, PublicLawyer, PlanStatus } from "@/lib/supabase/types";
import { titleCaseNameBR } from "@/lib/utils/format";

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
export type ExtraCity = { name: string; slug: string; uf: string };

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
  /** Cidades adicionais de atendimento (até 9 no premium). */
  extraCities: ExtraCity[];
  /** Foto de perfil (URL pública). */
  photoUrl?: string;
  /** Site profissional (premium only — vai pra perfil público). */
  website?: string;
  /** Instagram handle (sem @). */
  instagram?: string;
  /** LinkedIn handle ou URL. */
  linkedin?: string;
  /** Horários de atendimento. */
  officeHours?: string;
  createdAt: string;
};

export const mapLawyerRow = (
  row: (LawyerRow | PublicLawyer) & { extra_cities?: unknown }
): Lawyer => {
  // Normaliza extra_cities — pode vir como array, string JSON ou undefined
  // (depende do schema atual do banco; após migration 0003 é sempre array).
  let extras: ExtraCity[] = [];
  const raw = (row as { extra_cities?: unknown }).extra_cities;
  if (Array.isArray(raw)) {
    extras = (raw as Array<Partial<ExtraCity>>)
      .filter((c) => c && typeof c.name === "string" && typeof c.slug === "string" && typeof c.uf === "string")
      .map((c) => ({ name: c.name as string, slug: c.slug as string, uf: c.uf as string }));
  } else if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        extras = (parsed as Array<Partial<ExtraCity>>)
          .filter((c) => c && typeof c.name === "string" && typeof c.slug === "string" && typeof c.uf === "string")
          .map((c) => ({ name: c.name as string, slug: c.slug as string, uf: c.uf as string }));
      }
    } catch {
      // ignora
    }
  }

  return {
    id: row.id,
    slug: row.slug,
    // Normaliza nome para Title Case BR mesmo em registros legados que
    // foram salvos em CAPS no banco. Garante que cards públicos, perfis
    // e listagens mostrem 'Kellsons de Moraes Oliveira' em vez de
    // 'KELLSONS DE MORAES OLIVEIRA' até a migração SQL normalizar.
    name: titleCaseNameBR(row.name),
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
    extraCities: extras,
    photoUrl: (row as { photo_url?: string | null }).photo_url || undefined,
    website: (row as { website?: string | null }).website || undefined,
    instagram: (row as { instagram?: string | null }).instagram || undefined,
    linkedin: (row as { linkedin?: string | null }).linkedin || undefined,
    officeHours: (row as { office_hours?: string | null }).office_hours || undefined,
    createdAt: row.created_at
  };
};

// Colunas seguras para exposição pública (sem CPF).
// Usado pelos selects do server-side em lawyers.ts.
export const PUBLIC_COLUMNS =
  "id,slug,name,oab,oab_uf,email,phone,whatsapp,address,city_name,city_slug,uf,specialties,bio,plan_status,plan_start_date,plan_end_date,payment_date,featured,verified_oab,target_city,target_uf,extra_cities,photo_url,website,instagram,linkedin,office_hours,created_at,updated_at";
