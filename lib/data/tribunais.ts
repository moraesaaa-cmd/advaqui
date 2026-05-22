/**
 * Mapa de tribunais e órgãos do sistema de Justiça brasileiro por UF.
 *
 * Páginas /tribunais/[uf]/[cidade] usam essa estrutura como base.
 *
 * Estrutura:
 *  - TRIBUNAL_POR_UF — TJ, TRT, TRE de cada estado (com site e jurisdição)
 *  - ORGAOS_FEDERAIS — TST, TSE, STJ, STF (válidos em todo o país)
 *
 * Nomes de varas, fóruns e endereços específicos de cada cidade ficam
 * gerados dinamicamente no template — não temos base de fórum cidade
 * por cidade (cada cidade pequena tem só comarca da capital + JEC).
 * Mostramos onde ir e como buscar.
 */

export type TribunalUF = {
  uf: string;
  tj_nome: string;
  tj_site: string;
  trt_numero: number;
  trt_site: string;
  tre_site: string;
  /** Cidade onde o TJ tem sede. */
  tj_sede: string;
  /** Cidade onde o TRT tem sede (pode ser outra UF para alguns regionais). */
  trt_sede: string;
  /** Quantas comarcas o TJ tem no estado (referencial). */
  qtd_comarcas: number;
};

