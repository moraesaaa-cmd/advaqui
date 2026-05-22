import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { ARTIGOS_LOCALIZAVEIS_SLUGS } from "@/lib/data/articles-cidades";
import { BLOG_SITUACOES } from "@/lib/data/modalidades";
import { getAllCities } from "@/lib/data/cities";

export async function generateSitemaps() {
  return ARTIGOS_LOCALIZAVEIS_SLUGS.flatMap((_, ai) => BLOG_SITUACOES.map((__, si) => ({ id: ai * 10 + si })));
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const slug = ARTIGOS_LOCALIZAVEIS_SLUGS[Math.floor(id / 10)];
  const s = BLOG_SITUACOES[id % 10];
  if (!slug || !s) return [];
  return getAllCities().slice(0, 50000).map(c => ({
    url: `${base}/blog/${slug}/em/${c.slug}-${c.uf.toLowerCase()}/situacao/${s.slug}`,
    changeFrequency: "monthly",
    priority: c.isCapital ? 0.55 : 0.4,
    lastModified: new Date()
  }));
}
