"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Stethoscope,
  ChevronLeft,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileSearch,
  ArrowRight,
  Scale,
  Calculator
} from "lucide-react";

/**
 * Diagnóstico trabalhista — simulador interativo e DETERMINÍSTICO.
 *
 * A pessoa responde algumas perguntas (o que aconteceu, quando, registro,
 * tempo de casa, provas, urgência) e o componente monta um diagnóstico
 * INDICATIVO: prováveis direitos, alerta de prazo, o que as provas mostram e
 * os próximos passos. Tudo roda no navegador — nada é enviado nem gravado.
 *
 * IMPORTANTE — é orientação informativa, não parecer jurídico. O texto sempre
 * fala em "indícios" e "em regra", nunca promete resultado. Cada situação tem
 * exceções que só um advogado avalia olhando o caso concreto.
 *
 * Sem IA externa: a lógica é regra fixa, escrita à mão a partir da CLT e da
 * Constituição. Quando não há regra fechada (ex.: valor de dano moral), o
 * resultado deixa isso explícito.
 */

type Situacao = {
  value: string;
  label: string;
  /** Direito-síntese exibido no título do resultado ("fortes indícios de…"). */
  manchete: string;
  /** Lista de prováveis direitos/verbas daquela situação. */
  direitos: string[];
  /** O que NÃO costuma caber (pra não criar expectativa errada). */
  naoCabe?: string[];
  /** Passos práticos específicos da situação. */
  passos: string[];
  /** Base legal curta citada no resultado. */
  base: string;
  /** Calculadora relacionada (link interno), quando faz sentido. */
  calc?: { slug: string; label: string };
  /** Slug de um guia em /problemas-juridicos, quando existir. */
  problema?: string;
};