export const TRIBUNAIS_UF: Record<string, TribunalUF> = {
  AC: {
    uf: "AC",
    tj_nome: "TJ-AC",
    tj_site: "https://www.tjac.jus.br",
    trt_numero: 14,
    trt_site: "https://www.trt14.jus.br",
    tre_site: "https://www.tre-ac.jus.br",
    tj_sede: "Rio Branco",
    trt_sede: "Porto Velho",
    qtd_comarcas: 22
  },
  AL: {
    uf: "AL",
    tj_nome: "TJ-AL",
    tj_site: "https://www.tjal.jus.br",
    trt_numero: 19,
    trt_site: "https://www.trt19.jus.br",
    tre_site: "https://www.tre-al.jus.br",
    tj_sede: "Maceió",
    trt_sede: "Maceió",
    qtd_comarcas: 80
  },
  AP: {
    uf: "AP",
    tj_nome: "TJ-AP",
    tj_site: "https://www.tjap.jus.br",
    trt_numero: 8,
    trt_site: "https://www.trt8.jus.br",
    tre_site: "https://www.tre-ap.jus.br",
    tj_sede: "Macapá",
    trt_sede: "Belém",
    qtd_comarcas: 16
  },
  AM: {
    uf: "AM",
    tj_nome: "TJ-AM",
    tj_site: "https://www.tjam.jus.br",
    trt_numero: 11,
    trt_site: "https://www.trt11.jus.br",
    tre_site: "https://www.tre-am.jus.br",
    tj_sede: "Manaus",
    trt_sede: "Manaus",
    qtd_comarcas: 60
  },
  BA: {
    uf: "BA",
    tj_nome: "TJ-BA",
    tj_site: "https://www.tjba.jus.br",
    trt_numero: 5,
    trt_site: "https://www.trt5.jus.br",
    tre_site: "https://www.tre-ba.jus.br",
    tj_sede: "Salvador",
    trt_sede: "Salvador",
    qtd_comarcas: 433
  },
  CE: {
    uf: "CE",
    tj_nome: "TJ-CE",
    tj_site: "https://www.tjce.jus.br",
    trt_numero: 7,
    trt_site: "https://www.trt7.jus.br",
    tre_site: "https://www.tre-ce.jus.br",
    tj_sede: "Fortaleza",
    trt_sede: "Fortaleza",
    qtd_comarcas: 184
  },
  DF: {
    uf: "DF",
    tj_nome: "TJDFT",
    tj_site: "https://www.tjdft.jus.br",
    trt_numero: 10,
    trt_site: "https://www.trt10.jus.br",
    tre_site: "https://www.tre-df.jus.br",
    tj_sede: "Brasília",
    trt_sede: "Brasília",
    qtd_comarcas: 1
  },
  ES: {
    uf: "ES",
    tj_nome: "TJ-ES",
    tj_site: "https://www.tjes.jus.br",
    trt_numero: 17,
    trt_site: "https://www.trt17.jus.br",
    tre_site: "https://www.tre-es.jus.br",
    tj_sede: "Vitória",
    trt_sede: "Vitória",
    qtd_comarcas: 70
  },
  GO: {
    uf: "GO",
    tj_nome: "TJ-GO",
    tj_site: "https://www.tjgo.jus.br",
    trt_numero: 18,
    trt_site: "https://www.trt18.jus.br",
    tre_site: "https://www.tre-go.jus.br",
    tj_sede: "Goiânia",
    trt_sede: "Goiânia",
    qtd_comarcas: 246
  },
  MA: {
    uf: "MA",
    tj_nome: "TJ-MA",
    tj_site: "https://www.tjma.jus.br",
    trt_numero: 16,
    trt_site: "https://www.trt16.jus.br",
    tre_site: "https://www.tre-ma.jus.br",
    tj_sede: "São Luís",
    trt_sede: "São Luís",
    qtd_comarcas: 217
  },
  MT: {
    uf: "MT",
    tj_nome: "TJ-MT",
    tj_site: "https://www.tjmt.jus.br",
    trt_numero: 23,
    trt_site: "https://www.trt23.jus.br",
    tre_site: "https://www.tre-mt.jus.br",
    tj_sede: "Cuiabá",
    trt_sede: "Cuiabá",
    qtd_comarcas: 141
  },
  MS: {
    uf: "MS",
    tj_nome: "TJ-MS",
    tj_site: "https://www.tjms.jus.br",
    trt_numero: 24,
    trt_site: "https://www.trt24.jus.br",
    tre_site: "https://www.tre-ms.jus.br",
    tj_sede: "Campo Grande",
    trt_sede: "Campo Grande",
    qtd_comarcas: 79
  },
  MG: {
    uf: "MG",
    tj_nome: "TJ-MG",
    tj_site: "https://www.tjmg.jus.br",
    trt_numero: 3,
    trt_site: "https://portal.trt3.jus.br",
    tre_site: "https://www.tre-mg.jus.br",
    tj_sede: "Belo Horizonte",
    trt_sede: "Belo Horizonte",
    qtd_comarcas: 853
  },
  PA: {
    uf: "PA",
    tj_nome: "TJ-PA",
    tj_site: "https://www.tjpa.jus.br",
    trt_numero: 8,
    trt_site: "https://www.trt8.jus.br",
    tre_site: "https://www.tre-pa.jus.br",
    tj_sede: "Belém",
    trt_sede: "Belém",
    qtd_comarcas: 144
  },
  PB: {
    uf: "PB",
    tj_nome: "TJ-PB",
    tj_site: "https://www.tjpb.jus.br",
    trt_numero: 13,
    trt_site: "https://www.trt13.jus.br",
    tre_site: "https://www.tre-pb.jus.br",
    tj_sede: "João Pessoa",
    trt_sede: "João Pessoa",
    qtd_comarcas: 223
  },
  PR: {
    uf: "PR",
    tj_nome: "TJ-PR",
    tj_site: "https://www.tjpr.jus.br",
    trt_numero: 9,
    trt_site: "https://www.trt9.jus.br",
    tre_site: "https://www.tre-pr.jus.br",
    tj_sede: "Curitiba",
    trt_sede: "Curitiba",
    qtd_comarcas: 399
  },
  PE: {
    uf: "PE",
    tj_nome: "TJ-PE",
    tj_site: "https://www.tjpe.jus.br",
    trt_numero: 6,
    trt_site: "https://www.trt6.jus.br",
    tre_site: "https://www.tre-pe.jus.br",
    tj_sede: "Recife",
    trt_sede: "Recife",
    qtd_comarcas: 185
  },
  PI: {
    uf: "PI",
    tj_nome: "TJ-PI",
    tj_site: "https://www.tjpi.jus.br",
    trt_numero: 22,
    trt_site: "https://www.trt22.jus.br",
    tre_site: "https://www.tre-pi.jus.br",
    tj_sede: "Teresina",
    trt_sede: "Teresina",
    qtd_comarcas: 224
  },
  RJ: {
    uf: "RJ",
    tj_nome: "TJ-RJ",
    tj_site: "https://www.tjrj.jus.br",
    trt_numero: 1,
    trt_site: "https://www.trt1.jus.br",
    tre_site: "https://www.tre-rj.jus.br",
    tj_sede: "Rio de Janeiro",
    trt_sede: "Rio de Janeiro",
    qtd_comarcas: 92
  },
  RN: {
    uf: "RN",
    tj_nome: "TJ-RN",
    tj_site: "https://www.tjrn.jus.br",
    trt_numero: 21,
    trt_site: "https://www.trt21.jus.br",
    tre_site: "https://www.tre-rn.jus.br",
    tj_sede: "Natal",
    trt_sede: "Natal",
    qtd_comarcas: 167
  },
  RS: {
    uf: "RS",
    tj_nome: "TJ-RS",
    tj_site: "https://www.tjrs.jus.br",
    trt_numero: 4,
    trt_site: "https://www.trt4.jus.br",
    tre_site: "https://www.tre-rs.jus.br",
    tj_sede: "Porto Alegre",
    trt_sede: "Porto Alegre",
    qtd_comarcas: 497
  },
  RO: {
    uf: "RO",
    tj_nome: "TJ-RO",
    tj_site: "https://www.tjro.jus.br",
    trt_numero: 14,
    trt_site: "https://www.trt14.jus.br",
    tre_site: "https://www.tre-ro.jus.br",
    tj_sede: "Porto Velho",
    trt_sede: "Porto Velho",
    qtd_comarcas: 52
  },
  RR: {
    uf: "RR",
    tj_nome: "TJ-RR",
    tj_site: "https://www.tjrr.jus.br",
    trt_numero: 11,
    trt_site: "https://www.trt11.jus.br",
    tre_site: "https://www.tre-rr.jus.br",
    tj_sede: "Boa Vista",
    trt_sede: "Manaus",
    qtd_comarcas: 15
  },
  SC: {
    uf: "SC",
    tj_nome: "TJ-SC",
    tj_site: "https://www.tjsc.jus.br",
    trt_numero: 12,
    trt_site: "https://www.trt12.jus.br",
    tre_site: "https://www.tre-sc.jus.br",
    tj_sede: "Florianópolis",
    trt_sede: "Florianópolis",
    qtd_comarcas: 295
  },
  SP: {
    uf: "SP",
    tj_nome: "TJ-SP",
    tj_site: "https://www.tjsp.jus.br",
    trt_numero: 2,
    trt_site: "https://ww2.trt2.jus.br",
    tre_site: "https://www.tre-sp.jus.br",
    tj_sede: "São Paulo",
    trt_sede: "São Paulo",
    qtd_comarcas: 645
  },
  SE: {
    uf: "SE",
    tj_nome: "TJ-SE",
    tj_site: "https://www.tjse.jus.br",
    trt_numero: 20,
    trt_site: "https://www.trt20.jus.br",
    tre_site: "https://www.tre-se.jus.br",
    tj_sede: "Aracaju",
    trt_sede: "Aracaju",
    qtd_comarcas: 75
  },
  TO: {
    uf: "TO",
    tj_nome: "TJ-TO",
    tj_site: "https://www.tjto.jus.br",
    trt_numero: 10,
    trt_site: "https://www.trt10.jus.br",
    tre_site: "https://www.tre-to.jus.br",
    tj_sede: "Palmas",
    trt_sede: "Brasília",
    qtd_comarcas: 139
  }
};

