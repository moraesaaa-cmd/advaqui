"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { store } from "@/lib/store/localStore";
import { ADMIN_CREDENTIALS } from "@/lib/config";
import { toast } from "@/components/Toast";
import { verifyPassword } from "@/lib/auth/hash";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (
        email.trim().toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase() &&
        password === ADMIN_CREDENTIALS.password
      ) {
        store.setSession({
          userId: "admin",
          role: "admin",
          name: "Administrador",
          email: ADMIN_CREDENTIALS.email
        });
        toast("Bem-vindo, administrador");
        router.push("/admin");
        return;
      }

      const users = store.getUsers();
      const user = users.find(
        (u) => u.email === email.trim().toLowerCase()
      );
      if (!user) {
        setError("E-mail ou senha incorretos");
        return;
      }

      const ok = await verifyPassword(password, user.passwordHash);
      if (!ok) {
        setError("E-mail ou senha incorretos");
        return;
      }

      store.setSession({
        userId: user.id,
        role: "lawyer",
        name: user.name,
        email: user.email
      });
      toast(`Bem-vindo, ${user.name.split(" ")[0]}!`);
      router.push("/painel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-narrow max-w-md py-16">
      <div className="card">
        <h1 className="font-display text-2xl font-bold text-brand-ink text-center mb-1">
          Entrar
        </h1>
        <p className="text-sm text-brand-ink/60 text-center mb-6">
          Acesse seu painel de advogado
        </p>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm px-3 py-2 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor="l-email" className="label">E-mail</label>
            <input
              id="l-email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label htmlFor="l-pass" className="label">Senha</label>
            <input
              id="l-pass"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <div className="mt-4 text-center space-y-2 text-sm">
          <Link href="/recuperar-senha" className="text-brand-deep block">
            Esqueci minha senha
          </Link>
          <p className="text-brand-ink/60">
            Não tem conta?{" "}
            <Link href="/cadastro" className="text-brand-deep font-medium">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
