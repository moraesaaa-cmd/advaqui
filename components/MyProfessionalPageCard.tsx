"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ExternalLink,
  Copy,
  QrCode,
  Check,
  Sparkles,
  AlertCircle,
  X,
  Edit3,
  Globe,
  EyeOff,
  CheckCircle2,
  Clock,
  Pause,
  Play,
  Eye
} from "lucide-react";
import { SITE } from "@/lib/config";
import type { Lawyer } from "@/lib/data/lawyer-mapper";

/**
 * Central da Página Profissional — bloco principal do dashboard do advogado
 * (Maio/2026, segunda iteração do recurso).
 *
 * Renomeado de "Minha Página Profissional" pra "Central da Página
 * Profissional" — agora consolida em um só lugar:
 *   • Status atual (Não configurada / Incompleta / Publicada / Em análise)
 *   • Visibilidade (Online e indexável / Disponível como rascunho privado)
 *   • URL pública
 *   • Última atualização
 *   • Percentual de completude
 *   • Botões de ação (Ver pública, Editar, Copiar link, QR Code)
 *
 * Pausar/Republicar e Métricas dependem de migration 0006 (page_status,
 * paused_at) — ficam pra próxima rodada quando a migration estiver aplicada.
 */

type Status =
  | "publicada"
  | "incompleta"
  | "pending"
  | "free"
  | "expired"
  | "pausada";
type Visibility =
  | "online_indexable"
  | "online_not_indexable"
  | "offline"
  | "draft_only";

function computeStatus(lawyer: Lawyer): Status {
  if (lawyer.planStatus === "pending") return "pending";
  if (lawyer.planStatus === "expired") return "expired";
  if (lawyer.planStatus !== "active") return "free";
  // Pausa voluntária toma precedência (Fase 3 — migration 0006).
  if (lawyer.pageStatus === "paused") return "pausada";
  const hasWhatsapp = Boolean(
    (lawyer.whatsapp && lawyer.whatsapp.trim()) ||
      (lawyer.phone && lawyer.phone.trim())
  );
  const hasArea = lawyer.specialties.length > 0;
  if (!hasWhatsapp || !hasArea) return "incompleta";
  return "publicada";
}

function computeVisibility(status: Status, lawyer: Lawyer): Visibility {
  // Defensive: usa flags do banco se a migration foi aplicada, senão deriva.
  if (lawyer.isPublic === false || status === "pausada") return "offline";
  if (status === "publicada") return "online_indexable";
  if (status === "incompleta") return "draft_only";
  if (status === "pending") return "draft_only";
  return "offline";
}

/**
 * Calcula força/completude da Página Profissional baseado em 11 itens
 * (alinhado com o pedido do produto, F2 — "Força da Página Profissional").
 * Retorna pct (0-100) + lista do que falta.
 */
function computeStrength(lawyer: Lawyer): {
  pct: number;
  total: number;
  done: number;
  next: { label: string; action?: string } | null;
} {
  const checks: Array<{
    ok: boolean;
    label: string;
    action: string;
  }> = [
    {
      ok: !!lawyer.photoUrl,
      label: "Foto profissional",
      action:
        "Adicione uma foto profissional para aumentar a confiança do visitante."
    },
    {
      ok: !!lawyer.bio && lawyer.bio.length >= 300,
      label: "Bio com 300+ caracteres",
      action: "Escreva uma bio com pelo menos 300 caracteres."
    },
    {
      ok: !!lawyer.whatsapp || !!lawyer.phone,
      label: "WhatsApp ou telefone",
      action: "Cadastre seu WhatsApp ou telefone profissional."
    },
    {
      ok: !!lawyer.cityName && !!lawyer.uf,
      label: "Cidade principal",
      action: "Confirme sua cidade principal de atuação."
    },
    {
      ok: lawyer.specialties.length >= 2,
      label: "Pelo menos 2 áreas de atuação",
      action: "Adicione pelo menos 2 áreas de atuação."
    },
    {
      ok: !!lawyer.officeHours,
      label: "Horários de atendimento",
      action: "Cadastre seus horários de atendimento."
    },
    {
      ok: !!lawyer.address,
      label: "Endereço profissional",
      action: "Adicione seu endereço profissional."
    },
    {
      ok: (lawyer.extraCities || []).length > 0,
      label: "Cidades adicionais",
      action:
        "Indique cidades adicionais onde você atende — multiplica seu alcance."
    },
    {
      ok: !!(lawyer.website || lawyer.instagram || lawyer.linkedin),
      label: "Link de site, Instagram ou LinkedIn",
      action:
        "Conecte ao menos uma rede social (Instagram ou LinkedIn) ou seu site."
    },
    {
      ok: lawyer.verifiedOab === true,
      label: "OAB verificada pelo admin",
      action:
        "A verificação de OAB é feita pelo nosso time — entre em contato pelo suporte."
    },
    {
      ok: !!lawyer.email,
      label: "E-mail profissional",
      action: "Confirme seu e-mail profissional."
    }
  ];

  const done = checks.filter((c) => c.ok).length;
  const pct = Math.round((done / checks.length) * 100);
  const next = checks.find((c) => !c.ok) || null;
  return {
    pct,
    total: checks.length,
    done,
    next: next ? { label: next.label, action: next.action } : null
  };
}

