/**
 * Guias por área do direito — páginas pilar que organizam a malha semântica.
 *
 * Cada guia é uma página tipo "central" que conecta — visão geral da área,
 * problemas frequentes, termos do glossário, temas de jurisprudência,
 * modelos relacionados e advogados por cidade.
 *
 * Slugs alinhados às specialties existentes em lib/data/specialties.ts
 * para evitar canibalização e reaproveitar o conteúdo.
 */

export type Guia = {
  slug: string;
  /** Slug correspondente em lib/data/specialties.ts */
  area_slug: string;
  titulo: string;
  /** Tagline curta (subtítulo na página) */
  tagline: string;
  /** Descrição completa em parágrafos (introdução do guia) */
  introducao: string[];
  /** Para quem é este guia (citizen / lawyer) — exibe boxes diferentes */
  publico_principal: "cidadao" | "advogado" | "ambos";
  /** Subáreas/temas principais cobertos */
  temas_centrais: Array<{ titulo: string; descricao: string }>;
  /** Quando procurar advogado nesta área */
  quando_procurar: string[];
  /** Problemas jurídicos relacionados (slugs) */
  problemas?: string[];
  /** Termos do glossário relacionados (slugs) */
  glossario?: string[];
  /** Temas de jurisprudência STJ relacionados (slugs) */
  temas_jurisprudencia?: string[];
  /** Modelos relacionados (slugs) */
  modelos?: string[];
  /** FAQ */
  faq?: Array<{ q: string; a: string }>;
  atualizado_em: string;
};

