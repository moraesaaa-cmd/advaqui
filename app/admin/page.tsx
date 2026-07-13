"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Users,
  MessageSquare,
  BarChart3,
  Search,
  LogOut,
  Trash2,
  Star,
  Reply,
  Mail,
  Activity,
  Globe,
  MapPin,
  TrendingUp,
  RefreshCw,
  Bot,
  Car,
  BookOpen,
  Sparkles,
  Eye,
  EyeOff,
  Clock,
  Inbox,
  UserX,
  KeyRound,
  Pencil,
  ChevronDown,
  FileText,
  X
} from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils/format";
import { toast } from "@/components/Toast";
import { AdminExtraCitiesModal } from "@/components/AdminExtraCitiesModal";
import type { ExtraCity } from "@/components/AdminExtraCitiesModal";
import { AdminEditModal, type AdminEditConfig } from "@/components/AdminEditModal";
import { SPECIALTIES } from "@/lib/data/specialties";
import type {
  LawyerRow,
  MessageRow,
  PlanHistoryRow,
  PlanStatus
} from "@/lib/supabase/types";

const TABS = [
  { id: "users", label: "Cadastros", Icon: Users },
  { id: "messages", label: "Mensagens", Icon: MessageSquare },
  { id: "blog", label: "Blog", Icon: BookOpen },
  { id: "visits", label: "Visitas", Icon: Activity },
  { id: "stats", label: "Resumo", Icon: BarChart3 }
] as const;

type Tab = (typeof TABS)[number]["id"];

/**
 * Estilo visual do badge de status do plano no card do advogado.
 * Premium ativo = âmbar, Gratuito = cinza, Aguardando = laranja,
 * Vencido = vermelho suave, Cancelado = cinza escuro.
 */
const STATUS_BADGE: Record<
  PlanStatus,
  { label: string; badge: string; ring: string }
> = {
  active: {
    label: "Premium ativo",
    badge: "bg-brand-accent/15 text-amber-800 border border-brand-accent/50",
    ring: "border-brand-accent"
  },
  free: {
    label: "Gratuito",
    badge: "bg-gray-100 text-gray-600 border border-gray-200",
    ring: "border-brand-line"
  },
  pending: {
    label: "Aguardando ativação",
    badge: "bg-orange-50 text-orange-700 border border-orange-200",
    ring: "border-orange-300"
  },
  expired: {
    label: "Vencido",
    badge: "bg-red-50 text-red-600 border border-red-200",
    ring: "border-red-200"
  },
  cancelled: {
    label: "Cancelado",
    badge: "bg-gray-200 text-gray-700 border border-gray-300",
    ring: "border-gray-300"
  }
};

/** Data + hora em pt-BR (ex.: "02/07/2026 14:35") para o detalhe "Ver tudo". */
function fmtDateTimeBR(v: unknown): string {
  if (typeof v !== "string" || !v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

/** Rótulos pt-BR dos status do histórico de pagamentos (plan_history). */
const PLAN_HISTORY_LABELS: Record<string, string> = {
  pending: "Aguardando",
  confirmed: "Confirmado",
  expired: "Vencido",
  cancelled: "Cancelado",
  refunded: "Reembolsado"
};

/** Rótulos pt-BR das ações registradas em audit_logs (aba Resumo). */
const AUDIT_ACTION_LABELS: Record<string, string> = {
  "activate-premium": "Ativou premium",
  "deactivate-premium": "Desativou premium",
  "set-plan-status": "Alterou status do plano",
  "toggle-featured": "Alterou destaque",
  "toggle-verified-oab": "Alterou verificação OAB",
  "delete-lawyer": "Excluiu cadastro",
  "set-email": "Trocou e-mail de login",
  "set-password": "Redefiniu senha",
  "update-lawyer": "Editou dados do perfil",
  "remove-photo": "Removeu foto",
  "delete-message": "Excluiu mensagem"
};

/** Par rótulo/valor usado nas seções legíveis do "Ver tudo". */
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[10px] font-bold uppercase tracking-wide text-brand-ink/45">
        {label}
      </dt>
      <dd className="text-xs text-brand-ink break-words">{value || "—"}</dd>
    </div>
  );
}

/**
 * Detalhe completo do advogado ("Ver tudo") em seções LEGÍVEIS em português —
 * substitui o antigo despejo de JSON em <pre>. O dump técnico continua
 * disponível no <details> "Dados técnicos (JSON)" no fim, pra não perder nada.
 */
