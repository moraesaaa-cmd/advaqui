import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { PROBLEMAS } from "@/lib/data/problemas-juridicos";
import { getAllCities } from "@/lib/data/cities";

/**
 * Sitemap secundário — /problemas-juridicos/[slug]/em/[cidade-uf].
 *
 * Estratégia — 1 sitemap por problema. 20 problemas × 5571 cidades IBGE =
 * 111.420 URLs distribuídas em 20 sitemaps (~5571 URLs por arquivo, bem
 * abaixo do limite 50k do Google).
 *
 * Permite descoberta total via ISR — Next gera a página no primeiro acesso
 * e cacheia 24h.
 */
export async function generateSitemaps() {
  return PROBLEMAS.map((_, idx) => ({ id: idx }));
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const problema = PROBLEMAS[id];
  if (!problema) return [];
  const cities = getAllCities();
  const lastMod = problema.atualizado_em
    ? new Date(problema.atualizado_em)
    : new Date();
  return cities.map((c) => ({
    url: `${base}/problemas-juridicos/${problema.slug}/em/${c.slug}-${c.uf.toLowerCase()}`,
    changeFrequency: "monthly",
    priority: c.isCapital ? 0.7 : 0.55,
    lastModified: lastMod
  }));
}
