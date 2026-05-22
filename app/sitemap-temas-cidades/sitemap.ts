import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { TEMAS_STJ } from "@/lib/data/jurisprudencia-temas";
import { getAllCities } from "@/lib/data/cities";

/**
 * Sitemap secundário — /jurisprudencia/stj/tema/[slug]/em/[cidade-uf].
 *
 * 1 sitemap por tema × 5571 cidades = 15 sitemaps × 5571 = 83.565 URLs.
 *
 * As páginas se auto-protegem: se o tema tiver < 3 decisões reais no banco,
 * a metadata fica noindex. Mas as URLs estão no sitemap para descoberta
 * progressiva — quando o banco crescer, indexam naturalmente.
 */
export async function generateSitemaps() {
  return TEMAS_STJ.map((_, idx) => ({ id: idx }));
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const tema = TEMAS_STJ[id];
  if (!tema) return [];
  const cities = getAllCities();
  const now = new Date();
  return cities.map((c) => ({
    url: `${base}/jurisprudencia/stj/tema/${tema.slug}/em/${c.slug}-${c.uf.toLowerCase()}`,
    changeFrequency: "weekly",
    priority: c.isCapital ? 0.65 : 0.5,
    lastModified: now
  }));
}
