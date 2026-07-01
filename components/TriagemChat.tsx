"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X, Minus, Send, ArrowUpRight } from "lucide-react";

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
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const STORAGE_KEY = "advaqui_triage_chat";
const SESSION_KEY = "advaqui_triage_session";
const TEASER_KEY = "advaqui_triage_teaser_dismissed";

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

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
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
    "Oi! Sou a Marina, do Advogado Online. Me conta rapidinho o que aconteceu que eu já vejo qual advogado pode te ajudar. 🙂",
  ts: Date.now(),
};

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
    pathname?.startsWith("/recurso");

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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Hydrate from sessionStorage
  useEffect(() => {
    setMounted(true);
    const saved = loadChat();
    if (saved.length > 0) {
      setMessages(saved);
    }
  }, []);

  // Convite automático: mostra o balão após 7s se o visitante ainda não
  // abriu o chat nesta sessão e não o dispensou antes.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem(TEASER_KEY)) return;
    } catch {
      return;
    }
    const t = setTimeout(() => setTeaser(true), 7000);
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

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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

  // Send message
  const sendMessage = useCallback(async () => {
    const text = input.trim();
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
          // Capture lead
          captureLead(data.triage, updatedMessages);
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
  }, [input, loading, messages, minimized]);

  // Handle keyboard
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  // Capture lead (fire-and-forget)
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
    // extrair um número (com DDD) do que a pessoa digitou. Evita perder o lead.
    if (!telefone) {
      const userText = msgs
        .filter((m) => m.role === "user")
        .map((m) => m.content)
        .join("  ");
      const match = userText.match(/(?:\(?\d{2}\)?[\s.-]?)?9?\d{4}[\s.-]?\d{4}/);
      if (match) telefone = match[0].replace(/\D/g, "");
    }
    if (!nome && !telefone) return;

    fetch("/api/leads/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        telefone,
        email: "",
        cidade: t.cidade || "",
        uf: t.uf || "",
        area_juridica: t.area || "",
        resumo,
        origem: "triagem_chat",
        ferramenta: "chat_ia",
        metadata: {
          urgencia: t.urgencia || "",
          sessionId: getSessionId(),
          messageCount: msgs.length,
        },
      }),
    }).catch(() => {
      // fire-and-forget — lead capture failure must not affect UX
    });
  }

  // Build CTA link
  function buildCtaUrl(t: TriageResult): string {
    const uf = (t.uf || "mg").toLowerCase();
    const cidade = cidadeToSlug(t.cidade || "");
    const area = areaToSlug(t.area || "");
    if (cidade && area) return `/advogados/${uf}/${cidade}/${area}`;
    if (cidade) return `/advogados/${uf}/${cidade}`;
    return `/advogados/${uf}`;
  }

  if (hidden || !mounted) return null;

  // -- Floating button (chat closed) --
  if (!open) {
    return (
      <>
        {teaser && (
          <div className="fixed bottom-24 right-5 z-50 max-w-[260px] animate-in">
            <div className="relative rounded-2xl rounded-br-md bg-white border border-brand-line shadow-xl px-4 py-3 pr-8">
              <button
                onClick={dismissTeaser}
                aria-label="Dispensar convite"
                className="absolute top-1.5 right-1.5 p-1 rounded-lg text-brand-ink/40 hover:bg-brand-line/40 hover:text-brand-ink transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleOpen}
                className="text-left"
              >
                <p className="text-sm font-semibold text-brand-ink leading-snug">
                  Precisa de um advogado?
                </p>
                <p className="text-xs text-brand-ink/70 mt-0.5 leading-snug">
                  Faça uma triagem gratuita em 2 minutos e veja quem pode te ajudar.
                </p>
              </button>
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
      className="fixed bottom-0 right-0 sm:bottom-5 sm:right-5 z-50 flex flex-col
        w-full h-full sm:w-[400px] sm:h-[560px] sm:max-h-[80vh]
        sm:rounded-2xl overflow-hidden shadow-2xl
        bg-white border border-brand-line
        animate-in"
      role="dialog"
      aria-label="Chat de triagem jurídica"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-brand-ink text-white shrink-0">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-brand-accent" />
          <div>
            <p className="text-sm font-semibold leading-tight">Advogado Online</p>
            <p className="text-[11px] text-white/60 leading-tight">Marina • Atendimento AdvAqui</p>
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
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 overscroll-contain bg-brand-bg">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-brand-ink text-white rounded-br-md"
                  : "bg-white text-brand-ink border border-brand-line rounded-bl-md"
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{msg.content}</p>
              <p
                className={`text-[10px] mt-1 ${
                  msg.role === "user" ? "text-white/50" : "text-brand-ink/40"
                }`}
              >
                {formatTime(msg.ts)}
              </p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-brand-line rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-ink/30 animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 rounded-full bg-brand-ink/30 animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 rounded-full bg-brand-ink/30 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        {/* CTA after triage */}
        {triage && triage.area && (
          <div className="flex justify-start">
            <div className="max-w-[85%] space-y-2">
              <a
                href={buildCtaUrl(triage)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-accent text-brand-ink text-sm font-semibold hover:brightness-110 transition-all"
              >
                <ArrowUpRight className="w-4 h-4" />
                Encontrar advogado
              </a>
              <p className="text-[11px] text-brand-ink/50 leading-snug px-1">
                Triagem informativa — não substitui orientação de um advogado.
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-brand-line bg-white px-3 py-2.5">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite aqui a sua mensagem..."
            rows={1}
            className="flex-1 resize-none rounded-xl border-2 border-brand-line bg-brand-bg px-3 py-2.5 text-sm
              text-brand-ink placeholder:text-brand-ink/50
              focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent
              max-h-24 overflow-y-auto"
            style={{ minHeight: "40px" }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            aria-label="Enviar mensagem"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-ink text-white
              hover:bg-brand-deep transition-colors
              disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-4 h-4" />
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
