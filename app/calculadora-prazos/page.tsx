"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarClock,
  AlertTriangle,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { ToolGate } from "@/components/ToolGate";

/**
 * /calculadora-prazos — Calculadora de prazos processuais.
 *
 * Conta o vencimento de um prazo a partir da data da intimação, em dias úteis
 * (CPC art. 219) ou corridos, excluindo o dia do começo (art. 224), pulando
 * fins de semana e feriados nacionais + feriados forenses móveis comuns
 * (Sexta-feira Santa, Carnaval, Corpus Christi). Prorroga o vencimento para o
 * próximo dia útil quando cai em dia não útil.
 *
 * Tudo no navegador, determinístico, sem enviar dados. NÃO considera feriados
 * estaduais/municipais nem recesso forense (20/12–20/01) — disclaimer no rodapé.
 */

const pad = (n: number) => String(n).padStart(2, "0");
const fmtISO = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const addDays = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

const SEMANA = [
  "domingo",
  "segunda-feira",
  "terça-feira",
  "quarta-feira",
  "quinta-feira",
  "sexta-feira",
  "sábado"
];
const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
];
const fmtBR = (d: Date) =>
  `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
const fmtExtenso = (d: Date) =>
  `${SEMANA[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;

// Domingo de Páscoa (algoritmo de Meeus/Jones/Butcher).
function pascoa(ano: number): Date {
  const a = ano % 19;
  const b = Math.floor(ano / 100);
  const c = ano % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31);
  const dia = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(ano, mes - 1, dia);
}

const feriadoCache = new Map<number, Set<string>>();
function feriados(ano: number): Set<string> {
  const cached = feriadoCache.get(ano);
  if (cached) return cached;
  const s = new Set<string>();
  // Fixos nacionais
  const fixos: Array<[number, number]> = [
    [1, 1], [4, 21], [5, 1], [9, 7], [10, 12],
    [11, 2], [11, 15], [11, 20], [12, 25]
  ];
  for (const [mes, dia] of fixos) s.add(fmtISO(new Date(ano, mes - 1, dia)));
  // Móveis (relativos à Páscoa) — feriados forenses comuns
  const p = pascoa(ano);
  s.add(fmtISO(addDays(p, -48))); // segunda de carnaval
  s.add(fmtISO(addDays(p, -47))); // terça de carnaval
  s.add(fmtISO(addDays(p, -2))); // sexta-feira santa
  s.add(fmtISO(addDays(p, 60))); // corpus christi
  feriadoCache.set(ano, s);
  return s;
}

function ehDiaUtil(d: Date): boolean {
  const dia = d.getDay();
  if (dia === 0 || dia === 6) return false;
  return !feriados(d.getFullYear()).has(fmtISO(d));
}

function proximoDiaUtil(d: Date): Date {
  let cur = d;
  while (!ehDiaUtil(cur)) cur = addDays(cur, 1);
  return cur;
}

type Resultado = {
  termoInicial: Date;
  vencimento: Date;
  intimacaoNaoUtil: boolean;
};

function calcular(
  intimacaoISO: string,
  nDias: number,
  tipo: "uteis" | "corridos"
): Resultado | null {
  if (!intimacaoISO || nDias < 1) return null;
  const [y, m, d] = intimacaoISO.split("-").map(Number);
  if (!y || !m || !d) return null;
  const intimacao = new Date(y, m - 1, d);

  // Se a intimação cai em dia não útil, considera-se feita no 1º dia útil seguinte.
  const intimacaoNaoUtil = !ehDiaUtil(intimacao);
  const baseIntimacao = proximoDiaUtil(intimacao);

  // Exclui o dia do começo: termo inicial = 1º dia útil após a intimação.
  const termoInicial = proximoDiaUtil(addDays(baseIntimacao, 1));

  let vencimento: Date;
  if (tipo === "uteis") {
    let cur = termoInicial;
    let count = 1;
    while (count < nDias) {
      cur = addDays(cur, 1);
      if (ehDiaUtil(cur)) count++;
    }
    vencimento = cur;
  } else {
    vencimento = proximoDiaUtil(addDays(termoInicial, nDias - 1));
  }
  return { termoInicial, vencimento, intimacaoNaoUtil };
}

const PRESETS: Array<{ label: string; dias: number; tipo: "uteis" }> = [
  { label: "5 dias úteis (ex.: embargos de declaração)", dias: 5, tipo: "uteis" },
  { label: "15 dias úteis (ex.: contestação, apelação)", dias: 15, tipo: "uteis" },
  { label: "30 dias úteis", dias: 30, tipo: "uteis" }
];

export default function CalculadoraPrazosPage() {
  const [intimacao, setIntimacao] = useState("");
  const [dias, setDias] = useState("15");
  const [tipo, setTipo] = useState<"uteis" | "corridos">("uteis");

  const res = useMemo(
    () => calcular(intimacao, parseInt(dias, 10) || 0, tipo),
    [intimacao, dias, tipo]
  );

  return (
    <main className="container-narrow py-10 md:py-14">
      <div className="text-center mb-6">
        <span className="chip border-brand-deep/30 bg-brand-deep/5 text-brand-ink mb-3">
          <CalendarClock className="w-3.5 h-3.5" aria-hidden /> Prazos processuais
        </span>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink text-balance">
          Calculadora de prazos processuais
        </h1>
        <p className="text-brand-ink/70 mt-3 max-w-xl mx-auto">
          Informe a data da intimação e o prazo. A calculadora exclui o dia do
          começo, pula fins de semana e feriados nacionais, e prorroga o
          vencimento quando cai em dia não útil.
        </p>
      </div>

      <ToolGate>
      <div className="card space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="intimacao">Data da intimação / publicação</label>
            <input
              id="intimacao"
              type="date"
              className="input"
              value={intimacao}
              onChange={(e) => setIntimacao(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="dias">Prazo (quantidade de dias)</label>
            <input
              id="dias"
              type="number"
              min={1}
              className="input"
              value={dias}
              onChange={(e) => setDias(e.target.value)}
            />
          </div>
        </div>

        <div>
          <span className="label">Contagem</span>
          <div className="flex gap-2">
            {([
              ["uteis", "Dias úteis (CPC)"],
              ["corridos", "Dias corridos"]
            ] as const).map(([val, lab]) => (
              <button
                key={val}
                type="button"
                onClick={() => setTipo(val)}
                aria-pressed={tipo === val}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${
                  tipo === val
                    ? "bg-brand-ink text-white border-brand-ink"
                    : "bg-white text-brand-ink border-brand-line hover:border-brand-deep"
                }`}
              >
                {lab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                setDias(String(p.dias));
                setTipo(p.tipo);
              }}
              className="chip hover:border-brand-deep cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Resultado */}
        {res ? (
          <div className="rounded-2xl border-2 border-brand-accent bg-brand-accent/5 p-5">
            <p className="text-sm text-brand-ink/70">O prazo vence em</p>
            <p className="font-display text-3xl font-bold text-brand-ink mt-1">
              {fmtBR(res.vencimento)}
            </p>
            <p className="text-sm text-brand-deep font-medium capitalize">
              {fmtExtenso(res.vencimento)}
            </p>
            <div className="mt-4 space-y-1.5 text-sm text-brand-ink/75 border-t border-brand-accent/30 pt-3">
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-deep" aria-hidden />
                Termo inicial (1º dia do prazo): <strong>{fmtBR(res.termoInicial)}</strong>
              </p>
              <p>
                {parseInt(dias, 10)}{" "}
                {tipo === "uteis" ? "dias úteis" : "dias corridos"}, excluído o
                dia da intimação.
              </p>
              {res.intimacaoNaoUtil && (
                <p className="text-amber-800">
                  A intimação caiu em dia não útil — considerada no 1º dia útil
                  seguinte.
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-brand-ink/55 italic">
            Preencha a data da intimação e o prazo para ver o vencimento.
          </p>
        )}

        <div className="flex items-start gap-2 text-xs p-3 rounded-xl border border-amber-200 bg-amber-50 text-amber-900">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden />
          <span>
            Considera fins de semana e feriados nacionais (incluindo Carnaval,
            Sexta-feira Santa e Corpus Christi). <strong>Não</strong> inclui
            feriados estaduais/municipais nem o recesso forense (20/12 a 20/01).
            Sempre confira no tribunal — esta é uma ferramenta de apoio.
          </span>
        </div>
      </div>
      </ToolGate>

      <div className="mt-6 rounded-2xl border border-brand-line bg-brand-bg/40 p-5 text-center">
        <p className="text-sm text-brand-ink/75">
          Precisa de um advogado para cuidar do seu caso dentro do prazo?
        </p>
        <Link href="/advogados" className="btn-primary mt-3 inline-flex">
          Encontrar um advogado <ArrowRight className="w-4 h-4" aria-hidden />
        </Link>
      </div>
    </main>
  );
}
