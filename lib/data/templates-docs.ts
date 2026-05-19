/**
 * Biblioteca de 20 modelos extrajudiciais gratuitos — Maio/2026.
 *
 * Cada modelo é uma minuta editável em texto plano, baseada em redação
 * tradicionalmente usada no Brasil. NÃO substitui revisão de advogado,
 * mas resolve a maior parte dos casos cotidianos do cidadão comum.
 *
 * O usuário baixa o .txt (ou copia direto da página) preenche as lacunas
 * marcadas com [COLCHETES], imprime, assina, reconhece firma quando exigido.
 *
 * Estrutura:
 *   - Slug em kebab-case, único, usado na URL.
 *   - Title curto, focado em SEO.
 *   - Description = lead da página + meta description.
 *   - LegalBase = lei/artigo principal que sustenta o documento.
 *   - WhenToUse = lista de 2-4 situações típicas.
 *   - HowToFill = lista de instruções de preenchimento.
 *   - Content = corpo do documento (template em texto, com [PLACEHOLDERS]).
 *   - Notes = avisos importantes (firma, validade, prazos).
 *
 * Captura de email opcional via formulário no rodapé (TemplateDownloadForm
 * em components/TemplateDownloadForm.tsx). Envia para /api/templates/lead.
 */

export type Template = {
  slug: string;
  title: string;
  category:
    | "Procurações"
    | "Contratos"
    | "Recibos e quitações"
    | "Declarações"
    | "Notificações"
    | "Autorizações";
  description: string;
  legalBase: string;
  whenToUse: string[];
  howToFill: string[];
  /** Conteúdo em texto plano, com placeholders [CAMPO]. */
  content: string;
  /** Avisos finais sobre validade, firma, registro etc. */
  notes: string[];
  /** Estimado em minutos pra preencher. */
  fillingMinutes: number;
};

