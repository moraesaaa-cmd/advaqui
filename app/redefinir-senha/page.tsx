"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import { isStrongPassword } from "@/lib/utils/validation";
import { createClient } from "@/lib/supabase/client";

/**
 * Página de redefinição de senha — recebe o link do Supabase Auth.
 *
 * Quando o usuário clica no link enviado por e-mail, o Supabase já cria
 * uma sessão temporária no navegador, autorizada apenas para a operação
 * `updateUser({ password })`. Então a página apenas pede a nova senha e
 * confirma.
 */
export default function RedefinirSenhaPage() {
  const router = useRouter();
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sessionReady, setSessionReady] = useState<null | boolean>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setSessionReady(!!data.session);
    });
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isStrongPassword(pass)) {
      setError("Senha fraca. Mínimo 8 caracteres com letras e números.");
      return;
    }
    if (pass !== confirmPass) {
      setError("As duas senhas devem ser idênticas.");
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    const { error: supaError } = await supabase.auth.updateUser({
      password: pass
    });
    setSubmitting(false);

    if (supaError) {
      setError(supaError.message);
      return;
    }
    setSuccess(true);
    setTimeout(() => router.push("/painel"), 2500);
  };

  if (success) {
    return (
      <div className="container-narrow max-w-md py-16">
        <div className="card text-center">
          <CheckCircle className="w-14 h-14 text-emerald-600 mx-auto mb-3" aria-hidden />
          <h1 className="font-display text-xl font-bold text-brand-ink mb-2">
            Senha alterada
          </h1>
          <p className="text-sm text-brand-ink/70 mb-4">
            Você já está logado. Redirecionando para o painel…
          </p>
          <Link href="/painel" className="btn-primary justify-center">
            Ir para o painel agora
          </Link>
        </div>
      </div>
    );
  }

  if (sessionReady === false) {
    return (
      <div className="container-narrow max-w-md py-16">
        <div className="card">
          <div className="flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-200 p-4 mb-4">
            <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" aria-hidden />
            <div className="text-sm text-amber-900">
              <p className="font-semibold mb-1">Link inválido ou expirado</p>
              <p className="leading-relaxed">
                O link de recuperação não funcionou. Pode ter expirado (validade
                de 1 hora) ou já ter sido usado. Solicite um novo.
              </p>
            </div>
          </div>
          <Link href="/recuperar-senha" className="btn-primary w-full justify-center">
            Solicitar novo link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-narrow max-w-md py-16">
      <div className="card">
        <h1 className="font-display text-2xl font-bold text-brand-ink mb-2">
          Nova senha
        </h1>
        <p className="text-sm text-brand-ink/70 mb-6">
          Defina sua nova senha. Mínimo 8 caracteres com letras e números.
        </p>

        {error && (
          <div role="alert" className="rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm px-3 py-2 mb-4 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div className="relative">
            <label className="label">Nova senha</label>
            <input
              type={showPass ? "text" : "password"}
              className="input pr-10"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              autoComplete="new-password"
              autoFocus
              required
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-9 text-brand-ink/40"
              aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div>
            <label className="label">Confirmar nova senha</label>
            <input
              type="password"
              className="input"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting ? "Salvando…" : "Definir nova senha"}
          </button>
        </form>
      </div>
    </div>
  );
}
