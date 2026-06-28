"use client";

import { useState, type FormEvent } from "react";
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
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Tipos                                                               */
/* ------------------------------------------------------------------ */

type CheckItem = {
  text: string;
  help: string;
};

const ITEMS: CheckItem[] = [
  {
    text: "O ato foi praticado por autoridade publica ou delegada",
    help: "Mandado de seguranca so cabe contra atos de autoridades publicas (Art. 5, LXIX, CF).",
  },
  {
    text: "Ha direito liquido e certo violado",
    help: "Voce consegue provar seu direito com documentos, sem necessidade de testemunhas.",
  },
  {
    text: "O ato e ilegal ou representa abuso de poder",
    help: "A autoridade agiu fora da lei ou excedeu suas atribuicoes.",
  },
  {
    text: "Nao cabe habeas corpus ou habeas data",
    help: "MS e residual — so quando nao ha outro remedio constitucional especifico.",
  },
  {
    text: "O prazo de 120 dias ainda nao venceu",
    help: "O prazo decadencial para impetrar MS e de 120 dias a partir da ciencia do ato (Art. 23, Lei 12.016/09).",
  },
  {
    text: "Nao se trata de ato de gestao comercial",
    help: "Atos de empresas estatais em atividade economica geralmente nao comportam MS.",
  },
  {
    text: "Tenho documentos que comprovam tudo",
    help: "MS nao admite fase de provas — todas as provas devem ser documentais e pre-constituidas.",
  },
  {
    text: "Identifiquei a autoridade coatora correta",
    help: "E quem praticou o ato ou quem tem poder de revoga-lo.",
  },
];

/* ------------------------------------------------------------------ */
/* Componente principal                                                */
/* ------------------------------------------------------------------ */

