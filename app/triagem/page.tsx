import { Compass, ShieldCheck } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { CTAFinal } from "@/components/CTAFinal";
import { TriagemWidget } from "@/components/TriagemWidget";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";

/**
 * /triagem — assistente de triagem de problema jurídico.
 * Página pilar (SSG). Classificação por regras em <TriagemWidget>, sem
 * armazenar dado pessoal.
 */
export const revalidate = 604800;

const DESC =
  "Não sabe que tipo de advogado procurar? Responda 3 perguntas: a triagem do AdvAqui identifica a área do seu caso, a urgência e o próximo passo. Grátis, sem cadastro.";

export const metadata = buildMetadata({
  title: "Triagem jurídica — qual advogado procurar",
  description: DESC,
  path: "/triagem"
});

export default function TriagemPage() {
  return (
    <div className="container-narrow py-10">
      <Breadcrumb items={[{ label: "Triagem jurídica" }]} />

      <header className="card mb-6">
        <div className="flex items-start gap-3">
          <Compass className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              Triagem: qual advogado o seu caso pede?
            </h1>
            <p className="text-base text-brand-ink/85 mt-3 leading-relaxed">
              &quot;Tenho um problema, mas não sei se é com advogado trabalhista,
              de família, do consumidor...&quot; Responda 3 perguntas rápidas e a
              gente aponta a área, a urgência e o melhor próximo passo — incluindo
              as ferramentas gratuitas que ajudam no seu tipo de caso.
            </p>
          </div>
        </div>
      </header>

      <TriagemWidget />

      <aside
        role="note"
        className="rounded-xl border-l-4 border-amber-400 bg-amber-50 p-4 text-xs md:text-sm text-amber-900 leading-relaxed flex items-start gap-2 mb-6"
      >
        <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden />
        <span>
          A triagem é uma orientação automática e gratuita — não é parecer
          jurídico e não substitui o advogado. Não guardamos as suas respostas:
          tudo acontece no seu navegador.
        </span>
      </aside>

      <CTAFinal />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Triagem jurídica", url: "/triagem" }
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Triagem jurídica — AdvAqui",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url: `${SITE.url}/triagem`,
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
