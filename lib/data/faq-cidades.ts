/**
 * faq-cidades — banco DETERMINÍSTICO de perguntas frequentes de leigo para as
 * páginas de cidade (/advogados/[uf]/[cidade]) e, parcialmente, de
 * especialidade (/advogados/[uf]/[cidade]/[especialidade]).
 *
 * Cada pergunta tem 4–5 variantes de resposta. A variante exibida é escolhida
 * por hash(citySlug + chave da pergunta) % n — estável entre renders e entre
 * deploys (nenhuma aleatoriedade, nenhuma chamada externa), mas diferente
 * entre cidades, o que evita texto idêntico em milhares de URLs.
 *
 * Compliance OAB: sem valores prometidos, sem promessa de resultado, sem
 * superlativo. A resposta de custo aponta a tabela de honorários da OAB da
 * seccional apenas como REFERÊNCIA e manda combinar direto com o profissional.
 */

export type CityFaqContext = {
  cityName: string;
  uf: string;
  citySlug: string;
  /**
   * Semente opcional para a escolha da variante (padrão: citySlug). Páginas
   * irmãs (ex.: especialidade) podem passar `${citySlug}/${especialidade}`
   * para exibir outra variante da mesma resposta — determinístico igual,
   * mas sem repetir o texto exato da página de cidade.
   */
  variantSeed?: string;
};

export type FaqEntry = { q: string; a: string };

export type CityFaqKey =
  | "quanto-custa"
  | "propria-cidade"
  | "primeira-conversa"
  | "registro-oab"
  | "advaqui-gratuito";

/** Hash simples e estável (djb2 xor, unsigned 32 bits). Sem dependências. */
export function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  }
  return h >>> 0;
}

type AnswerTemplate = (city: string, uf: string) => string;

type QuestionDef = {
  key: CityFaqKey;
  question: (city: string, uf: string) => string;
  answers: AnswerTemplate[];
};

