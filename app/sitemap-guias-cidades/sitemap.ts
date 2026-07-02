import { RELEASE_DATE } from "@/lib/seo/lastmod";
import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { GUIAS } from "@/lib/data/guias";
import { getAllCities } from "@/lib/data/cities";

/**
 * Sitemap secundário — /guias/[slug]/em/[cidade-uf].
 *
 * 1 sitemap por guia × 5571 cidades IBGE.
 * 15 guias × 5571 = 83.565 URLs.
 *
 * Quando adicionarmos novos guias, este sitemap cresce automaticamente.
 */
export async function generateSitemaps() {
  return GUIAS.map((_, idx) => ({ id: idx }));
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const guia = GUIAS[id];
  if (!guia) return [];
  const cities = getAllCities();
  const lastMod = guia.atualizado_em
    ? new Date(guia.atualizado_em)
    : RELEASE_DATE;
  return cities.map((c) => ({
    url: `${base}/guias/${guia.slug}/em/${c.slug}-${c.uf.toLowerCase()}`,
    changeFrequency: "monthly",
    priority: c.isCapital ? 0.7 : 0.55,
    lastModified: lastMod
  }));
}
