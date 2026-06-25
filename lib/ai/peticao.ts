/**
 * Motor de IA do revisor/humanizador/aprofundador de petições — chama a OpenAI
 * no SERVIDOR.
 *
 * A chave (OPENAI_API_KEY) fica só no .env.local do VPS; nunca vai ao cliente.
 * Três modos:
 *   - "revisar": corrige gramática, clareza, coesão e técnica jurídica, sem
 *     mudar o sentido nem os pedidos.
 *   - "humanizar": reescreve para soar natural e fluente (menos "robótico"),
 *     mantendo a tecnicidade e preservando fatos, nomes e valores.
 *   - "aprofundar": expande a argumentação jurídica — princípios
 *     constitucionais, doutrina, jurisprudência temática e interpretação
 *     sistemática — sem alterar fatos nem inventar números de processo.
 *
 * Nunca lança para o chamador: em falta de chave/erro/timeout devolve
 * { ok:false, erro }.
 */

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

export type ModoPeticao = "revisar" | "humanizar" | "aprofundar";

const REGRAS =
  "Regras OBRIGATÓRIAS: (1) NÃO invente fatos, jurisprudência, súmulas, números de processo, datas ou valores que não estejam no texto; (2) preserve integralmente nomes, qualificações, valores, datas e os PEDIDOS do original; (3) não altere a estratégia nem o sentido jurídico; (4) escreva em português jurídico correto, claro e sóbrio; (5) NUNCA prometa ou garanta resultado; (6) onde o original tiver lacuna, mantenha o marcador entre colchetes (ex.: [DATA]); (7) devolva SOMENTE o texto da peça revisada, sem comentários, sem cabeçalho de explicação e sem markdown; (8) mantenha a formatação em texto corrido, sem markdown — proibido usar asteriscos, cerquilhas, hífens de lista ou emojis; títulos de seção em LETRAS MAIÚSCULAS em linha própria.";

async function chamarOpenAI(
  system: string,
  user: string,
  maxTokens: number
): Promise<{ ok: true; texto: string } | { ok: false; erro: string }> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return { ok: false, erro: "sem_chave" };
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 55000);
    const res = await fetch(OPENAI_URL, {
      method: "POST",
      signal: ctrl.signal,
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.5,
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
    return { ok: false, erro: e instanceof Error ? e.name === "AbortError" ? "timeout" : e.message : "erro" };
  }
}

/** Erros transitórios em que vale a pena repetir a chamada. */
function retryavel(erro: string): boolean {
  return /timeout|_429|_5\d\d|network|fetch|ECONN|EAI_AGAIN/i.test(erro);
}

export async function revisarPeticaoIA(texto: string, modo: ModoPeticao) {
  const PROMPTS: Record<ModoPeticao, string> = {
    revisar:
      "Você é advogado(a) revisor(a) experiente. Sua tarefa é REVISAR a peça a seguir: corrija ortografia, gramática, pontuação, concordância, clareza, coesão e a técnica jurídica (uso correto dos termos), aprimorando a redação sem mudar o conteúdo. " +
      "Verifique especialmente: vírgulas antes de orações subordinadas introduzidas por \"que\", \"quando\", \"se\", \"embora\", \"ainda que\" etc.; tempos verbais consistentes na narrativa dos fatos; formatação uniforme ao longo do texto; formato correto de citação legal (Lei nº X, de DD de mês de AAAA); uso de fórmulas respeitosas (\"data venia\", \"com a devida vênia\") ao divergir de decisão judicial ou posição de autoridade; estrutura dos parágrafos e fluxo lógico da argumentação. " +
      REGRAS,
    humanizar:
      "Você é advogado(a) revisor(a) experiente. Sua tarefa é HUMANIZAR a peça a seguir: reescreva para que soe natural, fluente e escrita por um(a) advogado(a) de verdade. " +
      "Elimine expressões de template (\"cumpre salientar que\", \"insta consignar\", \"ad argumentandum tantum\" e similares); varie a estrutura das frases para evitar monotonia; prefira voz ativa quando cabível; remova fórmulas jurídicas redundantes que nada acrescentam ao argumento; quebre parágrafos longos demais para melhorar a legibilidade; garanta que o texto flua com naturalidade do começo ao fim — sem perder a tecnicidade. " +
      REGRAS,
    aprofundar:
      "Você é advogado(a) parecerista experiente. Sua tarefa é APROFUNDAR a argumentação jurídica da peça a seguir. " +
      "Identifique a tese jurídica central e expanda-a com: (a) princípios constitucionais aplicáveis (dignidade da pessoa humana, legalidade, razoabilidade, proporcionalidade, devido processo legal etc., conforme pertinentes); (b) doutrina relevante (cite autores de forma genérica, ex.: \"conforme leciona a melhor doutrina administrativista\", \"como ensina a doutrina processualista majoritária\"); (c) jurisprudência temática paralela (mencione linhas jurisprudenciais sem inventar números de acórdão, ex.: \"é pacífico nos tribunais superiores que...\"); (d) interpretação sistemática da legislação citada, articulando os dispositivos entre si e com o ordenamento constitucional. " +
      "O resultado deve ser significativamente mais longo que o original, adensando os fundamentos sem alterar fatos nem inventar dados. " +
      REGRAS,
  };

  const MAX_TOKENS: Record<ModoPeticao, number> = {
    revisar: 3000,
    humanizar: 3000,
    aprofundar: 5000,
  };

  const system = PROMPTS[modo];
  const user = `Peça a trabalhar:\n\n${texto}`;
  const tokens = MAX_TOKENS[modo];

  // Até 2 retries em falha transitória (timeout/429/5xx) com backoff
  // exponencial: 1s, 2s. Pior caso ≈ 55s × 3 + 3s = ~168s, ainda cabe
  // sob o proxy_read_timeout do Nginx (180s).
  const DELAYS = [1000, 2000];
  let r = await chamarOpenAI(system, user, tokens);
  for (const delay of DELAYS) {
    if (r.ok || r.erro === "sem_chave" || !retryavel(r.erro)) break;
    await new Promise((res) => setTimeout(res, delay));
    r = await chamarOpenAI(system, user, tokens);
  }
  return r;
}
