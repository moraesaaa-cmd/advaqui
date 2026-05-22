import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { STATES } from "@/lib/data/states";
import { PROBLEMAS } from "@/lib/data/problemas-juridicos";
import { SPECIALTIES } from "@/lib/data/specialties";
import { TEMAS_STJ } from "@/lib/data/jurisprudencia-temas";
import { GLOSSARIO } from "@/lib/data/glossario";

/**
 * Robots.txt — Permite crawling de todas as páginas públicas (cidades, estados,
 * especialidades, perfis, cauda longa local) e bloqueia apenas áreas privadas
 * (admin, painel, APIs).
 *
 * Aponta para o sitemap principal e para os sitemaps secundários gerados via
 * `generateSitemaps`:
 *  - /sitemap-cidades/sitemap/[i].xml — 27 UFs × cidades
 *  - /sitemap-especialidades/sitemap/[i].xml — 27 UFs × spec
 *  - /sitemap-problemas-cidades/sitemap/[i].xml — 20 problemas × 5571 cidades
 *  - /sitemap-advogados-de/sitemap/[i].xml — 15 áreas × 5571 cidades
 *  - /sitemap-temas-cidades/sitemap/[i].xml — 15 temas STJ × 5571 cidades
 *  - /sitemap-glossario-cidades/sitemap/[i].xml — 20 termos × 5571 cidades
 *  - /sitemap-jurisprudencia.xml — decisões reais STJ + hubs
 *
 * Total descoberta: ~480k URLs cauda longa indexáveis + ~5k canônicas.
 */
export default function robots(): MetadataRoute.Robots {
  const base = SITE.url.replace(/\/$/, "");

  const sitemaps: string[] = [`${base}/sitemap.xml`];
  for (let i = 0; i < STATES.length; i++) {
    sitemaps.push(`${base}/sitemap-cidades/sitemap/${i}.xml`);
    sitemaps.push(`${base}/sitemap-especialidades/sitemap/${i}.xml`);
  }
  // Cauda longa local: problema × cidade — 1 sitemap por problema
  for (let i = 0; i < PROBLEMAS.length; i++) {
    sitemaps.push(`${base}/sitemap-problemas-cidades/sitemap/${i}.xml`);
  }
  // Cauda longa local: área × cidade — 1 sitemap por especialidade
  for (let i = 0; i < SPECIALTIES.length; i++) {
    sitemaps.push(`${base}/sitemap-advogados-de/sitemap/${i}.xml`);
  }
  // Cauda longa local: tema STJ × cidade — 1 sitemap por tema
  for (let i = 0; i < TEMAS_STJ.length; i++) {
    sitemaps.push(`${base}/sitemap-temas-cidades/sitemap/${i}.xml`);
  }
  // Cauda longa local: glossário × cidade — 1 sitemap por termo
  for (let i = 0; i < GLOSSARIO.length; i++) {
    sitemaps.push(`${base}/sitemap-glossario-cidades/sitemap/${i}.xml`);
  }
  sitemaps.push(`${base}/sitemap-jurisprudencia.xml`);

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/jurisprudencia/", "/glossario/", "/problemas-juridicos/", "/guias/", "/advogados-de/"],
        disallow: ["/admin", "/painel", "/api/", "/login", "/cadastro", "/recuperar-senha", "/redefinir-senha"]
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/jurisprudencia/", "/glossario/", "/problemas-juridicos/", "/guias/", "/advogados-de/"],
        disallow: ["/admin", "/painel", "/api/", "/login", "/cadastro", "/recuperar-senha", "/redefinir-senha"]
      }
    ],
    sitemap: sitemaps,
    host: base
  };
}