export const TEMPLATES: Template[] = [
  // 1
  {
    slug: "procuracao-particular-geral",
    title: "Procuração particular para fins gerais",
    category: "Procurações",
    description:
      "Modelo de procuração particular para representar você em atos administrativos do dia a dia — bancos, repartições, cartórios, recebimento de documentos.",
    legalBase: "Código Civil, arts. 653 a 692 (Mandato).",
    fillingMinutes: 5,
    whenToUse: [
      "Para alguém retirar documento em repartição por você",
      "Para representar em assembleia de condomínio",
      "Para resolver pendência bancária quando estiver impossibilitado",
      "Para qualquer ato administrativo simples sem necessidade de poderes especiais"
    ],
    howToFill: [
      "Preencha os dados completos do outorgante (você) e do outorgado (a pessoa que vai representar)",
      "Liste os poderes de forma específica (ex: 'retirar carteira de motorista no Detran/MG')",
      "Defina prazo de validade — se não definir, vale por 1 ano (art. 686 do CC) ou até a revogação",
      "Assine e reconheça firma em cartório se a repartição exigir (em geral exigem)"
    ],
    content: `PROCURAÇÃO PARTICULAR

OUTORGANTE: [NOME COMPLETO DO OUTORGANTE], [nacionalidade], [estado civil], [profissão], portador da Cédula de Identidade RG nº [00.000.000] [órgão emissor]/[UF], inscrito no CPF/MF sob o nº [000.000.000-00], residente e domiciliado à [endereço completo, com bairro, CEP, cidade e UF].

OUTORGADO: [NOME COMPLETO DO OUTORGADO], [nacionalidade], [estado civil], [profissão], portador da Cédula de Identidade RG nº [00.000.000] [órgão emissor]/[UF], inscrito no CPF/MF sob o nº [000.000.000-00], residente e domiciliado à [endereço completo].

PODERES: Pelo presente instrumento de procuração particular, o OUTORGANTE nomeia e constitui o OUTORGADO seu bastante procurador, conferindo-lhe os poderes da cláusula "ad negotia" para o fim específico de [DESCREVER OS ATOS ESPECÍFICOS, exemplo: "retirar a Carteira Nacional de Habilitação (CNH) renovada junto ao DETRAN/MG, podendo assinar documentos relacionados, prestar declarações e recolher taxas necessárias"], podendo praticar todos os atos necessários ao bom e fiel cumprimento do presente mandato.

PRAZO DE VALIDADE: A presente procuração terá validade pelo prazo de [PRAZO, ex: "180 (cento e oitenta) dias"] a contar da data de sua assinatura, podendo ser revogada a qualquer momento pelo outorgante mediante comunicação por escrito.

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_____________________________________
[NOME COMPLETO DO OUTORGANTE]
CPF: [000.000.000-00]
`,
    notes: [
      "Reconhecer firma do outorgante em cartório quando a repartição exigir (em regra exigem para atos com órgãos públicos)",
      "Para movimentar conta bancária, transferir bens ou vender imóveis, exige procuração PÚBLICA (feita em cartório de notas), não particular"
    ]
  },
  // 2
  {
    slug: "contrato-de-locacao-residencial-simples",
    title: "Contrato de locação residencial simples",
    category: "Contratos",
    description:
      "Modelo enxuto de contrato de aluguel residencial com garantia (fiador, caução ou seguro-fiança), reajuste por IGP-M/IPCA e cláusula de multa por descumprimento.",
    legalBase: "Lei 8.245/91 (Lei do Inquilinato), arts. 1 a 90.",
    fillingMinutes: 12,
    whenToUse: [
      "Quando você alugar um imóvel residencial diretamente (sem imobiliária)",
      "Para sublocação devidamente autorizada pelo locador original",
      "Para locação por temporada superior a 90 dias"
    ],
    howToFill: [
      "Preencha os dados completos de locador (proprietário) e locatário (inquilino)",
      "Descreva o imóvel com endereço exato, área aproximada, descrição interna (cômodos)",
      "Defina o valor do aluguel mensal e o índice de reajuste anual (IGP-M ou IPCA, escolha um)",
      "Escolha a garantia: fiador (mais comum), caução em dinheiro (até 3 meses), título capitalização ou seguro-fiança",
      "Anexe vistoria de entrada com fotos do imóvel"
    ],
    content: `CONTRATO DE LOCAÇÃO RESIDENCIAL

LOCADOR: [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], portador da Cédula de Identidade RG nº [00.000.000] [órgão emissor]/[UF], residente e domiciliado à [endereço completo].

LOCATÁRIO: [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], portador da Cédula de Identidade RG nº [00.000.000] [órgão emissor]/[UF], residente e domiciliado à [endereço completo].

FIADOR (se aplicável): [NOME COMPLETO E QUALIFICAÇÃO COMPLETA, incluindo dados do cônjuge se casado].

As partes acima qualificadas têm entre si justo e acertado o presente Contrato de Locação Residencial, que se regerá pela Lei nº 8.245/91 e pelas cláusulas seguintes:

CLÁUSULA 1ª — OBJETO. O LOCADOR cede em locação ao LOCATÁRIO o imóvel residencial situado à [endereço completo do imóvel locado], com [DESCRIÇÃO: ex: "área útil aproximada de 80m², composto por 2 quartos, sala, cozinha, banheiro e área de serviço"].

CLÁUSULA 2ª — PRAZO. O prazo da locação é de [PRAZO, ex: "30 (trinta) meses"], com início em [DD/MM/AAAA] e término em [DD/MM/AAAA]. Findo o prazo, na ausência de oposição, a locação se prorrogará por prazo indeterminado.

CLÁUSULA 3ª — ALUGUEL. O aluguel mensal é de R$ [VALOR] ([valor por extenso]), a ser pago até o dia [DIA] de cada mês, mediante depósito/transferência na conta bancária do LOCADOR: [BANCO], agência [AGÊNCIA], conta corrente [CONTA], em nome de [NOME].

CLÁUSULA 4ª — REAJUSTE. O aluguel será reajustado anualmente, na data de aniversário do contrato, pela variação do [ÍNDICE: "IGP-M" ou "IPCA"] acumulado nos 12 meses anteriores.

CLÁUSULA 5ª — ENCARGOS. Ficam a cargo do LOCATÁRIO o pagamento de: água, luz, gás, telefone, internet, IPTU (em regra), taxa de condomínio (em regra) e demais despesas ordinárias de consumo. As despesas extraordinárias (obras estruturais, pintura externa, fundo de reserva) ficam por conta do LOCADOR.

CLÁUSULA 6ª — GARANTIA. Para garantia das obrigações deste contrato, o LOCATÁRIO oferece [ESCOLHA: "(a) fiança prestada por [NOME DO FIADOR], devidamente qualificado acima e que firma este contrato em solidariedade às obrigações do LOCATÁRIO" / "(b) caução em dinheiro no valor de R$ [VALOR], equivalente a 3 aluguéis, depositada em poupança nominal" / "(c) seguro-fiança contratado junto à [SEGURADORA], apólice nº [NÚMERO]"].

CLÁUSULA 7ª — VISTORIA. O imóvel é entregue ao LOCATÁRIO no estado descrito em laudo de vistoria de entrada, parte integrante deste contrato. Ao final da locação, o imóvel deve ser devolvido no mesmo estado, salvo desgaste natural pelo uso.

CLÁUSULA 8ª — MULTA POR DESCUMPRIMENTO. O descumprimento de qualquer cláusula deste contrato implicará multa equivalente a 3 (três) aluguéis vigentes, sem prejuízo da rescisão e cobrança de eventuais perdas e danos.

CLÁUSULA 9ª — RESCISÃO ANTECIPADA. Caso o LOCATÁRIO devolva o imóvel antes do prazo, pagará multa proporcional ao tempo restante, calculada na forma do art. 4º da Lei 8.245/91.

CLÁUSULA 10ª — FORO. Fica eleito o foro da Comarca de [CIDADE]/[UF] para dirimir quaisquer dúvidas oriundas deste contrato.

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_______________________________
LOCADOR

_______________________________
LOCATÁRIO

_______________________________
FIADOR (se houver)

TESTEMUNHAS:

1. _________________________ Nome: _________________ CPF: _________________
2. _________________________ Nome: _________________ CPF: _________________
`,
    notes: [
      "Reconhecimento de firma no cartório é recomendado, especialmente para o fiador",
      "Vistoria de entrada com fotos datadas é essencial — protege ambas as partes",
      "Caso a garantia seja caução, deposite em poupança nominal — assim ela rende para o inquilino"
    ]
  },
  // 3
  {
    slug: "distrato-contrato-locacao",
    title: "Distrato de contrato de locação",
    category: "Contratos",
    description:
      "Modelo de distrato amigável de contrato de aluguel, com devolução do imóvel, quitação mútua e liberação do fiador.",
    legalBase: "Código Civil, art. 472 (resilição bilateral) e Lei 8.245/91, art. 9º, I.",
    fillingMinutes: 7,
    whenToUse: [
      "Quando locador e locatário decidem encerrar o contrato antes do prazo",
      "Para regularizar a devolução do imóvel sem ação de despejo",
      "Para liberar formalmente o fiador da garantia prestada"
    ],
    howToFill: [
      "Preencha dados de locador, locatário e (se houver) fiador, conforme o contrato original",
      "Indique a data exata da devolução das chaves e a contagem final de aluguel pro-rata",
      "Liste pendências quitadas (IPTU, condomínio, contas de consumo)",
      "Anexe vistoria de saída com fotos do imóvel devolvido"
    ],
    content: `DISTRATO DE CONTRATO DE LOCAÇÃO

LOCADOR: [NOME], CPF [000.000.000-00], residente à [endereço].

LOCATÁRIO: [NOME], CPF [000.000.000-00], residente à [endereço].

FIADOR (se houver): [NOME], CPF [000.000.000-00].

As partes acima qualificadas, na melhor forma de direito, têm justo e contratado o presente DISTRATO DE CONTRATO DE LOCAÇÃO, nos seguintes termos:

CONSIDERANDO que celebraram em [DATA DO CONTRATO ORIGINAL] o Contrato de Locação Residencial referente ao imóvel sito à [endereço do imóvel];

CONSIDERANDO que ambas as partes desejam pôr fim à locação de forma amigável;

CLÁUSULA 1ª — Pelo presente instrumento, as partes dão por rescindido, de comum acordo, o referido Contrato de Locação, com efeitos a partir desta data.

CLÁUSULA 2ª — A entrega das chaves ocorre nesta data, [DD/MM/AAAA], às [HH:MM], conforme vistoria de saída anexa.

CLÁUSULA 3ª — O LOCATÁRIO declara que pagou e quitou todos os aluguéis, encargos (IPTU pro-rata, condomínio, água, luz, gás, telefone e demais contas de consumo) até a data de hoje, conforme comprovantes anexos. O LOCADOR confere a quitação e nada mais terá a reclamar a esse título.

CLÁUSULA 4ª — Verificadas as condições do imóvel no laudo de vistoria de saída, [ESCOLHA: "(a) o imóvel foi entregue em perfeito estado, sem necessidade de reparos" / "(b) o LOCATÁRIO concorda em arcar com R$ [VALOR] para os reparos descritos na vistoria, valor pago nesta data"].

CLÁUSULA 5ª — Em virtude do encerramento da locação, o LOCADOR libera o FIADOR de todas as obrigações decorrentes do contrato original.

CLÁUSULA 6ª — As partes outorgam-se reciprocamente, plena e geral quitação relativa ao Contrato de Locação ora distratado, nada mais tendo a reclamar uma da outra a qualquer título.

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_______________________________
LOCADOR

_______________________________
LOCATÁRIO

_______________________________
FIADOR (se houver)
`,
    notes: [
      "O distrato encerra o contrato — não pode ser revertido depois",
      "Vistoria de saída com fotos é prova essencial em caso de futuro questionamento",
      "Recomenda-se reconhecer firma das assinaturas para fortalecer o documento"
    ]
  },
  // 4
  {
    slug: "recibo-pagamento-quitacao",
    title: "Recibo de pagamento com quitação",
    category: "Recibos e quitações",
    description:
      "Recibo simples que comprova pagamento entre pessoas físicas, com cláusula de quitação plena para evitar cobrança futura.",
    legalBase: "Código Civil, arts. 320 a 326 (quitação).",
    fillingMinutes: 3,
    whenToUse: [
      "Pagamento de dívida entre pessoas físicas",
      "Quitação parcial ou total de empréstimo informal",
      "Comprovante de pagamento em prestação de serviço sem nota fiscal",
      "Reembolso entre amigos, familiares, colegas"
    ],
    howToFill: [
      "Identifique quem paga (devedor) e quem recebe (credor) com CPF e endereço",
      "Especifique o valor e a forma de pagamento (Pix, dinheiro, transferência, cheque)",
      "Descreva claramente o motivo do pagamento e a referência (data do serviço, número do contrato etc.)",
      "Se for quitação total, escreva isso de forma explícita"
    ],
    content: `RECIBO DE PAGAMENTO

Eu, [NOME COMPLETO DE QUEM RECEBE], [nacionalidade], [estado civil], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], residente à [endereço completo], DECLARO ter recebido de [NOME COMPLETO DE QUEM PAGA], inscrito no CPF/MF sob o nº [000.000.000-00], residente à [endereço], a importância de R$ [VALOR] ([valor por extenso]), pagos em [FORMA: "Pix", "dinheiro", "transferência bancária", "cheque nº [NÚMERO] do [BANCO]"], referente a [DESCRIÇÃO DO MOTIVO: ex: "quitação integral do empréstimo realizado em [DATA] no valor de R$ [VALOR ORIGINAL], conforme acordo verbal"; ou "pagamento da reforma do banheiro do imóvel localizado à [endereço], conforme orçamento aprovado em [DATA]"].

Para maior clareza, declaro que com o pagamento ora recebido fica [ESCOLHA: "INTEGRALMENTE QUITADA" / "PARCIALMENTE QUITADA, restando saldo devedor de R$ [VALOR REMANESCENTE]"] a obrigação acima descrita, nada mais tendo a reclamar do pagador a esse título, dando-lhe plena, rasa e geral quitação.

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_____________________________________
[NOME COMPLETO]
CPF: [000.000.000-00]

TESTEMUNHAS (opcional, recomendado para valores acima de R$ 5.000):

1. _________________________ Nome: _________________ CPF: _________________
2. _________________________ Nome: _________________ CPF: _________________
`,
    notes: [
      "Quitação plena impede cobrança posterior do mesmo valor — leia com atenção antes de assinar",
      "Para valores significativos (acima de R$ 5.000), recomenda-se reconhecer firma",
      "Mantenha o original — uma cópia para cada parte"
    ]
  },
  // 5
  {
    slug: "declaracao-de-domicilio-residencia",
    title: "Declaração de residência (próprio uso)",
    category: "Declarações",
    description:
      "Declaração que comprova endereço residencial quando você não tem conta de luz, água ou outro comprovante em seu nome.",
    legalBase: "Lei 7.115/83 — Declaração de hipossuficiência e residência.",
    fillingMinutes: 3,
    whenToUse: [
      "Quando não tem conta em seu nome (mora com pais, parentes, em república)",
      "Para abrir conta bancária, transferir documentos, matrícula em escola",
      "Para se inscrever no SUS, programas sociais, processos seletivos"
    ],
    howToFill: [
      "Preencha seus dados completos (nome, RG, CPF, estado civil)",
      "Indique exatamente o endereço onde reside",
      "Indique há quanto tempo reside ali",
      "Cite documento da pessoa cuja conta comprova esse endereço (opcional, mas fortalece)"
    ],
    content: `DECLARAÇÃO DE RESIDÊNCIA

Eu, [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], portador da Cédula de Identidade RG nº [00.000.000] [órgão emissor]/[UF], inscrito no CPF/MF sob o nº [000.000.000-00], DECLARO, sob as penas da lei, para os devidos fins, que sou residente e domiciliado no endereço [ENDEREÇO COMPLETO COM BAIRRO, CEP, CIDADE, UF], onde resido há [TEMPO, ex: "2 anos e 6 meses"].

[OPCIONAL] Declaro ainda que o referido endereço figura em contas de consumo (energia elétrica/conta de telefone/conta de água) em nome de [NOME DO TITULAR DAS CONTAS, exemplo: meu pai/minha mãe/proprietário do imóvel onde resido], CPF [000.000.000-00], pessoa com quem mantenho [RELAÇÃO: "vínculo familiar"/"locação"/"hospedagem"], podendo este endereço ser confirmado a qualquer momento.

Estou ciente de que prestar declaração falsa configura o crime previsto no art. 299 do Código Penal (falsidade ideológica) e nos arts. 2º e 3º da Lei nº 7.115/1983.

Por ser expressão da verdade, firmo a presente declaração para os fins de [FINALIDADE, exemplo: "comprovação de residência junto à Caixa Econômica Federal para abertura de conta"].

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_____________________________________
[NOME COMPLETO]
CPF: [000.000.000-00]
RG: [00.000.000] [órgão emissor]/[UF]
`,
    notes: [
      "Falsidade nessa declaração é crime — só preencha com informação verdadeira",
      "Para alguns órgãos basta declaração simples; outros exigem reconhecimento de firma",
      "Tenha em mãos um comprovante recente (conta de luz) do titular indicado, para apresentação junto se solicitado"
    ]
  },
  // 6
  {
    slug: "autorizacao-viagem-menor-nacional",
    title: "Autorização de viagem para menor (nacional)",
    category: "Autorizações",
    description:
      "Autorização para criança ou adolescente viajar dentro do Brasil acompanhado de outra pessoa (avós, tios, terceiros) ou desacompanhado.",
    legalBase: "ECA (Lei 8.069/90), arts. 83 e 84; Resolução 295/2019 do CNJ.",
    fillingMinutes: 5,
    whenToUse: [
      "Menor de 16 anos viajando sem os pais, dentro do Brasil",
      "Viagem com avós, tios ou outros parentes acompanhantes",
      "Viagem em excursão escolar, religiosa ou esportiva"
    ],
    howToFill: [
      "Preencha dados de ambos os pais (ou responsável legal)",
      "Identifique a criança/adolescente com nome, data de nascimento, RG",
      "Identifique a pessoa que acompanha (se houver) com CPF e endereço",
      "Indique destino, datas de ida e volta, meio de transporte",
      "Reconheça firma de ambos os pais em cartório"
    ],
    content: `AUTORIZAÇÃO DE VIAGEM PARA MENOR

Nós abaixo assinados,

PAI: [NOME COMPLETO DO PAI], [nacionalidade], [estado civil], [profissão], CPF nº [000.000.000-00], RG nº [00.000.000] [órgão]/[UF], residente à [endereço completo];

MÃE: [NOME COMPLETO DA MÃE], [nacionalidade], [estado civil], [profissão], CPF nº [000.000.000-00], RG nº [00.000.000] [órgão]/[UF], residente à [endereço completo];

na qualidade de pais e responsáveis legais do menor [NOME COMPLETO DA CRIANÇA OU ADOLESCENTE], nascido em [DD/MM/AAAA], natural de [CIDADE]/[UF], inscrito no CPF nº [000.000.000-00] (se tiver) e portador do RG nº [00.000.000] [órgão]/[UF] (se tiver), AUTORIZAMOS expressamente o referido menor a:

VIAJAR pelo território nacional brasileiro, com destino a [CIDADE/UF DE DESTINO], no período compreendido entre [DATA DE IDA] e [DATA DE VOLTA], utilizando-se de [MEIO DE TRANSPORTE: "avião", "ônibus rodoviário", "carro particular"].

ACOMPANHAMENTO: [ESCOLHA UMA OPÇÃO:]
( ) Acompanhado pelo Sr.(a) [NOME DO ACOMPANHANTE], CPF [000.000.000-00], residente à [endereço], que tem nossa total confiança;
( ) Desacompanhado, em viagem [ESCOLA: "escolar promovida por [NOME DA INSTITUIÇÃO]" ou "individual"];
( ) Acompanhado pelo grupo organizado por [NOME DA ENTIDADE/ESCOLA/IGREJA/CLUBE], sob a responsabilidade do(a) Sr.(a) [NOME DO LÍDER RESPONSÁVEL], CPF [000.000.000-00].

A presente autorização tem validade exclusivamente para a viagem acima descrita e o período correspondente.

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_____________________________________
PAI - [NOME COMPLETO]

_____________________________________
MÃE - [NOME COMPLETO]
`,
    notes: [
      "Reconhecimento de firma de ambos os pais em cartório é OBRIGATÓRIO para essa autorização",
      "Apresente o documento junto com cópia do RG dos pais no embarque",
      "Para viagem ao exterior, exige autorização específica seguindo modelo do CNJ (Resolução 295/2019)",
      "Se apenas um dos pais detém a guarda, é necessário juntar cópia da sentença que comprova a guarda"
    ]
  },
  // 7
  {
    slug: "contrato-prestacao-de-servicos",
    title: "Contrato de prestação de serviços (autônomo)",
    category: "Contratos",
    description:
      "Contrato básico entre tomador e prestador de serviços autônomo (pessoa física), com objeto, valor, prazo e forma de pagamento bem definidos.",
    legalBase: "Código Civil, arts. 593 a 609 (Prestação de Serviço).",
    fillingMinutes: 10,
    whenToUse: [
      "Contratação de pintor, eletricista, encanador, marceneiro autônomo",
      "Serviços de TI, design, redação, consultoria de profissional liberal",
      "Reformas em casa, festas, eventos pontuais"
    ],
    howToFill: [
      "Identifique tomador e prestador com qualificação completa",
      "Descreva o serviço com o máximo de detalhe (escopo, prazos parciais, entregáveis)",
      "Defina valor, forma e cronograma de pagamento",
      "Estabeleça quem fornece materiais e equipamentos",
      "Inclua cláusula de garantia técnica quando aplicável"
    ],
    content: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS

CONTRATANTE: [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], CPF [000.000.000-00], RG [00.000.000] [órgão]/[UF], residente à [endereço completo].

CONTRATADO: [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], CPF [000.000.000-00], RG [00.000.000] [órgão]/[UF], residente à [endereço completo].

As partes têm justo e contratado o presente Contrato de Prestação de Serviços, regido pelos arts. 593 a 609 do Código Civil e pelas cláusulas seguintes:

CLÁUSULA 1ª — OBJETO. O CONTRATADO se obriga a prestar ao CONTRATANTE os seguintes serviços: [DESCRIÇÃO DETALHADA DO SERVIÇO, exemplo: "pintura completa da residência localizada à [endereço], incluindo paredes internas, tetos e portas, com tinta acrílica branca fosca de marca a ser combinada".

CLÁUSULA 2ª — PRAZO. Os serviços terão início em [DATA] e deverão estar concluídos até [DATA LIMITE], salvo prorrogação acordada por escrito entre as partes.

CLÁUSULA 3ª — VALOR E PAGAMENTO. O valor total do serviço é de R$ [VALOR] ([valor por extenso]), a ser pago da seguinte forma:
[ESCOLHA: "(a) integralmente no final, após a entrega dos serviços conforme cláusula 1ª" / "(b) 50% como sinal no início e 50% ao final" / "(c) parcelado em [N] vezes mensais de R$ [VALOR DAS PARCELAS], vencimento todo dia [DIA] do mês"]. O pagamento será efetuado via [Pix/transferência bancária para conta do CONTRATADO: banco [BANCO], agência [AG], conta corrente [CC]].

CLÁUSULA 4ª — MATERIAIS. [ESCOLHA: "(a) Os materiais necessários à execução do serviço serão fornecidos pelo CONTRATANTE" / "(b) Os materiais serão fornecidos pelo CONTRATADO e seu custo já está incluído no valor da cláusula 3ª" / "(c) Os materiais serão fornecidos pelo CONTRATADO e cobrados separadamente mediante apresentação de notas fiscais"].

CLÁUSULA 5ª — GARANTIA. O CONTRATADO oferece garantia de [PRAZO, ex: "90 dias"] sobre a qualidade dos serviços prestados, comprometendo-se a refazer, sem custo, qualquer parte do trabalho que apresentar defeito durante esse prazo.

CLÁUSULA 6ª — NATUREZA DA RELAÇÃO. As partes declaram que o presente contrato NÃO gera vínculo empregatício, sendo o CONTRATADO autônomo, responsável exclusivo por seus encargos tributários e previdenciários.

CLÁUSULA 7ª — RESCISÃO. Em caso de descumprimento de qualquer cláusula, a parte prejudicada poderá rescindir o contrato mediante notificação por escrito, com prazo de 10 dias para regularização. Pagamentos já efetuados serão devolvidos pro-rata pelo trabalho não realizado.

CLÁUSULA 8ª — FORO. As partes elegem o foro da Comarca de [CIDADE]/[UF] para dirimir qualquer dúvida oriunda deste contrato.

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_______________________________
CONTRATANTE

_______________________________
CONTRATADO

TESTEMUNHAS:

1. _________________________ Nome: _________________ CPF: _________________
2. _________________________ Nome: _________________ CPF: _________________
`,
    notes: [
      "Para serviços acima de R$ 5.000, recomenda-se reconhecer firma em cartório",
      "Conserve fotos do antes/durante/depois quando aplicável (reformas, pintura)",
      "Se exigir nota fiscal, o autônomo precisa emitir RPA (Recibo de Pagamento de Autônomo)"
    ]
  },
  // 8
  {
    slug: "termo-quitacao-debito",
    title: "Termo de quitação de débito",
    category: "Recibos e quitações",
    description:
      "Documento mais formal que o recibo simples, usado para encerrar uma dívida específica com renúncia recíproca a cobranças.",
    legalBase: "Código Civil, arts. 320 a 326 (quitação) e art. 320 (forma do recibo).",
    fillingMinutes: 5,
    whenToUse: [
      "Encerramento de empréstimo pessoal entre amigos/familiares",
      "Quitação de saldo final de prestação de serviço",
      "Acordo final entre as partes com renúncia mútua a reclamações"
    ],
    howToFill: [
      "Identifique credor e devedor com dados completos",
      "Descreva a obrigação original (data, valor, motivo)",
      "Indique se quitação é total ou parcial",
      "Inclua cláusula de renúncia recíproca a reclamações"
    ],
    content: `TERMO DE QUITAÇÃO DE DÉBITO

CREDOR: [NOME COMPLETO], CPF [000.000.000-00], residente à [endereço].

DEVEDOR: [NOME COMPLETO], CPF [000.000.000-00], residente à [endereço].

Pelo presente termo, as partes acima qualificadas declaram, na melhor forma de direito, que:

CONSIDERANDO que entre eles existiu obrigação no valor original de R$ [VALOR ORIGINAL], decorrente de [DESCRIÇÃO DO MOTIVO, exemplo: "empréstimo pessoal celebrado em [DATA]", "prestação de serviços de [DESCRIÇÃO]", "compra de [BEM]"];

CONSIDERANDO que o DEVEDOR efetuou o pagamento integral da obrigação em [DATA DO PAGAMENTO], no valor de R$ [VALOR PAGO], por meio de [FORMA: "Pix", "transferência bancária", "dinheiro em espécie", "cheque nº ... do banco ..."];

RESOLVEM as partes:

CLÁUSULA 1ª — O CREDOR declara haver recebido em moeda corrente nacional a quantia acima especificada, dando ao DEVEDOR plena, geral e irrevogável quitação da obrigação descrita, para nada mais reclamar a qualquer tempo, a qualquer título.

CLÁUSULA 2ª — Em decorrência da quitação ora outorgada, as partes consideram extinta a obrigação, com renúncia recíproca a qualquer direito, ação, reclamação ou pretensão que poderiam ter, uma contra a outra, decorrente da obrigação acima.

CLÁUSULA 3ª — As partes declaram que firmam o presente termo de forma livre e consciente, sem coação ou vício de vontade.

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_____________________________________
CREDOR
[NOME COMPLETO]

_____________________________________
DEVEDOR
[NOME COMPLETO]

TESTEMUNHAS:

1. _________________________ Nome: _________________ CPF: _________________
2. _________________________ Nome: _________________ CPF: _________________
`,
    notes: [
      "Esse termo é mais forte que recibo simples — encerra a obrigação por escrito de forma definitiva",
      "Para débitos acima de R$ 10.000, reconhecimento de firma em cartório é altamente recomendado",
      "Após assinar, não cabe mais cobrança — leia com atenção"
    ]
  },
  // 9
  {
    slug: "declaracao-de-uniao-estavel",
    title: "Declaração de união estável",
    category: "Declarações",
    description:
      "Declaração particular reconhecendo a existência de união estável entre o casal, com data de início e regime de bens — útil para INSS, planos de saúde e bancos.",
    legalBase:
      "Código Civil, arts. 1.723 a 1.727 e Constituição Federal, art. 226, § 3º.",
    fillingMinutes: 5,
    whenToUse: [
      "Inclusão do(a) companheiro(a) como dependente no INSS, plano de saúde, IRPF",
      "Abertura de conta conjunta em banco",
      "Comprovação de vínculo em processos administrativos",
      "Anterior ao reconhecimento judicial ou em cartório de notas"
    ],
    howToFill: [
      "Preencha dados completos dos dois companheiros",
      "Indique data de início da convivência",
      "Defina o regime de bens (comunhão parcial é o padrão)",
      "Reconheça firma em cartório para fortalecer o documento"
    ],
    content: `DECLARAÇÃO DE UNIÃO ESTÁVEL

DECLARANTES:

[NOME COMPLETO DA PRIMEIRA PESSOA], [nacionalidade], [estado civil anterior — solteiro/divorciado/viúvo], [profissão], CPF [000.000.000-00], RG [00.000.000] [órgão]/[UF], residente à [endereço completo];

e

[NOME COMPLETO DA SEGUNDA PESSOA], [nacionalidade], [estado civil anterior — solteiro/divorciado/viúvo], [profissão], CPF [000.000.000-00], RG [00.000.000] [órgão]/[UF], residente à [endereço completo],

DECLARAM, na melhor forma de direito, sob as penas da lei, que:

1. Convivem em UNIÃO ESTÁVEL desde [DATA DE INÍCIO DA CONVIVÊNCIA], de forma pública, contínua e duradoura, com o objetivo de constituição de família, na forma do art. 1.723 do Código Civil e do art. 226, § 3º da Constituição Federal.

2. Residem juntos no endereço acima indicado, dividindo despesas, projetos de vida e responsabilidades familiares.

3. Quanto ao regime de bens, declaram que a união estável segue o regime de [ESCOLHA: "COMUNHÃO PARCIAL DE BENS" (padrão legal — bens adquiridos durante a união se comunicam, anteriores não) / "SEPARAÇÃO TOTAL DE BENS" / "COMUNHÃO UNIVERSAL DE BENS"].

4. Esta declaração se destina a [FINALIDADE, exemplo: "comprovação de dependência junto ao INSS para fins de pensão por morte", "inclusão como beneficiário em plano de saúde", "abertura de conta-corrente conjunta", "qualquer finalidade que se fizer necessária"].

5. Declaram, ainda, que estão cientes de que prestar declaração falsa configura crime previsto no art. 299 do Código Penal e nos arts. 2º e 3º da Lei 7.115/1983.

Por ser expressão da verdade, firmam a presente.

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_____________________________________
[NOME COMPLETO]
CPF: [000.000.000-00]

_____________________________________
[NOME COMPLETO]
CPF: [000.000.000-00]

TESTEMUNHAS (recomendado):

1. _________________________ Nome: _________________ CPF: _________________
2. _________________________ Nome: _________________ CPF: _________________
`,
    notes: [
      "Reconhecimento de firma em cartório é altamente recomendado — alguns órgãos exigem",
      "Para força legal máxima, converta em escritura pública no Cartório de Notas",
      "União estável pode ser comprovada também por outros meios — contrato de aluguel conjunto, conta bancária, fotos com data"
    ]
  },
  // 10
  {
    slug: "notificacao-extrajudicial-cobranca",
    title: "Notificação extrajudicial de cobrança",
    category: "Notificações",
    description:
      "Notificação formal para constituir o devedor em mora, antes de eventual ação judicial. Documento exigido em diversos casos pela Justiça.",
    legalBase: "Código Civil, art. 397 e Código de Processo Civil, art. 726.",
    fillingMinutes: 7,
    whenToUse: [
      "Cobrança de dívida em atraso antes de ingressar com ação",
      "Notificação de inadimplemento em contrato com cláusula resolutória",
      "Pré-protesto de título com obrigação líquida e certa"
    ],
    howToFill: [
      "Identifique credor e devedor com dados completos",
      "Descreva a obrigação (valor, data de vencimento, motivo)",
      "Estabeleça prazo de pagamento (10 a 15 dias é o usual)",
      "Indique as consequências do não pagamento (protesto, ação judicial)",
      "Envie com Aviso de Recebimento (AR) pelos Correios ou via cartório"
    ],
    content: `NOTIFICAÇÃO EXTRAJUDICIAL

[NOME DO CREDOR], CPF [000.000.000-00], residente à [endereço completo], DE EM VIRTUDE DO PRESENTE ATO, NOTIFICA, na forma da lei, o(a) Sr.(a) [NOME DO DEVEDOR], CPF [000.000.000-00], residente à [endereço completo], pelos seguintes motivos e fundamentos:

I. Em [DATA], V. Sa. assumiu obrigação no valor de R$ [VALOR] ([valor por extenso]), referente a [DESCRIÇÃO DA ORIGEM DA DÍVIDA: ex: "empréstimo pessoal celebrado por instrumento particular", "saldo devedor da prestação de serviços contratada em [DATA]", "compra a prazo do bem descrito no contrato anexo"].

II. A referida obrigação tinha vencimento em [DATA DO VENCIMENTO], conforme [DOCUMENTO COMPROBATÓRIO: "contrato assinado", "nota promissória", "recibo de compra"], anexo a esta notificação.

III. Apesar de inúmeras tentativas amigáveis de cobrança, até a presente data, V. Sa. não efetuou o pagamento, encontrando-se INADIMPLENTE.

IV. Em face do exposto, fica V. Sa. NOTIFICADO(A) para, no prazo improrrogável de [PRAZO: ex: "10 (dez) dias úteis"] a contar do recebimento desta, efetuar o pagamento integral do valor de R$ [VALOR ATUALIZADO], acrescido de juros legais (1% ao mês) e correção monetária pelo INPC, totalizando R$ [VALOR FINAL ATUALIZADO], mediante depósito na conta bancária do credor: [BANCO], agência [AGÊNCIA], conta corrente [CONTA], em nome de [NOME].

V. Decorrido o prazo acima sem o pagamento, o credor adotará as MEDIDAS CABÍVEIS, incluindo, sem limitação:
   a) protesto extrajudicial do título junto ao Tabelionato de Protesto competente;
   b) inscrição do nome do devedor nos cadastros de proteção ao crédito (SPC, Serasa);
   c) ajuizamento de ação judicial de cobrança, com pedido de bloqueio de bens via sistema BACENJUD, RENAJUD e demais ferramentas judiciais;
   d) cobrança de honorários advocatícios fixados em até 20% sobre o valor devido.

