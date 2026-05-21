import Link from "next/link";
import { notFound } from "next/navigation";
import { Scale, AlertCircle, FileText, Calendar, User, Tag, ExternalLink } from "lucide-react";
import {
  getDecisaoBySlug,
  getRelatedDecisoes,
} from "@/lib/data/jurisprudencia";
import type { Tribunal } from "@/lib/data/jurisprudencia";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";

/**
 * /jurisprudencia/[tribunal]/[slug] — Página de detalhe de uma decisão.
 *
 * SSG com revalidate 6h. Indexável apenas quando a decisão tem
 * `indexavel = true` (controlado pelo coletor com base em qualidade da
 * ementa, presença de tese, classe canônica, etc.).
 */

export const revalidate = 21600; // 6h
export const dynamicParams = true; // gera sob demanda decisões novas

const VALID_TRIBUNALS = ["stf", "stj"] as const;
type TribunalSlug = (typeof VALID_TRIBUNALS)[number];

export async function generateStaticParams() {
  // SSG inicial vazio — decisões são geradas sob demanda quando
  // visitadas pela primeira vez, e cacheadas após.
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: { tribunal: string; slug: string };
}) {
  const slug = params.tribunal.toLowerCase() as TribunalSlug;
  if (!VALID_TRIBUNALS.includes(slug)) {
    return buildMetadata({
      title: "Decisão não encontrada",
      description: "Decisão não encontrada",
      noIndex: true,
    });
  }
  const tribunal = slug.toUpperCase() as Tribunal;
  const decisao = await getDecisaoBySlug(tribunal, params.slug);
  if (!decisao) {
    return buildMetadata({
      title: "Decisão não encontrada",
      description: "Decisão não encontrada no acervo do AdvAqui.",
      noIndex: true,
    });
  }

  const title =
    decisao.seo_title ||
    `${decisao.classe ?? ""} ${decisao.numero} — ${tribunal}`.trim();
  const description =
    decisao.seo_description ||
    decisao.ementa.slice(0, 158);

  return buildMetadata({
    title,
    description,
    path: `/jurisprudencia/${slug}/${decisao.slug}`,
    noIndex: false, // controlado por indexavel/motivo_noindex abaixo no JSX (meta robots adicional)
  });
}

const TRIBUNAL_META: Record<TribunalSlug, { name: string; fullName: string; fonte: string }> = {
  stf: {
    name: "STF",
    fullName: "Supremo Tribunal Federal",
    fonte: "https://portal.stf.jus.br/jurisprudencia/",
  },
  stj: {
    name: "STJ",
    fullName: "Superior Tribunal de Justiça",
    fonte: "https://scon.stj.jus.br/SCON/",
  },
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("pt-BR");
  } catch {
    return "—";
  }
}