export const GUIAS: Guia[] = [
  {
    slug: "direito-do-consumidor",
    area_slug: "consumidor",
    titulo: "Guia de direito do consumidor",
    tagline: "Seus direitos em compras, contratos, serviços e cobrança — explicados em linguagem clara.",
    introducao: [
      "O direito do consumidor é o ramo do direito que regula a relação entre quem compra (consumidor) e quem vende ou presta serviços (fornecedor). O Código de Defesa do Consumidor (CDC), em vigor desde 1990, organiza essas regras e estabelece princípios como boa-fé, transparência, equilíbrio contratual e proteção da parte mais vulnerável.",
      "Na prática, abrange compras, contratos bancários, planos de saúde, telefonia, internet, transporte, educação, turismo, financiamentos e muito mais. Inclui também a chamada responsabilidade do fornecedor por danos morais e materiais quando há falha na prestação."
    ],
    publico_principal: "cidadao",
    temas_centrais: [
      {
        titulo: "Vícios e fatos do produto/serviço",
        descricao:
          "Diferença entre vício (defeito que prejudica funcionamento) e fato do produto (defeito que causa dano além do produto). Cada um tem regras próprias de prazo e reparação."
      },
      {
        titulo: "Cobranças indevidas",
        descricao:
          "Negativação indevida em SPC/Serasa, cobrança de dívida prescrita, cobranças abusivas — possibilidade de restituição em dobro e dano moral."
      },
      {
        titulo: "Publicidade enganosa e abusiva",
        descricao:
          "Quando a propaganda promete algo que não é entregue, ou explora vulnerabilidade — o CDC protege e há possibilidade de indenização."
      },
      {
        titulo: "Cláusulas abusivas",
        descricao:
          "Cláusulas que colocam o consumidor em desvantagem exagerada podem ser declaradas nulas em juízo, mesmo que assinadas."
      },
      {
        titulo: "Planos de saúde",
        descricao:
          "Recusa de cobertura, reajuste, carência, rol da ANS — área com farta jurisprudência."
      }
    ],
    quando_procurar: [
      "Quando há recusa de cobertura ou descumprimento contratual relevante",
      "Quando o valor da causa supera 20 salários mínimos (acima disso, advogado obrigatório no JEC)",
      "Quando há indício de cobrança em dobro, dano moral relevante ou comportamento sistêmico do fornecedor",
      "Quando os canais administrativos (Procon, SAC, ANS) não resolveram"
    ],
    problemas: [
      "nome-negativado-indevidamente",
      "plano-de-saude-negou-cirurgia",
      "comprei-produto-com-defeito",
      "fui-cobrado-juros-abusivos",
      "fui-vitima-de-golpe-do-pix",
      "estou-sendo-cobrado-por-divida-prescrita"
    ],
    glossario: [
      "dano-moral",
      "negativacao-indevida",
      "plano-de-saude",
      "prescricao",
      "responsabilidade-civil"
    ],
    temas_jurisprudencia: ["dano-moral", "negativacao-indevida", "plano-de-saude", "consumidor"],
    modelos: ["notificacao-extrajudicial"],
    faq: [
      {
        q: "Tudo é relação de consumo?",
        a: "Não. A relação de consumo exige que o consumidor seja destinatário final e que o outro lado seja fornecedor profissional. Vendas entre particulares, por exemplo, não são relação de consumo."
      },
      {
        q: "Vale a pena ir ao Procon?",
        a: "Costuma valer — gratuito, gera registro e pressão. Resolve boa parte dos casos antes da ação judicial."
      },
      {
        q: "O que é inversão do ônus da prova?",
        a: "Em situações específicas, o juiz pode determinar que o fornecedor é quem deve provar — em vez do consumidor. É um instrumento poderoso a favor da parte vulnerável."
      }
    ],
    atualizado_em: "2026-05-21"
  },
  {
    slug: "direito-de-familia",
    area_slug: "familia",
    titulo: "Guia de direito de família",
    tagline: "Divórcio, guarda, pensão, inventário, união estável — orientações claras pra momentos sensíveis.",
    introducao: [
      "Direito de família é o ramo que trata das relações familiares — casamento, união estável, separação, divórcio, guarda de filhos, pensão alimentícia, adoção e inventário. Toca temas sensíveis e exige atenção tanto técnica quanto humana.",
      "No Brasil, é regulamentado principalmente pelo Código Civil, com complementos da Constituição (proteção da família) e do Estatuto da Criança e do Adolescente (ECA)."
    ],
    publico_principal: "cidadao",
    temas_centrais: [
      {
        titulo: "Divórcio",
        descricao:
          "Dissolução do casamento — consensual ou litigioso, judicial ou em cartório. Acompanha partilha, guarda e pensão."
      },
      {
        titulo: "Guarda compartilhada",
        descricao:
          "Regra no Brasil atual — ambos os pais responsáveis, ainda que a criança more com um deles. Convivência é ajustada conforme melhor interesse."
      },
      {
        titulo: "Pensão alimentícia",
        descricao:
          "Para filhos menores principalmente, mas também pode envolver ex-cônjuges e parentes em linha reta."
      },
      {
        titulo: "Inventário e sucessão",
        descricao:
          "Procedimento para transferir bens após falecimento — judicial ou extrajudicial."
      },
      {
        titulo: "União estável",
        descricao:
          "Reconhecimento e dissolução têm regras próprias. Pode ser convertida em casamento por escritura ou por sentença."
      }
    ],
    quando_procurar: [
      "Quando há disputa sobre filhos (guarda, convivência)",
      "Quando há patrimônio comum significativo a dividir",
      "Quando há suspeita de ocultação de bens ou rendas",
      "Quando há urgência (violência, risco a crianças, situação financeira frágil)"
    ],
    problemas: [
      "quero-me-divorciar",
      "pai-nao-paga-pensao",
      "perdi-um-familiar-e-preciso-fazer-inventario"
    ],
    glossario: ["divorcio", "guarda", "pensao-alimenticia", "inventario"],
    temas_jurisprudencia: ["pensao-alimenticia", "inventario", "familia"],
    modelos: ["procuracao-ad-judicia"],
    faq: [
      {
        q: "Preciso de dois advogados no divórcio consensual?",
        a: "Não necessariamente. Um único advogado pode representar ambos quando há acordo total. Mas cada parte tem direito a advogado próprio se preferir."
      },
      {
        q: "Pensão é só para filho menor?",
        a: "Não. A obrigação alimentar pode atingir ex-cônjuges em situações específicas, ascendentes (filhos para pais idosos) e outros parentes em linha reta, conforme o caso."
      }
    ],
    atualizado_em: "2026-05-21"
  },
  {
    slug: "direito-trabalhista",
    area_slug: "trabalhista",
    titulo: "Guia de direito trabalhista",
    tagline: "Demissão, FGTS, horas extras, justa causa e seus direitos no emprego.",
    introducao: [
      "Direito trabalhista cuida das relações entre empregado e empregador. Tem duas grandes fontes — Consolidação das Leis do Trabalho (CLT), de 1943 e com várias atualizações; e a Constituição Federal, que estabelece direitos sociais.",
      "Inclui salário, jornada, descanso, férias, 13º, FGTS, segurança no trabalho, demissão e prazos prescricionais. Tudo isso é julgado na Justiça do Trabalho, com vara especializada e procedimento próprio."
    ],
    publico_principal: "cidadao",
    temas_centrais: [
      {
        titulo: "Verbas rescisórias",
        descricao:
          "Salário até o desligamento, férias, 13º proporcional, aviso prévio, FGTS e multa de 40% conforme o tipo de rescisão."
      },
      {
        titulo: "Justa causa e reversão",
        descricao:
          "Falta grave que dispensa o empregador de pagar parte das verbas. Quando indevida, pode ser revertida judicialmente."
      },
      {
        titulo: "Horas extras",
        descricao:
          "Trabalho além da jornada com adicional de pelo menos 50%. Cobrança exige prova do tempo efetivamente trabalhado."
      },
      {
        titulo: "Assédio moral e sexual",
        descricao:
          "Indenização por dano moral, eventual rescisão indireta (com verbas como sem justa causa) e responsabilidade criminal em casos específicos."
      },
      {
        titulo: "Vínculo de emprego",
        descricao:
          "Reconhecimento de vínculo quando há trabalho subordinado mascarado como prestação de serviços."
      }
    ],
    quando_procurar: [
      "Quando há valores rescisórios não pagos ou pagos a menos",
      "Quando há justa causa contestável",
      "Quando há assédio ou discriminação no ambiente de trabalho",
      "Em qualquer dúvida sobre prazos prescricionais — quanto antes consultar, melhor"
    ],
    problemas: [
      "fui-demitido-sem-receber-direitos",
      "fui-demitido-por-justa-causa-injusta",
      "fui-vitima-de-discriminacao-no-trabalho"
    ],
    glossario: ["fgts", "rescisao", "horas-extras", "dano-moral"],
    temas_jurisprudencia: ["trabalhista", "previdenciario"],
    modelos: ["procuracao-ad-judicia", "notificacao-extrajudicial"],
    faq: [
      {
        q: "Posso entrar na Justiça mesmo trabalhando ainda na empresa?",
        a: "Pode, mas vale ponderar — embora a lei proteja contra retaliação, há cenários em que a relação se desgasta. Conversar antes com advogado ajuda a planejar."
      },
      {
        q: "O que é rescisão indireta?",
        a: "É a 'demissão por justa causa do empregador' — quando o trabalhador rompe o contrato por culpa grave da empresa, mantendo direito a todas as verbas como na demissão sem justa causa."
      }
    ],
    atualizado_em: "2026-05-21"
  },
  {
    slug: "direito-previdenciario",
    area_slug: "previdenciario",
    titulo: "Guia de direito previdenciário",
    tagline: "Aposentadoria, auxílio-doença, pensão, BPC — como funciona e como reverter negativas do INSS.",
    introducao: [
      "Direito previdenciário regula os benefícios concedidos pelo INSS (Regime Geral) e por regimes próprios de servidores. Inclui aposentadoria, auxílio-doença, pensão por morte, salário-maternidade, salário-família, auxílio-acidente e o BPC (benefício de prestação continuada).",
      "Após a reforma da Previdência de 2019, vigem regras de transição complexas. Cada caso depende da combinação de idade, tempo de contribuição, regra aplicável e momento em que se enquadram os requisitos."
    ],
    publico_principal: "cidadao",
    temas_centrais: [
      {
        titulo: "Aposentadoria",
        descricao:
          "Várias modalidades — idade, tempo, especial, por incapacidade. Regras de transição muito relevantes."
      },
      {
        titulo: "Auxílio-doença",
        descricao:
          "Hoje chamado de benefício por incapacidade temporária. Cobre afastamento por mais de 15 dias."
      },
      {
        titulo: "Pensão por morte",
        descricao:
          "Concedida aos dependentes do segurado falecido. Regras dependem da data do óbito e do tempo de contribuição."
      },
      {
        titulo: "BPC",
        descricao:
          "Benefício assistencial para idosos ou pessoas com deficiência em situação de baixa renda. Não exige contribuição prévia."
      },
      {
        titulo: "Revisões",
        descricao:
          "Possibilidade de revisar benefício já concedido para incluir tempo não computado ou corrigir cálculo."
      }
    ],
    quando_procurar: [
      "Quando o INSS negou benefício ou concedeu valor abaixo do esperado",
      "Quando há tempo de contribuição em discussão (rural, especial, períodos antigos)",
      "Quando há incapacidade que não está sendo reconhecida",
      "Quando há possibilidade de revisão (alguns prazos são curtos)"
    ],
    problemas: ["beneficio-do-inss-foi-negado"],
    glossario: ["aposentadoria", "auxilio-doenca"],
    temas_jurisprudencia: ["previdenciario"],
    modelos: ["procuracao-ad-judicia"],
    faq: [
      {
        q: "Posso entrar direto na Justiça?",
        a: "Em regra é exigido prévio requerimento administrativo. Se já houve indeferimento, a via judicial está aberta."
      },
      {
        q: "Quanto tempo a Justiça Federal demora?",
        a: "Varia. Em ações com perícia obrigatória (incapacidade), costumam ser alguns meses pra audiência. Sentenças de aposentadoria por idade são geralmente mais rápidas."
      }
    ],
    atualizado_em: "2026-05-21"
  },
  {
    slug: "direito-civil",
    area_slug: "civil",
    titulo: "Guia de direito civil",
    tagline: "Contratos, responsabilidade civil, posse, propriedade — o tronco do direito privado brasileiro.",
    introducao: [
      "Direito civil é o ramo mais abrangente do direito privado. Regula relações entre particulares — contratos, obrigações, responsabilidade civil, posse, propriedade, família e sucessões.",
      "É a base que sustenta vários outros ramos, como consumidor e empresarial. Quando há um conflito que não tem regra especial, em geral o Código Civil dá a resposta."
    ],
    publico_principal: "ambos",
    temas_centrais: [
      {
        titulo: "Contratos",
        descricao:
          "Formação, execução, descumprimento, rescisão. Boa-fé objetiva como princípio orientador."
      },
      {
        titulo: "Responsabilidade civil",
        descricao:
          "Subjetiva (com culpa) e objetiva (sem culpa, em hipóteses específicas). Bases para indenizações por danos materiais e morais."
      },
      {
        titulo: "Posse e propriedade",
        descricao:
          "Aquisição, perda, defesa. Inclui usucapião e ações possessórias."
      },
      {
        titulo: "Direitos da personalidade",
        descricao:
          "Honra, imagem, intimidade, privacidade. Base para boa parte das ações de dano moral."
      },
      {
        titulo: "Prescrição e decadência",
        descricao:
          "Tempo limite para exercer direitos. Erro comum é confundir os dois ou perder o prazo."
      }
    ],
    quando_procurar: [
      "Em qualquer contrato relevante (compra de imóvel, financiamento alto, sociedade)",
      "Quando há violação contratual e busca por indenização",
      "Quando há litígio sobre bem (imóvel, veículo, herança)",
      "Quando há prazos prescricionais sob risco"
    ],
    problemas: [
      "vou-comprar-imovel-o-que-conferir",
      "preciso-cobrar-divida-de-cliente",
      "fui-vitima-de-acidente-de-transito",
      "fui-mordido-por-cachorro",
      "vizinho-fazendo-barulho"
    ],
    glossario: ["responsabilidade-civil", "dano-moral", "dano-material", "prescricao"],
    temas_jurisprudencia: ["responsabilidade-civil", "consumidor", "imobiliario"],
    modelos: ["procuracao-ad-judicia", "notificacao-extrajudicial"],
    atualizado_em: "2026-05-21"
  },
  {
    slug: "direito-criminal",
    area_slug: "criminal",
    titulo: "Guia de direito criminal",
    tagline: "Defesa em inquéritos, audiências, processos e execução penal.",
    introducao: [
      "Direito criminal (ou penal) cuida da relação entre o Estado e quem é acusado de crime. Tem regras próprias muito rigorosas, justamente porque envolve liberdade.",
      "Entre os princípios mais importantes — presunção de inocência, contraditório, ampla defesa e direito ao silêncio. A defesa técnica acompanha em todas as fases — investigação, inquérito, ação penal, recursos e execução."
    ],
    publico_principal: "cidadao",
    temas_centrais: [
      {
        titulo: "Inquérito policial",
        descricao:
          "Fase preliminar de investigação. Defesa pode atuar para esclarecer fatos e evitar acusação infundada."
      },
      {
        titulo: "Habeas corpus",
        descricao:
          "Ação constitucional contra prisão ilegal ou ameaça. Rito sumário, sem custas."
      },
      {
        titulo: "Ação penal",
        descricao:
          "Defesa em juízo. Audiência de instrução, alegações finais, sentença e recursos."
      },
      {
        titulo: "Execução penal",
        descricao:
          "Após sentença, cuida-se do cumprimento — regime, progressão, livramento condicional, saídas, indulto."
      },
      {
        titulo: "Recursos",
        descricao:
          "Apelação, recurso especial, recurso extraordinário, revisão criminal — caminhos para discutir condenações."
      }
    ],
    quando_procurar: [
      "Imediatamente, sempre que houver intimação, citação ou prisão",
      "Antes de qualquer depoimento, mesmo como testemunha em caso sensível",
      "Em casos de mandado de busca e apreensão",
      "Para revisão de condenação ou pedido de soltura"
    ],
    problemas: ["fui-acusado-de-crime-e-nao-cometi"],
    glossario: ["habeas-corpus", "recurso-especial", "acordao"],
    temas_jurisprudencia: ["criminal"],
    modelos: ["procuracao-ad-judicia"],
    faq: [
      {
        q: "Posso confiar em advogado dativo?",
        a: "Em regra sim — são profissionais qualificados nomeados pelo juiz quando o réu não tem condições. Mas todos têm direito a contratar advogado de confiança se quiser."
      },
      {
        q: "Quando termina o sigilo de uma investigação?",
        a: "O sigilo é exceção. A Súmula Vinculante 14 do STF garante à defesa amplo acesso ao inquérito, salvo diligências em andamento."
      }
    ],
    atualizado_em: "2026-05-21"
  },
  {
    slug: "direito-imobiliario",
    area_slug: "imobiliario",
    titulo: "Guia de direito imobiliário",
    tagline: "Compra de imóvel, locação, usucapião, regularização — proteger o maior patrimônio.",
    introducao: [
      "Direito imobiliário cuida das relações jurídicas envolvendo bens imóveis — compra e venda, locação, financiamento, incorporação, condomínio, usucapião e regularização fundiária.",
      "É área em que erros costumam custar caro. Advogado especializado costuma poupar mais do que cobra de honorário, pelo simples ato de revisar contratos e certidões antes da assinatura."
    ],
    publico_principal: "cidadao",
    temas_centrais: [
      {
        titulo: "Compra e venda",
        descricao:
          "Análise contratual, verificação documental do imóvel e dos vendedores, registro em cartório."
      },
      {
        titulo: "Locação",
        descricao:
          "Lei do Inquilinato (8.245/91) regula. Inclui despejo, fiança, multas e atualização."
      },
      {
        titulo: "Financiamento imobiliário",
        descricao:
          "Programas como Casa Verde e Amarela, financiamento privado, condições contratuais e renegociação."
      },
      {
        titulo: "Usucapião",
        descricao:
          "Várias modalidades. Possibilidade extrajudicial em cartório quando não há conflito."
      },
      {
        titulo: "Regularização",
        descricao:
          "Para imóveis sem matrícula atualizada, em loteamento irregular ou com pendência fiscal."
      }
    ],
    quando_procurar: [
      "Antes de fechar qualquer compra/venda relevante",
      "Em disputas locatícias (despejo, descumprimento, multa)",
      "Em qualquer caso envolvendo usucapião",
      "Para regularização documental do imóvel"
    ],
    problemas: ["vou-comprar-imovel-o-que-conferir"],
    glossario: ["usucapiao", "responsabilidade-civil"],
    temas_jurisprudencia: ["usucapiao", "imobiliario"],
    modelos: ["notificacao-extrajudicial"],
    atualizado_em: "2026-05-21"
  },
  {
    slug: "direito-tributario",
    area_slug: "tributario",
    titulo: "Guia de direito tributário",
    tagline: "Impostos, taxas, contribuições, parcelamentos e defesas fiscais — planejamento e contencioso.",
    introducao: [
      "Direito tributário regula a cobrança de tributos pelo Estado — impostos, taxas e contribuições. É campo técnico, com várias particularidades por ente federativo (União, estados, municípios).",
      "Engloba defesa em autuações, recuperação de créditos, planejamento fiscal, parcelamento, execução fiscal e questões previdenciárias relacionadas. Empresas costumam ter pessoal dedicado; pessoas físicas, em geral, atuam pontualmente."
    ],
    publico_principal: "ambos",
    temas_centrais: [
      {
        titulo: "Execução fiscal",
        descricao:
          "Processo do Estado para cobrar dívida tributária. Defesa via embargos, exceção de pré-executividade ou negociações."
      },
      {
        titulo: "Recuperação de créditos",
        descricao:
          "Identificação de tributos pagos a maior e pedidos de restituição ou compensação."
      },
      {
        titulo: "Parcelamentos especiais",
        descricao:
          "Refis, PRT, PERT e similares — programas que permitem regularizar dívidas com condições especiais."
      },
      {
        titulo: "Planejamento tributário",
        descricao:
          "Estruturação lícita para reduzir carga tributária — escolha de regime, segregação de atividades, holdings."
      },
      {
        titulo: "Defesas administrativas",
        descricao:
          "Antes de qualquer ação judicial, há possibilidade de impugnar autuações na esfera administrativa."
      }
    ],
    quando_procurar: [
      "Diante de autuação fiscal",
      "Quando há tributo pago a maior por longo período",
      "Antes de mudanças relevantes na estrutura do negócio",
      "Em cobrança de execução fiscal já em curso"
    ],
    problemas: ["fui-cobrado-juros-abusivos", "estou-sendo-cobrado-por-divida-prescrita"],
    glossario: ["prescricao", "responsabilidade-civil"],
    temas_jurisprudencia: ["tributario", "bancario"],
    modelos: ["procuracao-ad-judicia"],
    atualizado_em: "2026-05-21"
  },
  {
    slug: "direito-empresarial",
    area_slug: "empresarial",
    titulo: "Guia de direito empresarial",
    tagline: "Sociedades, contratos comerciais, recuperação judicial e governança — quem empreende precisa de base sólida.",
    introducao: [
      "Direito empresarial cuida das relações jurídicas envolvendo empresas — constituição de sociedades, contratos, marcas, recuperação judicial, falência, governança e responsabilidade dos sócios e administradores.",
      "É área que combina técnica jurídica e visão de negócio. A escolha do tipo societário, a estrutura contratual com parceiros e a prevenção de litígios são decisões que impactam todo o ciclo de vida da empresa."
    ],
    publico_principal: "advogado",
    temas_centrais: [
      {
        titulo: "Constituição e tipos societários",
        descricao:
          "Ltda, S/A, EIRELI (extinto), Sociedade Limitada Unipessoal, MEI. Cada tipo tem regras próprias de responsabilidade, governança e tributação."
      },
      {
        titulo: "Contratos empresariais",
        descricao:
          "Fornecimento, distribuição, franquia, parceria, joint venture, M&A. Personalização e clareza são essenciais."
      },
      {
        titulo: "Recuperação judicial e falência",
        descricao:
          "Quando a empresa enfrenta dificuldade financeira, a Lei 11.101/2005 oferece o caminho da recuperação. Em situações irreversíveis, há a falência."
      },
      {
        titulo: "Governança e compliance",
        descricao:
          "Estruturas internas que reduzem risco — anticorrupção, LGPD, código de conduta, treinamento."
      },
      {
        titulo: "Propriedade intelectual",
        descricao:
          "Marcas, patentes, software, direitos autorais. Registro no INPI quando aplicável."
      }
    ],
    quando_procurar: [
      "Antes de constituir sociedade ou alterar quadro societário",
      "Em qualquer contrato com peso financeiro relevante",
      "Em disputas com sócios, parceiros, fornecedores ou clientes empresariais",
      "Diante de sinais de crise financeira ou inadimplência de terceiros"
    ],
    problemas: ["preciso-cobrar-divida-de-cliente"],
    glossario: ["responsabilidade-civil", "prescricao"],
    temas_jurisprudencia: ["bancario", "tributario"],
    modelos: ["procuracao-ad-judicia", "notificacao-extrajudicial"],
    atualizado_em: "2026-05-21"
  },
  {
    slug: "direito-digital",
    area_slug: "digital",
    titulo: "Guia de direito digital",
    tagline: "LGPD, crimes virtuais, contratos eletrônicos, marcas digitais — o ambiente jurídico da internet.",
    introducao: [
      "Direito digital é o ramo que organiza as questões jurídicas surgidas no ambiente eletrônico — proteção de dados pessoais (LGPD), crimes cibernéticos, contratos eletrônicos, propriedade intelectual digital, marco civil da internet e responsabilidade de provedores.",
      "É área em rápida evolução, com legislação relativamente nova (LGPD de 2018, Marco Civil de 2014) e jurisprudência em formação. Empresas que tratam dados pessoais têm obrigações concretas; pessoas físicas têm direitos crescentes."
    ],
    publico_principal: "ambos",
    temas_centrais: [
      {
        titulo: "LGPD",
        descricao:
          "Lei Geral de Proteção de Dados. Estabelece direitos de titulares e deveres de controladores e operadores. Multas relevantes em caso de descumprimento."
      },
      {
        titulo: "Crimes cibernéticos",
        descricao:
          "Invasão de dispositivo, fraude eletrônica, estelionato digital, divulgação não autorizada de imagens — vários tipos penais já tipificados."
      },
      {
        titulo: "Responsabilidade de provedores",
        descricao:
          "Marco Civil estabelece regras sobre quando o provedor responde por conteúdo de terceiros."
      },
      {
        titulo: "Contratos eletrônicos",
        descricao:
          "Validade da assinatura eletrônica, ICP-Brasil, contratos clickwrap e browsewrap."
      },
      {
        titulo: "Direitos da personalidade online",
        descricao:
          "Direito ao esquecimento (em situações específicas), reputação digital, remoção de conteúdo."
      }
    ],
    quando_procurar: [
      "Para empresas — adequação à LGPD, contratos de tratamento de dados",
      "Em casos de vazamento de dados",
      "Diante de divulgação não autorizada de imagens ou difamação online",
      "Para registro e defesa de marcas digitais"
    ],
    glossario: ["responsabilidade-civil", "dano-moral"],
    temas_jurisprudencia: ["responsabilidade-civil", "consumidor"],
    modelos: ["notificacao-extrajudicial"],
    atualizado_em: "2026-05-21"
  }
];

