"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, User as UserIcon, LogOut, LayoutDashboard, ChevronDown, Shield } from "lucide-react";
import { Logo } from "./Logo";
import { createClient } from "@/lib/supabase/client";

/**
 * Header do handoff (claude_design): barra navy #0F1B2D, altura 64px, logo
 * (pino dourado + check) à esquerda, nav clara, "Entrar" + botão branco
 * "Cadastrar advogado" à direita.
 *
 * Navegação agrupada por intenção do visitante (em vez de uma lista solta).
 *  - Conteúdo: blog (hub que reúne artigos, problemas, guias, glossário e
 *    materiais), jurisprudência, marketing
 *  - Ferramentas: calculadoras, quanto custa, modelos, tribunais
 */
const PRIMARY: Array<{ href: string; label: string }> = [
  { href: "/advogados", label: "Encontrar advogado" }
];

const GROUPS: Array<{ label: string; items: Array<{ href: string; label: string; desc?: string }> }> = [
  {
    label: "Conteúdo",
    items: [
      { href: "/blog", label: "Blog jurídico", desc: "Artigos, guias, glossário e problemas" },
      { href: "/jurisprudencia", label: "Jurisprudência", desc: "Decisões do STF e STJ por tema" },
      { href: "/problemas-juridicos", label: "Problemas jurídicos", desc: "Passo a passo do seu caso" },
      { href: "/glossario", label: "Glossário", desc: "Termos jurídicos em linguagem clara" }
    ]
  },
  {
    label: "Ferramentas",
    items: [
      { href: "/ferramentas", label: "Todas as ferramentas", desc: "Calculadoras, modelos e mais" },
      { href: "/montar-peticao", label: "Montar petição", desc: "Rascunho organizado da sua peça" },
      { href: "/calculadora-prazos", label: "Calculadora de prazos", desc: "Dias úteis e corridos" },
      { href: "/modelos", label: "Modelos de documentos", desc: "Procuração, contrato, recibo" },
      { href: "/recurso-de-multa", label: "Recurso de multa", desc: "Gere seu recurso de trânsito" }
    ]
  }
];

const TRAILING: Array<{ href: string; label: string }> = [
  { href: "/planos", label: "Para advogados" }
];