export default async function DecisaoDetailPage({
  params,
}: {
  params: { tribunal: string; slug: string };
}) {
  const slug = params.tribunal.toLowerCase() as TribunalSlug;
  if (!VALID_TRIBUNALS.includes(slug)) notFound();

  const tribunal = slug.toUpperCase() as Tribunal;
  const decisao = await getDecisaoBySlug(tribunal, params.slug);
  if (!decisao) notFound();

  const meta = TRIBUNAL_META[slug];
  const related = await getRelatedDecisoes(decisao, 5);

  const h1 =
    decisao.seo_title ||
    `${decisao.classe ?? ""} ${decisao.numero}`.trim();

  return (
    <div className="container-narrow py-10">
      <Breadcrumb
        items={[
          { label: "Início", href: "/" },
          { label: "Jurisprudência", href: "/jurisprudencia" },
          { label: meta.name, href: `/jurisprudencia/${slug}` },
          { label: `${decisao.classe ?? ""} ${decisao.numero}`.trim() },
        ]}
      />

      <article>
        <header className="card mb-6">
          <div className="flex items-start gap-3">
            <Scale className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-wide text-brand-deep font-semibold mb-1">
                {meta.name} — {meta.fullName}
              </p>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-brand-ink leading-tight">
                {h1}
              </h1>
              {decisao.relator && (
                <p className="text-sm text-brand-ink/55 mt-2">
                  Relator: <span className="text-brand-ink/85">{decisao.relator}</span>
                </p>
              )}
            </div>
          </div>
        </header>

        <section className="card mb-6">
          <h2 className="font-display text-base font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-deep" aria-hidden />
            Metadados da decisão
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <dt className="text-brand-ink/55 text-xs uppercase tracking-wide">Tribunal</dt>
              <dd className="text-brand-ink/90 mt-0.5">{decisao.tribunal}</dd>
            </div>
            {decisao.classe && (
              <div>
                <dt className="text-brand-ink/55 text-xs uppercase tracking-wide">Classe</dt>
                <dd className="text-brand-ink/90 mt-0.5">{decisao.classe}</dd>
              </div>
            )}
            <div>
              <dt className="text-brand-ink/55 text-xs uppercase tracking-wide">Número</dt>
              <dd className="text-brand-ink/90 mt-0.5 font-mono text-xs">{decisao.numero}</dd>
            </div>
            {decisao.processo && (
              <div>
                <dt className="text-brand-ink/55 text-xs uppercase tracking-wide">Processo</dt>
                <dd className="text-brand-ink/90 mt-0.5 font-mono text-xs">{decisao.processo}</dd>
              </div>
            )}
            {decisao.orgao_julgador && (
              <div>
                <dt className="text-brand-ink/55 text-xs uppercase tracking-wide">Órgão julgador</dt>
                <dd className="text-brand-ink/90 mt-0.5">{decisao.orgao_julgador}</dd>
              </div>
            )}
            {decisao.relator && (
              <div>
                <dt className="text-brand-ink/55 text-xs uppercase tracking-wide inline-flex items-center gap-1">
                  <User className="w-3 h-3" aria-hidden /> Relator
                </dt>
                <dd className="text-brand-ink/90 mt-0.5">{decisao.relator}</dd>
              </div>
            )}
            {decisao.data_julgamento && (
              <div>
                <dt className="text-brand-ink/55 text-xs uppercase tracking-wide inline-flex items-center gap-1">
                  <Calendar className="w-3 h-3" aria-hidden /> Data de julgamento
                </dt>
                <dd className="text-brand-ink/90 mt-0.5">{formatDate(decisao.data_julgamento)}</dd>
              </div>
            )}
            {decisao.data_publicacao && (
              <div>
                <dt className="text-brand-ink/55 text-xs uppercase tracking-wide inline-flex items-center gap-1">
                  <Calendar className="w-3 h-3" aria-hidden /> Data de publicação
                </dt>
                <dd className="text-brand-ink/90 mt-0.5">{formatDate(decisao.data_publicacao)}</dd>
              </div>
            )}
            <div className="sm:col-span-2">
              <dt className="text-brand-ink/55 text-xs uppercase tracking-wide inline-flex items-center gap-1">
                <ExternalLink className="w-3 h-3" aria-hidden /> Fonte oficial
              </dt>
              <dd className="mt-0.5">
                <a
                  href={decisao.url_origem}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-deep underline break-all text-xs"
                >
                  {decisao.url_origem}
                </a>
              </dd>
            </div>
          </dl>
        </section>

        <section className="card mb-6">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-3">Ementa</h2>
          <div className="prose prose-sm max-w-none text-brand-ink/85 leading-relaxed whitespace-pre-line">
            {decisao.ementa}
          </div>
          {decisao.tese && (
            <div className="mt-4 rounded-xl border-l-4 border-brand-deep bg-brand-deep/5 p-4">
              <p className="text-xs uppercase tracking-wide text-brand-deep font-semibold mb-1">
                Tese fixada
              </p>
              <p className="text-sm text-brand-ink/90 leading-relaxed whitespace-pre-line">
                {decisao.tese}
              </p>
            </div>
          )}
          {decisao.resumo_informativo && (
            <div className="mt-4 rounded-xl border border-brand-line bg-brand-canvas/40 p-4">
              <p className="text-xs uppercase tracking-wide text-brand-ink/55 font-semibold mb-1">
                Resumo informativo
              </p>
              <p className="text-sm text-brand-ink/80 leading-relaxed">
                {decisao.resumo_informativo}
              </p>
            </div>
          )}
        </section>

        {(decisao.temas?.length > 0 || decisao.palavras_chave?.length > 0) && (
          <section className="card mb-6">
            <h2 className="font-display text-base font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
              <Tag className="w-4 h-4 text-brand-deep" aria-hidden />
              Temas e palavras-chave
            </h2>
            <div className="flex flex-wrap gap-2">
              {decisao.temas?.map((t) => (
                <span
                  key={`t-${t}`}
                  className="inline-flex items-center text-xs px-3 py-1 rounded-full bg-brand-deep/10 text-brand-deep font-medium"
                >
                  {t}
                </span>
              ))}
              {decisao.palavras_chave?.map((p) => (
                <span
                  key={`p-${p}`}
                  className="inline-flex items-center text-xs px-3 py-1 rounded-full bg-brand-line/40 text-brand-ink/75"
                >
                  {p}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="card mb-6">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-brand-deep flex-shrink-0 mt-0.5" aria-hidden />
            <div className="flex-1">
              <h2 className="font-display text-base font-bold text-brand-ink mb-1">
                Inteiro teor
              </h2>
              <p className="text-xs text-brand-ink/65 leading-relaxed mb-3">
                O inteiro teor é obtido sob demanda na fonte oficial do tribunal e
                mantido em cache temporário (até 7 dias). Para uso oficial,
                consulte sempre o link da fonte logo acima.
              </p>
              <a
                href={`/api/jurisprudencia/inteiro-teor/${decisao.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-brand-deep text-brand-deep hover:bg-brand-deep hover:text-white transition"
              >
                <FileText className="w-4 h-4" aria-hidden />
                Ver inteiro teor (fonte oficial)
              </a>
            </div>
          </div>
        </section>

        <aside
          role="note"
          className="rounded-xl border-l-4 border-amber-400 bg-amber-50 p-4 text-xs md:text-sm text-amber-900 leading-relaxed flex items-start gap-2 mb-6"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden />
          <span>
            Conteúdo extraído de fontes públicas do tribunal e organizado para
            consulta. Para fins oficiais, sempre consulte a versão disponível na
            fonte original do {meta.name}. O AdvAqui não é órgão público nem
            substitui consulta jurídica profissional.
          </span>
        </aside>

        {related.length > 0 && (
          <section className="card mb-6">
            <h2 className="font-display text-xl font-bold text-brand-ink mb-3">
              Decisões relacionadas
            </h2>
            <ul className="space-y-3">
              {related.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/jurisprudencia/${r.tribunal.toLowerCase()}/${r.slug}`}
                    className="block rounded-xl border border-brand-line bg-white p-4 hover:border-brand-deep transition"
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-1 text-xs">
                      <span className="font-semibold text-brand-deep">
                        {r.tribunal}
                      </span>
                      {r.classe && (
                        <span className="text-brand-ink/85">
                          {r.classe} {r.numero}
                        </span>
                      )}
                      {r.relator && (
                        <span className="text-brand-ink/55">— Rel. {r.relator}</span>
                      )}
                      {r.data_julgamento && (
                        <span className="ml-auto text-brand-ink/45">
                          {formatDate(r.data_julgamento)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-brand-ink/85 line-clamp-2">{r.ementa}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="card">
          <h2 className="font-display text-base font-bold text-brand-ink mb-3">
            Links úteis
          </h2>
          <ul className="text-sm text-brand-deep space-y-2 list-disc list-inside">
            <li>
              <Link
                href={`/jurisprudencia/${slug}`}
                className="underline hover:text-brand-ink"
              >
                Voltar para jurisprudência do {meta.name}
              </Link>
            </li>
            <li>
              <Link href="/jurisprudencia" className="underline hover:text-brand-ink">
                Hub geral de jurisprudência
              </Link>
            </li>
            <li>
              <Link href="/advogados" className="underline hover:text-brand-ink">
                Encontrar advogado por cidade ou especialidade
              </Link>
            </li>
          </ul>
        </section>
      </article>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Jurisprudência", url: "/jurisprudencia" },
          { name: meta.name, url: `/jurisprudencia/${slug}` },
          {
            name: `${decisao.classe ?? ""} ${decisao.numero}`.trim(),
            url: `/jurisprudencia/${slug}/${decisao.slug}`,
          },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: h1,
          description: decisao.seo_description || decisao.ementa.slice(0, 158),
          datePublished: decisao.data_publicacao || decisao.data_julgamento || undefined,
          dateModified: decisao.data_publicacao || decisao.data_julgamento || undefined,
          inLanguage: "pt-BR",
          author: {
            "@type": "Organization",
            name: `${meta.fullName} (${meta.name})`,
          },
          publisher: {
            "@type": "Organization",
            name: SITE.name,
            url: SITE.url,
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${SITE.url}/jurisprudencia/${slug}/${decisao.slug}`,
          },
          keywords: [...(decisao.temas || []), ...(decisao.palavras_chave || [])].join(", "),
          isBasedOn: decisao.url_origem,
        }}
      />
    </div>
  );
}
