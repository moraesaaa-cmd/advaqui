import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { getAllTemplates } from "@/lib/data/templates-docs";
import { MODELO_USOS } from "@/lib/data/modalidades";
import { getAllCities } from "@/lib/data/cities";

export async function generateSitemaps() {
  const templates = getAllTemplates();
  return templates.flatMap((_, ti) => MODELO_USOS.map((__, ui) => ({ id: ti * 10 + ui })));
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const templates = getAllTemplates();
  const t = templates[Math.floor(id / 10)];
  const u = MODELO_USOS[id % 10];
  if (!t || !u) return [];
  return getAllCities().slice(0, 50000).map(c => ({
    url: `${base}/modelos/${t.slug}/em/${c.slug}-${c.uf.toLowerCase()}/uso-${u.slug}`,
    changeFrequency: "monthly",
    priority: c.isCapital ? 0.55 : 0.4,
    lastModified: new Date()
  }));
}
