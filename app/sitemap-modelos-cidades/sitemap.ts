import { RELEASE_DATE } from "@/lib/seo/lastmod";
import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { getAllTemplates } from "@/lib/data/templates-docs";
import { getAllCities } from "@/lib/data/cities";

/**
 * Sitemap secundário — /modelos/[slug]/em/[cidade-uf].
 *
 * 1 sitemap por modelo × 5571 cidades IBGE.
 * 20 modelos × 5571 = 111.420 URLs.
 *
 * Quando adicionarmos novos modelos em templates-docs.ts, este sitemap
 * cresce automaticamente.
 */
export async function generateSitemaps() {
  return getAllTemplates().map((_, idx) => ({ id: idx }));
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const templates = getAllTemplates();
  const tpl = templates[id];
  if (!tpl) return [];
  const cities = getAllCities();
  return cities.map((c) => ({
    url: `${base}/modelos/${tpl.slug}/em/${c.slug}-${c.uf.toLowerCase()}`,
    changeFrequency: "monthly",
    priority: c.isCapital ? 0.7 : 0.55,
    lastModified: RELEASE_DATE
  }));
}
