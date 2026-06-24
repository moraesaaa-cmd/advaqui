"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Home,
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  RotateCcw,
  AlertTriangle
} from "lucide-react";

/**
 * Auditor de riscos imobiliários — checklist de verificação antes de comprar
 * um imóvel. A pessoa marca o que já conferiu; o componente destaca os pontos
 * pendentes, separando os CRÍTICOS (que podem fazer perder o imóvel ou o
 * dinheiro) dos importantes.
 *
 * Determinístico, client-side, nada é enviado. Orientação informativa.
 */

type Sev = "critico" | "importante";
type Estado = "ok" | "pendente";

type Item = {
  id: string;
  grupo: string;
  label: string;
  sev: Sev;
  dica: string;
};

const ITENS: Item[] = [
  {
    id: "matricula",
    grupo: "Imóvel",
    label: "Matrícula atualizada do imóvel (Cartório de Registro de Imóveis, últimos 30 dias)",
    sev: "critico",
    dica: "É a 'certidão de nascimento' do imóvel. Mostra o dono real e tudo que pesa sobre ele."
  },
  {
    id: "onus",
    grupo: "Imóvel",
    label: "Certidão de ônus reais — sem hipoteca, penhora, usufruto ou indisponibilidade",
    sev: "critico",
    dica: "Vem na própria matrícula. Imóvel penhorado ou hipotecado pode ser perdido depois da compra."
  },
  {
    id: "iptu",
    grupo: "Imóvel",
    label: "IPTU e taxas sem débitos (a dívida acompanha o imóvel)",
    sev: "importante",
    dica: "Dívida de IPTU é 'propter rem': passa para o novo dono."
  },
  {
    id: "habitese",
    grupo: "Imóvel",
    label: "Habite-se / construção regularizada na prefeitura",
    sev: "importante",
    dica: "Imóvel sem habite-se ou com área não averbada gera dor de cabeça para financiar e revender."
  },
  {
    id: "condominio",
    grupo: "Imóvel",
    label: "Certidão negativa de débitos de condomínio (se houver)",
    sev: "importante",
    dica: "Dívida de condomínio também acompanha o imóvel."
  },
  {
    id: "cert_vendedor",
    grupo: "Vendedor",
    label: "Certidões do vendedor: ações cíveis, execuções, trabalhista e federal",
    sev: "critico",
    dica: "Se o vendedor tem dívidas e fica insolvente, a venda pode ser anulada por fraude à execução."
  },
  {
    id: "estado_civil",
    grupo: "Vendedor",
    label: "Estado civil conferido e anuência do cônjuge (quando exigida)",
    sev: "critico",
    dica: "Venda sem a assinatura do cônjuge, quando necessária, pode ser anulada."
  },
  {
    id: "vendedor_pj",
    grupo: "Vendedor",
    label: "Se for empresa: contrato social e certidões da pessoa jurídica",
    sev: "importante",
    dica: "Confirme quem pode assinar pela empresa e se ela não está em recuperação/falência."
  },
  {
    id: "preco_pagamento",
    grupo: "Contrato",
    label: "Preço, forma de pagamento e prazo de entrega das chaves bem definidos",
    sev: "importante",
    dica: "Tudo por escrito: valor, parcelas, datas e o que acontece em cada etapa."
  },
  {
    id: "multa",
    grupo: "Contrato",
    label: "Multa equilibrada (vale para os dois lados, não só contra o comprador)",
    sev: "importante",
    dica: "Multa só contra o comprador, ou desproporcional, pode ser cláusula abusiva."
  },
  {
    id: "condicao_financiamento",
    grupo: "Contrato",
    label: "Cláusula de condição suspensiva se a compra depende de financiamento",
    sev: "importante",
    dica: "Garante a devolução dos valores se o banco não aprovar o financiamento."
  },
  {
    id: "custos",
    grupo: "Contrato",
    label: "Definido quem paga ITBI, escritura e registro",
    sev: "importante",
    dica: "Some uns 5% a 6% do valor em impostos e cartório — deixe claro quem arca."
  }
];

const GRUPOS = ["Imóvel", "Vendedor", "Contrato"];

