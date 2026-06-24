"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Wallet, AlertTriangle, ArrowRight, XCircle } from "lucide-react";

/**
 * Simulador de seguro-desemprego (/seguro-desemprego).
 *
 * Determinístico, roda no navegador, não envia dados. Calcula o número de
 * parcelas (regra do CODEFAT, estável) e o valor de cada parcela pela tabela
 * oficial do MTE. A tabela de valores é reajustada todo janeiro pelo INPC —
 * por isso fica isolada em TABELA, com a competência explícita.
 */

// Tabela vigente desde 11/01/2026 (reajuste INPC 3,90%). Fonte: MTE/gov.br.
const TABELA = {
  vigencia: "11/01/2026",
  faixa1Ate: 2222.17,
  faixa2Ate: 3703.99,
  faixa2Base: 1777.74,
  teto: 2518.65,
  piso: 1621.0
};

const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const num = (s: string) => {
  const v = parseFloat(s.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(v) ? v : 0;
};

/** Número de parcelas pela regra do CODEFAT (depende da solicitação e do tempo). */
function calcParcelas(solicitacao: number, meses: number): number {
  if (solicitacao === 1) {
    if (meses >= 24) return 5;
    if (meses >= 12) return 4;
    return 0;
  }
  if (solicitacao === 2) {
    if (meses >= 24) return 5;
    if (meses >= 12) return 4;
    if (meses >= 9) return 3;
    return 0;
  }
  // 3ª solicitação ou mais
  if (meses >= 24) return 5;
  if (meses >= 12) return 4;
  if (meses >= 6) return 3;
  return 0;
}

/** Valor de cada parcela pela tabela do MTE, respeitando o piso. */
function calcValorParcela(media: number): number {
  let v: number;
  if (media <= TABELA.faixa1Ate) v = media * 0.8;
  else if (media <= TABELA.faixa2Ate)
    v = (media - TABELA.faixa1Ate) * 0.5 + TABELA.faixa2Base;
  else v = TABELA.teto;
  return Math.max(v, TABELA.piso);
}

const REQUISITO_MIN: Record<number, number> = { 1: 12, 2: 9, 3: 6 };

export function SeguroDesempregoWidget() {
  const [solicitacao, setSolicitacao] = useState(1);
  const [meses, setMeses] = useState("");
  const [media, setMedia] = useState("");

  const r = useMemo(() => {
    const m = parseInt(meses, 10) || 0;
    const sal = num(media);
    if (m <= 0 || sal <= 0) return null;
    const parcelas = calcParcelas(solicitacao, m);
    if (parcelas === 0) {
      return {
        elegivel: false as const,
        minimo: REQUISITO_MIN[solicitacao]
      };
    }
    const valor = calcValorParcela(sal);
    return {
      elegivel: true as const,
      parcelas,
      valor,
      total: valor * parcelas
    };
  }, [solicitacao, meses, media]);

  return (
    <main className="container-narrow py-10 md:py-14">
      <div className="text-center mb-6">
        <span className="chip border-brand-deep/30 bg-brand-deep/5 text-brand-ink mb-3">
          <Wallet className="w-3.5 h-3.5" aria-hidden /> Seguro-desemprego
        </span>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink text-balance">
          Quantas parcelas de seguro-desemprego eu recebo?
        </h1>
        <p className="text-brand-ink/70 mt-3 max-w-xl mx-auto">
          Estime o número de parcelas e o valor de cada uma pela tabela oficial
          do Ministério do Trabalho. Vale para a demissão sem justa causa do
          trabalhador formal.
        </p>
      </div>

      <div className="card space-y-5">
        <div>
          <label className="label" htmlFor="solicitacao">É a sua primeira vez pedindo?</label>
          <select
            id="solicitacao"
            className="input"
            value={solicitacao}
            onChange={(e) => setSolicitacao(parseInt(e.target.value, 10))}
          >
            <option value={1}>1ª solicitação</option>
            <option value={2}>2ª solicitação</option>
            <option value={3}>3ª solicitação ou mais</option>
          </select>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="meses">Meses trabalhados antes da demissão</label>
            <input
              id="meses"
              inputMode="numeric"
              className="input"
              placeholder="Ex.: 18"
              value={meses}
              onChange={(e) => setMeses(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="media">Média dos 3 últimos salários (R$)</label>
            <input
              id="media"
              inputMode="decimal"
              className="input"
              placeholder="Ex.: 2.500,00"
              value={media}
              onChange={(e) => setMedia(e.target.value)}
            />
          </div>
        </div>

        {r === null ? (
          <p className="text-sm text-brand-ink/55 italic">
            Preencha os campos para ver a estimativa.
          </p>
        ) : !r.elegivel ? (
          <div className="flex items-start gap-2 text-sm p-4 rounded-2xl border-2 border-red-200 bg-red-50 text-red-800">
            <XCircle className="w-5 h-5 mt-0.5 shrink-0" aria-hidden />
            <span>
              Com esse tempo de trabalho, ainda não há direito ao benefício nesta
              solicitação. Para a {solicitacao}ª vez, são exigidos pelo menos{" "}
              <strong>{r.minimo} meses</strong> de trabalho com carteira assinada.
            </span>
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-brand-accent bg-brand-accent/5 p-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-brand-ink/70">Parcelas</p>
                <p className="font-display text-3xl font-bold text-brand-ink mt-1">
                  {r.parcelas}
                </p>
              </div>
              <div>
                <p className="text-sm text-brand-ink/70">Valor de cada parcela</p>
                <p className="font-display text-3xl font-bold text-brand-ink mt-1">
                  {brl(r.valor)}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-brand-accent/30 flex items-center justify-between">
              <span className="text-sm font-medium text-brand-ink">Total estimado</span>
              <span className="font-display text-xl font-bold text-brand-deep">
                {brl(r.total)}
              </span>
            </div>
            <p className="text-xs text-brand-ink/55 mt-2">
              {r.valor === TABELA.piso
                ? "Valor ajustado ao piso (salário mínimo)."
                : r.valor === TABELA.teto
                ? "Valor no teto do benefício."
                : "As parcelas costumam ser pagas mensalmente."}
            </p>
          </div>
        )}

        <div className="flex items-start gap-2 text-xs p-3 rounded-xl border border-amber-200 bg-amber-50 text-amber-900">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden />
          <span>
            Estimativa pela tabela do MTE vigente desde {TABELA.vigencia} (piso{" "}
            {brl(TABELA.piso)}, teto {brl(TABELA.teto)}), reajustada todo janeiro
            pelo INPC. O número de parcelas segue a regra do CODEFAT. Empregado
            doméstico, pescador artesanal e trabalhador resgatado têm regras
            próprias. Confirme no portal gov.br ou com um advogado.
          </span>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-brand-line bg-brand-bg/40 p-5 text-center">
        <p className="text-sm text-brand-ink/75">
          Demitido de forma irregular ou com o benefício negado?
        </p>
        <Link href="/advogados-de/trabalhista" className="btn-primary mt-3 inline-flex">
          Falar com um advogado trabalhista <ArrowRight className="w-4 h-4" aria-hidden />
        </Link>
      </div>
    </main>
  );
}
