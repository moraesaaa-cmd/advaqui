"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Search, Compass, Users } from "lucide-react";

/**
 * ResolverAgora — classificador de caso interativo e MOTOR da home.
 *
 * O visitante descreve, em linguagem própria, o que aconteceu. Ao vivo,
 * mostramos os problemas jurídicos que mais combinam, com link pro passo a
 * passo. NUNCA deixamos o usuário sem resposta: se nenhum problema casa,
 * detectamos a ÁREA do direito (ex.: "matei alguém" -> criminal) e oferecemos
 * o guia da área + encontrar advogado daquela área. Se nem isso, mostramos um
 * fallback útil (todos os problemas + diretório). 100% client-side.
 */
export type ProblemaIndexItem = {
  slug: string;
  titulo: string;
  intencao: string;
  hay: string;
};

const EXEMPLOS = [
  "fui demitido e não recebi nada",
  "meu nome está negativado",
  "o plano de saúde negou minha cirurgia",
  "não recebo a pensão do meu filho",
  "caí em um golpe do pix",
  "o INSS negou meu benefício",
  "comprei um produto com defeito",
  "quero me divorciar"
];

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

// Palavras genéricas que não discriminam intenção (aparecem em quase tudo).
// "pessoa" era o grande poluidor — a maioria das intenções começa com "Pessoa...".
const STOP = new Set([
  "que","meu","minha","uma","uns","com","sem","por","para","nao","the","dos","das",
  "num","numa","foi","esta","estou","pessoa","pessoas","fazer","quero","como","tenho",
  "agora","sobre","ajuda","preciso","direito","direitos","advogado","advogada","caso",
  "alguem","gente","posso","sou","sao","tem","ter","fui","mais","aqui","isso","ele","ela"
]);

// Detecção de ÁREA por palavra-chave — fallback quando nenhum problema casa.
type Area = {
  label: string;
  guia: string; // slug em /guias
  esp: string; // slug em /advogados-de
  urgente?: boolean;
  kw: string[];
};
const AREAS: Area[] = [
  {
    label: "Direito Criminal",
    guia: "direito-criminal",
    esp: "criminal",
    urgente: true,
    kw: ["crime","matei","mat","homicid","assassin","preso","prisa","flagrante","acusad","roub","furt","ameac","agress","agredi","violencia","delegacia","intimac","droga","trafico","estelionato","apreend","audiencia","custodia","b.o","boletim"]
  },
  {
    label: "Direito do Trabalho",
    guia: "direito-trabalhista",
    esp: "trabalhista",
    kw: ["demit","demiss","rescis","salario","fgts","feria","decimo","hora extra","carteira","emprego","patra","chefe","assedio","justa causa","aviso previo","verba","trabalh","mandad embora","dispensad"]
  },
  {
    label: "Direito de Família",
    guia: "direito-de-familia",
    esp: "familia",
    kw: ["divorci","pensa","alimentici","guarda","filho","casament","separ","partilh","uniao estavel","alienac","visita","conjuge","ex-marido","ex-mulher","esposa","marido"]
  },
  {
    label: "Direito Previdenciário (INSS)",
    guia: "direito-previdenciario",
    esp: "previdenciario",
    kw: ["inss","aposentad","auxilio","beneficio","bpc","loas","pericia","previdenc","afastad","invalidez","pensao por morte"]
  },
  {
    label: "Direito do Consumidor",
    guia: "direito-do-consumidor",
    esp: "consumidor",
    kw: ["produto","defeito","loja","compr","cobranc","negativ","spc","serasa","golpe","pix","cartao","banco","juros","reembolso","garantia","procon","plano de saude","convenio","cirurgia","tratament","exame","fraude","estorno"]
  },
  {
    label: "Direito Imobiliário",
    guia: "direito-imobiliario",
    esp: "imobiliario",
    kw: ["aluguel","inquilin","despejo","imovel","condominio","locac","construtora","vizinho","terreno","escritura","financiament imovel"]
  },
  {
    label: "Direito Civil",
    guia: "direito-civil",
    esp: "civil",
    kw: ["divida","contrato","indeniz","danos","heranc","inventario","acidente","testament","emprestimo"]
  }
];

function detectArea(query: string): Area | null {
  let best: Area | null = null;
  let bestScore = 0;
  for (const a of AREAS) {
    let score = 0;
    for (const k of a.kw) if (query.includes(k)) score += 1;
    if (score > bestScore) {
      bestScore = score;
      best = a;
    }
  }
  return bestScore > 0 ? best : null;
}

