import Link from "next/link";
import {
  Calculator,
  CalendarClock,
  FileText,
  FileSignature,
  BookOpen,
  Scale,
  HelpCircle,
  Coins,
  Landmark,
  UserPlus,
  Search,
  TrendingUp,
  Stethoscope,
  Route,
  Car,
  PiggyBank,
  Home,
  Compass,
  Radar,
  CalendarCheck,
  Percent,
  Wallet,
  Sparkles,
  ArrowRight,
  ClipboardCheck,
  ShieldCheck,
  Users,
  ChevronRight
} from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE } from "@/lib/config";

export const metadata = buildMetadata({
  title: "Ferramentas Jurídicas Gratuitas",
  description:
    "Checklists, simuladores e triagens jurídicas gratuitas. Organize seus documentos e descubra seus direitos.",
  path: "/ferramentas"
});

type Tool = {
  href: string;
  label: string;
  desc: string;
  Icon: typeof Calculator;
  area?: string;
  free?: boolean;
};

type Group = {
  title: string;
  blurb: string;
  tools: Tool[];
};

const AREA_COLORS: Record<string, { bg: string; text: string }> = {
  "Trânsito": { bg: "rgba(234,88,12,0.10)", text: "#C2410C" },
  "Consumidor": { bg: "rgba(37,99,235,0.10)", text: "#1D4ED8" },
  "Família": { bg: "rgba(147,51,234,0.10)", text: "#7C3AED" },
  "Administrativo": { bg: "rgba(22,163,74,0.10)", text: "#15803D" },
};