const SITUACOES: Situacao[] = [
  {
    value: "demissao-sem-justa-causa",
    label: "Fui demitido(a) sem justa causa",
    manchete:
      "verbas rescisórias completas, multa de 40% do FGTS e seguro-desemprego",
    direitos: [
      "Saldo de salário (dias trabalhados no mês da saída)",
      "Aviso prévio (30 dias + 3 dias por ano trabalhado, até 90 dias)",
      "13º salário proporcional",
      "Férias proporcionais + 1/3 (e vencidas, se houver)",
      "Saque do FGTS + multa de 40% sobre o saldo",
      "Guias do seguro-desemprego (se preencher os requisitos)"
    ],
    passos: [
      "Confira o Termo de Rescisão (TRCT) verba por verba",
      "Peça/baixe o extrato do FGTS e os últimos holerites",
      "Calcule por baixo quanto deveria receber e compare com o que pagaram"
    ],
    base: "CLT arts. 477 e 487; Lei 8.036/1990 (FGTS); CF art. 7º.",
    calc: { slug: "rescisao-trabalhista", label: "Calcular a rescisão" }
  },
  {
    value: "pedido-demissao",
    label: "Pedi demissão",
    manchete: "saldo de salário, 13º e férias proporcionais",
    direitos: [
      "Saldo de salário",
      "13º salário proporcional",
      "Férias proporcionais + 1/3 (e vencidas, se houver)"
    ],
    naoCabe: [
      "Multa de 40% do FGTS",
      "Saque do FGTS (em regra) e seguro-desemprego",
      "Aviso prévio indenizado pela empresa — quem pede demissão cumpre o aviso ou tem o valor descontado"
    ],
    passos: [
      "Verifique se o acerto saiu no prazo (até 10 dias da saída)",
      "Confira se descontaram o aviso prévio indevidamente",
      "Guarde o comprovante do pedido de demissão"
    ],
    base: "CLT arts. 477, 487 e 488."
  },
  {
    value: "demissao-justa-causa",
    label: "Fui demitido(a) por justa causa",
    manchete:
      "verbas limitadas — mas vale checar se a justa causa foi correta",
    direitos: [
      "Saldo de salário",
      "Férias vencidas + 1/3 (período completo já adquirido), se houver"
    ],
    naoCabe: [
      "13º e férias proporcionais, aviso prévio e multa do FGTS (em regra não cabem na justa causa)"
    ],
    passos: [
      "Anote exatamente o motivo que a empresa alegou",
      "A justa causa exige falta grave, proporcional e imediata — se foi exagerada ou genérica, pode ser revertida na Justiça",
      "Reverter a justa causa transforma o acerto no de uma dispensa SEM justa causa (com tudo a que ela dá direito)"
    ],
    base: "CLT art. 482 (hipóteses de justa causa)."
  },
  {
    value: "verbas-nao-pagas",
    label: "Não recebi verbas, acerto ou salário",
    manchete: "cobrança das verbas atrasadas, com correção e juros",
    direitos: [
      "As verbas/salários não pagos, corrigidos e com juros",
      "Multa do art. 477 se o acerto da rescisão atrasou",
      "Atraso reiterado de salário pode dar rescisão indireta (a 'justa causa do patrão'), com direito às verbas de dispensa sem justa causa"
    ],
    passos: [
      "Liste cada valor em atraso com a data que deveria ter sido pago",
      "Reúna holerites, extratos e qualquer recibo",
      "Se ainda trabalha, avalie a rescisão indireta com um advogado antes de pedir as contas"
    ],
    base: "CLT arts. 477 (§ 8º) e 483; CF art. 7º.",
    calc: { slug: "atualizacao-divida", label: "Atualizar um valor em atraso" }
  },
  {
    value: "horas-extras",
    label: "Faço horas extras que não são pagas (ou pagas errado)",
    manchete: "horas extras com adicional e reflexos, dos últimos 5 anos",
    direitos: [
      "Adicional de 50% (dia comum) ou 100% (domingo/feriado) sobre a hora",
      "Reflexos em DSR, 13º, férias + 1/3 e FGTS quando habituais",
      "Cobrança retroativa dos últimos 5 anos"
    ],
    passos: [
      "Anote seus horários reais de entrada e saída, dia a dia",
      "Guarde cartões de ponto, prints de sistema, mensagens combinando horário",
      "Testemunhas (colegas) costumam ser decisivas nessas ações"
    ],
    base: "CLT arts. 58 a 61; CF art. 7º, XVI e XXIX (5 anos).",
    calc: { slug: "horas-extras", label: "Calcular horas extras" }
  },
  {
    value: "assedio",
    label: "Sofri assédio moral ou sexual no trabalho",
    manchete:
      "indenização por dano moral e possível rescisão indireta",
    direitos: [
      "Indenização por dano moral (o valor é fixado pelo juiz, caso a caso — não há tabela)",
      "Rescisão indireta: sair com os direitos de uma dispensa sem justa causa",
      "Assédio sexual também é crime — cabe boletim de ocorrência, em paralelo"
    ],
    passos: [
      "Registre datas, locais, o que foi dito e quem presenciou",
      "Salve mensagens, e-mails e áudios; identifique testemunhas",
      "Procure um advogado antes de pedir as contas, para garantir a rescisão indireta"
    ],
    base: "CLT art. 483; CF art. 5º, X; Código Penal art. 216-A (assédio sexual)."
  },
  {
    value: "acidente-doenca",
    label: "Tive acidente ou doença ligada ao trabalho",
    manchete:
      "estabilidade de 12 meses, benefício acidentário e indenização",
    direitos: [
      "Estabilidade de 12 meses no emprego após a alta (não pode ser demitido sem justa causa nesse período)",
      "Auxílio por incapacidade temporária acidentário e, se for o caso, auxílio-acidente",
      "FGTS depositado durante o afastamento por acidente",
      "Indenização por danos morais, materiais e estéticos, conforme o caso"
    ],
    passos: [
      "Exija a emissão da CAT (Comunicação de Acidente de Trabalho) — você mesmo pode emitir",
      "Guarde atestados, laudos, exames e o histórico no INSS",
      "O nexo entre a doença e o trabalho é o ponto central — junte tudo que prove a relação"
    ],
    base: "Lei 8.213/1991 arts. 19, 22, 118; Súmula 378 do TST."
  },
  {
    value: "sem-registro",
    label: "Trabalho/trabalhei sem registro em carteira",
    manchete:
      "reconhecimento de vínculo e todas as verbas do período",
    direitos: [
      "Reconhecimento do vínculo e anotação na carteira (CTPS)",
      "Todas as verbas do período: férias + 1/3, 13º, FGTS, eventuais horas extras",
      "Recolhimento do FGTS e do INSS de todo o período trabalhado"
    ],
    passos: [
      "Junte qualquer prova do trabalho: mensagens, fardamento, depósitos, e-mails, fotos",
      "Anote a data de início, a função e quanto recebia",
      "Testemunhas que confirmem a rotina são muito importantes aqui"
    ],
    base: "CLT arts. 2º, 3º e 29; CF art. 7º."
  },
  {
    value: "desvio-funcao",
    label: "Acúmulo ou desvio de função",
    manchete: "diferenças salariais pela função efetivamente exercida",
    direitos: [
      "Diferenças salariais quando você exerce função mais bem paga do que a registrada",
      "Acúmulo de duas funções pode gerar acréscimo no salário",
      "Reflexos das diferenças em 13º, férias e FGTS"
    ],
    passos: [
      "Descreva em detalhe o que você realmente faz no dia a dia",
      "Compare com a descrição do seu cargo registrado",
      "Reúna provas das tarefas extras (mensagens, escalas, e-mails)"
    ],
    base: "CLT art. 456, parágrafo único; princípio da primazia da realidade."
  }
];

