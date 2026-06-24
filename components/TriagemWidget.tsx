"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Compass,
  ChevronLeft,
  RotateCcw,
  ArrowRight,
  Flame,
  Clock,
  Info,
  Wrench
} from "lucide-react";

/**
 * Triagem de problema jurídico — assistente que identifica a ÁREA e a
 * URGÊNCIA do caso por regras (sem IA) e encaminha para o advogado certo e
 * para a ferramenta interna mais útil.
 *
 * Privacidade: NÃO armazena nada. O relato é opcional e usado só para você
 * organizar as ideias antes de procurar o advogado — fica no seu navegador.
 */

type Area = {
  value: string;
  label: string;
  /** slug da especialidade no diretório /advogados. */
  esp: string;
  /** ferramenta interna sugerida. */
  ferramenta?: { href: string; label: string };
};

const AREAS: Area[] = [
  { value: "trabalhista", label: "Trabalho / emprego (demissão, salário, horas extras)", esp: "trabalhista", ferramenta: { href: "/diagnostico", label: "Diagnóstico trabalhista" } },
  { value: "familia", label: "Família (divórcio, guarda, pensão, inventário)", esp: "familia", ferramenta: { href: "/divorcio", label: "Divórcio: cartório ou Justiça?" } },
  { value: "consumidor", label: "Consumidor (cobrança indevida, produto, banco, plano de saúde)", esp: "consumidor" },
  { value: "previdenciario", label: "INSS / aposentadoria (benefício negado, revisão)", esp: "previdenciario", ferramenta: { href: "/previdencia", label: "Regras de aposentadoria" } },
  { value: "transito", label: "Multa ou problema de trânsito", esp: "administrativo", ferramenta: { href: "/recurso-de-multa", label: "Recurso de multa" } },
  { value: "imobiliario", label: "Imóvel (compra, aluguel, regularização)", esp: "imobiliario", ferramenta: { href: "/imobiliario", label: "Comprar imóvel com segurança" } },
  { value: "civil", label: "Dívida, contrato ou indenização", esp: "civil", ferramenta: { href: "/calculadoras/atualizacao-divida", label: "Atualizar um valor" } },
  { value: "criminal", label: "Questão criminal (você ou alguém foi acusado/preso)", esp: "criminal" },
  { value: "outro", label: "Outro / não sei encaixar", esp: "" }
];

type Urg = {
  value: string;
  label: string;
  nivel: "alta" | "media" | "baixa";
  texto: string;
};

const URGENCIAS: Urg[] = [
  {
    value: "prazo",
    label: "Tenho um prazo, audiência ou intimação com data",
    nivel: "alta",
    texto:
      "Urgência alta: existe data correndo. Procure um advogado HOJE/amanhã — perder prazo costuma fechar portas. Se já tem advogado, avise-o imediatamente."
  },
  {
    value: "grave",
    label: "É uma situação grave agora (preso, despejo, sem renda, violência)",
    nivel: "alta",
    texto:
      "Urgência alta: situações assim pedem ação imediata e, às vezes, pedido de tutela de urgência (decisão rápida). Procure um advogado o quanto antes; em risco à integridade, acione também a polícia (190)."
  },
  {
    value: "resolver",
    label: "Quero resolver, mas sem data marcada",
    nivel: "media",
    texto:
      "Urgência média: organize os documentos e marque uma conversa com um advogado nos próximos dias. A maioria faz a primeira análise sem compromisso."
  },
  {
    value: "informar",
    label: "Só quero entender meus direitos por enquanto",
    nivel: "baixa",
    texto:
      "Sem pressa: aproveite para reunir provas e ler sobre o tema. Quando decidir agir, você já chega organizado."
  }
];

type Step = 0 | 1 | 2 | 3;

