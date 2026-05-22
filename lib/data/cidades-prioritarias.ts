/**
 * Cidades prioritárias para SEO programático.
 *
 * Lista curada com as 50 cidades de maior demanda jurídica no Brasil:
 *  - 27 capitais (cobrem todos os estados)
 *  - 23 cidades grandes do interior com mais de 250 mil habitantes ou
 *    importância regional reconhecida (poder judiciário, OAB seccional)
 *
 * Usada em /problemas-juridicos/[slug]/em/[cidade-uf] e em blocos de
 * "Encontre advogado na sua cidade". 50 cidades × 20 problemas = 1000 URLs
 * cauda longa com conteúdo local indexável.
 *
 * Cada entrada referencia um slug + UF que existe em lib/data/cities.ts —
 * findCity(uf, slug) confirma. Se o IBGE mudar nome/slug, o build quebra
 * cedo (não SSG silenciosamente errado).
 */
import { findCity, type City } from "./cities";

export type CidadePrioritaria = {
  uf: string;
  slug: string;
  /** Nome com UF — usado em title, H1, breadcrumb */
  nome_completo: string;
  /** Mostrar como ponto de interesse no Brasil (Norte, Nordeste...) */
  regiao: string;
  /** Indicador descritivo: capital ou interior */
  tipo: "capital" | "metropolitana" | "interior_relevante";
};

/**
 * Top 50 — capitais (27) + 23 cidades grandes ou estratégicas do interior.
 * Slugs conferem com lib/data/cities.ts (base IBGE).
 */
export const CIDADES_PRIORITARIAS_RAW: Array<Omit<CidadePrioritaria, "nome_completo" | "regiao" | "tipo">> = [
  // === Capitais (27) ===
  { uf: "SP", slug: "sao-paulo" },
  { uf: "RJ", slug: "rio-de-janeiro" },
  { uf: "MG", slug: "belo-horizonte" },
  { uf: "DF", slug: "brasilia" },
  { uf: "BA", slug: "salvador" },
  { uf: "CE", slug: "fortaleza" },
  { uf: "PR", slug: "curitiba" },
  { uf: "RS", slug: "porto-alegre" },
  { uf: "PE", slug: "recife" },
  { uf: "AM", slug: "manaus" },
  { uf: "PA", slug: "belem" },
  { uf: "GO", slug: "goiania" },
  { uf: "MA", slug: "sao-luis" },
  { uf: "ES", slug: "vitoria" },
  { uf: "SC", slug: "florianopolis" },
  { uf: "PB", slug: "joao-pessoa" },
  { uf: "RN", slug: "natal" },
  { uf: "MT", slug: "cuiaba" },
  { uf: "PI", slug: "teresina" },
  { uf: "AL", slug: "maceio" },
  { uf: "MS", slug: "campo-grande" },
  { uf: "SE", slug: "aracaju" },
  { uf: "RO", slug: "porto-velho" },
  { uf: "TO", slug: "palmas" },
  { uf: "AC", slug: "rio-branco" },
  { uf: "AP", slug: "macapa" },
  { uf: "RR", slug: "boa-vista" },

  // === Cidades grandes do interior / metropolitanas (23) ===
  // São Paulo (interior + grande SP)
  { uf: "SP", slug: "guarulhos" },
  { uf: "SP", slug: "campinas" },
  { uf: "SP", slug: "sao-bernardo-do-campo" },
  { uf: "SP", slug: "santo-andre" },
  { uf: "SP", slug: "sao-jose-dos-campos" },
  { uf: "SP", slug: "ribeirao-preto" },
  { uf: "SP", slug: "sorocaba" },
  { uf: "SP", slug: "santos" },
  { uf: "SP", slug: "osasco" },

  // Rio de Janeiro (interior + grande RJ)
  { uf: "RJ", slug: "niteroi" },
  { uf: "RJ", slug: "nova-iguacu" },
  { uf: "RJ", slug: "duque-de-caxias" },
  { uf: "RJ", slug: "sao-goncalo" },

  // Minas Gerais
  { uf: "MG", slug: "uberlandia" },
  { uf: "MG", slug: "contagem" },
  { uf: "MG", slug: "juiz-de-fora" },
  { uf: "MG", slug: "betim" },

  // Sul
  { uf: "RS", slug: "caxias-do-sul" },
  { uf: "RS", slug: "pelotas" },
  { uf: "PR", slug: "londrina" },
  { uf: "PR", slug: "maringa" },
  { uf: "SC", slug: "joinville" },
  { uf: "SC", slug: "blumenau" }
];

