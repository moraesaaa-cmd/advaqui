import Link from "next/link";
import { notFound } from "next/navigation";
import { Users, ArrowLeft } from "lucide-react";
import { findState } from "@/lib/data/states";
import { findCity, findCapital } from "@/lib/data/cities";
import { SPECIALTIES, findSpecialty } from "@/lib/data/specialties";
import { getLawyersBySpecialty, sortLawyers } from "@/lib/data/lawyers";
import { Breadcrumb } from "@/components/Breadcrumb";
import { LawyerCard } from "@/components/LawyerCard";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { citySpecialtyIntro } from "@/lib/data/templates";
import { PLAN } from "@/lib/config";
import { formatCurrency } from "@/lib/utils/format";
import { relatedCapitalsForSpecialty } from "@/lib/seo/internal-links";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  // Pré-gera capital × especialidades no build (27 x 15 = 405 páginas).
  // As demais combinações cidade × especialidade são geradas sob demanda (ISR)
  // no primeiro acesso e cacheadas conforme `revalidate`. Como o slug da
  // cidade vem da base IBGE, qualquer URL válida é resolvida — sem cidade órfã.
  const out: Array<{ uf: string; cidade: string; especialidade: string }> = [];
  const { getAllCities } = await import("@/lib/data/cities");
  const capitals = getAllCities().filter((c) => c.isCapital);
  for (const c of capitals) {
    for (const sp of SPECIALTIES) {
      out.push({ uf: c.uf.toLowerCase(), cidade: c.slug, especialidade: sp.slug });
    }
  }
  return out;
}

export async function generateMetadata({
  params
}: {
  params: { uf: string; cidade: string; especialidade: string };
}) {
  const st = findState(params.uf);
  const city = findCity(params.uf, params.cidade);
  const sp = findSpecialty(params.especialidade);
  if (!st || !city || !sp)
    return buildMetadata({ title: "Especialidade", description: "Não encontrado", noIndex: true });
  return buildMetadata({
    title: `Advogado ${sp.name} em ${city.name}/${st.uf}`,
    description: `Veja perfis de advogados com atuação em ${sp.name} em ${city.name}/${st.uf}. Consulte OAB, região atendida e canais de contato.`,
    path: `/advogados/${st.uf.toLowerCase()}/${city.slug}/${sp.slug}`
  });
}

export default async function CitySpecialtyPage({
  params
}: {
  params: { uf: string; cidade: string; especialidade: string };
}) {
  const st = findState(params.uf);
  const city = findCity(params.uf, params.cidade);
  const sp = findSpecialty(params.especialidade);
  if (!st || !city || !sp) notFound();

  const lawyers = sortLawyers(await getLawyersBySpecialty(st.uf, city.slug, sp.slug));
  const capital = findCapital(st.uf);

  return (
    <div className="container-tight py-10">
      <Breadcrumb
        items={[
          { label: "Diretório", href: "/advogados" },
          { label: st.name, href: `/advogados/${st.uf.toLowerCase()}` },
          { label: city.name, href: `/advogados/${st.uf.toLowerCase()}/${city.slug}` },
          { label: sp.name }
        ]}
      />

      <h1 className="font-display text-4xl font-bold text-brand-ink">
        Advogado {sp.name} em {city.name}, {st.uf}
      </h1>
      <p className="text-brand-ink/80 mt-3 max-w-3xl leading-relaxed">
        {citySpecialtyIntro(city, st, sp)}
      </p>

      {lawyers.length > 0 ? (
        <section className="mt-8">
          <h2 className="sr-only">Lista de advogados {sp.name} em {city.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lawyers.map((l) => (
              <LawyerCard key={l.id} lawyer={l} />
            ))}
          </div>
        </section>
      ) : (
        <section className="mt-8 card">
          <Users className="w-10 h-10 text-brand-ink/30 mb-3" aria-hidden />
          <h2 className="font-display text-2xl font-bold text-brand-ink mb-2">
            Ainda não há advogado {sp.name.toLowerCase()} cadastrado em {city.name}
          </h2>
          <p className="text-brand-ink/70 mb-4 max-w-2xl">
            Esta página existe para que pessoas que procuram advogado {sp.name.toLowerCase()} em{" "}
            {city.name}/{st.uf} encontrem profissionais à medida que se cadastram. Você pode ver os
            advogados de outras áreas em {city.name} ou consultar profissionais na capital.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/advogados/${st.uf.toLowerCase()}/${city.slug}`}
              className="btn-ghost border border-brand-line"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden /> Ver advogados em {city.name}
            </Link>
            {capital && capital.slug !== city.slug && (
              <Link
                href={`/advogados/${st.uf.toLowerCase()}/${capital.slug}/${sp.slug}`}
                className="btn-ghost border border-brand-line"
              >
                Ver {sp.name.toLowerCase()} em {capital.name}
              </Link>
            )}
            <Link href="/cadastro" className="btn-accent">
              É advogado? Cadastre-se grátis
            </Link>
          </div>
        </section>
      )}

      <section className="mt-12 card">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-2">
          Outras áreas de atuação em {city.name}
        </h2>
        <div className="flex flex-wrap gap-2 mt-3">
          {SPECIALTIES.filter((s) => s.slug !== sp.slug).map((s) => (
            <Link
              key={s.slug}
              href={`/advogados/${st.uf.toLowerCase()}/${city.slug}/${s.slug}`}
              className="chip text-brand-ink hover:bg-brand-deep hover:text-white hover:border-brand-deep transition"
            >
              {s.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Interlinking SEO — capitais de outros estados com a MESMA
          especialidade. Ajuda o Google a entender que essa especialidade
          é uma rede de páginas e melhora ranking. */}
      <section className="mt-10 card">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-2">
          Advogado {sp.name.toLowerCase()} em outras capitais
        </h2>
        <p className="text-sm text-brand-ink/60 mb-3">
          Encontre profissionais da mesma especialidade nas principais cidades do Brasil.
        </p>
        <div className="flex flex-wrap gap-2">
          {relatedCapitalsForSpecialty(sp, st.uf, 9).map(({ city: cap, state: ostate }) => (
            <Link
              key={`${ostate.uf}-${cap.slug}`}
              href={`/advogados/${ostate.uf.toLowerCase()}/${cap.slug}/${sp.slug}`}
              className="chip text-brand-ink hover:bg-brand-deep hover:text-white hover:border-brand-deep transition"
            >
              {cap.name}/{ostate.uf}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-2xl bg-brand-ink text-white p-6">
        <h2 className="font-display text-xl font-bold mb-2">
          Atua com direito {sp.name.toLowerCase()} em {city.name}? Aumente sua visibilidade
        </h2>
        <p className="text-brand-bg/85 text-sm mb-4 max-w-2xl">
          Com o plano de destaque por {formatCurrency(PLAN.price)} ao mês, seu perfil aparece em
          posição privilegiada quando alguém busca por advogado {sp.name.toLowerCase()} em{" "}
          {city.name}. Mais exposição local, sem fidelidade.
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
          { name: city.name, url: `/advogados/${st.uf.toLowerCase()}/${city.slug}` },
          { name: sp.name, url: `/advogados/${st.uf.toLowerCase()}/${city.slug}/${sp.slug}` }
        ])}
      />
    </div>
  );
}
