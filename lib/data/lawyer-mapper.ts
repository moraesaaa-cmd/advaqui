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

export type PageStatus =
  | "not_configured"
  | "incomplete"
  | "draft"
  | "published"
  | "paused"
  | "review"
  | "suspended";

export type ServiceModality = "in_person" | "online";
export type PreferredContact = "whatsapp" | "phone" | "email";
export type AccentColor = "amber" | "emerald" | "blue" | "rose" | "slate";
export type HeaderLayout = "compact" | "expanded";

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
  /** Alt-text descritivo da foto (migration 0018). Fallback: "Foto de {nome}". */
  photoAltText?: string;
  /** Site profissional (premium only — vai pra perfil público). */
  website?: string;
  /** Instagram handle (sem @). */
  instagram?: string;
  /** LinkedIn handle ou URL. */
  linkedin?: string;
  /** Horários de atendimento. */
  officeHours?: string;
  createdAt: string;
  /** Última atualização do perfil — usado pelo card "Central da Página
   *  Profissional" pra mostrar "última atualização há X dias". */
  updatedAt?: string;

  // ----- Fase 3 — controle de publicação (migration 0006) ----------------
  /** Status detalhado da Página Profissional. Pode vir undefined pré-migration. */
  pageStatus?: PageStatus;
  isIndexable?: boolean;
  isPublic?: boolean;
  lastPublishedAt?: string;
  lastUnpublishedAt?: string;
  pausedAt?: string;
  pausedReason?: string;
  suspensionReason?: string;

  // ----- Fase 3 — conteúdo profissional ---------------------------------
  /** Resumo curto exibido no topo da página (160 chars). */
  shortSummary?: string;
  /** Slugs das áreas principais — exibidas em destaque (até 3). */
  primarySpecialties?: string[];
  /** Modalidades de atendimento — in_person/online ou ambos. */
  serviceModalities?: ServiceModality[];
  /** Região atendida em texto livre — "Almenara/MG e região". */
  serviceRegion?: string;
  /** Canal preferencial de primeiro contato. */
  preferredContact?: PreferredContact;

  // ----- Fase 3 — display preferences -----------------------------------
  showAddress?: boolean;
  showAddressFull?: boolean;
  showEmail?: boolean;
  showPhone?: boolean;
  showExtraCities?: boolean;
  showUsefulDocs?: boolean;
  showArticles?: boolean;
  showQuestions?: boolean;
  showFaqs?: boolean;
  allowQuestions?: boolean;
  accentColor?: AccentColor;
  headerLayout?: HeaderLayout;
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
    photoAltText: (row as { alt_text?: string | null }).alt_text || undefined,
    website: (row as { website?: string | null }).website || undefined,
    instagram: (row as { instagram?: string | null }).instagram || undefined,
    linkedin: (row as { linkedin?: string | null }).linkedin || undefined,
    officeHours: (row as { office_hours?: string | null }).office_hours || undefined,
    createdAt: row.created_at,
    updatedAt: (row as { updated_at?: string }).updated_at,

    // ----- Fase 3 — controle de publicação (defensive — vem undefined se migration 0006 não foi aplicada) -----
    pageStatus: (row as { page_status?: PageStatus | null }).page_status || undefined,
    isIndexable: (row as { is_indexable?: boolean | null }).is_indexable ?? undefined,
    isPublic: (row as { is_public?: boolean | null }).is_public ?? undefined,
    lastPublishedAt: (row as { last_published_at?: string | null }).last_published_at || undefined,
    lastUnpublishedAt: (row as { last_unpublished_at?: string | null }).last_unpublished_at || undefined,
    pausedAt: (row as { paused_at?: string | null }).paused_at || undefined,
    pausedReason: (row as { paused_reason?: string | null }).paused_reason || undefined,
    suspensionReason: (row as { suspension_reason?: string | null }).suspension_reason || undefined,

    // ----- Fase 3 — conteúdo profissional -----
    shortSummary: (row as { short_summary?: string | null }).short_summary || undefined,
    primarySpecialties: Array.isArray((row as { primary_specialties?: unknown }).primary_specialties)
      ? ((row as { primary_specialties: unknown[] }).primary_specialties as string[])
      : undefined,
    serviceModalities: Array.isArray((row as { service_modalities?: unknown }).service_modalities)
      ? ((row as { service_modalities: unknown[] }).service_modalities as ServiceModality[])
      : undefined,
    serviceRegion: (row as { service_region?: string | null }).service_region || undefined,
    preferredContact:
      (row as { preferred_contact?: PreferredContact | null }).preferred_contact || undefined,

    // ----- Fase 3 — display preferences -----
    showAddress: (row as { show_address?: boolean | null }).show_address ?? undefined,
    showAddressFull: (row as { show_address_full?: boolean | null }).show_address_full ?? undefined,
    showEmail: (row as { show_email?: boolean | null }).show_email ?? undefined,
    showPhone: (row as { show_phone?: boolean | null }).show_phone ?? undefined,
    showExtraCities: (row as { show_extra_cities?: boolean | null }).show_extra_cities ?? undefined,
    showUsefulDocs: (row as { show_useful_docs?: boolean | null }).show_useful_docs ?? undefined,
    showArticles: (row as { show_articles?: boolean | null }).show_articles ?? undefined,
    showQuestions: (row as { show_questions?: boolean | null }).show_questions ?? undefined,
    showFaqs: (row as { show_faqs?: boolean | null }).show_faqs ?? undefined,
    allowQuestions: (row as { allow_questions?: boolean | null }).allow_questions ?? undefined,
    accentColor: (row as { accent_color?: AccentColor | null }).accent_color || undefined,
    headerLayout: (row as { header_layout?: HeaderLayout | null }).header_layout || undefined
  };
};

// Colunas seguras para exposição pública (sem CPF).
//
// Histórico: chegamos a estender essa lista com `photo_url`, `website`,
// `instagram`, `linkedin`, `office_hours` (migration 0005). PORÉM, se o app
// for deployado ANTES da migration ser aplicada no Supabase, o SELECT falha
// com `column ... does not exist` e TODOS os cards somem do diretório.
//
// Solução adotada (Maio/2026, pós-incidente): manter PUBLIC_COLUMNS conservador
// — apenas as colunas que sempre existem desde migration 0001. As funções
// que precisam das colunas premium novas (perfil público, painel) usam
// `select("*")` que retorna o estado atual real do schema sem quebrar.
//
// O mapper (mapLawyerRow) já trata os campos novos como opcionais — quando
// vêm undefined (migration não aplicada), simplesmente não aparecem no Lawyer.
export const PUBLIC_COLUMNS =
  "id,slug,name,oab,oab_uf,email,phone,whatsapp,address,city_name,city_slug,uf,specialties,bio,plan_status,plan_start_date,plan_end_date,payment_date,featured,verified_oab,target_city,target_uf,extra_cities,created_at,updated_at";
