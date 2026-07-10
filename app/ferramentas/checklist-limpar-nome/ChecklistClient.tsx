"use client";

import { useState, useCallback, type FormEvent } from "react";
import Link from "next/link";
import {
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
  Send,
  Phone,
  MapPin,
  FileText,
  AlertTriangle,
  CheckCircle,
  Loader2,
  MessageCircle,
  Users,
  Calculator,
  BookOpen
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const ITEMS = [
  {
    text: "Consultei meu CPF no Serasa/SPC",
    help: "Acesse serasa.com.br ou spcbrasil.org.br gratuitamente para ver suas pendencias."
  },
  {
    text: "Identifiquei todas as dividas pendentes",
    help: "Anote credor, valor original, data da negativacao e se reconhece a divida."
  },
  {
    text: "Verifiquei se alguma divida esta prescrita",
    help: "Dividas com mais de 5 anos devem ser removidas do cadastro negativo (Art. 43, par.1, CDC)."
  },
  {
    text: "Separei meus documentos pessoais",
    help: "RG, CPF, comprovante de residencia e comprovante de renda atualizados."
  },
  {
    text: "Verifiquei se ha cobrancas indevidas",
    help: "Se voce nao reconhece a divida, pode ser fraude. Registre B.O. e conteste."
  },
  {
    text: "Pesquisei feiroes e programas de renegociacao",
    help: "Serasa Limpa Nome e feiroes de bancos oferecem descontos de ate 90%."
  },
  {
    text: "Calculei minha capacidade de pagamento",
    help: "Defina quanto pode pagar por mes sem comprometer necessidades basicas."
  },
  {
    text: "Preparei proposta de acordo por escrito",
    help: "Faca uma contraproposta realista. Peca desconto nos juros e parcelamento."
  },
  {
    text: "Guardei todos os comprovantes de pagamento",
    help: "Apos pagar, exija e guarde o comprovante. O credor tem 5 dias uteis para retirar seu nome."
  },
  {
    text: "Conheco meus direitos em caso de negativacao indevida",
    help: "Negativacao sem notificacao previa ou apos quitacao gera direito a indenizacao (Sumula 385, STJ)."
  }
] as const;

const TOTAL = ITEMS.length;

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function ChecklistClient() {
  /* --- checklist state --- */
  const [checked, setChecked] = useState<boolean[]>(Array(TOTAL).fill(false));
  const [expanded, setExpanded] = useState<boolean[]>(Array(TOTAL).fill(false));

  const checkedCount = checked.filter(Boolean).length;
  const pct = Math.round((checkedCount / TOTAL) * 100);

  const toggle = useCallback((i: number) => {
    setChecked((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  }, []);

  const toggleHelp = useCallback((i: number) => {
    setExpanded((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  }, []);

  /* --- form state --- */
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cidade, setCidade] = useState("");
  const [resumo, setResumo] = useState("");
  const [sending, setSending] = useState(false);
  const [formMsg, setFormMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const canSubmit = nome.trim().length >= 2 && telefone.trim().length >= 8;

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!canSubmit || sending) return;

      setSending(true);
      setFormMsg(null);

      try {
        const res = await fetch("/api/leads/capture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: nome.trim(),
            telefone: telefone.trim(),
            cidade: cidade.trim() || undefined,
            resumo: resumo.trim() || undefined,
            area_juridica: "Consumidor",
            origem: "/ferramentas/checklist-limpar-nome",
            ferramenta: "checklist-limpar-nome",
            metadata: { checkedCount, total: TOTAL }
          })
        });

        const data = await res.json();
        if (data.ok) {
          setFormMsg({ ok: true, text: "Pronto! Um advogado entrara em contato." });
          setNome("");
          setTelefone("");
          setCidade("");
          setResumo("");
        } else {
          setFormMsg({
            ok: false,
            text: data.error || "Erro ao enviar. Tente novamente."
          });
        }
      } catch {
        setFormMsg({ ok: false, text: "Erro de conexao. Tente novamente." });
      } finally {
        setSending(false);
      }
    },
    [canSubmit, sending, nome, telefone, cidade, resumo, checkedCount]
  );

  /* --- render --- */
  return (
    <div className="space-y-8">
      {/* ---- Progress bar ---- */}
      <div className="card" role="status" aria-label={`Progresso: ${checkedCount} de ${TOTAL} itens completos`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-brand-ink">
            {checkedCount} de {TOTAL} itens
          </span>
          <span className="text-sm font-bold text-brand-deep">{pct}%</span>
        </div>
        <div className="w-full h-3 rounded-full bg-brand-line/50 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${pct}%`,
              background:
                pct < 50
                  ? "#F59E0B"
                  : pct < 100
                  ? "#22C55E"
                  : "#16A34A"
            }}
          />
        </div>
      </div>

      {/* ---- Checklist items ---- */}
      <ol className="space-y-3" aria-label="Checklist para limpar seu nome">
        {ITEMS.map((item, i) => {
          const isChecked = checked[i];
          const isExpanded = expanded[i];
          const Icon = isChecked ? CheckSquare : Square;
          const HelpIcon = isExpanded ? ChevronUp : ChevronDown;

          return (
            <li
              key={i}
              className={`card transition-colors ${
                isChecked ? "border-green-200 bg-green-50/40" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="mt-0.5 flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded"
                  aria-label={
                    isChecked ? `Desmarcar: ${item.text}` : `Marcar: ${item.text}`
                  }
                  aria-pressed={isChecked}
                >
                  <Icon
                    className={`w-6 h-6 transition-colors ${
                      isChecked
                        ? "text-green-600"
                        : "text-brand-ink/40 hover:text-brand-deep"
                    }`}
                    aria-hidden
                  />
                </button>

                <div className="flex-1 min-w-0">
                  <span
                    className={`text-base leading-relaxed ${
                      isChecked
                        ? "text-brand-ink/60 line-through decoration-1"
                        : "text-brand-ink font-medium"
                    }`}
                  >
                    {item.text}
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleHelp(i)}
                    className="flex items-center gap-1 text-sm text-brand-deep hover:text-brand-accent transition mt-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded"
                    aria-expanded={isExpanded}
                    aria-controls={`help-${i}`}
                  >
                    <HelpIcon className="w-4 h-4" aria-hidden />
                    {isExpanded ? "Fechar dica" : "Ver dica"}
                  </button>

                  {isExpanded && (
                    <p
                      id={`help-${i}`}
                      className="mt-2 text-sm text-brand-ink/70 leading-relaxed bg-brand-bg rounded-lg p-3 border border-brand-line"
                    >
                      {item.help}
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {/* ---- Results summary (shows after 3+ checked) ---- */}
      {checkedCount >= 3 && (
        <section
          className={`card border-2 ${
            pct >= 50
              ? "border-green-300 bg-green-50/60"
              : "border-amber-300 bg-amber-50/60"
          }`}
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            {pct >= 50 ? (
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" aria-hidden />
            ) : (
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden />
            )}
            <div>
              <p className="font-display text-lg font-bold text-brand-ink">
                Voce completou {checkedCount} de {TOTAL} itens
              </p>
              {pct >= 50 ? (
                <p className="text-sm text-green-800 mt-1 leading-relaxed">
                  Bom progresso! Voce ja tem uma base solida para negociar suas
                  dividas ou procurar orientacao profissional. Complete os itens
                  restantes para se preparar ainda melhor.
                </p>
              ) : (
                <p className="text-sm text-amber-800 mt-1 leading-relaxed">
                  Ainda faltam passos importantes. Antes de negociar, complete
                  pelo menos os itens de consulta ao CPF, identificacao de
                  dividas e separacao de documentos.
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ---- Lead capture form ---- */}
      <section
        className="card border-2 border-brand-accent/30 bg-white"
        aria-labelledby="form-heading"
      >
        <div className="flex items-start gap-3 mb-6">
          <FileText className="w-7 h-7 text-brand-accent flex-shrink-0 mt-1" aria-hidden />
          <div>
            <h2
              id="form-heading"
              className="font-display text-2xl font-bold text-brand-ink"
            >
              Precisa de orientacao profissional?
            </h2>
            <p className="text-sm text-brand-ink/65 mt-1 leading-relaxed">
              Preencha abaixo e um advogado especialista em direito do
              consumidor entrara em contato gratuitamente.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Nome */}
          <div>
            <label htmlFor="lead-nome" className="block text-sm font-semibold text-brand-ink mb-1">
              Nome *
            </label>
            <input
              id="lead-nome"
              type="text"
              required
              minLength={2}
              maxLength={200}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome completo"
              className="w-full rounded-xl border-2 border-brand-line bg-white px-4 py-3 text-brand-ink placeholder:text-brand-ink/40 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/30 outline-none transition"
            />
          </div>

          {/* Telefone */}
          <div>
            <label htmlFor="lead-telefone" className="block text-sm font-semibold text-brand-ink mb-1">
              <Phone className="w-4 h-4 inline-block mr-1 -mt-0.5" aria-hidden />
              Telefone / WhatsApp *
            </label>
            <input
              id="lead-telefone"
              type="tel"
              required
              minLength={8}
              maxLength={20}
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(00) 00000-0000"
              className="w-full rounded-xl border-2 border-brand-line bg-white px-4 py-3 text-brand-ink placeholder:text-brand-ink/40 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/30 outline-none transition"
            />
          </div>

          {/* Cidade */}
          <div>
            <label htmlFor="lead-cidade" className="block text-sm font-semibold text-brand-ink mb-1">
              <MapPin className="w-4 h-4 inline-block mr-1 -mt-0.5" aria-hidden />
              Cidade
            </label>
            <input
              id="lead-cidade"
              type="text"
              maxLength={120}
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              placeholder="Em que cidade voce mora?"
              className="w-full rounded-xl border-2 border-brand-line bg-white px-4 py-3 text-brand-ink placeholder:text-brand-ink/40 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/30 outline-none transition"
            />
          </div>

          {/* Resumo */}
          <div>
            <label htmlFor="lead-resumo" className="block text-sm font-semibold text-brand-ink mb-1">
              Resumo do caso (opcional)
            </label>
            <textarea
              id="lead-resumo"
              maxLength={2000}
              rows={3}
              value={resumo}
              onChange={(e) => setResumo(e.target.value)}
              placeholder="Descreva brevemente sua situacao com as dividas..."
              className="w-full rounded-xl border-2 border-brand-line bg-white px-4 py-3 text-brand-ink placeholder:text-brand-ink/40 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/30 outline-none transition resize-y"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!canSubmit || sending}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-accent px-6 py-3.5 text-base font-bold text-brand-ink transition hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden />
            ) : (
              <Send className="w-5 h-5" aria-hidden />
            )}
            {sending ? "Enviando..." : "Receber orientacao gratuita"}
          </button>

          {/* Feedback */}
          {formMsg && (
            <div
              role="alert"
              className={`rounded-xl p-4 text-sm font-medium ${
                formMsg.ok
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {formMsg.text}
            </div>
          )}
        </form>

        {/* WhatsApp CTA */}
        <div className="mt-6 pt-5 border-t border-brand-line text-center">
          <p className="text-sm text-brand-ink/60 mb-3">
            Ou fale diretamente pelo WhatsApp:
          </p>
          <a
            href="https://wa.me/5538999999999?text=Ol%C3%A1%2C%20usei%20o%20checklist%20do%20AdvAqui%20e%20preciso%20de%20orienta%C3%A7%C3%A3o%20para%20limpar%20meu%20nome."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-green-500 bg-green-50 px-6 py-3 text-base font-bold text-green-700 transition hover:bg-green-100"
          >
            <MessageCircle className="w-5 h-5" aria-hidden />
            Chamar no WhatsApp
          </a>
        </div>
      </section>

      {/* ---- FAQ ---- */}
      <section aria-labelledby="faq-heading">
        <h2
          id="faq-heading"
          className="font-display text-2xl font-bold text-brand-ink mb-4"
        >
          Perguntas frequentes
        </h2>
        <div className="space-y-3">
          <FaqItem
            q="Quanto tempo leva para limpar o nome?"
            a="Apos o pagamento ou acordo, o credor tem ate 5 dias uteis para retirar a negativacao. Se a divida ja prescreveu (mais de 5 anos), voce pode pedir a remocao imediata com base no Art. 43, par.1, do CDC."
          />
          <FaqItem
            q="Posso negociar a divida por um valor menor?"
            a="Sim. Muitos credores aceitam descontos de 40% a 90%, principalmente em feiroes como o Serasa Limpa Nome. Sempre peca proposta por escrito e guarde o comprovante de pagamento."
          />
          <FaqItem
            q="Fui negativado indevidamente. Tenho direito a indenizacao?"
            a="Sim. Negativacao sem notificacao previa (Art. 43, par.2, CDC) ou apos a quitacao gera direito a indenizacao por danos morais. A Sumula 385 do STJ define as condicoes. Procure um advogado de direito do consumidor."
          />
        </div>
      </section>

      {/* ---- Related pages ---- */}
      <section aria-labelledby="related-heading">
        <h2
          id="related-heading"
          className="font-display text-xl font-bold text-brand-ink mb-4"
        >
          Veja tambem
        </h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <RelatedCard
            href="/advogados"
            Icon={Users}
            label="Encontrar advogado"
            desc="Diretorio por cidade e area de atuacao."
          />
          <RelatedCard
            href="/calculadoras"
            Icon={Calculator}
            label="Calculadoras juridicas"
            desc="Rescisao, FGTS, pensao e mais."
          />
          <RelatedCard
            href="/blog"
            Icon={BookOpen}
            label="Blog juridico"
            desc="Artigos sobre seus direitos."
          />
        </div>
      </section>

      {/* ---- Disclaimer ---- */}
      <p className="text-xs text-brand-ink/50 max-w-2xl">
        Este checklist tem carater informativo e nao substitui orientacao
        juridica profissional. Cada situacao tem particularidades que podem
        alterar o resultado. Para decisoes sobre o seu caso, consulte um
        advogado.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded"
        aria-expanded={open}
      >
        <span className="font-display font-semibold text-brand-ink text-base">
          {q}
        </span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-brand-ink/40 flex-shrink-0" aria-hidden />
        ) : (
          <ChevronDown className="w-5 h-5 text-brand-ink/40 flex-shrink-0" aria-hidden />
        )}
      </button>
      {open && (
        <p className="mt-3 text-sm text-brand-ink/75 leading-relaxed">{a}</p>
      )}
    </div>
  );
}

function RelatedCard({
  href,
  Icon,
  label,
  desc
}: {
  href: string;
  Icon: typeof Users;
  label: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="card group flex items-start gap-3 transition hover:-translate-y-0.5 hover:shadow-cardHover"
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-brand-accent/15">
        <Icon className="w-5 h-5 text-brand-accent" aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="font-display font-semibold text-brand-ink text-sm">
          {label}
        </p>
        <p className="text-xs text-brand-ink/60 mt-0.5">{desc}</p>
      </div>
    </Link>
  );
}
