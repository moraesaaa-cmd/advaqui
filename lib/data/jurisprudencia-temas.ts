/**
 * Temas de jurisprudência — hubs temáticos sob /jurisprudencia/stj/[tema]
 *
 * Cada tema agrupa decisões reais já existentes no banco (jurisprudencia_decisoes)
 * filtradas por keywords contra ementa + resumo_tema. Não cria conteúdo
 * inventado — só agrupa o que já é real e publicado.
 *
 * Defesa em profundidade:
 *  - Se o banco retornar menos de 3 decisões para um tema, a página
 *    NÃO é exposta como indexável (noindex). Isso evita conteúdo fino.
 *  - Cada decisão passa por isPubliclyDisplayable.
 *  - Não há jurisprudência "estimada" ou "exemplo" — só real ou nada.
 *
 * SEO:
 *  - URLs em kebab-case com tema_slug consistente
 *  - Conexão com /glossario/[slug] e /problemas-juridicos/[slug]
 *  - Atualizado_em controla lastmod no sitemap
 */

export type JurisTema = {
  slug: string;
  titulo: string;
  /** Termo de busca textual usado na query (textSearch via tsvector + ilike fallback) */
  keywords: string[];
  /** Descrição em pt-BR pra introdução da página e meta description */
  descricao: string;
  /** Parágrafos para a intro da página (contextual, sem keyword stuffing) */
  intro: string[];
  /** Áreas do direito (slugs de specialties) */
  areas: string[];
  /** Slug do termo no glossário */
  glossario?: string;
  /** Slug do problema jurídico relacionado */
  problema?: string;
  /** Atualizado em ISO */
  atualizado_em: string;
};

