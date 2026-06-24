"use client";

import { useState } from "react";
import { Clock, ChevronDown, Lightbulb } from "lucide-react";

/**
 * Linha do tempo interativa de um processo.
 *
 * A pessoa escolhe o tipo de processo e vê as etapas, em ordem, com o que
 * acontece em cada uma, uma estimativa GROSSEIRA de tempo e uma dica prática.
 * Clicar numa etapa abre o detalhe.
 *
 * Os prazos são apenas faixas de referência — variam MUITO por vara, comarca,
 * acordo, recursos e complexidade. O componente deixa isso explícito.
 *
 * Tudo client-side e determinístico, sem IA externa.
 */

type Etapa = {
  titulo: string;
  prazo: string;
  descricao: string;
  dica?: string;
};

type Fluxo = {
  value: string;
  label: string;
  resumo: string;
  etapas: Etapa[];
};

const FLUXOS: Fluxo[] = [
  {
    value: "trabalhista",
    label: "Reclamação trabalhista",
    resumo:
      "Da decisão de procurar um advogado até receber o valor. A conciliação pode encerrar o caso em qualquer ponto.",
    etapas: [
      {
        titulo: "Reunir provas e procurar um advogado",
        prazo: "Antes de tudo",
        descricao:
          "Junte holerites, carteira de trabalho, mensagens, extrato do FGTS e nomes de testemunhas. É a etapa que mais fortalece (ou enfraquece) todo o resto.",
        dica: "Monte uma linha do tempo dos fatos: datas, valores e o que aconteceu em cada um."
      },
      {
        titulo: "Petição inicial",
        prazo: "Logo após contratar",
        descricao:
          "O advogado protocola a reclamação na Justiça do Trabalho, descrevendo os pedidos e juntando as provas.",
        dica: "Lembre do prazo: em regra, até 2 anos após o fim do contrato."
      },
      {
        titulo: "Audiência inicial / conciliação",
        prazo: "≈ 1 a 3 meses depois",
        descricao:
          "Primeira audiência. O juiz tenta um acordo. Boa parte dos casos termina aqui, com pagamento parcelado ou à vista.",
        dica: "Acordo não é derrota: recebe-se mais rápido e com menos risco. Avalie a proposta com seu advogado."
      },
      {
        titulo: "Instrução",
        prazo: "+ 2 a 6 meses",
        descricao:
          "Sem acordo, vêm os depoimentos das partes e das testemunhas e a análise dos documentos.",
        dica: "Testemunhas que viram a rotina de trabalho costumam ser decisivas."
      },
      {
        titulo: "Sentença",
        prazo: "Semanas a meses depois",
        descricao:
          "O juiz decide o que é devido. Pode julgar tudo, parte ou nada dos pedidos."
      },
      {
        titulo: "Recursos",
        prazo: "Meses a anos",
        descricao:
          "A parte que perdeu pode recorrer ao Tribunal Regional do Trabalho (TRT) e, em alguns casos, ao TST. É o que mais alonga o processo."
      },
      {
        titulo: "Execução / pagamento",
        prazo: "Após decisão final",
        descricao:
          "Definido o valor, começa a cobrança: a empresa paga ou tem bens bloqueados/penhorados até quitar."
      }
    ]
  },
  {
    value: "civel",
    label: "Ação cível (indenização ou cobrança)",
    resumo:
      "O caminho de uma ação de indenização ou cobrança no Juizado ou na Justiça Comum.",
    etapas: [
      {
        titulo: "Análise e documentos",
        prazo: "Antes de tudo",
        descricao:
          "Reúna contratos, comprovantes, notas, mensagens e fotos. O advogado avalia a chance e o valor da causa."
      },
      {
        titulo: "Petição inicial",
        prazo: "Logo após contratar",
        descricao:
          "É protocolada a ação com os pedidos e as provas. Causas menores podem ir ao Juizado Especial (mais rápido)."
      },
      {
        titulo: "Citação e contestação",
        prazo: "≈ 1 a 3 meses",
        descricao:
          "O réu é avisado (citado) e apresenta a defesa (contestação) dentro do prazo."
      },
      {
        titulo: "Audiência de conciliação",
        prazo: "Em seguida",
        descricao:
          "O Código de Processo Civil prevê uma tentativa de acordo no início. Muitos casos terminam aqui.",
        dica: "Um acordo bem feito evita anos de espera e o risco de perder."
      },
      {
        titulo: "Instrução e julgamento",
        prazo: "+ meses",
        descricao:
          "Produção de provas: depoimentos, testemunhas, perícias quando necessárias."
      },
      {
        titulo: "Sentença",
        prazo: "Semanas a meses depois",
        descricao: "O juiz decide o pedido. Cabe recurso (apelação) ao tribunal."
      },
      {
        titulo: "Recurso / cumprimento",
        prazo: "Meses a anos",
        descricao:
          "Após a decisão final, começa o cumprimento de sentença para receber o valor."
      }
    ]
  },
  {
    value: "familia",
    label: "Divórcio ou guarda",
    resumo:
      "Quando as partes concordam, é rápido e pode ser no cartório. Havendo conflito, vai para a Justiça.",
    etapas: [
      {
        titulo: "Definir o caminho",
        prazo: "Antes de tudo",
        descricao:
          "Consensual (todos concordam) ou litigioso (há discordância)? Isso muda tudo no tempo e no custo.",
        dica: "Acordo sobre guarda, pensão e bens encurta muito o processo."
      },
      {
        titulo: "Via cartório (consensual)",
        prazo: "Dias a semanas",
        descricao:
          "Divórcio consensual SEM filhos menores ou incapazes pode ser feito em cartório, por escritura, de forma rápida."
      },
      {
        titulo: "Petição inicial (litigioso)",
        prazo: "Logo após contratar",
        descricao:
          "Havendo conflito ou filhos menores, o caso vai à Justiça de Família com os pedidos de divórcio, guarda, pensão e partilha."
      },
      {
        titulo: "Audiência / tentativa de acordo",
        prazo: "≈ 1 a 4 meses",
        descricao:
          "O juiz tenta a conciliação. Acordos parciais (ex.: guarda) já podem ser homologados."
      },
      {
        titulo: "Estudo psicossocial (na guarda)",
        prazo: "Quando há disputa de guarda",
        descricao:
          "Equipe técnica avalia a família para orientar a decisão sobre os filhos."
      },
      {
        titulo: "Sentença",
        prazo: "Meses depois",
        descricao: "O juiz decide divórcio, guarda, pensão e partilha."
      },
      {
        titulo: "Averbação",
        prazo: "Após a decisão",
        descricao:
          "O divórcio é averbado no cartório de registro civil, atualizando o estado civil."
      }
    ]
  },
  {
    value: "inss",
    label: "Benefício do INSS (negado ou demorando)",
    resumo:
      "Em regra é preciso pedir antes no INSS. Negado ou parado, parte-se para a ação judicial.",
    etapas: [
      {
        titulo: "Pedido administrativo no INSS",
        prazo: "Antes de processar",
        descricao:
          "Faça o pedido pelo Meu INSS. Para a maioria dos benefícios, a Justiça exige que você tenha pedido antes ao INSS.",
        dica: "Guarde o número do protocolo e a carta de indeferimento."
      },
      {
        titulo: "Indeferimento ou demora",
        prazo: "Variável",
        descricao:
          "Se o INSS negar, conceder a menor ou demorar demais, abre-se o caminho para a ação judicial."
      },
      {
        titulo: "Ação judicial",
        prazo: "Logo após contratar",
        descricao:
          "Até 60 salários mínimos, vai ao Juizado Especial Federal, mais rápido e sem custas iniciais."
      },
      {
        titulo: "Perícia médica judicial",
        prazo: "≈ 1 a 4 meses",
        descricao:
          "Em benefícios por incapacidade (auxílio-doença, aposentadoria por invalidez), um perito do juízo examina você.",
        dica: "Leve todos os laudos, exames e receitas no dia da perícia."
      },
      {
        titulo: "Sentença",
        prazo: "Semanas a meses depois",
        descricao:
          "O juiz decide com base na perícia e nos documentos. Pode conceder o benefício e os valores atrasados."
      },
      {
        titulo: "Recurso / cumprimento",
        prazo: "Meses",
        descricao:
          "Após a decisão final, o benefício é implantado e os atrasados são pagos (em regra por precatório ou RPV)."
      }
    ]
  }
];

