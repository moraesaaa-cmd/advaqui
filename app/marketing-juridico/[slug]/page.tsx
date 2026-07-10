import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock,
  ArrowLeft,
  ArrowRight,
  Target,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import {
  getAllMarketingArticleSlugs,
  getMarketingArticleBySlug,
  getAllMarketingArticles,
  type MktSection
} from "@/lib/data/marketing-articles";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { ContentGate } from "@/components/ContentGate";
import { SITE } from "@/lib/config";

export const dynamicParams = false;
export const revalidate = 3600;

export async function generateStaticParams() {
  return getAllMarketingArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = getMarketingArticleBySlug(params.slug);
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
    path: `/marketing-juridico/${article.slug}`
  });
}

const renderSection = (section: MktSection, idx: number) => {
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
        <p key={idx} className="text-brand-ink/85 leading-relaxed mb-4 text-base md:text-[17px]">
          {section.text}
        </p>
      );
    case "ul":
      return (
        <ul key={idx} className="mb-5 space-y-2 pl-5 list-disc marker:text-brand-accentText">
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
          <p className="text-brand-ink leading-relaxed font-medium whitespace-pre-line">
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
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${SITE.url}/marketing-juridico/${slug}`
  }
});

export default function MktArticlePage({ params }: { params: { slug: string } }) {
  const article = getMarketingArticleBySlug(params.slug);
  if (!article) notFound();

  const allArticles = getAllMarketingArticles();
  const related = allArticles.filter((a) => a.slug !== article.slug).slice(0, 3);

  const publishedDate = new Date(article.publishedAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  // Renderiza primeiros 3 elementos (intro + alguns) como PREVIEW público,
  // o resto fica dentro do ContentGate. Isso garante SEO mantido + isca real.
  const previewSections = article.body.slice(0, 3);
  const lockedSections = article.body.slice(3);

  return (
    <>
      {/* HERO */}
      <section className="relative bg-brand-ink text-white overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "none"
          }}
        />
        <div className="relative container-tight py-10 md:py-14">
          <Breadcrumb
            items={[
              { label: "Marketing jurídico", href: "/marketing-juridico" },
              { label: article.title }
            ]}
          />
          <div className="mt-4 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-brand-accent text-brand-ink">
              <Target className="w-3 h-3" aria-hidden />
              Para advogados
            </span>
            <h1 className="font-display text-3xl md:text-5xl font-bold mt-4 leading-tight">
              {article.title}
            </h1>
            <p className="text-base md:text-lg text-brand-bg/85 mt-3 leading-relaxed max-w-2xl">
              {article.intro}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-brand-bg/80">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-brand-accent" aria-hidden />
                {article.readingMinutes} min
              </span>
              <span>{publishedDate}</span>
              <span className="px-1.5 py-0.5 rounded text-xs bg-white/10 border border-white/20">
                {article.authorRole}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="container-tight py-10">
        <article className="max-w-3xl mx-auto">
          {/* Preview público */}
          <div className="prose prose-lg max-w-none">
            {previewSections.map(renderSection)}
          </div>

          {/* Resto behind gate */}
          {lockedSections.length > 0 && (
            <ContentGate
              title="Continuar lendo este guia"
              description="Cadastro grátis em 2 minutos libera este guia completo + os outros guias de marketing jurídico + a biblioteca de modelos de documentos + checklist de presença digital."
              ctaLabel="Cadastrar grátis para liberar"
              previewLines={18}
            >
              <div className="prose prose-lg max-w-none">
                {lockedSections.map((s, i) => renderSection(s, i + 100))}
              </div>
            </ContentGate>
          )}

          {/* Key takeaways */}
          {article.keyTakeaways.length > 0 && (
            <section className="mt-10 rounded-2xl bg-emerald-50/60 border-2 border-emerald-200 p-5 md:p-6">
              <h2 className="font-display text-lg md:text-xl font-bold text-emerald-900 mb-3 inline-flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" aria-hidden />
                Resumo prático
              </h2>
              <ul className="space-y-2 text-sm md:text-base text-emerald-950/85">
                {article.keyTakeaways.map((k, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                      ✓
                    </span>
                    <span>{k}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* CTA AdvAqui */}
          <section className="mt-10 rounded-2xl bg-brand-ink text-white p-6 md:p-8 relative overflow-hidden">
            <div
              aria-hidden
              className="absolute -bottom-1/3 -right-1/4 w-1/2 aspect-square rounded-full bg-brand-accent/20 blur-2xl"
            />
            <div className="relative grid md:grid-cols-3 gap-5 items-center">
              <div className="md:col-span-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-accent text-brand-ink mb-2">
                  <Sparkles className="w-3.5 h-3.5" aria-hidden />
                  Coloque em prática
                </div>
                <h2 className="font-display text-xl md:text-2xl font-bold leading-tight">
                  Cadastre seu perfil no AdvAqui hoje
                </h2>
                <p className="text-brand-bg/85 mt-3 text-sm leading-relaxed">
                  Tudo que você leu aqui se aplica imediatamente quando você tem perfil
                  no AdvAqui. Grátis, WhatsApp clicável no premium, sem fidelidade.
                </p>
              </div>
              <div className="space-y-2">
                <Link
                  href="/cadastro"
                  className="btn-accent inline-flex items-center justify-center w-full"
                >
                  Cadastrar grátis
                </Link>
                <Link
                  href="/planos"
                  className="text-xs text-brand-bg/75 hover:text-brand-accent inline-flex items-center justify-center w-full"
                >
                  Ver plano premium →
                </Link>
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
                    href={`/marketing-juridico/${r.slug}`}
                    className="card hover:border-brand-accent transition group"
                  >
                    <p className="text-xs text-brand-ink/55 mb-2 inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" aria-hidden /> {r.readingMinutes} min
                    </p>
                    <h3 className="font-display text-base font-bold text-brand-ink group-hover:text-brand-deep leading-snug">
                      {r.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="mt-10">
            <Link
              href="/marketing-juridico"
              className="inline-flex items-center gap-2 text-sm text-brand-deep hover:text-brand-accent2"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden />
              Voltar para todos os guias
            </Link>
          </div>
        </article>
      </div>

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
      <JsonLd
        data={breadcrumbSchema([
          { name: "Brasil", url: "/" },
          { name: "Marketing jurídico", url: "/marketing-juridico" },
          { name: article.title, url: `/marketing-juridico/${article.slug}` }
        ])}
      />
    </>
  );
}
