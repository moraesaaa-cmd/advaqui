import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Compass,
  ChevronRight,
  ListChecks,
  MapPin,
  Users,
  HelpCircle,
  FileText,
  BookOpen
} from "lucide-react";
import { GUIAS, findGuia } from "@/lib/data/guias";
import {
  getCidadesPrioritarias,
  cidadesPrioritariasMesmaRegiao
} from "@/lib/data/cidades-prioritarias";
import { findCity } from "@/lib/data/cities";
import { findProblema } from "@/lib/data/problemas-juridicos";
import { findGlossarioTermo } from "@/lib/data/glossario";
import { findTemaStj } from "@/lib/data/jurisprudencia-temas";
import { findSpecialty } from "@/lib/data/specialties";
import { getLawyersForCity } from "@/lib/data/lawyers";
import { LawyerCard } from "@/components/LawyerCard";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";

/**
 * /guias/[slug]/em/[cidade] — combinação guia (área) × cidade.
 *
 * 10 guias × 5571 cidades IBGE = 55.710 URLs cauda longa indexáveis.
 *
 * Estratégia híbrida (mesma de problema × cidade):
 *  - SSG nas 50 cidades prioritárias × 10 guias (500 pré-geradas)
 *  - ISR (dynamicParams = true) nas 5521 cidades restantes — sob demanda,
 *    revalidate=24h
 *  - notFound() se "cidade-uf" não existir na base IBGE
 *
 * Conteúdo único por combinação:
 *  - H1 e meta contextualizam a área na cidade
 *  - Listagem de advogados que atuam na cidade na área específica
 *  - Cidades vizinhas da mesma região (interlink semântico)
 *  - Reaproveita temas centrais, FAQ e quando procurar do guia base
 *  - Canonical próprio — não substitui /guias/[slug] (geral)
 */

// force-dynamic: renderiza sob demanda SEM gravar em disco — impede o disco de
// reencher conforme o Google rastreia milhares de cidades. URL funciona normal.
export const dynamic = "force-dynamic";

const GUIA_SLUGS = GUIAS.map((g) => g.slug);

