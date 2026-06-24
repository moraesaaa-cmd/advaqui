import Link from "next/link";
import { PiggyBank, ShieldCheck, HelpCircle } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { CTAFinal } from "@/components/CTAFinal";
import { CalculadoraWidget } from "@/components/CalculadoraWidget";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";

/**
 * /previdencia — guia das regras de aposentadoria + calculadora de pontos.
 *
 * Página pilar (SSG). Explica as regras de transição da EC 103/2019 em
 * linguagem clara e embute a calculadora de pontos (reaproveita o widget
 * de /calculadoras). As regras mudam a cada ano — o conteúdo é informativo e
 * remete sempre ao Meu INSS.
 */
export const revalidate = 604800;

const DESC =
  "Entenda as regras de aposentadoria depois da Reforma da Previdência (EC 103/2019): pontos, idade mínima e pedágios. Calcule sua pontuação grátis. Em linguagem clara.";

export const metadata = buildMetadata({
  title: "Aposentadoria: regras de transição e simulador",
  description: DESC,
  path: "/previdencia"
});

const REGRAS = [
  {
    nome: "Regra dos pontos",
    texto:
      "Soma da idade com o tempo de contribuição. A pontuação exigida sobe um ponto a cada ano. Exige tempo mínimo de contribuição (30 anos para mulher, 35 para homem)."
  },
  {
    nome: "Idade mínima progressiva",
    texto:
      "Uma idade mínima que aumenta meio ano a cada ano, até estabilizar. Também exige o tempo mínimo de contribuição."
  },
  {
    nome: "Pedágio de 50%",
    texto:
      "Para quem, na data da reforma (13/11/2019), estava a no máximo 2 anos de completar o tempo mínimo. Paga-se um 'pedágio' de 50% sobre o tempo que faltava."
  },
  {
    nome: "Pedágio de 100%",
    texto:
      "Combina uma idade mínima com o pagamento de um pedágio igual ao tempo que faltava para o mínimo na data da reforma. Costuma render benefício integral."
  }
];

const FAQ = [
  {
    q: "Por que existem várias regras de aposentadoria?",
    a: "A Reforma da Previdência (EC 103/2019) criou regras de transição para quem já contribuía antes dela, para não mudar tudo de uma vez. Cada pessoa pode se enquadrar em mais de uma — vale a que for mais vantajosa no seu caso."
  },
  {
    q: "O simulador confirma que eu posso me aposentar?",
    a: "Não. Ele calcula sua pontuação e mostra o tempo mínimo exigido, mas não confirma o direito. As regras mudam a cada ano e dependem do seu histórico completo de contribuições — confira no aplicativo Meu INSS e com um advogado previdenciário."
  },
  {
    q: "Onde vejo meu tempo de contribuição real?",
    a: "No aplicativo ou site Meu INSS, no extrato CNIS. Ele lista todos os seus vínculos e contribuições. Se houver período faltando, é possível corrigir com documentos."
  }
];

export default function PrevidenciaPage() {
  return (
    <div className="container-narrow py-10">
      <Breadcrumb items={[{ label: "Aposentadoria e previdência" }]} />

      <header className="card mb-6">
        <div className="flex items-start gap-3">
          <PiggyBank className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              Aposentadoria: as regras, sem juridiquês
            </h1>
            <p className="text-base text-brand-ink/85 mt-3 leading-relaxed">
              Depois da Reforma da Previdência, existe mais de um caminho para se
              aposentar. Veja as regras de transição em linguagem clara e calcule
              a sua pontuação (idade + tempo de contribuição) aqui mesmo.
            </p>
          </div>
        </div>
      </header>

      {/* Calculadora de pontos (reaproveita o widget das calculadoras) */}
      <CalculadoraWidget slug="aposentadoria-tempo-contribuicao" />

      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-4">
          As regras de transição (EC 103/2019)
        </h2>
        <div className="space-y-3">
          {REGRAS.map((r) => (
            <div key={r.nome} className="pl-4 border-l-2 border-brand-deep/30">
              <h3 className="font-semibold text-brand-ink">{r.nome}</h3>
              <p className="text-sm text-brand-ink/80 mt-1 leading-relaxed">{r.texto}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-brand-ink/70 mt-4 leading-relaxed">
          Quer estimar valores ou revisar um benefício negado? Veja as{" "}
          <Link href="/calculadoras/revisao-beneficio-inss" className="text-brand-deep font-medium hover:underline">
            calculadoras de INSS
          </Link>{" "}
          ou a{" "}
          <Link href="/linha-do-tempo" className="text-brand-deep font-medium hover:underline">
            linha do tempo de um processo
          </Link>{" "}
          (escolha INSS).
        </p>
      </section>

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
      </section>

      <aside
        role="note"
        className="rounded-xl border-l-4 border-amber-400 bg-amber-50 p-4 text-xs md:text-sm text-amber-900 leading-relaxed flex items-start gap-2 mb-6"
      >
        <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden />
        <span>
          As regras de transição mudam de valor a cada ano e dependem do seu
          histórico completo de contribuições. Este conteúdo é informativo —
          confirme sua situação no Meu INSS e com um advogado previdenciário
          antes de pedir o benefício.
        </span>
      </aside>

      <CTAFinal areaSlug="previdenciario" />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Aposentadoria e previdência", url: "/previdencia" }
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
          name: "Aposentadoria: regras e simulador — AdvAqui",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url: `${SITE.url}/previdencia`,
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
