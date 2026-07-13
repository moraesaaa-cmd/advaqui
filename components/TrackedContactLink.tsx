"use client";

import type { CSSProperties, ReactNode } from "react";
import { trackEvent } from "@/lib/analytics/track-event";

/**
 * <a> de contato (WhatsApp/telefone) que registra o clique no funil antes de
 * abrir o destino. O referer do evento identifica a página (ex.: o perfil do
 * advogado); o sufixo opcional no nome identifica o profissional nos cards
 * de diretório. Server components usam este wrapper porque onClick exige
 * client component.
 */
export function TrackedContactLink({
  event,
  href,
  className,
  style,
  target,
  rel,
  children,
  "aria-label": ariaLabel
}: {
  event: string;
  href: string;
  className?: string;
  style?: CSSProperties;
  target?: string;
  rel?: string;
  children: ReactNode;
  "aria-label"?: string;
}) {
  return (
    <a
      href={href}
      className={className}
      style={style}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
      onClick={() => trackEvent(event)}
    >
      {children}
    </a>
  );
}
