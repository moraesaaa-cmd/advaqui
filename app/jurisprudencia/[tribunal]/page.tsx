import Link from "next/link";
import { notFound } from "next/navigation";
import { Scale, AlertCircle, BookOpen, ChevronRight, Layers } from "lucide-react";
import { getRecentByTribunal } from "@/lib/data/jurisprudencia";
import type { Tribunal } from "@/lib/data/jurisprudencia";
import { TEMAS_STJ } from "@/lib/data/jurisprudencia-temas";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { OfficialSourceBox } from "@/components/jurisprudencia/OfficialSourceBox";

/**
 * /jurisprudencia/[tribunal] — Página fixa por tribunal (STF ou STJ).
 *
 * SSG com revalidate 1h. Quando não houver decisões reais, mostra estado
 * vazio honesto. Quando houver, lista as 12 mais recentes (já filtradas
 * defensivamente em lib/data/jurisprudencia — sem AMOSTRA/fixture).
 */

export const revalidate = 3600;

const VALID_TRIBUNALS = ["stf", "stj"] as const;
type TribunalSlug = (typeof VALID_TRIBUNALS)[number];

const TRIBUNAL_META: Record<
  TribunalSlug,
  { name: string; fullName: string; intro: string; fonte: string }
> = {
  stf: {
    name: "STF",
    fullName: "Supremo Tribunal Federal",
    intro:
      "O Supremo Tribunal Federal (STF) é o órgão de cúpula do Poder Judiciário brasileiro, responsável pela guarda da Constituição Federal. Pesquise decisões recentes, teses fixadas em repercussão geral e ementas de habeas corpus, recursos extraordinários e ações constitucionais.",
    fonte: "https://portal.stf.jus.br/jurisprudencia/",
  },
  stj: {
    name: "STJ",
    fullName: "Superior Tribunal de Justiça",
    intro:
      "O Superior Tribunal de Justiça (STJ) é responsável pela uniformização da interpretação da lei federal brasileira. Pesquise decisões recentes, súmulas, teses repetitivas e ementas de recursos especiais, agravos e habeas corpus.",
    fonte: "https://scon.stj.jus.br/SCON/",
  },
};

const EMPTY_STATE_TEXT =
  "O módulo de jurisprudência do AdvAqui está sendo preparado para exibir decisões extraídas de fontes oficiais. Em breve, você poderá pesquisar decisões do STF e STJ por tema, classe, relator, número do processo e palavras da ementa.";

export function generateStaticParams() {
  return VALID_TRIBUNALS.map((t) => ({ tribunal: t }));
}

export async function generateMetadata({
  params,
}: {
  params: { tribunal: string };
}) {
  const slug = params.tribunal.toLowerCase() as TribunalSlug;
  // notFound() no generateMetadata = status 404 real (no corpo o throw chega
  // depois do primeiro flush e a resposta sai 200 — soft-404).
  if (!VALID_TRIBUNALS.includes(slug)) notFound();
  const meta = TRIBUNAL_META[slug];
  return buildMetadata({
    title: `Jurisprudência do ${meta.name} — Decisões e ementas`,
    description: `Pesquise decisões e ementas do ${meta.name} no AdvAqui, com filtros por tema, classe, relator e data, sempre com link para a fonte oficial.`,
    path: `/jurisprudencia/${slug}`,
  });
}

const FAQS_BY_TRIBUNAL: Record<TribunalSlug, Array<{ q: string; a: string }>> = {
  stf: [
    {
      q: "O que é o STF?",
      a: "É o órgão de cúpula do Poder Judiciário brasileiro, responsável pela guarda da Constituição Federal e por julgar matérias constitucionais relevantes.",
    },
    {
      q: "O que é repercussão geral?",
      a: "É o filtro de relevância aplicado aos recursos extraordinários. Quando o STF reconhece repercussão geral, a tese fixada vincula todos os tribunais inferiores.",
    },
  ],
  stj: [
    {
      q: "O que é o STJ?",
      a: "É o tribunal responsável pela uniformização da interpretação da lei federal brasileira, julgando recursos especiais e ações originárias previstas na Constituição.",
    },
    {
      q: "O que são recursos repetitivos?",
      a: "São casos em que o STJ fixa tese a ser aplicada a todos os processos com a mesma controvérsia, agilizando o julgamento e dando segurança jurídica.",
    },
  ],
};