export function AuditorImobiliario() {
  const [estado, setEstado] = useState<Record<string, Estado>>({});

  const set = (id: string, e: Estado) =>
    setEstado((s) => ({ ...s, [id]: s[id] === e ? "pendente" : e }));
  const reset = () => setEstado({});

  const pendentes = useMemo(
    () => ITENS.filter((i) => estado[i.id] !== "ok"),
    [estado]
  );
  const criticosPendentes = pendentes.filter((i) => i.sev === "critico");
  const verificados = ITENS.length - pendentes.length;

  const risco =
    criticosPendentes.length > 0
      ? "alto"
      : pendentes.length > 0
        ? "atencao"
        : "ok";

  return (
    <section
      className="card mb-6 border-2 border-brand-accent/40"
      aria-label="Auditor de riscos imobiliários"
    >
      <h2 className="font-display text-xl font-bold text-brand-ink mb-1 inline-flex items-center gap-2">
        <Home className="w-5 h-5 text-brand-deep" aria-hidden />
        Antes de comprar, confira
      </h2>
      <p className="text-sm text-brand-ink/65 mb-4">
        Marque o que você já verificou. O que ficar pendente vira ponto de
        atenção — os críticos podem custar o imóvel ou o dinheiro. Nada é
        enviado.
      </p>

      <div className="space-y-5">
        {GRUPOS.map((g) => (
          <div key={g}>
            <p className="text-[11px] font-bold uppercase tracking-wide text-brand-deep mb-2">
              {g}
            </p>
            <div className="space-y-2">
              {ITENS.filter((i) => i.grupo === g).map((i) => {
                const ok = estado[i.id] === "ok";
                return (
                  <div
                    key={i.id}
                    className={`rounded-xl border-2 p-3 transition ${
                      ok ? "border-emerald-300 bg-emerald-50" : "border-brand-line bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => set(i.id, "ok")}
                        aria-pressed={ok}
                        className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition ${
                          ok ? "border-emerald-500 bg-emerald-500" : "border-brand-line hover:border-emerald-400"
                        }`}
                        aria-label={`Marcar "${i.label}" como verificado`}
                      >
                        {ok && <ShieldCheck className="w-3.5 h-3.5 text-white" aria-hidden />}
                      </button>
                      <div className="min-w-0">
                        <p className="text-sm text-brand-ink leading-snug">
                          {i.label}
                          {i.sev === "critico" && (
                            <span className="ml-1.5 inline-block text-[10px] font-bold uppercase text-rose-700 align-middle">
                              crítico
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-brand-ink/55 mt-0.5 leading-snug">{i.dica}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Resultado */}
      <div
        className={`mt-5 rounded-xl border-2 p-4 ${
          risco === "alto"
            ? "border-rose-300 bg-rose-50"
            : risco === "atencao"
              ? "border-amber-300 bg-amber-50"
              : "border-emerald-300 bg-emerald-50"
        }`}
      >
        <h3 className="font-display text-base font-bold inline-flex items-center gap-2 text-brand-ink">
          {risco === "ok" ? (
            <ShieldCheck className="w-5 h-5 text-emerald-600" aria-hidden />
          ) : (
            <ShieldAlert className="w-5 h-5 text-rose-600" aria-hidden />
          )}
          {risco === "alto"
            ? "Atenção: há pontos críticos pendentes"
            : risco === "atencao"
              ? "Quase lá — ainda faltam itens"
              : "Tudo verificado"}
        </h3>
        <p className="text-sm text-brand-ink/80 mt-1">
          {verificados} de {ITENS.length} itens conferidos.
        </p>
        {criticosPendentes.length > 0 && (
          <div className="mt-2">
            <p className="text-xs font-bold uppercase tracking-wide text-rose-700 mb-1">
              Críticos a resolver antes de assinar
            </p>
            <ul className="space-y-1">
              {criticosPendentes.map((i) => (
                <li key={i.id} className="text-sm text-rose-900 leading-snug">
                  — {i.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <Link
          href="/advogados"
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-deep px-5 py-3 text-sm font-bold text-white hover:bg-brand-ink transition"
        >
          Falar com um advogado imobiliário
          <ArrowRight className="w-4 h-4" aria-hidden />
        </Link>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-brand-line px-5 py-3 text-sm font-bold text-brand-ink hover:border-brand-deep transition"
        >
          <RotateCcw className="w-4 h-4 text-brand-deep" aria-hidden />
          Limpar
        </button>
      </div>

      <aside
        role="note"
        className="mt-4 rounded-xl border-l-4 border-amber-400 bg-amber-50 p-3 text-xs text-amber-900 leading-relaxed flex items-start gap-2"
      >
        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden />
        <span>
          Checklist informativo. A análise completa de uma compra exige a leitura
          dos documentos por um advogado, que pode identificar riscos que um
          checklist genérico não alcança.
        </span>
      </aside>
    </section>
  );
}
