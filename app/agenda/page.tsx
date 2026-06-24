import { CalendarCheck, ShieldCheck } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { CTAFinal } from "@/components/CTAFinal";
import { AgendamentoForm } from "@/components/AgendamentoForm";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";

/**
 * /agenda — pedido de agendamento de consulta. Página pilar (SSG). O formulário
 * é o client component <AgendamentoForm>, que grava via /api/agendamento.
 */
export const revalidate = 604800;

const DESC =
  "Agende uma conversa com um advogado: diga a área, o assunto e quando prefere. Pedido rápido, sem cadastro — o retorno é pelo seu WhatsApp ou e-mail.";

export const metadata = buildMetadata({
  title: "Agendar uma consulta com advogado",
  description: DESC,
  path: "/agenda"
});

export default function AgendaPage() {
  return (
    <div className="container-narrow py-10">
      <Breadcrumb items={[{ label: "Agendar consulta" }]} />

      <header className="card mb-6">
        <div className="flex items-start gap-3">
          <CalendarCheck className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              Agendar uma consulta
            </h1>
            <p className="text-base text-brand-ink/85 mt-3 leading-relaxed">
              Precisa conversar com um advogado? Conte o assunto e a melhor data.
              É rápido e sem cadastro — o retorno é feito pelo contato que você
              informar.
            </p>
          </div>
        </div>
      </header>

      <AgendamentoForm />

      <aside
        role="note"
        className="rounded-xl border-l-4 border-amber-400 bg-amber-50 p-4 text-xs md:text-sm text-amber-900 leading-relaxed flex items-start gap-2 mb-6"
      >
        <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden />
        <span>
          O envio é só um pedido de horário — a confirmação vem pelo contato
          informado. Seus dados são usados apenas para esse retorno.
        </span>
      </aside>

      <CTAFinal />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Agendar consulta", url: "/agenda" }
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Agendar consulta — AdvAqui",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url: `${SITE.url}/agenda`,
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
