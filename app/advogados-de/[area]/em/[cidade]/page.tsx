import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Scale,
  ChevronRight,
  AlertCircle,
  Users,
  MapPin,
  HelpCircle,
  BookOpen,
  Compass
} from "lucide-react";
import { SPECIALTIES, findSpecialty } from "@/lib/data/specialties";
import { SPECIALTY_INFO } from "@/lib/data/specialty-descriptions";
import {
  getCidadesPrioritarias,
  cidadesPrioritariasMesmaRegiao
} from "@/lib/data/cidades-prioritarias";
import { findCity, nearbyCities } from "@/lib/data/cities";
import { getLawyersForCity } from "@/lib/data/lawyers";
import { findGuiaByArea } from "@/lib/data/guias";
import { problemasByArea } from "@/lib/data/problemas-juridicos";
import { findTemaStj } from "@/lib/data/jurisprudencia-temas";
import { LawyerCard } from "@/components/LawyerCard";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";

/**
 * /advogado/[area]/em/[cidade-uf] — busca local "advogado [área] em [cidade]".
 *
 * 15 especialidades × 5571 cidades IBGE = 83.565 URLs cauda longa indexáveis.
 *
 * Híbrido SSG + ISR:
 *  - SSG nas 50 cidades prioritárias × 15 áreas (750 pré-geradas)
 *  - ISR nas demais 5521 × 15 — geradas sob demanda, cacheadas 24h
 *
 * Diferente de /advogados/[uf]/[cidade]/[especialidade] (lista direta no
 * diretório). Aqui o foco é a busca "advogado [área] em [cidade]" — página
 * educativa + lista compacta + cross-links. Sem canibalização porque o
 * outro caminho lista todos advogados + filtros, e este aqui é a vitrine
 * editorial da combinação área × cidade.
 */

export const revalidate = 86400; // 24h
export const dynamicParams = true;

export function generateStaticParams() {
  const cidades = getCidadesPrioritarias();
  const params: Array<{ area: string; cidade: string }> = [];
  for (const sp of SPECIALTIES) {
    for (const c of cidades) {
      params.push({
        area: sp.slug,
        cidade: `${c.slug}-${c.uf.toLowerCase()}`
      });
    }
  }
  return params;
}

function parseCidadeParam(
  param: string
): { uf: string; citySlug: string; cidadeNome: string } | null {
  const m = param.match(/^(.+)-([a-z]{2})$/i);
  if (!m) return null;
  const citySlug = m[1].toLowerCase();
  const uf = m[2].toUpperCase();
  const city = findCity(uf, citySlug);
  if (!city) return null;
  return { uf, citySlug, cidadeNome: city.name };
}

export async function generateMetadata({
  params
}: {
  params: { area: string; cidade: string };
}) {
  const sp = findSpecialty(params.area);
  const cidadeInfo = parseCidadeParam(params.cidade);
  if (!sp || !cidadeInfo) {
    return buildMetadata({
      title: "Página não encontrada",
      description: "Página não encontrada",
      noIndex: true
    });
  }
  const title = `Advogado ${sp.name.toLowerCase()} em ${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}`;
  const description = `Encontre advogados de direito ${sp.name.toLowerCase()} em ${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}. ${sp.intro.slice(0, 80)}`;
  return buildMetadata({
    title,
    description: description.slice(0, 160),
    path: `/advogados-de/${sp.slug}/em/${params.cidade}`
  });
}

