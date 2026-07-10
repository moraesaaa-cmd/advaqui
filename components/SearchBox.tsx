"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, MapPin, ChevronRight, Loader2, Star, Globe } from "lucide-react";

type Hit = { name: string; slug: string; uf: string; isCapital: boolean; lawyerCount?: number };

type GroupedHits = { uf: string; state: string; cities: Hit[] }[];

const STATE_NAMES: Record<string, string> = {
  AC: "Acre", AL: "Alagoas", AM: "Amazonas", AP: "Amapá", BA: "Bahia",
  CE: "Ceará", DF: "Distrito Federal", ES: "Espírito Santo", GO: "Goiás",
  MA: "Maranhão", MG: "Minas Gerais", MS: "Mato Grosso do Sul", MT: "Mato Grosso",
  PA: "Pará", PB: "Paraíba", PE: "Pernambuco", PI: "Piauí", PR: "Paraná",
  RJ: "Rio de Janeiro", RN: "Rio Grande do Norte", RO: "Rondônia", RR: "Roraima",
  RS: "Rio Grande do Sul", SC: "Santa Catarina", SE: "Sergipe", SP: "São Paulo",
  TO: "Tocantins"
};

const POPULAR: Hit[] = [
  { name: "São Paulo", slug: "sao-paulo", uf: "SP", isCapital: true },
  { name: "Rio de Janeiro", slug: "rio-de-janeiro", uf: "RJ", isCapital: true },
  { name: "Belo Horizonte", slug: "belo-horizonte", uf: "MG", isCapital: true },
  { name: "Brasília", slug: "brasilia", uf: "DF", isCapital: true },
  { name: "Salvador", slug: "salvador", uf: "BA", isCapital: true },
  { name: "Curitiba", slug: "curitiba", uf: "PR", isCapital: true },
  { name: "Fortaleza", slug: "fortaleza", uf: "CE", isCapital: true },
  { name: "Recife", slug: "recife", uf: "PE", isCapital: true },
  { name: "Porto Alegre", slug: "porto-alegre", uf: "RS", isCapital: true },
  { name: "Goiânia", slug: "goiania", uf: "GO", isCapital: true },
  { name: "Manaus", slug: "manaus", uf: "AM", isCapital: true },
  { name: "Belém", slug: "belem", uf: "PA", isCapital: true },
];

function groupByState(hits: Hit[]): GroupedHits {
  const map = new Map<string, Hit[]>();
  for (const h of hits) {
    const list = map.get(h.uf) || [];
    list.push(h);
    map.set(h.uf, list);
  }
  return Array.from(map.entries()).map(([uf, cities]) => ({
    uf,
    state: STATE_NAMES[uf] || uf,
    cities: cities.sort((a, b) => (a.isCapital ? -1 : b.isCapital ? 1 : a.name.localeCompare(b.name, "pt-BR")))
  }));
}

function flatList(groups: GroupedHits): Hit[] {
  return groups.flatMap((g) => g.cities);
}