const GROUPS: Group[] = [
  {
    title: "Calcular e contar prazo",
    blurb:
      "Os cálculos que mais aparecem no dia a dia — com a fórmula explicada, não só o número.",
    tools: [
      {
        href: "/calculadora-prazos",
        label: "Calculadora de prazos",
        desc: "Vencimento em dias úteis (CPC) ou corridos, já descontando feriados.",
        Icon: CalendarClock
      },
      {
        href: "/correcao-monetaria",
        label: "Correção monetária (IPCA/INPC/IGP-M)",
        desc: "Atualize um valor pela inflação oficial do Banco Central, com a memória mês a mês.",
        Icon: Percent
      },
      {
        href: "/atualizar-valor",
        label: "Atualizar um valor",
        desc: "Correção, juros de mora e multa sobre uma dívida — com a memória de cálculo.",
        Icon: TrendingUp
      },
      {
        href: "/calculadoras",
        label: "Calculadoras jurídicas",
        desc: "Rescisão, FGTS, pensão, férias, 13º, aluguel, dívida, inventário e mais.",
        Icon: Calculator
      },
      {
        href: "/seguro-desemprego",
        label: "Simulador de seguro-desemprego",
        desc: "Quantas parcelas e qual o valor pela tabela oficial do MTE de 2026.",
        Icon: Wallet
      },
      {
        href: "/quanto-custa",
        label: "Quanto custa um advogado",
        desc: "Faixas de honorários por tipo de causa, em valores reais.",
        Icon: Coins
      },
      {
        href: "/prazos",
        label: "Gerenciador de prazos",
        desc: "Cadastre datas-limite e receba alertas por cor. Salva só no seu navegador.",
        Icon: CalendarClock
      }
    ]
  },
  {
    title: "Escrever um documento",
    blurb:
      "Rascunhos organizados para você levar ao advogado — com os campos certos e a estrutura na ordem.",
    tools: [
      {
        href: "/montar-peticao",
        label: "Montar petição",
        desc: "Reclamação trabalhista, alimentos, consumo, cobrança, honorários e procuração.",
        Icon: FileSignature
      },
      {
        href: "/modelos",
        label: "Modelos prontos",
        desc: "Procuração, contrato de locação, recibo, distrato e outros — é só preencher.",
        Icon: FileText
      },
      {
        href: "/recurso-de-multa",
        label: "Recurso de multa de trânsito",
        desc: "Monte o recurso (defesa prévia, JARI ou CETRAN) com a fundamentação do CTB.",
        Icon: Car
      }
    ]
  },
  {
    title: "Entender e pesquisar",
    blurb:
      "Antes de gastar com consulta, entenda o seu caso e o caminho dele.",
    tools: [
      {
        href: "/triagem",
        label: "Triagem: qual advogado procurar",
        desc: "3 perguntas apontam a área do seu caso, a urgência e o próximo passo.",
        Icon: Compass
      },
      {
        href: "/diagnostico",
        label: "Diagnóstico trabalhista",
        desc: "6 perguntas e você vê os direitos que cabem no seu caso, o prazo e o que fazer.",
        Icon: Stethoscope
      },
      {
        href: "/previdencia",
        label: "Aposentadoria: regras e simulador",
        desc: "As regras de transição explicadas + cálculo da sua pontuação (idade + tempo).",
        Icon: PiggyBank
      },
      {
        href: "/imobiliario",
        label: "Comprar imóvel com segurança",
        desc: "Checklist de documentos e certidões — vê os pontos críticos antes de assinar.",
        Icon: Home
      },
      {
        href: "/problemas-juridicos",
        label: "Problemas jurídicos passo a passo",
        desc: "Demissão, negativação, pensão, INSS, plano de saúde — o que fazer, em ordem.",
        Icon: HelpCircle
      },
      {
        href: "/linha-do-tempo",
        label: "Linha do tempo de um processo",
        desc: "Quanto tempo demora? Veja as etapas de um processo, da inicial ao pagamento.",
        Icon: Route
      },
      {
        href: "/divorcio",
        label: "Divórcio: cartório ou Justiça?",
        desc: "4 perguntas dizem se o seu divórcio pode ser em cartório ou precisa da Justiça.",
        Icon: Scale
      },
      {
        href: "/processos",
        label: "Consulta de processos",
        desc: "Acompanhe o andamento pelo número (CNJ), direto da base pública do DataJud.",
        Icon: Radar
      },
      {
        href: "/agenda",
        label: "Agendar uma consulta",
        desc: "Peça um horário com advogado — diga a área, o assunto e quando prefere.",
        Icon: CalendarCheck
      },
      {
        href: "/glossario",
        label: "Glossário jurídico",
        desc: "Termos do direito traduzidos para o português do dia a dia.",
        Icon: BookOpen
      },
      {
        href: "/jurisprudencia",
        label: "Jurisprudência STF/STJ",
        desc: "Decisões dos tribunais superiores organizadas por tema.",
        Icon: Scale
      },
      {
        href: "/tribunais",
        label: "Tribunais por cidade",
        desc: "Endereço do fórum, varas e informações da Justiça local.",
        Icon: Landmark
      }
    ]
  },
  {
    title: "Checklists e triagens gratuitas",
    blurb:
      "Verifique seus direitos em minutos. Marque os itens, veja o resultado e, se quiser, fale com um advogado.",
    tools: [
      {
        href: "/ferramentas/checklist-recurso-multa",
        label: "Checklist: Recurso de Multa",
        desc: "Verifique se tem tudo para recorrer",
        Icon: Car,
        area: "Trânsito",
        free: true
      },
      {
        href: "/ferramentas/checklist-limpar-nome",
        label: "Checklist: Limpar Nome",
        desc: "Passo a passo para sair do SPC/Serasa",
        Icon: ShieldCheck,
        area: "Consumidor",
        free: true
      },
      {
        href: "/ferramentas/checklist-pensao-alimenticia",
        label: "Checklist: Pensão Alimentícia",
        desc: "Documentos para pedir pensão",
        Icon: ClipboardCheck,
        area: "Família",
        free: true
      },
      {
        href: "/ferramentas/checklist-documentos-guarda",
        label: "Checklist: Guarda de Filhos",
        desc: "Preparação para ação de guarda",
        Icon: Users,
        area: "Família",
        free: true
      },
      {
        href: "/ferramentas/triagem-mandado-seguranca",
        label: "Triagem: Mandado de Segurança",
        desc: "Descubra se cabe MS no seu caso",
        Icon: Scale,
        area: "Administrativo",
        free: true
      }
    ]
  },
  {
    title: "Para advogados",
    blurb:
      "Apareça para quem procura na sua cidade e use as mesmas ferramentas no seu dia a dia.",
    tools: [
      {
        href: "/criar-perfil",
        label: "Montar meu perfil",
        desc: "Em um minuto, monte sua ficha e veja o que falta para o cliente te chamar.",
        Icon: UserPlus
      },
      {
        href: "/revisor-peticao",
        label: "Revisor de petições com IA",
        desc: "Revise ou humanize o texto da sua peça com IA. Recurso do plano premium.",
        Icon: Sparkles
      },
      {
        href: "/advogados",
        label: "Encontrar um advogado",
        desc: "Diretório por cidade e área de atuação, com contato direto.",
        Icon: Search
      }
    ]
  }
];

const GOLD = "#C8A24A";

// Selos por ferramenta (sem mexer nos dados): IA / Premium nos destaques.
// Obs.: o /recurso-de-multa do grid é o gerador GRÁTIS por modelo (sem IA) —
// a versão com IA é o produto pago em destaque no topo (multas.advaqui.com).
function badgeFor(href: string): { text: string; ia?: boolean } | null {
  if (href === "/recurso-de-multa") return { text: "Grátis", ia: false };
  if (href === "/revisor-peticao") return { text: "Premium · IA", ia: true };
  return null;
}

