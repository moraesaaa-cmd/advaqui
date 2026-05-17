/**
 * Base de cidades importada da API oficial do IBGE.
 * Fonte — https://servicodados.ibge.gov.br/api/v1/localidades/municipios
 * Total — 5.571 municípios brasileiros (todos os 27 estados + DF).
 *
 * O arquivo cru fica em `data/cities.json` (raiz do projeto). Este módulo expõe:
 *  - tipo `City` tipado
 *  - função `getAllCities` que retorna tudo
 *  - função `findCity(uf, slug)` para resolver rotas
 *  - função `citiesByUf(uf)` para listas
 *  - função `getSsgCityParams()` que devolve a lista de cidades a serem pré-geradas no build
 *  - `allCityRoutes()` lista todas as 5.571 URLs (usado pelo sitemap)
 *
 * Para atualizar a base no futuro:
 *   1. Rode `node scripts/import-ibge.mjs` (busca a API IBGE)
 *   2. O script regenera `data/cities.json` automaticamente
 *   3. `npm run validate:cities` confirma a integridade
 */
import raw from "@/data/cities.json";

export type City = {
  id: number;
  name: string;
  slug: string;
  uf: string;
  state: string;
  region: string;
  isCapital: boolean;
};

const STATE_NAMES: Record<string, string> = {
  AC: "Acre",
  AL: "Alagoas",
  AM: "Amazonas",
  AP: "Amapá",
  BA: "Bahia",
  CE: "Ceará",
  DF: "Distrito Federal",
  ES: "Espírito Santo",
  GO: "Goiás",
  MA: "Maranhão",
  MG: "Minas Gerais",
  MS: "Mato Grosso do Sul",
  MT: "Mato Grosso",
  PA: "Pará",
  PB: "Paraíba",
  PE: "Pernambuco",
  PI: "Piauí",
  PR: "Paraná",
  RJ: "Rio de Janeiro",
  RN: "Rio Grande do Norte",
  RO: "Rondônia",
  RR: "Roraima",
  RS: "Rio Grande do Sul",
  SC: "Santa Catarina",
  SE: "Sergipe",
  SP: "São Paulo",
  TO: "Tocantins"
};

const STATE_REGIONS: Record<string, string> = {
  AC: "Norte", AM: "Norte", AP: "Norte", PA: "Norte", RO: "Norte", RR: "Norte", TO: "Norte",
  AL: "Nordeste", BA: "Nordeste", CE: "Nordeste", MA: "Nordeste", PB: "Nordeste",
  PE: "Nordeste", PI: "Nordeste", RN: "Nordeste", SE: "Nordeste",
  DF: "Centro-Oeste", GO: "Centro-Oeste", MS: "Centro-Oeste", MT: "Centro-Oeste",
  ES: "Sudeste", MG: "Sudeste", RJ: "Sudeste", SP: "Sudeste",
  PR: "Sul", RS: "Sul", SC: "Sul"
};

const CAPITAL_SLUGS: Record<string, string> = {
  AC: "rio-branco",
  AL: "maceio",
  AM: "manaus",
  AP: "macapa",
  BA: "salvador",
  CE: "fortaleza",
  DF: "brasilia",
  ES: "vitoria",
  GO: "goiania",
  MA: "sao-luis",
  MG: "belo-horizonte",
  MS: "campo-grande",
  MT: "cuiaba",
  PA: "belem",
  PB: "joao-pessoa",
  PE: "recife",
  PI: "teresina",
  PR: "curitiba",
  RJ: "rio-de-janeiro",
  RN: "natal",
  RO: "porto-velho",
  RR: "boa-vista",
  RS: "porto-alegre",
  SC: "florianopolis",
  SE: "aracaju",
  SP: "sao-paulo",
  TO: "palmas"
};

type RawCity = { i: number; n: string; s: string; u: string };
const RAW = raw as ReadonlyArray<RawCity>;

