import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, User, Calendar, ArrowLeft, ShieldCheck } from "lucide-react";
import {
  getAllArticleSlugs,
  getArticleBySlug,
  getRelatedArticles,
  type Article,
  type ArticleSection
} from "@/lib/data/articles";
import { createAdminClient } from "@/lib/supabase/admin";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { CTAFinal } from "@/components/CTAFinal";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";
import {
  capitalsForArticle,
  relatedTemplatesForArticle,
  toolsForArticle
} from "@/lib/seo/internal-links";
import {
  isArtigoLocalizavel
} from "@/lib/data/articles-cidades";
import { getCidadesPrioritarias } from "@/lib/data/cidades-prioritarias";
import { MapPin } from "lucide-react";
import {
  getFluxogramaForSlug,
  getComparativoForSlug
} from "@/lib/data/fluxogramas";
import { Fluxograma, QuadroComparativo } from "@/components/Fluxograma";
import { ArticleTool } from "@/components/ArticleTools";

export const dynamicParams = true;
export const revalidate = 21600;

/** Busca artigo no banco (blog_articles) pelo slug. */
async function getArticleFromDB(slug: string): Promise<(Article & { _authorId?: string | null; _authorSlug?: string | null }) | null> {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("blog_articles")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (!data) return null;

    // Se o artigo tem author_id (UGC), busca o slug do advogado para link
    let authorSlug: string | null = null;
    if (data.author_id) {
      const { data: lawyer } = await supabase
        .from("lawyers")
        .select("slug")
        .eq("id", data.author_id)
        .maybeSingle();
      authorSlug = lawyer?.slug || null;
    }

    return {
      slug: data.slug,
      title: data.title,
      excerpt: data.meta_description || data.excerpt,
      category: data.category,
      readingMinutes: data.reading_minutes || 5,
      publishedAt: data.published_at
        ? data.published_at.split("T")[0]
        : data.created_at.split("T")[0],
      author: data.author_name || data.author || "Equipe AdvAqui",
      authorRole: data.author_id ? ("Advogado Premium" as const) : ("Equipe" as const),
      intro: data.meta_description || data.excerpt,
      body: [{ type: "p" as const, text: data.body }],
      faq: [],
      _source: "db" as const,
      _authorId: data.author_id || null,
      _authorSlug: authorSlug
    } as Article & { _authorId?: string | null; _authorSlug?: string | null };
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug) || await getArticleFromDB(params.slug);
  if (!article) {
    return buildMetadata({
      title: "Artigo",
      description: "Artigo não encontrado",
      noIndex: true
    });
  }
  const base = buildMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/blog/${article.slug}`
  });
  return {
    ...base,
    openGraph: {
      ...(base.openGraph as Record<string, unknown>),
      type: "article",
      authors: [article.author || "Equipe AdvAqui"],
      publishedTime: article.publishedAt,
    },
  };
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
          className="mb-5 space-y-2 pl-5 list-disc marker:text-brand-accent2"
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
    case "tool":
      return <ArticleTool key={idx} data={section} />;
    default:
      return null;
  }
};

const articleJsonLd = (
  title: string,
  slug: string,
  excerpt: string,
  publishedAt: string,
  updatedAt: string | undefined,
  author: string,
  isUgc?: boolean,
  authorProfileUrl?: string | null
) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: title,
  description: excerpt,
  datePublished: publishedAt,
  dateModified: updatedAt || publishedAt,
  author: isUgc
    ? {
        "@type": "Person",
        name: author,
        ...(authorProfileUrl ? { url: authorProfileUrl } : {})
      }
    : { "@type": "Organization", name: author },
  publisher: {
    "@type": "Organization",
    name: SITE.name,
    logo: { "@type": "ImageObject", url: `${SITE.url}/opengraph-image` }
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE.url}/blog/${slug}` }
});

