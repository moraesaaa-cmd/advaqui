"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { isValidEmail } from "@/lib/utils/validation";
import { store } from "@/lib/store/localStore";
import { toast } from "@/components/Toast";

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!isValidEmail(email)) {
      setError("E-mail inválido");
      return;
    }
    const users = store.getUsers();
    const exists = users.find((u) => u.email === email.trim().toLowerCase());
    setSent(true);
    if (exists) {
      toast("Se o e-mail estiver cadastrado, você receberá as instruções (simulado).");
    } else {
      toast("Se o e-mail estiver cadastrado, você receberá as instruções (simulado).");
    }
  };

  return (
    <div className="container-narrow max-w-md py-16">
      <div className="card">
        <h1 className="font-display text-2xl font-bold text-brand-ink mb-2">
          Recuperar senha
        </h1>
        {sent ? (
          <div className="text-center py-6">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-3" aria-hidden />
            <p className="text-brand-ink/80">
              Se o e-mail estiver cadastrado, você receberá as instruções de recuperação em alguns
              minutos.
            </p>
            <Link href="/login" className="mt-4 inline-block text-brand-deep font-medium">
              Voltar para o login
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-brand-ink/70 mb-4">
              Informe o e-mail cadastrado. Enviaremos instruções para criar uma nova senha.
            </p>
            <form onSubmit={submit} className="space-y-4">
              <input
                type="email"
                className="input"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
              {error && <p className="text-red-600 text-xs">{error}</p>}
              <button type="submit" className="btn-primary w-full">
                Enviar instruções
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
