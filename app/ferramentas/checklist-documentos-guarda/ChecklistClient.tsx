"use client";

import { useState, useMemo, useCallback, type FormEvent } from "react";
import {
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
  Send,
  Phone,
  MapPin,
  FileText,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

type ChecklistItem = {
  id: string;
  text: string;
  help: string;
};

const ITEMS: ChecklistItem[] = [
  {
    id: "certidao-nascimento",
    text: "Certidão de nascimento da criança",
    help: "Documento obrigatório para comprovar filiação.",
  },
  {
    id: "rg-cpf",
    text: "RG e CPF do requerente",
    help: "Documentos de identificação de quem pede a guarda.",
  },
  {
    id: "comprovante-residencia",
    text: "Comprovante de residência",
    help: "Para demonstrar condições de moradia adequadas.",
  },
  {
    id: "comprovante-renda",
    text: "Comprovante de renda",
    help: "Holerite, declaração de IR ou extrato bancário dos últimos 3 meses.",
  },
  {
    id: "matricula-escolar",
    text: "Comprovante de matrícula escolar",
    help: "Se a criança está em idade escolar, comprove que ela frequenta a escola.",
  },
  {
    id: "laudos",
    text: "Laudos médicos/psicológicos (se houver)",
    help: "Documentos que demonstrem necessidades especiais ou situações relevantes.",
  },
  {
    id: "provas-convivencia",
    text: "Provas de convivência com a criança",
    help: "Fotos, mensagens, comprovantes de atividades juntos.",
  },
  {
    id: "dados-genitor",
    text: "Dados completos do outro genitor",
    help: "Nome, CPF, endereço para citação judicial.",
  },
  {
    id: "tipo-guarda",
    text: "Definir tipo de guarda pretendida",
    help: "Compartilhada (regra geral no Brasil, Art. 1.584 CC) ou unilateral (casos excepcionais).",
  },
  {
    id: "testemunhas",
    text: "Testemunhas (se necessário)",
    help: "Pessoas que conheçam a rotina da criança e possam depor sobre as condições.",
  },
];

const TOTAL = ITEMS.length;

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function ChecklistClient() {
  /* Checklist state */
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

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

  const count = checked.size;
  const pct = Math.round((count / TOTAL) * 100);

  /* Form state */
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cidade, setCidade] = useState("");
  const [resumo, setResumo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formResult, setFormResult] = useState<{
    ok: boolean;
    msg: string;
  } | null>(null);

  const canSubmit = useMemo(
    () => nome.trim().length >= 2 && telefone.trim().length >= 8,
    [nome, telefone]
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!canSubmit || submitting) return;

      setSubmitting(true);
      setFormResult(null);

      try {
        const res = await fetch("/api/leads/capture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: nome.trim(),
            telefone: telefone.trim(),
            cidade: cidade.trim() || undefined,
            resumo: resumo.trim() || undefined,
            area_juridica: "Família",
            origem: "/ferramentas/checklist-documentos-guarda",
            ferramenta: "checklist-documentos-guarda",
            metadata: {
              itens_marcados: count,
              itens_total: TOTAL,
            },
          }),
        });

        const data = await res.json();
        if (data.ok) {
          setFormResult({
            ok: true,
            msg: "Recebemos seu pedido. Um advogado entrará em contato em breve.",
          });
          setNome("");
          setTelefone("");
          setCidade("");
          setResumo("");
        } else {
          setFormResult({
            ok: false,
            msg: data.error || "Erro ao enviar. Tente novamente.",
          });
        }
      } catch {
        setFormResult({
          ok: false,
          msg: "Erro de conexão. Verifique sua internet e tente novamente.",
        });
      } finally {
        setSubmitting(false);
      }
    },
    [canSubmit, submitting, nome, telefone, cidade, resumo, count]
  );

  return (
    <>
      {/* ---- Progress bar ---- */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-brand-ink">
            {count} de {TOTAL} itens marcados
          </span>
          <span className="text-sm font-bold text-brand-deep">{pct}%</span>
        </div>
        <div
          className="w-full h-3 rounded-full bg-brand-line/40 overflow-hidden"
          role="progressbar"
          aria-valuenow={count}
          aria-valuemin={0}
          aria-valuemax={TOTAL}
          aria-label={`Progresso: ${count} de ${TOTAL} itens marcados`}
        >
          <div
            className="h-full rounded-full bg-brand-deep transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* ---- Checklist ---- */}
      <section className="card mb-6" aria-label="Checklist de documentos">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-4 inline-flex items-center gap-2">
          <FileText className="w-5 h-5 text-brand-deep" aria-hidden />
          Documentos e preparação
        </h2>
        <ul className="space-y-1">
          {ITEMS.map((item) => {
            const isChecked = checked.has(item.id);
            const isExpanded = expanded.has(item.id);
            return (
              <li key={item.id} className="border-b border-brand-line/30 last:border-b-0">
                <div className="flex items-start gap-3 py-3">
                  <button
                    type="button"
                    onClick={() => toggleCheck(item.id)}
                    className="flex-shrink-0 mt-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-deep rounded"
                    aria-label={
                      isChecked
                        ? `Desmarcar: ${item.text}`
                        : `Marcar: ${item.text}`
                    }
                  >
                    {isChecked ? (
                      <CheckSquare className="w-5 h-5 text-green-600" />
                    ) : (
                      <Square className="w-5 h-5 text-brand-ink/40" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => toggleExpand(item.id)}
                      className={`flex items-center gap-2 w-full text-left text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-deep rounded ${
                        isChecked
                          ? "text-brand-ink/50 line-through"
                          : "text-brand-ink"
                      }`}
                      aria-expanded={isExpanded}
                    >
                      <span className="flex-1">{item.text}</span>
                      {isExpanded ? (
                        <ChevronUp
                          className="w-4 h-4 text-brand-ink/40 flex-shrink-0"
                          aria-hidden
                        />
                      ) : (
                        <ChevronDown
                          className="w-4 h-4 text-brand-ink/40 flex-shrink-0"
                          aria-hidden
                        />
                      )}
                    </button>
                    {isExpanded && (
                      <p className="text-sm text-brand-ink/65 mt-1.5 leading-relaxed pl-0.5">
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

      {/* ---- Result summary (after 3+ items) ---- */}
      {count >= 3 && (
        <section className="card mb-6" aria-live="polite">
          <h2 className="font-display text-lg font-bold text-brand-ink mb-2">
            Resumo
          </h2>
          <p className="text-sm text-brand-ink/80 mb-3">
            Você completou{" "}
            <strong>
              {count} de {TOTAL}
            </strong>{" "}
            itens.
          </p>
          {pct < 50 ? (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
              <span className="text-amber-600 text-lg leading-none" aria-hidden>
                !
              </span>
              <p className="text-sm text-amber-800">
                Ainda faltam documentos importantes. Reúna o que puder antes de
                procurar o advogado — isso acelera o processo e pode reduzir
                custos.
              </p>
            </div>
          ) : (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-green-50 border border-green-200">
              <span
                className="text-green-600 text-lg leading-none"
                aria-hidden
              >
                &#10003;
              </span>
              <p className="text-sm text-green-800">
                Boa parte da documentação está pronta. O próximo passo é
                consultar um advogado de Família para dar entrada na ação.
              </p>
            </div>
          )}
        </section>
      )}

      {/* ---- Lead capture form ---- */}
      <section className="card mb-6" id="orientacao">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-1">
          Precisa de orientação profissional?
        </h2>
        <p className="text-sm text-brand-ink/70 mb-5 leading-relaxed">
          Preencha abaixo e um advogado de Família entrará em contato para
          orientar seu caso. Sem compromisso.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Nome */}
          <div>
            <label
              htmlFor="lead-nome"
              className="block text-sm font-medium text-brand-ink mb-1"
            >
              Nome <span className="text-red-500">*</span>
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
              className="w-full rounded-lg border border-brand-line px-3 py-2.5 text-sm text-brand-ink bg-white placeholder:text-brand-ink/35 focus:outline-none focus:ring-2 focus:ring-brand-deep focus:border-brand-deep"
            />
          </div>

          {/* Telefone */}
          <div>
            <label
              htmlFor="lead-telefone"
              className="block text-sm font-medium text-brand-ink mb-1"
            >
              <Phone
                className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5"
                aria-hidden
              />
              Telefone <span className="text-red-500">*</span>
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
              className="w-full rounded-lg border border-brand-line px-3 py-2.5 text-sm text-brand-ink bg-white placeholder:text-brand-ink/35 focus:outline-none focus:ring-2 focus:ring-brand-deep focus:border-brand-deep"
            />
          </div>

          {/* Cidade */}
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
              maxLength={120}
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              placeholder="Ex: Belo Horizonte"
              className="w-full rounded-lg border border-brand-line px-3 py-2.5 text-sm text-brand-ink bg-white placeholder:text-brand-ink/35 focus:outline-none focus:ring-2 focus:ring-brand-deep focus:border-brand-deep"
            />
          </div>

          {/* Resumo */}
          <div>
            <label
              htmlFor="lead-resumo"
              className="block text-sm font-medium text-brand-ink mb-1"
            >
              Resumo do caso{" "}
              <span className="text-brand-ink/50 font-normal">(opcional)</span>
            </label>
            <textarea
              id="lead-resumo"
              maxLength={2000}
              rows={3}
              value={resumo}
              onChange={(e) => setResumo(e.target.value)}
              placeholder="Descreva brevemente sua situação..."
              className="w-full rounded-lg border border-brand-line px-3 py-2.5 text-sm text-brand-ink bg-white placeholder:text-brand-ink/35 focus:outline-none focus:ring-2 focus:ring-brand-deep focus:border-brand-deep resize-y"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold text-white bg-brand-deep hover:bg-brand-deep/90 disabled:opacity-50 disabled:cursor-not-allowed transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-deep focus-visible:ring-offset-2"
          >
            <Send className="w-4 h-4" aria-hidden />
            {submitting ? "Enviando..." : "Receber orientação gratuita"}
          </button>

          {/* Form result */}
          {formResult && (
            <div
              role="alert"
              className={`p-3 rounded-lg text-sm ${
                formResult.ok
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              {formResult.msg}
            </div>
          )}
        </form>

        {/* WhatsApp CTA */}
        <div className="mt-5 pt-4 border-t border-brand-line/40">
          <a
            href="https://wa.me/5538999999999?text=Ol%C3%A1%2C%20vim%20do%20checklist%20de%20guarda%20do%20AdvAqui%20e%20preciso%20de%20orienta%C3%A7%C3%A3o."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-green-600 hover:bg-green-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
          >
            <Phone className="w-4 h-4" aria-hidden />
            Falar pelo WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
