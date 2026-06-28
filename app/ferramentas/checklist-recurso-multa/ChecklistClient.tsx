"use client";

import { useState, useCallback, useMemo, type FormEvent } from "react";
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
  Loader2,
  MessageCircle,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Checklist data                                                      */
/* ------------------------------------------------------------------ */

type ChecklistItem = {
  id: string;
  text: string;
  help: string;
};

const ITEMS: ChecklistItem[] = [
  {
    id: "nait",
    text: "Notificacao de autuacao (NAIT) em maos",
    help: "Documento recebido pelos Correios ou no Detran com os dados da infracao.",
  },
  {
    id: "prazo",
    text: "Prazo para recurso ainda nao venceu",
    help: "Voce tem 30 dias apos receber a notificacao de penalidade para recorrer a JARI.",
  },
  {
    id: "condutor",
    text: "Identificacao do condutor (se aplicavel)",
    help: "Se a multa foi para outro motorista, preencha o formulario de identificacao do condutor.",
  },
  {
    id: "fotos",
    text: "Fotos ou videos do local da infracao",
    help: "Se possivel, reuna imagens que comprovem irregularidade na sinalizacao ou equipamento.",
  },
  {
    id: "docs",
    text: "Copia do CNH e CRLV",
    help: "Documentos basicos do motorista e do veiculo.",
  },
  {
    id: "residencia",
    text: "Comprovante de residencia atualizado",
    help: "Para confirmar o endereco do proprietario do veiculo.",
  },
  {
    id: "relato",
    text: "Relato escrito dos fatos",
    help: "Descricao detalhada do que aconteceu, com data, hora e local.",
  },
  {
    id: "sinalizacao",
    text: "Verificacao da placa de sinalizacao",
    help: "Confira se a placa no local estava visivel e em boas condicoes.",
  },
  {
    id: "pontos",
    text: "Consulta de pontos na CNH",
    help: "Verifique quantos pontos voce ja tem para saber o impacto da multa.",
  },
  {
    id: "decisao",
    text: "Decidir se recorre sozinho ou com advogado",
    help: "Para multas graves ou suspensao de CNH, um advogado de transito pode aumentar suas chances.",
  },
];

/* ------------------------------------------------------------------ */
/* FAQ data                                                            */
/* ------------------------------------------------------------------ */

