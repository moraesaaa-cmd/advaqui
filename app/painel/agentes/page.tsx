import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Agentes — Painel AdvAqui"
};

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type AgentConfig = {
  id: string;
  agent_name: string;
  display_name: string;
  description: string | null;
  enabled: boolean;
  schedule: string | null;
  last_run: string | null;
  total_runs: number;
  total_tokens: number;
  total_cost: number;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

type AgentLog = {
  id: string;
  created_at: string;
  agent_name: string;
  action: string;
  status: string;
  details: Record<string, unknown>;
  items_processed: number;
  tokens_used: number;
  cost_usd: number;
  duration_ms: number;
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const LOG_STATUS_COLORS: Record<string, string> = {
  success: "bg-emerald-100 text-emerald-800 border-emerald-200",
  error: "bg-red-100 text-red-800 border-red-200",
  skipped: "bg-amber-100 text-amber-800 border-amber-200",
  blocked: "bg-red-100 text-red-700 border-red-200"
};

const LOG_STATUS_DOT: Record<string, string> = {
  success: "bg-emerald-500",
  error: "bg-red-500",
  skipped: "bg-amber-500",
  blocked: "bg-red-400"
};

function formatDate(iso: string | null): string {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatCost(cost: number): string {
  if (cost === 0) return "$0.00";
  if (cost < 0.01) return `$${cost.toFixed(4)}`;
  return `$${cost.toFixed(2)}`;
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.round(ms / 60000)}min`;
}

function timeAgo(iso: string | null): string {
  if (!iso) return "nunca executou";
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `${minutes}min atras`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h atras`;
  const days = Math.floor(hours / 24);
  return `${days}d atras`;
}

/* ------------------------------------------------------------------ */
/* Page (Server Component)                                             */
/* ------------------------------------------------------------------ */

export default async function AgentesPage() {
  const admin = createAdminClient();

  /* --- Fetch agents ------------------------------------------------ */
  const { data: rawConfigs, error: configError } = await admin
    .from("agent_configs")
    .select("*")
    .order("display_name", { ascending: true });

  const agents: AgentConfig[] = (rawConfigs as AgentConfig[] | null) ?? [];

  /* --- Fetch recent logs ------------------------------------------- */
  const { data: rawLogs, error: logError } = await admin
    .from("agent_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  const logs: AgentLog[] = (rawLogs as AgentLog[] | null) ?? [];

  /* --- Aggregate stats --------------------------------------------- */
  const totalRuns = agents.reduce((sum, a) => sum + a.total_runs, 0);
  const totalCost = agents.reduce((sum, a) => sum + Number(a.total_cost), 0);
  const activeAgents = agents.filter((a) => a.enabled).length;
  const errorsToday = logs.filter(
    (l) =>
      l.status === "error" &&
      new Date(l.created_at).toDateString() === new Date().toDateString()
  ).length;

  const fetchError = configError || logError;

  if (fetchError) {
    return (
      <div className="container-tight py-10">
        <div className="card text-center">
          <p className="text-red-600 font-semibold">
            Erro ao carregar agentes: {fetchError.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-tight py-10">
      {/* --------------------------------------------------------------- */}
      {/* HEADER                                                          */}
      {/* --------------------------------------------------------------- */}
      <section
        className="rounded-3xl text-white p-6 md:p-8 mb-6 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg,#0F1B2D 0%,#16263F 60%,#1B2D49 100%)"
        }}
      >
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            top: -120,
            right: -40,
            width: 360,
            height: 300,
            background:
              "radial-gradient(ellipse at center, rgba(200,162,74,0.18), transparent 70%)"
          }}
        />
        <div className="relative">
          <p
            className="text-xs font-bold uppercase tracking-wider mb-1.5"
            style={{ color: "#E3C078" }}
          >
            Painel admin
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
            Agentes IA
          </h1>
          <p className="text-sm mt-1.5" style={{ color: "#A9B4C6" }}>
            Status e logs dos agentes automatizados do AdvAqui.
          </p>

          {/* Stats */}
          <div className="relative mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: "Agentes ativos",
                value: `${activeAgents}/${agents.length}`,
                sub: "habilitados"
              },
              {
                label: "Execucoes totais",
                value: String(totalRuns),
                sub: "acumulado"
              },
              {
                label: "Custo total",
                value: formatCost(totalCost),
                sub: "USD acumulado"
              },
              {
                label: "Erros hoje",
                value: String(errorsToday),
                sub: errorsToday === 0 ? "tudo certo" : "verificar logs"
              }
            ].map((m) => (
              <div
                key={m.label}
                className="rounded-2xl bg-white/[0.07] border border-white/10 p-4"
              >
                <p
                  className="text-[11px] uppercase tracking-wide"
                  style={{ color: "#7E8BA1" }}
                >
                  {m.label}
                </p>
                <p className="font-display text-2xl font-semibold mt-1">
                  {m.value}
                </p>
                {m.sub && (
                  <p
                    className="text-[11px] mt-0.5"
                    style={{ color: "#9FB0CB" }}
                  >
                    {m.sub}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- */}
      {/* AGENT CARDS                                                     */}
      {/* --------------------------------------------------------------- */}
      {agents.length === 0 ? (
        <section className="card text-center py-12 mb-6">
          <h2 className="font-display text-lg font-bold text-brand-ink mb-2">
            Nenhum agente configurado
          </h2>
          <p className="text-sm text-brand-ink/60">
            Os agentes aparecerao aqui quando forem cadastrados na tabela
            agent_configs.
          </p>
        </section>
      ) : (
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </section>
      )}

      {/* --------------------------------------------------------------- */}
      {/* RECENT LOGS                                                     */}
      {/* --------------------------------------------------------------- */}
      <section className="rounded-2xl border border-brand-line bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-brand-line/60 bg-gradient-to-r from-brand-bg to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-deep/10 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-brand-deep"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-brand-ink">
                Logs recentes
              </h2>
              <p className="text-xs text-brand-ink/60">
                Ultimas 20 execucoes dos agentes
              </p>
            </div>
          </div>
        </div>

        {logs.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-sm text-brand-ink/50">
              Nenhum log de execucao registrado.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-line bg-brand-bg/30">
                  <th className="text-left px-4 py-3 font-semibold text-brand-ink/70 whitespace-nowrap">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-brand-ink/70 whitespace-nowrap">
                    Agente
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-brand-ink/70 whitespace-nowrap">
                    Acao
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-brand-ink/70 whitespace-nowrap">
                    Itens
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-brand-ink/70 whitespace-nowrap">
                    Tokens
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-brand-ink/70 whitespace-nowrap">
                    Custo
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-brand-ink/70 whitespace-nowrap">
                    Duracao
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-brand-ink/70 whitespace-nowrap">
                    Quando
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-brand-line/30 hover:bg-brand-bg/30 transition"
                  >
                    <td className="px-4 py-2.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border ${
                          LOG_STATUS_COLORS[log.status] ||
                          "bg-gray-100 text-gray-600 border-gray-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            LOG_STATUS_DOT[log.status] || "bg-gray-400"
                          }`}
                          aria-hidden
                        />
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-medium text-brand-ink whitespace-nowrap">
                      {log.agent_name}
                    </td>
                    <td className="px-4 py-2.5 text-brand-ink/70 whitespace-nowrap">
                      {log.action}
                    </td>
                    <td className="px-4 py-2.5 text-right text-brand-ink/70 tabular-nums">
                      {log.items_processed}
                    </td>
                    <td className="px-4 py-2.5 text-right text-brand-ink/70 tabular-nums">
                      {log.tokens_used.toLocaleString("pt-BR")}
                    </td>
                    <td className="px-4 py-2.5 text-right text-brand-ink/70 tabular-nums">
                      {formatCost(Number(log.cost_usd))}
                    </td>
                    <td className="px-4 py-2.5 text-right text-brand-ink/70 tabular-nums">
                      {formatDuration(log.duration_ms)}
                    </td>
                    <td className="px-4 py-2.5 text-brand-ink/60 whitespace-nowrap text-xs">
                      {formatDate(log.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* AgentCard                                                           */
/* ------------------------------------------------------------------ */

function AgentCard({ agent }: { agent: AgentConfig }) {
  return (
    <div className="rounded-2xl border border-brand-line bg-white p-5 shadow-card hover:shadow-cardHover transition">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-base font-bold text-brand-ink truncate">
            {agent.display_name}
          </h3>
          {agent.description && (
            <p className="text-xs text-brand-ink/60 mt-0.5 line-clamp-2">
              {agent.description}
            </p>
          )}
        </div>

        {/* Enabled/disabled toggle (visual only) */}
        <div
          className={`flex-shrink-0 w-10 h-6 rounded-full relative transition ${
            agent.enabled ? "bg-emerald-500" : "bg-gray-300"
          }`}
          title={agent.enabled ? "Habilitado" : "Desabilitado"}
          aria-label={agent.enabled ? "Habilitado" : "Desabilitado"}
        >
          <div
            className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
              agent.enabled ? "left-[18px]" : "left-0.5"
            }`}
          />
        </div>
      </div>

      {/* Schedule */}
      {agent.schedule && (
        <div className="flex items-center gap-1.5 mb-3">
          <svg
            className="w-3.5 h-3.5 text-brand-ink/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <span className="text-xs text-brand-ink/50 font-mono">
            {agent.schedule}
          </span>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-2 rounded-xl bg-brand-bg/60 border border-brand-line/50 p-3">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-wide text-brand-ink/50">
            Execucoes
          </p>
          <p className="font-display text-lg font-semibold text-brand-ink tabular-nums">
            {agent.total_runs}
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-wide text-brand-ink/50">
            Tokens
          </p>
          <p className="font-display text-lg font-semibold text-brand-ink tabular-nums">
            {agent.total_tokens >= 1000
              ? `${(agent.total_tokens / 1000).toFixed(0)}k`
              : agent.total_tokens}
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-wide text-brand-ink/50">
            Custo
          </p>
          <p className="font-display text-lg font-semibold text-brand-ink tabular-nums">
            {formatCost(Number(agent.total_cost))}
          </p>
        </div>
      </div>

      {/* Last run */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-brand-ink/50">Ultima execucao</span>
        <span className="text-xs text-brand-ink/70 font-medium">
          {timeAgo(agent.last_run)}
        </span>
      </div>
    </div>
  );
}
