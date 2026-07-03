/**
 * Camada central de IA (OpenAI) do AdvAqui.
 *
 * TODA chamada nova à OpenAI deve passar por `callAI()`. A camada resolve, num
 * lugar só, o que antes ficava repetido em cada rota:
 *
 *   - timeout com AbortController (default 60s);
 *   - retry com backoff em falha transitória (timeout/429/5xx/rede);
 *   - parâmetros por família de modelo (gpt-5.x usa max_completion_tokens e
 *     ignora temperature; gpt-4o usa max_tokens + temperature);
 *   - cálculo de custo em USD por tabela de preço;
 *   - observabilidade: grava cada chamada em `agent_logs` (feature, tokens,
 *     custo, duração, status) — é o que alimenta o painel /painel/agentes.
 *
 * A chave (OPENAI_API_KEY) vive só no .env.local do VPS; nunca vai ao cliente.
 * Nunca lança para o chamador: devolve { ok:false, erro } em qualquer falha.
 * O log nunca derruba a chamada: erro de log vira console.warn e segue.
 */

import { createAdminClient } from "@/lib/supabase/admin";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

export const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

/** USD por 1 milhão de tokens (entrada / saída). Modelos fora da tabela usam
 *  o preço do gpt-4o-mini como aproximação conservadora. */
const PRICES_PER_MTOK: Record<string, { input: number; output: number }> = {
  "gpt-4o-mini": { input: 0.15, output: 0.6 },
  "gpt-5.4-mini": { input: 0.3, output: 1.2 }
};

export function estimateCostUsd(
  model: string,
  promptTokens: number,
  completionTokens: number
): number {
  const base =
    PRICES_PER_MTOK[model] ||
    PRICES_PER_MTOK[Object.keys(PRICES_PER_MTOK).find((k) => model.startsWith(k)) || ""] ||
    PRICES_PER_MTOK["gpt-4o-mini"];
  const usd =
    (promptTokens / 1_000_000) * base.input +
    (completionTokens / 1_000_000) * base.output;
  // 6 casas — mesmo shape da coluna numeric de agent_logs.cost_usd
  return Math.round(usd * 1_000_000) / 1_000_000;
}

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type CallAIOptions = {
  /** Nome da funcionalidade — vira agent_logs.agent_name (ex.: "chat_triage"). */
  feature: string;
  /** agent_logs.action (default "openai_call"). */
  action?: string;
  messages: ChatMessage[];
  /** Default: OPENAI_MODEL do .env ou gpt-4o-mini. */
  model?: string;
  maxTokens?: number;
  temperature?: number;
  /** true → response_format json_object. */
  json?: boolean;
  /** Default 60s. */
  timeoutMs?: number;
  /** Retries em falha transitória (default 2, backoff 1s/2s). */
  retries?: number;
  /** false desliga a gravação em agent_logs (default true). */
  log?: boolean;
  /** Campos extras para agent_logs.details. Não incluir dados sensíveis. */
  details?: Record<string, unknown>;
};

export type CallAIResult =
  | {
      ok: true;
      text: string;
      model: string;
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
      costUsd: number;
      durationMs: number;
    }
  | { ok: false; erro: string; status?: number; durationMs: number };

/** Falhas em que vale a pena repetir a chamada. */
function transient(erro: string): boolean {
  return /timeout|_429|_5\d\d|network|fetch failed|ECONN|EAI_AGAIN|aborted/i.test(erro);
}

/** gpt-5.x rejeita temperature e usa max_completion_tokens. */
function buildBody(
  model: string,
  messages: ChatMessage[],
  maxTokens: number | undefined,
  temperature: number | undefined,
  json: boolean | undefined
): Record<string, unknown> {
  const body: Record<string, unknown> = { model, messages };
  if (model.startsWith("gpt-5")) {
    if (maxTokens) body.max_completion_tokens = maxTokens;
  } else {
    if (maxTokens) body.max_tokens = maxTokens;
    if (typeof temperature === "number") body.temperature = temperature;
  }
  if (json) body.response_format = { type: "json_object" };
  return body;
}