function visibilityLabel(v: Visibility): { text: string; tone: string } {
  if (v === "online_indexable")
    return { text: "Online e indexável", tone: "text-emerald-700 bg-emerald-50 border-emerald-200" };
  if (v === "online_not_indexable")
    return { text: "Online, mas não indexável", tone: "text-amber-800 bg-amber-50 border-amber-200" };
  if (v === "draft_only")
    return { text: "Disponível apenas como rascunho", tone: "text-brand-deep bg-brand-line/30 border-brand-line" };
  return { text: "Fora do ar", tone: "text-brand-ink/60 bg-brand-bg border-brand-line" };
}

function statusLabel(s: Status): { text: string; tone: string } {
  if (s === "publicada")
    return { text: "Publicada", tone: "bg-emerald-100 text-emerald-800 border-emerald-200" };
  if (s === "pausada")
    return { text: "Pausada", tone: "bg-slate-200 text-slate-800 border-slate-300" };
  if (s === "incompleta")
    return { text: "Incompleta", tone: "bg-amber-100 text-amber-900 border-amber-300" };
  if (s === "pending")
    return { text: "Em revisão", tone: "bg-blue-100 text-blue-800 border-blue-200" };
  return { text: "Não configurada", tone: "bg-brand-line/40 text-brand-ink/70 border-brand-line" };
}

