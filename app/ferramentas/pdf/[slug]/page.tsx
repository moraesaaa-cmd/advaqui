import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Scale, ShieldCheck, Zap, BadgeCheck } from "lucide-react";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE } from "@/lib/config";
import { JsonLd } from "@/components/JsonLd";
import { PDF_TOOLS, getPdfTool, PDF_CATEGORIES } from "@/lib/tools/pdf/registry";
import { PdfToolClient } from "@/components/tools/PdfToolClient";
import { PdfToolIcon } from "@/components/tools/PdfToolIcon";

export const dynamicParams = false;

export function generateStaticParams() {
  return PDF_TOOLS.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const tool = getPdfTool(params.slug);
  if (!tool) return {};
  return buildMetadata({
    title: tool.titulo,
    description: tool.metaDescription,
    path: `/ferramentas/pdf/${tool.slug}`
  });
}

export default function PdfToolPage({ params }: { params: { slug: string } }) {
  const tool = getPdfTool(params.slug);
  if (!tool) notFound();

  const base = SITE.url.replace(/\/$/, "");
  const url = `${base}/ferramentas/pdf/${tool.slug}`;
  const relacionadas = tool.relacionadas
    .map((s) => getPdfTool(s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: base },
      { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${base}/ferramentas` },
      { "@type": "ListItem", position: 3, name: "Ferramentas PDF", item: `${base}/ferramentas/pdf` },
      { "@type": "ListItem", position: 4, name: tool.nome, item: url }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a }
    }))
  };

  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: tool.h1,
    description: tool.metaDescription,
    step: tool.passos.map((p, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text: p
    }))
  };

  const app = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${tool.nome} — ${SITE.name}`,
    url,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" }
  };

  return (
    <section className="bg-brand-bg">
      <JsonLd data={breadcrumb} />
      <JsonLd data={faqSchema} />
      <JsonLd data={howTo} />
      <JsonLd data={app} />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Navegação" className="mb-6 flex flex-wrap items-center gap-1 text-sm text-brand-ink/60">
          <Link href="/" className="hover:text-brand-ink">Início</Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          <Link href="/ferramentas" className="hover:text-brand-ink">Ferramentas</Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          <Link href="/ferramentas/pdf" className="hover:text-brand-ink">PDF</Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          <span className="text-brand-ink">{tool.nome}</span>
        </nav>

        {/* Cabeçalho */}
        <div className="mb-8 text-center">
          <span className="inline-flex items-center justify-center rounded-xl bg-brand-ink p-3">
            <PdfToolIcon name={tool.icone} className="h-7 w-7 text-brand-accent2" />
          </span>
          <h1 className="mt-4 font-display text-3xl font-semibold text-brand-ink sm:text-4xl">
            {tool.h1}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-brand-ink/70">{tool.subtitulo}</p>
        </div>

        {/* Ferramenta */}
        <PdfToolClient
          slug={tool.slug}
          nome={tool.nome}
          ctaLabel={tool.ctaLabel}
          aceita={tool.aceita}
          multiplos={tool.multiplos}
          minArquivos={tool.minArquivos}
          resultado={tool.resultado}
          opcoes={tool.opcoes}
        />

        {/* Confiança */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, txt: "Arquivos apagados automaticamente" },
            { icon: Zap, txt: "Processamento em segundos" },
            { icon: BadgeCheck, txt: "Grátis, sem marca d'água" }
          ].map(({ icon: Icon, txt }) => (
            <div key={txt} className="flex items-center gap-2 rounded-md border border-brand-line bg-white px-3 py-2 text-sm text-brand-ink/80">
              <Icon className="h-4 w-4 shrink-0 text-brand-accentText" aria-hidden />
              {txt}
            </div>
          ))}
        </div>

        {/* Como funciona */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold text-brand-ink">Como funciona</h2>
          <ol className="mt-4 grid gap-4 sm:grid-cols-3">
            {tool.passos.map((p, i) => (
              <li key={i} className="rounded-xl border border-brand-line bg-white p-4">
                <span className="font-display text-2xl font-semibold text-brand-accentText">{i + 1}</span>
                <p className="mt-2 text-sm leading-relaxed text-brand-ink/80">{p}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Uso jurídico — diferencial */}
        <section className="mt-10 rounded-2xl bg-brand-ink p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <span className="rounded-md bg-white/10 p-2">
              <Scale className="h-6 w-6 text-brand-accentSoft" aria-hidden />
            </span>
            <div>
              <h2 className="font-display text-xl font-semibold text-white">No dia a dia jurídico</h2>
              <p className="mt-2 leading-relaxed text-[#CBD5E6]">{tool.usoJuridico}</p>
              <p className="mt-3 text-sm text-[#CBD5E6]">
                Precisa de orientação no seu caso?{" "}
                <Link href="/advogados" className="font-medium text-brand-accentSoft underline underline-offset-2">
                  Encontre um advogado na sua cidade
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold text-brand-ink">Perguntas frequentes</h2>
          <div className="mt-4 space-y-3">
            {tool.faq.map((f) => (
              <details key={f.q} className="group rounded-xl border border-brand-line bg-white p-4">
                <summary className="cursor-pointer list-none font-medium text-brand-ink marker:content-none">
                  {f.q}
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-brand-ink/75">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Relacionadas */}
        {relacionadas.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-semibold text-brand-ink">
              Outras ferramentas úteis
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {relacionadas.map((r) => (
                <Link
                  key={r.slug}
                  href={`/ferramentas/pdf/${r.slug}`}
                  className="flex items-center gap-3 rounded-xl border border-brand-line bg-white p-4 transition hover:border-brand-accent"
                >
                  <span className="rounded-md bg-brand-bg p-2">
                    <PdfToolIcon name={r.icone} className="h-5 w-5 text-brand-deep" />
                  </span>
                  <span>
                    <span className="block font-medium text-brand-ink">{r.nome}</span>
                    <span className="block text-xs text-brand-ink/60">
                      {PDF_CATEGORIES[r.categoria].label}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
            <p className="mt-4 text-sm text-brand-ink/70">
              Veja todas em{" "}
              <Link href="/ferramentas/pdf" className="font-medium text-brand-deep underline underline-offset-2">
                Ferramentas PDF
              </Link>{" "}
              ou explore as{" "}
              <Link href="/ferramentas" className="font-medium text-brand-deep underline underline-offset-2">
                ferramentas jurídicas gratuitas
              </Link>
              .
            </p>
          </section>
        )}
      </div>
    </section>
  );
}
