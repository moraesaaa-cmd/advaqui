import { FileText } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";
import { ChecklistClient } from "./ChecklistClient";

export const revalidate = 604800;

const DESC =
  "Documentos e preparação para pedir guarda judicial. Checklist gratuito para pais e mães.";

export const metadata = buildMetadata({
  title: "Checklist: Ação de Guarda de Filhos",
  description: DESC,
  path: "/ferramentas/checklist-documentos-guarda",
});

const FAQ = [
  {
    q: "Qual é o tipo de guarda mais comum no Brasil?",
    a: "A guarda compartilhada é a regra desde 2014 (Lei 13.058). O juiz só concede guarda unilateral quando a compartilhada for inviável — por exemplo, se um dos genitores oferecer risco à criança ou se houver distância geográfica que impeça a convivência.",
  },
  {
    q: "Preciso de advogado para pedir guarda?",
    a: "Sim. A ação de guarda tramita na Vara de Família e exige advogado ou defensor público. Se não tiver condições de pagar, procure a Defensoria Pública da sua cidade — o serviço é gratuito.",
  },
  {
    q: "A mãe sempre tem preferência na guarda?",
    a: "Não. A legislação brasileira não dá preferência a nenhum dos genitores. O juiz decide com base no melhor interesse da criança (Art. 1.583 do Código Civil), considerando vínculo afetivo, condições de moradia, rotina e participação na vida do filho.",
  },
];

export default function ChecklistGuardaPage() {
  return (
    <div className="container-narrow py-10">
      <Breadcrumb
        items={[
          { label: "Ferramentas", href: "/ferramentas" },
          { label: "Checklist: Ação de Guarda de Filhos" },
        ]}
      />

      <header className="card mb-6">
        <div className="flex items-start gap-3">
          <FileText
            className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1"
            aria-hidden
          />
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
                Checklist: Ação de Guarda de Filhos
              </h1>
              <span className="inline-flex items-center text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-accent/15 text-brand-deep border border-brand-accent/30">
                Ferramenta gratuita
              </span>
            </div>
            <p className="text-base text-brand-ink/85 mt-3 leading-relaxed">
              Reúna os documentos necessários antes de procurar um advogado para
              ação de guarda. Marque o que já tem e veja o que falta preparar.
            </p>
          </div>
        </div>
      </header>

      <ChecklistClient />

      <section className="card mb-6" id="faq">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-4">
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

      <section className="card mb-6">
        <h2 className="font-display text-lg font-bold text-brand-ink mb-3">
          Veja também
        </h2>
        <ul className="space-y-2 text-sm">
          <li>
            <a
              href="/advogados"
              className="text-brand-deep font-medium hover:underline"
            >
              Encontrar um advogado de Família na sua cidade
            </a>
          </li>
          <li>
            <a
              href="/calculadoras"
              className="text-brand-deep font-medium hover:underline"
            >
              Calculadoras juridicas (pensao, custas e mais)
            </a>
          </li>
          <li>
            <a
              href="/blog"
              className="text-brand-deep font-medium hover:underline"
            >
              Blog: artigos sobre Direito de Familia
            </a>
          </li>
        </ul>
      </section>

      <p className="text-xs text-brand-ink/50 mt-8 max-w-2xl">
        Este checklist tem caráter informativo e não substitui orientação
        jurídica profissional. Cada caso tem particularidades que podem exigir
        documentos adicionais.
      </p>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Ferramentas", url: "/ferramentas" },
          {
            name: "Checklist: Ação de Guarda de Filhos",
            url: "/ferramentas/checklist-documentos-guarda",
          },
        ])}
      />
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
        }}
      />
    </div>
  );
}
