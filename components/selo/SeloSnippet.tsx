"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BadgeCheck, Check, Copy, LogIn, UserPlus } from "lucide-react";

/**
 * Gerador do snippet do Selo AdvAqui.
 *
 * - Advogado logado: monta o código HTML com link dofollow para o PRÓPRIO
 *   perfil público (/advogado/{slug}) — é esse link que gera o backlink.
 * - Visitante deslogado: mostra o selo, explica o benefício e leva para
 *   /login ou /cadastro.
 *
 * Detecção de login igual ao ToolGate: GET /api/auth/me (kind === "lawyer").
 * O slug vem do endpoint do painel: GET /api/painel/profile → lawyer.slug.
 */

type State =
  | { status: "loading" }
  | { status: "lawyer"; slug: string }
  | { status: "anonymous" };

const buildEmbedCode = (slug: string) =>
  `<a href="https://advaqui.com/advogado/${slug}" title="Perfil verificado no AdvAqui"><img src="https://advaqui.com/selo-advaqui.svg" alt="Perfil verificado no AdvAqui" width="140" height="48" loading="lazy" style="border:0" /></a>`;

export function SeloSnippet() {
  const [state, setState] = useState<State>({ status: "loading" });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const meRes = await fetch("/api/auth/me", { cache: "no-store" });
        const me = meRes.ok ? await meRes.json() : null;
        if (me?.kind !== "lawyer") {
          if (active) setState({ status: "anonymous" });
          return;
        }
        const profRes = await fetch("/api/painel/profile", {
          cache: "no-store"
        });
        const prof = profRes.ok ? await profRes.json() : null;
        const slug =
          typeof prof?.lawyer?.slug === "string" ? prof.lawyer.slug : "";
        if (active) {
          setState(slug ? { status: "lawyer", slug } : { status: "anonymous" });
        }
      } catch {
        if (active) setState({ status: "anonymous" });
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  if (state.status === "loading") {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-brand-deep/30 border-t-brand-deep rounded-full animate-spin" />
      </div>
    );
  }

  if (state.status === "anonymous") {
    return (
      <div className="rounded-2xl border border-brand-line bg-white p-8 text-center">
        <div className="flex justify-center mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/selo-advaqui.svg"
            alt="Perfil verificado no AdvAqui"
            width={196}
            height={67}
          />
        </div>
        <h3 className="font-display text-2xl font-bold text-brand-ink mb-3">
          Entre para pegar o seu selo
        </h3>
        <p className="text-brand-ink/65 leading-relaxed max-w-md mx-auto mb-7">
          O código do selo é gerado com o link do seu perfil no AdvAqui. Mostre
          aos clientes que seu registro foi conferido. Faça login ou crie sua
          conta gratuita para copiar o código pronto.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/cadastro"
            className="btn-accent inline-flex items-center justify-center gap-2 text-sm"
          >
            <UserPlus className="w-4 h-4" aria-hidden />
            Criar conta grátis
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 font-semibold text-sm px-6 py-3 rounded-xl border border-brand-line text-brand-ink hover:bg-brand-line/30 transition"
          >
            <LogIn className="w-4 h-4" aria-hidden />
            Já tenho conta
          </Link>
        </div>
      </div>
    );
  }

  const embedCode = buildEmbedCode(state.slug);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard indisponível — o usuário ainda pode selecionar o texto
    }
  };

  return (
    <div className="rounded-2xl border border-brand-line bg-white p-6 md:p-8">
      <div className="flex items-center gap-2 mb-1">
        <BadgeCheck className="w-5 h-5 text-brand-accent2" aria-hidden />
        <h3 className="font-display text-xl font-bold text-brand-ink">
          Seu selo está pronto
        </h3>
      </div>
      <p className="text-sm text-brand-ink/65 leading-relaxed mb-6">
        O código abaixo já aponta para o seu perfil (
        <span className="font-mono text-brand-deep break-all">
          advaqui.com/advogado/{state.slug}
        </span>
        ). Cole no rodapé ou na página &quot;Sobre&quot; do seu site.
      </p>

      {/* Preview */}
      <div className="p-6 bg-brand-bg rounded-xl flex items-center justify-center mb-6">
        <a href={`https://advaqui.com/advogado/${state.slug}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/selo-advaqui.svg"
            alt="Perfil verificado no AdvAqui"
            width={140}
            height={48}
          />
        </a>
      </div>

      {/* Código */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wider text-brand-ink/50 font-bold">
          Código HTML
        </span>
        <button
          type="button"
          onClick={copy}
          className="btn-accent inline-flex items-center gap-2 text-sm"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" aria-hidden />
              Copiado!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" aria-hidden />
              Copiar código
            </>
          )}
        </button>
      </div>
      <pre className="text-sm text-brand-ink/80 bg-brand-bg border border-brand-line rounded-xl p-4 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed select-all">
        {embedCode}
      </pre>

      <div className="mt-5 rounded-xl border border-brand-accent/30 bg-brand-accent/5 p-4 text-sm text-brand-ink/75 leading-relaxed">
        <strong className="text-brand-ink">Como usar:</strong> copie o código e
        cole no HTML do seu site — rodapé, barra lateral ou página
        &quot;Sobre&quot;. Funciona em WordPress, Wix, blog ou landing page,
        sem plugin. O selo linka direto para o seu perfil no AdvAqui.
      </div>
    </div>
  );
}
