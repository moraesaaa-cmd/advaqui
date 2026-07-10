import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ADMIN_CREDENTIALS } from "@/lib/config";
import {
  Users,
  TrendingUp,
  BookOpen,
  Bot,
  ArrowRight,
  Zap,
  FileText,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard — Painel AdvAqui",
};

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type AgentLog = {
  id: string;
  created_at: string;
  agent_name: string;
  action: string;
  status: string;
  items_processed: number;
  cost_usd: number;
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const FUNNEL_STAGES = [
  { key: "novo", label: "Novo", color: "#3B82F6" },
  { key: "em_analise", label: "Em analise", color: "#8B5CF6" },
  { key: "contato_realizado", label: "Contato realizado", color: "#A855F7" },
  { key: "proposta_enviada", label: "Proposta enviada", color: "#06B6D4" },
  { key: "contratado", label: "Contratado", color: "#10B981" },
] as const;

const LOG_STATUS_COLORS: Record<string, string> = {
  success: "bg-emerald-100 text-emerald-800",
  error: "bg-red-100 text-red-800",
  skipped: "bg-amber-100 text-amber-800",
  blocked: "bg-red-100 text-red-700",
};

const LOG_STATUS_DOT: Record<string, string> = {
  success: "bg-emerald-500",
  error: "bg-red-500",
  skipped: "bg-amber-500",
  blocked: "bg-red-400",
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `${minutes}min atras`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h atras`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d atras`;
  return `${Math.floor(days / 30)}m atras`;
}

function formatCost(cost: number): string {
  if (cost === 0) return "$0.00";
  if (cost < 0.01) return `$${cost.toFixed(4)}`;
  return `$${cost.toFixed(2)}`;
}

/* ------------------------------------------------------------------ */
/* Page (Server Component)                                             */
/* ------------------------------------------------------------------ */

export default async function DashboardOverviewPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email || user.email.toLowerCase() !== ADMIN_CREDENTIALS.email.toLowerCase()) {
    redirect("/painel/advogado");
  }

  const admin = createAdminClient();

  /* --- Leads stats ------------------------------------------------- */
  const { count: totalLeads } = await admin
    .from("leads")
    .select("*", { count: "exact", head: true });

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { count: weekLeads } = await admin
    .from("leads")
    .select("*", { count: "exact", head: true })
    .gte("created_at", weekAgo);

  const { count: convertedCount } = await admin
    .from("leads")
    .select("*", { count: "exact", head: true })
    .eq("status", "contratado");

  const total = totalLeads ?? 0;
  const converted = convertedCount ?? 0;
  const conversionRate = total > 0 ? ((converted / total) * 100).toFixed(1) : "0";

  /* --- Blog stats -------------------------------------------------- */
  const { count: publishedArticles } = await admin
    .from("blog_articles")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  /* --- Agent cost this month --------------------------------------- */
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const { data: monthLogs } = await admin
    .from("agent_logs")
    .select("cost_usd")
    .gte("created_at", monthStart.toISOString());

  const monthCost = (monthLogs ?? []).reduce(
    (sum, row) => sum + Number((row as { cost_usd: number }).cost_usd),
    0
  );

  /* --- Funnel data ------------------------------------------------- */
  const funnelPromises = FUNNEL_STAGES.map(async (stage) => {
    const { count } = await admin
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("status", stage.key);
    return { ...stage, count: count ?? 0 };
  });
  const funnelData = await Promise.all(funnelPromises);
  const funnelMax = Math.max(...funnelData.map((s) => s.count), 1);

  /* --- Recent agent activity --------------------------------------- */
  const { data: rawLogs } = await admin
    .from("agent_logs")
    .select("id,created_at,agent_name,action,status,items_processed,cost_usd")
    .order("created_at", { ascending: false })
    .limit(10);
  const recentLogs: AgentLog[] = (rawLogs as AgentLog[] | null) ?? [];

  /* --- Top sources ------------------------------------------------- */
  const { data: sourceRows } = await admin
    .from("leads")
    .select("ferramenta")
    .not("ferramenta", "is", null);
  const sourceCounts: Record<string, number> = {};
  for (const row of (sourceRows ?? []) as { ferramenta: string }[]) {
    const key = row.ferramenta || "Desconhecido";
    sourceCounts[key] = (sourceCounts[key] || 0) + 1;
  }
  const sortedSources = Object.entries(sourceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const sourceMax = sortedSources.length > 0 ? sortedSources[0][1] : 1;

  /* --- Render ------------------------------------------------------ */
  return (
    <div className="container-tight py-10">
      {/* ============================================================= */}
      {/* HERO HEADER                                                    */}
      {/* ============================================================= */}
      <section
        className="rounded-3xl text-white p-6 md:p-8 mb-6 relative overflow-hidden"
        style={{
          background:
            "#0F1B2D",
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
              "none",
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
            Visao geral
          </h1>
          <p className="text-sm mt-1.5" style={{ color: "#A9B4C6" }}>
            Metricas consolidadas do AdvAqui em tempo real.
          </p>

          {/* Stats cards */}
          <div className="relative mt-5 grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              {
                label: "Total de leads",
                value: String(total),
                sub: "acumulado",
                Icon: Users,
              },
              {
                label: "Leads esta semana",
                value: String(weekLeads ?? 0),
                sub: "ultimos 7 dias",
                Icon: TrendingUp,
              },
              {
                label: "Taxa de conversao",
                value: `${conversionRate}%`,
                sub: `${converted} contratado${converted !== 1 ? "s" : ""}`,
                Icon: Zap,
              },
              {
                label: "Artigos publicados",
                value: String(publishedArticles ?? 0),
                sub: "no blog",
                Icon: BookOpen,
              },
              {
                label: "Custo IA (mes)",
                value: formatCost(monthCost),
                sub: "USD agentes",
                Icon: Bot,
              },
            ].map((m) => (
              <div
                key={m.label}
                className="rounded-2xl bg-white/[0.07] border border-white/10 p-4"
              >
                <div className="flex items-center gap-2 mb-1">
                  <m.Icon
                    className="w-3.5 h-3.5"
                    style={{ color: "#7E8BA1" }}
                    aria-hidden
                  />
                  <p
                    className="text-[11px] uppercase tracking-wide"
                    style={{ color: "#7E8BA1" }}
                  >
                    {m.label}
                  </p>
                </div>
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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ============================================================= */}
        {/* LEFT COLUMN (2/3)                                              */}
        {/* ============================================================= */}
        <div className="lg:col-span-2 space-y-6">
          {/* ------------------------------------------------------------- */}
          {/* LEADS FUNNEL                                                   */}
          {/* ------------------------------------------------------------- */}
          <section className="rounded-2xl border border-brand-line bg-white overflow-hidden">
            <div className="px-6 py-4 border-b border-brand-line/60 bg-brand-bg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-deep/10 flex items-center justify-center">
                  <TrendingUp
                    className="w-5 h-5 text-brand-deep"
                    aria-hidden
                  />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-brand-ink">
                    Funil de leads
                  </h2>
                  <p className="text-xs text-brand-ink/60">
                    Distribuicao por estagio do pipeline
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {funnelData.every((s) => s.count === 0) ? (
                <div className="text-center py-8">
                  <Users
                    className="w-10 h-10 text-brand-ink/20 mx-auto mb-3"
                    aria-hidden
                  />
                  <p className="text-sm text-brand-ink/50">
                    Nenhum lead registrado ainda.
                  </p>
                  <p className="text-xs text-brand-ink/40 mt-1">
                    Quando visitantes usarem as ferramentas, os leads
                    aparecerão aqui.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {funnelData.map((stage, i) => {
                    const pct =
                      total > 0
                        ? ((stage.count / total) * 100).toFixed(1)
                        : "0";
                    const widthPct = Math.max(
                      (stage.count / funnelMax) * 100,
                      2
                    );
                    const prevCount = i > 0 ? funnelData[i - 1].count : null;
                    const dropOff =
                      prevCount !== null && prevCount > 0
                        ? (
                            ((prevCount - stage.count) / prevCount) *
                            100
                          ).toFixed(0)
                        : null;

                    return (
                      <div key={stage.key}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{ background: stage.color }}
                              aria-hidden
                            />
                            <span className="text-sm font-medium text-brand-ink">
                              {stage.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            {dropOff !== null && Number(dropOff) > 0 && (
                              <span className="text-[10px] text-red-500 font-medium">
                                -{dropOff}%
                              </span>
                            )}
                            <span className="text-sm font-bold text-brand-ink tabular-nums">
                              {stage.count}
                            </span>
                            <span className="text-[10px] text-brand-ink/40 tabular-nums w-12 text-right">
                              {pct}%
                            </span>
                          </div>
                        </div>
                        <div className="h-3 rounded-full bg-brand-bg overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${widthPct}%`,
                              background: stage.color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* ------------------------------------------------------------- */}
          {/* RECENT ACTIVITY FEED                                           */}
          {/* ------------------------------------------------------------- */}
          <section className="rounded-2xl border border-brand-line bg-white overflow-hidden">
            <div className="px-6 py-4 border-b border-brand-line/60 bg-brand-bg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-deep/10 flex items-center justify-center">
                    <Bot
                      className="w-5 h-5 text-brand-deep"
                      aria-hidden
                    />
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-bold text-brand-ink">
                      Atividade recente
                    </h2>
                    <p className="text-xs text-brand-ink/60">
                      Ultimas 10 acoes dos agentes IA
                    </p>
                  </div>
                </div>
                <Link
                  href="/painel/agentes"
                  className="text-xs font-medium text-brand-deep hover:text-brand-accent transition inline-flex items-center gap-1"
                >
                  Ver todos <ArrowRight className="w-3 h-3" aria-hidden />
                </Link>
              </div>
            </div>

            {recentLogs.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <Bot
                  className="w-10 h-10 text-brand-ink/20 mx-auto mb-3"
                  aria-hidden
                />
                <p className="text-sm text-brand-ink/50">
                  Nenhuma atividade de agente registrada.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-brand-line/40">
                {recentLogs.map((log) => (
                  <li
                    key={log.id}
                    className="px-6 py-3.5 hover:bg-brand-bg/30 transition flex items-center gap-4"
                  >
                    {/* Status dot */}
                    <div className="flex-shrink-0">
                      <span
                        className={`block w-2.5 h-2.5 rounded-full ${
                          LOG_STATUS_DOT[log.status] || "bg-gray-400"
                        }`}
                        aria-hidden
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-brand-ink">
                        <span className="font-semibold">
                          {log.agent_name}
                        </span>
                        <span className="text-brand-ink/50 mx-1.5">--</span>
                        <span className="text-brand-ink/70">{log.action}</span>
                      </p>
                      {log.items_processed > 0 && (
                        <p className="text-[11px] text-brand-ink/40 mt-0.5">
                          {log.items_processed} ite{log.items_processed === 1 ? "m" : "ns"} processado{log.items_processed === 1 ? "" : "s"}
                          {Number(log.cost_usd) > 0 &&
                            ` -- ${formatCost(Number(log.cost_usd))}`}
                        </p>
                      )}
                    </div>

                    {/* Badge + time */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          LOG_STATUS_COLORS[log.status] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {log.status}
                      </span>
                      <span className="text-[11px] text-brand-ink/40 tabular-nums whitespace-nowrap">
                        {timeAgo(log.created_at)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* ============================================================= */}
        {/* RIGHT COLUMN (1/3)                                             */}
        {/* ============================================================= */}
        <aside className="space-y-6">
          {/* ------------------------------------------------------------- */}
          {/* TOP SOURCES                                                    */}
          {/* ------------------------------------------------------------- */}
          <section className="rounded-2xl border border-brand-line bg-white overflow-hidden">
            <div className="px-5 py-4 border-b border-brand-line/60 bg-brand-bg">
              <h2 className="font-display text-base font-bold text-brand-ink">
                Origem dos leads
              </h2>
              <p className="text-[11px] text-brand-ink/50 mt-0.5">
                Por ferramenta utilizada
              </p>
            </div>

            {sortedSources.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-xs text-brand-ink/40">
                  Sem dados de origem ainda.
                </p>
              </div>
            ) : (
              <div className="p-5 space-y-2.5">
                {sortedSources.map(([source, count]) => {
                  const widthPct = Math.max((count / sourceMax) * 100, 4);
                  return (
                    <div key={source}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-brand-ink truncate mr-2">
                          {source}
                        </span>
                        <span className="text-xs font-bold text-brand-ink tabular-nums">
                          {count}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-brand-bg overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${widthPct}%`,
                            background:
                              "#C8A24A",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* ------------------------------------------------------------- */}
          {/* QUICK ACTIONS                                                  */}
          {/* ------------------------------------------------------------- */}
          <section className="rounded-2xl border border-brand-line bg-white overflow-hidden">
            <div className="px-5 py-4 border-b border-brand-line/60 bg-brand-bg">
              <h2 className="font-display text-base font-bold text-brand-ink">
                Acoes rapidas
              </h2>
            </div>
            <div className="p-3 space-y-1">
              {[
                {
                  href: "/painel/leads",
                  label: "Ver todos os leads",
                  sub: `${total} leads capturados`,
                  Icon: Users,
                  iconBg: "bg-blue-50",
                  iconColor: "text-blue-600",
                },
                {
                  href: "/painel/agentes",
                  label: "Gerenciar agentes",
                  sub: "Status e logs",
                  Icon: Bot,
                  iconBg: "bg-purple-50",
                  iconColor: "text-purple-600",
                },
                {
                  href: "/painel/blog",
                  label: "Ver artigos",
                  sub: `${publishedArticles ?? 0} publicados`,
                  Icon: BookOpen,
                  iconBg: "bg-emerald-50",
                  iconColor: "text-emerald-600",
                },
                {
                  href: "/api/cron/publish-articles",
                  label: "Publicar artigo agora",
                  sub: "Acionar publicacao manual",
                  Icon: FileText,
                  iconBg: "bg-amber-50",
                  iconColor: "text-amber-600",
                  external: true,
                },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  target={action.external ? "_blank" : undefined}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-brand-bg transition group"
                >
                  <div
                    className={`w-9 h-9 rounded-lg ${action.iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition`}
                  >
                    <action.Icon
                      className={`w-4.5 h-4.5 ${action.iconColor}`}
                      aria-hidden
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-brand-ink">
                      {action.label}
                    </p>
                    <p className="text-[11px] text-brand-ink/50">
                      {action.sub}
                    </p>
                  </div>
                  {action.external ? (
                    <ExternalLink
                      className="w-3.5 h-3.5 text-brand-ink/30 group-hover:text-brand-ink/60 transition"
                      aria-hidden
                    />
                  ) : (
                    <ArrowRight
                      className="w-3.5 h-3.5 text-brand-ink/30 group-hover:text-brand-ink/60 transition"
                      aria-hidden
                    />
                  )}
                </Link>
              ))}
            </div>
          </section>

          {/* ------------------------------------------------------------- */}
          {/* MONTH SUMMARY CARD                                             */}
          {/* ------------------------------------------------------------- */}
          <div
            className="rounded-2xl p-5 text-white relative overflow-hidden"
            style={{
              background:
                "#0F1B2D",
            }}
          >
            <div
              aria-hidden
              className="absolute pointer-events-none"
              style={{
                bottom: -60,
                right: -20,
                width: 200,
                height: 160,
                background:
                  "none",
              }}
            />
            <div className="relative">
              <p
                className="text-[10px] font-bold uppercase tracking-wider mb-2"
                style={{ color: "#E3C078" }}
              >
                Resumo do mes
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span
                    className="text-xs"
                    style={{ color: "#9FB0CB" }}
                  >
                    Leads novos
                  </span>
                  <span className="text-sm font-bold tabular-nums">
                    {weekLeads ?? 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className="text-xs"
                    style={{ color: "#9FB0CB" }}
                  >
                    Artigos publicados
                  </span>
                  <span className="text-sm font-bold tabular-nums">
                    {publishedArticles ?? 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className="text-xs"
                    style={{ color: "#9FB0CB" }}
                  >
                    Custo dos agentes
                  </span>
                  <span className="text-sm font-bold tabular-nums">
                    {formatCost(monthCost)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className="text-xs"
                    style={{ color: "#9FB0CB" }}
                  >
                    Conversoes
                  </span>
                  <span className="text-sm font-bold tabular-nums">
                    {converted}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
