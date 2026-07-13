import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Scale,
  ChevronRight,
  AlertCircle,
  MapPin,
  HelpCircle,
  BookOpen,
  Compass
} from "lucide-react";
import { TEMAS_STJ, findTemaStj } from "@/lib/data/jurisprudencia-temas";
import { findCity } from "@/lib/data/cities";
import { getCidadesPrioritarias, getCidadesSSG, cidadesPrioritariasMesmaRegiao } from "@/lib/data/cidades-prioritarias";
import { findGuiaByArea } from "@/lib/data/guias";
import { findProblema } from "@/lib/data/problemas-juridicos";
import { findGlossarioTermo } from "@/lib/data/glossario";
import { searchDecisoes } from "@/lib/data/jurisprudencia";
import { OfficialSourceBox } from "@/components/jurisprudencia/OfficialSourceBox";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { fitDescription } from "@/lib/seo/local-titles";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";

/**
 * /jurisprudencia/stj/tema/[slug]/em/[cidade-uf] — jurisprudência local.
 *
 * 15 temas × 5571 cidades IBGE = 83.565 URLs cauda longa.
 *
 * Defesa: noindex se < 3 decisões reais (mesma regra do tema sem cidade).
 *
 * Híbrido SSG + ISR:
 *  - SSG nas 50 cidades prioritárias × 15 temas (750 pré-geradas)
 *  - ISR nas demais 5521 × 15 — geradas sob demanda
 */

// force-dynamic: renderiza sob demanda SEM gravar em disco — impede o disco de
// reencher conforme o Google rastreia milhares de cidades. URL funciona normal.
export const dynamic = "force-dynamic";

const MIN_DECISOES_INDEXAVEIS = 3;

