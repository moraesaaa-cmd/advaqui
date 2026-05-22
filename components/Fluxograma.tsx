/**
 * Fluxograma visual em SVG inline — usado em artigos do blog pra ilustrar
 * processos passo a passo (divórcio, pensão, INSS, inventário, FGTS).
 *
 * Sem dependências externas. Renderiza vertical com numeração circular,
 * conectores entre passos e descrição abaixo de cada nó.
 *
 * Acessibilidade — cada passo é um item de lista, ARIA-label legível.
 */

type FluxoStep = {
  titulo: string;
  texto: string;
};

export function Fluxograma({
  steps,
  titulo = "Fluxograma do processo"
}: {
  steps: FluxoStep[];
  titulo?: string;
}) {
  if (!steps || steps.length === 0) return null;

  return (
    <figure
      className="my-8 rounded-2xl bg-gradient-to-br from-brand-bg/30 via-white to-brand-accent/5 border-2 border-brand-accent/20 p-5 md:p-7"
      aria-label={titulo}
    >
      <figcaption className="text-xs font-bold uppercase tracking-wider text-brand-deep mb-5 text-center">
        {titulo}
      </figcaption>

      <ol className="relative">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          return (
            <li key={i} className="relative flex gap-4 pb-6 last:pb-0">
              {/* Conector vertical entre nós (linha tracejada) */}
              {!isLast && (
                <span
                  aria-hidden
                  className="absolute left-5 top-11 bottom-0 w-px border-l-2 border-dashed border-brand-accent/40"
                />
              )}

              {/* Nó circular numerado */}
              <div className="flex-shrink-0 z-10">
                <svg
                  viewBox="0 0 40 40"
                  width="40"
                  height="40"
                  className="drop-shadow-sm"
                  role="img"
                  aria-label={`Passo ${i + 1}`}
                >
                  <circle
                    cx="20"
                    cy="20"
                    r="18"
                    fill="#F59E0B"
                    stroke="#1B2021"
                    strokeWidth="2"
                  />
                  <text
                    x="20"
                    y="26"
                    textAnchor="middle"
                    fontFamily="DM Sans, sans-serif"
                    fontWeight="700"
                    fontSize="16"
                    fill="#1B2021"
                  >
                    {i + 1}
                  </text>
                </svg>
              </div>

              {/* Conteúdo do passo */}
              <div className="flex-1 pt-1">
                <p className="font-display text-base md:text-lg font-bold text-brand-ink leading-snug">
                  {step.titulo}
                </p>
                <p className="text-sm md:text-base text-brand-ink/75 leading-relaxed mt-1">
                  {step.texto}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}

/**
 * Quadro comparativo simples — 2 colunas (esquerda × direita).
 * Usado em artigos pra comparar opções (ex. divórcio extrajudicial × judicial).
 */
type ComparativoRow = {
  topico: string;
  esquerda: string;
  direita: string;
};

export function QuadroComparativo({
  titulo,
  colunaEsquerda,
  colunaDireita,
  rows
}: {
  titulo: string;
  colunaEsquerda: string;
  colunaDireita: string;
  rows: ComparativoRow[];
}) {
  if (!rows || rows.length === 0) return null;

  return (
    <figure className="my-8" aria-label={titulo}>
      <figcaption className="text-xs font-bold uppercase tracking-wider text-brand-deep mb-3">
        {titulo}
      </figcaption>
      <div className="overflow-x-auto rounded-2xl border-2 border-brand-line bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-brand-bg/40 border-b border-brand-line">
              <th className="text-left p-3 font-display font-bold text-brand-ink">
                Aspecto
              </th>
              <th className="text-left p-3 font-display font-bold text-brand-deep">
                {colunaEsquerda}
              </th>
              <th className="text-left p-3 font-display font-bold text-brand-deep">
                {colunaDireita}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-line">
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-brand-bg/20">
                <td className="p-3 font-medium text-brand-ink">{r.topico}</td>
                <td className="p-3 text-brand-ink/80">{r.esquerda}</td>
                <td className="p-3 text-brand-ink/80">{r.direita}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
