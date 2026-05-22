import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Scale,
  ChevronRight,
  MapPin,
  HelpCircle,
  BookOpen,
  Compass
} from "lucide-react";
import { TEMAS_STF, findTemaStf } from "@/lib/data/jurisprudencia-temas-stf";
import { findCity } from "@/lib/data/cities";
import {
  getCidadesPrioritarias,
  cidadesPrioritariasMesmaRegiao
} from "@/lib/data/cidades-prioritarias";
import { findGuiaByArea } from "@/lib/data/guias";
import { findProblema } from "@/lib/data/problemas-juridicos";
import { findGlossarioTermo } from "@/lib/data/glossario";
import { findTemaStj } from "@/lib/data/jurisprudencia-temas";
import { searchDecisoes } from "@/lib/data/jurisprudencia";
import { OfficialSourceBox } from "@/components/jurisprudencia/OfficialSourceBox";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

/**
 * /jurisprudencia/stf/tema/[slug]/em/[cidade-uf] — jurisprudência STF local.
 *
 * 10 temas STF × 5571 cidades IBGE = 55.710 URLs cauda longa.
 *
 * Defesa em profundidade — noindex se menos de 3 decisões reais STF no banco.
 *
 * Híbrido SSG + ISR:
 *  - SSG nas 50 cidades prioritárias × 10 temas (500 pré-geradas)
 *  - ISR nas demais — geradas sob demanda
 */

export const revalidate = 86400;
export const dynamicParams = true;

const MIN_DECISOES_INDEXAVEIS = 3;