export default function FerramentasPage() {
  return (
    <main className="container-tight py-12 md:py-16">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-brand-ink/60">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-brand-ink transition">Home</Link>
          </li>
          <li><ChevronRight className="w-3.5 h-3.5 inline" aria-hidden /></li>
          <li className="text-brand-ink font-medium" aria-current="page">Ferramentas</li>
        </ol>
      </nav>

      <header className="max-w-2xl mb-12">
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: GOLD }}>
          Ferramentas
        </p>
        <h1 className="font-display text-3xl md:text-5xl font-semibold text-brand-ink tracking-tight text-balance leading-[1.08]">
          Mais que um diretório: as ferramentas do seu caso, num lugar só
        </h1>
        <p className="text-brand-ink/70 mt-4 text-base md:text-lg leading-relaxed">
          Calcular um prazo, atualizar uma dívida, montar o rascunho de uma
          peça, entender o passo a passo do seu problema. A maioria das
          ferramentas é gratuita, sem cadastro e funciona direto no navegador.
        </p>
      </header>

      {/* DESTAQUE — recurso de multa com IA (produto pago, avulso ou Premium) */}
      <section
        className="rounded-3xl text-white p-7 md:p-9 mb-14 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#0F1B2D 0%,#16263F 60%,#1B2D49 100%)" }}
      >
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            top: -90,
            right: -40,
            width: 340,
            height: 280,
            background: "radial-gradient(ellipse at center, rgba(200,162,74,0.18), transparent 70%)"
          }}
        />
        <div className="relative grid lg:grid-cols-[1fr_auto] gap-7 items-center">
          <div>
            <span
              className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-4"
              style={{ background: "rgba(200,162,74,0.16)", color: "#E3C078", border: "1px solid rgba(200,162,74,0.35)" }}
            >
              <Sparkles className="w-3.5 h-3.5" aria-hidden /> Recurso com Inteligência Artificial
            </span>
            <h2 className="font-display text-2xl md:text-[32px] font-semibold tracking-tight leading-[1.1] mb-3">
              Recorra da sua multa de trânsito com ajuda de IA
            </h2>
            <p className="text-[15px] md:text-base leading-relaxed max-w-[640px]" style={{ color: "#C4CDDC" }}>
              A IA monta o seu recurso (defesa prévia, JARI ou CETRAN) fundamentado no
              Código de Trânsito Brasileiro, a partir dos dados da sua multa — pronto para
              revisar e protocolar. Pague só pela peça (avulso) ou tenha acesso pelo
              plano Premium.
            </p>
            <div className="flex flex-wrap gap-4 mt-5 text-[13px]" style={{ color: "#9FB0C6" }}>
              <span className="inline-flex items-center gap-1.5">
                <Car className="w-4 h-4" style={{ color: "#E3C078" }} aria-hidden /> Até 3 recursos por R$ 9,90
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" style={{ color: "#E3C078" }} aria-hidden /> Texto gerado por IA, fundamentado no CTB
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:w-[260px] shrink-0">
            <a
              href="https://multas.advaqui.com"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center gap-2 text-[15px] font-bold px-6 py-3.5 rounded-xl transition hover:brightness-105"
              style={{ background: "#C8A24A", color: "#0F1B2D" }}
            >
              Gerar meu recurso — R$ 9,90
              <ArrowRight className="w-4 h-4" aria-hidden />
            </a>
            <Link
              href="/planos"
              className="inline-flex items-center justify-center gap-2 text-[15px] font-semibold px-6 py-3.5 rounded-xl text-white border border-white/25 hover:bg-white/10 transition"
            >
              Ver plano Premium
            </Link>
            <Link
              href="/recurso-de-multa"
              className="text-[12.5px] text-center underline underline-offset-2 hover:text-white transition"
              style={{ color: "#9FB0C6" }}
            >
              Prefere o modelo grátis (sem IA)? Use o gerador
            </Link>
          </div>
        </div>
      </section>

      <div className="space-y-14">
        {GROUPS.map((group) => (
          <section key={group.title}>
            <div className="flex items-center gap-3 mb-5">
              <div>
                <h2 className="font-display text-2xl font-semibold text-brand-ink tracking-tight">
                  {group.title}
                </h2>
                <p className="text-sm text-brand-ink/65 mt-1">{group.blurb}</p>
              </div>
              <span className="hidden md:block h-px flex-1 mt-2" style={{ background: "#EFEDE5" }} />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.tools.map((t) => {
                const badge = badgeFor(t.href);
                const areaColor = t.area ? AREA_COLORS[t.area] : null;
                return (
                  <Link
                    key={t.href}
                    href={t.href}
                    className="card group relative flex flex-col transition hover:-translate-y-0.5 hover:shadow-cardHover"
                    style={{ borderColor: "#E6E1D6" }}
                  >
                    {/* Top-right badges: Free + Premium/IA */}
                    <div className="absolute top-4 right-4 flex items-center gap-1.5">
                      {t.free && (
                        <span
                          className="inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: "rgba(22,163,74,0.10)", color: "#15803D", border: "1px solid rgba(22,163,74,0.25)" }}
                        >
                          Grátis
                        </span>
                      )}
                      {badge && !t.free && (
                        <span
                          className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: "rgba(200,162,74,0.14)", color: "#A0843A", border: "1px solid rgba(200,162,74,0.3)" }}
                        >
                          {badge.ia && <Sparkles className="w-3 h-3" aria-hidden />}
                          {badge.text}
                        </span>
                      )}
                    </div>

                    <span
                      className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: "rgba(200,162,74,0.12)" }}
                    >
                      <t.Icon className="w-5 h-5" style={{ color: GOLD }} aria-hidden />
                    </span>
                    <span className="font-display font-semibold text-brand-ink">
                      {t.label}
                    </span>
                    <span className="text-sm text-brand-ink/70 mt-1 leading-relaxed flex-1">
                      {t.desc}
                    </span>

                    {/* Area badge */}
                    {t.area && areaColor && (
                      <span
                        className="inline-flex items-center self-start text-[11px] font-semibold px-2 py-0.5 rounded-full mt-2"
                        style={{ background: areaColor.bg, color: areaColor.text }}
                      >
                        {t.area}
                      </span>
                    )}

                    <span
                      className="text-sm font-semibold inline-flex items-center gap-1 mt-3"
                      style={{ color: "#A0843A" }}
                    >
                      {t.free ? "Usar ferramenta" : "Abrir"}
                      <ArrowRight
                        className="w-4 h-4 group-hover:translate-x-0.5 transition"
                        aria-hidden
                      />
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* CTA para advogados */}
      <section
        className="mt-16 rounded-2xl border p-8 md:p-10 text-center"
        style={{ borderColor: "#E6E1D6", background: "rgba(200,162,74,0.04)" }}
      >
        <h2 className="font-display text-xl md:text-2xl font-semibold text-brand-ink tracking-tight">
          É advogado? Cadastre-se e apareça para clientes que usam essas ferramentas
        </h2>
        <p className="text-brand-ink/70 mt-2 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          Quem usa uma checklist ou triagem está a um passo de contratar. Monte seu perfil e receba contatos diretos.
        </p>
        <Link
          href="/para-advogados"
          className="inline-flex items-center gap-2 mt-5 px-6 py-3 rounded-xl text-[15px] font-bold transition hover:brightness-105"
          style={{ background: "#C8A24A", color: "#0F1B2D" }}
        >
          Criar meu perfil grátis
          <ArrowRight className="w-4 h-4" aria-hidden />
        </Link>
      </section>

      <p className="text-xs text-brand-ink/50 mt-12 max-w-2xl">
        As ferramentas do AdvAqui são de apoio e têm caráter informativo. Para
        decisões sobre o seu caso, fale com um advogado — cada situação tem
        detalhes que mudam o resultado.
      </p>

      {/* Breadcrumb */}
      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Ferramentas", url: "/ferramentas" }
        ])}
      />

      {/* ItemList — ferramentas de checklist/triagem */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Ferramentas Jurídicas Gratuitas",
          description: "Checklists, simuladores e triagens jurídicas gratuitas. Organize seus documentos e descubra seus direitos.",
          numberOfItems: 5,
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Checklist: Recurso de Multa",
              url: `${SITE.url}/ferramentas/checklist-recurso-multa`,
              description: "Verifique se tem tudo para recorrer"
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Checklist: Limpar Nome",
              url: `${SITE.url}/ferramentas/checklist-limpar-nome`,
              description: "Passo a passo para sair do SPC/Serasa"
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "Checklist: Pensão Alimentícia",
              url: `${SITE.url}/ferramentas/checklist-pensao-alimenticia`,
              description: "Documentos para pedir pensão"
            },
            {
              "@type": "ListItem",
              position: 4,
              name: "Checklist: Guarda de Filhos",
              url: `${SITE.url}/ferramentas/checklist-documentos-guarda`,
              description: "Preparação para ação de guarda"
            },
            {
              "@type": "ListItem",
              position: 5,
              name: "Triagem: Mandado de Segurança",
              url: `${SITE.url}/ferramentas/triagem-mandado-seguranca`,
              description: "Descubra se cabe MS no seu caso"
            }
          ]
        }}
      />
    </main>
  );
}