VI. A presente notificação tem efeito de constituir V. Sa. em mora, conforme art. 397 do Código Civil, e gera os efeitos do art. 405 do Código Civil (fluência de juros) a partir da data de seu recebimento.

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_____________________________________
[NOME DO CREDOR]
CPF: [000.000.000-00]
`,
    notes: [
      "Envie com AR pelos Correios para ter prova do recebimento — guarde o comprovante",
      "Alternativa: protocolar via Cartório de Títulos e Documentos (mais formal, gera fé pública)",
      "Não é necessário advogado — mas para valores altos ou casos complexos, recomenda-se"
    ]
  },
  // 11
  {
    slug: "rescisao-contrato-prestacao-servicos",
    title: "Rescisão amigável de contrato de prestação de serviços",
    category: "Notificações",
    description:
      "Documento para encerrar contrato em comum acordo, com quitação recíproca e definição do que cada parte paga ou recebe.",
    legalBase: "Código Civil, art. 472 (resilição bilateral).",
    fillingMinutes: 6,
    whenToUse: [
      "Quando contratante e contratado decidem encerrar o serviço antes do prazo",
      "Para regularizar pagamento proporcional ao trabalho já realizado",
      "Para evitar disputa judicial sobre obrigações pendentes"
    ],
    howToFill: [
      "Indique dados das partes conforme contrato original",
      "Mencione o contrato original (data, objeto)",
      "Acerte valores pro-rata ainda devidos (do contratante) ou a devolver (do contratado)",
      "Estabeleça quitação mútua"
    ],
    content: `TERMO DE RESCISÃO AMIGÁVEL DE CONTRATO DE PRESTAÇÃO DE SERVIÇOS

