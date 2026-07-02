import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Compass,
  ChevronRight,
  AlertCircle,
  CheckSquare,
  FileText,
  BookOpen,
  Scale,
  HelpCircle,
  ListChecks,
  Clock,
  Wallet,
  Ban,
  Lightbulb
} from "lucide-react";
import { GUIAS, findGuia, getGuiaConteudo } from "@/lib/data/guias";
import { findGlossarioTermo } from "@/lib/data/glossario";
import { findProblema } from "@/lib/data/problemas-juridicos";
import { findTemaStj } from "@/lib/data/jurisprudencia-temas";
import { SPECIALTIES } from "@/lib/data/specialties";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { CTAFinal } from "@/components/CTAFinal";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import {
  cidadesPrioritariasForContent,
  cityContentAnchor
} from "@/lib/seo/internal-links";
import { SITE } from "@/lib/config";

export const revalidate = 604800;
export const dynamicParams = false;

export function generateStaticParams() {
  return GUIAS.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}) {
  const g = findGuia(params.slug);
  if (!g) {
    return buildMetadata({
      title: "Guia não encontrado",
      description: "Página não encontrada.",
      noIndex: true
    });
  }
  return buildMetadata({
    title: g.titulo,
    description: g.tagline,
    path: `/guias/${g.slug}`
  });
}

