"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ExternalLink,
  Edit3,
  MessageSquare,
  LogOut,
  Star,
  Clock,
  CheckCircle,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { store } from "@/lib/store/localStore";
import type { Lawyer, PlanStatus } from "@/lib/data/mock-lawyers";
import { PlanBadge } from "@/components/PlanBadge";
import { PLAN } from "@/lib/config";
import { formatCurrency, formatDate, daysUntil } from "@/lib/utils/format";
import { generateId } from "@/lib/utils/id";
import { toast } from "@/components/Toast";
import { SPECIALTIES } from "@/lib/data/specialties";

const planMessage = (status: PlanStatus, daysLeft: number | null): string => {
  if (status === "active" && daysLeft !== null) {
    if (daysLeft <= 3) return `Atenção, seu plano vence em ${daysLeft} dia(s)`;
    if (daysLeft <= 10) return `Restam ${daysLeft} dias do seu plano`;
    return `Plano ativo por mais ${daysLeft} dias`;
  }
  if (status === "pending") return "Pagamento sinalizado, aguardando ativação";
  if (status === "expired") return "Seu plano premium expirou";
  return "Cadastro gratuito ativo";
};

const completeness = (l: Lawyer): { pct: number; missing: string[] } => {
  const checks: Array<[boolean, string]> = [
    [!!l.name, "Nome"],
    [!!l.oab && !!l.oabUf, "OAB"],
    [!!l.email, "E-mail"],
    [!!l.phone, "Telefone"],
    [!!l.whatsapp, "WhatsApp"],
    [!!l.address, "Endereço profissional"],
    [!!l.bio && l.bio.length > 30, "Bio com pelo menos 30 caracteres"],
    [l.specialties.length >= 2, "Pelo menos 2 áreas de atuação"]
  ];
  const done = checks.filter(([ok]) => ok).length;
  const missing = checks.filter(([ok]) => !ok).map(([, label]) => label);
  return { pct: Math.round((done / checks.length) * 100), missing };
};

