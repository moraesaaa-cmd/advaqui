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
  Combine,
  FileArchive,
  ScanText,
  FileType,
  Languages,
  FileOutput
} from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE, PLAN } from "@/lib/config";
import { PDF_TOOLS } from "@/lib/tools/pdf/registry";
import { ToolsQuickFind, type QuickFindItem } from "@/components/tools/ToolsQuickFind";

export const metadata = buildMetadata({
  title: "Ferramentas jurídicas gratuitas — calculadoras, modelos e PDF",
  description:
    "Ferramentas jurídicas gratuitas: calculadoras, modelos de documentos, recurso de multa, ferramentas PDF e guias passo a passo. Ache a sua em segundos.",
  path: "/ferramentas"
});

type Tool = {
  href: string;
  label: string;
  desc: string;
  Icon: typeof Calculator;
  area?: string;
};

type Group = {
  id: string;
  title: string;
  chip: string;
  blurb: string;
  tools: Tool[];
};

const AREA_COLORS: Record<string, { bg: string; text: string }> = {
  "Trânsito": { bg: "rgba(234,88,12,0.10)", text: "#C2410C" },
  "Consumidor": { bg: "rgba(37,99,235,0.10)", text: "#1D4ED8" },
  "Família": { bg: "rgba(147,51,234,0.10)", text: "#7C3AED" },
  "Administrativo": { bg: "rgba(22,163,74,0.10)", text: "#15803D" }
};

