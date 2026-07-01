"use client";

import { useMemo, useState, type ReactNode } from "react";
import { FileText, Copy, Printer, Check, AlertTriangle, Sparkles, Loader2 } from "lucide-react";
import {
  INFRACOES,
  FASES,
  TESES_COMUNS,
  findInfracao,
  findFase,
  type Tese
} from "@/lib/data/multas";
import { printLegalDoc, downloadLegalDoc } from "@/lib/peca/documento";

/**
 * Gerador de Recurso de Multa — monta a peça por template (determinístico),
 * a partir das escolhas do usuário. Copiar e imprimir/salvar em PDF.
 * Nada é enviado: tudo roda no navegador.
 */

const INP =
  "w-full rounded-lg border-2 border-brand-line bg-white px-3 py-2 text-sm text-brand-ink focus:border-brand-accent focus:outline-none";

type Form = {
  nome: string;
  cpf: string;
  endereco: string;
  placa: string;
  ait: string;
  orgao: string;
  cidadeUf: string;
  data: string;
  fase: string;
  infracao: string;
  fatos: string;
};

const INIT: Form = {
  nome: "",
  cpf: "",
  endereco: "",
  placa: "",
  ait: "",
  orgao: "",
  cidadeUf: "",
  data: "",
  fase: "defesa-previa",
  infracao: "excesso-de-velocidade",
  fatos: ""
};

function tesesDaInfracao(slug: string): Array<{ key: string; tese: Tese }> {
  const inf = findInfracao(slug);
  if (!inf) return [];
  const lista = inf.teses
    .map((k) => ({ key: k, tese: TESES_COMUNS[k] }))
    .filter((x) => x.tese);
  if (inf.teseEspecifica) {
    lista.unshift({ key: `esp-${slug}`, tese: inf.teseEspecifica });
  }
  return lista;
}

function montarPeca(form: Form, tesesSelecionadas: Tese[]): string {
  const inf = findInfracao(form.infracao);
  const fase = findFase(form.fase);
  if (!inf || !fase) return "";

  const nome = form.nome.trim() || "[NOME COMPLETO DO REQUERENTE]";
  const cpf = form.cpf.trim() || "[CPF]";
  const endereco = form.endereco.trim() || "[ENDEREÇO COMPLETO]";
  const placa = form.placa.trim().toUpperCase() || "[PLACA]";
  const ait = form.ait.trim().toUpperCase() || "[Nº DO AUTO DE INFRAÇÃO — AIT]";
  const orgao = form.orgao.trim() || "[ÓRGÃO AUTUADOR]";
  const cidadeUf = form.cidadeUf.trim() || "[CIDADE/UF]";
  const data = form.data.trim() || "[DATA DA INFRAÇÃO]";

  const L: string[] = [];
  L.push(fase.enderecamento + (orgao !== "[ÓRGÃO AUTUADOR]" ? ` — ${orgao}` : ""));
  L.push("");
  L.push("");
  L.push(
    `${nome}, brasileiro(a), portador(a) do CPF nº ${cpf}, residente e domiciliado(a) em ${endereco}, na qualidade de proprietário(a)/condutor(a) do veículo de placa ${placa}, vem, respeitosamente, à presença de Vossa Senhoria, apresentar`
  );
  L.push("");
  L.push(fase.nomePeca);
  L.push("");
  L.push(
    `em face do Auto de Infração nº ${ait}, lavrado em ${data} pelo órgão ${orgao}, pelas razões de fato e de direito a seguir expostas.`
  );
  L.push("");
  L.push("I — DOS FATOS");
  L.push("");
  L.push(
    `O(a) requerente foi autuado(a) sob a alegação de ${inf.resumo} (${inf.artigo}). Discorda da autuação e requer sua revisão pelos fundamentos abaixo.`
  );
  if (form.fatos.trim()) {
    L.push("");
    L.push(form.fatos.trim());
  }
  L.push("");
  L.push("II — DOS FUNDAMENTOS");
  L.push("");
  if (tesesSelecionadas.length === 0) {
    L.push(
      "A autuação não observou os requisitos legais do devido processo administrativo de trânsito, razão pela qual deve ser revista."
    );
  } else {
    tesesSelecionadas.forEach((t, i) => {
      L.push(`${i + 1}. ${t.titulo}.`);
      L.push(t.texto);
      L.push(`(${t.base})`);
      L.push("");
    });
  }
  L.push("III — DOS PEDIDOS");
  L.push("");
  L.push("Diante do exposto, requer:");
  L.push(
    "a) o conhecimento e provimento do presente recurso, com o consequente cancelamento/arquivamento da autuação e da penalidade dela decorrente;"
  );
  L.push(
    "b) subsidiariamente, a anulação do auto de infração por vício formal, com a baixa da pontuação eventualmente lançada na CNH do(a) requerente;"
  );
  L.push("c) a juntada dos documentos em anexo (cópia da notificação, CRLV e CNH).");
  L.push("");
  L.push("Nestes termos, pede deferimento.");
  L.push("");
  L.push(`${cidadeUf}, ____ de __________________ de 20____.`);
  L.push("");
  L.push("");
  L.push("_______________________________________");
  L.push(`${nome}`);
  L.push(`CPF: ${cpf}`);
  return L.join("\n");
}

