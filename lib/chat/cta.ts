/**
 * Resolução SERVER-SIDE do link final (CTA) do chat de triagem.
 *
 * O modelo de linguagem devolve área/cidade/uf em texto livre — este módulo
 * valida tudo contra as fontes reais do site (SPECIALTIES e data/cities.json)
 * e NUNCA gera um link quebrado. Cascata de fallback:
 *
 *   1. área trânsito/multa + cidade válida → /recurso-de-multa/{uf}/{cidade}
 *      (família de páginas que existe para todas as cidades)
 *   2. área trânsito/multa sem cidade      → /recurso-de-multa
 *   3. especialidade válida + cidade válida → /advogados/{uf}/{cidade}/{slug}
 *   4. só cidade válida                     → /advogados/{uf}/{cidade}
 *   5. só UF válida                         → /advogados/{uf}
 *   6. nada resolvido                       → /advogados
 *
 * Server-only: importa data/cities.json (5.571 municípios) — não usar em
 * Client Components.
 */
import { SPECIALTY_SLUGS } from "@/lib/data/specialties";
import { findCity, getAllCities } from "@/lib/data/cities";

export type TriageCtaInput = {
  area?: string;
  cidade?: string;
  uf?: string;
};

export type CtaResult = {
  ctaUrl: string;
  ctaLabel: string;
};

const DEFAULT_LABEL = "Encontrar advogado";
const MULTA_LABEL = "Ver como recorrer da multa";

const UFS = new Set([
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
]);

/** Remove acentos ("previdenciário" → "previdenciario"). */
function stripAccents(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/**
 * Normaliza a área vinda da IA: minúsculas, sem acentos, sem as palavras
 * "direito" e conectivos (de/do/da/dos/das).
 * "Direito do Consumidor" → "consumidor"; "Direito de Família" → "familia".
 */
function normalizeArea(raw: string): string {
  const lowered = stripAccents(raw.toLowerCase().trim());
  return lowered
    .split(/[\s/]+/)
    .filter((w) => w && !["direito", "direitos", "de", "do", "da", "dos", "das", "e"].includes(w))
    .join(" ")
    .trim();
}

/**
 * Aliases → slugs REAIS de lib/data/specialties.ts.
 * Chaves já normalizadas (minúsculas, sem acento, sem conectivos).
 * Áreas do prompt sem página própria são mapeadas para a página mais próxima
 * (saúde → consumidor; contratual → civil; inventário/sucessões → família).
 */
const AREA_ALIASES: Record<string, string> = {
  // Trabalhista
  trabalhista: "trabalhista",
  trabalho: "trabalhista",
  trabalhador: "trabalhista",
  clt: "trabalhista",
  // Criminal
  criminal: "criminal",
  penal: "criminal",
  criminalista: "criminal",
  // Família
  familia: "familia",
  familiar: "familia",
  inventario: "familia",
  sucessoes: "familia",
  sucessao: "familia",
  // Previdenciário
  previdenciario: "previdenciario",
  previdenciaria: "previdenciario",
  previdencia: "previdenciario",
  inss: "previdenciario",
  aposentadoria: "previdenciario",
  beneficio: "previdenciario",
  // Consumidor (inclui saúde — sem página própria, o vínculo típico é consumerista)
  consumidor: "consumidor",
  consumo: "consumidor",
  saude: "consumidor",
  "plano saude": "consumidor",
  // Imobiliário
  imobiliario: "imobiliario",
  imobiliaria: "imobiliario",
  imovel: "imobiliario",
  imoveis: "imobiliario",
  // Tributário
  tributario: "tributario",
  tributaria: "tributario",
  tributos: "tributario",
  tributo: "tributario",
  impostos: "tributario",
  imposto: "tributario",
  fiscal: "tributario",
  // Empresarial
  empresarial: "empresarial",
  empresa: "empresarial",
  societario: "empresarial",
  // Civil (inclui contratual — sem página própria)
  civil: "civil",
  contratual: "civil",
  contratos: "civil",
  contrato: "civil",
  // Demais especialidades com página própria
  administrativo: "administrativo",
  ambiental: "ambiental",
  digital: "digital",
  internet: "digital",
  eleitoral: "eleitoral",
  internacional: "internacional",
  militar: "militar"
};

/** Área normalizada é da família trânsito/multa? */
function isTransitArea(normalized: string): boolean {
  return /(^|\s)(transito|multa|multas)(\s|$)/.test(normalized);
}

/**
 * Resolve a área para um slug que EXISTE em lib/data/specialties.ts.
 * Retorna null quando não há página correspondente (ex.: "outro").
 */
function resolveAreaSlug(normalized: string): string | null {
  if (!normalized) return null;
  const candidate = AREA_ALIASES[normalized] || normalized.replace(/\s+/g, "-");
  return SPECIALTY_SLUGS.includes(candidate) ? candidate : null;
}

/** Slug de cidade com a mesma normalização usada nas rotas do site. */
function toCitySlug(name: string): string {
  return stripAccents(name.toLowerCase())
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Resolve cidade+UF contra data/cities.json (via helpers de lib/data/cities).
 * - UF válida + cidade encontrada nela → usa direto.
 * - UF ausente/inválida (ou cidade não encontrada nela): se a cidade existir
 *   em EXATAMENTE 1 UF no Brasil, deduz a UF; ambígua → null (sem segmento).
 */
function resolveCity(
  cidade: string | undefined,
  uf: string | undefined
): { uf: string; slug: string } | null {
  const slug = toCitySlug(cidade || "");
  if (!slug) return null;

  const ufNorm = (uf || "").trim().toUpperCase();
  if (UFS.has(ufNorm)) {
    const city = findCity(ufNorm, slug);
    if (city) return { uf: city.uf.toLowerCase(), slug: city.slug };
  }

  const matches = getAllCities().filter((c) => c.slug === slug);
  if (matches.length === 1) {
    return { uf: matches[0].uf.toLowerCase(), slug: matches[0].slug };
  }
  return null;
}

/**
 * Monta o CTA final do chat de triagem — sempre um link que existe.
 */
export function resolveCtaUrl(triage: TriageCtaInput): CtaResult {
  const normalizedArea = normalizeArea(triage.area || "");
  const city = resolveCity(triage.cidade, triage.uf);

  // Caso especial: trânsito/multa → família /recurso-de-multa (existe para
  // todas as cidades; a página de advogados não tem slug "transito").
  if (isTransitArea(normalizedArea)) {
    return {
      ctaUrl: city ? `/recurso-de-multa/${city.uf}/${city.slug}` : "/recurso-de-multa",
      ctaLabel: MULTA_LABEL
    };
  }

  const areaSlug = resolveAreaSlug(normalizedArea);

  if (city && areaSlug) {
    return { ctaUrl: `/advogados/${city.uf}/${city.slug}/${areaSlug}`, ctaLabel: DEFAULT_LABEL };
  }
  if (city) {
    return { ctaUrl: `/advogados/${city.uf}/${city.slug}`, ctaLabel: DEFAULT_LABEL };
  }

  const ufNorm = (triage.uf || "").trim().toUpperCase();
  if (UFS.has(ufNorm)) {
    return { ctaUrl: `/advogados/${ufNorm.toLowerCase()}`, ctaLabel: DEFAULT_LABEL };
  }

  return { ctaUrl: "/advogados", ctaLabel: DEFAULT_LABEL };
}