export const ORGAOS_FEDERAIS: Array<{ nome: string; sigla: string; site: string; alcance: string }> = [
  {
    nome: "Supremo Tribunal Federal",
    sigla: "STF",
    site: "https://www.stf.jus.br",
    alcance: "Última instância — Constituição Federal, conflitos entre União e estados, controle de constitucionalidade."
  },
  {
    nome: "Superior Tribunal de Justiça",
    sigla: "STJ",
    site: "https://www.stj.jus.br",
    alcance: "Última instância — leis federais (não constitucionais), divergência entre TJs."
  },
  {
    nome: "Tribunal Superior do Trabalho",
    sigla: "TST",
    site: "https://www.tst.jus.br",
    alcance: "Última instância em direito do trabalho — uniformiza jurisprudência dos TRTs."
  },
  {
    nome: "Tribunal Superior Eleitoral",
    sigla: "TSE",
    site: "https://www.tse.jus.br",
    alcance: "Última instância eleitoral — registro de candidatos, julgamento de crimes eleitorais, regulamentação."
  },
  {
    nome: "Tribunal de Contas da União",
    sigla: "TCU",
    site: "https://www.tcu.gov.br",
    alcance: "Fiscalização de contas públicas federais — atos de admissão, aposentadoria, irregularidades em obras federais."
  }
];

export function findTribunalUf(uf: string): TribunalUF | undefined {
  return TRIBUNAIS_UF[uf.toUpperCase()];
}
