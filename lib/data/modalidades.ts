/**
 * Modalidades, tipos e perspectivas usadas como 3ª dimensão de cruzamento
 * em rotas hiperlocais. Cada uma adiciona contexto específico à URL base.
 *
 * Usado nas rotas:
 *   /quanto-custa/[slug]/em/[cidade]/modalidade-[m]
 *   /calculadoras/[slug]/em/[cidade]/tipo-[t]
 *   /guias/[slug]/em/[cidade]/publico-[p]
 *   /glossario/[termo]/em/[cidade]/uso-[u]
 *   /modelos/[slug]/em/[cidade]/uso-[u]
 *   /blog/[slug]/em/[cidade]/situacao-[s]
 *   /jurisprudencia/{stj,stf}/tema/[slug]/em/[cidade]/area-[a]
 *   /problemas-juridicos/[slug]/em/[cidade]/area-[a]
 *   /advogado/[area]/em/[cidade]/atende-[m]
 */

export const MODALIDADES_ATENDIMENTO = [
  { slug: "online", nome: "atendimento online", descricao: "videochamada, e-mail e WhatsApp; o cliente nem precisa sair de casa." },
  { slug: "presencial", nome: "atendimento presencial", descricao: "no escritório do advogado ou em local combinado." },
  { slug: "urgente", nome: "atendimento urgente", descricao: "prazos curtos, plantão, medidas liminares no mesmo dia." }
];

export const CALCULADORA_TIPOS = [
  { slug: "clt", nome: "para trabalhador CLT", descricao: "regime celetista padrão, com carteira assinada, contribuições mensais." },
  { slug: "mei", nome: "para MEI / microempreendedor", descricao: "regime simplificado, contribuição reduzida, declaração anual." },
  { slug: "autonomo", nome: "para autônomo", descricao: "sem vínculo empregatício, contribuição como contribuinte individual." }
];

export const GUIA_PUBLICOS = [
  { slug: "cidadao", nome: "para cidadão comum", descricao: "linguagem simples, sem jurídiquês, com passo a passo prático." },
  { slug: "advogado", nome: "para advogado iniciante", descricao: "estratégia processual, jurisprudência relevante, doutrina." }
];

export const GLOSSARIO_USOS = [
  { slug: "contrato", nome: "uso em contratos", descricao: "como esse termo aparece em contratos típicos e o que significa na prática." },
  { slug: "processo", nome: "uso em processo judicial", descricao: "como o termo é usado em petições, audiências e sentenças." },
  { slug: "cotidiano", nome: "uso cotidiano", descricao: "quando você ouve esse termo no banco, no INSS, no Procon ou na imprensa." }
];

export const MODELO_USOS = [
  { slug: "particular", nome: "uso particular", descricao: "entre pessoas físicas, sem registro obrigatório." },
  { slug: "comercial", nome: "uso comercial", descricao: "entre empresas ou empresa e cliente, com obrigações fiscais." },
  { slug: "publico", nome: "uso junto a órgãos públicos", descricao: "apresentação em repartição pública, exige reconhecimento de firma em alguns casos." }
];

export const BLOG_SITUACOES = [
  { slug: "primeira-vez", nome: "primeira vez que isso acontece com você", descricao: "guia introdutório, sem assumir conhecimento prévio." },
  { slug: "reincidente", nome: "já passou por isso antes", descricao: "foco em variações e armadilhas do caso reincidente." },
  { slug: "urgencia", nome: "situação urgente, prazos curtos", descricao: "passos imediatos pra evitar prejuízo maior." },
  { slug: "valor-alto", nome: "valor alto envolvido", descricao: "estratégia processual quando o impacto financeiro é grande." }
];

export const JURIS_ASPECTOS = [
  { slug: "doutrina", nome: "doutrina aplicável", descricao: "interpretação dos juristas sobre esse tema." },
  { slug: "sumula", nome: "súmulas e enunciados", descricao: "verbetes consolidados sobre o tema." },
  { slug: "recurso", nome: "viabilidade de recurso", descricao: "quando vale a pena recorrer e qual via processual usar." }
];
