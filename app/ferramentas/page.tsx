import Link from "next/link";
import type { CSSProperties } from "react";
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
  ChevronRight,
  CheckCircle2
} from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE, PLAN } from "@/lib/config";

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
        label: "Revisor de petições",
        desc: "Revise ou humanize o texto da sua peça. Exclusivo do plano Premium.",
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

const NAVY = "#0F1B2D";
const GOLD = "#C8A24A";
const GOLD_LIGHT = "#E3C078";
const GOLD_TEXT = "#8A6E2B";

// Ferramentas que ainda exigem conta gratuita (ToolGate). As calculadoras,
// simuladores e checklists determinísticos ficam ABERTOS (grátis, sem login)
// para serem plenamente rastreáveis/indexáveis pelo Google e sem fricção.
// Só /processos (usa API externa DataJud — evita abuso anônimo) e /triagem
// (funil da Marina) seguem exigindo conta.
const GATED_TOOLS = new Set([
  "/processos",
  "/triagem"
]);

type BadgeKind = "conta" | "premium" | "gratis";

// Exatamente UM selo por ferramenta, seguindo o modelo de acesso:
// "Grátis com conta" (interativas com ToolGate), "Premium" (revisor de
// petições, exclusivo de advogado), "Grátis" (conteúdo aberto).
function badgeFor(href: string): BadgeKind {
  if (href === "/revisor-peticao") return "premium";
  if (GATED_TOOLS.has(href)) return "conta";
  return "gratis";
}

const BADGE_STYLES: Record<BadgeKind, { text: string; style: CSSProperties }> = {
  conta: {
    text: "Grátis com conta",
    style: {
      background: "rgba(200,162,74,0.14)",
      color: GOLD_TEXT,
      border: "1px solid rgba(200,162,74,0.45)"
    }
  },
  premium: {
    text: "Premium",
    style: {
      background: GOLD,
      color: NAVY,
      border: "1px solid #B08F3E"
    }
  },
  gratis: {
    text: "Grátis",
    style: {
      background: "rgba(22,163,74,0.10)",
      color: "#15803D",
      border: "1px solid rgba(22,163,74,0.30)"
    }
  }
};

