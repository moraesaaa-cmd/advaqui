import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          ink: "#0F1B2D",
          deep: "#1B3A5C",
          primary: "#264E70",
          // Amber-500 vívido (segunda iteração Maio/2026):
          //  - accent     -> #F59E0B (Tailwind amber-500, dourado pop usado em
          //                 Stripe/Vercel — quente, vibrante, NÃO é mostarda)
          //  - accent2    -> #FBBF24 (Tailwind amber-400, amarelo solar claro)
          //  O dourado #D4A017 ficou apagado contra fundos creme — o amber-500
          //  resolve com mais saturação. Mantemos contraste >= 4.5:1 com
          //  brand-ink em texto preto sobre o amber (CTAs principais).
          accent: "#F59E0B",
          accent2: "#FBBF24",
          bg: "#FBF9F4",
          line: "#E6E1D6"
        }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"]
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,27,45,0.04), 0 4px 12px rgba(15,27,45,0.06)",
        cardHover: "0 4px 8px rgba(15,27,45,0.06), 0 12px 32px rgba(15,27,45,0.12)"
      }
    }
  },
  plugins: []
};

export default config;
