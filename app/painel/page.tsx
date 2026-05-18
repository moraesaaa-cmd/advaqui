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
import { PlanBadge } from "@/components/PlanBadge";
import { PLAN } from "@/lib/config";
import { formatCurrency, formatDate, daysUntil } from "@/lib/utils/format";
import { toast } from "@/components/Toast";
import { SPECIALTIES } from "@/lib/data/specialties";
import { createClient } from "@/lib/supabase/client";
import { mapLawyerRow, type Lawyer } from "@/lib/data/lawyer-mapper";
import type { LawyerRow, PlanStatus } from "@/lib/supabase/types";

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
  const [sendingMsg, setSendingMsg] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        router.push("/login");
        return;
      }
      const { data: row, error } = await supabase
        .from("lawyers")
        .select("*")
        .eq("id", authUser.id)
        .maybeSingle();
      if (error || !row) {
        // Trigger handle_new_user pode ter falhado — orienta cadastro de novo.
        toast("Cadastro incompleto. Refaça por favor.", "error");
        await supabase.auth.signOut();
        router.push("/cadastro");
        return;
      }
      setUser(mapLawyerRow(row as LawyerRow));
      setLoading(false);
    })();
  }, [router]);

  const daysLeft = useMemo(() => daysUntil(user?.planEndDate), [user?.planEndDate]);
  const status = user?.planStatus || "free";
  const comp = useMemo(() => (user ? completeness(user) : { pct: 0, missing: [] }), [user]);

  const startEdit = () => {
    if (!user) return;
    setDraft({ ...user });
    setEditing(true);
  };

  const saveEdit = async () => {
    if (!draft || !user) return;
    if (saving) return; // guard contra duplo-clique
    setSaving(true);

    // Helper local: promise com timeout pra evitar UI travada se o request
    // não responder (bug reportado em alguns navegadores).
    const withTimeout = async <T,>(p: Promise<T>, ms: number): Promise<T> => {
      let to: ReturnType<typeof setTimeout> | undefined;
      const timeout = new Promise<never>((_, reject) => {
        to = setTimeout(() => reject(new Error("__timeout__")), ms);
      });
      try {
        return (await Promise.race([p, timeout])) as T;
      } finally {
        if (to) clearTimeout(to);
      }
    };

    const supabase = createClient();
    // Salva todos os campos editáveis pelo próprio advogado.
    // Cidade principal e UF NÃO são alteráveis pelo painel — exigem novo
    // signUp ou solicitação ao suporte (regra: slug é estável para SEO).
    // Cidade adicional (target_*) e extra_cities são editáveis apenas premium.
    const update: Record<string, unknown> = {
      name: draft.name,
      phone: draft.phone,
      whatsapp: draft.whatsapp,
      address: draft.address,
      bio: draft.bio,
      specialties: draft.specialties
    };
    const isPremium = user.planStatus === "active";
    if (isPremium) {
      update.target_city = draft.targetCity || null;
      update.target_uf = draft.targetUf || null;
      // Sanity: máximo 9 entradas em extra_cities (limite do banco).
      update.extra_cities = (draft.extraCities || []).slice(0, 9);
    } else {
      // Free não pode ter cidades extras — limpa qualquer resíduo.
      update.target_city = null;
      update.target_uf = null;
      update.extra_cities = [];
    }

    try {
      const { error } = await withTimeout(
        supabase.from("lawyers").update(update).eq("id", user.id),
        15000
      );

      if (error) {
        console.error("[painel:saveEdit]", error);
        toast(`Erro ao salvar — ${error.message}`, "error");
        return;
      }

      // Invalida o cache SSG das páginas onde o perfil aparece
      // (cidade principal + extras + perfil + estado + home).
      // Não bloqueia o sucesso se a revalidação falhar.
      try {
        await withTimeout(
          fetch("/api/lawyer/revalidate", { method: "POST" }),
          5000
        );
      } catch (err) {
        console.warn("[painel:saveEdit] revalidate failed", err);
      }

      setUser(draft);
      setEditing(false);
      toast("Perfil atualizado. As páginas públicas serão atualizadas em segundos.");
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      if (errMsg === "__timeout__") {
        toast(
          "O servidor demorou demais para responder. Tente novamente em alguns segundos.",
          "error"
        );
      } else {
        console.error("[painel:saveEdit] unexpected", err);
        toast("Erro de conexão. Tente novamente.", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  const toggleDraftSpec = (slug: string) => {
    if (!draft) return;
    setDraft({
      ...draft,
      specialties: draft.specialties.includes(slug)
        ? draft.specialties.filter((s) => s !== slug)
        : [...draft.specialties, slug]
    });
  };

  const addExtraCity = () => {
    if (!draft) return;
    if ((draft.extraCities || []).length >= 9) {
      toast("Máximo de 9 cidades adicionais (10 no total com a principal).", "error");
      return;
    }
    setDraft({
      ...draft,
      extraCities: [...(draft.extraCities || []), { name: "", slug: "", uf: "MG" }]
    });
  };

  const updateExtraCity = (
    index: number,
    field: "name" | "slug" | "uf",
    value: string
  ) => {
    if (!draft) return;
    const list = [...(draft.extraCities || [])];
    list[index] = { ...list[index], [field]: value };
    // Se mudou o name, recalcula o slug automaticamente
    if (field === "name") {
      list[index].slug = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }
    setDraft({ ...draft, extraCities: list });
  };

  const removeExtraCity = (index: number) => {
    if (!draft) return;
    const list = [...(draft.extraCities || [])];
    list.splice(index, 1);
    setDraft({ ...draft, extraCities: list });
  };

  const sendMessage = async () => {
    if (!user) {
      toast("Sessão expirada — faça login novamente", "error");
      return;
    }
    const trimmed = msg.trim();
    if (trimmed.length < 10) {
      toast("Escreva uma mensagem com pelo menos 10 caracteres", "error");
      return;
    }
    setSendingMsg(true);
    const supabase = createClient();
    const { error } = await supabase.from("messages").insert({
      from_user_id: user.id,
      from_name: user.name,
      from_email: user.email,
      subject: "Suporte",
      body: trimmed,
      source: "support"
    });
    setSendingMsg(false);
    if (error) {
      // Log estruturado pra investigação futura
      console.error("[painel:sendMessage] insert failed", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      toast(`Erro ao enviar — ${error.message}`, "error");
      return;
    }
    setMsg("");
    toast("Mensagem enviada ao suporte. Responderemos em até 48h pelo seu e-mail.");
  };

  const logout = async () => {
    // Limpa sessão no cliente PRIMEIRO (dispara onAuthStateChange p/ Header)
    const supabase = createClient();
    await supabase.auth.signOut();
    // Depois limpa cookies do server (SSR + cookie admin)
    await fetch("/api/auth/logout", { method: "POST" });
    toast("Sessão encerrada");
    router.push("/");
    router.refresh();
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
              <div className="space-y-4">
                {(
                  [
                    ["name", "Nome completo"],
                    ["phone", "Telefone"],
                    ["whatsapp", "WhatsApp"],
                    ["address", "Endereço profissional"],
                    ["bio", "Bio (até 500 caracteres)"]
                  ] as const
                ).map(([k, label]) => (
                  <div key={k}>
                    <label className="label">{label}</label>
                    {k === "bio" ? (
                      <textarea
                        className="input min-h-24"
                        value={draft[k] || ""}
                        maxLength={500}
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

                <div>
                  <label className="label">Áreas de atuação</label>
                  <p className="text-xs text-brand-ink/60 mb-2">
                    Selecione todas as áreas em que você atua. Esses chips definem em quais
                    páginas de especialidade seu perfil aparece.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SPECIALTIES.map((s) => {
                      const active = draft.specialties.includes(s.slug);
                      return (
                        <button
                          key={s.slug}
                          type="button"
                          onClick={() => toggleDraftSpec(s.slug)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                            active
                              ? "bg-brand-deep text-white border-brand-deep"
                              : "bg-white text-brand-ink border-brand-line hover:border-brand-deep"
                          }`}
                        >
                          {s.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-xl border border-brand-line bg-brand-bg p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="text-xs font-semibold text-brand-ink">
                        Cidades adicionais de atendimento ({(draft.extraCities || []).length} / 9)
                      </p>
                      <p className="text-xs text-brand-ink/60 mt-1">
                        Você atende em outras cidades além da principal? Adicione até 9 cidades
                        extras. Seu perfil aparecerá na página de cada cidade listada.
                        {status !== "active" && (
                          <span className="block mt-1 text-brand-accent2 font-medium">
                            Recurso disponível apenas no plano premium.
                          </span>
                        )}
                      </p>
                    </div>
                    {status === "active" && (draft.extraCities || []).length < 9 && (
                      <button
                        type="button"
                        onClick={addExtraCity}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-brand-deep text-white hover:bg-brand-deep/90 whitespace-nowrap"
                      >
                        + Adicionar cidade
                      </button>
                    )}
                  </div>

                  {(draft.extraCities || []).length === 0 ? (
                    <p className="text-xs text-brand-ink/40 italic mt-3">
                      Nenhuma cidade adicional cadastrada.
                    </p>
                  ) : (
                    <div className="space-y-2 mt-3">
                      {(draft.extraCities || []).map((c, idx) => (
                        <div
                          key={idx}
                          className="grid sm:grid-cols-[80px_1fr_auto] gap-2 items-end p-3 bg-white rounded-lg border border-brand-line"
                        >
                          <div>
                            <label className="text-xs text-brand-ink/60">UF</label>
                            <select
                              className="input text-sm"
                              value={c.uf || "MG"}
                              disabled={status !== "active"}
                              onChange={(e) => updateExtraCity(idx, "uf", e.target.value)}
                            >
                              {[
                                "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT",
                                "PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO"
                              ].map((uf) => (
                                <option key={uf} value={uf}>{uf}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-brand-ink/60">
                              Nome da cidade
                            </label>
                            <input
                              className="input text-sm"
                              value={c.name || ""}
                              disabled={status !== "active"}
                              placeholder="Ex.: Belo Horizonte"
                              onChange={(e) => updateExtraCity(idx, "name", e.target.value)}
                            />
                            {c.slug && (
                              <p className="text-[10px] text-brand-ink/40 mt-1">
                                URL: /advogados/{(c.uf || "mg").toLowerCase()}/{c.slug}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeExtraCity(idx)}
                            disabled={status !== "active"}
                            className="text-xs text-red-600 hover:text-red-700 hover:underline px-2 py-1 disabled:opacity-40"
                          >
                            Remover
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-xs text-brand-ink/50 pt-2 border-t border-brand-line">
                  <strong>Cidade principal e OAB não são editáveis</strong> pelo painel — para
                  mudanças nesses campos, fale com o suporte abaixo.
                </p>

                <div className="flex gap-2 pt-2">
                  <button onClick={saveEdit} className="btn-primary" disabled={saving}>
                    {saving ? "Salvando…" : "Salvar alterações"}
                  </button>
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
                  ["Telefone", user.phone || "—"],
                  ["WhatsApp", user.whatsapp || "—"],
                  ["Endereço", user.address || "—"],
                  ["Cidade principal", `${user.cityName} / ${user.uf}`],
                  [
                    "Cidades adicionais",
                    (user.extraCities || []).length > 0
                      ? user.extraCities
                          .map((c) => `${c.name}/${c.uf}`)
                          .join(", ")
                      : status === "active"
                      ? "— (nenhuma cadastrada)"
                      : "— (recurso premium)"
                  ],
                  [
                    "Áreas",
                    user.specialties
                      .map((s) => SPECIALTIES.find((sp) => sp.slug === s)?.name)
                      .filter(Boolean)
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
            <p className="text-sm text-brand-ink/60 mb-3">
              Dúvidas sobre pagamento, ativação ou perfil. Respondemos em até 48 horas pelo e-mail
              cadastrado.
            </p>
            <textarea
              className="input min-h-24 resize-y"
              placeholder="Descreva sua dúvida ou problema com detalhes (mínimo 10 caracteres)..."
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-brand-ink/50">
                {msg.trim().length < 10 ? (
                  <>
                    {msg.trim().length} / 10 caracteres mínimos
                  </>
                ) : (
                  <span className="text-emerald-700 font-medium">
                    ✓ {msg.trim().length} caracteres
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={sendMessage}
              className="btn-primary mt-3 text-sm"
              disabled={msg.trim().length < 10 || sendingMsg}
            >
              <MessageSquare className="w-4 h-4" aria-hidden />
              {sendingMsg ? "Enviando…" : "Enviar"}
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