export default async function TribunalPage({
  params,
}: {
  params: { tribunal: string };
}) {
  const slug = params.tribunal.toLowerCase() as TribunalSlug;
  if (!VALID_TRIBUNALS.includes(slug)) notFound();

  const meta = TRIBUNAL_META[slug];
  const tribunal = meta.name as Tribunal;
  const recentes = await getRecentByTribunal(tribunal, 12);

  return (
    <div className="container-narrow py-10">
      <Breadcrumb
        items={[
          { label: "Início", href: "/" },
          { label: "Jurisprudência", href: "/jurisprudencia" },
          { label: meta.name },
        ]}
      />

      <header className="card mb-6">
        <div className="flex items-start gap-3 mb-2">
          <Scale
            className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1"
            aria-hidden
          />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              Jurisprudência do {meta.name}
            </h1>
            <p className="text-sm text-brand-ink/55 mt-1">{meta.fullName}</p>
            <p className="text-sm md:text-base text-brand-ink/85 mt-3 leading-relaxed">
              {meta.intro}
            </p>
          </div>
        </div>
      </header>

      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-3">
          Decisões recentes
        </h2>
        {recentes.length === 0 ? (
          <div className="rounded-xl bg-brand-bg/40 border border-brand-line p-4 text-sm text-brand-ink/80 leading-relaxed">
            <p>{EMPTY_STATE_TEXT}</p>
            <p className="mt-3 text-xs text-brand-ink/60">
              Enquanto isso, visite a{" "}
              <a
                href={meta.fonte}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-brand-deep"
              >
                jurisprudência oficial do {meta.name}
              </a>
              .
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {recentes.map((d) => {
              const tema = d.resumo_tema || null;
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
                      <span className="text-brand-ink/70 font-mono">
                        {d.numero}
                      </span>
                      {dataPubFmt && (
                        <span className="ml-auto text-brand-ink/45">
                          Publicado em {dataPubFmt}
                        </span>
                      )}
                    </header>
                    {tema && (
                      <p className="text-sm text-brand-deep font-semibold leading-snug mb-2">
                        {tema}
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

      {slug === "stj" && (
        <section className="card mb-6">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-deep" aria-hidden />
            Temas frequentes
          </h2>
          <p className="text-sm text-brand-ink/75 leading-relaxed mb-4">
            Veja decisões reais do STJ organizadas por tema — clique em qualquer
            tópico para ver os casos relacionados.
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {TEMAS_STJ.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/jurisprudencia/stj/tema/${t.slug}`}
                  className="block group rounded-lg border border-brand-line p-3 hover:border-brand-deep/40 hover:bg-brand-bg/30 transition"
                >
                  <p className="font-semibold text-sm text-brand-ink group-hover:text-brand-deep transition">
                    {t.titulo}
                  </p>
                  <p className="text-xs text-brand-ink/65 mt-0.5 leading-snug">
                    {t.descricao}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-brand-deep" aria-hidden />
          Perguntas frequentes
        </h2>
        <div className="space-y-3">
          {FAQS_BY_TRIBUNAL[slug].map((f, i) => (
            <details
              key={i}
              className="group rounded-xl border border-brand-line bg-white p-4 open:border-brand-deep/30"
            >
              <summary className="cursor-pointer font-semibold text-sm text-brand-ink list-none flex items-center justify-between">
                {f.q}
                <span
                  aria-hidden
                  className="text-brand-deep text-lg group-open:rotate-45 transition-transform"
                >
                  +
                </span>
              </summary>
              <p className="mt-2 text-sm text-brand-ink/80 leading-relaxed">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <aside
        role="note"
        className="rounded-xl border-l-4 border-amber-400 bg-amber-50 p-4 text-xs md:text-sm text-amber-900 leading-relaxed flex items-start gap-2 mb-6"
      >
        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden />
        <span>
          O AdvAqui não é órgão público nem substitui consulta jurídica.
          Conteúdo extraído de fontes públicas — para fins oficiais, consulte
          sempre a fonte original.{" "}
          <a
            href={meta.fonte}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {meta.fonte}
          </a>
        </span>
      </aside>

      <p className="text-sm text-brand-ink/65 mt-4">
        <Link href="/jurisprudencia" className="text-brand-deep hover:underline">
          ← Voltar ao hub de jurisprudência
        </Link>
      </p>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Jurisprudência", url: "/jurisprudencia" },
          { name: meta.name, url: `/jurisprudencia/${slug}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `Jurisprudência do ${meta.name}`,
          description: meta.intro,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS_BY_TRIBUNAL[slug].map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
    </div>
  );
}
