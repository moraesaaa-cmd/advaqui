/**
 * Helpers de interlinking interno — Maio/2026.
 *
 * Centraliza as funções que decidem "que página da própria casa eu linko
 * a partir desta página?". Cada uma resolve um eixo do interlinking SEO:
 *
 *   1. cidade × especialidade → relatedCitiesForSpecialty (capitais de
 *      outros estados com a MESMA especialidade)
 *   2. estado → topCitiesForState (capital + 5-9 cidades grandes)
 *   3. cidade → nearbyCities (já existe em lib/data/cities.ts)
 *   4. artigo → relatedSpecialtyAndCities (especialidade do artigo +
 *      capitais pra encontrar advogado dessa área)
 *   5. modelo → relatedArticlesForTemplate (artigos que tocam o tema
 *      do modelo, ex: locação → despejo + contrato locação)
 *   6. perfil → cidades + especialidades do lawyer (já existe inline)
 *   7. especialidade → topCitiesForSpecialty (cidades com mais demanda)
 *
 * Tudo é puro (não toca banco). Decisão por dado estático garante que
 * o build SSG seja rápido e os links sejam estáveis pro Google rastreador.
 */

import { SPECIALTIES, type Specialty } from "@/lib/data/specialties";
import { STATES, type State } from "@/lib/data/states";
import { citiesByUf, cityHash, type City } from "@/lib/data/cities";
import { ARTICLES, type Article } from "@/lib/data/articles";
import { TEMPLATES, type Template } from "@/lib/data/templates-docs";
import {
  getCidadesPrioritarias,
  type CidadePrioritaria
} from "@/lib/data/cidades-prioritarias";

/**
 * Capitais de outros estados onde encontrar advogado da mesma especialidade.
 * Útil em /advogados/[uf]/[cidade]/[especialidade] — link "Mesma especialidade
 * em outras capitais".
 *
 * Retorna até `limit` capitais (default 9). Exclui a UF passada.
 */
export function relatedCapitalsForSpecialty(
  specialty: Specialty,
  excludeUf?: string,
  limit = 9
): Array<{ city: City; state: State }> {
  const out: Array<{ city: City; state: State }> = [];
  for (const st of STATES) {
    if (excludeUf && st.uf === excludeUf.toUpperCase()) continue;
    const cap = citiesByUf(st.uf).find((c) => c.isCapital);
    if (cap) out.push({ city: cap, state: st });
    if (out.length >= limit) break;
  }
  return out;
}

/**
 * Cidades principais de um estado (capital + 8 maiores cidades populosas
 * conhecidas). Usado em /advogados/[uf] como destaque.
 *
 * Como a base IBGE não traz população, listamos manualmente as cidades
 * grandes mais procuradas por UF. Pra estados sem essa curadoria, cai
 * em capital + ordem alfabética da lista citiesByUf.
 */
const KNOWN_BIG_CITIES: Record<string, string[]> = {
  SP: ["sao-paulo", "guarulhos", "campinas", "sao-bernardo-do-campo", "santo-andre", "osasco", "ribeirao-preto", "sorocaba", "santos"],
  RJ: ["rio-de-janeiro", "sao-goncalo", "duque-de-caxias", "nova-iguacu", "niteroi", "campos-dos-goytacazes", "petropolis", "volta-redonda", "magé"],
  MG: ["belo-horizonte", "uberlandia", "contagem", "juiz-de-fora", "betim", "montes-claros", "ribeirao-das-neves", "uberaba", "governador-valadares"],
  BA: ["salvador", "feira-de-santana", "vitoria-da-conquista", "camacari", "juazeiro", "ilheus", "itabuna", "lauro-de-freitas", "porto-seguro"],
  PR: ["curitiba", "londrina", "maringa", "ponta-grossa", "cascavel", "sao-jose-dos-pinhais", "foz-do-iguacu", "guarapuava", "paranagua"],
  RS: ["porto-alegre", "caxias-do-sul", "pelotas", "canoas", "santa-maria", "gravataí", "viamao", "novo-hamburgo", "passo-fundo"],
  PE: ["recife", "jaboatao-dos-guararapes", "olinda", "caruaru", "petrolina", "paulista", "cabo-de-santo-agostinho", "camaragibe", "garanhuns"],
  CE: ["fortaleza", "caucaia", "juazeiro-do-norte", "maracanau", "sobral", "crato", "itapipoca", "maranguape", "iguatu"],
  GO: ["goiania", "aparecida-de-goiania", "anapolis", "rio-verde", "luziania", "aguas-lindas-de-goias", "valparaiso-de-goias", "trindade", "formosa"]
};

