import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { PROBLEMAS } from "@/lib/data/problemas-juridicos";
import { getAllCities } from "@/lib/data/cities";

/**
 * Sitemap — problemas-juridicos × área × cidade.
 * 1 sitemap por problema. URLs filtradas pelas áreas que o problema lista.
 */
export async function generateSitemaps() {
  return PROBLEMAS.map((_, idx) => ({ id: idx }));
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const p = PROBLEMAS[id];
  if (!p) return [];
  const cities = getAllCities();
  const out: MetadataRoute.Sitemap = [];
  for (const a of p.areas) {
    for (const c of cities) {
      out.push({
        url: `${base}/problemas-juridicos/${p.slug}/em/${c.slug}-${c.uf.toLowerCase()}/area-${a}`,
        changeFrequency: "monthly",
        priority: c.isCapital ? 0.55 : 0.4,
        lastModified: new Date()
      });
    }
  }
  return out.slice(0, 50000); // hard cap
}
