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
  "Regras OBRIGATÓRIAS: (1) baseie-se no Código de Trânsito Brasileiro (Lei 9.503/97), na Súmula 312 do STJ (exige a dupla notificação — da autuação e da penalidade), nas Resoluções do CONTRAN e nos princípios constitucionais do processo administrativo (art. 5º, LIV e LV, CF); (2) NUNCA prometa ou garanta resultado/cancelamento — a decisão é do órgão de trânsito; (3) cite os artigos corretos; (4) NÃO invente números de processo, nomes de julgados específicos ou súmulas inexistentes — entendimentos jurisprudenciais podem ser citados de forma genérica ('é entendimento consolidado dos tribunais'); (5) onde faltar dado do usuário, use marcador entre colchetes (ex.: [DATA DA NOTIFICAÇÃO]) e NUNCA se recuse a redigir por falta de dados; (6) FORMATAÇÃO: escreva em português jurídico formal, em TEXTO CORRIDO, SEM Markdown — proibido usar asteriscos (**), cerquilhas (#), hífens de lista, sublinhados ou emojis; títulos de seção em LETRAS MAIÚSCULAS em linha própria; parágrafos separados por uma linha em branco; use somente caracteres do português padrão.";

async function chamarOpenAI(
  system: string,
  user: string,
  maxTokens: number,
  temperature = 0.4,
  timeoutMs = 60000
): Promise<{ ok: true; texto: string } | { ok: false; erro: string }> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return { ok: false, erro: "sem_chave" };
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    const res = await fetch(OPENAI_URL, {
      method: "POST",
      signal: ctrl.signal,
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        temperature,
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
    "Você é um(a) especialista experiente na redação de recursos administrativos de trânsito no Brasil, com domínio do CTB (Lei 9.503/97), das Resoluções do CONTRAN, das súmulas do STJ e dos princípios do Direito Administrativo. Sua tarefa é redigir, para o próprio interessado protocolar, uma peça de recurso administrativo COMPLETA, EXTENSA e TECNICAMENTE SÓLIDA — com NO MÍNIMO 12 PÁGINAS (cerca de 5.000 a 7.000 palavras). " +
    REGRAS +
    "\n\nESTRUTURA OBRIGATÓRIA (desenvolva CADA seção em vários parágrafos densos, sem resumir):\n" +
    "1. ENDEREÇAMENTO — à autoridade/órgão competente conforme a fase do recurso.\n" +
    "2. QUALIFICAÇÃO DO REQUERENTE — com os dados fornecidos; onde faltar, use marcadores [ ].\n" +
    "3. DA TEMPESTIVIDADE — demonstre o cabimento e a tempestividade, discorrendo sobre os prazos do CTB e o direito de recorrer.\n" +
    "4. DA SÍNTESE DOS FATOS — narre a autuação de forma circunstanciada.\n" +
    "5. DAS PRELIMINARES — desenvolva as preliminares cabíveis (nulidades e vícios formais do auto e da notificação).\n" +
    "6. DO MÉRITO — desenvolva CADA tese de forma APROFUNDADA (mínimo 3 a 4 parágrafos por tese): explique o conceito jurídico, cite o dispositivo legal, relacione ao caso concreto, traga o entendimento doutrinário e jurisprudencial (de forma genérica e honesta), e conclua. Discorra sobre o devido processo legal, a ampla defesa e o contraditório (art. 5º, LIV e LV, da CF), a presunção de legitimidade do ato administrativo e os seus LIMITES, e os princípios da legalidade, da motivação, da proporcionalidade e da razoabilidade.\n" +
    "7. DA FUNDAMENTAÇÃO JURÍDICA — aprofunde os fundamentos legais e principiológicos.\n" +
    "8. DOS PEDIDOS — requeira o cancelamento/arquivamento do auto, com pedidos subsidiários (ex.: conversão em advertência, quando cabível).\n" +
    "9. FECHO — termos em que pede deferimento, local, data e espaço para assinatura.\n\n" +
    "EXTENSÃO E ARGUMENTAÇÃO: a peça DEVE ser longa e densa. Quando FALTAREM dados ou elementos concretos do caso, NÃO se recuse a redigir e NÃO encurte: faça VOLTAS ARGUMENTATIVAS — argumente em tese, traga princípios gerais, doutrina, hipóteses e a importância da estrita observância do procedimento pela Administração, mantendo a peça robusta e persuasiva. Redija sempre a peça INTEIRA, do endereçamento ao fecho, ainda que sem todos os dados do usuário.";
  // max_tokens alto e timeout longo: peça extensa de 12+ páginas leva mais tempo.
  return chamarOpenAI(system, contexto(d) + "\n\nRedija agora a peça completa, com no mínimo 12 páginas, desenvolvendo em profundidade todas as seções e teses.", 14000, 0.6, 150000);
}
