"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X, Minus, Send, ArrowUpRight, BadgeCheck } from "lucide-react";
import { SPECIALTY_SLUGS } from "@/lib/data/specialties";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  ts: number;
}

interface TriageResult {
  area?: string;
  cidade?: string;
  uf?: string;
  urgencia?: string;
  resumo?: string;
  nome?: string;
  telefone?: string;
  /** Link final já validado no servidor contra especialidades e cidades reais */
  ctaUrl?: string;
  ctaLabel?: string;
}

interface LeadTranscriptItem {
  role: "user" | "assistant";
  content: string;
  ts: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const STORAGE_KEY = "advaqui_triage_chat";
const SESSION_KEY = "advaqui_triage_session";
const TEASER_KEY = "advaqui_triage_teaser_dismissed";
const PENDING_LEAD_KEY = "advaqui_lead_pending";

const UF_SLUGS = new Set([
  "ac", "al", "ap", "am", "ba", "ce", "df", "es", "go", "ma", "mt", "ms", "mg",
  "pa", "pb", "pr", "pe", "pi", "rj", "rn", "rs", "ro", "rr", "sc", "sp", "se", "to"
]);

/** Respostas rápidas do primeiro passo — digitar do zero é a maior fricção
 *  do funil; um toque numa situação comum dispara a conversa na hora. */
const QUICK_OPTIONS = [
  "Fui demitido(a)",
  "Divórcio ou pensão",
  "Multa ou CNH",
  "INSS negou meu benefício",
  "Comprei e deu problema",
  "Outro assunto"
];

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getSessionId(): string {
  if (typeof window === "undefined") return generateId();
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = generateId();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function saveChat(messages: ChatMessage[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // sessionStorage full or unavailable — silent
  }
}

function loadChat(): ChatMessage[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // corrupted — start fresh
  }
  return [];
}

/** Normalize area slug for URL: "Direito Trabalhista" → "trabalhista" */
function areaToSlug(area: string): string {
  const map: Record<string, string> = {
    trabalhista: "trabalhista",
    família: "familia",
    familia: "familia",
    criminal: "criminal",
    penal: "criminal",
    previdenciário: "previdenciario",
    previdenciario: "previdenciario",
    consumidor: "consumidor",
    imobiliário: "imobiliario",
    imobiliario: "imobiliario",
    tributário: "tributario",
    tributario: "tributario",
    empresarial: "empresarial",
    trânsito: "transito",
    transito: "transito",
    saúde: "saude",
    saude: "saude",
    ambiental: "ambiental",
    administrativo: "administrativo",
    civil: "civil",
    digital: "digital",
    eleitoral: "eleitoral",
    internacional: "internacional",
    contratual: "contratual",
    inventário: "inventario",
    inventario: "inventario",
  };
  const normalized = area.toLowerCase().replace(/^direito\s+/i, "").trim();
  return map[normalized] || normalized.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-");
}

function cidadeToSlug(cidade: string): string {
  return cidade
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Oi! Eu sou a Marina 👋 Me conta o que aconteceu — ou toque numa opção aí embaixo — que eu encontro o advogado certo pra você. É grátis e leva 1 minuto. (A conversa fica registrada só pra te conectar ao advogado.)",
  ts: Date.now(),
};

/**
 * Envia o lead com até 2 novas tentativas (backoff 1s/3s) em falha de rede,
 * 429 ou 5xx. Se todas falharem, guarda o payload em sessionStorage para
 * reenviar no próximo mount do componente — o lead não se perde à toa.
 */
async function postLeadWithRetry(payload: Record<string, unknown>): Promise<void> {
  const delays = [1000, 3000];
  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      const res = await fetch("/api/leads/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        try {
          sessionStorage.removeItem(PENDING_LEAD_KEY);
        } catch {
          // ignora
        }
        return;
      }
      // 4xx (exceto 429) = payload rejeitado pelo servidor — repetir não resolve.
      if (res.status !== 429 && res.status < 500) return;
    } catch {
      // Falha de rede — tenta de novo com backoff.
    }
    if (attempt < delays.length) {
      await new Promise((resolve) => setTimeout(resolve, delays[attempt]));
    }
  }
  try {
    sessionStorage.setItem(PENDING_LEAD_KEY, JSON.stringify(payload));
  } catch {
    // sessionStorage cheio/indisponível — sem o que fazer
  }
}

