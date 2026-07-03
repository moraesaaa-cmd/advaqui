import { Scale } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";
import { ChecklistClient } from "./ChecklistClient";

/**
 * /ferramentas/triagem-mandado-seguranca
 *
 * Ferramenta gratuita e interativa: checklist de requisitos para mandado
 * de seguranca. O usuario marca os itens que se aplicam ao caso e recebe
 * feedback imediato sobre a viabilidade. Lead capture ao final.
 */

export const revalidate = 604800;

const PATH = "/ferramentas/triagem-mandado-seguranca";

const DESC =
  "Descubra se seu caso pode ser resolvido com mandado de seguranca. Avaliacao gratuita em 2 minutos.";

export const metadata = buildMetadata({
  title: "Triagem: Cabe Mandado de Seguranca?",
  description: DESC,
  path: PATH,
});

const FAQ_ITEMS = [
  {
    question: "Quanto tempo leva um mandado de seguranca?",
    answer:
      "O juiz deve decidir em ate 30 dias apos o recebimento da peticao (Art. 12, Lei 12.016/09). Na pratica, a decisao liminar pode sair em poucos dias, mas o julgamento definitivo pode levar meses dependendo do tribunal.",
  },
  {
    question: "Posso impetrar mandado de seguranca sem advogado?",
    answer:
      "Nao. O mandado de seguranca e uma acao judicial que exige representacao por advogado inscrito na OAB, com excecao de impetracao pelo Ministerio Publico (Art. 3, Lei 12.016/09).",
  },
  {
    question:
      "Qual a diferenca entre mandado de seguranca individual e coletivo?",
    answer:
      "O individual protege direito liquido e certo de uma pessoa. O coletivo pode ser impetrado por partidos politicos, organizacoes sindicais, entidades de classe ou associacoes em defesa dos interesses dos seus membros (Art. 21, Lei 12.016/09).",
  },
];

export default function TriagemMandadoSegurancaPage() {
  return (
    <main className="container-narrow py-10 md:py-14">
      <Breadcrumb
        items={[
          { label: "Ferramentas", href: "/ferramentas" },
          { label: "Triagem: Mandado de Seguranca" },
        ]}
      />

      {/* ---- Header ---- */}
      <header className="mb-8">
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(245,158,11,0.12)" }}
          >
            <Scale
              className="w-6 h-6 text-brand-accent"
              aria-hidden
            />
          </div>
          <div>
            <span className="inline-flex items-center text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-2 bg-green-100 text-green-800 border border-green-200">
              Ferramenta gratuita
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink tracking-tight leading-tight">
              Cabe mandado de seguranca no seu caso?
            </h1>
            <p className="text-base text-brand-ink/75 mt-3 leading-relaxed max-w-2xl">
              Marque os itens que se aplicam a sua situacao. A ferramenta avalia
              se o seu caso reune os requisitos basicos para um mandado de
              seguranca, conforme a{" "}
              <abbr title="Constituicao Federal">CF/88</abbr> e a Lei
              12.016/09.
            </p>
          </div>
        </div>
      </header>

      {/* ---- Interactive checklist + form + FAQ + links ---- */}
        <ChecklistClient />

      {/* ---- Disclaimer ---- */}
      <p className="text-xs text-brand-ink/50 mt-8 max-w-2xl">
        Esta ferramenta tem carater informativo e educacional. Nao constitui
        parecer juridico nem substitui a consulta a um advogado. Cada caso
        possui particularidades que devem ser analisadas por um profissional.
      </p>

      {/* ---- JSON-LD: Breadcrumb ---- */}
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", url: "/" },
          { name: "Ferramentas", url: "/ferramentas" },
          { name: "Triagem: Mandado de Seguranca", url: PATH },
        ])}
      />

      {/* ---- JSON-LD: FAQPage ---- */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ_ITEMS.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }}
      />

      {/* ---- JSON-LD: WebApplication ---- */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Triagem de Mandado de Seguranca — AdvAqui",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url: `${SITE.url}${PATH}`,
          description: DESC,
          inLanguage: "pt-BR",
          isAccessibleForFree: true,
          offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
          isPartOf: { "@type": "WebSite", url: SITE.url, name: SITE.name },
        }}
      />
    </main>
  );
}
