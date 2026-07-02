"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Archive,
  Trash2,
  UserCheck
} from "lucide-react";
import { toast } from "@/components/Toast";
import LeadBriefButton from "@/components/LeadBriefButton";

/**
 * Painel de gestão de leads em /admin/leads.
 *
 * Substitui a listagem somente-leitura: busca, filtro por status com
 * contagens, paginação (50 por página), conversa completa do chat em
 * bolhas, mudança de status, observações internas, arquivar e excluir.
 * Fala com /api/admin/leads (GET lista, POST mutações) — auth pelo
 * cookie HMAC de admin, igual ao restante do painel.
 */

type TranscriptMessage = { role: string; content: string; ts?: number };

type MatchedLawyer = { name: string; slug: string };

type AdminLead = {
  id: string;
  created_at: string | null;
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
  prioridade: string | null;
  observacoes: string | null;
  etiquetas: string[] | null;
  proxima_acao: string | null;
  ai_resumo: string | null;
  matched_lawyer_id: string | null;
  transcript: TranscriptMessage[] | null;
  matched_lawyer: MatchedLawyer | null;
};

/** Ordem de exibição + label + cores do badge de cada status. */
const STATUS_META: Array<{ value: string; label: string; badge: string }> = [
  { value: "novo", label: "Novo", badge: "bg-sky-50 text-sky-700 border border-sky-200" },
  {
    value: "qualificado",
    label: "Qualificado",
    badge: "bg-amber-50 text-amber-800 border border-amber-300"
  },
  {
    value: "em_analise",
    label: "Em análise",
    badge: "bg-indigo-50 text-indigo-700 border border-indigo-200"
  },
  {
    value: "contato_realizado",
    label: "Contato realizado",
    badge: "bg-teal-50 text-teal-700 border border-teal-200"
  },
  {
    value: "aguardando_docs",
    label: "Aguardando documentos",
    badge: "bg-orange-50 text-orange-700 border border-orange-200"
  },
  {
    value: "proposta_enviada",
    label: "Proposta enviada",
    badge: "bg-purple-50 text-purple-700 border border-purple-200"
  },
  {
    value: "contratado",
    label: "Contratado",
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200"
  },
  { value: "perdido", label: "Perdido", badge: "bg-red-50 text-red-700 border border-red-200" },
  {
    value: "arquivado",
    label: "Arquivado",
    badge: "bg-gray-100 text-gray-600 border border-gray-200"
  }
];

const PRIORIDADE_BADGE: Record<string, { label: string; badge: string }> = {
  urgente: { label: "Urgente", badge: "bg-red-600 text-white" },
  alta: { label: "Prioridade alta", badge: "bg-orange-100 text-orange-800 border border-orange-200" },
  baixa: { label: "Prioridade baixa", badge: "bg-gray-100 text-gray-600 border border-gray-200" }
};

function statusMeta(value: string) {
  return (
    STATUS_META.find((s) => s.value === value) ?? {
      value,
      label: value,
      badge: "bg-gray-100 text-gray-600 border border-gray-200"
    }
  );
}

/** Telefone → só dígitos com DDI 55 para wa.me. */
function toWa(raw: string): string {
  let d = (raw || "").replace(/\D/g, "");
  if (!d) return "";
  if (d.length <= 11) d = "55" + d;
  return d;
}

function fmtData(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return iso.slice(0, 16).replace("T", " ");
  }
}

