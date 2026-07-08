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

  // Fluxo AUTOMÁTICO (Asaas): cobrança PIX confirmada via webhook, sem análise
  // manual. O fluxo antigo (chave estática + "Já paguei") vira alternativa.
  const [pixAuto, setPixAuto] = useState<{
    paymentId: string;
    copiaECola: string;
    qrCodeBase64: string;
  } | null>(null);
  const [gerandoPix, setGerandoPix] = useState(false);
  const [precisaCpf, setPrecisaCpf] = useState(false);
  const [cpfInput, setCpfInput] = useState("");
  const [copiado, setCopiado] = useState(false);
  const [ativado, setAtivado] = useState(false);

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

  // Enquanto houver cobrança automática aberta, sonda o perfil: quando o
  // webhook do Asaas ativar o plano, a tela vira "Plano ativo" sozinha.
  useEffect(() => {
    if (!pixAuto || ativado) return;
    const timer = window.setInterval(async () => {
      try {
        const data = await requestJson<ProfileResponse>("/api/painel/profile");
        setUser(data.lawyer);
        if (data.lawyer.planStatus === "active") {
          setAtivado(true);
          toast("Pagamento confirmado — seu premium está ativo!");
        }
      } catch {
        /* rede oscilou; a próxima sonda tenta de novo */
      }
    }, 6000);
    return () => window.clearInterval(timer);
  }, [pixAuto, ativado]);

  const gerarPixAutomatico = async () => {
    if (gerandoPix) return;
    setGerandoPix(true);
    try {
      const data = await requestJson<{
        ok: true;
        paymentId: string;
        copiaECola: string;
        qrCodeBase64: string;
        alreadyActive?: boolean;
      }>(
        "/api/painel/payment-pix",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cpfInput ? { cpf: cpfInput } : {})
        },
        15000
      );
      if (data.alreadyActive) {
        setAtivado(true);
        return;
      }
      setPrecisaCpf(false);
      setPixAuto({
        paymentId: data.paymentId,
        copiaECola: data.copiaECola,
        qrCodeBase64: data.qrCodeBase64
      });
    } catch (err) {
      if (err instanceof PaymentApiError && err.status === 400) {
        setPrecisaCpf(true);
        toast(err.message, "error");
      } else if (err instanceof PaymentApiError && err.status === 503) {
        toast("Pagamento automático indisponível agora — use a chave PIX manual.", "error");
      } else {
        toast(err instanceof Error ? err.message : "Erro ao gerar o PIX.", "error");
      }
    } finally {
      setGerandoPix(false);
    }
  };

  const copiarCodigo = async () => {
    if (!pixAuto) return;
    try {
      await navigator.clipboard.writeText(pixAuto.copiaECola);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2000);
    } catch {
      toast("Não foi possível copiar. Selecione o código manualmente.", "error");
    }
  };

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

  if (ativado) {
    return (
      <div className="container-narrow max-w-lg py-16">
        <div className="rounded-3xl border border-brand-line bg-white overflow-hidden text-center">
          <div
            className="px-6 pt-10 pb-8"
            style={{ background: "linear-gradient(135deg,#0F1B2D,#1B2D49)" }}
          >
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400/40 flex items-center justify-center mx-auto mb-4">
              <Crown className="w-10 h-10 text-amber-400" aria-hidden />
            </div>
            <h1 className="font-display text-2xl font-bold text-white mb-2">
              Premium ativo!
            </h1>
            <p className="text-sm text-white/70 max-w-sm mx-auto">
              Pagamento confirmado automaticamente. Seu destaque já está valendo por{" "}
              <strong className="text-white">{PLAN.cycleDays} dias</strong> — nada mais
              a fazer.
            </p>
          </div>
          <div className="px-6 py-6">
            <Link href="/painel" className="btn-primary w-full">
              Voltar ao painel
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            <h2 className="font-display text-lg font-bold text-brand-ink mb-1 text-center">
              Pagamento via Pix
            </h2>
            <p className="text-xs text-emerald-700 font-medium text-center mb-4">
              <Zap className="w-3.5 h-3.5 inline -mt-0.5 mr-1" aria-hidden />
              Confirmação automática: pagou, ativou. Sem espera.
            </p>

            {!pixAuto ? (
              <div className="space-y-3">
                {precisaCpf && (
                  <div>
                    <label
                      htmlFor="cpf-pagamento"
                      className="block text-xs font-semibold text-brand-ink/70 mb-1"
                    >
                      Seu CPF (obrigatório para o PIX automático)
                    </label>
                    <input
                      id="cpf-pagamento"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="000.000.000-00"
                      value={cpfInput}
                      onChange={(e) => setCpfInput(e.target.value)}
                      className="w-full rounded-xl border border-brand-line px-4 py-3 text-sm"
                    />
                  </div>
                )}
                <button
                  onClick={gerarPixAutomatico}
                  disabled={gerandoPix}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white text-sm transition shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #059669, #047857)" }}
                >
                  {gerandoPix ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Gerando PIX...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" aria-hidden />
                      Gerar PIX com ativação automática
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="text-center space-y-4">
                {pixAuto.qrCodeBase64 && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`data:image/png;base64,${pixAuto.qrCodeBase64}`}
                    alt="QR Code PIX do plano premium"
                    width={210}
                    height={210}
                    className="mx-auto rounded-2xl border border-brand-line bg-white p-2"
                  />
                )}
                <div className="flex items-stretch gap-2">
                  <code className="flex-1 overflow-x-auto rounded-xl border border-brand-line bg-brand-line/20 px-3 py-2 text-[11px] text-brand-ink text-left">
                    {pixAuto.copiaECola}
                  </code>
                  <button
                    onClick={copiarCodigo}
                    className="btn-primary px-4"
                    aria-label="Copiar código PIX"
                  >
                    {copiado ? "Copiado" : "Copiar"}
                  </button>
                </div>
                <p className="text-xs text-brand-ink/60 leading-relaxed inline-flex items-center gap-1.5">
                  <span
                    aria-hidden
                    className="w-3.5 h-3.5 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin inline-block"
                  />
                  Aguardando o banco confirmar... esta página ativa o seu premium
                  sozinha assim que o PIX cair.
                </p>
              </div>
            )}

            <details className="mt-6 border-t border-brand-line/60 pt-4">
              <summary className="text-xs text-brand-ink/50 cursor-pointer text-center">
                Prefere pagar pela chave PIX manual? (ativação em até{" "}
                {PLAN.activationHours}h)
              </summary>
              <div className="mt-4">
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
                  Ao clicar, você confirma que enviou o Pix para a chave acima. Nossa
                  equipe valida manualmente e ativa o seu destaque em até{" "}
                  {PLAN.activationHours} horas.
                </p>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
