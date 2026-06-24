"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Oculta o chrome do site (Header, Footer, CTA global) nas landing pages
 * independentes — campanhas de Ads, sem menu de advogado nem distração:
 *   - /lp/*                 landings genéricas
 *   - /multas               landing do recurso de multa (público de trânsito)
 *   - /recurso/*            painel do cliente do recurso
 *   - host multas.advaqui.com (o middleware reescreve "/" → "/multas", mas a URL
 *     visível continua "/", então o usePathname vê "/" — daí o check por host).
 *
 * Sem esconder, o Header do diretório ("Encontrar advogado", "Cadastrar
 * advogado", "Entrar") aparecia acima da landing, passando a ideia errada de
 * que o site é só para advogados.
 */
const HIDE_PREFIXES = ["/lp", "/multas", "/recurso"];

export function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [hideByHost, setHideByHost] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.host.startsWith("multas.")) {
      setHideByHost(true);
    }
  }, []);

  if (hideByHost) return null;
  if (pathname && HIDE_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return null;
  }
  return <>{children}</>;
}
