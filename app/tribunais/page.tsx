import Link from "next/link";
import { Scale, MapPin, Building2 } from "lucide-react";
import { STATES } from "@/lib/data/states";
import { TRIBUNAIS_UF, ORGAOS_FEDERAIS } from "@/lib/data/tribunais";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const metadata = buildMetadata({
  title: "Tribunais brasileiros — TJs, TRTs, TRE, STF, STJ e mais",
  description:
    "Guia dos tribunais e órgãos do sistema de justiça no Brasil. Links oficiais de TJs estaduais, TRTs, TRE, defensoria pública e órgãos federais.",
  path: "/tribunais"
});

export default function TribunaisHubPage() {
  const states = [...STATES].sort((a, b) => a.name.localeCompare(b.name));
  return (
    <div className="container-narrow py-10">
      <Breadcrumb items={[{ label: "Tribunais" }]} />

      <header className="mb-6">
        <div className="flex items-start gap-3 mb-2">
          <Scale className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              Tribunais e órgãos de justiça no Brasil
            </h1>
            <p className="text-base text-brand-ink/85 mt-3 leading-relaxed max-w-3xl">
              Guia rápido dos tribunais brasileiros. Cada estado tem um TJ
              (Tribunal de Justiça), um TRT (Tribunal Regional do Trabalho)
              e um TRE (Tribunal Regional Eleitoral). Em âmbito nacional,
              STF, STJ, TST, TSE e TCU completam o sistema. Para resolver
              questões sem custo, vale conhecer também a defensoria, o
              juizado especial e o Procon do estado.
            </p>
          </div>
        </div>
      </header>

      {/* Órgãos federais */}
      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
          <Building2 className="w-5 h-5 text-brand-deep" aria-hidden />
          Órgãos federais
        </h2>
        <ul className="space-y-3">
          {ORGAOS_FEDERAIS.map((o) => (
            <li
              key={o.sigla}
              className="rounded-xl border border-brand-line bg-white p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-display font-bold text-brand-ink">
                    {o.nome} ({o.sigla})
                  </h3>
                  <p className="text-sm text-brand-ink/80 mt-1 leading-relaxed">
                    {o.alcance}
                  </p>
                </div>
                <a
                  href={o.site}
                  target="_blank"
                  rel="noopener nofollow"
                  className="text-xs text-brand-deep hover:underline font-medium whitespace-nowrap"
                >
                  Site oficial →
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* TJs por estado */}
      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
          <MapPin className="w-5 h-5 text-brand-deep" aria-hidden />
          Tribunais por estado
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {states.map((st) => {
            const t = TRIBUNAIS_UF[st.uf];
            if (!t) return null;
            return (
              <Link
                key={st.uf}
                href={`/tribunais/${st.uf.toLowerCase()}/${t.tj_sede
                  .toLowerCase()
                  .normalize("NFD")
                  .replace(/[̀-ͯ]/g, "")
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)+/g, "")}`}
                className="rounded-xl border border-brand-line bg-white p-3 hover:border-brand-accent hover:shadow-card transition"
              >
                <p className="font-display text-base font-bold text-brand-ink">
                  {st.name} ({st.uf})
                </p>
                <p className="text-xs text-brand-ink/55 mt-0.5">
                  {t.tj_nome} · TRT-{t.trt_numero} · {t.qtd_comarcas} comarcas
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Tribunais", url: "/tribunais" }
        ])}
      />
    </div>
  );
}
