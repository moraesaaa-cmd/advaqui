import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { STATES } from "@/lib/data/states";
import { citiesByUf } from "@/lib/data/cities";

/**
 * Sitemap de /para-advogados/[uf]/[cidade] — 1 arquivo por UF (27 no total),
 * cada um listando todas as cidades daquele estado. Servido em
 * /sitemap-para-advogados-cidades/sitemap/[id].xml e anunciado no robots.ts.
 * Cobre as 5.571 cidades, bem abaixo do limite de 50.000 URLs por sitemap.
 */
export async function generateSitemaps() {
  return STATES.map((_, idx) => ({ id: idx }));
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const st = STATES[id];
  if (!st) return [];
  const cities = citiesByUf(st.uf);
  const uf = st.uf.toLowerCase();
  return cities.map((c) => ({
    url: `${base}/para-advogados/${uf}/${c.slug}`,
    changeFrequency: "monthly",
    priority: c.isCapital ? 0.7 : 0.5
  }));
}
