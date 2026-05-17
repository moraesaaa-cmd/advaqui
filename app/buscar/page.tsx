"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MapPin, ChevronRight, Loader2 } from "lucide-react";
import { MOCK_LAWYERS } from "@/lib/data/mock-lawyers";
import { Breadcrumb } from "@/components/Breadcrumb";

const normalize = (s: string): string =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

type CityHit = { name: string; slug: string; uf: string; isCapital: boolean };

function ResultsInner() {
  const params = useSearchParams();
  const q = params.get("q") || "";
  const term = q.trim();

  const [cities, setCities] = useState<CityHit[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (term.length < 2) {
      setCities([]);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    fetch(`/api/cities?q=${encodeURIComponent(term)}&limit=20`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : []))
      .then((data: CityHit[]) => {
        setCities(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err?.name !== "AbortError") setLoading(false);
      });
    return () => ctrl.abort();
  }, [term]);

  const lawyers =
    term.length < 2
      ? []
      : MOCK_LAWYERS.filter((l) => normalize(l.name).includes(normalize(term))).slice(0, 10);

  return (
    <div className="container-tight py-10">
      <Breadcrumb items={[{ label: "Busca" }]} />
      <h1 className="font-display text-3xl font-bold text-brand-ink">
        Resultados para &quot;{q}&quot;
      </h1>

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
                        <span className="ml-1.5 text-xs text-brand-accent2">capital</span>
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
                  href={`/p/${l.slug}`}
                  className="card flex items-center justify-between hover:border-brand-accent transition group"
                >
                  <div>
                    <p className="font-semibold text-brand-ink">{l.name}</p>
                    <p className="text-xs text-brand-ink/60">
                      OAB/{l.oabUf} {l.oab} — {l.cityName}/{l.uf}
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
    <Suspense fallback={<div className="container-tight py-10">Carregando…</div>}>
      <ResultsInner />
    </Suspense>
  );
}
