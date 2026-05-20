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
  X
} from "lucide-react";
import { SITE } from "@/lib/config";
import type { Lawyer } from "@/lib/data/lawyer-mapper";

/**
 * Card "Minha Página Profissional" — exibido no topo do painel do advogado.
 *
 * Maio/2026 — Fase 1 (MVP) do recurso "Página Profissional AdvAqui".
 *
 * Comportamento por status:
 *   • Premium ATIVO + dados obrigatórios completos → mostra "Publicada":
 *     URL, Acessar, Copiar link, Gerar QR Code.
 *   • Premium ATIVO + dados incompletos (sem WhatsApp/área/bio) → mostra
 *     "Incompleta": link para Editar perfil.
 *   • Premium PENDING → mostra "Em análise" + link painel/pagamento.
 *   • Plano FREE/EXPIRED → mostra card de upsell pra ativar Premium.
 *
 * Linguagem sóbria conforme Provimento OAB 205/2021 — sem promessa de
 * resultado nem "contrate agora".
 */

type Status = "publicada" | "incompleta" | "pending" | "free" | "expired";

function computeStatus(lawyer: Lawyer): Status {
  if (lawyer.planStatus === "pending") return "pending";
  if (lawyer.planStatus === "expired") return "expired";
  if (lawyer.planStatus !== "active") return "free";

  // Premium ativo. Checa dados mínimos obrigatórios pra publicar.
  const hasWhatsapp = Boolean(
    (lawyer.whatsapp && lawyer.whatsapp.trim()) ||
      (lawyer.phone && lawyer.phone.trim())
  );
  const hasArea = lawyer.specialties.length > 0;
  if (!hasWhatsapp || !hasArea) return "incompleta";
  return "publicada";
}

export function MyProfessionalPageCard({ lawyer }: { lawyer: Lawyer }) {
  const status = computeStatus(lawyer);
  const publicUrl = `${SITE.url}/advogado/${lawyer.slug}`;
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback antigo
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

  // ---- variante: PUBLICADA ----
  if (status === "publicada") {
    return (
      <>
        <section className="rounded-2xl border-2 border-brand-accent bg-gradient-to-br from-brand-accent2/10 via-white to-brand-accent/10 p-5 md:p-6 shadow-card relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-px left-4 right-4 h-1 bg-gradient-to-r from-brand-accent2 via-brand-accent to-brand-accent2 rounded-b"
          />
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-brand-accent flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-brand-ink" aria-hidden />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-lg md:text-xl font-bold text-brand-ink">
                Minha Página Profissional
              </h2>
              <p className="text-xs md:text-sm text-brand-ink/70 mt-0.5">
                Publicada · pronta pra compartilhar em WhatsApp, Instagram,
                cartão digital, assinatura de e-mail.
              </p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <Check className="w-3 h-3" aria-hidden /> Publicada
            </span>
          </div>

          <div className="rounded-xl bg-white border border-brand-line px-3 py-2.5 mb-3 break-all text-sm font-mono text-brand-deep">
            {publicUrl}
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href={`/advogado/${lawyer.slug}`}
              target="_blank"
              className="btn-accent text-sm inline-flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" aria-hidden />
              Acessar minha Página
            </Link>
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
            <button
              type="button"
              onClick={() => setShowQr(true)}
              className="btn-ghost border border-brand-line text-sm inline-flex items-center gap-2"
            >
              <QrCode className="w-4 h-4" aria-hidden />
              Gerar QR Code
            </button>
          </div>
        </section>

        {showQr && (
          <QrModal url={publicUrl} onClose={() => setShowQr(false)} />
        )}
      </>
    );
  }

  // ---- variante: INCOMPLETA (premium ativo mas falta WhatsApp ou área) ----
  if (status === "incompleta") {
    const faltam: string[] = [];
    if (!lawyer.whatsapp && !lawyer.phone) faltam.push("WhatsApp ou telefone");
    if (lawyer.specialties.length === 0) faltam.push("ao menos uma área de atuação");

    return (
      <section className="rounded-2xl border-2 border-amber-300 bg-amber-50/60 p-5 md:p-6">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-200 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-amber-800" aria-hidden />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-lg md:text-xl font-bold text-amber-950">
              Minha Página Profissional
            </h2>
            <p className="text-xs md:text-sm text-amber-900/85 mt-0.5">
              Sua página ainda não está completa. Complete os dados obrigatórios
              para publicar.
            </p>
          </div>
        </div>
        {faltam.length > 0 && (
          <ul className="text-sm text-amber-950 space-y-1 mb-3 list-disc list-inside">
            {faltam.map((f) => (
              <li key={f}>Falta: {f}</li>
            ))}
          </ul>
        )}
        <a
          href="#meu-perfil"
          className="btn-accent text-sm inline-flex items-center gap-2"
        >
          Configurar Página Profissional
        </a>
      </section>
    );
  }

  // ---- variante: pending (pagamento em análise) ----
  if (status === "pending") {
    return (
      <section className="rounded-2xl border border-brand-line bg-brand-bg/40 p-5">
        <h2 className="font-display text-lg font-bold text-brand-ink mb-1">
          Minha Página Profissional
        </h2>
        <p className="text-sm text-brand-ink/70">
          Pagamento em análise. Sua Página Profissional será liberada após a
          confirmação (em até 48h).
        </p>
      </section>
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
            href="/exemplo-pagina-profissional"
            className="btn-ghost text-white border border-white/20 hover:bg-white/10 text-sm inline-flex items-center gap-2"
          >
            Ver exemplo
          </Link>
        </div>
      </div>
    </section>
  );
}

/**
 * Modal simples com o QR Code da Página Profissional.
 * QR é gerado por um serviço público (api.qrserver.com) — não precisa
 * instalar lib adicional. Funciona offline-first com fallback de imagem
 * pequena se serviço externo cair.
 */
function QrModal({ url, onClose }: { url: string; onClose: () => void }) {
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=10&data=${encodeURIComponent(url)}`;
  const downloadName = `qrcode-${url.split("/").pop() || "perfil"}.png`;

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
          QR Code da sua Página Profissional
        </h3>
        <p className="text-xs text-brand-ink/65 mb-4">
          Imprima em cartões, panfletos ou cole na assinatura — quem escanear
          chega direto na sua página.
        </p>
        <div className="rounded-xl border-2 border-brand-line bg-white p-3 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrSrc}
            alt="QR Code"
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
        <p className="text-[10px] text-brand-ink/50 mt-3 text-center break-all">
          {url}
        </p>
      </div>
    </div>
  );
}
