/**
 * Glossário jurídico — termos essenciais com definições conservadoras
 * em linguagem acessível.
 *
 * Regras editoriais (F16):
 *  - Definições próprias, em pt-BR humano, sem copiar fontes oficiais
 *  - Conservador: nunca afirmar prazos ou valores sem qualificar
 *  - "Procure sempre um advogado" como nota final
 *  - Sem inventar jurisprudência — só linkar para temas com decisões reais
 *  - Sem keyword stuffing
 *
 * Cada termo gera /glossario/[slug] indexável.
 */

export type GlossarioTermo = {
  slug: string;
  termo: string;
  /** Sinônimos e variações pra autocomplete e SEO interno (sem stuffing) */
  variacoes?: string[];
  /** Definição curta (1 frase) — usada em meta description e cards */
  definicao_curta: string;
  /** Explicação completa em parágrafos — 3 a 6 parágrafos */
  explicacao: string[];
  /** Exemplos práticos em linguagem leiga */
  exemplos?: string[];
  /** Áreas do direito relacionadas (slug das specialties) */
  areas: string[];
  /** Outros termos do glossário que valem ver */
  ver_tambem?: string[];
  /** Slug do tema de jurisprudência STJ associado, se houver */
  tema_jurisprudencia?: string;
  /** Slug do problema jurídico relacionado, se houver */
  problema?: string;
  /** Atualizado em — formato ISO (controla lastmod no sitemap) */
  atualizado_em: string;
};

