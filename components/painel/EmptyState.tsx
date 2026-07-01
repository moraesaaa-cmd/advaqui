import type { ComponentType, ReactNode } from "react";

/**
 * Empty state padrão do painel: ícone em círculo, frase e CTA opcional.
 */
export function EmptyState({
  Icon,
  title,
  description,
  action,
}: {
  Icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-brand-line bg-white px-6 py-12 text-center">
      <div className="w-14 h-14 rounded-full bg-brand-deep/[0.06] flex items-center justify-center mx-auto mb-4">
        <Icon className="w-6 h-6 text-brand-deep/60" aria-hidden />
      </div>
      <p className="font-display text-lg font-bold text-brand-ink">{title}</p>
      {description && (
        <p className="text-sm text-brand-ink/60 mt-1.5 max-w-md mx-auto">
          {description}
        </p>
      )}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
