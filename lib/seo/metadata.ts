import type { Metadata } from "next";
import { SITE } from "@/lib/config";

type PageMetaInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  /** Override do canonical (relativo a "/" ou absoluto). Consolida variantes
   *  near-duplicate (ex.: /glossario/[slug]/em/[cidade]) na pagina-base,
   *  evitando conteudo duplicado em escala. */
  canonical?: string;
};

/**
 * Constrói Metadata para um page.tsx específico.
 *
 * - title — apenas o nome curto da página (ex: "Planos"). O `template` em
 *   `app/layout.tsx` adiciona automaticamente " — AdvAqui" no final.
 *   Se algum chamador passar com sufixo, removemos para evitar duplicação.
 * - Open Graph e Twitter usam o título completo (curto + sufixo).
 * - canonical absoluto via metadataBase + path.
 */
export const buildMetadata = (input: PageMetaInput): Metadata => {
  const trailingSiteName = new RegExp(`\\s*(—|-)\\s*${SITE.name}\\s*$`, "i");
  const shortTitle = input.title.replace(trailingSiteName, "").trim();
  const fullTitle = `${shortTitle} — ${SITE.name}`;
  const url = input.path ? `${SITE.url}${input.path}` : SITE.url;
  const canonicalUrl = input.canonical
    ? (input.canonical.startsWith("http") ? input.canonical : `${SITE.url}${input.canonical}`)
    : url;
  const image = input.image || `${SITE.url}/opengraph-image`;

  return {
    title: shortTitle,
    description: input.description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: fullTitle,
      description: input.description,
      url: canonicalUrl,
      siteName: SITE.name,
      locale: "pt_BR",
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle }]
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: input.description,
      images: [image]
    },
    robots: input.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true }
  };
};