export const TEMAS_STJ: JurisTema[] = [
  {
    slug: "dano-moral",
    titulo: "Dano moral",
    keywords: ["dano moral", "danos morais"],
    descricao:
      "Decisões do STJ sobre dano moral — conceito, prova, valor da indenização, casos típicos e teses recentes.",
    intro: [
      "O dano moral é uma das matérias mais decididas pelo Superior Tribunal de Justiça. As decisões aqui reunidas vêm direto do Portal de Dados Abertos do STJ e tratam de variados aspectos — pressuposto da responsabilidade, prova do dano, parâmetros para fixação do valor da indenização e situações típicas como inscrição indevida em órgãos de proteção ao crédito, recusa de plano de saúde, falhas em serviços de transporte e consumo.",
      "O agrupamento ajuda a entender como o STJ vem decidindo questões parecidas e a localizar precedentes úteis ao caso concreto."
    ],
    areas: ["civil", "consumidor"],
    glossario: "dano-moral",
    problema: "nome-negativado-indevidamente",
    atualizado_em: "2026-05-21"
  },
  {
    slug: "negativacao-indevida",
    titulo: "Negativação indevida",
    keywords: [
      "negativação indevida",
      "inscrição indevida",
      "spc",
      "serasa",
      "cadastro de inadimplentes"
    ],
    descricao:
      "Decisões do STJ sobre inscrição indevida em órgãos de proteção ao crédito — dano moral, Súmula 385, baixa imediata e indenização.",
    intro: [
      "A inscrição indevida do nome do consumidor em SPC, Serasa e similares gera farta jurisprudência no STJ. Os pontos mais debatidos são — presunção do dano moral, aplicação da Súmula 385 quando há outras inscrições legítimas anteriores, valor médio das indenizações e responsabilidade dos órgãos cadastrais e dos credores que comunicaram a inscrição.",
      "As decisões reunidas aqui ajudam a entender o pano de fundo doutrinário e os limites práticos das teses."
    ],
    areas: ["consumidor", "civil"],
    glossario: "negativacao-indevida",
    problema: "nome-negativado-indevidamente",
    atualizado_em: "2026-05-21"
  },
  {
    slug: "plano-de-saude",
    titulo: "Plano de saúde",
    keywords: ["plano de saúde", "ANS", "cobertura assistencial", "operadora de saúde"],
    descricao:
      "Decisões do STJ sobre recusa de cobertura, rol da ANS, reajuste por faixa etária e responsabilidade das operadoras.",
    intro: [
      "Cobertura por plano de saúde é um dos temas mais frequentes nos tribunais superiores. O STJ vem decidindo, em vários precedentes, questões como — recusa de procedimentos com indicação médica, cobertura fora do rol da ANS em hipóteses específicas, reajuste por faixa etária em idosos, cancelamento unilateral e responsabilidade por danos morais em casos de recusa abusiva.",
      "As decisões aqui ajudam o consumidor e os profissionais a entender o entendimento atualizado da Corte."
    ],
    areas: ["consumidor", "civil"],
    glossario: "plano-de-saude",
    problema: "plano-de-saude-negou-cirurgia",
    atualizado_em: "2026-05-21"
  },
  {
    slug: "pensao-alimenticia",
    titulo: "Pensão alimentícia",
    keywords: ["alimentos", "pensão alimentícia", "prestação alimentar"],
    descricao:
      "Decisões do STJ sobre fixação, revisão, exoneração e cobrança de pensão alimentícia.",
    intro: [
      "Pensão alimentícia gera muitas demandas porque depende do binômio necessidade x possibilidade e porque a vida financeira das partes muda ao longo do tempo. O STJ trata de temas como — fixação inicial, revisão por mudança de circunstâncias, exoneração de pensão a ex-cônjuge, prisão civil do devedor de alimentos, e desconto em folha.",
      "As decisões reunidas servem como referência para entender precedentes e teses dominantes."
    ],
    areas: ["familia"],
    glossario: "pensao-alimenticia",
    problema: "pai-nao-paga-pensao",
    atualizado_em: "2026-05-21"
  },
  {
    slug: "inventario",
    titulo: "Inventário",
    keywords: ["inventário", "sucessão", "partilha", "herança"],
    descricao:
      "Decisões do STJ sobre inventário, partilha, sucessão legítima e testamentária e questões frequentes da herança.",
    intro: [
      "Inventário envolve interesses sensíveis — patrimônio, família, prazo fiscal. O STJ vem fixando entendimento sobre — inventário extrajudicial, cessão de direitos hereditários, partilha em vida, sucessão de companheiro, e impostos relacionados.",
      "O conjunto reunido aqui é útil para entender como vem se firmando a jurisprudência em questões frequentes."
    ],
    areas: ["familia", "civil"],
    glossario: "inventario",
    problema: "perdi-um-familiar-e-preciso-fazer-inventario",
    atualizado_em: "2026-05-21"
  },
  {
    slug: "usucapiao",
    titulo: "Usucapião",
    keywords: ["usucapião", "posse mansa", "prescrição aquisitiva"],
    descricao:
      "Decisões do STJ sobre usucapião — modalidades, requisitos, prazos e questões probatórias.",
    intro: [
      "Usucapião é instrumento clássico de aquisição da propriedade pela posse. O STJ vem decidindo questões como — usucapião extrajudicial, comprovação de posse com animus domini, oposição do dono, usucapião familiar (abandono de lar) e questões processuais específicas.",
      "As decisões aqui mostram como a Corte vem aplicando a lei em situações concretas."
    ],
    areas: ["civil", "imobiliario"],
    glossario: "usucapiao",
    problema: "vou-comprar-imovel-o-que-conferir",
    atualizado_em: "2026-05-21"
  },
  {
    slug: "responsabilidade-civil",
    titulo: "Responsabilidade civil",
    keywords: [
      "responsabilidade civil",
      "responsabilidade objetiva",
      "responsabilidade subjetiva",
      "nexo de causalidade"
    ],
    descricao:
      "Decisões do STJ sobre responsabilidade civil — culpa, risco, nexo causal e parâmetros indenizatórios.",
    intro: [
      "Responsabilidade civil percorre quase todos os ramos do direito privado. O STJ vem decidindo — distinção entre responsabilidade objetiva e subjetiva, danos materiais, morais e estéticos, perda de uma chance, e questões probatórias de nexo causal.",
      "Esses precedentes ajudam advogados e cidadãos a entender critérios práticos das decisões."
    ],
    areas: ["civil", "consumidor"],
    glossario: "responsabilidade-civil",
    problema: "fui-vitima-de-acidente-de-transito",
    atualizado_em: "2026-05-21"
  },
  {
    slug: "consumidor",
    titulo: "Direito do consumidor",
    keywords: ["consumidor", "código de defesa do consumidor", "CDC", "relação de consumo"],
    descricao:
      "Decisões do STJ sobre relações de consumo — inversão do ônus da prova, vícios, oferta e publicidade enganosa.",
    intro: [
      "Direito do consumidor é objeto de inúmeras decisões. O STJ vem definindo — abrangência das relações de consumo (consumidor por equiparação, fornecedor), inversão do ônus da prova, vícios e fatos do produto/serviço, publicidade enganosa ou abusiva, restituição em dobro, e cláusulas abusivas em contratos.",
      "O agrupamento facilita a busca de precedentes em situações frequentes do dia a dia."
    ],
    areas: ["consumidor"],
    glossario: "responsabilidade-civil",
    problema: "comprei-produto-com-defeito",
    atualizado_em: "2026-05-21"
  },
  {
    slug: "trabalhista",
    titulo: "Direito do trabalho (no STJ)",
    keywords: [
      "trabalhista",
      "vínculo de emprego",
      "rescisão indireta",
      "contribuição previdenciária"
    ],
    descricao:
      "Decisões do STJ em matérias trabalhistas conexas — contribuições previdenciárias, execução fiscal trabalhista e demais temas sob sua competência.",
    intro: [
      "Embora a Justiça do Trabalho seja competente para o grosso das relações trabalhistas, o STJ decide temas conexos — contribuições previdenciárias sobre verbas trabalhistas, execução fiscal trabalhista, conflitos de competência e outras questões.",
      "As decisões aqui reunidas tocam essa interseção e ajudam profissionais a entender o entendimento da Corte."
    ],
    areas: ["trabalhista", "tributario"],
    glossario: "rescisao",
    problema: "fui-demitido-sem-receber-direitos",
    atualizado_em: "2026-05-21"
  },
  {
    slug: "previdenciario",
    titulo: "Direito previdenciário",
    keywords: ["INSS", "previdenciário", "aposentadoria", "benefício previdenciário"],
    descricao:
      "Decisões do STJ sobre benefícios do INSS — aposentadorias, auxílios, pensões e revisões.",
    intro: [
      "O STJ decide com frequência matérias previdenciárias relacionadas ao Regime Geral e a regimes próprios. Temas comuns são — concessão e revisão de benefícios, prazo decadencial, comprovação de tempo especial, e situações específicas como pensão por morte e benefício assistencial.",
      "O agrupamento aqui serve para localizar entendimentos consolidados e teses repetitivas."
    ],
    areas: ["previdenciario"],
    glossario: "aposentadoria",
    problema: "beneficio-do-inss-foi-negado",
    atualizado_em: "2026-05-21"
  },
  {
    slug: "tributario",
    titulo: "Direito tributário",
    keywords: ["tributário", "tributo", "execução fiscal", "ICMS", "PIS", "COFINS"],
    descricao:
      "Decisões do STJ sobre direito tributário — créditos, exclusões da base, execução fiscal e prescrição.",
    intro: [
      "Direito tributário é matéria de competência tradicional do STJ. Os precedentes recentes tratam de — exclusão de tributos da base de cálculo, créditos não cumulativos, prescrição e decadência tributária, execução fiscal, e teses repetitivas em casos relevantes.",
      "Os profissionais da área encontram aqui um agrupamento útil para construção de teses."
    ],
    areas: ["tributario", "empresarial"],
    glossario: "responsabilidade-civil",
    problema: "estou-sendo-cobrado-por-divida-prescrita",
    atualizado_em: "2026-05-21"
  },
  {
    slug: "criminal",
    titulo: "Direito criminal (no STJ)",
    keywords: ["habeas corpus", "criminal", "execução penal", "prescrição penal"],
    descricao:
      "Decisões do STJ em matéria criminal — habeas corpus, dosimetria, prescrição e execução da pena.",
    intro: [
      "Em matéria criminal, o STJ é o tribunal de uniformização infraconstitucional. Os temas comuns são — habeas corpus liberatórios, dosimetria, prescrição penal, execução de pena, regime de cumprimento e revisão criminal.",
      "Aqui há decisões relevantes para advogados criminalistas e estudantes."
    ],
    areas: ["criminal"],
    glossario: "habeas-corpus",
    problema: "fui-acusado-de-crime-e-nao-cometi",
    atualizado_em: "2026-05-21"
  },
  {
    slug: "imobiliario",
    titulo: "Direito imobiliário",
    keywords: ["compra e venda de imóvel", "imobiliário", "incorporação imobiliária", "registro de imóveis"],
    descricao:
      "Decisões do STJ sobre relações imobiliárias — compra e venda, locação, incorporação e registro.",
    intro: [
      "O direito imobiliário tem peculiaridades práticas — incorporação, registro de imóveis, financiamento, locação e usucapião. O STJ vem firmando entendimento sobre cláusulas em contratos imobiliários, atrasos em entrega, denúncia vazia em locação e questões registrais.",
      "Os precedentes ajudam a evitar surpresas e a entender o estado da jurisprudência."
    ],
    areas: ["imobiliario", "civil"],
    glossario: "usucapiao",
    problema: "vou-comprar-imovel-o-que-conferir",
    atualizado_em: "2026-05-21"
  },
  {
    slug: "familia",
    titulo: "Direito de família",
    keywords: ["família", "casamento", "união estável", "divórcio", "guarda compartilhada"],
    descricao:
      "Decisões do STJ sobre direito de família — casamento, união estável, guarda, divórcio e alimentos.",
    intro: [
      "O direito de família ocupa boa parte da pauta civil do STJ. Os precedentes recentes tratam de — guarda compartilhada como regra, conversão de união estável em casamento, alimentos a ex-cônjuge, partilha de bens em uniões longas e questões correlatas.",
      "Reunir decisões ajuda a entender direções jurisprudenciais e exceções típicas."
    ],
    areas: ["familia"],
    glossario: "divorcio",
    problema: "quero-me-divorciar",
    atualizado_em: "2026-05-21"
  },
  {
    slug: "bancario",
    titulo: "Direito bancário e contratos financeiros",
    keywords: [
      "bancário",
      "instituição financeira",
      "juros",
      "capitalização de juros",
      "contrato bancário"
    ],
    descricao:
      "Decisões do STJ sobre contratos bancários — juros, tarifas, revisional e cobrança.",
    intro: [
      "Contratos bancários e financeiros geram volumes expressivos de litígios. O STJ vem decidindo — capitalização de juros, taxas e tarifas, ações revisionais, cobranças indevidas, e questões em torno de cartões de crédito e financiamentos.",
      "O agrupamento facilita a localização de precedentes relevantes."
    ],
    areas: ["consumidor", "civil"],
    glossario: "responsabilidade-civil",
    problema: "fui-cobrado-juros-abusivos",
    atualizado_em: "2026-05-21"
  }
];

export const TEMA_SLUGS = TEMAS_STJ.map((t) => t.slug);

export function findTemaStj(slug: string): JurisTema | undefined {
  return TEMAS_STJ.find((t) => t.slug === slug);
}

/** Temas relacionados — mesmas áreas, exceto o próprio */
export function relatedTemasStj(slug: string, limit = 6): JurisTema[] {
  const current = findTemaStj(slug);
  if (!current) return [];
  return TEMAS_STJ.filter(
    (t) => t.slug !== slug && t.areas.some((a) => current.areas.includes(a))
  ).slice(0, limit);
}