export function RecursoMultaWidget() {
  const [form, setForm] = useState<Form>(INIT);
  const [selKeys, setSelKeys] = useState<Set<string>>(() => {
    const t = tesesDaInfracao(INIT.infracao);
    return new Set(t.map((x) => x.key));
  });
  const [copied, setCopied] = useState(false);

  const tesesDisponiveis = useMemo(
    () => tesesDaInfracao(form.infracao),
    [form.infracao]
  );

  const set = (k: keyof Form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (k === "infracao") {
      const t = tesesDaInfracao(v);
      setSelKeys(new Set(t.map((x) => x.key)));
    }
  };

  const toggleTese = (key: string) => {
    setSelKeys((s) => {
      const n = new Set(s);
      if (n.has(key)) n.delete(key);
      else n.add(key);
      return n;
    });
  };

  const tesesSelecionadas = tesesDisponiveis
    .filter((x) => selKeys.has(x.key))
    .map((x) => x.tese);

  const peca = useMemo(
    () => montarPeca(form, tesesSelecionadas),
    [form, tesesSelecionadas]
  );

  const [aiTexto, setAiTexto] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiErro, setAiErro] = useState<string | null>(null);

  // Texto exibido/copiado/impresso: a versão da IA quando existir, senão a
  // peça montada por template.
  const exibido = aiTexto ?? peca;

  const gerarComIA = async () => {
    if (aiLoading) return;
    setAiLoading(true);
    setAiErro(null);
    try {
      const res = await fetch("/api/recurso-ia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modo: "completo",
          fase: form.fase,
          infracao: form.infracao,
          nome: form.nome,
          cpf: form.cpf,
          placa: form.placa,
          ait: form.ait,
          orgao: form.orgao,
          data: form.data,
          cidade: form.cidadeUf,
          relato: form.fatos
        })
      });
      const json = await res.json();
      if (json.ok && json.texto) setAiTexto(json.texto);
      else setAiErro(json.mensagem || "Não foi possível gerar agora. Use o modelo padrão.");
    } catch {
      setAiErro("Falha de conexão. Use o modelo padrão abaixo.");
    } finally {
      setAiLoading(false);
    }
  };

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(exibido);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard indisponível */
    }
  };

  const docMeta = () => {
    const fase = findFase(form.fase);
    return {
      title: fase ? fase.nomePeca : "Recurso de multa",
      sourceLine: `Recurso gerado em AdvAqui · ${new Date().toLocaleDateString("pt-BR")}`,
      footerNote:
        "Confira o prazo na sua notificação e anexe os documentos exigidos. Revise antes de protocolar — este é um modelo de apoio e não garante o deferimento."
    };
  };

  const imprimir = () => {
    printLegalDoc({ ...docMeta(), content: exibido });
  };

  const baixarWord = () => {
    downloadLegalDoc("recurso-de-multa", { ...docMeta(), content: exibido });
  };

  return (
    <section
      className="card mb-6 border-2 border-brand-accent/40"
      aria-label="Gerador de recurso de multa"
    >
      <h2 className="font-display text-xl font-bold text-brand-ink mb-1 inline-flex items-center gap-2">
        <FileText className="w-5 h-5 text-brand-deep" aria-hidden />
        Monte o seu recurso
      </h2>
      <p className="text-sm text-brand-ink/65 mb-4">
        Preencha os dados — o recurso é montado na hora, com a fundamentação do
        CTB. Nada é enviado: tudo acontece no seu navegador.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Fase do recurso">
          <select
            value={form.fase}
            onChange={(e) => set("fase", e.target.value)}
            className={INP}
          >
            {FASES.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Tipo de infração">
          <select
            value={form.infracao}
            onChange={(e) => set("infracao", e.target.value)}
            className={INP}
          >
            {INFRACOES.map((i) => (
              <option key={i.slug} value={i.slug}>
                {i.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Seu nome completo">
          <input className={INP} value={form.nome} onChange={(e) => set("nome", e.target.value)} placeholder="Nome do condutor/proprietário" />
        </Field>
        <Field label="CPF">
          <input className={INP} value={form.cpf} onChange={(e) => set("cpf", e.target.value)} placeholder="000.000.000-00" />
        </Field>
        <Field label="Placa do veículo">
          <input className={INP} value={form.placa} onChange={(e) => set("placa", e.target.value)} placeholder="ABC1D23" />
        </Field>
        <Field label="Nº do Auto de Infração (AIT)">
          <input className={INP} value={form.ait} onChange={(e) => set("ait", e.target.value)} placeholder="Como consta na notificação" />
        </Field>
        <Field label="Órgão autuador">
          <input className={INP} value={form.orgao} onChange={(e) => set("orgao", e.target.value)} placeholder="Ex.: DETRAN-MG, PRF, prefeitura" />
        </Field>
        <Field label="Data da infração">
          <input className={INP} value={form.data} onChange={(e) => set("data", e.target.value)} placeholder="DD/MM/AAAA" />
        </Field>
        <Field label="Cidade/UF (para a assinatura)">
          <input className={INP} value={form.cidadeUf} onChange={(e) => set("cidadeUf", e.target.value)} placeholder="Ex.: Almenara/MG" />
        </Field>
        <Field label="Seu endereço">
          <input className={INP} value={form.endereco} onChange={(e) => set("endereco", e.target.value)} placeholder="Rua, nº, bairro, cidade" />
        </Field>
      </div>

      <Field label="Relato dos fatos (opcional — o que aconteceu, na sua visão)" full>
        <textarea
          className={`${INP} min-h-[80px]`}
          value={form.fatos}
          onChange={(e) => set("fatos", e.target.value)}
          placeholder="Ex.: a placa de sinalização estava encoberta por uma árvore; eu não era o condutor; o radar não tinha aferição visível..."
        />
      </Field>

      {/* Teses */}
      <div className="mt-4">
        <p className="text-sm font-semibold text-brand-ink mb-2">
          Argumentos do recurso{" "}
          <span className="font-normal text-brand-ink/55">
            (marque só os que forem verdadeiros no seu caso)
          </span>
        </p>
        <div className="grid gap-2">
          {tesesDisponiveis.map(({ key, tese }) => {
            const checked = selKeys.has(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleTese(key)}
                className={`flex items-start gap-2 rounded-xl border-2 px-3 py-2.5 text-left text-sm transition ${
                  checked
                    ? "border-brand-accent bg-brand-accent/10 text-brand-ink"
                    : "border-brand-line bg-white text-brand-ink/75 hover:border-brand-accent/60"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    checked ? "border-brand-accent bg-brand-accent" : "border-brand-line"
                  }`}
                >
                  {checked && <Check className="w-3 h-3 text-white" aria-hidden />}
                </span>
                <span>
                  <span className="font-medium">{tese.titulo}</span>
                  <span className="block text-xs text-brand-ink/55 mt-0.5">{tese.base}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Botão de geração por IA */}
      <div className="mt-5">
        <button
          onClick={gerarComIA}
          disabled={aiLoading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-accent px-5 py-3 text-sm font-bold text-brand-ink hover:brightness-95 transition disabled:opacity-50"
        >
          {aiLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> Gerando...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" aria-hidden /> Gerar peça completa
            </>
          )}
        </button>
        <p className="text-[11px] text-brand-ink/50 mt-1.5 text-center">
          A peça é montada com a fundamentação do CTB a partir dos seus dados.
          Sempre revise antes de protocolar. Já existe o modelo padrão abaixo,
          disponível a qualquer momento.
        </p>
        {aiErro && (
          <p className="mt-2 rounded-lg border-l-4 border-amber-400 bg-amber-50 p-2.5 text-xs text-amber-900">
            {aiErro}
          </p>
        )}
      </div>

      {/* Pré-visualização */}
      <div className="mt-5">
        <div className="flex items-center justify-between gap-2 mb-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-ink/55 inline-flex items-center gap-1.5">
            {aiTexto ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-brand-accent2" aria-hidden /> Recurso completo gerado
              </>
            ) : (
              "Recurso gerado (modelo)"
            )}
          </p>
          <div className="flex gap-2">
            <button
              onClick={copiar}
              className="inline-flex items-center gap-1.5 rounded-lg border-2 border-brand-line px-3 py-1.5 text-xs font-semibold text-brand-ink hover:border-brand-deep transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden /> Copiado
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-brand-deep" aria-hidden /> Copiar
                </>
              )}
            </button>
            <button
              onClick={baixarWord}
              className="inline-flex items-center gap-1.5 rounded-lg border-2 border-brand-line px-3 py-1.5 text-xs font-semibold text-brand-ink hover:border-brand-deep transition"
            >
              <FileText className="w-3.5 h-3.5 text-brand-deep" aria-hidden /> Word
            </button>
            <button
              onClick={imprimir}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-deep px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-ink transition"
            >
              <Printer className="w-3.5 h-3.5" aria-hidden /> Imprimir / PDF
            </button>
          </div>
        </div>
        <pre className="rounded-xl bg-brand-deep/5 border border-brand-deep/20 p-4 text-xs text-brand-ink/90 whitespace-pre-wrap font-mono leading-relaxed max-h-96 overflow-auto">
          {exibido}
        </pre>
        {aiTexto && (
          <button
            onClick={() => setAiTexto(null)}
            className="mt-2 text-xs text-brand-ink/55 hover:text-brand-deep transition underline"
          >
            Voltar ao modelo padrão
          </button>
        )}
      </div>

      <aside
        role="note"
        className="mt-4 rounded-xl border-l-4 border-amber-400 bg-amber-50 p-3 text-xs text-amber-900 leading-relaxed flex items-start gap-2"
      >
        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden />
        <span>
          Este é um modelo para você revisar e adaptar — não garante o
          deferimento. Confira o prazo na sua notificação (em regra, 30 dias),
          anexe os documentos e use só os argumentos verdadeiros no seu caso. Em
          situações como lei seca, recusa de bafômetro ou suspensão da CNH, vale
          procurar um advogado.
        </span>
      </aside>
    </section>
  );
}

function Field({
  label,
  children,
  full
}: {
  label: string;
  children: ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "mt-4" : ""}>
      <label className="block text-sm font-medium text-brand-ink mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}