export default async function AdvogadoAreaCidadePage({
  params
}: {
  params: { area: string; cidade: string };
}) {
  const sp = findSpecialty(params.area);
  const cidadeInfo = parseCidadeParam(params.cidade);
  if (!sp || !cidadeInfo) notFound();

  const ufLower = cidadeInfo.uf.toLowerCase();
  const spInfo = SPECIALTY_INFO[sp.slug];

  // Buscar advogados da cidade — defensive
  let lawyers: Awaited<ReturnType<typeof getLawyersForCity>> = [];
  try {
    lawyers = await getLawyersForCity(cidadeInfo.uf, cidadeInfo.citySlug);
  } catch {
    lawyers = [];
  }
  const lawyersDaArea = lawyers.filter((l) =>
    (l.specialties || []).some(
      (s) => s.toLowerCase() === sp.slug.toLowerCase() ||
              s.toLowerCase() === sp.name.toLowerCase()
    )
  );
  const lawyersExibir = (lawyersDaArea.length > 0 ? lawyersDaArea : lawyers).slice(
    0,
    6
  );

  const guia = findGuiaByArea(sp.slug);
  const problemasArea = (problemasByArea()[sp.slug] || []).slice(0, 6);
  const temaSlug = problemasArea.find((p) => p.tema_jurisprudencia)
    ?.tema_jurisprudencia;
  const tema = temaSlug ? findTemaStj(temaSlug) : null;

  // Cidade-cidades vizinhas (mesma região prioritárias + vizinhas IBGE no estado)
  const city = findCity(cidadeInfo.uf, cidadeInfo.citySlug);
  const ibgeVizinhas = city
    ? nearbyCities(city, 6).map((c) => ({
        uf: c.uf,
        slug: c.slug,
        nome_completo: `${c.name}, ${c.uf}`,
        regiao: ""
      }))
    : [];
  const regionais = cidadesPrioritariasMesmaRegiao(
    cidadeInfo.uf,
    cidadeInfo.citySlug,
    6
  );
  const vizinhas = regionais.length > 0 ? regionais : ibgeVizinhas;

  // Outras áreas na mesma cidade
  const outrasAreas = SPECIALTIES.filter((s) => s.slug !== sp.slug).slice(0, 8);

  return (
    <div className="container-narrow py-10">
      <Breadcrumb
        items={[
          { label: "Advogados", href: "/advogados" },
          { label: sp.name, href: `/advogados/${ufLower}/${cidadeInfo.citySlug}/${sp.slug}` },
          { label: `${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}` }
        ]}
      />

      <article className="card mb-6">
        <div className="flex items-start gap-3 mb-2">
          <Scale
            className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1"
            aria-hidden
          />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              Advogado {sp.name.toLowerCase()} em {cidadeInfo.cidadeNome}, {cidadeInfo.uf}
            </h1>
            <p className="text-sm text-brand-ink/55 mt-1 inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" aria-hidden />
              {cidadeInfo.cidadeNome} · {cidadeInfo.uf} · Direito {sp.name}
            </p>
            <p className="text-base md:text-lg text-brand-ink/85 mt-3 leading-relaxed">
              {sp.intro}
            </p>
            <p className="text-sm md:text-base text-brand-ink/85 mt-2 leading-relaxed">
              Em {cidadeInfo.cidadeNome}/{cidadeInfo.uf}, os atendimentos seguem
              a mesma orientação técnica do direito {sp.name.toLowerCase()}, com
              particularidades locais — varas competentes, prazos administrativos
              da OAB seccional, canais públicos (Procon, defensoria).
            </p>
          </div>
        </div>

        {/* O que cobre */}
        {spInfo && (
          <section className="mt-6">
            <h2 className="font-display text-xl font-bold text-brand-ink mb-2">
              O que o advogado {sp.name.toLowerCase()} cobre
            </h2>
            <p className="text-sm md:text-base text-brand-ink/85 leading-relaxed">
              {spInfo.description}
            </p>
          </section>
        )}

        {/* Documentos */}
        {spInfo && spInfo.usefulDocs.length > 0 && (
          <section className="mt-6">
            <h2 className="font-display text-xl font-bold text-brand-ink mb-2">
              Documentos úteis antes da consulta
            </h2>
            <ul className="space-y-2">
              {spInfo.usefulDocs.map((doc, i) => (
                <li
                  key={i}
                  className="text-sm md:text-base text-brand-ink/85 leading-relaxed pl-4 border-l-2 border-brand-line"
                >
                  {doc}
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>

      {/* Lista de advogados */}
      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-deep" aria-hidden />
          Advogados {sp.name.toLowerCase()} em {cidadeInfo.cidadeNome}
        </h2>
        {lawyersExibir.length === 0 ? (
          <div className="rounded-xl bg-brand-bg/40 border border-brand-line p-4 text-sm text-brand-ink/80 leading-relaxed">
            <p>
              Ainda não temos advogados de {sp.name.toLowerCase()} cadastrados em{" "}
              {cidadeInfo.cidadeNome}/{cidadeInfo.uf}. Veja{" "}
              <Link
                href={`/advogados/${ufLower}/${cidadeInfo.citySlug}`}
                className="text-brand-deep underline font-medium"
              >
                todos os advogados de {cidadeInfo.cidadeNome}
              </Link>{" "}
              ou{" "}
              <Link
                href={`/advogados/${sp.slug}`}
                className="text-brand-deep underline"
              >
                profissionais da área em todo o Brasil
              </Link>
              .
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-brand-ink/75 mb-3 leading-relaxed">
              {lawyersDaArea.length > 0
                ? `${lawyersDaArea.length} profissional(is) cadastrado(s) em ${cidadeInfo.cidadeNome} com atuação na área.`
                : `Profissionais cadastrados em ${cidadeInfo.cidadeNome}. Confirme a atuação na área antes da consulta.`}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {lawyersExibir.map((lawyer) => (
                <LawyerCard key={lawyer.id} lawyer={lawyer} />
              ))}
            </div>
            <p className="mt-4 text-sm">
              <Link
                href={`/advogados/${ufLower}/${cidadeInfo.citySlug}/${sp.slug}`}
                className="text-brand-deep hover:underline font-medium"
              >
                Ver listagem completa no diretório →
              </Link>
            </p>
          </>
        )}
      </section>

      {/* Cross-links: guia + problemas + jurisprudência */}
      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-3">
          Continue se informando
        </h2>

        {guia && (
          <Link
            href={`/guias/${guia.slug}`}
            className="block group mb-2 rounded-xl border border-brand-line p-4 hover:border-brand-deep/40 hover:shadow-card transition"
          >
            <div className="flex items-start gap-3">
              <Compass className="w-5 h-5 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
              <div className="flex-1">
                <p className="text-xs text-brand-ink/55 font-semibold uppercase tracking-wide">
                  Guia da área
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
        )}

        {tema && (
          <Link
            href={`/jurisprudencia/stj/tema/${tema.slug}`}
            className="block group mb-2 rounded-xl border border-brand-line p-4 hover:border-brand-deep/40 hover:shadow-card transition"
          >
            <div className="flex items-start gap-3">
              <Scale className="w-5 h-5 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
              <div className="flex-1">
                <p className="text-xs text-brand-ink/55 font-semibold uppercase tracking-wide">
                  Jurisprudência STJ
                </p>
                <p className="text-sm md:text-base font-semibold text-brand-ink group-hover:text-brand-deep transition mt-0.5">
                  Decisões sobre {tema.titulo.toLowerCase()}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-brand-ink/30 group-hover:text-brand-deep flex-shrink-0 mt-1" aria-hidden />
            </div>
          </Link>
        )}
      </section>

      {/* Problemas da área aplicados à cidade */}
      {problemasArea.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-brand-deep" aria-hidden />
            Situações comuns em {cidadeInfo.cidadeNome}
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {problemasArea.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/problemas-juridicos/${p.slug}/em/${params.cidade}`}
                  className="block group rounded-lg border border-brand-line p-3 hover:border-brand-deep/40 hover:bg-brand-bg/30 transition"
                >
                  <p className="font-semibold text-sm text-brand-ink group-hover:text-brand-deep transition">
                    {p.titulo}
                  </p>
                  <p className="text-xs text-brand-ink/65 mt-0.5 leading-snug">
                    Aplicado a {cidadeInfo.cidadeNome}, {cidadeInfo.uf}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Outras áreas na mesma cidade */}
      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-brand-deep" aria-hidden />
          Outras áreas em {cidadeInfo.cidadeNome}
        </h2>
        <ul className="grid gap-1.5 sm:grid-cols-2 md:grid-cols-3 text-sm">
          {outrasAreas.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/advogados-de/${s.slug}/em/${params.cidade}`}
                className="block px-2 py-1.5 rounded-md text-brand-ink hover:bg-brand-bg/40 hover:text-brand-deep transition"
              >
                <span aria-hidden>→</span> Advogado {s.name.toLowerCase()}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Mesma área em cidades próximas */}
      {vizinhas.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-3">
            Advogado {sp.name.toLowerCase()} em cidades próximas
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {vizinhas.map((v) => (
              <li key={`${v.uf}-${v.slug}`}>
                <Link
                  href={`/advogados-de/${sp.slug}/em/${v.slug}-${v.uf.toLowerCase()}`}
                  className="block group rounded-lg border border-brand-line p-3 hover:border-brand-deep/40 hover:bg-brand-bg/30 transition"
                >
                  <p className="font-semibold text-sm text-brand-ink group-hover:text-brand-deep transition">
                    {v.nome_completo}
                  </p>
                  {v.regiao && (
                    <p className="text-xs text-brand-ink/65 mt-0.5 leading-snug">
                      {v.regiao}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <aside
        role="note"
        className="rounded-xl border-l-4 border-amber-400 bg-amber-50 p-4 text-xs md:text-sm text-amber-900 leading-relaxed flex items-start gap-2 mb-6"
      >
        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden />
        <span>
          Esta página é um índice informativo. O AdvAqui não é órgão público
          nem substitui consulta jurídica. Cada caso concreto exige análise por
          advogado que conheça as particularidades de {cidadeInfo.cidadeNome}/
          {cidadeInfo.uf}.
        </span>
      </aside>

      <p className="text-sm text-brand-ink/65">
        <Link
          href={`/advogados/${ufLower}/${cidadeInfo.citySlug}`}
          className="text-brand-deep hover:underline"
        >
          ← Ver todos os advogados de {cidadeInfo.cidadeNome}
        </Link>
      </p>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Advogados", url: "/advogados" },
          { name: sp.name, url: `/advogados/${ufLower}/${cidadeInfo.citySlug}/${sp.slug}` },
          {
            name: `${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}`,
            url: `/advogados-de/${sp.slug}/em/${params.cidade}`
          }
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: `Advogado ${sp.name.toLowerCase()} em ${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}`,
          description: sp.intro,
          provider: {
            "@type": "Organization",
            name: SITE.name,
            url: SITE.url
          },
          areaServed: {
            "@type": "City",
            name: cidadeInfo.cidadeNome,
            address: {
              "@type": "PostalAddress",
              addressLocality: cidadeInfo.cidadeNome,
              addressRegion: cidadeInfo.uf,
              addressCountry: "BR"
            }
          },
          serviceType: `Direito ${sp.name}`
        }}
      />
    </div>
  );
}
