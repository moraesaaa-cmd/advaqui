"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Crown,
  MapPin,
  Search,
  Shield,
  Sparkles,
  Star,
  Zap
} from "lucide-react";
import { PixDisplay } from "@/components/PixDisplay";
import { PLAN } from "@/lib/config";
import { formatCurrency } from "@/lib/utils/format";
import { toast } from "@/components/Toast";
import type { Lawyer } from "@/lib/data/lawyer-mapper";

type LoadState = "loading" | "ready" | "error" | "unauthorized" | "profile_missing";
type ProfileResponse = { ok: true; lawyer: Lawyer };

class PaymentApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const requestJson = async <T,>(
  url: string,
  init: RequestInit = {},
  timeoutMs = 10000
): Promise<T> => {
  const ctrl = new AbortController();
  const timer = window.setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...init,
      cache: "no-store",
      signal: ctrl.signal
    });
    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      error?: string;
    };

    if (!res.ok || data.ok === false) {
      throw new PaymentApiError(
        res.status,
        data.error || "Não foi possível concluir a operação."
      );
    }

    return data as T;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new PaymentApiError(
        0,
        "O servidor demorou demais para responder. Tente novamente em alguns segundos."
      );
    }
    throw err;
  } finally {
    window.clearTimeout(timer);
  }
};

