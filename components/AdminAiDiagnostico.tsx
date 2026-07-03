"use client";

import { useState } from "react";
import { Sparkles, Loader2, AlertTriangle } from "lucide-react";

/**
 * Widget do painel admin (/painel/agentes): botão "Gerar diagnóstico" que
 * chama /api/admin/ai-diagnostico. O endpoint coleta métricas reais do banco
 * e devolve um relatório priorizado gerado pela camada de IA.
 */
export function AdminAiDiagnostico() {
  const [estado, setEstado] = useState<"idle" | "loading" | "ok" | "erro">("idle");
  const [texto, setTexto] = useState("");
  const [erro, setErro] = useState("");

  async function gerar() {
    setEstado("loading");
    setErro("");
    try {
      const res = await fetch("/api/admin/ai-diagnostico", { method: "POST" });
      const j = (await res.json()) as {
        ok: boolean;
        diagnostico?: string;
        error?: string;
      };
      if (!res.ok || !j.ok || !j.diagnostico) {
        setErro(j.error || "Não foi possível gerar o diagnóstico agora.");
        setEstado("erro");
        return;
      }
      setTexto(j.diagnostico);
      setEstado("ok");
    } catch {
      setErro("Falha de conexão. Tente novamente.");
      setEstado("erro");
    }
  }

  return (
    <section className="card mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold text-brand-ink">
            Diagnóstico do site
          </h2>
          <p className="text-sm text-brand-ink/60 mt-0.5">
            Análise automática com base nos números reais de perfis, blog,
            leads e agentes dos últimos 7 dias.
          </p>
        </div>
        <button
          type="button"
          onClick={gerar}
          disabled={estado === "loading"}
          className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl bg-brand-deep text-white hover:bg-brand-deep/90 transition disabled:opacity-50"
        >
          {estado === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
              Analisando...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" aria-hidden />
              Gerar diagnóstico
            </>
          )}
        </button>
      </div>

      {estado === "erro" && (
        <div className="mt-4 flex items-start gap-2 text-sm p-3 rounded-xl border border-red-200 bg-red-50 text-red-800">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden />
          <span>{erro}</span>
        </div>
      )}

      {estado === "ok" && texto && (
        <div className="mt-4 rounded-xl border border-brand-line bg-brand-bg/40 p-4">
          <p className="text-sm text-brand-ink leading-relaxed whitespace-pre-line">
            {texto}
          </p>
        </div>
      )}
    </section>
  );
}
