/**
 * Allow-list curada dos artigos do blog que receberão versão localizada
 * em /blog/[slug]/em/[cidade-uf].
 *
 * Princípio: nem todo artigo do blog merece versão por cidade. Só artigos
 * com clara intenção de busca LOCAL ("como pedir divórcio em [cidade]",
 * "como pedir pensão em [cidade]") e que envolvam ação concreta (foro,
 * cartório, defensoria pública, OAB seccional) ganham versão local.
 *
 * Critérios de inclusão:
 *  - Alto volume de busca local conhecido
 *  - Conteúdo onde varia a aplicação por cidade (varas, prazos do TJ local)
 *  - Não-canibalização com /problemas-juridicos/[slug]/em/[cidade]
 *
 * Editor pode adicionar novos slugs aqui conforme o blog cresce.
 */

import type { Article } from "./articles";
import { getAllArticles, getArticleBySlug } from "./articles";

/**
 * Slugs dos artigos do blog que terão versão localizada por cidade.
 *
 * Cada slug DEVE existir em lib/data/articles.ts ARTICLES — o helper
 * resolveArticlesCidades() valida no build e filtra silenciosamente
 * slugs órfãos (defesa em profundidade contra typo).
 */
export const ARTIGOS_LOCALIZAVEIS_SLUGS: string[] = [
  "como-pedir-divorcio",
  "como-pedir-pensao-alimenticia",
  "fui-demitido-sem-justa-causa",
  "banco-cobrou-taxa-indevida",
  "inss-negou-beneficio-o-que-fazer",
  "como-fazer-inventario",
  "multa-de-transito-como-recorrer",
  "como-entrar-com-acao-no-juizado-do-consumidor",
  "acordo-trabalhista-vale-a-pena",
  "acao-de-despejo-como-funciona",
  "usucapiao-como-dar-entrada",
  "bpc-loas-quem-tem-direito",
  "saque-fgts-modalidades-e-prazos",
  "cnh-suspensa-o-que-fazer",
  "pensao-alimenticia-como-calcular",
  "limpar-nome-negativado-passo-a-passo",
  "inventario-como-fazer-custos-e-prazos",
  "como-dar-entrada-no-inss-pelo-meu-inss",
  "assedio-moral-no-trabalho-o-que-fazer",
  "acidente-de-transito-quem-paga-o-conserto",
  "plano-de-saude-negou-cobertura-o-que-fazer",
  "como-funciona-a-guarda-compartilhada",
  "aposentadoria-por-idade-regras-e-como-pedir",
  "seguro-de-vida-negado-como-recorrer",
  "revisao-de-financiamento-de-veiculo-vale-a-pena",
  "rescisao-indireta-como-funciona",
  "trabalho-sem-carteira-assinada-direitos",
  "escala-6x1-o-que-diz-a-lei",
  "auxilio-doenca-como-pedir-e-recorrer",
  "seguro-desemprego-quem-tem-direito-e-como-pedir",
  "ferias-como-funcionam-venda-atraso-e-calculo",
  "horas-extras-como-calcular-e-como-provar",
  "contrato-de-aluguel-direitos-do-inquilino",
  "pensao-por-morte-quem-tem-direito-e-como-pedir"
];

/**
 * Resolve a allow-list contra os artigos reais do banco.
 * Filtra slugs inválidos (caso alguém remova um artigo sem atualizar a
 * allow-list) e mantém só os que existem.
 */
let _cached: Article[] | null = null;
export function getArtigosLocalizaveis(): Article[] {
  if (_cached) return _cached;
  const out: Article[] = [];
  for (const slug of ARTIGOS_LOCALIZAVEIS_SLUGS) {
    const art = getArticleBySlug(slug);
    if (art) out.push(art);
  }
  _cached = out;
  return out;
}

/** True se o slug está na allow-list */
export function isArtigoLocalizavel(slug: string): boolean {
  return ARTIGOS_LOCALIZAVEIS_SLUGS.includes(slug);
}

/** Conta total esperada de URLs: artigos × cidades */
export function expectedBlogCidadesUrlCount(citiesCount: number): number {
  return getArtigosLocalizaveis().length * citiesCount;
}

// Re-export pra evitar imports redundantes nas rotas
export { getAllArticles };
