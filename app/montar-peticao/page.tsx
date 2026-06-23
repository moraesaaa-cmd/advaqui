"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  FileText,
  ArrowRight,
  ArrowLeft,
  Copy,
  AlertTriangle,
  Scale,
  Users,
  ShoppingCart,
  Banknote,
  Search
} from "lucide-react";

/**
 * /montar-peticao — Robô de peças (gerador de rascunhos guiado).
 *
 * Monta o ESQUELETO de uma peça/documento jurídico a partir de um modelo +
 * dados informados pelo usuário. NÃO é peça pronta para protocolo nem
 * aconselhamento jurídico: é um rascunho educativo, com placeholders entre
 * colchetes, para a pessoa levar a um advogado. Termina com captação para o
 * diretório (encontrar advogado na cidade).
 *
 * Tudo client-side, determinístico, sem IA externa e sem gravar nada — assim
 * não há envio de dados pessoais a terceiros (LGPD) e o texto é previsível.
 * Os modelos são genéricos e propositalmente conservadores.
 */

type Field = {
  key: string;
  label: string;
  placeholder?: string;
  textarea?: boolean;
};

type DocType = {
  id: string;
  label: string;
  desc: string;
  Icon: typeof Scale;
  extra: Field[];
  build: (v: Record<string, string>) => string;
};

const g = (v: Record<string, string>, k: string, fb = "[preencher]") =>
  (v[k] && v[k].trim()) || fb;

const COMUNS_PETICAO: Field[] = [
  { key: "autor", label: "Seu nome completo", placeholder: "Ex.: Maria Joana da Silva" },
  {
    key: "autorQualif",
    label: "Sua qualificação",
    placeholder: "nacionalidade, estado civil, profissão, CPF, endereço",
    textarea: true
  },
  { key: "reu", label: "Nome da parte contrária", placeholder: "Pessoa ou empresa" },
  {
    key: "reuQualif",
    label: "Qualificação / endereço da parte contrária",
    placeholder: "CNPJ/CPF e endereço, se souber",
    textarea: true
  },
  { key: "foro", label: "Cidade do fórum (comarca)", placeholder: "Ex.: Almenara/MG" },
  {
    key: "fatos",
    label: "Conte o que aconteceu (os fatos)",
    placeholder: "Descreva com suas palavras, em ordem, o que ocorreu.",
    textarea: true
  }
];

function cabecalho(v: Record<string, string>, acao: string): string {
  return `EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA ___ª VARA ___ DA COMARCA DE ${g(
    v,
    "foro"
  )}\n\n\n${g(v, "autor")}, ${g(
    v,
    "autorQualif",
    "[nacionalidade, estado civil, profissão, CPF e endereço]"
  )}, vem, respeitosamente, à presença de Vossa Excelência, por meio de advogado(a) que esta subscreve, propor a presente\n\n${acao.toUpperCase()}\n\nem face de ${g(
    v,
    "reu"
  )}, ${g(v, "reuQualif", "[qualificação/endereço]")}, pelos fatos e fundamentos a seguir expostos.`;
}

function rodape(v: Record<string, string>): string {
  return `IV - DAS PROVAS\n\nProtesta provar o alegado por todos os meios de prova em direito admitidos, em especial documentos, depoimento pessoal e testemunhas.\n\nV - DO VALOR DA CAUSA\n\nDá-se à causa o valor de R$ [valor].\n\nNestes termos,\nPede deferimento.\n\n${g(
    v,
    "foro",
    "[cidade]"
  )}, [data].\n\n_______________________________________\n${g(
    v,
    "autor",
    "[nome do advogado]"
  )} — OAB/[UF] [número]`;
}

