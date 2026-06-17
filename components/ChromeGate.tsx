"use client";

import { usePathname } from "next/navigation";

/**
 * Oculta o chrome do site (Header, Footer, CTA global) nas landing pages /lp,
 * que sao paginas independentes para campanhas (sem menu nem distracao).
 * Renderiza normalmente em todas as outras rotas. Como usePathname resolve no
 * proprio SSR, nao ha flash do chrome na landing.
 */
export function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname && pathname.startsWith("/lp")) return null;
  return <>{children}</>;
}
