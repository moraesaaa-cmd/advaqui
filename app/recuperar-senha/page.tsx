"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { isValidEmail } from "@/lib/utils/validation";
import { SITE } from "@/lib/config";
import { createClient } from "@/lib/supabase/client";

/**
 * Página de recuperação de senha.
 *
 * Usa Supabase Auth `resetPasswordForEmail` — o Supabase envia um e-mail
 * com um link único de redefinição. Funciona automaticamente assim que o
 * SMTP do projeto está configurado (Supabase usa SMTP de teste por padrão
 * no plano free — entrega ~3 e-mails/hora). Para produção sem limite,
 * configure SMTP custom em Project Settings → Auth → SMTP Settings.
 */
export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"form" | "sent">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isValidEmail(email)) {
      setError("Informe um e-mail válido.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: supaError } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/redefinir-senha`
      }
    );
    setLoading(false);

    // Não revela se o e-mail existe ou não (prevenção de enumeração de usuários).
    // Sempre mostra "se o e-mail estiver cadastrado, você receberá...".
    if (supaError) {
      // Erro real de servidor — mostra mensagem genérica.
      setError(
        "Não conseguimos processar agora. Tente novamente ou contate o suporte."
      );
      return;
    }
    setStep("sent");
  };

  const supportMail = `mailto:${SITE.supportEmail}?subject=${encodeURIComponent(
    "Recuperar senha do AdvAqui"
  )}&body=${encodeURIComponent(
    `Olá, preciso recuperar a senha da minha conta.\n\nE-mail cadastrado: ${email}\n\nObrigado.`
  )}`;

  if (step === "sent") {
    return (
      <div className="container-narrow max-w-md py-16">
        <div className="card">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-sm text-brand-deep hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden />
            Voltar ao login
          </Link>

          <div className="text-center py-4">
            <CheckCircle
              className="w-14 h-14 text-emerald-600 mx-auto mb-3"
              aria-hidden
            />
            <h1 className="font-display text-xl font-bold text-brand-ink mb-2">
              Verifique seu e-mail
            </h1>
            <p className="text-sm text-brand-ink/80 leading-relaxed mb-4">
              Se houver uma conta cadastrada com{" "}
              <strong className="font-mono break-all">{email}</strong>, você
              receberá em alguns minutos um e-mail com um link para redefinir a
              senha. Verifique também a caixa de spam.
            </p>
          </div>

          <a href={supportMail} className="btn-ghost border border-brand-line w-full justify-center text-sm">
            <Mail className="w-4 h-4" aria-hidden />
            Não recebeu? Fale com o suporte
          </a>

          <p className="text-xs text-brand-ink/50 text-center mt-4">
            O suporte responde em até 48 horas úteis. Pelo {SITE.supportEmail}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-narrow max-w-md py-16">
      <div className="card">
        <h1 className="font-display text-2xl font-bold text-brand-ink mb-2">
          Recuperar senha
        </h1>
        <p className="text-sm text-brand-ink/70 mb-4 leading-relaxed">
          Informe o e-mail cadastrado. Vamos confirmar se a conta existe e te
          ajudar a redefinir a senha.
        </p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor="r-email" className="label">
              E-mail cadastrado
            </label>
            <input
              id="r-email"
              type="email"
              className="input"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
              required
            />
            {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Enviando…" : "Enviar link de recuperação"}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-brand-line text-center text-sm">
          <Link
            href="/login"
            className="text-brand-deep font-medium hover:underline"
          >
            ← Voltar ao login
          </Link>
        </div>
      </div>
    </div>
  );
}
