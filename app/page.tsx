import Link from "next/link";
import { Check, Scale, FileText, Calculator, ArrowRight, Briefcase, Heart, Shield, Clock, ShoppingCart, Search, Car } from "lucide-react";
import { SearchBox } from "@/components/SearchBox";
import { GeoPersonalize } from "@/components/GeoPersonalize";
import { ResolverAgora } from "@/components/ResolverAgora";
import { HomeFaq } from "@/components/HomeFaq";
import { AtivarPremiumCTA } from "@/components/PlanosCTAs";
import { getAllArticles } from "@/lib/data/articles";
import { getProblemaIndex } from "@/lib/data/problema-index";
import { getAllCities } from "@/lib/data/cities";

export const revalidate = 60;

const GOLD = "#C8A24A";
const GOLD_EYEBROW = "#A0843A";

const HOW_STEPS = [
  {
    n: "01",
    t: "Busque por cidade",
    d: "Digite o nome da sua cidade e veja quem atende por lá, com o registro OAB visível no perfil."
  },
  {
    n: "02",
    t: "Filtre por especialidade",
    d: "Trabalhista, família, previdenciário, criminal, civil — escolha a área."
  },
  {
    n: "03",
    t: "Fale direto com o advogado",
    d: "Telefone em todos os perfis. Advogados em destaque atendem também por WhatsApp clicável."
  }
];

const AREAS_POPULARES = [
  { label: "Trabalhista", href: "/advogados-de/trabalhista", Icon: Briefcase },
  { label: "Família", href: "/advogados-de/familia", Icon: Heart },
  { label: "Criminal", href: "/advogados-de/criminal", Icon: Shield },
  { label: "Previdenciário", href: "/advogados-de/previdenciario", Icon: Clock },
  { label: "Consumidor", href: "/advogados-de/consumidor", Icon: ShoppingCart },
  { label: "Civil", href: "/advogados-de/civil", Icon: Scale },
];

const FERRAMENTAS = [
  { label: "Consultar meu processo", href: "/processos", Icon: Search },
  { label: "Calculadora de rescisão", href: "/calculadoras", Icon: Calculator },
  { label: "Recurso de multa", href: "/recurso-de-multa", Icon: Car },
  { label: "Modelos de documentos", href: "/modelos", Icon: FileText },
  { label: "Calculadora de prazos", href: "/calculadora-prazos", Icon: Calculator },
  { label: "Problemas jurídicos", href: "/problemas-juridicos", Icon: Scale },
];

