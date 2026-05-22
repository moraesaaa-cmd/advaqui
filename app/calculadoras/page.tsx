import Link from "next/link";
import { Calculator, ChevronRight, Scale } from "lucide-react";
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

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Calculadoras", url: "/calculadoras" }
        ])}
      />
    </div>
  );
}