async function callOnce(
  opts: CallAIOptions,
  model: string
): Promise<CallAIResult> {
  const started = Date.now();
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return { ok: false, erro: "sem_chave", durationMs: 0 };
  }
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), opts.timeoutMs ?? 60_000);
    const res = await fetch(OPENAI_URL, {
      method: "POST",
      signal: ctrl.signal,
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(
        buildBody(model, opts.messages, opts.maxTokens, opts.temperature, opts.json)
      )
    });
    clearTimeout(timer);

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      return {
        ok: false,
        erro: `openai_${res.status}:${txt.slice(0, 200)}`,
        status: res.status,
        durationMs: Date.now() - started
      };
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
      model?: string;
    };
    const text = data.choices?.[0]?.message?.content?.trim() || "";
    if (!text) {
      return { ok: false, erro: "vazio", durationMs: Date.now() - started };
    }
    const promptTokens = data.usage?.prompt_tokens || 0;
    const completionTokens = data.usage?.completion_tokens || 0;
    return {
      ok: true,
      text,
      model: data.model || model,
      promptTokens,
      completionTokens,
      totalTokens: data.usage?.total_tokens || promptTokens + completionTokens,
      costUsd: estimateCostUsd(model, promptTokens, completionTokens),
      durationMs: Date.now() - started
    };
  } catch (e) {
    const erro =
      e instanceof Error
        ? e.name === "AbortError"
          ? "timeout"
          : e.message
        : "erro";
    return { ok: false, erro, durationMs: Date.now() - started };
  }
}

/**
 * Chamada central à OpenAI. Nunca lança; loga em agent_logs (a menos que
 * log:false). Retry automático em falha transitória.
 */
export async function callAI(opts: CallAIOptions): Promise<CallAIResult> {
  const model = opts.model || DEFAULT_MODEL;
  const retries = opts.retries ?? 2;
  const DELAYS = [1000, 2000, 4000];

  let result = await callOnce(opts, model);
  for (let attempt = 0; attempt < retries; attempt++) {
    if (result.ok || result.erro === "sem_chave" || !transient(result.erro)) break;
    await new Promise((r) => setTimeout(r, DELAYS[Math.min(attempt, DELAYS.length - 1)]));
    result = await callOnce(opts, model);
  }

  if (opts.log !== false) {
    await logAgentRun(opts.feature, opts.action || "openai_call", {
      status: result.ok ? "success" : "error",
      tokensUsed: result.ok ? result.totalTokens : 0,
      costUsd: result.ok ? result.costUsd : 0,
      durationMs: result.durationMs,
      details: {
        model,
        ...(result.ok ? {} : { error: result.erro.slice(0, 300) }),
        ...(opts.details || {})
      }
    });
  }

  return result;
}

/**
 * Grava uma linha em agent_logs. Nunca lança — falha de log não pode derrubar
 * a funcionalidade que está sendo logada.
 */
export async function logAgentRun(
  agentName: string,
  action: string,
  data: {
    status: "success" | "error" | "skipped" | "blocked";
    itemsProcessed?: number;
    tokensUsed?: number;
    costUsd?: number;
    durationMs?: number;
    details?: Record<string, unknown>;
  }
): Promise<void> {
  try {
    const admin = createAdminClient({ noStore: true });
    await admin.from("agent_logs").insert({
      agent_name: agentName,
      action,
      status: data.status,
      items_processed: data.itemsProcessed ?? 0,
      tokens_used: data.tokensUsed ?? 0,
      cost_usd: data.costUsd ?? 0,
      duration_ms: data.durationMs ?? 0,
      details: data.details ?? {}
    });
  } catch (err) {
    console.warn(`[ai/core] agent_logs insert falhou (${agentName}/${action})`, err);
  }
}

/**
 * Atualiza o placar do agente em agent_configs (last_run, total_runs,
 * total_tokens, total_cost). Cria a linha se não existir. Nunca lança.
 */
export async function touchAgentConfig(
  agentName: string,
  displayName: string,
  delta: { tokensUsed?: number; costUsd?: number }
): Promise<void> {
  try {
    const admin = createAdminClient({ noStore: true });
    const { data: existing } = await admin
      .from("agent_configs")
      .select("id,total_runs,total_tokens,total_cost")
      .eq("agent_name", agentName)
      .maybeSingle();

    if (existing?.id) {
      await admin
        .from("agent_configs")
        .update({
          last_run: new Date().toISOString(),
          total_runs: (existing.total_runs || 0) + 1,
          total_tokens: (existing.total_tokens || 0) + (delta.tokensUsed ?? 0),
          total_cost:
            Math.round(
              ((Number(existing.total_cost) || 0) + (delta.costUsd ?? 0)) * 1_000_000
            ) / 1_000_000,
          updated_at: new Date().toISOString()
        })
        .eq("id", existing.id);
    } else {
      await admin.from("agent_configs").insert({
        agent_name: agentName,
        display_name: displayName,
        enabled: true,
        last_run: new Date().toISOString(),
        total_runs: 1,
        total_tokens: delta.tokensUsed ?? 0,
        total_cost: delta.costUsd ?? 0
      });
    }
  } catch (err) {
    console.warn(`[ai/core] agent_configs update falhou (${agentName})`, err);
  }
}