CONTRATANTE: [NOME COMPLETO], CPF [000.000.000-00], residente à [endereço].

CONTRATADO: [NOME COMPLETO], CPF [000.000.000-00], residente à [endereço].

As partes acima qualificadas, na melhor forma de direito, têm justo e contratado o presente Termo de Rescisão Amigável, nos seguintes termos:

CONSIDERANDO que celebraram em [DATA DO CONTRATO ORIGINAL] Contrato de Prestação de Serviços tendo por objeto [DESCRIÇÃO DO SERVIÇO ORIGINAL];

CONSIDERANDO que ambas as partes, por razões de comum acordo, desejam pôr fim ao referido contrato antes de seu termo final;

CLÁUSULA 1ª — As partes resolvem rescindir o referido Contrato de Prestação de Serviços, com efeitos a partir desta data, sem ônus rescisórios ou multas.

CLÁUSULA 2ª — Em relação aos serviços parcialmente executados pelo CONTRATADO até a presente data, as partes acordam o seguinte ajuste financeiro:
[ESCOLHA: "(a) O CONTRATANTE pagará ao CONTRATADO a quantia de R$ [VALOR] referente à proporção do trabalho realizado, valor pago nesta data" / "(b) O CONTRATADO devolverá ao CONTRATANTE a quantia de R$ [VALOR] referente à parte do sinal não utilizada, devolução efetuada nesta data" / "(c) As partes consideram quitadas todas as obrigações pendentes do contrato, sem necessidade de qualquer pagamento adicional"].

