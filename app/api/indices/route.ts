import { NextRequest, NextResponse } from "next/server";

/**
 * /api/indices — Correção monetária por índice oficial.
 *
 * Busca a série mensal de um índice de preços no SGS do Banco Central
 * (api.bcb.gov.br, pública e gratuita, sem chave) e calcula o fator de
 * correção acumulado entre duas competências, aplicando os índices do mês
 * SEGUINTE à data inicial até a data final, inclusive — a mesma convenção da
 * "Calculadora do Cidadão" do BCB (não corrige o próprio mês do valor).
 *
 * Determinístico, sem IA e sem gravar dados. A série é cacheada por 12h
 * (revalidate) porque os índices fechados não mudam.
 *
 * GET /api/indices?indice=ipca&de=2020-03&ate=2023-12&valor=1000
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Códigos das séries no SGS do Banco Central (variação % mensal).
const SERIES: Record<string, { codigo: number; nome: string; fonte: string }> = {
  ipca: { codigo: 433, nome: "IPCA", fonte: "IBGE" },
  inpc: { codigo: 188, nome: "INPC", fonte: "IBGE" },
  igpm: { codigo: 189, nome: "IGP-M", fonte: "FGV" }
};

type BcbPonto = { data: string; valor: string };

const pad = (n: number) => String(n).padStart(2, "0");

/** "yyyy-MM" -> { y, m } (m em 1..12). null se inválido. */
function parseComp(s: unknown): { y: number; m: number } | null {
  if (typeof s !== "string") return null;
  const mt = s.match(/^(\d{4})-(\d{2})$/);
  if (!mt) return null;
  const y = parseInt(mt[1], 10);
  const m = parseInt(mt[2], 10);
  if (m < 1 || m > 12 || y < 1980 || y > 2100) return null;
  return { y, m };
}

/** {y,m} -> índice comparável (y*12+m) para ordenar/comparar. */
const ord = (c: { y: number; m: number }) => c.y * 12 + c.m;

const MES_NOME = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez"
];

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  const chave = (sp.get("indice") || "").toLowerCase();
  const serie = SERIES[chave];
  if (!serie) {
    return NextResponse.json(
      { ok: false, erro: "indice_invalido", mensagem: "Índice deve ser ipca, inpc ou igpm." },
      { status: 400 }
    );
  }

  const de = parseComp(sp.get("de"));
  const ate = parseComp(sp.get("ate"));
  if (!de || !ate) {
    return NextResponse.json(
      { ok: false, erro: "data_invalida", mensagem: "Use o formato AAAA-MM nas datas." },
      { status: 400 }
    );
  }
  if (ord(de) > ord(ate)) {
    return NextResponse.json(
      { ok: false, erro: "periodo_invalido", mensagem: "A data inicial não pode ser depois da final." },
      { status: 400 }
    );
  }

  const valorRaw = sp.get("valor");
  const valor = valorRaw != null ? Number(valorRaw) : null;
  if (valor != null && (!Number.isFinite(valor) || valor < 0)) {
    return NextResponse.json(
      { ok: false, erro: "valor_invalido", mensagem: "Valor inválido." },
      { status: 400 }
    );
  }

  // Janela de cálculo: aplica os índices do mês INICIAL ao mês final, inclusive
  // — a mesma metodologia da Calculadora do Cidadão do Banco Central (o índice
  // do mês da data-base entra no produtório). dataInicial = 1º dia do mês "de";
  // dataFinal = último dia do mês "ate".
  const ultimoDiaAte = new Date(ate.y, ate.m, 0).getDate();
  const dataInicial = `01/${pad(de.m)}/${de.y}`;
  const dataFinal = `${pad(ultimoDiaAte)}/${pad(ate.m)}/${ate.y}`;

  const url =
    `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${serie.codigo}/dados` +
    `?formato=json&dataInicial=${dataInicial}&dataFinal=${dataFinal}`;

  let pontos: BcbPonto[];
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15000);
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { Accept: "application/json" },
      // Índices fechados não mudam; cacheia 12h para não martelar o BCB.
      next: { revalidate: 43200 }
    });
    clearTimeout(timer);
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, erro: `bcb_${res.status}`, mensagem: "Não foi possível consultar o Banco Central agora. Tente em instantes." },
        { status: 502 }
      );
    }
    pontos = (await res.json()) as BcbPonto[];
    if (!Array.isArray(pontos)) throw new Error("formato");
  } catch (e) {
    const abortado = e instanceof Error && e.name === "AbortError";
    return NextResponse.json(
      {
        ok: false,
        erro: abortado ? "timeout" : "bcb_indisponivel",
        mensagem: "O Banco Central demorou a responder. Tente novamente."
      },
      { status: 502 }
    );
  }

  // Acumula o fator e monta a memória mês a mês.
  let fator = 1;
  const meses: Array<{ competencia: string; variacao: number }> = [];
  for (const p of pontos) {
    const mt = p.data.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!mt) continue;
    const mm = parseInt(mt[2], 10);
    const yy = parseInt(mt[3], 10);
    const variacao = parseFloat(String(p.valor).replace(",", "."));
    if (!Number.isFinite(variacao)) continue;
    fator *= 1 + variacao / 100;
    meses.push({ competencia: `${MES_NOME[mm - 1]}/${yy}`, variacao });
  }

  // Avisa se a série ainda não cobre todo o período pedido (defasagem de publicação).
  let observacao: string | undefined;
  const ultimoPedido = ord(ate);
  if (meses.length > 0) {
    const ultMt = pontos[pontos.length - 1]?.data?.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (ultMt) {
      const ultOrd = parseInt(ultMt[3], 10) * 12 + parseInt(ultMt[2], 10);
      if (ultOrd < ultimoPedido) {
        observacao =
          `O ${serie.nome} ainda não foi divulgado até ${pad(ate.m)}/${ate.y}. ` +
          `O cálculo vai até a última competência disponível (${meses[meses.length - 1].competencia}).`;
      }
    }
  } else {
    observacao = `Sem índices divulgados para o período. Confira as datas.`;
  }

  const percentual = (fator - 1) * 100;
  const valorCorrigido = valor != null ? valor * fator : null;

  return NextResponse.json({
    ok: true,
    indice: serie.nome,
    fonte: serie.fonte,
    de: `${pad(de.m)}/${de.y}`,
    ate: `${pad(ate.m)}/${ate.y}`,
    aplicadoDe: meses[0]?.competencia ?? null,
    aplicadoAte: meses[meses.length - 1]?.competencia ?? null,
    fator,
    percentual,
    valorOriginal: valor,
    valorCorrigido,
    meses,
    observacao
  });
}
