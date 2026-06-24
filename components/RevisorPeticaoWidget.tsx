"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  AlertTriangle,
  Loader2,
  Copy,
  Check,
  Wand2,
  ScanLine,
  Lock
} from "lucide-react";

/**
 * Widget do revisor/humanizador de petições (/revisor-peticao).
 * Fala com /api/painel/revisar-peticao, que exige plano premium ativo do
 * advogado logado (a chamada gasta tokens de IA). A página em si é pública e
 * indexável; o uso é que fica condicionado ao premium.
 */

type Modo = "revisar" | "humanizar";

const MAX = 8000;

export function RevisorPeticaoWidget() {
  const [modo, setModo] = useState<Modo>("revisar");
  const [texto, setTexto] = useState("");
  const [estado, setEstado] = useState<"idle" | "loading" | "ok" | "erro">("idle");
  const [erro, setErro] = useState("");
  const [bloqueio, setBloqueio] = useState<null | "login" | "premium">(null);
  const [saida, setSaida] = useState("");
  const [copiado, setCopiado] = useState(false);

  async function revisar() {
    if (texto.trim().length < 40) {
      setErro("Cole um texto com pelo menos 40 caracteres.");
      setEstado("erro");
      return;
    }
    setEstado("loading");
    setErro("");
    setBloqueio(null);
    try {
      const r = await fetch("/api/painel/revisar-peticao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: texto.trim(), modo })
      });
      const j = await r.json();
      if (r.status === 401) {
        setBloqueio("login");
        setEstado("erro");
        return;
      }
      if (r.status === 403) {
        setBloqueio("premium");
        setEstado("erro");
        return;
      }
      if (!j.ok) {
        setErro(j.error || "Não foi possível revisar agora.");
        setEstado("erro");
        return;
      }
      setSaida(j.texto);
      setEstado("ok");
    } catch {
      setErro("Falha de conexão. Tente novamente.");
      setEstado("erro");
    }
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(saida);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    } catch {
      /* ignore */
    }
  }

  return (
    <main className="container-narrow py-10 md:py-14">
      <div className="text-center mb-6">
        <span className="chip border-brand-deep/30 bg-brand-deep/5 text-brand-ink mb-3">
          <Sparkles className="w-3.5 h-3.5" aria-hidden /> Recurso premium
        </span>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink text-balance">
          Revisor e humanizador de petições com IA
        </h1>
        <p className="text-brand-ink/70 mt-3 max-w-xl mx-auto">
          Cole o texto da sua peça e a IA corrige a redação ou deixa o texto mais
          natural — sem mudar fatos, valores ou pedidos. Para advogados com plano
          premium ativo.
        </p>
      </div>

      <div className="card space-y-5">
        <div>
          <span className="label">O que você quer fazer?</span>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <button
              type="button"
              onClick={() => setModo("revisar")}
              className={`rounded-xl border px-3 py-2.5 text-center transition inline-flex items-center justify-center gap-1.5 ${
                modo === "revisar"
                  ? "border-brand-accent bg-brand-accent/10 text-brand-ink font-semibold"
                  : "border-brand-line bg-white text-brand-ink/70 hover:border-brand-deep/40"
              }`}
            >
              <ScanLine className="w-4 h-4" aria-hidden /> Revisar
            </button>
            <button
              type="button"
              onClick={() => setModo("humanizar")}
              className={`rounded-xl border px-3 py-2.5 text-center transition inline-flex items-center justify-center gap-1.5 ${
                modo === "humanizar"
                  ? "border-brand-accent bg-brand-accent/10 text-brand-ink font-semibold"
                  : "border-brand-line bg-white text-brand-ink/70 hover:border-brand-deep/40"
              }`}
            >
              <Wand2 className="w-4 h-4" aria-hidden /> Humanizar
            </button>
          </div>
          <p className="text-xs text-brand-ink/55 mt-1.5">
            {modo === "revisar"
              ? "Corrige gramática, clareza e técnica jurídica, sem mudar o conteúdo."
              : "Reescreve para soar natural e fluente, eliminando o tom de texto de máquina."}
          </p>
        </div>

        <div>
          <label className="label" htmlFor="peticao">Texto da petição</label>
          <textarea
            id="peticao"
            className="input min-h-[200px] resize-y"
            placeholder="Cole aqui o trecho ou a peça inteira…"
            maxLength={MAX}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
          <p className="text-xs text-brand-ink/45 mt-1 text-right">
            {texto.length.toLocaleString("pt-BR")} / {MAX.toLocaleString("pt-BR")}
          </p>
        </div>

        <button
          type="button"
          onClick={revisar}
          disabled={estado === "loading"}
          className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {estado === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> Trabalhando no texto…
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" aria-hidden />{" "}
              {modo === "revisar" ? "Revisar com IA" : "Humanizar com IA"}
            </>
          )}
        </button>

        {estado === "erro" && bloqueio === "login" && (
          <div className="flex items-start gap-2 text-sm p-4 rounded-2xl border-2 border-brand-deep/20 bg-brand-deep/5 text-brand-ink">
            <Lock className="w-5 h-5 mt-0.5 shrink-0 text-brand-deep" aria-hidden />
            <span>
              Esta ferramenta é exclusiva para advogados assinantes.{" "}
              <Link href="/login" className="underline font-medium">Entre na sua conta</Link>{" "}
              para usar.
            </span>
          </div>
        )}

        {estado === "erro" && bloqueio === "premium" && (
          <div className="rounded-2xl border-2 border-brand-accent bg-brand-accent/5 p-4">
            <p className="text-sm text-brand-ink font-medium inline-flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-brand-accent" aria-hidden /> Recurso do plano premium
            </p>
            <p className="text-sm text-brand-ink/75 mt-1">
              O revisor por IA está incluído no plano premium do AdvAqui, junto com
              o destaque na busca e a sua página profissional.
            </p>
            <Link href="/planos" className="btn-primary mt-3 inline-flex">
              Ver o plano premium
            </Link>
          </div>
        )}

        {estado === "erro" && !bloqueio && (
          <div className="flex items-start gap-2 text-sm p-3 rounded-xl border border-red-200 bg-red-50 text-red-800">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden />
            <span>{erro}</span>
          </div>
        )}

        {estado === "ok" && (
          <div className="rounded-2xl border-2 border-brand-accent bg-white p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-brand-ink">
                {modo === "revisar" ? "Texto revisado" : "Texto humanizado"}
              </p>
              <button
                type="button"
                onClick={copiar}
                className="inline-flex items-center gap-1 text-sm text-brand-deep font-medium hover:underline"
              >
                {copiado ? (
                  <>
                    <Check className="w-4 h-4" aria-hidden /> Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" aria-hidden /> Copiar
                  </>
                )}
              </button>
            </div>
            <div className="whitespace-pre-wrap text-sm text-brand-ink/90 leading-relaxed max-h-[420px] overflow-y-auto">
              {saida}
            </div>
          </div>
        )}

        <div className="flex items-start gap-2 text-xs p-3 rounded-xl border border-amber-200 bg-amber-50 text-amber-900">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden />
          <span>
            A IA não inventa fatos nem jurisprudência, mas pode errar. Revise o
            resultado antes de protocolar — a responsabilidade técnica é sempre do
            advogado. O texto enviado não é armazenado.
          </span>
        </div>
      </div>
    </main>
  );
}