export function generateStaticParams() {
  const cidades = getCidadesPrioritarias();
  const params: Array<{ slug: string; cidade: string }> = [];
  for (const g of GUIA_SLUGS) {
    for (const c of cidades) {
      params.push({
        slug: g,
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
  params: { slug: string; cidade: string };
}) {
  const guia = findGuia(params.slug);
  const cidadeInfo = parseCidadeParam(params.cidade);
  if (!guia || !cidadeInfo) {
    return buildMetadata({
      title: "Página não encontrada",
      description: "Página não encontrada",
      noIndex: true
    });
  }
  const tituloLocal = `${guia.titulo} em ${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}`;
  const descricaoLocal = `${guia.tagline} Veja como funciona em ${cidadeInfo.cidadeNome}/${cidadeInfo.uf}, com advogados que atuam na área e na cidade.`;
  return buildMetadata({
    title: tituloLocal,
    description: descricaoLocal.slice(0, 160),
    path: `/guias/${guia.slug}/em/${params.cidade}`,
    canonical: `/guias/${guia.slug}`
  });
}

export default async function GuiaPorCidadePage({
  params
}: {
  params: { slug: string; cidade: string };
}) {
  const guia = findGuia(params.slug);
  const cidadeInfo = parseCidadeParam(params.cidade);
  if (!guia || !cidadeInfo) notFound();

  const area = findSpecialty(guia.area_slug);

  // Busca advogados da cidade — silencia erro
  let lawyers: Awaited<ReturnType<typeof getLawyersForCity>> = [];
  try {
    lawyers = await getLawyersForCity(cidadeInfo.uf, cidadeInfo.citySlug);
  } catch {
    lawyers = [];
  }

  // Filtra por área (case-insensitive vs slug ou nome)
  const lawyersDaArea = lawyers.filter((l) =>
    (l.specialties || []).some(
      (s) =>
        s.toLowerCase() === guia.area_slug.toLowerCase() ||
        (area && s.toLowerCase() === area.name.toLowerCase())
    )
  );
  const lawyersExibir = lawyersDaArea.length > 0 ? lawyersDaArea : lawyers;
  const lawyersExibirTop = lawyersExibir.slice(0, 6);

  const cidadeRegional = cidadesPrioritariasMesmaRegiao(
    cidadeInfo.uf,
    cidadeInfo.citySlug,
    6
  );

  const problemasRel = (guia.problemas || [])
    .map((s) => findProblema(s))
    .filter(Boolean)
    .slice(0, 5);
  const termosGloss = (guia.glossario || [])
    .map((s) => findGlossarioTermo(s))
    .filter(Boolean)
    .slice(0, 6);
  const temasJuris = (guia.temas_jurisprudencia || [])
    .map((s) => findTemaStj(s))
    .filter(Boolean)
    .slice(0, 5);

  const tituloLocal = `${guia.titulo} em ${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}`;
  const ufLower = cidadeInfo.uf.toLowerCase();

  return (
    <div className="container-narrow py-10">
      <Breadcrumb
        items={[
          { label: "Guias", href: "/guias" },
          {
            label: guia.titulo,
            href: `/guias/${guia.slug}`
          },
          { label: `${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}` }
        ]}
      />

      <article className="card mb-6">
        <div className="flex items-start gap-3 mb-2">
          <Compass
            className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1"
            aria-hidden
          />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              {tituloLocal}
            </h1>
            <p className="text-sm text-brand-ink/55 mt-1 inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" aria-hidden />
              {cidadeInfo.cidadeNome} · {cidadeInfo.uf}
              {area && (
                <>
                  <span aria-hidden> · </span>
                  <span>{area.name}</span>
                </>
              )}
            </p>
            <p className="text-base md:text-lg text-brand-ink/85 mt-3 leading-relaxed">
              {guia.tagline}
            </p>
          </div>
        </div>

        {/* Introdução localizada */}
        <section className="mt-6">
          {guia.introducao.map((p, i) => (
            <p
              key={i}
              className="text-sm md:text-base text-brand-ink/85 leading-relaxed mb-3"
            >
              {p}
            </p>
          ))}
          <p className="text-sm md:text-base text-brand-ink/85 leading-relaxed">
            Em {cidadeInfo.cidadeNome}/{cidadeInfo.uf}, as regras nacionais se
            aplicam normalmente. O que pode variar localmente é a competência
            das varas (justiça estadual ou federal), tribunais regionais, a
            estrutura da OAB seccional, e a disponibilidade de canais
            extrajudiciais como Procon, defensoria pública e juizado especial.
            Por isso vale buscar um advogado que conheça as particularidades
            forenses da cidade.
          </p>
        </section>

        {/* Temas centrais */}
        {guia.temas_centrais.length > 0 && (
          <section className="mt-6">
            <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-brand-deep" aria-hidden />
              O que esse guia cobre
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {guia.temas_centrais.slice(0, 6).map((t, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-brand-line bg-white p-4"
                >
                  <p className="font-semibold text-brand-ink">{t.titulo}</p>
                  <p className="text-sm text-brand-ink/80 mt-1 leading-relaxed">
                    {t.descricao}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Quando procurar advogado */}
        {guia.quando_procurar.length > 0 && (
          <section className="mt-6">
            <h2 className="font-display text-xl font-bold text-brand-ink mb-2">
              Quando procurar um advogado em {cidadeInfo.cidadeNome}
            </h2>
            <ul className="space-y-2">
              {guia.quando_procurar.map((q, i) => (
                <li
                  key={i}
                  className="text-sm md:text-base text-brand-ink/85 leading-relaxed pl-4 border-l-2 border-brand-line"
                >
                  {q}
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>

      {/* Advogados da área em CIDADE */}
      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-deep" aria-hidden />
          Advogados de {area?.name || guia.titulo.replace("Guia de ", "")} em{" "}
          {cidadeInfo.cidadeNome}
        </h2>
        {lawyersExibirTop.length === 0 ? (
          <div className="rounded-xl bg-brand-bg/40 border border-brand-line p-4 text-sm text-brand-ink/80 leading-relaxed">
            <p>
              Ainda não temos advogados de {area?.name || "esta área"}{" "}
              cadastrados em {cidadeInfo.cidadeNome}/{cidadeInfo.uf}. Veja{" "}
              <Link
                href={`/advogados/${ufLower}/${cidadeInfo.citySlug}`}
                className="text-brand-deep underline font-medium"
              >
                todos os advogados de {cidadeInfo.cidadeNome}
              </Link>{" "}
              ou{" "}
              <Link href="/cadastro" className="text-brand-deep underline">
                cadastre-se como o primeiro advogado da área
              </Link>
              .
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-brand-ink/75 mb-3 leading-relaxed">
              {lawyersDaArea.length > 0
                ? `Profissionais em ${cidadeInfo.cidadeNome} com atuação em ${area?.name.toLowerCase() || "área correlata"}.`
                : `Profissionais cadastrados em ${cidadeInfo.cidadeNome}. Confirme a atuação na área antes da consulta.`}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {lawyersExibirTop.map((lawyer) => (
                <LawyerCard key={lawyer.id} lawyer={lawyer} />
              ))}
            </div>
            <p className="mt-4 text-sm">
              <Link
                href={`/advogados/${ufLower}/${cidadeInfo.citySlug}/${guia.area_slug}`}
                className="text-brand-deep hover:underline font-medium"
              >
                Ver listagem completa de {area?.name || guia.titulo}
                no diretório →
              </Link>
            </p>
          </>
        )}
      </section>

      {/* Problemas relacionados — interlink */}
      {problemasRel.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-lg font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-brand-deep" aria-hidden />
            Situações comuns nessa área
          </h2>
          <ul className="space-y-2">
            {problemasRel.map(
              (p) =>
                p && (
                  <li key={p.slug}>
                    <Link
                      href={`/problemas-juridicos/${p.slug}/em/${cidadeInfo.citySlug}-${ufLower}`}
                      className="inline-flex items-center gap-1 text-sm text-brand-deep hover:underline"
                    >
                      <ChevronRight className="w-3.5 h-3.5" aria-hidden />
                      {p.titulo} em {cidadeInfo.cidadeNome}
                    </Link>
                  </li>
                )
            )}
          </ul>
        </section>
      )}

      {/* Glossário relacionado */}
      {termosGloss.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-lg font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-deep" aria-hidden />
            Termos do glossário ligados a essa área
          </h2>
          <div className="flex flex-wrap gap-2">
            {termosGloss.map(
              (t) =>
                t && (
                  <Link
                    key={t.slug}
                    href={`/glossario/${t.slug}/em/${cidadeInfo.citySlug}-${ufLower}`}
                    className="chip text-brand-ink hover:bg-brand-deep hover:text-white hover:border-brand-deep transition text-xs"
                  >
                    {t.termo}
                  </Link>
                )
            )}
          </div>
        </section>
      )}

      {/* Jurisprudência STJ por tema */}
      {temasJuris.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-lg font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-deep" aria-hidden />
            Decisões recentes do STJ nessa área
          </h2>
          <ul className="space-y-2">
            {temasJuris.map(
              (t) =>
                t && (
                  <li key={t.slug}>
                    <Link
                      href={`/jurisprudencia/stj/tema/${t.slug}/em/${cidadeInfo.citySlug}-${ufLower}`}
                      className="inline-flex items-center gap-1 text-sm text-brand-deep hover:underline"
                    >
                      <ChevronRight className="w-3.5 h-3.5" aria-hidden />
                      {t.titulo} aplicado em {cidadeInfo.cidadeNome}
                    </Link>
                  </li>
                )
            )}
          </ul>
        </section>
      )}

      {/* FAQ */}
      {guia.faq && guia.faq.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-3">
            Perguntas frequentes em {cidadeInfo.cidadeNome}
          </h2>
          <div className="space-y-3">
            {guia.faq.slice(0, 6).map((f, i) => (
              <details
                key={i}
                className="rounded-xl border border-brand-line bg-white p-4"
              >
                <summary className="font-semibold text-brand-ink cursor-pointer">
                  {f.q}
                </summary>
                <p className="text-sm text-brand-ink/85 mt-2 leading-relaxed">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Cidades vizinhas */}
      {cidadeRegional.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-lg font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-deep" aria-hidden />
            Mesma orientação nas cidades vizinhas
          </h2>
          <div className="flex flex-wrap gap-2">
            {cidadeRegional.map((c) => (
              <Link
                key={c.slug}
                href={`/guias/${guia.slug}/em/${c.slug}-${c.uf.toLowerCase()}`}
                className="chip text-brand-ink hover:bg-brand-deep hover:text-white hover:border-brand-deep transition text-xs"
              >
                {c.nome_completo}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Voltar pro guia geral */}
      <section className="card mb-6 bg-brand-bg/30">
        <p className="text-sm text-brand-ink/85 leading-relaxed">
          Esta é a versão localizada do <strong>{guia.titulo}</strong> para{" "}
          {cidadeInfo.cidadeNome}/{cidadeInfo.uf}. Para a versão geral, com
          conteúdo aprofundado da área, acesse{" "}
          <Link
            href={`/guias/${guia.slug}`}
            className="text-brand-deep underline font-medium"
          >
            o guia completo →
          </Link>
        </p>
      </section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Guias", url: "/guias" },
          { name: guia.titulo, url: `/guias/${guia.slug}` },
          {
            name: `${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}`,
            url: `/guias/${guia.slug}/em/${params.cidade}`
          }
        ])}
      />
    </div>
  );
}