export const GLOSSARIO: GlossarioTermo[] = [
  {
    slug: "dano-moral",
    termo: "Dano moral",
    variacoes: ["danos morais", "indenização por dano moral"],
    definicao_curta:
      "Lesão a direitos da personalidade (honra, imagem, dignidade) que enseja reparação financeira.",
    explicacao: [
      "Dano moral é a ofensa a aspectos não patrimoniais da pessoa, como honra, imagem, intimidade, dignidade ou integridade psíquica. Difere do dano material, que atinge o patrimônio, porque o dano moral atinge a esfera pessoal.",
      "A reparação é financeira porque não se trata de devolver dinheiro perdido — trata-se de uma compensação pelo sofrimento e um sinal de reprovação à conduta. O valor é arbitrado pelo juiz, considerando gravidade, condição das partes e jurisprudência.",
      "Nem todo aborrecimento configura dano moral. A jurisprudência brasileira costuma exigir que a situação ultrapasse o mero dissabor do dia a dia. Casos clássicos envolvem negativação indevida, recusa de cobertura por plano de saúde, extravio de bagagem e ofensas em redes sociais."
    ],
    exemplos: [
      "Banco mantém o nome no SPC mesmo após o consumidor pagar a dívida",
      "Plano de saúde nega cirurgia urgente com cobertura prevista no contrato",
      "Loja constrange o cliente em público acusando-o falsamente de furto",
      "Empresa expõe dados pessoais em vazamento sem informar os titulares"
    ],
    areas: ["civil", "consumidor"],
    ver_tambem: ["dano-material", "responsabilidade-civil", "negativacao-indevida"],
    tema_jurisprudencia: "dano-moral",
    problema: "nome-negativado-indevidamente",
    atualizado_em: "2026-05-21"
  },
  {
    slug: "dano-material",
    termo: "Dano material",
    variacoes: ["danos materiais", "danos emergentes", "lucros cessantes"],
    definicao_curta:
      "Prejuízo financeiro concreto sofrido por uma pessoa — gastos feitos ou ganhos perdidos.",
    explicacao: [
      "Dano material é o prejuízo que se mede em dinheiro. Engloba os danos emergentes (o que a pessoa efetivamente gastou ou perdeu) e os lucros cessantes (o que deixou de ganhar por causa do ato).",
      "Para receber, a pessoa precisa comprovar o prejuízo com documentos — notas, recibos, contratos, holerites. Sem prova, o juiz não pode arbitrar valor com base em estimativa pessoal.",
      "Pode ser cumulado com dano moral no mesmo processo. Súmula 37 do STJ admite cumulação de dano moral e material decorrentes do mesmo fato."
    ],
    exemplos: [
      "Conserto do carro após acidente causado por outro motorista",
      "Tratamento médico pago pelo paciente após erro de hospital",
      "Salários que o trabalhador deixou de receber por demissão indevida"
    ],
    areas: ["civil", "consumidor", "trabalhista"],
    ver_tambem: ["dano-moral", "responsabilidade-civil"],
    atualizado_em: "2026-05-21"
  },
  {
    slug: "prescricao",
    termo: "Prescrição",
    variacoes: ["prazo prescricional", "prescrição extintiva"],
    definicao_curta:
      "Perda do direito de exigir algo em juízo por não tê-lo cobrado dentro do prazo legal.",
    explicacao: [
      "A prescrição é o tempo que a lei concede para que alguém ingresse com ação judicial. Passado o prazo sem cobrança, a parte perde a pretensão — pode até continuar devendo, mas não pode mais ser obrigada a pagar pela via judicial.",
      "Os prazos variam conforme o tipo de direito. Cobrança de aluguel, por exemplo, tem prazo diferente de pretensão a danos morais ou a verbas trabalhistas. Por isso, prazo prescricional é assunto que sempre exige conferência com advogado antes de decidir esperar ou agir.",
      "Não se confunde com decadência. Prescrição extingue a pretensão; decadência extingue o próprio direito. Em casos de relação de consumo, há regras específicas no Código de Defesa do Consumidor."
    ],
    exemplos: [
      "Trabalhador que deixa passar mais de dois anos após sair do emprego para cobrar verbas",
      "Consumidor que demora além do prazo para reclamar de defeito em produto",
      "Vítima de acidente que pretende cobrar indenização anos depois"
    ],
    areas: ["civil", "trabalhista", "consumidor"],
    ver_tambem: ["decadencia", "ação-judicial"],
    atualizado_em: "2026-05-21"
  },
  {
    slug: "usucapiao",
    termo: "Usucapião",
    variacoes: ["usucapião extrajudicial", "usucapião urbana", "usucapião rural"],
    definicao_curta:
      "Modo de adquirir propriedade de um imóvel pela posse prolongada e pacífica, com requisitos legais.",
    explicacao: [
      "Usucapião é a forma de a pessoa se tornar dona de um imóvel por ter ocupado e cuidado dele por tempo determinado em lei, sem oposição do dono e com a intenção de ser proprietária. É instituto antigo do direito civil que existe para dar destino útil a imóveis abandonados.",
      "Existem várias modalidades — ordinária, extraordinária, especial urbana, especial rural, familiar e por abandono do lar. Cada uma tem requisitos próprios de tempo, área, finalidade e tipo de imóvel.",
      "Desde 2015 é possível fazer usucapião extrajudicial em cartório, em vez de processo na Justiça. Acelera, mas exige que não haja conflito e que todos os documentos estejam em ordem. Casos com conflito continuam indo para o juiz."
    ],
    exemplos: [
      "Família que mora há mais de 15 anos em terreno cujo dono nunca apareceu",
      "Pequeno produtor rural que cultiva área de até 50 hectares há cinco anos",
      "Cônjuge abandonado que continuou no imóvel após o outro sair"
    ],
    areas: ["civil", "imobiliario"],
    ver_tambem: ["posse", "propriedade"],
    tema_jurisprudencia: "usucapiao",
    atualizado_em: "2026-05-21"
  },
  {
    slug: "inventario",
    termo: "Inventário",
    variacoes: ["inventário judicial", "inventário extrajudicial", "partilha"],
    definicao_curta:
      "Procedimento para apurar bens, dívidas e herdeiros de uma pessoa falecida e dividir o patrimônio.",
    explicacao: [
      "Inventário é o caminho oficial para transferir os bens de quem morreu aos herdeiros. Sem inventário concluído, os bens ficam no nome do falecido e não podem ser vendidos, alugados sob garantia formal nem usados para garantir dívidas dos sucessores.",
      "Pode ser judicial ou extrajudicial. O extrajudicial é feito em cartório, mais rápido, e exige que todos os herdeiros sejam maiores, capazes, concordem com a partilha e que não haja testamento — quando há testamento, em regra, é necessária a via judicial.",
      "Há prazo legal para abertura — geralmente 60 dias do óbito — sob risco de multa fiscal sobre o ITCMD (imposto sobre herança). O atraso aumenta custos, mas não impede a abertura."
    ],
    exemplos: [
      "Família que precisa vender imóvel deixado pelo pai falecido",
      "Cônjuge sobrevivente que quer regularizar a titularidade do apartamento",
      "Filhos que precisam dividir saldo bancário e ações deixadas pela mãe"
    ],
    areas: ["familia", "civil"],
    ver_tambem: ["heranca", "testamento", "partilha"],
    tema_jurisprudencia: "inventario",
    problema: "perdi-um-familiar-e-preciso-fazer-inventario",
    atualizado_em: "2026-05-21"
  },
  {
    slug: "pensao-alimenticia",
    termo: "Pensão alimentícia",
    variacoes: ["alimentos", "pensão"],
    definicao_curta:
      "Valor pago periodicamente para custear necessidades básicas de quem não tem condições de se sustentar.",
    explicacao: [
      "Pensão alimentícia é a obrigação de uma pessoa custear as necessidades básicas de outra que com ela tem vínculo familiar — alimentação, moradia, saúde, educação, vestuário. O nome lembra apenas comida, mas o conceito é amplo.",
      "Os casos mais comuns envolvem pais para filhos menores, mas a obrigação também alcança ex-cônjuges em situações específicas, filhos para pais idosos e parentes em linha reta. Vale o binômio necessidade de quem recebe e possibilidade de quem paga.",
      "O valor pode ser revisto sempre que muda a situação financeira de uma das partes. O atraso permite medidas drásticas — desconto em folha, bloqueio de bens e até prisão civil em casos persistentes para alimentos devidos a filhos."
    ],
    exemplos: [
      "Pai que paga percentual do salário para o filho menor após o divórcio",
      "Filho adulto que ajuda nos custos de saúde do pai idoso sem renda",
      "Ex-cônjuge que recebe valor temporário enquanto se restabelece profissionalmente"
    ],
    areas: ["familia"],
    ver_tambem: ["divorcio", "guarda"],
    tema_jurisprudencia: "pensao-alimenticia",
    problema: "pai-nao-paga-pensao",
    atualizado_em: "2026-05-21"
  },
  {
    slug: "divorcio",
    termo: "Divórcio",
    variacoes: ["divórcio consensual", "divórcio litigioso", "separação"],
    definicao_curta:
      "Dissolução do casamento que permite às partes se casarem novamente.",
    explicacao: [
      "Divórcio põe fim ao vínculo do casamento. Desde 2010, com a Emenda Constitucional 66, não é mais exigido prazo prévio de separação para divorciar — basta a vontade de qualquer dos cônjuges.",
      "Pode ser consensual (quando há acordo sobre partilha de bens, filhos e pensão) ou litigioso (quando uma das partes resiste ou há conflito). O consensual pode ser feito em cartório se não houver filhos menores ou incapazes e se as partes estiverem assistidas por advogado.",
      "Mesmo no divórcio cartorário é obrigatória a presença de advogado para garantir que cada parte conhece seus direitos. A divisão de bens segue o regime do casamento, e questões de filhos seguem o melhor interesse das crianças."
    ],
    exemplos: [
      "Casal sem filhos menores que decide se divorciar amigavelmente",
      "Cônjuge que pede o divórcio mesmo sem concordância do outro",
      "Família que precisa definir guarda dos filhos junto com o divórcio"
    ],
    areas: ["familia"],
    ver_tambem: ["pensao-alimenticia", "guarda", "regime-de-bens"],
    problema: "quero-me-divorciar",
    atualizado_em: "2026-05-21"
  },
  {
    slug: "guarda",
    termo: "Guarda",
    variacoes: ["guarda compartilhada", "guarda unilateral", "convivência"],
    definicao_curta:
      "Definição sobre quem fica responsável pela criação cotidiana de filhos menores e como se dá a convivência.",
    explicacao: [
      "Guarda é a definição sobre o cuidado diário dos filhos menores quando os pais não vivem juntos. A regra atual no Brasil é a guarda compartilhada — ambos os pais responsáveis, ainda que a criança more com um deles.",
      "A guarda unilateral, em que apenas um pai detém as decisões, é exceção. Costuma ser determinada quando há risco para a criança ou quando o outro pai está ausente. Em qualquer caso, o pai sem guarda mantém direito de visita e o dever de pensão.",
      "Convivência é o tempo da criança com cada pai. Pode ser definida em acordo ou pelo juiz, sempre com base no melhor interesse da criança. Decisões importantes (escola, saúde, viagens) costumam exigir consenso entre os pais."
    ],
    exemplos: [
      "Pais separados que dividem decisões escolares e a criança mora com a mãe",
      "Pai que pede inversão da guarda alegando descuido do outro",
      "Avós que pleiteiam guarda quando os pais não têm condições"
    ],
    areas: ["familia"],
    ver_tambem: ["pensao-alimenticia", "divorcio"],
    atualizado_em: "2026-05-21"
  },
  {
    slug: "fgts",
    termo: "FGTS",
    variacoes: ["Fundo de Garantia", "saque FGTS"],
    definicao_curta:
      "Depósito mensal feito pelo empregador na conta vinculada do trabalhador, sacado em situações previstas em lei.",
    explicacao: [
      "O Fundo de Garantia do Tempo de Serviço (FGTS) é um valor mensal que o empregador deposita em conta vinculada do trabalhador, equivalente a 8% do salário em regra. É direito do trabalhador celetista.",
      "Pode ser sacado em situações específicas — demissão sem justa causa, aposentadoria, doença grave, compra de imóvel próprio, entre outras. Em demissão sem justa causa, o trabalhador também recebe a multa de 40% do saldo, paga pelo empregador.",
      "Diferenças no depósito (valor menor que o devido, falta de depósito) podem ser cobradas em processo trabalhista. A jurisprudência costuma ser favorável quando o trabalhador comprova o vínculo e o salário real."
    ],
    exemplos: [
      "Trabalhador demitido sem justa causa que vai sacar o saldo mais multa",
      "Empregado que descobre que o patrão não vinha depositando regularmente",
      "Pessoa que quer usar o saldo do FGTS para dar entrada em apartamento"
    ],
    areas: ["trabalhista"],
    ver_tambem: ["rescisao", "horas-extras"],
    problema: "fui-demitido-sem-receber-direitos",
    atualizado_em: "2026-05-21"
  },
  {
    slug: "rescisao",
    termo: "Rescisão",
    variacoes: ["rescisão trabalhista", "verbas rescisórias", "acerto"],
    definicao_curta:
      "Encerramento do contrato de trabalho e pagamento das verbas devidas até a saída.",
    explicacao: [
      "Rescisão é o desligamento do trabalhador formal, com cálculo das verbas devidas até o último dia. O conjunto desses valores se chama verbas rescisórias e inclui saldo de salário, férias, 13º proporcional, aviso prévio (em parte das hipóteses) e, em demissões sem justa causa, FGTS e multa.",
      "O tipo de rescisão muda muito o que o trabalhador recebe. Justa causa, pedido de demissão, demissão sem justa causa, acordo entre as partes e rescisão indireta têm consequências diferentes. Erro na classificação prejudica diretamente o bolso do trabalhador.",
      "A jurisprudência trabalhista permite reverter classificações injustas, especialmente quando o trabalhador foi forçado a pedir demissão ou foi enquadrado em justa causa sem provas."
    ],
    exemplos: [
      "Demissão sem justa causa com pagamento de aviso, multa de 40% e seguro-desemprego",
      "Pedido de demissão com perda de boa parte das verbas",
      "Acordo de 2017 que permite saque parcial do FGTS sem direito ao seguro"
    ],
    areas: ["trabalhista"],
    ver_tambem: ["fgts", "aviso-previo"],
    problema: "fui-demitido-sem-receber-direitos",
    atualizado_em: "2026-05-21"
  },
  {
    slug: "horas-extras",
    termo: "Horas extras",
    variacoes: ["hora extra", "jornada extraordinária"],
    definicao_curta:
      "Trabalho prestado além da jornada contratada, remunerado com adicional sobre a hora normal.",
    explicacao: [
      "Hora extra é toda hora trabalhada além da jornada combinada. A Constituição garante adicional mínimo de 50% sobre a hora normal — algumas convenções coletivas estabelecem mais, e o domingo e feriado costumam ter 100%.",
      "Para cobrar judicialmente, o trabalhador precisa demonstrar quanto trabalhou. Pontos eletrônicos, mensagens de WhatsApp, e-mails fora do horário e testemunhas costumam ser provas usadas.",
      "Cargos de confiança, externos e algumas funções específicas têm regras próprias. Não basta o título do cargo — o juiz analisa as funções reais para decidir se há ou não direito a horas extras."
    ],
    exemplos: [
      "Trabalhador que ficava regularmente até as 20h sem registrar no ponto",
      "Vendedor externo que tinha rota controlada por aplicativo",
      "Funcionário que era acionado fora do expediente por mensagens do chefe"
    ],
    areas: ["trabalhista"],
    ver_tambem: ["rescisao", "fgts"],
    atualizado_em: "2026-05-21"
  },
  {
    slug: "aposentadoria",
    termo: "Aposentadoria",
    variacoes: ["aposentadoria por idade", "aposentadoria por tempo", "aposentadoria por invalidez"],
    definicao_curta:
      "Benefício previdenciário que substitui a renda do trabalho quando atendidos os requisitos legais.",
    explicacao: [
      "Aposentadoria é o benefício pago pelo INSS (ou regimes próprios, no caso de servidores) quando o segurado preenche requisitos de idade, tempo de contribuição ou condição de saúde. Após a reforma da Previdência de 2019, os requisitos foram alterados, com regras de transição para quem já contribuía.",
      "As modalidades mais comuns são aposentadoria por idade, aposentadoria por tempo de contribuição (transição), aposentadoria especial (atividade insalubre ou perigosa) e aposentadoria por incapacidade permanente.",
      "Concessão pelo INSS é frequentemente negada por documentação incompleta ou cálculo equivocado de tempo. Em muitos casos vale revisar com calma antes de aceitar a primeira resposta, e há margem para revisão administrativa ou judicial."
    ],
    exemplos: [
      "Trabalhadora rural que comprova atividade no campo por décadas",
      "Operário que trabalhou anos em ambiente insalubre",
      "Pessoa que perdeu capacidade de trabalho por doença grave"
    ],
    areas: ["previdenciario"],
    ver_tambem: ["auxilio-doenca", "pensao-por-morte"],
    problema: "beneficio-do-inss-foi-negado",
    atualizado_em: "2026-05-21"
  },
  {
    slug: "auxilio-doenca",
    termo: "Auxílio-doença",
    variacoes: ["benefício por incapacidade temporária", "B31"],
    definicao_curta:
      "Benefício do INSS pago ao segurado temporariamente incapaz de trabalhar por motivo de saúde.",
    explicacao: [
      "Hoje chamado oficialmente de benefício por incapacidade temporária, o auxílio-doença é pago a quem não consegue trabalhar por mais de 15 dias por motivo de saúde. Os 15 primeiros dias são pagos pelo empregador (no caso de empregado celetista); a partir do 16º, pelo INSS.",
      "Requer perícia médica do INSS para reconhecimento. Negativas administrativas são comuns, especialmente quando há divergência entre o atestado do médico assistente e o do perito. Existe a possibilidade de recurso e de ação judicial.",
      "Em casos de doenças graves listadas em lei (câncer, esclerose múltipla, etc.) há facilidades — não há carência e o benefício pode ser concedido de plano."
    ],
    exemplos: [
      "Trabalhadora afastada por depressão crônica diagnosticada por psiquiatra",
      "Profissional que se acidentou e precisa de cirurgia com recuperação longa",
      "Pessoa em tratamento de câncer que pede o benefício"
    ],
    areas: ["previdenciario"],
    ver_tambem: ["aposentadoria"],
    problema: "beneficio-do-inss-foi-negado",
    atualizado_em: "2026-05-21"
  },
  {
    slug: "negativacao-indevida",
    termo: "Negativação indevida",
    variacoes: ["nome sujo indevido", "SPC/Serasa indevido", "inscrição indevida"],
    definicao_curta:
      "Inclusão indevida do nome do consumidor em cadastro de devedores, sem dívida real ou exigível.",
    explicacao: [
      "Negativação indevida ocorre quando o nome da pessoa é inscrito em órgãos como SPC e Serasa sem que exista dívida válida — por erro de identificação, pagamento já efetuado, dívida prescrita, fraude ou cobrança considerada abusiva.",
      "Quando indevida, gera direito a baixa imediata da restrição e, conforme jurisprudência consolidada, a indenização por dano moral. O valor varia conforme caso, mas a regra é a presunção do dano em razão do constrangimento.",
      "Há exceção importante: a Súmula 385 do STJ afirma que, se o consumidor já tinha outras inscrições legítimas anteriores, não cabe indenização, apenas a baixa da nova inscrição indevida."
    ],
    exemplos: [
      "Banco mantém o nome no Serasa após o consumidor pagar a dívida",
      "Loja inscreve cliente por dívida de homônimo",
      "Operadora telefônica negativa pessoa que cancelou o plano há meses"
    ],
    areas: ["consumidor", "civil"],
    ver_tambem: ["dano-moral", "spc-serasa"],
    tema_jurisprudencia: "negativacao-indevida",
    problema: "nome-negativado-indevidamente",
    atualizado_em: "2026-05-21"
  },
  {
    slug: "plano-de-saude",
    termo: "Plano de saúde (cobertura)",
    variacoes: ["recusa de plano de saúde", "cobertura negada", "rol da ANS"],
    definicao_curta:
      "Contrato de prestação de assistência médica regulado pela ANS, com regras próprias de cobertura.",
    explicacao: [
      "O plano de saúde é serviço contratado pelo consumidor para custear assistência médica. É regulado pela ANS e segue um rol de procedimentos de cobertura obrigatória, periodicamente revisado.",
      "Recusas de cobertura são frequentemente questionadas em ação judicial. A jurisprudência do STJ costuma reconhecer direito ao tratamento mesmo fora do rol em situações específicas — tratamento prescrito pelo médico assistente, ausência de alternativa eficaz no rol, e outros critérios fixados em precedentes recentes.",
      "Carência, doença preexistente, reajustes por faixa etária e cancelamento unilateral são pontos de atrito frequentes. Em todos eles vale checar o contrato, normativos da ANS e a jurisprudência atualizada antes de aceitar a negativa."
    ],
    exemplos: [
      "Recusa de cirurgia de urgência por carência",
      "Negativa de medicamento de alto custo prescrito pelo médico",
      "Reajuste abusivo por mudança de faixa etária em idoso"
    ],
    areas: ["consumidor", "civil"],
    ver_tambem: ["dano-moral", "responsabilidade-civil"],
    tema_jurisprudencia: "plano-de-saude",
    problema: "plano-de-saude-negou-cirurgia",
    atualizado_em: "2026-05-21"
  },
  {
    slug: "habeas-corpus",
    termo: "Habeas corpus",
    variacoes: ["HC", "writ"],
    definicao_curta:
      "Ação constitucional para proteger a liberdade de locomoção contra ilegalidade ou abuso de poder.",
    explicacao: [
      "Habeas corpus é a garantia constitucional usada quando alguém está preso ilegalmente ou ameaçado de prisão. Tem rito sumário, dispensa custas e pode ser impetrado por qualquer pessoa em favor de outra.",
      "Existem duas modalidades. O preventivo é usado contra ameaça de prisão; o liberatório, contra prisão já consumada. A decisão pode soltar imediatamente o paciente quando reconhecida a ilegalidade.",
      "Não substitui a defesa no processo principal. Serve para situações de violação direta da liberdade — prisão sem fundamentação, prisão após prescrição, prisão decorrente de erro de pessoa, e similares."
    ],
    exemplos: [
      "Pessoa presa preventivamente sem fundamentação concreta",
      "Réu mantido preso após pena já cumprida",
      "Preso que sofre maus-tratos no estabelecimento penitenciário (HC quanto às condições)"
    ],
    areas: ["criminal"],
    ver_tambem: ["prisao-preventiva", "ação-penal"],
    atualizado_em: "2026-05-21"
  },
  {
    slug: "recurso-especial",
    termo: "Recurso especial",
    variacoes: ["REsp", "recurso ao STJ"],
    definicao_curta:
      "Recurso ao STJ contra decisões que afrontam lei federal ou divergem entre tribunais.",
    explicacao: [
      "Recurso especial é o instrumento processual cabível contra acórdão de tribunal de segunda instância que tenha contrariado lei federal, dado a ela interpretação divergente entre tribunais ou negado vigência. É julgado pelo STJ.",
      "Tem requisitos rígidos. Não serve para reexaminar fatos e provas (Súmula 7 do STJ) — só questões de direito. Por isso o trabalho do advogado é mostrar a tese jurídica violada ou divergente.",
      "Boa parte das principais súmulas e teses jurídicas do país é fixada em recursos especiais repetitivos, julgados sob rito de afetação que vincula todos os tribunais inferiores."
    ],
    exemplos: [
      "Acórdão que aplica norma federal de forma contrária à interpretação do STJ",
      "Divergência entre TJSP e TJRJ sobre o mesmo tema",
      "Tese repetitiva fixada em REsp afetado como representativo de controvérsia"
    ],
    areas: ["civil", "criminal", "trabalhista", "tributario"],
    ver_tambem: ["recurso-extraordinario", "acordao"],
    atualizado_em: "2026-05-21"
  },
  {
    slug: "recurso-extraordinario",
    termo: "Recurso extraordinário",
    variacoes: ["RE", "recurso ao STF"],
    definicao_curta:
      "Recurso ao STF contra decisões que contrariam a Constituição.",
    explicacao: [
      "Recurso extraordinário é dirigido ao Supremo Tribunal Federal quando uma decisão judicial viola a Constituição, declara inconstitucional lei federal ou contraria entendimento do STF.",
      "Para ser admitido, exige demonstração de repercussão geral — relevância econômica, política, social ou jurídica que ultrapasse os interesses das partes. Sem repercussão geral, o recurso não é conhecido.",
      "Decisões em recurso extraordinário sob repercussão geral vinculam todos os demais tribunais. É um dos principais canais pelos quais o STF uniformiza a interpretação constitucional no Brasil."
    ],
    exemplos: [
      "Discussão constitucional sobre direito fundamental",
      "Inconstitucionalidade de lei estadual reconhecida em segunda instância",
      "Tese de repercussão geral sobre matéria tributária"
    ],
    areas: ["civil", "tributario", "criminal"],
    ver_tambem: ["recurso-especial", "repercussao-geral"],
    atualizado_em: "2026-05-21"
  },
  {
    slug: "acordao",
    termo: "Acórdão",
    variacoes: ["decisão colegiada", "julgamento de turma"],
    definicao_curta:
      "Decisão tomada por um colegiado de juízes em tribunal — câmara, turma ou pleno.",
    explicacao: [
      "Acórdão é a decisão de um tribunal proferida por mais de um julgador em conjunto. Diferente da sentença, que é decisão singular do juiz de primeiro grau, o acórdão emana de turma, câmara, seção ou pleno.",
      "Estrutura típica — relatório, voto do relator, votos divergentes (se houver), e o resultado proclamado. A ementa, no início, sintetiza o que foi decidido e é o que costuma circular como referência jurisprudencial.",
      "Acórdãos do STJ e do STF orientam a interpretação de lei federal e da Constituição. Acórdãos repetitivos e sob repercussão geral vinculam os tribunais inferiores."
    ],
    exemplos: [
      "Acórdão do STJ que fixa tese sobre dano moral",
      "Acórdão de TJ que reforma sentença de primeira instância",
      "Acórdão do STF em ação constitucional"
    ],
    areas: ["civil", "criminal", "trabalhista"],
    ver_tambem: ["recurso-especial", "recurso-extraordinario", "ementa"],
    atualizado_em: "2026-05-21"
  },
  {
    slug: "responsabilidade-civil",
    termo: "Responsabilidade civil",
    variacoes: ["responsabilidade objetiva", "responsabilidade subjetiva"],
    definicao_curta:
      "Obrigação de reparar o dano causado a outrem, conforme regras do Código Civil ou de leis específicas.",
    explicacao: [
      "Responsabilidade civil é a obrigação de reparar o dano causado a outra pessoa. Em regra é subjetiva — depende de comprovar culpa do agente (negligência, imprudência ou imperícia). Em situações específicas, é objetiva — basta o dano e o nexo de causalidade, sem precisar provar culpa.",
      "A responsabilidade objetiva alcança casos previstos em lei, como atividades de risco, relação de consumo (CDC) e algumas modalidades contratuais. Exemplo clássico é a responsabilidade do fornecedor por produto defeituoso.",
      "A reparação visa restabelecer a vítima ao estado anterior ao dano, na medida do possível. Quando isso não é viável, opta-se por compensação financeira proporcional ao prejuízo."
    ],
    exemplos: [
      "Motorista que causa acidente por descuido e responde por danos materiais e morais",
      "Empresa que vende produto defeituoso e responde objetivamente perante o consumidor",
      "Médico que comete erro grosseiro reconhecido em laudo pericial"
    ],
    areas: ["civil", "consumidor"],
    ver_tambem: ["dano-moral", "dano-material"],
    tema_jurisprudencia: "responsabilidade-civil",
    atualizado_em: "2026-05-21"
  },
  {
    slug: "mandado-de-seguranca",
    termo: "Mandado de segurança",
    variacoes: ["MS", "mandado de segurança individual"],
    definicao_curta:
      "Ação para proteger direito líquido e certo violado por ato ilegal de autoridade pública.",
    explicacao: [
      "O mandado de segurança é uma ação constitucional usada quando uma autoridade pública (ou quem age no exercício de função pública) pratica ato ilegal ou abusivo que fere direito líquido e certo — ou seja, um direito que pode ser comprovado de plano, por documentos, sem necessidade de produção de prova complexa.",
      "Serve, por exemplo, contra negativa indevida de matrícula, recusa de expedição de documento, exigência ilegal em concurso ou cobrança de tributo claramente indevido. Há prazo legal para impetrar contado do ato impugnado, e por isso convém procurar orientação rapidamente.",
      "Não substitui outras ações quando o direito depende de provas a serem produzidas. Nesses casos, o caminho costuma ser uma ação ordinária."
    ],
    exemplos: [
      "Candidato aprovado em concurso que tem a nomeação negada sem fundamento",
      "Servidor que sofre desconto ilegal e quer suspendê-lo de imediato",
      "Empresa autuada com base em exigência tributária sem amparo em lei"
    ],
    areas: ["administrativo", "tributario", "civil"],
    ver_tambem: ["habeas-corpus", "tutela-de-urgencia"],
    atualizado_em: "2026-05-29"
  },
  {
    slug: "habeas-data",
    termo: "Habeas data",
    definicao_curta:
      "Ação para acessar ou corrigir informações sobre a própria pessoa em bancos de dados públicos.",
    explicacao: [
      "O habeas data garante a qualquer pessoa o direito de conhecer as informações que órgãos públicos ou entidades de caráter público mantêm a seu respeito, e de pedir a correção de dados errados.",
      "É diferente de pedir indenização: o foco é o acesso e a retificação da informação. Normalmente exige tentativa prévia de obter os dados pela via administrativa antes de ir ao Judiciário.",
      "Com a LGPD, muitos pedidos de acesso e correção também podem ser feitos diretamente ao controlador dos dados, mas o habeas data segue válido contra bases de caráter público."
    ],
    exemplos: [
      "Cidadão que quer ver o que consta sobre ele em cadastro de órgão público",
      "Pessoa que descobre dado incorreto em sistema governamental e quer corrigir"
    ],
    areas: ["administrativo", "digital", "civil"],
    ver_tambem: ["mandado-de-seguranca"],
    atualizado_em: "2026-05-29"
  },
  {
    slug: "coisa-julgada",
    termo: "Coisa julgada",
    variacoes: ["res judicata"],
    definicao_curta:
      "Qualidade da decisão judicial contra a qual não cabe mais recurso, tornando-a definitiva.",
    explicacao: [
      "Quando uma decisão não pode mais ser alterada por recurso, diz-se que houve coisa julgada. A partir daí, em regra, a mesma questão não pode ser rediscutida entre as mesmas partes.",
      "Ela traz segurança jurídica: o conflito tem um fim. Existem exceções estreitas, como a ação rescisória, cabível em hipóteses específicas e com prazo próprio.",
      "Coisa julgada material impede nova discussão do mérito; a formal impede recurso apenas naquele processo."
    ],
    exemplos: [
      "Sentença de divórcio que não teve recurso e se torna definitiva",
      "Ação de cobrança julgada e sem recurso, impedindo novo processo idêntico"
    ],
    areas: ["civil", "criminal"],
    ver_tambem: ["transito-em-julgado", "prescricao"],
    atualizado_em: "2026-05-29"
  },
  {
    slug: "transito-em-julgado",
    termo: "Trânsito em julgado",
    definicao_curta:
      "Momento em que a decisão judicial não admite mais recurso e passa a produzir efeitos definitivos.",
    explicacao: [
      "Uma decisão transita em julgado quando se esgotam os prazos de recurso sem que nenhum seja interposto, ou quando todos os recursos cabíveis já foram julgados.",
      "É a partir do trânsito em julgado que se inicia, por exemplo, a fase de cumprimento de sentença, e que se conta o prazo para eventual ação rescisória.",
      "Saber a data exata do trânsito em julgado é importante porque vários prazos dependem dela."
    ],
    exemplos: [
      "Fim do prazo de apelação sem recurso, tornando a sentença definitiva",
      "Última decisão de recurso no tribunal superior encerrando o processo"
    ],
    areas: ["civil", "criminal"],
    ver_tambem: ["coisa-julgada", "apelacao"],
    atualizado_em: "2026-05-29"
  },
  {
    slug: "usufruto",
    termo: "Usufruto",
    definicao_curta:
      "Direito de usar e usufruir de um bem de outra pessoa, sem ser dono dele.",
    explicacao: [
      "No usufruto, uma pessoa (usufrutuário) pode usar o bem e receber seus frutos — como morar no imóvel ou receber aluguéis — enquanto a propriedade continua com o dono (nu-proprietário).",
      "É comum em planejamento familiar: pais doam um imóvel aos filhos, mas reservam o usufruto para si, garantindo moradia ou renda enquanto viverem.",
      "O usufruto pode ser vitalício ou por prazo determinado, e em regra se extingue com a morte do usufrutuário."
    ],
    exemplos: [
      "Mãe que doa a casa ao filho, mas mantém o direito de morar nela até falecer",
      "Usufruto de um imóvel alugado, em que o usufrutuário recebe os aluguéis"
    ],
    areas: ["civil", "imobiliario", "familia"],
    ver_tambem: ["testamento", "bem-de-familia"],
    atualizado_em: "2026-05-29"
  },
  {
    slug: "testamento",
    termo: "Testamento",
    definicao_curta:
      "Documento em que a pessoa define como seus bens serão divididos após a morte, dentro dos limites legais.",
    explicacao: [
      "O testamento permite organizar a sucessão e destinar a parte disponível do patrimônio. No Brasil, havendo herdeiros necessários (descendentes, ascendentes e cônjuge), metade da herança — a legítima — é reservada a eles e não pode ser afastada por testamento.",
      "Há formas previstas em lei, como o testamento público (feito em cartório) e o particular. Cada forma tem requisitos próprios de validade.",
      "Vale revisar o testamento ao longo da vida, pois mudanças familiares e patrimoniais podem torná-lo desatualizado."
    ],
    exemplos: [
      "Pessoa sem filhos que destina seus bens a um sobrinho por testamento",
      "Avô que deixa a parte disponível da herança para um neto específico"
    ],
    areas: ["civil", "familia"],
    ver_tambem: ["inventario", "espolio", "partilha-de-bens"],
    atualizado_em: "2026-05-29"
  },
  {
    slug: "espolio",
    termo: "Espólio",
    definicao_curta:
      "Conjunto de bens, direitos e dívidas deixados por uma pessoa falecida, até a partilha.",
    explicacao: [
      "Espólio é o patrimônio do falecido considerado como um todo, antes de ser dividido entre os herdeiros. Durante o inventário, o espólio é representado pelo inventariante.",
      "As dívidas do falecido são pagas pelo espólio, no limite das forças da herança — ou seja, os herdeiros não respondem com seu próprio patrimônio além do que receberam.",
      "Enquanto não há partilha, atos como vender um imóvel do falecido dependem de autorização no inventário."
    ],
    exemplos: [
      "Conta bancária do falecido que fica em nome do espólio até o inventário",
      "Dívida do falecido quitada com os próprios bens deixados"
    ],
    areas: ["civil", "familia"],
    ver_tambem: ["inventario", "partilha-de-bens", "testamento"],
    atualizado_em: "2026-05-29"
  },
  {
    slug: "partilha-de-bens",
    termo: "Partilha de bens",
    variacoes: ["partilha", "divisão de bens"],
    definicao_curta:
      "Divisão do patrimônio entre herdeiros (na herança) ou entre o casal (no divórcio).",
    explicacao: [
      "A partilha define quem fica com o quê. Na sucessão, divide a herança entre os herdeiros; no divórcio, separa os bens conforme o regime de casamento.",
      "Pode ser consensual, quando todos concordam, o que agiliza o processo e reduz custos, ou litigiosa, quando há disputa e o juiz decide.",
      "Bens, dívidas e até participações em empresas entram na conta. Avaliação correta evita injustiças e conflitos futuros."
    ],
    exemplos: [
      "Divórcio em que o casal divide o imóvel comprado na constância do casamento",
      "Herdeiros que dividem entre si os imóveis e o saldo bancário do falecido"
    ],
    areas: ["familia", "civil"],
    ver_tambem: ["inventario", "divorcio", "espolio"],
    atualizado_em: "2026-05-29"
  },
  {
    slug: "uniao-estavel",
    termo: "União estável",
    definicao_curta:
      "Convivência pública, contínua e duradoura entre duas pessoas com intenção de formar família.",
    explicacao: [
      "A união estável é reconhecida como entidade familiar e gera direitos e deveres semelhantes aos do casamento, como pensão e partilha de bens, conforme o regime aplicável.",
      "Não exige tempo mínimo fixo nem documento formal, mas pode ser formalizada por escritura pública, o que facilita a prova e o planejamento patrimonial.",
      "Em regra, aplica-se o regime de comunhão parcial de bens, salvo contrato escrito em sentido diverso."
    ],
    exemplos: [
      "Casal que mora junto há anos e quer formalizar a relação em cartório",
      "Companheiro que busca pensão por morte do parceiro junto ao INSS"
    ],
    areas: ["familia"],
    ver_tambem: ["divorcio", "partilha-de-bens", "pensao-alimenticia"],
    atualizado_em: "2026-05-29"
  },
  {
    slug: "guarda-compartilhada",
    termo: "Guarda compartilhada",
    definicao_curta:
      "Modelo em que ambos os pais dividem decisões e responsabilidades sobre os filhos.",
    explicacao: [
      "Na guarda compartilhada, pai e mãe participam das decisões importantes da vida dos filhos — escola, saúde, viagens — mesmo morando em casas diferentes. É a regra preferencial na lei brasileira quando ambos têm condições.",
      "Compartilhar a guarda não significa dividir o tempo pela metade: define-se uma residência de referência e um regime de convivência que atenda ao melhor interesse da criança.",
      "A guarda compartilhada não afasta, por si só, o pagamento de pensão alimentícia."
    ],
    exemplos: [
      "Pais separados que decidem juntos a escola e o plano de saúde do filho",
      "Definição de finais de semana alternados com residência principal na mãe"
    ],
    areas: ["familia"],
    ver_tambem: ["guarda", "pensao-alimenticia", "alienacao-parental"],
    atualizado_em: "2026-05-29"
  },
  {
    slug: "alienacao-parental",
    termo: "Alienação parental",
    definicao_curta:
      "Conduta de um responsável para afastar ou prejudicar o vínculo da criança com o outro genitor.",
    explicacao: [
      "Ocorre quando um dos pais (ou outro responsável) manipula a criança para rejeitar o outro genitor — desqualificando-o, criando obstáculos à convivência ou fazendo falsas acusações.",
      "A lei prevê medidas que vão de advertência a alteração da guarda, conforme a gravidade, sempre com foco na proteção da criança.",
      "Identificar e tratar cedo é importante: o vínculo afetivo prejudicado pode ter efeitos duradouros."
    ],
    exemplos: [
      "Genitor que impede sistematicamente as visitas combinadas",
      "Responsável que denigre o outro pai na frente da criança"
    ],
    areas: ["familia"],
    ver_tambem: ["guarda-compartilhada", "guarda"],
    atualizado_em: "2026-05-29"
  },
  {
    slug: "justa-causa",
    termo: "Justa causa",
    definicao_curta:
      "Demissão por falta grave do empregado, sem direito a parte das verbas rescisórias.",
    explicacao: [
      "A justa causa é a punição máxima na relação de trabalho. A lei lista hipóteses como ato de improbidade, indisciplina, abandono de emprego e agressão. A empresa precisa provar a falta.",
      "Na justa causa, o trabalhador perde aviso prévio, multa de 40% do FGTS e o saque do FGTS, mas mantém saldo de salário e férias vencidas.",
      "Aplicação exige proporcionalidade e imediatidade — punir logo após o fato. Justa causa duvidosa pode ser revertida na Justiça do Trabalho."
    ],
    exemplos: [
      "Empregado flagrado desviando mercadoria da empresa",
      "Faltas reiteradas e sem justificativa caracterizando abandono"
    ],
    areas: ["trabalhista"],
    ver_tambem: ["rescisao", "aviso-previo", "fgts"],
    atualizado_em: "2026-05-29"
  },
  {
    slug: "aviso-previo",
    termo: "Aviso prévio",
    definicao_curta:
      "Comunicação antecipada do fim do contrato de trabalho, com prazo e efeitos definidos em lei.",
    explicacao: [
      "Quando a empresa dispensa sem justa causa, ou o empregado pede demissão, a parte que encerra deve avisar com antecedência. O aviso pode ser trabalhado ou indenizado.",
      "O prazo é de 30 dias, acrescido de 3 dias por ano trabalhado na mesma empresa, até o limite previsto em lei. No aviso trabalhado, há redução de jornada ou faltas para procurar emprego.",
      "No pedido de demissão, se o empregado não cumpre o aviso, a empresa pode descontar o valor correspondente."
    ],
    exemplos: [
      "Empregado dispensado que recebe o aviso prévio indenizado na rescisão",
      "Trabalhador com 5 anos de casa que tem direito a aviso prévio maior que 30 dias"
    ],
    areas: ["trabalhista"],
    ver_tambem: ["rescisao", "justa-causa"],
    atualizado_em: "2026-05-29"
  },
  {
    slug: "estabilidade-gestante",
    termo: "Estabilidade da gestante",
    variacoes: ["estabilidade provisória", "garantia de emprego da gestante"],
    definicao_curta:
      "Garantia de emprego à gestante desde a confirmação da gravidez até meses após o parto.",
    explicacao: [
      "A empregada gestante não pode ser dispensada sem justa causa desde a confirmação da gravidez até cinco meses após o parto, conforme a Constituição.",
      "A estabilidade vale mesmo que a empresa não soubesse da gravidez no momento da dispensa. Reconhecida a violação, a trabalhadora pode pedir reintegração ou indenização do período.",
      "Existem outras estabilidades, como a do cipeiro e a do acidentado, cada uma com regras próprias."
    ],
    exemplos: [
      "Gestante dispensada sem justa causa que pede reintegração",
      "Trabalhadora que descobre a gravidez após a demissão e busca seus direitos"
    ],
    areas: ["trabalhista"],
    ver_tambem: ["rescisao", "justa-causa"],
    atualizado_em: "2026-05-29"
  },
  {
    slug: "assedio-moral",
    termo: "Assédio moral no trabalho",
    definicao_curta:
      "Conduta abusiva e repetitiva que humilha ou constrange o trabalhador no ambiente de trabalho.",
    explicacao: [
      "O assédio moral se caracteriza pela repetição de atitudes que expõem o trabalhador a situações humilhantes — perseguição, isolamento, metas impossíveis usadas como punição, ofensas.",
      "Pode gerar direito a indenização por dano moral e, em casos graves, embasar a rescisão indireta (quando o empregado encerra o contrato por falta grave do empregador).",
      "Reunir provas — mensagens, testemunhas, registros médicos — é decisivo para demonstrar o assédio."
    ],
    exemplos: [
      "Chefe que expõe o funcionário a humilhações diárias na frente da equipe",
      "Trabalhador isolado e sobrecarregado de propósito para forçar o pedido de demissão"
    ],
    areas: ["trabalhista", "civil"],
    ver_tambem: ["dano-moral", "rescisao"],
    atualizado_em: "2026-05-29"
  },
  {
    slug: "acidente-de-trabalho",
    termo: "Acidente de trabalho",
    definicao_curta:
      "Lesão ou doença decorrente do trabalho que pode gerar direitos previdenciários e trabalhistas.",
    explicacao: [
      "Acidente de trabalho é o que ocorre no exercício da atividade e causa lesão ou perda da capacidade. Inclui doenças ocupacionais e, em certas situações, o acidente de trajeto.",
      "A empresa deve emitir a CAT (Comunicação de Acidente de Trabalho). O trabalhador pode ter direito a benefício do INSS e, conforme o caso, a estabilidade e indenização.",
      "O nexo entre a lesão e o trabalho costuma ser avaliado por perícia médica."
    ],
    exemplos: [
      "Operador que sofre lesão por esforço repetitivo reconhecida como ocupacional",
      "Funcionário acidentado com máquina sem proteção adequada"
    ],
    areas: ["trabalhista", "previdenciario"],
    ver_tambem: ["auxilio-doenca", "auxilio-acidente", "estabilidade-gestante"],
    atualizado_em: "2026-05-29"
  },
  {
    slug: "auxilio-acidente",
    termo: "Auxílio-acidente",
    definicao_curta:
      "Indenização mensal do INSS a quem fica com sequela que reduz a capacidade de trabalho.",
    explicacao: [
      "O auxílio-acidente é um benefício indenizatório pago quando, após consolidação das lesões, restam sequelas que reduzem a capacidade para a atividade habitual.",
      "Ele não impede o trabalhador de continuar trabalhando — diferentemente do auxílio por incapacidade temporária — e é pago como complemento.",
      "Depende de avaliação pericial que reconheça a redução da capacidade e o nexo com o acidente ou doença."
    ],
    exemplos: [
      "Trabalhador que perde parte dos movimentos da mão após acidente",
      "Segurado com sequela auditiva que reduz a capacidade laboral"
    ],
    areas: ["previdenciario", "trabalhista"],
    ver_tambem: ["auxilio-doenca", "acidente-de-trabalho", "aposentadoria"],
    atualizado_em: "2026-05-29"
  },
  {
    slug: "seguro-desemprego",
    termo: "Seguro-desemprego",
    definicao_curta:
      "Benefício temporário pago ao trabalhador dispensado sem justa causa que cumpre os requisitos.",
    explicacao: [
      "O seguro-desemprego é pago em parcelas a quem foi dispensado sem justa causa, conforme tempo de trabalho e número de solicitações anteriores.",
      "Há requisitos de carência (tempo mínimo de vínculo) e prazos para requerer após a dispensa. O número de parcelas varia conforme as regras vigentes.",
      "Existem modalidades específicas, como a do empregado doméstico e a do trabalhador resgatado de condição análoga à escravidão."
    ],
    exemplos: [
      "Trabalhador demitido sem justa causa que solicita o benefício no prazo",
      "Empregado doméstico com FGTS que requer a modalidade própria"
    ],
    areas: ["trabalhista"],
    ver_tambem: ["rescisao", "fgts", "aviso-previo"],
    atualizado_em: "2026-05-29"
  },
  {
    slug: "bpc-loas",
    termo: "BPC (LOAS)",
    variacoes: ["benefício de prestação continuada", "amparo assistencial"],
    definicao_curta:
      "Benefício assistencial de um salário mínimo ao idoso ou à pessoa com deficiência em situação de baixa renda.",
    explicacao: [
      "O BPC, previsto na LOAS, garante um salário mínimo mensal ao idoso (a partir da idade prevista em lei) ou à pessoa com deficiência que comprove baixa renda familiar.",
      "Não é aposentadoria: não exige contribuição ao INSS e não gera 13º nem pensão por morte. O foco é assistencial.",
      "A análise considera a renda por pessoa da família e, no caso da deficiência, avaliação médica e social."
    ],
    exemplos: [
      "Idoso sem aposentadoria e de baixa renda que requer o benefício",
      "Pessoa com deficiência incapacitante em família de baixa renda"
    ],
    areas: ["previdenciario"],
    ver_tambem: ["aposentadoria", "auxilio-doenca"],
    atualizado_em: "2026-05-29"
  },
  {
    slug: "direito-de-arrependimento",
    termo: "Direito de arrependimento",
    variacoes: ["arrependimento de compra", "prazo de 7 dias"],
    definicao_curta:
      "Direito de desistir de compra feita fora da loja física, como pela internet, em até 7 dias.",
    explicacao: [
      "Em compras feitas fora do estabelecimento — internet, telefone, catálogo — o consumidor pode se arrepender em até 7 dias corridos a contar do recebimento ou da assinatura do contrato.",
      "Ao exercer o direito, o consumidor deve receber de volta os valores pagos, atualizados, sem custo pela devolução.",
      "Esse direito é diferente da troca por defeito: aqui não é preciso justificar o motivo da desistência."
    ],
    exemplos: [
      "Cliente que recebe um produto comprado online e desiste em 3 dias",
      "Assinatura contratada por telefone cancelada dentro do prazo legal"
    ],
    areas: ["consumidor"],
    ver_tambem: ["vicio-do-produto", "garantia-legal"],
    atualizado_em: "2026-05-29"
  },
  {
    slug: "vicio-do-produto",
    termo: "Vício do produto",
    variacoes: ["produto com defeito", "vício de qualidade"],
    definicao_curta:
      "Defeito que torna o produto impróprio ou diminui seu valor, gerando direito a conserto, troca ou devolução.",
    explicacao: [
      "Vício é o problema de qualidade ou quantidade do produto. Constatado o vício, o fornecedor tem prazo legal para sanar; não resolvido, o consumidor pode escolher troca, devolução do valor ou abatimento do preço.",
      "Os prazos para reclamar variam entre produtos não duráveis e duráveis, contados da entrega ou do surgimento do defeito oculto.",
      "Difere do fato do produto, que é quando o defeito causa dano à saúde ou segurança."
    ],
    exemplos: [
      "Celular novo que não liga e a loja não troca no prazo",
      "Eletrodoméstico que apresenta defeito recorrente dentro da garantia"
    ],
    areas: ["consumidor"],
    ver_tambem: ["garantia-legal", "fato-do-produto", "direito-de-arrependimento"],
    atualizado_em: "2026-05-29"
  },
  {
    slug: "fato-do-produto",
    termo: "Fato do produto",
    variacoes: ["acidente de consumo", "defeito que causa dano"],
    definicao_curta:
      "Defeito que vai além do produto e causa dano à saúde, segurança ou patrimônio do consumidor.",
    explicacao: [
      "Enquanto o vício afeta o próprio produto, o fato do produto é o defeito que provoca um dano maior — uma lesão, um incêndio, um acidente. A responsabilidade do fornecedor é objetiva.",
      "O consumidor pode pedir reparação pelos danos materiais e morais sofridos, comprovando o defeito e o prejuízo.",
      "Há prazo próprio para essa pretensão, contado a partir do conhecimento do dano e de sua autoria."
    ],
    exemplos: [
      "Alimento estragado que causa intoxicação ao consumidor",
      "Aparelho que explode e provoca queimaduras"
    ],
    areas: ["consumidor", "civil"],
    ver_tambem: ["vicio-do-produto", "responsabilidade-civil", "dano-moral"],
    atualizado_em: "2026-05-29"
  },
  {
    slug: "garantia-legal",
    termo: "Garantia legal",
    definicao_curta:
      "Proteção mínima garantida por lei a todo consumidor, independentemente de garantia contratual.",
    explicacao: [
      "A garantia legal é assegurada pelo Código de Defesa do Consumidor e existe mesmo que o produto não tenha garantia de fábrica ou da loja. Cobre vícios constatados dentro dos prazos previstos.",
      "A garantia contratual, oferecida pelo fornecedor, soma-se à legal — não a substitui. Por isso o consumidor não fica desprotegido quando a garantia da loja acaba.",
      "Em vício oculto, o prazo começa a contar do momento em que o defeito aparece."
    ],
    exemplos: [
      "Defeito que surge logo após o fim da garantia de fábrica, ainda coberto pela lei",
      "Vício oculto descoberto meses depois, dentro do prazo legal"
    ],
    areas: ["consumidor"],
    ver_tambem: ["vicio-do-produto", "direito-de-arrependimento"],
    atualizado_em: "2026-05-29"
  },
  {
    slug: "protesto-de-titulo",
    termo: "Protesto de título",
    definicao_curta:
      "Registro em cartório de que uma dívida representada por documento não foi paga.",
    explicacao: [
      "O protesto é feito em cartório para comprovar publicamente o não pagamento de um título — duplicata, cheque, nota promissória. Ele pressiona o devedor e pode afetar o crédito.",
      "O devedor pode pagar e pedir a baixa, ou questionar protesto indevido — quando a dívida não existe, já foi paga ou o título é irregular —, situação que pode gerar indenização.",
      "Cancelar o protesto após o pagamento costuma exigir a apresentação da quitação no cartório."
    ],
    exemplos: [
      "Fornecedor que protesta duplicata não paga pelo cliente",
      "Consumidor protestado por dívida já quitada, com direito a baixa e reparação"
    ],
    areas: ["civil", "empresarial", "consumidor"],
    ver_tambem: ["negativacao-indevida", "juros-de-mora"],
    atualizado_em: "2026-05-29"
  },
  {
    slug: "busca-e-apreensao",
    termo: "Busca e apreensão",
    definicao_curta:
      "Medida para retomar bem dado em garantia (como carro financiado) quando o devedor deixa de pagar.",
    explicacao: [
      "Na alienação fiduciária — comum em financiamento de veículos —, o bem fica em garantia até a quitação. Em caso de inadimplência, o credor pode pedir a busca e apreensão do bem.",
      "Em regra, o devedor é notificado e tem oportunidade de pagar o que está em atraso para manter o bem. Discutir abusos no contrato pode ser cabível em paralelo.",
      "Procurar orientação cedo, ao primeiro atraso, costuma ampliar as opções de acordo."
    ],
    exemplos: [
      "Banco que pede a apreensão de carro financiado com parcelas atrasadas",
      "Devedor que regulariza o atraso e evita perder o veículo"
    ],
    areas: ["civil", "consumidor"],
    ver_tambem: ["juros-de-mora", "clausula-penal"],
    atualizado_em: "2026-05-29"
  },
  {
    slug: "despejo",
    termo: "Despejo",
    definicao_curta:
      "Ação para retomar imóvel alugado, principalmente por falta de pagamento ou fim do contrato.",
    explicacao: [
      "O despejo é o meio pelo qual o locador busca a desocupação do imóvel. A causa mais comum é a falta de pagamento, mas há outras, como o término do prazo e o descumprimento do contrato.",
      "Na falta de pagamento, o inquilino normalmente pode purgar a mora — pagar o que deve, com encargos, dentro do prazo — e evitar a saída, observados os limites legais.",
      "O rito e os prazos variam conforme o motivo e a existência de garantia locatícia."
    ],
    exemplos: [
      "Locador que ajuíza despejo por três meses de aluguel atrasado",
      "Fim do contrato sem renovação, com pedido de retomada do imóvel"
    ],
    areas: ["imobiliario", "civil"],
    ver_tambem: ["distrato", "arras", "clausula-penal"],
    atualizado_em: "2026-05-29"
  },
  {
    slug: "arras",
    termo: "Arras (sinal)",
    variacoes: ["sinal", "arras confirmatórias", "arras penitenciais"],
    definicao_curta:
      "Valor pago como sinal em um contrato, normalmente de compra e venda de imóvel.",
    explicacao: [
      "Arras é o valor entregue por uma parte à outra para confirmar o negócio. Se quem pagou desistir, em regra perde o sinal; se quem recebeu desistir, costuma devolver em dobro.",
      "Existem arras confirmatórias (reforçam o compromisso) e penitenciais (preveem expressamente o direito de arrependimento). A diferença muda os efeitos da desistência.",
      "Ler com atenção a cláusula de arras antes de assinar evita perdas inesperadas."
    ],
    exemplos: [
      "Comprador que dá sinal na reserva de um apartamento e depois desiste",
      "Vendedor que recebe sinal, desiste e precisa devolver em dobro"
    ],
    areas: ["civil", "imobiliario"],
    ver_tambem: ["clausula-penal", "distrato", "despejo"],
    atualizado_em: "2026-05-29"
  },
  {
    slug: "clausula-penal",
    termo: "Cláusula penal",
    variacoes: ["multa contratual"],
    definicao_curta:
      "Multa prevista no contrato para o caso de descumprimento por uma das partes.",
    explicacao: [
      "A cláusula penal fixa de antemão a consequência do descumprimento — total ou de uma obrigação específica. Serve para reforçar o cumprimento e prefixar perdas e danos.",
      "O valor não pode ultrapassar o da obrigação principal, e o juiz pode reduzir multa manifestamente excessiva ou quando a obrigação foi cumprida em parte.",
      "Distingue-se das arras, embora ambas tratem de consequências de descumprimento."
    ],
    exemplos: [
      "Multa por rescisão antecipada em contrato de prestação de serviços",
      "Penalidade por atraso na entrega de uma obra"
    ],
    areas: ["civil", "empresarial"],
    ver_tambem: ["arras", "distrato", "juros-de-mora"],
    atualizado_em: "2026-05-29"
  },
  {
    slug: "distrato",
    termo: "Distrato",
    variacoes: ["rescisão contratual amigável"],
    definicao_curta:
      "Acordo entre as partes para encerrar um contrato antes do previsto, definindo as condições da saída.",
    explicacao: [
      "Distrato é o desfazimento do contrato por consenso. As partes ajustam como ficam valores já pagos, eventuais multas e a devolução de bens.",
      "Formalizar por escrito, com quitação clara, evita cobranças futuras e discussões sobre o que foi combinado.",
      "Em contratos de consumo, cláusulas de devolução abusivas podem ser questionadas."
    ],
    exemplos: [
      "Casal que faz distrato de contrato de prestação de serviços de festa",
      "Comprador e construtora que encerram a compra e ajustam a devolução"
    ],
    areas: ["civil", "consumidor", "imobiliario"],
    ver_tambem: ["clausula-penal", "arras", "despejo"],
    atualizado_em: "2026-05-29"
  },
  {
    slug: "juros-de-mora",
    termo: "Juros de mora",
    definicao_curta:
      "Acréscimo cobrado pelo atraso no pagamento de uma dívida, como compensação pela demora.",
    explicacao: [
      "Os juros de mora incidem a partir do atraso e remuneram o credor pelo tempo que ficou sem receber. Podem decorrer do contrato ou da lei.",
      "São diferentes da correção monetária, que apenas recompõe o valor frente à inflação, sem ser um ganho. Em cobranças, os dois costumam aparecer juntos.",
      "Taxas e formas de cálculo dependem do tipo de dívida e do que prevê o contrato e a lei aplicável."
    ],
    exemplos: [
      "Aluguel pago com atraso, somando multa e juros de mora",
      "Dívida judicial atualizada com juros de mora a partir da citação"
    ],
    areas: ["civil", "consumidor"],
    ver_tambem: ["correcao-monetaria", "clausula-penal", "protesto-de-titulo"],
    atualizado_em: "2026-05-29"
  },
  {
    slug: "correcao-monetaria",
    termo: "Correção monetária",
    definicao_curta:
      "Atualização de um valor pela inflação, para que não perca poder de compra com o tempo.",
    explicacao: [
      "A correção monetária recompõe o valor de uma quantia ao longo do tempo, usando índices oficiais. Não é ganho: apenas mantém o valor real.",
      "Aparece em dívidas, condenações judiciais, aluguéis e no próprio FGTS. O índice aplicável depende do contrato, da lei e da decisão judicial.",
      "Soma-se aos juros, que sim representam remuneração pelo atraso ou pelo capital."
    ],
    exemplos: [
      "Condenação judicial corrigida da data do dano até o pagamento",
      "Saldo de FGTS atualizado por índice de correção"
    ],
    areas: ["civil", "trabalhista"],
    ver_tambem: ["juros-de-mora", "fgts"],
    atualizado_em: "2026-05-29"
  },
  {
    slug: "penhora",
    termo: "Penhora",
    definicao_curta:
      "Ato judicial que separa bens do devedor para garantir o pagamento de uma dívida cobrada na Justiça.",
    explicacao: [
      "Na execução, o juiz pode determinar a penhora de bens ou valores do devedor — conta bancária, veículo, imóvel — para satisfazer o credor.",
      "A lei protege certos bens da penhora, como o bem de família e, em regra, salários, salvo exceções previstas. Penhora indevida pode ser questionada.",
      "Acordos de parcelamento, mesmo após iniciada a execução, costumam ser possíveis."
    ],
    exemplos: [
      "Bloqueio de valores em conta para pagar dívida executada",
      "Penhora de veículo para garantir o cumprimento da sentença"
    ],
    areas: ["civil"],
    ver_tambem: ["bem-de-familia", "execucao-fiscal"],
    atualizado_em: "2026-05-29"
  },
  {
    slug: "bem-de-familia",
    termo: "Bem de família",
    definicao_curta:
      "Imóvel residencial protegido contra penhora na maioria das dívidas.",
    explicacao: [
      "O imóvel usado como residência da família é, em regra, impenhorável — não pode ser tomado para pagar a maioria das dívidas. A proteção é automática para o único imóvel residencial.",
      "Há exceções previstas em lei, como dívidas do próprio imóvel (financiamento, condomínio, IPTU) e certas obrigações específicas.",
      "Também existe o bem de família voluntário, instituído por escritura, com regras próprias."
    ],
    exemplos: [
      "Casa única da família preservada da penhora por dívida comum",
      "Exceção: penhora do imóvel por falta de pagamento do próprio financiamento"
    ],
    areas: ["civil", "familia", "imobiliario"],
    ver_tambem: ["penhora", "usufruto"],
    atualizado_em: "2026-05-29"
  },
  {
    slug: "execucao-fiscal",
    termo: "Execução fiscal",
    definicao_curta:
      "Cobrança judicial de dívidas tributárias e outras devidas ao poder público.",
    explicacao: [
      "É o processo pelo qual União, estados e municípios cobram judicialmente dívidas inscritas em dívida ativa — impostos, taxas, multas.",
      "O devedor pode discutir a cobrança por meio de defesa própria, apontando pagamento, prescrição ou erro. Parcelamentos administrativos podem suspender a cobrança.",
      "Bens podem ser penhorados para garantir o débito, observadas as proteções legais."
    ],
    exemplos: [
      "Município que executa IPTU atrasado de anos anteriores",
      "Contribuinte que alega prescrição de parte da dívida cobrada"
    ],
    areas: ["tributario", "administrativo"],
    ver_tambem: ["penhora", "prescricao"],
    atualizado_em: "2026-05-29"
  },
  {
    slug: "tutela-de-urgencia",
    termo: "Tutela de urgência (liminar)",
    variacoes: ["liminar", "tutela provisória"],
    definicao_curta:
      "Decisão rápida do juiz, antes do fim do processo, para evitar dano grave e urgente.",
    explicacao: [
      "Quando há urgência e probabilidade do direito, o juiz pode conceder uma medida imediata — como suspender uma cobrança ou determinar um tratamento — antes de julgar o mérito.",
      "É provisória: pode ser confirmada ou revista na sentença. Por isso costuma exigir demonstração clara do risco e do direito.",
      "É instrumento comum em saúde, contratos e questões de família que não podem esperar."
    ],
    exemplos: [
      "Liminar que obriga o plano de saúde a autorizar cirurgia urgente",
      "Decisão que suspende protesto enquanto a dívida é discutida"
    ],
    areas: ["civil", "consumidor"],
    ver_tambem: ["mandado-de-seguranca", "plano-de-saude"],
    atualizado_em: "2026-05-29"
  },
  {
    slug: "revelia",
    termo: "Revelia",
    definicao_curta:
      "Situação do réu que, citado, não apresenta defesa no prazo, com possíveis efeitos contra ele.",
    explicacao: [
      "Se o réu é regularmente citado e não contesta no prazo, ocorre a revelia. Um de seus efeitos é a presunção de veracidade dos fatos alegados pelo autor, com exceções previstas em lei.",
      "A revelia não garante automaticamente a vitória do autor: o juiz ainda analisa o direito. E o réu pode ingressar no processo depois, recebendo-o no estado em que estiver.",
      "Por isso, ignorar uma citação é arriscado — responder no prazo preserva direitos."
    ],
    exemplos: [
      "Réu que não contesta ação de cobrança e sofre os efeitos da revelia",
      "Citado que comparece tardiamente e assume o processo como está"
    ],
    areas: ["civil"],
    ver_tambem: ["citacao", "apelacao"],
    atualizado_em: "2026-05-29"
  },
  {
    slug: "citacao",
    termo: "Citação",
    definicao_curta:
      "Ato que comunica oficialmente a pessoa de que há um processo contra ela, abrindo prazo para defesa.",
    explicacao: [
      "A citação é o chamamento formal do réu para integrar o processo e se defender. Pode ocorrer pelos correios, por oficial de justiça, por edital ou por meio eletrônico, conforme o caso.",
      "É a partir da citação válida que começam prazos importantes, como o de contestação. Citação irregular pode anular atos do processo.",
      "Não comparecer ou ignorar a citação pode levar à revelia."
    ],
    exemplos: [
      "Réu citado por carta para responder a uma ação de cobrança",
      "Citação por oficial de justiça quando o réu não é localizado pelos correios"
    ],
    areas: ["civil"],
    ver_tambem: ["revelia", "transito-em-julgado"],
    atualizado_em: "2026-05-29"
  },
  {
    slug: "apelacao",
    termo: "Apelação",
    definicao_curta:
      "Recurso contra a sentença, levando a causa para reanálise pelo tribunal.",
    explicacao: [
      "A apelação é o recurso típico contra a sentença que encerra o processo na primeira instância. O tribunal reexamina os pontos questionados e pode manter, reformar ou anular a decisão.",
      "Há prazo para apelar e, em regra, exige-se o preparo (custas), salvo isenções como a justiça gratuita.",
      "Diferencia-se de recursos dirigidos aos tribunais superiores, como o recurso especial (STJ) e o extraordinário (STF)."
    ],
    exemplos: [
      "Parte que perde a ação e apela para tentar reverter no tribunal",
      "Recurso que pede a redução do valor fixado na sentença"
    ],
    areas: ["civil", "criminal"],
    ver_tambem: ["recurso-especial", "recurso-extraordinario", "transito-em-julgado"],
    atualizado_em: "2026-05-29"
  },
  {
    slug: "herdeiro-necessario",
    termo: "Herdeiro necessário",
    variacoes: ["herdeiro forçado", "legítimário"],
    definicao_curta:
      "Sucessor que a lei protege com direito à metade da herança, não podendo ser totalmente excluído por testamento.",
    explicacao: [
      "Os herdeiros necessários são os descendentes (filhos e seus descendentes), os ascendentes (pais, avós) e o cônjuge. A lei reserva a eles uma fração mínima da herança — a legítima — que não pode ser suprimida nem diminuída por testamento.",
      "A legítima é, em regra, metade do patrimônio deixado. A outra metade — a parte disponível — pode ser deixada livremente para qualquer pessoa, incluindo instituições, amigos ou caridades.",
      "Quando há apenas herdeiros necessários e nenhum testamento, a herança se divide igualmente entre eles. Brigas sobre testamentos que visam afetar a legítima costumam resultar em ações na Justiça.",
      "Determinar quem é herdeiro necessário é essencial no planejamento sucessório. Um advogado pode ajudar a estruturar a herança respeitando direitos e minimizando conflitos futuros."
    ],
    exemplos: [
      "Filhos que têm garantido o direito a 50% da herança independentemente do testamento",
      "Pai que não pode usar testamento para deixar tudo a estranhos, excluindo os filhos da legítima",
      "Mãe viúva que é herdeira necessária junto com os filhos na sucessão do marido"
    ],
    areas: ["familia", "civil"],
    ver_tambem: ["testamento", "inventario", "espolio", "partilha-de-bens"],
    atualizado_em: "2026-06-18"
  },
  {
    slug: "litigancia-de-ma-fe",
    termo: "Litigância de má-fé",
    variacoes: ["processo temerário", "abuso do direito de ação"],
    definicao_curta:
      "Atitude desonesta no processo, como mentir, simular fatos ou usar a ação para prejudicar sem direito.",
    explicacao: [
      "Litigância de má-fé ocorre quando a parte age com desonestidade clara no processo — apresenta alegações infundadas sabendo serem falsas, simula documentos, faz afirmações contraditórias propositalmente ou usa o processo como arma de perseguição, não como instrumento legítimo de justiça.",
      "O código de processo civil prevê sanções: multa, indenização ao adversário pelas despesas e até responsabilização do advogado que induz a conduta. O juiz pode reconhecer de ofício ou por pedido da parte.",
      "Nem toda derrota é má-fé; é preciso má-fé comprovada. Um argumento fraco ou uma tese minoritária não gera sanção, apenas perda do caso.",
      "Se você é acusado de litigância de má-fé, defenda-se ativamente, com provas de que agiu de boa-fé. Um advogado experiente em defesa em processos pode ajudar a neutralizar acusações infundadas."
    ],
    exemplos: [
      "Réu que nega receber citação sabendo que foi entregue regularmente",
      "Autor que apresenta documento falso para ganhar a causa",
      "Parte que segue ajuizando ações idênticas já julgadas, abusando do acesso à justiça"
    ],
    areas: ["civil", "criminal"],
    ver_tambem: ["citacao", "transito-em-julgado", "responsabilidade-civil"],
    atualizado_em: "2026-06-18"
  },
  {
    slug: "liminar",
    termo: "Liminar",
    variacoes: ["tutela de urgência", "medida cautelar", "decisão provisória"],
    definicao_curta:
      "Ordem do juiz dada durante o processo, antes da sentença final, para evitar danos urgentes.",
    explicacao: [
      "A liminar é uma decisão rápida do juiz que busca proteger de dano grave e iminente que não pode esperar o final do processo. Exemplos clássicos envolvem saúde (autorizar cirurgia urgente), posse (evitar despejo iminente) ou direitos que se perderiam com atrasos.",
      "Para obter, é comum que se demonstre não só urgência, mas também a probabilidade de ganhar o caso (presença de direito) e o risco do dano. O juiz pesa esses fatores e decide rápido.",
      "A liminar é provisória: pode ser revogada depois se confirmada como injustificada, ou pode ser mantida na sentença final. Por isso, não garante vitória definitiva — é apenas proteção temporária.",
      "Procurar orientação de advogado com urgência é recomendado para estruturar o pedido de liminar de forma convincente. Argumentação clara e prova do risco aumentam as chances de deferimento."
    ],
    exemplos: [
      "Liminar que obriga plano de saúde a autorizar medicamento oncológico enquanto a discussão do direito prossegue",
      "Ordem que suspende protesto de dívida enquanto se discute se a dívida existiu",
      "Decisão que evita despejo iminente até julgamento do caso"
    ],
    areas: ["civil", "consumidor", "familia"],
    ver_tambem: ["tutela-de-urgencia", "mandado-de-seguranca", "plano-de-saude"],
    atualizado_em: "2026-06-18"
  },
  {
    slug: "dolo",
    termo: "Dolo",
    variacoes: ["intenção maliciosa", "fraude", "engano voluntário"],
    definicao_curta:
      "Intenção clara de enganar ou prejudicar alguém, caracterizando ato ilícito ou mácula do consentimento.",
    explicacao: [
      "Dolo é a vontade consciente de causar dano ou de enganar. Difere da culpa, que é negligência, imprudência ou imperícia sem intenção de prejudicar. Para fins de responsabilidade civil, dolo costuma levar a consequências mais graves.",
      "Em contratos, dolo vicia o consentimento. Se uma parte engana propositalmente a outra para levá-la a contratar, o contrato pode ser anulado e o enganador responde por perdas e danos.",
      "Exemplo prático: vender um carro com o hodômetro rodado (quilometragem falsa) sabendo disso é dolo; vender um carro que desenvolveu problema desconhecido é simplesmente vício.",
      "Provar dolo é mais difícil que provar culpa — costuma exigir evidência clara da intenção. Consulte um advogado se se sente enganado em uma transação para avaliar se há dolo configurado e que ações cabem."
    ],
    exemplos: [
      "Vendedor que mente sobre o estado de um bem sabendo estar defeituoso para enganar o comprador",
      "Empresa que simula atributos de um produto para induzir consumidor a comprar",
      "Pessoa que falsifica documento com intenção clara de prejudicar outrem"
    ],
    areas: ["civil", "consumidor", "criminal"],
    ver_tambem: ["dano-moral", "dano-material"],
    atualizado_em: "2026-06-18"
  },
  {
    slug: "forca-maior",
    termo: "Força maior",
    variacoes: ["caso fortuito", "evento irresistível", "fato imprevisível"],
    definicao_curta:
      "Acontecimento extraordinário, irresistível e imprevisível que impede cumprimento de obrigação contratual.",
    explicacao: [
      "Força maior é o evento que escapa ao controle de quem deveria cumprir uma obrigação — desastre natural, catástrofe, guerra, epidemia. Se realmente imprevisível e irresistível, pode liberar a parte do dever de cumprir ou permitir atraso sem responsabilidade.",
      "Nem tudo que é difícil ou caro configura força maior. Crises econômicas, faltas de matéria-prima no mercado, altas de preço não são, em regra, força maior — são riscos do negócio. Força maior é só o excepcional.",
      "Para beneficiar-se, a parte costuma precisar notificar rapidamente a outra sobre a impossibilidade e tomar medidas para mitigar danos. Inércia pode resultar em perda do benefício.",
      "Contratos costumam ter cláusulas de força maior. Se está envolvido em uma obrigação impossível por evento excepcional, consulte seu advogado sobre como invocar essa defesa e seus efeitos no seu contrato específico."
    ],
    exemplos: [
      "Fornecedor que não consegue entregar matéria-prima por catástrofe natural",
      "Empresa impedida de funcionar por determinação de lockdown durante pandemia",
      "Transportadora que não consegue cumprir prazo por fechamento de rodovia por enchente"
    ],
    areas: ["civil", "empresarial", "consumidor"],
    ver_tambem: ["clausula-penal", "distrato", "responsabilidade-civil"],
    atualizado_em: "2026-06-18"
  },
  {
    slug: "nulidade",
    termo: "Nulidade",
    variacoes: ["nulo", "contrato nulo", "ato nulo"],
    definicao_curta:
      "Vício grave que torna um ato ou contrato completamente inválido, sem efeitos, desde a origem.",
    explicacao: [
      "Nulidade é a sanção que elimina totalmente a validade de um ato jurídico. Contratos podem ser nulos por falta de capacidade grave, deficiente consentimento essencial, ilicitude manifesta ou desobediência a requisitos formais exigidos por lei.",
      "Diferencia-se da anulabilidade: nulo é inválido de origem e, em regra, não gera efeitos nem precisa de ação para deixar de valer. Anulável é válido por enquanto, mas pode ser invalidado por ação de quem tem o direito.",
      "Nulidade pode ser pronunciada de ofício pelo juiz e por qualquer interessado. Não caduca por decurso de prazo (com exceções mínimas e bem específicas), preservando a proteção indefinidamente.",
      "Se acredita que um ato é nulo — como um contrato feito por você sem consentimento real ou em violação clara de lei —, procure orientação jurídica para avaliar a nulidade e as ações cabíveis para proteger seus direitos."
    ],
    exemplos: [
      "Contrato celebrado por menor incapaz, sem representação adequada, é nulo",
      "Ato praticado contra norma de ordem pública (venda de pessoa, trabalho escravo) é nulo",
      "Documento falsificado usado para formalizar transação é nulo desde a origem"
    ],
    areas: ["civil", "familia", "criminal"],
    ver_tambem: ["transito-em-julgado", "coisa-julgada"],
    atualizado_em: "2026-06-18"
  },
  {
    slug: "meacao",
    termo: "Meação",
    variacoes: ["meação do cônjuge", "meação do cônjuge supérstite", "participação do cônjuge"],
    definicao_curta:
      "Direito do cônjuge sobrevivente à parte que lhe cabe dos bens do casal, definido pelo regime de casamento — não é herança, mas divisão do que já lhe pertence.",
    explicacao: [
      "A meação é a divisão do patrimônio entre marido e mulher quando um deles falece ou quando o casamento termina. Não é herança do cônjuge supérstite — é a separação da parte que já lhe pertence por direito, antes de se contar o que vai para os herdeiros. O que muda drasticamente é qual é essa parte, conforme o regime de bens que rege o casamento.",
      "Na comunhão parcial, em regra a meação abrange os bens adquiridos onerosamente durante o casamento, deixando de fora bens anteriores e alguns bens específicos (como imóvel recebido por herança). O cônjuge supérstite fica com metade desses bens adquiridos conjuntamente. Na comunhão universal, a meação alcança quase a totalidade do patrimônio, com poucas exceções. Na separação total de bens, em regra não há meação — cada um fica apenas com o que é seu.",
      "A meação não é condicionada a estar vivo no momento da abertura da sucessão em todos os casos — em regra, basta ter estado casado. Mas situações especiais, como viuvez do cônjuge que se casou meses antes do falecimento, podem suscitar discussões sobre o direito, dependendo das circunstâncias e da jurisprudência local.",
      "Depois de feita a meação e o cônjuge receber sua parte, o restante dos bens (a chamada herança líquida) é dividido entre os demais herdeiros, conforme a ordem legal de sucessão ou o que diz o testamento. Por isso é importante distinguir: primeiro separa-se a meação, depois calcula-se a herança com o que sobra."
    ],
    exemplos: [
      "Casal casado em comunhão parcial compra apartamento juntos durante 20 anos de casamento. Quando um falece, o outro recebe metade do imóvel por meação, e a outra metade segue para o inventário como herança a ser dividida entre filhos e o cônjuge na qualidade de herdeiro.",
      "Marido falece deixando imóvel herdado do pai (antes do casamento) e apartamento comprado com a esposa durante o casamento. Na comunhão parcial, a meação atinge só o apartamento. A metade herdada vai para inventário como herança.",
      "Casal em regime de comunhão universal: praticamente todos os bens adquiridos — imóveis, carros, investimentos — entram na meação do cônjuge vivo, que recebe uma metade, e a outra metade segue para inventário."
    ],
    areas: ["familia", "civil"],
    ver_tambem: ["inventario", "testamento", "partilha-de-bens", "divorcio", "uniao-estavel", "prescricao"],
    atualizado_em: "2026-06-18"
  },
  {
    slug: "pensao-por-morte",
    termo: "Pensão por morte",
    variacoes: ["benefício por morte", "pensão do INSS", "pensão para dependentes"],
    definicao_curta:
      "Benefício do INSS pago aos dependentes do segurado falecido, garantindo renda mínima para sua subsistência.",
    explicacao: [
      "A pensão por morte é um benefício previdenciário do INSS concedido aos dependentes de um segurado que faleceu. O objetivo é amparar quem dependia financeiramente do falecido, oferecendo uma renda de reposição. A concessão depende de o falecido ter contribuído ao INSS ou ter algum período de graça em aberto — não é necessário estar aposentado ou ativo no momento da morte.",
      "O benefício é dividido entre os dependentes, e a cota de cada um varia conforme o tipo de dependente e, em alguns casos, a idade ou condição. Cônjuges, companheiros em união estável e filhos menores são os dependentes mais comuns, mas também podem receber pais idosos ou irmãos menores em certas circunstâncias. Os filhos mantêm direito até os 21 anos de idade, salvo se forem inválidos ou portadores de deficiência — neste caso, podem receber mesmo após essa idade, independentemente de estarem estudando.",
      "A duração da cota varia conforme a situação. Para filhos solteiros, a pensão segue até os 21 anos. Para o cônjuge, a duração pode variar — em regra, pode ser vitalícia dependendo da idade e do tempo de união no momento da morte, mas há outras modalidades de pensão com prazo determinado. O pensionista pode casar de novo sem perder o benefício — essa era uma restrição que foi revogada em 1991, e hoje a mudança no estado civil não afeta o direito à pensão. Procure um advogado ou procurador de benefícios para orientação sobre sua situação específica.",
      "Questões comuns incluem como é feita a prova de dependência, quanto tempo o falecido precisava ter contribuído, e como funciona a divisão entre múltiplos beneficiários. Os valores, prazos e condições exatas variam conforme o caso, e é fundamental consultar o INSS ou um especialista antes de tomar qualquer decisão."
    ],
    exemplos: [
      "Viúva que recebe pensão mensal do INSS após a morte do marido que contribuía há anos",
      "Filhos de um trabalhador falecido que recebem cotas de pensão até atingir 21 anos de idade",
      "Companheiro em união estável que requer pensão por morte do parceiro junto ao INSS",
      "Pai idoso sem renda que recebe pensão por morte do filho que era o mantenedor da casa"
    ],
    areas: ["previdenciario"],
    ver_tambem: ["aposentadoria", "auxilio-doenca", "uniao-estavel"],
    atualizado_em: "2026-06-18"
  },
  {
    slug: "hipossuficiencia",
    termo: "Hipossuficiência",
    variacoes: ["hipossuficiente", "insuficiência de meios", "falta de meios de prova"],
    definicao_curta:
      "Falta de condição técnica ou financeira para investigar fatos relevantes ou se defender adequadamente em processo judicial.",
    explicacao: [
      "Hipossuficiência é conceito distinto de vulnerabilidade. Enquanto a lei presume automaticamente a vulnerabilidade de todo consumidor (independentemente de sua renda ou escolaridade), a hipossuficiência é aferida caso a caso pelo juiz. Trata-se da incapacidade prática de uma das partes em levantar provas sobre fatos que apenas a outra conhece — por falta de recursos financeiros, acesso técnico ou conhecimento especializado.",
      "Na prática, aparece muito nas discussões sobre inversão do ônus da prova. A lei permite ao juiz inverter esse ônus quando presentes a verossimilhança da alegação (a alegação é minimamente plausível) e a hipossuficiência. Sem a primeira, a inversão não ocorre mesmo com hipossuficiência. Sem a segunda, exige-se que a parte vulnerável faça prova de fatos muito difíceis de seu lado.",
      "Exemplos comuns: consumidor alegando defeito em produto técnico, sem como comprovar se o erro foi de fábrica ou de uso; paciente argumentando erro médico sem ter acesso fácil a laudo técnico; empregado denunciando práticas irregulares da empresa sem acesso aos registros internos da empregadora. Em todos, a hipossuficiência justifica transferir ao fornecedor, médico ou empregador a responsabilidade de demonstrar o contrário.",
      "A hipossuficiência não é um 'joker' para ganhar qualquer ação. O juiz avalia se realmente há impossibilidade ou dificuldade excessiva de prova, e se a alegação inicial é razoável. Também pode reconhecer hipossuficiência de uma das partes sem necessariamente inverter o ônus — depende do contexto específico do caso."
    ],
    exemplos: [
      "Consumidor que recebe aparelho novo e ele para de funcionar semanas depois; não sabe se foi defeito de fábrica ou dano do próprio uso — juiz pode inverter e exigir que o fornecedor prove que foi mau uso",
      "Paciente denunciando erro em cirurgia, mas sem acesso aos autos médicos e radiografias que só o hospital conserva; hipossuficiência pode levar o juiz a exigir que o médico/hospital demonstrem que a conduta foi correta",
      "Trabalhador cobrando horas extras não registradas; empresa controla os pontos eletrônicos; juiz pode considerar hipossuficiência e exigir que a empregadora comprove que não havia aditivos na jornada"
    ],
    areas: ["consumidor", "civil"],
    ver_tambem: ["responsabilidade-civil", "dano-material", "dano-moral"],
    atualizado_em: "2026-06-18"
  },
  {
    slug: "culpa",
    termo: "Culpa",
    variacoes: ["negligência", "imprudência", "imperícia", "culpa grave", "culpa leve", "culpa levíssima"],
    definicao_curta:
      "Comportamento negligente, imprudente ou imperito que causa dano a outrem, sem intenção de prejudicar.",
    explicacao: [
      "Culpa é a falta de cuidado, atenção ou técnica que causa prejuízo a alguém, mas sem vontade intencional de prejudicar — e é justamente isso que a distingue do dolo (a intenção deliberada de causar o dano). Quando alguém age com culpa, quer fazer algo, mas o faz de forma negligente, imprudente ou sem o conhecimento técnico necessário, resultando em dano.",
      "A lei reconhece três graus de culpa: a grave (também conhecida como culpa lata), quando o agente age com descuido extremo, ignorando o óbvio; a leve, que é o descuido comum, quando a pessoa não age com o cuidado esperado de uma pessoa normal; e a levíssima, quando há apenas pequena falta de atenção ou cuidado. Quanto mais grave a culpa, mais ela pesa nas consequências para quem prejudicou.",
      "O juiz, ao fixar ou reduzir a indenização, pode considerar a gravidade da culpa em relação ao dano causado. Quando há grande desproporcionalidade entre o grau de culpa e o dano sofrido, a lei permite que o juiz ajuste o valor da compensação. Por exemplo, um pequeno descuido que resulta em dano enorme pode levar a uma redução da indenização se não houver proporção, embora isso seja avaliado caso a caso.",
      "Provar culpa geralmente depende de mostrar que a pessoa não agiu com o cuidado devido. Documentos, testemunhas, laudos periciais e até a conduta da pessoa no dia dos fatos servem para demonstrar se houve negligência, imprudência ou falta de conhecimento técnico. Em casos de responsabilidade civil, a culpa é frequentemente o ponto central da discussão no processo."
    ],
    exemplos: [
      "Motorista que colide com outro veículo por não ter visto uma placa de trânsito — descuido que poderia ser evitado por qualquer dirigente atento",
      "Médico que realiza cirurgia sem conferir o histórico do paciente e causa complicação porque não sabia de alergia — falta de técnica ou atenção elementar",
      "Vizinho que deixa água da chuva vazar pela parede e danificar o apartamento do andar inferior — negligência ao não manter a impermeabilização",
      "Lojista que exibe um produto de forma perigosa e um cliente se machuca — imprudência em não prever riscos óbvios"
    ],
    areas: ["civil", "consumidor"],
    ver_tambem: ["dolo", "dano-moral", "dano-material", "responsabilidade-civil"],
    atualizado_em: "2026-06-18"
  },
  {
    slug: "insalubridade",
    termo: "Adicional de insalubridade",
    variacoes: ["insalubridade", "adicional insalubre", "ambiente insalubre", "trabalho insalubre"],
    definicao_curta:
      "Valor adicionado ao salário do trabalhador que exerce atividade em ambiente prejudicial à saúde, conforme avaliação pericial.",
    explicacao: [
      "O adicional de insalubridade é uma compensação salarial para o trabalhador que exercita atividades em ambientes perigosos ou prejudiciais à saúde — exposição a produtos químicos, ruído excessivo, temperaturas extremas, ou radiação. A ideia é remunerar esse risco adicional.",
      "A caracterização do ambiente como insalubre depende de laudo pericial técnico realizado segundo a NR-15 (Norma Regulamentadora nº 15), que lista as atividades e graus de exposição. Sem laudo, não há adicional. A empresa não pode simplesmente decidir pagar — precisa de comprovação.",
      "Os percentuais são, em regra, 10% (grau mínimo), 20% (grau médio) ou 40% (grau máximo) incidentes sobre a base de cálculo. Porém, a base sobre a qual o percentual incide — salário mínimo, salário base, ou outra — é tema com divergência na jurisprudência e costuma variar conforme normas coletivas da categoria. Essa questão depende do caso e é fundamental consultar um advogado antes de aceitar um cálculo ou cobrar em juízo.",
      "O adicional pode ser eliminado se a empresa remove o risco — instala equipamento de proteção adequado ou muda o trabalhador para ambiente saudável. Isso não descaracteriza a relação de trabalho nem é abusivo; é forma de cumprir a lei de forma mais eficiente. Outras profissões perigosas — bombeiro, mineiro, mergulhador — têm regras próprias, às vezes mais favoráveis."
    ],
    exemplos: [
      "Operário de fábrica química exposto a vapores tóxicos que recebe laudo confirmando insalubridade e passa a receber o adicional",
      "Trabalhador de construção em ambiente barulhento acima dos limites legais que recebe percentual sobre o salário",
      "Metalúrgico que trabalha com altas temperaturas e, após laudo, passa a receber compensação mensal",
      "Profissional que deixa de trabalhar em setor insalubre, equipado com proteção, e tem o adicional removido pela empresa"
    ],
    areas: ["trabalhista"],
    ver_tambem: ["acidente-de-trabalho", "auxilio-acidente", "rescisao"],
    atualizado_em: "2026-06-18"
  },
  {
    slug: "periculosidade",
    termo: "Adicional de periculosidade",
    variacoes: ["adicional periculosidade", "periculosidade", "trabalho perigoso", "risco grave de morte"],
    definicao_curta:
      "Acréscimo de salário pago ao trabalhador que labora em atividade com risco grave de morte ou lesão permanente.",
    explicacao: [
      "O adicional de periculosidade é um acréscimo no salário do trabalhador que exerce atividade caracterizada como perigosa — ou seja, aquela que expõe o empregado a risco grave de morte ou lesão permanente. É reconhecimento legal de que o trabalho em si traz perigo, independentemente de o acidente ocorrer ou não.",
      "A lei brasileira prevê, em regra, um adicional mínimo de 30% sobre a remuneração, mas esse percentual pode variar. A base de cálculo é em geral o salário-base, porém em situações específicas (como parte do setor elétrico) a base pode ser diferente, dependendo da legislação setorial ou convenção coletiva. Por isso é importante conferir qual é a base exata no seu contrato e categorias de trabalho.",
      "A caracterização de uma atividade como perigosa é feita por laudo técnico, em regra de segurança do trabalho. Algumas profissões — como eletricista de alta tensão, bombeiro, trabalhador em indústrias químicas — são tradicionalmente reconhecidas como perigosas. Outras dependerão de análise específica.",
      "Quanto à possibilidade de acumular o adicional de periculosidade com o de insalubridade: a lei em regra prevê que o trabalhador opte pelo adicional mais vantajoso, não recebendo ambos. Contudo, essa possibilidade de acúmulo é tema discutido na Justiça do Trabalho, e existem decisões em ambos os sentidos — não se pode afirmar categoricamente que é impossível acumular. Cada caso merece análise de um advogado levando em conta a situação concreta e a jurisprudência mais recente."
    ],
    exemplos: [
      "Técnico em manutenção de linhas de alta tensão que recebe adicional por trabalho em altura e sob risco de choque",
      "Operador de equipamento de processo químico perigoso que tem direito ao adicional reconhecido em laudo",
      "Vigilante de banco que executa trabalho com proteção a caixa de valores (profissão classicamente perigosa)"
    ],
    areas: ["trabalhista"],
    ver_tambem: ["rescisao", "aposentadoria", "acidente-de-trabalho"],
    atualizado_em: "2026-06-18"
  },
  // ——— Eleitoral ———
  {
    slug: "inelegibilidade",
    termo: "Inelegibilidade",
    variacoes: ["ficha limpa", "candidato inelegível", "lei da ficha limpa"],
    definicao_curta:
      "Situação jurídica que impede uma pessoa de se candidatar a cargo eletivo, de forma temporária, por razões previstas na Constituição ou em lei complementar.",
    explicacao: [
      "Inelegibilidade é o impedimento de disputar eleição. Não se confunde com perda dos direitos políticos: a pessoa inelegível continua podendo votar — ela só não pode ser votada enquanto durar o impedimento.",
      "As hipóteses estão na Constituição e na Lei Complementar 64/1990, alterada pela chamada Lei da Ficha Limpa (LC 135/2010). Entre os exemplos mais conhecidos estão condenações criminais por órgão colegiado em certos crimes, rejeição de contas de gestão pública em situações específicas e abuso de poder econômico ou político reconhecido pela Justiça Eleitoral.",
      "A inelegibilidade em regra é temporária — a lei fixa períodos de impedimento que variam conforme a hipótese. Também existem inelegibilidades ligadas a parentesco e ao exercício de cargos (a chamada inelegibilidade reflexa e a necessidade de desincompatibilização, quando o ocupante de certo cargo precisa se afastar antes da eleição para poder concorrer).",
      "Saber se alguém é ou não inelegível costuma exigir análise técnica: a mesma condenação pode gerar inelegibilidade em um caso e não gerar em outro, dependendo do crime, do órgão que decidiu e de eventuais recursos. Antes de lançar ou impugnar uma candidatura, procure sempre um advogado."
    ],
    exemplos: [
      "Ex-prefeito com contas de gestão rejeitadas pelo tribunal de contas, em hipótese prevista em lei, que tem o registro de candidatura indeferido",
      "Pessoa condenada por órgão colegiado por crime listado na Lei da Ficha Limpa que fica impedida de concorrer pelo período legal",
      "Parente próximo do chefe do Executivo que pretende disputar cargo na mesma circunscrição e esbarra na inelegibilidade reflexa"
    ],
    areas: ["eleitoral"],
    ver_tambem: ["prestacao-de-contas-eleitoral", "compra-de-votos", "mandado-de-seguranca"],
    atualizado_em: "2026-07-02"
  },
  {
    slug: "prestacao-de-contas-eleitoral",
    termo: "Prestação de contas eleitoral",
    variacoes: ["contas de campanha", "prestação de contas de campanha", "contas eleitorais"],
    definicao_curta:
      "Obrigação de candidatos e partidos de declarar à Justiça Eleitoral tudo o que arrecadaram e gastaram na campanha.",
    explicacao: [
      "Todo candidato e todo partido político são obrigados a prestar contas da campanha à Justiça Eleitoral — mesmo quem não arrecadou nem gastou nada, e mesmo quem desistiu ou teve o registro indeferido. A regra geral está na Lei das Eleições (Lei 9.504/1997) e em resoluções do TSE editadas a cada eleição.",
      "A prestação de contas informa a origem de cada receita (doações, recursos do fundo eleitoral, recursos próprios) e o destino de cada gasto. A Justiça Eleitoral examina os documentos e pode aprovar as contas, aprová-las com ressalvas, desaprová-las ou julgá-las não prestadas.",
      "As consequências variam. Contas desaprovadas podem gerar obrigação de devolver valores e outros reflexos; contas julgadas não prestadas costumam impedir a obtenção da quitação eleitoral, que é condição para disputar eleições seguintes. Em situações mais graves, indícios de irregularidade podem dar origem a ações específicas na Justiça Eleitoral.",
      "Os prazos são curtos e a documentação é detalhada — recibos eleitorais, extratos bancários da conta de campanha, notas fiscais. Quem participa de campanha, mesmo pequena, deve organizar as contas desde o primeiro dia e procurar sempre um advogado ou contador com experiência eleitoral."
    ],
    exemplos: [
      "Candidato a vereador que não teve gastos e mesmo assim precisa apresentar prestação de contas para não ficar sem quitação eleitoral",
      "Campanha que recebeu doação sem emitir recibo eleitoral e tem as contas desaprovadas",
      "Partido que perde acesso a recursos por não prestar contas no prazo"
    ],
    areas: ["eleitoral"],
    ver_tambem: ["inelegibilidade", "propaganda-antecipada", "compra-de-votos"],
    atualizado_em: "2026-07-02"
  },
  {
    slug: "propaganda-antecipada",
    termo: "Propaganda eleitoral antecipada",
    variacoes: ["campanha antecipada", "propaganda extemporânea", "pedido antecipado de voto"],
    definicao_curta:
      "Propaganda eleitoral feita antes do período permitido em lei, sujeita a multa aplicada pela Justiça Eleitoral.",
    explicacao: [
      "A propaganda eleitoral só é permitida a partir da data fixada na Lei das Eleições (Lei 9.504/1997) — em regra, a partir de 16 de agosto do ano da eleição. Pedir votos antes disso configura propaganda antecipada, sujeita a multa tanto para quem faz quanto para quem se beneficia, quando comprovado o prévio conhecimento.",
      "Nem toda manifestação política antes do período é proibida. A própria lei (art. 36-A) permite, antes da campanha, atos como menção à pretensa candidatura, exaltação de qualidades pessoais, participação em entrevistas e debates — desde que não haja pedido explícito de voto. A fronteira entre o que pode e o que não pode é uma das discussões mais frequentes da Justiça Eleitoral, e a jurisprudência evolui a cada ciclo eleitoral.",
      "A punição típica é multa, aplicada em representação proposta por candidato, partido, coligação ou pelo Ministério Público Eleitoral. Em casos graves, a conduta pode ser examinada também sob a ótica do abuso de poder, com consequências mais sérias.",
      "Pré-candidatos, marqueteiros e até apoiadores que impulsionam conteúdo nas redes sociais devem ter cautela redobrada — publicações pagas fora do período e do formato permitidos geram risco real de multa. Na dúvida sobre uma peça ou publicação, procure sempre um advogado eleitoral antes de veicular."
    ],
    exemplos: [
      "Pré-candidato que distribui panfletos pedindo votos meses antes do período de campanha",
      "Publicação impulsionada em rede social com pedido explícito de voto antes de 16 de agosto",
      "Pré-candidata que participa de entrevista falando de suas propostas, sem pedir votos — conduta em regra permitida pelo art. 36-A"
    ],
    areas: ["eleitoral"],
    ver_tambem: ["compra-de-votos", "prestacao-de-contas-eleitoral", "inelegibilidade"],
    atualizado_em: "2026-07-02"
  },
  {
    slug: "compra-de-votos",
    termo: "Compra de votos (captação ilícita de sufrágio)",
    variacoes: ["captação ilícita de sufrágio", "corrupção eleitoral", "compra de voto"],
    definicao_curta:
      "Dar, oferecer ou prometer bem ou vantagem ao eleitor em troca do voto — conduta que é ao mesmo tempo crime eleitoral e causa de cassação.",
    explicacao: [
      "Comprar votos é oferecer, prometer ou entregar dinheiro, bens ou qualquer vantagem ao eleitor para obter seu voto (ou sua abstenção). A conduta é tratada em duas frentes: como crime de corrupção eleitoral, previsto no Código Eleitoral (art. 299), e como captação ilícita de sufrágio, prevista na Lei das Eleições (art. 41-A da Lei 9.504/1997).",
      "As duas frentes são independentes. Na esfera criminal, quem compra (e também quem vende) o voto responde a processo penal perante a Justiça Eleitoral. Na esfera eleitoral, a representação por captação ilícita pode levar à multa e à cassação do registro ou do diploma do candidato beneficiado — ou seja, o candidato pode perder o mandato mesmo sem condenação criminal.",
      "Não é preciso que o candidato entregue a vantagem pessoalmente: a jurisprudência admite a responsabilização quando há participação ou anuência dele, o que sempre depende de prova. Doações de campanha regulares, programas sociais públicos e promessas genéricas de campanha não se confundem, por si sós, com compra de votos — a linha divisória é técnica e examinada caso a caso.",
      "Quem presencia ou é vítima de compra de votos pode denunciar ao Ministério Público Eleitoral ou à Justiça Eleitoral. Quem é acusado deve constituir defesa imediatamente, porque os prazos eleitorais são muito curtos. Procure sempre um advogado."
    ],
    exemplos: [
      "Cabo eleitoral que distribui cestas básicas pedindo o voto em determinado candidato",
      "Candidato que promete emprego a eleitores específicos em troca de votos",
      "Eleitor que recebe dinheiro para fotografar o próprio voto como prova"
    ],
    areas: ["eleitoral", "criminal"],
    ver_tambem: ["inelegibilidade", "propaganda-antecipada", "prestacao-de-contas-eleitoral"],
    atualizado_em: "2026-07-02"
  },
  // ——— Militar ———
  {
    slug: "crime-militar",
    termo: "Crime militar",
    variacoes: ["crime propriamente militar", "crime impropriamente militar", "código penal militar"],
    definicao_curta:
      "Conduta definida como crime no Código Penal Militar, julgada pela Justiça Militar quando presentes as situações previstas em lei.",
    explicacao: [
      "Crime militar é aquele previsto no Código Penal Militar (Decreto-Lei 1.001/1969) e praticado nas situações que a própria lei define — por exemplo, por militar em serviço, em lugar sujeito à administração militar ou contra militar em função. É o critério legal, e não o simples fato de o autor ser militar, que define se o crime é militar ou comum.",
      "Costuma-se distinguir os crimes propriamente militares — que só um militar pode cometer, como deserção e abandono de posto — dos impropriamente militares, que têm equivalente na lei penal comum (furto, lesão corporal, peculato), mas se tornam militares quando praticados nas circunstâncias previstas no Código.",
      "A competência para julgar varia: a Justiça Militar da União julga os crimes militares envolvendo as Forças Armadas (e, em hipóteses legais específicas, pode julgar civis); as Justiças Militares estaduais julgam policiais e bombeiros militares — e nunca julgam civis. Nos crimes dolosos contra a vida de civil praticados por militares estaduais, a competência em regra é do Tribunal do Júri.",
      "Definir se um fato é crime militar ou comum muda o tribunal, o procedimento e até as penas aplicáveis. É uma das primeiras análises que a defesa precisa fazer — procure sempre um advogado com experiência na área."
    ],
    exemplos: [
      "Militar das Forças Armadas que abandona o posto durante o serviço",
      "Policial militar acusado de lesão corporal contra colega de farda em serviço",
      "Militar que responde por deserção após não se apresentar no prazo legal"
    ],
    areas: ["militar", "criminal"],
    ver_tambem: ["transgressao-disciplinar", "conselho-de-justificacao", "habeas-corpus"],
    atualizado_em: "2026-07-02"
  },
  {
    slug: "conselho-de-justificacao",
    termo: "Conselho de justificação",
    variacoes: ["conselho de disciplina", "perda de posto e patente", "exclusão de militar"],
    definicao_curta:
      "Procedimento administrativo que apura se um oficial militar é incapaz de permanecer na corporação, podendo levar o caso ao tribunal competente para decidir sobre a perda do posto.",
    explicacao: [
      "O conselho de justificação é o procedimento em que a corporação apura se um oficial acusado de conduta grave — ofensa ao decoro, à honra ou ao dever militar — tem condições de permanecer na ativa ou na inatividade remunerada. No âmbito federal, é regulado pela Lei 5.836/1972; forças estaduais têm leis próprias.",
      "É o momento mais grave da vida administrativa de um oficial. O nome vem da lógica do procedimento: o oficial é chamado a se justificar perante um conselho formado por oficiais de posto superior. Ao final, o conselho opina, e a autoridade pode arquivar o caso, aplicar medidas administrativas ou remeter o processo ao tribunal militar competente.",
      "A Constituição garante que o oficial só perde o posto e a patente por decisão de tribunal militar de caráter permanente — a exclusão não pode ser puramente administrativa. Para as praças (soldados, cabos, sargentos), o procedimento equivalente é o conselho de disciplina, com regras próprias.",
      "Durante todo o procedimento valem o contraditório e a ampla defesa: acesso aos autos, produção de provas, acompanhamento por advogado. Vícios no procedimento podem levar à anulação. Quem é submetido a conselho deve procurar defesa técnica imediatamente."
    ],
    exemplos: [
      "Oficial da PM acusado de conduta incompatível com a função que é submetido a conselho de justificação",
      "Conselho que conclui pela remessa do caso ao Tribunal de Justiça Militar para decidir sobre a perda do posto",
      "Praça com anos de serviço submetida a conselho de disciplina por acusação de transgressão grave"
    ],
    areas: ["militar", "administrativo"],
    ver_tambem: ["transgressao-disciplinar", "crime-militar", "processo-administrativo-disciplinar"],
    atualizado_em: "2026-07-02"
  },
  {
    slug: "transgressao-disciplinar",
    termo: "Transgressão disciplinar militar",
    variacoes: ["punição disciplinar militar", "falta disciplinar", "regulamento disciplinar"],
    definicao_curta:
      "Violação de dever militar prevista no regulamento disciplinar da corporação, punida administrativamente, sem natureza de crime.",
    explicacao: [
      "Transgressão disciplinar é a infração aos deveres e à ética militar prevista no regulamento disciplinar de cada força — Exército, Marinha, Aeronáutica e as polícias e bombeiros militares dos estados têm regulamentos próprios. Difere do crime militar: a transgressão é apurada e punida dentro da própria corporação, sem processo penal.",
      "As punições típicas incluem advertência, repreensão, detenção e prisão disciplinar, além de reflexos na carreira, como impacto no comportamento e em promoções. Transgressões acumuladas ou graves podem levar a procedimentos mais sérios, como o conselho de disciplina.",
      "Mesmo na esfera disciplinar, o militar tem direito ao contraditório e à ampla defesa. A Constituição restringe o uso do habeas corpus quanto ao mérito das punições disciplinares militares, mas o Judiciário pode controlar a legalidade do ato — competência da autoridade, procedimento correto, oportunidade de defesa, proporcionalidade.",
      "Uma mesma conduta pode, em tese, configurar transgressão e crime militar ao mesmo tempo, com apurações distintas. Diante de qualquer notificação disciplinar, o militar deve guardar os documentos, observar os prazos (que são curtos) e procurar sempre um advogado."
    ],
    exemplos: [
      "Policial militar punido com repreensão por atraso reiterado ao serviço",
      "Militar que responde a procedimento disciplinar por desrespeito a superior hierárquico",
      "Punição disciplinar anulada pela Justiça porque o militar não teve oportunidade de defesa"
    ],
    areas: ["militar", "administrativo"],
    ver_tambem: ["crime-militar", "conselho-de-justificacao", "habeas-corpus"],
    atualizado_em: "2026-07-02"
  },
  {
    slug: "reforma-militar",
    termo: "Reforma e reserva militar",
    variacoes: ["reforma do militar", "reserva remunerada", "inatividade militar"],
    definicao_curta:
      "Formas de inatividade do militar: na reserva ele pode ser convocado de volta; na reforma, o desligamento do serviço é definitivo.",
    explicacao: [
      "Militares não se aposentam como os trabalhadores civis — eles passam à inatividade, que tem duas formas. Na reserva (em regra remunerada), o militar deixa o serviço ativo mas permanece à disposição da força, podendo ser convocado de volta em situações previstas em lei. Na reforma, o desligamento é definitivo: o reformado não pode mais ser convocado.",
      "A passagem para a inatividade pode ocorrer a pedido, após o tempo mínimo de serviço, ou de ofício — por idade-limite do posto ou graduação, por incapacidade física ou, em caráter punitivo, por decisão nos procedimentos disciplinares cabíveis. A reforma por incapacidade tem regras próprias, e a remuneração pode variar conforme a causa da incapacidade ter ou não relação com o serviço.",
      "As regras principais dos militares federais estão no Estatuto dos Militares (Lei 6.880/1980), com alterações relevantes na reestruturação de 2019 (Lei 13.954/2019), que mudou tempo mínimo e regras de transição. Policiais e bombeiros militares seguem as leis do seu estado, também alteradas nos últimos anos.",
      "Litígios comuns envolvem reforma por incapacidade negada, grau de invalidez, remuneração na inatividade e pensão militar. Como as regras mudaram recentemente e há transições em curso, cada caso exige conferência da norma aplicável — procure sempre um advogado."
    ],
    exemplos: [
      "Militar que atinge a idade-limite do posto e passa compulsoriamente para a reserva remunerada",
      "Policial militar que sofre acidente em serviço e pede reforma por incapacidade",
      "Militar da reserva convocado de volta ao serviço ativo em situação prevista em lei"
    ],
    areas: ["militar", "previdenciario"],
    ver_tambem: ["conselho-de-justificacao", "transgressao-disciplinar", "aposentadoria"],
    atualizado_em: "2026-07-02"
  },
  // ——— Internacional ———
  {
    slug: "homologacao-de-sentenca-estrangeira",
    termo: "Homologação de sentença estrangeira",
    variacoes: ["homologação de decisão estrangeira", "validar divórcio no exterior", "sentença estrangeira no Brasil"],
    definicao_curta:
      "Procedimento no STJ que faz uma decisão judicial de outro país produzir efeitos no Brasil.",
    explicacao: [
      "Uma decisão judicial proferida em outro país, em regra, não vale automaticamente no Brasil. Para produzir efeitos aqui — ser executada, averbada em registro, usada como título — ela precisa ser homologada pelo Superior Tribunal de Justiça (STJ), em procedimento previsto na Constituição, no Código de Processo Civil e no regimento do próprio tribunal.",
      "O STJ não reexamina o mérito da decisão estrangeira: verifica requisitos formais, como ter sido proferida por autoridade competente, com citação regular da parte, estar eficaz no país de origem e não ofender a ordem pública brasileira. Os documentos precisam vir formalizados — em regra com apostilamento (ou legalização consular, conforme o país) e tradução juramentada.",
      "Há uma exceção prática importante: o divórcio consensual simples, que apenas dissolve o casamento, pode ser averbado diretamente no cartório de registro civil, sem homologação. Se a decisão estrangeira tratar também de guarda de filhos, partilha de bens ou pensão, ou se o divórcio foi litigioso, a homologação no STJ volta a ser o caminho.",
      "Depois de homologada, a decisão é cumprida pela Justiça Federal. O procedimento é documental e técnico — um papel faltando ou uma tradução irregular pode atrasar tudo. Procure sempre um advogado antes de reunir a documentação."
    ],
    exemplos: [
      "Brasileira divorciada litigiosamente nos Estados Unidos que precisa homologar a sentença para partilhar bens situados no Brasil",
      "Divórcio consensual simples feito em Portugal averbado diretamente no cartório, sem passar pelo STJ",
      "Sentença estrangeira de pensão alimentícia homologada para ser cobrada no Brasil"
    ],
    areas: ["internacional", "familia", "civil"],
    ver_tambem: ["apostilamento", "divorcio", "naturalizacao"],
    atualizado_em: "2026-07-02"
  },
  {
    slug: "apostilamento",
    termo: "Apostilamento (Apostila de Haia)",
    variacoes: ["apostila de haia", "apostilar documento", "legalização de documento estrangeiro"],
    definicao_curta:
      "Certificação feita em cartório que autentica um documento público para uso em outro país signatário da Convenção da Apostila de Haia.",
    explicacao: [
      "O apostilamento é o selo (apostila) que certifica a autenticidade de um documento público — certidão de nascimento, diploma, sentença, procuração com firma reconhecida — para que ele seja aceito em outro país. Foi criado pela Convenção da Apostila de Haia, de 1961, em vigor para o Brasil desde 2016, e substituiu a antiga legalização consular entre os países signatários.",
      "No Brasil, o apostilamento é feito em cartórios autorizados pelo Conselho Nacional de Justiça (CNJ). O documento brasileiro apostilado passa a ser aceito nos demais países da Convenção sem etapas consulares; da mesma forma, documentos estrangeiros apostilados no país de origem são aceitos aqui. Cada documento é apostilado individualmente e o serviço tem custo por ato, conforme a tabela de emolumentos.",
      "A apostila autentica a origem do documento — assinatura, cargo de quem assinou, selo — mas não traduz o conteúdo. Documentos em língua estrangeira para uso no Brasil em regra precisam também de tradução juramentada; documentos brasileiros para uso no exterior podem precisar de tradução conforme a exigência do país de destino.",
      "Se o país de destino não for signatário da Convenção, o caminho continua sendo a legalização consular tradicional. Antes de reunir documentos para processos como cidadania, casamento no exterior ou homologação de sentença, vale confirmar as exigências exatas — procure sempre um advogado ou o consulado competente."
    ],
    exemplos: [
      "Certidões de nascimento apostiladas no Brasil para processo de cidadania italiana",
      "Diploma universitário apostilado para validação de estudos em Portugal",
      "Sentença estrangeira apostilada no país de origem e traduzida por tradutor juramentado para homologação no STJ"
    ],
    areas: ["internacional", "civil"],
    ver_tambem: ["homologacao-de-sentenca-estrangeira", "naturalizacao", "visto-humanitario"],
    atualizado_em: "2026-07-02"
  },
  {
    slug: "naturalizacao",
    termo: "Naturalização",
    variacoes: ["naturalização brasileira", "virar cidadão brasileiro", "nacionalidade brasileira"],
    definicao_curta:
      "Processo pelo qual um estrangeiro adquire a nacionalidade brasileira, cumprindo os requisitos da Constituição e da Lei de Migração.",
    explicacao: [
      "Naturalização é o caminho para o estrangeiro se tornar brasileiro. As regras estão na Constituição e na Lei de Migração (Lei 13.445/2017), que prevê modalidades diferentes: ordinária, extraordinária, especial e provisória — cada uma com requisitos próprios de tempo de residência, idade e vínculos com o país.",
      "Na modalidade ordinária, os requisitos centrais costumam ser residência no Brasil pelo prazo legal (em regra quatro anos, reduzível em hipóteses como ter cônjuge ou filho brasileiro), capacidade civil, comunicação em língua portuguesa e ausência de condenação penal (ou reabilitação). A extraordinária atende quem reside no Brasil há mais de quinze anos ininterruptos, sem condenação penal.",
      "O pedido é processado pelo Ministério da Justiça, em procedimento hoje amplamente digital. O naturalizado passa a ter, em regra, os mesmos direitos do brasileiro nato, com poucas exceções previstas na própria Constituição — como a impossibilidade de ocupar certos cargos (Presidente da República, por exemplo).",
      "Não se confunde com o reconhecimento de nacionalidade de origem (como a cidadania italiana ou portuguesa por descendência), que segue a lei do outro país. Prazos, provas de residência e certidões exigem organização — procure sempre um advogado para avaliar a modalidade adequada ao seu caso."
    ],
    exemplos: [
      "Estrangeiro casado com brasileira que pede naturalização ordinária com prazo de residência reduzido",
      "Imigrante que vive no Brasil há mais de quinze anos e pede naturalização extraordinária",
      "Filho de estrangeiros que veio criança para o Brasil e pede naturalização ao atingir a maioridade"
    ],
    areas: ["internacional", "administrativo"],
    ver_tambem: ["visto-humanitario", "apostilamento", "homologacao-de-sentenca-estrangeira"],
    atualizado_em: "2026-07-02"
  },
  {
    slug: "visto-humanitario",
    termo: "Visto humanitário (acolhida humanitária)",
    variacoes: ["acolhida humanitária", "visto temporário humanitário", "refúgio e acolhida"],
    definicao_curta:
      "Visto temporário concedido a pessoas de países em grave crise — conflito, desastre ou violação de direitos humanos — para viver regularmente no Brasil.",
    explicacao: [
      "O visto humanitário (tecnicamente, visto temporário para acolhida humanitária) é previsto na Lei de Migração (Lei 13.445/2017). Ele permite que pessoas de países atingidos por grave instabilidade — conflito armado, desastre ambiental, calamidade ou violação grave de direitos humanos — entrem e residam regularmente no Brasil.",
      "Os países e situações contemplados são definidos pelo governo em atos conjuntos dos ministérios competentes, que fixam requisitos e prazos. Ao longo dos anos, já houve regulamentações para nacionais de países como Haiti, Síria, Ucrânia e Afeganistão — a lista muda conforme o cenário internacional, e é preciso verificar a norma vigente para cada nacionalidade.",
      "Não se confunde com o refúgio. O refúgio é regido pela Lei 9.474/1997, é pedido já em território brasileiro a qualquer tempo, é gratuito e depende de reconhecimento da condição de refugiado (fundado temor de perseguição, entre outras hipóteses). O visto humanitário é um visto — normalmente solicitado em consulado — e não exige prova individual de perseguição. Uma mesma pessoa pode, conforme o caso, ter os dois caminhos disponíveis.",
      "Quem recebe acolhida humanitária pode pedir autorização de residência e, com o tempo e os requisitos legais, buscar a naturalização. Documentação de países em crise costuma ser incompleta, e as normas mudam com frequência — procure sempre um advogado ou as organizações de apoio a migrantes."
    ],
    exemplos: [
      "Família ucraniana que obtém visto de acolhida humanitária durante o conflito no país",
      "Nacional do Haiti que veio ao Brasil com visto humanitário após desastre e depois pede autorização de residência",
      "Afegão que chega ao Brasil com visto humanitário e, já no país, avalia com advogado se pede também o reconhecimento como refugiado"
    ],
    areas: ["internacional"],
    ver_tambem: ["naturalizacao", "apostilamento", "homologacao-de-sentenca-estrangeira"],
    atualizado_em: "2026-07-02"
  },
  // ——— Ambiental ———
  {
    slug: "auto-de-infracao-ambiental",
    termo: "Auto de infração ambiental",
    variacoes: ["multa ambiental", "multa do ibama", "infração ambiental"],
    definicao_curta:
      "Documento lavrado por órgão ambiental (IBAMA, órgãos estaduais ou municipais) que registra uma infração e pode aplicar multa, embargo e outras sanções.",
    explicacao: [
      "O auto de infração ambiental é o ato pelo qual a fiscalização registra que alguém descumpriu norma de proteção ambiental. Na esfera federal, as infrações e sanções estão no Decreto 6.514/2008, que regulamenta a Lei de Crimes Ambientais (Lei 9.605/1998); estados e municípios têm normas próprias para suas fiscalizações.",
      "As sanções vão além da multa: advertência, embargo da obra ou atividade, apreensão de bens e produtos, suspensão de atividades, demolição. A multa é calculada conforme a gravidade e os parâmetros da norma, e pode alcançar valores altos — mas o auto não é o fim da história: ele abre um processo administrativo em que o autuado pode se defender.",
      "A defesa administrativa deve ser apresentada no prazo indicado no próprio auto — na esfera federal, em regra 20 dias — e pode apontar vícios formais (descrição genérica, enquadramento errado, competência) e questões de mérito. Da decisão cabe recurso. Em vários casos a norma admite a conversão da multa em serviços de preservação ambiental, com desconto, e há programas de regularização conforme a época.",
      "Pagar a multa não encerra as outras esferas: a obrigação civil de reparar o dano e eventual processo penal por crime ambiental correm de forma independente. Ao receber um auto de infração, guarde tudo, anote o prazo e procure sempre um advogado antes de pagar ou assinar qualquer termo."
    ],
    exemplos: [
      "Produtor rural autuado pelo IBAMA por desmatamento sem autorização, com multa e embargo da área",
      "Empresa autuada por operar sem licença ambiental que apresenta defesa administrativa no prazo",
      "Autuado que consegue converter parte da multa em serviços de recuperação ambiental"
    ],
    areas: ["ambiental", "administrativo"],
    ver_tambem: ["licenciamento-ambiental", "tac-ambiental", "area-de-preservacao-permanente", "responsabilidade-civil"],
    atualizado_em: "2026-07-02"
  },
  {
    slug: "licenciamento-ambiental",
    termo: "Licenciamento ambiental",
    variacoes: ["licença ambiental", "licença prévia", "licença de instalação", "licença de operação"],
    definicao_curta:
      "Procedimento em que o órgão ambiental autoriza a instalação e a operação de atividades que utilizam recursos naturais ou podem causar degradação.",
    explicacao: [
      "O licenciamento ambiental é a autorização estatal para atividades potencialmente poluidoras ou que usam recursos naturais — indústrias, loteamentos, mineração, granjas, postos de combustível, entre muitas outras. A base está na Política Nacional do Meio Ambiente (Lei 6.938/1981) e em resoluções do CONAMA, com regras complementares estaduais e municipais.",
      "O modelo clássico tem três etapas: licença prévia (LP), que aprova a viabilidade e a localização do empreendimento; licença de instalação (LI), que autoriza o início das obras; e licença de operação (LO), que autoriza o funcionamento. Empreendimentos de maior impacto exigem estudos ambientais mais completos, como o EIA/RIMA; atividades de menor porte podem ter procedimentos simplificados, conforme a norma local.",
      "Qual órgão licencia depende da abrangência do impacto: a regra geral (LC 140/2011) distribui as competências entre União (IBAMA), estados e municípios. As licenças têm prazo de validade e condicionantes — obrigações que o empreendedor deve cumprir para manter a licença.",
      "Operar sem licença, ou descumprir condicionantes, gera multa, embargo e pode configurar crime ambiental. Para quem empreende, o licenciamento deve entrar no planejamento desde o início, porque os prazos de análise variam bastante. Procure sempre um advogado ou consultor ambiental antes de iniciar a atividade."
    ],
    exemplos: [
      "Indústria que obtém LP, LI e LO antes de iniciar a operação da fábrica",
      "Posto de combustível autuado por operar com a licença de operação vencida",
      "Loteamento embargado por iniciar obras antes da licença de instalação"
    ],
    areas: ["ambiental", "administrativo", "empresarial"],
    ver_tambem: ["auto-de-infracao-ambiental", "area-de-preservacao-permanente", "tac-ambiental"],
    atualizado_em: "2026-07-02"
  },
  {
    slug: "tac-ambiental",
    termo: "TAC ambiental (termo de ajustamento de conduta)",
    variacoes: ["termo de ajustamento de conduta", "termo de compromisso ambiental", "acordo com ministério público ambiental"],
    definicao_curta:
      "Acordo formal em que quem causou ou pode causar dano ambiental assume obrigações de correção e reparação, evitando ou encerrando ações judiciais.",
    explicacao: [
      "O termo de ajustamento de conduta (TAC) é um acordo previsto na Lei da Ação Civil Pública (Lei 7.347/1985) em que o interessado se compromete, perante órgãos legitimados — como o Ministério Público e os órgãos ambientais —, a adequar sua conduta às exigências legais, com prazos e condições definidos.",
      "Na prática ambiental, o TAC costuma prever obrigações como recuperar a área degradada, implantar controles de poluição, regularizar o licenciamento e, em certos casos, compensações. Assinado, o termo tem eficácia de título executivo extrajudicial: se as obrigações não forem cumpridas, podem ser executadas diretamente na Justiça, sem necessidade de novo processo de conhecimento.",
      "Para quem está sendo investigado ou processado, o TAC pode ser vantajoso: evita ou encerra litígios longos, dá previsibilidade e demonstra boa-fé. Mas é um compromisso sério — as cláusulas devem ser realistas, com prazos exequíveis, porque o descumprimento gera multa e execução. O TAC também não impede, por si só, as demais esferas de responsabilização, como a penal, que seguem regras próprias.",
      "Negociar um TAC exige avaliar o custo das obrigações, o passivo real e as alternativas. Antes de assinar (ou recusar) um termo proposto pelo Ministério Público ou pelo órgão ambiental, procure sempre um advogado."
    ],
    exemplos: [
      "Empresa que assina TAC com o Ministério Público comprometendo-se a instalar estação de tratamento de efluentes",
      "Produtor rural que firma termo para recuperar área de preservação permanente desmatada, com cronograma de plantio",
      "TAC descumprido que é executado judicialmente com cobrança da multa prevista no termo"
    ],
    areas: ["ambiental", "civil", "administrativo"],
    ver_tambem: ["auto-de-infracao-ambiental", "area-de-preservacao-permanente", "responsabilidade-civil"],
    atualizado_em: "2026-07-02"
  },
  {
    slug: "area-de-preservacao-permanente",
    termo: "Área de preservação permanente (APP)",
    variacoes: ["app", "mata ciliar", "área protegida", "código florestal"],
    definicao_curta:
      "Área protegida por lei — como margens de rios, nascentes, topos de morro e encostas — cuja vegetação em regra não pode ser removida.",
    explicacao: [
      "Área de preservação permanente (APP) é a área protegida pelo Código Florestal (Lei 12.651/2012) com a função de preservar recursos hídricos, o solo, a biodiversidade e a estabilidade do terreno. Exemplos típicos: faixas ao longo de rios e córregos (com largura que varia conforme a largura do curso d'água), entorno de nascentes e lagos, topos de morro, encostas íngremes e restingas.",
      "Em regra, a vegetação da APP deve ser mantida, e a área não pode ser ocupada ou explorada. A lei admite intervenção apenas em hipóteses restritas — utilidade pública, interesse social ou atividades de baixo impacto definidas na norma —, mediante autorização. A proteção existe tanto em áreas rurais quanto urbanas.",
      "A APP não se confunde com a reserva legal, que é o percentual do imóvel rural que deve manter vegetação nativa (variável conforme a região do país). Um mesmo imóvel rural pode ter as duas obrigações, declaradas no Cadastro Ambiental Rural (CAR). Para ocupações antigas, o Código Florestal criou regras de regularização com faixas mínimas de recomposição, que dependem do tamanho do imóvel e da data da ocupação.",
      "Desmatar ou construir em APP gera auto de infração, embargo, obrigação de recuperar a área — que acompanha o imóvel, mesmo para quem comprou o problema pronto — e pode configurar crime ambiental. Antes de comprar imóvel às margens de curso d'água ou intervir em área com vegetação, procure sempre um advogado."
    ],
    exemplos: [
      "Sítio com córrego cuja mata ciliar foi retirada pelo antigo dono — o novo proprietário é notificado a recompor a faixa",
      "Construção embargada por avançar sobre a faixa de proteção de uma nascente",
      "Produtor que declara a APP e a reserva legal do imóvel no Cadastro Ambiental Rural"
    ],
    areas: ["ambiental", "imobiliario"],
    ver_tambem: ["auto-de-infracao-ambiental", "licenciamento-ambiental", "tac-ambiental", "usucapiao"],
    atualizado_em: "2026-07-02"
  },
  // ——— Administrativo ———
  {
    slug: "processo-administrativo-disciplinar",
    termo: "Processo administrativo disciplinar (PAD)",
    variacoes: ["pad", "sindicância", "processo disciplinar de servidor"],
    definicao_curta:
      "Procedimento em que a Administração apura infração funcional de servidor público, podendo aplicar penalidades que vão da advertência à demissão.",
    explicacao: [
      "O PAD é o instrumento pelo qual o poder público apura se um servidor cometeu infração aos seus deveres funcionais. Para os servidores federais, as regras estão na Lei 8.112/1990; estados e municípios têm estatutos próprios, com estruturas parecidas. Antes do PAD, muitas apurações começam por sindicância, procedimento mais simples que pode resultar em arquivamento, penalidade leve ou instauração do processo disciplinar.",
      "O PAD federal tem três fases: instauração (portaria que designa a comissão), inquérito administrativo (instrução com provas, interrogatório e defesa escrita) e julgamento pela autoridade competente. As penalidades possíveis vão de advertência e suspensão até demissão, cassação de aposentadoria e destituição de cargo em comissão, conforme a gravidade.",
      "O servidor tem direito ao contraditório e à ampla defesa em todas as fases — acesso aos autos, produção de provas, acompanhamento por advogado (facultativo, segundo a Súmula Vinculante 5 do STF, mas em geral recomendável em casos graves). Vícios como comissão irregular, cerceamento de defesa e desproporcionalidade da pena podem levar à anulação do processo, na via administrativa ou judicial.",
      "Ser notificado em sindicância ou PAD não significa condenação — mas os prazos de defesa são curtos e o que se produz no início pesa no resultado. Procure sempre um advogado logo na primeira notificação."
    ],
    exemplos: [
      "Servidor federal que responde a PAD por acusação de abandono de cargo",
      "Sindicância que conclui pela instauração de processo disciplinar contra servidor acusado de acumulação ilegal de cargos",
      "Demissão anulada pela Justiça porque a comissão do PAD não permitiu ao servidor produzir provas"
    ],
    areas: ["administrativo"],
    ver_tambem: ["improbidade-administrativa", "mandado-de-seguranca", "nomeacao-em-concurso-publico"],
    atualizado_em: "2026-07-02"
  },
  {
    slug: "improbidade-administrativa",
    termo: "Improbidade administrativa",
    variacoes: ["ação de improbidade", "lei de improbidade", "lia"],
    definicao_curta:
      "Ato ilegal e intencional de agente público que gera enriquecimento ilícito, prejuízo ao erário ou viola princípios da Administração, punido com sanções graves.",
    explicacao: [
      "Improbidade administrativa é a conduta do agente público (e de particulares que participem) que se enquadra na Lei 8.429/1992: enriquecimento ilícito, dano ao erário ou violação dos princípios da Administração Pública. Não é crime — é ilícito de natureza civil-administrativa, apurado em ação judicial própria, movida pelo Ministério Público.",
      "As sanções são severas: perda dos bens acrescidos ilicitamente, ressarcimento do dano, perda da função pública, suspensão dos direitos políticos, multa e proibição de contratar com o poder público — com patamares que variam conforme o tipo de ato.",
      "A reforma de 2021 (Lei 14.230/2021) mudou pontos centrais: passou a exigir dolo (intenção) para todas as modalidades — a improbidade meramente culposa deixou de existir —, restringiu a modalidade de violação de princípios a uma lista fechada de condutas e alterou regras de prazo. O STF decidiu que a exigência de dolo não se aplica automaticamente a condenações por culpa já definitivas, e a aplicação das novas regras a casos antigos segue gerando discussões — cada processo exige análise individual.",
      "Improbidade não se confunde com mera ilegalidade ou má gestão: exige desonestidade, intenção. Tanto para quem acusa quanto para quem se defende, é área de alta complexidade técnica. Procure sempre um advogado ao receber citação ou notificação em ação de improbidade."
    ],
    exemplos: [
      "Servidor que recebe propina para facilitar contrato e responde por enriquecimento ilícito",
      "Gestor que frauda licitação causando prejuízo aos cofres públicos",
      "Ação de improbidade rejeitada por ausência de prova de dolo após a reforma de 2021"
    ],
    areas: ["administrativo", "criminal"],
    ver_tambem: ["processo-administrativo-disciplinar", "mandado-de-seguranca", "responsabilidade-civil"],
    atualizado_em: "2026-07-02"
  },
  {
    slug: "desapropriacao",
    termo: "Desapropriação",
    variacoes: ["desapropriação por utilidade pública", "indenização por desapropriação", "imissão na posse"],
    definicao_curta:
      "Transferência compulsória de um bem particular para o poder público, por necessidade ou utilidade pública ou interesse social, mediante indenização.",
    explicacao: [
      "Desapropriação é o instrumento pelo qual o Estado toma para si um bem particular — em geral um imóvel — para atender a uma finalidade pública: abrir uma estrada, construir uma escola, implantar programa habitacional, fazer reforma agrária. A Constituição exige, em regra, indenização prévia, justa e em dinheiro; as normas gerais estão no Decreto-Lei 3.365/1941 e em leis específicas.",
      "O procedimento começa com o decreto que declara o bem de utilidade pública ou interesse social. Depois vem a fase de acordo ou de ação judicial: se o proprietário não aceita o valor oferecido, o processo segue com perícia para apurar a indenização justa. O poder público pode obter a posse do imóvel antes do fim do processo (imissão provisória na posse), mediante depósito, enquanto a discussão sobre o valor continua.",
      "O ponto mais litigioso costuma ser o valor: a indenização deve refletir o preço de mercado, incluindo, conforme o caso, benfeitorias e outras parcelas, com juros e correção. O proprietário em regra não consegue impedir a desapropriação em si — o Judiciário não revisa a conveniência da decisão administrativa —, mas pode discutir vícios do procedimento e, principalmente, o valor.",
      "Casos especiais têm regras próprias, como a desapropriação para reforma agrária (indenizável em títulos da dívida agrária) e a desapropriação-confisco de áreas com culturas ilegais, sem indenização. Ao ser notificado de desapropriação, não assine acordo sem avaliar o valor de mercado — procure sempre um advogado e, se possível, uma avaliação técnica independente."
    ],
    exemplos: [
      "Casa desapropriada para duplicação de uma avenida, com discussão judicial sobre o valor da indenização",
      "Poder público que obtém imissão provisória na posse mediante depósito enquanto a perícia apura o valor justo",
      "Fazenda improdutiva desapropriada para reforma agrária, com indenização em títulos da dívida agrária"
    ],
    areas: ["administrativo", "imobiliario", "civil"],
    ver_tambem: ["usucapiao", "mandado-de-seguranca", "improbidade-administrativa"],
    atualizado_em: "2026-07-02"
  },
  {
    slug: "nomeacao-em-concurso-publico",
    termo: "Nomeação em concurso público",
    variacoes: ["direito à nomeação", "aprovado dentro das vagas", "preterição em concurso", "cadastro de reserva"],
    definicao_curta:
      "Ato que convoca o aprovado em concurso para assumir o cargo — quem passa dentro do número de vagas do edital tem, em regra, direito à nomeação.",
    explicacao: [
      "A nomeação é o ato pelo qual a Administração convoca o candidato aprovado em concurso para tomar posse no cargo. O STF firmou entendimento de que o candidato aprovado dentro do número de vagas previsto no edital tem, em regra, direito subjetivo à nomeação dentro do prazo de validade do concurso — a Administração escolhe o momento, mas não pode simplesmente deixar de nomear, salvo situações excepcionais e devidamente motivadas.",
      "Quem fica fora das vagas (cadastro de reserva) tem, em princípio, apenas expectativa de direito. Essa expectativa pode se transformar em direito em situações reconhecidas pela jurisprudência — principalmente a preterição: quando surgem vagas e a Administração as preenche de forma irregular, por exemplo contratando temporários ou terceirizados para as mesmas funções enquanto há aprovados aguardando.",
      "Outras discussões comuns envolvem eliminação em exame psicotécnico sem critérios objetivos, exclusão por tatuagem ou em investigação social sem base legal, e mudanças de regra depois de publicado o edital — o edital vincula a Administração, e alterações no meio do certame podem ser questionadas.",
      "O instrumento típico para atacar ilegalidades em concurso é o mandado de segurança, cujo prazo é de 120 dias contados do ato — quem espera demais pode perder essa via. Guarde o edital, as publicações e os comprovantes, e procure sempre um advogado ao identificar a irregularidade."
    ],
    exemplos: [
      "Aprovado em 5º lugar para 10 vagas que não é nomeado dentro da validade do concurso e obtém a nomeação na Justiça",
      "Candidato do cadastro de reserva que comprova a contratação de temporários para a mesma função e demonstra preterição",
      "Candidata eliminada em psicotécnico sem critérios objetivos que consegue anular a eliminação"
    ],
    areas: ["administrativo"],
    ver_tambem: ["mandado-de-seguranca", "processo-administrativo-disciplinar", "liminar"],
    atualizado_em: "2026-07-02"
  },
  // ——— Criminal (cidadão) ———
  {
    slug: "prisao-em-flagrante",
    termo: "Prisão em flagrante",
    variacoes: ["flagrante", "auto de prisão em flagrante", "preso em flagrante"],
    definicao_curta:
      "Prisão de quem é surpreendido durante o crime ou logo após, que deve ser comunicada imediatamente ao juiz.",
    explicacao: [
      "A prisão em flagrante acontece quando a pessoa é presa no momento em que comete o crime, logo depois de cometê-lo ou quando é encontrada com objetos que indiquem, de forma clara, que acabou de praticá-lo. É a única prisão que pode ser feita sem ordem prévia do juiz, inclusive por qualquer pessoa do povo, embora seja mais comum pela polícia.",
      "Feita a prisão, lavra-se o auto de prisão em flagrante, e a pessoa presa tem direitos garantidos pela Constituição — permanecer em silêncio, ser informada da acusação, ter assistência de advogado e comunicar a família. O caso deve ser levado rapidamente ao juiz, que decide se converte o flagrante em prisão preventiva, concede liberdade (com ou sem fiança) ou relaxa a prisão quando ela foi ilegal.",
      "O flagrante não significa condenação: é apenas o início. A pessoa continua presumida inocente até o fim do processo. Se a prisão foi feita fora das hipóteses previstas na lei ou sem respeitar os direitos do preso, ela pode ser considerada ilegal e desfeita.",
      "Diante de uma prisão em flagrante, o mais importante é acionar imediatamente um advogado, que pode pedir liberdade, fiança ou habeas corpus. Procure sempre um advogado o quanto antes."
    ],
    exemplos: [
      "Pessoa detida pela polícia com o produto do furto momentos após a subtração",
      "Suspeito preso por populares logo após uma agressão e entregue à polícia",
      "Motorista flagrado dirigindo embriagado durante uma blitz"
    ],
    areas: ["criminal"],
    ver_tambem: ["fianca", "audiencia-de-custodia", "habeas-corpus"],
    atualizado_em: "2026-07-04"
  },
  {
    slug: "fianca",
    termo: "Fiança criminal",
    variacoes: ["fiança", "pagar fiança", "arbitramento de fiança"],
    definicao_curta:
      "Valor pago para que a pessoa presa responda ao processo em liberdade, com o compromisso de cumprir obrigações.",
    explicacao: [
      "A fiança é uma garantia em dinheiro (ou em bens) que permite ao acusado responder ao processo em liberdade, assumindo o compromisso de comparecer aos atos do processo e de não atrapalhar a investigação. Se descumprir as condições ou fugir, pode perder o valor e ser preso novamente.",
      "Em crimes menos graves, a própria autoridade policial (o delegado) pode arbitrar a fiança já na delegacia; nos demais casos, quem decide é o juiz. O valor é fixado conforme a gravidade do crime e a situação econômica da pessoa, podendo ser reduzido ou até dispensado para quem não tem condições de pagar.",
      "Nem todo crime admite fiança. A lei lista crimes inafiançáveis, como o racismo e os crimes hediondos. Mesmo quando a fiança não é cabível, isso não significa que a pessoa ficará necessariamente presa — o juiz pode conceder liberdade provisória sem fiança em outras situações.",
      "Se a fiança arbitrada for alta demais para a realidade da pessoa, o advogado pode pedir revisão ao juiz. Diante de uma prisão, procure sempre um advogado para avaliar o cabimento e o valor da fiança."
    ],
    exemplos: [
      "Delegado que arbitra fiança para soltar a pessoa presa por crime de menor gravidade",
      "Juiz que reduz o valor da fiança por causa da baixa renda do acusado",
      "Acusado que perde a fiança por deixar de comparecer às audiências"
    ],
    areas: ["criminal"],
    ver_tambem: ["prisao-em-flagrante", "audiencia-de-custodia", "habeas-corpus"],
    atualizado_em: "2026-07-04"
  },
  {
    slug: "audiencia-de-custodia",
    termo: "Audiência de custódia",
    variacoes: ["audiência de apresentação", "custódia"],
    definicao_curta:
      "Apresentação rápida da pessoa presa a um juiz, para verificar a legalidade da prisão e a integridade do preso.",
    explicacao: [
      "A audiência de custódia é o encontro, em regra dentro de 24 horas após a prisão, entre a pessoa presa e um juiz. Serve para o juiz verificar se a prisão foi legal, se a pessoa sofreu maus-tratos ou tortura e para decidir o que acontece a seguir — soltar, conceder liberdade com medidas ou manter a prisão.",
      "Ela não julga se a pessoa é culpada ou inocente. O objetivo é controlar a legalidade da prisão logo no início e coibir abusos. Estão presentes o juiz, o Ministério Público e a defesa, e a pessoa presa pode falar sobre as circunstâncias da prisão.",
      "A audiência de custódia foi adotada no Brasil a partir de normas do Conselho Nacional de Justiça e depois incorporada expressamente à lei processual penal. Hoje é etapa obrigatória, e a sua ausência pode ser motivo para questionar a prisão.",
      "É um momento decisivo: uma boa atuação da defesa pode resultar em liberdade já ali. Por isso, é importante que a pessoa presa esteja acompanhada de advogado. Procure sempre um advogado."
    ],
    exemplos: [
      "Pessoa presa em flagrante que é levada ao juiz no dia seguinte para a audiência de custódia",
      "Juiz que concede liberdade na audiência ao constatar que a prisão foi desnecessária",
      "Preso que relata agressões na abordagem, registradas na audiência de custódia"
    ],
    areas: ["criminal"],
    ver_tambem: ["prisao-em-flagrante", "fianca", "habeas-corpus"],
    atualizado_em: "2026-07-04"
  },
  {
    slug: "porte-de-drogas",
    termo: "Porte de drogas para consumo pessoal",
    variacoes: ["porte de drogas", "usuário de drogas", "porte para uso próprio"],
    definicao_curta:
      "Ter drogas para consumo próprio, situação tratada de forma diferente do tráfico e que, em regra, não leva à prisão.",
    explicacao: [
      "Porte de drogas para consumo pessoal é ter consigo pequena quantidade de entorpecente para uso próprio. A Lei de Drogas trata essa situação de modo bem diferente do tráfico: para o usuário, não há pena de prisão — as medidas previstas são advertência, prestação de serviços à comunidade e comparecimento a programa educativo.",
      "A grande questão prática é distinguir o usuário do traficante. A lei manda considerar a quantidade da droga, o local e as circunstâncias da apreensão, além da conduta e dos antecedentes da pessoa. Não existe uma regra única e simples; cada caso é analisado individualmente.",
      "No caso específico da maconha, o Supremo Tribunal Federal fixou parâmetros para orientar essa diferença entre uso pessoal e tráfico. Ainda assim, a classificação continua dependendo do conjunto das circunstâncias de cada caso concreto.",
      "Ser flagrado com droga, mesmo como usuário, gera um procedimento que pode ter reflexos importantes. Por isso, procure sempre um advogado para orientar a defesa e evitar que o uso seja tratado, indevidamente, como tráfico."
    ],
    exemplos: [
      "Pessoa flagrada com pequena quantidade de droga para consumo próprio",
      "Discussão, no processo, sobre se a quantidade indica uso ou tráfico",
      "Usuário que recebe medida educativa em vez de pena de prisão"
    ],
    areas: ["criminal"],
    ver_tambem: ["prisao-em-flagrante", "fianca", "bafometro", "habeas-corpus"],
    atualizado_em: "2026-07-04"
  },
  {
    slug: "bafometro",
    termo: "Bafômetro e Lei Seca",
    variacoes: ["bafômetro", "etilômetro", "lei seca", "embriaguez ao volante"],
    definicao_curta:
      "Teste que mede o álcool no organismo do motorista; a recusa e a embriaguez ao volante geram penalidades próprias.",
    explicacao: [
      "O bafômetro (etilômetro) é o aparelho usado para medir a concentração de álcool no ar expelido pelos pulmões, indicando se o motorista bebeu. Faz parte da fiscalização da chamada Lei Seca, voltada a coibir a direção sob efeito de álcool.",
      "Dirigir sob influência de álcool é, ao mesmo tempo, infração administrativa gravíssima (com multa e suspensão do direito de dirigir) e, a partir de certo nível ou de sinais claros de embriaguez, crime de trânsito. A prova pode vir do bafômetro, de exame de sangue ou até de outros sinais observados pelo agente, como o comportamento do condutor.",
      "Ninguém é obrigado a produzir prova contra si mesmo, e por isso o motorista pode se recusar a soprar o bafômetro. A recusa, porém, é tratada pela lei como infração administrativa autônoma, com penalidade equivalente à da embriaguez — ou seja, evita a prova, mas não a punição administrativa.",
      "As consequências variam conforme o caso e podem envolver as esferas administrativa e criminal ao mesmo tempo. Diante de uma autuação por embriaguez ou por recusa, procure sempre um advogado."
    ],
    exemplos: [
      "Motorista abordado em blitz que sopra o bafômetro e é autuado por embriaguez",
      "Condutor que se recusa ao teste e recebe a penalidade administrativa pela recusa",
      "Caso em que a embriaguez ao volante vira também processo criminal"
    ],
    areas: ["criminal", "administrativo"],
    ver_tambem: ["cnh-suspensa", "prisao-em-flagrante", "porte-de-drogas"],
    atualizado_em: "2026-07-04"
  },
  {
    slug: "cnh-suspensa",
    termo: "CNH suspensa",
    variacoes: ["suspensão do direito de dirigir", "carteira suspensa", "suspensão da CNH"],
    definicao_curta:
      "Penalidade que impede a pessoa de dirigir por um período, aplicada em processo administrativo de trânsito.",
    explicacao: [
      "A suspensão do direito de dirigir é a penalidade que retira, temporariamente, a possibilidade de conduzir veículos. Ela ocorre principalmente em duas situações previstas no Código de Trânsito: quando o condutor atinge um determinado número de pontos na carteira dentro de 12 meses, ou quando comete certas infrações que, sozinhas, já geram a suspensão.",
      "A suspensão não é automática: deve haver um processo administrativo, com notificação e direito de defesa e de recurso perante os órgãos de trânsito. Só depois de concluído esse processo é que o condutor deve entregar a CNH e cumprir o período de suspensão, muitas vezes acompanhado de curso de reciclagem.",
      "Dirigir durante o período de suspensão é infração gravíssima e pode levar à cassação da CNH — penalidade mais grave, que exige recomeçar o processo de habilitação depois de um prazo. São coisas diferentes: a suspensão é temporária; a cassação é a perda da habilitação.",
      "Há prazos curtos para apresentar defesa e recurso, e falhas no processo podem anular a penalidade. Ao receber a notificação, guarde tudo, observe os prazos e procure sempre um advogado."
    ],
    exemplos: [
      "Motorista que atinge o limite de pontos em um ano e responde a processo de suspensão",
      "Condutor autuado por infração que, sozinha, gera a suspensão do direito de dirigir",
      "Defesa que anula a suspensão por falta de notificação regular"
    ],
    areas: ["administrativo"],
    ver_tambem: ["bafometro", "mandado-de-seguranca", "tutela-de-urgencia"],
    atualizado_em: "2026-07-04"
  },
  // ——— Previdenciário (cidadão) ———
  {
    slug: "salario-maternidade",
    termo: "Salário-maternidade",
    variacoes: ["licença-maternidade", "benefício maternidade"],
    definicao_curta:
      "Benefício pago pelo INSS à segurada afastada do trabalho por causa do nascimento ou da adoção de um filho.",
    explicacao: [
      "O salário-maternidade é o benefício que garante renda à mãe durante o afastamento pelo nascimento de um filho, e também em casos de adoção, de guarda para adoção e, em situações previstas, de aborto não criminoso. Em regra, dura 120 dias.",
      "Têm direito não só as empregadas com carteira assinada, mas também as trabalhadoras autônomas, as MEIs, as contribuintes facultativas e as seguradas especiais (como as trabalhadoras rurais), desde que cumpridos os requisitos de qualidade de segurada e, quando exigida, a carência mínima de contribuições.",
      "Para a empregada com carteira assinada, em regra o pagamento é feito pela empresa, que depois se compensa; para as demais, costuma ser pago diretamente pelo INSS. Em caso de falecimento da mãe, o benefício pode ser transferido ao outro genitor.",
      "Pedidos são negados com frequência por falta de documentos ou por dúvida sobre a qualidade de segurada. Se o benefício foi negado ou pago a menos, vale revisar. Procure sempre um advogado ou o INSS para orientação sobre o seu caso."
    ],
    exemplos: [
      "Empregada gestante que se afasta e recebe o salário-maternidade durante a licença",
      "Trabalhadora autônoma que requer o benefício diretamente ao INSS após o parto",
      "Casal que adota uma criança e requer o salário-maternidade"
    ],
    areas: ["previdenciario", "trabalhista"],
    ver_tambem: ["auxilio-doenca", "aposentadoria", "estabilidade-gestante"],
    atualizado_em: "2026-07-04"
  },
  {
    slug: "auxilio-reclusao",
    termo: "Auxílio-reclusão",
    variacoes: ["benefício de reclusão", "pensão de preso"],
    definicao_curta:
      "Benefício pago aos dependentes de segurado de baixa renda que foi preso, enquanto durar a reclusão em regime fechado.",
    explicacao: [
      "O auxílio-reclusão é um benefício previdenciário pago não ao preso, mas aos seus dependentes — como cônjuge, companheiro e filhos —, para amparar a família que dependia da renda dele. Segue, em boa parte, a mesma lógica da pensão por morte.",
      "Para ter direito, o segurado preso precisa se enquadrar como de baixa renda (conforme o limite atualizado periodicamente), estar em regime fechado e ter a qualidade de segurado, com o número mínimo de contribuições exigido pela lei. Não basta estar preso: os requisitos são específicos.",
      "O benefício é pago enquanto durar a reclusão nessas condições. Se o preso passa a regime menos rigoroso, é solto ou foge, o pagamento pode cessar. A família precisa comprovar periodicamente que ele continua preso.",
      "As regras mudaram nos últimos anos e há bastante confusão sobre quem tem direito. Diante da prisão de quem sustentava a casa, vale verificar o cabimento. Procure sempre um advogado ou o INSS."
    ],
    exemplos: [
      "Filhos de trabalhador de baixa renda preso em regime fechado que passam a receber o benefício",
      "Esposa que comprova a prisão do marido para manter o auxílio-reclusão",
      "Benefício encerrado quando o segurado é colocado em liberdade"
    ],
    areas: ["previdenciario"],
    ver_tambem: ["pensao-por-morte", "bpc-loas", "auxilio-doenca"],
    atualizado_em: "2026-07-04"
  },
  {
    slug: "aposentadoria-especial",
    termo: "Aposentadoria especial",
    variacoes: ["aposentadoria por insalubridade", "tempo especial", "atividade especial"],
    definicao_curta:
      "Aposentadoria de quem trabalhou exposto a agentes que prejudicam a saúde, com regras próprias de tempo e comprovação.",
    explicacao: [
      "A aposentadoria especial é destinada a quem trabalhou exposto, de forma habitual, a agentes nocivos à saúde — ruído excessivo, calor, produtos químicos, agentes biológicos, entre outros. A ideia é permitir a aposentadoria antes, por causa do desgaste maior da atividade.",
      "A comprovação da exposição é o ponto central e costuma ser feita por documentos técnicos fornecidos pela empresa, como o PPP (Perfil Profissiográfico Previdenciário) e laudos ambientais. Sem essa prova, o INSS não reconhece o tempo especial.",
      "Depois da reforma da Previdência de 2019, as regras mudaram: passou a haver exigência de idade mínima somada ao tempo de atividade especial, com regras de transição para quem já contribuía. O uso de equipamentos de proteção também pode influenciar o reconhecimento, tema que ainda gera discussão.",
      "Muitos pedidos são negados por documentação incompleta ou porque o INSS não reconhece a exposição. Em vários casos é possível reverter em revisão ou na Justiça. Procure sempre um advogado especializado em direito previdenciário."
    ],
    exemplos: [
      "Metalúrgico exposto a ruído acima do limite que soma tempo de atividade especial",
      "Profissional de saúde exposto a agentes biológicos que requer a aposentadoria especial",
      "Trabalhador que consegue reconhecer o tempo especial com base no PPP fornecido pela empresa"
    ],
    areas: ["previdenciario", "trabalhista"],
    ver_tambem: ["aposentadoria", "insalubridade", "periculosidade"],
    atualizado_em: "2026-07-04"
  },
  // ——— Trabalhista (cidadão) ———
  {
    slug: "rescisao-indireta",
    termo: "Rescisão indireta",
    variacoes: ["demissão indireta", "justa causa do empregador"],
    definicao_curta:
      "Rompimento do contrato por culpa grave do empregador, com direito às mesmas verbas de uma demissão sem justa causa.",
    explicacao: [
      "A rescisão indireta é a justa causa aplicada ao empregador. Quando o patrão comete falta grave — deixa de pagar salários, exige serviços humilhantes ou fora do contrato, descumpre obrigações, submete o empregado a rigor excessivo ou a assédio —, o trabalhador pode considerar o contrato rompido por culpa da empresa.",
      "O efeito é importante: reconhecida a rescisão indireta, o trabalhador recebe as mesmas verbas de quem foi demitido sem justa causa — aviso prévio, multa de 40% do FGTS, saque do FGTS e seguro-desemprego, entre outras, conforme o caso. É o oposto do pedido de demissão, em que se perde parte desses direitos.",
      "Em regra, o reconhecimento é buscado na Justiça do Trabalho, e o trabalhador precisa provar a falta grave do empregador. Por isso, reunir provas — mensagens, testemunhas, comprovantes de atraso de salário — é decisivo.",
      "Sair simplesmente pedindo demissão pode significar perder direitos que seriam garantidos pela rescisão indireta. Antes de tomar a decisão, procure sempre um advogado trabalhista."
    ],
    exemplos: [
      "Empregado que sai por meses de salário atrasado e pede a rescisão indireta",
      "Trabalhador vítima de assédio moral que rompe o contrato por culpa da empresa",
      "Funcionário obrigado a tarefas humilhantes que busca as verbas na Justiça"
    ],
    areas: ["trabalhista"],
    ver_tambem: ["rescisao", "justa-causa", "assedio-moral", "fgts"],
    atualizado_em: "2026-07-04"
  },
  {
    slug: "ferias",
    termo: "Férias",
    variacoes: ["férias vencidas", "férias proporcionais", "terço de férias"],
    definicao_curta:
      "Descanso remunerado anual do trabalhador, pago com um adicional de um terço sobre o salário.",
    explicacao: [
      "As férias são o direito ao descanso anual remunerado. Em regra, o trabalhador com carteira assinada adquire o direito a 30 dias de férias após cada período de 12 meses de trabalho (o chamado período aquisitivo) e deve tirá-las nos 12 meses seguintes.",
      "Além do salário do período, o trabalhador recebe o adicional de um terço (1/3) de férias, garantido pela Constituição. Faltas em excesso ao longo do ano podem reduzir a quantidade de dias de férias, conforme a lei.",
      "É possível vender parte das férias: o trabalhador pode converter até um terço em dinheiro, o chamado abono pecuniário. Após a reforma trabalhista, as férias também podem ser fracionadas em até três períodos, respeitados os limites da lei. Férias não concedidas no prazo devem ser pagas em dobro.",
      "Erros comuns envolvem férias pagas fora do prazo, sem o terço, ou nunca concedidas. Se você saiu do emprego sem receber férias vencidas ou proporcionais, procure sempre um advogado."
    ],
    exemplos: [
      "Trabalhador que tira 30 dias de férias e recebe o salário com o terço constitucional",
      "Empregado que vende dez dias de férias como abono pecuniário",
      "Férias concedidas com atraso que precisam ser pagas em dobro"
    ],
    areas: ["trabalhista"],
    ver_tambem: ["decimo-terceiro", "rescisao", "aviso-previo"],
    atualizado_em: "2026-07-04"
  },
  {
    slug: "decimo-terceiro",
    termo: "Décimo terceiro salário",
    variacoes: ["13º salário", "gratificação natalina", "decimo terceiro"],
    definicao_curta:
      "Gratificação natalina paga ao trabalhador no fim do ano, equivalente, em regra, a um salário extra.",
    explicacao: [
      "O décimo terceiro salário, ou gratificação natalina, é um pagamento anual a que têm direito os trabalhadores com carteira assinada e também aposentados e pensionistas. Corresponde, em regra, a um salário, proporcional aos meses trabalhados no ano.",
      "O pagamento costuma ser feito em duas parcelas: a primeira até o fim de novembro e a segunda até 20 de dezembro. Quem trabalhou o ano inteiro recebe o valor cheio; quem trabalhou parte do ano recebe proporcionalmente (cada mês com 15 dias ou mais de trabalho conta como mês integral).",
      "Na saída do emprego, o décimo terceiro proporcional entra nas verbas rescisórias, salvo na dispensa por justa causa, em que há perda dessa parcela. Ele também compõe a base de outros direitos, como o FGTS.",
      "Se o décimo terceiro não foi pago, foi pago a menos ou não entrou na rescisão, é possível cobrar. Procure sempre um advogado trabalhista."
    ],
    exemplos: [
      "Empregado que recebe a primeira parcela do décimo terceiro em novembro",
      "Trabalhador desligado em julho que recebe o décimo terceiro proporcional na rescisão",
      "Cobrança de décimo terceiro atrasado na Justiça do Trabalho"
    ],
    areas: ["trabalhista"],
    ver_tambem: ["ferias", "rescisao", "fgts"],
    atualizado_em: "2026-07-04"
  },
  {
    slug: "banco-de-horas",
    termo: "Banco de horas",
    variacoes: ["compensação de jornada", "compensação de horas"],
    definicao_curta:
      "Sistema que permite compensar horas trabalhadas a mais com folgas, em vez de pagar hora extra.",
    explicacao: [
      "O banco de horas é um acordo que permite guardar as horas trabalhadas além da jornada para depois compensá-las com folgas ou redução de jornada, em vez de pagá-las como horas extras. Serve para dar flexibilidade quando a demanda de trabalho varia.",
      "Para valer, precisa de acordo. Após a reforma trabalhista, um acordo individual por escrito permite compensação dentro de até seis meses; para prazos maiores, de até um ano, exige-se acordo ou convenção coletiva com o sindicato. As horas não compensadas dentro do prazo devem ser pagas como extras, com o adicional.",
      "O banco de horas não pode ser usado para mascarar horas extras nunca pagas nem compensadas. Se o sistema não é regular ou as horas somem sem a folga correspondente, o trabalhador pode ter direito a receber essas horas como extras.",
      "Encerrado o contrato, o saldo positivo de horas deve ser pago. Se você desconfia que o banco de horas está sendo usado de forma irregular, procure sempre um advogado trabalhista."
    ],
    exemplos: [
      "Empresa que compensa as horas extras da semana cheia com folgas na semana seguinte",
      "Acordo coletivo que institui banco de horas com compensação em até um ano",
      "Saldo de horas não compensado que é pago como hora extra na rescisão"
    ],
    areas: ["trabalhista"],
    ver_tambem: ["horas-extras", "adicional-noturno", "rescisao"],
    atualizado_em: "2026-07-04"
  },
  {
    slug: "adicional-noturno",
    termo: "Adicional noturno",
    variacoes: ["trabalho noturno", "hora noturna", "hora reduzida noturna"],
    definicao_curta:
      "Acréscimo no salário do trabalhador que atua durante a noite, pago sobre as horas trabalhadas nesse período.",
    explicacao: [
      "O adicional noturno é o valor a mais pago a quem trabalha durante a noite, em compensação pelo desgaste maior desse horário. Para o trabalhador urbano, considera-se noturno, em regra, o trabalho entre 22h de um dia e 5h do dia seguinte.",
      "O adicional é de, no mínimo, 20% sobre o valor da hora normal para o trabalhador urbano — convenções coletivas podem prever percentual maior. Além disso, há a chamada hora noturna reduzida: cada hora trabalhada à noite é contada como se tivesse pouco menos de 60 minutos, o que aumenta o total de horas pagas.",
      "O trabalho rural tem regras próprias, com horários e percentuais diferentes. Quando a jornada noturna se prolonga para depois das 5h, o adicional pode continuar incidindo sobre esse tempo, conforme a jurisprudência.",
      "É comum o adicional noturno ser pago a menos ou não considerar a hora reduzida. Se você trabalha à noite e desconfia de erro no cálculo, procure sempre um advogado trabalhista."
    ],
    exemplos: [
      "Vigia noturno que recebe adicional sobre as horas trabalhadas entre 22h e 5h",
      "Profissional de hospital em plantão noturno com direito à hora reduzida",
      "Trabalhador que descobre que o adicional noturno vinha sendo pago a menos"
    ],
    areas: ["trabalhista"],
    ver_tambem: ["horas-extras", "banco-de-horas", "insalubridade"],
    atualizado_em: "2026-07-04"
  },
  // ——— Família e sucessões (cidadão) ———
  {
    slug: "regime-de-bens",
    termo: "Regime de bens",
    variacoes: ["comunhão parcial", "comunhão universal", "separação de bens", "pacto antenupcial"],
    definicao_curta:
      "Conjunto de regras que define como ficam os bens do casal durante o casamento e em caso de divórcio ou falecimento.",
    explicacao: [
      "O regime de bens é o que determina se o patrimônio do casal se mistura ou não, e como será dividido se o casamento terminar por divórcio ou por morte. A escolha é feita antes do casamento; sem escolha expressa, aplica-se o regime legal padrão.",
      "Os principais regimes são: a comunhão parcial (regra geral no Brasil), em que se dividem os bens adquiridos durante o casamento, ficando de fora os anteriores e os recebidos por herança ou doação; a comunhão universal, em que quase tudo se comunica; a separação total, em que cada um mantém o seu; e a participação final nos aquestos, mais rara.",
      "Para adotar um regime diferente do padrão, o casal faz um pacto antenupcial em cartório antes de casar. Em algumas situações a lei impõe a separação obrigatória de bens, como para quem se casa acima de certa idade prevista em lei. O regime pode, em regra, ser alterado depois, mas isso depende de autorização judicial.",
      "A escolha do regime tem efeitos enormes no futuro — em dívidas, herança e divórcio. Antes de casar ou de mudar o regime, procure sempre um advogado para entender as consequências no seu caso."
    ],
    exemplos: [
      "Casal que se casa sem pacto e fica automaticamente na comunhão parcial de bens",
      "Noivos que assinam pacto antenupcial optando pela separação total de bens",
      "Divórcio em que a divisão do patrimônio segue o regime escolhido no casamento"
    ],
    areas: ["familia", "civil"],
    ver_tambem: ["divorcio", "uniao-estavel", "partilha-de-bens", "meacao"],
    atualizado_em: "2026-07-04"
  },
  {
    slug: "investigacao-de-paternidade",
    termo: "Investigação de paternidade",
    variacoes: ["ação de paternidade", "reconhecimento de paternidade", "exame de DNA"],
    definicao_curta:
      "Ação judicial para reconhecer quem é o pai (ou a mãe) de uma pessoa, com efeitos de filiação.",
    explicacao: [
      "A ação de investigação de paternidade serve para reconhecer juridicamente o vínculo entre filho e pai quando esse reconhecimento não foi feito de forma voluntária. Reconhecida a paternidade, surgem todos os efeitos da filiação: nome, direito a alimentos, herança e demais direitos.",
      "A prova mais importante costuma ser o exame de DNA. Quando o suposto pai se recusa, sem justificativa, a fazer o exame, essa recusa pesa contra ele — a lei e a jurisprudência admitem que se presuma a paternidade a partir desse comportamento, somado a outros indícios.",
      "O direito de investigar a origem é protegido de forma ampla: o reconhecimento do estado de filho, em regra, não se perde pelo passar do tempo. Já a cobrança de valores como alimentos e a discussão sobre herança podem ter prazos próprios, o que exige análise cuidadosa.",
      "É possível cumular o pedido de reconhecimento com o de pensão alimentícia. Por envolver provas e prazos técnicos, procure sempre um advogado para conduzir a ação."
    ],
    exemplos: [
      "Filho que ingressa com ação para reconhecer o pai que nunca o registrou",
      "Mãe que pede o reconhecimento e a pensão do filho na mesma ação",
      "Caso em que a recusa ao exame de DNA leva o juiz a presumir a paternidade"
    ],
    areas: ["familia", "civil"],
    ver_tambem: ["pensao-alimenticia", "guarda", "herdeiro-necessario"],
    atualizado_em: "2026-07-04"
  },
  {
    slug: "doacao",
    termo: "Doação",
    variacoes: ["doar bem", "doação de imóvel", "adiantamento de legítima"],
    definicao_curta:
      "Contrato em que uma pessoa transfere, de graça, um bem seu para outra, dentro dos limites da lei.",
    explicacao: [
      "Doação é a entrega gratuita de um bem — dinheiro, imóvel, veículo — de uma pessoa (doador) para outra (donatário). Por ser um ato importante, a doação de imóveis exige escritura pública, e algumas doações precisam ser aceitas pelo donatário.",
      "A lei protege quem doa e também terceiros. O doador não pode doar todo o seu patrimônio a ponto de ficar sem o mínimo para a própria subsistência. Além disso, quem tem herdeiros necessários (como filhos) não pode doar, além da metade que a lei reserva a eles (a legítima) — a doação que ultrapassa esse limite pode ser questionada.",
      "A doação de pais para filhos é, em regra, vista como adiantamento de herança e, no futuro, precisa ser trazida à conta na partilha (a colação), salvo dispensa expressa dentro dos limites legais. Também existem doações com condições ou com reserva de usufruto, muito usadas em planejamento familiar.",
      "Doações mal planejadas geram brigas de família e problemas fiscais (incide o imposto estadual sobre a doação). Antes de doar ou de aceitar uma doação, procure sempre um advogado."
    ],
    exemplos: [
      "Pai que doa um imóvel ao filho reservando para si o usufruto",
      "Doação em dinheiro que precisa ser considerada na partilha da herança",
      "Doação anulada por ultrapassar a parte que a lei reserva aos herdeiros"
    ],
    areas: ["civil", "familia"],
    ver_tambem: ["testamento", "inventario", "herdeiro-necessario", "usufruto"],
    atualizado_em: "2026-07-04"
  },
  // ——— Consumidor e civil (cidadão) ———
  {
    slug: "juizado-especial",
    termo: "Juizado Especial",
    variacoes: ["juizado de pequenas causas", "juizado especial cível", "pequenas causas"],
    definicao_curta:
      "Justiça mais rápida e simples para causas de menor valor e complexidade, em que muitas vezes nem é preciso advogado.",
    explicacao: [
      "O Juizado Especial (também chamado de Juizado de Pequenas Causas) foi criado para resolver, de forma rápida e informal, conflitos de menor valor e complexidade. É onde o cidadão costuma resolver problemas do dia a dia — cobrança indevida, produto com defeito, briga de vizinhos, pequenas dívidas.",
      "Nos Juizados Especiais Cíveis estaduais, cabem causas até um limite ligado ao salário mínimo, e para as de menor valor a própria pessoa pode entrar sozinha, sem advogado, embora contar com um seja recomendável. O processo é guiado pelos princípios da oralidade e da simplicidade, com audiência de conciliação logo no início.",
      "Existem também o Juizado Especial Federal (para causas contra o INSS e outros órgãos federais até certo valor) e o da Fazenda Pública (contra estados e municípios). Cada um tem o seu limite e as suas regras próprias.",
      "A gratuidade em primeiro grau e a rapidez tornam o Juizado uma porta acessível de acesso à Justiça. Para causas mais complexas, de valor maior ou em caso de recurso, procure sempre um advogado."
    ],
    exemplos: [
      "Consumidor que cobra na Justiça a devolução de uma cobrança indevida no cartão",
      "Cliente que pede a troca de um produto com defeito não resolvido pela loja",
      "Segurado que discute a negativa de um benefício no Juizado Especial Federal"
    ],
    areas: ["civil", "consumidor"],
    ver_tambem: ["dano-moral", "vicio-do-produto", "negativacao-indevida"],
    atualizado_em: "2026-07-04"
  },
  {
    slug: "nome-negativado",
    termo: "Nome negativado",
    variacoes: ["nome sujo", "negativado", "limpar o nome", "SPC e Serasa"],
    definicao_curta:
      "Situação de quem teve o nome incluído em cadastros de inadimplentes, como SPC e Serasa, por causa de uma dívida.",
    explicacao: [
      "Ter o nome negativado significa estar registrado em um cadastro de proteção ao crédito, como SPC, Serasa ou SCPC, por causa de uma dívida não paga. Na prática, isso dificulta conseguir crédito, financiamento, cartão e até fechar alguns contratos.",
      "Antes de negativar, a empresa deve avisar o consumidor por escrito, dando a chance de pagar. A inscrição só pode se referir a uma dívida real e ainda cobrável — dívida já paga, prescrita ou inexistente não pode manter o nome sujo, e a permanência do registro tem prazo máximo previsto no Código de Defesa do Consumidor.",
      "Pago o débito ou feito um acordo, o consumidor tem direito de ter o nome retirado do cadastro em prazo razoável. Se a negativação foi feita sem aviso prévio, por dívida que não existe ou já quitada, ela é indevida e pode gerar direito a indenização — assunto tratado no verbete sobre negativação indevida.",
      "Para regularizar, vale conferir os cadastros (a consulta ao próprio nome é gratuita), negociar a dívida e guardar os comprovantes. Se houver cobrança abusiva ou recusa em dar baixa, procure sempre um advogado."
    ],
    exemplos: [
      "Consumidor que descobre o nome no SPC ao tentar comprar parcelado",
      "Pessoa que paga a dívida e cobra a retirada do nome do cadastro",
      "Nome mantido negativado mesmo após acordo, gerando reclamação"
    ],
    areas: ["consumidor", "civil"],
    ver_tambem: ["negativacao-indevida", "dano-moral", "protesto-de-titulo", "superendividamento"],
    atualizado_em: "2026-07-04"
  },
  {
    slug: "superendividamento",
    termo: "Superendividamento",
    variacoes: ["repactuação de dívidas", "renegociação de dívidas", "endividamento excessivo"],
    definicao_curta:
      "Situação do consumidor de boa-fé que não consegue pagar todas as suas dívidas sem comprometer o mínimo para viver.",
    explicacao: [
      "Superendividamento é quando a pessoa física, de boa-fé, acumula dívidas de consumo a ponto de não conseguir pagá-las sem sacrificar o mínimo necessário para a sua sobrevivência e a da família. A lei que atualizou o Código de Defesa do Consumidor (Lei 14.181/2021) passou a tratar expressamente do tema.",
      "A lei criou ferramentas para ajudar quem está nessa situação, sem simplesmente perdoar as dívidas. A principal é a possibilidade de renegociar todas as dívidas de uma só vez, em uma audiência de conciliação com todos os credores, na qual se monta um plano de pagamento que preserve o chamado mínimo existencial.",
      "A proteção alcança dívidas de consumo (cartão, empréstimo, financiamento, contas), mas não abrange dívidas contraídas com fraude, nem, em regra, alimentos, tributos e débitos sem relação com o consumo. Também há regras contra o crédito irresponsável e a cobrança abusiva.",
      "Quem está afundado em dívidas pode buscar essa repactuação no Judiciário ou em órgãos de defesa do consumidor. Para organizar o plano e proteger o mínimo existencial, procure sempre um advogado ou o Procon."
    ],
    exemplos: [
      "Aposentado com vários empréstimos consignados que compromete quase toda a renda",
      "Consumidor que pede a repactuação conjunta de todas as suas dívidas em audiência",
      "Família que monta plano de pagamento preservando o mínimo para viver"
    ],
    areas: ["consumidor", "civil"],
    ver_tambem: ["nome-negativado", "juros-de-mora", "negativacao-indevida"],
    atualizado_em: "2026-07-04"
  },
  {
    slug: "golpe-do-pix",
    termo: "Golpe do Pix",
    variacoes: ["fraude no Pix", "estelionato por Pix", "golpe bancário"],
    definicao_curta:
      "Fraudes que usam o Pix para enganar a vítima e desviar dinheiro, com possíveis responsabilidades do golpista e do banco.",
    explicacao: [
      "Golpe do Pix é o nome popular de diversas fraudes que se aproveitam da rapidez das transferências instantâneas — falso funcionário de banco, falso parente pedindo dinheiro, compra em site falso, clonagem de WhatsApp, troca de QR Code. Do ponto de vista penal, geralmente configuram estelionato.",
      "Ao perceber o golpe, a vítima deve agir rápido: comunicar o banco, registrar boletim de ocorrência e acionar o Mecanismo Especial de Devolução (MED), criado pelo Banco Central, que pode bloquear e tentar devolver os valores quando ainda estão na conta do fraudador ou em casos de falha de segurança.",
      "A responsabilidade do banco depende do caso. A jurisprudência costuma reconhecer que as instituições financeiras respondem quando há falha no serviço ou na segurança que facilita a fraude; por outro lado, quando a própria vítima é induzida a transferir voluntariamente, a discussão é mais complexa e analisada caso a caso.",
      "Guardar prints, comprovantes e protocolos é essencial para tentar reaver o dinheiro e para uma eventual ação. Diante de um golpe, procure a polícia, o banco e sempre um advogado."
    ],
    exemplos: [
      "Vítima que transfere dinheiro a um falso funcionário do banco e aciona o MED",
      "Consumidor que paga por produto em site falso e não recebe nada",
      "Pessoa que cai em golpe de WhatsApp clonado pedindo Pix urgente"
    ],
    areas: ["consumidor", "civil", "criminal"],
    ver_tambem: ["dano-moral", "responsabilidade-civil", "nome-negativado"],
    atualizado_em: "2026-07-04"
  },
  {
    slug: "decadencia",
    termo: "Decadência",
    variacoes: ["prazo decadencial", "caducidade"],
    definicao_curta:
      "Perda do próprio direito por não ter sido exercido dentro do prazo que a lei ou o contrato fixaram.",
    explicacao: [
      "Decadência é a extinção de um direito porque o seu titular deixou passar o prazo para exercê-lo. Diferente da prescrição, que faz perder a possibilidade de cobrar algo na Justiça, a decadência faz desaparecer o próprio direito — em geral, direitos que dependem de uma providência da pessoa dentro de certo tempo.",
      "Um exemplo comum está nas relações de consumo: o consumidor tem prazos curtos para reclamar de um defeito aparente no produto ou serviço (contados da entrega ou da execução). Passado esse prazo sem reclamar, decai o direito de exigir a troca, o conserto ou a devolução por aquele defeito.",
      "Em regra, os prazos de decadência não se interrompem nem se suspendem como os de prescrição, embora existam exceções previstas em lei. Por isso, quando a lei ou o contrato fixam um prazo para agir, deixar o tempo correr costuma ser ainda mais arriscado do que na prescrição.",
      "Saber se o caso é de prescrição ou de decadência, e qual o prazo aplicável, é uma análise técnica que muda o resultado. Antes de deixar um prazo passar, procure sempre um advogado."
    ],
    exemplos: [
      "Consumidor que perde o direito de reclamar de defeito aparente por deixar passar o prazo",
      "Direito de anular certo negócio que se extingue se não exercido no prazo legal",
      "Prazo para exercer uma opção prevista em contrato que se encerra sem uso"
    ],
    areas: ["civil", "consumidor"],
    ver_tambem: ["prescricao", "vicio-do-produto", "garantia-legal"],
    atualizado_em: "2026-07-04"
  },
  // ——— Imobiliário e proteção de dados (cidadão) ———
  {
    slug: "contrato-de-aluguel",
    termo: "Contrato de aluguel",
    variacoes: ["contrato de locação", "locação de imóvel", "lei do inquilinato"],
    definicao_curta:
      "Acordo pelo qual o dono cede o uso de um imóvel a outra pessoa em troca do aluguel, regido pela Lei do Inquilinato.",
    explicacao: [
      "O contrato de aluguel (locação) é o acordo pelo qual o proprietário (locador) cede o uso do imóvel ao inquilino (locatário) por um prazo, em troca do pagamento do aluguel. A relação é regida principalmente pela Lei do Inquilinato, que trata da locação urbana.",
      "O contrato costuma prever prazo, valor e forma de reajuste, responsabilidades por consertos e uma garantia. As garantias mais comuns são o fiador, a caução (depósito), o seguro-fiança e a cessão de cotas de fundo — a lei, em regra, admite apenas uma garantia por contrato.",
      "A lei protege os dois lados: define quando o inquilino pode devolver o imóvel antes do prazo (pagando multa proporcional), quando o dono pode pedir o imóvel de volta e como funciona o direito de renovação em locações comerciais. O descumprimento, sobretudo a falta de pagamento, pode levar à ação de despejo.",
      "Ler o contrato com atenção antes de assinar evita a maioria dos conflitos. Diante de cláusulas duvidosas ou de um pedido de despejo, procure sempre um advogado."
    ],
    exemplos: [
      "Inquilino que assina contrato de 30 meses com fiador como garantia",
      "Locatário que devolve o imóvel antes do prazo e paga multa proporcional",
      "Contrato encerrado por falta de pagamento, com ação de despejo"
    ],
    areas: ["imobiliario", "civil"],
    ver_tambem: ["caucao-locaticia", "despejo", "arras", "clausula-penal"],
    atualizado_em: "2026-07-04"
  },
  {
    slug: "caucao-locaticia",
    termo: "Caução locatícia",
    variacoes: ["caução", "depósito caução", "garantia de aluguel"],
    definicao_curta:
      "Depósito dado como garantia em contrato de aluguel, limitado por lei e devolvido ao fim da locação se não houver dívidas.",
    explicacao: [
      "A caução é uma das garantias possíveis no contrato de aluguel: o inquilino deposita um valor (ou oferece um bem) que servirá para cobrir eventuais dívidas, como aluguéis atrasados ou danos ao imóvel. É uma alternativa ao fiador e ao seguro-fiança.",
      "Quando a caução é em dinheiro, a Lei do Inquilinato limita o valor a, no máximo, três meses de aluguel. Esse dinheiro, em regra, deve ser depositado em caderneta de poupança, e o que render pertence ao inquilino.",
      "Ao final da locação, se não houver aluguéis em aberto nem danos além do desgaste natural do uso, a caução deve ser devolvida ao inquilino, com a correção. Descontos só são cabíveis para cobrir dívidas ou reparos efetivamente comprovados.",
      "A retenção indevida da caução é uma queixa frequente. Guarde o contrato, o comprovante do depósito e as fotos do imóvel na entrada e na saída. Havendo recusa injustificada em devolver, procure sempre um advogado."
    ],
    exemplos: [
      "Inquilino que dá três meses de aluguel como caução em vez de apresentar fiador",
      "Caução depositada em poupança e devolvida corrigida no fim do contrato",
      "Locador que retém a caução alegando danos, sem comprovar os reparos"
    ],
    areas: ["imobiliario", "civil"],
    ver_tambem: ["contrato-de-aluguel", "despejo", "arras", "clausula-penal"],
    atualizado_em: "2026-07-04"
  },
  {
    slug: "lgpd",
    termo: "LGPD (proteção de dados pessoais)",
    variacoes: ["lei geral de proteção de dados", "proteção de dados", "dados pessoais"],
    definicao_curta:
      "Lei que protege os dados pessoais dos cidadãos e define regras para empresas e órgãos que coletam e usam essas informações.",
    explicacao: [
      "A Lei Geral de Proteção de Dados (LGPD, Lei 13.709/2018) regula como empresas, sites e órgãos públicos podem coletar, guardar e usar dados pessoais — nome, CPF, endereço, e-mail, dados de saúde, entre outros. O objetivo é dar ao cidadão controle sobre as suas próprias informações.",
      "A lei garante ao titular dos dados vários direitos: saber quais dados uma empresa tem sobre ele, corrigir informações erradas, pedir a exclusão de dados desnecessários e revogar o consentimento dado antes. Em regra, o tratamento de dados precisa de uma base legal, como o consentimento ou o cumprimento de um contrato.",
      "A fiscalização cabe à Autoridade Nacional de Proteção de Dados (ANPD), que pode orientar e aplicar sanções, incluindo multas, a quem descumpre a lei. Vazamentos e uso indevido de dados também podem gerar direito a indenização na Justiça.",
      "Se os seus dados foram vazados, usados sem autorização ou uma empresa se recusa a corrigi-los ou excluí-los, você tem caminhos para reclamar. Procure sempre um advogado para avaliar o seu caso."
    ],
    exemplos: [
      "Consumidor que pede a uma empresa a exclusão dos seus dados após encerrar o cadastro",
      "Cliente que descobre o vazamento dos seus dados e busca reparação",
      "Pessoa que revoga o consentimento para receber mensagens de marketing"
    ],
    areas: ["digital", "civil", "consumidor"],
    ver_tambem: ["habeas-data", "dano-moral", "nome-negativado"],
    atualizado_em: "2026-07-04"
  }
];

export const GLOSSARIO_SLUGS = GLOSSARIO.map((g) => g.slug);

export function findGlossarioTermo(slug: string): GlossarioTermo | undefined {
  return GLOSSARIO.find((g) => g.slug === slug);
}

/**
 * Termos relacionados (mesmo área), excluindo o próprio.
 * Usado em links internos do template.
 */
export function relatedGlossario(slug: string, limit = 6): GlossarioTermo[] {
  const current = findGlossarioTermo(slug);
  if (!current) return [];
  const sameArea = GLOSSARIO.filter(
    (g) => g.slug !== slug && g.areas.some((a) => current.areas.includes(a))
  );
  return sameArea.slice(0, limit);
}

/** Agrupado por letra inicial pra index alfabético */
export function glossarioByLetter(): Record<string, GlossarioTermo[]> {
  const result: Record<string, GlossarioTermo[]> = {};
  for (const g of GLOSSARIO) {
    const letter = g.termo.charAt(0).toUpperCase();
    if (!result[letter]) result[letter] = [];
    result[letter].push(g);
  }
  return result;
}
