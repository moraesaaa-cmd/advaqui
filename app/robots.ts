import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { STATES } from "@/lib/data/states";

/**
 * Robots.txt — Permite crawling de todas as páginas públicas (cidades, estados,
 * especialidades, perfis) e bloqueia apenas áreas privadas (admin, painel, APIs).
 *
 * Aponta para o sitemap principal e para os sitemaps secundários gerados via
 * `generateSitemaps` em `app/sitemap-cidades/sitemap.ts` (um por UF) e
 * `app/sitemap-especialidades/sitemap.ts` (um por UF).
 */
export default function robots(): MetadataRoute.Robots {
  const base = SITE.url.replace(/\/$/, "");

  const sitemaps: string[] = [`${base}/sitemap.xml`];
  for (let i = 0; i < STATES.length; i++) {
    sitemaps.push(`${base}/sitemap-cidades/sitemap/${i}.xml`);
    sitemaps.push(`${base}/sitemap-especialidades/sitemap/${i}.xml`);
  }
  sitemaps.push(`${base}/sitemap-jurisprudencia.xml`);

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/jurisprudencia/", "/glossario/", "/problemas-juridicos/", "/guias/"],
        disallow: ["/admin", "/painel", "/api/", "/login", "/cadastro", "/recuperar-senha", "/redefinir-senha"]
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/jurisprudencia/", "/glossario/", "/problemas-juridicos/", "/guias/"],
        disallow: ["/admin", "/painel", "/api/", "/login", "/cadastro", "/recuperar-senha", "/redefinir-senha"]
      }
    ],
    sitemap: sitemaps,
    host: base
  };
}
