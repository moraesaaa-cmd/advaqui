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
