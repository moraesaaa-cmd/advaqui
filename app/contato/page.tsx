"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { isValidEmail } from "@/lib/utils/validation";
import { toast } from "@/components/Toast";
import { SITE } from "@/lib/config";
import { createClient } from "@/lib/supabase/client";

export default function ContatoPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "", honeypot: "" });
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
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.from("messages").insert({
      from_user_id: null,
      from_name: form.name.trim(),
      from_email: form.email.trim().toLowerCase(),
      subject: "Contato do site",
      body: form.message.trim(),
      source: "contact_form"
    });
    setSubmitting(false);

    if (error) {
      toast("Erro ao enviar. Tente novamente em instantes.", "error");
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
          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            <Send className="w-4 h-4" aria-hidden />
            {submitting ? "Enviando…" : "Enviar mensagem"}
          </button>
        </form>
      )}
    </div>
  );
}
