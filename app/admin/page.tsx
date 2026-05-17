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
  Reply
} from "lucide-react";
import { store, type Message } from "@/lib/store/localStore";
import type { Lawyer, PlanStatus } from "@/lib/data/mock-lawyers";
import { PlanBadge } from "@/components/PlanBadge";
import { formatDate } from "@/lib/utils/format";
import { toast } from "@/components/Toast";
import { PLAN } from "@/lib/config";

const TABS = [
  { id: "users", label: "Cadastros", Icon: Users },
  { id: "messages", label: "Mensagens", Icon: MessageSquare },
  { id: "stats", label: "Resumo", Icon: BarChart3 }
] as const;

type Tab = (typeof TABS)[number]["id"];

export default function AdminPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>("users");
  const [users, setUsers] = useState<Lawyer[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | PlanStatus>("all");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    const session = store.getSession();
    if (!session || session.role !== "admin") {
      router.push("/login");
      return;
    }
    setUsers(store.getUsers());
    setMessages(store.getMessages());
    setReady(true);
  }, [router]);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users.filter((u) => {
      if (filter !== "all" && u.planStatus !== filter) return false;
      if (!term) return true;
      return [u.name, u.email, u.cityName, u.uf, u.phone, u.oab]
        .filter(Boolean)
        .some((f) => f.toLowerCase().includes(term));
    });
  }, [users, search, filter]);

  const updateUser = (id: string, changes: Partial<Lawyer>) => {
    const next = users.map((u) => (u.id === id ? { ...u, ...changes } : u));
    store.setUsers(next);
    setUsers(next);
    toast("Cadastro atualizado");
  };

  const deleteUser = (id: string) => {
    if (!confirm("Tem certeza? Essa ação não pode ser desfeita.")) return;
    const next = users.filter((u) => u.id !== id);
    store.setUsers(next);
    setUsers(next);
    toast("Cadastro removido", "info");
  };

  const activatePremium = (id: string) => {
    const start = new Date();
    const end = new Date(start);
    end.setDate(end.getDate() + PLAN.cycleDays);
    updateUser(id, {
      planStatus: "active",
      planStartDate: start.toISOString(),
      planEndDate: end.toISOString()
    });
  };

  const deactivatePremium = (id: string) => {
    updateUser(id, {
      planStatus: "free",
      planStartDate: undefined,
      planEndDate: undefined,
      featured: false
    });
  };

  const toggleFeatured = (id: string, current?: boolean) => {
    updateUser(id, { featured: !current });
  };

  const markRead = (id: string) => {
    const next = messages.map((m) => (m.id === id ? { ...m, read: true } : m));
    store.setMessages(next);
    setMessages(next);
  };

  const submitReply = (id: string) => {
    if (replyText.trim().length < 5) return;
    const next = messages.map((m) =>
      m.id === id
        ? { ...m, reply: replyText.trim(), replyDate: new Date().toISOString(), read: true }
        : m
    );
    store.setMessages(next);
    setMessages(next);
    setReplyingTo(null);
    setReplyText("");
    toast("Resposta registrada");
  };

  const logout = () => {
    store.setSession(null);
    toast("Sessão encerrada");
    router.push("/");
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
              <Search
                className="absolute left-3 top-3.5 w-4 h-4 text-brand-ink/40"
                aria-hidden
              />
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
                      OAB/{u.oabUf} {u.oab} — {u.cityName}/{u.uf}
                    </p>
                  </div>
                  <PlanBadge status={u.planStatus} />
                </div>
                <dl className="text-xs text-brand-ink/70 grid sm:grid-cols-2 gap-1 mb-3">
                  <div>E-mail — {u.email}</div>
                  <div>Telefone — {u.phone}</div>
                  <div>Cadastro — {formatDate(u.createdAt)}</div>
                  <div>Pagamento — {formatDate(u.paymentDate)}</div>
                  <div>Vencimento — {formatDate(u.planEndDate)}</div>
                  <div>{u.featured && "★ Em destaque manual"}</div>
                </dl>
                <div className="flex flex-wrap gap-2">
                  {(u.planStatus === "pending" ||
                    u.planStatus === "free" ||
                    u.planStatus === "expired") && (
                    <button
                      onClick={() => activatePremium(u.id)}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-500"
                    >
                      Ativar premium
                    </button>
                  )}
                  {u.planStatus === "active" && (
                    <button
                      onClick={() => deactivatePremium(u.id)}
                      className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-medium hover:bg-orange-400"
                    >
                      Desativar premium
                    </button>
                  )}
                  <button
                    onClick={() => toggleFeatured(u.id, u.featured)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1 ${
                      u.featured
                        ? "bg-brand-accent text-brand-ink"
                        : "bg-brand-line text-brand-ink hover:bg-brand-line/70"
                    }`}
                  >
                    <Star className="w-3 h-3" aria-hidden />
                    {u.featured ? "Destacado" : "Destacar"}
                  </button>
                  <button
                    onClick={() => updateUser(u.id, { verifiedOab: !u.verifiedOab })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                      u.verifiedOab
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-brand-line text-brand-ink hover:bg-brand-line/70"
                    }`}
                  >
                    {u.verifiedOab ? "OAB verificada" : "Verificar OAB"}
                  </button>
                  <button
                    onClick={() => deleteUser(u.id)}
                    className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-medium hover:bg-red-100 inline-flex items-center gap-1"
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
          {messages
            .slice()
            .reverse()
            .map((m) => (
              <article
                key={m.id}
                className={`card ${!m.read ? "border-brand-deep bg-brand-deep/5" : ""}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-brand-ink text-sm">{m.fromName}</p>
                    <p className="text-xs text-brand-ink/60">{formatDate(m.date)}</p>
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
                      Sua resposta — {formatDate(m.replyDate)}
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
                            disabled={replyText.trim().length < 5}
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
                users.filter((u) => u.planStatus === "active").length,
                Star
              ],
              [
                "Aguardando ativação",
                users.filter((u) => u.planStatus === "pending").length,
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
