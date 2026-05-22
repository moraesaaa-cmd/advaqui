import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { TEMAS_STF } from "@/lib/data/jurisprudencia-temas-stf";
import { JURIS_ASPECTOS } from "@/lib/data/modalidades";
import { getAllCities } from "@/lib/data/cities";

export async function generateSitemaps() {
  return TEMAS_STF.flatMap((_, ti) => JURIS_ASPECTOS.map((__, ai) => ({ id: ti * 10 + ai })));
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const t = TEMAS_STF[Math.floor(id / 10)];
  const a = JURIS_ASPECTOS[id % 10];
  if (!t || !a) return [];
  return getAllCities().slice(0, 50000).map(c => ({
    url: `${base}/jurisprudencia/stf/tema/${t.slug}/em/${c.slug}-${c.uf.toLowerCase()}/aspecto/${a.slug}`,
    changeFrequency: "monthly",
    priority: c.isCapital ? 0.45 : 0.35,
    lastModified: new Date()
  }));
}
