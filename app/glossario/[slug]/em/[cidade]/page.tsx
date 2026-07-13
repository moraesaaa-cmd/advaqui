import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BookOpen,
  ChevronRight,
  MapPin,
  AlertCircle,
  Scale,
  HelpCircle,
  Compass,
  Lightbulb
} from "lucide-react";
import {
  GLOSSARIO,
  findGlossarioTermo,
  relatedGlossario
} from "@/lib/data/glossario";
import { findCity } from "@/lib/data/cities";
import {
  getCidadesPrioritarias,
  getCidadesSSG,
  cidadesPrioritariasMesmaRegiao
} from "@/lib/data/cidades-prioritarias";
import { findProblema } from "@/lib/data/problemas-juridicos";
import { findTemaStj } from "@/lib/data/jurisprudencia-temas";
import { findGuiaByArea } from "@/lib/data/guias";
import { SPECIALTIES } from "@/lib/data/specialties";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { fitDescription } from "@/lib/seo/local-titles";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { localLegalContext } from "@/lib/seo/local-context";
import { SITE } from "@/lib/config";

/**
 * /glossario/[slug]/em/[cidade-uf] — termo aplicado à cidade.
 *
 * 153 termos × 5571 cidades IBGE = 852.363 URLs.
 *
 * Híbrido SSG + ISR:
 *  - SSG nas 50 cidades prioritárias × 20 termos (1000 pré-geradas)
 *  - ISR nas demais 5521 × 20 — geradas sob demanda
 *
 * Conteúdo único: definição do termo + parágrafo de aplicação local +
 * cross-links pra problema, jurisprudência e advogados na cidade.
 */

// force-dynamic: sob demanda, SEM gravar em disco — impede o acúmulo que
// enchia o disco. URLs seguem funcionando (geradas na hora).
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  const cidades = getCidadesSSG();
  const params: Array<{ slug: string; cidade: string }> = [];
  for (const t of GLOSSARIO) {
    for (const c of cidades) {
      params.push({
        slug: t.slug,
        cidade: `${c.slug}-${c.uf.toLowerCase()}`
      });
    }
  }
  return params;
}

function parseCidadeParam(
  param: string
): { uf: string; citySlug: string; cidadeNome: string } | null {
  const m = param.match(/^(.+)-([a-z]{2})$/i);
  if (!m) return null;
  const citySlug = m[1].toLowerCase();
  const uf = m[2].toUpperCase();
  const city = findCity(uf, citySlug);
  if (!city) return null;
  return { uf, citySlug, cidadeNome: city.name };
}

export async function generateMetadata({
  params
}: {
  params: { slug: string; cidade: string };
}) {
  const termo = findGlossarioTermo(params.slug);
  const cidadeInfo = parseCidadeParam(params.cidade);
  // Cidade inválida já morre no middleware com 404 real; aqui fica a defesa
  // do termo (noindex — notFound() não vira status neste Next self-hosted).
  if (!termo || !cidadeInfo) {
    return buildMetadata({
      title: "Página não encontrada",
      description: "Página não encontrada",
      noIndex: true
    });
  }
  const title = `${termo.termo} em ${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}`;
  const description = `${termo.definicao_curta} Aplicação prática em ${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}.`;
  return buildMetadata({
    title,
    description: fitDescription(description, 158),
    path: `/glossario/${termo.slug}/em/${params.cidade}`
  });
}

