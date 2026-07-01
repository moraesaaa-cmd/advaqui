import { RELEASE_DATE } from "@/lib/seo/lastmod";
import { SITE } from "@/lib/config";
import { getIndexableDecisoesForSitemap } from "@/lib/data/jurisprudencia";

/**
 * GET /sitemap-jurisprudencia.xml
 *
 * Sitemap dedicado para o módulo Jurisprudência.
 *
 * Inclui:
 *  - hub /jurisprudencia
 *  - /jurisprudencia/stf
 *  - /jurisprudencia/stj
 *  - decisões publicadas com indexavel = true
 *
 * Defensive: se a tabela ainda não existe (migration 0008 pendente) ou o
 * Supabase está fora, devolve apenas as 3 URLs raiz — nunca quebra.
 *
 * Limite prático de 5.000 URLs por sitemap (bem abaixo do limite oficial
 * de 50k) para manter o XML leve. Conforme o acervo crescer, dá pra
 * particionar por tribunal ou data.
 */

export const revalidate = 3600; // 1h
export const dynamic = "force-dynamic";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const base = SITE.url.replace(/\/$/, "");
  const now = RELEASE_DATE.toISOString();

  const entries: string[] = [];

  // 1) Hub
  entries.push(
    `<url><loc>${escapeXml(base + "/jurisprudencia")}</loc>` +
      `<lastmod>${now}</lastmod>` +
      `<changefreq>daily</changefreq>` +
      `<priority>0.8</priority></url>`
  );

  // 2) Tribunais
  for (const t of ["stf", "stj"]) {
    entries.push(
      `<url><loc>${escapeXml(base + "/jurisprudencia/" + t)}</loc>` +
        `<lastmod>${now}</lastmod>` +
        `<changefreq>daily</changefreq>` +
        `<priority>0.8</priority></url>`
    );
  }

  // 3) Decisões indexáveis publicadas (até 5.000 por sitemap)
  try {
    const decisoes = await getIndexableDecisoesForSitemap(5000);
    for (const d of decisoes) {
      const slug = d.tribunal.toLowerCase();
      const lastmod = d.updated_at
        ? new Date(d.updated_at).toISOString()
        : now;
      entries.push(
        `<url><loc>${escapeXml(
          `${base}/jurisprudencia/${slug}/${d.slug}`
        )}</loc>` +
          `<lastmod>${lastmod}</lastmod>` +
          `<changefreq>monthly</changefreq>` +
          `<priority>0.5</priority></url>`
      );
    }
  } catch {
    // Banco indisponível ou tabela inexistente — não quebra.
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    entries.join("") +
    `</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
