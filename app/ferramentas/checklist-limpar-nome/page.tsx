import { FileText } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";
import { ChecklistClient } from "./ChecklistClient";

/**
 * /ferramentas/checklist-limpar-nome
 *
 * Checklist interativo gratuito para ajudar o usuario a organizar a
 * limpeza de nome (SPC/Serasa). Server component exporta metadata;
 * toda a interatividade fica em <ChecklistClient>.
 */

export const revalidate = 604800;

const TITLE = "Checklist: Como Limpar Seu Nome";
const DESC =
  "Passo a passo gratuito para sair do SPC/Serasa. Organize seus documentos e saiba seus direitos.";
const PATH = "/ferramentas/checklist-limpar-nome";

export const metadata = buildMetadata({
  title: TITLE,
  description: DESC,
  path: PATH
});

const FAQ_ITEMS = [
  {
    q: "Quanto tempo leva para limpar o nome?",
    a: "Apos o pagamento ou acordo, o credor tem ate 5 dias uteis para retirar a negativacao. Se a divida ja prescreveu (mais de 5 anos), voce pode pedir a remocao imediata com base no Art. 43, par.1, do CDC."
  },
  {
    q: "Posso negociar a divida por um valor menor?",
    a: "Sim. Muitos credores aceitam descontos de 40% a 90%, principalmente em feiroes como o Serasa Limpa Nome. Sempre peca proposta por escrito e guarde o comprovante de pagamento."
  },
  {
    q: "Fui negativado indevidamente. Tenho direito a indenizacao?",
    a: "Sim. Negativacao sem notificacao previa (Art. 43, par.2, CDC) ou apos a quitacao gera direito a indenizacao por danos morais. A Sumula 385 do STJ define as condicoes. Procure um advogado de direito do consumidor."
  }
];

export default function ChecklistLimparNomePage() {
  return (
    <main className="container-narrow py-10">
      <Breadcrumb
        items={[
          { label: "Ferramentas", href: "/ferramentas" },
          { label: TITLE }
        ]}
      />

      {/* ---- Header ---- */}
      <header className="card mb-8">
        <div className="flex items-start gap-3">
          <FileText
            className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1"
            aria-hidden
          />
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
                {TITLE}
              </h1>
              <span className="inline-flex items-center text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-green-100 text-green-800 border border-green-200">
                Ferramenta gratuita
              </span>
            </div>
            <p className="text-base text-brand-ink/85 mt-2 leading-relaxed max-w-2xl">
              Use este checklist para organizar o passo a passo da limpeza do
              seu nome. Marque cada item conforme for resolvendo e veja o
              progresso. Nenhum dado pessoal e armazenado &mdash; tudo
              acontece no seu navegador.
            </p>
          </div>
        </div>
      </header>

      {/* ---- Interactive client component ---- */}
        <ChecklistClient />

      {/* ---- JSON-LD: Breadcrumb ---- */}
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", url: "/" },
          { name: "Ferramentas", url: "/ferramentas" },
          { name: TITLE, url: PATH }
        ])}
      />

      {/* ---- JSON-LD: FAQPage ---- */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ_ITEMS.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.a
            }
          }))
        }}
      />

      {/* ---- JSON-LD: WebApplication ---- */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: `${TITLE} — ${SITE.name}`,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url: `${SITE.url}${PATH}`,
          description: DESC,
          inLanguage: "pt-BR",
          isAccessibleForFree: true,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "BRL"
          },
          isPartOf: {
            "@type": "WebSite",
            url: SITE.url,
            name: SITE.name
          }
        }}
      />
    </main>
  );
}
