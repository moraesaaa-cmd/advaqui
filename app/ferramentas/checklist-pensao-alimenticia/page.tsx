import { FileText, HelpCircle } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";
import { ChecklistClient } from "./ChecklistClient";
import { ToolGate } from "@/components/ToolGate";

/* ------------------------------------------------------------------ */
/* Metadata (server-side)                                              */
/* ------------------------------------------------------------------ */

export const revalidate = 604800;

export const metadata = buildMetadata({
  title: "Checklist: Pedido de Pensao Alimenticia",
  description:
    "Documentos necessarios e passos para pedir pensao alimenticia judicial. Guia gratuito e completo.",
  path: "/ferramentas/checklist-pensao-alimenticia",
});

/* ------------------------------------------------------------------ */
/* FAQ data (shared between rendered section and JSON-LD)              */
/* ------------------------------------------------------------------ */

const FAQ = [
  {
    q: "Quanto tempo demora um pedido de pensao alimenticia?",
    a: "Em media, a primeira audiencia e marcada entre 30 e 60 dias apos o protocolo. Se houver pedido de alimentos provisorios, o juiz pode fixar um valor temporario em poucos dias, antes mesmo da audiencia.",
  },
  {
    q: "E obrigatorio ter advogado para pedir pensao?",
    a: "Sim, e preciso ter advogado ou defensor publico. Quem nao tem renda para pagar advogado particular pode procurar a Defensoria Publica, que atende gratuitamente e atua em varas de familia.",
  },
  {
    q: "Qual o valor minimo de pensao alimenticia?",
    a: "A lei nao fixa um percentual obrigatorio. O valor e definido pelo juiz com base nas necessidades de quem recebe e nas possibilidades de quem paga. Na pratica, gira em torno de 30% do salario para um filho, mas varia caso a caso.",
  },
];

/* ------------------------------------------------------------------ */
/* Page (server component)                                             */
/* ------------------------------------------------------------------ */

export default function ChecklistPensaoAlimenticiaPage() {
  return (
    <main className="container-narrow py-10">
      <Breadcrumb
        items={[
          { label: "Ferramentas", href: "/ferramentas" },
          { label: "Checklist: Pedido de Pensao Alimenticia" },
        ]}
      />

      {/* ---- Header ---- */}
      <header className="card mb-6">
        <div className="flex items-start gap-3">
          <FileText
            className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1"
            aria-hidden
          />
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
                Checklist: Pedido de Pensao Alimenticia
              </h1>
              <span className="inline-flex items-center text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                Ferramenta gratuita
              </span>
            </div>
            <p className="text-base text-brand-ink/85 mt-2 leading-relaxed">
              Reuna os documentos e cumpra cada etapa antes de dar entrada no
              pedido de pensao alimenticia. Marque os itens conforme for
              providenciando — o progresso aparece no topo.
            </p>
          </div>
        </div>
      </header>

      {/* ---- Interactive checklist (client component) ---- */}
      <ToolGate>
        <ChecklistClient />
      </ToolGate>

      {/* ---- FAQ ---- */}
      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-4 inline-flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-brand-deep" aria-hidden />
          Perguntas frequentes
        </h2>
        <div className="space-y-4">
          {FAQ.map((f) => (
            <div key={f.q} className="pl-4 border-l-2 border-brand-line">
              <h3 className="font-semibold text-brand-ink">{f.q}</h3>
              <p className="text-sm text-brand-ink/80 mt-1 leading-relaxed">
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- JSON-LD: BreadcrumbList ---- */}
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", url: "/" },
          { name: "Ferramentas", url: "/ferramentas" },
          {
            name: "Checklist: Pedido de Pensao Alimenticia",
            url: "/ferramentas/checklist-pensao-alimenticia",
          },
        ])}
      />

      {/* ---- JSON-LD: FAQPage ---- */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.a,
            },
          })),
          url: `${SITE.url}/ferramentas/checklist-pensao-alimenticia`,
          inLanguage: "pt-BR",
        }}
      />
    </main>
  );
}
