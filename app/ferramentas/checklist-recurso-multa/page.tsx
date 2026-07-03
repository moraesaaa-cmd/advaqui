import { Car } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";
import { ChecklistClient } from "./ChecklistClient";

/**
 * /ferramentas/checklist-recurso-multa
 *
 * Checklist gratuito de recurso de multa de transito.
 * Server component com metadata; interatividade no <ChecklistClient>.
 */
export const revalidate = 604800;

const DESC =
  "Verifique se voce tem tudo para recorrer da sua multa de transito. Checklist gratuito e completo.";

export const metadata = buildMetadata({
  title: "Checklist: Recurso de Multa de Transito",
  description: DESC,
  path: "/ferramentas/checklist-recurso-multa",
});

const FAQ_SCHEMA = [
  {
    q: "Qual o prazo para recorrer de uma multa de transito?",
    a: "O prazo e de 30 dias corridos a partir do recebimento da notificacao de penalidade. Se voce perdeu o prazo da defesa previa, ainda pode recorrer a JARI dentro desse periodo.",
  },
  {
    q: "Posso recorrer de multa por excesso de velocidade?",
    a: "Sim. Verifique se o equipamento estava devidamente aferido e sinalizado. Irregularidades na sinalizacao ou na certificacao do radar sao motivos validos para anulacao.",
  },
  {
    q: "Preciso de advogado para recorrer de multa?",
    a: "Nao e obrigatorio, mas para multas graves (7 pontos) ou quando ha risco de suspensao da CNH, um advogado de transito aumenta significativamente as chances de sucesso.",
  },
];

const GOLD = "#C8A24A";

export default function ChecklistRecursoMultaPage() {
  return (
    <div className="container-narrow py-10">
      <Breadcrumb
        items={[
          { label: "Ferramentas", href: "/ferramentas" },
          { label: "Checklist: Recurso de Multa" },
        ]}
      />

      {/* ---- Header ---- */}
      <header className="card mb-6">
        <div className="flex items-start gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: "rgba(200,162,74,0.12)" }}
          >
            <Car className="w-5 h-5" style={{ color: GOLD }} aria-hidden />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="font-display text-2xl md:text-3xl font-bold text-brand-ink">
                Checklist: Recurso de Multa de Transito
              </h1>
            </div>
            <span
              className="inline-flex items-center text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-3"
              style={{
                background: "rgba(200,162,74,0.14)",
                color: "#A0843A",
                border: "1px solid rgba(200,162,74,0.3)",
              }}
            >
              Ferramenta gratuita
            </span>
            <p className="text-base text-brand-ink/85 mt-2 leading-relaxed">
              Antes de protocolar o recurso, confira se voce tem tudo em maos.
              Marque cada item abaixo e veja o que falta para montar uma defesa
              completa contra a sua multa de transito.
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
          {
            name: "Checklist: Recurso de Multa",
            url: "/ferramentas/checklist-recurso-multa",
          },
        ])}
      />

      {/* ---- JSON-LD: FAQPage ---- */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ_SCHEMA.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />

      {/* ---- JSON-LD: WebApplication ---- */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Checklist: Recurso de Multa de Transito — AdvAqui",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url: `${SITE.url}/ferramentas/checklist-recurso-multa`,
          description: DESC,
          inLanguage: "pt-BR",
          isAccessibleForFree: true,
          offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
          isPartOf: { "@type": "WebSite", url: SITE.url, name: SITE.name },
        }}
      />
    </div>
  );
}
