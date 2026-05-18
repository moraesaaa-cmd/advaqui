"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Users,
  MessageSquare,
  BarChart3,
  Search,
  LogOut,
  Trash2,
  Star,
  Reply,
  Mail
} from "lucide-react";
import { PlanBadge } from "@/components/PlanBadge";
import { formatDate } from "@/lib/utils/format";
import { toast } from "@/components/Toast";
import type { LawyerRow, MessageRow, PlanStatus } from "@/lib/supabase/types";

const TABS = [
  { id: "users", label: "Cadastros", Icon: Users },
  { id: "messages", label: "Mensagens", Icon: MessageSquare },
  { id: "stats", label: "Resumo", Icon: BarChart3 }
] as const;

type Tab = (typeof TABS)[number]["id"];

/**
 * Constrói um link `mailto:` pré-preenchido com texto convidando o advogado
 * gratuito a assinar o plano premium. Abre no cliente de e-mail padrão do
 * sistema (Outlook, Apple Mail, Gmail webmail, etc).
 *
 * Quando o admin clica o botão, NÃO há automação de envio — o admin revisa
 * o texto antes de mandar. Isso evita ser confundido com spam pela operadora
 * de e-mail e mantém o tom pessoal.
 *
 * Conforme RESEND_API_KEY for configurada futuramente, podemos migrar pra
 * uma campanha automática programada (com opt-in, regras de frequência).
 */
