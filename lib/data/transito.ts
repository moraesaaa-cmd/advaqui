import type { City } from "@/lib/data/cities";
import { seedFrom, pick, shuffleSeeded } from "@/lib/utils/seed";

/**
 * Dados e conteúdo localizado das páginas de recurso de multa por cidade
 * (/recurso-de-multa/[uf]/[cidade]). Tudo determinístico (sem IA, sem fetch):
 * a partir da cidade montamos texto único e útil, citando o órgão de trânsito
 * estadual correto e variando a redação pela semente do IBGE.
 */

/** DETRAN de cada UF — órgão estadual de trânsito (autuação e recursos). */
export const DETRAN: Record<string, { sigla: string; nome: string }> = {
  AC: { sigla: "DETRAN-AC", nome: "Departamento Estadual de Trânsito do Acre" },
  AL: { sigla: "DETRAN-AL", nome: "Departamento Estadual de Trânsito de Alagoas" },
  AM: { sigla: "DETRAN-AM", nome: "Departamento Estadual de Trânsito do Amazonas" },
  AP: { sigla: "DETRAN-AP", nome: "Departamento Estadual de Trânsito do Amapá" },
  BA: { sigla: "DETRAN-BA", nome: "Departamento Estadual de Trânsito da Bahia" },
  CE: { sigla: "DETRAN-CE", nome: "Departamento Estadual de Trânsito do Ceará" },
  DF: { sigla: "DETRAN-DF", nome: "Departamento de Trânsito do Distrito Federal" },
  ES: { sigla: "DETRAN-ES", nome: "Departamento Estadual de Trânsito do Espírito Santo" },
  GO: { sigla: "DETRAN-GO", nome: "Departamento Estadual de Trânsito de Goiás" },
  MA: { sigla: "DETRAN-MA", nome: "Departamento Estadual de Trânsito do Maranhão" },
  MG: { sigla: "DETRAN-MG", nome: "Departamento Estadual de Trânsito de Minas Gerais" },
  MS: { sigla: "DETRAN-MS", nome: "Departamento Estadual de Trânsito de Mato Grosso do Sul" },
  MT: { sigla: "DETRAN-MT", nome: "Departamento Estadual de Trânsito de Mato Grosso" },
  PA: { sigla: "DETRAN-PA", nome: "Departamento Estadual de Trânsito do Pará" },
  PB: { sigla: "DETRAN-PB", nome: "Departamento Estadual de Trânsito da Paraíba" },
  PE: { sigla: "DETRAN-PE", nome: "Departamento Estadual de Trânsito de Pernambuco" },
  PI: { sigla: "DETRAN-PI", nome: "Departamento Estadual de Trânsito do Piauí" },
  PR: { sigla: "DETRAN-PR", nome: "Departamento Estadual de Trânsito do Paraná" },
  RJ: { sigla: "DETRAN-RJ", nome: "Departamento Estadual de Trânsito do Rio de Janeiro" },
  RN: { sigla: "DETRAN-RN", nome: "Departamento Estadual de Trânsito do Rio Grande do Norte" },
  RO: { sigla: "DETRAN-RO", nome: "Departamento Estadual de Trânsito de Rondônia" },
  RR: { sigla: "DETRAN-RR", nome: "Departamento Estadual de Trânsito de Roraima" },
  RS: { sigla: "DETRAN-RS", nome: "Departamento Estadual de Trânsito do Rio Grande do Sul" },
  SC: { sigla: "DETRAN-SC", nome: "Departamento Estadual de Trânsito de Santa Catarina" },
  SE: { sigla: "DETRAN-SE", nome: "Departamento Estadual de Trânsito de Sergipe" },
  SP: { sigla: "DETRAN-SP", nome: "Departamento Estadual de Trânsito de São Paulo" },
  TO: { sigla: "DETRAN-TO", nome: "Departamento Estadual de Trânsito do Tocantins" }
};

