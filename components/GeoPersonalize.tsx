"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";

type SavedCity = { name: string; slug: string; uf: string };

export function GeoPersonalize() {
  const [city, setCity] = useState<SavedCity | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("advaqui_last_city");
      if (!raw) return;
      const p = JSON.parse(raw);
      // Só usa se tiver os 3 campos — evita quebrar o render (city.uf.toLowerCase)
      // quando o valor salvo está corrompido/incompleto.
      if (p && typeof p.name === "string" && typeof p.slug === "string" && typeof p.uf === "string") {
        setCity(p);
      }
    } catch {}
  }, []);

  if (!city) return null;

  return (
    <div className="container-tight pt-6">
      <Link
        href={`/advogados/${city.uf.toLowerCase()}/${city.slug}`}
        className="group flex items-center justify-between gap-4 rounded-2xl border border-brand-line bg-white p-4 md:p-5 hover:shadow-card transition"
      >
        <div className="flex items-center gap-3">
          <span
            className="flex items-center justify-center w-10 h-10 rounded-xl"
            style={{ background: "rgba(200,162,74,0.12)" }}
          >
            <MapPin className="w-5 h-5 text-brand-accent" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-semibold text-brand-ink">
              Advogados em {city.name}, {city.uf}
            </p>
            <p className="text-xs text-brand-ink/60">
              Veja profissionais na sua região
            </p>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-brand-ink/30 group-hover:text-brand-accent transition flex-shrink-0" aria-hidden />
      </Link>
    </div>
  );
}
