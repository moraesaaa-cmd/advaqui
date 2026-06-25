"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertCircle, ArrowLeft, Star } from "lucide-react";
import { PixDisplay } from "@/components/PixDisplay";
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

  if (confirmed) {
    return (
      <div className="container-narrow max-w-lg py-16">
        <div className="card text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-emerald-700" aria-hidden />
          </div>
          <h1 className="font-display text-2xl font-bold text-brand-ink mb-2">
            Pagamento sinalizado
          </h1>
          <p className="text-brand-ink/70 mb-6">
            Recebemos sua sinalização. Nossa equipe vai validar o Pix e ativar seu plano premium em
            até <strong>48 horas</strong>. Você receberá a confirmação aqui no painel.
          </p>
          <div className="text-sm text-brand-ink/60 bg-brand-bg rounded-xl p-3 mb-5">
            <p>1. Pagamento sinalizado</p>
            <p>2. Em análise (até 48h)</p>
            <p>3. Plano ativo</p>
          </div>
          <Link href="/painel" className="btn-primary">
            Voltar ao painel
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-narrow max-w-lg py-12">
      <Link href="/painel" className="inline-flex items-center gap-1 text-sm text-brand-deep mb-4">
        <ArrowLeft className="w-4 h-4" aria-hidden />
        Voltar ao painel
      </Link>

      <header className="text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-brand-accent/20 flex items-center justify-center mx-auto mb-3">
          <Star className="w-7 h-7 text-brand-accent" aria-hidden />
        </div>
        <h1 className="font-display text-2xl font-bold text-brand-ink">Ativar plano premium</h1>
        <p className="text-sm text-brand-ink/60 mt-1">
          Pagamento por Pix. Ativação manual em até 48 horas.
        </p>
      </header>

      <PixDisplay txid={`AdvAqui${user.id.slice(0, 6).toUpperCase()}`} />

      <button
        onClick={confirm}
        disabled={confirming}
        className="btn-primary w-full mt-6 bg-emerald-600 hover:bg-emerald-500"
      >
        {confirming ? "Registrando..." : "Já realizei o pagamento"}
      </button>

      <p className="text-xs text-brand-ink/50 mt-4 text-center leading-relaxed">
        Ao clicar, você confirma que enviou o Pix para a chave acima. Nossa equipe valida
        manualmente e ativa o seu destaque em até 48 horas.
      </p>
    </div>
  );
}
