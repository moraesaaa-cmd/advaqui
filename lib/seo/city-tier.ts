/**
 * Classificação DETERMINÍSTICA de cidades em tiers para ordenação de sitemaps.
 *
 * NÃO remove nem esconde nada — todas as 5.571 cidades continuam presentes em
 * todos os sitemaps. O tier controla apenas a ORDEM (tier 1 primeiro) e ajuda
 * a decidir o lastmod (cidades com advogado real usam o updated_at mais
 * recente dos advogados da cidade).
 *
 * Tiers:
 *  - Tier 1 — capitais + cidades prioritárias curadas (lib/data/cidades-prioritarias)
 *             + cidades com advogado REAL cadastrado no Supabase.
 *  - Tier 2 — a cidade "líder" de cada microrregião IBGE, escolhida de forma
 *             estável por hash (FNV-1a) do par uf:slug — determinístico entre
 *             builds, sem depender de dados externos.
 *  - Tier 3 — todas as demais.
 *
 * A consulta ao Supabase é cacheada em memória de módulo com TTL de 1h, com
 * deduplicação de chamadas concorrentes, para não bombardear o banco quando
 * os 27 sitemaps por UF são gerados em sequência. Falha de rede/env ausente
 * degrada graciosamente: tier 1 fica só com capitais + prioritárias e o
 * lastmod cai no fallback (RELEASE_DATE), sem quebrar o sitemap.
 */
import { createAdminClient } from "@/lib/supabase/admin";
import { getAllCities, type City } from "@/lib/data/cities";
import { CIDADES_PRIORITARIAS_RAW } from "@/lib/data/cidades-prioritarias";

export type CityTier = 1 | 2 | 3;

/** Chave canônica de cidade: "UF:slug" (UF maiúscula). */
const cityKey = (uf: string, slug: string): string =>
  `${uf.toUpperCase()}:${slug}`;

// ---------------------------------------------------------------------------
// Dados vindos do Supabase (advogados reais) — cache de módulo com TTL 1h
// ---------------------------------------------------------------------------

type LawyerCityData = {
  /** Chaves "UF:slug" de cidades com pelo menos um advogado real visível. */
  citiesWithLawyer: Set<string>;
  /** max(updated_at) dos advogados de cada cidade. */
  lastmodByCity: Map<string, Date>;
};

const EMPTY_DATA: LawyerCityData = {
  citiesWithLawyer: new Set(),
  lastmodByCity: new Map()
};

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hora

let _cache: { data: LawyerCityData; fetchedAt: number } | null = null;
let _inflight: Promise<LawyerCityData> | null = null;

/** Mesma regra defensiva de lib/data/lawyers.ts — só esconde com sinal explícito. */
const HIDDEN_PAGE_STATUSES = new Set(["paused", "suspended"]);
const isPubliclyVisible = (row: {
  page_status?: string | null;
  is_public?: boolean | null;
}): boolean => {
  if (typeof row.page_status === "string" && HIDDEN_PAGE_STATUSES.has(row.page_status)) {
    return false;
  }
  if (row.is_public === false) return false;
  return true;
};

type LawyerCityRow = {
  uf?: string | null;
  city_slug?: string | null;
  target_uf?: string | null;
  target_city?: string | null;
  extra_cities?: Array<{ uf?: string; slug?: string }> | null;
  updated_at?: string | null;
  page_status?: string | null;
  is_public?: boolean | null;
};

async function fetchLawyerCityData(): Promise<LawyerCityData> {
  try {
    const supabase = createAdminClient({ noStore: true });
    const { data, error } = await supabase
      .from("lawyers")
      .select(
        "uf,city_slug,target_uf,target_city,extra_cities,updated_at,page_status,is_public"
      );
    if (error) {
      console.error("city-tier: erro ao buscar lawyers:", error.message);
      return EMPTY_DATA;
    }
    const citiesWithLawyer = new Set<string>();
    const lastmodByCity = new Map<string, Date>();
    for (const r of (data || []) as LawyerCityRow[]) {
      if (!isPubliclyVisible(r)) continue;
      const keys = new Set<string>();
      if (r.uf && r.city_slug) keys.add(cityKey(r.uf, r.city_slug));
      if (r.target_uf && r.target_city) keys.add(cityKey(r.target_uf, r.target_city));
      if (Array.isArray(r.extra_cities)) {
        for (const c of r.extra_cities) {
          if (c && typeof c.uf === "string" && typeof c.slug === "string") {
            keys.add(cityKey(c.uf, c.slug));
          }
        }
      }
      const updated = r.updated_at ? new Date(r.updated_at) : null;
      const validDate = updated && !Number.isNaN(updated.getTime()) ? updated : null;
      for (const k of keys) {
        citiesWithLawyer.add(k);
        if (validDate) {
          const prev = lastmodByCity.get(k);
          if (!prev || validDate.getTime() > prev.getTime()) {
            lastmodByCity.set(k, validDate);
          }
        }
      }
    }
    return { citiesWithLawyer, lastmodByCity };
  } catch (err) {
    // Env ausente (build local sem SUPABASE_SECRET_KEY) ou falha de rede —
    // degrada para conjunto vazio sem quebrar a geração do sitemap.
    console.error(
      "city-tier: Supabase indisponível, usando fallback vazio:",
      err instanceof Error ? err.message : err
    );
    return EMPTY_DATA;
  }
}

