import type { Metadata } from "next";
import { SITE } from "@/lib/config";

type PageMetaInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
};

export const buildMetadata = (input: PageMetaInput): Metadata => {
  const fullTitle = input.title.includes(SITE.name)
    ? input.title
    : `${input.title} — ${SITE.name}`;
  const url = input.path ? `${SITE.url}${input.path}` : SITE.url;
  const image = input.image || `${SITE.url}/og-default.png`;

  return {
    title: fullTitle,
    description: input.description,
    metadataBase: new URL(SITE.url),
    alternates: {
      canonical: url
    },
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
