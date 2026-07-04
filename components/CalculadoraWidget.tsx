"use client";

import { useState } from "react";
import { Calculator, AlertCircle } from "lucide-react";

/**
 * Calculadora INTERATIVA de verdade — a pessoa digita os números dela e o
 * site calcula ao vivo. Cada slug tem seus campos + fórmula real.
 *
 * Onde a lei NÃO tem fórmula fixa (pensão alimentícia, regras de transição
 * da aposentadoria), o resultado é apresentado como ESTIMATIVA com aviso
 * claro — sem inventar número como se fosse regra fechada.
 *
 * Tudo roda no navegador (client component). Nenhum dado é enviado.
 */

type FieldType = "number" | "select";

type Field = {
  name: string;
  label: string;
  type: FieldType;
  default: number | string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{ value: string; label: string }>;
  help?: string;
};

type ResultLine = { label: string; value: string; emphasis?: boolean; hint?: string };

type CalcDef = {
  fields: Field[];
  compute: (v: Record<string, number | string>) => ResultLine[];
  note: string;
};

const brl = (n: number): string =>
  (isFinite(n) ? n : 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

const num = (v: number | string): number => {
  const n = typeof v === "number" ? v : parseFloat(String(v).replace(",", "."));
  return isFinite(n) ? n : 0;
};

const CALCS: Record<string, CalcDef> = {
  "rescisao-trabalhista": {
    fields: [
      { name: "salario", label: "Salário mensal", type: "number", default: 2000, suffix: "R$", min: 0, step: 100 },
      { name: "diasMes", label: "Dias trabalhados no mês da saída", type: "number", default: 30, min: 0, max: 31 },
      { name: "meses13", label: "Meses trabalhados no ano (p/ 13º)", type: "number", default: 12, min: 0, max: 12, help: "Conta o mês se trabalhou 15 dias ou mais nele." },
      { name: "mesesFerias", label: "Meses do período aquisitivo (p/ férias proporcionais)", type: "number", default: 12, min: 0, max: 12 },
      { name: "anos", label: "Anos completos na empresa", type: "number", default: 1, min: 0, max: 50, help: "Usado no aviso prévio (30 dias + 3 por ano, até 90)." },
      { name: "fgts", label: "Saldo do FGTS depositado", type: "number", default: 0, suffix: "R$", min: 0, step: 100, help: "Para calcular a multa de 40% (dispensa sem justa causa)." },
      { name: "aviso", label: "Aviso prévio", type: "select", default: "indenizado", options: [{ value: "indenizado", label: "Indenizado (empresa paga)" }, { value: "trabalhado", label: "Trabalhado / não se aplica" }] },
      { name: "feriasVencidas", label: "Tem férias vencidas (período completo não gozado)?", type: "select", default: "nao", options: [{ value: "nao", label: "Não" }, { value: "sim", label: "Sim (+ salário + 1/3)" }] }
    ],
    compute: (v) => {
      const salario = num(v.salario);
      const saldoSalario = (salario / 30) * num(v.diasMes);
      const d13 = (salario / 12) * num(v.meses13);
      const fProp = (salario / 12) * num(v.mesesFerias) * (4 / 3);
      const fVenc = v.feriasVencidas === "sim" ? salario * (4 / 3) : 0;
      const avisoDias = Math.min(30 + 3 * num(v.anos), 90);
      const avisoVal = v.aviso === "indenizado" ? (salario / 30) * avisoDias : 0;
      const multa = num(v.fgts) * 0.4;
      const total = saldoSalario + d13 + fProp + fVenc + avisoVal + multa;
      const lines: ResultLine[] = [
        { label: "Saldo de salário", value: brl(saldoSalario) },
        { label: "13º proporcional", value: brl(d13) },
        { label: "Férias proporcionais + 1/3", value: brl(fProp) }
      ];
      if (fVenc > 0) lines.push({ label: "Férias vencidas + 1/3", value: brl(fVenc) });
      if (avisoVal > 0) lines.push({ label: `Aviso prévio indenizado (${avisoDias} dias)`, value: brl(avisoVal) });
      if (multa > 0) lines.push({ label: "Multa de 40% do FGTS", value: brl(multa) });
      lines.push({ label: "Total estimado da rescisão", value: brl(total), emphasis: true });
      return lines;
    },
    note: "Estimativa de dispensa SEM justa causa. Não considera descontos de INSS/IRRF sobre saldo e 13º, nem eventuais adicionais (insalubridade, horas extras habituais). Confirme com um advogado trabalhista."
  },

  ferias: {
    fields: [
      { name: "salario", label: "Salário mensal", type: "number", default: 2000, suffix: "R$", min: 0, step: 100 },
      { name: "dias", label: "Dias de férias que vai tirar", type: "number", default: 30, min: 1, max: 30 },
      { name: "abono", label: "Vender 1/3 (abono pecuniário)?", type: "select", default: "nao", options: [{ value: "nao", label: "Não" }, { value: "sim", label: "Sim (vender 10 dias)" }] }
    ],
    compute: (v) => {
      const salario = num(v.salario);
      const dias = Math.min(num(v.dias), 30);
      const base = salario * (dias / 30);
      const umTerco = base / 3;
      const totalFerias = base + umTerco;
      const lines: ResultLine[] = [
        { label: `Férias (${dias} dias)`, value: brl(base) },
        { label: "Adicional de 1/3", value: brl(umTerco) },
        { label: "Total das férias", value: brl(totalFerias), emphasis: true }
      ];
      if (v.abono === "sim") {
        const abonoBase = salario * (10 / 30);
        const abonoTotal = abonoBase + abonoBase / 3;
        lines.push({ label: "Abono pecuniário (10 dias vendidos + 1/3)", value: brl(abonoTotal), hint: "Pago junto, e você descansa 20 dias." });
      }
      return lines;
    },
    note: "Valores brutos, antes de INSS e IRRF. O adicional de 1/3 é garantido pela Constituição. O abono (vender 1/3) é um direito do trabalhador, limitado a 10 dias."
  },

  "decimo-terceiro": {
    fields: [
      { name: "salario", label: "Salário mensal", type: "number", default: 2000, suffix: "R$", min: 0, step: 100 },
      { name: "meses", label: "Meses trabalhados no ano", type: "number", default: 12, min: 0, max: 12, help: "Conta o mês se trabalhou 15 dias ou mais." }
    ],
    compute: (v) => {
      const salario = num(v.salario);
      const total = (salario / 12) * num(v.meses);
      return [
        { label: "13º proporcional (bruto)", value: brl(total), emphasis: true },
        { label: "1ª parcela (50%, até 30/nov)", value: brl(total / 2) },
        { label: "2ª parcela (50%, até 20/dez)", value: brl(total / 2), hint: "Da 2ª parcela descontam-se INSS e IRRF." }
      ];
    },
    note: "Cálculo proporcional bruto. A 2ª parcela sofre desconto de INSS e Imposto de Renda conforme as faixas vigentes."
  },

  "horas-extras": {
    fields: [
      { name: "salario", label: "Salário mensal", type: "number", default: 2000, suffix: "R$", min: 0, step: 100 },
      { name: "jornada", label: "Horas mensais da jornada", type: "number", default: 220, min: 1, max: 320, help: "220 é o padrão para 44h semanais." },
      { name: "qtd", label: "Quantidade de horas extras", type: "number", default: 10, min: 0, step: 1 },
      { name: "adicional", label: "Adicional", type: "select", default: "50", options: [{ value: "50", label: "50% (dia comum)" }, { value: "100", label: "100% (domingo/feriado)" }] }
    ],
    compute: (v) => {
      const salario = num(v.salario);
      const jornada = num(v.jornada) || 220;
      const valorHora = salario / jornada;
      const adic = num(v.adicional);
      const valorHE = valorHora * (1 + adic / 100);
      const total = valorHE * num(v.qtd);
      return [
        { label: "Valor da hora normal", value: brl(valorHora) },
        { label: `Valor da hora extra (+${adic}%)`, value: brl(valorHE) },
        { label: "Total das horas extras", value: brl(total), emphasis: true, hint: "Horas extras habituais geram reflexos em férias, 13º, FGTS e DSR." }
      ];
    },
    note: "Cálculo do adicional sobre a hora. Não inclui o reflexo no descanso semanal remunerado (DSR) nem em férias/13º, que dependem da habitualidade."
  },

  "fgts-correcao": {
    fields: [
      { name: "salario", label: "Salário mensal", type: "number", default: 2000, suffix: "R$", min: 0, step: 100 },
      { name: "meses", label: "Meses para projetar o depósito", type: "number", default: 12, min: 0, max: 600 },
      { name: "saldo", label: "Saldo atual do FGTS (p/ multa)", type: "number", default: 0, suffix: "R$", min: 0, step: 100 }
    ],
    compute: (v) => {
      const salario = num(v.salario);
      const dep = salario * 0.08;
      const projetado = dep * num(v.meses);
      const multa = num(v.saldo) * 0.4;
      const lines: ResultLine[] = [
        { label: "Depósito mensal (8% do salário)", value: brl(dep) },
        { label: `Depósito projetado em ${num(v.meses)} meses`, value: brl(projetado), hint: "Sem contar a correção monetária do saldo." }
      ];
      if (multa > 0) lines.push({ label: "Multa de 40% (dispensa sem justa causa)", value: brl(multa), emphasis: true });
      return lines;
    },
    note: "O empregador deposita 8% do salário por mês na conta do FGTS. A correção monetária do saldo depende do índice aplicado pela Caixa e não está incluída nesta projeção."
  },

  "pensao-alimenticia-percentual": {
    fields: [
      { name: "renda", label: "Renda líquida de quem paga", type: "number", default: 2000, suffix: "R$", min: 0, step: 100 },
      { name: "percentual", label: "Percentual considerado", type: "number", default: 25, suffix: "%", min: 0, max: 100, step: 1, help: "Faixa comum: 15% a 30% por filho. NÃO é regra fixa." }
    ],
    compute: (v) => {
      const renda = num(v.renda);
      const pct = num(v.percentual);
      return [
        { label: `Estimativa (${pct}% da renda)`, value: brl((renda * pct) / 100), emphasis: true, hint: "Apenas uma simulação a partir do percentual que você escolheu." }
      ];
    },
    note: "ATENÇÃO: não existe percentual fixo em lei. O juiz fixa a pensão pelo binômio necessidade (de quem recebe) × possibilidade (de quem paga), caso a caso. Este é só um simulador a partir de um percentual hipotético — não é previsão de decisão judicial."
  },

  "aposentadoria-tempo-contribuicao": {
    fields: [
      { name: "idade", label: "Sua idade (anos)", type: "number", default: 55, min: 0, max: 120 },
      { name: "tempo", label: "Tempo de contribuição (anos)", type: "number", default: 30, min: 0, max: 60 },
      { name: "sexo", label: "Sexo", type: "select", default: "M", options: [{ value: "M", label: "Masculino" }, { value: "F", label: "Feminino" }] }
    ],
    compute: (v) => {
      const idade = num(v.idade);
      const tempo = num(v.tempo);
      const pontos = idade + tempo;
      const tempoMin = v.sexo === "F" ? 30 : 35;
      const faltaTempo = Math.max(0, tempoMin - tempo);
      return [
        { label: "Sua pontuação (idade + tempo de contribuição)", value: `${pontos} pontos`, emphasis: true },
        { label: "Tempo mínimo de contribuição exigido", value: `${tempoMin} anos` },
        {
          label: "Falta de tempo de contribuição",
          value: faltaTempo > 0 ? `${faltaTempo} ano(s)` : "Requisito de tempo atingido",
          hint: "A regra dos pontos e o pedágio mudam a cada ano. Confirme no Meu INSS."
        }
      ];
    },
    note: "ATENÇÃO: as regras de transição da Reforma da Previdência (EC 103/2019) mudam a cada ano (pontos, pedágio, idade mínima progressiva) e variam por categoria. Este simulador mostra apenas sua pontuação e o tempo mínimo de contribuição — NÃO confirma direito à aposentadoria. Verifique no Meu INSS e com um advogado previdenciário."
  },

  "inventario-itcmd": {
    fields: [
      { name: "bens", label: "Valor total dos bens (espólio)", type: "number", default: 200000, suffix: "R$", min: 0, step: 1000 },
      { name: "aliquota", label: "Alíquota do ITCMD do seu estado", type: "number", default: 4, suffix: "%", min: 0, max: 8, step: 0.5, help: "Varia por estado, geralmente entre 2% e 8%." }
    ],
    compute: (v) => {
      const bens = num(v.bens);
      const aliq = num(v.aliquota);
      const itcmd = (bens * aliq) / 100;
      return [
        { label: `ITCMD estimado (${aliq}% sobre os bens)`, value: brl(itcmd), emphasis: true, hint: "Imposto estadual de transmissão por herança." }
      ];
    },
    note: "A alíquota do ITCMD é definida por cada estado (em geral de 2% a 8%, às vezes progressiva). Custas do inventário, emolumentos de cartório e honorários advocatícios são à parte. Ajuste a alíquota conforme o seu estado."
  }
};

export function CalculadoraWidget({ slug }: { slug: string }) {
  const def = CALCS[slug];
  const [values, setValues] = useState<Record<string, number | string>>(() => {
    const init: Record<string, number | string> = {};
    if (def) for (const f of def.fields) init[f.name] = f.default;
    return init;
  });

  if (!def) return null;

  const results = def.compute(values);

  return (
    <section
      className="card mb-6 border-2 border-brand-accent/40"
      aria-label="Calculadora interativa"
    >
      <h2 className="font-display text-xl font-bold text-brand-ink mb-1 inline-flex items-center gap-2">
        <Calculator className="w-5 h-5 text-brand-deep" aria-hidden />
        Calcule o seu caso
      </h2>
      <p className="text-sm text-brand-ink/65 mb-4">
        Preencha com os seus números — o resultado atualiza na hora. Nada é
        enviado: o cálculo acontece no seu navegador.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {def.fields.map((f) => (
          <div key={f.name}>
            <label
              htmlFor={`calc-${f.name}`}
              className="block text-sm font-medium text-brand-ink mb-1"
            >
              {f.label}
            </label>
            <div className="relative">
              {f.suffix && f.type === "number" && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-brand-ink/50 pointer-events-none">
                  {f.suffix}
                </span>
              )}
              {f.type === "select" ? (
                <select
                  id={`calc-${f.name}`}
                  value={String(values[f.name])}
                  onChange={(e) =>
                    setValues((s) => ({ ...s, [f.name]: e.target.value }))
                  }
                  className="w-full rounded-lg border-2 border-brand-line bg-white px-3 py-2 text-base text-brand-ink focus:border-brand-accent focus:outline-none"
                >
                  {f.options!.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={`calc-${f.name}`}
                  type="number"
                  inputMode="decimal"
                  value={String(values[f.name])}
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  onChange={(e) =>
                    setValues((s) => ({
                      ...s,
                      [f.name]: e.target.value === "" ? "" : Number(e.target.value)
                    }))
                  }
                  className={`w-full rounded-lg border-2 border-brand-line bg-white py-2 text-base text-brand-ink focus:border-brand-accent focus:outline-none ${f.suffix ? "pl-10 pr-3" : "px-3"}`}
                />
              )}
            </div>
            {f.help && (
              <p className="text-xs text-brand-ink/50 mt-1 leading-snug">{f.help}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-xl bg-brand-deep/5 border border-brand-deep/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-ink/55 mb-2">
          Resultado
        </p>
        <ul className="space-y-2">
          {results.map((r, i) => (
            <li
              key={i}
              className={`flex items-baseline justify-between gap-3 ${r.emphasis ? "pt-2 border-t border-brand-deep/20" : ""}`}
            >
              <span
                className={`text-sm ${r.emphasis ? "font-bold text-brand-ink" : "text-brand-ink/80"}`}
              >
                {r.label}
                {r.hint && (
                  <span className="block text-xs text-brand-ink/50 font-normal leading-snug mt-0.5">
                    {r.hint}
                  </span>
                )}
              </span>
              <span
                className={`whitespace-nowrap ${r.emphasis ? "font-display text-xl font-extrabold text-brand-deep" : "text-sm font-semibold text-brand-ink"}`}
              >
                {r.value}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <aside
        role="note"
        className="mt-4 rounded-xl border-l-4 border-amber-400 bg-amber-50 p-3 text-xs text-amber-900 leading-relaxed flex items-start gap-2"
      >
        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden />
        <span>{def.note}</span>
      </aside>
    </section>
  );
}
