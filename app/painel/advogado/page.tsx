import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  User,
  TrendingUp,
  Eye,
  FileText,
  Star,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Sparkles,
  Users,
  BookOpen,
  CreditCard,
  Crown,
  Clock,
  Lightbulb,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Meu Dashboard — Painel AdvAqui",
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

type ProfileField = {
  label: string;
  filled: boolean;
  weight: number;
};

function computeProfileFields(lawyer: Record<string, unknown>): ProfileField[] {
  return [
    {
      label: "Foto de perfil",
      filled: !!(lawyer.photo_url as string),
      weight: 15,
    },
    {
      label: "Bio (min. 20 caracteres)",
      filled: !!((lawyer.bio as string)?.trim()?.length >= 20),
      weight: 15,
    },
    {
      label: "Telefone",
      filled: !!(lawyer.phone as string),
      weight: 10,
    },
    {
      label: "WhatsApp",
      filled: !!(lawyer.whatsapp as string),
      weight: 10,
    },
    {
      label: "Endereco profissional",
      filled: !!(lawyer.address as string),
      weight: 10,
    },
    {
      label: "Areas de atuacao",
      filled: ((lawyer.specialties as string[]) ?? []).length > 0,
      weight: 15,
    },
    {
      label: "Resumo profissional",
      filled: !!((lawyer.short_summary as string)?.trim()),
      weight: 10,
    },
    {
      label: "Areas principais",
      filled: ((lawyer.primary_specialties as string[]) ?? []).length > 0,
      weight: 10,
    },
    {
      label: "Horario de atendimento",
      filled: !!(lawyer.office_hours as string),
      weight: 5,
    },
    {
      label: "Website",
      filled: !!(lawyer.website as string),
      weight: 5,
    },
  ];
}

const FIELD_TIPS: Record<string, string> = {
  "Foto de perfil":
    "Adicione sua foto: perfis com foto recebem mais contatos.",
  "Bio (min. 20 caracteres)":
    "Escreva uma bio: clientes escolhem quem conta sua historia.",
  Telefone: "Informe seu telefone para facilitar o contato direto.",
  WhatsApp:
    "Cadastre o WhatsApp: e o canal preferido de quem busca advogado.",
  "Endereco profissional":
    "Inclua seu endereco: transmite credibilidade e presenca local.",
  "Areas de atuacao":
    "Selecione suas areas de atuacao para aparecer nas buscas certas.",
  "Resumo profissional":
    "Um resumo curto ajuda o cliente a entender seu diferencial.",
  "Areas principais":
    "Defina suas areas principais para ganhar destaque nelas.",
  "Horario de atendimento":
    "Informe seu horario de atendimento e evite contatos perdidos.",
  Website: "Adicione seu site ou pagina profissional, se tiver.",
};

function computeScore(fields: ProfileField[]): number {
  const totalWeight = fields.reduce((s, f) => s + f.weight, 0);
  const earned = fields
    .filter((f) => f.filled)
    .reduce((s, f) => s + f.weight, 0);
  return totalWeight > 0 ? Math.round((earned / totalWeight) * 100) : 0;
}

function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-600";
}

function scoreBg(score: number): string {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-red-500";
}

function scoreRingTrack(score: number): string {
  if (score >= 80) return "stroke-emerald-100";
  if (score >= 50) return "stroke-amber-100";
  return "stroke-red-100";
}

function scoreRingFill(score: number): string {
  if (score >= 80) return "stroke-emerald-500";
  if (score >= 50) return "stroke-amber-500";
  return "stroke-red-500";
}

/* ------------------------------------------------------------------ */
/* Page (Server Component)                                             */
/* ------------------------------------------------------------------ */