export function topCitiesForState(state: State, limit = 9): City[] {
  const all = citiesByUf(state.uf);
  const known = KNOWN_BIG_CITIES[state.uf];
  if (known) {
    const map = new Map(all.map((c) => [c.slug, c]));
    const out: City[] = [];
    for (const slug of known) {
      const c = map.get(slug);
      if (c) out.push(c);
      if (out.length >= limit) break;
    }
    if (out.length > 0) return out;
  }
  // Fallback: capital + primeiras alfabéticas
  const capital = all.find((c) => c.isCapital);
  const rest = all.filter((c) => !c.isCapital);
  return [...(capital ? [capital] : []), ...rest].slice(0, limit);
}

/**
 * Anchor text rotacionado para links de cidades vizinhas.
 *
 * 4 padrões, escolhidos por hash(slugOrigem + slugDestino) % 4 — o anchor
 * de um mesmo par origem→destino nunca muda entre builds (determinístico),
 * mas varia entre pares, evitando um site inteiro com anchors idênticos.
 */
export function neighborAnchor(originSlug: string, target: City): string {
  const patterns = [
    `Advogados em ${target.name}`,
    `${target.name} — ${target.uf}`,
    `veja profissionais em ${target.name}`,
    `atendimento em ${target.name}`
  ];
  return patterns[cityHash(originSlug + target.slug) % 4];
}

/**
 * Especialidades mais relevantes pra um artigo do blog (mapeamento por
 * categoria do artigo). Cada artigo do blog é classificado em uma das
 * 7 categorias (Trabalhista, Família, etc); aqui mapeamos pra slugs de
 * especialidade do diretório.
 */
const ARTICLE_CATEGORY_TO_SPECIALTY: Record<string, string[]> = {
  Trabalhista: ["trabalhista"],
  Família: ["familia"],
  Previdenciário: ["previdenciario"],
  Consumidor: ["civil", "consumidor"],
  Sucessões: ["civil", "familia"],
  Imobiliário: ["civil", "imobiliario"],
  Trânsito: ["criminal", "civil"]
};

export function specialtiesForArticle(article: Article): Specialty[] {
  const slugs = ARTICLE_CATEGORY_TO_SPECIALTY[article.category] || [];
  return slugs
    .map((s) => SPECIALTIES.find((sp) => sp.slug === s))
    .filter((sp): sp is Specialty => Boolean(sp));
}

/**
 * Capitais sugeridas pra um artigo — "Encontre advogado [especialidade]
 * em uma das principais capitais".
 */
export function capitalsForArticle(article: Article, limit = 6): Array<{ city: City; state: State; specialty: Specialty }> {
  const specs = specialtiesForArticle(article);
  if (specs.length === 0) return [];
  const primarySpec = specs[0];
  const out: Array<{ city: City; state: State; specialty: Specialty }> = [];
  for (const st of STATES) {
    const cap = citiesByUf(st.uf).find((c) => c.isCapital);
    if (cap) out.push({ city: cap, state: st, specialty: primarySpec });
    if (out.length >= limit) break;
  }
  return out;
}

/**
 * Artigos do blog relacionados a um modelo (template).
 *
 * O mapeamento é por palavras-chave no slug do modelo — ex: modelo de
 * "contrato-de-locacao-residencial-simples" linka pro artigo "acao-de-despejo".
 *
 * Quando nada bate, devolve até 3 artigos mais recentes do blog (genéricos).
 */
const TEMPLATE_TO_ARTICLE_SLUGS: Record<string, string[]> = {
  // Locação / imobiliário
  "contrato-de-locacao-residencial-simples": ["acao-de-despejo-como-funciona"],
  "distrato-contrato-locacao": ["acao-de-despejo-como-funciona"],
  "contrato-comodato-gratuito": ["acao-de-despejo-como-funciona"],
  // Família / sucessões
  "declaracao-de-uniao-estavel": ["como-pedir-divorcio", "como-pedir-pensao-alimenticia"],
  "autorizacao-viagem-menor-nacional": ["como-pedir-pensao-alimenticia"],
  "declaracao-de-bens-para-imposto-doacao": ["como-fazer-inventario"],
  // Notificações / cobrança / consumidor
  "notificacao-extrajudicial-cobranca": ["banco-cobrou-taxa-indevida", "como-entrar-com-acao-no-juizado-do-consumidor"],
  "carta-resposta-cobranca-indevida": ["banco-cobrou-taxa-indevida", "como-entrar-com-acao-no-juizado-do-consumidor"],
  // Procurações e declarações
  "procuracao-particular-geral": ["inss-negou-beneficio-o-que-fazer"],
  "declaracao-hipossuficiencia-justica-gratuita": ["inss-negou-beneficio-o-que-fazer"],
  "declaracao-de-domicilio-residencia": [],
  // Serviços / quitação
  "contrato-prestacao-de-servicos": ["acordo-trabalhista-vale-a-pena"],
  "rescisao-contrato-prestacao-servicos": ["acordo-trabalhista-vale-a-pena", "fui-demitido-sem-justa-causa"],
  "recibo-pagamento-quitacao": ["fui-demitido-sem-justa-causa"],
  "termo-quitacao-debito": ["banco-cobrou-taxa-indevida"],
  // Genéricos
  "termo-de-acordo-extrajudicial": ["acordo-trabalhista-vale-a-pena"],
  "termo-de-cessao-de-direitos": [],
  "carta-renuncia-de-direito": ["como-fazer-inventario"],
  "autorizacao-uso-de-imagem": [],
  "termo-de-confidencialidade-nda": []
};