export const GUIA_SLUGS = GUIAS.map((g) => g.slug);

export function findGuia(slug: string): Guia | undefined {
  return GUIAS.find((g) => g.slug === slug);
}

export function findGuiaByArea(areaSlug: string): Guia | undefined {
  return GUIAS.find((g) => g.area_slug === areaSlug);
}

/* ────────────────────────────────────────────────────────────────────────
 * CONTEÚDO APROFUNDADO DOS GUIAS ("guia completo")
 *
 * Mapa opcional por slug que enriquece o guia-pilar com seções práticas:
 * como funciona, passo a passo (vira HowTo no schema), prazos, documentos,
 * custos, erros comuns e direitos-chave. Conteúdo geral e conservador —
 * NÃO substitui consulta a advogado (disclaimer já exibido na página).
 * ──────────────────────────────────────────────────────────────────────── */

export type GuiaPasso = { titulo: string; detalhe: string };
export type GuiaPrazo = { prazo: string; descricao: string };
export type GuiaDireito = { titulo: string; detalhe: string };

export type GuiaConteudo = {
  /** Parágrafos explicando como a área funciona na prática. */
  como_funciona?: string[];
  /** Passo a passo ordenado — usado também no schema HowTo. */
  passo_a_passo?: GuiaPasso[];
  /** Prazos que o cidadão precisa conhecer. */
  prazos?: GuiaPrazo[];
  /** Documentos que costumam ser necessários. */
  documentos?: string[];
  /** Quanto costuma custar / quando é gratuito. */
  custos?: string[];
  /** Erros comuns que prejudicam o caso. */
  erros_comuns?: string[];
  /** Direitos/pontos-chave que muita gente não conhece. */
  direitos_chave?: GuiaDireito[];
};

