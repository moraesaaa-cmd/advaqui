import type { Metadata } from "next";

/**
 * Layout do /admin — força noindex/nofollow em toda a sub-árvore /admin/*.
 *
 * Defesa em profundidade: robots.txt já bloqueia /admin via Disallow, mas
 * adicionar meta robots noindex evita indexação caso o robots.txt seja
 * ignorado por algum crawler agressivo (e ajuda crawlers que descobrem a
 * URL por backlink antes de ler robots).
 *
 * As pages filhas são "use client" — não podem exportar metadata diretamente.
 * Este layout (server component por padrão) cobre todas elas.
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false }
  }
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
