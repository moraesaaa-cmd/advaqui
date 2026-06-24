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

const PERSONA_PECA =
  "Você é um(a) especialista experiente na redação de recursos administrativos de trânsito no Brasil, com domínio do CTB (Lei 9.503/97), das Resoluções do CONTRAN, das súmulas do STJ e dos princípios do Direito Administrativo. Redige, para o próprio interessado protocolar, peças EXTENSAS, densas e tecnicamente sólidas. ";

/**
 * Peça completa de 12+ páginas. gpt-4o-mini tende a "encerrar cedo" numa única
 * chamada (parava em ~5 páginas), então geramos em DOIS blocos paralelos e
 * concatenamos: (A) abertura + preliminares; (B) mérito aprofundado + pedidos.
 * Cada bloco é longo por si só; juntos passam de 12 páginas.
 */
export async function pecaCompletaIA(d: DadosRecurso) {
  const ctx = contexto(d);

  const sysA =
    PERSONA_PECA +
    REGRAS +
    "\n\nNESTA RESPOSTA, redija APENAS a ABERTURA da peça, cada seção com vários parágrafos longos e densos:\n" +
    "1. ENDEREÇAMENTO — à autoridade/órgão competente conforme a fase.\n" +
    "2. QUALIFICAÇÃO DO REQUERENTE — com os dados fornecidos; onde faltar, use marcadores [ ].\n" +
    "3. DA TEMPESTIVIDADE E DO CABIMENTO — discorra com profundidade sobre os prazos do CTB, o direito de recorrer e o duplo grau na esfera administrativa.\n" +
    "4. DA SÍNTESE DOS FATOS — narre a autuação de forma minuciosa e circunstanciada.\n" +
    "ENCERRE após os fatos. NÃO escreva preliminares, mérito, pedidos nem fecho — virão depois.";

  const sysB =
    PERSONA_PECA +
    REGRAS +
    "\n\nESTA É A CONTINUAÇÃO de um recurso já iniciado (endereçamento, qualificação e fatos já redigidos). NÃO repita essas seções. Comece DIRETAMENTE no título 'DAS PRELIMINARES' e desenvolva, com MUITA profundidade (vários parágrafos por tópico):\n" +
    "DAS PRELIMINARES — nulidades e vícios formais do auto de infração e das notificações: ausência ou irregularidade da dupla notificação (Súmula 312 do STJ; arts. 280, 281 e 282 do CTB), falta de requisitos do auto, cerceamento de defesa, vícios de motivação e de intimação. Explique cada conceito, cite o dispositivo, relacione ao caso e conclua. Faça VOLTAS ARGUMENTATIVAS quando faltarem dados. ENCERRE após as preliminares — o mérito vem depois.";

  const sysC =
    PERSONA_PECA +
    REGRAS +
    "\n\nESTA É A PARTE FINAL de um recurso já iniciado (abertura e preliminares já redigidas). NÃO repita as seções anteriores. Comece DIRETAMENTE no título 'DO MÉRITO' e redija com a MÁXIMA profundidade:\n" +
    "DO MÉRITO — desenvolva NO MÍNIMO 4 teses, cada uma com 4 ou mais parágrafos: conceito jurídico, dispositivo legal, relação com o caso, entendimento doutrinário e jurisprudencial (genérico e honesto) e conclusão. Discorra sobre o devido processo legal, a ampla defesa e o contraditório (art. 5º, LIV e LV, da CF), a presunção de legitimidade do ato administrativo e seus LIMITES, e os princípios da legalidade, da motivação, da proporcionalidade e da razoabilidade.\n" +
    "DA FUNDAMENTAÇÃO JURÍDICA — aprofunde os fundamentos legais e principiológicos.\n" +
    "DOS PEDIDOS — requeira o cancelamento/arquivamento do auto, com pedidos subsidiários.\n" +
    "FECHO — termos em que pede deferimento, local, data e espaço para assinatura.\n" +
    "Quando faltarem dados, faça VOLTAS ARGUMENTATIVAS, mantendo a peça longa e robusta.";

  const instrucao =
    "\n\nDesenvolva ao máximo, com parágrafos longos e linguagem jurídica formal. Não economize palavras.";

  // 3 blocos paralelos → peça com 12+ páginas. Concatena na ordem A, B, C.
  // Timeout por bloco = 85s: com os três em paralelo, o pior caso (~85s +
  // overhead de Supabase) fica com folga sob o proxy_read_timeout do Nginx
  // (180s). Antes eram 140s, perigosamente colados no corte do Nginx → 504.
  const [a, b, c] = await Promise.all([
    chamarOpenAI(sysA, ctx + instrucao, 6000, 0.6, 85000),
    chamarOpenAI(sysB, ctx + instrucao, 6000, 0.6, 85000),
    chamarOpenAI(sysC, ctx + instrucao, 8000, 0.6, 85000)
  ]);

  // Exigimos os TRÊS blocos. Uma peça sem a abertura (bloco A: endereçamento,
  // qualificação e fatos) ou sem o mérito (bloco C) é imprestável para
  // protocolar. Numa falha parcial retornamos !ok — a rota então ESTORNA o
  // recurso pago e cai no fallback determinístico, em vez de cobrar por uma
  // peça estruturalmente quebrada.
  if (a.ok && b.ok && c.ok) {
    return { ok: true as const, texto: [a.texto, b.texto, c.texto].join("\n\n") };
  }
  return ([a, b, c].find((p) => !p.ok) || a) as { ok: false; erro: string };
}