export default function PainelPage() {
  const router = useRouter();
  const [user, setUser] = useState<Lawyer | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Lawyer | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const session = store.getSession();
    if (!session || session.role !== "lawyer") {
      router.push("/login");
      return;
    }
    const u = store.getUsers().find((x) => x.id === session.userId);
    if (!u) {
      store.setSession(null);
      router.push("/login");
      return;
    }
    setUser(u);
    setLoading(false);
  }, [router]);

  const daysLeft = useMemo(() => daysUntil(user?.planEndDate), [user?.planEndDate]);
  const status = user?.planStatus || "free";
  const comp = useMemo(() => (user ? completeness(user) : { pct: 0, missing: [] }), [user]);

  const startEdit = () => {
    if (!user) return;
    setDraft({ ...user });
    setEditing(true);
  };

  const saveEdit = () => {
    if (!draft || !user) return;
    const users = store.getUsers();
    const next = users.map((u) => (u.id === user.id ? { ...u, ...draft } : u));
    store.setUsers(next);
    setUser(draft);
    setEditing(false);
    toast("Perfil atualizado");
  };

  const sendMessage = () => {
    if (!user || msg.trim().length < 5) return;
    const all = store.getMessages();
    const message = {
      id: generateId(),
      fromUserId: user.id,
      fromName: user.name,
      subject: "Suporte",
      body: msg.trim(),
      date: new Date().toISOString(),
      read: false
    };
    store.setMessages([...all, message]);
    setMsg("");
    toast("Mensagem enviada ao suporte");
  };

  const logout = () => {
    store.setSession(null);
    toast("Sessão encerrada");
    router.push("/");
  };

  if (loading || !user) {
    return (
      <div className="container-tight py-20 text-center text-brand-ink/60">
        Carregando…
      </div>
    );
  }

  const planUrgencyColor =
    daysLeft !== null && daysLeft <= 3
      ? "border-red-300 bg-red-50"
      : daysLeft !== null && daysLeft <= 10
      ? "border-amber-300 bg-amber-50"
      : "border-emerald-300 bg-emerald-50";

  return (
    <div className="container-tight py-10">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-ink">Meu painel</h1>
          <p className="text-sm text-brand-ink/60 mt-1">Olá, {user.name.split(" ")[0]}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/p/${user.slug}`}
            target="_blank"
            className="btn-ghost border border-brand-line text-sm"
          >
            <ExternalLink className="w-4 h-4" aria-hidden />
            Ver meu perfil público
          </Link>
          <button onClick={logout} className="btn-ghost text-sm" aria-label="Sair">
            <LogOut className="w-4 h-4" aria-hidden /> Sair
          </button>
        </div>
      </div>

      {status === "free" && (
        <div className="rounded-2xl bg-brand-ink text-white p-5 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-brand-accent" aria-hidden />
            <div>
              <p className="font-semibold">Você está perdendo visibilidade</p>
              <p className="text-sm text-brand-bg/80">
                Ative o premium por {formatCurrency(PLAN.price)} e apareça primeiro nas buscas de{" "}
                {user.cityName}.
              </p>
            </div>
          </div>
          <Link href="/painel/pagamento" className="btn-accent">
            Ativar premium
          </Link>
        </div>
      )}

      {status === "pending" && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 p-5 mb-6 flex items-start gap-3">
          <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" aria-hidden />
          <div>
            <p className="font-semibold">Pagamento em análise</p>
            <p className="text-sm">
              Recebemos sua sinalização. A ativação será feita em até {PLAN.activationHours} horas.
              Pagamento marcado em {formatDate(user.paymentDate)}.
            </p>
          </div>
        </div>
      )}

      {status === "expired" && (
        <div className="rounded-2xl bg-red-50 border border-red-200 text-red-900 p-5 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" aria-hidden />
          <div className="flex-1">
            <p className="font-semibold">Seu plano expirou</p>
            <p className="text-sm">Renove agora para voltar ao destaque na sua cidade.</p>
          </div>
          <Link href="/painel/pagamento" className="btn-accent">
            Renovar
          </Link>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold text-brand-ink">Meu perfil</h2>
              {!editing && (
                <button onClick={startEdit} className="btn-ghost text-sm">
                  <Edit3 className="w-4 h-4" aria-hidden /> Editar
                </button>
              )}
            </div>

            {editing && draft ? (
              <div className="space-y-3">
                {(
                  [
                    ["name", "Nome"],
                    ["phone", "Telefone"],
                    ["whatsapp", "WhatsApp"],
                    ["address", "Endereço"],
                    ["bio", "Bio"]
                  ] as const
                ).map(([k, label]) => (
                  <div key={k}>
                    <label className="label">{label}</label>
                    {k === "bio" ? (
                      <textarea
                        className="input min-h-24"
                        value={draft[k] || ""}
                        onChange={(e) => setDraft({ ...draft, [k]: e.target.value })}
                      />
                    ) : (
                      <input
                        className="input"
                        value={(draft[k] as string) || ""}
                        onChange={(e) => setDraft({ ...draft, [k]: e.target.value })}
                      />
                    )}
                  </div>
                ))}
                <div className="flex gap-2 pt-2">
                  <button onClick={saveEdit} className="btn-primary">Salvar</button>
                  <button
                    onClick={() => setEditing(false)}
                    className="btn-ghost border border-brand-line"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <dl className="text-sm space-y-2">
                {[
                  ["Nome", user.name],
                  ["OAB", `${user.oab} / ${user.oabUf}`],
                  ["E-mail", user.email],
                  ["Telefone", user.phone],
                  ["WhatsApp", user.whatsapp || "—"],
                  ["Endereço", user.address || "—"],
                  ["Cidade", `${user.cityName} / ${user.uf}`],
                  [
                    "Áreas",
                    user.specialties
                      .map((s) => SPECIALTIES.find((sp) => sp.slug === s)?.name)
                      .join(", ") || "—"
                  ],
                  ["Bio", user.bio || "—"]
                ].map(([label, value]) => (
                  <div key={label} className="flex flex-col sm:flex-row gap-1 sm:gap-3">
                    <dt className="sm:w-32 text-brand-ink/60">{label}</dt>
                    <dd className="text-brand-ink flex-1">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </section>

          <section className="card">
            <h2 className="font-display text-xl font-bold text-brand-ink mb-3">
              Falar com o suporte
            </h2>
            <textarea
              className="input min-h-24 resize-y"
              placeholder="Escreva sua mensagem..."
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
            />
            <button
              onClick={sendMessage}
              className="btn-primary mt-3 text-sm"
              disabled={msg.trim().length < 5}
            >
              <MessageSquare className="w-4 h-4" aria-hidden />
              Enviar
            </button>
          </section>
        </div>

        <aside className="space-y-6">
          <div className={`rounded-2xl border-2 p-5 ${planUrgencyColor}`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-brand-ink">Status do plano</p>
              <PlanBadge status={status} />
            </div>
            <p className="text-sm text-brand-ink/80 mb-3">{planMessage(status, daysLeft)}</p>
            <dl className="text-xs text-brand-ink/70 space-y-1">
              <div className="flex justify-between">
                <dt>Cadastro</dt>
                <dd>{formatDate(user.createdAt)}</dd>
              </div>
              {user.planStartDate && (
                <div className="flex justify-between">
                  <dt>Ativação</dt>
                  <dd>{formatDate(user.planStartDate)}</dd>
                </div>
              )}
              {user.planEndDate && (
                <div className="flex justify-between">
                  <dt>Vencimento</dt>
                  <dd>{formatDate(user.planEndDate)}</dd>
                </div>
              )}
            </dl>
            {(status === "free" || status === "expired") && (
              <Link href="/painel/pagamento" className="btn-accent w-full mt-4 text-sm">
                {status === "expired" ? "Renovar premium" : "Ativar premium"}
              </Link>
            )}
            {status === "active" && daysLeft !== null && daysLeft <= 7 && (
              <Link href="/painel/pagamento" className="btn-accent w-full mt-4 text-sm">
                Renovar por mais 30 dias
              </Link>
            )}
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-brand-ink">Perfil</p>
              <span className="text-sm font-bold text-brand-deep">{comp.pct}%</span>
            </div>
            <div className="h-2 bg-brand-line rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-brand-deep transition-all"
                style={{ width: `${comp.pct}%` }}
              />
            </div>
            {comp.missing.length > 0 ? (
              <>
                <p className="text-xs text-brand-ink/70 mb-2">Falta preencher:</p>
                <ul className="text-xs text-brand-ink/70 space-y-1 list-disc list-inside">
                  {comp.missing.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="inline-flex items-center gap-1 text-emerald-700 text-xs font-medium">
                <CheckCircle className="w-3.5 h-3.5" aria-hidden /> Perfil completo
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-brand-deep/5 border border-brand-deep/20 p-5">
            <Star className="w-5 h-5 text-brand-accent mb-2" aria-hidden />
            <p className="text-sm font-semibold text-brand-deep">Dica de visibilidade</p>
            <p className="text-xs text-brand-ink/70 mt-1 leading-relaxed">
              Perfis com foto e bio recebem em média 5x mais visualizações. O plano premium garante
              destaque permanente no topo da página da sua cidade.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
