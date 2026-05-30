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
