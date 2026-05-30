import { PROBLEMAS } from "@/lib/data/problemas-juridicos";

/**
 * Índice de busca da Guia Inteligente da home.
 *
 * Transforma cada problema jurídico em um item leve e pesquisável: além do
 * título e da intenção, montamos um "hay" (palheiro) normalizado com as
 * situações reais descritas em linguagem do dia a dia — é isso que permite
 * casar o que a pessoa digita ("não recebi minhas verbas") com o problema
 * certo ("Fui demitido..."), sem juridiquês.
 *
 * Tudo é derivado dos dados já existentes em PROBLEMAS (nenhum dado novo),
 * então cresce automaticamente conforme novos temas são adicionados.
 */
export type ProblemaIndexItem = {
  slug: string;
  titulo: string;
  intencao: string;
  /** slug da área principal (badge) */
  area: string;
  /** caso sensível ao tempo (mostra aviso sutil de urgência) */
  urgente: boolean;
  /** texto normalizado (sem acento, minúsculo) para casamento */
  hay: string;
};

/** Remove acentos e baixa a caixa, para casar texto digitado com os dados. */
export function normalizeText(s: string): string {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

const URGENTE_RE =
  /imediat|urgent|quanto antes|24 ?h|48 ?h|preso|flagrante|prazo|decadenc|prescri|audiencia|despejo|liminar/;

export function getProblemaIndex(): ProblemaIndexItem[] {
  return PROBLEMAS.map((p) => {
    const hayParts = [
      p.titulo,
      p.intencao_curta,
      ...(p.situacao || []),
      ...(p.areas || [])
    ];
    return {
      slug: p.slug,
      titulo: p.titulo,
      intencao: p.intencao_curta,
      area: p.areas?.[0] ?? "civil",
      urgente: URGENTE_RE.test(normalizeText(p.quando_urgente || "")),
      hay: normalizeText(hayParts.join(" · "))
    };
  });
}
