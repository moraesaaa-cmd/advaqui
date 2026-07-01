import Link from "next/link";
import { Radar, HelpCircle, ShieldCheck } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { CTAFinal } from "@/components/CTAFinal";
import { ConsultaProcesso } from "@/components/ConsultaProcesso";
import { ToolGate } from "@/components/ToolGate";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";

/**
 * /processos — consulta de andamento processual pela API Pública do DataJud.
 * Página pilar (SSG). A consulta interativa é o client component
 * <ConsultaProcesso>, que chama /api/consulta-processo (server-side).
 */
export const revalidate = 604800;

const DESC =
  "Consulte grátis o andamento de um processo pelo número (padrão CNJ). Veja classe, órgão julgador e as movimentações, usando a base pública oficial do DataJud (CNJ). Cadastro gratuito.";

export const metadata = buildMetadata({
  title: "Consulta de processos — andamento pelo número (CNJ)",
  description: DESC,
  path: "/processos"
});

const FAQ = [
  {
    q: "De onde vêm os dados?",
    a: "Da API Pública do DataJud, mantida pelo Conselho Nacional de Justiça (CNJ). É a base oficial que reúne os processos dos tribunais do país. Aqui aparecem apenas os dados públicos: classe, órgão julgador e movimentações."
  },
  {
    q: "Aparecem os nomes das partes ou o conteúdo do processo?",
    a: "Não. A base pública traz só metadados e a lista de movimentações. Nomes das partes, documentos e decisões não são expostos. Processos em segredo de justiça não aparecem."
  },
  {
    q: "Quais tribunais a consulta cobre?",
    a: "Justiça Estadual (TJ de todos os estados), do Trabalho (TRTs), Federal (TRFs), além de STJ e STM. Para Justiça Eleitoral, Militar Estadual ou STF, consulte diretamente no site do tribunal."
  },
  {
    q: "Qual é o número certo para digitar?",
    a: "O número único do processo, no padrão CNJ, com 20 dígitos — algo como 0000000-00.0000.8.13.0000. Você encontra na petição, na intimação ou no site do tribunal."
  }
];

export default function ProcessosPage() {
  return (
    <div className="container-narrow py-10">
      <Breadcrumb items={[{ label: "Consulta de processos" }]} />

      <header className="card mb-6">
        <div className="flex items-start gap-3">
          <Radar className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              Consulta de processos
            </h1>
            <p className="text-base text-brand-ink/85 mt-3 leading-relaxed">
              Acompanhe o andamento de um processo pelo número, direto da base
              pública oficial do CNJ (DataJud). Digite o número no padrão CNJ e
              veja as movimentações em ordem. Grátis — basta criar sua conta.
            </p>
          </div>
        </div>
      </header>

      <ToolGate>
        <ConsultaProcesso />
      </ToolGate>

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
          Quer entender as etapas pelas quais o processo passa? Veja a{" "}
          <Link href="/linha-do-tempo" className="text-brand-deep font-medium hover:underline">
            linha do tempo de um processo
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
          Ferramenta de consulta informativa, baseada nos dados públicos do CNJ.
          O acompanhamento oficial e a interpretação das movimentações do seu
          caso devem ser feitos pelo seu advogado.
        </span>
      </aside>

      <CTAFinal />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Consulta de processos", url: "/processos" }
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
          name: "Consulta de processos (DataJud) — AdvAqui",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url: `${SITE.url}/processos`,
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
