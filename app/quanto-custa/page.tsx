import Link from "next/link";
import { DollarSign, ChevronRight, Clock } from "lucide-react";
import { CUSTOS, formatFaixa } from "@/lib/data/custos-juridicos";
import { SPECIALTIES } from "@/lib/data/specialties";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const metadata = buildMetadata({
  title: "Quanto custa um advogado — faixas de honorário por serviço",
  description:
    "Faixas de honorário dos serviços jurídicos mais comuns — divórcio, inventário, ação trabalhista, contra o INSS, contra banco e mais. O que inclui, quando é gratuito e prazos. Valores de referência, não tabela oficial.",
  path: "/quanto-custa"
});

export default function QuantoCustaHubPage() {
  // Agrupa por área pra organizar o índice (em vez de uma lista solta).
  const porArea = SPECIALTIES.map((sp) => ({
    area: sp,
    itens: CUSTOS.filter((c) => c.area_slug === sp.slug)
  })).filter((g) => g.itens.length > 0);

  return (
    <div className="container-narrow py-10">
      <Breadcrumb items={[{ label: "Quanto custa" }]} />

      <header className="mb-6">
        <div className="flex items-start gap-3 mb-2">
          <DollarSign className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              Quanto custa um advogado
            </h1>
            <p className="text-base text-brand-ink/85 mt-3 leading-relaxed max-w-3xl">
              Faixas de honorário dos serviços jurídicos mais procurados. Cada
              página mostra o que costuma estar incluído, quando o atendimento
              pode ser gratuito (defensoria, juizado, justiça gratuita) e o
              prazo estimado. São valores de referência de mercado — não uma
              tabela oficial. O honorário é livremente combinado com o advogado.
            </p>
          </div>
        </div>
      </header>

      {porArea.map(({ area, itens }) => (
        <section key={area.slug} className="mb-8">
          <h2 className="font-display text-lg font-bold text-brand-deep mb-3">
            {area.name}
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {itens.map((c) => (
              <Link
                key={c.slug}
                href={`/quanto-custa/${c.slug}`}
                className="rounded-xl border border-brand-line bg-white p-4 hover:border-brand-accent hover:shadow-card transition group"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <h3 className="font-display text-base font-bold text-brand-ink group-hover:text-brand-deep transition leading-snug">
                      {c.titulo}
                    </h3>
                    <p className="text-sm text-brand-ink/70 mt-1 inline-flex items-center gap-2">
                      <span className="font-semibold text-brand-ink">
                        {formatFaixa(c.faixa_min, c.faixa_max)}
                      </span>
                      <span aria-hidden>·</span>
                      <Clock className="w-3.5 h-3.5" aria-hidden />
                      {c.tempo_estimado}
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
      ))}

      <aside
        role="note"
        className="rounded-xl bg-brand-bg/50 border border-brand-line p-4 text-xs md:text-sm text-brand-ink/75 leading-relaxed"
      >
        Os valores são referência de mercado e variam conforme a complexidade do
        caso, a comarca e a experiência do profissional. O AdvAqui não cobra
        comissão sobre honorários — o combinado é feito diretamente entre você e
        o advogado.
      </aside>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Quanto custa", url: "/quanto-custa" }
        ])}
      />
    </div>
  );
}
