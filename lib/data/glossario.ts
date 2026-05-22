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
