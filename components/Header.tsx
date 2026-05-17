"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";

const NAV = [
  { href: "/", label: "Início" },
  { href: "/advogados", label: "Diretório" },
  { href: "/planos", label: "Planos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/faq", label: "Perguntas" },
  { href: "/contato", label: "Contato" }
];

export function Header() {
  const [open, setOpen] = useState(false);
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
            <Link href="/login" className="btn-ghost text-sm">Entrar</Link>
            <Link href="/cadastro" className="btn-accent text-sm py-2 px-4">Cadastrar advogado</Link>
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
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/login" onClick={() => setOpen(false)} className="btn-ghost justify-center">
                Entrar
              </Link>
              <Link href="/cadastro" onClick={() => setOpen(false)} className="btn-accent justify-center">
                Cadastrar advogado
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
