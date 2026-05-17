"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-narrow py-20 text-center">
      <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" aria-hidden />
      <h1 className="font-display text-3xl font-bold text-brand-ink">
        Algo deu errado
      </h1>
      <p className="text-brand-ink/70 mt-2 max-w-md mx-auto">
        Ocorreu um erro inesperado. Você pode tentar de novo ou voltar ao início.
      </p>
      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        <button onClick={reset} className="btn-primary">
          Tentar novamente
        </button>
        <Link href="/" className="btn-ghost border border-brand-line">
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