export function ResolverAgora({ items }: { items: ProblemaIndexItem[] }) {
  const [q, setQ] = useState("");
  const query = normalize(q.trim());
  const active = query.length >= 3;

  const results = useMemo(() => {
    if (!active) return [];
    const tokens = query
      .split(/[^a-z0-9]+/)
      .filter((t) => t.length >= 3 && !STOP.has(t));
    if (tokens.length === 0) return [];
    const scored = items
      .map((it) => {
        const tituloNorm = normalize(it.titulo);
        let score = 0;
        for (const t of tokens) {
          if (it.hay.includes(t)) score += 1;
          if (tituloNorm.includes(t)) score += 2;
        }
        return { it, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    return scored.map((r) => r.it);
  }, [query, active, items]);

  const area = useMemo(
    () => (active && results.length === 0 ? detectArea(query) : null),
    [query, active, results.length]
  );

  return (
    <section id="resolva" className="container-tight py-12 md:py-16">
      <div className="rounded-3xl border-2 border-brand-accent/40 bg-white p-6 md:p-10 shadow-cardHover">
        <div className="flex items-center gap-2 text-brand-accent2 mb-2">
          <Sparkles className="w-5 h-5" aria-hidden />
          <span className="text-xs font-bold uppercase tracking-wider">
            Resolva agora · grátis
          </span>
        </div>
        <h2 className="font-display text-2xl md:text-4xl font-bold text-brand-ink leading-tight">
          Conte o que aconteceu — a gente te mostra o caminho
        </h2>
        <p className="text-brand-ink/65 mt-2 text-base md:text-lg">
          Escreva com suas palavras. Em segundos mostramos o passo a passo da
          sua situação, em linguagem clara — e onde encontrar um advogado.
        </p>

        <div className="mt-5 relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-ink/40"
            aria-hidden
          />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ex.: fui demitido e não recebi minhas verbas"
            aria-label="Descreva sua situação"
            className="w-full rounded-2xl border-2 border-brand-line focus:border-brand-accent outline-none bg-brand-bg/40 focus:bg-white pl-12 pr-4 py-4 text-base md:text-lg text-brand-ink transition"
          />
        </div>

        {/* Exemplos clicáveis */}
        {!active && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-brand-ink/50 self-center">Tente:</span>
            {EXEMPLOS.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setQ(ex)}
                className="text-xs rounded-full border border-brand-line bg-white px-3 py-1.5 text-brand-deep hover:border-brand-accent hover:bg-brand-accent/5 transition"
              >
                {ex}
              </button>
            ))}
          </div>
        )}

        {/* Resultados — problemas que casaram */}
        {results.length > 0 && (
          <ul className="mt-5 space-y-2.5">
            {results.map((it) => (
              <li key={it.slug}>
                <Link
                  href={`/problemas-juridicos/${it.slug}`}
                  className="group flex items-start justify-between gap-3 rounded-2xl border-2 border-brand-line bg-white p-4 hover:border-brand-accent hover:shadow-card transition"
                >
                  <span className="flex-1">
                    <span className="font-display font-bold text-brand-ink group-hover:text-brand-deep transition block leading-snug">
                      {it.titulo}
                    </span>
                    <span className="text-sm text-brand-ink/65 mt-0.5 block leading-snug">
                      {it.intencao}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-accent2 mt-2">
                      Ver o passo a passo
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" aria-hidden />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Fallback por ÁREA — nenhum problema casou, mas identificamos a área */}
        {active && results.length === 0 && area && (
          <div className="mt-5 rounded-2xl border-2 border-brand-deep/30 bg-brand-bg/40 p-5">
            <p className="text-sm text-brand-ink/80 leading-relaxed">
              Isso parece um caso de <strong className="text-brand-deep">{area.label}</strong>.
              {area.urgente
                ? " Em situações assim, procure um advogado o quanto antes — você tem direito a defesa e ao silêncio."
                : " Veja o guia da área para entender o passo a passo, ou fale com um advogado especializado."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <Link
                href={`/guias/${area.guia}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl bg-brand-deep text-white hover:bg-brand-deep/90 transition"
              >
                <Compass className="w-4 h-4" aria-hidden />
                Guia de {area.label}
              </Link>
              <Link
                href={`/advogados-de/${area.esp}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl border-2 border-brand-line bg-white text-brand-deep hover:border-brand-accent transition"
              >
                <Users className="w-4 h-4" aria-hidden />
                Advogado de {area.label}
              </Link>
            </div>
          </div>
        )}

        {/* Fallback genérico — não casou problema nem área. Nunca deixa o usuário sem saída. */}
        {active && results.length === 0 && !area && (
          <div className="mt-5 rounded-2xl border border-brand-line bg-brand-bg/40 p-5">
            <p className="text-sm text-brand-ink/80 leading-relaxed">
              Não encontramos um caso com esse nome — mas a gente te ajuda a
              chegar lá. Veja a lista de problemas jurídicos comuns ou encontre
              um advogado na sua cidade.
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <Link
                href="/problemas-juridicos"
                className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl bg-brand-deep text-white hover:bg-brand-deep/90 transition"
              >
                <Compass className="w-4 h-4" aria-hidden />
                Ver todos os problemas
              </Link>
              <Link
                href="/advogados"
                className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl border-2 border-brand-line bg-white text-brand-deep hover:border-brand-accent transition"
              >
                <Users className="w-4 h-4" aria-hidden />
                Encontrar advogado
              </Link>
            </div>
          </div>
        )}

        {/* CTA persistente — sempre presente quando há busca ativa */}
        {active && (
          <p className="mt-4 text-center text-sm text-brand-ink/60">
            Não é bem isso?{" "}
            <Link
              href="/problemas-juridicos"
              className="font-semibold text-brand-deep hover:text-brand-accent2 underline"
            >
              Ver todos os problemas jurídicos
            </Link>{" "}
            ou{" "}
            <Link
              href="/advogados"
              className="font-semibold text-brand-deep hover:text-brand-accent2 underline"
            >
              buscar advogado por cidade
            </Link>
            .
          </p>
        )}
      </div>
    </section>
  );
}