const toCity = (r: RawCity): City => ({
  id: r.i,
  name: r.n,
  slug: r.s,
  uf: r.u,
  state: STATE_NAMES[r.u] || r.u,
  region: STATE_REGIONS[r.u] || "",
  isCapital: CAPITAL_SLUGS[r.u] === r.s
});

let _all: City[] | null = null;
const all = (): City[] => {
  if (!_all) _all = RAW.map(toCity);
  return _all;
};

const _byUf = new Map<string, City[]>();
export const citiesByUf = (uf: string): City[] => {
  const key = uf.toUpperCase();
  let list = _byUf.get(key);
  if (!list) {
    list = all().filter((c) => c.uf === key);
    _byUf.set(key, list);
  }
  return list;
};

const _index = new Map<string, City>();
export const findCity = (uf: string, slug: string): City | undefined => {
  const key = `${uf.toUpperCase()}:${slug}`;
  let c = _index.get(key);
  if (c) return c;
  c = all().find((x) => x.uf === uf.toUpperCase() && x.slug === slug);
  if (c) _index.set(key, c);
  return c;
};

export const getAllCities = (): City[] => all();

export const totalCityCount = (): number => RAW.length;

/**
 * Cidades pré-geradas no build (SSG).
 * Regra — capital sempre + todas as cidades de estados com ≤200 municípios
 *         + as 200 primeiras alfabeticamente nos estados maiores.
 *
 * As demais cidades são geradas sob demanda (ISR) no primeiro acesso e cacheadas
 * conforme `revalidate` definido nas rotas. Todas as 5.571 cidades têm URL pública
 * indexável e aparecem no sitemap — não há cidades órfãs.
 */
const SSG_SOFT_CAP = 200;
export const getSsgCityParams = (): Array<{ uf: string; cidade: string }> => {
  const out: Array<{ uf: string; cidade: string }> = [];
  const byUf = new Map<string, City[]>();
  for (const c of all()) {
    const list = byUf.get(c.uf) || [];
    list.push(c);
    byUf.set(c.uf, list);
  }
  for (const [uf, list] of byUf.entries()) {
    const sorted = list.slice().sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    const chosen = new Set<string>();
    const capital = CAPITAL_SLUGS[uf];
    if (capital) chosen.add(capital);
    if (sorted.length <= SSG_SOFT_CAP) {
      for (const c of sorted) chosen.add(c.slug);
    } else {
      for (let i = 0; i < SSG_SOFT_CAP; i++) chosen.add(sorted[i].slug);
      if (capital) chosen.add(capital);
    }
    for (const slug of chosen) {
      out.push({ uf: uf.toLowerCase(), cidade: slug });
    }
  }
  return out;
};

export const allCityRoutes = (): Array<{ uf: string; cidade: string }> =>
  all().map((c) => ({ uf: c.uf.toLowerCase(), cidade: c.slug }));

export const findCapital = (uf: string): City | undefined => {
  const slug = CAPITAL_SLUGS[uf.toUpperCase()];
  if (!slug) return undefined;
  return findCity(uf, slug);
};

/**
 * Export legado mantido para compatibilidade com SearchBox, sitemap antigo,
 * cadastro e busca. Equivale a `getAllCities()`. Não usar em código novo —
 * prefira `getAllCities()`, `citiesByUf(uf)` ou `findCity(uf, slug)`.
 */
export const CITIES: ReadonlyArray<City> = all();

/**
 * Cidades próximas (mesmo estado, vizinhas alfabeticamente).
 * Não é proximidade geográfica real — é fallback rápido para linkagem interna
 * em páginas de cidade sem advogado. Uma versão futura pode usar lat/long.
 */
export const nearbyCities = (city: City, limit = 8): City[] => {
  const list = citiesByUf(city.uf);
  const idx = list.findIndex((c) => c.slug === city.slug);
  if (idx < 0) return list.slice(0, limit);
  const before = list.slice(Math.max(0, idx - limit / 2), idx);
  const after = list.slice(idx + 1, idx + 1 + limit);
  const around = [...before, ...after].slice(0, limit);
  return around;
};
