import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Scale,
  ChevronRight,
  AlertCircle,
  BookOpen,
  HelpCircle
} from "lucide-react";
import { TEMAS_STJ, findTemaStj, relatedTemasStj } from "@/lib/data/jurisprudencia-temas";
import { findGlossarioTermo } from "@/lib/data/glossario";
import { findProblema } from "@/lib/data/problemas-juridicos";
import { findGuiaByArea } from "@/lib/data/guias";
import { searchDecisoes } from "@/lib/data/jurisprudencia";
import { OfficialSourceBox } from "@/components/jurisprudencia/OfficialSourceBox";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";

/**
 * Hub temático de jurisprudência STJ — /jurisprudencia/stj/tema/[slug]
 *
 * Pega o tema do catálogo (jurisprudencia-temas.ts), busca decisões reais
 * no banco usando textSearch com a primeira keyword e exibe.
 *
 * Defesa em profundidade: se menos de 3 decisões publicadas, marca noindex
 * para evitar conteúdo fino indexável.
 */

export const revalidate = 3600;
export const dynamicParams = false;

const MIN_DECISOES_INDEXAVEIS = 3;

export function generateStaticParams() {
  return TEMAS_STJ.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}) {
  const tema = findTemaStj(params.slug);
  if (!tema) {
    return buildMetadata({
      title: "Tema não encontrado",
      description: "Tema não encontrado.",
      noIndex: true
    });
  }
  // Conta decisões para decidir noindex
  const { items } = await searchDecisoes({
    tribunal: "STJ",
    q: tema.keywords[0],
    limit: 20
  });
  const noIndex = items.length < MIN_DECISOES_INDEXAVEIS;
  return buildMetadata({
    title: `Jurisprudência STJ — ${tema.titulo}`,
    description: tema.descricao,
    path: `/jurisprudencia/stj/tema/${tema.slug}`,
    noIndex
  });
}

