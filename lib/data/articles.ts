/**
 * Blog jurídico — Maio/2026
 *
 * Conteúdo seed (10 artigos) cobrindo as dores mais buscadas no Google
 * em direito de consumo do cidadão comum:
 *   - rescisão trabalhista, divórcio, pensão alimentícia, dívida indevida,
 *     INSS negado, inventário, multa de trânsito, processo do consumidor,
 *     acordo trabalhista, despejo.
 *
 * Estrutura:
 *   - Cada artigo é um objeto Article com slug estável, meta description,
 *     intro, body (markdown simplificado), FAQ curta e CTA para diretório.
 *   - O renderer (app/blog/[slug]/page.tsx) lê o body e formata em <h2>/<p>/<ul>.
 *   - Tags `[[premium]]`/`[[free]]` não são usadas — todos os artigos seed
 *     são públicos e o filtro authorRole só vale quando o usuário POSTA novo
 *     artigo via futuro fluxo no painel (não implementado nesta rodada).
 *
 * Manutenção:
 *   - Para acrescentar artigo, basta adicionar mais um objeto ao array
 *     ARTICLES abaixo. Slug precisa ser único e kebab-case.
 *   - Datas em ISO (YYYY-MM-DD). updatedAt opcional.
 *
 * E-E-A-T:
 *   - Cada artigo cita base legal (CLT, CC, CDC, Lei 8.213/91 etc.) explícita
 *     e indica quando o leitor deve procurar advogado. Isso ancora autoridade
 *     e cumpre o requisito Google YMYL para conteúdo jurídico.
 */

/**
 * Ferramentas interativas embutidas no corpo do artigo (renderizadas por
 * components/ArticleTools.tsx). Servem para prender a atenção e tornar tema
 * técnico imersivo — sem coletar dados, sem valor estatístico.
 */
export type ArticleToolData =
  | {
      tool: "perspectiva";
      pergunta: string;
      ladoA: { rotulo: string; argumento: string };
      ladoB: { rotulo: string; argumento: string };
    }
  | {
      tool: "timeline";
      titulo: string;
      etapas: Array<{ titulo: string; texto: string }>;
    }
  | {
      tool: "quiz";
      pergunta: string;
      opcoes: Array<{ texto: string; correta?: boolean; explicacao: string }>;
    }
  | {
      tool: "revela";
      titulo: string;
      itens: Array<{ termo: string; definicao: string }>;
    };

export type ArticleSection =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; text: string }
  | ({ type: "tool" } & ArticleToolData);

export type ArticleFAQ = { question: string; answer: string };

export type Article = {
  slug: string;
  title: string;
  /** Linha-fina mostrada no card de listagem e como description SEO. Max ~160 chars. */
  excerpt: string;
  /** Palavra-chave principal — usada no H1 e como tag única no chip. */
  category: string;
  /** Estimativa de tempo de leitura. */
  readingMinutes: number;
  publishedAt: string;
  updatedAt?: string;
  /** Autor exibido. "Equipe AdvAqui" para artigos seed; futuramente vira nome do advogado premium que postou. */
  author: string;
  /** Selo opcional. "Equipe" (seed), "Advogado Premium" ou "Admin" (postagens futuras). */
  authorRole: "Equipe" | "Advogado Premium" | "Admin";
  /** Lead paragraph (intro). Aparece como <p> destacado abaixo do título. */
  intro: string;
  /** Corpo do artigo dividido em sections para renderização tipada. */
  body: ArticleSection[];
  /** FAQ Schema.org. 3-6 perguntas curtas. */
  faq: ArticleFAQ[];
  /** Sugestão de slug das cidades onde puxar advogados relacionados (opcional, futuramente). */
  relatedSpecialty?: string;
};

