"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type AuthState =
  | { kind: "loading" }
  | { kind: "anonymous" }
  | { kind: "lawyer"; firstName: string; planStatus: string }
  | { kind: "admin" };

/**
 * Botões da página /planos.
 *
 * Adapta texto e destino conforme o visitante:
 *   - Anonymous           → /cadastro
 *   - Lawyer free/pending → /painel (free CTA) | /painel/pagamento (premium CTA)
 *   - Lawyer premium      → /painel (free CTA) | "Você já é premium" (premium CTA)
 *   - Admin               → /admin (neutro)
 *
 * Resolve o bug em que premium logado via "Ativar premium agora" — agora
 * o CTA premium some/troca pra confirmação visual quando o user já é premium.
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
      .then(
        (data: {
          kind?: "admin" | "lawyer" | "anonymous";
          firstName?: string;
          planStatus?: string;
        }) => {
          if (cancelled) return;
          if (data.kind === "admin") {
            setAuth({ kind: "admin" });
          } else if (data.kind === "lawyer" && data.firstName) {
            setAuth({
              kind: "lawyer",
              firstName: data.firstName,
              planStatus: data.planStatus || "free"
            });
          } else {
            setAuth({ kind: "anonymous" });
          }
        }
      )
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
    // Premium ATIVO — mostra confirmação em vez de CTA pra ativar
    if (auth.planStatus === "active") {
      return (
        <Link
          href="/painel"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white font-bold transition hover:bg-emerald-700 active:scale-[0.98]"
        >
          ✓ Você já é premium · Ir ao painel
        </Link>
      );
    }
    // Pendente — pagamento sinalizado, aguardando ativação
    if (auth.planStatus === "pending") {
      return (
        <Link
          href="/painel"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-100 text-amber-900 font-bold transition hover:bg-amber-200 border border-amber-300"
        >
          Pagamento em análise · Ver painel
        </Link>
      );
    }
    // Free ou expired — vai pra ativação
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

/**
 * CTA de Premium adaptável a login, para reaproveitar em qualquer página
 * (home, /planos, páginas de cidade) mantendo o estilo do local via className.
 *
 * - Anônimo         → "Criar perfil e ativar premium" → /cadastro
 * - Advogado free   → "Ativar Premium agora"          → /painel/pagamento
 * - Advogado pending→ "Pagamento em análise"          → /painel
 * - Advogado premium→ "Você já é premium"             → /painel
 * - Admin           → "Ir para o painel admin"        → /admin
 *
 * Resolve o erro em que o advogado JÁ LOGADO via "Criar perfil e ativar
 * premium" (sem sentido — ele já tem perfil) e não achava como pagar.
 */
export function AtivarPremiumCTA({
  className,
  style,
  origem = "planos",
  anonLabel = "Criar perfil e ativar premium",
  anonHref
}: {
  className?: string;
  style?: React.CSSProperties;
  origem?: string;
  anonLabel?: string;
  anonHref?: string;
}) {
  const auth = useAuthKind();

  let href = anonHref || `/cadastro?origem=${origem}`;
  let label = anonLabel;

  if (auth.kind === "lawyer") {
    if (auth.planStatus === "active") {
      href = "/painel";
      label = "✓ Você já é premium · Ver painel";
    } else if (auth.planStatus === "pending") {
      href = "/painel";
      label = "Pagamento em análise · Ver painel";
    } else {
      href = "/painel/pagamento";
      label = "Ativar Premium agora";
    }
  } else if (auth.kind === "admin") {
    href = "/admin";
    label = "Ir para o painel admin";
  }

  return (
    <Link href={href} className={className} style={style}>
      {label}
    </Link>
  );
}

/**
 * CTA de cadastro que respeita o login. Para páginas de captação de advogado
 * (cidade, especialidade): anônimo vê o convite de cadastro; advogado logado
 * vê "Ir para meu painel"; admin vê "Painel admin". Evita convidar quem já
 * tem conta a se recadastrar.
 */
export function CadastroCTA({
  anonLabel,
  className,
  style
}: {
  anonLabel: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const auth = useAuthKind();

  let href = "/cadastro";
  let label = anonLabel;

  if (auth.kind === "lawyer") {
    href = "/painel/advogado";
    label = "Ir para meu painel";
  } else if (auth.kind === "admin") {
    href = "/admin";
    label = "Painel admin";
  }

  return (
    <Link href={href} className={className} style={style}>
      {label}
    </Link>
  );
}
