/**
 * Tipos do Supabase para o AdvAqui.
 *
 * Em uma versão completa, esses tipos seriam gerados automaticamente pelo
 * CLI do Supabase (`supabase gen types typescript --project-id ...`), mas
 * aqui mantemos manualmente os tipos das tabelas que o app usa.
 */

export type PlanStatus = "free" | "pending" | "active" | "expired" | "cancelled";

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
  created_at: string;
  updated_at: string;
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
      };
      messages: {
        Row: MessageRow;
        Insert: Partial<MessageRow> & {
          from_name: string;
          body: string;
        };
        Update: Partial<MessageRow>;
      };
      plan_history: {
        Row: PlanHistoryRow;
        Insert: Partial<PlanHistoryRow> & {
          lawyer_id: string;
          amount: number;
        };
        Update: Partial<PlanHistoryRow>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
