/**
 * Dados do gerador de Recurso de Multa de Trânsito (/recurso-de-multa).
 *
 * Conteúdo escrito à mão a partir do Código de Trânsito Brasileiro (CTB,
 * Lei 9.503/1997) e da Súmula 312 do STJ (exige a dupla notificação — da
 * autuação e da penalidade).
 * NÃO é parecer: o gerador monta um MODELO de recurso que o cidadão revisa e
 * adapta. As teses entram como argumentos possíveis — cada uma só vale se for
 * verdadeira no caso concreto.
 *
 * Determinístico, sem IA: a peça é montada por template a partir das escolhas.
 */

export type Tese = {
  /** Título curto exibido como checkbox no formulário. */
  titulo: string;
  /** Texto que entra na seção "Dos fundamentos" da peça. */
  texto: string;
  /** Quando faz sentido sugerir automaticamente para a infração. */
  base: string;
};

export type Infracao = {
  slug: string;
  label: string;
  /** Artigo principal do CTB. */
  artigo: string;
  gravidade: "leve" | "média" | "grave" | "gravíssima";
  /** Descrição curta para a seção "Dos fatos". */
  resumo: string;
  /** Slugs de teses (de TESES_COMUNS) sugeridas para esta infração. */
  teses: string[];
  /** Tese específica desta infração (além das comuns), opcional. */
  teseEspecifica?: Tese;
};

/** Teses de defesa genéricas, aplicáveis à maioria das autuações. */
export const TESES_COMUNS: Record<string, Tese> = {
  notificacao_prazo: {
    titulo: "Notificação da autuação fora do prazo",
    texto:
      "A autoridade de trânsito tem o prazo de 30 dias para expedir a Notificação da Autuação, contado da data do cometimento da infração; esgotado esse prazo sem a notificação, o auto de infração deve ser arquivado e o registro liberado (art. 281, parágrafo único, II, do CTB). Não tendo a notificação observado o prazo legal, impõe-se o cancelamento da autuação.",
    base: "Art. 281, parágrafo único, II, do CTB."
  },
  dupla_notificacao: {
    titulo: "Ausência de dupla notificação (autuação e penalidade)",
    texto:
      "O devido processo administrativo exige DUAS notificações distintas: a da autuação (art. 280) e a da aplicação da penalidade (art. 282), assegurando o direito de defesa em cada fase. A Súmula 312 do STJ é expressa ao exigir as notificações da autuação e da aplicação da pena. A falta de qualquer uma delas configura cerceamento de defesa e nulidade do processo.",
    base: "Arts. 280 e 282 do CTB; Súmula 312 do STJ."
  },
  requisitos_auto: {
    titulo: "Auto de infração sem os requisitos legais",
    texto:
      "O auto de infração só é válido se contiver os elementos do art. 280 do CTB: tipificação da infração, local, data e hora; identificação do veículo; identificação do órgão e do agente autuador ou do equipamento. A ausência ou o preenchimento incorreto de qualquer desses dados macula o auto e impede sua convalidação, devendo ser cancelado.",
    base: "Art. 280 do CTB; Resolução CONTRAN aplicável."
  },
  sinalizacao: {
    titulo: "Sinalização ausente, encoberta ou inadequada",
    texto:
      "A validade da fiscalização depende de sinalização clara, visível e conforme as normas do CONTRAN (arts. 80 e 90 do CTB). Sinalização ausente, danificada, encoberta ou em desacordo com o padrão retira a exigibilidade da conduta e impede a punição do condutor, que não pôde conhecer a regra no local.",
    base: "Arts. 80 e 90 do CTB."
  },
  identificacao: {
    titulo: "Erro na identificação do veículo ou do condutor",
    texto:
      "Há divergência/erro nos dados que identificam o veículo (placa, marca, modelo, cor) ou na atribuição da conduta ao requerente, que não era o condutor no momento dos fatos. A imputação equivocada torna inválida a penalidade aplicada.",
    base: "Art. 280, II e III, do CTB."
  },
  agente: {
    titulo: "Falta de identificação do agente autuador",
    texto:
      "O auto não identifica de forma adequada o agente da autoridade de trânsito responsável pela autuação, em afronta ao art. 280, VI, do CTB, o que compromete a higidez do ato administrativo e o direito de defesa.",
    base: "Art. 280, VI, do CTB."
  }
};

