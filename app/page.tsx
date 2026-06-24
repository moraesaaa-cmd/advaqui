import Link from "next/link";
import {
  Search,
  ShieldCheck,
  Briefcase,
  BookOpen,
  FileText,
  Scale,
  Check,
  ArrowRight
} from "lucide-react";
import { SearchBox } from "@/components/SearchBox";
import { SITE } from "@/lib/config";
import { IntentGrid } from "@/components/IntentGrid";
import { getAllArticles } from "@/lib/data/articles";
import { HomeFaq } from "@/components/HomeFaq";
import { ResolverAgora } from "@/components/ResolverAgora";
import { getProblemaIndex } from "@/lib/data/problema-index";

export const revalidate = 600;

// Tom dourado do redesign (claude_design) — usado em detalhes (badges, números,
// destaques). O âmbar de marca (brand-accent) segue no resto do site.
const GOLD = "#C8A24A";

const HOW_STEPS = [
  {
    n: "01",
    Icon: Search,
    title: "Busque por cidade",
    text: "Digite o nome da sua cidade ou escolha o estado no mapa do Brasil."
  },
  {
    n: "02",
    Icon: Briefcase,
    title: "Filtre por especialidade",
    text: "Trabalhista, família, previdenciário, criminal, civil — as principais áreas do direito."
  },
  {
    n: "03",
    Icon: ShieldCheck,
    title: "Fale direto pelo WhatsApp",
    text: "Cada perfil traz telefone, e-mail e WhatsApp clicável. Sem taxa, sem comissão."
  }
];

// Chips de problemas comuns no hero — cada um leva ao hub de problemas jurídicos
// (página existente e indexável; nada de URL nova ou quebrada).
const HERO_CHIPS = [
  "fui demitido e não recebi nada",
  "meu nome está negativado",
  "o INSS negou meu benefício",
  "caí em um golpe do pix",
  "quero me divorciar"
];

