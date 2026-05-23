import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { CALCULADORAS } from "@/lib/data/calculadoras";
import { CALCULADORA_TIPOS } from "@/lib/data/modalidades";
import { getAllCities } from "@/lib/data/cities";

/** calculadora × tipo × cidade = 8 × 3 × 5571 ≈ 134k URLs. */
export async function generateSitemaps() {
  return CALCULADORAS.flatMap((_, ci) => CALCULADORA_TIPOS.map((__, ti) => ({ id: ci * 10 + ti })));
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const c = CALCULADORAS[Math.floor(id / 10)];
  const t = CALCULADORA_TIPOS[id % 10];
  if (!c || !t) return [];
  return getAllCities().slice(0, 50000).map(city => ({
    url: `${base}/calculadoras/${c.slug}/em/${city.slug}-${city.uf.toLowerCase()}/tipo-${t.slug}`,
    changeFrequency: "monthly",
    priority: city.isCapital ? 0.55 : 0.4,
    lastModified: new Date()
  }));
}