const GROUPS: Group[] = [
  {
    id: "calcular",
    title: "Calcular e contar prazos",
    chip: "Calcular",
    blurb:
      "Os cálculos que mais aparecem no dia a dia — com a fórmula explicada, não só o número.",
    tools: [
      {
        href: "/calculadoras",
        label: "Calculadoras jurídicas",
        desc: "Rescisão, FGTS, pensão, férias, 13º, aluguel, dívida, inventário e mais.",
        Icon: Calculator
      },
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
        href: "/seguro-desemprego",
        label: "Simulador de seguro-desemprego",
        desc: "Quantas parcelas e qual o valor pela tabela oficial do MTE de 2026.",
        Icon: Wallet
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
    id: "documentos",
    title: "Escrever e gerar documentos",
    chip: "Documentos",
    blurb:
      "Modelos prontos e rascunhos organizados — com os campos certos e a estrutura na ordem.",
    tools: [
      {
        href: "/modelos",
        label: "Modelos prontos para baixar",
        desc: "Procuração, contrato de locação, recibo, distrato e outros — é só preencher.",
        Icon: FileText
      },
      {
        href: "/recurso-de-multa",
        label: "Recurso de multa de trânsito",
        desc: "Monte o recurso (defesa prévia, JARI ou CETRAN) com a fundamentação do CTB.",
        Icon: Car
      },
      {
        href: "/montar-peticao",
        label: "Montar petição",
        desc: "Reclamação trabalhista, alimentos, consumo, cobrança e mais. Prévia grátis; texto completo no Premium.",
        Icon: FileSignature
      }
    ]
  },
  {
    id: "pdf",
    title: "Ferramentas PDF",
    chip: "PDF",
    blurb:
      "Juntar, comprimir, converter, proteger — 25 ferramentas de PDF grátis, prontas para o PJe e o dia a dia.",
    tools: [
      {
        href: "/ferramentas/pdf/juntar-pdf",
        label: "Juntar PDF",
        desc: "Una vários PDFs em um único documento, na ordem que você escolher.",
        Icon: Combine
      },
      {
        href: "/ferramentas/pdf/comprimir-pdf",
        label: "Comprimir PDF",
        desc: "Reduza o tamanho para caber no limite do PJe, do e-mail e do WhatsApp.",
        Icon: FileArchive
      },
      {
        href: "/ferramentas/pdf/pdf-para-word",
        label: "PDF para Word",
        desc: "Transforme PDF em DOCX editável, sem redigitar nada.",
        Icon: FileType
      },
      {
        href: "/ferramentas/pdf/pdf-para-pdfa",
        label: "PDF para PDF/A (padrão PJe)",
        desc: "Gere o formato de arquivamento exigido pelos tribunais.",
        Icon: Landmark
      },
      {
        href: "/ferramentas/pdf/pdf-pesquisavel",
        label: "PDF pesquisável (OCR)",
        desc: "Documento escaneado passa a permitir busca, seleção e cópia.",
        Icon: ScanText
      },
      {
        href: "/ferramentas/pdf/traduzir-pdf",
        label: "Traduzir PDF",
        desc: "Traduza documentos entre português, inglês e espanhol.",
        Icon: Languages
      }
    ]
  },
  {
    id: "entender",
    title: "Entender o seu caso",
    chip: "Meu caso",
    blurb: "Antes de gastar com consulta, entenda o seu problema e o caminho dele.",
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
        href: "/problemas-juridicos",
        label: "Problemas jurídicos passo a passo",
        desc: "Demissão, negativação, pensão, INSS, plano de saúde — o que fazer, em ordem.",
        Icon: HelpCircle
      },
      {
        href: "/previdencia",
        label: "Aposentadoria: regras e simulador",
        desc: "As regras de transição explicadas + cálculo da sua pontuação (idade + tempo).",
        Icon: PiggyBank
      },
      {
        href: "/divorcio",
        label: "Divórcio: cartório ou Justiça?",
        desc: "4 perguntas dizem se o seu divórcio pode ser em cartório ou precisa da Justiça.",
        Icon: Scale
      },
      {
        href: "/imobiliario",
        label: "Comprar imóvel com segurança",
        desc: "Checklist de documentos e certidões — vê os pontos críticos antes de assinar.",
        Icon: Home
      },
      {
        href: "/linha-do-tempo",
        label: "Linha do tempo de um processo",
        desc: "Quanto tempo demora? Veja as etapas de um processo, da inicial ao pagamento.",
        Icon: Route
      }
    ]
  },
  {
    id: "checklists",
    title: "Checklists por situação",
    chip: "Checklists",
    blurb:
      "Verifique seus direitos em minutos. Marque os itens, veja o resultado e, se quiser, fale com um advogado.",
    tools: [
      {
        href: "/ferramentas/checklist-recurso-multa",
        label: "Checklist: Recurso de Multa",
        desc: "Verifique se tem tudo para recorrer.",
        Icon: Car,
        area: "Trânsito"
      },
      {
        href: "/ferramentas/checklist-limpar-nome",
        label: "Checklist: Limpar Nome",
        desc: "Passo a passo para sair do SPC/Serasa.",
        Icon: ShieldCheck,
        area: "Consumidor"
      },
      {
        href: "/ferramentas/checklist-pensao-alimenticia",
        label: "Checklist: Pensão Alimentícia",
        desc: "Documentos para pedir pensão.",
        Icon: ClipboardCheck,
        area: "Família"
      },
      {
        href: "/ferramentas/checklist-documentos-guarda",
        label: "Checklist: Guarda de Filhos",
        desc: "Preparação para ação de guarda.",
        Icon: Users,
        area: "Família"
      },
      {
        href: "/ferramentas/triagem-mandado-seguranca",
        label: "Triagem: Mandado de Segurança",
        desc: "Descubra se cabe MS no seu caso.",
        Icon: Scale,
        area: "Administrativo"
      }
    ]
  },
  {
    id: "pesquisar",
    title: "Pesquisar e consultar",
    chip: "Consultar",
    blurb: "Processos, tribunais, jurisprudência e os termos do direito em linguagem clara.",
    tools: [
      {
        href: "/processos",
        label: "Consulta de processos",
        desc: "Acompanhe o andamento pelo número (CNJ), direto da base pública do DataJud.",
        Icon: Radar
      },
      {
        href: "/quanto-custa",
        label: "Quanto custa um advogado",
        desc: "Faixas de honorários por tipo de causa, em valores reais.",
        Icon: Coins
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
    id: "advogados",
    title: "Para advogados",
    chip: "Advogados",
    blurb:
      "Apareça para quem procura na sua cidade e use as ferramentas profissionais no seu dia a dia.",
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
      }
    ]
  }
];

