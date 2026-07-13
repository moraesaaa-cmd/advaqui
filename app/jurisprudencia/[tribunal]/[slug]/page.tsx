import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Scale,
  AlertCircle,
  FileText,
  Calendar,
  User,
  Tag,
  ExternalLink,
} from "lucide-react";
import {
  getDecisaoBySlug,
  getRelatedDecisoes,
} from "@/lib/data/jurisprudencia";
import type { Tribunal } from "@/lib/data/jurisprudencia";
import { isOfficialSource } from "@/lib/data/jurisprudencia-validators";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { fitDescription } from "@/lib/seo/local-titles";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";
import { OfficialSourceBox } from "@/components/jurisprudencia/OfficialSourceBox";
import { CopyButton } from "@/components/jurisprudencia/CopyButton";

/**
 * /jurisprudencia/[tribunal]/[slug] — Página de detalhe de uma decisão.
 *
 * Camadas de defesa:
 *  - getDecisaoBySlug já rejeita registros com marcadores AMOSTRA/fixture
 *    e fontes não-oficiais (validador centralizado).
 *  - Aqui re-checamos isOfficialSource e indexabilidade pra escolher o
 *    fluxo: 404 (não existe), noindex (existe mas suspeito) ou render
 *    normal (real).
 *  - O botão "ver inteiro teor" abre a FONTE OFICIAL em nova aba. Sem
 *    inventar conteúdo. O endpoint /api/jurisprudencia/inteiro-teor já
 *    serve cache quando existir, ou redireciona pra fonte.
 */

export const revalidate = 21600; // 6h
export const dynamicParams = true;

const VALID_TRIBUNALS = ["stf", "stj"] as const;
type TribunalSlug = (typeof VALID_TRIBUNALS)[number];

export async function generateStaticParams() {
  // SSG vazio. Decisões reais geradas sob demanda + cacheadas.
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

  // Title pedido: [Classe] [Número] — [Tema] | [Tribunal] | AdvAqui
  // Prioriza resumo_tema (conservador, vindo dos dados oficiais)
  const temaPrincipal =
    decisao.resumo_tema || decisao.temas?.[0];
  const baseTitle =
    [
      `${decisao.classe ?? ""} ${decisao.numero}`.trim(),
      temaPrincipal,
      tribunal,
    ]
      .filter(Boolean)
      .join(" — ");

  // Meta pedida: "[Classe] [Número] no STJ. Tema: [...]. Consulte ementa..."
  const description = (() => {
    const head = `${decisao.classe ?? ""} ${decisao.numero} no ${tribunal}`.replace(
      /\s+/g,
      " "
    ).trim();
    const temaTxt = temaPrincipal ? ` Tema: ${temaPrincipal}.` : "";
    return fitDescription(
      (head + "." + temaTxt + " Consulte ementa, metadados e fonte oficial no AdvAqui.")
        .replace(/\s+/g, " ")
        .trim(),
      158
    );
  })();

  return buildMetadata({
    title: baseTitle,
    description,
    path: `/jurisprudencia/${slug}/${decisao.slug}`,
    // noIndex se url_origem não for oficial — defesa extra
    noIndex: !isOfficialSource(decisao.url_origem),
  });
}

const TRIBUNAL_META: Record<
  TribunalSlug,
  { name: string; fullName: string; fonte: string }
