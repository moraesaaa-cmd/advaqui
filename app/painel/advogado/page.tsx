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
  return (
    <div className="container-tight py-10">
      {/* ============================================================= */}
      {/* HERO HEADER                                                    */}
      {/* ============================================================= */}
      <section
        className="rounded-3xl text-white p-6 md:p-8 mb-6 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg,#0F1B2D 0%,#16263F 60%,#1B2D49 100%)",
        }}
      >
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            top: -120,
            right: -40,
            width: 360,
            height: 300,
            background:
              "radial-gradient(ellipse at center, rgba(200,162,74,0.18), transparent 70%)",
          }}
        />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <p
              className="text-xs font-bold uppercase tracking-wider mb-1.5"
              style={{ color: "#E3C078" }}
            >
              Painel do advogado
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
                Ola, {firstName}
              </h1>
              {isPremium ? (
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                  style={{
                    background: "rgba(200,162,74,0.18)",
                    border: "1px solid rgba(200,162,74,0.5)",
                    color: "#E3C078",
                  }}
                >
                  <Crown
                    className="w-3.5 h-3.5"
                    style={{ color: "#C8A24A" }}
                    aria-hidden
                  />
                  Premium
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-white/10 border border-white/20 text-white/70">
                  Gratis
                </span>
              )}
            </div>
            <p className="text-sm mt-1.5" style={{ color: "#A9B4C6" }}>
              {isPremium
                ? "Plano premium ativo -- voce aparece em destaque."
                : "Cadastro gratuito ativo."}
            </p>
          </div>
          <Link
            href={`/advogado/${lawyerSlug}`}
            target="_blank"
            className="inline-flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg text-white border border-white/20 hover:bg-white/10 transition"
          >
            <ExternalLink className="w-4 h-4" aria-hidden />
            Ver perfil publico
          </Link>
        </div>

        {/* Stats row */}
        <div
          className={`relative mt-5 grid grid-cols-2 gap-3 ${
            premiumDaysLeft !== null ? "md:grid-cols-5" : "md:grid-cols-4"
          }`}
        >
          {[
            {
              label: "Perfil completo",
              value: `${profileScore}%`,
              sub:
                profileScore >= 80
                  ? "otimo"
                  : `${missingFields.length} campo${missingFields.length !== 1 ? "s" : ""} pendente${missingFields.length !== 1 ? "s" : ""}`,
              Icon: User,
            },
            {
              label: "Visitas este mes",
              value: String(monthViews ?? 0),
              sub: "no seu perfil",
              Icon: Eye,
            },
            {
              label: "Leads na regiao",
              value: String(matchedLeadsCount),
              sub: targetCity
                ? `${targetCity}/${targetUf}`
                : "configure sua cidade",
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
                    sub:
                      premiumDaysLeft <= 5
                        ? "renove em breve"
                        : "dias de destaque",
                    Icon: Clock,
                  },
                ]
              : []),
          ].map((m) => (
            <div
              key={m.label}
              className="rounded-2xl bg-white/[0.07] border border-white/10 p-4"
            >
              <div className="flex items-center gap-2 mb-1">
                <m.Icon
                  className="w-3.5 h-3.5"
                  style={{ color: "#7E8BA1" }}
                  aria-hidden
                />
                <p
                  className="text-[11px] uppercase tracking-wide"
                  style={{ color: "#7E8BA1" }}
                >
                  {m.label}
                </p>
              </div>
              <p className="font-display text-2xl font-semibold mt-1">
                {m.value}
              </p>
              {m.sub && (
                <p
                  className="text-[11px] mt-0.5"
                  style={{ color: "#9FB0CB" }}
                >
                  {m.sub}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ============================================================= */}
        {/* LEFT COLUMN (2/3)                                              */}
        {/* ============================================================= */}
        <div className="lg:col-span-2 space-y-6">
          {/* ------------------------------------------------------------- */}
          {/* PROFILE COMPLETENESS                                           */}
          {/* ------------------------------------------------------------- */}
          <section className="rounded-2xl border border-brand-line bg-white overflow-hidden">
            <div className="px-6 py-4 border-b border-brand-line/60 bg-gradient-to-r from-brand-bg to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-deep/10 flex items-center justify-center">
                  <TrendingUp
                    className="w-5 h-5 text-brand-deep"
                    aria-hidden
                  />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-brand-ink">
                    Forca do perfil
                  </h2>
                  <p className="text-xs text-brand-ink/60">
                    Perfis completos recebem mais contatos
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                {/* Ring chart */}
                <div className="flex-shrink-0 relative w-24 h-24">
                  <svg
                    className="w-24 h-24 -rotate-90"
                    viewBox="0 0 96 96"
                    aria-hidden
                  >
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

                {/* Checklist */}
                <div className="flex-1 min-w-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {profileFields.map((field) => (
                      <div
                        key={field.label}
                        className="flex items-center gap-2 text-sm"
                      >
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
                              ? "text-brand-ink/70 line-through"
                              : "text-brand-ink font-medium"
                          }
                        >
                          {field.label}
                        </span>
                      </div>
                    ))}
                  </div>
                  {missingFields.length > 0 && (
                    <Link
                      href="/painel/meu-perfil#meu-perfil"
                      className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-brand-deep hover:text-brand-accent transition"
                    >
                      Completar perfil{" "}
                      <ArrowRight className="w-3 h-3" aria-hidden />
                    </Link>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-brand-ink/60">
                    {filledCount} de {profileFields.length} campos preenchidos
                  </span>
                  <span
                    className={`text-xs font-bold tabular-nums ${scoreColor(profileScore)}`}
                  >
                    {profileScore}%
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-brand-bg overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${scoreBg(profileScore)}`}
                    style={{ width: `${Math.max(profileScore, 2)}%` }}
                  />
                </div>
              </div>

              {/* Tips for missing fields */}
              {missingFields.length > 0 && (
                <div className="mt-4 rounded-xl bg-amber-50/70 border border-amber-200/70 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb
                      className="w-4 h-4 text-amber-600"
                      aria-hidden
                    />
                    <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                      Como melhorar seu perfil
                    </p>
                  </div>
                  <ul className="space-y-1.5">
                    {missingFields.slice(0, 3).map((field) => (
                      <li
                        key={field.label}
                        className="text-xs text-brand-ink/70 leading-relaxed flex items-start gap-2"
                      >
                        <ArrowRight
                          className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0"
                          aria-hidden
                        />
                        {FIELD_TIPS[field.label] ??
                          `Preencha o campo "${field.label}".`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* ------------------------------------------------------------- */}
          {/* VIEWS + LEADS SUMMARY                                          */}
          {/* ------------------------------------------------------------- */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-brand-line bg-white p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-blue-600" aria-hidden />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-ink">
                    Visitas ao perfil
                  </p>
                  <p className="text-[11px] text-brand-ink/50">
                    Este mes (excluindo bots)
                  </p>
                </div>
              </div>
              <p className="font-display text-4xl font-bold text-brand-ink">
                {monthViews ?? 0}
              </p>
              <p className="text-xs text-brand-ink/50 mt-1">
                Visitantes unicos em /advogado/{lawyerSlug}
              </p>
            </div>

            <div className="rounded-2xl border border-brand-line bg-white p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Users className="w-5 h-5 text-emerald-600" aria-hidden />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-ink">
                    Leads na sua regiao
                  </p>
                  <p className="text-[11px] text-brand-ink/50">
                    {targetCity
                      ? `${targetCity}/${targetUf}`
                      : "Cidade nao configurada"}
                  </p>
                </div>
              </div>
              <p className="font-display text-4xl font-bold text-brand-ink">
                {matchedLeadsCount}
              </p>
              <p className="text-xs text-brand-ink/50 mt-1">
                Pessoas buscando advogado na regiao
              </p>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* ARTICLES CARD                                                  */}
          {/* ------------------------------------------------------------- */}
          <section className="rounded-2xl border border-brand-line bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  <BookOpen
                    className="w-5 h-5 text-purple-600"
                    aria-hidden
                  />
                </div>
                <div>
                  <h2 className="font-display text-base font-bold text-brand-ink">
                    Seus artigos
                  </h2>
                  <p className="text-[11px] text-brand-ink/50">
                    Conteudo publicado no blog
                  </p>
                </div>
              </div>
              <Link
                href="/painel/artigos"
                className="text-xs font-medium text-brand-deep hover:text-brand-accent transition inline-flex items-center gap-1"
              >
                Gerenciar <ArrowRight className="w-3 h-3" aria-hidden />
              </Link>
            </div>

            {(myArticles ?? 0) === 0 ? (
              <div className="rounded-xl bg-brand-bg/60 border border-brand-line/50 p-4 text-center">
                <FileText
                  className="w-8 h-8 text-brand-ink/20 mx-auto mb-2"
                  aria-hidden
                />
                <p className="text-sm text-brand-ink/60">
                  Voce ainda nao publicou artigos.
                </p>
                <p className="text-xs text-brand-ink/40 mt-1">
                  Artigos aumentam sua autoridade e aparecem no seu
                  perfil profissional.
                </p>
                {isPremium && (
                  <Link
                    href="/painel/artigos"
                    className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-brand-deep hover:text-brand-accent transition"
                  >
                    Escrever primeiro artigo{" "}
                    <ArrowRight className="w-3 h-3" aria-hidden />
                  </Link>
                )}
              </div>
            ) : (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <BookOpen
                    className="w-6 h-6 text-emerald-600"
                    aria-hidden
                  />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-emerald-800">
                    {myArticles}
                  </p>
                  <p className="text-xs text-emerald-700">
                    artigo{(myArticles ?? 0) !== 1 ? "s" : ""} publicado{(myArticles ?? 0) !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* ============================================================= */}
        {/* RIGHT COLUMN (1/3)                                             */}
        {/* ============================================================= */}
        <aside className="space-y-6">
          {/* ------------------------------------------------------------- */}
          {/* PREMIUM CTA or STATUS                                          */}
          {/* ------------------------------------------------------------- */}
          {isPremium ? (
            <div
              className="rounded-2xl p-5 text-white relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg,#0F1B2D 0%,#1B2D49 100%)",
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
                  <Star
                    className="w-5 h-5"
                    style={{ color: "#C8A24A" }}
                    aria-hidden
                  />
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: "#E3C078" }}
                  >
                    Premium ativo
                  </span>
                </div>
                <p className="text-sm" style={{ color: "#A9B4C6" }}>
                  Seu perfil aparece em destaque nas buscas. Continue
                  criando conteudo para maximizar resultados.
                </p>
                <Link
                  href="/painel/pagamento"
                  className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold hover:opacity-80 transition"
                  style={{ color: "#E3C078" }}
                >
                  Detalhes do plano{" "}
                  <ArrowRight className="w-3 h-3" aria-hidden />
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-white p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles
                  className="w-5 h-5 text-amber-500"
                  aria-hidden
                />
                <p className="text-sm font-bold text-brand-ink">
                  Faca seu perfil se destacar
                </p>
              </div>
              <ul className="text-xs text-brand-ink/70 space-y-1.5 mb-4">
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0"
                    aria-hidden
                  />
                  Apareca primeiro nas buscas da sua cidade
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0"
                    aria-hidden
                  />
                  Publique artigos com sua autoria
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0"
                    aria-hidden
                  />
                  Apareca em ate 10 cidades diferentes
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0"
                    aria-hidden
                  />
                  Ferramentas com IA desbloqueadas
                </li>
              </ul>
              <Link
                href="/painel/pagamento"
                className="flex items-center justify-center gap-2 w-full font-bold text-sm px-5 py-3 rounded-xl transition"
                style={{
                  background: "#C8A24A",
                  color: "#0F1B2D",
                }}
              >
                <CreditCard className="w-4 h-4" aria-hidden />
                Ativar premium
              </Link>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* QUICK LINKS                                                    */}
          {/* ------------------------------------------------------------- */}
          <section className="rounded-2xl border border-brand-line bg-white overflow-hidden">
            <div className="px-5 py-4 border-b border-brand-line/60 bg-gradient-to-r from-brand-bg to-white">
              <h2 className="font-display text-base font-bold text-brand-ink">
                Acesso rapido
              </h2>
            </div>
            <div className="p-2 space-y-0.5">
              {[
                {
                  href: "/painel/meu-perfil",
                  label: "Editar meu perfil",
                  Icon: User,
                  iconBg: "bg-brand-deep/8",
                  iconColor: "text-brand-deep",
                },
                {
                  href: "/painel/artigos",
                  label: "Gerenciar artigos",
                  Icon: FileText,
                  iconBg: "bg-purple-50",
                  iconColor: "text-purple-600",
                },
                {
                  href: "/painel/aparencia",
                  label: "Aparencia do perfil",
                  Icon: Sparkles,
                  iconBg: "bg-amber-50",
                  iconColor: "text-amber-600",
                },
                {
                  href: "/painel/pagamento",
                  label: "Pagamento e plano",
                  Icon: CreditCard,
                  iconBg: "bg-emerald-50",
                  iconColor: "text-emerald-600",
                },
                {
                  href: `/advogado/${lawyerSlug}`,
                  label: "Ver perfil publico",
                  Icon: ExternalLink,
                  iconBg: "bg-blue-50",
                  iconColor: "text-blue-600",
                  external: true,
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-bg transition group"
                >
                  <div
                    className={`w-8 h-8 rounded-lg ${item.iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition`}
                  >
                    <item.Icon
                      className={`w-4 h-4 ${item.iconColor}`}
                      aria-hidden
                    />
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

          {/* ------------------------------------------------------------- */}
          {/* VISIBILITY TIP                                                 */}
          {/* ------------------------------------------------------------- */}
          <div className="rounded-2xl bg-brand-deep/5 border border-brand-deep/20 p-5">
            <Star
              className="w-5 h-5 text-brand-accent mb-2"
              aria-hidden
            />
            <p className="text-sm font-semibold text-brand-deep">
              Dica de visibilidade
            </p>
            <p className="text-xs text-brand-ink/70 mt-1 leading-relaxed">
              {profileScore < 80
                ? `Seu perfil esta ${profileScore}% completo. Complete os campos em falta para aparecer melhor nos resultados de busca.`
                : "Perfil bem completo. Publique artigos e mantenha seus dados atualizados para manter a relevancia."}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
