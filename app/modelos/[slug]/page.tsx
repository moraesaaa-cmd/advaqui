import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Lightbulb,
  Sparkles
} from "lucide-react";
import {
  getAllTemplateSlugs,
  getTemplateBySlug
} from "@/lib/data/templates-docs";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { TemplateDownloadButton } from "@/components/TemplateDownloadButton";
import { ContentGate } from "@/components/ContentGate";
import { TemplateBody } from "@/components/TemplateBody";

export const dynamicParams = false;
export const revalidate = 3600;

export async function generateStaticParams() {
  return getAllTemplateSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const template = getTemplateBySlug(params.slug);
  if (!template) {
    return buildMetadata({
      title: "Modelo",
      description: "Modelo não encontrado",
      noIndex: true
    });
  }
  return buildMetadata({
    title: template.title,
    description: template.description,
    path: `/modelos/${template.slug}`
  });
}

export default function TemplatePage({ params }: { params: { slug: string } }) {
  const template = getTemplateBySlug(params.slug);
  if (!template) notFound();

  return (
    <>
      {/* HERO compacto com cor + tipografia mais sofisticada */}
      <section className="relative bg-gradient-to-br from-brand-ink via-brand-deep to-brand-primary text-white overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 30%, rgba(245,158,11,0.5) 0%, transparent 50%)"
          }}
        />
        <div className="relative container-tight py-8 md:py-12">
          <Breadcrumb
            items={[
              { label: "Modelos", href: "/modelos" },
              { label: template.category }
            ]}
          />
          <div className="mt-4 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-brand-accent text-brand-ink">
              <FileText className="w-3 h-3" aria-hidden />
              {template.category}
            </span>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mt-4 leading-tight">
              {template.title}
            </h1>
            <p className="text-base md:text-lg text-brand-bg/85 mt-3 leading-relaxed max-w-2xl">
              {template.description}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-brand-bg/80">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-brand-accent" aria-hidden />
                Preenchimento em {template.fillingMinutes} min
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-brand-accent" aria-hidden />
                {template.legalBase}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="container-tight py-10">
        <div className="grid lg:grid-cols-3 gap-8 lg:items-start">
          <article className="lg:col-span-2 max-w-3xl">
            {/* Quando usar */}
            <section className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/40 p-5 md:p-6 mb-6">
              <h2 className="font-display text-lg md:text-xl font-bold text-emerald-900 mb-3 inline-flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" aria-hidden />
                Quando usar este modelo
              </h2>
              <ul className="space-y-2.5 text-sm md:text-base text-emerald-950/85">
                {template.whenToUse.map((use, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                      ✓
                    </span>
                    <span>{use}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Como preencher */}
            <section className="rounded-2xl border border-brand-line bg-white p-5 md:p-6 mb-6">
              <h2 className="font-display text-lg md:text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-brand-accent2" aria-hidden />
                Passo a passo para preencher
              </h2>
              <ol className="space-y-2.5 text-sm md:text-base text-brand-ink/85">
                {template.howToFill.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-deep text-white text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span className="pt-0.5 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            {/* Modelo do documento — ContentGate */}
            <section id="modelo" className="mb-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-brand-ink inline-flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-brand-accent" aria-hidden />
                    Modelo do documento
                  </h2>
                  <p className="text-sm text-brand-ink/60 mt-1">
                    Visualização parcial · cadastre-se para liberar o conteúdo completo
                    e baixar.
                  </p>
                </div>
                {/* Botão "Baixar" só fica útil para advogado logado; ContentGate
                    cuida da visibilidade, mas o componente abaixo é client-side e
                    sempre disponível pra quem visualiza a página completa. */}
                <TemplateDownloadButton
                  slug={template.slug}
                  title={template.title}
                  content={template.content}
                />
              </div>

              <ContentGate
                title="Liberar modelo completo e baixar"
                description="Cadastro grátis em 2 minutos libera ESTE modelo e mais 19 documentos jurídicos, além do checklist de marketing jurídico e artigos para advogados."
                ctaLabel="Cadastrar grátis para baixar"
                previewLines={22}
              >
                <div className="rounded-2xl border border-brand-line bg-white shadow-card p-6 md:p-8">
                  <TemplateBody content={template.content} />
                </div>
              </ContentGate>

              <p className="text-xs text-brand-ink/55 mt-3">
                Substitua os trechos em <span className="inline-block px-1.5 py-0.5 rounded-md bg-brand-accent/25 text-brand-deep font-semibold text-xs border border-brand-accent/40">[colchetes amarelos]</span> pelos seus dados antes de imprimir ou enviar.
              </p>
            </section>

            {/* Avisos */}
            {template.notes.length > 0 && (
              <section className="rounded-2xl border-l-4 border-amber-500 bg-amber-50 p-5 md:p-6">
                <h2 className="font-display text-lg md:text-xl font-bold text-amber-900 mb-3 inline-flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" aria-hidden />
                  Avisos importantes
                </h2>
                <ul className="space-y-2 text-sm md:text-base text-amber-950/85">
                  {template.notes.map((note, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-700 mt-1 flex-shrink-0">•</span>
                      <span className="leading-relaxed">{note}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="mt-8">
              <Link
                href="/modelos"
                className="inline-flex items-center gap-2 text-sm text-brand-deep hover:text-brand-accent2"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden />
                Voltar para a lista de modelos
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 space-y-4">
            <div className="rounded-2xl bg-gradient-to-br from-brand-deep to-brand-ink text-white p-6 relative overflow-hidden">
              <div
                aria-hidden
                className="absolute -bottom-1/3 -right-1/4 w-2/3 aspect-square rounded-full bg-brand-accent/15 blur-2xl"
              />
              <div className="relative">
                <h3 className="font-display text-xl font-bold">
                  Precisa de revisão profissional?
                </h3>
                <p className="text-brand-bg/85 mt-3 text-sm leading-relaxed">
                  Este modelo cobre o caso padrão. Em situações com valor alto ou
                  conflito iminente, vale a revisão de um advogado.
                </p>
                <Link
                  href="/advogados"
                  className="mt-4 inline-flex w-full justify-center btn-accent"
                >
                  Encontrar advogado próximo
                </Link>
                <p className="text-xs text-brand-bg/65 mt-3">
                  Modelos são informativos e não substituem orientação profissional.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-brand-line bg-white p-5">
              <h3 className="font-display text-base font-bold text-brand-ink mb-2">
                Outros modelos
              </h3>
              <div className="space-y-1.5 text-sm">
                <Link href="/modelos" className="block text-brand-deep hover:text-brand-accent2">
                  → Ver os 20 modelos
                </Link>
                <Link href="/blog" className="block text-brand-deep hover:text-brand-accent2">
                  → Blog jurídico
                </Link>
                <Link
                  href="/marketing-juridico"
                  className="block text-brand-deep hover:text-brand-accent2"
                >
                  → Marketing jurídico (para advogados)
                </Link>
                <Link
                  href="/checklist"
                  className="block text-brand-deep hover:text-brand-accent2"
                >
                  → Checklist de presença digital
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Brasil", url: "/" },
          { name: "Modelos", url: "/modelos" },
          { name: template.title, url: `/modelos/${template.slug}` }
        ])}
      />
    </>
  );
}
