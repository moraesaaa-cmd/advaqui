"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, User as UserIcon, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { Logo } from "./Logo";
import { createClient } from "@/lib/supabase/client";
import { titleCaseNameBR } from "@/lib/utils/format";

const NAV = [
  { href: "/", label: "Início" },
  { href: "/advogados", label: "Diretório" },
  { href: "/planos", label: "Planos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/faq", label: "Perguntas" },
  { href: "/contato", label: "Contato" }
];

type SessionState =
  | { status: "anonymous" }
  | { status: "logged"; name: string; firstName: string };

export function Header() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Default ANÔNIMO desde o primeiro render (evita flicker do header sem botões
  // Entrar/Cadastrar enquanto detecta auth). Se houver sessão, o useEffect
  // abaixo substitui pelo dropdown com nome.
  const [session, setSession] = useState<SessionState>({ status: "anonymous" });

  // Detecta auth do advogado via Supabase. Admin tem fluxo próprio em /admin,
  // não exibe nada no header global por enquanto.
  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    const sync = async () => {
      const { data } = await supabase.auth.getUser();
      if (cancelled) return;
      if (!data.user) {
        setSession({ status: "anonymous" });
        return;
      }
      const metadataName = data.user.user_metadata?.name as string | undefined;
      const full = metadataName
        ? titleCaseNameBR(metadataName)
        : data.user.email || "Advogado";
      const firstName = full.trim().split(/\s+/)[0] || "Advogado";
      setSession({ status: "logged", name: full, firstName });
    };

    sync();

    // Reage a mudanças de sessão (login/logout em outra aba ou pós-redirect)
    const { data: sub } = supabase.auth.onAuthStateChange(() => sync());
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    setMenuOpen(false);
    // Limpa sessão no cliente PRIMEIRO (dispara onAuthStateChange em outras abas)
    const supabase = createClient();
    await supabase.auth.signOut();
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
            {session.status === "logged" ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-deep/10 text-brand-ink hover:bg-brand-deep/15 transition text-sm font-medium"
                >
                  <UserIcon className="w-4 h-4" aria-hidden />
                  <span>
                    Olá, <strong>{session.firstName}</strong>
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
                        href="/painel"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-brand-ink hover:bg-brand-line/40"
                      >
                        <LayoutDashboard className="w-4 h-4 text-brand-deep" aria-hidden />
                        Meu painel
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
              {session.status === "logged" ? (
                <>
                  <p className="px-3 text-xs text-brand-ink/60">
                    Logado como <strong className="text-brand-ink">{session.firstName}</strong>
                  </p>
                  <Link
                    href="/painel"
                    onClick={() => setOpen(false)}
                    className="btn-primary justify-center inline-flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" aria-hidden />
                    Meu painel
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
