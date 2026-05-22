import Link from "next/link";
import { notFound } from "next/navigation";
import { Award, Users, MapPin, ArrowRight } from "lucide-react";
import { findState } from "@/lib/data/states";
import { findCity, getSsgCityParams, nearbyCities, findCapital } from "@/lib/data/cities";
import { getLawyersForCity, sortLawyers, getLawyerCountsByCity } from "@/lib/data/lawyers";
import { SPECIALTIES } from "@/lib/data/specialties";
import { Breadcrumb } from "@/components/Breadcrumb";
import { LawyerCard } from "@/components/LawyerCard";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, cityServiceSchema } from "@/lib/seo/schema";
import { cityIntro } from "@/lib/data/templates";
import { PLAN, SITE } from "@/lib/config";
import { formatCurrency } from "@/lib/utils/format";
import { topCitiesForState } from "@/lib/seo/internal-links";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  return getSsgCityParams();
}

export async function generateMetadata({
  params
}: {
  params: { uf: string; cidade: string };
}) {
  const st = findState(params.uf);
  const city = findCity(params.uf, params.cidade);
  if (!st || !city)
    return buildMetadata({ title: "Cidade", description: "Cidade não encontrada", noIndex: true });
  return buildMetadata({
    title: `Advogados em ${city.name}/${st.uf}`,
    description: `Encontre perfis de advogados em ${city.name}/${st.uf}, com OAB, áreas de atuação, região atendida e canais de contato.`,
    path: `/advogados/${st.uf.toLowerCase()}/${city.slug}`
  });
}

