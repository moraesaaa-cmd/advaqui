"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  Search,
  Compass,
  Users,
  Clock,
  CornerDownLeft
} from "lucide-react";
import type { ProblemaIndexItem } from "@/lib/data/problema-index";
import { normalizeText } from "@/lib/data/problema-index";

/**
 * GuiaInteligente (componente ResolverAgora) — o MOTOR da home.
 *
 * O visitante descreve, com as próprias palavras, o que aconteceu. Ao vivo,
 * cruzamos o texto com TODAS as situações jurídicas mapeadas e mostramos as
 * que mais combinam, já com link pro passo a passo. O diferencial é entender
 * linguagem do dia a dia: uma camada de sinônimos/coloquialismos traduz
 * "meu patrão não me paga" → salário atrasado, "bati o carro" → acidente,
 * "nome sujo" → negativação. NUNCA deixamos o usuário sem resposta: se nada
 * casa, detectamos a ÁREA do direito e oferecemos o guia + advogado da área;
 * em último caso, um fallback útil. 100% no navegador, instantâneo.
 */

const AREA_LABEL: Record<string, string> = {
  trabalhista: "Trabalhista",
  familia: "Família",
  consumidor: "Consumidor",
  previdenciario: "Previdenciário",
  civil: "Civil",
  criminal: "Criminal",
  imobiliario: "Imobiliário"
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

// Palavras genéricas que não discriminam intenção.
const STOP = new Set([
  "que", "meu", "minha", "uma", "uns", "com", "sem", "por", "para", "nao",
  "the", "dos", "das", "num", "numa", "foi", "esta", "estou", "pessoa",
  "pessoas", "fazer", "quero", "como", "tenho", "agora", "sobre", "ajuda",
  "preciso", "direito", "direitos", "advogado", "advogada", "caso", "alguem",
  "gente", "posso", "sou", "sao", "tem", "ter", "fui", "mais", "aqui", "isso",
  "ele", "ela", "meu", "minha", "esse", "essa", "muito", "bem", "ja", "nos"
]);

// Camada de inteligência: coloquial (token) -> termos que aparecem nos dados.
const SYNONYMS: Record<string, string[]> = {
  patrao: ["empregador", "empresa", "salario", "trabalho", "demitido"],
  patroa: ["empregador", "empresa", "salario", "trabalho"],
  chefe: ["empregador", "empresa", "trabalho"],
  firma: ["empresa", "emprego", "trabalho"],
  empresa: ["empregador", "trabalho"],
  demitiram: ["demitido", "demissao", "rescisao", "dispensa"],
  mandaram: ["demitido", "demissao", "dispensa"],
  despediram: ["demitido", "demissao", "rescisao"],
  despedido: ["demitido", "demissao", "rescisao"],
  calote: ["divida", "cobranca", "devedor", "pagar"],
  caloteiro: ["divida", "cobranca", "devedor"],
  devendo: ["divida", "cobranca"],
  roubaram: ["roubo", "furto", "crime", "subtracao"],
  assalto: ["roubo", "crime"],
  assaltado: ["roubo", "crime"],
  apanhei: ["agressao", "violencia", "lesao", "crime"],
  bateu: ["agressao", "violencia", "lesao"],
  espancou: ["agressao", "violencia", "lesao"],
  ameacou: ["ameaca", "crime"],
  separei: ["divorcio", "separacao", "uniao"],
  separar: ["divorcio", "separacao"],
  terminei: ["divorcio", "separacao", "uniao"],
  marido: ["divorcio", "pensao", "guarda", "uniao", "conjuge"],
  esposa: ["divorcio", "pensao", "guarda", "uniao", "conjuge"],
  esposo: ["divorcio", "pensao", "guarda", "conjuge"],
  mulher: ["divorcio", "pensao", "guarda", "conjuge"],
  encostado: ["auxilio", "inss", "afastamento", "beneficio"],
  encostei: ["auxilio", "inss", "afastamento", "beneficio"],
  afastado: ["auxilio", "inss", "afastamento"],
  aposentar: ["aposentadoria", "inss", "beneficio"],
  aposentei: ["aposentadoria", "inss", "beneficio"],
  aposentadoria: ["inss", "beneficio"],
  sujo: ["negativado", "spc", "serasa", "nome"],
  negativaram: ["negativado", "spc", "serasa"],
  spc: ["negativado", "serasa"],
  serasa: ["negativado", "spc"],
  celular: ["produto", "defeito", "garantia", "compra"],
  geladeira: ["produto", "defeito", "garantia"],
  aparelho: ["produto", "defeito", "garantia"],
  comprei: ["compra", "produto", "loja", "consumidor"],
  loja: ["compra", "produto", "consumidor"],
  vizinho: ["vizinho", "condominio", "barulho"],
  vizinha: ["vizinho", "condominio", "barulho"],
  aluguel: ["aluguel", "locacao", "despejo", "imovel"],
  inquilino: ["aluguel", "locacao", "despejo"],
  despejo: ["aluguel", "locacao", "imovel"],
  heranca: ["heranca", "inventario", "sucessao"],
  herdeiro: ["heranca", "inventario", "sucessao"],
  faleceu: ["heranca", "inventario", "sucessao", "pensao"],
  morreu: ["heranca", "inventario", "sucessao", "pensao"],
  acidente: ["acidente", "transito", "indenizacao"],
  batida: ["acidente", "transito", "indenizacao"],
  colisao: ["acidente", "transito"],
  golpe: ["golpe", "pix", "fraude", "estorno", "estelionato"],
  pix: ["golpe", "fraude", "estorno"],
  fraude: ["golpe", "estorno", "estelionato"],
  juros: ["juros", "banco", "financiamento", "divida"],
  financiamento: ["juros", "banco", "divida"],
  emprestimo: ["juros", "banco", "divida"],
  banco: ["juros", "financiamento", "conta"]
};

// Frases inteiras (substring na query) -> termos dos dados.
const PHRASES: Array<[string, string[]]> = [
  ["mandado embora", ["demitido", "demissao", "rescisao"]],
  ["mandaram embora", ["demitido", "demissao", "rescisao"]],
  ["botaram pra fora", ["demitido", "demissao"]],
  ["botou pra fora", ["demitido", "demissao"]],
  ["nao recebi", ["salario", "verbas", "divida", "atrasado", "pagamento"]],
  ["nao recebo", ["salario", "verbas", "pensao", "atrasado"]],
  ["nao me pagaram", ["salario", "verbas", "divida", "atrasado"]],
  ["nao me paga", ["salario", "verbas", "divida", "pensao"]],
  ["nao pagou", ["salario", "divida", "atrasado", "pagamento"]],
  ["nome sujo", ["negativado", "spc", "serasa"]],
  ["nome no spc", ["negativado", "spc", "serasa"]],
  ["nome na serasa", ["negativado", "spc", "serasa"]],
  ["plano de saude", ["plano", "saude", "convenio", "cirurgia", "tratamento"]],
  ["bati o carro", ["acidente", "transito", "indenizacao"]],
  ["bati meu carro", ["acidente", "transito", "indenizacao"]],
  ["bateram no meu carro", ["acidente", "transito", "indenizacao"]],
  ["sofri acidente", ["acidente", "transito", "indenizacao"]],
  ["fui preso", ["preso", "flagrante", "criminal", "crime"]],
  ["estou preso", ["preso", "flagrante", "criminal", "crime"]],
  ["prisao em flagrante", ["preso", "flagrante", "criminal"]],
  ["nao paga pensao", ["pensao", "alimentos", "guarda"]],
  ["pensao alimenticia", ["pensao", "alimentos", "guarda"]],
  ["me roubaram", ["roubo", "furto", "crime"]],
  ["fui roubado", ["roubo", "furto", "crime"]],
  ["hora extra", ["hora", "extra", "salario", "trabalho"]],
  ["justa causa", ["justa", "causa", "demissao", "rescisao"]]
];

type Area = {
  label: string;
  guia: string;
  esp: string;
  urgente?: boolean;
  kw: string[];
};
const AREAS: Area[] = [
  {
    label: "Direito Criminal",
    guia: "direito-criminal",
    esp: "criminal",
    urgente: true,
    kw: ["crime", "matei", "homicid", "assassin", "preso", "prisa", "flagrante", "roub", "furt", "ameac", "agress", "agredi", "violencia", "delegacia", "intimac", "droga", "trafico", "estelionato", "apreend", "audiencia", "custodia", "boletim"]
  },
  {
    label: "Direito do Trabalho",
    guia: "direito-trabalhista",
    esp: "trabalhista",
    kw: ["demit", "demiss", "rescis", "salario", "fgts", "feria", "decimo", "hora extra", "carteira", "emprego", "patra", "chefe", "assedio", "justa causa", "aviso previo", "verba", "trabalh", "dispensad", "empregador"]
  },
  {
    label: "Direito de Família",
    guia: "direito-de-familia",
    esp: "familia",
    kw: ["divorci", "pensa", "alimentici", "guarda", "filho", "casament", "separ", "partilh", "uniao estavel", "alienac", "visita", "conjuge", "marido", "esposa"]
  },
  {
    label: "Direito Previdenciário (INSS)",
    guia: "direito-previdenciario",
    esp: "previdenciario",
    kw: ["inss", "aposentad", "auxilio", "beneficio", "bpc", "loas", "pericia", "previdenc", "afastad", "invalidez", "pensao por morte"]
  },
  {
    label: "Direito do Consumidor",
    guia: "direito-do-consumidor",
    esp: "consumidor",
    kw: ["produto", "defeito", "loja", "compr", "cobranc", "negativ", "spc", "serasa", "golpe", "pix", "cartao", "banco", "juros", "reembolso", "garantia", "procon", "plano de saude", "convenio", "cirurgia", "tratament", "exame", "fraude", "estorno"]
  },
  {
    label: "Direito Imobiliário",
    guia: "direito-imobiliario",
    esp: "imobiliario",
    kw: ["aluguel", "inquilin", "despejo", "imovel", "condominio", "locac", "construtora", "vizinho", "terreno", "escritura"]
  },
  {
    label: "Direito Civil",
    guia: "direito-civil",
    esp: "civil",
    kw: ["divida", "contrato", "indeniz", "danos", "heranc", "inventario", "acidente", "testament", "emprestimo"]
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

function buildTokens(query: string): { base: string[]; expanded: string[] } {
  const base = query
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 3 && !STOP.has(t));
  const expanded = new Set<string>();
  for (const t of base) {
    const syn = SYNONYMS[t];
    if (syn) syn.forEach((s) => expanded.add(s));
  }
  for (const [phrase, toks] of PHRASES) {
    if (query.includes(phrase)) toks.forEach((s) => expanded.add(s));
  }
  base.forEach((b) => expanded.delete(b));
  return { base, expanded: [...expanded] };
}

type Scored = { it: ProblemaIndexItem; score: number };

export function ResolverAgora({ items }: { items: ProblemaIndexItem[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce: dá a sensação de "análise" e evita recomputar a cada tecla.
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setDebounced(q), 240);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [q]);

  const queryRaw = q.trim();
  const active = normalizeText(queryRaw).length >= 3;
  const query = normalizeText(debounced.trim());
  const settled = active && normalizeText(queryRaw) === query;
  const thinking = active && !settled;

  const scored = useMemo<Scored[]>(() => {
    if (query.length < 3) return [];
    const { base, expanded } = buildTokens(query);
    if (base.length === 0 && expanded.length === 0) return [];
    return items
      .map((it) => {
        const tituloNorm = normalizeText(it.titulo);
        let score = 0;
        for (const t of base) {
          if (it.hay.includes(t)) score += 2;
          if (tituloNorm.includes(t)) score += 3;
        }
        for (const t of expanded) {
          if (it.hay.includes(t)) score += 1;
        }
        return { it, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [query, items]);

  const results = scored.map((s) => s.it);
  const topScore = scored.length ? scored[0].score : 0;

  const area = useMemo(
    () => (query.length >= 3 && results.length === 0 ? detectArea(query) : null),
    [query, results.length]
  );

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (results[0]) router.push(`/problemas-juridicos/${results[0].slug}`);
      else if (area) router.push(`/guias/${area.guia}`);
      else if (active) router.push("/problemas-juridicos");
    }
  }

  return (
    <section id="orientacao" className="relative bg-brand-bg">
      <div className="container-tight py-12 md:py-16">
        <div className="relative rounded-3xl bg-white border border-brand-line shadow-cardHover overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-brand-accent/10 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-24 -left-20 w-72 h-72 rounded-full bg-brand-deep/5 blur-3xl"
          />
          <div className="relative p-6 md:p-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-2.5 w-2.5" aria-hidden>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-60" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-accent2" />
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-accent2">
                <Sparkles className="w-4 h-4" aria-hidden />
                Orientação inteligente
              </span>
            </div>

            <h2 className="font-display text-2xl md:text-4xl font-bold text-brand-ink leading-tight text-balance">
              Conte o que aconteceu — mostramos seu caminho em segundos
            </h2>
            <p className="text-brand-ink/65 mt-2 text-base md:text-lg max-w-2xl">
              Escreva do seu jeito, sem juridiquês. A gente entende a linguagem
              do dia a dia e mostra o caminho da sua situação — com o passo a
              passo e onde achar um advogado.
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
                onKeyDown={onKeyDown}
                placeholder="Ex.: meu patrão não pagou minhas verbas"
                aria-label="Descreva sua situação com suas palavras"
                className="w-full rounded-2xl border-2 border-brand-line focus:border-brand-accent outline-none bg-brand-bg/40 focus:bg-white pl-12 pr-12 py-4 text-base md:text-lg text-brand-ink transition"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 text-[11px] text-brand-ink/40">
                <CornerDownLeft className="w-3.5 h-3.5" aria-hidden />
                Enter
              </span>
              {thinking && (
                <div className="absolute left-0 right-0 -bottom-0.5 h-0.5 overflow-hidden rounded-b-2xl">
                  <div className="h-full w-full bg-gradient-to-r from-transparent via-brand-accent to-transparent animate-pulse" />
                </div>
              )}
            </div>

            {/* Estado inicial — exemplos + profundidade */}
            {!active && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-brand-ink/50 self-center">
                    Tente:
                  </span>
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
              </div>
            )}

            {/* Analisando */}
            {thinking && (
              <div
                className="mt-5 flex items-center gap-2 text-sm text-brand-ink/60"
                aria-live="polite"
              >
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent2 animate-bounce" />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-brand-accent2 animate-bounce"
                    style={{ animationDelay: "0.12s" }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-brand-accent2 animate-bounce"
                    style={{ animationDelay: "0.24s" }}
                  />
                </span>
                Analisando sua situação…
              </div>
            )}

            {/* Resultados */}
            {settled && results.length > 0 && (
              <div className="mt-5" aria-live="polite">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-ink/45 mb-2.5">
                  {results.length === 1
                    ? "1 situação que mais combina"
                    : `${results.length} situações que mais combinam`}
                </p>
                <ul className="space-y-2.5">
                  {scored.map(({ it, score }, idx) => (
                    <li key={it.slug}>
                      <Link
                        href={`/problemas-juridicos/${it.slug}`}
                        className="group flex items-start gap-3 rounded-2xl border-2 border-brand-line bg-white p-4 hover:border-brand-accent hover:shadow-card transition"
                      >
                        <span className="flex-1 min-w-0">
                          <span className="flex flex-wrap items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md bg-brand-deep/10 text-brand-deep">
                              {AREA_LABEL[it.area] ?? "Jurídico"}
                            </span>
                            {idx === 0 && topScore >= 5 && (
                              <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700">
                                Melhor correspondência
                              </span>
                            )}
                            {it.urgente && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                                <Clock className="w-3 h-3" aria-hidden />
                                Tempo importa
                              </span>
                            )}
                          </span>
                          <span className="font-display font-bold text-brand-ink group-hover:text-brand-deep transition block leading-snug">
                            {it.titulo}
                          </span>
                          <span className="text-sm text-brand-ink/65 mt-0.5 block leading-snug line-clamp-2">
                            {it.intencao}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-accent2 mt-2">
                            Ver o passo a passo
                            <ArrowRight
                              className="w-4 h-4 group-hover:translate-x-0.5 transition"
                              aria-hidden
                            />
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Fallback por área */}
            {settled && results.length === 0 && area && (
              <div className="mt-5 rounded-2xl border-2 border-brand-deep/30 bg-brand-bg/50 p-5">
                <p className="text-sm text-brand-ink/80 leading-relaxed">
                  Isso parece um caso de{" "}
                  <strong className="text-brand-deep">{area.label}</strong>.
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

            {/* Fallback genérico — nunca deixa sem saída */}
            {settled && results.length === 0 && !area && (
              <div className="mt-5 rounded-2xl border border-brand-line bg-brand-bg/50 p-5">
                <p className="text-sm text-brand-ink/80 leading-relaxed">
                  Não encontramos um caso com esse nome — mas a gente te ajuda a
                  chegar lá. Veja a lista de problemas jurídicos comuns ou
                  encontre um advogado na sua cidade.
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

            {/* Rodapé de confiança / CTA persistente */}
            {settled && (results.length > 0 || area) && (
              <p className="mt-4 text-center text-sm text-brand-ink/55">
                Não é bem isso?{" "}
                <Link
                  href="/problemas-juridicos"
                  className="font-semibold text-brand-deep hover:text-brand-accent2 underline"
                >
                  Ver todos os problemas
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

            {!active && (
              <p className="mt-4 text-xs text-brand-ink/45">
                Orientação gerada no seu navegador, sem enviar seus dados. Não
                substitui a consulta a um advogado.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
