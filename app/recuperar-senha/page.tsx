"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, Mail, ArrowLeft } from "lucide-react";
import { isValidEmail } from "@/lib/utils/validation";
import { store } from "@/lib/store/localStore";
import { SITE } from "@/lib/config";

/**
 * Página de recuperação de senha.
 *
 * Estado atual — envio de e-mail transacional ainda não está integrado
 * (planejado via Resend ou similar quando o domínio for finalizado).
 * Esta tela é honesta com o usuário — não simula sucesso falso.
 *
 * Comportamento:
 *  - Confirma se o e-mail existe no localStorage (advogados cadastrados)
 *  - Mostra mensagem clara sobre a limitação
 *  - Orienta a entrar em contato direto com o suporte via mailto
 */
export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"form" | "result">("form");
  const [emailExists, setEmailExists] = useState(false);
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isValidEmail(email)) {
      setError("Informe um e-mail válido.");
      return;
    }

    const trimmed = email.trim().toLowerCase();
    const users = store.getUsers();
    const found = users.some((u) => u.email === trimmed);
    setEmailExists(found);
    setStep("result");
  };

  const supportMail = `mailto:${SITE.supportEmail}?subject=${encodeURIComponent(
    "Recuperar senha do AdvAqui"
  )}&body=${encodeURIComponent(
    `Olá, preciso recuperar a senha da minha conta.\n\nE-mail cadastrado: ${email}\n\nObrigado.`
  )}`;

  if (step === "result") {
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

          <div className="flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-200 p-4 mb-4">
            <AlertCircle
              className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5"
              aria-hidden
            />
            <div className="text-sm text-amber-900">
              <p className="font-semibold mb-1">
                Recuperação automática indisponível por enquanto
              </p>
              <p className="leading-relaxed">
                O envio automático de e-mails de recuperação ainda está sendo
                configurado. Para redefinir sua senha agora, entre em contato com
                o suporte usando o botão abaixo.
              </p>
            </div>
          </div>

          <p className="text-sm text-brand-ink/80 mb-4">
            E-mail informado:{" "}
            <strong className="font-mono break-all">{email}</strong>
          </p>

          {emailExists && (
            <p className="text-sm text-emerald-700 mb-4">
              Encontramos uma conta com esse e-mail. Cite-o ao falar com o suporte.
            </p>
          )}

          <a href={supportMail} className="btn-primary w-full justify-center">
            <Mail className="w-4 h-4" aria-hidden />
            Enviar e-mail ao suporte
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
          <button type="submit" className="btn-primary w-full">
            Continuar
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
