import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { CUSTOS } from "@/lib/data/custos-juridicos";
import { getAllCities } from "@/lib/data/cities";

/**
 * Sitemap secundário — /quanto-custa/[servico]/em/[cidade-uf].
 *
 * 15 serviços × 5571 cidades IBGE = 83.565 URLs.
 * Crescimento automático conforme novos custos forem adicionados.
 */
export async function generateSitemaps() {
  return CUSTOS.map((_, idx) => ({ id: idx }));
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const custo = CUSTOS[id];
  if (!custo) return [];
  const cities = getAllCities();
  return cities.map((c) => ({
    url: `${base}/quanto-custa/${custo.slug}/em/${c.slug}-${c.uf.toLowerCase()}`,
    changeFrequency: "monthly",
    priority: c.isCapital ? 0.7 : 0.55,
    lastModified: new Date()
  }));
}
