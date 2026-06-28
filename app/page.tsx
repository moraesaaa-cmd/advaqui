import Link from "next/link";
import { Check } from "lucide-react";
import { SearchBox } from "@/components/SearchBox";
import { GeoPersonalize } from "@/components/GeoPersonalize";
import { ResolverAgora } from "@/components/ResolverAgora";
import { getAllArticles } from "@/lib/data/articles";
import { getProblemaIndex } from "@/lib/data/problema-index";

export const revalidate = 600;

// Recriação 1:1 do Home.dc.html do handoff "Melhorias para advaqui.com"
// (Apex / claude_design). Ordem das seções e conteúdo conforme o protótipo:
// Hero → Orientação inteligente → Como funciona → Blog + Modelos → CTA advogado.
// Dourado do design nos detalhes; navy #0F1B2D nos blocos escuros.
// (Componentes ResolverAgora/IntentGrid/HomeFaq seguem no codebase, fora da
// home, como no design.)
const GOLD = "#C8A24A";
const GOLD_EYEBROW = "#A0843A";

// Chips do hero — cada um leva ao hub de problemas jurídicos (rota existente).
const HERO_CHIPS = [
  "fui demitido e não recebi nada",
  "meu nome está negativado",
  "o INSS negou meu benefício",
  "caí em um golpe do pix",
  "quero me divorciar"
];


const HOW_STEPS = [
  {
    n: "01",
    t: "Busque por cidade",
    d: "Digite o nome da sua cidade ou escolha o estado no mapa do Brasil."
  },
  {
    n: "02",
    t: "Filtre por especialidade",
    d: "Trabalhista, família, previdenciário, criminal, civil — as principais áreas."
  },
  {
    n: "03",
    t: "Fale direto pelo WhatsApp",
    d: "Cada perfil traz telefone, e-mail e WhatsApp clicável. Sem taxa, sem comissão."
  }
];

// Chips de modelos & ferramentas — rotas reais do site.
const MODELOS = [
  { label: "Procuração particular", href: "/modelos/procuracao-particular-geral" },
  { label: "Contrato de locação", href: "/modelos/contrato-de-locacao-residencial-simples" },
  { label: "Recibo de pagamento", href: "/modelos/recibo-pagamento-quitacao" },
  { label: "União estável", href: "/modelos/declaracao-de-uniao-estavel" },
  { label: "Calculadora de rescisão", href: "/calculadoras" },
  { label: "Calculadora de prazos", href: "/calculadora-prazos" }
];

export default async function HomePage() {
  const latestArticles = getAllArticles().slice(0, 3);
  const problemas = getProblemaIndex();

  return (
    <>
      {/* HERO */}
      <section
        className="relative text-white overflow-hidden"
        style={{
          background: "linear-gradient(155deg, #0B1830 0%, #13294C 55%, #1A2C5A 100%)"
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
              Advogados com OAB verificada em todo o Brasil
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
            <p
              className="mt-5 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
              style={{ color: "#BBC7DC" }}
            >
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
            <div
              className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-[13.5px]"
              style={{ color: "#A6B3C9" }}
            >
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

      {/* PERSONALIZAÇÃO — CTA local baseado na última cidade pesquisada */}
      <GeoPersonalize />

      {/* ORIENTAÇÃO INTELIGENTE — componente interativo */}
      <ResolverAgora items={problemas} />

      {/* COMO FUNCIONA — bloco navy */}
      <section className="container-tight pt-14 md:pt-16">
        <div className="rounded-3xl text-white p-8 md:p-11" style={{ background: "#0F1B2D" }}>
          <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">
            Como funciona
          </h2>
          <p className="mt-1.5 text-[15px]" style={{ color: "#A9B4C6" }}>
            Sem cadastro do cliente, sem intermediação. Você busca, encontra, contrata direto.
          </p>
          <div className="mt-8 grid md:grid-cols-3 gap-8">
            {HOW_STEPS.map(({ n, t, d }) => (
              <div key={n}>
                <div className="font-display text-2xl mb-2.5" style={{ color: GOLD }}>
                  {n}
                </div>
                <h3 className="font-semibold text-[16.5px] mb-1.5">{t}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#A9B4C6" }}>
                  {d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG + MODELOS — 2 colunas */}
      <section className="container-tight pt-14 md:pt-16">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-brand-line rounded-2xl p-7 md:p-8">
            <div
              className="text-xs font-bold uppercase tracking-wider mb-2.5"
              style={{ color: GOLD_EYEBROW }}
            >
              Blog jurídico
            </div>
            <h3 className="font-display text-xl md:text-2xl font-semibold text-brand-ink tracking-tight mb-3">
              Seus direitos sem juridiquês
            </h3>
            <div>
              {latestArticles.map((a) => (
                <Link
                  key={a.slug}
                  href={`/blog/${a.slug}`}
                  className="block py-3 border-b border-brand-line text-[14.5px] font-medium text-brand-ink hover:text-brand-deep transition"
                >
                  {a.title}
                </Link>
              ))}
            </div>
          </div>
          <div className="bg-white border border-brand-line rounded-2xl p-7 md:p-8">
            <div
              className="text-xs font-bold uppercase tracking-wider mb-2.5"
              style={{ color: GOLD_EYEBROW }}
            >
              Modelos &amp; ferramentas
            </div>
            <h3 className="font-display text-xl md:text-2xl font-semibold text-brand-ink tracking-tight mb-4">
              Documentos prontos pra usar
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {MODELOS.map((m) => (
                <Link
                  key={m.href}
                  href={m.href}
                  className="text-[13.5px] px-3.5 py-2 rounded-lg text-brand-ink/80 hover:text-brand-deep transition"
                  style={{ background: "#F1F0EA" }}
                >
                  {m.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA ADVOGADO — faixa navy, botão dourado */}
      <section className="container-tight py-14 md:py-16">
        <div
          className="rounded-3xl text-white p-8 md:p-11 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          style={{ background: "linear-gradient(110deg, #1B2D49, #0F1B2D)" }}
        >
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl md:text-3xl font-semibold leading-tight">
              Sou advogado e quero aparecer aqui
            </h2>
            <p className="mt-2 text-[15px]" style={{ color: "#A9B4C6" }}>
              Apareça quando alguém procura advogado na sua cidade. Leva menos de 2
              minutos para começar.
            </p>
          </div>
          <Link
            href="/para-advogados"
            className="inline-flex items-center justify-center font-bold rounded-xl px-6 py-3.5 whitespace-nowrap"
            style={{ background: GOLD, color: "#0F1B2D" }}
          >
            Saiba como anunciar
          </Link>
        </div>
      </section>
    </>
  );
}
