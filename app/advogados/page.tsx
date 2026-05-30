import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { STATES } from "@/lib/data/states";
import { citiesByUf } from "@/lib/data/cities";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata = buildMetadata({
  title: "Diretório de advogados",
  description:
    "Encontre advogados em todos os estados do Brasil. Navegue por estado e cidade para ver os profissionais cadastrados.",
  path: "/advogados"
});

const REGIONS = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"] as const;

export const revalidate = 600;

export default async function DiretorioPage() {
  const byRegion = REGIONS.map((r) => ({
    region: r,
    states: STATES.filter((s) => s.region === r)
  }));

  return (
    <div className="container-tight py-10">
      <Breadcrumb items={[{ label: "Diretório" }]} />
      <h1 className="font-display text-4xl font-bold text-brand-ink">
        Diretório de advogados
      </h1>
      <p className="text-brand-ink/70 mt-2 mb-2 max-w-3xl">
        Diretório com cobertura de <strong>municípios em todo o Brasil</strong>.
        Selecione um estado para ver as cidades e os advogados cadastrados.
      </p>
      <p className="text-xs text-brand-ink/50 mb-10">
        Base de cidades — IBGE, atualizada periodicamente.
      </p>

      {byRegion.map(({ region, states }) => (
        <section key={region} className="mb-10">
          <h2 className="font-display text-xl font-bold text-brand-deep mb-4">{region}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {states.map((st) => {
              const cityCount = citiesByUf(st.uf).length;
              return (
                <Link
                  key={st.uf}
                  href={`/advogados/${st.uf.toLowerCase()}`}
                  className="card flex items-center justify-between hover:border-brand-accent transition group"
                >
                  <div>
                    <p className="font-display text-lg font-bold text-brand-ink group-hover:text-brand-deep">
                      {st.name} ({st.uf})
                    </p>
                    <p className="text-xs text-brand-ink/60 mt-1">
                      {cityCount} cidade(s)
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-brand-ink/30 group-hover:text-brand-accent" aria-hidden />
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