export const detranOf = (uf: string) =>
  DETRAN[uf.toUpperCase()] || { sigla: "DETRAN", nome: "Departamento Estadual de Trânsito" };

/** Parágrafo de abertura — 5 variantes parametrizadas pela cidade. */
const INTROS: Array<(c: City) => string> = [
  (c) =>
    `Recebeu uma multa de trânsito em ${c.name}, ${c.uf}, e quer contestar? Você não precisa pagar antes de tentar derrubá-la. ` +
    `A lei garante o direito de recorrer de qualquer autuação, e quem dirige em ${c.name} pode apresentar a defesa por conta própria, no prazo indicado na notificação. ` +
    `Esta página explica como funciona o recurso na prática e gera, de graça, uma peça fundamentada no Código de Trânsito Brasileiro para você revisar e protocolar.`,
  (c) =>
    `Multas aplicadas em ${c.name} (${c.state}) podem ser questionadas tanto por vícios de forma quanto pelo mérito da infração. ` +
    `Muita gente paga sem saber que tinha argumentos sólidos para recorrer. ` +
    `Aqui você entende as três fases do recurso, os prazos que mais derrubam pedidos e monta, sem cadastro, o seu recurso com a base legal correta.`,
  (c) =>
    `Quem foi multado em ${c.name} tem o mesmo direito de defesa de qualquer condutor do país: contestar a autuação antes que a penalidade se consolide. ` +
    `O segredo está em respeitar o prazo e apontar os fundamentos certos — falha na notificação, ausência da dupla notificação, erro no auto de infração. ` +
    `Use esta ferramenta gratuita para gerar o seu recurso direcionado à autoridade competente.`,
  (c) =>
    `Uma multa de trânsito em ${c.name}/${c.uf} não é uma sentença definitiva. ` +
    `Antes de pagar, vale conferir se a autuação seguiu todas as exigências legais — e, quando não seguiu, recorrer. ` +
    `Reunimos abaixo o passo a passo do recurso administrativo e um gerador que monta a peça com a fundamentação do CTB, pronta para você protocolar.`,
  (c) =>
    `Se você dirige em ${c.name} e foi autuado, saiba que recorrer é gratuito e pode ser feito por você mesmo. ` +
    `A decisão final é do órgão de trânsito, mas um recurso bem fundamentado, apresentado no prazo, aumenta as chances de revisão. ` +
    `Veja como funciona em ${c.state} e gere o seu recurso agora, sem custo.`
];

/** Por que vale conferir antes de pagar — 4 variantes. */
const PORQUE: Array<(c: City) => string> = [
  (c) =>
    `Boa parte das multas é mantida apenas porque o condutor não recorreu — não porque a autuação era perfeita. ` +
    `Vícios na notificação, falta da dupla notificação (autuação e penalidade) e erros no preenchimento do auto são comuns e abrem espaço para defesa em ${c.name}.`,
  (c) =>
    `Em ${c.name}, como no resto do país, a Administração precisa cumprir o devido processo legal para aplicar uma penalidade. ` +
    `Quando deixa de notificar corretamente ou descreve mal a infração, a autuação fica vulnerável — e é exatamente aí que o recurso atua.`,
  (c) =>
    `Recorrer não é "dar um jeito": é exercer um direito previsto na Constituição (art. 5º, LV) e no Código de Trânsito. ` +
    `O condutor de ${c.name} que verifica a notificação com atenção muitas vezes encontra falhas formais que justificam o pedido de cancelamento.`,
  (c) =>
    `A presunção de legitimidade do ato administrativo não é absoluta. ` +
    `Se a multa aplicada em ${c.name} tem falha de notificação, de motivação ou de competência, ela pode e deve ser questionada antes do pagamento.`
];

export type FaseLocal = { titulo: string; texto: string };

