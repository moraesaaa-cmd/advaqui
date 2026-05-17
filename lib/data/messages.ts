import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { MessageRow, MessageSource } from "@/lib/supabase/types";

/**
 * Funções server-side para a tabela `messages`.
 *
 * INSERT: público (formulário de contato pode ser usado por qualquer visitante)
 * SELECT: privado (próprio usuário ou admin)
 */

export async function insertContactMessage(input: {
  name: string;
  email: string;
  body: string;
  subject?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const supabase = createClient();
  const { error } = await supabase.from("messages").insert({
    from_user_id: null,
    from_name: input.name,
    from_email: input.email,
    subject: input.subject || "Contato do site",
    body: input.body,
    source: "contact_form" as MessageSource,
    read: false
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function insertSupportMessage(input: {
  userId: string;
  name: string;
  email: string;
  body: string;
}): Promise<{ ok: boolean; error?: string }> {
  const supabase = createClient();
  const { error } = await supabase.from("messages").insert({
    from_user_id: input.userId,
    from_name: input.name,
    from_email: input.email,
    subject: "Suporte",
    body: input.body,
    source: "support" as MessageSource,
    read: false
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// ===== Admin =====

export async function adminListMessages(): Promise<MessageRow[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) {
    console.error("adminListMessages error:", error.message);
    return [];
  }
  return data || [];
}

export async function adminMarkMessageRead(
  id: string
): Promise<{ ok: boolean; error?: string }> {
  const admin = createAdminClient();
  const { error } = await admin
    .from("messages")
    .update({ read: true })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function adminReplyMessage(input: {
  id: string;
  reply: string;
  adminEmail: string;
}): Promise<{ ok: boolean; error?: string }> {
  const admin = createAdminClient();
  const { error } = await admin
    .from("messages")
    .update({
      reply: input.reply,
      reply_date: new Date().toISOString(),
      reply_admin_email: input.adminEmail,
      read: true
    })
    .eq("id", input.id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function getUnreadMessageCount(): Promise<number> {
  const admin = createAdminClient();
  const { count, error } = await admin
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("read", false);
  if (error) return 0;
  return count || 0;
}
