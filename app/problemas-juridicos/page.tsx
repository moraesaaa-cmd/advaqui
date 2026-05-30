import Link from "next/link";
import { AlertCircle, ChevronRight, HelpCircle } from "lucide-react";
import { PROBLEMAS, problemasByArea } from "@/lib/data/problemas-juridicos";
import { SPECIALTIES } from "@/lib/data/specialties";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";

/**
 * Problemas jurídicos — hub principal.
 * SSG com revalidação semanal.
 */
export const revalidate = 604800;

export const metadata = buildMetadata({
  title: "Problemas jurídicos comuns",
  description:
    "Guias práticos para problemas jurídicos comuns — divórcio, pensão, demissão, plano de saúde, cobrança indevida e mais. Em linguagem clara.",
  path: "/problemas-juridicos"
});

export default function ProblemasIndexPage() {
  const porArea = problemasByArea();
  const areasComProblemas = Object.keys(porArea);
  const areaMap = new Map(SPECIALTIES.map((s) => [s.slug, s.name]));

  return (
    <div className="container-narrow py-10">
      <Breadcrumb items={[{ label: "Problemas jurídicos" }]} />

      <header className="card mb-6">
        <div className="flex items-start gap-3 mb-2">
          <HelpCircle
            className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1"
            aria-hidden
          />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              Problemas jurídicos comuns
            </h1>
            <p className="text-sm md:text-base text-brand-ink/85 mt-3 leading-relaxed">
              Guias práticos para situações que muita gente enfrenta. Linguagem
              clara, passos concretos antes de procurar advogado, e como
              reconhecer quando o caso é urgente.
            </p>
          </div>
        </div>
      </header>

      {/* Lista por área */}
      {areasComProblemas.map((areaSlug) => {
        const lista = porArea[areaSlug] || [];
        if (lista.length === 0) return null;
        const areaNome = areaMap.get(areaSlug) || areaSlug;
        return (
          <section key={areaSlug} className="card mb-6">
            <h2 className="font-display text-2xl font-bold text-brand-deep mb-3">
              {areaNome}
            </h2>
            <ul className="space-y-3">
              {lista.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/problemas-juridicos/${p.slug}`}
                    className="block group rounded-xl border border-brand-line p-4 hover:border-brand-deep/40 hover:shadow-card transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-brand-ink group-hover:text-brand-deep transition">
                          {p.titulo}
                        </h3>
                        <p className="text-sm text-brand-ink/70 mt-1 leading-relaxed">
                          {p.intencao_curta}
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
          </section>
        );
      })}

      <aside
        role="note"
        className="rounded-xl border-l-4 border-amber-400 bg-amber-50 p-4 text-xs md:text-sm text-amber-900 leading-relaxed flex items-start gap-2 mb-6"
      >
        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden />
        <span>
          As páginas aqui são orientações informativas. Cada caso concreto exige
          análise por advogado, que pode considerar provas, prazos e o contexto
          local. O AdvAqui não substitui consulta jurídica.
        </span>
      </aside>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Problemas jurídicos", url: "/problemas-juridicos" }
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Problemas jurídicos comuns — AdvAqui",
          description:
            "Guias práticos para problemas jurídicos do dia a dia, em linguagem clara, conectados a jurisprudência real e advogados por cidade.",
          url: `${SITE.url}/problemas-juridicos`,
          inLanguage: "pt-BR",
          isPartOf: { "@type": "WebSite", url: SITE.url, name: SITE.name }
        }}
      />
    </div>
  );
}