export const INFRACOES: Infracao[] = [
  {
    slug: "excesso-de-velocidade",
    label: "Excesso de velocidade (radar)",
    artigo: "Art. 218 do CTB",
    gravidade: "grave",
    resumo:
      "autuação por suposta condução em velocidade superior à máxima permitida para a via, registrada por equipamento medidor.",
    teses: ["notificacao_prazo", "dupla_notificacao", "requisitos_auto", "sinalizacao"],
    teseEspecifica: {
      titulo: "Equipamento medidor sem aferição válida do INMETRO",
      texto:
        "A autuação por velocidade depende de equipamento medidor aferido e com verificação metrológica válida pelo INMETRO/IPEM, com indicação do número de série e da data da última aferição no auto (Resolução CONTRAN específica). Sem a comprovação da aferição vigente na data dos fatos, a medição é inválida e a multa não se sustenta.",
      base: "Art. 280 do CTB; Resoluções CONTRAN; verificação metrológica do INMETRO."
    }
  },
  {
    slug: "avanco-de-sinal-vermelho",
    label: "Avanço de sinal vermelho",
    artigo: "Art. 208 do CTB",
    gravidade: "gravíssima",
    resumo:
      "autuação por transpor sinal luminoso vermelho em cruzamento ou local sinalizado.",
    teses: ["notificacao_prazo", "dupla_notificacao", "requisitos_auto", "sinalizacao", "identificacao"],
    teseEspecifica: {
      titulo: "Semáforo ou equipamento com defeito / estado de necessidade",
      texto:
        "Caso o semáforo apresentasse defeito de funcionamento, ou o avanço tenha ocorrido em estado de necessidade (p. ex., para dar passagem a veículo de emergência ou evitar acidente), a conduta não é punível. Cabe ainda verificar a aferição do equipamento de fiscalização eletrônica.",
      base: "Art. 208 do CTB; excludentes de ilicitude."
    }
  },
  {
    slug: "estacionamento-irregular",
    label: "Estacionamento ou parada irregular",
    artigo: "Art. 181 do CTB",
    gravidade: "média",
    resumo:
      "autuação por estacionar ou parar o veículo em local supostamente proibido.",
    teses: ["notificacao_prazo", "dupla_notificacao", "requisitos_auto", "sinalizacao"]
  },
  {
    slug: "uso-celular",
    label: "Uso de celular ao volante",
    artigo: "Art. 252 do CTB",
    gravidade: "gravíssima",
    resumo:
      "autuação por dirigir manuseando ou segurando telefone celular.",
    teses: ["notificacao_prazo", "dupla_notificacao", "requisitos_auto", "identificacao"],
    teseEspecifica: {
      titulo: "Ausência de prova do manuseio",
      texto:
        "A infração exige a efetiva constatação do manuseio do aparelho. Tratando-se de autuação visual, sem registro fotográfico ou descrição circunstanciada que comprove a conduta, há mera presunção, insuficiente para sustentar penalidade tão gravosa.",
      base: "Art. 252, §1º, do CTB; ônus da prova da Administração."
    }
  },
  {
    slug: "sem-cinto",
    label: "Sem cinto de segurança",
    artigo: "Art. 167 do CTB",
    gravidade: "grave",
    resumo:
      "autuação por conduzir sem o uso do cinto de segurança.",
    teses: ["notificacao_prazo", "dupla_notificacao", "requisitos_auto", "identificacao"]
  },
  {
    slug: "conversao-ou-retorno-proibido",
    label: "Conversão ou retorno proibido",
    artigo: "Art. 206 do CTB",
    gravidade: "grave",
    resumo:
      "autuação por efetuar conversão ou retorno em local proibido.",
    teses: ["notificacao_prazo", "dupla_notificacao", "requisitos_auto", "sinalizacao"]
  },
  {
    slug: "nao-indicacao-do-condutor",
    label: "Não indicação do condutor infrator",
    artigo: "Art. 257, §8º, do CTB",
    gravidade: "grave",
    resumo:
      "autuação ao proprietário por não indicar o condutor responsável por infração cometida com o veículo.",
    teses: ["notificacao_prazo", "requisitos_auto"],
    teseEspecifica: {
      titulo: "Notificação que não oportunizou a indicação no prazo",
      texto:
        "A penalidade por não indicação só é válida se a notificação original tiver oportunizado, de forma clara e no prazo, a indicação do real condutor, com o formulário próprio. Falha ou ausência dessa oportunidade afasta a multa por não indicação.",
      base: "Art. 257 do CTB."
    }
  },
  {
    slug: "outra",
    label: "Outra infração",
    artigo: "Código de Trânsito Brasileiro (Lei 9.503/1997)",
    gravidade: "média",
    resumo: "autuação por infração de trânsito registrada no auto.",
    teses: ["notificacao_prazo", "dupla_notificacao", "requisitos_auto", "sinalizacao", "identificacao"]
  }
];

export const findInfracao = (slug: string) =>
  INFRACOES.find((i) => i.slug === slug);

export type Fase = {
  value: string;
  label: string;
  /** Como endereçar a peça. */
  enderecamento: string;
  /** Explicação curta da fase. */
  descricao: string;
  /** Nome do documento. */
  nomePeca: string;
};

export const FASES: Fase[] = [
  {
    value: "defesa-previa",
    label: "Defesa Prévia (após a Notificação da Autuação)",
    enderecamento:
      "À AUTORIDADE DE TRÂNSITO DO ÓRGÃO AUTUADOR",
    descricao:
      "Primeira oportunidade de defesa, apresentada após a Notificação da Autuação e antes da aplicação da penalidade.",
    nomePeca: "DEFESA PRÉVIA DE AUTUAÇÃO"
  },
  {
    value: "jari",
    label: "Recurso à JARI (após a Notificação da Penalidade)",
    enderecamento:
      "À JUNTA ADMINISTRATIVA DE RECURSOS DE INFRAÇÕES — JARI",
    descricao:
      "Recurso de 1ª instância, apresentado depois de aplicada a penalidade (Notificação da Penalidade).",
    nomePeca: "RECURSO ADMINISTRATIVO À JARI"
  },
  {
    value: "cetran",
    label: "Recurso ao CETRAN (2ª instância)",
    enderecamento:
      "AO CONSELHO ESTADUAL DE TRÂNSITO — CETRAN",
    descricao:
      "Recurso de 2ª instância, cabível após o indeferimento do recurso pela JARI.",
    nomePeca: "RECURSO ADMINISTRATIVO AO CETRAN (2ª INSTÂNCIA)"
  }
];

export const findFase = (value: string) =>
  FASES.find((f) => f.value === value);
