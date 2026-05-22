import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { STATES } from "@/lib/data/states";
import { PROBLEMAS } from "@/lib/data/problemas-juridicos";
import { SPECIALTIES } from "@/lib/data/specialties";
import { TEMAS_STJ } from "@/lib/data/jurisprudencia-temas";
import { GLOSSARIO } from "@/lib/data/glossario";
import { GUIAS } from "@/lib/data/guias";
import { getAllTemplates } from "@/lib/data/templates-docs";
import { CUSTOS } from "@/lib/data/custos-juridicos";
import { TEMAS_STF } from "@/lib/data/jurisprudencia-temas-stf";
import { CALCULADORAS } from "@/lib/data/calculadoras";
import {
  MODALIDADES_ATENDIMENTO,
  CALCULADORA_TIPOS,
  GUIA_PUBLICOS,
  GLOSSARIO_USOS,
  MODELO_USOS,
  BLOG_SITUACOES,
  JURIS_ASPECTOS
} from "@/lib/data/modalidades";
import { ARTIGOS_LOCALIZAVEIS_SLUGS, getArtigosLocalizaveis } from "@/lib/data/articles-cidades";

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
  // Cauda longa local: blog × cidade — 1 sitemap por artigo localizável
  const artigosLocalizaveis = getArtigosLocalizaveis();
  for (let i = 0; i < artigosLocalizaveis.length; i++) {
    sitemaps.push(`${base}/sitemap-blog-cidades/sitemap/${i}.xml`);
  }
  // Cauda longa local: guia × cidade — 1 sitemap por guia (F22-E onda 1)
  for (let i = 0; i < GUIAS.length; i++) {
    sitemaps.push(`${base}/sitemap-guias-cidades/sitemap/${i}.xml`);
  }
  // Cauda longa local: modelo × cidade (F22-E onda 2) — 1 sitemap por template
  const templates = getAllTemplates();
  for (let i = 0; i < templates.length; i++) {
    sitemaps.push(`${base}/sitemap-modelos-cidades/sitemap/${i}.xml`);
  }
  // Cauda longa local: quanto-custa × cidade (F22-E onda 3) — 1 sitemap por serviço
  for (let i = 0; i < CUSTOS.length; i++) {
    sitemaps.push(`${base}/sitemap-quanto-custa-cidades/sitemap/${i}.xml`);
  }
  // Tribunais por cidade — 5571 URLs em 1 sitemap (F22-E onda 4)
  sitemaps.push(`${base}/sitemap-tribunais-cidades.xml`);
  // STF temas × cidade (F22-E onda 5)
  for (let i = 0; i < TEMAS_STF.length; i++) {
    sitemaps.push(`${base}/sitemap-temas-stf-cidades/sitemap/${i}.xml`);
  }
  // Calculadoras × cidade (F22-E onda 8)
  for (let i = 0; i < CALCULADORAS.length; i++) {
    sitemaps.push(`${base}/sitemap-calculadoras-cidades/sitemap/${i}.xml`);
  }
  // === F22-E ondas 9-18 — cruzamentos 3D (sitemaps × cidade × modalidade) ===
  // problemas × área × cidade (~222k)
  for (let i = 0; i < PROBLEMAS.length; i++)
    sitemaps.push(`${base}/sitemap-problemas-areas-cidades/sitemap/${i}.xml`);
  // quanto-custa × modalidade × cidade (~250k)
  for (let ci = 0; ci < CUSTOS.length; ci++)
    for (let mi = 0; mi < MODALIDADES_ATENDIMENTO.length; mi++)
      sitemaps.push(`${base}/sitemap-quanto-custa-modalidades-cidades/sitemap/${ci * 10 + mi}.xml`);
  // calculadora × tipo × cidade (~134k)
  for (let ci = 0; ci < CALCULADORAS.length; ci++)
    for (let ti = 0; ti < CALCULADORA_TIPOS.length; ti++)
      sitemaps.push(`${base}/sitemap-calculadoras-tipos-cidades/sitemap/${ci * 10 + ti}.xml`);
  // guia × público × cidade (~111k)
  for (let gi = 0; gi < GUIAS.length; gi++)
    for (let pi = 0; pi < GUIA_PUBLICOS.length; pi++)
      sitemaps.push(`${base}/sitemap-guias-publicos-cidades/sitemap/${gi * 10 + pi}.xml`);
  // glossário × uso × cidade (~334k)
  for (let gi = 0; gi < GLOSSARIO.length; gi++)
    for (let ui = 0; ui < GLOSSARIO_USOS.length; ui++)
      sitemaps.push(`${base}/sitemap-glossario-usos-cidades/sitemap/${gi * 10 + ui}.xml`);
  // modelo × uso × cidade (~334k)
  const _tpls = getAllTemplates();
  for (let ti = 0; ti < _tpls.length; ti++)
    for (let ui = 0; ui < MODELO_USOS.length; ui++)
      sitemaps.push(`${base}/sitemap-modelos-usos-cidades/sitemap/${ti * 10 + ui}.xml`);
  // blog × situação × cidade (~223k)
  for (let ai = 0; ai < ARTIGOS_LOCALIZAVEIS_SLUGS.length; ai++)
    for (let si = 0; si < BLOG_SITUACOES.length; si++)
      sitemaps.push(`${base}/sitemap-blog-situacoes-cidades/sitemap/${ai * 10 + si}.xml`);
  // STJ tema × área × cidade (~167k) — pode ter noindex se < 3 decisões
  for (let i = 0; i < TEMAS_STJ.length; i++)
    sitemaps.push(`${base}/sitemap-stj-areas-cidades/sitemap/${i}.xml`);
  // STF tema × aspecto × cidade (~167k) — noindex até banco STF povoar
  for (let ti = 0; ti < TEMAS_STF.length; ti++)
    for (let ai = 0; ai < JURIS_ASPECTOS.length; ai++)
      sitemaps.push(`${base}/sitemap-stf-aspectos-cidades/sitemap/${ti * 10 + ai}.xml`);
  // advogado × modalidade × cidade (~250k)
  for (let si = 0; si < SPECIALTIES.length; si++)
    for (let mi = 0; mi < MODALIDADES_ATENDIMENTO.length; mi++)
      sitemaps.push(`${base}/sitemap-advogados-modalidades-cidades/sitemap/${si * 10 + mi}.xml`);

  sitemaps.push(`${base}/sitemap-jurisprudencia.xml`);

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/jurisprudencia/", "/glossario/", "/problemas-juridicos/", "/guias/", "/advogados-de/", "/modelos/", "/quanto-custa/", "/tribunais/", "/calculadoras/"],
        disallow: ["/admin", "/painel", "/api/", "/login", "/cadastro", "/recuperar-senha", "/redefinir-senha"]
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/jurisprudencia/", "/glossario/", "/problemas-juridicos/", "/guias/", "/advogados-de/", "/modelos/", "/quanto-custa/", "/tribunais/", "/calculadoras/"],
        disallow: ["/admin", "/painel", "/api/", "/login", "/cadastro", "/recuperar-senha", "/redefinir-senha"]
      }
    ],
    sitemap: sitemaps,
    host: base
  };
}
