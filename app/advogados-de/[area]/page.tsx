import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Scale,
  ChevronRight,
  Users,
  MapPin,
  HelpCircle,
  Compass
} from "lucide-react";
import { SPECIALTIES, findSpecialty } from "@/lib/data/specialties";
import { SPECIALTY_INFO } from "@/lib/data/specialty-descriptions";
import { getCidadesPrioritarias } from "@/lib/data/cidades-prioritarias";
import { findGuiaByArea } from "@/lib/data/guias";
import { problemasByArea } from "@/lib/data/problemas-juridicos";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { CTAFinal } from "@/components/CTAFinal";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";

/**
 * /advogados-de/[area] — página-base (nacional) por área de atuação.
 *
 * Apresenta a área em linguagem clara, links pras cidades prioritárias
 * (versão local) e cross-links pro guia e pros problemas da área. Estática
 * sobre as 15 especialidades. Resolve o 404 que existia na base desta rota.
 */
export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return SPECIALTIES.map((sp) => ({ area: sp.slug }));
}

export async function generateMetadata({
  params
}: {
  params: { area: string };
}) {
  const sp = findSpecialty(params.area);
  if (!sp) {
    return buildMetadata({
      title: "Área não encontrada",
      description: "Página não encontrada.",
      noIndex: true
    });
  }
  const info = SPECIALTY_INFO[sp.slug];
  return buildMetadata({
    title: `Advogado de ${sp.name} — quando procurar e como encontrar`,
    description: (info?.description ||
      `Entenda quando procurar um advogado de ${sp.name.toLowerCase()} e encontre profissionais na sua cidade.`).slice(0, 160),
    path: `/advogados-de/${sp.slug}`
  });
}

export default function AreaBasePage({
  params
}: {
  params: { area: string };
}) {
  const sp = findSpecialty(params.area);
  if (!sp) notFound();

  const info = SPECIALTY_INFO[sp.slug];
  const guia = findGuiaByArea(sp.slug);
  const problemas = problemasByArea(sp.slug).slice(0, 6);
  const cidades = getCidadesPrioritarias().slice(0, 16);

  return (
    <div className="container-narrow py-10">
      <Breadcrumb
        items={[
          { label: "Áreas de atuação", href: "/advogados-de" },
          { label: sp.name }
        ]}
      />

      <article className="card mb-6">
        <div className="flex items-start gap-3 mb-2">
          <Scale className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              Advogado de {sp.name}
            </h1>
            <p className="text-base md:text-lg text-brand-ink/85 mt-3 leading-relaxed">
              {info?.description ||
                `Profissionais que atuam em ${sp.name.toLowerCase()}, prontos para orientar e representar você.`}
            </p>
          </div>
        </div>

        {info?.usefulDocs && info.usefulDocs.length > 0 && (
          <section className="mt-6">
            <h2 className="font-display text-lg font-bold text-brand-ink mb-2">
              Documentos úteis para o primeiro contato
            </h2>
            <ul className="space-y-2">
              {info.usefulDocs.map((d, i) => (
                <li
                  key={i}
                  className="text-sm md:text-base text-brand-ink/85 leading-relaxed pl-4 border-l-2 border-brand-line"
                >
                  {d}
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-6">
          <Link
            href={`/advogados/${sp.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-brand-deep text-white hover:bg-brand-deep/90 transition"
          >
            <Users className="w-4 h-4" aria-hidden />
            Ver advogados de {sp.name} no diretório
          </Link>
        </div>
      </article>

      {/* Cidades */}
      <section className="card mb-6">
        <h2 className="font-display text-lg font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
          <MapPin className="w-5 h-5 text-brand-deep" aria-hidden />
          Advogado de {sp.name} na sua cidade
        </h2>
        <div className="flex flex-wrap gap-2">
          {cidades.map((c) => (
            <Link
              key={`${c.uf}-${c.slug}`}
              href={`/advogados-de/${sp.slug}/em/${c.slug}-${c.uf.toLowerCase()}`}
              className="chip text-brand-ink hover:bg-brand-deep hover:text-white hover:border-brand-deep transition text-xs"
            >
              {c.nome_completo}
            </Link>
          ))}
        </div>
      </section>

      {/* Problemas da área */}
      {problemas.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-lg font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-brand-deep" aria-hidden />
            Problemas comuns desta área
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {problemas.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/problemas-juridicos/${p.slug}`}
                  className="block group rounded-lg border border-brand-line p-3 hover:border-brand-deep/40 hover:bg-brand-bg/30 transition"
                >
                  <p className="font-semibold text-sm text-brand-ink group-hover:text-brand-deep transition">
                    {p.titulo}
                  </p>
                  <p className="text-xs text-brand-ink/65 mt-0.5 leading-snug">
                    {p.intencao_curta}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Guia */}
      {guia && (
        <section className="card mb-6">
          <Link
            href={`/guias/${guia.slug}`}
            className="block group rounded-xl border border-brand-line p-4 hover:border-brand-deep/40 hover:shadow-card transition"
          >
            <div className="flex items-start gap-3">
              <Compass className="w-5 h-5 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
              <div className="flex-1">
                <p className="text-xs text-brand-ink/55 font-semibold uppercase tracking-wide">
                  Guia completo da área
                </p>
                <p className="text-sm md:text-base font-semibold text-brand-ink group-hover:text-brand-deep transition mt-0.5">
                  {guia.titulo}
                </p>
                <p className="text-sm text-brand-ink/70 mt-1 leading-relaxed">
                  {guia.tagline}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-brand-ink/30 group-hover:text-brand-deep flex-shrink-0 mt-1" aria-hidden />
            </div>
          </Link>
        </section>
      )}

      <CTAFinal areaSlug={sp.slug} />

      <p className="text-sm text-brand-ink/65 mt-6">
        <Link href="/advogados-de" className="text-brand-deep hover:underline">
          ← Ver todas as áreas de atuação
        </Link>
      </p>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Áreas de atuação", url: "/advogados-de" },
          { name: sp.name, url: `/advogados-de/${sp.slug}` }
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: `Advogado de ${sp.name}`,
          serviceType: sp.name,
          areaServed: { "@type": "Country", name: "Brasil" },
          provider: { "@type": "Organization", name: SITE.name, url: SITE.url },
          description:
            info?.description ||
            `Profissionais de ${sp.name.toLowerCase()} no diretório AdvAqui.`
        }}
      />
    </div>
  );
}
