/**
 * Tabela de referência de honorários típicos para serviços jurídicos comuns
 * no Brasil — Maio/2026.
 *
 * Os valores são FAIXAS REFERENCIAIS observadas em pesquisas de mercado e
 * tabelas da OAB seccionais. **Não são tabelados oficialmente** — cada
 * advogado define o seu honorário livremente. As páginas usam essas
 * estimativas como ponto de partida para a conversa, sempre com disclaimer.
 *
 * Cada serviço tem:
 *  - slug — kebab-case, usado na URL /quanto-custa/[slug]/em/[cidade]
 *  - titulo — pergunta no formato de busca ("Quanto custa um divórcio")
 *  - area_slug — vinculado a SPECIALTIES (consumidor, trabalhista, familia...)
 *  - faixa_min/faixa_max — em reais, faixa típica nacional
 *  - tipo_cobranca — honorário, contingencial, misto
 *  - inclui — o que costuma estar no preço
 *  - exclui — custas adicionais que o cliente paga separado
 *  - quando_grátis — caminhos para serviço gratuito (defensoria, juizado)
 *  - tempo_estimado — duração típica do serviço (em meses ou audiências)
 */

export type CustoJuridico = {
  slug: string;
  titulo: string;
  area_slug: string;
  faixa_min: number;
  faixa_max: number;
  /** "honorario_fixo" | "percentual_causa" | "misto" */
  tipo_cobranca: "honorario_fixo" | "percentual_causa" | "misto";
  inclui: string[];
  exclui: string[];
  quando_gratis: string[];
  tempo_estimado: string;
  /** Notas legais e disclaimers específicos do serviço. */
  observacoes?: string[];
};

