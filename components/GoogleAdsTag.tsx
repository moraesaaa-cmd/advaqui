"use client";
import Script from "next/script";

// Tag global do Google Ads (gtag). Ativa SOMENTE quando NEXT_PUBLIC_GADS_ID
// estiver definido no .env.local (formato AW-XXXXXXXXX). Habilita remarketing
// e conversoes por URL de destino sem tocar no fluxo de cadastro.
const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID;

export function GoogleAdsTag() {
  if (!GADS_ID) return null;
  return (
    <>
      <Script
        src={"https://www.googletagmanager.com/gtag/js?id=" + GADS_ID}
        strategy="afterInteractive"
      />
      <Script id="gads-init" strategy="afterInteractive">
        {"window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','" + GADS_ID + "');"}
      </Script>
    </>
  );
}
