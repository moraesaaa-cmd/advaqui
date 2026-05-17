export type Specialty = {
  slug: string;
  name: string;
  intro: string;
  keywords: string[];
};

export const SPECIALTIES: Specialty[] = [
  {
    slug: "trabalhista",
    name: "Trabalhista",
    intro:
      "Advogados especializados em direito do trabalho atuam em demissões, horas extras, FGTS, assédio moral, acordos coletivos e processos na Justiça do Trabalho.",
    keywords: ["demissão", "rescisão", "FGTS", "horas extras", "INSS trabalhista"]
  },
  {
    slug: "civil",
    name: "Civil",
    intro:
      "O direito civil cobre contratos, responsabilidade civil, obrigações, posse, propriedade e relações entre particulares.",
    keywords: ["contrato", "indenização", "danos morais", "obrigações"]
  },
  {
    slug: "criminal",
    name: "Criminal",
    intro:
      "Advogados criminais defendem em inquéritos, ações penais, audiências de custódia e processos perante a Justiça Criminal.",
    keywords: ["defesa criminal", "habeas corpus", "inquérito policial"]
  },
  {
    slug: "previdenciario",
    name: "Previdenciário",
    intro:
      "Especialistas em direito previdenciário cuidam de aposentadorias, auxílios, pensões e revisões junto ao INSS.",
    keywords: ["aposentadoria", "INSS", "auxílio doença", "pensão por morte", "revisão"]
  },
  {
    slug: "familia",
    name: "Família",
    intro:
      "Direito de família abrange divórcio, guarda, pensão alimentícia, união estável, inventário e adoção.",
    keywords: ["divórcio", "guarda", "pensão", "inventário", "alimentos"]
  },
  {
    slug: "empresarial",
    name: "Empresarial",
    intro:
      "Advogados empresariais atendem empresas em contratos, societário, recuperação judicial, falência e compliance.",
    keywords: ["contratos empresariais", "societário", "M&A", "compliance"]
  },
  {
    slug: "tributario",
    name: "Tributário",
    intro:
      "O direito tributário trata de impostos, planejamento fiscal, defesas em autuações e recuperação de créditos tributários.",
    keywords: ["impostos", "planejamento tributário", "execução fiscal"]
  },
  {
    slug: "imobiliario",
    name: "Imobiliário",
    intro:
      "Advogados imobiliários cuidam de compra e venda, locação, regularização, usucapião e desapropriação.",
    keywords: ["compra de imóvel", "aluguel", "usucapião", "regularização"]
  },
  {
    slug: "consumidor",
    name: "Consumidor",
    intro:
      "Direito do consumidor protege em casos de produto defeituoso, cobranças indevidas, planos de saúde e bancos.",
    keywords: ["procon", "cobrança indevida", "plano de saúde", "banco"]
  },
  {
    slug: "administrativo",
    name: "Administrativo",
    intro:
      "Direito administrativo envolve concursos, servidores públicos, licitações, processos administrativos e atos do poder público.",
    keywords: ["concurso público", "servidor", "licitação"]
  },
  {
    slug: "ambiental",
    name: "Ambiental",
    intro:
      "Advogados ambientais atuam em licenciamento, infrações, áreas protegidas e responsabilidade ambiental.",
    keywords: ["licenciamento", "IBAMA", "crime ambiental"]
  },
  {
    slug: "digital",
    name: "Digital",
    intro:
      "Direito digital trata de LGPD, crimes virtuais, contratos eletrônicos, direito autoral online e marcas digitais.",
    keywords: ["LGPD", "crimes cibernéticos", "marco civil"]
  },
  {
    slug: "eleitoral",
    name: "Eleitoral",
    intro:
      "Advogados eleitorais atuam em registro de candidaturas, prestação de contas e ações junto à Justiça Eleitoral.",
    keywords: ["TSE", "candidatura", "contas de campanha"]
  },
  {
    slug: "militar",
    name: "Militar",
    intro:
      "Direito militar cobre questões disciplinares, justiça militar, reformas e benefícios das Forças Armadas e auxiliares.",
    keywords: ["justiça militar", "reforma", "disciplinar"]
  },
  {
    slug: "internacional",
    name: "Internacional",
    intro:
      "Direito internacional trata de cidadania, vistos, contratos internacionais, comércio exterior e arbitragem.",
    keywords: ["cidadania", "visto", "comércio exterior"]
  }
];

export const findSpecialty = (slug: string) =>
  SPECIALTIES.find((s) => s.slug === slug);

export const SPECIALTY_SLUGS = SPECIALTIES.map((s) => s.slug);
