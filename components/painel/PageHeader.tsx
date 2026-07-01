import type { ReactNode } from "react";

/**
 * Cabeçalho padrão das páginas do painel: título em Fraunces,
 * descrição curta e um slot opcional de ações à direita.
 */
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div className="min-w-0">
        <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-brand-ink">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-brand-ink/60 mt-1.5 max-w-xl">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