CLÁUSULA 3ª — As partes outorgam-se reciprocamente plena, rasa e irrevogável quitação relativa ao Contrato de Prestação de Serviços ora rescindido, nada mais tendo a reclamar uma da outra, a qualquer tempo, a qualquer título.

CLÁUSULA 4ª — As partes declaram que firmam o presente Termo de forma livre e consciente, sem coação ou vício de vontade.

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_____________________________________
CONTRATANTE

_____________________________________
CONTRATADO

TESTEMUNHAS (recomendado):

1. _________________________ Nome: _________________ CPF: _________________
2. _________________________ Nome: _________________ CPF: _________________
`,
    notes: [
      "Após assinar, não cabe mais cobrança ou ressarcimento relacionado ao contrato",
      "Reconhecimento de firma é desnecessário em geral, mas recomendado para valores altos",
      "Conserve o original — uma cópia para cada parte"
    ]
  },
  // 12
  {
    slug: "autorizacao-uso-de-imagem",
    title: "Autorização de uso de imagem",
    category: "Autorizações",
    description:
      "Cessão de direito de uso da imagem (foto, vídeo) para finalidade específica — eventos, redes sociais, publicidade, mídia institucional.",
    legalBase:
      "Constituição Federal, art. 5º, X; Código Civil, art. 20; Lei 9.610/98 (Direitos Autorais).",
    fillingMinutes: 4,
    whenToUse: [
      "Evento, formatura, festa, casamento — uso de fotos pelos contratados/empresa",
      "Participação em campanha publicitária ou institucional",
      "Foto/vídeo divulgado por escola, igreja, clube com seu filho",
      "Material de portfólio de fotógrafo ou videomaker"
    ],
    howToFill: [
      "Indique se a autorização é gratuita ou onerosa",
      "Limite a finalidade (campanha específica, evento específico — não 'qualquer uso')",
      "Defina prazo de validade (ex: 24 meses) e meios de divulgação",
      "Para menores, ambos os pais devem assinar"
    ],
    content: `AUTORIZAÇÃO DE USO DE IMAGEM

Eu, [NOME COMPLETO DO TITULAR DA IMAGEM], [nacionalidade], [estado civil], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], portador da Cédula de Identidade RG nº [00.000.000] [órgão]/[UF], residente à [endereço completo],

AUTORIZO [NOME COMPLETO DO BENEFICIÁRIO OU EMPRESA, CPF/CNPJ, endereço], doravante denominado(a) "AUTORIZADO", a utilizar a minha imagem (foto, vídeo, retrato, voz), nos seguintes termos e condições:

1. FINALIDADE: A imagem poderá ser utilizada exclusivamente para [DESCREVER A FINALIDADE, exemplo: "divulgação do evento [NOME DO EVENTO] realizado em [DATA] nas redes sociais oficiais da empresa AUTORIZADA (Instagram, Facebook, site institucional)", "campanha publicitária da empresa AUTORIZADA referente ao produto [PRODUTO]"].

2. MEIOS DE DIVULGAÇÃO: Internet, redes sociais, e-mail marketing, materiais impressos institucionais (catálogo, panfleto), apresentações comerciais. [REMOVER OS MEIOS QUE NÃO AUTORIZAR].

3. PRAZO: A presente autorização tem validade pelo prazo de [PRAZO, ex: "24 (vinte e quatro) meses"] a contar da data de sua assinatura. Findo o prazo, a imagem deverá ser removida de todos os meios divulgados.

4. ÔNUS: [ESCOLHA: "(a) A autorização é concedida a TÍTULO GRATUITO, sem qualquer remuneração ao autorizante" / "(b) A autorização é concedida em contrapartida ao pagamento de R$ [VALOR], pago nesta data"].

5. ALTERAÇÕES: O AUTORIZADO compromete-se a não modificar ou editar a imagem de forma que altere o sentido, a dignidade ou a reputação do autorizante.

6. REVOGAÇÃO: A presente autorização pode ser revogada a qualquer tempo, mediante comunicação por escrito, sem efeito sobre os usos já realizados até a data da revogação.

7. RESPONSABILIDADE: O AUTORIZADO assume integral responsabilidade pelo uso da imagem nos termos desta autorização, isentando o autorizante de qualquer reclamação de terceiros.

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_____________________________________
[NOME COMPLETO DO TITULAR]
CPF: [000.000.000-00]

[Se menor de 18 anos, assinatura de ambos os responsáveis:]

_____________________________________
PAI/RESPONSÁVEL

_____________________________________
MÃE/RESPONSÁVEL
`,
    notes: [
      "Para menores de 18 anos, ambos os pais ou responsáveis devem assinar",
      "Limite a finalidade — autorização genérica ('qualquer uso') é juridicamente frágil",
      "Use de imagem sem autorização gera direito a indenização por dano moral (art. 20 do CC)"
    ]
  },
  // 13
  {
    slug: "termo-de-confidencialidade-nda",
    title: "Termo de confidencialidade (NDA)",
    category: "Contratos",
    description:
      "Acordo de confidencialidade simples entre duas partes para proteção de informações sigilosas trocadas em negociações ou prestação de serviços.",
    legalBase: "Código Civil, arts. 113, 187 e 422 (boa-fé contratual).",
    fillingMinutes: 8,
    whenToUse: [
      "Antes de discutir parceria comercial com terceiro",
      "Quando contratar prestador de serviço com acesso a informações sensíveis",
      "Para proteger dados de clientes, fórmulas, código-fonte, listas comerciais"
    ],
    howToFill: [
      "Identifique as partes (pode ser pessoa física ou jurídica)",
      "Defina claramente o que é INFORMAÇÃO CONFIDENCIAL",
      "Estabeleça prazo de confidencialidade (geralmente 2 a 5 anos após o término da relação)",
      "Inclua multa por descumprimento (penalidade financeira é dissuasória)"
    ],
    content: `TERMO DE CONFIDENCIALIDADE

PARTE A: [NOME COMPLETO ou RAZÃO SOCIAL], CPF/CNPJ [000.000.000-00 / 00.000.000/0000-00], com sede/residência à [endereço completo], representada por [se PJ, nome do representante legal].

PARTE B: [NOME COMPLETO ou RAZÃO SOCIAL], CPF/CNPJ [000.000.000-00 / 00.000.000/0000-00], com sede/residência à [endereço completo], representada por [se PJ, nome do representante legal].

As partes acima qualificadas têm entre si justo e contratado o presente Termo de Confidencialidade, regido pelas seguintes cláusulas:

CLÁUSULA 1ª — FINALIDADE. As partes mantêm tratativas relacionadas a [DESCREVER A FINALIDADE: ex: "negociação de eventual parceria comercial no segmento de [SEGMENTO]", "prestação de serviços de [SERVIÇO] pela Parte A à Parte B"], no contexto da qual podem ser trocadas informações de caráter sigiloso.

CLÁUSULA 2ª — INFORMAÇÃO CONFIDENCIAL. Considera-se "Informação Confidencial" toda e qualquer informação, escrita, verbal, eletrônica ou em qualquer outro meio, identificada como tal ou que, por sua natureza, deva ser tratada como tal, incluindo, sem limitação:
   a) dados financeiros, contábeis, estratégicos;
   b) listas de clientes, fornecedores, parceiros;
   c) processos, métodos, fórmulas, know-how técnico;
   d) projetos em desenvolvimento;
   e) qualquer outra informação não pública.

CLÁUSULA 3ª — OBRIGAÇÕES. Cada parte se obriga a:
   a) manter sob estrito sigilo todas as Informações Confidenciais recebidas;
   b) utilizá-las exclusivamente para a finalidade descrita na cláusula 1ª;
   c) não divulgar, transferir, ceder, vender ou compartilhar com terceiros, sob qualquer forma;
   d) restringir o acesso interno apenas aos colaboradores que necessitem das informações, mediante obrigação equivalente de sigilo;
   e) devolver ou destruir todas as Informações Confidenciais ao final da relação, mediante simples solicitação da parte titular.

CLÁUSULA 4ª — EXCEÇÕES. Não se considera Informação Confidencial: (a) o que já era de domínio público antes do recebimento; (b) o que foi obtido legitimamente de terceiros sem dever de sigilo; (c) o que foi independentemente desenvolvido pela parte receptora; (d) o que precise ser divulgado por imposição legal ou determinação judicial — neste caso, a parte avisará a outra antes da divulgação, quando possível.

CLÁUSULA 5ª — PRAZO. A obrigação de confidencialidade vigora durante toda a relação entre as partes e pelo prazo de [PRAZO, ex: "5 (cinco) anos"] após o seu término, qualquer que seja o motivo da extinção.

CLÁUSULA 6ª — PENALIDADE. O descumprimento das obrigações deste termo sujeitará a parte infratora ao pagamento de multa não compensatória no valor de R$ [VALOR DA MULTA, ex: "100.000,00"], sem prejuízo da reparação integral dos danos materiais e morais causados.

CLÁUSULA 7ª — FORO. Fica eleito o foro da Comarca de [CIDADE]/[UF] para dirimir qualquer questão decorrente deste termo.

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_______________________________
PARTE A

_______________________________
PARTE B

TESTEMUNHAS:

