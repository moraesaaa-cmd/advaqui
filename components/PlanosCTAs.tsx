"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type AuthState =
  | { kind: "loading" }
  | { kind: "anonymous" }
  | { kind: "lawyer"; firstName: string }
  | { kind: "admin" };

/**
 * Botões da página /planos.
 *
 * Adapta texto e destino conforme o visitante:
 *   - Anonymous     → /cadastro (texto padrão)
 *   - Lawyer logado → /painel (free) | /painel/pagamento (premium)
 *   - Admin         → /admin (neutro)
 *
 * Resolve o bug em que o user já logado clicava "Cadastrar e ativar premium"
 * e era jogado pro fluxo de cadastro do zero.
 *
 * Default "loading" no SSR mostra o texto anonymous (Cadastrar...) pra evitar
 * flicker do botão; o useEffect substitui se houver sessão.
 */
function useAuthKind(): AuthState {
  const [auth, setAuth] = useState<AuthState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : { kind: "anonymous" }))
      .then((data: { kind?: "admin" | "lawyer" | "anonymous"; firstName?: string }) => {
        if (cancelled) return;
        if (data.kind === "admin") {
          setAuth({ kind: "admin" });
        } else if (data.kind === "lawyer" && data.firstName) {
          setAuth({ kind: "lawyer", firstName: data.firstName });
        } else {
          setAuth({ kind: "anonymous" });
        }
      })
      .catch(() => {
        if (!cancelled) setAuth({ kind: "anonymous" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return auth;
}

export function PlanosCTAFree() {
  const auth = useAuthKind();
  if (auth.kind === "lawyer") {
    return (
      <Link href="/painel" className="btn-ghost border border-brand-line justify-center">
        Voltar ao meu painel
      </Link>
    );
  }
  if (auth.kind === "admin") {
    return (
      <Link href="/admin" className="btn-ghost border border-brand-line justify-center">
        Ir para o painel admin
      </Link>
    );
  }
  return (
    <Link href="/cadastro" className="btn-ghost border border-brand-line justify-center">
      Cadastrar gratuitamente
    </Link>
  );
}

export function PlanosCTAPremium() {
  const auth = useAuthKind();
  if (auth.kind === "lawyer") {
    return (
      <Link href="/painel/pagamento" className="btn-accent justify-center">
        Ativar premium agora
      </Link>
    );
  }
  if (auth.kind === "admin") {
    return (
      <Link href="/admin" className="btn-accent justify-center">
        Ir para o painel admin
      </Link>
    );
  }
  return (
    <Link href="/cadastro" className="btn-accent justify-center">
      Cadastrar e ativar premium
    </Link>
  );
}