type Prazo = {
  value: string;
  label: string;
  tipo: "ok" | "atencao" | "alerta";
  texto: string;
};

const PRAZOS: Prazo[] = [
  {
    value: "ainda-trabalho",
    label: "Ainda trabalho na empresa",
    tipo: "ok",
    texto:
      "Você ainda está na empresa. Pode cobrar os últimos 5 anos; o prazo de 2 anos só passa a contar quando o contrato terminar."
  },
  {
    value: "ate-1-ano",
    label: "Saí há menos de 1 ano",
    tipo: "ok",
    texto:
      "Dentro do prazo. A reclamação trabalhista pode ser ajuizada em até 2 anos após a saída, cobrando os últimos 5 anos de contrato."
  },
  {
    value: "1-a-2-anos",
    label: "Saí entre 1 e 2 anos atrás",
    tipo: "atencao",
    texto:
      "Atenção ao prazo: você está na reta final dos 2 anos para entrar com a ação. Não deixe para a última hora — procure um advogado o quanto antes."
  },
  {
    value: "mais-2-anos",
    label: "Saí há mais de 2 anos",
    tipo: "alerta",
    texto:
      "Alerta de prazo: em regra, passados 2 anos da saída, o direito de reclamar na Justiça do Trabalho prescreve. Ainda assim, há exceções (afastamentos, menores, situações que suspendem o prazo) — confirme com um advogado antes de descartar."
  }
];

const PROVAS = [
  { value: "holerite", label: "Holerites / contracheques" },
  { value: "ctps", label: "Carteira assinada / contrato" },
  { value: "mensagens", label: "Mensagens (WhatsApp, e-mail)" },
  { value: "testemunhas", label: "Testemunhas (colegas, clientes)" },
  { value: "ponto", label: "Registro de ponto / horários" }
];

const URGENCIAS = [
  {
    value: "urgente",
    label: "É urgente — estou sem renda ou em situação grave",
    texto:
      "Pela urgência, procure um advogado trabalhista nos próximos dias. Em casos de salário atrasado ou necessidade imediata, dá para pedir tutela de urgência (uma decisão rápida) logo no início do processo."
  },
  {
    value: "normal",
    label: "Quero entender meus direitos e agir",
    texto:
      "Organize os documentos e marque uma conversa com um advogado trabalhista. A maioria faz a primeira análise sem compromisso."
  },
  {
    value: "informacao",
    label: "Só quero me informar por enquanto",
    texto:
      "Aproveite para reunir e guardar suas provas desde já — quanto mais cedo organizar, mais forte fica o caso quando você decidir agir."
  }
];

type Answers = {
  situacao?: string;
  prazo?: string;
  registro?: string;
  tempo?: string;
  provas: string[];
  urgencia?: string;
  cidade: string;
};

const REGISTROS = [
  { value: "sim", label: "Sim, o período todo" },
  { value: "parte", label: "Só parte do período" },
  { value: "nao", label: "Não tinha registro" }
];

const TEMPOS = [
  { value: "menos-3-meses", label: "Menos de 3 meses" },
  { value: "3-meses-1-ano", label: "De 3 meses a 1 ano" },
  { value: "1-5-anos", label: "De 1 a 5 anos" },
  { value: "mais-5-anos", label: "Mais de 5 anos" }
];

const TOTAL_STEPS = 6;

