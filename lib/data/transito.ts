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

/**
 * Parágrafo de abertura — 12 variantes parametrizadas pela cidade.
 * Regra (playbook Bing/Copilot C1): TODA variante contém a keyword literal
 * "multa de trânsito em {cidade}" na primeira frase.
 */
const INTROS: Array<(c: City) => string> = [
  (c) =>
    `Recebeu uma multa de trânsito em ${c.name}, ${c.uf}, e quer contestar? Você não precisa pagar antes de tentar derrubá-la. ` +
    `A lei garante o direito de recorrer de qualquer autuação, e quem dirige em ${c.name} pode apresentar a defesa por conta própria, no prazo indicado na notificação. ` +
    `Esta página explica como funciona o recurso na prática e gera, de graça, uma peça fundamentada no Código de Trânsito Brasileiro para você revisar e protocolar.`,
  (c) =>
    `Uma multa de trânsito em ${c.name} (${c.state}) pode ser questionada tanto por vícios de forma quanto pelo mérito da infração. ` +
    `Muita gente paga sem saber que tinha argumentos sólidos para recorrer. ` +
    `Aqui você entende as três fases do recurso, os prazos que mais derrubam pedidos e monta, sem cadastro, o seu recurso com a base legal correta.`,
  (c) =>
    `Quem recebeu uma multa de trânsito em ${c.name} tem o mesmo direito de defesa de qualquer condutor do país: contestar a autuação antes que a penalidade se consolide. ` +
    `O segredo está em respeitar o prazo e apontar os fundamentos certos — falha na notificação, ausência da dupla notificação, erro no auto de infração. ` +
    `Use esta ferramenta gratuita para gerar o seu recurso direcionado à autoridade competente.`,
  (c) =>
    `Uma multa de trânsito em ${c.name}/${c.uf} não é uma sentença definitiva. ` +
    `Antes de pagar, vale conferir se a autuação seguiu todas as exigências legais — e, quando não seguiu, recorrer. ` +
    `Reunimos abaixo o passo a passo do recurso administrativo e um gerador que monta a peça com a fundamentação do CTB, pronta para você protocolar.`,
  (c) =>
    `Se você levou uma multa de trânsito em ${c.name}, saiba que recorrer é gratuito e pode ser feito por você mesmo. ` +
    `A decisão final é do órgão de trânsito, mas um recurso bem fundamentado, apresentado no prazo, aumenta as chances de revisão. ` +
    `Veja como funciona em ${c.state} e gere o seu recurso agora, sem custo.`,
  (c) =>
    `Flagrado por radar ou autuado por um agente, você pode contestar a multa de trânsito em ${c.name} antes de pagá-la. Vale checar se a notificação chegou no prazo e se o auto descreve corretamente a infração. ` +
    `Esta página reúne o passo a passo do recurso em ${c.state} e monta, sem custo, uma peça pronta para você revisar e protocolar.`,
  (c) =>
    `Nem toda multa de trânsito em ${c.name} resiste a uma análise cuidadosa. Falhas na notificação, na descrição da conduta ou na competência do órgão são motivos frequentes de cancelamento. ` +
    `Veja como recorrer e monte aqui, de graça, o seu recurso fundamentado no Código de Trânsito Brasileiro.`,
  (c) =>
    `Receber a notificação de uma multa de trânsito em ${c.name} assusta, mas recorrer é um direito — e não custa nada. O importante é agir dentro do prazo indicado e apontar os fundamentos certos. ` +
    `Abaixo explicamos cada etapa e disponibilizamos um gerador de recurso para o seu caso.`,
  (c) =>
    `Muita multa de trânsito em ${c.name}/${c.uf} é paga por pura falta de informação. Quem conhece as três fases do recurso e os prazos consegue contestar sozinho, sem intermediário. ` +
    `Use o guia e o gerador desta página para preparar a sua defesa.`,
  (c) =>
    `Multa de trânsito em ${c.name} não é dívida definitiva: é um ato administrativo que pode ser revisto. Confira a regularidade da notificação que você recebeu e, havendo falha, recorra. ` +
    `Montamos aqui um modelo com a base legal correta para você protocolar.`,
  (c) =>
    `Quem quer contestar uma multa de trânsito em ${c.name} tem três instâncias administrativas antes de qualquer pagamento. Saber qual usar e quando faz toda a diferença. ` +
    `Este guia explica o caminho em ${c.state} e gera o seu recurso gratuitamente.`,
  (c) =>
    `Se a sua multa de trânsito em ${c.name} tem algo estranho — data, local, veículo ou notificação —, isso pode ser o fundamento do seu recurso. ` +
    `Entenda como funciona a defesa administrativa e prepare a sua peça aqui, sem pagar nada.`
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
    `Se a multa aplicada em ${c.name} tem falha de notificação, de motivação ou de competência, ela pode e deve ser questionada antes do pagamento.`,
  (c) =>
    `Pagar a multa em ${c.name} equivale a reconhecer a infração — e faz você perder os pontos na carteira. ` +
    `Recorrer preserva o direito de discutir a autuação antes que a penalidade se consolide.`,
  (c) =>
    `Radar sem aferição válida do Inmetro, notificação enviada fora do prazo legal e erro na descrição da conduta aparecem com frequência. ` +
    `Em ${c.name}, qualquer uma dessas falhas pode fundamentar o cancelamento da multa.`,
  (c) =>
    `A Administração tem prazos rígidos para notificar o condutor. ` +
    `Se a Notificação da Autuação de uma multa em ${c.name} demorou além do prazo legal, isso por si só pode invalidar a penalidade.`,
  (c) =>
    `Deixar a multa correr em ${c.name} tem custo: autuações se acumulam e podem levar à suspensão do direito de dirigir. ` +
    `Agir cedo, ainda na fase de defesa, protege a sua CNH.`,
  (c) =>
    `Muitas defesas são aceitas por questões simples de forma, não por argumentos sofisticados. ` +
    `Em ${c.name}, ler a notificação linha por linha já costuma revelar boa parte dos fundamentos do recurso.`,
  (c) =>
    `A autuação goza de presunção de legitimidade, mas essa presunção cai diante de prova de irregularidade. ` +
    `Havendo vício na multa aplicada em ${c.name}, o ônus de mantê-la passa a ser do órgão de trânsito, não do condutor.`
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
  "Inobservância de prazos e formalidades pelo órgão autuador",
  "Radar ou equipamento sem aferição válida do Inmetro (ou aferição vencida)",
  "Notificação da autuação enviada fora do prazo legal (art. 281, parágrafo único, do CTB)",
  "Ausência de fotografia ou de comprovação idônea da infração",
  "Duplicidade de autuação pelo mesmo fato"
];