export function generateStaticParams() {
  const cidades = getCidadesSSG();
  const params: Array<{ slug: string; cidade: string }> = [];
  for (const t of TEMAS_STJ) {
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
  const tema = findTemaStj(params.slug);
  const cidadeInfo = parseCidadeParam(params.cidade);
  if (!tema || !cidadeInfo) {
    return buildMetadata({
      title: "Página não encontrada",
      description: "Página não encontrada",
      noIndex: true
    });
  }
  const { items } = await searchDecisoes({
    tribunal: "STJ",
    q: tema.keywords[0],
    limit: 20
  });
  const noIndex = items.length < MIN_DECISOES_INDEXAVEIS;
  return buildMetadata({
    title: `Jurisprudência STJ — ${tema.titulo} em ${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}`,
    description: fitDescription(
      `${tema.descricao} Aplicação prática em ${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}.`,
      158
    ),
    path: `/jurisprudencia/stj/tema/${tema.slug}/em/${params.cidade}`,
    noIndex
  });
}

export default async function TemaCidadePage({
  params
}: {
  params: { slug: string; cidade: string };
}) {
  const tema = findTemaStj(params.slug);
  const cidadeInfo = parseCidadeParam(params.cidade);
  if (!tema || !cidadeInfo) notFound();

  const { items: decisoes } = await searchDecisoes({
    tribunal: "STJ",
    q: tema.keywords[0],
    limit: 12
  });
  const indexavel = decisoes.length >= MIN_DECISOES_INDEXAVEIS;

  const ufLower = cidadeInfo.uf.toLowerCase();
  const guia = tema.areas[0] ? findGuiaByArea(tema.areas[0]) : null;
  const problema = tema.problema ? findProblema(tema.problema) : null;
  const glossario = tema.glossario ? findGlossarioTermo(tema.glossario) : null;
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
          { label: "STJ", href: "/jurisprudencia/stj" },
          { label: tema.titulo, href: `/jurisprudencia/stj/tema/${tema.slug}` },
          { label: `${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}` }
        ]}
      />

      <header className="card mb-6">
        <div className="flex items-start gap-3 mb-2">
          <Scale className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              Jurisprudência STJ — {tema.titulo} em {cidadeInfo.cidadeNome}, {cidadeInfo.uf}
            </h1>
            <p className="text-sm text-brand-ink/55 mt-1 inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" aria-hidden />
              {cidadeInfo.cidadeNome} · {cidadeInfo.uf}
            </p>
            <p className="text-sm md:text-base text-brand-ink/85 mt-3 leading-relaxed">
              {tema.descricao}
            </p>
            <p className="text-sm md:text-base text-brand-ink/85 mt-2 leading-relaxed">
              As decisões abaixo são do Superior Tribunal de Justiça e orientam
              a aplicação em todo o Brasil. A jurisprudência local em{" "}
              {cidadeInfo.cidadeNome}/{cidadeInfo.uf} costuma seguir o
              entendimento do STJ, com particularidades processuais conhecidas
              pelos advogados que atuam no foro local.
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
              Ainda não há base suficiente de decisões publicadas para este
              tema. Visite o{" "}
              <Link
                href={`/jurisprudencia/stj/tema/${tema.slug}`}
                className="text-brand-deep underline"
              >
                tema geral
              </Link>{" "}
              ou pesquise no{" "}
              <a
                href="https://www.stj.jus.br/sites/portalp/Paginas/Sob-medida/Advogado/Jurisprudencia/Pesquisa-de-Jurisprudencia.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-deep underline"
              >
                site oficial do STJ
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
                      <span className="text-brand-ink/70 font-mono">{d.numero}</span>
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

        {tema.areas[0] && (
          <Link
            href={`/advogados-de/${tema.areas[0]}/em/${params.cidade}`}
            className="block group mb-2 rounded-xl border border-brand-line p-4 hover:border-brand-deep/40 hover:shadow-card transition"
          >
            <div className="flex items-start gap-3">
              <Scale className="w-5 h-5 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
              <div className="flex-1">
                <p className="text-xs text-brand-ink/55 font-semibold uppercase tracking-wide">
                  Advogados da área em {cidadeInfo.cidadeNome}
                </p>
                <p className="text-sm md:text-base font-semibold text-brand-ink group-hover:text-brand-deep transition mt-0.5">
                  Advogado da área em {cidadeInfo.cidadeNome}, {cidadeInfo.uf}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-brand-ink/30 group-hover:text-brand-deep flex-shrink-0 mt-1" aria-hidden />
            </div>
          </Link>
        )}

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
              </div>
              <ChevronRight className="w-5 h-5 text-brand-ink/30 group-hover:text-brand-deep flex-shrink-0 mt-1" aria-hidden />
            </div>
          </Link>
        )}

        {glossario && (
          <Link
            href={`/glossario/${glossario.slug}`}
            className="block group rounded-xl border border-brand-line p-4 hover:border-brand-deep/40 hover:shadow-card transition"
          >
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
              <div className="flex-1">
                <p className="text-xs text-brand-ink/55 font-semibold uppercase tracking-wide">
                  Glossário
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

      {/* Vizinhas */}
      {vizinhas.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-3">
            Mesma jurisprudência em cidades próximas
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {vizinhas.map((v) => (
              <li key={`${v.uf}-${v.slug}`}>
                <Link
                  href={`/jurisprudencia/stj/tema/${tema.slug}/em/${v.slug}-${v.uf.toLowerCase()}`}
                  className="block group rounded-lg border border-brand-line p-3 hover:border-brand-deep/40 hover:bg-brand-bg/30 transition"
                >
                  <p className="font-semibold text-sm text-brand-ink group-hover:text-brand-deep transition">
                    {v.nome_completo}
                  </p>
                  <p className="text-xs text-brand-ink/65 mt-0.5 leading-snug">
                    {v.regiao}
                  </p>
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
          Conteúdo extraído de fontes públicas do STJ. Para fins oficiais,
          consulte sempre a fonte original. O AdvAqui não é órgão público nem
          substitui consulta jurídica em {cidadeInfo.cidadeNome}/{cidadeInfo.uf}.
        </span>
      </aside>

      <p className="text-sm text-brand-ink/65">
        <Link
          href={`/jurisprudencia/stj/tema/${tema.slug}`}
          className="text-brand-deep hover:underline"
        >
          ← Voltar ao tema geral
        </Link>{" "}
        ·{" "}
        <Link
          href={`/advogados/${ufLower}/${cidadeInfo.citySlug}`}
          className="text-brand-deep hover:underline"
        >
          Advogados em {cidadeInfo.cidadeNome}
        </Link>
      </p>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Jurisprudência", url: "/jurisprudencia" },
          { name: "STJ", url: "/jurisprudencia/stj" },
          { name: tema.titulo, url: `/jurisprudencia/stj/tema/${tema.slug}` },
          {
            name: `${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}`,
            url: `/jurisprudencia/stj/tema/${tema.slug}/em/${params.cidade}`
          }
        ])}
      />
      {indexavel && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `Jurisprudência STJ — ${tema.titulo} em ${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}`,
            description: tema.descricao,
            url: `${SITE.url}/jurisprudencia/stj/tema/${tema.slug}/em/${params.cidade}`,
            inLanguage: "pt-BR",
            spatialCoverage: {
              "@type": "Place",
              name: `${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}`,
              address: {
                "@type": "PostalAddress",
                addressLocality: cidadeInfo.cidadeNome,
                addressRegion: cidadeInfo.uf,
                addressCountry: "BR"
              }
            },
            isPartOf: { "@type": "WebSite", url: SITE.url, name: SITE.name }
          }}
        />
      )}
    </div>
  );
}
