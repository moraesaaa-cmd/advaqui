"use client";

import { useRef, useState, type ReactNode } from "react";
import { QuickSignupModal } from "@/components/tools/QuickSignupModal";

/**
 * Gate de download reutilizável ("cadastre-se para baixar").
 *
 * Envolve qualquer ação de download/cópia: se o visitante já tem conta
 * (advogado, cidadão ou admin), a ação roda direto; se é anônimo, abre o
 * cadastro rápido e executa a ação assim que a conta é criada/logada.
 *
 * Uso:
 *   const { guard, modal } = useDownloadGate("modelo-" + slug);
 *   <button onClick={() => guard(baixar)}>Baixar</button>
 *   {modal}
 */
export function useDownloadGate(ferramenta: string): {
  guard: (action: () => void) => void;
  modal: ReactNode;
} {
  const [show, setShow] = useState(false);
  const pending = useRef<(() => void) | null>(null);

  const guard = (action: () => void) => {
    void (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const data = (await res.json()) as { kind?: string };
        if (data.kind === "admin" || data.kind === "lawyer" || data.kind === "citizen") {
          action();
          return;
        }
      } catch {
        // falha na checagem → trata como anônimo (pede cadastro)
      }
      pending.current = action;
      setShow(true);
    })();
  };

  const modal = show ? (
    <QuickSignupModal
      ferramenta={ferramenta}
      onClose={() => setShow(false)}
      onSuccess={() => {
        setShow(false);
        const run = pending.current;
        pending.current = null;
        run?.();
      }}
    />
  ) : null;

  return { guard, modal };
}
