/**
 * Motor de IA do revisor/humanizador de petições — chama a OpenAI no SERVIDOR.
 *
 * A chave (OPENAI_API_KEY) fica só no .env.local do VPS; nunca vai ao cliente.
 * Dois modos:
 *   - "revisar": corrige gramática, clareza, coesão e técnica jurídica, sem
 *     mudar o sentido nem os pedidos.
 *   - "humanizar": reescreve para soar natural e fluente (menos "robótico"),
 *     mantendo a tecnicidade e preservando fatos, nomes e valores.
 *
 * Nunca lança para o chamador: em falta de chave/erro/timeout devolve
 * { ok:false, erro }.
 */

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

export type ModoPeticao = "revisar" | "humanizar";

const REGRAS =
  "Regras OBRIGATÓRIAS: (1) NÃO invente fatos, jurisprudência, súmulas, números de processo, datas ou valores que não estejam no texto; (2) preserve integralmente nomes, qualificações, valores, datas e os PEDIDOS do original; (3) não altere a estratégia nem o sentido jurídico; (4) escreva em português jurídico correto, claro e sóbrio; (5) NUNCA prometa ou garanta resultado; (6) onde o original tiver lacuna, mantenha o marcador entre colchetes (ex.: [DATA]); (7) devolva SOMENTE o texto da peça revisada, sem comentários, sem cabeçalho de explicação e sem markdown.";

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

export async function revisarPeticaoIA(texto: string, modo: ModoPeticao) {
  const system =
    modo === "humanizar"
      ? "Você é advogado(a) revisor(a) experiente. Sua tarefa é HUMANIZAR a peça a seguir: reescreva para que soe natural, fluente e escrita por um(a) advogado(a) — eliminando repetições, conectivos artificiais e o tom mecânico de texto gerado por máquina — sem perder a tecnicidade. " +
        REGRAS
      : "Você é advogado(a) revisor(a) experiente. Sua tarefa é REVISAR a peça a seguir: corrija ortografia, gramática, pontuação, concordância, clareza, coesão e a técnica jurídica (uso correto dos termos), aprimorando a redação sem mudar o conteúdo. " +
        REGRAS;
  return chamarOpenAI(system, `Peça a trabalhar:\n\n${texto}`, 2200);
}
