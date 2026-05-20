import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, User, Calendar, ArrowLeft, ShieldCheck } from "lucide-react";
import {
  getAllArticleSlugs,
  getArticleBySlug,
  getRelatedArticles,
  type ArticleSection
} from "@/lib/data/articles";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";
import {
  capitalsForArticle,
  relatedTemplatesForArticle
} from "@/lib/seo/internal-links";

export const dynamicParams = false;
export const revalidate = 3600;

export async function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  if (!article) {
    return buildMetadata({
      title: "Artigo",
      description: "Artigo não encontrado",
      noIndex: true
    });
  }
  return buildMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/blog/${article.slug}`
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
  author: string
) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: title,
  description: excerpt,
  datePublished: publishedAt,
  dateModified: updatedAt || publishedAt,
  author: { "@type": "Organization", name: author },
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

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

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
              {article.author}{" "}
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

        <div className="prose prose-lg max-w-none">
          {article.body.map(renderSection)}
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

        <div className="mt-10">
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
          article.author
        )}
      />
      <JsonLd data={faqJsonLd(article.faq)} />
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