export function DiagnosticoTrabalhista() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ provas: [], cidade: "" });
  const [done, setDone] = useState(false);

  const situacao = useMemo(
    () => SITUACOES.find((s) => s.value === answers.situacao),
    [answers.situacao]
  );
  const prazo = useMemo(
    () => PRAZOS.find((p) => p.value === answers.prazo),
    [answers.prazo]
  );
  const urgencia = useMemo(
    () => URGENCIAS.find((u) => u.value === answers.urgencia),
    [answers.urgencia]
  );

  const reset = () => {
    setStep(0);
    setAnswers({ provas: [], cidade: "" });
    setDone(false);
  };

  const pick = (
    key: "situacao" | "prazo" | "registro" | "tempo" | "urgencia",
    value: string,
    advance = true
  ) => {
    setAnswers((a) => ({ ...a, [key]: value }));
    if (advance) {
      if (step < TOTAL_STEPS - 1) setStep((s) => s + 1);
      else setDone(true);
    }
  };

  const toggleProva = (value: string) => {
    setAnswers((a) => ({
      ...a,
      provas: a.provas.includes(value)
        ? a.provas.filter((p) => p !== value)
        : [...a.provas, value]
    }));
  };

  // ---- Resultado ----------------------------------------------------------
  if (done && situacao) {
    const cidadeTxt = answers.cidade.trim();
    const temProvas = answers.provas.length > 0;
    const provasLabels = PROVAS.filter((p) =>
      answers.provas.includes(p.value)
    ).map((p) => p.label);
    const registroLabel = REGISTROS.find((r) => r.value === answers.registro)?.label;
    const tempoLabel = TEMPOS.find((t) => t.value === answers.tempo)?.label;

    return (
      <section
        className="card mb-6 border-2 border-brand-accent/40"
        aria-label="Resultado do diagnóstico"
      >
        <div className="flex items-start gap-3 mb-4">
          <CheckCircle2
            className="w-7 h-7 text-emerald-600 flex-shrink-0 mt-0.5"
            aria-hidden
          />
          <div>
            <h2 className="font-display text-xl md:text-2xl font-bold text-brand-ink">
              Há fortes indícios de direito a {situacao.manchete}.
            </h2>
            <p className="text-sm text-brand-ink/65 mt-1">
              Diagnóstico indicativo a partir das suas respostas
              {cidadeTxt ? ` — ${cidadeTxt}` : ""}. Não é parecer jurídico: cada
              caso tem detalhes que só um advogado avalia.
            </p>
            {(registroLabel || tempoLabel) && (
              <p className="text-xs text-brand-ink/55 mt-1.5 leading-snug">
                Você informou:
                {registroLabel ? ` registro em carteira — ${registroLabel.toLowerCase()};` : ""}
                {tempoLabel ? ` tempo de empresa — ${tempoLabel.toLowerCase()}.` : ""} Leve
                isso ao advogado — muda o que pode ser cobrado e o período retroativo.
              </p>
            )}
          </div>
        </div>

        {/* Prováveis direitos */}
        <div className="rounded-xl bg-brand-deep/5 border border-brand-deep/20 p-4 mb-4">
          <h3 className="font-display text-base font-bold text-brand-ink mb-2 inline-flex items-center gap-2">
            <Scale className="w-4 h-4 text-brand-deep" aria-hidden />
            O que costuma caber no seu caso
          </h3>
          <ul className="space-y-1.5">
            {situacao.direitos.map((d, i) => (
              <li
                key={i}
                className="text-sm text-brand-ink/85 leading-relaxed pl-4 border-l-2 border-brand-deep/30"
              >
                {d}
              </li>
            ))}
          </ul>
          {situacao.naoCabe && situacao.naoCabe.length > 0 && (
            <div className="mt-3 pt-3 border-t border-brand-deep/15">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-ink/45 mb-1.5">
                Em regra NÃO cabe
              </p>
              <ul className="space-y-1">
                {situacao.naoCabe.map((d, i) => (
                  <li key={i} className="text-sm text-brand-ink/60 leading-relaxed">
                    — {d}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="text-xs text-brand-ink/50 mt-3 leading-snug">
            Base legal: {situacao.base}
          </p>
        </div>

        {/* Prazo */}
        {prazo && (
          <div
            className={`rounded-xl p-4 mb-4 border-l-4 flex items-start gap-2 ${
              prazo.tipo === "alerta"
                ? "bg-rose-50 border-rose-400 text-rose-900"
                : prazo.tipo === "atencao"
                  ? "bg-amber-50 border-amber-400 text-amber-900"
                  : "bg-emerald-50 border-emerald-400 text-emerald-900"
            }`}
          >
            <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden />
            <div>
              <p className="text-sm font-semibold">Prazo</p>
              <p className="text-sm leading-relaxed">{prazo.texto}</p>
            </div>
          </div>
        )}

        {/* Provas */}
        <div className="rounded-xl border border-brand-line p-4 mb-4">
          <h3 className="font-display text-base font-bold text-brand-ink mb-2 inline-flex items-center gap-2">
            <FileSearch className="w-4 h-4 text-brand-deep" aria-hidden />
            Suas provas
          </h3>
          {temProvas ? (
            <p className="text-sm text-brand-ink/85 leading-relaxed">
              Você já indicou ter: {provasLabels.join(", ")}. São indícios
              importantes — guarde tudo e monte uma linha do tempo dos fatos
              (datas, valores, nomes). Quanto mais organizado, mais forte o caso.
            </p>
          ) : (
            <p className="text-sm text-brand-ink/85 leading-relaxed">
              Você ainda não reuniu provas. Comece pelo que tiver: holerites,
              carteira, mensagens, extrato do FGTS e nomes de testemunhas. Mesmo
              sem documentos, testemunhas e a própria carteira ajudam muito.
            </p>
          )}
        </div>

        {/* Próximos passos */}
        <div className="rounded-xl border border-brand-line p-4 mb-4">
          <h3 className="font-display text-base font-bold text-brand-ink mb-2">
            Próximos passos
          </h3>
          <ol className="space-y-1.5 list-decimal list-inside">
            {situacao.passos.map((p, i) => (
              <li key={i} className="text-sm text-brand-ink/85 leading-relaxed">
                {p}
              </li>
            ))}
          </ol>
          {urgencia && (
            <p className="text-sm text-brand-ink/85 leading-relaxed mt-3 pt-3 border-t border-brand-line">
              {urgencia.texto}
            </p>
          )}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/advogados"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-deep px-5 py-3 text-sm font-bold text-white hover:bg-brand-ink transition"
          >
            Falar com um advogado trabalhista
            <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
          {situacao.calc && (
            <Link
              href={`/calculadoras/${situacao.calc.slug}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-brand-line px-5 py-3 text-sm font-bold text-brand-ink hover:border-brand-deep transition"
            >
              <Calculator className="w-4 h-4 text-brand-deep" aria-hidden />
              {situacao.calc.label}
            </Link>
          )}
        </div>

        <button
          onClick={reset}
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-brand-ink/55 hover:text-brand-deep transition"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden />
          Refazer o diagnóstico
        </button>

        <aside
          role="note"
          className="mt-4 rounded-xl border-l-4 border-amber-400 bg-amber-50 p-3 text-xs text-amber-900 leading-relaxed flex items-start gap-2"
        >
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden />
          <span>
            Este diagnóstico é informativo e automático. Ele aponta caminhos
            comuns, mas não substitui a análise de um advogado, que vai
            considerar provas, prazos e o contexto do seu caso.
          </span>
        </aside>
      </section>
    );
  }

  // ---- Perguntas ----------------------------------------------------------
  const canGoBack = step > 0;
  const progress = Math.round(((step + 1) / TOTAL_STEPS) * 100);

  return (
    <section
      className="card mb-6 border-2 border-brand-accent/40"
      aria-label="Diagnóstico trabalhista"
    >
      <div className="flex items-center justify-between gap-3 mb-1">
        <h2 className="font-display text-xl font-bold text-brand-ink inline-flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-brand-deep" aria-hidden />
          Diagnóstico do seu caso
        </h2>
        <span className="text-xs font-semibold text-brand-ink/45">
          Passo {step + 1} de {TOTAL_STEPS}
        </span>
      </div>

      {/* Barra de progresso */}
      <div className="h-1.5 w-full rounded-full bg-brand-line/60 mb-5 overflow-hidden">
        <div
          className="h-full bg-brand-accent transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {step === 0 && (
        <Pergunta titulo="O que aconteceu (ou está acontecendo) com você?">
          <Opcoes>
            {SITUACOES.map((s) => (
              <Opcao
                key={s.value}
                selected={answers.situacao === s.value}
                onClick={() => pick("situacao", s.value)}
              >
                {s.label}
              </Opcao>
            ))}
          </Opcoes>
        </Pergunta>
      )}

      {step === 1 && (
        <Pergunta titulo="Quando o problema aconteceu ou o vínculo terminou?">
          <Opcoes>
            {PRAZOS.map((p) => (
              <Opcao
                key={p.value}
                selected={answers.prazo === p.value}
                onClick={() => pick("prazo", p.value)}
              >
                {p.label}
              </Opcao>
            ))}
          </Opcoes>
        </Pergunta>
      )}

      {step === 2 && (
        <Pergunta titulo="Você tinha registro em carteira (CTPS)?">
          <Opcoes>
            {REGISTROS.map((r) => (
              <Opcao
                key={r.value}
                selected={answers.registro === r.value}
                onClick={() => pick("registro", r.value)}
              >
                {r.label}
              </Opcao>
            ))}
          </Opcoes>
        </Pergunta>
      )}

      {step === 3 && (
        <Pergunta titulo="Quanto tempo você trabalhou (ou trabalha) na empresa?">
          <Opcoes>
            {TEMPOS.map((t) => (
              <Opcao
                key={t.value}
                selected={answers.tempo === t.value}
                onClick={() => pick("tempo", t.value)}
              >
                {t.label}
              </Opcao>
            ))}
          </Opcoes>
        </Pergunta>
      )}

      {step === 4 && (
        <Pergunta titulo="O que você tem para provar o que aconteceu? (marque tudo que tiver)">
          <div className="grid sm:grid-cols-2 gap-2">
            {PROVAS.map((p) => {
              const checked = answers.provas.includes(p.value);
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => toggleProva(p.value)}
                  className={`flex items-center gap-2 rounded-xl border-2 px-4 py-3 text-left text-sm transition ${
                    checked
                      ? "border-brand-accent bg-brand-accent/10 text-brand-ink font-semibold"
                      : "border-brand-line bg-white text-brand-ink/80 hover:border-brand-accent/60"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      checked
                        ? "border-brand-accent bg-brand-accent"
                        : "border-brand-line"
                    }`}
                  >
                    {checked && (
                      <CheckCircle2 className="w-3 h-3 text-white" aria-hidden />
                    )}
                  </span>
                  {p.label}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1))}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-deep px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-ink transition"
          >
            Continuar
            <ArrowRight className="w-4 h-4" aria-hidden />
          </button>
        </Pergunta>
      )}

      {step === 5 && (
        <Pergunta titulo="Por último — qual a sua urgência?">
          <div className="mb-4">
            <label
              htmlFor="diag-cidade"
              className="block text-sm font-medium text-brand-ink mb-1"
            >
              Sua cidade (opcional)
            </label>
            <input
              id="diag-cidade"
              type="text"
              value={answers.cidade}
              onChange={(e) =>
                setAnswers((a) => ({ ...a, cidade: e.target.value }))
              }
              placeholder="Ex.: Almenara/MG"
              className="w-full rounded-lg border-2 border-brand-line bg-white px-3 py-2 text-sm text-brand-ink focus:border-brand-accent focus:outline-none"
            />
          </div>
          <Opcoes>
            {URGENCIAS.map((u) => (
              <Opcao
                key={u.value}
                selected={answers.urgencia === u.value}
                onClick={() => pick("urgencia", u.value)}
              >
                {u.label}
              </Opcao>
            ))}
          </Opcoes>
        </Pergunta>
      )}

      {canGoBack && (
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className="mt-5 inline-flex items-center gap-1.5 text-sm text-brand-ink/55 hover:text-brand-deep transition"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden />
          Voltar
        </button>
      )}
    </section>
  );
}

function Pergunta({
  titulo,
  children
}: {
  titulo: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h3 className="font-display text-lg font-bold text-brand-ink mb-3">
        {titulo}
      </h3>
      {children}
    </div>
  );
}

function Opcoes({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-2">{children}</div>;
}

function Opcao({
  selected,
  onClick,
  children
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-between gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm transition ${
        selected
          ? "border-brand-accent bg-brand-accent/10 text-brand-ink font-semibold"
          : "border-brand-line bg-white text-brand-ink/85 hover:border-brand-accent/60 hover:shadow-card"
      }`}
    >
      <span>{children}</span>
      <ArrowRight
        className="w-4 h-4 text-brand-ink/30 flex-shrink-0"
        aria-hidden
      />
    </button>
  );
}