export function SearchBox() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [searchError, setSearchError] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const showPopular = open && q.trim().length < 2 && hits.length === 0;
  const displayHits = showPopular ? POPULAR : hits;
  const grouped = groupByState(displayHits);
  const flat = flatList(grouped);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setHits([]);
      setLoading(false);
      setSearchError(false);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    const t = setTimeout(() => {
      fetch(`/api/cities?q=${encodeURIComponent(term)}&limit=12`, { signal: ctrl.signal })
        .then((r) => {
          if (!r.ok) throw new Error("http_" + r.status);
          return r.json();
        })
        .then((data: Hit[]) => {
          setHits(data);
          setSearchError(false);
          setLoading(false);
          setActiveIdx(-1);
        })
        .catch((err) => {
          if (err?.name !== "AbortError") {
            setHits([]);
            setSearchError(true);
            setLoading(false);
          }
        });
    }, 200);
    return () => {
      ctrl.abort();
      clearTimeout(t);
    };
  }, [q]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigateTo = useCallback((hit: Hit) => {
    try {
      localStorage.setItem("advaqui_last_city", JSON.stringify({ name: hit.name, slug: hit.slug, uf: hit.uf }));
    } catch {}
    router.push(`/advogados/${hit.uf.toLowerCase()}/${hit.slug}`);
    setOpen(false);
    setQ(hit.name);
  }, [router]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (activeIdx >= 0 && activeIdx < flat.length) {
      navigateTo(flat[activeIdx]);
      return;
    }
    const term = q.trim();
    if (!term) return;
    if (flat.length > 0) {
      navigateTo(flat[0]);
      return;
    }
    router.push(`/buscar?q=${encodeURIComponent(term)}`);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || flat.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((prev) => (prev < flat.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((prev) => (prev > 0 ? prev - 1 : flat.length - 1));
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIdx(-1);
    }
  };

  let flatIdx = -1;

  return (
    <div ref={wrapperRef} className="w-full relative">
      <form onSubmit={handleSubmit} role="search">
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
              setActiveIdx(-1);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua cidade — ex: São Paulo, Curitiba, Salvador…"
            className="flex-1 px-5 py-4 text-base text-brand-ink placeholder:text-brand-ink/60 outline-none"
            autoComplete="off"
            aria-label="Buscar advogados pela cidade"
            aria-autocomplete="list"
            aria-controls="search-city-listbox"
            aria-expanded={open && (displayHits.length > 0 || showPopular)}
            aria-activedescendant={activeIdx >= 0 ? `city-option-${activeIdx}` : undefined}
          />
          <button
            className="px-6 font-bold flex items-center gap-2"
            style={{ background: "#C8A24A", color: "#11203B" }}
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
      </form>

      {open && (showPopular || displayHits.length > 0) && (
        <div
          id="search-city-listbox"
          className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-2xl shadow-cardHover overflow-hidden border border-brand-line max-h-[420px] overflow-y-auto"
          role="listbox"
        >
          {showPopular && (
            <div className="px-4 pt-3 pb-1.5 flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-brand-deep" aria-hidden />
              <span className="text-xs font-semibold text-brand-ink/50 uppercase tracking-wider">
                Cidades populares
              </span>
            </div>
          )}

          {grouped.map((group) => (
            <div key={group.uf}>
              {!showPopular && grouped.length > 1 && (
                <div className="px-4 pt-3 pb-1 flex items-center gap-2 border-t border-brand-line/50 first:border-t-0">
                  <span className="text-[11px] font-bold text-brand-deep bg-brand-deep/8 px-2 py-0.5 rounded">
                    {group.uf}
                  </span>
                  <span className="text-xs text-brand-ink/45">{group.state}</span>
                </div>
              )}
              {group.cities.map((r) => {
                flatIdx++;
                const idx = flatIdx;
                const isActive = activeIdx === idx;
                return (
                  <div key={`${r.uf}-${r.slug}`} role="option" id={`city-option-${idx}`} aria-selected={isActive}>
                    <Link
                      href={`/advogados/${r.uf.toLowerCase()}/${r.slug}`}
                      onClick={() => { setOpen(false); setQ(r.name); }}
                      className={`flex items-center gap-3 px-4 py-2.5 transition text-brand-ink ${
                        isActive ? "bg-brand-deep/8" : "hover:bg-brand-line/40"
                      }`}
                    >
                      <MapPin className={`w-4 h-4 shrink-0 ${r.isCapital ? "text-amber-500" : "text-brand-deep/60"}`} aria-hidden />
                      <span className="flex-1 flex items-center gap-2 min-w-0">
                        <span className="truncate font-medium">{r.name}</span>
                        {!showPopular && (
                          <span className="text-xs text-brand-ink/40 shrink-0">{r.uf}</span>
                        )}
                        {r.isCapital && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full shrink-0">
                            <Star className="w-2.5 h-2.5" aria-hidden /> capital
                          </span>
                        )}
                        {typeof r.lawyerCount === "number" && r.lawyerCount > 0 && (
                          <span className="text-[10px] font-medium text-brand-deep/70 bg-brand-deep/8 px-1.5 py-0.5 rounded-full shrink-0">
                            {r.lawyerCount} adv.
                          </span>
                        )}
                      </span>
                      <ChevronRight className="w-4 h-4 text-brand-ink/30 shrink-0" aria-hidden />
                    </Link>
                  </div>
                );
              })}
            </div>
          ))}

          {!showPopular && q.trim().length >= 2 && (
            <Link
              href={`/buscar?q=${encodeURIComponent(q.trim())}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 border-t border-brand-line/50 text-sm text-brand-deep hover:bg-brand-line/40 transition"
            >
              <Search className="w-4 h-4" aria-hidden />
              <span>Buscar &quot;{q.trim()}&quot; em todo o Brasil</span>
              <ChevronRight className="w-4 h-4 ml-auto text-brand-ink/30" aria-hidden />
            </Link>
          )}
        </div>
      )}

      {open && q.trim().length >= 2 && !loading && hits.length === 0 && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-2xl shadow-card border border-brand-line p-4">
          <p className="text-sm text-brand-ink/60 mb-3">
            {searchError
              ? "Não conseguimos buscar as cidades agora. Verifique sua conexão e tente novamente."
              : `Nenhuma cidade encontrada com "${q}".`}
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/advogados"
              className="text-xs font-medium text-brand-deep hover:underline"
            >
              Ver todos os estados
            </Link>
            <span className="text-brand-ink/20">|</span>
            <Link
              href={`/buscar?q=${encodeURIComponent(q.trim())}`}
              onClick={() => setOpen(false)}
              className="text-xs font-medium text-brand-deep hover:underline"
            >
              Buscar por nome de advogado
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
