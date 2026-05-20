"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, MapPin, ChevronRight, Loader2 } from "lucide-react";

type Hit = { name: string; slug: string; uf: string; isCapital: boolean };

/**
 * SearchBox usa endpoint /api/cities para não injetar 5.571 cidades
 * no bundle JavaScript do cliente. Debounce de 200ms reduz requests.
 *
 * Comportamento ao apertar Enter (form submit) — Maio/2026:
 *   1. Se há resultado(s) no autocomplete → navega pro primeiro
 *   2. Se não há resultado mas tem termo → /buscar?q=<termo>
 *   3. Se termo vazio → não faz nada
 *
 * Resolve o bug em que apertar Enter no input não disparava nada (o user
 * tinha que clicar no item do dropdown ou no botão Buscar).
 */
export function SearchBox() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setHits([]);
      setLoading(false);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    const t = setTimeout(() => {
      fetch(`/api/cities?q=${encodeURIComponent(term)}&limit=8`, { signal: ctrl.signal })
        .then((r) => (r.ok ? r.json() : []))
        .then((data: Hit[]) => {
          setHits(data);
          setLoading(false);
        })
        .catch((err) => {
          if (err?.name !== "AbortError") setLoading(false);
        });
    }, 200);
    return () => {
      ctrl.abort();
      clearTimeout(t);
    };
  }, [q]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const term = q.trim();
    if (!term) return;
    // Se há sugestão → navega pro primeiro hit (match mais relevante)
    if (hits.length > 0) {
      const first = hits[0];
      router.push(`/advogados/${first.uf.toLowerCase()}/${first.slug}`);
      setOpen(false);
      return;
    }
    // Sem sugestão exata → vai pra busca interna
    router.push(`/buscar?q=${encodeURIComponent(term)}`);
    setOpen(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full" role="search">
      <div className="flex bg-white rounded-2xl overflow-hidden shadow-cardHover">
        <label htmlFor="search-city" className="sr-only">
          Buscar cidade
        </label>
        <input
          id="search-city"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Digite a sua cidade..."
          className="flex-1 px-5 py-4 text-base text-brand-ink placeholder:text-brand-ink/40 outline-none"
          autoComplete="off"
          aria-label="Buscar advogados pela cidade"
          aria-autocomplete="list"
          aria-controls="search-city-listbox"
        />
        <button
          className="px-6 bg-brand-accent text-brand-ink font-bold flex items-center gap-2"
          aria-label="Buscar"
          type="submit"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden />
          ) : (
            <Search className="w-5 h-5" aria-hidden />
          )}
          <span className="hidden sm:inline">Buscar</span>
        </button>
      </div>
      {open && hits.length > 0 && (
        <ul
          id="search-city-listbox"
          className="mt-2 bg-white rounded-2xl shadow-cardHover overflow-hidden border border-brand-line"
          role="listbox"
        >
          {hits.map((r) => (
            <li key={`${r.uf}-${r.slug}`} role="option" aria-selected="false">
              <Link
                href={`/advogados/${r.uf.toLowerCase()}/${r.slug}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-brand-line/40 transition text-brand-ink"
              >
                <MapPin className="w-4 h-4 text-brand-deep" aria-hidden />
                <span className="flex-1">
                  {r.name}, {r.uf}
                  {r.isCapital && (
                    <span className="ml-1.5 text-xs text-brand-accent2">capital</span>
                  )}
                </span>
                <ChevronRight className="w-4 h-4 text-brand-ink/40" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      )}
      {open && q.trim().length >= 2 && !loading && hits.length === 0 && (
        <div className="mt-2 bg-white rounded-2xl shadow-card border border-brand-line p-4 text-sm text-brand-ink/60">
          Nenhuma cidade encontrada com &quot;{q}&quot;. Tente outro nome.
        </div>
      )}
    </form>
  );
}
