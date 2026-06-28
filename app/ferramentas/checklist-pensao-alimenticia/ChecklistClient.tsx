"use client";

import { useState, type FormEvent } from "react";
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
  CheckCircle2,
  MessageCircle,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const ITEMS = [
  {
    text: "Certidao de nascimento do(s) filho(s)",
    help: "Documento essencial que comprova o parentesco e a obrigacao alimentar.",
  },
  {
    text: "Comprovante de residencia atualizado",
    help: "Para definir a comarca competente para a acao.",
  },
  {
    text: "Documentos pessoais do genitor guardiao",
    help: "RG e CPF de quem vai entrar com o pedido.",
  },
  {
    text: "Comprovantes de gastos com a crianca",
    help: "Escola, saude, alimentacao, transporte, vestuario. Quanto mais detalhado, melhor.",
  },
  {
    text: "Informacoes sobre a renda do alimentante",
    help: "Se possivel, reuna contracheques, declaracao de IR ou informacoes sobre o trabalho do genitor.",
  },
  {
    text: "Comprovante de renda do guardiao",
    help: "Para demonstrar necessidade e capacidade de cada parte.",
  },
  {
    text: "Dados completos do alimentante",
    help: "Nome completo, CPF, endereco e local de trabalho para citacao.",
  },
  {
    text: "Decisao sobre valor pretendido",
    help: "Em geral, 30% do salario para 1 filho, mas depende das necessidades e possibilidades.",
  },
  {
    text: "Verificar se cabe acordo extrajudicial",
    help: "Acordo em cartorio e mais rapido e barato. Exige consenso entre as partes.",
  },
  {
    text: "Procurar Defensoria Publica ou advogado",
    help: "Se nao tem renda para advogado particular, a Defensoria Publica atende gratuitamente.",
  },
] as const;

