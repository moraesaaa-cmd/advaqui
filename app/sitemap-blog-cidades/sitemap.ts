import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { getArtigosLocalizaveis } from "@/lib/data/articles-cidades";
import { getAllCities } from "@/lib/data/cities";

/**
 * Sitemap secundário — /blog/[slug]/em/[cidade-uf].
 *
 * 1 sitemap por artigo da allow-list × 5571 cidades IBGE.
 * 20 artigos × 5571 = 111.420 URLs.
 *
 * Quando a allow-list crescer, este sitemap cresce automaticamente.
 */
export async function generateSitemaps() {
  return getArtigosLocalizaveis().map((_, idx) => ({ id: idx }));
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const article = getArtigosLocalizaveis()[id];
  if (!article) return [];
  const cities = getAllCities();
  const lastMod = article.updatedAt
    ? new Date(article.updatedAt)
    : new Date(article.publishedAt);
  return cities.map((c) => ({
    url: `${base}/blog/${article.slug}/em/${c.slug}-${c.uf.toLowerCase()}`,
    changeFrequency: "monthly",
    priority: c.isCapital ? 0.7 : 0.55,
    lastModified: lastMod
  }));
}
