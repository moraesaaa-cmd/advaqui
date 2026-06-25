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
import { citiesByUf, type City } from "@/lib/data/cities";
import { ARTICLES, type Article } from "@/lib/data/articles";
import { TEMPLATES, type Template } from "@/lib/data/templates-docs";

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