function timeAgoBR(iso?: string): string {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "—";
  const diffMs = Date.now() - then;
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h} hora${h > 1 ? "s" : ""}`;
  const d = Math.floor(h / 24);
  if (d < 30) return `há ${d} dia${d > 1 ? "s" : ""}`;
  const months = Math.floor(d / 30);
  if (months < 12) return `há ${months} mês${months > 1 ? "es" : ""}`;
  return new Date(iso).toLocaleDateString("pt-BR");
}

export function MyProfessionalPageCard({ lawyer }: { lawyer: Lawyer }) {
  const status = computeStatus(lawyer);
  const visibility = computeVisibility(status, lawyer);
  const strength = computeStrength(lawyer);
  const publicUrl = `${SITE.url}/advogado/${lawyer.slug}`;
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [actioning, setActioning] = useState<"pause" | "republish" | null>(null);

  const callPageAction = async (action: "pause" | "republish") => {
    if (actioning) return;
    if (action === "pause") {
      const ok = window.confirm(
        "Confirma pausar sua Página Profissional?\n\n" +
          "Enquanto pausada, ela sai do diretório público, não aparece em buscas e mostra uma mensagem neutra para quem acessar o link direto. Você pode republicar a qualquer momento."
      );
      if (!ok) return;
    }
    setActioning(action);
    try {
      const res = await fetch("/api/painel/page-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) {
        const msg =
          (data as { error?: string }).error ||
          "Não foi possível atualizar agora. Tente novamente.";
        window.alert(msg);
      } else {
        // Recarrega o painel pra ler o novo estado do servidor sem
        // ter que sincronizar manualmente todo o lawyer.
        window.location.reload();
      }
    } catch (err) {
      console.error("[MyProfessionalPageCard] page-action failed", err);
      window.alert("Erro de conexão. Tente novamente em alguns segundos.");
    } finally {
      setActioning(null);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement("textarea");
      el.value = publicUrl;
      document.body.appendChild(el);
      el.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } finally {
        document.body.removeChild(el);
      }
    }
  };

  // ---- variante: PUBLICADA / PAUSADA / INCOMPLETA / PENDING (premium ativo) ----
  if (
    status === "publicada" ||
    status === "incompleta" ||
    status === "pending" ||
    status === "pausada"
  ) {
    const stLabel = statusLabel(status);
    const visLabel = visibilityLabel(visibility);
    const isPublishable = status === "publicada";
    const isPaused = status === "pausada";

    return (
      <>
        <section className="rounded-2xl border-2 border-brand-accent bg-gradient-to-br from-brand-accent2/10 via-white to-brand-accent/10 p-5 md:p-6 shadow-card relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-px left-4 right-4 h-1 bg-gradient-to-r from-brand-accent2 via-brand-accent to-brand-accent2 rounded-b"
          />

          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-accent flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-brand-ink" aria-hidden />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-lg md:text-xl font-bold text-brand-ink">
                Central da Página Profissional
              </h2>
              <p className="text-xs md:text-sm text-brand-ink/65 mt-0.5">
                Controle e acompanhe sua presença pública no AdvAqui.
              </p>
            </div>
          </div>

          {/* Status + Visibilidade + Atualizações */}
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 text-xs">
            <div className="rounded-lg bg-white border border-brand-line p-3">
              <dt className="text-brand-ink/55 uppercase tracking-wide font-semibold mb-1">
                Status
              </dt>
              <dd>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${stLabel.tone}`}
                >
                  {isPublishable && <CheckCircle2 className="w-3 h-3" aria-hidden />}
                  {status === "incompleta" && (
                    <AlertCircle className="w-3 h-3" aria-hidden />
                  )}
                  {status === "pending" && (
                    <Clock className="w-3 h-3" aria-hidden />
                  )}
                  {isPaused && <Pause className="w-3 h-3" aria-hidden />}
                  {stLabel.text}
                </span>
              </dd>
            </div>
            <div className="rounded-lg bg-white border border-brand-line p-3">
              <dt className="text-brand-ink/55 uppercase tracking-wide font-semibold mb-1">
                Visibilidade
              </dt>
              <dd>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${visLabel.tone}`}
                >
                  {visibility === "online_indexable" ? (
                    <Globe className="w-3 h-3" aria-hidden />
                  ) : (
                    <EyeOff className="w-3 h-3" aria-hidden />
                  )}
                  {visLabel.text}
                </span>
              </dd>
            </div>
            <div className="rounded-lg bg-white border border-brand-line p-3">
              <dt className="text-brand-ink/55 uppercase tracking-wide font-semibold mb-1">
                Última atualização
              </dt>
              <dd className="text-brand-ink/85">{timeAgoBR(lawyer.updatedAt)}</dd>
            </div>
            <div className="rounded-lg bg-white border border-brand-line p-3">
              <dt className="text-brand-ink/55 uppercase tracking-wide font-semibold mb-1">
                Última publicação
              </dt>
              <dd className="text-brand-ink/85">
                {isPublishable ? timeAgoBR(lawyer.updatedAt) : "—"}
              </dd>
            </div>
          </dl>

          {/* URL pública — só mostra se está no ar */}
          {(isPublishable || isPaused) && (
            <div className="rounded-xl bg-white border border-brand-line px-3 py-2.5 mb-3 break-all text-sm font-mono text-brand-deep">
              {publicUrl}
            </div>
          )}

          {/* Aviso quando incompleta */}
          {status === "incompleta" && (
            <p className="text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
              Complete os dados obrigatórios para publicar sua página
              (WhatsApp ou telefone + ao menos uma área de atuação).
            </p>
          )}

          {/* Aviso quando pending */}
          {status === "pending" && (
            <p className="text-sm text-blue-900 bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
              Pagamento em análise — sua página será publicada em até 48h
              após confirmação.
            </p>
          )}

          {/* Aviso quando pausada */}
          {isPaused && (
            <p className="text-sm text-slate-800 bg-slate-100 border border-slate-200 rounded-lg p-3 mb-3">
              Sua Página Profissional está <strong>pausada</strong>. Ela não
              aparece em buscas nem no diretório público. Quem acessar o link
              direto vê uma mensagem neutra. Republique a qualquer momento pra
              voltar ao ar.
            </p>
          )}

          {/* Completude */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-brand-ink">
                Força da Página Profissional
              </span>
              <span className="font-bold text-brand-deep">
                {strength.pct}% completa
              </span>
            </div>
            <div className="h-2 bg-brand-line rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  strength.pct >= 80
                    ? "bg-emerald-500"
                    : strength.pct >= 50
                    ? "bg-brand-accent"
                    : "bg-amber-500"
                }`}
                style={{ width: `${strength.pct}%` }}
              />
            </div>
            <p className="text-xs text-brand-ink/55 mt-1">
              {strength.done} de {strength.total} itens preenchidos
            </p>
          </div>

          {/* Próxima ação recomendada */}
          {strength.next && (
            <div className="rounded-xl bg-brand-deep/5 border border-brand-deep/15 p-3 mb-4">
              <p className="text-xs uppercase tracking-wider text-brand-deep font-bold mb-1">
                Próxima ação recomendada
              </p>
              <p className="text-sm text-brand-ink/85">{strength.next.action}</p>
              <a
                href="#meu-perfil"
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-deep hover:text-brand-accent2"
              >
                Ir agora →
              </a>
            </div>
          )}

          {/* Botões de ação */}
          <div className="flex flex-wrap gap-2">
            {isPublishable && (
              <Link
                href={`/advogado/${lawyer.slug}`}
                target="_blank"
                className="btn-accent text-sm inline-flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" aria-hidden />
                Ver página pública
              </Link>
            )}
            {(isPaused || status === "incompleta") && (
              <Link
                href={`/advogado/${lawyer.slug}?preview=1`}
                target="_blank"
                className="btn-ghost border border-brand-line text-sm inline-flex items-center gap-2"
              >
                <Eye className="w-4 h-4" aria-hidden />
                Ver prévia privada
              </Link>
            )}
            <a
              href="#meu-perfil"
              className="btn-ghost border border-brand-line text-sm inline-flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" aria-hidden />
              Editar página
            </a>
            {(isPublishable || isPaused) && (
              <button
                type="button"
                onClick={copyLink}
                className="btn-ghost border border-brand-line text-sm inline-flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" aria-hidden />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" aria-hidden />
                    Copiar link
                  </>
                )}
              </button>
            )}
            {(isPublishable || isPaused) && (
              <button
                type="button"
                onClick={() => setShowQr(true)}
                className="btn-ghost border border-brand-line text-sm inline-flex items-center gap-2"
              >
                <QrCode className="w-4 h-4" aria-hidden />
                Gerar QR Code
              </button>
            )}

            {/* Pausar / Republicar */}
            {isPublishable && (
              <button
                type="button"
                onClick={() => callPageAction("pause")}
                disabled={actioning !== null}
                className="btn-ghost border border-slate-300 text-slate-800 text-sm inline-flex items-center gap-2 ml-auto disabled:opacity-50"
              >
                <Pause className="w-4 h-4" aria-hidden />
                {actioning === "pause" ? "Pausando..." : "Pausar página"}
              </button>
            )}
            {isPaused && (
              <button
                type="button"
                onClick={() => callPageAction("republish")}
                disabled={actioning !== null}
                className="text-sm inline-flex items-center gap-2 ml-auto px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-500 transition disabled:opacity-50"
              >
                <Play className="w-4 h-4" aria-hidden />
                {actioning === "republish" ? "Republicando..." : "Republicar página"}
              </button>
            )}
          </div>

        </section>

        {showQr && (
          <QrModal url={publicUrl} lawyer={lawyer} onClose={() => setShowQr(false)} />
        )}
      </>
    );
  }

  // ---- variante: free/expired → upsell ----
  return (
    <section className="rounded-2xl border-2 border-brand-accent bg-gradient-to-br from-brand-deep to-brand-ink text-white p-5 md:p-6 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute -top-1/3 -right-1/4 w-1/2 aspect-square rounded-full bg-brand-accent/20 blur-2xl"
      />
      <div className="relative">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-brand-accent text-brand-ink mb-3">
          <Sparkles className="w-3 h-3" aria-hidden />
          Recurso Premium
        </div>
        <h2 className="font-display text-xl md:text-2xl font-bold leading-tight">
          Tenha sua Página Profissional no AdvAqui
        </h2>
        <p className="text-sm text-brand-bg/85 mt-2 leading-relaxed">
          Ative o plano Premium para liberar uma página individual, pública,
          indexável e compartilhável com suas informações profissionais. Link
          próprio em <strong>/advogado/{lawyer.slug}</strong>, pronto pra usar
          em WhatsApp, Instagram, assinatura de e-mail, cartão digital e QR Code.
        </p>
        <ul className="text-sm text-brand-bg/90 mt-3 space-y-1.5">
          <li className="flex items-start gap-2">
            <span className="text-brand-accent2 mt-0.5">✓</span>
            Link próprio no AdvAqui
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-accent2 mt-0.5">✓</span>
            Bio profissional + áreas com descrição
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-accent2 mt-0.5">✓</span>
            Botão de WhatsApp + QR Code
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-accent2 mt-0.5">✓</span>
            Destaque nas páginas locais da sua cidade
          </li>
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/painel/pagamento"
            className="btn-accent text-sm inline-flex items-center gap-2"
          >
            Ativar Premium
          </Link>
          <Link
            href={`/advogado/${lawyer.slug}`}
            target="_blank"
            className="btn-ghost text-white border border-white/20 hover:bg-white/10 text-sm inline-flex items-center gap-2"
          >
            Ver minha página atual
          </Link>
        </div>
      </div>
    </section>
  );
}