export default async function HomePage() {
  const latestArticles = getAllArticles().slice(0, 3);
  const problemaIndex = getProblemaIndex();

  return (
    <>
      {/* HERO — redesign: azul profundo com brilhos dourado/verde, busca em destaque */}
      <section
        className="relative text-white overflow-hidden"
        style={{
          background:
            "linear-gradient(155deg, #0B1830 0%, #13294C 55%, #1A2C5A 100%)"
        }}
      >
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            top: -180,
            left: "36%",
            transform: "translateX(-50%)",
            width: 680,
            height: 440,
            background:
              "radial-gradient(ellipse at center, rgba(212,170,84,0.22), transparent 70%)"
          }}
        />
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            bottom: -220,
            right: "8%",
            width: 560,
            height: 440,
            background:
              "radial-gradient(ellipse at center, rgba(46,158,107,0.16), transparent 70%)"
          }}
        />
        <div className="relative container-tight py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <span
              className="inline-flex items-center gap-2 rounded-full text-xs font-semibold px-3.5 py-1.5 mb-6"
              style={{
                background: "rgba(212,170,84,0.16)",
                border: "1px solid rgba(212,170,84,0.38)",
                color: "#F0CE84"
              }}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: "#34C77B", boxShadow: "0 0 8px rgba(52,199,123,0.8)" }}
              />
              {SITE.tagline}
            </span>
            <h1 className="font-display font-semibold text-4xl md:text-6xl leading-[1.08] tracking-tight text-balance">
              Encontre o{" "}
              <span
                className="italic"
                style={{
                  background: "linear-gradient(90deg, #F0CE84, #D8A94E)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
              >
                advogado certo
              </span>{" "}
              na sua cidade
            </h1>
            <p className="mt-5 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: "#BBC7DC" }}>
              O diretório que mostra advogados por cidade e área — com OAB, endereço
              e WhatsApp. Sem cadastro do cliente, sem comissão, sem intermediário.
            </p>
            <div className="mt-8 max-w-xl mx-auto">
              <SearchBox />
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              {HERO_CHIPS.map((c) => (
                <Link
                  key={c}
                  href="/problemas-juridicos"
                  className="rounded-full text-[13px] px-3.5 py-1.5 transition hover:bg-white/15"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    color: "#C8D2E2"
                  }}
                >
                  {c}
                </Link>
              ))}
            </div>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-[13.5px]" style={{ color: "#A6B3C9" }}>
              {[
                "Contato direto, sem intermediário",
                "100% gratuito para você",
                "OAB conferida em cada perfil"
              ].map((t) => (
                <span key={t} className="inline-flex items-center gap-2">
                  <Check className="w-4 h-4" style={{ color: "#34C77B" }} aria-hidden />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Orientação por problema (componente existente — SEO e links internos) */}
      <ResolverAgora items={problemaIndex} />

      {/* Grade de intenções/áreas (componente existente) */}
      <IntentGrid />

      {/* COMO FUNCIONA — card escuro do redesign */}
      <section className="container-tight py-14 md:py-16">
        <div
          className="rounded-3xl text-white p-8 md:p-11"
          style={{ background: "#0F1B2D" }}
        >
          <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">
            Como funciona
          </h2>
          <p className="mt-1.5 text-[15px]" style={{ color: "#A9B4C6" }}>
            Sem cadastro do cliente, sem intermediação. Você busca, encontra, contrata direto.
          </p>
          <div className="mt-8 grid md:grid-cols-3 gap-8">
            {HOW_STEPS.map(({ n, Icon, title, text }) => (
              <div key={n}>
                <div className="flex items-center gap-3 mb-2.5">
                  <span className="font-display text-2xl" style={{ color: GOLD }}>{n}</span>
                  <Icon className="w-5 h-5" style={{ color: GOLD }} aria-hidden />
                </div>
                <h3 className="font-semibold text-[16.5px] mb-1.5">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#A9B4C6" }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog + Modelos: autoridade (E-E-A-T) — links reais preservados */}
      <section className="bg-white border-y border-brand-line py-16">
        <div className="container-tight">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3"
                style={{ background: "rgba(200,162,74,0.14)", color: "#A0843A", border: "1px solid rgba(200,162,74,0.3)" }}
              >
                <BookOpen className="w-3.5 h-3.5" aria-hidden />
                Blog jurídico
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-brand-ink leading-tight">
                Seus direitos explicados sem juridiquês
              </h2>
              <p className="text-brand-ink/65 mt-2">
                Guias práticos sobre as situações mais comuns — rescisão,
                divórcio, pensão, INSS, dívida indevida, despejo e mais.
              </p>
              <ul className="mt-4 space-y-2.5">
                {latestArticles.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/blog/${a.slug}`}
                      className="block group hover:bg-brand-line/40 -mx-2 px-2 py-1.5 rounded-lg transition"
                    >
                      <span className="text-xs text-brand-ink/55 uppercase tracking-wide">
                        {a.category} · {a.readingMinutes} min
                      </span>
                      <p className="text-sm font-semibold text-brand-ink group-hover:text-brand-deep leading-snug">
                        {a.title}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/blog"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-deep hover:text-brand-accent2"
              >
                Ver todos os artigos →
              </Link>
            </div>
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3"
                style={{ background: "rgba(200,162,74,0.14)", color: "#A0843A", border: "1px solid rgba(200,162,74,0.3)" }}
              >
                <FileText className="w-3.5 h-3.5" aria-hidden />
                Modelos de documentos
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-brand-ink leading-tight">
                Modelos prontos pra baixar
              </h2>
              <p className="text-brand-ink/65 mt-2">
                Procuração, contrato de locação, recibo, distrato, declaração
                de união estável, autorização de viagem — preencha os campos
                entre colchetes e use.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                  { slug: "procuracao-particular-geral", label: "Procuração particular" },
                  { slug: "contrato-de-locacao-residencial-simples", label: "Contrato de locação" },
                  { slug: "recibo-pagamento-quitacao", label: "Recibo de pagamento" },
                  { slug: "declaracao-de-uniao-estavel", label: "União estável" },
                  { slug: "autorizacao-viagem-menor-nacional", label: "Autorização de viagem" },
                  { slug: "notificacao-extrajudicial-cobranca", label: "Notificação de cobrança" }
                ].map((t) => (
                  <Link
                    key={t.slug}
                    href={`/modelos/${t.slug}`}
                    className="text-sm text-brand-ink/85 hover:text-brand-deep hover:bg-brand-line/40 px-2 py-1.5 rounded-lg border border-brand-line transition"
                  >
                    {t.label}
                  </Link>
                ))}
              </div>
              <Link
                href="/modelos"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-deep hover:text-brand-accent2"
              >
                Ver todos os modelos →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <HomeFaq />

      {/* CTA advogados — redesign escuro com botão dourado */}
      <section className="container-tight py-6">
        <div
          className="rounded-3xl text-white p-8 md:p-10 relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          style={{ background: "linear-gradient(110deg, #1B2D49, #0F1B2D)" }}
        >
          <div
            aria-hidden
            className="absolute -top-1/4 -right-1/4 w-1/2 aspect-square rounded-full blur-3xl"
            style={{ background: "rgba(200,162,74,0.18)" }}
          />
          <div className="relative max-w-2xl">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4"
              style={{ background: GOLD, color: "#0F1B2D" }}
            >
              <Scale className="w-3.5 h-3.5" aria-hidden />
              Para advogados
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-semibold leading-tight">
              Sou advogado e quero aparecer aqui
            </h2>
            <p className="mt-3 text-base md:text-lg leading-relaxed" style={{ color: "#A9B4C6" }}>
              Apareça quando alguém procura advogado na sua cidade.{" "}
              <strong style={{ color: "#F0CE84" }}>Leva menos de 1 minuto para começar.</strong>
            </p>
          </div>
          <div className="relative flex flex-wrap gap-3">
            <Link
              href="/para-advogados"
              className="inline-flex items-center gap-2 font-bold rounded-xl px-6 py-3.5"
              style={{ background: GOLD, color: "#0F1B2D" }}
            >
              Criar meu perfil grátis
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              href="/exemplo-perfil-premium"
              className="btn-ghost text-white border border-white/25 hover:bg-white/10 inline-flex items-center"
            >
              Ver um perfil de exemplo
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