const faqJsonLd = (items: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((it) => ({
    "@type": "Question",
    name: it.question,
    acceptedAnswer: { "@type": "Answer", text: it.answer }
  }))
});

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug) || await getArticleFromDB(params.slug);
  if (!article) notFound();

  // Artigos do banco usam HTML cru no body; seed articles usam ArticleSection[]
  const isDBArticle = "_source" in article && (article as Article & { _source?: string })._source === "db";

  // UGC: extrair dados do autor (advogado) se presentes
  const authorId = "_authorId" in article ? (article as Article & { _authorId?: string | null })._authorId : null;
  const authorSlug = "_authorSlug" in article ? (article as Article & { _authorSlug?: string | null })._authorSlug : null;

  const related = getRelatedArticles(article.slug, 3);
  const publishedDate = new Date(article.publishedAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  return (
    <div className="container-tight py-10">
      <Breadcrumb
        items={[
          { label: "Blog", href: "/blog" },
          { label: article.category }
        ]}
      />

      <article className="max-w-3xl mx-auto">
        <header className="mb-8">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-accent/15 text-brand-deep border border-brand-accent/30">
            {article.category}
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-brand-ink mt-4 leading-tight">
            {article.title}
          </h1>
          <p className="text-lg text-brand-ink/70 mt-4 leading-relaxed">
            {article.intro}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-brand-ink/60 border-t border-brand-line pt-4">
            <span className="inline-flex items-center gap-1.5">
              <User className="w-4 h-4" aria-hidden />
              {authorId && authorSlug ? (
                <Link
                  href={`/advogado/${authorSlug}`}
                  className="text-brand-deep hover:text-brand-accent2 font-medium transition"
                >
                  {article.author}
                </Link>
              ) : (
                article.author
              )}{" "}
              <span className="ml-1 px-1.5 py-0.5 rounded text-xs bg-brand-line/60 text-brand-ink/70">
                {article.authorRole}
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4" aria-hidden />
              {publishedDate}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4" aria-hidden />
              {article.readingMinutes} min de leitura
            </span>
          </div>
        </header>

        {/* Fluxograma e quadro comparativo visuais, quando disponíveis */}
        {(() => {
          const fluxo = getFluxogramaForSlug(article.slug);
          const comp = getComparativoForSlug(article.slug);
          return (
            <>
              {fluxo && <Fluxograma steps={fluxo.steps} titulo={fluxo.titulo} />}
              {comp && (
                <QuadroComparativo
                  titulo={comp.titulo}
                  colunaEsquerda={comp.colunaEsquerda}
                  colunaDireita={comp.colunaDireita}
                  rows={comp.rows}
                />
              )}
            </>
          );
        })()}

        <div className="prose prose-lg max-w-none">
          {isDBArticle && article.body.length === 1 && article.body[0].type === "p" ? (
            <div
              className="text-brand-ink/85 leading-relaxed [&>h2]:font-display [&>h2]:text-2xl [&>h2]:md:text-3xl [&>h2]:font-bold [&>h2]:text-brand-ink [&>h2]:mt-10 [&>h2]:mb-4 [&>h3]:font-display [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-brand-deep [&>h3]:mt-6 [&>h3]:mb-3 [&>p]:mb-4 [&>ul]:mb-5 [&>ul]:space-y-2 [&>ul]:pl-5 [&>ul]:list-disc [&>ol]:mb-5 [&>ol]:space-y-2 [&>ol]:pl-5 [&>ol]:list-decimal"
              dangerouslySetInnerHTML={{ __html: article.body[0].text }}
            />
          ) : (
            article.body.map(renderSection)
          )}
        </div>

        {article.faq.length > 0 && (
          <section className="mt-12 rounded-2xl bg-brand-bg border border-brand-line p-6">
            <h2 className="font-display text-2xl font-bold text-brand-ink mb-4">
              Perguntas frequentes
            </h2>
            <dl className="space-y-4">
              {article.faq.map((item, i) => (
                <div key={i} className="border-b border-brand-line last:border-0 pb-4 last:pb-0">
                  <dt className="font-semibold text-brand-ink">{item.question}</dt>
                  <dd className="mt-2 text-brand-ink/80 text-sm leading-relaxed">
                    {item.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <section className="mt-10 rounded-2xl bg-gradient-to-br from-brand-deep to-brand-ink text-white p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="hidden md:flex w-14 h-14 rounded-2xl bg-brand-accent/20 items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-7 h-7 text-brand-accent" aria-hidden />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-xl md:text-2xl font-bold">
                Precisa conversar com um advogado{article.relatedSpecialty ? ` de ${article.category.toLowerCase()}` : ""}?
              </h2>
              <p className="text-brand-bg/85 mt-2 text-sm md:text-base leading-relaxed">
                Esse artigo é informativo e não substitui orientação profissional para o
                seu caso específico. Use o diretório AdvAqui para encontrar advogados
                verificados na sua cidade.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/advogados" className="btn-accent">
                  Encontrar advogado próximo
                </Link>
                <Link
                  href="/buscar"
                  className="btn-ghost text-white border border-white/20 hover:bg-white/10"
                >
                  Buscar por cidade
                </Link>
              </div>
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-bold text-brand-ink mb-4">
              Leia também
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="card hover:border-brand-accent transition group"
                >
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-brand-line/40 text-brand-ink/70 mb-2">
                    {r.category}
                  </span>
                  <h3 className="font-display text-base font-bold text-brand-ink group-hover:text-brand-deep">
                    {r.title}
                  </h3>
                  <p className="text-xs text-brand-ink/60 mt-2">
                    {r.readingMinutes} min de leitura
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Versões localizadas — só pra artigos da allow-list */}
        {isArtigoLocalizavel(article.slug) && (
          <section className="mt-12 rounded-2xl border border-brand-line bg-brand-bg/30 p-5 md:p-6">
            <h2 className="font-display text-2xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-deep" aria-hidden />
              Este guia aplicado à sua cidade
            </h2>
            <p className="text-sm text-brand-ink/75 mb-4 leading-relaxed">
              Veja como este conteúdo se aplica na sua cidade — com advogados
              que atuam lá e particularidades do foro local.
            </p>
            <ul className="grid gap-1.5 sm:grid-cols-2 md:grid-cols-3 text-sm">
              {getCidadesPrioritarias().map((c) => (
                <li key={`${c.uf}-${c.slug}`}>
                  <Link
                    href={`/blog/${article.slug}/em/${c.slug}-${c.uf.toLowerCase()}`}
                    className="block px-2 py-1.5 rounded-md text-brand-ink hover:bg-white hover:text-brand-deep transition"
                  >
                    <span aria-hidden>→</span> {c.nome_completo}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-brand-ink/60">
              Sua cidade não está na lista? O conteúdo está disponível para
              todas as cidades brasileiras — basta acessar direto
              /blog/{article.slug}/em/sua-cidade-uf.
            </p>
          </section>
        )}

        {/* Interlinking SEO — capitais com a especialidade do artigo */}
        {(() => {
          const caps = capitalsForArticle(article, 6);
          if (caps.length === 0) return null;
          const spec = caps[0].specialty;
          return (
            <section className="mt-12">
              <h2 className="font-display text-2xl font-bold text-brand-ink mb-4">
                Encontre advogado {spec.name.toLowerCase()} nas principais capitais
              </h2>
              <div className="flex flex-wrap gap-2">
                {caps.map((c) => (
                  <Link
                    key={`${c.state.uf}-${c.city.slug}`}
                    href={`/advogados/${c.state.uf.toLowerCase()}/${c.city.slug}/${c.specialty.slug}`}
                    className="chip text-brand-ink hover:bg-brand-deep hover:text-white hover:border-brand-deep transition"
                  >
                    {c.city.name}/{c.state.uf}
                  </Link>
                ))}
              </div>
            </section>
          );
        })()}

        {/* Interlinking SEO — ferramentas relacionadas ao tema do artigo */}
        {(() => {
          const tools = toolsForArticle(article, 3);
          if (tools.length === 0) return null;
          return (
            <section className="mt-10">
              <h2 className="font-display text-2xl font-bold text-brand-ink mb-4">
                Ferramentas úteis para este tema
              </h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {tools.map((t) => (
                  <Link
                    key={t.href}
                    href={t.href}
                    className="card hover:border-brand-accent transition group"
                  >
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 mb-2">
                      Ferramenta
                    </span>
                    <h3 className="font-display text-sm md:text-base font-bold text-brand-ink group-hover:text-brand-deep leading-snug">
                      {t.label}
                    </h3>
                    <p className="text-xs text-brand-ink/60 mt-1">{t.desc}</p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })()}

        {/* Interlinking SEO — modelos relacionados ao tema do artigo */}
        {(() => {
          const tmpls = relatedTemplatesForArticle(article, 3);
          if (tmpls.length === 0) return null;
          return (
            <section className="mt-10">
              <h2 className="font-display text-2xl font-bold text-brand-ink mb-4">
                Modelos prontos relacionados a este tema
              </h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {tmpls.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/modelos/${t.slug}`}
                    className="card hover:border-brand-accent transition group"
                  >
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 mb-2">
                      Modelo
                    </span>
                    <h3 className="font-display text-sm md:text-base font-bold text-brand-ink group-hover:text-brand-deep leading-snug">
                      {t.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </section>
          );
        })()}

        <CTAFinal areaSlug={article.relatedSpecialty} />

        <div className="mt-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-brand-deep hover:text-brand-accent2"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden />
            Voltar para o blog
          </Link>
        </div>
      </article>

      <JsonLd
        data={articleJsonLd(
          article.title,
          article.slug,
          article.excerpt,
          article.publishedAt,
          article.updatedAt,
          article.author,
          !!authorId,
          authorSlug ? `${SITE.url}/advogado/${authorSlug}` : null
        )}
      />
      {article.faq.length > 0 && <JsonLd data={faqJsonLd(article.faq)} />}
      <JsonLd
        data={breadcrumbSchema([
          { name: "Brasil", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: article.title, url: `/blog/${article.slug}` }
        ])}
      />
    </div>
  );
}
