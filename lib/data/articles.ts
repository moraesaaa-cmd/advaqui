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
  /** Origem do artigo: "seed" para hardcoded, "db" para gerados pelo robo. */
  _source?: "seed" | "db";
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
  },
  {
    slug: "usucapiao-como-dar-entrada",
    title: "Usucapião em 2026: o que é, requisitos, prazos e como dar entrada",
    excerpt:
      "Entenda as modalidades de usucapião, os prazos de cada uma, como funciona o usucapião em cartório e quais documentos reunir para dar entrada.",
    category: "Imobiliário",
    readingMinutes: 11,
    publishedAt: "2026-07-01",
    author: "Equipe AdvAqui",
    authorRole: "Equipe",
    relatedSpecialty: "imobiliario",
    intro:
      "Quem mora ou usa um imóvel há muitos anos como se fosse dono — cuidando, pagando as contas, sem ninguém contestar — pode ter direito de virar dono de verdade. É isso que o usucapião faz: transforma a posse prolongada em propriedade registrada. Este guia explica, em linguagem simples, quais são as modalidades, os prazos de cada uma, os documentos necessários e o caminho para dar entrada — inclusive a via mais rápida, direto no cartório.",
    body: [
      { type: "h2", text: "O que é usucapião e quando ele se aplica?" },
      {
        type: "p",
        text: "Usucapião é a forma de adquirir a propriedade de um bem (imóvel ou móvel) pelo uso prolongado, contínuo e sem oposição, como se você fosse o dono. A lógica da lei é dar função social ao patrimônio: se o dono registrado abandonou o imóvel por anos e outra pessoa passou a ocupá-lo, cuidar dele e tratá-lo como seu, chega um momento em que essa posse se converte em propriedade. As regras principais estão nos arts. 1.238 a 1.244 do Código Civil e, para as modalidades especiais, nos arts. 183 e 191 da Constituição."
      },
      {
        type: "p",
        text: "Na prática, o usucapião aparece em situações muito comuns: a casa comprada 'de contrato de gaveta' que nunca foi passada para o nome do comprador, o terreno herdado informalmente e ocupado pela família há décadas, o lote sem matrícula em loteamento antigo, o imóvel cedido verbalmente que o dono nunca mais reclamou. Em todos esses casos, o usucapião pode ser o caminho para regularizar o registro."
      },
      { type: "h2", text: "Quais são as modalidades de usucapião e seus prazos?" },
      {
        type: "p",
        text: "O prazo de posse exigido varia conforme a modalidade. As principais são:"
      },
      {
        type: "ul",
        items: [
          "Extraordinária (art. 1.238 do CC): 15 anos de posse, sem precisar de justo título nem boa-fé. Cai para 10 anos se o possuidor mora no imóvel ou nele realizou obras e serviços produtivos",
          "Ordinária (art. 1.242 do CC): 10 anos de posse, com justo título (ex.: contrato de compra e venda não registrado) e boa-fé. Cai para 5 anos se o imóvel foi adquirido onerosamente com registro depois cancelado e o possuidor mora nele ou fez investimentos",
          "Especial urbana (art. 1.240 do CC e art. 183 da CF): 5 anos de posse de imóvel urbano de até 250 m², usado para moradia própria ou da família, desde que o possuidor não seja dono de outro imóvel",
          "Especial rural (art. 1.239 do CC e art. 191 da CF): 5 anos de posse de área rural de até 50 hectares, tornada produtiva pelo trabalho do possuidor e usada como moradia, sem ser dono de outro imóvel",
          "Familiar (art. 1.240-A do CC): 2 anos de posse exclusiva de imóvel urbano de até 250 m² dividido com ex-cônjuge ou ex-companheiro que abandonou o lar, usado para moradia, sem ter outro imóvel",
          "Coletiva (Estatuto da Cidade, Lei 10.257/2001): para núcleos urbanos ocupados por população de baixa renda, quando não é possível identificar o terreno de cada possuidor"
        ]
      },
      { type: "h2", text: "Quais são os requisitos para usucapir um imóvel?" },
      {
        type: "p",
        text: "Independentemente da modalidade, alguns requisitos se repetem e precisam ser comprovados:"
      },
      {
        type: "ul",
        items: [
          "Posse mansa e pacífica — ninguém contestou a ocupação (nem o dono registrado, nem vizinhos, nem herdeiros) durante todo o prazo",
          "Posse contínua e sem interrupção — o possuidor não abandonou o imóvel no meio do caminho. A lei permite somar o tempo de posse do antecessor (ex.: de quem lhe vendeu por contrato de gaveta)",
          "Posse com intenção de dono (animus domini) — quem ocupa como inquilino, caseiro ou por empréstimo (comodato) não conta prazo, porque reconhece que o dono é outro",
          "Decurso do prazo legal da modalidade escolhida",
          "Nas modalidades especiais: metragem máxima, uso para moradia e não ser proprietário de outro imóvel"
        ]
      },
      {
        type: "callout",
        text: "Imóveis públicos não podem ser usucapidos, em nenhuma modalidade e por mais longa que seja a ocupação (art. 183, § 3º, e art. 191, parágrafo único, da Constituição). Terrenos da União, do estado ou do município seguem caminhos próprios de regularização fundiária, não o usucapião."
      },
      { type: "h2", text: "O que é usucapião extrajudicial e como funciona no cartório?" },
      {
        type: "p",
        text: "Desde 2015 (art. 216-A da Lei 6.015/73, incluído pelo CPC), o usucapião pode ser reconhecido diretamente no cartório de registro de imóveis, sem processo judicial — é o chamado usucapião extrajudicial. É a via mais rápida quando não há briga: costuma resolver em meses, enquanto o processo judicial pode levar anos. O passo a passo é este:"
      },
      {
        type: "ol",
        items: [
          "Contratar advogado — a lei exige que o pedido no cartório seja assinado por advogado, mesmo sendo extrajudicial",
          "Lavrar a ata notarial no tabelionato de notas — o tabelião atesta o tempo de posse e as circunstâncias da ocupação, com base em documentos e na visita ao imóvel",
          "Providenciar planta e memorial descritivo do imóvel, assinados por profissional habilitado (engenheiro ou arquiteto com ART/RRT) e, quando possível, pelos confinantes (vizinhos de divisa)",
          "Reunir certidões negativas de ações possessórias e reivindicatórias em nome do possuidor",
          "Protocolar o requerimento no cartório de registro de imóveis da circunscrição do imóvel",
          "O cartório notifica o proprietário registrado, os confinantes e as Fazendas Públicas (União, estado e município) para se manifestarem",
          "Sem impugnação, o oficial registra a propriedade em nome do possuidor. Havendo impugnação fundamentada, o caso é remetido à via judicial"
        ]
      },
      { type: "h2", text: "Quais documentos preciso para dar entrada no usucapião?" },
      {
        type: "ul",
        items: [
          "RG, CPF e comprovante de estado civil do possuidor (e do cônjuge, se casado)",
          "Ata notarial atestando o tempo de posse (na via extrajudicial)",
          "Planta e memorial descritivo do imóvel assinados por profissional habilitado",
          "Provas da posse ao longo do tempo: contas de água, luz e IPTU pagas, contrato de compra e venda 'de gaveta', recibos de reforma, fotos datadas, declarações de vizinhos",
          "Certidão da matrícula do imóvel (ou certidão de que não há matrícula), emitida pelo cartório de registro de imóveis",
          "Certidões negativas de ações possessórias em nome do requerente",
          "Justo título, quando a modalidade exigir (ex.: compromisso de compra e venda)"
        ]
      },
      { type: "h2", text: "Quanto tempo demora e quanto custa o usucapião?" },
      {
        type: "p",
        text: "Na via extrajudicial, com documentação completa e sem impugnação, o reconhecimento costuma sair em alguns meses — o prazo varia conforme o cartório e as notificações. Na via judicial, o processo costuma levar de 2 a 5 anos, dependendo da comarca e de haver ou não disputa. Os custos envolvem emolumentos do tabelionato (ata notarial) e do registro de imóveis, honorários do profissional que assina a planta, eventuais custas judiciais e os honorários do advogado — os valores variam por estado e pelo valor do imóvel. Quem não tem condições de pagar pode requerer gratuidade, tanto na Justiça quanto, em várias hipóteses, nos emolumentos de cartório."
      },
      { type: "h2", text: "Quando o usucapião precisa ir para a Justiça?" },
      {
        type: "p",
        text: "A via judicial é o caminho quando o proprietário registrado, um confinante ou a Fazenda Pública impugna o pedido no cartório, quando há disputa sobre a posse (invasão contestada, briga entre herdeiros), quando não se localizam pessoas que precisam ser notificadas ou quando o caso exige produção de provas mais complexas, como testemunhas e perícia. No processo judicial, o juiz analisa as provas, ouve os interessados e, ao final, a sentença que reconhece o usucapião é levada a registro no cartório de imóveis — com o mesmo efeito da via extrajudicial."
      },
      { type: "h2", text: "Quando procurar um advogado?" },
      {
        type: "p",
        text: "Sempre — no usucapião o advogado é obrigatório por lei, tanto na via judicial quanto na extrajudicial. Além da exigência formal, a escolha da modalidade correta muda o prazo exigido (de 15 para 10, 5 ou até 2 anos) e a estratégia de prova. Um advogado da área imobiliária avalia qual modalidade se encaixa no seu caso, organiza as provas da posse e conduz o procedimento no cartório ou na Justiça. A consulta inicial costuma esclarecer, já de saída, se o seu tempo de posse é suficiente."
      }
    ],
    faq: [
      {
        question: "Quem mora de aluguel pode pedir usucapião do imóvel?",
        answer:
          "Não. O inquilino reconhece que o dono é outro (paga aluguel justamente por isso), então a posse dele não tem intenção de dono e não conta prazo para usucapião. O mesmo vale para caseiros e para quem recebeu o imóvel emprestado (comodato)."
      },
      {
        question: "Pagar IPTU por muitos anos garante o usucapião?",
        answer:
          "Pagar IPTU é uma prova importante de que você trata o imóvel como seu, mas sozinho não basta. É preciso comprovar também a posse mansa, contínua e com intenção de dono pelo prazo da modalidade escolhida."
      },
      {
        question: "Posso usucapir imóvel de herança ocupado só por mim?",
        answer:
          "Em regra, o herdeiro que ocupa o imóvel da herança possui em nome de todos os herdeiros. O STJ, porém, admite usucapião por um herdeiro quando ele exerce posse exclusiva, com intenção de dono e sem oposição dos demais pelo prazo legal. É situação que exige análise cuidadosa das provas."
      },
      {
        question: "Terreno sem matrícula ou sem escritura pode ser usucapido?",
        answer:
          "Pode. O usucapião é justamente um dos caminhos para regularizar imóvel sem registro: a sentença judicial ou o reconhecimento extrajudicial gera a abertura de matrícula em nome do possuidor no cartório de imóveis."
      },
      {
        question: "O usucapião extrajudicial é aceito em todo o Brasil?",
        answer:
          "Sim. O art. 216-A da Lei 6.015/73 vale em todo o país e o procedimento é regulamentado pelo Provimento 65/2017 do CNJ. Qualquer cartório de registro de imóveis está apto a processar o pedido da sua circunscrição."
      }
    ]
  },
  {
    slug: "bpc-loas-quem-tem-direito",
    title: "BPC/LOAS em 2026: quem tem direito, qual o valor e como pedir no INSS",
    excerpt:
      "Veja os requisitos do BPC para idosos e pessoas com deficiência, como funciona a renda por pessoa, o CadÚnico e o que fazer se o INSS negar.",
    category: "Previdenciário",
    readingMinutes: 10,
    publishedAt: "2026-07-01",
    author: "Equipe AdvAqui",
    authorRole: "Equipe",
    relatedSpecialty: "previdenciario",
    intro:
      "O BPC — Benefício de Prestação Continuada, conhecido como LOAS — garante um salário mínimo por mês a idosos com 65 anos ou mais e a pessoas com deficiência de qualquer idade que vivem em famílias de baixa renda. Ele não exige nenhuma contribuição ao INSS, o que o torna a principal proteção de quem nunca conseguiu contribuir. Este guia explica quem tem direito, como se calcula a renda da família, o papel do CadÚnico, o passo a passo do pedido e o que fazer quando o INSS nega.",
    body: [
      { type: "h2", text: "O que é o BPC/LOAS e qual é o valor do benefício?" },
      {
        type: "p",
        text: "O BPC é um benefício assistencial previsto no art. 20 da Lei 8.742/93 (a Lei Orgânica da Assistência Social — por isso o apelido 'LOAS') e no art. 203, V, da Constituição. O valor é de um salário mínimo por mês. Por ser assistencial, e não previdenciário, ele não exige carência nem contribuições ao INSS — mas também não paga 13º salário e não gera pensão por morte para os dependentes."
      },
      { type: "h2", text: "Quem tem direito ao BPC: idoso e pessoa com deficiência" },
      {
        type: "p",
        text: "Dois grupos podem receber o benefício, desde que cumpram o critério de renda:"
      },
      {
        type: "ul",
        items: [
          "Idoso com 65 anos ou mais, homem ou mulher, que comprove baixa renda familiar",
          "Pessoa com deficiência de qualquer idade — inclusive crianças — com impedimento de longo prazo (a lei considera longo prazo o mínimo de 2 anos) de natureza física, mental, intelectual ou sensorial que, em interação com barreiras, dificulte a participação plena na sociedade em igualdade de condições"
        ]
      },
      {
        type: "p",
        text: "Para a pessoa com deficiência, o INSS faz duas avaliações: a perícia médica, que analisa o impedimento, e a avaliação social, que analisa as barreiras enfrentadas no dia a dia (escola, trabalho, transporte, dependência de cuidados). Não é preciso ser 'incapaz para toda atividade' — o que se avalia é o conjunto do impedimento com as barreiras sociais."
      },
      { type: "h2", text: "Como funciona o cálculo da renda por pessoa da família?" },
      {
        type: "p",
        text: "A regra geral do art. 20, § 3º, da Lei 8.742/93 é: a renda mensal da família, dividida pelo número de integrantes, deve ser inferior a 1/4 do salário mínimo por pessoa. Contam como família, para esse cálculo, as pessoas que vivem sob o mesmo teto: o requerente, cônjuge ou companheiro, pais (ou madrasta/padrasto), irmãos solteiros, filhos e enteados solteiros e menores tutelados."
      },
      {
        type: "p",
        text: "Algumas rendas ficam de fora da conta. O BPC já recebido por um idoso da família não entra no cálculo do BPC de outro idoso, e a Lei 14.176/2021 também manda desconsiderar, em situações específicas, benefícios de até um salário mínimo recebidos por outro idoso ou pessoa com deficiência da casa. Gastos comprovados com remédios, fraldas, alimentação especial e consultas podem ser abatidos na análise."
      },
      {
        type: "callout",
        text: "A renda um pouco acima de 1/4 do salário mínimo não fecha a porta automaticamente. A Lei 14.176/2021 autoriza ampliar o limite para até 1/2 salário mínimo por pessoa conforme o grau da deficiência, o comprometimento do orçamento com saúde e a vulnerabilidade da família — e a Justiça, há anos, aceita provar a miserabilidade por outros meios além do número frio da renda."
      },
      { type: "h2", text: "O que é o CadÚnico e por que ele é obrigatório?" },
      {
        type: "p",
        text: "O Cadastro Único (CadÚnico) é o registro do governo federal que identifica as famílias de baixa renda. Desde 2016, estar inscrito no CadÚnico, com os dados atualizados nos últimos 2 anos, é requisito obrigatório para pedir e para continuar recebendo o BPC. A inscrição é gratuita e feita no CRAS (Centro de Referência de Assistência Social) do seu município, levando os documentos de todos que moram na casa. Antes de dar entrada no benefício, confira se o cadastro da família está atualizado — pedido com CadÚnico desatualizado é negado sem nem passar pela análise da renda."
      },
      { type: "h2", text: "Como pedir o BPC no INSS passo a passo?" },
      {
        type: "ol",
        items: [
          "Inscreva ou atualize o CadÚnico da família no CRAS do seu município",
          "Reúna os documentos: RG e CPF de todos da casa, comprovante de residência, comprovantes de renda e, no caso de deficiência, laudos, exames e receitas médicas",
          "Faça o pedido pelo aplicativo ou site Meu INSS (serviço 'Benefício Assistencial') ou pelo telefone 135 — não precisa ir à agência para protocolar",
          "No caso de pessoa com deficiência, aguarde o agendamento da perícia médica e da avaliação social e compareça levando todos os laudos originais",
          "Acompanhe o andamento pelo Meu INSS. O prazo regular de análise é de até 90 dias, mas pode variar",
          "Se aprovado, o pagamento começa a contar da data do requerimento — valores do período de análise são pagos de forma retroativa"
        ]
      },
      { type: "h2", text: "O INSS negou o BPC: o que fazer agora?" },
      {
        type: "p",
        text: "A negativa não é o fim do caminho — uma parte grande dos pedidos é negada na via administrativa e depois revertida. Os motivos mais comuns são renda considerada acima do limite, perícia que não reconheceu o impedimento de longo prazo e CadÚnico desatualizado. Diante da negativa, existem três caminhos:"
      },
      {
        type: "ul",
        items: [
          "Recurso administrativo à Junta de Recursos, no prazo de 30 dias contados da ciência da decisão — feito pelo próprio Meu INSS, sem custo",
          "Novo requerimento, quando o problema era documental (ex.: CadÚnico vencido, laudo incompleto) e já foi corrigido",
          "Ação judicial no Juizado Especial Federal — para causas de até 60 salários mínimos não há custas nem obrigação de advogado, e o juiz determina nova perícia e pode mandar avaliar a real situação socioeconômica da família, com critérios mais amplos que os do INSS"
        ]
      },
      { type: "h2", text: "O BPC pode ser cortado? Como funciona a revisão?" },
      {
        type: "p",
        text: "Pode. O BPC é revisto periodicamente para verificar se as condições que deram origem ao benefício continuam existindo — a lei prevê reavaliação a cada 2 anos. Na prática, os cortes mais comuns acontecem por CadÚnico desatualizado, mudança na renda da família ou não comparecimento a convocações do INSS. Se o benefício for bloqueado ou cessado, o beneficiário deve ser notificado antes e tem direito de se defender, apresentando documentos, e de recorrer da decisão — inclusive na Justiça, se necessário. Manter o CadÚnico em dia a cada 2 anos é a melhor forma de evitar sustos."
      },
      { type: "h2", text: "Quando procurar um advogado?" },
      {
        type: "p",
        text: "Procure orientação profissional se o pedido foi negado por renda e a família tem gastos altos com saúde, se a perícia não reconheceu uma deficiência bem documentada, se o benefício foi cortado sem explicação clara ou se o caso envolve discussão sobre quem compõe a família para o cálculo. Um advogado previdenciário sabe montar a prova da vulnerabilidade (laudos, orçamento familiar, relatórios do CRAS) e escolher entre recurso administrativo e ação judicial. Quem não pode pagar tem direito à Defensoria Pública da União."
      }
    ],
    faq: [
      {
        question: "O BPC/LOAS é uma aposentadoria?",
        answer:
          "Não. O BPC é benefício assistencial: não exige contribuição, não paga 13º salário e não deixa pensão por morte. A aposentadoria é benefício previdenciário, exige contribuições e gera esses direitos. Quem recebe BPC pode, no futuro, trocar por aposentadoria se completar os requisitos."
      },
      {
        question: "Preciso ter contribuído com o INSS para receber o BPC?",
        answer:
          "Não. O BPC não exige nenhuma contribuição prévia. Os requisitos são apenas a condição de idoso (65+) ou pessoa com deficiência, a baixa renda familiar e a inscrição atualizada no CadÚnico."
      },
      {
        question: "Criança com autismo tem direito ao BPC?",
        answer:
          "Pode ter. A lei reconhece a pessoa com transtorno do espectro autista como pessoa com deficiência (Lei 12.764/2012). O direito depende da avaliação do impedimento de longo prazo, das barreiras enfrentadas pela criança e do critério de renda da família."
      },
      {
        question: "Quem recebe BPC pode trabalhar com carteira assinada?",
        answer:
          "Se o beneficiário com deficiência começar a trabalhar, o BPC fica suspenso — não cancelado — e pode ser reativado sem nova perícia se o emprego terminar (art. 21-A da Lei 8.742/93). Já a renda do trabalho de outros membros da família entra no cálculo e pode levar à revisão do benefício."
      },
      {
        question: "Posso acumular o BPC com outro benefício?",
        answer:
          "Em regra, não. O BPC não pode ser acumulado com aposentadoria, pensão ou outro benefício da Seguridade Social, exceto os de assistência médica e a pensão especial de natureza indenizatória. Programas como o Bolsa Família têm regras próprias de convivência com o BPC."
      }
    ]
  },
  {
    slug: "saque-fgts-modalidades-e-prazos",
    title: "Saque do FGTS em 2026: todas as modalidades, calendário e prazos",
    excerpt:
      "Demissão, saque-aniversário, doença grave, casa própria: veja todas as situações que liberam o FGTS, o calendário e a trava de 2 anos.",
    category: "Trabalhista",
    readingMinutes: 10,
    publishedAt: "2026-07-01",
    author: "Equipe AdvAqui",
    authorRole: "Equipe",
    relatedSpecialty: "trabalhista",
    intro:
      "O FGTS é o dinheiro que o empregador deposita todo mês em uma conta vinculada no nome do trabalhador — mas esse dinheiro só pode ser sacado nas situações que a lei autoriza. Entre demissão, saque-aniversário, compra da casa própria e doença grave, as regras mudam bastante e uma escolha errada (como aderir ao saque-aniversário sem entender a trava de 2 anos) pode bloquear o saldo justamente na hora em que você mais precisa. Este guia explica todas as modalidades, prazos e cuidados.",
    body: [
      { type: "h2", text: "O que é o FGTS e quem tem direito?" },
      {
        type: "p",
        text: "O Fundo de Garantia do Tempo de Serviço, criado pela Lei 8.036/90, funciona assim: todo mês o empregador deposita 8% do salário bruto em uma conta vinculada na Caixa, em nome do trabalhador (2% no contrato de aprendizagem e 11,2% no doméstico, somando FGTS e antecipação da multa). O depósito é obrigação da empresa — não é descontado do seu salário. Têm direito os trabalhadores com carteira assinada (CLT), domésticos, rurais, temporários, intermitentes, avulsos e safreiros. O saldo rende atualização monetária mais juros e distribuição de resultados do fundo."
      },
      { type: "h2", text: "Em quais situações posso sacar o FGTS?" },
      {
        type: "p",
        text: "O art. 20 da Lei 8.036/90 lista as hipóteses de saque. As principais são:"
      },
      {
        type: "ul",
        items: [
          "Demissão sem justa causa — saque integral do saldo + multa de 40% paga pela empresa",
          "Rescisão por acordo entre empregado e empregador (art. 484-A da CLT) — saque de até 80% do saldo + multa de 20%",
          "Término de contrato por prazo determinado (incluindo o temporário)",
          "Extinção da empresa ou falecimento do empregador individual",
          "Aposentadoria concedida pelo INSS",
          "Doença grave — trabalhador ou dependente com câncer (neoplasia maligna), HIV ou em estágio terminal de doença grave",
          "Compra da casa própria, amortização ou quitação de financiamento habitacional (regras do SFH)",
          "Conta sem depósito por 3 anos seguidos fora do regime do FGTS",
          "Idade igual ou superior a 70 anos",
          "Falecimento do trabalhador — o saldo vai aos dependentes ou sucessores",
          "Desastre natural (calamidade pública reconhecida) no município, conforme regulamentação",
          "Saque-aniversário — retirada de parte do saldo todo ano, no mês do aniversário, para quem optar por essa sistemática"
        ]
      },
      {
        type: "callout",
        text: "Quem pede demissão não saca o FGTS e não recebe a multa de 40% — o saldo fica na conta rendendo até aparecer outra hipótese legal de saque (como a compra da casa própria, aposentadoria ou os 3 anos fora do regime). Demissão por justa causa também não libera o saque."
      },
      { type: "h2", text: "Como funciona o saque-aniversário do FGTS?" },
      {
        type: "p",
        text: "Criado pela Lei 13.932/2019, o saque-aniversário permite retirar uma parte do saldo todos os anos, no mês do seu aniversário. A adesão é opcional e feita pelo aplicativo FGTS. O valor segue uma tabela por faixa de saldo: quem tem pouco saldo saca um percentual maior (até 50% para saldos de até R$ 500), e quem tem saldo alto saca percentual menor (5% acima de R$ 20 mil) mais uma parcela fixa adicional. Quem não faz nada permanece automaticamente na sistemática tradicional, chamada saque-rescisão."
      },
      { type: "h2", text: "Qual é o calendário do saque-aniversário?" },
      {
        type: "p",
        text: "O dinheiro fica disponível do primeiro dia útil do mês do seu aniversário até o último dia útil do segundo mês seguinte — uma janela de aproximadamente 3 meses. Exemplo: quem faz aniversário em março pode sacar de início de março até o fim de maio. Se não sacar dentro da janela, o valor volta para a conta do FGTS e segue rendendo; a próxima chance é no ano seguinte. O crédito pode ser feito automaticamente em conta indicada no aplicativo FGTS."
      },
      { type: "h2", text: "Saque-aniversário vale a pena? Entenda a trava de 2 anos" },
      {
        type: "p",
        text: "Aqui mora o maior risco da escolha. Quem adere ao saque-aniversário e é demitido sem justa causa recebe apenas a multa de 40% — o saldo da conta fica bloqueado para saque por rescisão. E não dá para voltar atrás de uma hora para outra: quem pede o retorno ao saque-rescisão só volta à sistemática antiga no primeiro dia do 25º mês após o pedido — na prática, uma espera de 2 anos. Ou seja: se você aderir hoje e for demitido no ano que vem, não saca o saldo integral."
      },
      {
        type: "p",
        text: "O saque-aniversário costuma fazer sentido para quem tem estabilidade maior no emprego, quer uma renda anual extra ou pretende usar o valor para quitar dívidas caras. Costuma ser má escolha para quem está em emprego instável, em setor com muitas demissões, ou quer manter o FGTS como reserva de emergência para o desemprego. Cuidado redobrado com a antecipação do saque-aniversário oferecida por bancos: é um empréstimo com juros que compromete os saques dos próximos anos e usa o seu FGTS como garantia."
      },
      { type: "h2", text: "Saque-rescisão ou saque-aniversário: qual a diferença na prática?" },
      {
        type: "ul",
        items: [
          "Saque-rescisão (padrão): não saca nada anualmente, mas na demissão sem justa causa retira todo o saldo + multa de 40%",
          "Saque-aniversário: retira um percentual todo ano, mas na demissão sem justa causa recebe só a multa de 40% e o saldo permanece bloqueado",
          "Nos dois casos continuam liberados os saques por casa própria, aposentadoria, doença grave e demais hipóteses do art. 20",
          "A troca de sistemática pode ser pedida a qualquer momento pelo app, mas o retorno ao saque-rescisão só produz efeito depois de 24 meses (primeiro dia do 25º mês)"
        ]
      },
      { type: "h2", text: "Como sacar o FGTS na prática?" },
      {
        type: "ol",
        items: [
          "Baixe o aplicativo FGTS (da Caixa) e faça o login com CPF e senha",
          "Confira o saldo de todas as contas vinculadas (empregos atuais e antigos)",
          "Verifique se a sua situação se encaixa em uma hipótese de saque — o app mostra os saques disponíveis",
          "Solicite o saque pelo próprio app, anexando documentos quando exigido (ex.: laudo médico na doença grave), e indique conta bancária de qualquer banco para o crédito, sem custo",
          "Na demissão sem justa causa, a liberação costuma ser automática a partir dos dados da rescisão informados pela empresa; se não cair, procure a Caixa com o termo de rescisão",
          "Prazo: o crédito costuma ocorrer em até 5 dias úteis após a solicitação aprovada"
        ]
      },
      { type: "h2", text: "A empresa não depositou o FGTS: o que fazer?" },
      {
        type: "p",
        text: "Confira os depósitos regularmente pelo aplicativo FGTS ou pelo extrato da Caixa — atraso e falta de depósito são mais comuns do que parecem, principalmente em empresas em dificuldade. Se encontrar meses faltando, os caminhos são: cobrar formalmente a empresa (por escrito), denunciar ao Ministério do Trabalho pelo canal gov.br, e cobrar os valores na Justiça do Trabalho, com correção. O prazo para cobrar é de 5 anos, contados de cada depósito não feito, respeitado o limite de 2 anos após o fim do contrato (STF, decisão de 2014 que mudou a prescrição do FGTS). Depósitos em falta prejudicam a multa de 40%, o saque na demissão e o uso do fundo na casa própria — não deixe acumular."
      },
      { type: "h2", text: "Quando procurar um advogado?" },
      {
        type: "p",
        text: "Procure um advogado trabalhista se a empresa deixou de depositar o FGTS e não regulariza após a cobrança, se você foi demitido e o saque não foi liberado, se a multa de 40% foi calculada sobre saldo menor que o devido, ou se contratou antecipação de saque-aniversário com condições que não foram bem explicadas. Diferenças de FGTS costumam ser cobradas junto com outras verbas na reclamação trabalhista, e a consulta inicial costuma ser gratuita."
      }
    ],
    faq: [
      {
        question: "Posso cancelar o saque-aniversário e voltar ao saque-rescisão?",
        answer:
          "Pode, a qualquer momento, pelo aplicativo FGTS. Mas a mudança não é imediata: o retorno ao saque-rescisão só passa a valer no primeiro dia do 25º mês após o pedido — cerca de 2 anos de espera. Nesse intervalo, em caso de demissão, você recebe apenas a multa de 40%."
      },
      {
        question: "Quem pede demissão consegue sacar o FGTS?",
        answer:
          "Não. No pedido de demissão o saldo fica retido na conta, rendendo normalmente, até surgir outra hipótese legal: novo saque por demissão em emprego futuro, compra da casa própria, aposentadoria, doença grave ou 3 anos seguidos sem depósito na conta."
      },
      {
        question: "Quais doenças permitem sacar o FGTS?",
        answer:
          "A lei autoriza o saque quando o trabalhador ou dependente tem câncer (neoplasia maligna), HIV ou está em estágio terminal de qualquer doença grave. O pedido é feito com laudo médico detalhado. Algumas decisões judiciais ampliam o saque para outras doenças graves, caso a caso."
      },
      {
        question: "Posso usar o FGTS para quitar ou amortizar financiamento da casa?",
        answer:
          "Pode, se o financiamento estiver no SFH e forem cumpridos os requisitos: 3 anos de trabalho sob o regime do FGTS (somando períodos), não ter outro financiamento ativo no SFH nem imóvel residencial na mesma região. O FGTS pode abater prestações, amortizar ou quitar o saldo devedor."
      },
      {
        question: "A antecipação do saque-aniversário em banco é segura?",
        answer:
          "É uma operação de crédito regulamentada, mas com custo: você toma emprestado hoje os saques dos próximos anos, paga juros e o FGTS fica bloqueado como garantia. Compare o custo efetivo total com outras linhas antes de contratar e desconfie de ofertas por telefone ou mensagens pedindo dados pessoais."
      }
    ]
  },
  {
    slug: "cnh-suspensa-o-que-fazer",
    title: "CNH suspensa em 2026: o que fazer, prazos de defesa e como voltar a dirigir",
    excerpt:
      "Entenda quando a CNH é suspensa por pontos ou por infração direta, os prazos para se defender, o curso de reciclagem e a diferença para a cassação.",
    category: "Trânsito",
    readingMinutes: 10,
    publishedAt: "2026-07-04",
    author: "Equipe AdvAqui",
    authorRole: "Equipe",
    relatedSpecialty: "criminal",
    intro:
      "A CNH suspensa tira temporariamente o seu direito de dirigir — mas a suspensão não acontece de um dia para o outro. Antes dela existe um processo administrativo em que você é notificado, pode apresentar defesa e recorrer, e enquanto esse processo não termina você continua habilitado. Este guia explica, em linguagem simples, quando a carteira é suspensa (por pontos ou por uma única infração), quais são os prazos de defesa, como funciona o curso de reciclagem e o que diferencia a suspensão da cassação.",
    body: [
      { type: "h2", text: "O que significa ter a CNH suspensa?" },
      {
        type: "p",
        text: "A suspensão do direito de dirigir é uma penalidade prevista no Código de Trânsito Brasileiro (Lei 9.503/97): durante o prazo fixado, o condutor fica proibido de dirigir qualquer veículo, e a CNH fica recolhida ou bloqueada no sistema. A habilitação não é apagada — cumprido o prazo e o curso de reciclagem, o direito de dirigir volta. Existem duas portas de entrada para a suspensão: o acúmulo de pontos no período de 12 meses e as chamadas infrações autossuspensivas, em que uma única infração já abre o processo de suspensão."
      },
      { type: "h2", text: "Suspensão por pontos: o limite é 20, 30 ou 40?" },
      {
        type: "p",
        text: "Desde a mudança trazida pela Lei 14.071/2020, o limite de pontos que gera suspensão deixou de ser único (os antigos 20 pontos) e passou a depender da gravidade das infrações cometidas nos últimos 12 meses:"
      },
      {
        type: "ul",
        items: [
          "20 pontos — se o condutor tiver 2 ou mais infrações gravíssimas no período",
          "30 pontos — se tiver exatamente 1 infração gravíssima",
          "40 pontos — se não tiver nenhuma infração gravíssima",
          "40 pontos, sempre — para quem exerce atividade remunerada ao volante (EAR na CNH: motoristas de aplicativo, taxistas, caminhoneiros, entregadores), independentemente da natureza das infrações",
          "Valor de cada infração: gravíssima = 7 pontos, grave = 5, média = 4, leve = 3"
        ]
      },
      {
        type: "p",
        text: "Quem tem EAR (exerce atividade remunerada) conta ainda com uma válvula de escape: ao atingir de 30 a 39 pontos sem infração autossuspensiva, pode optar por fazer um curso preventivo de reciclagem. Concluído o curso, a pontuação do período é zerada e o processo de suspensão nem chega a ser aberto. É um direito que muitos motoristas profissionais desconhecem — e que só pode ser usado dentro da janela certa."
      },
      {
        type: "callout",
        text: "Os pontos só entram no prontuário depois que a multa se torna definitiva — ou seja, depois de esgotados os prazos de defesa e recurso daquela infração. Por isso, recorrer das multas em andamento pode impedir que a soma alcance o limite da suspensão."
      },
      { type: "h2", text: "Infrações que suspendem a CNH diretamente, sem depender de pontos" },
      {
        type: "p",
        text: "Algumas infrações são tão graves que uma única ocorrência já gera processo de suspensão, não importa quantos pontos o condutor tenha. As mais comuns:"
      },
      {
        type: "ul",
        items: [
          "Dirigir sob influência de álcool ou outra substância (art. 165 do CTB) — multa de R$ 2.934,70 e suspensão de 12 meses",
          "Recusar o teste do bafômetro (art. 165-A do CTB) — mesmas penalidades da embriaguez: multa de R$ 2.934,70 e 12 meses de suspensão",
          "Excesso de velocidade superior a 50% do limite da via — multa multiplicada e suspensão",
          "Disputar corrida ou exibição não autorizada ('racha') — multa multiplicada por dez e suspensão",
          "Realizar manobras perigosas (arrancada brusca, derrapagem, frenagem com deslizamento)",
          "Conduzir motocicleta sem capacete"
        ]
      },
      {
        type: "p",
        text: "Nesses casos, a suspensão anda junto com a multa, mas em processo próprio — e o prazo de suspensão é o previsto para cada infração. Na embriaguez ao volante, além da esfera administrativa, o caso pode virar também processo criminal, dependendo da concentração de álcool constatada ou dos sinais de alteração da capacidade — são caminhos independentes, com defesas separadas."
      },
      { type: "h2", text: "Como funciona o processo administrativo de suspensão" },
      {
        type: "ol",
        items: [
          "Instauração — atingido o limite de pontos (processo aberto pelo Detran onde a CNH está registrada) ou cometida infração autossuspensiva, o órgão de trânsito abre o processo e envia a notificação de instauração",
          "Defesa prévia — a notificação informa o prazo para apresentar defesa por escrito (em regra, 30 dias; confira sempre a data na sua notificação)",
          "Julgamento da defesa — se acolhida, o processo é arquivado; se rejeitada, o órgão aplica a penalidade e envia a notificação da penalidade",
          "Recurso — da decisão que aplica a suspensão cabe recurso administrativo, nas instâncias e prazos indicados na própria notificação",
          "Início do cumprimento — mantida a penalidade em definitivo, o condutor é notificado para entregar a CNH, e só então começa a correr o prazo de suspensão"
        ]
      },
      {
        type: "p",
        text: "Um ponto que gera muita confusão: enquanto o processo administrativo não termina, você pode continuar dirigindo normalmente. A proibição só começa depois da decisão definitiva e da notificação para entrega da carteira. Dirigir antes disso não é irregular; dirigir depois disso é o erro mais caro que existe, como você verá adiante."
      },
      { type: "h2", text: "O que alegar na defesa? Argumentos que funcionam" },
      {
        type: "p",
        text: "A defesa no processo de suspensão não é um pedido de clemência — é uma análise técnica do processo e das multas que o alimentam. Os argumentos mais comuns:"
      },
      {
        type: "ul",
        items: [
          "Pontuação errada — infrações que ainda estão em fase de defesa ou recurso não podem contar pontos; multas de outro condutor (veículo dirigido por terceiro sem indicação) podem ser questionadas",
          "Notificação irregular — enviada para endereço desatualizado por falha do órgão, sem prazo razoável ou sem os requisitos formais",
          "Vícios nas multas de origem — auto de infração com dados errados, aparelho de medição sem aferição válida, agente sem competência",
          "Prescrição — o órgão tem prazo para instaurar e concluir o processo; a demora excessiva pode extinguir a punição",
          "Enquadramento errado da infração autossuspensiva — a conduta descrita não corresponde ao artigo aplicado"
        ]
      },
      { type: "h2", text: "Quanto tempo dura a suspensão da CNH?" },
      {
        type: "p",
        text: "Na suspensão por pontos, o prazo vai de 6 meses a 1 ano — e, se o condutor reincidir no período de 12 meses, de 8 meses a 2 anos. Nas infrações autossuspensivas, vale o prazo previsto para cada infração: na embriaguez e na recusa ao bafômetro, por exemplo, são 12 meses. O prazo exato é fixado na decisão do processo administrativo, dentro dessas faixas."
      },
      { type: "h2", text: "Curso de reciclagem: o caminho de volta ao volante" },
      {
        type: "p",
        text: "Para voltar a dirigir, não basta esperar o prazo passar. O condutor suspenso precisa: cumprir integralmente o período de suspensão com a CNH entregue ao órgão de trânsito, concluir o curso de reciclagem (30 horas-aula, oferecido presencialmente ou a distância, conforme as regras do Detran do seu estado) e ser aprovado na prova teórica do curso. Feito isso, a CNH é devolvida e o direito de dirigir é restabelecido — sem refazer prova prática e sem tirar nova habilitação."
      },
      { type: "h2", text: "Suspensão × cassação: qual a diferença?" },
      {
        type: "p",
        text: "Suspensão e cassação são penalidades diferentes, com consequências muito diferentes. A suspensão é temporária: cumprido o prazo e o curso, o direito volta. A cassação (art. 263 do CTB) anula a habilitação: o condutor cassado só pode voltar a dirigir depois de 2 anos, e ainda assim refazendo todo o processo de habilitação — exames médico e psicológico, prova teórica e prova prática, como um candidato novo."
      },
      {
        type: "ul",
        items: [
          "Principal causa de cassação: ser flagrado dirigindo durante o período de suspensão",
          "Também geram cassação: a reincidência, no prazo de 12 meses, em infrações específicas listadas no CTB (como embriaguez ao volante e racha)",
          "Dirigir com CNH suspensa ou cassada é ainda infração gravíssima, com multa multiplicada e recolhimento do veículo"
        ]
      },
      {
        type: "callout",
        text: "Se a sua CNH foi suspensa, não dirija durante o cumprimento — nem 'só até o mercado'. Um único flagrante transforma uma suspensão de meses em uma cassação de no mínimo 2 anos, com todo o processo de habilitação pela frente."
      },
      { type: "h2", text: "Quando procurar um advogado?" },
      {
        type: "p",
        text: "Procure orientação assim que receber a notificação de instauração — os prazos de defesa são curtos e não voltam. A defesa técnica faz mais diferença quando a CNH é instrumento de trabalho (EAR), quando a suspensão nasce de multas que você nem sabia que existiam, quando há erro na contagem de pontos ou quando o caso envolve embriaguez ao volante, que pode ter desdobramento criminal. Um advogado da área analisa o processo, as multas de origem e as notificações em busca de falhas — e orienta sobre o momento certo do curso preventivo de reciclagem, no caso dos motoristas profissionais."
      }
    ],
    faq: [
      {
        question: "Posso continuar dirigindo enquanto o processo de suspensão corre?",
        answer:
          "Pode. A proibição de dirigir só começa depois da decisão definitiva do processo administrativo e da notificação para entrega da CNH. Até lá, a habilitação segue válida. Depois disso, dirigir gera cassação da carteira."
      },
      {
        question: "Quantos pontos suspendem a CNH?",
        answer:
          "Depende da gravidade das infrações nos últimos 12 meses: 20 pontos com 2 ou mais gravíssimas, 30 pontos com 1 gravíssima e 40 pontos sem nenhuma gravíssima. Quem exerce atividade remunerada (EAR) tem limite fixo de 40 pontos."
      },
      {
        question: "Pagar as multas apaga os pontos da carteira?",
        answer:
          "Não. O pagamento quita a multa, mas os pontos permanecem no prontuário e são considerados pelo período de 12 meses contados da data de cada infração. O que impede pontos de contarem é a defesa ou o recurso acolhido contra a própria multa."
      },
      {
        question: "O que acontece se eu for pego dirigindo com a CNH suspensa?",
        answer:
          "É a situação mais grave: gera cassação da habilitação — você só volta a dirigir após 2 anos e refazendo todos os exames e provas —, além de infração gravíssima com multa multiplicada e recolhimento do veículo."
      },
      {
        question: "Recusar o bafômetro também suspende a CNH?",
        answer:
          "Sim. A recusa ao teste é infração autônoma (art. 165-A do CTB) com as mesmas penalidades da embriaguez: multa de R$ 2.934,70 e suspensão do direito de dirigir por 12 meses."
      },
      {
        question: "Depois da suspensão, preciso fazer prova prática de novo?",
        answer:
          "Não. Cumprido o prazo, basta concluir o curso de reciclagem de 30 horas-aula e ser aprovado na prova teórica do curso para receber a CNH de volta. Refazer exames e prova prática só é exigido de quem teve a carteira cassada."
      }
    ]
  },
  {
    slug: "pensao-alimenticia-como-calcular",
    title: "Pensão alimentícia em 2026: como calcular o valor, pedir revisão e o que acontece no atraso",
    excerpt:
      "Veja como o valor da pensão é definido na prática, os percentuais mais comuns, quando cabe revisão e as consequências do atraso, incluindo a prisão civil.",
    category: "Família",
    readingMinutes: 10,
    publishedAt: "2026-07-04",
    author: "Equipe AdvAqui",
    authorRole: "Equipe",
    relatedSpecialty: "familia",
    intro:
      "Calcular a pensão alimentícia não segue tabela pronta nem percentual fixo em lei: o valor nasce do equilíbrio entre a necessidade de quem recebe e a possibilidade de quem paga — o chamado binômio alimentar. Este guia explica, em linguagem simples, como esse cálculo funciona na prática, quais percentuais os juízes costumam aplicar, como pedir revisão quando a vida muda, o que acontece quando a pensão atrasa (incluindo a prisão civil) e como fazer um acordo válido sem brigar na Justiça.",
    body: [
      { type: "h2", text: "Como o valor da pensão alimentícia é definido?" },
      {
        type: "p",
        text: "O Código Civil manda fixar os alimentos na proporção das necessidades de quem pede e dos recursos de quem paga. Na prática, o juiz (ou o acordo entre as partes) olha para dois pratos da balança:"
      },
      {
        type: "ul",
        items: [
          "Necessidade de quem recebe — idade do filho, escola, alimentação, saúde, moradia, transporte, atividades, remédios de uso contínuo e o padrão de vida que a criança tinha antes da separação",
          "Possibilidade de quem paga — renda comprovada, outros filhos e dependentes, despesas essenciais próprias e sinais exteriores de riqueza (carro, viagens, imóveis) quando a renda declarada não fecha com o estilo de vida",
          "Proporcionalidade — o valor não pode sacrificar o sustento de quem paga nem deixar de atender o essencial de quem recebe; os dois genitores contribuem, cada um na medida das suas condições"
        ]
      },
      {
        type: "p",
        text: "Importante: quem fica com a guarda também contribui — só que de forma direta, 'in natura', com a rotina de cuidados, moradia e alimentação do dia a dia. A pensão em dinheiro é a parte de quem não mora com o filho."
      },
      { type: "h2", text: "Existe percentual fixo? O que os juízes aplicam na prática" },
      {
        type: "p",
        text: "Não existe percentual mínimo nem máximo em lei — qualquer número que você viu por aí ('a lei manda pagar 30%') é mito. O que existe é um costume forense: para um filho, os valores mais comuns ficam entre 20% e 30% dos rendimentos líquidos de quem paga; havendo mais filhos, o percentual total costuma subir, mas não cresce na mesma proporção (dois filhos não significam automaticamente 60%). Cada caso é decidido pelas provas de necessidade e possibilidade."
      },
      {
        type: "p",
        text: "A forma de fixar também varia conforme a situação de quem paga:"
      },
      {
        type: "ul",
        items: [
          "Percentual do salário líquido — comum para quem tem carteira assinada; permite o desconto direto em folha de pagamento, o jeito mais seguro de receber",
          "Valor fixo em salários mínimos — comum para autônomos, informais e empresários, porque se atualiza sozinho todo ano com o reajuste do mínimo",
          "Modelo híbrido — um valor em dinheiro mais obrigações pagas diretamente, como plano de saúde e mensalidade escolar"
        ]
      },
      { type: "h2", text: "E se quem paga está desempregado ou não tem renda fixa?" },
      {
        type: "p",
        text: "O desemprego não extingue a obrigação — filho não deixa de comer porque o pagamento da pensão ficou difícil. Nesses casos, a Justiça costuma fixar a pensão em fração do salário mínimo (algo como 15% a 30% do mínimo é frequente, sempre conforme o caso), presumindo que toda pessoa adulta tem capacidade de gerar alguma renda. Para autônomos que declaram pouco mas vivem bem, o juiz pode considerar os sinais exteriores de riqueza e até quebrar sigilos para apurar a renda real."
      },
      { type: "h2", text: "A pensão incide sobre 13º, férias e horas extras?" },
      {
        type: "p",
        text: "Quando a pensão é fixada em percentual da remuneração, a jurisprudência entende que ela incide também sobre 13º salário, férias com o terço constitucional e verbas habituais como horas extras — salvo se a decisão ou o acordo disser expressamente o contrário. Sobre verbas de natureza indenizatória (como FGTS e multa rescisória) há divergência, e a resposta depende do que ficou escrito no título. Por isso, na hora do acordo, vale detalhar por escrito sobre o que o percentual incide — evita anos de discussão."
      },
      { type: "h2", text: "Como pedir revisão da pensão (para aumentar ou diminuir)?" },
      {
        type: "p",
        text: "O valor da pensão não é eterno: sempre que a necessidade de quem recebe ou a possibilidade de quem paga mudar de forma relevante, cabe ação revisional. Exemplos de quem paga: desemprego prolongado, doença que reduz a capacidade de trabalho, nascimento de outro filho. Exemplos de quem recebe: entrada na escola particular, tratamento de saúde, adolescência (custos maiores). A revisão vale dali para frente — não devolve nem perdoa parcelas passadas."
      },
      {
        type: "callout",
        text: "O valor NUNCA muda automaticamente. Perder o emprego não autoriza pagar menos por conta própria: até que um juiz revise o valor ou um novo acordo seja homologado, a pensão original continua valendo e a diferença vira dívida executável. Quem precisa reduzir deve agir rápido — e não simplesmente parar de pagar."
      },
      { type: "h2", text: "Pensão atrasada: execução, protesto e prisão civil" },
      {
        type: "p",
        text: "A pensão alimentícia é a única dívida no Brasil que ainda leva o devedor à prisão. Quando o pagamento atrasa, quem recebe pode executar a dívida por dois caminhos:"
      },
      {
        type: "ul",
        items: [
          "Rito da prisão — para as 3 últimas parcelas vencidas antes do pedido, mais as que vencerem durante o processo: o devedor é intimado a pagar tudo em 3 dias, provar que pagou ou justificar a impossibilidade absoluta; se não convencer, o juiz pode decretar prisão civil de 1 a 3 meses, em regime fechado e separado dos presos comuns",
          "Rito da penhora — para dívidas mais antigas: bloqueio de contas e aplicações, penhora de bens e até de parte do salário",
          "Medidas adicionais — protesto da dívida em cartório e inclusão do nome do devedor nos cadastros de inadimplentes (SPC/Serasa)"
        ]
      },
      {
        type: "p",
        text: "Dois avisos importantes: a prisão não apaga a dívida — solto, o devedor continua devendo tudo, com juros e correção; e justificativas genéricas ('estou desempregado', 'a situação está difícil') não impedem a prisão — a impossibilidade de pagar precisa ser provada de forma concreta."
      },
      { type: "h2", text: "Acordo extrajudicial: dá para resolver sem processo?" },
      {
        type: "p",
        text: "Dá, e costuma ser o caminho mais rápido e barato quando existe diálogo. Um acordo de pensão por escrito, assinado pelas partes e referendado pelos advogados de cada um, pela Defensoria Pública ou pelo Ministério Público, vale como título executivo — ou seja, se for descumprido, pode ser executado direto, sem precisar de um processo para 'provar' a dívida. Ainda assim, muitos casais preferem levar o acordo para homologação do juiz, o que agrega segurança, principalmente quando envolve filhos menores. Sessões de mediação, inclusive nos CEJUSCs do fórum, são gratuitas e ajudam a chegar num valor realista."
      },
      { type: "h2", text: "Até quando a pensão é devida?" },
      {
        type: "p",
        text: "A maioridade (18 anos) não encerra a pensão automaticamente — o corte depende de decisão judicial, com direito de o filho se manifestar. Na prática, filhos que estudam (faculdade ou curso técnico) costumam manter a pensão até concluir os estudos, em geral até a faixa dos 24 anos, conforme o caso. A pensão entre ex-cônjuges, quando fixada, tende a ser temporária — o tempo de se recolocar no mercado. E a obrigação alimentar é via de mão dupla na família: filhos adultos podem ser obrigados a pagar alimentos aos pais idosos que necessitem, e os avós podem ser chamados a complementar a pensão dos netos quando os pais comprovadamente não conseguem pagar."
      },
      { type: "h2", text: "Quando procurar um advogado?" },
      {
        type: "p",
        text: "Procure orientação para fixar a pensão pela primeira vez, para revisar um valor que ficou fora da realidade, para executar parcelas atrasadas ou para se defender de uma execução. Um advogado de família sabe montar a prova da necessidade e da real capacidade financeira — que é onde essas ações se ganham ou se perdem — e desenhar acordos que evitam anos de litígio. Quem não pode pagar tem direito à Defensoria Pública, e o pedido de pensão costuma tramitar com prioridade quando envolve criança."
      }
    ],
    faq: [
      {
        question: "Existe um percentual mínimo ou máximo de pensão previsto em lei?",
        answer:
          "Não. A lei manda apenas equilibrar a necessidade de quem recebe com a possibilidade de quem paga. Os percentuais de 20% a 30% dos rendimentos líquidos para um filho são costume da prática forense, não regra — o juiz pode fixar acima ou abaixo conforme as provas."
      },
      {
        question: "Quem está desempregado paga pensão?",
        answer:
          "Sim. O desemprego não extingue a obrigação — nesses casos a pensão costuma ser fixada em fração do salário mínimo. Quem perdeu o emprego deve pedir a revisão judicial do valor; parar de pagar por conta própria gera dívida e risco de prisão."
      },
      {
        question: "Atrasar quantas parcelas pode levar à prisão?",
        answer:
          "O rito da prisão alcança as 3 últimas parcelas vencidas antes da execução, mais as que vencerem durante o processo. Intimado, o devedor tem 3 dias para pagar, provar o pagamento ou justificar a impossibilidade — se não o fizer, a prisão civil pode ser decretada por 1 a 3 meses."
      },
      {
        question: "A pensão incide sobre o 13º salário?",
        answer:
          "Em regra, sim: quando fixada em percentual da remuneração, a pensão incide sobre 13º, férias com o terço e verbas habituais, salvo previsão diferente na decisão ou no acordo. Sobre verbas indenizatórias, como FGTS, depende do que ficou definido no título."
      },
      {
        question: "Filho que fez 18 anos perde a pensão automaticamente?",
        answer:
          "Não. O fim da pensão depende de decisão judicial, com oportunidade de o filho se manifestar. Filhos cursando faculdade ou curso técnico costumam manter a pensão até concluir os estudos, conforme a análise do caso."
      },
      {
        question: "Acordo de pensão feito 'no papel' entre os pais vale?",
        answer:
          "Um acordo escrito e referendado pelos advogados, pela Defensoria ou pelo Ministério Público vale como título executivo. Acordos meramente verbais ou sem referendo são frágeis: difíceis de provar e de executar. O ideal é formalizar e, de preferência, homologar em juízo."
      }
    ]
  },
  {
    slug: "limpar-nome-negativado-passo-a-passo",
    title: "Como limpar o nome negativado em 2026: passo a passo no SPC e Serasa",
    excerpt:
      "Consulte seu CPF de graça, negocie pelos canais oficiais, saiba quando a negativação caduca em 5 anos e o que fazer se negativaram seu nome por engano.",
    category: "Consumidor",
    readingMinutes: 10,
    publishedAt: "2026-07-04",
    author: "Equipe AdvAqui",
    authorRole: "Equipe",
    relatedSpecialty: "civil",
    intro:
      "Limpar o nome negativado no SPC e no Serasa tem caminho conhecido: descobrir exatamente o que consta no seu CPF, conferir se cada registro ainda pode estar lá (a negativação caduca em 5 anos), negociar pelos canais oficiais e exigir a baixa após o pagamento. Este guia mostra o passo a passo em linguagem simples — incluindo a diferença entre dívida caducada e prescrita, quando a negativação indevida gera indenização e como reconhecer os golpes de 'limpa nome' que só pioram a sua situação.",
    body: [
      { type: "h2", text: "O que significa estar com o nome negativado?" },
      {
        type: "p",
        text: "Nome negativado (ou 'sujo') é o CPF inscrito nos cadastros de inadimplentes — os principais são Serasa, SPC Brasil e Boa Vista. Qualquer credor (loja, banco, operadora, faculdade) pode registrar ali uma dívida vencida e não paga. O efeito prático: crédito negado, cartão recusado, financiamento barrado, dificuldade para parcelar compras e até para alugar imóvel. Antes de negativar, o consumidor tem direito a ser comunicado por escrito — é o Código de Defesa do Consumidor que exige, e o STJ entende que essa comunicação cabe ao órgão do cadastro (Súmula 359), embora dispense o aviso de recebimento na carta (Súmula 404)."
      },
      { type: "h2", text: "Passo 1 — Descubra tudo o que consta no seu CPF" },
      {
        type: "p",
        text: "Você não precisa pagar nada para saber por que seu nome está negativado. Consulte gratuitamente:"
      },
      {
        type: "ul",
        items: [
          "Site e aplicativo oficiais da Serasa — mostram as dívidas negativadas, o credor, o valor e a data",
          "Site e aplicativo do SPC Brasil — cadastro alimentado principalmente pelo comércio",
          "Registrato, do Banco Central — relatório gratuito de dívidas e financiamentos em bancos e financeiras, além de cheques sem fundo",
          "Anote de cada registro: quem é o credor, o valor, a data de vencimento da dívida original e a data da inclusão no cadastro"
        ]
      },
      { type: "h2", text: "Passo 2 — Confira as datas: a negativação caduca em 5 anos" },
      {
        type: "p",
        text: "O Código de Defesa do Consumidor (art. 43) proíbe que cadastros de proteção ao crédito mantenham informações negativas por mais de 5 anos. O prazo conta do vencimento da dívida, e a exclusão deve ser automática — você não precisa pagar para o registro sair depois dos 5 anos. O STJ reforça essa regra na Súmula 323: a inscrição pode ser mantida por no máximo 5 anos. Se você encontrar no seu CPF uma negativação mais velha que isso, exija a exclusão imediata ao cadastro e ao credor — a manutenção além do prazo é indevida e pode gerar indenização."
      },
      { type: "h2", text: "Dívida caducada é dívida perdoada? Caducar × prescrever" },
      {
        type: "p",
        text: "São coisas diferentes, e confundi-las custa caro. Caducar, na linguagem popular, é o registro sair do SPC/Serasa após os 5 anos — mas a dívida em si não desaparece: ela continua existindo e pode ser cobrada amigavelmente. Prescrever é o credor perder o direito de cobrar a dívida na Justiça — para a maioria das dívidas de consumo documentadas (cartão, banco, crediário), o prazo de prescrição também é de 5 anos. Dívida prescrita não pode ser executada judicialmente nem gerar nova negativação, e decisões recentes vêm limitando até a cobrança extrajudicial insistente. Na prática: antes de pagar uma dívida muito antiga, verifique as datas — e saiba que renegociar uma dívida prescrita ou caducada 'renova' o reconhecimento dela, reabrindo caminho para cobrança."
      },
      {
        type: "callout",
        text: "Cuidado com acordos-relâmpago de dívidas antigas: assinar renegociação ou pagar a primeira parcela de uma dívida já prescrita é ato de reconhecimento que pode reativar a cobrança. Avalie as datas (e, na dúvida, consulte orientação jurídica) ANTES de aceitar a proposta — não depois."
      },
      { type: "h2", text: "Passo 3 — Negocie a dívida pelos canais oficiais" },
      {
        type: "p",
        text: "Para dívidas dentro do prazo, a saída é negociar — e o mercado de renegociação nunca teve tanto desconto. Use apenas canais oficiais:"
      },
      {
        type: "ul",
        items: [
          "Serasa Limpa Nome e plataforma do SPC — feirões com descontos que frequentemente passam de 50% para pagamento à vista",
          "Canais do próprio credor — site, aplicativo e centrais de renegociação de bancos e lojas",
          "Consumidor.gov.br — plataforma pública para negociar e registrar reclamação formal contra a empresa",
          "Mutirões do Procon e semanas nacionais de renegociação",
          "Regras de ouro: peça o desconto à vista antes de aceitar parcelamento, exija o acordo por escrito (boleto oficial em nome do credor), guarde todos os comprovantes e desconfie de boleto enviado por WhatsApp"
        ]
      },
      { type: "h2", text: "Passo 4 — Pagou? Exija a baixa em 5 dias úteis" },
      {
        type: "p",
        text: "Quitada a dívida (ou paga a entrada do acordo, conforme o combinado), a negativação não pode continuar. O STJ firmou o entendimento de que cabe ao credor providenciar a exclusão do nome em até 5 dias úteis a partir do pagamento. Se o prazo passar e o registro continuar, guarde o comprovante e cobre formalmente o credor e o cadastro — a manutenção indevida do nome após a quitação é fonte clássica de indenização por dano moral."
      },
      { type: "h2", text: "Negativação indevida: quando cabe indenização por dano moral" },
      {
        type: "p",
        text: "Nem toda negativação é legítima. Geram direito à exclusão imediata e, em regra, à indenização por dano moral:"
      },
      {
        type: "ul",
        items: [
          "Dívida que não existe — cobrança de contrato que você nunca assinou, serviço nunca contratado",
          "Fraude com seu CPF — negativação por dívida feita por golpista em seu nome",
          "Dívida já paga — inclusão ou manutenção do registro após a quitação",
          "Dívida caducada — registro mantido além dos 5 anos",
          "Falta de comunicação prévia — negativação sem o aviso por escrito exigido pelo CDC"
        ]
      },
      {
        type: "p",
        text: "Nesses casos, o dano moral é presumido — não é preciso provar sofrimento, porque a restrição indevida de crédito por si só configura o dano. A exceção é a Súmula 385 do STJ: quem já possui outra negativação legítima e anterior não recebe indenização pela inscrição indevida — mas mantém o direito de cancelá-la. Essas ações costumam correr no Juizado Especial Cível, sem custas e, para causas de até 20 salários mínimos, sem obrigação de advogado."
      },
      { type: "h2", text: "Golpes de 'limpa nome': como reconhecer e fugir" },
      {
        type: "p",
        text: "A promessa de limpar seu nome 'em até 72 horas' mediante pagamento antecipado é golpe — e dos mais comuns do país. Sinais de alerta:"
      },
      {
        type: "ul",
        items: [
          "Cobrança antecipada via Pix para pessoa física, com promessa de resultado garantido",
          "Promessa de 'apagar' dívida legítima do cadastro ou de aumentar o score de crédito — ninguém tem esse poder: a exclusão só acontece pagando, negociando, pelo decurso dos 5 anos ou por decisão judicial",
          "Suposta 'liminar garantida' ou 'brecha na lei' vendida por perfis de rede social",
          "Contato por WhatsApp pedindo dados pessoais, senhas ou fotos de documentos",
          "Se quem oferece o serviço se apresenta como advogado, confira a inscrição no site da OAB — e lembre que advogado sério não promete resultado"
        ]
      },
      { type: "h2", text: "Quando procurar um advogado?" },
      {
        type: "p",
        text: "Procure orientação quando a negativação for indevida (dívida inexistente, fraude, dívida paga ou caducada) e a empresa não resolver na via administrativa; quando você identificar dívida possivelmente prescrita antes de assinar qualquer acordo; ou quando as dívidas viraram bola de neve — a Lei do Superendividamento (Lei 14.181/2021) permite renegociar todas as dívidas de consumo em bloco, num plano de pagamento que preserva o mínimo existencial. O Procon e a Defensoria Pública atendem gratuitamente, e no Juizado Especial as causas menores dispensam custas."
      }
    ],
    faq: [
      {
        question: "Paguei a dívida. Em quanto tempo meu nome sai do SPC e da Serasa?",
        answer:
          "Pelo entendimento do STJ, o credor deve providenciar a baixa em até 5 dias úteis contados do pagamento. Se o registro continuar depois disso, guarde o comprovante e cobre o credor e o cadastro — a manutenção indevida pode gerar indenização."
      },
      {
        question: "Depois de 5 anos a dívida some sozinha?",
        answer:
          "O registro no SPC/Serasa deve ser excluído automaticamente após 5 anos do vencimento — isso é a caducidade do cadastro. A dívida em si, porém, não é perdoada: ela continua existindo, embora em geral também prescreva (perca a cobrança judicial) em prazo semelhante."
      },
      {
        question: "Posso ser negativado sem ser avisado antes?",
        answer:
          "Não. O CDC exige comunicação prévia por escrito antes da inscrição, feita pelo órgão do cadastro (Súmula 359 do STJ) — embora não seja exigido aviso de recebimento (Súmula 404). Negativação sem essa comunicação é irregular e pode ser cancelada."
      },
      {
        question: "Negativação indevida gera indenização automática?",
        answer:
          "O dano moral por negativação indevida é presumido — não é preciso provar sofrimento. A exceção é quem já tinha outra negativação legítima anterior: nesse caso, pela Súmula 385 do STJ, cabe o cancelamento do registro indevido, mas não a indenização."
      },
      {
        question: "Empresas que prometem limpar o nome pagando uma taxa funcionam?",
        answer:
          "Não. Ninguém consegue apagar dívida legítima de cadastro nem 'turbinar' score de crédito. O nome só sai pagando, negociando, pelo decurso dos 5 anos ou por decisão judicial quando o registro é indevido. Pagamento antecipado com promessa de resultado é o formato clássico do golpe."
      },
      {
        question: "Nome limpo significa score alto na hora?",
        answer:
          "Não necessariamente. A baixa da negativação remove a restrição, mas o score é recalculado aos poucos, considerando histórico de pagamentos, cadastro positivo e relacionamento com o crédito. Desconfie de qualquer serviço que prometa aumentar o score rapidamente."
      }
    ]
  },
  {
    slug: "inventario-como-fazer-custos-e-prazos",
    title: "Inventário em 2026: como fazer, quanto custa e quais são os prazos",
    excerpt:
      "Cartório ou Justiça? Veja quem pode fazer inventário extrajudicial, os custos (ITCMD, cartório, honorários), o prazo de 2 meses e o que trava o processo.",
    category: "Sucessões",
    readingMinutes: 11,
    publishedAt: "2026-07-04",
    author: "Equipe AdvAqui",
    authorRole: "Equipe",
    relatedSpecialty: "civil",
    intro:
      "O inventário é o procedimento que transfere oficialmente os bens de quem faleceu para os herdeiros — e, sem ele, a família não consegue vender o imóvel, movimentar as contas nem regularizar nada no nome de ninguém. A boa notícia: quando há acordo entre herdeiros adultos, o inventário pode ser feito em cartório, em semanas ou poucos meses. Este guia explica em linguagem simples a diferença entre inventário judicial e extrajudicial, o prazo de 2 meses para abrir, quanto custa (ITCMD, cartório e honorários) e o que costuma travar o processo.",
    body: [
      { type: "h2", text: "O que é o inventário e por que ele é obrigatório?" },
      {
        type: "p",
        text: "Quando alguém morre, seus bens, dívidas e direitos formam o chamado espólio — um patrimônio que ainda está no nome do falecido. O inventário é o procedimento que apura tudo o que existe (imóveis, veículos, contas, investimentos, dívidas), paga o imposto devido e formaliza a partilha entre os herdeiros. Só com o documento final — o formal de partilha (na Justiça) ou a escritura de inventário (no cartório) — é possível registrar o imóvel no nome dos herdeiros, transferir o carro, sacar investimentos e vender qualquer bem. Enquanto o inventário não sai, o patrimônio fica juridicamente travado."
      },
      { type: "h2", text: "Inventário em cartório ou na Justiça: qual a diferença?" },
      {
        type: "p",
        text: "Desde a Lei 11.441/2007, o inventário pode ser feito por escritura pública em cartório de notas — o inventário extrajudicial —, que é o caminho mais rápido e geralmente mais barato. Para poder usar o cartório, é preciso preencher os requisitos:"
      },
      {
        type: "ul",
        items: [
          "Todos os herdeiros maiores de idade e capazes — havendo herdeiro menor ou incapaz, o caminho tradicional é o judicial",
          "Acordo total entre os herdeiros sobre a divisão dos bens — uma única divergência já empurra o caso para a Justiça",
          "Participação obrigatória de advogado, que assina a escritura junto com as partes",
          "Testamento: em regra exigia inventário judicial, mas as normas do CNJ e dos estados passaram a admitir o cartório quando o testamento já foi processado ou autorizado pelo juiz — o tabelião e o advogado orientam caso a caso"
        ]
      },
      {
        type: "p",
        text: "O inventário judicial, por sua vez, é o caminho obrigatório quando há briga entre herdeiros, herdeiro menor ou incapaz, herdeiro que não é localizado ou situações que exigem decisão de juiz. Ele também pode ser escolhido voluntariamente, mesmo quando o cartório seria possível. A diferença prática está no tempo: o extrajudicial, com documentos em ordem e imposto pago, sai em semanas ou poucos meses; o judicial costuma levar de 1 a 5 anos — ou mais, quando há litígio."
      },
      { type: "h2", text: "Qual é o prazo para abrir o inventário?" },
      {
        type: "p",
        text: "O Código de Processo Civil fixa o prazo de 2 meses, contados do falecimento, para abrir o inventário. Perder esse prazo não impede de fazer depois — inventário atrasado é feito todos os dias —, mas custa dinheiro: a maioria dos estados cobra multa sobre o ITCMD quando a abertura passa do prazo, com percentuais que crescem conforme a demora. Quanto mais tempo passa, mais caro e mais complicado fica: documentos vencem, bens se deterioram, herdeiros morrem (gerando inventários acumulados) e dívidas do espólio crescem."
      },
      { type: "h2", text: "ITCMD: o imposto do inventário" },
      {
        type: "p",
        text: "O ITCMD (Imposto de Transmissão Causa Mortis e Doação) é o imposto estadual que incide sobre a herança. A alíquota varia de estado para estado, respeitado o teto nacional de 8% — em muitos estados fica entre 2% e 8%, às vezes com faixas progressivas conforme o valor herdado. A base de cálculo é o valor dos bens transmitidos, avaliados conforme as regras do estado. Todos os estados preveem isenções — casos comuns envolvem imóvel único de baixo valor usado como moradia da família ou montes de pequeno valor, sempre conforme a lei estadual. O pagamento do ITCMD (ou o reconhecimento da isenção) é condição para concluir o inventário e registrar a partilha."
      },
      { type: "h2", text: "Quanto custa um inventário na prática?" },
      {
        type: "ul",
        items: [
          "ITCMD — o maior custo na maioria dos casos: percentual sobre o valor dos bens, conforme a alíquota do estado",
          "Emolumentos de cartório (no extrajudicial) — tabela oficial de cada estado, em geral proporcional ao valor do monte partilhado",
          "Custas judiciais (no judicial) — também proporcionais ao valor da causa, conforme a tabela do tribunal do estado",
          "Honorários do advogado — livremente combinados; as tabelas da OAB de cada estado servem de referência, e o valor costuma considerar a complexidade e o patrimônio",
          "Custos acessórios — certidões (imóveis, negativas fiscais), avaliações e eventual regularização de bens com pendências"
        ]
      },
      {
        type: "p",
        text: "Quem não tem condições de arcar com os custos pode requerer a gratuidade da justiça no inventário judicial e, por norma do CNJ, a gratuidade da escritura no cartório, mediante declaração de que não pode pagar sem prejuízo do sustento. O ITCMD, porém, segue as regras de isenção de cada estado — vale verificar se o caso se encaixa antes de pagar."
      },
      { type: "h2", text: "Passo a passo do inventário extrajudicial (cartório)" },
      {
        type: "ol",
        items: [
          "Contratar advogado — a participação dele é obrigatória por lei, mesmo no cartório",
          "Reunir os documentos: certidão de óbito, documentos pessoais do falecido e dos herdeiros, certidão de casamento ou de união, matrículas dos imóveis, documentos de veículos, extratos bancários e de investimentos, e certidões negativas exigidas pelo tabelionato",
          "Levantar o patrimônio e as dívidas — o que entra, o que se abate e como fica a divisão",
          "Definir o inventariante — o herdeiro (ou cônjuge) que representa o espólio e assina pela família",
          "Declarar e recolher o ITCMD na Secretaria da Fazenda do estado (ou obter o reconhecimento da isenção)",
          "Lavrar a escritura de inventário e partilha no cartório de notas — pode ser feita em qualquer tabelionato do país, independentemente de onde o falecido morava",
          "Registrar: a escritura vai ao cartório de registro de imóveis (para os imóveis), ao Detran (veículos) e aos bancos (contas e investimentos) para efetivar as transferências"
        ]
      },
      { type: "h2", text: "Passo a passo do inventário judicial" },
      {
        type: "ol",
        items: [
          "O advogado protocola a petição de abertura na vara competente do último domicílio do falecido",
          "O juiz nomeia o inventariante, que presta compromisso e apresenta as primeiras declarações (lista de bens, dívidas e herdeiros)",
          "Herdeiros são citados e a Fazenda estadual é intimada para fiscalizar o ITCMD",
          "Bens são avaliados quando necessário e eventuais disputas (quem é herdeiro, o que entra na partilha) são decididas pelo juiz",
          "Recolhe-se o ITCMD e apresenta-se o plano de partilha",
          "O juiz homologa a partilha por sentença e expede o formal de partilha, que é levado aos registros (imóveis, Detran, bancos)"
        ]
      },
      { type: "h2", text: "O que costuma travar um inventário?" },
      {
        type: "ul",
        items: [
          "Herdeiro que não concorda com a divisão ou que não é localizado — o consenso é requisito do cartório e a citação é obrigatória na Justiça",
          "Imóvel irregular — sem matrícula, sem escritura registrada ou 'de contrato de gaveta': muitas vezes é preciso regularizar antes (inclusive por usucapião) para poder partilhar",
          "Falta de dinheiro para o ITCMD — é possível pedir ao juiz alvará para vender um bem do espólio e pagar o imposto e as despesas",
          "Dívidas do falecido — precisam ser levantadas e pagas pelo espólio antes da partilha; os herdeiros não respondem com o próprio bolso, mas a herança responde até o seu limite",
          "Testamento — exige procedimento próprio de abertura e cumprimento antes da partilha",
          "Bens descobertos depois — não travam o inventário principal: podem ser partilhados depois, em sobrepartilha"
        ]
      },
      { type: "h2", text: "Dá para mexer no dinheiro do falecido antes do inventário?" },
      {
        type: "p",
        text: "Em regra, não — contas e investimentos ficam bloqueados até a partilha. Mas há exceções importantes: valores de FGTS, PIS/Pasep e saldos de pequeno valor deixados pelo falecido podem ser pagos diretamente aos dependentes habilitados ou levantados por alvará judicial, num procedimento bem mais simples que o inventário (Lei 6.858/80). O seguro de vida também fica fora do inventário: é pago diretamente ao beneficiário indicado na apólice, sem entrar na partilha e sem ITCMD na maioria dos estados. Já usar o cartão ou a senha do falecido para 'resolver por fora' é um erro que gera briga entre herdeiros e prestação de contas — tudo o que sair do espólio precisa aparecer no inventário."
      },
      {
        type: "callout",
        text: "Vender ou prometer vender um bem do espólio antes do fim do inventário exige cautela: o herdeiro pode ceder seus direitos hereditários por escritura pública, mas a venda do bem em si, antes da partilha, depende de alvará judicial. Negócios 'de boca' sobre herança são fonte clássica de litígio — formalize tudo."
      },
      { type: "h2", text: "Quando procurar um advogado?" },
      {
        type: "p",
        text: "No inventário, sempre — a lei exige advogado tanto na via judicial quanto na escritura de cartório. Além da exigência formal, é o advogado quem avalia o caminho mais barato e rápido para o caso, confere isenções de ITCMD, organiza a documentação dos bens (inclusive a regularização de imóveis pendentes) e desenha a partilha de forma a prevenir conflitos futuros. Se os herdeiros estiverem de acordo, um único advogado pode representar todos; havendo interesses diferentes, cada grupo deve ter o seu. Quem não pode pagar tem direito à Defensoria Pública."
      }
    ],
    faq: [
      {
        question: "Posso fazer inventário sem advogado?",
        answer:
          "Não. A participação do advogado é obrigatória por lei nos dois formatos — no processo judicial e na escritura de inventário em cartório. Se os herdeiros estão de acordo, um único advogado pode assistir a todos, o que reduz o custo."
      },
      {
        question: "Existe herança que dispensa inventário?",
        answer:
          "Alguns valores escapam do inventário: FGTS, PIS/Pasep e saldos de pequeno valor podem ir aos dependentes por alvará ou procedimento simplificado (Lei 6.858/80), e o seguro de vida é pago direto ao beneficiário da apólice. Para imóveis, veículos e o restante do patrimônio, o inventário é obrigatório."
      },
      {
        question: "O que acontece se ninguém abrir o inventário?",
        answer:
          "Os bens ficam travados no nome do falecido: não podem ser vendidos nem transferidos regularmente. Além disso, a maioria dos estados cobra multa sobre o ITCMD pela abertura fora do prazo de 2 meses, e a situação se complica a cada herdeiro que falece sem a partilha anterior resolvida."
      },
      {
        question: "Herdeiro é obrigado a pagar as dívidas do falecido?",
        answer:
          "Não com o próprio bolso. As dívidas do falecido são pagas pelo espólio, e os herdeiros respondem apenas até o limite do que receberem de herança. Se as dívidas superam o patrimônio, a herança pode ser insuficiente — mas o patrimônio pessoal dos herdeiros fica protegido."
      },
      {
        question: "Quanto tempo demora um inventário em cartório?",
        answer:
          "Com todos os herdeiros de acordo, documentos completos e ITCMD pago (ou isenção reconhecida), a escritura costuma sair em semanas ou poucos meses. O que mais atrasa é a documentação dos bens — imóvel irregular, por exemplo, precisa ser resolvido antes."
      },
      {
        question: "Posso vender o imóvel da herança antes de terminar o inventário?",
        answer:
          "A venda do imóvel em si, antes da partilha, depende de alvará judicial. O que o herdeiro pode fazer por conta própria é ceder seus direitos hereditários por escritura pública — o comprador assume o lugar dele no inventário, com os riscos correspondentes. Em qualquer cenário, formalize por escritura e com orientação jurídica."
      }
    ]
  },
  {
    slug: "como-dar-entrada-no-inss-pelo-meu-inss",
    title: "Como dar entrada no INSS pelo Meu INSS: o passo a passo para pedir seu benefício",
    excerpt:
      "Crie o acesso gov.br, encontre o serviço certo, anexe documentos e acompanhe o pedido de aposentadoria, auxílio ou pensão pelo Meu INSS — sem sair de casa.",
    category: "Previdenciário",
    readingMinutes: 10,
    publishedAt: "2026-07-04",
    author: "Equipe AdvAqui",
    authorRole: "Equipe",
    relatedSpecialty: "previdenciario",
    intro:
      "Saber como dar entrada no INSS pelo Meu INSS evita filas, deslocamentos e a sensação de estar perdido diante da burocracia — hoje quase todos os pedidos de aposentadoria, auxílio, salário-maternidade e pensão começam pela internet, no aplicativo ou no site. Este guia mostra, em linguagem simples, como criar o acesso, encontrar o serviço certo, anexar os documentos, acompanhar o andamento e o que fazer se o pedido for negado ou demorar.",
    body: [
      { type: "h2", text: "O que dá para resolver pelo Meu INSS" },
      {
        type: "p",
        text: "O Meu INSS é o canal digital do INSS, disponível como aplicativo (Android e iPhone) e como site. Por ele, o segurado faz a maior parte dos pedidos e consultas sem precisar ir a uma agência. Entre os serviços mais procurados estão:"
      },
      {
        type: "ul",
        items: [
          "Pedir aposentadoria (por idade, por tempo de contribuição e outras modalidades das regras vigentes)",
          "Pedir auxílio por incapacidade temporária (o antigo auxílio-doença) e agendar a perícia",
          "Pedir salário-maternidade, pensão por morte e auxílio-reclusão",
          "Solicitar o BPC/LOAS (benefício assistencial ao idoso e à pessoa com deficiência)",
          "Consultar o extrato de contribuições (CNIS), a carta de concessão e o histórico de pagamentos",
          "Acompanhar o andamento de um pedido, cumprir exigências e apresentar recurso"
        ]
      },
      { type: "h2", text: "Passo 1: criar ou recuperar o acesso gov.br" },
      {
        type: "p",
        text: "O login do Meu INSS é a conta gov.br, a mesma usada em vários serviços do governo. Se você já tem conta gov.br (de outro serviço, como o Detran ou a Receita), use o mesmo CPF e senha. Se ainda não tem, dá para criar na hora."
      },
      { type: "h3", text: "Se você ainda não tem conta gov.br" },
      {
        type: "ol",
        items: [
          "Baixe o aplicativo Meu INSS ou acesse o site oficial e toque em 'Entrar com gov.br'",
          "Informe o CPF e siga a opção de criar conta",
          "Confirme seus dados e escolha uma forma de validação (por reconhecimento facial no aplicativo, por bancos credenciados ou pelas demais opções oferecidas)",
          "Crie uma senha forte e guarde-a em local seguro",
          "Quando possível, aumente o nível da conta (selo prata ou ouro) — alguns serviços exigem esse nível de segurança"
        ]
      },
      {
        type: "callout",
        text: "Nunca pague para criar conta gov.br nem para acessar o Meu INSS: os dois são gratuitos e oficiais. Cobranças e 'facilitadores' que pedem senha ou dinheiro para 'liberar' benefício são golpe."
      },
      { type: "h2", text: "Passo 2: encontrar o serviço certo" },
      {
        type: "p",
        text: "Depois de entrar, use a barra de busca 'Do que você precisa?' e digite o nome do benefício — por exemplo, 'aposentadoria por idade' ou 'salário-maternidade'. O sistema mostra o serviço correspondente com o botão para iniciar o pedido. Escolher o serviço certo importa: pedir a modalidade errada pode gerar negativa e fazer você perder tempo. Na dúvida sobre qual benefício se encaixa no seu caso, vale consultar um profissional antes de protocolar."
      },
      {
        type: "ul",
        items: [
          "Antes de pedir, confira o seu extrato CNIS: ele mostra os vínculos e contribuições que o INSS reconhece",
          "Se faltar algum período, guarde carteira de trabalho, holerites e carnês para comprovar depois",
          "Alguns serviços permitem simular o tempo de contribuição antes de decidir"
        ]
      },
      { type: "h2", text: "Passo 3: preencher o pedido e anexar documentos" },
      {
        type: "p",
        text: "Ao iniciar o serviço, o sistema faz perguntas e pede o anexo de documentos digitalizados (fotos legíveis ou PDF). Os documentos variam conforme o benefício, mas os mais comuns são:"
      },
      {
        type: "ul",
        items: [
          "Documento de identidade com foto e CPF",
          "Comprovante de residência atualizado",
          "Carteira de trabalho, carnês de contribuição (GPS) e holerites, quando o caso envolver tempo de trabalho",
          "Documentos específicos do benefício — por exemplo, certidão de nascimento do bebê no salário-maternidade, ou laudos e exames médicos nos benefícios por incapacidade",
          "No caso de pensão por morte, a certidão de óbito e a prova do vínculo com o falecido (casamento, união estável, filiação)"
        ]
      },
      {
        type: "p",
        text: "Digitalize tudo com boa qualidade, sem cortar as bordas. Depois de conferir os dados, finalize o pedido: o sistema gera um número de protocolo e, se houver perícia médica ou avaliação social, oferece o agendamento. Guarde o número do protocolo — é por ele que você acompanha tudo."
      },
      { type: "h2", text: "Passo 4: acompanhar o andamento" },
      {
        type: "p",
        text: "Todo pedido pode ser acompanhado dentro do próprio Meu INSS, em 'Consultar pedidos'. Ali aparecem o status atual e eventuais pendências. Fique atento porque o INSS costuma se comunicar por esse canal, e não por telefone."
      },
      {
        type: "ul",
        items: [
          "'Em análise' — o pedido está na fila de avaliação",
          "'Exigência' — o INSS pediu um documento ou informação; há prazo para cumprir, e o não atendimento pode levar ao indeferimento",
          "'Concluído' — o pedido foi decidido (concedido ou negado); veja a carta com o resultado"
        ]
      },
      { type: "h2", text: "E se aparecer uma exigência ou for marcada perícia?" },
      {
        type: "p",
        text: "Se surgir uma exigência, cumpra dentro do prazo indicado, anexando o que foi pedido pelo próprio sistema. Se o benefício depende de perícia médica (como os por incapacidade), compareça na data agendada levando documento com foto e todos os laudos, exames e receitas que comprovem a sua condição. Faltar à perícia sem justificativa costuma levar ao arquivamento do pedido."
      },
      { type: "h2", text: "Quanto tempo o INSS tem para responder?" },
      {
        type: "p",
        text: "A lei e as normas do INSS preveem prazos para a análise dos pedidos, que variam conforme o tipo de benefício. Na prática, as filas oscilam bastante. Se o prazo estourar sem resposta, existem caminhos para pressionar o andamento, inclusive administrativos e judiciais. Guardar o protocolo e as datas ajuda muito nesse momento."
      },
      { type: "h2", text: "Pedido negado: o que fazer" },
      {
        type: "p",
        text: "Uma negativa não é o fim da linha. Leia com atenção a carta de indeferimento: ela indica o motivo (falta de carência, tempo insuficiente, perícia que não reconheceu a incapacidade etc.). A partir do motivo, você pode:"
      },
      {
        type: "ul",
        items: [
          "Apresentar recurso administrativo ao Conselho de Recursos da Previdência Social, dentro do prazo informado na carta",
          "Corrigir o que faltou e, quando cabível, formular novo pedido com mais provas",
          "Levar o caso à Justiça — no Juizado Especial Federal para valores menores, ou na Justiça Federal comum para os demais"
        ]
      },
      { type: "h2", text: "Precisa de advogado para dar entrada?" },
      {
        type: "p",
        text: "Para o pedido inicial no Meu INSS, não é obrigatório ter advogado — qualquer pessoa pode protocolar. Mesmo assim, uma orientação profissional ajuda a escolher o benefício certo, organizar as provas do tempo de contribuição e evitar erros que geram negativa. Em caso de recurso ou de ação na Justiça, o acompanhamento por advogado passa a ser muito recomendável, e quem não pode pagar tem direito à Defensoria Pública."
      },
      { type: "h2", text: "Cuidado com golpes" },
      {
        type: "p",
        text: "O INSS não liga pedindo senha, código ou pagamento para liberar benefício, e o Meu INSS é gratuito. Desconfie de mensagens, ligações e perfis que prometem 'antecipar' ou 'garantir' benefício mediante pagamento. Use apenas o aplicativo e o site oficiais, e nunca compartilhe a sua senha gov.br."
      }
    ],
    faq: [
      {
        question: "O Meu INSS é gratuito?",
        answer:
          "Sim. O aplicativo e o site Meu INSS são gratuitos e oficiais, assim como a criação da conta gov.br. Ninguém precisa pagar para dar entrada em um benefício. Qualquer cobrança para 'liberar' ou 'agilizar' o pedido é indício de golpe."
      },
      {
        question: "Posso dar entrada no INSS sem advogado?",
        answer:
          "Pode. O pedido inicial pelo Meu INSS não exige advogado. A orientação profissional ajuda a escolher o benefício correto e a reunir provas, e passa a ser muito recomendável em caso de recurso ou de ação judicial. Quem não pode pagar tem direito à Defensoria Pública."
      },
      {
        question: "Esqueci minha senha gov.br. Como recupero?",
        answer:
          "Na tela de login, use a opção de recuperar senha e siga a validação disponível (por reconhecimento facial no aplicativo, por bancos credenciados ou pelas demais opções). Como o gov.br é usado em vários serviços, recuperar o acesso resolve o login em todos eles."
      },
      {
        question: "Meu pedido apareceu como 'exigência'. O que significa?",
        answer:
          "Significa que o INSS precisa de um documento ou informação para continuar a análise. Cumpra a exigência dentro do prazo indicado, anexando o que foi solicitado no próprio sistema. Deixar de atender no prazo pode levar ao indeferimento do pedido."
      },
      {
        question: "O INSS negou meu benefício. Ainda dá para reverter?",
        answer:
          "Sim. Você pode apresentar recurso administrativo dentro do prazo da carta de indeferimento, corrigir o que faltou em novo pedido ou levar o caso à Justiça. A carta indica o motivo da negativa, e é por ele que se define a melhor estratégia."
      }
    ]
  },
  {
    slug: "assedio-moral-no-trabalho-o-que-fazer",
    title: "Assédio moral no trabalho: o que fazer, como provar e quais são seus direitos",
    excerpt:
      "Humilhação repetida, metas como punição, isolamento: entenda o que caracteriza assédio moral, como reunir provas, a rescisão indireta e como buscar indenização.",
    category: "Trabalhista",
    readingMinutes: 10,
    publishedAt: "2026-07-04",
    author: "Equipe AdvAqui",
    authorRole: "Equipe",
    relatedSpecialty: "trabalhista",
    intro:
      "O assédio moral no trabalho é a humilhação repetida e prolongada que expõe, isola ou constrange o trabalhador — e, ao contrário do que muita gente pensa, não é 'coisa de quem não aguenta pressão': é conduta que pode gerar indenização e até justificar o rompimento do contrato por culpa da empresa. Este guia explica, em linguagem simples, o que caracteriza o assédio, o que fazer agora, como reunir provas e quais são os seus direitos.",
    body: [
      { type: "h2", text: "O que é (e o que não é) assédio moral" },
      {
        type: "p",
        text: "Assédio moral é a repetição de condutas abusivas que humilham, constrangem ou desestabilizam o trabalhador no ambiente de trabalho. O ponto central é a repetição e a intenção de menosprezar ou perseguir — um episódio isolado de estresse, uma cobrança pontual e justa ou um desentendimento comum não configuram, por si só, assédio. São exemplos frequentes:"
      },
      {
        type: "ul",
        items: [
          "Humilhações e ofensas diante dos colegas, apelidos pejorativos e gritos",
          "Isolamento proposital: deixar a pessoa sem tarefas ou sem informação para trabalhar",
          "Metas impossíveis usadas como forma de punição e ameaças constantes de demissão",
          "Vigilância excessiva, controle abusivo de idas ao banheiro e exposição pública de erros",
          "Rebaixamento de função sem motivo ou retirada de responsabilidades para constranger"
        ]
      },
      { type: "h2", text: "Assédio moral não é só 'chefe chato'" },
      {
        type: "p",
        text: "O assédio pode vir do superior (assédio vertical), de colegas do mesmo nível (assédio horizontal) e até de subordinados contra a chefia. Cobrança de resultados e fiscalização razoável fazem parte da relação de trabalho — o que a lei reprova é o abuso reiterado que fere a dignidade da pessoa, direito garantido pela Constituição. A diferença entre gestão rígida e assédio está na intenção de humilhar e na repetição."
      },
      { type: "h2", text: "O que fazer agora: passo a passo" },
      {
        type: "ol",
        items: [
          "Registre cada episódio: data, hora, local, o que foi dito ou feito e quem presenciou",
          "Guarde provas — mensagens, e-mails, áudios, prints e documentos que mostrem as condutas",
          "Use os canais internos da empresa (RH, ouvidoria, canal de denúncia), de preferência por escrito, guardando o protocolo",
          "Procure atendimento médico se a situação afetou a sua saúde e guarde atestados e laudos",
          "Se houver sindicato da categoria, procure orientação; ele pode acompanhar e intermediar",
          "Antes de decisões definitivas, como pedir a rescisão indireta, consulte um advogado"
        ]
      },
      { type: "h2", text: "Como reunir provas" },
      {
        type: "p",
        text: "A prova é o ponto mais decisivo em casos de assédio, porque muitas condutas acontecem sem testemunhas ou de forma velada. Vale reunir o máximo de elementos, de preferência combinando mais de um tipo:"
      },
      {
        type: "ul",
        items: [
          "Mensagens e e-mails com o teor abusivo (salve cópias fora do computador da empresa)",
          "Testemunhas — colegas que presenciaram; mesmo ex-funcionários podem depor",
          "Registros médicos que liguem o adoecimento ao ambiente de trabalho",
          "Um diário dos fatos, feito no dia a dia, que ajuda a demonstrar a repetição ao longo do tempo"
        ]
      },
      {
        type: "callout",
        text: "Gravar uma conversa da qual você participa é, em regra, admitido como prova pela Justiça. Já invadir e-mails alheios ou expor terceiros pode se voltar contra você. Na dúvida sobre o que pode ou não ser usado, pergunte a um advogado antes."
      },
      { type: "h2", text: "Quais são os seus direitos" },
      {
        type: "p",
        text: "Reconhecido o assédio moral, abrem-se dois caminhos principais, que podem ser cumulados conforme o caso."
      },
      { type: "h3", text: "Rescisão indireta" },
      {
        type: "p",
        text: "A rescisão indireta é a 'demissão por justa causa do empregador': quando a empresa comete falta grave — e o assédio moral pode ser uma delas —, o trabalhador pode pedir na Justiça o fim do contrato mantendo os direitos de quem é dispensado sem justa causa (aviso prévio, multa de 40% do FGTS, saque do FGTS e, cumpridos os requisitos, seguro-desemprego). É uma decisão séria e depende de prova consistente, por isso costuma ser encaminhada com apoio de advogado."
      },
      { type: "h3", text: "Indenização por dano moral" },
      {
        type: "p",
        text: "O assédio moral pode gerar direito a indenização por dano moral, cujo valor é arbitrado pelo juiz conforme a gravidade dos fatos, a duração e as circunstâncias. Não existe uma tabela fixa: cada caso é avaliado individualmente, o que reforça a importância das provas."
      },
      { type: "h2", text: "Assédio moral e adoecimento: o lado do INSS" },
      {
        type: "p",
        text: "Quando o assédio leva a um transtorno de saúde que afasta do trabalho, pode haver direito a benefício por incapacidade do INSS. Se ficar demonstrado que a doença tem relação com o trabalho, ela pode ser tratada como doença ocupacional, o que traz efeitos adicionais, como estabilidade e reflexos indenizatórios. O reconhecimento do nexo passa por perícia médica."
      },
      { type: "h2", text: "Denunciar dentro e fora da empresa" },
      {
        type: "p",
        text: "Além dos canais internos, existem instâncias externas que podem receber denúncias e atuar, especialmente quando o problema é coletivo ou a empresa se omite:"
      },
      {
        type: "ul",
        items: [
          "Sindicato da categoria — orientação e acompanhamento",
          "Ministério Público do Trabalho — atua em casos com repercussão coletiva",
          "Auditoria-Fiscal do Trabalho — fiscaliza o ambiente e as condições de trabalho"
        ]
      },
      { type: "h2", text: "Prazo para agir" },
      {
        type: "p",
        text: "Na Justiça do Trabalho, em regra o trabalhador tem até 2 anos após o fim do contrato para ajuizar a ação, podendo cobrar verbas dos últimos 5 anos. Esperar demais pode fazer você perder direitos, por isso não deixe para depois quando a situação já estiver clara."
      },
      { type: "h2", text: "Quando procurar um advogado" },
      {
        type: "p",
        text: "Vale procurar um advogado assim que a situação se repete e você começa a reunir provas — e, com mais razão, antes de tomar decisões definitivas, como pedir a rescisão indireta ou ajuizar a ação. O profissional avalia se o caso reúne elementos suficientes, orienta sobre as provas e define a melhor estratégia. Quem não pode pagar tem direito à Defensoria Pública ou ao atendimento do sindicato."
      }
    ],
    faq: [
      {
        question: "Um único episódio já é assédio moral?",
        answer:
          "Em regra, não. O assédio moral se caracteriza pela repetição de condutas abusivas ao longo do tempo. Um episódio isolado grave pode gerar outras consequências e direito a reparação, mas o assédio moral propriamente dito costuma exigir a demonstração de que a conduta se repetiu."
      },
      {
        question: "Posso gravar meu chefe para usar como prova?",
        answer:
          "Gravar uma conversa da qual você mesmo participa é, em regra, aceito como prova pela Justiça. O cuidado é não obter provas por meios ilícitos, como invadir contas de terceiros. Em caso de dúvida sobre o que pode ser usado, consulte um advogado antes."
      },
      {
        question: "O que é rescisão indireta?",
        answer:
          "É quando o trabalhador pede o fim do contrato por falta grave da empresa e, reconhecida na Justiça, recebe os mesmos direitos de quem é dispensado sem justa causa. O assédio moral pode fundamentar esse pedido, que depende de prova consistente e costuma exigir apoio jurídico."
      },
      {
        question: "Consigo indenização por assédio moral?",
        answer:
          "Pode haver direito a indenização por dano moral quando o assédio é comprovado. O valor é definido pelo juiz conforme a gravidade, a duração e as circunstâncias do caso — não existe tabela fixa. Por isso, reunir boas provas é decisivo."
      },
      {
        question: "Qual o prazo para entrar com ação?",
        answer:
          "Na Justiça do Trabalho, em regra o prazo é de até 2 anos após o fim do contrato, com possibilidade de cobrar verbas dos últimos 5 anos. Esperar demais pode significar a perda de direitos, então não convém adiar quando a situação já está clara."
      }
    ]
  },
  {
    slug: "acidente-de-transito-quem-paga-o-conserto",
    title: "Acidente de trânsito: quem paga o conserto do carro e como ser ressarcido",
    excerpt:
      "Batida sem vítimas? Veja quem paga o conserto, o que fazer no local, como acionar seguro ou Juizado, o que fazer se o culpado fugiu e os prazos para cobrar.",
    category: "Trânsito",
    readingMinutes: 10,
    publishedAt: "2026-07-04",
    author: "Equipe AdvAqui",
    authorRole: "Equipe",
    relatedSpecialty: "civil",
    intro:
      "Depois de um acidente de trânsito, a primeira dúvida costuma ser quem paga o conserto do carro — e a resposta, na maioria dos casos, é simples: paga quem deu causa à batida. Este guia explica, em linguagem simples, como funciona a responsabilidade, o que fazer no local, os caminhos para ser ressarcido (acordo, seguro, Juizado e Justiça comum), o que fazer se o culpado fugiu ou não tem seguro e quais prazos você precisa respeitar.",
    body: [
      { type: "h2", text: "A regra geral: quem tem culpa paga" },
      {
        type: "p",
        text: "No Brasil, quem causa um dano a outra pessoa por imprudência, negligência ou imperícia tem o dever de repará-lo — é a chamada responsabilidade civil, prevista no Código Civil. No trânsito, isso significa que o motorista que provocou a batida deve arcar com o conserto do veículo do outro e com os demais prejuízos causados. Provar de quem foi a culpa, portanto, é o coração de qualquer pedido de ressarcimento."
      },
      { type: "h2", text: "No local do acidente: o que fazer na hora" },
      {
        type: "ol",
        items: [
          "Garanta a segurança: sinalize a via e, havendo feridos, chame o socorro (SAMU 192) e a polícia",
          "Não saia do local antes de resolver o essencial — deixar a cena de acidente com vítimas é infração grave e pode ser crime",
          "Anote os dados do outro condutor: nome, CPF, telefone, placa, modelo e seguradora, se houver",
          "Fotografe tudo: posição dos veículos, danos, placas, a via, a sinalização e eventuais marcas de frenagem",
          "Busque testemunhas e anote nome e telefone de quem viu o acidente",
          "Registre o boletim de ocorrência, presencialmente ou pela internet, conforme o caso"
        ]
      },
      { type: "h2", text: "Boletim de ocorrência é obrigatório?" },
      {
        type: "p",
        text: "Em batidas apenas com danos materiais e sem vítimas, muitas vezes é possível resolver por acordo, e o boletim não é sempre obrigatório. Ainda assim, registrá-lo é altamente recomendável: o boletim é uma prova importante e costuma ser exigido pelas seguradoras. Havendo feridos, o registro é indispensável. Em muitas cidades existe o boletim eletrônico, feito pela internet."
      },
      { type: "h2", text: "Caminhos para ser ressarcido" },
      { type: "h3", text: "1. Acordo direto com o culpado" },
      {
        type: "p",
        text: "É o caminho mais rápido e barato. As partes combinam o valor do conserto — de preferência com base em orçamentos de oficinas — e formalizam por escrito, com um recibo ou termo de acordo assinado que descreva o que foi combinado e dê quitação após o pagamento. Colocar tudo no papel evita que o assunto volte depois."
      },
      { type: "h3", text: "2. Acionar o seguro" },
      {
        type: "p",
        text: "Se você tem seguro com a cobertura adequada, pode acionar a sua seguradora, pagando a franquia; a seguradora depois cobra do culpado, se for o caso. Se o culpado tem seguro, também é possível buscar a seguradora dele. Leia a apólice para entender coberturas, franquia e prazos de aviso de sinistro."
      },
      { type: "h3", text: "3. Juizado Especial Cível" },
      {
        type: "p",
        text: "Não havendo acordo, o Juizado Especial Cível é a via mais acessível para valores menores. Causas de até 20 salários mínimos podem ser propostas sem advogado; entre 20 e 40 salários mínimos, o advogado passa a ser exigido. É um caminho mais rápido e sem custas iniciais na maioria dos casos, ideal para a cobrança do conserto e de despesas comprovadas."
      },
      { type: "h3", text: "4. Ação na Justiça comum" },
      {
        type: "p",
        text: "Para valores maiores ou casos mais complexos — com feridos, discussão técnica de culpa ou perdas elevadas —, a cobrança segue pela Justiça comum, com advogado. Nessa via cabem pedidos mais amplos, como lucros cessantes e danos morais, conforme a gravidade."
      },
      { type: "h2", text: "E se o culpado fugiu ou não tem seguro?" },
      {
        type: "p",
        text: "Se o outro motorista fugiu, o boletim de ocorrência, as imagens de câmeras próximas e as testemunhas são essenciais para tentar identificá-lo. Identificado, ele pode ser cobrado ainda que não tenha seguro — a responsabilidade é da pessoa, não da apólice, e a cobrança pode alcançar seus bens. Para danos à própria pessoa (não ao carro), existe ainda o seguro obrigatório de vítimas de trânsito, o DPVAT, que independe de identificar o culpado."
      },
      { type: "h2", text: "O que dá para cobrar além do conserto" },
      {
        type: "ul",
        items: [
          "O conserto do veículo (ou a perda total, quando o reparo é inviável)",
          "Despesas comprovadas: guincho, transporte alternativo, diárias e itens danificados",
          "Lucros cessantes — o que a pessoa deixou de ganhar, típico de quem usa o carro para trabalhar (aplicativo, táxi, entregas)",
          "Danos morais, em situações que ultrapassam o mero aborrecimento, sobretudo quando há lesões",
          "Despesas médicas e tratamentos, quando houver vítimas"
        ]
      },
      { type: "h2", text: "Batida com veículo de aplicativo, ônibus ou moto" },
      {
        type: "p",
        text: "Quando o outro veículo é de transporte de passageiros (ônibus, van, táxi) ou de empresa, a responsabilidade pode alcançar também a empresa dona do veículo ou empregadora do motorista. Em acidentes com transporte de passageiros há regras próprias de responsabilidade. Identificar corretamente quem responde amplia as chances de ressarcimento, e é um ponto em que a orientação jurídica costuma ajudar."
      },
      { type: "h2", text: "DPVAT: o seguro que cobre pessoas, não o carro" },
      {
        type: "p",
        text: "É importante não confundir: o DPVAT indeniza danos às pessoas (morte, invalidez permanente e despesas médicas), independentemente de quem foi o culpado, mas não cobre o conserto do veículo. O prejuízo material do carro segue a lógica da responsabilidade civil — ou seja, é cobrado de quem deu causa ao acidente."
      },
      {
        type: "callout",
        text: "Antes de assinar qualquer acordo ou receber um valor 'para encerrar', confira se ele cobre tudo o que você tem a receber. Um recibo de quitação amplo pode impedir cobranças futuras, mesmo que surjam danos que você não havia percebido no momento."
      },
      { type: "h2", text: "Prazos: não deixe para depois" },
      {
        type: "p",
        text: "O Código Civil prevê prazo para a pretensão de reparação de danos — em regra, três anos. Perder esse prazo pode impedir a cobrança judicial. Além disso, provas se perdem com o tempo: câmeras apagam imagens, testemunhas mudam de endereço e a memória do acidente esfria. Agir logo aumenta muito as chances de ser ressarcido."
      },
      { type: "h2", text: "Quando procurar um advogado" },
      {
        type: "p",
        text: "Para causas menores, sem vítimas e com culpa clara, o Juizado Especial funciona bem mesmo sem advogado. A orientação profissional passa a ser importante quando há feridos, discussão sobre quem teve culpa, valores altos, envolvimento de empresas ou negativa da seguradora. O advogado ajuda a reunir provas, calcular tudo o que é devido e escolher a via correta. Quem não pode pagar tem direito à Defensoria Pública."
      }
    ],
    faq: [
      {
        question: "Quem paga o conserto do carro depois da batida?",
        answer:
          "Em regra, paga quem deu causa ao acidente. É a responsabilidade civil: o motorista culpado deve arcar com o conserto do veículo do outro e com os demais prejuízos. Por isso, provar de quem foi a culpa — com boletim, fotos e testemunhas — é o ponto central de qualquer ressarcimento."
      },
      {
        question: "Preciso registrar boletim de ocorrência?",
        answer:
          "Havendo feridos, sim, o registro é indispensável. Em batidas só com danos materiais, muitas vezes dá para resolver por acordo, mas registrar o boletim ainda é recomendável: é prova importante e costuma ser exigido pelas seguradoras. Em muitas cidades há boletim eletrônico pela internet."
      },
      {
        question: "O culpado fugiu. Ainda dá para ser ressarcido?",
        answer:
          "Se ele for identificado — por câmeras, testemunhas ou pela placa anotada —, pode ser cobrado mesmo sem seguro, porque a responsabilidade é da pessoa. Para danos à própria pessoa (não ao carro), há ainda o DPVAT, que independe de identificar o culpado."
      },
      {
        question: "Dá para resolver no Juizado sem advogado?",
        answer:
          "Sim, em causas de até 20 salários mínimos você pode ir ao Juizado Especial Cível sem advogado. Entre 20 e 40 salários mínimos o advogado passa a ser exigido, e acima disso a cobrança segue pela Justiça comum. É uma via rápida e, em regra, sem custas iniciais."
      },
      {
        question: "Qual o prazo para cobrar o prejuízo?",
        answer:
          "O Código Civil prevê, em regra, o prazo de três anos para a pretensão de reparação de danos. Perder esse prazo pode impedir a cobrança judicial, e as provas se perdem com o tempo. Por isso, o ideal é agir o quanto antes."
      }
    ]
  },
  {
    slug: "plano-de-saude-negou-cobertura-o-que-fazer",
    title: "Plano de saúde negou cobertura: o que fazer para conseguir o tratamento",
    excerpt:
      "Recusa de exame, cirurgia ou internação? Veja por que muitas negativas são abusivas, como pedir o motivo por escrito, onde reclamar e como buscar decisão urgente na Justiça.",
    category: "Consumidor",
    readingMinutes: 11,
    publishedAt: "2026-07-04",
    author: "Equipe AdvAqui",
    authorRole: "Equipe",
    relatedSpecialty: "civil",
    intro:
      "Quando o plano de saúde negou cobertura de um exame, cirurgia, internação ou remédio indicado pelo médico, a sensação é de impotência — mas nem toda recusa é válida, e existem caminhos concretos para tentar revertê-la. Este guia explica, em linguagem simples, por que muitas negativas são consideradas abusivas, como exigir a resposta por escrito, para onde levar a reclamação e como pedir uma decisão urgente à Justiça quando a saúde não pode esperar.",
    body: [
      { type: "h2", text: "Nem toda negativa do plano é válida" },
      {
        type: "p",
        text: "A relação entre você e o plano de saúde é uma relação de consumo. Sobre ela incidem o Código de Defesa do Consumidor e a Lei dos Planos de Saúde (Lei 9.656/1998), além das regras da agência que regula o setor, a ANS. Isso significa que o plano não pode recusar cobertura de qualquer jeito: a negativa precisa ter fundamento legal e contratual, e muitas recusas acabam sendo consideradas abusivas quando contrariam a lei ou deixam o consumidor sem o tratamento de que precisa."
      },
      {
        type: "p",
        text: "Um ponto central é o respeito à indicação do médico. Em regra, quem define qual é o tratamento adequado é o profissional que acompanha o paciente, não o plano. Recusar um procedimento indicado pelo médico com a justificativa de que existe outro caminho mais barato, por exemplo, é uma das situações mais questionadas."
      },
      { type: "h2", text: "Peça sempre o motivo da negativa por escrito" },
      {
        type: "p",
        text: "O primeiro passo prático é exigir que o plano informe o motivo da recusa por escrito, em linguagem clara. Quando você solicita, a operadora deve apresentar a justificativa, indicando as regras do contrato ou da lei em que se baseia. Esse documento é fundamental: é ele que revela se a negativa tem base real e é a principal prova para reclamar depois, seja nos órgãos de defesa do consumidor, seja na Justiça."
      },
      {
        type: "p",
        text: "Guarde também o número de protocolo de todos os contatos, a data e o horário. Se a recusa foi verbal, por telefone ou pelo aplicativo, registre e peça a confirmação por escrito mesmo assim."
      },
      { type: "h2", text: "Negativas mais comuns — e por que costumam ser questionadas" },
      {
        type: "ul",
        items: [
          "Carência aplicada em caso de urgência ou emergência, quando o atendimento não podia esperar",
          "Alegação de doença preexistente para negar o tratamento inteiro, sem os limites que a lei estabelece",
          "Recusa de tratamento indicado pelo médico sob o argumento de que ele não está na lista da ANS",
          "Negativa de prótese, material ou órtese ligados diretamente a uma cirurgia coberta",
          "Limite de sessões de terapias (como fisioterapia, fonoaudiologia ou psicologia) contra a indicação médica",
          "Demora excessiva na autorização, que na prática funciona como uma negativa"
        ]
      },
      { type: "h3", text: "Carência e os casos de urgência e emergência" },
      {
        type: "p",
        text: "Carência é o tempo de espera, contado a partir da contratação, antes de o consumidor ter direito a certos procedimentos. Ela existe e é legal. O que a lei trata de forma especial são as situações de urgência e emergência, com risco imediato à vida ou à saúde: nesses casos, há um prazo de carência bem mais curto, e negar o atendimento de emergência costuma ser considerado abusivo."
      },
      { type: "h3", text: "Doença preexistente" },
      {
        type: "p",
        text: "Doença preexistente é aquela que o consumidor já sabia ter ao contratar o plano. A lei permite ao plano exigir um prazo maior (a chamada cobertura parcial temporária) apenas para procedimentos de alta complexidade, cirurgias e leitos de alta tecnologia diretamente ligados à doença informada. Fora disso, e passado esse período, a cobertura é devida. Recusar tudo com base em doença preexistente, sem esses limites, é uma negativa frágil."
      },
      { type: "h3", text: "Tratamento fora da lista da ANS" },
      {
        type: "p",
        text: "A ANS mantém uma lista de procedimentos de cobertura obrigatória. Muitas negativas se apoiam no argumento de que o tratamento pedido não está nessa lista. A Lei 14.454/2022 passou a prever critérios para que tratamentos fora da lista também possam ser cobertos, especialmente quando há comprovação de eficácia e indicação médica. Por isso, uma negativa apoiada só no argumento da lista nem sempre se sustenta, e o relatório do médico é decisivo."
      },
      { type: "h2", text: "Passo a passo: o que fazer agora" },
      {
        type: "ol",
        items: [
          "Peça ao seu médico um relatório detalhado, com o diagnóstico (inclusive o CID), a justificativa clínica e por que aquele tratamento é o indicado",
          "Solicite a negativa por escrito ao plano e guarde o protocolo",
          "Registre reclamação no SAC e na ouvidoria da operadora, anotando os protocolos",
          "Abra reclamação na ANS, que pode intermediar e cobrar uma resposta da operadora em prazo curto",
          "Leve o caso ao Procon, que também pode notificar o plano",
          "Se houver urgência e risco à saúde, procure a Justiça com pedido de decisão liminar"
        ]
      },
      {
        type: "callout",
        text: "Guarde tudo por escrito: pedido médico, negativa, protocolos e mensagens. O relatório do médico, explicando por que o tratamento é necessário e urgente, costuma ser a peça mais importante para reverter a recusa."
      },
      { type: "h2", text: "Decisão urgente na Justiça (liminar)" },
      {
        type: "p",
        text: "Quando a saúde não pode esperar, é possível pedir à Justiça uma decisão rápida — chamada de liminar ou tutela de urgência — para obrigar o plano a autorizar o procedimento enquanto o processo é discutido. Havendo relatório médico indicando o risco e a urgência, o juiz pode determinar a cobertura em pouco tempo. Para causas de menor valor, o Juizado Especial Cível é uma via acessível, com atendimento mais rápido e, em regra, sem custas iniciais."
      },
      { type: "h2", text: "A negativa pode gerar indenização?" },
      {
        type: "p",
        text: "Além de garantir o tratamento, uma recusa abusiva pode, conforme o caso, dar direito a indenização por dano moral — sobretudo quando a negativa agrava o sofrimento do paciente em um momento delicado. Isso depende das circunstâncias e é avaliado caso a caso; não há valor fixo nem garantia de resultado."
      },
      { type: "h2", text: "Onde reclamar além da Justiça" },
      {
        type: "p",
        text: "A ANS recebe reclamações contra operadoras e tem canais próprios de atendimento; muitas vezes a simples abertura da reclamação já destrava a autorização. O Procon atua na defesa do consumidor e pode notificar o plano. Esses caminhos podem ser usados junto com a via judicial, sem excluir um ao outro."
      },
      { type: "h2", text: "Quando procurar um advogado" },
      {
        type: "p",
        text: "Para pedidos urgentes na Justiça, o acompanhamento de um advogado ajuda a montar o pedido de liminar e a reunir as provas certas. Casos com internação, cirurgia marcada ou risco à vida pedem agilidade. Quem não pode pagar advogado tem direito à Defensoria Pública. Este texto é informativo e não substitui a orientação de um profissional para o seu caso concreto."
      }
    ],
    faq: [
      {
        question: "O plano pode negar tratamento indicado pelo meu médico?",
        answer:
          "Em regra, quem define o tratamento adequado é o médico que acompanha o paciente. Negar um procedimento indicado pelo médico costuma ser questionado, principalmente quando a recusa se apoia apenas no argumento de que existe opção mais barata ou de que o tratamento não está na lista da ANS. O relatório médico detalhado é a prova central para contestar."
      },
      {
        question: "O plano negou por carência. Isso é válido?",
        answer:
          "A carência é legal, mas tem limites. Em casos de urgência e emergência, com risco à vida ou à saúde, o prazo de espera é bem mais curto, e negar o atendimento nessas situações costuma ser considerado abusivo. Vale exigir a negativa por escrito e verificar se a carência foi aplicada corretamente."
      },
      {
        question: "Dá para conseguir uma decisão rápida na Justiça?",
        answer:
          "Sim. Havendo urgência e risco à saúde, é possível pedir uma liminar (tutela de urgência) para que o plano autorize o procedimento enquanto o processo corre. Com relatório médico indicando a urgência, o juiz pode decidir em pouco tempo. Não há, porém, garantia de resultado: cada caso é analisado individualmente."
      },
      {
        question: "A negativa de cobertura dá direito a indenização?",
        answer:
          "Pode dar, conforme o caso. Recusas abusivas que agravam o sofrimento do paciente em momento delicado podem gerar dano moral, avaliado caso a caso pelo juiz. Não existe valor fixo nem garantia; o direito à indenização depende das circunstâncias concretas."
      },
      {
        question: "Onde reclamo além da Justiça?",
        answer:
          "Você pode reclamar na ANS, agência que regula os planos e pode cobrar resposta da operadora em prazo curto, e no Procon, que atua na defesa do consumidor. Esses canais podem ser usados junto com a via judicial. Em todos eles, guardar a negativa por escrito e os protocolos fortalece a reclamação."
      }
    ]
  },
  {
    slug: "como-funciona-a-guarda-compartilhada",
    title: "Como funciona a guarda compartilhada? Regras, rotina e pensão",
    excerpt:
      "Entenda o que é a guarda compartilhada, como ficam a rotina e a moradia dos filhos, se ainda há pensão, como decidir juntos e o que fazer quando os pais não se entendem.",
    category: "Família",
    readingMinutes: 11,
    publishedAt: "2026-07-04",
    author: "Equipe AdvAqui",
    authorRole: "Equipe",
    relatedSpecialty: "familia",
    intro:
      "A guarda compartilhada é hoje a regra no Brasil quando os pais se separam, e entender como ela funciona evita muita confusão sobre rotina, moradia e pensão dos filhos. Neste guia, em linguagem simples, você vê o que a lei prevê, como fica o dia a dia da criança, se ainda existe pensão alimentícia e o que dá para fazer quando o diálogo entre os pais é difícil.",
    body: [
      { type: "h2", text: "O que é a guarda compartilhada" },
      {
        type: "p",
        text: "Guarda compartilhada é o modelo em que os dois pais dividem a responsabilidade pela criação e pelas decisões importantes da vida dos filhos, mesmo morando em casas diferentes. Ela está prevista no Código Civil e parte de uma ideia simples: o filho tem direito à presença e ao cuidado do pai e da mãe, e as grandes decisões — escola, saúde, atividades — devem ser tomadas em conjunto."
      },
      {
        type: "p",
        text: "É importante entender que compartilhar a guarda não é o mesmo que dividir o tempo exatamente ao meio. O foco está na responsabilidade conjunta pelas decisões, e não em cronometrar dias iguais na casa de cada um."
      },
      { type: "h2", text: "Compartilhada não é a mesma coisa que alternada" },
      {
        type: "p",
        text: "Muita gente confunde guarda compartilhada com guarda alternada. Na guarda alternada, a criança fica um período morando com um dos pais e depois muda para a casa do outro, revezando a moradia — um modelo que costuma ser criticado por instabilizar a rotina do filho. Já na guarda compartilhada, em regra existe uma residência de referência (a casa onde a criança mora no dia a dia), enquanto a responsabilidade pelas decisões é dividida entre os dois. São coisas diferentes."
      },
      { type: "h2", text: "É a regra, mas há exceções" },
      {
        type: "p",
        text: "A lei brasileira estabelece a guarda compartilhada como preferência, aplicando-a sempre que possível, ainda que os pais não cheguem a um acordo sobre isso. A ideia é preservar o vínculo do filho com os dois. Existem, porém, exceções: quando um dos pais declara ao juiz que não deseja a guarda, ou quando o compartilhamento não atende ao melhor interesse da criança — por exemplo, em situações de violência ou de risco. Nesses casos, o juiz pode definir a guarda unilateral."
      },
      { type: "h2", text: "Como ficam a rotina e a moradia" },
      {
        type: "p",
        text: "Na prática, define-se onde a criança terá a residência de referência e como será a convivência com o outro genitor, de forma equilibrada. Isso inclui dias da semana, fins de semana, férias e datas comemorativas. O objetivo é que o filho conviva de verdade com os dois, sem transformar a rotina em uma disputa. Quando os pais moram em cidades diferentes, a convivência é ajustada à distância, sem que isso afaste a responsabilidade conjunta."
      },
      { type: "h2", text: "Ainda existe pensão na guarda compartilhada?" },
      {
        type: "p",
        text: "Sim. Uma confusão muito comum é achar que, na guarda compartilhada, ninguém paga pensão. Não é assim. A obrigação de sustentar o filho continua para os dois, e a pensão serve para equilibrar essa contribuição. O valor leva em conta a necessidade da criança, a renda de cada pai e o tempo que o filho passa com cada um. Ou seja, mesmo dividindo a guarda, pode haver pensão a pagar, especialmente quando há diferença grande de renda entre os pais."
      },
      { type: "h2", text: "Como tomar as decisões juntos" },
      {
        type: "p",
        text: "Na guarda compartilhada, as decisões relevantes da vida do filho passam a ser tomadas em conjunto. Entre elas estão:"
      },
      {
        type: "ul",
        items: [
          "Escolha e troca de escola",
          "Tratamentos de saúde e acompanhamento médico",
          "Viagens, sobretudo para fora do país",
          "Atividades extracurriculares e formação religiosa",
          "Mudança de cidade que afete a convivência"
        ]
      },
      { type: "h3", text: "Plano de convivência" },
      {
        type: "p",
        text: "Vale a pena organizar um plano de convivência (às vezes chamado de plano de parentalidade): um combinado, de preferência por escrito, que descreve como será a rotina, quem leva e busca na escola, como serão as férias e como os pais vão se comunicar sobre o filho. Colocar tudo no papel reduz conflitos e dá previsibilidade para a criança."
      },
      { type: "h2", text: "Quando os pais não se entendem" },
      {
        type: "p",
        text: "A guarda compartilhada não exige que os pais sejam amigos — exige que consigam decidir juntos o essencial sobre o filho. Quando o diálogo trava, a mediação familiar ajuda a construir acordos, e o juiz pode definir os pontos em que não há consenso. Atenção especial merece a alienação parental, que é quando um dos pais tenta afastar o filho do outro: essa conduta é levada a sério pela Justiça e pode influenciar as decisões sobre a guarda e a convivência."
      },
      {
        type: "callout",
        text: "Em qualquer discussão sobre guarda, o critério que orienta a decisão é sempre o melhor interesse da criança e do adolescente — não a vontade ou a conveniência dos pais."
      },
      { type: "h2", text: "Como definir ou mudar a guarda" },
      {
        type: "p",
        text: "A guarda pode ser definida por acordo entre os pais, levado à Justiça para homologação, ou por decisão judicial quando não há consenso. Ela também não é definitiva: se a situação mudar de forma relevante — nova rotina, mudança de cidade, problemas que afetem o filho —, é possível pedir a revisão. O caminho do acordo, quando viável, costuma ser mais rápido e menos desgastante para a criança."
      },
      { type: "h2", text: "Quando procurar ajuda" },
      {
        type: "p",
        text: "Um advogado de família ajuda a redigir o acordo, montar o plano de convivência e conduzir o processo quando não há entendimento. Quem não pode pagar tem direito à Defensoria Pública. Este texto é informativo e não substitui a orientação de um profissional para o seu caso concreto."
      }
    ],
    faq: [
      {
        question: "Guarda compartilhada significa dividir o tempo pela metade?",
        answer:
          "Não. Compartilhar a guarda é dividir a responsabilidade pelas decisões importantes da vida do filho, e não cronometrar dias iguais na casa de cada um. Em regra existe uma residência de referência, onde a criança mora no dia a dia, enquanto a convivência com o outro genitor é organizada de forma equilibrada."
      },
      {
        question: "Na guarda compartilhada ainda se paga pensão?",
        answer:
          "Pode haver, sim. A obrigação de sustentar o filho continua para os dois pais, e a pensão serve para equilibrar essa contribuição conforme a necessidade da criança, a renda de cada um e o tempo que o filho passa com cada pai. Dividir a guarda não elimina automaticamente a pensão."
      },
      {
        question: "Onde a criança mora na guarda compartilhada?",
        answer:
          "Em regra, define-se uma residência de referência, que é a casa onde a criança mora no dia a dia. Isso diferencia a guarda compartilhada da guarda alternada, em que o filho fica revezando a moradia entre as casas dos pais. A convivência com o outro genitor é ajustada em dias, fins de semana e férias."
      },
      {
        question: "Dá para ter guarda compartilhada mesmo os pais brigando?",
        answer:
          "Sim. A guarda compartilhada não exige que os pais sejam amigos, mas que consigam decidir juntos o essencial sobre o filho. Quando o diálogo trava, a mediação e a decisão judicial ajudam. Só em situações que contrariem o interesse da criança, como violência, é que se afasta o compartilhamento."
      },
      {
        question: "Como mudar a guarda depois de definida?",
        answer:
          "A guarda pode ser revista quando a situação muda de forma relevante, como mudança de cidade ou problemas que afetem o filho. O pedido pode ser feito por acordo homologado pela Justiça ou por ação, sempre com foco no melhor interesse da criança."
      }
    ]
  },
  {
    slug: "aposentadoria-por-idade-regras-e-como-pedir",
    title: "Aposentadoria por idade: regras e como pedir ao INSS",
    excerpt:
      "Veja a idade mínima e o tempo de contribuição exigidos, as regras de transição, a diferença entre urbano e rural e o passo a passo para pedir pelo Meu INSS.",
    category: "Previdenciário",
    readingMinutes: 12,
    publishedAt: "2026-07-04",
    author: "Equipe AdvAqui",
    authorRole: "Equipe",
    relatedSpecialty: "previdenciario",
    intro:
      "A aposentadoria por idade é uma das formas mais comuns de se aposentar pelo INSS, mas depois da reforma da Previdência muita gente ficou em dúvida sobre a idade e o tempo de contribuição que hoje são exigidos. Este guia explica, em linguagem simples, os requisitos atuais, as regras de transição para quem já contribuía, as diferenças entre trabalhador urbano e rural e o passo a passo para dar entrada pelo Meu INSS.",
    body: [
      { type: "h2", text: "O que é a aposentadoria por idade" },
      {
        type: "p",
        text: "A aposentadoria por idade é o benefício pago pelo INSS a quem alcança a idade mínima exigida e comprova um tempo mínimo de contribuição. Ela é bastante procurada porque não depende de somar um número muito alto de anos de contribuição, e sim de combinar idade com um tempo mínimo. É o caminho natural para muitos trabalhadores que contribuíram de forma intercalada ao longo da vida."
      },
      { type: "h2", text: "Idade mínima e tempo de contribuição hoje" },
      {
        type: "p",
        text: "Depois da reforma da Previdência (Emenda Constitucional 103/2019), a regra geral para o trabalhador urbano passou a exigir 62 anos de idade para as mulheres e 65 anos para os homens. Além da idade, é preciso ter um tempo mínimo de contribuição, que costuma ser de 15 anos. Há uma diferença importante: para o homem que só passou a contribuir depois da reforma, esse tempo mínimo pode ser maior. Como as regras variam conforme a data em que a pessoa começou a contribuir, o ideal é conferir a sua situação individual antes de pedir."
      },
      { type: "h2", text: "Regras de transição para quem já contribuía" },
      {
        type: "p",
        text: "Quem já contribuía antes da reforma tem direito a regras de transição, pensadas para não prejudicar quem estava perto de se aposentar. Nos primeiros anos após a reforma, a idade mínima das mulheres subiu de forma gradual até chegar ao patamar atual. Por isso, a idade e o tempo exigidos podem variar de pessoa para pessoa, dependendo de quando ela começou a contribuir. Vale checar qual regra é mais vantajosa no seu caso."
      },
      { type: "h2", text: "Trabalhador rural tem regra própria" },
      {
        type: "p",
        text: "O trabalhador rural — incluindo o agricultor familiar, o pescador artesanal e o indígena que trabalham em regime de economia familiar — tem regra mais favorável de idade: costuma ser 55 anos para as mulheres e 60 anos para os homens, com a comprovação de tempo de atividade rural. Essa diferença existe para reconhecer as condições próprias do trabalho no campo."
      },
      { type: "h3", text: "Como comprovar o trabalho rural" },
      {
        type: "p",
        text: "A comprovação da atividade rural costuma ser feita por documentos como notas de produtor, contratos, registros sindicais, declarações e outros papéis que mostrem o trabalho no campo ao longo do tempo. Reunir esse material com antecedência é fundamental, porque a falta de provas é um dos principais motivos de negativa nesse tipo de pedido."
      },
      { type: "h2", text: "Como o valor é calculado" },
      {
        type: "p",
        text: "Depois da reforma, o cálculo passou a considerar a média de praticamente todos os salários de contribuição a partir de julho de 1994. Sobre essa média aplica-se um percentual que, em regra, parte de um piso e vai aumentando conforme o tempo de contribuição. Na prática, quanto mais tempo de contribuição, maior tende a ser o percentual. Por envolver muitos detalhes, o valor exato depende do histórico de cada pessoa, e vale conferir a conta com cuidado."
      },
      { type: "h2", text: "Passo a passo para pedir pelo Meu INSS" },
      {
        type: "ol",
        items: [
          "Reúna os documentos pessoais e as provas de contribuição e, se for o caso, do trabalho rural",
          "Confira o seu CNIS (extrato de contribuições) para ver se todos os períodos estão registrados",
          "Acesse o aplicativo ou o site Meu INSS e entre com a sua conta gov.br",
          "Escolha a opção de pedir aposentadoria por idade (urbana ou rural, conforme o caso)",
          "Anexe os documentos solicitados e revise as informações antes de enviar",
          "Acompanhe o andamento pelo próprio Meu INSS e responda a eventuais exigências no prazo"
        ]
      },
      { type: "h3", text: "Documentos que costumam ser pedidos" },
      {
        type: "ul",
        items: [
          "Documento de identidade com foto e CPF",
          "Comprovante de residência",
          "Carteira de trabalho e outros comprovantes de vínculo e de contribuição",
          "Carnês de contribuição, para quem contribuiu por conta própria",
          "Documentos que comprovem a atividade rural, no caso do trabalhador do campo"
        ]
      },
      {
        type: "callout",
        text: "Antes de pedir, confira o CNIS com atenção. Períodos de trabalho que não aparecem no extrato podem derrubar o tempo de contribuição e levar à negativa ou a um valor menor. Corrigir isso antes do pedido evita dor de cabeça."
      },
      { type: "h2", text: "E se o pedido for negado ou vier em valor baixo?" },
      {
        type: "p",
        text: "Se o INSS negar o benefício ou conceder um valor abaixo do esperado, é possível apresentar recurso administrativo, dirigido às juntas e câmaras de recursos da Previdência, em regra dentro de 30 dias a partir da ciência da decisão. Também é possível levar o caso à Justiça. Em muitos casos, o problema é justamente tempo de contribuição não reconhecido, que pode ser comprovado com documentos adicionais."
      },
      { type: "h2", text: "Aposentadoria por idade e outras aposentadorias" },
      {
        type: "p",
        text: "A aposentadoria por idade não é a única forma de se aposentar. Existem regras que combinam tempo de contribuição com idade ou com um sistema de pontos, além de aposentadorias especiais para quem trabalha exposto a agentes nocivos. Às vezes, esperar um pouco mais ou escolher outra regra resulta em um valor bem diferente. Por isso, comparar os caminhos antes de pedir costuma valer a pena."
      },
      { type: "h2", text: "Quando procurar ajuda" },
      {
        type: "p",
        text: "Um advogado previdenciário pode ajudar a levantar o tempo de contribuição, escolher a melhor regra e a data mais vantajosa para pedir, além de recorrer quando o benefício é negado. Quem não pode pagar tem direito à Defensoria Pública. Este texto é informativo e não substitui a orientação de um profissional para a sua situação concreta."
      }
    ],
    faq: [
      {
        question: "Qual a idade para se aposentar por idade?",
        answer:
          "Pela regra geral do trabalhador urbano após a reforma de 2019, são 62 anos para as mulheres e 65 anos para os homens. O trabalhador rural costuma ter idade menor, em torno de 55 anos para mulheres e 60 para homens. Quem já contribuía antes da reforma pode ter regras de transição, por isso vale conferir a situação individual."
      },
      {
        question: "Quantos anos de contribuição eu preciso?",
        answer:
          "O tempo mínimo de contribuição costuma ser de 15 anos. Há uma diferença: o homem que só começou a contribuir depois da reforma pode precisar de mais tempo. Como as regras dependem de quando a pessoa começou a contribuir, o ideal é checar o seu caso antes de pedir."
      },
      {
        question: "O trabalhador rural se aposenta mais cedo?",
        answer:
          "Sim. O trabalhador rural em regime de economia familiar costuma ter idade mínima menor, em torno de 55 anos para mulheres e 60 anos para homens, com a comprovação do tempo de atividade no campo. Reunir documentos que comprovem esse trabalho é essencial, porque a falta de provas é causa comum de negativa."
      },
      {
        question: "Como peço a aposentadoria por idade?",
        answer:
          "O pedido é feito pelo aplicativo ou site Meu INSS, com login pela conta gov.br. Você escolhe a aposentadoria por idade, anexa os documentos e acompanha o andamento pelo próprio sistema. Antes, confira o CNIS para garantir que todos os períodos de contribuição estão registrados."
      },
      {
        question: "O INSS negou o meu pedido. E agora?",
        answer:
          "Você pode apresentar recurso administrativo, em regra em até 30 dias da ciência da decisão, ou levar o caso à Justiça. Muitas negativas ocorrem por tempo de contribuição não reconhecido, que pode ser comprovado com documentos adicionais. Vale procurar orientação para reunir as provas certas."
      },
      {
        question: "Qual é o valor da aposentadoria por idade?",
        answer:
          "O cálculo considera a média dos salários de contribuição a partir de julho de 1994, com um percentual que aumenta conforme o tempo de contribuição. O valor exato depende do histórico de cada pessoa, então vale conferir a conta com cuidado. Não existe um valor único para todos."
      }
    ]
  },
  {
    slug: "seguro-de-vida-negado-como-recorrer",
    title: "Seguro de vida negado: como recorrer da recusa da seguradora",
    excerpt:
      "Seguro de vida negado nem sempre é recusa legítima. Veja os motivos comuns, o que a lei diz sobre doença preexistente e suicídio e o passo a passo para contestar.",
    category: "Consumidor",
    readingMinutes: 11,
    publishedAt: "2026-07-04",
    author: "Equipe AdvAqui",
    authorRole: "Equipe",
    relatedSpecialty: "civil",
    intro:
      "Ter o seguro de vida negado é uma frustração dupla: além da perda que motivou o pedido, vem a recusa de quem deveria amparar a família. A boa notícia é que nem toda negativa é legítima, e muitas caem quando a seguradora não consegue justificar o motivo. Este guia explica, em linguagem simples, por que os seguros de vida costumam ser negados, o que a lei e a jurisprudência dizem sobre doença preexistente e suicídio, e o passo a passo para contestar a recusa primeiro pela via administrativa e, se preciso, na Justiça.",
    body: [
      { type: "h2", text: "O que significa ter o seguro de vida negado" },
      {
        type: "p",
        text: "O seguro de vida negado é a recusa da seguradora em pagar a indenização prevista na apólice quando ocorre o evento coberto — a morte do segurado, uma invalidez ou uma doença grave, conforme o contrato. Em vez de liberar o valor ao beneficiário ou ao próprio segurado, a empresa comunica que não vai pagar, geralmente apontando algum motivo ligado ao contrato ou às informações prestadas na contratação."
      },
      {
        type: "p",
        text: "Receber essa negativa não quer dizer que o direito acabou. A recusa é apenas a posição da seguradora, e ela precisa ser fundamentada. Se o motivo não se sustenta diante da lei e das provas, é possível reverter a decisão e receber a indenização, com correção e juros."
      },
      { type: "h2", text: "Os motivos mais comuns de recusa" },
      {
        type: "p",
        text: "Antes de contestar, é importante entender qual foi o motivo alegado, porque a estratégia muda conforme a justificativa. Os motivos que mais aparecem são estes:"
      },
      {
        type: "ul",
        items: [
          "Alegação de doença preexistente que não teria sido informada na contratação",
          "Suicídio do segurado, quando a seguradora sustenta que o caso não é coberto",
          "Falta de pagamento do prêmio (a mensalidade do seguro)",
          "Afirmação de que o evento não estava entre as coberturas contratadas",
          "Alegação de informação incorreta ou omissão relevante na proposta"
        ]
      },
      { type: "h3", text: "Doença preexistente não informada" },
      {
        type: "p",
        text: "Este é um dos motivos mais frequentes e também um dos mais contestáveis. O STJ firmou o entendimento de que a seguradora não pode negar o pagamento alegando doença anterior à contratação se ela não exigiu exames médicos antes de fechar o contrato e não comprovou que o segurado agiu de má-fé, escondendo de propósito uma condição que sabia ter. Em outras palavras, quem aceitou o cliente sem pedir exame assumiu esse risco e não pode, depois, usar a doença como desculpa para não pagar."
      },
      { type: "h3", text: "Suicídio do segurado" },
      {
        type: "p",
        text: "O Código Civil traz uma regra clara: passados dois anos do início da vigência do seguro (ou de sua recondução após suspensão), a indenização por suicídio é devida (art. 798). Ou seja, depois desse prazo, a seguradora não pode negar o pagamento com esse argumento. Dentro dos dois primeiros anos, a discussão é mais delicada, mas a jurisprudência não presume a premeditação: cabe à seguradora demonstrar que houve fraude, e não ao beneficiário provar que não houve."
      },
      { type: "h3", text: "Falta de pagamento e coberturas" },
      {
        type: "p",
        text: "A seguradora pode alegar atraso no pagamento do prêmio, mas o simples atraso de uma parcela nem sempre autoriza o cancelamento automático: em regra, é preciso que o segurado tenha sido notificado antes. Já quando o motivo é a cobertura, vale ler a apólice com atenção — às vezes o evento realmente não estava contratado, mas em outras a recusa se apoia em cláusula confusa, que deve ser interpretada em favor do consumidor."
      },
      {
        type: "callout",
        text: "Assim que receber a negativa, guarde tudo: a apólice, o comprovante de pagamento das parcelas, a carta ou mensagem com o motivo da recusa e os documentos médicos. Esses papéis são a base de qualquer contestação."
      },
      { type: "h2", text: "O que a lei garante ao segurado e aos beneficiários" },
      {
        type: "p",
        text: "O contrato de seguro é regido pelo Código Civil (arts. 757 e seguintes), que define a obrigação da seguradora de garantir o interesse do segurado contra riscos predeterminados. Quando o segurado é uma pessoa comum que aderiu a um plano padronizado, aplica-se também o Código de Defesa do Consumidor. Isso traz duas consequências importantes: a seguradora deve prestar informação clara sobre coberturas e exclusões, e as cláusulas dúbias são interpretadas da forma mais favorável a quem contratou."
      },
      {
        type: "p",
        text: "Outro ponto relevante é o dever de motivar a recusa. O beneficiário tem direito de saber, por escrito, exatamente por que o pagamento foi negado. Uma negativa genérica, sem explicar o fundamento, já é, por si só, um sinal de fragilidade da posição da seguradora."
      },
      { type: "h2", text: "Passo a passo para contestar a recusa" },
      {
        type: "ol",
        items: [
          "Peça a negativa por escrito, com o motivo detalhado e a cláusula em que a seguradora se baseia",
          "Releia a apólice e as condições gerais, conferindo coberturas, exclusões e carências",
          "Reúna os documentos do evento (certidão de óbito, laudos, relatórios médicos) e os comprovantes de pagamento",
          "Apresente reclamação formal à própria seguradora (SAC e ouvidoria), exigindo a revisão da negativa",
          "Se não resolver, registre reclamação nos canais de defesa do consumidor e na SUSEP",
          "Persistindo a recusa, procure orientação jurídica para avaliar a ação judicial"
        ]
      },
      { type: "h3", text: "Documentos que costumam ser necessários" },
      {
        type: "ul",
        items: [
          "Apólice do seguro e as condições gerais do contrato",
          "Comprovantes de pagamento das parcelas (prêmio)",
          "Documento que comprove o evento coberto (certidão de óbito, laudo de invalidez)",
          "Relatórios e prontuários médicos, quando o motivo envolve saúde",
          "A comunicação da recusa e todos os protocolos de atendimento"
        ]
      },
      { type: "h2", text: "Reclamar na SUSEP e nos órgãos de defesa do consumidor" },
      {
        type: "p",
        text: "Antes de partir para a Justiça, vale usar os canais administrativos. A SUSEP é o órgão que fiscaliza o mercado de seguros e recebe reclamações contra seguradoras. Também é possível registrar o caso no Procon e na plataforma consumidor.gov.br. Esses caminhos são gratuitos, pressionam a empresa a rever a negativa e, mesmo quando não resolvem sozinhos, geram um histórico que ajuda em uma eventual ação."
      },
      { type: "h2", text: "Quando levar o caso à Justiça" },
      {
        type: "p",
        text: "Se a via administrativa não resolver, o beneficiário pode ajuizar ação de cobrança da indenização. Nesse processo, discute-se se o motivo da recusa se sustenta e, muitas vezes, a seguradora não consegue provar a fraude ou a exclusão que alegou. Além do valor da apólice, atualizado e com juros, é possível pedir indenização por dano moral quando a recusa indevida causou sofrimento que vai além do mero aborrecimento — por exemplo, quando a família ficou desamparada em um momento crítico."
      },
      { type: "h3", text: "Dano moral pela recusa indevida" },
      {
        type: "p",
        text: "Nem toda negativa gera dano moral automático. A Justiça costuma reconhecê-lo quando a recusa é claramente indevida e traz consequências pesadas para quem contava com o valor. Cada caso é avaliado individualmente, considerando a gravidade da situação e a conduta da seguradora."
      },
      { type: "h2", text: "Fique atento aos prazos" },
      {
        type: "p",
        text: "O prazo para acionar a seguradora é curto e não convém demorar. Em muitos casos envolvendo seguro, esse prazo é de um ano, contado, em regra, da ciência inequívoca da recusa. Como a contagem depende do tipo de cobertura e da situação concreta, confirme o prazo aplicável ao seu caso o quanto antes, para não perder o direito por decurso de tempo."
      },
      { type: "h2", text: "Quando procurar ajuda" },
      {
        type: "p",
        text: "Um advogado pode analisar a apólice, o motivo da recusa e as provas para dizer se a negativa é frágil e qual o melhor caminho — administrativo ou judicial. Quem não pode pagar tem direito à Defensoria Pública. Este texto é informativo e não substitui a orientação de um profissional para a sua situação concreta."
      }
    ],
    faq: [
      {
        question: "A seguradora pode negar o seguro por doença preexistente?",
        answer:
          "Só em situações específicas. O STJ entende que a seguradora não pode recusar o pagamento alegando doença anterior se não exigiu exames médicos na contratação e não comprovou má-fé do segurado. Quem aceitou o cliente sem pedir exame assumiu esse risco."
      },
      {
        question: "O seguro de vida paga em caso de suicídio?",
        answer:
          "Sim, se o suicídio ocorrer depois de dois anos do início do contrato, conforme o art. 798 do Código Civil. Dentro dos dois primeiros anos, a seguradora só pode negar se provar premeditação, o que não se presume."
      },
      {
        question: "A seguradora precisa explicar por que negou?",
        answer:
          "Sim. O beneficiário tem direito de receber, por escrito, o motivo da recusa e a cláusula em que ela se baseia. Uma negativa genérica, sem fundamento claro, já é um indício da fragilidade da posição da empresa."
      },
      {
        question: "Onde posso reclamar antes de ir à Justiça?",
        answer:
          "Você pode reclamar na própria seguradora (SAC e ouvidoria), na SUSEP, que fiscaliza o setor, no Procon e na plataforma consumidor.gov.br. São canais gratuitos que pressionam a revisão e geram histórico útil para uma eventual ação."
      },
      {
        question: "Tenho direito a indenização por dano moral pela recusa?",
        answer:
          "Pode ter, quando a recusa é claramente indevida e traz consequências graves, como deixar a família desamparada. Não é automático: cada caso é avaliado conforme a gravidade da situação e a conduta da seguradora."
      },
      {
        question: "Qual é o prazo para acionar a seguradora?",
        answer:
          "O prazo costuma ser curto, de um ano em muitos casos de seguro, contado em regra da ciência da recusa. Como varia conforme a cobertura e a situação, confirme o prazo do seu caso o quanto antes para não perder o direito."
      }
    ]
  },
  {
    slug: "revisao-de-financiamento-de-veiculo-vale-a-pena",
    title: "Revisão de financiamento de veículo vale a pena? Como funciona",
    excerpt:
      "Revisão de financiamento de veículo pode reduzir juros e tarifas indevidas, mas não é milagre. Veja quando compensa, o que dá para questionar e o passo a passo.",
    category: "Consumidor",
    readingMinutes: 11,
    publishedAt: "2026-07-04",
    author: "Equipe AdvAqui",
    authorRole: "Equipe",
    relatedSpecialty: "civil",
    intro:
      "A revisão de financiamento de veículo é um caminho para questionar juros e tarifas que o consumidor considera abusivos no contrato do carro ou da moto e, com isso, tentar reduzir o valor das parcelas e do saldo devedor. Mas ela não é uma solução mágica: só compensa quando há cobrança realmente fora do padrão, e depende de prova. Este guia explica, em linguagem simples, o que pode ser revisto, o mito dos juros de 12% ao ano, quando a revisão tende a valer a pena e o passo a passo para buscá-la com os pés no chão.",
    body: [
      { type: "h2", text: "O que é a revisão de financiamento de veículo" },
      {
        type: "p",
        text: "A revisão de financiamento de veículo é o pedido para reexaminar as cláusulas do contrato de financiamento — em regra por ação judicial, a chamada ação revisional — quando o consumidor entende que há encargos indevidos. O objetivo é ajustar o contrato ao que seria efetivamente devido, recalculando juros, tarifas e o saldo, o que pode diminuir a parcela ou o total a pagar."
      },
      {
        type: "p",
        text: "É importante começar por uma expectativa realista: a revisão não apaga a dívida nem garante, sozinha, uma parcela muito menor. Ela serve para corrigir abusos concretos. Onde não há abuso, não há o que revisar, e insistir pode gerar custo sem retorno."
      },
      { type: "h2", text: "Quando a revisão pode valer a pena" },
      {
        type: "p",
        text: "A revisão tende a fazer sentido quando há sinais concretos de cobrança fora do padrão. Vale investigar principalmente nestas situações:"
      },
      {
        type: "ul",
        items: [
          "A taxa de juros do contrato está bem acima da média que o mercado praticava na época",
          "Existem tarifas embutidas sem explicação clara ou sem previsão no contrato",
          "Há seguros e serviços que você não pediu e foram incluídos no financiamento",
          "A parcela cresceu de forma que não bate com o que foi combinado",
          "Você está com dificuldade de pagar e quer entender se há espaço para reduzir o valor"
        ]
      },
      { type: "h2", text: "O mito dos juros de 12% ao ano" },
      {
        type: "p",
        text: "Circula muito a ideia de que juro acima de 12% ao ano é sempre ilegal. Isso não é verdade para financiamentos. O antigo limite de 12% ao ano não se aplica às instituições financeiras, que não estão presas a esse teto. Por isso, uma taxa alta, sozinha, não prova abuso."
      },
      {
        type: "p",
        text: "O que a jurisprudência do STJ diz é que os juros só podem ser considerados abusivos, e reduzidos, quando destoam de forma significativa da taxa média de mercado da época do contrato, divulgada pelo Banco Central. É essa comparação — e não um número fixo — que define se há exagero."
      },
      { type: "h3", text: "Como saber se os juros estão acima da média" },
      {
        type: "p",
        text: "O Banco Central divulga as taxas médias de juros por tipo de operação e por instituição. Dá para comparar a taxa do seu contrato com a média praticada para financiamento de veículos no período em que você assinou. Se a diferença for grande, há um bom argumento para a revisão; se estiver próxima da média, a chance de reduzir os juros é pequena."
      },
      { type: "h2", text: "O que costuma ser questionado no contrato" },
      {
        type: "p",
        text: "Além dos juros, alguns pontos aparecem com frequência nas revisões:"
      },
      {
        type: "ul",
        items: [
          "Capitalização de juros (juros sobre juros) cobrada fora das regras",
          "Tarifas administrativas e de cadastro sem previsão clara",
          "Seguros e serviços de terceiros embutidos sem escolha do consumidor",
          "Comissão de permanência cumulada com outros encargos na inadimplência",
          "Diferença entre o Custo Efetivo Total informado e o que foi realmente cobrado"
        ]
      },
      { type: "h3", text: "Capitalização de juros (juros sobre juros)" },
      {
        type: "p",
        text: "A cobrança de juros sobre juros não é proibida por si só: o STJ admite a capitalização quando ela está expressamente prevista e é possível identificá-la no contrato. O que se discute é a capitalização feita de forma escondida ou sem previsão. Por isso, esse ponto exige leitura atenta das cláusulas e, muitas vezes, um cálculo técnico."
      },
      { type: "h3", text: "Tarifas e seguros embutidos" },
      {
        type: "p",
        text: "Algumas tarifas são admitidas, como a de cadastro no início do relacionamento. Já a cobrança de serviços de terceiros e de seguros que o consumidor não escolheu costuma ser questionável, especialmente quando não houve informação clara nem opção de recusar. Somadas ao longo do contrato, essas cobranças fazem diferença no total."
      },
      {
        type: "callout",
        text: "Revisão depende de prova. Sem comparar a taxa com a média do Banco Central e sem apontar a cobrança indevida no contrato, o pedido tende a não prosperar. Reúna o contrato, os extratos e os comprovantes antes de decidir."
      },
      { type: "h2", text: "Revisão não suspende a busca e apreensão sozinha" },
      {
        type: "p",
        text: "Um cuidado importante: entrar com a revisão não faz, automaticamente, o banco parar de cobrar nem suspende uma eventual busca e apreensão por falta de pagamento, que segue as regras do Decreto-Lei 911/1969. Continuar em atraso enquanto discute o contrato é arriscado. Em alguns casos, é possível pedir ao juiz medidas para permitir o depósito dos valores que o consumidor entende corretos enquanto o processo corre, mas isso depende de decisão judicial."
      },
      { type: "h2", text: "Passo a passo para pedir a revisão" },
      {
        type: "ol",
        items: [
          "Junte o contrato, o carnê ou boletos e os extratos de pagamento",
          "Anote a taxa de juros contratada e compare com a média do Banco Central da época",
          "Liste as tarifas e seguros cobrados e verifique quais você não pediu",
          "Peça ao banco, por escrito, a planilha de evolução da dívida e a revisão amigável",
          "Se não resolver, procure um advogado ou a Defensoria para avaliar a ação revisional",
          "Mantenha o pagamento em dia ou negocie para não sofrer busca e apreensão durante a discussão"
        ]
      },
      { type: "h2", text: "Renegociar ou fazer portabilidade antes de revisar" },
      {
        type: "p",
        text: "Nem sempre a Justiça é o melhor primeiro passo. Se o problema é a parcela alta, duas alternativas costumam ser mais rápidas: renegociar diretamente com o banco e a portabilidade da dívida, que é o direito de transferir o financiamento para outra instituição com juros menores, sem tarifa e sem que o banco atual possa impedir. Comparar o Custo Efetivo Total das propostas pode resolver o aperto no orçamento sem processo."
      },
      { type: "h2", text: "Cuidado com promessas de revisão milagrosa" },
      {
        type: "p",
        text: "Desconfie de quem promete zerar a dívida, reduzir a parcela pela metade de forma garantida ou tirar seu nome dos cadastros do dia para a noite. A revisão depende de análise do contrato e de decisão da Justiça, e ninguém pode assegurar resultado. Ofertas assim, muitas vezes com pagamento adiantado, costumam ser cilada. Uma avaliação séria começa pela leitura do contrato e pela comparação de taxas, não por promessas."
      },
      { type: "h2", text: "Quando procurar ajuda" },
      {
        type: "p",
        text: "Um advogado pode analisar o contrato, fazer o cálculo comparativo e dizer, com franqueza, se a revisão tende a compensar no seu caso ou se renegociar e portar a dívida resolve melhor. Quem não pode pagar tem direito à Defensoria Pública. Este texto é informativo e não substitui a orientação de um profissional para a sua situação concreta."
      }
    ],
    faq: [
      {
        question: "Juros acima de 12% ao ano são abusivos?",
        answer:
          "Não necessariamente. Esse limite não se aplica aos bancos. O STJ entende que os juros só são abusivos quando destoam muito da taxa média de mercado da época, divulgada pelo Banco Central. É a comparação com a média que define o exagero, não um número fixo."
      },
      {
        question: "A revisão sempre diminui a parcela?",
        answer:
          "Não. A revisão só reduz o valor quando há cobrança realmente indevida, como juros muito acima da média ou tarifas sem previsão. Se o contrato está dentro do padrão, pode não haver o que reduzir, e o pedido tende a não prosperar."
      },
      {
        question: "Posso pedir revisão com o financiamento em dia?",
        answer:
          "Sim. Não é preciso estar inadimplente para pedir revisão. Aliás, manter o pagamento em dia é recomendável, porque a revisão não suspende sozinha a cobrança nem eventual busca e apreensão durante o processo."
      },
      {
        question: "A revisão para a busca e apreensão do carro?",
        answer:
          "Não automaticamente. A busca e apreensão segue o Decreto-Lei 911/1969 e continua possível mesmo com a ação em curso. Em alguns casos, o juiz pode autorizar o depósito dos valores que o consumidor entende corretos, mas isso depende de decisão judicial."
      },
      {
        question: "É melhor revisar ou fazer portabilidade da dívida?",
        answer:
          "Depende do caso. Se o problema é só a parcela alta, renegociar ou portar a dívida para um banco com juros menores costuma ser mais rápido que um processo. A revisão faz mais sentido quando há cobrança abusiva concreta a ser corrigida."
      },
      {
        question: "Preciso de advogado para pedir a revisão?",
        answer:
          "A ação revisional é ajuizada por advogado ou pela Defensoria Pública. Antes disso, você pode tentar a revisão amigável e a renegociação diretamente com o banco, o que não exige advogado e pode resolver mais rápido."
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

/* ───────────────────────────────────────────────────────────────────────────
 * Artigos do banco de dados (Supabase — tabela blog_articles)
 *
 * getArticlesFromDB() busca artigos publicados do Supabase e os mapeia para
 * o tipo Article, combinando com os artigos seed. Usado na listagem /blog
 * para exibir artigos gerados pelo robo de conteudo junto com os seed.
 * ─────────────────────────────────────────────────────────────────────────── */

/** Tipo da linha crua retornada pelo Supabase (blog_articles). */
type BlogArticleRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  body: string;
  reading_minutes: number;
  author: string;
  author_id: string | null;
  author_name: string | null;
  meta_description: string | null;
  published_at: string | null;
  created_at: string;
  status: string;
  seo_keywords: string[] | null;
};

/**
 * Converte HTML plano do banco para array de ArticleSection.
 *
 * O corpo salvo no banco e HTML puro (<h2>, <h3>, <p>, <ul>, <ol>).
 * O renderer do blog espera ArticleSection[]. Esta funcao faz a ponte.
 * Para artigos do banco, usamos um unico section { type: "html" } que
 * o renderer trata como bloco HTML direto.
 */
function htmlToSections(html: string): ArticleSection[] {
  // Retorna como um bloco "p" com HTML cru.
  // O renderer do [slug]/page.tsx renderiza com dangerouslySetInnerHTML
  // quando recebe source = "db".
  return [{ type: "p", text: html }];
}

/**
 * Busca artigos publicados do Supabase (tabela blog_articles).
 *
 * Retorna artigos do banco mapeados para Article, combinados com artigos
 * seed (seed primeiro). Usado no /blog para listagem unificada.
 *
 * NOTA: como esta funcao faz I/O (fetch ao Supabase), deve ser chamada
 * em contexto async (Server Component ou Route Handler).
 */
export async function getArticlesFromDB(options?: {
  limit?: number;
  offset?: number;
  category?: string;
}): Promise<{ articles: Article[]; total: number; hasMore: boolean }> {
  // Import dinamico para evitar erro em contextos client-side
  const { createAdminClient } = await import("@/lib/supabase/admin");

  const supabase = createAdminClient();
  const limit = options?.limit ?? 20;
  const offset = options?.offset ?? 0;

  // Query com contagem
  let query = supabase
    .from("blog_articles")
    .select("*", { count: "exact" })
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (options?.category) {
    query = query.eq("category", options.category);
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error || !data) {
    console.error("[getArticlesFromDB] Supabase error:", error?.message);
    // Retorna apenas seed articles como fallback
    const seed = getAllArticles();
    return { articles: seed, total: seed.length, hasMore: false };
  }

  const dbArticles: Article[] = (data as BlogArticleRow[]).map((row) => ({
    slug: row.slug,
    title: row.title,
    excerpt: row.meta_description || row.excerpt,
    category: row.category,
    readingMinutes: row.reading_minutes || 5,
    publishedAt: row.published_at
      ? row.published_at.split("T")[0]
      : row.created_at.split("T")[0],
    author: row.author_name || row.author || "Equipe AdvAqui",
    authorRole: row.author_id ? ("Advogado Premium" as const) : ("Equipe" as const),
    intro: row.meta_description || row.excerpt,
    body: htmlToSections(row.body),
    faq: [],
    _source: "db" as const
  })) as Article[];

  // Seed articles vem primeiro, depois os do banco
  const seedArticles = offset === 0 ? getAllArticles() : [];
  const combined = [...seedArticles, ...dbArticles];
  const total = (count || 0) + (offset === 0 ? ARTICLES.length : 0);

  return {
    articles: combined,
    total,
    hasMore: offset + limit < (count || 0)
  };
}
