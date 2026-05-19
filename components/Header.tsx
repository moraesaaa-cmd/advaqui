"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, User as UserIcon, LogOut, LayoutDashboard, ChevronDown, Shield } from "lucide-react";
import { Logo } from "./Logo";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/advogados", label: "Diretório" },
  { href: "/blog", label: "Blog" },
  { href: "/modelos", label: "Modelos" },
  { href: "/marketing-juridico", label: "Marketing" },
  { href: "/planos", label: "Planos" }
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
  // Default ANÔNIMO desde o primeiro render — evita flicker do header sem
  // botões Entrar/Cadastrar enquanto a API valida quem é o visitante.
  const [session, setSession] = useState<SessionState>({ status: "anonymous" });

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

  return (
    <header className="sticky top-0 z-40 bg-brand-bg/95 backdrop-blur border-b border-brand-line">
      <div className="container-tight flex items-center justify-between h-16">
        <Link href="/" className="flex items-center" aria-label="AdvAqui — página inicial">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center gap-1" aria-label="Principal">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 rounded-lg text-sm font-medium text-brand-ink hover:bg-brand-line/60 transition"
            >
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
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-deep/10 text-brand-ink hover:bg-brand-deep/15 transition text-sm font-medium"
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
                <Link href="/login" className="btn-ghost text-sm">Entrar</Link>
                <Link href="/cadastro" className="btn-accent text-sm py-2 px-4">Cadastrar advogado</Link>
              </>
            )}
          </div>
        </nav>
        <button
          className="md:hidden p-2 -mr-2"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-brand-line bg-brand-bg">
          <div className="container-tight py-3 space-y-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-3 rounded-lg text-base font-medium text-brand-ink hover:bg-brand-line/60"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-2 border-t border-brand-line mt-2">
              {session.status === "lawyer" || session.status === "admin" ? (
                <>
                  <p className="px-3 text-xs text-brand-ink/60">
                    {session.status === "admin" ? (
                      <>Logado como <strong className="text-brand-ink">Admin</strong></>
                    ) : (
                      <>Logado como <strong className="text-brand-ink">{session.firstName}</strong></>
                    )}
                  </p>
                  <Link
                    href={session.status === "admin" ? "/admin" : "/painel"}
                    onClick={() => setOpen(false)}
                    className="btn-primary justify-center inline-flex items-center gap-2"
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
                    className="btn-ghost justify-center inline-flex items-center gap-2 text-red-700"
                  >
                    <LogOut className="w-4 h-4" aria-hidden />
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="btn-ghost justify-center">
                    Entrar
                  </Link>
                  <Link href="/cadastro" onClick={() => setOpen(false)} className="btn-accent justify-center">
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
