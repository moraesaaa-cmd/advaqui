"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Edit3,
  ExternalLink,
  LogOut,
  MessageSquare,
  Star,
  TrendingUp
} from "lucide-react";
import { PlanBadge } from "@/components/PlanBadge";
import { PLAN } from "@/lib/config";
import { daysUntil, formatCurrency, formatDate } from "@/lib/utils/format";
import { SPECIALTIES } from "@/lib/data/specialties";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/components/Toast";
import type { Lawyer } from "@/lib/data/lawyer-mapper";
import type { PlanStatus } from "@/lib/supabase/types";

type LoadState = "loading" | "ready" | "error" | "unauthorized" | "profile_missing";
type ProfileResponse = { ok: true; lawyer: Lawyer };

const UFS = [
  "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT",
  "PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO"
];

class PanelApiError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const requestJson = async <T,>(
  url: string,
  init: RequestInit = {},
  timeoutMs = 10000
): Promise<T> => {
  const ctrl = new AbortController();
  const timer = window.setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...init,
      cache: "no-store",
      signal: ctrl.signal
    });
    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      code?: string;
      error?: string;
    };

    if (!res.ok || data.ok === false) {
      throw new PanelApiError(
        res.status,
        data.code || "request_failed",
        data.error || "Nao foi possivel concluir a operacao."
      );
    }

    return data as T;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new PanelApiError(
        0,
        "timeout",
        "O servidor demorou demais para responder. Tente novamente em alguns segundos."
      );
    }
    throw err;
  } finally {
    window.clearTimeout(timer);
  }
};

const slugifyLocal = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const planMessage = (status: PlanStatus, daysLeft: number | null): string => {
  if (status === "active" && daysLeft !== null) {
    if (daysLeft <= 3) return `Atencao, seu plano vence em ${daysLeft} dia(s)`;
    if (daysLeft <= 10) return `Restam ${daysLeft} dias do seu plano`;
    return `Plano ativo por mais ${daysLeft} dias`;
  }
  if (status === "pending") return "Pagamento sinalizado, aguardando ativacao";
  if (status === "expired") return "Seu plano premium expirou";
  return "Cadastro gratuito ativo";
};

const completeness = (lawyer: Lawyer): { pct: number; missing: string[] } => {
  const checks: Array<[boolean, string]> = [
    [!!lawyer.name, "Nome"],
    [!!lawyer.oab && !!lawyer.oabUf, "OAB"],
    [!!lawyer.email, "E-mail"],
    [!!lawyer.phone, "Telefone"],
    [!!lawyer.whatsapp, "WhatsApp"],
    [!!lawyer.address, "Endereco profissional"],
    [!!lawyer.bio && lawyer.bio.length > 30, "Bio com pelo menos 30 caracteres"],
    [lawyer.specialties.length >= 2, "Pelo menos 2 areas de atuacao"]
  ];
  const done = checks.filter(([ok]) => ok).length;
  return {
    pct: Math.round((done / checks.length) * 100),
    missing: checks.filter(([ok]) => !ok).map(([, label]) => label)
  };
};

