"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

type Props = {
  text: string;
  label?: string;
  copiedLabel?: string;
  ariaLabel?: string;
  /** Visual: 'primary' usa azul-marinho do tema, 'ghost' transparente */
  variant?: "primary" | "ghost";
  className?: string;
};

/**
 * Botão pequeno que copia `text` pra clipboard. Mostra confirmação
 * visual por 1.8s. Não-bloqueante, não-modal.
 */
export function CopyButton({
  text,
  label = "Copiar",
  copiedLabel = "Copiado!",
  ariaLabel,
  variant = "ghost",
  className = "",
}: Props) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback antigo: select + execCommand
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      } catch {
        // silencioso — não dá pra recuperar
      }
    }
  };

  const base =
    "inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition";
  const styles =
    variant === "primary"
      ? "border-brand-deep text-brand-deep hover:bg-brand-deep hover:text-white"
      : "border-brand-line text-brand-ink/70 hover:border-brand-deep hover:text-brand-deep";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel || label}
      className={`${base} ${styles} ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5" aria-hidden />
          {copiedLabel}
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" aria-hidden />
          {label}
        </>
      )}
    </button>
  );
}
