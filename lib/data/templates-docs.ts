/**
 * Biblioteca de modelos extrajudiciais gratuitos — Maio/2026.
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
    content: `PROCURAÇÃO PARTICULAR PARA FINS GERAIS
(Instrumento particular de mandato, na forma dos arts. 653 e seguintes do Código Civil)

OUTORGANTE: [NOME COMPLETO DO OUTORGANTE], [nacionalidade], [estado civil], [profissão], portador da Cédula de Identidade RG nº [00.000.000] [órgão emissor]/[UF], inscrito no CPF/MF sob o nº [000.000.000-00], residente e domiciliado à [endereço completo, com bairro, CEP, cidade e UF].

OUTORGADO(A): [NOME COMPLETO DO OUTORGADO], [nacionalidade], [estado civil], [profissão], portador da Cédula de Identidade RG nº [00.000.000] [órgão emissor]/[UF], inscrito no CPF/MF sob o nº [000.000.000-00], residente e domiciliado à [endereço completo].

Pelo presente instrumento particular de procuração, elaborado em conformidade com o art. 654 do Código Civil — contendo o lugar em que foi passado, a qualificação completa do outorgante e do outorgado, a data e a designação e a extensão dos poderes conferidos —, o OUTORGANTE, por sua livre e espontânea vontade, nomeia e constitui seu bastante procurador o OUTORGADO, a quem confere os poderes adiante especificados.

CLÁUSULA 1ª — DOS PODERES CONFERIDOS (cláusula "ad negotia"). O OUTORGADO fica investido dos poderes da cláusula "ad negotia" para o fim específico de [DESCREVER OS ATOS ESPECÍFICOS, exemplo: "retirar a Carteira Nacional de Habilitação (CNH) já renovada junto ao DETRAN/[UF]", "representar o OUTORGANTE na Assembleia Geral do Condomínio [NOME], com direito a voz e voto", "requerer e retirar segunda via de documentos pessoais junto aos órgãos competentes"], podendo, para o fiel cumprimento do mandato, assinar requerimentos e formulários, apresentar e retirar documentos, prestar e firmar declarações, recolher taxas e emolumentos, dar e receber recibos e praticar todos os demais atos que se fizerem necessários à realização do objeto acima.

CLÁUSULA 2ª — DOS LIMITES DO MANDATO. Os poderes ora outorgados restringem-se à administração ordinária e aos atos expressamente indicados na Cláusula 1ª. Nos exatos termos do art. 661, § 1º, do Código Civil, o presente mandato NÃO abrange os poderes especiais e expressos para alienar, hipotecar, transigir, contrair empréstimos, prestar aval ou fiança, movimentar contas bancárias, receber e dar quitação de valores em dinheiro, renunciar a direitos ou praticar quaisquer outros atos que exorbitem da administração ordinária. [CASO DESEJE CONCEDER ALGUM DESSES PODERES, DESCREVA-O AQUI DE FORMA ESPECÍFICA E EXPRESSA.]

CLÁUSULA 3ª — DO SUBSTABELECIMENTO. [ESCOLHA UMA OPÇÃO: "É VEDADO ao outorgado substabelecer, no todo ou em parte, os poderes ora conferidos" / "Fica AUTORIZADO o substabelecimento dos poderes, com ou sem reserva de iguais poderes, a critério do outorgado, na forma do art. 667 do Código Civil"].

CLÁUSULA 4ª — DA VALIDADE, DA REVOGAÇÃO E DA EXTINÇÃO. A presente procuração vigora pelo prazo de [PRAZO, ex.: "180 (cento e oitenta) dias"] contados da data de sua assinatura, podendo ser revogada a qualquer tempo pelo OUTORGANTE mediante simples comunicação escrita ao OUTORGADO, nos termos dos arts. 682 e 686 do Código Civil. Extingue-se, ainda, o mandato pela morte ou interdição de qualquer das partes, pela mudança de estado que inabilite o outorgante a conferir os poderes ou o outorgado a exercê-los, e pelo término do prazo aqui fixado.

Por estarem assim justos e acordados, firma o OUTORGANTE o presente instrumento.

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

LOCADOR(A): [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], portador da Cédula de Identidade RG nº [00.000.000] [órgão emissor]/[UF], residente e domiciliado à [endereço completo].

LOCATÁRIO(A): [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], portador da Cédula de Identidade RG nº [00.000.000] [órgão emissor]/[UF], residente e domiciliado à [endereço completo].

FIADOR(A) (se aplicável): [NOME COMPLETO E QUALIFICAÇÃO COMPLETA, incluindo estado civil, CPF, RG, endereço e, se casado, a qualificação e a anuência do cônjuge].

As partes acima qualificadas têm entre si, na melhor forma de direito, justo e contratado o presente Contrato de Locação Residencial, que se regerá pela Lei nº 8.245/91 (Lei do Inquilinato), aplicando-se subsidiariamente o Código Civil, e pelas cláusulas e condições seguintes:

CLÁUSULA 1ª — DO OBJETO. O LOCADOR cede ao LOCATÁRIO, para fins exclusivamente residenciais, o imóvel situado à [endereço completo do imóvel locado], assim descrito: [DESCRIÇÃO, ex.: "área útil aproximada de 80 m², composto por 2 (dois) quartos, sala, cozinha, banheiro social e área de serviço"], entregue em perfeitas condições de uso e habitabilidade, conforme laudo de vistoria de entrada que integra este contrato (Anexo I).

CLÁUSULA 2ª — DA DESTINAÇÃO. O imóvel destina-se única e exclusivamente à moradia do LOCATÁRIO e de seu núcleo familiar, sendo-lhe vedado alterar-lhe a destinação, nele exercer atividade comercial ou industrial ou abrigar número de pessoas incompatível com sua capacidade, sob pena de rescisão contratual.

CLÁUSULA 3ª — DO PRAZO. O prazo da locação é de [PRAZO, ex.: "30 (trinta) meses"], com início em [DD/MM/AAAA] e término em [DD/MM/AAAA]. Findo o prazo ajustado, não havendo oposição do LOCADOR e permanecendo o LOCATÁRIO no imóvel por mais de 30 (trinta) dias, a locação prorrogar-se-á automaticamente por prazo indeterminado, na forma do art. 46, § 1º, da Lei nº 8.245/91.

CLÁUSULA 4ª — DO ALUGUEL. O aluguel mensal é de R$ [VALOR] ([valor por extenso]), a ser pago até o dia [DIA] de cada mês, mediante depósito ou transferência (PIX/TED) na conta de titularidade do LOCADOR: [BANCO], agência [AGÊNCIA], conta corrente [CONTA], titular [NOME]. O comprovante de depósito ou transferência servirá de recibo de quitação do mês respectivo.

CLÁUSULA 5ª — DO REAJUSTE. O valor do aluguel será reajustado anualmente, na menor periodicidade admitida em lei, na data de aniversário do contrato, pela variação acumulada do índice [ÍNDICE: "IGP-M/FGV" ou "IPCA/IBGE"] nos 12 (doze) meses anteriores, ou, na sua falta ou extinção, por outro índice oficial que o substitua.

CLÁUSULA 6ª — DOS ENCARGOS. Nos termos do art. 23 da Lei nº 8.245/91, ficam a cargo do LOCATÁRIO as despesas ordinárias de consumo e de administração do imóvel, tais como água, energia elétrica, gás, telefone, internet, taxa de condomínio (parte ordinária) e IPTU [SE ASSIM AJUSTADO]. As despesas extraordinárias de condomínio (obras de reforma estrutural, pintura de fachadas, instalação de equipamentos de segurança, constituição de fundo de reserva) e os tributos que recaiam sobre a propriedade competem ao LOCADOR, na forma do art. 22 da mesma Lei.

CLÁUSULA 7ª — DA GARANTIA. Para garantia das obrigações assumidas, e observado o art. 37 da Lei nº 8.245/91, que veda a exigência de mais de uma modalidade de garantia num mesmo contrato, o LOCATÁRIO oferece [ESCOLHA UMA ÚNICA MODALIDADE: "(a) FIANÇA prestada por [NOME DO FIADOR], acima qualificado, que assina este instrumento e se obriga como fiador e principal pagador, solidariamente responsável por todas as obrigações do LOCATÁRIO, com renúncia ao benefício de ordem (art. 828 do Código Civil), estendendo-se a fiança até a efetiva devolução das chaves, ainda que a locação se prorrogue por prazo indeterminado" / "(b) CAUÇÃO EM DINHEIRO no valor de R$ [VALOR], equivalente a até 3 (três) meses de aluguel, depositada em caderneta de poupança em nome de ambas as partes, na forma do art. 38, § 2º, da Lei nº 8.245/91, revertendo em benefício do LOCATÁRIO os rendimentos, salvo utilização para quitação de débitos ao final da locação" / "(c) SEGURO-FIANÇA locatícia contratado junto à seguradora [NOME], apólice nº [NÚMERO], vigente por todo o prazo desta locação"].

CLÁUSULA 8ª — DA VISTORIA E DA CONSERVAÇÃO. O imóvel é recebido no estado descrito no laudo de vistoria de entrada (Anexo I), obrigando-se o LOCATÁRIO a conservá-lo e a restituí-lo, ao término da locação, no mesmo estado em que o recebeu, ressalvados os desgastes naturais decorrentes do uso normal e regular. Cabe ao LOCATÁRIO comunicar de imediato ao LOCADOR o surgimento de qualquer dano ou defeito cuja reparação a este incumba.

CLÁUSULA 9ª — DAS BENFEITORIAS. As benfeitorias necessárias introduzidas pelo LOCATÁRIO, ainda que não autorizadas, e as úteis desde que autorizadas por escrito, serão indenizáveis e permitem o exercício do direito de retenção, na forma do art. 35 da Lei nº 8.245/91. As benfeitorias voluptuárias não serão indenizáveis, podendo ser levantadas ao final, se não afetarem a estrutura do imóvel.

CLÁUSULA 10ª — DA VEDAÇÃO À CESSÃO E SUBLOCAÇÃO. É vedado ao LOCATÁRIO ceder, sublocar ou emprestar o imóvel, total ou parcialmente, sem o prévio consentimento por escrito do LOCADOR, sob pena de rescisão (art. 13 da Lei nº 8.245/91).

CLÁUSULA 11ª — DA RESCISÃO ANTECIPADA PELO LOCATÁRIO. Poderá o LOCATÁRIO devolver o imóvel antes do término do prazo, pagando a multa contratual pactuada, que, na forma do art. 4º da Lei nº 8.245/91, será calculada proporcionalmente ao período de cumprimento do contrato. Fica dispensado do pagamento da multa o LOCATÁRIO que necessitar mudar de residência em razão de transferência, pelo empregador, para prestar serviços em localidade diversa, desde que notifique o LOCADOR com antecedência mínima de 30 (trinta) dias.

CLÁUSULA 12ª — DA MULTA POR INFRAÇÃO CONTRATUAL. O descumprimento de qualquer cláusula deste contrato sujeitará a parte infratora ao pagamento de multa equivalente a [ex.: "3 (três)"] aluguéis vigentes, sem prejuízo da rescisão e da apuração de eventuais perdas e danos. A falta de pagamento do aluguel e dos encargos nas datas ajustadas acarretará, além da multa, juros de mora de 1% (um por cento) ao mês e correção monetária.

CLÁUSULA 13ª — DO FORO. Fica eleito o foro da Comarca de [CIDADE]/[UF], onde situado o imóvel, para dirimir quaisquer dúvidas ou controvérsias decorrentes deste contrato, com renúncia a qualquer outro, por mais privilegiado que seja.

E, por estarem justas e contratadas, as partes assinam o presente instrumento em 2 (duas) vias de igual teor e forma, na presença das testemunhas abaixo.

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_______________________________
LOCADOR(A)

_______________________________
LOCATÁRIO(A)

_______________________________
FIADOR(A) (se houver)

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
    content: `DISTRATO DE CONTRATO DE LOCAÇÃO RESIDENCIAL

LOCADOR(A): [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], RG nº [00.000.000] [órgão]/[UF], residente à [endereço completo].

LOCATÁRIO(A): [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], RG nº [00.000.000] [órgão]/[UF], residente à [endereço completo].

FIADOR(A) (se houver): [NOME COMPLETO], [estado civil], inscrito no CPF/MF sob o nº [000.000.000-00], residente à [endereço completo].

As partes acima qualificadas, na melhor forma de direito, têm entre si justo e acordado o presente DISTRATO DE CONTRATO DE LOCAÇÃO, com fundamento no art. 472 do Código Civil (que autoriza o distrato pela mesma forma exigida para o contrato) e no art. 9º, inciso I, da Lei nº 8.245/91 (rescisão por acordo mútuo), mediante as cláusulas e condições seguintes:

CONSIDERANDO que as partes celebraram, em [DATA DO CONTRATO ORIGINAL], Contrato de Locação Residencial referente ao imóvel situado à [endereço do imóvel];

CONSIDERANDO que ambas as partes, de comum acordo e sem qualquer vício de consentimento, desejam pôr fim à relação locatícia de forma amigável, antes do termo final do contrato;

CLÁUSULA 1ª — DA RESCISÃO. Pelo presente instrumento, as partes dão por rescindido, de comum acordo, o Contrato de Locação acima identificado, com efeitos a partir desta data, cessando, a partir de então, todas as obrigações recíprocas dele decorrentes, ressalvado o disposto nas cláusulas seguintes.

CLÁUSULA 2ª — DA ENTREGA DAS CHAVES. A entrega das chaves e a efetiva desocupação do imóvel ocorrem nesta data, [DD/MM/AAAA], às [HH:MM] horas, conforme laudo de vistoria de saída anexo, que integra este distrato e comprova o estado de restituição do bem.

CLÁUSULA 3ª — DA QUITAÇÃO DOS ALUGUÉIS E ENCARGOS. O LOCATÁRIO declara haver pago e quitado todos os aluguéis, bem como os encargos da locação (IPTU proporcional, cotas de condomínio, água, energia elétrica, gás, telefone e demais contas de consumo) até a presente data, conforme comprovantes anexos. O LOCADOR confere tais pagamentos e outorga ao LOCATÁRIO plena e geral quitação a esse título, nada mais tendo a reclamar.

CLÁUSULA 4ª — DO ESTADO DO IMÓVEL. Verificadas as condições do imóvel no laudo de vistoria de saída, [ESCOLHA: "(a) o imóvel foi restituído em perfeito estado de conservação, ressalvados os desgastes naturais decorrentes do uso normal, nada havendo a reparar" / "(b) o LOCATÁRIO reconhece a necessidade dos reparos descritos na vistoria e concorda em arcar com o valor de R$ [VALOR], pago nesta data ou compensado com a caução prestada"].

CLÁUSULA 5ª — DA CAUÇÃO (se houver). O valor da caução prestada, acrescido dos rendimentos, [ESCOLHA: "é integralmente devolvido ao LOCATÁRIO nesta data" / "é devolvido ao LOCATÁRIO com a dedução de R$ [VALOR] referente aos reparos da Cláusula 4ª"].

CLÁUSULA 6ª — DA LIBERAÇÃO DO FIADOR. Em razão do integral encerramento da locação e da quitação de todos os débitos, o LOCADOR declara expressamente LIBERADO o FIADOR de toda e qualquer obrigação decorrente do contrato ora distratado, exonerando-o da garantia prestada.

CLÁUSULA 7ª — DA QUITAÇÃO RECÍPROCA. As partes outorgam-se, mútua e reciprocamente, a mais ampla, plena, rasa, geral e irrevogável quitação de todas as obrigações decorrentes do Contrato de Locação ora rescindido, para nada mais reclamarem uma da outra, a qualquer tempo e a qualquer título, seja em juízo ou fora dele.

CLÁUSULA 8ª — DA LIVRE MANIFESTAÇÃO. As partes declaram firmar o presente distrato de forma livre, consciente e de boa-fé, sem qualquer coação, dolo, erro ou vício de vontade.

E, por estarem assim justas e acordadas, assinam o presente em 2 (duas) vias de igual teor, na presença das testemunhas.

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_______________________________
LOCADOR(A)

_______________________________
LOCATÁRIO(A)

_______________________________
FIADOR(A) (se houver)

TESTEMUNHAS:

1. _________________________ Nome: _________________ CPF: _________________
2. _________________________ Nome: _________________ CPF: _________________
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
    content: `RECIBO DE PAGAMENTO E QUITAÇÃO

Eu, [NOME COMPLETO DE QUEM RECEBE], [nacionalidade], [estado civil], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], portador do RG nº [00.000.000] [órgão]/[UF], residente e domiciliado à [endereço completo], na qualidade de CREDOR, DECLARO, para os devidos fins de direito e com fundamento nos arts. 319 e 320 do Código Civil, que RECEBI de [NOME COMPLETO DE QUEM PAGA], inscrito no CPF/MF sob o nº [000.000.000-00], residente à [endereço], na qualidade de DEVEDOR, a importância de R$ [VALOR] ([valor por extenso]).

FORMA DE PAGAMENTO: o valor foi pago por meio de [FORMA: "PIX (chave [CHAVE], em [DATA])", "dinheiro em espécie", "transferência bancária (TED/DOC) para a conta [BANCO/AG/CONTA]", "cheque nº [NÚMERO] do [BANCO], cuja quitação fica condicionada à respectiva compensação"].

REFERÊNCIA / MOTIVO: o pagamento refere-se a [DESCRIÇÃO DO MOTIVO, exemplo: "quitação integral do empréstimo pessoal realizado em [DATA], no valor original de R$ [VALOR ORIGINAL]"; ou "pagamento pela reforma do banheiro do imóvel situado à [endereço], conforme orçamento aprovado em [DATA]"; ou "referente à parcela nº [N] do Contrato de [DESCRIÇÃO] firmado em [DATA]"].

DA QUITAÇÃO. Em conformidade com o art. 320 do Código Civil, o presente recibo designa o valor e a espécie da dívida, o nome do devedor, o tempo e o lugar do pagamento, e é firmado pelo credor. Para maior clareza, DECLARO que, com o pagamento ora recebido, fica [ESCOLHA: "INTEGRALMENTE QUITADA a obrigação acima descrita, dando ao devedor plena, rasa, geral e irrevogável quitação, para nada mais reclamar a esse título, a qualquer tempo e sob qualquer fundamento" / "PARCIALMENTE QUITADA a obrigação, remanescendo saldo devedor de R$ [VALOR REMANESCENTE], com vencimento em [DATA], persistindo o débito quanto a esse saldo"].

E, por ser expressão da verdade, firmo o presente recibo, que produzirá seus regulares efeitos jurídicos.

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_____________________________________
[NOME COMPLETO DE QUEM RECEBE]
CPF: [000.000.000-00]

TESTEMUNHAS (opcional, recomendado para valores acima de R$ 5.000,00):

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

Eu, [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], portador da Cédula de Identidade RG nº [00.000.000] [órgão emissor]/[UF], inscrito no CPF/MF sob o nº [000.000.000-00], DECLARO, sob as penas da lei e para os devidos fins de direito, com fundamento no art. 1º da Lei nº 7.115/1983 — segundo o qual a declaração destinada a fazer prova de residência, firmada pelo próprio interessado, presume-se verdadeira —, que:

1. Sou RESIDENTE E DOMICILIADO no endereço [ENDEREÇO COMPLETO, COM NÚMERO, COMPLEMENTO, BAIRRO, CEP, CIDADE E UF], onde resido de forma habitual e ininterrupta há [TEMPO, ex.: "2 (dois) anos e 6 (seis) meses"].

2. [OPCIONAL — SE FOR O CASO] O referido endereço consta em contas de consumo (energia elétrica / água / telefone) em nome de [NOME DO TITULAR DAS CONTAS, ex.: "meu pai", "minha mãe", "o proprietário do imóvel em que resido"], inscrito no CPF sob o nº [000.000.000-00], pessoa com quem mantenho [RELAÇÃO: "vínculo familiar", "contrato de locação", "hospedagem gratuita"], podendo tal residência ser confirmada a qualquer momento.

3. Estou plenamente ciente de que prestar declaração falsa configura o crime de FALSIDADE IDEOLÓGICA, previsto no art. 299 do Código Penal, sujeitando-me, ainda, à responsabilidade civil e administrativa prevista nos arts. 2º e 3º da Lei nº 7.115/1983.

4. A presente declaração destina-se a [FINALIDADE, ex.: "comprovação de residência para abertura de conta-corrente junto ao [BANCO]", "instrução de matrícula escolar", "cadastro em programa social / no SUS"].

Por ser expressão fiel da verdade, firmo a presente declaração.

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
    content: `AUTORIZAÇÃO DE VIAGEM NACIONAL PARA CRIANÇA OU ADOLESCENTE
(Art. 83 do Estatuto da Criança e do Adolescente — Lei nº 8.069/1990 — e Resolução CNJ nº 295/2019)

Nós, abaixo assinados, na qualidade de pais e representantes legais do(a) menor adiante identificado(a):

PAI: [NOME COMPLETO DO PAI], [nacionalidade], [estado civil], [profissão], inscrito no CPF sob o nº [000.000.000-00], RG nº [00.000.000] [órgão]/[UF], residente à [endereço completo], telefone [(00) 00000-0000];

MÃE: [NOME COMPLETO DA MÃE], [nacionalidade], [estado civil], [profissão], inscrita no CPF sob o nº [000.000.000-00], RG nº [00.000.000] [órgão]/[UF], residente à [endereço completo], telefone [(00) 00000-0000];

na qualidade de responsáveis legais do(a) menor [NOME COMPLETO DA CRIANÇA OU ADOLESCENTE], nascido(a) em [DD/MM/AAAA], natural de [CIDADE]/[UF], inscrito(a) no CPF nº [000.000.000-00] (se houver) e portador(a) do RG nº [00.000.000] [órgão]/[UF] (se houver), AUTORIZAMOS, de forma expressa, a viagem do(a) referido(a) menor em território nacional, nos seguintes termos:

DESTINO: [CIDADE/UF DE DESTINO].
PERÍODO: de [DATA DE IDA] a [DATA DE VOLTA].
MEIO DE TRANSPORTE: [ex.: "aéreo", "rodoviário", "veículo particular"].

FORMA DE ACOMPANHAMENTO (assinale UMA opção):
( ) Acompanhado(a) pelo(a) Sr.(a) [NOME DO ACOMPANHANTE], inscrito no CPF sob o nº [000.000.000-00], RG nº [_______], residente à [endereço], com grau de parentesco/relação de [_______], que goza de nossa inteira confiança e sob cuja responsabilidade fica o(a) menor durante toda a viagem;
( ) DESACOMPANHADO(A), sob nossa integral responsabilidade;
( ) Integrando grupo organizado por [NOME DA ENTIDADE / ESCOLA / IGREJA / CLUBE], CNPJ nº [_______], sob a responsabilidade do(a) Sr.(a) [NOME DO RESPONSÁVEL PELO GRUPO], CPF nº [_______], para fins de [viagem escolar / esportiva / religiosa].

OBSERVAÇÃO LEGAL: nos termos do art. 83 do ECA, a autorização judicial é dispensada quando a criança (menor de 12 anos) viajar acompanhada de ascendente ou de parente colateral maior, até o terceiro grau, comprovado o parentesco, ou de pessoa maior, expressamente autorizada pelos pais ou responsável, como no presente instrumento. O(A) adolescente (12 anos completos ou mais) está, em regra, dispensado(a) de autorização para viagem nacional, salvo exigência específica da transportadora.

A presente autorização tem validade exclusivamente para a viagem, o destino e o período acima descritos.

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_____________________________________
PAI — [NOME COMPLETO]
CPF: [000.000.000-00]

_____________________________________
MÃE — [NOME COMPLETO]
CPF: [000.000.000-00]
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

CONTRATANTE: [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], RG nº [00.000.000] [órgão]/[UF], residente à [endereço completo].

CONTRATADO(A): [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], RG nº [00.000.000] [órgão]/[UF], residente à [endereço completo].

As partes acima qualificadas têm, entre si, justo e contratado o presente Contrato de Prestação de Serviços, regido pelos arts. 593 a 609 do Código Civil e pelas cláusulas seguintes:

CLÁUSULA 1ª — DO OBJETO. O CONTRATADO obriga-se a prestar ao CONTRATANTE os seguintes serviços: [DESCRIÇÃO DETALHADA, exemplo: "pintura completa da residência situada à [endereço], compreendendo paredes internas, tetos e portas, com aplicação de duas demãos de tinta acrílica fosca de primeira linha, incluindo o preparo prévio das superfícies (lixamento, massa corrida e selador)"], obrigando-se a executá-los com zelo, diligência e observância das melhores técnicas aplicáveis.

CLÁUSULA 2ª — DO PRAZO E DO CRONOGRAMA. Os serviços terão início em [DATA] e deverão estar integralmente concluídos até [DATA LIMITE], admitida a prorrogação apenas mediante acordo escrito ou em razão de caso fortuito ou força maior devidamente comprovados. [SE HOUVER ETAPAS: "As entregas parciais observarão o seguinte cronograma: (a) [ETAPA 1] até [DATA]; (b) [ETAPA 2] até [DATA]."]

CLÁUSULA 3ª — DO VALOR E DA FORMA DE PAGAMENTO. O valor total dos serviços é de R$ [VALOR] ([valor por extenso]), a ser pago da seguinte forma: [ESCOLHA: "(a) integralmente após a conclusão e o aceite dos serviços" / "(b) 50% (cinquenta por cento) a título de sinal, na assinatura deste contrato, e o saldo de 50% (cinquenta por cento) na entrega final" / "(c) em [N] parcelas mensais e sucessivas de R$ [VALOR], vencendo a primeira em [DATA]"]. Os pagamentos serão feitos via [PIX / transferência bancária] para a conta do CONTRATADO: [BANCO], agência [AG], conta corrente [CC].

CLÁUSULA 4ª — DOS MATERIAIS E EQUIPAMENTOS. [ESCOLHA: "(a) Os materiais e insumos necessários serão fornecidos pelo CONTRATANTE" / "(b) Os materiais serão fornecidos pelo CONTRATADO, já incluído seu custo no valor da Cláusula 3ª" / "(c) Os materiais serão fornecidos pelo CONTRATADO e cobrados à parte, mediante apresentação de notas fiscais"]. Os equipamentos e as ferramentas de trabalho, salvo ajuste em contrário, são de responsabilidade do CONTRATADO.

CLÁUSULA 5ª — DAS OBRIGAÇÕES DAS PARTES. Obriga-se o CONTRATADO a executar os serviços pessoalmente ou por meio de auxiliares sob sua exclusiva responsabilidade, respeitando prazos e especificações. Obriga-se o CONTRATANTE a franquear o acesso ao local, prestar as informações necessárias e efetuar os pagamentos nas datas ajustadas.

CLÁUSULA 6ª — DA GARANTIA. O CONTRATADO oferece garantia de [PRAZO, ex.: "90 (noventa) dias"] sobre a qualidade dos serviços, contados da entrega, comprometendo-se a refazer, sem custo adicional, qualquer parte do trabalho que apresente defeito ou vício de execução dentro desse período.

CLÁUSULA 7ª — DA NATUREZA AUTÔNOMA DA RELAÇÃO. As partes declaram, expressamente, que o presente contrato NÃO gera vínculo empregatício, por ausência dos requisitos do art. 3º da CLT (pessoalidade, subordinação, habitualidade e onerosidade em conjunto), atuando o CONTRATADO com autonomia técnica e responsabilizando-se, com exclusividade, por seus tributos e encargos previdenciários.

CLÁUSULA 8ª — DA RESCISÃO. O contrato poderá ser rescindido: (a) por descumprimento de qualquer obrigação, mediante notificação escrita concedendo prazo de 10 (dez) dias para regularização; (b) por resilição unilateral (arts. 599 e 607 do Código Civil), com aviso prévio razoável, hipótese em que serão acertados os valores proporcionais ao trabalho efetivamente realizado. Na rescisão, os pagamentos já efetuados serão ajustados pro rata em relação à parcela do serviço prestada.

CLÁUSULA 9ª — DA MULTA. A parte que der causa à rescisão por descumprimento contratual pagará à outra multa de [ex.: "10% (dez por cento)"] sobre o valor total do contrato, sem prejuízo da apuração de perdas e danos.

CLÁUSULA 10ª — DO FORO. As partes elegem o foro da Comarca de [CIDADE]/[UF] para dirimir qualquer controvérsia decorrente deste contrato.

E, por estarem justas e contratadas, assinam o presente em 2 (duas) vias de igual teor, na presença das testemunhas.

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_______________________________
CONTRATANTE

_______________________________
CONTRATADO(A)

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

CREDOR: [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], RG nº [00.000.000] [órgão]/[UF], residente à [endereço completo].

DEVEDOR: [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], RG nº [00.000.000] [órgão]/[UF], residente à [endereço completo].

As partes acima qualificadas, na melhor forma de direito e com fundamento nos arts. 319 a 326 do Código Civil (do pagamento e da quitação), declaram o seguinte:

CONSIDERANDO que entre elas existiu obrigação no valor original de R$ [VALOR ORIGINAL] ([valor por extenso]), decorrente de [DESCRIÇÃO DO MOTIVO, exemplo: "empréstimo pessoal celebrado em [DATA]", "saldo remanescente da prestação de serviços de [DESCRIÇÃO]", "compra do bem [DESCRIÇÃO]"];

CONSIDERANDO que o DEVEDOR efetuou o pagamento da referida obrigação em [DATA DO PAGAMENTO], no valor de R$ [VALOR PAGO], por meio de [FORMA: "PIX", "transferência bancária (TED/DOC)", "dinheiro em espécie", "cheque nº [NÚMERO] do [BANCO]"];

RESOLVEM firmar o presente Termo de Quitação de Débito, mediante as cláusulas seguintes:

CLÁUSULA 1ª — DA QUITAÇÃO. O CREDOR declara haver recebido, em moeda corrente nacional, a quantia acima especificada, e, na forma do art. 320 do Código Civil, outorga ao DEVEDOR quitação [ESCOLHA: "PLENA, GERAL, RASA E IRREVOGÁVEL, extinguindo integralmente a obrigação" / "PARCIAL, remanescendo saldo devedor de R$ [VALOR], com vencimento em [DATA]"], para nada mais reclamar a qualquer título, tempo ou fundamento.

CLÁUSULA 2ª — DA EXTINÇÃO DA OBRIGAÇÃO E DA RENÚNCIA. Em decorrência da quitação ora outorgada, as partes reconhecem extinta a obrigação, renunciando reciprocamente a qualquer direito, ação, pretensão, cobrança ou reclamação, judicial ou extrajudicial, que pudessem ter uma contra a outra em razão da obrigação descrita.

CLÁUSULA 3ª — DA INEXISTÊNCIA DE VÍCIOS. As partes declaram firmar o presente Termo de forma livre, consciente e de boa-fé, sem qualquer coação, dolo, erro, lesão ou vício de vontade.

CLÁUSULA 4ª — DA EFICÁCIA. O presente Termo produz efeitos a partir desta data, obrigando as partes, seus herdeiros e sucessores a qualquer título.

E, por estarem assim justas e acordadas, assinam o presente em 2 (duas) vias de igual teor, na presença das testemunhas.

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_____________________________________
CREDOR — [NOME COMPLETO]
CPF: [000.000.000-00]

_____________________________________
DEVEDOR — [NOME COMPLETO]
CPF: [000.000.000-00]

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

[NOME COMPLETO DO(A) PRIMEIRO(A) COMPANHEIRO(A)], [nacionalidade], [estado civil — solteiro(a)/divorciado(a)/viúvo(a)], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], RG nº [00.000.000] [órgão]/[UF], residente à [endereço completo];

e

[NOME COMPLETO DO(A) SEGUNDO(A) COMPANHEIRO(A)], [nacionalidade], [estado civil — solteiro(a)/divorciado(a)/viúvo(a)], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], RG nº [00.000.000] [órgão]/[UF], residente à [endereço completo];

DECLARAM, na melhor forma de direito e sob as penas da lei, com fundamento no art. 1.723 do Código Civil e no art. 226, § 3º, da Constituição Federal, o seguinte:

1. Convivem em UNIÃO ESTÁVEL desde [DATA DE INÍCIO DA CONVIVÊNCIA], de forma pública, contínua, duradoura e com o objetivo de constituição de família, presentes todos os requisitos legais do art. 1.723 do Código Civil.

2. Residem juntos no endereço acima indicado, compartilhando o mesmo teto, as despesas do lar, os projetos de vida e as responsabilidades familiares, com mútua assistência material e afetiva.

3. Inexiste impedimento legal ao reconhecimento da união estável, não incidindo nenhuma das causas do art. 1.521 do Código Civil (ressalvada a hipótese de separação de fato ou judicial, na forma do art. 1.723, § 1º).

4. Quanto ao REGIME DE BENS, declaram que a união estável observa o regime de [ESCOLHA: "COMUNHÃO PARCIAL DE BENS, regime aplicável por força do art. 1.725 do Código Civil na ausência de contrato escrito — comunicam-se os bens adquiridos onerosamente na constância da união, permanecendo incomunicáveis os anteriores e os recebidos por doação ou herança" / "SEPARAÇÃO TOTAL DE BENS" / "COMUNHÃO UNIVERSAL DE BENS"], conforme ora pactuado por escrito.

5. A presente declaração destina-se a [FINALIDADE, ex.: "comprovação da condição de dependente/companheiro(a) junto ao INSS, para fins de pensão por morte", "inclusão como beneficiário(a) em plano de saúde", "abertura de conta-corrente conjunta", "declaração de dependente no Imposto de Renda", "qualquer finalidade legal que se fizer necessária"].

6. Estão cientes de que prestar declaração falsa configura o crime do art. 299 do Código Penal e enseja a responsabilidade dos arts. 2º e 3º da Lei nº 7.115/1983.

Por ser expressão da verdade, firmam a presente declaração.

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
    content: `NOTIFICAÇÃO EXTRAJUDICIAL DE COBRANÇA

NOTIFICANTE (credor): [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], RG nº [00.000.000] [órgão]/[UF], residente à [endereço completo].

NOTIFICADO(A) (devedor): [NOME COMPLETO], inscrito no CPF/MF sob o nº [000.000.000-00], residente à [endereço completo].

O NOTIFICANTE, com fundamento no art. 397 do Código Civil e no art. 726 do Código de Processo Civil, vem, pela presente, NOTIFICAR V. Sa. dos fatos e das razões a seguir expostos:

I — DOS FATOS

1. Em [DATA], V. Sa. assumiu perante o NOTIFICANTE obrigação líquida, certa e exigível no valor original de R$ [VALOR] ([valor por extenso]), decorrente de [DESCRIÇÃO DA ORIGEM, ex.: "contrato de empréstimo pessoal celebrado por instrumento particular", "saldo devedor da prestação de serviços contratada em [DATA]", "compra e venda a prazo do bem descrito no documento anexo"].

2. A referida obrigação venceu em [DATA DO VENCIMENTO], conforme [DOCUMENTO COMPROBATÓRIO: "contrato assinado", "nota promissória", "recibo", "comprovantes de transferência"] anexo a esta notificação.

3. Apesar das tratativas amigáveis já entabuladas, V. Sa. permanece INADIMPLENTE até a presente data, sem apresentar justificativa idônea.

II — DO DIREITO

4. A obrigação encontra-se vencida e não paga. Tratando-se de obrigação positiva e líquida com termo certo, o inadimplemento constitui o devedor em mora de pleno direito (mora ex re), independentemente de interpelação, na forma do art. 397, caput, do Código Civil; e a presente notificação, de todo modo, formaliza a constituição em mora, também para os fins do parágrafo único do referido artigo.

5. Sobre o débito incidem, desde o vencimento, correção monetária, juros de mora à taxa legal e, se contratualmente previstos, multa e honorários, nos termos dos arts. 389, 394, 395 e 406 do Código Civil, respondendo o devedor pelas perdas e danos decorrentes do atraso.

III — DA EXIGÊNCIA

6. Diante do exposto, fica V. Sa. NOTIFICADO(A) a, no prazo IMPRORROGÁVEL de [PRAZO, ex.: "10 (dez) dias"] a contar do recebimento desta, efetuar o pagamento integral do débito atualizado, no valor de R$ [VALOR ATUALIZADO] (principal acrescido de correção monetária e juros de 1% ao mês), mediante depósito ou transferência na conta do NOTIFICANTE: [BANCO], agência [AGÊNCIA], conta corrente [CONTA], titular [NOME], PIX [CHAVE].

IV — DAS CONSEQUÊNCIAS DO NÃO PAGAMENTO

7. Decorrido o prazo sem a devida quitação, o NOTIFICANTE adotará, independentemente de nova comunicação, as medidas cabíveis, entre as quais, sem limitação:
   a) o protesto do título ou do documento de dívida junto ao Tabelionato de Protesto competente;
   b) a inclusão do nome de V. Sa. nos cadastros de proteção ao crédito (SPC, Serasa);
   c) o ajuizamento da ação judicial de cobrança ou de execução, conforme o caso, com pedido de bloqueio de ativos e de bens (sistemas SISBAJUD, RENAJUD e afins);
   d) a cobrança das custas processuais e dos honorários advocatícios.

V — DA CONSTITUIÇÃO EM MORA

8. A presente notificação produz o efeito de constituir V. Sa. em mora e de comprovar a ciência inequívoca do débito, para todos os fins de direito.

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_____________________________________
[NOME DO NOTIFICANTE]
CPF: [000.000.000-00]
`,
    notes: [
      "Envie por AR pelos Correios para ter prova do recebimento — guarde o comprovante",
      "Alternativa: protocolar via Cartório de Títulos e Documentos (mais formal, gera fé pública)",
      "Não é necessário advogado — mas para valores altos ou casos complexos, recomenda-se",
      "A notificação recebida constitui o devedor em mora e serve de prova documental em eventual ação"
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

CONTRATANTE: [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], residente à [endereço completo].

CONTRATADO(A): [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], residente à [endereço completo].

As partes acima qualificadas, na melhor forma de direito e com fundamento no art. 472 do Código Civil (que autoriza a resilição bilateral pela mesma forma exigida para o contrato), têm entre si justo e acordado o presente Termo de Rescisão Amigável, mediante as cláusulas seguintes:

CONSIDERANDO que celebraram, em [DATA DO CONTRATO ORIGINAL], Contrato de Prestação de Serviços tendo por objeto [DESCRIÇÃO DO SERVIÇO ORIGINAL];

CONSIDERANDO que ambas as partes, por razões de comum acordo e sem qualquer vício de consentimento, desejam pôr fim ao referido contrato antes de seu termo final;

CLÁUSULA 1ª — DA RESCISÃO. As partes resolvem RESCINDIR, de comum acordo, o Contrato de Prestação de Serviços acima identificado, com efeitos a partir desta data, sem imputação de culpa a qualquer delas e, salvo o disposto na cláusula seguinte, sem incidência de multa ou ônus rescisório.

CLÁUSULA 2ª — DO ACERTO FINANCEIRO. Em relação aos serviços parcialmente executados até a presente data, as partes ajustam o seguinte: [ESCOLHA: "(a) o CONTRATANTE pagará ao CONTRATADO a quantia de R$ [VALOR], correspondente à proporção do trabalho efetivamente realizado, valor pago nesta data" / "(b) o CONTRATADO devolverá ao CONTRATANTE a quantia de R$ [VALOR], correspondente à parcela do sinal não utilizada, devolução efetuada nesta data" / "(c) as partes consideram integralmente quitadas as obrigações pendentes, nada mais havendo a pagar de parte a parte"].

CLÁUSULA 3ª — DA ENTREGA DE MATERIAIS E RESULTADOS. O CONTRATADO entrega nesta data ao CONTRATANTE [DESCREVER, se aplicável: "os materiais, arquivos, chaves, senhas e resultados parciais produzidos até aqui"], nada mais retendo em seu poder.

CLÁUSULA 4ª — DA QUITAÇÃO RECÍPROCA. As partes outorgam-se, mútua e reciprocamente, a mais ampla, plena, rasa, geral e irrevogável quitação relativa ao Contrato de Prestação de Serviços ora rescindido, para nada mais reclamarem uma da outra, a qualquer tempo, título ou fundamento.

CLÁUSULA 5ª — DA LIVRE MANIFESTAÇÃO. As partes declaram firmar o presente Termo de forma livre, consciente e de boa-fé, sem coação, dolo, erro ou qualquer vício de vontade.

E, por estarem justas e acordadas, assinam o presente em 2 (duas) vias de igual teor, na presença das testemunhas.

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_____________________________________
CONTRATANTE

_____________________________________
CONTRATADO(A)

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

AUTORIZANTE (titular da imagem): [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], RG nº [00.000.000] [órgão]/[UF], residente à [endereço completo].

AUTORIZADO(A) (beneficiário do uso): [NOME COMPLETO ou RAZÃO SOCIAL], CPF/CNPJ nº [000.000.000-00 / 00.000.000/0000-00], com sede/residência à [endereço completo].

Pelo presente instrumento, o AUTORIZANTE, no exercício dos direitos de personalidade assegurados pelo art. 5º, incisos V e X, da Constituição Federal e pelo art. 20 do Código Civil, AUTORIZA o AUTORIZADO a utilizar a sua imagem (fotografias, vídeos, retrato e voz), nos termos e limites a seguir:

CLÁUSULA 1ª — DA FINALIDADE. A imagem poderá ser utilizada EXCLUSIVAMENTE para [DESCREVER A FINALIDADE ESPECÍFICA, ex.: "divulgação do evento [NOME], realizado em [DATA], nos canais oficiais do AUTORIZADO (site institucional, Instagram e Facebook)", "campanha publicitária do produto/serviço [DESCRIÇÃO]"], vedado qualquer uso estranho a esta finalidade.

CLÁUSULA 2ª — DOS MEIOS DE DIVULGAÇÃO. Autorizam-se os seguintes meios [MANTENHA APENAS OS QUE AUTORIZAR]: internet e redes sociais; e-mail marketing; materiais impressos institucionais (catálogos, panfletos, cartazes); apresentações comerciais; peças audiovisuais.

CLÁUSULA 3ª — DO PRAZO. A presente autorização vigora pelo prazo de [PRAZO, ex.: "24 (vinte e quatro) meses"] a contar desta data. Findo o prazo, o AUTORIZADO deverá cessar novas veiculações e remover a imagem dos meios sob seu controle, ressalvados os exemplares já distribuídos e os usos já realizados de boa-fé.

CLÁUSULA 4ª — DA CONTRAPARTIDA. [ESCOLHA: "(a) A autorização é concedida a TÍTULO GRATUITO, não fazendo jus o AUTORIZANTE a qualquer remuneração" / "(b) A autorização é concedida mediante o pagamento de R$ [VALOR], quitado nesta data, a título de contrapartida única e integral"].

CLÁUSULA 5ª — DA PRESERVAÇÃO DA HONRA. O AUTORIZADO obriga-se a não editar, montar ou associar a imagem a contextos que atinjam a honra, a dignidade, a reputação ou a intimidade do AUTORIZANTE, nem a utilizá-la de forma vexatória, discriminatória ou ilícita.

CLÁUSULA 6ª — DA PROTEÇÃO DE DADOS. Tratando-se a imagem de dado pessoal, o AUTORIZADO compromete-se a observar a Lei nº 13.709/2018 (Lei Geral de Proteção de Dados — LGPD), utilizando a imagem estritamente para a finalidade autorizada.

CLÁUSULA 7ª — DA REVOGAÇÃO. A autorização poderá ser revogada a qualquer tempo, mediante comunicação escrita, sem efeito retroativo sobre os usos regularmente realizados até a data da revogação.

CLÁUSULA 8ª — DA RESPONSABILIDADE. O AUTORIZADO responde integralmente pelo uso da imagem nos limites deste instrumento, ressalvado que o uso indevido ou não autorizado da imagem sujeita o infrator à reparação por dano moral, na forma do art. 20 do Código Civil e do art. 5º, X, da Constituição Federal, sendo, ademais, presumido o dano quando a imagem é veiculada, sem autorização, com finalidade econômica ou comercial (conforme entendimento sumulado do Superior Tribunal de Justiça).

[SE O TITULAR FOR MENOR DE 18 ANOS, A AUTORIZAÇÃO DEVE SER FIRMADA POR AMBOS OS RESPONSÁVEIS LEGAIS.]

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_____________________________________
[NOME COMPLETO DO TITULAR / AUTORIZANTE]
CPF: [000.000.000-00]

Se menor de 18 anos:

_____________________________________
PAI / RESPONSÁVEL — CPF: [000.000.000-00]

_____________________________________
MÃE / RESPONSÁVEL — CPF: [000.000.000-00]
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
    content: `TERMO DE CONFIDENCIALIDADE (ACORDO DE NÃO DIVULGAÇÃO — NDA)

PARTE A: [NOME COMPLETO ou RAZÃO SOCIAL], CPF/CNPJ nº [000.000.000-00 / 00.000.000/0000-00], com sede/residência à [endereço completo], neste ato representada por [se pessoa jurídica, nome e qualificação do representante legal].

PARTE B: [NOME COMPLETO ou RAZÃO SOCIAL], CPF/CNPJ nº [000.000.000-00 / 00.000.000/0000-00], com sede/residência à [endereço completo], neste ato representada por [se pessoa jurídica, nome e qualificação do representante legal].

As partes acima qualificadas, observados os princípios da probidade e da boa-fé objetiva (arts. 113, 187 e 422 do Código Civil), têm entre si justo e contratado o presente Termo de Confidencialidade, mediante as cláusulas seguintes:

CLÁUSULA 1ª — DA FINALIDADE. As partes mantêm tratativas relativas a [DESCREVER, ex.: "eventual parceria comercial no segmento de [SEGMENTO]", "prestação de serviços de [SERVIÇO] pela PARTE A à PARTE B"], no contexto das quais poderão trocar informações de caráter sigiloso (a "Finalidade").

CLÁUSULA 2ª — DA INFORMAÇÃO CONFIDENCIAL. Considera-se "Informação Confidencial" toda e qualquer informação, escrita, verbal, visual, eletrônica ou em qualquer outro meio, identificada como tal ou que, por sua natureza, deva assim ser tratada, incluindo, sem limitação: (a) dados financeiros, contábeis e estratégicos; (b) listas de clientes, fornecedores e parceiros; (c) processos, métodos, fórmulas, know-how e segredos de negócio; (d) projetos em desenvolvimento; (e) código-fonte e documentação técnica; (f) qualquer outra informação de acesso não público.

CLÁUSULA 3ª — DAS OBRIGAÇÕES. Cada parte, na condição de receptora, obriga-se a: (a) manter sob estrito sigilo as Informações Confidenciais; (b) utilizá-las exclusivamente para a Finalidade; (c) não as divulgar, transferir, ceder, vender ou compartilhar com terceiros, sob qualquer forma; (d) restringir o acesso interno apenas aos colaboradores que efetivamente necessitem das informações, mediante compromisso equivalente de sigilo; (e) adotar medidas de segurança compatíveis; e (f) devolver ou destruir as Informações Confidenciais ao término da relação ou mediante simples solicitação da parte titular.

CLÁUSULA 4ª — DAS EXCEÇÕES. Não se sujeitam ao dever de sigilo as informações que: (a) já eram de domínio público antes do recebimento, ou nele ingressaram sem culpa da receptora; (b) foram obtidas licitamente de terceiro sem dever de confidencialidade; (c) foram independentemente desenvolvidas pela receptora; ou (d) devam ser reveladas por imposição legal, regulatória ou por ordem judicial — hipótese em que a receptora comunicará previamente a titular, quando possível, limitando a divulgação ao estritamente exigido.

CLÁUSULA 5ª — DA PROTEÇÃO DE DADOS. Havendo tratamento de dados pessoais, as partes obrigam-se a observar a Lei nº 13.709/2018 (LGPD).

CLÁUSULA 6ª — DO PRAZO. As obrigações de confidencialidade vigoram durante toda a relação entre as partes e pelo prazo de [PRAZO, ex.: "5 (cinco) anos"] após o seu término, qualquer que seja o motivo da extinção.

CLÁUSULA 7ª — DA PENALIDADE E DAS PERDAS E DANOS. O descumprimento de qualquer obrigação deste Termo sujeitará a parte infratora ao pagamento de multa não compensatória de R$ [VALOR DA MULTA], sem prejuízo da reparação integral dos danos materiais e morais causados (arts. 186, 187 e 927 do Código Civil) e das sanções por concorrência desleal previstas na Lei nº 9.279/1996, quando cabíveis.

CLÁUSULA 8ª — DA NÃO CONCESSÃO DE DIREITOS. Este Termo não transfere titularidade nem concede licença sobre as Informações Confidenciais, que permanecem de propriedade exclusiva da parte reveladora.

CLÁUSULA 9ª — DO FORO. Fica eleito o foro da Comarca de [CIDADE]/[UF] para dirimir qualquer controvérsia decorrente deste Termo.

E, por estarem justas e contratadas, assinam o presente em 2 (duas) vias de igual teor, na presença das testemunhas.

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
    content: `CARTA DE RENÚNCIA DE DIREITO

RENUNCIANTE: Eu, [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], portador da Cédula de Identidade RG nº [00.000.000] [órgão]/[UF], inscrito no CPF/MF sob o nº [000.000.000-00], residente e domiciliado à [endereço completo], no pleno gozo da minha capacidade civil e na melhor forma de direito,

DECLARO, de forma livre, consciente, espontânea e irrevogável, que RENUNCIO ao seguinte direito:

[DESCREVER COM PRECISÃO O DIREITO OBJETO DA RENÚNCIA. Exemplos:
- "À vaga de [CARGO], código [CÓDIGO], para a qual fui convocado(a) no Concurso Público nº [NÚMERO] da [ÓRGÃO/PREFEITURA/ENTIDADE], desistindo definitivamente da nomeação e posse."
- "À função e ao cargo de administrador da sociedade [RAZÃO SOCIAL], CNPJ nº [00.000.000/0000-00], para o qual fui eleito em [DATA], solicitando a averbação da renúncia na Junta Comercial."
- "À indenização a que teria direito em razão do Termo/Acordo firmado em [DATA] com [NOME DA OUTRA PARTE]."
- "À quota social correspondente a [PERCENTUAL]% do capital da sociedade [RAZÃO SOCIAL]."]

CLÁUSULA DE INTERPRETAÇÃO ESTRITA. Nos termos do art. 114 do Código Civil, a presente renúncia interpreta-se estritamente, alcançando exclusivamente o direito acima especificado, sem se estender a quaisquer outros.

CONDIÇÕES. Declaro que esta renúncia é:
( ) INCONDICIONAL, irrevogável e produtora de efeitos imediatos a contar desta data;
( ) CONDICIONADA a [CONDIÇÃO ESPECÍFICA, se aplicável], somente produzindo efeitos com o implemento da condição.

LIVRE MANIFESTAÇÃO. Declaro, ainda, que a presente renúncia é feita sem qualquer coação, dolo, erro, lesão ou vício de vontade, em pleno gozo das minhas faculdades mentais, ciente de suas consequências jurídicas.

[OBSERVAÇÃO PARA RENÚNCIA À HERANÇA: a renúncia à herança somente é válida quando feita expressamente por escritura pública ou por termo nos autos do inventário (art. 1.806 do Código Civil), não podendo ser parcial, condicional ou a termo (art. 1.808). Este modelo NÃO substitui o ato próprio para esse fim.]

Por ser expressão da verdade, firmo a presente.

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
    content: `TERMO DE ACORDO EXTRAJUDICIAL (TRANSAÇÃO)

PARTE A: [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], RG nº [00.000.000] [órgão]/[UF], residente à [endereço completo].

PARTE B: [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], RG nº [00.000.000] [órgão]/[UF], residente à [endereço completo].

As partes acima qualificadas, no exercício de sua plena capacidade civil e na melhor forma de direito, têm entre si justo e acordado o presente Termo de Acordo Extrajudicial, na modalidade de TRANSAÇÃO regida pelos arts. 840 a 850 do Código Civil, mediante concessões recíprocas quanto a direitos patrimoniais de caráter privado, nos seguintes termos:

CONSIDERANDO que existe entre as partes controvérsia originada de [DESCREVER A ORIGEM DO CONFLITO, ex.: "acidente automobilístico ocorrido em [DATA], na via [LOCAL], no qual o veículo da PARTE A colidiu com o veículo da PARTE B, causando-lhe danos materiais"];

CONSIDERANDO que ambas desejam prevenir ou encerrar o litígio de forma amigável, evitando os custos e a demora de uma demanda judicial;

CLÁUSULA 1ª — DO OBJETO E DAS CONCESSÕES RECÍPROCAS. As partes, mediante concessões mútuas, encerram em definitivo a controvérsia descrita, nos seguintes termos:
   a) a PARTE A pagará à PARTE B a quantia de R$ [VALOR] ([valor por extenso]), a título de [ex.: "reparação integral dos danos materiais decorrentes do evento"], da seguinte forma: [À VISTA, NESTA DATA / EM [N] PARCELAS MENSAIS DE R$ [VALOR], vencendo a primeira em [DATA], mediante PIX/transferência para a conta [BANCO/AG/CONTA]];
   b) a PARTE B, em contrapartida, declara que, com o cumprimento do ajustado, ficará plenamente ressarcida de todos os danos decorrentes do evento, outorgando à PARTE A, ao final, quitação geral e irrevogável.

CLÁUSULA 2ª — DA RENÚNCIA E DA INTERPRETAÇÃO RESTRITIVA. As partes renunciam, mútua e reciprocamente, a qualquer pretensão, ação judicial, reclamação administrativa, queixa ou representação decorrente exclusivamente do evento descrito. Nos termos do art. 843 do Código Civil, a presente transação interpreta-se restritivamente, alcançando somente a controvérsia aqui tratada.

CLÁUSULA 3ª — DA QUITAÇÃO. Cumpridas integralmente as obrigações da Cláusula 1ª, as partes se dão mútua, plena, geral e irrevogável quitação quanto ao objeto deste acordo, nada mais tendo a reclamar.

CLÁUSULA 4ª — DO DESCUMPRIMENTO E DA EXECUÇÃO. Firmado por duas testemunhas, o presente Termo constitui TÍTULO EXECUTIVO EXTRAJUDICIAL, nos termos do art. 784, inciso III, do Código de Processo Civil. Em caso de inadimplemento de qualquer obrigação, a parte prejudicada poderá promover a execução direta do valor devido, com vencimento antecipado das demais parcelas, incidindo multa de 10% (dez por cento) sobre o saldo, juros de mora de 1% ao mês e correção monetária, além das custas e honorários.

CLÁUSULA 5ª — DA HOMOLOGAÇÃO JUDICIAL. As partes poderão, se desejarem, submeter o presente acordo à homologação judicial, hipótese em que passará a constituir título executivo judicial (art. 515, inciso III, do Código de Processo Civil).

CLÁUSULA 6ª — DA LIVRE MANIFESTAÇÃO. As partes declaram firmar este Termo de forma livre, consciente e de boa-fé, sem coação, dolo, erro, lesão ou qualquer vício de vontade.

CLÁUSULA 7ª — DO FORO. Elegem as partes o foro da Comarca de [CIDADE]/[UF] para dirimir qualquer questão oriunda deste Termo.

E, por estarem justas e acordadas, assinam o presente em 2 (duas) vias de igual teor, na presença das duas testemunhas abaixo.

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
      "Pode ser levado a juiz para homologação, ganhando força adicional de sentença",
      "A transação só vale sobre direitos patrimoniais disponíveis — não serve para guarda de filhos ou direitos indisponíveis"
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
    content: `INSTRUMENTO PARTICULAR DE DOAÇÃO DE BEM MÓVEL

DOADOR: [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], RG nº [00.000.000] [órgão]/[UF], residente à [endereço completo].

DONATÁRIO: [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], RG nº [00.000.000] [órgão]/[UF], residente à [endereço completo].

As partes acima qualificadas têm, entre si, justo e contratado o presente instrumento de Doação, regido pelos arts. 538 a 564 do Código Civil, mediante as cláusulas seguintes:

CLÁUSULA 1ª — DO OBJETO. O DOADOR, por liberalidade e por conta de seu patrimônio, transfere ao DONATÁRIO, a título de doação pura e simples, o seguinte bem: [DESCREVER COM PRECISÃO, ex.: "veículo marca/modelo [MARCA/MODELO], ano/modelo [ANO/ANO], cor [COR], placa [PLACA], chassi [CHASSI], RENAVAM [RENAVAM], cujo CRV encontra-se em nome do DOADOR" / "quantia em dinheiro de R$ [VALOR], transferida via PIX/TED para a conta do DONATÁRIO"].

CLÁUSULA 2ª — DO VALOR. Atribui-se ao bem doado, para fins fiscais e tributários, o valor de R$ [VALOR] ([valor por extenso]).

CLÁUSULA 3ª — DA GRATUIDADE. A doação é feita a título inteiramente gratuito, em vida, motivada [SE PARENTE: "pelo vínculo familiar de [GRAU DE PARENTESCO] e pelo afeto entre as partes"], sem qualquer encargo, condição ou contraprestação, ressalvado o disposto na Cláusula 5ª.

CLÁUSULA 4ª — DA ACEITAÇÃO. O DONATÁRIO declara ACEITAR a presente doação, recebendo o bem no estado em que se encontra e dando-se por satisfeito.

CLÁUSULA 5ª — DO ADIANTAMENTO DA LEGÍTIMA (se aplicável). [INCLUIR SOMENTE SE A DOAÇÃO FOR DE ASCENDENTE A DESCENDENTE OU DE UM CÔNJUGE A OUTRO: "A presente doação importa ADIANTAMENTO DA LEGÍTIMA, devendo o bem ser conferido (trazido à colação) por ocasião da partilha da herança do DOADOR, nos termos dos arts. 544 e 2.002 do Código Civil, salvo dispensa expressa da colação, na forma da lei."]

CLÁUSULA 6ª — DA RESERVA DO NECESSÁRIO À SUBSISTÊNCIA. O DOADOR declara que a presente doação NÃO abrange a totalidade de seus bens, reservando patrimônio ou renda suficientes à própria subsistência, em observância ao art. 548 do Código Civil, e que não excede a parte de que poderia dispor em testamento (art. 549 do Código Civil).

CLÁUSULA 7ª — DO ITCMD. O Imposto sobre a Transmissão Causa Mortis e Doação (ITCMD), tributo estadual previsto no art. 155, inciso I, da Constituição Federal, será recolhido por [DONATÁRIO / DOADOR] junto à Secretaria da Fazenda do Estado de [UF], conforme a alíquota e a legislação estadual aplicáveis.

CLÁUSULA 8ª — DA TRANSFERÊNCIA. As partes obrigam-se a praticar os atos necessários à efetiva transferência do bem [ex.: "assinando o ATPV-e / CRV e promovendo a transferência do veículo junto ao DETRAN/[UF]"], correndo as despesas por conta de [PARTE RESPONSÁVEL].

E, por estarem justas e contratadas, assinam o presente em 2 (duas) vias, na presença das testemunhas.

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_____________________________________
DOADOR — [NOME COMPLETO]
CPF: [000.000.000-00]

_____________________________________
DONATÁRIO — [NOME COMPLETO]
CPF: [000.000.000-00]

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
    content: `NOTIFICAÇÃO EXTRAJUDICIAL — RESPOSTA A COBRANÇA INDEVIDA

À
[NOME/RAZÃO SOCIAL DA EMPRESA COBRADORA], inscrita no CNPJ sob o nº [00.000.000/0000-00], com sede à [endereço da empresa].
A/C: Departamento Jurídico / Ouvidoria / SAC.

ASSUNTO: Cobrança indevida — exigência de cessação imediata, baixa de restrição e devolução em dobro.

NOTIFICANTE: [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], RG nº [00.000.000] [órgão]/[UF], residente à [endereço completo], na condição de CONSUMIDOR (art. 2º do CDC).

O(A) Notificante vem, respeitosamente, expor e ao final requerer:

I — DOS FATOS

1. O(A) Notificante vem sofrendo cobrança promovida por essa empresa, referente a [DESCREVER, ex.: "a fatura nº [NÚMERO], no valor de R$ [VALOR], vencida em [DATA]", "tarifa de pacote de serviços debitada mensalmente na conta-corrente nº [NÚMERO], agência [AGÊNCIA], do [BANCO], desde [MÊS/ANO]", "débito automático mensal de 'seguro' no valor de R$ [VALOR]"].

2. A referida cobrança é INDEVIDA, pelas seguintes razões: [DESCREVER COM DATAS, ex.: "jamais contratei o serviço/produto cobrado"; "cancelei o contrato em [DATA], sob o protocolo nº [NÚMERO]"; "já quitei integralmente o valor em [DATA], conforme comprovante anexo"; "o serviço não foi prestado conforme o contratado"; "o valor cobrado diverge do efetivamente pactuado"].

II — DO DIREITO

3. A relação é regida pelo Código de Defesa do Consumidor (Lei nº 8.078/1990), aplicável inclusive às instituições financeiras, conforme entendimento sumulado do Superior Tribunal de Justiça.

4. A cobrança impugnada viola, em especial: o art. 39, incisos V e XII, do CDC (prática abusiva e cobrança de vantagem manifestamente excessiva); o art. 42, caput (vedação de expor o consumidor a ridículo ou constrangimento na cobrança); e o art. 51 (nulidade de cláusulas abusivas).

5. Nos termos do art. 42, parágrafo único, do CDC, "o consumidor cobrado em quantia indevida tem direito à repetição do indébito, por valor igual ao dobro do que pagou em excesso, acrescido de correção monetária e juros legais". Consoante entendimento consolidado do Superior Tribunal de Justiça, a devolução em dobro nas relações de consumo independe da comprovação de má-fé do fornecedor.

6. A cobrança vexatória ou com ameaça pode, ainda, configurar o crime do art. 71 do CDC.

III — DO PEDIDO / DA EXIGÊNCIA

7. Diante do exposto, REQUER-SE que essa empresa, no prazo de [PRAZO, ex.: "10 (dez) dias"] a contar do recebimento desta:
   a) CESSE IMEDIATAMENTE toda e qualquer cobrança relativa à matéria;
   b) ESTORNE ou DEVOLVA EM DOBRO o valor indevidamente cobrado, totalizando R$ [VALOR EM DOBRO, com correção e juros], mediante depósito na conta do(a) Notificante: [BANCO], agência [AG], conta corrente [CC], PIX [CHAVE];
   c) PROMOVA A BAIXA de eventual inscrição do nome do(a) Notificante nos cadastros de proteção ao crédito (SPC, Serasa) relacionada a essa cobrança;
   d) COMPROVE, por escrito, as providências adotadas.

IV — DA ADVERTÊNCIA

8. Não atendido este pleito no prazo, o(a) Notificante adotará as medidas administrativas e judiciais cabíveis, incluindo reclamação no Procon e na plataforma consumidor.gov.br e ação judicial (Juizado Especial Cível) com pedido de tutela de urgência, devolução em dobro, indenização por danos morais e demais cominações legais.

Termos em que, pede deferimento.

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_____________________________________
[NOME COMPLETO]
CPF: [000.000.000-00]

Anexos: cópia do RG e CPF; comprovante(s) da cobrança indevida; documentos que demonstram a sua improcedência.
`,
    notes: [
      "Envie por AR pelos Correios — guarde o comprovante de postagem e o AR de retorno",
      "Mantenha cópia de tudo em arquivo (físico e digital)",
      "Em paralelo, registre no Procon e em consumidor.gov.br — fortalece sua posição",
      "Se não houver resposta em 30 dias, considere ação no Juizado Especial Cível",
      "Tese útil: nas relações de consumo, o STJ dispensa a prova de má-fé para a devolução em dobro do valor cobrado indevidamente"
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
(Para fins de concessão da gratuidade da justiça — arts. 98 e 99 do CPC e Lei nº 1.060/1950)

Eu, [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], portador da Cédula de Identidade RG nº [00.000.000] [órgão]/[UF], inscrito no CPF/MF sob o nº [000.000.000-00], residente e domiciliado à [endereço completo], DECLARO, sob as penas da lei e para os fins dos arts. 98 e 99 do Código de Processo Civil e da Lei nº 1.060/1950, o seguinte:

1. NÃO POSSUO condições financeiras de arcar com as custas processuais, as taxas judiciárias, as despesas do processo e os honorários advocatícios e periciais sem prejuízo do meu sustento próprio e/ou do de minha família;

2. Atualmente exerço a atividade de [PROFISSÃO/OCUPAÇÃO], auferindo renda mensal aproximada de R$ [VALOR] ([valor por extenso]);

3. Minhas despesas mensais essenciais (moradia, alimentação, transporte, saúde, educação e vestuário) consomem, em regra, a totalidade dessa renda, somando cerca de R$ [VALOR];

4. NÃO sou proprietário de bens de valor expressivo, livres e disponíveis, aptos a fazer frente às despesas do processo;

5. Requeiro, portanto, a concessão dos BENEFÍCIOS DA GRATUIDADE DA JUSTIÇA, que compreendem as isenções previstas no art. 98, § 1º, do Código de Processo Civil;

6. Estou ciente de que, presumindo-se verdadeira a alegação de insuficiência de recursos deduzida por pessoa natural (art. 99, § 3º, do CPC), a parte contrária poderá impugná-la, e de que a prestação de declaração falsa configura o crime do art. 299 do Código Penal, sujeitando-me, ainda, ao pagamento de até o décuplo das despesas processuais a título de multa, na forma do art. 100, parágrafo único, do CPC.

Por ser expressão da verdade, firmo a presente para que produza seus regulares efeitos jurídicos.

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
    content: `CONTRATO DE COMODATO (EMPRÉSTIMO GRATUITO)

COMODANTE: [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], RG nº [00.000.000] [órgão]/[UF], residente à [endereço completo], proprietário do bem objeto deste contrato.

COMODATÁRIO: [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], RG nº [00.000.000] [órgão]/[UF], residente à [endereço completo].

As partes acima qualificadas têm, entre si, justo e contratado o presente Contrato de Comodato, regido pelos arts. 579 a 585 do Código Civil, mediante as cláusulas seguintes:

CLÁUSULA 1ª — DO OBJETO. O COMODANTE empresta gratuitamente ao COMODATÁRIO o seguinte bem infungível: [DESCREVER, ex.: "imóvel residencial situado à [endereço completo], composto por [cômodos]" / "veículo marca/modelo [MARCA/MODELO], ano [ANO], placa [PLACA], chassi [CHASSI], RENAVAM [RENAVAM]"], entregue no estado descrito na vistoria anexa.

CLÁUSULA 2ª — DA GRATUIDADE. O comodato é essencialmente gratuito (art. 579 do Código Civil), inexistindo aluguel, prestação, taxa ou qualquer contraprestação pelo uso do bem, sob pena de descaracterização do comodato.

CLÁUSULA 3ª — DO PRAZO. O prazo do comodato é de [PRAZO, ex.: "12 (doze) meses"], com início em [DATA] e término em [DATA], prorrogável mediante acordo escrito. [ALTERNATIVA POR PRAZO INDETERMINADO: "O prazo é indeterminado, presumindo-se o necessário ao uso concedido, podendo o COMODANTE reaver o bem mediante aviso prévio de 30 (trinta) dias."]

CLÁUSULA 4ª — DO USO E DA GUARDA. O COMODATÁRIO obriga-se a usar o bem exclusivamente para [FINALIDADE, ex.: "moradia própria e de sua família", "transporte particular", "uso profissional autorizado"], conservando-o como se seu próprio fora, com a diligência exigida pelo art. 582 do Código Civil, sob pena de responder por perdas e danos.

CLÁUSULA 5ª — DAS DESPESAS ORDINÁRIAS. Correm por conta do COMODATÁRIO todas as despesas de uso e gozo do bem, que, na forma do art. 584 do Código Civil, não poderão ser cobradas do COMODANTE, incluindo [LISTAR: no imóvel — "IPTU, condomínio, água, luz, gás e manutenção comum"; no veículo — "IPVA, licenciamento, seguro, combustível, manutenção e pneus"].

CLÁUSULA 6ª — DA CONSERVAÇÃO E DA RESPONSABILIDADE. O COMODATÁRIO responde pela guarda e conservação do bem, e, correndo risco de perecer conjuntamente o seu e o alheio, deverá priorizar o salvamento do bem emprestado, sob pena de responder pelo dano, ainda que fortuito, na forma do art. 583 do Código Civil. O desgaste natural decorrente do uso normal não enseja indenização.

CLÁUSULA 7ª — DA VEDAÇÃO À CESSÃO. É vedado ao COMODATÁRIO ceder, sublocar, emprestar ou de qualquer modo transferir o bem a terceiros sem autorização expressa e por escrito do COMODANTE, sob pena de rescisão imediata e responsabilização por perdas e danos.

CLÁUSULA 8ª — DA DEVOLUÇÃO. Findo o prazo ou solicitada a restituição na forma deste contrato, o COMODATÁRIO restituirá o bem no mesmo estado em que o recebeu, ressalvado o desgaste natural. A retenção indevida caracteriza esbulho e sujeita o comodatário à ação de reintegração de posse, além do aluguel-pena que o COMODANTE vier a arbitrar (art. 582, parte final, do Código Civil).

CLÁUSULA 9ª — DA RESTITUIÇÃO ANTECIPADA. Em caso de necessidade urgente e imprevista, reconhecida pelo juiz, poderá o COMODANTE suspender o uso e reaver o bem antes do prazo, nos termos do art. 581 do Código Civil.

CLÁUSULA 10ª — DO FORO. Fica eleito o foro da Comarca de [CIDADE]/[UF] para dirimir qualquer questão decorrente deste contrato.

E, por estarem justas e contratadas, assinam o presente em 2 (duas) vias, na presença das testemunhas.

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

CEDENTE: [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], RG nº [00.000.000] [órgão]/[UF], residente à [endereço completo].

CESSIONÁRIO: [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], RG nº [00.000.000] [órgão]/[UF], residente à [endereço completo].

DEVEDOR CEDIDO (somente em cessão de crédito): [NOME COMPLETO], inscrito no CPF/MF sob o nº [000.000.000-00], residente à [endereço completo].

As partes acima qualificadas têm, entre si, justo e contratado o presente Termo de Cessão de Direitos, regido pelos arts. 286 a 298 do Código Civil, mediante as cláusulas seguintes:

CLÁUSULA 1ª — DO OBJETO. O CEDENTE cede e transfere ao CESSIONÁRIO o seguinte direito: [DESCREVER COM PRECISÃO. Exemplos:
- "crédito de R$ [VALOR] que detém contra o DEVEDOR CEDIDO, decorrente de [origem, ex.: 'empréstimo celebrado em [DATA]'], com vencimento em [DATA]";
- "posição contratual de [COMPRADOR/CONTRATANTE] no Contrato de [DESCRIÇÃO] celebrado em [DATA] com [OUTRA PARTE]";
- "direitos hereditários que lhe cabem na sucessão de [NOME DO FALECIDO], aberta em [DATA]";
- "direitos patrimoniais de autor sobre a obra [TÍTULO], nos termos da Lei nº 9.610/1998"].

CLÁUSULA 2ª — DO VALOR. [ESCOLHA: "(a) A cessão é ONEROSA, pelo valor de R$ [VALOR], pago pelo CESSIONÁRIO ao CEDENTE nesta data via [forma de pagamento]" / "(b) A cessão é feita a TÍTULO GRATUITO, sem qualquer contraprestação"].

CLÁUSULA 3ª — DA RESPONSABILIDADE DO CEDENTE. [ESCOLHA: "(a) Na cessão onerosa, o CEDENTE responde pela EXISTÊNCIA do crédito/direito ao tempo da cessão (art. 295 do Código Civil), mas NÃO pela solvência do devedor (cessão pro soluto)" / "(b) O CEDENTE responde também pela SOLVÊNCIA do devedor, assumindo expressamente essa obrigação nos termos do art. 296 do Código Civil (cessão pro solvendo), limitada ao que recebeu, com juros e despesas"].

CLÁUSULA 4ª — DA NOTIFICAÇÃO DO DEVEDOR (somente em cessão de crédito). Nos termos do art. 290 do Código Civil, a cessão não tem eficácia em relação ao devedor senão quando a este notificada. O CEDENTE obriga-se a notificar o DEVEDOR CEDIDO no prazo de [ex.: "5 (cinco) dias"], passando o pagamento, a partir de então, a ser feito diretamente ao CESSIONÁRIO. Antes da notificação, o pagamento feito de boa-fé ao credor originário exonera o devedor.

CLÁUSULA 5ª — DA ENTREGA DE DOCUMENTOS. O CEDENTE entrega nesta data ao CESSIONÁRIO todos os documentos comprobatórios do direito cedido (contratos, títulos, recibos e demais provas), transmitindo-lhe os acessórios do crédito, na forma do art. 287 do Código Civil.

CLÁUSULA 6ª — DA IRREVOGABILIDADE. A presente cessão é firmada em caráter IRREVOGÁVEL e IRRETRATÁVEL, obrigando as partes e seus sucessores a qualquer título.

CLÁUSULA 7ª — DO FORO. Fica eleito o foro da Comarca de [CIDADE]/[UF] para dirimir qualquer questão decorrente deste Termo.

E, por estarem justas e contratadas, assinam o presente em 2 (duas) vias, na presença das testemunhas.

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
  },
  {
    slug: "recibo-de-aluguel",
    title: "Recibo de aluguel",
    category: "Recibos e quitações",
    description:
      "Modelo de recibo de aluguel para o locador comprovar o recebimento mensal e dar quitação ao inquilino, com mês de referência e valor.",
    legalBase: "Lei 8.245/1991 (Lei do Inquilinato); Código Civil, art. 320 (quitação).",
    fillingMinutes: 3,
    whenToUse: [
      "Para o locador comprovar o recebimento do aluguel do mês",
      "Para o inquilino guardar prova de pagamento",
      "Quando o pagamento é feito em dinheiro ou sem comprovante bancário automático"
    ],
    howToFill: [
      "Preencha o valor recebido por extenso e em número",
      "Indique o mês de referência do aluguel",
      "Descreva o imóvel locado (endereço)",
      "Assine como locador (quem recebe)"
    ],
    content: `RECIBO DE ALUGUEL

LOCADOR (quem recebe): [NOME COMPLETO], inscrito no CPF/MF sob o nº [000.000.000-00], residente à [endereço].
LOCATÁRIO (quem paga): [NOME COMPLETO], inscrito no CPF/MF sob o nº [000.000.000-00].
IMÓVEL LOCADO: [ENDEREÇO COMPLETO DO IMÓVEL].

RECEBI do LOCATÁRIO acima identificado a importância de R$ [VALOR] ([valor por extenso]), referente ao ALUGUEL do mês de [MÊS]/[ANO] do imóvel acima descrito.

DISCRIMINAÇÃO (se houver encargos, na forma do art. 22, VI, da Lei nº 8.245/91):
   - Aluguel: R$ [VALOR]
   - Condomínio: R$ [VALOR]
   - IPTU (parcela): R$ [VALOR]
   - Água/Luz/Gás: R$ [VALOR]
   - TOTAL RECEBIDO: R$ [VALOR TOTAL]

Para clareza e por ser verdade, firmo o presente recibo, dando ao LOCATÁRIO, na forma do art. 320 do Código Civil, plena, geral e irrevogável QUITAÇÃO do valor referente ao período acima, nada mais tendo a reclamar quanto a este mês.

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_____________________________________
[NOME COMPLETO DO LOCADOR]
CPF: [000.000.000-00]
`,
    notes: [
      "Guarde uma via assinada; recibos de aluguel comprovam o pagamento em eventual disputa",
      "Se houver encargos (condomínio, IPTU, água), discrimine os valores separadamente"
    ]
  },
  {
    slug: "recibo-de-doacao",
    title: "Recibo de doação",
    category: "Recibos e quitações",
    description:
      "Modelo de recibo de doação para comprovar a entrega gratuita de bem ou valor de uma pessoa a outra.",
    legalBase: "Código Civil, arts. 538 a 564 (Doação).",
    fillingMinutes: 4,
    whenToUse: [
      "Para registrar a doação de um valor em dinheiro",
      "Para comprovar a doação de um bem móvel (móveis, equipamentos)",
      "Como prova para fins de imposto de renda (doador e donatário declaram)"
    ],
    howToFill: [
      "Identifique o doador (quem dá) e o donatário (quem recebe)",
      "Descreva o bem ou valor doado de forma detalhada",
      "Indique que a doação é feita de forma gratuita e espontânea",
      "Assine; reconheça firma se o valor for expressivo"
    ],
    content: `RECIBO DE DOAÇÃO

DOADOR: [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], RG nº [00.000.000] [órgão]/[UF], residente à [endereço completo].

DONATÁRIO: [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], RG nº [00.000.000] [órgão]/[UF], residente à [endereço completo].

Pelo presente instrumento, e com fundamento no art. 538 do Código Civil (que define a doação como o contrato pelo qual uma pessoa, por liberalidade, transfere bens ou vantagens de seu patrimônio a outra), o DOADOR declara que DOA, de forma espontânea, gratuita e irrevogável, ao DONATÁRIO, o seguinte:

[DESCREVER O BEM OU VALOR — ex.: "a quantia de R$ 10.000,00 (dez mil reais), transferida via PIX/TED nesta data" / "o veículo marca/modelo [MARCA/MODELO], ano [ANO], placa [PLACA], RENAVAM [RENAVAM], chassi [CHASSI]" / "os móveis e equipamentos assim descritos: [LISTA]"].

O DONATÁRIO DECLARA ACEITAR a presente doação, recebendo o bem/valor em perfeito estado.

A presente doação é feita SEM QUALQUER ENCARGO OU CONDIÇÃO. [SE FOR DE ASCENDENTE A DESCENDENTE OU ENTRE CÔNJUGES: "Importa a doação adiantamento da legítima, sujeita à colação, na forma dos arts. 544 e 2.002 do Código Civil."]

O valor atribuído ao bem doado, para fins fiscais, é de R$ [VALOR], podendo incidir o ITCMD (imposto estadual), a ser recolhido conforme a legislação do Estado de [UF].

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_____________________________________
DOADOR — [NOME]   CPF: [000.000.000-00]

_____________________________________
DONATÁRIO — [NOME]   CPF: [000.000.000-00]

TESTEMUNHAS:

1. _________________________ Nome: _________________ CPF: _________________
2. _________________________ Nome: _________________ CPF: _________________
`,
    notes: [
      "Doação acima do limite de isenção pode gerar ITCMD (imposto estadual) — confira a alíquota do seu estado",
      "Doação de imóvel exige escritura pública em cartório de notas (CC, art. 541)",
      "Doador e donatário devem declarar a doação no imposto de renda"
    ]
  },
  {
    slug: "recibo-de-sinal-arras",
    title: "Recibo de sinal (arras)",
    category: "Recibos e quitações",
    description:
      "Modelo de recibo de sinal (arras) para comprovar o pagamento de entrada que confirma um negócio, normalmente de compra e venda.",
    legalBase: "Código Civil, arts. 417 a 420 (Arras).",
    fillingMinutes: 4,
    whenToUse: [
      "Ao reservar a compra de um imóvel ou veículo com entrada",
      "Para confirmar um negócio antes do contrato definitivo",
      "Quando as partes querem fixar consequências para a desistência"
    ],
    howToFill: [
      "Identifique quem paga e quem recebe o sinal",
      "Indique o valor do sinal e o negócio a que se refere",
      "Defina se as arras são confirmatórias ou penitenciais (com direito de arrependimento)",
      "Assine ambas as partes"
    ],
    content: `RECIBO DE SINAL (ARRAS)

QUEM RECEBE (vendedor/promitente): [NOME COMPLETO], inscrito no CPF/MF sob o nº [000.000.000-00], residente à [endereço].
QUEM PAGA (comprador/promitente): [NOME COMPLETO], inscrito no CPF/MF sob o nº [000.000.000-00], residente à [endereço].

RECEBI de QUEM PAGA a quantia de R$ [VALOR] ([valor por extenso]), a título de SINAL (ARRAS), referente ao negócio de [DESCREVER, ex.: "promessa de compra e venda do imóvel situado à [endereço]" / "compra e venda do veículo [MARCA/MODELO/PLACA]"], cujo valor total ajustado é de R$ [VALOR TOTAL].

NATUREZA DAS ARRAS (assinale UMA opção):
( ) ARRAS CONFIRMATÓRIAS (arts. 417 a 419 do Código Civil): o negócio está firmado; havendo execução, o sinal será imputado no preço ou devolvido; se QUEM PAGA der causa à inexecução, perderá o sinal; se QUEM RECEBE der causa, devolverá o sinal mais o equivalente, com correção monetária, juros e honorários, admitida ainda indenização suplementar se provado maior prejuízo.
( ) ARRAS PENITENCIAIS (art. 420 do Código Civil): estipulado o direito de arrependimento; quem se arrepender, se for QUEM PAGA, perde o sinal; se for QUEM RECEBE, devolve-o em dobro; nesse caso, as arras têm função unicamente indenizatória, não cabendo indenização suplementar.

DESTINAÇÃO DO SINAL: o valor será [( ) abatido do preço total na conclusão do negócio / ( ) tratado conforme o acordo acima].

E, por ser verdade, firmam ambas as partes o presente recibo.

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_____________________________________
QUEM RECEBE — [NOME]   CPF: [000.000.000-00]

_____________________________________
QUEM PAGA — [NOME]   CPF: [000.000.000-00]
`,
    notes: [
      "Arras confirmatórias reforçam o compromisso; arras penitenciais preveem o direito de arrependimento (CC, art. 420)",
      "Guarde o recibo até a assinatura do contrato definitivo"
    ]
  },
  {
    slug: "contrato-compra-venda-veiculo",
    title: "Contrato de compra e venda de veículo",
    category: "Contratos",
    description:
      "Modelo de contrato particular de compra e venda de veículo entre pessoas, com descrição do bem, valor e responsabilidade pela transferência.",
    legalBase: "Código Civil, arts. 481 a 532 (Compra e venda); CTB (transferência no Detran).",
    fillingMinutes: 8,
    whenToUse: [
      "Venda de carro ou moto entre particulares",
      "Para registrar valor, condições e data da entrega",
      "Para definir quem paga a transferência e os débitos pendentes"
    ],
    howToFill: [
      "Preencha os dados de vendedor e comprador",
      "Descreva o veículo (marca, modelo, ano, placa, RENAVAM, chassi)",
      "Defina o valor e a forma de pagamento",
      "Defina prazo para a transferência no Detran e quem arca com os custos"
    ],
    content: `CONTRATO PARTICULAR DE COMPRA E VENDA DE VEÍCULO

VENDEDOR: [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], RG nº [00.000.000] [órgão]/[UF], residente à [endereço completo].

COMPRADOR: [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], RG nº [00.000.000] [órgão]/[UF], residente à [endereço completo].

As partes têm, entre si, justo e contratado o presente Contrato de Compra e Venda de Veículo, regido pelos arts. 481 e seguintes do Código Civil, mediante as cláusulas seguintes:

CLÁUSULA 1ª — DO OBJETO. O VENDEDOR vende ao COMPRADOR o veículo automotor assim descrito: marca/modelo [MARCA/MODELO], ano de fabricação/modelo [ANO/ANO], cor [COR], combustível [COMBUSTÍVEL], placa [PLACA], RENAVAM nº [RENAVAM], chassi nº [CHASSI], hodômetro marcando [QUILOMETRAGEM] km.

CLÁUSULA 2ª — DO PREÇO E DA FORMA DE PAGAMENTO. O preço certo e ajustado é de R$ [VALOR] ([valor por extenso]), pago da seguinte forma: [DESCREVER, ex.: "à vista, nesta data, via PIX/TED, servindo o comprovante de recibo"; "sinal de R$ [VALOR] nesta data e saldo de R$ [VALOR] em [DATA]"; "parcelado em [N] vezes de R$ [VALOR]"].

CLÁUSULA 3ª — DA ENTREGA E DO ESTADO DO VEÍCULO. O COMPRADOR declara que vistoriou o veículo e o recebe no estado de conservação em que se encontra, ciente de [eventuais avarias/reparos pendentes, se houver: DESCREVER], recebendo-o nesta data com os documentos [CRLV / CRV / ATPV-e] e os itens de série.

CLÁUSULA 4ª — DA GARANTIA E DOS VÍCIOS. Tratando-se de venda entre particulares (não fornecedor), aplica-se a garantia legal contra vícios redibitórios prevista nos arts. 441 a 446 do Código Civil: o VENDEDOR responde pelos defeitos ocultos que tornem o veículo impróprio ao uso ou lhe diminuam o valor, existentes ao tempo da venda e desconhecidos do COMPRADOR, ressalvado o desgaste natural. [SE HOUVER CLÁUSULA DE CIÊNCIA: "O COMPRADOR declara ciência de que se trata de veículo usado, sujeito a desgaste."]

CLÁUSULA 5ª — DA TRANSFERÊNCIA. A transferência da propriedade junto ao órgão de trânsito (DETRAN/[UF]) será providenciada por [VENDEDOR / COMPRADOR] no prazo de [PRAZO, ex.: "30 (trinta) dias"], correndo as despesas (taxas, transferência, vistoria) por conta de [PARTE RESPONSÁVEL]. O VENDEDOR entrega, devidamente preenchido e assinado, o documento hábil à transferência (ATPV-e / CRV).

CLÁUSULA 6ª — DOS DÉBITOS E ENCARGOS. Os débitos incidentes sobre o veículo até a data da tradição (IPVA, licenciamento, multas, seguro obrigatório) são de responsabilidade do VENDEDOR; a partir da entrega, passam à responsabilidade do COMPRADOR. Recomenda-se ao VENDEDOR realizar a comunicação de venda ao órgão de trânsito, nos termos do art. 134 do Código de Trânsito Brasileiro (Lei nº 9.503/1997), para afastar sua responsabilidade solidária por penalidades posteriores.

CLÁUSULA 7ª — DAS DECLARAÇÕES. O VENDEDOR declara que o veículo é de sua legítima propriedade, livre e desembaraçado de ônus não informados, alienação fiduciária ou penhora, ressalvado o que constar expressamente neste contrato.

CLÁUSULA 8ª — DO FORO. Fica eleito o foro da Comarca de [CIDADE]/[UF] para dirimir qualquer questão decorrente deste contrato.

E, por estarem justas e contratadas, assinam o presente em 2 (duas) vias, na presença das testemunhas.

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_____________________________________
VENDEDOR — [NOME]   CPF: [000.000.000-00]

_____________________________________
COMPRADOR — [NOME]   CPF: [000.000.000-00]

TESTEMUNHAS:
1. _________________________ Nome: _________________ CPF: _________________
2. _________________________ Nome: _________________ CPF: _________________
`,
    notes: [
      "Faça a comunicação de venda ao DETRAN para não responder por multas posteriores",
      "Reconheça firma das assinaturas; preencha e assine o ATPV-e (CRV digital) para a transferência",
      "Confira débitos e restrições do veículo antes de assinar"
    ]
  },
  {
    slug: "contrato-emprestimo-mutuo",
    title: "Contrato de empréstimo de dinheiro (mútuo)",
    category: "Contratos",
    description:
      "Modelo de contrato de mútuo para registrar empréstimo de dinheiro entre pessoas, com valor, prazo, forma de devolução e juros se houver.",
    legalBase: "Código Civil, arts. 586 a 592 (Mútuo).",
    fillingMinutes: 6,
    whenToUse: [
      "Empréstimo de dinheiro entre familiares, amigos ou conhecidos",
      "Para ter prova do valor emprestado e do prazo de devolução",
      "Para definir juros e correção, se acordados"
    ],
    howToFill: [
      "Identifique o mutuante (quem empresta) e o mutuário (quem recebe)",
      "Indique o valor emprestado e a data da entrega",
      "Defina o prazo e a forma de devolução (à vista ou parcelado)",
      "Defina juros e correção, se houver (deixe claro o percentual)"
    ],
    content: `CONTRATO DE MÚTUO (EMPRÉSTIMO DE DINHEIRO)

MUTUANTE (quem empresta): [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], RG nº [00.000.000] [órgão]/[UF], residente à [endereço completo].

MUTUÁRIO (quem recebe): [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], RG nº [00.000.000] [órgão]/[UF], residente à [endereço completo].

As partes têm, entre si, justo e contratado o presente Contrato de Mútuo, regido pelos arts. 586 a 592 do Código Civil, mediante as cláusulas seguintes:

CLÁUSULA 1ª — DO OBJETO E DA ENTREGA. O MUTUANTE empresta ao MUTUÁRIO a quantia de R$ [VALOR] ([valor por extenso]), entregue nesta data por meio de [transferência bancária / PIX / dinheiro em espécie], cujo recebimento o MUTUÁRIO expressamente reconhece, transferindo-se-lhe a propriedade da quantia, na forma do art. 587 do Código Civil.

CLÁUSULA 2ª — DA DEVOLUÇÃO. O MUTUÁRIO obriga-se a restituir ao MUTUANTE igual quantia, da seguinte forma: [ESCOLHA: "à vista, até [DD/MM/AAAA]" / "em [N] parcelas mensais e sucessivas de R$ [VALOR], vencendo a primeira em [DD/MM/AAAA] e as demais no mesmo dia dos meses subsequentes"], mediante [PIX / transferência] para a conta do MUTUANTE: [BANCO/AG/CONTA].

CLÁUSULA 3ª — DOS JUROS E DA CORREÇÃO. [ESCOLHA: "(a) O empréstimo é gratuito, SEM incidência de juros remuneratórios" / "(b) Incidirão juros remuneratórios de [X]% ao mês e correção monetária pelo índice [ÍNDICE], observados os limites legais aplicáveis aos contratos entre particulares (art. 591 c/c art. 406 do Código Civil)"].

CLÁUSULA 4ª — DO INADIMPLEMENTO. Em caso de atraso, incidirão sobre a parcela vencida multa moratória de [2%] (dois por cento), juros de mora de 1% (um por cento) ao mês e correção monetária, vencendo-se antecipadamente as demais parcelas e ficando a dívida sujeita à cobrança judicial ou à execução.

CLÁUSULA 5ª — DO VENCIMENTO ANTECIPADO. Considerar-se-á antecipadamente vencida a dívida nas hipóteses do art. 333 do Código Civil, entre elas a insolvência do devedor e a cessação ou insuficiência das garantias.

CLÁUSULA 6ª — DO TÍTULO EXECUTIVO. As partes reconhecem que o presente contrato, assinado por elas e por duas testemunhas, constitui TÍTULO EXECUTIVO EXTRAJUDICIAL, na forma do art. 784, inciso III, do Código de Processo Civil.

CLÁUSULA 7ª — DO FORO. Fica eleito o foro da Comarca de [CIDADE]/[UF] para dirimir qualquer questão decorrente deste contrato.

E, por estarem justas e contratadas, assinam o presente em 2 (duas) vias, na presença das testemunhas.

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_____________________________________
MUTUANTE — [NOME]   CPF: [000.000.000-00]

_____________________________________
MUTUÁRIO — [NOME]   CPF: [000.000.000-00]

TESTEMUNHAS:
1. _________________________ Nome: _________________ CPF: _________________
2. _________________________ Nome: _________________ CPF: _________________
`,
    notes: [
      "Este contrato, assinado por 2 testemunhas, é título executivo extrajudicial (facilita a cobrança)",
      "Há limites legais para juros entre particulares — evite taxas abusivas",
      "Guarde o comprovante da transferência do valor emprestado"
    ]
  },
  {
    slug: "contrato-de-namoro",
    title: "Contrato de namoro",
    category: "Contratos",
    description:
      "Modelo de contrato de namoro, usado para deixar registrado que a relação é um namoro e não uma união estável, afastando efeitos patrimoniais.",
    legalBase: "Código Civil, art. 1.723 (união estável) — afasta sua caracterização.",
    fillingMinutes: 5,
    whenToUse: [
      "Quando o casal namora mas não quer constituir união estável",
      "Para deixar claro que não há intenção de constituir família no momento",
      "Para evitar discussão patrimonial futura sobre bens adquiridos individualmente"
    ],
    howToFill: [
      "Identifique as duas pessoas",
      "Declarem que se trata de namoro, sem intenção de constituir família agora",
      "Declarem que não há patrimônio comum nem dependência econômica",
      "Assinem; reconhecimento de firma reforça a prova"
    ],
    content: `CONTRATO DE NAMORO (DECLARAÇÃO DE RELACIONAMENTO)

PRIMEIRO DECLARANTE: [NOME COMPLETO 1], [nacionalidade], [estado civil], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], RG nº [00.000.000] [órgão]/[UF], residente à [endereço completo].

SEGUNDO DECLARANTE: [NOME COMPLETO 2], [nacionalidade], [estado civil], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], RG nº [00.000.000] [órgão]/[UF], residente à [endereço completo].

As partes acima, na qualidade de contratantes capazes e valendo-se da liberdade de contratar (art. 425 do Código Civil), DECLARAM, para os devidos fins de direito, o seguinte:

CLÁUSULA 1ª — DA NATUREZA DA RELAÇÃO. As partes mantêm relacionamento de NAMORO, pública e socialmente reconhecido como tal, pautado por afeto e companheirismo, porém SEM os requisitos configuradores da união estável.

CLÁUSULA 2ª — DA AUSÊNCIA DE OBJETIVO DE CONSTITUIR FAMÍLIA. As partes declaram que, no presente momento, NÃO têm o objetivo de constituição de família nos moldes do art. 1.723 do Código Civil, elemento subjetivo (animus) essencial à caracterização da união estável, razão pela qual o vínculo ora declarado com esta não se confunde.

CLÁUSULA 3ª — DA INDEPENDÊNCIA PATRIMONIAL. Cada parte conserva a titularidade e a administração exclusivas de seu próprio patrimônio, inexistindo bens adquiridos em comum, esforço comum ou qualquer intenção de comunhão patrimonial. Os bens que cada uma adquirir, por qualquer título, pertencerão exclusivamente ao respectivo adquirente.

CLÁUSULA 4ª — DA INEXISTÊNCIA DE DEPENDÊNCIA ECONÔMICA. Não há entre as partes dependência econômica, arcando cada qual com suas próprias despesas, sem obrigação de mútua assistência material.

CLÁUSULA 5ª — DA EVENTUAL EVOLUÇÃO DA RELAÇÃO. Caso a relação evolua e passe a reunir, de fato, os requisitos da união estável, as partes se comprometem a firmar instrumento próprio a respeito, produzindo esta declaração efeitos apenas enquanto retratar fielmente a realidade do relacionamento.

Por ser expressão da verdade, assinam o presente em 2 (duas) vias de igual teor.

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_____________________________________
[NOME 1]   CPF: [000.000.000-00]

_____________________________________
[NOME 2]   CPF: [000.000.000-00]

TESTEMUNHAS (recomendado):
1. _________________________ Nome: _________________ CPF: _________________
2. _________________________ Nome: _________________ CPF: _________________
`,
    notes: [
      "O contrato de namoro é um indício, mas não impede que a Justiça reconheça união estável se a convivência tiver, de fato, as características dela",
      "Reconhecer firma e atualizar o documento periodicamente fortalece a prova"
    ]
  },
  {
    slug: "notificacao-desocupacao-imovel",
    title: "Notificação para desocupação de imóvel",
    category: "Notificações",
    description:
      "Modelo de notificação extrajudicial do locador ao inquilino comunicando o fim da locação e solicitando a desocupação do imóvel.",
    legalBase: "Lei 8.245/1991 (Lei do Inquilinato), arts. 6º, 46 e 47.",
    fillingMinutes: 6,
    whenToUse: [
      "Fim do contrato de locação por prazo determinado",
      "Locação por prazo indeterminado que o locador deseja encerrar",
      "Antes de eventual ação de despejo, para constituir o inquilino em mora"
    ],
    howToFill: [
      "Identifique locador e inquilino e o imóvel",
      "Informe o motivo (fim do prazo, retomada) e a base contratual",
      "Conceda o prazo de desocupação previsto em lei/contrato (em geral 30 dias)",
      "Entregue com comprovante (AR, cartório de títulos ou e-mail com confirmação)"
    ],
    content: `NOTIFICAÇÃO EXTRAJUDICIAL PARA DESOCUPAÇÃO DE IMÓVEL

NOTIFICANTE (locador): [NOME COMPLETO], inscrito no CPF/MF sob o nº [000.000.000-00], residente à [endereço completo].
NOTIFICADO (locatário): [NOME COMPLETO], inscrito no CPF/MF sob o nº [000.000.000-00].
IMÓVEL: [ENDEREÇO COMPLETO DO IMÓVEL LOCADO].

Prezado(a) Sr.(a),

Na qualidade de locador do imóvel acima, com fundamento na Lei nº 8.245/1991 (Lei do Inquilinato), venho NOTIFICAR V. Sa. nos seguintes termos:

I — DA LOCAÇÃO. Entre as partes vigora o Contrato de Locação Residencial firmado em [DATA], com prazo [determinado, encerrado/a encerrar em [DATA] / indeterminado].

II — DO FUNDAMENTO E DA DENÚNCIA. [ESCOLHA A HIPÓTESE APLICÁVEL:
- "Tratando-se de locação por prazo igual ou superior a 30 (trinta) meses, findo o prazo ajustado, a locação cessa de pleno direito, sendo assegurado o prazo de 30 (trinta) dias para a desocupação, na forma do art. 46 da Lei nº 8.245/91."
- "Tratando-se de locação por prazo indeterminado, o locador denuncia a locação (denúncia vazia), concedendo o prazo de 30 (trinta) dias para a desocupação, na forma do art. 46, § 2º, da Lei nº 8.245/91."
- "Tratando-se de locação por prazo inferior a 30 meses já prorrogada por prazo indeterminado, a retomada observa as hipóteses do art. 47 da Lei nº 8.245/91."]

III — DA EXIGÊNCIA. Fica V. Sa. NOTIFICADO(A) a DESOCUPAR VOLUNTARIAMENTE o imóvel no prazo de [30 (trinta)] dias a contar do recebimento desta, entregando as chaves e o imóvel nas condições contratuais, livre de pessoas e bens, com os aluguéis e encargos integralmente quitados.

IV — DAS CONSEQUÊNCIAS. Não ocorrendo a desocupação no prazo assinalado, serão adotadas as medidas judiciais cabíveis, notadamente a AÇÃO DE DESPEJO (arts. 59 e seguintes da Lei nº 8.245/91), respondendo V. Sa. pelos aluguéis e encargos até a efetiva entrega das chaves, além das custas processuais e dos honorários advocatícios.

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_____________________________________
[NOME DO NOTIFICANTE — LOCADOR]
CPF: [000.000.000-00]
`,
    notes: [
      "Entregue de forma que gere prova do recebimento (AR dos Correios, cartório de títulos e documentos ou e-mail com confirmação de leitura)",
      "Os prazos variam conforme o tipo de contrato — confira o seu antes de notificar",
      "Esta notificação não é a ação de despejo em si; é o passo anterior"
    ]
  },
  {
    slug: "carta-de-pedido-de-demissao",
    title: "Carta de pedido de demissão",
    category: "Declarações",
    description:
      "Modelo de carta de pedido de demissão do empregado ao empregador, com a opção de cumprir ou não o aviso prévio.",
    legalBase: "CLT, art. 487 (aviso prévio).",
    fillingMinutes: 3,
    whenToUse: [
      "Quando o trabalhador decide sair do emprego por vontade própria",
      "Para formalizar a saída e a opção sobre o aviso prévio",
      "Para registrar a data do pedido"
    ],
    howToFill: [
      "Identifique o empregado e a empresa",
      "Informe a data a partir da qual deseja se desligar",
      "Indique se vai cumprir o aviso prévio ou pede dispensa do cumprimento",
      "Assine e peça uma via protocolada (recebida) pela empresa"
    ],
    content: `CARTA DE PEDIDO DE DEMISSÃO

À empresa [NOME/RAZÃO SOCIAL DA EMPRESA], inscrita no CNPJ sob o nº [00.000.000/0000-00], com sede à [endereço].
A/C: Departamento de Recursos Humanos / [NOME DO GESTOR].

Eu, [NOME COMPLETO DO EMPREGADO], inscrito no CPF/MF sob o nº [000.000.000-00], portador da CTPS nº [NÚMERO/SÉRIE] (ou CTPS digital), ocupante do cargo de [CARGO], admitido(a) em [DATA DE ADMISSÃO], venho, por meio desta, SOLICITAR o meu DESLIGAMENTO da empresa, por INICIATIVA PRÓPRIA, com efeitos a partir de [DATA].

DO AVISO PRÉVIO (art. 487 da CLT), assinale UMA opção:
( ) COMPROMETO-ME a cumprir o aviso prévio de 30 (trinta) dias, trabalhando normalmente até [DATA];
( ) SOLICITO a DISPENSA do cumprimento do aviso prévio, ciente de que, não sendo concedida a dispensa pelo empregador, poderá haver o desconto correspondente às verbas rescisórias, na forma do art. 487, § 2º, da CLT.

Requeiro, ainda:
   a) a baixa na Carteira de Trabalho (CTPS);
   b) o pagamento das verbas rescisórias devidas no prazo legal (art. 477, § 6º, da CLT);
   c) a entrega das guias e dos documentos rescisórios.

Declaro que o presente pedido é feito de forma livre e espontânea, sem qualquer coação.

Agradeço a oportunidade e a experiência profissional adquirida.

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_____________________________________
[NOME COMPLETO DO EMPREGADO]
CPF: [000.000.000-00]

RECEBIDO PELA EMPRESA em ___/___/______   Nome/assinatura de quem recebeu: __________________
`,
    notes: [
      "No pedido de demissão você não recebe seguro-desemprego nem multa de 40% do FGTS, e não saca o FGTS (salvo exceções)",
      "Se a empresa dispensar o cumprimento do aviso, não há desconto; se você não cumprir sem dispensa, pode haver desconto",
      "Peça uma via protocolada com data e assinatura de quem recebeu"
    ]
  },
  {
    slug: "autorizacao-viagem-menor-internacional",
    title: "Autorização de viagem internacional para menor",
    category: "Autorizações",
    description:
      "Modelo de autorização para menor de idade viajar ao exterior desacompanhado ou com apenas um dos pais, conforme exigências do ECA.",
    legalBase: "ECA (Lei 8.069/1990), arts. 83 a 85; Resolução CNJ nº 295/2019.",
    fillingMinutes: 6,
    whenToUse: [
      "Menor viajando ao exterior sem um ou ambos os pais",
      "Menor viajando com terceiro autorizado",
      "Para apresentar na imigração e na companhia aérea"
    ],
    howToFill: [
      "Identifique o menor e os pais/responsáveis",
      "Indique com quem o menor viaja e o destino",
      "Para viagem internacional, a firma deve ser reconhecida em cartório",
      "Leve duas vias originais"
    ],
    content: `AUTORIZAÇÃO DE VIAGEM INTERNACIONAL PARA CRIANÇA OU ADOLESCENTE
(Arts. 83 a 85 do Estatuto da Criança e do Adolescente — Lei nº 8.069/1990 — e Resolução CNJ nº 295/2019)

RESPONSÁVEIS LEGAIS:
PAI: [NOME COMPLETO DO PAI], [nacionalidade], [estado civil], inscrito no CPF sob o nº [000.000.000-00], RG/Passaporte nº [_______], residente à [endereço completo], telefone [(00) 00000-0000].
MÃE: [NOME COMPLETO DA MÃE], [nacionalidade], [estado civil], inscrita no CPF sob o nº [000.000.000-00], RG/Passaporte nº [_______], residente à [endereço completo], telefone [(00) 00000-0000].

MENOR: [NOME COMPLETO DO(A) MENOR], nascido(a) em [DD/MM/AAAA], natural de [CIDADE]/[UF], portador(a) do documento de identidade/Passaporte nº [_______].

Na qualidade de responsáveis legais, AUTORIZO(AMOS), de forma expressa, a viagem internacional do(a) referido(a) menor, nos termos do ECA e da Resolução CNJ nº 295/2019, na seguinte forma (assinale UMA opção):

( ) VIAJAR DESACOMPANHADO(A);
( ) VIAJAR NA COMPANHIA de [NOME DO ACOMPANHANTE], CPF/Passaporte nº [_______], com grau de parentesco/relação de [_______];
( ) VIAJAR NA COMPANHIA DE APENAS UM DOS GENITORES, [NOME DO GENITOR ACOMPANHANTE], ficando o outro genitor, ora signatário, ciente e de acordo.

DESTINO: [PAÍS / CIDADE].
PERÍODO: de [DATA] a [DATA] [ou "por prazo indeterminado, conforme o caso"].
FINALIDADE: [ex.: "turismo", "intercâmbio", "visita a familiares"].

A presente autorização é concedida para fins de embarque, desembarque, imigração e permanência no exterior durante o período indicado.

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_____________________________________
PAI — [NOME]   CPF: [000.000.000-00]

_____________________________________
MÃE — [NOME]   CPF: [000.000.000-00]
`,
    notes: [
      "Para viagem internacional, é OBRIGATÓRIO reconhecer firma por autenticidade em cartório",
      "Cada país e companhia aérea pode exigir formulário próprio — confira com antecedência",
      "Em caso de pais separados, em regra ambos precisam autorizar; havendo apenas um responsável legal, comprove com documento"
    ]
  },
  {
    slug: "procuracao-inss",
    title: "Procuração para o INSS",
    category: "Procurações",
    description:
      "Modelo de procuração para alguém representar o segurado junto ao INSS — agendar perícia, dar entrada em benefício, acompanhar processo.",
    legalBase: "Código Civil, arts. 653 a 692 (Mandato); normas de representação do INSS.",
    fillingMinutes: 5,
    whenToUse: [
      "Para um familiar dar entrada em benefício pelo segurado",
      "Para acompanhar processo administrativo no INSS",
      "Quando o segurado está impossibilitado de comparecer"
    ],
    howToFill: [
      "Preencha os dados do outorgante (segurado) e do procurador",
      "Especifique os poderes (requerer benefício, agendar perícia, receber comunicações)",
      "Anexe cópia dos documentos de ambos",
      "O INSS pode exigir reconhecimento de firma ou formulário próprio"
    ],
    content: `PROCURAÇÃO PARA REPRESENTAÇÃO JUNTO AO INSS
(Instrumento particular de mandato — arts. 653 e seguintes do Código Civil)

OUTORGANTE (segurado): [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], NIT/PIS/PASEP nº [00000000000], RG nº [00.000.000] [órgão]/[UF], residente e domiciliado à [endereço completo].

OUTORGADO (procurador): [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], RG nº [00.000.000] [órgão]/[UF], residente à [endereço completo].

Pelo presente instrumento particular, o OUTORGANTE nomeia e constitui seu bastante procurador o OUTORGADO, conferindo-lhe os poderes adiante especificados para representá-lo perante o INSTITUTO NACIONAL DO SEGURO SOCIAL (INSS) e a Perícia Médica Federal:

CLÁUSULA 1ª — DOS PODERES. O OUTORGADO fica autorizado a, em nome do OUTORGANTE: requerer, acompanhar e desistir de benefícios e serviços previdenciários; agendar, remarcar e comparecer a atendimentos e perícias médicas; apresentar, protocolar e retirar documentos e requerimentos; prestar e receber informações e comunicações; tomar ciência de exigências e de decisões; interpor recursos administrativos e apresentar defesas; e praticar os demais atos necessários ao andamento do processo administrativo.

CLÁUSULA 2ª — DO RECEBIMENTO DE VALORES. A presente procuração [ESCOLHA: "NÃO inclui" / "inclui, de forma expressa,"] poderes para receber, em nome do OUTORGANTE, valores relativos a benefícios. [ATENÇÃO: o recebimento de benefício por procurador está sujeito a regras específicas do INSS, exigindo, em regra, cadastro do procurador/representante legal e renovação periódica.]

CLÁUSULA 3ª — DA VALIDADE. A presente procuração vigora pelo prazo de [ex.: "12 (doze) meses"] a contar da assinatura, ou até a revogação, na forma dos arts. 682 e 686 do Código Civil.

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_____________________________________
[NOME DO OUTORGANTE — SEGURADO]
CPF: [000.000.000-00]
`,
    notes: [
      "O INSS costuma disponibilizar formulário próprio de procuração e exigir documentos do outorgante e do procurador",
      "Procuração para RECEBER o benefício tem regras mais rígidas (procurador/representante legal cadastrado)",
      "Reconhecimento de firma pode ser exigido"
    ]
  },
  {
    slug: "declaracao-de-dependente-economico",
    title: "Declaração de dependência econômica",
    category: "Declarações",
    description:
      "Modelo de declaração de que uma pessoa depende economicamente de outra, usada para fins previdenciários, planos de saúde, imposto de renda e benefícios.",
    legalBase: "Usada como prova para fins previdenciários, tributários e de benefícios (avaliada caso a caso).",
    fillingMinutes: 4,
    whenToUse: [
      "Comprovar dependência para pensão por morte no INSS",
      "Incluir dependente em plano de saúde ou imposto de renda",
      "Comprovar dependência de pais idosos, companheiro(a) ou enteado"
    ],
    howToFill: [
      "Identifique o declarante (mantenedor) e o dependente",
      "Descreva o vínculo e desde quando há dependência",
      "Recolha assinatura de 2 testemunhas (reforça a prova)",
      "Junte documentos que comprovem (comprovantes de despesas, mesma residência)"
    ],
    content: `DECLARAÇÃO DE DEPENDÊNCIA ECONÔMICA

DECLARANTE (mantenedor): [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], RG nº [00.000.000] [órgão]/[UF], residente à [endereço completo].

DEPENDENTE: [NOME COMPLETO], [nacionalidade], [estado civil], inscrito no CPF/MF sob o nº [000.000.000-00], residente à [endereço completo].

Eu, DECLARANTE acima qualificado, DECLARO, sob as penas da lei e para os devidos fins de direito, que:

1. O(A) DEPENDENTE acima identificado(a), na condição de [GRAU DE PARENTESCO/RELAÇÃO, ex.: "minha mãe", "meu pai", "meu companheiro(a)", "meu enteado(a)"], DEPENDE ECONOMICAMENTE de mim desde [DATA/PERÍODO], vivendo às minhas expensas;

2. Arco, de forma habitual, com as despesas de [DISCRIMINAR, ex.: "moradia, alimentação, vestuário, saúde e medicamentos"] do(a) referido(a) dependente, que [reside comigo no mesmo endereço / não possui renda própria suficiente ao seu sustento];

3. A presente declaração destina-se a [FINALIDADE, ex.: "comprovação de dependência econômica junto ao INSS para fins de pensão por morte", "inclusão como dependente em plano de saúde", "declaração no Imposto de Renda"];

4. Estou ciente de que a falsidade desta declaração configura o crime de falsidade ideológica (art. 299 do Código Penal) e pode acarretar a devolução de valores e demais responsabilizações.

Por ser expressão da verdade, firmo a presente, acompanhada, se possível, de documentos que comprovem o alegado.

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_____________________________________
DECLARANTE — [NOME]   CPF: [000.000.000-00]

TESTEMUNHAS:
1. _________________________ Nome: _____________ CPF: _____________
2. _________________________ Nome: _____________ CPF: _____________
`,
    notes: [
      "Para o INSS, a dependência de cônjuge/companheiro e filhos menores é presumida; para pais e irmãos deve ser comprovada",
      "A declaração isolada raramente basta — junte provas materiais (contas, comprovantes, mesma residência)",
      "Declaração falsa é crime"
    ]
  },
  {
    slug: "notificacao-troca-produto-defeito",
    title: "Notificação de troca de produto com defeito",
    category: "Notificações",
    description:
      "Modelo de notificação do consumidor ao fornecedor exigindo a solução de produto com defeito — conserto, troca ou devolução do valor.",
    legalBase: "Código de Defesa do Consumidor (Lei 8.078/1990), arts. 18 e 26.",
    fillingMinutes: 5,
    whenToUse: [
      "Produto com defeito não resolvido pela loja/fabricante",
      "Para registrar a reclamação e o prazo legal de 30 dias",
      "Antes de acionar Procon ou Justiça (Juizado Especial)"
    ],
    howToFill: [
      "Identifique o consumidor e o fornecedor (loja/fabricante)",
      "Descreva o produto, a data da compra e o defeito",
      "Indique a solução desejada (conserto, troca ou dinheiro de volta)",
      "Conceda prazo e guarde comprovante de envio"
    ],
    content: `NOTIFICAÇÃO EXTRAJUDICIAL — PRODUTO COM VÍCIO/DEFEITO (CDC)

NOTIFICANTE (consumidor): [NOME COMPLETO], [nacionalidade], [estado civil], [profissão], inscrito no CPF/MF sob o nº [000.000.000-00], RG nº [00.000.000] [órgão]/[UF], residente à [endereço completo].
NOTIFICADO (fornecedor): [NOME/RAZÃO SOCIAL], inscrito no CNPJ sob o nº [00.000.000/0000-00], com sede à [endereço].
A/C: SAC / Ouvidoria / Departamento Jurídico.

I — DOS FATOS

1. Em [DATA], o(a) Notificante adquiriu do Notificado o produto [DESCRIÇÃO — marca, modelo, nº de série], conforme nota fiscal nº [_______], no valor de R$ [VALOR].

2. O produto apresenta o seguinte VÍCIO/DEFEITO: [DESCREVER O DEFEITO], o que o torna [impróprio ao uso a que se destina / de valor diminuído].

3. [SE JÁ HOUVE RECLAMAÇÃO: "O problema foi comunicado ao Notificado em [DATA], sob o protocolo nº [_______], sem solução até o momento."]

II — DO DIREITO

4. A relação é de consumo, regida pela Lei nº 8.078/1990 (CDC). Nos termos do art. 18 do CDC, respondem os fornecedores, solidariamente, pelos vícios de qualidade que tornem o produto impróprio ou lhe diminuam o valor, dispondo de prazo máximo de 30 (trinta) dias para saná-los.

5. Não sanado o vício no prazo legal, faculta-se ao consumidor exigir, ALTERNATIVAMENTE e à sua escolha (art. 18, § 1º, do CDC): (a) a substituição do produto por outro da mesma espécie, em perfeitas condições de uso; (b) a restituição imediata da quantia paga, monetariamente atualizada, sem prejuízo de perdas e danos; ou (c) o abatimento proporcional do preço.

III — DA EXIGÊNCIA

6. Diante do exposto, o(a) Notificante EXIGE a seguinte solução: [INDICAR A OPÇÃO ESCOLHIDA — substituição / restituição do valor / abatimento], no prazo de [PRAZO, ex.: "10 (dez) dias"] a contar do recebimento desta.

IV — DA ADVERTÊNCIA

7. Não atendida a presente, o(a) Notificante adotará as medidas cabíveis junto ao Procon, à plataforma consumidor.gov.br e ao Poder Judiciário (Juizado Especial Cível), com pedido de restituição, cumprimento de obrigação e indenização por perdas e danos.

[CIDADE]/[UF], [DIA] de [MÊS] de [ANO].

_____________________________________
[NOME DO CONSUMIDOR]
CPF: [000.000.000-00]

Anexos: nota fiscal; fotos/laudo do defeito; protocolos de atendimento.
`,
    notes: [
      "Prazo para reclamar: 30 dias (produto não durável) ou 90 dias (durável), a contar da entrega ou do aparecimento do defeito oculto",
      "Guarde nota fiscal, fotos e o protocolo de envio desta notificação",
      "Defeito que cause dano à saúde/segurança (fato do produto) tem regras próprias e prazo de 5 anos"
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
