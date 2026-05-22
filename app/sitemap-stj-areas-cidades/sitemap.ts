import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { TEMAS_STJ } from "@/lib/data/jurisprudencia-temas";
import { getAllCities } from "@/lib/data/cities";

export async function generateSitemaps() {
  return TEMAS_STJ.map((_, idx) => ({ id: idx }));
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const t = TEMAS_STJ[id];
  if (!t) return [];
  const cities = getAllCities();
  const out: MetadataRoute.Sitemap = [];
  for (const a of t.areas) {
    for (const c of cities) {
      out.push({
        url: `${base}/jurisprudencia/stj/tema/${t.slug}/em/${c.slug}-${c.uf.toLowerCase()}/area/${a}`,
        changeFrequency: "monthly",
        priority: c.isCapital ? 0.45 : 0.35,
        lastModified: new Date()
      });
    }
  }
  return out.slice(0, 50000);
}