/**
 * Modal com o QR Code da Página Profissional + Cartão digital
 * (texto de apresentação pronto pra copiar e usar em WhatsApp, e-mail etc.).
 */
function QrModal({
  url,
  lawyer,
  onClose
}: {
  url: string;
  lawyer: Lawyer;
  onClose: () => void;
}) {
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=10&data=${encodeURIComponent(url)}`;
  const downloadName = `qrcode-${url.split("/").pop() || "perfil"}.png`;
  const [copiedCard, setCopiedCard] = useState(false);

  const cardText = `Olá, este é meu perfil profissional no AdvAqui, com minhas áreas de atuação, região de atendimento e canais de contato: ${url}`;

  const copyCardText = async () => {
    try {
      await navigator.clipboard.writeText(cardText);
      setCopiedCard(true);
      setTimeout(() => setCopiedCard(false), 2000);
    } catch {
      // Fallback
      const el = document.createElement("textarea");
      el.value = cardText;
      document.body.appendChild(el);
      el.select();
      try {
        document.execCommand("copy");
        setCopiedCard(true);
        setTimeout(() => setCopiedCard(false), 2000);
      } finally {
        document.body.removeChild(el);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="QR Code da Página Profissional"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-cardHover p-5 md:p-6 max-w-sm w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Fechar"
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full hover:bg-brand-line/40 flex items-center justify-center"
        >
          <X className="w-4 h-4 text-brand-ink/60" aria-hidden />
        </button>
        <h3 className="font-display text-lg font-bold text-brand-ink mb-1">
          Cartão digital
        </h3>
        <p className="text-xs text-brand-ink/65 mb-4">
          {lawyer.name} · OAB/{lawyer.oabUf} {lawyer.oab} · {lawyer.cityName}/{lawyer.uf}
        </p>
        <div className="rounded-xl border-2 border-brand-line bg-white p-3 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrSrc}
            alt="QR Code da Página Profissional"
            className="w-full h-auto max-w-[300px]"
            loading="eager"
          />
        </div>
        <a
          href={qrSrc}
          download={downloadName}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-accent w-full justify-center mt-4 text-sm"
        >
          Baixar QR Code (PNG)
        </a>
        <button
          type="button"
          onClick={copyCardText}
          className="btn-ghost border border-brand-line w-full justify-center mt-2 text-sm inline-flex items-center gap-2"
        >
          {copiedCard ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" aria-hidden />
              Texto copiado
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" aria-hidden />
              Copiar texto de apresentação
            </>
          )}
        </button>
        <p className="text-[10px] text-brand-ink/50 mt-3 text-center break-all">
          {url}
        </p>
      </div>
    </div>
  );
}
