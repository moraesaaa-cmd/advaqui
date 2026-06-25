export type SpecialtyFaq = { q: string; a: string };

export type SpecialtyUrgency = {
  level: "alta" | "media" | "baixa";
  prazo: string;
  alerta: string;
};

export type SpecialtyContent = {
  slug: string;
  paragraphs: string[];
  whenToHire: string;
  commonCases: string[];
  faqs: SpecialtyFaq[];
  urgency: SpecialtyUrgency;
};

const DATA: SpecialtyContent[] = [
  {
    slug: "trabalhista",
    urgency: {
      level: "alta",
      prazo: "2 anos",
      alerta: "Ação trabalhista prescreve em 2 anos após a rescisão do contrato (art. 7.º, XXIX, CF). Quanto mais tempo passar, mais direitos você pode perder."
    },
    paragraphs: [
      "O direito do trabalho regulamenta as relações entre empregados e empregadores, garantindo direitos fundamentais como salário justo, jornada limitada, férias remuneradas e proteção contra dispensas arbitrárias. A Consolidação das Leis do Trabalho (CLT) é a principal referência, complementada por leis especiais, convenções coletivas e a jurisprudência do Tribunal Superior do Trabalho.",
      "Quando surgem conflitos trabalhistas, as demandas são processadas perante a Justiça do Trabalho, com varas especializadas em cada comarca. O trabalhador pode ajuizar a ação até dois anos após o término do contrato, cobrando direitos dos últimos cinco anos — prazos previstos no art. 7.º, XXIX, da Constituição Federal.",
      "Um advogado trabalhista orienta desde a análise do holerite e do contrato até a condução de audiências e o cumprimento de decisões judiciais, buscando sempre o melhor resultado para o cliente — seja por acordo ou sentença."
    ],
    whenToHire: "Procure um advogado trabalhista sempre que tiver dúvidas sobre seus direitos no emprego: demissão sem justa causa, horas extras não pagas, assédio moral, acidente de trabalho, verbas rescisórias incorretas ou qualquer situação que envolva descumprimento de normas trabalhistas.",
    commonCases: [
      "Demissão sem justa causa e cálculo de verbas rescisórias",
      "Horas extras, banco de horas e adicional noturno",
      "Assédio moral ou sexual no ambiente de trabalho",
      "Acidente de trabalho e doença ocupacional",
      "Reconhecimento de vínculo empregatício",
      "Reversão de justa causa",
      "Diferenças salariais e equiparação"
    ],
    faqs: [
      { q: "Quais são meus direitos ao ser demitido sem justa causa?", a: "Você tem direito a aviso prévio (trabalhado ou indenizado), saldo de salário, férias proporcionais + 1/3, 13.º proporcional, saque do FGTS e multa de 40% sobre o FGTS. O prazo para pagamento das verbas rescisórias é de 10 dias corridos a partir do término do contrato (art. 477 da CLT)." },
      { q: "Quanto tempo tenho para entrar com ação trabalhista?", a: "O prazo prescricional é de dois anos após o encerramento do contrato de trabalho. Dentro desse prazo, você pode cobrar direitos referentes aos últimos cinco anos de vínculo (art. 7.º, XXIX, CF)." },
      { q: "Quanto custa contratar um advogado trabalhista?", a: "A maioria dos advogados trabalhistas trabalha com honorários de êxito, ou seja, você só paga se ganhar a causa. O percentual costuma variar entre 20% e 30% do valor recebido, conforme tabela da OAB local e negociação com o profissional." },
      { q: "Posso processar a empresa mesmo sem registro em carteira?", a: "Sim. Você pode entrar com uma reclamatória trabalhista pedindo o reconhecimento de vínculo empregatício e todos os direitos decorrentes (FGTS, INSS, férias, 13.º etc.). Provas como conversas, testemunhas e comprovantes de pagamento ajudam a demonstrar a relação de emprego." },
      { q: "O que fazer se não recebi minhas verbas rescisórias?", a: "Guarde o termo de rescisão, holerites e extrato do FGTS. Procure um advogado trabalhista para calcular os valores devidos e, se necessário, ajuizar reclamatória na Justiça do Trabalho. A empresa que atrasa o pagamento pode ser condenada a pagar multa do art. 477, §8.º, da CLT." },
      { q: "Preciso ir pessoalmente ao fórum para a audiência trabalhista?", a: "Sim, em regra, a presença do reclamante é obrigatória na audiência inicial. A ausência sem justificativa pode gerar arquivamento do processo. Em alguns casos, após acordo com o juízo, é possível participar por videoconferência." },
      { q: "Horas extras acima de 2 por dia são permitidas?", a: "Pela CLT, a jornada pode ser prorrogada em até 2 horas extras diárias mediante acordo individual ou coletivo. Exceder esse limite é ilegal e gera direito ao pagamento com adicional mínimo de 50%, podendo chegar a 100% em domingos e feriados." },
      { q: "O que configura assédio moral no trabalho?", a: "Assédio moral é a exposição repetitiva a situações humilhantes, constrangedoras ou vexatórias no exercício da função — como metas abusivas, isolamento, gritos ou ameaças. A vítima pode pedir indenização por danos morais e, em casos graves, rescindir o contrato por culpa do empregador (art. 483 da CLT)." }
    ]
  },
  {
    slug: "civil",
    urgency: {
      level: "media",
      prazo: "3–10 anos",
      alerta: "O prazo prescricional geral é de 3 anos para reparação civil (art. 206, §3.º, CC) e até 10 anos para outras ações (art. 205, CC). Consulte um advogado para saber o prazo do seu caso."
    },
    paragraphs: [
      "O direito civil é o ramo mais amplo do ordenamento jurídico brasileiro: regula contratos, responsabilidade civil, direito de propriedade, obrigações, família e sucessões. O Código Civil de 2002 (Lei 10.406) é seu diploma central, aplicado em conjunto com o Código de Processo Civil e leis especiais.",
      "Questões civis são resolvidas nas varas cíveis das comarcas locais, podendo envolver ações de cobrança, indenização por danos morais e materiais, despejo, usucapião, partilha de bens e execução de títulos. A competência territorial geralmente segue o domicílio do réu.",
      "Contar com um advogado civilista é essencial para proteger patrimônio, resolver conflitos contratuais e garantir reparação adequada em situações de prejuízo. A atuação preventiva — análise de contratos antes da assinatura — evita litígios futuros."
    ],
    whenToHire: "Procure um advogado civil quando precisar resolver disputas contratuais, cobrar dívidas, pedir indenização por danos morais ou materiais, regularizar propriedade, lidar com herança e inventário ou defender-se em ações judiciais.",
    commonCases: [
      "Ações de indenização por danos morais e materiais",
      "Cobranças, execuções de título e ações monitórias",
      "Contratos de compra e venda, locação e prestação de serviços",
      "Usucapião e regularização de imóveis",
      "Inventário e partilha de bens",
      "Despejo e revisão de aluguel",
      "Responsabilidade civil por acidentes e vícios"
    ],
    faqs: [
      { q: "Qual o prazo para pedir indenização por danos morais?", a: "O prazo prescricional geral é de 3 anos (art. 206, §3.º, V, do Código Civil). Em relações de consumo, o prazo pode ser de 5 anos (art. 27 do CDC). Contar da data em que a vítima tomou conhecimento do dano." },
      { q: "Quanto custa um advogado civil?", a: "Os honorários variam conforme a complexidade do caso. Podem ser cobrados por valor fixo, percentual sobre o resultado ou hora técnica. A tabela de honorários da OAB de cada estado serve como referência mínima." },
      { q: "Posso resolver um conflito civil sem ir ao tribunal?", a: "Sim. Mediação e conciliação são alternativas rápidas e mais baratas. O CPC incentiva soluções consensuais antes de iniciar o processo judicial. Câmaras de mediação são habilitadas pelo tribunal de justiça local." },
      { q: "Como funciona uma ação de cobrança?", a: "O credor pode entrar com ação monitória (se tiver prova escrita da dívida) ou ação de cobrança comum. Se houver título executivo (contrato, cheque, nota promissória), a execução é direta e o devedor é intimado a pagar em 3 dias." },
      { q: "Preciso de advogado para fazer um inventário?", a: "Sim. Inventários judiciais exigem advogado por lei. Inventários extrajudiciais (cartório) — possíveis quando todos os herdeiros são maiores, capazes e concordam — também exigem assinatura de advogado (art. 610, §2.º, CPC)." },
      { q: "O que é usucapião e como funciona?", a: "Usucapião é o modo de adquirir propriedade pela posse prolongada, mansa e pacífica. Os prazos variam de 5 a 15 anos, conforme a modalidade (extraordinária, ordinária, especial urbana ou rural). É necessário entrar com ação judicial ou procedimento extrajudicial em cartório." },
      { q: "Qual a diferença entre dano moral e dano material?", a: "Dano material é o prejuízo financeiro concreto (gastos médicos, lucro cessante, objeto danificado). Dano moral é a lesão à honra, imagem, dignidade ou integridade psíquica — não tem valor fixo e é arbitrado pelo juiz conforme a gravidade e as circunstâncias." },
      { q: "Contrato verbal tem validade jurídica?", a: "Sim, em regra. O Código Civil reconhece contratos verbais, salvo nos casos em que a lei exige forma escrita (como compra e venda de imóvel acima de 30 salários mínimos, art. 108). O desafio é provar os termos acordados — testemunhas, e-mails e mensagens ajudam." }
    ]
  },
  {
    slug: "criminal",
    urgency: {
      level: "alta",
      prazo: "varia",
      alerta: "Prazos penais variam de 3 a 20 anos conforme a pena do crime (art. 109, CP). Em caso de prisão, a defesa deve ser imediata — audiência de custódia ocorre em 24 horas."
    },
    paragraphs: [
      "O direito penal define os crimes, as penas e as garantias fundamentais do acusado, tendo como pilares o Código Penal (Decreto-Lei 2.848/1940) e o Código de Processo Penal. O princípio da presunção de inocência (art. 5.º, LVII, CF) é a base de todo o sistema criminal brasileiro.",
      "Processos criminais tramitam nas varas criminais da comarca, podendo envolver delitos comuns (furto, roubo, estelionato, lesão corporal), crimes contra a honra, crimes de trânsito e infrações de menor potencial ofensivo (Juizado Especial Criminal). Crimes dolosos contra a vida são julgados pelo Tribunal do Júri.",
      "A presença de um advogado criminalista é direito constitucional do acusado em qualquer fase da persecução penal — desde o inquérito policial até a execução da pena. A defesa técnica qualificada pode ser determinante para o resultado do processo."
    ],
    whenToHire: "Procure um advogado criminal imediatamente se for investigado, indiciado, preso em flagrante ou citado em processo criminal. Em caso de prisão, o advogado pode requerer habeas corpus, relaxamento da prisão ou liberdade provisória perante o juiz.",
    commonCases: [
      "Defesa em inquéritos policiais e ações penais",
      "Habeas corpus e pedidos de liberdade provisória",
      "Audiência de custódia e defesa em flagrante",
      "Crimes de trânsito (homicídio culposo, embriaguez ao volante)",
      "Crimes contra a honra (calúnia, difamação, injúria)",
      "Furto, roubo, estelionato e receptação",
      "Violência doméstica e Lei Maria da Penha"
    ],
    faqs: [
      { q: "O que fazer se eu for preso em flagrante?", a: "Peça para comunicar um advogado ou a Defensoria Pública imediatamente. Toda prisão deve ser comunicada ao juiz em 24 horas para audiência de custódia. Não assine nada nem confesse sem a orientação de um advogado — é seu direito constitucional (art. 5.º, LXIII, CF)." },
      { q: "Quanto tempo dura um processo criminal?", a: "Não há prazo fixo. Réus presos devem ser julgados em até 120 dias, aproximadamente. Réus soltos podem esperar de 1 a 4 anos, dependendo da complexidade, do tribunal e da pauta. A defesa pode impugnar demoras excessivas." },
      { q: "O que é habeas corpus?", a: "É um remédio constitucional para proteger a liberdade de ir e vir. Pode ser impetrado a qualquer momento quando alguém sofre ou está ameaçado de sofrer violência ou coação em sua liberdade, por ilegalidade ou abuso de poder (art. 5.º, LXVIII, CF)." },
      { q: "Preciso de advogado para ser ouvido na delegacia?", a: "Sim, você tem direito a advogado em todas as fases do processo penal, inclusive durante o inquérito. O delegado deve informar seus direitos ao investigado. Permaneça em silêncio até a chegada do advogado — o direito ao silêncio é constitucional e não pode ser usado contra você." },
      { q: "Crimes de trânsito podem levar à prisão?", a: "Sim. Homicídio culposo no trânsito (art. 302 do CTB) tem pena de 2 a 4 anos de detenção. Dirigir embriagado (art. 306 do CTB) pode levar a detenção de 6 meses a 3 anos. Em ambos os casos, o juiz pode conceder medidas alternativas." },
      { q: "Ficha criminal pode ser limpa?", a: "Registros de inquéritos arquivados ou processos com absolvição podem ser removidos dos cadastros policiais mediante requerimento. Condenações com pena cumprida geram reabilitação criminal após 2 anos (art. 93 do CP), que sigila a condenação." },
      { q: "Posso responder em liberdade durante o processo?", a: "Na maioria dos casos, sim. A prisão preventiva é exceção e só se justifica quando presentes os requisitos do art. 312 do CPP (garantia da ordem pública, conveniência da instrução criminal, aplicação da lei penal ou perigo de fuga). A fiança é possível em delitos com pena de até 4 anos." },
      { q: "Quem paga o advogado criminal se eu não tiver dinheiro?", a: "A Defensoria Pública garante defesa gratuita a quem não pode pagar advogado particular. É um direito constitucional. A Defensoria atua em todas as instâncias e possui defensores especializados em criminal." }
    ]
  },
  {
    slug: "previdenciario",
    urgency: {
      level: "alta",
      prazo: "30 dias",
      alerta: "Benefício negado pelo INSS tem prazo de 30 dias para recurso administrativo ao CRPS. Perder esse prazo pode significar recomeçar todo o processo."
    },
    paragraphs: [
      "O direito previdenciário regula a relação entre segurados e o Instituto Nacional do Seguro Social (INSS), abrangendo aposentadorias, auxílios, pensões e benefícios assistenciais. A Emenda Constitucional 103/2019 (Reforma da Previdência) trouxe novas regras de transição que tornaram o planejamento previdenciário indispensável.",
      "As demandas previdenciárias podem ser resolvidas administrativamente (via Meu INSS ou agência) ou judicialmente, perante os Juizados Especiais Federais (causas até 60 salários mínimos) ou as Varas Federais. Em cidades sem Justiça Federal, a Justiça Estadual pode julgar causas previdenciárias.",
      "Um advogado previdenciário analisa o histórico contributivo do segurado, identifica a melhor regra de aposentadoria disponível, calcula o valor do benefício e atua na correção de indeferimentos ou na revisão de benefícios concedidos com valor abaixo do devido."
    ],
    whenToHire: "Procure um advogado previdenciário quando tiver benefício negado pelo INSS, quiser planejar sua aposentadoria, precisar revisar o valor do benefício, solicitar auxílio por incapacidade ou pensão por morte, ou quando o INSS demorar mais de 45 dias para responder seu pedido.",
    commonCases: [
      "Aposentadoria por idade, tempo de contribuição e especial",
      "Auxílio por incapacidade temporária (antigo auxílio-doença)",
      "Aposentadoria por incapacidade permanente (invalidez)",
      "Pensão por morte e auxílio-reclusão",
      "Benefício de Prestação Continuada (BPC/LOAS)",
      "Revisão de benefício e correção de tempo de contribuição",
      "Planejamento previdenciário e simulação de aposentadoria"
    ],
    faqs: [
      { q: "O INSS negou meu benefício. E agora?", a: "Você pode recorrer administrativamente (recurso ao CRPS em até 30 dias) ou entrar direto com ação judicial. Na Justiça, os Juizados Especiais Federais são gratuitos para causas de até 60 salários mínimos. Um advogado previdenciário analisa o motivo do indeferimento e monta a melhor estratégia." },
      { q: "Quanto tempo o INSS tem para responder meu pedido?", a: "O prazo legal é de 45 dias corridos para analisar o requerimento (art. 41-A, §5.º, Lei 8.213/91). Se ultrapassar, o segurado pode entrar com ação judicial por demora administrativa, pedindo a concessão ou a determinação de análise imediata." },
      { q: "Posso me aposentar por tempo de contribuição após a reforma?", a: "A aposentadoria por tempo de contribuição pura foi extinta pela EC 103/2019, mas existem 4 regras de transição para quem já contribuía antes da reforma. Um advogado previdenciário calcula qual regra é mais vantajosa para o seu caso." },
      { q: "O que é aposentadoria especial?", a: "É a aposentadoria concedida a trabalhadores expostos a agentes nocivos à saúde (ruído, calor, produtos químicos, eletricidade). Exige 15, 20 ou 25 anos de atividade especial, conforme o agente. O PPP (Perfil Profissiográfico Previdenciário) é o documento essencial para comprovar." },
      { q: "Tenho direito ao BPC/LOAS?", a: "O Benefício de Prestação Continuada (BPC) paga 1 salário mínimo a idosos com 65+ anos ou pessoas com deficiência, cuja renda familiar per capita seja inferior a 1/4 do salário mínimo. Não exige contribuição prévia ao INSS, mas tem critérios rigorosos." },
      { q: "Posso revisar o valor da minha aposentadoria?", a: "Sim. As revisões mais comuns são: revisão da vida toda (usa todos os salários, inclusive anteriores a julho/1994), inclusão de tempo especial não reconhecido e correção de vínculos ausentes no CNIS. O prazo para pedir revisão é de 10 anos a partir da concessão." },
      { q: "Quanto custa um advogado previdenciário?", a: "A maioria trabalha com honorários de êxito (20% a 30% do valor recebido em atrasados). Em ações nos Juizados Especiais Federais, não há custas processuais nem honorários de sucumbência para o autor, o que reduz o risco para o segurado." },
      { q: "Tempo de trabalho rural conta para aposentadoria?", a: "Sim. O tempo de atividade rural pode ser computado para aposentadoria, mesmo sem contribuição formal, desde que comprovado por início de prova material (contratos, notas fiscais, certidões de terra) e testemunhas. A legislação admite a contagem a partir dos 12 anos de idade." }
    ]
  },
  {
    slug: "familia",
    urgency: {
      level: "alta",
      prazo: "imediato",
      alerta: "Questões de guarda e alimentos envolvem risco à criança e exigem ação imediata. Alimentos provisórios podem ser fixados em liminar, mas é preciso agir rápido."
    },
    paragraphs: [
      "O direito de família disciplina as relações de parentesco, casamento, união estável, filiação, guarda, alimentos e adoção. Suas fontes são o Código Civil (Livro IV), o Estatuto da Criança e do Adolescente (ECA) e a jurisprudência dos tribunais. Questões de família envolvem aspectos emocionais e patrimoniais que exigem sensibilidade e técnica jurídica.",
      "As ações de família tramitam nas varas de família da comarca. O CPC de 2015 determina audiência de mediação obrigatória antes da contestação em ações de divórcio, guarda, alimentos e dissolução de união estável, priorizando soluções consensuais.",
      "Um advogado familiarista orienta na escolha entre a via judicial e a extrajudicial (cartório), calcula alimentos conforme a capacidade do alimentante e a necessidade do alimentando, e busca o melhor interesse da criança ou adolescente em questões de guarda e visitação."
    ],
    whenToHire: "Procure um advogado de família quando precisar resolver divórcio, definir guarda de filhos, pedir ou revisar pensão alimentícia, formalizar união estável, fazer inventário de bens ou tratar de qualquer questão que envolva parentesco e patrimônio familiar.",
    commonCases: [
      "Divórcio consensual e litigioso",
      "Guarda compartilhada, unilateral e regulamentação de visitas",
      "Pensão alimentícia (fixação, revisão e execução)",
      "União estável (reconhecimento e dissolução)",
      "Inventário e partilha de bens",
      "Adoção e destituição de poder familiar",
      "Investigação e negatória de paternidade"
    ],
    faqs: [
      { q: "Quanto tempo demora um divórcio?", a: "O divórcio consensual em cartório pode sair em 1 a 2 semanas, se não houver filhos menores ou incapazes. O divórcio judicial consensual leva de 2 a 6 meses. O divórcio litigioso pode levar de 1 a 3 anos, dependendo das questões patrimoniais e de guarda envolvidas." },
      { q: "Como funciona a guarda compartilhada?", a: "Na guarda compartilhada, ambos os pais participam igualmente das decisões sobre a vida do filho, embora a residência fixa seja definida com um deles. É a regra desde a Lei 13.058/2014, salvo quando contrária ao melhor interesse da criança." },
      { q: "Posso pedir revisão de pensão alimentícia?", a: "Sim. A revisão pode ser pedida a qualquer momento quando houver mudança nas condições financeiras do alimentante ou nas necessidades do alimentando. Exemplos: perda de emprego, aumento de despesas escolares, novo filho. O pedido é feito por ação revisional (art. 1.699, CC)." },
      { q: "Divórcio no cartório é mais barato?", a: "Sim. O divórcio extrajudicial (cartório) é mais rápido e geralmente mais barato que o judicial. Exige que ambos os cônjuges estejam de acordo, não haja filhos menores ou incapazes, e os dois estejam assistidos por advogado (pode ser o mesmo)." },
      { q: "Preciso de advogado para fazer inventário?", a: "Sim, em qualquer modalidade. No inventário extrajudicial (cartório), possível quando todos os herdeiros são maiores, capazes e concordam, a presença de advogado é obrigatória. No judicial, é indispensável por lei. O prazo para abrir inventário é de 60 dias após o óbito (art. 611, CPC)." },
      { q: "O que acontece se o pai não pagar a pensão?", a: "O alimentante que não paga pensão pode sofrer execução de alimentos, com penhora de bens e salário. Em caso de inadimplência injustificada, o juiz pode decretar a prisão civil de 1 a 3 meses (art. 528, §3.º, CPC) — é a única dívida civil que permite prisão no Brasil." },
      { q: "União estável dá os mesmos direitos do casamento?", a: "Em grande parte, sim. O STF reconheceu em 2017 que o companheiro em união estável tem os mesmos direitos sucessórios do cônjuge. No entanto, a união estável não gera automaticamente regime de bens e pode exigir prova para reconhecimento de direitos." },
      { q: "Posso perder a guarda do meu filho?", a: "A guarda pode ser modificada judicialmente quando comprovado que a situação atual prejudica o menor. A destituição do poder familiar é medida extrema, aplicada em casos de abandono, maus-tratos, abuso ou negligência grave, com parecer do Ministério Público e da equipe multidisciplinar." }
    ]
  },
  {
    slug: "empresarial",
    urgency: {
      level: "media",
      prazo: "varia",
      alerta: "Recuperação judicial tem prazos rígidos definidos pela Lei 11.101/2005. Conflitos societários e contratos comerciais exigem atenção aos prazos contratuais e legais."
    },
    paragraphs: [
      "O direito empresarial rege a atividade econômica organizada, incluindo sociedades, contratos mercantis, propriedade industrial, recuperação judicial e falência. A Lei 11.101/2005 (recuperação e falência) e o Código Civil (Direito de Empresa) são os diplomas centrais.",
      "Empresários e sociedades enfrentam questões contratuais, societárias, regulatórias e tributárias que exigem assessoria jurídica especializada. Da abertura da empresa ao planejamento de sucessão, o advogado empresarial atua em todas as etapas do ciclo de vida do negócio.",
      "Em situações de crise financeira, a recuperação judicial permite reestruturar dívidas e manter a empresa em funcionamento. Já a dissolução parcial de sociedade resolve conflitos entre sócios sem encerrar a atividade."
    ],
    whenToHire: "Procure um advogado empresarial ao abrir ou fechar uma empresa, redigir contratos comerciais, resolver conflitos entre sócios, enfrentar dificuldades financeiras, lidar com propriedade intelectual ou precisar de assessoria jurídica preventiva para o seu negócio.",
    commonCases: [
      "Elaboração e revisão de contratos comerciais",
      "Constituição, alteração e dissolução de sociedade",
      "Recuperação judicial e extrajudicial",
      "Conflitos societários e exclusão de sócio",
      "Due diligence em fusões e aquisições",
      "Proteção de marca e propriedade industrial",
      "Compliance e governança corporativa"
    ],
    faqs: [
      { q: "Preciso de advogado para abrir uma empresa?", a: "Não é obrigatório, mas é recomendável. O advogado ajuda a escolher o tipo societário adequado (MEI, LTDA, S.A.), elabora o contrato social com cláusulas de proteção e orienta sobre obrigações fiscais e regulatórias." },
      { q: "O que é recuperação judicial?", a: "É um instrumento legal (Lei 11.101/2005) que permite à empresa em crise reestruturar suas dívidas sob supervisão judicial, mantendo a atividade. O devedor apresenta um plano de recuperação que deve ser aprovado pelos credores em assembleia." },
      { q: "Como resolver briga entre sócios?", a: "Conflitos societários podem ser resolvidos por mediação, cláusula de saída prevista no contrato social (buyout), dissolução parcial da sociedade ou exclusão judicial do sócio faltoso. A via depende da gravidade do conflito e das cláusulas contratuais." },
      { q: "Qual a diferença entre LTDA e S.A.?", a: "Na LTDA, a responsabilidade dos sócios é limitada ao capital social, a gestão é mais simples e o contrato social é flexível. Na S.A., o capital é dividido em ações, há regras rígidas de governança (Lei 6.404/76) e é indicada para empresas maiores ou que buscam investidores." },
      { q: "Posso ser responsabilizado por dívidas da empresa?", a: "Em regra, a responsabilidade é limitada ao capital investido. Porém, a desconsideração da personalidade jurídica (art. 50 do CC) permite atingir o patrimônio pessoal dos sócios em caso de desvio de finalidade, confusão patrimonial ou fraude." },
      { q: "Como proteger a marca da minha empresa?", a: "Registre a marca no INPI (Instituto Nacional da Propriedade Industrial). O registro garante exclusividade de uso em todo o território nacional por 10 anos, renováveis. Sem registro, a proteção é frágil e limitada à região de atuação." },
      { q: "O que é compliance empresarial?", a: "Compliance é o conjunto de práticas para garantir que a empresa cumpra leis, regulamentos e padrões éticos. Inclui políticas anticorrupção (Lei 12.846/2013), proteção de dados (LGPD), prevenção a lavagem de dinheiro e canal de denúncias." },
      { q: "Quando contratar due diligence?", a: "Due diligence é investigação detalhada da situação jurídica, financeira e operacional de uma empresa, geralmente antes de compra, fusão, investimento ou parceria. Identifica riscos ocultos (passivos trabalhistas, tributários, ambientais) e protege o comprador." }
    ]
  },
  {
    slug: "tributario",
    urgency: {
      level: "alta",
      prazo: "5 anos",
      alerta: "O prazo de decadência tributária é de 5 anos (art. 173, CTN). Auto de infração deve ser impugnado em 30 dias. Créditos pagos a maior prescrevem em 5 anos."
    },
    paragraphs: [
      "O direito tributário disciplina a arrecadação de impostos, taxas e contribuições pela União, estados e municípios. O Código Tributário Nacional (Lei 5.172/66) e a Constituição Federal definem as regras de competência, limites de tributação e garantias do contribuinte.",
      "Empresas e pessoas físicas lidam constantemente com obrigações tributárias complexas — IRPF, IRPJ, ICMS, ISS, PIS, COFINS, contribuições previdenciárias. O planejamento tributário legal (elisão fiscal) é ferramenta legítima para reduzir a carga tributária dentro da lei.",
      "Um advogado tributarista atua na defesa em autuações fiscais, no planejamento tributário, na recuperação de créditos pagos a maior e na análise de impactos de mudanças legislativas sobre o negócio ou o patrimônio pessoal."
    ],
    whenToHire: "Procure um advogado tributário ao receber auto de infração da Receita Federal ou estadual, ao planejar a abertura ou reestruturação de empresa, quando quiser recuperar impostos pagos a maior ou ao enfrentar execução fiscal.",
    commonCases: [
      "Defesa em autuações fiscais (federal, estadual, municipal)",
      "Planejamento tributário e elisão fiscal",
      "Recuperação de créditos tributários (PIS/COFINS, ICMS-ST)",
      "Execuções fiscais e parcelamentos (Refis)",
      "Mandado de segurança contra cobrança indevida",
      "Consultoria em regime tributário (Simples, Lucro Presumido, Lucro Real)",
      "Defesa em processos de sonegação fiscal"
    ],
    faqs: [
      { q: "Recebi um auto de infração. O que devo fazer?", a: "Não ignore. Você tem prazo de 30 dias para impugnação administrativa. Procure um advogado tributarista para analisar a legalidade da autuação e apresentar defesa, que pode resultar em redução ou cancelamento da multa." },
      { q: "O que é planejamento tributário?", a: "É a organização legal das atividades do contribuinte para pagar menos impostos, escolhendo o regime tributário mais vantajoso, aproveitando benefícios fiscais e utilizando operações lícitas de redução da base de cálculo. Diferente de sonegação, que é crime." },
      { q: "Posso recuperar impostos pagos a mais?", a: "Sim. O contribuinte que pagou tributo indevido ou a maior tem direito à restituição ou compensação, com prazo de 5 anos a partir do pagamento. Exemplos comuns: exclusão do ICMS da base do PIS/COFINS (Tema 69 do STF), ICMS-ST pago acima do valor real." },
      { q: "O que acontece se eu não pagar impostos?", a: "O fisco inscreve o débito em dívida ativa e pode ajuizar execução fiscal, que permite penhora de bens, bloqueio de contas (SISBAJUD), restrição no CADIN e protesto. Dívidas acima de R$ 20 mil podem gerar investigação criminal por sonegação." },
      { q: "Qual o melhor regime tributário para minha empresa?", a: "Depende do faturamento, da atividade e da folha de pagamento. O Simples Nacional é mais simples e pode ser mais barato para faturamento até R$ 4,8 milhões. O Lucro Presumido é bom para serviços com margem alta. O Lucro Real é obrigatório acima de R$ 78 milhões/ano." },
      { q: "Posso parcelar dívidas com o governo?", a: "Sim. A Receita Federal permite parcelamento ordinário em até 60 vezes. Programas especiais (Refis, Litígio Zero) oferecem condições ainda melhores, com descontos de multa e juros. O advogado tributarista identifica a melhor opção disponível." },
      { q: "Quanto custa um advogado tributário?", a: "Honorários variam conforme o caso. Em defesas administrativas, costumam ser fixos. Em ações de recuperação de créditos, são frequentemente por êxito (20% a 30% do valor recuperado). A consulta inicial para análise de viabilidade costuma ter valor fixo acessível." },
      { q: "O que é execução fiscal?", a: "É o processo judicial pelo qual a Fazenda Pública cobra dívidas tributárias inscritas em dívida ativa. O executado é citado para pagar em 5 dias ou indicar bens à penhora. A defesa se faz por embargos à execução, com prazo de 30 dias a partir da garantia do juízo." }
    ]
  },
  {
    slug: "imobiliario",
    urgency: {
      level: "media",
      prazo: "varia",
      alerta: "Prazos em direito imobiliário variam: usucapião exige 5 a 15 anos de posse, despejo por falta de pagamento tem rito próprio, e distrato de imóvel na planta tem prazo de 7 dias para arrependimento."
    },
    paragraphs: [
      "O direito imobiliário regula a propriedade, posse e uso de bens imóveis, abrangendo compra e venda, locação, incorporação, condomínio, usucapião, financiamento e registro de imóveis. O Código Civil, a Lei do Inquilinato (8.245/91) e a Lei de Registros Públicos (6.015/73) são os marcos legais principais.",
      "Transações imobiliárias envolvem valores significativos e documentação complexa. Vícios ocultos, irregularidades na matrícula, dívidas de IPTU e pendências judiciais podem transformar um bom negócio em prejuízo considerável.",
      "Um advogado imobiliário realiza a análise de risco antes da compra (due diligence imobiliária), elabora e revisa contratos, acompanha financiamentos e age judicialmente quando necessário — em ações de despejo, usucapião, retificação de registro e cobranças condominiais."
    ],
    whenToHire: "Procure um advogado imobiliário antes de comprar, vender ou alugar imóvel de valor significativo, ao enfrentar problemas com inquilinos ou locadores, para regularizar documentação do imóvel ou resolver disputas de posse e propriedade.",
    commonCases: [
      "Análise de risco (due diligence) antes da compra de imóvel",
      "Contratos de compra e venda, promessa e permuta",
      "Ações de despejo e cobrança de aluguéis",
      "Usucapião (judicial e extrajudicial)",
      "Regularização de imóvel e retificação de registro",
      "Financiamento imobiliário e distrato",
      "Problemas condominiais e convenção de condomínio"
    ],
    faqs: [
      { q: "Preciso de advogado para comprar imóvel?", a: "Não é obrigatório, mas é altamente recomendável. O advogado verifica a matrícula do imóvel, analisa certidões negativas, identifica riscos (hipoteca, penhora, ação judicial contra o vendedor) e elabora contrato seguro. O custo do advogado é pequeno comparado ao risco de perder o imóvel." },
      { q: "Como funciona o despejo por falta de pagamento?", a: "O locador pode entrar com ação de despejo cumulada com cobrança. Se o inquilino não pagar ou contestar em 15 dias, o juiz pode conceder liminar de despejo. O processo completo leva de 3 a 12 meses, dependendo do caso." },
      { q: "O que é usucapião?", a: "É a aquisição da propriedade pela posse prolongada e pacífica, sem oposição do proprietário. Os prazos variam: 5 anos (especial urbana), 10 anos (ordinária com justo título), 15 anos (extraordinária). Pode ser feita judicialmente ou em cartório (extrajudicial)." },
      { q: "Como regularizar imóvel sem escritura?", a: "Depende da situação. Se houve contrato de compra e venda, pode-se entrar com ação de adjudicação compulsória. Se há posse prolongada, usucapião. Se o loteamento é irregular, pode haver programa municipal de regularização fundiária (REURB). Um advogado avalia a melhor via." },
      { q: "Posso desistir de um imóvel na planta?", a: "Sim. A Lei 13.786/2018 regulamenta o distrato: o comprador pode perder de 25% a 50% dos valores pagos (conforme patrimônio de afetação). O prazo de arrependimento é de 7 dias se a compra foi em estande de vendas fora da sede da incorporadora." },
      { q: "O que verificar antes de comprar imóvel?", a: "Matrícula atualizada no cartório de registro, certidões negativas do vendedor (cíveis, trabalhistas, fiscais), certidão de ônus reais, quitação de IPTU e condomínio, e existência de ações que possam afetar o imóvel. O advogado faz toda essa análise." },
      { q: "Inquilino pode ser despejado no inverno?", a: "Não existe vedação legal ao despejo por estação do ano no Brasil. A Lei do Inquilinato (8.245/91) não prevê essa restrição. O despejo segue o rito processual normal, com os prazos legais para desocupação." },
      { q: "Quanto tempo demora para regularizar um imóvel?", a: "Depende da via escolhida. Usucapião extrajudicial em cartório pode levar de 6 meses a 1 ano. Usucapião judicial, de 2 a 5 anos. Adjudicação compulsória, de 1 a 3 anos. A regularização fundiária (REURB) depende do programa municipal." }
    ]
  },
  {
    slug: "consumidor",
    urgency: {
      level: "media",
      prazo: "5 anos",
      alerta: "O prazo prescricional para ações de consumo é de 5 anos (art. 27, CDC). Para reclamar de vício do produto, o prazo é de 30 dias (não durável) ou 90 dias (durável)."
    },
    paragraphs: [
      "O Código de Defesa do Consumidor (Lei 8.078/1990) protege a parte mais vulnerável nas relações de consumo, garantindo direitos como informação adequada, proteção contra publicidade enganosa, reparação de danos e inversão do ônus da prova. É uma das legislações consumeristas mais avançadas do mundo.",
      "Conflitos de consumo podem ser resolvidos no Procon, nos Juizados Especiais Cíveis (causas até 40 salários mínimos, sem advogado obrigatório até 20 SM) ou nas varas cíveis comuns. Plataformas como consumidor.gov.br também oferecem mediação gratuita.",
      "Um advogado consumerista atua em casos de cobrança indevida, produto defeituoso, plano de saúde, problemas com bancos e financeiras, compras online fraudulentas e negativação indevida — buscando indenização, cancelamento ou reparação."
    ],
    whenToHire: "Procure um advogado do consumidor quando o Procon não resolver seu problema, quando o valor envolvido for significativo, quando sofrer negativação indevida, quando o plano de saúde negar cobertura ou quando precisar de representação em processos judiciais contra empresas.",
    commonCases: [
      "Negativação indevida (SPC/Serasa) e dano moral",
      "Cobranças abusivas e tarifas bancárias",
      "Plano de saúde (negativa de cobertura, reajuste abusivo)",
      "Produto defeituoso ou vício de fabricação",
      "Cancelamento de contratos e cláusulas abusivas",
      "Fraude em compras online e e-commerce",
      "Problemas com financiamento e empréstimo consignado"
    ],
    faqs: [
      { q: "O que fazer se meu nome foi negativado indevidamente?", a: "Guarde a prova da negativação e da inexistência da dívida. Notifique o credor pedindo a baixa imediata. Se não resolver, entre com ação de danos morais no Juizado Especial. O STJ consolidou que a negativação indevida gera dano moral presumido (dano in re ipsa)." },
      { q: "Posso devolver produto comprado pela internet?", a: "Sim. O CDC garante o direito de arrependimento em compras fora do estabelecimento (internet, telefone, catálogo): 7 dias a partir do recebimento, com devolução integral do valor pago, incluindo frete (art. 49, CDC). Não precisa justificar." },
      { q: "Plano de saúde pode negar cirurgia?", a: "Em regra, não. Se o procedimento está no rol da ANS ou foi prescrito por médico como necessário e urgente, a negativa é abusiva. O STJ firmou que o rol da ANS é exemplificativo (Tema 990). A Justiça costuma conceder liminares em 24 a 48 horas para casos urgentes." },
      { q: "Quanto vale uma indenização por dano moral do consumidor?", a: "Depende da gravidade, do porte da empresa e das circunstâncias. Negativação indevida costuma gerar de R$ 3.000 a R$ 15.000. Cobranças vexatórias, de R$ 5.000 a R$ 30.000. Danos a saúde por produto defeituoso podem ultrapassar R$ 50.000." },
      { q: "Preciso de advogado para ir ao Juizado Especial?", a: "Para causas de até 20 salários mínimos, o advogado não é obrigatório. Acima de 20 e até 40 salários mínimos, é obrigatório. Mesmo quando não obrigatório, um advogado aumenta significativamente as chances de resultado favorável." },
      { q: "Banco pode cobrar tarifa por serviço que não contratei?", a: "Não. Cobranças por serviços não contratados (venda casada) são proibidas pelo art. 39, I, do CDC. O consumidor tem direito à devolução em dobro do valor cobrado indevidamente, acrescido de correção monetária (art. 42, parágrafo único)." },
      { q: "O que fazer se o produto chegou com defeito?", a: "O CDC dá prazo de 30 dias (produto não durável) ou 90 dias (produto durável) para reclamar do vício. O fornecedor tem 30 dias para resolver. Se não resolver, o consumidor pode exigir: substituição do produto, restituição do valor ou abatimento proporcional (art. 18, §1.º)." },
      { q: "Posso cancelar contrato de fidelidade antes do prazo?", a: "Sim, mas pode haver multa proporcional ao tempo restante. A multa deve ser proporcional — cláusulas com multas abusivas (100% do valor restante, por exemplo) são nulas. A Anatel limita a fidelidade de telecomunicações a 12 meses." }
    ]
  },
  {
    slug: "administrativo",
    urgency: {
      level: "alta",
      prazo: "5 anos",
      alerta: "O prazo para ação contra o Estado é de 5 anos (Decreto 20.910/32). Mandado de segurança deve ser impetrado em até 120 dias do ato lesivo. Recursos em concurso costumam ter prazo de 2 a 5 dias."
    },
    paragraphs: [
      "O direito administrativo regula a relação entre o cidadão e o poder público, abrangendo concursos, servidores públicos, licitações, contratos administrativos, atos do governo e controle da administração. A Constituição Federal e a Lei 14.133/2021 (nova lei de licitações) são referências centrais.",
      "Questões administrativas podem ser resolvidas na esfera administrativa (recursos, pedidos de revisão) ou judicial (mandado de segurança, ações ordinárias contra o Estado). O mandado de segurança é o instrumento mais ágil para proteger direito líquido e certo ameaçado por ato de autoridade pública.",
      "Um advogado administrativista atua na defesa de servidores públicos em processos disciplinares, em concursos (impugnação de questões, convocação), em licitações e na responsabilização do Estado por danos causados ao cidadão."
    ],
    whenToHire: "Procure um advogado administrativo quando precisar recorrer de decisão de concurso público, enfrentar processo administrativo disciplinar, participar de licitação, questionar ato do governo que afete seus direitos ou cobrar indenização do Estado.",
    commonCases: [
      "Impugnação de questões e recursos em concurso público",
      "Defesa em processo administrativo disciplinar (PAD)",
      "Mandado de segurança contra ato de autoridade",
      "Licitações e contratos com a administração pública",
      "Responsabilidade civil do Estado por danos",
      "Aposentadoria e benefícios de servidor público",
      "Improbidade administrativa"
    ],
    faqs: [
      { q: "Posso recorrer de questão de concurso público?", a: "Sim. Os concursos preveem prazo para recursos administrativos (geralmente 2 a 5 dias após divulgação do gabarito). Se o recurso for negado, cabe ação judicial — mas o Judiciário só analisa questões com erro grosseiro, não substitui a banca examinadora." },
      { q: "O que é mandado de segurança?", a: "É ação constitucional para proteger direito líquido e certo violado ou ameaçado por ato ilegal de autoridade pública (art. 5.º, LXIX, CF). Deve ser impetrado em até 120 dias do ato. É mais rápido que ações ordinárias e pode incluir pedido liminar." },
      { q: "Servidor público pode ser demitido?", a: "Sim, mas apenas mediante processo administrativo disciplinar (PAD) com ampla defesa e contraditório. Servidor estável (3+ anos) só perde o cargo por sentença judicial, PAD ou avaliação periódica de desempenho. A exoneração unilateral sem processo é nula." },
      { q: "O Estado pode ser processado?", a: "Sim. A responsabilidade civil do Estado é objetiva (art. 37, §6.º, CF): o cidadão precisa provar apenas o dano e o nexo causal com a ação ou omissão do agente público. Exemplos: buraco na rua, erro médico em hospital público, demora judicial excessiva." },
      { q: "O que é improbidade administrativa?", a: "Improbidade é conduta desonesta de agente público que cause enriquecimento ilícito, prejuízo ao erário ou violação de princípios administrativos (Lei 8.429/92). As sanções incluem suspensão de direitos políticos, multa e proibição de contratar com o poder público." },
      { q: "Concurso homologado obriga a nomeação?", a: "Em regra, candidatos aprovados dentro do número de vagas têm direito subjetivo à nomeação durante a validade do concurso (Tema 161/STF). Aprovados além das vagas (cadastro de reserva) têm expectativa de direito, que se converte em direito se surgirem vagas durante a validade." },
      { q: "Quanto custa um advogado administrativista?", a: "Os honorários variam conforme a complexidade. Mandados de segurança e ações contra o Estado costumam ter valor fixo. Defesa em PAD pode ser por valor global. A tabela da OAB local serve como referência mínima." },
      { q: "Posso questionar multa de trânsito na Justiça?", a: "Sim, mas primeiro esgote a via administrativa: recurso ao JARI (30 dias) e depois ao CETRAN. Se mantida a multa, cabe ação judicial questionando vícios (falta de notificação, defeito no equipamento, sinalização inadequada). O prazo prescricional é de 5 anos." }
    ]
  },
  {
    slug: "ambiental",
    urgency: {
      level: "baixa",
      prazo: "imprescritível",
      alerta: "Dano ambiental é imprescritível — a reparação pode ser exigida a qualquer tempo (STF, RE 654.833). Multas do IBAMA, porém, devem ser contestadas em 20 dias."
    },
    paragraphs: [
      "O direito ambiental protege o meio ambiente como bem de uso comum do povo, regulamentando licenciamento, áreas protegidas, poluição, desmatamento e responsabilidade por danos ambientais. A Lei de Crimes Ambientais (9.605/98), o Código Florestal (12.651/2012) e a Política Nacional do Meio Ambiente (6.938/81) são seus pilares.",
      "A responsabilidade ambiental é objetiva e solidária: o causador do dano responde independentemente de culpa, e toda a cadeia produtiva pode ser responsabilizada (art. 225, §3.º, CF). O IBAMA, os órgãos estaduais (CETESB, FEAM) e as secretarias municipais fiscalizam e aplicam sanções.",
      "Um advogado ambientalista orienta em processos de licenciamento, defende empresas e produtores rurais em autuações, atua na regularização ambiental e representa vítimas de danos ambientais em ações civis e criminais."
    ],
    whenToHire: "Procure um advogado ambiental ao receber auto de infração do IBAMA ou órgão estadual, ao iniciar processo de licenciamento, ao precisar regularizar reserva legal ou APP, ou quando sua propriedade ou saúde for afetada por dano ambiental causado por terceiros.",
    commonCases: [
      "Defesa em autos de infração ambiental (IBAMA, órgãos estaduais)",
      "Licenciamento ambiental (LP, LI, LO)",
      "Regularização de Reserva Legal e Área de Preservação Permanente",
      "Crimes ambientais (desmatamento, poluição, fauna)",
      "Ações civis públicas por dano ambiental",
      "Compensação ambiental e termos de ajustamento de conduta (TAC)",
      "Cadastro Ambiental Rural (CAR) e Programa de Regularização Ambiental"
    ],
    faqs: [
      { q: "Recebi multa do IBAMA. Posso recorrer?", a: "Sim. O prazo para defesa administrativa é de 20 dias a partir da ciência do auto. Há possibilidade de recurso ao CONAMA em segunda instância. Vícios formais (falta de notificação, fundamentação insuficiente) e desproporcionalidade da multa são argumentos frequentes." },
      { q: "O que é licenciamento ambiental?", a: "É o procedimento administrativo para autorizar atividades potencialmente poluidoras. Envolve três etapas: Licença Prévia (LP), Licença de Instalação (LI) e Licença de Operação (LO). Cada etapa exige estudos ambientais específicos e aprovação do órgão competente." },
      { q: "Sou obrigado a manter Reserva Legal?", a: "Sim. O Código Florestal exige que propriedades rurais mantenham um percentual de vegetação nativa como Reserva Legal: 80% na Amazônia Legal, 35% no Cerrado e 20% nas demais regiões. A área deve ser registrada no CAR (Cadastro Ambiental Rural)." },
      { q: "Posso ser preso por crime ambiental?", a: "Sim. A Lei de Crimes Ambientais prevê penas de detenção e reclusão para crimes como desmatamento ilegal, poluição, maus-tratos a animais e construção em APP. Pessoas jurídicas também podem ser responsabilizadas criminalmente por danos ambientais." },
      { q: "O que é TAC (Termo de Ajustamento de Conduta)?", a: "É um acordo extrajudicial firmado com o Ministério Público ou órgão ambiental para reparar o dano e cessar a atividade irregular. O TAC evita processo judicial e pode incluir redução de multa, prazos para recuperação da área e compensação ambiental." },
      { q: "Quanto custa um advogado ambiental?", a: "Honorários variam conforme a complexidade do licenciamento ou da defesa. Autuações do IBAMA com valores altos justificam honorários por êxito. Consultoria preventiva em licenciamento costuma ser por valor fixo ou hora técnica." }
    ]
  },
  {
    slug: "digital",
    urgency: {
      level: "media",
      prazo: "varia",
      alerta: "Prazos em direito digital variam: crimes cibernéticos seguem prescrição penal, a LGPD prevê multas de até R$ 50 milhões e o Marco Civil exige ordem judicial para remoção de conteúdo."
    },
    paragraphs: [
      "O direito digital abrange questões jurídicas relacionadas à internet, tecnologia e proteção de dados pessoais. A Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018), o Marco Civil da Internet (Lei 12.965/2014) e o Código Penal (crimes cibernéticos) são os marcos legais centrais.",
      "Com a digitalização da sociedade, aumentaram os casos de vazamento de dados, golpes online, difamação em redes sociais, violação de privacidade e uso indevido de propriedade intelectual digital. Empresas e indivíduos precisam se adequar à LGPD sob pena de multas que podem chegar a R$ 50 milhões por infração.",
      "Um advogado especializado em direito digital atua na adequação à LGPD, na remoção de conteúdo ofensivo, na defesa em crimes cibernéticos e na consultoria sobre contratos eletrônicos, termos de uso e políticas de privacidade."
    ],
    whenToHire: "Procure um advogado digital quando sofrer golpe online, ter dados pessoais vazados, precisar remover conteúdo ofensivo da internet, adequar sua empresa à LGPD ou resolver disputas sobre contratos eletrônicos e propriedade intelectual online.",
    commonCases: [
      "Adequação à LGPD e política de privacidade",
      "Remoção de conteúdo ofensivo e direito ao esquecimento",
      "Crimes cibernéticos (fraude, estelionato digital, invasão)",
      "Contratos de SaaS, licenciamento de software e termos de uso",
      "Violação de marca e direito autoral na internet",
      "Vazamento de dados pessoais e responsabilidade",
      "Difamação e danos morais em redes sociais"
    ],
    faqs: [
      { q: "O que é LGPD e quem precisa se adequar?", a: "A Lei Geral de Proteção de Dados regula o tratamento de dados pessoais por qualquer pessoa ou empresa, pública ou privada. Toda organização que coleta, armazena ou processa dados pessoais (nome, CPF, e-mail, endereço) precisa se adequar, sob pena de multa de até R$ 50 milhões." },
      { q: "Posso pedir para removerem meu conteúdo da internet?", a: "Sim. O Marco Civil da Internet prevê remoção judicial de conteúdo que viole a intimidade. Em casos de nudez ou atos sexuais sem consentimento, a plataforma deve remover após notificação extrajudicial. O STJ reconhece o direito ao esquecimento em situações específicas." },
      { q: "Fui vítima de golpe online. O que fazer?", a: "Registre boletim de ocorrência (muitas delegacias aceitam online). Guarde prints, comprovantes de pagamento e conversas. Comunique seu banco imediatamente para tentar bloquear a transação. Um advogado digital pode rastrear os responsáveis e buscar reparação." },
      { q: "Empresa pode monitorar e-mail corporativo do funcionário?", a: "Sim, desde que o funcionário seja previamente informado na política de uso. O e-mail corporativo é ferramenta de trabalho e a empresa pode monitorar seu uso profissional. Entretanto, acessar e-mail pessoal do funcionário é violação de privacidade." },
      { q: "Posso usar imagem de pessoa sem autorização?", a: "Em regra, não. O uso da imagem de pessoa sem consentimento gera obrigação de indenizar (art. 20 do CC e art. 5.º, X, CF). Exceções: interesse público, didático, noticioso (desde que sem abuso) e imagens em locais públicos sem destaque individual." },
      { q: "Como proteger minha marca na internet?", a: "Registre a marca no INPI e o domínio correspondente. Monitore redes sociais e marketplaces para uso indevido. Em caso de violação, notifique a plataforma e, se necessário, ingresse com ação judicial. O registro no INPI é a principal prova de titularidade." }
    ]
  },
  {
    slug: "eleitoral",
    urgency: {
      level: "alta",
      prazo: "3–15 dias",
      alerta: "Prazos eleitorais são curtíssimos: recurso contra decisão do juiz eleitoral é de 3 dias (art. 258, CE). Impugnação de candidatura tem prazo de 5 dias após publicação do pedido de registro."
    },
    paragraphs: [
      "O direito eleitoral regulamenta o processo democrático: eleições, partidos políticos, registro de candidaturas, propaganda eleitoral, prestação de contas e crimes eleitorais. O Código Eleitoral (Lei 4.737/65), a Lei das Eleições (9.504/97) e a Lei dos Partidos (9.096/95) são os diplomas centrais.",
      "A Justiça Eleitoral, com estrutura própria (TSE, TREs e juízes eleitorais), fiscaliza e julga questões relativas ao processo eleitoral. Prazos são rigorosos e a atuação do advogado eleitoral é essencial desde o registro da candidatura até a diplomação.",
      "Advogados eleitorais assessoram candidatos e partidos na regularização de candidaturas, na defesa contra impugnações, na condução de representações por propaganda irregular e na prestação de contas de campanha."
    ],
    whenToHire: "Procure um advogado eleitoral ao se candidatar a cargo eletivo, ao organizar prestação de contas de campanha, ao precisar impugnar candidatura adversária ou ao enfrentar processo por irregularidade eleitoral.",
    commonCases: [
      "Registro de candidatura e impugnação",
      "Prestação de contas de campanha eleitoral",
      "Representação por propaganda eleitoral irregular",
      "Ação de investigação judicial eleitoral (AIJE)",
      "Cassação de mandato eletivo",
      "Defesa em crimes eleitorais (compra de votos, boca de urna)",
      "Consultas sobre elegibilidade e desincompatibilização"
    ],
    faqs: [
      { q: "Quando devo contratar advogado eleitoral?", a: "Idealmente, meses antes da eleição: para analisar condições de elegibilidade, desincompatibilização de cargos, filiação partidária e organização jurídica da campanha. Durante e após a eleição, para representações, prestação de contas e defesa em impugnações." },
      { q: "O que pode causar inelegibilidade?", a: "As causas estão na Lei da Ficha Limpa (LC 135/2010): condenação criminal transitada em julgado ou por órgão colegiado, rejeição de contas, cassação de mandato, renúncia para fugir de cassação, entre outras. Os efeitos duram 8 anos após o cumprimento da pena." },
      { q: "Propaganda eleitoral na internet tem regras?", a: "Sim. É permitida a propaganda em redes sociais e sites, mas é proibida propaganda paga na internet (exceto impulsionamento, permitido desde 2017). O conteúdo deve identificar o candidato ou partido e respeitar as regras de horário e período eleitoral." },
      { q: "Quanto custa um advogado eleitoral?", a: "Os honorários variam conforme o porte da campanha e os serviços necessários. Assessoria completa de campanha municipal costuma ter valor fixo. Defesas em ações específicas podem ter honorários separados. A tabela da OAB serve como referência." }
    ]
  },
  {
    slug: "militar",
    urgency: {
      level: "alta",
      prazo: "varia",
      alerta: "Procedimentos militares têm prazos próprios e rigorosos. Conselho de disciplina exige defesa em prazo curto, e deserção se configura após 8 dias de ausência (art. 187, CPM)."
    },
    paragraphs: [
      "O direito militar regula as relações jurídicas das Forças Armadas (Exército, Marinha, Aeronáutica) e das forças auxiliares (Polícia Militar, Corpo de Bombeiros Militar). O Código Penal Militar (Decreto-Lei 1.001/69), o Código de Processo Penal Militar e o Estatuto dos Militares (Lei 6.880/80) são os marcos legais.",
      "A Justiça Militar é especializada e independente: a Justiça Militar da União julga crimes cometidos por militares das Forças Armadas, enquanto a Justiça Militar Estadual julga policiais e bombeiros militares. Há varas especializadas e tribunais próprios (STM e TJMs).",
      "Um advogado militarista atua na defesa em conselhos de disciplina, processos penais militares, questões de reforma e aposentadoria, promoções e transferências, e na defesa dos direitos funcionais de militares ativos e inativos."
    ],
    whenToHire: "Procure um advogado militar ao enfrentar conselho de disciplina, processo penal militar, questionar promoção ou transferência, solicitar reforma ou aposentadoria militar, ou quando seus direitos como militar forem violados pela administração.",
    commonCases: [
      "Defesa em conselho de disciplina e conselho de justificação",
      "Processos penais militares (deserção, insubordinação)",
      "Reforma e aposentadoria militar",
      "Promoção por tempo de serviço e por merecimento",
      "Transferência e remoção",
      "Licenciamento e exclusão das fileiras",
      "Indenização por acidente em serviço"
    ],
    faqs: [
      { q: "O que acontece em um conselho de disciplina?", a: "O conselho de disciplina apura transgressão disciplinar de praças (soldados, cabos, sargentos). O militar é notificado, tem prazo para defesa por escrito e pode ser assistido por advogado. As sanções vão de advertência a exclusão das fileiras." },
      { q: "Militar pode processar as Forças Armadas?", a: "Sim. O militar pode questionar judicialmente atos administrativos que violem seus direitos — promoções negadas, transferências arbitrárias, punições ilegais. A ação tramita na Justiça Federal (Forças Armadas) ou Justiça Estadual (PM/BM)." },
      { q: "Quando o militar tem direito a reforma?", a: "A reforma (aposentadoria militar) pode ser concedida por invalidez, por atingir idade-limite, por conclusão do tempo de serviço (30/35 anos) ou por acidente em serviço. O valor e as condições variam conforme o tipo de reforma e a legislação aplicável." },
      { q: "Deserção é crime grave?", a: "Deserção é ausência do militar por mais de 8 dias sem autorização (art. 187 do CPM). A pena é de detenção de 6 meses a 2 anos para praças. Oficiais sofrem sanções administrativas mais severas. A reapresentação voluntária é circunstância atenuante." }
    ]
  },
  {
    slug: "internacional",
    urgency: {
      level: "baixa",
      prazo: "varia",
      alerta: "Prazos em direito internacional dependem de acordos bilaterais e da legislação de cada país. Processos de cidadania e homologação de sentença estrangeira geralmente não têm urgência, mas vistos e regularização migratória podem ter prazos específicos."
    },
    paragraphs: [
      "O direito internacional trata de relações jurídicas que envolvem mais de um país: cidadania, vistos, contratos internacionais, comércio exterior, arbitragem, cooperação jurídica e direitos humanos. No Brasil, o Estatuto do Estrangeiro (Lei 13.445/2017 — Lei de Migração) e o CPC (cooperação internacional) são referências importantes.",
      "Brasileiros no exterior e estrangeiros no Brasil enfrentam questões como regularização migratória, dupla cidadania, reconhecimento de diplomas, homologação de sentenças estrangeiras e conflitos de jurisdição. A globalização e o aumento da migração tornaram o direito internacional cada vez mais relevante.",
      "Um advogado internacionalista auxilia em processos de cidadania (italiana, portuguesa, espanhola), contratos de comércio exterior, defesa em litígios transnacionais, arbitragem internacional e regularização migratória de estrangeiros no Brasil."
    ],
    whenToHire: "Procure um advogado internacional quando precisar de cidadania estrangeira, regularizar situação migratória, firmar contratos com empresas de outros países, importar ou exportar, ou quando envolvido em litígio que envolva legislação de mais de um país.",
    commonCases: [
      "Processo de cidadania (italiana, portuguesa, espanhola)",
      "Vistos de trabalho, estudo e residência",
      "Contratos internacionais e cláusulas de jurisdição",
      "Comércio exterior (importação e exportação)",
      "Homologação de sentença estrangeira no STJ",
      "Arbitragem internacional",
      "Regularização migratória e naturalização"
    ],
    faqs: [
      { q: "Como obter cidadania italiana?", a: "A cidadania italiana é transmitida por jus sanguinis (direito de sangue), sem limite de gerações. É preciso reunir certidões de nascimento, casamento e óbito de todos os ascendentes, retificar nomes e solicitar via consulado ou diretamente na Itália. O processo pode levar de 2 a 10 anos, dependendo da via escolhida." },
      { q: "Preciso de advogado para contrato internacional?", a: "É altamente recomendável. Contratos internacionais envolvem definição de lei aplicável, foro competente, moeda, Incoterms (comércio), arbitragem, compliance e questões tributárias. Um erro pode expor a empresa a litígio em jurisdição desfavorável." },
      { q: "Sentença estrangeira vale no Brasil?", a: "Não automaticamente. É necessário homologar a sentença perante o STJ (art. 961 do CPC). O processo verifica requisitos formais (autenticidade, tradução, coisa julgada) sem reexaminar o mérito. Após homologação, a sentença é executada como título judicial brasileiro." },
      { q: "Estrangeiro pode comprar imóvel no Brasil?", a: "Sim, com restrições. Estrangeiros podem comprar imóveis urbanos sem limitação. Imóveis rurais têm restrições de área (Lei 5.709/71). É necessário ter CPF e, em alguns casos, autorização do INCRA. O advogado orienta sobre tributação e aspectos registrais." }
    ]
  }
];

const INDEX = new Map<string, SpecialtyContent>();
for (const d of DATA) INDEX.set(d.slug, d);

export function getSpecialtyContent(slug: string): SpecialtyContent | undefined {
  return INDEX.get(slug);
}

export const ALL_SPECIALTY_CONTENT = DATA;
