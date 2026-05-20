"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  EyeOff,
  HelpCircle,
  ShieldOff,
  Trash2,
  X
} from "lucide-react";
import { toast } from "@/components/Toast";

/**
 * /painel/perguntas — Moderação das Perguntas de Leitores (premium).
 *
 * O advogado vê todas as perguntas pendentes, aprovadas, respondidas,
 * rejeitadas, spam e ocultas. Pode aprovar, responder, ocultar, marcar
 * como spam ou rejeitar.
 *
 * Maio/2026 — Fase 3 da Página Profissional AdvAqui.
 */

type Status = "pending" | "approved" | "answered" | "rejected" | "spam" | "hidden";

type Question = {
  id: string;
  question: string;
  answer: string | null;
  asker_name: string | null;
  asker_email: string | null;
  status: Status;
  rejected_reason: string | null;
  answered_at: string | null;
  created_at: string;
};

const STATUS_LABELS: Record<Status, { text: string; tone: string }> = {
  pending: { text: "Pendente", tone: "bg-amber-100 text-amber-900 border-amber-200" },
  approved: { text: "Aprovada", tone: "bg-blue-100 text-blue-800 border-blue-200" },
  answered: { text: "Respondida", tone: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  rejected: { text: "Rejeitada", tone: "bg-slate-200 text-slate-700 border-slate-300" },
  spam: { text: "Spam", tone: "bg-red-100 text-red-800 border-red-200" },
  hidden: { text: "Oculta", tone: "bg-brand-line/40 text-brand-ink/65 border-brand-line" }
};

export default function PainelPerguntasPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [migrationPending, setMigrationPending] = useState(false);
  const [answering, setAnswering] = useState<{ id: string; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setMigrationPending(false);
    try {
      const res = await fetch("/api/painel/questions", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (res.status === 503 && data.code === "migration_pending") {
        setMigrationPending(true);
        setQuestions([]);
      } else if (!res.ok || data.ok === false) {
        toast(data.error || "Erro ao carregar.", "error");
      } else {
        setQuestions(data.questions || []);
      }
    } catch (err) {
      console.error("[painel/perguntas] load failed", err);
      toast("Erro de conexão.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const updateQuestion = async (id: string, payload: Record<string, unknown>) => {
    try {
      const res = await fetch(`/api/painel/questions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) {
        toast(data.error || "Não foi possível atualizar.", "error");
        return false;
      }
      await load();
      return true;
    } catch (err) {
      console.error("[painel/perguntas] update failed", err);
      toast("Erro de conexão.", "error");
      return false;
    }
  };

  const approve = (q: Question) => void updateQuestion(q.id, { status: "approved" });
  const hide = (q: Question) => void updateQuestion(q.id, { status: "hidden" });
  const markSpam = (q: Question) =>
    window.confirm("Marcar como spam? A pergunta deixa de aparecer pra você.")
      ? void updateQuestion(q.id, { status: "spam" })
      : null;
  const reject = (q: Question) => {
    const reason = window.prompt(
      "Motivo da rejeição (opcional, vai para histórico)?",
      ""
    );
    if (reason === null) return;
    void updateQuestion(q.id, { status: "rejected", rejected_reason: reason });
  };

  const saveAnswer = async () => {
    if (!answering || saving) return;
    if (answering.text.trim().length < 5) {
      toast("Escreva uma resposta com pelo menos 5 caracteres.", "error");
      return;
    }
    setSaving(true);
    const ok = await updateQuestion(answering.id, {
      answer: answering.text,
      status: "answered"
    });
    setSaving(false);
    if (ok) {
      toast("Resposta publicada na sua Página Profissional.");
      setAnswering(null);
    }
  };

  return (
    <div className="container-tight py-10">
      <div className="mb-6">
        <Link
          href="/painel"
          className="inline-flex items-center gap-1 text-sm text-brand-deep hover:text-brand-accent2 mb-2"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden />
          Voltar ao painel
        </Link>
        <h1 className="font-display text-3xl font-bold text-brand-ink">
          Perguntas de leitores
        </h1>
        <p className="text-sm text-brand-ink/65 mt-1 max-w-prose">
          Visitantes podem enviar perguntas informativas. Nada aparece
          publicamente sem sua aprovação. Suas respostas têm caráter
          informativo e não substituem consulta individual.
        </p>
      </div>

      {migrationPending && (
        <div className="card border-amber-200 bg-amber-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" aria-hidden />
            <div>
              <p className="font-semibold text-amber-900">
                Recurso ainda em liberação
              </p>
              <p className="text-sm text-amber-900/85 mt-1">
                As perguntas de leitores dependem de uma atualização do banco
                que ainda não foi aplicada. Avise o suporte (migration 0006
                pendente).
              </p>
              <Link
                href="/contato"
                className="inline-flex items-center text-sm text-amber-900 underline mt-2"
              >
                Falar com o suporte →
              </Link>
            </div>
          </div>
        </div>
      )}

      {!migrationPending && loading && (
        <div className="card text-center py-10">
          <div
            aria-hidden
            className="mx-auto w-8 h-8 border-4 border-brand-line border-t-brand-deep rounded-full animate-spin"
          />
          <p className="text-sm text-brand-ink/65 mt-3">Carregando...</p>
        </div>
      )}

      {!migrationPending && !loading && questions.length === 0 && (
        <div className="card text-center py-10">
          <HelpCircle className="w-12 h-12 text-brand-line mx-auto mb-3" aria-hidden />
          <p className="text-sm text-brand-ink/65">
            Você ainda não recebeu nenhuma pergunta.
          </p>
        </div>
      )}

      {!migrationPending && !loading && questions.length > 0 && (
        <div className="space-y-3">
          {questions.map((q) => {
            const lbl = STATUS_LABELS[q.status];
            const isAnswering = answering?.id === q.id;
            return (
              <article key={q.id} className="card">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${lbl.tone}`}
                  >
                    {lbl.text}
                  </span>
                  <span className="text-xs text-brand-ink/55">
                    {new Date(q.created_at).toLocaleDateString("pt-BR")}
                  </span>
                  {q.asker_name && (
                    <span className="text-xs text-brand-ink/55">
                      — De: {q.asker_name}
                    </span>
                  )}
                </div>
                <p className="text-sm md:text-base text-brand-ink whitespace-pre-line leading-relaxed">
                  {q.question}
                </p>

                {q.answer && (
                  <div className="mt-3 pl-3 border-l-4 border-emerald-300">
                    <p className="text-xs font-bold uppercase tracking-wide text-emerald-800 mb-1">
                      Sua resposta
                    </p>
                    <p className="text-sm text-brand-ink/85 whitespace-pre-line">
                      {q.answer}
                    </p>
                  </div>
                )}

                {isAnswering && (
                  <div className="mt-3 space-y-2">
                    <textarea
                      className="input min-h-24"
                      placeholder="Escreva uma resposta informativa, sem se comprometer com o caso individual..."
                      value={answering.text}
                      onChange={(e) =>
                        setAnswering({ ...answering, text: e.target.value })
                      }
                    />
                    <p className="text-[11px] text-brand-ink/55">
                      Lembre-se: caráter informativo, sem promessa de resultado.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={saveAnswer}
                        disabled={saving}
                        className="btn-primary text-sm"
                        type="button"
                      >
                        {saving ? "Publicando..." : "Publicar resposta"}
                      </button>
                      <button
                        onClick={() => setAnswering(null)}
                        className="btn-ghost border border-brand-line text-sm"
                        type="button"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {!isAnswering && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {q.status === "pending" && (
                      <>
                        <button
                          onClick={() => approve(q)}
                          className="btn-ghost border border-brand-line text-xs"
                          type="button"
                        >
                          <Check className="w-3.5 h-3.5" aria-hidden /> Aprovar
                        </button>
                        <button
                          onClick={() =>
                            setAnswering({ id: q.id, text: q.answer || "" })
                          }
                          className="text-xs inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500"
                          type="button"
                        >
                          Responder
                        </button>
                        <button
                          onClick={() => reject(q)}
                          className="btn-ghost border border-brand-line text-xs"
                          type="button"
                        >
                          <X className="w-3.5 h-3.5" aria-hidden /> Rejeitar
                        </button>
                        <button
                          onClick={() => markSpam(q)}
                          className="btn-ghost border border-red-200 text-red-700 text-xs"
                          type="button"
                        >
                          <ShieldOff className="w-3.5 h-3.5" aria-hidden /> Spam
                        </button>
                      </>
                    )}
                    {q.status === "approved" && (
                      <>
                        <button
                          onClick={() =>
                            setAnswering({ id: q.id, text: q.answer || "" })
                          }
                          className="text-xs inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500"
                          type="button"
                        >
                          Responder
                        </button>
                        <button
                          onClick={() => hide(q)}
                          className="btn-ghost border border-brand-line text-xs"
                          type="button"
                        >
                          <EyeOff className="w-3.5 h-3.5" aria-hidden /> Ocultar
                        </button>
                      </>
                    )}
                    {q.status === "answered" && (
                      <>
                        <button
                          onClick={() =>
                            setAnswering({ id: q.id, text: q.answer || "" })
                          }
                          className="btn-ghost border border-brand-line text-xs"
                          type="button"
                        >
                          Editar resposta
                        </button>
                        <button
                          onClick={() => hide(q)}
                          className="btn-ghost border border-brand-line text-xs"
                          type="button"
                        >
                          <EyeOff className="w-3.5 h-3.5" aria-hidden /> Ocultar
                        </button>
                      </>
                    )}
                    {(q.status === "rejected" ||
                      q.status === "spam" ||
                      q.status === "hidden") && (
                      <button
                        onClick={() => approve(q)}
                        className="btn-ghost border border-brand-line text-xs"
                        type="button"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden /> Reabrir
                      </button>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