/** Avatar da Marina — círculo âmbar com M, usado no header e nas bolhas. */
function MarinaAvatar({ size = 32 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="flex items-center justify-center rounded-full font-display font-bold shrink-0 select-none"
      style={{
        width: size,
        height: size,
        background: "#C8A24A",
        color: "#0F1B2D",
        fontSize: size * 0.5
      }}
    >
      M
    </span>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function TriagemChat() {
  const pathname = usePathname();

  // Hide on /painel/* routes, /lp/*, /multas, /recurso/*
  const hidden =
    pathname?.startsWith("/painel") ||
    pathname?.startsWith("/lp") ||
    pathname?.startsWith("/multas") ||
    pathname?.startsWith("/recurso") ||
    // Páginas de ferramenta PDF individuais: o botão/balão flutuante cobria os
    // controles e o botão de processar no mobile, travando o uso. O hub
    // (/ferramentas/pdf) e o resto do site mantêm o chat.
    pathname?.includes("/ferramentas/pdf/");

  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [triage, setTriage] = useState<TriageResult | null>(null);
  const [unread, setUnread] = useState(0);
  const [mounted, setMounted] = useState(false);
  // Balão-convite: a maioria dos visitantes nunca clica no botão do chat.
  // Um convite discreto após alguns segundos aumenta a captação de leads
  // sem ser intrusivo (dispensável e aparece 1x por sessão).
  const [teaser, setTeaser] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Hydrate from sessionStorage
  useEffect(() => {
    setMounted(true);
    const saved = loadChat();
    if (saved.length > 0) {
      setMessages(saved);
    }
    // Reenvia lead que ficou pendente por falha de rede/servidor.
    try {
      const raw = sessionStorage.getItem(PENDING_LEAD_KEY);
      if (raw) {
        const pending = JSON.parse(raw) as Record<string, unknown>;
        sessionStorage.removeItem(PENDING_LEAD_KEY);
        void postLeadWithRetry(pending);
      }
    } catch {
      // payload corrompido — descarta
    }
  }, []);

  // Convite automático: aparece logo ao abrir o site (~1,5s, após a hidratação)
  // se o visitante ainda não abriu o chat nesta sessão e não o dispensou antes.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem(TEASER_KEY)) return;
    } catch {
      return;
    }
    const t = setTimeout(() => setTeaser(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const dismissTeaser = useCallback(() => {
    setTeaser(false);
    try {
      sessionStorage.setItem(TEASER_KEY, "1");
    } catch {
      // ignora
    }
  }, []);

  // Persist messages
  useEffect(() => {
    if (mounted && messages.length > 0) {
      saveChat(messages);
    }
  }, [messages, mounted]);

  // Auto-scroll — rola SÓ o container de mensagens. (scrollIntoView rolava
  // também a página atrás do chat no desktop — a tela "fugia" ao digitar.)
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading, triage]);

  // Focus input when opening
  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, minimized]);

  const handleOpen = useCallback(() => {
    setOpen(true);
    setMinimized(false);
    setUnread(0);
    setTeaser(false);
    try {
      sessionStorage.setItem(TEASER_KEY, "1");
    } catch {
      // ignora
    }
    if (messages.length === 0) {
      setMessages([{ ...WELCOME_MESSAGE, ts: Date.now() }]);
    }
  }, [messages.length]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setMinimized(false);
  }, []);

  const handleMinimize = useCallback(() => {
    setMinimized(true);
  }, []);

  const handleRestore = useCallback(() => {
    setMinimized(false);
    setUnread(0);
  }, []);

  /** Ajusta a altura do textarea ao conteúdo (até ~5 linhas). */
  const autoGrow = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, []);

  // Send message — aceita texto direto (respostas rápidas) ou usa o input.
  const sendMessage = useCallback(
    async (forcedText?: string) => {
      const text = (forcedText ?? input).trim();
      if (!text || loading) return;

      const userMsg: ChatMessage = {
        id: generateId(),
        role: "user",
        content: text,
        ts: Date.now(),
      };

      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setInput("");
      if (inputRef.current) inputRef.current.style.height = "auto";
      setLoading(true);

      try {
        const res = await fetch("/api/chat/triage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: getSessionId(),
            messages: updatedMessages
              .filter((m) => m.id !== "welcome")
              .map((m) => ({ role: m.role, content: m.content })),
          }),
        });

        const data = await res.json();

        if (!data.ok) {
          const errMsg: ChatMessage = {
            id: generateId(),
            role: "assistant",
            content:
              data.error || "Desculpe, ocorreu um erro. Tente novamente em instantes.",
            ts: Date.now(),
          };
          setMessages((prev) => [...prev, errMsg]);
        } else {
          const assistantMsg: ChatMessage = {
            id: generateId(),
            role: "assistant",
            content: data.message,
            ts: Date.now(),
          };
          setMessages((prev) => [...prev, assistantMsg]);

          if (data.triage) {
            setTriage(data.triage);
            // Capture lead — inclui a resposta final da assistente no transcript
            captureLead(data.triage, [...updatedMessages, assistantMsg]);
          }

          // Increment unread if minimized
          if (minimized) {
            setUnread((prev) => prev + 1);
          }
        }
      } catch {
        const errMsg: ChatMessage = {
          id: generateId(),
          role: "assistant",
          content: "Falha na conexão. Verifique sua internet e tente novamente.",
          ts: Date.now(),
        };
        setMessages((prev) => [...prev, errMsg]);
      } finally {
        setLoading(false);
        // Mantém o foco no campo após enviar — evita ter que clicar de novo
        // no chat a cada mensagem.
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    },
    [input, loading, messages, minimized]
  );

  // Handle keyboard
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        void sendMessage();
      }
    },
    [sendMessage]
  );

  // Capture lead (assíncrono, com retry e fila de pendência — ver postLeadWithRetry)
  function captureLead(t: TriageResult, msgs: ChatMessage[]) {
    const resumo =
      t.resumo ||
      msgs
        .filter((m) => m.role === "user")
        .map((m) => m.content)
        .join(" | ")
        .slice(0, 2000);

    // Sem nome nem telefone o lead nao e contactavel e o /api/leads/capture
    // rejeita (422). O prompt da IA agora coleta nome + WhatsApp; so gravamos
    // quando ha ao menos um contato — caso contrario o lead seria perdido de
    // qualquer forma e gerar 422 silencioso nao ajuda ninguem.
    const nome = (t.nome || "").trim();
    let telefone = (t.telefone || "").trim();
    // Fallback robusto: se o modelo não colocou o telefone no JSON, tenta
    // extrair um número do que a pessoa digitou. O DDD é obrigatório
    // (10-11 dígitos) — sem isso, "processo 1234 5678" viraria telefone.
    if (!telefone) {
      const userText = msgs
        .filter((m) => m.role === "user")
        .map((m) => m.content)
        .join("  ");
      const match = userText.match(/\(?\d{2}\)?[\s.-]?9?\d{4}[\s.-]?\d{4}/);
      if (match) {
        const digits = match[0].replace(/\D/g, "");
        if (digits.length === 10 || digits.length === 11) telefone = digits;
      }
    }
    if (!nome && !telefone) return;

    // Transcript completo da conversa (sem a mensagem de boas-vindas),
    // incluindo a resposta final da assistente.
    const transcript: LeadTranscriptItem[] = msgs
      .filter((m) => m.id !== "welcome")
      .map((m) => ({ role: m.role, content: m.content.slice(0, 1000), ts: m.ts }));

    void postLeadWithRetry({
      nome,
      telefone,
      email: "",
      cidade: t.cidade || "",
      uf: t.uf || "",
      area_juridica: t.area || "",
      resumo,
      origem: "triagem_chat",
      ferramenta: "chat_ia",
      transcript,
      metadata: {
        urgencia: t.urgencia || "",
        sessionId: getSessionId(),
        messageCount: msgs.length,
      },
    });
  }

  // Build CTA link — SÓ fallback: o link oficial vem validado do servidor em
  // triage.ctaUrl. Aqui validamos a área contra os slugs reais de
  // lib/data/specialties e nunca chutamos UF — melhor um link mais genérico
  // que uma página de erro.
  function buildCtaUrl(t: TriageResult): string {
    const uf = (t.uf || "").trim().toLowerCase();
    const ufValida = UF_SLUGS.has(uf);
    const cidade = cidadeToSlug(t.cidade || "");
    const area = areaToSlug(t.area || "");
    const areaValida = SPECIALTY_SLUGS.includes(area);
    if (ufValida && cidade && areaValida) return `/advogados/${uf}/${cidade}/${area}`;
    if (ufValida && cidade) return `/advogados/${uf}/${cidade}`;
    if (ufValida) return `/advogados/${uf}`;
    return "/advogados";
  }

  if (hidden || !mounted) return null;

  // Mostra as respostas rápidas enquanto a conversa ainda não começou de fato
  const showQuickOptions =
    !loading && !triage && messages.filter((m) => m.role === "user").length === 0;

  // -- Floating button (chat closed) --
  if (!open) {
    return (
      <>
        {teaser && (
          <div className="fixed bottom-24 right-5 z-50 max-w-[270px] animate-in">
            <div className="relative rounded-2xl rounded-br-md bg-brand-ink border border-brand-deep shadow-2xl px-4 py-3 pr-8">
              <button
                onClick={dismissTeaser}
                aria-label="Dispensar convite"
                className="absolute top-1.5 right-1.5 p-1 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <button onClick={handleOpen} className="text-left">
                <p className="text-sm font-bold text-brand-accent leading-snug">
                  Precisa de um advogado?
                </p>
                <p className="text-xs text-white/80 mt-0.5 leading-snug">
                  Me conta seu caso que eu te indico quem pode ajudar — grátis, 1 minuto.
                </p>
              </button>
              <span
                aria-hidden
                className="absolute -bottom-1.5 right-6 w-3 h-3 rotate-45 bg-brand-ink border-b border-r border-brand-deep"
              />
            </div>
          </div>
        )}
        <button
          onClick={handleOpen}
          aria-label="Abrir chat de triagem"
          className="fixed bottom-5 right-5 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-brand-ink text-white shadow-lg hover:bg-brand-deep transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <MessageCircle className="w-6 h-6" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-brand-accent text-brand-ink text-xs font-bold">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
        <style jsx>{`
          .animate-in {
            animation: teaserUp 260ms ease-out;
          }
          @keyframes teaserUp {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </>
    );
  }

  // -- Minimized bar --
  if (minimized) {
    return (
      <button
        onClick={handleRestore}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-brand-ink text-white shadow-lg hover:bg-brand-deep transition-all duration-200"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-sm font-medium">Advogado Online</span>
        {unread > 0 && (
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-accent text-brand-ink text-xs font-bold">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
    );
  }

  // -- Full chat panel --
  return (
    <div
      className="fixed inset-x-0 bottom-0 sm:inset-x-auto sm:bottom-5 sm:right-5 z-50 flex flex-col
        w-full h-dvh max-h-dvh sm:w-[420px] sm:h-[620px] sm:max-h-[85vh]
        sm:rounded-2xl overflow-hidden shadow-2xl
        bg-white border border-brand-line
        animate-in"
      role="dialog"
      aria-modal="true"
      aria-label="Advogado Online — atendimento AdvAqui"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-brand-ink text-white shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="relative">
            <MarinaAvatar size={36} />
            <span
              aria-hidden
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-brand-ink"
            />
          </span>
          <div>
            <p className="text-sm font-semibold leading-tight">Marina — Advogado Online</p>
            <p className="text-[11px] leading-tight inline-flex items-center gap-1" style={{ color: "#CBD5E6" }}>
              <BadgeCheck className="w-3 h-3 text-brand-accent2" aria-hidden />
              Advogados verificados • grátis • responde na hora
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleMinimize}
            aria-label="Minimizar chat"
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={handleClose}
            aria-label="Fechar chat"
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-3 overscroll-contain bg-brand-bg"
        role="log"
        aria-live="polite"
        aria-atomic="false"
        aria-label="Mensagens do chat"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && <MarinaAvatar size={24} />}
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[15px] leading-relaxed ${
                msg.role === "user"
                  ? "bg-brand-ink text-white rounded-br-md"
                  : "bg-white text-brand-ink border border-brand-line rounded-bl-md"
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{msg.content}</p>
            </div>
          </div>
        ))}

        {/* Respostas rápidas — 1 toque em vez de digitar */}
        {showQuickOptions && (
          <div className="flex flex-wrap gap-2 pl-8">
            {QUICK_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => void sendMessage(opt)}
                className="rounded-full border-2 border-brand-line bg-white px-3.5 py-2 text-sm font-medium text-brand-ink transition hover:border-brand-accent hover:bg-brand-accent/10"
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Typing indicator */}
        {loading && (
          <div className="flex items-end gap-2 justify-start">
            <MarinaAvatar size={24} />
            <div className="bg-white border border-brand-line rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-ink/30 animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 rounded-full bg-brand-ink/30 animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 rounded-full bg-brand-ink/30 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        {/* CTA after triage — usa o link validado no servidor quando presente */}
        {triage && (triage.ctaUrl || triage.area) && (
          <div className="flex justify-start pl-8">
            <div className="max-w-[85%] space-y-2">
              <a
                href={triage.ctaUrl || buildCtaUrl(triage)}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-brand-accent text-brand-ink text-sm font-bold hover:brightness-110 transition-all shadow-md"
              >
                <ArrowUpRight className="w-4 h-4" />
                {triage.ctaLabel || "Ver advogados agora"}
              </a>
              <p className="text-[11px] text-brand-ink/50 leading-snug px-1">
                Triagem informativa — não substitui orientação de um advogado.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div
        className="shrink-0 border-t border-brand-line bg-white px-3 py-2.5"
        style={{ paddingBottom: "max(0.625rem, env(safe-area-inset-bottom))" }}
      >
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              autoGrow();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Escreva sua mensagem..."
            rows={1}
            autoComplete="off"
            className="flex-1 resize-none rounded-xl border-2 border-brand-line bg-brand-bg px-3.5 py-2.5
              text-brand-ink placeholder:text-brand-ink/50
              focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent
              overflow-y-auto"
            style={{ minHeight: "44px", maxHeight: "120px", fontSize: "16px" }}
          />
          <button
            onClick={() => void sendMessage()}
            disabled={!input.trim() || loading}
            aria-label="Enviar mensagem"
            className="flex items-center justify-center w-11 h-11 rounded-xl bg-brand-accent text-brand-ink
              hover:bg-brand-accent2 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[10px] text-brand-ink/40 mt-1.5 text-center">
          Informativo — não constitui assessoria jurídica
        </p>
      </div>

      {/* Inline animation styles */}
      <style jsx>{`
        .animate-in {
          animation: slideUp 200ms ease-out;
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
