import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/Toast";
import { JsonLd } from "@/components/JsonLd";
import { orgSchema, websiteSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
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
  robots: { index: true, follow: true },
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
        <Header />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
        <Toaster />
        <JsonLd data={orgSchema()} />
        <JsonLd data={websiteSchema()} />
      </body>
    </html>
  );
}
