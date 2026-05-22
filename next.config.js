/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }
        ]
      }
    ];
  },
  async redirects() {
    // URLs antigas / variações comuns redirecionadas pro destino canônico.
    // Evita 404 em links históricos e ajuda link equity SEO.
    return [
      { source: "/diretorio", destination: "/advogados", permanent: true },
      { source: "/diretorio/:path*", destination: "/advogados/:path*", permanent: true }
    ];
  }
};

module.exports = nextConfig;
