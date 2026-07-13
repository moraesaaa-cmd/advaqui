import Link from "next/link";
import { notFound } from "next/navigation";
import {
  HelpCircle,
  ChevronRight,
  ListChecks,
  AlertCircle,
  CheckSquare,
  MapPin,
  Scale,
  Users,
  Compass,
  ArrowRight
} from "lucide-react";
import {
  PROBLEMAS,
  findProblema,
  relatedProblemas
} from "@/lib/data/problemas-juridicos";
import { findCity, getAllCities, nearbyCities } from "@/lib/data/cities";
import { getCidadesSSG } from "@/lib/data/cidades-prioritarias";
import { findGlossarioTermo } from "@/lib/data/glossario";
import { findTemaStj } from "@/lib/data/jurisprudencia-temas";
import { findGuiaByArea } from "@/lib/data/guias";
import { SPECIALTIES } from "@/lib/data/specialties";
import { getLawyersForCity } from "@/lib/data/lawyers";
import { LawyerCard } from "@/components/LawyerCard";
import { ProblemaChecklist } from "@/components/ProblemaChecklist";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { fitDescription } from "@/lib/seo/local-titles";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";

/**
 * /problemas-juridicos/[slug]/em/[cidade] — combinação problema x cidade.
 *
 * 20 problemas x 5571 cidades IBGE = 111.420 URLs cauda longa indexáveis.
 *
 * Estratégia híbrida:
 *  - SSG nas 27 capitais x 20 problemas (540 pré-geradas no build)
 *  - ISR (dynamicParams = true) nas 5544 cidades restantes — geradas
 *    sob demanda no primeiro acesso e cacheadas por 7 dias (revalidate=604800)
 *  - notFound() se a "cidade-uf" não existir na base IBGE — evita lixo
 *
 * Conteúdo único por combinação:
 *  - H1, title, description e intro contextualizam o problema na cidade
 *  - Lista advogados que atuam ali (via getLawyersForCity)
 *  - Links pra cidades vizinhas (nearbyCities — mesmo estado, vizinhas alfabeticamente)
 *  - Links pro diretório de advogados por especialidade na cidade
 *  - Reaproveita passos práticos, documentos e direitos do problema base
 *  - Não substitui /problemas-juridicos/[slug] (geral) — canonical próprio
 */

export const revalidate = 604800;
export const dynamicParams = true;

const PROBLEMA_SLUGS = PROBLEMAS.map((p) => p.slug);

export function generateStaticParams() {
  const capitals = getCidadesSSG();
  const params: Array<{ slug: string; cidade: string }> = [];
  for (const slug of PROBLEMA_SLUGS) {
    for (const c of capitals) {
      params.push({
        slug,
        cidade: `${c.slug}-${c.uf.toLowerCase()}`
      });
    }
  }
  return params;
}

/** Resolve "cidade-uf" -> { uf, citySlug, city } com defesa.
 *  Aceita qualquer cidade do IBGE (não só capitais) — usado pra ISR. */
function parseCidadeParam(param: string) {
  // Espera "slug-uf" — UF tem exatamente 2 letras
  const m = param.match(/^(.+)-([a-z]{2})$/i);
  if (!m) return null;
  const citySlug = m[1].toLowerCase();
  const uf = m[2].toUpperCase();
  const city = findCity(uf, citySlug);
  if (!city) return null;
  return { uf, citySlug, cidadeNome: city.name, city };
}

export async function generateMetadata({
  params
}: {
  params: { slug: string; cidade: string };
}) {
  const problema = findProblema(params.slug);
  const cidadeInfo = parseCidadeParam(params.cidade);
  if (!problema || !cidadeInfo) {
    return buildMetadata({
      title: "Página não encontrada",
      description: "Página não encontrada",
      noIndex: true
    });
  }
  const tituloLocal = `${problema.titulo.replace(/\?$/, "").replace(/\.$/, "")} em ${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}`;
  const descricaoLocal = `${problema.intencao_curta} Veja como agir em ${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}, com advogados que atuam na cidade.`;
  return buildMetadata({
    title: tituloLocal,
    description: fitDescription(descricaoLocal, 158),
    path: `/problemas-juridicos/${problema.slug}/em/${params.cidade}`
  });
}