export default function PainelPage() {
  const router = useRouter();
  const [user, setUser] = useState<Lawyer | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [loadError, setLoadError] = useState("");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Lawyer | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);

  const loadProfile = useCallback(async () => {
    setLoadState("loading");
    setLoadError("");
    try {
      const data = await requestJson<ProfileResponse>("/api/painel/profile");
      setUser(data.lawyer);
      setLoadState("ready");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Nao foi possivel carregar seu painel agora.";
      setLoadError(message);
      if (err instanceof PanelApiError && err.status === 401) {
        setLoadState("unauthorized");
      } else if (err instanceof PanelApiError && err.status === 404) {
        setLoadState("profile_missing");
      } else {
        setLoadState("error");
      }
    }
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const daysLeft = useMemo(() => daysUntil(user?.planEndDate), [user?.planEndDate]);
  const status = user?.planStatus || "free";
  const comp = useMemo(() => (user ? completeness(user) : { pct: 0, missing: [] }), [user]);

  const startEdit = () => {
    if (!user) return;
    setDraft({ ...user, extraCities: [...(user.extraCities || [])] });
    setEditing(true);
  };

  const toggleDraftSpec = (slug: string) => {
    if (!draft) return;
    setDraft({
      ...draft,
      specialties: draft.specialties.includes(slug)
        ? draft.specialties.filter((item) => item !== slug)
        : [...draft.specialties, slug]
    });
  };

  const addExtraCity = () => {
    if (!draft) return;
    if ((draft.extraCities || []).length >= 9) {
      toast("Maximo de 9 cidades adicionais (10 no total com a principal).", "error");
      return;
    }
    setDraft({
      ...draft,
      extraCities: [...(draft.extraCities || []), { name: "", slug: "", uf: "MG" }]
    });
  };

  const updateExtraCity = (index: number, field: "name" | "uf", value: string) => {
    if (!draft) return;
    const list = [...(draft.extraCities || [])];
    const current = list[index] || { name: "", slug: "", uf: "MG" };
    const next = { ...current, [field]: value };
    if (field === "name") next.slug = slugifyLocal(value);
    if (field === "uf") next.uf = value.toUpperCase();
    list[index] = next;
    setDraft({ ...draft, extraCities: list });
  };

  const removeExtraCity = (index: number) => {
    if (!draft) return;
    const list = [...(draft.extraCities || [])];
    list.splice(index, 1);
    setDraft({ ...draft, extraCities: list });
  };

  const saveEdit = async () => {
    if (!draft || !user || saving) return;
    setSaving(true);
    try {
      const data = await requestJson<ProfileResponse>(
        "/api/painel/profile",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: draft.name,
            phone: draft.phone,
            whatsapp: draft.whatsapp,
            address: draft.address,
            bio: draft.bio,
            specialties: draft.specialties,
            targetCity: draft.targetCity,
            targetUf: draft.targetUf,
            extraCities: draft.extraCities
          })
        },
        12000
      );
      setUser(data.lawyer);
      setDraft(data.lawyer);
      setEditing(false);
      toast("Perfil atualizado. As paginas publicas serao atualizadas em segundos.");
    } catch (err) {
      console.error("[painel:saveEdit]", err);
      toast(err instanceof Error ? err.message : "Erro ao salvar. Tente novamente.", "error");
    } finally {
      setSaving(false);
    }
  };

  const sendMessage = async () => {
    if (!user) {
      toast("Sessao expirada. Faca login novamente.", "error");
      return;
    }
    const trimmed = msg.trim();
    if (trimmed.length < 10) {
      toast("Escreva uma mensagem com pelo menos 10 caracteres.", "error");
      return;
    }

    setSendingMsg(true);
    try {
      await requestJson<{ ok: true }>(
        "/api/painel/support",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed })
        },
        10000
      );
      setMsg("");
      toast("Mensagem enviada ao suporte. Responderemos em ate 48h pelo seu e-mail.");
    } catch (err) {
      console.error("[painel:sendMessage]", err);
      toast(err instanceof Error ? err.message : "Erro ao enviar. Tente novamente.", "error");
    } finally {
      setSendingMsg(false);
    }
  };

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    await fetch("/api/auth/logout", { method: "POST" });
    toast("Sessao encerrada");
    router.push("/");
    router.refresh();
  };

  if (loadState !== "ready" || !user) {
    const isLoading = loadState === "loading";
    const title =
      loadState === "unauthorized"
        ? "Sessao expirada"
        : loadState === "profile_missing"
        ? "Cadastro incompleto"
        : isLoading
        ? "Carregando painel"
        : "Nao foi possivel abrir o painel";
    const body =
      loadState === "unauthorized"
        ? "Entre novamente para acessar seu painel."
        : loadState === "profile_missing"
        ? "Nao encontramos seu perfil de advogado. Refaca o cadastro ou fale com o suporte."
        : isLoading
        ? "Estamos buscando seus dados com seguranca."
        : loadError || "Tente novamente em alguns segundos.";

    return (
      <div className="container-narrow max-w-lg py-20">
        <div className="card text-center">
          {isLoading ? (
            <div
              aria-hidden
              className="mx-auto mb-4 w-10 h-10 border-4 border-brand-line border-t-brand-deep rounded-full animate-spin"
            />
          ) : (
            <AlertCircle className="mx-auto mb-4 w-10 h-10 text-brand-accent2" aria-hidden />
          )}
          <h1 className="font-display text-2xl font-bold text-brand-ink">{title}</h1>
          <p className="text-sm text-brand-ink/70 mt-2">{body}</p>
          {!isLoading && (
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {loadState === "unauthorized" ? (
                <Link href="/login" className="btn-primary">Entrar novamente</Link>
              ) : loadState === "profile_missing" ? (
                <Link href="/cadastro" className="btn-primary">Refazer cadastro</Link>
              ) : (
                <button type="button" onClick={loadProfile} className="btn-primary">
                  Tentar novamente
                </button>
              )}
              <Link href="/contato" className="btn-ghost border border-brand-line">
                Falar com suporte
              </Link>
            </div>
          )}
        </div>
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
          <p className="text-sm text-brand-ink/60 mt-1">
            Ola, {user.name.split(" ")[0] || "advogado"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/p/${user.slug}`}
            target="_blank"
            className="btn-ghost border border-brand-line text-sm"
          >
            <ExternalLink className="w-4 h-4" aria-hidden />
            Ver perfil publico
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
              <p className="font-semibold">Voce esta perdendo visibilidade</p>
              <p className="text-sm text-brand-bg/80">
                Ative o premium por {formatCurrency(PLAN.price)} e apareca primeiro nas buscas de{" "}
                {user.cityName}.
              </p>
            </div>
          </div>
          <Link href="/painel/pagamento" className="btn-accent">Ativar premium</Link>
        </div>
      )}

      {status === "pending" && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 p-5 mb-6 flex items-start gap-3">
          <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" aria-hidden />
          <div>
            <p className="font-semibold">Pagamento em analise</p>
            <p className="text-sm">
              Recebemos sua sinalizacao. A ativacao sera feita em ate {PLAN.activationHours} horas.
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
          <Link href="/painel/pagamento" className="btn-accent">Renovar</Link>
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
                <div>
                  <label className="label">Nome completo</label>
                  <input
                    className="input"
                    value={draft.name}
                    onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Telefone</label>
                    <input
                      className="input"
                      value={draft.phone || ""}
                      onChange={(event) => setDraft({ ...draft, phone: event.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">WhatsApp</label>
                    <input
                      className="input"
                      value={draft.whatsapp || ""}
                      onChange={(event) => setDraft({ ...draft, whatsapp: event.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Endereco profissional</label>
                  <input
                    className="input"
                    value={draft.address || ""}
                    onChange={(event) => setDraft({ ...draft, address: event.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Bio (ate 500 caracteres)</label>
                  <textarea
                    className="input min-h-24"
                    value={draft.bio || ""}
                    maxLength={500}
                    onChange={(event) => setDraft({ ...draft, bio: event.target.value })}
                  />
                </div>

                <div>
                  <label className="label">Areas de atuacao</label>
                  <div className="flex flex-wrap gap-2">
                    {SPECIALTIES.map((specialty) => {
                      const active = draft.specialties.includes(specialty.slug);
                      return (
                        <button
                          key={specialty.slug}
                          type="button"
                          onClick={() => toggleDraftSpec(specialty.slug)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                            active
                              ? "bg-brand-deep text-white border-brand-deep"
                              : "bg-white text-brand-ink border-brand-line hover:border-brand-deep"
                          }`}
                        >
                          {specialty.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-xl border border-brand-line bg-brand-bg p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="text-xs font-semibold text-brand-ink">
                        Cidades adicionais ({(draft.extraCities || []).length} / 9)
                      </p>
                      <p className="text-xs text-brand-ink/60 mt-1">
                        Disponivel apenas para premium. O perfil aparece em cada cidade listada.
                      </p>
                    </div>
                    {status === "active" && (draft.extraCities || []).length < 9 && (
                      <button
                        type="button"
                        onClick={addExtraCity}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-brand-deep text-white hover:bg-brand-deep/90 whitespace-nowrap"
                      >
                        + Adicionar
                      </button>
                    )}
                  </div>

                  {(draft.extraCities || []).length === 0 ? (
                    <p className="text-xs text-brand-ink/40 italic mt-3">
                      Nenhuma cidade adicional cadastrada.
                    </p>
                  ) : (
                    <div className="space-y-2 mt-3">
                      {(draft.extraCities || []).map((city, index) => (
                        <div
                          key={`${city.uf}-${city.slug}-${index}`}
                          className="grid sm:grid-cols-[80px_1fr_auto] gap-2 items-end p-3 bg-white rounded-lg border border-brand-line"
                        >
                          <div>
                            <label className="text-xs text-brand-ink/60">UF</label>
                            <select
                              className="input text-sm"
                              value={city.uf || "MG"}
                              disabled={status !== "active"}
                              onChange={(event) => updateExtraCity(index, "uf", event.target.value)}
                            >
                              {UFS.map((uf) => (
                                <option key={uf} value={uf}>{uf}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-brand-ink/60">Nome da cidade</label>
                            <input
                              className="input text-sm"
                              value={city.name || ""}
                              disabled={status !== "active"}
                              placeholder="Ex.: Belo Horizonte"
                              onChange={(event) => updateExtraCity(index, "name", event.target.value)}
                            />
                            {city.slug && (
                              <p className="text-[10px] text-brand-ink/40 mt-1">
                                URL: /advogados/{(city.uf || "mg").toLowerCase()}/{city.slug}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeExtraCity(index)}
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
                  <strong>Cidade principal e OAB nao sao editaveis</strong> pelo painel. Para
                  mudancas nesses campos, fale com o suporte abaixo.
                </p>

                <div className="flex gap-2 pt-2">
                  <button onClick={saveEdit} className="btn-primary" disabled={saving}>
                    {saving ? "Salvando..." : "Salvar alteracoes"}
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setDraft(null);
                    }}
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
                  ["Telefone", user.phone || "-"],
                  ["WhatsApp", user.whatsapp || "-"],
                  ["Endereco", user.address || "-"],
                  ["Cidade principal", `${user.cityName} / ${user.uf}`],
                  [
                    "Cidades adicionais",
                    (user.extraCities || []).length > 0
                      ? user.extraCities.map((city) => `${city.name}/${city.uf}`).join(", ")
                      : status === "active"
                      ? "- (nenhuma cadastrada)"
                      : "- (recurso premium)"
                  ],
                  [
                    "Areas",
                    user.specialties
                      .map((slug) => SPECIALTIES.find((item) => item.slug === slug)?.name)
                      .filter(Boolean)
                      .join(", ") || "-"
                  ],
                  ["Bio", user.bio || "-"]
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
              Duvidas sobre pagamento, ativacao ou perfil. Respondemos em ate 48 horas pelo e-mail cadastrado.
            </p>
            <textarea
              className="input min-h-24 resize-y"
              placeholder="Descreva sua duvida ou problema com detalhes (minimo 10 caracteres)..."
              value={msg}
              onChange={(event) => setMsg(event.target.value)}
            />
            <p className="text-xs text-brand-ink/50 mt-2">
              {msg.trim().length < 10 ? (
                <>{msg.trim().length} / 10 caracteres minimos</>
              ) : (
                <span className="text-emerald-700 font-medium">
                  OK - {msg.trim().length} caracteres
                </span>
              )}
            </p>
            <button
              onClick={sendMessage}
              className="btn-primary mt-3 text-sm"
              disabled={msg.trim().length < 10 || sendingMsg}
            >
              <MessageSquare className="w-4 h-4" aria-hidden />
              {sendingMsg ? "Enviando..." : "Enviar"}
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
                  <dt>Ativacao</dt>
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
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-brand-ink">Perfil</p>
              <span className="text-sm font-bold text-brand-deep">{comp.pct}%</span>
            </div>
            <div className="h-2 bg-brand-line rounded-full overflow-hidden mb-3">
              <div className="h-full bg-brand-deep transition-all" style={{ width: `${comp.pct}%` }} />
            </div>
            {comp.missing.length > 0 ? (
              <>
                <p className="text-xs text-brand-ink/70 mb-2">Falta preencher:</p>
                <ul className="text-xs text-brand-ink/70 space-y-1 list-disc list-inside">
                  {comp.missing.map((item) => (
                    <li key={item}>{item}</li>
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
              Perfis com telefone, WhatsApp, bio e areas de atuacao bem preenchidas tendem a converter melhor.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
