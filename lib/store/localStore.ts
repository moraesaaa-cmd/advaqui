"use client";

/**
 * @deprecated Esta camada de armazenamento via localStorage foi substituída
 * pela integração Supabase a partir da versão 0.2.0 do AdvAqui. Os exports
 * abaixo permanecem apenas para evitar erros de typecheck em código legado
 * que ainda não foi removido. Nenhum componente em produção deve usar este
 * módulo. Use:
 *
 *   - Auth: `import { createClient } from "@/lib/supabase/client"`
 *   - Server: `import { createClient } from "@/lib/supabase/server"`
 *   - Admin: `import { createAdminClient } from "@/lib/supabase/admin"`
 *   - Lawyer ops: `import { ... } from "@/lib/data/lawyers"`
 *   - Message ops: `import { ... } from "@/lib/data/messages"`
 *
 * Este arquivo pode ser deletado quando todo código legado for revisado.
 */

export type Message = {
  id: string;
  fromUserId: string;
  fromName: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
  reply?: string;
  replyDate?: string;
};

export type Session = {
  userId: string;
  role: "lawyer" | "admin";
  name: string;
  email: string;
};

// Stubs vazios para evitar runtime errors caso alguma rota não migrada ainda chame.
export const store = {
  getUsers: (): unknown[] => [],
  setUsers: (_u: unknown[]) => undefined,
  getMessages: (): Message[] => [],
  setMessages: (_m: Message[]) => undefined,
  getSession: (): Session | null => null,
  setSession: (_s: Session | null) => undefined
};
