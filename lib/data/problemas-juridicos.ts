/**
 * Problemas jurídicos — páginas em linguagem leiga que respondem
 * dúvidas concretas do cidadão.
 *
 * Regras editoriais (F16):
 *  - Linguagem direta, sem juridiquês
 *  - Passos práticos antes de "procure um advogado"
 *  - Sem prometer resultado
 *  - Sem inventar números (prazos só genéricos)
 *  - Sempre lembrar que a situação concreta exige análise por profissional
 *  - Sem keyword stuffing
 *
 * Cada problema gera /problemas-juridicos/[slug] indexável.
 */

export type ProblemaJuridico = {
  slug: string;
  titulo: string;
  /** O que a pessoa busca, em poucas palavras (intro) */
  intencao_curta: string;
  /** Subtítulo da página */
  resumo: string;
  /** Áreas do direito (slugs de specialties) que tratam disso */
  areas: string[];
  /** Pergunta inicial — "O que aconteceu" */
  situacao: string[];
  /** Passos práticos imediatos (lista ordenada) */
  passos: Array<{ titulo: string; texto: string }>;
  /** Direitos básicos envolvidos */
  direitos: string[];
  /** Quando procurar advogado urgentemente */
  quando_urgente: string;
  /** Documentos e provas úteis */
  documentos?: string[];
  /** Glossário relacionado */
  termos_glossario?: string[];
  /** Tema de jurisprudência STJ */
  tema_jurisprudencia?: string;
  /** Modelos/checklists relacionados */
  modelos?: string[];
  /** FAQ */
  faq?: Array<{ q: string; a: string }>;
  atualizado_em: string;
};

export const PROBLEMAS: ProblemaJuridico[] = [
  {
    slug: "nome-negativado-indevidamente",
    titulo: "Meu nome foi negativado indevidamente. O que fazer?",
    intencao_curta: "Pessoa descobre o nome no SPC ou Serasa sem motivo, ou após pagar a dívida.",
    resumo:
      "Negativação indevida dá direito a baixa imediata e, em muitos casos, a indenização por dano moral. O caminho prático envolve provar o erro, exigir correção e, se necessário, ir à Justiça.",
    areas: ["consumidor", "civil"],
    situacao: [
      "Você foi negativado e não reconhece a dívida, já pagou a dívida e o nome continua sujo, ou está pagando uma cobrança que considera abusiva.",
      "O primeiro passo é confirmar a origem da negativação. SPC e Serasa permitem consultar gratuitamente, e o motivo costuma aparecer com o nome do credor e o valor.",
      "Quando a inscrição é realmente indevida — dívida quitada, dívida prescrita, erro de homônimo, fraude ou cobrança considerada abusiva — há direito à correção, e em vários cenários a indenização por dano moral é reconhecida pelos tribunais."
    ],
    passos: [
      {
        titulo: "Consulte e guarde as evidências",
        texto:
          "Acesse Serasa e SPC, confira a inscrição, salve a tela e baixe o relatório. Tudo é prova futura."
      },
      {
        titulo: "Cobre a baixa do credor",
        texto:
          "Envie reclamação ao credor pelo SAC ou e-mail oficial. Guarde protocolos. Se houver pagamento, anexe o comprovante."
      },
      {
        titulo: "Registre no Procon e no consumidor.gov.br",
        texto:
          "Ambos são gratuitos. Aumentam a pressão e geram registro oficial que serve como prova adicional."
      },
      {
        titulo: "Avalie ação judicial",
        texto:
          "Se a negativação persistir ou se houver dano moral evidente, vale conversar com advogado. Em muitos casos, o dano moral é presumido após inscrição indevida, conforme jurisprudência consolidada do STJ."
      }
    ],
    direitos: [
      "Baixa imediata do nome dos órgãos de proteção ao crédito quando a inscrição é indevida",
      "Indenização por dano moral, quando configurado o constrangimento (exceção da Súmula 385 do STJ — se já havia outras inscrições legítimas anteriores, não cabe dano moral, apenas a baixa)",
      "Eventual restituição em dobro de valores pagos indevidamente, em hipóteses do CDC"
    ],
    quando_urgente:
      "Se você está prestes a fazer uma compra de alto valor (financiamento, aluguel, contratação de serviço) ou se a inscrição indevida é recente, vale acionar advogado para pedir tutela de urgência — providência rápida que pode determinar a baixa em poucos dias.",
    documentos: [
      "Print ou relatório da negativação em SPC/Serasa",
      "Boletos, contratos ou faturas relacionados à dívida",
      "Comprovantes de pagamento (se a dívida já foi quitada)",
      "Histórico de reclamações registradas (Procon, consumidor.gov.br, SAC)",
      "Documento de identidade"
    ],
    termos_glossario: ["negativacao-indevida", "dano-moral", "responsabilidade-civil"],
    tema_jurisprudencia: "negativacao-indevida",
    modelos: ["notificacao-extrajudicial"],
    faq: [
      {
        q: "Quanto tempo até resolver?",
        a: "Depende do caminho. A reclamação direta ao credor pode resolver em poucos dias quando aceita. A via judicial costuma demorar mais, mas pedidos de tutela de urgência podem antecipar a baixa do nome antes do julgamento final."
      },
      {
        q: "Vale a pena entrar com ação?",
        a: "Quando há prova robusta da inscrição indevida e o dano se mantém apesar das tentativas extrajudiciais, normalmente vale. Cada caso tem peculiaridades — converse com um advogado da sua cidade antes de decidir."
      },
      {
        q: "Posso resolver sozinho?",
        a: "Para a parte extrajudicial (reclamação ao credor, Procon, consumidor.gov.br), sim. Para ação judicial é exigida assistência de advogado, exceto em juizados especiais cíveis até 20 salários mínimos."
      }
    ],
    atualizado_em: "2026-05-21"
  },
  {
    slug: "plano-de-saude-negou-cirurgia",
    titulo: "Meu plano de saúde negou cirurgia ou tratamento. O que fazer?",
    intencao_curta: "Cobertura recusada apesar de indicação médica.",
    resumo:
      "Negativa de cobertura por plano de saúde é uma das demandas mais comuns no Judiciário brasileiro. Em muitos casos a Justiça reverte a recusa, especialmente quando há prescrição do médico assistente.",
    areas: ["consumidor", "civil"],
    situacao: [
      "Você (ou alguém da família) tem indicação médica de cirurgia, exame, medicamento ou tratamento, e o plano negou — alegando carência, falta de previsão no rol da ANS, doença preexistente, ou exclusão contratual.",
      "Em situações de urgência ou de tratamento prescrito por médico, a jurisprudência costuma proteger o consumidor, especialmente após o STJ admitir o tratamento fora do rol em hipóteses específicas previstas em precedente recente.",
      "É um cenário em que a velocidade importa — quanto antes acionar, melhor."
    ],
    passos: [
      {
        titulo: "Peça a recusa por escrito",
        texto:
          "Solicite ao plano que envie por escrito o motivo da negativa, com base contratual ou regulamentar. Sem o documento formal, qualquer ação é mais lenta."
      },
      {
        titulo: "Junte a indicação médica",
        texto:
          "Pegue com o médico assistente um relatório detalhado explicando porque o tratamento é necessário e porque alternativas não atendem ao caso."
      },
      {
        titulo: "Reclame na ANS",
        texto:
          "A ANS atende reclamações pelo telefone 0800 7019656 e por canal online. O atendimento via NIP costuma resolver parte dos casos."
      },
      {
        titulo: "Avalie ação judicial com tutela de urgência",
        texto:
          "Se a urgência é clínica, advogado pode pedir liminar — decisão rápida do juiz para obrigar o plano a custear o tratamento, antes do julgamento final."
      }
    ],
    direitos: [
      "Cobertura prevista no rol da ANS, salvo exceções de carência regulares",
      "Em hipóteses específicas, cobertura de tratamento fora do rol, conforme jurisprudência recente do STJ",
      "Indenização por dano moral em casos de demora ou recusa abusiva",
      "Acesso à informação clara sobre a recusa"
    ],
    quando_urgente:
      "Sempre que houver risco à vida ou à integridade, ou perda de janela terapêutica (cirurgia agendada, tratamento que não pode esperar). Nesses casos, a tutela de urgência costuma ser deferida em poucos dias.",
    documentos: [
      "Carteirinha e contrato do plano",
      "Relatório do médico assistente",
      "Recusa formal do plano",
      "Exames e laudos",
      "Comprovantes de pagamento das mensalidades em dia"
    ],
    termos_glossario: ["plano-de-saude", "dano-moral", "responsabilidade-civil"],
    tema_jurisprudencia: "plano-de-saude",
    modelos: ["notificacao-extrajudicial"],
    faq: [
      {
        q: "O plano pode mesmo negar com base na ANS?",
        a: "Pode em hipóteses regulares de carência e exclusões previstas, mas a recusa não é absoluta — há jurisprudência sólida do STJ admitindo cobertura fora do rol em situações específicas, especialmente com prescrição médica fundamentada."
      },
      {
        q: "Posso ser ressarcido se já paguei o tratamento?",
        a: "Em muitos casos, sim. Se houve negativa indevida e você arcou do bolso, o plano pode ser condenado a reembolsar, e em alguns processos a indenização por dano moral também é reconhecida."
      },
      {
        q: "Liminar é garantida?",
        a: "Não é garantida — o juiz analisa a urgência e a verossimilhança do direito. Mas quando há documentação médica robusta indicando risco, é uma ferramenta poderosa."
      }
    ],
    atualizado_em: "2026-05-21"
  },
  {
    slug: "fui-demitido-sem-receber-direitos",
    titulo: "Fui demitido e não recebi meus direitos. O que fazer?",
    intencao_curta: "Trabalhador que saiu da empresa sem o pagamento correto das verbas rescisórias.",
    resumo:
      "Quando a empresa não paga as verbas devidas na rescisão, há direito a cobrar tudo — saldo de salário, férias, 13º proporcional, FGTS, multa e seguro-desemprego, conforme o tipo de demissão.",
    areas: ["trabalhista"],
    situacao: [
      "Você foi desligado da empresa, total ou parcialmente, e o pagamento das verbas rescisórias não veio, veio incompleto, ou houve alguma forma de pressão para você aceitar uma rescisão diferente da que tem direito.",
      "Há prazo legal para a empresa pagar — em regra, 10 dias da rescisão. O atraso gera multa, e o não pagamento dá direito a ação trabalhista para cobrar tudo, com correção monetária e juros."
    ],
    passos: [
      {
        titulo: "Reúna a documentação",
        texto:
          "Carteira de trabalho, contracheques, TRCT (Termo de Rescisão), extrato do FGTS e do PIS, contrato e qualquer comunicação sobre o desligamento."
      },
      {
        titulo: "Confira o que foi pago e o que falta",
        texto:
          "Compare TRCT com o salário real, dias trabalhados, férias vencidas, 13º e FGTS depositado. Erros aqui são comuns."
      },
      {
        titulo: "Tente acordo extrajudicial",
        texto:
          "Antes da ação, vale notificar a empresa formalmente cobrando o pagamento. Em muitos casos resolve sem processo."
      },
      {
        titulo: "Acione advogado trabalhista",
        texto:
          "Se persistir o problema, advogado trabalhista vai analisar o cabimento de ação, calcular as verbas devidas e propor a demanda no juízo competente."
      }
    ],
    direitos: [
      "Saldo de salário até a data da saída",
      "Aviso prévio (proporcional ou indenizado, conforme o caso)",
      "Férias vencidas e proporcionais + 1/3",
      "13º salário proporcional",
      "FGTS depositado + 40% de multa (em demissão sem justa causa)",
      "Seguro-desemprego (em demissão sem justa causa, se preencher requisitos)",
      "Correção e juros sobre valores em atraso"
    ],
    quando_urgente:
      "Quando a empresa estiver perto da quebra, com sinais de fechamento ou venda do patrimônio, vale acelerar a busca por advogado — em alguns casos é possível pedir bloqueio de bens preventivo.",
    documentos: [
      "Carteira de trabalho (CTPS)",
      "Contracheques dos últimos meses",
      "TRCT (Termo de Rescisão do Contrato de Trabalho)",
      "Extrato do FGTS",
      "Contrato de trabalho (se houver)",
      "Mensagens, e-mails ou áudios relacionados ao desligamento"
    ],
    termos_glossario: ["fgts", "rescisao", "horas-extras"],
    modelos: ["notificacao-extrajudicial"],
    faq: [
      {
        q: "Qual o prazo para entrar com ação?",
        a: "Há prazo prescricional próprio na Justiça do Trabalho. Para evitar problema, vale procurar advogado o quanto antes — esperar demais costuma reduzir o que pode ser cobrado."
      },
      {
        q: "E se eu tiver assinado documento aceitando menos?",
        a: "Assinatura sob pressão ou em troca da quitação de valores que já eram seus pode ser questionada. A análise é caso a caso e exige avaliação de advogado."
      }
    ],
    atualizado_em: "2026-05-21"
  },
  {
    slug: "beneficio-do-inss-foi-negado",
    titulo: "O INSS negou meu benefício. Como recorrer?",
    intencao_curta: "Aposentadoria, auxílio-doença ou outro benefício negado administrativamente.",
    resumo:
      "Negativas do INSS são frequentes e muitas vezes reversíveis. Há duas vias — recurso administrativo na própria autarquia e ação judicial. A escolha depende do tempo, do tipo de benefício e da prova disponível.",
    areas: ["previdenciario"],
    situacao: [
      "Você protocolou pedido de aposentadoria, auxílio-doença, pensão por morte ou outro benefício, e o INSS negou. A carta de comunicação geralmente vem com um código e uma justificativa breve.",
      "É comum a negativa decorrer de erro de cálculo de tempo de contribuição, exigência de documentos não apresentados, ou divergência sobre incapacidade nos casos de benefício por incapacidade."
    ],
    passos: [
      {
        titulo: "Leia com atenção a carta de indeferimento",
        texto:
          "A carta indica o motivo — falta de tempo, falta de carência, parecer médico contrário, etc. Esse motivo guia o que precisa ser reforçado."
      },
      {
        titulo: "Reúna documentos extras",
        texto:
          "Vínculos não computados, holerites antigos, declarações de testemunhas, laudos médicos detalhados. Quanto mais robusta a prova, melhor."
      },
      {
        titulo: "Avalie recurso administrativo",
        texto:
          "Há prazo para recorrer pelo Meu INSS. Em muitos casos resolve, especialmente quando o erro foi documental."
      },
      {
        titulo: "Ação judicial",
        texto:
          "Quando a negativa persiste, ou quando é caso clinicamente complexo, a Justiça Federal costuma reanalisar o pedido, inclusive com perícia médica oficial."
      }
    ],
    direitos: [
      "Recurso administrativo sem custo",
      "Acesso ao processo administrativo completo (PA)",
      "Direito à ação judicial gratuita quando o segurado se enquadra na justiça gratuita",
      "Perícia médica imparcial em ação judicial nos casos de incapacidade"
    ],
    quando_urgente:
      "Em situações de incapacidade grave, doenças listadas em lei como graves (câncer, cardiopatia grave, etc.) ou risco social evidente, vale acionar advogado rapidamente — há possibilidade de antecipação de tutela.",
    documentos: [
      "Carta de indeferimento do INSS",
      "Carteira de trabalho e CNIS",
      "Laudos médicos, exames e receituários",
      "Comprovantes de contribuição (carnês, holerites)",
      "Histórico de vínculos e declarações de empregadores"
    ],
    termos_glossario: ["aposentadoria", "auxilio-doenca"],
    modelos: ["notificacao-extrajudicial"],
    faq: [
      {
        q: "Posso entrar direto na Justiça sem recorrer ao INSS?",
        a: "Em geral, a Justiça Federal exige prévio requerimento administrativo. Se já houve negativa administrativa, o caminho judicial está aberto."
      },
      {
        q: "Quanto tempo demora?",
        a: "Recurso administrativo pode levar de poucos meses a mais de um ano. Ação judicial varia conforme a vara e o caso, e geralmente leva alguns meses para a perícia."
      }
    ],
    atualizado_em: "2026-05-21"
  },
  {
    slug: "quero-me-divorciar",
    titulo: "Quero me divorciar. Como funciona?",
    intencao_curta: "Pessoa quer dissolver o casamento, com ou sem acordo.",
    resumo:
      "Divórcio no Brasil é direito potestativo — basta a vontade. Quando há acordo, é simples e até cartorário. Sem acordo, vai para a Justiça. Em todos os casos, advogado é obrigatório.",
    areas: ["familia"],
    situacao: [
      "Você quer se divorciar e precisa saber por onde começar. Talvez o cônjuge concorde, talvez não. Há filhos, há bens, há pensão a ajustar.",
      "Desde 2010, não há mais exigência de separação prévia. O divórcio pode ser pedido a qualquer momento por qualquer dos cônjuges."
    ],
    passos: [
      {
        titulo: "Veja se há acordo possível",
        texto:
          "Conversar antes da via judicial é quase sempre melhor — menos custo, menos desgaste. Itens que precisam de acordo — partilha de bens, guarda e convivência dos filhos, pensão alimentícia."
      },
      {
        titulo: "Reúna documentos",
        texto:
          "Certidão de casamento, documentos pessoais, certidões dos filhos, comprovantes de bens (imóveis, veículos, contas), e documentação financeira de ambos."
      },
      {
        titulo: "Divórcio consensual em cartório",
        texto:
          "Se não há filhos menores ou incapazes e há acordo total, dá para fazer em cartório com escritura pública, presença de advogado e custas mais baixas."
      },
      {
        titulo: "Divórcio judicial",
        texto:
          "Quando há filhos menores ou não há consenso, é via Justiça. Pode iniciar como litigioso e virar acordo no curso do processo, com homologação rápida."
      }
    ],
    direitos: [
      "Divórcio independentemente de prazo de separação",
      "Partilha conforme o regime de bens do casamento",
      "Guarda compartilhada como regra, salvo exceção justificada",
      "Pensão alimentícia para filhos menores; eventualmente para ex-cônjuge em situações específicas",
      "Alteração de nome (manutenção ou retorno ao nome de solteiro)"
    ],
    quando_urgente:
      "Quando há risco de dilapidação de patrimônio comum, violência doméstica ou disputa imediata por guarda. Nesses casos, advogado pode pedir medidas urgentes além do divórcio em si.",
    documentos: [
      "Certidão de casamento (atualizada)",
      "RG e CPF dos cônjuges",
      "Certidão de nascimento dos filhos",
      "Documentos de bens (matrículas, registros de veículos, extratos)",
      "Comprovantes de renda e despesas"
    ],
    termos_glossario: ["divorcio", "guarda", "pensao-alimenticia"],
    modelos: ["procuracao-ad-judicia"],
    faq: [
      {
        q: "Preciso de advogado mesmo no consensual?",
        a: "Sim. Mesmo no cartório, a presença do advogado é exigida — cada cônjuge pode ter o seu, ou um único advogado pode representar ambos quando há acordo total."
      },
      {
        q: "Posso pedir o divórcio sem o outro concordar?",
        a: "Pode. Divórcio é direito unilateral. O outro cônjuge pode discutir partilha, guarda e pensão, mas não pode impedir a decretação do divórcio."
      },
      {
        q: "Quanto tempo demora?",
        a: "Consensual em cartório, dias a semanas. Judicial consensual, semanas a meses. Litigioso, varia conforme o nível de conflito e a vara."
      }
    ],
    atualizado_em: "2026-05-21"
  },
  {
    slug: "pai-nao-paga-pensao",
    titulo: "O pai (ou mãe) não paga pensão. O que pode ser feito?",
    intencao_curta: "Cobrança de pensão alimentícia em atraso ou nunca paga.",
    resumo:
      "Inadimplência de pensão alimentícia admite medidas drásticas — desconto em folha, bloqueio de bens, protesto, inscrição em órgãos de proteção ao crédito e até prisão civil em hipóteses persistentes.",
    areas: ["familia"],
    situacao: [
      "Há pensão fixada (por sentença ou acordo) e o devedor não paga, paga atrasado ou paga valores menores. A pessoa que recebe (em nome do filho, em regra) precisa de medidas efetivas, não só de tempo.",
      "A lei traz mecanismos fortes para esse caso justamente porque a pensão é essencial à subsistência."
    ],
    passos: [
      {
        titulo: "Confirme o valor atualizado",
        texto:
          "Calcule o quanto está em atraso, com correção e juros. Esse cálculo é base para qualquer ação."
      },
      {
        titulo: "Acione a Justiça com ação de execução",
        texto:
          "Existem dois ritos — rito da prisão (para dívida recente, em geral três últimos meses) e rito da expropriação (para dívidas mais antigas, com penhora de bens)."
      },
      {
        titulo: "Considere desconto em folha e protesto",
        texto:
          "Quando há vínculo formal de trabalho, o juiz pode determinar desconto direto na folha do devedor. Protesto e inscrição em SPC/Serasa também são possíveis."
      },
      {
        titulo: "Em casos persistentes, prisão civil",
        texto:
          "Para as três últimas parcelas, é possível pedir prisão civil do devedor — medida coercitiva (não punitiva) para forçar o pagamento. Em regra, o devedor é solto ao quitar."
      }
    ],
    direitos: [
      "Execução pelas vias adequadas",
      "Desconto em folha do salário do devedor",
      "Bloqueio judicial de contas, salários e bens",
      "Protesto do título e inscrição em órgãos de proteção ao crédito",
      "Prisão civil em hipóteses específicas (três últimas parcelas)"
    ],
    quando_urgente:
      "Sempre que há necessidade básica não atendida — alimentação, escola, saúde da criança. O quanto antes acionar advogado, melhor.",
    documentos: [
      "Sentença ou acordo que fixou a pensão",
      "Cálculo atualizado da dívida",
      "Comprovantes de pagamento parcial (se houver)",
      "Documentos do filho beneficiário",
      "Indícios sobre fonte de renda do devedor (vínculo, conta bancária, bens)"
    ],
    termos_glossario: ["pensao-alimenticia", "guarda"],
    tema_jurisprudencia: "pensao-alimenticia",
    modelos: ["procuracao-ad-judicia"],
    faq: [
      {
        q: "Quem paga as custas da execução?",
        a: "Em regra, o devedor. Há possibilidade de gratuidade da justiça para quem comprova baixa renda."
      },
      {
        q: "Posso parar de levar o filho para visitas se a pensão não é paga?",
        a: "Não. Pensão e convivência são obrigações independentes. Quem retém indevidamente o filho pode responder por descumprimento dos direitos da criança."
      }
    ],
    atualizado_em: "2026-05-21"
  },
  {
    slug: "perdi-um-familiar-e-preciso-fazer-inventario",
    titulo: "Perdi um familiar. Como funciona o inventário?",
    intencao_curta: "Família precisa transferir os bens deixados por quem faleceu.",
    resumo:
      "Inventário é o procedimento para identificar bens, dívidas e herdeiros e dividir o patrimônio. Pode ser feito em cartório (extrajudicial) ou na Justiça, conforme o caso.",
    areas: ["familia", "civil"],
    situacao: [
      "Alguém da família faleceu deixando bens. Vocês precisam transferir esses bens, pagar dívidas pendentes, e dividir conforme a lei ou eventual testamento.",
      "Em geral há prazo legal para abertura — 60 dias do óbito — sob risco de multa fiscal sobre o ITCMD. O atraso não impede, mas encarece."
    ],
    passos: [
      {
        titulo: "Reúna documentação",
        texto:
          "Certidão de óbito, certidões de casamento e nascimento dos herdeiros, documentos dos bens (matrículas, registros), extratos bancários, declaração de IR do falecido."
      },
      {
        titulo: "Verifique se há testamento",
        texto:
          "Cartório de Registros Civis e Central de Testamentos podem confirmar. Existindo testamento, em regra, o inventário é judicial."
      },
      {
        titulo: "Avalie via extrajudicial",
        texto:
          "Se todos os herdeiros são maiores, capazes e há acordo total, dá para fazer em cartório com escritura pública. Mais rápido e mais barato."
      },
      {
        titulo: "Via judicial",
        texto:
          "Necessária quando há menores, incapazes, testamento ou conflito entre herdeiros. Advogado é obrigatório nas duas vias."
      }
    ],
    direitos: [
      "Sucessão conforme regras do Código Civil",
      "Reserva de meação ao cônjuge quando aplicável",
      "Direitos de herdeiros necessários (descendentes, ascendentes, cônjuge)",
      "Possibilidade de cessão de direitos hereditários entre herdeiros"
    ],
    quando_urgente:
      "Quando há bens que precisam de manutenção (imóveis, empresas), dívidas que crescem ou cônjuge sobrevivente em situação financeira frágil, vale apressar o procedimento.",
    documentos: [
      "Certidão de óbito",
      "Documentos pessoais dos herdeiros",
      "Documentação dos bens (imóveis, veículos, ações, contas)",
      "Declaração de bens do falecido (IR)",
      "Eventual testamento"
    ],
    termos_glossario: ["inventario", "divorcio"],
    tema_jurisprudencia: "inventario",
    modelos: ["procuracao-ad-judicia"],
    faq: [
      {
        q: "Se ninguém abrir o inventário, o que acontece?",
        a: "Os bens ficam no nome do falecido. Não podem ser vendidos formalmente nem usados como garantia. Dívidas continuam, e o ITCMD vence com multa pelo atraso."
      },
      {
        q: "Posso usar a conta bancária do falecido?",
        a: "Em regra, não. As contas são bloqueadas até autorização judicial ou alvará. Pequenas quantias destinadas a despesas funerárias podem ser liberadas em situações específicas."
      }
    ],
    atualizado_em: "2026-05-21"
  },
  {
    slug: "fui-vitima-de-golpe-do-pix",
    titulo: "Caí em golpe do Pix. O que fazer agora?",
    intencao_curta: "Pessoa transferiu Pix indevido por fraude e quer reaver o valor.",
    resumo:
      "Em fraudes via Pix, o tempo é o fator mais crítico. Há mecanismos formais para tentar reaver o valor — o MED (Mecanismo Especial de Devolução) do Bacen — e responsabilização do banco em casos de falha de segurança.",
    areas: ["consumidor", "civil", "criminal"],
    situacao: [
      "Você fez um Pix por engano ou por golpe e quer recuperar o valor. O golpe pode ter sido por engenharia social, falso atendente do banco, falso boleto, sequestro de conta de WhatsApp ou outra modalidade.",
      "Existem dois caminhos paralelos — tentar a devolução pelo banco usando o MED, e registrar a ocorrência policial. Há ainda possibilidade de ação contra o banco em caso de falha grave de segurança."
    ],
    passos: [
      {
        titulo: "Contate o seu banco imediatamente",
        texto:
          "Solicite o MED — Mecanismo Especial de Devolução do Bacen — assim que perceber a fraude. O banco abre solicitação à instituição que recebeu o valor."
      },
      {
        titulo: "Registre boletim de ocorrência",
        texto:
          "Online ou em delegacia. O BO é peça essencial para o MED e para qualquer ação posterior."
      },
      {
        titulo: "Guarde tudo",
        texto:
          "Comprovantes da transferência, conversas, e-mails, telas, telefones. Cada detalhe ajuda na investigação e em eventual ação."
      },
      {
        titulo: "Avalie ação judicial",
        texto:
          "Quando há indício de falha do banco (autenticação fraca, golpe via canais bancários, falha no PIX) há jurisprudência favorável ao consumidor para reaver o valor."
      }
    ],
    direitos: [
      "Solicitação do MED — Bacen",
      "Boletim de ocorrência e investigação policial",
      "Direito à informação clara sobre o procedimento",
      "Eventual responsabilização do banco em caso de falha de segurança"
    ],
    quando_urgente:
      "Imediato. Cada hora reduz a chance de reaver o dinheiro porque o golpista costuma transferir os valores rapidamente para várias contas.",
    documentos: [
      "Comprovante de Pix",
      "Boletim de ocorrência",
      "Conversas e provas do golpe (prints, gravações)",
      "Documentos pessoais e contrato/extrato bancário",
      "Protocolos com o banco"
    ],
    termos_glossario: ["dano-moral", "responsabilidade-civil"],
    modelos: ["notificacao-extrajudicial"],
    faq: [
      {
        q: "Vou conseguir o dinheiro de volta?",
        a: "Depende da rapidez e da disponibilidade do valor na conta destino. Quando aplicado o MED em tempo hábil, há boa chance. Há jurisprudência favorável quando demonstrada falha do banco."
      },
      {
        q: "Posso processar o banco?",
        a: "Em casos de falha de segurança ou golpe via canais bancários (Pix fraudulento, autenticação fraca), sim — há precedentes condenando bancos a ressarcir o cliente."
      }
    ],
    atualizado_em: "2026-05-21"
  },
  {
    slug: "comprei-produto-com-defeito",
    titulo: "Comprei um produto com defeito. Quais são meus direitos?",
    intencao_curta: "Consumidor enfrentou produto com problema dentro ou fora da garantia.",
    resumo:
      "O Código de Defesa do Consumidor garante três opções em produto com vício — troca, restituição ou abatimento do preço — quando o problema não é resolvido em prazo razoável.",
    areas: ["consumidor"],
    situacao: [
      "Você comprou um produto e descobriu defeito — de fabricação, de funcionamento, ou que não corresponde ao anunciado. A loja ou fabricante demora a resolver, oferece reparo lento ou se nega.",
      "Há prazos de reclamação previstos no CDC — 30 dias para produto não durável, 90 dias para durável, contados da descoberta do vício."
    ],
    passos: [
      {
        titulo: "Registre a reclamação por escrito",
        texto:
          "Não basta ligar — formalize por e-mail, formulário do SAC ou plataforma oficial. Salve protocolos."
      },
      {
        titulo: "Aguarde o prazo legal",
        texto:
          "O fornecedor tem 30 dias para sanar o vício. Se não resolver, abre-se as três opções — troca, restituição ou abatimento."
      },
      {
        titulo: "Procon e consumidor.gov.br",
        texto:
          "Ambos são gratuitos e elevam a pressão. A maioria das empresas responde quando o caso chega lá."
      },
      {
        titulo: "Juizado Especial Cível",
        texto:
          "Para valores até 20 salários mínimos, o consumidor pode ir sem advogado. Acima disso ou em casos complexos, vale advogado."
      }
    ],
    direitos: [
      "Direito de escolha entre troca, restituição ou abatimento (vício não sanado em 30 dias)",
      "Inversão do ônus da prova nos casos previstos no CDC",
      "Restituição em dobro de valores pagos indevidamente",
      "Eventual indenização por dano moral conforme gravidade"
    ],
    quando_urgente:
      "Em produtos essenciais — geladeira que parou, carro recém-comprado parado, equipamento médico — vale acelerar a busca por advogado para pedido de tutela de urgência.",
    documentos: [
      "Nota fiscal",
      "Comprovante de comunicação do defeito ao fornecedor",
      "Protocolos do SAC",
      "Laudo técnico (se houver)",
      "Mensagens trocadas com a loja/fabricante"
    ],
    termos_glossario: ["dano-moral", "responsabilidade-civil"],
    modelos: ["notificacao-extrajudicial"],
    atualizado_em: "2026-05-21"
  },
  {
    slug: "fui-cobrado-juros-abusivos",
    titulo: "Estão me cobrando juros que considero abusivos. Tem como contestar?",
    intencao_curta: "Cliente questiona juros de financiamento, cartão ou empréstimo.",
    resumo:
      "Juros e tarifas podem ser revistos quando muito superiores à média de mercado, com base em jurisprudência consolidada e na análise do contrato. Existe espaço para repactuação ou ação judicial.",
    areas: ["consumidor", "civil"],
    situacao: [
      "Você assinou empréstimo, financiamento ou está pagando cartão e percebe que os juros e encargos parecem desproporcionais ao mercado. Talvez a dívida tenha multiplicado várias vezes, ou apareceram tarifas que não constavam no contrato.",
      "O Judiciário já reconheceu várias vezes a possibilidade de revisão, especialmente quando há descumprimento de regras do CDC, abuso de cobrança, ou taxas muito acima da média do Bacen."
    ],
    passos: [
      {
        titulo: "Peça contrato e extrato detalhado",
        texto:
          "Comece com pedido formal ao banco para o contrato e a evolução da dívida com discriminação dos encargos."
      },
      {
        titulo: "Compare com a média do Bacen",
        texto:
          "O Bacen publica taxas médias por tipo de operação. Diferenças muito grandes em relação à média são argumento jurídico."
      },
      {
        titulo: "Procon ou consumidor.gov.br",
        texto:
          "Antes da via judicial, vale tentar a renegociação por esses canais — boa parte das instituições aceita reduzir."
      },
      {
        titulo: "Ação revisional",
        texto:
          "Quando o caso permanece, advogado pode propor ação revisional, requerendo recalculo de juros, tarifas e capitalização."
      }
    ],
    direitos: [
      "Revisão de contratos com base no CDC e no Código Civil",
      "Restituição de cobranças indevidas",
      "Eventual restituição em dobro de tarifas declaradas abusivas",
      "Discussão sobre capitalização de juros e cumulação de encargos"
    ],
    quando_urgente:
      "Quando há iminência de protesto, busca e apreensão de bem garantido (veículo) ou risco de descontinuidade do contrato, vale acionar advogado para pedido de tutela.",
    documentos: [
      "Contrato",
      "Extrato com evolução da dívida",
      "Comprovantes de pagamento já realizado",
      "Tabelas do Bacen sobre taxas médias",
      "Histórico de tentativas de renegociação"
    ],
    termos_glossario: ["dano-moral", "responsabilidade-civil"],
    modelos: ["notificacao-extrajudicial"],
    atualizado_em: "2026-05-21"
  },
  {
    slug: "vizinho-fazendo-barulho",
    titulo: "Meu vizinho faz barulho excessivo. O que fazer?",
    intencao_curta: "Pessoa convive com barulho de vizinho e quer medidas legais.",
    resumo:
      "Há um direito de sossego protegido por lei. Os caminhos começam pela conversa e síndico, passam por Procon ou polícia em casos de perturbação, e podem chegar a ação judicial.",
    areas: ["civil", "consumidor"],
    situacao: [
      "Você convive com barulho excessivo de vizinhos — som alto fora do horário, obras intermináveis, latido contínuo, festas frequentes. As tentativas amigáveis ou pelo síndico não funcionaram.",
      "Perturbação do sossego pode configurar contravenção penal e, no condomínio, infração às normas internas com multa."
    ],
    passos: [
      {
        titulo: "Documente o barulho",
        texto:
          "Anote datas, horários, descrição. Gravações em vídeo com áudio são úteis. Registros em apps de medição de ruído acrescentam objetividade."
      },
      {
        titulo: "Acione o síndico ou administradora",
        texto:
          "Em apartamentos, é a via natural. Convenção e regulamento interno costumam prever advertências e multas progressivas."
      },
      {
        titulo: "Polícia (190 ou 153)",
        texto:
          "Em casos de barulho fora do horário e perturbação evidente, a polícia pode comparecer e lavrar ocorrência."
      },
      {
        titulo: "Ação judicial",
        texto:
          "Em casos crônicos, há ação cabível pedindo cessação da perturbação, multa diária e indenização. Casos extremos chegam a remoção compulsória."
      }
    ],
    direitos: [
      "Direito de sossego e de vida digna no imóvel",
      "Aplicação de convenção e regulamento de condomínio",
      "Ação inibitória com astreintes (multa diária)",
      "Eventual indenização por dano moral em casos persistentes e graves"
    ],
    quando_urgente:
      "Quando o barulho impede sono, prejudica saúde mental, ou se trata de risco (festa com aglomeração, briga, perigo), polícia imediato. Para o caso reincidente, advogado.",
    documentos: [
      "Anotações detalhadas dos episódios",
      "Vídeos e gravações com data",
      "Registros de reclamações ao síndico ou administradora",
      "Boletins de ocorrência",
      "Atestados médicos (se houver impacto na saúde)"
    ],
    termos_glossario: ["dano-moral", "responsabilidade-civil"],
    modelos: ["notificacao-extrajudicial"],
    atualizado_em: "2026-05-21"
  },
  {
    slug: "fui-demitido-por-justa-causa-injusta",
    titulo: "Fui demitido por justa causa que considero injusta. O que fazer?",
    intencao_curta: "Trabalhador discorda da justa causa aplicada pela empresa.",
    resumo:
      "Justa causa é a falta grave que rompe o contrato sem direito a aviso, multa e seguro-desemprego. Justa causa indevida pode ser revertida judicialmente, com pagamento de todas as verbas como demissão sem justa causa.",
    areas: ["trabalhista"],
    situacao: [
      "A empresa registrou justa causa no seu desligamento, com motivo que você considera inexistente, exagerado ou inventado. Você perdeu aviso, multa de 40% do FGTS e o seguro-desemprego.",
      "A jurisprudência exige que a empresa prove a justa causa — não basta acusar. Erros comuns são falta de imediatidade entre o fato e a demissão, ausência de advertências prévias e desproporção entre a falta e a pena."
    ],
    passos: [
      {
        titulo: "Reúna toda a documentação",
        texto:
          "Carta de demissão, comunicados anteriores, advertências, regulamento interno, contracheques, e a CTPS com a anotação."
      },
      {
        titulo: "Anote testemunhas",
        texto:
          "Colegas de trabalho que presenciaram os fatos podem ser ouvidos em audiência. Vale fazer lista de nomes."
      },
      {
        titulo: "Procure advogado trabalhista rapidamente",
        texto:
          "Quanto antes, melhor para preservar provas e testemunhas. Há prazo prescricional próprio."
      },
      {
        titulo: "Ação de reversão da justa causa",
        texto:
          "O juiz pode reverter para demissão sem justa causa, com pagamento de aviso, multa de 40% e correção do CNIS para o seguro-desemprego."
      }
    ],
    direitos: [
      "Inversão do ônus probatório, em muitos casos — cabe à empresa provar a justa causa",
      "Direito a todas as verbas como sem justa causa, se revertida",
      "Eventual indenização por dano moral em casos abusivos",
      "Possibilidade de reintegração em situações específicas"
    ],
    quando_urgente:
      "Quando a justa causa traz impactos graves além do salário — dificuldade para conseguir novo emprego, divulgação interna do motivo, exposição em redes — vale apressar.",
    documentos: [
      "Carta de demissão por justa causa",
      "Carteira de trabalho",
      "Contracheques",
      "Regulamento interno e e-mails",
      "Lista de testemunhas"
    ],
    termos_glossario: ["rescisao", "fgts"],
    modelos: ["procuracao-ad-judicia"],
    atualizado_em: "2026-05-21"
  },
  {
    slug: "vou-comprar-imovel-o-que-conferir",
    titulo: "Vou comprar imóvel. O que preciso conferir antes?",
    intencao_curta: "Comprador quer evitar dor de cabeça com documentação e dívidas ocultas.",
    resumo:
      "Compra de imóvel exige checagem cuidadosa de matrícula, certidões, débitos e ônus. Erros aqui custam caro — é situação em que advogado evita prejuízo maior que o próprio honorário.",
    areas: ["imobiliario", "civil"],
    situacao: [
      "Você está prestes a comprar um imóvel e quer entender o que olhar antes de fechar — riscos comuns são herdeiros não declarados, dívidas de IPTU, ações na Justiça envolvendo os vendedores, problemas de regularização e financiamentos vinculados.",
      "Nem todo problema aparece em consulta básica — alguns exigem certidões específicas de cartórios e tribunais."
    ],
    passos: [
      {
        titulo: "Peça a matrícula atualizada do imóvel",
        texto:
          "Cartório de Registro de Imóveis emite. Mostra histórico, ônus, hipotecas, restrições, e nome do atual proprietário."
      },
      {
        titulo: "Tire certidões dos vendedores",
        texto:
          "Civil, trabalhista, federal e estadual. Ações em curso ou execuções podem atingir o imóvel."
      },
      {
        titulo: "IPTU, condomínio e gás",
        texto:
          "Solicite certidões negativas. Dívidas continuam vinculadas ao imóvel em alguns casos."
      },
      {
        titulo: "Verifique regularização e habite-se",
        texto:
          "Em apartamentos ou casas novas, confira se o habite-se foi expedido e se há averbações pendentes."
      },
      {
        titulo: "Contrate advogado antes de assinar",
        texto:
          "Análise do contrato evita cláusulas armadilha — multas excessivas, condições para devolução de valores, prazos."
      }
    ],
    direitos: [
      "Direito à informação clara sobre o imóvel e condições da venda",
      "Direito de arrependimento em vendas fora do estabelecimento comercial (7 dias)",
      "Proteção do CDC quando a vendedora é incorporadora ou imobiliária profissional",
      "Garantia de habite-se e demais regularizações exigidas por lei"
    ],
    quando_urgente:
      "Sempre conferir antes do sinal. Após pagamento, recuperação é mais difícil e mais cara.",
    documentos: [
      "Matrícula atualizada do imóvel (até 30 dias)",
      "Certidões dos vendedores",
      "Certidões de débitos (IPTU, condomínio, gás)",
      "Habite-se e averbações",
      "Contrato de compra e venda detalhado"
    ],
    termos_glossario: ["usucapiao", "responsabilidade-civil"],
    tema_jurisprudencia: "usucapiao",
    modelos: ["notificacao-extrajudicial"],
    atualizado_em: "2026-05-21"
  },
  {
    slug: "fui-mordido-por-cachorro",
    titulo: "Fui mordido por cachorro. Tenho direito a indenização?",
    intencao_curta: "Vítima de mordedura quer ressarcir custos e dano sofrido.",
    resumo:
      "O dono do animal responde pelos danos causados, em regra independentemente de culpa (responsabilidade objetiva por guarda de animal). Cabe indenização por gastos médicos, dano estético e dano moral.",
    areas: ["civil", "consumidor"],
    situacao: [
      "Você foi atacado por um cachorro — em via pública, em condomínio ou em residência. Houve ferimento, gasto com tratamento, cicatriz ou trauma psicológico.",
      "O Código Civil estabelece que o dono ou detentor do animal responde pelos danos causados, mesmo que tenha tomado cuidado para evitar. As exceções são culpa exclusiva da vítima ou força maior, que precisam ser provadas pelo dono."
    ],
    passos: [
      {
        titulo: "Cuide da saúde imediatamente",
        texto:
          "Hospital, vacinas (raiva, tétano), sutura. Guarde laudos, receitas e gastos."
      },
      {
        titulo: "Identifique o animal e o dono",
        texto:
          "Nome, endereço, fotos do animal e do local. Testemunhas são úteis."
      },
      {
        titulo: "Boletim de ocorrência",
        texto:
          "Registra o fato oficialmente. Vale também para condomínio se for o caso."
      },
      {
        titulo: "Cobrança extrajudicial",
        texto:
          "Notificar o dono pedindo ressarcimento. Em casos com boa documentação, frequente o acordo extrajudicial."
      },
      {
        titulo: "Ação judicial",
        texto:
          "Quando não há acordo, há ação cabível pedindo danos materiais (gastos), eventual dano estético (cicatriz) e dano moral (sofrimento)."
      }
    ],
    direitos: [
      "Responsabilidade objetiva do dono pela guarda do animal",
      "Indenização por danos materiais (tratamento, terapia, medicamentos)",
      "Eventual dano estético (cicatrizes)",
      "Eventual dano moral (sofrimento, medo, sequelas psicológicas)"
    ],
    quando_urgente:
      "Atendimento médico é prioridade. Ação contra o dono não tem urgência tipicamente, mas vale agir antes da prescrição.",
    documentos: [
      "Laudos médicos e atestados",
      "Receituários e notas fiscais de medicamentos",
      "Boletim de ocorrência",
      "Fotos das lesões e do animal",
      "Testemunhas"
    ],
    termos_glossario: ["dano-moral", "responsabilidade-civil"],
    tema_jurisprudencia: "responsabilidade-civil",
    modelos: ["notificacao-extrajudicial"],
    atualizado_em: "2026-05-21"
  },
  {
    slug: "fui-vitima-de-erro-medico",
    titulo: "Acho que fui vítima de erro médico. Como prosseguir?",
    intencao_curta: "Paciente ou família suspeita de erro em diagnóstico ou cirurgia.",
    resumo:
      "Erro médico exige análise técnica criteriosa. Há diferenciação entre médico (responsabilidade subjetiva) e hospital (responsabilidade objetiva no CDC). O caminho começa pela documentação e perícia.",
    areas: ["consumidor", "civil"],
    situacao: [
      "Você ou um familiar acredita ter sofrido erro médico — diagnóstico tardio, cirurgia mal indicada, complicação evitável, medicação errada. Há sequela ou prejuízo evidente.",
      "A apuração exige análise técnica e prova robusta. Conselho regional de medicina (CRM), perícia judicial e laudos de outros especialistas costumam ser etapas necessárias."
    ],
    passos: [
      {
        titulo: "Reúna o prontuário completo",
        texto:
          "Você tem direito ao prontuário. Solicite ao hospital ou clínica por escrito — eles não podem se recusar a entregar."
      },
      {
        titulo: "Consulte outro especialista",
        texto:
          "Segunda opinião técnica é essencial para entender se houve, de fato, conduta divergente do padrão técnico."
      },
      {
        titulo: "Conselho Regional de Medicina",
        texto:
          "Você pode denunciar ao CRM para apuração ética. É via paralela à ação judicial."
      },
      {
        titulo: "Ação judicial com advogado especializado",
        texto:
          "A área exige conhecimento técnico e domínio das regras de responsabilidade civil médica. Hospital costuma responder objetivamente (CDC), médico tem responsabilidade subjetiva."
      }
    ],
    direitos: [
      "Direito ao prontuário médico completo",
      "Denúncia ao CRM",
      "Indenização por danos materiais (tratamentos adicionais)",
      "Indenização por dano moral e estético",
      "Pensão em caso de incapacidade permanente",
      "Em caso de óbito, pensão e indenização aos familiares"
    ],
    quando_urgente:
      "Quando há risco continuado de prejuízo ou necessidade de novo procedimento. Para a ação, vale lembrar dos prazos prescricionais.",
    documentos: [
      "Prontuário médico",
      "Laudos, exames e receitas",
      "Comprovantes de gastos com saúde",
      "Pareceres de outros especialistas",
      "Histórico de internações e cirurgias"
    ],
    termos_glossario: ["dano-moral", "responsabilidade-civil"],
    tema_jurisprudencia: "erro-medico",
    modelos: ["procuracao-ad-judicia"],
    atualizado_em: "2026-05-21"
  },
  {
    slug: "fui-acusado-de-crime-e-nao-cometi",
    titulo: "Fui acusado de crime que não cometi. O que fazer agora?",
    intencao_curta: "Pessoa investigada ou processada criminalmente busca orientação imediata.",
    resumo:
      "Em qualquer fase — investigação, inquérito ou ação penal — você tem direito a defesa. O mais importante é não falar nada sem advogado e preservar todas as provas a seu favor.",
    areas: ["criminal"],
    situacao: [
      "Você foi citado em investigação, intimado a depor, indiciado em inquérito ou já há processo criminal. Considera-se inocente do que está sendo apurado e quer entender como se defender.",
      "Defesa criminal começa antes da denúncia — em muitos casos, a atuação ainda no inquérito impede ou neutraliza a futura ação penal."
    ],
    passos: [
      {
        titulo: "Não fale sem advogado",
        texto:
          "Direito ao silêncio é constitucional. Qualquer depoimento sem advogado pode prejudicar a defesa. Educadamente, peça assistência antes de responder."
      },
      {
        titulo: "Procure advogado criminalista imediatamente",
        texto:
          "Atuação rápida pode mudar o rumo do caso — pedido de arquivamento, esclarecimento de fatos, acompanhamento de oitivas."
      },
      {
        titulo: "Reúna sua versão e provas",
        texto:
          "Documentos, testemunhas, gravações, dados de localização. Tudo que sustente sua versão deve ser entregue ao advogado."
      },
      {
        titulo: "Acompanhamento durante o processo",
        texto:
          "Defesa técnica em todas as fases — interrogatório, perícias, audiências, recursos."
      }
    ],
    direitos: [
      "Presunção de inocência até o trânsito em julgado",
      "Direito ao silêncio sem prejuízo da defesa",
      "Direito a advogado em todas as fases",
      "Acesso integral aos autos (Súmula Vinculante 14)",
      "Eventual pedido de habeas corpus em casos de constrangimento ilegal"
    ],
    quando_urgente:
      "Sempre que houver iminência de prisão, mandado de busca e apreensão ou intimação para depor. Quanto mais cedo a defesa entra, mais espaço técnico.",
    documentos: [
      "Eventual notificação, intimação ou citação",
      "Documentos pessoais",
      "Provas a seu favor (mensagens, recibos, fotos)",
      "Lista de testemunhas",
      "Histórico do caso conforme conhecimento próprio"
    ],
    termos_glossario: ["habeas-corpus", "recurso-especial"],
    modelos: ["procuracao-ad-judicia"],
    atualizado_em: "2026-05-21"
  },
  {
    slug: "preciso-cobrar-divida-de-cliente",
    titulo: "Preciso cobrar dívida de cliente que não pagou. Como?",
    intencao_curta: "Profissional ou empresário tenta receber valor devido por cliente.",
    resumo:
      "Cobrança começa pela negociação amigável e passa por notificação extrajudicial, protesto e ação judicial. Cada etapa filtra os casos e reduz o estoque de inadimplência.",
    areas: ["civil", "empresarial"],
    situacao: [
      "Um cliente comprou produto, contratou serviço, assinou contrato ou emitiu cheque sem fundos, e não paga. As cobranças informais não resolveram.",
      "Vias formais existem para diferentes situações — dívida com documento (contrato, nota promissória, cheque, duplicata) tem rito mais ágil que dívida apenas conversada."
    ],
    passos: [
      {
        titulo: "Tente conciliação prática",
        texto:
          "Mensagem clara propondo prazo e desconto. Em muitos casos resolve."
      },
      {
        titulo: "Notificação extrajudicial",
        texto:
          "Carta formal com prazo. Aumenta a pressão e prepara o protesto."
      },
      {
        titulo: "Protesto em cartório",
        texto:
          "Para títulos formais — duplicatas, cheques, contratos. Inscreve o devedor em órgãos de proteção ao crédito."
      },
      {
        titulo: "Ação de cobrança ou monitória",
        texto:
          "Conforme o título, advogado escolhe o rito. Quando há documento de dívida, a monitória é mais rápida."
      },
      {
        titulo: "Execução, se há título executivo",
        texto:
          "Cheque, nota promissória e contrato firmado por duas testemunhas são exemplos. Vai direto para penhora."
      }
    ],
    direitos: [
      "Correção monetária + juros sobre o valor em atraso",
      "Honorários advocatícios e custas pelo devedor (em geral)",
      "Penhora online de contas (Sisbajud), de veículos (Renajud) e de imóveis",
      "Inscrição em órgãos de proteção ao crédito"
    ],
    quando_urgente:
      "Quando há sinais de que o devedor está alienando bens ou se desfazendo do patrimônio, vale acionar advogado imediatamente para pedido de bloqueio.",
    documentos: [
      "Contrato",
      "Notas fiscais, duplicatas, cheques",
      "Histórico de comunicação",
      "Comprovantes de entrega do produto ou execução do serviço",
      "Dados do devedor (CPF, endereço, conta)"
    ],
    termos_glossario: ["dano-moral", "responsabilidade-civil"],
    modelos: ["notificacao-extrajudicial"],
    atualizado_em: "2026-05-21"
  },
  {
    slug: "fui-vitima-de-acidente-de-transito",
    titulo: "Sofri acidente de trânsito. Tenho direito a indenização?",
    intencao_curta: "Vítima de batida quer ressarcir danos materiais e morais.",
    resumo:
      "Há vários ângulos — DPVAT (seguro obrigatório), seguro próprio, indenização contra o causador, contra a seguradora, contra o município (em caso de falha em sinalização ou via).",
    areas: ["civil", "consumidor"],
    situacao: [
      "Você ou alguém da família sofreu acidente como motorista, passageiro, pedestre ou ciclista. Há danos materiais (veículo, salário perdido), corporais e/ou morais.",
      "O primeiro passo é coletar provas no local — fotos, testemunhas e boletim de ocorrência. Tudo isso impacta diretamente o sucesso de qualquer cobrança ou ação."
    ],
    passos: [
      {
        titulo: "Boletim de ocorrência e fotos",
        texto:
          "BO via online ou presencial. Fotos de tudo — veículos, lesões, semáforo, marcas no chão."
      },
      {
        titulo: "Atendimento médico",
        texto:
          "Mesmo em casos aparentemente leves. Lesões internas costumam aparecer depois e ter prova de causa fica difícil sem laudo inicial."
      },
      {
        titulo: "Cobertura do DPVAT",
        texto:
          "Pode haver direito a indenização do DPVAT para morte, invalidez ou despesas médicas, conforme as regras vigentes."
      },
      {
        titulo: "Cobrança contra o causador",
        texto:
          "Quando há culpa identificada, cabe ação por danos materiais e morais. Quando há seguradora, ela costuma ser acionada também."
      },
      {
        titulo: "Verifique falha estatal",
        texto:
          "Em acidentes ligados a falha na via (buraco, sinalização precária), o município pode ser corresponsável."
      }
    ],
    direitos: [
      "DPVAT conforme regras vigentes",
      "Indenização contra causador e/ou seguradora",
      "Reembolso de despesas médicas e de reparo do veículo",
      "Lucros cessantes (renda não auferida no período)",
      "Dano moral e estético quando houver"
    ],
    quando_urgente:
      "Saúde sempre vem primeiro. Para a cobrança, vale agir nos prazos prescricionais — quanto antes começar, mais fácil reunir provas e testemunhas.",
    documentos: [
      "Boletim de ocorrência",
      "Laudos médicos e exames",
      "Notas fiscais de reparos e tratamentos",
      "Fotos do local e dos veículos",
      "Documentos do veículo e seguro"
    ],
    termos_glossario: ["dano-moral", "responsabilidade-civil"],
    tema_jurisprudencia: "responsabilidade-civil",
    modelos: ["notificacao-extrajudicial"],
    atualizado_em: "2026-05-21"
  },
  {
    slug: "preciso-fazer-procuracao",
    titulo: "Preciso fazer procuração. Quais são as opções?",
    intencao_curta: "Pessoa precisa autorizar outra a representá-la em determinada situação.",
    resumo:
      "Procuração é o documento de outorga de poderes. Pode ser particular, pública, eletrônica, ad judicia (para advogado) e tem várias gradações de poderes.",
    areas: ["civil"],
    situacao: [
      "Você precisa que alguém te represente — para advogado em processo, para administrar imóvel à distância, para receber benefício de familiar idoso, para resolver assuntos no banco.",
      "A escolha do tipo de procuração depende do uso. Bancos e cartórios costumam exigir procuração pública. Atos com advogado, em regra, usam a ad judicia."
    ],
    passos: [
      {
        titulo: "Defina os poderes específicos",
        texto:
          "Quanto mais específicos, mais segurança. Procurações genéricas são desencorajadas para atos relevantes."
      },
      {
        titulo: "Escolha o tipo",
        texto:
          "Particular para situações simples; pública (em cartório) para atos com bens, financiamentos, vendas; ad judicia para advogado representar em processo."
      },
      {
        titulo: "Validade e revogação",
        texto:
          "Defina prazo. Procuração sem prazo dura até revogação expressa. Revogar é direito do outorgante, e deve ser comunicado a terceiros."
      },
      {
        titulo: "Documentos para o ato",
        texto:
          "Levar identificação do outorgante e do outorgado; para a pública, o cartório se encarrega da forma."
      }
    ],
    direitos: [
      "Liberdade de escolher quem te representa",
      "Revogação a qualquer tempo, salvo casos especiais",
      "Direito à informação sobre atos praticados pelo procurador",
      "Responsabilidade do procurador por excesso ou abuso"
    ],
    quando_urgente:
      "Quando há prazo iminente (audiência, fechamento de negócio, internação de familiar), vale agilizar com cartório de plantão ou advogado de plantão.",
    documentos: [
      "Documento de identidade do outorgante",
      "Dados completos do outorgado",
      "Descrição clara da finalidade",
      "Documentos do bem ou processo envolvido (quando aplicável)"
    ],
    termos_glossario: ["dano-moral", "responsabilidade-civil"],
    modelos: ["procuracao-ad-judicia"],
    atualizado_em: "2026-05-21"
  },
  {
    slug: "estou-sendo-cobrado-por-divida-prescrita",
    titulo: "Estou sendo cobrado por dívida muito antiga. Posso recusar?",
    intencao_curta: "Cobrança de dívida com idade superior ao prazo prescricional.",
    resumo:
      "Dívida prescrita não pode ser cobrada judicialmente, e em alguns casos não pode nem manter o nome do consumidor no SPC/Serasa. O caminho é identificar a data e o prazo aplicável.",
    areas: ["consumidor", "civil"],
    situacao: [
      "Aparece dívida antiga sendo cobrada por telefone, carta ou pelo SPC/Serasa. Você não tem certeza da origem, ou lembra mas o tempo passou.",
      "A prescrição não apaga a dívida — só extingue a pretensão de cobrar em juízo. Para inscrição em órgãos de proteção ao crédito, o limite costuma ser de cinco anos contado do vencimento."
    ],
    passos: [
      {
        titulo: "Confira a data de vencimento",
        texto:
          "Solicite ao credor o contrato ou histórico. A data exata define o prazo."
      },
      {
        titulo: "Identifique o prazo aplicável",
        texto:
          "Vai depender do tipo — dívida de cartão, financeira, consumo, etc. Tabela do Código Civil e do CDC tem regras diferentes."
      },
      {
        titulo: "Negue o pagamento sem confirmação",
        texto:
          "Não pague o que não tem certeza. Pagamento parcial pode reiniciar prazo."
      },
      {
        titulo: "Exija a baixa em SPC/Serasa",
        texto:
          "Se o registro ultrapassa o limite legal, há direito de exigir a remoção. Não havendo, advogado pode ingressar com ação."
      }
    ],
    direitos: [
      "Inexigibilidade judicial após a prescrição",
      "Direito à baixa em órgãos de proteção ao crédito após cinco anos do vencimento",
      "Eventual indenização por manutenção indevida do registro",
      "Direito à informação clara sobre origem e idade da dívida"
    ],
    quando_urgente:
      "Quando a inscrição em SPC/Serasa está bloqueando uma compra ou contratação importante, vale agir rápido pelos canais oficiais e advogado.",
    documentos: [
      "Comunicações de cobrança",
      "Eventual contrato (se conseguir resgatar)",
      "Comprovantes de pagamentos anteriores (se houve)",
      "Histórico em SPC/Serasa",
      "Tentativas de negociação registradas"
    ],
    termos_glossario: ["prescricao", "negativacao-indevida", "dano-moral"],
    modelos: ["notificacao-extrajudicial"],
    atualizado_em: "2026-05-21"
  },
  {
    slug: "fui-vitima-de-discriminacao-no-trabalho",
    titulo: "Fui vítima de discriminação ou assédio no trabalho. O que fazer?",
    intencao_curta: "Trabalhador enfrenta tratamento abusivo no emprego.",
    resumo:
      "Discriminação e assédio (moral ou sexual) são violações graves, com direitos específicos — indenização, eventual reintegração, responsabilização criminal em casos específicos.",
    areas: ["trabalhista", "criminal"],
    situacao: [
      "Você está sofrendo no trabalho — humilhações repetidas, exclusão sistemática, ofensas com base em raça, gênero, religião, orientação sexual, deficiência, idade ou outras condições; ou está sofrendo assédio sexual.",
      "Documentar é o passo mais importante. A jurisprudência exige que a vítima demonstre a recorrência (no assédio moral) ou os fatos específicos (no assédio sexual ou discriminação)."
    ],
    passos: [
      {
        titulo: "Documente cada episódio",
        texto:
          "Datas, locais, descrição, autores. Mensagens, e-mails, áudios — tudo o que ajude a comprovar."
      },
      {
        titulo: "Procure RH e/ou ouvidoria",
        texto:
          "Algumas empresas têm canais internos. Mesmo quando a empresa não responde, o registro é prova."
      },
      {
        titulo: "Acompanhamento médico/psicológico",
        texto:
          "Atestados são prova do dano à saúde. Em CAT (Comunicação de Acidente de Trabalho), também ficam registrados."
      },
      {
        titulo: "Sindicato e Ministério Público do Trabalho",
        texto:
          "Vias adicionais de denúncia. MPT atua especialmente em casos coletivos."
      },
      {
        titulo: "Ação trabalhista (e criminal, se cabível)",
        texto:
          "Indenização por dano moral, rescisão indireta (com verbas como sem justa causa), e em assédio sexual, eventual responsabilização criminal."
      }
    ],
    direitos: [
      "Indenização por dano moral",
      "Rescisão indireta (com verbas como sem justa causa)",
      "Eventual reintegração quando a saída foi forçada",
      "Apuração criminal em casos de assédio sexual",
      "Sigilo no processo em casos sensíveis"
    ],
    quando_urgente:
      "Quando a situação prejudica saúde física ou mental, e quando há ameaças. Em casos graves, vale acionar polícia além de procurar advogado.",
    documentos: [
      "Registros datados dos episódios",
      "Mensagens, e-mails, áudios, fotos",
      "Atestados e relatórios médicos",
      "Lista de testemunhas",
      "Comunicações com RH e ouvidoria"
    ],
    termos_glossario: ["dano-moral", "rescisao", "responsabilidade-civil"],
    modelos: ["procuracao-ad-judicia"],
    atualizado_em: "2026-05-21"
  },
  {
    slug: "empresa-nao-pagou-meu-salario",
    titulo: "A empresa não pagou meu salário. Quais são meus direitos?",
    intencao_curta: "Trabalhador ficou sem receber o salário do mês.",
    resumo:
      "O salário tem data certa para ser pago (até o 5º dia útil do mês seguinte). Atraso ou falta de pagamento é descumprimento do contrato e pode dar direito até à rescisão indireta, com as mesmas verbas de uma demissão sem justa causa.",
    areas: ["trabalhista"],
    situacao: [
      "Você trabalhou, mas o salário não caiu na data ou veio incompleto. Pode ser um mês isolado ou um atraso que vem se repetindo.",
      "O salário deve ser pago até o 5º dia útil do mês seguinte ao trabalhado. Atraso reiterado é falta grave do empregador."
    ],
    passos: [
      { titulo: "Reúna a prova do que é devido", texto: "Contracheques, registro de ponto, mensagens e o contrato. Some o que está em aberto." },
      { titulo: "Cobre formalmente", texto: "Registre a cobrança por escrito (e-mail, mensagem) e guarde a resposta. Isso documenta o atraso." },
      { titulo: "Avalie a rescisão indireta", texto: "Atraso reiterado permite pedir a saída na Justiça recebendo como demissão sem justa causa." },
      { titulo: "Procure a Justiça do Trabalho", texto: "É possível cobrar os valores atrasados dos últimos 5 anos, dentro de 2 anos após a saída." }
    ],
    direitos: [
      "Receber o salário em atraso com correção",
      "Rescisão indireta em caso de atraso reiterado",
      "Verbas rescisórias como em demissão sem justa causa",
      "Multa do art. 477 quando o acerto atrasa"
    ],
    quando_urgente:
      "Quando os atrasos se repetem ou comprometem seu sustento. Não convém demorar para registrar a cobrança e buscar orientação.",
    documentos: ["Contracheques", "Carteira de trabalho", "Registro de ponto", "Mensagens cobrando o pagamento"],
    termos_glossario: ["rescisao", "fgts"],
    modelos: ["notificacao-extrajudicial"],
    atualizado_em: "2026-05-30"
  },
  {
    slug: "trabalhei-sem-carteira-assinada",
    titulo: "Trabalhei sem carteira assinada. Como provar o vínculo?",
    intencao_curta: "Trabalhador prestou serviço sem registro e quer garantir direitos.",
    resumo:
      "Mesmo sem registro, se houver pessoalidade, habitualidade, subordinação e salário, existe vínculo de emprego. A Justiça reconhece o vínculo e garante carteira assinada com efeitos retroativos e todas as verbas.",
    areas: ["trabalhista"],
    situacao: [
      "Você trabalhou de forma contínua, cumprindo ordens e horários, mas a empresa nunca assinou sua carteira.",
      "A falta de registro não apaga os direitos. O que vale é a realidade: se era emprego, o vínculo pode ser reconhecido."
    ],
    passos: [
      { titulo: "Junte provas do trabalho", texto: "Mensagens, escala, fardamento, crachá, comprovantes de pagamento (Pix, depósito), fotos no local." },
      { titulo: "Liste testemunhas", texto: "Colegas e clientes que possam confirmar que você trabalhava ali com regularidade." },
      { titulo: "Calcule o período e as verbas", texto: "Tempo de casa, salário combinado e o que deixou de receber (férias, 13º, FGTS)." },
      { titulo: "Ajuíze o reconhecimento de vínculo", texto: "A Justiça do Trabalho pode determinar o registro e o pagamento de todas as verbas do período." }
    ],
    direitos: [
      "Reconhecimento do vínculo e registro retroativo",
      "Férias, 13º e FGTS do período trabalhado",
      "Recolhimento das contribuições ao INSS",
      "Verbas rescisórias se houve dispensa"
    ],
    quando_urgente:
      "Quando o trabalho terminou recentemente — há prazo de 2 anos para entrar com a ação. Provas também somem com o tempo.",
    documentos: ["Comprovantes de pagamento", "Mensagens e escalas", "Fotos no local de trabalho", "Lista de testemunhas"],
    termos_glossario: ["fgts", "rescisao"],
    atualizado_em: "2026-05-30"
  },
  {
    slug: "sofri-acidente-de-trabalho",
    titulo: "Sofri um acidente de trabalho. Tenho direito a indenização?",
    intencao_curta: "Trabalhador se acidentou no serviço ou no trajeto.",
    resumo:
      "Acidente de trabalho gera estabilidade no emprego por 12 meses após a alta, benefício do INSS e, quando há culpa da empresa, indenização. A emissão da CAT (Comunicação de Acidente de Trabalho) é essencial.",
    areas: ["trabalhista", "previdenciario"],
    situacao: [
      "Você se machucou durante o trabalho, no trajeto casa-trabalho ou desenvolveu uma doença ligada à atividade.",
      "Existem direitos previdenciários (benefício e estabilidade) e, quando a empresa falhou em segurança, direito a indenização."
    ],
    passos: [
      { titulo: "Garanta atendimento e a CAT", texto: "Busque atendimento médico e exija que a empresa emita a CAT. Se ela não emitir, você, o sindicato ou o médico podem emitir." },
      { titulo: "Guarde laudos e exames", texto: "Toda a documentação médica prova o acidente, o afastamento e as sequelas." },
      { titulo: "Acompanhe o benefício no INSS", texto: "O afastamento por mais de 15 dias gera benefício por incapacidade de natureza acidentária." },
      { titulo: "Avalie indenização", texto: "Se houve falha de segurança (EPI, treinamento), cabe ação por danos morais e materiais contra a empresa." }
    ],
    direitos: [
      "Estabilidade de 12 meses após a alta",
      "Benefício por incapacidade acidentário",
      "Indenização por dano moral e material quando há culpa",
      "Recolhimento do FGTS durante o afastamento"
    ],
    quando_urgente:
      "Imediatamente após o acidente — a CAT e o atendimento devem ser registrados logo. Procure orientação se a empresa se recusar a emitir a CAT.",
    documentos: ["CAT", "Laudos e exames médicos", "Comprovante do afastamento", "Provas das condições de trabalho"],
    termos_glossario: ["dano-moral", "responsabilidade-civil"],
    atualizado_em: "2026-05-30"
  },
  {
    slug: "fui-demitida-gravida",
    titulo: "Fui demitida grávida. A empresa pode fazer isso?",
    intencao_curta: "Gestante foi dispensada e quer saber sobre estabilidade.",
    resumo:
      "A gestante tem estabilidade desde a confirmação da gravidez até 5 meses após o parto. A dispensa sem justa causa nesse período é inválida — cabe reintegração ou indenização do período, mesmo que a empresa não soubesse da gravidez.",
    areas: ["trabalhista"],
    situacao: [
      "Você foi demitida sem justa causa e estava grávida na data da dispensa, mesmo que ainda não soubesse.",
      "A estabilidade da gestante é garantida pela Constituição e não depende de a empresa ter sido avisada."
    ],
    passos: [
      { titulo: "Comprove a gravidez na data da dispensa", texto: "Exame ou laudo que mostre que a concepção foi anterior à demissão." },
      { titulo: "Comunique a empresa", texto: "Informe formalmente e peça a reintegração. Guarde o protocolo da comunicação." },
      { titulo: "Decida entre voltar ou ser indenizada", texto: "Você pode pedir a reintegração ao emprego ou a indenização dos salários do período de estabilidade." },
      { titulo: "Procure a Justiça do Trabalho", texto: "Se a empresa não reintegrar nem indenizar, a ação garante o direito." }
    ],
    direitos: [
      "Estabilidade da confirmação da gravidez até 5 meses após o parto",
      "Reintegração ao emprego",
      "Indenização dos salários do período de estabilidade",
      "Recolhimento de FGTS e demais verbas do período"
    ],
    quando_urgente:
      "Logo após a dispensa — a reintegração é mais simples quanto antes. Há prazo de 2 anos para a ação.",
    documentos: ["Exame de gravidez", "Termo de rescisão", "Carteira de trabalho", "Comunicação enviada à empresa"],
    termos_glossario: ["rescisao", "fgts"],
    atualizado_em: "2026-05-30"
  },
  {
    slug: "inquilino-nao-paga-aluguel",
    titulo: "O inquilino não paga o aluguel. O que o proprietário pode fazer?",
    intencao_curta: "Proprietário enfrenta inadimplência do locatário.",
    resumo:
      "A Lei do Inquilinato permite cobrar os aluguéis atrasados e pedir o despejo por falta de pagamento. O inquilino pode evitar o despejo pagando o que deve (purgação da mora) dentro do prazo legal.",
    areas: ["imobiliario", "civil"],
    situacao: [
      "Seu inquilino parou de pagar o aluguel ou os encargos (condomínio, IPTU) e o acordo não está sendo cumprido.",
      "O proprietário pode cobrar a dívida e, se necessário, pedir a retomada do imóvel pela Justiça."
    ],
    passos: [
      { titulo: "Reúna o contrato e os comprovantes", texto: "Contrato de locação, recibos e o cálculo do que está em aberto, com encargos e multa." },
      { titulo: "Notifique o inquilino", texto: "Uma notificação extrajudicial cobrando a dívida abre prazo e registra a tentativa de acordo." },
      { titulo: "Ação de despejo por falta de pagamento", texto: "Permite retomar o imóvel e cobrar os valores. O inquilino pode purgar a mora dentro do prazo." },
      { titulo: "Execute a garantia", texto: "Fiador, caução ou seguro-fiança respondem pela dívida, conforme o contrato." }
    ],
    direitos: [
      "Receber os aluguéis e encargos atrasados, com multa",
      "Pedir o despejo por falta de pagamento",
      "Acionar fiador ou a garantia contratada",
      "Cobrar danos ao imóvel comprovados na vistoria"
    ],
    quando_urgente:
      "Quando o atraso se acumula. Quanto antes a cobrança formal e a ação, menor o prejuízo.",
    documentos: ["Contrato de locação", "Recibos e extrato da dívida", "Vistoria de entrada", "Dados do fiador ou da garantia"],
    termos_glossario: ["prescricao"],
    modelos: ["notificacao-extrajudicial", "contrato-de-locacao-residencial-simples"],
    atualizado_em: "2026-05-30"
  },
  {
    slug: "fui-despejado",
    titulo: "Recebi aviso de despejo. Quais são meus direitos como inquilino?",
    intencao_curta: "Inquilino foi notificado para desocupar o imóvel.",
    resumo:
      "Despejo segue regras da Lei do Inquilinato e, em geral, depende de ação judicial — ninguém pode ser tirado de casa por conta própria. Conforme o motivo, há prazos para sair e, na falta de pagamento, a chance de quitar a dívida e ficar.",
    areas: ["imobiliario"],
    situacao: [
      "Você recebeu um aviso para desocupar o imóvel — por falta de pagamento, fim do contrato ou pedido do proprietário.",
      "O despejo precisa respeitar a lei e prazos. Você tem o direito de saber o motivo e, em muitos casos, de regularizar a situação."
    ],
    passos: [
      { titulo: "Entenda o motivo", texto: "Falta de pagamento, fim do prazo, uso próprio do dono ou venda mudam seus direitos e prazos." },
      { titulo: "Verifique o contrato e os prazos", texto: "Confira a vigência, a garantia e o prazo de desocupação que a lei concede em cada caso." },
      { titulo: "Na falta de pagamento, avalie purgar a mora", texto: "Pagando o que deve dentro do prazo, é possível evitar o despejo." },
      { titulo: "Procure orientação antes de sair", texto: "Despejo sem ordem judicial é irregular. Um advogado verifica se o procedimento está correto." }
    ],
    direitos: [
      "Não ser retirado sem ordem judicial (salvo acordo)",
      "Prazo legal para desocupar conforme o motivo",
      "Purgar a mora e permanecer, na falta de pagamento",
      "Devolução da caução e benfeitorias, quando cabível"
    ],
    quando_urgente:
      "Assim que receber o aviso ou a citação — os prazos para responder e para purgar a mora são curtos.",
    documentos: ["Contrato de locação", "Comprovantes de pagamento do aluguel", "Aviso ou citação recebida", "Comprovante de caução"],
    termos_glossario: ["prescricao"],
    atualizado_em: "2026-05-30"
  },
  {
    slug: "voo-cancelado-ou-atrasado",
    titulo: "Meu voo foi cancelado ou atrasou muito. Tenho direito a indenização?",
    intencao_curta: "Passageiro teve voo cancelado, atrasado ou foi impedido de embarcar.",
    resumo:
      "Cancelamento, atraso longo e overbooking dão direito a assistência (comunicação, alimentação, hospedagem), reacomodação ou reembolso e, conforme o caso, indenização por danos morais e materiais. As regras da ANAC e o CDC protegem o passageiro.",
    areas: ["consumidor"],
    situacao: [
      "Seu voo foi cancelado, atrasou várias horas, ou você foi impedido de embarcar por excesso de passageiros (overbooking).",
      "A companhia tem deveres de assistência e de reacomodar ou reembolsar — e pode responder pelos prejuízos causados."
    ],
    passos: [
      { titulo: "Guarde tudo da viagem", texto: "Bilhete, cartão de embarque, comunicados da companhia, comprovantes de gastos extras (transporte, hotel, alimentação)." },
      { titulo: "Exija a assistência na hora", texto: "A partir de certo tempo de espera, a empresa deve oferecer comunicação, alimentação e, se for o caso, hospedagem." },
      { titulo: "Escolha reembolso ou reacomodação", texto: "Você decide entre ser remarcado, reacomodado em outro voo ou receber o valor de volta." },
      { titulo: "Reclame e, se preciso, acione a Justiça", texto: "Registre no consumidor.gov.br e na ANAC. No Juizado Especial é possível pedir indenização." }
    ],
    direitos: [
      "Assistência material durante a espera",
      "Reacomodação em outro voo ou reembolso integral",
      "Indenização por danos materiais comprovados",
      "Indenização por dano moral conforme o caso"
    ],
    quando_urgente:
      "Quando o prejuízo é grande (compromisso perdido, gastos altos) ou a companhia se recusa a dar assistência.",
    documentos: ["Bilhete e cartão de embarque", "Comunicados da companhia", "Comprovantes de gastos extras"],
    termos_glossario: ["dano-moral", "dano-material"],
    atualizado_em: "2026-05-30"
  },
  {
    slug: "compra-pela-internet-nao-chegou",
    titulo: "Comprei pela internet e o produto não chegou. O que fazer?",
    intencao_curta: "Consumidor pagou em loja online e não recebeu o produto.",
    resumo:
      "A loja é responsável pela entrega no prazo prometido. Atraso ou não entrega dá direito a exigir a entrega imediata, trocar o pedido ou receber o dinheiro de volta corrigido. Em compras pela internet também existe o direito de arrependimento em 7 dias.",
    areas: ["consumidor"],
    situacao: [
      "Você comprou em uma loja online, pagou, mas o produto não chegou no prazo — ou nunca chegou.",
      "A responsabilidade pela entrega é da loja, mesmo que o atraso seja dos Correios ou da transportadora contratada por ela."
    ],
    passos: [
      { titulo: "Junte as provas da compra", texto: "Pedido, comprovante de pagamento, prazo de entrega prometido e prints de conversas." },
      { titulo: "Cobre a loja por escrito", texto: "Use o SAC e guarde o protocolo. Dê um prazo e exija a entrega, a troca ou o reembolso." },
      { titulo: "Registre no consumidor.gov.br", texto: "Plataforma oficial e gratuita; as lojas costumam responder em poucos dias." },
      { titulo: "Juizado Especial se não resolver", texto: "Causas de até 20 salários mínimos podem ser ajuizadas sem advogado." }
    ],
    direitos: [
      "Entrega imediata, troca ou reembolso corrigido",
      "Direito de arrependimento em 7 dias na compra online",
      "Devolução em dobro de valor cobrado indevidamente",
      "Indenização por dano moral em casos de descaso"
    ],
    quando_urgente:
      "Quando o valor é alto, há suspeita de golpe ou a loja some. Aja rápido para preservar provas.",
    documentos: ["Pedido e comprovante de pagamento", "Prazo de entrega prometido", "Protocolos de atendimento"],
    termos_glossario: ["dano-moral"],
    modelos: ["notificacao-extrajudicial"],
    atualizado_em: "2026-05-30"
  },
  {
    slug: "auxilio-doenca-foi-negado",
    titulo: "O auxílio por incapacidade foi negado. Como recorrer?",
    intencao_curta: "Segurado teve o auxílio-doença indeferido pelo INSS.",
    resumo:
      "Negativa do auxílio por incapacidade (antigo auxílio-doença) costuma ocorrer por perícia desfavorável ou falta de documento. Cabe recurso administrativo em 30 dias e, se necessário, ação na Justiça Federal com laudos atualizados.",
    areas: ["previdenciario"],
    situacao: [
      "Você está incapaz de trabalhar por doença ou lesão, pediu o benefício e o INSS negou — em geral após a perícia.",
      "A negativa não é o fim: muitos casos são revertidos quando a documentação médica é bem apresentada."
    ],
    passos: [
      { titulo: "Pegue a carta de indeferimento", texto: "Pelo Meu INSS, baixe a decisão e veja o motivo exato da negativa." },
      { titulo: "Reúna laudos atualizados", texto: "Relatórios, exames e receitas que comprovem a incapacidade e o período." },
      { titulo: "Recorra em até 30 dias", texto: "O recurso ao Conselho de Recursos da Previdência não exige advogado e permite juntar novos documentos." },
      { titulo: "Avalie a ação judicial", texto: "Se o recurso falhar, a Justiça Federal pode conceder o benefício com perícia judicial." }
    ],
    direitos: [
      "Recurso administrativo gratuito em 30 dias",
      "Perícia judicial na ação, quando necessária",
      "Pagamento retroativo desde a data do direito",
      "Conversão em aposentadoria por incapacidade se for permanente"
    ],
    quando_urgente:
      "Quando você está sem renda e sem condições de trabalhar. O prazo de 30 dias para recorrer é curto.",
    documentos: ["Carta de indeferimento", "Laudos e exames médicos", "CNIS (histórico de contribuições)", "Comprovantes de contribuição"],
    termos_glossario: ["prescricao"],
    atualizado_em: "2026-05-30"
  },
  {
    slug: "como-pedir-aposentadoria",
    titulo: "Como pedir aposentadoria pelo INSS?",
    intencao_curta: "Segurado quer entender requisitos e como dar entrada na aposentadoria.",
    resumo:
      "A aposentadoria depende de idade e tempo de contribuição, conforme as regras atuais e de transição. Antes de pedir, vale conferir o CNIS, somar o tempo e simular — às vezes esperar ou acertar o histórico aumenta bastante o valor.",
    areas: ["previdenciario"],
    situacao: [
      "Você quer se aposentar e tem dúvida sobre os requisitos, o melhor momento e como dar entrada.",
      "Pedir cedo demais, com o CNIS errado, pode resultar em valor menor ou negativa. Planejar faz diferença."
    ],
    passos: [
      { titulo: "Confira seu CNIS", texto: "No Meu INSS, baixe o extrato e verifique se todos os vínculos e contribuições estão corretos." },
      { titulo: "Some idade e tempo de contribuição", texto: "Compare com as regras de transição para ver em qual você se encaixa e quando completa os requisitos." },
      { titulo: "Reúna documentos que faltam", texto: "Carteiras antigas, carnês e comprovantes de períodos não registrados no CNIS." },
      { titulo: "Dê entrada e acompanhe", texto: "O pedido é feito pelo Meu INSS. Negado ou com valor baixo, cabe recurso ou revisão." }
    ],
    direitos: [
      "Aposentadoria ao cumprir os requisitos da sua regra",
      "Contagem de tempo de períodos não registrados, com prova",
      "Revisão do benefício concedido com erro",
      "Pagamento retroativo conforme o caso"
    ],
    quando_urgente:
      "Quando há dúvida sobre a melhor regra ou valor — um erro no momento de pedir pode custar caro a vida toda.",
    documentos: ["CNIS", "Carteiras de trabalho", "Carnês e comprovantes de contribuição", "Documentos de tempo especial ou rural, se houver"],
    termos_glossario: ["prescricao"],
    atualizado_em: "2026-05-30"
  },
  {
    slug: "sofri-assedio-moral-no-trabalho",
    titulo: "Sofri assédio moral no trabalho. O que fazer?",
    intencao_curta:
      "Humilhações repetidas, perseguição ou exposição do trabalhador pelo chefe ou colegas.",
    resumo:
      "Assédio moral é a exposição do trabalhador a situações humilhantes e repetitivas. Reunir provas e registrar os fatos é o primeiro passo — em muitos casos cabe indenização e até rescisão indireta.",
    areas: ["trabalhista"],
    situacao: [
      "Assédio moral costuma aparecer como humilhações na frente de colegas, metas impossíveis usadas como punição, isolamento proposital, gritos, ameaças veladas ou cobranças que ultrapassam o razoável — sempre de forma repetida.",
      "Um episódio isolado e pontual normalmente não configura assédio; o que caracteriza é a conduta abusiva que se repete ao longo do tempo e afeta a dignidade e a saúde de quem trabalha.",
      "Guardar provas e relatos com datas é decisivo, porque o assédio costuma acontecer sem testemunhas dispostas a falar."
    ],
    passos: [
      { titulo: "Registre tudo com data", texto: "Anote os episódios (o que foi dito, quando, quem presenciou). Guarde mensagens, e-mails, prints e áudios que mostrem a conduta." },
      { titulo: "Procure apoio e testemunhas", texto: "Converse com colegas que presenciaram, com o RH ou com o sindicato da categoria. Formalize por escrito sempre que possível." },
      { titulo: "Cuide da sua saúde", texto: "Se houve adoecimento (ansiedade, depressão), busque atendimento médico. O atestado e o laudo são provas importantes do dano." },
      { titulo: "Avalie com um advogado", texto: "Dependendo da gravidade, cabe ação por dano moral e até rescisão indireta — quando você sai por culpa do empregador, com direito às verbas como se fosse demitido sem justa causa." }
    ],
    direitos: [
      "Ambiente de trabalho saudável e respeito à dignidade do trabalhador",
      "Indenização por dano moral quando o assédio é comprovado",
      "Rescisão indireta nos casos graves, com direito às verbas rescisórias",
      "Benefício previdenciário se houver afastamento por doença ocupacional reconhecida"
    ],
    quando_urgente:
      "Se o assédio está afetando sua saúde, se há ameaça de demissão por retaliação ou se você pensa em pedir as contas, fale com um advogado antes de decidir — a forma de sair muda os seus direitos.",
    documentos: [
      "Mensagens, e-mails e prints com as condutas",
      "Relato dos episódios com datas e nomes de testemunhas",
      "Atestados e laudos médicos, se houve adoecimento",
      "Carteira de trabalho e contracheques",
      "Registro feito no RH ou no sindicato, se houver"
    ],
    termos_glossario: ["dano-moral"],
    atualizado_em: "2026-05-30"
  },
  {
    slug: "nao-recebi-horas-extras",
    titulo: "Faço horas extras e não recebo. O que fazer?",
    intencao_curta:
      "Empregado trabalha além da jornada sem o pagamento das extras ou sem o adicional correto.",
    resumo:
      "Hora trabalhada além da jornada deve ser paga com adicional. Mesmo sem registro de ponto é possível provar e cobrar — inclusive os reflexos em férias, 13º e FGTS.",
    areas: ["trabalhista"],
    situacao: [
      "A jornada padrão costuma ser de 8 horas por dia e 44 por semana; o que passa disso é hora extra e tem adicional sobre a hora normal, maior ainda em domingos e feriados.",
      "É comum o empregador não registrar o ponto corretamente, pedir que o funcionário continue após bater o ponto, ou usar banco de horas de forma irregular.",
      "A falta de controle de ponto não tira o direito: quando a empresa tem muitos empregados e não apresenta os registros, a Justiça pode presumir verdadeira a jornada alegada pelo trabalhador."
    ],
    passos: [
      { titulo: "Reúna provas da jornada", texto: "Guarde prints de ponto, mensagens fora do horário, escalas, fotos e e-mails. Colegas como testemunhas também ajudam." },
      { titulo: "Estime por alto o que é devido", texto: "Some as horas extras habituais e os reflexos em férias, 13º, descanso semanal e FGTS. Um advogado faz a conta exata." },
      { titulo: "Cobre a empresa formalmente", texto: "Às vezes a empresa regulariza ao ser cobrada por escrito. Guarde os protocolos." },
      { titulo: "Avalie a ação trabalhista", texto: "As verbas dos últimos anos podem ser cobradas, mas há prazo (em regra até 2 anos após sair, alcançando os 5 anos anteriores). Não deixe prescrever." }
    ],
    direitos: [
      "Pagamento das horas extras com o adicional legal",
      "Adicional maior em domingos e feriados, quando for o caso",
      "Reflexos das horas extras habituais em férias, 13º, descanso semanal e FGTS",
      "Direito de cobrar mesmo sem cartão de ponto, por outros meios de prova"
    ],
    quando_urgente:
      "Se você já saiu da empresa, atenção ao prazo: em regra há até 2 anos para entrar com a ação. Quanto antes procurar orientação, mais período consegue cobrar.",
    documentos: [
      "Cartões de ponto, escalas e espelhos de jornada",
      "Mensagens e e-mails enviados fora do horário",
      "Contracheques e carteira de trabalho",
      "Nomes de colegas que possam testemunhar"
    ],
    atualizado_em: "2026-05-30"
  },
  {
    slug: "quero-pedir-rescisao-indireta",
    titulo: "O patrão não cumpre as regras. Posso pedir rescisão indireta?",
    intencao_curta:
      "Trabalhador quer sair com os direitos de demitido por causa de falta grave do empregador.",
    resumo:
      "Rescisão indireta é a justa causa do empregador: quando a empresa comete falta grave, o trabalhador pode sair e receber as mesmas verbas de uma demissão sem justa causa.",
    areas: ["trabalhista"],
    situacao: [
      "A rescisão indireta cabe quando o empregador descumpre o contrato de forma grave — atraso reiterado de salário, falta de depósito do FGTS, assédio, exigência de tarefas humilhantes ou risco à saúde sem proteção.",
      "É o contrário da justa causa: a falta é da empresa, e por isso o trabalhador sai com aviso, 13º e férias proporcionais, multa de 40% do FGTS, saque do fundo e seguro-desemprego.",
      "É uma decisão delicada: enquanto a Justiça não reconhece, o vínculo continua. Por isso convém avaliar as provas antes de simplesmente parar de comparecer."
    ],
    passos: [
      { titulo: "Documente a falta da empresa", texto: "Reúna o extrato do FGTS sem depósitos, comprovantes de salário atrasado, mensagens e laudos. É a base do pedido." },
      { titulo: "Não abandone o emprego sem orientação", texto: "Abandonar pode virar justa causa contra você. O ideal é avaliar com advogado se já cabe o pedido e como formalizar." },
      { titulo: "Decida se continua trabalhando", texto: "Em alguns casos dá para pedir e parar de comparecer; em outros, seguir até a decisão. Cada cenário tem risco — analise antes." },
      { titulo: "Ajuíze a ação", texto: "A rescisão indireta é reconhecida pela Justiça do Trabalho. Com prova boa, costuma equiparar à demissão sem justa causa." }
    ],
    direitos: [
      "Verbas iguais às da demissão sem justa causa (aviso, 13º e férias proporcionais, multa de 40% do FGTS)",
      "Saque do FGTS e habilitação ao seguro-desemprego",
      "Indenização adicional se houver dano moral envolvido"
    ],
    quando_urgente:
      "Se a empresa parou de pagar salário ou de recolher o FGTS, aja rápido — quanto mais tempo passa, maior o prejuízo. Um advogado dirá se já é hora de pedir a rescisão indireta.",
    documentos: [
      "Extrato do FGTS mostrando a falta de depósitos",
      "Contracheques e comprovantes de atraso de salário",
      "Carteira de trabalho",
      "Mensagens e provas da falta grave da empresa"
    ],
    atualizado_em: "2026-05-30"
  },
  {
    slug: "quero-revisar-o-valor-da-pensao",
    titulo: "A pensão ficou alta ou baixa demais. Posso revisar o valor?",
    intencao_curta:
      "Quem paga ou quem recebe pensão quer aumentar ou reduzir o valor por mudança na situação.",
    resumo:
      "O valor da pensão alimentícia pode ser revisto quando muda a necessidade de quem recebe ou a possibilidade de quem paga. A revisão é feita por acordo ou por ação judicial.",
    areas: ["familia"],
    situacao: [
      "A pensão é fixada conforme dois fatores que se equilibram: a necessidade de quem recebe e a possibilidade de quem paga. Quando algum deles muda de forma relevante, o valor pode ser revisto.",
      "Quem paga pode pedir redução se perdeu o emprego, teve outro filho ou a renda caiu. Quem recebe pode pedir aumento se as despesas cresceram (escola, saúde) ou se a renda de quem paga subiu.",
      "Enquanto não houver decisão nova, o valor antigo continua valendo — parar de pagar por conta própria pode gerar dívida e até prisão civil."
    ],
    passos: [
      { titulo: "Junte a prova da mudança", texto: "Comprove o que mudou: rescisão, novos contracheques, novos gastos, nascimento de outro filho, despesas médicas." },
      { titulo: "Tente acordo primeiro", texto: "Muitas revisões se resolvem por acordo, homologado em cartório (com advogado) ou na Justiça. É mais rápido e barato." },
      { titulo: "Continue pagando o valor atual", texto: "Até a revisão sair, mantenha o pagamento combinado para não acumular dívida nem risco de prisão." },
      { titulo: "Ajuíze a ação revisional", texto: "Sem acordo, entra-se com ação de revisão de alimentos. O juiz reavalia necessidade e possibilidade com base nas provas." }
    ],
    direitos: [
      "Revisão do valor quando há mudança comprovada na necessidade ou na possibilidade",
      "Acordo extrajudicial em cartório quando as partes concordam e há advogado",
      "Manutenção do valor anterior até a decisão sobre o novo"
    ],
    quando_urgente:
      "Se você perdeu a renda e não consegue pagar, procure orientação antes de atrasar — o atraso pode levar a protesto e prisão civil. A revisão deve ser pedida o quanto antes.",
    documentos: [
      "Acordo ou decisão que fixou a pensão",
      "Comprovantes da mudança de renda (rescisão, novos contracheques)",
      "Comprovantes de despesas (escola, saúde)",
      "Documentos dos filhos"
    ],
    atualizado_em: "2026-05-30"
  },
  {
    slug: "quero-a-guarda-do-meu-filho",
    titulo: "Quero a guarda do meu filho. Como funciona?",
    intencao_curta:
      "Pai ou mãe quer definir ou mudar a guarda e a convivência com a criança.",
    resumo:
      "A guarda define com quem a criança mora e como é a convivência. A regra geral hoje é a guarda compartilhada, em que as decisões são divididas entre os pais — sempre no interesse da criança.",
    areas: ["familia"],
    situacao: [
      "Guarda não é posse do filho: é a responsabilidade de cuidar e decidir. A lei prioriza a guarda compartilhada, em que pai e mãe dividem as decisões importantes, mesmo morando em casas diferentes.",
      "A guarda unilateral (só com um dos pais) é exceção, usada quando o outro não tem condições ou não quer exercer. Mesmo assim, o outro mantém o direito de convivência e de fiscalizar.",
      "O que orienta toda decisão é o melhor interesse da criança ou do adolescente — não a vitória de um dos pais."
    ],
    passos: [
      { titulo: "Tente o acordo de guarda e convivência", texto: "O melhor caminho é definir em acordo a moradia, a rotina de convivência e a divisão de decisões. Pode ser homologado na Justiça." },
      { titulo: "Organize as informações da rotina", texto: "Escola, saúde, quem cuida no dia a dia, rede de apoio. Isso ajuda a desenhar o arranjo que funciona para a criança." },
      { titulo: "Considere a mediação familiar", texto: "A mediação ajuda os pais a chegarem a um acordo com menos desgaste, preservando a criança do conflito." },
      { titulo: "Ajuíze a ação se não houver acordo", texto: "Sem consenso, o juiz decide ouvindo as partes e, às vezes, equipe técnica. Um advogado conduz o processo." }
    ],
    direitos: [
      "Convivência com os dois pais, salvo risco à criança",
      "Guarda compartilhada como regra, com decisões divididas",
      "Direito de fiscalizar a criação mesmo sem a guarda unilateral",
      "Prioridade absoluta ao interesse da criança e do adolescente"
    ],
    quando_urgente:
      "Se há risco à criança (violência, negligência, ameaça de levar para outra cidade ou país sem combinar), procure um advogado imediatamente — cabe pedido urgente ao juiz.",
    documentos: [
      "Certidão de nascimento da criança",
      "Comprovantes da rotina (escola, médico)",
      "Documentos dos pais",
      "Provas de eventual risco, se houver"
    ],
    atualizado_em: "2026-05-30"
  },
  {
    slug: "preciso-fazer-inventario-e-partilha",
    titulo: "Um familiar faleceu. Como fazer o inventário e a partilha?",
    intencao_curta:
      "Herdeiros precisam regularizar e dividir os bens deixados por quem faleceu.",
    resumo:
      "Inventário é o procedimento para apurar e partilhar os bens de quem faleceu. Pode ser feito em cartório, quando todos concordam e são maiores, ou na Justiça nos demais casos.",
    areas: ["familia", "civil"],
    situacao: [
      "Quando alguém falece, os bens (imóveis, contas, veículos) não podem simplesmente ser usados ou vendidos pelos herdeiros: é preciso o inventário para transferir tudo legalmente.",
      "Se todos os herdeiros são maiores, capazes e estão de acordo, e não há testamento que exija o juiz, o inventário pode ser feito em cartório (extrajudicial), de forma mais rápida.",
      "Havendo herdeiro menor, incapaz, testamento ou conflito, o inventário corre na Justiça. Em qualquer caso há um imposto estadual (ITCMD) sobre a herança."
    ],
    passos: [
      { titulo: "Levante os bens e os herdeiros", texto: "Liste imóveis, contas, veículos, dívidas e quem são os herdeiros. Reúna as certidões e documentos de cada bem." },
      { titulo: "Escolha a via correta", texto: "Cartório quando todos concordam, são maiores e não há testamento exigindo juiz; caso contrário, judicial. Advogado é obrigatório nas duas." },
      { titulo: "Calcule e pague o ITCMD", texto: "O imposto estadual incide sobre a herança e costuma ter prazo a partir do falecimento. O atraso gera multa." },
      { titulo: "Faça a partilha e transfira os bens", texto: "Definida a divisão, lavra-se a escritura ou expede-se o formal de partilha para passar os bens aos herdeiros." }
    ],
    direitos: [
      "Direito dos herdeiros à parte que lhes cabe na herança",
      "Reserva da legítima aos herdeiros necessários (descendentes, ascendentes, cônjuge)",
      "Inventário extrajudicial em cartório quando há consenso e requisitos legais",
      "Meação do cônjuge ou companheiro, conforme o regime de bens"
    ],
    quando_urgente:
      "Há prazo para abrir o inventário e pagar o ITCMD sem multa (varia por estado, em geral 60 dias). Quanto antes começar, menor o risco de multa e de conflito entre herdeiros.",
    documentos: [
      "Certidão de óbito",
      "Documentos dos herdeiros e do falecido",
      "Certidões e matrículas dos imóveis",
      "Documentos de contas, veículos e dívidas",
      "Testamento, se houver"
    ],
    termos_glossario: ["inventario"],
    atualizado_em: "2026-05-30"
  },
  {
    slug: "quero-cancelar-compra-e-ser-reembolsado",
    titulo: "Comprei e me arrependi. Tenho direito a cancelar e ser reembolsado?",
    intencao_curta:
      "Consumidor quer desistir de compra feita pela internet ou fora da loja e receber o dinheiro de volta.",
    resumo:
      "Em compras feitas fora da loja física — internet, telefone, catálogo — o consumidor tem direito de arrependimento e pode cancelar em até 7 dias, com devolução integral do valor.",
    areas: ["consumidor"],
    situacao: [
      "O direito de arrependimento vale para compras feitas fora do estabelecimento físico (sites, aplicativos, telefone). Nesses casos você pode desistir em até 7 dias corridos do recebimento, sem precisar justificar.",
      "Cancelando dentro do prazo, a loja deve devolver tudo o que você pagou, inclusive o frete, de forma imediata e corrigida.",
      "Em compras na loja física o arrependimento não é automático — depende da política da loja —, mas você continua com direito à troca em caso de defeito."
    ],
    passos: [
      { titulo: "Formalize a desistência por escrito", texto: "Avise a loja dentro dos 7 dias por canal que gere comprovante (e-mail, chat, app). Guarde o protocolo e a data." },
      { titulo: "Combine a devolução do produto", texto: "A loja deve orientar como devolver. No arrependimento, o custo do envio de retorno é da loja." },
      { titulo: "Cobre o reembolso integral", texto: "Você tem direito a receber de volta tudo o que pagou, inclusive o frete. Em compra no cartão, o estorno deve aparecer na fatura." },
      { titulo: "Registre reclamação se travar", texto: "Se a loja não devolver, registre no consumidor.gov.br e no Procon. Persistindo, cabe ação no Juizado Especial." }
    ],
    direitos: [
      "Arrependimento em até 7 dias em compras fora da loja física",
      "Devolução integral do valor pago, incluindo o frete",
      "Cancelamento sem precisar justificar o motivo",
      "Troca garantida em caso de produto com defeito, mesmo na loja física"
    ],
    quando_urgente:
      "O prazo de 7 dias é curto e corre do recebimento. Em dúvida, formalize a desistência logo — depois você resolve os detalhes da devolução.",
    documentos: [
      "Comprovante e nota fiscal da compra",
      "Print da desistência e do protocolo",
      "Conversas com a loja (e-mail, chat)",
      "Fatura do cartão, se foi parcelado"
    ],
    atualizado_em: "2026-05-30"
  },
  {
    slug: "plano-de-saude-reajustou-de-forma-abusiva",
    titulo: "Meu plano de saúde aumentou demais. O reajuste é abusivo?",
    intencao_curta:
      "Beneficiário recebe aumento alto, principalmente por mudança de faixa etária ou em plano coletivo.",
    resumo:
      "Reajustes de plano de saúde têm limites e regras. Aumentos por faixa etária e em planos coletivos vêm sendo controlados pela Justiça quando se mostram abusivos ou sem transparência.",
    areas: ["consumidor", "civil"],
    situacao: [
      "Há dois reajustes comuns: o anual (variação de custos) e o por faixa etária (quando você muda de idade). Planos individuais têm teto definido pela ANS; os coletivos seguem o contrato, mas não podem ser abusivos.",
      "Aumentos muito altos por mudança de faixa etária, sobretudo após os 60 anos, costumam ser questionados — o Estatuto do Idoso e a jurisprudência protegem o consumidor contra reajuste que inviabiliza o plano.",
      "Em planos coletivos, reajustes elevados e sem demonstração clara dos cálculos também têm sido revistos pela Justiça."
    ],
    passos: [
      { titulo: "Entenda o reajuste aplicado", texto: "Peça à operadora, por escrito, a justificativa e os índices usados. Compare com o histórico dos seus boletos." },
      { titulo: "Verifique as regras do seu plano", texto: "Confira se é individual ou coletivo e o que diz o contrato. Em plano individual, confira o teto divulgado pela ANS." },
      { titulo: "Reclame na ANS e no Procon", texto: "A ANS regula o setor e recebe reclamações. O registro pressiona a operadora e serve de prova." },
      { titulo: "Avalie a ação judicial", texto: "Se o reajuste for abusivo, cabe ação para revisar o valor e, às vezes, devolver o que foi pago a mais. Um advogado analisa contrato e índices." }
    ],
    direitos: [
      "Reajuste dentro dos limites e com transparência nos cálculos",
      "Proteção reforçada ao consumidor idoso contra aumento que inviabilize o plano",
      "Revisão judicial de reajuste abusivo, com possível devolução de valores",
      "Informação clara sobre os índices aplicados"
    ],
    quando_urgente:
      "Se o aumento ameaça fazer você perder o plano em meio a um tratamento, procure um advogado com urgência — cabe pedido de liminar para manter o valor anterior enquanto se discute o reajuste.",
    documentos: [
      "Boletos antigos e o novo com o reajuste",
      "Contrato do plano e carteirinha",
      "Justificativa do reajuste enviada pela operadora",
      "Comprovantes de tratamento em curso, se houver"
    ],
    atualizado_em: "2026-05-30"
  },
  {
    slug: "bpc-loas-foi-negado",
    titulo: "O INSS negou meu BPC/LOAS. O que fazer?",
    intencao_curta:
      "Idoso ou pessoa com deficiência de baixa renda tem o benefício assistencial negado.",
    resumo:
      "O BPC/LOAS é um salário mínimo pago a idosos a partir de 65 anos ou a pessoas com deficiência, de baixa renda. A negativa pode ser revertida com recurso administrativo ou ação judicial.",
    areas: ["previdenciario"],
    situacao: [
      "O BPC (Benefício de Prestação Continuada), também chamado de LOAS, não é aposentadoria: é assistência social, não exige contribuição e paga um salário mínimo a quem tem 65 anos ou mais, ou a pessoas com deficiência, desde que a renda da família seja baixa.",
      "As negativas mais comuns são por critério de renda (a família ficou pouco acima do limite) ou por a perícia não reconhecer a deficiência. Em muitos casos a Justiça analisa a situação real da família e reverte.",
      "A renda por pessoa da família é o principal critério, mas a Justiça admite avaliar gastos com saúde e a real situação de miserabilidade, além do número seco."
    ],
    passos: [
      { titulo: "Leia o motivo da negativa", texto: "No Meu INSS, veja a carta de indeferimento — ela diz se foi renda ou perícia. Isso define a estratégia." },
      { titulo: "Reúna provas da renda e da condição", texto: "Comprovantes de renda de todos da casa, despesas com saúde e remédios, laudos médicos da deficiência." },
      { titulo: "Apresente recurso administrativo", texto: "Cabe recurso no próprio INSS, com prazo a partir da negativa. É gratuito e pode resolver sem ação." },
      { titulo: "Avalie a ação judicial", texto: "Mantida a negativa, a Justiça (Juizado Especial Federal) costuma reavaliar com perícia e estudo social. Um advogado ou a Defensoria pode atuar." }
    ],
    direitos: [
      "Um salário mínimo mensal a quem cumpre os requisitos de idade ou deficiência e de renda",
      "Reavaliação da renda considerando gastos com saúde e a real condição da família",
      "Recurso administrativo gratuito contra a negativa",
      "Análise judicial com perícia médica e estudo social"
    ],
    quando_urgente:
      "Se a pessoa depende do benefício para remédios e alimentação, não deixe o prazo de recurso passar. Procure orientação logo após a negativa.",
    documentos: [
      "Carta de indeferimento do INSS",
      "Documentos e renda de todos os moradores da casa",
      "Laudos e relatórios médicos da deficiência",
      "Comprovantes de despesas com saúde",
      "Comprovante de residência"
    ],
    atualizado_em: "2026-05-30"
  },
  {
    slug: "pensao-por-morte-foi-negada",
    titulo: "O INSS negou a pensão por morte. O que fazer?",
    intencao_curta:
      "Dependente tem a pensão por morte de um familiar negada pelo INSS.",
    resumo:
      "Pensão por morte é o benefício pago aos dependentes de quem faleceu sendo segurado. A negativa por falta de qualidade de segurado ou de prova de dependência pode ser revertida.",
    areas: ["previdenciario"],
    situacao: [
      "A pensão por morte é paga a dependentes (cônjuge, companheiro, filhos menores e outros, conforme o caso) quando a pessoa falecida ainda mantinha a qualidade de segurada do INSS.",
      "As negativas comuns são por entender que o falecido perdeu a qualidade de segurado (ficou muito tempo sem contribuir) ou por falta de prova da união estável ou da dependência.",
      "Em muitos casos é possível comprovar a manutenção da qualidade de segurado ou a união estável com documentos e testemunhas, revertendo a negativa."
    ],
    passos: [
      { titulo: "Veja o motivo no Meu INSS", texto: "A carta de indeferimento aponta se foi qualidade de segurado ou prova de dependência. Isso direciona o que reunir." },
      { titulo: "Reúna a prova da relação", texto: "Para união estável: conta conjunta, filhos em comum, fotos, mesmo endereço, declarações. Para qualidade de segurado: CNIS e vínculos do falecido." },
      { titulo: "Apresente recurso ao INSS", texto: "Cabe recurso administrativo gratuito dentro do prazo da negativa, com os novos documentos." },
      { titulo: "Avalie a via judicial", texto: "Mantida a negativa, a ação na Justiça Federal pode reconhecer a dependência e a qualidade de segurado, inclusive com testemunhas." }
    ],
    direitos: [
      "Pensão aos dependentes quando comprovada a qualidade de segurado do falecido",
      "Reconhecimento de união estável por documentos e testemunhas",
      "Recurso administrativo gratuito contra a negativa",
      "Pagamento retroativo à data do óbito ou do requerimento, conforme o caso"
    ],
    quando_urgente:
      "Pedir a pensão logo após o falecimento garante o pagamento desde a data do óbito (dentro do prazo legal). Demorar pode fazer você perder valores retroativos.",
    documentos: [
      "Carta de indeferimento do INSS",
      "Certidão de óbito",
      "Provas da união ou do parentesco (certidões, conta conjunta, fotos)",
      "CNIS e documentos de trabalho do falecido",
      "Documentos dos dependentes"
    ],
    atualizado_em: "2026-05-30"
  },
  {
    slug: "comprei-imovel-na-planta-e-atrasou",
    titulo: "Comprei imóvel na planta e a obra atrasou. Quais são meus direitos?",
    intencao_curta:
      "Comprador de imóvel na planta enfrenta atraso na entrega pela construtora.",
    resumo:
      "Atraso na entrega de imóvel na planta dá direitos ao comprador — de multa e indenização até o desfazimento do contrato com devolução dos valores, conforme o caso e o contrato.",
    areas: ["imobiliario", "consumidor"],
    situacao: [
      "Contratos de imóvel na planta costumam prever uma data de entrega e um prazo de tolerância (em geral de 180 dias). O atraso dentro da tolerância normalmente não gera penalidade; o que passa disso, sim.",
      "Passado o prazo de tolerância, o comprador pode ter direito a indenização pelo período sem o imóvel (por exemplo, valor equivalente a aluguel), multa contratual e correção dos valores.",
      "Em atrasos longos, o comprador pode optar por desfazer o contrato e receber de volta o que pagou, com retenção limitada em favor da construtora, conforme a lei e a jurisprudência."
    ],
    passos: [
      { titulo: "Releia o contrato", texto: "Veja a data prevista, o prazo de tolerância e as cláusulas de multa e de rescisão. É a base de tudo." },
      { titulo: "Notifique a construtora por escrito", texto: "Cobre formalmente a entrega e registre o atraso. Guarde protocolos — serve de prova e marca a data." },
      { titulo: "Calcule o prejuízo", texto: "Some o que já pagou, o tempo de atraso e os gastos extras (aluguel que segue pagando, por exemplo)." },
      { titulo: "Decida entre exigir ou desfazer", texto: "Você pode exigir a entrega com indenização ou rescindir e pedir a devolução. Um advogado indica o melhor caminho." }
    ],
    direitos: [
      "Indenização pelo período de atraso além do prazo de tolerância",
      "Multa contratual e correção dos valores pagos",
      "Opção de rescindir o contrato com devolução do que foi pago, com retenção limitada",
      "Informação clara sobre o andamento da obra"
    ],
    quando_urgente:
      "Se você paga aluguel e prestação ao mesmo tempo, ou se a construtora dá sinais de problema financeiro, procure orientação rápido para proteger o que já pagou.",
    documentos: [
      "Contrato de compra e venda e aditivos",
      "Comprovantes de tudo que foi pago",
      "Notificações e respostas da construtora",
      "Comprovantes de gastos extras (aluguel, mudança)"
    ],
    atualizado_em: "2026-05-30"
  },
  {
    slug: "sofri-violencia-domestica",
    titulo: "Sofri violência doméstica. Como me proteger e o que fazer?",
    intencao_curta:
      "Pessoa em situação de violência doméstica quer proteção imediata e medidas legais.",
    resumo:
      "A Lei Maria da Penha protege quem sofre violência doméstica e familiar. É possível pedir medidas protetivas de urgência, como o afastamento do agressor, de forma rápida, além de registrar o crime.",
    areas: ["criminal", "familia"],
    situacao: [
      "Violência doméstica não é só agressão física: inclui violência psicológica (ameaças, humilhações, controle), moral, patrimonial e sexual, praticada por parceiro, ex-parceiro ou familiar.",
      "A Lei Maria da Penha permite pedir medidas protetivas de urgência — afastamento do agressor do lar, proibição de aproximação e de contato — que o juiz pode conceder em poucos dias, independentemente de processo criminal.",
      "Buscar ajuda cedo é proteção: o registro e as provas ajudam a garantir as medidas e a responsabilização."
    ],
    passos: [
      { titulo: "Em perigo agora, ligue 190", texto: "Se há risco imediato, acione a Polícia Militar pelo 190. A Central de Atendimento à Mulher é o 180, que orienta e encaminha." },
      { titulo: "Registre o boletim de ocorrência", texto: "Vá a uma delegacia, de preferência a Delegacia da Mulher. No registro, peça as medidas protetivas de urgência." },
      { titulo: "Guarde provas", texto: "Mensagens, áudios, fotos de lesões, laudos e nomes de testemunhas. Tudo ajuda a comprovar a violência." },
      { titulo: "Procure apoio jurídico e da rede", texto: "Defensoria Pública, advogado, CRAS/CREAS e o Ministério Público podem ajudar. Você não precisa enfrentar isso sozinha." }
    ],
    direitos: [
      "Medidas protetivas de urgência (afastamento do agressor, proibição de aproximação e de contato)",
      "Atendimento prioritário e proteção pela rede de apoio",
      "Acompanhamento por advogado ou Defensoria Pública, gratuito a quem precisa",
      "Responsabilização criminal do agressor, sem custo para a vítima registrar"
    ],
    quando_urgente:
      "Se há ameaça à sua vida ou integridade agora, ligue 190 imediatamente. As medidas protetivas podem ser pedidas na delegacia e concedidas em caráter de urgência — não espere a violência se repetir.",
    documentos: [
      "Documento de identidade",
      "Mensagens, áudios e fotos que comprovem a violência",
      "Laudos médicos de eventuais lesões",
      "Nomes e contatos de testemunhas"
    ],
    atualizado_em: "2026-05-30"
  },
  {
    "slug": "fui-demitido-por-justa-causa-e-discordo",
    "titulo": "Fui demitido por justa causa e discordo. O que fazer?",
    "intencao_curta": "Entender como contestar uma demissão por justa causa que você considera injusta.",
    "resumo": "A justa causa é a punição mais grave que um trabalhador pode receber e faz você perder vários direitos, como o aviso prévio, a multa de 40% do FGTS e o seguro-desemprego. Por isso, a empresa precisa provar que houve uma falta grave de verdade. Se você discorda do motivo, pode questionar na Justiça do Trabalho e, em muitos casos, conseguir a reversão para uma demissão sem justa causa.",
    "areas": [
      "trabalhista"
    ],
    "situacao": [
      "A justa causa acontece quando a empresa alega que você cometeu uma falta grave, como abandono de emprego, desídia (desleixo repetido), indisciplina ou ato de improbidade. Como é uma punição severa, a lei exige que a empresa tenha provas concretas e que a punição seja proporcional ao que aconteceu.",
      "Na prática, muitas justas causas são aplicadas de forma irregular. É comum o empregador usar esse motivo para não pagar as verbas rescisórias, mesmo sem ter provas suficientes, ou punir o trabalhador por algo pequeno que não justificaria uma medida tão grave.",
      "Quando a justa causa é considerada indevida pela Justiça, ela é revertida e a empresa passa a dever todos os valores de uma demissão sem justa causa, além de poder responder por danos morais em situações que mancharam a sua reputação."
    ],
    "passos": [
      {
        "titulo": "Não assine concordando com a falta",
        "texto": "Você pode receber a documentação, mas não precisa assinar nada admitindo que cometeu a falta grave. Guarde uma cópia de tudo que a empresa entregar."
      },
      {
        "titulo": "Reúna suas provas",
        "texto": "Junte mensagens, e-mails, escala de trabalho e nomes de colegas que possam testemunhar. Isso ajuda a mostrar que a falta não existiu ou não foi tão grave."
      },
      {
        "titulo": "Procure um advogado trabalhista",
        "texto": "Um profissional vai analisar se a justa causa tem fundamento e calcular o que você teria a receber caso ela seja revertida na Justiça."
      },
      {
        "titulo": "Avalie entrar com ação na Justiça do Trabalho",
        "texto": "Se a justa causa for indevida, é possível pedir a reversão e o pagamento das verbas rescisórias e demais direitos negados."
      }
    ],
    "direitos": [
      "Direito de questionar a justa causa na Justiça do Trabalho e pedir a sua reversão.",
      "Se revertida, direito ao aviso prévio, à multa de 40% do FGTS e à liberação do seguro-desemprego.",
      "Direito de receber as verbas rescisórias que foram negadas pela empresa.",
      "Possibilidade de indenização por danos morais quando a acusação foi injusta e prejudicou a sua honra."
    ],
    "quando_urgente": "Procure um advogado com urgência, pois há prazo para reclamar seus direitos na Justiça do Trabalho, que em geral é contado a partir do fim do contrato. Quanto antes você agir, mais fácil é reunir provas e localizar testemunhas. Se a justa causa envolveu uma acusação grave, como furto ou agressão, que possa virar também um processo criminal, a orientação jurídica imediata é ainda mais importante.",
    "documentos": [
      "Carteira de trabalho e contrato de trabalho.",
      "Comunicado ou carta de demissão por justa causa, se a empresa tiver entregado.",
      "Holerites (contracheques) e comprovantes de depósito do FGTS.",
      "Mensagens, e-mails e advertências relacionadas ao motivo alegado.",
      "Nomes e contatos de colegas que possam servir como testemunhas."
    ],
    "faq": [
      {
        "q": "A empresa precisa provar a justa causa?",
        "a": "Sim. O ônus de provar a falta grave é da empresa. Se ela não conseguir comprovar, a Justiça pode reverter a justa causa para uma demissão sem justa causa."
      },
      {
        "q": "Tenho direito ao seguro-desemprego se a justa causa for revertida?",
        "a": "Em geral, sim. Com a reversão, a dispensa passa a ser sem justa causa, o que permite habilitar o seguro-desemprego, desde que você cumpra os demais requisitos."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "nao-recebi-o-seguro-desemprego",
    "titulo": "Não recebi o seguro-desemprego. O que devo fazer?",
    "intencao_curta": "Saber o que fazer quando o seguro-desemprego é negado ou não cai na conta.",
    "resumo": "O seguro-desemprego é um auxílio pago ao trabalhador demitido sem justa causa para ajudar no período em que ele está sem renda. Quando o benefício é negado, fica preso ou não é liberado, pode haver erro de cadastro, falha da empresa ou exigência não cumprida. Em muitos casos, é possível corrigir o problema administrativamente ou, se for preciso, buscar o pagamento na Justiça.",
    "areas": [
      "trabalhista"
    ],
    "situacao": [
      "O seguro-desemprego costuma ser negado por motivos como dados divergentes entre o que a empresa informou e o seu cadastro, falta de algum documento ou a identificação de outra fonte de renda em seu nome.",
      "Também é comum o benefício não sair porque a empresa não deu baixa corretamente na carteira de trabalho, não entregou as guias ou atrasou as informações nos sistemas do governo. Nesses casos, o problema não é seu, mas acaba travando a liberação.",
      "Há ainda situações em que a demissão foi registrada de forma errada, como uma justa causa indevida ou um pedido de demissão que você não fez, o que impede o recebimento até que a situação seja regularizada."
    ],
    "passos": [
      {
        "titulo": "Confira o motivo da negativa",
        "texto": "Veja no aplicativo ou no site oficial qual foi a razão informada. Saber o motivo exato ajuda a corrigir o problema certo."
      },
      {
        "titulo": "Junte seus documentos",
        "texto": "Separe a carteira de trabalho, o termo de rescisão e os comprovantes da demissão para mostrar que você tem direito ao benefício."
      },
      {
        "titulo": "Cobre a empresa e busque o atendimento oficial",
        "texto": "Se o erro foi da empresa, peça que ela regularize. Você também pode procurar os canais de atendimento do trabalhador para tentar resolver."
      },
      {
        "titulo": "Procure um advogado se não resolver",
        "texto": "Quando o benefício continua negado de forma indevida, um advogado pode ajudar a exigir o pagamento, inclusive na Justiça."
      }
    ],
    "direitos": [
      "Direito de receber o seguro-desemprego quando foi demitido sem justa causa e cumpre os requisitos.",
      "Direito a uma explicação clara sobre o motivo da negativa do benefício.",
      "Direito de exigir que a empresa entregue a documentação e regularize as informações.",
      "Possibilidade de buscar na Justiça o pagamento e até indenização quando a empresa causou o prejuízo de má-fé."
    ],
    "quando_urgente": "Como o seguro-desemprego costuma ter prazo para ser solicitado após a demissão, procure orientação rapidamente para não perder a oportunidade de pedir o benefício. A urgência é maior se você está sem nenhuma renda, com contas essenciais atrasadas, ou se o prazo para requerer está perto de acabar. Um advogado pode indicar o caminho mais rápido para destravar o pagamento.",
    "documentos": [
      "Carteira de trabalho com a baixa do contrato.",
      "Termo de rescisão do contrato de trabalho.",
      "Guias e comunicado de dispensa fornecidos pela empresa.",
      "Comprovante da negativa ou do bloqueio do benefício.",
      "Documento de identidade e CPF."
    ],
    "faq": [
      {
        "q": "Posso receber o seguro-desemprego se pedi demissão?",
        "a": "Em regra, não. O seguro-desemprego é voltado para quem foi demitido sem justa causa. Se houve registro errado de pedido de demissão, é preciso corrigir isso primeiro."
      },
      {
        "q": "A empresa não deu baixa e o benefício não saiu. O que faço?",
        "a": "Você pode cobrar a regularização da empresa e, se ela não resolver, buscar a Justiça do Trabalho para exigir a correção e o pagamento do que tem direito."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "meu-fgts-nao-foi-depositado-pela-empresa",
    "titulo": "Meu FGTS não foi depositado pela empresa. Como cobrar?",
    "intencao_curta": "Entender o que fazer quando a empresa não recolhe o FGTS na sua conta.",
    "resumo": "O FGTS é um valor que a empresa deve depositar todo mês em uma conta vinculada ao trabalhador. Quando esses depósitos não são feitos, você fica sem uma reserva importante, que serve para situações como demissão sem justa causa, compra da casa própria e doença grave. É possível cobrar os valores atrasados, e a empresa pode ser obrigada a pagar tudo, com correção.",
    "areas": [
      "trabalhista"
    ],
    "situacao": [
      "O depósito do FGTS é uma obrigação da empresa e deve aparecer de forma regular no seu extrato. Muitos trabalhadores só descobrem que os valores não foram recolhidos na hora da demissão ou quando tentam usar o dinheiro e percebem que o saldo está bem abaixo do esperado.",
      "A falta de depósito pode acontecer durante todo o contrato ou apenas em alguns meses. Mesmo que a empresa esteja pagando o salário corretamente, isso não significa que o FGTS esteja em dia, pois são obrigações diferentes.",
      "Quando a empresa não recolhe o FGTS, você pode cobrar os valores atrasados com correção, e em muitos casos o empregador também responde por outras consequências previstas na lei trabalhista."
    ],
    "passos": [
      {
        "titulo": "Verifique o seu extrato do FGTS",
        "texto": "Consulte o saldo e o histórico de depósitos pelos canais oficiais. Assim você descobre quais meses ficaram sem recolhimento."
      },
      {
        "titulo": "Reúna seus contracheques",
        "texto": "Os holerites mostram o salário sobre o qual o FGTS deveria ter sido calculado, o que ajuda a comprovar os valores devidos."
      },
      {
        "titulo": "Cobre a empresa por escrito",
        "texto": "Registre a cobrança por escrito, por mensagem ou e-mail, pedindo a regularização dos depósitos atrasados."
      },
      {
        "titulo": "Procure um advogado trabalhista",
        "texto": "Se a empresa não regularizar, um advogado pode entrar com ação para exigir os depósitos não feitos, com correção."
      }
    ],
    "direitos": [
      "Direito de receber todos os depósitos de FGTS que deixaram de ser recolhidos, com correção.",
      "Direito de consultar o extrato e saber exatamente o que foi ou não depositado.",
      "Direito de cobrar a empresa durante o contrato e também após a demissão.",
      "Em caso de demissão sem justa causa, direito à multa de 40% calculada sobre o total que deveria ter sido depositado."
    ],
    "quando_urgente": "Procure orientação com urgência se você está prestes a ser demitido ou já foi, pois é o momento em que a falta de FGTS pesa mais e há prazos para reclamar os valores na Justiça. A pressa também é importante se você precisa do dinheiro para uma situação prevista em lei, como doença grave ou compra da casa própria, e descobriu que o saldo está incompleto por culpa da empresa.",
    "documentos": [
      "Extrato do FGTS com o histórico de depósitos.",
      "Carteira de trabalho e contrato de trabalho.",
      "Holerites (contracheques) que mostram o salário e os descontos.",
      "Termo de rescisão, se você já foi demitido.",
      "Mensagens ou e-mails de cobrança feitos à empresa."
    ],
    "faq": [
      {
        "q": "Como sei se a empresa não depositou meu FGTS?",
        "a": "Você pode consultar o extrato do FGTS pelos canais oficiais e comparar com os meses trabalhados. Se houver meses sem depósito, é sinal de que a empresa não recolheu."
      },
      {
        "q": "Ainda posso cobrar o FGTS depois de sair da empresa?",
        "a": "Sim. Mesmo após a demissão, há prazo para reclamar na Justiça os depósitos que não foram feitos. Por isso, é importante não demorar para buscar seus direitos."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "estou-com-salario-atrasado-ha-meses",
    "titulo": "Estou com salário atrasado há meses. Quais são meus direitos?",
    "intencao_curta": "Saber o que fazer quando a empresa atrasa o pagamento do salário repetidamente.",
    "resumo": "O salário tem data certa para ser pago, e o atraso constante coloca em risco o sustento da sua família. Quando a empresa atrasa os pagamentos de forma repetida, isso é uma falta grave do empregador e você tem direitos, que vão desde cobrar os valores atrasados até pedir o fim do contrato por culpa da empresa, mantendo as verbas de uma demissão sem justa causa.",
    "areas": [
      "trabalhista"
    ],
    "situacao": [
      "O pagamento do salário deve ocorrer dentro do prazo combinado, normalmente até o quinto dia útil do mês seguinte ao trabalhado. Quando esse prazo não é cumprido de forma repetida, o trabalhador fica sem condições de pagar suas contas básicas, mesmo continuando a prestar serviço.",
      "É comum o empregador prometer regularizar os pagamentos, mas o atraso vai se acumulando mês a mês. Muitas vezes o trabalhador segue trabalhando por medo de perder o emprego, enquanto as dívidas pessoais crescem.",
      "O atraso reiterado de salário é considerado uma falta grave da empresa e pode permitir que você encerre o contrato por culpa do empregador, recebendo as mesmas verbas de uma demissão sem justa causa, além de cobrar tudo o que está em aberto."
    ],
    "passos": [
      {
        "titulo": "Anote os atrasos",
        "texto": "Registre quais meses foram pagos com atraso ou não foram pagos. Esse histórico é importante para comprovar a falta grave da empresa."
      },
      {
        "titulo": "Guarde holerites e comprovantes",
        "texto": "Mantenha os contracheques e os comprovantes de pagamento, mesmo os atrasados, para mostrar a diferença entre o devido e o recebido."
      },
      {
        "titulo": "Procure um advogado trabalhista",
        "texto": "Um profissional pode avaliar se é o caso de cobrar os valores ou de pedir o fim do contrato por culpa da empresa, sem perder seus direitos."
      },
      {
        "titulo": "Avalie a ação na Justiça do Trabalho",
        "texto": "É possível exigir os salários atrasados e, dependendo do caso, a chamada rescisão indireta, com o pagamento das verbas rescisórias."
      }
    ],
    "direitos": [
      "Direito de receber todos os salários atrasados, com correção.",
      "Direito de pedir o fim do contrato por culpa da empresa quando o atraso é grave e repetido.",
      "Direito de manter as verbas de uma demissão sem justa causa nesse tipo de rescisão.",
      "Possibilidade de buscar indenização por danos morais quando o atraso causou prejuízo sério à sua vida financeira."
    ],
    "quando_urgente": "Procure um advogado com urgência se os atrasos estão se repetindo e comprometendo o seu sustento, pois agir cedo ajuda a documentar a falta grave e a proteger seus direitos. A urgência é ainda maior se você já está com contas essenciais atrasadas, como aluguel e contas de casa, ou se a empresa dá sinais de que pode fechar as portas, o que dificulta receber depois.",
    "documentos": [
      "Carteira de trabalho e contrato de trabalho.",
      "Holerites (contracheques) dos meses em atraso.",
      "Comprovantes de pagamento que mostrem as datas reais.",
      "Mensagens ou e-mails em que a empresa reconhece ou promete pagar.",
      "Extratos bancários que confirmem a falta dos depósitos."
    ],
    "faq": [
      {
        "q": "Posso parar de trabalhar se meu salário está atrasado?",
        "a": "Essa decisão deve ser orientada por um advogado, porque parar por conta própria pode trazer riscos. O caminho mais seguro costuma ser pedir a rescisão indireta, que reconhece a culpa da empresa."
      },
      {
        "q": "Tenho direito a algo além dos salários atrasados?",
        "a": "Em muitos casos, sim. Além de receber os valores em aberto, você pode ter direito às verbas de uma demissão sem justa causa e, em situações graves, a uma indenização por danos morais."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "tenho-direito-a-equiparacao-salarial",
    "titulo": "Faço o mesmo trabalho de um colega e ganho menos. Tenho direito a equiparação salarial?",
    "intencao_curta": "Entender quando você pode receber o mesmo salário de um colega que faz a mesma função.",
    "resumo": "A equiparação salarial é o direito de receber o mesmo salário de um colega que faz a mesma função, com a mesma qualidade e produtividade, para o mesmo empregador. Quando você descobre que alguém na mesma situação ganha mais, pode ter direito a igualar o salário e a receber as diferenças que deixou de receber no passado, dentro dos limites previstos na lei trabalhista.",
    "areas": [
      "trabalhista"
    ],
    "situacao": [
      "A equiparação acontece quando dois trabalhadores exercem a mesma função, com igual produtividade e perfeição técnica, mas um deles recebe um salário menor sem uma justificativa válida. A lei busca evitar que pessoas que fazem o mesmo trabalho sejam pagas de forma desigual.",
      "Na prática, muitos trabalhadores só percebem a diferença ao conversar com colegas ou ao assumir tarefas idênticas às de alguém que ganha mais. Em geral, a comparação é feita com um colega que trabalha no mesmo local e para o mesmo empregador.",
      "Existem situações em que a diferença é permitida, como quando há um quadro de carreira organizado, diferença grande de tempo na função ou produtividade claramente distinta. Por isso, cada caso precisa ser analisado com cuidado antes de afirmar que há direito à equiparação."
    ],
    "passos": [
      {
        "titulo": "Identifique o colega de comparação",
        "texto": "Saiba quem é a pessoa que faz a mesma função e ganha mais. Esse colega serve de referência para o pedido de equiparação."
      },
      {
        "titulo": "Reúna provas das funções",
        "texto": "Junte documentos e mensagens que mostrem que vocês fazem as mesmas tarefas, com a mesma responsabilidade e qualidade."
      },
      {
        "titulo": "Confira holerites e descrições de cargo",
        "texto": "Compare os contracheques e as descrições das funções para evidenciar a diferença de salário sem motivo válido."
      },
      {
        "titulo": "Procure um advogado trabalhista",
        "texto": "Um profissional vai avaliar se o seu caso preenche os requisitos da equiparação e calcular as diferenças que você pode receber."
      }
    ],
    "direitos": [
      "Direito de receber o mesmo salário de um colega que faz a mesma função, nas condições previstas na lei.",
      "Direito de cobrar as diferenças salariais do passado, respeitados os prazos legais.",
      "Direito de ter reflexos dessas diferenças em outras verbas, como férias e décimo terceiro.",
      "Direito a uma análise individual do caso, já que nem toda diferença gera equiparação."
    ],
    "quando_urgente": "Procure um advogado assim que perceber a diferença salarial, porque há prazos para cobrar os valores do passado e parte deles pode ser perdida com o tempo. A pressa também é importante se você ou o colega de comparação podem sair da empresa em breve, já que isso dificulta reunir provas e organizar a comparação que sustenta o pedido de equiparação.",
    "documentos": [
      "Carteira de trabalho e contrato de trabalho.",
      "Holerites (contracheques) seus e, se possível, indicação do salário do colega.",
      "Descrições de cargo, organogramas ou normas internas da empresa.",
      "Mensagens e e-mails que mostrem as tarefas realizadas por você e pelo colega.",
      "Nomes e contatos de testemunhas que conheçam as funções de ambos."
    ],
    "faq": [
      {
        "q": "Preciso saber exatamente quanto meu colega ganha?",
        "a": "Ajuda muito ter essa informação, mas nem sempre é possível tê-la de início. O advogado pode pedir que a empresa apresente esses dados durante o processo na Justiça do Trabalho."
      },
      {
        "q": "A empresa pode pagar salários diferentes para a mesma função?",
        "a": "Pode, em algumas situações, como quando há um quadro de carreira válido ou diferença relevante de tempo na função e de produtividade. Por isso, cada caso deve ser analisado individualmente."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "fui-dispensado-tendo-estabilidade-no-emprego",
    "titulo": "Fui dispensado mesmo tendo estabilidade no emprego. O que posso fazer?",
    "intencao_curta": "Saber o que fazer quando a empresa demite quem tinha direito à estabilidade.",
    "resumo": "A estabilidade é uma proteção que impede a demissão sem justa causa em determinadas situações, como após acidente de trabalho, durante a gestação ou quando o trabalhador é membro da CIPA. Se você foi dispensado mesmo tendo essa garantia, a demissão pode ser considerada irregular, e você pode ter direito de voltar ao emprego ou de receber uma indenização pelo período da estabilidade.",
    "areas": [
      "trabalhista"
    ],
    "situacao": [
      "A estabilidade existe para proteger o trabalhador em momentos específicos, em que a perda do emprego traria um prejuízo ainda maior. É o caso, por exemplo, da gestante, do empregado que sofreu acidente de trabalho e está em recuperação, e de quem ocupa cargo de representação dos trabalhadores, como a CIPA.",
      "Na prática, muitas empresas demitem sem saber, ou sem considerar, que o trabalhador tinha essa proteção. Em alguns casos, a própria pessoa só descobre que tinha estabilidade depois da demissão, ao procurar orientação.",
      "Quando há dispensa durante a estabilidade, a lei costuma garantir a reintegração ao emprego ou, quando isso não é possível ou conveniente, o pagamento dos salários e demais valores referentes a todo o período em que você deveria estar protegido."
    ],
    "passos": [
      {
        "titulo": "Confirme o tipo de estabilidade",
        "texto": "Verifique se a sua situação se enquadra em uma das proteções, como gestação, acidente de trabalho ou cargo na CIPA, e o período de cobertura."
      },
      {
        "titulo": "Reúna as provas da estabilidade",
        "texto": "Junte documentos que comprovem a sua condição, como atestados, laudos, exames ou a ata da eleição para a CIPA."
      },
      {
        "titulo": "Procure um advogado trabalhista",
        "texto": "Um profissional vai avaliar se a demissão foi irregular e indicar se cabe pedir a volta ao emprego ou uma indenização."
      },
      {
        "titulo": "Avalie a ação na Justiça do Trabalho",
        "texto": "É possível pedir a reintegração ao emprego ou o pagamento dos valores correspondentes a todo o período de estabilidade."
      }
    ],
    "direitos": [
      "Direito de não ser demitido sem justa causa durante o período de estabilidade.",
      "Direito de pedir a volta ao emprego quando a dispensa foi irregular.",
      "Direito de receber salários e demais verbas do período de estabilidade quando a volta não ocorre.",
      "Direito a uma análise do seu caso para confirmar o tipo e o tempo de estabilidade."
    ],
    "quando_urgente": "Procure um advogado o quanto antes, porque alguns pedidos, como o de voltar ao emprego, fazem mais sentido quando feitos rapidamente, e há prazos para reclamar na Justiça. A urgência é ainda maior se a estabilidade ainda está em curso, como em uma gestação, ou se você depende do emprego para manter o plano de saúde e o sustento da família durante esse período de proteção.",
    "documentos": [
      "Carteira de trabalho e contrato de trabalho.",
      "Comunicado ou termo de demissão entregue pela empresa.",
      "Documentos que comprovem a estabilidade, como atestados, laudos ou exames.",
      "Ata de eleição da CIPA, no caso de cargo de representação.",
      "Holerites (contracheques) e termo de rescisão."
    ],
    "faq": [
      {
        "q": "Posso escolher entre voltar ao emprego ou receber indenização?",
        "a": "Nem sempre a escolha é só sua. A Justiça avalia o caso e, quando a volta ao emprego não é possível ou recomendável, costuma determinar o pagamento dos valores do período de estabilidade."
      },
      {
        "q": "E se a empresa não sabia da minha estabilidade?",
        "a": "Em geral, isso não afasta a proteção. A estabilidade existe pela situação em si, como a gestação ou o acidente, mesmo que a empresa alegue que não tinha conhecimento."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "sofri-reducao-de-salario-sem-acordo",
    "titulo": "Meu salário foi reduzido sem o meu acordo. O que fazer?",
    "intencao_curta": "Entender se a empresa pode reduzir o salário e como reagir quando isso acontece sem combinar com você.",
    "resumo": "Como regra, o salário não pode ser reduzido sem a sua concordância. A Constituição protege o trabalhador contra a diminuição do que ele recebe. Existem pouquíssimas exceções, e quase sempre elas dependem de acordo coletivo com o sindicato. Se a empresa cortou o seu pagamento por conta própria, você provavelmente tem direito a receber a diferença e a continuar ganhando o valor antigo.",
    "areas": [
      "trabalhista"
    ],
    "situacao": [
      "A redução costuma aparecer de várias formas. Às vezes a empresa diminui o valor fixo do salário de um mês para o outro. Em outros casos, ela retira uma parte que você sempre recebia, como uma comissão fixa, uma gratificação ou um adicional, alegando que era apenas um 'extra' que agora foi cortado.",
      "Também é comum a empresa mudar a sua função para uma posição que paga menos, ou rebaixar o cargo sem explicação. Há ainda situações em que o corte vem disfarçado, por exemplo, quando reduzem a sua jornada e o salário junto, mas sem nenhum acordo formal assinado com o sindicato.",
      "Em qualquer dessas formas, o ponto central é o mesmo: na maioria das vezes o salário é protegido e não pode simplesmente encolher porque a empresa decidiu. A diminuição sem a sua concordância costuma ser considerada irregular."
    ],
    "passos": [
      {
        "titulo": "Junte os contracheques",
        "texto": "Reúna os holerites de antes e depois da redução. Eles mostram com clareza o valor que você recebia e o quanto passou a receber."
      },
      {
        "titulo": "Não assine nada sem entender",
        "texto": "Se a empresa pedir que você assine um documento concordando com o corte, leia com atenção. Você não é obrigado a aceitar uma redução do seu salário."
      },
      {
        "titulo": "Registre por escrito",
        "texto": "Procure formalizar a sua discordância por e-mail ou mensagem. Ter um registro de que você não concordou ajuda muito caso o caso vá para a Justiça."
      },
      {
        "titulo": "Procure orientação jurídica",
        "texto": "Converse com um advogado trabalhista ou com o seu sindicato. Eles podem avaliar se houve acordo coletivo válido ou se o corte foi indevido."
      }
    ],
    "direitos": [
      "Em muitos casos, direito de continuar recebendo o salário no valor anterior à redução.",
      "Direito de receber as diferenças de salário que deixaram de ser pagas durante o período do corte.",
      "Proteção contra a redução do salário, que como regra só pode ocorrer por acordo coletivo firmado com o sindicato.",
      "Possibilidade de questionar na Justiça do Trabalho a diminuição feita por conta própria pela empresa."
    ],
    "quando_urgente": "Procure um advogado com urgência se a redução veio acompanhada de ameaça de demissão, se você foi pressionado a assinar a aceitação na hora, ou se o corte deixou você sem condições de pagar suas contas básicas. Quanto antes você buscar orientação, mais fácil é reunir provas e evitar que o valor menor vire o seu novo salário 'normal'.",
    "documentos": [
      "Contracheques (holerites) de antes e depois da redução",
      "Carteira de trabalho ou contrato de trabalho com o cargo e o salário combinados",
      "E-mails, mensagens ou comunicados da empresa sobre a mudança",
      "Eventual documento que a empresa pediu para você assinar",
      "Extratos bancários que mostrem os depósitos do salário"
    ],
    "faq": [
      {
        "q": "A empresa pode reduzir meu salário se estiver com dificuldades financeiras?",
        "a": "Em regra, não pode reduzir por conta própria, mesmo com dificuldades. A diminuição costuma depender de acordo coletivo com o sindicato. Sem isso, o corte tende a ser considerado irregular."
      },
      {
        "q": "Se eu assinei concordando com a redução, perdi meus direitos?",
        "a": "Não necessariamente. Muitas vezes a Justiça considera que o trabalhador assinou sob pressão ou sem entender. Vale procurar um advogado para avaliar o seu caso concreto."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "acumulo-de-funcao-sem-aumento-de-salario",
    "titulo": "Faço o trabalho de mais de um cargo e não recebo a mais por isso. Tenho direito?",
    "intencao_curta": "Saber se você pode receber algo a mais quando acumula funções de cargos diferentes sem nenhum aumento.",
    "resumo": "Quando você passa a fazer, ao mesmo tempo, tarefas que seriam de outro cargo ou de outra pessoa, pode estar acontecendo o chamado acúmulo de função. Em muitos casos, isso dá direito a um valor a mais no salário. Cada situação é diferente, e o resultado depende das suas tarefas reais e do que estava combinado no contrato. Por isso vale juntar provas e procurar orientação.",
    "areas": [
      "trabalhista"
    ],
    "situacao": [
      "O acúmulo de função costuma surgir aos poucos. Você foi contratado para um cargo, mas com o tempo a empresa começa a passar tarefas que pertenciam a outro funcionário, muitas vezes alguém que saiu e não foi substituído. Aos poucos, você passa a fazer o serviço de duas pessoas.",
      "Outra forma comum é quando você assume responsabilidades de um cargo superior, como coordenar uma equipe ou cuidar do caixa, sem receber a remuneração compatível com essa nova atividade. A empresa se beneficia do trabalho extra, mas o salário continua o mesmo.",
      "Nem todo conjunto de tarefas gera direito a mais dinheiro, porque algumas atividades fazem parte do próprio cargo. O que costuma caracterizar o acúmulo é você exercer funções de outro posto, claramente diferentes daquelas para as quais foi contratado."
    ],
    "passos": [
      {
        "titulo": "Liste suas tarefas reais",
        "texto": "Anote tudo o que você faz no dia a dia. Compare com a função para a qual foi contratado e identifique o que foge do combinado."
      },
      {
        "titulo": "Guarde provas do que você executa",
        "texto": "Reúna e-mails, ordens de serviço, mensagens e qualquer documento que mostre você realizando tarefas de outro cargo."
      },
      {
        "titulo": "Verifique se alguém deixou de ser substituído",
        "texto": "Se você assumiu o trabalho de um colega que saiu, isso reforça o acúmulo. Tente identificar quem fazia essas tarefas antes."
      },
      {
        "titulo": "Busque um advogado trabalhista",
        "texto": "Um profissional pode avaliar se cabe pedir um adicional de salário e calcular as diferenças do período em que você acumulou funções."
      }
    ],
    "direitos": [
      "Possibilidade de receber um valor adicional pelo acúmulo de função, dependendo das tarefas e do contrato.",
      "Direito de cobrar as diferenças relativas ao período em que executou as funções extras.",
      "Direito de ter as suas atividades reais reconhecidas, e não apenas o cargo formal anotado na carteira.",
      "Possibilidade de o acordo ou a convenção coletiva da sua categoria prever regras específicas sobre esse adicional."
    ],
    "quando_urgente": "Procure um advogado com mais urgência se você está perto de ser demitido ou de pedir as contas, porque há prazos para cobrar valores do passado e parte deles pode acabar prescrevendo. Também vale agir rápido se a sobrecarga está prejudicando a sua saúde, pois isso pode envolver outros direitos além do acúmulo de função.",
    "documentos": [
      "Carteira de trabalho ou contrato com o cargo e as funções para os quais você foi contratado",
      "E-mails, mensagens e ordens de serviço que mostram suas tarefas reais",
      "Organograma ou descrição de cargos da empresa, se houver",
      "Contracheques com o seu salário atual",
      "Convenção ou acordo coletivo da sua categoria"
    ],
    "faq": [
      {
        "q": "Toda tarefa a mais dá direito a adicional de acúmulo de função?",
        "a": "Não. Algumas atividades já fazem parte do cargo. O direito costuma surgir quando você passa a exercer funções claramente de outro posto, e não apenas pequenas tarefas extras."
      },
      {
        "q": "Posso me recusar a fazer o trabalho de outro cargo?",
        "a": "Depende da situação. Recusar sozinho pode gerar conflito com a empresa. O mais seguro é registrar o acúmulo e procurar orientação antes de tomar qualquer decisão."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "trabalho-por-aplicativo-e-quero-saber-meus-direitos",
    "titulo": "Trabalho por aplicativo. Quais são os meus direitos?",
    "intencao_curta": "Entender de forma simples a sua situação e seus possíveis direitos ao trabalhar por aplicativos de transporte ou entrega.",
    "resumo": "O trabalho por aplicativo, como motorista ou entregador, é um tema em discussão na Justiça e nas leis do Brasil. Hoje muitas pessoas atuam como autônomas, mas há casos em que a Justiça reconhece vínculo de emprego, dependendo de como o trabalho acontece na prática. Como o assunto ainda está mudando, vale conhecer sua situação e, em caso de dúvida ou problema, procurar orientação jurídica.",
    "areas": [
      "trabalhista"
    ],
    "situacao": [
      "Quem trabalha por aplicativo costuma se cadastrar na plataforma, usar o próprio veículo ou bicicleta e receber por corrida ou entrega. A empresa do aplicativo, em geral, trata o trabalhador como parceiro autônomo, e não como empregado com carteira assinada.",
      "Na prática, porém, o dia a dia pode se parecer com o de um emprego comum. O aplicativo define preços, avalia o desempenho, pode bloquear a conta e estabelece regras que o trabalhador precisa seguir. Por causa disso, surgem muitas discussões sobre se existe ou não vínculo de emprego.",
      "Esse é um dos assuntos mais debatidos atualmente nos tribunais brasileiros, e ainda não há uma resposta única para todos os casos. O reconhecimento de direitos costuma depender dos detalhes de cada situação, como o grau de controle exercido pela plataforma sobre o trabalho."
    ],
    "passos": [
      {
        "titulo": "Guarde seus registros do aplicativo",
        "texto": "Salve prints de corridas, entregas, ganhos e mensagens da plataforma. Esses dados ajudam a mostrar como era o seu trabalho no dia a dia."
      },
      {
        "titulo": "Anote regras e bloqueios",
        "texto": "Registre quando o aplicativo impôs regras, metas, punições ou bloqueou a sua conta. Isso é importante para discutir o nível de controle da empresa."
      },
      {
        "titulo": "Cuide da sua proteção previdenciária",
        "texto": "Mesmo como autônomo, você pode contribuir para o INSS para garantir cobertura em caso de doença, acidente ou aposentadoria no futuro."
      },
      {
        "titulo": "Procure orientação jurídica",
        "texto": "Como o tema está em mudança, um advogado trabalhista pode avaliar se, no seu caso, há base para pedir reconhecimento de vínculo e direitos."
      }
    ],
    "direitos": [
      "Possibilidade de buscar o reconhecimento de vínculo de emprego na Justiça, dependendo de como o trabalho acontece.",
      "Caso o vínculo seja reconhecido, direito a verbas trabalhistas como férias, décimo terceiro e FGTS.",
      "Direito de contribuir para o INSS e ter proteção previdenciária, mesmo atuando como autônomo.",
      "Direito de questionar bloqueios ou descontos que considerar abusivos por parte da plataforma."
    ],
    "quando_urgente": "Procure um advogado com urgência se a sua conta foi bloqueada de repente e essa era a sua principal fonte de renda, ou se você sofreu um acidente durante o trabalho e ficou sem amparo. Nessas situações pode haver direitos a proteger e prazos a respeitar, por isso é importante buscar orientação o quanto antes.",
    "documentos": [
      "Prints das telas do aplicativo com corridas, entregas e ganhos",
      "Comprovantes de pagamento ou repasses recebidos da plataforma",
      "Mensagens, notificações e regras enviadas pelo aplicativo",
      "Eventual comprovante de bloqueio ou desligamento da conta",
      "Comprovantes de contribuição ao INSS, se você já contribui"
    ],
    "faq": [
      {
        "q": "Quem trabalha por aplicativo tem carteira assinada?",
        "a": "Em geral, não. As plataformas costumam tratar o trabalhador como autônomo. Mas, dependendo do caso, a Justiça pode reconhecer vínculo de emprego com base na forma como o trabalho era feito."
      },
      {
        "q": "Se eu me acidentar trabalhando, tenho algum amparo?",
        "a": "Se você contribui para o INSS como autônomo, pode ter acesso a benefícios. Caso busque o reconhecimento de vínculo, podem existir outros direitos. Vale procurar orientação para o seu caso."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "quero-reconhecer-uniao-estavel",
    "titulo": "Vivo junto com meu parceiro e quero reconhecer a união estável. Como faço?",
    "intencao_curta": "Saber o que é união estável, para que serve reconhecê-la e como formalizar essa relação.",
    "resumo": "A união estável é a convivência de um casal de forma pública, contínua e duradoura, com a intenção de constituir família. Ela existe mesmo sem papel, mas formalizar o reconhecimento traz segurança para questões como bens, herança, plano de saúde e benefícios. O reconhecimento pode ser feito em cartório, de forma amigável, ou pela Justiça quando há divergência ou necessidade de prova.",
    "areas": [
      "familia"
    ],
    "situacao": [
      "A união estável costuma se formar de maneira natural, quando o casal passa a viver junto e a se apresentar para a família e a sociedade como companheiros. Não existe um tempo mínimo fixo definido em lei de forma rígida; o que importa é a relação ser pública, contínua e com vontade de formar uma família.",
      "Muitos casais só pensam em reconhecer a união quando surge uma necessidade prática, como incluir o companheiro no plano de saúde, comprar um imóvel juntos, garantir direitos previdenciários ou organizar a partilha de bens. Outras vezes, o reconhecimento é buscado depois do fim da relação ou do falecimento de um dos dois.",
      "Reconhecer a união estável serve justamente para dar segurança jurídica ao casal e provar que aquela convivência realmente existiu, evitando dúvidas e conflitos no futuro, especialmente sobre bens e herança."
    ],
    "passos": [
      {
        "titulo": "Reúna provas da convivência",
        "texto": "Junte documentos que mostrem a vida em comum, como contas no mesmo endereço, fotos e contas bancárias conjuntas."
      },
      {
        "titulo": "Avalie a escritura em cartório",
        "texto": "Se os dois concordam, é possível fazer uma escritura de união estável em cartório, de forma rápida e amigável."
      },
      {
        "titulo": "Pense no regime de bens",
        "texto": "Vocês podem definir como os bens serão tratados na relação. Um advogado ajuda a escolher a opção mais adequada para o casal."
      },
      {
        "titulo": "Busque a Justiça se houver conflito",
        "texto": "Quando não há acordo, ou quando o reconhecimento é necessário para garantir herança ou benefício, o caminho pode ser uma ação judicial."
      }
    ],
    "direitos": [
      "Direito à partilha dos bens adquiridos durante a união, conforme o regime de bens aplicável.",
      "Possibilidade de incluir o companheiro como dependente em plano de saúde e em benefícios previdenciários.",
      "Direitos sucessórios, ou seja, possibilidade de participar da herança em caso de falecimento do companheiro.",
      "Direito de definir, em escritura, regras sobre bens e outros aspectos da convivência do casal."
    ],
    "quando_urgente": "Procure um advogado com urgência se o seu companheiro faleceu e você precisa comprovar a união para ter acesso à herança ou à pensão por morte, ou se houve uma separação e existem bens e dívidas a partilhar. Também é importante agir rápido se há risco de bens serem vendidos ou transferidos sem o seu conhecimento.",
    "documentos": [
      "Documentos pessoais dos dois companheiros (RG e CPF)",
      "Comprovantes de endereço em comum",
      "Fotos, conversas e registros que demonstrem a relação pública e duradoura",
      "Comprovantes de contas, financiamentos ou bens adquiridos juntos",
      "Declarações de pessoas que conhecem o casal, se necessário"
    ],
    "faq": [
      {
        "q": "Preciso de um tempo mínimo de convivência para ter união estável?",
        "a": "Não existe um prazo rígido na lei. O que importa é a relação ser pública, contínua e duradoura, com a intenção de formar família. O tempo é apenas um dos elementos analisados."
      },
      {
        "q": "União estável é a mesma coisa que casamento?",
        "a": "São situações parecidas, mas não idênticas. A união estável traz muitos direitos semelhantes aos do casamento, porém tem formas próprias de reconhecimento e de comprovação."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "quero-dissolver-uniao-estavel",
    "titulo": "Quero terminar minha união estável de forma oficial. Como funciona?",
    "intencao_curta": "Entender como encerrar formalmente uma união estável e organizar bens, pensão e filhos.",
    "resumo": "Assim como a união estável pode ser reconhecida, ela também pode ser dissolvida quando a relação acaba. A dissolução serve para deixar claro que a convivência terminou e para organizar a partilha de bens, a guarda dos filhos e eventual pensão. Quando há acordo, o processo costuma ser mais simples; quando há conflito, pode ser necessário recorrer à Justiça.",
    "areas": [
      "familia"
    ],
    "situacao": [
      "A dissolução da união estável costuma ser buscada quando o relacionamento chega ao fim e o casal precisa definir o que acontece com o que construíram juntos. Mesmo sem ter feito papel no início, a relação que existiu de fato gera efeitos que precisam ser resolvidos.",
      "Os pontos mais comuns a tratar são a divisão dos bens adquiridos durante a união, as dívidas em conjunto, a guarda e a convivência com os filhos e a possibilidade de pensão alimentícia. Cada um desses temas pode ser combinado de forma amigável ou disputado na Justiça.",
      "Quando os dois concordam com tudo, a dissolução pode ser feita de maneira mais rápida, às vezes em cartório. Quando há divergência sobre bens, filhos ou valores, o caminho normalmente é uma ação judicial para que o juiz decida."
    ],
    "passos": [
      {
        "titulo": "Liste bens e dívidas",
        "texto": "Faça uma relação do que foi adquirido durante a união e das dívidas em comum. Isso facilita organizar a partilha."
      },
      {
        "titulo": "Defina a situação dos filhos",
        "texto": "Pense em guarda, convivência e pensão. O bem-estar das crianças deve ser sempre a prioridade nas decisões."
      },
      {
        "titulo": "Tente um acordo",
        "texto": "Se houver entendimento entre os dois, a dissolução tende a ser mais rápida e menos desgastante, podendo ser feita em cartório."
      },
      {
        "titulo": "Procure um advogado",
        "texto": "Um profissional orienta sobre o melhor caminho, protege os seus direitos e conduz o processo, principalmente se houver conflito."
      }
    ],
    "direitos": [
      "Direito à partilha dos bens adquiridos durante a união, conforme o regime de bens aplicável.",
      "Possibilidade de pedir pensão alimentícia para os filhos e, em certos casos, para o próprio companheiro.",
      "Direito de discutir a guarda e a convivência com os filhos do casal.",
      "Direito de formalizar o fim da união para encerrar obrigações e evitar problemas futuros com bens e dívidas."
    ],
    "quando_urgente": "Procure um advogado com urgência se houver risco de o outro vender ou esconder bens, se você ficou sem sustento e há filhos para cuidar, ou se existe qualquer situação de violência ou ameaça. Nesses casos, medidas rápidas podem ser necessárias para proteger você, os filhos e o patrimônio do casal.",
    "documentos": [
      "Documentos pessoais dos dois companheiros (RG e CPF)",
      "Eventual escritura ou prova do reconhecimento da união estável",
      "Documentos dos bens, financiamentos e dívidas do casal",
      "Certidões de nascimento dos filhos, se houver",
      "Comprovantes de renda dos dois, úteis para discutir pensão"
    ],
    "faq": [
      {
        "q": "Preciso ir à Justiça para terminar a união estável?",
        "a": "Nem sempre. Se houver acordo e não houver filhos menores em certas situações, a dissolução pode ser feita em cartório. Com conflito ou filhos menores, costuma ser necessária a Justiça."
      },
      {
        "q": "Como ficam os bens depois da dissolução?",
        "a": "Em geral, os bens adquiridos durante a união são partilhados conforme o regime de bens. Os detalhes dependem de cada caso, por isso vale a orientação de um advogado."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "quero-reconhecer-a-paternidade-do-meu-filho",
    "titulo": "Quero que meu filho tenha o nome do pai no registro. Como reconhecer a paternidade?",
    "intencao_curta": "Saber como reconhecer a paternidade de uma criança e quais direitos isso garante a ela.",
    "resumo": "O reconhecimento de paternidade é o ato de oficializar quem é o pai de uma criança, fazendo o nome dele constar no registro de nascimento. Pode ser feito de forma voluntária, quando o pai concorda, ou pela Justiça, quando ele se recusa ou há dúvida, geralmente com exame de DNA. Reconhecer a paternidade garante à criança direitos importantes, como nome, pensão e herança.",
    "areas": [
      "familia"
    ],
    "situacao": [
      "Muitas vezes a criança é registrada apenas com o nome da mãe, seja porque o pai não quis reconhecer na hora, seja porque o casal se separou antes do nascimento ou havia dúvida sobre a paternidade. Com o tempo, a mãe ou o próprio filho podem querer incluir o nome do pai no registro.",
      "O reconhecimento pode acontecer de maneira amigável, quando o pai comparece ao cartório e assume a paternidade de forma espontânea. Nesse caso, o processo costuma ser simples e rápido, bastando a manifestação da vontade dele.",
      "Quando o suposto pai se recusa a reconhecer ou nega ser o pai, é possível buscar a Justiça por meio de uma ação de investigação de paternidade. Nesses casos, costuma ser feito o exame de DNA para esclarecer o vínculo entre o suposto pai e a criança."
    ],
    "passos": [
      {
        "titulo": "Tente o reconhecimento amigável",
        "texto": "Se o pai concorda, ele pode ir ao cartório e reconhecer a paternidade. É o caminho mais simples e rápido."
      },
      {
        "titulo": "Reúna informações sobre o pai",
        "texto": "Anote nome completo, endereço e outros dados do suposto pai. Isso é importante caso seja necessário ir à Justiça."
      },
      {
        "titulo": "Considere a ação de investigação",
        "texto": "Se houver recusa ou dúvida, é possível ajuizar uma ação de investigação de paternidade, normalmente com exame de DNA."
      },
      {
        "titulo": "Procure orientação jurídica",
        "texto": "Um advogado ou a Defensoria Pública pode orientar sobre o processo e ajudar a garantir os direitos da criança."
      }
    ],
    "direitos": [
      "Direito da criança de ter o nome do pai no registro de nascimento.",
      "Direito a pensão alimentícia, para ajudar no sustento e nas necessidades do filho.",
      "Direitos sucessórios, ou seja, possibilidade de participar da herança do pai.",
      "Direito de buscar o reconhecimento a qualquer tempo, já que ele não tem prazo para ser pedido."
    ],
    "quando_urgente": "Procure orientação com mais urgência quando a criança precisa de sustento imediato e o pai não ajuda, pois é possível pedir pensão alimentícia junto com o reconhecimento. Também vale agir rápido em situações de doença grave ou questões de herança, em que comprovar o vínculo o quanto antes pode ser essencial para proteger os direitos do filho.",
    "documentos": [
      "Certidão de nascimento atual da criança",
      "Documentos pessoais da mãe (RG e CPF)",
      "Informações e documentos sobre o suposto pai, como nome e endereço",
      "Mensagens, fotos ou testemunhas que indiquem o relacionamento com o suposto pai",
      "Comprovantes de despesas da criança, úteis para o pedido de pensão"
    ],
    "faq": [
      {
        "q": "O pai é obrigado a fazer o exame de DNA?",
        "a": "Ninguém é forçado fisicamente a fazer o exame. Porém, se o suposto pai se recusa sem motivo, a Justiça pode presumir a paternidade com base nessa recusa e nas demais provas."
      },
      {
        "q": "Existe prazo para reconhecer a paternidade?",
        "a": "Não. O reconhecimento e a investigação de paternidade podem ser buscados a qualquer tempo, inclusive pelo próprio filho quando se torna adulto."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "quero-mudar-de-cidade-com-meu-filho-e-o-outro-genitor-nao-concorda",
    "titulo": "Quero mudar de cidade com meu filho e o outro genitor não concorda. O que fazer?",
    "intencao_curta": "Entender como mudar de cidade com o filho quando o outro pai ou mãe é contra.",
    "resumo": "Mudar de cidade com um filho menor mexe diretamente com a convivência da criança com o outro genitor. Por isso, quando não há acordo, em geral é preciso autorização judicial. A decisão sempre leva em conta o melhor interesse da criança, e não apenas a vontade de um dos pais. Procure um advogado para analisar o seu caso.",
    "areas": [
      "familia"
    ],
    "situacao": [
      "É muito comum surgir esse impasse quando um dos pais precisa se mudar por causa de um novo emprego, de um recasamento, da proximidade da família de apoio ou de uma melhor condição de vida. O problema aparece quando essa mudança aumenta a distância e dificulta a convivência da criança com o outro genitor.",
      "Quando os pais têm guarda compartilhada ou existe um regime de visitas definido, nenhum deles pode simplesmente levar a criança para outra cidade por conta própria. Mudar sem acordo ou sem autorização pode ser visto como descumprimento da decisão judicial e até prejudicar quem se mudou.",
      "Se não há consenso, a solução costuma ser levar o caso à Justiça. O juiz vai avaliar se a mudança beneficia ou prejudica a criança e poderá readequar o convívio, por exemplo, concentrando as visitas em férias e feriados prolongados."
    ],
    "passos": [
      {
        "titulo": "Tente um acordo primeiro",
        "texto": "Converse com o outro genitor e proponha um novo formato de convivência que compense a distância. Um acordo registrado por escrito evita conflitos futuros."
      },
      {
        "titulo": "Reúna as razões da mudança",
        "texto": "Junte provas de que a mudança é positiva para a criança, como proposta de emprego, escola na nova cidade e rede de apoio familiar."
      },
      {
        "titulo": "Procure um advogado ou a Defensoria",
        "texto": "Um profissional vai orientar se cabe um pedido de autorização judicial ou de modificação da guarda e das visitas. A Defensoria atende quem não pode pagar."
      },
      {
        "titulo": "Não se mude por conta própria",
        "texto": "Aguarde o acordo ou a decisão judicial antes de mudar com a criança, para não ser acusado de descumprir o que já foi combinado."
      }
    ],
    "direitos": [
      "A criança tem direito de conviver com os dois pais, mesmo após uma mudança de cidade.",
      "Qualquer dos pais pode pedir à Justiça autorização para mudar ou a revisão do regime de convivência.",
      "A decisão deve sempre priorizar o melhor interesse da criança, e não a conveniência de um dos pais.",
      "É possível propor um novo calendário de visitas, com períodos maiores em férias e feriados, para compensar a distância."
    ],
    "quando_urgente": "Procure um advogado com urgência se você precisa decidir a mudança em pouco tempo, se há risco à segurança da criança no ambiente atual ou se o outro genitor está ameaçando levar ou impedir a criança de viajar. Nessas situações, agir rápido na Justiça pode ser essencial.",
    "documentos": [
      "Certidão de nascimento da criança",
      "Documento que mostre a guarda e o regime de visitas atual, se já houver",
      "Comprovantes do motivo da mudança (proposta de emprego, contrato de aluguel, matrícula escolar)",
      "Comprovante de endereço atual e do novo endereço pretendido",
      "Mensagens ou registros que mostrem a tentativa de acordo com o outro genitor"
    ],
    "faq": [
      {
        "q": "Posso mudar de cidade com meu filho sem avisar o outro genitor?",
        "a": "Não é recomendável. Quando há guarda compartilhada ou visitas definidas, mudar sem acordo ou autorização da Justiça pode ser considerado descumprimento da decisão e prejudicar você no processo."
      },
      {
        "q": "O juiz pode proibir a mudança?",
        "a": "Pode, se entender que a mudança prejudica a criança. Mas também pode autorizar e apenas reorganizar as visitas. Tudo depende do que for melhor para o filho no caso concreto."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "sofro-alienacao-parental",
    "titulo": "Sofro alienação parental. Como posso me proteger e proteger meu filho?",
    "intencao_curta": "Saber o que é alienação parental e como reagir quando um genitor afasta o filho do outro.",
    "resumo": "A alienação parental acontece quando um dos pais, ou outro parente, tenta afastar a criança do outro genitor com mentiras, chantagens ou obstáculos à convivência. Isso prejudica a criança e pode ser combatido na Justiça. Em muitos casos é possível tomar medidas para restaurar o convívio. Procure um advogado para avaliar o seu caso.",
    "areas": [
      "familia"
    ],
    "situacao": [
      "A alienação parental costuma surgir após uma separação conflituosa. Um dos pais passa a falar mal do outro para a criança, inventa histórias, dificulta as visitas, marca compromissos nos dias de convivência ou faz o filho se sentir culpado por gostar do outro genitor.",
      "Com o tempo, a criança pode começar a rejeitar o pai ou a mãe sem motivo real, repetindo falas do adulto que a manipula. Esse afastamento causa sofrimento emocional e atrapalha o desenvolvimento saudável da criança.",
      "A lei brasileira reconhece a alienação parental como uma conduta grave. Quando comprovada, a Justiça pode aplicar medidas que vão desde advertência até a mudança da guarda, sempre buscando proteger o vínculo da criança com os dois pais."
    ],
    "passos": [
      {
        "titulo": "Registre os episódios",
        "texto": "Anote datas, horários e situações em que a convivência foi impedida ou em que houve manipulação. Guarde mensagens e qualquer prova do que aconteceu."
      },
      {
        "titulo": "Tente manter o convívio",
        "texto": "Continue buscando estar presente na vida do filho, mesmo diante das dificuldades. Evite revidar falando mal do outro genitor."
      },
      {
        "titulo": "Procure apoio profissional",
        "texto": "Um advogado pode pedir medidas à Justiça, e o acompanhamento psicológico ajuda a criança e a família a lidarem com o conflito."
      },
      {
        "titulo": "Leve o caso à Justiça",
        "texto": "É possível pedir que o juiz reconheça a alienação parental e tome providências, como reforço das visitas ou revisão da guarda."
      }
    ],
    "direitos": [
      "A criança tem direito de conviver livremente com os dois pais, sem ser manipulada contra um deles.",
      "O genitor prejudicado pode pedir à Justiça medidas para fazer cessar a alienação parental.",
      "O juiz pode determinar acompanhamento psicológico, multa, advertência ou até a alteração da guarda.",
      "É possível solicitar perícia (estudo psicossocial) para comprovar a alienação parental."
    ],
    "quando_urgente": "Procure ajuda com urgência se você está sendo totalmente impedido de ver seu filho, se a criança está sendo exposta a falas ou ações que ameacem sua saúde emocional, ou se há risco de o outro genitor sumir com a criança. Quanto antes a Justiça agir, mais fácil é preservar o vínculo.",
    "documentos": [
      "Certidão de nascimento da criança",
      "Decisão judicial sobre guarda e visitas, se já existir",
      "Mensagens, e-mails ou áudios que mostrem a manipulação ou o impedimento das visitas",
      "Registro de datas e situações em que a convivência foi prejudicada",
      "Eventuais relatórios escolares ou psicológicos sobre a criança"
    ],
    "faq": [
      {
        "q": "Como eu provo a alienação parental?",
        "a": "Reunindo provas como mensagens, testemunhas e registros das visitas impedidas. Na Justiça, é comum o juiz determinar um estudo psicossocial feito por psicólogos e assistentes sociais para avaliar a situação."
      },
      {
        "q": "A guarda pode mudar por causa da alienação parental?",
        "a": "Sim. Em casos mais graves, quando comprovada a alienação, o juiz pode alterar a guarda em favor do genitor prejudicado, sempre pensando no melhor interesse da criança."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "quero-adotar-uma-crianca",
    "titulo": "Quero adotar uma criança. Como começar o processo de adoção?",
    "intencao_curta": "Entender os primeiros passos e as exigências para adotar uma criança no Brasil.",
    "resumo": "A adoção no Brasil é um processo feito pela Justiça, gratuito e seguro, que busca dar uma família a quem precisa. Para adotar, é preciso se cadastrar, passar por avaliação e aguardar a habilitação. Cada caso tem seu tempo e suas etapas. Procure a Vara da Infância e um advogado para orientar o seu pedido.",
    "areas": [
      "familia"
    ],
    "situacao": [
      "Muitas pessoas e casais desejam adotar para formar ou aumentar a família, seja por não poderem ter filhos biológicos, seja por escolha de acolher uma criança ou adolescente que precisa de um lar.",
      "A adoção não é um acordo particular entre pessoas. Ela passa obrigatoriamente pela Justiça, que avalia se o pretendente tem condições de oferecer um ambiente saudável e seguro. Por isso existe um cadastro nacional de adoção.",
      "O processo envolve etapas como inscrição, entrevistas, cursos preparatórios e avaliação por equipe técnica. Depois de habilitado, o pretendente entra em uma fila e aguarda a indicação de uma criança compatível com o perfil informado."
    ],
    "passos": [
      {
        "titulo": "Procure a Vara da Infância",
        "texto": "Vá até a Vara da Infância e Juventude da sua cidade para iniciar a inscrição e receber as orientações sobre os documentos necessários."
      },
      {
        "titulo": "Faça o cadastro e a habilitação",
        "texto": "Você passará por entrevistas, avaliação psicossocial e, em geral, por um curso preparatório antes de ser considerado apto a adotar."
      },
      {
        "titulo": "Aguarde a indicação",
        "texto": "Após a habilitação, seu nome entra no cadastro e você aguarda a indicação de uma criança que tenha o perfil que você informou."
      },
      {
        "titulo": "Acompanhe o estágio de convivência",
        "texto": "Antes da adoção definitiva, há um período de convivência para confirmar a adaptação entre você e a criança, acompanhado pela Justiça."
      }
    ],
    "direitos": [
      "Qualquer pessoa maior de 18 anos, independentemente do estado civil, pode se habilitar para adotar.",
      "O processo de adoção pela Justiça é gratuito e seguro.",
      "A criança adotada tem exatamente os mesmos direitos de um filho biológico, inclusive de herança.",
      "Casais e pessoas solteiras podem adotar, sem distinção, desde que cumpram os requisitos legais."
    ],
    "quando_urgente": "Procure orientação com urgência se você já tem um vínculo afetivo com uma criança e quer regularizar a situação, ou se alguém ofereceu uma criança fora dos canais oficiais. A chamada adoção feita por fora da Justiça é arriscada e pode ser considerada crime, por isso é essencial buscar a Vara da Infância e um advogado.",
    "documentos": [
      "Documento de identidade e CPF dos pretendentes",
      "Certidão de nascimento ou de casamento",
      "Comprovante de residência",
      "Comprovante de renda ou de trabalho",
      "Certidões negativas (antecedentes criminais) e atestado de saúde física e mental"
    ],
    "faq": [
      {
        "q": "Quanto tempo demora para adotar uma criança?",
        "a": "Não há prazo fixo. O tempo varia conforme o perfil de criança que o pretendente aceita e a fila de habilitados. Quanto mais amplo o perfil, em geral menor a espera."
      },
      {
        "q": "Pessoa solteira pode adotar?",
        "a": "Sim. Tanto pessoas solteiras quanto casais podem adotar. O que a Justiça avalia é a capacidade de oferecer um ambiente seguro e afetivo à criança."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "como-funciona-a-partilha-de-bens-no-divorcio",
    "titulo": "Como funciona a partilha de bens no divórcio?",
    "intencao_curta": "Entender como os bens do casal são divididos quando o casamento ou a união termina.",
    "resumo": "Na separação, os bens do casal são divididos conforme o regime escolhido no casamento ou na união estável. Em muitos casos, divide-se apenas o que foi adquirido durante a relação. Saber qual é o seu regime é o primeiro passo para entender o que cabe a você. Procure um advogado para analisar a sua situação.",
    "areas": [
      "familia"
    ],
    "situacao": [
      "A dúvida sobre a partilha costuma aparecer no momento do divórcio ou do fim da união estável, quando o casal precisa decidir como dividir casa, carro, dinheiro, dívidas e outros bens.",
      "O ponto central é o regime de bens. No regime mais comum, a comunhão parcial, divide-se em geral o que foi adquirido durante o casamento, enquanto o que cada um já tinha antes ou recebeu por herança costuma ficar de fora. Existem ainda outros regimes, como a comunhão total e a separação de bens.",
      "Quando há acordo, a partilha pode ser feita de forma mais rápida, às vezes até em cartório. Sem acordo, a divisão é decidida pela Justiça, o que costuma tornar o processo mais demorado."
    ],
    "passos": [
      {
        "titulo": "Descubra o seu regime de bens",
        "texto": "Verifique na certidão de casamento qual é o regime adotado. Ele define o que entra ou não na divisão."
      },
      {
        "titulo": "Liste os bens e as dívidas",
        "texto": "Faça uma relação de tudo o que o casal possui e deve, com os documentos que comprovem quando cada bem foi adquirido."
      },
      {
        "titulo": "Tente um acordo",
        "texto": "Um acordo sobre a divisão torna o processo mais rápido e barato, podendo ser feito até em cartório quando não há filhos menores envolvidos."
      },
      {
        "titulo": "Procure um advogado",
        "texto": "O profissional vai orientar como fazer a partilha de forma justa e formalizar o divórcio na Justiça ou em cartório."
      }
    ],
    "direitos": [
      "Cada cônjuge tem direito à sua parte nos bens, conforme o regime de bens adotado.",
      "Em regra, dívidas feitas em benefício da família também entram na divisão.",
      "É possível fazer o divórcio e a partilha de forma consensual, de maneira mais rápida.",
      "A partilha pode ser discutida separadamente, sem impedir que o divórcio seja decretado antes."
    ],
    "quando_urgente": "Procure um advogado com urgência se houver risco de o outro cônjuge vender, esconder ou transferir bens antes da partilha, ou se você depende financeiramente desses bens. Nessas situações, é possível pedir à Justiça medidas para proteger o patrimônio enquanto a divisão não é concluída.",
    "documentos": [
      "Certidão de casamento ou prova da união estável",
      "Documentos dos bens (escritura do imóvel, documento do carro, extratos bancários)",
      "Comprovantes da data de aquisição de cada bem",
      "Comprovantes de dívidas e financiamentos do casal",
      "Documentos pessoais de identidade e CPF"
    ],
    "faq": [
      {
        "q": "Tudo o que o casal tem é sempre dividido pela metade?",
        "a": "Nem sempre. Depende do regime de bens. Na comunhão parcial, em geral divide-se apenas o que foi adquirido durante o casamento, e não o que cada um já tinha antes ou recebeu por herança."
      },
      {
        "q": "Posso me divorciar antes de resolver a partilha?",
        "a": "Sim. É possível decretar o divórcio primeiro e discutir a divisão dos bens depois. Assim, você não precisa esperar a partilha terminar para ficar oficialmente divorciado."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "tenho-direito-a-pensao-do-meu-ex-companheiro",
    "titulo": "Tenho direito a pensão do meu ex-companheiro?",
    "intencao_curta": "Saber em quais situações é possível receber pensão alimentícia do ex-companheiro ou ex-cônjuge.",
    "resumo": "Em alguns casos, quem se separa pode ter direito a pensão alimentícia do ex-companheiro ou ex-cônjuge, principalmente quando há dependência financeira. Em geral, esse apoio é temporário, até a pessoa conseguir se manter sozinha. Cada caso é avaliado de forma individual. Procure um advogado para analisar a sua situação.",
    "areas": [
      "familia"
    ],
    "situacao": [
      "Essa dúvida costuma surgir quando, durante a relação, uma das pessoas se dedicou ao lar e aos filhos enquanto a outra sustentava a casa. Ao fim do relacionamento, quem ficou sem renda pode enfrentar dificuldades para se manter.",
      "A pensão entre ex-companheiros, chamada de pensão alimentícia entre cônjuges, não é automática. Ela depende de a pessoa comprovar que precisa do valor e de que o outro tem condições de pagar.",
      "Em muitos casos, esse apoio é fixado por tempo determinado, funcionando como uma ajuda para que a pessoa se reorganize, estude ou volte ao mercado de trabalho. É diferente da pensão dos filhos, que segue regras próprias."
    ],
    "passos": [
      {
        "titulo": "Avalie sua necessidade",
        "texto": "Verifique se você realmente depende financeiramente do ex-companheiro e se não tem, no momento, como prover seu próprio sustento."
      },
      {
        "titulo": "Reúna provas da relação",
        "texto": "Junte documentos que comprovem o casamento ou a união estável e o tempo de convivência, além de provas da sua situação financeira."
      },
      {
        "titulo": "Procure um advogado ou a Defensoria",
        "texto": "Um profissional vai avaliar se cabe o pedido de pensão e qual valor pode ser pleiteado conforme as suas necessidades e as condições do outro."
      },
      {
        "titulo": "Faça o pedido na Justiça",
        "texto": "Se não houver acordo, a pensão pode ser pedida judicialmente, onde o juiz decide o valor e por quanto tempo será paga."
      }
    ],
    "direitos": [
      "Quem comprova necessidade pode ter direito a pensão alimentícia do ex-cônjuge ou ex-companheiro.",
      "O valor é definido conforme a necessidade de quem pede e a possibilidade de quem paga.",
      "A pensão entre ex-companheiros, em muitos casos, é temporária, até a pessoa poder se sustentar.",
      "É possível pedir a revisão ou o fim da pensão se a situação financeira de qualquer um mudar."
    ],
    "quando_urgente": "Procure ajuda com urgência se você ficou sem nenhuma renda após a separação e não tem como pagar despesas básicas, como moradia, alimentação e saúde. Nessas situações, é possível pedir alimentos provisórios, que são definidos rapidamente pela Justiça para garantir o seu sustento até a decisão final.",
    "documentos": [
      "Certidão de casamento ou prova da união estável",
      "Comprovantes de renda e despesas atuais",
      "Documentos que mostrem a capacidade financeira do ex-companheiro",
      "Provas do tempo de convivência e da dependência financeira",
      "Documentos pessoais de identidade e CPF"
    ],
    "faq": [
      {
        "q": "Pensão entre ex-companheiros é para sempre?",
        "a": "Em geral, não. Costuma ser fixada por tempo determinado, como apoio até a pessoa conseguir se sustentar. Em situações especiais, como idade avançada ou doença, pode durar mais tempo."
      },
      {
        "q": "Quem trabalhava durante a união também pode pedir pensão?",
        "a": "Pode pedir, mas as chances dependem de comprovar necessidade. Se a pessoa tem renda suficiente para se sustentar, dificilmente terá direito à pensão do ex-companheiro."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "quero-regulamentar-a-visita-aos-meus-filhos",
    "titulo": "Quero regulamentar a visita aos meus filhos. Como definir os dias de convivência?",
    "intencao_curta": "Entender como estabelecer oficialmente os dias e horários de convivência com os filhos.",
    "resumo": "Quando os pais não moram juntos, é possível regulamentar a convivência para garantir que o filho passe tempo com os dois. Isso pode ser feito por acordo ou pela Justiça, sempre pensando no bem-estar da criança. Ter os dias definidos evita conflitos. Procure um advogado para organizar o seu caso.",
    "areas": [
      "familia"
    ],
    "situacao": [
      "A necessidade de regulamentar as visitas, hoje chamadas de regime de convivência, costuma aparecer após a separação, quando os pais não conseguem combinar de forma tranquila quando e como o filho ficará com cada um.",
      "Sem regras claras, é comum surgirem desentendimentos sobre fins de semana, feriados, férias e datas especiais. Isso prejudica a criança, que fica no meio do conflito dos pais.",
      "Regulamentar a convivência significa definir, por escrito, os dias e horários em que o filho ficará com cada genitor. Quando há acordo, o processo é simples; sem acordo, a Justiça define o regime, sempre levando em conta o melhor interesse da criança."
    ],
    "passos": [
      {
        "titulo": "Proponha um acordo",
        "texto": "Converse com o outro genitor e tente combinar um calendário de convivência que respeite a rotina e as necessidades da criança."
      },
      {
        "titulo": "Pense na rotina do filho",
        "texto": "Considere a escola, as atividades e a idade da criança ao definir os dias, para que a convivência seja saudável e tranquila."
      },
      {
        "titulo": "Formalize o combinado",
        "texto": "Registre o acordo por escrito. Um advogado pode ajudar a homologar na Justiça, dando força legal ao que foi combinado."
      },
      {
        "titulo": "Recorra à Justiça se não houver acordo",
        "texto": "Se não for possível combinar, peça ao juiz que defina o regime de convivência. A decisão deve garantir o convívio com os dois pais."
      }
    ],
    "direitos": [
      "A criança tem direito de conviver com os dois pais, mesmo que eles não morem juntos.",
      "Qualquer dos pais pode pedir à Justiça a regulamentação da convivência.",
      "O regime de convivência pode incluir fins de semana alternados, férias, feriados e datas especiais.",
      "É possível revisar o regime quando a rotina ou a necessidade da criança mudar."
    ],
    "quando_urgente": "Procure um advogado com urgência se você está sendo impedido de ver seu filho, se o outro genitor desaparece com a criança nos dias combinados ou se há risco à segurança dela durante a convivência. Nessas situações, a Justiça pode definir regras de forma rápida para proteger o vínculo e o bem-estar da criança.",
    "documentos": [
      "Certidão de nascimento da criança",
      "Documento sobre a guarda atual, se já existir",
      "Comprovante de residência dos pais",
      "Registro da rotina da criança (horário escolar e atividades)",
      "Mensagens que mostrem a tentativa de acordo sobre as visitas"
    ],
    "faq": [
      {
        "q": "Quem paga pensão também tem direito de conviver com o filho?",
        "a": "Sim. Pagar pensão e conviver com o filho são coisas diferentes e independentes. O direito de convivência existe mesmo que haja discussão sobre o valor da pensão."
      },
      {
        "q": "O outro genitor pode me impedir de ver meu filho?",
        "a": "Não pode impedir sem motivo justo. Se isso ocorrer, você pode procurar a Justiça para garantir a convivência. Impedir o contato sem razão pode até ser considerado alienação parental."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "banco-descontou-valores-da-conta-sem-autorizacao",
    "titulo": "O banco descontou valores da minha conta sem autorização. O que fazer?",
    "intencao_curta": "Entender o que fazer quando o banco retira dinheiro da conta sem você ter autorizado.",
    "resumo": "Quando o banco desconta valores da sua conta sem permissão, você tem direito de pedir explicação, exigir a devolução do dinheiro e, em muitos casos, ser indenizado. Veja como reagir, quais provas reunir e quando procurar ajuda jurídica.",
    "areas": [
      "consumidor",
      "civil"
    ],
    "situacao": [
      "É comum o cliente perceber, ao olhar o extrato, descontos que não reconhece: tarifas que nunca contratou, seguros embutidos, parcelas de produtos que não pediu ou débitos automáticos que nunca autorizou. Às vezes o valor é pequeno e se repete todo mês, passando despercebido por um bom tempo.",
      "Em outros casos, o banco retira de uma só vez uma quantia grande, alegando que está compensando uma dívida ou um empréstimo. O problema é que o banco não pode simplesmente se servir do seu saldo ou do seu salário sem uma autorização clara e específica sua.",
      "Esses descontos indevidos podem deixar a conta no vermelho, gerar juros e até atrapalhar o pagamento de contas essenciais. Por isso é importante agir rápido e guardar todas as provas."
    ],
    "passos": [
      {
        "titulo": "Reúna os extratos",
        "texto": "Localize no extrato a data, o valor e a descrição de cada desconto que você não reconhece. Imprima ou salve em PDF para não perder o registro."
      },
      {
        "titulo": "Conteste junto ao banco",
        "texto": "Abra uma reclamação formal pelo aplicativo, telefone ou agência e peça o número do protocolo. Exija a devolução e a explicação do desconto."
      },
      {
        "titulo": "Registre na ouvidoria e nos órgãos",
        "texto": "Se o banco não resolver, acione a ouvidoria, o Banco Central, o Procon e o portal consumidor.gov.br, sempre guardando os protocolos."
      },
      {
        "titulo": "Busque orientação jurídica",
        "texto": "Com as provas em mãos, um advogado pode avaliar pedido de devolução, muitas vezes em dobro, e indenização pelos transtornos."
      }
    ],
    "direitos": [
      "Direito de não ter descontos sem autorização clara e específica sua.",
      "Direito à devolução do valor cobrado de forma indevida, que em muitos casos pode ser em dobro.",
      "Direito à informação completa sobre a origem e o motivo de cada cobrança.",
      "Direito a indenização quando o desconto indevido causa prejuízo ou abala sua tranquilidade financeira."
    ],
    "quando_urgente": "Procure um advogado com urgência se o desconto tomou todo o seu salário ou benefício, se deixou você sem dinheiro para despesas essenciais, se os valores se repetem todo mês ou se o banco se recusa a devolver mesmo após a reclamação. Quanto antes você agir, mais fácil é reunir provas e evitar que o prejuízo aumente.",
    "documentos": [
      "Extratos bancários mostrando os descontos questionados",
      "Comprovantes ou números de protocolo das reclamações feitas ao banco",
      "Contratos ou termos que você assinou com o banco, se tiver",
      "Prints de conversas, e-mails ou mensagens com o atendimento",
      "Comprovante de salário ou benefício, caso o desconto tenha atingido esses valores"
    ],
    "faq": [
      {
        "q": "O banco pode descontar uma dívida direto da minha conta?",
        "a": "Em regra, não pode reter de forma automática o seu salário ou todo o seu saldo sem autorização específica. Existe muita discussão sobre isso, e um advogado pode avaliar se o desconto foi abusivo no seu caso."
      },
      {
        "q": "Tenho direito de receber o valor em dobro?",
        "a": "Em muitos casos de cobrança indevida o consumidor pode ter direito à devolução em dobro, mas isso depende das circunstâncias. A análise do caso concreto por um advogado é o que vai indicar o caminho."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "estou-sendo-cobrado-por-algo-que-nao-comprei",
    "titulo": "Estou sendo cobrado por algo que não comprei. Como me defender?",
    "intencao_curta": "Saber como reagir a uma cobrança de produto ou serviço que você nunca contratou.",
    "resumo": "Receber uma cobrança por algo que você nunca comprou é mais comum do que parece e pode virar até negativação do seu nome. Você não é obrigado a pagar o que não contratou e tem direito de exigir o cancelamento e, em muitos casos, indenização. Veja como agir.",
    "areas": [
      "consumidor",
      "civil"
    ],
    "situacao": [
      "Muitas pessoas são surpreendidas por boletos, faturas de cartão ou contas de serviços que nunca contrataram. Pode ser uma assinatura que apareceu do nada, uma compra feita em seu nome por terceiros ou um produto que a empresa diz que você pediu, mas você não reconhece.",
      "Em alguns casos, há fraude ou uso indevido dos seus dados; em outros, é um simples erro de cadastro ou cobrança duplicada da empresa. Independentemente do motivo, ninguém é obrigado a pagar por aquilo que não pediu nem recebeu.",
      "O perigo é deixar a cobrança correr: ela pode gerar juros, virar uma dívida e levar o seu nome para a lista de inadimplentes, prejudicando seu crédito mesmo sem culpa sua."
    ],
    "passos": [
      {
        "titulo": "Não pague por impulso",
        "texto": "Antes de pagar, confirme se a cobrança realmente é sua. Pagar pode ser entendido como reconhecimento da dívida e dificultar a contestação."
      },
      {
        "titulo": "Conteste formalmente",
        "texto": "Entre em contato com a empresa, informe que não reconhece a cobrança e peça o cancelamento por escrito, guardando o número do protocolo."
      },
      {
        "titulo": "Verifique seu nome e seus dados",
        "texto": "Consulte se há negativação no seu CPF e, se houver suspeita de fraude, registre um boletim de ocorrência para comprovar que não foi você."
      },
      {
        "titulo": "Procure um advogado se persistir",
        "texto": "Se a empresa insistir na cobrança ou negativar seu nome, um advogado pode pedir o cancelamento da dívida e indenização."
      }
    ],
    "direitos": [
      "Direito de não pagar por produto ou serviço que você não contratou.",
      "Direito de exigir prova de que a contratação realmente foi feita por você.",
      "Direito de ter o nome limpo, sem negativação por dívida que não é sua.",
      "Direito a indenização quando a cobrança indevida causa constrangimento ou negativação."
    ],
    "quando_urgente": "Procure um advogado com urgência se o seu nome já foi negativado, se você desconfia de fraude com seus documentos ou se a cobrança vem acompanhada de ameaça de protesto ou ação judicial. Agir rápido ajuda a limpar seu nome e a impedir que a situação prejudique compras, financiamentos e o seu crédito.",
    "documentos": [
      "A fatura, o boleto ou a notificação de cobrança recebida",
      "Comprovantes ou protocolos das tentativas de contestar a cobrança",
      "Consulta ou print mostrando se há negativação no seu CPF",
      "Boletim de ocorrência, caso suspeite de fraude ou uso indevido dos dados",
      "Documentos pessoais para comprovar que você não fez a contratação"
    ],
    "faq": [
      {
        "q": "Sou obrigado a provar que não comprei?",
        "a": "Não. Em relações de consumo, normalmente cabe à empresa provar que a contratação foi feita por você. Ainda assim, reunir documentos e registrar a contestação fortalece muito a sua defesa."
      },
      {
        "q": "Posso ser indenizado por uma cobrança que não é minha?",
        "a": "Em muitos casos sim, principalmente se houve negativação indevida ou constrangimento. O valor depende da situação concreta, e um advogado é quem poderá avaliar o seu caso."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "cancelei-um-servico-e-continuam-me-cobrando",
    "titulo": "Cancelei um serviço e continuam me cobrando. O que posso fazer?",
    "intencao_curta": "Entender como agir quando a empresa segue cobrando mesmo depois de você cancelar o serviço.",
    "resumo": "Cancelar um serviço e continuar recebendo cobranças é uma queixa muito frequente em planos, assinaturas e mensalidades. Você tem direito de parar os pagamentos a partir do cancelamento e de reaver o que pagou a mais. Veja como provar o cancelamento e se defender.",
    "areas": [
      "consumidor",
      "civil"
    ],
    "situacao": [
      "É comum a pessoa cancelar um plano de telefonia, internet, TV, academia ou assinatura digital e, mesmo assim, continuar recebendo cobranças nos meses seguintes. Às vezes a empresa alega que o pedido não foi registrado ou que existe uma fidelidade que impede o cancelamento.",
      "Em muitos casos, o consumidor pede o cancelamento por telefone ou pelo aplicativo e não recebe nenhum comprovante, o que depois dificulta provar que realmente solicitou. Enquanto isso, os boletos e os débitos automáticos continuam chegando.",
      "Se nada for feito, essas cobranças podem se acumular, gerar juros e até negativar o nome do cliente por uma dívida que não deveria existir."
    ],
    "passos": [
      {
        "titulo": "Guarde a prova do cancelamento",
        "texto": "Sempre peça o número do protocolo e, se possível, cancele por escrito (e-mail, chat ou aplicativo) para ter um comprovante claro da data."
      },
      {
        "titulo": "Suspenda o débito automático",
        "texto": "Avise o banco ou o cartão para bloquear novas cobranças daquela empresa e evite que o desconto continue acontecendo."
      },
      {
        "titulo": "Conteste e exija devolução",
        "texto": "Comunique a empresa por escrito que o serviço foi cancelado e cobre a devolução dos valores pagos após a data do cancelamento."
      },
      {
        "titulo": "Acione órgãos e advogado",
        "texto": "Se as cobranças não pararem, recorra ao Procon e ao consumidor.gov.br, e um advogado pode pedir a devolução e indenização."
      }
    ],
    "direitos": [
      "Direito de cancelar o serviço e de ter o cancelamento registrado pela empresa.",
      "Direito de não pagar por mensalidades posteriores à data do cancelamento.",
      "Direito à devolução dos valores cobrados depois que o serviço já havia sido cancelado.",
      "Direito a indenização se as cobranças indevidas gerarem negativação ou transtornos."
    ],
    "quando_urgente": "Procure um advogado com urgência se as cobranças continuarem mesmo após o cancelamento, se o seu nome for negativado ou se a empresa cortar de você outro serviço por causa dessa dívida indevida. Quanto antes você reunir as provas do cancelamento, mais fácil será interromper os descontos e recuperar o que foi pago a mais.",
    "documentos": [
      "Comprovante ou número de protocolo do pedido de cancelamento",
      "E-mails, prints de chat ou mensagens em que você solicitou o cancelamento",
      "Faturas e extratos mostrando as cobranças feitas após o cancelamento",
      "Contrato do serviço, especialmente as regras de fidelidade e cancelamento",
      "Comprovantes de pagamento dos valores cobrados indevidamente"
    ],
    "faq": [
      {
        "q": "A empresa pode me cobrar multa de fidelidade ao cancelar?",
        "a": "Em alguns contratos existe multa proporcional pelo cancelamento antes do prazo, mas ela deve ser clara e justa. Cobranças após o cancelamento já efetivado, porém, costumam ser indevidas. Um advogado pode avaliar o seu contrato."
      },
      {
        "q": "Como provo que pedi o cancelamento por telefone?",
        "a": "O número de protocolo é a prova principal, por isso sempre anote. Quando possível, prefira cancelar por escrito. Em relações de consumo, a empresa também pode ser obrigada a apresentar a gravação da ligação."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "o-produto-chegou-diferente-do-anunciado",
    "titulo": "O produto chegou diferente do anunciado. Quais são meus direitos?",
    "intencao_curta": "Saber o que fazer quando você recebe um produto que não corresponde ao que foi anunciado.",
    "resumo": "Quando o produto que chega é diferente do que foi anunciado, em cor, modelo, tamanho, marca ou características, você não precisa aceitar. A lei garante a você escolher entre receber o item correto, trocar, cancelar a compra ou ter o dinheiro de volta. Veja como agir.",
    "areas": [
      "consumidor",
      "civil"
    ],
    "situacao": [
      "Acontece bastante de a pessoa comprar pela internet confiando nas fotos e na descrição e receber algo diferente: outra cor, um modelo mais simples, tamanho errado, marca trocada ou um produto com menos funções do que o anunciado. A propaganda prometeu uma coisa e a entrega foi outra.",
      "Em alguns casos, a diferença é pequena; em outros, o produto não serve para o que a pessoa precisava. Há ainda situações em que o anúncio induz ao erro de propósito, destacando vantagens que o item entregue não tem.",
      "O consumidor não é obrigado a ficar com um produto que não corresponde ao que foi oferecido. A informação que aparece no anúncio vincula a empresa, ou seja, ela tem que cumprir o que prometeu."
    ],
    "passos": [
      {
        "titulo": "Documente o anúncio e o recebido",
        "texto": "Tire prints do anúncio com a descrição e fotos, e registre o produto que chegou. Essa comparação é a base da sua reclamação."
      },
      {
        "titulo": "Conteste e escolha a solução",
        "texto": "Comunique a loja informando a diferença e diga o que prefere: receber o item correto, trocar, cancelar a compra ou ter o dinheiro de volta."
      },
      {
        "titulo": "Use o direito de arrependimento",
        "texto": "Em compras feitas fora da loja física, como pela internet, costuma haver um prazo curto para desistir e devolver sem precisar justificar."
      },
      {
        "titulo": "Acione órgãos e advogado",
        "texto": "Se a loja não resolver, registre no Procon e no consumidor.gov.br; um advogado pode pedir a devolução do valor e indenização."
      }
    ],
    "direitos": [
      "Direito de receber o produto exatamente como foi anunciado.",
      "Direito de escolher entre troca, item correto, cancelamento ou devolução do dinheiro.",
      "Direito de desistir da compra feita pela internet dentro do prazo legal de arrependimento.",
      "Direito a indenização quando a diferença causa prejuízo ou transtorno relevante."
    ],
    "quando_urgente": "Procure um advogado com urgência se a loja se recusar a trocar ou devolver o dinheiro, se o produto diferente colocou em risco a sua segurança ou saúde, ou se você gastou um valor alto e ficou sem o item e sem o reembolso. Guardar logo os prints do anúncio é essencial, pois a empresa pode alterar a página depois.",
    "documentos": [
      "Prints do anúncio com fotos, descrição e características prometidas",
      "Nota fiscal ou comprovante de compra e de pagamento",
      "Fotos ou vídeos do produto que foi efetivamente entregue",
      "Conversas com a loja e protocolos das reclamações feitas",
      "Comprovante de entrega ou rastreamento do pedido"
    ],
    "faq": [
      {
        "q": "Posso devolver mesmo que o produto não tenha defeito?",
        "a": "Sim, quando o item é diferente do anunciado ou quando a compra foi feita pela internet e você usa o direito de arrependimento dentro do prazo. Nessas situações, em geral, a devolução não exige que haja defeito."
      },
      {
        "q": "Quem paga o frete da devolução?",
        "a": "Quando o produto chega diferente do anunciado ou com problema, o custo da devolução costuma ser da loja, e não do consumidor. Se houver recusa, vale registrar a reclamação e buscar orientação jurídica."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "a-companhia-aerea-extraviou-minha-bagagem",
    "titulo": "A companhia aérea extraviou minha bagagem. O que eu faço?",
    "intencao_curta": "Saber como agir e quais direitos você tem quando a companhia aérea perde ou extravia sua bagagem.",
    "resumo": "Quando a companhia aérea perde, atrasa ou extravia a sua bagagem, você tem direito de ser ressarcido pelos seus pertences e, em muitos casos, de receber indenização pelos transtornos. O primeiro passo é registrar a ocorrência ainda no aeroporto. Veja o passo a passo.",
    "areas": [
      "consumidor",
      "civil"
    ],
    "situacao": [
      "É uma situação angustiante: o voo chega, mas a mala não aparece na esteira. A bagagem pode ter ficado em outro aeroporto, ido para o destino errado ou simplesmente sumido. Em viagens com conexão, o risco de extravio costuma ser ainda maior.",
      "Às vezes a mala é devolvida depois de algumas horas ou dias, configurando atraso; em outros casos, ela nunca aparece, caracterizando o extravio definitivo. Em ambos, o passageiro fica sem roupas, remédios e objetos pessoais, muitas vezes longe de casa.",
      "A companhia aérea é responsável pela bagagem que recebe no check-in. Por isso, ela deve providenciar a localização, custear o que você precisar enquanto a mala não volta e indenizar pelos bens perdidos."
    ],
    "passos": [
      {
        "titulo": "Registre antes de sair do aeroporto",
        "texto": "Procure o balcão da companhia e abra o registro de irregularidade de bagagem. Guarde uma via desse documento, que é a sua principal prova."
      },
      {
        "titulo": "Liste o conteúdo e guarde recibos",
        "texto": "Faça uma relação do que havia na mala e guarde notas dos itens essenciais que precisar comprar enquanto a bagagem não retorna."
      },
      {
        "titulo": "Cobre a companhia por escrito",
        "texto": "Formalize a reclamação pelos canais oficiais, peça prazo para localização e exija o ressarcimento das despesas e dos bens perdidos."
      },
      {
        "titulo": "Acione órgãos e advogado",
        "texto": "Se não houver solução, registre na agência reguladora e no consumidor.gov.br; um advogado pode pedir o ressarcimento e a indenização."
      }
    ],
    "direitos": [
      "Direito de registrar a ocorrência e exigir a localização da bagagem.",
      "Direito ao ressarcimento dos bens perdidos no caso de extravio definitivo.",
      "Direito ao reembolso de despesas essenciais enquanto a mala não é devolvida.",
      "Direito a indenização pelos transtornos, especialmente quando a perda atrapalha a viagem."
    ],
    "quando_urgente": "Procure um advogado com urgência se a bagagem foi definitivamente extraviada, se ela continha itens de valor ou medicamentos indispensáveis, ou se a companhia se recusa a ressarcir. Registrar a ocorrência ainda no aeroporto e guardar todos os comprovantes é decisivo, porque depois fica muito mais difícil provar o que estava na mala.",
    "documentos": [
      "Registro de irregularidade de bagagem feito no aeroporto",
      "Bilhete de passagem, cartão de embarque e etiqueta da bagagem",
      "Lista do conteúdo da mala e notas dos itens de maior valor, se tiver",
      "Recibos das compras feitas por causa do extravio",
      "Protocolos e mensagens trocadas com a companhia aérea"
    ],
    "faq": [
      {
        "q": "Tenho direito a indenização mesmo se a mala for devolvida depois?",
        "a": "Em muitos casos sim, pois o atraso na entrega também gera transtornos e gastos. A análise considera o tempo que você ficou sem a bagagem e os prejuízos sofridos, o que um advogado pode avaliar."
      },
      {
        "q": "Preciso provar tudo o que havia dentro da mala?",
        "a": "É importante apresentar uma lista do conteúdo e notas dos itens de maior valor. Mesmo sem todas as provas, costuma haver ressarcimento, mas guardar comprovantes aumenta bastante as suas chances."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "fiz-um-emprestimo-consignado-que-nao-autorizei",
    "titulo": "Apareceu um empréstimo consignado que não autorizei. Como cancelar?",
    "intencao_curta": "Entender como agir ao descobrir descontos de um empréstimo consignado que você nunca contratou.",
    "resumo": "Descobrir descontos no salário, na aposentadoria ou no benefício por um empréstimo consignado que você não contratou é sinal de possível fraude. Você tem direito de exigir o cancelamento, a devolução dos valores e, em muitos casos, indenização. Veja como reagir rápido.",
    "areas": [
      "consumidor",
      "civil"
    ],
    "situacao": [
      "Muitas pessoas, principalmente aposentados e pensionistas, percebem no contracheque ou no extrato do benefício um desconto mensal de empréstimo que nunca pediram. O dinheiro do consignado pode nem ter caído na conta, ou ter caído sem que a pessoa entendesse de onde veio.",
      "Esse tipo de fraude costuma acontecer com o uso indevido dos dados pessoais ou por abordagens enganosas, em que a pessoa é induzida a assinar algo sem saber que se tratava de um empréstimo. Como o desconto vem direto da folha, ele se repete todo mês e corrói a renda.",
      "Por atingir benefícios e salários, que são essenciais para o sustento, o consignado não autorizado merece atenção imediata. Quanto antes a fraude for contestada, mais fácil é interromper os descontos e recuperar o que foi tirado."
    ],
    "passos": [
      {
        "titulo": "Identifique o desconto e o banco",
        "texto": "No extrato ou contracheque, anote o valor, o número do contrato e o nome do banco responsável pelo empréstimo que você não reconhece."
      },
      {
        "titulo": "Conteste formalmente a contratação",
        "texto": "Comunique o banco e o órgão pagador que o contrato é fraudulento, peça cópia do contrato e exija o cancelamento e a suspensão dos descontos."
      },
      {
        "titulo": "Registre boletim de ocorrência",
        "texto": "Por se tratar de possível fraude, registre um boletim de ocorrência e guarde-o como prova de que você não fez o empréstimo."
      },
      {
        "titulo": "Procure um advogado",
        "texto": "Um advogado pode pedir na Justiça o cancelamento do contrato, a devolução dos valores descontados e indenização pelos danos sofridos."
      }
    ],
    "direitos": [
      "Direito de exigir o cancelamento de empréstimo que você não contratou.",
      "Direito de receber de volta os valores descontados indevidamente, muitas vezes em dobro.",
      "Direito de pedir a cópia do contrato e a assinatura usada para conferir a fraude.",
      "Direito a indenização pelos danos causados pelos descontos indevidos na sua renda."
    ],
    "quando_urgente": "Procure um advogado com urgência assim que perceber o desconto, principalmente se ele atinge aposentadoria, pensão ou salário e compromete o seu sustento. Agir rápido ajuda a suspender os descontos, recuperar os valores e impedir que novos contratos fraudulentos sejam feitos em seu nome. Não assine nem aceite acordos sem antes entender bem o que está acontecendo.",
    "documentos": [
      "Contracheque ou extrato do benefício mostrando os descontos do consignado",
      "Cópia do contrato do empréstimo, se você conseguir obtê-la com o banco",
      "Boletim de ocorrência relatando a suspeita de fraude",
      "Documentos pessoais para comprovar que a assinatura ou os dados foram usados indevidamente",
      "Protocolos das reclamações feitas ao banco e ao órgão pagador"
    ],
    "faq": [
      {
        "q": "O banco precisa parar os descontos enquanto eu contesto?",
        "a": "O ideal é exigir a suspensão imediata ao contestar. Se o banco não suspender e a fraude for evidente, um advogado pode pedir à Justiça uma decisão para interromper os descontos com urgência."
      },
      {
        "q": "E se o dinheiro do empréstimo caiu na minha conta?",
        "a": "Mesmo assim é possível discutir a fraude, mas normalmente esse valor que entrou precisa ser devolvido ou abatido. Por isso é importante não gastar essa quantia e procurar orientação jurídica o quanto antes."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "loja-se-recusa-a-trocar-produto-com-defeito",
    "titulo": "A loja se recusa a trocar um produto com defeito. O que fazer?",
    "intencao_curta": "Saber como agir quando a loja não quer trocar ou consertar um produto que veio com defeito.",
    "resumo": "Quando você compra um produto e ele apresenta defeito, a loja ou o fabricante têm a obrigação de resolver o problema. Se houver recusa, o Código de Defesa do Consumidor garante a você o direito ao conserto, à troca, à devolução do dinheiro ou ao abatimento do preço. Você não precisa aceitar um \"não\" como resposta final.",
    "areas": [
      "consumidor"
    ],
    "situacao": [
      "É muito comum a pessoa comprar um produto, perceber que ele não funciona direito ou veio com algum defeito e, ao voltar à loja, ouvir que o problema é do fabricante, que a garantia não cobre ou que já passou do prazo de troca. Muitas lojas tentam empurrar a responsabilidade para a assistência técnica ou simplesmente se recusam a resolver.",
      "Acontece também de o vendedor dizer que só troca se o produto estiver na embalagem original, ou que defeito não dá direito a troca, apenas a conserto. Essas conversas geram confusão e fazem o consumidor desistir, achando que não tem como cobrar seus direitos.",
      "Na prática, a lei protege quem comprou. O fornecedor responde pelo defeito mesmo que indique a assistência técnica, e você tem caminhos claros para resolver, inclusive de forma gratuita pelos órgãos de defesa do consumidor."
    ],
    "passos": [
      {
        "titulo": "Reúna as provas da compra e do defeito",
        "texto": "Guarde a nota fiscal, o cupom, fotos ou vídeos mostrando o defeito e qualquer mensagem trocada com a loja. Isso ajuda a comprovar o problema."
      },
      {
        "titulo": "Faça a reclamação por escrito",
        "texto": "Procure a loja e registre a reclamação de forma escrita, por e-mail, WhatsApp ou no balcão com protocolo. Peça o conserto, a troca ou a devolução do dinheiro."
      },
      {
        "titulo": "Acione os órgãos de defesa do consumidor",
        "texto": "Se a loja não resolver, registre reclamação no Procon, no site consumidor.gov.br ou em plataformas de reclamação. Em muitos casos a empresa responde rápido por esses canais."
      },
      {
        "titulo": "Busque a Justiça se nada resolver",
        "texto": "Persistindo a recusa, você pode procurar o Juizado Especial Cível ou um advogado para exigir a solução e, em alguns casos, uma indenização."
      }
    ],
    "direitos": [
      "Direito de escolher entre o conserto, a troca por outro produto, a devolução do valor pago ou o abatimento do preço, quando o defeito não for resolvido no prazo legal.",
      "Direito a que o fornecedor resolva o defeito, sem ser obrigado a aceitar que ele jogue a culpa só na assistência técnica.",
      "Direito à garantia legal, que existe independentemente da garantia oferecida pela loja ou pelo fabricante.",
      "Direito a buscar indenização se o defeito causar outros prejuízos a você."
    ],
    "quando_urgente": "Procure ajuda com urgência se o defeito puder causar risco à sua segurança ou à sua saúde, se o produto for essencial para o seu dia a dia (como uma geladeira ou um equipamento de trabalho), ou se o prazo para reclamar estiver perto de acabar. Quanto antes você registrar a reclamação e guardar as provas, mais forte fica a sua posição.",
    "documentos": [
      "Nota fiscal ou cupom fiscal da compra",
      "Fotos ou vídeos que mostrem claramente o defeito do produto",
      "Comprovantes das tentativas de contato com a loja (e-mails, mensagens, protocolos)",
      "Manual e termo de garantia que vieram com o produto",
      "Ordem de serviço da assistência técnica, caso o produto já tenha sido levado para conserto"
    ],
    "faq": [
      {
        "q": "A loja pode me obrigar a procurar a assistência técnica em vez de trocar o produto?",
        "a": "A loja pode encaminhar você à assistência, mas o fornecedor continua responsável. Se o defeito não for sanado no prazo previsto em lei, você pode exigir a troca, a devolução do dinheiro ou o abatimento do preço."
      },
      {
        "q": "Tenho direito à troca mesmo depois de alguns dias de uso?",
        "a": "Sim. Quando o problema é um defeito, e não simples arrependimento, você está protegido pela garantia legal, que vale por um período após a compra ou após o defeito aparecer, mesmo com o produto já em uso."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "conta-de-luz-ou-agua-muito-acima-do-normal",
    "titulo": "Recebi uma conta de luz ou de água muito acima do normal. O que fazer?",
    "intencao_curta": "Entender como contestar uma conta de luz ou de água com valor muito maior do que o habitual.",
    "resumo": "Receber uma conta de energia ou de água muito acima do normal, sem ter mudado o consumo, costuma indicar erro de leitura, problema no medidor ou cobrança indevida. Você tem o direito de contestar a conta, pedir a revisão da medição e, em muitos casos, evitar o corte enquanto o valor está sendo discutido. Não é preciso pagar sem questionar.",
    "areas": [
      "consumidor"
    ],
    "situacao": [
      "É comum a conta vir com um valor muito alto de repente, mesmo quando a rotina da casa não mudou. Isso pode acontecer por erro na leitura do medidor, por uma estimativa feita sem leitura real, por defeito no aparelho de medição ou por algum vazamento ou problema na rede que não é culpa do morador.",
      "Muitas pessoas, com medo de ter o serviço cortado, acabam pagando a conta alta mesmo sem entender o motivo. Outras tentam falar com a concessionária, mas recebem respostas confusas e não conseguem resolver.",
      "A boa notícia é que existe um caminho para contestar. A empresa que fornece luz ou água é obrigada a explicar a cobrança, revisar a leitura e, se houver erro, corrigir o valor e devolver o que foi cobrado a mais."
    ],
    "passos": [
      {
        "titulo": "Compare com as contas anteriores",
        "texto": "Junte as faturas dos últimos meses e veja a diferença de consumo. Isso ajuda a mostrar que o salto no valor está fora do seu padrão normal."
      },
      {
        "titulo": "Verifique o medidor e possíveis vazamentos",
        "texto": "Cheque se o número que aparece na conta bate com o do medidor e observe se há vazamentos ou aparelhos com defeito que possam explicar o aumento."
      },
      {
        "titulo": "Conteste junto à concessionária",
        "texto": "Registre a reclamação na empresa por telefone, site ou app e peça a revisão da leitura e a inspeção do medidor. Anote sempre o número de protocolo."
      },
      {
        "titulo": "Procure a agência reguladora ou a Justiça",
        "texto": "Se a empresa não resolver, recorra à agência reguladora, ao Procon ou, em casos mais graves, ao Juizado Especial para contestar a cobrança e pedir a correção."
      }
    ],
    "direitos": [
      "Direito de contestar a conta e de receber uma explicação clara sobre como o valor foi calculado.",
      "Direito de pedir a revisão da leitura e a inspeção do medidor, sem custo quando o problema for da empresa.",
      "Direito à devolução dos valores pagos a mais caso fique comprovado o erro na cobrança.",
      "Direito de discutir a manutenção do serviço, já que o corte por uma cobrança que está sendo contestada pode ser considerado indevido."
    ],
    "quando_urgente": "Busque ajuda com urgência se a empresa ameaçar cortar a luz ou a água por causa de uma conta que você está contestando, ou se o corte já tiver acontecido, principalmente havendo idosos, crianças ou pessoas doentes na casa. Nessas situações, um advogado pode pedir à Justiça que o serviço seja mantido ou religado enquanto o valor é discutido.",
    "documentos": [
      "Faturas dos últimos meses para comparar o consumo",
      "A conta com o valor alto que está sendo contestada",
      "Fotos do medidor mostrando a leitura atual",
      "Números de protocolo das reclamações feitas na empresa",
      "Laudos ou comprovantes de vazamento ou de defeito, se houver"
    ],
    "faq": [
      {
        "q": "Posso ter o serviço cortado por causa de uma conta que estou contestando?",
        "a": "Em geral, o corte por uma cobrança que está sendo discutida de forma legítima é considerado indevido. Você pode pedir a manutenção do serviço enquanto a contestação não é resolvida, inclusive na Justiça se for preciso."
      },
      {
        "q": "Se ficar provado que a conta veio errada, tenho direito a receber o valor de volta?",
        "a": "Sim. Comprovado o erro na cobrança, você tem direito à correção da conta e à devolução do que pagou a mais, que muitas vezes é restituído em dobro quando há cobrança indevida."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "plano-de-saude-cancelou-contrato-sem-avisar",
    "titulo": "Meu plano de saúde cancelou o contrato sem me avisar. O que fazer?",
    "intencao_curta": "Saber como reagir quando o plano de saúde cancela o contrato de forma unilateral e sem aviso prévio.",
    "resumo": "O plano de saúde não pode simplesmente cancelar o seu contrato de um dia para o outro, sem aviso e sem motivo legal. Existem regras rígidas que protegem o consumidor, especialmente quem está em tratamento. Se o cancelamento foi feito de forma indevida, você pode exigir a volta do plano e, em muitos casos, uma indenização pelos transtornos.",
    "areas": [
      "consumidor",
      "civil"
    ],
    "situacao": [
      "Muitas pessoas descobrem que o plano foi cancelado só na hora de marcar uma consulta, fazer um exame ou dar entrada em uma internação. O plano alega falta de pagamento, suposta irregularidade no contrato ou simplesmente decide encerrar o serviço, muitas vezes sem aviso claro e prévio.",
      "Em alguns casos, a operadora corta o contrato mesmo quando havia apenas um atraso pequeno, sem dar a chance de o consumidor regularizar a situação. Em outros, o cancelamento atinge famílias inteiras ou pessoas no meio de um tratamento sério.",
      "A lei e os órgãos reguladores impõem limites a isso. O cancelamento por iniciativa da operadora só é permitido em situações específicas e com aviso prévio, e o consumidor doente ou em tratamento tem proteção reforçada."
    ],
    "passos": [
      {
        "titulo": "Confirme o motivo do cancelamento",
        "texto": "Peça à operadora, por escrito, a explicação formal do cancelamento e a data em que ele teria ocorrido. Guarde toda a comunicação."
      },
      {
        "titulo": "Reúna os comprovantes de pagamento",
        "texto": "Se o motivo alegado for inadimplência, separe os comprovantes das mensalidades para mostrar que os pagamentos estavam em dia ou que o atraso foi pequeno."
      },
      {
        "titulo": "Registre reclamação nos órgãos competentes",
        "texto": "Faça reclamação na agência reguladora dos planos de saúde e no Procon. Muitas vezes a operadora reativa o contrato após esse contato."
      },
      {
        "titulo": "Procure a Justiça em caso de urgência",
        "texto": "Se você está em tratamento ou precisa de atendimento imediato, um advogado pode pedir uma decisão rápida para obrigar o plano a manter ou reativar a cobertura."
      }
    ],
    "direitos": [
      "Direito de não ter o contrato cancelado de forma unilateral fora das hipóteses permitidas em lei e sem o aviso prévio devido.",
      "Direito a ser notificado antes de qualquer cancelamento por falta de pagamento, com prazo para regularizar a dívida.",
      "Direito à continuidade do atendimento quando você está em tratamento, internado ou em situação de urgência.",
      "Direito a buscar indenização pelos prejuízos e pelo sofrimento causados por um cancelamento indevido."
    ],
    "quando_urgente": "Procure um advogado com urgência se o cancelamento ocorreu enquanto você ou um familiar está internado, em tratamento contínuo, aguardando cirurgia ou precisando de atendimento imediato. Nessas situações, é possível pedir à Justiça uma decisão rápida para que o plano seja obrigado a manter a cobertura e custear o tratamento sem interrupção.",
    "documentos": [
      "Cópia do contrato do plano de saúde",
      "Comprovantes de pagamento das mensalidades",
      "Carta, e-mail ou mensagem em que o plano comunicou o cancelamento",
      "Relatórios e pedidos médicos, principalmente se houver tratamento em andamento",
      "Números de protocolo dos contatos com a operadora e com os órgãos de defesa"
    ],
    "faq": [
      {
        "q": "O plano pode me cancelar só porque atrasei uma mensalidade?",
        "a": "Em geral, não de forma imediata. A operadora costuma precisar avisar o consumidor sobre o atraso e dar prazo para pagar antes de cancelar. Um cancelamento sem esse aviso pode ser considerado indevido."
      },
      {
        "q": "Estou em tratamento e meu plano foi cancelado. Eles podem fazer isso?",
        "a": "A proteção a quem está em tratamento ou internado é reforçada. Em muitos casos, é possível obter na Justiça uma decisão para que o plano mantenha a cobertura e não interrompa o atendimento."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "plano-de-saude-negou-medicamento-de-alto-custo",
    "titulo": "O plano de saúde negou um medicamento de alto custo. O que fazer?",
    "intencao_curta": "Entender como agir quando o plano de saúde se recusa a fornecer um medicamento caro indicado pelo médico.",
    "resumo": "Quando o médico indica um medicamento de alto custo e o plano de saúde se recusa a fornecer, essa negativa nem sempre é válida. Em muitos casos, a Justiça entende que o plano deve custear o tratamento prescrito, especialmente quando ele é essencial para a saúde do paciente. Você pode contestar a recusa e buscar o fornecimento do remédio.",
    "areas": [
      "consumidor",
      "civil"
    ],
    "situacao": [
      "É frequente o plano negar um medicamento caro alegando que ele não está na lista de cobertura, que é de uso domiciliar, que ainda é considerado experimental ou que existe outra opção mais barata. O paciente, já fragilizado pela doença, fica sem saber se tem como exigir o tratamento.",
      "Muitas vezes a negativa vem por escrito, de forma genérica, sem explicar direito o motivo. Em outras, o plano demora tanto para responder que o tratamento acaba atrasando, o que pode agravar o quadro de saúde.",
      "A jurisprudência costuma proteger o paciente. Quando há indicação médica clara de que o medicamento é necessário, a Justiça em muitos casos determina que o plano arque com o custo, mesmo que o remédio seja caro."
    ],
    "passos": [
      {
        "titulo": "Peça a negativa por escrito",
        "texto": "Exija que o plano informe a recusa de forma escrita e com o motivo. Esse documento é fundamental para contestar a decisão depois."
      },
      {
        "titulo": "Reúna a documentação médica",
        "texto": "Junte o pedido e o relatório do médico explicando por que aquele medicamento específico é necessário para o seu caso e a urgência do tratamento."
      },
      {
        "titulo": "Conteste e registre reclamação",
        "texto": "Apresente recurso à operadora e registre reclamação na agência reguladora dos planos de saúde. Isso pode resolver sem precisar de processo."
      },
      {
        "titulo": "Busque a Justiça se a negativa persistir",
        "texto": "Com um advogado, é possível pedir uma decisão rápida para obrigar o plano a fornecer o medicamento, principalmente quando há risco à saúde."
      }
    ],
    "direitos": [
      "Direito de receber a negativa por escrito e com a justificativa do plano de saúde.",
      "Direito de ter respeitada a indicação do médico que acompanha o seu tratamento.",
      "Direito de discutir a cobertura, já que, em muitos casos, a Justiça considera abusiva a recusa de medicamento essencial prescrito pelo médico.",
      "Direito a buscar indenização quando a demora ou a negativa causam prejuízo à sua saúde."
    ],
    "quando_urgente": "Procure um advogado com urgência quando a falta do medicamento puder agravar a doença, colocar a vida em risco ou interromper um tratamento já em andamento, como nos casos de câncer e doenças graves. Nessas situações, é possível pedir à Justiça uma decisão rápida para que o plano forneça o remédio em poucos dias, sem esperar o fim do processo.",
    "documentos": [
      "Pedido e relatório do médico com a indicação detalhada do medicamento",
      "Documento da negativa do plano de saúde, de preferência por escrito",
      "Cópia do contrato do plano de saúde",
      "Laudos e exames que comprovem a doença e a necessidade do tratamento",
      "Orçamento ou nota com o custo do medicamento, se você já tiver"
    ],
    "faq": [
      {
        "q": "O plano pode negar o remédio só porque ele não está na lista de cobertura?",
        "a": "Nem sempre essa negativa é válida. Em muitos casos, a Justiça entende que, havendo indicação médica de que o medicamento é necessário, o plano deve custear o tratamento, mesmo que o remédio não conste expressamente na lista."
      },
      {
        "q": "Quanto tempo demora para conseguir o medicamento pela Justiça?",
        "a": "Não há um prazo fixo, pois depende de cada caso. Porém, quando há urgência e risco à saúde, é possível pedir uma decisão provisória que costuma sair em poucos dias, obrigando o plano a fornecer o remédio enquanto o processo corre."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "plano-de-saude-exige-carencia-que-parece-abusiva",
    "titulo": "O plano de saúde exige uma carência que parece abusiva. O que fazer?",
    "intencao_curta": "Saber quando a carência cobrada pelo plano de saúde é válida e quando ela pode ser considerada abusiva.",
    "resumo": "Carência é o tempo que você precisa esperar, depois de contratar o plano, para usar certos serviços. Ela é permitida, mas tem limites definidos por lei. Quando o plano exige um prazo maior do que o permitido, cobra carência em situações de urgência ou emergência, ou desrespeita regras de portabilidade, essa exigência pode ser abusiva e você pode contestar.",
    "areas": [
      "consumidor",
      "civil"
    ],
    "situacao": [
      "Ao contratar um plano, é normal existir um período de carência para consultas, exames, internações e partos. O problema aparece quando o plano impõe prazos muito longos, cobra carência em casos de urgência ou emergência, ou exige novo período de espera mesmo quando você está apenas trocando de plano.",
      "Muitas pessoas só percebem o tamanho da carência na hora em que precisam de atendimento e têm o pedido negado. Isso é especialmente grave em situações de emergência, quando a saúde não pode esperar.",
      "A lei estabelece prazos máximos de carência e regras para a portabilidade entre planos. Quando o plano ultrapassa esses limites ou desrespeita as exceções de urgência e emergência, a cobrança pode ser considerada abusiva e questionada."
    ],
    "passos": [
      {
        "titulo": "Confira o que está no contrato",
        "texto": "Leia as cláusulas de carência do seu contrato e compare com os prazos máximos previstos na legislação dos planos de saúde."
      },
      {
        "titulo": "Verifique se é caso de urgência ou emergência",
        "texto": "Em situações de urgência e emergência, a carência costuma ser bem menor. Se o plano negou nesses casos, isso pode ser irregular."
      },
      {
        "titulo": "Reclame junto à operadora e aos órgãos reguladores",
        "texto": "Registre a contestação na operadora e, se necessário, na agência reguladora e no Procon, apontando que a carência exigida é maior do que a permitida."
      },
      {
        "titulo": "Procure orientação jurídica",
        "texto": "Se o plano insistir na carência abusiva e você precisar do atendimento, um advogado pode pedir à Justiça a liberação do serviço."
      }
    ],
    "direitos": [
      "Direito a que a carência respeite os prazos máximos definidos na legislação dos planos de saúde.",
      "Direito a atendimento em situações de urgência e emergência com prazo de carência bastante reduzido.",
      "Direito à portabilidade de carências quando você troca de plano cumprindo as regras, sem precisar cumprir tudo de novo.",
      "Direito de contestar e questionar na Justiça cláusulas de carência que sejam abusivas."
    ],
    "quando_urgente": "Busque ajuda com urgência se o plano negar atendimento alegando carência em uma situação de emergência ou urgência, como um acidente, uma dor intensa ou um risco de vida. Nesses casos, a exigência de carência costuma ser indevida, e é possível pedir à Justiça uma decisão rápida para garantir o atendimento imediato.",
    "documentos": [
      "Cópia do contrato do plano com as cláusulas de carência",
      "Documento da negativa de atendimento, de preferência por escrito",
      "Relatório médico que mostre a urgência ou a necessidade do atendimento",
      "Comprovante do plano anterior, em caso de portabilidade de carências",
      "Números de protocolo dos contatos com a operadora e com os órgãos de defesa"
    ],
    "faq": [
      {
        "q": "O plano pode cobrar carência em caso de emergência?",
        "a": "Em situações de urgência e emergência, a carência costuma ser bem menor do que para atendimentos comuns. Negar atendimento de emergência alegando carência longa pode ser considerado abusivo e questionado na Justiça."
      },
      {
        "q": "Troquei de plano. Preciso cumprir toda a carência de novo?",
        "a": "Nem sempre. Existe a portabilidade de carências, que permite aproveitar o tempo já cumprido no plano anterior quando você atende a certas regras. Assim, em muitos casos não é preciso recomeçar todos os prazos do zero."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "acho-que-fui-vitima-de-erro-medico",
    "titulo": "Acho que fui vítima de erro médico. O que fazer?",
    "intencao_curta": "Orientar quem desconfia ter sofrido um erro médico sobre como proteger seus direitos e buscar reparação.",
    "resumo": "Quando um tratamento, uma cirurgia ou um diagnóstico dá errado e causa um dano que poderia ter sido evitado, pode existir um erro médico. Nem todo resultado ruim é erro, mas, havendo falha no atendimento, você pode ter direito a indenização do profissional ou do hospital. O primeiro passo é reunir a documentação e buscar uma avaliação técnica e jurídica.",
    "areas": [
      "consumidor",
      "civil"
    ],
    "situacao": [
      "Muitas pessoas passam por uma consulta, um exame, uma cirurgia ou um tratamento e ficam com a sensação de que algo foi feito de forma errada, principalmente quando o quadro de saúde piora sem explicação clara. Isso pode envolver diagnóstico equivocado, procedimento mal realizado, falta de cuidado ou de informação adequada.",
      "É importante saber que nem todo resultado negativo significa erro. A medicina nem sempre garante cura, e existem complicações que podem ocorrer mesmo com o atendimento correto. O erro acontece quando há falha, descuido ou imprudência que causa um dano que poderia ter sido evitado.",
      "Para distinguir uma coisa da outra, normalmente é preciso analisar o prontuário e ouvir a opinião de outros profissionais. Por isso, reunir toda a documentação médica é essencial antes de tomar qualquer decisão."
    ],
    "passos": [
      {
        "titulo": "Solicite o seu prontuário completo",
        "texto": "Você tem direito a uma cópia de todo o prontuário, exames e relatórios. Peça esses documentos por escrito ao hospital ou à clínica."
      },
      {
        "titulo": "Busque uma segunda opinião médica",
        "texto": "Procure outro profissional para avaliar o que aconteceu. Essa opinião ajuda a entender se houve realmente uma falha no atendimento."
      },
      {
        "titulo": "Registre o ocorrido nos órgãos competentes",
        "texto": "Você pode registrar reclamação no conselho profissional da área e, dependendo do caso, em órgãos de defesa do consumidor, formalizando o problema."
      },
      {
        "titulo": "Procure um advogado para avaliar a indenização",
        "texto": "Com a documentação em mãos, um advogado pode analisar o caso e, se houver erro, buscar reparação pelos danos sofridos."
      }
    ],
    "direitos": [
      "Direito de ter acesso ao seu prontuário e a todos os documentos do seu atendimento.",
      "Direito a ser informado de forma clara sobre o diagnóstico, os riscos e as opções de tratamento.",
      "Direito a buscar indenização pelos danos físicos, emocionais e financeiros quando fica comprovada a falha no atendimento.",
      "Direito de responsabilizar tanto o profissional quanto o hospital ou a clínica, conforme o caso."
    ],
    "quando_urgente": "Procure orientação com urgência se o erro suspeito ainda estiver afetando a sua saúde, exigindo novo tratamento imediato, ou se houver risco de o prazo para pedir indenização se esgotar. Buscar logo o prontuário e a avaliação de outro profissional também é importante, porque com o tempo fica mais difícil reunir provas e entender exatamente o que aconteceu.",
    "documentos": [
      "Prontuário médico completo, com a descrição do atendimento e dos procedimentos",
      "Resultados de exames realizados antes e depois do problema",
      "Receitas, relatórios e laudos dos profissionais que atenderam você",
      "Comprovantes de gastos com o tratamento, remédios e novas consultas",
      "Relatos por escrito de testemunhas e suas próprias anotações sobre o ocorrido"
    ],
    "faq": [
      {
        "q": "Todo resultado ruim de um tratamento é considerado erro médico?",
        "a": "Não. A medicina nem sempre garante a cura, e algumas complicações podem ocorrer mesmo com o atendimento correto. O erro existe quando há falha, descuido ou imprudência que causa um dano que poderia ter sido evitado, o que precisa ser avaliado tecnicamente."
      },
      {
        "q": "Posso processar o hospital, ou só o médico que me atendeu?",
        "a": "Dependendo do caso, é possível responsabilizar tanto o profissional quanto o hospital ou a clínica. Por isso é importante que um advogado analise os documentos e identifique quem deve responder pelos danos sofridos."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "sus-negou-medicamento-ou-cirurgia",
    "titulo": "O SUS negou um medicamento ou cirurgia. O que fazer?",
    "intencao_curta": "Paciente do SUS não consegue o remédio, a cirurgia ou o tratamento que o médico indicou.",
    "resumo": "A saúde é um direito garantido pela Constituição, e o Estado tem o dever de fornecer o tratamento necessário pelo SUS. Quando há demora ou recusa, é possível cobrar pela via administrativa e, em muitos casos, conseguir o tratamento por decisão da Justiça.",
    "areas": [
      "civil"
    ],
    "situacao": [
      "Você precisa de um medicamento, de uma cirurgia, de um exame ou de um tratamento que o médico indicou, mas o SUS demora demais, coloca você em uma fila sem previsão ou simplesmente nega o fornecimento.",
      "Isso costuma acontecer quando o remédio é de alto custo, quando ele não está na lista padronizada do SUS, ou quando faltam vagas e estrutura para a cirurgia. Em situações assim, a saúde da pessoa fica em risco enquanto a burocracia não anda.",
      "A Constituição garante a saúde como direito de todos e dever do Estado. Por isso, quando há indicação médica clara e o tratamento é necessário, a Justiça muitas vezes determina que o poder público forneça o que foi prescrito, mesmo que não esteja na lista oficial, conforme a análise de cada caso."
    ],
    "passos": [
      {
        "titulo": "Guarde a prescrição e o laudo médico",
        "texto": "Peça ao médico um relatório detalhado explicando a doença, o tratamento indicado e por que ele é necessário. Esse documento é a base de tudo."
      },
      {
        "titulo": "Solicite formalmente ao SUS",
        "texto": "Peça o medicamento ou o procedimento na unidade de saúde ou na Secretaria de Saúde e guarde o protocolo. Se houver recusa, peça que seja por escrito."
      },
      {
        "titulo": "Procure a Defensoria Pública ou um advogado",
        "texto": "A Defensoria Pública atende de graça quem não pode pagar. Leve toda a documentação médica e os protocolos do pedido negado."
      },
      {
        "titulo": "Avalie a ação judicial com pedido de urgência",
        "texto": "Quando há risco à saúde, é possível pedir uma decisão rápida (liminar) para que o tratamento seja fornecido antes do fim do processo. Cada caso precisa de análise por um profissional."
      }
    ],
    "direitos": [
      "Acesso gratuito ao tratamento de saúde necessário pelo SUS, como dever do Estado",
      "Fornecimento de medicamento ou procedimento mesmo fora da lista padronizada, em situações analisadas caso a caso pela Justiça",
      "Atendimento por médico do próprio SUS e direito a relatório que justifique o tratamento",
      "Possibilidade de pedido de urgência (liminar) quando há risco à saúde ou à vida"
    ],
    "quando_urgente": "Sempre que houver risco à vida ou de agravamento da doença, ou quando a demora puder fazer perder a chance de tratamento (uma cirurgia que não pode esperar, um remédio que não pode faltar). Nesses casos, procure a Defensoria ou um advogado o quanto antes, pois é possível pedir uma decisão rápida da Justiça.",
    "documentos": [
      "Relatório e prescrição do médico, com a indicação detalhada do tratamento",
      "Exames, laudos e receitas que comprovem a doença",
      "Protocolo do pedido feito ao SUS e a recusa por escrito, se houver",
      "Documento de identidade, CPF e comprovante de residência",
      "Cartão do SUS"
    ],
    "faq": [
      {
        "q": "O SUS pode negar um remédio só porque ele não está na lista oficial?",
        "a": "Pode negar pela via administrativa, mas isso não é o fim. Quando há indicação médica fundamentada e o tratamento é necessário, a Justiça analisa o caso concreto e, em muitas situações, determina o fornecimento mesmo fora da lista."
      },
      {
        "q": "Preciso pagar advogado para entrar com o pedido?",
        "a": "Não necessariamente. A Defensoria Pública atende gratuitamente quem não tem condições de pagar. Você também pode procurar um advogado particular, e em alguns casos há gratuidade da Justiça."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "quero-revisar-o-valor-da-minha-aposentadoria",
    "titulo": "Quero revisar o valor da minha aposentadoria. É possível?",
    "intencao_curta": "Aposentado desconfia que o INSS calculou o benefício com valor menor do que o devido.",
    "resumo": "Em muitos casos é possível pedir a revisão do valor da aposentadoria quando o INSS deixou de considerar contribuições, períodos de trabalho ou usou um cálculo desfavorável. A revisão pode aumentar o benefício e gerar pagamento de valores atrasados.",
    "areas": [
      "previdenciario"
    ],
    "situacao": [
      "Você se aposentou, mas tem a impressão de que o valor ficou baixo demais perto do que contribuiu ao longo da vida. Às vezes o INSS deixa de fora salários antigos, períodos de trabalho ou contribuições que aparecem errados no sistema.",
      "Erros de cálculo são mais comuns do que parece: vínculos de emprego que não entraram, tempo especial não reconhecido, valores de salário registrados a menos ou contribuições como autônomo que ficaram de fora da conta.",
      "Quando se identifica um erro ou uma forma de cálculo mais vantajosa permitida pela lei, é possível pedir a revisão. Se for reconhecida, o valor mensal pode subir e ainda gerar o pagamento das diferenças do passado, respeitado o limite de tempo da lei."
    ],
    "passos": [
      {
        "titulo": "Peça a carta de concessão e o CNIS",
        "texto": "No Meu INSS você consegue a carta de concessão (que mostra como o benefício foi calculado) e o CNIS (que lista seus vínculos e contribuições). São a base da análise."
      },
      {
        "titulo": "Compare com seus documentos antigos",
        "texto": "Junte carteira de trabalho, holerites e carnês e confira se algum período ou salário ficou de fora ou foi lançado a menos."
      },
      {
        "titulo": "Procure um advogado previdenciário",
        "texto": "A análise de revisão é técnica e depende de cálculo. Um profissional verifica se há erro e se a revisão realmente compensa no seu caso."
      },
      {
        "titulo": "Avalie o pedido administrativo ou judicial",
        "texto": "A revisão pode ser pedida ao próprio INSS ou na Justiça. Atenção ao prazo: em geral há um limite de tempo para revisar e para cobrar as diferenças atrasadas."
      }
    ],
    "direitos": [
      "Pedir a revisão do cálculo quando há erro ou contribuições não consideradas",
      "Acesso gratuito à carta de concessão e ao processo administrativo do benefício",
      "Recebimento das diferenças atrasadas quando a revisão é reconhecida, dentro do limite de tempo da lei",
      "Análise por advogado ou pela Defensoria Pública quando não há condições de pagar"
    ],
    "quando_urgente": "A revisão não costuma ser de vida ou morte, mas o tempo importa: existe um prazo legal para revisar e para cobrar as diferenças do passado, e quanto mais ele passa, mais valores atrasados você pode perder. Por isso, vale procurar um advogado previdenciário assim que desconfiar de erro no cálculo.",
    "documentos": [
      "Carta de concessão da aposentadoria",
      "Extrato do CNIS atualizado",
      "Carteira de trabalho e holerites antigos",
      "Carnês e comprovantes de contribuição como autônomo, se houver",
      "Documento de identidade e CPF"
    ],
    "faq": [
      {
        "q": "Pedir revisão pode fazer minha aposentadoria diminuir?",
        "a": "O objetivo da revisão é corrigir erros e aumentar o benefício quando há fundamento. Por isso é importante a análise técnica antes de pedir: um advogado previdenciário verifica se a revisão realmente compensa no seu caso."
      },
      {
        "q": "Tem prazo para pedir a revisão?",
        "a": "Em geral existe um limite de tempo, tanto para revisar quanto para cobrar as diferenças atrasadas. Como o prazo varia conforme o caso, o ideal é buscar orientação o quanto antes para não perder valores."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "auxilio-acidente-foi-negado",
    "titulo": "O INSS negou meu auxílio-acidente. O que fazer?",
    "intencao_curta": "Trabalhador ficou com sequela depois de um acidente ou doença e teve o auxílio-acidente negado.",
    "resumo": "O auxílio-acidente é um valor pago como indenização quando uma sequela reduz a capacidade de trabalho, e pode ser recebido junto com o salário. A negativa do INSS pode ser revertida por recurso administrativo ou por ação na Justiça.",
    "areas": [
      "previdenciario"
    ],
    "situacao": [
      "Depois de um acidente (de trabalho, de trânsito ou de qualquer natureza) ou de uma doença, você ficou com uma sequela permanente que reduz a sua capacidade de trabalhar, mas continua conseguindo exercer alguma atividade.",
      "O auxílio-acidente é justamente para esse caso: ele não é a aposentadoria nem o auxílio por incapacidade temporária, mas uma indenização mensal que pode ser recebida ao mesmo tempo em que você volta a trabalhar e recebe salário.",
      "As negativas mais comuns acontecem quando a perícia do INSS entende que não há sequela, que a sequela não reduz a capacidade, ou que você não tinha a qualidade de segurado. Em muitos casos, uma perícia mais detalhada na Justiça reconhece a redução e reverte a negativa."
    ],
    "passos": [
      {
        "titulo": "Veja o motivo da negativa no Meu INSS",
        "texto": "A carta de indeferimento indica se foi falta de sequela, ausência de redução da capacidade ou qualidade de segurado. Esse motivo orienta o que reforçar."
      },
      {
        "titulo": "Reúna os documentos médicos da sequela",
        "texto": "Junte laudos, exames, atestados e relatórios que mostrem o acidente ou a doença e a sequela que ficou. Quanto mais detalhado, melhor."
      },
      {
        "titulo": "Apresente recurso administrativo",
        "texto": "Cabe recurso gratuito no próprio INSS dentro do prazo da negativa. Em alguns casos isso já resolve, principalmente quando faltava documento."
      },
      {
        "titulo": "Avalie a ação judicial",
        "texto": "Mantida a negativa, a Justiça Federal pode reanalisar com perícia médica oficial. Um advogado previdenciário ou a Defensoria pode atuar no seu caso."
      }
    ],
    "direitos": [
      "Auxílio-acidente quando a sequela reduz de forma permanente a capacidade de trabalho",
      "Receber o auxílio-acidente junto com o salário, já que ele tem natureza de indenização",
      "Recurso administrativo gratuito contra a negativa do INSS",
      "Perícia médica imparcial em ação judicial, com possibilidade de pagamento de valores atrasados"
    ],
    "quando_urgente": "Não deixe o prazo de recurso passar depois da negativa, porque perder o prazo dificulta a cobrança dos valores atrasados. Se a sequela veio de um acidente de trabalho e há outros direitos envolvidos, procure um advogado o quanto antes para analisar tudo em conjunto.",
    "documentos": [
      "Carta de indeferimento do INSS",
      "Laudos, exames e relatórios médicos da sequela",
      "Comunicação de Acidente de Trabalho (CAT), se for o caso",
      "Carteira de trabalho e extrato do CNIS",
      "Documento de identidade e CPF"
    ],
    "faq": [
      {
        "q": "Posso receber o auxílio-acidente e continuar trabalhando?",
        "a": "Sim. O auxílio-acidente tem natureza de indenização pela redução da capacidade, então em regra ele pode ser recebido ao mesmo tempo em que você trabalha e recebe salário."
      },
      {
        "q": "Qual a diferença entre auxílio-acidente e auxílio por incapacidade?",
        "a": "O auxílio por incapacidade (antigo auxílio-doença) é pago enquanto você está incapaz de trabalhar. Já o auxílio-acidente é uma indenização paga depois, quando ficou uma sequela que reduz a capacidade, mas você consegue voltar a trabalhar."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "salario-maternidade-foi-negado",
    "titulo": "O INSS negou meu salário-maternidade. O que fazer?",
    "intencao_curta": "Mãe (ou pessoa que adotou) teve o salário-maternidade negado pelo INSS.",
    "resumo": "O salário-maternidade é o benefício pago no período do nascimento ou da adoção de uma criança. A negativa por falta de qualidade de segurada ou de carência pode ser revertida por recurso administrativo ou por ação na Justiça.",
    "areas": [
      "previdenciario"
    ],
    "situacao": [
      "Você teve um filho, sofreu um aborto não criminoso, ou adotou ou obteve a guarda de uma criança, e pediu o salário-maternidade ao INSS, mas o benefício foi negado.",
      "O salário-maternidade é devido a diferentes seguradas: empregada, doméstica, contribuinte individual, trabalhadora avulsa e segurada especial (como a trabalhadora rural). As regras de carência e de comprovação mudam conforme o seu tipo de vínculo.",
      "As negativas mais comuns acontecem por entender que faltou qualidade de segurada (tempo sem contribuir), por falta de carência em alguns casos, ou por dúvida na comprovação do trabalho rural. Em muitas situações é possível reunir provas e reverter a negativa."
    ],
    "passos": [
      {
        "titulo": "Veja o motivo no Meu INSS",
        "texto": "A carta de indeferimento aponta se foi qualidade de segurada, carência ou falta de prova. Isso define o que você precisa reunir."
      },
      {
        "titulo": "Reúna as provas do vínculo e do nascimento",
        "texto": "Junte a certidão de nascimento ou os documentos da adoção, além de carteira de trabalho, carnês de contribuição ou provas do trabalho rural, conforme o seu caso."
      },
      {
        "titulo": "Apresente recurso administrativo",
        "texto": "Cabe recurso gratuito no próprio INSS dentro do prazo da negativa. Anexe os documentos que comprovam a sua condição de segurada."
      },
      {
        "titulo": "Avalie a ação judicial",
        "texto": "Mantida a negativa, a Justiça pode reconhecer o direito, inclusive com testemunhas no caso da trabalhadora rural. Um advogado ou a Defensoria pode orientar você."
      }
    ],
    "direitos": [
      "Salário-maternidade no período do nascimento, aborto não criminoso, adoção ou guarda para fins de adoção",
      "Direito ao benefício para diversos tipos de seguradas, inclusive a trabalhadora rural (segurada especial)",
      "Recurso administrativo gratuito contra a negativa do INSS",
      "Possibilidade de pagamento de valores atrasados quando o direito é reconhecido"
    ],
    "quando_urgente": "Como o salário-maternidade serve de sustento justamente no período do nascimento ou da chegada da criança, não deixe o prazo de recurso passar. Procure orientação logo após a negativa, principalmente se você ficou sem renda nesse período.",
    "documentos": [
      "Carta de indeferimento do INSS",
      "Certidão de nascimento da criança ou documentos da adoção/guarda",
      "Carteira de trabalho e extrato do CNIS",
      "Carnês de contribuição ou provas do trabalho rural, conforme o caso",
      "Documento de identidade e CPF"
    ],
    "faq": [
      {
        "q": "Trabalhadora rural tem direito ao salário-maternidade?",
        "a": "Sim. A trabalhadora rural enquadrada como segurada especial pode ter direito ao salário-maternidade, em regra comprovando o trabalho no campo no período exigido, inclusive com documentos e testemunhas."
      },
      {
        "q": "Quem não tem carteira assinada pode receber?",
        "a": "Pode, dependendo do caso. Contribuintes individuais, seguradas especiais e outras categorias também têm direito, desde que comprovem a qualidade de segurada e, quando exigida, a carência. Um advogado pode avaliar a sua situação."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "aposentadoria-por-invalidez-foi-negada",
    "titulo": "O INSS negou minha aposentadoria por invalidez. O que fazer?",
    "intencao_curta": "Segurado totalmente incapaz para o trabalho teve a aposentadoria por incapacidade negada.",
    "resumo": "A aposentadoria por invalidez (hoje chamada de aposentadoria por incapacidade permanente) é paga a quem está incapaz de forma definitiva para o trabalho. A negativa do INSS pode ser revertida com recurso administrativo ou com ação na Justiça e perícia detalhada.",
    "areas": [
      "previdenciario"
    ],
    "situacao": [
      "Por causa de uma doença ou de um acidente, você ficou incapaz de trabalhar de forma permanente, sem perspectiva de recuperação ou de readaptação para outra atividade, e pediu a aposentadoria por incapacidade permanente.",
      "O INSS costuma negar quando a perícia entende que ainda há capacidade para alguma atividade, quando considera que a incapacidade é apenas temporária, ou quando não reconhece a qualidade de segurado. Às vezes concede apenas o auxílio por incapacidade temporária no lugar da aposentadoria.",
      "Em muitos casos, uma perícia mais detalhada na Justiça, somada a laudos completos dos médicos que acompanham o tratamento, reconhece a incapacidade permanente e reverte a negativa, podendo gerar o pagamento de valores atrasados."
    ],
    "passos": [
      {
        "titulo": "Leia o motivo da negativa",
        "texto": "No Meu INSS, veja se a negativa foi por capacidade para o trabalho, por incapacidade considerada temporária ou por qualidade de segurado. Isso orienta a estratégia."
      },
      {
        "titulo": "Reúna laudos médicos completos",
        "texto": "Peça aos seus médicos relatórios detalhados explicando a doença, o tratamento e por que você está incapaz de forma permanente. Junte exames e receitas."
      },
      {
        "titulo": "Apresente recurso administrativo",
        "texto": "Cabe recurso gratuito no próprio INSS dentro do prazo. Em alguns casos resolve, principalmente quando há novos documentos médicos."
      },
      {
        "titulo": "Avalie a ação judicial com perícia",
        "texto": "Mantida a negativa, a Justiça Federal reavalia com perícia médica oficial e, havendo urgência, pode antecipar o benefício. Um advogado ou a Defensoria pode atuar."
      }
    ],
    "direitos": [
      "Aposentadoria por incapacidade permanente quando comprovada a incapacidade total e definitiva para o trabalho",
      "Perícia médica imparcial em ação judicial, considerando os laudos dos seus médicos",
      "Recurso administrativo gratuito contra a negativa do INSS",
      "Possibilidade de antecipação do benefício e de pagamento de valores atrasados, conforme o caso"
    ],
    "quando_urgente": "Quando você está sem renda e sem condições de trabalhar, ou em caso de doença grave que se agrava com o tempo, procure um advogado ou a Defensoria rapidamente. Não deixe o prazo de recurso passar, e saiba que, havendo urgência, é possível pedir uma decisão antecipada da Justiça.",
    "documentos": [
      "Carta de indeferimento do INSS",
      "Laudos, relatórios e atestados médicos detalhados",
      "Exames, receitas e histórico de tratamento",
      "Carteira de trabalho e extrato do CNIS",
      "Documento de identidade e CPF"
    ],
    "faq": [
      {
        "q": "O INSS deu auxílio temporário em vez da aposentadoria. Posso questionar?",
        "a": "Pode. Se você entende que a incapacidade é permanente e não apenas temporária, é possível recorrer ou ir à Justiça para pedir a transformação em aposentadoria por incapacidade permanente, com base nos laudos médicos."
      },
      {
        "q": "Existe acréscimo no valor se eu precisar de ajuda de outra pessoa?",
        "a": "Em algumas situações, quando o aposentado precisa da ajuda permanente de outra pessoa para as atividades do dia a dia, a lei prevê um acréscimo no valor do benefício. Um advogado pode avaliar se o seu caso se enquadra."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "inss-nao-reconheceu-tempo-de-trabalho-rural",
    "titulo": "O INSS não reconheceu meu tempo de trabalho rural. O que fazer?",
    "intencao_curta": "Trabalhador do campo teve o período de trabalho rural recusado pelo INSS.",
    "resumo": "O tempo de trabalho rural pode contar para a aposentadoria e outros benefícios, mesmo sem carteira assinada. Quando o INSS não reconhece esse período, é possível comprovar o trabalho no campo com documentos e testemunhas e reverter a negativa.",
    "areas": [
      "previdenciario"
    ],
    "situacao": [
      "Você trabalhou na roça, na agricultura familiar, na pesca artesanal ou como diarista no campo (boia-fria), muitas vezes sem registro em carteira, e o INSS não reconheceu esse tempo na hora de pedir a aposentadoria ou outro benefício.",
      "A maior dificuldade é a prova: como geralmente não há contrato formal, o INSS costuma exigir documentos da época que liguem você à atividade rural, e nem sempre as pessoas guardaram esses papéis.",
      "Mesmo assim, a lei e a Justiça admitem a comprovação do trabalho rural com um documento que sirva de início de prova (como documentos da terra, notas de produtor, registros escolares ou da igreja) reforçado por testemunhas, o que em muitos casos permite reconhecer o período."
    ],
    "passos": [
      {
        "titulo": "Reúna documentos antigos da atividade rural",
        "texto": "Procure notas de produtor, documentos do sítio ou do arrendamento, registros do sindicato rural, certidões e qualquer papel da época que mostre a ligação com o campo."
      },
      {
        "titulo": "Identifique testemunhas",
        "texto": "Vizinhos, colegas de lavoura e pessoas da comunidade que possam confirmar que você trabalhava na roça naquele período são muito importantes."
      },
      {
        "titulo": "Apresente recurso administrativo",
        "texto": "Cabe recurso gratuito no próprio INSS dentro do prazo, anexando os documentos que comprovam o trabalho rural. Em alguns casos isso já resolve."
      },
      {
        "titulo": "Avalie a ação judicial",
        "texto": "Mantida a negativa, a Justiça pode reconhecer o período ouvindo testemunhas, desde que haja ao menos um documento de início de prova. Um advogado ou a Defensoria pode orientar."
      }
    ],
    "direitos": [
      "Contagem do tempo de trabalho rural para aposentadoria e outros benefícios, mesmo sem carteira assinada",
      "Comprovação do trabalho no campo por documentos de início de prova reforçados por testemunhas",
      "Recurso administrativo gratuito contra a negativa do INSS",
      "Reconhecimento do período pela Justiça quando a prova é suficiente, com possibilidade de valores atrasados"
    ],
    "quando_urgente": "Não é um caso de risco imediato, mas as testemunhas e os documentos antigos tendem a desaparecer com o tempo, o que dificulta a prova. Por isso, vale reunir tudo e procurar um advogado previdenciário ou a Defensoria assim que possível para não perder esse período.",
    "documentos": [
      "Carta de indeferimento do INSS",
      "Documentos da terra (escritura, contrato de arrendamento, ITR) ou notas de produtor",
      "Registros do sindicato rural, certidões e documentos escolares ou religiosos da época",
      "Lista de possíveis testemunhas do trabalho no campo",
      "Documento de identidade e CPF"
    ],
    "faq": [
      {
        "q": "Trabalhei na roça sem carteira assinada. Esse tempo conta mesmo?",
        "a": "Pode contar, sim. O trabalho rural sem registro pode ser reconhecido para fins de benefício, em regra com um documento que sirva de início de prova somado a testemunhas que confirmem a atividade no período."
      },
      {
        "q": "Só com testemunhas eu consigo provar?",
        "a": "Em geral, não basta apenas a prova de testemunhas: a lei costuma exigir ao menos um documento da época que indique o trabalho rural, que então é reforçado pelos depoimentos. Um advogado pode avaliar quais documentos servem no seu caso."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "contar-tempo-de-trabalho-insalubre-como-tempo-especial",
    "titulo": "Quero contar o tempo de trabalho insalubre como tempo especial. Como faço?",
    "intencao_curta": "Entender como transformar o tempo trabalhado em condições insalubres em tempo especial para a aposentadoria.",
    "resumo": "Quem trabalhou exposto a agentes nocivos à saúde, como ruído, calor, produtos químicos ou agentes biológicos, pode ter direito de contar esse período como tempo especial. Isso costuma ajudar a se aposentar mais cedo ou a aumentar o valor do benefício. Para isso, é preciso comprovar a exposição com documentos da empresa.",
    "areas": [
      "previdenciario"
    ],
    "situacao": [
      "Muita gente passa anos trabalhando em ambientes que fazem mal à saúde, como fábricas barulhentas, hospitais, postos de combustível, mineradoras ou lavouras com agrotóxicos. Esse tipo de exposição costuma ser chamado de trabalho insalubre ou em condições especiais.",
      "O problema é que, na hora de pedir a aposentadoria, o INSS nem sempre reconhece esse tempo como especial de forma automática. Em geral, é a própria pessoa que precisa apresentar os documentos certos para provar que ficou exposta aos agentes nocivos durante a jornada de trabalho.",
      "Quando o tempo especial é reconhecido, ele costuma valer mais do que o tempo comum, o que pode adiantar a aposentadoria ou melhorar o valor a receber. Por isso, vale a pena reunir toda a documentação e, se preciso, contestar a recusa do INSS."
    ],
    "passos": [
      {
        "titulo": "Reúna os documentos da empresa",
        "texto": "Peça à empresa o PPP (Perfil Profissiográfico Previdenciário), que descreve a sua exposição aos agentes nocivos. Esse é o documento mais importante para comprovar o tempo especial."
      },
      {
        "titulo": "Junte laudos e registros de trabalho",
        "texto": "Guarde também a carteira de trabalho, contracheques e laudos técnicos (LTCAT) que mostrem as condições do ambiente. Eles reforçam o seu pedido."
      },
      {
        "titulo": "Faça o pedido no INSS",
        "texto": "Solicite o reconhecimento do tempo especial pelo site ou aplicativo Meu INSS, anexando os documentos. Acompanhe o andamento e guarde os protocolos."
      },
      {
        "titulo": "Procure orientação se houver recusa",
        "texto": "Se o INSS não reconhecer o tempo, um advogado pode avaliar o caso e, se for cabível, entrar com recurso administrativo ou ação na Justiça."
      }
    ],
    "direitos": [
      "Direito de ter o tempo de exposição a agentes nocivos contado como tempo especial, quando comprovado.",
      "Direito de receber da empresa o PPP, documento que descreve a sua atividade e a exposição.",
      "Direito de pedir a conversão ou a soma do tempo especial para fins de aposentadoria, conforme as regras vigentes.",
      "Direito de recorrer da decisão do INSS, tanto na via administrativa quanto na Justiça."
    ],
    "quando_urgente": "Procure um advogado com urgência se você já está prestes a se aposentar e o INSS não reconheceu o tempo especial, ou se a empresa em que você trabalhou está fechando, pois pode ficar difícil conseguir o PPP e os laudos depois. Também é importante agir rápido quando há prazo para recurso administrativo correndo.",
    "documentos": [
      "PPP (Perfil Profissiográfico Previdenciário) emitido pela empresa.",
      "Carteira de trabalho com os registros dos contratos.",
      "Laudos técnicos das condições do ambiente, como o LTCAT.",
      "Contracheques que mostrem adicional de insalubridade ou periculosidade.",
      "Carta de concessão ou indeferimento do INSS, se já houver pedido feito."
    ],
    "faq": [
      {
        "q": "O adicional de insalubridade no contracheque já garante o tempo especial?",
        "a": "Não necessariamente. O adicional é um indício importante, mas o INSS costuma exigir o PPP e laudos que comprovem a exposição efetiva aos agentes nocivos. Por isso, vale juntar todos os documentos."
      },
      {
        "q": "A empresa fechou e não consigo o PPP. Ainda posso comprovar?",
        "a": "Sim, em muitos casos é possível buscar outras provas, como laudos antigos, documentos de sindicatos ou perícia. Um advogado pode orientar o melhor caminho para a sua situação."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "comprei-imovel-com-vicio-de-construcao",
    "titulo": "Comprei um imóvel com vício de construção. O que posso fazer?",
    "intencao_curta": "Saber quais são os direitos de quem comprou imóvel com defeitos de construção e como cobrar a solução.",
    "resumo": "Quando o imóvel apresenta problemas como infiltração, rachaduras, mofo ou falhas estruturais, isso costuma ser chamado de vício de construção. O comprador pode ter direito de exigir o conserto, o abatimento no preço ou até indenização. A construtora ou o vendedor costuma ser responsável pelos defeitos.",
    "areas": [
      "imobiliario",
      "consumidor"
    ],
    "situacao": [
      "É comum que defeitos de construção apareçam depois da entrega do imóvel. Infiltrações, paredes que racharam, telhado com vazamento, mofo e problemas no acabamento estão entre as reclamações mais frequentes de quem compra apartamento ou casa, principalmente em imóveis novos.",
      "Em geral, a construtora ou o vendedor é responsável por esses vícios e deve consertá-los. Quando o defeito compromete a segurança ou a solidez da obra, a responsabilidade costuma se estender por um prazo maior, mesmo depois de a pessoa já estar morando no imóvel.",
      "O problema é que muitas construtoras demoram para resolver ou tentam transferir a culpa para o comprador. Por isso, é importante registrar tudo por escrito e reunir provas para cobrar a solução de forma firme."
    ],
    "passos": [
      {
        "titulo": "Documente os defeitos",
        "texto": "Tire fotos e vídeos de cada problema, com data. Esse registro será essencial para comprovar o vício de construção mais adiante."
      },
      {
        "titulo": "Notifique a construtora por escrito",
        "texto": "Faça a reclamação por escrito, de preferência por e-mail ou notificação, descrevendo os defeitos e pedindo o conserto. Guarde o comprovante de envio e a resposta."
      },
      {
        "titulo": "Peça uma vistoria técnica",
        "texto": "Se possível, contrate um engenheiro ou arquiteto para fazer um laudo. Ele ajuda a comprovar a origem do problema e o custo do reparo."
      },
      {
        "titulo": "Busque seus direitos",
        "texto": "Se a construtora não resolver, procure o Procon ou um advogado para exigir o conserto, o abatimento do preço ou indenização na Justiça."
      }
    ],
    "direitos": [
      "Direito de exigir o conserto dos defeitos, sem custo, dentro dos prazos previstos em lei.",
      "Direito de pedir o abatimento do preço ou a devolução de valores, conforme o caso.",
      "Direito a indenização por danos materiais e, em algumas situações, por danos morais.",
      "Direito de responsabilizar a construtora por vícios que afetam a solidez e a segurança da obra por prazo ampliado."
    ],
    "quando_urgente": "Procure um advogado com urgência se o defeito coloca em risco a segurança da estrutura, como rachaduras grandes, risco de desabamento ou problemas elétricos perigosos, pois nesses casos a sua família e os vizinhos podem estar em perigo. Também é importante agir rápido para não perder os prazos legais de reclamação.",
    "documentos": [
      "Contrato de compra e venda do imóvel.",
      "Fotos e vídeos datados dos defeitos.",
      "Laudo técnico de engenheiro ou arquiteto, se houver.",
      "Notificações enviadas à construtora e as respostas recebidas.",
      "Comprovantes de gastos com reparos já feitos por você."
    ],
    "faq": [
      {
        "q": "Já moro no imóvel há alguns anos. Ainda posso reclamar de rachaduras?",
        "a": "Em muitos casos, sim. Defeitos que afetam a solidez e a segurança da obra costumam ter um prazo de responsabilidade mais longo. Um advogado pode avaliar se o seu caso ainda está dentro do prazo."
      },
      {
        "q": "A construtora diz que o problema foi causado pelo meu uso. E agora?",
        "a": "Nesse caso, o laudo técnico é fundamental, pois ajuda a mostrar a verdadeira origem do defeito. Se ficar comprovado que o vício é da construção, a responsabilidade costuma ser da construtora."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "problema-com-cobranca-de-condominio",
    "titulo": "Tenho problema com cobrança de condomínio. Quais são os meus direitos?",
    "intencao_curta": "Entender como funciona a cobrança de condomínio e o que fazer diante de valores indevidos ou cobranças abusivas.",
    "resumo": "Cobranças de condomínio em atraso, taxas que pareceram indevidas ou multas elevadas geram muitas dúvidas. O morador tem direito de receber cobranças claras e de questionar valores que não estão de acordo com a convenção ou com a lei. Em geral, é possível negociar, contestar ou parcelar o débito.",
    "areas": [
      "imobiliario",
      "civil"
    ],
    "situacao": [
      "Problemas com condomínio costumam aparecer de várias formas. Há quem receba cobrança de valores atrasados com juros e multa altos, quem desconfie de taxas extras que não foram aprovadas em assembleia e quem seja cobrado por dívidas de um antigo proprietário.",
      "O condomínio tem o direito de cobrar as despesas para manter o prédio funcionando, como limpeza, segurança e manutenção. Mas essa cobrança precisa seguir a convenção do condomínio, o que foi decidido em assembleia e os limites previstos em lei, especialmente quanto a juros e multa.",
      "Quando o morador acumula dívidas, o condomínio pode buscar a cobrança na Justiça, e em situações extremas o imóvel pode até ser levado a leilão. Por isso, é importante entender a cobrança, negociar quando possível e contestar o que estiver errado."
    ],
    "passos": [
      {
        "titulo": "Confira a origem da cobrança",
        "texto": "Peça o detalhamento dos valores cobrados e compare com as atas de assembleia e a convenção. Verifique se a multa e os juros estão dentro do limite legal."
      },
      {
        "titulo": "Converse com o síndico ou a administradora",
        "texto": "Procure resolver de forma amigável, registrando tudo por escrito. Muitas vezes é possível corrigir erros ou negociar um parcelamento."
      },
      {
        "titulo": "Conteste por escrito o que for indevido",
        "texto": "Se houver cobrança que você considera errada, apresente sua contestação formal ao condomínio, explicando os motivos e juntando documentos."
      },
      {
        "titulo": "Busque orientação jurídica",
        "texto": "Se a cobrança continuar ou virar uma ação na Justiça, procure um advogado para defender seus direitos e evitar a perda do imóvel."
      }
    ],
    "direitos": [
      "Direito de receber cobranças claras e detalhadas das despesas do condomínio.",
      "Direito de contestar valores indevidos ou que não foram aprovados em assembleia.",
      "Direito a multa e juros dentro dos limites previstos na lei e na convenção.",
      "Direito de negociar e parcelar dívidas em atraso, quando o condomínio aceitar."
    ],
    "quando_urgente": "Procure um advogado com urgência se o condomínio já entrou com ação de cobrança na Justiça ou se há ameaça de o seu imóvel ir a leilão por causa das dívidas. Nesses casos, agir rápido pode evitar a perda do bem e abrir espaço para negociação ou para contestar valores cobrados de forma indevida.",
    "documentos": [
      "Boletos e demonstrativos das cobranças do condomínio.",
      "Convenção e regimento interno do condomínio.",
      "Atas de assembleia que aprovaram as despesas e taxas.",
      "Comprovantes de pagamentos já realizados.",
      "Mensagens ou notificações trocadas com o síndico ou a administradora."
    ],
    "faq": [
      {
        "q": "Comprei um imóvel com dívidas de condomínio do antigo dono. Tenho que pagar?",
        "a": "Em geral, as dívidas de condomínio acompanham o imóvel, então o novo proprietário pode ser cobrado. Por isso é importante verificar a existência de débitos antes de comprar e, se houver, buscar orientação jurídica."
      },
      {
        "q": "O condomínio pode cobrar multa de qualquer valor pelo atraso?",
        "a": "Não. A multa por atraso no pagamento de condomínio tem um limite previsto em lei. Se a cobrança ultrapassar esse limite, você pode contestar o valor."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "meu-vizinho-perturba-o-sossego",
    "titulo": "Meu vizinho perturba o sossego. O que eu posso fazer?",
    "intencao_curta": "Saber como agir diante de barulho excessivo e perturbação do sossego causados por vizinhos.",
    "resumo": "Barulho excessivo, festas constantes, som alto e outras perturbações afetam o direito ao sossego e ao descanso. O morador prejudicado pode registrar reclamações, acionar o condomínio e até buscar a Justiça. Em casos mais graves, a perturbação do sossego pode gerar punição prevista em lei.",
    "areas": [
      "civil",
      "criminal"
    ],
    "situacao": [
      "Conviver com vizinhos nem sempre é fácil. Som alto na madrugada, festas frequentes, latidos constantes, obras fora de hora e gritarias são situações comuns que tiram o sossego e atrapalham o descanso de quem mora ao lado.",
      "Todo mundo tem direito de usar o seu imóvel, mas esse uso não pode prejudicar o bem-estar dos vizinhos. Quando o barulho passa do razoável e se torna repetido, ele pode configurar perturbação do sossego, que é tratada tanto em regras do condomínio quanto na legislação.",
      "Muitas vezes a conversa resolve, mas há casos em que o vizinho ignora os pedidos. Nessas situações, é importante reunir provas e usar os meios disponíveis, como o condomínio, a fiscalização do município e, se necessário, a polícia e a Justiça."
    ],
    "passos": [
      {
        "titulo": "Tente conversar primeiro",
        "texto": "Aborde o vizinho de forma educada e explique o incômodo. Muitas vezes a pessoa não percebe que está atrapalhando e o problema se resolve no diálogo."
      },
      {
        "titulo": "Acione o condomínio",
        "texto": "Se mora em prédio ou condomínio, registre a reclamação por escrito com o síndico. O regimento interno costuma prever advertências e multas para quem perturba o sossego."
      },
      {
        "titulo": "Reúna provas do barulho",
        "texto": "Grave áudios e vídeos com data e horário e anote as ocorrências. Esses registros são importantes caso o problema chegue à Justiça."
      },
      {
        "titulo": "Busque a fiscalização ou a Justiça",
        "texto": "Se a perturbação continuar, é possível acionar a fiscalização do município, registrar boletim de ocorrência ou procurar um advogado para medidas judiciais."
      }
    ],
    "direitos": [
      "Direito ao sossego, ao descanso e ao uso tranquilo da sua moradia.",
      "Direito de reclamar formalmente ao condomínio e exigir o cumprimento do regimento interno.",
      "Direito de acionar a fiscalização do município contra barulho fora dos limites permitidos.",
      "Direito de buscar na Justiça a cessação da perturbação e, em alguns casos, indenização."
    ],
    "quando_urgente": "Procure orientação com urgência se a perturbação é constante e está afetando a sua saúde, o seu sono ou o seu trabalho, ou se há ameaças e clima de conflito com o vizinho. Em situações de barulho excessivo no momento, é possível acionar a polícia, que pode registrar a ocorrência de perturbação do sossego.",
    "documentos": [
      "Gravações de áudio e vídeo do barulho, com data e horário.",
      "Registro das reclamações feitas ao síndico ou à administradora.",
      "Cópia do regimento interno e da convenção do condomínio.",
      "Boletins de ocorrência registrados, se houver.",
      "Relatos de outros vizinhos que também são incomodados."
    ],
    "faq": [
      {
        "q": "Existe um horário certo em que o barulho é proibido?",
        "a": "Cada município costuma ter regras próprias sobre limites de ruído e horários, e o condomínio também pode definir o seu silêncio. O importante é que o barulho não ultrapasse o razoável nem prejudique o descanso dos vizinhos."
      },
      {
        "q": "A polícia pode fazer alguma coisa contra o barulho?",
        "a": "Sim. A perturbação do sossego é prevista em lei, e a polícia pode ser acionada para registrar a ocorrência no momento do barulho. Isso pode servir de prova para outras medidas."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "regularizar-imovel-por-usucapiao",
    "titulo": "Quero regularizar um imóvel por usucapião. Como funciona?",
    "intencao_curta": "Entender o que é usucapião e como regularizar a posse de um imóvel para se tornar dono.",
    "resumo": "Quem ocupa um imóvel por muitos anos, como se fosse o dono, pode ter direito de regularizá-lo por usucapião e obter a escritura em seu nome. Para isso, é preciso comprovar a posse mansa e por tempo prolongado. O processo pode ser feito no cartório ou na Justiça, conforme o caso.",
    "areas": [
      "imobiliario",
      "civil"
    ],
    "situacao": [
      "Muitas famílias moram durante anos em um terreno ou casa sem ter o imóvel registrado em seu nome. Isso acontece em compras antigas sem escritura, em heranças que nunca foram regularizadas e em terrenos ocupados há muito tempo sem oposição de ninguém.",
      "A usucapião é uma forma de quem tem a posse de um imóvel por tempo prolongado, agindo como dono e sem contestação, se tornar oficialmente o proprietário. Em geral, é preciso comprovar que a ocupação foi mansa, pacífica e contínua durante o período exigido por lei.",
      "Existem diferentes tipos de usucapião, com prazos e exigências distintos, e o imóvel não pode ser público. Por isso, reunir documentos e provas da posse é fundamental para conseguir regularizar a situação e obter a segurança de ter o bem em seu nome."
    ],
    "passos": [
      {
        "titulo": "Reúna provas da posse",
        "texto": "Junte documentos que mostrem há quanto tempo você ocupa o imóvel, como contas de água, luz, IPTU e comprovantes de melhorias feitas no local."
      },
      {
        "titulo": "Identifique o tipo de usucapião",
        "texto": "Um advogado pode avaliar qual modalidade se encaixa no seu caso, conforme o tempo de posse, o tamanho e o uso do imóvel."
      },
      {
        "titulo": "Escolha a via adequada",
        "texto": "A regularização pode ser feita no cartório (via extrajudicial) ou na Justiça. A escolha depende de haver ou não acordo entre as partes envolvidas."
      },
      {
        "titulo": "Acompanhe o processo até o registro",
        "texto": "Após o reconhecimento da usucapião, o imóvel é registrado em seu nome no cartório de imóveis, garantindo a propriedade."
      }
    ],
    "direitos": [
      "Direito de buscar a propriedade do imóvel após posse prolongada, mansa e pacífica.",
      "Direito de regularizar o bem por via extrajudicial, no cartório, quando houver acordo.",
      "Direito de recorrer à Justiça quando há disputa ou ausência de documentos.",
      "Direito de obter o registro do imóvel em seu nome ao final do processo."
    ],
    "quando_urgente": "Procure um advogado com urgência se alguém está questionando a sua posse, tentando retomar o imóvel ou se há risco de você ser retirado do local. Também é importante agir quando o suposto dono pretende vender ou registrar o imóvel, pois isso pode dificultar o reconhecimento da usucapião e exigir medidas para proteger a sua posse.",
    "documentos": [
      "Comprovantes de tempo de posse, como contas de água, luz e IPTU no seu nome.",
      "Documento de compra, recibo ou contrato, mesmo que sem registro.",
      "Fotos e notas de benfeitorias e melhorias feitas no imóvel.",
      "Declarações de vizinhos ou testemunhas sobre a sua ocupação.",
      "Planta ou memorial descritivo do imóvel, quando exigido."
    ],
    "faq": [
      {
        "q": "Posso pedir usucapião de um imóvel público, como um terreno da prefeitura?",
        "a": "Não. Imóveis públicos, em geral, não podem ser adquiridos por usucapião. Por isso é importante verificar a situação do imóvel antes de iniciar qualquer processo."
      },
      {
        "q": "Preciso necessariamente ir à Justiça para conseguir a usucapião?",
        "a": "Nem sempre. Em muitos casos é possível fazer a usucapião pelo cartório, de forma extrajudicial, quando há acordo e a documentação está organizada. Um advogado pode indicar o melhor caminho."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "desistir-da-compra-de-um-imovel",
    "titulo": "Quero desistir da compra de um imóvel. Tenho esse direito?",
    "intencao_curta": "Saber se é possível desistir da compra de um imóvel e quais valores podem ser devolvidos.",
    "resumo": "É comum surgir o desejo ou a necessidade de desistir da compra de um imóvel, seja por mudança de planos, dificuldade financeira ou problemas com a construtora. Dependendo do caso, o comprador pode ter direito de cancelar o contrato e receber parte dos valores pagos de volta. As regras variam conforme o tipo de compra.",
    "areas": [
      "imobiliario",
      "consumidor"
    ],
    "situacao": [
      "Comprar um imóvel é uma decisão grande, e nem sempre as coisas saem como o planejado. Perda de emprego, mudança de cidade, recusa do financiamento pelo banco ou atraso na obra são motivos frequentes que levam o comprador a querer desistir do negócio.",
      "Quando a compra é feita diretamente com uma construtora, em imóvel na planta, a desistência costuma dar ao comprador o direito de reaver parte do que pagou, embora a empresa possa reter um percentual a título de despesas. Já em compras entre pessoas, o que vale costuma ser o que está escrito no contrato.",
      "O problema é que muitas construtoras tentam reter quase tudo o que foi pago ou impõem multas elevadas. Por isso, é importante entender o contrato e os seus direitos antes de aceitar qualquer proposta de devolução."
    ],
    "passos": [
      {
        "titulo": "Leia o contrato com atenção",
        "texto": "Verifique as cláusulas sobre desistência, multa e devolução de valores. Elas indicam o que foi combinado e ajudam a entender a sua situação."
      },
      {
        "titulo": "Comunique a desistência por escrito",
        "texto": "Informe formalmente a construtora ou o vendedor sobre o seu pedido de cancelamento, guardando o comprovante. Evite acordos apenas verbais."
      },
      {
        "titulo": "Calcule os valores envolvidos",
        "texto": "Levante tudo o que já foi pago e compare com a devolução oferecida. Assim você percebe se a retenção proposta é razoável ou abusiva."
      },
      {
        "titulo": "Busque orientação se houver abuso",
        "texto": "Se a empresa quiser reter quase tudo ou impuser multa exagerada, procure o Procon ou um advogado para revisar as condições e cobrar a devolução justa."
      }
    ],
    "direitos": [
      "Direito de desistir da compra, conforme o tipo de contrato e a forma da negociação.",
      "Direito de receber de volta parte dos valores pagos, em muitos casos de imóvel na planta.",
      "Direito de questionar multas e retenções consideradas abusivas.",
      "Direito a informações claras sobre os valores cobrados e descontados na devolução."
    ],
    "quando_urgente": "Procure um advogado com urgência se a construtora está ameaçando reter todo o valor pago, se já existe cobrança ou negativação do seu nome por causa do contrato, ou se há prazos correndo para a sua resposta. Agir cedo pode evitar prejuízos maiores e ajudar a recuperar uma parte justa do que você investiu.",
    "documentos": [
      "Contrato de compra e venda ou de promessa de compra.",
      "Comprovantes de todos os valores já pagos, incluindo entrada e parcelas.",
      "Comunicações trocadas com a construtora ou o vendedor.",
      "Documento do banco que mostre a recusa do financiamento, se for o caso.",
      "Proposta de devolução apresentada pela empresa, se houver."
    ],
    "faq": [
      {
        "q": "A construtora pode ficar com tudo o que eu paguei se eu desistir?",
        "a": "Em geral, não. Mesmo havendo retenção de uma parte para cobrir despesas, ficar com todo o valor costuma ser considerado abusivo. Você pode questionar essa retenção e buscar a devolução justa."
      },
      {
        "q": "Desisti porque o banco não aprovou meu financiamento. Tenho que pagar multa?",
        "a": "Depende do contrato e da situação. Quando a desistência ocorre por recusa do financiamento sem culpa do comprador, é possível discutir a devolução dos valores. Um advogado pode avaliar o seu caso concreto."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "dono-nao-devolve-a-caucao-do-aluguel",
    "titulo": "O dono não devolve a caução do aluguel. O que fazer?",
    "intencao_curta": "Entender como recuperar o valor do depósito de garantia (caução) que o proprietário se recusa a devolver após a saída do imóvel.",
    "resumo": "Quando você aluga um imóvel e deixa um valor de garantia (a caução), esse dinheiro continua sendo seu. Ao entregar as chaves, se o imóvel estiver em ordem, o proprietário deve devolver a quantia, em geral corrigida. Se ele se recusa ou enrola, você tem caminhos para cobrar.",
    "areas": [
      "imobiliario",
      "civil"
    ],
    "situacao": [
      "A caução é um valor que o inquilino deposita no início do contrato como garantia, normalmente limitado a até três meses de aluguel. Esse dinheiro não pertence ao dono: é uma reserva para cobrir eventuais danos ou dívidas e deve voltar para o inquilino ao final, salvo se houver prejuízo comprovado.",
      "O problema costuma surgir quando o locador alega danos no imóvel, contas atrasadas ou simplesmente para de responder. Em muitos casos, o proprietário retém o valor sem apresentar provas concretas dos supostos prejuízos, ou desconta reformas que seriam de responsabilidade dele, e não do inquilino.",
      "Outra situação comum é o dono devolver só uma parte, sem prestar contas claras do que foi descontado. Quando a caução foi feita em poupança vinculada ao contrato, ela ainda deve ser devolvida com a correção, e não pode ser usada pelo locador como se fosse renda própria."
    ],
    "passos": [
      {
        "titulo": "Faça a vistoria de saída",
        "texto": "Compare o estado atual do imóvel com a vistoria de entrada e registre tudo com fotos e vídeos datados. Isso prova que você devolveu o imóvel em boas condições."
      },
      {
        "titulo": "Cobre formalmente por escrito",
        "texto": "Envie uma mensagem ou notificação pedindo a devolução e dando um prazo. Guarde o comprovante do pedido, pois ele será útil caso precise ir à Justiça."
      },
      {
        "titulo": "Tente o Procon ou um acordo",
        "texto": "Se não houver resposta, procure resolver por meio de conciliação. Muitas vezes a simples sinalização de uma ação resolve a pendência."
      },
      {
        "titulo": "Procure um advogado ou o Juizado",
        "texto": "Para valores menores, é possível acionar o Juizado Especial Cível, em alguns casos sem advogado. Um profissional pode orientar sobre o melhor caminho."
      }
    ],
    "direitos": [
      "Receber de volta o valor da caução, em geral corrigido, quando o imóvel é devolvido sem danos e sem dívidas pendentes.",
      "Exigir que o proprietário comprove, com documentos e vistoria, qualquer desconto que pretenda fazer.",
      "Não arcar com o desgaste natural do imóvel pelo uso normal nem com reformas que são obrigação do dono.",
      "Em muitos casos, pleitear correção e, havendo retenção indevida, eventual indenização, conforme a situação concreta."
    ],
    "quando_urgente": "Procure um advogado com urgência se o proprietário ameaçar usar a caução para forçar você a assinar documentos, se o prazo para cobrar estiver próximo de se esgotar, ou se a retenção indevida estiver causando dificuldade financeira séria. Quanto antes você reunir as provas e formalizar a cobrança, mais fortes ficam as suas chances.",
    "documentos": [
      "Contrato de locação assinado, onde consta o valor e a forma da caução.",
      "Comprovante do depósito ou recibo da caução paga no início.",
      "Vistoria de entrada e vistoria de saída do imóvel.",
      "Fotos e vídeos datados do estado do imóvel na devolução das chaves.",
      "Comprovantes de pagamento dos aluguéis e das contas (água, luz, condomínio) em dia."
    ],
    "faq": [
      {
        "q": "O dono pode descontar reformas da caução?",
        "a": "Só pode descontar danos que você causou e que estejam comprovados na vistoria. O desgaste natural pelo uso e reparos estruturais são responsabilidade do proprietário, e ele precisa justificar cada desconto."
      },
      {
        "q": "Quanto tempo o proprietário tem para devolver a caução?",
        "a": "A lei não fixa um número exato de dias, mas a devolução deve ocorrer logo após a entrega das chaves e a conferência do imóvel. Se ele demora sem justificativa, você pode cobrar formalmente e, se preciso, na Justiça."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "fui-preso-em-flagrante-e-nao-sei-o-que-fazer",
    "titulo": "Fui preso em flagrante e não sei o que fazer. Quais são meus direitos?",
    "intencao_curta": "Saber como agir e quais são os direitos de quem foi preso em flagrante, desde o momento da abordagem até a audiência de custódia.",
    "resumo": "Ser preso em flagrante é um momento de muito medo, mas você tem direitos garantidos pela Constituição. O principal é permanecer calado e contar com um advogado. Nada do que você diga sem orientação pode ser usado para piorar a sua situação, e nem todo flagrante significa que você ficará preso.",
    "areas": [
      "criminal"
    ],
    "situacao": [
      "A prisão em flagrante acontece quando a pessoa é detida durante a prática de um crime ou logo depois dele. A pessoa é levada à delegacia, onde a autoridade policial registra a ocorrência e lavra o auto de prisão em flagrante, ouvindo testemunhas e o próprio preso, se ele quiser falar.",
      "Muita gente, por nervosismo, acaba dando explicações ou assinando documentos sem entender o conteúdo, o que pode prejudicar a defesa. É comum também o preso não saber que tem direito a avisar a família e a falar com um advogado antes de qualquer depoimento.",
      "Depois da prisão, em geral em até 24 horas, a pessoa deve ser apresentada a um juiz na chamada audiência de custódia. Nesse momento, decide-se se a prisão será mantida, se vira prisão preventiva ou se a pessoa responde em liberdade, com ou sem medidas como fiança."
    ],
    "passos": [
      {
        "titulo": "Fique calado e mantenha a calma",
        "texto": "Você tem o direito de não responder perguntas e de não se incriminar. Diga com educação que só vai falar na presença de um advogado."
      },
      {
        "titulo": "Peça para avisar a família e um advogado",
        "texto": "Você tem direito de comunicar a prisão a um familiar e de ter assistência de advogado. Se não puder pagar, peça a Defensoria Pública."
      },
      {
        "titulo": "Não assine o que não entender",
        "texto": "Leia ou peça que leiam o que você vai assinar. Relate qualquer agressão ou abuso que tenha sofrido na abordagem ou na delegacia."
      },
      {
        "titulo": "Prepare-se para a audiência de custódia",
        "texto": "Nessa audiência o juiz avalia a legalidade da prisão. Ter um advogado presente aumenta as chances de responder ao processo em liberdade."
      }
    ],
    "direitos": [
      "Permanecer em silêncio e não produzir prova contra si mesmo, sem que isso seja interpretado como confissão.",
      "Ser assistido por advogado e, se não tiver condições, pela Defensoria Pública gratuitamente.",
      "Comunicar a prisão à família ou a pessoa de confiança e saber o motivo da detenção.",
      "Ser tratado com respeito e integridade física, sem tortura, agressões ou humilhações."
    ],
    "quando_urgente": "A urgência é imediata: a família deve procurar um advogado ou a Defensoria Pública assim que souber da prisão, de preferência antes da audiência de custódia. Os primeiros momentos são decisivos para garantir que os direitos sejam respeitados, para relatar eventuais abusos e para pleitear a liberdade. Não deixe o preso ser interrogado sem orientação jurídica.",
    "documentos": [
      "Documento de identidade e CPF do preso, se disponíveis.",
      "Cópia do auto de prisão em flagrante e do boletim de ocorrência.",
      "Comprovantes de residência, trabalho e renda, que ajudam a mostrar vínculos com a comunidade.",
      "Nomes e contatos de testemunhas que possam esclarecer os fatos.",
      "Registros de eventuais lesões ou maus-tratos, como fotos e laudos médicos."
    ],
    "faq": [
      {
        "q": "Toda prisão em flagrante vira cadeia até o julgamento?",
        "a": "Não. Na audiência de custódia o juiz pode relaxar a prisão, conceder liberdade provisória, arbitrar fiança ou impor medidas alternativas. A prisão só se mantém em situações específicas, e um advogado pode pedir a soltura."
      },
      {
        "q": "Sou obrigado a falar na delegacia?",
        "a": "Não. Você tem o direito constitucional de permanecer calado e de só se manifestar com um advogado. O silêncio não pode ser usado contra você nem tratado como confissão de culpa."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "recebi-uma-intimacao-para-depor",
    "titulo": "Recebi uma intimação para depor. O que isso significa?",
    "intencao_curta": "Entender o que é uma intimação para depor, a diferença entre ser testemunha ou investigado e como se preparar para o depoimento.",
    "resumo": "Receber uma intimação para depor costuma assustar, mas nem sempre significa que você é acusado de algo. Você pode estar sendo chamado como testemunha ou como investigado, e isso muda bastante os seus direitos. Em geral, comparecer é obrigatório, mas você nunca é obrigado a se prejudicar.",
    "areas": [
      "criminal",
      "civil"
    ],
    "situacao": [
      "A intimação é o documento oficial pelo qual a polícia, o Ministério Público ou a Justiça convoca alguém a comparecer e prestar depoimento. Ela pode chegar pelos Correios, por oficial de justiça, por meio eletrônico ou até por telefone, e normalmente indica dia, hora, local e a quem você deve se apresentar.",
      "O ponto mais importante é descobrir em que condição você foi chamado. Como testemunha, em regra você tem o dever de dizer a verdade sobre o que sabe. Como investigado ou suspeito, você tem o direito de ficar calado e de não produzir prova contra si mesmo.",
      "Muita gente comparece sozinha e sem entender o teor da intimação, o que pode levar a respostas mal interpretadas. Por isso, ler com atenção o documento e, sempre que possível, conversar antes com um advogado faz grande diferença para um depoimento tranquilo e seguro."
    ],
    "passos": [
      {
        "titulo": "Leia a intimação com atenção",
        "texto": "Verifique data, horário, local, o órgão que chamou e, principalmente, em que condição você foi intimado: testemunha, vítima ou investigado."
      },
      {
        "titulo": "Procure um advogado antes de depor",
        "texto": "Um profissional explica seus direitos e ajuda a entender o assunto. Você pode comparecer acompanhado de advogado, inclusive como testemunha."
      },
      {
        "titulo": "Não falte sem justificar",
        "texto": "Em geral o comparecimento é obrigatório. Se não puder ir na data marcada, comunique e justifique com antecedência para evitar condução coercitiva."
      },
      {
        "titulo": "Diga apenas o que você sabe",
        "texto": "Responda com calma e sinceridade ao que de fato conhece. Não invente nem chute respostas; é legítimo dizer que não sabe ou não se lembra."
      }
    ],
    "direitos": [
      "Saber em que condição foi intimado e qual é o assunto, para entender o seu papel no caso.",
      "Ser acompanhado por advogado durante o depoimento, mesmo quando você é apenas testemunha.",
      "Permanecer em silêncio quando o depoimento puder incriminar você, sem que isso seja usado como prova de culpa.",
      "Ser tratado com respeito e ter o depoimento registrado de forma fiel ao que você disse."
    ],
    "quando_urgente": "Procure um advogado com urgência se a intimação indicar que você é investigado ou suspeito, se o depoimento for em processo criminal, ou se você temer que suas respostas possam prejudicá-lo. Também é prudente buscar orientação rápida quando o prazo entre a intimação e o depoimento é curto, para que você não compareça despreparado. Antecipar essa conversa evita erros que dificultam a defesa depois.",
    "documentos": [
      "A própria intimação recebida, com todos os dados e o número do processo ou inquérito.",
      "Documento de identidade com foto e CPF.",
      "Documentos que ajudem a esclarecer os fatos sobre os quais você será ouvido.",
      "Anotações suas com datas, nomes e detalhes que você lembre do ocorrido.",
      "Comprovante de eventual impedimento, como atestado médico, caso precise remarcar."
    ],
    "faq": [
      {
        "q": "Sou obrigado a comparecer se for intimado?",
        "a": "Em geral sim, especialmente quando intimado como testemunha. Faltar sem justificativa pode gerar consequências, como nova intimação ou condução coercitiva. Se não puder ir, justifique antes e peça remarcação."
      },
      {
        "q": "Posso levar um advogado mesmo sendo testemunha?",
        "a": "Sim. Você pode comparecer acompanhado de advogado em qualquer condição. Isso ajuda a garantir que seus direitos sejam respeitados e que o depoimento seja registrado corretamente."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "fui-vitima-de-estelionato",
    "titulo": "Fui vítima de estelionato. Como recuperar meu dinheiro?",
    "intencao_curta": "Saber como agir após cair em um golpe de estelionato, registrar o crime e buscar a recuperação dos valores perdidos.",
    "resumo": "O estelionato é o golpe em que alguém engana você para obter vantagem, normalmente fazendo você entregar dinheiro ou dados acreditando em algo falso. É crime, e você é a vítima. Agir rápido, reunir provas e registrar a ocorrência aumenta as chances de responsabilizar o golpista e tentar reaver o valor.",
    "areas": [
      "criminal",
      "consumidor"
    ],
    "situacao": [
      "O estelionato acontece de muitas formas: falsas vendas pela internet, promessas de empréstimo fácil, golpes que se passam por bancos ou parentes em apuros, perfis falsos e cobranças enganosas. O golpista usa a sua confiança e a sua boa-fé para conseguir dinheiro ou informações pessoais.",
      "Costuma começar com um contato aparentemente confiável, por mensagem, ligação ou site parecido com o verdadeiro. A vítima é levada a fazer um pagamento, uma transferência ou a informar senhas e códigos, e só percebe o golpe quando o dinheiro já saiu ou o produto não chega.",
      "Depois do golpe, é comum a sensação de vergonha e a dúvida sobre o que fazer. Mas é importante saber que a culpa é de quem aplicou o golpe. Reunir as provas e registrar tudo o quanto antes é o caminho para buscar responsabilização e, em muitos casos, a devolução dos valores."
    ],
    "passos": [
      {
        "titulo": "Reúna todas as provas",
        "texto": "Guarde prints de conversas, comprovantes de pagamento, e-mails, números de telefone e dados de quem recebeu o dinheiro. Não apague nada."
      },
      {
        "titulo": "Avise o banco imediatamente",
        "texto": "Comunique a fraude ao seu banco e tente bloquear ou contestar a transação. Em pagamentos recentes, há mecanismos que podem ajudar a barrar o valor."
      },
      {
        "titulo": "Registre o boletim de ocorrência",
        "texto": "Faça a comunicação à polícia, presencialmente ou pela delegacia eletrônica. Esse registro é essencial para a investigação e para qualquer cobrança."
      },
      {
        "titulo": "Procure um advogado",
        "texto": "Um profissional avalia se cabe ação para recuperar o valor e orienta sobre os caminhos contra o golpista ou contra empresas que falharam na segurança."
      }
    ],
    "direitos": [
      "Registrar a ocorrência e ter o caso apurado, já que o estelionato é crime e você é a vítima.",
      "Contestar transações fraudulentas junto ao banco e a instituições de pagamento.",
      "Em muitos casos, buscar na Justiça a devolução dos valores e eventual indenização, conforme a situação.",
      "Ser tratado com respeito pelas instituições, sem ser culpado por ter sido enganado."
    ],
    "quando_urgente": "A urgência é máxima nas primeiras horas. Avise o banco e registre a ocorrência o mais rápido possível, pois quanto antes a transação for contestada, maiores as chances de bloquear o dinheiro antes que ele desapareça. Procure um advogado com urgência se os valores forem altos, se seus dados pessoais foram expostos ou se você seguir recebendo ameaças e novas tentativas de golpe.",
    "documentos": [
      "Comprovantes de transferência, pagamento ou Pix realizados ao golpista.",
      "Prints das conversas, mensagens, e-mails e anúncios usados no golpe.",
      "Dados de identificação do golpista, como telefone, perfil, conta ou chave que recebeu o valor.",
      "Boletim de ocorrência registrado na polícia.",
      "Extratos bancários que mostrem a movimentação fraudulenta."
    ],
    "faq": [
      {
        "q": "Consigo recuperar o dinheiro perdido em um golpe?",
        "a": "Nem sempre, mas é possível em muitos casos, principalmente se você agir rápido junto ao banco e registrar a ocorrência. A recuperação depende de identificar o golpista, do tipo de transação e da resposta das instituições envolvidas."
      },
      {
        "q": "Vale a pena registrar boletim de ocorrência por golpe?",
        "a": "Sim. O registro formaliza o crime, permite a investigação, ajuda a alertar outras vítimas e costuma ser exigido para contestar valores junto ao banco e para eventual ação na Justiça."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "sofri-calunia-injuria-ou-difamacao",
    "titulo": "Sofri calúnia, injúria ou difamação. O que posso fazer?",
    "intencao_curta": "Entender a diferença entre calúnia, injúria e difamação e como se defender de ofensas à sua honra e reputação.",
    "resumo": "Quando alguém mente sobre você, mancha o seu nome ou ofende a sua dignidade, isso pode ser crime contra a honra: calúnia, difamação ou injúria. Você tem o direito de se defender, exigir reparação e, em muitos casos, pedir indenização. Guardar as provas das ofensas é o primeiro passo.",
    "areas": [
      "criminal",
      "civil"
    ],
    "situacao": [
      "Esses três crimes protegem a sua honra, mas são diferentes. Calúnia é quando alguém atribui a você um crime que você não cometeu. Difamação é quando espalham um fato ofensivo à sua reputação, ainda que não seja crime. Injúria é o xingamento ou ofensa direta à sua dignidade, como palavras de baixo calão.",
      "Hoje essas ofensas acontecem muito nas redes sociais, em grupos de mensagens, comentários e áudios, mas também ocorrem no trabalho, na vizinhança e na família. O alcance da internet pode ampliar o estrago, atingindo sua imagem perante muitas pessoas em pouco tempo.",
      "A vítima costuma se sentir humilhada e sem saber como reagir. É importante entender que ofender a honra de alguém tem consequências legais. Além da esfera criminal, é possível buscar reparação na Justiça pelos danos morais sofridos, conforme o caso concreto."
    ],
    "passos": [
      {
        "titulo": "Preserve as provas das ofensas",
        "texto": "Salve prints, links, áudios, vídeos e nomes de testemunhas. Em conteúdos da internet, registre data e endereço da publicação antes que sejam apagados."
      },
      {
        "titulo": "Avalie uma ata notarial",
        "texto": "Para ofensas on-line, um cartório pode lavrar ata notarial registrando o conteúdo. Isso dá mais força às provas caso o material seja excluído depois."
      },
      {
        "titulo": "Procure um advogado",
        "texto": "Um profissional identifica se o caso é calúnia, injúria ou difamação e orienta sobre a medida criminal e o pedido de indenização por danos morais."
      },
      {
        "titulo": "Fique atento aos prazos",
        "texto": "Os crimes contra a honra têm prazos curtos para a vítima agir. Não deixe para depois; buscar orientação cedo evita a perda do direito de processar."
      }
    ],
    "direitos": [
      "Ter a sua honra e a sua imagem protegidas contra mentiras, ofensas e exposições indevidas.",
      "Buscar a responsabilização criminal de quem ofendeu, conforme o tipo de ofensa praticada.",
      "Em muitos casos, pleitear indenização por danos morais na Justiça civil.",
      "Pedir a retirada do conteúdo ofensivo das redes e, quando cabível, o direito de resposta."
    ],
    "quando_urgente": "Procure um advogado com urgência porque os crimes contra a honra têm prazos curtos para a vítima tomar providências, e a demora pode fazer você perder o direito de processar. A pressa também ajuda a preservar as provas antes que mensagens e publicações sejam apagadas. Se as ofensas vierem acompanhadas de ameaças ou estiverem se espalhando rapidamente, a atuação rápida é ainda mais importante.",
    "documentos": [
      "Prints, fotos e gravações das ofensas, com data e horário visíveis.",
      "Links das publicações, comentários ou perfis envolvidos.",
      "Identificação de quem ofendeu, sempre que possível.",
      "Nomes e contatos de testemunhas que presenciaram as ofensas.",
      "Ata notarial do conteúdo on-line, quando houver, e documentos que mostrem o prejuízo sofrido."
    ],
    "faq": [
      {
        "q": "Qual a diferença entre calúnia, difamação e injúria?",
        "a": "Calúnia é acusar você falsamente de um crime. Difamação é espalhar fato que mancha sua reputação. Injúria é ofender diretamente sua dignidade, como um xingamento. Os três protegem a honra, mas de formas diferentes."
      },
      {
        "q": "Ofensa em rede social dá direito a indenização?",
        "a": "Pode dar. Em muitos casos, ofensas públicas que atingem a honra geram direito a reparação por danos morais. O valor e o cabimento dependem da gravidade, do alcance e das provas reunidas, por isso é importante consultar um advogado."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "estou-sendo-ameacado",
    "titulo": "Estou sendo ameaçado. Como me proteger?",
    "intencao_curta": "Saber como agir e se proteger ao receber ameaças, registrar o caso e buscar medidas de segurança pela Justiça.",
    "resumo": "Receber ameaças é assustador e não deve ser tratado como algo normal. Ameaçar alguém de causar mal grave e injusto é crime. Você tem o direito de se proteger, registrar a ocorrência e, em situações de risco, pedir medidas de proteção. Guardar provas e buscar ajuda rápido é fundamental para a sua segurança.",
    "areas": [
      "criminal",
      "familia"
    ],
    "situacao": [
      "A ameaça acontece quando alguém promete causar a você um mal sério e injusto, como agredir, matar ou prejudicar gravemente. Pode vir por palavras, gestos, mensagens, áudios, ligações ou recados passados por terceiros, presencialmente ou pela internet.",
      "As ameaças surgem em contextos variados: conflitos entre vizinhos, brigas no trânsito, cobranças, disputas de trabalho e, com muita frequência, dentro de relacionamentos e da família. Quando a ameaça parte de companheiro, ex-parceiro ou familiar, ela pode se enquadrar em situação de violência doméstica, com proteção específica.",
      "Muitas vítimas hesitam em denunciar por medo de represálias ou por achar que não vão ser levadas a sério. Mas a sua segurança vem em primeiro lugar, e existem caminhos legais para conter o agressor e registrar o que está acontecendo, inclusive de forma reservada quando necessário."
    ],
    "passos": [
      {
        "titulo": "Priorize sua segurança",
        "texto": "Se houver perigo imediato, ligue para a polícia (190). Evite ficar sozinho com quem ameaça e avise pessoas de confiança sobre a situação."
      },
      {
        "titulo": "Guarde todas as provas",
        "texto": "Salve mensagens, áudios, ligações, prints e anote datas, horários e testemunhas. Esse material ajuda a comprovar as ameaças."
      },
      {
        "titulo": "Registre o boletim de ocorrência",
        "texto": "Vá à delegacia e relate tudo. Em casos de violência doméstica, procure a Delegacia da Mulher e peça medidas protetivas de urgência."
      },
      {
        "titulo": "Procure um advogado ou a Defensoria",
        "texto": "A orientação jurídica ajuda a entender as medidas cabíveis, como pedidos de proteção e a responsabilização de quem ameaça."
      }
    ],
    "direitos": [
      "Ter a sua integridade e a sua vida protegidas, pois a ameaça grave e injusta é crime.",
      "Registrar a ocorrência e exigir que a situação seja apurada pelas autoridades.",
      "Em casos de violência doméstica, solicitar medidas protetivas de urgência, como afastamento e proibição de contato.",
      "Ser atendido com sigilo e respeito, sem ser culpado ou desencorajado a denunciar."
    ],
    "quando_urgente": "A urgência é imediata quando há risco à sua vida ou à sua integridade física, quando as ameaças são repetidas, quando envolvem armas, ou quando partem de pessoa com quem você convive. Nesses casos, acione a polícia, registre a ocorrência e, em situação de violência doméstica, peça medidas protetivas de urgência o quanto antes. Não espere a ameaça se concretizar para buscar ajuda e orientação jurídica.",
    "documentos": [
      "Mensagens, áudios, e-mails e prints com as ameaças, mostrando data e horário.",
      "Identificação de quem ameaça, como nome, telefone ou perfil.",
      "Nomes e contatos de testemunhas das ameaças.",
      "Boletim de ocorrência e, se houver, o pedido de medidas protetivas.",
      "Documento de identidade e comprovante de residência seu."
    ],
    "faq": [
      {
        "q": "Ameaça só por mensagem ou áudio também é crime?",
        "a": "Sim. A ameaça pode ser feita por palavras, escrito, gestos ou qualquer meio, inclusive mensagens, áudios e redes sociais. O importante é que represente a promessa de um mal grave e injusto, e por isso vale guardar todo o conteúdo."
      },
      {
        "q": "O que são medidas protetivas de urgência?",
        "a": "São decisões rápidas da Justiça para proteger a vítima, comuns em violência doméstica. Podem incluir o afastamento do agressor, a proibição de aproximação e de contato. São pedidas, em geral, a partir do registro na delegacia."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "recebi-multa-de-transito-que-considero-indevida",
    "titulo": "Recebi uma multa de trânsito que considero indevida. O que fazer?",
    "intencao_curta": "Orientar quem quer contestar uma multa de trânsito que acredita ser injusta ou irregular.",
    "resumo": "Você não precisa simplesmente aceitar e pagar uma multa que considera errada. A lei garante o direito de se defender em etapas, e muitas autuações têm falhas que podem levar ao cancelamento. Veja como recorrer com calma e organização.",
    "areas": [
      "civil",
      "consumidor"
    ],
    "situacao": [
      "É comum receber em casa uma notificação de multa por uma infração que você não cometeu, ou cuja descrição não bate com o que aconteceu. Às vezes o problema é um erro no local, no horário, na placa do veículo ou até na identificação do equipamento que registrou a suposta infração.",
      "Em outros casos, a multa pode ser legítima na intenção, mas conter vícios formais: falta de informações obrigatórias, demora excessiva para enviar a notificação ou ausência da chance de você se defender antes da penalidade. Esses detalhes importam e podem anular a autuação.",
      "O sistema de trânsito prevê momentos diferentes para você reagir, começando pela defesa prévia e seguindo por recursos a órgãos superiores. Quanto antes você agir e juntar provas, maiores costumam ser as chances de reverter a cobrança."
    ],
    "passos": [
      {
        "titulo": "Leia a notificação com atenção",
        "texto": "Verifique data, hora, local, placa, o tipo de infração e o prazo para se manifestar. Qualquer informação errada ou ausente pode ser um argumento a seu favor."
      },
      {
        "titulo": "Apresente a defesa prévia",
        "texto": "Antes de a multa virar penalidade definitiva, há um prazo para apresentar a chamada defesa da autuação ao órgão que aplicou a multa. Use esse momento para apontar erros e anexar provas."
      },
      {
        "titulo": "Recorra às instâncias seguintes se necessário",
        "texto": "Se a defesa for negada, ainda é possível recorrer à junta administrativa de recursos e, depois, ao conselho de trânsito. Cada etapa tem seu próprio prazo, indicado na resposta que você recebe."
      },
      {
        "titulo": "Guarde tudo e procure orientação",
        "texto": "Mantenha cópias de todos os documentos e protocolos. Em casos mais complexos, um advogado pode avaliar as melhores chances e elaborar o recurso."
      }
    ],
    "direitos": [
      "Direito de ser notificado da autuação e da penalidade dentro dos prazos legais, com todas as informações obrigatórias.",
      "Direito de apresentar defesa prévia antes de a multa se tornar definitiva.",
      "Direito de recorrer às instâncias administrativas superiores sem precisar pagar a multa antecipadamente para isso.",
      "Direito ao cancelamento da multa quando houver erro material ou vício na autuação."
    ],
    "quando_urgente": "Procure ajuda com urgência se o prazo para defesa ou recurso estiver acabando, pois perder o prazo costuma fechar essa porta. Também busque orientação rápida se a infração puder gerar suspensão da habilitação, somar muitos pontos ou se houver risco de o carro ser bloqueado por dívidas acumuladas.",
    "documentos": [
      "A notificação de autuação e a notificação de penalidade recebidas.",
      "Documento do veículo (CRLV) e sua habilitação.",
      "Fotos, vídeos ou comprovantes que mostrem o erro (por exemplo, que você estava em outro lugar).",
      "Comprovantes de protocolo das defesas e recursos já apresentados.",
      "Eventuais testemunhas ou documentos que sustentem sua versão."
    ],
    "faq": [
      {
        "q": "Preciso pagar a multa para poder recorrer?",
        "a": "Não. Você tem direito de apresentar defesa e recursos administrativos sem pagar a multa antes. O pagamento só seria devido se, ao final, o recurso não for aceito."
      },
      {
        "q": "Se eu não era o condutor, ainda assim respondo pela multa?",
        "a": "O dono do veículo costuma ser responsável, mas é possível indicar o verdadeiro condutor dentro do prazo. Sem essa indicação, a responsabilidade tende a recair sobre o proprietário."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "minha-cnh-foi-suspensa",
    "titulo": "Minha CNH foi suspensa. O que eu posso fazer?",
    "intencao_curta": "Explicar o que significa a suspensão da habilitação e como tentar reverter ou reduzir o impacto.",
    "resumo": "Ter a habilitação suspensa não significa, necessariamente, ficar sem alternativas. Existe a chance de se defender, recorrer e, em alguns casos, evitar a suspensão. Entenda as etapas e os seus direitos para reagir da forma certa.",
    "areas": [
      "civil"
    ],
    "situacao": [
      "A suspensão do direito de dirigir costuma acontecer quando o condutor acumula muitos pontos na habilitação dentro de um período ou comete uma infração que, sozinha, já prevê a suspensão. Em geral, você recebe uma notificação informando a abertura desse processo.",
      "Muita gente descobre a suspensão tarde demais ou acredita que não há como reagir, e acaba dirigindo mesmo suspenso, o que agrava a situação. Na verdade, antes de a suspensão valer, há um processo administrativo com direito de defesa.",
      "Também é possível que a contagem de pontos esteja errada, que uma das multas usadas no cálculo seja questionável, ou que falte alguma formalidade na notificação. Esses pontos podem ser usados para tentar derrubar ou reduzir a penalidade."
    ],
    "passos": [
      {
        "titulo": "Confirme o motivo e a fase do processo",
        "texto": "Veja se a suspensão é por pontos acumulados ou por uma infração específica e descubra em que etapa o processo está. Isso define qual defesa ou recurso cabe agora."
      },
      {
        "titulo": "Apresente defesa e recursos no prazo",
        "texto": "Há prazo para se defender antes de a suspensão valer e, depois, para recorrer às instâncias superiores. Conteste pontos indevidos e eventuais falhas na notificação."
      },
      {
        "titulo": "Não dirija enquanto estiver suspenso",
        "texto": "Dirigir durante a suspensão pode gerar penalidade muito mais grave, inclusive cassação da habilitação. Espere a decisão definitiva antes de voltar a dirigir."
      },
      {
        "titulo": "Avalie alternativas com um advogado",
        "texto": "Em algumas situações é possível pedir a substituição da suspensão por curso de reciclagem ou discutir a penalidade na Justiça. Um advogado pode indicar o melhor caminho."
      }
    ],
    "direitos": [
      "Direito de ser notificado da abertura do processo de suspensão antes de a penalidade valer.",
      "Direito de apresentar defesa e recursos administrativos contra a suspensão.",
      "Direito de questionar a contagem de pontos e as multas usadas no cálculo.",
      "Direito de buscar a Justiça caso entenda que a suspensão é ilegal ou desproporcional."
    ],
    "quando_urgente": "Busque orientação imediata assim que receber a notificação, porque os prazos para defesa e recurso são curtos e decisivos. A urgência é ainda maior se você depende do carro para trabalhar, pois um advogado pode tentar medidas para suspender os efeitos da penalidade enquanto o caso é discutido.",
    "documentos": [
      "A notificação do processo de suspensão recebida.",
      "Sua habilitação e o extrato de pontos atualizado.",
      "Cópias das multas que fundamentaram a suspensão.",
      "Comprovantes de recursos ou defesas já apresentados em cada multa.",
      "Documentos que mostrem a dependência do veículo para trabalhar, se for o caso."
    ],
    "faq": [
      {
        "q": "Posso dirigir enquanto recorro da suspensão?",
        "a": "Em geral, sim, enquanto a suspensão não se torna definitiva você ainda pode dirigir. Mas confirme a situação do processo, pois dirigir já suspenso pode levar à cassação da habilitação."
      },
      {
        "q": "É possível trocar a suspensão por um curso?",
        "a": "Em determinados casos a lei permite frequentar curso de reciclagem como alternativa, dependendo do motivo da suspensão. Um advogado pode verificar se essa opção cabe no seu caso."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "meu-carro-foi-apreendido-ou-guinchado",
    "titulo": "Meu carro foi apreendido ou guinchado. Como recuperar?",
    "intencao_curta": "Orientar quem teve o veículo removido ou apreendido sobre como recuperá-lo e contestar irregularidades.",
    "resumo": "Quando o carro é guinchado ou apreendido, o desespero é grande, mas há um caminho para recuperá-lo e, se houver irregularidade, para questionar os custos. Saiba quais documentos levar e como agir para evitar que a dívida cresça.",
    "areas": [
      "civil",
      "consumidor"
    ],
    "situacao": [
      "A remoção do veículo costuma acontecer por estacionamento irregular, falta de documentação, dívidas pendentes ou durante uma fiscalização. O carro é levado a um pátio e fica retido até que as pendências sejam resolvidas e as taxas, pagas.",
      "O problema é que, a cada dia parado no pátio, costumam ser cobradas diárias que aumentam o valor a pagar. Por isso, agir rápido para entender o motivo e providenciar a liberação faz muita diferença no bolso.",
      "Em alguns casos, a apreensão ou os valores cobrados podem ser irregulares, como diárias excessivas, cobrança por serviços não prestados ou retenção sem base legal. Essas situações podem ser contestadas administrativamente ou na Justiça."
    ],
    "passos": [
      {
        "titulo": "Descubra o motivo e o local",
        "texto": "Confirme qual órgão removeu o veículo e para qual pátio ele foi levado. Saber o motivo exato é o primeiro passo para resolver as pendências."
      },
      {
        "titulo": "Regularize as pendências necessárias",
        "texto": "Em geral é preciso quitar ou parcelar débitos, apresentar documentação e pagar as taxas de remoção e diárias para liberar o carro. Verifique exatamente o que é exigido."
      },
      {
        "titulo": "Peça o detalhamento dos valores",
        "texto": "Exija a discriminação de cada cobrança. Se notar diárias abusivas ou taxas indevidas, registre o questionamento por escrito antes de pagar tudo sem conferir."
      },
      {
        "titulo": "Conteste irregularidades",
        "texto": "Se a apreensão ou os valores forem ilegais, é possível recorrer ao órgão e, se preciso, à Justiça para liberar o veículo e pedir devolução do que foi cobrado a mais."
      }
    ],
    "direitos": [
      "Direito de saber o motivo da apreensão e o órgão responsável pela remoção.",
      "Direito de receber a discriminação clara de todas as taxas e diárias cobradas.",
      "Direito de contestar cobranças abusivas e apreensões sem base legal.",
      "Direito de recuperar o veículo após regularizar as pendências exigidas por lei."
    ],
    "quando_urgente": "Procure ajuda com urgência porque as diárias do pátio costumam crescer rápido e podem inviabilizar a recuperação do carro. A urgência aumenta se houver risco de o veículo ir a leilão por falta de retirada, ou se você suspeitar que a apreensão foi ilegal e precisa de uma medida judicial rápida para liberá-lo.",
    "documentos": [
      "Documento do veículo (CRLV) e sua habilitação.",
      "Comprovante de propriedade ou autorização do proprietário.",
      "Auto de infração ou termo de remoção, se houver.",
      "Recibos e a planilha discriminada das taxas e diárias cobradas.",
      "Fotos do veículo e do local, quando puderem ajudar a provar irregularidades."
    ],
    "faq": [
      {
        "q": "Sou obrigado a pagar todas as diárias para retirar o carro?",
        "a": "Você precisa quitar as taxas devidas, mas pode contestar valores abusivos. Em muitos casos é possível pagar para liberar o veículo e depois pedir a devolução do que foi cobrado indevidamente."
      },
      {
        "q": "O carro pode ir a leilão se eu demorar para buscar?",
        "a": "Sim, veículos não retirados após certo período podem ir a leilão. Por isso é importante agir rápido e, se não puder pagar tudo, procurar orientação para evitar a perda do bem."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "o-seguro-do-carro-negou-o-pagamento",
    "titulo": "O seguro do carro negou o pagamento. Tenho como reverter?",
    "intencao_curta": "Ajudar quem teve a indenização do seguro do automóvel recusada a entender se a negativa é válida e como contestar.",
    "resumo": "Nem toda recusa da seguradora é legítima. Muitas negativas podem ser revertidas quando não há justificativa clara ou quando se baseiam em motivos frágeis. Entenda como exigir explicações e contestar a decisão para receber o que é seu por direito.",
    "areas": [
      "consumidor",
      "civil"
    ],
    "situacao": [
      "Depois de um acidente, furto ou roubo, é comum acionar o seguro e, em vez do pagamento, receber uma negativa. As seguradoras costumam justificar com argumentos como informação incorreta no contrato, uso do veículo fora do previsto ou suposta falta de cobertura.",
      "Em muitos casos, porém, a recusa é discutível. A seguradora precisa apontar de forma clara e comprovada o motivo, e não pode negar com base em detalhes irrelevantes ou em cláusulas confusas que o consumidor não tinha como entender.",
      "Por ser uma relação de consumo, você tem proteção reforçada. Se a negativa for genérica, mal fundamentada ou desproporcional, há boas chances de reverter, seja por meio de reclamação, seja na Justiça, inclusive com pedido de indenização."
    ],
    "passos": [
      {
        "titulo": "Exija a negativa por escrito",
        "texto": "Peça à seguradora o motivo formal da recusa, com base em cláusula específica do contrato. Uma negativa vaga ou apenas verbal já é, por si só, questionável."
      },
      {
        "titulo": "Compare com a apólice contratada",
        "texto": "Releia a apólice e as coberturas que você contratou. Verifique se o motivo da recusa realmente está previsto ou se a seguradora está interpretando o contrato contra você."
      },
      {
        "titulo": "Reclame nos canais de defesa",
        "texto": "Registre reclamação na ouvidoria da seguradora, no órgão regulador de seguros e em plataformas de defesa do consumidor. Muitas negativas são revistas nessa fase."
      },
      {
        "titulo": "Busque a Justiça se necessário",
        "texto": "Se a recusa persistir e for indevida, um advogado pode acionar a Justiça para exigir o pagamento e, em alguns casos, indenização pelos prejuízos causados."
      }
    ],
    "direitos": [
      "Direito de receber a justificativa da recusa por escrito, com base em cláusula clara do contrato.",
      "Direito de exigir o cumprimento das coberturas que foram efetivamente contratadas.",
      "Direito de questionar cláusulas abusivas ou confusas que o prejudiquem como consumidor.",
      "Direito de buscar indenização quando a negativa indevida causar prejuízos."
    ],
    "quando_urgente": "Procure orientação com urgência se você depende do carro e o prejuízo está se acumulando, ou se a seguradora deu um prazo curto para você se manifestar. A pressa também é importante para não perder o prazo de cobrança do seguro, que tende a ser mais curto do que o de outras dívidas, e um advogado pode orientar sobre isso.",
    "documentos": [
      "Apólice do seguro e as condições gerais do contrato.",
      "A negativa formal enviada pela seguradora.",
      "Boletim de ocorrência, no caso de acidente, furto ou roubo.",
      "Comprovantes de pagamento das parcelas do seguro em dia.",
      "Fotos, orçamentos de conserto e demais provas do prejuízo sofrido."
    ],
    "faq": [
      {
        "q": "A seguradora pode negar só porque achou um erro nos meus dados?",
        "a": "Só se o erro for relevante e tiver influência real no risco ou no sinistro. Pequenas divergências, sem ligação com o ocorrido, em geral não justificam a recusa do pagamento."
      },
      {
        "q": "Vale a pena reclamar antes de ir à Justiça?",
        "a": "Sim. A reclamação na ouvidoria e nos órgãos de defesa do consumidor costuma ser rápida e gratuita, e muitas seguradoras revisam a negativa para evitar um processo."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "comprei-carro-com-defeito-escondido",
    "titulo": "Comprei um carro com defeito escondido. Quais são meus direitos?",
    "intencao_curta": "Orientar quem comprou veículo com problema oculto sobre conserto, troca, devolução do dinheiro e indenização.",
    "resumo": "Descobrir um defeito grave logo após comprar um carro é frustrante, mas a lei protege o comprador. Dependendo da situação, você pode ter direito ao conserto, à troca, à devolução do valor ou a um abatimento no preço. Veja como agir.",
    "areas": [
      "consumidor",
      "civil"
    ],
    "situacao": [
      "O chamado vício oculto é aquele defeito que não dava para perceber no momento da compra e que só aparece com o uso, como problemas no motor, no câmbio ou sinais de que o carro sofreu um acidente grave e foi remontado. Ele pode surgir tanto em veículo novo quanto usado.",
      "Quando a compra é feita de uma loja ou concessionária, a proteção do consumidor é mais forte, e o vendedor responde pelo defeito mesmo que diga não ter percebido o problema. Em compras entre pessoas comuns, ainda assim é possível responsabilizar o vendedor que escondeu o defeito.",
      "A reação depende do tipo de problema. Em geral, o consumidor primeiro dá a chance de o defeito ser consertado em prazo razoável; se não for resolvido, surgem as opções de trocar o carro, receber o dinheiro de volta ou pedir abatimento, conforme o caso."
    ],
    "passos": [
      {
        "titulo": "Registre o defeito assim que aparecer",
        "texto": "Documente o problema com fotos, vídeos e laudo de mecânico de confiança. Anote a data em que percebeu o defeito, pois isso conta para os prazos."
      },
      {
        "titulo": "Comunique o vendedor formalmente",
        "texto": "Avise a loja ou o vendedor por escrito, descrevendo o defeito e exigindo a solução. Guarde o protocolo, pois isso prova que você reclamou dentro do prazo."
      },
      {
        "titulo": "Dê a chance de conserto, mas acompanhe o prazo",
        "texto": "Em geral o fornecedor tem um prazo para resolver o defeito. Se não consertar nesse período, abre-se o direito à troca, à devolução do valor ou ao abatimento no preço."
      },
      {
        "titulo": "Busque seus direitos com apoio",
        "texto": "Se não houver acordo, registre reclamação nos órgãos de defesa do consumidor e procure um advogado para exigir a solução e eventual indenização na Justiça."
      }
    ],
    "direitos": [
      "Direito ao conserto do defeito oculto, em geral dentro de um prazo razoável.",
      "Direito de escolher entre troca, devolução do valor pago ou abatimento no preço caso o conserto não resolva.",
      "Direito de responsabilizar a loja ou concessionária mesmo que ela alegue desconhecer o problema.",
      "Direito a indenização pelos prejuízos causados pelo defeito, conforme o caso."
    ],
    "quando_urgente": "Procure orientação rápida porque o direito de reclamar por vício oculto tem prazo, contado a partir do momento em que o defeito aparece, e perder esse prazo pode significar perder o direito. A urgência cresce se o defeito colocar sua segurança em risco ou se o vendedor estiver dificultando o contato e tentando empurrar o problema.",
    "documentos": [
      "Nota fiscal ou contrato de compra do veículo.",
      "Anúncio, mensagens e promessas feitas pelo vendedor na negociação.",
      "Laudo de vistoria ou parecer de mecânico apontando o defeito.",
      "Fotos, vídeos e orçamentos de conserto.",
      "Protocolos das reclamações feitas ao vendedor e aos órgãos de defesa."
    ],
    "faq": [
      {
        "q": "Comprei o carro usado de uma loja. Tenho os mesmos direitos?",
        "a": "Sim. A compra em loja é relação de consumo, então a proteção é forte mesmo para usados. A loja responde pelo vício oculto, ainda que ofereça o veículo no estado em que se encontra."
      },
      {
        "q": "E se eu comprei de outra pessoa, não de uma loja?",
        "a": "Você ainda pode responsabilizar o vendedor pelo defeito oculto, especialmente se ele escondeu o problema. Os caminhos são um pouco diferentes, e vale consultar um advogado."
      }
    ],
    "atualizado_em": "2026-05-30"
  },
  {
    "slug": "sofri-queda-ou-acidente-em-estabelecimento-comercial",
    "titulo": "Sofri uma queda ou acidente em estabelecimento comercial. Posso ser indenizado?",
    "intencao_curta": "Orientar quem se acidentou em loja, supermercado ou shopping sobre responsabilidade e direito à indenização.",
    "resumo": "Quem se machuca dentro de um comércio por falta de segurança ou descuido do local pode ter direito a indenização. O estabelecimento tem o dever de garantir um ambiente seguro aos clientes. Entenda como comprovar o que houve e o que buscar.",
    "areas": [
      "consumidor",
      "civil"
    ],
    "situacao": [
      "Acidentes como escorregar em piso molhado sem sinalização, tropeçar em buraco ou obstáculo, ser atingido por prateleira ou produto mal posicionado e cair em escada sem segurança são mais comuns do que parece. Eles acontecem em supermercados, lojas, shoppings, bancos e restaurantes.",
      "Por se tratar de relação de consumo, o estabelecimento costuma responder pelos danos quando há falha na segurança do ambiente, mesmo sem intenção de causar o acidente. Isso inclui despesas médicas, dias parados sem trabalhar e o abalo físico e emocional sofrido.",
      "O ponto-chave é demonstrar como o acidente aconteceu e que houve descuido do local. Quanto mais cedo você reunir provas e registrar o ocorrido, mais forte fica o pedido de indenização, seja em acordo, seja na Justiça."
    ],
    "passos": [
      {
        "titulo": "Registre o acidente na hora",
        "texto": "Comunique o gerente ou responsável e peça que o ocorrido seja registrado. Tire fotos do local, do que causou a queda e de eventuais ferimentos."
      },
      {
        "titulo": "Procure atendimento médico",
        "texto": "Busque atendimento o quanto antes e guarde todos os laudos, receitas e comprovantes. Isso documenta as lesões e liga claramente o dano ao acidente."
      },
      {
        "titulo": "Reúna testemunhas e provas",
        "texto": "Anote nomes e contatos de quem viu o acidente e tente garantir as imagens das câmeras de segurança do local, que costumam ser decisivas."
      },
      {
        "titulo": "Busque a reparação com orientação",
        "texto": "Tente um acordo com o estabelecimento e, se não houver solução justa, procure um advogado para pedir indenização pelos prejuízos na Justiça."
      }
    ],
    "direitos": [
      "Direito a um ambiente seguro enquanto cliente do estabelecimento.",
      "Direito ao ressarcimento de despesas médicas e demais gastos ligados ao acidente.",
      "Direito a indenização pelos danos físicos e pelo abalo emocional sofrido.",
      "Direito de exigir as imagens de segurança que ajudem a comprovar o ocorrido."
    ],
    "quando_urgente": "Procure orientação com urgência se as lesões forem graves, exigirem cirurgia ou afastarem você do trabalho, pois os prejuízos tendem a crescer. A pressa também ajuda a preservar provas, já que as imagens das câmeras costumam ser apagadas após certo tempo, e um advogado pode pedir formalmente que sejam guardadas.",
    "documentos": [
      "Registro ou boletim do acidente feito no próprio estabelecimento.",
      "Laudos médicos, exames, receitas e comprovantes de despesas.",
      "Fotos e vídeos do local, da causa da queda e dos ferimentos.",
      "Dados das testemunhas e, se possível, as imagens das câmeras de segurança.",
      "Comprovantes de dias parados sem trabalhar e da perda de renda, se houver."
    ],
    "faq": [
      {
        "q": "Preciso provar que o estabelecimento teve culpa?",
        "a": "Em relações de consumo, basta demonstrar o acidente, o dano e a ligação com a falha de segurança do local. O estabelecimento é que precisa provar que não teve responsabilidade."
      },
      {
        "q": "E se houver placa de piso molhado no local?",
        "a": "A sinalização ajuda o estabelecimento, mas não afasta automaticamente a responsabilidade. Avalia-se se a sinalização era adequada e visível e se o local agiu com o cuidado esperado."
      }
    ],
    "atualizado_em": "2026-05-30"
  }
];

export const PROBLEMA_SLUGS = PROBLEMAS.map((p) => p.slug);

export function findProblema(slug: string): ProblemaJuridico | undefined {
  return PROBLEMAS.find((p) => p.slug === slug);
}

export function relatedProblemas(slug: string, limit = 6): ProblemaJuridico[] {
  const current = findProblema(slug);
  if (!current) return [];
  const sameArea = PROBLEMAS.filter(
    (p) => p.slug !== slug && p.areas.some((a) => current.areas.includes(a))
  );
  return sameArea.slice(0, limit);
}

export function problemasByArea(): Record<string, ProblemaJuridico[]> {
  const result: Record<string, ProblemaJuridico[]> = {};
  for (const p of PROBLEMAS) {
    for (const a of p.areas) {
      if (!result[a]) result[a] = [];
      result[a].push(p);
    }
  }
  return result;
}

const BASES_LEGAIS: Record<string, Array<{ citacao: string; dispoe: string }>> = {
  "nome-negativado-indevidamente": [
    { citacao: "Súmula 385 do STJ", dispoe: "Da anotação irregular em cadastro de proteção ao crédito, não cabe indenização por dano moral quando preexistente legítima inscrição, ressalvado o direito ao cancelamento." },
    { citacao: "Art. 43, § 1º, do CDC (Lei 8.078/1990)", dispoe: "Os cadastros e dados de consumidores devem ser objetivos, claros e verdadeiros, e as informações negativas não podem ser mantidas por período superior a cinco anos." },
  ],
  "fui-demitido-sem-receber-direitos": [
    { citacao: "Art. 477, § 6º, da CLT", dispoe: "A quitação das verbas rescisórias e a entrega dos documentos da rescisão devem ocorrer em até dez dias contados do término do contrato." },
    { citacao: "Art. 477, § 8º, da CLT", dispoe: "O descumprimento do prazo de pagamento sujeita o empregador a multa em favor do empregado, equivalente ao seu salário, salvo quando o atraso decorrer de culpa do próprio trabalhador." },
  ],
  "estou-sendo-cobrado-por-divida-prescrita": [
    { citacao: "Súmula 323 do STJ", dispoe: "A inscrição do nome do devedor pode ser mantida nos serviços de proteção ao crédito por, no máximo, cinco anos, independentemente da prescrição da execução." },
    { citacao: "Art. 43, § 5º, do CDC (Lei 8.078/1990)", dispoe: "Consumada a prescrição relativa à cobrança de débitos, não serão fornecidas pelos sistemas de proteção ao crédito informações que possam impedir ou dificultar novo acesso ao crédito." },
  ],
  "pai-nao-paga-pensao": [
    { citacao: "Art. 528, § 3º, do CPC (Lei 13.105/2015)", dispoe: "Não pago o débito alimentar nem aceita a justificativa, o juiz decretará a prisão do devedor pelo prazo de um a três meses." },
    { citacao: "Art. 528, § 7º, do CPC (Lei 13.105/2015)", dispoe: "O débito alimentar que autoriza a prisão civil é o que compreende até as três prestações anteriores ao ajuizamento da execução e as que se vencerem no curso do processo." },
  ],
  "fui-demitida-gravida": [
    { citacao: "Art. 10, II, \"b\", do ADCT da Constituição Federal de 1988", dispoe: "É vedada a dispensa arbitrária ou sem justa causa da empregada gestante desde a confirmação da gravidez até cinco meses após o parto." },
  ],
  "trabalhei-sem-carteira-assinada": [
    { citacao: "Art. 3º da CLT", dispoe: "Considera-se empregado toda pessoa física que prestar serviços de natureza não eventual a empregador, sob a dependência deste e mediante salário." },
    { citacao: "Art. 2º da CLT", dispoe: "Considera-se empregador a empresa que, assumindo os riscos da atividade econômica, admite, assalaria e dirige a prestação pessoal de serviços." },
  ],
  "comprei-produto-com-defeito": [
    { citacao: "Art. 18, § 1º, do CDC (Lei 8.078/1990)", dispoe: "Não sanado o vício em até trinta dias, o consumidor pode exigir, à sua escolha, a substituição do produto, a restituição da quantia paga atualizada ou o abatimento proporcional do preço." },
  ],
  "quero-me-divorciar": [
    { citacao: "Art. 226, § 6º, da Constituição Federal (redação da EC 66/2010)", dispoe: "O casamento civil pode ser dissolvido pelo divórcio, sem exigência de prévia separação ou de prazo." },
    { citacao: "Art. 733 do CPC (Lei 13.105/2015)", dispoe: "Não havendo nascituro ou filhos incapazes, o divórcio consensual pode ser feito por escritura pública, com os interessados assistidos por advogado ou defensor público, sem necessidade de homologação judicial." },
  ],
  "voo-cancelado-ou-atrasado": [
    { citacao: "Resolução nº 400/2016 da ANAC", dispoe: "Disciplina os direitos do passageiro, prevendo assistência material (comunicação, alimentação e hospedagem conforme o tempo de espera) e, à escolha do passageiro, reacomodação, reembolso integral ou execução do serviço por outra modalidade de transporte." },
    { citacao: "Art. 14 do CDC (Lei 8.078/1990)", dispoe: "O fornecedor de serviços responde, independentemente de culpa, pela reparação dos danos causados aos consumidores por defeitos na prestação dos serviços." },
  ],
  "sofri-violencia-domestica": [
    { citacao: "Art. 22 da Lei 11.340/2006 (Lei Maria da Penha)", dispoe: "Constatada a violência doméstica, o juiz poderá aplicar de imediato ao agressor medidas protetivas de urgência, como o afastamento do lar e a proibição de aproximação e contato com a ofendida." },
  ],
};

export function findBaseLegal(slug: string) {
  return BASES_LEGAIS[slug] ?? null;
}