export default async function HomePage() {
  const latestArticles = getAllArticles().slice(0, 4);
  const problemas = getProblemaIndex();
  const totalCities = getAllCities().length;

  return (
    <>
      {/* ── HERO ── busca por cidade, sóbrio e editorial */}
      <section
        className="relative text-white"
        style={{
          background: "radial-gradient(120% 90% at 50% 0%, #16263D 0%, #0F1B2D 62%)"
        }}
      >
        <div className="container-tight py-14 md:py-[76px]">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display font-semibold text-4xl md:text-5xl leading-[1.14] tracking-tight text-balance">
              Encontre o{" "}
              <span className="italic md:whitespace-nowrap" style={{ color: "#E9C87D" }}>
                advogado certo
              </span>{" "}
              na sua cidade
            </h1>
            <p
              className="mt-4 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
              style={{ color: "#B9C5D8" }}
            >
              Veja quem atende perto de você, confira o registro na OAB
              e fale direto com o advogado, sem intermediário.
            </p>
            <div className="mt-8 max-w-xl mx-auto">
              <SearchBox />
            </div>
            <p className="mt-4 text-[13.5px]" style={{ color: "#8FA3BF" }}>
              Não sabe por onde começar?{" "}
              <a
                href="#orientacao"
                className="font-medium text-white/90 underline underline-offset-4 transition hover:text-white"
                style={{ textDecorationColor: "rgba(200,162,74,0.65)" }}
              >
                Conte o que aconteceu
              </a>
            </p>
            <div
              className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px]"
              style={{ color: "#B9C5D8" }}
            >
              {[
                "Registro OAB em cada perfil",
                "100% gratuito para você",
                "Sem cadastro, sem comissão"
              ].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" style={{ color: "#8FA3BF" }} aria-hidden />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── GEO ── CTA local (só aparece se já buscou cidade antes) */}
      <GeoPersonalize />

      {/* ── ÁREAS POPULARES ── acesso rápido por especialidade */}
      <section className="container-tight pt-10 md:pt-14">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg md:text-xl font-semibold text-brand-ink">
            Áreas mais procuradas
          </h2>
          <Link
            href="/advogados"
            className="text-sm font-medium text-brand-deep hover:text-brand-accent2 transition flex items-center gap-1"
          >
            Ver todas <ArrowRight className="w-3.5 h-3.5" aria-hidden />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {AREAS_POPULARES.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="group flex flex-col items-center gap-2 rounded-xl border border-brand-line bg-white p-4 hover:border-brand-accent hover:shadow-card transition text-center"
            >
              <span
                className="flex items-center justify-center w-10 h-10 rounded-lg transition"
                style={{ background: "rgba(200,162,74,0.1)" }}
              >
                <a.Icon className="w-5 h-5 text-brand-accent" aria-hidden />
              </span>
              <span className="text-sm font-medium text-brand-ink group-hover:text-brand-deep transition">
                {a.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── ORIENTAÇÃO INTELIGENTE ── componente interativo */}
      <ResolverAgora items={problemas} />

      {/* ── COMO FUNCIONA ── 3 passos, bloco navy */}
      <section className="container-tight pt-10 md:pt-14">
        <div className="rounded-3xl text-white p-8 md:p-11" style={{ background: "#0F1B2D" }}>
          <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">
            Como funciona
          </h2>
          <div className="mt-8 grid md:grid-cols-3 gap-8">
            {HOW_STEPS.map(({ n, t, d }) => (
              <div key={n}>
                <div className="font-display text-2xl mb-2.5" style={{ color: GOLD }}>
                  {n}
                </div>
                <h3 className="font-semibold text-[16.5px] mb-1.5">{t}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#CBD5E6" }}>
                  {d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FERRAMENTAS GRATUITAS ── acesso rápido */}
      <section className="container-tight pt-10 md:pt-14">
        <h2 className="font-display text-lg md:text-xl font-semibold text-brand-ink mb-4">
          Ferramentas gratuitas
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {FERRAMENTAS.map(({ label, href, Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-3 rounded-2xl border border-brand-line bg-white p-4 hover:border-brand-accent hover:shadow-card transition"
            >
              <Icon className="w-5 h-5 text-brand-deep/60 group-hover:text-brand-accent transition shrink-0" aria-hidden />
              <span className="text-sm font-medium text-brand-ink group-hover:text-brand-deep transition">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── BLOG ── artigos recentes em lista compacta */}
      <section className="container-tight pt-10 md:pt-14">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg md:text-xl font-semibold text-brand-ink">
            Blog jurídico
          </h2>
          <Link
            href="/blog"
            className="text-sm font-medium text-brand-deep hover:text-brand-accent2 transition flex items-center gap-1"
          >
            Ver todos <ArrowRight className="w-3.5 h-3.5" aria-hidden />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {latestArticles.map((a) => (
            <Link
              key={a.slug}
              href={`/blog/${a.slug}`}
              className="group flex items-start gap-3 rounded-2xl border border-brand-line bg-white p-4 hover:border-brand-accent hover:shadow-card transition"
            >
              <span className="flex-1 min-w-0">
                <span className="text-[14.5px] font-medium text-brand-ink group-hover:text-brand-deep transition block leading-snug line-clamp-2">
                  {a.title}
                </span>
              </span>
              <ArrowRight className="w-4 h-4 text-brand-ink/30 group-hover:text-brand-accent mt-0.5 shrink-0 transition" aria-hidden />
            </Link>
          ))}
        </div>
      </section>

      {/* ── STATS ── números do ecossistema */}
      <section className="container-tight pt-10 md:pt-14">
        <div
          className="rounded-3xl p-8 md:p-11 text-white relative overflow-hidden"
          style={{ background: "#0F1B2D" }}
        >
          <div
            aria-hidden
            className="absolute pointer-events-none"
            style={{
              bottom: -80,
              right: -20,
              width: 300,
              height: 240,
              background: "none"
            }}
          />
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { n: `${totalCities.toLocaleString("pt-BR")}+`, label: "Cidades cobertas" },
              { n: "25+", label: "Ferramentas gratuitas" },
              { n: "15+", label: "Áreas do direito" },
              { n: "100%", label: "Gratuito para você" },
            ].map(({ n, label }) => (
              <div key={label}>
                <p className="font-display text-3xl md:text-4xl font-bold" style={{ color: "#F0CE84" }}>
                  {n}
                </p>
                <p className="text-sm mt-1" style={{ color: "#CBD5E6" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── perguntas frequentes com Schema.org FAQPage */}
      <HomeFaq />

      {/* ── CTA ADVOGADO ── faixa navy, botão dourado */}
      <section className="container-tight py-10 md:py-14">
        <div
          className="rounded-3xl text-white p-8 md:p-11 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          style={{ background: "#0F1B2D" }}
        >
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl md:text-3xl font-semibold leading-tight">
              Sou advogado e quero aparecer aqui
            </h2>
            <p className="mt-2 text-[15px]" style={{ color: "#CBD5E6" }}>
              Apareça quando alguém busca advogado na sua cidade.
              Cadastro gratuito em menos de 2 minutos.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <AtivarPremiumCTA
              className="inline-flex items-center justify-center font-bold rounded-xl px-6 py-3.5 whitespace-nowrap"
              style={{ background: GOLD, color: "#0F1B2D" }}
              origem="home"
              anonLabel="Criar perfil grátis"
              anonHref="/cadastro"
            />
            <Link
              href="/planos"
              className="inline-flex items-center justify-center font-semibold rounded-xl px-6 py-3.5 whitespace-nowrap border-2 text-white hover:bg-white/10 transition"
              style={{ borderColor: "rgba(200,162,74,0.4)" }}
            >
              Ver plano Premium
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
