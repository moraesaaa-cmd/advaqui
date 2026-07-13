import Link from "next/link";
import { notFound } from "next/navigation";
import { Scale, ChevronRight, MapPin } from "lucide-react";
import { TEMAS_STF, findTemaStf, relatedTemasStf } from "@/lib/data/jurisprudencia-temas-stf";
import { getCidadesPrioritarias } from "@/lib/data/cidades-prioritarias";
import { searchDecisoes } from "@/lib/data/jurisprudencia";
import { OfficialSourceBox } from "@/components/jurisprudencia/OfficialSourceBox";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { fitDescription } from "@/lib/seo/local-titles";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const revalidate = 86400;

const MIN_DECISOES = 3;

export function generateStaticParams() {
  return TEMAS_STF.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}) {
  const tema = findTemaStf(params.slug);
  if (!tema) {
    return buildMetadata({
      title: "Tema não encontrado",
      description: "Tema não encontrado",
      noIndex: true
    });
  }
  const { items } = await searchDecisoes({
    tribunal: "STF",
    q: tema.keywords[0],
    limit: 20
  });
  return buildMetadata({
    title: `Jurisprudência STF — ${tema.titulo}`,
    description: fitDescription(tema.descricao, 158),
    path: `/jurisprudencia/stf/tema/${tema.slug}`,
    noIndex: items.length < MIN_DECISOES
  });
}

export default async function TemaStfPage({
  params
}: {
  params: { slug: string };
}) {
  const tema = findTemaStf(params.slug);
  if (!tema) notFound();

  const { items: decisoes } = await searchDecisoes({
    tribunal: "STF",
    q: tema.keywords[0],
    limit: 12
  });
  const indexavel = decisoes.length >= MIN_DECISOES;
  const relacionados = relatedTemasStf(tema.slug, 5);
  const cidadesPrior = getCidadesPrioritarias().slice(0, 12);

  return (
    <div className="container-narrow py-10">
      <Breadcrumb
        items={[
          { label: "Jurisprudência", href: "/jurisprudencia" },
          { label: "STF", href: "/jurisprudencia/stf" },
          { label: tema.titulo }
        ]}
      />

      <header className="card mb-6">
        <div className="flex items-start gap-3 mb-2">
          <Scale className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              Jurisprudência STF — {tema.titulo}
            </h1>
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
          </div>
        </div>
      </header>

      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-3">
          Decisões reais sobre {tema.titulo.toLowerCase()}
        </h2>
        {!indexavel ? (
          <p className="rounded-xl bg-brand-bg/40 border border-brand-line p-4 text-sm text-brand-ink/80 leading-relaxed">
            Ainda não há base suficiente no AdvAqui. Pesquise direto no{" "}
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
        ) : (
          <ul className="space-y-4">
            {decisoes.map((d) => (
              <li key={d.id}>
                <article className="rounded-xl border border-brand-line bg-white p-5">
                  <header className="flex flex-wrap items-center gap-2 mb-2 text-xs">
                    {d.classe && (
                      <span className="font-semibold text-brand-deep">{d.classe}</span>
                    )}
                    <span className="text-brand-ink/55">·</span>
                    <span className="text-brand-ink/70 font-mono">{d.numero}</span>
                  </header>
                  {d.resumo_tema && (
                    <p className="text-sm text-brand-deep font-semibold leading-snug mb-2">
                      {d.resumo_tema}
                    </p>
                  )}
                  <p className="text-sm text-brand-ink/85 leading-relaxed">
                    {(d.ementa || "").slice(0, 500)}
                    {(d.ementa || "").length > 500 ? "…" : ""}
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
            ))}
          </ul>
        )}
      </section>

      {/* Por cidade — interlinking pras versões hiperlocais */}
      <section className="card mb-6">
        <h2 className="font-display text-lg font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
          <MapPin className="w-5 h-5 text-brand-deep" aria-hidden />
          {tema.titulo} STF nas principais cidades
        </h2>
        <div className="flex flex-wrap gap-2">
          {cidadesPrior.map((c) => (
            <Link
              key={`${c.uf}-${c.slug}`}
              href={`/jurisprudencia/stf/tema/${tema.slug}/em/${c.slug}-${c.uf.toLowerCase()}`}
              className="chip text-brand-ink hover:bg-brand-deep hover:text-white hover:border-brand-deep transition text-xs"
            >
              {c.nome_completo}
            </Link>
          ))}
        </div>
      </section>

      {/* Temas relacionados */}
      {relacionados.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-lg font-bold text-brand-ink mb-3">
            Temas STF relacionados
          </h2>
          <ul className="space-y-2">
            {relacionados.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/jurisprudencia/stf/tema/${r.slug}`}
                  className="inline-flex items-center gap-1 text-sm text-brand-deep hover:underline"
                >
                  <ChevronRight className="w-3.5 h-3.5" aria-hidden />
                  {r.titulo}
                </Link>
              </li>
            ))}
          </ul>
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
          }
        ])}
      />
    </div>
  );
}