export function LinhaDoTempo() {
  const [fluxoValue, setFluxoValue] = useState(FLUXOS[0].value);
  const [aberta, setAberta] = useState<number | null>(0);

  const fluxo = FLUXOS.find((f) => f.value === fluxoValue) || FLUXOS[0];

  return (
    <section
      className="card mb-6 border-2 border-brand-accent/40"
      aria-label="Linha do tempo de um processo"
    >
      <h2 className="font-display text-xl font-bold text-brand-ink mb-1 inline-flex items-center gap-2">
        <Clock className="w-5 h-5 text-brand-deep" aria-hidden />
        Como anda um processo, etapa por etapa
      </h2>
      <p className="text-sm text-brand-ink/65 mb-4">
        Escolha o tipo de processo e clique em cada etapa para ver o detalhe.
      </p>

      {/* Seletor de fluxo */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FLUXOS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => {
              setFluxoValue(f.value);
              setAberta(0);
            }}
            className={`rounded-full px-4 py-2 text-sm font-medium border-2 transition ${
              f.value === fluxoValue
                ? "border-brand-accent bg-brand-accent/10 text-brand-ink"
                : "border-brand-line bg-white text-brand-ink/70 hover:border-brand-accent/60"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-brand-ink/75 leading-relaxed mb-5">
        {fluxo.resumo}
      </p>

      {/* Timeline vertical */}
      <ol className="relative border-l-2 border-brand-line ml-3 space-y-2">
        {fluxo.etapas.map((e, i) => {
          const open = aberta === i;
          return (
            <li key={i} className="ml-6">
              <span
                className="absolute -left-[9px] flex items-center justify-center w-4 h-4 rounded-full bg-brand-deep ring-4 ring-white"
                aria-hidden
              />
              <button
                type="button"
                onClick={() => setAberta(open ? null : i)}
                className="w-full text-left group"
                aria-expanded={open}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-wide text-brand-deep">
                      {e.prazo}
                    </span>
                    <span className="font-display font-bold text-brand-ink group-hover:text-brand-deep transition">
                      {e.titulo}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-brand-ink/30 flex-shrink-0 mt-1 transition ${
                      open ? "rotate-180" : ""
                    }`}
                    aria-hidden
                  />
                </div>
              </button>
              {open && (
                <div className="mt-2 mb-3">
                  <p className="text-sm text-brand-ink/80 leading-relaxed">
                    {e.descricao}
                  </p>
                  {e.dica && (
                    <p className="mt-2 rounded-lg bg-brand-accent/10 border border-brand-accent/20 p-2.5 text-xs text-brand-ink/80 leading-relaxed flex items-start gap-2">
                      <Lightbulb
                        className="w-3.5 h-3.5 text-brand-accent2 mt-0.5 flex-shrink-0"
                        aria-hidden
                      />
                      <span>{e.dica}</span>
                    </p>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <p className="text-xs text-brand-ink/50 mt-5 leading-relaxed">
        Os tempos são apenas uma referência aproximada. O ritmo real varia muito
        conforme a vara, a comarca, a existência de acordo, recursos e a
        complexidade do caso.
      </p>
    </section>
  );
}
