import Link from "next/link";
import { Compass, ChevronRight } from "lucide-react";
import { GUIAS } from "@/lib/data/guias";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";

export const revalidate = 604800;

export const metadata = buildMetadata({
  title: "Guias por área do direito",
  description:
    "Guias pilar por área — consumidor, família, trabalho, previdenciário, civil, criminal, imobiliário, tributário, empresarial, digital, eleitoral, militar, internacional, ambiental e administrativo.",
  path: "/guias"
});

export default function GuiasIndexPage() {
  return (
    <div className="container-narrow py-10">
      <Breadcrumb items={[{ label: "Guias" }]} />

      <header className="card mb-6">
        <div className="flex items-start gap-3 mb-2">
          <Compass
            className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1"
            aria-hidden
          />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              Guias por área do direito
            </h1>
            <p className="text-sm md:text-base text-brand-ink/85 mt-3 leading-relaxed">
              Guias pilar conectando os principais ramos do direito brasileiro.
              Cada guia organiza temas centrais, problemas comuns, decisões
              reais e modelos prontos da área.
            </p>
          </div>
        </div>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2">
        {GUIAS.map((g) => (
          <li key={g.slug}>
            <Link
              href={`/guias/${g.slug}`}
              className="block group rounded-xl border border-brand-line bg-white p-5 hover:border-brand-deep/40 hover:shadow-card transition h-full"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h2 className="font-display text-lg font-bold text-brand-ink group-hover:text-brand-deep transition">
                    {g.titulo}
                  </h2>
                  <p className="text-sm text-brand-ink/75 mt-1 leading-relaxed">
                    {g.tagline}
                  </p>
                </div>
                <ChevronRight
                  className="w-5 h-5 text-brand-ink/30 group-hover:text-brand-deep flex-shrink-0 mt-1"
                  aria-hidden
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Guias", url: "/guias" }
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Guias por área do direito — AdvAqui",
          description:
            "Guias pilar das principais áreas do direito brasileiro, conectados a problemas reais, jurisprudência do STJ e advogados por cidade.",
          url: `${SITE.url}/guias`,
          inLanguage: "pt-BR",
          isPartOf: { "@type": "WebSite", url: SITE.url, name: SITE.name }
        }}
      />
    </div>
  );
}