export function TriagemWidget() {
  const [step, setStep] = useState<Step>(0);
  const [area, setArea] = useState<string>("");
  const [relato, setRelato] = useState("");
  const [urg, setUrg] = useState<string>("");
  const [done, setDone] = useState(false);

  const areaObj = useMemo(() => AREAS.find((a) => a.value === area), [area]);
  const urgObj = useMemo(() => URGENCIAS.find((u) => u.value === urg), [urg]);

  const reset = () => {
    setStep(0);
    setArea("");
    setRelato("");
    setUrg("");
    setDone(false);
  };

  if (done && areaObj && urgObj) {
    const advHref = "/advogados";
    return (
      <section className="card mb-6 border-2 border-brand-accent/40" aria-label="Resultado da triagem">
        <h2 className="font-display text-xl md:text-2xl font-bold text-brand-ink inline-flex items-center gap-2">
          <Compass className="w-6 h-6 text-brand-deep" aria-hidden />
          Seu caso parece ser de {areaObj.label.split(" (")[0].toLowerCase()}
        </h2>

        {/* Urgência */}
        <div
          className={`mt-4 rounded-xl p-4 border-l-4 flex items-start gap-2 ${
            urgObj.nivel === "alta"
              ? "bg-rose-50 border-rose-400 text-rose-900"
              : urgObj.nivel === "media"
                ? "bg-amber-50 border-amber-400 text-amber-900"
                : "bg-emerald-50 border-emerald-400 text-emerald-900"
          }`}
        >
          {urgObj.nivel === "alta" ? (
            <Flame className="w-5 h-5 mt-0.5 flex-shrink-0" aria-hidden />
          ) : urgObj.nivel === "media" ? (
            <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" aria-hidden />
          ) : (
            <Info className="w-5 h-5 mt-0.5 flex-shrink-0" aria-hidden />
          )}
          <div>
            <p className="font-semibold capitalize">Urgência {urgObj.nivel}</p>
            <p className="text-sm leading-relaxed">{urgObj.texto}</p>
          </div>
        </div>

        {relato.trim() && (
          <div className="mt-4 rounded-xl border border-brand-line p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-ink/55 mb-1">
              Seu relato (leve isto ao advogado)
            </p>
            <p className="text-sm text-brand-ink/85 whitespace-pre-wrap leading-relaxed">{relato.trim()}</p>
          </div>
        )}

        {areaObj.ferramenta && (
          <Link
            href={areaObj.ferramenta.href}
            className="mt-4 flex items-center gap-3 rounded-xl border-2 border-brand-line p-3 hover:border-brand-accent/60 transition"
          >
            <Wrench className="w-5 h-5 text-brand-deep flex-shrink-0" aria-hidden />
            <span className="flex-1">
              <span className="block text-sm font-bold text-brand-ink">
                Antes de pagar consulta, use: {areaObj.ferramenta.label}
              </span>
              <span className="block text-xs text-brand-ink/60">
                Ferramenta gratuita do AdvAqui para o seu tipo de caso.
              </span>
            </span>
            <ArrowRight className="w-4 h-4 text-brand-ink/40" aria-hidden />
          </Link>
        )}

        <Link
          href={advHref}
          className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-deep px-5 py-3 text-sm font-bold text-white hover:bg-brand-ink transition"
        >
          Encontrar um advogado na minha cidade
          <ArrowRight className="w-4 h-4" aria-hidden />
        </Link>

        <button
          onClick={reset}
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-brand-ink/55 hover:text-brand-deep transition"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden />
          Refazer a triagem
        </button>

        <p className="mt-4 text-xs text-brand-ink/50 leading-relaxed">
          Triagem automática e informativa — uma primeira orientação, não um
          parecer. Quem confirma a área e a estratégia é o advogado, olhando o
          seu caso. Não guardamos nada do que você respondeu.
        </p>
      </section>
    );
  }

  const progresso = Math.round(((step + 1) / 3) * 100);

  return (
    <section className="card mb-6 border-2 border-brand-accent/40" aria-label="Triagem jurídica">
      <div className="flex items-center justify-between gap-3 mb-1">
        <h2 className="font-display text-xl font-bold text-brand-ink inline-flex items-center gap-2">
          <Compass className="w-5 h-5 text-brand-deep" aria-hidden />
          Por onde começar
        </h2>
        <span className="text-xs font-semibold text-brand-ink/45">Passo {step + 1} de 3</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-brand-line/60 mb-5 overflow-hidden">
        <div className="h-full bg-brand-accent transition-all duration-300" style={{ width: `${progresso}%` }} />
      </div>

      {step === 0 && (
        <Pergunta titulo="Qual é a área do seu problema?">
          <div className="grid gap-2">
            {AREAS.map((a) => (
              <Opcao key={a.value} selected={area === a.value} onClick={() => { setArea(a.value); setStep(1); }}>
                {a.label}
              </Opcao>
            ))}
          </div>
        </Pergunta>
      )}

      {step === 1 && (
        <Pergunta titulo="Descreva em poucas palavras o que aconteceu (opcional)">
          <textarea
            value={relato}
            onChange={(e) => setRelato(e.target.value)}
            placeholder="Ex.: fui demitido e não recebi as verbas; recebi uma cobrança que não reconheço; quero me divorciar..."
            className="w-full rounded-lg border-2 border-brand-line bg-white px-3 py-2 text-sm text-brand-ink focus:border-brand-accent focus:outline-none min-h-[100px]"
          />
          <p className="text-xs text-brand-ink/50 mt-1">
            Isto não é enviado nem salvo — serve para você levar organizado ao advogado.
          </p>
          <button
            onClick={() => setStep(2)}
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-brand-deep px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-ink transition"
          >
            Continuar <ArrowRight className="w-4 h-4" aria-hidden />
          </button>
        </Pergunta>
      )}

      {step === 2 && (
        <Pergunta titulo="Qual a sua urgência?">
          <div className="grid gap-2">
            {URGENCIAS.map((u) => (
              <Opcao key={u.value} selected={urg === u.value} onClick={() => { setUrg(u.value); setDone(true); }}>
                {u.label}
              </Opcao>
            ))}
          </div>
        </Pergunta>
      )}

      {step > 0 && (
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1) as Step)}
          className="mt-5 inline-flex items-center gap-1.5 text-sm text-brand-ink/55 hover:text-brand-deep transition"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden /> Voltar
        </button>
      )}
    </section>
  );
}

function Pergunta({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="font-display text-lg font-bold text-brand-ink mb-3">{titulo}</h3>
      {children}
    </div>
  );
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
      <ArrowRight className="w-4 h-4 text-brand-ink/30 flex-shrink-0" aria-hidden />
    </button>
  );
}
