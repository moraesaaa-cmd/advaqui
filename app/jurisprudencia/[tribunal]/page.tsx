import Link from "next/link";
import { notFound } from "next/navigation";
import { Scale, AlertCircle, BookOpen } from "lucide-react";
import { getRecentByTribunal } from "@/lib/data/jurisprudencia";
import type { Tribunal } from "@/lib/data/jurisprudencia";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

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
  if (!VALID_TRIBUNALS.includes(slug)) {
    return buildMetadata({
      title: "Jurisprudência",
      description: "Não encontrado",
      noIndex: true,
    });
  }
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
          <ul className="space-y-3">
            {recentes.map((d) => {
              const cardText =
                (d.resumo_decisao && d.resumo_decisao.trim()) ||
                (d.resumo_entendimento && d.resumo_entendimento.trim()) ||
                d.ementa.trim().slice(0, 250);
              return (
                <li key={d.id}>
                  <Link
                    href={`/jurisprudencia/${d.tribunal.toLowerCase()}/${d.slug}`}
                    className="block rounded-xl border border-brand-line bg-white p-4 hover:border-brand-deep transition"
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-1 text-xs">
                      {d.classe && (
                        <span className="font-semibold text-brand-deep">
                          {d.classe} {d.numero}
                        </span>
                      )}
                      {d.relator && (
                        <span className="text-brand-ink/55">— Rel. {d.relator}</span>
                      )}
                      {d.data_julgamento && (
                        <span className="ml-auto text-brand-ink/45">
                          {new Date(d.data_julgamento).toLocaleDateString("pt-BR")}
                        </span>
                      )}
                    </div>
                    {d.resumo_tema && (
                      <p className="text-xs text-brand-deep font-semibold mb-1 line-clamp-1">
                        {d.resumo_tema}
                      </p>
                    )}
                    <p className="text-sm text-brand-ink/85 line-clamp-2">
                      {cardText}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

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
