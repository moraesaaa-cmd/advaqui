import Link from "next/link";
import { Stethoscope, Clock, ShieldCheck, HelpCircle } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { CTAFinal } from "@/components/CTAFinal";
import { DiagnosticoTrabalhista } from "@/components/DiagnosticoTrabalhista";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";

/**
 * /diagnostico — simulador/diagnóstico trabalhista interativo.
 *
 * Página pilar (SSG, revalidação semanal). O conteúdo estático (intro,
 * situações cobertas, prazos, FAQ) é renderizado no servidor — bom para SEO e
 * para quem está sem JS. O passo a passo interativo fica no componente client
 * <DiagnosticoTrabalhista>, que não envia nem grava nada.
 */
export const revalidate = 604800;

const DESC =
  "Responda 6 perguntas e descubra, em linguagem clara, quais direitos trabalhistas provavelmente cabem no seu caso, o prazo para agir e os próximos passos. Grátis, sem cadastro.";

export const metadata = buildMetadata({
  title: "Diagnóstico trabalhista — descubra seus direitos",
  description: DESC,
  path: "/diagnostico"
});

const SITUACOES_COBERTAS = [
  "Demissão sem justa causa",
  "Pedido de demissão",
  "Demissão por justa causa",
  "Verbas, acerto ou salário não pagos",
  "Horas extras não pagas",
  "Assédio moral ou sexual",
  "Acidente ou doença do trabalho",
  "Trabalho sem registro em carteira",
  "Acúmulo ou desvio de função"
];

const FAQ = [
  {
    q: "Quanto tempo eu tenho para entrar com uma ação trabalhista?",
    a: "Em regra, até 2 anos depois do fim do contrato. Dentro desse prazo, você pode cobrar os direitos dos últimos 5 anos de trabalho (artigo 7º, XXIX, da Constituição). Se você ainda está na empresa, o prazo de 2 anos só começa a contar quando o contrato terminar."
  },
  {
    q: "O diagnóstico garante que eu vou ganhar?",
    a: "Não. Ele aponta os direitos que costumam caber em cada situação, mas não é parecer jurídico nem previsão de decisão. Cada caso tem provas, prazos e detalhes que só um advogado avalia olhando a sua situação concreta."
  },
  {
    q: "Preciso ter documentos para procurar um advogado?",
    a: "Ajuda muito, mas não é obrigatório para começar. Holerites, carteira, mensagens e o extrato do FGTS fortalecem o caso. Mesmo sem documentos, testemunhas e a própria carteira de trabalho já servem de prova."
  },
  {
    q: "Meus dados ficam guardados?",
    a: "Não. O diagnóstico roda inteiramente no seu navegador. Nenhuma resposta é enviada para o site nem armazenada."
  }
];

export default function DiagnosticoPage() {
  return (
    <div className="container-narrow py-10">
      <Breadcrumb items={[{ label: "Diagnóstico trabalhista" }]} />

      <header className="card mb-6">
        <div className="flex items-start gap-3">
          <Stethoscope
            className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1"
            aria-hidden
          />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              Diagnóstico trabalhista
            </h1>
            <p className="text-base text-brand-ink/85 mt-3 leading-relaxed">
              Aconteceu algo no trabalho e você não sabe se tem direito a
              alguma coisa? Responda 6 perguntas rápidas. Em segundos você vê,
              em linguagem clara, os direitos que costumam caber no seu caso, o
              prazo para agir e o que fazer agora.
            </p>
          </div>
        </div>
      </header>

      {/* O simulador interativo */}
      <DiagnosticoTrabalhista />

      {/* Conteúdo estático — SEO + sem-JS */}
      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-3">
          Situações que o diagnóstico cobre
        </h2>
        <div className="flex flex-wrap gap-2">
          {SITUACOES_COBERTAS.map((s) => (
            <span key={s} className="chip text-xs text-brand-ink">
              {s}
            </span>
          ))}
        </div>
        <p className="text-sm text-brand-ink/70 mt-4 leading-relaxed">
          Quer ver o passo a passo de uma situação específica? Veja os{" "}
          <Link
            href="/problemas-juridicos"
            className="text-brand-deep font-medium hover:underline"
          >
            problemas jurídicos explicados
          </Link>{" "}
          ou use as{" "}
          <Link
            href="/calculadoras"
            className="text-brand-deep font-medium hover:underline"
          >
            calculadoras
          </Link>{" "}
          para estimar valores como rescisão, horas extras e FGTS.
        </p>
      </section>

      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
          <Clock className="w-5 h-5 text-brand-deep" aria-hidden />
          O prazo é o que mais derruba direitos
        </h2>
        <p className="text-sm md:text-base text-brand-ink/85 leading-relaxed">
          Na Justiça do Trabalho valem duas contas de tempo: você tem{" "}
          <strong>2 anos depois do fim do contrato</strong> para entrar com a
          ação e, dentro dela, pode cobrar os <strong>últimos 5 anos</strong> de
          trabalho. Passados os 2 anos, em regra o direito de reclamar prescreve.
          Por isso, ao primeiro sinal de problema, vale reunir as provas e
          conversar com um advogado — mesmo que você ainda não tenha decidido
          processar.
        </p>
      </section>

      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-4 inline-flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-brand-deep" aria-hidden />
          Perguntas frequentes
        </h2>
        <div className="space-y-4">
          {FAQ.map((f) => (
            <div
              key={f.q}
              className="pl-4 border-l-2 border-brand-line"
            >
              <h3 className="font-semibold text-brand-ink">{f.q}</h3>
              <p className="text-sm text-brand-ink/80 mt-1 leading-relaxed">
                {f.a}
              </p>
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
          O diagnóstico é uma ferramenta informativa e não substitui a consulta
          a um advogado. Ele indica caminhos comuns; o resultado real depende das
          provas, dos prazos e dos detalhes do seu caso, que só um profissional
          avalia.
        </span>
      </aside>

      <CTAFinal areaSlug="trabalhista" />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Diagnóstico trabalhista", url: "/diagnostico" }
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
          name: "Diagnóstico trabalhista — AdvAqui",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url: `${SITE.url}/diagnostico`,
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
