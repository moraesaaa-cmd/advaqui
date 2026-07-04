"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { MapPin, ChevronRight, Loader2, Search } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";

type CityHit = { name: string; slug: string; uf: string; isCapital: boolean };
type LawyerHit = {
  id: string;
  slug: string;
  name: string;
  oab: string;
  oab_uf: string;
  city_name: string;
  uf: string;
};

function ResultsInner() {
  const params = useSearchParams();
  const q = params.get("q") || "";
  const term = q.trim();
  const router = useRouter();
  const [input, setInput] = useState(q);
  useEffect(() => {
    const t = setTimeout(() => {
      router.replace(`/buscar?q=${encodeURIComponent(input)}`, { scroll: false });
    }, 150);
    return () => clearTimeout(t);
  }, [input, router]);

  const [cities, setCities] = useState<CityHit[]>([]);
  const [lawyers, setLawyers] = useState<LawyerHit[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (term.length < 2) {
      setCities([]);
      setLawyers([]);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);

    Promise.all([
      fetch(`/api/cities?q=${encodeURIComponent(term)}&limit=20`, { signal: ctrl.signal })
        .then((r) => (r.ok ? r.json() : []))
        .catch(() => []),
      fetch(`/api/lawyers/search?q=${encodeURIComponent(term)}&limit=10`, { signal: ctrl.signal })
        .then((r) => (r.ok ? r.json() : []))
        .catch(() => [])
    ])
      .then(([c, l]) => {
        setCities(c as CityHit[]);
        setLawyers(l as LawyerHit[]);
        setLoading(false);
      })
      .catch((err) => {
        if (err?.name !== "AbortError") setLoading(false);
      });

    return () => ctrl.abort();
  }, [term]);

  return (
    <div className="container-tight py-10">
      <Breadcrumb items={[{ label: "Busca" }]} />
      <h1 className="font-display text-3xl font-bold text-brand-ink">
        Resultados para &quot;{q}&quot;
      </h1>
      <div className="mt-5">
        <label htmlFor="busca-input" className="sr-only">Buscar cidade ou advogado</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-ink/40" aria-hidden />
          <input
            id="busca-input"
            type="search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite uma cidade ou o nome de um advogado..."
            className="w-full rounded-xl border border-brand-line bg-white py-3 pl-10 pr-4 text-brand-ink outline-none focus:border-brand-accent"
          />
        </div>
      </div>

      {term.length < 2 && (
        <p className="mt-4 text-brand-ink/60">Digite ao menos 2 letras para buscar.</p>
      )}

      {loading && term.length >= 2 && (
        <div className="mt-6 flex items-center gap-2 text-brand-ink/60">
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> Buscando…
        </div>
      )}

      {!loading && term.length >= 2 && cities.length === 0 && lawyers.length === 0 && (
        <p className="mt-6 text-brand-ink/60">
          Nenhum resultado encontrado. Tente o nome de uma cidade ou de um advogado.
        </p>
      )}

      {cities.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-xl font-bold text-brand-deep mb-3">Cidades</h2>
          <ul className="space-y-2">
            {cities.map((c) => (
              <li key={`${c.uf}-${c.slug}`}>
                <Link
                  href={`/advogados/${c.uf.toLowerCase()}/${c.slug}`}
                  className="card flex items-center justify-between hover:border-brand-accent transition group"
                >
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-deep" aria-hidden />
                    <span className="text-brand-ink">
                      {c.name}, {c.uf}
                      {c.isCapital && (
                        <span className="ml-1.5 text-xs text-brand-accentText">capital</span>
                      )}
                    </span>
                  </span>
                  <ChevronRight
                    className="w-4 h-4 text-brand-ink/30 group-hover:text-brand-accent"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {lawyers.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-xl font-bold text-brand-deep mb-3">Advogados</h2>
          <ul className="space-y-2">
            {lawyers.map((l) => (
              <li key={l.id}>
                <Link
                  href={`/advogado/${l.slug}`}
                  className="card flex items-center justify-between hover:border-brand-accent transition group"
                >
                  <div>
                    <p className="font-semibold text-brand-ink">{l.name}</p>
                    <p className="text-xs text-brand-ink/60">
                      OAB/{l.oab_uf} {l.oab} — {l.city_name}/{l.uf}
                    </p>
                  </div>
                  <ChevronRight
                    className="w-4 h-4 text-brand-ink/30 group-hover:text-brand-accent"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default function BuscarPage() {
  return (
    <Suspense
      fallback={
        <div className="container-tight py-10 animate-pulse" aria-hidden>
          <div className="h-4 w-24 rounded bg-brand-line/70" />
          <div className="mt-5 h-8 w-2/3 max-w-md rounded-lg bg-brand-line/70" />
          <div className="mt-5 h-12 w-full rounded-xl bg-brand-line/50" />
          <div className="mt-8 space-y-2">
            <div className="h-14 w-full rounded-xl bg-brand-line/40" />
            <div className="h-14 w-full rounded-xl bg-brand-line/40" />
            <div className="h-14 w-full rounded-xl bg-brand-line/40" />
          </div>
          <span className="sr-only" role="status">Carregando busca</span>
        </div>
      }
    >
      <ResultsInner />
    </Suspense>
  );
}
