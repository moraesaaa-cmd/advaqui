/**
 * Templates determinísticos de title/description/H1 para páginas
 * localizadas por cidade (fórmula de CTR do playbook).
 *
 * Motivação (GSC): consultas locais ("inss {cidade}", "valor do divórcio
 * no cartório", "advogado {área}") imprimem nas famílias
 * /blog/[slug]/em/[cidade] e /guias/[slug]/em/[cidade] mas não clicam.
 * Title genérico "{Título} — Guia para {Cidade}" não responde a pergunta.
 *
 * Fórmula:
 *  - Title: pergunta/ação + cidade no início, ~58 chars (fitTitle decide
 *    entre variante completa e curta).
 *  - Description: 140–155 chars, começa pela RESPOSTA e fecha com
 *    "guia em linguagem simples para {Cidade}".
 *  - H1: mesma pergunta do title (forma completa), mantendo a cidade.
 *
 * Tudo determinístico — só interpolação de cidade, zero geração dinâmica.
 * Sem promessa de resultado nem superlativo (compliance OAB).
 */

export type LocalTemplate = {
  /** Title completo (pergunta/ação + cidade) — candidato preferido */
  full: (cidade: string) => string;
  /** Title curto — fallback quando o completo estoura ~58 chars */
  short: (cidade: string) => string;
  /** Description 140–155c: resposta primeiro + linguagem simples */
  description: (cidade: string) => string;
  /** H1 da página (quando definido, substitui o título base) */
  h1: (cidade: string) => string;
};

/** Corta a description em ~155 chars sem quebrar palavra no meio. */
export function fitDescription(text: string, max = 155): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 100 ? cut.slice(0, lastSpace) : cut).replace(
    /[,;:\s]+$/,
    ""
  );
}

/* ------------------------------------------------------------------ */
/* Blog localizado — /blog/[slug]/em/[cidade-uf]                       */
/* Slugs = allow-list de lib/data/articles-cidades.ts                  */
/* ------------------------------------------------------------------ */

