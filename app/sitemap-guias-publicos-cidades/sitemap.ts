import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { GUIAS } from "@/lib/data/guias";
import { GUIA_PUBLICOS } from "@/lib/data/modalidades";
import { getAllCities } from "@/lib/data/cities";

export async function generateSitemaps() {
  return GUIAS.flatMap((_, gi) => GUIA_PUBLICOS.map((__, pi) => ({ id: gi * 10 + pi })));
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const g = GUIAS[Math.floor(id / 10)];
  const p = GUIA_PUBLICOS[id % 10];
  if (!g || !p) return [];
  return getAllCities().slice(0, 50000).map(c => ({
    url: `${base}/guias/${g.slug}/em/${c.slug}-${c.uf.toLowerCase()}/publico-${p.slug}`,
    changeFrequency: "monthly",
    priority: c.isCapital ? 0.55 : 0.4,
    lastModified: new Date()
  }));
}