const QUESTIONS: QuestionDef[] = [
  {
    key: "quanto-custa",
    question: (city) => `Quanto custa um advogado em ${city}?`,
    answers: [
      (city, uf) =>
        `Não existe um preço fixo. Os honorários em ${city} variam conforme a área, a complexidade do caso e a experiência do profissional. A tabela de honorários da OAB/${uf} serve como referência de valores mínimos, mas o valor final é sempre combinado diretamente com o advogado. Muitos profissionais trabalham com formas de pagamento diferentes — valor fechado por serviço, cobrança por hora ou percentual sobre o resultado (honorários de êxito). Pergunte sobre valores e formas de pagamento logo na primeira conversa, antes de fechar a contratação.`,
      (city, uf) =>
        `O custo depende do tipo de serviço: uma consulta simples tem um valor, uma ação judicial completa tem outro. Em ${city}, como em todo o estado, a tabela da OAB/${uf} funciona como referência de valores mínimos por tipo de atuação. O preço real, porém, é definido em acordo direto entre você e o advogado, e pode considerar a urgência, a duração estimada do processo e a forma de pagamento. Vale conversar com mais de um profissional e pedir a proposta por escrito antes de decidir.`,
      (city, uf) =>
        `Honorários advocatícios não têm valor único tabelado — cada advogado de ${city} define os próprios preços, tendo como referência os mínimos sugeridos pela tabela de honorários da OAB/${uf}. Casos simples, como uma consulta ou a análise de um contrato, costumam custar menos do que ações judiciais longas. Alguns profissionais aceitam parcelar; outros trabalham com percentual sobre o resultado ao final (êxito). O importante é deixar tudo combinado por escrito no contrato de honorários antes de começar.`,
      (city, uf) =>
        `Varia bastante. O valor cobrado por um advogado em ${city} depende da área do direito, do tempo que o caso deve durar e do trabalho envolvido. A OAB/${uf} publica uma tabela de honorários que serve de referência para os valores mínimos, e você pode consultá-la no site da seccional. Na prática, o preço é negociado diretamente com o profissional. Pergunte se há cobrança pela primeira consulta, quais são as formas de pagamento e o que está incluído no valor.`,
      (city, uf) =>
        `Cada caso tem um preço, e ele é definido em conversa direta com o advogado. Em ${city}, os profissionais costumam usar a tabela de honorários da OAB/${uf} como referência de piso, mas fatores como complexidade, urgência e tempo estimado do processo influenciam o valor final. Formas comuns de cobrança: valor fechado pelo serviço, mensalidade, hora trabalhada ou percentual do resultado. Antes de contratar, peça um contrato de honorários por escrito com tudo detalhado.`
    ]
  },
  {
    key: "propria-cidade",
    question: () => `Preciso contratar advogado da minha própria cidade?`,
    answers: [
      (city) =>
        `Não é obrigatório. Advogados inscritos na OAB podem atuar em todo o Brasil, então um profissional de outra cidade pode cuidar do seu caso em ${city}. Na prática, contratar alguém local costuma facilitar: ele conhece o fórum da comarca, os cartórios e a rotina da Justiça da região, e as reuniões presenciais ficam mais simples. Com o processo eletrônico, porém, muita coisa se resolve a distância — audiências por videoconferência e documentos digitais são cada vez mais comuns.`,
      (city) =>
        `Não. A inscrição na OAB vale para atuação em todo o território nacional, e o processo eletrônico permite que advogados acompanhem casos a distância. Ainda assim, para causas que tramitam na comarca de ${city}, um profissional da própria cidade ou da região pode ter vantagens práticas: proximidade para reuniões, familiaridade com o fórum local e facilidade para diligências presenciais. Avalie o que pesa mais no seu caso — a experiência na área específica ou a proximidade física.`,
      (city) =>
        `Você pode contratar advogado de qualquer cidade do país. O que costuma orientar a escolha é o tipo de caso: se ele exige idas frequentes ao fórum de ${city} ou reuniões presenciais, um profissional local tende a ser mais prático. Se o caso é de uma área muito específica e não há profissional dessa área por perto, um advogado de outra cidade pode atender a distância, já que os processos hoje são majoritariamente eletrônicos e as audiências por videoconferência são comuns.`,
      (city) =>
        `Não precisa. Qualquer advogado com inscrição ativa na OAB pode representar você, esteja ele em ${city} ou em outro município. Muitos profissionais de cidades vizinhas atendem clientes de toda a região. A vantagem de um advogado local é o conhecimento da comarca e a facilidade de contato pessoal; a vantagem de ampliar a busca é encontrar quem atue com mais frequência na sua área. Os dois caminhos funcionam — escolha pelo perfil do profissional, não só pelo endereço.`
    ]
  },
  {
    key: "primeira-conversa",
    question: () => `Como funciona a primeira conversa com o advogado?`,
    answers: [
      (city) =>
        `A primeira conversa serve para o advogado entender o seu caso e para você conhecer o profissional. Em ${city}, ela pode acontecer no escritório, por telefone ou por videochamada, conforme o combinado. Leve ou tenha em mãos os documentos relacionados ao problema — contratos, comprovantes, mensagens, notificações. O advogado vai fazer perguntas, avaliar se existe um caminho jurídico e explicar as opções. Aproveite para perguntar sobre honorários, prazos e forma de acompanhamento. Alguns profissionais cobram por essa consulta; confirme antes de agendar.`,
      (city) =>
        `Costuma ser uma reunião de avaliação: você conta o problema, mostra os documentos e o advogado indica os caminhos possíveis. Não existe compromisso automático — você só contrata se quiser. Muitos profissionais de ${city} fazem essa primeira conversa por WhatsApp ou videochamada, o que agiliza. Prepare um resumo dos fatos em ordem cronológica, separe as provas e anote suas dúvidas. Pergunte também sobre custos, riscos e duração estimada. Se a consulta for cobrada, o valor deve ser informado antes.`,
      (city) =>
        `Funciona como uma triagem do seu caso. O advogado ouve o que aconteceu, analisa os documentos que você apresentar e diz se há fundamento para agir — e como. Em ${city}, o formato varia: presencial no escritório, por telefone ou on-line. Antes da conversa, reúna tudo o que tiver sobre o problema (contratos, recibos, capturas de tela, notificações) e monte uma linha do tempo dos fatos. Ao final, se decidir contratar, o combinado deve ser formalizado em um contrato de honorários por escrito.`,
      (city) =>
        `É o momento de expor o problema e receber uma primeira orientação. O advogado avalia os fatos, verifica prazos e explica as alternativas — acordo, reclamação administrativa ou ação judicial, por exemplo. A conversa pode ser presencial em ${city} ou a distância, e ter ou não custo, dependendo do profissional; pergunte antes de agendar. Para aproveitar melhor, leve os documentos organizados e seja objetivo sobre o que você espera. Você não é obrigado a fechar contrato nessa hora — pode comparar com outros profissionais.`
    ]
  },
  {
    key: "registro-oab",
    question: () => `Como sei se o advogado é registrado na OAB?`,
    answers: [
      (city, uf) =>
        `Consulte o Cadastro Nacional dos Advogados, no site cna.oab.org.br — é gratuito e aberto a qualquer pessoa. Basta digitar o nome ou o número de inscrição do profissional e verificar se a situação aparece como regular. Todo advogado que atua em ${city} precisa ter inscrição ativa na OAB, e o número costuma aparecer no formato "OAB/${uf}" seguido da numeração. Nos perfis do AdvAqui, o número da OAB é exibido justamente para facilitar essa conferência antes do contato.`,
      (city, uf) =>
        `A checagem é simples: acesse a Consulta Pública da OAB (cna.oab.org.br), pesquise pelo nome ou pelo número de inscrição e confira se o registro está ativo e regular. Desconfie de quem se apresenta como advogado em ${city} mas não informa o número da OAB — exercer a advocacia sem inscrição é ilegal. Você também pode confirmar diretamente na seccional da OAB/${uf}. No AdvAqui, cada perfil mostra o número de inscrição informado pelo profissional para facilitar a verificação.`,
      (city, uf) =>
        `Peça o número da OAB e confira no Cadastro Nacional dos Advogados (cna.oab.org.br), mantido pelo Conselho Federal da OAB. A consulta mostra nome, seccional e situação da inscrição. Um advogado que atende em ${city} pode ser inscrito na OAB/${uf} ou em outra seccional — o que importa é a inscrição estar ativa e regular. Faça essa conferência antes de assinar contrato ou fazer qualquer pagamento; um profissional sério não se incomoda com a verificação.`,
      (city, uf) =>
        `Todo advogado tem um número de inscrição público, e você pode conferi-lo em cna.oab.org.br, o cadastro oficial da OAB. A busca funciona por nome ou por número e informa se a inscrição está regular. Se estiver contratando alguém em ${city}, também é possível tirar dúvidas na subseção local da OAB/${uf}. Adote essa checagem como regra: verifique a OAB antes de entregar documentos ou pagar honorários a qualquer pessoa que se apresente como advogado.`
    ]
  },
  {
    key: "advaqui-gratuito",
    question: () => `O AdvAqui cobra algo de quem procura advogado?`,
    answers: [
      (city) =>
        `Não. Para quem procura advogado em ${city}, o AdvAqui é gratuito: você navega pelos perfis, compara áreas de atuação e fala direto com o profissional, sem pagar nada e sem intermediário. Não há comissão sobre o contato nem sobre o serviço contratado. Os honorários, quando você decidir contratar, são combinados diretamente com o advogado escolhido — o AdvAqui não participa dessa negociação nem recebe parte do valor.`,
      (city) =>
        `Não cobra nada. O uso do diretório é gratuito para quem busca advogado: pesquisar profissionais em ${city}, ver os perfis com número da OAB e entrar em contato pelo WhatsApp não tem custo algum. O AdvAqui também não fica com comissão nem interfere no valor dos honorários — a conversa e a contratação acontecem diretamente entre você e o advogado. A plataforma se mantém com planos opcionais de destaque contratados pelos próprios advogados.`,
      (city) =>
        `Não. Buscar advogado em ${city} pelo AdvAqui é gratuito do início ao fim: a pesquisa, a visualização dos perfis e o contato direto com o profissional não custam nada, e não é preciso criar conta para buscar. Não existe taxa de intermediação nem comissão embutida. O que você eventualmente pagar são os honorários do advogado, combinados entre vocês. A receita do AdvAqui vem de planos de destaque que alguns advogados contratam para aparecer no topo das páginas — sem custo para quem procura.`,
      (city) =>
        `Nada. O AdvAqui funciona como um diretório aberto: quem procura advogado em ${city} acessa os perfis, confere o número da OAB e chama o profissional direto no WhatsApp, gratuitamente. Não cobramos taxa de quem busca e não recebemos comissão sobre contratações. O acerto de honorários é feito exclusivamente entre você e o advogado. Para os advogados existem planos pagos opcionais de destaque — é assim que a plataforma se sustenta, sem custo para o público.`
    ]
  }
];

function buildEntry(def: QuestionDef, ctx: CityFaqContext): FaqEntry {
  // Semente = citySlug (ou variantSeed) + chave da pergunta: estável por
  // cidade, mas evita que todas as perguntas caiam sempre no mesmo índice.
  const seed = ctx.variantSeed ?? ctx.citySlug;
  const idx = hashString(`${seed}:${def.key}`) % def.answers.length;
  return {
    q: def.question(ctx.cityName, ctx.uf),
    a: def.answers[idx](ctx.cityName, ctx.uf)
  };
}

/** As 5 perguntas do banco, com variante estável por cidade. */
export function cityFaq(ctx: CityFaqContext): FaqEntry[] {
  return QUESTIONS.map((def) => buildEntry(def, ctx));
}

/** Subconjunto por chave — para reaproveitar em páginas irmãs (ex.: especialidade) sem duplicar o bloco inteiro. */
export function cityFaqByKeys(ctx: CityFaqContext, keys: CityFaqKey[]): FaqEntry[] {
  return QUESTIONS.filter((def) => keys.includes(def.key)).map((def) => buildEntry(def, ctx));
}