export const CUSTOS: CustoJuridico[] = [
  {
    slug: "divorcio-consensual",
    titulo: "Quanto custa um divórcio consensual",
    area_slug: "familia",
    faixa_min: 1500,
    faixa_max: 6000,
    tipo_cobranca: "honorario_fixo",
    inclui: [
      "Reunião inicial e análise dos termos",
      "Redação da minuta do divórcio",
      "Acompanhamento até a sentença ou escritura",
      "Coleta de assinaturas e protocolo"
    ],
    exclui: [
      "Custas judiciais (geralmente R$ 200 a R$ 800)",
      "Cartório de notas (escritura extrajudicial — quando se aplica)",
      "Averbação no registro civil"
    ],
    quando_gratis: [
      "Quando ambos têm direito à justiça gratuita (renda baixa)",
      "Pela defensoria pública estadual quando há filhos menores",
      "Em algumas comarcas, mutirões da OAB seccional ofertam atendimento"
    ],
    tempo_estimado: "30 a 90 dias (extrajudicial), 60 a 180 dias (judicial)"
  },
  {
    slug: "divorcio-litigioso",
    titulo: "Quanto custa um divórcio litigioso",
    area_slug: "familia",
    faixa_min: 3500,
    faixa_max: 15000,
    tipo_cobranca: "misto",
    inclui: [
      "Análise do caso e estratégia",
      "Petição inicial e contestação",
      "Acompanhamento de audiências",
      "Negociação extrajudicial paralela",
      "Recursos quando necessário"
    ],
    exclui: [
      "Custas judiciais (variam por TJ, normalmente 1% sobre o valor do patrimônio)",
      "Honorários sucumbenciais (perde quem perde)",
      "Perícias técnicas (psicológica, contábil)"
    ],
    quando_gratis: [
      "Justiça gratuita para baixa renda",
      "Defensoria pública (varia disponibilidade local)"
    ],
    tempo_estimado: "12 a 36 meses, dependendo da comarca"
  },
  {
    slug: "pensao-alimenticia",
    titulo: "Quanto custa entrar com ação de pensão alimentícia",
    area_slug: "familia",
    faixa_min: 1500,
    faixa_max: 5000,
    tipo_cobranca: "misto",
    inclui: [
      "Reunião inicial",
      "Petição inicial",
      "Audiência de conciliação",
      "Acompanhamento até a sentença"
    ],
    exclui: ["Custas judiciais", "Eventual perícia contábil"],
    quando_gratis: [
      "Defensoria pública atende ações de alimentos gratuitas em todo o Brasil",
      "Justiça gratuita para quem tem renda baixa"
    ],
    tempo_estimado: "4 a 12 meses"
  },
  {
    slug: "inventario-extrajudicial",
    titulo: "Quanto custa um inventário extrajudicial",
    area_slug: "familia",
    faixa_min: 4000,
    faixa_max: 20000,
    tipo_cobranca: "percentual_causa",
    inclui: [
      "Análise dos bens e herdeiros",
      "Redação da escritura",
      "Acompanhamento ao cartório",
      "Distribuição entre herdeiros"
    ],
    exclui: [
      "ITCMD (imposto de transmissão — 2% a 8% conforme estado)",
      "Custas cartoriais (variam por estado)",
      "Certidões e documentações"
    ],
    quando_gratis: [
      "Quando há herdeiro menor ou incapaz (não pode extrajudicial)",
      "Defensoria pública para baixa renda — judicial obrigatório nesses casos"
    ],
    tempo_estimado: "30 a 120 dias (extrajudicial)",
    observacoes: [
      "Honorários geralmente entre 3% e 6% do valor do patrimônio inventariado.",
      "Em patrimônio acima de R$ 1 milhão, honorário pode reduzir percentualmente."
    ]
  },
  {
    slug: "rescisao-indireta",
    titulo: "Quanto custa entrar com ação trabalhista por rescisão indireta",
    area_slug: "trabalhista",
    faixa_min: 0,
    faixa_max: 5000,
    tipo_cobranca: "percentual_causa",
    inclui: [
      "Análise da CTPS, holerites e provas",
      "Petição inicial",
      "Audiência de conciliação",
      "Audiência de instrução",
      "Sentença e eventuais recursos"
    ],
    exclui: ["Honorários sucumbenciais quando aplicáveis"],
    quando_gratis: [
      "Justiça do Trabalho — primeira instância isenta de custas para o trabalhador",
      "Honorários contratuais geralmente 20% a 30% do que for recuperado (success fee)"
    ],
    tempo_estimado: "6 a 24 meses",
    observacoes: [
      "Maioria dos advogados trabalhistas trabalha com 'só ganha se o cliente ganhar' (pro labore atrelado à vitória)."
    ]
  },
  {
    slug: "acao-fgts",
    titulo: "Quanto custa entrar com ação contra a Caixa para correção do FGTS",
    area_slug: "trabalhista",
    faixa_min: 0,
    faixa_max: 3000,
    tipo_cobranca: "percentual_causa",
    inclui: ["Análise dos extratos do FGTS", "Petição inicial", "Acompanhamento"],
    exclui: [],
    quando_gratis: [
      "Justiça gratuita pra quem tem renda baixa",
      "Honorários geralmente 20% a 30% sobre o valor recuperado"
    ],
    tempo_estimado: "12 a 36 meses"
  },
  {
    slug: "acao-inss",
    titulo: "Quanto custa entrar com ação contra o INSS",
    area_slug: "previdenciario",
    faixa_min: 0,
    faixa_max: 5000,
    tipo_cobranca: "percentual_causa",
    inclui: [
      "Análise do CNIS e documentos médicos/laborais",
      "Petição administrativa de recurso quando ainda cabe",
      "Petição judicial",
      "Acompanhamento até a sentença"
    ],
    exclui: ["Perícia médica do INSS (gratuita) e judicial (paga pelo INSS quando concedido benefício)"],
    quando_gratis: [
      "Justiça gratuita federal",
      "Honorários geralmente 20% a 30% sobre as parcelas atrasadas (raramente sobre o benefício futuro)"
    ],
    tempo_estimado: "12 a 36 meses",
    observacoes: [
      "Aposentadoria por idade ou tempo costumam ter cobrança fixa de R$ 1.500 a R$ 4.000 quando há contagem complexa."
    ]
  },
  {
    slug: "acao-contra-banco",
    titulo: "Quanto custa entrar com ação contra banco por taxa indevida",
    area_slug: "consumidor",
    faixa_min: 800,
    faixa_max: 3500,
    tipo_cobranca: "percentual_causa",
    inclui: ["Análise de extratos e contratos", "Petição inicial", "Audiência de conciliação"],
    exclui: ["Perícia contábil quando necessária"],
    quando_gratis: [
      "Juizado Especial Cível é gratuito até 20 salários mínimos",
      "Defensoria pública para baixa renda"
    ],
    tempo_estimado: "6 a 18 meses no juizado",
    observacoes: [
      "Honorários geralmente 20% a 30% do valor recuperado, ou fixo entre R$ 800 e R$ 3.500."
    ]
  },
  {
    slug: "negativacao-indevida",
    titulo: "Quanto custa entrar com ação por negativação indevida",
    area_slug: "consumidor",
    faixa_min: 600,
    faixa_max: 2500,
    tipo_cobranca: "percentual_causa",
    inclui: [
      "Levantamento da negativação",
      "Notificação extrajudicial (quando cabe)",
      "Petição inicial",
      "Audiência de conciliação"
    ],
    exclui: ["Custas (no juizado, isento)"],
    quando_gratis: [
      "Juizado Especial Cível, até 20 salários mínimos, sem advogado se até 20 SM"
    ],
    tempo_estimado: "4 a 12 meses",
    observacoes: [
      "Em valores baixos (até 20 SM), cliente pode ir sozinho ao juizado — sem honorário."
    ]
  },
  {
    slug: "acao-de-cobranca",
    titulo: "Quanto custa entrar com ação de cobrança",
    area_slug: "civil",
    faixa_min: 1000,
    faixa_max: 6000,
    tipo_cobranca: "misto",
    inclui: [
      "Análise das provas (contrato, notas, mensagens)",
      "Notificação extrajudicial",
      "Petição inicial",
      "Acompanhamento",
      "Cumprimento de sentença"
    ],
    exclui: ["Custas judiciais (variam por TJ)"],
    quando_gratis: ["Justiça gratuita para baixa renda"],
    tempo_estimado: "6 a 24 meses",
    observacoes: [
      "Honorários geralmente fixos OU 20% sobre o valor recebido."
    ]
  },
  {
    slug: "acao-despejo",
    titulo: "Quanto custa entrar com ação de despejo por falta de pagamento",
    area_slug: "imobiliario",
    faixa_min: 1500,
    faixa_max: 6000,
    tipo_cobranca: "misto",
    inclui: [
      "Análise do contrato de locação",
      "Notificação premonitória",
      "Petição inicial",
      "Liminar quando cabível",
      "Acompanhamento até a desocupação"
    ],
    exclui: ["Custas (1% sobre os 12 meses de aluguel típico)"],
    quando_gratis: ["Justiça gratuita raramente concedida em ações entre proprietários"],
    tempo_estimado: "6 a 18 meses"
  },
  {
    slug: "usucapiao",
    titulo: "Quanto custa entrar com ação de usucapião",
    area_slug: "imobiliario",
    faixa_min: 5000,
    faixa_max: 25000,
    tipo_cobranca: "misto",
    inclui: [
      "Análise da posse e documentos",
      "Levantamento de testemunhas",
      "Petição inicial",
      "Acompanhamento de perícia",
      "Acompanhamento até a sentença"
    ],
    exclui: ["Custas (sobre o valor do imóvel)", "Perícia técnica (R$ 2.000 a R$ 8.000)"],
    quando_gratis: [
      "Justiça gratuita para baixa renda",
      "Usucapião extrajudicial é mais barato quando todos concordam"
    ],
    tempo_estimado: "24 a 72 meses (judicial), 6 a 18 meses (extrajudicial)"
  },
  {
    slug: "habeas-corpus",
    titulo: "Quanto custa um habeas corpus",
    area_slug: "criminal",
    faixa_min: 3000,
    faixa_max: 30000,
    tipo_cobranca: "honorario_fixo",
    inclui: [
      "Análise dos autos da prisão",
      "Petição de HC",
      "Sustentação oral (quando há sessão)",
      "Acompanhamento da decisão"
    ],
    exclui: ["Outras peças além do HC (eventual recurso ordinário ou repetição em instância superior)"],
    quando_gratis: [
      "Defensoria pública atende HCs",
      "Justiça gratuita raramente é deferida em HC"
    ],
    tempo_estimado: "3 a 30 dias",
    observacoes: [
      "Honorário pode variar muito conforme a gravidade do caso e a instância (1º grau, TJ, STJ, STF)."
    ]
  },
  {
    slug: "defesa-criminal",
    titulo: "Quanto custa contratar advogado para defesa criminal",
    area_slug: "criminal",
    faixa_min: 5000,
    faixa_max: 80000,
    tipo_cobranca: "honorario_fixo",
    inclui: [
      "Análise dos autos",
      "Defesa preliminar",
      "Audiência de instrução",
      "Memoriais",
      "Eventual recurso até a 2ª instância"
    ],
    exclui: ["Recursos em tribunais superiores (STJ, STF)"],
    quando_gratis: ["Defensoria pública garante defesa gratuita em todo caso criminal"],
    tempo_estimado: "12 a 60 meses",
    observacoes: [
      "Faixa varia enormemente — crime sem gravidade (R$ 5.000 a R$ 12.000) vs crime grave com júri (R$ 30.000 a R$ 80.000)."
    ]
  },
  {
    slug: "ressarcimento-plano-saude",
    titulo: "Quanto custa entrar com ação contra plano de saúde",
    area_slug: "consumidor",
    faixa_min: 1500,
    faixa_max: 5000,
    tipo_cobranca: "misto",
    inclui: [
      "Análise contratual",
      "Petição inicial com liminar (urgência)",
      "Acompanhamento"
    ],
    exclui: ["Custas judiciais"],
    quando_gratis: [
      "Defensoria pública atende",
      "Honorários sobre eventuais danos morais — 20% a 30%"
    ],
    tempo_estimado: "1 a 6 meses (liminar) + 12 a 24 meses (mérito)"
  }
];

export const CUSTO_SLUGS = CUSTOS.map((c) => c.slug);

export function findCusto(slug: string): CustoJuridico | undefined {
  return CUSTOS.find((c) => c.slug === slug);
}

export function relatedCustos(slug: string, limit = 5): CustoJuridico[] {
  const me = findCusto(slug);
  if (!me) return CUSTOS.slice(0, limit);
  return CUSTOS.filter((c) => c.slug !== slug && c.area_slug === me.area_slug).slice(
    0,
    limit
  );
}

export function formatFaixa(min: number, max: number): string {
  if (min === 0 && max === 0) return "Gratuito";
  if (min === 0) return `Gratuito até R$ ${max.toLocaleString("pt-BR")}`;
  return `R$ ${min.toLocaleString("pt-BR")} a R$ ${max.toLocaleString("pt-BR")}`;
}
