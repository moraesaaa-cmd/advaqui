"use client";

import { useState } from "react";
import { X, Lock, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/**
 * Modal de conta grátis usado pelas ferramentas (gate de download).
 *
 * Cria conta de CIDADÃO (account_type: "cidadao" no user_metadata — o trigger
 * handle_new_user ignora esse tipo e NÃO cria perfil de advogado). Também
 * registra o lead em /api/leads/capture para aparecer no /admin/leads.
 */
export function QuickSignupModal({
  ferramenta,
  onClose,
  onSuccess
}: {
  ferramenta: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [aba, setAba] = useState<"criar" | "entrar">("criar");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [senha, setSenha] = useState("");
  const [busy, setBusy] = useState(false);
  const [erro, setErro] = useState("");

  const submit = async () => {
    setErro("");
    if (!email.trim() || senha.length < 6) {
      setErro("Informe e-mail válido e senha com pelo menos 6 caracteres.");
      return;
    }
    if (aba === "criar" && nome.trim().length < 2) {
      setErro("Informe seu nome.");
      return;
    }
    setBusy(true);
    try {
      const supabase = createClient();
      if (aba === "criar") {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password: senha,
          options: {
            data: {
              name: nome.trim(),
              account_type: "cidadao",
              whatsapp: whatsapp.trim() || null
            }
          }
        });
        if (error) {
          setErro(
            /already|registered/i.test(error.message)
              ? "Este e-mail já tem conta. Use a aba Entrar."
              : "Não foi possível criar a conta agora. Tente novamente."
          );
          return;
        }
        // Registra o lead (não bloqueia o fluxo se falhar)
        fetch("/api/leads/capture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: nome.trim(),
            email: email.trim(),
            telefone: whatsapp.trim(),
            origem: "cadastro_gratis",
            ferramenta
          })
        }).catch(() => undefined);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: senha
        });
        if (error) {
          setErro("E-mail ou senha incorretos.");
          return;
        }
      }
      onSuccess();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-ink/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Criar conta gratuita"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-brand-ink">
              Crie sua conta gratuita
            </h2>
            <p className="mt-1 text-sm text-brand-ink/70">
              É rápido: com a conta você baixa o resultado desta e de todas as outras
              ferramentas, quantas vezes quiser.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-md p-1 text-brand-ink/60 hover:bg-brand-bg hover:text-brand-ink"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="mt-4 flex rounded-md border border-brand-line p-1 text-sm font-medium">
          {(["criar", "entrar"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setAba(t);
                setErro("");
              }}
              className={`flex-1 rounded px-3 py-1.5 transition ${
                aba === t ? "bg-brand-ink text-white" : "text-brand-ink/70 hover:text-brand-ink"
              }`}
            >
              {t === "criar" ? "Criar conta" : "Já tenho conta"}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {aba === "criar" && (
            <input
              className="input w-full"
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              autoComplete="name"
            />
          )}
          <input
            className="input w-full"
            placeholder="Seu e-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          {aba === "criar" && (
            <input
              className="input w-full"
              placeholder="WhatsApp (opcional)"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              autoComplete="tel"
              inputMode="tel"
            />
          )}
          <input
            className="input w-full"
            placeholder={aba === "criar" ? "Crie uma senha (mín. 6 caracteres)" : "Sua senha"}
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete={aba === "criar" ? "new-password" : "current-password"}
          />
          {erro && <p className="text-sm text-red-700">{erro}</p>}
          <button
            type="button"
            onClick={submit}
            disabled={busy}
            className="w-full rounded-md bg-brand-accent px-4 py-2.5 font-semibold text-brand-ink transition hover:bg-brand-accent2 disabled:opacity-60"
          >
            {busy ? "Um instante..." : aba === "criar" ? "Criar conta e continuar" : "Entrar e continuar"}
          </button>
          {aba === "criar" && (
            <ul className="space-y-1 pt-1 text-xs text-brand-ink/60">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-brand-accentText" aria-hidden />
                Grátis para sempre — sem cartão de crédito
              </li>
              <li className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-brand-accentText" aria-hidden />
                Seus arquivos são apagados após o processamento
              </li>
            </ul>
          )}
          {aba === "criar" && (
            <p className="text-xs text-brand-ink/50">
              Ao criar a conta você concorda com os{" "}
              <a href="/termos" className="underline">
                termos de uso
              </a>{" "}
              e a{" "}
              <a href="/privacidade" className="underline">
                política de privacidade
              </a>
              . É advogado(a)?{" "}
              <a href="/cadastro" className="font-medium text-brand-deep underline">
                Crie seu perfil profissional
              </a>
              .
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
