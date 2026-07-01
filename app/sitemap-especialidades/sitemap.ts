import { RELEASE_DATE } from "@/lib/seo/lastmod";
import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { STATES } from "@/lib/data/states";
import { citiesByUf } from "@/lib/data/cities";
import { SPECIALTIES } from "@/lib/data/specialties";

/**
 * Sitemap secundário — uma URL por combinação cidade × especialidade, dividido por UF.
 * Total — ~83.565 URLs (5.571 cidades × 15 especialidades), distribuídas em 27 sitemaps.
 * SP é o maior (~9.675 URLs); o menor é DF (~15 URLs). Todos abaixo do limite
 * de 50.000 URLs por sitemap definido pelo protocolo.
 */
export async function generateSitemaps() {
  return STATES.map((_, idx) => ({ id: idx }));
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const st = STATES[id];
  if (!st) return [];
  const cities = citiesByUf(st.uf);
  const now = RELEASE_DATE;
  const out: MetadataRoute.Sitemap = [];
  for (const c of cities) {
    for (const sp of SPECIALTIES) {
      out.push({
        url: `${base}/advogados/${st.uf.toLowerCase()}/${c.slug}/${sp.slug}`,
        changeFrequency: "weekly",
        priority: c.isCapital ? 0.6 : 0.5,
        lastModified: now
      });
    }
  }
  return out;
}
