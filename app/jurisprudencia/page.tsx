import Link from "next/link";
import { Scale, Search, BookOpen, AlertCircle, Users, FileText } from "lucide-react";
import { searchDecisoes } from "@/lib/data/jurisprudencia";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";

/**
 * /jurisprudencia — Hub do módulo.
 *
 * Estratégia honesta:
 *  - Quando NÃO HÁ decisões reais cadastradas no banco, mostramos um
 *    estado vazio explícito ("módulo sendo preparado") em vez de cards
 *    de amostras.
 *  - Quando houver decisões reais, listamos. O filtro defensivo em
 *    lib/data/jurisprudencia já remove qualquer registro com marcadores
 *    AMOSTRA/fixture/example.invalid mesmo se algum escapar do banco.
 *  - Buscas com query string (?busca=…) são noindex pra evitar
 *    combinatorial explosion no Google.
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
  return buildMetadata({
    title: PAGE_TITLE,
    description: PAGE_DESC,
    path: "/jurisprudencia",
    noIndex: hasQuery,
  });
}

const FAQ = [
  {
    pergunta: "O que é jurisprudência?",
    resposta:
      "Jurisprudência é o conjunto de decisões judiciais sobre determinados temas, usado como referência para compreender entendimentos adotados pelos tribunais.",
  },
  {
    pergunta: "As decisões exibidas no AdvAqui são oficiais?",
    resposta:
      "O AdvAqui organiza informações extraídas de fontes públicas e sempre exibe link para a fonte oficial. Para fins oficiais, consulte a página do tribunal responsável.",
  },
  {
    pergunta: "Quais tribunais estão disponíveis?",
    resposta:
      "Nesta primeira fase, o módulo reúne decisões do STF e do STJ.",
  },
  {
    pergunta: "Posso usar uma decisão encontrada aqui em uma petição?",
    resposta:
      "A decisão pode servir como referência inicial de pesquisa, mas deve ser conferida na fonte oficial e analisada pelo profissional responsável.",
  },
];

const EMPTY_STATE_TEXT =
  "O módulo de jurisprudência do AdvAqui está sendo preparado para exibir decisões extraídas de fontes oficiais. Em breve, você poderá pesquisar decisões do STF e STJ por tema, classe, relator, número do processo e palavras da ementa.";

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
  const tribunalParam =
    searchParams.tribunal === "STF" || searchParams.tribunal === "STJ"
      ? searchParams.tribunal
      : "ALL";
  const tribunal = tribunalParam as "STF" | "STJ" | "ALL";
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
  const hasDataInModule = items.length > 0 || hasFilter;

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

        <form
          action="/jurisprudencia"
          method="get"
          className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-2"
          role="search"
          aria-label="Busca de jurisprudência"
        >
          <div className="md:col-span-7 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-ink/40"
              aria-hidden
            />
            <label htmlFor="busca-jurisprudencia" className="sr-only">
              Buscar por tema, relator, classe, número do processo ou palavras da ementa
            </label>
            <input
              id="busca-jurisprudencia"
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
            aria-label="Relator"
          />
          <button type="submit" className="btn-accent md:col-span-1 justify-center">
            Buscar
          </button>
        </form>
      </header>

      {/* Resultados — só renderizamos cards reais. Nada de amostras. */}
      {hasFilter && (
        <p className="text-sm text-brand-ink/65 mb-3">
          {count > 0
            ? `${count.toLocaleString("pt-BR")} resultado${count > 1 ? "s" : ""} encontrado${count > 1 ? "s" : ""}`
            : "Nenhum resultado encontrado."}
          {busca && <> para <strong>&ldquo;{busca}&rdquo;</strong></>}
          {tribunal !== "ALL" && <> em <strong>{tribunal}</strong></>}
        </p>
      )}

      {items.length > 0 ? (
        <ul className="space-y-3 mb-8">
          {items.map((d) => {
            // Card mais limpo: prioriza resumo conservador, fallback pra ementa
            const cardText =
              (d.resumo_decisao && d.resumo_decisao.trim()) ||
              (d.resumo_entendimento && d.resumo_entendimento.trim()) ||
              d.ementa.trim().slice(0, 280);
            const tema = d.resumo_tema || null;
            return (
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
                      <span className="text-brand-ink/70">
                        {d.classe} {d.numero}
                      </span>
                    )}
                    {d.relator && (
                      <span className="text-brand-ink/55">— Rel. {d.relator}</span>
                    )}
                    {d.data_julgamento && (
                      <span className="ml-auto text-brand-ink/45">
                        Julg.{" "}
                        {new Date(d.data_julgamento).toLocaleDateString("pt-BR")}
                      </span>
                    )}
                  </div>
                  {tema && (
                    <p className="text-xs text-brand-deep font-semibold mb-1 line-clamp-1">
                      {tema}
                    </p>
                  )}
                  <p className="text-sm text-brand-ink/85 line-clamp-3 leading-relaxed">
                    {cardText}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[10px] text-brand-ink/55">
                    <span>Fonte: Portal de Dados Abertos do STJ</span>
                    {d.temas && d.temas.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {d.temas.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded-full bg-brand-bg border border-brand-line text-brand-ink/70"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        // Estado vazio honesto — apenas quando NÃO houve filtro (busca sem
        // resultado mostra mensagem específica acima).
        !hasFilter && (
          <section
            className="card mb-8 bg-brand-bg/40"
            aria-label="Módulo em preparação"
          >
            <div className="flex items-start gap-3">
              <BookOpen
                className="w-5 h-5 text-brand-deep flex-shrink-0 mt-0.5"
                aria-hidden
              />
              <div>
                <h2 className="font-display text-lg font-bold text-brand-ink mb-2">
                  Módulo sendo preparado
                </h2>
                <p className="text-sm md:text-base text-brand-ink/80 leading-relaxed">
                  {EMPTY_STATE_TEXT}
                </p>
              </div>
            </div>
          </section>
        )
      )}

      {/* Paginação simples */}
      {totalPages > 1 && (
        <nav
          className="flex items-center justify-center gap-2 mb-8"
          aria-label="Paginação"
        >
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

      {/* Atalhos pra páginas dos tribunais — só quando tem ou pode ter dados.
          Mantemos visível mesmo no estado vazio porque /jurisprudencia/stf
          e /stj também mostram estado vazio honesto. */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <Link
          href="/jurisprudencia/stf"
          className="card hover:border-brand-deep transition"
        >
          <h3 className="font-display text-lg font-bold text-brand-ink inline-flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-deep" aria-hidden />
            Jurisprudência do STF
          </h3>
          <p className="text-xs text-brand-ink/65 mt-1">
            Decisões, ementas e teses do Supremo Tribunal Federal.
          </p>
        </Link>
        <Link
          href="/jurisprudencia/stj"
          className="card hover:border-brand-deep transition"
        >
          <h3 className="font-display text-lg font-bold text-brand-ink inline-flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-deep" aria-hidden />
            Jurisprudência do STJ
          </h3>
          <p className="text-xs text-brand-ink/65 mt-1">
            Decisões, ementas e teses do Superior Tribunal de Justiça.
          </p>
        </Link>
      </div>

      {/* Links internos úteis */}
      <section className="card mb-8">
        <h2 className="font-display text-lg font-bold text-brand-ink mb-3">
          Continue navegando
        </h2>
        <ul className="grid sm:grid-cols-2 gap-3 text-sm">
          <li>
            <Link
              href="/advogados"
              className="inline-flex items-center gap-2 text-brand-deep hover:underline"
            >
              <Users className="w-4 h-4" aria-hidden />
              Encontrar advogados por cidade
            </Link>
          </li>
          <li>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-brand-deep hover:underline"
            >
              <BookOpen className="w-4 h-4" aria-hidden />
              Blog jurídico
            </Link>
          </li>
          <li>
            <Link
              href="/modelos"
              className="inline-flex items-center gap-2 text-brand-deep hover:underline"
            >
              <FileText className="w-4 h-4" aria-hidden />
              Modelos gratuitos
            </Link>
          </li>
          <li>
            <Link
              href="/marketing-juridico"
              className="inline-flex items-center gap-2 text-brand-deep hover:underline"
            >
              <BookOpen className="w-4 h-4" aria-hidden />
              Marketing jurídico
            </Link>
          </li>
        </ul>
      </section>

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
              <p className="mt-2 text-sm text-brand-ink/80 leading-relaxed">
                {f.resposta}
              </p>
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
          O AdvAqui não é órgão público nem substitui consulta jurídica. Conteúdo
          extraído de fontes públicas do STF e STJ — para fins oficiais, consulte
          sempre a fonte original indicada em cada decisão.
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
      {/* Sinalizamos hasDataInModule pro server saber que módulo está vazio
          — útil pra futuras métricas de health check. */}
      <span hidden data-module-status={hasDataInModule ? "active" : "empty"} />
    </div>
  );
}
