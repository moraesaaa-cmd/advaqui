"use client";

import { useState } from "react";
import { Send } from "lucide-react";

/**
 * Form de Pergunta de Leitor — exibido na Página Profissional pública.
 *
 * O visitante envia uma pergunta informativa. Nada aparece publicamente
 * sem aprovação do advogado. Não substitui consulta jurídica.
 *
 * Anti-spam mínimo: honeypot (campo "website" oculto que humano ignora).
 *
 * Maio/2026 — Fase 3 da Página Profissional AdvAqui.
 */

export function ReaderQuestionForm({ lawyerSlug }: { lawyerSlug: string }) {
  const [question, setQuestion] = useState("");
  const [askerName, setAskerName] = useState("");
  const [askerEmail, setAskerEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<
    { kind: "ok"; text: string } | { kind: "error"; text: string } | null
  >(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    if (question.trim().length < 10) {
      setFeedback({
        kind: "error",
        text: "Escreva uma pergunta com pelo menos 10 caracteres."
      });
      return;
    }
    setSending(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/lawyer/${lawyerSlug}/question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, askerName, askerEmail, website })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) {
        setFeedback({
          kind: "error",
          text: data.error || "Não foi possível enviar. Tente novamente."
        });
      } else {
        setFeedback({
          kind: "ok",
          text:
            "Pergunta enviada. Quando o profissional responder, sua dúvida pode aparecer na seção de Perguntas. Obrigado!"
        });
        setQuestion("");
        setAskerName("");
        setAskerEmail("");
      }
    } catch (err) {
      console.error("[ReaderQuestionForm] submit failed", err);
      setFeedback({
        kind: "error",
        text: "Erro de conexão. Tente novamente em alguns segundos."
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-xl border border-brand-line bg-white p-4 space-y-3">
      {/* Honeypot — invisível pra humanos, preenchido por bots */}
      <div
        aria-hidden
        style={{ position: "absolute", left: "-9999px", opacity: 0 }}
      >
        <label>
          Não preencha este campo
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label className="label text-xs">Sua pergunta</label>
        <textarea
          className="input min-h-24"
          placeholder="Descreva sua dúvida em poucas linhas. Evite incluir dados pessoais ou detalhes sensíveis."
          maxLength={2000}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <p className="text-[11px] text-brand-ink/55 mt-1">
          {question.length} / 2000 caracteres
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="label text-xs">Seu primeiro nome (opcional)</label>
          <input
            className="input text-sm"
            placeholder="Como prefere ser chamado"
            maxLength={80}
            value={askerName}
            onChange={(e) => setAskerName(e.target.value)}
          />
        </div>
        <div>
          <label className="label text-xs">E-mail (opcional, para te avisar da resposta)</label>
          <input
            type="email"
            className="input text-sm"
            placeholder="seu@email.com"
            maxLength={120}
            value={askerEmail}
            onChange={(e) => setAskerEmail(e.target.value)}
          />
        </div>
      </div>
      <p className="text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg p-3">
        Não envie dados pessoais, documentos ou detalhes sensíveis do seu
        caso. As respostas têm caráter informativo e não substituem consulta
        jurídica individual.
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-deep text-white text-sm font-semibold hover:bg-brand-deep/90 transition disabled:opacity-50"
        >
          <Send className="w-4 h-4" aria-hidden />
          {sending ? "Enviando..." : "Enviar pergunta"}
        </button>
        {feedback && (
          <p
            className={`text-xs ${
              feedback.kind === "ok" ? "text-emerald-700" : "text-red-700"
            }`}
            role={feedback.kind === "error" ? "alert" : "status"}
          >
            {feedback.text}
          </p>
        )}
      </div>
    </form>
  );
}
