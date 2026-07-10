"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  Calculator,
  CalendarClock,
  Car,
  CheckSquare,
  Clock,
  Coins,
  Compass,
  Edit3,
  ExternalLink,
  FileSignature,
  FileText,
  HelpCircle,
  Home,
  Landmark,
  Lock,
  LogOut,
  MessageSquare,
  Palette,
  Percent,
  PiggyBank,
  Radar,
  Route,
  Scale,
  Search,
  Sparkles,
  Star,
  Stethoscope,
  Target,
  TrendingUp,
  Wallet,
  Wrench,
  CalendarCheck
} from "lucide-react";
import { PlanBadge } from "@/components/PlanBadge";
import { ExtraCityField } from "@/components/ExtraCityField";
import { PhotoUploader } from "@/components/PhotoUploader";
import { OfficeHoursEditor } from "@/components/OfficeHoursEditor";
import { MyProfessionalPageCard } from "@/components/MyProfessionalPageCard";
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

type PanelTool = {
  href: string;
  label: string;
  desc: string;
  Icon: typeof Calculator;
  premium?: boolean;
};

const PANEL_TOOLS: PanelTool[] = [
  { href: "/calculadora-prazos", label: "Prazos processuais", desc: "Dias úteis e corridos (CPC)", Icon: CalendarClock },
  { href: "/calculadoras", label: "Calculadoras jurídicas", desc: "Rescisão, FGTS, pensão, férias", Icon: Calculator },
  { href: "/atualizar-valor", label: "Atualizar valor", desc: "Correção + juros + multa", Icon: TrendingUp },
  { href: "/correcao-monetaria", label: "Correção monetária", desc: "IPCA, INPC, IGP-M", Icon: Percent },
  { href: "/seguro-desemprego", label: "Seguro-desemprego", desc: "Simulador tabela MTE 2026", Icon: Wallet },
  { href: "/quanto-custa", label: "Quanto custa advogado", desc: "Faixas de honorários por área", Icon: Coins },
  { href: "/modelos", label: "Modelos de documentos", desc: "Procuração, contratos, recibos", Icon: FileText },
  { href: "/montar-peticao", label: "Montar petição", desc: "Trabalhista, alimentos, consumo", Icon: FileSignature, premium: true },
  { href: "/recurso-de-multa", label: "Recurso de multa", desc: "Defesa prévia, JARI, CETRAN", Icon: Car, premium: true },
  { href: "/revisor-peticao", label: "Revisor IA", desc: "Revise peças com inteligência artificial", Icon: Sparkles, premium: true },
  { href: "/triagem", label: "Triagem jurídica", desc: "Descubra qual advogado procurar", Icon: Compass },
  { href: "/diagnostico", label: "Diagnóstico trabalhista", desc: "Seus direitos em 6 perguntas", Icon: Stethoscope },
  { href: "/previdencia", label: "Aposentadoria", desc: "Regras de transição + simulador", Icon: PiggyBank },
  { href: "/processos", label: "Consultar processo", desc: "Andamento pelo número CNJ", Icon: Radar },
  { href: "/glossario", label: "Glossário jurídico", desc: "Termos do direito em linguagem clara", Icon: BookOpen },
  { href: "/jurisprudencia", label: "Jurisprudência", desc: "Decisões STF/STJ por tema", Icon: Scale },
  { href: "/divorcio", label: "Divórcio", desc: "Cartório ou Justiça? 4 perguntas", Icon: Scale },
  { href: "/linha-do-tempo", label: "Linha do tempo", desc: "Etapas de um processo judicial", Icon: Route },
  { href: "/imobiliario", label: "Checklist imobiliário", desc: "Documentos para compra segura", Icon: Home },
  { href: "/tribunais", label: "Tribunais por cidade", desc: "Endereço do fórum e varas", Icon: Landmark },
  { href: "/agenda", label: "Agendar consulta", desc: "Peça horário com advogado", Icon: CalendarCheck },
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
        data.error || "Não foi possível concluir a operação."
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

/**
 * Cálculo de completude/força do perfil agora vive dentro do
 * MyProfessionalPageCard (Central da Página Profissional). Mantivemos a
 * lógica centralizada lá pra evitar duplicar regras de produto e dois
 * widgets mostrando a mesma coisa no painel.
 */

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

  // IA — Melhorar perfil com IA (Premium)
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{
    bio: string;
    shortSummary: string;
    suggestedTitle: string;
    suggestedSpecialties?: Array<{ slug: string; name: string }>;
  } | null>(null);

  const loadProfile = useCallback(async () => {
    setLoadState("loading");
    setLoadError("");
    try {
      const data = await requestJson<ProfileResponse>("/api/painel/profile");
      setUser(data.lawyer);
      setLoadState("ready");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Não foi possível carregar seu painel agora.";
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

  // Completude do perfil — alimenta o cartão de métricas do dashboard.
  const completeness = useMemo(() => {
    if (!user) return 0;
    const checks = [
      !!user.photoUrl,
      !!(user.bio && user.bio.trim().length >= 20),
      !!user.phone,
      !!user.whatsapp,
      !!user.address,
      user.specialties.length > 0,
      !!(user.shortSummary && user.shortSummary.trim()),
      (user.primarySpecialties?.length || 0) > 0
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [user]);

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
      toast("Máximo de 9 cidades adicionais (10 no total com a principal).", "error");
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
            extraCities: draft.extraCities,
            // Campos premium (server ignora se não-premium)
            website: draft.website,
            instagram: draft.instagram,
            linkedin: draft.linkedin,
            officeHours: draft.officeHours,
            // Fase 3 — campos novos
            shortSummary: draft.shortSummary,
            primarySpecialties: draft.primarySpecialties,
            serviceModalities: draft.serviceModalities,
            serviceRegion: draft.serviceRegion,
            preferredContact: draft.preferredContact
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

  const improveProfileWithAI = async () => {
    if (!draft || aiLoading) return;
    setAiLoading(true);
    setAiSuggestions(null);
    try {
      const data = await requestJson<{
        ok: true;
        suggestions: {
          bio: string;
          shortSummary: string;
          suggestedTitle: string;
          suggestedSpecialties?: Array<{ slug: string; name: string }>;
        };
      }>(
        "/api/painel/improve-profile",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: draft.name,
            oab: draft.oab,
            city: draft.cityName,
            specialties: draft.specialties,
            bio: draft.bio
          })
        },
        30000
      );
      setAiSuggestions(data.suggestions);
    } catch (err) {
      console.error("[painel:improveProfileWithAI]", err);
      toast(err instanceof Error ? err.message : "Erro ao gerar sugestões. Tente novamente.", "error");
    } finally {
      setAiLoading(false);
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

  const [deleting, setDeleting] = useState(false);
  const deleteAccount = async () => {
    if (!user || deleting) return;
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir sua conta?\n\n" +
        "Esta ação é IRREVERSÍVEL. Seu perfil será removido do diretório público, " +
        "todas as mensagens enviadas serão desvinculadas e os pagamentos sinalizados " +
        "ficarão no histórico mas sem conta associada."
    );
    if (!confirmed) return;
    const reConfirm = window.prompt(
      'Digite EXCLUIR (em maiúsculas) para confirmar a exclusão definitiva da sua conta:'
    );
    if (reConfirm !== "EXCLUIR") {
      toast("Exclusão cancelada.");
      return;
    }
    setDeleting(true);
    try {
      await requestJson<{ ok: true }>("/api/painel/profile", { method: "DELETE" }, 15000);
      // signOut local pra limpar cache do Supabase no browser
      try {
        const supabase = createClient();
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
      toast("Conta excluída. Sentimos sua saída.");
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("[painel:deleteAccount]", err);
      toast(err instanceof Error ? err.message : "Erro ao excluir conta.", "error");
      setDeleting(false);
    }
  };

  if (loadState !== "ready" || !user) {
    const isLoading = loadState === "loading";
    const title =
      loadState === "unauthorized"
        ? "Sessão expirada"
        : loadState === "profile_missing"
        ? "Cadastro incompleto"
        : isLoading
        ? "Carregando painel"
        : "Não foi possível abrir o painel";
    const body =
      loadState === "unauthorized"
        ? "Entre novamente para acessar seu painel."
        : loadState === "profile_missing"
        ? "Não encontramos seu perfil de advogado. Refaça o cadastro ou fale com o suporte."
        : isLoading
        ? "Estamos buscando seus dados com segurança."
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
      {/* HERO do dashboard — navy com métricas */}
      <section
        className="rounded-3xl text-white p-6 md:p-8 mb-6 relative overflow-hidden"
        style={{ background: "#0F1B2D" }}
      >
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            top: -120,
            right: -40,
            width: 360,
            height: 300,
            background: "none"
          }}
        />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "#E3C078" }}>
              Painel do advogado
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
              Olá, {user.name.split(" ")[0] || "advogado"}
            </h1>
            <p className="text-sm mt-1.5" style={{ color: "#A9B4C6" }}>
              {planMessage(status, daysLeft)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/advogado/${user.slug}`}
              target="_blank"
              className="inline-flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg text-white border border-white/20 hover:bg-white/10 transition"
            >
              <ExternalLink className="w-4 h-4" aria-hidden />
              Ver perfil público
            </Link>
            <button
              onClick={logout}
              aria-label="Sair"
              className="inline-flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg text-white/80 hover:bg-white/10 transition"
            >
              <LogOut className="w-4 h-4" aria-hidden /> Sair
            </button>
          </div>
        </div>

        {status === "free" && (
          <div className="relative mt-5 rounded-2xl bg-white/[0.06] border border-white/10 p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6" style={{ color: "#C8A24A" }} aria-hidden />
              <div>
                <p className="font-semibold text-sm">Você está perdendo visibilidade</p>
                <p className="text-[13px]" style={{ color: "#A9B4C6" }}>
                  Ative o premium por {formatCurrency(PLAN.price)} e apareça primeiro nas buscas de {user.cityName}.
                </p>
              </div>
            </div>
            <Link
              href="/painel/pagamento"
              className="font-bold text-sm px-5 py-2.5 rounded-xl whitespace-nowrap"
              style={{ background: "#C8A24A", color: "#0F1B2D" }}
            >
              Ativar premium
            </Link>
          </div>
        )}
        {status === "pending" && (
          <div className="relative mt-5 rounded-2xl bg-white/[0.06] border border-white/10 p-4 flex items-start gap-3">
            <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#E3C078" }} aria-hidden />
            <div>
              <p className="font-semibold text-sm">Pagamento em análise</p>
              <p className="text-[13px]" style={{ color: "#A9B4C6" }}>
                Recebemos sua sinalização. A ativação será feita em até {PLAN.activationHours} horas. Pagamento
                marcado em {formatDate(user.paymentDate)}.
              </p>
            </div>
          </div>
        )}
        {status === "expired" && (
          <div className="relative mt-5 rounded-2xl bg-white/[0.06] border border-white/10 p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-300" aria-hidden />
              <div>
                <p className="font-semibold text-sm">Seu plano expirou</p>
                <p className="text-[13px]" style={{ color: "#A9B4C6" }}>
                  Renove agora para voltar ao destaque na sua cidade.
                </p>
              </div>
            </div>
            <Link
              href="/painel/pagamento"
              className="font-bold text-sm px-5 py-2.5 rounded-xl whitespace-nowrap"
              style={{ background: "#C8A24A", color: "#0F1B2D" }}
            >
              Renovar
            </Link>
          </div>
        )}

        <div className="relative mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              label: "Plano",
              value:
                status === "active"
                  ? "Premium"
                  : status === "pending"
                  ? "Em análise"
                  : status === "expired"
                  ? "Vencido"
                  : "Gratuito",
              sub:
                status === "active" && daysLeft !== null
                  ? `${daysLeft} dias restantes`
                  : status === "free"
                  ? "ative o destaque"
                  : ""
            },
            {
              label: "Perfil completo",
              value: `${completeness}%`,
              sub: completeness >= 80 ? "ótimo" : "complete seu perfil"
            },
            { label: "Áreas de atuação", value: String(user.specialties.length), sub: "especialidades" },
            {
              label: "Cidades",
              value: String(1 + (user.extraCities?.length || 0)),
              sub: "onde você aparece"
            }
          ].map((m) => (
            <div key={m.label} className="rounded-2xl bg-white/[0.07] border border-white/10 p-4">
              <p className="text-[11px] uppercase tracking-wide" style={{ color: "#7E8BA1" }}>
                {m.label}
              </p>
              <p className="font-display text-2xl font-semibold mt-1">{m.value}</p>
              {m.sub && (
                <p className="text-[11px] mt-0.5" style={{ color: "#9FB0CB" }}>
                  {m.sub}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Página Profissional AdvAqui — recurso Premium (Maio/2026).
              Card adapta automaticamente: publicada / incompleta / pending /
              upsell pra free/expired. */}
          <MyProfessionalPageCard lawyer={user} />

          {/* Atalhos rápidos para módulos da Página Profissional (Fase 3).
              Só pra premium ativo. Quando a migration 0006 está pendente,
              cada página individual mostra aviso amigável. */}
          {status === "active" && (
            <section className="card">
              <h2 className="font-display text-lg font-bold text-brand-ink mb-3">
                Conteúdo da Página Profissional
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Link
                  href="/painel/artigos"
                  className="group rounded-xl border border-brand-line bg-white p-4 hover:border-brand-deep transition"
                >
                  <FileText className="w-5 h-5 text-brand-deep mb-2 group-hover:scale-110 transition" aria-hidden />
                  <p className="font-semibold text-sm text-brand-ink">Artigos próprios</p>
                  <p className="text-xs text-brand-ink/65 mt-0.5">
                    Publique conteúdo informativo nas suas áreas.
                  </p>
                </Link>
                <Link
                  href="/painel/perguntas"
                  className="group rounded-xl border border-brand-line bg-white p-4 hover:border-brand-deep transition"
                >
                  <HelpCircle className="w-5 h-5 text-brand-deep mb-2 group-hover:scale-110 transition" aria-hidden />
                  <p className="font-semibold text-sm text-brand-ink">Perguntas de leitores</p>
                  <p className="text-xs text-brand-ink/65 mt-0.5">
                    Modere e responda as dúvidas recebidas.
                  </p>
                </Link>
                <Link
                  href="/painel/aparencia"
                  className="group rounded-xl border border-brand-line bg-white p-4 hover:border-brand-deep transition"
                >
                  <Palette className="w-5 h-5 text-brand-deep mb-2 group-hover:scale-110 transition" aria-hidden />
                  <p className="font-semibold text-sm text-brand-ink">Aparência</p>
                  <p className="text-xs text-brand-ink/65 mt-0.5">
                    Controle o que aparece na sua Página Profissional.
                  </p>
                </Link>
              </div>
            </section>
          )}

          {/* Ferramentas jurídicas — todas visíveis, premium gating nas IA */}
          <section className="rounded-2xl border border-brand-line bg-white overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b border-brand-line/60 bg-brand-bg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-deep/10 flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-brand-deep" aria-hidden />
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-bold text-brand-ink">
                      Ferramentas jurídicas
                    </h2>
                    <p className="text-xs text-brand-ink/60">
                      {status === "active"
                        ? "Acesso completo — todas as ferramentas desbloqueadas"
                        : "Ative o premium para desbloquear ferramentas com IA"}
                    </p>
                  </div>
                </div>
                <Link
                  href="/ferramentas"
                  className="text-xs font-medium text-brand-deep hover:text-brand-accent transition hidden sm:inline-flex items-center gap-1"
                >
                  Ver todas <ExternalLink className="w-3 h-3" aria-hidden />
                </Link>
              </div>
            </div>
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {PANEL_TOOLS.map((tool) => {
                const locked = tool.premium && status !== "active";
                const cardClass = `group relative rounded-xl border p-3.5 transition ${
                  locked
                    ? "border-brand-line/50 bg-brand-bg/40 cursor-default"
                    : "border-brand-line bg-white hover:border-brand-deep hover:shadow-card"
                }`;
                const inner = (
                  <>
                    <div className="flex items-start justify-between mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        tool.premium
                          ? locked
                            ? "bg-brand-ink/5"
                            : "bg-brand-accent/15"
                          : "bg-brand-deep/8"
                      }`}>
                        <tool.Icon className={`w-4 h-4 ${
                          locked ? "text-brand-ink/30" : tool.premium ? "text-brand-accent" : "text-brand-deep"
                        }`} aria-hidden />
                      </div>
                      {tool.premium && (
                        locked ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-brand-ink/5 text-brand-ink/40">
                            <Lock className="w-2.5 h-2.5" aria-hidden /> Premium
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-brand-accent/15 text-brand-accentText">
                            <Sparkles className="w-2.5 h-2.5" aria-hidden /> IA
                          </span>
                        )
                      )}
                    </div>
                    <p className={`text-sm font-semibold leading-tight ${
                      locked ? "text-brand-ink/40" : "text-brand-ink"
                    }`}>
                      {tool.label}
                    </p>
                    <p className={`text-[11px] mt-1 leading-snug ${
                      locked ? "text-brand-ink/25" : "text-brand-ink/55"
                    }`}>
                      {tool.desc}
                    </p>
                    {locked && (
                      <Link
                        href="/painel/pagamento"
                        className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-brand-accentText hover:text-brand-deep transition"
                      >
                        Desbloquear <Star className="w-2.5 h-2.5" aria-hidden />
                      </Link>
                    )}
                  </>
                );
                return locked ? (
                  <div key={tool.href} className={cardClass}>{inner}</div>
                ) : (
                  <Link key={tool.href} href={tool.href} className={cardClass}>{inner}</Link>
                );
              })}
            </div>
          </section>

          {/* Foto de perfil — disponível pra qualquer plano. Endpoint
              /api/painel/photo trata upload via Supabase Storage. */}
          <PhotoUploader
            initialPhotoUrl={user.photoUrl}
            fallbackName={user.name}
            onChange={(url) => setUser({ ...user, photoUrl: url || undefined })}
          />

          <section id="meu-perfil" className="card scroll-mt-24">
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
                  <label className="label">Endereço profissional</label>
                  <input
                    className="input"
                    value={draft.address || ""}
                    onChange={(event) => setDraft({ ...draft, address: event.target.value })}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="label">Bio (até 500 caracteres)</label>
                    <button
                      type="button"
                      onClick={() => {
                        // Assistente de Bio — preenche um esqueleto editável
                        // baseado no perfil atual. O advogado completa.
                        const areas = (
                          draft.primarySpecialties && draft.primarySpecialties.length > 0
                            ? draft.primarySpecialties
                            : draft.specialties
                        )
                          .map(
                            (slug) =>
                              SPECIALTIES.find((s) => s.slug === slug)?.name || slug
                          )
                          .slice(0, 3)
                          .join(", ");
                        const cidade = draft.cityName || "sua cidade";
                        const uf = draft.uf || "";
                        const modalidade =
                          (draft.serviceModalities || []).includes("in_person") &&
                          (draft.serviceModalities || []).includes("online")
                            ? "presencial e online"
                            : (draft.serviceModalities || []).includes("online")
                            ? "online"
                            : "presencial";
                        const template = `${draft.name} atua em ${areas || "suas áreas de atuação"}, com atendimento em ${cidade}${uf ? "/" + uf : ""}${draft.serviceRegion ? " e região (" + draft.serviceRegion + ")" : ""}. Sua atuação é voltada às demandas dos clientes da região, oferecendo orientação jurídica de forma ${modalidade}, conforme as necessidades de cada caso.`;
                        if (
                          draft.bio &&
                          !window.confirm(
                            "Já existe uma bio escrita. Substituir pelo modelo do assistente?"
                          )
                        ) {
                          return;
                        }
                        setDraft({ ...draft, bio: template.slice(0, 500) });
                      }}
                      className="text-xs text-brand-deep hover:text-brand-accent2 underline-offset-2 hover:underline"
                    >
                      Usar assistente
                    </button>
                  </div>
                  <textarea
                    className="input min-h-24"
                    value={draft.bio || ""}
                    maxLength={500}
                    onChange={(event) => setDraft({ ...draft, bio: event.target.value })}
                  />

                  {/* Melhorar perfil com IA — Premium */}
                  {status === "active" ? (
                    <button
                      type="button"
                      onClick={improveProfileWithAI}
                      disabled={aiLoading}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-brand-accent/15 text-brand-accentText hover:bg-brand-accent/25 transition disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5" aria-hidden />
                      {aiLoading ? "Gerando sugestões..." : "Melhorar apresentação com IA"}
                    </button>
                  ) : (
                    <Link
                      href="/painel/pagamento"
                      className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg bg-brand-ink/5 text-brand-ink/40"
                    >
                      <Lock className="w-3 h-3" aria-hidden />
                      Melhore seu perfil com IA — Premium
                    </Link>
                  )}

                  {/* Preview das sugestões da IA */}
                  {aiSuggestions && (
                    <div className="mt-3 rounded-xl border-2 border-brand-accent/30 bg-brand-accent/5 p-4 space-y-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-4 h-4 text-brand-accent" aria-hidden />
                        <p className="text-sm font-semibold text-brand-ink">Sugestão da IA</p>
                      </div>

                      <div>
                        <p className="text-[11px] font-medium text-brand-ink/60 mb-1">Bio sugerida</p>
                        <p className="text-sm text-brand-ink leading-relaxed whitespace-pre-line bg-white rounded-lg p-3 border border-brand-line">
                          {aiSuggestions.bio}
                        </p>
                      </div>

                      {aiSuggestions.shortSummary && (
                        <div>
                          <p className="text-[11px] font-medium text-brand-ink/60 mb-1">Resumo curto sugerido</p>
                          <p className="text-sm text-brand-ink bg-white rounded-lg p-3 border border-brand-line">
                            {aiSuggestions.shortSummary}
                          </p>
                        </div>
                      )}

                      {aiSuggestions.suggestedTitle && (
                        <div>
                          <p className="text-[11px] font-medium text-brand-ink/60 mb-1">Título profissional sugerido</p>
                          <p className="text-sm text-brand-ink bg-white rounded-lg p-3 border border-brand-line">
                            {aiSuggestions.suggestedTitle}
                          </p>
                        </div>
                      )}

                      {(aiSuggestions.suggestedSpecialties?.length || 0) > 0 && (
                        <div>
                          <p className="text-[11px] font-medium text-brand-ink/60 mb-1">
                            Áreas relacionadas que você talvez também atenda
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {aiSuggestions.suggestedSpecialties!.map((sp) => {
                              const jaTem = draft.specialties.includes(sp.slug);
                              return (
                                <button
                                  key={sp.slug}
                                  type="button"
                                  disabled={jaTem}
                                  onClick={() => {
                                    toggleDraftSpec(sp.slug);
                                    toast(`Área "${sp.name}" adicionada. Revise e salve.`);
                                  }}
                                  className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border border-brand-accent/40 bg-white text-brand-ink hover:bg-brand-accent/10 transition disabled:opacity-40"
                                >
                                  + {sp.name}
                                </button>
                              );
                            })}
                          </div>
                          <p className="text-[10px] text-brand-ink/45 mt-1">
                            Adicione só as áreas em que você atua de verdade.
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setDraft({
                              ...draft,
                              bio: aiSuggestions.bio.slice(0, 500),
                              shortSummary: aiSuggestions.shortSummary
                                ? aiSuggestions.shortSummary.slice(0, 160)
                                : draft.shortSummary
                            });
                            setAiSuggestions(null);
                            toast("Sugestão aplicada. Revise e clique em Salvar quando estiver satisfeito.");
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-brand-deep text-white hover:bg-brand-deep/90 transition"
                        >
                          <CheckSquare className="w-3.5 h-3.5" aria-hidden />
                          Usar esta versão
                        </button>
                        <button
                          type="button"
                          onClick={() => setAiSuggestions(null)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-lg border border-brand-line text-brand-ink/70 hover:bg-brand-bg transition"
                        >
                          Descartar
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Resumo profissional curto — Fase 3 */}
                {status === "active" && (
                  <div>
                    <label className="label">
                      Resumo profissional curto (até 160 caracteres)
                    </label>
                    <textarea
                      className="input min-h-16"
                      value={draft.shortSummary || ""}
                      maxLength={160}
                      placeholder="Ex.: Atuação em Direito Civil, Família e Previdenciário em Almenara/MG e região, com atendimento presencial e online."
                      onChange={(e) =>
                        setDraft({ ...draft, shortSummary: e.target.value })
                      }
                    />
                    <p className="text-[11px] text-brand-ink/55 mt-1">
                      Aparece no topo da sua Página Profissional, abaixo do nome/OAB.
                      {(draft.shortSummary || "").length} / 160 caracteres
                    </p>
                  </div>
                )}

                <div>
                  <label className="label">Áreas de atuação</label>
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

                {/* Áreas principais (até 3) — Fase 3 */}
                {status === "active" && draft.specialties.length > 0 && (
                  <div>
                    <label className="label">
                      Áreas principais (escolha até 3 para destacar)
                    </label>
                    <p className="text-xs text-brand-ink/60 mb-2">
                      As áreas marcadas aqui aparecem em destaque no topo. As
                      demais ficam em &quot;Outras áreas informadas&quot;.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {draft.specialties.map((slug) => {
                        const active = (draft.primarySpecialties || []).includes(slug);
                        const reachedLimit =
                          !active && (draft.primarySpecialties || []).length >= 3;
                        return (
                          <button
                            key={`primary-${slug}`}
                            type="button"
                            disabled={reachedLimit}
                            onClick={() => {
                              const current = draft.primarySpecialties || [];
                              const next = active
                                ? current.filter((s) => s !== slug)
                                : [...current, slug].slice(0, 3);
                              setDraft({ ...draft, primarySpecialties: next });
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                              active
                                ? "bg-brand-accent2 text-white border-brand-accent2"
                                : reachedLimit
                                ? "bg-brand-line/30 text-brand-ink/40 border-brand-line cursor-not-allowed"
                                : "bg-white text-brand-ink border-brand-line hover:border-brand-accent2"
                            }`}
                          >
                            {SPECIALTIES.find((s) => s.slug === slug)?.name || slug}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Atendimento — Fase 3 */}
                {status === "active" && (
                  <div className="rounded-xl border border-brand-line bg-brand-bg/30 p-4 space-y-3">
                    <p className="text-xs font-semibold text-brand-ink">
                      Atendimento (Página Profissional)
                    </p>
                    <div>
                      <label className="label">Modalidade</label>
                      <div className="flex flex-wrap gap-2">
                        {(["in_person", "online"] as const).map((mod) => {
                          const active = (draft.serviceModalities || []).includes(mod);
                          const label =
                            mod === "in_person" ? "Presencial" : "Online";
                          return (
                            <button
                              key={mod}
                              type="button"
                              onClick={() => {
                                const cur = draft.serviceModalities || [];
                                const next = active
                                  ? cur.filter((m) => m !== mod)
                                  : [...cur, mod];
                                setDraft({ ...draft, serviceModalities: next });
                              }}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                                active
                                  ? "bg-brand-deep text-white border-brand-deep"
                                  : "bg-white text-brand-ink border-brand-line hover:border-brand-deep"
                              }`}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <label className="label">Região atendida (texto livre)</label>
                      <input
                        className="input text-sm"
                        placeholder="Ex.: Almenara/MG e região do Vale do Jequitinhonha"
                        maxLength={200}
                        value={draft.serviceRegion || ""}
                        onChange={(e) =>
                          setDraft({ ...draft, serviceRegion: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="label">Canal preferencial de contato</label>
                      <select
                        className="input text-sm"
                        value={draft.preferredContact || ""}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            preferredContact:
                              (e.target.value as "whatsapp" | "phone" | "email") ||
                              undefined
                          })
                        }
                      >
                        <option value="">— Sem preferência declarada —</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="phone">Telefone</option>
                        <option value="email">E-mail</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="rounded-xl border border-brand-line bg-brand-bg p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="text-xs font-semibold text-brand-ink">
                        Cidades adicionais ({(draft.extraCities || []).length} / 9)
                      </p>
                      <p className="text-xs text-brand-ink/60 mt-1">
                        Disponível apenas para premium. O perfil aparece em cada cidade listada.
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
                        // KEY ESTAVEL POR INDICE — o slug muda a cada letra
                        // digitada, entao se a key usasse city.slug, o React
                        // desmontaria o input a cada keystroke e o foco seria
                        // perdido. O array nao reordena durante edicao, entao
                        // index puro eh seguro aqui.
                        <ExtraCityField
                          key={`extra-${index}`}
                          value={city}
                          disabled={status !== "active"}
                          onChange={(next) => {
                            const list = [...(draft.extraCities || [])];
                            list[index] = next;
                            setDraft({ ...draft, extraCities: list });
                          }}
                          onRemove={() => removeExtraCity(index)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Bloco PREMIUM extra: presença digital, horários */}
                <div
                  className={`rounded-xl border p-4 ${
                    status === "active"
                      ? "border-brand-accent/40 bg-brand-accent/5"
                      : "border-brand-line bg-brand-bg/40"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Star
                      className={`w-4 h-4 ${
                        status === "active" ? "text-brand-accent fill-brand-accent" : "text-brand-ink/30"
                      }`}
                      aria-hidden
                    />
                    <p className="text-xs font-semibold text-brand-ink">
                      Presença digital e horários (premium)
                    </p>
                  </div>
                  <p className="text-xs text-brand-ink/60 mb-3">
                    Apenas advogados com plano premium ativo têm esses campos exibidos
                    no perfil público. Você pode preencher mesmo gratuito — começa a
                    aparecer assim que ativar o plano.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <label className="label">Horários de atendimento</label>
                      <OfficeHoursEditor
                        value={draft.officeHours || ""}
                        onChange={(next) => setDraft({ ...draft, officeHours: next })}
                      />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <label className="label">Site (URL)</label>
                        <input
                          className="input text-sm"
                          placeholder="meusite.com.br"
                          maxLength={250}
                          value={draft.website || ""}
                          onChange={(event) =>
                            setDraft({ ...draft, website: event.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="label">Instagram</label>
                        <input
                          className="input text-sm"
                          placeholder="seu_perfil"
                          maxLength={60}
                          value={draft.instagram || ""}
                          onChange={(event) =>
                            setDraft({ ...draft, instagram: event.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="label">LinkedIn</label>
                        <input
                          className="input text-sm"
                          placeholder="seu-perfil"
                          maxLength={100}
                          value={draft.linkedin || ""}
                          onChange={(event) =>
                            setDraft({ ...draft, linkedin: event.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-brand-ink/50 pt-2 border-t border-brand-line">
                  <strong>Cidade principal e OAB não são editáveis</strong> pelo painel. Para
                  mudanças nesses campos, fale com o suporte abaixo.
                </p>

                <div className="flex gap-2 pt-2">
                  <button onClick={saveEdit} className="btn-primary" disabled={saving}>
                    {saving ? "Salvando..." : "Salvar alterações"}
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
                  ["Endereço", user.address || "-"],
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
                    "Áreas",
                    user.specialties
                      .map((slug) => SPECIALTIES.find((item) => item.slug === slug)?.name)
                      .filter(Boolean)
                      .join(", ") || "-"
                  ],
                  ["Bio", user.bio || "-"],
                  ["Horário de atendimento", user.officeHours || (status === "active" ? "-" : "- (premium)")],
                  ["Site", user.website || (status === "active" ? "-" : "- (premium)")],
                  ["Instagram", user.instagram ? `@${user.instagram}` : (status === "active" ? "-" : "- (premium)")],
                  ["LinkedIn", user.linkedin || (status === "active" ? "-" : "- (premium)")]
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
              Dúvidas sobre pagamento, ativação ou perfil. Respondemos em até 48 horas pelo e-mail cadastrado.
            </p>
            <textarea
              className="input min-h-24 resize-y"
              placeholder="Descreva sua dúvida ou problema com detalhes (mínimo 10 caracteres)..."
              value={msg}
              onChange={(event) => setMsg(event.target.value)}
            />
            <p className="text-xs text-brand-ink/50 mt-2">
              {msg.trim().length < 10 ? (
                <>{msg.trim().length} / 10 caracteres mínimos</>
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

          <section className="rounded-2xl border-2 border-red-200 bg-red-50 p-5">
            <h2 className="font-display text-lg font-bold text-red-900 mb-1">
              Zona de perigo
            </h2>
            <p className="text-sm text-red-900/80 mb-3">
              Exclui permanentemente sua conta do AdvAqui. Seu perfil sai do
              diretório público imediatamente. Esta ação não pode ser desfeita.
            </p>
            <button
              type="button"
              onClick={deleteAccount}
              disabled={deleting}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition disabled:opacity-50"
            >
              {deleting ? "Excluindo..." : "Excluir minha conta"}
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
          </div>

          <div className="rounded-2xl bg-brand-deep/5 border border-brand-deep/20 p-5">
            <Star className="w-5 h-5 text-brand-accent mb-2" aria-hidden />
            <p className="text-sm font-semibold text-brand-deep">Dica de visibilidade</p>
            <p className="text-xs text-brand-ink/70 mt-1 leading-relaxed">
              Perfis com telefone, WhatsApp, bio e áreas de atuação bem preenchidas tendem a converter melhor.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden border border-brand-line bg-white">
            <div className="px-4 py-3 bg-brand-ink">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-accent" aria-hidden />
                <p className="text-sm font-bold text-white">Recursos</p>
              </div>
            </div>
            <ul className="divide-y divide-brand-line/50">
              {[
                { href: "/checklist", icon: CheckSquare, label: "Checklist digital", sub: "21 itens práticos" },
                { href: "/modelos", icon: FileText, label: "Modelos prontos", sub: "Procuração, contratos" },
                { href: "/marketing-juridico", icon: Target, label: "Marketing jurídico", sub: "Guias completos" },
                { href: "/blog", icon: BookOpen, label: "Blog jurídico", sub: "Artigos por área" },
                { href: "/ferramentas", icon: Wrench, label: "Todas as ferramentas", sub: "Calculadoras, prazos, IA" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-brand-bg transition group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand-deep/8 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-deep/15 transition">
                      <item.icon className="w-4 h-4 text-brand-deep" aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-brand-ink truncate">{item.label}</p>
                      <p className="text-[11px] text-brand-ink/50">{item.sub}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