const DOC_TYPES: DocType[] = [
  {
    id: "trabalhista",
    label: "Reclamação trabalhista",
    desc: "Verbas rescisórias, horas extras, registro em carteira.",
    Icon: Scale,
    extra: [
      { key: "funcao", label: "Função exercida", placeholder: "Ex.: auxiliar de produção" },
      { key: "periodo", label: "Período trabalhado", placeholder: "Ex.: 03/2022 a 01/2026" },
      { key: "salario", label: "Último salário", placeholder: "Ex.: R$ 1.800,00" }
    ],
    build: (v) =>
      `${cabecalho(v, "Reclamação Trabalhista")}\n\nI - DOS FATOS\n\nO(a) reclamante foi admitido(a) para exercer a função de ${g(
        v,
        "funcao"
      )}, no período de ${g(v, "periodo")}, percebendo último salário de ${g(
        v,
        "salario"
      )}.\n\n${g(
        v,
        "fatos",
        "[descreva o que aconteceu: demissão, verbas não pagas, horas extras etc.]"
      )}\n\nII - DO DIREITO\n\nOs fatos narrados encontram amparo na Consolidação das Leis do Trabalho (CLT) e na Constituição Federal (art. 7º). [Indique aqui, com seu advogado, os dispositivos aplicáveis ao caso — verbas rescisórias, FGTS, horas extras etc.]\n\nIII - DOS PEDIDOS\n\nRequer a procedência dos pedidos para condenar a reclamada ao pagamento das verbas devidas [especifique: saldo de salário, aviso prévio, 13º, férias + 1/3, FGTS + 40%, horas extras], com reflexos, juros e correção.\n\n${rodape(
        v
      )}`
  },
  {
    id: "alimentos",
    label: "Ação de alimentos",
    desc: "Pensão alimentícia para filho(a) ou dependente.",
    Icon: Users,
    extra: [
      { key: "alimentando", label: "Nome de quem vai receber", placeholder: "Ex.: filho(a) menor" },
      { key: "valor", label: "Valor pretendido", placeholder: "Ex.: 30% do salário mínimo" }
    ],
    build: (v) =>
      `${cabecalho(v, "Ação de Alimentos")}\n\nI - DOS FATOS\n\nTrata-se de pedido de alimentos em favor de ${g(
        v,
        "alimentando"
      )}, em razão do vínculo de parentesco/dependência com a parte requerida.\n\n${g(
        v,
        "fatos",
        "[descreva a relação, a necessidade de quem recebe e a possibilidade de quem paga]"
      )}\n\nII - DO DIREITO\n\nO dever de prestar alimentos decorre dos arts. 1.694 e seguintes do Código Civil e do princípio da proporcionalidade entre necessidade e possibilidade. [Ajuste com seu advogado.]\n\nIII - DOS PEDIDOS\n\nRequer a fixação de alimentos no valor de ${g(
        v,
        "valor"
      )}, bem como alimentos provisórios desde a citação. [Inclua guarda/visitas se for o caso.]\n\n${rodape(
        v
      )}`
  },
  {
    id: "consumidor",
    label: "Ação de consumo",
    desc: "Produto/serviço com defeito, cobrança indevida.",
    Icon: ShoppingCart,
    extra: [
      { key: "produto", label: "Produto ou serviço", placeholder: "Ex.: celular / plano de internet" },
      { key: "valor", label: "Valor envolvido", placeholder: "Ex.: R$ 2.500,00" }
    ],
    build: (v) =>
      `${cabecalho(v, "Ação de Reparação (Relação de Consumo)")}\n\nI - DOS FATOS\n\nO(a) autor(a) adquiriu/contratou ${g(
        v,
        "produto"
      )}, no valor de ${g(
        v,
        "valor"
      )}.\n\n${g(
        v,
        "fatos",
        "[descreva o defeito/cobrança, as tentativas de solução e a resposta da empresa]"
      )}\n\nII - DO DIREITO\n\nA relação é regida pelo Código de Defesa do Consumidor (Lei 8.078/90), com destaque para a responsabilidade do fornecedor e a inversão do ônus da prova (art. 6º, VIII). [Ajuste com seu advogado.]\n\nIII - DOS PEDIDOS\n\nRequer a procedência para [restituição/troca/abstenção de cobrança] e a condenação por danos morais, se cabíveis.\n\n${rodape(
        v
      )}`
  },
  {
    id: "cobranca",
    label: "Notificação de cobrança",
    desc: "Cobrar amigavelmente antes de ir à Justiça (carta).",
    Icon: Banknote,
    extra: [
      { key: "valor", label: "Valor devido", placeholder: "Ex.: R$ 1.200,00" },
      { key: "vencimento", label: "Vencimento / origem da dívida", placeholder: "Ex.: contrato de 10/01/2026" },
      { key: "prazo", label: "Prazo que você dá para pagar", placeholder: "Ex.: 10 dias" }
    ],
    build: (v) =>
      `NOTIFICAÇÃO EXTRAJUDICIAL DE COBRANÇA\n\nDe: ${g(v, "autor")}, ${g(
        v,
        "autorQualif",
        "[qualificação]"
      )}\nPara: ${g(v, "reu")}, ${g(v, "reuQualif", "[endereço]")}\n\nPrezado(a) Senhor(a),\n\nPela presente, fica V.Sa. NOTIFICADO(A) de que consta em aberto o débito no valor de ${g(
        v,
        "valor"
      )}, referente a ${g(
        v,
        "vencimento"
      )}.\n\n${g(
        v,
        "fatos",
        "[descreva a origem da dívida e as tentativas anteriores de cobrança]"
      )}\n\nFica V.Sa. notificado(a) a efetuar o pagamento no prazo de ${g(
        v,
        "prazo",
        "[prazo]"
      )}, a contar do recebimento desta, sob pena de adoção das medidas judiciais cabíveis, incluindo a inscrição do débito e a propositura de ação de cobrança/execução, com acréscimo de juros, correção e honorários.\n\nÀ disposição para um acordo amigável.\n\n${g(
        v,
        "foro",
        "[cidade]"
      )}, [data].\n\n_______________________________________\n${g(v, "autor")}`
  }
];

