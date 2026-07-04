import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock,
  User,
  Calendar,
  ArrowLeft,
  ShieldCheck,
  MapPin,
  Users,
  AlertCircle,
  ChevronRight
} from "lucide-react";
import {
  getArticleBySlug,
  getRelatedArticles,
  type ArticleSection
} from "@/lib/data/articles";
import {
  isArtigoLocalizavel,
  getArtigosLocalizaveis
} from "@/lib/data/articles-cidades";
import {
  getCidadesPrioritarias,
  getCidadesSSG,
  cidadesPrioritariasMesmaRegiao
} from "@/lib/data/cidades-prioritarias";
import { findCity } from "@/lib/data/cities";
import { getLawyersForCity } from "@/lib/data/lawyers";
import { LawyerCard } from "@/components/LawyerCard";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata, fitTitle } from "@/lib/seo/metadata";
import {
  BLOG_CIDADE_TEMPLATES,
  blogCidadeFallback,
  fitDescription
} from "@/lib/seo/local-titles";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";

/**
 * /blog/[slug]/em/[cidade-uf] — versão localizada do artigo do blog.
 *
 * Apenas artigos da allow-list (lib/data/articles-cidades.ts) entram —
 * artigo precisa ter clara intenção local pra justificar a versão por
 * cidade (não criamos "como entender prescrição em Almenara" porque não
 * faz sentido procurar isso geograficamente).
 *
 * 23 artigos × 5571 cidades IBGE = 128.133 URLs cauda longa.
 *
 * Híbrido SSG + ISR — pré-gera 50 cidades prioritárias × 2 = 100 URLs.
 * ISR cobre as 5521 demais cidades, geradas sob demanda no primeiro
 * acesso e cacheadas 24h.
 *
 * Conteúdo único por combinação:
 *  - H1 e title com nome da cidade
 *  - Artigo base completo (todas as seções)
 *  - Parágrafo introdutório local antes do conteúdo
 *  - Bloco "Advogados em [cidade]" com 6 profissionais reais
 *  - CTAs específicos para a cidade
 *  - Cross-links pra problemas, áreas e jurisprudência da cidade
 *  - Schema Article + spatialCoverage Place
 */

