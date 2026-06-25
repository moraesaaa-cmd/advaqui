"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { Lock, UserPlus, LogIn } from "lucide-react";

type AuthState = "loading" | "logged-in" | "anonymous";

export function ToolGate({
  children,
  title = "Acesse esta ferramenta",
  description = "Crie uma conta gratuita ou faça login para usar esta ferramenta."
}: {
  children: ReactNode;
  title?: string;
  description?: string;
}) {
  const [auth, setAuth] = useState<AuthState>("loading");

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.kind === "admin" || data?.kind === "lawyer") {
          setAuth("logged-in");
        } else {
          setAuth("anonymous");
        }
      })
      .catch(() => setAuth("anonymous"));
  }, []);

  if (auth === "loading") {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-brand-deep/30 border-t-brand-deep rounded-full animate-spin" />
      </div>
    );
  }

  if (auth === "logged-in") return <>{children}</>;

  return (
    <div className="max-w-lg mx-auto text-center py-16 px-6">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
        style={{ background: "rgba(200,162,74,0.12)" }}
      >
        <Lock className="w-7 h-7" style={{ color: "#A0843A" }} />
      </div>
      <h2 className="font-display text-2xl font-semibold text-brand-ink mb-3">
        {title}
      </h2>
      <p className="text-brand-ink/60 mb-8 leading-relaxed">
        {description}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/cadastro"
          className="inline-flex items-center justify-center gap-2 font-bold text-[15px] px-6 py-3.5 rounded-xl"
          style={{ background: "#C8A24A", color: "#0F1B2D" }}
        >
          <UserPlus className="w-4 h-4" />
          Criar conta grátis
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 font-semibold text-[15px] px-6 py-3.5 rounded-xl border border-brand-line text-brand-ink hover:bg-brand-line/30 transition"
        >
          <LogIn className="w-4 h-4" />
          Já tenho conta
        </Link>
      </div>
      <p className="text-xs text-brand-ink/40 mt-6">
        O cadastro é gratuito e leva menos de 1 minuto.
      </p>
    </div>
  );
}
