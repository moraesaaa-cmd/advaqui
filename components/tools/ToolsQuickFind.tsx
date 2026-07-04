"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, CornerDownLeft } from "lucide-react";

export type QuickFindItem = {
  href: string;
  label: string;
  desc: string;
  group: string;
};

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

/**
 * Busca rápida do hub de ferramentas — o visitante digita "rescisão",
 * "juntar pdf", "pensão" e vai direto, sem varrer a página inteira.
 * Só sugestões client-side; o grid completo continua no HTML (SEO intacto).
 */
export function ToolsQuickFind({ items }: { items: QuickFindItem[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const query = norm(q.trim());
    if (query.length < 2) return [];
    return items
      .map((it) => {
        const label = norm(it.label);
        const desc = norm(it.desc);
        const score = label.startsWith(query)
          ? 3
          : label.includes(query)
            ? 2
            : desc.includes(query)
              ? 1
              : 0;
        return { it, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((r) => r.it);
  }, [q, items]);

  const open = focused && results.length > 0;

  return (
    <div ref={boxRef} className="relative max-w-xl">
      <div className="flex items-center gap-2 rounded-xl border-2 border-brand-line bg-white px-4 py-3 focus-within:border-brand-accent">
        <Search className="h-5 w-5 shrink-0 text-brand-ink/50" aria-hidden />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && results[0]) router.push(results[0].href);
            if (e.key === "Escape") setFocused(false);
          }}
          placeholder="O que você precisa? Ex.: rescisão, juntar PDF, pensão, prazo..."
          aria-label="Buscar ferramenta"
          className="w-full bg-transparent text-brand-ink outline-none placeholder:text-brand-ink/50"
        />
      </div>
      {open && (
        <ul
          role="listbox"
          className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-brand-line bg-white py-1 shadow-lg"
        >
          {results.map((r, i) => (
            <li key={r.href}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  router.push(r.href);
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-brand-bg"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-brand-ink">
                    {r.label}
                  </span>
                  <span className="block truncate text-xs text-brand-ink/60">
                    {r.group} · {r.desc}
                  </span>
                </span>
                {i === 0 && (
                  <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-brand-ink/40" aria-hidden />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
