import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { SPECIALTIES } from "@/lib/data/specialties";
import { MODALIDADES_ATENDIMENTO } from "@/lib/data/modalidades";
import { getAllCities } from "@/lib/data/cities";

export async function generateSitemaps() {
  return SPECIALTIES.flatMap((_, si) => MODALIDADES_ATENDIMENTO.map((__, mi) => ({ id: si * 10 + mi })));
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const sp = SPECIALTIES[Math.floor(id / 10)];
  const m = MODALIDADES_ATENDIMENTO[id % 10];
  if (!sp || !m) return [];
  return getAllCities().slice(0, 50000).map(c => ({
    url: `${base}/advogados-de/${sp.slug}/em/${c.slug}-${c.uf.toLowerCase()}/atende/${m.slug}`,
    changeFrequency: "monthly",
    priority: c.isCapital ? 0.55 : 0.4,
    lastModified: new Date()
  }));
}