const NAVY = "#0F1B2D";
const GOLD = "#C8A24A";
const GOLD_LIGHT = "#E3C078";
const GOLD_TEXT = "#8A6E2B";

// Modelo de acesso dos selos:
//  - "Grátis"            → aberto, sem conta (calculadoras, guias, checklists)
//  - "Grátis com conta"  → a página é aberta; usar/baixar pede conta gratuita
//                          (processos, triagem, modelos, recurso de multa, PDF)
//  - "Prévia grátis"     → prévia aberta; versão completa no Premium
//  - "Premium"           → exclusivo de advogado Premium
const CONTA_TOOLS = new Set(["/processos", "/triagem", "/modelos", "/recurso-de-multa"]);

type BadgeKind = "conta" | "premium" | "gratis" | "previa";

function badgeFor(href: string): BadgeKind {
  if (href === "/revisor-peticao") return "premium";
  if (href === "/montar-peticao") return "previa";
  if (CONTA_TOOLS.has(href) || href.startsWith("/ferramentas/pdf/")) return "conta";
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
  previa: {
    text: "Prévia grátis",
    style: {
      background: "rgba(15,27,45,0.06)",
      color: NAVY,
      border: "1px solid rgba(15,27,45,0.25)"
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

// Itens da busca rápida: tudo que está no grid + as 25 ferramentas PDF.
const QUICK_FIND_ITEMS: QuickFindItem[] = [
  ...GROUPS.flatMap((g) =>
    g.tools.map((t) => ({ href: t.href, label: t.label, desc: t.desc, group: g.title }))
  ),
  ...PDF_TOOLS.filter(
    (t) => !GROUPS.some((g) => g.tools.some((x) => x.href === `/ferramentas/pdf/${t.slug}`))
  ).map((t) => ({
    href: `/ferramentas/pdf/${t.slug}`,
    label: t.nome,
    desc: t.subtitulo,
    group: "Ferramentas PDF"
  }))
];

export default function FerramentasPage() {
  return (
    <section className="container-tight py-12 md:py-16">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-brand-ink/60">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-brand-ink transition">Início</Link>
          </li>
          <li className="flex items-center gap-1.5" aria-current="page">
            <ChevronRight className="w-3.5 h-3.5 text-brand-ink/30" aria-hidden />
            <span className="text-brand-ink font-medium">Ferramentas</span>
          </li>
        </ol>
      </nav>

      <header className="max-w-2xl mb-6">
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: GOLD_TEXT }}>
          Ferramentas
        </p>
        <h1 className="font-display text-3xl md:text-5xl font-semibold text-brand-ink tracking-tight text-balance leading-[1.08]">
          Todas as ferramentas, gratuitas — ache a sua em segundos
        </h1>
        <p className="text-brand-ink/70 mt-4 text-base md:text-lg leading-relaxed">
          Calculadoras, modelos de documentos, recurso de multa, ferramentas de PDF e
          guias passo a passo. Para baixar resultados e consultar processos, basta uma
          conta gratuita — 1 minuto, sem cartão.
        </p>
      </header>

      {/* Busca rápida */}
      <div className="mb-5">
        <ToolsQuickFind items={QUICK_FIND_ITEMS} />
      </div>

      {/* Navegação por categoria (âncoras) — lista para leitores de tela
          anunciarem os itens separadamente (evita chips "colados" no texto). */}
      <nav aria-label="Categorias de ferramentas" className="mb-12">
        <ul className="flex flex-wrap gap-2">
          {GROUPS.map((g) => (
            <li key={g.id}>
              <a
                href={`#${g.id}`}
                className="inline-block rounded-full border border-brand-line bg-white px-4 py-1.5 text-sm font-medium text-brand-ink/80 transition hover:border-brand-accent hover:text-brand-ink"
              >
                {g.chip}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-14">
        {GROUPS.map((group) => (
          <section key={group.id} id={group.id} className="scroll-mt-24">
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

              {/* Card "ver todas" do grupo PDF */}
              {group.id === "pdf" && (
                <Link
                  href="/ferramentas/pdf"
                  className="group relative flex flex-col justify-center rounded-2xl p-5 text-white transition hover:-translate-y-0.5 hover:shadow-cardHover"
                  style={{ background: NAVY }}
                >
                  <span className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 bg-white/10">
                    <FileOutput className="w-5 h-5" style={{ color: GOLD_LIGHT }} aria-hidden />
                  </span>
                  <span className="font-display font-semibold">
                    Ver as {PDF_TOOLS.length} ferramentas PDF
                  </span>
                  <span className="text-sm mt-1 leading-relaxed" style={{ color: "#C4CDDC" }}>
                    Dividir, rodar, numerar, marca d&apos;água, proteger, resumir,
                    comparar e muito mais.
                  </span>
                  <span
                    className="text-sm font-bold inline-flex items-center gap-1 mt-3"
                    style={{ color: GOLD_LIGHT }}
                  >
                    Abrir a central de PDF
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" aria-hidden />
                  </span>
                </Link>
              )}
            </div>

            {/* Banner do recurso completo — logo após "Escrever e gerar documentos",
                onde faz sentido para quem veio resolver multa. Modelo grátis primeiro. */}
            {group.id === "documentos" && (
              <div
                className="mt-8 rounded-3xl text-white p-7 md:p-8 relative overflow-hidden"
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
                    background:
                      "none"
                  }}
                />
                <div className="relative grid lg:grid-cols-[1fr_auto] gap-6 items-center">
                  <div>
                    <span
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-3"
                      style={{
                        background: "rgba(200,162,74,0.18)",
                        color: GOLD_LIGHT,
                        border: "1px solid rgba(200,162,74,0.45)"
                      }}
                    >
                      <Car className="w-3.5 h-3.5" aria-hidden /> Multa de trânsito
                    </span>
                    <h3 className="font-display text-xl md:text-2xl font-semibold tracking-tight leading-tight mb-2">
                      Monte grátis o seu recurso — ou receba a peça completa, pronta para protocolar
                    </h3>
                    <p className="text-[15px] leading-relaxed max-w-[640px]" style={{ color: "#C4CDDC" }}>
                      O modelo grátis você preenche e adapta. Se preferir, o recurso completo
                      sai elaborado sob medida para o seu caso (defesa prévia, JARI ou CETRAN),
                      fundamentado no CTB, por um pagamento único de R$ 9,90 — vale para até 3
                      recursos.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 lg:w-[280px] shrink-0">
                    <Link
                      href="/recurso-de-multa"
                      className="inline-flex items-center justify-center gap-2 text-[15px] font-bold px-6 py-3.5 rounded-xl transition hover:brightness-110 shadow-lg shadow-black/25"
                      style={{ background: GOLD, color: NAVY }}
                    >
                      Montar recurso grátis
                      <ArrowRight className="w-4 h-4" aria-hidden />
                    </Link>
                    <a
                      href="https://multas.advaqui.com"
                      target="_blank"
                      rel="noopener"
                      className="inline-flex items-center justify-center gap-2 text-[15px] font-semibold px-6 py-3.5 rounded-xl text-white border transition hover:bg-white/10"
                      style={{ borderColor: "rgba(227,192,120,0.6)" }}
                    >
                      Recurso completo — R$ 9,90
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Cross-sell: encontre um advogado, após "Entender o seu caso" */}
            {group.id === "entender" && (
              <div
                className="mt-8 rounded-2xl border-2 p-6 md:p-8 flex flex-col md:flex-row items-center gap-5"
                style={{ borderColor: "rgba(200,162,74,0.5)", background: "rgba(200,162,74,0.07)" }}
              >
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: GOLD_TEXT }}>
                    Precisa de um advogado?
                  </p>
                  <p className="text-brand-ink font-display font-semibold text-lg">
                    Entendeu o seu caso? Encontre o advogado certo na sua cidade
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
          </section>
        ))}
      </div>

      {/* Como funciona o acesso — meta-informação, perto do fim */}
      <section className="mt-16 mb-4" aria-labelledby="acesso-title">
        <h2 id="acesso-title" className="font-display text-2xl font-semibold text-brand-ink tracking-tight mb-1">
          Como funciona o acesso
        </h2>
        <p className="text-sm text-brand-ink/65 mb-5">
          Três formas de usar o AdvAqui, cada uma para um público — sem pegadinha, sem fidelidade.
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
              Calculadoras, simuladores e guias são abertos — sem cadastro. A conta
              gratuita (só nome, e-mail e senha) libera os downloads: modelos prontos,
              ferramentas PDF, recurso de multa grátis, consulta de processos e triagem.
              Custa R$ 0 — para sempre.
            </p>
            <Link
              href="/cadastro"
              className="text-sm font-bold inline-flex items-center gap-1 mt-4"
              style={{ color: GOLD_TEXT }}
            >
              Criar conta grátis <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          </div>

          <div className="rounded-2xl p-6 flex flex-col text-white" style={{ background: NAVY }}>
            <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: GOLD_LIGHT }}>
              Para quem levou multa
            </p>
            <div className="flex items-center justify-between mb-3">
              <span className="font-display font-semibold text-lg">Recurso de multa</span>
              <span
                className="inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                style={{
                  background: "rgba(227,192,120,0.18)",
                  color: GOLD_LIGHT,
                  border: "1px solid rgba(227,192,120,0.5)"
                }}
              >
                Pago — R$ 9,90
              </span>
            </div>
            <p className="text-sm leading-relaxed flex-1" style={{ color: "#C4CDDC" }}>
              A peça completa, elaborada sob medida e fundamentada no CTB, pronta para
              protocolar. Pagamento ÚNICO de R$ 9,90 via Pix (não é mensalidade) libera
              até 3 recursos. Advogado com plano Premium não paga — já está incluído.
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
              {PLAN.priceLabel}/mês via Pix, sem fidelidade: perfil no topo da sua cidade,
              selo de destaque, WhatsApp no card, cidades extras, revisor de petições e o
              recurso de multa completo incluído (sem pagar os R$ 9,90).
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

      {/* CTA para advogados */}
      <section
        className="mt-12 rounded-2xl border-2 p-8 md:p-10 text-center"
        style={{ borderColor: "rgba(200,162,74,0.45)", background: "rgba(200,162,74,0.06)" }}
      >
        <h2 className="font-display text-xl md:text-2xl font-semibold text-brand-ink tracking-tight">
          É advogado? Cadastre-se e apareça para clientes que usam essas ferramentas
        </h2>
        <p className="text-brand-ink/70 mt-2 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          Quem usa uma checklist ou triagem está a um passo de contratar. Monte seu perfil
          e receba contatos diretos.
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
        As ferramentas do AdvAqui são de apoio e têm caráter informativo. Para decisões
        sobre o seu caso, fale com um advogado — cada situação tem detalhes que mudam o
        resultado.
      </p>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Ferramentas", url: "/ferramentas" }
        ])}
      />

      {/* ItemList — TODAS as ferramentas do hub (gerado dos grupos) */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Ferramentas jurídicas gratuitas",
          description:
            "Calculadoras, modelos de documentos, recurso de multa, ferramentas PDF, checklists e triagens gratuitas.",
          numberOfItems: GROUPS.reduce((n, g) => n + g.tools.length, 0),
          itemListElement: GROUPS.flatMap((g) => g.tools).map((t, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: t.label,
            url: `${SITE.url}${t.href}`,
            description: t.desc
          }))
        }}
      />
    </section>
  );
}