export const GUIA_CONTEUDO: Record<string, GuiaConteudo> = {
  "direito-do-consumidor": {
    como_funciona: [
      "Toda vez que você compra um produto ou contrata um serviço de uma empresa, nasce uma relação de consumo protegida pelo Código de Defesa do Consumidor (CDC). Isso vale para loja física, internet, banco, plano de saúde, telefonia, faculdade, companhia aérea e quase tudo que se paga a um fornecedor profissional.",
      "A lógica do CDC é proteger quem está em desvantagem: o consumidor. Por isso ele cria mecanismos fortes — como a possibilidade de o juiz inverter o ônus da prova (a empresa é que tem de provar) e a devolução em dobro do que foi cobrado indevidamente. A maioria dos casos se resolve antes da Justiça, pela reclamação formal, pelo Procon ou pelo consumidor.gov.br."
    ],
    passo_a_passo: [
      { titulo: "Reúna as provas", detalhe: "Guarde nota fiscal, contrato, prints de conversa, e-mails, fotos do defeito e o número de protocolo de cada contato. Sem prova, o caso fica frágil." },
      { titulo: "Reclame primeiro com a empresa", detalhe: "Use o SAC ou a ouvidoria e anote SEMPRE o número de protocolo, a data e o nome do atendente. Dê um prazo razoável para a solução." },
      { titulo: "Registre no consumidor.gov.br", detalhe: "Plataforma oficial e gratuita do governo. Empresas costumam responder em até 10 dias, e fica um histórico público útil se você precisar ir à Justiça." },
      { titulo: "Procure o Procon", detalhe: "Gratuito. Gera audiência de conciliação e pressão. Resolve boa parte dos casos e produz um registro formal da reclamação." },
      { titulo: "Vá ao Juizado Especial (JEC) se não resolver", detalhe: "Causas de até 20 salários mínimos podem ser ajuizadas sem advogado. Acima disso, e até 40 salários, o advogado é obrigatório." }
    ],
    prazos: [
      { prazo: "30 dias", descricao: "Para reclamar de vício em produto/serviço NÃO durável (alimento, serviço pontual) — art. 26 do CDC." },
      { prazo: "90 dias", descricao: "Para reclamar de vício em produto/serviço DURÁVEL (eletrodoméstico, carro, móvel) — art. 26 do CDC." },
      { prazo: "7 dias", descricao: "Direito de arrependimento em compras fora da loja física (internet, telefone) — devolução integral, art. 49 do CDC." },
      { prazo: "5 anos", descricao: "Para pedir indenização por fato do produto/serviço (acidente de consumo, dano à saúde) — art. 27 do CDC." }
    ],
    documentos: [
      "Nota fiscal ou comprovante de pagamento",
      "Contrato ou termos do serviço contratado",
      "Números de protocolo de todos os contatos com a empresa",
      "Prints de conversas, e-mails e propaganda que motivou a compra",
      "Fotos ou vídeos do defeito"
    ],
    custos: [
      "Procon e consumidor.gov.br: gratuitos",
      "Juizado Especial até 20 salários mínimos: sem custas iniciais e sem advogado obrigatório",
      "Ação acima de 20 salários: pode haver custas e honorários — vale orçar com advogado antes"
    ],
    erros_comuns: [
      "Perder o prazo de 30 ou 90 dias para reclamar do vício",
      "Não anotar o número de protocolo das reclamações",
      "Descartar a nota fiscal e a embalagem antes de resolver",
      "Aceitar acordo ruim por pressa, sem comparar com o direito que tem"
    ],
    direitos_chave: [
      { titulo: "Devolução em dobro", detalhe: "Cobrança indevida já paga pode ser devolvida em dobro e corrigida, salvo engano justificável (art. 42, § único, CDC)." },
      { titulo: "Inversão do ônus da prova", detalhe: "O juiz pode determinar que a empresa é quem deve provar que agiu certo — um instrumento forte a favor do consumidor." },
      { titulo: "Conserto em 30 dias", detalhe: "No vício, a empresa tem 30 dias para consertar. Passou disso, você escolhe entre troca, dinheiro de volta ou abatimento." }
    ]
  },

  "direito-de-familia": {
    como_funciona: [
      "O direito de família cuida de casamento, união estável, divórcio, guarda de filhos, pensão alimentícia, partilha de bens e reconhecimento de paternidade. É a área mais sensível do dia a dia, porque envolve dinheiro e afeto ao mesmo tempo.",
      "Quando há acordo entre as partes e não há filhos menores ou incapazes, muita coisa pode ser resolvida em cartório, de forma mais rápida e barata. Havendo disputa ou filhos menores, o caminho é o Judiciário. Em qualquer caso, o advogado é obrigatório (ou a Defensoria Pública, para quem não pode pagar)."
    ],
    passo_a_passo: [
      { titulo: "Defina se é consensual ou litigioso", detalhe: "Se as duas partes concordam com tudo (bens, guarda, pensão), o processo é muito mais rápido. Se há disputa, prepare-se para uma fase de provas." },
      { titulo: "Reúna documentos e levante os bens", detalhe: "Certidão de casamento, documentos dos filhos e a lista de bens e dívidas do casal. A partilha depende dessa fotografia do patrimônio." },
      { titulo: "Tente um acordo sobre os filhos", detalhe: "Guarda (compartilhada é a regra), convivência e valor da pensão. Acordo bem feito evita anos de briga e protege a criança." },
      { titulo: "Formalize em cartório ou na Justiça", detalhe: "Divórcio consensual sem menores: escritura em cartório, com advogado. Com menores ou litígio: ação judicial." },
      { titulo: "Registre e execute", detalhe: "Averbe o divórcio no registro civil. Se a pensão não for paga, é possível executar — inclusive com prisão do devedor." }
    ],
    prazos: [
      { prazo: "Sem prazo", descricao: "O divórcio é um direito de quem pede; não depende da concordância do outro nem de tempo mínimo de casamento." },
      { prazo: "Até 3 parcelas", descricao: "O atraso das 3 prestações mais recentes de pensão permite pedir a prisão civil do devedor (art. 528 do CPC)." },
      { prazo: "Desde a citação", descricao: "A pensão alimentícia é devida, em regra, a partir da citação no processo — por isso não convém demorar para entrar." },
      { prazo: "2 anos", descricao: "Prazo para o cônjuge pedir a partilha de bens após o divórcio, quando ela não foi feita junto." }
    ],
    documentos: [
      "Certidão de casamento atualizada (ou prova da união estável)",
      "RG e CPF das partes",
      "Certidão de nascimento dos filhos",
      "Documentos dos bens (matrícula de imóvel, documento do carro, extratos)",
      "Comprovantes de renda e de despesas dos filhos (para a pensão)"
    ],
    custos: [
      "Defensoria Pública: gratuita para quem comprova que não pode pagar",
      "Divórcio em cartório: custas da escritura + honorários de advogado",
      "Processo judicial: custas variam por estado; é possível pedir gratuidade de justiça"
    ],
    erros_comuns: [
      "Combinar pensão 'de boca', sem documento — depois não dá para provar nem executar",
      "Deixar de averbar o divórcio no registro civil",
      "Abrir mão da guarda ou de bens por pressão emocional, sem orientação",
      "Parar de pagar pensão por estar sem ver o filho (são coisas separadas — o não pagamento gera prisão mesmo assim)"
    ],
    direitos_chave: [
      { titulo: "Guarda compartilhada é a regra", detalhe: "A lei prioriza que os dois pais dividam as decisões sobre o filho, mesmo morando em casas diferentes." },
      { titulo: "Pensão também para a gestante", detalhe: "Existem os alimentos gravídicos: a gestante pode pedir ajuda nas despesas da gravidez ao suposto pai." },
      { titulo: "Prisão por pensão atrasada", detalhe: "O devedor de pensão pode ser preso (regime fechado, separado de presos comuns) pelas parcelas recentes não pagas." }
    ]
  },

  "direito-trabalhista": {
    como_funciona: [
      "O direito do trabalho regula a relação entre empregado e empregador: contratação, jornada, salário, férias, FGTS e, principalmente, o acerto na hora da saída. A maior parte das dúvidas surge na demissão — o que você tem a receber e em quanto tempo.",
      "Na demissão SEM justa causa, o trabalhador tem direito ao conjunto completo de verbas. Na demissão POR justa causa, recebe muito menos. E existe a rescisão indireta — quando é o patrão que erra grave e o empregado pede para sair recebendo como se fosse sem justa causa."
    ],
    passo_a_passo: [
      { titulo: "Confira o tipo de desligamento", detalhe: "Sem justa causa, pedido de demissão, justa causa ou acordo (art. 484-A) mudam tudo o que você recebe. Confira o que está escrito no documento." },
      { titulo: "Some as verbas devidas", detalhe: "Na saída sem justa causa: saldo de salário, aviso prévio, 13º proporcional, férias proporcionais + 1/3, multa de 40% do FGTS e liberação do seguro-desemprego." },
      { titulo: "Guarde todos os documentos", detalhe: "Carteira de trabalho, contracheques, TRCT (termo de rescisão), controles de ponto e mensagens. São a base de qualquer reclamação." },
      { titulo: "Confira o pagamento e as guias", detalhe: "O acerto deve ser pago em até 10 dias. Confira também as guias do FGTS e do seguro-desemprego. Não dê 'quitação geral' sem entender." },
      { titulo: "Procure a Justiça do Trabalho se faltou algo", detalhe: "Verbas não pagas, horas extras, assédio ou acúmulo de função podem ser cobrados — em regra, dos últimos 5 anos." }
    ],
    prazos: [
      { prazo: "10 dias", descricao: "Prazo do empregador para pagar as verbas rescisórias após o fim do contrato (art. 477 da CLT). Atraso gera multa." },
      { prazo: "2 anos", descricao: "Prazo para ENTRAR com a ação trabalhista, contado do fim do contrato (prescrição bienal — art. 7º, XXIX, CF)." },
      { prazo: "5 anos", descricao: "Período que se pode cobrar 'para trás' dentro do contrato (prescrição quinquenal): horas extras, diferenças etc." },
      { prazo: "Até 90 dias", descricao: "Duração possível do aviso prévio: 30 dias + 3 dias por ano trabalhado, até o limite de 90 dias." }
    ],
    documentos: [
      "Carteira de Trabalho (física ou digital)",
      "Contracheques / holerites",
      "TRCT — Termo de Rescisão do Contrato de Trabalho",
      "Controles de ponto, escalas e comprovantes de horas extras",
      "Mensagens, e-mails e testemunhas que comprovem o combinado"
    ],
    custos: [
      "Justiça do Trabalho: é possível pedir justiça gratuita para quem comprova baixa renda",
      "Honorários de advogado: muitos atuam por percentual do que for ganho (êxito)",
      "Quem perde pode ter de pagar honorários de sucumbência à outra parte"
    ],
    erros_comuns: [
      "Assinar a rescisão sem conferir os valores e as guias",
      "Acreditar que 'acordo' por fora substitui os direitos da CLT",
      "Demorar mais de 2 anos e perder o prazo da ação",
      "Não guardar prova das horas extras (a palavra sozinha costuma não bastar)"
    ],
    direitos_chave: [
      { titulo: "Rescisão indireta", detalhe: "Se o patrão atrasa salário, assedia ou descumpre o contrato, você pode pedir a saída recebendo como demissão sem justa causa." },
      { titulo: "Horas extras e adicionais", detalhe: "Trabalho além da jornada, à noite ou em condição insalubre/perigosa gera adicional — mesmo sem combinação por escrito." },
      { titulo: "FGTS + 40%", detalhe: "Na saída sem justa causa, você saca o FGTS e recebe multa de 40% sobre o saldo depositado." }
    ]
  },

  "direito-previdenciario": {
    como_funciona: [
      "O direito previdenciário trata dos benefícios do INSS: aposentadorias, auxílio por incapacidade (antigo auxílio-doença), pensão por morte, salário-maternidade e o BPC/LOAS (benefício assistencial para idosos e pessoas com deficiência de baixa renda).",
      "Muita gente tem o benefício negado por falta de documento, perícia desfavorável ou tempo de contribuição mal calculado. Negativa NÃO é o fim: cabe recurso administrativo e, se preciso, ação judicial. O segredo costuma estar na prova — laudos médicos e histórico de contribuições (CNIS)."
    ],
    passo_a_passo: [
      { titulo: "Peça a cópia do seu processo", detalhe: "Pelo Meu INSS, baixe a carta de indeferimento e o CNIS (histórico de contribuições). Entender o motivo da negativa é o primeiro passo." },
      { titulo: "Organize as provas", detalhe: "Para benefício por doença, reúna laudos, exames e receitas. Para tempo de contribuição, junte carteiras, carnês e comprovantes que faltaram." },
      { titulo: "Apresente recurso administrativo", detalhe: "Você tem 30 dias para recorrer ao Conselho de Recursos da Previdência (CRPS), sem advogado obrigatório, juntando o que faltou." },
      { titulo: "Avalie a ação judicial", detalhe: "Se o recurso não resolver, cabe ação na Justiça Federal. Em regra, é preciso ter pedido o benefício antes no INSS (prévio requerimento)." },
      { titulo: "Acompanhe a perícia", detalhe: "Em benefícios por incapacidade, a perícia médica é decisiva. Leve todos os laudos e relate com clareza as limitações do dia a dia." }
    ],
    prazos: [
      { prazo: "30 dias", descricao: "Para recorrer da negativa do INSS ao Conselho de Recursos (CRPS), contados da ciência da decisão." },
      { prazo: "5 anos", descricao: "Prazo de prescrição das parcelas atrasadas: você não perde o direito, mas só recebe retroativo dos últimos 5 anos." },
      { prazo: "Carência", descricao: "Muitos benefícios exigem um número mínimo de contribuições (ex.: 12 para auxílio por incapacidade). Verifique antes de pedir." }
    ],
    documentos: [
      "Carta de indeferimento do INSS",
      "CNIS — extrato de contribuições (Meu INSS)",
      "Laudos, exames e receitas médicas (benefícios por incapacidade)",
      "Carteiras de trabalho, carnês e comprovantes de contribuição",
      "Documentos que comprovem atividade rural, se for o caso"
    ],
    custos: [
      "Recurso administrativo no INSS: gratuito, sem advogado obrigatório",
      "Justiça Federal: é possível pedir justiça gratuita",
      "Advogado previdenciário: muitos cobram percentual sobre os atrasados (êxito)"
    ],
    erros_comuns: [
      "Perder o prazo de 30 dias para recorrer da negativa",
      "Ir à perícia sem levar laudos e exames atualizados",
      "Parar de contribuir e perder a qualidade de segurado",
      "Pedir o benefício errado para o seu caso (cada um tem requisitos próprios)"
    ],
    direitos_chave: [
      { titulo: "Negativa não é o fim", detalhe: "A maioria das negativas é por falta de documento ou perícia — o recurso, bem instruído, reverte muitos casos." },
      { titulo: "Pagamento retroativo", detalhe: "Quando o benefício é concedido na Justiça, costuma vir o atrasado desde a data em que você tinha direito (respeitados os 5 anos)." },
      { titulo: "Planejamento da aposentadoria", detalhe: "Antes de pedir, vale simular: às vezes esperar alguns meses ou acertar o CNIS aumenta muito o valor." }
    ]
  },

  "direito-civil": {
    como_funciona: [
      "O direito civil é o tronco do dia a dia: contratos, dívidas, indenizações (responsabilidade civil), nome negativado, vizinhança, heranças e relações em geral entre pessoas e empresas. Quando alguém descumpre um acordo ou causa um dano, é aqui que se discute reparação.",
      "Dois temas concentram a maioria das dúvidas do cidadão: cobrança/negativação indevida e pedido de indenização por dano moral ou material. Em ambos, prova e prazo são decisivos — guardar comprovantes e não deixar o direito 'prescrever' faz toda a diferença."
    ],
    passo_a_passo: [
      { titulo: "Junte o histórico", detalhe: "Contrato, comprovantes de pagamento, extratos, prints e a carta de cobrança. É o que mostra quem cumpriu e quem não cumpriu." },
      { titulo: "Notifique a outra parte", detalhe: "Uma notificação extrajudicial (até por e-mail com confirmação) registra que você tentou resolver e abre prazo para a solução." },
      { titulo: "No caso de negativação, conteste", detalhe: "Reclame com a empresa e com o órgão (SPC/Serasa). Cobrança indevida com negativação pode gerar dano moral." },
      { titulo: "Calcule o que pedir", detalhe: "Separe o que é prejuízo concreto (dano material) do abalo (dano moral). Isso orienta o valor e o caminho." },
      { titulo: "Ajuíze a ação", detalhe: "Causas menores cabem no Juizado Especial (até 20 salários mínimos sem advogado). As demais, na Justiça comum, com advogado." }
    ],
    prazos: [
      { prazo: "3 anos", descricao: "Prazo geral para pedir reparação civil (indenização por dano) — art. 206, § 3º, do Código Civil." },
      { prazo: "5 anos", descricao: "Prazo para cobrança de dívidas líquidas em documento (contratos, mensalidades) e tempo máximo de negativação no SPC/Serasa." },
      { prazo: "Após pagar", descricao: "Pagou uma dívida? Exija a quitação e o documento de baixa. Sem isso, a cobrança pode voltar." }
    ],
    documentos: [
      "Contrato ou prova do acordo",
      "Comprovantes de pagamento e extratos",
      "Cartas de cobrança e prints de negativação",
      "Boletim de ocorrência, fotos ou laudos (em caso de dano)",
      "Testemunhas, quando houver"
    ],
    custos: [
      "Juizado Especial até 20 salários mínimos: sem advogado e sem custas iniciais",
      "Justiça comum: custas variam por estado; cabe pedir gratuidade",
      "Honorários de advogado: combine valor fixo ou percentual antes"
    ],
    erros_comuns: [
      "Não guardar o comprovante de pagamento — depois não consegue provar que pagou",
      "Reconhecer ou pagar dívida já prescrita sem necessidade",
      "Deixar o prazo de indenização (3 anos) passar",
      "Aceitar o primeiro valor oferecido sem avaliar o prejuízo real"
    ],
    direitos_chave: [
      { titulo: "Negativação tem prazo", detalhe: "O nome não pode ficar negativado por mais de 5 anos, e a dívida prescrita não autoriza nova inscrição." },
      { titulo: "Dano moral", detalhe: "Cobrança indevida com negativação, exposição vexatória ou descumprimento grave podem gerar indenização por dano moral." },
      { titulo: "Revisão de contrato", detalhe: "Cláusulas abusivas ou desequilíbrio grave podem ser revistos em juízo, mesmo que o contrato tenha sido assinado." }
    ]
  },

  "direito-criminal": {
    como_funciona: [
      "O direito criminal aparece de dois lados na vida do cidadão comum: como vítima de um crime (furto, golpe, ameaça, agressão) ou como investigado/acusado. Em ambos, conhecer os próprios direitos evita decisões precipitadas que pioram a situação.",
      "Um princípio vale ouro: ninguém é obrigado a produzir prova contra si mesmo. Quem é chamado a depor, especialmente como suspeito, tem direito ao silêncio e à presença de advogado. E todo acusado é inocente até decisão final — a defesa é um direito, não um favor."
    ],
    passo_a_passo: [
      { titulo: "Se você é vítima", detalhe: "Registre o boletim de ocorrência (pode ser online em muitos estados) e guarde provas: prints, fotos, laudos, nomes de testemunhas." },
      { titulo: "Se você é investigado, fique calmo", detalhe: "Você tem direito de ficar em silêncio e de não assinar nada sem entender. Não tente 'se explicar' sozinho na delegacia." },
      { titulo: "Procure um advogado ou a Defensoria", detalhe: "Antes de qualquer depoimento como suspeito. A Defensoria Pública é gratuita para quem não pode pagar." },
      { titulo: "Acompanhe o inquérito e o processo", detalhe: "A defesa tem direito de ver as provas (vista dos autos) e de se manifestar em cada fase." },
      { titulo: "Avalie acordos com cautela", detalhe: "Existem acordos (como o de não persecução penal) que podem ser vantajosos, mas só com orientação jurídica." }
    ],
    prazos: [
      { prazo: "6 meses", descricao: "Prazo (decadência) para oferecer queixa-crime nos crimes de ação penal privada, contado de quando se sabe quem foi o autor." },
      { prazo: "Varia", descricao: "A prescrição (perda do direito de punir pelo tempo) depende da pena máxima do crime — pode ir de poucos anos a mais de 20." },
      { prazo: "Imediato", descricao: "Em flagrante, a comunicação à família e o acesso a advogado devem ser garantidos desde o início." }
    ],
    documentos: [
      "Boletim de ocorrência",
      "Provas do fato: prints, fotos, vídeos, laudos médicos",
      "Documentos pessoais",
      "Lista de testemunhas com contato",
      "Cópia do inquérito ou do processo, quando já existe"
    ],
    custos: [
      "Defensoria Pública: gratuita para quem comprova que não pode pagar advogado",
      "Advogado criminal particular: honorários combinados conforme a complexidade",
      "Boletim de ocorrência e atendimento na delegacia: gratuitos"
    ],
    erros_comuns: [
      "Prestar depoimento como suspeito sem advogado",
      "Assinar documentos na delegacia sem ler e entender",
      "Tentar 'resolver' conversando com a outra parte em crimes graves",
      "Achar que não comparecer faz o problema desaparecer"
    ],
    direitos_chave: [
      { titulo: "Direito ao silêncio", detalhe: "Você não é obrigado a responder o que possa te prejudicar, e o silêncio não pode ser usado contra você." },
      { titulo: "Presunção de inocência", detalhe: "Ninguém é culpado até a decisão final. A acusação é que tem de provar — não o acusado provar que é inocente." },
      { titulo: "Defesa garantida", detalhe: "Todo acusado tem direito a advogado (ou Defensoria) e a apresentar provas em sua defesa, em qualquer fase." }
    ]
  },

  "direito-imobiliario": {
    como_funciona: [
      "O direito imobiliário cuida de compra e venda de imóveis, aluguel, condomínio, despejo, financiamento e usucapião. É a área onde os valores são altos e um detalhe esquecido — como não conferir a matrícula — pode custar caro.",
      "A regra de ouro na compra é: o imóvel é de quem registra, não de quem só tem o contrato. Já na locação, a Lei do Inquilinato (Lei 8.245/91) equilibra os direitos de quem aluga e de quem mora, definindo prazos, garantias e as hipóteses de despejo."
    ],
    passo_a_passo: [
      { titulo: "Antes de comprar, investigue", detalhe: "Peça a matrícula atualizada do imóvel e certidões do vendedor. Confira se não há dívida, penhora ou disputa sobre o bem." },
      { titulo: "Formalize por escrito", detalhe: "Contrato claro com valor, forma de pagamento, prazos e responsabilidades. Fuja de 'contrato de gaveta' sem registro." },
      { titulo: "Pague o ITBI e faça a escritura", detalhe: "O ITBI é o imposto da transferência (em regra, 2% a 3% do valor). A escritura é feita em cartório de notas." },
      { titulo: "Registre na matrícula", detalhe: "Leve a escritura ao Cartório de Registro de Imóveis. Só com o registro o imóvel passa a ser legalmente seu." },
      { titulo: "Em locação, cuide do contrato e da garantia", detalhe: "Defina garantia (fiador, caução, seguro-fiança), prazo e regras de reajuste. Vistoria de entrada evita briga na saída." }
    ],
    prazos: [
      { prazo: "15 dias", descricao: "Prazo para o inquilino 'purgar a mora' (pagar o que deve) e evitar o despejo por falta de pagamento, quando cabível." },
      { prazo: "30 meses", descricao: "Contrato de locação residencial igual ou superior a 30 meses permite retomada ao fim do prazo sem precisar justificar." },
      { prazo: "5 a 15 anos", descricao: "Prazos de usucapião (aquisição pela posse) variam conforme o tipo e o tempo de moradia no imóvel." }
    ],
    documentos: [
      "Matrícula atualizada do imóvel (Cartório de Registro de Imóveis)",
      "Certidões negativas do vendedor e do imóvel",
      "Contrato de compra e venda ou de locação",
      "Comprovante de ITBI e escritura",
      "Vistoria de entrada e saída (locação)"
    ],
    custos: [
      "ITBI: em regra 2% a 3% do valor do imóvel (varia por município)",
      "Escritura e registro: tabela do cartório, conforme o valor",
      "Advogado: recomendável para revisar contratos de valor alto"
    ],
    erros_comuns: [
      "Comprar sem ler a matrícula e descobrir penhora ou dívida depois",
      "Confiar em 'contrato de gaveta' e não registrar o imóvel",
      "Alugar sem vistoria de entrada e brigar por danos na saída",
      "Ignorar o condomínio e as dívidas que acompanham o imóvel"
    ],
    direitos_chave: [
      { titulo: "Quem registra é o dono", detalhe: "Sem registro na matrícula, você tem só um direito contra o vendedor — não a propriedade perante todos." },
      { titulo: "Vícios de construção", detalhe: "Imóvel novo com defeito tem garantia legal; a construtora responde por problemas estruturais por prazo prolongado." },
      { titulo: "Preferência do inquilino", detalhe: "Se o imóvel alugado for vendido, o inquilino costuma ter direito de preferência na compra, nas mesmas condições." }
    ]
  },

  "direito-tributario": {
    como_funciona: [
      "O direito tributário trata dos impostos, taxas e contribuições — e do que fazer quando há cobrança indevida, valor pago a mais ou uma execução fiscal batendo à porta. Vale tanto para pessoas físicas quanto para empresas.",
      "Dois movimentos são comuns: pedir de volta o que foi pago indevidamente (restituição do indébito) e se defender de cobranças. Quem recebe uma execução fiscal não deve ignorar — há prazos curtos para se defender, e a inércia pode levar a penhora de bens."
    ],
    passo_a_passo: [
      { titulo: "Identifique o tributo e o valor", detalhe: "Veja exatamente qual imposto/taxa está sendo cobrado, a base de cálculo e o período. Erros de cálculo são frequentes." },
      { titulo: "Reúna guias e comprovantes", detalhe: "DARFs, carnês, notificações e comprovantes de pagamento. São a prova do que foi pago e do que está sendo cobrado." },
      { titulo: "Tente a via administrativa", detalhe: "Pedido de restituição, compensação ou impugnação junto ao próprio órgão (Receita, Secretaria de Fazenda, Prefeitura)." },
      { titulo: "Defenda-se na execução fiscal", detalhe: "Recebeu citação de execução fiscal? Há prazo para apresentar defesa (embargos) ou exceção de pré-executividade. Não deixe passar." },
      { titulo: "Avalie parcelamento", detalhe: "Quando a dívida é devida, parcelamentos e programas de regularização podem reduzir multas e juros." }
    ],
    prazos: [
      { prazo: "5 anos", descricao: "Prazo para pedir de volta tributo pago indevidamente (restituição do indébito)." },
      { prazo: "5 anos", descricao: "Prazo de prescrição para a Fazenda cobrar o tributo — passado isso, a execução pode ser extinta." },
      { prazo: "Após a citação", descricao: "Na execução fiscal, os prazos para garantir o juízo e apresentar defesa correm rápido — agir cedo é essencial." }
    ],
    documentos: [
      "Guias de pagamento (DARF, carnê, boleto)",
      "Notificações e autos de infração",
      "Comprovantes de pagamento",
      "Declarações (IR, ITR, etc.) relacionadas",
      "Citação e cópia da execução fiscal, se houver"
    ],
    custos: [
      "Defesa administrativa: em regra sem custas",
      "Ação judicial: custas conforme o valor; pode haver depósito ou garantia",
      "Advogado tributarista: honorários conforme a complexidade"
    ],
    erros_comuns: [
      "Ignorar a citação de execução fiscal e sofrer penhora",
      "Perder o prazo dos embargos à execução",
      "Não pedir restituição do que foi pago a mais dentro dos 5 anos",
      "Parcelar dívida indevida sem antes checar se ela é realmente devida"
    ],
    direitos_chave: [
      { titulo: "Restituição do indébito", detalhe: "Tributo pago a mais ou indevidamente pode ser restituído ou compensado, dentro do prazo de 5 anos." },
      { titulo: "Prescrição da cobrança", detalhe: "A Fazenda também tem prazo: cobrança antiga demais pode ser barrada pela prescrição." },
      { titulo: "Defesa sem garantir o juízo", detalhe: "A exceção de pré-executividade permite alegar certas matérias na execução fiscal sem precisar depositar o valor." }
    ]
  },

  "direito-empresarial": {
    como_funciona: [
      "O direito empresarial acompanha o negócio do começo ao fim: abertura da empresa, escolha do tipo societário, contratos, relação entre sócios, marcas, dívidas e, em situações difíceis, recuperação judicial ou falência. Vale para o MEI ao grande grupo.",
      "Boa parte dos problemas nasce de duas falhas simples: misturar o dinheiro da pessoa física com o da empresa e não ter um acordo claro entre os sócios. Resolver isso no começo evita brigas e protege o patrimônio pessoal."
    ],
    passo_a_passo: [
      { titulo: "Escolha o formato certo", detalhe: "MEI, empresário individual, sociedade limitada (LTDA), SLU... cada um tem limites de faturamento, custo e responsabilidade." },
      { titulo: "Faça um contrato social claro", detalhe: "Defina participação, divisão de lucros, entrada e saída de sócios e quem decide o quê. Evita o conflito mais comum." },
      { titulo: "Regularize CNPJ e licenças", detalhe: "Inscrição na Junta Comercial, CNPJ, alvarás e licenças do seu ramo. Apoio de um contador acelera o processo." },
      { titulo: "Organize contratos e cobranças", detalhe: "Padronize contratos com clientes e fornecedores e mantenha a cobrança documentada. Reduz inadimplência e litígio." },
      { titulo: "Em crise, avalie cedo as opções", detalhe: "Renegociação, recuperação extrajudicial ou judicial existem para preservar o negócio — quanto antes, melhor." }
    ],
    prazos: [
      { prazo: "Anual", descricao: "Obrigações periódicas (declarações, balanços, taxas) têm prazos próprios — o calendário fiscal não perdoa atraso." },
      { prazo: "Estatuto/contrato", descricao: "Saída de sócio, distribuição de lucros e deliberações seguem prazos definidos no contrato social." },
      { prazo: "5 anos", descricao: "Muitas cobranças entre empresas e a guarda de documentos seguem prazos de 5 anos — organize o arquivo." }
    ],
    documentos: [
      "Contrato social ou requerimento de empresário",
      "CNPJ e inscrições estadual/municipal",
      "Alvarás e licenças do ramo de atividade",
      "Acordo de sócios (quando houver)",
      "Contratos com clientes e fornecedores"
    ],
    custos: [
      "Junta Comercial e taxas de abertura: variam por estado",
      "Contador: mensalidade conforme o porte da empresa",
      "Advogado empresarial: para contratos e acordo de sócios"
    ],
    erros_comuns: [
      "Misturar conta e despesas da pessoa física com as da empresa",
      "Sociedade sem acordo escrito entre os sócios",
      "Deixar de regularizar licenças e tomar multa",
      "Adiar a renegociação de dívidas até a situação ficar insustentável"
    ],
    direitos_chave: [
      { titulo: "Separação do patrimônio", detalhe: "Em regra, a responsabilidade do sócio é limitada ao capital — mas isso cai por terra se houver fraude ou confusão patrimonial." },
      { titulo: "Acordo de sócios", detalhe: "Documento que previne brigas: define entrada, saída, sucessão e solução de impasses entre os donos." },
      { titulo: "Recuperação judicial", detalhe: "Empresa viável em dificuldade pode renegociar dívidas de forma organizada, mantendo a atividade e os empregos." }
    ]
  },

  "direito-digital": {
    como_funciona: [
      "O direito digital cuida das relações na internet: proteção de dados (LGPD), golpes virtuais, vazamento de informações, difamação e exposição não autorizada de imagens, além de marcas e conteúdo online. É uma área nova e em rápida evolução.",
      "Aqui, a prova é tudo — e ela some fácil. Antes de qualquer reação, preserve o que aconteceu: prints, links, datas. Em casos sérios, vale registrar uma ata notarial em cartório, que dá força à prova digital, e levar o caso à plataforma, à polícia e, quando envolve dados, à ANPD."
    ],
    passo_a_passo: [
      { titulo: "Preserve a prova imediatamente", detalhe: "Tire prints com data e URL visíveis, salve links e mensagens. Não apague nada — a prova digital desaparece rápido." },
      { titulo: "Considere uma ata notarial", detalhe: "Em casos graves (difamação, vazamento), o cartório pode registrar o conteúdo online em uma ata, dando-lhe força de prova." },
      { titulo: "Notifique a plataforma", detalhe: "Use os canais de denúncia da rede social ou do site para remover conteúdo ofensivo ou falso e pedir registros." },
      { titulo: "Registre boletim de ocorrência", detalhe: "Em golpes e crimes virtuais, o BO é importante. Muitos estados têm delegacia eletrônica especializada." },
      { titulo: "Acione a Justiça e, se for dados, a ANPD", detalhe: "Cabe ação para remover conteúdo e pedir indenização. Vazamento de dados também pode ser denunciado à Autoridade Nacional (ANPD)." }
    ],
    prazos: [
      { prazo: "Imediato", descricao: "Quanto antes você preservar prints e links, melhor — conteúdo online é apagado e fica difícil de recuperar." },
      { prazo: "3 anos", descricao: "Prazo geral para pedir indenização por dano (difamação, exposição, vazamento) — reparação civil." },
      { prazo: "Guarda de registros", descricao: "Provedores guardam registros de acesso por tempo definido em lei (Marco Civil) — pedir cedo evita perda." }
    ],
    documentos: [
      "Prints com data, hora e URL visíveis",
      "Ata notarial do conteúdo (cartório), em casos graves",
      "Boletim de ocorrência",
      "Comprovantes de transações (em golpes)",
      "Dados da conta/perfil envolvido"
    ],
    custos: [
      "Ata notarial: custas de cartório, conforme o número de páginas",
      "Boletim de ocorrência e denúncia à ANPD: gratuitos",
      "Ação judicial: custas conforme o valor; cabe pedir gratuidade"
    ],
    erros_comuns: [
      "Apagar conversas e prints 'de raiva' e perder a prova",
      "Demorar a agir e o conteúdo/registro sumir",
      "Responder à ofensa com outra ofensa (pode virar contra você)",
      "Não registrar boletim de ocorrência em golpes financeiros"
    ],
    direitos_chave: [
      { titulo: "Remoção de conteúdo", detalhe: "Conteúdo ofensivo, falso ou íntimo sem autorização pode ser removido por ordem judicial — e há regras especiais para imagens íntimas." },
      { titulo: "Direitos da LGPD", detalhe: "Você pode pedir a uma empresa acesso, correção e exclusão dos seus dados, e saber com quem foram compartilhados." },
      { titulo: "Indenização por vazamento", detalhe: "Vazamento ou uso indevido de dados pessoais pode gerar responsabilização da empresa e indenização." }
    ]
  }
};

export function getGuiaConteudo(slug: string): GuiaConteudo | undefined {
  return GUIA_CONTEUDO[slug];
}
