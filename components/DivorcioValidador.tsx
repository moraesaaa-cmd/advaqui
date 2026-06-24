"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Scale,
  Check,
  RotateCcw,
  ArrowRight,
  Building2,
  Gavel,
  AlertTriangle
} from "lucide-react";

/**
 * Validador de Divórcio — diz, de forma indicativa, se o divórcio pode ser
 * feito em CARTÓRIO (extrajudicial) ou se precisa ir à JUSTIÇA.
 *
 * Regra (Lei 11.441/2007; CPC, arts. 731 a 733): o divórcio extrajudicial,
 * por escritura em cartório, exige (1) acordo entre as partes (consensual),
 * (2) ausência de filhos menores ou incapazes e (3) assistência de advogado.
 * Havendo filhos menores/incapazes ou falta de acordo, o caminho é a Justiça.
 *
 * Determinístico, client-side, nada é enviado. É orientação informativa — o
 * advogado é obrigatório em qualquer das vias.
 */

type Resp = "sim" | "nao" | null;

type Pergunta = {
  key: "consenso" | "filhos" | "gravidez" | "bens";
  texto: string;
  ajuda?: string;
};

const PERGUNTAS: Pergunta[] = [
  {
    key: "consenso",
    texto: "Vocês dois estão de acordo com o divórcio e com os seus termos?",
    ajuda: "Guarda, pensão, uso do nome e partilha — tudo combinado, sem briga."
  },
  {
    key: "filhos",
    texto: "Há filhos menores de 18 anos ou incapazes?",
    ajuda: "Vale também para filhos maiores que sejam incapazes."
  },
  {
    key: "gravidez",
    texto: "A esposa está grávida (há nascituro)?"
  },
  {
    key: "bens",
    texto: "Existem bens a partilhar?",
    ajuda: "Imóveis, veículos, contas, empresa. Não impede o cartório, mas precisa de acordo sobre a divisão."
  }
];

type Answers = Record<Pergunta["key"], Resp>;

const INIT: Answers = {
  consenso: null,
  filhos: null,
  gravidez: null,
  bens: null
};

export function DivorcioValidador() {
  const [a, setA] = useState<Answers>(INIT);

  const respondidas = PERGUNTAS.every((p) => a[p.key] !== null);
  const set = (k: Pergunta["key"], v: Resp) =>
    setA((s) => ({ ...s, [k]: v }));
  const reset = () => setA(INIT);

  // Cartório exige: consenso = sim E filhos = nao E gravidez = nao.
  const podeCartorio =
    a.consenso === "sim" && a.filhos === "nao" && a.gravidez === "nao";
  const motivoJudicial: string[] = [];
  if (a.consenso === "nao")
    motivoJudicial.push("não há acordo entre as partes (divórcio litigioso)");
  if (a.filhos === "sim")
    motivoJudicial.push("há filhos menores de 18 anos ou incapazes");
  if (a.gravidez === "sim")
    motivoJudicial.push("há gravidez (interesses do nascituro a proteger)");

  return (
    <section
      className="card mb-6 border-2 border-brand-accent/40"
      aria-label="Validador de divórcio"
    >
      <h2 className="font-display text-xl font-bold text-brand-ink mb-1 inline-flex items-center gap-2">
        <Scale className="w-5 h-5 text-brand-deep" aria-hidden />
        Seu divórcio: cartório ou Justiça?
      </h2>
      <p className="text-sm text-brand-ink/65 mb-4">
        Responda 4 perguntas. Nada é enviado — a resposta é montada no seu
        navegador.
      </p>

      <div className="grid gap-3">
        {PERGUNTAS.map((p) => (
          <div
            key={p.key}
            className="rounded-xl border border-brand-line p-3"
          >
            <p className="text-sm font-medium text-brand-ink">{p.texto}</p>
            {p.ajuda && (
              <p className="text-xs text-brand-ink/55 mt-0.5 leading-snug">
                {p.ajuda}
              </p>
            )}
            <div className="flex gap-2 mt-2">
              {(["sim", "nao"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => set(p.key, v)}
                  className={`flex-1 rounded-lg border-2 px-4 py-2 text-sm font-semibold transition ${
                    a[p.key] === v
                      ? "border-brand-accent bg-brand-accent/10 text-brand-ink"
                      : "border-brand-line bg-white text-brand-ink/70 hover:border-brand-accent/60"
                  }`}
                >
                  {v === "sim" ? "Sim" : "Não"}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Resultado */}
      {respondidas && (
        <div className="mt-5">
          {podeCartorio ? (
            <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-4">
              <h3 className="font-display text-lg font-bold text-emerald-900 inline-flex items-center gap-2">
                <Building2 className="w-5 h-5" aria-hidden />
                Provavelmente PODE ser em cartório
              </h3>
              <p className="text-sm text-emerald-950 mt-2 leading-relaxed">
                Pelas suas respostas, o divórcio reúne as condições do divórcio
                extrajudicial (Lei 11.441/2007): há acordo e não há filhos
                menores ou incapazes. Ele pode ser feito por escritura pública
                num cartório de notas — mais rápido e barato que a Justiça.
                {a.bens === "sim" &&
                  " A partilha dos bens pode entrar na própria escritura, desde que vocês concordem com a divisão."}
              </p>
              <p className="text-sm text-emerald-950 mt-2 leading-relaxed font-semibold">
                Atenção: mesmo no cartório, a presença de advogado é obrigatória
                (pode ser um para os dois, se houver consenso).
              </p>
            </div>
          ) : (
            <div className="rounded-xl border-2 border-amber-300 bg-amber-50 p-4">
              <h3 className="font-display text-lg font-bold text-amber-900 inline-flex items-center gap-2">
                <Gavel className="w-5 h-5" aria-hidden />
                Precisa ser na Justiça
              </h3>
              <p className="text-sm text-amber-950 mt-2 leading-relaxed">
                Pelas suas respostas, o caminho é o divórcio judicial, porque{" "}
                {motivoJudicial.join(" e ")}. O cartório só atende casos
                consensuais e sem filhos menores ou incapazes.
              </p>
              <p className="text-sm text-amber-950 mt-2 leading-relaxed">
                {a.consenso === "sim"
                  ? "Como há acordo entre vocês, dá para fazer o divórcio consensual na Justiça — mais simples e rápido que o litigioso. Um juiz homologa o acordo e decide o que envolve os filhos."
                  : "Sem acordo, será um divórcio litigioso: cada parte apresenta seus pedidos e o juiz decide guarda, pensão e partilha."}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Link
              href="/advogados"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-deep px-5 py-3 text-sm font-bold text-white hover:bg-brand-ink transition"
            >
              Falar com um advogado de família
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-brand-line px-5 py-3 text-sm font-bold text-brand-ink hover:border-brand-deep transition"
            >
              <RotateCcw className="w-4 h-4 text-brand-deep" aria-hidden />
              Refazer
            </button>
          </div>
        </div>
      )}

      {!respondidas && (
        <p className="mt-4 text-xs text-brand-ink/50 inline-flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5" aria-hidden />
          Responda as 4 perguntas para ver o resultado.
        </p>
      )}

      <aside
        role="note"
        className="mt-4 rounded-xl border-l-4 border-amber-400 bg-amber-50 p-3 text-xs text-amber-900 leading-relaxed flex items-start gap-2"
      >
        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden />
        <span>
          Orientação informativa, não parecer jurídico. O advogado é obrigatório
          em qualquer divórcio (cartório ou Justiça) e é quem confirma o melhor
          caminho para o seu caso.
        </span>
      </aside>
    </section>
  );
}