// force-dynamic: renderiza sob demanda SEM gravar em disco — impede o disco de
// reencher conforme o Google rastreia milhares de cidades. URL funciona normal.
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  const cidades = getCidadesSSG();
  const params: Array<{ slug: string; cidade: string }> = [];
  for (const art of getArtigosLocalizaveis()) {
    for (const c of cidades) {
      params.push({
        slug: art.slug,
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
  const article = getArticleBySlug(params.slug);
  const cidadeInfo = parseCidadeParam(params.cidade);
  // Bloqueia URLs fora da allow-list e cidades inexistentes
  if (!article || !cidadeInfo || !isArtigoLocalizavel(params.slug)) {
    return buildMetadata({
      title: "Página não encontrada",
      description: "Página não encontrada",
      noIndex: true
    });
  }
  // Fórmula de CTR: pergunta/ação + cidade no início, por tema.
  // Mapa determinístico slug → template; fallback genérico pra slugs novos.
  const tpl = BLOG_CIDADE_TEMPLATES[article.slug];
  const variants = tpl
    ? {
        full: tpl.full(cidadeInfo.cidadeNome),
        short: tpl.short(cidadeInfo.cidadeNome),
        description: tpl.description(cidadeInfo.cidadeNome)
      }
    : blogCidadeFallback(article.title, article.excerpt, cidadeInfo.cidadeNome);
  const fitted = fitTitle(variants.full, variants.short);
  return buildMetadata({
    title: fitted.title,
    absoluteTitle: fitted.absoluteTitle,
    description: fitDescription(variants.description),
    path: `/blog/${article.slug}/em/${params.cidade}`
  });
}

const renderSection = (section: ArticleSection, idx: number) => {
  switch (section.type) {
    case "h2":
      return (
        <h2
          key={idx}
          className="font-display text-2xl md:text-3xl font-bold text-brand-ink mt-10 mb-4 leading-tight"
        >
          {section.text}
        </h2>
      );
    case "h3":
      return (
        <h3
          key={idx}
          className="font-display text-xl font-bold text-brand-deep mt-6 mb-3"
        >
          {section.text}
        </h3>
      );
    case "p":
      return (
        <p key={idx} className="text-brand-ink/85 leading-relaxed mb-4 text-base">
          {section.text}
        </p>
      );
    case "ul":
      return (
        <ul
          key={idx}
          className="mb-5 space-y-2 pl-5 list-disc marker:text-brand-accentText"
        >
          {section.items.map((item, i) => (
            <li key={i} className="text-brand-ink/85 leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol
          key={idx}
          className="mb-5 space-y-2 pl-5 list-decimal marker:text-brand-deep marker:font-bold"
        >
          {section.items.map((item, i) => (
            <li key={i} className="text-brand-ink/85 leading-relaxed pl-2">
              {item}
            </li>
          ))}
        </ol>
      );
    case "callout":
      return (
        <aside
          key={idx}
          className="my-6 rounded-2xl border-l-4 border-brand-accent bg-brand-accent/10 p-4 md:p-5"
        >
          <p className="text-brand-ink leading-relaxed font-medium">
            {section.text}
          </p>
        </aside>
      );
    default:
      return null;
  }
};

export default async function ArticleCidadePage({
  params
}: {
  params: { slug: string; cidade: string };
}) {
  const article = getArticleBySlug(params.slug);
  const cidadeInfo = parseCidadeParam(params.cidade);
  if (!article || !cidadeInfo || !isArtigoLocalizavel(params.slug)) notFound();

  const ufLower = cidadeInfo.uf.toLowerCase();
  const publishedDate = new Date(article.publishedAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
  const updatedDate = article.updatedAt
    ? new Date(article.updatedAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      })
    : null;

  // Buscar advogados na cidade — defensive
  let lawyers: Awaited<ReturnType<typeof getLawyersForCity>> = [];
  try {
    lawyers = await getLawyersForCity(cidadeInfo.uf, cidadeInfo.citySlug);
  } catch {
    lawyers = [];
  }
  const lawyersTop = lawyers.slice(0, 6);

  const related = getRelatedArticles(article.slug, 3);
  const vizinhas = cidadesPrioritariasMesmaRegiao(
    cidadeInfo.uf,
    cidadeInfo.citySlug,
    6
  );

  // H1 na forma de pergunta/ação do template do tema (mantém a cidade);
  // fallback: título original do artigo. Corpo do artigo NÃO muda.
  const tplPage = BLOG_CIDADE_TEMPLATES[article.slug];
  const h1Local = tplPage ? tplPage.h1(cidadeInfo.cidadeNome) : article.title;
  const titleLocal = tplPage
    ? tplPage.full(cidadeInfo.cidadeNome)
    : `${article.title} — Guia para ${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}`;

  return (
    <div className="container-tight py-10">
      <Breadcrumb
        items={[
          { label: "Blog", href: "/blog" },
          { label: article.category, href: `/blog/${article.slug}` },
          { label: `${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}` }
        ]}
      />

      <article className="max-w-3xl mx-auto">
        <header className="mb-8">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-accent/15 text-brand-deep border border-brand-accent/30">
            {article.category}
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-brand-ink mt-4 leading-tight">
            {h1Local}
          </h1>
          <p className="text-sm text-brand-ink/55 mt-2 inline-flex items-center gap-1">
            <MapPin className="w-4 h-4" aria-hidden />
            Guia aplicado a {cidadeInfo.cidadeNome}, {cidadeInfo.uf}
          </p>
          <p className="text-lg text-brand-ink/70 mt-4 leading-relaxed">
            {article.intro}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-brand-ink/60 border-t border-brand-line pt-4">
            <span className="inline-flex items-center gap-1.5">
              <User className="w-4 h-4" aria-hidden />
              {article.author}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4" aria-hidden />
              {publishedDate}
            </span>
            {updatedDate && (
              <span className="inline-flex items-center gap-1.5 text-brand-ink/50">
                <Clock className="w-4 h-4" aria-hidden />
                Atualizado em {updatedDate}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" aria-hidden />
              Conteúdo informativo
            </span>
          </div>
        </header>

        {/* Bloco introdutório local — antes do artigo base */}
        <section className="mb-8 rounded-2xl border border-brand-deep/20 bg-brand-bg/40 p-5 md:p-6">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-2 inline-flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-deep" aria-hidden />
            Como este guia se aplica em {cidadeInfo.cidadeNome}, {cidadeInfo.uf}
          </h2>
          <p className="text-brand-ink/85 leading-relaxed mb-3">
            O conteúdo abaixo é o mesmo guia técnico do AdvAqui — os passos,
            direitos e documentos descritos valem em todo o Brasil. O que muda
            em {cidadeInfo.cidadeNome}/{cidadeInfo.uf} são pontos de execução
            local — qual vara é competente, prazos administrativos do Tribunal
            de Justiça local, presença de defensoria pública na cidade,
            disponibilidade de Procon, e canais da OAB seccional.
          </p>
          <p className="text-brand-ink/85 leading-relaxed">
            Por isso, antes ou depois de ler o guia, vale conversar com um
            advogado que atue em {cidadeInfo.cidadeNome} — quem conhece o foro
            local sabe acelerar a parte processual.{" "}
            <Link
              href={`/advogados/${ufLower}/${cidadeInfo.citySlug}`}
              className="text-brand-deep underline font-medium"
            >
              Veja advogados em {cidadeInfo.cidadeNome}
            </Link>
            .
          </p>
        </section>

        {/* Artigo base completo */}
        <div className="prose-content">
          {article.body.map((sec, idx) => renderSection(sec, idx))}
        </div>

        {/* FAQ */}
        {article.faq && article.faq.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-ink mb-4">
              Perguntas frequentes
            </h2>
            <div className="space-y-3">
              {article.faq.map((f, i) => (
                <details
                  key={i}
                  className="group rounded-xl border border-brand-line bg-white p-4 open:border-brand-deep/30"
                >
                  <summary className="cursor-pointer font-semibold text-brand-ink list-none flex items-center justify-between">
                    {f.question}
                    <span
                      aria-hidden
                      className="text-brand-deep text-lg group-open:rotate-45 transition-transform"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-2 text-brand-ink/80 leading-relaxed">
                    {f.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}
      </article>

      {/* Advogados locais */}
      <section className="max-w-3xl mx-auto mt-12 card">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-deep" aria-hidden />
          Advogados em {cidadeInfo.cidadeNome}
        </h2>
        {lawyersTop.length === 0 ? (
          <div className="rounded-xl bg-brand-bg/40 border border-brand-line p-4 text-sm text-brand-ink/80 leading-relaxed">
            <p>
              Ainda não temos advogados cadastrados em {cidadeInfo.cidadeNome}/
              {cidadeInfo.uf}. Veja{" "}
              <Link
                href={`/advogados/${ufLower}`}
                className="text-brand-deep underline font-medium"
              >
                advogados em {cidadeInfo.uf}
              </Link>{" "}
              ou{" "}
              <Link href="/cadastro" className="text-brand-deep underline">
                cadastre-se como o primeiro
              </Link>
              .
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-brand-ink/75 mb-3 leading-relaxed">
              Profissionais cadastrados em {cidadeInfo.cidadeNome}, prontos para
              atender.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {lawyersTop.map((l) => (
                <LawyerCard key={l.id} lawyer={l} />
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

      {/* Cidades vizinhas com o mesmo guia */}
      {vizinhas.length > 0 && (
        <section className="max-w-3xl mx-auto mt-8 card">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-3">
            Este guia em cidades próximas
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {vizinhas.map((v) => (
              <li key={`${v.uf}-${v.slug}`}>
                <Link
                  href={`/blog/${article.slug}/em/${v.slug}-${v.uf.toLowerCase()}`}
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

      {/* Outros guias do AdvAqui */}
      {related.length > 0 && (
        <section className="max-w-3xl mx-auto mt-8 card">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-3">
            Outros guias do AdvAqui
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/blog/${r.slug}`}
                  className="block group rounded-lg border border-brand-line p-3 hover:border-brand-deep/40 hover:bg-brand-bg/30 transition"
                >
                  <p className="font-semibold text-sm text-brand-ink group-hover:text-brand-deep transition">
                    {r.title}
                  </p>
                  <p className="text-xs text-brand-ink/65 mt-0.5 leading-snug">
                    {r.excerpt.slice(0, 90)}…
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Aviso ético */}
      <aside
        role="note"
        className="max-w-3xl mx-auto mt-8 rounded-xl border-l-4 border-amber-400 bg-amber-50 p-4 text-xs md:text-sm text-amber-900 leading-relaxed flex items-start gap-2"
      >
        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden />
        <span>
          Este guia é informativo. Cada caso concreto em {cidadeInfo.cidadeNome}/
          {cidadeInfo.uf} exige análise por advogado que conheça o foro local —
          prazos do TJ, varas competentes, jurisprudência regional. O AdvAqui
          não substitui consulta jurídica.
        </span>
      </aside>

      <p className="max-w-3xl mx-auto mt-8 text-sm text-brand-ink/65">
        <Link
          href={`/blog/${article.slug}`}
          className="text-brand-deep hover:underline inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden />
          Voltar ao guia geral
        </Link>{" "}
        ·{" "}
        <Link
          href={`/advogados/${ufLower}/${cidadeInfo.citySlug}`}
          className="text-brand-deep hover:underline inline-flex items-center gap-1"
        >
          Advogados em {cidadeInfo.cidadeNome}
          <ChevronRight className="w-3.5 h-3.5" aria-hidden />
        </Link>
      </p>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: article.category, url: `/blog/${article.slug}` },
          {
            name: `${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}`,
            url: `/blog/${article.slug}/em/${params.cidade}`
          }
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: titleLocal,
          description: article.excerpt,
          datePublished: article.publishedAt,
          dateModified: article.updatedAt || article.publishedAt,
          inLanguage: "pt-BR",
          author: { "@type": "Organization", name: article.author },
          publisher: {
            "@type": "Organization",
            name: SITE.name,
            logo: {
              "@type": "ImageObject",
              url: `${SITE.url}/opengraph-image`
            }
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${SITE.url}/blog/${article.slug}/em/${params.cidade}`
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
      {article.faq && article.faq.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: article.faq.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer }
            }))
          }}
        />
      )}
    </div>
  );
}