/**
 * Bloco ÚNICO por estado (27 UFs) — texto real e distinto sobre recorrer de
 * multa naquele estado, citando DETRAN-UF, JARI, CETRAN-UF e o CTB. Combinado
 * com o nome da cidade e os pools acima, torna cada página bem diferente das
 * demais (evita "conteúdo raso"/duplicado). Determinístico, sem IA/fetch.
 */
export const UF_CONTEXTO: Record<string, { ctx: string; fq: string; fa: string }> = {
  AC: { ctx: "No Acre, a defesa começa pela defesa prévia da autuação e, mantida a multa, segue por recurso à JARI vinculada ao órgão que autuou — em geral o DETRAN-AC. Indeferido o recurso, a última instância administrativa é o CETRAN-AC, sempre nos prazos do Código de Trânsito Brasileiro (CTB).", fq: "Para que serve o CETRAN-AC?", fa: "É o Conselho Estadual de Trânsito do Acre, a segunda e última instância administrativa: reexamina o recurso quando a JARI mantém a penalidade, antes de qualquer discussão no Judiciário." },
  AL: { ctx: "Em Alagoas, a autuação pode ser contestada em defesa prévia e, depois, por recurso à JARI do órgão autuador; nas infrações estaduais, o DETRAN-AL. Se a JARI negar, cabe recurso ao CETRAN-AL, que encerra a via administrativa conforme o CTB.", fq: "Multa municipal e estadual em Alagoas: onde recorrer?", fa: "Depende de quem autuou: multas municipais vão ao órgão de trânsito do município; as estaduais, ao DETRAN-AL. Em ambos o 1º recurso é à JARI e, nas estaduais, a 2ª instância é o CETRAN-AL." },
  AM: { ctx: "No Amazonas, o condutor apresenta defesa prévia e, mantida a penalidade, recorre à JARI ligada ao órgão autuador (como o DETRAN-AM nas infrações estaduais). Persistindo a negativa, o recurso segue ao CETRAN-AM, segunda instância administrativa prevista no CTB.", fq: "Qual o papel do CETRAN-AM?", fa: "O Conselho Estadual de Trânsito do Amazonas julga o recurso em segunda instância quando a JARI mantém a multa, encerrando a discussão administrativa no estado." },
  AP: { ctx: "No Amapá, cabe defesa prévia da autuação e, em seguida, recurso à JARI do órgão que aplicou a multa — o DETRAN-AP nas infrações estaduais. Mantida a decisão, o caso vai ao CETRAN-AP, última instância administrativa, sempre nos prazos do CTB.", fq: "O que é o CETRAN-AP?", fa: "É o Conselho Estadual de Trânsito do Amapá, para onde o recurso é encaminhado quando a JARI nega o pedido; confirma ou reforma a decisão antes de eventual via judicial." },
  BA: { ctx: "Na Bahia, a penalidade é discutida primeiro na defesa prévia e depois na JARI do órgão autuador; nas infrações estaduais, o DETRAN-BA. Negado o recurso, a segunda instância é o CETRAN-BA, conforme as regras gerais do Código de Trânsito Brasileiro.", fq: "Recorrer de multa municipal e estadual na Bahia é diferente?", fa: "O caminho muda conforme o autuador: municipais tramitam no órgão do município; estaduais, no DETRAN-BA. O 1º recurso vai à JARI e, nas estaduais, a 2ª instância é o CETRAN-BA." },
  CE: { ctx: "No Ceará, o motorista apresenta defesa prévia e, mantida a multa, recorre à JARI vinculada ao órgão autuador (como o DETRAN-CE). Se indeferido, ainda cabe recurso ao CETRAN-CE, segunda instância administrativa, nos prazos do CTB.", fq: "Para onde recorrer de multa estadual no Ceará?", fa: "Nas infrações estaduais o recurso vai à JARI ligada ao DETRAN-CE e, se negado, ao CETRAN-CE. Confira sempre na notificação o órgão autuador e o prazo." },
  DF: { ctx: "No Distrito Federal, a autuação é contestada por defesa prévia e recurso à JARI do órgão autuador — em regra o DETRAN-DF. Mantida a penalidade, o recurso de segunda instância vai ao CETRAN-DF, encerrando a via administrativa conforme o CTB.", fq: "Quem julga o recurso em segunda instância no DF?", fa: "O CETRAN-DF (Conselho de Trânsito do Distrito Federal) reexamina o recurso quando a JARI mantém a multa, sendo a última instância administrativa." },
  ES: { ctx: "No Espírito Santo, cabe defesa prévia e, depois, recurso à JARI do órgão que autuou (como o DETRAN-ES nas infrações estaduais). Negado o pedido, a segunda instância é o CETRAN-ES, dentro dos prazos do Código de Trânsito Brasileiro.", fq: "O que faz o CETRAN-ES?", fa: "É o Conselho Estadual de Trânsito do Espírito Santo, segunda instância administrativa que julga o recurso após a JARI manter a penalidade." },
  GO: { ctx: "Em Goiás, a defesa começa pela defesa prévia e segue por recurso à JARI do órgão autuador; nas infrações estaduais, o DETRAN-GO. Se a JARI indeferir, o recurso vai ao CETRAN-GO, última instância administrativa prevista no CTB.", fq: "Multa municipal ou estadual em Goiás?", fa: "Depende do autuador: municipais no órgão do município; estaduais no DETRAN-GO. O 1º recurso é à JARI; nas estaduais, a 2ª instância é o CETRAN-GO." },
  MA: { ctx: "No Maranhão, o condutor apresenta defesa prévia e recorre à JARI ligada ao órgão autuador (como o DETRAN-MA). Mantida a multa, cabe recurso ao CETRAN-MA, segunda instância administrativa, conforme o CTB.", fq: "Qual o papel do CETRAN-MA?", fa: "O Conselho Estadual de Trânsito do Maranhão julga o recurso em segunda instância quando a JARI nega o pedido, encerrando a discussão administrativa." },
  MG: { ctx: "Em Minas Gerais, a autuação é discutida na defesa prévia e, depois, na JARI do órgão autuador — o DETRAN-MG nas infrações estaduais. Negado o recurso, a segunda instância é o CETRAN-MG, nos prazos do Código de Trânsito Brasileiro.", fq: "Recurso de multa estadual em Minas: para onde?", fa: "Vai à JARI vinculada ao DETRAN-MG e, se indeferido, ao CETRAN-MG. Multas municipais seguem pelo órgão de trânsito do município." },
  MS: { ctx: "No Mato Grosso do Sul, cabe defesa prévia e recurso à JARI do órgão que aplicou a multa (como o DETRAN-MS). Se a JARI mantiver a penalidade, o recurso segue ao CETRAN-MS, última instância administrativa prevista no CTB.", fq: "O que é o CETRAN-MS?", fa: "É o Conselho Estadual de Trânsito do Mato Grosso do Sul, que julga o recurso em segunda e última instância administrativa." },
  MT: { ctx: "No Mato Grosso, o motorista apresenta defesa prévia e recorre à JARI do órgão autuador; nas infrações estaduais, o DETRAN-MT. Indeferido, o caso vai ao CETRAN-MT, encerrando a via administrativa conforme o CTB.", fq: "Quem julga em segunda instância no Mato Grosso?", fa: "O CETRAN-MT (Conselho Estadual de Trânsito) reexamina o recurso quando a JARI mantém a multa." },
  PA: { ctx: "No Pará, a penalidade é contestada por defesa prévia e recurso à JARI ligada ao órgão autuador (como o DETRAN-PA). Mantida a multa, cabe recurso ao CETRAN-PA, segunda instância administrativa, nos prazos do CTB.", fq: "Para que serve o CETRAN-PA?", fa: "É o Conselho Estadual de Trânsito do Pará, última instância administrativa: julga o recurso após a JARI negar o pedido." },
  PB: { ctx: "Na Paraíba, cabe defesa prévia e, depois, recurso à JARI do órgão que autuou; nas infrações estaduais, o DETRAN-PB. Negado o recurso, a segunda instância é o CETRAN-PB, conforme o Código de Trânsito Brasileiro.", fq: "Multa municipal e estadual na Paraíba?", fa: "Municipais tramitam no órgão do município; estaduais no DETRAN-PB. O 1º recurso vai à JARI e, nas estaduais, a 2ª ao CETRAN-PB." },
  PE: { ctx: "Em Pernambuco, a autuação é discutida na defesa prévia e na JARI do órgão autuador (como o DETRAN-PE). Se a JARI negar, o recurso segue ao CETRAN-PE, última instância administrativa prevista no CTB.", fq: "Qual o papel do CETRAN-PE?", fa: "O Conselho Estadual de Trânsito de Pernambuco julga o recurso em segunda instância quando a JARI mantém a penalidade." },
  PI: { ctx: "No Piauí, o condutor apresenta defesa prévia e recorre à JARI ligada ao órgão autuador; nas infrações estaduais, o DETRAN-PI. Mantida a multa, cabe recurso ao CETRAN-PI, segunda instância administrativa, nos prazos do CTB.", fq: "O que é o CETRAN-PI?", fa: "É o Conselho Estadual de Trânsito do Piauí, que encerra a discussão administrativa ao julgar o recurso após a JARI." },
  PR: { ctx: "No Paraná, a defesa começa pela defesa prévia e segue pela JARI do órgão autuador — o DETRAN-PR nas infrações estaduais. Indeferido o recurso, a segunda instância é o CETRAN-PR, conforme o Código de Trânsito Brasileiro.", fq: "Recurso de multa estadual no Paraná?", fa: "Vai à JARI vinculada ao DETRAN-PR e, se negado, ao CETRAN-PR. Multas municipais seguem pelo órgão de trânsito do município." },
  RJ: { ctx: "No Rio de Janeiro, a autuação é contestada por defesa prévia e recurso à JARI do órgão autuador (como o DETRAN-RJ). Mantida a penalidade, o recurso segue ao CETRAN-RJ, última instância administrativa prevista no CTB.", fq: "Quem julga em segunda instância no RJ?", fa: "O CETRAN-RJ (Conselho Estadual de Trânsito) reexamina o recurso quando a JARI mantém a multa." },
  RN: { ctx: "No Rio Grande do Norte, cabe defesa prévia e recurso à JARI do órgão que aplicou a multa; nas infrações estaduais, o DETRAN-RN. Negado, o caso vai ao CETRAN-RN, encerrando a via administrativa conforme o CTB.", fq: "O que faz o CETRAN-RN?", fa: "É o Conselho Estadual de Trânsito do Rio Grande do Norte, segunda e última instância administrativa de recursos." },
  RO: { ctx: "Em Rondônia, o motorista apresenta defesa prévia e recorre à JARI ligada ao órgão autuador (como o DETRAN-RO). Mantida a multa, cabe recurso ao CETRAN-RO, segunda instância administrativa, nos prazos do CTB.", fq: "Para que serve o CETRAN-RO?", fa: "Julga o recurso em segunda instância quando a JARI de Rondônia mantém a penalidade." },
  RR: { ctx: "Em Roraima, a autuação é discutida na defesa prévia e na JARI do órgão autuador; nas infrações estaduais, o DETRAN-RR. Se a JARI negar, o recurso segue ao CETRAN-RR, última instância administrativa prevista no CTB.", fq: "O que é o CETRAN-RR?", fa: "É o Conselho Estadual de Trânsito de Roraima, que encerra a via administrativa ao julgar o recurso após a JARI." },
  RS: { ctx: "No Rio Grande do Sul, a defesa começa pela defesa prévia e segue pela JARI do órgão autuador — o DETRAN-RS nas infrações estaduais. Indeferido, a segunda instância é o CETRAN-RS, conforme o Código de Trânsito Brasileiro.", fq: "Recurso de multa estadual no RS?", fa: "Vai à JARI vinculada ao DETRAN-RS e, se negado, ao CETRAN-RS; multas municipais tramitam no órgão do município." },
  SC: { ctx: "Em Santa Catarina, cabe defesa prévia e recurso à JARI do órgão que autuou (como o DETRAN-SC). Mantida a multa, o recurso segue ao CETRAN-SC, última instância administrativa prevista no CTB.", fq: "Qual o papel do CETRAN-SC?", fa: "O Conselho Estadual de Trânsito de Santa Catarina julga o recurso em segunda instância quando a JARI mantém a penalidade." },
  SE: { ctx: "Em Sergipe, o condutor apresenta defesa prévia e recorre à JARI ligada ao órgão autuador; nas infrações estaduais, o DETRAN-SE. Negado, o caso vai ao CETRAN-SE, encerrando a via administrativa conforme o CTB.", fq: "O que é o CETRAN-SE?", fa: "É o Conselho Estadual de Trânsito de Sergipe, segunda e última instância administrativa de recursos." },
  SP: { ctx: "Em São Paulo, a autuação é contestada por defesa prévia e recurso à JARI do órgão autuador — o DETRAN-SP nas infrações estaduais. Mantida a penalidade, a segunda instância é o CETRAN-SP, nos prazos do Código de Trânsito Brasileiro.", fq: "Recurso de multa estadual em São Paulo?", fa: "Vai à JARI vinculada ao DETRAN-SP e, se negado, ao CETRAN-SP; multas municipais seguem pelo órgão de trânsito do município." },
  TO: { ctx: "No Tocantins, cabe defesa prévia e recurso à JARI do órgão que aplicou a multa (como o DETRAN-TO). Se a JARI mantiver a penalidade, o recurso segue ao CETRAN-TO, última instância administrativa prevista no CTB.", fq: "O que faz o CETRAN-TO?", fa: "É o Conselho Estadual de Trânsito do Tocantins, que julga o recurso em segunda instância após a JARI." }
};

export const contextoEstadual = (uf: string) => UF_CONTEXTO[uf.toUpperCase()]?.ctx || "";

/** Monta todo o conteúdo localizado de uma cidade, com variação determinística. */
export const conteudoRecurso = (c: City) => {
  const seed = seedFrom(c.id);
  const uc = UF_CONTEXTO[c.uf.toUpperCase()];
  const faq = faqLocal(c);
  if (uc && uc.fq) faq.push({ q: uc.fq, a: uc.fa });
  return {
    intro: pick(INTROS, seed)(c),
    porque: pick(PORQUE, seed >> 3)(c),
    contextoEstadual: uc ? uc.ctx : "",
    fases: fasesLocais(c),
    teses: shuffleSeeded(TESES, seed),
    faq,
    detran: detranOf(c.uf)
  };
};
