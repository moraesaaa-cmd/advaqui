/**
 * Tipos do Supabase para o AdvAqui.
 *
 * Em uma versão completa, esses tipos seriam gerados automaticamente pelo
 * CLI do Supabase (`supabase gen types typescript --project-id ...`), mas
 * aqui mantemos manualmente os tipos das tabelas que o app usa.
 */

export type PlanStatus = "free" | "pending" | "active" | "expired" | "cancelled";

/**
 * Estrutura de uma cidade extra (jsonb array em lawyers.extra_cities).
 * Limite de 9 entradas enforced no banco (migration 0003).
 */
export type ExtraCityRow = { name: string; slug: string; uf: string };

export type LawyerRow = {
  id: string;
  slug: string;
  name: string;
  oab: string;
  oab_uf: string;
  cpf: string | null;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  city_name: string;
  city_slug: string;
  uf: string;
  specialties: string[];
  bio: string | null;
  plan_status: PlanStatus;
  plan_start_date: string | null;
  plan_end_date: string | null;
  payment_date: string | null;
  featured: boolean;
  verified_oab: boolean;
  target_city: string | null;
  target_uf: string | null;
  /** Cidades adicionais de atendimento (até 9 entradas no premium). */
  extra_cities: ExtraCityRow[];
  /** URL da foto (avatars/{id}.jpg do Storage, ou URL externa). */
  photo_url: string | null;
  /** Site profissional (https://...). Premium only. */
  website: string | null;
  /** Handle do Instagram (sem @). Premium only. */
  instagram: string | null;
  /** Handle ou URL do LinkedIn. Premium only. */
  linkedin: string | null;
  /** Horários de atendimento (texto livre). Premium only. */
  office_hours: string | null;
  created_at: string;
  updated_at: string;

  // ----- Fase 3 — Página Profissional v2 (migration 0006) ----------------
  // Todos opcionais (`?:`) porque podem não existir no banco se a migration
  // ainda não foi aplicada. O mapper trata undefined → undefined no Lawyer.

  /** Status detalhado da Página Profissional. */
  page_status?: string | null;
  /** Indexabilidade pelos buscadores. Quando false → noindex no header. */
  is_indexable?: boolean | null;
  /** Visibilidade pública geral. Quando false → 404/mensagem neutra. */
  is_public?: boolean | null;
  last_published_at?: string | null;
  last_unpublished_at?: string | null;
  paused_at?: string | null;
  paused_reason?: string | null;
  suspension_reason?: string | null;

  /** Resumo curto (até 160 chars) exibido no topo da página. */
  short_summary?: string | null;
  /** Slugs das áreas principais (até 3) — destacadas. */
  primary_specialties?: string[] | null;
  /** Modalidades de atendimento — array com "in_person" e/ou "online". */
  service_modalities?: string[] | null;
  /** Região atendida em texto livre. */
  service_region?: string | null;
  /** Canal preferencial: "whatsapp" | "phone" | "email". */
  preferred_contact?: string | null;

  show_address?: boolean | null;
  show_address_full?: boolean | null;
  show_email?: boolean | null;
  show_phone?: boolean | null;
  show_extra_cities?: boolean | null;
  show_useful_docs?: boolean | null;
  show_articles?: boolean | null;
  show_questions?: boolean | null;
  show_faqs?: boolean | null;
  allow_questions?: boolean | null;
  accent_color?: string | null;
  header_layout?: string | null;
};

export type MessageSource = "contact_form" | "support" | "admin_to_user";

export type MessageRow = {
  id: string;
  from_user_id: string | null;
  from_name: string;
  from_email: string | null;
  subject: string;
  body: string;
  source: MessageSource;
  read: boolean;
  reply: string | null;
  reply_date: string | null;
  reply_admin_email: string | null;
  created_at: string;
};

export type PlanHistoryStatus =
  | "pending"
  | "confirmed"
  | "expired"
  | "cancelled"
  | "refunded";

export type PlanHistoryRow = {
  id: string;
  lawyer_id: string;
  amount: number;
  status: PlanHistoryStatus;
  payment_date: string | null;
  expires_at: string | null;
  txid: string | null;
  admin_notes: string | null;
  created_at: string;
};

// ---------------------------------------------------------------------------
// Fase 3 — Página Profissional v2 (migration 0006)
// ---------------------------------------------------------------------------

export type ArticleStatus =
  | "draft"
  | "scheduled"
  | "published"
  | "paused"
  | "archived"
  | "review"
  | "rejected";

export type LawyerArticleRow = {
  id: string;
  lawyer_id: string;
  slug: string;
  title: string;
  summary: string | null;
  body: string;
  specialty_slug: string | null;
  status: ArticleStatus;
  scheduled_for: string | null;
  published_at: string | null;
  unpublished_at: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  word_count: number | null;
  read_time_minutes: number | null;
  view_count: number;
  created_at: string;
  updated_at: string;
};

export type QuestionStatus =
  | "pending"
  | "approved"
  | "answered"
  | "rejected"
  | "spam"
  | "hidden";

export type LawyerQuestionRow = {
  id: string;
  lawyer_id: string;
  question: string;
  answer: string | null;
  asker_name: string | null;
  asker_email: string | null;
  asker_ip: string | null;
  status: QuestionStatus;
  rejected_reason: string | null;
  answered_at: string | null;
  created_at: string;
  updated_at: string;
};

export type LawyerFaqRow = {
  id: string;
  lawyer_id: string;
  question: string;
  answer: string;
  position: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
};

/**
 * Versão pública de um perfil de advogado, sem CPF.
 * Use sempre que renderizar dados publicamente (diretório, perfil).
 */
export type PublicLawyer = Omit<LawyerRow, "cpf">;

/**
 * Database type para tipar os clients do supabase-js.
 * Estrutura mínima — pode ser expandida conforme novas tabelas surjam.
 */
export type Database = {
  public: {
    Tables: {
      lawyers: {
        Row: LawyerRow;
        Insert: Partial<LawyerRow> & {
          id: string;
          slug: string;
          name: string;
          oab: string;
          oab_uf: string;
          email: string;
          city_name: string;
          city_slug: string;
          uf: string;
        };
        Update: Partial<LawyerRow>;
        Relationships: [];
      };
      messages: {
        Row: MessageRow;
        Insert: Partial<MessageRow> & {
          from_name: string;
          body: string;
        };
        Update: Partial<MessageRow>;
        Relationships: [];
      };
      plan_history: {
        Row: PlanHistoryRow;
        Insert: Partial<PlanHistoryRow> & {
          lawyer_id: string;
          amount: number;
        };
        Update: Partial<PlanHistoryRow>;
        Relationships: [];
      };
      // Fase 3 — tabelas opcionais (migration 0006). Defensive: o código
      // usa try/catch em torno dos SELECTs para tolerar a ausência.
      lawyer_articles: {
        Row: LawyerArticleRow;
        Insert: Partial<LawyerArticleRow> & {
          lawyer_id: string;
          slug: string;
          title: string;
          body: string;
        };
        Update: Partial<LawyerArticleRow>;
        Relationships: [];
      };
      lawyer_questions: {
        Row: LawyerQuestionRow;
        Insert: Partial<LawyerQuestionRow> & {
          lawyer_id: string;
          question: string;
        };
        Update: Partial<LawyerQuestionRow>;
        Relationships: [];
      };
      lawyer_faqs: {
        Row: LawyerFaqRow;
        Insert: Partial<LawyerFaqRow> & {
          lawyer_id: string;
          question: string;
          answer: string;
        };
        Update: Partial<LawyerFaqRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
