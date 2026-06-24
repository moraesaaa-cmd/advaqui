import Link from "next/link";
import { Clock, Route, ShieldCheck } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { CTAFinal } from "@/components/CTAFinal";
import { LinhaDoTempo } from "@/components/LinhaDoTempo";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";

/**
 * /linha-do-tempo — timeline interativa das etapas de um processo.
 *
 * Página pilar (SSG, revalidação semanal). Intro e conteúdo de apoio
 * renderizados no servidor; a linha do tempo clicável fica no componente
 * client <LinhaDoTempo>.
 */
export const revalidate = 604800;

const DESC =
  "Veja, etapa por etapa, como anda um processo na Justiça — trabalhista, cível, divórcio e INSS — com o que acontece em cada fase e uma estimativa de tempo. Em linguagem clara.";

export const metadata = buildMetadata({
  title: "Linha do tempo de um processo na Justiça",
  description: DESC,
  path: "/linha-do-tempo"
});

export default function LinhaDoTempoPage() {
  return (
    <div className="container-narrow py-10">
      <Breadcrumb items={[{ label: "Linha do tempo de um processo" }]} />

      <header className="card mb-6">
        <div className="flex items-start gap-3">
          <Route
            className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1"
            aria-hidden
          />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              Linha do tempo de um processo
            </h1>
            <p className="text-base text-brand-ink/85 mt-3 leading-relaxed">
              &quot;Entrei com a ação, e agora? Quanto tempo demora?&quot; Esta é
              a dúvida mais comum de quem nunca foi à Justiça. Escolha o tipo de
              processo e acompanhe cada etapa, da primeira providência até
              receber — sem juridiquês.
            </p>
          </div>
        </div>
      </header>

      {/* Timeline interativa */}
      <LinhaDoTempo />

      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
          <Clock className="w-5 h-5 text-brand-deep" aria-hidden />
          Por que um processo demora tanto?
        </h2>
        <p className="text-sm md:text-base text-brand-ink/85 leading-relaxed">
          O tempo de um processo depende de fatores que ninguém controla
          sozinho: o volume de casos da vara, a necessidade de perícia, o número
          de testemunhas e, principalmente, os recursos — quando a parte que
          perde leva a decisão a instâncias superiores. Por isso, um acordo bem
          avaliado costuma ser o caminho mais rápido e seguro de resolver. Use a
          linha do tempo acima como mapa, não como relógio: ela mostra a ordem
          das etapas, não uma data garantida.
        </p>
        <p className="text-sm text-brand-ink/70 mt-4 leading-relaxed">
          Quer estimar valores antes de decidir? Veja as{" "}
          <Link
            href="/calculadoras"
            className="text-brand-deep font-medium hover:underline"
          >
            calculadoras
          </Link>{" "}
          ou faça o{" "}
          <Link
            href="/diagnostico"
            className="text-brand-deep font-medium hover:underline"
          >
            diagnóstico trabalhista
          </Link>
          .
        </p>
      </section>

      <aside
        role="note"
        className="rounded-xl border-l-4 border-amber-400 bg-amber-50 p-4 text-xs md:text-sm text-amber-900 leading-relaxed flex items-start gap-2 mb-6"
      >
        <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden />
        <span>
          As etapas e os prazos aqui são uma orientação geral e informativa. Cada
          processo é único — só o advogado que acompanha o seu caso pode dizer em
          que fase ele está e o que esperar a seguir.
        </span>
      </aside>

      <CTAFinal />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Linha do tempo de um processo", url: "/linha-do-tempo" }
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Linha do tempo de um processo — AdvAqui",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url: `${SITE.url}/linha-do-tempo`,
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