export default function MontarPeticaoPage() {
  const [typeId, setTypeId] = useState<string | null>(null);
  const [v, setV] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const docType = DOC_TYPES.find((d) => d.id === typeId) || null;
  const fields: Field[] = docType ? [...COMUNS_PETICAO, ...docType.extra] : [];

  const draft = useMemo(
    () => (docType ? docType.build(v) : ""),
    [docType, v]
  );

  const setField = (k: string, val: string) => setV((p) => ({ ...p, [k]: val }));

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const reset = () => {
    setTypeId(null);
    setV({});
    setShowResult(false);
  };

  return (
    <main className="container-narrow py-10 md:py-14">
      <div className="text-center mb-6">
        <span className="chip border-brand-deep/30 bg-brand-deep/5 text-brand-ink mb-3">
          <FileText className="w-3.5 h-3.5" aria-hidden /> Montar peça
        </span>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink text-balance">
          Monte o rascunho da sua peça
        </h1>
        <p className="text-brand-ink/70 mt-3 max-w-xl mx-auto">
          Escolha o tipo, preencha os dados e receba um rascunho organizado para
          revisar com um advogado. Rápido, e sem enviar seus dados para lugar
          nenhum.
        </p>
      </div>

      {/* Aviso legal — sempre visível */}
      <div className="flex items-start gap-2 text-sm p-3 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 mb-6">
        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden />
        <span>
          Este é um <strong>modelo educativo</strong>, não uma peça pronta para
          protocolo nem orientação jurídica. Cada caso tem detalhes próprios —
          revise com um advogado antes de usar.
        </span>
      </div>

      {/* Passo 1 — escolher tipo */}
      {!docType && (
        <div className="grid sm:grid-cols-2 gap-3">
          {DOC_TYPES.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => {
                setTypeId(d.id);
                setShowResult(false);
              }}
              className="card text-left hover:border-brand-deep transition flex items-start gap-3"
            >
              <span className="w-10 h-10 rounded-xl bg-brand-accent/15 flex items-center justify-center shrink-0">
                <d.Icon className="w-5 h-5 text-brand-deep" aria-hidden />
              </span>
              <span>
                <span className="block font-display font-bold text-brand-ink">
                  {d.label}
                </span>
                <span className="block text-sm text-brand-ink/65 mt-0.5">
                  {d.desc}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Passo 2 — formulário */}
      {docType && !showResult && (
        <div className="card space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-brand-ink">
              {docType.label}
            </h2>
            <button type="button" onClick={reset} className="btn-ghost text-xs">
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden /> Trocar tipo
            </button>
          </div>

          {fields.map((f) => (
            <div key={f.key}>
              <label className="label" htmlFor={f.key}>{f.label}</label>
              {f.textarea ? (
                <textarea
                  id={f.key}
                  className="input min-h-[90px]"
                  placeholder={f.placeholder}
                  value={v[f.key] || ""}
                  onChange={(e) => setField(f.key, e.target.value)}
                />
              ) : (
                <input
                  id={f.key}
                  className="input"
                  placeholder={f.placeholder}
                  value={v[f.key] || ""}
                  onChange={(e) => setField(f.key, e.target.value)}
                />
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => setShowResult(true)}
            className="btn-primary w-full"
          >
            Gerar rascunho <ArrowRight className="w-4 h-4" aria-hidden />
          </button>
        </div>
      )}

      {/* Passo 3 — resultado */}
      {docType && showResult && (
        <div className="space-y-5">
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-xl font-bold text-brand-ink">
                Rascunho — {docType.label}
              </h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowResult(false)}
                  className="btn-ghost text-xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" aria-hidden /> Editar
                </button>
                <button type="button" onClick={copy} className="btn-ghost text-xs">
                  <Copy className="w-3.5 h-3.5" aria-hidden />
                  {copied ? "Copiado!" : "Copiar"}
                </button>
              </div>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-brand-ink/85 font-mono leading-relaxed bg-brand-bg/30 border border-brand-line rounded-xl p-4 overflow-x-auto">
              {draft}
            </pre>
            <p className="text-xs text-brand-ink/50 mt-2">
              Os trechos entre [colchetes] e ___ devem ser completados. Texto
              gerado no seu navegador — nada é salvo ou enviado.
            </p>
          </div>

          {/* Captação — encontrar advogado */}
          <div className="rounded-2xl border-2 border-brand-accent bg-brand-accent/5 p-5 text-center">
            <h3 className="font-display text-lg font-bold text-brand-ink">
              Quer um advogado para revisar e protocolar?
            </h3>
            <p className="text-sm text-brand-ink/75 mt-1.5 mb-4">
              Um rascunho ajuda a organizar — mas quem garante o melhor caminho é
              um advogado. Encontre profissionais na sua cidade no AdvAqui.
            </p>
            <Link href="/advogados" className="btn-accent inline-flex items-center gap-2">
              <Search className="w-4 h-4" aria-hidden /> Encontrar um advogado
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