export default function GuiaPage({ params }: { params: { slug: string } }) {
  const g = findGuia(params.slug);
  if (!g) notFound();

  const especialidade = SPECIALTIES.find((s) => s.slug === g.area_slug);
  const problemasRel = (g.problemas || [])
    .map((s) => findProblema(s))
    .filter(Boolean);
  const glossarioRel = (g.glossario || [])
    .map((s) => findGlossarioTermo(s))
    .filter(Boolean);
  const temasRel = (g.temas_jurisprudencia || [])
    .map((s) => findTemaStj(s))
    .filter(Boolean);
  const conteudo = getGuiaConteudo(g.slug);

  return (
    <div className="container-narrow py-10">
      <Breadcrumb
        items={[{ label: "Guias", href: "/guias" }, { label: g.titulo }]}
      />

      <article className="card mb-6">
        <div className="flex items-start gap-3 mb-2">
          <Compass
            className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1"
            aria-hidden
          />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              {g.titulo}
            </h1>
            <p className="text-sm text-brand-ink/55 mt-1">
              Guia pilar — {especialidade?.name || "Direito brasileiro"}
            </p>
            <p className="text-base md:text-lg text-brand-ink/85 mt-3 leading-relaxed">
              {g.tagline}
            </p>
          </div>
        </div>

        <section className="mt-6 space-y-3">
          <h2 className="font-display text-xl font-bold text-brand-ink">
            Visão geral
          </h2>
          {g.introducao.map((p, i) => (
            <p key={i} className="text-sm md:text-base text-brand-ink/85 leading-relaxed">
              {p}
            </p>
          ))}
        </section>

        {/* Como funciona na prática */}
        {conteudo?.como_funciona && conteudo.como_funciona.length > 0 && (
          <section className="mt-6 space-y-3">
            <h2 className="font-display text-xl font-bold text-brand-ink">
              Como funciona na prática
            </h2>
            {conteudo.como_funciona.map((p, i) => (
              <p
                key={i}
                className="text-sm md:text-base text-brand-ink/85 leading-relaxed"
              >
                {p}
              </p>
            ))}
          </section>
        )}

        {/* Temas centrais */}
        <section className="mt-6">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-3">
            Temas centrais
          </h2>
          <ul className="space-y-3">
            {g.temas_centrais.map((t, i) => (
              <li
                key={i}
                className="rounded-xl border border-brand-line bg-white p-4"
              >
                <p className="font-semibold text-brand-ink">{t.titulo}</p>
                <p className="text-sm text-brand-ink/80 mt-1 leading-relaxed">
                  {t.descricao}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Passo a passo */}
        {conteudo?.passo_a_passo && conteudo.passo_a_passo.length > 0 && (
          <section className="mt-6">
            <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-brand-deep" aria-hidden />
              Passo a passo: o que fazer
            </h2>
            <ol className="space-y-3">
              {conteudo.passo_a_passo.map((p, i) => (
                <li
                  key={i}
                  className="flex gap-3 rounded-xl border border-brand-line bg-white p-4"
                >
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-deep text-white text-sm font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-brand-ink">{p.titulo}</p>
                    <p className="text-sm text-brand-ink/80 mt-1 leading-relaxed">
                      {p.detalhe}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Prazos importantes */}
        {conteudo?.prazos && conteudo.prazos.length > 0 && (
          <section className="mt-6">
            <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-deep" aria-hidden />
              Prazos que você precisa conhecer
            </h2>
            <ul className="space-y-2">
              {conteudo.prazos.map((p, i) => (
                <li
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 rounded-xl border border-brand-line bg-white p-4"
                >
                  <span className="flex-shrink-0 inline-block w-fit rounded-md bg-brand-deep/10 px-2.5 py-1 text-sm font-bold text-brand-deep">
                    {p.prazo}
                  </span>
                  <span className="text-sm text-brand-ink/80 leading-relaxed">
                    {p.descricao}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Documentos */}
        {conteudo?.documentos && conteudo.documentos.length > 0 && (
          <section className="mt-6">
            <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-deep" aria-hidden />
              Documentos que costumam ser necessários
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {conteudo.documentos.map((d, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm md:text-base text-brand-ink/85 leading-relaxed rounded-lg border border-brand-line bg-white p-3"
                >
                  <CheckSquare
                    className="w-4 h-4 text-brand-deep mt-0.5 flex-shrink-0"
                    aria-hidden
                  />
                  {d}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Custos */}
        {conteudo?.custos && conteudo.custos.length > 0 && (
          <section className="mt-6">
            <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
              <Wallet className="w-5 h-5 text-brand-deep" aria-hidden />
              Quanto custa (e quando é gratuito)
            </h2>
            <ul className="space-y-2">
              {conteudo.custos.map((c, i) => (
                <li
                  key={i}
                  className="text-sm md:text-base text-brand-ink/85 leading-relaxed pl-4 border-l-2 border-brand-line"
                >
                  {c}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Erros comuns */}
        {conteudo?.erros_comuns && conteudo.erros_comuns.length > 0 && (
          <section className="mt-6">
            <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
              <Ban className="w-5 h-5 text-red-500" aria-hidden />
              Erros comuns que prejudicam o caso
            </h2>
            <ul className="space-y-2">
              {conteudo.erros_comuns.map((e, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm md:text-base text-brand-ink/85 leading-relaxed rounded-lg border border-red-100 bg-red-50/50 p-3"
                >
                  <Ban
                    className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0"
                    aria-hidden
                  />
                  {e}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Direitos-chave */}
        {conteudo?.direitos_chave && conteudo.direitos_chave.length > 0 && (
          <section className="mt-6">
            <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-brand-accent2" aria-hidden />
              Direitos que muita gente não conhece
            </h2>
            <ul className="space-y-3">
              {conteudo.direitos_chave.map((d, i) => (
                <li
                  key={i}
                  className="rounded-xl border border-brand-line bg-brand-bg/30 p-4"
                >
                  <p className="font-semibold text-brand-ink">{d.titulo}</p>
                  <p className="text-sm text-brand-ink/80 mt-1 leading-relaxed">
                    {d.detalhe}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Quando procurar */}
        <section className="mt-6">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-2 inline-flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-brand-deep" aria-hidden />
            Quando vale procurar um advogado
          </h2>
          <ul className="space-y-2">
            {g.quando_procurar.map((q, i) => (
              <li
                key={i}
                className="text-sm md:text-base text-brand-ink/85 leading-relaxed pl-4 border-l-2 border-brand-line"
              >
                {q}
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        {g.faq && g.faq.length > 0 && (
          <section className="mt-6">
            <h2 className="font-display text-xl font-bold text-brand-ink mb-3">
              Perguntas frequentes
            </h2>
            <div className="space-y-3">
              {g.faq.map((f, i) => (
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
        )}
      </article>

      {/* Problemas relacionados */}
      {problemasRel.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-brand-deep" aria-hidden />
            Problemas comuns desta área
          </h2>
          <ul className="space-y-2">
            {problemasRel.map((p) => (
              <li key={p!.slug}>
                <Link
                  href={`/problemas-juridicos/${p!.slug}`}
                  className="block group rounded-xl border border-brand-line p-4 hover:border-brand-deep/40 hover:shadow-card transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-semibold text-brand-ink group-hover:text-brand-deep transition">
                        {p!.titulo}
                      </p>
                      <p className="text-sm text-brand-ink/70 mt-1 leading-relaxed">
                        {p!.intencao_curta}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-brand-ink/30 group-hover:text-brand-deep flex-shrink-0 mt-1" aria-hidden />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Glossário */}
      {glossarioRel.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-deep" aria-hidden />
            Termos do glossário
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {glossarioRel.map((t) => (
              <li key={t!.slug}>
                <Link
                  href={`/glossario/${t!.slug}`}
                  className="block group rounded-lg border border-brand-line p-3 hover:border-brand-deep/40 hover:bg-brand-bg/30 transition"
                >
                  <p className="font-semibold text-sm text-brand-ink group-hover:text-brand-deep transition">
                    {t!.termo}
                  </p>
                  <p className="text-xs text-brand-ink/65 mt-0.5 leading-snug">
                    {t!.definicao_curta}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Jurisprudência */}
      {temasRel.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
            <Scale className="w-5 h-5 text-brand-deep" aria-hidden />
            Decisões reais do STJ
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {temasRel.map((t) => (
              <li key={t!.slug}>
                <Link
                  href={`/jurisprudencia/stj/tema/${t!.slug}`}
                  className="block group rounded-lg border border-brand-line p-3 hover:border-brand-deep/40 hover:bg-brand-bg/30 transition"
                >
                  <p className="font-semibold text-sm text-brand-ink group-hover:text-brand-deep transition">
                    {t!.titulo}
                  </p>
                  <p className="text-xs text-brand-ink/65 mt-0.5 leading-snug">
                    {t!.descricao}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* CTA — advogados da área */}
      <aside className="rounded-xl border-l-4 border-brand-deep bg-brand-bg/40 p-4 md:p-5 mb-6">
        <h2 className="font-display text-lg font-bold text-brand-ink mb-2">
          Encontre um advogado da área
        </h2>
        <p className="text-sm md:text-base text-brand-ink/85 leading-relaxed mb-3">
          Guias trazem visão geral, mas decisões concretas sempre dependem do
          caso. Profissionais que atuam em{" "}
          {especialidade?.name?.toLowerCase() || "direito"} estão na nossa
          listagem por cidade.
        </p>
        {especialidade && (
          <Link
            href={`/advogados-de/${especialidade.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-brand-deep text-white hover:bg-brand-deep/90 transition"
          >
            Ver advogados de {especialidade.name}
            <ChevronRight className="w-4 h-4" aria-hidden />
          </Link>
        )}
      </aside>

      {/* T13 — spokes geográficos: guia (hub temático) → páginas de cidade.
          Conjunto de capitais + cidades prioritárias rotacionado por
          hash(slug do guia) — cada guia linka cidades diferentes,
          determinístico entre builds. Anchors variados por hash. */}
      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-2">
          Encontre advogado na sua cidade
        </h2>
        <p className="text-sm text-brand-ink/75 mb-3 leading-relaxed">
          Veja profissionais
          {especialidade ? ` de ${especialidade.name.toLowerCase()}` : ""} que
          atuam nas principais cidades do país. O diretório cobre todas as
          cidades brasileiras.
        </p>
        <div className="flex flex-wrap gap-2">
          {cidadesPrioritariasForContent(g.slug, 8).map((c) => (
            <Link
              key={`${c.uf}-${c.slug}`}
              href={
                especialidade
                  ? `/advogados/${c.uf.toLowerCase()}/${c.slug}/${especialidade.slug}`
                  : `/advogados/${c.uf.toLowerCase()}/${c.slug}`
              }
              className="text-sm px-3 py-1.5 rounded-lg border border-brand-line bg-white text-brand-ink/80 hover:text-brand-deep hover:border-brand-deep/40 transition"
            >
              {cityContentAnchor(g.slug, c, especialidade?.name)}
            </Link>
          ))}
        </div>
      </section>

      <aside
        role="note"
        className="rounded-xl border-l-4 border-amber-400 bg-amber-50 p-4 text-xs md:text-sm text-amber-900 leading-relaxed flex items-start gap-2 mb-6"
      >
        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden />
        <span>
          Este guia é informativo. Cada situação concreta tem particularidades —
          contratos, prazos, jurisprudência local. O AdvAqui não substitui
          consulta jurídica.
        </span>
      </aside>

      <CTAFinal areaSlug={g.area_slug} />

      <p className="text-sm text-brand-ink/65 mt-6">
        <Link href="/guias" className="text-brand-deep hover:underline">
          ← Ver todos os guias
        </Link>
      </p>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Guias", url: "/guias" },
          { name: g.titulo, url: `/guias/${g.slug}` }
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: g.titulo,
          description: g.tagline,
          inLanguage: "pt-BR",
          datePublished: g.atualizado_em,
          dateModified: g.atualizado_em,
          author: { "@type": "Organization", name: SITE.name, url: SITE.url },
          publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${SITE.url}/guias/${g.slug}`
          }
        }}
      />
      {g.faq && g.faq.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: g.faq.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a }
            }))
          }}
        />
      )}
      {conteudo?.passo_a_passo && conteudo.passo_a_passo.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: `${g.titulo}: passo a passo`,
            description: g.tagline,
            inLanguage: "pt-BR",
            step: conteudo.passo_a_passo.map((p, i) => ({
              "@type": "HowToStep",
              position: i + 1,
              name: p.titulo,
              text: p.detalhe
            }))
          }}
        />
      )}
    </div>
  );
}
