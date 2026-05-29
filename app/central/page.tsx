import Link from "next/link";
import {
  Users,
  Scale,
  HelpCircle,
  Compass,
  BookOpen,
  Gavel,
  Calculator,
  DollarSign,
  FileText,
  Building2,
  Newspaper,
  Megaphone,
  CheckSquare,
  ChevronRight,
  type LucideIcon
} from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const metadata = buildMetadata({
  title: "Central — tudo o que você encontra no AdvAqui",
  description:
    "Mapa do AdvAqui organizado por objetivo: encontrar advogado, entender seu problema, consultar decisões e leis, usar ferramentas gratuitas e ler conteúdo. Comece aqui.",
  path: "/central"
});

type Item = { href: string; label: string; desc: string; Icon: LucideIcon };
type Section = { title: string; intro: string; items: Item[] };

const SECTIONS: Section[] = [
  {
    title: "Encontrar um advogado",
    intro: "Procure por cidade ou por área de atuação e fale direto com o profissional.",
    items: [
      { href: "/advogados", label: "Diretório por cidade", desc: "Navegue por estado e cidade. Cobertura das 5.571 cidades do Brasil.", Icon: Users },
      { href: "/advogados-de", label: "Áreas de atuação", desc: "Trabalhista, família, consumidor, criminal e mais — entenda cada uma.", Icon: Scale }
    ]
  },
  {
    title: "Entender o meu problema",
    intro: "Conteúdo em linguagem clara: o que fazer, passo a passo, sem juridiquês.",
    items: [
      { href: "/problemas-juridicos", label: "Problemas jurídicos", desc: "Situações concretas com passo a passo: golpe do Pix, nome negativado, demissão e mais.", Icon: HelpCircle },
      { href: "/guias", label: "Guias por área", desc: "Visão geral de cada área do direito, do começo ao fim.", Icon: Compass },
      { href: "/glossario", label: "Glossário jurídico", desc: "Termos do direito explicados de forma simples.", Icon: BookOpen }
    ]
  },
  {
    title: "Decisões e leis",
    intro: "Jurisprudência real de fontes oficiais (STF e STJ), por tema.",
    items: [
      { href: "/jurisprudencia", label: "Jurisprudência", desc: "Busca de decisões e hubs temáticos.", Icon: Gavel },
      { href: "/jurisprudencia/stf", label: "STF", desc: "Decisões do Supremo Tribunal Federal.", Icon: Gavel },
      { href: "/jurisprudencia/stj", label: "STJ", desc: "Decisões do Superior Tribunal de Justiça.", Icon: Gavel }
    ]
  },
  {
    title: "Ferramentas gratuitas",
    intro: "Calcule, estime custos, gere documentos e localize o fórum — sem cadastro.",
    items: [
      { href: "/calculadoras", label: "Calculadoras", desc: "Rescisão, FGTS, pensão, aposentadoria — fórmula explicada com exemplo.", Icon: Calculator },
      { href: "/quanto-custa", label: "Quanto custa", desc: "Faixas de honorário por serviço, o que inclui e quando é gratuito.", Icon: DollarSign },
      { href: "/modelos", label: "Modelos de documentos", desc: "Procurações, contratos, notificações e declarações prontos.", Icon: FileText },
      { href: "/tribunais", label: "Tribunais por cidade", desc: "Onde fica o fórum e a vara competente na sua cidade.", Icon: Building2 }
    ]
  },
  {
    title: "Conteúdo e crescimento",
    intro: "Artigos para o cidadão e materiais para advogados crescerem online.",
    items: [
      { href: "/blog", label: "Blog jurídico", desc: "Artigos sobre direitos do dia a dia.", Icon: Newspaper },
      { href: "/marketing-juridico", label: "Marketing para advogados", desc: "Como advogados podem ganhar presença digital de forma ética.", Icon: Megaphone },
      { href: "/checklist", label: "Checklist de presença digital", desc: "Passo a passo para o advogado organizar sua presença online.", Icon: CheckSquare }
    ]
  }
];

export default function CentralPage() {
  return (
    <div className="container-tight py-10">
      <Breadcrumb items={[{ label: "Central" }]} />

      <header className="max-w-2xl mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
          Por onde começar
        </h1>
        <p className="text-base md:text-lg text-brand-ink/75 mt-3 leading-relaxed">
          Tudo no AdvAqui organizado pelo que você quer fazer. Escolha um caminho
          abaixo — é direto, sem rodeios.
        </p>
      </header>

      <div className="space-y-10">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="font-display text-xl md:text-2xl font-bold text-brand-deep">
              {section.title}
            </h2>
            <p className="text-sm text-brand-ink/65 mt-1 mb-4">{section.intro}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-start gap-3 rounded-2xl border-2 border-brand-line bg-white p-4 hover:border-brand-accent hover:shadow-card transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-accent/15 flex items-center justify-center flex-shrink-0">
                    <item.Icon className="w-5 h-5 text-brand-accent2" aria-hidden />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-base font-bold text-brand-ink group-hover:text-brand-deep transition">
                      {item.label}
                    </p>
                    <p className="text-sm text-brand-ink/65 mt-0.5 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                  <ChevronRight
                    className="w-5 h-5 text-brand-ink/30 group-hover:text-brand-accent transition flex-shrink-0 mt-1"
                    aria-hidden
                  />
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Central", url: "/central" }
        ])}
      />
    </div>
  );
}