export function relatedArticlesForTemplate(
  template: Template,
  limit = 3
): Article[] {
  const slugs = TEMPLATE_TO_ARTICLE_SLUGS[template.slug] || [];
  const matched = slugs
    .map((s) => ARTICLES.find((a) => a.slug === s))
    .filter((a): a is Article => Boolean(a));
  if (matched.length >= limit) return matched.slice(0, limit);
  // Completa com os mais recentes do blog que não estão já incluídos
  const usedSlugs = new Set(matched.map((a) => a.slug));
  const others = ARTICLES.filter((a) => !usedSlugs.has(a.slug)).slice(
    0,
    limit - matched.length
  );
  return [...matched, ...others];
}

/**
 * Artigos do blog relacionados a uma especialidade jurídica.
 * Usado em glossário e problemas-juridicos para fechar o cluster de conteúdo.
 */
export function relatedArticlesForSpecialty(
  specialtySlug: string,
  limit = 3
): Article[] {
  return ARTICLES
    .filter((a) => a.relatedSpecialty === specialtySlug)
    .slice(0, limit);
}

type ToolLink = { href: string; label: string; desc: string };

const SPECIALTY_TOOLS: Record<string, ToolLink[]> = {
  trabalhista: [
    { href: "/calculadoras", label: "Calculadora de rescisão", desc: "Calcule verbas rescisórias, FGTS e multa" },
    { href: "/seguro-desemprego", label: "Simulador de seguro-desemprego", desc: "Parcelas e valor pela tabela oficial" },
    { href: "/diagnostico", label: "Diagnóstico trabalhista", desc: "Descubra seus direitos em 6 perguntas" },
  ],
  familia: [
    { href: "/divorcio", label: "Divórcio: cartório ou Justiça?", desc: "Descubra o caminho certo em 4 perguntas" },
    { href: "/ferramentas/checklist-pensao-alimenticia", label: "Checklist: pensão alimentícia", desc: "Documentos para pedir pensão" },
    { href: "/ferramentas/checklist-documentos-guarda", label: "Checklist: guarda de filhos", desc: "Preparação para ação de guarda" },
  ],
  civil: [
    { href: "/correcao-monetaria", label: "Correção monetária", desc: "Atualize valores pela inflação oficial" },
    { href: "/calculadora-prazos", label: "Calculadora de prazos", desc: "Vencimento em dias úteis ou corridos" },
    { href: "/ferramentas/checklist-limpar-nome", label: "Checklist: limpar nome", desc: "Passo a passo para sair do SPC/Serasa" },
  ],
  criminal: [
    { href: "/calculadora-prazos", label: "Calculadora de prazos", desc: "Prazos processuais em dias úteis" },
    { href: "/glossario", label: "Glossário jurídico", desc: "Termos do direito em linguagem simples" },
    { href: "/triagem", label: "Triagem jurídica", desc: "Qual advogado procurar para o seu caso" },
  ],
  previdenciario: [
    { href: "/previdencia", label: "Simulador de aposentadoria", desc: "Regras de transição e cálculo de pontuação" },
    { href: "/calculadora-prazos", label: "Calculadora de prazos", desc: "Prazos para recurso ao INSS" },
    { href: "/triagem", label: "Triagem jurídica", desc: "Descubra o próximo passo do seu caso" },
  ],
  consumidor: [
    { href: "/ferramentas/checklist-limpar-nome", label: "Checklist: limpar nome", desc: "Saia do SPC/Serasa passo a passo" },
    { href: "/correcao-monetaria", label: "Correção monetária", desc: "Atualize o valor da sua reclamação" },
    { href: "/atualizar-valor", label: "Atualizar um valor", desc: "Correção, juros e multa sobre uma dívida" },
  ],
  imobiliario: [
    { href: "/imobiliario", label: "Comprar imóvel com segurança", desc: "Checklist de documentos e certidões" },
    { href: "/correcao-monetaria", label: "Correção monetária", desc: "Atualize valores de contrato pela inflação" },
    { href: "/modelos", label: "Modelos de contrato", desc: "Locação, distrato, comodato e outros" },
  ],
};

