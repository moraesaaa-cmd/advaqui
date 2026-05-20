import Link from "next/link";
import type { ExtraCity } from "@/lib/data/lawyer-mapper";

/**
 * Agrupamento visual das cidades adicionais por UF.
 *
 * Quando o advogado cadastra muitas cidades (5+), exibir tudo em chips
 * achatados gera ruído visual e confusão (qual estado é qual?). Esta versão
 * agrupa em duas colunas — "Minas Gerais: Almenara, Medina, Jequitinhonha..."
 * — facilitando a leitura.
 *
 * O componente é server-side (sem "use client") — ele só renderiza HTML
 * estático. Adicionado em Maio/2026 — Fase 3 da Página Profissional.
 */

// Mapa básico UF → Nome do estado por extenso (PT-BR).
const UF_TO_NAME: Record<string, string> = {
  AC: "Acre",
  AL: "Alagoas",
  AM: "Amazonas",
  AP: "Amapá",
  BA: "Bahia",
  CE: "Ceará",
  DF: "Distrito Federal",
  ES: "Espírito Santo",
  GO: "Goiás",
  MA: "Maranhão",
  MG: "Minas Gerais",
  MS: "Mato Grosso do Sul",
  MT: "Mato Grosso",
  PA: "Pará",
  PB: "Paraíba",
  PE: "Pernambuco",
  PI: "Piauí",
  PR: "Paraná",
  RJ: "Rio de Janeiro",
  RN: "Rio Grande do Norte",
  RO: "Rondônia",
  RR: "Roraima",
  RS: "Rio Grande do Sul",
  SC: "Santa Catarina",
  SE: "Sergipe",
  SP: "São Paulo",
  TO: "Tocantins"
};

export function ExtraCitiesGroupedByUF({ cities }: { cities: ExtraCity[] }) {
  // Agrupa por UF mantendo ordem original dentro de cada grupo.
  const groups: Record<string, ExtraCity[]> = {};
  for (const c of cities) {
    const uf = c.uf?.toUpperCase() || "—";
    if (!groups[uf]) groups[uf] = [];
    groups[uf].push(c);
  }

  // Ordena UFs alfabeticamente pelo nome por extenso.
  const ufList = Object.keys(groups).sort((a, b) =>
    (UF_TO_NAME[a] || a).localeCompare(UF_TO_NAME[b] || b, "pt-BR")
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {ufList.map((uf) => (
        <div key={uf} className="rounded-lg border border-brand-line bg-white p-3">
          <p className="text-xs font-bold text-brand-deep mb-1.5">
            {UF_TO_NAME[uf] || uf}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {groups[uf].map((c) => (
              <Link
                key={`${c.uf}-${c.slug}`}
                href={`/advogados/${c.uf.toLowerCase()}/${c.slug}`}
                className="text-xs text-brand-ink/85 hover:text-brand-deep underline-offset-2 hover:underline"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
