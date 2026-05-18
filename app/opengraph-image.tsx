import { ImageResponse } from "next/og";
import { SITE } from "@/lib/config";

/**
 * Imagem Open Graph padrão do site (1200×630).
 *
 * Gerada dinamicamente em build pelo `next/og` (Edge runtime). É a imagem que
 * aparece quando o site é compartilhado no WhatsApp, Twitter, LinkedIn, etc.
 *
 * Para usar uma imagem específica em uma página (ex: card por cidade),
 * crie `app/[rota]/opengraph-image.tsx` com a mesma estrutura.
 */

export const runtime = "edge";
export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 96px",
          background:
            "linear-gradient(135deg, #0F1B2D 0%, #1B3A5C 60%, #264E70 100%)",
          color: "white",
          fontFamily: "ui-sans-serif, system-ui"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "#C9A24C",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0F1B2D",
              fontSize: "32px",
              fontWeight: 800
            }}
          >
            A
          </div>
          <div
            style={{
              fontSize: "36px",
              fontWeight: 700,
              letterSpacing: "-0.02em"
            }}
          >
            {SITE.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              fontSize: "72px",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: "920px"
            }}
          >
            Encontre o advogado certo na sua cidade
          </div>
          <div
            style={{
              fontSize: "28px",
              opacity: 0.85,
              maxWidth: "880px",
              lineHeight: 1.4
            }}
          >
            Diretório nacional. Por cidade, por especialidade. Direto com quem
            pode resolver seu caso.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            color: "#C9A24C",
            fontSize: "20px",
            fontWeight: 600
          }}
        >
          <span>advaqui.com</span>
          <span style={{ opacity: 0.6, fontWeight: 400 }}>
            5.571 cidades · 27 estados
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
