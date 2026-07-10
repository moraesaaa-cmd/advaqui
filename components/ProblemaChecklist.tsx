"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Wrench,
  ArrowRight,
  CheckCircle2,
  Circle,
  FileCheck2,
  ListChecks
} from "lucide-react";

/**
 * ProblemaChecklist — ferramenta interativa presente em TODA página de
 * problema jurídico (e nas versões por cidade). Em vez de só ler, a pessoa
 * MARCA o que já tem e o que já fez; uma barra de progresso e a "próxima ação"
 * são calculadas na hora. É genérica e movida pelos próprios dados do problema
 * (documentos + passos), então funciona para qualquer tema sem código bespoke.
 *
 * Não dá conselho jurídico definitivo nem promete resultado — orienta o
 * cidadão a se organizar antes de procurar um advogado.
 */
type Props = {
  titulo: string;
  documentos: string[];
  passos: { titulo: string }[];
  advogadosHref: string;
};

export function ProblemaChecklist({
  titulo,
  documentos,
  passos,
  advogadosHref
}: Props) {
  const docItems = useMemo(() => documentos ?? [], [documentos]);
  const passoItems = useMemo(() => (passos ?? []).map((p) => p.titulo), [passos]);

  const [docs, setDocs] = useState<boolean[]>(() => docItems.map(() => false));
  const [feitos, setFeitos] = useState<boolean[]>(() =>
    passoItems.map(() => false)
  );

  const total = docItems.length + passoItems.length;
  const marcados =
    docs.filter(Boolean).length + feitos.filter(Boolean).length;
  const pct = total ? Math.round((marcados / total) * 100) : 0;

  const proximoIdx = feitos.findIndex((v) => !v);
  const proximoPasso = proximoIdx >= 0 ? passoItems[proximoIdx] : null;
  const faltamDocs = docItems.filter((_, i) => !docs[i]).length;

  const toggleDoc = (i: number) =>
    setDocs((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  const toggleFeito = (i: number) =>
    setFeitos((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  const completo = total > 0 && marcados === total;

  return (
    <section className="mt-6 rounded-2xl border-2 border-brand-accent bg-white p-5 md:p-6 shadow-card">
      <div className="flex items-center gap-2 mb-1">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-brand-accent/25">
          <Wrench className="w-5 h-5 text-brand-deep" aria-hidden />
        </span>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-brand-deep">
            Ferramenta interativa
          </p>
          <h2 className="font-display text-lg md:text-xl font-bold text-brand-ink leading-tight">
            Monte seu caso e veja o que falta
          </h2>
        </div>
      </div>
      <p className="text-sm text-brand-ink/70 leading-relaxed mb-4">
        Marque o que você já tem em mãos e o que já fez. A ferramenta calcula seu
        progresso e mostra qual é o próximo passo — para você chegar organizado a
        um advogado.
      </p>

      {/* Barra de progresso */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-xs font-semibold text-brand-ink/70 mb-1">
          <span>Seu preparo</span>
          <span className="text-brand-deep">{pct}%</span>
        </div>
        <div
          className="h-3 rounded-full bg-brand-line/70 overflow-hidden"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-brand-accent transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Documentos */}
        {docItems.length > 0 && (
          <div>
            <p className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-ink mb-2">
              <FileCheck2 className="w-4 h-4 text-brand-deep" aria-hidden />
              Documentos que você já tem
            </p>
            <ul className="space-y-1.5">
              {docItems.map((d, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => toggleDoc(i)}
                    aria-pressed={docs[i]}
                    className="group flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-brand-bg/60 transition"
                  >
                    {docs[i] ? (
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 flex-shrink-0" aria-hidden />
                    ) : (
                      <Circle className="w-4 h-4 mt-0.5 text-brand-ink/30 flex-shrink-0" aria-hidden />
                    )}
                    <span
                      className={
                        docs[i]
                          ? "text-brand-ink/50 line-through"
                          : "text-brand-ink/85"
                      }
                    >
                      {d}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Passos */}
        {passoItems.length > 0 && (
          <div>
            <p className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-ink mb-2">
              <ListChecks className="w-4 h-4 text-brand-deep" aria-hidden />
              Passos que você já deu
            </p>
            <ul className="space-y-1.5">
              {passoItems.map((t, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => toggleFeito(i)}
                    aria-pressed={feitos[i]}
                    className="group flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-brand-bg/60 transition"
                  >
                    {feitos[i] ? (
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 flex-shrink-0" aria-hidden />
                    ) : (
                      <Circle className="w-4 h-4 mt-0.5 text-brand-ink/30 flex-shrink-0" aria-hidden />
                    )}
                    <span
                      className={
                        feitos[i]
                          ? "text-brand-ink/50 line-through"
                          : "text-brand-ink/85"
                      }
                    >
                      {t}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Resultado dinâmico */}
      <div className="mt-5 rounded-xl border border-brand-line bg-white p-4">
        {completo ? (
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden />
            <div>
              <p className="font-semibold text-brand-ink text-sm">
                Você já reuniu o essencial e deu os primeiros passos.
              </p>
              <p className="text-sm text-brand-ink/70 mt-1 leading-relaxed">
                Esse é um bom momento para falar com um advogado, que vai analisar
                o seu caso concreto e indicar o melhor caminho.
              </p>
              <Link
                href={advogadosHref}
                className="btn-accent inline-flex items-center gap-2 mt-3 text-sm"
              >
                Encontrar um advogado na minha cidade
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-sm leading-relaxed">
            <p className="text-brand-ink/80">
              {marcados === 0
                ? "Comece marcando acima o que você já tem e o que já fez."
                : `Você já avançou ${pct}% do preparo.`}
            </p>
            {proximoPasso && (
              <p className="mt-1.5 text-brand-ink">
                <span className="font-semibold text-brand-deep">
                  Próximo passo:
                </span>{" "}
                {proximoPasso}
              </p>
            )}
            {faltamDocs > 0 && (
              <p className="mt-1 text-brand-ink/70">
                Faltam reunir {faltamDocs}{" "}
                {faltamDocs === 1 ? "documento" : "documentos"} da lista.
              </p>
            )}
            <Link
              href={advogadosHref}
              className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-brand-deep hover:text-brand-accent2 transition"
            >
              Prefere já falar com um advogado? Encontre na sua cidade
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          </div>
        )}
      </div>

      <p className="text-[11px] text-brand-ink/45 mt-3 leading-snug">
        Ferramenta de organização pessoal. Não substitui a orientação de um
        advogado nem garante resultado — cada caso é analisado individualmente.
      </p>
    </section>
  );
}
