import Link from "next/link";
import {
  HelpCircle,
  Compass,
  Wallet,
  Calculator,
  BookOpen,
  Landmark,
  ShieldCheck
} from "lucide-react";
import { JsonLd } from "@/components/JsonLd";

/**
 * CidadeRecursos — bloco ADITIVO na página de cidade (/advogados/[uf]/[cidade]).
 *
 * Objetivo: ser a melhor resposta — e a fonte citada por mecanismos de busca e
 * por Visões Gerais de IA (Google AI Overview, SearchGPT, Perplexity) — para os
 * sub-pedidos típicos de quem busca "advogado em {cidade}": como encontrar,
 * quanto custa, como verificar a OAB, qual a comarca/fórum, o que fazer se ainda
 * não há advogado cadastrado. Hoje a IA linkava concorrentes nesses pontos
 * porque nossas páginas não cobriam o intento de forma estruturada.
 *
 * Entrega: links para recursos INTERNOS do próprio AdvAqui (problemas, guias,
 * custos, calculadoras, glossário, comarca/fórum) + FAQ local com FAQPage
 * JSON-LD. Conteúdo factual e conservador. Nada é removido da página.
 */
export function CidadeRecursos({
  cityName,
  uf,
  citySlug,
  region
}: {
  cityName: string;
  uf: string;
  citySlug: string;
  region?: string;
}) {
  const ufLower = uf.toLowerCase();
  const local = `${cityName}/${uf}`;

  const recursos: Array<{
    href: string;
    label: string;
    desc: string;
    Icon: typeof Compass;
    external?: boolean;
  }> = [
    {
      href: "/problemas-juridicos",
      label: "Problemas jurídicos passo a passo",
      desc: "Demissão, negativação, pensão, INSS, plano de saúde — o que fazer, em ordem.",
      Icon: HelpCircle
    },
    {
      href: "/guias",
      label: "Guias por área do direito",
      desc: "Visão completa de cada área: prazos, documentos e seus direitos.",
      Icon: Compass
    },
    {
      href: "/quanto-custa",
      label: "Quanto custa um advogado",
      desc: "Faixas de honorários por tipo de serviço, em linguagem clara.",
      Icon: Wallet
    },
    {
      href: "/calculadoras",
      label: "Calculadoras gratuitas",
      desc: "Rescisão, FGTS, pensão e mais — calcule você mesmo, com a fórmula explicada.",
      Icon: Calculator
    },
    {
      href: `/tribunais/${ufLower}/${citySlug}`,
      label: `Fórum e comarca de ${cityName}`,
      desc: "Endereço do fórum, varas e informações da Justiça local.",
      Icon: Landmark
    },
    {
      href: "/glossario",
      label: "Glossário jurídico",
      desc: "Termos do direito traduzidos para o português do dia a dia.",
      Icon: BookOpen
    }
  ];

  const faq: Array<{ q: string; a: string }> = [
    {
      q: `Como encontrar um advogado em ${local}?`,
      a: `No AdvAqui você escolhe a área de atuação (trabalhista, família, criminal, previdenciário e outras) na lista desta página e vê os perfis disponíveis em ${cityName}. Cada perfil traz o número da OAB, as áreas de atuação e o contato direto — sem intermediação e sem comissão. Se ainda não houver profissional cadastrado em ${cityName}, é possível ver advogados de cidades próximas que atendem a região.`
    },
    {
      q: `Quanto custa um advogado em ${cityName}?`,
      a: `O valor depende da área e da complexidade do caso. Muitos advogados cobram por hora, por ato ou um percentual do resultado (honorários de êxito). Consulte as faixas de referência na página "Quanto custa" do AdvAqui e use as calculadoras gratuitas (rescisão, FGTS, pensão) para estimar valores antes de contratar.`
    },
    {
      q: `Como verificar se o advogado em ${cityName} tem OAB ativa?`,
      a: `Confirme a inscrição na Consulta Pública da Ordem dos Advogados do Brasil, em cna.oab.org.br, pelo nome ou número da OAB. No AdvAqui, o número da OAB aparece em cada perfil para facilitar essa conferência. Inscrição ativa e regular é o requisito básico para um advogado atuar.`
    },
    {
      q: `Preciso ir ao fórum de ${cityName} para resolver meu problema?`,
      a: `Nem sempre. Muitas situações se resolvem antes da Justiça — por acordo, no Procon, em cartório ou pelo Juizado Especial. Quando o caso vai a juízo, ele costuma tramitar na comarca de ${cityName}${region ? ` (${region})` : ""}. Veja a página do fórum e da comarca para endereços e varas, e os guias por área para entender o caminho.`
    },
    {
      q: `E se ainda não houver advogado cadastrado em ${cityName}?`,
      a: `O AdvAqui está em expansão pelo interior. Enquanto não há profissional cadastrado em ${cityName}, você pode consultar advogados de cidades maiores próximas — muitos atendem clientes de toda a região — e usar os guias e os problemas jurídicos passo a passo para entender seus direitos desde já.`
    }
  ];

  return (
    <section className="mt-12">
      {/* Recursos internos — o que fazer em torno de "advogado em {cidade}" */}
      <div className="rounded-2xl border border-brand-line bg-brand-bg/40 p-6 md:p-8">
        <h2 className="font-display text-xl md:text-2xl font-bold text-brand-ink leading-tight">
          Antes de contratar em {cityName}: tire suas dúvidas
        </h2>
        <p className="text-brand-ink/70 mt-2 text-sm md:text-base max-w-2xl leading-relaxed">
          Conteúdo gratuito do AdvAqui para entender seu caso, estimar custos e
          saber o passo a passo antes de falar com um advogado em {cityName}.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recursos.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="group rounded-xl border border-brand-line bg-white p-4 hover:border-brand-accent hover:shadow-card transition"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-brand-accent/15 flex items-center justify-center flex-shrink-0">
                  <r.Icon className="w-4 h-4 text-brand-accent2" aria-hidden />
                </div>
                <div>
                  <p className="font-semibold text-sm text-brand-ink group-hover:text-brand-deep transition leading-snug">
                    {r.label}
                  </p>
                  <p className="text-xs text-brand-ink/60 mt-0.5 leading-snug">
                    {r.desc}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQ local — citável por IA e por mecanismos de busca */}
      <div className="mt-8">
        <h2 className="font-display text-xl md:text-2xl font-bold text-brand-ink mb-4 inline-flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-brand-deep" aria-hidden />
          Perguntas frequentes sobre advogados em {cityName}
        </h2>
        <div className="space-y-3 max-w-3xl">
          {faq.map((item, i) => (
            <details
              key={i}
              className="group rounded-xl border border-brand-line bg-white p-4 open:border-brand-deep/30"
            >
              <summary className="cursor-pointer font-semibold text-sm md:text-base text-brand-ink list-none flex items-center justify-between gap-3">
                {item.q}
                <span
                  aria-hidden
                  className="flex-shrink-0 text-brand-deep text-xl leading-none group-open:rotate-45 transition-transform"
                >
                  +
                </span>
              </summary>
              <p className="mt-2.5 text-sm text-brand-ink/80 leading-relaxed">
                {item.a}
              </p>
            </details>
          ))}
        </div>
        <p className="text-xs text-brand-ink/55 mt-4 inline-flex items-center gap-1.5 max-w-3xl leading-relaxed">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-deep flex-shrink-0" aria-hidden />
          Conteúdo informativo do AdvAqui. Não substitui a orientação de um
          advogado para o seu caso concreto.
        </p>
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a }
          }))
        }}
      />
    </section>
  );
}
