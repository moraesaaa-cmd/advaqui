import { NextResponse } from "next/server";
import { getAllCities } from "@/lib/data/cities";

/**
 * Endpoint server-side para busca de cidades.
 * Evita carregar 5.571 cidades no bundle JavaScript do cliente.
 *
 * Uso: /api/cities?q=campinas&limit=8
 * Retorna: [{name, slug, uf, isCapital}]
 *
 * Cache HTTP de 1 hora para reduzir requests repetidos.
 */
const normalize = (s: string): string =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();
  const limit = Math.min(20, Math.max(1, Number(url.searchParams.get("limit")) || 8));

  if (q.length < 2) {
    return NextResponse.json([], {
      headers: { "Cache-Control": "public, max-age=300" }
    });
  }

  const term = normalize(q);
  const cities = getAllCities();
  const results: Array<{ name: string; slug: string; uf: string; isCapital: boolean }> = [];

  // Prefere matches do início da palavra (mais relevantes), depois infix.
  for (const c of cities) {
    if (normalize(c.name).startsWith(term)) {
      results.push({ name: c.name, slug: c.slug, uf: c.uf, isCapital: c.isCapital });
      if (results.length >= limit) break;
    }
  }
  if (results.length < limit) {
    for (const c of cities) {
      const n = normalize(c.name);
      if (!n.startsWith(term) && n.includes(term)) {
        results.push({ name: c.name, slug: c.slug, uf: c.uf, isCapital: c.isCapital });
        if (results.length >= limit) break;
      }
    }
  }

  return NextResponse.json(results, {
    headers: { "Cache-Control": "public, max-age=3600, s-maxage=3600" }
  });
}
