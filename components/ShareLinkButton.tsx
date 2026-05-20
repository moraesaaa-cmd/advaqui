"use client";

import { useState, useCallback } from "react";
import { Copy, Check, Share2 } from "lucide-react";

/**
 * Botão duplo "Copiar link" + "Compartilhar".
 *
 * Usado no cabeçalho da Página Profissional (`/advogado/[slug]`) ao lado do
 * botão WhatsApp. Pensado pra mobile primeiro — em dispositivos que suportam
 * `navigator.share` (iOS/Android modernos), abre o seletor nativo de
 * compartilhamento. Em desktop sem essa API, faz fallback pra copiar URL.
 *
 * Linguagem sóbria conforme Provimento OAB 205/2021 — sem CTAs de "contrate
 * agora" ou linguagem promocional.
 *
 * Maio/2026 — Fase 2 da Página Profissional AdvAqui.
 */

type Props = {
  /** URL completa pública a ser compartilhada. */
  url: string;
  /** Título usado no compartilhamento nativo (Web Share API). */
  title: string;
};

export function ShareLinkButton({ url, title }: Props) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback pra navegadores sem clipboard API moderna.
      const el = document.createElement("textarea");
      el.value = url;
      el.setAttribute("readonly", "");
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } finally {
        document.body.removeChild(el);
      }
    }
  }, [url]);

  const shareNative = useCallback(async () => {
    // Web Share API — disponível principalmente em mobile e Safari.
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title, url });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
        return;
      } catch {
        // Usuário cancelou ou erro — cai pra copiar.
      }
    }
    // Sem Web Share API ou compartilhamento cancelado — copia o link.
    copyToClipboard();
  }, [title, url, copyToClipboard]);

  return (
    <>
      <button
        type="button"
        onClick={copyToClipboard}
        aria-label="Copiar link da Página Profissional"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-brand-line bg-white text-brand-ink font-semibold text-sm hover:border-brand-accent transition"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-emerald-600" aria-hidden />
            Link copiado
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 text-brand-deep" aria-hidden />
            Copiar link
          </>
        )}
      </button>
      <button
        type="button"
        onClick={shareNative}
        aria-label="Compartilhar Página Profissional"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-brand-line bg-white text-brand-ink font-semibold text-sm hover:border-brand-accent transition"
      >
        {shared ? (
          <>
            <Check className="w-4 h-4 text-emerald-600" aria-hidden />
            Enviado
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4 text-brand-deep" aria-hidden />
            Compartilhar
          </>
        )}
      </button>
    </>
  );
}
