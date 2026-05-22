import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { SPECIALTIES } from "@/lib/data/specialties";
import { getAllCities } from "@/lib/data/cities";

/**
 * Sitemap secundário — /advogados-de/[area]/em/[cidade-uf].
 *
 * 1 sitemap por especialidade × 5571 cidades IBGE = 15 sitemaps de ~5571
 * URLs cada. Total: 83.565 URLs cauda longa indexáveis.
 */
export async function generateSitemaps() {
  return SPECIALTIES.map((_, idx) => ({ id: idx }));
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const sp = SPECIALTIES[id];
  if (!sp) return [];
  const cities = getAllCities();
  const now = new Date();
  return cities.map((c) => ({
    url: `${base}/advogados-de/${sp.slug}/em/${c.slug}-${c.uf.toLowerCase()}`,
    changeFrequency: "weekly",
    priority: c.isCapital ? 0.7 : 0.55,
    lastModified: now
  }));
}