export function ChecklistClient() {
  const [checked, setChecked] = useState<boolean[]>(
    () => new Array(ITEMS.length).fill(false) as boolean[]
  );
  const [expanded, setExpanded] = useState<boolean[]>(
    () => new Array(ITEMS.length).fill(false) as boolean[]
  );

  /* Form state */
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cidade, setCidade] = useState("");
  const [resumo, setResumo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formResult, setFormResult] = useState<"ok" | "error" | null>(null);

  const total = ITEMS.length;
  const done = checked.filter(Boolean).length;
  const pct = Math.round((done / total) * 100);
  const showResults = done >= 3;

  function toggle(i: number) {
    setChecked((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  }

  function toggleHelp(i: number) {
    setExpanded((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
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
          resumo: resumo.trim(),
          area_juridica: "Administrativo",
          origem: "/ferramentas/triagem-mandado-seguranca",
          ferramenta: "triagem-mandado-seguranca",
          metadata: {
            checklist_done: done,
            checklist_total: total,
            checklist_pct: pct,
          },
        }),
      });
      const data = await res.json();
      setFormResult(data.ok ? "ok" : "error");
      if (data.ok) {
        setNome("");
        setTelefone("");
        setCidade("");
        setResumo("");
      }
    } catch {
      setFormResult("error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* ---- Progress bar ---- */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-brand-ink/70">
            {done} de {total} itens marcados
          </span>
          <span className="font-semibold text-brand-deep">{pct}%</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-brand-line overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${pct}%`,
              background:
                pct >= 50
                  ? "linear-gradient(90deg, #16a34a, #22c55e)"
                  : "linear-gradient(90deg, #F59E0B, #FBBF24)",
            }}
          />
        </div>
      </div>

      {/* ---- Checklist ---- */}
      <section aria-label="Checklist de mandado de seguranca" className="space-y-3 mb-10">
        {ITEMS.map((item, i) => {
          const isChecked = checked[i];
          const isExpanded = expanded[i];

          return (
            <div
              key={i}
              className={`rounded-xl border transition-colors ${
                isChecked
                  ? "border-green-200 bg-green-50/60"
                  : "border-brand-line bg-white"
              }`}
            >
              <div className="flex items-start gap-3 p-4">
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="mt-0.5 flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded"
                  aria-label={
                    isChecked
                      ? `Desmarcar: ${item.text}`
                      : `Marcar: ${item.text}`
                  }
                  aria-pressed={isChecked}
                >
                  {isChecked ? (
                    <CheckSquare className="w-6 h-6 text-green-600" />
                  ) : (
                    <Square className="w-6 h-6 text-brand-ink/40" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <span
                    className={`text-[15px] leading-snug ${
                      isChecked ? "text-brand-ink/60 line-through" : "text-brand-ink"
                    }`}
                  >
                    {item.text}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => toggleHelp(i)}
                  className="flex-shrink-0 mt-0.5 text-brand-ink/40 hover:text-brand-deep transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded"
                  aria-expanded={isExpanded}
                  aria-label={
                    isExpanded ? "Fechar explicacao" : "Ver explicacao"
                  }
                >
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 pl-[52px]">
                  <p className="text-sm text-brand-ink/70 leading-relaxed bg-brand-bg rounded-lg p-3">
                    {item.help}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* ---- Results ---- */}
      {showResults && (
        <section
          aria-label="Resultado da triagem"
          className={`rounded-xl border p-5 mb-10 ${
            pct >= 50
              ? "border-green-200 bg-green-50"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          <div className="flex items-start gap-3">
            {pct >= 50 ? (
              <CheckCircle2
                className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
                aria-hidden
              />
            ) : (
              <AlertTriangle
                className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5"
                aria-hidden
              />
            )}
            <div>
              <p className="font-semibold text-brand-ink mb-1">
                Voce completou {done} de {total} itens
              </p>
              {pct >= 50 ? (
                <p className="text-sm text-green-800 leading-relaxed">
                  O seu caso apresenta indicios compativeis com mandado de
                  seguranca. Procure um advogado administrativista para avaliar a
                  viabilidade e impetrar o MS dentro do prazo de 120 dias.
                </p>
              ) : (
                <p className="text-sm text-amber-800 leading-relaxed">
                  Ainda faltam requisitos importantes. Reuna mais documentos e
                  verifique os itens pendentes antes de consultar um advogado
                  sobre mandado de seguranca.
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ---- Lead capture form ---- */}
      <section
        id="orientacao"
        aria-labelledby="form-heading"
        className="rounded-2xl border border-brand-line bg-white p-6 md:p-8 mb-10"
      >
        <h2
          id="form-heading"
          className="font-display text-2xl font-semibold text-brand-ink mb-2"
        >
          Precisa de orientacao profissional?
        </h2>
        <p className="text-sm text-brand-ink/70 mb-6 leading-relaxed">
          Preencha os dados abaixo e um advogado da area de direito administrativo
          entrara em contato. Servico gratuito.
        </p>

        {formResult === "ok" ? (
          <div className="rounded-xl bg-green-50 border border-green-200 p-5 text-center">
            <CheckCircle2
              className="w-8 h-8 text-green-600 mx-auto mb-2"
              aria-hidden
            />
            <p className="font-semibold text-green-800">
              Solicitacao enviada com sucesso!
            </p>
            <p className="text-sm text-green-700 mt-1">
              Um advogado entrara em contato em breve.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="lead-nome"
                className="block text-sm font-medium text-brand-ink mb-1"
              >
                Nome *
              </label>
              <input
                id="lead-nome"
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome completo"
                className="w-full rounded-lg border border-brand-line bg-brand-bg px-4 py-2.5 text-brand-ink placeholder:text-brand-ink/40 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="lead-telefone"
                  className="block text-sm font-medium text-brand-ink mb-1"
                >
                  <Phone
                    className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5"
                    aria-hidden
                  />
                  Telefone *
                </label>
                <input
                  id="lead-telefone"
                  type="tel"
                  required
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(00) 00000-0000"
                  className="w-full rounded-lg border border-brand-line bg-brand-bg px-4 py-2.5 text-brand-ink placeholder:text-brand-ink/40 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                />
              </div>
              <div>
                <label
                  htmlFor="lead-cidade"
                  className="block text-sm font-medium text-brand-ink mb-1"
                >
                  <MapPin
                    className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5"
                    aria-hidden
                  />
                  Cidade
                </label>
                <input
                  id="lead-cidade"
                  type="text"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  placeholder="Sua cidade"
                  className="w-full rounded-lg border border-brand-line bg-brand-bg px-4 py-2.5 text-brand-ink placeholder:text-brand-ink/40 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="lead-resumo"
                className="block text-sm font-medium text-brand-ink mb-1"
              >
                <FileText
                  className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5"
                  aria-hidden
                />
                Resumo do caso{" "}
                <span className="text-brand-ink/50 font-normal">(opcional)</span>
              </label>
              <textarea
                id="lead-resumo"
                rows={3}
                value={resumo}
                onChange={(e) => setResumo(e.target.value)}
                placeholder="Descreva brevemente o que aconteceu..."
                className="w-full rounded-lg border border-brand-line bg-brand-bg px-4 py-2.5 text-brand-ink placeholder:text-brand-ink/40 focus:outline-none focus:ring-2 focus:ring-brand-accent resize-y"
              />
            </div>

            {formResult === "error" && (
              <p className="text-sm text-red-600" role="alert">
                Ocorreu um erro ao enviar. Tente novamente.
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-accent text-brand-ink font-bold text-[15px] hover:brightness-105 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2
                    className="w-4 h-4 animate-spin"
                    aria-hidden
                  />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" aria-hidden />
                  Receber orientacao gratuita
                </>
              )}
            </button>
          </form>
        )}

        {/* WhatsApp CTA */}
        <div className="mt-6 pt-5 border-t border-brand-line text-center">
          <p className="text-sm text-brand-ink/60 mb-3">
            Ou fale agora pelo WhatsApp:
          </p>
          <a
            href="https://wa.me/5538999710053?text=Ol%C3%A1%2C%20vim%20pela%20triagem%20de%20mandado%20de%20seguran%C3%A7a%20do%20AdvAqui%20e%20preciso%20de%20orienta%C3%A7%C3%A3o."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] text-white font-semibold text-sm hover:brightness-105 transition"
          >
            <Phone className="w-4 h-4" aria-hidden />
            Chamar no WhatsApp
          </a>
        </div>
      </section>

      {/* ---- FAQ ---- */}
      <section aria-labelledby="faq-heading" className="mb-10">
        <h2
          id="faq-heading"
          className="font-display text-2xl font-semibold text-brand-ink mb-5"
        >
          Perguntas frequentes
        </h2>
        <div className="space-y-4">
          <details className="group rounded-xl border border-brand-line bg-white">
            <summary className="flex items-center justify-between cursor-pointer p-4 text-brand-ink font-medium list-none [&::-webkit-details-marker]:hidden">
              <span>Quanto tempo leva um mandado de seguranca?</span>
              <ChevronDown className="w-5 h-5 text-brand-ink/40 group-open:rotate-180 transition-transform" aria-hidden />
            </summary>
            <div className="px-4 pb-4 text-sm text-brand-ink/70 leading-relaxed">
              O juiz deve decidir em ate 30 dias apos o recebimento da peticao
              (Art. 12, Lei 12.016/09). Na pratica, a decisao liminar pode sair em
              poucos dias, mas o julgamento definitivo pode levar meses dependendo
              do tribunal.
            </div>
          </details>

          <details className="group rounded-xl border border-brand-line bg-white">
            <summary className="flex items-center justify-between cursor-pointer p-4 text-brand-ink font-medium list-none [&::-webkit-details-marker]:hidden">
              <span>Posso impetrar mandado de seguranca sem advogado?</span>
              <ChevronDown className="w-5 h-5 text-brand-ink/40 group-open:rotate-180 transition-transform" aria-hidden />
            </summary>
            <div className="px-4 pb-4 text-sm text-brand-ink/70 leading-relaxed">
              Nao. O mandado de seguranca e uma acao judicial que exige
              representacao por advogado inscrito na OAB, com excecao de impetracao
              pelo Ministerio Publico (Art. 3, Lei 12.016/09).
            </div>
          </details>

          <details className="group rounded-xl border border-brand-line bg-white">
            <summary className="flex items-center justify-between cursor-pointer p-4 text-brand-ink font-medium list-none [&::-webkit-details-marker]:hidden">
              <span>Qual a diferenca entre mandado de seguranca individual e coletivo?</span>
              <ChevronDown className="w-5 h-5 text-brand-ink/40 group-open:rotate-180 transition-transform" aria-hidden />
            </summary>
            <div className="px-4 pb-4 text-sm text-brand-ink/70 leading-relaxed">
              O individual protege direito liquido e certo de uma pessoa. O
              coletivo pode ser impetrado por partidos politicos, organizacoes
              sindicais, entidades de classe ou associacoes em defesa dos
              interesses dos seus membros (Art. 21, Lei 12.016/09).
            </div>
          </details>
        </div>
      </section>

      {/* ---- Related links ---- */}
      <nav aria-label="Paginas relacionadas" className="grid sm:grid-cols-3 gap-4">
        <a
          href="/advogados"
          className="rounded-xl border border-brand-line bg-white p-4 hover:shadow-card transition text-center"
        >
          <span className="block font-semibold text-brand-ink text-sm">
            Encontrar advogado
          </span>
          <span className="text-xs text-brand-ink/60 mt-1 block">
            Diretorio por cidade e area
          </span>
        </a>
        <a
          href="/calculadoras"
          className="rounded-xl border border-brand-line bg-white p-4 hover:shadow-card transition text-center"
        >
          <span className="block font-semibold text-brand-ink text-sm">
            Calculadoras juridicas
          </span>
          <span className="text-xs text-brand-ink/60 mt-1 block">
            Rescisao, FGTS, divida e mais
          </span>
        </a>
        <a
          href="/blog"
          className="rounded-xl border border-brand-line bg-white p-4 hover:shadow-card transition text-center"
        >
          <span className="block font-semibold text-brand-ink text-sm">
            Blog juridico
          </span>
          <span className="text-xs text-brand-ink/60 mt-1 block">
            Artigos e guias praticos
          </span>
        </a>
      </nav>
    </>
  );
}
