import Link from "next/link";
import { Home, HelpCircle, ShieldCheck } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { CTAFinal } from "@/components/CTAFinal";
import { AuditorImobiliario } from "@/components/AuditorImobiliario";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";

/**
 * /imobiliario — auditor de riscos na compra de imóvel.
 * Página pilar (SSG). Checklist interativo em <AuditorImobiliario>.
 */
export const revalidate = 604800;

const DESC =
  "Vai comprar um imóvel? Confira grátis os documentos e certidões essenciais e descubra os pontos críticos que podem fazer você perder o imóvel ou o dinheiro. Sem cadastro.";

export const metadata = buildMetadata({
  title: "Comprar imóvel com segurança — checklist de riscos",
  description: DESC,
  path: "/imobiliario"
});

const FAQ = [
  {
    q: "Qual é o documento mais importante na compra de um imóvel?",
    a: "A matrícula atualizada no Cartório de Registro de Imóveis. Ela mostra quem é o verdadeiro dono e tudo que pesa sobre o imóvel — hipoteca, penhora, usufruto. Peça a versão dos últimos 30 dias."
  },
  {
    q: "Por que conferir as dívidas do vendedor?",
    a: "Se o vendedor tem dívidas e fica insolvente, a venda pode ser anulada por fraude à execução, e o comprador corre o risco de perder o imóvel. Por isso se conferem certidões cíveis, trabalhistas e federais do vendedor."
  },
  {
    q: "O que é uma cláusula abusiva em contrato de compra?",
    a: "Aquela que desequilibra o contrato contra o comprador — por exemplo, multa pesada só para um lado, ou ausência de devolução de valores se o financiamento não sair. Vale revisar com um advogado antes de assinar."
  }
];

export default function ImobiliarioPage() {
  return (
    <div className="container-narrow py-10">
      <Breadcrumb items={[{ label: "Comprar imóvel com segurança" }]} />

      <header className="card mb-6">
        <div className="flex items-start gap-3">
          <Home className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              Comprar imóvel com segurança
            </h1>
            <p className="text-base text-brand-ink/85 mt-3 leading-relaxed">
              Comprar um imóvel é, em geral, a maior compra da vida — e onde mais
              gente cai em armadilha. Use o checklist abaixo para conferir os
              documentos certos e ver, na hora, os pontos críticos que precisam
              ser resolvidos antes de assinar.
            </p>
          </div>
        </div>
      </header>

      <AuditorImobiliario />

      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-4 inline-flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-brand-deep" aria-hidden />
          Perguntas frequentes
        </h2>
        <div className="space-y-4">
          {FAQ.map((f) => (
            <div key={f.q} className="pl-4 border-l-2 border-brand-line">
              <h3 className="font-semibold text-brand-ink">{f.q}</h3>
              <p className="text-sm text-brand-ink/80 mt-1 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-brand-ink/70 mt-4 leading-relaxed">
          Vai pagar ITBI? Estime na{" "}
          <Link href="/calculadoras" className="text-brand-deep font-medium hover:underline">
            calculadora
          </Link>
          . Veja também as demais{" "}
          <Link href="/ferramentas" className="text-brand-deep font-medium hover:underline">
            ferramentas
          </Link>
          .
        </p>
      </section>

      <aside
        role="note"
        className="rounded-xl border-l-4 border-amber-400 bg-amber-50 p-4 text-xs md:text-sm text-amber-900 leading-relaxed flex items-start gap-2 mb-6"
      >
        <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden />
        <span>
          Checklist informativo, não substitui a análise jurídica da
          documentação. Antes de assinar ou pagar sinal, leve os documentos a um
          advogado imobiliário.
        </span>
      </aside>

      <CTAFinal areaSlug="imobiliario" />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Comprar imóvel com segurança", url: "/imobiliario" }
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a }
          }))
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Comprar imóvel com segurança — AdvAqui",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url: `${SITE.url}/imobiliario`,
          description: DESC,
          inLanguage: "pt-BR",
          isAccessibleForFree: true,
          offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
          isPartOf: { "@type": "WebSite", url: SITE.url, name: SITE.name }
        }}
      />
    </div>
  );
}
