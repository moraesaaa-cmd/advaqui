import { RELEASE_DATE } from "@/lib/seo/lastmod";
import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { getAllCities } from "@/lib/data/cities";

/**
 * Sitemap secundário — /tribunais/[uf]/[cidade].
 *
 * 5571 cidades IBGE = 5571 URLs (1 por cidade).
 * Cabe em 1 só arquivo (limite 50k URLs).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const cities = getAllCities();
  return cities.map((c) => ({
    url: `${base}/tribunais/${c.uf.toLowerCase()}/${c.slug}`,
    changeFrequency: "yearly",
    priority: c.isCapital ? 0.7 : 0.5,
    lastModified: RELEASE_DATE
  }));
}
