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
import { getArtigosLocalizaveis } from "@/lib/data/articles-cidades";

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
  // Rota real é app/sitemap-tribunais-cidades/sitemap.ts → /sitemap-tribunais-cidades/sitemap.xml
  // (sem generateSitemaps, então é arquivo único, não segmentado em /sitemap/N.xml).
  sitemaps.push(`${base}/sitemap-tribunais-cidades/sitemap.xml`);
  // STF temas × cidade (F22-E onda 5)
  for (let i = 0; i < TEMAS_STF.length; i++) {
    sitemaps.push(`${base}/sitemap-temas-stf-cidades/sitemap/${i}.xml`);
  }
  // Calculadoras × cidade (F22-E onda 8)
  for (let i = 0; i < CALCULADORAS.length; i++) {
    sitemaps.push(`${base}/sitemap-calculadoras-cidades/sitemap/${i}.xml`);
  }
  sitemaps.push(`${base}/sitemap-jurisprudencia.xml`);

  // Paths permitidos/bloqueados — definidos uma vez e reutilizados por todos
  // os user-agents, evitando divergência entre regras.
  const allow = [
    "/",
    "/jurisprudencia/",
    "/glossario/",
    "/problemas-juridicos/",
    "/guias/",
    "/advogados-de/",
    "/modelos/",
    "/quanto-custa/",
    "/tribunais/",
    "/calculadoras/"
  ];
  const disallow = [
    "/admin",
    "/painel",
    "/api/",
    "/login",
    "/recuperar-senha",
    "/redefinir-senha"
  ];

  // Crawlers de mecanismos de resposta por IA (LLMs e motores de busca
  // generativa). Explicitamente bem-vindos no conteúdo público — é assim que
  // o AdvAqui passa a ser citado em respostas de ChatGPT, Claude, Perplexity,
  // Gemini, Copilot etc. As áreas privadas seguem bloqueadas para eles também.
  const aiUserAgents = [
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-Web",
    "anthropic-ai",
    "PerplexityBot",
    "Perplexity-User",
    "Google-Extended",
    "Applebot-Extended",
    "Amazonbot",
    "Bingbot",
    "DuckDuckBot",
    "meta-externalagent"
  ];

  return {
    rules: [
      { userAgent: "*", allow, disallow },
      { userAgent: "Googlebot", allow, disallow },
      { userAgent: aiUserAgents, allow, disallow }
    ],
    sitemap: sitemaps,
    host: base
  };
}
