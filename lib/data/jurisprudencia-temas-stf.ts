/**
 * Temas de jurisprudência STF — hubs temáticos sob /jurisprudencia/stf/[tema].
 *
 * Mesma estrutura de jurisprudencia-temas.ts (STJ), aplicada ao STF.
 * O STF foca em direito constitucional, então os temas escolhidos refletem
 * matérias com decisões recorrentes do Plenário e das Turmas — habeas corpus,
 * repercussão geral, controle de constitucionalidade, direitos fundamentais.
 *
 * Defesa em profundidade:
 *  - Se < 3 decisões reais no banco, página marcada noindex (evita thin)
 *  - Conteúdo só agrupa o que está em jurisprudencia_decisoes (real e
 *    publicado) — sem invenção
 */

export type JurisTemaStf = {
  slug: string;
  titulo: string;
  /** Termo de busca usado na query (full text + fallback ilike) */
  keywords: string[];
  /** Para meta description (até 160 chars) */
  descricao: string;
  /** Intro da página em parágrafos */
  intro: string[];
  /** Áreas do direito */
  areas: string[];
  /** Slug do termo no glossário (interlink) */
  glossario?: string;
  /** Slug do problema jurídico (interlink) */
  problema?: string;
  /** Tema STJ correspondente, quando há (interlink) */
  tema_stj?: string;
  atualizado_em: string;
};