const TOTAL = ITEMS.length;

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function ChecklistClient() {
  /* checklist state */
  const [checked, setChecked] = useState<boolean[]>(
    () => new Array(TOTAL).fill(false),
  );
  const [expanded, setExpanded] = useState<number | null>(null);

  /* form state */
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cidade, setCidade] = useState("");
  const [resumo, setResumo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formResult, setFormResult] = useState<
    { ok: true } | { ok: false; error: string } | null
  >(null);

  const doneCount = checked.filter(Boolean).length;
  const pct = Math.round((doneCount / TOTAL) * 100);

  function toggle(i: number) {
    setChecked((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  }

  function toggleExpand(i: number) {
    setExpanded((prev) => (prev === i ? null : i));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!nome.trim() && !telefone.trim()) return;
    setSubmitting(true);
    setFormResult(null);

    try {
      const res = await fetch("/api/leads/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nome.trim(),
          telefone: telefone.trim(),
          cidade: cidade.trim(),
          area_juridica: "Familia",
          resumo: resumo.trim() || null,
          origem: "/ferramentas/checklist-pensao-alimenticia",
          ferramenta: "checklist-pensao-alimenticia",
          metadata: { itens_marcados: doneCount, total: TOTAL },
        }),
      });
      const json = await res.json();
      if (json.ok) {
        setFormResult({ ok: true });
        setNome("");
        setTelefone("");
        setCidade("");
        setResumo("");
      } else {
        setFormResult({ ok: false, error: json.error || "Erro ao enviar." });
      }
    } catch {
      setFormResult({ ok: false, error: "Falha de conexao. Tente novamente." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* ---- Progress bar ---- */}
      <div className="card mb-6" role="status" aria-live="polite">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-brand-ink">
            {doneCount} de {TOTAL} itens marcados
          </span>
          <span className="text-sm font-bold text-brand-deep">{pct}%</span>
        </div>
        <div
          className="w-full h-3 rounded-full bg-brand-line/40 overflow-hidden"
          aria-label={`Progresso: ${pct}%`}
        >
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${pct}%`,
              background:
                pct < 50
                  ? "#D97706"
                  : pct < 100
                    ? "#059669"
                    : "#047857",
            }}
          />
        </div>
      </div>

      {/* ---- Checklist ---- */}
      <section className="card mb-6" aria-label="Checklist de documentos">
        <ul className="divide-y divide-brand-line/40" role="list">
          {ITEMS.map((item, i) => {
            const done = checked[i];
            const isOpen = expanded === i;
            return (
              <li key={i} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    className="mt-0.5 flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-deep rounded"
                    aria-label={
                      done
                        ? `Desmarcar: ${item.text}`
                        : `Marcar: ${item.text}`
                    }
                  >
                    {done ? (
                      <CheckSquare
                        className="w-5 h-5 text-emerald-600"
                        aria-hidden
                      />
                    ) : (
                      <Square
                        className="w-5 h-5 text-brand-ink/40"
                        aria-hidden
                      />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => toggleExpand(i)}
                      className={`text-left w-full flex items-center justify-between gap-2 text-[15px] leading-snug focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-deep rounded ${
                        done
                          ? "text-brand-ink/55 line-through decoration-brand-ink/25"
                          : "text-brand-ink font-medium"
                      }`}
                      aria-expanded={isOpen}
                    >
                      <span>{item.text}</span>
                      {isOpen ? (
                        <ChevronUp
                          className="w-4 h-4 flex-shrink-0 text-brand-ink/40"
                          aria-hidden
                        />
                      ) : (
                        <ChevronDown
                          className="w-4 h-4 flex-shrink-0 text-brand-ink/40"
                          aria-hidden
                        />
                      )}
                    </button>
                    {isOpen && (
                      <p className="text-sm text-brand-ink/70 mt-1.5 leading-relaxed">
                        {item.help}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ---- Results (after 3+ items) ---- */}
      {doneCount >= 3 && (
        <section
          className="card mb-6 border-l-4"
          style={{
            borderLeftColor: pct >= 50 ? "#059669" : "#D97706",
          }}
          aria-live="polite"
        >
          <p className="font-semibold text-brand-ink mb-1">
            Voce completou {doneCount} de {TOTAL} itens.
          </p>
          {pct < 50 ? (
            <div className="flex items-start gap-2 text-sm text-amber-700">
              <AlertTriangle
                className="w-4 h-4 mt-0.5 flex-shrink-0"
                aria-hidden
              />
              <p>
                Ainda faltam documentos importantes. Continue reunindo o que
                puder — quanto mais completo, mais rapido o processo anda.
              </p>
            </div>
          ) : (
            <div className="flex items-start gap-2 text-sm text-emerald-700">
              <CheckCircle2
                className="w-4 h-4 mt-0.5 flex-shrink-0"
                aria-hidden
              />
              <p>
                Bom andamento. Voce ja tem boa parte da documentacao. O proximo
                passo e procurar um advogado ou a Defensoria Publica para dar
                entrada no pedido.
              </p>
            </div>
          )}
        </section>
      )}

      {/* ---- Lead capture form ---- */}
      <section
        className="card border-2 border-brand-deep/20 mb-6"
        id="orientacao"
      >
        <div className="flex items-start gap-3 mb-5">
          <Send
            className="w-6 h-6 text-brand-deep flex-shrink-0 mt-0.5"
            aria-hidden
          />
          <div>
            <h2 className="font-display text-xl font-bold text-brand-ink">
              Precisa de orientacao profissional?
            </h2>
            <p className="text-sm text-brand-ink/70 mt-1 leading-relaxed">
              Preencha abaixo e um advogado de familia da sua regiao entra em
              contato. Sem compromisso.
            </p>
          </div>
        </div>

        {formResult?.ok ? (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-5 text-center">
            <CheckCircle2
              className="w-8 h-8 text-emerald-600 mx-auto mb-2"
              aria-hidden
            />
            <p className="font-semibold text-emerald-800">
              Solicitacao enviada.
            </p>
            <p className="text-sm text-emerald-700 mt-1">
              Um advogado de familia vai entrar em contato em breve.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* nome */}
            <div>
              <label
                htmlFor="lead-nome"
                className="block text-sm font-medium text-brand-ink mb-1"
              >
                Nome <span className="text-red-500" aria-hidden>*</span>
              </label>
              <input
                id="lead-nome"
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome completo"
                className="w-full rounded-lg border border-brand-line px-3 py-2.5 text-sm text-brand-ink bg-white placeholder:text-brand-ink/40 focus:outline-none focus:ring-2 focus:ring-brand-deep focus:border-brand-deep"
              />
            </div>

            {/* telefone */}
            <div>
              <label
                htmlFor="lead-telefone"
                className="block text-sm font-medium text-brand-ink mb-1"
              >
                <Phone className="w-3.5 h-3.5 inline mr-1" aria-hidden />
                Telefone <span className="text-red-500" aria-hidden>*</span>
              </label>
              <input
                id="lead-telefone"
                type="tel"
                required
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(00) 00000-0000"
                className="w-full rounded-lg border border-brand-line px-3 py-2.5 text-sm text-brand-ink bg-white placeholder:text-brand-ink/40 focus:outline-none focus:ring-2 focus:ring-brand-deep focus:border-brand-deep"
              />
            </div>

            {/* cidade */}
            <div>
              <label
                htmlFor="lead-cidade"
                className="block text-sm font-medium text-brand-ink mb-1"
              >
                <MapPin className="w-3.5 h-3.5 inline mr-1" aria-hidden />
                Cidade
              </label>
              <input
                id="lead-cidade"
                type="text"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                placeholder="Ex: Belo Horizonte"
                className="w-full rounded-lg border border-brand-line px-3 py-2.5 text-sm text-brand-ink bg-white placeholder:text-brand-ink/40 focus:outline-none focus:ring-2 focus:ring-brand-deep focus:border-brand-deep"
              />
            </div>

            {/* resumo */}
            <div>
              <label
                htmlFor="lead-resumo"
                className="block text-sm font-medium text-brand-ink mb-1"
              >
                <FileText className="w-3.5 h-3.5 inline mr-1" aria-hidden />
                Resumo do caso{" "}
                <span className="text-brand-ink/50 font-normal">
                  (opcional)
                </span>
              </label>
              <textarea
                id="lead-resumo"
                rows={3}
                value={resumo}
                onChange={(e) => setResumo(e.target.value)}
                placeholder="Descreva brevemente a situacao..."
                className="w-full rounded-lg border border-brand-line px-3 py-2.5 text-sm text-brand-ink bg-white placeholder:text-brand-ink/40 focus:outline-none focus:ring-2 focus:ring-brand-deep focus:border-brand-deep resize-y"
              />
            </div>

            {/* hidden fields conveyed via JSON body */}

            {formResult && !formResult.ok && (
              <p className="text-sm text-red-600 font-medium" role="alert">
                {formResult.error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand-deep text-white font-semibold px-6 py-3 text-[15px] hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-deep focus-visible:ring-offset-2"
            >
              <Send className="w-4 h-4" aria-hidden />
              {submitting ? "Enviando..." : "Receber orientacao gratuita"}
            </button>
          </form>
        )}

        {/* WhatsApp CTA */}
        <div className="mt-5 pt-5 border-t border-brand-line/40">
          <a
            href="https://wa.me/5538999999999?text=Oi%2C%20quero%20orientacao%20sobre%20pensao%20alimenticia"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-emerald-600 text-emerald-700 font-semibold px-5 py-2.5 text-sm hover:bg-emerald-50 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
          >
            <MessageCircle className="w-5 h-5" aria-hidden />
            Falar pelo WhatsApp
          </a>
        </div>
      </section>

      {/* ---- Related links ---- */}
      <section className="card mb-6">
        <h2 className="font-display text-lg font-bold text-brand-ink mb-3">
          Veja tambem
        </h2>
        <ul className="space-y-2 text-sm">
          <li>
            <Link
              href="/advogados"
              className="text-brand-deep hover:underline font-medium"
            >
              Encontrar advogado de familia na sua cidade
            </Link>
          </li>
          <li>
            <Link
              href="/calculadoras"
              className="text-brand-deep hover:underline font-medium"
            >
              Calculadoras juridicas (pensao, rescisao e mais)
            </Link>
          </li>
          <li>
            <Link
              href="/blog"
              className="text-brand-deep hover:underline font-medium"
            >
              Blog: artigos sobre direito de familia
            </Link>
          </li>
        </ul>
      </section>

      {/* ---- Disclaimer ---- */}
      <p className="text-xs text-brand-ink/50 max-w-2xl">
        Este checklist e de carater informativo e nao substitui a orientacao de
        um advogado. Cada caso tem particularidades que podem alterar os
        documentos exigidos.
      </p>
    </>
  );
}
