import { RELEASE_DATE } from "@/lib/seo/lastmod";
import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { STATES } from "@/lib/data/states";
import { citiesByUf } from "@/lib/data/cities";
import { SPECIALTIES } from "@/lib/data/specialties";
import { getCityTierData, sortCitiesByTier } from "@/lib/seo/city-tier";

/**
 * Sitemap secundário — uma URL por combinação cidade × especialidade, dividido por UF.
 * Total — ~83.565 URLs (5.571 cidades × 15 especialidades), distribuídas em 27 sitemaps.
 * SP é o maior (~9.675 URLs); o menor é DF (~15 URLs). Todos abaixo do limite
 * de 50.000 URLs por sitemap definido pelo protocolo.
 *
 * TODAS as combinações continuam presentes — nenhuma URL é removida. Apenas
 * a ORDEM muda: cidades tier 1 primeiro, depois tier 2, depois tier 3 (ver
 * lib/seo/city-tier.ts). Cidades com advogado real usam lastmod =
 * max(updated_at) dos advogados; as demais mantêm RELEASE_DATE.
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
  const out: MetadataRoute.Sitemap = [];
  for (const c of cities) {
    const lastmod = lastmodOf(st.uf, c.slug) ?? RELEASE_DATE;
    for (const sp of SPECIALTIES) {
      out.push({
        url: `${base}/advogados/${st.uf.toLowerCase()}/${c.slug}/${sp.slug}`,
        changeFrequency: "weekly",
        priority: c.isCapital ? 0.6 : 0.5,
        lastModified: lastmod
      });
    }
  }
  return out;
}
