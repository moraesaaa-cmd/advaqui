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
  },
  {
    slug: "reclamacao-trabalhista",
    titulo: "Quanto custa entrar com uma reclamação trabalhista",
    area_slug: "trabalhista",
    faixa_min: 0,
    faixa_max: 0,
    tipo_cobranca: "percentual_causa",
    inclui: [
      "Análise do caso e cálculo das verbas",
      "Petição inicial e acompanhamento das audiências",
      "Tentativa de acordo e, se preciso, instrução do processo"
    ],
    exclui: [
      "Honorários de sucumbência fixados pelo juiz à parte contrária",
      "Eventuais perícias (insalubridade, periculosidade)"
    ],
    quando_gratis: [
      "O trabalhador, em regra, não paga custas iniciais para ajuizar",
      "Honorários do advogado costumam ser cobrados só sobre o êxito (20% a 30%)",
      "Sindicato da categoria muitas vezes oferece assistência jurídica gratuita"
    ],
    tempo_estimado: "6 a 24 meses até a sentença",
    observacoes: [
      "Na Justiça do Trabalho o empregado normalmente não adianta custas. O combinado mais comum é honorário por êxito — percentual sobre o que for efetivamente recebido. Confirme as condições por escrito antes de assinar."
    ]
  },
  {
    slug: "acao-revisional-bancaria",
    titulo: "Quanto custa uma ação revisional de contrato bancário",
    area_slug: "consumidor",
    faixa_min: 1500,
    faixa_max: 6000,
    tipo_cobranca: "misto",
    inclui: [
      "Análise do contrato e dos encargos cobrados",
      "Cálculo do que seria devido sem abusos",
      "Petição inicial e acompanhamento"
    ],
    exclui: [
      "Custas judiciais",
      "Honorários periciais contábeis, quando houver perícia"
    ],
    quando_gratis: [
      "Quem tem direito à justiça gratuita não paga custas",
      "Defensoria pública pode atender em casos de baixa renda"
    ],
    tempo_estimado: "12 a 36 meses",
    observacoes: [
      "Revisar contrato bancário nem sempre gera redução — depende de o juiz reconhecer abuso concreto. Desconfie de promessa de resultado garantido."
    ]
  },
  {
    slug: "acao-guarda",
    titulo: "Quanto custa uma ação de guarda de filhos",
    area_slug: "familia",
    faixa_min: 1500,
    faixa_max: 6000,
    tipo_cobranca: "honorario_fixo",
    inclui: [
      "Reunião inicial e orientação sobre o melhor interesse da criança",
      "Petição inicial e pedidos de convivência",
      "Acompanhamento de audiências e do estudo psicossocial"
    ],
    exclui: [
      "Custas judiciais",
      "Eventual estudo social/psicológico particular"
    ],
    quando_gratis: [
      "Justiça gratuita para quem comprova baixa renda",
      "Defensoria pública atende questões de guarda"
    ],
    tempo_estimado: "6 a 24 meses",
    observacoes: [
      "Guarda compartilhada é a regra preferencial na lei. O valor varia conforme haver acordo ou disputa."
    ]
  },
  {
    slug: "reconhecimento-uniao-estavel",
    titulo: "Quanto custa reconhecer ou dissolver união estável",
    area_slug: "familia",
    faixa_min: 1200,
    faixa_max: 5000,
    tipo_cobranca: "honorario_fixo",
    inclui: [
      "Análise da convivência e dos bens envolvidos",
      "Escritura declaratória (via extrajudicial) ou petição (via judicial)",
      "Orientação sobre regime de bens e efeitos patrimoniais"
    ],
    exclui: [
      "Emolumentos do cartório de notas",
      "Custas judiciais quando a via é litigiosa"
    ],
    quando_gratis: [
      "Justiça gratuita para baixa renda",
      "Defensoria pública atende reconhecimento e dissolução"
    ],
    tempo_estimado: "Dias a semanas (consensual) ou meses (litigioso)",
    observacoes: [
      "Quando há consenso e não há filhos menores, a via extrajudicial em cartório costuma ser mais rápida e barata."
    ]
  },
  {
    slug: "acao-indenizacao-dano-moral",
    titulo: "Quanto custa entrar com ação de indenização por dano moral",
    area_slug: "civil",
    faixa_min: 1000,
    faixa_max: 5000,
    tipo_cobranca: "misto",
    inclui: [
      "Análise das provas e do cabimento do dano moral",
      "Petição inicial com pedido indenizatório",
      "Acompanhamento até a sentença"
    ],
    exclui: [
      "Custas judiciais",
      "Honorários de sucumbência da parte contrária, se perder"
    ],
    quando_gratis: [
      "Justiça gratuita para quem comprova baixa renda",
      "Honorários costumam ser combinados como percentual sobre a indenização (20% a 30%)"
    ],
    tempo_estimado: "12 a 36 meses",
    observacoes: [
      "O valor da indenização é arbitrado pelo juiz — não há tabela fixa. Nem todo aborrecimento gera dano moral."
    ]
  },
  {
    slug: "inventario-judicial",
    titulo: "Quanto custa um inventário judicial",
    area_slug: "familia",
    faixa_min: 3000,
    faixa_max: 15000,
    tipo_cobranca: "misto",
    inclui: [
      "Abertura do inventário e nomeação do inventariante",
      "Levantamento de bens, dívidas e herdeiros",
      "Acompanhamento até a partilha e a expedição dos formais"
    ],
    exclui: [
      "ITCMD (imposto estadual de transmissão)",
      "Custas judiciais e emolumentos de registro"
    ],
    quando_gratis: [
      "Justiça gratuita para herdeiros de baixa renda",
      "Defensoria pública atende inventários quando há hipossuficiência"
    ],
    tempo_estimado: "12 a 48 meses",
    observacoes: [
      "O inventário judicial é necessário quando há herdeiro menor, incapaz, testamento ou disputa. Sem isso, a via extrajudicial (cartório) é mais rápida. Honorários às vezes são fixados como percentual do espólio."
    ]
  },
  {
    slug: "embargos-execucao-fiscal",
    titulo: "Quanto custa se defender de uma execução fiscal",
    area_slug: "tributario",
    faixa_min: 2000,
    faixa_max: 10000,
    tipo_cobranca: "misto",
    inclui: [
      "Análise da certidão de dívida ativa e dos prazos",
      "Defesa cabível (embargos ou exceção de pré-executividade)",
      "Acompanhamento e tentativa de parcelamento"
    ],
    exclui: [
      "O valor do tributo em si",
      "Custas e eventual garantia do juízo"
    ],
    quando_gratis: [
      "Justiça gratuita para quem comprova baixa renda",
      "Programas de parcelamento administrativo podem dispensar a via judicial"
    ],
    tempo_estimado: "12 a 48 meses",
    observacoes: [
      "Vale verificar prescrição e erros na cobrança. Em muitos casos, o parcelamento administrativo resolve sem litígio."
    ]
  },
  {
    slug: "regularizacao-imovel",
    titulo: "Quanto custa regularizar um imóvel",
    area_slug: "imobiliario",
    faixa_min: 2000,
    faixa_max: 12000,
    tipo_cobranca: "honorario_fixo",
    inclui: [
      "Diagnóstico da situação registral do imóvel",
      "Providências para retificação, averbação ou regularização",
      "Acompanhamento junto a cartório e órgãos competentes"
    ],
    exclui: [
      "Emolumentos de cartório de registro de imóveis",
      "Taxas municipais e eventuais tributos em atraso"
    ],
    quando_gratis: [
      "Programas municipais e estaduais de regularização fundiária (Reurb) podem reduzir ou isentar custos",
      "Defensoria pública atende casos de baixa renda"
    ],
    tempo_estimado: "Meses a alguns anos, conforme a complexidade",
    observacoes: [
      "Os custos variam muito conforme o tipo de irregularidade (falta de averbação de construção, inventário pendente, usucapião). Um diagnóstico inicial define o caminho mais barato."
    ]
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
