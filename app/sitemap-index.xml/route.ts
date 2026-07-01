import { getAllSitemapUrls } from "@/lib/seo/all-sitemaps";
import { RELEASE_DATE } from "@/lib/seo/lastmod";

export const runtime = "nodejs";
export const dynamic = "force-static";

const escapeXml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Índice de sitemaps — um único URL (https://advaqui.com/sitemap-index.xml)
 * que referencia todos os ~380 sitemaps do site. Enviado ao Google Search
 * Console para monitorar a cobertura completa (~480k URLs) num lugar só.
 * Só ACRESCENTA descoberta — os sitemaps individuais continuam no robots.txt.
 */
export async function GET() {
  const urls = getAllSitemapUrls();
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map(
        (u) =>
          `  <sitemap><loc>${escapeXml(u)}</loc><lastmod>${RELEASE_DATE.toISOString()}</lastmod></sitemap>`
      )
      .join("\n") +
    `\n</sitemapindex>\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
}
