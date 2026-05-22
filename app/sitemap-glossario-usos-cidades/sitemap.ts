import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { GLOSSARIO } from "@/lib/data/glossario";
import { GLOSSARIO_USOS } from "@/lib/data/modalidades";
import { getAllCities } from "@/lib/data/cities";

export async function generateSitemaps() {
  return GLOSSARIO.flatMap((_, gi) => GLOSSARIO_USOS.map((__, ui) => ({ id: gi * 10 + ui })));
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const t = GLOSSARIO[Math.floor(id / 10)];
  const u = GLOSSARIO_USOS[id % 10];
  if (!t || !u) return [];
  return getAllCities().slice(0, 50000).map(c => ({
    url: `${base}/glossario/${t.slug}/em/${c.slug}-${c.uf.toLowerCase()}/uso/${u.slug}`,
    changeFrequency: "monthly",
    priority: c.isCapital ? 0.55 : 0.4,
    lastModified: new Date()
  }));
}
