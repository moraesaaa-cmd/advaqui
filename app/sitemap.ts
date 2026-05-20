import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { STATES } from "@/lib/data/states";
import { getAllCities } from "@/lib/data/cities";
import { SPECIALTIES } from "@/lib/data/specialties";
import { getAllLawyerSlugs } from "@/lib/data/lawyers";
import { getAllArticleSlugs } from "@/lib/data/articles";
import { getAllTemplateSlugs } from "@/lib/data/templates-docs";
import { getAllMarketingArticleSlugs } from "@/lib/data/marketing-articles";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Sitemap principal. Inclui:
 *  - páginas estáticas (home, planos, sobre, FAQ, contato, termos, privacidade)
 *  - índice do diretório
 *  - todas as 27 páginas de estado
 *  - perfis de advogados
 *  - capitais + capital×especialidade (importantes para SEO)
 *
 * Sitemaps secundários cobrem todas as cidades e cidade×especialidade
 * (~89.000 URLs), divididos por UF em `app/sitemap-cidades/[uf]/sitemap.ts`
 * e `app/sitemap-especialidades/[uf]/sitemap.ts`. O `robots.ts` aponta para
 * o sitemap raiz e o Google segue os links normalmente.
 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "daily", priority: 1.0, lastModified: now },
    { url: `${base}/advogados`, changeFrequency: "daily", priority: 0.9, lastModified: now },
    { url: `${base}/blog`, changeFrequency: "weekly", priority: 0.8, lastModified: now },
    { url: `${base}/modelos`, changeFrequency: "monthly", priority: 0.8, lastModified: now },
    { url: `${base}/marketing-juridico`, changeFrequency: "weekly", priority: 0.7, lastModified: now },
    { url: `${base}/checklist`, changeFrequency: "monthly", priority: 0.6, lastModified: now },
    { url: `${base}/planos`, changeFrequency: "monthly", priority: 0.7, lastModified: now },
    { url: `${base}/sobre`, changeFrequency: "yearly", priority: 0.4, lastModified: now },
    { url: `${base}/faq`, changeFrequency: "monthly", priority: 0.5, lastModified: now },
    { url: `${base}/contato`, changeFrequency: "yearly", priority: 0.4, lastModified: now },
    { url: `${base}/termos`, changeFrequency: "yearly", priority: 0.3, lastModified: now },
    { url: `${base}/privacidade`, changeFrequency: "yearly", priority: 0.3, lastModified: now },
    { url: `${base}/aviso-legal`, changeFrequency: "yearly", priority: 0.3, lastModified: now },
    { url: `${base}/cadastro`, changeFrequency: "monthly", priority: 0.5, lastModified: now },
    { url: `${base}/login`, changeFrequency: "yearly", priority: 0.2, lastModified: now },
    { url: `${base}/sitemap-html`, changeFrequency: "monthly", priority: 0.3, lastModified: now }
  ];

  const stateRoutes: MetadataRoute.Sitemap = STATES.map((s) => ({
    url: `${base}/advogados/${s.uf.toLowerCase()}`,
    changeFrequency: "weekly",
    priority: 0.8,
    lastModified: now
  }));

  const slugs = await getAllLawyerSlugs();
  const profileRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${base}/advogado/${slug}`,
    changeFrequency: "weekly",
    priority: 0.5,
    lastModified: now
  }));

  const capitalSpecRoutes: MetadataRoute.Sitemap = [];
  for (const c of getAllCities().filter((c) => c.isCapital)) {
    capitalSpecRoutes.push({
      url: `${base}/advogados/${c.uf.toLowerCase()}/${c.slug}`,
      changeFrequency: "weekly",
      priority: 0.7,
      lastModified: now
    });
    for (const sp of SPECIALTIES) {
      capitalSpecRoutes.push({
        url: `${base}/advogados/${c.uf.toLowerCase()}/${c.slug}/${sp.slug}`,
        changeFrequency: "weekly",
        priority: 0.6,
        lastModified: now
      });
    }
  }

  const articleRoutes: MetadataRoute.Sitemap = getAllArticleSlugs().map((slug) => ({
    url: `${base}/blog/${slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: now
  }));

  const templateRoutes: MetadataRoute.Sitemap = getAllTemplateSlugs().map((slug) => ({
    url: `${base}/modelos/${slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
    lastModified: now
  }));

  const mktRoutes: MetadataRoute.Sitemap = getAllMarketingArticleSlugs().map((slug) => ({
    url: `${base}/marketing-juridico/${slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: now
  }));

  // Artigos próprios dos advogados (Fase 3 — migration 0006).
  // Defensive: se tabela ainda não existe ou banco offline, retorna lista vazia
  // — sitemap não pode quebrar o build.
  const lawyerArticleRoutes: MetadataRoute.Sitemap = [];
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("lawyer_articles")
      .select("slug, lawyer_id, updated_at, lawyers!inner(slug)")
      .eq("status", "published")
      .limit(5000);
    if (!error && Array.isArray(data)) {
      for (const r of data as Array<{
        slug: string;
        updated_at: string;
        lawyers: { slug: string } | { slug: string }[];
      }>) {
        const lawyer = Array.isArray(r.lawyers) ? r.lawyers[0] : r.lawyers;
        if (!lawyer?.slug) continue;
        lawyerArticleRoutes.push({
          url: `${base}/advogado/${lawyer.slug}/artigos/${r.slug}`,
          changeFrequency: "monthly",
          priority: 0.5,
          lastModified: r.updated_at ? new Date(r.updated_at) : now
        });
      }
    }
  } catch {
    // Banco offline ou tabela inexistente — sitemap segue sem esses URLs.
  }

  return [
    ...staticRoutes,
    ...stateRoutes,
    ...capitalSpecRoutes,
    ...articleRoutes,
    ...templateRoutes,
    ...mktRoutes,
    ...profileRoutes,
    ...lawyerArticleRoutes
  ];
}
