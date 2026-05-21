import Link from "next/link";
import { Scale, Search, ChevronRight, BookOpen, AlertCircle } from "lucide-react";
import { searchDecisoes } from "@/lib/data/jurisprudencia";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";

/**
 * /jurisprudencia — Hub do módulo. Busca, filtros, decisões recentes.
 *
 * SSR (não SSG) porque depende de query params da busca. Quando vier sem
 * busca, mostra decisões recentes (cached por 5 min via revalidate).
 * Quando vier com `?busca=...`, lista os matches — essa página com query
 * é noindex (evita combinatorial explosion no Google).
 */

export const dynamic = "force-dynamic";

const PAGE_TITLE = "Jurisprudência STF e STJ — Pesquisa de decisões judiciais";
const PAGE_DESC =
  "Pesquise jurisprudência do STF e STJ por tema, tribunal, relator, classe, número do processo e palavras da ementa. Consulte fontes oficiais no AdvAqui.";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { busca?: string; tribunal?: string };
}) {
  const hasQuery = Boolean(searchParams.busca || searchParams.tribunal);
  // Busca com query string → noindex pra evitar páginas fracas indexadas
  return buildMetadata({
    title: PAGE_TITLE,
    description: PAGE_DESC,
    path: "/jurisprudencia",
    noIndex: hasQuery,
  });
}

const TEMAS_DESTAQUE = [
  { slug: "dano-moral", nome: "Dano moral" },
  { slug: "plano-de-saude", nome: "Plano de saúde" },
  { slug: "prisao-preventiva", nome: "Prisão preventiva" },
  { slug: "pensao-alimenticia", nome: "Pensão alimentícia" },
  { slug: "aposentadoria", nome: "Aposentadoria" },
  { slug: "habeas-corpus", nome: "Habeas corpus" },
  { slug: "rescisao-indireta", nome: "Rescisão indireta" },
  { slug: "repercussao-geral", nome: "Repercussão geral" },
];

const FAQ = [
  {
    pergunta: "Como funciona a busca de jurisprudência no AdvAqui?",
    resposta:
      "Você pesquisa por palavras-chave (tema, relator, classe ou número de processo) e o sistema retorna decisões organizadas por relevância. Sempre exibimos a fonte oficial e link pra consulta direta.",
  },
  {
    pergunta: "As decisões são oficiais?",
    resposta:
      "Os metadados e ementas são extraídos de fontes públicas. Para fins oficiais, consulte sempre a versão disponível na fonte original, indicada em cada decisão.",
  },
  {
    pergunta: "Posso consultar o inteiro teor?",
    resposta:
      "Sim. O AdvAqui carrega o inteiro teor sob demanda, com cache temporário, sempre apontando para a fonte oficial.",
  },
];

