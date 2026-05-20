"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * PageViewTracker — registra cada navegação no AdvAqui no endpoint /api/track.
 *
 * Inserido no layout root, dispara fetch a cada mudança de pathname. Não
 * envia query strings (privacidade), não usa cookies, não cria identidade
 * persistente. SessionId é mantido apenas em `sessionStorage` e expira ao
 * fechar a aba.
 *
 * Privacidade: o endpoint server-side trunca o IP pra /24 antes de gravar.
 *
 * Maio/2026 — Fase 4 da Página Profissional AdvAqui.
 */

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let sid = window.sessionStorage.getItem("advaqui_sid");
    if (!sid) {
      // 32 chars aleatórios — sem dados sensíveis
      sid = Array.from({ length: 32 }, () =>
        Math.floor(Math.random() * 36).toString(36)
      ).join("");
      window.sessionStorage.setItem("advaqui_sid", sid);
    }
    return sid;
  } catch {
    return "";
  }
}

export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!pathname) return;

    // Não rastreia rotas administrativas (admin/painel/api) — ruído desnecessário
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return;

    const sessionId = getOrCreateSessionId();
    const referer = document.referrer || "";

    // fetch sem aguardar — fire and forget. Tem keepalive pra sobreviver
    // a navegações imediatas. AbortController evita memory leak.
    const controller = new AbortController();
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      signal: controller.signal,
      body: JSON.stringify({
        path: pathname,
        referer,
        sessionId
      })
    }).catch(() => {
      // Ignora — falha de tracking não pode quebrar UX
    });

    return () => controller.abort();
    // Inclui searchParams nas deps pra rastrear navegações com mesma path
    // mas query diferente (ex: /advogados?uf=mg → /advogados?uf=sp)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams?.toString()]);

  return null;
}