const REGIOES: Record<string, string> = {
  AC: "Norte",
  AM: "Norte",
  AP: "Norte",
  PA: "Norte",
  RO: "Norte",
  RR: "Norte",
  TO: "Norte",
  AL: "Nordeste",
  BA: "Nordeste",
  CE: "Nordeste",
  MA: "Nordeste",
  PB: "Nordeste",
  PE: "Nordeste",
  PI: "Nordeste",
  RN: "Nordeste",
  SE: "Nordeste",
  DF: "Centro-Oeste",
  GO: "Centro-Oeste",
  MS: "Centro-Oeste",
  MT: "Centro-Oeste",
  ES: "Sudeste",
  MG: "Sudeste",
  RJ: "Sudeste",
  SP: "Sudeste",
  PR: "Sul",
  RS: "Sul",
  SC: "Sul"
};

const CAPITAIS_SLUGS = new Set<string>([
  "rio-branco",
  "maceio",
  "manaus",
  "macapa",
  "salvador",
  "fortaleza",
  "brasilia",
  "vitoria",
  "goiania",
  "sao-luis",
  "belo-horizonte",
  "campo-grande",
  "cuiaba",
  "belem",
  "joao-pessoa",
  "recife",
  "teresina",
  "curitiba",
  "rio-de-janeiro",
  "natal",
  "porto-velho",
  "boa-vista",
  "porto-alegre",
  "florianopolis",
  "aracaju",
  "sao-paulo",
  "palmas"
]);

const SAO_GRANDE = new Set(["guarulhos", "sao-bernardo-do-campo", "santo-andre", "osasco"]);
const RIO_GRANDE = new Set(["niteroi", "nova-iguacu", "duque-de-caxias", "sao-goncalo"]);
const MINAS_METRO = new Set(["contagem", "betim"]);

const tipoDe = (slug: string): CidadePrioritaria["tipo"] => {
  if (CAPITAIS_SLUGS.has(slug)) return "capital";
  if (SAO_GRANDE.has(slug) || RIO_GRANDE.has(slug) || MINAS_METRO.has(slug))
    return "metropolitana";
  return "interior_relevante";
};

/**
 * Resolve as 50 cidades passando pelo cities.ts (IBGE) — pega o nome bonito.
 * Se algum slug não bater (o IBGE atualizou), filtra e loga em dev.
 */
let _resolved: CidadePrioritaria[] | null = null;
export function getCidadesPrioritarias(): CidadePrioritaria[] {
  if (_resolved) return _resolved;
  const out: CidadePrioritaria[] = [];
  for (const c of CIDADES_PRIORITARIAS_RAW) {
    const city: City | undefined = findCity(c.uf, c.slug);
    if (!city) {
      // Slug inválido — log e pula. Não quebra o build.
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.warn(
          `[cidades-prioritarias] slug não encontrado em cities.json: ${c.uf}/${c.slug}`
        );
      }
      continue;
    }
    out.push({
      uf: c.uf,
      slug: c.slug,
      nome_completo: `${city.name}, ${c.uf}`,
      regiao: REGIOES[c.uf] || "",
      tipo: tipoDe(c.slug)
    });
  }
  _resolved = out;
  return out;
}

export function getCidadePrioritaria(
  uf: string,
  slug: string
): CidadePrioritaria | undefined {
  return getCidadesPrioritarias().find(
    (c) => c.uf.toLowerCase() === uf.toLowerCase() && c.slug === slug
  );
}

/** Mesma região, sem incluir a própria cidade — usado em "cidades próximas" */
export function cidadesPrioritariasMesmaRegiao(
  uf: string,
  excluindoSlug?: string,
  limit = 8
): CidadePrioritaria[] {
  const regiao = REGIOES[uf.toUpperCase()];
  if (!regiao) return [];
  return getCidadesPrioritarias()
    .filter(
      (c) =>
        c.regiao === regiao && !(c.uf === uf && c.slug === excluindoSlug)
    )
    .slice(0, limit);
}

/** Top N capitais — útil para blocos compactos */
export function topCapitais(limit = 12): CidadePrioritaria[] {
  return getCidadesPrioritarias().filter((c) => c.tipo === "capital").slice(0, limit);
}
