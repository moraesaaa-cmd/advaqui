/**
 * Calculadoras jurídicas — referência de cálculo para casos comuns.
 *
 * Cada calculadora explica a fórmula, dá um exemplo numérico e aponta os
 * itens que o cidadão precisa ter em mãos para fazer o cálculo. Como o
 * resultado depende de variáveis pessoais (salário, idade, tempo de
 * contribuição), o foco é didático — explicar como o cálculo funciona —
 * em vez de fornecer um simulador interativo (que precisa de jurimetria
 * por estado e tempo).
 *
 * Cada calculadora gera versão /em/[cidade] mostrando particularidades
 * locais (qual vara competente, qual cartório, fórum).
 */

export type Calculadora = {
  slug: string;
  titulo: string;
  area_slug: string;
  resumo: string;
  /** Fórmula em linguagem simples */
  formula: string;
  /** Itens que o cidadão precisa ter em mãos */
  precisa_ter: string[];
  /** Exemplo numérico passo a passo */
  exemplo: {
    cenario: string;
    passos: string[];
    resultado: string;
  };
  /** Observações importantes (decisões judiciais que afetam o cálculo) */
  observacoes: string[];
  /** Quando o cálculo difere por cidade/UF (varas competentes etc) */
  variacao_local: string;
  atualizado_em: string;
};

