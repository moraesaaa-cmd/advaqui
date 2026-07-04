/**
 * Contexto local único por cidade — anti thin-content nas páginas /em/[cidade].
 *
 * PROBLEMA (auditoria SEO 2026-07-05): as páginas /em/cidade repetiam o MESMO
 * parágrafo "local" (só trocando o nome da cidade) em 5.571 cidades → Google
 * trata como quase-duplicata e devolve "Descoberta/Rastreada não indexada".
 *
 * SOLUÇÃO: gerar 2 parágrafos GENUINAMENTE variados por cidade, de forma
 * DETERMINÍSTICA (hash do slug+assunto seleciona de pools), interpolando dados
 * REAIS do estado (nome, capital, região, instituições que existem em todo
 * estado: TJ, Defensoria, OAB seccional, Procon, CEJUSC) — sem IA, sem custo de
 * runtime, sem fetch, sem inventar fato específico da cidade. Cada página passa
 * a ter texto local distinto tanto pelo hash quanto pelo bloco por UF.
 *
 * Reutilizável em qualquer família /em/cidade (glossário, blog, guias, etc.).
 */

import { findState } from "@/lib/data/states";

/** Hash estável (djb2) — determinístico, sem Math.random/Date. */
function hashInt(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  return h;
}

const pick = <T,>(arr: T[], seed: number): T => arr[seed % arr.length];

// Aberturas — situam o assunto na cidade/foro. {cid}=cidade, {uf}, {est}=estado.
const ABERTURAS = [
  "Em {cid}/{uf}, quem enfrenta essa situação costuma resolver na comarca local, vinculada ao Tribunal de Justiça de {est}.",
  "Para moradores de {cid}, no {uf}, o caminho começa no fórum da própria comarca ou nas comarcas da região, sob a jurisdição do Tribunal de Justiça de {est}.",
  "Na prática, em {cid}/{uf}, o que define o dia a dia do caso é a vara competente da comarca e o calendário do foro local — a lei aplicada é a federal, igual em todo o país.",
  "Quem mora em {cid} ({uf}) trata desse tema perante a Justiça estadual de {est} ou, conforme a matéria, na Justiça Federal e nos juizados especiais da região.",
  "Em {cid}/{uf}, a regra jurídica é a mesma do resto do Brasil; o que muda é a estrutura local: a vara competente, o tempo de tramitação e os canais de atendimento disponíveis.",
  "Morador de {cid}, no {uf}? O tratamento desse assunto passa pela comarca local e pelo Tribunal de Justiça de {est}, respeitando os prazos previstos em lei."
];

// Canais de apoio — instituições que existem em todos os estados (sem inventar
// endereço/telefone específico da cidade).
const CANAIS = [
  "Para orientação gratuita, {cid} conta com os canais públicos do estado: a Defensoria Pública de {est} (para quem não pode pagar advogado), a subseção da OAB {uf} e, em questões de consumo, o Procon.",
  "Quem precisa de ajuda sem custo pode procurar a Defensoria Pública de {est}, o Procon (em casos de consumidor) e a OAB {uf}, além dos CEJUSCs, que fazem acordos antes do processo.",
  "Em {cid} e região, há caminhos gratuitos: Defensoria Pública de {est}, CEJUSC (conciliação), Procon para relações de consumo e a OAB {uf} para tirar dúvidas e encontrar profissionais.",
  "Além do advogado particular, moradores de {cid}/{uf} têm à disposição a Defensoria Pública de {est}, os juizados especiais (para causas menores, sem custas iniciais) e o Procon nos casos de consumo.",
  "Vale conhecer os canais do estado: Defensoria Pública de {est}, mutirões e CEJUSCs do Tribunal de Justiça, Procon e a OAB {uf} — úteis antes mesmo de entrar com uma ação."
];

// Fechos — chamada para agir com apoio local, sem prometer resultado (OAB).
const FECHOS = [
  "Como cada caso tem detalhes que mudam o resultado, o ideal é conversar com um advogado que atue em {cid} e conheça a Justiça de {est}.",
  "Antes de qualquer decisão, vale a orientação de um advogado da região de {cid} — ele avalia o seu caso concreto e os prazos aplicáveis.",
  "Um advogado que atende em {cid}/{uf} pode dizer, com base nos seus documentos, qual o melhor caminho e o que esperar de cada etapa.",
  "Para não perder prazo nem direito, procure um advogado atuante em {cid} e região; a orientação inicial costuma esclarecer bastante.",
  "O passo mais seguro é falar com um advogado de {cid} ({uf}) sobre a sua situação específica antes de agir."
];

// Nota regional — varia por região do país.
const REGIONAIS: Record<string, string> = {
  Norte: "Na região Norte, distâncias maiores entre comarcas e o uso do processo eletrônico tornam ainda mais importante organizar os documentos antes de procurar a Justiça.",
  Nordeste: "No Nordeste, a rede de Defensorias e juizados é ampla, e boa parte dos atos já é feita por meio eletrônico, o que agiliza quem se organiza com antecedência.",
  "Centro-Oeste": "No Centro-Oeste, a proximidade com a capital {capital} facilita o acesso a órgãos estaduais, mas muitos trâmites já são resolvidos online, sem deslocamento.",
  Sudeste: "No Sudeste, o grande volume de processos torna comum o uso de juizados especiais e mutirões de conciliação para dar mais velocidade aos casos.",
  Sul: "No Sul, a estrutura de CEJUSCs e juizados é bem distribuída, e a conciliação prévia costuma ser um caminho rápido antes do processo."
};

/**
 * Retorna 2 parágrafos de contexto local ÚNICOS por (cidade + assunto).
 * @param assunto rótulo do tema (ex.: o termo do glossário) — entra no hash
 *                para que termos diferentes na MESMA cidade também variem.
 */
export function localLegalContext(opts: {
  cityName: string;
  uf: string;
  citySlug: string;
  assunto: string;
}): string[] {
  const est = findState(opts.uf);
  const estNome = est?.name || opts.uf;
  const capital = est?.capital || "";
  const region = est?.region || "";
  const isCapital = est ? est.capital.toLowerCase() === opts.cityName.toLowerCase() : false;

  const fill = (s: string) =>
    s
      .split("{cid}").join(opts.cityName)
      .split("{uf}").join(opts.uf.toUpperCase())
      .split("{est}").join(estNome)
      .split("{capital}").join(capital);

  const seed = hashInt(`${opts.citySlug}|${opts.uf}|${opts.assunto}`);

  const p1 = `${fill(pick(ABERTURAS, seed))} ${fill(pick(CANAIS, seed >> 3))}`;

  const regional = fill(REGIONAIS[region] || "");
  const capitalNote = isCapital
    ? `Como ${opts.cityName} é a capital de ${estNome}, concentra varas especializadas e os principais órgãos estaduais, o que costuma ampliar as opções de atendimento. `
    : `Sendo ${opts.cityName} um município do interior de ${estNome}, alguns procedimentos podem tramitar em comarca regional ou na capital ${capital}, dependendo da matéria. `;

  const p2 = `${capitalNote}${regional ? regional + " " : ""}${fill(pick(FECHOS, seed >> 6))}`;

  return [p1.trim(), p2.trim()];
}
