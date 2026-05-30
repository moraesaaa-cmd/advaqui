"use client";

import { useState } from "react";
import {
  Scale,
  Gavel,
  Lightbulb,
  Check,
  X,
  ChevronDown,
  Vote
} from "lucide-react";
import type { ArticleToolData } from "@/lib/data/articles";

/**
 * ArticleTools — micro-ferramentas interativas embutidas no corpo dos artigos.
 *
 * Servem para quebrar a leitura, prender a atenção e tornar tema técnico
 * (ex.: Tribunal do Júri) imersivo sem precisar de muito texto. Tudo roda no
 * navegador, sem backend e sem coletar dado nenhum — são recursos de
 * engajamento e didática, não enquetes com valor estatístico.
 */

function Perspectiva({
  pergunta,
  ladoA,
  ladoB
}: Extract<ArticleToolData, { tool: "perspectiva" }>) {
  const [escolha, setEscolha] = useState<"A" | "B" | null>(null);
  return (
    <div className="my-7 rounded-2xl border-2 border-brand-accent/40 bg-white p-5 md:p-6 shadow-card">
      <div className="flex items-center gap-2 text-brand-accent2 mb-2">
        <Vote className="w-5 h-5" aria-hidden />
        <span className="text-xs font-bold uppercase tracking-wider">
          E você, de que lado está?
        </span>
      </div>
      <p className="font-display text-lg md:text-xl font-bold text-brand-ink leading-snug">
        {pergunta}
      </p>
      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        {(["A", "B"] as const).map((lado) => {
          const d = lado === "A" ? ladoA : ladoB;
          const ativo = escolha === lado;
          return (
            <button
              key={lado}
              type="button"
              onClick={() => setEscolha(lado)}
              aria-pressed={ativo}
              className={`text-left rounded-xl border-2 p-4 transition ${
                ativo
                  ? "border-brand-accent bg-brand-accent/10"
                  : "border-brand-line bg-brand-bg/40 hover:border-brand-accent/60"
              }`}
            >
              <span className="font-semibold text-brand-ink block">
                {d.rotulo}
              </span>
              {escolha && (
                <span className="text-sm text-brand-ink/70 mt-1.5 block leading-relaxed">
                  {d.argumento}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {escolha && (
        <p className="mt-3 text-xs text-brand-ink/55 leading-relaxed">
          Não existe resposta única — o debate vive exatamente dessa tensão.
          Recurso de reflexão, sem valor estatístico.
        </p>
      )}
      {!escolha && (
        <p className="mt-3 text-xs text-brand-ink/45">
          Toque em um lado para ver o argumento de cada posição.
        </p>
      )}
    </div>
  );
}

function LinhaDoTempo({
  titulo,
  etapas
}: Extract<ArticleToolData, { tool: "timeline" }>) {
  const [aberta, setAberta] = useState<number>(0);
  return (
    <div className="my-7 rounded-2xl border border-brand-line bg-brand-bg/40 p-5 md:p-6">
      <div className="flex items-center gap-2 text-brand-deep mb-4">
        <Gavel className="w-5 h-5" aria-hidden />
        <span className="text-sm font-bold uppercase tracking-wide">
          {titulo}
        </span>
      </div>
      <ol className="relative border-l-2 border-brand-line ml-3 space-y-1">
        {etapas.map((e, i) => {
          const ativo = aberta === i;
          return (
            <li key={i} className="ml-5">
              <button
                type="button"
                onClick={() => setAberta(ativo ? -1 : i)}
                aria-expanded={ativo}
                className="relative w-full text-left py-2"
              >
                <span
                  className={`absolute -left-[27px] top-3 w-3.5 h-3.5 rounded-full border-2 ${
                    ativo
                      ? "bg-brand-accent border-brand-accent"
                      : "bg-white border-brand-line"
                  }`}
                  aria-hidden
                />
                <span className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-brand-ink">
                    {e.titulo}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-brand-ink/40 transition ${
                      ativo ? "rotate-180" : ""
                    }`}
                    aria-hidden
                  />
                </span>
              </button>
              {ativo && (
                <p className="text-sm text-brand-ink/75 leading-relaxed pb-3 pr-2">
                  {e.texto}
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Quiz({
  pergunta,
  opcoes
}: Extract<ArticleToolData, { tool: "quiz" }>) {
  const [sel, setSel] = useState<number | null>(null);
  const respondido = sel !== null;
  return (
    <div className="my-7 rounded-2xl border-2 border-brand-deep/25 bg-white p-5 md:p-6 shadow-card">
      <div className="flex items-center gap-2 text-brand-deep mb-2">
        <Scale className="w-5 h-5" aria-hidden />
        <span className="text-xs font-bold uppercase tracking-wider">
          Você decide
        </span>
      </div>
      <p className="font-display text-lg md:text-xl font-bold text-brand-ink leading-snug mb-4">
        {pergunta}
      </p>
      <div className="space-y-2.5">
        {opcoes.map((o, i) => {
          const escolhida = sel === i;
          const mostrar = respondido && (escolhida || o.correta);
          return (
            <button
              key={i}
              type="button"
              disabled={respondido}
              onClick={() => setSel(i)}
              className={`w-full text-left rounded-xl border-2 p-3.5 transition ${
                !respondido
                  ? "border-brand-line bg-brand-bg/40 hover:border-brand-deep/50 cursor-pointer"
                  : o.correta
                  ? "border-emerald-400 bg-emerald-50"
                  : escolhida
                  ? "border-red-300 bg-red-50"
                  : "border-brand-line bg-white opacity-70"
              }`}
            >
              <span className="flex items-start gap-2">
                {respondido && o.correta && (
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" aria-hidden />
                )}
                {respondido && escolhida && !o.correta && (
                  <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" aria-hidden />
                )}
                <span className="text-sm text-brand-ink/90 font-medium">
                  {o.texto}
                </span>
              </span>
              {mostrar && (
                <span className="block text-sm text-brand-ink/70 mt-2 leading-relaxed">
                  {o.explicacao}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {respondido && (
        <button
          type="button"
          onClick={() => setSel(null)}
          className="mt-3 text-xs font-semibold text-brand-deep hover:text-brand-accent2"
        >
          Tentar de novo
        </button>
      )}
    </div>
  );
}

function Revela({
  titulo,
  itens
}: Extract<ArticleToolData, { tool: "revela" }>) {
  return (
    <div className="my-7 rounded-2xl border border-brand-line bg-white p-5 md:p-6">
      <div className="flex items-center gap-2 text-brand-accent2 mb-3">
        <Lightbulb className="w-5 h-5" aria-hidden />
        <span className="text-sm font-bold uppercase tracking-wide">
          {titulo}
        </span>
      </div>
      <div className="space-y-2">
        {itens.map((it, i) => (
          <details
            key={i}
            className="group rounded-xl border border-brand-line bg-brand-bg/40 p-3"
          >
            <summary className="cursor-pointer list-none flex items-center justify-between gap-3 font-semibold text-brand-ink text-sm">
              {it.termo}
              <span className="text-brand-accent2 group-open:rotate-45 transition text-lg leading-none">
                +
              </span>
            </summary>
            <p className="mt-2 text-sm text-brand-ink/75 leading-relaxed">
              {it.definicao}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}

export function ArticleTool({ data }: { data: ArticleToolData }) {
  switch (data.tool) {
    case "perspectiva":
      return <Perspectiva {...data} />;
    case "timeline":
      return <LinhaDoTempo {...data} />;
    case "quiz":
      return <Quiz {...data} />;
    case "revela":
      return <Revela {...data} />;
    default:
      return null;
  }
}
