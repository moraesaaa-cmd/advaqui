import Link from "next/link";
import { Scale, ChevronRight } from "lucide-react";
import { SPECIALTIES } from "@/lib/data/specialties";
import { SPECIALTY_INFO } from "@/lib/data/specialty-descriptions";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const metadata = buildMetadata({
  title: "Áreas de atuação — encontre advogado por especialidade",
  description:
    "Conheça as áreas do direito e quando procurar cada especialista — trabalhista, família, consumidor, criminal, previdenciário, civil e mais. Encontre advogados por área e cidade.",
  path: "/advogados-de"
});

export default function AreasHubPage() {
  return (
    <div className="container-narrow py-10">
      <Breadcrumb items={[{ label: "Áreas de atuação" }]} />

      <header className="mb-6">
        <div className="flex items-start gap-3 mb-2">
          <Scale className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              Áreas de atuação
            </h1>
            <p className="text-base text-brand-ink/85 mt-3 leading-relaxed max-w-3xl">
              Cada problema jurídico tem uma área especializada. Veja o que cada
              uma cobre, quando procurar e encontre profissionais que atuam na
              sua cidade.
            </p>
          </div>
        </div>
      </header>

      <div className="grid sm:grid-cols-2 gap-3">
        {SPECIALTIES.map((sp) => {
          const info = SPECIALTY_INFO[sp.slug];
          return (
            <Link
              key={sp.slug}
              href={`/advogados-de/${sp.slug}`}
              className="rounded-xl border border-brand-line bg-white p-5 hover:border-brand-accent hover:shadow-card transition group"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-accent/15 flex items-center justify-center flex-shrink-0">
                  <Scale className="w-5 h-5 text-brand-accent2" aria-hidden />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-display text-base font-bold text-brand-ink group-hover:text-brand-deep transition">
                    Advogado de {sp.name}
                  </h2>
                  {info?.description && (
                    <p className="text-sm text-brand-ink/70 mt-1 leading-relaxed line-clamp-3">
                      {info.description}
                    </p>
                  )}
                </div>
                <ChevronRight
                  className="w-5 h-5 text-brand-ink/30 group-hover:text-brand-deep transition flex-shrink-0 mt-1"
                  aria-hidden
                />
              </div>
            </Link>
          );
        })}
      </div>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Áreas de atuação", url: "/advogados-de" }
        ])}
      />
    </div>
  );
}
