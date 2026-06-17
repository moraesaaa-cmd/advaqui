/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ui-avatars.com" },
      { protocol: "https", hostname: "images.unsplash.com" }
    ]
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
          { key: "X-DNS-Prefetch-Control", value: "on" }
        ]
      }
    ];
  },
  async redirects() {
    // URLs antigas / variações comuns redirecionadas pro destino canônico.
    // Evita 404 em links históricos e ajuda link equity SEO.
    return [
      // Consolida o domínio: www -> sem-www (versão canônica). Mata conteúdo
      // duplicado e concentra os sinais de SEO em um único host.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.advaqui.com" }],
        destination: "https://advaqui.com/:path*",
        permanent: true
      },
      { source: "/diretorio", destination: "/advogados", permanent: true },
      { source: "/diretorio/:path*", destination: "/advogados/:path*", permanent: true },
      // Raízes de rotas dinâmicas acessadas sem slug -> diretório (evita 404 solto).
      // O match é exato: não afeta /advogado/[slug] nem /p/[slug].
      { source: "/advogado", destination: "/advogados", permanent: true },
      { source: "/p", destination: "/advogados", permanent: true }
    ];
  }
};

module.exports = nextConfig;