export const TEMAS_STF: JurisTemaStf[] = [
  {
    slug: "habeas-corpus",
    titulo: "Habeas corpus",
    keywords: ["habeas corpus", "HC"],
    descricao:
      "Decisões do STF em habeas corpus — pressupostos, hipóteses de cabimento, recurso ordinário, supressão de instância.",
    intro: [
      "O habeas corpus é remédio constitucional voltado a proteger a liberdade de locomoção contra coação ilegal ou abuso de poder. No STF, é matéria recorrente — especialmente em casos de prisão preventiva, conversão de prisão em flagrante e questionamento de medidas cautelares diversas da prisão.",
      "As decisões aqui reunidas vêm do Portal de Jurisprudência do STF e tratam de aspectos como competência da Corte para o HC, cabimento contra decisões de tribunal superior, possibilidade de concessão de ofício e modulação dos efeitos."
    ],
    areas: ["criminal"],
    glossario: "habeas-corpus",
    atualizado_em: "2026-05-22"
  },
  {
    slug: "controle-constitucionalidade",
    titulo: "Controle de constitucionalidade",
    keywords: ["controle de constitucionalidade", "ADI", "ADC", "ADPF"],
    descricao:
      "Decisões do STF em controle concentrado de constitucionalidade — ADI, ADC, ADPF, ações abstratas e seus pressupostos.",
    intro: [
      "O controle de constitucionalidade é uma das competências mais centrais do STF. A Corte exerce o controle concentrado por meio de Ação Direta de Inconstitucionalidade (ADI), Ação Declaratória de Constitucionalidade (ADC) e Arguição de Descumprimento de Preceito Fundamental (ADPF).",
      "As decisões aqui reunidas tratam de legitimidade ativa, parâmetros de controle, modulação de efeitos, declaração de inconstitucionalidade por arrastamento e técnicas de interpretação conforme."
    ],
    areas: ["constitucional"],
    atualizado_em: "2026-05-22"
  },
  {
    slug: "repercussao-geral",
    titulo: "Repercussão geral",
    keywords: ["repercussão geral", "tema de repercussão geral"],
    descricao:
      "Temas de repercussão geral reconhecidos pelo STF — requisitos, julgamentos e teses fixadas em recurso extraordinário.",
    intro: [
      "A repercussão geral é o filtro do recurso extraordinário ao STF — só são julgados recursos com questões constitucionais relevantes que ultrapassem os interesses subjetivos das partes. O instituto foi criado para racionalizar a atividade da Corte.",
      "Os temas aqui agrupados tratam de questões processuais relevantes — admissão, sobrestamento de processos no país, julgamento de mérito e fixação de tese vinculante para todas as instâncias."
    ],
    areas: ["constitucional", "civil"],
    atualizado_em: "2026-05-22"
  },
  {
    slug: "direito-a-saude",
    titulo: "Direito à saúde — judicialização",
    keywords: ["direito à saúde", "judicialização da saúde", "fornecimento de medicamento"],
    descricao:
      "Decisões do STF sobre direito à saúde — fornecimento de medicamentos, tratamento, responsabilidade solidária União/Estado/Município.",
    intro: [
      "O STF firmou entendimento de que o direito à saúde é direito fundamental e que a responsabilidade pelo fornecimento de medicamentos e tratamentos é solidária entre União, Estados, Distrito Federal e Municípios — o cidadão pode demandar qualquer ente. A jurisprudência também trata da necessidade de prévio requerimento administrativo.",
      "As decisões aqui agrupadas cobrem aspectos como medicamentos não incorporados ao SUS, judicialização e atuação do Núcleo de Apoio Técnico (NAT-Jus)."
    ],
    areas: ["constitucional", "previdenciario"],
    problema: "plano-saude-negou-procedimento",
    atualizado_em: "2026-05-22"
  },
  {
    slug: "direito-educacao",
    titulo: "Direito à educação",
    keywords: ["direito à educação", "ensino", "vaga em creche"],
    descricao:
      "Decisões do STF sobre direito à educação — vagas em creche, ensino fundamental obrigatório, cotas raciais e sociais.",
    intro: [
      "O STF reconhece o direito à educação como direito fundamental social e tem decisões emblemáticas sobre vaga em creche e pré-escola, cotas raciais e sociais em universidades públicas, ensino domiciliar e financiamento da educação básica.",
      "Os precedentes agrupados auxiliam a compreender quando o Poder Judiciário pode intervir para garantir a efetividade do direito à educação."
    ],
    areas: ["constitucional"],
    atualizado_em: "2026-05-22"
  },
  {
    slug: "direito-moradia",
    titulo: "Direito à moradia",
    keywords: ["direito à moradia", "bem de família"],
    descricao:
      "Decisões do STF sobre direito à moradia — impenhorabilidade de bem de família, fiador, ocupação irregular.",
    intro: [
      "O direito à moradia é direito social previsto na Constituição. O STF tem firmes decisões sobre o alcance da impenhorabilidade do bem de família, inclusive em locações onde há fiador, e sobre regularização fundiária de áreas ocupadas.",
      "As decisões reunidas aqui mostram a posição da Corte em casos limítrofes, como bem único e bem de família por equiparação."
    ],
    areas: ["constitucional", "imobiliario", "civil"],
    atualizado_em: "2026-05-22"
  },
  {
    slug: "dano-moral-constitucional",
    titulo: "Dano moral — perspectiva constitucional",
    keywords: ["dano moral", "danos morais", "indenização constitucional"],
    descricao:
      "Decisões do STF sobre dano moral — dignidade da pessoa humana, parâmetros e responsabilidade civil do Estado.",
    intro: [
      "Embora o dano moral seja tratado majoritariamente pelo STJ, o STF se manifesta em casos que envolvem dignidade da pessoa humana — direitos fundamentais lesados por agentes públicos, prisões ilegais, falhas graves de serviço público — e quando há repercussão geral reconhecida.",
      "As decisões agrupadas envolvem o entendimento da Corte sobre responsabilidade civil do Estado por dano moral, cumulação de pedidos e parâmetros de fixação."
    ],
    areas: ["constitucional", "civil"],
    glossario: "dano-moral",
    tema_stj: "dano-moral",
    atualizado_em: "2026-05-22"
  },
  {
    slug: "mandado-de-seguranca",
    titulo: "Mandado de segurança",
    keywords: ["mandado de segurança", "MS"],
    descricao:
      "Decisões do STF sobre mandado de segurança — competência originária, prazo decadencial, requisitos, MS coletivo.",
    intro: [
      "O mandado de segurança é remédio constitucional para proteger direito líquido e certo contra ato ilegal de autoridade pública. O STF tem competência originária para julgar mandados contra atos do Presidente, das Casas do Congresso, dos Ministros do STF, do Procurador-Geral e dos Tribunais Superiores.",
      "As decisões agrupadas tratam de cabimento, prova pré-constituída, prazo decadencial de 120 dias e diferenças entre MS individual e coletivo."
    ],
    areas: ["constitucional", "administrativo"],
    atualizado_em: "2026-05-22"
  },
  {
    slug: "devido-processo-legal",
    titulo: "Devido processo legal",
    keywords: ["devido processo legal", "ampla defesa", "contraditório"],
    descricao:
      "Decisões do STF sobre devido processo legal — ampla defesa, contraditório, nulidades, presunção de inocência.",
    intro: [
      "O devido processo legal é princípio constitucional-base que orienta a atuação do Poder Judiciário e da Administração. O STF tem extensa jurisprudência sobre o conteúdo material desse princípio — ampla defesa, contraditório, juiz natural, vedação de provas ilícitas, presunção de inocência.",
      "Os precedentes reunidos auxiliam a compreender quando há nulidade processual reconhecida pela Corte e quando é caso de mera irregularidade."
    ],
    areas: ["constitucional", "criminal"],
    atualizado_em: "2026-05-22"
  },
  {
    slug: "acao-popular-improbidade",
    titulo: "Ação popular e improbidade administrativa",
    keywords: ["ação popular", "improbidade administrativa", "ato de improbidade"],
    descricao:
      "Decisões do STF sobre ação popular e improbidade administrativa — legitimidade, prescrição, sanções, dolo específico.",
    intro: [
      "A ação popular permite que qualquer cidadão proteja o patrimônio público de atos lesivos. A Lei de Improbidade Administrativa (Lei 8.429/92, alterada em 2021) define atos de improbidade — enriquecimento ilícito, prejuízo ao erário e atos contra princípios.",
      "As decisões do STF aqui reunidas tratam da exigência de dolo específico (após a reforma de 2021), prescrição das pretensões e aplicação retroativa de regras mais benéficas."
    ],
    areas: ["constitucional", "administrativo"],
    atualizado_em: "2026-05-22"
  }
];

export const TEMAS_STF_SLUGS = TEMAS_STF.map((t) => t.slug);

export function findTemaStf(slug: string): JurisTemaStf | undefined {
  return TEMAS_STF.find((t) => t.slug === slug);
}

export function relatedTemasStf(slug: string, limit = 5): JurisTemaStf[] {
  const me = findTemaStf(slug);
  if (!me) return TEMAS_STF.slice(0, limit);
  return TEMAS_STF.filter(
    (t) => t.slug !== slug && t.areas.some((a) => me.areas.includes(a))
  ).slice(0, limit);
}
