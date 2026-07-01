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
import { getArtigosLocalizaveis } from "@/lib/data/articles-cidades";

/**
 * Lista completa dos sitemaps do site — fonte única usada pelo robots.txt e
 * pelo índice /sitemap-index.xml (um único URL enviável ao Search Console que
 * cobre os ~380 sitemaps / ~480k URLs).
 */
export function getAllSitemapUrls(): string[] {
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
  sitemaps.push(`${base}/sitemap-tribunais-cidades/sitemap.xml`);
  // STF temas × cidade (F22-E onda 5)
  for (let i = 0; i < TEMAS_STF.length; i++) {
    sitemaps.push(`${base}/sitemap-temas-stf-cidades/sitemap/${i}.xml`);
  }
  // Calculadoras × cidade (F22-E onda 8)
  for (let i = 0; i < CALCULADORAS.length; i++) {
    sitemaps.push(`${base}/sitemap-calculadoras-cidades/sitemap/${i}.xml`);
  }
  // Recurso de multa × cidade e Para advogados × cidade — 1 sitemap por UF (27 cada).
  for (let i = 0; i < STATES.length; i++) {
    sitemaps.push(`${base}/sitemap-recurso-multa-cidades/sitemap/${i}.xml`);
    sitemaps.push(`${base}/sitemap-para-advogados-cidades/sitemap/${i}.xml`);
  }
  sitemaps.push(`${base}/sitemap-jurisprudencia.xml`);

  return sitemaps;
}
