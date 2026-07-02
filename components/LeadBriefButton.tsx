"use client";

import { useState } from "react";

/**
 * Botão "Gerar mensagem" do card de lead em /admin/leads.
 *
 * Chama POST /api/admin/lead-brief ({ leadId }) e mostra:
 *   • resumo curto do caso
 *   • textarea editável com o rascunho de WhatsApp
 *   • botão de copiar + link wa.me com o texto já preenchido
 *
 * Uso exclusivo do admin — nada disso aparece em página pública.
 */
type Props = {
  leadId: string;
  /** Telefone já normalizado para wa.me (só dígitos com DDI), ou "" se não houver. */
  waPhone: string;
};

export default function LeadBriefButton({ leadId, waPhone }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resumo, setResumo] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState(false);

  async function gerar() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/lead-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId })
      });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        resumo?: string;
        whatsappDraft?: string;
      };
      if (!res.ok || !data.ok || !data.whatsappDraft) {
        setError(data.error || "Erro ao gerar mensagem. Tente de novo.");
        return;
      }
      setResumo(data.resumo || null);
      setDraft(data.whatsappDraft);
      setCopied(false);
    } catch {
      setError("Erro de conexão. Tente de novo.");
    } finally {
      setLoading(false);
    }
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Não foi possível copiar. Selecione o texto manualmente.");
    }
  }

  const waUrl =
    waPhone && draft
      ? `https://wa.me/${waPhone}?text=${encodeURIComponent(draft)}`
      : "";

  return (
    <div className="mt-3">
      {!draft && (
        <button
          type="button"
          onClick={gerar}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-brand-line bg-brand-bg text-brand-ink text-xs font-semibold hover:bg-brand-line/50 disabled:opacity-60"
        >
          {loading ? "Gerando..." : "Gerar mensagem"}
        </button>
      )}

      {error && <p className="text-xs text-red-700 mt-2">{error}</p>}

      {draft && (
        <div className="mt-2 rounded-xl border border-brand-line bg-brand-bg/60 p-3 space-y-2">
          {resumo && (
            <p className="text-sm text-brand-ink/80">
              <span className="font-semibold text-brand-ink">Resumo: </span>
              {resumo}
            </p>
          )}
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            className="w-full text-sm text-brand-ink rounded-lg border border-brand-line bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-deep/30"
            aria-label="Rascunho da mensagem de WhatsApp"
          />
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={copiar}
              className="inline-flex items-center px-3 py-1.5 rounded-lg border border-brand-line bg-white text-brand-ink text-xs font-semibold hover:bg-brand-bg"
            >
              {copied ? "Copiado!" : "Copiar"}
            </button>
            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-white text-xs font-semibold"
                style={{ background: "#25D366" }}
              >
                Enviar no WhatsApp
              </a>
            )}
            <button
              type="button"
              onClick={gerar}
              disabled={loading}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-brand-ink/60 text-xs font-medium hover:text-brand-ink disabled:opacity-60"
            >
              {loading ? "Gerando..." : "Gerar de novo"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
