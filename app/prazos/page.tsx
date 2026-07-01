import Link from "next/link";
import { CalendarClock, ShieldCheck } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { CTAFinal } from "@/components/CTAFinal";
import { GerenciadorPrazos } from "@/components/GerenciadorPrazos";
import { ToolGate } from "@/components/ToolGate";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";

/**
 * /prazos — gerenciador pessoal de prazos (localStorage, client-side).
 * Página pilar (SSG). O gerenciador interativo é o client component
 * <GerenciadorPrazos>; o resto é conteúdo de apoio.
 */
export const revalidate = 604800;

const DESC =
  "Organize seus prazos e datas-limite com alertas por cor (vencido, urgente, atenção). Roda no seu navegador. Grátis — basta criar sua conta.";

export const metadata = buildMetadata({
  title: "Gerenciador de prazos — alertas por cor",
  description: DESC,
  path: "/prazos"
});

export default function PrazosPage() {
  return (
    <div className="container-narrow py-10">
      <Breadcrumb items={[{ label: "Gerenciador de prazos" }]} />

      <header className="card mb-6">
        <div className="flex items-start gap-3">
          <CalendarClock className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              Gerenciador de prazos
            </h1>
            <p className="text-base text-brand-ink/85 mt-3 leading-relaxed">
              Uma agenda simples para não perder nenhuma data importante —
              audiência, entrega, pagamento, renovação. A cor mostra o que está
              chegando. Tudo salvo só no seu navegador. Grátis — basta criar sua conta.
            </p>
          </div>
        </div>
      </header>

      <ToolGate>
        <GerenciadorPrazos />
      </ToolGate>

      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-2">
          Prazo de agenda x prazo processual
        </h2>
        <p className="text-sm md:text-base text-brand-ink/85 leading-relaxed">
          Esta ferramenta é uma agenda de lembretes — conta dias corridos no
          calendário. Para um <strong>prazo processual</strong>, que corre em
          dias úteis e desconta feriados (CPC, art. 219), use a{" "}
          <Link href="/calculadora-prazos" className="text-brand-deep font-medium hover:underline">
            calculadora de prazos
          </Link>
          . Precisa entender as etapas de um processo? Veja a{" "}
          <Link href="/linha-do-tempo" className="text-brand-deep font-medium hover:underline">
            linha do tempo
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
          Os prazos ficam salvos apenas neste navegador (não vão para nenhum
          servidor). Se limpar o histórico ou trocar de aparelho, eles não
          aparecem. Para controle profissional de prazos da advocacia, use também
          um sistema com backup.
        </span>
      </aside>

      <CTAFinal />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Gerenciador de prazos", url: "/prazos" }
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Gerenciador de prazos — AdvAqui",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url: `${SITE.url}/prazos`,
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