async function getLawyerCityData(): Promise<LawyerCityData> {
  const now = Date.now();
  if (_cache && now - _cache.fetchedAt < CACHE_TTL_MS) return _cache.data;
  if (_inflight) return _inflight;
  _inflight = fetchLawyerCityData()
    .then((data) => {
      _cache = { data, fetchedAt: Date.now() };
      return data;
    })
    .finally(() => {
      _inflight = null;
    });
  return _inflight;
}

// ---------------------------------------------------------------------------
// Cidades prioritárias + líderes de microrregião (estáticos, lazy)
// ---------------------------------------------------------------------------

let _prioritySet: Set<string> | null = null;
const prioritySet = (): Set<string> => {
  if (!_prioritySet) {
    _prioritySet = new Set(
      CIDADES_PRIORITARIAS_RAW.map((c) => cityKey(c.uf, c.slug))
    );
  }
  return _prioritySet;
};

/**
 * Hash FNV-1a 32-bit — estável entre builds/plataformas (só depende da string).
 */
const fnv1a = (str: string): number => {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
};

let _microLeaders: Map<number, string> | null = null;
/**
 * "Primeira cidade da microrregião em ordem de hash estável" — para cada
 * microId, a cidade cujo hash(uf:slug) é o menor (empate: menor cityKey).
 */
const microLeaders = (): Map<number, string> => {
  if (_microLeaders) return _microLeaders;
  const leaders = new Map<number, { key: string; hash: number }>();
  for (const c of getAllCities()) {
    if (c.microId == null) continue;
    const key = cityKey(c.uf, c.slug);
    const hash = fnv1a(key);
    const cur = leaders.get(c.microId);
    if (!cur || hash < cur.hash || (hash === cur.hash && key < cur.key)) {
      leaders.set(c.microId, { key, hash });
    }
  }
  _microLeaders = new Map(
    Array.from(leaders.entries(), ([id, v]) => [id, v.key])
  );
  return _microLeaders;
};

// ---------------------------------------------------------------------------
// API pública
// ---------------------------------------------------------------------------

export type CityTierData = {
  /** Tier determinístico da cidade (1, 2 ou 3). */
  tierOf: (city: City) => CityTier;
  /** max(updated_at) dos advogados da cidade, ou null se não houver dado real. */
  lastmodOf: (uf: string, slug: string) => Date | null;
};

/**
 * Carrega (com cache de 1h) os dados de advogados e devolve as funções de
 * classificação. Nunca lança — em caso de falha o tier 1 fica restrito a
 * capitais + prioritárias e lastmodOf devolve null (caller usa RELEASE_DATE).
 */
export async function getCityTierData(): Promise<CityTierData> {
  const lawyerData = await getLawyerCityData();
  const priority = prioritySet();
  const leaders = microLeaders();
  return {
    tierOf: (city: City): CityTier => {
      const key = cityKey(city.uf, city.slug);
      if (city.isCapital || priority.has(key) || lawyerData.citiesWithLawyer.has(key)) {
        return 1;
      }
      if (city.microId != null && leaders.get(city.microId) === key) return 2;
      return 3;
    },
    lastmodOf: (uf: string, slug: string): Date | null =>
      lawyerData.lastmodByCity.get(cityKey(uf, slug)) ?? null
  };
}

/**
 * Ordena uma lista de cidades por tier (1 → 2 → 3) preservando a ordem
 * original dentro de cada tier (sort estável). Não remove nenhum item.
 */
export function sortCitiesByTier(cities: City[], tierOf: (c: City) => CityTier): City[] {
  return cities.slice().sort((a, b) => tierOf(a) - tierOf(b));
}
