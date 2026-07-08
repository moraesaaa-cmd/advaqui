/**
 * Fallback global de navegação (App Router).
 *
 * Antes mostrava um spinner grande com a palavra "Carregando…" no slot <section>.
 * Como o layout (header, CTA de recrutamento, footer) é renderizado ao redor
 * deste fallback enquanto a Server Component busca dados, o usuário via
 * "Carregando…" seguido do rodapé/CTA e só depois o conteúdo — parecia página
 * quebrada/fora de ordem. Um skeleton com a MESMA silhueta do conteúdo elimina
 * essa impressão: a área principal já ocupa o espaço certo e o swap é suave.
 * Sem texto de estado (nada de "Carregando…") para não poluir leitura/robôs.
 */
export default function Loading() {
  return (
    <div className="container-tight py-10 animate-pulse" aria-hidden>
      <div className="h-4 w-40 rounded bg-brand-line/70" />
      <div className="mt-6 h-9 w-3/4 max-w-xl rounded-lg bg-brand-line/70" />
      <div className="mt-3 h-4 w-2/3 max-w-lg rounded bg-brand-line/50" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-brand-line bg-white p-5">
            <div className="h-10 w-10 rounded-xl bg-brand-line/70" />
            <div className="mt-4 h-4 w-2/3 rounded bg-brand-line/70" />
            <div className="mt-2 h-3 w-full rounded bg-brand-line/40" />
            <div className="mt-1.5 h-3 w-5/6 rounded bg-brand-line/40" />
          </div>
        ))}
      </div>
      <span className="sr-only" role="status">Carregando conteúdo</span>
    </div>
  );
}
