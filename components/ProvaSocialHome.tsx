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
import { CITIES } from "@/lib/data/cities";
import { PROBLEMAS } from "@/lib/data/problemas-juridicos";
import { GUIAS } from "@/lib/data/guias";
import { CALCULADORAS } from "@/lib/data/calculadoras";
import { getAllTemplates } from "@/lib/data/templates-docs";
import { GLOSSARIO } from "@/lib/data/glossario";

/**
 * Seção de prova social para a home — claims VERIFICÁVEIS contando recursos
 * já existentes no banco (cidades IBGE, problemas curados, modelos, guias,
 * calculadoras, glossário). Sem inventar testimonials, sem "X advogados".
 *
 * O objetivo é dar peso à autoridade do site mostrando volume de conteúdo
 * curado em vez de fingir uma base de usuários grande.
 */
export function ProvaSocialHome() {
  const cidades = CITIES.length;
  const problemas = PROBLEMAS.length;
  const guias = GUIAS.length;
  const calculadoras = CALCULADORAS.length;
  const modelos = getAllTemplates().length;
  const termos = GLOSSARIO.length;

  const stats: Array<{ big: string; label: string; Icon: typeof MapPin }> = [
    { big: cidades.toLocaleString("pt-BR"), label: "cidades brasileiras cobertas", Icon: MapPin },
    { big: `${problemas}+`, label: "problemas jurídicos guiados passo a passo", Icon: HelpCircle },
    { big: `${guias}`, label: "guias por área do direito", Icon: Compass },
    { big: `${calculadoras}`, label: "calculadoras explicadas", Icon: Calculator },
    { big: `${modelos}`, label: "modelos gratuitos de documentos", Icon: FileText },
    { big: `${termos}+`, label: "termos do glossário em linguagem simples", Icon: BookOpen }
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

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border-2 border-brand-line bg-white p-5 hover:border-brand-accent/40 transition"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-accent/15 flex items-center justify-center flex-shrink-0">
                <s.Icon className="w-5 h-5 text-brand-accent2" aria-hidden />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-2xl md:text-3xl font-extrabold text-brand-ink leading-none">
                  {s.big}
                </p>
                <p className="text-xs md:text-sm text-brand-ink/65 mt-1 leading-snug">
                  {s.label}
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
          text="Todas as 5.570 cidades brasileiras com página própria. De São Paulo a Almenara."
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