/** As três fases, com o órgão estadual correto citado. */
export const fasesLocais = (c: City): FaseLocal[] => {
  const d = detranOf(c.uf);
  return [
    {
      titulo: "1. Defesa Prévia (da Autuação)",
      texto:
        `Primeira oportunidade, logo após a Notificação da Autuação e antes de a multa virar penalidade. ` +
        `É dirigida à autoridade de trânsito que autuou — em ${c.name}, conforme a via, o órgão municipal de trânsito ou o ${d.sigla}. ` +
        `Aqui se apontam vícios no auto de infração e na notificação.`
    },
    {
      titulo: "2. Recurso à JARI",
      texto:
        `Recurso de 1ª instância, apresentado depois da Notificação da Penalidade à Junta Administrativa de Recursos de Infrações (JARI) vinculada ao órgão autuador. ` +
        `É o momento de desenvolver o mérito: por que a infração não ocorreu ou não pode subsistir.`
    },
    {
      titulo: "3. Recurso ao CETRAN",
      texto:
        `Segunda instância, cabível quando a JARI nega o recurso. Vai ao Conselho Estadual de Trânsito (CETRAN) de ${c.state}. ` +
        `Encerra a discussão na esfera administrativa.`
    }
  ];
};

/** FAQ localizada — 5 perguntas com o nome da cidade. */
export const faqLocal = (c: City): Array<{ q: string; a: string }> => {
  const d = detranOf(c.uf);
  return [
    {
      q: `Onde protocolo o recurso de uma multa em ${c.name}?`,
      a:
        `Depende de quem autuou. Multas de órgãos municipais de ${c.name} são contestadas no próprio órgão municipal de trânsito; ` +
        `multas estaduais ou de rodovias estaduais, no ${d.nome} (${d.sigla}). A notificação informa o órgão autuador e o canal de protocolo.`
    },
    {
      q: `Qual é o prazo para recorrer em ${c.name}?`,
      a:
        `O prazo consta da própria notificação e, em regra, é de no mínimo 30 dias contados da data nela indicada. ` +
        `Confira essa data assim que receber a notificação — perder o prazo costuma encerrar a discussão administrativa.`
    },
    {
      q: `Preciso de advogado para recorrer de multa em ${c.name}?`,
      a:
        `Para o recurso administrativo, não é obrigatório: o próprio condutor pode protocolar. ` +
        `Em casos mais graves — suspensão do direito de dirigir, embriaguez, cassação da CNH — vale procurar um advogado de trânsito em ${c.name}.`
    },
    {
      q: `Recorrer suspende a obrigação de pagar a multa em ${c.name}?`,
      a:
        `Na defesa prévia e no recurso à JARI, em geral a exigência do pagamento fica suspensa até o julgamento. ` +
        `Confirme as regras do órgão autuador indicadas na sua notificação.`
    },
    {
      q: `O recurso garante o cancelamento da multa?`,
      a:
        `Não. Esta ferramenta monta um modelo bem fundamentado a partir das suas respostas, mas a decisão é do órgão de trânsito. ` +
        `Use somente argumentos verdadeiros no seu caso — alegar algo falso enfraquece o recurso.`
    }
  ];
};

/** Teses comuns (rótulos curtos) — ordem variada por cidade. */
const TESES = [
  "Ausência ou irregularidade da dupla notificação (Súmula 312 do STJ)",
  "Vício de preenchimento ou falta de requisitos do auto de infração",
  "Cerceamento de defesa e desrespeito ao contraditório (art. 5º, LV, CF)",
  "Falta de motivação adequada do ato administrativo",
  "Erro na identificação do veículo, do condutor ou do local",
  "Inobservância de prazos e formalidades pelo órgão autuador"
];

/** Monta todo o conteúdo localizado de uma cidade, com variação determinística. */
export const conteudoRecurso = (c: City) => {
  const seed = seedFrom(c.id);
  return {
    intro: pick(INTROS, seed)(c),
    porque: pick(PORQUE, seed >> 3)(c),
    fases: fasesLocais(c),
    teses: shuffleSeeded(TESES, seed),
    faq: faqLocal(c),
    detran: detranOf(c.uf)
  };
};