function LawyerFullDetails({ data }: { data: Record<string, unknown> }) {
  const lw = (data.lawyer ?? {}) as Partial<LawyerRow>;
  const auth = (data.authUser ?? null) as {
    email_confirmed_at?: string | null;
    last_sign_in_at?: string | null;
    created_at?: string | null;
  } | null;
  const hist = Array.isArray(data.planHistory)
    ? (data.planHistory as Array<Partial<PlanHistoryRow>>)
    : [];
  const msgs = Array.isArray(data.messages)
    ? (data.messages as Array<Partial<MessageRow>>)
    : [];
  const planLabel = lw.plan_status
    ? STATUS_BADGE[lw.plan_status].label
    : "—";

  return (
    <div className="space-y-3">
      <section className="rounded-xl border border-brand-line bg-white p-4">
        <h5 className="text-[11px] font-bold uppercase tracking-wide text-brand-deep mb-2.5">
          Dados pessoais
        </h5>
        <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2.5">
          <DetailRow label="Nome" value={lw.name || "—"} />
          <DetailRow label="CPF" value={lw.cpf || "—"} />
          <DetailRow
            label="OAB"
            value={lw.oab ? `OAB/${lw.oab_uf || "?"} ${lw.oab}` : "—"}
          />
          <DetailRow label="E-mail" value={lw.email || "—"} />
          <DetailRow label="Telefone" value={lw.phone || "—"} />
          <DetailRow label="WhatsApp" value={lw.whatsapp || "—"} />
          <DetailRow
            label="Cidade"
            value={lw.city_name ? `${lw.city_name}/${lw.uf || "?"}` : "—"}
          />
          <DetailRow label="Endereço" value={lw.address || "—"} />
        </dl>
      </section>

      <section className="rounded-xl border border-brand-line bg-white p-4">
        <h5 className="text-[11px] font-bold uppercase tracking-wide text-brand-deep mb-2.5">
          Conta
        </h5>
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2.5">
          <DetailRow
            label="E-mail confirmado em"
            value={fmtDateTimeBR(auth?.email_confirmed_at)}
          />
          <DetailRow
            label="Último acesso"
            value={fmtDateTimeBR(auth?.last_sign_in_at)}
          />
          <DetailRow label="Criado em" value={fmtDateTimeBR(auth?.created_at)} />
        </dl>
      </section>

      <section className="rounded-xl border border-brand-line bg-white p-4">
        <h5 className="text-[11px] font-bold uppercase tracking-wide text-brand-deep mb-2.5">
          Plano
        </h5>
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2.5">
          <DetailRow label="Status" value={planLabel} />
          <DetailRow label="Início" value={formatDate(lw.plan_start_date)} />
          <DetailRow label="Fim" value={formatDate(lw.plan_end_date)} />
          <DetailRow label="Destaque" value={lw.featured ? "Sim" : "Não"} />
        </dl>
        {hist.length > 0 ? (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-wide text-brand-ink/45 border-b border-brand-line">
                  <th className="py-1.5 pr-3 font-bold">Data</th>
                  <th className="py-1.5 pr-3 font-bold">Valor</th>
                  <th className="py-1.5 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {hist.map((h, i) => (
                  <tr
                    key={h.id || i}
                    className="border-b border-brand-line/50 last:border-0"
                  >
                    <td className="py-1.5 pr-3 text-brand-ink/85">
                      {formatDate(h.created_at)}
                    </td>
                    <td className="py-1.5 pr-3 text-brand-ink/85">
                      {typeof h.amount === "number" ? formatCurrency(h.amount) : "—"}
                    </td>
                    <td className="py-1.5 text-brand-ink/85">
                      {(h.status && PLAN_HISTORY_LABELS[h.status]) || h.status || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-2.5 text-xs text-brand-ink/50 italic">
            Nenhum pagamento registrado.
          </p>
        )}
      </section>

      <section className="rounded-xl border border-brand-line bg-white p-4">
        <h5 className="text-[11px] font-bold uppercase tracking-wide text-brand-deep mb-2.5">
          Mensagens enviadas pelo advogado ({msgs.length})
        </h5>
        {msgs.length === 0 ? (
          <p className="text-xs text-brand-ink/50 italic">
            Nenhuma mensagem enviada.
          </p>
        ) : (
          <ul className="space-y-2 max-h-72 overflow-y-auto">
            {msgs.map((m, i) => (
              <li
                key={m.id || i}
                className="rounded-lg border border-brand-line/70 bg-brand-bg/40 p-2.5"
              >
                <p className="text-[11px] text-brand-ink/55">
                  {formatDate(m.created_at)}
                  {m.subject ? ` · ${m.subject}` : ""}
                </p>
                <p className="text-xs text-brand-ink/85 whitespace-pre-wrap mt-0.5">
                  {m.body || ""}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <details className="rounded-xl border border-brand-line bg-brand-bg p-3">
        <summary className="cursor-pointer text-xs font-semibold text-brand-deep">
          Dados técnicos (JSON)
        </summary>
        <pre className="mt-2 text-[11px] text-brand-ink/80 whitespace-pre-wrap break-all bg-white p-2 rounded border border-brand-line max-h-96 overflow-y-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </details>

      <p className="text-[11px] text-brand-ink/50 italic">
        A senha NÃO é visível (fica guardada de forma protegida no Supabase Auth).
        Use &quot;Resetar senha&quot; ou &quot;Magic link&quot; para dar acesso ao advogado.
      </p>
    </div>
  );
}

/**
 * Constrói um link `mailto:` pré-preenchido com texto convidando o advogado
 * gratuito a assinar o plano premium. Abre no cliente de e-mail padrão do
 * sistema (Outlook, Apple Mail, Gmail webmail, etc).
 *
 * Quando o admin clica o botão, NÃO há automação de envio — o admin revisa
 * o texto antes de mandar. Isso evita ser confundido com spam pela operadora
 * de e-mail e mantém o tom pessoal.
 *
 * Conforme RESEND_API_KEY for configurada futuramente, podemos migrar pra
 * uma campanha automática programada (com opt-in, regras de frequência).
 */
function buildUpsellMailto(u: LawyerRow): string {
  const firstName = (u.name || "").trim().split(/\s+/)[0] || "Doutor(a)";
  const subject = `${firstName}, destaque seu perfil no AdvAqui em ${u.city_name}`;
  const body = `Olá ${firstName},

Aqui é a equipe do AdvAqui. Notei que você está cadastrado(a) gratuitamente em ${u.city_name}/${u.uf} — obrigado(a) por confiar no nosso diretório.

Queria te apresentar rapidamente o plano Premium (R$ 19,90/mês, Pix, sem fidelidade), que pode aumentar significativamente a visibilidade do seu perfil:

  • Seu perfil aparece no TOPO da página de ${u.city_name}, acima dos demais
  • Selo dourado "Destaque" + selo "OAB verificada" (após validação)
  • Botão WhatsApp clicável direto no card (cliente fala com você em 1 toque)
  • Bio livre até 500 caracteres explicando sua atuação
  • Áreas de atuação com filtro avançado nas buscas
  • Cidade adicional de atendimento (atenda em 2 cidades, não só 1)

Vale lembrar: o plano é mensal, sem fidelidade. Você cancela quando quiser, sem multa.

Para ativar, é só acessar:
https://advaqui.com/painel/pagamento

Qualquer dúvida, é só responder este e-mail.

Atenciosamente,
Equipe AdvAqui
contato@AdvAqui.com.br`;

  return `mailto:${encodeURIComponent(u.email)}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}

async function callAdmin(payload: Record<string, unknown>) {
  let res: Response;
  try {
    res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch {
    // Falha de rede: nunca deixar a exceção estourar no handler (travaria o
    // flag `busy` em true e o painel inteiro ficaria inerte até o F5).
    toast("Falha de conexão — verifique a internet e tente de novo", "error");
    return { status: 0, json: { error: "Falha de conexão" } as Record<string, unknown> };
  }
  if (res.status === 401) {
    toast("Sessão de administrador expirada — entre de novo", "error");
    window.setTimeout(() => {
      window.location.href = "/login";
    }, 1600);
    return { status: 401, json: { error: "Sessão expirada" } as Record<string, unknown> };
  }
  return { status: res.status, json: await res.json().catch(() => ({})) };
}

export default function AdminPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>("users");
  const [users, setUsers] = useState<LawyerRow[]>([]);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | PlanStatus>("all");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [draftingReply, setDraftingReply] = useState(false);
  const [busy, setBusy] = useState(false);

  // Modal de edição de cidades adicionais (Fase 4 — substitui window.prompt).
  const [extraCitiesModal, setExtraCitiesModal] = useState<{
    id: string;
    name: string;
    initial: ExtraCity[];
  } | null>(null);

  // Modal genérico de edição (substitui os window.prompt de entrada de texto).
  const [editModal, setEditModal] = useState<AdminEditConfig | null>(null);

  // Modal de "Áreas de atuação" — checkboxes das specialties canônicas.
  // (AdminEditModal só suporta campos de texto, então este é dedicado.)
  const [specialtiesModal, setSpecialtiesModal] = useState<{
    id: string;
    name: string;
    selected: string[];
  } | null>(null);

  // Últimas ações administrativas (audit_logs) — exibidas na aba Resumo.
  type AuditLogItem = {
    id: string;
    admin_email: string;
    action: string;
    target_id: string | null;
    target_type: string | null;
    details: Record<string, unknown> | null;
    created_at: string;
  };
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [auditLoaded, setAuditLoaded] = useState(false);

  // Recarrega o histórico toda vez que a aba Resumo é aberta (ações feitas
  // nas outras abas aparecem sem precisar de F5).
  useEffect(() => {
    if (tab !== "stats") return;
    (async () => {
      const r = await callAdmin({ action: "list-audit-logs" });
      if (r.status === 200 && Array.isArray(r.json.logs)) {
        setAuditLogs(r.json.logs as AuditLogItem[]);
      }
      setAuditLoaded(true);
    })();
  }, [tab]);

  // Blog — lista de artigos gerados
  type BlogArticle = {
    id: string;
    slug: string;
    title: string;
    category: string;
    status: string;
    reading_minutes: number | null;
    created_at: string;
    published_at: string | null;
    author_id?: string | null;
    author_name?: string | null;
  };
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const refreshArticles = async () => {
    setArticlesLoading(true);
    try {
      const r = await callAdmin({ action: "list-articles" });
      if (r.status === 200 && Array.isArray(r.json.articles)) {
        setArticles(r.json.articles as BlogArticle[]);
      }
    } catch (err) {
      console.error("[admin:blog]", err);
    } finally {
      setArticlesLoading(false);
    }
  };

  const toggleArticleStatus = async (id: string) => {
    if (busy) return;
    setBusy(true);
    const r = await callAdmin({ action: "toggle-article-status", id });
    setBusy(false);
    if (r.status === 200) {
      toast(r.json.status === "published" ? "Artigo publicado" : "Artigo ocultado");
      await refreshArticles();
    } else {
      toast(r.json.error || "Erro ao alterar status", "error");
    }
  };

  const deleteArticle = async (id: string, title: string) => {
    if (!confirm(`Excluir artigo "${title}"? Esta ação não pode ser desfeita.`)) return;
    if (busy) return;
    setBusy(true);
    const r = await callAdmin({ action: "delete-article", id });
    setBusy(false);
    if (r.status === 200) {
      toast("Artigo excluído");
      await refreshArticles();
    } else {
      toast(r.json.error || "Erro ao excluir", "error");
    }
  };

  const approveArticle = async (id: string) => {
    if (busy) return;
    setBusy(true);
    const r = await callAdmin({ action: "approve-article", id });
    setBusy(false);
    if (r.status === 200) {
      toast("Artigo aprovado e publicado");
      await refreshArticles();
    } else {
      toast(r.json.error || "Erro ao aprovar", "error");
    }
  };

  const rejectArticle = async (id: string, title: string) => {
    if (!confirm(`Rejeitar artigo "${title}"?`)) return;
    if (busy) return;
    setBusy(true);
    const r = await callAdmin({ action: "reject-article", id });
    setBusy(false);
    if (r.status === 200) {
      toast("Artigo rejeitado");
      await refreshArticles();
    } else {
      toast(r.json.error || "Erro ao rejeitar", "error");
    }
  };

  const generateBatch = async (count: number) => {
    if (generating) return;
    setGenerating(true);
    toast(`Gerando ${count} artigo(s)... Aguarde.`);
    try {
      const res = await fetch("/api/admin/generate-articles-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count })
      });
      const data = await res.json();
      if (data.ok) {
        toast(`${data.generated ?? count} artigo(s) gerado(s)`);
        await refreshArticles();
      } else {
        toast(data.error || "Erro ao gerar artigos", "error");
      }
    } catch (err) {
      console.error("[admin:blog] batch gen failed", err);
      toast("Erro de conexão ao gerar artigos", "error");
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    if (tab === "blog" && articles.length === 0) {
      void refreshArticles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // Analytics em tempo real (Fase 4 — aba Visitas).
  type Analytics = {
    last24h: number;
    last48h: number;
    last7d: number;
    activeNow: number;
    automated24h?: number;
    topPaths: Array<{ path: string; count: number }>;
    topCountries: Array<{ country: string; count: number }>;
    topRegions: Array<{ region: string; count: number }>;
    topCities: Array<{ city: string; count: number }>;
    topReferrers: Array<{ source: string; count: number }>;
    funnel7d?: Array<{ event: string; count: number }>;
    funnel24h?: Array<{ event: string; count: number }>;
    recent: Array<{
      path: string;
      country: string | null;
      region: string | null;
      city: string | null;
      ip_trunc: string | null;
      visited_at: string;
    }>;
    migrationPending: boolean;
  };
  // Nomes legíveis dos eventos de funil ("/e/{nome}" em site_visits).
  const FUNNEL_LABELS: Record<string, string> = {
    "cadastro-adv-passo1": "Cadastro de advogado — passo 1 concluído",
    "cadastro-adv-passo2": "Cadastro de advogado — passo 2 concluído",
    "cadastro-adv-concluido": "Cadastro de advogado CONCLUÍDO",
    "assistente-para-cadastro": "Assistente de perfil → cadastro",
    "contato-whatsapp": "Clique em WhatsApp (perfil/card)",
    "contato-telefone": "Clique em telefone (perfil)"
  };
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const loadAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const r = await fetch("/api/admin/analytics", { cache: "no-store" });
      const j = await r.json();
      if (j.ok) {
        setAnalytics(j as Analytics);
      } else {
        toast(j.error || "Erro ao carregar analytics", "error");
      }
    } catch (err) {
      console.error("[admin:analytics] load failed", err);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Auto-load analytics quando a aba "Visitas" é aberta + polling a cada 15s.
  useEffect(() => {
    if (tab !== "visits") return;
    void loadAnalytics();
    const interval = window.setInterval(() => {
      void loadAnalytics();
    }, 15000);
    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // Verifica autenticação admin e carrega dados iniciais
  useEffect(() => {
    (async () => {
      const check = await fetch("/api/admin", { method: "GET" });
      if (!check.ok) {
        router.push("/login");
        return;
      }
      await Promise.all([refreshUsers(), refreshMessages()]);
      setReady(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const refreshUsers = async () => {
    const r = await callAdmin({ action: "list-lawyers" });
    if (r.status === 200 && Array.isArray(r.json.lawyers)) {
      setUsers(r.json.lawyers as LawyerRow[]);
    }
  };

  const refreshMessages = async () => {
    const r = await callAdmin({ action: "list-messages" });
    if (r.status === 200 && Array.isArray(r.json.messages)) {
      setMessages(r.json.messages as MessageRow[]);
    }
  };

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users.filter((u) => {
      if (filter !== "all" && u.plan_status !== filter) return false;
      if (!term) return true;
      return [u.name, u.email, u.city_name, u.uf, u.phone, u.oab]
        .filter(Boolean)
        .some((f) => String(f).toLowerCase().includes(term));
    });
  }, [users, search, filter]);

  // Estado pra "Ver tudo" — guarda os dados completos do advogado expandido
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [fullData, setFullData] = useState<Record<string, unknown> | null>(null);
  const [loadingFull, setLoadingFull] = useState(false);

  // Estado puramente visual: qual linha da lista de cadastros está expandida
  // pelo botão "Gerenciar" (revela todas as ações da linha).
  const [manageId, setManageId] = useState<string | null>(null);

  const viewFullLawyer = async (id: string) => {
    if (expandedId === id) {
      // Toggle off
      setExpandedId(null);
      setFullData(null);
      return;
    }
    setLoadingFull(true);
    setExpandedId(id);
    setFullData(null);
    const r = await callAdmin({ action: "get-lawyer-full", id });
    setLoadingFull(false);
    if (r.status === 200) {
      setFullData(r.json as Record<string, unknown>);
    } else {
      toast(r.json.error || "Erro ao carregar dados completos", "error");
      setExpandedId(null);
    }
  };

  const activatePremium = async (id: string) => {
    if (busy) return;
    setBusy(true);
    const r = await callAdmin({ action: "activate-premium", id, days: 30 });
    setBusy(false);
    if (r.status === 200) {
      toast("Plano premium ativado");
      await refreshUsers();
    } else if (r.status !== 401 && r.status !== 0) {
      toast(String(r.json.error || "Erro ao ativar"), "error");
    }
  };

  const deactivatePremium = async (id: string) => {
    if (busy) return;
    setBusy(true);
    const r = await callAdmin({ action: "deactivate-premium", id });
    setBusy(false);
    if (r.status === 200) {
      toast("Plano desativado");
      await refreshUsers();
    } else if (r.status !== 401 && r.status !== 0) {
      toast(String(r.json.error || "Erro ao desativar"), "error");
    }
  };

  const setPlanStatus = async (id: string, status: PlanStatus) => {
    if (busy) return;
    setBusy(true);
    const r = await callAdmin({ action: "set-plan-status", id, status });
    setBusy(false);
    if (r.status === 200) {
      toast(`Status alterado para "${status}"`);
      await refreshUsers();
    } else {
      toast(r.json.error || "Erro ao alterar status", "error");
    }
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    if (busy) return;
    setBusy(true);
    const r = await callAdmin({ action: "toggle-featured", id, value: !current });
    setBusy(false);
    if (r.status === 200) {
      toast(current ? "Destaque removido" : "Destacado");
      await refreshUsers();
    } else {
      toast("Erro", "error");
    }
  };

  const toggleVerifiedOab = async (id: string, current: boolean) => {
    if (busy) return;
    setBusy(true);
    const r = await callAdmin({ action: "toggle-verified-oab", id, value: !current });
    setBusy(false);
    if (r.status === 200) {
      toast(current ? "Verificação removida" : "OAB verificada");
      await refreshUsers();
    } else {
      toast("Erro", "error");
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Tem certeza? Essa ação não pode ser desfeita.")) return;
    if (busy) return;
    setBusy(true);
    const r = await callAdmin({ action: "delete-lawyer", id });
    setBusy(false);
    if (r.status === 200) {
      toast("Cadastro removido");
      await refreshUsers();
    } else {
      toast("Erro ao excluir", "error");
    }
  };

  const markRead = async (id: string) => {
    const r = await callAdmin({ action: "mark-message-read", id });
    if (r.status === 200) await refreshMessages();
  };

  const deleteMessage = async (id: string, fromName: string) => {
    if (
      !confirm(
        `Excluir a mensagem de ${fromName || "remetente desconhecido"}? Esta ação não pode ser desfeita.`
      )
    )
      return;
    if (busy) return;
    setBusy(true);
    const r = await callAdmin({ action: "delete-message", id });
    setBusy(false);
    if (r.status === 200) {
      toast("Mensagem excluída");
      await refreshMessages();
    } else if (r.status !== 401 && r.status !== 0) {
      toast(String(r.json.error || "Erro ao excluir mensagem"), "error");
    }
  };

  const draftReply = async (id: string) => {
    setDraftingReply(true);
    const r = await callAdmin({ action: "draft-message-reply", id });
    setDraftingReply(false);
    if (r.status === 200 && r.json?.draft) {
      setReplyText(String(r.json.draft));
      toast("Rascunho gerado. Revise antes de enviar.");
    } else {
      toast(r.json?.error || "Não foi possível gerar o rascunho.", "error");
    }
  };

  const submitReply = async (id: string) => {
    if (replyText.trim().length < 5) return;
    setBusy(true);
    const r = await callAdmin({ action: "reply-message", id, reply: replyText.trim() });
    setBusy(false);
    if (r.status === 200) {
      setReplyingTo(null);
      setReplyText("");
      toast("Resposta registrada");
      await refreshMessages();
    } else {
      toast("Erro ao responder", "error");
    }
  };

  const changeEmail = (id: string, currentEmail: string) => {
    setEditModal({
      title: "Trocar e-mail de login",
      description: `E-mail atual: ${currentEmail}`,
      submitLabel: "Salvar e-mail",
      fields: [{ key: "email", label: "Novo e-mail", value: currentEmail, type: "email" }],
      onSubmit: async (v) => {
        const newEmail = (v.email || "").trim();
        if (!newEmail || newEmail === currentEmail) {
          setEditModal(null);
          return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
          toast("E-mail inválido", "error");
          return;
        }
        setBusy(true);
        const r = await callAdmin({ action: "set-email", id, email: newEmail });
        setBusy(false);
        if (r.status === 200) {
          toast(`E-mail alterado para ${newEmail}`);
          setEditModal(null);
          await refreshUsers();
        } else {
          toast(r.json.error || "Erro ao trocar e-mail", "error");
        }
      }
    });
  };

  const resetPassword = (id: string, name: string) => {
    setEditModal({
      title: `Resetar senha — ${name}`,
      description:
        "Defina uma nova senha (mínimo 8 caracteres) e avise o advogado pelo canal habitual.",
      submitLabel: "Redefinir senha",
      fields: [
        {
          key: "pass",
          label: "Nova senha",
          value: "",
          type: "password",
          placeholder: "mínimo 8 caracteres"
        }
      ],
      onSubmit: async (v) => {
        const newPass = v.pass || "";
        if (newPass.length < 8) {
          toast("Senha precisa ter pelo menos 8 caracteres", "error");
          return;
        }
        setBusy(true);
        const r = await callAdmin({ action: "set-password", id, password: newPass });
        setBusy(false);
        if (r.status === 200) {
          toast("Senha redefinida. Avise o usuário.");
          setEditModal(null);
        } else {
          toast(r.json.error || "Erro ao redefinir senha", "error");
        }
      }
    });
  };

  const sendMagicLink = async (id: string, name: string) => {
    if (busy) return;
    const ok = window.confirm(
      `Gerar magic link de login para ${name}?\n\n` +
        "O link permite que o advogado entre uma vez sem usar senha. Útil quando " +
        "ele esqueceu a senha e você precisa dar acesso sem redefini-la.\n\n" +
        "Expira em 1 hora. Copie e envie pelo WhatsApp/e-mail."
    );
    if (!ok) return;
    setBusy(true);
    const r = await callAdmin({ action: "send-magic-link", id });
    setBusy(false);
    if (r.status === 200 && typeof r.json.magicLink === "string") {
      const link = r.json.magicLink as string;
      try {
        await navigator.clipboard.writeText(link);
        toast("Magic link copiado para a área de transferência (cole no WhatsApp).");
      } catch {
        toast("Magic link gerado — copie no campo abaixo.");
      }
      setEditModal({
        title: `Magic link — ${name}`,
        description:
          "Expira em 1 hora. Cole no WhatsApp/e-mail do advogado. (Já copiado para a área de transferência.)",
        fields: [{ key: "link", label: "Link de acesso", value: link, type: "text", readonly: true }],
        onSubmit: async () => setEditModal(null)
      });
    } else {
      toast(r.json.error || "Erro ao gerar magic link", "error");
    }
  };

  const editLawyerField = (
    id: string,
    fieldKey: string,
    fieldLabel: string,
    currentValue: string
  ) => {
    setEditModal({
      title: fieldLabel,
      submitLabel: "Salvar",
      fields: [
        {
          key: "value",
          label: fieldLabel,
          value: currentValue || "",
          type: fieldKey === "bio" ? "textarea" : "text"
        }
      ],
      onSubmit: async (v) => {
        // Campos opcionais — string vazia vira null no banco (admin pode querer esvaziar).
        const trimmed = (v.value ?? "").trim();
        const payload = trimmed === "" ? null : trimmed;
        setBusy(true);
        const r = await callAdmin({
          action: "update-lawyer",
          id,
          fields: { [fieldKey]: payload }
        });
        setBusy(false);
        if (r.status === 200) {
          toast(`${fieldLabel} atualizado`);
          setEditModal(null);
          await refreshUsers();
        } else {
          toast(r.json.error || "Erro ao atualizar", "error");
        }
      }
    });
  };

  /**
   * Editar cidade PRINCIPAL do advogado de uma vez (UF + nome + slug).
   *
   * O botão antigo "Editar cidade" só mudava city_name, deixando city_slug
   * desatualizado — resultado: o card ficava em /advogados/MG/<slug-antigo>
   * mas mostrava o nome novo. Esse handler edita os 3 campos sincronizados.
   *
   * Slug é gerado automaticamente a partir do nome (lowercase, sem acentos,
   * hífen no lugar de espaços).
   */
  const editMainCity = (id: string, currentUf: string, currentName: string) => {
    setEditModal({
      title: "Cidade principal",
      description: "UF + nome da cidade. O endereço (slug) é gerado automaticamente.",
      submitLabel: "Salvar cidade",
      fields: [
        { key: "uf", label: "UF (2 letras)", value: currentUf || "", type: "text", placeholder: "MG" },
        {
          key: "name",
          label: "Nome da cidade",
          value: currentName || "",
          type: "text",
          placeholder: "Belo Horizonte"
        }
      ],
      onSubmit: async (v) => {
        const ufClean = (v.uf || "").trim().toUpperCase();
        if (!/^[A-Z]{2}$/.test(ufClean)) {
          toast("UF inválida (precisa ter 2 letras maiúsculas)", "error");
          return;
        }
        const nameClean = (v.name || "").trim();
        if (nameClean.length < 2) {
          toast("Nome de cidade inválido", "error");
          return;
        }
        const slug = nameClean
          .toLowerCase()
          .normalize("NFD")
          .replace(/[̀-ͯ]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
        if (!slug) {
          toast("Nome gerou slug vazio — tente outro nome", "error");
          return;
        }
        setBusy(true);
        const r = await callAdmin({
          action: "update-lawyer",
          id,
          fields: { uf: ufClean, city_name: nameClean, city_slug: slug }
        });
        setBusy(false);
        if (r.status === 200) {
          toast(`Cidade principal atualizada para ${nameClean}/${ufClean}`);
          setEditModal(null);
          await refreshUsers();
        } else {
          toast(r.json.error || "Erro ao atualizar cidade", "error");
        }
      }
    });
  };

  /**
   * Remove a foto do perfil do advogado.
   * Apaga arquivos do Storage (.jpg/.png/.webp) e zera coluna photo_url.
   */
  const removeUserPhoto = async (id: string, name: string) => {
    const ok = window.confirm(
      `Remover a foto de perfil de ${name}?\n\n` +
        "A foto será apagada do storage e o card volta a mostrar as iniciais. " +
        "O advogado pode subir uma nova quando quiser."
    );
    if (!ok || busy) return;
    setBusy(true);
    const r = await callAdmin({ action: "remove-photo", id });
    setBusy(false);
    if (r.status === 200) {
      toast("Foto removida");
      await refreshUsers();
    } else {
      toast(r.json.error || "Erro ao remover foto", "error");
    }
  };

  /**
   * Abre o modal de edição de cidades adicionais (Fase 4 — UX melhorada).
   *
   * Substitui o antigo `window.prompt` multilinha por um modal proper com
   * campos individuais (UF select, nome do município, remover botão).
   * O slug é calculado automaticamente a partir do nome.
   */
  const editExtraCities = (
    id: string,
    name: string,
    current: unknown
  ) => {
    const list = Array.isArray(current) ? current : [];
    const initial: ExtraCity[] = list
      .map((c) => {
        const item = c as { uf?: string; slug?: string; name?: string };
        return {
          uf: typeof item.uf === "string" ? item.uf.toUpperCase() : "MG",
          slug: typeof item.slug === "string" ? item.slug : "",
          name: typeof item.name === "string" ? item.name : ""
        };
      })
      .filter((c) => c.name && c.slug && /^[A-Z]{2}$/.test(c.uf));
    setExtraCitiesModal({ id, name, initial });
  };

  /**
   * Persiste o array de cidades adicionais editado no modal.
   */
  const saveExtraCities = async (cities: ExtraCity[]) => {
    if (!extraCitiesModal) return;
    const id = extraCitiesModal.id;
    setBusy(true);
    const r = await callAdmin({
      action: "update-lawyer",
      id,
      fields: { extra_cities: cities }
    });
    setBusy(false);
    if (r.status === 200) {
      toast(`Cidades adicionais atualizadas (${cities.length})`);
      setExtraCitiesModal(null);
      await refreshUsers();
      if (expandedId === id) {
        await viewFullLawyer(id);
      }
    } else {
      toast(r.json.error || "Erro ao atualizar cidades", "error");
    }
  };

  /**
   * Persiste as áreas de atuação marcadas no modal de checkboxes.
   * Usa o mesmo endpoint update-lawyer (specialties está na whitelist).
   */
  const saveSpecialties = async () => {
    if (!specialtiesModal || busy) return;
    setBusy(true);
    const r = await callAdmin({
      action: "update-lawyer",
      id: specialtiesModal.id,
      fields: { specialties: specialtiesModal.selected }
    });
    setBusy(false);
    if (r.status === 200) {
      toast(`Áreas de atuação atualizadas (${specialtiesModal.selected.length})`);
      setSpecialtiesModal(null);
      await refreshUsers();
    } else if (r.status !== 401 && r.status !== 0) {
      toast(String(r.json.error || "Erro ao atualizar áreas"), "error");
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    toast("Sessão encerrada");
    router.push("/");
    router.refresh();
  };

  if (!ready) {
    return <div className="container-tight py-20 text-center text-brand-ink/60">Carregando…</div>;
  }

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="container-tight py-10">
      <section
        className="rounded-3xl text-white p-6 md:p-7 mb-6 relative overflow-hidden"
        style={{ background: "#0F1B2D" }}
      >
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            top: -100,
            right: -30,
            width: 320,
            height: 260,
            background: "none"
          }}
        />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "#E3C078" }}>
              Administração
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
              Painel administrativo
            </h1>
            <p className="text-sm mt-1.5" style={{ color: "#A9B4C6" }}>
              Cadastros, mensagens, visitas e métricas do AdvAqui.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/admin/leads"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white border border-white/20 hover:bg-white/10 transition"
              title="Leads recebidos pelo chat, ferramentas e formulários — com WhatsApp em 1 clique"
            >
              <Mail className="w-4 h-4" aria-hidden /> Leads
            </a>
            <a
              href="/admin/crescimento"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white border border-white/20 hover:bg-white/10 transition"
              title="Robô de crescimento: convites de Premium gerados por IA para advogados em plano grátis (envio por WhatsApp em 1 clique)"
            >
              <TrendingUp className="w-4 h-4" aria-hidden /> Crescimento
            </a>
            <a
              href="/admin/recurso-clientes"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white border border-white/20 hover:bg-white/10 transition"
              title="Liberar/cancelar acesso dos clientes do recurso de multa (multas.advaqui.com) — não são advogados"
            >
              <Car className="w-4 h-4" aria-hidden /> Clientes de multa
            </a>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:bg-white/10 transition"
            >
              <LogOut className="w-4 h-4" aria-hidden /> Sair
            </button>
          </div>
        </div>
        <div className="relative mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Cadastros",
              value: users.length,
              Icon: Users,
              iconBg: "rgba(255,255,255,0.10)",
              iconColor: "#E8EDF5",
              accent: "rgba(255,255,255,0.14)"
            },
            {
              label: "Premium ativos",
              value: users.filter((u) => u.plan_status === "active").length,
              Icon: Star,
              iconBg: "rgba(200,162,74,0.18)",
              iconColor: "#E3C078",
              accent: "rgba(200,162,74,0.45)"
            },
            {
              label: "Aguardando",
              value: users.filter((u) => u.plan_status === "pending").length,
              Icon: Clock,
              iconBg: "rgba(249,115,22,0.16)",
              iconColor: "#FDBA74",
              accent: "rgba(249,115,22,0.45)"
            },
            {
              label: "Msgs não lidas",
              value: unread,
              Icon: MessageSquare,
              iconBg: "rgba(56,132,255,0.16)",
              iconColor: "#93C5FD",
              accent: "rgba(56,132,255,0.45)"
            }
          ].map(({ label, value, Icon, iconBg, iconColor, accent }) => (
            <div
              key={label}
              className="rounded-2xl bg-white/[0.07] p-5 md:p-6 flex items-start gap-4"
              style={{ border: `1px solid ${accent}` }}
            >
              <span
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: iconBg }}
              >
                <Icon className="w-5 h-5" style={{ color: iconColor }} aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="font-display text-4xl font-semibold leading-none">{value}</p>
                <p
                  className="text-[11px] uppercase tracking-wide mt-2 truncate"
                  style={{ color: "#A9B4C6" }}
                >
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <details className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-4">
        <summary className="cursor-pointer text-sm font-semibold text-amber-900">
          Sobre senhas dos usuários (clique para expandir)
        </summary>
        <div className="mt-3 text-sm text-amber-900/90 space-y-2 leading-relaxed">
          <p>
            <strong>Não é possível visualizar a senha original de nenhum advogado.</strong>{" "}
            Esta é uma limitação técnica obrigatória — o Supabase Auth armazena senhas como
            hash bcrypt com salt único por usuário. Mesmo o administrador do banco de dados
            não consegue ler as senhas em texto plano. Isso é prática-padrão de segurança
            (não vazaria mesmo num ataque ao servidor) e exigência da LGPD para credenciais.
          </p>
          <p>
            <strong>Quando um advogado pedir a senha dele, você tem duas opções:</strong>
          </p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>
              <strong>Resetar senha</strong> (botão amarelo no card) — você define uma nova
              senha temporária e avisa o advogado.
            </li>
            <li>
              <strong>Magic link</strong> (botão roxo no card) — gera um link de login
              passwordless válido por 1h. Copia automaticamente para sua área de
              transferência. Envia pelo WhatsApp/e-mail. O advogado clica e entra direto.
            </li>
          </ol>
          <p className="text-xs text-amber-900/70 pt-1 border-t border-amber-200 mt-2">
            Ambas as opções funcionam sem você precisar saber a senha atual. Acesso a tudo o
            mais do perfil (e-mail, telefone, OAB, cidade, endereço, bio, plano, pagamentos,
            histórico, mensagens) está disponível via &quot;Ver tudo&quot; e botões de edição.
          </p>
        </div>
      </details>

      <div className="sticky top-3 z-30 inline-flex gap-1.5 mb-6 flex-wrap rounded-2xl bg-white/90 backdrop-blur border border-brand-line p-1.5 shadow-sm">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            aria-current={tab === id ? "page" : undefined}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm transition ${
              tab === id
                ? "bg-brand-ink text-white font-semibold shadow-md ring-1 ring-brand-accent/40"
                : "bg-transparent text-brand-ink/70 font-medium hover:bg-white hover:text-brand-ink"
            }`}
          >
            <Icon
              className={`w-4 h-4 ${tab === id ? "text-brand-accent" : ""}`}
              aria-hidden
            />
            {label}
            {id === "messages" && unread > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-xs font-bold bg-brand-accent text-brand-ink">
                {unread}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "users" && (
        <div>
          {/* Barra única: contagem + busca + filtro de status */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-5">
            <p className="text-sm font-semibold text-brand-ink whitespace-nowrap md:pr-2">
              {filteredUsers.length} cadastro(s)
            </p>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-brand-ink/40" aria-hidden />
              <input
                className="input pl-10"
                placeholder="Buscar por nome, cidade, OAB, telefone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="input md:max-w-[220px]"
              value={filter}
              onChange={(e) => setFilter(e.target.value as "all" | PlanStatus)}
            >
              <option value="all">Todos os status</option>
              <option value="free">Gratuito</option>
              <option value="pending">Aguardando ativação</option>
              <option value="active">Premium ativo</option>
              <option value="expired">Vencido</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>

          <div className="rounded-2xl border border-brand-line bg-white divide-y divide-brand-line/70 overflow-hidden">
            {filteredUsers.map((u) => (
              <article
                key={u.id}
                className="px-4 sm:px-5 py-3.5 transition-colors hover:bg-brand-bg/40"
              >
                {/* Linha recolhida — avatar + identificação + status + ações rápidas */}
                <div className="flex flex-wrap items-center gap-3">
                  {u.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={u.photo_url}
                      alt={`Foto de ${u.name}`}
                      loading="lazy"
                      decoding="async"
                      className={`w-10 h-10 rounded-full object-cover border-2 bg-brand-bg flex-shrink-0 ${STATUS_BADGE[u.plan_status].ring}`}
                    />
                  ) : (
                    <div
                      className={`w-10 h-10 rounded-full bg-brand-deep/10 border-2 flex items-center justify-center flex-shrink-0 font-display font-bold text-brand-deep text-sm ${STATUS_BADGE[u.plan_status].ring}`}
                    >
                      {(u.name || "")
                        .split(/\s+/)
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((w) => w[0]?.toUpperCase())
                        .join("") || "?"}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-brand-ink text-sm leading-snug truncate">
                      {u.name}
                      {u.featured && (
                        <Star
                          className="inline-block w-3.5 h-3.5 ml-1.5 -mt-0.5 text-amber-500 fill-current"
                          aria-label="Em destaque"
                        />
                      )}
                    </p>
                    <p className="text-xs text-brand-ink/55 truncate">
                      OAB/{u.oab_uf} {u.oab} — {u.city_name}/{u.uf}
                    </p>
                  </div>
                  <span
                    className={`hidden lg:inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide flex-shrink-0 ${STATUS_BADGE[u.plan_status].badge}`}
                  >
                    {STATUS_BADGE[u.plan_status].label}
                  </span>
                  {u.moderation_status === "suspect" && (
                    <span
                      title={u.moderation_note || "Cadastro com sinais suspeitos"}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-red-50 text-red-600 border border-red-200 flex-shrink-0 cursor-help"
                    >
                      Suspeito
                    </span>
                  )}
                  <div className="flex flex-wrap items-center gap-1.5 flex-shrink-0">
                    <a
                      href={`/advogado/${u.slug}`}
                      target="_blank"
                      rel="noopener"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-brand-ink border border-brand-line bg-white hover:bg-brand-bg"
                    >
                      <Eye className="w-3.5 h-3.5" aria-hidden /> Ver perfil
                    </a>
                    {(u.plan_status === "pending" ||
                      u.plan_status === "free" ||
                      u.plan_status === "expired") && (
                      <button
                        onClick={() => activatePremium(u.id)}
                        disabled={busy}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-500 disabled:opacity-50"
                      >
                        Ativar premium
                      </button>
                    )}
                    {u.plan_status === "active" && (
                      <button
                        onClick={() => deactivatePremium(u.id)}
                        disabled={busy}
                        className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-medium hover:bg-orange-400 disabled:opacity-50"
                      >
                        Desativar premium
                      </button>
                    )}
                    <button
                      onClick={() => toggleFeatured(u.id, u.featured)}
                      disabled={busy}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-50 ${
                        u.featured
                          ? "bg-brand-accent text-brand-ink"
                          : "border border-brand-line bg-white text-brand-ink hover:bg-brand-bg"
                      }`}
                    >
                      <Star className="w-3 h-3" aria-hidden />
                      {u.featured ? "Destacado" : "Destacar"}
                    </button>
                    <button
                      onClick={() => viewFullLawyer(u.id)}
                      disabled={busy}
                      aria-expanded={expandedId === u.id}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition disabled:opacity-50 ${
                        expandedId === u.id
                          ? "bg-brand-deep text-white"
                          : "border border-brand-line bg-white text-brand-ink hover:bg-brand-bg"
                      }`}
                      title="Ver todos os dados do cadastro: CPF, datas, plano, pagamentos, mensagens"
                    >
                      <FileText className="w-3.5 h-3.5" aria-hidden />
                      {expandedId === u.id ? "Fechar" : "Ver tudo"}
                    </button>
                    <button
                      onClick={() => deleteUser(u.id)}
                      disabled={busy}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 border border-red-200 bg-white hover:bg-red-50 disabled:opacity-50"
                      title="Excluir este cadastro (pede confirmação)"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden /> Excluir
                    </button>
                    <button
                      onClick={() => setManageId(manageId === u.id ? null : u.id)}
                      aria-expanded={manageId === u.id}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        manageId === u.id
                          ? "bg-brand-ink text-white"
                          : "border border-brand-line bg-white text-brand-ink hover:bg-brand-bg"
                      }`}
                    >
                      Gerenciar
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${
                          manageId === u.id ? "rotate-180" : ""
                        }`}
                        aria-hidden
                      />
                    </button>
                  </div>
                </div>

                {manageId === u.id && (
                <div className="mt-4 pt-4 border-t border-brand-line/70 space-y-4">
                <span
                  className={`lg:hidden inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${STATUS_BADGE[u.plan_status].badge}`}
                >
                  {STATUS_BADGE[u.plan_status].label}
                </span>
                <dl className="text-xs text-brand-ink/70 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1.5">
                  <div>E-mail — {u.email}</div>
                  <div>Telefone — {u.phone || "—"}</div>
                  <div>Cadastro — {formatDate(u.created_at)}</div>
                  <div>Pagamento — {formatDate(u.payment_date)}</div>
                  <div>Vencimento — {formatDate(u.plan_end_date)}</div>
                </dl>
                <div className="flex flex-wrap items-center gap-2">
                  {/* Seletor manual de status — Fase 5.
                      Permite admin forçar gratuito/pendente/ativo/vencido/cancelado
                      independente dos botões Ativar/Desativar (que mexem em datas). */}
                  <label className="inline-flex items-center gap-1 px-2 py-1 bg-brand-line/50 rounded-lg text-xs">
                    <span className="text-brand-ink/70">Status:</span>
                    <select
                      aria-label={`Status do plano de ${u.name}`}
                      value={u.plan_status}
                      disabled={busy}
                      onChange={(e) =>
                        setPlanStatus(u.id, e.target.value as PlanStatus)
                      }
                      className="bg-white border border-brand-line rounded-md px-1.5 py-0.5 text-xs font-medium text-brand-ink focus:outline-none focus:border-brand-deep disabled:opacity-50"
                    >
                      <option value="free">Gratuito</option>
                      <option value="pending">Aguardando ativação</option>
                      <option value="active">Premium ativo</option>
                      <option value="expired">Vencido</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </label>
                  <button
                    onClick={() => toggleVerifiedOab(u.id, u.verified_oab)}
                    disabled={busy}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-50 ${
                      u.verified_oab
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-brand-line text-brand-ink hover:bg-brand-line/70"
                    }`}
                  >
                    {u.verified_oab ? "OAB verificada" : "Verificar OAB"}
                  </button>
                  {(u.plan_status === "free" || u.plan_status === "expired") && (
                    <a
                      href={buildUpsellMailto(u)}
                      className="px-3 py-1.5 bg-brand-deep text-white rounded-lg text-xs font-medium hover:bg-brand-deep/90 inline-flex items-center gap-1"
                      title="Abrir cliente de e-mail com mensagem pronta apresentando o plano premium"
                    >
                      <Mail className="w-3 h-3" aria-hidden /> Convidar pra premium
                    </a>
                  )}
                </div>
                <section className="rounded-xl border border-brand-line bg-brand-bg/40 px-4 py-3.5">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-brand-ink/55 mb-3 inline-flex items-center gap-1.5">
                      <Pencil className="w-3 h-3" aria-hidden /> Editar dados do perfil
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  <button
                    onClick={() => editLawyerField(u.id, "name", "Novo nome completo", u.name)}
                    disabled={busy}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-brand-ink bg-white border border-brand-line hover:border-brand-deep/40 hover:bg-brand-bg disabled:opacity-50"
                    title="Editar nome do advogado"
                  >
                    Editar nome
                  </button>
                  <button
                    onClick={() => editLawyerField(u.id, "phone", "Novo telefone", u.phone || "")}
                    disabled={busy}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-brand-ink bg-white border border-brand-line hover:border-brand-deep/40 hover:bg-brand-bg disabled:opacity-50"
                    title="Editar telefone do advogado"
                  >
                    Editar telefone
                  </button>
                  <button
                    onClick={() =>
                      editLawyerField(u.id, "whatsapp", "WhatsApp (com DDD)", u.whatsapp || "")
                    }
                    disabled={busy}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-brand-ink bg-white border border-brand-line hover:border-brand-deep/40 hover:bg-brand-bg disabled:opacity-50"
                    title="Editar número de WhatsApp (botão do card premium)"
                  >
                    Editar WhatsApp
                  </button>
                  <button
                    onClick={() =>
                      setSpecialtiesModal({
                        id: u.id,
                        name: u.name,
                        selected: Array.isArray(u.specialties) ? u.specialties : []
                      })
                    }
                    disabled={busy}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-brand-ink bg-white border border-brand-line hover:border-brand-deep/40 hover:bg-brand-bg disabled:opacity-50"
                    title="Marcar/desmarcar as áreas de atuação do advogado"
                  >
                    Áreas de atuação
                  </button>
                  <button
                    onClick={() => editMainCity(u.id, u.uf, u.city_name)}
                    disabled={busy}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-brand-ink bg-white border border-brand-line hover:border-brand-deep/40 hover:bg-brand-bg disabled:opacity-50"
                    title="Editar cidade principal (UF + nome + slug juntos)"
                  >
                    Editar cidade principal
                  </button>
                  <button
                    onClick={() => editLawyerField(u.id, "oab", "Novo número OAB", u.oab)}
                    disabled={busy}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-brand-ink bg-white border border-brand-line hover:border-brand-deep/40 hover:bg-brand-bg disabled:opacity-50"
                    title="Editar número OAB"
                  >
                    Editar OAB
                  </button>
                  <button
                    onClick={() =>
                      editLawyerField(u.id, "address", "Novo endereço profissional", u.address || "")
                    }
                    disabled={busy}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-brand-ink bg-white border border-brand-line hover:border-brand-deep/40 hover:bg-brand-bg disabled:opacity-50"
                    title="Editar endereço profissional"
                  >
                    Editar endereço
                  </button>
                  <button
                    onClick={() =>
                      editLawyerField(u.id, "bio", "Nova bio (até 500 chars)", u.bio || "")
                    }
                    disabled={busy}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-brand-ink bg-white border border-brand-line hover:border-brand-deep/40 hover:bg-brand-bg disabled:opacity-50"
                    title="Editar bio do advogado"
                  >
                    Editar bio
                  </button>
                  <button
                    onClick={() => editExtraCities(u.id, u.name, u.extra_cities)}
                    disabled={busy}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-brand-ink bg-white border border-brand-line hover:border-brand-deep/40 hover:bg-brand-bg disabled:opacity-50"
                    title="Editar cidades adicionais de atendimento (até 9, formato UF,slug,nome)"
                  >
                    Editar cidades extras
                  </button>
                  {/* Campos da migration 0005 — admin com poder pleno */}
                  <button
                    onClick={() =>
                      editLawyerField(
                        u.id,
                        "office_hours",
                        "Horários de atendimento (ex: Seg-Sex 9h-18h)",
                        u.office_hours || ""
                      )
                    }
                    disabled={busy}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-brand-ink bg-white border border-brand-line hover:border-brand-deep/40 hover:bg-brand-bg disabled:opacity-50"
                    title="Editar horários de atendimento (premium)"
                  >
                    Editar horários
                  </button>
                  <button
                    onClick={() =>
                      editLawyerField(
                        u.id,
                        "website",
                        "Site profissional (URL completa)",
                        u.website || ""
                      )
                    }
                    disabled={busy}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-brand-ink bg-white border border-brand-line hover:border-brand-deep/40 hover:bg-brand-bg disabled:opacity-50"
                    title="Editar URL do site (premium)"
                  >
                    Editar site
                  </button>
                  <button
                    onClick={() =>
                      editLawyerField(
                        u.id,
                        "instagram",
                        "Handle do Instagram (sem @)",
                        u.instagram || ""
                      )
                    }
                    disabled={busy}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-brand-ink bg-white border border-brand-line hover:border-brand-deep/40 hover:bg-brand-bg disabled:opacity-50"
                    title="Editar Instagram (premium)"
                  >
                    Editar Instagram
                  </button>
                  <button
                    onClick={() =>
                      editLawyerField(
                        u.id,
                        "linkedin",
                        "Handle ou URL do LinkedIn",
                        u.linkedin || ""
                      )
                    }
                    disabled={busy}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-brand-ink bg-white border border-brand-line hover:border-brand-deep/40 hover:bg-brand-bg disabled:opacity-50"
                    title="Editar LinkedIn (premium)"
                  >
                    Editar LinkedIn
                  </button>
                  <button
                    onClick={() =>
                      editLawyerField(
                        u.id,
                        "photo_url",
                        "URL da foto (Imgur, Drive público, etc)",
                        u.photo_url || ""
                      )
                    }
                    disabled={busy}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-brand-ink bg-white border border-brand-line hover:border-brand-deep/40 hover:bg-brand-bg disabled:opacity-50"
                    title="Trocar a URL da foto do advogado"
                  >
                    Editar foto (URL)
                  </button>
                  {u.photo_url && (
                    <button
                      onClick={() => removeUserPhoto(u.id, u.name)}
                      disabled={busy}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-red-700 bg-red-50 border border-red-100 hover:bg-red-100 disabled:opacity-50"
                      title="Remover foto do perfil (apaga do Storage e zera coluna)"
                    >
                      Remover foto
                    </button>
                  )}
                    </div>
                </section>
                  {/* Bloco discreto — ações de conta/acesso e operações sensíveis.
                      Mantém os mesmos handlers, só agrupadas visualmente. */}
                  <div className="w-full mt-1 rounded-xl border border-brand-line/70 bg-brand-bg/30 px-3 py-2 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-brand-ink/45 mr-1 inline-flex items-center gap-1">
                      <KeyRound className="w-3 h-3" aria-hidden /> Conta
                    </span>
                    <button
                      onClick={() => changeEmail(u.id, u.email)}
                      disabled={busy}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium text-brand-ink/70 border border-brand-line bg-white hover:text-sky-800 hover:border-sky-200 hover:bg-sky-50 disabled:opacity-50"
                      title="Trocar o e-mail de login do advogado"
                    >
                      Trocar e-mail
                    </button>
                    <button
                      onClick={() => resetPassword(u.id, u.name)}
                      disabled={busy}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium text-brand-ink/70 border border-brand-line bg-white hover:text-amber-800 hover:border-amber-200 hover:bg-amber-50 disabled:opacity-50"
                      title="Definir uma nova senha — use com cautela, avise o advogado"
                    >
                      Resetar senha
                    </button>
                    <button
                      onClick={() => sendMagicLink(u.id, u.name)}
                      disabled={busy}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium text-brand-ink/70 border border-brand-line bg-white hover:text-purple-800 hover:border-purple-200 hover:bg-purple-50 disabled:opacity-50"
                      title="Gerar link de login passwordless (expira em 1h) — útil quando user esqueceu a senha"
                    >
                      Magic link
                    </button>
                    <button
                      onClick={() => viewFullLawyer(u.id)}
                      disabled={busy}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium text-brand-ink/70 border border-brand-line bg-white hover:bg-brand-ink hover:text-white hover:border-brand-ink disabled:opacity-50"
                      title="Ver tudo: CPF, datas, plano, pagamentos, mensagens enviadas, dados de auth"
                    >
                      {expandedId === u.id ? "Fechar detalhes" : "Ver tudo"}
                    </button>
                    <button
                      onClick={() => deleteUser(u.id)}
                      disabled={busy}
                      className="ml-auto px-2.5 py-1 rounded-lg text-xs font-medium text-red-600/80 border border-transparent hover:bg-red-50 hover:border-red-200 inline-flex items-center gap-1 disabled:opacity-50"
                    >
                      <Trash2 className="w-3 h-3" aria-hidden /> Excluir
                    </button>
                  </div>

                </div>
                )}

                {/* Detalhe completo ("Ver tudo") — fora do bloco Gerenciar,
                    pra abrir também pelo botão sempre visível da linha. */}
                {expandedId === u.id && (
                  <div className="mt-4 pt-4 border-t border-brand-line">
                    <h4 className="font-display text-sm font-bold text-brand-ink mb-2">
                      Dados completos
                    </h4>
                    {loadingFull && (
                      <p className="text-xs text-brand-ink/60">Carregando...</p>
                    )}
                    {fullData && <LawyerFullDetails data={fullData} />}
                  </div>
                )}
              </article>
            ))}

            {filteredUsers.length === 0 && (
              <div className="text-center py-14 px-4">
                <span className="w-14 h-14 rounded-full bg-brand-line/50 flex items-center justify-center mx-auto mb-3">
                  <UserX className="w-7 h-7 text-brand-ink/35" aria-hidden />
                </span>
                <p className="font-display font-semibold text-brand-ink/70">
                  Nenhum cadastro encontrado
                </p>
                <p className="text-xs text-brand-ink/50 mt-1">
                  {search.trim() || filter !== "all"
                    ? "Tente limpar a busca ou mudar o filtro de status."
                    : "Os advogados que se cadastrarem aparecem aqui."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "messages" && (
        <div className="space-y-3">
          {messages.length === 0 && (
            <div className="card text-center py-14">
              <span className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
                <Inbox className="w-7 h-7 text-blue-400" aria-hidden />
              </span>
              <p className="font-display font-semibold text-brand-ink/70">
                Caixa de entrada vazia
              </p>
              <p className="text-xs text-brand-ink/50 mt-1">
                Quando um advogado ou visitante enviar uma mensagem, ela aparece aqui.
              </p>
            </div>
          )}
          {messages.map((m) => (
            <article
              key={m.id}
              className={`card ${!m.read ? "border-brand-deep bg-brand-deep/5" : ""}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-brand-ink text-sm">{m.from_name}</p>
                  <p className="text-xs text-brand-ink/60">
                    {formatDate(m.created_at)} {m.from_email ? `· ${m.from_email}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!m.read && (
                    <button
                      onClick={() => markRead(m.id)}
                      className="text-xs text-brand-deep font-medium"
                    >
                      Marcar como lida
                    </button>
                  )}
                  <button
                    onClick={() => deleteMessage(m.id, m.from_name)}
                    disabled={busy}
                    aria-label={`Excluir mensagem de ${m.from_name}`}
                    title="Excluir esta mensagem (pede confirmação)"
                    className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-red-600 border border-transparent hover:bg-red-50 hover:border-red-200 disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden />
                  </button>
                </div>
              </div>
              <p className="text-sm text-brand-ink/85 whitespace-pre-wrap">{m.body}</p>
              {m.reply && (
                <div className="mt-3 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-900">
                  <p className="text-xs font-semibold mb-1">
                    Sua resposta — {formatDate(m.reply_date)}
                  </p>
                  {m.reply}
                </div>
              )}
              {!m.reply && (
                <>
                  {replyingTo === m.id ? (
                    <div className="mt-3 space-y-2">
                      <textarea
                        className="input min-h-20"
                        placeholder="Sua resposta..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        autoFocus
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => submitReply(m.id)}
                          className="btn-primary text-xs"
                          disabled={replyText.trim().length < 5 || busy}
                        >
                          Enviar resposta
                        </button>
                        <button
                          onClick={() => draftReply(m.id)}
                          className="btn-ghost text-xs border border-brand-accent/50 inline-flex items-center gap-1"
                          disabled={draftingReply || busy}
                          title="Gera um rascunho de resposta para você revisar"
                        >
                          <Sparkles className="w-3 h-3" aria-hidden />
                          {draftingReply ? "Gerando..." : "Gerar rascunho"}
                        </button>
                        <button
                          onClick={() => setReplyingTo(null)}
                          className="btn-ghost text-xs border border-brand-line"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setReplyingTo(m.id)}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-deep hover:underline"
                    >
                      <Reply className="w-3 h-3" aria-hidden /> Responder
                    </button>
                  )}
                </>
              )}
            </article>
          ))}
        </div>
      )}

      {tab === "blog" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold text-brand-ink">
                Artigos do blog
              </h2>
              <p className="text-xs text-brand-ink/65 mt-0.5">
                {articles.length} artigo(s) no banco.{" "}
                {articles.filter((a) => a.status === "published").length} publicado(s).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => void generateBatch(5)}
                disabled={generating}
                className="btn-primary text-sm inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" aria-hidden />
                {generating ? "Gerando..." : "Gerar 5 artigos"}
              </button>
              <button
                onClick={() => void refreshArticles()}
                disabled={articlesLoading}
                className="btn-ghost border border-brand-line text-sm inline-flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${articlesLoading ? "animate-spin" : ""}`} aria-hidden />
                Atualizar
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5 flex items-start gap-3">
            <Bot className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" aria-hidden />
            <div className="text-sm">
              <p className="font-semibold text-emerald-900">Publicação automática ativa</p>
              <p className="text-emerald-800/70 text-xs mt-0.5">
                10 artigos/dia via cron (06h-21h BRT, horários diversificados).
                317 tópicos cadastrados — o robô para automaticamente quando todos forem publicados.
              </p>
            </div>
          </div>

          {/* UGC — artigos pendentes de advogados */}
          {(() => {
            const pending = articles.filter((a) => a.author_id && a.status === "pending");
            if (pending.length === 0) return null;
            return (
              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 space-y-2">
                <p className="font-semibold text-amber-900 text-sm">
                  {pending.length} artigo(s) de advogados aguardando revisão
                </p>
                {pending.map((a) => (
                  <article key={a.id} className="bg-white rounded-lg border border-amber-200 p-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-brand-ink text-sm truncate">{a.title}</p>
                      <p className="text-xs text-brand-ink/55 mt-0.5">
                        Por {a.author_name || "advogado"} · {formatDate(a.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a
                        href={`/blog/${a.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-brand-line text-brand-ink rounded-lg text-xs font-medium hover:bg-brand-line/70"
                      >
                        Ler
                      </a>
                      <button
                        onClick={() => void approveArticle(a.id)}
                        disabled={busy}
                        className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-100 disabled:opacity-50"
                      >
                        Aprovar
                      </button>
                      <button
                        onClick={() => void rejectArticle(a.id, a.title)}
                        disabled={busy}
                        className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-medium hover:bg-red-100 disabled:opacity-50"
                      >
                        Rejeitar
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            );
          })()}

          {articlesLoading && articles.length === 0 && (
            <p className="text-center text-brand-ink/50 py-8">Carregando artigos...</p>
          )}

          {!articlesLoading && articles.length === 0 && (
            <div className="card text-center py-10">
              <BookOpen className="w-10 h-10 text-brand-ink/30 mx-auto mb-3" aria-hidden />
              <p className="text-brand-ink/60">Nenhum artigo gerado ainda.</p>
              <p className="text-xs text-brand-ink/45 mt-1">
                Clique em &quot;Gerar 5 artigos&quot; para começar. A migration 0014_blog_articles.sql precisa estar aplicada no Supabase.
              </p>
            </div>
          )}

          {articles.length > 0 && (
            <div className="space-y-2">
              {articles.map((a) => (
                <article key={a.id} className="card flex flex-wrap items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                        a.status === "published"
                          ? "bg-emerald-100 text-emerald-700"
                          : a.status === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : a.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {a.status === "published" ? "Publicado" : a.status === "pending" ? "Pendente" : a.status === "rejected" ? "Rejeitado" : "Rascunho"}
                      </span>
                      {a.author_name && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          UGC · {a.author_name}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-brand-line text-brand-ink/70">
                        {a.category}
                      </span>
                    </div>
                    <p className="font-semibold text-brand-ink text-sm truncate">{a.title}</p>
                    <p className="text-xs text-brand-ink/55 mt-0.5">
                      {a.reading_minutes ? `${a.reading_minutes} min de leitura · ` : ""}
                      Criado em {formatDate(a.created_at)}
                      {a.published_at ? ` · Publicado em ${formatDate(a.published_at)}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a
                      href={`/blog/${a.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-brand-line text-brand-ink rounded-lg text-xs font-medium hover:bg-brand-line/70"
                    >
                      Ver
                    </a>
                    <button
                      onClick={() => toggleArticleStatus(a.id)}
                      disabled={busy}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1 disabled:opacity-50 ${
                        a.status === "published"
                          ? "bg-amber-50 text-amber-800 hover:bg-amber-100"
                          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      }`}
                    >
                      {a.status === "published" ? (
                        <><EyeOff className="w-3 h-3" aria-hidden /> Ocultar</>
                      ) : (
                        <><Eye className="w-3 h-3" aria-hidden /> Publicar</>
                      )}
                    </button>
                    <button
                      onClick={() => deleteArticle(a.id, a.title)}
                      disabled={busy}
                      className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-medium hover:bg-red-100 inline-flex items-center gap-1 disabled:opacity-50"
                    >
                      <Trash2 className="w-3 h-3" aria-hidden /> Excluir
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "visits" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold text-brand-ink">
                Visitas em tempo real
              </h2>
              <p className="text-xs text-brand-ink/65 mt-0.5">
                Visitantes humanos no Brasil. Atualiza a cada 15s. IP truncado,
                sem cookies, sem fingerprint. Robôs e tráfego do exterior são
                contados à parte (logo abaixo), não como visitantes.
              </p>
            </div>
            <button
              onClick={() => void loadAnalytics()}
              disabled={analyticsLoading}
              className="btn-ghost border border-brand-line text-sm inline-flex items-center gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${analyticsLoading ? "animate-spin" : ""}`}
                aria-hidden
              />
              {analyticsLoading ? "Atualizando..." : "Atualizar agora"}
            </button>
          </div>

          {analytics?.migrationPending && (
            <div className="card border-amber-200 bg-amber-50">
              <p className="text-sm text-amber-900">
                <strong>Migration 0007 pendente.</strong> Aplique o SQL{" "}
                <code>supabase/migrations/0007_site_analytics.sql</code> no
                Supabase para começar a coletar visitas.
              </p>
            </div>
          )}

          {analytics && !analytics.migrationPending && (
            <>
              {/* KPI cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="card text-center">
                  <Activity className="w-6 h-6 text-emerald-600 mx-auto mb-2" aria-hidden />
                  <p className="text-3xl font-bold text-brand-ink font-display">
                    {analytics.activeNow}
                  </p>
                  <p className="text-xs text-brand-ink/60 mt-1">
                    Online agora
                    <span className="block text-[10px] text-brand-ink/45 mt-0.5">
                      (últimos 5 min)
                    </span>
                  </p>
                </div>
                <div className="card text-center">
                  <TrendingUp className="w-6 h-6 text-brand-deep mx-auto mb-2" aria-hidden />
                  <p className="text-3xl font-bold text-brand-ink font-display">
                    {analytics.last24h}
                  </p>
                  <p className="text-xs text-brand-ink/60 mt-1">Visitas 24h</p>
                </div>
                <div className="card text-center">
                  <BarChart3 className="w-6 h-6 text-brand-deep mx-auto mb-2" aria-hidden />
                  <p className="text-3xl font-bold text-brand-ink font-display">
                    {analytics.last48h}
                  </p>
                  <p className="text-xs text-brand-ink/60 mt-1">Visitas 48h</p>
                </div>
                <div className="card text-center">
                  <BarChart3 className="w-6 h-6 text-brand-ink/40 mx-auto mb-2" aria-hidden />
                  <p className="text-3xl font-bold text-brand-ink font-display">
                    {analytics.last7d}
                  </p>
                  <p className="text-xs text-brand-ink/60 mt-1">Visitas 7d</p>
                </div>
              </div>

              {/* Tráfego automatizado (robôs/exterior) — transparência: não
                  some, mas também não conta como visitante. */}
              {(analytics.automated24h ?? 0) > 0 && (
                <p className="text-xs text-brand-ink/55 -mt-2 flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-brand-ink/40" aria-hidden />
                  <span>
                    <strong className="text-brand-ink/75">
                      {analytics.automated24h}
                    </strong>{" "}
                    acessos automatizados (robôs/scanners do exterior) em 24h —
                    excluídos das visitas acima.
                  </span>
                </p>
              )}

              {/* Funil de conversão — a medição que faltava: quem inicia o
                  cadastro, quem conclui e quem clica nos contatos. */}
              <section className="card">
                <h3 className="font-display text-base font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-brand-deep" aria-hidden />
                  Funil de conversão (7 dias · e 24h)
                </h3>
                {(analytics.funnel7d?.length ?? 0) === 0 ? (
                  <p className="text-xs text-brand-ink/55 italic">
                    Sem eventos ainda. Aparecem aqui quando alguém avança ou
                    conclui o cadastro de advogado, vem do assistente de perfil
                    ou clica em WhatsApp/telefone de um perfil.
                  </p>
                ) : (
                  <ul className="space-y-1.5 text-xs">
                    {(analytics.funnel7d ?? []).map((f) => {
                      const in24 =
                        (analytics.funnel24h ?? []).find(
                          (x) => x.event === f.event
                        )?.count ?? 0;
                      return (
                        <li
                          key={f.event}
                          className="flex items-center justify-between gap-2 py-1 border-b border-brand-line/60 last:border-0"
                        >
                          <span className="text-brand-deep">
                            {FUNNEL_LABELS[f.event] || f.event}
                          </span>
                          <span className="font-bold text-brand-ink whitespace-nowrap">
                            {f.count}
                            <span className="font-normal text-brand-ink/50">
                              {" "}
                              · {in24} em 24h
                            </span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>

              {/* Top páginas + Top países lado a lado */}
              <div className="grid md:grid-cols-2 gap-4">
                <section className="card">
                  <h3 className="font-display text-base font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
                    <Activity className="w-4 h-4 text-brand-deep" aria-hidden />
                    Páginas mais visitadas (24h)
                  </h3>
                  {analytics.topPaths.length === 0 ? (
                    <p className="text-xs text-brand-ink/55 italic">Sem dados ainda.</p>
                  ) : (
                    <ul className="space-y-1.5 text-xs">
                      {analytics.topPaths.map((p) => (
                        <li
                          key={p.path}
                          className="flex items-center justify-between gap-2 py-1 border-b border-brand-line/60 last:border-0"
                        >
                          <span className="font-mono truncate text-brand-deep">
                            {p.path}
                          </span>
                          <span className="font-bold text-brand-ink whitespace-nowrap">
                            {p.count}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                <section className="card">
                  <h3 className="font-display text-base font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
                    <Globe className="w-4 h-4 text-brand-deep" aria-hidden />
                    Onde estão seus visitantes — Brasil (24h)
                  </h3>
                  {analytics.topRegions.length === 0 &&
                  analytics.topCities.length === 0 ? (
                    <p className="text-xs text-brand-ink/55 italic">
                      Nenhuma visita do Brasil nas últimas 24h ainda. (O tráfego
                      do exterior, se houver, aparece mais abaixo.)
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {analytics.topRegions.length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wide text-brand-ink/55 mb-1.5">
                            Estados
                          </p>
                          <ul className="space-y-1 text-xs">
                            {analytics.topRegions.map((r) => (
                              <li
                                key={r.region}
                                className="flex items-center justify-between gap-2"
                              >
                                <span className="text-brand-ink/85">{r.region}</span>
                                <span className="font-bold text-brand-ink">
                                  {r.count}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {analytics.topCities.length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wide text-brand-ink/55 mb-1.5">
                            Cidades
                          </p>
                          <ul className="space-y-1 text-xs">
                            {analytics.topCities.map((c) => (
                              <li
                                key={c.city}
                                className="flex items-center justify-between gap-2"
                              >
                                <span className="text-brand-ink/85">{c.city}</span>
                                <span className="font-bold text-brand-ink">
                                  {c.count}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tráfego do exterior (robôs/scanners) — separado e em tom
                      apagado pra deixar claro que NÃO são clientes em potencial. */}
                  {analytics.topCountries.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-brand-line/60">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-brand-ink/40 mb-1.5 inline-flex items-center gap-1">
                        <Bot className="w-3 h-3" aria-hidden />
                        Tráfego automatizado — exterior
                      </p>
                      <ul className="space-y-1 text-xs">
                        {analytics.topCountries.map((c) => (
                          <li
                            key={c.country}
                            className="flex items-center justify-between gap-2 text-brand-ink/45"
                          >
                            <span>{c.country}</span>
                            <span className="font-semibold">{c.count}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>
              </div>

              {/* Origem do tráfego (referrer) — de onde vieram */}
              <section className="card">
                <h3 className="font-display text-base font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-brand-deep" aria-hidden />
                  Origem do tráfego — de onde vieram (24h)
                </h3>
                {analytics.topReferrers.length === 0 ? (
                  <p className="text-xs text-brand-ink/55 italic">Sem dados ainda.</p>
                ) : (
                  <ul className="space-y-1.5 text-xs">
                    {analytics.topReferrers.map((s) => (
                      <li
                        key={s.source}
                        className="flex items-center justify-between gap-2 py-1 border-b border-brand-line/60 last:border-0"
                      >
                        <span className="text-brand-ink/85 truncate">
                          {s.source === "Direto"
                            ? "Direto / sem referência (digitou ou favoritos)"
                            : s.source}
                        </span>
                        <span className="font-bold text-brand-ink whitespace-nowrap">
                          {s.count}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {/* Últimas visitas — ao vivo */}
              <section className="card">
                <h3 className="font-display text-base font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-deep" aria-hidden />
                  Últimas visitas
                </h3>
                {analytics.recent.length === 0 ? (
                  <p className="text-xs text-brand-ink/55 italic">
                    Ainda sem visitas registradas.
                  </p>
                ) : (
                  <ul className="space-y-1.5 text-xs divide-y divide-brand-line/60">
                    {analytics.recent.map((r, i) => {
                      const when = new Date(r.visited_at);
                      const ago = Math.floor((Date.now() - when.getTime()) / 1000);
                      const agoLabel =
                        ago < 60
                          ? `${ago}s atrás`
                          : ago < 3600
                          ? `${Math.floor(ago / 60)}min atrás`
                          : `${Math.floor(ago / 3600)}h atrás`;
                      const place = [r.city, r.region, r.country]
                        .filter(Boolean)
                        .join(", ");
                      return (
                        <li
                          key={`${r.visited_at}-${i}`}
                          className="flex flex-wrap items-center gap-x-3 gap-y-0.5 py-1.5"
                        >
                          <span className="font-mono text-brand-deep truncate max-w-md">
                            {r.path}
                          </span>
                          <span className="text-brand-ink/55">{place || "—"}</span>
                          {r.ip_trunc && (
                            <span
                              className="font-mono text-brand-ink/40 text-[11px]"
                              title="IP truncado /24 (LGPD)"
                            >
                              {r.ip_trunc}
                            </span>
                          )}
                          <span className="text-brand-ink/45 ml-auto whitespace-nowrap">
                            {agoLabel}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            </>
          )}
        </div>
      )}

      {tab === "stats" &&
        (() => {
          const active = users.filter((u) => u.plan_status === "active").length;
          const pending = users.filter((u) => u.plan_status === "pending").length;
          const free = users.filter((u) => u.plan_status === "free").length;
          const expired = users.filter((u) => u.plan_status === "expired").length;
          const cancelled = users.filter((u) => u.plan_status === "cancelled").length;
          const verified = users.filter((u) => u.verified_oab).length;
          const total = users.length;
          const conv = total > 0 ? Math.round((active / total) * 100) : 0;
          const cards: Array<[string, string | number, typeof Users, string]> = [
            ["Total cadastrados", total, Users, "text-brand-deep"],
            ["Premium ativos", active, Star, "text-emerald-600"],
            ["Aguardando ativação", pending, RefreshCw, "text-amber-600"],
            ["Taxa de conversão", `${conv}%`, TrendingUp, "text-brand-deep"],
            ["Gratuitos", free, Users, "text-brand-ink/50"],
            ["Vencidos", expired, BarChart3, "text-orange-500"],
            ["OAB verificadas", verified, Star, "text-emerald-600"],
            ["Mensagens não lidas", unread, MessageSquare, "text-brand-deep"]
          ];
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {cards.map(([label, count, Icon, color], idx) => (
                  <div key={idx} className="card text-center">
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${color}`} aria-hidden />
                    <p className="text-3xl font-bold text-brand-ink font-display">{count}</p>
                    <p className="text-xs text-brand-ink/60 mt-1">{label}</p>
                  </div>
                ))}
              </div>
              {cancelled > 0 && (
                <p className="text-xs text-brand-ink/55">
                  {cancelled} cadastro(s) com plano cancelado.
                </p>
              )}

              {/* Últimas ações administrativas (audit_logs) */}
              <section className="card">
                <h3 className="font-display text-base font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-deep" aria-hidden />
                  Últimas ações do painel
                </h3>
                {!auditLoaded ? (
                  <p className="text-xs text-brand-ink/55 italic">Carregando…</p>
                ) : auditLogs.length === 0 ? (
                  <p className="text-xs text-brand-ink/55 italic">
                    Nenhuma ação registrada ainda. As próximas ações
                    administrativas (ativar plano, editar, excluir…) aparecem
                    aqui.
                  </p>
                ) : (
                  <ul className="text-xs divide-y divide-brand-line/60">
                    {auditLogs.slice(0, 30).map((l) => {
                      const d = l.details || {};
                      const target =
                        (typeof d.name === "string" && d.name) ||
                        (typeof d.remetente === "string" && d.remetente) ||
                        (typeof d.email === "string" && d.email) ||
                        l.target_id ||
                        "—";
                      return (
                        <li
                          key={l.id}
                          className="flex flex-wrap items-center gap-x-3 gap-y-0.5 py-1.5"
                        >
                          <span className="text-brand-ink/50 whitespace-nowrap">
                            {fmtDateTimeBR(l.created_at)}
                          </span>
                          <span className="font-medium text-brand-ink">
                            {AUDIT_ACTION_LABELS[l.action] || l.action}
                          </span>
                          <span className="text-brand-ink/65 truncate">
                            {target}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            </div>
          );
        })()}

      {/* Modal de edição de cidades adicionais (Fase 4) */}
      {extraCitiesModal && (
        <AdminExtraCitiesModal
          lawyerName={extraCitiesModal.name}
          initialValue={extraCitiesModal.initial}
          busy={busy}
          onSave={saveExtraCities}
          onClose={() => setExtraCitiesModal(null)}
        />
      )}

      {editModal && (
        <AdminEditModal
          config={editModal}
          busy={busy}
          onClose={() => setEditModal(null)}
        />
      )}

      {/* Modal de áreas de atuação — checkboxes das specialties canônicas */}
      {specialtiesModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          onClick={() => setSpecialtiesModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white border border-brand-line p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 mb-1">
              <h3 className="font-display text-lg font-bold text-brand-ink">
                Áreas de atuação
              </h3>
              <button
                onClick={() => setSpecialtiesModal(null)}
                aria-label="Fechar"
                className="text-brand-ink/50 hover:text-brand-ink transition"
              >
                <X className="w-5 h-5" aria-hidden />
              </button>
            </div>
            <p className="text-sm text-brand-ink/65 mb-3">
              Marque as áreas em que {specialtiesModal.name} atua.
            </p>
            <div className="grid grid-cols-2 gap-1.5 max-h-72 overflow-y-auto pr-1">
              {SPECIALTIES.map((s) => {
                const checked = specialtiesModal.selected.includes(s.slug);
                return (
                  <label
                    key={s.slug}
                    className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md border text-sm cursor-pointer transition ${
                      checked
                        ? "border-brand-deep bg-brand-deep/5 text-brand-ink font-medium"
                        : "border-brand-line text-brand-ink/75 hover:bg-brand-bg"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setSpecialtiesModal((m) =>
                          m
                            ? {
                                ...m,
                                selected: checked
                                  ? m.selected.filter((x) => x !== s.slug)
                                  : [...m.selected, s.slug]
                              }
                            : m
                        )
                      }
                      className="accent-[#264E70]"
                    />
                    {s.name}
                  </label>
                );
              })}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setSpecialtiesModal(null)}
                className="btn-ghost border border-brand-line text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={() => void saveSpecialties()}
                disabled={busy}
                className="btn-primary text-sm disabled:opacity-50"
              >
                Salvar áreas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
