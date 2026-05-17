import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Award } from "lucide-react";
import { findState, STATES } from "@/lib/data/states";
import { citiesByUf, findCapital } from "@/lib/data/cities";
import { lawyersForCity, lawyersForState } from "@/lib/data/mock-lawyers";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { stateIntro } from "@/lib/data/templates";
import { PLAN } from "@/lib/config";
import { formatCurrency } from "@/lib/utils/format";

export const dynamicParams = false;
export const revalidate = 3600;

export async function generateStaticParams() {
  return STATES.map((s) => ({ uf: s.uf.toLowerCase() }));
}

export async function generateMetadata({ params }: { params: { uf: string } }) {
  const st = findState(params.uf);
  if (!st) return buildMetadata({ title: "Estado", description: "Estado não encontrado", noIndex: true });
  return buildMetadata({
    title: `Advogados em ${st.name} (${st.uf}) | Diretório de cidades`,
    description: `Diretório de advogados em ${st.name}. Navegue por todas as cidades de ${st.name} e encontre profissionais cadastrados na sua região.`,
    path: `/advogados/${st.uf.toLowerCase()}`
  });
}

const groupCitiesByLetter = (cities: Array<{ name: string; slug: string; uf: string; isCapital: boolean }>) => {
  const groups = new Map<string, typeof cities>();
  for (const c of cities) {
    const letter = c.name.charAt(0).toUpperCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "");
    const arr = groups.get(letter) || [];
    arr.push(c);
    groups.set(letter, arr);
  }
  return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
};

export default function StatePage({ params }: { params: { uf: string } }) {
  const st = findState(params.uf);
  if (!st) notFound();
  const cities = citiesByUf(st.uf);
  const totalLawyers = lawyersForState(st.uf).length;
  const capital = findCapital(st.uf);
  const grouped = groupCitiesByLetter(cities);

  return (
    <div className="container-tight py-10">
      <Breadcrumb
        items={[
          { label: "Diretório", href: "/advogados" },
          { label: st.name }
        ]}
      />
      <h1 className="font-display text-4xl font-bold text-brand-ink">
        Advogados em {st.name} ({st.uf})
      </h1>
      <p className="text-brand-ink/80 mt-3 max-w-3xl leading-relaxed">{stateIntro(st)}</p>

      <div className="mt-3 inline-flex items-center gap-2 text-sm text-brand-ink/60 flex-wrap">
        <MapPin className="w-4 h-4" aria-hidden />
        Capital — {st.capital}
        <span className="opacity-50">·</span>
        {cities.length.toLocaleString("pt-BR")} cidade(s)
        <span className="opacity-50">·</span>
        {totalLawyers} advogado(s) cadastrado(s)
      </div>

      {capital && (
        <section className="mt-8 card border-brand-accent/40 ring-1 ring-brand-accent/20">
          <div className="flex items-start gap-3">
            <Award className="w-6 h-6 text-brand-accent flex-shrink-0 mt-1" aria-hidden />
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wider text-brand-ink/60 font-semibold">Capital</p>
              <Link
                href={`/advogados/${st.uf.toLowerCase()}/${capital.slug}`}
                className="font-display text-xl font-bold text-brand-ink hover:text-brand-deep"
              >
                Advogados em {capital.name}
              </Link>
              <p className="text-sm text-brand-ink/60 mt-1">
                {lawyersForCity(st.uf, capital.slug).length} profissional(is) cadastrado(s)
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold text-brand-deep mb-4">
          Todas as cidades de {st.name}
        </h2>
        <p className="text-sm text-brand-ink/60 mb-6">
          Clique em qualquer cidade para ver os advogados cadastrados na região e as áreas de
          atuação disponíveis.
        </p>

        {grouped.map(([letter, list]) => (
          <div key={letter} className="mb-8">
            <h3 className="font-display text-lg font-bold text-brand-ink mb-3 border-b border-brand-line pb-1">
              {letter}
            </h3>
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-1.5">
              {list.map((c) => {
                const count = lawyersForCity(st.uf, c.slug).length;
                return (
                  <li key={c.slug}>
                    <Link
                      href={`/advogados/${st.uf.toLowerCase()}/${c.slug}`}
                      className="text-sm text-brand-ink hover:text-brand-deep transition inline-flex items-center gap-1.5 py-1"
                    >
                      <span>{c.name}</span>
                      {count > 0 && (
                        <span className="text-xs font-medium text-brand-accent2">({count})</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </section>

      <section className="mt-12 rounded-2xl bg-brand-ink text-white p-6">
        <h2 className="font-display text-xl font-bold mb-2">
          É advogado em {st.name}? Aumente sua visibilidade local
        </h2>
        <p className="text-brand-bg/85 text-sm mb-4 max-w-2xl">
          Cadastre seu perfil gratuitamente e apareça na página da sua cidade. Com o plano de
          destaque por {formatCurrency(PLAN.price)} ao mês, seu perfil aparece em posição
          privilegiada e ganha mais exposição em buscas relacionadas a {st.name}.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/cadastro" className="btn-accent">Cadastrar gratuitamente</Link>
          <Link href="/planos" className="btn-ghost text-white border border-white/20 hover:bg-white/10">
            Conhecer planos
          </Link>
        </div>
      </section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Brasil", url: "/" },
          { name: "Diretório", url: "/advogados" },
          { name: st.name, url: `/advogados/${st.uf.toLowerCase()}` }
        ])}
      />
    </div>
  );
}
