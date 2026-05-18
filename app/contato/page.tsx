"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { isValidEmail } from "@/lib/utils/validation";
import { toast } from "@/components/Toast";
import { SITE } from "@/lib/config";
import { createClient } from "@/lib/supabase/client";

const LGPD_CONSENT_TEXT =
  "Li e concordo com a Política de Privacidade e autorizo o tratamento dos meus dados " +
  "pessoais com a finalidade de resposta a esta mensagem (art. 7º, V e art. 8º da LGPD).";

export default function ContatoPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    acceptLgpd: false,
    honeypot: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.honeypot) return;
    const err: Record<string, string> = {};
    if (!form.name.trim()) err.name = "Informe seu nome";
    if (!isValidEmail(form.email)) err.email = "E-mail inválido";
    if (form.message.trim().length < 10) err.message = "Escreva ao menos 10 caracteres";
    if (!form.acceptLgpd) err.acceptLgpd = "É necessário aceitar o tratamento dos dados";
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    setSubmitting(true);
    const supabase = createClient();
    // Persiste consentimento LGPD junto da mensagem (timestamp + texto exato exibido)
    // anexado ao corpo. Quando houver tabela dedicada de consentimentos, migrar pra lá.
    const consentSuffix =
      `\n\n---\n[Consentimento LGPD] Aceito em ${new Date().toISOString()}\n` +
      `Texto exibido: "${LGPD_CONSENT_TEXT}"`;
    const { error } = await supabase.from("messages").insert({
      from_user_id: null,
      from_name: form.name.trim(),
      from_email: form.email.trim().toLowerCase(),
      subject: "Contato do site",
      body: form.message.trim() + consentSuffix,
      source: "contact_form"
    });
    setSubmitting(false);

    if (error) {
      console.error("[contato] insert failed", error);
      toast(`Erro ao enviar — ${error.message}`, "error");
      return;
    }
    setSent(true);
    toast("Mensagem enviada. Responderemos pelo e-mail informado.");
  };

  return (
    <div className="container-narrow py-12">
      <h1 className="font-display text-4xl font-bold text-brand-ink mb-3">Fale conosco</h1>
      <p className="text-brand-ink/70 mb-8">
        Dúvidas, sugestões, parcerias ou problemas técnicos. Escreva e responderemos em até 48 horas
        úteis pelo {SITE.email}.
      </p>

      {sent ? (
        <div className="card text-center">
          <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-3" aria-hidden />
          <p className="font-semibold text-brand-ink">Mensagem enviada</p>
          <p className="text-sm text-brand-ink/70 mt-1">
            Responderemos em breve pelo e-mail informado.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="card space-y-4">
          <input
            type="text"
            name="company"
            value={form.honeypot}
            onChange={(e) => setForm((p) => ({ ...p, honeypot: e.target.value }))}
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden
          />
          <div>
            <label className="label" htmlFor="contact-name">Nome</label>
            <input
              id="contact-name"
              className="input"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              autoComplete="name"
              required
            />
            {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="label" htmlFor="contact-email">E-mail</label>
            <input
              id="contact-email"
              type="email"
              className="input"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              autoComplete="email"
              required
            />
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="label" htmlFor="contact-message">Mensagem</label>
            <textarea
              id="contact-message"
              className="input min-h-32 resize-y"
              value={form.message}
              onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
              required
            />
            {errors.message && <p className="text-red-600 text-xs mt-1">{errors.message}</p>}
          </div>
          <div className="rounded-xl border border-brand-line bg-brand-bg p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.acceptLgpd}
                onChange={(e) => setForm((p) => ({ ...p, acceptLgpd: e.target.checked }))}
                className="mt-1 flex-shrink-0"
              />
              <span className="text-sm text-brand-ink/85 leading-relaxed">
                Li e concordo com a{" "}
                <a href="/privacidade" className="text-brand-deep underline font-medium">
                  Política de Privacidade
                </a>{" "}
                e autorizo o tratamento dos meus dados pessoais com a finalidade de resposta
                a esta mensagem (art. 7º, V e art. 8º da{" "}
                <abbr title="Lei Geral de Proteção de Dados — Lei 13.709/2018">LGPD</abbr>).
              </span>
            </label>
            {errors.acceptLgpd && (
              <p className="text-red-600 text-xs mt-2 ml-7">{errors.acceptLgpd}</p>
            )}
          </div>
          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            <Send className="w-4 h-4" aria-hidden />
            {submitting ? "Enviando…" : "Enviar mensagem"}
          </button>
        </form>
      )}
    </div>
  );
}
