import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { CUSTOS } from "@/lib/data/custos-juridicos";
import { MODALIDADES_ATENDIMENTO } from "@/lib/data/modalidades";
import { getAllCities } from "@/lib/data/cities";

/** /quanto-custa × modalidade × cidade = 15 × 3 × 5571 = 250k URLs. */
export async function generateSitemaps() {
  return CUSTOS.flatMap((_, ci) => MODALIDADES_ATENDIMENTO.map((__, mi) => ({ id: ci * 10 + mi })));
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const ci = Math.floor(id / 10);
  const mi = id % 10;
  const c = CUSTOS[ci];
  const m = MODALIDADES_ATENDIMENTO[mi];
  if (!c || !m) return [];
  const cities = getAllCities();
  return cities.slice(0, 50000).map(city => ({
    url: `${base}/quanto-custa/${c.slug}/em/${city.slug}-${city.uf.toLowerCase()}/modalidade/${m.slug}`,
    changeFrequency: "monthly",
    priority: city.isCapital ? 0.55 : 0.4,
    lastModified: new Date()
  }));
}
