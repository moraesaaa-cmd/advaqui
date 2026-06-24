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
  ArrowRight
} from "lucide-react";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Ferramentas jurídicas gratuitas",
  description:
    "Calculadoras, contagem de prazos processuais, modelos de petições e documentos, glossário e jurisprudência — as ferramentas do AdvAqui reunidas num lugar só. Grátis e sem cadastro.",
  path: "/ferramentas"
});

type Tool = {
  href: string;
  label: string;
  desc: string;
  Icon: typeof Calculator;
};

type Group = {
  title: string;
  blurb: string;
  tools: Tool[];
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

export default function FerramentasPage() {
  return (
    <main className="container-tight py-12 md:py-16">
      <header className="max-w-2xl mb-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-deep">
          Ferramentas
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink mt-2 text-balance">
          Mais que um diretório: as ferramentas do seu caso, num lugar só
        </h1>
        <p className="text-brand-ink/70 mt-3 text-base md:text-lg leading-relaxed">
          Calcular um prazo, atualizar uma dívida, montar o rascunho de uma
          peça, entender o passo a passo do seu problema. Tudo gratuito, sem
          cadastro e funcionando no seu próprio navegador.
        </p>
      </header>

      <div className="space-y-12">
        {GROUPS.map((group) => (
          <section key={group.title}>
            <div className="mb-4">
              <h2 className="font-display text-2xl font-bold text-brand-ink">
                {group.title}
              </h2>
              <p className="text-sm text-brand-ink/65 mt-1">{group.blurb}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.tools.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="card group hover:border-brand-deep hover:shadow-cardHover flex flex-col"
                >
                  <span className="w-11 h-11 rounded-xl bg-brand-deep/10 flex items-center justify-center mb-3">
                    <t.Icon className="w-5 h-5 text-brand-deep" aria-hidden />
                  </span>
                  <span className="font-display font-bold text-brand-ink">
                    {t.label}
                  </span>
                  <span className="text-sm text-brand-ink/70 mt-1 leading-relaxed flex-1">
                    {t.desc}
                  </span>
                  <span className="text-sm font-medium text-brand-deep inline-flex items-center gap-1 mt-3">
                    Abrir
                    <ArrowRight
                      className="w-4 h-4 group-hover:translate-x-0.5 transition"
                      aria-hidden
                    />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="text-xs text-brand-ink/50 mt-12 max-w-2xl">
        As ferramentas do AdvAqui são de apoio e têm caráter informativo. Para
        decisões sobre o seu caso, fale com um advogado — cada situação tem
        detalhes que mudam o resultado.
      </p>
    </main>
  );
}