export const BLOG_CIDADE_TEMPLATES: Record<string, LocalTemplate> = {
  "inss-negou-beneficio-o-que-fazer": {
    full: (c) => `INSS negou em ${c}? Como recorrer passo a passo`,
    short: (c) => `INSS negou em ${c}? Como recorrer`,
    h1: (c) => `INSS negou em ${c}? Como recorrer passo a passo`,
    description: (c) =>
      `Você pode recorrer à Junta de Recursos em até 30 dias após a negativa ou levar o caso à Justiça. Guia em linguagem simples para ${c}.`
  },
  "como-pedir-divorcio": {
    full: (c) => `Divórcio em ${c}: cartório ou Justiça? Custos e passos`,
    short: (c) => `Divórcio em ${c}: cartório ou Justiça?`,
    h1: (c) => `Divórcio em ${c}: cartório ou Justiça? Custos e passos`,
    description: (c) =>
      `Sem filhos menores e com acordo, o divórcio pode sair no cartório; havendo disputa, vai à Justiça. Guia em linguagem simples para ${c}.`
  },
  "multa-de-transito-como-recorrer": {
    full: (c) => `Recorrer de multa em ${c}: prazos e como fazer`,
    short: (c) => `Recorrer de multa em ${c}: prazos`,
    h1: (c) => `Recorrer de multa em ${c}: prazos e como fazer`,
    description: (c) =>
      `Você pode apresentar defesa prévia e recorrer à JARI dentro do prazo da notificação, sem pagar antes. Guia em linguagem simples para ${c}.`
  },
  "como-pedir-pensao-alimenticia": {
    full: (c) => `Pensão alimentícia em ${c}: como pedir e quanto é`,
    short: (c) => `Pensão alimentícia em ${c}: como pedir`,
    h1: (c) => `Pensão alimentícia em ${c}: como pedir e quanto é`,
    description: (c) =>
      `O pedido é feito na vara de família e o valor depende da necessidade de quem recebe e da renda de quem paga. Guia em linguagem simples para ${c}.`
  },
  "fui-demitido-sem-justa-causa": {
    full: (c) => `Demitido sem justa causa em ${c}? Seus direitos`,
    short: (c) => `Demitido em ${c}? Seus direitos`,
    h1: (c) => `Demitido sem justa causa em ${c}? Seus direitos`,
    description: (c) =>
      `Você tem direito a aviso prévio, 13º e férias proporcionais, FGTS com multa de 40% e seguro-desemprego. Guia em linguagem simples para ${c}.`
  },
  "banco-cobrou-taxa-indevida": {
    full: (c) => `Banco cobrou taxa indevida em ${c}? Como reaver`,
    short: (c) => `Taxa indevida em ${c}? Como reaver`,
    h1: (c) => `Banco cobrou taxa indevida em ${c}? Como reaver`,
    description: (c) =>
      `Guarde o extrato, peça o estorno ao banco e, se não resolver, acione o Procon ou o Juizado Especial. Guia em linguagem simples para ${c}.`
  },
  "como-fazer-inventario": {
    full: (c) => `Inventário em ${c}: cartório ou Justiça? Passos`,
    short: (c) => `Inventário em ${c}: como fazer`,
    h1: (c) => `Inventário em ${c}: cartório ou Justiça? Passos e custos`,
    description: (c) =>
      `Com herdeiros maiores e de acordo, o inventário pode ser feito em cartório; o prazo para abrir é de 2 meses. Guia em linguagem simples para ${c}.`
  },
  "como-entrar-com-acao-no-juizado-do-consumidor": {
    full: (c) => `Juizado do Consumidor em ${c}: como entrar com ação`,
    short: (c) => `Juizado do Consumidor em ${c}`,
    h1: (c) => `Juizado do Consumidor em ${c}: como entrar com ação`,
    description: (c) =>
      `Causas de até 20 salários mínimos podem entrar no Juizado do Consumidor sem advogado e sem custas. Guia em linguagem simples para ${c}.`
  },
  "acordo-trabalhista-vale-a-pena": {
    full: (c) => `Acordo trabalhista em ${c}: vale a pena aceitar?`,
    short: (c) => `Acordo trabalhista em ${c}: aceitar?`,
    h1: (c) => `Acordo trabalhista em ${c}: vale a pena aceitar?`,
    description: (c) =>
      `Compare a proposta com o valor das verbas rescisórias devidas antes de assinar e homologue na Justiça. Guia em linguagem simples para ${c}.`
  },
  "acao-de-despejo-como-funciona": {
    full: (c) => `Ação de despejo em ${c}: prazos e como funciona`,
    short: (c) => `Despejo em ${c}: prazos e defesa`,
    h1: (c) => `Ação de despejo em ${c}: prazos e como funciona`,
    description: (c) =>
      `O locador pode pedir despejo por falta de pagamento e o inquilino pode quitar a dívida no prazo legal. Guia em linguagem simples para ${c}.`
  },
  "usucapiao-como-dar-entrada": {
    full: (c) => `Usucapião em ${c}: requisitos e como dar entrada`,
    short: (c) => `Usucapião em ${c}: como dar entrada`,
    h1: (c) => `Usucapião em ${c}: requisitos, prazos e como dar entrada`,
    description: (c) =>
      `O usucapião pode ser reconhecido direto no cartório de imóveis ou pela Justiça, conforme a posse e os prazos. Guia em linguagem simples para ${c}.`
  },
  "bpc-loas-quem-tem-direito": {
    full: (c) => `BPC/LOAS em ${c}: quem tem direito e como pedir`,
    short: (c) => `BPC/LOAS em ${c}: como pedir`,
    h1: (c) => `BPC/LOAS em ${c}: quem tem direito e como pedir`,
    description: (c) =>
      `Idosos com 65+ e pessoas com deficiência de baixa renda podem pedir um salário mínimo por mês ao INSS. Guia em linguagem simples para ${c}.`
  },
  "saque-fgts-modalidades-e-prazos": {
    full: (c) => `Saque do FGTS em ${c}: modalidades e prazos`,
    short: (c) => `Saque do FGTS em ${c}: como sacar`,
    h1: (c) => `Saque do FGTS em ${c}: todas as modalidades e prazos`,
    description: (c) =>
      `Demissão sem justa causa, saque-aniversário, doença grave e casa própria liberam o FGTS, cada um com regra própria. Guia em linguagem simples para ${c}.`
  }
};

