/**
 * Descrições padrão e documentos úteis por área de atuação jurídica.
 *
 * Usado na Página Profissional pra renderizar:
 *   1. Cards de áreas de atuação com texto explicativo (em vez de só chips)
 *   2. Seção "Documentos úteis para o primeiro contato" — lista dinâmica
 *      baseada nas áreas em que o advogado atua
 *
 * Linguagem sóbria e informativa, sem promessas de resultado. Conforme
 * Provimento OAB 205/2021.
 *
 * Maio/2026 — Fase 2 do recurso Página Profissional AdvAqui.
 */

export type SpecialtyInfo = {
  /** Descrição curta da área pra exibir no card da Página Profissional. */
  description: string;
  /** Documentos típicos que o cliente costuma precisar reunir antes do
   *  primeiro contato em casos dessa área. Lista informativa, não exaustiva. */
  usefulDocs: string[];
};

/**
 * Mapa slug-de-especialidade → conteúdo informativo. Cobre as 15 áreas do
 * AdvAqui. Cada entry tem texto sóbrio + lista de documentos comuns.
 */
export const SPECIALTY_INFO: Record<string, SpecialtyInfo> = {
  trabalhista: {
    description:
      "Atendimento em dúvidas relacionadas a rescisão, verbas trabalhistas, vínculo de emprego, horas extras, assédio moral, acordos extrajudiciais e ações na Justiça do Trabalho.",
    usefulDocs: [
      "Carteira de trabalho (CTPS) e RG",
      "Contracheques e holerites recentes",
      "Termo de rescisão (TRCT), se houver",
      "Mensagens ou e-mails sobre o caso",
      "Horários trabalhados (cartão de ponto se possível)"
    ]
  },
  familia: {
    description:
      "Atendimento em questões envolvendo divórcio, pensão alimentícia, guarda, regulamentação de visitas, partilha de bens, união estável e planejamento familiar.",
    usefulDocs: [
      "Certidão de casamento ou união estável",
      "Certidão de nascimento dos filhos",
      "Documentos de bens em comum (matrículas, contratos)",
      "Comprovantes de despesas com filhos, se aplicável",
      "Documentos pessoais (RG, CPF) de quem busca atendimento"
    ]
  },
  civil: {
    description:
      "Atendimento em conflitos contratuais, responsabilidade civil, indenizações, cobrança, posse e propriedade, direito de vizinhança e questões patrimoniais entre pessoas físicas ou jurídicas.",
    usefulDocs: [
      "Contratos relacionados ao caso",
      "Comprovantes de pagamento ou cobrança",
      "Mensagens e e-mails trocados",
      "Documentos da propriedade ou do bem envolvido",
      "Notificações extrajudiciais já realizadas"
    ]
  },
  previdenciario: {
    description:
      "Atendimento em pedidos de aposentadoria, auxílio-doença, BPC/LOAS, pensão por morte, revisão de benefícios e recursos administrativos junto ao INSS.",
    usefulDocs: [
      "Documento pessoal (RG, CPF)",
      "Carteira de trabalho e CNIS atualizado",
      "Laudos médicos e exames recentes, se for caso de incapacidade",
      "Carta de indeferimento do INSS, se houver",
      "Comprovantes de tempo de contribuição (autônomo, MEI, rural)"
    ]
  },
  criminal: {
    description:
      "Atendimento em defesa em processos criminais, audiências de custódia, prisões em flagrante, tribunal do júri, crimes contra patrimônio, contravenções e habeas corpus.",
    usefulDocs: [
      "Boletim de Ocorrência (B.O.), se houver",
      "Mandado de prisão ou citação, se aplicável",
      "Documentos pessoais (RG, CPF)",
      "Comprovante de residência",
      "Qualquer documento relacionado ao processo"
    ]
  },
  empresarial: {
    description:
      "Atendimento em constituição e dissolução de sociedades, contratos comerciais, sucessão empresarial, conflitos societários e adequação societária.",
    usefulDocs: [
      "Contrato social atualizado",
      "Documentos da Junta Comercial",
      "Cartão CNPJ",
      "Contratos com fornecedores ou clientes relevantes ao caso",
      "Documentos pessoais dos sócios"
    ]
  },
  tributario: {
    description:
      "Atendimento em consultoria tributária, recuperação de impostos pagos a maior, defesa em autos de infração, planejamento fiscal e processos administrativos.",
    usefulDocs: [
      "Notificações ou autos de infração recebidos",
      "Comprovantes de pagamento dos tributos",
      "Documentos contábeis (declarações, balanços)",
      "Cartão CNPJ, se pessoa jurídica",
      "Documentos pessoais"
    ]
  },
  imobiliario: {
    description:
      "Atendimento em compra, venda, locação, regularização de imóveis, usucapião, despejo, financiamento imobiliário e questões condominiais.",
    usefulDocs: [
      "Matrícula atualizada do imóvel",
      "Contrato de compra e venda ou locação",
      "Comprovantes de pagamento (aluguel, IPTU)",
      "Convenção de condomínio, se aplicável",
      "Documentos pessoais"
    ]
  },
  consumidor: {
    description:
      "Atendimento em conflitos de consumo, cobrança indevida, produto com defeito, propaganda enganosa, negativação indevida e ações em juizados especiais.",
    usefulDocs: [
      "Nota fiscal ou comprovante de compra",
      "Contrato de prestação do serviço, se houver",
      "Mensagens e e-mails com o fornecedor",
      "Comprovantes da cobrança ou negativação",
      "Documentos pessoais"
    ]
  },
  administrativo: {
    description:
      "Atendimento em processos administrativos junto a órgãos públicos, licitações, servidores públicos, concursos, sanções administrativas e atos da administração pública.",
    usefulDocs: [
      "Documentos do processo administrativo (autos, notificações)",
      "Edital, se for caso de concurso ou licitação",
      "Comprovantes de relação com o órgão público",
      "Documentos pessoais ou da empresa",
      "Decisões administrativas recebidas"
    ]
  },
  ambiental: {
    description:
      "Atendimento em licenciamento ambiental, autuações por órgãos ambientais, responsabilidade civil ambiental, áreas de preservação e questões fundiárias rurais.",
    usefulDocs: [
      "Auto de infração ambiental, se houver",
      "Licenças e autorizações ambientais",
      "Matrícula da propriedade rural",
      "Estudos e laudos técnicos, se existirem",
      "Documentos da empresa ou propriedade"
    ]
  },
  digital: {
    description:
      "Atendimento em direito digital, proteção de dados (LGPD), crimes cibernéticos, propriedade intelectual, contratos digitais e remoção de conteúdo online.",
    usefulDocs: [
      "Prints e capturas de tela do conteúdo questionado",
      "URLs e timestamps das publicações",
      "Mensagens e e-mails relacionados",
      "Termos de uso ou contratos da plataforma",
      "Boletim de ocorrência, se aplicável"
    ]
  },
  eleitoral: {
    description:
      "Atendimento em prestação de contas eleitorais, registros de candidatura, propaganda eleitoral, impugnações e processos junto à Justiça Eleitoral.",
    usefulDocs: [
      "Documentos da campanha (notas, recibos)",
      "Registro de candidatura",
      "Materiais de propaganda eleitoral",
      "Decisões da Justiça Eleitoral recebidas",
      "Documentos pessoais"
    ]
  },
  militar: {
    description:
      "Atendimento em questões envolvendo militares das Forças Armadas e Polícia Militar — processos administrativos disciplinares, reformas, pensões militares e licenças.",
    usefulDocs: [
      "Documento de identidade militar",
      "Boletins internos da corporação",
      "Laudos médicos militares, se for caso de saúde",
      "Notificações do processo administrativo",
      "Documentos pessoais"
    ]
  },
  internacional: {
    description:
      "Atendimento em direito internacional privado, contratos internacionais, sucessão de bens no exterior, vistos e imigração, e cooperação jurídica internacional.",
    usefulDocs: [
      "Passaporte e documentos de identificação",
      "Contratos internacionais relacionados",
      "Documentos do país de destino, se imigração",
      "Apostilamento ou tradução juramentada, se houver",
      "Comprovantes de relação jurídica internacional"
    ]
  }
};