export default async function TemaStjPage({
  params
}: {
  params: { slug: string };
}) {
  const tema = findTemaStj(params.slug);
  if (!tema) notFound();

  // Buscar decisões reais usando textSearch contra a primeira keyword.
  // Mais conservador que múltiplas keywords (evita falsos positivos).
  const { items: decisoes } = await searchDecisoes({
    tribunal: "STJ",
    q: tema.keywords[0],
    limit: 20
  });

  const indexavel = decisoes.length >= MIN_DECISOES_INDEXAVEIS;

  const relacionados = relatedTemasStj(tema.slug, 5);
  const glossario = tema.glossario ? findGlossarioTermo(tema.glossario) : null;
  const problema = tema.problema ? findProblema(tema.problema) : null;
  const guiaArea = tema.areas[0] ? findGuiaByArea(tema.areas[0]) : null;

  return (
    <div className="container-narrow py-10">
      <Breadcrumb
        items={[
          { label: "Jurisprudência", href: "/jurisprudencia" },
          { label: "STJ", href: "/jurisprudencia/stj" },
          { label: tema.titulo }
        ]}
      />

      <header className="card mb-6">
        <div className="flex items-start gap-3 mb-2">
          <Scale className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              Jurisprudência STJ — {tema.titulo}
            </h1>
            <p className="text-sm text-brand-ink/55 mt-1">
              Superior Tribunal de Justiça
            </p>
            <div className="text-sm md:text-base text-brand-ink/85 mt-3 leading-relaxed space-y-2">
              {tema.intro.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
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
              Ainda estamos reunindo decisões suficientes deste tema. Em breve
              haverá um conjunto maior aqui. Enquanto isso, vale ver outros
              temas relacionados ou pesquisar diretamente no{" "}
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
                if (e.length <= 600) return { text: e, truncated: false };
                const cut = e.slice(0, 600);
                const lastDot = cut.lastIndexOf(". ");
                const trim = lastDot > 350 ? cut.slice(0, lastDot + 1) : cut;
                return { text: trim, truncated: true };
              })();
              const dataPubFmt = d.data_publicacao
                ? new Date(d.data_publicacao).toLocaleDateString("pt-BR")
                : null;
              const detalheUrl = `/jurisprudencia/${d.tribunal.toLowerCase()}/${d.slug}`;
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
                          Publicado em {dataPubFmt}
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
                    {d.relator && (
                      <p className="text-xs text-brand-ink/55 mt-2">
                        Relator: <span className="text-brand-ink/80">{d.relator}</span>
                      </p>
                    )}
                    <div className="pt-3 mt-3 border-t border-brand-line flex flex-wrap items-center justify-between gap-2">
                      <OfficialSourceBox
                        source_portal={d.source_portal}
                        dataset_url={d.dataset_url}
                        tribunal={d.tribunal}
                        variant="compact"
                      />
                      <Link
                        href={detalheUrl}
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

      {/* Recursos relacionados */}
      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-3">
          Conteúdo relacionado
        </h2>

        {problema && (
          <Link
            href={`/problemas-juridicos/${problema.slug}`}
            className="block group mb-2 rounded-xl border border-brand-line p-4 hover:border-brand-deep/40 hover:shadow-card transition"
          >
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
              <div className="flex-1">
                <p className="text-xs text-brand-ink/55 font-semibold uppercase tracking-wide">
                  Problema jurídico relacionado
                </p>
                <p className="text-sm md:text-base font-semibold text-brand-ink group-hover:text-brand-deep transition mt-0.5">
                  {problema.titulo}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-brand-ink/30 group-hover:text-brand-deep flex-shrink-0 mt-1" aria-hidden />
            </div>
          </Link>
        )}

        {glossario && (
          <Link
            href={`/glossario/${glossario.slug}`}
            className="block group mb-2 rounded-xl border border-brand-line p-4 hover:border-brand-deep/40 hover:shadow-card transition"
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
                <p className="text-sm text-brand-ink/70 mt-1 leading-relaxed">
                  {glossario.definicao_curta}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-brand-ink/30 group-hover:text-brand-deep flex-shrink-0 mt-1" aria-hidden />
            </div>
          </Link>
        )}

        {guiaArea && (
          <Link
            href={`/guias/${guiaArea.slug}`}
            className="block group rounded-xl border border-brand-line p-4 hover:border-brand-deep/40 hover:shadow-card transition"
          >
            <div className="flex items-start gap-3">
              <Scale className="w-5 h-5 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
              <div className="flex-1">
                <p className="text-xs text-brand-ink/55 font-semibold uppercase tracking-wide">
                  Guia da área
                </p>
                <p className="text-sm md:text-base font-semibold text-brand-ink group-hover:text-brand-deep transition mt-0.5">
                  {guiaArea.titulo}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-brand-ink/30 group-hover:text-brand-deep flex-shrink-0 mt-1" aria-hidden />
            </div>
          </Link>
        )}
      </section>

      {/* Outros temas */}
      {relacionados.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-3">
            Outros temas no STJ
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {relacionados.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/jurisprudencia/stj/tema/${r.slug}`}
                  className="block group rounded-lg border border-brand-line p-3 hover:border-brand-deep/40 hover:bg-brand-bg/30 transition"
                >
                  <p className="font-semibold text-sm text-brand-ink group-hover:text-brand-deep transition">
                    {r.titulo}
                  </p>
                  <p className="text-xs text-brand-ink/65 mt-0.5 leading-snug">
                    {r.descricao}
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
          Conteúdo extraído de fontes públicas do STJ via Portal de Dados
          Abertos. Para fins oficiais, consulte sempre a fonte original. O
          AdvAqui não é órgão público nem substitui consulta jurídica.
        </span>
      </aside>

      <p className="text-sm text-brand-ink/65">
        <Link href="/jurisprudencia/stj" className="text-brand-deep hover:underline">
          ← Voltar à página do STJ
        </Link>
      </p>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Jurisprudência", url: "/jurisprudencia" },
          { name: "STJ", url: "/jurisprudencia/stj" },
          { name: tema.titulo, url: `/jurisprudencia/stj/tema/${tema.slug}` }
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `Jurisprudência STJ — ${tema.titulo}`,
          description: tema.descricao,
          url: `${SITE.url}/jurisprudencia/stj/tema/${tema.slug}`,
          inLanguage: "pt-BR",
          isPartOf: { "@type": "WebSite", url: SITE.url, name: SITE.name }
        }}
      />
    </div>
  );
}