1. _________________________ Nome: _________________ CPF: _________________
2. _________________________ Nome: _________________ CPF: _________________
`,
    notes: [
      "Reconhecimento de firma fortalece a prova, especialmente em valor de multa elevado",
      "NDA não pode ser usado para acobertar atividade ilícita — cláusula nesse sentido seria nula",
      "Para informações tecnológicas (código-fonte, fórmulas), considere registrar separadamente em cartório com data certa"
    ]
  },
  // 14
  {
    slug: "carta-renuncia-de-direito",
    title: "Carta de renúncia (de direito)",
    category: "Declarações",
    description:
      "Documento em que a pessoa abre mão formal de um direito específico — herança, vaga em concurso, indenização, função em sociedade.",
    legalBase: "Código Civil, arts. 114 (renúncia) e 1.804 a 1.812 (renúncia à herança).",
    fillingMinutes: 4,
    whenToUse: [
      "Renúncia à herança (precisa ser feita em escritura pública ou termo nos autos)",
      "Renúncia a vaga em concurso público após convocação",
      "Renúncia a cargo de administrador em sociedade",
      "Renúncia a direito específico em negociação com a outra parte"
    ],
    howToFill: [
      "Identifique completamente quem renuncia",
      "Especifique exatamente o direito objeto da renúncia",
      "Indique se a renúncia é incondicional ou tem alguma ressalva",
      "Para herança, é obrigatório fazer em escritura pública ou termo judicial"
    ],
    content: `CARTA DE RENÚNCIA

Eu, [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], portador da Cédula de Identidade RG nº [00.000.000] [órgão]/[UF], inscrito no CPF/MF sob o nº [000.000.000-00], residente à [endereço completo], na melhor forma de direito,

DECLARO, de forma livre, consciente e irrevogável, que RENUNCIO ao seguinte direito:

[DESCREVER COM DETALHE O DIREITO OBJETO DA RENÚNCIA, exemplos:
"À vaga de Analista Administrativo, código [CÓDIGO], a que fui convocado(a) no Concurso Público nº [NÚMERO] da Prefeitura de [CIDADE]/[UF]"
"À função de administrador da sociedade empresária [RAZÃO SOCIAL], CNPJ [00.000.000/0000-00], cuja eleição se deu em [DATA]"
"À indenização que me caberia em razão do Termo de Acordo firmado em [DATA] com [NOME DA OUTRA PARTE]"
"À quota societária que detenho na sociedade [RAZÃO SOCIAL], correspondente a [PERCENTUAL]% do capital social"]

Declaro estar plenamente ciente de que esta renúncia é:
( ) incondicional, irrevogável e produz efeitos imediatos a partir desta data;
( ) condicionada a [CONDIÇÃO ESPECÍFICA, se aplicável].

Declaro, ainda, que esta renúncia é feita sem qualquer pressão, coação ou vício de vontade, em pleno gozo das minhas faculdades mentais.

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_____________________________________
[NOME COMPLETO]
CPF: [000.000.000-00]
RG: [00.000.000] [órgão]/[UF]

TESTEMUNHAS (recomendado para fortalecer a prova):

1. _________________________ Nome: _________________ CPF: _________________
2. _________________________ Nome: _________________ CPF: _________________
`,
    notes: [
      "ATENÇÃO: renúncia à herança SÓ é válida feita em escritura pública (Cartório de Notas) ou em termo nos autos do inventário (art. 1.806 do CC). Esse modelo não substitui o ato em cartório para esse fim",
      "Renúncia é ato irrevogável — leia, releia, e só assine quando tiver certeza",
      "Reconhecimento de firma em cartório é altamente recomendado"
    ]
  },
  // 15
  {
    slug: "termo-de-acordo-extrajudicial",
    title: "Termo de acordo extrajudicial",
    category: "Notificações",
    description:
      "Acordo formal entre partes em conflito, encerrando disputa sem necessidade de ação judicial — pode ser homologado depois pelo juiz.",
    legalBase: "Código Civil, art. 840 (transação) e CPC, art. 515 (título executivo extrajudicial).",
    fillingMinutes: 8,
    whenToUse: [
      "Acordo extrajudicial em conflito de vizinhança",
      "Reparação de dano material em pequeno acidente",
      "Encerramento de disputa familiar (sem envolver guarda ou bens imóveis)",
      "Acordo entre sócios em dissolução parcial de sociedade"
    ],
    howToFill: [
      "Identifique as partes envolvidas no conflito",
      "Descreva o objeto da controvérsia (origem)",
      "Estabeleça as concessões recíprocas (o que cada um aceita)",
      "Defina pagamento, prazo, forma e consequências de descumprimento",
      "Para virar título executivo, assine na presença de duas testemunhas"
    ],
    content: `TERMO DE ACORDO EXTRAJUDICIAL

PARTE A: [NOME COMPLETO], CPF [000.000.000-00], residente à [endereço].

PARTE B: [NOME COMPLETO], CPF [000.000.000-00], residente à [endereço].

As partes acima qualificadas, no exercício de sua plena capacidade civil, na melhor forma de direito, têm entre si justo e contratado o presente Termo de Acordo Extrajudicial, regido pelos arts. 840 e seguintes do Código Civil, com as seguintes cláusulas:

CONSIDERANDO que existe entre as partes [CONTROVÉRSIA / CONFLITO / DISPUTA] originada de [DESCREVER A ORIGEM DO CONFLITO, exemplo: "acidente automobilístico ocorrido em [DATA] na via [LOCAL], em que o veículo da Parte A colidiu com o veículo da Parte B, causando danos materiais"];

CONSIDERANDO que ambas as partes desejam pôr fim à controvérsia de forma amigável, sem necessidade de litígio judicial, mediante concessões recíprocas;

CLÁUSULA 1ª — OBJETO DO ACORDO. As partes, fazendo concessões recíprocas, encerram em definitivo a controvérsia descrita, nos seguintes termos:

   a) A PARTE A pagará à PARTE B o valor de R$ [VALOR] ([valor por extenso]), referente a [INDICAR O QUE COBRE: "reparação integral dos danos materiais decorrentes do acidente"], a ser pago [À VISTA NESTA DATA / EM [N] PARCELAS MENSAIS DE R$ [VALOR] COM PRIMEIRA PARCELA EM [DATA]];

   b) A PARTE B, em contrapartida, declara que com o pagamento ora ajustado fica plenamente ressarcida de todos os danos decorrentes do evento, dando à PARTE A QUITAÇÃO GERAL E IRREVOGÁVEL.

CLÁUSULA 2ª — RENÚNCIA. As partes RENUNCIAM mutuamente a qualquer pretensão, ação judicial, queixa-crime ou reclamação administrativa que poderiam intentar uma contra a outra em razão do evento descrito.

CLÁUSULA 3ª — DESCUMPRIMENTO. Em caso de inadimplemento de qualquer das obrigações assumidas neste Termo, a parte prejudicada poderá executar o presente diretamente, na forma do art. 784, IV, do Código de Processo Civil (título executivo extrajudicial), com vencimento antecipado das demais parcelas, acréscimo de multa de 10% sobre o valor inadimplido e juros de mora de 1% ao mês.

CLÁUSULA 4ª — FORO. Para resolver qualquer questão oriunda deste Termo, as partes elegem o foro da Comarca de [CIDADE]/[UF].

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_______________________________
PARTE A

_______________________________
PARTE B

TESTEMUNHAS (obrigatórias para título executivo extrajudicial — CPC, art. 784, III):

1. _________________________ Nome: _________________ CPF: _________________
2. _________________________ Nome: _________________ CPF: _________________
`,
    notes: [
      "Com duas testemunhas, esse termo vira título executivo — em caso de descumprimento, executa direto, sem precisar discutir o mérito",
      "Reconhecimento de firma é altamente recomendado",
      "Pode ser levado a juiz para homologação, ganhando força adicional de sentença"
    ]
  },
  // 16
  {
    slug: "declaracao-de-bens-para-imposto-doacao",
    title: "Declaração de bens para doação",
    category: "Declarações",
    description:
      "Modelo de declaração entre familiares para formalizar doação de bem móvel ou pequena quantia, com cálculo do ITCMD aplicável.",
    legalBase: "Código Civil, arts. 538 a 564 (doação) e legislação tributária estadual (ITCMD).",
    fillingMinutes: 5,
    whenToUse: [
      "Doação de veículo entre pais e filhos",
      "Doação de quantia em dinheiro entre familiares",
      "Adiantamento da legítima (doação em vida)"
    ],
    howToFill: [
      "Identifique o doador e o donatário com qualificação completa",
      "Descreva o bem doado (com placa, chassi, valor)",
      "Declare se há ônus (gravame, usufruto, reserva)",
      "Verifique a alíquota de ITCMD no seu estado e providencie o pagamento"
    ],
    content: `DECLARAÇÃO DE DOAÇÃO

DOADOR: [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], CPF [000.000.000-00], RG [00.000.000] [órgão]/[UF], residente à [endereço completo].

DONATÁRIO: [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], CPF [000.000.000-00], RG [00.000.000] [órgão]/[UF], residente à [endereço completo].

As partes acima qualificadas, na melhor forma de direito, têm entre si justo e contratado o presente instrumento de Doação, regido pelos arts. 538 a 564 do Código Civil, mediante as seguintes cláusulas:

CLÁUSULA 1ª — OBJETO. O DOADOR transfere ao DONATÁRIO, a título de doação pura e simples, o seguinte bem:
[DESCREVER COM PRECISÃO, exemplo: "Veículo marca/modelo [MARCA/MODELO], ano/modelo [ANO/ANO], cor [COR], placa [AAA-0000] (ou Mercosul [AAA0A00]), chassi [CHASSI], RENAVAM [RENAVAM], CRV em nome do DOADOR" / "Quantia em dinheiro no valor de R$ [VALOR], transferida via Pix/TED na conta do DONATÁRIO"].

CLÁUSULA 2ª — VALOR. O valor estimado do bem doado é de R$ [VALOR] ([valor por extenso]), para fins fiscais e tributários.

