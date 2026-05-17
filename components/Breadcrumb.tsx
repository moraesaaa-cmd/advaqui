import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; href?: string };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Navegação estrutural" className="flex flex-wrap items-center gap-1 text-sm text-brand-ink/60 mb-4">
      <Link href="/" className="hover:text-brand-deep">Brasil</Link>
      {items.map((it, idx) => (
        <span key={idx} className="flex items-center gap-1">
          <ChevronRight className="w-3.5 h-3.5" aria-hidden />
          {it.href ? (
            <Link href={it.href} className="hover:text-brand-deep">{it.label}</Link>
          ) : (
            <span className="text-brand-ink font-medium">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
