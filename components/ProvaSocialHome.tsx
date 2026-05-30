import {
  MapPin,
  HelpCircle,
  FileText,
  ShieldCheck,
  Scale,
  BookOpen,
  Calculator,
  Compass
} from "lucide-react";

/**
 * Seção "O que você encontra aqui" — apresenta os TIPOS de conteúdo do site
 * (diretório por cidade, problemas, guias, calculadoras, modelos, glossário)
 * de forma qualitativa, SEM exibir contagens numéricas.
 *
 * Decisão de produto: números pequenos ("8 calculadoras", "10 guias") passam
 * impressão de pouco conteúdo e prejudicam a credibilidade. Mostramos o valor
 * pela variedade, não pela quantidade.
 */
export function ProvaSocialHome() {
  const features: Array<{ title: string; desc: string; Icon: typeof MapPin }> = [
    {
      title: "Diretório por cidade",
      desc: "Advogados organizados por município e por área de atuação.",
      Icon: MapPin
    },
    {
      title: "Problemas resolvidos passo a passo",
      desc: "Situações do dia a dia explicadas em linguagem clara, sem juridiquês.",
      Icon: HelpCircle
    },
    {
      title: "Guias por área do direito",
      desc: "O que fazer, prazos, documentos e os direitos de cada área.",
      Icon: Compass
    },
    {
      title: "Calculadoras explicadas",
      desc: "Rescisão, FGTS, pensão e mais — com a fórmula explicada e exemplo.",
      Icon: Calculator
    },
    {
      title: "Modelos de documentos grátis",
      desc: "Procurações, contratos, recibos e notificações prontos para preencher.",
      Icon: FileText
    },
    {
      title: "Glossário em linguagem simples",
      desc: "Termos jurídicos traduzidos para o português do dia a dia.",
      Icon: BookOpen
    }
  ];

  return (
    <section className="container-tight py-12 md:py-16">
      <header className="text-center max-w-2xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-deep/10 text-brand-deep">
          <ShieldCheck className="w-3.5 h-3.5" aria-hidden />
          Conteúdo curado
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-ink mt-3 leading-tight">
          O que você encontra aqui
        </h2>
        <p className="text-brand-ink/65 mt-3 text-base md:text-lg">
          Não é um marketplace de leads. É um diretório de advogados com biblioteca
          jurídica curada, organizada por cidade, por área e por problema concreto.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border-2 border-brand-line bg-white p-5 hover:border-brand-accent/40 transition"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-accent/15 flex items-center justify-center flex-shrink-0">
                <f.Icon className="w-5 h-5 text-brand-accent2" aria-hidden />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-base md:text-lg font-bold text-brand-ink leading-snug">
                  {f.title}
                </p>
                <p className="text-xs md:text-sm text-brand-ink/65 mt-1 leading-snug">
                  {f.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Garantias / autoridade institucional */}
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
        <GarantiaCard
          Icon={Scale}
          title="Fontes oficiais"
          text="Jurisprudência direto do STF e STJ via API oficial. Nada inventado."
        />
        <GarantiaCard
          Icon={ShieldCheck}
          title="OAB respeitada"
          text="Sem captação de clientela, sem promessas. Aderente ao Provimento 205/2021."
        />
        <GarantiaCard
          Icon={MapPin}
          title="Cobertura nacional"
          text="Uma página própria para cada cidade brasileira. De São Paulo a Almenara."
        />
        <GarantiaCard
          Icon={FileText}
          title="Conteúdo curado por área"
          text="Cada problema é revisado e organizado por área do direito. Sem auto-gerado."
        />
      </div>
    </section>
  );
}

function GarantiaCard({
  Icon,
  title,
  text
}: {
  Icon: typeof MapPin;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-brand-line bg-brand-bg/40 p-4">
      <div className="flex items-start gap-2 mb-1">
        <Icon className="w-4 h-4 text-brand-accent2 flex-shrink-0 mt-0.5" aria-hidden />
        <p className="font-display font-bold text-sm text-brand-ink leading-tight">
          {title}
        </p>
      </div>
      <p className="text-xs text-brand-ink/65 leading-relaxed">{text}</p>
    </div>
  );
}
