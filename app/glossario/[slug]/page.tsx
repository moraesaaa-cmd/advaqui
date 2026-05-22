import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, ChevronRight, FileText, Scale, Lightbulb } from "lucide-react";
import {
  GLOSSARIO,
  findGlossarioTermo,
  relatedGlossario
} from "@/lib/data/glossario";
import { findProblema } from "@/lib/data/problemas-juridicos";
import { findTemaStj } from "@/lib/data/jurisprudencia-temas";
import { findGuiaByArea } from "@/lib/data/guias";
import { SPECIALTIES } from "@/lib/data/specialties";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";

export const revalidate = 604800;
export const dynamicParams = false;

export function generateStaticParams() {
  return GLOSSARIO.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}) {
  const termo = findGlossarioTermo(params.slug);
  if (!termo) {
    return buildMetadata({
      title: "Termo não encontrado",
      description: "Termo não encontrado no glossário.",
      noIndex: true
    });
  }
  return buildMetadata({
    title: `${termo.termo} — Glossário jurídico`,
    description: termo.definicao_curta,
    path: `/glossario/${termo.slug}`
  });
}

export default function GlossarioTermoPage({
  params
}: {
  params: { slug: string };
}) {
  const termo = findGlossarioTermo(params.slug);
  if (!termo) notFound();

  const relacionados = relatedGlossario(termo.slug, 5);
  const problema = termo.problema ? findProblema(termo.problema) : null;
  const tema = termo.tema_jurisprudencia ? findTemaStj(termo.tema_jurisprudencia) : null;
  const areasObj = termo.areas
    .map((s) => SPECIALTIES.find((sp) => sp.slug === s))
    .filter(Boolean) as { slug: string; name: string }[];
  const guiaArea = termo.areas[0] ? findGuiaByArea(termo.areas[0]) : null;

  return (
    <div className="container-narrow py-10">
      <Breadcrumb
        items={[
          { label: "Glossário", href: "/glossario" },
          { label: termo.termo }
        ]}
      />

      <article className="card mb-6">
        <div className="flex items-start gap-3 mb-2">
          <BookOpen
            className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1"
            aria-hidden
          />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              {termo.termo}
            </h1>
            <p className="text-sm text-brand-ink/55 mt-1">
              {areasObj.map((a) => a.name).join(" · ") || "Direito brasileiro"}
            </p>
            <p className="text-base md:text-lg text-brand-ink/85 mt-3 leading-relaxed">
              {termo.definicao_curta}
            </p>
          </div>
        </div>

        {/* Explicação completa */}
        <section className="mt-6 space-y-3">
          <h2 className="font-display text-xl font-bold text-brand-ink">
            Explicação
          </h2>
          {termo.explicacao.map((p, i) => (
            <p key={i} className="text-sm md:text-base text-brand-ink/85 leading-relaxed">
              {p}
            </p>
          ))}
        </section>

        {/* Exemplos */}
        {termo.exemplos && termo.exemplos.length > 0 && (
          <section className="mt-6">
            <h2 className="font-display text-xl font-bold text-brand-ink mb-2 inline-flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-brand-deep" aria-hidden />
              Exemplos práticos
            </h2>
            <ul className="space-y-2">
              {termo.exemplos.map((ex, i) => (
                <li
                  key={i}
                  className="text-sm md:text-base text-brand-ink/85 leading-relaxed pl-4 border-l-2 border-brand-line"
                >
                  {ex}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Variações conhecidas */}
        {termo.variacoes && termo.variacoes.length > 0 && (
          <section className="mt-6">
            <h2 className="font-display text-xl font-bold text-brand-ink mb-2">
              Também conhecido como
            </h2>
            <p className="text-sm text-brand-ink/80">
              {termo.variacoes.join(", ")}
            </p>
          </section>
        )}
      </article>

      {/* Recursos relacionados */}
      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-3">
          Continue lendo
        </h2>

        {problema && (
          <Link
            href={`/problemas-juridicos/${problema.slug}`}
            className="block group mb-2 rounded-xl border border-brand-line p-4 hover:border-brand-deep/40 hover:shadow-card transition"
          >
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
              <div className="flex-1">
                <p className="text-xs text-brand-ink/55 font-semibold uppercase tracking-wide">
                  Problema jurídico
                </p>
                <p className="text-sm md:text-base font-semibold text-brand-ink group-hover:text-brand-deep transition mt-0.5">
                  {problema.titulo}
                </p>
                <p className="text-sm text-brand-ink/70 mt-1 leading-relaxed">
                  {problema.intencao_curta}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-brand-ink/30 group-hover:text-brand-deep flex-shrink-0 mt-1" aria-hidden />
            </div>
          </Link>
        )}

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
                <p className="text-sm text-brand-ink/70 mt-1 leading-relaxed">
                  {tema.descricao}
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
              <BookOpen className="w-5 h-5 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
              <div className="flex-1">
                <p className="text-xs text-brand-ink/55 font-semibold uppercase tracking-wide">
                  Guia completo
                </p>
                <p className="text-sm md:text-base font-semibold text-brand-ink group-hover:text-brand-deep transition mt-0.5">
                  {guiaArea.titulo}
                </p>
                <p className="text-sm text-brand-ink/70 mt-1 leading-relaxed">
                  {guiaArea.tagline}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-brand-ink/30 group-hover:text-brand-deep flex-shrink-0 mt-1" aria-hidden />
            </div>
          </Link>
        )}
      </section>

      {/* Termos relacionados */}
      {relacionados.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-3">
            Termos relacionados
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {relacionados.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/glossario/${r.slug}`}
                  className="block group rounded-lg border border-brand-line p-3 hover:border-brand-deep/40 hover:bg-brand-bg/30 transition"
                >
                  <p className="font-semibold text-sm text-brand-ink group-hover:text-brand-deep transition">
                    {r.termo}
                  </p>
                  <p className="text-xs text-brand-ink/65 mt-0.5 leading-snug">
                    {r.definicao_curta}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* CTA — advogados */}
      <aside className="rounded-xl border-l-4 border-brand-deep bg-brand-bg/40 p-4 md:p-5 mb-6">
        <h2 className="font-display text-lg font-bold text-brand-ink mb-2">
          Esta é uma definição informativa
        </h2>
        <p className="text-sm md:text-base text-brand-ink/85 leading-relaxed">
          O glossário do AdvAqui ajuda a entender o vocabulário jurídico, mas
          cada caso tem detalhes que mudam a aplicação prática.{" "}
          <Link
            href={areasObj[0] ? `/advogados/${areasObj[0].slug}` : "/advogados"}
            className="text-brand-deep underline font-medium"
          >
            Fale com um advogado da sua cidade
          </Link>{" "}
          quando a situação for concreta.
        </p>
      </aside>

      <p className="text-sm text-brand-ink/65">
        <Link href="/glossario" className="text-brand-deep hover:underline">
          ← Ver todo o glossário
        </Link>
      </p>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Glossário", url: "/glossario" },
          { name: termo.termo, url: `/glossario/${termo.slug}` }
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "DefinedTerm",
          name: termo.termo,
          description: termo.definicao_curta,
          inDefinedTermSet: {
            "@type": "DefinedTermSet",
            name: "Glossário jurídico AdvAqui",
            url: `${SITE.url}/glossario`
          },
          url: `${SITE.url}/glossario/${termo.slug}`,
          inLanguage: "pt-BR"
        }}
      />
    </div>
  );
}