const FAQ = [
  {
    q: "Qual o prazo para recorrer de uma multa de transito?",
    a: "O prazo e de 30 dias corridos a partir do recebimento da notificacao de penalidade. Se voce perdeu o prazo da defesa previa, ainda pode recorrer a JARI dentro desse periodo.",
  },
  {
    q: "Posso recorrer de multa por excesso de velocidade?",
    a: "Sim. Verifique se o equipamento estava devidamente aferido e sinalizado. Irregularidades na sinalizacao ou na certificacao do radar sao motivos validos para anulacao.",
  },
  {
    q: "Preciso de advogado para recorrer de multa?",
    a: "Nao e obrigatorio, mas para multas graves (7 pontos) ou quando ha risco de suspensao da CNH, um advogado de transito aumenta significativamente as chances de sucesso.",
  },
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function ChecklistClient() {
  // Checklist state
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // Form state
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cidade, setCidade] = useState("");
  const [resumo, setResumo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const total = ITEMS.length;
  const checkedCount = checked.size;
  const percent = Math.round((checkedCount / total) * 100);

  const toggleCheck = useCallback((id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleExpand = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const showResults = checkedCount >= 3;

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!nome.trim() && !telefone.trim()) return;

      setSubmitting(true);
      setSubmitStatus("idle");

      try {
        const res = await fetch("/api/leads/capture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: nome.trim(),
            telefone: telefone.trim(),
            cidade: cidade.trim(),
            resumo: resumo.trim(),
            area_juridica: "Transito",
            origem: "/ferramentas/checklist-recurso-multa",
            ferramenta: "checklist-recurso-multa",
            metadata: {
              checklist_checked: checkedCount,
              checklist_total: total,
            },
          }),
        });

        if (res.ok) {
          setSubmitStatus("success");
          setNome("");
          setTelefone("");
          setCidade("");
          setResumo("");
        } else {
          setSubmitStatus("error");
        }
      } catch {
        setSubmitStatus("error");
      } finally {
        setSubmitting(false);
      }
    },
    [nome, telefone, cidade, resumo, checkedCount, total]
  );

  return (
    <>
      {/* ---- Progress bar ---- */}
      <div className="card mb-6" role="status" aria-label={`Progresso: ${checkedCount} de ${total} itens marcados`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-brand-ink">
            {checkedCount} de {total} itens verificados
          </span>
          <span className="text-sm font-bold text-brand-deep">{percent}%</span>
        </div>
        <div className="w-full h-3 bg-brand-line/40 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${percent}%`,
              background: percent >= 50 ? "#16a34a" : "#C8A24A",
            }}
          />
        </div>
      </div>

      {/* ---- Checklist ---- */}
      <section className="card mb-6" aria-label="Checklist de recurso de multa">
        <ul className="divide-y divide-brand-line/50" role="list">
          {ITEMS.map((item) => {
            const isChecked = checked.has(item.id);
            const isExpanded = expanded.has(item.id);

            return (
              <li key={item.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => toggleCheck(item.id)}
                    className="mt-0.5 flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-deep rounded"
                    aria-label={isChecked ? `Desmarcar: ${item.text}` : `Marcar: ${item.text}`}
                    aria-pressed={isChecked}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-5 h-5 text-green-600" aria-hidden />
                    ) : (
                      <Square className="w-5 h-5 text-brand-ink/40" aria-hidden />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => toggleExpand(item.id)}
                      className={`text-left w-full flex items-center justify-between gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-deep rounded ${
                        isChecked ? "text-brand-ink/50 line-through" : "text-brand-ink"
                      }`}
                      aria-expanded={isExpanded}
                      aria-controls={`help-${item.id}`}
                    >
                      <span className="text-sm md:text-base font-medium leading-snug">
                        {item.text}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 flex-shrink-0 text-brand-ink/40" aria-hidden />
                      ) : (
                        <ChevronDown className="w-4 h-4 flex-shrink-0 text-brand-ink/40" aria-hidden />
                      )}
                    </button>

                    {isExpanded && (
                      <p
                        id={`help-${item.id}`}
                        className="text-sm text-brand-ink/70 mt-1.5 leading-relaxed pl-0.5"
                      >
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

      {/* ---- Results (appears after 3+ items) ---- */}
      {showResults && (
        <section
          className={`card mb-6 border-l-4 ${
            percent >= 50
              ? "border-green-500 bg-green-50"
              : "border-amber-400 bg-amber-50"
          }`}
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            {percent >= 50 ? (
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" aria-hidden />
            ) : (
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden />
            )}
            <div>
              <p className="font-semibold text-brand-ink">
                Voce completou {checkedCount} de {total} itens
              </p>
              {percent >= 50 ? (
                <p className="text-sm text-green-800 mt-1 leading-relaxed">
                  Bom progresso! Voce ja reuniu boa parte do necessario para montar seu recurso.
                  Complete os itens restantes e, se precisar, procure um advogado de transito
                  para revisar a peca.
                </p>
              ) : (
                <p className="text-sm text-amber-800 mt-1 leading-relaxed">
                  Ainda faltam documentos importantes. Reuna o que esta pendente antes de
                  protocolar o recurso, para nao perder o prazo nem ter a defesa indeferida
                  por falta de documentos.
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ---- Lead capture form ---- */}
      <section className="card mb-6 bg-brand-bg border border-brand-line" id="orientacao">
        <div className="flex items-start gap-3 mb-5">
          <Phone className="w-6 h-6 text-brand-deep flex-shrink-0 mt-0.5" aria-hidden />
          <div>
            <h2 className="font-display text-xl md:text-2xl font-bold text-brand-ink">
              Precisa de orientacao profissional?
            </h2>
            <p className="text-sm text-brand-ink/70 mt-1 leading-relaxed">
              Preencha abaixo e um advogado de transito entra em contato. Sem compromisso.
            </p>
          </div>
        </div>

        {submitStatus === "success" ? (
          <div className="rounded-xl bg-green-50 border border-green-200 p-5 text-center">
            <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" aria-hidden />
            <p className="font-semibold text-green-800">Solicitacao enviada!</p>
            <p className="text-sm text-green-700 mt-1">
              Um advogado de transito entrara em contato em breve.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="lead-nome" className="block text-sm font-medium text-brand-ink mb-1">
                Nome *
              </label>
              <input
                id="lead-nome"
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome completo"
                className="w-full rounded-lg border border-brand-line bg-white px-3 py-2.5 text-sm text-brand-ink placeholder:text-brand-ink/40 focus:outline-none focus:ring-2 focus:ring-brand-deep focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="lead-telefone" className="block text-sm font-medium text-brand-ink mb-1">
                Telefone *
              </label>
              <input
                id="lead-telefone"
                type="tel"
                required
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(00) 00000-0000"
                className="w-full rounded-lg border border-brand-line bg-white px-3 py-2.5 text-sm text-brand-ink placeholder:text-brand-ink/40 focus:outline-none focus:ring-2 focus:ring-brand-deep focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="lead-cidade" className="block text-sm font-medium text-brand-ink mb-1">
                Cidade
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-ink/40" aria-hidden />
                <input
                  id="lead-cidade"
                  type="text"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  placeholder="Sua cidade"
                  className="w-full rounded-lg border border-brand-line bg-white pl-9 pr-3 py-2.5 text-sm text-brand-ink placeholder:text-brand-ink/40 focus:outline-none focus:ring-2 focus:ring-brand-deep focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="lead-resumo" className="block text-sm font-medium text-brand-ink mb-1">
                Resumo do caso{" "}
                <span className="text-brand-ink/50 font-normal">(opcional)</span>
              </label>
              <textarea
                id="lead-resumo"
                value={resumo}
                onChange={(e) => setResumo(e.target.value)}
                placeholder="Descreva brevemente a multa e o que aconteceu..."
                rows={3}
                className="w-full rounded-lg border border-brand-line bg-white px-3 py-2.5 text-sm text-brand-ink placeholder:text-brand-ink/40 focus:outline-none focus:ring-2 focus:ring-brand-deep focus:border-transparent resize-y"
              />
            </div>

            {submitStatus === "error" && (
              <p className="text-sm text-red-600 font-medium" role="alert">
                Erro ao enviar. Tente novamente.
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-deep text-white font-semibold px-6 py-3 text-sm transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-deep focus-visible:ring-offset-2"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
              ) : (
                <Send className="w-4 h-4" aria-hidden />
              )}
              {submitting ? "Enviando..." : "Receber orientacao gratuita"}
            </button>
          </form>
        )}

        <div className="mt-4 pt-4 border-t border-brand-line/50 text-center">
          <a
            href="https://wa.me/5538999999999?text=Oi%2C%20preciso%20de%20ajuda%20com%20recurso%20de%20multa"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-800 transition"
          >
            <MessageCircle className="w-4 h-4" aria-hidden />
            Ou fale pelo WhatsApp
          </a>
        </div>
      </section>

      {/* ---- FAQ ---- */}
      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-4 inline-flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-brand-deep" aria-hidden />
          Perguntas frequentes
        </h2>
        <div className="space-y-4">
          {FAQ.map((f) => (
            <div key={f.q} className="pl-4 border-l-2 border-brand-line">
              <h3 className="font-semibold text-brand-ink">{f.q}</h3>
              <p className="text-sm text-brand-ink/80 mt-1 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Related links ---- */}
      <section className="card mb-6">
        <h2 className="font-display text-lg font-bold text-brand-ink mb-3">
          Veja tambem
        </h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <Link
            href="/advogados"
            className="flex items-center gap-2 text-sm font-medium text-brand-deep hover:underline"
          >
            <ArrowRight className="w-4 h-4" aria-hidden />
            Encontrar advogado de transito
          </Link>
          <Link
            href="/calculadoras"
            className="flex items-center gap-2 text-sm font-medium text-brand-deep hover:underline"
          >
            <ArrowRight className="w-4 h-4" aria-hidden />
            Calculadoras juridicas
          </Link>
          <Link
            href="/blog"
            className="flex items-center gap-2 text-sm font-medium text-brand-deep hover:underline"
          >
            <ArrowRight className="w-4 h-4" aria-hidden />
            Blog juridico
          </Link>
        </div>
      </section>

      {/* ---- Disclaimer ---- */}
      <aside
        role="note"
        className="rounded-xl border-l-4 border-amber-400 bg-amber-50 p-4 text-xs md:text-sm text-amber-900 leading-relaxed flex items-start gap-2"
      >
        <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden />
        <span>
          Este checklist tem carater informativo e nao substitui a consulta com um advogado.
          Cada caso tem particularidades que podem alterar a estrategia do recurso.
        </span>
      </aside>
    </>
  );
}
