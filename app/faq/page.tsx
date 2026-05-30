import { ChevronDown } from "lucide-react";
import { PLAN } from "@/lib/config";
import { formatCurrency } from "@/lib/utils/format";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/JsonLd";

export const metadata = buildMetadata({
  title: "Perguntas frequentes",
  description:
    "Tire dúvidas sobre cadastro, plano premium, ativação, suporte e validação de OAB no AdvAqui.",
  path: "/faq"
});

const FAQS: Array<[string, string]> = [
  [
    "O cadastro é realmente gratuito?",
    "Sim. Qualquer advogado com OAB ativa pode se cadastrar sem custo. O plano gratuito garante presença no diretório da sua cidade, com nome, OAB e cidade visíveis."
  ],
  [
    "O que o plano premium oferece?",
    `O premium coloca seu perfil no topo da página da sua cidade, com selo de destaque, dados completos visíveis (telefone, WhatsApp, endereço) e posição privilegiada. Custa ${formatCurrency(
      PLAN.price
    )} por mês, sem fidelidade.`
  ],
  [
    "Como funciona a ativação do premium?",
    `Após optar pelo premium no painel, você recebe as instruções de confirmação. A ativação é manual e ocorre em até ${PLAN.activationHours} horas após a sinalização.`
  ],
  [
    "Posso cancelar a qualquer momento?",
    "Sim. Não há fidelidade, contrato mínimo ou multa. O plano é mensal e você pode cancelar quando quiser. Se cancelar, mantém o destaque até o fim do mês pago."
  ],
  [
    "Vocês intermediam a relação advogado-cliente?",
    "Não. O AdvAqui é apenas um diretório. A contratação e a prestação de serviços acontecem diretamente entre o advogado e o cliente."
  ],
  [
    "Como entro em contato com o suporte?",
    "Pelo formulário de contato no site ou pela área de suporte dentro do seu painel de advogado."
  ],
  [
    "Vocês validam a OAB do advogado?",
    "O admin valida os cadastros manualmente, confirmando a inscrição ativa na seccional. Após validação, o perfil recebe o selo OAB verificada."
  ],
  [
    "E se minha cidade não estiver listada?",
    "O cadastro aceita qualquer cidade brasileira da base oficial do IBGE. Se a sua não estiver, fale com o suporte e validamos manualmente."
  ],
  [
    "Como o cliente entra em contato comigo?",
    "O cliente vê seu telefone e WhatsApp diretamente no seu perfil público. O contato é feito sem intermediação do AdvAqui."
  ],
  [
    "Posso ter mais de uma cidade de atuação?",
    "Sim. No painel do advogado premium você pode adicionar até 9 cidades adicionais de atendimento, totalizando 10 cidades. Seu perfil aparece em todas elas."
  ]
];

/**
 * JSON-LD FAQPage — habilita rich results no Google.
 * Cada par pergunta/resposta vira um Question com acceptedAnswer.
 */
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(([q, a]) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a }
  }))
};

/**
 * FAQ usando <details>/<summary> nativo do HTML.
 *
 * Vantagens sobre accordion com useState:
 *   • Todas as 10 respostas estão no DOM mesmo fechadas (bom pra SEO/rich results)
 *   • Funciona sem JavaScript
 *   • Acessibilidade nativa do browser (aria-expanded, foco, teclado)
 *   • Sem 'use client' — server component puro
 */
export default function FaqPage() {
  return (
    <div className="container-narrow py-12">
      <h1 className="font-display text-4xl font-bold text-brand-ink mb-6">
        Perguntas frequentes
      </h1>
      <div className="space-y-3">
        {FAQS.map(([q, a], idx) => (
          <details
            key={idx}
            className="group rounded-2xl border border-brand-line bg-white overflow-hidden open:shadow-card"
            open={idx === 0}
          >
            <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between gap-4 font-semibold text-brand-ink text-base hover:bg-brand-line/20">
              <span>{q}</span>
              <ChevronDown
                className="w-5 h-5 text-brand-ink/50 transition-transform flex-shrink-0 group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <div className="px-5 pb-4 text-sm text-brand-ink/80 leading-relaxed">
              {a}
            </div>
          </details>
        ))}
      </div>

      <JsonLd data={faqSchema} />
    </div>
  );
}
