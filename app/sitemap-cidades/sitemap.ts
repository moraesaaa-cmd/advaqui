import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { STATES } from "@/lib/data/states";
import { citiesByUf } from "@/lib/data/cities";

/**
 * Sitemap secundário — uma URL por cidade brasileira, dividido por UF.
 * Cada UF gera um sitemap próprio (`/sitemap-cidades/0.xml` ... `/26.xml`).
 *
 * Total — 5.571 URLs distribuídas em 27 sitemaps. Garante que o Google
 * descubra todas as páginas de cidade, mesmo aquelas geradas via ISR.
 */
export async function generateSitemaps() {
  return STATES.map((_, idx) => ({ id: idx }));
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const st = STATES[id];
  if (!st) return [];
  const cities = citiesByUf(st.uf);
  const now = new Date();
  return cities.map((c) => ({
    url: `${base}/advogados/${st.uf.toLowerCase()}/${c.slug}`,
    changeFrequency: "weekly",
    priority: c.isCapital ? 0.7 : 0.6,
    lastModified: now
  }));
}