export default async function CityPage({
  params
}: {
  params: { uf: string; cidade: string };
}) {
  const st = findState(params.uf);
  const city = findCity(params.uf, params.cidade);
  if (!st || !city) notFound();

  const allLawyers = await getLawyersForCity(st.uf, city.slug);
  const sorted = sortLawyers(allLawyers);
  const featured = sorted.filter((l) => l.planStatus === "active" || l.featured);
  const regular = sorted.filter((l) => !(l.planStatus === "active" || l.featured));
  const isEmpty = allLawyers.length === 0;

  const neighbors = nearbyCities(city, 6);
  const capital = findCapital(st.uf);

  // Quando a cidade está vazia, sugerimos cidades vizinhas MAIORES (top cities
  // do estado) que tenham advogados cadastrados. Isso substitui o estado vazio
  // por uma ação concreta: "Veja advogados em [cidade vizinha maior]".
  const lawyerCounts = isEmpty ? await getLawyerCountsByCity(st.uf) : {};
  const fallbackSuggestions = isEmpty
    ? topCitiesForState(st, 12)
        .filter(
          (c) => c.slug !== city.slug && (lawyerCounts[c.slug] || 0) > 0
        )
        .slice(0, 6)
    : [];

  return (
    <div className="container-tight py-10">
      <Breadcrumb
        items={[
          { label: "Diretório", href: "/advogados" },
          { label: st.name, href: `/advogados/${st.uf.toLowerCase()}` },
          { label: city.name }
        ]}
      />
      <h1 className="font-display text-4xl font-bold text-brand-ink">
        Advogado em {city.name}, {st.uf}
      </h1>
      <p className="text-brand-ink/60 mt-1 text-sm flex items-center gap-1.5">
        <MapPin className="w-4 h-4" aria-hidden /> {st.name} · {city.region}
        {city.isCapital && <span className="ml-2 chip text-brand-accent2 border-brand-accent/40">Capital</span>}
      </p>
      <p className="text-brand-ink/80 mt-4 max-w-3xl leading-relaxed">{cityIntro(city, st)}</p>

      <section className="mt-8">
        <h2 className="font-display text-lg font-bold text-brand-deep mb-3">
          Advogados em {city.name} por área de atuação
        </h2>
        <div className="flex flex-wrap gap-2">
          {SPECIALTIES.map((sp) => (
            <Link
              key={sp.slug}
              href={`/advogados/${st.uf.toLowerCase()}/${city.slug}/${sp.slug}`}
              className="chip text-brand-ink hover:bg-brand-deep hover:text-white hover:border-brand-deep transition"
            >
              {sp.name}
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold text-brand-ink mb-4 inline-flex items-center gap-2">
            <Award className="w-6 h-6 text-brand-accent" aria-hidden />
            Profissionais em destaque em {city.name}
          </h2>
          <p className="text-sm text-brand-ink/60 mb-4">
            Advogados com plano de destaque aparecem em posição privilegiada nesta página.
            O destaque indica investimento em visibilidade local — não atesta qualidade técnica.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featured.map((l) => (
              <LawyerCard key={l.id} lawyer={l} featured />
            ))}
          </div>
        </section>
      )}

      {regular.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold text-brand-ink mb-4">
            Outros advogados cadastrados em {city.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {regular.map((l) => (
              <LawyerCard key={l.id} lawyer={l} />
            ))}
          </div>
        </section>
      )}

      {isEmpty && (
        <section className="mt-10 card">
          <Users className="w-10 h-10 text-brand-ink/30 mb-3" aria-hidden />
          <h2 className="font-display text-2xl font-bold text-brand-ink mb-2">
            Ainda não temos advogados em {city.name}/{st.uf}
          </h2>
          <p className="text-brand-ink/70 mb-5 max-w-2xl">
            Estamos expandindo a cobertura no interior. Enquanto isso, veja
            profissionais que atendem em cidades maiores próximas — muitos
            recebem clientes de toda a região.
          </p>

          {fallbackSuggestions.length > 0 ? (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-brand-deep mb-3 uppercase tracking-wide">
                Veja advogados que atendem nesta região
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {fallbackSuggestions.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/advogados/${st.uf.toLowerCase()}/${c.slug}`}
                    className="group flex items-center justify-between rounded-xl border border-brand-line bg-white px-4 py-3 hover:border-brand-accent hover:shadow-card transition"
                  >
                    <div>
                      <p className="font-display text-base font-bold text-brand-ink">
                        Advogados em {c.name}
                        {c.isCapital && (
                          <span className="ml-1.5 text-xs text-brand-accent2 font-normal">
                            capital
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-brand-ink/55 mt-0.5">
                        {c.region || st.name}
                      </p>
                    </div>
                    <ArrowRight
                      className="w-5 h-5 text-brand-ink/40 group-hover:text-brand-accent transition flex-shrink-0"
                      aria-hidden
                    />
                  </Link>
                ))}
              </div>
            </div>
          ) : capital && capital.slug !== city.slug ? (
            <div className="mb-6">
              <Link
                href={`/advogados/${st.uf.toLowerCase()}/${capital.slug}`}
                className="group inline-flex items-center gap-2 rounded-xl border border-brand-line bg-white px-5 py-3 hover:border-brand-accent hover:shadow-card transition"
              >
                <span className="font-display font-bold text-brand-ink">
                  Ver advogados em {capital.name}
                </span>
                <ArrowRight
                  className="w-4 h-4 text-brand-ink/40 group-hover:text-brand-accent transition"
                  aria-hidden
                />
              </Link>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3 pt-2 border-t border-brand-line">
            <Link href="/cadastro" className="btn-accent">
              É advogado em {city.name}? Cadastre-se grátis
            </Link>
            <Link
              href={`/advogados/${st.uf.toLowerCase()}`}
              className="btn-ghost border border-brand-line"
            >
              Ver todas as cidades de {st.name}
            </Link>
          </div>
        </section>
      )}

      {neighbors.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-lg font-bold text-brand-deep mb-3">
            Cidades próximas em {st.name}
          </h2>
          <div className="flex flex-wrap gap-2">
            {neighbors.map((c) => (
              <Link
                key={c.slug}
                href={`/advogados/${st.uf.toLowerCase()}/${c.slug}`}
                className="chip text-brand-ink hover:bg-brand-deep hover:text-white hover:border-brand-deep transition"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-12 rounded-2xl bg-brand-ink text-white p-6">
        <h2 className="font-display text-xl font-bold mb-2">
          Aumente sua visibilidade em {city.name}
        </h2>
        <p className="text-brand-bg/85 text-sm mb-4 max-w-2xl">
          Com o plano de destaque por {formatCurrency(PLAN.price)} ao mês, seu perfil aparece em
          posição privilegiada na página de {city.name} e ganha mais exposição em buscas relacionadas
          à sua cidade e à sua área de atuação. Sem fidelidade, cancelamento livre.
        </p>
        <Link href="/planos" className="btn-accent">
          Conhecer planos
        </Link>
      </section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Brasil", url: "/" },
          { name: "Diretório", url: "/advogados" },
          { name: st.name, url: `/advogados/${st.uf.toLowerCase()}` },
          { name: city.name, url: `/advogados/${st.uf.toLowerCase()}/${city.slug}` }
        ])}
      />
      <JsonLd data={cityServiceSchema(city.name, st.uf, allLawyers.length)} />
    </div>
  );
}
