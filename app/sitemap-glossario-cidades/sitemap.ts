import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { GLOSSARIO } from "@/lib/data/glossario";
import { getAllCities } from "@/lib/data/cities";

/**
 * Sitemap secundário — /glossario/[slug]/em/[cidade-uf].
 *
 * 1 sitemap por termo × 5571 cidades = 20 sitemaps × 5571 = 111.420 URLs.
 */
export async function generateSitemaps() {
  return GLOSSARIO.map((_, idx) => ({ id: idx }));
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const termo = GLOSSARIO[id];
  if (!termo) return [];
  const cities = getAllCities();
  const lastMod = termo.atualizado_em ? new Date(termo.atualizado_em) : new Date();
  return cities.map((c) => ({
    url: `${base}/glossario/${termo.slug}/em/${c.slug}-${c.uf.toLowerCase()}`,
    changeFrequency: "monthly",
    priority: c.isCapital ? 0.6 : 0.5,
    lastModified: lastMod
  }));
}