CLÁUSULA 3ª — GRATUIDADE. A doação é feita a título inteiramente gratuito, em vida, motivada pelo afeto entre as partes [SE FOR PARENTE: "decorrente do vínculo familiar de [GRAU DE PARENTESCO]"], sem qualquer encargo ou condição.

CLÁUSULA 4ª — ACEITAÇÃO. O DONATÁRIO aceita a presente doação, declarando recebê-la em perfeito estado.

CLÁUSULA 5ª — ADIANTAMENTO DA LEGÍTIMA. [INCLUIR APENAS SE FOR DOAÇÃO DE ASCENDENTE A DESCENDENTE OU ENTRE CÔNJUGES: "A presente doação consiste em ADIANTAMENTO DA LEGÍTIMA, devendo ser conferida (trazida à colação) no momento da partilha por morte do DOADOR, nos termos dos arts. 544 e 2.002 do Código Civil"].

CLÁUSULA 6ª — ITCMD. O ITCMD (Imposto sobre Transmissão Causa Mortis e Doação) será recolhido pelo [DONATÁRIO/DOADOR] junto à Secretaria da Fazenda do Estado de [UF], conforme a legislação aplicável.

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_____________________________________
DOADOR
[NOME COMPLETO]

_____________________________________
DONATÁRIO
[NOME COMPLETO]

TESTEMUNHAS:

1. _________________________ Nome: _________________ CPF: _________________
2. _________________________ Nome: _________________ CPF: _________________
`,
    notes: [
      "Doação de IMÓVEL exige escritura pública em cartório, não vale esse modelo",
      "Doação de VEÍCULO é declarada no DETRAN; o donatário providencia a transferência",
      "ITCMD é devido em quase todas as doações — alíquota varia por estado (em geral 4% a 8%)",
      "Doação entre cônjuges sob regime de comunhão universal é regida por regra própria"
    ]
  },
  // 17
  {
    slug: "carta-resposta-cobranca-indevida",
    title: "Carta de resposta à cobrança indevida",
    category: "Notificações",
    description:
      "Resposta formal a cobrança indevida — banco, operadora, empresa de cobrança — exigindo cessação e devolução em dobro do que foi cobrado.",
    legalBase: "Código de Defesa do Consumidor, arts. 42, 71 e 84.",
    fillingMinutes: 6,
    whenToUse: [
      "Banco cobrando tarifa não contratada",
      "Empresa cobrando dívida já paga ou inexistente",
      "Operadora telefônica cobrando serviço cancelado",
      "Cobrança vexatória, com tom ameaçador ou em horário inadequado"
    ],
    howToFill: [
      "Identifique-se completamente",
      "Identifique a empresa cobradora (com razão social e CNPJ)",
      "Descreva exatamente o que foi cobrado e por que é indevido",
      "Exija a cessação da cobrança e a devolução em dobro",
      "Indique prazo (10 a 15 dias é o usual)",
      "Envie por AR para ter prova do recebimento"
    ],
    content: `RESPOSTA A COBRANÇA INDEVIDA

A
[NOME DA EMPRESA COBRADORA], CNPJ [00.000.000/0000-00], com sede à [endereço da empresa].

A/C: Departamento Jurídico / Ouvidoria.

Assunto: Cobrança indevida — exigência de cessação imediata e devolução em dobro.

Prezados Senhores,

Eu, [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], portador da Cédula de Identidade RG nº [00.000.000] [órgão]/[UF], residente à [endereço completo], venho, pela presente, formalmente, expor e requerer o seguinte:

I. DA COBRANÇA INDEVIDA

Tenho recebido cobranças desta empresa referentes a [DESCREVER A COBRANÇA, exemplo: "fatura nº [NÚMERO], no valor de R$ [VALOR], com vencimento em [DATA]", "lançamento de tarifa de pacote de serviços em minha conta-corrente nº [NÚMERO], agência [AGÊNCIA], do [BANCO], cobrado mensalmente desde [MÊS/ANO]", "débito automático mensal referente a 'seguro residencial' no valor de R$ [VALOR]"].

II. DOS FATOS

[DESCREVER POR QUE A COBRANÇA É INDEVIDA, com clareza e datas, exemplo:
"Nunca contratei o referido serviço/produto"
"Cancelei o contrato em [DATA], conforme protocolo nº [NÚMERO]"
"Já efetuei o pagamento integral em [DATA], conforme comprovante anexo"
"O serviço não foi prestado conforme o contratado"
"O valor cobrado diverge do contrato originalmente firmado"].

III. DO DIREITO

A cobrança ora questionada viola o Código de Defesa do Consumidor (Lei 8.078/90), em especial:
- Art. 39, V e XII — vedação de cobrança abusiva e exigência de vantagem desproporcional;
- Art. 42 — vedação a cobrança vexatória e direito à repetição em dobro;
- Art. 42, parágrafo único: "O consumidor cobrado em quantia indevida tem direito à repetição do indébito, por valor igual ao dobro do que pagou em excesso, acrescido de correção monetária e juros legais";
- Art. 71 (crime de exigência de quantia indevida).

IV. DO PEDIDO

Diante do exposto, REQUEIRO desta empresa que, no prazo de 10 (dez) dias úteis a contar do recebimento desta:

a) CESSE IMEDIATAMENTE as cobranças relacionadas à matéria;
b) ESTORNE ou DEVOLVA EM DOBRO os valores indevidamente cobrados, no total de R$ [VALOR EM DOBRO COM CORREÇÃO], depositados em minha conta-corrente: [BANCO], agência [AG], conta corrente [CC];
c) RETIRE eventual inscrição do meu nome em órgãos de proteção ao crédito (SPC, Serasa) relacionada a essa cobrança indevida;
d) COMPROVE por escrito as providências adotadas.

Não atendido este pleito, comunico que adotarei as medidas judiciais cabíveis, incluindo ação de obrigação de fazer com pedido de tutela antecipada, devolução em dobro, indenização por danos morais e custas processuais, na forma do Código de Defesa do Consumidor.

Atenciosamente,

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_____________________________________
[NOME COMPLETO]
CPF: [000.000.000-00]

Anexos:
- Cópia do RG e CPF
- Comprovante(s) da cobrança indevida
- Comprovante(s) que demonstram a improcedência da cobrança
`,
    notes: [
      "Envie por AR pelos Correios — guarde o comprovante de postagem e o AR de retorno",
      "Mantenha cópia de tudo em arquivo (físico e digital)",
      "Em paralelo, registre no Procon e em consumidor.gov.br — fortalece sua posição",
      "Se não houver resposta em 30 dias, considere ação no Juizado Especial Cível"
    ]
  },
  // 18
  {
    slug: "declaracao-hipossuficiencia-justica-gratuita",
    title: "Declaração de hipossuficiência (justiça gratuita)",
    category: "Declarações",
    description:
      "Declaração para obter assistência judiciária gratuita — dispensa de custas, taxas e honorários quando você não tem recursos para arcar com o processo.",
    legalBase: "CPC, art. 99 e Lei 1.060/50.",
    fillingMinutes: 3,
    whenToUse: [
      "Pessoa física sem condições financeiras de arcar com custas processuais",
      "Anexo a petição inicial em qualquer ação judicial",
      "Recurso em processo gratuito"
    ],
    howToFill: [
      "Preencha dados completos (nome, CPF, profissão, endereço)",
      "Declare que não tem condições de pagar as custas sem prejudicar o sustento próprio ou da família",
      "Não precisa juntar comprovante — basta a declaração (CPC, art. 99, § 3º)",
      "Pode ser anexada na própria petição inicial ou em peça separada"
    ],
    content: `DECLARAÇÃO DE HIPOSSUFICIÊNCIA

Eu, [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], portador da Cédula de Identidade RG nº [00.000.000] [órgão]/[UF], inscrito no CPF/MF sob o nº [000.000.000-00], residente e domiciliado à [endereço completo],

DECLARO, sob as penas da lei e para os fins do art. 99 do Código de Processo Civil e da Lei 1.060/50, que:

1. NÃO POSSUO condições financeiras de arcar com as custas processuais, taxas judiciárias e honorários advocatícios sem prejuízo do sustento próprio e/ou de minha família;

2. Atualmente exerço a atividade de [PROFISSÃO/OCUPAÇÃO], auferindo renda mensal aproximada de R$ [VALOR] ([valor por extenso]);

3. Minhas despesas mensais essenciais (moradia, alimentação, transporte, saúde, educação, vestuário) somam aproximadamente R$ [VALOR], conforme posso comprovar quando solicitado;

4. NÃO sou proprietário de bens de valor expressivo que permitam fazer frente às custas do processo;

5. Tenho conhecimento de que prestar declaração falsa configura crime previsto no art. 299 do Código Penal e que, em caso de comprovada falsidade, posso ser condenado(a) ao pagamento de até 10 (dez) vezes o valor das custas, na forma do art. 100, parágrafo único do CPC.

Por ser expressão da verdade, firmo a presente declaração para que produza seus regulares efeitos jurídicos.

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_____________________________________
[NOME COMPLETO]
CPF: [000.000.000-00]
RG: [00.000.000] [órgão]/[UF]
`,
    notes: [
      "Por presunção legal (CPC, art. 99, § 3º), a declaração de pessoa natural goza de presunção relativa de veracidade — não precisa juntar prova inicial",
      "O juiz pode pedir esclarecimentos se houver dúvida; mantenha extratos e comprovantes acessíveis",
      "Falsidade nessa declaração é crime e gera multa de até 10x as custas processuais"
    ]
  },
  // 19
  {
    slug: "contrato-comodato-gratuito",
    title: "Contrato de comodato (empréstimo gratuito)",
    category: "Contratos",
    description:
      "Empréstimo gratuito de bem (imóvel, veículo, equipamento) por prazo determinado, sem qualquer pagamento — diferencia-se de locação por ser sem ônus.",
    legalBase: "Código Civil, arts. 579 a 585 (Comodato).",
    fillingMinutes: 7,
    whenToUse: [
      "Empréstimo de imóvel para parente morar (sem cobrança de aluguel)",
      "Empréstimo de veículo por longo prazo (motorhome para viagem, carro para amigo)",
      "Empréstimo de equipamento profissional (câmera, drone, máquina industrial)"
    ],
    howToFill: [
      "Identifique comodante (proprietário) e comodatário (quem recebe)",
      "Descreva o bem com precisão",
      "Defina prazo (determinado ou indeterminado com aviso prévio)",
      "Defina responsabilidades por conservação e despesas"
    ],
    content: `CONTRATO DE COMODATO