type SessionState =
  | { status: "anonymous" }
  | { status: "lawyer"; name: string; firstName: string }
  | { status: "admin"; email: string };

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Qual grupo de navegação (dropdown desktop) está aberto, se algum.
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  // Default ANÔNIMO desde o primeiro render — evita flicker do header sem
  // botões Entrar/Cadastrar enquanto a API valida quem é o visitante.
  const [session, setSession] = useState<SessionState>({ status: "anonymous" });

  // Fecha dropdowns ao navegar entre páginas.
  useEffect(() => {
    setOpenGroup(null);
    setOpen(false);
  }, [pathname]);

  // Detecta auth via /api/auth/me — endpoint server-side que sabe se é admin
  // (cookie HMAC), advogado (sessão Supabase) ou anônimo. Mais confiável que
  // chamar supabase.auth.getUser() direto do client porque a versão nova do
  // @supabase/ssr leva alguns ms pra hidratar a sessão no browser, dando
  // janela em que o Header mostraria "Entrar" mesmo com user logado.
  useEffect(() => {
    let cancelled = false;

    const sync = async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (cancelled) return;
        if (!res.ok) {
          setSession({ status: "anonymous" });
          return;
        }
        const data = (await res.json()) as {
          kind?: "admin" | "lawyer" | "anonymous";
          email?: string;
          name?: string;
          firstName?: string;
        };
        if (cancelled) return;
        if (data.kind === "admin" && data.email) {
          setSession({ status: "admin", email: data.email });
        } else if (data.kind === "lawyer" && data.name && data.firstName) {
          setSession({ status: "lawyer", name: data.name, firstName: data.firstName });
        } else {
          setSession({ status: "anonymous" });
        }
      } catch (err) {
        if (cancelled) return;
        console.warn("[Header] auth check failed", err);
        setSession({ status: "anonymous" });
      }
    };

    void sync();

    // Re-sincroniza quando a sessão Supabase muda no client (login/logout
    // dispara onAuthStateChange — chamamos /api/auth/me de novo).
    const supabase = createClient();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      void sync();
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
    // pathname no deps garante re-check ao navegar entre páginas (cobre
    // o caso de login admin sem onAuthStateChange Supabase).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const logout = async () => {
    setMenuOpen(false);
    // Limpa sessão no cliente PRIMEIRO (dispara onAuthStateChange em outras abas)
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    // Depois limpa cookies httpOnly do server (sessão SSR + cookie admin)
    await fetch("/api/auth/logout", { method: "POST" });
    setSession({ status: "anonymous" });
    router.push("/");
    router.refresh();
  };

  const linkClass =
    "px-3 py-2 rounded-lg text-sm font-medium text-[#C2CBDA] hover:text-white hover:bg-white/10 transition";

  return (
    <header className="sticky top-0 z-40 bg-[#0F1B2D]/95 backdrop-blur border-b border-white/10">
      <div className="container-tight flex items-center justify-between h-16">
        <Link href="/" className="flex items-center" aria-label="AdvAqui — página inicial">
          <Logo light />
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Principal">
          {PRIMARY.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass}>
              {item.label}
            </Link>
          ))}

          {GROUPS.map((group) => (
            <div key={group.label} className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenGroup((cur) => (cur === group.label ? null : group.label))
                }
                aria-expanded={openGroup === group.label}
                aria-haspopup="menu"
                className={`${linkClass} inline-flex items-center gap-1`}
              >
                {group.label}
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${openGroup === group.label ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </button>
              {openGroup === group.label && (
                <>
                  <button
                    type="button"
                    aria-label="Fechar menu"
                    onClick={() => setOpenGroup(null)}
                    className="fixed inset-0 z-30 cursor-default"
                  />
                  <div
                    role="menu"
                    className="absolute left-0 mt-2 z-40 w-64 rounded-xl bg-white border border-brand-line shadow-cardHover overflow-hidden py-1"
                  >
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        role="menuitem"
                        href={item.href}
                        onClick={() => setOpenGroup(null)}
                        className="block px-4 py-2.5 text-sm text-brand-ink hover:bg-brand-line/40 hover:text-brand-deep transition"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}

          {TRAILING.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass}>
              {item.label}
            </Link>
          ))}

          <div className="ml-2 flex items-center gap-2">
            {session.status === "lawyer" || session.status === "admin" ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 text-white hover:bg-white/15 transition text-sm font-medium"
                >
                  {session.status === "admin" ? (
                    <Shield className="w-4 h-4" aria-hidden />
                  ) : (
                    <UserIcon className="w-4 h-4" aria-hidden />
                  )}
                  <span>
                    {session.status === "admin" ? (
                      <>
                        <strong>Admin</strong>
                      </>
                    ) : (
                      <>
                        Olá, <strong>{session.firstName}</strong>
                      </>
                    )}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5" aria-hidden />
                </button>
                {menuOpen && (
                  <>
                    {/* overlay invisível pra fechar ao clicar fora */}
                    <button
                      type="button"
                      aria-label="Fechar menu"
                      onClick={() => setMenuOpen(false)}
                      className="fixed inset-0 z-30 cursor-default"
                    />
                    <div
                      role="menu"
                      className="absolute right-0 mt-2 z-40 w-56 rounded-xl bg-white border border-brand-line shadow-cardHover overflow-hidden"
                    >
                      <Link
                        role="menuitem"
                        href={session.status === "admin" ? "/admin" : "/painel"}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-brand-ink hover:bg-brand-line/40"
                      >
                        <LayoutDashboard className="w-4 h-4 text-brand-deep" aria-hidden />
                        {session.status === "admin" ? "Painel admin" : "Meu painel"}
                      </Link>
                      <button
                        role="menuitem"
                        type="button"
                        onClick={logout}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-red-700 hover:bg-red-50 w-full text-left border-t border-brand-line"
                      >
                        <LogOut className="w-4 h-4" aria-hidden />
                        Sair
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-[#C2CBDA] hover:text-white px-3 py-2 rounded-lg transition"
                >
                  Entrar
                </Link>
                <Link
                  href="/cadastro"
                  className="text-sm font-semibold rounded-lg py-2 px-4 bg-white text-[#0F1B2D] hover:bg-white/90 transition"
                >
                  Cadastrar advogado
                </Link>
              </>
            )}
          </div>
        </nav>

        <button
          className="md:hidden p-2 -mr-2 text-white"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-[#0F1B2D] max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="container-tight py-3 space-y-1">
            {PRIMARY.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-3 rounded-lg text-base font-semibold text-white hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}

            {GROUPS.map((group) => (
              <div key={group.label} className="pt-2">
                <p className="px-3 pb-1 text-xs font-bold uppercase tracking-wide text-white/50">
                  {group.label}
                </p>
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-base font-medium text-[#C2CBDA] hover:text-white hover:bg-white/10"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ))}

            {TRAILING.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-3 rounded-lg text-base font-semibold text-white hover:bg-white/10 mt-2"
              >
                {item.label}
              </Link>
            ))}

            <div className="pt-2 flex flex-col gap-2 border-t border-white/10 mt-2">
              {session.status === "lawyer" || session.status === "admin" ? (
                <>
                  <p className="px-3 text-xs text-white/60">
                    {session.status === "admin" ? (
                      <>Logado como <strong className="text-white">Admin</strong></>
                    ) : (
                      <>Logado como <strong className="text-white">{session.firstName}</strong></>
                    )}
                  </p>
                  <Link
                    href={session.status === "admin" ? "/admin" : "/painel"}
                    onClick={() => setOpen(false)}
                    className="justify-center inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-[#0F1B2D] font-semibold hover:bg-white/90 transition"
                  >
                    <LayoutDashboard className="w-4 h-4" aria-hidden />
                    {session.status === "admin" ? "Painel admin" : "Meu painel"}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      void logout();
                    }}
                    className="justify-center inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-300 hover:bg-white/10 transition"
                  >
                    <LogOut className="w-4 h-4" aria-hidden />
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white border border-white/25 hover:bg-white/10 transition font-medium"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/cadastro"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-[#0F1B2D] font-semibold hover:bg-white/90 transition"
                  >
                    Cadastrar advogado
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
