import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { getAllSitemapUrls } from "@/lib/seo/all-sitemaps";

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
 *  - /sitemap-glossario-cidades/sitemap/[i].xml — 135 termos × 5571 cidades
 *  - /sitemap-jurisprudencia.xml — decisões reais STJ + hubs
 *
 * Total descoberta: ~480k URLs cauda longa indexáveis + ~5k canônicas.
 */
export default function robots(): MetadataRoute.Robots {
  const base = SITE.url.replace(/\/$/, "");

  // Lista completa em lib/seo/all-sitemaps.ts (compartilhada com o índice
  // /sitemap-index.xml). O índice entra primeiro — cobre tudo num URL só.
  const sitemaps: string[] = [`${base}/sitemap-index.xml`, ...getAllSitemapUrls()];

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
    "/calculadoras/",
    "/recurso-de-multa/",
    "/ferramentas/",
    "/para-advogados/"
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
