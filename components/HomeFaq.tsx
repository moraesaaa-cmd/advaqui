import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";

/**
 * HomeFaq — perguntas frequentes na home.
 *
 * Dois objetivos:
 *  1) Visitante: respostas diretas e amigáveis às dúvidas mais comuns, com
 *     <details> nativo (abre/fecha sem JavaScript).
 *  2) Citação por IA / Google: emite FAQPage JSON-LD com pares pergunta→resposta
 *     curtos e factuais — o formato que motores de busca e modelos de IA mais
 *     citam diretamente. Conteúdo geral e conservador (não substitui advogado).
 */
type QA = { q: string; a: string };

const FAQ: QA[] = [
  {
    q: "Preciso pagar para usar o AdvAqui?",
    a: "Não. A busca de advogados e todo o conteúdo jurídico — guias, modelos, calculadoras e glossário — são gratuitos para o cidadão. Você fala direto com o profissional, sem intermediação e sem comissão."
  },
  {
    q: "Quanto tempo tenho para entrar com uma ação trabalhista?",
    a: "Em regra, até 2 anos após a saída do emprego. Dentro desse prazo, é possível cobrar verbas dos últimos 5 anos do contrato (art. 7º, XXIX, da Constituição). Por isso não convém demorar."
  },
  {
    q: "Meu nome foi negativado indevidamente. O que fazer?",
    a: "Reúna as provas, exija a baixa junto ao credor e ao SPC/Serasa e guarde os protocolos. A negativação não pode durar mais de 5 anos e, quando é indevida, costuma haver direito a indenização por dano moral."
  },
  {
    q: "Dá para resolver um problema de consumo sem advogado?",
    a: "Em muitos casos, sim. Procon e a plataforma consumidor.gov.br são gratuitos, e no Juizado Especial as causas de até 20 salários mínimos podem ser ajuizadas sem advogado."
  },
  {
    q: "O INSS negou meu benefício. Tem como reverter?",
    a: "Tem. Você pode recorrer ao Conselho de Recursos da Previdência em até 30 dias e, se necessário, ajuizar ação na Justiça Federal. Boa parte das negativas é por falta de documento ou perícia, e o recurso bem instruído reverte muitos casos."
  },
  {
    q: "E se a pensão alimentícia não for paga?",
    a: "O atraso das 3 parcelas mais recentes permite pedir a prisão civil do devedor. Também é possível penhora de bens e desconto direto do salário. O não pagamento e o direito de visita são questões separadas."
  }
];

export function HomeFaq() {
  return (
    <section className="container-tight py-14 md:py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-deep/10 text-brand-deep">
            <HelpCircle className="w-3.5 h-3.5" aria-hidden />
            Perguntas frequentes
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-ink mt-3 leading-tight">
            Dúvidas comuns, respondidas direto
          </h2>
          <p className="text-brand-ink/65 mt-3 text-base md:text-lg">
            Respostas rápidas em linguagem clara. Para o seu caso específico,
            vale falar com um advogado.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <details
              key={i}
              className="group rounded-2xl border-2 border-brand-line bg-white p-5 open:border-brand-accent/40 transition"
            >
              <summary className="cursor-pointer font-display font-bold text-base md:text-lg text-brand-ink list-none flex items-center justify-between gap-3">
                {item.q}
                <span
                  aria-hidden
                  className="flex-shrink-0 text-brand-accent2 text-2xl leading-none group-open:rotate-45 transition-transform"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm md:text-base text-brand-ink/80 leading-relaxed">
                {item.a}
              </p>
            </details>
          ))}
        </div>

        <p className="text-center text-sm text-brand-ink/60 mt-6">
          Tem outra dúvida?{" "}
          <Link
            href="/problemas-juridicos"
            className="font-semibold text-brand-deep hover:text-brand-accent2 underline"
          >
            Veja os problemas jurídicos passo a passo
          </Link>
          .
        </p>
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a }
          }))
        }}
      />
    </section>
  );
}
