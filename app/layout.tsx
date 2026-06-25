import type { Metadata, Viewport } from "next";
import { Public_Sans, Newsreader } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChromeGate } from "@/components/ChromeGate";
import { GlobalRecrutaCTA } from "@/components/GlobalRecrutaCTA";
import { Toaster } from "@/components/Toast";
import { JsonLd } from "@/components/JsonLd";
import { GoogleAdsTag } from "@/components/GoogleAdsTag";
import { PageViewTracker } from "@/components/PageViewTracker";
import { orgSchema, websiteSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";

// Tipografia do redesign (claude_design): Public Sans (corpo) + Newsreader
// (títulos serif). Mantemos os NOMES das variáveis (--font-inter/--font-fraunces)
// para não tocar no tailwind.config nem nas centenas de usos de font-sans/font-display
// — só a fonte por trás de cada variável muda. Serif→serif, sans→sans: sem quebra.
const inter = Public_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter"
});

const fraunces = Newsreader({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-fraunces"
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s — ${SITE.name}`
  },
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  // 'keywords' removido — ignorado pelo Google desde 2009 e
  // pode ser sinal de spam para alguns crawlers.
  alternates: { canonical: SITE.url },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1
  },
  // Verificação Google Search Console.
  // Funciona como 2ª camada caso a verificação por DNS TXT falhe.
  // O Google aceita qualquer um dos dois métodos.
  verification: {
    google: "UGeskHmRDfHUpwUpuOQ8tSbEIiRuMNDvNjg8zBK57iM"
  }
};

export const viewport: Viewport = {
  themeColor: "#0F1B2D",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="font-sans bg-brand-bg text-brand-ink min-h-screen flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:bg-brand-accent focus:text-brand-ink focus:px-3 focus:py-2 focus:rounded-lg focus:z-50"
        >
          Pular para o conteúdo
        </a>
        <ChromeGate>
          <Header />
        </ChromeGate>
        <main id="main" className="flex-1">{children}</main>
        <ChromeGate>
          <GlobalRecrutaCTA />
          <Footer />
        </ChromeGate>
        <Toaster />
        <GoogleAdsTag />
        <JsonLd data={orgSchema()} />
        <JsonLd data={websiteSchema()} />
        {/* Analytics próprio — registra pageviews sem cookies, com IP truncado.
            Em Suspense porque PageViewTracker usa useSearchParams (App Router). */}
        <Suspense fallback={null}>
          <PageViewTracker />
        </Suspense>
      </body>
    </html>
  );
}
