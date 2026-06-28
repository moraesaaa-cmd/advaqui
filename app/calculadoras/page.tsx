import Link from "next/link";
import { Calculator, ChevronRight, Scale, ArrowRight } from "lucide-react";
import { CALCULADORAS } from "@/lib/data/calculadoras";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const metadata = buildMetadata({
  title: "Calculadoras jurídicas — rescisão, FGTS, pensão, aposentadoria",
  description:
    "Guias de cálculo para situações jurídicas comuns — rescisão trabalhista, FGTS, pensão alimentícia, aposentadoria, férias, 13º, inventário.",
  path: "/calculadoras"
});

export default function CalculadorasHubPage() {
  return (
    <div className="container-narrow py-10">
      <Breadcrumb items={[{ label: "Calculadoras" }]} />

      <header className="mb-6">
        <div className="flex items-start gap-3 mb-2">
          <Calculator className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              Calculadoras jurídicas
            </h1>
            <p className="text-base text-brand-ink/85 mt-3 leading-relaxed max-w-3xl">
              Guias de cálculo das situações jurídicas mais comuns do cidadão
              brasileiro. Cada calculadora explica a fórmula, dá exemplo
              numérico e aponta os documentos necessários. Em casos
              específicos, vale revisar com advogado da área.
            </p>
          </div>
        </div>
      </header>

      <section>
        <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
          <Scale className="w-5 h-5 text-brand-deep" aria-hidden />
          Calculadoras disponíveis
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {CALCULADORAS.map((c) => (
            <Link
              key={c.slug}
              href={`/calculadoras/${c.slug}`}
              className="rounded-xl border border-brand-line bg-white p-5 hover:border-brand-accent hover:shadow-card transition group"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-accent/15 flex items-center justify-center flex-shrink-0">
                  <Calculator
                    className="w-5 h-5 text-brand-accent2"
                    aria-hidden
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-base font-bold text-brand-ink group-hover:text-brand-deep transition">
                    {c.titulo}
                  </h3>
                  <p className="text-sm text-brand-ink/70 mt-1 leading-relaxed">
                    {c.resumo}
                  </p>
                </div>
                <ChevronRight
                  className="w-5 h-5 text-brand-ink/30 group-hover:text-brand-deep transition flex-shrink-0 mt-1"
                  aria-hidden
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-2xl bg-brand-bg border border-brand-line p-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-3">
          Leitura recomendada
        </h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <Link
            href="/blog/fui-demitido-sem-justa-causa"
            className="rounded-lg border border-brand-line bg-white p-4 hover:border-brand-accent transition group"
          >
            <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-ink/50">Blog</span>
            <p className="text-sm font-semibold text-brand-ink group-hover:text-brand-deep mt-1">
              Fui demitido sem justa causa: direitos e rescisão
            </p>
          </Link>
          <Link
            href="/blog/como-pedir-pensao-alimenticia"
            className="rounded-lg border border-brand-line bg-white p-4 hover:border-brand-accent transition group"
          >
            <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-ink/50">Blog</span>
            <p className="text-sm font-semibold text-brand-ink group-hover:text-brand-deep mt-1">
              Como pedir pensão alimentícia
            </p>
          </Link>
          <Link
            href="/blog/inss-negou-beneficio-o-que-fazer"
            className="rounded-lg border border-brand-line bg-white p-4 hover:border-brand-accent transition group"
          >
            <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-ink/50">Blog</span>
            <p className="text-sm font-semibold text-brand-ink group-hover:text-brand-deep mt-1">
              INSS negou benefício: o que fazer
            </p>
          </Link>
        </div>
      </section>

      <section
        className="mt-6 rounded-2xl px-6 py-5 flex items-center justify-between gap-5 flex-wrap"
        style={{ background: "#0F1B2D" }}
      >
        <div>
          <p className="text-white font-semibold">Precisa de ajuda profissional?</p>
          <p className="text-sm" style={{ color: "#A9B4C6" }}>
            Encontre advogados verificados na sua cidade — contato direto, sem intermediário.
          </p>
        </div>
        <Link
          href="/advogados"
          className="inline-flex items-center gap-2 text-[15px] font-bold px-5 py-3 rounded-xl shrink-0"
          style={{ background: "#C8A24A", color: "#0F1B2D" }}
        >
          Buscar advogado
          <ArrowRight className="w-4 h-4" aria-hidden />
        </Link>
      </section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Calculadoras", url: "/calculadoras" }
        ])}
      />
    </div>
  );
}
