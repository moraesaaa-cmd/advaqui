import Link from "next/link";
import { Scale, Building2, Gavel, HelpCircle, ShieldCheck } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { CTAFinal } from "@/components/CTAFinal";
import { DivorcioValidador } from "@/components/DivorcioValidador";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";

/**
 * /divorcio — validador de requisitos para divórcio (cartório x Justiça).
 *
 * Página pilar (SSG, revalidação semanal). Conteúdo de apoio no servidor;
 * o validador interativo fica no client component <DivorcioValidador>.
 */
export const revalidate = 604800;

const DESC =
  "Descubra na hora se o seu divórcio pode ser feito em cartório (mais rápido e barato) ou se precisa ir à Justiça. Responda 4 perguntas. Grátis e sem cadastro.";

export const metadata = buildMetadata({
  title: "Divórcio em cartório ou na Justiça? Descubra",
  description: DESC,
  path: "/divorcio"
});

const FAQ = [
  {
    q: "Quando o divórcio pode ser feito em cartório?",
    a: "Quando é consensual (os dois concordam) e não há filhos menores de idade ou incapazes. Nesse caso, faz-se por escritura pública num cartório de notas, com assistência de advogado — é mais rápido e barato que a via judicial (Lei 11.441/2007)."
  },
  {
    q: "Tenho filhos menores. Posso fazer no cartório?",
    a: "Em regra, não. Havendo filhos menores ou incapazes, o divórcio precisa ser judicial, para que o juiz analise guarda, convivência e pensão alimentícia. Se já houver decisão judicial definindo essas questões, converse com um advogado sobre as exceções."
  },
  {
    q: "Preciso de advogado mesmo no cartório?",
    a: "Sim. O advogado é obrigatório em qualquer divórcio — no cartório, inclusive, pode ser um só advogado assistindo o casal, desde que haja consenso."
  },
  {
    q: "Dá para dividir os bens depois?",
    a: "Sim. É possível divorciar-se primeiro e partilhar os bens depois, tanto no cartório quanto na Justiça. Mas resolver a partilha junto costuma evitar um segundo processo."
  }
];

export default function DivorcioPage() {
  return (
    <div className="container-narrow py-10">
      <Breadcrumb items={[{ label: "Divórcio: cartório ou Justiça" }]} />

      <header className="card mb-6">
        <div className="flex items-start gap-3">
          <Scale className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              Divórcio em cartório ou na Justiça?
            </h1>
            <p className="text-base text-brand-ink/85 mt-3 leading-relaxed">
              Nem todo divórcio precisa de processo. Em muitos casos dá para
              resolver em cartório, em poucos dias. Responda 4 perguntas e
              descubra qual é o seu caminho — e o que muda em cada um.
            </p>
          </div>
        </div>
      </header>

      <DivorcioValidador />

      <section className="card mb-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-brand-line p-4">
            <h2 className="font-display text-base font-bold text-brand-ink inline-flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" aria-hidden />
              Cartório (extrajudicial)
            </h2>
            <ul className="mt-2 space-y-1.5 text-sm text-brand-ink/80">
              <li className="pl-3 border-l-2 border-emerald-200">Consensual (os dois de acordo)</li>
              <li className="pl-3 border-l-2 border-emerald-200">Sem filhos menores ou incapazes</li>
              <li className="pl-3 border-l-2 border-emerald-200">Com advogado (pode ser um para os dois)</li>
              <li className="pl-3 border-l-2 border-emerald-200">Rápido — resolve por escritura, sem juiz</li>
            </ul>
          </div>
          <div className="rounded-xl border border-brand-line p-4">
            <h2 className="font-display text-base font-bold text-brand-ink inline-flex items-center gap-2">
              <Gavel className="w-5 h-5 text-amber-600" aria-hidden />
              Justiça (judicial)
            </h2>
            <ul className="mt-2 space-y-1.5 text-sm text-brand-ink/80">
              <li className="pl-3 border-l-2 border-amber-200">Quando há filhos menores ou incapazes</li>
              <li className="pl-3 border-l-2 border-amber-200">Quando não há acordo (litigioso)</li>
              <li className="pl-3 border-l-2 border-amber-200">Consensual judicial: o juiz homologa o acordo</li>
              <li className="pl-3 border-l-2 border-amber-200">Decide guarda, pensão e partilha</li>
            </ul>
          </div>
        </div>
        <p className="text-sm text-brand-ink/70 mt-4 leading-relaxed">
          Vai ter pensão envolvida? Veja a{" "}
          <Link href="/calculadoras/pensao-alimenticia-percentual" className="text-brand-deep font-medium hover:underline">
            calculadora de pensão
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
          Ferramenta informativa, não substitui a consulta a um advogado — que é
          obrigatório no divórcio, seja em cartório ou na Justiça, e confirma o
          melhor caminho para o seu caso.
        </span>
      </aside>

      <CTAFinal areaSlug="familia" />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Divórcio: cartório ou Justiça", url: "/divorcio" }
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
          name: "Divórcio em cartório ou na Justiça — AdvAqui",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url: `${SITE.url}/divorcio`,
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
