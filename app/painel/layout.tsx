import type { Metadata } from "next";
import { PainelNav } from "@/components/PainelNav";

/**
 * Layout do /painel — força noindex/nofollow em toda a sub-árvore /painel/*
 * e adiciona a navegação de dashboard (abas) compartilhada por todas as páginas.
 *
 * Defesa em profundidade: robots.txt já bloqueia /painel via Disallow, mas
 * adicionar meta robots noindex evita indexação caso o robots.txt seja
 * ignorado por algum crawler agressivo.
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

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PainelNav />
      {children}
    </>
  );
}
