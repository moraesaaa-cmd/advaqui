/**
 * Evento de funil client-side — grava em site_visits via /api/track usando
 * paths sintéticos "/e/{nome}". Zero mudança de schema: o pipeline existente
 * (is_bot, sessão, geo) vale para os eventos, e o dashboard admin agrega por
 * prefixo. O referer carrega a página onde o evento aconteceu (ex.: o perfil
 * do advogado clicado).
 *
 * Nunca lança e nunca bloqueia a UI (sendBeacon/keepalive).
 */
export function trackEvent(name: string): void {
  try {
    if (typeof window === "undefined") return;
    const clean = name.replace(/[^a-z0-9/_-]/gi, "").slice(0, 120);
    if (!clean) return;
    let sessionId: string | undefined;
    try {
      sessionId = sessionStorage.getItem("advaqui_sid") || undefined;
    } catch {
      // sessionStorage indisponível (modo privado) — evento segue sem sessão
    }
    const body = JSON.stringify({
      path: `/e/${clean}`,
      referer: window.location.pathname,
      sessionId
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/track",
        new Blob([body], { type: "application/json" })
      );
    } else {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true
      }).catch(() => undefined);
    }
  } catch {
    // medição jamais quebra a página
  }
}
