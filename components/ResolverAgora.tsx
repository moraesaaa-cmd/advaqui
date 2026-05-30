"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Search } from "lucide-react";

/**
 * ResolverAgora — classificador de caso interativo na home.
 *
 * O visitante digita, em linguagem própria, o que aconteceu ("fui demitido e
 * não recebi nada") e, ao vivo, vê os problemas jurídicos que mais combinam,
 * com link direto para o passo a passo. É 100% client-side (sem API): recebe
 * um índice leve dos problemas (já normalizado no servidor) e faz matching
 * por palavra-chave. Objetivo: engajar o visitante e levá-lo ao conteúdo certo.
 */
export type ProblemaIndexItem = {
  slug: string;
  titulo: string;
  intencao: string;
  /** Texto de busca já normalizado (minúsculo, sem acento) — feito no servidor. */
  hay: string;
};

const EXEMPLOS = [
  "fui demitido e não recebi nada",
  "meu nome está negativado",
  "o plano de saúde negou minha cirurgia",
  "não recebo a pensão do meu filho",
  "caí em um golpe do pix"
];

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

// Stopwords curtas que não ajudam no match (evita falso positivo com "que", "meu"...).
const STOP = new Set([
  "que",
  "meu",
  "minha",
  "uma",
  "uns",
  "com",
  "sem",
  "por",
  "para",
  "nao",
  "the",
  "dos",
  "das",
  "num",
  "numa",
  "foi",
  "esta",
  "estou"
]);

export function ResolverAgora({ items }: { items: ProblemaIndexItem[] }) {
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const query = normalize(q.trim());
    if (query.length < 3) return [];
    const tokens = query
      .split(/[^a-z0-9]+/)
      .filter((t) => t.length >= 3 && !STOP.has(t));
    if (tokens.length === 0) return [];
    const scored = items
      .map((it) => {
        const tituloNorm = normalize(it.titulo);
        let score = 0;
        for (const t of tokens) {
          if (it.hay.includes(t)) score += 1;
          if (tituloNorm.includes(t)) score += 2; // acerto no título pesa mais
        }
        return { it, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    return scored.map((r) => r.it);
  }, [q, items]);

  const showEmpty = normalize(q.trim()).length >= 3 && results.length === 0;

  return (
    <section className="container-tight py-12 md:py-16">
      <div className="rounded-3xl border-2 border-brand-line bg-white p-6 md:p-9 shadow-card">
        <div className="flex items-center gap-2 text-brand-accent2 mb-2">
          <Sparkles className="w-5 h-5" aria-hidden />
          <span className="text-xs font-bold uppercase tracking-wider">
            Resolva agora
          </span>
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-ink leading-tight">
          Conte o que aconteceu — a gente te mostra o caminho
        </h2>
        <p className="text-brand-ink/65 mt-2 text-base">
          Escreva com suas palavras. Em segundos mostramos o passo a passo da
          sua situação, em linguagem clara.
        </p>

        <div className="mt-5 relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-ink/40"
            aria-hidden
          />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ex.: fui demitido e não recebi minhas verbas"
            aria-label="Descreva sua situação"
            className="w-full rounded-2xl border-2 border-brand-line focus:border-brand-accent outline-none bg-brand-bg/40 focus:bg-white pl-12 pr-4 py-4 text-base md:text-lg text-brand-ink transition"
          />
        </div>

        {/* Exemplos clicáveis — nudge para interagir */}
        {results.length === 0 && !showEmpty && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-brand-ink/50 self-center">
              Tente:
            </span>
            {EXEMPLOS.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setQ(ex)}
                className="text-xs rounded-full border border-brand-line bg-white px-3 py-1.5 text-brand-deep hover:border-brand-accent hover:bg-brand-accent/5 transition"
              >
                {ex}
              </button>
            ))}
          </div>
        )}

        {/* Resultados ao vivo */}
        {results.length > 0 && (
          <ul className="mt-5 space-y-2.5">
            {results.map((it) => (
              <li key={it.slug}>
                <Link
                  href={`/problemas-juridicos/${it.slug}`}
                  className="group flex items-start justify-between gap-3 rounded-2xl border-2 border-brand-line bg-white p-4 hover:border-brand-accent hover:shadow-card transition"
                >
                  <span className="flex-1">
                    <span className="font-display font-bold text-brand-ink group-hover:text-brand-deep transition block leading-snug">
                      {it.titulo}
                    </span>
                    <span className="text-sm text-brand-ink/65 mt-0.5 block leading-snug">
                      {it.intencao}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-accent2 mt-2">
                      Ver o passo a passo
                      <ArrowRight
                        className="w-4 h-4 group-hover:translate-x-0.5 transition"
                        aria-hidden
                      />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Sem correspondência exata */}
        {showEmpty && (
          <div className="mt-5 rounded-2xl border border-brand-line bg-brand-bg/40 p-4 text-sm text-brand-ink/80 leading-relaxed">
            Não encontramos um caso com esse nome.{" "}
            <Link
              href="/problemas-juridicos"
              className="font-semibold text-brand-deep hover:text-brand-accent2 underline"
            >
              Veja todos os problemas jurídicos
            </Link>{" "}
            ou{" "}
            <Link
              href="/advogados"
              className="font-semibold text-brand-deep hover:text-brand-accent2 underline"
            >
              encontre um advogado na sua cidade
            </Link>
            .
          </div>
        )}
      </div>
    </section>
  );
}
