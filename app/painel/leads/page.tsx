import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ADMIN_CREDENTIALS } from "@/lib/config";

export const metadata: Metadata = {
  title: "Leads — Painel AdvAqui"
};

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type Lead = {
  id: string;
  created_at: string;
  updated_at: string;
  nome: string | null;
  telefone: string | null;
  email: string | null;
  cidade: string | null;
  uf: string | null;
  area_juridica: string | null;
  resumo: string | null;
  origem: string | null;
  ferramenta: string | null;
  status: string;
  prioridade: string;
  responsavel: string | null;
  observacoes: string | null;
  etiquetas: string[];
  proxima_acao: string | null;
  ai_resumo: string | null;
  ai_area: string | null;
  ai_score: number | null;
  metadata: Record<string, unknown>;
};

/* ------------------------------------------------------------------ */
/* Status / score helpers                                              */
/* ------------------------------------------------------------------ */

const STATUS_LABELS: Record<string, string> = {
  novo: "Novo",
  qualificado: "Qualificado",
  em_analise: "Em analise",
  contato_realizado: "Contato realizado",
  aguardando_docs: "Aguardando docs",
  proposta_enviada: "Proposta enviada",
  contratado: "Contratado",
  perdido: "Perdido",
  arquivado: "Arquivado"
};

const STATUS_COLORS: Record<string, string> = {
  novo: "bg-blue-100 text-blue-800",
  qualificado: "bg-teal-100 text-teal-800",
  em_analise: "bg-amber-100 text-amber-800",
  contato_realizado: "bg-purple-100 text-purple-800",
  aguardando_docs: "bg-orange-100 text-orange-800",
  proposta_enviada: "bg-cyan-100 text-cyan-800",
  contratado: "bg-emerald-100 text-emerald-800",
  perdido: "bg-red-100 text-red-800",
  arquivado: "bg-gray-100 text-gray-600"
};

const PRIORIDADE_ICONS: Record<string, { dot: string; label: string }> = {
  urgente: { dot: "bg-red-500", label: "Urgente" },
  alta: { dot: "bg-orange-500", label: "Alta" },
  normal: { dot: "bg-blue-400", label: "Normal" },
  baixa: { dot: "bg-gray-300", label: "Baixa" }
};

function scoreColor(score: number | null): string {
  if (score === null) return "bg-gray-100 text-gray-500";
  if (score >= 70) return "bg-emerald-100 text-emerald-800";
  if (score >= 30) return "bg-amber-100 text-amber-800";
  return "bg-red-100 text-red-800";
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatDateShort(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit"
  });
}

function isToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

/* ------------------------------------------------------------------ */
/* Page (Server Component)                                             */
/* ------------------------------------------------------------------ */

type SearchParams = {
  status?: string;
  area?: string;
  prioridade?: string;
  periodo?: string;
};