COMODANTE: [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], CPF [000.000.000-00], RG [00.000.000] [órgão]/[UF], residente à [endereço completo], proprietário do bem objeto deste contrato.

COMODATÁRIO: [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], CPF [000.000.000-00], RG [00.000.000] [órgão]/[UF], residente à [endereço completo].

As partes acima qualificadas têm entre si justo e contratado o presente Contrato de Comodato, regido pelos arts. 579 a 585 do Código Civil, mediante as cláusulas seguintes:

CLÁUSULA 1ª — OBJETO. O COMODANTE cede em comodato GRATUITO ao COMODATÁRIO o seguinte bem: [DESCRIÇÃO DO BEM, exemplo: "Imóvel residencial situado à [endereço completo], composto por 2 quartos, sala, cozinha, banheiro e quintal" / "Veículo marca/modelo [MARCA/MODELO], ano [ANO], placa [PLACA], chassi [CHASSI]"].

CLÁUSULA 2ª — GRATUIDADE. O presente contrato é gratuito, não havendo qualquer pagamento de aluguel, prestação ou contrapartida pelo uso do bem cedido.

CLÁUSULA 3ª — PRAZO. O prazo do comodato é de [PRAZO, ex: "12 (doze) meses"], com início em [DATA] e término em [DATA], podendo ser prorrogado mediante acordo por escrito entre as partes. [ALTERNATIVA POR PRAZO INDETERMINADO: "O prazo é INDETERMINADO, podendo o COMODANTE solicitar a devolução mediante aviso prévio de 30 (trinta) dias"].

CLÁUSULA 4ª — USO. O COMODATÁRIO obriga-se a usar o bem exclusivamente para a finalidade de [FINALIDADE, exemplo: "moradia da própria família", "transporte particular", "uso profissional autorizado"], com diligência e cuidado de bom pai de família, conforme art. 582 do Código Civil.

CLÁUSULA 5ª — DESPESAS. Durante o comodato, ficam por conta do COMODATÁRIO todas as despesas de uso ordinário do bem, incluindo [LISTAR: "IPTU, condomínio, água, luz, gás, telefone, manutenção comum" no caso de imóvel / "IPVA, seguro obrigatório DPVAT, combustível, manutenção, pneus" no caso de veículo].

CLÁUSULA 6ª — CONSERVAÇÃO. O COMODATÁRIO obriga-se a conservar o bem em bom estado, respondendo por avarias decorrentes de uso inadequado ou negligência. Desgaste natural pelo uso normal não enseja indenização.

CLÁUSULA 7ª — VEDAÇÃO À SUBLOCAÇÃO. É vedado ao COMODATÁRIO emprestar, ceder, sublocar ou de qualquer forma transferir o bem a terceiros sem autorização expressa e por escrito do COMODANTE, sob pena de rescisão imediata do contrato e responsabilização por eventuais danos.

CLÁUSULA 8ª — DEVOLUÇÃO. Findo o prazo ou solicitada a devolução nos termos do contrato, o COMODATÁRIO deverá entregar o bem no mesmo estado em que recebeu, salvo desgaste natural pelo uso.

CLÁUSULA 9ª — RESCISÃO. O comodato pode ser rescindido por qualquer das partes em caso de descumprimento de cláusula contratual, com aviso prévio de 15 (quinze) dias. Em caso de necessidade urgente e imprevista do comodante (art. 581 do CC), poderá pleitear a devolução antecipada.

CLÁUSULA 10ª — FORO. Fica eleito o foro da Comarca de [CIDADE]/[UF] para dirimir qualquer questão decorrente deste contrato.

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_______________________________
COMODANTE

_______________________________
COMODATÁRIO

TESTEMUNHAS:

1. _________________________ Nome: _________________ CPF: _________________
2. _________________________ Nome: _________________ CPF: _________________
`,
    notes: [
      "Não confunda comodato (sem aluguel) com locação (com aluguel) — regulações distintas",
      "Vistoria de entrada com fotos é essencial",
      "Se o comodatário se recusar a devolver, cabe ação de reintegração de posse"
    ]
  },
  // 20
  {
    slug: "termo-de-cessao-de-direitos",
    title: "Termo de cessão de direitos",
    category: "Contratos",
    description:
      "Transferência de direito específico (crédito, posição em contrato, autoria) de uma pessoa para outra, com efeito legal.",
    legalBase: "Código Civil, arts. 286 a 298 (cessão de crédito).",
    fillingMinutes: 8,
    whenToUse: [
      "Cessão de crédito a terceiro (com ou sem ônus)",
      "Cessão de posição em contrato (cedente sai, cessionário entra)",
      "Cessão de direitos hereditários antes da partilha",
      "Cessão de direitos autorais sobre obra"
    ],
    howToFill: [
      "Identifique cedente, cessionário e (quando aplicável) devedor cedido",
      "Descreva o direito objeto da cessão",
      "Estabeleça valor (se onerosa) ou indique gratuidade",
      "Para cessão de crédito, notifique formalmente o devedor"
    ],
    content: `TERMO DE CESSÃO DE DIREITOS

CEDENTE: [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], CPF [000.000.000-00], residente à [endereço completo].

CESSIONÁRIO: [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], CPF [000.000.000-00], residente à [endereço completo].

DEVEDOR CEDIDO (apenas em cessão de crédito): [NOME COMPLETO], CPF [000.000.000-00], residente à [endereço completo].

As partes acima qualificadas têm entre si justo e contratado o presente Termo de Cessão de Direitos, regido pelos arts. 286 a 298 do Código Civil, mediante as cláusulas seguintes:

CLÁUSULA 1ª — OBJETO. O CEDENTE cede e transfere ao CESSIONÁRIO o seguinte direito:
[DESCREVER COM PRECISÃO, exemplos:
"Crédito de R$ [VALOR] que possui contra o DEVEDOR CEDIDO, decorrente de [origem do crédito, exemplo: 'empréstimo pessoal celebrado em [DATA]']"
"Posição contratual de COMPRADOR no Contrato de Compra e Venda celebrado em [DATA] com [VENDEDOR], referente a [DESCRIÇÃO DO BEM]"
"Direitos hereditários que lhe cabem na sucessão de [NOME DO FALECIDO], aberta em [DATA]"
"Direitos autorais sobre a obra [TÍTULO DA OBRA], registrada em [REGISTRO ou indicação de identificação]"].

CLÁUSULA 2ª — VALOR DA CESSÃO. [ESCOLHA: "(a) A cessão é feita pelo valor de R$ [VALOR], pago pelo CESSIONÁRIO ao CEDENTE nesta data, via [forma de pagamento]" / "(b) A cessão é feita a TÍTULO GRATUITO, sem qualquer contraprestação"].

CLÁUSULA 3ª — RESPONSABILIDADE DO CEDENTE. [ESCOLHA: "(a) O CEDENTE responde pela EXISTÊNCIA do crédito/direito cedido, mas NÃO pela solvência do devedor (cessão pro soluto)" / "(b) O CEDENTE responde pela EXISTÊNCIA E SOLVÊNCIA do devedor, na forma do art. 296 do Código Civil (cessão pro solvendo)"].

CLÁUSULA 4ª — NOTIFICAÇÃO DO DEVEDOR (apenas em cessão de crédito). O CEDENTE compromete-se a notificar formalmente o DEVEDOR CEDIDO da presente cessão, conforme art. 290 do Código Civil, no prazo de 5 (cinco) dias úteis a partir desta data. A partir da notificação, o pagamento deverá ser feito diretamente ao CESSIONÁRIO.

CLÁUSULA 5ª — DOCUMENTOS. O CEDENTE entrega nesta data ao CESSIONÁRIO todos os documentos comprobatórios do direito cedido, incluindo originais e cópias dos contratos, recibos, notas promissórias e demais provas, sem reserva.

CLÁUSULA 6ª — IRREVOGABILIDADE. A presente cessão é firmada em caráter IRREVOGÁVEL e IRRETRATÁVEL, obrigando as partes e seus sucessores a qualquer título.

CLÁUSULA 7ª — FORO. Fica eleito o foro da Comarca de [CIDADE]/[UF] para dirimir qualquer questão decorrente deste contrato.

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_______________________________
CEDENTE

_______________________________
CESSIONÁRIO

TESTEMUNHAS:

1. _________________________ Nome: _________________ CPF: _________________
2. _________________________ Nome: _________________ CPF: _________________
`,
    notes: [
      "Reconhecimento de firma é altamente recomendado, principalmente para cessões de valor expressivo",
      "Cessão de direito hereditário deve ser feita por escritura pública (CC, art. 1.793)",
      "A notificação do devedor cedido é essencial — sem ela, o devedor pode pagar legitimamente ao cedente"
    ]
  }
];

export function getAllTemplates(): Template[] {
  // Ordenado por categoria e título.
  return [...TEMPLATES].sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category, "pt-BR");
    }
    return a.title.localeCompare(b.title, "pt-BR");
  });
}

export function getTemplateBySlug(slug: string): Template | null {
  return TEMPLATES.find((t) => t.slug === slug) || null;
}

export function getAllTemplateSlugs(): string[] {
  return TEMPLATES.map((t) => t.slug);
}

export const TEMPLATE_CATEGORIES: Array<Template["category"]> = [
  "Procurações",
  "Contratos",
  "Recibos e quitações",
  "Declarações",
  "Notificações",
  "Autorizações"
];

export function getTemplatesByCategory(category: Template["category"]): Template[] {
  return TEMPLATES.filter((t) => t.category === category);
}
