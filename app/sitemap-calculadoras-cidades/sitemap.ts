import { RELEASE_DATE } from "@/lib/seo/lastmod";
import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { CALCULADORAS } from "@/lib/data/calculadoras";
import { getAllCities } from "@/lib/data/cities";

/**
 * Sitemap secundário — /calculadoras/[slug]/em/[cidade-uf].
 *
 * 8 calculadoras × 5571 cidades IBGE = 44.568 URLs.
 */
export async function generateSitemaps() {
  return CALCULADORAS.map((_, idx) => ({ id: idx }));
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const calc = CALCULADORAS[id];
  if (!calc) return [];
  const cities = getAllCities();
  return cities.map((c) => ({
    url: `${base}/calculadoras/${calc.slug}/em/${c.slug}-${c.uf.toLowerCase()}`,
    changeFrequency: "monthly",
    priority: c.isCapital ? 0.65 : 0.5,
    lastModified: RELEASE_DATE
  }));
}