function Badge({ kind }: { kind: BadgeKind }) {
  const b = BADGE_STYLES[kind];
  return (
    <span
      className="inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={b.style}
    >
      {b.text}
    </span>
  );
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
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: GOLD_TEXT }}>
          Ferramentas
        </p>
        <h1 className="font-display text-3xl md:text-5xl font-semibold text-brand-ink tracking-tight text-balance leading-[1.08]">
          Mais que um diretório: as ferramentas do seu caso, num lugar só
        </h1>
        <p className="text-brand-ink/70 mt-4 text-base md:text-lg leading-relaxed">
          Calcular um prazo, atualizar uma dívida, montar o rascunho de uma
          peça, entender o passo a passo do seu problema. As ferramentas são
          gratuitas e abertas — use sem cadastro. Só a consulta de processos e
          a triagem pedem uma conta grátis.
        </p>
      </header>

      {/* DESTAQUE — recurso de multa completo (produto pago, avulso ou Premium) */}
      <section
        className="rounded-3xl text-white p-7 md:p-9 mb-10 relative overflow-hidden"
        style={{ background: NAVY }}
      >
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            top: -90,
            right: -40,
            width: 380,
            height: 300,
            background: "radial-gradient(ellipse at center, rgba(200,162,74,0.25), transparent 70%)"
          }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-1"
          style={{ background: `linear-gradient(90deg, ${GOLD} 0%, ${GOLD_LIGHT} 50%, ${GOLD} 100%)` }}
        />
        <div className="relative grid lg:grid-cols-[1fr_auto] gap-7 items-center">
          <div>
            <span
              className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-4"
              style={{ background: "rgba(200,162,74,0.18)", color: GOLD_LIGHT, border: "1px solid rgba(200,162,74,0.45)" }}
            >
              <Car className="w-3.5 h-3.5" aria-hidden /> Recurso de multa completo
            </span>
            <h2 className="font-display text-2xl md:text-[32px] font-semibold tracking-tight leading-[1.1] mb-3">
              Multa de trânsito? Receba o recurso completo, pronto para protocolar
            </h2>
            <p className="text-[15px] md:text-base leading-relaxed max-w-[640px]" style={{ color: "#C4CDDC" }}>
              Você informa os dados da multa e recebe o recurso elaborado sob
              medida para o seu caso (defesa prévia, JARI ou CETRAN), fundamentado
              no Código de Trânsito Brasileiro — pronto para protocolar.
            </p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 mt-5 text-[13px]" style={{ color: "#C4CDDC" }}>
              <li className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" style={{ color: GOLD_LIGHT }} aria-hidden />
                Pagamento ÚNICO de R$ 9,90 via Pix — sem mensalidade
              </li>
              <li className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" style={{ color: GOLD_LIGHT }} aria-hidden />
                Vale para até 3 recursos
              </li>
              <li className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" style={{ color: GOLD_LIGHT }} aria-hidden />
                Não quer pagar? Use o modelo grátis
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 lg:w-[280px] shrink-0">
            <a
              href="https://multas.advaqui.com"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center gap-2 text-[15px] font-bold px-6 py-3.5 rounded-xl transition hover:brightness-110 shadow-lg shadow-black/25"
              style={{ background: GOLD, color: NAVY }}
            >
              Fazer meu recurso — R$ 9,90
              <ArrowRight className="w-4 h-4" aria-hidden />
            </a>
            <Link
              href="/recurso-de-multa"
              className="inline-flex items-center justify-center gap-2 text-[15px] font-semibold px-6 py-3.5 rounded-xl text-white border transition hover:bg-white/10"
              style={{ borderColor: "rgba(227,192,120,0.6)" }}
            >
              Usar o modelo grátis
            </Link>
            <Link
              href="/planos"
              className="text-[13px] text-center underline underline-offset-2 hover:text-white transition"
              style={{ color: GOLD_LIGHT }}
            >
              Sou advogado — ver o plano Premium
            </Link>
          </div>
        </div>
      </section>

      {/* Como funciona o acesso */}
      <section className="mb-14" aria-labelledby="acesso-title">
        <h2 id="acesso-title" className="font-display text-2xl font-semibold text-brand-ink tracking-tight mb-1">
          Como funciona o acesso
        </h2>
        <p className="text-sm text-brand-ink/65 mb-5">
          Três formas de usar o AdvAqui, cada uma para um público — sem pegadinha,
          sem fidelidade.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div
            className="rounded-2xl border-2 p-6 flex flex-col"
            style={{ borderColor: "rgba(200,162,74,0.45)", background: "#FAF7F0" }}
          >
            <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: GOLD_TEXT }}>
              Para qualquer pessoa
            </p>
            <div className="flex items-center justify-between mb-3">
              <span className="font-display font-semibold text-brand-ink text-lg">Conta grátis</span>
              <Badge kind="conta" />
            </div>
            <p className="text-sm text-brand-ink/75 leading-relaxed flex-1">
              As calculadoras, checklists, simuladores e o montar petição já são
              abertos — não pedem cadastro. A conta grátis libera a consulta de
              processos e a triagem do seu caso. Custa R$ 0 — para sempre.
            </p>
            <Link
              href="/cadastro"
              className="text-sm font-bold inline-flex items-center gap-1 mt-4"
              style={{ color: GOLD_TEXT }}
            >
              Criar conta grátis <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          </div>

          <div
            className="rounded-2xl p-6 flex flex-col text-white"
            style={{ background: NAVY }}
          >
            <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: GOLD_LIGHT }}>
              Para quem levou multa
            </p>
            <div className="flex items-center justify-between mb-3">
              <span className="font-display font-semibold text-lg">Recurso de multa</span>
              <span
                className="inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                style={{ background: "rgba(227,192,120,0.18)", color: GOLD_LIGHT, border: "1px solid rgba(227,192,120,0.5)" }}
              >
                Pago — R$ 9,90
              </span>
            </div>
            <p className="text-sm leading-relaxed flex-1" style={{ color: "#C4CDDC" }}>
              A peça completa, elaborada sob medida e fundamentada no CTB, pronta
              para protocolar. Pagamento ÚNICO de R$ 9,90 via Pix (não é
              mensalidade) libera até 3 recursos. Advogado com plano Premium não
              paga — já está incluído no plano.
            </p>
            <a
              href="https://multas.advaqui.com"
              target="_blank"
              rel="noopener"
              className="text-sm font-bold inline-flex items-center gap-1 mt-4"
              style={{ color: GOLD_LIGHT }}
            >
              Fazer meu recurso <ArrowRight className="w-4 h-4" aria-hidden />
            </a>
          </div>

          <div
            className="rounded-2xl border-2 p-6 flex flex-col"
            style={{ borderColor: GOLD, background: "rgba(200,162,74,0.06)" }}
          >
            <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: GOLD_TEXT }}>
              Só para advogados
            </p>
            <div className="flex items-center justify-between mb-3">
              <span className="font-display font-semibold text-brand-ink text-lg">Plano Premium</span>
              <Badge kind="premium" />
            </div>
            <p className="text-sm text-brand-ink/75 leading-relaxed flex-1">
              {PLAN.priceLabel}/mês via Pix, sem fidelidade: perfil no topo da sua
              cidade, selo de destaque, WhatsApp no card, bio de 500 caracteres,
              cidades extras, revisor de petições e o recurso de multa completo
              incluído (sem pagar os R$ 9,90).
            </p>
            <Link
              href="/planos"
              className="text-sm font-bold inline-flex items-center gap-1 mt-4"
              style={{ color: GOLD_TEXT }}
            >
              Ver o plano Premium <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <div className="space-y-14">
        {GROUPS.map((group, groupIdx) => (
          <section key={group.title}>
            <div className="flex items-center gap-3 mb-5">
              <div>
                <h2 className="font-display text-2xl font-semibold text-brand-ink tracking-tight">
                  {group.title}
                </h2>
                <p className="text-sm text-brand-ink/65 mt-1">{group.blurb}</p>
              </div>
              <span className="hidden md:block h-px flex-1 mt-2" style={{ background: "rgba(200,162,74,0.35)" }} />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.tools.map((t) => {
                const badge = badgeFor(t.href);
                const areaColor = t.area ? AREA_COLORS[t.area] : null;
                return (
                  <Link
                    key={t.href}
                    href={t.href}
                    className="card group relative flex flex-col transition hover:-translate-y-0.5 hover:shadow-cardHover hover:!border-[#C8A24A]"
                    style={{ borderColor: "#E6E1D6" }}
                  >
                    {/* Selo único de acesso */}
                    <div className="absolute top-4 right-4">
                      <Badge kind={badge} />
                    </div>

                    <span
                      className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: NAVY }}
                    >
                      <t.Icon className="w-5 h-5" style={{ color: GOLD_LIGHT }} aria-hidden />
                    </span>
                    <span className="font-display font-semibold text-brand-ink pr-24">
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
                      className="text-sm font-bold inline-flex items-center gap-1 mt-3"
                      style={{ color: GOLD_TEXT }}
                    >
                      Usar ferramenta
                      <ArrowRight
                        className="w-4 h-4 group-hover:translate-x-0.5 transition"
                        aria-hidden
                      />
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Cross-sell: após "Entender e pesquisar" */}
            {groupIdx === 2 && (
              <div
                className="mt-8 rounded-2xl border-2 p-6 md:p-8 flex flex-col md:flex-row items-center gap-5"
                style={{ borderColor: "rgba(200,162,74,0.5)", background: "rgba(200,162,74,0.07)" }}
              >
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: GOLD_TEXT }}>
                    Precisa de um advogado?
                  </p>
                  <p className="text-brand-ink font-display font-semibold text-lg">
                    Usou a ferramenta? Encontre o advogado certo na sua cidade
                  </p>
                  <p className="text-sm text-brand-ink/60 mt-1">
                    Pesquise por área de atuação e cidade — contato direto, sem intermediário.
                  </p>
                </div>
                <Link
                  href="/advogados"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[15px] font-bold transition hover:brightness-110 shadow-md shadow-black/10 shrink-0"
                  style={{ background: GOLD, color: NAVY }}
                >
                  Buscar advogado
                  <ArrowRight className="w-4 h-4" aria-hidden />
                </Link>
              </div>
            )}

            {/* Cross-sell: após "Checklists e triagens" */}
            {groupIdx === 3 && (
              <div
                className="mt-8 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-5"
                style={{ background: NAVY }}
              >
                <div className="flex-1 text-white">
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: GOLD_LIGHT }}>
                    Plano Premium para advogados
                  </p>
                  <p className="font-display font-semibold text-lg">
                    Perfil no topo da cidade + revisor de petições + recurso de multa completo incluído
                  </p>
                  <p className="text-sm mt-1" style={{ color: "#C4CDDC" }}>
                    Tudo por {PLAN.priceLabel}/mês, via Pix e sem fidelidade — ativação em até {PLAN.activationHours}h.
                  </p>
                </div>
                <Link
                  href="/planos"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[15px] font-bold transition hover:brightness-110 shadow-lg shadow-black/25 shrink-0"
                  style={{ background: GOLD, color: NAVY }}
                >
                  Ver planos
                  <ArrowRight className="w-4 h-4" aria-hidden />
                </Link>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* CTA para advogados */}
      <section
        className="mt-16 rounded-2xl border-2 p-8 md:p-10 text-center"
        style={{ borderColor: "rgba(200,162,74,0.45)", background: "rgba(200,162,74,0.06)" }}
      >
        <h2 className="font-display text-xl md:text-2xl font-semibold text-brand-ink tracking-tight">
          É advogado? Cadastre-se e apareça para clientes que usam essas ferramentas
        </h2>
        <p className="text-brand-ink/70 mt-2 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          Quem usa uma checklist ou triagem está a um passo de contratar. Monte seu perfil e receba contatos diretos.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-5">
          <Link
            href="/cadastro"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[15px] font-bold transition hover:brightness-110 shadow-md shadow-black/10"
            style={{ background: GOLD, color: NAVY }}
          >
            Criar meu perfil grátis
            <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
          <Link
            href="/planos"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[15px] font-bold border-2 transition hover:bg-white"
            style={{ borderColor: NAVY, color: NAVY }}
          >
            Ver plano Premium
          </Link>
        </div>
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
