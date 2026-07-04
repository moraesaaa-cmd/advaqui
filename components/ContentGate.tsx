"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Lock, Sparkles, UserPlus, LogIn } from "lucide-react";
import { QuickSignupModal } from "@/components/tools/QuickSignupModal";

/**
 * Content Gate — captura de lead em troca de acesso ao conteúdo completo.
 *
 * Estratégia (Maio/2026):
 *   • Visitante anônimo vê os primeiros ~30% do conteúdo (preview) com fade.
 *   • Abaixo do fade aparece um card pedindo cadastro/login.
 *   • Visitante logado (lawyer OU admin) vê tudo, sem fricção.
 *
 * Sem precisar de endpoint protegido: o conteúdo COMPLETO é renderizado no
 * HTML estático e o "gate" é uma capa client-side que oculta. Isso é
 * intencional — não é DRM, é fricção de captura. Bots curiosos podem ler o
 * HTML; mas o ganho de leads compensa muito mais que essa "perda".
 *
 * Como usar:
 *   <ContentGate
 *     title="Modelo completo (clique para baixar)"
 *     ctaLabel="Cadastrar grátis para baixar"
 *     previewLines={12}
 *   >
 *     {/* qualquer JSX (modelo, checklist, artigo) *\/}
 *   </ContentGate>
 *
 * O `previewLines` é uma estimativa em LINHAS visíveis no preview, usada para
 * dimensionar o height máximo do bloco de prévia.
 */
export function ContentGate({
  children,
  title = "Conteúdo completo disponível para cadastrados",
  description = "Cadastre-se grátis (ou faça login) para liberar o conteúdo completo e baixar para usar.",
  ctaLabel = "Cadastrar grátis para liberar",
  previewLines = 14,
  /**
   * Quando true, libera o conteúdo sem checar auth — útil pra páginas que
   * NUNCA deveriam ter gate (admin preview, debug).
   */
  alwaysOpen = false
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
  ctaLabel?: string;
  previewLines?: number;
  alwaysOpen?: boolean;
}) {
  // SSR-safe: começamos com gate VISÍVEL para não vazar conteúdo durante o
  // primeiro paint do servidor. Depois da hidratação no client, checamos auth.
  const [status, setStatus] = useState<"checking" | "anonymous" | "authorized">(
    alwaysOpen ? "authorized" : "checking"
  );
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    if (alwaysOpen) {
      setStatus("authorized");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (cancelled) return;
        if (!res.ok) {
          setStatus("anonymous");
          return;
        }
        const data = (await res.json()) as { kind?: string };
        if (cancelled) return;
        if (data.kind === "lawyer" || data.kind === "admin" || data.kind === "citizen") {
          setStatus("authorized");
        } else {
          setStatus("anonymous");
        }
      } catch {
        if (!cancelled) setStatus("anonymous");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [alwaysOpen]);

  if (status === "authorized") {
    return <div className="content-gate-open">{children}</div>;
  }

  // Estado anônimo OU checking — mostra preview com fade + gate.
  // Calcula max-height aproximada a partir de previewLines (lh = 1.6rem).
  const previewMaxHeight = `${Math.max(6, previewLines) * 1.6}rem`;

  return (
    <div className="relative">
      <div
        aria-hidden={status === "anonymous"}
        className="relative overflow-hidden rounded-2xl border-2 border-brand-line bg-white"
        style={{ maxHeight: previewMaxHeight }}
      >
        <div className="p-5 select-none">{children}</div>
        {/* Fade gradient sobre o final do preview */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none"
        />
      </div>

      <div className="mt-5 rounded-2xl border-2 border-brand-accent bg-gradient-to-br from-brand-bg to-white p-6 shadow-card relative overflow-hidden">
        <div
          aria-hidden
          className="absolute -top-px left-4 right-4 h-1 bg-gradient-to-r from-brand-accent2 via-brand-accent to-brand-accent2 rounded-b"
        />
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex w-12 h-12 rounded-xl bg-brand-accent/20 items-center justify-center flex-shrink-0">
            <Lock className="w-6 h-6 text-brand-accent2" aria-hidden />
          </div>
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-accent/15 text-brand-deep border border-brand-accent/40 mb-2">
              <Sparkles className="w-3 h-3" aria-hidden />
              Liberação gratuita
            </div>
            <h3 className="font-display text-xl md:text-2xl font-bold text-brand-ink leading-tight">
              {title}
            </h3>
            <p className="text-sm md:text-base text-brand-ink/75 mt-2 leading-relaxed">
              {description}
            </p>
            <ul className="text-sm text-brand-ink/85 mt-4 space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                Acesso completo a este e a todos os outros modelos
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                Download em .txt + opção de copiar
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                Cadastro em 2 minutos, sem cartão, sem cobrança
              </li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setShowSignup(true)}
                className="btn-accent inline-flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" aria-hidden />
                {ctaLabel}
              </button>
              <Link href="/login" className="btn-ghost inline-flex items-center gap-2">
                <LogIn className="w-4 h-4" aria-hidden />
                Já tenho conta — entrar
              </Link>
            </div>
            <p className="text-xs text-brand-ink/55 mt-3">
              Cadastro 100% gratuito, sem cartão — só nome, e-mail e senha. Você recebe
              acesso a todos os modelos, checklists e materiais do AdvAqui.
            </p>
          </div>
        </div>
      </div>

      {showSignup && (
        <QuickSignupModal
          ferramenta="content-gate"
          onClose={() => setShowSignup(false)}
          onSuccess={() => {
            setShowSignup(false);
            setStatus("authorized");
          }}
        />
      )}
    </div>
  );
}