function buildUpsellMailto(u: LawyerRow): string {
  const firstName = (u.name || "").trim().split(/\s+/)[0] || "Doutor(a)";
  const subject = `${firstName}, destaque seu perfil no AdvAqui em ${u.city_name}`;
  const body = `Olá ${firstName},

Aqui é a equipe do AdvAqui. Notei que você está cadastrado(a) gratuitamente em ${u.city_name}/${u.uf} — obrigado(a) por confiar no nosso diretório.

Queria te apresentar rapidamente o plano Premium (R$ 59,90/mês, Pix, sem fidelidade), que pode aumentar significativamente a visibilidade do seu perfil:

  • Seu perfil aparece no TOPO da página de ${u.city_name}, acima dos demais
  • Selo dourado "Destaque" + selo "OAB verificada" (após validação)
  • Botão WhatsApp clicável direto no card (cliente fala com você em 1 toque)
  • Bio livre até 500 caracteres explicando sua atuação
  • Áreas de atuação com filtro avançado nas buscas
  • Cidade adicional de atendimento (atenda em 2 cidades, não só 1)
  • Estatísticas básicas de quantas pessoas visualizaram seu perfil

Vale lembrar: o plano é mensal, pago via Pix, sem fidelidade. Você cancela quando quiser, sem multa.

Para ativar, é só acessar:
https://advaqui.com/painel/pagamento

Qualquer dúvida, é só responder este e-mail.

Atenciosamente,
Equipe AdvAqui
contato@AdvAqui.com.br`;

  return `mailto:${encodeURIComponent(u.email)}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}

async function callAdmin(payload: Record<string, unknown>) {
  const res = await fetch("/api/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return { status: res.status, json: await res.json().catch(() => ({})) };
}

export default function AdminPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>("users");
  const [users, setUsers] = useState<LawyerRow[]>([]);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | PlanStatus>("all");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [busy, setBusy] = useState(false);

  // Verifica autenticação admin e carrega dados iniciais
  useEffect(() => {
    (async () => {
      const check = await fetch("/api/admin", { method: "GET" });
      if (!check.ok) {
        router.push("/login");
        return;
      }
      await Promise.all([refreshUsers(), refreshMessages()]);
      setReady(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const refreshUsers = async () => {
    const r = await callAdmin({ action: "list-lawyers" });
    if (r.status === 200 && Array.isArray(r.json.lawyers)) {
      setUsers(r.json.lawyers as LawyerRow[]);
    }
  };

  const refreshMessages = async () => {
    const r = await callAdmin({ action: "list-messages" });
    if (r.status === 200 && Array.isArray(r.json.messages)) {
      setMessages(r.json.messages as MessageRow[]);
    }
  };

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users.filter((u) => {
      if (filter !== "all" && u.plan_status !== filter) return false;
      if (!term) return true;
      return [u.name, u.email, u.city_name, u.uf, u.phone, u.oab]
        .filter(Boolean)
        .some((f) => String(f).toLowerCase().includes(term));
    });
  }, [users, search, filter]);

  const activatePremium = async (id: string) => {
    if (busy) return;
    setBusy(true);
    const r = await callAdmin({ action: "activate-premium", id, days: 30 });
    setBusy(false);
    if (r.status === 200) {
      toast("Plano premium ativado");
      await refreshUsers();
    } else {
      toast("Erro ao ativar", "error");
    }
  };

  const deactivatePremium = async (id: string) => {
    if (busy) return;
    setBusy(true);
    const r = await callAdmin({ action: "deactivate-premium", id });
    setBusy(false);
    if (r.status === 200) {
      toast("Plano desativado");
      await refreshUsers();
    } else {
      toast("Erro", "error");
    }
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    if (busy) return;
    setBusy(true);
    const r = await callAdmin({ action: "toggle-featured", id, value: !current });
    setBusy(false);
    if (r.status === 200) {
      toast(current ? "Destaque removido" : "Destacado");
      await refreshUsers();
    } else {
      toast("Erro", "error");
    }
  };

  const toggleVerifiedOab = async (id: string, current: boolean) => {
    if (busy) return;
    setBusy(true);
    const r = await callAdmin({ action: "toggle-verified-oab", id, value: !current });
    setBusy(false);
    if (r.status === 200) {
      toast(current ? "Verificação removida" : "OAB verificada");
      await refreshUsers();
    } else {
      toast("Erro", "error");
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Tem certeza? Essa ação não pode ser desfeita.")) return;
    if (busy) return;
    setBusy(true);
    const r = await callAdmin({ action: "delete-lawyer", id });
    setBusy(false);
    if (r.status === 200) {
      toast("Cadastro removido");
      await refreshUsers();
    } else {
      toast("Erro ao excluir", "error");
    }
  };

  const markRead = async (id: string) => {
    const r = await callAdmin({ action: "mark-message-read", id });
    if (r.status === 200) await refreshMessages();
  };

  const submitReply = async (id: string) => {
    if (replyText.trim().length < 5) return;
    setBusy(true);
    const r = await callAdmin({ action: "reply-message", id, reply: replyText.trim() });
    setBusy(false);
    if (r.status === 200) {
      setReplyingTo(null);
      setReplyText("");
      toast("Resposta registrada");
      await refreshMessages();
    } else {
      toast("Erro ao responder", "error");
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    toast("Sessão encerrada");
    router.push("/");
    router.refresh();
  };

  if (!ready) {
    return <div className="container-tight py-20 text-center text-brand-ink/60">Carregando…</div>;
  }

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="container-tight py-10">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="font-display text-3xl font-bold text-brand-ink">Painel administrativo</h1>
        <button onClick={logout} className="btn-ghost text-sm">
          <LogOut className="w-4 h-4" aria-hidden /> Sair
        </button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
              tab === id
                ? "bg-brand-ink text-white"
                : "bg-white text-brand-ink border border-brand-line hover:bg-brand-line/40"
            }`}
          >
            <Icon className="w-4 h-4" aria-hidden />
            {label}
            {id === "messages" && unread > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-xs bg-brand-accent text-brand-ink">
                {unread}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "users" && (
        <div>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-brand-ink/40" aria-hidden />
              <input
                className="input pl-10"
                placeholder="Buscar por nome, cidade, OAB, telefone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="input sm:max-w-xs"
              value={filter}
              onChange={(e) => setFilter(e.target.value as "all" | PlanStatus)}
            >
              <option value="all">Todos os status</option>
              <option value="free">Gratuito</option>
              <option value="pending">Aguardando ativação</option>
              <option value="active">Premium ativo</option>
              <option value="expired">Vencido</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
          <p className="text-sm text-brand-ink/60 mb-3">
            {filteredUsers.length} cadastro(s) encontrado(s)
          </p>

          <div className="space-y-3">
            {filteredUsers.map((u) => (
              <article key={u.id} className="card">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="font-display font-bold text-brand-ink">{u.name}</p>
                    <p className="text-sm text-brand-ink/60">
                      OAB/{u.oab_uf} {u.oab} — {u.city_name}/{u.uf}
                    </p>
                  </div>
                  <PlanBadge status={u.plan_status} />
                </div>
                <dl className="text-xs text-brand-ink/70 grid sm:grid-cols-2 gap-1 mb-3">
                  <div>E-mail — {u.email}</div>
                  <div>Telefone — {u.phone || "—"}</div>
                  <div>Cadastro — {formatDate(u.created_at)}</div>
                  <div>Pagamento — {formatDate(u.payment_date)}</div>
                  <div>Vencimento — {formatDate(u.plan_end_date)}</div>
                  <div>{u.featured && "★ Em destaque manual"}</div>
                </dl>
                <div className="flex flex-wrap gap-2">
                  {(u.plan_status === "pending" ||
                    u.plan_status === "free" ||
                    u.plan_status === "expired") && (
                    <button
                      onClick={() => activatePremium(u.id)}
                      disabled={busy}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-500 disabled:opacity-50"
                    >
                      Ativar premium
                    </button>
                  )}
                  {u.plan_status === "active" && (
                    <button
                      onClick={() => deactivatePremium(u.id)}
                      disabled={busy}
                      className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-medium hover:bg-orange-400 disabled:opacity-50"
                    >
                      Desativar premium
                    </button>
                  )}
                  <button
                    onClick={() => toggleFeatured(u.id, u.featured)}
                    disabled={busy}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1 disabled:opacity-50 ${
                      u.featured
                        ? "bg-brand-accent text-brand-ink"
                        : "bg-brand-line text-brand-ink hover:bg-brand-line/70"
                    }`}
                  >
                    <Star className="w-3 h-3" aria-hidden />
                    {u.featured ? "Destacado" : "Destacar"}
                  </button>
                  <button
                    onClick={() => toggleVerifiedOab(u.id, u.verified_oab)}
                    disabled={busy}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-50 ${
                      u.verified_oab
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-brand-line text-brand-ink hover:bg-brand-line/70"
                    }`}
                  >
                    {u.verified_oab ? "OAB verificada" : "Verificar OAB"}
                  </button>
                  {(u.plan_status === "free" || u.plan_status === "expired") && (
                    <a
                      href={buildUpsellMailto(u)}
                      className="px-3 py-1.5 bg-brand-deep text-white rounded-lg text-xs font-medium hover:bg-brand-deep/90 inline-flex items-center gap-1"
                      title="Abrir cliente de e-mail com mensagem pronta apresentando o plano premium"
                    >
                      <Mail className="w-3 h-3" aria-hidden /> Convidar pra premium
                    </a>
                  )}
                  <button
                    onClick={() => deleteUser(u.id)}
                    disabled={busy}
                    className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-medium hover:bg-red-100 inline-flex items-center gap-1 disabled:opacity-50"
                  >
                    <Trash2 className="w-3 h-3" aria-hidden /> Excluir
                  </button>
                </div>
              </article>
            ))}

            {filteredUsers.length === 0 && (
              <p className="text-center text-brand-ink/50 py-8">
                Nenhum cadastro encontrado.
              </p>
            )}
          </div>
        </div>
      )}

      {tab === "messages" && (
        <div className="space-y-3">
          {messages.length === 0 && (
            <p className="text-center text-brand-ink/50 py-12">
              Nenhuma mensagem recebida ainda.
            </p>
          )}
          {messages.map((m) => (
            <article
              key={m.id}
              className={`card ${!m.read ? "border-brand-deep bg-brand-deep/5" : ""}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-brand-ink text-sm">{m.from_name}</p>
                  <p className="text-xs text-brand-ink/60">
                    {formatDate(m.created_at)} {m.from_email ? `· ${m.from_email}` : ""}
                  </p>
                </div>
                {!m.read && (
                  <button
                    onClick={() => markRead(m.id)}
                    className="text-xs text-brand-deep font-medium"
                  >
                    Marcar como lida
                  </button>
                )}
              </div>
              <p className="text-sm text-brand-ink/85 whitespace-pre-wrap">{m.body}</p>
              {m.reply && (
                <div className="mt-3 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-900">
                  <p className="text-xs font-semibold mb-1">
                    Sua resposta — {formatDate(m.reply_date)}
                  </p>
                  {m.reply}
                </div>
              )}
              {!m.reply && (
                <>
                  {replyingTo === m.id ? (
                    <div className="mt-3 space-y-2">
                      <textarea
                        className="input min-h-20"
                        placeholder="Sua resposta..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => submitReply(m.id)}
                          className="btn-primary text-xs"
                          disabled={replyText.trim().length < 5 || busy}
                        >
                          Enviar resposta
                        </button>
                        <button
                          onClick={() => setReplyingTo(null)}
                          className="btn-ghost text-xs border border-brand-line"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setReplyingTo(m.id)}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-deep hover:underline"
                    >
                      <Reply className="w-3 h-3" aria-hidden /> Responder
                    </button>
                  )}
                </>
              )}
            </article>
          ))}
        </div>
      )}

      {tab === "stats" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(
            [
              ["Total cadastrados", users.length, Users],
              [
                "Premium ativos",
                users.filter((u) => u.plan_status === "active").length,
                Star
              ],
              [
                "Aguardando ativação",
                users.filter((u) => u.plan_status === "pending").length,
                MessageSquare
              ],
              ["Mensagens não lidas", unread, MessageSquare]
            ] as Array<[string, number, typeof Users]>
          ).map(([label, count, Icon], idx) => (
            <div key={idx} className="card text-center">
              <Icon className="w-6 h-6 text-brand-deep mx-auto mb-2" aria-hidden />
              <p className="text-3xl font-bold text-brand-ink font-display">{count}</p>
              <p className="text-xs text-brand-ink/60 mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