> = {
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

  // Re-check defensivo: se fonte não for oficial, devolvemos 404 público.
  // Banco já remove status=removido, mas aqui é a última barreira.
  if (!isOfficialSource(decisao.url_origem)) {
    notFound();
  }

  const meta = TRIBUNAL_META[slug];
  const related = await getRelatedDecisoes(decisao, 5);

  const temaPrincipal =
    decisao.resumo_tema || decisao.temas?.[0];
  const h1 = [
    `${decisao.classe ?? ""} ${decisao.numero}`.trim(),
    temaPrincipal,
  ]
    .filter(Boolean)
    .join(" — ");

  // Detecta se o `resumo_informativo` (campo `decisao` original do JSON oficial)
  // tem conteúdo útil. Fórmula genérica "Vistos e relatados..." sem nada
  // a mais é considerada inútil e fica oculta.
  const rawDecisao = (decisao.resumo_informativo || "").trim();
  const decisaoTextUseful = (() => {
    if (!rawDecisao || rawDecisao.length < 60) return null;
    // Se só tem a fórmula clássica + nada substantivo, ignora
    const isOnlyBoilerplate = /^vistos\s+e\s+relatados/i.test(rawDecisao) && rawDecisao.length < 250;
    if (isOnlyBoilerplate) return null;
    return rawDecisao;
  })();

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
            <Scale
              className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1"
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-wide text-brand-deep font-semibold mb-1">
                {meta.name} — {meta.fullName}
              </p>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-brand-ink leading-tight">
                {h1}
              </h1>
              {decisao.relator && (
                <p className="text-sm text-brand-ink/55 mt-2">
                  Relator:{" "}
                  <span className="text-brand-ink/85">{decisao.relator}</span>
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
              <dt className="text-brand-ink/55 text-xs uppercase tracking-wide">
                Tribunal
              </dt>
              <dd className="text-brand-ink/90 mt-0.5">{decisao.tribunal}</dd>
            </div>
            {decisao.classe && (
              <div>
                <dt className="text-brand-ink/55 text-xs uppercase tracking-wide">
                  Classe
                </dt>
                <dd className="text-brand-ink/90 mt-0.5">{decisao.classe}</dd>
              </div>
            )}
            <div>
              <dt className="text-brand-ink/55 text-xs uppercase tracking-wide">
                Número
              </dt>
              <dd className="text-brand-ink/90 mt-0.5 font-mono text-xs">
                {decisao.numero}
              </dd>
            </div>
            {decisao.processo && (
              <div>
                <dt className="text-brand-ink/55 text-xs uppercase tracking-wide">
                  Processo
                </dt>
                <dd className="text-brand-ink/90 mt-0.5 font-mono text-xs">
                  {decisao.processo}
                </dd>
              </div>
            )}
            {decisao.orgao_julgador && (
              <div>
                <dt className="text-brand-ink/55 text-xs uppercase tracking-wide">
                  Órgão julgador
                </dt>
                <dd className="text-brand-ink/90 mt-0.5">
                  {decisao.orgao_julgador}
                </dd>
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
                  <Calendar className="w-3 h-3" aria-hidden /> Data de
                  julgamento
                </dt>
                <dd className="text-brand-ink/90 mt-0.5">
                  {formatDate(decisao.data_julgamento)}
                </dd>
              </div>
            )}
            {decisao.data_publicacao && (
              <div>
                <dt className="text-brand-ink/55 text-xs uppercase tracking-wide inline-flex items-center gap-1">
                  <Calendar className="w-3 h-3" aria-hidden /> Data de
                  publicação
                </dt>
                <dd className="text-brand-ink/90 mt-0.5">
                  {formatDate(decisao.data_publicacao)}
                </dd>
              </div>
            )}
            <div className="sm:col-span-2 text-xs text-brand-ink/55 italic mt-1">
              Os detalhes da fonte oficial estão no bloco{" "}
              <span className="font-medium">&ldquo;Fonte oficial dos dados&rdquo;</span> abaixo.
            </div>
          </dl>
        </section>

        {/* RESUMO INFORMATIVO DO ENTENDIMENTO — vem ANTES da ementa.
            Aviso explícito: organizado pelo AdvAqui, não substitui leitura
            da ementa oficial. Só aparece se resumo_status = 'gerado'. */}
        {decisao.resumo_status === "gerado" &&
          (decisao.resumo_tema ||
            decisao.resumo_decisao ||
            decisao.resumo_entendimento ||
            (decisao.resumo_pontos && decisao.resumo_pontos.length > 0)) && (
            <section
              className="card mb-6 border-l-4 border-brand-deep/40"
              aria-label="Resumo informativo do entendimento"
            >
              <h2 className="font-display text-xl font-bold text-brand-ink mb-1">
                Resumo informativo do entendimento
              </h2>
              <p className="text-xs text-brand-ink/55 italic mb-4">
                Resumo organizado pelo AdvAqui a partir da ementa e dos
                metadados oficiais. Não substitui a leitura da decisão na
                fonte oficial.
              </p>
              <dl className="space-y-4 text-sm leading-relaxed">
                {decisao.resumo_tema && (
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-brand-deep font-semibold mb-1">
                      Tema principal
                    </dt>
                    <dd className="text-brand-ink/90">{decisao.resumo_tema}</dd>
                  </div>
                )}
                {decisao.resumo_decisao && (
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-brand-deep font-semibold mb-1">
                      O que foi decidido
                    </dt>
                    <dd className="text-brand-ink/85">{decisao.resumo_decisao}</dd>
                  </div>
                )}
                {decisao.resumo_entendimento && (
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-brand-deep font-semibold mb-1">
                      Entendimento extraído da ementa
                    </dt>
                    <dd className="text-brand-ink/85">{decisao.resumo_entendimento}</dd>
                  </div>
                )}
                {decisao.resumo_pontos &&
                  decisao.resumo_pontos.length > 0 && (
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-brand-deep font-semibold mb-1">
                        Pontos relevantes
                      </dt>
                      <dd>
                        <ul className="list-disc list-inside space-y-1 text-brand-ink/85">
                          {decisao.resumo_pontos.slice(0, 5).map((p) => (
                            <li key={p}>{p}</li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  )}
              </dl>
            </section>
          )}

        {decisao.resumo_status === "indisponivel" && (
          <section className="card mb-6 bg-brand-bg/40">
            <p className="text-sm text-brand-ink/65 italic">
              Resumo informativo indisponível para esta decisão. Consulte a
              ementa oficial abaixo.
            </p>
          </section>
        )}

        {/* EMENTA OFICIAL */}
        <section className="card mb-6">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
            <div>
              <h2 className="font-display text-xl font-bold text-brand-ink">
                Ementa oficial
              </h2>
              <p className="text-xs text-brand-ink/55 mt-1">
                Ementa extraída dos dados públicos disponibilizados pelo {tribunal}.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <CopyButton
                text={decisao.ementa}
                label="Copiar ementa"
                copiedLabel="Ementa copiada!"
                variant="ghost"
              />
              <CopyButton
                text={`${decisao.classe ?? ""} ${decisao.numero}`.trim() +
                  (decisao.relator ? `, Rel. ${decisao.relator}` : "") +
                  (decisao.orgao_julgador ? `, ${decisao.orgao_julgador}` : "") +
                  `, ${tribunal}` +
                  (decisao.data_julgamento
                    ? `, julg. ${formatDate(decisao.data_julgamento)}`
                    : "") +
                  ` (${SITE.url}/jurisprudencia/${slug}/${decisao.slug})`}
                label="Copiar referência"
                copiedLabel="Referência copiada!"
                variant="ghost"
              />
            </div>
          </div>
          <div className="prose prose-sm max-w-none text-brand-ink/85 leading-relaxed whitespace-pre-line mt-3">
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
        </section>

        {/* DECISÃO — só quando tem conteúdo útil (não fórmula vazia) */}
        {decisaoTextUseful && (
          <section className="card mb-6">
            <h2 className="font-display text-xl font-bold text-brand-ink mb-1">
              Decisão
            </h2>
            <p className="text-xs text-brand-ink/55 mb-3">
              Conteúdo do campo &quot;decisao&quot; nos dados oficiais do {tribunal}.
            </p>
            <p className="text-sm text-brand-ink/85 leading-relaxed whitespace-pre-line">
              {decisaoTextUseful}
            </p>
          </section>
        )}

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

        {/* FONTE OFICIAL DOS DADOS — componente reutilizável. JSON nunca é
            chamado de inteiro teor. URL técnica ficou só nos hrefs. */}
        <section className="card mb-6">
          <div className="flex items-start gap-3">
            <FileText
              className="w-5 h-5 text-brand-deep flex-shrink-0 mt-0.5"
              aria-hidden
            />
            <div className="flex-1">
              <h2 className="font-display text-base font-bold text-brand-ink mb-1">
                Fonte oficial dos dados
              </h2>
              <p className="text-xs text-brand-ink/65 leading-relaxed mb-4">
                Esta decisão foi extraída de arquivo público disponibilizado
                pelo {tribunal} no Portal de Dados Abertos. Para conferência
                oficial, consulte a fonte indicada abaixo.
              </p>
              <OfficialSourceBox
                source_portal={decisao.source_portal}
                dataset_name={decisao.dataset_name}
                dataset_url={decisao.dataset_url}
                resource_name={decisao.resource_name}
                resource_url={decisao.resource_url}
                source_format={decisao.source_format}
                tribunal={tribunal}
                variant="full"
                copyReference={decisao.url_origem}
              />
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
              {related.map((r) => {
                const compact =
                  (r.resumo_decisao && r.resumo_decisao.trim()) ||
                  (r.resumo_entendimento && r.resumo_entendimento.trim()) ||
                  r.ementa.trim().slice(0, 180);
                return (
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
                          <span className="text-brand-ink/55">
                            — Rel. {r.relator}
                          </span>
                        )}
                        {r.data_julgamento && (
                          <span className="ml-auto text-brand-ink/45">
                            {formatDate(r.data_julgamento)}
                          </span>
                        )}
                      </div>
                      {r.resumo_tema && (
                        <p className="text-xs text-brand-deep/85 font-semibold mb-1 line-clamp-1">
                          {r.resumo_tema}
                        </p>
                      )}
                      <p className="text-sm text-brand-ink/85 line-clamp-2">
                        {compact.length > 180
                          ? compact.slice(0, 180) + "…"
                          : compact}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* Bloco discreto de cross-linking para o diretório de advogados */}
        <section className="card mb-6 bg-brand-bg/40">
          <h2 className="font-display text-base font-bold text-brand-ink mb-2">
            Precisa encontrar advogados relacionados a este tema?
          </h2>
          <p className="text-sm text-brand-ink/75 mb-3 leading-relaxed">
            O AdvAqui organiza perfis de advogados por cidade e área de atuação.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/advogados"
              className="text-sm px-4 py-2 rounded-xl border border-brand-deep text-brand-deep hover:bg-brand-deep hover:text-white transition"
            >
              Buscar advogados por cidade
            </Link>
            {decisao.area_relacionada && (
              <Link
                href={`/advogados`}
                className="text-sm px-4 py-2 rounded-xl border border-brand-line text-brand-ink hover:border-brand-deep transition"
              >
                Ver advogados da área relacionada
              </Link>
            )}
          </div>
        </section>

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
              <Link
                href="/jurisprudencia"
                className="underline hover:text-brand-ink"
              >
                Hub geral de jurisprudência
              </Link>
            </li>
            <li>
              <Link href="/blog" className="underline hover:text-brand-ink">
                Blog jurídico
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
          description:
            decisao.seo_description || decisao.ementa.slice(0, 158),
          datePublished:
            decisao.data_publicacao || decisao.data_julgamento || undefined,
          dateModified:
            decisao.data_publicacao || decisao.data_julgamento || undefined,
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
          keywords: [
            ...(decisao.temas || []),
            ...(decisao.palavras_chave || []),
          ].join(", "),
          isBasedOn: decisao.url_origem,
        }}
      />
    </div>
  );
}
