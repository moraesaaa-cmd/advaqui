import { NextResponse } from "next/server";
import { getAllCities } from "@/lib/data/cities";
import { getLawyerCountsForCities } from "@/lib/data/lawyers";

/**
 * Endpoint server-side para busca de cidades.
 * Evita carregar 5.571 cidades no bundle JavaScript do cliente.
 *
 * Uso: /api/cities?q=campinas&limit=8
 * Retorna: [{name, slug, uf, isCapital}]
 *
 * Cache HTTP de 1 hora para reduzir requests repetidos.
 */
/**
 * Normalização para busca tolerante:
 * - Lowercase
 * - Remove diacríticos (acentos)
 * - Substitui hífens e pontuação por espaços (para "Mâncio-Lima" casar com "Mâncio Lima")
 * - Colapsa múltiplos espaços
 *
 * Exemplos:
 *   "São João del-Rei" → "sao joao del rei"
 *   "sao-joao del rei"  → "sao joao del rei"  ✓ casam
 */
const normalize = (s: string): string =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[-_'/.,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();
  const ufFilter = (url.searchParams.get("uf") || "").trim().toUpperCase();
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit")) || 8));

  // Quando vem UF mas q vazio, retorna até `limit` cidades do estado
  // (usado por seletores admin).
  if (q.length < 2 && !ufFilter) {
    return NextResponse.json([], {
      headers: { "Cache-Control": "public, max-age=300" }
    });
  }

  const term = q.length >= 2 ? normalize(q) : "";
  const cities = getAllCities();
  const results: Array<{ name: string; slug: string; uf: string; isCapital: boolean }> = [];

  const matchesUf = (c: { uf: string }) => !ufFilter || c.uf === ufFilter;

  if (!term) {
    // Sem termo de busca, só filtra por UF e devolve até limit (alfabético).
    const filtered = cities.filter(matchesUf).slice(0, limit);
    return NextResponse.json(
      filtered.map((c) => ({ name: c.name, slug: c.slug, uf: c.uf, isCapital: c.isCapital })),
      { headers: { "Cache-Control": "public, max-age=3600, s-maxage=3600" } }
    );
  }

  const prefixCapitals: typeof results = [];
  const prefixOther: typeof results = [];
  const infixCapitals: typeof results = [];
  const infixOther: typeof results = [];

  for (const c of cities) {
    if (!matchesUf(c)) continue;
    const n = normalize(c.name);
    if (n.startsWith(term)) {
      (c.isCapital ? prefixCapitals : prefixOther).push({
        name: c.name, slug: c.slug, uf: c.uf, isCapital: c.isCapital
      });
    } else if (n.includes(term)) {
      (c.isCapital ? infixCapitals : infixOther).push({
        name: c.name, slug: c.slug, uf: c.uf, isCapital: c.isCapital
      });
    }
  }

  const sorted = [...prefixCapitals, ...prefixOther, ...infixCapitals, ...infixOther].slice(0, limit);

  let enriched = sorted;
  try {
    // Mesma regra de contagem do diretório (city_slug/target/extra_cities,
    // por SLUG, só perfis visíveis) — a versão anterior consultava apenas
    // target_city comparando slug com nome acentuado e zerava tudo.
    const countMap = await getLawyerCountsForCities(
      sorted.map((c) => ({ uf: c.uf, slug: c.slug }))
    );
    enriched = sorted.map((c) => ({
      ...c,
      lawyerCount: countMap[`${c.uf.toUpperCase()}:${c.slug.toLowerCase()}`] || 0,
    }));
  } catch {}

  return NextResponse.json(enriched, {
    // 10 min: contagem muda quando advogado se cadastra — 1h prendia o valor.
    headers: { "Cache-Control": "public, max-age=600, s-maxage=600" }
  });
}
