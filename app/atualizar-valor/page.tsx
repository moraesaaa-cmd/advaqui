"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Coins, AlertTriangle, ArrowRight } from "lucide-react";
import { ToolGate } from "@/components/ToolGate";

/**
 * /atualizar-valor — Calculadora interativa de atualização de valores.
 *
 * Soma correção monetária + juros de mora + multa sobre um valor principal.
 * O índice de correção é informado pelo usuário (não buscamos séries de
 * índice), mantendo o cálculo determinístico, transparente e sem enviar
 * dados. Mostra a memória de cálculo passo a passo.
 */

const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const num = (s: string) => {
  const v = parseFloat(s.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(v) ? v : 0;
};

export default function AtualizarValorPage() {
  const [principal, setPrincipal] = useState("");
  const [correcao, setCorrecao] = useState("");
  const [jurosAm, setJurosAm] = useState("1");
  const [meses, setMeses] = useState("");
  const [multa, setMulta] = useState("");

  const r = useMemo(() => {
    const p = num(principal);
    if (p <= 0) return null;
    const corr = p * (num(correcao) / 100);
    const base = p + corr;
    const juros = base * (num(jurosAm) / 100) * num(meses);
    const m = base * (num(multa) / 100);
    return { p, corr, base, juros, multa: m, total: base + juros + m };
  }, [principal, correcao, jurosAm, meses, multa]);

  const field = (
    id: string,
    label: string,
    value: string,
    set: (v: string) => void,
    placeholder: string,
    suffix?: string
  ) => (
    <div>
      <label className="label" htmlFor={id}>{label}</label>
      <div className="relative">
        <input
          id={id}
          inputMode="decimal"
          className="input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => set(e.target.value)}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-brand-ink/40">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <main className="container-narrow py-10 md:py-14">
      <div className="text-center mb-6">
        <span className="chip border-brand-deep/30 bg-brand-deep/5 text-brand-ink mb-3">
          <Coins className="w-3.5 h-3.5" aria-hidden /> Atualização de valores
        </span>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink text-balance">
          Atualize uma dívida ou valor a receber
        </h1>
        <p className="text-brand-ink/70 mt-3 max-w-xl mx-auto">
          Some correção monetária, juros de mora e multa, e veja a memória de
          cálculo aberta. O cálculo roda no seu navegador.
        </p>
      </div>

      <ToolGate>
      <div className="card space-y-5">
        {field("principal", "Valor principal (R$)", principal, setPrincipal, "Ex.: 1.000,00")}
        <div className="grid sm:grid-cols-2 gap-4">
          {field("correcao", "Correção monetária acumulada", correcao, setCorrecao, "Ex.: 5", "%")}
          {field("multa", "Multa", multa, setMulta, "Ex.: 2", "%")}
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {field("jurosAm", "Juros de mora ao mês", jurosAm, setJurosAm, "Ex.: 1", "% a.m.")}
          {field("meses", "Meses em atraso", meses, setMeses, "Ex.: 10", "meses")}
        </div>

        {r ? (
          <div className="rounded-2xl border-2 border-brand-accent bg-brand-accent/5 p-5">
            <p className="text-sm text-brand-ink/70">Valor atualizado</p>
            <p className="font-display text-3xl font-bold text-brand-ink mt-1">
              {brl(r.total)}
            </p>
            <table className="w-full text-sm mt-4 border-t border-brand-accent/30">
              <tbody className="divide-y divide-brand-accent/20">
                <tr>
                  <td className="py-1.5 text-brand-ink/75">Principal</td>
                  <td className="py-1.5 text-right font-medium text-brand-ink">{brl(r.p)}</td>
                </tr>
                <tr>
                  <td className="py-1.5 text-brand-ink/75">+ Correção monetária</td>
                  <td className="py-1.5 text-right font-medium text-brand-ink">{brl(r.corr)}</td>
                </tr>
                <tr>
                  <td className="py-1.5 text-brand-ink/75">+ Juros de mora</td>
                  <td className="py-1.5 text-right font-medium text-brand-ink">{brl(r.juros)}</td>
                </tr>
                <tr>
                  <td className="py-1.5 text-brand-ink/75">+ Multa</td>
                  <td className="py-1.5 text-right font-medium text-brand-ink">{brl(r.multa)}</td>
                </tr>
                <tr>
                  <td className="py-2 font-bold text-brand-ink">Total</td>
                  <td className="py-2 text-right font-bold text-brand-deep">{brl(r.total)}</td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-brand-ink/55 mt-2">
              Juros calculados sobre o valor já corrigido ({jurosAm || "0"}% × {meses || "0"} meses, juros simples).
            </p>
          </div>
        ) : (
          <p className="text-sm text-brand-ink/55 italic">
            Informe ao menos o valor principal para ver o resultado.
          </p>
        )}

        <div className="flex items-start gap-2 text-xs p-3 rounded-xl border border-amber-200 bg-amber-50 text-amber-900">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden />
          <span>
            Cálculo de apoio com juros simples. Sem taxa pactuada, a Lei
            14.905/2024 manda corrigir pelo IPCA e aplicar juros pela Selic
            (descontado o IPCA) — confirme o índice e o regime de juros da sua
            dívida. Capitalização (juros compostos) só com previsão.
          </span>
        </div>
      </div>
      </ToolGate>

      <div className="mt-6 rounded-2xl border border-brand-line bg-brand-bg/40 p-5 text-center">
        <p className="text-sm text-brand-ink/75">
          Quer cobrar ou contestar esse valor com segurança?
        </p>
        <Link href="/advogados" className="btn-primary mt-3 inline-flex">
          Encontrar um advogado <ArrowRight className="w-4 h-4" aria-hidden />
        </Link>
      </div>
    </main>
  );
}