export function toolsForSpecialty(specialtySlug: string, limit = 3): ToolLink[] {
  return (SPECIALTY_TOOLS[specialtySlug] ?? []).slice(0, limit);
}

export function toolsForArticle(article: Article, limit = 3): ToolLink[] {
  const specs = specialtiesForArticle(article);
  if (specs.length === 0) return [];
  const seen = new Set<string>();
  const out: ToolLink[] = [];
  for (const sp of specs) {
    for (const t of SPECIALTY_TOOLS[sp.slug] ?? []) {
      if (!seen.has(t.href)) {
        seen.add(t.href);
        out.push(t);
      }
      if (out.length >= limit) return out;
    }
  }
  return out;
}

/**
 * T13 — Guias úteis por cidade (hub geográfico → spokes temáticos).
 *
 * Cada página de cidade linka 4-6 artigos LOCALIZADOS do blog
 * (/blog/[slug]/em/[cidade-uf]) — a versão localizada existe pra toda
 * cidade IBGE (rota force-dynamic), então o link nunca é 404.
 *
 * Pool ordenado por volume de busca: os 6 primeiros são os temas de maior
 * demanda (demissão, pensão, negativação, multa, inventário, aluguel).
 * A escolha rotaciona por hash(uf:citySlug) — determinística por cidade,
 * variada entre cidades. Anchors rotacionam por hash(citySlug+slug).
 *
 * Todos os slugs existem em lib/data/articles-cidades.ts
 * (ARTIGOS_LOCALIZAVEIS_SLUGS) — allow-list dos artigos com versão local.
 */
export type GuiaUtilLink = { href: string; label: string; desc: string };

const GUIAS_UTEIS_POOL: Array<{
  slug: string;
  anchors: string[];
  desc: string;
}> = [
  // === Temas de maior busca (prioridade) ===
  {
    slug: "fui-demitido-sem-justa-causa",
    anchors: [
      "Demitido sem justa causa: seus direitos",
      "Direitos na demissão sem justa causa",
      "Fui demitido: o que devo receber"
    ],
    desc: "Verbas rescisórias, FGTS, multa de 40% e prazos"
  },
  {
    slug: "como-pedir-pensao-alimenticia",
    anchors: [
      "Como pedir pensão alimentícia",
      "Pensão alimentícia: como funciona o pedido",
      "Guia da pensão alimentícia"
    ],
    desc: "Para filhos, ex-cônjuges e pais idosos — passo a passo"
  },
  {
    slug: "banco-cobrou-taxa-indevida",
    anchors: [
      "Cobrança indevida e nome negativado",
      "Banco cobrou taxa indevida: o que fazer",
      "Como contestar cobrança indevida"
    ],
    desc: "Restituição, negativação em SPC/Serasa e dano moral"
  },
  {
    slug: "multa-de-transito-como-recorrer",
    anchors: [
      "Como recorrer de multa de trânsito",
      "Recurso de multa de trânsito: guia",
      "Multa de trânsito: prazos e defesa"
    ],
    desc: "Defesa prévia, JARI e prazos do recurso"
  },
  {
    slug: "como-fazer-inventario",
    anchors: [
      "Inventário: como fazer e quanto custa",
      "Guia do inventário passo a passo",
      "Inventário judicial e extrajudicial"
    ],
    desc: "Prazos, custos e quando vale o cartório"
  },
  {
    slug: "acao-de-despejo-como-funciona",
    anchors: [
      "Ação de despejo e aluguel atrasado",
      "Despejo: o que diz a lei do inquilinato",
      "Aluguel: direitos de locador e inquilino"
    ],
    desc: "Prazos da ação de despejo e como se proteger"
  },
  // === Demais temas localizáveis ===
  {
    slug: "como-pedir-divorcio",
    anchors: [
      "Como pedir divórcio",
      "Divórcio: cartório ou Justiça",
      "Guia do divórcio: custos e prazos"
    ],
    desc: "Extrajudicial, judicial, custos e documentos"
  },
  {
    slug: "inss-negou-beneficio-o-que-fazer",
    anchors: [
      "INSS negou o benefício: o que fazer",
      "Benefício negado pelo INSS: próximos passos",
      "Recurso contra o INSS"
    ],
    desc: "Recurso administrativo e ação judicial"
  },
  {
    slug: "como-entrar-com-acao-no-juizado-do-consumidor",
    anchors: [
      "Ação no Juizado do Consumidor",
      "Como acionar o Juizado Especial",
      "Juizado do consumidor: passo a passo"
    ],
    desc: "Causas até 20 salários mínimos, sem custas iniciais"
  },
  {
    slug: "acordo-trabalhista-vale-a-pena",
    anchors: [
      "Acordo trabalhista: como avaliar",
      "Acordo trabalhista: o que observar",
      "Antes de assinar o acordo trabalhista"
    ],
    desc: "Como avaliar a proposta da empresa"
  }
];