/**
 * Helper — obtém descrição da área (com fallback genérico).
 */
export function getSpecialtyDescription(slug: string): string {
  return (
    SPECIALTY_INFO[slug]?.description ||
    "Atendimento em questões jurídicas dessa área. Entre em contato pelo canal informado para mais informações sobre o atendimento."
  );
}

/**
 * Helper — agrega lista de documentos úteis baseado nas áreas do advogado.
 * Faz dedup e mantém ordem de relevância. Limita pra não inflar muito a
 * página pública (max 8 docs comuns).
 */
export function getUsefulDocsForSpecialties(
  specialtySlugs: string[],
  limit = 8
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const slug of specialtySlugs) {
    const docs = SPECIALTY_INFO[slug]?.usefulDocs || [];
    for (const doc of docs) {
      // Normaliza pra dedup baseado em prefixo
      const key = doc.toLowerCase().slice(0, 40);
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(doc);
      if (out.length >= limit) return out;
    }
  }
  // Fallback: se não tem nenhuma área, lista genérica.
  if (out.length === 0) {
    return [
      "Documento pessoal (RG e CPF)",
      "Comprovante de residência",
      "Contratos ou documentos relacionados ao caso",
      "Mensagens, e-mails ou notificações pertinentes",
      "Comprovantes de pagamento, se aplicável"
    ];
  }
  return out;
}
