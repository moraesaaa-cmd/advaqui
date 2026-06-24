/**
 * Resolução do tribunal a partir do número único CNJ + acesso à API Pública
 * do DataJud do CNJ.
 *
 * Número CNJ: NNNNNNN-DD.AAAA.J.TR.OOOO (20 dígitos)
 *   posições (0-based, só dígitos):
 *   0-6   sequencial
 *   7-8   dígito verificador
 *   9-12  ano de ajuizamento
 *   13    J  — segmento do Judiciário
 *   14-15 TR — tribunal/região
 *   16-19 origem (vara/comarca)
 *
 * A API Pública do DataJud expõe APENAS metadados públicos do processo
 * (classe, assuntos, órgão julgador, movimentações). NÃO retorna nomes das
 * partes nem conteúdo de peças — dado sigiloso não é exposto.
 *
 * Chave pública documentada pelo CNJ (a mesma para todos os consumidores):
 * https://datajud-wiki.cnj.jus.br/api-publica/acesso
 */

export const DATAJUD_PUBLIC_KEY =
  "cDZHYzlZa0JadVREZDJCendQbXY6SkJlTzNjLV9TRENyQk1RdnFKZGRQdw==";

export const DATAJUD_BASE = "https://api-publica.datajud.cnj.jus.br";

// Segmento 8 (Justiça Estadual): TR -> UF (ordem oficial CNJ).
const ESTADUAL_UF: Record<string, string> = {
  "01": "ac", "02": "al", "03": "ap", "04": "am", "05": "ba", "06": "ce",
  "07": "df", "08": "es", "09": "go", "10": "ma", "11": "mt", "12": "ms",
  "13": "mg", "14": "pa", "15": "pb", "16": "pr", "17": "pe", "18": "pi",
  "19": "rj", "20": "rn", "21": "rs", "22": "ro", "23": "rr", "24": "sc",
  "25": "se", "26": "sp", "27": "to"
};

export type ResolucaoCNJ = {
  valido: boolean;
  digitos: string;
  /** alias do índice DataJud, ex.: api_publica_tjmg. Null se não suportado. */
  alias: string | null;
  /** Rótulo amigável do tribunal, ex.: "TJMG". */
  tribunal: string | null;
  /** Mensagem quando não suportado/ inválido. */
  motivo?: string;
};

export function resolverCNJ(entrada: string): ResolucaoCNJ {
  const digitos = (entrada || "").replace(/\D/g, "");
  if (digitos.length !== 20) {
    return {
      valido: false,
      digitos,
      alias: null,
      tribunal: null,
      motivo:
        "O número do processo (padrão CNJ) tem 20 dígitos — confira e tente de novo."
    };
  }
  const j = digitos[13];
  const tr = digitos.slice(14, 16);

  // Justiça Estadual
  if (j === "8") {
    const uf = ESTADUAL_UF[tr];
    if (uf) {
      return { valido: true, digitos, alias: `api_publica_tj${uf}`, tribunal: `TJ${uf.toUpperCase()}` };
    }
  }
  // Justiça do Trabalho (TRTs 1..24)
  if (j === "5") {
    const reg = parseInt(tr, 10);
    if (reg >= 1 && reg <= 24) {
      return { valido: true, digitos, alias: `api_publica_trt${reg}`, tribunal: `TRT-${reg}ª Região` };
    }
  }
  // Justiça Federal (TRFs 1..6)
  if (j === "4") {
    const reg = parseInt(tr, 10);
    if (reg >= 1 && reg <= 6) {
      return { valido: true, digitos, alias: `api_publica_trf${reg}`, tribunal: `TRF-${reg}ª Região` };
    }
  }
  // Tribunais superiores
  if (j === "3") {
    return { valido: true, digitos, alias: "api_publica_stj", tribunal: "STJ" };
  }
  if (j === "7") {
    return { valido: true, digitos, alias: "api_publica_stm", tribunal: "STM" };
  }

  return {
    valido: false,
    digitos,
    alias: null,
    tribunal: null,
    motivo:
      "A consulta automática cobre Justiça Estadual (TJ), do Trabalho (TRT), Federal (TRF), STJ e STM. Para Justiça Eleitoral, Militar Estadual ou STF, consulte direto no site do tribunal."
  };
}

export type Movimento = { data: string | null; nome: string; codigo?: number };

export type ProcessoDataJud = {
  numero: string;
  tribunal: string;
  classe: string | null;
  assuntos: string[];
  orgaoJulgador: string | null;
  grau: string | null;
  dataAjuizamento: string | null;
  ultimaAtualizacao: string | null;
  movimentos: Movimento[];
};

type RawHit = {
  _source?: {
    numeroProcesso?: string;
    classe?: { nome?: string };
    assuntos?: Array<{ nome?: string }>;
    orgaoJulgador?: { nome?: string };
    grau?: string;
    dataAjuizamento?: string;
    dataHoraUltimaAtualizacao?: string;
    movimentos?: Array<{ nome?: string; dataHora?: string; codigo?: number }>;
  };
};

/**
 * Consulta a API Pública do DataJud e normaliza o primeiro processo encontrado.
 * Nunca lança: em erro/timeout, retorna { ok:false, ... }.
 */
export async function consultarProcesso(
  entrada: string,
  apiKey: string
): Promise<
  | { ok: true; processo: ProcessoDataJud }
  | { ok: false; status: "invalido" | "nao_encontrado" | "erro"; mensagem: string }
> {
  const r = resolverCNJ(entrada);
  if (!r.valido || !r.alias) {
    return { ok: false, status: "invalido", mensagem: r.motivo || "Número inválido." };
  }

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 12000);
    const res = await fetch(`${DATAJUD_BASE}/${r.alias}/_search`, {
      method: "POST",
      signal: ctrl.signal,
      headers: {
        Authorization: `APIKey ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        size: 1,
        query: { match: { numeroProcesso: r.digitos } }
      })
    });
    clearTimeout(timer);

    if (!res.ok) {
      return {
        ok: false,
        status: "erro",
        mensagem: `O DataJud respondeu com erro (${res.status}). Tente novamente em instantes.`
      };
    }
    const json = (await res.json()) as { hits?: { hits?: RawHit[] } };
    const hit = json?.hits?.hits?.[0];
    if (!hit || !hit._source) {
      return {
        ok: false,
        status: "nao_encontrado",
        mensagem:
          "Não encontramos esse processo na base pública do DataJud. Confira o número, ou ele pode tramitar em segredo de justiça ou ainda não ter sido publicado."
      };
    }
    const s = hit._source;
    const movimentos: Movimento[] = (s.movimentos || [])
      .map((m) => ({
        data: m.dataHora || null,
        nome: m.nome || "Movimentação",
        codigo: m.codigo
      }))
      .sort((a, b) => (b.data || "").localeCompare(a.data || ""));

    return {
      ok: true,
      processo: {
        numero: s.numeroProcesso || r.digitos,
        tribunal: r.tribunal || "",
        classe: s.classe?.nome || null,
        assuntos: (s.assuntos || []).map((a) => a.nome || "").filter(Boolean),
        orgaoJulgador: s.orgaoJulgador?.nome || null,
        grau: s.grau || null,
        dataAjuizamento: s.dataAjuizamento || null,
        ultimaAtualizacao: s.dataHoraUltimaAtualizacao || null,
        movimentos
      }
    };
  } catch {
    return {
      ok: false,
      status: "erro",
      mensagem:
        "Não foi possível consultar o DataJud agora (tempo esgotado ou indisponível). Tente novamente em instantes."
    };
  }
}