export const CALCULADORAS: Calculadora[] = [
  {
    slug: "rescisao-trabalhista",
    titulo: "Rescisão trabalhista — como calcular",
    area_slug: "trabalhista",
    resumo:
      "Cálculo das verbas devidas no fim do contrato — saldo de salário, aviso prévio, férias proporcionais, 13º proporcional, multa FGTS.",
    formula:
      "Saldo de salário (dias trabalhados no mês) + aviso prévio (proporcional ao tempo de empresa) + férias vencidas e proporcionais (com 1/3) + 13º proporcional + saque FGTS + multa de 40% sobre FGTS (se demissão sem justa causa).",
    precisa_ter: [
      "Carteira de Trabalho com data de admissão e saída",
      "Último contracheque",
      "Extrato do FGTS (consultar pelo aplicativo CAIXA)",
      "Recibo de férias dos últimos 12 meses"
    ],
    exemplo: {
      cenario:
        "Empregado demitido sem justa causa após 2 anos e 6 meses. Salário R$ 3.000. Saída dia 15 do mês. FGTS acumulado R$ 7.200.",
      passos: [
        "Saldo de salário — 15 dias × (R$ 3.000 / 30) = R$ 1.500",
        "Aviso prévio — 30 dias + 3 dias por ano (2 anos completos = +6 dias) = 36 dias × R$ 100 = R$ 3.600",
        "13º proporcional — R$ 3.000 × (8 meses / 12) = R$ 2.000",
        "Férias proporcionais — R$ 3.000 × (8 meses / 12) × 1,333 (com 1/3) = R$ 2.667",
        "FGTS saque + multa 40% — R$ 7.200 (sacado) + R$ 2.880 (multa)",
        "TOTAL — R$ 1.500 + R$ 3.600 + R$ 2.000 + R$ 2.667 + R$ 2.880 = aproximadamente R$ 12.647"
      ],
      resultado:
        "Aproximadamente R$ 12.647 a receber (sem descontos de INSS e IRRF, que incidem sobre parte desses valores)."
    },
    observacoes: [
      "Aviso prévio indenizado (quando empregador dispensa) entra no cálculo do FGTS e da multa",
      "Em demissão por justa causa, o empregado NÃO recebe aviso prévio, multa FGTS, nem saque do FGTS",
      "Em pedido de demissão, NÃO recebe aviso prévio (a menos que o empregador dispense o cumprimento), multa FGTS nem saque",
      "Acordo trabalhista (homologado no sindicato ou MTE) pode reduzir alguns valores"
    ],
    variacao_local:
      "O cálculo é nacional, mas a homologação varia — em municípios com sindicato forte, é feita na sede do sindicato; em outros, no Ministério do Trabalho ou diretamente no setor de RH. Em caso de divergência sobre o valor, a Vara do Trabalho local resolve.",
    atualizado_em: "2026-05-22"
  },
  {
    slug: "fgts-correcao",
    titulo: "FGTS — cálculo da correção e do saque",
    area_slug: "trabalhista",
    resumo:
      "Como conferir se o FGTS foi depositado corretamente, qual a correção devida e quanto se pode sacar em cada modalidade.",
    formula:
      "Salário base × 8% × meses trabalhados, corrigido pela TR + 3% ao ano (ou pelo IPCA, em razão de decisões judiciais que questionam a TR).",
    precisa_ter: [
      "Extrato completo do FGTS (CAIXA — aplicativo ou site)",
      "Histórico de salários (CTPS ou contracheques)",
      "Confirmação dos depósitos mensais (aba 'Depósitos' do extrato)"
    ],
    exemplo: {
      cenario:
        "Empregado com salário de R$ 2.500, trabalhando há 10 anos. Saldo informado no extrato: R$ 28.000.",
      passos: [
        "Depósito mensal esperado — R$ 2.500 × 8% = R$ 200",
        "Total bruto depositado em 120 meses — R$ 24.000",
        "Correção aproximada (10 anos com TR + 3% — média 4% a 5% a.a.) — saldo esperado entre R$ 28.000 e R$ 31.000",
        "Confronto com saldo informado — R$ 28.000 está dentro da faixa"
      ],
      resultado:
        "Se o saldo informado estiver abaixo da faixa, pode haver depósito faltando ou correção a menor — caso para ação judicial."
    },
    observacoes: [
      "A correção do FGTS pela TR foi questionada no STF — há ações pleiteando correção pelo IPCA",
      "Ações de correção do FGTS prescrevem em 30 anos (decisão antiga) ou 5 anos (entendimento mais recente)",
      "Saque-aniversário troca o saque integral por saque parcial anual — alteração feita pelo aplicativo CAIXA"
    ],
    variacao_local:
      "FGTS é federal, sem variação por cidade. O que muda é a Vara da Justiça Federal competente quando a ação é contra a CAIXA — em cidades pequenas, costuma ser a Vara Federal mais próxima.",
    atualizado_em: "2026-05-22"
  },
  {
    slug: "pensao-alimenticia-percentual",
    titulo: "Pensão alimentícia — percentual usual",
    area_slug: "familia",
    resumo:
      "Como o juiz define o percentual de pensão — binômio necessidade-possibilidade, faixas comuns por situação.",
    formula:
      "O juiz aplica o binômio: necessidade do alimentando + possibilidade do alimentante. Não há tabela fixa, mas as faixas comuns são 15% a 30% da renda líquida para 1 filho, podendo subir conforme número de filhos.",
    precisa_ter: [
      "Comprovante de renda do alimentante (3 últimos holerites ou DARF MEI)",
      "Comprovante de despesas do alimentando (escola, plano de saúde, atividades)",
      "Certidão de nascimento do filho",
      "Caso o devedor seja autônomo — declaração de IR ou movimentação bancária"
    ],
    exemplo: {
      cenario:
        "Pai com salário líquido R$ 4.500. 2 filhos menores. Mãe pleiteia pensão.",
      passos: [
        "Percentual comum para 2 filhos — entre 25% e 35% da renda líquida",
        "Aplicando 30% — R$ 4.500 × 30% = R$ 1.350 (R$ 675 por filho)",
        "Despesas comprovadas do filho (escola R$ 800, saúde R$ 200 = R$ 1.000) — o juiz pode confirmar R$ 1.350 como suficiente",
        "Se o pai for autônomo (sem holerite), o juiz pode fixar em salários mínimos — usualmente 1 a 2 salários mínimos por filho"
      ],
      resultado:
        "R$ 1.350 mensais (30% da renda líquida), pagos via depósito em conta judicial ou direto à mãe."
    },
    observacoes: [
      "Pensão para 1 filho geralmente fica em 15% a 25%, dependendo da renda",
      "Pensão para 2 filhos fica em 25% a 35%",
      "Pensão para 3+ filhos pode chegar a 50% da renda líquida (limite informal)",
      "Pais autônomos têm pensão fixada em salário mínimo (1 a 2 SM por filho)"
    ],
    variacao_local:
      "A ação corre na Vara de Família da cidade onde mora o filho menor (princípio do melhor interesse). Em cidades pequenas, a Vara Cível única acumula. Em capitais, há varas especializadas com mediação obrigatória.",
    atualizado_em: "2026-05-22"
  },
  {
    slug: "horas-extras",
    titulo: "Horas extras — como calcular",
    area_slug: "trabalhista",
    resumo:
      "Cálculo do adicional de hora extra (50% mínimo, 100% em feriado/domingo), reflexos em férias, 13º e FGTS.",
    formula:
      "Valor da hora normal × adicional (1,5 para hora extra comum, 2 para feriado/domingo). Reflete em férias (+1/3), 13º e FGTS.",
    precisa_ter: [
      "Espelho de ponto (cartões ou registro eletrônico)",
      "Contracheque com a base salarial",
      "Cálculo da jornada contratual (40h, 44h, 36h)"
    ],
    exemplo: {
      cenario:
        "Salário R$ 2.200. Jornada 44h/semana (R$ 10 por hora). Trabalhou 20 horas extras no mês em dias úteis.",
      passos: [
        "Valor hora normal — R$ 2.200 / 220h mensais = R$ 10",
        "Hora extra comum — R$ 10 × 1,5 = R$ 15",
        "20 horas × R$ 15 = R$ 300 em horas extras",
        "Reflexos — DSR (descanso semanal remunerado, ~20% das HE) = R$ 60",
        "Total no mês — R$ 300 + R$ 60 = R$ 360"
      ],
      resultado:
        "R$ 360 mensais em horas extras + reflexos. Sobre esse valor incide ainda FGTS e proporcionais (férias, 13º)."
    },
    observacoes: [
      "Hora extra em feriado ou domingo é 100% (adicional de 100%)",
      "Hora extra noturna — adicional de 50% + adicional noturno (20%)",
      "Banco de horas só vale se previsto em convenção coletiva",
      "Sumula 437 do TST — DSR sobre horas extras é devido"
    ],
    variacao_local:
      "Cálculo nacional. A ação corre na Vara do Trabalho da cidade onde foi prestado o serviço (não da sede da empresa, geralmente). Em municípios sem Vara do Trabalho própria, vai pra cidade-sede da circunscrição.",
    atualizado_em: "2026-05-22"
  },
  {
    slug: "aposentadoria-tempo-contribuicao",
    titulo: "Aposentadoria por tempo de contribuição — regras de transição",
    area_slug: "previdenciario",
    resumo:
      "Regras de transição da EC 103/2019 — pedágio 50%, pedágio 100%, regra dos pontos, idade mínima progressiva.",
    formula:
      "Tempo de contribuição (mulher 30 anos, homem 35 anos) ATÉ 13/11/2019. Após, regras de transição com idade mínima crescente e pontos (soma de idade + tempo de contribuição).",
    precisa_ter: [
      "CNIS (Cadastro Nacional de Informações Sociais) — Meu INSS",
      "CTPS e contracheques antigos para comprovar vínculos não constantes do CNIS",
      "Carnê de contribuição (autônomos, MEIs)",
      "Documentos de regime próprio (servidor público)"
    ],
    exemplo: {
      cenario:
        "Mulher com 56 anos em 2026, 32 anos de contribuição. Já tinha 26 anos contribuídos em 13/11/2019.",
      passos: [
        "Regra da idade mínima progressiva — em 2026, mulher precisa de 58,5 anos e 30 de contribuição. Ela tem 56 anos = não atende",
        "Regra dos pontos — em 2026, mulher precisa de 91 pontos (idade + tempo). Ela tem 56 + 32 = 88 pontos = não atende",
        "Pedágio 50% — em 2019, ela tinha 26 anos de contribuição, faltavam 4 anos pra completar 30. Pedágio = 4 × 1,5 = 6 anos. Precisa contribuir até completar 26 + 6 = 32 anos. JÁ ATENDE",
        "Cálculo do benefício — média salarial × (60% + 2% por ano que exceder 15 anos no caso de mulher) — 32 anos = 60% + 34% = 94% da média"
      ],
      resultado:
        "Apta pelo pedágio 50%. Benefício de aproximadamente 94% da média dos salários (sem o redutor de 5% por ano antes da idade plena, no caso dela)."
    },
    observacoes: [
      "Regras de transição são complexas — vale fazer cálculo com advogado previdenciário",
      "Aposentadoria especial (insalubre, periculosa) tem regras próprias",
      "RPPS (servidor público) tem regras diferentes da iniciativa privada",
      "Revisão da vida toda (STF, RE 1276977) pode aumentar o benefício pra quem se aposentou após 1999"
    ],
    variacao_local:
      "O cálculo é nacional. Ação corre na Justiça Federal (Vara Previdenciária) — em cidades sem JF própria, ajuiza-se na cidade-sede da Subseção. Justiça gratuita é regra para hipossuficientes.",
    atualizado_em: "2026-05-22"
  },
  {
    slug: "ferias",
    titulo: "Férias — cálculo de aviso, abono pecuniário e indenização",
    area_slug: "trabalhista",
    resumo:
      "Como calcular o valor das férias (salário + 1/3), abono pecuniário (vender 1/3 das férias), férias indenizadas na rescisão.",
    formula:
      "Salário × (período/30) × 1,333 (adicional de 1/3). Período pode ser 30 dias (férias normais), 20 dias (se vendeu 1/3) ou proporcional.",
    precisa_ter: ["Contracheque com a base salarial", "Aviso de férias", "Período aquisitivo (12 meses anteriores)"],
    exemplo: {
      cenario: "Empregado com salário R$ 3.300, sai 30 dias de férias.",
      passos: [
        "Salário — R$ 3.300",
        "1/3 constitucional — R$ 3.300 / 3 = R$ 1.100",
        "Total das férias — R$ 3.300 + R$ 1.100 = R$ 4.400",
        "Se vender 10 dias (abono pecuniário) — recebe R$ 4.400 (10 dias trabalhados) + R$ 4.400 × (10/30) × 1,333 = R$ 1.955 (10 dias de férias vendidos) — total R$ 4.400 normal + R$ 1.955 do abono",
        "Pagamento até 2 dias antes do início das férias"
      ],
      resultado:
        "R$ 4.400 mensais das férias + R$ 1.955 se quiser vender 10 dias (abono pecuniário)."
    },
    observacoes: [
      "Pagamento das férias deve ocorrer até 2 dias antes do início — atraso gera direito a pagamento em dobro",
      "Abono pecuniário (vender 10 dias) — direito do empregado, até 1/3 do período de férias",
      "Férias indenizadas (na rescisão) seguem o mesmo cálculo, mas incidem FGTS e INSS",
      "Férias coletivas — empresa avisa com 15 dias e fraciona em até 2 períodos"
    ],
    variacao_local:
      "Nacional. Reclamação por atraso ou erro vai pra Vara do Trabalho da cidade da prestação do serviço.",
    atualizado_em: "2026-05-22"
  },
  {
    slug: "decimo-terceiro",
    titulo: "13º salário — cálculo e antecipação",
    area_slug: "trabalhista",
    resumo:
      "Como funciona o 13º — primeira parcela em novembro, segunda em dezembro, proporcional na rescisão.",
    formula:
      "Salário × (meses trabalhados no ano / 12). Quem trabalhou 15+ dias no mês conta o mês inteiro.",
    precisa_ter: ["Carteira de Trabalho com data de admissão", "Contracheque atual"],
    exemplo: {
      cenario:
        "Empregado admitido em 10/03/2026 com salário R$ 2.800. Recebe 13º em dezembro/2026.",
      passos: [
        "Meses trabalhados — março (entrou dia 10, tem mais de 15 dias = conta) até dezembro = 10 meses",
        "13º — R$ 2.800 × (10/12) = R$ 2.333",
        "Primeira parcela (até 30/11) — 50% = R$ 1.167",
        "Segunda parcela (até 20/12) — R$ 1.167 (com descontos de INSS e IRRF)"
      ],
      resultado: "R$ 2.333 (bruto). Líquido depende dos descontos previdenciários e fiscais."
    },
    observacoes: [
      "Primeira parcela — até 30 de novembro, sem descontos",
      "Segunda parcela — até 20 de dezembro, COM descontos (INSS + IRRF)",
      "Funcionária gestante recebe 13º proporcional durante a licença-maternidade",
      "Empregado afastado por doença há mais de 15 dias — recebe 13º calculado sobre o INSS, não sobre o salário"
    ],
    variacao_local:
      "Nacional. Atraso ou não pagamento dá direito a reclamação trabalhista na cidade da prestação do serviço, com adicionais.",
    atualizado_em: "2026-05-22"
  },
  {
    slug: "inventario-itcmd",
    titulo: "Inventário — cálculo do ITCMD e custas",
    area_slug: "familia",
    resumo:
      "Como calcular o imposto de transmissão (ITCMD) e as custas do inventário (extrajudicial ou judicial).",
    formula:
      "ITCMD = valor do patrimônio × alíquota estadual (2% a 8%, varia por UF). Custas cartoriais = tabela do TJ local + tarifas.",
    precisa_ter: [
      "Avaliação dos bens (imóveis, veículos, contas bancárias)",
      "Certidão de óbito do falecido",
      "Documentos dos herdeiros",
      "Lista de bens e dívidas"
    ],
    exemplo: {
      cenario:
        "Patrimônio total R$ 600.000 (1 imóvel R$ 500.000 + conta R$ 100.000). 3 herdeiros maiores em SP (alíquota 4%).",
      passos: [
        "ITCMD — R$ 600.000 × 4% = R$ 24.000 (pago pelos herdeiros antes da escritura)",
        "Custas cartoriais escritura pública — varia por UF, em torno de 1% do valor (em SP, R$ 6.000)",
        "Honorário advocatício — 3% a 6% do patrimônio = R$ 18.000 a R$ 36.000",
        "Total estimado — R$ 24.000 + R$ 6.000 + R$ 18.000 = R$ 48.000 (8% do patrimônio)"
      ],
      resultado: "Custo estimado entre R$ 48.000 e R$ 66.000, dependendo dos honorários negociados."
    },
    observacoes: [
      "ITCMD varia muito por estado — SP 4%, MG 5%, RJ 4,5%, RS de 3% a 6% conforme valor",
      "Inventário extrajudicial só com herdeiros maiores e em acordo",
      "Em SP, alíquota é progressiva pelo valor (até 1.500 UFESP é isento)",
      "Imóveis acima de R$ 200.000 podem ter avaliação contestada — pedido de retificação no cartório"
    ],
    variacao_local:
      "ITCMD muda por UF. Cada estado tem alíquota e regras próprias — consulta no site da Receita Estadual. Custas variam por TJ. Em capitais, há cartórios especializados em inventário.",
    atualizado_em: "2026-05-22"
  },
  {
    slug: "reajuste-aluguel",
    titulo: "Reajuste de aluguel — como calcular",
    area_slug: "imobiliario",
    resumo:
      "Como calcular o reajuste anual do aluguel pelo índice previsto no contrato (IGP-M, IPCA ou outro).",
    formula:
      "Novo aluguel = aluguel atual × (1 + variação acumulada do índice nos últimos 12 meses). O índice e a data-base são os do contrato; o reajuste é anual (Lei 8.245/91, art. 17 e seguintes).",
    precisa_ter: [
      "Contrato de locação (cláusula de reajuste e índice escolhido)",
      "Valor atual do aluguel",
      "Mês de aniversário do contrato (data-base do reajuste)",
      "Variação acumulada do índice em 12 meses (IGP-M na FGV; IPCA/INPC no IBGE)"
    ],
    exemplo: {
      cenario:
        "Aluguel atual de R$ 1.500, reajuste anual pelo IGP-M, que acumulou 4,5% nos últimos 12 meses.",
      passos: [
        "Fator de reajuste — 1 + 0,045 = 1,045",
        "Novo aluguel — R$ 1.500 × 1,045 = R$ 1.567,50",
        "Diferença mensal — R$ 67,50"
      ],
      resultado:
        "Novo aluguel de R$ 1.567,50 a partir do mês de aniversário do contrato."
    },
    observacoes: [
      "O reajuste só pode ocorrer uma vez por ano (periodicidade mínima de 12 meses)",
      "Se o índice ficar negativo, não há obrigação de reduzir o aluguel, mas o inquilino pode negociar",
      "Trocar o índice do contrato (ex.: de IGP-M para IPCA) exige acordo entre as partes",
      "Após 3 anos sem acordo sobre o valor, cabe ação revisional de aluguel (art. 19 da Lei 8.245/91)"
    ],
    variacao_local:
      "A Lei do Inquilinato é nacional. O que muda por cidade é a vara competente para ação revisional ou de despejo — em comarcas menores, a Vara Cível; em capitais, juizados ou varas especializadas.",
    atualizado_em: "2026-06-23"
  },
  {
    slug: "atualizacao-divida",
    titulo: "Atualização de dívida — correção, juros e multa",
    area_slug: "civil",
    resumo:
      "Como atualizar um valor devido somando correção monetária, juros de mora e multa contratual.",
    formula:
      "Valor atualizado = principal + correção monetária (pelo índice aplicável) + juros de mora + multa (se houver). Desde a Lei 14.905/2024, na falta de taxa pactuada, a correção segue o IPCA e os juros legais seguem a taxa Selic (deduzido o IPCA).",
    precisa_ter: [
      "Valor original da dívida",
      "Data de vencimento (ou da citação, conforme o caso)",
      "Índice de correção e taxa de juros previstos no contrato (se houver)",
      "Percentual de multa contratual ou moratória"
    ],
    exemplo: {
      cenario:
        "Dívida de R$ 1.000 vencida há 10 meses, com correção aproximada de 5%, juros de mora de 1% ao mês e multa de 2%.",
      passos: [
        "Correção monetária — R$ 1.000 × 5% = R$ 50",
        "Juros de mora — R$ 1.000 × 1% × 10 meses = R$ 100",
        "Multa — R$ 1.000 × 2% = R$ 20",
        "Total — R$ 1.000 + R$ 50 + R$ 100 + R$ 20 = R$ 1.170"
      ],
      resultado:
        "Dívida atualizada de aproximadamente R$ 1.170 (confirme o regime de juros e o índice aplicáveis à data)."
    },
    observacoes: [
      "Sem taxa pactuada, vale a Lei 14.905/2024: correção pelo IPCA e juros legais pela Selic (descontado o IPCA) — confirme o regime conforme a data da dívida",
      "Os juros de mora correm, em regra, a partir do vencimento (obrigação positiva e líquida) ou da citação",
      "A capitalização de juros (juros sobre juros) só vale se houver previsão expressa",
      "Em relações de consumo há limites — juros e multas abusivas podem ser revistos judicialmente"
    ],
    variacao_local:
      "As regras são nacionais (Código Civil). A cobrança judicial corre na comarca do devedor ou do foro de eleição do contrato — em valores menores, cabe o Juizado Especial Cível local.",
    atualizado_em: "2026-06-23"
  },
  {
    slug: "seguro-desemprego",
    titulo: "Seguro-desemprego — parcelas e valor",
    area_slug: "trabalhista",
    resumo:
      "Quantas parcelas e qual o valor do seguro-desemprego, conforme o tempo trabalhado e a média salarial.",
    formula:
      "O número de parcelas depende do tempo trabalhado e de quantas vezes o benefício já foi solicitado. O valor parte da média dos 3 últimos salários, aplicada às faixas atualizadas a cada ano pelo Ministério do Trabalho, respeitando o piso de 1 salário mínimo e um teto.",
    precisa_ter: [
      "Termo de rescisão (TRCT) e comprovante de dispensa sem justa causa",
      "Os 3 últimos contracheques",
      "Carteira de Trabalho Digital (app gov.br)",
      "Requerimento do seguro-desemprego (gov.br ou app Carteira de Trabalho Digital)"
    ],
    exemplo: {
      cenario:
        "Trabalhador dispensado sem justa causa na 1ª solicitação, com 20 meses trabalhados e média salarial de R$ 2.000.",
      passos: [
        "Parcelas (1ª solicitação) — 4 parcelas para quem trabalhou de 12 a 23 meses; 5 parcelas para 24 meses ou mais",
        "Como trabalhou 20 meses — 4 parcelas",
        "Valor — aplica-se a média salarial à tabela de faixas vigente do ano, com piso de 1 salário mínimo"
      ],
      resultado:
        "4 parcelas, com valor calculado pela tabela vigente — confirme as faixas atualizadas do ano no portal gov.br."
    },
    observacoes: [
      "As faixas e os valores são reajustados todo ano — sempre confira a tabela vigente no gov.br",
      "Prazo para requerer — em regra de 7 a 120 dias após a dispensa",
      "Não cabe em pedido de demissão nem em dispensa por justa causa",
      "Receber outra renda própria suficiente para o sustento pode impedir o benefício"
    ],
    variacao_local:
      "É um programa federal, sem variação de valor por cidade. O requerimento é online (gov.br) ou presencial no posto do SINE/atendimento do trabalhador da região.",
    atualizado_em: "2026-06-23"
  },
  {
    slug: "danos-morais",
    titulo: "Dano moral — como o valor é fixado",
    area_slug: "civil",
    resumo:
      "Como os tribunais calculam a indenização por dano moral — não há tabela fixa, mas há método e parâmetros.",
    formula:
      "Não existe tabela única. O juiz fixa o valor olhando a gravidade do dano, a repercussão, a capacidade econômica das partes e o caráter pedagógico. O STJ usa o método bifásico: (1) valor-base a partir de precedentes para casos semelhantes; (2) ajuste para mais ou menos conforme as circunstâncias do caso.",
    precisa_ter: [
      "Provas do dano (documentos, prints, testemunhas)",
      "Comprovação da conduta do ofensor",
      "Registro do impacto sofrido (negativação, exposição, abalo)",
      "Histórico de casos parecidos no tribunal local, se houver"
    ],
    exemplo: {
      cenario:
        "Negativação indevida no SPC/Serasa por dívida já paga, sem outras negativações legítimas.",
      passos: [
        "Verifica-se a Súmula 385 do STJ — havendo negativação legítima anterior, não cabe indenização",
        "Valor-base (1ª fase) — em negativação indevida, faixas comuns ficam entre R$ 5.000 e R$ 15.000",
        "Ajuste (2ª fase) — sobe ou desce conforme tempo da negativação, reincidência e porte do ofensor"
      ],
      resultado:
        "Indenização normalmente entre R$ 5.000 e R$ 15.000 nesse tipo de caso — varia muito conforme o tribunal e as provas."
    },
    observacoes: [
      "Súmula 385 do STJ — negativação indevida não gera dano moral se já existia outra negativação legítima",
      "O método bifásico foi consolidado pelo STJ (REsp 1.152.541)",
      "O valor não pode gerar enriquecimento sem causa nem ser irrisório",
      "Dano moral pode coexistir com dano material (prejuízo financeiro comprovado)"
    ],
    variacao_local:
      "Os parâmetros são nacionais (STJ), mas o valor concreto varia por tribunal e por juízo. Em causas menores, o Juizado Especial Cível da comarca julga sem custas iniciais até certo limite.",
    atualizado_em: "2026-06-23"
  },
  {
    slug: "revisao-beneficio-inss",
    titulo: "Revisão de benefício do INSS — quando cabe",
    area_slug: "previdenciario",
    resumo:
      "Quando é possível revisar o valor da aposentadoria ou benefício e qual o prazo para pedir.",
    formula:
      "A revisão recalcula o benefício quando houve erro ou omissão no cálculo original — salários de contribuição não considerados, atividade especial não reconhecida ou índice de correção errado. O pedido tem prazo decadencial de 10 anos, contados do mês seguinte ao primeiro pagamento.",
    precisa_ter: [
      "Carta de concessão do benefício",
      "CNIS (extrato de contribuições) atualizado",
      "Comprovantes de salários e vínculos",
      "Documentos de atividade especial, se for o caso (PPP, laudos)"
    ],
    exemplo: {
      cenario:
        "Aposentado percebe que períodos com exposição a agente nocivo não foram contados como tempo especial.",
      passos: [
        "Confere a carta de concessão e o CNIS",
        "Reúne PPP/LTCAT que comprovem a atividade especial",
        "Recalcula incluindo a conversão do tempo especial",
        "Verifica o prazo — a revisão deve ser pedida em até 10 anos do início do benefício"
      ],
      resultado:
        "Confirmado o erro e dentro do prazo, o benefício pode ser recalculado para valor maior, com diferenças retroativas (respeitada a prescrição das parcelas)."
    },
    observacoes: [
      "Prazo decadencial de 10 anos para revisar o ato de concessão",
      "As parcelas atrasadas prescrevem em 5 anos (recebe só os últimos 5 anos de diferença)",
      "A 'revisão da vida toda' foi afastada pelo STF em 2024 — confirme a tese aplicável ao seu caso",
      "A revisão pode ser administrativa (no próprio INSS) antes da via judicial"
    ],
    variacao_local:
      "As regras são federais. A ação corre na Justiça Federal ou nos Juizados Especiais Federais da região — em comarcas sem vara federal, há competência delegada à Justiça estadual em alguns casos.",
    atualizado_em: "2026-06-23"
  },
  {
    slug: "custas-processuais",
    titulo: "Custas processuais — quanto custa entrar com uma ação",
    area_slug: "civil",
    resumo:
      "Como estimar as custas iniciais de um processo e quando é possível pedir gratuidade de justiça.",
    formula:
      "As custas variam por tribunal (tabela do TJ de cada estado ou da Justiça Federal). Em regra, ficam entre 1% e 2% do valor da causa, com um valor mínimo e um teto. Quem não pode pagar sem prejuízo do próprio sustento tem direito à gratuidade de justiça (art. 98 do CPC).",
    precisa_ter: [
      "Valor da causa definido",
      "Tabela de custas do tribunal competente",
      "Comprovação de renda (se for pedir gratuidade)",
      "Tipo de ação (alguns ritos são isentos, como o Juizado até certo limite)"
    ],
    exemplo: {
      cenario:
        "Ação de cobrança com valor da causa de R$ 50.000 em um TJ que cobra 1% de custas iniciais.",
      passos: [
        "Custas iniciais — R$ 50.000 × 1% = R$ 500 (respeitado o mínimo e o teto do tribunal)",
        "Acrescentam-se taxa de mandato, diligências de oficial de justiça e, ao final, custas finais",
        "Sem condição de pagar, pede-se gratuidade de justiça já na petição inicial"
      ],
      resultado:
        "Custas iniciais em torno de R$ 500 nesse exemplo — confira a tabela do tribunal, pois cada estado tem percentuais, mínimos e tetos próprios."
    },
    observacoes: [
      "No Juizado Especial, em regra não há custas iniciais (1º grau gratuito até o limite legal)",
      "A gratuidade de justiça pode ser total ou parcial (art. 98, §5º, do CPC)",
      "O vencido paga as custas e os honorários de sucumbência ao final",
      "Custas iniciais não recolhidas podem levar ao cancelamento da distribuição (art. 290 do CPC)"
    ],
    variacao_local:
      "As tabelas mudam por tribunal — cada TJ publica a sua e a Justiça Federal tem regra própria. Em capitais há mais varas e distribuição eletrônica; no interior, a vara única acumula competências.",
    atualizado_em: "2026-06-23"
  }
];

export const CALCULADORA_SLUGS = CALCULADORAS.map((c) => c.slug);

export function findCalculadora(slug: string): Calculadora | undefined {
  return CALCULADORAS.find((c) => c.slug === slug);
}

export function relatedCalculadoras(slug: string, limit = 4): Calculadora[] {
  const me = findCalculadora(slug);
  if (!me) return CALCULADORAS.slice(0, limit);
  return CALCULADORAS.filter((c) => c.slug !== slug && c.area_slug === me.area_slug).slice(
    0,
    limit
  );
}
