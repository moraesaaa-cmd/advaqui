import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export const runtime = "edge";

/**
 * Apple touch icon — usado quando alguém adiciona o site à tela inicial do iOS.
 * 180×180 PNG conforme recomendação da Apple.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 130,
          background: "#0F1B2D",
          color: "#C9A24C",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontFamily: "serif",
          borderRadius: "32px"
        }}
      >
        A
      </div>
    ),
    { ...size }
  );
}
