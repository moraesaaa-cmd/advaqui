"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { isValidEmail } from "@/lib/utils/validation";
import { generateId } from "@/lib/utils/id";
import { store } from "@/lib/store/localStore";
import { toast } from "@/components/Toast";
import { SITE } from "@/lib/config";

export default function ContatoPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "", honeypot: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.honeypot) return;
    const err: Record<string, string> = {};
    if (!form.name.trim()) err.name = "Informe seu nome";
    if (!isValidEmail(form.email)) err.email = "E-mail inválido";
    if (form.message.trim().length < 10) err.message = "Escreva ao menos 10 caracteres";
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    const msg = {
      id: generateId(),
      fromUserId: "visitor",
      fromName: `${form.name} (${form.email})`,
      subject: "Contato do site",
      body: form.message,
      date: new Date().toISOString(),
      read: false
    };
    const all = store.getMessages();
    store.setMessages([...all, msg]);
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
          <button type="submit" className="btn-primary w-full">
            <Send className="w-4 h-4" aria-hidden />
            Enviar mensagem
          </button>
        </form>
      )}
    </div>
  );
}