export default async function JurisprudenciaIndexPage({
  searchParams,
}: {
  searchParams: {
    busca?: string;
    tribunal?: "STF" | "STJ" | "ALL";
    relator?: string;
    page?: string;
  };
}) {
  const busca = (searchParams.busca || "").trim();
  const tribunal = (searchParams.tribunal === "STF" || searchParams.tribunal === "STJ"
    ? searchParams.tribunal
    : "ALL") as "STF" | "STJ" | "ALL";
  const relator = (searchParams.relator || "").trim();
  const page = Math.max(1, Number(searchParams.page) || 1);
  const limit = 20;
  const offset = (page - 1) * limit;

  const { items, count } = await searchDecisoes({
    tribunal,
    q: busca || undefined,
    relator: relator || undefined,
    limit,
    offset,
  });

  const totalPages = Math.max(1, Math.ceil(count / limit));
  const hasFilter = Boolean(busca || relator || tribunal !== "ALL");

  return (
    <div className="container-narrow py-10">
      <Breadcrumb
        items={[
          { label: "Início", href: "/" },
          { label: "Jurisprudência" },
        ]}
      />

      <header className="card mb-6">
        <div className="flex items-start gap-3 mb-2">
          <Scale className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              Jurisprudência STF e STJ
            </h1>
            <p className="text-sm md:text-base text-brand-ink/75 mt-2 leading-relaxed">
              Pesquise decisões judiciais do STF e STJ por tema, classe, relator,
              número do processo e palavras da ementa. O AdvAqui organiza
              informações públicas de jurisprudência com link para a fonte oficial.
            </p>
          </div>
        </div>

        {/* Busca */}
        <form
          action="/jurisprudencia"
          method="get"
          className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-2"
        >
          <div className="md:col-span-7 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-ink/40"
              aria-hidden
            />
            <input
              type="text"
              name="busca"
              defaultValue={busca}
              placeholder="Busque por tema, relator, classe, número do processo ou palavras da ementa"
              className="input pl-9 w-full"
              maxLength={100}
            />
          </div>
          <select
            name="tribunal"
            defaultValue={tribunal}
            className="input md:col-span-2"
            aria-label="Tribunal"
          >
            <option value="ALL">Todos</option>
            <option value="STF">STF</option>
            <option value="STJ">STJ</option>
          </select>
          <input
            type="text"
            name="relator"
            defaultValue={relator}
            placeholder="Relator (opcional)"
            className="input md:col-span-2"
            maxLength={80}
          />
          <button type="submit" className="btn-accent md:col-span-1 justify-center">
            Buscar
          </button>
        </form>
      </header>

      {/* Resultados */}
      {hasFilter && (
        <p className="text-sm text-brand-ink/65 mb-3">
          {count > 0
            ? `${count.toLocaleString("pt-BR")} resultado${count > 1 ? "s" : ""} encontrado${count > 1 ? "s" : ""}`
            : "Nenhum resultado encontrado."}
          {busca && <> para <strong>&ldquo;{busca}&rdquo;</strong></>}
          {tribunal !== "ALL" && <> em <strong>{tribunal}</strong></>}
        </p>
      )}

      {items.length === 0 && !hasFilter && (
        <p className="text-sm text-brand-ink/65 mb-3 italic">
          Sem decisões cadastradas ainda. Em breve teremos conteúdo coletado das fontes oficiais.
        </p>
      )}

      {items.length > 0 && (
        <ul className="space-y-3 mb-8">
          {items.map((d) => (
            <li key={d.id}>
              <Link
                href={`/jurisprudencia/${d.tribunal.toLowerCase()}/${d.slug}`}
                className="block card hover:border-brand-deep transition group"
              >
                <div className="flex flex-wrap items-center gap-2 mb-1.5 text-xs">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-deep/10 text-brand-deep font-bold">
                    {d.tribunal}
                  </span>
                  {d.classe && (
                    <span className="text-brand-ink/70">{d.classe} {d.numero}</span>
                  )}
                  {d.relator && (
                    <span className="text-brand-ink/55">— Rel. {d.relator}</span>
                  )}
                  {d.data_julgamento && (
                    <span className="ml-auto text-brand-ink/45">
                      Julg. {new Date(d.data_julgamento).toLocaleDateString("pt-BR")}
                    </span>
                  )}
                </div>
                <p className="text-sm md:text-base text-brand-ink/85 line-clamp-3 leading-relaxed">
                  {d.ementa}
                </p>
                {d.temas && d.temas.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {d.temas.slice(0, 4).map((tema) => (
                      <span
                        key={tema}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-brand-bg border border-brand-line text-brand-ink/70"
                      >
                        {tema}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Paginação simples */}
      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-2 mb-8" aria-label="Paginação">
          {page > 1 && (
            <Link
              href={{
                pathname: "/jurisprudencia",
                query: { ...searchParams, page: String(page - 1) },
              }}
              className="btn-ghost border border-brand-line text-sm"
            >
              ← Anterior
            </Link>
          )}
          <span className="text-sm text-brand-ink/65">
            Página {page} de {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={{
                pathname: "/jurisprudencia",
                query: { ...searchParams, page: String(page + 1) },
              }}
              className="btn-ghost border border-brand-line text-sm"
            >
              Próxima →
            </Link>
          )}
        </nav>
      )}

      {/* Atalhos pra tribunais e temas */}
      {!hasFilter && items.length === 0 && (
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Link href="/jurisprudencia/stf" className="card hover:border-brand-deep transition">
            <h3 className="font-display text-lg font-bold text-brand-ink inline-flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-deep" aria-hidden />
              Jurisprudência do STF
            </h3>
            <p className="text-xs text-brand-ink/65 mt-1">
              Decisões, ementas e teses do Supremo Tribunal Federal.
            </p>
          </Link>
          <Link href="/jurisprudencia/stj" className="card hover:border-brand-deep transition">
            <h3 className="font-display text-lg font-bold text-brand-ink inline-flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-deep" aria-hidden />
              Jurisprudência do STJ
            </h3>
            <p className="text-xs text-brand-ink/65 mt-1">
              Decisões, ementas e teses do Superior Tribunal de Justiça.
            </p>
          </Link>
        </div>
      )}

      {!hasFilter && (
        <section className="card mb-8">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-3">
            Temas frequentes
          </h2>
          <div className="flex flex-wrap gap-2">
            {TEMAS_DESTAQUE.map((t) => (
              <Link
                key={t.slug}
                href={{ pathname: "/jurisprudencia", query: { busca: t.nome } }}
                className="text-sm px-3 py-1.5 rounded-full bg-brand-bg border border-brand-line text-brand-ink hover:border-brand-deep hover:text-brand-deep transition"
              >
                {t.nome}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-brand-deep" aria-hidden />
          Perguntas frequentes
        </h2>
        <div className="space-y-3">
          {FAQ.map((f, i) => (
            <details
              key={i}
              className="group rounded-xl border border-brand-line bg-white p-4 open:border-brand-deep/30 open:bg-brand-bg/30"
            >
              <summary className="cursor-pointer font-semibold text-sm md:text-base text-brand-ink list-none flex items-center justify-between gap-2">
                {f.pergunta}
                <span
                  aria-hidden
                  className="text-brand-deep text-lg leading-none group-open:rotate-45 transition-transform"
                >
                  +
                </span>
              </summary>
              <p className="mt-2 text-sm text-brand-ink/80 leading-relaxed">{f.resposta}</p>
            </details>
          ))}
        </div>
      </section>

      <aside
        role="note"
        className="rounded-xl border-l-4 border-amber-400 bg-amber-50 p-4 text-xs md:text-sm text-amber-900 leading-relaxed flex items-start gap-2"
      >
        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden />
        <span>
          Conteúdo extraído de fontes públicas. Para fins oficiais, consulte
          sempre a versão disponível na fonte original.
        </span>
      </aside>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Jurisprudência", url: "/jurisprudencia" },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: PAGE_TITLE,
          description: PAGE_DESC,
          url: `${SITE.url}/jurisprudencia`,
          potentialAction: {
            "@type": "SearchAction",
            target: `${SITE.url}/jurisprudencia?busca={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({
            "@type": "Question",
            name: f.pergunta,
            acceptedAnswer: { "@type": "Answer", text: f.resposta },
          })),
        }}
      />
    </div>
  );
}
