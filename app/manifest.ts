import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";

/**
 * Web App Manifest — habilita "Adicionar à tela inicial" no mobile/desktop.
 * Servido pelo Next.js em /manifest.webmanifest.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#FBF9F4",
    theme_color: "#0F1B2D",
    lang: "pt-BR",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" }
    ]
  };
}