export const ARTICLES: Article[] = [
  {
    slug: "fui-demitido-sem-justa-causa",
    title: "Fui demitido sem justa causa, e agora? Direitos e como calcular sua rescisão",
    excerpt:
      "Saiba quais verbas você tem direito a receber, prazos legais para o pagamento e o que fazer se a empresa atrasar ou pagar a menos.",
    category: "Trabalhista",
    readingMinutes: 9,
    publishedAt: "2026-05-10",
    author: "Equipe AdvAqui",
    authorRole: "Equipe",
    relatedSpecialty: "trabalhista",
    intro:
      "Receber a notícia da demissão sem justa causa nunca é simples — mas a lei garante uma série de direitos ao trabalhador. Entender o que receber, em quanto tempo e como conferir os cálculos protege seu dinheiro e evita o famoso 'desconto indevido' no acerto final.",
    body: [
      { type: "h2", text: "O que é demissão sem justa causa" },
      {
        type: "p",
        text: "É quando o empregador decide encerrar o contrato sem que o trabalhador tenha cometido falta grave (definidas no art. 482 da CLT). É a forma de desligamento mais comum e a que gera o maior pacote de verbas rescisórias."
      },
      { type: "h2", text: "Quais verbas você tem direito a receber" },
      {
        type: "ul",
        items: [
          "Saldo de salário — dias trabalhados no mês da demissão",
          "Aviso prévio (indenizado ou trabalhado) — mínimo de 30 dias + 3 dias por ano de empresa, limitado a 90 dias",
          "Férias vencidas + 1/3 constitucional, se houver",
          "Férias proporcionais + 1/3 constitucional",
          "13º salário proporcional",
          "FGTS depositado durante todo o contrato",
          "Multa de 40% sobre o saldo total do FGTS",
          "Liberação do seguro-desemprego (3 a 5 parcelas, conforme tempo de trabalho)"
        ]
      },
      { type: "h2", text: "Em quanto tempo o pagamento precisa ser feito" },
      {
        type: "p",
        text: "Segundo o art. 477, §6º da CLT, o prazo é de 10 dias corridos a partir do término do contrato. Se a empresa atrasar, paga multa equivalente a um salário do trabalhador (art. 477, §8º), salvo quando o atraso for por culpa do próprio empregado."
      },
      { type: "h2", text: "Como conferir se a empresa pagou corretamente" },
      {
        type: "ol",
        items: [
          "Peça o TRCT (Termo de Rescisão do Contrato de Trabalho) completo, mesmo que a homologação seja só no banco",
          "Compare o saldo do FGTS extraído pelo app Caixa Trabalhador com o valor declarado pela empresa",
          "Confira o valor médio dos últimos 12 salários (base para o cálculo do 13º proporcional)",
          "Verifique se há horas extras, comissões ou prêmios habituais que deveriam compor a base de cálculo",
          "Confira se foi descontado mais do que o legalmente permitido (vale-transporte só desconta 6%)"
        ]
      },
      {
        type: "callout",
        text: "Atenção: o trabalhador tem 2 anos após o fim do contrato para ajuizar reclamação trabalhista cobrando diferenças (art. 7º, XXIX da Constituição). Depois disso, a maior parte dos direitos prescreve."
      },
      { type: "h2", text: "E se a empresa pediu para eu 'pedir demissão'?" },
      {
        type: "p",
        text: "Cuidado. Se você assinou pedido de demissão sob pressão para tentar 'fechar' o acerto rápido, você abre mão de aviso, multa de 40%, seguro-desemprego e saque do FGTS. Em caso de coação ou fraude (a chamada demissão simulada), é possível reverter na Justiça do Trabalho — mas é preciso prova (testemunhas, mensagens, áudios)."
      },
      { type: "h2", text: "Acordo entre empregado e empregador (art. 484-A da CLT)" },
      {
        type: "p",
        text: "Desde a Reforma Trabalhista (2017), é possível um 'meio-termo' formal: o trabalhador recebe metade do aviso prévio, metade da multa do FGTS, saca até 80% do FGTS, mas perde o seguro-desemprego. Vale a pena quando há acordo real entre as partes — não quando é forçado pela empresa."
      },
      { type: "h2", text: "Quando procurar um advogado trabalhista" },
      {
        type: "p",
        text: "Procure imediatamente se: o pagamento atrasou mais de 10 dias; valores aparentemente menores que o esperado; pressão para assinar 'pedido de demissão' ou 'acordo' verbal sem cálculos; horas extras habituais não pagas; assédio moral durante o aviso prévio; recusa de baixa na carteira (CTPS). A consulta inicial costuma ser gratuita."
      }
    ],
    faq: [
      {
        question: "Quanto tempo demora para sair o seguro-desemprego?",
        answer:
          "Em média 30 dias entre o requerimento e o pagamento da primeira parcela. O requerimento é feito pelo app Carteira de Trabalho Digital ou no portal gov.br, entre o 7º e o 120º dia após a dispensa."
      },
      {
        question: "Posso ser demitido em férias?",
        answer:
          "Não. O aviso prévio não pode coincidir com férias, e a CLT proíbe a demissão durante o gozo de férias. A empresa deve aguardar o retorno ou pagar férias dobradas."
      },
      {
        question: "Tenho direito à PLR se fui demitido?",
        answer:
          "Sim, proporcionalmente ao tempo trabalhado no período de apuração, salvo cláusula em acordo coletivo restringindo. A Súmula 451 do TST garante esse direito."
      },
      {
        question: "Se eu já recebi o acerto, posso reclamar depois?",
        answer:
          "Sim. O recibo da rescisão não é quitação total das obrigações trabalhistas (Súmula 330 do TST). Você tem 2 anos para ingressar com ação cobrando diferenças, e a ação cobre até 5 anos retroativos."
      }
    ]
  },
  {
    slug: "como-pedir-divorcio",
    title: "Como pedir o divórcio em 2026: extrajudicial, judicial, custos e prazos",
    excerpt:
      "Diferenças entre divórcio em cartório e na Justiça, documentos necessários, partilha de bens e quando contratar advogado.",
    category: "Família",
    readingMinutes: 8,
    publishedAt: "2026-05-09",
    author: "Equipe AdvAqui",
    authorRole: "Equipe",
    relatedSpecialty: "familia",
    intro:
      "Desde 2010 (EC 66) o divórcio no Brasil é direto: não precisa mais de separação prévia. Mas o caminho concreto — cartório ou Justiça — depende de duas variáveis: existem filhos menores ou incapazes? Há acordo entre o casal?",
    body: [
      { type: "h2", text: "Divórcio extrajudicial (em cartório)" },
      {
        type: "p",
        text: "Regulado pela Lei 11.441/2007 e pela Resolução 35 do CNJ. É a forma mais rápida e barata, mas só funciona quando: ambos concordam em todos os pontos (partilha, eventual pensão entre cônjuges, sobrenome) e não há filhos menores nem maiores incapazes. Resolve em uma única tarde na maioria dos cartórios de Notas."
      },
      { type: "h2", text: "Divórcio judicial" },
      {
        type: "p",
        text: "Obrigatório quando há filhos menores ou incapazes, ou quando o casal não concorda com algum ponto. Mesmo nesses casos pode ser 'consensual' (acordo) ou 'litigioso' (briga sobre algum ponto). Consensual sai em 30 a 90 dias na maioria das comarcas. Litigioso pode levar 1 a 3 anos."
      },
      { type: "h2", text: "Documentos necessários" },
      {
        type: "ul",
        items: [
          "RG e CPF dos cônjuges",
          "Comprovante de residência atual",
          "Certidão de casamento atualizada (emitida há menos de 90 dias)",
          "Certidão de nascimento dos filhos (se houver)",
          "Pacto antenupcial, se houver",
          "Documentos dos bens a partilhar — matrícula de imóveis, documentos de veículos, extratos bancários",
          "Última declaração do Imposto de Renda dos dois"
        ]
      },
      { type: "h2", text: "Quanto custa o divórcio" },
      {
        type: "ul",
        items: [
          "Cartório (extrajudicial): emolumentos variam por estado, em média entre R$ 400 e R$ 1.500. Casais sem condições têm direito à gratuidade",
          "Judicial: custas do TJ (de R$ 300 a R$ 1.500, dependendo do valor da causa) — também há gratuidade para hipossuficientes",
          "Honorários do advogado: o piso da OAB varia por estado, em geral entre R$ 2.000 e R$ 5.000 no consensual",
          "ITBI e ITCMD: se houver bens, parte da partilha pode gerar tributo"
        ]
      },
      { type: "h2", text: "Partilha de bens" },
      {
        type: "p",
        text: "Depende do regime de bens escolhido no casamento. Sem pacto antenupcial, o regime padrão a partir de 1977 é o de comunhão parcial — bens adquiridos durante o casamento se dividem 50%/50%, com exceções: herança, doação personalíssima e bens anteriores ao casamento permanecem do dono original."
      },
      { type: "h2", text: "Guarda dos filhos" },
      {
        type: "p",
        text: "Desde 2014 (Lei 13.058) a regra padrão é a guarda compartilhada — os dois pais decidem juntos as questões relevantes da vida da criança, e o convívio é alternado conforme acordo ou determinação judicial. Guarda unilateral só quando há motivo concreto: violência, dependência química, abandono."
      },
      { type: "h2", text: "Pensão alimentícia entre cônjuges" },
      {
        type: "p",
        text: "Não é automática. Só cabe se um dos cônjuges não tiver condições de se sustentar e o outro tiver capacidade financeira. Costuma ser temporária (1 a 2 anos), tempo suficiente para o ex-cônjuge se reerguer profissionalmente."
      },
      {
        type: "callout",
        text: "Aviso importante: mesmo no divórcio em cartório, advogado é obrigatório por lei. Pode ser um advogado representando ambos (quando há acordo total) ou um para cada parte."
      },
      { type: "h2", text: "Quando o divórcio precisa virar judicial" },
      {
        type: "ol",
        items: [
          "Filhos menores ou incapazes (mesmo com acordo total)",
          "Discordância sobre partilha, pensão ou guarda",
          "Cônjuge desaparecido ou em local incerto",
          "Cônjuge se recusa a assinar",
          "Existência de bens em outro país",
          "Cônjuge estrangeiro sem residência no Brasil"
        ]
      },
      { type: "h2", text: "Mudança de nome" },
      {
        type: "p",
        text: "É opcional. O cônjuge que mudou o nome no casamento pode escolher voltar ao nome de solteiro ou manter o de casado. Desde 2019 (STJ, REsp 1.873.918) é permitido voltar a usar o nome de casado mesmo após o divórcio, em casos justificados."
      }
    ],
    faq: [
      {
        question: "Posso me divorciar sem o cônjuge concordar?",
        answer:
          "Sim. Desde a EC 66/2010, o divórcio é direito potestativo — basta a vontade de um. Se o outro não concordar com a partilha ou pensão, essas questões podem ser resolvidas separadamente, sem travar o divórcio em si."
      },
      {
        question: "Quanto tempo demora o divórcio judicial?",
        answer:
          "Consensual com filhos menores: 30 a 90 dias. Litigioso: 1 a 3 anos na média. Recursos podem estender. A partilha de bens, quando complexa, costuma andar separada do decreto do divórcio."
      },
      {
        question: "Se eu estou casado em comunhão parcial e meu cônjuge tem dívida, eu respondo?",
        answer:
          "Em regra, dívidas contraídas em benefício da família comprometem o patrimônio do casal. Dívidas pessoais do outro cônjuge (apostas, fiança em terceiros sem sua anuência) não respingam — mas a comprovação fica com você."
      },
      {
        question: "Posso me divorciar grávida?",
        answer:
          "Sim, sem restrição. A presunção legal de paternidade (art. 1.597 do CC) protege a criança independentemente do divórcio em si."
      }
    ]
  },
  {
    slug: "como-pedir-pensao-alimenticia",
    title: "Como pedir pensão alimentícia: para filhos, ex-cônjuges e pais idosos",
    excerpt:
      "Quem tem direito, como calcular o percentual sobre o salário, prazo de pagamento e o que fazer quando não recebe.",
    category: "Família",
    readingMinutes: 9,
    publishedAt: "2026-05-08",
    author: "Equipe AdvAqui",
    authorRole: "Equipe",
    relatedSpecialty: "familia",
    intro:
      "Pensão alimentícia no Brasil não é favor — é obrigação legal baseada no binômio necessidade × possibilidade, definido pelo art. 1.694 do Código Civil. Funciona entre pais e filhos, entre ex-cônjuges em casos específicos e até entre filhos adultos e pais idosos sem condição de se sustentar.",
    body: [
      { type: "h2", text: "Quem pode pedir pensão alimentícia" },
      {
        type: "ul",
        items: [
          "Filhos menores de 18 anos — até completarem a maioridade",
          "Filhos universitários — em regra até 24 anos, enquanto comprovarem matrícula em ensino superior",
          "Filhos com deficiência ou incapacidade — sem limite de idade",
          "Cônjuge ou ex-cônjuge sem condição de se sustentar",
          "Pais idosos sem renda — pelos filhos com capacidade financeira",
          "Companheiros de união estável reconhecida"
        ]
      },
      { type: "h2", text: "Como o valor é calculado" },
      {
        type: "p",
        text: "O Código Civil não fixa percentual — define o binômio necessidade × possibilidade. Na prática, a Justiça brasileira costuma fixar entre 20% e 30% dos rendimentos líquidos do alimentante para o sustento de um filho. Esse percentual incide sobre salário, 13º, férias, PLR e outras verbas recorrentes."
      },
      { type: "h2", text: "Pensão para filho de pai desempregado ou autônomo" },
      {
        type: "p",
        text: "Quando o alimentante não tem renda fixa registrada, a Justiça pode fixar a pensão em múltiplos do salário mínimo (ex.: 30% a 50% do salário mínimo nacional). Em alguns casos, calcula com base em sinais externos de riqueza — veículo, imóvel, padrão de vida — quando há sinais de informalidade."
      },
      { type: "h2", text: "Como pedir judicialmente" },
      {
        type: "ol",
        items: [
          "Reúna documentos: certidão de nascimento do filho, comprovantes de despesas (escola, plano de saúde, mensalidade, alimentação, transporte)",
          "Demonstre, na medida do possível, a renda do outro (recibos, prints de redes sociais sobre viagens, declarações de IR se acessíveis)",
          "Procure a Defensoria Pública (se hipossuficiente) ou advogado de família",
          "É possível pedir pensão provisória (em poucos dias) e pensão definitiva (ao final da ação)",
          "Audiência conciliatória costuma ser a primeira etapa"
        ]
      },
      { type: "h2", text: "O que fazer quando o devedor não paga" },
      {
        type: "p",
        text: "A Lei 5.478/68 (Lei de Alimentos) e o CPC oferecem ferramentas duras. As três principais são: protesto da dívida em cartório, inscrição em órgãos de proteção ao crédito (SPC/Serasa), e, no caso de débito recente (até 3 prestações atrasadas), prisão civil por até 90 dias — sim, prisão mesmo, mecanismo que continua em uso no Brasil."
      },
      {
        type: "callout",
        text: "Importante: a pensão alimentícia não pode ser usada para 'punir' o ex-cônjuge ou 'chantagem' financeira. A criança é a credora — não o pai/mãe que está com a guarda."
      },
      { type: "h2", text: "Pensão para ex-cônjuge" },
      {
        type: "p",
        text: "Não é regra. Cabe quando o ex-cônjuge comprova que não tem condições de se sustentar (saúde precária, longo afastamento do mercado de trabalho, idade avançada). Tende a ser temporária — STJ entende que pensão entre adultos saudáveis deve ter prazo razoável para que o ex-cônjuge se reestabeleça."
      },
      { type: "h2", text: "Pensão alimentícia para os pais (alimentos avoengos invertidos)" },
      {
        type: "p",
        text: "Art. 1.696 do CC. Pais idosos sem renda têm direito a receber pensão dos filhos com capacidade. Vale também para netos, em casos específicos. É comum em famílias onde um dos filhos sustenta o pai/mãe sozinho — pode-se pedir contribuição dos irmãos por essa via."
      },
      { type: "h2", text: "Pensão pode ser revista?" },
      {
        type: "p",
        text: "Sim. A qualquer momento ambos os lados podem pedir revisão judicial — para mais ou para menos — quando há mudança da situação financeira (desemprego do alimentante, novo casamento com filho, aumento das despesas da criança). Ação de revisão é específica e exige prova da mudança."
      }
    ],
    faq: [
      {
        question: "Quanto tempo a pensão demora para começar a sair?",
        answer:
          "A pensão provisória (alimentos provisórios, art. 4º da Lei 5.478/68) pode sair em até 10 dias após a entrada da ação, se o pedido vier instruído com prova mínima de paternidade/dependência."
      },
      {
        question: "Pensão alimentícia conta como renda no IR?",
        answer:
          "Para o recebedor, sim — desde 2022, após decisão do STF (ADI 5.422), a pensão paga a filhos NÃO é mais tributada como rendimento da criança. Mas o pagador continua podendo deduzir até o limite do IR de pessoa física."
      },
      {
        question: "Posso parar de pagar quando o filho fizer 18 anos?",
        answer:
          "Não automaticamente. A maioridade não extingue a pensão por si só. É preciso ação judicial de exoneração, na qual o pai prova que o filho tem condições próprias ou já não está mais estudando."
      },
      {
        question: "Tenho como saber se meu ex omite renda?",
        answer:
          "Sim. Por meio de ofícios judiciais, o juiz pode pedir extratos bancários, declarações de IR, registros de empresa no CNPJ e movimentação imobiliária no cartório. Em alguns casos, audiência com testemunhas confirma padrão de vida incompatível com o declarado."
      }
    ]
  },
  {
    slug: "banco-cobrou-taxa-indevida",
    title: "O banco me cobrou taxa indevida: como conseguir o dinheiro de volta",
    excerpt:
      "Tarifas abusivas, débitos não reconhecidos, cobrança duplicada — como provar, em quem reclamar e quanto recuperar.",
    category: "Consumidor",
    readingMinutes: 8,
    publishedAt: "2026-05-07",
    author: "Equipe AdvAqui",
    authorRole: "Equipe",
    relatedSpecialty: "civil",
    intro:
      "O Banco Central determinou um rol restritivo de tarifas que instituições financeiras podem cobrar. Tudo o que estiver fora disso, ou foi cobrado sem autorização escrita do cliente, configura cobrança indevida — e dá direito à devolução em dobro pelo art. 42 do Código de Defesa do Consumidor.",
    body: [
      { type: "h2", text: "Tipos de cobrança indevida mais frequentes" },
      {
        type: "ul",
        items: [
          "Tarifas não previstas na 'Cesta de Serviços Essenciais' (Resolução BCB 4.196/13)",
          "Seguro prestamista embutido no financiamento sem oferta clara",
          "Title insurance/seguro de proteção de cartão não contratado",
          "Anuidade cobrada em conta-corrente gratuita (errada na maioria das vezes)",
          "Tarifas duplicadas no mesmo mês",
          "Empréstimo consignado em folha sem anuência (RMC e cartão consignado)",
          "Débito automático contestado e ignorado",
          "Juros remuneratórios acima do estipulado em contrato"
        ]
      },
      { type: "h2", text: "Como detectar" },
      {
        type: "ol",
        items: [
          "Baixe o extrato dos últimos 12 meses (a maioria dos bancos oferece em PDF pelo app)",
          "Procure por linhas com texto pouco claro — 'TAR. AVUL.', 'PACOTE PREMIUM', 'SEGURO PROT.'",
          "Compare com o seu contrato original — anuidade prevista? Pacote contratado?",
          "Calcule o total cobrado no período",
          "Se houver consignado, peça extrato do INSS ou ficha financeira para confirmar"
        ]
      },
      { type: "h2", text: "O que diz o CDC sobre devolução em dobro" },
      {
        type: "p",
        text: "Art. 42, parágrafo único do Código de Defesa do Consumidor: 'O consumidor cobrado em quantia indevida tem direito à repetição do indébito, por valor igual ao dobro do que pagou em excesso, acrescido de correção monetária e juros legais, salvo hipótese de engano justificável'. O STJ pacificou em 2021 (REsp 1.413.542) que basta a cobrança indevida — não precisa provar má-fé."
      },
      { type: "h2", text: "Como reclamar — escada de instâncias" },
      {
        type: "ol",
        items: [
          "Reclamação direta no SAC do banco — peça o número de protocolo",
          "Ouvidoria do banco (segunda instância interna) — prazo legal de 10 dias úteis para resposta",
          "Reclamação no Banco Central via 'Fale Conosco BCB' — gera nota negativa ao banco",
          "Procon — gera procedimento administrativo, vale para a maioria dos casos",
          "Consumidor.gov.br — plataforma do Governo Federal, prazos curtos, eficiente para casos simples",
          "Ação judicial — em geral pelo Juizado Especial Cível (até 40 salários mínimos sem advogado, ou com advogado obrigatório acima)"
        ]
      },
      { type: "h2", text: "Prazo para reclamar" },
      {
        type: "p",
        text: "Pelo CDC (art. 27), o prazo de prescrição para ações de reparação de dano causado por defeito do serviço é de 5 anos a contar do conhecimento do dano. Em prática, é possível pedir devolução de tarifas indevidas dos últimos 5 anos — mais antigo do que isso, em regra, prescreve."
      },
      {
        type: "callout",
        text: "Documento essencial: guarde o extrato em PDF, mantenha prints das telas do app, anote número de protocolo de cada ligação. A prova é sua responsabilidade — sem ela, o banco vai negar."
      },
      { type: "h2", text: "Empréstimo consignado não autorizado" },
      {
        type: "p",
        text: "É um dos casos mais frequentes contra aposentados e pensionistas. Quem nunca pediu o empréstimo precisa: bloquear novos consignados no portal Meu INSS, formalizar contestação ao banco em até 90 dias da descoberta, e ajuizar ação revisional. A jurisprudência majoritária do STJ é favorável ao consumidor — devolução em dobro + danos morais comuns entre R$ 5.000 e R$ 15.000."
      },
      { type: "h2", text: "Quando procurar advogado" },
      {
        type: "p",
        text: "Sempre que: o valor for relevante (acima de R$ 1.000), envolver consignado não autorizado, o banco se recusar a devolver após contestação formal, ou houver dano colateral (negativação de nome, restrição de crédito, devolução de cheque). Honorário em ações dessa natureza costuma ser por êxito — você só paga se ganhar."
      }
    ],
    faq: [
      {
        question: "Em quanto tempo o banco precisa devolver?",
        answer:
          "Pela Resolução BCB 4.860/20, a ouvidoria precisa responder em 10 dias úteis. Quando a devolução é determinada, costuma cair em 1 a 5 dias úteis na conta do cliente. Se demorar, cabe reclamação no BCB."
      },
      {
        question: "Vale a pena entrar com ação por valor pequeno?",
        answer:
          "Sim, principalmente no Juizado Especial Cível (até 20 salários mínimos sem advogado obrigatório). Custas baixas, audiência rápida, e a devolução em dobro + dano moral (em alguns casos) pode justificar o esforço."
      },
      {
        question: "Posso ser cobrado por receber meu próprio salário?",
        answer:
          "Não, desde 2008 (Res. BCB 3.518). A 'cesta de serviços essenciais' inclui depósito, saque, transferência interna e 2 saques mensais — todos gratuitos. Tarifa nessas operações é ilegal."
      },
      {
        question: "Negativaram meu nome injustamente — o que fazer?",
        answer:
          "Pelo CDC, o consumidor tem direito a indenização por dano moral em caso de negativação indevida. Súmula 385 do STJ ressalva quando já há outras negativações legítimas (nesse caso, só cabe a retirada, não a indenização)."
      }
    ]
  },
  {
    slug: "inss-negou-beneficio-o-que-fazer",
    title: "INSS negou meu benefício, o que fazer? Recurso administrativo e ação judicial",
    excerpt:
      "Aposentadoria, auxílio-doença, BPC/LOAS, pensão por morte — passo a passo para recorrer e os documentos que aumentam suas chances.",
    category: "Previdenciário",
    readingMinutes: 10,
    publishedAt: "2026-05-06",
    author: "Equipe AdvAqui",
    authorRole: "Equipe",
    relatedSpecialty: "previdenciario",
    intro:
      "O INSS nega cerca de 40% dos pedidos de auxílio-doença, segundo o próprio TCU. Em muitos casos, a negativa decorre de falha do perito ou ausência de documento — não de falta de direito. Saber recorrer corretamente é fundamental.",
    body: [
      { type: "h2", text: "Tipos de benefício mais negados" },
      {
        type: "ul",
        items: [
          "Auxílio por incapacidade temporária (antigo auxílio-doença)",
          "Aposentadoria por incapacidade permanente (antiga por invalidez)",
          "Aposentadoria por tempo de contribuição com vínculos faltantes no CNIS",
          "BPC/LOAS — Benefício de Prestação Continuada para idoso ou pessoa com deficiência",
          "Pensão por morte (especialmente nos casos de união estável)",
          "Aposentadoria especial (insalubridade ou periculosidade)"
        ]
      },
      { type: "h2", text: "Como saber por que foi negado" },
      {
        type: "ol",
        items: [
          "Acesse o portal Meu INSS (gov.br)",
          "Localize o pedido na lista 'Meus benefícios' ou 'Em andamento'",
          "Clique em 'Detalhes' e leia o motivo do indeferimento — costuma vir em uma frase técnica",
          "Baixe a 'Carta de Concessão/Indeferimento' em PDF — esse documento é essencial para qualquer recurso",
          "Se não conseguir, peça via telefone 135 ou em qualquer agência"
        ]
      },
      { type: "h2", text: "Recurso administrativo — CRPS" },
      {
        type: "p",
        text: "O Conselho de Recursos do Seguro Social (CRPS) é a instância administrativa. Você tem 30 dias da ciência do indeferimento para interpor recurso. O recurso é gratuito, não exige advogado, mas a chance de êxito sobe MUITO com peças bem fundamentadas e juntada correta de documentos médicos/contributivos. Prazo médio de julgamento: 6 a 18 meses."
      },
      { type: "h2", text: "Ação judicial" },
      {
        type: "p",
        text: "Pode ser feita em paralelo ou em substituição ao recurso administrativo. Vai para o Juizado Especial Federal (JEF) quando o valor pretendido for até 60 salários mínimos no total — sem necessidade de advogado, embora seja muito recomendado. Acima disso, vara federal comum, com advogado obrigatório."
      },
      { type: "h2", text: "Documentos que aumentam a chance de vitória" },
      {
        type: "ul",
        items: [
          "Laudos médicos detalhados, com CID-10, data e descrição clara da limitação para o trabalho",
          "Exames recentes (até 12 meses) — laboratoriais, imagens, eletro",
          "Receituários e histórico de medicações",
          "Atestados de afastamento anteriores",
          "Pareceres de especialistas (cardiologista, ortopedista, psiquiatra) — não generalistas",
          "Provas do exercício da atividade — fotos, vídeos, depoimentos de colegas, CTPS",
          "CNIS completo do INSS (para casos de tempo de contribuição)"
        ]
      },
      { type: "h2", text: "Auxílio-doença negado — perícia ruim" },
      {
        type: "p",
        text: "É a causa mais comum de negativa. O perito do INSS tem em média 10 a 15 minutos por exame. Em muitos casos, a perícia não captou a real condição do segurado. Recurso bem instruído com laudos detalhados costuma reverter. Em ação judicial, a perícia é refeita por médico nomeado pelo juiz (perícia judicial), com tempo maior e equilíbrio entre partes."
      },
      { type: "h2", text: "BPC/LOAS — critério de renda" },
      {
        type: "p",
        text: "O critério de renda per capita familiar para o BPC é 1/4 do salário mínimo. Foi flexibilizado pelo STF em 2013 (RE 567.985) — em situações concretas de miserabilidade, mesmo com renda ligeiramente acima, o benefício pode ser concedido. Peça que o assistente social do CRAS elabore um laudo socioeconômico complementar."
      },
      {
        type: "callout",
        text: "Atenção a 'consultor previdenciário' sem registro na OAB. Apenas advogado pode representar você na esfera judicial. Há golpes frequentes contra aposentados — cobram para 'desbloquear' benefícios que estão andando normalmente."
      },
      { type: "h2", text: "Prazo prescricional" },
      {
        type: "p",
        text: "Você pode pedir benefício mesmo anos após o fato gerador, mas só receberá retroativos dos últimos 5 anos (Lei 8.213/91, art. 103, § único). Esses 5 anos contam da data do pedido administrativo — por isso vale a pena dar entrada o quanto antes, mesmo que ainda esteja juntando documentos."
      },
      { type: "h2", text: "Pensão por morte por união estável" },
      {
        type: "p",
        text: "Os indeferimentos mais comuns acontecem por falta de prova da convivência. Documentos úteis: declaração de imposto de renda do falecido apontando o(a) companheiro(a), contas conjuntas, contrato de aluguel em conjunto, plano de saúde como dependente, fotos com data, testemunhas. Reconhecimento póstumo de união estável é cabível por sentença judicial."
      }
    ],
    faq: [
      {
        question: "Quanto tempo o INSS demora para responder ao recurso administrativo?",
        answer:
          "A lei estabelece 90 dias (Lei 9.784/99, art. 49), mas na prática varia de 6 a 18 meses. Se passar muito disso, é possível ajuizar mandado de segurança pelo silêncio administrativo."
      },
      {
        question: "Posso receber atrasado se o benefício for concedido?",
        answer:
          "Sim. Você recebe desde a data do requerimento administrativo (DER), corrigido pelo INPC + juros (no caso judicial, juros legais Selic). Esses retroativos costumam totalizar valores expressivos."
      },
      {
        question: "Preciso de advogado para o INSS?",
        answer:
          "Na esfera administrativa, não — você mesmo pode requerer e recorrer pelo Meu INSS. No Juizado Especial Federal até 60 salários, também não é obrigatório. Mas para causas complexas (aposentadoria especial, tempo rural, união estável) advogado faz diferença significativa."
      },
      {
        question: "O perito do INSS pode contestar laudo do meu médico?",
        answer:
          "Sim, é a função dele. O perito do INSS é médico do trabalho ligado à autarquia. Não há vínculo entre o seu laudo particular e a conclusão pericial — por isso é importante levar laudos detalhados e ter avaliação por especialista, não apenas clínico geral."
      }
    ]
  },
  {
    slug: "como-fazer-inventario",
    title: "Inventário: como fazer, prazos, custos e quando vale o extrajudicial",
    excerpt:
      "Inventário em cartório ou na Justiça, ITCMD, partilha entre herdeiros e o que fazer quando há testamento, dívida ou herdeiro menor.",
    category: "Sucessões",
    readingMinutes: 9,
    publishedAt: "2026-05-05",
    author: "Equipe AdvAqui",
    authorRole: "Equipe",
    relatedSpecialty: "civil",
    intro:
      "Quando alguém falece deixando bens, é preciso fazer inventário. É o procedimento que apura o patrimônio, paga o imposto (ITCMD), quita dívidas pendentes e divide o que sobra entre os herdeiros. Existem dois caminhos: cartório (extrajudicial) ou Justiça (judicial).",
    body: [
      { type: "h2", text: "Inventário extrajudicial — em cartório" },
      {
        type: "p",
        text: "Permitido pela Lei 11.441/2007 e Resolução 35 do CNJ. Cabível quando: todos os herdeiros são maiores e capazes, há consenso entre eles sobre a partilha, e não existe testamento (salvo nos casos em que o testamento já foi cumprido e aberto pelo juiz). Resolve em poucas semanas."
      },
      { type: "h2", text: "Inventário judicial" },
      {
        type: "p",
        text: "Obrigatório quando há herdeiros menores ou incapazes, ou quando há divergência. O CPC traz três modalidades: arrolamento sumário (acordo entre maiores capazes, valor não importa), arrolamento comum (valor abaixo de 1.000 salários mínimos), e inventário comum (acima desse valor). Duração média: 6 meses a 2 anos."
      },
      { type: "h2", text: "Prazo legal para abrir o inventário" },
      {
        type: "p",
        text: "60 dias a partir do falecimento (art. 611 do CPC). Após o prazo, há multa do ITCMD em quase todos os estados — que varia de 10% a 50% do imposto devido. Em SP, MG e RJ a multa é de 20%. O atraso não impede o procedimento, mas encarece."
      },
      { type: "h2", text: "Documentos necessários" },
      {
        type: "ul",
        items: [
          "Certidão de óbito",
          "RG/CPF do falecido e dos herdeiros",
          "Certidão de casamento do falecido (para identificar regime e meeira/o)",
          "Certidão de nascimento dos filhos",
          "Comprovantes de propriedade — escritura, matrícula, contrato de compra de imóvel; documento dos veículos; extratos bancários, aplicações; certidão da Junta Comercial para empresas",
          "Última declaração de Imposto de Renda do falecido",
          "Certidões negativas de débito da Receita, Estado, Município e INSS",
          "Pacto antenupcial, se houver"
        ]
      },
      { type: "h2", text: "ITCMD — quanto custa o imposto" },
      {
        type: "p",
        text: "Imposto sobre Transmissão Causa Mortis e Doação. Alíquota varia por estado: SP 4%, RJ 4% a 8% progressivo, MG 5% (a partir de 2024 com tabela progressiva chegando a 8%). Calcula-se sobre o valor de mercado dos bens, não sobre o valor da declaração de IR. Cada estado tem regras específicas para isenções (imóveis de baixo valor, famílias hipossuficientes)."
      },
      { type: "h2", text: "Custos além do ITCMD" },
      {
        type: "ul",
        items: [
          "Cartório (extrajudicial): emolumentos sobre o valor da causa, variam por estado, entre 1% e 3% do total",
          "Custas judiciais (judicial): também varia por TJ, normalmente entre 1% e 2%",
          "Honorários do advogado: tabela da OAB local, costuma ficar entre 6% e 10% do valor partilhado",
          "Avaliações periciais (quando há discordância sobre valor de imóvel) — entre R$ 500 e R$ 3.000"
        ]
      },
      {
        type: "callout",
        text: "Dica importante: muitos estados oferecem ISENÇÃO total do ITCMD para imóveis residenciais até certo valor (ex.: MG isenta até 80.000 UFEMG, aprox. R$ 380 mil em 2026). Verifique com o cartório ou a Receita Estadual antes de avaliar custos."
      },
      { type: "h2", text: "Quem é herdeiro" },
      {
        type: "p",
        text: "O Código Civil define a ordem (art. 1.829): primeiro descendentes (filhos, netos) em concorrência com o cônjuge sobrevivente (depende do regime de bens); depois ascendentes (pais, avós) também em concorrência com o cônjuge; depois cônjuge isoladamente; depois colaterais (irmãos, sobrinhos, tios)."
      },
      { type: "h2", text: "Existe meação?" },
      {
        type: "p",
        text: "Sim. Antes da partilha hereditária, separa-se a metade do cônjuge sobrevivente (a meação) — quando o regime de bens for de comunhão parcial ou universal. Essa metade pertence ao cônjuge por direito próprio, não como herança. Apenas a outra metade vira herança a ser dividida."
      },
      { type: "h2", text: "Inventário com dívida" },
      {
        type: "p",
        text: "Antes de partilhar, é preciso quitar dívidas do falecido até o limite do patrimônio (art. 1.792 do CC). Herdeiro nunca responde com bens próprios. Se o passivo for maior que o ativo, os herdeiros têm direito de renunciar à herança — mas é decisão definitiva, perde tudo, inclusive bens com valor sentimental."
      }
    ],
    faq: [
      {
        question: "É possível fazer inventário sem advogado?",
        answer:
          "Não. Advogado é obrigatório em qualquer inventário, seja extrajudicial ou judicial. Pode ser um para representar todos os herdeiros (quando há consenso) ou um para cada parte."
      },
      {
        question: "E se um herdeiro se recusa a colaborar?",
        answer:
          "O inventário vira obrigatoriamente judicial, com o juiz arbitrando a partilha. Pode demorar anos e gerar litígio. Mediação familiar prévia costuma evitar esse desgaste."
      },
      {
        question: "Posso vender um bem antes do inventário concluído?",
        answer:
          "Em regra não — os bens permanecem em condomínio entre os herdeiros até a partilha. Há mecanismo (alvará judicial) para venda de bens necessários a despesas urgentes ou em risco de deterioração."
      },
      {
        question: "Quem assume as dívidas do falecido?",
        answer:
          "O espólio (massa patrimonial). Os herdeiros nunca respondem com bens próprios — só com o que receberam de herança. Cartão de crédito, financiamento e outras dívidas costumam ser quitadas no inventário antes da partilha."
      }
    ]
  },
  {
    slug: "multa-de-transito-como-recorrer",
    title: "Multa de trânsito: como recorrer e ganhar (e quando não vale a pena)",
    excerpt:
      "Defesa prévia, JARI, CETRAN — as três instâncias, prazos, argumentos que funcionam e os erros que invalidam a multa.",
    category: "Trânsito",
    readingMinutes: 7,
    publishedAt: "2026-05-04",
    author: "Equipe AdvAqui",
    authorRole: "Equipe",
    relatedSpecialty: "criminal",
    intro:
      "Recorrer de multa de trânsito é um direito do cidadão (CTB, arts. 281 a 290) e — quando há erro real no auto de infração — costuma dar resultado. O segredo é entender as três instâncias e usar argumentos técnicos, não emocionais.",
    body: [
      { type: "h2", text: "Etapa 1 — Notificação de Autuação (NA)" },
      {
        type: "p",
        text: "É o primeiro documento que chega. Não é cobrança — é apenas o aviso de que houve uma infração registrada. Você tem prazo (geralmente 30 dias, indicado na própria notificação) para apresentar 'Defesa Prévia' ou 'Indicação de Condutor' (se quem dirigia era outra pessoa)."
      },
      { type: "h2", text: "Etapa 2 — Defesa Prévia" },
      {
        type: "p",
        text: "É o recurso mais barato e simples. Não precisa pagar nada. Você protocola — pelo Detran online, app oficial do estado, Correios — argumentando por que a multa deve ser cancelada. Se aceita, a multa some antes mesmo de virar boleto."
      },
      { type: "h2", text: "Etapa 3 — JARI (Junta Administrativa de Recursos de Infrações)" },
      {
        type: "p",
        text: "Se a defesa prévia for indeferida ou perdida, vem a Notificação de Penalidade. Aí cabe recurso à JARI, com prazo de 30 dias. A JARI é um colegiado administrativo composto por servidor do órgão de trânsito, representante de entidade da sociedade e mais um. Análise técnica."
      },
      { type: "h2", text: "Etapa 4 — CETRAN ou CONTRAN" },
      {
        type: "p",
        text: "Última instância administrativa, quando a JARI indefere. CETRAN no caso de multas estaduais/municipais. CONTRAN para multas federais (PRF). Prazo também de 30 dias. Composição maior e mais qualificada — alguns casos só viram a favor do motorista aqui."
      },
      { type: "h2", text: "Erros formais que invalidam a multa" },
      {
        type: "ul",
        items: [
          "Notificação enviada após 30 dias do auto (CTB, art. 281, parágrafo único, II) — defesa pronta",
          "Local da infração mal descrito ou genérico ('Av. Paulista, próximo ao número' sem número)",
          "Placa do veículo registrada com erro de digitação",
          "Velocidade aferida com radar fora do prazo de calibração (Inmetro)",
          "Sinalização de via inadequada ou inexistente",
          "Agente de trânsito sem identificação no auto",
          "Hora ou data do auto incompatível com a notificação",
          "Pena aplicada divergente do código de infração (ex.: gravíssima cobrada como grave)"
        ]
      },
      { type: "h2", text: "Argumentos que costumam funcionar" },
      {
        type: "ol",
        items: [
          "Tese técnica — comprovar erro do equipamento (laudo de calibração)",
          "Tese formal — falha de notificação, ausência de pré-requisito legal",
          "Estado de necessidade — comprovado por documento (idoso passando mal, parto, urgência hospitalar)",
          "Identidade equivocada — placa errada, transferência recente, veículo clonado",
          "Princípio da proporcionalidade — quando a sanção é desproporcional ao caso concreto"
        ]
      },
      {
        type: "callout",
        text: "Cuidado com sites que cobram R$ 100 a R$ 300 para 'recorrer' — a defesa prévia é gratuita e você mesmo pode fazer pelo portal do Detran. O texto importa, não o intermediário."
      },
      { type: "h2", text: "Quando vale recorrer (e quando não vale)" },
      {
        type: "p",
        text: "Vale quando: há erro formal claro, há prova de inocência (GPS, vídeo, testemunha), ou a multa coloca em risco a CNH (chegou a 20 pontos). Não vale quando: a infração foi clara, você não tem prova contrária, e o valor da multa é baixo (em geral abaixo de R$ 200 não compensa o tempo e a chance de perder)."
      },
      { type: "h2", text: "Suspensão da CNH" },
      {
        type: "p",
        text: "Acima de 20 pontos em 12 meses, suspende a habilitação. Se o motorista exercer atividade remunerada, vai a 40 pontos. O recurso da suspensão segue ritmo próprio (no Detran) e tem prazo curto — fique atento ao prazo na notificação."
      },
      { type: "h2", text: "Quando contratar advogado" },
      {
        type: "p",
        text: "Em multas graves (alcoolemia, racha, dirigir sem CNH, ultrapassagem perigosa) ou na iminência de suspensão da CNH. Honorários típicos: R$ 500 a R$ 2.000 por procedimento. Algumas situações permitem ingresso direto na Justiça Estadual (mandado de segurança) quando o tempo administrativo é incompatível com o risco."
      }
    ],
    faq: [
      {
        question: "Posso pagar a multa e ainda assim recorrer?",
        answer:
          "Sim, mas perde-se um benefício importante: o desconto de 40% por pagamento à vista só vale para quem não recorre. Recorrer e perder = paga 100%. Estratégia ideal: pagar só se a chance de êxito for baixa."
      },
      {
        question: "Multa de radar fixa é sempre legal?",
        answer:
          "Não. O equipamento precisa de aferição anual pelo Inmetro (Portaria 544/2014), e a sinalização de aproximação (placa de advertência) é obrigatória. Sem qualquer dos dois, a multa pode ser anulada."
      },
      {
        question: "Como saber quantos pontos eu tenho na CNH?",
        answer:
          "No portal Senatran (gov.br/transito) ou no aplicativo CDT (Carteira Digital de Trânsito). Os pontos contam pelos últimos 12 meses, com prescrição automática após esse prazo."
      },
      {
        question: "Posso recorrer de multa de outro estado?",
        answer:
          "Sim. O recurso é feito ao órgão autuador (Detran do estado onde a multa foi aplicada), mesmo que você more em outro. Pode protocolar pelo portal do Detran de origem, sem precisar viajar."
      }
    ]
  },
  {
    slug: "como-entrar-com-acao-no-juizado-do-consumidor",
    title: "Processo no Juizado do Consumidor: como entrar com a ação sozinho (até 20 salários mínimos)",
    excerpt:
      "Quando dispensa advogado, como preparar a petição, documentos essenciais e o que esperar da audiência de conciliação.",
    category: "Consumidor",
    readingMinutes: 8,
    publishedAt: "2026-05-03",
    author: "Equipe AdvAqui",
    authorRole: "Equipe",
    relatedSpecialty: "civil",
    intro:
      "O Juizado Especial Cível (JEC) é a ferramenta que o consumidor brasileiro tem para resolver disputas de pequeno valor sem o custo de uma ação comum. Causas até 20 salários mínimos dispensam advogado. Funciona — quando bem usado.",
    body: [
      { type: "h2", text: "Casos típicos de JEC do Consumidor" },
      {
        type: "ul",
        items: [
          "Compra na internet não entregue ou entregue diferente do anunciado",
          "Cobrança indevida em conta de água, luz, telefone",
          "Plano de saúde negando cobertura de procedimento",
          "Companhia aérea com voo cancelado, atrasado, ou bagagem extraviada",
          "Produto com defeito durante a garantia",
          "Banco com cobrança não autorizada (tarifas, seguros, consignados)",
          "Negativação indevida no SPC/Serasa",
          "Serviços contratados e não prestados (academia, curso, evento cancelado)"
        ]
      },
      { type: "h2", text: "Limites de valor" },
      {
        type: "p",
        text: "Lei 9.099/95: até 20 salários mínimos (em 2026, aprox. R$ 28.000) sem advogado. Entre 20 e 40 salários (até R$ 56.000), advogado obrigatório, mas o rito continua mais rápido. Acima disso, vai para vara cível comum."
      },
      { type: "h2", text: "Documentos essenciais antes de protocolar" },
      {
        type: "ul",
        items: [
          "RG e CPF do consumidor (autor da ação)",
          "Comprovante de endereço",
          "Contrato, nota fiscal, comprovante de compra",
          "Trocas de mensagens (e-mail, WhatsApp, SAC) — exporte print com data visível",
          "Comprovantes de pagamento (cartão, Pix, boleto)",
          "Em caso de dano material — cotação ou orçamento de reposição",
          "Em caso de dano moral — sentenças anteriores em casos similares (pesquisa em JusBrasil ou no site do TJ)"
        ]
      },
      { type: "h2", text: "Como protocolar a ação" },
      {
        type: "ol",
        items: [
          "Acesse o portal do TJ do seu estado, área 'Juizados Especiais'",
          "Faça cadastro no PJe (Processo Judicial Eletrônico) — exige CPF, e-mail e digital scanner ou foto do RG",
          "Use a opção 'Atermação' ou 'Petição Inicial Simplificada' — alguns TJs têm formulário guiado",
          "Descreva os fatos cronologicamente, sem emocional excessivo. Anexe todos os documentos.",
          "Indique o valor pretendido — dano material (gasto real) + dano moral (se cabível)",
          "Se preferir presencial, alguns TJs ainda atendem em balcão — leve os documentos prontos"
        ]
      },
      { type: "h2", text: "Audiência de conciliação" },
      {
        type: "p",
        text: "Primeira etapa obrigatória. O juiz/conciliador tenta acordo entre as partes. Se houver acordo, vira sentença homologatória e o caso fecha. Se não houver, a audiência de instrução (com testemunhas) é marcada. A maioria dos casos do JEC se resolve em 90 a 180 dias."
      },
      {
        type: "callout",
        text: "Dica: prepare-se para a conciliação. Tenha em mente o valor mínimo que aceita receber. Ofertas baixas costumam aparecer — saber recusar com calma é parte da estratégia."
      },
      { type: "h2", text: "Princípio da hipossuficiência" },
      {
        type: "p",
        text: "Pelo CDC (art. 6º, VIII), o consumidor é parte vulnerável e a inversão do ônus da prova pode ser determinada pelo juiz — significa que, em muitos casos, é a empresa quem tem que provar que NÃO errou, não o consumidor que tem que provar a culpa."
      },
      { type: "h2", text: "Dano moral em JEC" },
      {
        type: "p",
        text: "Valores costumam ficar entre R$ 1.000 e R$ 15.000, dependendo do estado e do tipo de violação. Negativação indevida: STJ Súmula 385 limita quando há outras negativações legítimas. Voo cancelado sem comunicação: R$ 3.000 a R$ 8.000 é faixa típica. Pedido exagerado pode ser reduzido pelo juiz."
      },
      { type: "h2", text: "Quando NÃO usar o JEC" },
      {
        type: "ol",
        items: [
          "Causa complexa exigindo prova pericial extensa (calçados defeituosos com necessidade de laudo industrial, por exemplo)",
          "Quando você precisa de tutela antecipada urgente (medicamento que paciente vai precisar amanhã) — vara comum responde mais rápido nesse caso",
          "Causas que envolvem fato controvertido com muitas testemunhas",
          "Ações coletivas — Ministério Público ou Defensoria ajuíza, não o consumidor individual"
        ]
      }
    ],
    faq: [
      {
        question: "Sou de uma cidade pequena — onde fica o Juizado mais próximo?",
        answer:
          "Todo TJ é organizado por comarca. Cidades pequenas costumam ser ligadas à comarca da cidade-sede. Pelo PJe é possível protocolar 100% online sem deslocamento até a audiência."
      },
      {
        question: "Posso desistir da ação?",
        answer:
          "Sim, a qualquer momento antes da sentença. Em audiência, pode aceitar acordo da empresa. Desistir antes da audiência é simples (petição de desistência), e não há multa."
      },
      {
        question: "E se a empresa não comparecer à audiência?",
        answer:
          "Vira revelia — os fatos alegados pelo consumidor são presumidos verdadeiros. A sentença em geral é favorável. Mas a empresa pode recorrer alegando algum vício de citação."
      },
      {
        question: "Vale a pena recorrer se eu perder no JEC?",
        answer:
          "Cabe recurso para Turma Recursal (composta por 3 juízes do JEC). Há custas e, acima de 20 salários mínimos, advogado obrigatório. Costuma valer quando o caso é simples e a sentença ignorou prova clara."
      }
    ]
  },
  {
    slug: "acordo-trabalhista-vale-a-pena",
    title: "Acordo trabalhista vale a pena? Como avaliar a oferta da empresa",
    excerpt:
      "Os 4 critérios objetivos para decidir, valores de mercado por tipo de causa, e como calcular o 'desconto' que você está dando.",
    category: "Trabalhista",
    readingMinutes: 7,
    publishedAt: "2026-05-02",
    author: "Equipe AdvAqui",
    authorRole: "Equipe",
    relatedSpecialty: "trabalhista",
    intro:
      "A grande maioria das ações trabalhistas termina em acordo — segundo o TST, mais de 50% nas audiências iniciais. Saber avaliar uma proposta é mais útil que litigar até o fim em muitos casos, mas só funciona quando você sabe o valor real do que está em jogo.",
    body: [
      { type: "h2", text: "Os 4 critérios objetivos" },
      {
        type: "ol",
        items: [
          "Valor da causa real (cálculo do que se ganharia em sentença) × valor proposto",
          "Tempo médio até trânsito em julgado (1 a 4 anos, dependendo da Vara)",
          "Risco de prova — quão fortes são os documentos e testemunhas",
          "Custos paralelos — honorários advocatícios, sucumbência, custas em caso de derrota"
        ]
      },
      { type: "h2", text: "Como calcular o valor da causa" },
      {
        type: "p",
        text: "Some todas as parcelas pedidas com correção monetária e juros. Verbas rescisórias não pagas, horas extras (com adicional de 50% ou 100%), diferenças salariais, FGTS, multa de 40%, danos morais. Aplicação de juros legais (Selic desde 2018) e correção (TR ou IPCA conforme Lei 13.467/17). Esse é o 'cenário 100%'."
      },
      { type: "h2", text: "Aplicar o fator de risco" },
      {
        type: "p",
        text: "Não dá para confiar em receber 100%. Riscos típicos: prova testemunhal fraca, ausência de cartão de ponto, recibo de quitação assinado, prescrição de parte das parcelas (5 anos). Multiplique o valor por sua estimativa de chance de ganho: 60% a 70% costuma ser razoável em causas com prova razoável."
      },
      { type: "h2", text: "Aplicar fator tempo" },
      {
        type: "p",
        text: "Receber daqui a 2 anos vale menos do que receber hoje. Calcule o desconto financeiro (custo de oportunidade) — costuma rodar 8% a 12% ao ano dependendo da realidade do trabalhador. Acordo na audiência inicial economiza esse tempo."
      },
      { type: "h2", text: "Subtrair custos" },
      {
        type: "ul",
        items: [
          "Honorários do seu advogado — 20% a 30% sobre o ganho líquido em causas trabalhistas",
          "Honorários de sucumbência (advogado da empresa, em caso de derrota parcial) — 5% a 15% sobre a parte que perdeu",
          "Custas processuais — 2% sobre o valor da causa, salvo se a justiça gratuita for deferida",
          "Pericial (se necessária) — pode ser de R$ 1.000 a R$ 5.000"
        ]
      },
      {
        type: "callout",
        text: "Exemplo prático: causa de R$ 50.000. Chance estimada de ganho: 70%. Tempo até receber: 24 meses. Custo de oportunidade: 10%/ano. Honorários: 25%. Valor 'esperado' líquido hoje: aprox. R$ 21.000. Se a empresa oferece R$ 18.000 à vista, é proposta defensável. Se oferece R$ 12.000, você está dando 30% de desconto além do risco."
      },
      { type: "h2", text: "Como negociar a contraproposta" },
      {
        type: "ol",
        items: [
          "Nunca aceite a primeira oferta. A empresa tem reserva — geralmente 30% a 60% acima da oferta inicial",
          "Use cálculo concreto, não 'eu acho'. Apresente uma planilha simples",
          "Pergunte sobre forma de pagamento — à vista normalmente compensa mais que parcelado",
          "Verifique INCIDÊNCIAS — INSS, IR, FGTS — separadas no acordo",
          "Insista em cláusula de quitação restritiva (só quita o que foi pedido, não o contrato inteiro)",
          "Anote em ata todas as condições. Acordo verbal não vale nada"
        ]
      },
      { type: "h2", text: "Acordo extrajudicial vs em audiência" },
      {
        type: "p",
        text: "Acordo extrajudicial (Lei 13.467/17, art. 855-B da CLT) ocorre antes da ação ser ajuizada — empresa e empregado vão direto ao juiz com a minuta. É homologado em audiência. Tem quitação ampla, sem possibilidade de retomar. Acordo em audiência tem a vantagem de já estar no contexto do litígio, com cálculos refeitos."
      },
      { type: "h2", text: "Quando NÃO aceitar acordo" },
      {
        type: "ul",
        items: [
          "Prova é absurdamente forte (cartões de ponto inegáveis, e-mails, vídeos)",
          "A proposta cobre menos que 40% da causa real",
          "Trata-se de quitação ampla (renúncia a direitos futuros que nem foram pedidos)",
          "A empresa está em recuperação — risco de não pagar mesmo o acordo",
          "Honorários do seu advogado eram contingenciais (só pagaria se ganhasse) — descontar deles muda a equação"
        ]
      }
    ],
    faq: [
      {
        question: "Posso fazer acordo sem advogado?",
        answer:
          "Em audiência, sim — mas é fortemente desaconselhável. O advogado faz o cálculo de risco e negocia a proposta. Acordo sem assessoria costuma resultar em valor 30% a 50% abaixo do justo."
      },
      {
        question: "O empregador pode cobrar honorários do meu advogado?",
        answer:
          "Pode ocorrer sucumbência recíproca — quando você ganha em alguns pedidos e perde em outros. Pela Reforma Trabalhista, os honorários ficam entre 5% e 15% do que foi negado, e você pode ser obrigado a pagar (salvo justiça gratuita)."
      },
      {
        question: "Tem como reverter um acordo depois de assinado?",
        answer:
          "Muito difícil. Só por vício grave (coação, dolo, erro), comprovado em ação rescisória. Por isso a leitura cuidadosa do termo de acordo antes de assinar é fundamental."
      },
      {
        question: "O acordo entra como rendimento no IR?",
        answer:
          "Verbas rescisórias (saldo, aviso, multa FGTS) costumam ser isentas ou descontadas no recibo. Indenizações por dano moral são isentas. Salários reconhecidos no acordo entram como rendimento tributável."
      }
    ]
  },
  {
    slug: "acao-de-despejo-como-funciona",
    title: "Ação de despejo: o que diz a lei, prazo e como proteger seu direito (locador e locatário)",
    excerpt:
      "Falta de pagamento, denúncia vazia, retomada para uso próprio — como cada hipótese funciona e o que cabe ao morador.",
    category: "Imobiliário",
    readingMinutes: 8,
    publishedAt: "2026-05-01",
    author: "Equipe AdvAqui",
    authorRole: "Equipe",
    relatedSpecialty: "civil",
    intro:
      "A Lei do Inquilinato (Lei 8.245/91) regula o despejo no Brasil. As principais hipóteses são: falta de pagamento, infração contratual, denúncia vazia, retomada para uso próprio ou de família, e venda do imóvel a terceiros. Cada uma tem regra distinta de prazo e contestação.",
    body: [
      { type: "h2", text: "Despejo por falta de pagamento" },
      {
        type: "p",
        text: "Hipótese mais comum. Locador pode ajuizar ação após o vencimento do aluguel não pago. Existe a 'purgação da mora' — o inquilino tem 15 dias após a citação para pagar tudo (aluguel + multa + custas + juros) e manter o contrato. Só pode purgar a mora uma vez a cada 24 meses (art. 62, II da Lei do Inquilinato)."
      },
      { type: "h2", text: "Despejo liminar — quando o juiz manda sair em 15 dias" },
      {
        type: "p",
        text: "Há hipóteses em que o juiz concede liminar com prazo curto para desocupação (art. 59, §1º da Lei 8.245/91): contrato sem fiança ou garantia idônea, descumprimento de mútuo acordo de desocupação, término do prazo do contrato sem prorrogação, locação para temporada vencida."
      },
      { type: "h2", text: "Despejo por denúncia vazia" },
      {
        type: "p",
        text: "Cabe quando o contrato escrito por prazo determinado venceu e está em vigência por prazo indeterminado (foi prorrogado tacitamente). O locador pode pedir o imóvel sem motivo declarado, com prazo de 30 dias para desocupação. Não cabe em locações comerciais com contrato vigente."
      },
      { type: "h2", text: "Despejo para uso próprio ou de familiar" },
      {
        type: "p",
        text: "Cabe em locações por prazo indeterminado, mesmo decorrentes de contrato originalmente determinado. Tem que comprovar que o imóvel será efetivamente usado pelo locador ou por ascendente/descendente/cônjuge — uso comercial próprio também vale. Há retomada similar para 'demolição e edificação licenciada'."
      },
      { type: "h2", text: "Prazos de desocupação após decisão" },
      {
        type: "ul",
        items: [
          "Falta de pagamento sem purgação: 15 dias (após sentença)",
          "Liminar concedida: 15 dias",
          "Denúncia vazia: 30 dias",
          "Sentença comum sem liminar: 30 dias",
          "Locação para hospital/escola/repartição: 6 meses (proteção especial)"
        ]
      },
      { type: "h2", text: "Direitos do inquilino antes e durante o despejo" },
      {
        type: "ol",
        items: [
          "Ser cientificado por mandado judicial (não basta ligação ou e-mail)",
          "Direito de contestar e produzir prova (excessivamente comum: provar que pagou, que o imóvel tem vícios graves)",
          "Devolução da caução em até 30 dias após a entrega do imóvel (Lei 8.245/91, art. 38, §2º)",
          "Indenização por benfeitorias necessárias (e úteis quando autorizadas) — art. 35",
          "Direito de preferência se o imóvel for vendido durante o contrato (art. 27)"
        ]
      },
      {
        type: "callout",
        text: "Importante: 'autodespejo' é crime (art. 345 do CP — exercício arbitrário das próprias razões). Locador NUNCA pode trocar fechadura, cortar luz/água ou retirar pertences do inquilino. Tem que ir ao Judiciário."
      },
      { type: "h2", text: "Como o locador deve documentar antes" },
      {
        type: "ul",
        items: [
          "Contrato escrito com cláusula específica e dados completos das partes",
          "Comprovantes de aluguel atrasado — extrato bancário, recibos",
          "Notificação extrajudicial prévia (carta com AR ou cartório) — não é obrigatória, mas facilita",
          "Vistoria de entrada e saída — protege contra discussões sobre dano material",
          "Garantia formalizada — fiador, caução, seguro-fiança"
        ]
      },
      { type: "h2", text: "Como o inquilino pode evitar o despejo" },
      {
        type: "ol",
        items: [
          "Conversa direta com o locador — propor parcelamento da dívida",
          "Purgação da mora dentro do prazo (caso já tenha citação)",
          "Provar que o imóvel tem vício grave (infiltração, alvenaria comprometida) — pode reduzir aluguel proporcionalmente",
          "Negociar acordo de desocupação com prazo dilatado (30 a 60 dias) em troca de quitação"
        ]
      },
      { type: "h2", text: "Despejo durante a pandemia — ainda existe?" },
      {
        type: "p",
        text: "Não. As leis emergenciais de 2020-2021 que suspendiam despejo durante a pandemia (Lei 14.010/2020) já se exauriram. O regime atual é integralmente o da Lei 8.245/91. Algumas Defensorias estaduais e municípios mantêm programas locais de mediação."
      }
    ],
    faq: [
      {
        question: "Quanto tempo demora uma ação de despejo?",
        answer:
          "Quando há liminar: 30 a 60 dias para desocupação. Sem liminar e com contestação: 6 a 18 meses até sentença. A maioria se resolve em acordo na audiência de conciliação."
      },
      {
        question: "Sou idoso, isso me protege do despejo?",
        answer:
          "Não há proteção específica por idade na Lei do Inquilinato. O Estatuto do Idoso (Lei 10.741/03) prevê prioridade na tramitação, mas não impede o despejo legalmente cabível. Defensoria Pública atende gratuitamente."
      },
      {
        question: "Posso entrar com despejo sem advogado?",
        answer:
          "Não. Despejo é ação cível comum, obrigatório advogado. Custas variam por estado, em geral 2% do valor pedido (12 meses de aluguel é a base usual). Defensoria Pública atende locadores que se enquadram nos critérios de renda."
      },
      {
        question: "O fiador continua respondendo após o vencimento do contrato?",
        answer:
          "Sim, enquanto durar a prorrogação automática, salvo se o fiador notificar formalmente o locador desejando desonerar-se. STJ Súmula 214 e art. 39 da Lei 8.245/91."
      }
    ]
  },
  {
    slug: "reabertura-prazo-art-422-cpp-substituicao-defesa-juri",
    title:
      "Trocou de advogado depois da pronúncia? O prazo do art. 422 pode reabrir",
    excerpt:
      "Quando uma nova defesa assume após a pronúncia, surge a dúvida: o prazo do art. 422 do CPP recomeça? Veja a regra, a exceção que a jurisprudência abriu e como pedir a reabertura.",
    category: "Tribunal do Júri",
    readingMinutes: 7,
    publishedAt: "2026-05-30",
    author: "Equipe AdvAqui",
    authorRole: "Equipe",
    relatedSpecialty: "criminal",
    intro:
      "A pronúncia virou preclusa, o juiz abriu o prazo do art. 422 do CPP — cinco dias para arrolar testemunhas e requerer diligências para o plenário — e foi exatamente aí que o réu trocou de advogado. A nova defesa encontra um prazo que correu sob a estratégia de outra pessoa. Ela herda esse silêncio, ou tem o direito de recomeçar? A resposta separa uma defesa de plenário viva de uma já condenada na largada.",
    body: [
      { type: "h2", text: "Cinco dias que desenham o plenário inteiro" },
      {
        type: "p",
        text: "O júri tem duas fases. Encerrada a primeira pela pronúncia, abre-se a preparação para o plenário — e o art. 422 do CPP é a porta dela. Naqueles cinco dias, a defesa define quais testemunhas (até cinco) vão falar diante dos jurados, junta documentos e pede diligências. Não é trâmite: é o momento em que a tese que será sustentada no tribunal popular ganha corpo probatório. O que não entrar aqui, dificilmente entra depois."
      },
      {
        type: "tool",
        tool: "revela",
        titulo: "Traduzindo o juridiquês",
        itens: [
          {
            termo: "Pronúncia",
            definicao:
              "Decisão que encerra a primeira fase e admite o réu a julgamento pelos jurados. Não é condenação — é o juízo de admissibilidade da acusação."
          },
          {
            termo: "Preclusão",
            definicao:
              "A porta que se fecha: vencido o prazo ou o momento, a oportunidade processual não volta — salvo exceção fundamentada."
          },
          {
            termo: "Art. 422 do CPP",
            definicao:
              "Após a preclusão da pronúncia, as partes são intimadas para, em 5 dias, arrolar até 5 testemunhas de plenário, juntar documentos e requerer diligências."
          },
          {
            termo: "Plenitude de defesa",
            definicao:
              "Garantia específica do júri (art. 5º, XXXVIII, 'a', da Constituição). Vai além da ampla defesa do processo comum: no júri, a defesa precisa ser não só ampla, mas plena — esgotar todos os meios, inclusive os de convencimento dos jurados."
          }
        ]
      },
      { type: "h2", text: "A regra: quem chega, chega com o jogo em andamento" },
      {
        type: "p",
        text: "Comecemos pelo que os tribunais costumam dizer primeiro. Quando o réu destitui o advogado e constitui outro, o novo defensor, em regra, assume o processo no estado em que ele se encontra. Não pode, só por ter chegado depois, anular atos praticados regularmente nem exigir a reabertura de prazos já encerrados. É a segurança jurídica protegendo o processo contra manobras de reinício infinito."
      },
      { type: "h2", text: "A exceção que a jurisprudência foi abrindo" },
      {
        type: "p",
        text: "Mas a rigidez da preclusão cede em duas situações que vêm ganhando força. A primeira: quando o defensor anterior simplesmente abandonou a causa ou se quedou inerte sem qualquer razão tática — intimado para o art. 422, nada arrolou, nada requereu. Aí não há estratégia a respeitar; há vício. A segunda, mais ampla: a substituição da defesa pode reabrir o prazo como corolário lógico da plenitude de defesa, porque a fase do art. 422 é estruturante — define a prova e os contornos da própria linha que irá a plenário."
      },
      {
        type: "callout",
        text: "A chave não é ter trocado de advogado — é o prejuízo concreto. A nova defesa precisa mostrar ao juiz QUAIS testemunhas deixaram de ser arroladas e por que seriam decisivas. Reabertura se conquista com demonstração, não com pedido genérico de mais tempo."
      },
      {
        type: "p",
        text: "Essa é a fronteira do debate hoje: de um lado, a preclusão e a segurança do rito; do outro, a plenitude de defesa, que no júri tem estatura constitucional própria. A tendência defensiva é tratar a fase 422 não como prazo qualquer, mas como núcleo da defesa de plenário — e, portanto, reabri-la quando a troca de patrono, somada à demonstração de prejuízo, revela que a defesa real ficou pelo caminho."
      },
      {
        type: "tool",
        tool: "quiz",
        pergunta:
          "O réu troca de advogado logo após a abertura do prazo do art. 422. Qual pedido tem a MAIOR chance de obter a reabertura?",
        opcoes: [
          {
            texto: "Pedir mais prazo porque o novo advogado precisa estudar o caso",
            explicacao:
              "Fraco. É conveniência da defesa, sem demonstrar o que se perdeu. A regra geral (assumir no estado em que está) tende a prevalecer."
          },
          {
            texto: "Demonstrar que o defensor anterior nada arrolou e indicar testemunhas concretas que mudariam a tese de plenário",
            correta: true,
            explicacao:
              "É o caminho. Une desídia/inércia do anterior + plenitude de defesa + prejuízo concreto (testemunhas nominadas e sua relevância). É assim que a preclusão cede."
          },
          {
            texto: "Arguir nulidade de tudo desde a pronúncia",
            explicacao:
              "Exagera e enfraquece. A pronúncia não está em discussão; pedir demais costuma fazer o juízo indeferir tudo."
          }
        ]
      },
      { type: "h2", text: "Como levar isso para a sua petição" },
      {
        type: "p",
        text: "Na prática, o criminalista que assume após a pronúncia ganha ao agir cedo e concreto: ao se habilitar, requerer a reabertura do art. 422 fundamentando na plenitude de defesa, apontando a inércia anterior (quando houver) e — o ponto decisivo — nominando as testemunhas e provas que pretende produzir, com a relevância de cada uma para a tese. Genérico, indefere. Concreto, convence. É um tema vivo: a doutrina recente (inclusive análises de 2026) tem sustentado essa leitura constitucional do art. 422."
      },
      {
        type: "p",
        text: "Conteúdo de análise doutrinária para estudo e debate — não é parecer sobre caso concreto. A admissibilidade do pedido depende das circunstâncias dos autos e da avaliação do juízo; cada júri exige a orientação de um advogado."
      }
    ],
    faq: [
      {
        question: "Trocar de advogado reabre automaticamente o prazo do art. 422?",
        answer:
          "Não. A regra é que o novo defensor assume o processo no estado em que está. A reabertura é exceção: depende de fundamento (plenitude de defesa, inércia do anterior) e de demonstração de prejuízo concreto."
      },
      {
        question: "O que é 'prejuízo concreto' nesse contexto?",
        answer:
          "É mostrar, de forma específica, o que a defesa perdeu: quais testemunhas deixaram de ser arroladas e por que seriam relevantes para a tese de plenário. Sem isso, o pedido tende a ser indeferido."
      },
      {
        question: "Reabrir o art. 422 anula a pronúncia?",
        answer:
          "Não. A pronúncia permanece íntegra. Discute-se apenas a oportunidade de a nova defesa exercer plenamente a fase de preparação do plenário."
      },
      {
        question: "Qual a diferença entre ampla defesa e plenitude de defesa?",
        answer:
          "A ampla defesa vale para todo processo. A plenitude de defesa (art. 5º, XXXVIII, 'a') é exclusiva do júri e mais intensa: exige esgotar todos os meios de defesa, o que reforça o argumento de reabertura do art. 422."
      }
    ]
  },
  {
    slug: "standard-probatorio-juri-in-dubio-pro-societate",
    title:
      "In dubio pro societate: o brocardo que decide quem vai a júri — e por que está em crise",
    excerpt:
      "Na dúvida, manda pro júri? O velho brocardo sustentou pronúncias frágeis por décadas — e o STJ vem afastando ele. Entenda a virada e a tese defensiva que está vencendo.",
    category: "Tribunal do Júri",
    readingMinutes: 6,
    publishedAt: "2026-05-29",
    author: "Equipe AdvAqui",
    authorRole: "Equipe",
    relatedSpecialty: "criminal",
    intro:
      "Três palavras em latim já decidiram o destino de milhares de réus: in dubio pro societate — na dúvida, a favor da sociedade. Ela mora na decisão de pronúncia e ensina que basta indício para mandar alguém ao plenário. O detalhe incômodo? Ela não está escrita em lugar nenhum da lei. E o STJ, decisão após decisão, vem dizendo que ela não pode mais sustentar pronúncias frágeis. Entenda a virada — e a tese que está ganhando.",
    body: [
      { type: "h2", text: "O que o brocardo faz na pronúncia" },
      {
        type: "p",
        text: "Na pronúncia, o juiz não condena: decide apenas se o caso segue para os jurados. O in dubio pro societate diz que, nesse juízo de admissibilidade, a dúvida pende para a acusação — havendo indícios de autoria, pronuncia-se. Na teoria, faz sentido: quem julga o mérito dos crimes dolosos contra a vida é o Conselho de Sentença, não o juiz togado. Na prática, levado ao automático, o brocardo virou um carimbo: transformou qualquer indício em passaporte para o plenário, mesmo com prova rala."
      },
      {
        type: "tool",
        tool: "revela",
        titulo: "Os quatro conceitos que organizam o debate",
        itens: [
          {
            termo: "Pronúncia",
            definicao:
              "Juízo de admissibilidade: o juiz verifica se há prova da materialidade e indícios suficientes de autoria para levar o caso ao júri. Não decide culpa."
          },
          {
            termo: "In dubio pro societate",
            definicao:
              "Brocardo (não previsto em lei) segundo o qual, na dúvida, pronuncia-se em favor da sociedade. É construção jurisprudencial — e é isso que está sendo contestado."
          },
          {
            termo: "In dubio pro reo",
            definicao:
              "Regra constitucional: na dúvida, decide-se a favor do réu. Decorre da presunção de inocência (art. 5º, LVII) e, segundo a crítica, deveria valer também na pronúncia."
          },
          {
            termo: "Standard probatório",
            definicao:
              "O 'tanto de prova' exigido para uma decisão. A discussão é qual é o patamar da pronúncia: indício solto basta, ou é preciso preponderância de prova de autoria?"
          }
        ]
      },
      {
        type: "tool",
        tool: "perspectiva",
        pergunta: "Na dúvida, ao fim da primeira fase, o caso deve ir ao júri?",
        ladoA: {
          rotulo: "In dubio pro societate",
          argumento:
            "Quem julga crime doloso contra a vida é o júri. Havendo indícios, decidir o mérito é do Conselho de Sentença — impronunciar seria o juiz togado usurpar a soberania dos veredictos."
        },
        ladoB: {
          rotulo: "In dubio pro reo",
          argumento:
            "Não existe lei invertendo o ônus na pronúncia. A presunção de inocência é uma só, em todas as fases. Mandar a júri com prova frágil joga o réu num julgamento de altíssimo risco sem base mínima."
        }
      },
      { type: "h2", text: "A virada: o STJ desmontando a 'pseudonorma'" },
      {
        type: "p",
        text: "O cenário mudou. A 6ª Turma do STJ passou a cassar pronúncias apoiadas apenas no brocardo, e a 5ª Turma firmou que o in dubio pro societate não serve para suprir lacuna probatória — é preciso preponderância de provas de autoria sobre as de inocência. Em 2025, o STJ anulou pronúncia baseada só em testemunho indireto ('por ouvir dizer') de policiais. A doutrina garantista vai além e chama o brocardo de pseudonorma: máxima sem base legal ou constitucional, incompatível com a presunção de inocência e o sistema acusatório."
      },
      {
        type: "callout",
        text: "A distinção que vira o jogo: dúvida sobre a autoria, HAVENDO indícios suficientes, é resolvida pelo júri. Mas a dúvida sobre a própria existência de indícios suficientes é do juiz — e essa, sim, se resolve in dubio pro reo, com a impronúncia."
      },
      { type: "h2", text: "A tese defensiva que está vencendo" },
      {
        type: "p",
        text: "Para a defesa, o caminho deixou de ser apenas filosófico e virou jurisprudencial. Não se trata mais de 'pedir' que o brocardo não se aplique — trata-se de mostrar que o STJ já o afasta quando falta lastro: pronúncia exige prova real da materialidade e indícios concretos de autoria, não suposição. Atacar o testemunho indireto, a ausência de preponderância probatória e a falta de base legal do brocardo é, hoje, uma das teses mais férteis da primeira fase do júri."
      },
      {
        type: "p",
        text: "Análise doutrinária para estudo e debate; não é parecer sobre caso concreto. A aplicação concreta depende dos autos e da avaliação de um advogado."
      }
    ],
    faq: [
      {
        question: "O in dubio pro societate está previsto em lei?",
        answer:
          "Não. É construção jurisprudencial, sem previsão no CPP nem na Constituição. Essa ausência de base legal é o centro da crítica e o fundamento das decisões que vêm afastando o brocardo."
      },
      {
        question: "O STJ ainda aplica o brocardo?",
        answer:
          "Cada vez menos como automatismo. Turmas do STJ têm cassado pronúncias apoiadas só nele, exigindo preponderância de prova de autoria e rejeitando lastros frágeis, como o testemunho indireto."
      },
      {
        question: "Qual é a distinção decisiva na prática?",
        answer:
          "Dúvida sobre autoria, havendo indícios suficientes, vai ao júri. Dúvida sobre a existência desses indícios suficientes é do juiz e se resolve a favor do réu (in dubio pro reo), com impronúncia."
      },
      {
        question: "Isso serve para impronunciar o réu?",
        answer:
          "Pode servir. Demonstrando que não há indícios suficientes de autoria — apenas suposição ou prova indireta —, a defesa pede a impronúncia, e não a remessa ao plenário."
      }
    ]
  },
  {
    slug: "inconstitucionalidade-competencia-penal-lei-15358-26",
    title:
      "Lei nº 15.358/26 e a nova competência penal: por que se discute a inconstitucionalidade",
    excerpt:
      "A Lei Antifacção tirou certos homicídios do júri. Uma lei ordinária pode fazer isso? Entenda os limites constitucionais — juiz natural, competência do júri e cláusula pétrea.",
    category: "Tribunal do Júri",
    readingMinutes: 6,
    publishedAt: "2026-05-28",
    author: "Equipe AdvAqui",
    authorRole: "Equipe",
    relatedSpecialty: "criminal",
    intro:
      "A Lei nº 15.358/26 — a Lei Antifacção — nasceu para endurecer o combate ao crime organizado. Mas, em um único parágrafo, fez algo que reacendeu um debate constitucional antigo: tirou certos homicídios do Tribunal do Júri. E aí a pergunta fica inevitável — até onde o legislador pode ir sem ferir a Constituição?",
    body: [
      { type: "h2", text: "O que a Lei Antifacção fez, na prática" },
      {
        type: "p",
        text: "A Lei nº 15.358/2026 criou o crime de domínio social estruturado (art. 2º, com pena de 20 a 40 anos) e, no art. 2º, § 8º, determinou que os homicídios dolosos praticados nesse contexto — por integrante de organização criminosa ultraviolenta, milícia ou grupo paramilitar — passem a ser julgados pelas varas criminais colegiadas de 1º grau (o juízo colegiado do art. 1º-A da Lei nº 12.694/2012), e não mais pelo Tribunal do Júri. É essa troca de julgador, de sete jurados leigos para um colegiado de juízes togados, que está no centro da polêmica."
      },
      { type: "h2", text: "Competência não é detalhe — é garantia" },
      {
        type: "p",
        text: "No processo penal, definir o juízo competente não é burocracia: é garantia do cidadão contra tribunais de exceção e contra a escolha conveniente do julgador. É o princípio do juiz natural. Quando uma lei desloca competências, a primeira pergunta constitucional é se ela respeita esse princípio — ou se cria, na prática, um foro sob medida."
      },
      {
        type: "tool",
        tool: "revela",
        titulo: "As balizas constitucionais do debate",
        itens: [
          {
            termo: "Juiz natural",
            definicao:
              "Ninguém será processado nem sentenciado senão pela autoridade competente, definida por regras gerais e prévias — não por critério casuístico (art. 5º, LIII, da Constituição)."
          },
          {
            termo: "Competência do júri",
            definicao:
              "A Constituição assegura ao Tribunal do Júri a competência para julgar os crimes dolosos contra a vida (art. 5º, XXXVIII, d). É uma garantia, não mera regra de organização."
          },
          {
            termo: "Cláusula pétrea",
            definicao:
              "Núcleo da Constituição que nem emenda pode abolir — entre ele, os direitos e garantias individuais. Lei ordinária tem limite ainda mais estreito."
          }
        ]
      },
      { type: "h2", text: "Onde mora a controvérsia" },
      {
        type: "p",
        text: "A tese da inconstitucionalidade parte de um raciocínio encadeado: se a competência para certos crimes é garantia constitucional, lei ordinária não pode simplesmente subtraí-la ou redesenhá-la a ponto de esvaziá-la. Quando a nova competência toca o núcleo protegido — sobretudo o do júri —, o que está em jogo não é a conveniência da medida, mas o seu limite formal: a Constituição permite isso?"
      },
      { type: "h2", text: "O argumento mais forte: a natureza do crime, não o perfil do réu" },
      {
        type: "p",
        text: "Aqui está o coração da tese. A competência do júri é fixada pela NATUREZA do fato — crime doloso contra a vida —, não pela identidade de quem o pratica. Um homicídio continua sendo homicídio, seja o autor um cidadão comum ou um integrante de facção. Ao deslocar a competência por uma característica do RÉU (pertencer a organização criminosa), a lei se aproxima de um foro definido pela pessoa, e não pelo crime — exatamente o que o juiz natural proíbe. Há ainda o argumento de hierarquia: se nem emenda constitucional pode abolir o júri (cláusula pétrea), soaria paradoxal que a lei ordinária o esvaziasse por recorte temático."
      },
      {
        type: "tool",
        tool: "perspectiva",
        pergunta: "O legislador pode redesenhar a competência penal por lei ordinária?",
        ladoA: {
          rotulo: "Pode — é política criminal",
          argumento:
            "Definir competência e organizar a Justiça é papel do legislador. Adaptar o sistema a novas realidades criminais é função legítima do Congresso, dentro da sua margem de conformação."
        },
        ladoB: {
          rotulo: "Há um limite intransponível",
          argumento:
            "Quando a competência é, ela própria, garantia constitucional (como a do júri), a lei ordinária não pode aboli-la ou esvaziá-la. O limite não é a vontade política — é a Constituição."
        }
      },
      {
        type: "callout",
        text: "O debate raramente é tudo ou nada. Costuma girar em torno de até que ponto a lei pode ir antes de tocar o núcleo que a Constituição declarou intocável."
      },
      { type: "h2", text: "O que observar daqui pra frente" },
      {
        type: "p",
        text: "Leis assim tendem a ser testadas no controle de constitucionalidade. Para o advogado, o que importa é dominar os argumentos dos dois lados — porque eles reaparecerão em habeas corpus, em questões de competência e na sustentação oral. Conhecer o mapa do debate é estar pronto quando ele bater à porta do seu caso."
      },
      { type: "h2", text: "O que a defesa faz hoje" },
      {
        type: "p",
        text: "Na prática, quem discorda do deslocamento suscita a incompetência do juízo colegiado e sustenta a competência do júri — por exceção de incompetência e habeas corpus, pedindo que o caso volte ao tribunal popular. Em paralelo, o tema sobe ao controle concentrado (ADI), onde o art. 2º, § 8º, é discutido em abstrato. Dominar os dois planos, o do seu processo e o da ADI, é o que coloca o criminalista à frente num tema ainda em formação."
      },
      {
        type: "p",
        text: "Texto de análise doutrinária para estudo e debate; não é parecer sobre caso concreto e não esgota o conteúdo da legislação citada, cuja redação deve ser sempre conferida na fonte oficial."
      }
    ],
    faq: [
      {
        question: "A Lei nº 15.358/26 é inconstitucional?",
        answer:
          "A constitucionalidade de uma lei só é definida pelo Judiciário, em última instância pelo STF. O que existe é debate doutrinário sobre seus limites diante de garantias como o juiz natural e a competência do júri."
      },
      {
        question: "O que é o princípio do juiz natural?",
        answer:
          "É a garantia de ser julgado pela autoridade competente segundo regras gerais e prévias (art. 5º, LIII, da Constituição), o que veda tribunais de exceção e foros escolhidos por conveniência."
      },
      {
        question: "Por que a competência do júri é tão protegida?",
        answer:
          "Porque a Constituição a inscreveu entre os direitos e garantias individuais (art. 5º, XXXVIII), o que lhe confere estatura de cláusula pétrea."
      }
    ]
  },
  {
    slug: "flexibilizacao-competencia-juri-crime-organizado-lei-15358-26",
    title:
      "Júri x crime organizado: a flexibilização de competência da Lei nº 15.358/2026",
    excerpt:
      "A Lei Antifacção desloca homicídios de facção do júri para varas colegiadas. Eficiência contra garantia constitucional: entenda o choque e a estratégia de defesa.",
    category: "Tribunal do Júri",
    readingMinutes: 7,
    publishedAt: "2026-05-28",
    author: "Equipe AdvAqui",
    authorRole: "Equipe",
    relatedSpecialty: "criminal",
    intro:
      "A Lei nº 15.358/2026 — a Lei Antifacção — fez o que parecia impensável: tirou do Tribunal do Júri certos homicídios e os entregou a um colegiado de juízes togados. No papel, é combate ao crime organizado. Na Constituição, esbarra numa garantia tratada como intocável. Quem vence esse cabo de guerra?",
    body: [
      { type: "h2", text: "O que mudou com a Lei Antifacção" },
      {
        type: "p",
        text: "A Lei nº 15.358/2026 criou o crime de domínio social estruturado (art. 2º) e, no art. 2º, § 8º, deslocou os homicídios praticados nesse contexto — por organização criminosa ultraviolenta, milícia ou grupo paramilitar — do Tribunal do Júri para as varas criminais colegiadas de 1º grau (art. 1º-A da Lei nº 12.694/2012). Em vez de sete jurados leigos, um colegiado de juízes. É exatamente essa flexibilização que divide a doutrina."
      },
      { type: "h2", text: "Por que se quer flexibilizar" },
      {
        type: "p",
        text: "O argumento da flexibilização é prático: julgamentos de crimes ligados a organizações criminosas envolvem intimidação de jurados, complexidade probatória e risco à integridade do júri popular. O juízo colegiado seria, nessa visão, mais apto a julgar com segurança e técnica. A competência cederia em nome da efetividade da Justiça."
      },
      {
        type: "tool",
        tool: "perspectiva",
        pergunta: "Crimes ligados ao crime organizado devem sair do júri popular?",
        ladoA: {
          rotulo: "Sim — eficiência e segurança",
          argumento:
            "Jurados leigos ficam expostos a intimidação e à complexidade desses casos. Um juízo especializado protege o julgamento, os próprios jurados e a sociedade, reduzindo o risco de veredictos pressionados."
        },
        ladoB: {
          rotulo: "Não — é garantia, não opção",
          argumento:
            "A competência do júri para crimes dolosos contra a vida é garantia constitucional. Abrir exceções por tipo de réu cria seletividade e abre a porta para esvaziar o júri sempre que for conveniente."
        }
      },
      { type: "h2", text: "O nó constitucional" },
      {
        type: "p",
        text: "A Constituição assegura ao júri a competência para os crimes dolosos contra a vida (art. 5º, XXXVIII, d). Se um homicídio praticado no contexto do crime organizado continua sendo, na essência, um crime doloso contra a vida, a pergunta é inevitável: uma lei pode retirá-lo do júri? Para a tese garantista, não — porque o que define a competência é a natureza do crime, não o perfil do réu. Para a tese da flexibilização, a Constituição comportaria conformação legislativa diante de novas realidades."
      },
      { type: "h2", text: "Mais do que competência: a soberania dos veredictos" },
      {
        type: "p",
        text: "O júri não é só um rito — é uma escolha política da Constituição de entregar ao povo o julgamento dos crimes mais graves contra a vida, com soberania dos veredictos. Tirar esses casos do júri não muda apenas QUEM julga; muda a lógica do julgamento, do convencimento de leigos para a fundamentação técnica de juízes togados. É aí que a flexibilização mais incomoda a corrente garantista: ela mexe num arranjo que a Constituição quis, deliberadamente, fora do alcance da conveniência de cada época."
      },
      {
        type: "tool",
        tool: "timeline",
        titulo: "Como o caso costuma caminhar quando a competência é contestada",
        etapas: [
          {
            titulo: "1. A lei é aplicada",
            texto:
              "O homicídio é deslocado do júri para a vara criminal colegiada de 1º grau (art. 1º-A da Lei nº 12.694/2012), com base no art. 2º, § 8º, da Lei Antifacção."
          },
          {
            titulo: "2. A defesa suscita a questão",
            texto:
              "Por exceção de incompetência ou habeas corpus, sustenta-se que o caso deveria permanecer no júri, por força da garantia constitucional."
          },
          {
            titulo: "3. Os tribunais se dividem",
            texto:
              "Surgem decisões em sentidos opostos, e o tema amadurece nas instâncias até alcançar as cortes superiores."
          },
          {
            titulo: "4. A palavra final",
            texto:
              "Caberá ao Supremo Tribunal Federal, guardião da Constituição, dizer se a flexibilização é compatível com a garantia do júri."
          }
        ]
      },
      {
        type: "callout",
        text: "Repare: o mesmo fato — um homicídio — pode ter destino processual diferente conforme a lei classifica o contexto. É aí que a discussão sai da teoria e vira estratégia de defesa."
      },
      { type: "h2", text: "O que o criminalista leva disso" },
      {
        type: "p",
        text: "Esteja de que lado estiver, o advogado que domina os dois argumentos atua melhor: sabe quando suscitar a incompetência, como sustentar a permanência no júri e o que esperar dos tribunais. Em um tema novo e ainda indefinido, sair na frente no domínio da tese é vantagem concreta para o cliente."
      },
      {
        type: "p",
        text: "Conteúdo de análise doutrinária para estudo e debate. Não é parecer sobre caso concreto e não dispensa a leitura da íntegra da lei na fonte oficial nem a orientação de um advogado."
      }
    ],
    faq: [
      {
        question: "A competência do júri pode ser alterada por lei?",
        answer:
          "Há intenso debate. A corrente garantista sustenta que, por ser garantia constitucional (art. 5º, XXXVIII), o núcleo da competência do júri não pode ser esvaziado por lei ordinária; outra corrente admite conformação legislativa. A palavra final é do STF."
      },
      {
        question: "O que muda na prática para a defesa?",
        answer:
          "Abre-se espaço para discutir a competência (via exceção de incompetência ou habeas corpus), sustentando a permanência do caso no Tribunal do Júri."
      },
      {
        question: "Isso vale para qualquer crime?",
        answer:
          "O debate se concentra nos crimes dolosos contra a vida praticados em contexto de organização criminosa — exatamente onde a garantia do júri e a política de segurança se chocam."
      }
    ]
  },
  {
    slug: "lei-antifaccao-15358-o-que-muda-na-pratica-penal",
    title: "Lei Antifacção (15.358/26): o que muda na prática penal",
    excerpt:
      "Novo crime de 20 a 40 anos, prisão preventiva facilitada, perdimento de bens e o fim do auxílio-reclusão para condenados. O guia direto da Lei Antifacção — com os pontos já contestados.",
    category: "Tribunal do Júri",
    readingMinutes: 7,
    publishedAt: "2026-05-30",
    author: "Equipe AdvAqui",
    authorRole: "Equipe",
    relatedSpecialty: "criminal",
    intro:
      "Sancionada em março de 2026 e em vigor no dia seguinte, a Lei nº 15.358 — a Lei Antifacção — é o novo Marco Legal do Combate ao Crime Organizado. Em um só diploma, criou crime novo, endureceu a prisão, mexeu na competência e cortou benefícios. Para o criminalista, é leitura obrigatória; para o cidadão, é entender o que mudou. Aqui está o essencial, com os pontos que já estão sendo questionados.",
    body: [
      { type: "h2", text: "Uma lei, muitas mudanças" },
      {
        type: "p",
        text: "A Lei Antifacção (Lei nº 15.358/2026) não é uma alteração pontual: reescreveu vários trechos da legislação penal de uma vez, com o objetivo declarado de combater organizações criminosas ultraviolentas, milícias e grupos paramilitares. Entrou em vigor na publicação, sem período de adaptação — ou seja, já está valendo."
      },
      {
        type: "tool",
        tool: "revela",
        titulo: "Os conceitos-chave da nova lei",
        itens: [
          {
            termo: "Domínio social estruturado",
            definicao:
              "Novo crime (art. 2º): exercer controle sobre território, comunidade ou atividade econômica por violência, grave ameaça ou meios que levem à submissão coletiva. Pena de reclusão de 20 a 40 anos."
          },
          {
            termo: "Organização criminosa ultraviolenta",
            definicao:
              "Categoria que a lei usa para endurecer o tratamento de facções, milícias e grupos paramilitares que atuam com violência sistemática."
          },
          {
            termo: "Perdimento de bens",
            definicao:
              "Perda, em favor do Estado, dos instrumentos usados no crime — que a nova lei tornou obrigatória nesse contexto, ainda que não haja risco de reutilização."
          },
          {
            termo: "Intranscendência das penas",
            definicao:
              "Princípio constitucional (art. 5º, XLV): a pena não passa da pessoa do condenado. É o fundamento da crítica ao corte do auxílio-reclusão."
          }
        ]
      },
      { type: "h2", text: "O novo crime — e penas mais duras" },
      {
        type: "p",
        text: "O coração da lei é o crime de domínio social estruturado, com pena de 20 a 40 anos e regime de cumprimento severo. A lógica é alcançar não só quem manda, mas quem sustenta a estrutura. Vieram junto um homicídio qualificado quando praticado nesse contexto e o aumento de pena para lesões na mesma situação."
      },
      { type: "h2", text: "Prisão, bens e benefícios: o cerco se fecha" },
      {
        type: "ul",
        items: [
          "Prisão preventiva: praticar os crimes do art. 2º passa a ser fundamento próprio para a preventiva (art. 313 do CPP).",
          "Perdimento de bens: tornou-se obrigatório para os instrumentos do crime de facções e milícias.",
          "Benefícios restringidos: lideranças ligadas a esses crimes perdem acesso a anistia, indulto, fiança e livramento condicional, com progressão de regime mais dura.",
          "Auxílio-reclusão: vedado às famílias de condenados por domínio social estruturado."
        ]
      },
      { type: "h2", text: "Onde a lei já é contestada" },
      {
        type: "p",
        text: "Dureza não é o mesmo que constitucionalidade — e dois pontos concentram a crítica. O primeiro é a competência: o art. 2º, § 8º, retira do Tribunal do Júri os homicídios praticados nesse contexto e os manda para as varas criminais colegiadas de 1º grau (art. 1º-A da Lei nº 12.694/2012), o que esbarra na garantia constitucional do júri. O segundo é o corte do auxílio-reclusão: ao atingir a família do preso, a medida tensiona o princípio da intranscendência das penas (art. 5º, XLV), pelo qual a pena não pode passar da pessoa do condenado."
      },
      {
        type: "tool",
        tool: "perspectiva",
        pergunta: "A Lei Antifacção acerta o tom no combate às facções?",
        ladoA: {
          rotulo: "Sim — o Estado precisava de ferramentas",
          argumento:
            "Facções ultraviolentas dominam territórios e intimidam a Justiça. Penas altas, perdimento e prisão facilitada dão ao Estado meios proporcionais à gravidade do problema."
        },
        ladoB: {
          rotulo: "Cuidado — há excessos inconstitucionais",
          argumento:
            "Retirar casos do júri e punir a família do preso ferem garantias que valem para todos. Lei dura que ignora a Constituição vira munição para nulidades futuras."
        }
      },
      {
        type: "callout",
        text: "Para a defesa, a leitura é dupla: conhecer cada novo rigor da lei E mapear seus flancos constitucionais. As teses de incompetência (manter o caso no júri) e de inconstitucionalidade da vedação do auxílio-reclusão já nascem fortes."
      },
      { type: "h2", text: "O que dominar agora" },
      {
        type: "p",
        text: "Quem atua no criminal não tem o luxo de esperar a poeira baixar: a lei já está em vigor e aparecendo nos processos. Vale dominar o tipo do art. 2º e suas penas, as novas hipóteses de preventiva e as restrições de benefícios — e, do outro lado, as teses defensivas: competência do júri, intranscendência das penas e proporcionalidade. É esse domínio que diferencia o advogado no momento em que o cliente mais precisa."
      },
      {
        type: "p",
        text: "Conteúdo de análise doutrinária para estudo e debate; não é parecer sobre caso concreto e não esgota a lei, cuja íntegra deve ser conferida na fonte oficial."
      }
    ],
    faq: [
      {
        question: "O que é o crime de domínio social estruturado?",
        answer:
          "É o novo tipo penal do art. 2º da Lei 15.358/2026: exercer controle sobre território, comunidade ou atividade econômica por violência, ameaça ou submissão coletiva. A pena é de reclusão de 20 a 40 anos."
      },
      {
        question: "Por que o corte do auxílio-reclusão é criticado?",
        answer:
          "Porque atinge a família do preso, e não o condenado. Isso tensiona o princípio da intranscendência das penas (art. 5º, XLV, da Constituição), pelo qual a pena não pode passar da pessoa que cometeu o crime."
      },
      {
        question: "A lei tira mesmo homicídios do Tribunal do Júri?",
        answer:
          "Em parte: o art. 2º, § 8º, desloca os homicídios praticados em contexto de facção para varas criminais colegiadas (Lei 12.694/2012). É um dos pontos mais contestados, por tocar a competência constitucional do júri."
      },
      {
        question: "A Lei Antifacção já está valendo?",
        answer:
          "Sim. Foi publicada em março de 2026 e entrou em vigor na data da publicação, sem período de vacância — já se aplica aos casos."
      }
    ]
  },
  {
    slug: "soberania-dos-veredictos-recurso-decisao-juri",
    title: "O júri decidiu — dá para recorrer? A soberania dos veredictos na prática",
    excerpt:
      "Os jurados condenaram (ou absolveram) e você discorda. Cabe recurso? Entenda a apelação por decisão manifestamente contrária à prova (art. 593, III, d), o limite de um único novo júri e por que a soberania dos veredictos muda tudo.",
    category: "Tribunal do Júri",
    readingMinutes: 6,
    publishedAt: "2026-05-30",
    author: "Equipe AdvAqui",
    authorRole: "Equipe",
    relatedSpecialty: "criminal",
    intro:
      "Terminou o plenário, os jurados decidiram — e o resultado foi o oposto do que uma das partes esperava. Vem a pergunta imediata: dá para recorrer da decisão do júri? Sim, mas não como num processo comum. A Constituição blindou o veredicto com a soberania dos veredictos, e isso molda — e limita — todos os recursos. Entenda o que realmente cabe.",
    body: [
      { type: "h2", text: "A decisão do júri é soberana — mas não é intocável" },
      {
        type: "p",
        text: "A Constituição assegura a soberania dos veredictos (art. 5º, XXXVIII, 'c'): quem dá a última palavra sobre o mérito de um crime doloso contra a vida é o Conselho de Sentença, não os juízes togados. Isso não significa que não há recurso — significa que o recurso não pode simplesmente substituir a vontade dos jurados pela do tribunal. Daí a apelação no júri ter um desenho próprio, mais estreito que no processo comum."
      },
      {
        type: "tool",
        tool: "revela",
        titulo: "Os conceitos que organizam o recurso",
        itens: [
          {
            termo: "Soberania dos veredictos",
            definicao:
              "Garantia constitucional (art. 5º, XXXVIII, 'c'): a decisão de mérito dos jurados prevalece e não pode ser trocada pela opinião do tribunal — no máximo, anulada para novo julgamento."
          },
          {
            termo: "Apelação no júri",
            definicao:
              "Recurso cabível contra a decisão do júri, mas só nas hipóteses taxativas do art. 593, III, do CPP — não é um recurso amplo de mérito."
          },
          {
            termo: "Manifestamente contrária à prova dos autos",
            definicao:
              "A hipótese mais discutida (art. 593, III, 'd'): a decisão não tem apoio em NENHUMA versão razoável da prova. Não basta o tribunal discordar — tem que ser escancarada."
          },
          {
            termo: "Novo júri",
            definicao:
              "Consequência de prover a apelação da alínea 'd': o caso volta a um NOVO Conselho de Sentença — o tribunal não decide o mérito, para respeitar a soberania."
          }
        ]
      },
      { type: "h2", text: "As quatro portas do art. 593, III" },
      {
        type: "p",
        text: "A apelação contra a decisão do júri só cabe em quatro situações, e cada uma tem um efeito diferente:"
      },
      {
        type: "ul",
        items: [
          "a) Nulidade posterior à pronúncia — vício no rito do plenário (ex.: cerceamento de defesa). O tribunal anula e manda refazer.",
          "b) Sentença do juiz-presidente contrária à lei ou à decisão dos jurados — aqui o erro é do juiz, não dos jurados; o tribunal corrige a sentença.",
          "c) Erro ou injustiça na aplicação da pena ou da medida de segurança — o tribunal ajusta a dosimetria, sem tocar no veredicto.",
          "d) Decisão dos jurados manifestamente contrária à prova dos autos — a única que mira o mérito do veredicto, e a mais limitada."
        ]
      },
      { type: "h2", text: "A porta mais difícil: a alínea 'd'" },
      {
        type: "p",
        text: "É na alínea 'd' que mora a confusão. Se o tribunal entender que os jurados decidiram contra prova manifesta, ele NÃO absolve nem condena — manda o réu a um NOVO júri, justamente para não ferir a soberania. E há um limite decisivo: por esse mesmo fundamento, só cabe UMA apelação (art. 593, § 3º). Se o segundo júri decidir no mesmo sentido, acabou — não há terceiro julgamento por 'contrariedade à prova'."
      },
      {
        type: "callout",
        text: "O ponto que ganha ou perde o recurso: se havia DUAS versões plausíveis na prova e os jurados escolheram uma delas, a decisão NÃO é manifestamente contrária à prova — é uma opção legítima do Conselho. A alínea 'd' só vale quando o veredicto não encontra apoio em nenhuma leitura razoável dos autos."
      },
      {
        type: "tool",
        tool: "quiz",
        pergunta:
          "Havia duas versões plausíveis nos autos. Os jurados absolveram, adotando a versão da defesa. A acusação apela com base no art. 593, III, 'd'. Qual o resultado mais provável?",
        opcoes: [
          {
            texto: "O tribunal reforma e condena o réu",
            explicacao:
              "Não pode. Mesmo se desse provimento, o tribunal não condenaria — mandaria a novo júri. A soberania impede que o togado decida o mérito."
          },
          {
            texto: "A apelação é negada: havendo duas versões, a escolha dos jurados é legítima",
            correta: true,
            explicacao:
              "Exato. Com duas versões plausíveis, o veredicto não é 'manifestamente contrário à prova'. A alínea 'd' não serve para impor a versão que o tribunal prefere."
          },
          {
            texto: "O caso vai automaticamente a novo júri",
            explicacao:
              "Só se a decisão fosse escancaradamente sem apoio na prova. Existindo versão razoável que sustente o veredicto, não há provimento."
          }
        ]
      },
      { type: "h2", text: "O que isso significa na sua estratégia" },
      {
        type: "p",
        text: "Para o criminalista, a lição é dupla. Ao recorrer, escolher a alínea certa muda tudo: discutir pena é alínea 'c'; atacar nulidade é 'a'; só se arrisca na 'd' quando o veredicto é realmente insustentável — e lembrando do tiro único. Ao defender o veredicto favorável, o caminho é mostrar que existia base probatória para a escolha dos jurados. Dominar esse mapa é o que separa um recurso bem direcionado de um recurso natimorto."
      },
      {
        type: "p",
        text: "Conteúdo de análise para estudo e debate; não é parecer sobre caso concreto. Cada recurso no júri depende das particularidades dos autos e da orientação de um advogado."
      }
    ],
    faq: [
      {
        question: "Cabe recurso contra a decisão do júri?",
        answer:
          "Sim, por apelação, mas só nas hipóteses do art. 593, III, do CPP (nulidade, erro do juiz, erro na pena ou decisão manifestamente contrária à prova). Não é um recurso amplo de mérito."
      },
      {
        question: "O tribunal pode mudar a pena fixada no júri?",
        answer:
          "Pode, pela alínea 'c' do art. 593, III, quando há erro ou injustiça na aplicação da pena — isso não fere a soberania, porque não muda o veredicto, só a dosimetria."
      },
      {
        question: "Quantas vezes dá para apelar por 'decisão contrária à prova'?",
        answer:
          "Apenas uma. Provida a apelação da alínea 'd', o réu vai a novo júri; pelo mesmo fundamento não cabe segunda apelação (art. 593, § 3º, do CPP)."
      },
      {
        question: "O que é a soberania dos veredictos?",
        answer:
          "É a garantia (art. 5º, XXXVIII, 'c', da Constituição) de que a decisão de mérito é dos jurados. O tribunal pode anular para novo júri, mas não substituir o veredicto pela própria convicção."
      }
    ]
  }
];

export function getAllArticles(): Article[] {
  // Ordenado do mais recente para o mais antigo.
  return [...ARTICLES].sort((a, b) =>
    (b.publishedAt || "").localeCompare(a.publishedAt || "")
  );
}

export function getArticleBySlug(slug: string): Article | null {
  return ARTICLES.find((a) => a.slug === slug) || null;
}

export function getAllArticleSlugs(): string[] {
  return ARTICLES.map((a) => a.slug);
}

export function getRelatedArticles(slug: string, count = 3): Article[] {
  const current = getArticleBySlug(slug);
  if (!current) return [];
  // Prioriza mesma categoria, completa com outros mais recentes.
  const sameCat = ARTICLES.filter(
    (a) => a.slug !== slug && a.category === current.category
  );
  const others = ARTICLES.filter(
    (a) => a.slug !== slug && a.category !== current.category
  );
  return [...sameCat, ...others].slice(0, count);
}
