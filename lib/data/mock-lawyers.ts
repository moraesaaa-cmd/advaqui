export type PlanStatus = "free" | "pending" | "active" | "expired" | "cancelled";

export type Lawyer = {
  id: string;
  slug: string;
  name: string;
  oab: string;
  oabUf: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address?: string;
  cityName: string;
  citySlug: string;
  uf: string;
  specialties: string[];
  bio?: string;
  planStatus: PlanStatus;
  planStartDate?: string;
  planEndDate?: string;
  paymentDate?: string;
  createdAt: string;
  featured?: boolean;
  verifiedOab?: boolean;
  /**
   * ATENÇÃO — Em demo/MVP, armazenamos a senha em hash simples (SHA-256 com salt fixo)
   * no localStorage. Em produção, substituir por bcrypt em backend (Supabase Auth).
   * Os MOCK_LAWYERS abaixo NÃO têm passwordHash — eles só servem para visualização
   * pública e não podem fazer login.
   */
  passwordHash?: string;
};

export const MOCK_LAWYERS: Lawyer[] = [
  {
    id: "demo-1",
    slug: "dr-rafael-cardoso-mg-belo-horizonte",
    name: "Dr. Rafael Cardoso",
    oab: "189.234",
    oabUf: "MG",
    email: "rafael@exemplo.com",
    phone: "(31) 99999-0001",
    whatsapp: "5531999990001",
    address: "Av. Afonso Pena, 1500, Sala 302, Centro",
    cityName: "Belo Horizonte",
    citySlug: "belo-horizonte",
    uf: "MG",
    specialties: ["trabalhista", "previdenciario"],
    bio: "Atuação em direito trabalhista e previdenciário com foco em demandas individuais e revisões de aposentadoria.",
    planStatus: "active",
    planStartDate: "2026-04-15T00:00:00.000Z",
    planEndDate: "2026-06-15T00:00:00.000Z",
    paymentDate: "2026-04-14T00:00:00.000Z",
    createdAt: "2026-03-01T00:00:00.000Z",
    featured: true,
    verifiedOab: true
  },
  {
    id: "demo-2",
    slug: "dra-camila-pereira-mg-belo-horizonte",
    name: "Dra. Camila Pereira",
    oab: "201.578",
    oabUf: "MG",
    email: "camila@exemplo.com",
    phone: "(31) 98888-0002",
    whatsapp: "5531988880002",
    address: "Rua Sergipe, 1167, Sala 800, Funcionários",
    cityName: "Belo Horizonte",
    citySlug: "belo-horizonte",
    uf: "MG",
    specialties: ["familia", "civil"],
    bio: "Direito de família, divórcios consensuais e litigiosos, guarda compartilhada e ações de alimentos.",
    planStatus: "active",
    planStartDate: "2026-05-01T00:00:00.000Z",
    planEndDate: "2026-06-01T00:00:00.000Z",
    paymentDate: "2026-04-30T00:00:00.000Z",
    createdAt: "2026-04-20T00:00:00.000Z",
    verifiedOab: true
  },
  {
    id: "demo-3",
    slug: "dr-lucas-andrade-mg-almenara",
    name: "Dr. Lucas Andrade",
    oab: "156.872",
    oabUf: "MG",
    email: "lucas@exemplo.com",
    phone: "(33) 99977-0003",
    whatsapp: "5533999770003",
    address: "Praça da Matriz, 45, Centro",
    cityName: "Almenara",
    citySlug: "almenara",
    uf: "MG",
    specialties: ["civil", "trabalhista", "familia"],
    bio: "Atendimento generalista com foco em demandas do Vale do Jequitinhonha.",
    planStatus: "free",
    createdAt: "2026-05-01T00:00:00.000Z"
  },
  {
    id: "demo-4",
    slug: "dra-mariana-souza-mg-jequitinhonha",
    name: "Dra. Mariana Souza",
    oab: "178.901",
    oabUf: "MG",
    email: "mariana@exemplo.com",
    phone: "(33) 99966-0004",
    whatsapp: "5533999660004",
    address: "Rua Cel. Lafaiete, 200, Centro",
    cityName: "Jequitinhonha",
    citySlug: "jequitinhonha",
    uf: "MG",
    specialties: ["previdenciario", "trabalhista"],
    bio: "Especialista em previdenciário com revisões e auxílios por incapacidade.",
    planStatus: "active",
    planStartDate: "2026-05-10T00:00:00.000Z",
    planEndDate: "2026-06-10T00:00:00.000Z",
    paymentDate: "2026-05-09T00:00:00.000Z",
    createdAt: "2026-04-25T00:00:00.000Z",
    featured: true,
    verifiedOab: true
  },
  {
    id: "demo-5",
    slug: "dr-eduardo-lima-sp-sao-paulo",
    name: "Dr. Eduardo Lima",
    oab: "412.378",
    oabUf: "SP",
    email: "eduardo@exemplo.com",
    phone: "(11) 98765-0005",
    whatsapp: "5511987650005",
    address: "Av. Paulista, 1374, 19º andar",
    cityName: "São Paulo",
    citySlug: "sao-paulo",
    uf: "SP",
    specialties: ["empresarial", "tributario"],
    bio: "Direito empresarial, contratos M&A, planejamento tributário para PMEs.",
    planStatus: "active",
    planStartDate: "2026-04-01T00:00:00.000Z",
    planEndDate: "2026-06-01T00:00:00.000Z",
    paymentDate: "2026-04-01T00:00:00.000Z",
    createdAt: "2026-02-10T00:00:00.000Z",
    featured: true,
    verifiedOab: true
  },
  {
    id: "demo-6",
    slug: "dra-fernanda-oliveira-sp-campinas",
    name: "Dra. Fernanda Oliveira",
    oab: "389.012",
    oabUf: "SP",
    email: "fernanda@exemplo.com",
    phone: "(19) 97654-0006",
    whatsapp: "5519976540006",
    cityName: "Campinas",
    citySlug: "campinas",
    uf: "SP",
    specialties: ["consumidor", "civil"],
    bio: "Defesa do consumidor, ações contra bancos, planos de saúde e companhias aéreas.",
    planStatus: "free",
    createdAt: "2026-05-05T00:00:00.000Z"
  },
  {
    id: "demo-7",
    slug: "dr-thiago-araujo-pr-curitiba",
    name: "Dr. Thiago Araújo",
    oab: "145.678",
    oabUf: "PR",
    email: "thiago@exemplo.com",
    phone: "(41) 96543-0007",
    whatsapp: "5541965430007",
    address: "Rua XV de Novembro, 600, Centro",
    cityName: "Curitiba",
    citySlug: "curitiba",
    uf: "PR",
    specialties: ["criminal", "militar"],
    bio: "Direito criminal e militar, defesa em inquéritos e processos administrativos disciplinares.",
    planStatus: "active",
    planStartDate: "2026-05-05T00:00:00.000Z",
    planEndDate: "2026-06-05T00:00:00.000Z",
    paymentDate: "2026-05-04T00:00:00.000Z",
    createdAt: "2026-04-01T00:00:00.000Z",
    verifiedOab: true
  },
  {
    id: "demo-8",
    slug: "dra-juliana-campos-rj-niteroi",
    name: "Dra. Juliana Campos",
    oab: "267.890",
    oabUf: "RJ",
    email: "juliana@exemplo.com",
    phone: "(21) 99432-0008",
    whatsapp: "5521994320008",
    address: "Rua da Conceição, 105, Sala 405, Centro",
    cityName: "Niterói",
    citySlug: "niteroi",
    uf: "RJ",
    specialties: ["familia", "civil"],
    bio: "Direito de família e sucessões com 12 anos de atuação.",
    planStatus: "active",
    planStartDate: "2026-04-20T00:00:00.000Z",
    planEndDate: "2026-05-20T00:00:00.000Z",
    paymentDate: "2026-04-19T00:00:00.000Z",
    createdAt: "2026-03-15T00:00:00.000Z",
    featured: true,
    verifiedOab: true
  },
  {
    id: "demo-9",
    slug: "dr-marcos-costa-ce-fortaleza",
    name: "Dr. Marcos Costa",
    oab: "56.432",
    oabUf: "CE",
    email: "marcos@exemplo.com",
    phone: "(85) 99321-0009",
    whatsapp: "5585993210009",
    address: "Av. Dom Luís, 880, Sala 1502, Aldeota",
    cityName: "Fortaleza",
    citySlug: "fortaleza",
    uf: "CE",
    specialties: ["imobiliario", "civil"],
    bio: "Direito imobiliário, regularização de imóveis e usucapião extrajudicial.",
    planStatus: "free",
    createdAt: "2026-05-08T00:00:00.000Z"
  },
  {
    id: "demo-10",
    slug: "dra-patricia-mendes-ba-salvador",
    name: "Dra. Patrícia Mendes",
    oab: "78.456",
    oabUf: "BA",
    email: "patricia@exemplo.com",
    phone: "(71) 99210-0010",
    whatsapp: "5571992100010",
    address: "Av. Tancredo Neves, 620, Sala 802, Caminho das Árvores",
    cityName: "Salvador",
    citySlug: "salvador",
    uf: "BA",
    specialties: ["administrativo", "tributario"],
    bio: "Direito administrativo, defesa em processos administrativos e licitações.",
    planStatus: "active",
    planStartDate: "2026-05-01T00:00:00.000Z",
    planEndDate: "2026-06-01T00:00:00.000Z",
    paymentDate: "2026-04-30T00:00:00.000Z",
    createdAt: "2026-03-20T00:00:00.000Z",
    verifiedOab: true
  }
];

export const findLawyerBySlug = (slug: string) =>
  MOCK_LAWYERS.find((l) => l.slug === slug);

export const lawyersForCity = (uf: string, citySlug: string): Lawyer[] => {
  const u = uf.toLowerCase();
  return MOCK_LAWYERS.filter(
    (l) => l.uf.toLowerCase() === u && l.citySlug === citySlug
  );
};

export const lawyersForState = (uf: string): Lawyer[] => {
  const u = uf.toLowerCase();
  return MOCK_LAWYERS.filter((l) => l.uf.toLowerCase() === u);
};

export const lawyersBySpecialty = (
  uf: string,
  citySlug: string,
  spec: string
): Lawyer[] =>
  lawyersForCity(uf, citySlug).filter((l) => l.specialties.includes(spec));

export const sortLawyers = (list: Lawyer[]): Lawyer[] => {
  return [...list].sort((a, b) => {
    const aPrem = a.planStatus === "active" || a.featured;
    const bPrem = b.planStatus === "active" || b.featured;
    if (aPrem && !bPrem) return -1;
    if (!aPrem && bPrem) return 1;
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return a.name.localeCompare(b.name, "pt-BR");
  });
};
