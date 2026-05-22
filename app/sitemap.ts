import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { STATES } from "@/lib/data/states";
import { getAllCities } from "@/lib/data/cities";
import { SPECIALTIES } from "@/lib/data/specialties";
import { getAllLawyerSlugs } from "@/lib/data/lawyers";
import { getAllArticleSlugs } from "@/lib/data/articles";
import { getAllTemplateSlugs } from "@/lib/data/templates-docs";
import { getAllMarketingArticleSlugs } from "@/lib/data/marketing-articles";
import { GLOSSARIO } from "@/lib/data/glossario";
import { PROBLEMAS } from "@/lib/data/problemas-juridicos";
import { GUIAS } from "@/lib/data/guias";
import { TEMAS_STJ } from "@/lib/data/jurisprudencia-temas";
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
    { url: `${base}/sitemap-html`, changeFrequency: "monthly", priority: 0.3, lastModified: now },
    { url: `${base}/jurisprudencia`, changeFrequency: "daily", priority: 0.8, lastModified: now },
    { url: `${base}/jurisprudencia/stf`, changeFrequency: "daily", priority: 0.8, lastModified: now },
    { url: `${base}/jurisprudencia/stj`, changeFrequency: "daily", priority: 0.8, lastModified: now },
    { url: `${base}/glossario`, changeFrequency: "weekly", priority: 0.8, lastModified: now },
    { url: `${base}/problemas-juridicos`, changeFrequency: "weekly", priority: 0.9, lastModified: now },
    { url: `${base}/guias`, changeFrequency: "weekly", priority: 0.8, lastModified: now }
  ];

  // Glossário — termos individuais
  const glossarioRoutes: MetadataRoute.Sitemap = GLOSSARIO.map((t) => ({
    url: `${base}/glossario/${t.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: t.atualizado_em ? new Date(t.atualizado_em) : now
  }));

  // Problemas jurídicos individuais
  const problemaRoutes: MetadataRoute.Sitemap = PROBLEMAS.map((p) => ({
    url: `${base}/problemas-juridicos/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: p.atualizado_em ? new Date(p.atualizado_em) : now
  }));

  // Guias por área
  const guiaRoutes: MetadataRoute.Sitemap = GUIAS.map((g) => ({
    url: `${base}/guias/${g.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: g.atualizado_em ? new Date(g.atualizado_em) : now
  }));

  // Hubs temáticos de jurisprudência STJ
  const temaStjRoutes: MetadataRoute.Sitemap = TEMAS_STJ.map((t) => ({
    url: `${base}/jurisprudencia/stj/tema/${t.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
    lastModified: t.atualizado_em ? new Date(t.atualizado_em) : now
  }));

  // Combinações cauda longa (problema/área/tema/glossário × 5571 cidades)
  // estão agora em sitemaps secundários, listados em app/robots.ts.
  // Aqui mantemos apenas o sitemap raiz enxuto.

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
  //
  // Estratégia em 2 queries (em vez de JOIN) pra evitar problema de tipagem
  // do Supabase com relations que requerem alias diferente:
  //   1. Pega todos os artigos published com lawyer_id + slug + updated_at
  //   2. Mapeia lawyer_id → slug usando os perfis já carregados via getAllLawyerSlugs
  //      ou um lookup adicional. Pra evitar custo, vamos buscar { id, slug } em
  //      lookup separado.
  const lawyerArticleRoutes: MetadataRoute.Sitemap = [];
  try {
    const admin = createAdminClient();
    const { data: articles, error: artErr } = await admin
      .from("lawyer_articles")
      .select("slug, lawyer_id, updated_at")
      .eq("status", "published")
      .limit(5000);

    if (!artErr && Array.isArray(articles) && articles.length > 0) {
      const lawyerIds = Array.from(
        new Set(articles.map((a: { lawyer_id: string }) => a.lawyer_id))
      );
      const { data: lawyersData, error: lawyerErr } = await admin
        .from("lawyers")
        .select("id, slug")
        .in("id", lawyerIds);

      if (!lawyerErr && Array.isArray(lawyersData)) {
        const slugById = new Map<string, string>();
        for (const l of lawyersData as Array<{ id: string; slug: string }>) {
          slugById.set(l.id, l.slug);
        }
        for (const a of articles as Array<{
          slug: string;
          lawyer_id: string;
          updated_at: string;
        }>) {
          const lawyerSlug = slugById.get(a.lawyer_id);
          if (!lawyerSlug) continue;
          lawyerArticleRoutes.push({
            url: `${base}/advogado/${lawyerSlug}/artigos/${a.slug}`,
            changeFrequency: "monthly",
            priority: 0.5,
            lastModified: a.updated_at ? new Date(a.updated_at) : now
          });
        }
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
    ...lawyerArticleRoutes,
    ...glossarioRoutes,
    ...problemaRoutes,
    ...guiaRoutes,
    ...temaStjRoutes
  ];
}
