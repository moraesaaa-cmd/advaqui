import Link from "next/link";
import { notFound } from "next/navigation";
import {
  HelpCircle,
  ChevronRight,
  ListChecks,
  AlertCircle,
  CheckSquare,
  FileText,
  BookOpen,
  Scale,
  MapPin
} from "lucide-react";
import {
  PROBLEMAS,
  findProblema,
  relatedProblemas,
  findBaseLegal
} from "@/lib/data/problemas-juridicos";
import { findGlossarioTermo } from "@/lib/data/glossario";
import { findTemaStj } from "@/lib/data/jurisprudencia-temas";
import { findGuiaByArea } from "@/lib/data/guias";
import { SPECIALTIES } from "@/lib/data/specialties";
import { getCidadesPrioritarias } from "@/lib/data/cidades-prioritarias";
import { relatedArticlesForSpecialty, toolsForSpecialty } from "@/lib/seo/internal-links";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { CTAFinal } from "@/components/CTAFinal";
import { ProblemaChecklist } from "@/components/ProblemaChecklist";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, howToSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";

export const revalidate = 604800;
export const dynamicParams = false;

export function generateStaticParams() {
  return PROBLEMAS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}) {
  const p = findProblema(params.slug);
  if (!p) {
    return buildMetadata({
      title: "Problema não encontrado",
      description: "Página não encontrada.",
      noIndex: true
    });
  }
  return buildMetadata({
    title: p.titulo,
    description: p.resumo.slice(0, 160),
    path: `/problemas-juridicos/${p.slug}`
  });
}