export function generateStaticParams() {
  const cidades = getCidadesPrioritarias();
  const params: Array<{ slug: string; cidade: string }> = [];
  for (const t of TEMAS_STF) {
    for (const c of cidades) {
      params.push({
        slug: t.slug,
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
  const tema = findTemaStf(params.slug);
  const cidadeInfo = parseCidadeParam(params.cidade);
  if (!tema || !cidadeInfo) {
    return buildMetadata({
      title: "Página não encontrada",
      description: "Página não encontrada",
      noIndex: true
    });
  }
  const { items } = await searchDecisoes({
    tribunal: "STF",
    q: tema.keywords[0],
    limit: 20
  });
  const noIndex = items.length < MIN_DECISOES_INDEXAVEIS;
  return buildMetadata({
    title: `Jurisprudência STF — ${tema.titulo} em ${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}`,
    description: `${tema.descricao} Aplicação prática em ${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}.`.slice(
      0,
      160
    ),
    path: `/jurisprudencia/stf/tema/${tema.slug}/em/${params.cidade}`,
    noIndex
  });
}

export default async function TemaStfCidadePage({
  params
}: {
  params: { slug: string; cidade: string };
}) {
  const tema = findTemaStf(params.slug);
  const cidadeInfo = parseCidadeParam(params.cidade);
  if (!tema || !cidadeInfo) notFound();

  const { items: decisoes } = await searchDecisoes({
    tribunal: "STF",
    q: tema.keywords[0],
    limit: 12
  });
  const indexavel = decisoes.length >= MIN_DECISOES_INDEXAVEIS;

  const ufLower = cidadeInfo.uf.toLowerCase();
  const guia = tema.areas[0] ? findGuiaByArea(tema.areas[0]) : null;
  const problema = tema.problema ? findProblema(tema.problema) : null;
  const glossario = tema.glossario ? findGlossarioTermo(tema.glossario) : null;
  const temaStj = tema.tema_stj ? findTemaStj(tema.tema_stj) : null;
  const vizinhas = cidadesPrioritariasMesmaRegiao(
    cidadeInfo.uf,
    cidadeInfo.citySlug,
    6
  );

  return (
    <div className="container-narrow py-10">
      <Breadcrumb
        items={[
          { label: "Jurisprudência", href: "/jurisprudencia" },
          { label: "STF", href: "/jurisprudencia/stf" },
          { label: tema.titulo },
          { label: `${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}` }
        ]}
      />

      <header className="card mb-6">
        <div className="flex items-start gap-3 mb-2">
          <Scale className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              Jurisprudência STF — {tema.titulo} em {cidadeInfo.cidadeNome},{" "}
              {cidadeInfo.uf}
            </h1>
            <p className="text-sm text-brand-ink/55 mt-1 inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" aria-hidden />
              {cidadeInfo.cidadeNome} · {cidadeInfo.uf}
            </p>
            <p className="text-sm md:text-base text-brand-ink/85 mt-3 leading-relaxed">
              {tema.descricao}
            </p>
            {tema.intro.map((p, i) => (
              <p
                key={i}
                className="text-sm md:text-base text-brand-ink/85 mt-2 leading-relaxed"
              >
                {p}
              </p>
            ))}
            <p className="text-sm md:text-base text-brand-ink/85 mt-2 leading-relaxed">
              A jurisprudência do STF aplica-se em todo o Brasil, com força
              vinculante quando há repercussão geral reconhecida ou súmula
              vinculante. Em {cidadeInfo.cidadeNome}/{cidadeInfo.uf}, os
              tribunais locais seguem o entendimento da Corte Constitucional,
              com particularidades processuais conhecidas pelos advogados que
              atuam no foro.
            </p>
          </div>
        </div>
      </header>

      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-3">
          Decisões reais sobre {tema.titulo.toLowerCase()}
        </h2>
        {!indexavel ? (
          <div className="rounded-xl bg-brand-bg/40 border border-brand-line p-4 text-sm text-brand-ink/80 leading-relaxed">
            <p>
              Ainda não há base suficiente de decisões publicadas no AdvAqui
              para este tema. Pesquise direto no{" "}
              <a
                href="https://jurisprudencia.stf.jus.br/pages/search?base=acordaos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-deep underline"
              >
                Portal de Jurisprudência do STF
              </a>
              .
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {decisoes.map((d) => {
              const ementaParcial = (() => {
                const e = (d.ementa || "").trim();
                if (e.length <= 500) return { text: e, truncated: false };
                const cut = e.slice(0, 500);
                const lastDot = cut.lastIndexOf(". ");
                const trim = lastDot > 300 ? cut.slice(0, lastDot + 1) : cut;
                return { text: trim, truncated: true };
              })();
              const dataPubFmt = d.data_publicacao
                ? new Date(d.data_publicacao).toLocaleDateString("pt-BR")
                : null;
              return (
                <li key={d.id}>
                  <article className="rounded-xl border border-brand-line bg-white p-5 hover:border-brand-deep/40 hover:shadow-card transition">
                    <header className="flex flex-wrap items-center gap-2 mb-2 text-xs">
                      {d.classe && (
                        <span className="font-semibold text-brand-deep">
                          {d.classe}
                        </span>
                      )}
                      <span className="text-brand-ink/55">·</span>
                      <span className="text-brand-ink/70 font-mono">
                        {d.numero}
                      </span>
                      {dataPubFmt && (
                        <span className="ml-auto text-brand-ink/45">
                          {dataPubFmt}
                        </span>
                      )}
                    </header>
                    {d.resumo_tema && (
                      <p className="text-sm text-brand-deep font-semibold leading-snug mb-2">
                        {d.resumo_tema}
                      </p>
                    )}
                    <p className="text-sm text-brand-ink/85 leading-relaxed">
                      {ementaParcial.text}
                      {ementaParcial.truncated && (
                        <span className="text-brand-ink/45"> …</span>
                      )}
                    </p>
                    <div className="pt-3 mt-3 border-t border-brand-line flex flex-wrap items-center justify-between gap-2">
                      <OfficialSourceBox
                        source_portal={d.source_portal}
                        dataset_url={d.dataset_url}
                        tribunal={d.tribunal}
                        variant="compact"
                      />
                      <Link
                        href={`/jurisprudencia/${d.tribunal.toLowerCase()}/${d.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand-deep text-white hover:bg-brand-deep/90 transition"
                      >
                        Ver decisão
                        <ChevronRight className="w-3.5 h-3.5" aria-hidden />
                      </Link>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Cross-links */}
      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-3">
          Continue se informando em {cidadeInfo.cidadeNome}
        </h2>

        {temaStj && (
          <Link
            href={`/jurisprudencia/stj/tema/${temaStj.slug}/em/${params.cidade}`}
            className="block group mb-2 rounded-xl border border-brand-line p-4 hover:border-brand-deep/40 hover:shadow-card transition"
          >
            <div className="flex items-start gap-3">
              <Scale className="w-5 h-5 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
              <div className="flex-1">
                <p className="text-xs text-brand-ink/55 font-semibold uppercase tracking-wide">
                  Mesmo tema no STJ
                </p>
                <p className="text-sm md:text-base font-semibold text-brand-ink group-hover:text-brand-deep transition mt-0.5">
                  Jurisprudência STJ — {temaStj.titulo} em {cidadeInfo.cidadeNome}
                </p>
              </div>
              <ChevronRight
                className="w-5 h-5 text-brand-ink/30 group-hover:text-brand-deep flex-shrink-0 mt-1"
                aria-hidden
              />
            </div>
          </Link>
        )}

        {problema && (
          <Link
            href={`/problemas-juridicos/${problema.slug}/em/${params.cidade}`}
            className="block group mb-2 rounded-xl border border-brand-line p-4 hover:border-brand-deep/40 hover:shadow-card transition"
          >
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
              <div className="flex-1">
                <p className="text-xs text-brand-ink/55 font-semibold uppercase tracking-wide">
                  Problema relacionado em {cidadeInfo.cidadeNome}
                </p>
                <p className="text-sm md:text-base font-semibold text-brand-ink group-hover:text-brand-deep transition mt-0.5">
                  {problema.titulo}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-brand-ink/30 group-hover:text-brand-deep flex-shrink-0 mt-1" aria-hidden />
            </div>
          </Link>
        )}

        {guia && (
          <Link
            href={`/guias/${guia.slug}/em/${params.cidade}`}
            className="block group mb-2 rounded-xl border border-brand-line p-4 hover:border-brand-deep/40 hover:shadow-card transition"
          >
            <div className="flex items-start gap-3">
              <Compass className="w-5 h-5 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
              <div className="flex-1">
                <p className="text-xs text-brand-ink/55 font-semibold uppercase tracking-wide">
                  Guia da área em {cidadeInfo.cidadeNome}
                </p>
                <p className="text-sm md:text-base font-semibold text-brand-ink group-hover:text-brand-deep transition mt-0.5">
                  {guia.titulo}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-brand-ink/30 group-hover:text-brand-deep flex-shrink-0 mt-1" aria-hidden />
            </div>
          </Link>
        )}

        {glossario && (
          <Link
            href={`/glossario/${glossario.slug}/em/${params.cidade}`}
            className="block group mb-2 rounded-xl border border-brand-line p-4 hover:border-brand-deep/40 hover:shadow-card transition"
          >
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
              <div className="flex-1">
                <p className="text-xs text-brand-ink/55 font-semibold uppercase tracking-wide">
                  Termo do glossário
                </p>
                <p className="text-sm md:text-base font-semibold text-brand-ink group-hover:text-brand-deep transition mt-0.5">
                  {glossario.termo}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-brand-ink/30 group-hover:text-brand-deep flex-shrink-0 mt-1" aria-hidden />
            </div>
          </Link>
        )}
      </section>

      {/* Cidades vizinhas */}
      {vizinhas.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-lg font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-deep" aria-hidden />
            {tema.titulo} STF nas cidades vizinhas
          </h2>
          <div className="flex flex-wrap gap-2">
            {vizinhas.map((c) => (
              <Link
                key={c.slug}
                href={`/jurisprudencia/stf/tema/${tema.slug}/em/${c.slug}-${c.uf.toLowerCase()}`}
                className="chip text-brand-ink hover:bg-brand-deep hover:text-white hover:border-brand-deep transition text-xs"
              >
                {c.nome_completo}
              </Link>
            ))}
          </div>
        </section>
      )}

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Jurisprudência", url: "/jurisprudencia" },
          { name: "STF", url: "/jurisprudencia/stf" },
          {
            name: tema.titulo,
            url: `/jurisprudencia/stf/tema/${tema.slug}`
          },
          {
            name: `${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}`,
            url: `/jurisprudencia/stf/tema/${tema.slug}/em/${params.cidade}`
          }
        ])}
      />
    </div>
  );
}