export default async function AdvogadoDashboardPage() {
  /* --- Auth -------------------------------------------------------- */
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/painel/advogado");
  }

  /* --- Fetch lawyer profile ---------------------------------------- */
  const admin = createAdminClient();
  const { data: lawyerRow, error: lawyerError } = await admin
    .from("lawyers")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (lawyerError || !lawyerRow) {
    return (
      <div className="container-tight py-10">
        <div className="card text-center py-12">
          <User
            className="w-12 h-12 text-brand-ink/20 mx-auto mb-4"
            aria-hidden
          />
          <h1 className="font-display text-2xl font-bold text-brand-ink mb-2">
            Perfil nao encontrado
          </h1>
          <p className="text-sm text-brand-ink/60 max-w-md mx-auto mb-4">
            Nao encontramos um perfil de advogado vinculado a esta conta.
            Cadastre-se para aparecer no diretorio.
          </p>
          <Link href="/cadastro" className="btn-primary">
            Fazer cadastro
          </Link>
        </div>
      </div>
    );
  }

  const lawyer = lawyerRow as Record<string, unknown>;
  const lawyerSlug = lawyer.slug as string;
  const lawyerName = (lawyer.name as string) || "Advogado";
  const firstName = lawyerName.split(" ")[0];
  const planStatus = (lawyer.plan_status as string) || "free";
  const isPremium = planStatus === "active";

  /* --- Premium days remaining --------------------------------------- */
  const planEndDate = lawyer.plan_end_date as string | null;
  let premiumDaysLeft: number | null = null;
  if (isPremium && planEndDate) {
    const diffMs = new Date(planEndDate).getTime() - Date.now();
    premiumDaysLeft = Math.max(0, Math.ceil(diffMs / (24 * 60 * 60 * 1000)));
  }

  /* --- Profile completeness ---------------------------------------- */
  const profileFields = computeProfileFields(lawyer);
  const profileScore = computeScore(profileFields);
  const missingFields = profileFields.filter((f) => !f.filled);
  const filledCount = profileFields.filter((f) => f.filled).length;

  /* --- Profile views this month ------------------------------------ */
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const { count: monthViews } = await admin
    .from("site_visits")
    .select("*", { count: "exact", head: true })
    .like("path", `/advogado/${lawyerSlug}%`)
    .gte("visited_at", monthStart.toISOString())
    .eq("is_bot", false);

  /* --- Leads matched to area/city ---------------------------------- */
  const specialties = (lawyer.specialties as string[]) ?? [];
  const targetCity = (lawyer.target_city as string) || "";
  const targetUf = (lawyer.target_uf as string) || "";

  let matchedLeadsCount = 0;

  if (specialties.length > 0 || targetCity) {
    let leadsQuery = admin
      .from("leads")
      .select("*", { count: "exact", head: true });

    if (targetCity && targetUf) {
      leadsQuery = leadsQuery.eq("cidade", targetCity).eq("uf", targetUf);
    }

    const { count } = await leadsQuery;
    matchedLeadsCount = count ?? 0;
  }

  /* --- Published articles by this lawyer --------------------------- */
  const { count: myArticles } = await admin
    .from("blog_articles")
    .select("*", { count: "exact", head: true })
    .eq("author_id", user.id)
    .eq("status", "published");

  /* --- Ring chart values ------------------------------------------- */
  const circumference = 2 * Math.PI * 40; // radius = 40
  const dashOffset = circumference - (profileScore / 100) * circumference;

  /* --- Render ------------------------------------------------------ */
  const metrics = [
    {
      label: "Perfil completo",
      value: `${profileScore}%`,
      sub:
        profileScore >= 80
          ? "Ótimo nível"
          : `${missingFields.length} campo${missingFields.length !== 1 ? "s" : ""} pendente${missingFields.length !== 1 ? "s" : ""}`,
      Icon: User,
    },
    {
      label: "Visitas este mês",
      value: String(monthViews ?? 0),
      sub: "no seu perfil, sem bots",
      Icon: Eye,
    },
    {
      label: "Leads na região",
      value: String(matchedLeadsCount),
      sub: targetCity ? `${targetCity}/${targetUf}` : "configure sua cidade",
      Icon: Users,
    },
    {
      label: "Artigos publicados",
      value: String(myArticles ?? 0),
      sub: "de sua autoria",
      Icon: FileText,
    },
    ...(premiumDaysLeft !== null
      ? [
          {
            label: "Premium restante",
            value: `${premiumDaysLeft}d`,
            sub: premiumDaysLeft <= 5 ? "renove em breve" : "dias de destaque",
            Icon: Clock,
          },
        ]
      : []),
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-12">
      {/* ============================================================= */}
      {/* PAGE HEADER                                                    */}
      {/* ============================================================= */}
      <header className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-brand-ink">
              Olá, {firstName}
            </h1>
            {isPremium ? (
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide"
                style={{
                  background: "rgba(200,162,74,0.12)",
                  border: "1px solid rgba(200,162,74,0.4)",
                  color: "#8A6D25",
                }}
              >
                <Crown className="w-3.5 h-3.5" style={{ color: "#C8A24A" }} aria-hidden />
                Premium
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide bg-brand-ink/5 border border-brand-line text-brand-ink/60">
                Grátis
              </span>
            )}
          </div>
          <p className="text-sm text-brand-ink/60 mt-1.5">
            {isPremium
              ? "Plano premium ativo — você aparece em destaque nas buscas."
              : "Cadastro gratuito ativo. Veja abaixo como fortalecer sua presença."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/advogado/${lawyerSlug}`}
            target="_blank"
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl text-brand-ink border border-brand-line bg-white hover:bg-brand-bg transition"
          >
            <ExternalLink className="w-4 h-4" aria-hidden />
            Ver perfil público
          </Link>
          <Link
            href="/painel/meu-perfil"
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition hover:opacity-90"
            style={{ background: "#0F1B2D", color: "#FFFFFF" }}
          >
            <User className="w-4 h-4" aria-hidden />
            Editar perfil
          </Link>
        </div>
      </header>

      {/* ============================================================= */}
      {/* METRIC CARDS                                                   */}
      {/* ============================================================= */}
      <section
        className={`grid grid-cols-2 gap-3 md:gap-4 mb-8 ${
          premiumDaysLeft !== null ? "lg:grid-cols-5" : "lg:grid-cols-4"
        }`}
        aria-label="Métricas do perfil"
      >
        {metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-2xl border border-brand-line bg-white p-5"
          >
            <div className="flex items-center gap-2">
              <m.Icon className="w-4 h-4 text-brand-ink/40" aria-hidden />
              <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-ink/50">
                {m.label}
              </p>
            </div>
            <p className="font-display text-3xl font-bold text-brand-ink mt-3 tabular-nums">
              {m.value}
            </p>
            <p className="text-xs text-brand-ink/50 mt-1">{m.sub}</p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ============================================================= */}
        {/* MAIN COLUMN                                                    */}
        {/* ============================================================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* VISITS + LEADS */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-brand-line bg-white p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-brand-deep/[0.06] flex items-center justify-center">
                  <Eye className="w-5 h-5 text-brand-deep" aria-hidden />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-ink">
                    Visitas ao perfil
                  </p>
                  <p className="text-xs text-brand-ink/50">
                    Este mês (excluindo bots)
                  </p>
                </div>
              </div>
              <p className="font-display text-4xl font-bold text-brand-ink tabular-nums">
                {monthViews ?? 0}
              </p>
              <p className="text-xs text-brand-ink/50 mt-1.5">
                Visitantes únicos em /advogado/{lawyerSlug}
              </p>
            </div>

            <div className="rounded-2xl border border-brand-line bg-white p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-brand-deep/[0.06] flex items-center justify-center">
                  <Users className="w-5 h-5 text-brand-deep" aria-hidden />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-ink">
                    Leads na sua região
                  </p>
                  <p className="text-xs text-brand-ink/50">
                    {targetCity
                      ? `${targetCity}/${targetUf}`
                      : "Cidade não configurada"}
                  </p>
                </div>
              </div>
              <p className="font-display text-4xl font-bold text-brand-ink tabular-nums">
                {matchedLeadsCount}
              </p>
              <p className="text-xs text-brand-ink/50 mt-1.5">
                Pessoas buscando advogado na região
              </p>
            </div>
          </div>

          {/* ARTICLES */}
          <section className="rounded-2xl border border-brand-line bg-white p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-deep/[0.06] flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-brand-deep" aria-hidden />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-brand-ink">
                    Seus artigos
                  </h2>
                  <p className="text-xs text-brand-ink/50">
                    Conteúdo publicado no blog
                  </p>
                </div>
              </div>
              <Link
                href="/painel/artigos"
                className="inline-flex items-center gap-1.5 text-sm font-medium px-3.5 py-2 rounded-lg border border-brand-line text-brand-ink hover:bg-brand-bg transition"
              >
                Gerenciar <ArrowRight className="w-3.5 h-3.5" aria-hidden />
              </Link>
            </div>

            {(myArticles ?? 0) === 0 ? (
              <div className="rounded-xl border border-dashed border-brand-line bg-brand-bg/50 px-6 py-10 text-center">
                <div className="w-12 h-12 rounded-full bg-brand-deep/[0.06] flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-5 h-5 text-brand-deep/60" aria-hidden />
                </div>
                <p className="text-sm font-semibold text-brand-ink">
                  Você ainda não publicou artigos
                </p>
                <p className="text-xs text-brand-ink/50 mt-1 max-w-sm mx-auto">
                  Artigos aumentam sua autoridade e aparecem no seu perfil
                  profissional.
                </p>
                {isPremium && (
                  <Link
                    href="/painel/artigos"
                    className="inline-flex items-center gap-2 mt-4 text-sm font-semibold px-4 py-2.5 rounded-xl transition hover:opacity-90"
                    style={{ background: "#C8A24A", color: "#0F1B2D" }}
                  >
                    Escrever primeiro artigo
                    <ArrowRight className="w-4 h-4" aria-hidden />
                  </Link>
                )}
              </div>
            ) : (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-emerald-600" aria-hidden />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-emerald-800 tabular-nums">
                    {myArticles}
                  </p>
                  <p className="text-xs text-emerald-700">
                    artigo{(myArticles ?? 0) !== 1 ? "s" : ""} publicado
                    {(myArticles ?? 0) !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* TIPS FOR MISSING FIELDS */}
          {missingFields.length > 0 && (
            <section className="rounded-2xl border border-amber-200/70 bg-amber-50/60 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-amber-600" aria-hidden />
                <h2 className="text-sm font-bold text-amber-800 uppercase tracking-wide">
                  Como melhorar seu perfil
                </h2>
              </div>
              <ul className="space-y-2">
                {missingFields.slice(0, 3).map((field) => (
                  <li
                    key={field.label}
                    className="text-sm text-brand-ink/70 leading-relaxed flex items-start gap-2.5"
                  >
                    <ArrowRight
                      className="w-3.5 h-3.5 text-amber-500 mt-1 flex-shrink-0"
                      aria-hidden
                    />
                    {FIELD_TIPS[field.label] ??
                      `Preencha o campo "${field.label}".`}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* ============================================================= */}
        {/* SIDE COLUMN                                                    */}
        {/* ============================================================= */}
        <aside className="lg:col-span-4 space-y-6">
          {/* PROFILE COMPLETENESS (side card) */}
          <section className="rounded-2xl border border-brand-line bg-white p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-brand-deep/[0.06] flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-brand-deep" aria-hidden />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-brand-ink">
                  Força do perfil
                </h2>
                <p className="text-xs text-brand-ink/50">
                  Perfis completos recebem mais contatos
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="flex-shrink-0 relative w-24 h-24">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96" aria-hidden>
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    fill="none"
                    strokeWidth="8"
                    className={scoreRingTrack(profileScore)}
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    fill="none"
                    strokeWidth="8"
                    strokeLinecap="round"
                    className={scoreRingFill(profileScore)}
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                  />
                </svg>
                <span
                  className={`absolute inset-0 flex items-center justify-center font-display text-xl font-bold ${scoreColor(profileScore)}`}
                >
                  {profileScore}%
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-brand-ink">
                  {filledCount} de {profileFields.length} campos
                </p>
                <p className="text-xs text-brand-ink/50 mt-0.5">
                  preenchidos no seu perfil
                </p>
                <div className="h-2 rounded-full bg-brand-bg overflow-hidden mt-3">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${scoreBg(profileScore)}`}
                    style={{ width: `${Math.max(profileScore, 2)}%` }}
                  />
                </div>
              </div>
            </div>

            <ul className="mt-5 space-y-1.5 border-t border-brand-line/60 pt-4">
              {profileFields.map((field) => (
                <li key={field.label} className="flex items-center gap-2 text-sm">
                  {field.filled ? (
                    <CheckCircle2
                      className="w-4 h-4 text-emerald-500 flex-shrink-0"
                      aria-hidden
                    />
                  ) : (
                    <XCircle
                      className="w-4 h-4 text-red-400 flex-shrink-0"
                      aria-hidden
                    />
                  )}
                  <span
                    className={
                      field.filled
                        ? "text-brand-ink/50 line-through"
                        : "text-brand-ink font-medium"
                    }
                  >
                    {field.label}
                  </span>
                </li>
              ))}
            </ul>

            {missingFields.length > 0 && (
              <Link
                href="/painel/meu-perfil#meu-perfil"
                className="mt-5 flex items-center justify-center gap-2 w-full text-sm font-semibold px-4 py-2.5 rounded-xl transition hover:opacity-90"
                style={{ background: "#0F1B2D", color: "#FFFFFF" }}
              >
                Completar perfil
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
            )}
          </section>

          {/* PREMIUM CTA or STATUS */}
          {isPremium ? (
            <div
              className="rounded-2xl p-6 text-white relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg,#0F1B2D 0%,#1B2D49 100%)",
              }}
            >
              <div
                aria-hidden
                className="absolute pointer-events-none"
                style={{
                  bottom: -40,
                  right: -10,
                  width: 160,
                  height: 120,
                  background:
                    "radial-gradient(ellipse at center, rgba(200,162,74,0.25), transparent 70%)",
                }}
              />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5" style={{ color: "#C8A24A" }} aria-hidden />
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: "#E3C078" }}
                  >
                    Premium ativo
                  </span>
                </div>
                <p className="text-sm" style={{ color: "#A9B4C6" }}>
                  Seu perfil aparece em destaque nas buscas. Continue criando
                  conteúdo para maximizar resultados.
                </p>
                <Link
                  href="/painel/pagamento"
                  className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold hover:opacity-80 transition"
                  style={{ color: "#E3C078" }}
                >
                  Detalhes do plano <ArrowRight className="w-3 h-3" aria-hidden />
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-brand-line bg-white p-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5" style={{ color: "#C8A24A" }} aria-hidden />
                <p className="font-display text-base font-bold text-brand-ink">
                  Faça seu perfil se destacar
                </p>
              </div>
              <ul className="text-sm text-brand-ink/70 space-y-2 mb-5">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    style={{ color: "#C8A24A" }}
                    aria-hidden
                  />
                  Apareça primeiro nas buscas da sua cidade
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    style={{ color: "#C8A24A" }}
                    aria-hidden
                  />
                  Publique artigos com sua autoria
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    style={{ color: "#C8A24A" }}
                    aria-hidden
                  />
                  Apareça em até 10 cidades diferentes
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    style={{ color: "#C8A24A" }}
                    aria-hidden
                  />
                  Ferramentas com IA desbloqueadas
                </li>
              </ul>
              <Link
                href="/painel/pagamento"
                className="flex items-center justify-center gap-2 w-full font-bold text-sm px-5 py-3 rounded-xl transition hover:opacity-90"
                style={{ background: "#C8A24A", color: "#0F1B2D" }}
              >
                <CreditCard className="w-4 h-4" aria-hidden />
                Ativar premium
              </Link>
            </div>
          )}

          {/* QUICK LINKS */}
          <section className="rounded-2xl border border-brand-line bg-white overflow-hidden">
            <div className="px-6 py-4 border-b border-brand-line/60">
              <h2 className="font-display text-base font-bold text-brand-ink">
                Acesso rápido
              </h2>
            </div>
            <div className="p-2">
              {[
                {
                  href: "/painel/meu-perfil",
                  label: "Editar meu perfil",
                  Icon: User,
                },
                {
                  href: "/painel/artigos",
                  label: "Gerenciar artigos",
                  Icon: FileText,
                },
                {
                  href: "/painel/aparencia",
                  label: "Aparência do perfil",
                  Icon: Sparkles,
                },
                {
                  href: "/painel/pagamento",
                  label: "Pagamento e plano",
                  Icon: CreditCard,
                },
                {
                  href: `/advogado/${lawyerSlug}`,
                  label: "Ver perfil público",
                  Icon: ExternalLink,
                  external: true,
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-bg transition group"
                >
                  <div className="w-8 h-8 rounded-lg bg-brand-deep/[0.06] flex items-center justify-center flex-shrink-0">
                    <item.Icon className="w-4 h-4 text-brand-deep" aria-hidden />
                  </div>
                  <span className="text-sm font-medium text-brand-ink">
                    {item.label}
                  </span>
                  <ArrowRight
                    className="w-3.5 h-3.5 text-brand-ink/30 group-hover:text-brand-ink/60 transition ml-auto"
                    aria-hidden
                  />
                </Link>
              ))}
            </div>
          </section>

          {/* SELO PARA O SITE */}
          <section className="rounded-2xl border border-brand-line bg-white p-6">
            <div className="flex items-center gap-2 mb-2">
              <BadgeCheck
                className="w-5 h-5"
                style={{ color: "#C8A24A" }}
                aria-hidden
              />
              <h2 className="font-display text-base font-bold text-brand-ink">
                Selo para seu site
              </h2>
            </div>
            <p className="text-xs text-brand-ink/70 leading-relaxed">
              Mostre no seu site que seu perfil foi verificado no AdvAqui. O
              código HTML já vem pronto, com link para o seu perfil.
            </p>
            <Link
              href="/selo"
              className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-brand-deep hover:opacity-80 transition"
            >
              Pegar meu selo
              <ArrowRight className="w-3.5 h-3.5" aria-hidden />
            </Link>
          </section>

          {/* VISIBILITY TIP */}
          <div className="rounded-2xl bg-brand-deep/5 border border-brand-deep/20 p-6">
            <Star className="w-5 h-5 text-brand-accent mb-2" aria-hidden />
            <p className="text-sm font-semibold text-brand-deep">
              Dica de visibilidade
            </p>
            <p className="text-xs text-brand-ink/70 mt-1.5 leading-relaxed">
              {profileScore < 80
                ? `Seu perfil está ${profileScore}% completo. Complete os campos em falta para aparecer melhor nos resultados de busca.`
                : "Perfil bem completo. Publique artigos e mantenha seus dados atualizados para manter a relevância."}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
