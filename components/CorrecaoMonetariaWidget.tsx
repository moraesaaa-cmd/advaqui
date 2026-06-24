"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Loader2,
  ChevronDown,
  Calculator
} from "lucide-react";

/**
 * Widget da correção monetária por índice oficial (/correcao-monetaria).
 * Conversa com /api/indices, que busca a série do índice no SGS do Banco
 * Central e devolve o fator acumulado + a memória mês a mês. O cálculo do
 * percentual vem do BCB; aqui só montamos a interface e exibimos a memória.
 */

type MesItem = { competencia: string; variacao: number };

type Resultado = {
  ok: true;
  indice: string;
  fonte: string;
  de: string;
  ate: string;
  aplicadoDe: string | null;
  aplicadoAte: string | null;
  fator: number;
  percentual: number;
  valorOriginal: number | null;
  valorCorrigido: number | null;
  meses: MesItem[];
  observacao?: string;
};

const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const pct = (n: number) =>
  `${n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;

const num = (s: string) => {
  const v = parseFloat(s.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(v) ? v : 0;
};

const INDICES = [
  { id: "ipca", label: "IPCA", hint: "índice oficial da inflação (IBGE)" },
  { id: "inpc", label: "INPC", hint: "famílias de baixa renda (IBGE)" },
  { id: "igpm", label: "IGP-M", hint: "aluguéis e contratos (FGV)" }
] as const;

export function CorrecaoMonetariaWidget() {
  const [indice, setIndice] = useState<string>("ipca");
  const [valor, setValor] = useState("");
  const [de, setDe] = useState("");
  const [ate, setAte] = useState("");
  const [estado, setEstado] = useState<"idle" | "loading" | "ok" | "erro">("idle");
  const [erro, setErro] = useState("");
  const [res, setRes] = useState<Resultado | null>(null);
  const [verMeses, setVerMeses] = useState(false);

  // Pré-preenche a data final com o mês corrente (só no cliente, sem mismatch).
  useEffect(() => {
    if (!ate) {
      const d = new Date();
      setAte(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const podeCalcular = useMemo(
    () => !!de && !!ate && estado !== "loading",
    [de, ate, estado]
  );

  async function calcular() {
    setEstado("loading");
    setErro("");
    setVerMeses(false);
    try {
      const qs = new URLSearchParams({ indice, de, ate });
      const v = num(valor);
      if (v > 0) qs.set("valor", String(v));
      const r = await fetch(`/api/indices?${qs.toString()}`);
      const j = await r.json();
      if (!j.ok) {
        setErro(j.mensagem || "Não foi possível calcular agora.");
        setEstado("erro");
        return;
      }
      setRes(j as Resultado);
      setEstado("ok");
    } catch {
      setErro("Falha de conexão. Tente novamente.");
      setEstado("erro");
    }
  }

  return (
    <main className="container-narrow py-10 md:py-14">
      <div className="text-center mb-6">
        <span className="chip border-brand-deep/30 bg-brand-deep/5 text-brand-ink mb-3">
          <TrendingUp className="w-3.5 h-3.5" aria-hidden /> Correção monetária
        </span>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink text-balance">
          Corrija um valor pelo IPCA, INPC ou IGP-M
        </h1>
        <p className="text-brand-ink/70 mt-3 max-w-xl mx-auto">
          Usa os índices oficiais publicados pelo Banco Central. Informe o valor
          e o período: a ferramenta acumula a inflação mês a mês e mostra a
          memória de cálculo aberta.
        </p>
      </div>

      <div className="card space-y-5">
        {/* Seletor de índice */}
        <div>
          <span className="label">Índice de correção</span>
          <div className="grid grid-cols-3 gap-2 mt-1">
            {INDICES.map((i) => (
              <button
                key={i.id}
                type="button"
                onClick={() => setIndice(i.id)}
                className={`rounded-xl border px-3 py-2.5 text-center transition ${
                  indice === i.id
                    ? "border-brand-accent bg-brand-accent/10 text-brand-ink font-semibold"
                    : "border-brand-line bg-white text-brand-ink/70 hover:border-brand-deep/40"
                }`}
              >
                <span className="block text-sm">{i.label}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-brand-ink/55 mt-1.5">
            {INDICES.find((i) => i.id === indice)?.hint}
          </p>
        </div>

        <div>
          <label className="label" htmlFor="valor">Valor a corrigir (R$) — opcional</label>
          <input
            id="valor"
            inputMode="decimal"
            className="input"
            placeholder="Ex.: 1.000,00"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
          <p className="text-xs text-brand-ink/55 mt-1.5">
            Deixe em branco para ver só o percentual acumulado do período.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="de">Data do valor (mês/ano)</label>
            <input
              id="de"
              type="month"
              className="input"
              value={de}
              max={ate || undefined}
              onChange={(e) => setDe(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="ate">Corrigir até (mês/ano)</label>
            <input
              id="ate"
              type="month"
              className="input"
              value={ate}
              min={de || undefined}
              onChange={(e) => setAte(e.target.value)}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={calcular}
          disabled={!podeCalcular}
          className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {estado === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> Calculando…
            </>
          ) : (
            <>
              <Calculator className="w-4 h-4" aria-hidden /> Calcular correção
            </>
          )}
        </button>

        {estado === "erro" && (
          <div className="flex items-start gap-2 text-sm p-3 rounded-xl border border-red-200 bg-red-50 text-red-800">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden />
            <span>{erro}</span>
          </div>
        )}

        {estado === "ok" && res && (
          <div className="rounded-2xl border-2 border-brand-accent bg-brand-accent/5 p-5">
            {res.valorCorrigido != null ? (
              <>
                <p className="text-sm text-brand-ink/70">Valor corrigido</p>
                <p className="font-display text-3xl font-bold text-brand-ink mt-1">
                  {brl(res.valorCorrigido)}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-brand-ink/70">Correção acumulada no período</p>
                <p className="font-display text-3xl font-bold text-brand-ink mt-1">
                  {pct(res.percentual)}
                </p>
              </>
            )}

            <table className="w-full text-sm mt-4 border-t border-brand-accent/30">
              <tbody className="divide-y divide-brand-accent/20">
                {res.valorOriginal != null && (
                  <tr>
                    <td className="py-1.5 text-brand-ink/75">Valor original</td>
                    <td className="py-1.5 text-right font-medium text-brand-ink">
                      {brl(res.valorOriginal)}
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="py-1.5 text-brand-ink/75">
                    {res.indice} acumulado ({res.aplicadoDe ?? "—"} a {res.aplicadoAte ?? "—"})
                  </td>
                  <td className="py-1.5 text-right font-medium text-brand-ink">
                    {pct(res.percentual)}
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5 text-brand-ink/75">Fator de correção</td>
                  <td className="py-1.5 text-right font-medium text-brand-ink">
                    {res.fator.toLocaleString("pt-BR", { minimumFractionDigits: 6, maximumFractionDigits: 6 })}
                  </td>
                </tr>
                {res.valorCorrigido != null && res.valorOriginal != null && (
                  <tr>
                    <td className="py-2 font-bold text-brand-ink">Diferença</td>
                    <td className="py-2 text-right font-bold text-brand-deep">
                      {brl(res.valorCorrigido - res.valorOriginal)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {res.observacao && (
              <p className="text-xs text-brand-ink/60 mt-3 italic">{res.observacao}</p>
            )}

            {res.meses.length > 0 && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => setVerMeses((v) => !v)}
                  className="inline-flex items-center gap-1 text-sm text-brand-deep font-medium hover:underline"
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${verMeses ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                  {verMeses ? "Ocultar" : "Ver"} memória mês a mês ({res.meses.length} meses)
                </button>
                {verMeses && (
                  <div className="mt-2 max-h-64 overflow-y-auto rounded-xl border border-brand-line bg-white">
                    <table className="w-full text-xs">
                      <thead className="sticky top-0 bg-brand-bg/90 text-brand-ink/60">
                        <tr>
                          <th className="text-left py-1.5 px-3 font-medium">Competência</th>
                          <th className="text-right py-1.5 px-3 font-medium">Variação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-line">
                        {res.meses.map((m) => (
                          <tr key={m.competencia}>
                            <td className="py-1.5 px-3 text-brand-ink/75">{m.competencia}</td>
                            <td className={`py-1.5 px-3 text-right tabular-nums ${m.variacao < 0 ? "text-red-600" : "text-brand-ink"}`}>
                              {m.variacao.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex items-start gap-2 text-xs p-3 rounded-xl border border-amber-200 bg-amber-50 text-amber-900">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden />
          <span>
            Mesma metodologia da Calculadora do Cidadão do Banco Central: aplica
            os índices do mês inicial ao mês final, inclusive. Para juros de mora e
            multa, use a{" "}
            <Link href="/atualizar-valor" className="underline font-medium">
              calculadora de atualização de valores
            </Link>
            . Sem cláusula em contrário, a Lei 14.905/2024 manda corrigir pelo
            IPCA. Confira sempre o índice e o marco inicial do seu caso.
          </span>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-brand-line bg-brand-bg/40 p-5 text-center">
        <p className="text-sm text-brand-ink/75">
          Precisa cobrar ou contestar esse valor com segurança?
        </p>
        <Link href="/advogados" className="btn-primary mt-3 inline-flex">
          Encontrar um advogado <ArrowRight className="w-4 h-4" aria-hidden />
        </Link>
      </div>
    </main>
  );
}
