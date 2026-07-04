import Link from "next/link";
import { ChevronRight, ShieldCheck, Zap, BadgeCheck } from "lucide-react";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE } from "@/lib/config";
import { JsonLd } from "@/components/JsonLd";
import { getPdfToolsByCategory, PDF_TOOLS } from "@/lib/tools/pdf/registry";
import { PdfToolIcon } from "@/components/tools/PdfToolIcon";

export const metadata = buildMetadata({
  title: "Ferramentas PDF online grátis — juntar, comprimir, converter",
  description:
    "Ferramentas PDF online grátis: juntar, dividir, comprimir, converter para Word e PDF/A, OCR, traduzir e mais. Sem marca d'água, direto no navegador.",
  path: "/ferramentas/pdf"
});

const FAQ_HUB = [
  {
    q: "As ferramentas são realmente gratuitas?",
    a: "Sim. Todas as ferramentas PDF são gratuitas e sem marca d'água — basta criar uma conta grátis para baixar os resultados, quantas vezes precisar."
  },
  {
    q: "Meus arquivos ficam armazenados?",
    a: "Não. Os arquivos são processados no servidor e apagados automaticamente ao fim de cada operação. Nada fica salvo."
  },
  {
    q: "Preciso instalar algum programa?",
    a: "Não. Tudo funciona no navegador, no computador ou no celular — você envia o arquivo e baixa o resultado."
  },
  {
    q: "Servem para o PJe e processos eletrônicos?",
    a: "Sim — foram pensadas para isso: converta petições para PDF, gere o PDF/A exigido pelos tribunais, comprima anexos para caber no limite de upload e junte documentos na ordem do protocolo."
  }
];

export default function PdfHubPage() {
  const grupos = getPdfToolsByCategory();
  const base = SITE.url.replace(/\/$/, "");

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Ferramentas PDF gratuitas",
    itemListElement: PDF_TOOLS.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.nome,
      url: `${base}/ferramentas/pdf/${t.slug}`
    }))
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_HUB.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a }
    }))
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: base },
      { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${base}/ferramentas` },
      { "@type": "ListItem", position: 3, name: "Ferramentas PDF", item: `${base}/ferramentas/pdf` }
    ]
  };

  return (
    <main className="bg-brand-bg">
      <JsonLd data={itemList} />
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumb} />

      {/* Hero */}
      <section className="bg-brand-ink">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center sm:py-16">
          <nav aria-label="Navegação" className="mb-4 flex items-center justify-center gap-1 text-sm text-[#CBD5E6]">
            <Link href="/" className="hover:text-white">Início</Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <Link href="/ferramentas" className="hover:text-white">Ferramentas</Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <span className="text-white">PDF</span>
          </nav>
          <h1 className="font-display text-3xl font-semibold text-white sm:text-5xl">
            Ferramentas PDF gratuitas
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#CBD5E6]">
            Juntar, dividir, comprimir, converter, proteger e muito mais — tudo online, sem
            marca d&apos;água e sem instalar nada. Prontas para o PJe e o dia a dia.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-[#CBD5E6]">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-brand-accent2" aria-hidden />
              Arquivos apagados após o uso
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-brand-accent2" aria-hidden />
              Resultado em segundos
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BadgeCheck className="h-4 w-4 text-brand-accent2" aria-hidden />
              Grátis com conta — sem cartão
            </span>
          </div>
        </div>
      </section>

      {/* Grid por categoria */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        {grupos.map((g) => (
          <div key={g.categoria} className="mb-10 last:mb-0">
            <h2 className="font-display text-2xl font-semibold text-brand-ink">{g.label}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {g.tools.map((t) => (
                <Link
                  key={t.slug}
                  href={`/ferramentas/pdf/${t.slug}`}
                  className="group rounded-2xl border border-brand-line bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-accent hover:shadow-md"
                >
                  <span className="inline-flex rounded-md bg-brand-ink p-2.5">
                    <PdfToolIcon name={t.icone} className="h-5 w-5 text-brand-accent2" />
                  </span>
                  <h3 className="mt-3 font-semibold text-brand-ink group-hover:text-brand-deep">
                    {t.nome}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-brand-ink/70">{t.subtitulo}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* FAQ do hub */}
      <section className="mx-auto max-w-4xl px-4 pb-14">
        <h2 className="font-display text-2xl font-semibold text-brand-ink">Perguntas frequentes</h2>
        <div className="mt-4 space-y-3">
          {FAQ_HUB.map((f) => (
            <details key={f.q} className="rounded-xl border border-brand-line bg-white p-4">
              <summary className="cursor-pointer list-none font-medium text-brand-ink marker:content-none">
                {f.q}
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-brand-ink/75">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-6 text-sm text-brand-ink/70">
          Além do PDF: veja as{" "}
          <Link href="/ferramentas" className="font-medium text-brand-deep underline underline-offset-2">
            calculadoras e ferramentas jurídicas gratuitas
          </Link>{" "}
          ou{" "}
          <Link href="/modelos" className="font-medium text-brand-deep underline underline-offset-2">
            baixe modelos de documentos
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