export function guiasUteisForCity(
  citySlug: string,
  uf: string,
  limit = 6
): GuiaUtilLink[] {
  const cityParam = `${citySlug}-${uf.toLowerCase()}`;
  const top = GUIAS_UTEIS_POOL.slice(0, 6);
  const rest = GUIAS_UTEIS_POOL.slice(6);
  const h = cityHash(`${uf}:${citySlug}`);
  const nTop = Math.min(4, limit, top.length);
  const picked: typeof GUIAS_UTEIS_POOL = [];
  for (let i = 0; i < nTop; i++) picked.push(top[(h + i) % top.length]);
  for (let i = 0; i < limit - nTop && i < rest.length; i++) {
    picked.push(rest[(h + i) % rest.length]);
  }
  return picked.map((g) => ({
    href: `/blog/${g.slug}/em/${cityParam}`,
    label: g.anchors[cityHash(citySlug + g.slug) % g.anchors.length],
    desc: g.desc
  }));
}

/**
 * T13 — cidades pra bloco "Encontre advogado na sua cidade" em conteúdo
 * estático (artigos do blog, guias). Mistura capitais + cidades grandes
 * do interior (lista curada de 50 em lib/data/cidades-prioritarias.ts),
 * rotacionando por hash(seed) — cada artigo/guia linka um conjunto
 * diferente, determinístico entre builds.
 */
export function cidadesPrioritariasForContent(
  seed: string,
  limit = 8,
  capitalsShare = 5
): CidadePrioritaria[] {
  const all = getCidadesPrioritarias();
  const caps = all.filter((c) => c.tipo === "capital");
  const interior = all.filter((c) => c.tipo !== "capital");
  const h = cityHash(seed);
  const out: CidadePrioritaria[] = [];
  const nCaps = Math.min(capitalsShare, limit, caps.length);
  for (let i = 0; i < nCaps; i++) out.push(caps[(h + i) % caps.length]);
  for (let i = 0; i < limit - nCaps && i < interior.length; i++) {
    out.push(interior[(h + i) % interior.length]);
  }
  return out;
}

/**
 * Anchor rotacionado pra link conteúdo → cidade (mesma lógica do
 * neighborAnchor): 4 padrões por hash(seed+slug), estável entre builds.
 */
export function cityContentAnchor(
  seed: string,
  c: CidadePrioritaria,
  areaName?: string
): string {
  const area = areaName ? areaName.toLowerCase() : "";
  const patterns = area
    ? [
        `Advogado ${area} em ${c.nome_completo}`,
        `Advogados em ${c.nome_completo}`,
        `Advogado de ${area} em ${c.nome_completo}`,
        `Encontrar advogado em ${c.nome_completo}`
      ]
    : [
        `Advogado em ${c.nome_completo}`,
        `Advogados em ${c.nome_completo}`,
        `Encontrar advogado em ${c.nome_completo}`,
        `Profissionais em ${c.nome_completo}`
      ];
  return patterns[cityHash(seed + c.slug) % patterns.length];
}

/**
 * Modelos relacionados a um artigo — caminho inverso do mapeamento acima.
 * Usado no artigo do blog: "Documentos prontos pra esse tema".
 */
export function relatedTemplatesForArticle(
  article: Article,
  limit = 3
): Template[] {
  const out: Template[] = [];
  for (const [tmplSlug, articleSlugs] of Object.entries(TEMPLATE_TO_ARTICLE_SLUGS)) {
    if (articleSlugs.includes(article.slug)) {
      const t = TEMPLATES.find((tt) => tt.slug === tmplSlug);
      if (t) out.push(t);
      if (out.length >= limit) break;
    }
  }
  return out;
}
