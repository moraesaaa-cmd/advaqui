"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AlertCircle, KeyRound } from "lucide-react";
import { toast } from "@/components/Toast";
import { createClient } from "@/lib/supabase/client";

type AdminResponse = {
  ok: boolean;
  email?: string;
  error?: string;
  attemptsRemaining?: number;
  lockedSeconds?: number;
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (lockedUntil === null) return;
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, [lockedUntil]);

  const isLocked = lockedUntil !== null && lockedUntil > now;
  const lockSecondsRemaining = isLocked
    ? Math.ceil((lockedUntil! - now) / 1000)
    : 0;

  const focusPassword = () => {
    setTimeout(() => {
      passwordRef.current?.focus();
      passwordRef.current?.select();
    }, 100);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    setError("");
    setLoading(true);

    try {
      // 1. Tenta login admin via endpoint server-side (que lê .env do servidor).
      const res = await fetch("/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password })
      });
      const data: AdminResponse = await res.json().catch(() => ({ ok: false }));

      if (res.ok && data.ok) {
        // Cookie httpOnly assinado já setado pelo endpoint via setAdminCookie.
        toast("Bem-vindo, administrador");
        router.push("/admin");
        router.refresh();
        return;
      }

      // Caso de rate limit (429) — não tenta lawyer.
      if (res.status === 429) {
        setLockedUntil(Date.now() + (data.lockedSeconds || 0) * 1000);
        setError(data.error || "Muitas tentativas. Aguarde alguns minutos.");
        setPassword("");
        return;
      }

      // 2. Se não bateu como admin, tenta como advogado via Supabase Auth.
      const supabase = createClient();
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password
        });

      if (!signInError && signInData.user) {
        const userName =
          (signInData.user.user_metadata?.name as string) || signInData.user.email || "";
        toast(`Bem-vindo, ${userName.split(" ")[0] || "advogado"}!`);
        router.push("/painel");
        router.refresh();
        return;
      }

      // Falhou em ambos os caminhos.
      if (typeof data.attemptsRemaining === "number") {
        setAttemptsRemaining(data.attemptsRemaining);
        setError(
          data.attemptsRemaining > 0
            ? `E-mail ou senha incorretos. Restam ${data.attemptsRemaining} tentativa(s) antes do bloqueio temporário.`
            : "Conta bloqueada temporariamente."
        );
      } else {
        setError(data.error || "E-mail ou senha incorretos.");
      }
      setPassword("");
      focusPassword();
    } catch (err) {
      setError("Erro de conexão. Tente novamente.");
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
          <div
            role="alert"
            className="rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm px-3 py-3 mb-4 flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden />
            <div className="flex-1">
              <p>{error}</p>
              {isLocked && (
                <p className="text-xs text-red-700 mt-1">
                  Desbloqueio em {lockSecondsRemaining}s. Ou{" "}
                  <Link href="/recuperar-senha" className="underline font-medium">
                    recupere sua senha
                  </Link>
                  .
                </p>
              )}
            </div>
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
              autoFocus
              disabled={isLocked}
              required
            />
          </div>
          <div>
            <label htmlFor="l-pass" className="label">Senha</label>
            <input
              id="l-pass"
              ref={passwordRef}
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={isLocked}
              required
            />
            {attemptsRemaining !== null && attemptsRemaining > 0 && !error && (
              <p className="text-xs text-brand-ink/60 mt-1">
                {attemptsRemaining} tentativa(s) restantes antes do bloqueio.
              </p>
            )}
          </div>
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading || isLocked}
          >
            {loading ? "Entrando…" : isLocked ? `Bloqueado (${lockSecondsRemaining}s)` : "Entrar"}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-brand-line text-center space-y-3 text-sm">
          <Link
            href="/recuperar-senha"
            className="inline-flex items-center justify-center gap-1.5 text-brand-deep font-medium hover:underline"
          >
            <KeyRound className="w-3.5 h-3.5" aria-hidden />
            Esqueci minha senha
          </Link>
          <p className="text-brand-ink/60">
            Não tem conta?{" "}
            <Link href="/cadastro" className="text-brand-deep font-medium hover:underline">
              Cadastre-se gratuitamente
            </Link>
          </p>
        </div>
      </div>

      <p className="text-xs text-brand-ink/50 text-center mt-4">
        Após 5 tentativas erradas, o acesso é bloqueado por 5 minutos para sua segurança.
      </p>
    </div>
  );
}