/** Horário curto (HH:MM) de uma mensagem do transcript; "" se ts inválido. */
function fmtHora(ts?: number): string {
  if (!ts) return "";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

type ApiResult = { status: number; json: Record<string, unknown> };

/**
 * POST infalível pra /api/admin/leads — mesmo padrão do callAdmin do painel:
 * falha de rede vira toast (nunca exceção solta que travaria o `busy`);
 * 401 vira aviso de sessão expirada.
 */
async function callLeadsAdmin(
  payload: Record<string, unknown>,
  onExpired: () => void
): Promise<ApiResult> {
  let res: Response;
  try {
    res = await fetch("/api/admin/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch {
    toast("Falha de conexão — verifique a internet e tente de novo", "error");
    return { status: 0, json: { error: "Falha de conexão" } };
  }
  if (res.status === 401) {
    toast("Sessão de administrador expirada — entre de novo", "error");
    onExpired();
    return { status: 401, json: { error: "Sessão expirada" } };
  }
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  return { status: res.status, json };
}

export default function LeadsAdminView() {
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [statusFilter, setStatusFilter] = useState("");
  const [buscaInput, setBuscaInput] = useState("");
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [openTranscript, setOpenTranscript] = useState<string | null>(null);
  // Rascunhos de observações por lead — só vira banco ao clicar "Salvar".
  const [obsDraft, setObsDraft] = useState<Record<string, string>>({});

  const load = useCallback(async (p: number, st: string, q: string) => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(p));
    if (st) params.set("status", st);
    if (q) params.set("busca", q);
    let res: Response;
    try {
      res = await fetch(`/api/admin/leads?${params.toString()}`, { cache: "no-store" });
    } catch {
      toast("Falha de conexão — verifique a internet e tente de novo", "error");
      setLoading(false);
      return;
    }
    if (res.status === 401) {
      toast("Sessão de administrador expirada — entre de novo", "error");
      setSessionExpired(true);
      setLoading(false);
      return;
    }
    const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (res.ok && json.ok && Array.isArray(json.leads)) {
      setLeads(json.leads as AdminLead[]);
      setTotal(typeof json.total === "number" ? json.total : 0);
      setPageSize(typeof json.pageSize === "number" && json.pageSize > 0 ? json.pageSize : 50);
      setCounts(
        json.counts && typeof json.counts === "object"
          ? (json.counts as Record<string, number>)
          : {}
      );
    } else {
      toast(String(json.error || "Erro ao carregar leads"), "error");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load(page, statusFilter, busca);
  }, [page, statusFilter, busca, load]);

  const onExpired = useCallback(() => setSessionExpired(true), []);

  const reload = useCallback(async () => {
    await load(page, statusFilter, busca);
  }, [load, page, statusFilter, busca]);

  const aplicarBusca = () => {
    setPage(1);
    setBusca(buscaInput.trim());
  };

  const changeStatus = async (lead: AdminLead, novoStatus: string) => {
    if (busy) return;
    setBusy(true);
    const r = await callLeadsAdmin(
      { action: "update-lead", id: lead.id, fields: { status: novoStatus } },
      onExpired
    );
    setBusy(false);
    if (r.status === 200) {
      toast(`Status alterado para "${statusMeta(novoStatus).label}"`);
      await reload();
    } else if (r.status !== 401 && r.status !== 0) {
      toast(String(r.json.error || "Erro ao alterar status"), "error");
    }
  };

  const saveObs = async (lead: AdminLead) => {
    const draft = obsDraft[lead.id];
    if (draft === undefined || busy) return;
    setBusy(true);
    const r = await callLeadsAdmin(
      { action: "update-lead", id: lead.id, fields: { observacoes: draft } },
      onExpired
    );
    setBusy(false);
    if (r.status === 200) {
      toast("Observações salvas");
      const salvo = draft.trim() === "" ? null : draft.trim();
      setLeads((prev) =>
        prev.map((l) => (l.id === lead.id ? { ...l, observacoes: salvo } : l))
      );
      setObsDraft((prev) => {
        const next = { ...prev };
        delete next[lead.id];
        return next;
      });
    } else if (r.status !== 401 && r.status !== 0) {
      toast(String(r.json.error || "Erro ao salvar observações"), "error");
    }
  };

  const archiveLead = async (lead: AdminLead) => {
    if (busy) return;
    setBusy(true);
    const r = await callLeadsAdmin({ action: "archive-lead", id: lead.id }, onExpired);
    setBusy(false);
    if (r.status === 200) {
      toast(`Lead ${lead.nome || "sem nome"} arquivado`);
      await reload();
    } else if (r.status !== 401 && r.status !== 0) {
      toast(String(r.json.error || "Erro ao arquivar"), "error");
    }
  };

  const deleteLead = async (lead: AdminLead) => {
    const nome = lead.nome || "Sem nome";
    const ok = window.confirm(
      `Excluir o lead "${nome}"?\n\n` +
        "Esta ação é IRREVERSÍVEL: os dados e a conversa serão apagados de vez.\n" +
        'Para só tirar da lista sem apagar, use "Arquivar".'
    );
    if (!ok || busy) return;
    setBusy(true);
    const r = await callLeadsAdmin({ action: "delete-lead", id: lead.id }, onExpired);
    setBusy(false);
    if (r.status === 200) {
      toast(`Lead "${nome}" excluído`);
      await reload();
    } else if (r.status !== 401 && r.status !== 0) {
      toast(String(r.json.error || "Erro ao excluir"), "error");
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const somaCounts = STATUS_META.reduce((acc, s) => acc + (counts[s.value] ?? 0), 0);

  const paginacao =
    totalPages > 1 ? (
      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1 || loading}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-brand-line bg-white text-brand-ink text-sm font-medium hover:bg-brand-bg disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden /> Anterior
        </button>
        <span className="text-sm text-brand-ink/60">
          Página {page} de {totalPages}
        </span>
        <button
          type="button"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages || loading}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-brand-line bg-white text-brand-ink text-sm font-medium hover:bg-brand-bg disabled:opacity-40"
        >
          Próxima <ChevronRight className="w-4 h-4" aria-hidden />
        </button>
      </div>
    ) : null;

  return (
    <div className="container-narrow max-w-4xl py-10">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="font-display text-2xl font-bold text-brand-ink">Leads recebidos</h1>
        <span className="text-sm text-brand-ink/60">
          {total} {total === 1 ? "lead" : "leads"}
        </span>
      </div>
      <p className="text-sm text-brand-ink/70 mt-2">
        Pessoas que pediram contato pelo chat Advogado Online, por ferramentas ou
        formulários. Fale no WhatsApp em 1 clique, leia a conversa completa e organize
        cada lead por status.
      </p>

      {sessionExpired && (
        <div className="mt-6 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-3">
          Sua sessão de administrador expirou.{" "}
          <a href="/login?redirect=/admin/leads" className="font-semibold underline">
            Entrar de novo
          </a>
        </div>
      )}

      {/* Barra: busca + filtro por status (com contagens) */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-brand-ink/40" aria-hidden />
          <input
            className="input pl-10"
            placeholder="Buscar por nome ou telefone..."
            value={buscaInput}
            onChange={(e) => setBuscaInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") aplicarBusca();
            }}
            aria-label="Buscar leads por nome ou telefone"
          />
        </div>
        <button
          type="button"
          onClick={aplicarBusca}
          disabled={loading}
          className="px-4 py-2 rounded-xl border border-brand-line bg-white text-brand-ink text-sm font-semibold hover:bg-brand-bg disabled:opacity-50"
        >
          Buscar
        </button>
        <select
          className="input sm:max-w-[260px]"
          value={statusFilter}
          onChange={(e) => {
            setPage(1);
            setStatusFilter(e.target.value);
          }}
          aria-label="Filtrar leads por status"
        >
          <option value="">Todos os status ({somaCounts})</option>
          {STATUS_META.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label} ({counts[s.value] ?? 0})
            </option>
          ))}
        </select>
      </div>

      {paginacao}

      {loading && (
        <div className="mt-6 text-center text-sm text-brand-ink/60 py-8">
          Carregando leads…
        </div>
      )}

      {!loading && leads.length === 0 && (
        <div className="mt-6 rounded-xl bg-brand-bg border border-brand-line text-brand-ink/70 text-sm px-4 py-4">
          {busca || statusFilter
            ? "Nenhum lead encontrado com esses filtros."
            : "Nenhum lead ainda. Assim que alguém concluir uma conversa no chat com nome e WhatsApp, aparece aqui."}
        </div>
      )}

      <div className="mt-6 space-y-3">
        {!loading &&
          leads.map((l) => {
            const wa = toWa(l.telefone || "");
            const waUrl = wa
              ? `https://wa.me/${wa}?text=${encodeURIComponent(
                  `Olá${l.nome ? ", " + l.nome.split(" ")[0] : ""}! Sou do AdvAqui, recebi seu contato sobre ${
                    l.area_juridica || "sua questão jurídica"
                  }. Posso te ajudar?`
                )}`
              : "";
            const meta = statusMeta(l.status);
            const prioridade =
              l.prioridade && l.prioridade !== "normal"
                ? PRIORIDADE_BADGE[l.prioridade] ?? null
                : null;
            const mensagens = Array.isArray(l.transcript) ? l.transcript : [];
            const conversaAberta = openTranscript === l.id;
            const obsValor = obsDraft[l.id] ?? l.observacoes ?? "";
            const obsAlterada = obsDraft[l.id] !== undefined && obsDraft[l.id] !== (l.observacoes ?? "");

            return (
              <div key={l.id} className="rounded-2xl border border-brand-line bg-white p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-brand-ink">{l.nome || "Sem nome"}</p>
                      <span
                        className={`inline-flex items-center text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${meta.badge}`}
                      >
                        {meta.label}
                      </span>
                      {prioridade && (
                        <span
                          className={`inline-flex items-center text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${prioridade.badge}`}
                        >
                          {prioridade.label}
                        </span>
                      )}
                      {l.area_juridica && (
                        <span className="inline-flex items-center text-[11px] font-medium uppercase tracking-wide px-2 py-0.5 rounded-full bg-brand-deep/10 text-brand-deep">
                          {l.area_juridica}
                        </span>
                      )}
                      {l.matched_lawyer && (
                        <a
                          href={`/advogado/${l.matched_lawyer.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                          title="Advogado indicado para este lead — clique para ver o perfil"
                        >
                          <UserCheck className="w-3 h-3" aria-hidden />
                          {l.matched_lawyer.name}
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-brand-ink/60 mt-0.5">
                      {[l.cidade, l.uf].filter(Boolean).join("/") || "cidade não informada"} ·{" "}
                      {fmtData(l.created_at)} · via {l.origem || l.ferramenta || "site"}
                    </p>
                    <p className="text-sm text-brand-ink/80 mt-1.5">
                      {l.telefone ? `📱 ${l.telefone}` : "sem telefone"}
                      {l.email ? ` · ✉ ${l.email}` : ""}
                    </p>

                    {l.resumo && (
                      <p className="text-sm text-brand-ink/70 mt-2 bg-brand-bg rounded-lg px-3 py-2">
                        {l.resumo}
                      </p>
                    )}
                    {l.ai_resumo && (
                      <p className="text-sm text-brand-ink/80 mt-2 bg-brand-deep/5 border border-brand-line rounded-lg px-3 py-2">
                        <span className="font-semibold text-brand-ink">Resumo do caso: </span>
                        {l.ai_resumo}
                      </p>
                    )}
                    {l.proxima_acao && (
                      <p className="text-xs text-brand-ink/70 mt-2">
                        <span className="font-semibold text-brand-ink">Próxima ação: </span>
                        {l.proxima_acao}
                      </p>
                    )}
                    {Array.isArray(l.etiquetas) && l.etiquetas.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {l.etiquetas.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded bg-brand-line/50 text-brand-ink/70"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <LeadBriefButton leadId={l.id} waPhone={wa} />

                    {/* Conversa completa do chat (transcript da migration 0019) */}
                    {mensagens.length > 0 ? (
                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={() => setOpenTranscript(conversaAberta ? null : l.id)}
                          aria-expanded={conversaAberta}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-brand-line bg-white text-brand-ink text-xs font-semibold hover:bg-brand-bg"
                        >
                          <MessageSquare className="w-3.5 h-3.5" aria-hidden />
                          {conversaAberta
                            ? "Ocultar conversa"
                            : `Ver conversa (${mensagens.length} ${
                                mensagens.length === 1 ? "mensagem" : "mensagens"
                              })`}
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform ${
                              conversaAberta ? "rotate-180" : ""
                            }`}
                            aria-hidden
                          />
                        </button>
                        {conversaAberta && (
                          <div className="mt-2 rounded-xl border border-brand-line bg-brand-bg/60 p-3 max-h-96 overflow-y-auto space-y-2">
                            {mensagens.map((m, i) => {
                              const doLead = m.role === "user";
                              const hora = fmtHora(m.ts);
                              return (
                                <div
                                  key={i}
                                  className={`flex ${doLead ? "justify-end" : "justify-start"}`}
                                >
                                  <div
                                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                                      doLead
                                        ? "bg-brand-deep text-white rounded-br-md"
                                        : "bg-white border border-brand-line text-brand-ink rounded-bl-md"
                                    }`}
                                  >
                                    <p
                                      className={`text-[10px] font-bold uppercase tracking-wide mb-0.5 ${
                                        doLead ? "text-white/70" : "text-brand-ink/50"
                                      }`}
                                    >
                                      {doLead
                                        ? (l.nome || "Lead").split(" ")[0]
                                        : "Marina"}
                                      {hora ? ` · ${hora}` : ""}
                                    </p>
                                    <p className="whitespace-pre-wrap break-words">{m.content}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="mt-3 text-xs text-brand-ink/50 italic">
                        Conversa não registrada (lead anterior à atualização)
                      </p>
                    )}
                  </div>

                  {waUrl && (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold shrink-0"
                      style={{ background: "#25D366" }}
                    >
                      WhatsApp
                    </a>
                  )}
                </div>

                {/* Ações: status, observações, arquivar, excluir */}
                <div className="mt-4 pt-3 border-t border-brand-line/70 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="inline-flex items-center gap-1.5 px-2 py-1 bg-brand-line/50 rounded-lg text-xs text-brand-ink/70">
                      Status:
                      <select
                        aria-label={`Status do lead ${l.nome || "sem nome"}`}
                        value={l.status}
                        disabled={busy}
                        onChange={(e) => void changeStatus(l, e.target.value)}
                        className="bg-white border border-brand-line rounded-md px-1.5 py-0.5 text-xs font-medium text-brand-ink focus:outline-none focus:border-brand-deep disabled:opacity-50"
                      >
                        {STATUS_META.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    {l.status !== "arquivado" && (
                      <button
                        type="button"
                        onClick={() => void archiveLead(l)}
                        disabled={busy}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-brand-ink border border-brand-line bg-white hover:bg-brand-bg disabled:opacity-50"
                        title="Tira da lista de trabalho sem apagar nada (status vira Arquivado)"
                      >
                        <Archive className="w-3.5 h-3.5" aria-hidden /> Arquivar
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => void deleteLead(l)}
                      disabled={busy}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 disabled:opacity-50"
                      title="Apaga o lead e a conversa de vez — não tem como desfazer"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden /> Excluir
                    </button>
                  </div>

                  <div>
                    <label
                      htmlFor={`obs-${l.id}`}
                      className="text-[11px] font-bold uppercase tracking-wide text-brand-ink/55"
                    >
                      Observações (só o admin vê)
                    </label>
                    <textarea
                      id={`obs-${l.id}`}
                      rows={2}
                      value={obsValor}
                      onChange={(e) =>
                        setObsDraft((prev) => ({ ...prev, [l.id]: e.target.value }))
                      }
                      placeholder="Anote combinados, retorno prometido, valores..."
                      className="mt-1 w-full text-sm text-brand-ink rounded-lg border border-brand-line bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-deep/30"
                    />
                    {obsAlterada && (
                      <button
                        type="button"
                        onClick={() => void saveObs(l)}
                        disabled={busy}
                        className="mt-1 px-3 py-1.5 rounded-lg bg-brand-ink text-white text-xs font-semibold hover:bg-brand-deep disabled:opacity-50"
                      >
                        Salvar observações
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {!loading && paginacao}
    </div>
  );
}
