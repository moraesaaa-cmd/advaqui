import { findInfracao, findFase, TESES_COMUNS } from "@/lib/data/multas";

/**
 * Motor de IA do recurso de multa — chama a API da OpenAI no SERVIDOR.
 *
 * A chave (OPENAI_API_KEY) fica só no .env.local do VPS; nunca vai ao cliente.
 * Dois modos:
 *   - "analise": devolve, em poucas linhas, as teses cabíveis e uma avaliação
 *     honesta (sem prometer resultado). Barato (poucos tokens).
 *   - "completo": gera a peça de recurso inteira, pronta para revisar/protocolar.
 *
 * Nunca lança para o chamador: em falta de chave/erro/timeout devolve
 * { ok:false, ... } e o caller decide o fallback (texto determinístico).
 */

export type DadosRecurso = {
  fase: string;
  infracao: string;
  nome?: string;
  cpf?: string;
  placa?: string;
  ait?: string;
  orgao?: string;
  data?: string;
  cidade?: string;
  relato?: string;
};

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

function contexto(d: DadosRecurso): string {
  const inf = findInfracao(d.infracao);
  const fase = findFase(d.fase);
  const teses = inf
    ? inf.teses
        .map((k) => TESES_COMUNS[k])
        .filter(Boolean)
        .map((t) => `- ${t.titulo} (${t.base})`)
        .join("\n")
    : "";
  const espec = inf?.teseEspecifica
    ? `- ${inf.teseEspecifica.titulo} (${inf.teseEspecifica.base})`
    : "";
  return [
    `Infração: ${inf ? inf.label + " (" + inf.artigo + ")" : d.infracao}`,
    `Fase do recurso: ${fase ? fase.label + " — endereçar " + fase.enderecamento : d.fase}`,
    d.nome ? `Requerente: ${d.nome}` : "",
    d.cpf ? `CPF: ${d.cpf}` : "",
    d.placa ? `Placa: ${d.placa}` : "",
    d.ait ? `Auto de infração (AIT): ${d.ait}` : "",
    d.orgao ? `Órgão autuador: ${d.orgao}` : "",
    d.data ? `Data da infração: ${d.data}` : "",
    d.cidade ? `Cidade/UF: ${d.cidade}` : "",
    d.relato ? `Relato do condutor: ${d.relato}` : "",
    teses ? `Teses tipicamente cabíveis nesta infração:\n${teses}${espec ? "\n" + espec : ""}` : ""
  ]
    .filter(Boolean)
    .join("\n");
}

const REGRAS =
  "Regras OBRIGATÓRIAS: (1) baseie-se SOMENTE no Código de Trânsito Brasileiro (Lei 9.503/97), na Súmula 312 do STJ (exige a dupla notificação — da autuação e da penalidade) e nas Resoluções do CONTRAN; (2) NUNCA prometa ou garanta resultado/cancelamento — a decisão é do órgão de trânsito; (3) só use uma tese se ela fizer sentido para a infração informada; (4) cite os artigos corretos; (5) escreva em português jurídico claro, sóbrio, sem inventar fatos ou números de processo; (6) onde faltar dado do usuário, use marcador entre colchetes (ex.: [DATA DA NOTIFICAÇÃO]).";

async function chamarOpenAI(
  system: string,
  user: string,
  maxTokens: number
): Promise<{ ok: true; texto: string } | { ok: false; erro: string }> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return { ok: false, erro: "sem_chave" };
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 45000);
    const res = await fetch(OPENAI_URL, {
      method: "POST",
      signal: ctrl.signal,
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.4,
        max_tokens: maxTokens,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user }
        ]
      })
    });
    clearTimeout(timer);
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      return { ok: false, erro: `openai_${res.status}:${txt.slice(0, 120)}` };
    }
    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const texto = json?.choices?.[0]?.message?.content?.trim() || "";
    if (!texto) return { ok: false, erro: "vazio" };
    return { ok: true, texto };
  } catch (e) {
    return { ok: false, erro: e instanceof Error ? e.message : "erro" };
  }
}

export async function analiseIA(d: DadosRecurso) {
  const system =
    "Você é um assistente que redige minutas de recurso administrativo de trânsito para o próprio interessado protocolar, com base na legislação. " +
    REGRAS +
    " Sua resposta de ANÁLISE deve ter no máximo 8 linhas: aponte as teses mais promissoras para o caso e uma avaliação honesta das chances (em termos como 'há fundamentos sólidos', sem percentual nem promessa). Nada de peça completa aqui.";
  return chamarOpenAI(system, contexto(d), 600);
}

export async function pecaCompletaIA(d: DadosRecurso) {
  const system =
    "Você é um assistente que redige minutas de recurso administrativo de trânsito para o próprio interessado protocolar, com base na legislação. " +
    REGRAS +
    " Gere a PEÇA COMPLETA de recurso administrativo, estruturada em: endereçamento; qualificação do requerente; DOS FATOS; DOS FUNDAMENTOS (com os artigos/súmulas); DOS PEDIDOS; fecho com local, data e assinatura. Texto pronto para revisão e protocolo.";
  return chamarOpenAI(system, contexto(d), 1800);
}