export default async function LeadsPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  /* --- Auth guard (admin only) -------------------------------------- */
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email || user.email.toLowerCase() !== ADMIN_CREDENTIALS.email.toLowerCase()) {
    redirect("/painel/advogado");
  }

  const params = await searchParams;
  const admin = createAdminClient();

  /* --- Build query ------------------------------------------------- */
  let query = admin
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (params.status && params.status !== "todos") {
    query = query.eq("status", params.status);
  }
  if (params.area && params.area !== "todos") {
    query = query.eq("area_juridica", params.area);
  }
  if (params.prioridade && params.prioridade !== "todos") {
    query = query.eq("prioridade", params.prioridade);
  }
  if (params.periodo) {
    const now = new Date();
    if (params.periodo === "7d") {
      const d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      query = query.gte("created_at", d.toISOString());
    } else if (params.periodo === "30d") {
      const d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      query = query.gte("created_at", d.toISOString());
    }
  }

  const { data: rawLeads, error } = await query;
  const leads: Lead[] = (rawLeads as Lead[] | null) ?? [];

  /* --- Stats (always from full set, not filtered) ------------------- */
  const { count: totalCount } = await admin
    .from("leads")
    .select("*", { count: "exact", head: true });
  const total = totalCount ?? 0;

  const { count: todayCount } = await admin
    .from("leads")
    .select("*", { count: "exact", head: true })
    .gte("created_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString());
  const todayLeads = todayCount ?? 0;

  const { count: hotCount } = await admin
    .from("leads")
    .select("*", { count: "exact", head: true })
    .gte("ai_score", 70);
  const hotLeads = hotCount ?? 0;

  const { count: convertedCount } = await admin
    .from("leads")
    .select("*", { count: "exact", head: true })
    .eq("status", "contratado");
  const converted = convertedCount ?? 0;
  const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0;

  /* --- Distinct areas for filter dropdown -------------------------- */
  const { data: areaRows } = await admin
    .from("leads")
    .select("area_juridica")
    .not("area_juridica", "is", null);
  const uniqueAreas = [
    ...new Set((areaRows ?? []).map((r) => (r as { area_juridica: string }).area_juridica).filter(Boolean))
  ].sort();

  /* --- Active filters for form defaults ----------------------------- */
  const activeStatus = params.status || "todos";
  const activeArea = params.area || "todos";
  const activePrioridade = params.prioridade || "todos";
  const activePeriodo = params.periodo || "todos";

  /* --- Render ------------------------------------------------------- */
  if (error) {
    return (
      <div className="container-tight py-10">
        <div className="card text-center">
          <p className="text-red-600 font-semibold">
            Erro ao carregar leads: {error.message}
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
            "#0F1B2D"
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
              "none"
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
            Central de Leads
          </h1>
          <p className="text-sm mt-1.5" style={{ color: "#A9B4C6" }}>
            Gerencie os leads capturados pelas ferramentas do site.
          </p>

          {/* Stats cards */}
          <div className="relative mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: "Total de leads",
                value: String(total),
                sub: "acumulado"
              },
              {
                label: "Leads novos",
                value: String(todayLeads),
                sub: "hoje"
              },
              {
                label: "Leads quentes",
                value: String(hotLeads),
                sub: "score >= 70"
              },
              {
                label: "Taxa de conversao",
                value: `${conversionRate}%`,
                sub: `${converted} contratado${converted !== 1 ? "s" : ""}`
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
      {/* FILTERS                                                         */}
      {/* --------------------------------------------------------------- */}
      <section className="card mb-6">
        <form
          method="GET"
          className="flex flex-wrap items-end gap-3"
        >
          {/* Status */}
          <div className="flex-1 min-w-[140px]">
            <label htmlFor="f-status" className="label">
              Status
            </label>
            <select
              id="f-status"
              name="status"
              defaultValue={activeStatus}
              className="input text-sm"
            >
              <option value="todos">Todos</option>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Area juridica */}
          <div className="flex-1 min-w-[140px]">
            <label htmlFor="f-area" className="label">
              Area juridica
            </label>
            <select
              id="f-area"
              name="area"
              defaultValue={activeArea}
              className="input text-sm"
            >
              <option value="todos">Todas</option>
              {uniqueAreas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* Prioridade */}
          <div className="flex-1 min-w-[120px]">
            <label htmlFor="f-prio" className="label">
              Prioridade
            </label>
            <select
              id="f-prio"
              name="prioridade"
              defaultValue={activePrioridade}
              className="input text-sm"
            >
              <option value="todos">Todas</option>
              <option value="urgente">Urgente</option>
              <option value="alta">Alta</option>
              <option value="normal">Normal</option>
              <option value="baixa">Baixa</option>
            </select>
          </div>

          {/* Periodo */}
          <div className="flex-1 min-w-[120px]">
            <label htmlFor="f-periodo" className="label">
              Periodo
            </label>
            <select
              id="f-periodo"
              name="periodo"
              defaultValue={activePeriodo}
              className="input text-sm"
            >
              <option value="todos">Todos</option>
              <option value="7d">Ultimos 7 dias</option>
              <option value="30d">Ultimos 30 dias</option>
            </select>
          </div>

          <button type="submit" className="btn-primary text-sm h-[46px]">
            Filtrar
          </button>
        </form>
      </section>

      {/* --------------------------------------------------------------- */}
      {/* LEADS TABLE                                                     */}
      {/* --------------------------------------------------------------- */}
      {leads.length === 0 ? (
        <section className="card text-center py-16">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-brand-deep/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-brand-deep/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
              />
            </svg>
          </div>
          <h2 className="font-display text-xl font-bold text-brand-ink mb-2">
            Nenhum lead ainda
          </h2>
          <p className="text-sm text-brand-ink/60 max-w-md mx-auto">
            Quando visitantes usarem as ferramentas gratuitas, os leads
            aparecerão aqui.
          </p>
        </section>
      ) : (
        <section className="rounded-2xl border border-brand-line bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-line bg-brand-bg/50">
                  <th className="text-left px-4 py-3 font-semibold text-brand-ink/70 whitespace-nowrap">
                    Nome
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-brand-ink/70 whitespace-nowrap">
                    Telefone
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-brand-ink/70 whitespace-nowrap">
                    Cidade/UF
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-brand-ink/70 whitespace-nowrap">
                    Area
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-brand-ink/70 whitespace-nowrap">
                    Score
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-brand-ink/70 whitespace-nowrap">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-brand-ink/70 whitespace-nowrap">
                    Origem
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-brand-ink/70 whitespace-nowrap">
                    Prio
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-brand-ink/70 whitespace-nowrap">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <LeadRow key={lead.id} lead={lead} />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* LeadRow — expandable row with details/summary                       */
/* ------------------------------------------------------------------ */

function LeadRow({ lead }: { lead: Lead }) {
  const prio = PRIORIDADE_ICONS[lead.prioridade] ?? PRIORIDADE_ICONS.normal;

  return (
    <>
      <tr className="border-b border-brand-line/50 hover:bg-brand-bg/30 transition group">
        <td className="px-4 py-3 font-medium text-brand-ink whitespace-nowrap">
          <details className="inline">
            <summary className="cursor-pointer list-none flex items-center gap-1.5 group-hover:text-brand-deep transition">
              <svg
                className="w-3.5 h-3.5 text-brand-ink/40 transition group-open:rotate-90"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
              {lead.nome || "Sem nome"}
            </summary>
          </details>
        </td>
        <td className="px-4 py-3 text-brand-ink/70 whitespace-nowrap">
          {lead.telefone || "-"}
        </td>
        <td className="px-4 py-3 text-brand-ink/70 whitespace-nowrap">
          {lead.cidade && lead.uf
            ? `${lead.cidade}/${lead.uf}`
            : lead.cidade || lead.uf || "-"}
        </td>
        <td className="px-4 py-3 text-brand-ink/70 whitespace-nowrap">
          {lead.ai_area || lead.area_juridica || "-"}
        </td>
        <td className="px-4 py-3 text-center">
          <span
            className={`inline-flex items-center justify-center min-w-[2.5rem] px-2 py-0.5 rounded-full text-xs font-bold ${scoreColor(lead.ai_score)}`}
          >
            {lead.ai_score !== null ? lead.ai_score : "-"}
          </span>
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              STATUS_COLORS[lead.status] || "bg-gray-100 text-gray-600"
            }`}
          >
            {STATUS_LABELS[lead.status] || lead.status}
          </span>
        </td>
        <td className="px-4 py-3 text-brand-ink/70 whitespace-nowrap text-xs">
          {lead.origem || lead.ferramenta || "-"}
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <span className="inline-flex items-center gap-1.5 text-xs text-brand-ink/60">
            <span
              className={`w-2 h-2 rounded-full ${prio.dot}`}
              aria-hidden
            />
            {prio.label}
          </span>
        </td>
        <td className="px-4 py-3 text-brand-ink/60 whitespace-nowrap text-xs">
          {isToday(lead.created_at)
            ? formatDate(lead.created_at)
            : formatDateShort(lead.created_at)}
        </td>
      </tr>

      {/* Expanded details row — hidden until <details> is open.
          We use a CSS trick: the details[open] in the previous cell
          controls visibility via the group. Since native <details>
          inside a table is tricky, we render the detail row always
          and use the :has() selector or a simple always-visible approach.
          For maximum compatibility, we render both the summary trigger
          and detail content. */}
      <tr className="border-b border-brand-line/30 hidden group-has-[details[open]]:table-row">
        <td colSpan={9} className="px-4 py-4 bg-brand-bg/40">
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            {/* Left column */}
            <div className="space-y-2">
              {lead.email && (
                <div>
                  <span className="text-xs font-semibold text-brand-ink/50 uppercase tracking-wide">
                    E-mail
                  </span>
                  <p className="text-brand-ink">{lead.email}</p>
                </div>
              )}
              {lead.resumo && (
                <div>
                  <span className="text-xs font-semibold text-brand-ink/50 uppercase tracking-wide">
                    Resumo do visitante
                  </span>
                  <p className="text-brand-ink/80 leading-relaxed">
                    {lead.resumo}
                  </p>
                </div>
              )}
              {lead.ai_resumo && (
                <div className="rounded-xl border border-brand-accent/30 bg-brand-accent/5 p-3">
                  <span className="text-xs font-semibold text-brand-accentText uppercase tracking-wide">
                    Analise da IA
                  </span>
                  <p className="text-brand-ink/80 leading-relaxed mt-1">
                    {lead.ai_resumo}
                  </p>
                </div>
              )}
            </div>

            {/* Right column */}
            <div className="space-y-2">
              {lead.proxima_acao && (
                <div>
                  <span className="text-xs font-semibold text-brand-ink/50 uppercase tracking-wide">
                    Proxima acao
                  </span>
                  <p className="text-brand-ink font-medium">
                    {lead.proxima_acao}
                  </p>
                </div>
              )}
              {lead.observacoes && (
                <div>
                  <span className="text-xs font-semibold text-brand-ink/50 uppercase tracking-wide">
                    Observacoes
                  </span>
                  <p className="text-brand-ink/80">{lead.observacoes}</p>
                </div>
              )}
              {lead.responsavel && (
                <div>
                  <span className="text-xs font-semibold text-brand-ink/50 uppercase tracking-wide">
                    Responsavel
                  </span>
                  <p className="text-brand-ink">{lead.responsavel}</p>
                </div>
              )}
              {lead.etiquetas.length > 0 && (
                <div>
                  <span className="text-xs font-semibold text-brand-ink/50 uppercase tracking-wide">
                    Etiquetas
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {lead.etiquetas.map((tag) => (
                      <span key={tag} className="chip text-[11px]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {lead.ferramenta && (
                <div>
                  <span className="text-xs font-semibold text-brand-ink/50 uppercase tracking-wide">
                    Ferramenta usada
                  </span>
                  <p className="text-brand-ink/70 text-xs">
                    {lead.ferramenta}
                  </p>
                </div>
              )}
              <div>
                <span className="text-xs font-semibold text-brand-ink/50 uppercase tracking-wide">
                  Criado em
                </span>
                <p className="text-brand-ink/70 text-xs">
                  {formatDate(lead.created_at)}
                </p>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}