export default function PagamentoPage() {
  const [user, setUser] = useState<Lawyer | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [loadError, setLoadError] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoadState("loading");
      setLoadError("");
      try {
        const data = await requestJson<ProfileResponse>("/api/painel/profile");
        if (!active) return;
        setUser(data.lawyer);
        setLoadState("ready");
      } catch (err) {
        if (!active) return;
        const message =
          err instanceof Error ? err.message : "Não foi possível carregar o pagamento.";
        setLoadError(message);
        if (err instanceof PaymentApiError && err.status === 401) {
          setLoadState("unauthorized");
        } else if (err instanceof PaymentApiError && err.status === 404) {
          setLoadState("profile_missing");
        } else {
          setLoadState("error");
        }
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  const confirm = async () => {
    if (!user || confirming) return;
    setConfirming(true);
    try {
      const data = await requestJson<ProfileResponse>(
        "/api/painel/payment",
        { method: "POST" },
        12000
      );
      setUser(data.lawyer);
      setConfirmed(true);
      toast("Pagamento sinalizado! Ativação em até 48 horas.");
    } catch (err) {
      console.error("[painel:payment]", err);
      toast(err instanceof Error ? err.message : "Erro ao registrar. Tente novamente.", "error");
    } finally {
      setConfirming(false);
    }
  };

  if (loadState !== "ready" || !user) {
    const isLoading = loadState === "loading";
    const title =
      loadState === "unauthorized"
        ? "Sessão expirada"
        : loadState === "profile_missing"
        ? "Cadastro incompleto"
        : isLoading
        ? "Carregando pagamento"
        : "Não foi possível abrir o pagamento";
    const body =
      loadState === "unauthorized"
        ? "Entre novamente para sinalizar seu Pix."
        : loadState === "profile_missing"
        ? "Não encontramos seu perfil de advogado."
        : isLoading
        ? "Estamos buscando seus dados."
        : loadError || "Tente novamente em alguns segundos.";

    return (
      <div className="container-narrow max-w-lg py-16">
        <div className="card text-center">
          {isLoading ? (
            <div
              aria-hidden
              className="mx-auto mb-4 w-10 h-10 border-4 border-brand-line border-t-brand-deep rounded-full animate-spin"
            />
          ) : (
            <AlertCircle className="w-10 h-10 text-brand-accent2 mx-auto mb-4" aria-hidden />
          )}
          <h1 className="font-display text-xl font-bold text-brand-ink">{title}</h1>
          <p className="text-sm text-brand-ink/70 mt-2">{body}</p>
          {!isLoading && (
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Link
                href={loadState === "unauthorized" ? "/login" : "/painel"}
                className="btn-primary"
              >
                {loadState === "unauthorized" ? "Entrar novamente" : "Voltar ao painel"}
              </Link>
              <Link href="/contato" className="btn-ghost border border-brand-line">
                Falar com suporte
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  const BENEFITS = [
    { icon: Crown, text: "Perfil no topo das buscas da sua cidade" },
    { icon: Shield, text: "Selo 'OAB Verificada' após validação" },
    { icon: Zap, text: "WhatsApp clicável direto no card" },
    { icon: MapPin, text: "Até 10 cidades de atuação" },
    { icon: Sparkles, text: "Ferramentas com IA: petições, recursos, revisor" },
    { icon: Search, text: "Filtro avançado por área nas buscas" },
  ];

  if (confirmed) {
    return (
      <div className="container-narrow max-w-lg py-16">
        <div className="rounded-3xl border border-brand-line bg-white overflow-hidden text-center">
          <div
            className="px-6 pt-10 pb-8"
            style={{ background: "linear-gradient(135deg,#0F1B2D,#1B2D49)" }}
          >
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400/40 flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-emerald-400" aria-hidden />
            </div>
            <h1 className="font-display text-2xl font-bold text-white mb-2">
              Pagamento sinalizado
            </h1>
            <p className="text-sm text-white/70 max-w-sm mx-auto">
              Nossa equipe vai validar o Pix e ativar seu plano premium em
              até <strong className="text-white">48 horas</strong>.
            </p>
          </div>
          <div className="px-6 py-6">
            <div className="flex items-center justify-between gap-2 mb-6">
              {[
                { n: "1", label: "Pix enviado", done: true },
                { n: "2", label: "Em análise", done: false },
                { n: "3", label: "Plano ativo", done: false }
              ].map((step) => (
                <div key={step.n} className="flex-1 text-center">
                  <div className={`w-9 h-9 rounded-full mx-auto mb-1.5 flex items-center justify-center text-sm font-bold ${
                    step.done
                      ? "bg-emerald-600 text-white"
                      : "bg-brand-line/60 text-brand-ink/40"
                  }`}>
                    {step.done ? <Check className="w-4 h-4" /> : step.n}
                  </div>
                  <p className={`text-xs font-medium ${step.done ? "text-emerald-700" : "text-brand-ink/50"}`}>
                    {step.label}
                  </p>
                </div>
              ))}
            </div>
            <Link href="/painel" className="btn-primary w-full">
              Voltar ao painel
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-narrow max-w-2xl py-12">
      <Link href="/painel" className="inline-flex items-center gap-1 text-sm text-brand-deep hover:text-brand-accent transition mb-6">
        <ArrowLeft className="w-4 h-4" aria-hidden />
        Voltar ao painel
      </Link>

      <div className="rounded-3xl overflow-hidden border border-brand-line bg-white">
        <div
          className="relative px-6 pt-10 pb-8 text-center overflow-hidden"
          style={{ background: "linear-gradient(135deg,#0F1B2D,#1B2D49)" }}
        >
          <div
            aria-hidden
            className="absolute pointer-events-none"
            style={{
              top: -60,
              right: -20,
              width: 260,
              height: 200,
              background: "radial-gradient(ellipse at center, rgba(200,162,74,0.2), transparent 70%)"
            }}
          />
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20">
              <Crown className="w-8 h-8 text-white" aria-hidden />
            </div>
            <h1 className="font-display text-3xl font-bold text-white mb-1">
              Premium AdvAqui
            </h1>
            <p className="text-sm text-white/60">
              Destaque-se na busca e receba mais clientes
            </p>
            <div className="mt-5 inline-flex items-baseline gap-1">
              <span className="font-display text-4xl font-bold text-white">
                {formatCurrency(PLAN.price)}
              </span>
              <span className="text-white/50 text-sm">/mês</span>
            </div>
            <p className="text-xs text-white/40 mt-1">Sem fidelidade. Cancele quando quiser.</p>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {BENEFITS.map((b) => (
              <div key={b.text} className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-brand-deep/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <b.icon className="w-3.5 h-3.5 text-brand-deep" aria-hidden />
                </div>
                <p className="text-sm text-brand-ink/80 leading-snug">{b.text}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-brand-line/60 pt-6">
            <h2 className="font-display text-lg font-bold text-brand-ink mb-4 text-center">
              Pagamento via Pix
            </h2>
            <PixDisplay txid={`AdvAqui${user.id.slice(0, 6).toUpperCase()}`} />

            <button
              onClick={confirm}
              disabled={confirming}
              className="w-full mt-6 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white text-sm transition shadow-lg shadow-emerald-600/20 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #059669, #047857)" }}
            >
              {confirming ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Registrando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" aria-hidden />
                  Já realizei o pagamento
                </>
              )}
            </button>

            <p className="text-[11px] text-brand-ink/40 mt-4 text-center leading-relaxed">
              Ao clicar, você confirma que enviou o Pix para a chave acima. Nossa equipe valida
              manualmente e ativa o seu destaque em até {PLAN.activationHours} horas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
