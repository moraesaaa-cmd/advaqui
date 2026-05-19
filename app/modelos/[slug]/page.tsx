import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, ArrowLeft, BookOpen, CheckCircle2, AlertTriangle, FileText } from "lucide-react";
import {
  getAllTemplateSlugs,
  getTemplateBySlug
} from "@/lib/data/templates-docs";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { TemplateDownloadButton } from "@/components/TemplateDownloadButton";

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
    <div className="container-tight py-10">
      <Breadcrumb
        items={[
          { label: "Modelos", href: "/modelos" },
          { label: template.category }
        ]}
      />

      <div className="grid lg:grid-cols-3 gap-8 lg:items-start">
        <article className="lg:col-span-2 max-w-3xl">
          <header className="mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-accent/15 text-brand-deep border border-brand-accent/30">
              {template.category}
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink mt-4 leading-tight">
              {template.title}
            </h1>
            <p className="text-base md:text-lg text-brand-ink/75 mt-3 leading-relaxed">
              {template.description}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-brand-ink/60">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4" aria-hidden />
                Preenchimento em {template.fillingMinutes} min
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" aria-hidden />
                Base legal: {template.legalBase}
              </span>
            </div>
          </header>

          <section className="rounded-2xl border border-brand-line bg-white p-5 mb-6">
            <h2 className="font-display text-lg font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" aria-hidden />
              Quando usar este modelo
            </h2>
            <ul className="space-y-2 text-sm text-brand-ink/85">
              {template.whenToUse.map((use, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-brand-accent2 mt-1">•</span>
                  <span>{use}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-brand-line bg-white p-5 mb-6">
            <h2 className="font-display text-lg font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-deep" aria-hidden />
              Como preencher
            </h2>
            <ol className="space-y-2 text-sm text-brand-ink/85 list-decimal pl-5 marker:text-brand-deep marker:font-bold">
              {template.howToFill.map((step, i) => (
                <li key={i} className="leading-relaxed pl-1">
                  {step}
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-2xl border-2 border-brand-deep bg-brand-bg p-5 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <h2 className="font-display text-lg font-bold text-brand-ink">
                Modelo do documento
              </h2>
              <TemplateDownloadButton
                slug={template.slug}
                title={template.title}
                content={template.content}
              />
            </div>
            <pre className="whitespace-pre-wrap text-[13px] leading-relaxed font-mono text-brand-ink/90 bg-white border border-brand-line rounded-xl p-4 overflow-x-auto max-h-[600px] overflow-y-auto">
              {template.content}
            </pre>
            <p className="text-xs text-brand-ink/60 mt-3">
              Substitua os campos entre [colchetes] pelos seus dados antes de
              imprimir ou enviar.
            </p>
          </section>

          {template.notes.length > 0 && (
            <section className="rounded-2xl border-l-4 border-amber-500 bg-amber-50 p-5 mb-6">
              <h2 className="font-display text-lg font-bold text-amber-900 mb-3 inline-flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" aria-hidden />
                Avisos importantes
              </h2>
              <ul className="space-y-2 text-sm text-amber-900/90">
                {template.notes.map((note, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-700 mt-1">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="mt-6">
            <Link
              href="/modelos"
              className="inline-flex items-center gap-2 text-sm text-brand-deep hover:text-brand-accent2"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden />
              Voltar para a lista de modelos
            </Link>
          </div>
        </article>

        <aside className="lg:sticky lg:top-24">
          <div className="rounded-2xl bg-gradient-to-br from-brand-deep to-brand-ink text-white p-6">
            <h3 className="font-display text-xl font-bold">
              Precisa de revisão profissional?
            </h3>
            <p className="text-brand-bg/85 mt-3 text-sm leading-relaxed">
              Esse modelo cobre o caso padrão. Se houver valor alto, conflito
              entre as partes ou cláusulas específicas, vale a revisão de um
              advogado.
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
        </aside>
      </div>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Brasil", url: "/" },
          { name: "Modelos", url: "/modelos" },
          { name: template.title, url: `/modelos/${template.slug}` }
        ])}
      />
    </div>
  );
}