/**
 * Fallback genérico para artigo localizável sem template dedicado
 * (novos slugs adicionados à allow-list antes de ganharem template).
 */
export function blogCidadeFallback(
  articleTitle: string,
  excerpt: string,
  cidade: string
): { full: string; short: string; description: string } {
  // Recorte determinístico: trecho antes do 1º separador forte do título
  const base = articleTitle.split(/[:?—]/)[0].trim();
  return {
    full: `${articleTitle} em ${cidade} — guia prático`,
    short: `${base} em ${cidade}`,
    description: fitDescription(
      `${excerpt} Guia em linguagem simples para ${cidade}.`
    )
  };
}

/* ------------------------------------------------------------------ */
/* Guias por área — /guias/[slug]/em/[cidade-uf]                       */
/* Slugs = lib/data/guias.ts GUIAS                                     */
/* ------------------------------------------------------------------ */

export const GUIA_CIDADE_TEMPLATES: Record<string, LocalTemplate> = {
  "direito-do-consumidor": {
    full: (c) => `Direito do consumidor em ${c}: como resolver`,
    short: (c) => `Consumidor em ${c}: como resolver`,
    h1: (c) => `Direito do consumidor em ${c}: como resolver seu problema`,
    description: (c) =>
      `Cobrança indevida, produto com defeito ou plano de saúde negado têm caminhos de solução previstos no CDC. Guia em linguagem simples para ${c}.`
  },
  "direito-de-familia": {
    full: (c) => `Direito de família em ${c}: divórcio, pensão, guarda`,
    short: (c) => `Família em ${c}: divórcio e pensão`,
    h1: (c) => `Direito de família em ${c}: divórcio, pensão e guarda`,
    description: (c) =>
      `Divórcio, pensão alimentícia, guarda e inventário correm na vara de família ou no cartório, conforme o caso. Guia em linguagem simples para ${c}.`
  },
  "direito-trabalhista": {
    full: (c) => `Direito trabalhista em ${c}: quais são seus direitos`,
    short: (c) => `Trabalhista em ${c}: seus direitos`,
    h1: (c) => `Direito trabalhista em ${c}: quais são seus direitos`,
    description: (c) =>
      `Demissão, verbas rescisórias, horas extras e assédio têm regras na CLT e prazo de 2 anos para reclamar. Guia em linguagem simples para ${c}.`
  },
  "direito-previdenciario": {
    full: (c) => `INSS em ${c}: aposentadoria, auxílio e revisão`,
    short: (c) => `INSS em ${c}: benefícios e revisão`,
    h1: (c) => `INSS em ${c}: aposentadoria, auxílio-doença e revisão`,
    description: (c) =>
      `Benefício negado pelo INSS pode ser revisto por recurso administrativo ou ação judicial, com prazos definidos. Guia em linguagem simples para ${c}.`
  },
  "direito-civil": {
    full: (c) => `Direito civil em ${c}: contratos e indenização`,
    short: (c) => `Direito civil em ${c}: contratos`,
    h1: (c) => `Direito civil em ${c}: contratos, danos e indenização`,
    description: (c) =>
      `Contratos descumpridos, danos morais e disputas de posse são resolvidos com base no Código Civil, com prazos. Guia em linguagem simples para ${c}.`
  },
  "direito-criminal": {
    full: (c) => `Direito criminal em ${c}: como agir e se defender`,
    short: (c) => `Criminal em ${c}: como se defender`,
    h1: (c) => `Direito criminal em ${c}: como agir e se defender`,
    description: (c) =>
      `Intimação, inquérito, prisão em flagrante: a defesa técnica por advogado é direito garantido desde o início. Guia em linguagem simples para ${c}.`
  },
  "direito-imobiliario": {
    full: (c) => `Direito imobiliário em ${c}: compra, aluguel, posse`,
    short: (c) => `Imobiliário em ${c}: guia da área`,
    h1: (c) => `Direito imobiliário em ${c}: compra, aluguel e posse`,
    description: (c) =>
      `Compra e venda, aluguel, despejo, usucapião e regularização de imóvel seguem regras próprias e prazos legais. Guia em linguagem simples para ${c}.`
  },
  "direito-tributario": {
    full: (c) => `Direito tributário em ${c}: impostos e defesas`,
    short: (c) => `Tributário em ${c}: impostos`,
    h1: (c) => `Direito tributário em ${c}: impostos, multas e defesas`,
    description: (c) =>
      `Cobrança de imposto pode ser contestada por defesa administrativa ou ação judicial, inclusive com restituição. Guia em linguagem simples para ${c}.`
  },
  "direito-empresarial": {
    full: (c) => `Direito empresarial em ${c}: guia para empresas`,
    short: (c) => `Empresarial em ${c}: guia`,
    h1: (c) => `Direito empresarial em ${c}: guia para empresas`,
    description: (c) =>
      `Abertura de empresa, contratos, sociedade, recuperação judicial e cobranças exigem cuidados jurídicos próprios. Guia em linguagem simples para ${c}.`
  },
  "direito-digital": {
    full: (c) => `Direito digital em ${c}: golpes, dados e internet`,
    short: (c) => `Direito digital em ${c}`,
    h1: (c) => `Direito digital em ${c}: golpes, dados e internet`,
    description: (c) =>
      `Golpe pelo Pix, vazamento de dados e ofensas na internet geram responsabilização com base na LGPD e no Marco Civil. Guia em linguagem simples para ${c}.`
  },
  "direito-eleitoral": {
    full: (c) => `Direito eleitoral em ${c}: título, candidatura, contas`,
    short: (c) => `Eleitoral em ${c}: guia da área`,
    h1: (c) => `Direito eleitoral em ${c}: título, candidatura e contas`,
    description: (c) =>
      `Título de eleitor, justificativa de voto, registro de candidatura e prestação de contas seguem regras e prazos curtos. Guia em linguagem simples para ${c}.`
  },
  "direito-militar": {
    full: (c) => `Direito militar em ${c}: defesa e disciplina`,
    short: (c) => `Militar em ${c}: defesa e disciplina`,
    h1: (c) => `Direito militar em ${c}: defesa, disciplina e carreira`,
    description: (c) =>
      `Crimes militares, punições disciplinares e conselhos de disciplina garantem direito de defesa em todas as fases. Guia em linguagem simples para ${c}.`
  },
  "direito-internacional": {
    full: (c) => `Direito internacional em ${c}: cidadania e vistos`,
    short: (c) => `Internacional em ${c}: cidadania`,
    h1: (c) => `Direito internacional em ${c}: cidadania, vistos e sentenças`,
    description: (c) =>
      `Cidadania estrangeira, vistos, contratos internacionais e homologação de sentença seguem procedimentos definidos. Guia em linguagem simples para ${c}.`
  },
  "direito-ambiental": {
    full: (c) => `Direito ambiental em ${c}: multas e licenciamento`,
    short: (c) => `Ambiental em ${c}: multas e licenças`,
    h1: (c) => `Direito ambiental em ${c}: multas, licenças e defesa`,
    description: (c) =>
      `Auto de infração do IBAMA pode ser contestado por defesa administrativa dentro do prazo, com possível conversão da multa. Guia em linguagem simples para ${c}.`
  },
  "direito-administrativo": {
    full: (c) => `Direito administrativo em ${c}: concursos e servidor`,
    short: (c) => `Administrativo em ${c}: concursos`,
    h1: (c) => `Direito administrativo em ${c}: concursos, PAD e licitações`,
    description: (c) =>
      `Eliminação em concurso, PAD e atos do poder público podem ser revistos por recurso ou ação judicial, com prazos definidos. Guia em linguagem simples para ${c}.`
  }
};

/** Fallback genérico para guia sem template dedicado. */
export function guiaCidadeFallback(
  guiaTitulo: string,
  tagline: string,
  cidade: string,
  uf: string
): { full: string; short: string; description: string } {
  return {
    full: `${guiaTitulo} em ${cidade}, ${uf}`,
    short: `${guiaTitulo} em ${cidade}`,
    description: fitDescription(
      `${tagline} Guia em linguagem simples para ${cidade}, com advogados que atuam na área e na cidade.`
    )
  };
}