export default async function ProblemaPorCidadePage({
  params
}: {
  params: { slug: string; cidade: string };
}) {
  const problema = findProblema(params.slug);
  const cidadeInfo = parseCidadeParam(params.cidade);
  if (!problema || !cidadeInfo) notFound();

  const tema = problema.tema_jurisprudencia
    ? findTemaStj(problema.tema_jurisprudencia)
    : null;
  const areasObj = problema.areas
    .map((s) => SPECIALTIES.find((sp) => sp.slug === s))
    .filter(Boolean) as { slug: string; name: string }[];
  const guiaArea = problema.areas[0] ? findGuiaByArea(problema.areas[0]) : null;
  const termosGloss = (problema.termos_glossario || [])
    .map((slug) => findGlossarioTermo(slug))
    .filter(Boolean);

  // Buscar advogados da cidade — silencia erro, mostra lista vazia se banco off
  let lawyers: Awaited<ReturnType<typeof getLawyersForCity>> = [];
  try {
    lawyers = await getLawyersForCity(cidadeInfo.uf, cidadeInfo.citySlug);
  } catch {
    lawyers = [];
  }

  // Filtra advogados das áreas do problema, se houver
  const lawyersDaArea = lawyers.filter(
    (l) =>
      problema.areas.some((a) =>
        (l.specialties || []).some(
          (s) => s.toLowerCase() === a.toLowerCase() ||
                  SPECIALTIES.find((sp) => sp.slug === a)?.name.toLowerCase() ===
                  s.toLowerCase()
        )
      )
  );
  const lawyersExibir = lawyersDaArea.length > 0 ? lawyersDaArea : lawyers;
  const lawyersExibirTop = lawyersExibir.slice(0, 6);

  // Cidades vizinhas (mesmo estado, proximidade alfabética)
  const vizinhas = nearbyCities(cidadeInfo.city, 8);

  const outrosProblemasArea = relatedProblemas(problema.slug, 5);
  const tituloLocal = `${problema.titulo.replace(/\?$/, "").replace(/\.$/, "")} em ${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}`;
  const ufLower = cidadeInfo.uf.toLowerCase();

  return (
    <div className="container-narrow py-10">
      <Breadcrumb
        items={[
          { label: "Problemas jurídicos", href: "/problemas-juridicos" },
          {
            label: problema.titulo,
            href: `/problemas-juridicos/${problema.slug}`
          },
          { label: `${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}` }
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
              {tituloLocal}
            </h1>
            <p className="text-sm text-brand-ink/55 mt-1 inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" aria-hidden />
              {cidadeInfo.cidadeNome} · {cidadeInfo.uf}
              {areasObj.length > 0 && (
                <>
                  <span aria-hidden> · </span>
                  <span>{areasObj.map((a) => a.name).join(" · ")}</span>
                </>
              )}
            </p>
            <p className="text-base md:text-lg text-brand-ink/85 mt-3 leading-relaxed">
              {problema.intencao_curta}
            </p>
            <p className="text-sm md:text-base text-brand-ink/75 mt-2 leading-relaxed">
              {problema.resumo}
            </p>
          </div>
        </div>

        {/* Contexto local */}
        <div className="mt-4 rounded-xl bg-brand-bg/40 border border-brand-line p-4">
          <p className="text-sm md:text-base text-brand-ink/85 leading-relaxed">
            Se você está em {cidadeInfo.cidadeNome}, procure um advogado{" "}
            {areasObj[0] ? (
              <Link
                href={`/advogados/${ufLower}/${cidadeInfo.citySlug}/${areasObj[0].slug}`}
                className="text-brand-deep underline font-medium"
              >
                {areasObj[0].name.toLowerCase()}
              </Link>
            ) : (
              "especializado"
            )}{" "}
            na região. A orientação técnica é a mesma em todo o Brasil, mas prazos
            administrativos locais, varas competentes e canais extrajudiciais
            (Procon, defensoria pública, OAB seccional) variam por cidade.
          </p>
        </div>

        {/* Conteúdo — situação */}
        <section className="mt-6">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-2">
            Como costuma acontecer
          </h2>
          <div className="space-y-3">
            {problema.situacao.map((s, i) => (
              <p
                key={i}
                className="text-sm md:text-base text-brand-ink/85 leading-relaxed"
              >
                {s}
              </p>
            ))}
          </div>
        </section>

        {/* Passos */}
        <section className="mt-6">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-brand-deep" aria-hidden />
            O que fazer (passo a passo)
          </h2>
          <ol className="space-y-3">
            {problema.passos.map((passo, i) => (
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
          titulo={problema.titulo}
          documentos={problema.documentos ?? []}
          passos={problema.passos}
          advogadosHref={`/advogados/${ufLower}/${cidadeInfo.citySlug}`}
        />

        {/* Direitos */}
        <section className="mt-6">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-2 inline-flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-brand-deep" aria-hidden />
            Direitos envolvidos
          </h2>
          <ul className="space-y-2">
            {problema.direitos.map((d, i) => (
              <li
                key={i}
                className="text-sm md:text-base text-brand-ink/85 leading-relaxed pl-4 border-l-2 border-brand-line"
              >
                {d}
              </li>
            ))}
          </ul>
        </section>

        {/* Urgência */}
        <aside
          role="note"
          className="mt-6 rounded-xl border-l-4 border-amber-400 bg-amber-50 p-4 text-sm text-amber-900 leading-relaxed flex items-start gap-2"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden />
          <div>
            <p className="font-semibold">Quando agir com urgência</p>
            <p className="mt-1">{problema.quando_urgente}</p>
          </div>
        </aside>
      </article>

      {/* Encontre advogado por especialidade na cidade */}
      {areasObj.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-brand-deep" aria-hidden />
            Encontre advogado em {cidadeInfo.cidadeNome}
          </h2>
          <p className="text-sm text-brand-ink/75 mb-3 leading-relaxed">
            Áreas do direito relacionadas a esta situação:
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {areasObj.map((area) => (
              <li key={area.slug}>
                <Link
                  href={`/advogados/${ufLower}/${cidadeInfo.citySlug}/${area.slug}`}
                  className="block group rounded-xl border border-brand-line p-4 hover:border-brand-deep/40 hover:shadow-card transition"
                >
                  <p className="font-semibold text-sm text-brand-ink group-hover:text-brand-deep transition">
                    Advogado {area.name} em {cidadeInfo.cidadeNome}
                  </p>
                  <p className="text-xs text-brand-ink/65 mt-0.5 leading-snug">
                    Ver profissionais cadastrados
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Advogados em CIDADE para a área */}
      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-deep" aria-hidden />
          Advogados em {cidadeInfo.cidadeNome}
        </h2>
        {lawyersExibirTop.length === 0 ? (
          <div className="rounded-xl bg-brand-bg/40 border border-brand-line p-4 text-sm text-brand-ink/80 leading-relaxed">
            <p>
              Ainda não temos advogados cadastrados em {cidadeInfo.cidadeNome}/
              {cidadeInfo.uf} para esta área. Veja{" "}
              <Link
                href={`/advogados/${ufLower}/${cidadeInfo.citySlug}`}
                className="text-brand-deep underline font-medium"
              >
                todos os advogados de {cidadeInfo.cidadeNome}
              </Link>{" "}
              ou{" "}
              <Link href="/cadastro" className="text-brand-deep underline">
                cadastre-se como o primeiro advogado
              </Link>
              .
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-brand-ink/75 mb-3 leading-relaxed">
              {lawyersDaArea.length > 0
                ? `Profissionais cadastrados em ${cidadeInfo.cidadeNome} que atuam em ${areasObj[0]?.name?.toLowerCase() || "áreas relacionadas"}.`
                : `Profissionais cadastrados em ${cidadeInfo.cidadeNome}, prontos para atender no caso.`}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {lawyersExibirTop.map((lawyer) => (
                <LawyerCard key={lawyer.id} lawyer={lawyer} />
              ))}
            </div>
            <p className="mt-4 text-sm">
              <Link
                href={`/advogados/${ufLower}/${cidadeInfo.citySlug}`}
                className="text-brand-deep hover:underline font-medium"
              >
                Ver todos os advogados de {cidadeInfo.cidadeNome} →
              </Link>
            </p>
          </>
        )}
      </section>

      {/* Cross-links: tema STJ, glossário, guia */}
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
                  Jurisprudência STJ
                </p>
                <p className="text-sm md:text-base font-semibold text-brand-ink group-hover:text-brand-deep transition mt-0.5">
                  Decisões sobre {tema.titulo.toLowerCase()}
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
              <Compass className="w-5 h-5 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
              <div className="flex-1">
                <p className="text-xs text-brand-ink/55 font-semibold uppercase tracking-wide">
                  Guia completo da área
                </p>
                <p className="text-sm md:text-base font-semibold text-brand-ink group-hover:text-brand-deep transition mt-0.5">
                  {guiaArea.titulo}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-brand-ink/30 group-hover:text-brand-deep flex-shrink-0 mt-1" aria-hidden />
            </div>
          </Link>
        )}

        <Link
          href={`/problemas-juridicos/${problema.slug}`}
          className="block group mb-2 rounded-xl border border-brand-line p-4 hover:border-brand-deep/40 hover:bg-brand-bg/30 transition"
        >
          <div className="flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
            <div className="flex-1">
              <p className="text-xs text-brand-ink/55 font-semibold uppercase tracking-wide">
                Página geral do problema
              </p>
              <p className="text-sm md:text-base font-semibold text-brand-ink group-hover:text-brand-deep transition mt-0.5">
                {problema.titulo}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-brand-ink/30 group-hover:text-brand-deep flex-shrink-0 mt-1" aria-hidden />
          </div>
        </Link>

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

      {/* Outros problemas da área */}
      {outrosProblemasArea.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-3">
            Outras situações em {cidadeInfo.cidadeNome}
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {outrosProblemasArea.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/problemas-juridicos/${r.slug}/em/${params.cidade}`}
                  className="block group rounded-lg border border-brand-line p-3 hover:border-brand-deep/40 hover:bg-brand-bg/30 transition"
                >
                  <p className="font-semibold text-sm text-brand-ink group-hover:text-brand-deep transition">
                    {r.titulo}
                  </p>
                  <p className="text-xs text-brand-ink/65 mt-0.5 leading-snug">
                    Em {cidadeInfo.cidadeNome}, {cidadeInfo.uf}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Cidades próximas com o mesmo problema */}
      {vizinhas.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-3">
            {problema.titulo.replace(/\?$/, "").replace(/\.$/, "")} em cidades próximas
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            {vizinhas.map((c) => (
              <li key={`${c.uf}-${c.slug}`}>
                <Link
                  href={`/problemas-juridicos/${problema.slug}/em/${c.slug}-${c.uf.toLowerCase()}`}
                  className="block group rounded-lg border border-brand-line p-3 hover:border-brand-deep/40 hover:bg-brand-bg/30 transition"
                >
                  <p className="font-semibold text-sm text-brand-ink group-hover:text-brand-deep transition">
                    {c.name}, {c.uf}
                  </p>
                  <p className="text-xs text-brand-ink/65 mt-0.5 leading-snug">
                    {c.state}
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
          Cada caso é único
        </h2>
        <p className="text-sm md:text-base text-brand-ink/85 leading-relaxed">
          Este guia é informativo. Para decisões concretas — prazos, valores,
          documentos do seu caso —{" "}
          <Link
            href={
              areasObj[0]
                ? `/advogados/${ufLower}/${cidadeInfo.citySlug}/${areasObj[0].slug}`
                : `/advogados/${ufLower}/${cidadeInfo.citySlug}`
            }
            className="text-brand-deep underline font-medium"
          >
            fale com um advogado de {cidadeInfo.cidadeNome}
          </Link>{" "}
          que conhece a Justiça local.
        </p>
      </aside>

      <aside
        role="note"
        className="rounded-xl border-l-4 border-amber-400 bg-amber-50 p-4 text-xs md:text-sm text-amber-900 leading-relaxed flex items-start gap-2 mb-6"
      >
        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden />
        <span>
          Esta página é informativa. Cada caso concreto exige análise por
          advogado que conheça as particularidades de {cidadeInfo.cidadeNome}/
          {cidadeInfo.uf} — prazos administrativos locais, varas competentes,
          jurisprudência regional. O AdvAqui não substitui consulta jurídica.
        </span>
      </aside>

      <p className="text-sm text-brand-ink/65">
        <Link
          href={`/problemas-juridicos/${problema.slug}`}
          className="text-brand-deep hover:underline"
        >
          ← Voltar à página geral do problema
        </Link>
      </p>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Problemas jurídicos", url: "/problemas-juridicos" },
          { name: problema.titulo, url: `/problemas-juridicos/${problema.slug}` },
          {
            name: `${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}`,
            url: `/problemas-juridicos/${problema.slug}/em/${params.cidade}`
          }
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: tituloLocal,
          description: problema.resumo,
          inLanguage: "pt-BR",
          datePublished: problema.atualizado_em,
          dateModified: problema.atualizado_em,
          author: { "@type": "Organization", name: SITE.name, url: SITE.url },
          publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${SITE.url}/problemas-juridicos/${problema.slug}/em/${params.cidade}`
          },
          spatialCoverage: {
            "@type": "Place",
            name: `${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}`,
            address: {
              "@type": "PostalAddress",
              addressLocality: cidadeInfo.cidadeNome,
              addressRegion: cidadeInfo.uf,
              addressCountry: "BR"
            }
          }
        }}
      />
      {problema.faq && problema.faq.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: problema.faq.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a }
            }))
          }}
        />
      )}
    </div>
  );
}
