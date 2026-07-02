import type { Metadata } from "next";
import { SITE } from "@/lib/config";

type PageMetaInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  /**
   * Quando true, usa o título EXATO (sem o sufixo " — AdvAqui" do template
   * do layout). Usado em páginas com título longo (cidade/especialidade
   * extensas) onde o sufixo estouraria o corte de ~58 chars do Google.
   */
  absoluteTitle?: boolean;
};

/**
 * Escolhe a variante de título que cabe no corte do Google (~58 chars):
 * 1) fórmula completa + marca (template do layout);
 * 2) fórmula completa sem marca (absoluto);
 * 3) versão curta sem marca (absoluto).
 */
export const fitTitle = (
  full: string,
  short: string,
  max = 58
): { title: string; absoluteTitle: boolean } => {
  if (`${full} — ${SITE.name}`.length <= max) {
    return { title: full, absoluteTitle: false };
  }
  if (full.length <= max) {
    return { title: full, absoluteTitle: true };
  }
  return { title: short, absoluteTitle: true };
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
  const fullTitle = input.absoluteTitle ? shortTitle : `${shortTitle} — ${SITE.name}`;
  const url = input.path ? `${SITE.url}${input.path}` : SITE.url;
  const image = input.image || `${SITE.url}/opengraph-image`;

  return {
    title: input.absoluteTitle ? { absolute: shortTitle } : shortTitle,
    description: input.description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description: input.description,
      url,
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
