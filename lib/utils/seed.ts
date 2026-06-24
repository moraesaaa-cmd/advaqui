/**
 * Variação determinística de conteúdo por cidade.
 *
 * Páginas geradas em escala (uma por município) não podem ser cópias idênticas
 * com só o nome trocado — isso é "thin/doorway content" e o Google despromove.
 * Usamos o ID IBGE da cidade como semente estável (mesma cidade → sempre o
 * mesmo texto, bom para cache/canonical) para escolher variantes de redação.
 */

/** Hash FNV-1a — estável e sem dependências; mesma entrada → mesmo número. */
export const seedFrom = (s: string | number): number => {
  const str = String(s);
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
};

/** Escolhe deterministicamente um item do array a partir da semente. */
export const pick = <T>(arr: readonly T[], seed: number): T => arr[seed % arr.length];

/**
 * Embaralha deterministicamente (Fisher-Yates com PRNG semeado). Útil para
 * variar a ORDEM de listas (teses, benefícios) entre cidades sem perder itens.
 */
export const shuffleSeeded = <T>(arr: readonly T[], seed: number): T[] => {
  const out = arr.slice();
  let s = seed || 1;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};