export default function ProblemaPage({ params }: { params: { slug: string } }) {
  const p = findProblema(params.slug);
  if (!p) notFound();

  const relacionados = relatedProblemas(p.slug, 4);
  const basesLegais = findBaseLegal(p.slug);
  const tema = p.tema_jurisprudencia ? findTemaStj(p.tema_jurisprudencia) : null;
  const areasObj = p.areas
    .map((s) => SPECIALTIES.find((sp) => sp.slug === s))
    .filter(Boolean) as { slug: string; name: string }[];
  const guiaArea = p.areas[0] ? findGuiaByArea(p.areas[0]) : null;
  const termosGloss = (p.termos_glossario || [])
    .map((slug) => findGlossarioTermo(slug))
    .filter(Boolean);

  return (
    <div className="container-narrow py-10">
      <Breadcrumb
        items={[
          { label: "Problemas jurídicos", href: "/problemas-juridicos" },
          { label: p.titulo }
        ]}
      />

      <article className="card mb-6">
        <div className="flex items-start gap-3 mb-2">
          <HelpCircle
            className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1"
            aria-hidden
          />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              {p.titulo}
            </h1>
            <p className="text-sm text-brand-ink/55 mt-1">
              {areasObj.map((a) => a.name).join(" · ") || "Direito brasileiro"}
            </p>
            <p className="text-base md:text-lg text-brand-ink/85 mt-3 leading-relaxed">
              {p.resumo}
            </p>
          </div>
        </div>

        {/* O que aconteceu */}
        <section className="mt-6">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-2">
            Como costuma acontecer
          </h2>
          <div className="space-y-3">
            {p.situacao.map((s, i) => (
              <p
                key={i}
                className="text-sm md:text-base text-brand-ink/85 leading-relaxed"
              >
                {s}
              </p>
            ))}
          </div>
        </section>

        {/* Passos práticos */}
        <section className="mt-6">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-brand-deep" aria-hidden />
            O que fazer (passo a passo)
          </h2>
          <ol className="space-y-3">
            {p.passos.map((passo, i) => (
              <li
                key={i}
                className="rounded-xl border border-brand-line bg-white p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-brand-deep text-white font-bold text-sm flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-brand-ink">{passo.titulo}</p>
                    <p className="text-sm text-brand-ink/80 mt-1 leading-relaxed">
                      {passo.texto}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Ferramenta interativa — monta o caso e calcula o progresso */}
        <ProblemaChecklist
          titulo={p.titulo}
          documentos={p.documentos ?? []}
          passos={p.passos}
          advogadosHref="/advogados"
        />

        {/* Direitos básicos */}
        <section className="mt-6">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-2 inline-flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-brand-deep" aria-hidden />
            Direitos envolvidos
          </h2>
          <ul className="space-y-2">
            {p.direitos.map((d, i) => (
              <li
                key={i}
                className="text-sm md:text-base text-brand-ink/85 leading-relaxed pl-4 border-l-2 border-brand-line"
              >
                {d}
              </li>
            ))}
          </ul>
        </section>

        {/* Base legal */}
        {basesLegais && basesLegais.length > 0 && (
          <section className="mt-6">
            <h2 className="font-display text-xl font-bold text-brand-ink mb-2 inline-flex items-center gap-2">
              <Scale className="w-5 h-5 text-brand-deep" aria-hidden />
              Base legal
            </h2>
            <ul className="space-y-3">
              {basesLegais.map((b, i) => (
                <li key={i} className="rounded-xl border border-brand-line bg-white p-4">
                  <p className="font-semibold text-sm text-brand-deep">{b.citacao}</p>
                  <p className="text-sm text-brand-ink/80 mt-1 leading-relaxed">{b.dispoe}</p>
                </li>
              ))}
            </ul>
            <p className="text-xs text-brand-ink/55 mt-2 leading-relaxed">
              Referências legais para orientação. A aplicação ao seu caso exige análise por um advogado.
            </p>
          </section>
        )}

        {/* Quando urgente */}
        <aside
          role="note"
          className="mt-6 rounded-xl border-l-4 border-amber-400 bg-amber-50 p-4 text-sm text-amber-900 leading-relaxed flex items-start gap-2"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden />
          <div>
            <p className="font-semibold">Quando procurar advogado com urgência</p>
            <p className="mt-1">{p.quando_urgente}</p>
          </div>
        </aside>

        {/* Documentos */}
        {p.documentos && p.documentos.length > 0 && (
          <section className="mt-6">
            <h2 className="font-display text-xl font-bold text-brand-ink mb-2 inline-flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-deep" aria-hidden />
              Documentos e provas úteis
            </h2>
            <ul className="space-y-2">
              {p.documentos.map((d, i) => (
                <li
                  key={i}
                  className="text-sm md:text-base text-brand-ink/85 leading-relaxed pl-4 border-l-2 border-brand-line"
                >
                  {d}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* FAQ */}
        {p.faq && p.faq.length > 0 && (
          <section className="mt-6">
            <h2 className="font-display text-xl font-bold text-brand-ink mb-3">
              Perguntas frequentes
            </h2>
            <div className="space-y-3">
              {p.faq.map((f, i) => (
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

      {/* Recursos relacionados */}
      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-3">
          Continue se informando
        </h2>

        {tema && (
          <Link
            href={`/jurisprudencia/stj/tema/${tema.slug}`}
            className="block group mb-2 rounded-xl border border-brand-line p-4 hover:border-brand-deep/40 hover:shadow-card transition"
          >
            <div className="flex items-start gap-3">
              <Scale className="w-5 h-5 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
              <div className="flex-1">
                <p className="text-xs text-brand-ink/55 font-semibold uppercase tracking-wide">
                  Decisões reais do STJ
                </p>
                <p className="text-sm md:text-base font-semibold text-brand-ink group-hover:text-brand-deep transition mt-0.5">
                  Jurisprudência sobre {tema.titulo.toLowerCase()}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-brand-ink/30 group-hover:text-brand-deep flex-shrink-0 mt-1" aria-hidden />
            </div>
          </Link>
        )}

        {guiaArea && (
          <Link
            href={`/guias/${guiaArea.slug}`}
            className="block group mb-2 rounded-xl border border-brand-line p-4 hover:border-brand-deep/40 hover:shadow-card transition"
          >
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
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

        {termosGloss.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-brand-ink/55 font-semibold uppercase tracking-wide mb-2">
              Termos do glossário
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {termosGloss.map((t) => (
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
          </div>
        )}
      </section>

      {/* Ferramentas relacionadas */}
      {(() => {
        const tools = areasObj[0] ? toolsForSpecialty(areasObj[0].slug, 3) : [];
        if (tools.length === 0) return null;
        return (
          <section className="card mb-6">
            <h2 className="font-display text-xl font-bold text-brand-ink mb-3">
              Ferramentas que podem ajudar
            </h2>
            <div className="space-y-2">
              {tools.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="block group rounded-lg border border-brand-line p-3 hover:border-brand-deep/40 hover:bg-brand-bg/30 transition"
                >
                  <p className="font-semibold text-sm text-brand-ink group-hover:text-brand-deep transition">
                    {t.label}
                  </p>
                  <p className="text-xs text-brand-ink/65 mt-0.5">
                    {t.desc}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        );
      })()}

      {/* Encontre ajuda na sua cidade — links para as 50 cidades prioritárias */}
      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
          <MapPin className="w-5 h-5 text-brand-deep" aria-hidden />
          {p.titulo.replace(/\?$/, "").replace(/\.$/, "")} na sua cidade
        </h2>
        <p className="text-sm text-brand-ink/75 mb-3 leading-relaxed">
          Veja o conteúdo aplicado à sua cidade, com advogados que atendem ali.
        </p>
        <ul className="grid gap-1.5 sm:grid-cols-2 md:grid-cols-3 text-sm">
          {getCidadesPrioritarias().map((c) => (
            <li key={`${c.uf}-${c.slug}`}>
              <Link
                href={`/problemas-juridicos/${p.slug}/em/${c.slug}-${c.uf.toLowerCase()}`}
                className="block px-2 py-1.5 rounded-md text-brand-ink hover:bg-brand-bg/40 hover:text-brand-deep transition"
              >
                <span aria-hidden>→</span> {c.nome_completo}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Outros problemas relacionados */}
      {relacionados.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-3">
            Outras situações parecidas
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {relacionados.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/problemas-juridicos/${r.slug}`}
                  className="block group rounded-lg border border-brand-line p-3 hover:border-brand-deep/40 hover:bg-brand-bg/30 transition"
                >
                  <p className="font-semibold text-sm text-brand-ink group-hover:text-brand-deep transition">
                    {r.titulo}
                  </p>
                  <p className="text-xs text-brand-ink/65 mt-0.5 leading-snug">
                    {r.intencao_curta}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Blog — artigos relacionados à especialidade */}
      {(() => {
        const blogPosts = areasObj[0] ? relatedArticlesForSpecialty(areasObj[0].slug, 3) : [];
        if (blogPosts.length === 0) return null;
        return (
          <section className="card mb-6">
            <h2 className="font-display text-xl font-bold text-brand-ink mb-3">
              Artigos sobre {areasObj[0].name.toLowerCase()}
            </h2>
            <div className="space-y-2">
              {blogPosts.map((a) => (
                <Link
                  key={a.slug}
                  href={`/blog/${a.slug}`}
                  className="block group rounded-lg border border-brand-line p-3 hover:border-brand-deep/40 hover:bg-brand-bg/30 transition"
                >
                  <p className="font-semibold text-sm text-brand-ink group-hover:text-brand-deep transition">
                    {a.title}
                  </p>
                  <p className="text-xs text-brand-ink/65 mt-0.5">
                    {a.readingMinutes} min de leitura
                  </p>
                </Link>
              ))}
            </div>
          </section>
        );
      })()}

      {/* CTA — advogados */}
      <aside className="rounded-xl border-l-4 border-brand-deep bg-brand-bg/40 p-4 md:p-5 mb-6">
        <h2 className="font-display text-lg font-bold text-brand-ink mb-2">
          Cada caso é único
        </h2>
        <p className="text-sm md:text-base text-brand-ink/85 leading-relaxed">
          Este guia é informativo. Para decisões concretas — prazos, valores,
          documentos do seu caso —{" "}
          <Link
            href={areasObj[0] ? `/advogados-de/${areasObj[0].slug}` : "/advogados"}
            className="text-brand-deep underline font-medium"
          >
            fale com um advogado da sua cidade
          </Link>{" "}
          que conhece a Justiça local.
        </p>
      </aside>

      <CTAFinal areaSlug={areasObj[0]?.slug} problemSlug={p.slug} />

      <p className="text-sm text-brand-ink/65 mt-6">
        <Link
          href="/problemas-juridicos"
          className="text-brand-deep hover:underline"
        >
          ← Ver todos os problemas jurídicos
        </Link>
      </p>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Problemas jurídicos", url: "/problemas-juridicos" },
          { name: p.titulo, url: `/problemas-juridicos/${p.slug}` }
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: p.titulo,
          description: p.resumo,
          inLanguage: "pt-BR",
          datePublished: p.atualizado_em,
          dateModified: p.atualizado_em,
          author: { "@type": "Organization", name: SITE.name, url: SITE.url },
          publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${SITE.url}/problemas-juridicos/${p.slug}`
          }
        }}
      />
      {p.faq && p.faq.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: p.faq.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a }
            }))
          }}
        />
      )}
      {p.passos && p.passos.length > 0 && (
        <JsonLd
          data={howToSchema(
            p.titulo,
            p.resumo,
            p.passos.map((passo) => ({ name: passo.titulo, text: passo.texto })),
            `/problemas-juridicos/${p.slug}`
          )}
        />
      )}
    </div>
  );
}
