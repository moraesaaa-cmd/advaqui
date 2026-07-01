import { RELEASE_DATE } from "@/lib/seo/lastmod";
import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { TEMAS_STF } from "@/lib/data/jurisprudencia-temas-stf";
import { getAllCities } from "@/lib/data/cities";

/**
 * Sitemap secundário — /jurisprudencia/stf/tema/[slug]/em/[cidade-uf].
 *
 * 10 temas STF × 5571 cidades IBGE = 55.710 URLs.
 */
export async function generateSitemaps() {
  return TEMAS_STF.map((_, idx) => ({ id: idx }));
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const tema = TEMAS_STF[id];
  if (!tema) return [];
  const cities = getAllCities();
  return cities.map((c) => ({
    url: `${base}/jurisprudencia/stf/tema/${tema.slug}/em/${c.slug}-${c.uf.toLowerCase()}`,
    changeFrequency: "monthly",
    priority: c.isCapital ? 0.6 : 0.4,
    lastModified: RELEASE_DATE
  }));
}
