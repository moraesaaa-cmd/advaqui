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
