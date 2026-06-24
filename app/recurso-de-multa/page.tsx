import Link from "next/link";
import { Car, Clock, ShieldCheck, HelpCircle, ListChecks, MapPin } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { CTAFinal } from "@/components/CTAFinal";
import { RecursoMultaWidget } from "@/components/RecursoMultaWidget";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { findCapital, type City } from "@/lib/data/cities";
import { STATES } from "@/lib/data/states";
import { SITE } from "@/lib/config";

/**
 * /recurso-de-multa — gerador de recurso de multa de trânsito.
 *
 * Página pilar (SSG, revalidação semanal). Conteúdo de apoio renderizado no
 * servidor (SEO + sem-JS); o gerador interativo fica no client component
 * <RecursoMultaWidget>, que monta a peça por template, sem enviar nada.
 */
export const revalidate = 604800;

const DESC =
  "Gere grátis o recurso da sua multa de trânsito. Escolha a infração e a fase (defesa prévia, JARI ou CETRAN), preencha os dados e baixe a peça pronta com a fundamentação do CTB. Sem cadastro.";

export const metadata = buildMetadata({
  title: "Recurso de multa de trânsito — modelo grátis",
  description: DESC,
  path: "/recurso-de-multa"
});

const ETAPAS = [
  {
    titulo: "Defesa Prévia (da Autuação)",
    texto:
      "Primeira chance, logo após a Notificação da Autuação e antes de a multa ser aplicada. É onde se aponta vício no auto ou na notificação."
  },
  {
    titulo: "Recurso à JARI",
    texto:
      "Recurso de 1ª instância, apresentado depois da Notificação da Penalidade, à Junta Administrativa de Recursos de Infrações."
  },
  {
    titulo: "Recurso ao CETRAN",
    texto:
      "2ª instância, cabível se a JARI negar. Vai ao Conselho Estadual de Trânsito."
  }
];

const FAQ = [
  {
    q: "Qual o prazo para recorrer de uma multa?",
    a: "O prazo consta na própria notificação e, em regra, é de no mínimo 30 dias contados da data nela indicada. Perder o prazo costuma encerrar a discussão administrativa, então confira a data assim que receber a notificação."
  },
  {
    q: "Recorrer suspende a obrigação de pagar?",
    a: "Na defesa prévia e no recurso à JARI, em geral a exigência do pagamento fica suspensa até o julgamento. Confirme as regras do órgão autuador na sua notificação."
  },
  {
    q: "O recurso garante que a multa será cancelada?",
    a: "Não. Esta ferramenta monta um modelo bem fundamentado a partir das suas respostas, mas a decisão é do órgão de trânsito. Use apenas os argumentos verdadeiros no seu caso — alegar algo falso enfraquece o recurso."
  },
  {
    q: "Preciso de advogado para recorrer de multa?",
    a: "Para o recurso administrativo, não é obrigatório — você mesmo pode protocolar. Em casos mais graves (suspensão do direito de dirigir, lei seca, cassação da CNH), vale procurar um advogado."
  }
];

export default function RecursoMultaPage() {
  const capitais = STATES.map((s) => findCapital(s.uf)).filter(Boolean) as City[];
  return (
    <div className="container-narrow py-10">
      <Breadcrumb items={[{ label: "Recurso de multa" }]} />

      <header className="card mb-6">
        <div className="flex items-start gap-3">
          <Car className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              Recurso de multa de trânsito
            </h1>
            <p className="text-base text-brand-ink/85 mt-3 leading-relaxed">
              Levou uma multa que considera injusta? Monte aqui, de graça, o
              recurso com a fundamentação do Código de Trânsito Brasileiro.
              Escolha a infração e a fase, preencha os dados e baixe a peça
              pronta para protocolar. Sem cadastro.
            </p>
          </div>
        </div>
      </header>

      {/* Gerador interativo */}
      <RecursoMultaWidget />

      {/* Conteúdo de apoio — SEO + sem-JS */}
      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
          <ListChecks className="w-5 h-5 text-brand-deep" aria-hidden />
          As três fases do recurso
        </h2>
        <div className="space-y-3">
          {ETAPAS.map((e) => (
            <div key={e.titulo} className="pl-4 border-l-2 border-brand-line">
              <h3 className="font-semibold text-brand-ink">{e.titulo}</h3>
              <p className="text-sm text-brand-ink/80 mt-1 leading-relaxed">{e.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
          <Clock className="w-5 h-5 text-brand-deep" aria-hidden />
          O prazo é o que mais derruba recurso
        </h2>
        <p className="text-sm md:text-base text-brand-ink/85 leading-relaxed">
          A maioria dos recursos é perdida não pelo mérito, mas por perder o
          prazo. Assim que receber a notificação, anote a data-limite (em regra,
          ao menos 30 dias). Junte cópia da notificação, do documento do veículo
          (CRLV) e da CNH. Quer estimar custos ou calcular outros valores? Veja
          as{" "}
          <Link href="/calculadoras" className="text-brand-deep font-medium hover:underline">
            calculadoras
          </Link>{" "}
          ou as demais{" "}
          <Link href="/ferramentas" className="text-brand-deep font-medium hover:underline">
            ferramentas
          </Link>
          .
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
          Ferramenta informativa e gratuita. O modelo gerado é um ponto de
          partida para você revisar e adaptar; não substitui a orientação de um
          advogado nem garante o deferimento. Use somente argumentos verdadeiros
          no seu caso.
        </span>
      </aside>

      {/* Recurso de multa por cidade — caminho de crawl para as páginas locais */}
      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-1 inline-flex items-center gap-2">
          <MapPin className="w-5 h-5 text-brand-deep" aria-hidden />
          Recurso de multa por cidade
        </h2>
        <p className="text-sm text-brand-ink/75 mb-3 leading-relaxed">
          Cada cidade tem uma página com o órgão de trânsito local, prazos e o gerador. Comece pela
          capital do seu estado:
        </p>
        <div className="flex flex-wrap gap-2">
          {capitais.map((c) => (
            <Link
              key={`${c.uf}-${c.slug}`}
              href={`/recurso-de-multa/${c.uf.toLowerCase()}/${c.slug}`}
              className="text-sm px-3 py-1.5 rounded-full border border-brand-line hover:border-brand-deep hover:text-brand-deep transition"
            >
              {c.name}/{c.uf}
            </Link>
          ))}
        </div>
      </section>

      <CTAFinal />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Recurso de multa", url: "/recurso-de-multa" }
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
          name: "Recurso de multa de trânsito — AdvAqui",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url: `${SITE.url}/recurso-de-multa`,
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
