import { RELEASE_DATE } from "@/lib/seo/lastmod";
import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { STATES } from "@/lib/data/states";
import { citiesByUf } from "@/lib/data/cities";
import { getCityTierData, sortCitiesByTier } from "@/lib/seo/city-tier";

/**
 * Sitemap secundário — uma URL por cidade brasileira, dividido por UF.
 * Cada UF gera um sitemap próprio (`/sitemap-cidades/0.xml` ... `/26.xml`).
 *
 * Total — 5.571 URLs distribuídas em 27 sitemaps. Garante que o Google
 * descubra todas as páginas de cidade, mesmo aquelas geradas via ISR.
 *
 * TODAS as cidades continuam presentes — nenhuma URL é removida. Apenas a
 * ORDEM muda: tier 1 (capitais, prioritárias, cidades com advogado real)
 * vem primeiro, depois tier 2 (líderes de microrregião), depois tier 3.
 * Cidades com advogado real usam lastmod = max(updated_at) dos advogados;
 * as demais mantêm o fallback estável RELEASE_DATE.
 */
export async function generateSitemaps() {
  return STATES.map((_, idx) => ({ id: idx }));
}

export default async function sitemap({
  id
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url.replace(/\/$/, "");
  const st = STATES[id];
  if (!st) return [];
  const { tierOf, lastmodOf } = await getCityTierData();
  const cities = sortCitiesByTier(citiesByUf(st.uf), tierOf);
  return cities.map((c) => ({
    url: `${base}/advogados/${st.uf.toLowerCase()}/${c.slug}`,
    changeFrequency: "weekly",
    priority: c.isCapital ? 0.7 : 0.6,
    lastModified: lastmodOf(st.uf, c.slug) ?? RELEASE_DATE
  }));
}
