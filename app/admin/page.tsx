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
  RefreshCw
} from "lucide-react";
import { PlanBadge } from "@/components/PlanBadge";
import { formatDate } from "@/lib/utils/format";
import { toast } from "@/components/Toast";
import { AdminExtraCitiesModal } from "@/components/AdminExtraCitiesModal";
import type { ExtraCity } from "@/components/AdminExtraCitiesModal";
import type { LawyerRow, MessageRow, PlanStatus } from "@/lib/supabase/types";

const TABS = [
  { id: "users", label: "Cadastros", Icon: Users },
  { id: "messages", label: "Mensagens", Icon: MessageSquare },
  { id: "visits", label: "Visitas", Icon: Activity },
  { id: "stats", label: "Resumo", Icon: BarChart3 }
] as const;

type Tab = (typeof TABS)[number]["id"];

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
  const res = await fetch("/api/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
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
  const [busy, setBusy] = useState(false);

  // Modal de edição de cidades adicionais (Fase 4 — substitui window.prompt).
  const [extraCitiesModal, setExtraCitiesModal] = useState<{
    id: string;
    name: string;
    initial: ExtraCity[];
  } | null>(null);

  // Analytics em tempo real (Fase 4 — aba Visitas).
  type Analytics = {
    last24h: number;
    last48h: number;
    last7d: number;
    activeNow: number;
    topPaths: Array<{ path: string; count: number }>;
    topCountries: Array<{ country: string; count: number }>;
    topRegions: Array<{ region: string; count: number }>;
    topCities: Array<{ city: string; count: number }>;
    topReferrers: Array<{ source: string; count: number }>;
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
    } else {
      toast("Erro ao ativar", "error");
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
    } else {
      toast("Erro", "error");
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

  const changeEmail = async (id: string, currentEmail: string) => {
    const newEmail = window.prompt(
      `E-mail atual: ${currentEmail}\n\nDigite o novo e-mail:`,
      currentEmail
    );
    if (!newEmail || newEmail === currentEmail) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      toast("E-mail invalido", "error");
      return;
    }
    if (busy) return;
    setBusy(true);
    const r = await callAdmin({ action: "set-email", id, email: newEmail });
    setBusy(false);
    if (r.status === 200) {
      toast(`E-mail alterado para ${newEmail}`);
      await refreshUsers();
    } else {
      toast(r.json.error || "Erro ao trocar e-mail", "error");
    }
  };

  const resetPassword = async (id: string, name: string) => {
    const newPass = window.prompt(
      `Defina uma nova senha para ${name}.\n\nMinimo 8 caracteres. Avise o advogado pelo canal habitual.\nDigite a nova senha:`
    );
    if (!newPass) return;
    if (newPass.length < 8) {
      toast("Senha precisa ter pelo menos 8 caracteres", "error");
      return;
    }
    if (busy) return;
    setBusy(true);
    const r = await callAdmin({ action: "set-password", id, password: newPass });
    setBusy(false);
    if (r.status === 200) {
      toast("Senha redefinida. Avise o usuario.");
    } else {
      toast(r.json.error || "Erro ao redefinir senha", "error");
    }
  };

  const sendMagicLink = async (id: string, name: string) => {
    if (busy) return;
    const ok = window.confirm(
      `Gerar magic link de login para ${name}?\n\n` +
        "O link permite que o advogado entre uma vez sem usar senha. Util quando " +
        "ele esqueceu a senha e voce precisa dar acesso sem redefini-la.\n\n" +
        "Expira em 1 hora. Copie e envie pelo WhatsApp/e-mail."
    );
    if (!ok) return;
    setBusy(true);
    const r = await callAdmin({ action: "send-magic-link", id });
    setBusy(false);
    if (r.status === 200 && typeof r.json.magicLink === "string") {
      const link = r.json.magicLink as string;
      // Copia automatico se browser suportar
      try {
        await navigator.clipboard.writeText(link);
        toast("Magic link copiado para a area de transferencia (cole no WhatsApp).");
      } catch {
        toast("Magic link gerado. Copie do prompt abaixo.");
      }
      // Mostra o link num prompt pra garantir que o admin veja
      window.prompt(
        `Magic link para ${name} (expira em 1h):\n\nCole no WhatsApp/e-mail do advogado:`,
        link
      );
    } else {
      toast(r.json.error || "Erro ao gerar magic link", "error");
    }
  };

  const editLawyerField = async (
    id: string,
    fieldKey: string,
    fieldLabel: string,
    currentValue: string
  ) => {
    const value = window.prompt(`${fieldLabel}:`, currentValue || "");
    if (value === null) return;
    if (busy) return;
    setBusy(true);
    const trimmed = value.trim();
    // Campos opcionais — string vazia vira null no banco.
    // Importante: o admin pode QUERER esvaziar (ex: limpar Instagram errado).
    const payload = trimmed === "" ? null : trimmed;
    const r = await callAdmin({
      action: "update-lawyer",
      id,
      fields: { [fieldKey]: payload }
    });
    setBusy(false);
    if (r.status === 200) {
      toast(`${fieldLabel} atualizado`);
      await refreshUsers();
    } else {
      toast(r.json.error || "Erro ao atualizar", "error");
    }
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
  const editMainCity = async (
    id: string,
    currentUf: string,
    currentName: string
  ) => {
    const uf = window.prompt(
      `UF da cidade principal (2 letras, ex: MG, SP):`,
      currentUf || ""
    );
    if (uf === null) return;
    const ufClean = uf.trim().toUpperCase();
    if (!/^[A-Z]{2}$/.test(ufClean)) {
      toast("UF inválida (precisa ter 2 letras maiúsculas)", "error");
      return;
    }
    const name = window.prompt(
      `Nome da cidade (sem UF, ex: Belo Horizonte):`,
      currentName || ""
    );
    if (name === null) return;
    const nameClean = name.trim();
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
    if (busy) return;
    setBusy(true);
    const r = await callAdmin({
      action: "update-lawyer",
      id,
      fields: {
        uf: ufClean,
        city_name: nameClean,
        city_slug: slug
      }
    });
    setBusy(false);
    if (r.status === 200) {
      toast(`Cidade principal atualizada para ${nameClean}/${ufClean}`);
      await refreshUsers();
    } else {
      toast(r.json.error || "Erro ao atualizar cidade", "error");
    }
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
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="font-display text-3xl font-bold text-brand-ink">Painel administrativo</h1>
        <button onClick={logout} className="btn-ghost text-sm">
          <LogOut className="w-4 h-4" aria-hidden /> Sair
        </button>
      </div>

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

      <div className="flex gap-2 mb-6 flex-wrap">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
              tab === id
                ? "bg-brand-ink text-white"
                : "bg-white text-brand-ink border border-brand-line hover:bg-brand-line/40"
            }`}
          >
            <Icon className="w-4 h-4" aria-hidden />
            {label}
            {id === "messages" && unread > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-xs bg-brand-accent text-brand-ink">
                {unread}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "users" && (
        <div>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
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
              className="input sm:max-w-xs"
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
          <p className="text-sm text-brand-ink/60 mb-3">
            {filteredUsers.length} cadastro(s) encontrado(s)
          </p>

          <div className="space-y-3">
            {filteredUsers.map((u) => (
              <article key={u.id} className="card">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <div className="flex items-start gap-3">
                    {/* Avatar do advogado — admin precisa ver a foto enviada.
                        Mostra a foto real se houver, ou círculo com iniciais. */}
                    {u.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={u.photo_url}
                        alt={`Foto de ${u.name}`}
                        loading="lazy"
                        decoding="async"
                        className="w-14 h-14 rounded-full object-cover border-2 border-brand-line bg-brand-bg flex-shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-brand-deep/10 border-2 border-brand-line flex items-center justify-center flex-shrink-0 font-display font-bold text-brand-deep text-base">
                        {(u.name || "")
                          .split(/\s+/)
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((w) => w[0]?.toUpperCase())
                          .join("") || "?"}
                      </div>
                    )}
                    <div>
                      <p className="font-display font-bold text-brand-ink">{u.name}</p>
                      <p className="text-sm text-brand-ink/60">
                        OAB/{u.oab_uf} {u.oab} — {u.city_name}/{u.uf}
                      </p>
                    </div>
                  </div>
                  <PlanBadge status={u.plan_status} />
                </div>
                <dl className="text-xs text-brand-ink/70 grid sm:grid-cols-2 gap-1 mb-3">
                  <div>E-mail — {u.email}</div>
                  <div>Telefone — {u.phone || "—"}</div>
                  <div>Cadastro — {formatDate(u.created_at)}</div>
                  <div>Pagamento — {formatDate(u.payment_date)}</div>
                  <div>Vencimento — {formatDate(u.plan_end_date)}</div>
                  <div>{u.featured && "★ Em destaque manual"}</div>
                </dl>
                <div className="flex flex-wrap gap-2">
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
                    onClick={() => toggleFeatured(u.id, u.featured)}
                    disabled={busy}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1 disabled:opacity-50 ${
                      u.featured
                        ? "bg-brand-accent text-brand-ink"
                        : "bg-brand-line text-brand-ink hover:bg-brand-line/70"
                    }`}
                  >
                    <Star className="w-3 h-3" aria-hidden />
                    {u.featured ? "Destacado" : "Destacar"}
                  </button>
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
                  <button
                    onClick={() => changeEmail(u.id, u.email)}
                    disabled={busy}
                    className="px-3 py-1.5 bg-sky-50 text-sky-800 rounded-lg text-xs font-medium hover:bg-sky-100 disabled:opacity-50"
                    title="Trocar o e-mail de login do advogado"
                  >
                    Trocar e-mail
                  </button>
                  <button
                    onClick={() => resetPassword(u.id, u.name)}
                    disabled={busy}
                    className="px-3 py-1.5 bg-amber-50 text-amber-800 rounded-lg text-xs font-medium hover:bg-amber-100 disabled:opacity-50"
                    title="Definir uma nova senha — use com cautela, avise o advogado"
                  >
                    Resetar senha
                  </button>
                  <button
                    onClick={() => sendMagicLink(u.id, u.name)}
                    disabled={busy}
                    className="px-3 py-1.5 bg-purple-50 text-purple-800 rounded-lg text-xs font-medium hover:bg-purple-100 disabled:opacity-50"
                    title="Gerar link de login passwordless (expira em 1h) — útil quando user esqueceu a senha"
                  >
                    Magic link
                  </button>
                  <button
                    onClick={() => editLawyerField(u.id, "name", "Novo nome completo", u.name)}
                    disabled={busy}
                    className="px-3 py-1.5 bg-brand-line text-brand-ink rounded-lg text-xs font-medium hover:bg-brand-line/70 disabled:opacity-50"
                    title="Editar nome do advogado"
                  >
                    Editar nome
                  </button>
                  <button
                    onClick={() => editLawyerField(u.id, "phone", "Novo telefone", u.phone || "")}
                    disabled={busy}
                    className="px-3 py-1.5 bg-brand-line text-brand-ink rounded-lg text-xs font-medium hover:bg-brand-line/70 disabled:opacity-50"
                    title="Editar telefone do advogado"
                  >
                    Editar telefone
                  </button>
                  <button
                    onClick={() => editMainCity(u.id, u.uf, u.city_name)}
                    disabled={busy}
                    className="px-3 py-1.5 bg-brand-line text-brand-ink rounded-lg text-xs font-medium hover:bg-brand-line/70 disabled:opacity-50"
                    title="Editar cidade principal (UF + nome + slug juntos)"
                  >
                    Editar cidade principal
                  </button>
                  <button
                    onClick={() => editLawyerField(u.id, "oab", "Novo numero OAB", u.oab)}
                    disabled={busy}
                    className="px-3 py-1.5 bg-brand-line text-brand-ink rounded-lg text-xs font-medium hover:bg-brand-line/70 disabled:opacity-50"
                    title="Editar numero OAB"
                  >
                    Editar OAB
                  </button>
                  <button
                    onClick={() =>
                      editLawyerField(u.id, "address", "Novo endereco profissional", u.address || "")
                    }
                    disabled={busy}
                    className="px-3 py-1.5 bg-brand-line text-brand-ink rounded-lg text-xs font-medium hover:bg-brand-line/70 disabled:opacity-50"
                    title="Editar endereco profissional"
                  >
                    Editar endereço
                  </button>
                  <button
                    onClick={() =>
                      editLawyerField(u.id, "bio", "Nova bio (ate 500 chars)", u.bio || "")
                    }
                    disabled={busy}
                    className="px-3 py-1.5 bg-brand-line text-brand-ink rounded-lg text-xs font-medium hover:bg-brand-line/70 disabled:opacity-50"
                    title="Editar bio do advogado"
                  >
                    Editar bio
                  </button>
                  <button
                    onClick={() => editExtraCities(u.id, u.name, u.extra_cities)}
                    disabled={busy}
                    className="px-3 py-1.5 bg-brand-line text-brand-ink rounded-lg text-xs font-medium hover:bg-brand-line/70 disabled:opacity-50"
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
                        "Horarios de atendimento (ex: Seg-Sex 9h-18h)",
                        u.office_hours || ""
                      )
                    }
                    disabled={busy}
                    className="px-3 py-1.5 bg-brand-line text-brand-ink rounded-lg text-xs font-medium hover:bg-brand-line/70 disabled:opacity-50"
                    title="Editar horarios de atendimento (premium)"
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
                    className="px-3 py-1.5 bg-brand-line text-brand-ink rounded-lg text-xs font-medium hover:bg-brand-line/70 disabled:opacity-50"
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
                    className="px-3 py-1.5 bg-brand-line text-brand-ink rounded-lg text-xs font-medium hover:bg-brand-line/70 disabled:opacity-50"
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
                    className="px-3 py-1.5 bg-brand-line text-brand-ink rounded-lg text-xs font-medium hover:bg-brand-line/70 disabled:opacity-50"
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
                    className="px-3 py-1.5 bg-brand-line text-brand-ink rounded-lg text-xs font-medium hover:bg-brand-line/70 disabled:opacity-50"
                    title="Trocar a URL da foto do advogado"
                  >
                    Editar foto (URL)
                  </button>
                  {u.photo_url && (
                    <button
                      onClick={() => removeUserPhoto(u.id, u.name)}
                      disabled={busy}
                      className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-medium hover:bg-red-100 disabled:opacity-50"
                      title="Remover foto do perfil (apaga do Storage e zera coluna)"
                    >
                      Remover foto
                    </button>
                  )}
                  <button
                    onClick={() => viewFullLawyer(u.id)}
                    disabled={busy}
                    className="px-3 py-1.5 bg-brand-ink text-white rounded-lg text-xs font-medium hover:bg-brand-ink/90 disabled:opacity-50"
                    title="Ver tudo: CPF, datas, plano, pagamentos, mensagens enviadas, dados de auth"
                  >
                    {expandedId === u.id ? "Fechar detalhes" : "Ver tudo"}
                  </button>
                  <button
                    onClick={() => deleteUser(u.id)}
                    disabled={busy}
                    className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-medium hover:bg-red-100 inline-flex items-center gap-1 disabled:opacity-50"
                  >
                    <Trash2 className="w-3 h-3" aria-hidden /> Excluir
                  </button>
                </div>

                {expandedId === u.id && (
                  <div className="mt-4 pt-4 border-t border-brand-line">
                    <h4 className="font-display text-sm font-bold text-brand-ink mb-2">
                      Dados completos
                    </h4>
                    {loadingFull && (
                      <p className="text-xs text-brand-ink/60">Carregando...</p>
                    )}
                    {fullData && (
                      <div className="space-y-3">
                        <details open className="rounded-lg bg-brand-bg p-3">
                          <summary className="cursor-pointer text-xs font-semibold text-brand-deep">
                            Perfil completo (lawyers)
                          </summary>
                          <pre className="mt-2 text-[11px] text-brand-ink/80 whitespace-pre-wrap break-all bg-white p-2 rounded border border-brand-line max-h-96 overflow-y-auto">
                            {JSON.stringify(fullData.lawyer, null, 2)}
                          </pre>
                        </details>
                        <details className="rounded-lg bg-brand-bg p-3">
                          <summary className="cursor-pointer text-xs font-semibold text-brand-deep">
                            Auth (login, e-mail confirmado, ultimo acesso)
                          </summary>
                          <pre className="mt-2 text-[11px] text-brand-ink/80 whitespace-pre-wrap break-all bg-white p-2 rounded border border-brand-line max-h-96 overflow-y-auto">
                            {JSON.stringify(fullData.authUser, null, 2)}
                          </pre>
                        </details>
                        <details className="rounded-lg bg-brand-bg p-3">
                          <summary className="cursor-pointer text-xs font-semibold text-brand-deep">
                            Historico de pagamentos ({Array.isArray(fullData.planHistory) ? fullData.planHistory.length : 0})
                          </summary>
                          <pre className="mt-2 text-[11px] text-brand-ink/80 whitespace-pre-wrap break-all bg-white p-2 rounded border border-brand-line max-h-96 overflow-y-auto">
                            {JSON.stringify(fullData.planHistory, null, 2)}
                          </pre>
                        </details>
                        <details className="rounded-lg bg-brand-bg p-3">
                          <summary className="cursor-pointer text-xs font-semibold text-brand-deep">
                            Mensagens enviadas pelo advogado ({Array.isArray(fullData.messages) ? fullData.messages.length : 0})
                          </summary>
                          <pre className="mt-2 text-[11px] text-brand-ink/80 whitespace-pre-wrap break-all bg-white p-2 rounded border border-brand-line max-h-96 overflow-y-auto">
                            {JSON.stringify(fullData.messages, null, 2)}
                          </pre>
                        </details>
                        <p className="text-[11px] text-brand-ink/50 italic">
                          Senha NAO eh visivel (armazenada como hash bcrypt no Supabase Auth).
                          Use o botao &quot;Resetar senha&quot; acima para definir uma nova.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </article>
            ))}

            {filteredUsers.length === 0 && (
              <p className="text-center text-brand-ink/50 py-8">
                Nenhum cadastro encontrado.
              </p>
            )}
          </div>
        </div>
      )}

      {tab === "messages" && (
        <div className="space-y-3">
          {messages.length === 0 && (
            <p className="text-center text-brand-ink/50 py-12">
              Nenhuma mensagem recebida ainda.
            </p>
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
                {!m.read && (
                  <button
                    onClick={() => markRead(m.id)}
                    className="text-xs text-brand-deep font-medium"
                  >
                    Marcar como lida
                  </button>
                )}
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
                      <div className="flex gap-2">
                        <button
                          onClick={() => submitReply(m.id)}
                          className="btn-primary text-xs"
                          disabled={replyText.trim().length < 5 || busy}
                        >
                          Enviar resposta
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

      {tab === "visits" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold text-brand-ink">
                Visitas em tempo real
              </h2>
              <p className="text-xs text-brand-ink/65 mt-0.5">
                Atualiza automaticamente a cada 15s. IP truncado, sem cookies,
                sem fingerprint.
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
                    De onde vêm os visitantes (24h)
                  </h3>
                  {analytics.topCountries.length === 0 &&
                  analytics.topRegions.length === 0 ? (
                    <p className="text-xs text-brand-ink/55 italic">
                      Sem geolocalização disponível ainda. Configure o reverse
                      proxy pra enviar headers CF-IPCountry/X-Geo-Region.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {analytics.topCountries.length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wide text-brand-ink/55 mb-1.5">
                            Países
                          </p>
                          <ul className="space-y-1 text-xs">
                            {analytics.topCountries.map((c) => (
                              <li
                                key={c.country}
                                className="flex items-center justify-between gap-2"
                              >
                                <span className="text-brand-ink/85">
                                  {c.country}
                                </span>
                                <span className="font-bold text-brand-ink">
                                  {c.count}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {analytics.topRegions.length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wide text-brand-ink/55 mb-1.5">
                            Estados / Regiões
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

      {tab === "stats" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(
            [
              ["Total cadastrados", users.length, Users],
              [
                "Premium ativos",
                users.filter((u) => u.plan_status === "active").length,
                Star
              ],
              [
                "Aguardando ativação",
                users.filter((u) => u.plan_status === "pending").length,
                MessageSquare
              ],
              ["Mensagens não lidas", unread, MessageSquare]
            ] as Array<[string, number, typeof Users]>
          ).map(([label, count, Icon], idx) => (
            <div key={idx} className="card text-center">
              <Icon className="w-6 h-6 text-brand-deep mx-auto mb-2" aria-hidden />
              <p className="text-3xl font-bold text-brand-ink font-display">{count}</p>
              <p className="text-xs text-brand-ink/60 mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}

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
    </div>
  );
}