export default function GlossarioTermoCidadePage({
  params
}: {
  params: { slug: string; cidade: string };
}) {
  const termo = findGlossarioTermo(params.slug);
  const cidadeInfo = parseCidadeParam(params.cidade);
  if (!termo || !cidadeInfo) notFound();

  const ufLower = cidadeInfo.uf.toLowerCase();
  const problema = termo.problema ? findProblema(termo.problema) : null;
  const tema = termo.tema_jurisprudencia
    ? findTemaStj(termo.tema_jurisprudencia)
    : null;
  const areaSlug = termo.areas[0];
  const areaObj = areaSlug ? SPECIALTIES.find((s) => s.slug === areaSlug) : null;
  const guia = areaSlug ? findGuiaByArea(areaSlug) : null;
  const vizinhas = cidadesPrioritariasMesmaRegiao(
    cidadeInfo.uf,
    cidadeInfo.citySlug,
    6
  );
  const outrosTermos = relatedGlossario(termo.slug, 4);

  return (
    <div className="container-narrow py-10">
      <Breadcrumb
        items={[
          { label: "Glossário", href: "/glossario" },
          { label: termo.termo, href: `/glossario/${termo.slug}` },
          { label: `${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}` }
        ]}
      />

      <article className="card mb-6">
        <div className="flex items-start gap-3 mb-2">
          <BookOpen className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              {termo.termo} em {cidadeInfo.cidadeNome}, {cidadeInfo.uf}
            </h1>
            <p className="text-sm text-brand-ink/55 mt-1 inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" aria-hidden />
              {cidadeInfo.cidadeNome} · {cidadeInfo.uf}
              {areaObj && (
                <>
                  <span aria-hidden> · </span>
                  <span>{areaObj.name}</span>
                </>
              )}
            </p>
            <p className="text-base md:text-lg text-brand-ink/85 mt-3 leading-relaxed">
              {termo.definicao_curta}
            </p>
          </div>
        </div>

        <section className="mt-6 space-y-3">
          <h2 className="font-display text-xl font-bold text-brand-ink">
            Explicação
          </h2>
          {termo.explicacao.map((p, i) => (
            <p
              key={i}
              className="text-sm md:text-base text-brand-ink/85 leading-relaxed"
            >
              {p}
            </p>
          ))}
          {localLegalContext({
            cityName: cidadeInfo.cidadeNome,
            uf: cidadeInfo.uf,
            citySlug: cidadeInfo.citySlug,
            assunto: termo.slug
          }).map((par, i) => (
            <p
              key={`ctx-${i}`}
              className="text-sm md:text-base text-brand-ink/85 leading-relaxed"
            >
              {par}
            </p>
          ))}
        </section>

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
      </article>

      {/* Cross-links */}
      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-3">
          Continue se informando em {cidadeInfo.cidadeNome}
        </h2>

        {problema && (
          <Link
            href={`/problemas-juridicos/${problema.slug}/em/${params.cidade}`}
            className="block group mb-2 rounded-xl border border-brand-line p-4 hover:border-brand-deep/40 hover:shadow-card transition"
          >
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
              <div className="flex-1">
                <p className="text-xs text-brand-ink/55 font-semibold uppercase tracking-wide">
                  Problema relacionado em {cidadeInfo.cidadeNome}
                </p>
                <p className="text-sm md:text-base font-semibold text-brand-ink group-hover:text-brand-deep transition mt-0.5">
                  {problema.titulo}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-brand-ink/30 group-hover:text-brand-deep flex-shrink-0 mt-1" aria-hidden />
            </div>
          </Link>
        )}

        {tema && (
          <Link
            href={`/jurisprudencia/stj/tema/${tema.slug}/em/${params.cidade}`}
            className="block group mb-2 rounded-xl border border-brand-line p-4 hover:border-brand-deep/40 hover:shadow-card transition"
          >
            <div className="flex items-start gap-3">
              <Scale className="w-5 h-5 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
              <div className="flex-1">
                <p className="text-xs text-brand-ink/55 font-semibold uppercase tracking-wide">
                  Jurisprudência STJ em {cidadeInfo.cidadeNome}
                </p>
                <p className="text-sm md:text-base font-semibold text-brand-ink group-hover:text-brand-deep transition mt-0.5">
                  {tema.titulo}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-brand-ink/30 group-hover:text-brand-deep flex-shrink-0 mt-1" aria-hidden />
            </div>
          </Link>
        )}

        {areaSlug && (
          <Link
            href={`/advogados-de/${areaSlug}/em/${params.cidade}`}
            className="block group mb-2 rounded-xl border border-brand-line p-4 hover:border-brand-deep/40 hover:shadow-card transition"
          >
            <div className="flex items-start gap-3">
              <Scale className="w-5 h-5 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
              <div className="flex-1">
                <p className="text-xs text-brand-ink/55 font-semibold uppercase tracking-wide">
                  Advogado da área em {cidadeInfo.cidadeNome}
                </p>
                <p className="text-sm md:text-base font-semibold text-brand-ink group-hover:text-brand-deep transition mt-0.5">
                  Advogado de {areaObj?.name?.toLowerCase() || areaSlug} em {cidadeInfo.cidadeNome}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-brand-ink/30 group-hover:text-brand-deep flex-shrink-0 mt-1" aria-hidden />
            </div>
          </Link>
        )}

        {guia && (
          <Link
            href={`/guias/${guia.slug}`}
            className="block group rounded-xl border border-brand-line p-4 hover:border-brand-deep/40 hover:shadow-card transition"
          >
            <div className="flex items-start gap-3">
              <Compass className="w-5 h-5 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
              <div className="flex-1">
                <p className="text-xs text-brand-ink/55 font-semibold uppercase tracking-wide">
                  Guia completo
                </p>
                <p className="text-sm md:text-base font-semibold text-brand-ink group-hover:text-brand-deep transition mt-0.5">
                  {guia.titulo}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-brand-ink/30 group-hover:text-brand-deep flex-shrink-0 mt-1" aria-hidden />
            </div>
          </Link>
        )}
      </section>

      {/* Termos relacionados na cidade */}
      {outrosTermos.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-3">
            Outros termos em {cidadeInfo.cidadeNome}
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {outrosTermos.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/glossario/${r.slug}/em/${params.cidade}`}
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

      {/* Vizinhas */}
      {vizinhas.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-3">
            {termo.termo} em cidades próximas
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {vizinhas.map((v) => (
              <li key={`${v.uf}-${v.slug}`}>
                <Link
                  href={`/glossario/${termo.slug}/em/${v.slug}-${v.uf.toLowerCase()}`}
                  className="block group rounded-lg border border-brand-line p-3 hover:border-brand-deep/40 hover:bg-brand-bg/30 transition"
                >
                  <p className="font-semibold text-sm text-brand-ink group-hover:text-brand-deep transition">
                    {v.nome_completo}
                  </p>
                  <p className="text-xs text-brand-ink/65 mt-0.5 leading-snug">
                    {v.regiao}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <aside
        role="note"
        className="rounded-xl border-l-4 border-brand-deep bg-brand-bg/40 p-4 md:p-5 mb-6"
      >
        <h2 className="font-display text-lg font-bold text-brand-ink mb-2">
          Esta é uma definição informativa
        </h2>
        <p className="text-sm md:text-base text-brand-ink/85 leading-relaxed">
          O glossário do AdvAqui ajuda a entender o vocabulário jurídico, mas
          cada caso tem detalhes que mudam a aplicação prática.{" "}
          <Link
            href={`/advogados/${ufLower}/${cidadeInfo.citySlug}`}
            className="text-brand-deep underline font-medium"
          >
            Fale com um advogado de {cidadeInfo.cidadeNome}, {cidadeInfo.uf}
          </Link>{" "}
          quando a situação for concreta.
        </p>
      </aside>

      <p className="text-sm text-brand-ink/65">
        <Link
          href={`/glossario/${termo.slug}`}
          className="text-brand-deep hover:underline"
        >
          ← Voltar à definição geral de {termo.termo.toLowerCase()}
        </Link>
      </p>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Glossário", url: "/glossario" },
          { name: termo.termo, url: `/glossario/${termo.slug}` },
          {
            name: `${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}`,
            url: `/glossario/${termo.slug}/em/${params.cidade}`
          }
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
          url: `${SITE.url}/glossario/${termo.slug}/em/${params.cidade}`,
          inLanguage: "pt-BR"
        }}
      />
    </div>
  );
}
