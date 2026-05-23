import Link from "next/link";
import { notFound } from "next/navigation";
import { Scale, MapPin } from "lucide-react";
import { TEMAS_STJ, findTemaStj } from "@/lib/data/jurisprudencia-temas";
import { SPECIALTIES, findSpecialty } from "@/lib/data/specialties";
import { findCity } from "@/lib/data/cities";
import { getCidadesPrioritarias, cidadesPrioritariasMesmaRegiao } from "@/lib/data/cidades-prioritarias";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const revalidate = 86400;
export const dynamicParams = true;

export function generateStaticParams() {
  const cidades = getCidadesPrioritarias().slice(0, 15);
  const params: Array<{ slug: string; cidade: string; area: string }> = [];
  for (const t of TEMAS_STJ) for (const a of t.areas) for (const c of cidades)
    params.push({ slug: t.slug, cidade: `${c.slug}-${c.uf.toLowerCase()}`, area: a });
  return params;
}

function parseCidade(s: string) {
  const m = s.match(/^(.+)-([a-z]{2})$/i);
  if (!m) return null;
  const c = findCity(m[2].toUpperCase(), m[1].toLowerCase());
  return c ? { uf: m[2].toUpperCase(), citySlug: m[1].toLowerCase(), cidadeNome: c.name } : null;
}

export async function generateMetadata({ params }: { params: { slug: string; cidade: string; area: string } }) {
  const t = findTemaStj(params.slug);
  const ci = parseCidade(params.cidade);
  const a = findSpecialty(params.area);
  if (!t || !ci || !a) return buildMetadata({ title: "Não encontrado", description: "", noIndex: true });
  return buildMetadata({
    title: `STJ — ${t.titulo} (${a.name}) em ${ci.cidadeNome}, ${ci.uf}`,
    description: `${t.descricao} Aplicação na área de ${a.name.toLowerCase()} em ${ci.cidadeNome}/${ci.uf}.`.slice(0, 160),
    path: `/jurisprudencia/stj/tema/${t.slug}/em/${params.cidade}/area-${a.slug}`,
    noIndex: true // até banco STJ ter >=3 decisões por tema; controlado por cron
  });
}

export default function Page({ params }: { params: { slug: string; cidade: string; area: string } }) {
  const t = findTemaStj(params.slug);
  const ci = parseCidade(params.cidade);
  const a = findSpecialty(params.area);
  if (!t || !ci || !a) notFound();
  if (!t.areas.includes(a.slug)) notFound();
  const vizinhas = cidadesPrioritariasMesmaRegiao(ci.uf, ci.citySlug, 6);

  return (
    <div className="container-narrow py-10">
      <Breadcrumb items={[
        { label: "Jurisprudência", href: "/jurisprudencia" },
        { label: "STJ", href: "/jurisprudencia/stj" },
        { label: t.titulo, href: `/jurisprudencia/stj/tema/${t.slug}` },
        { label: `${ci.cidadeNome}, ${ci.uf}`, href: `/jurisprudencia/stj/tema/${t.slug}/em/${params.cidade}` },
        { label: a.name }
      ]} />

      <article className="card mb-6">
        <div className="flex items-start gap-3">
          <Scale className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              STJ — {t.titulo} pelo ângulo de {a.name.toLowerCase()} em {ci.cidadeNome}, {ci.uf}
            </h1>
            <p className="text-sm text-brand-ink/55 mt-1 inline-flex items-center gap-2 flex-wrap">
              <MapPin className="w-3.5 h-3.5" aria-hidden />{ci.cidadeNome} · {ci.uf}
              <span className="chip text-xs">{a.name}</span>
            </p>
            <p className="text-base text-brand-ink/85 mt-3 leading-relaxed">{t.descricao}</p>
            <p className="text-sm text-brand-ink/75 mt-3">
              Na perspectiva do direito {a.name.toLowerCase()}, esse tema do STJ orienta a aplicação em {ci.cidadeNome}/{ci.uf}.
              As decisões da Corte vinculam a interpretação em todo o Brasil, com particularidades de competência conforme
              a comarca local.
            </p>
            <p className="text-sm mt-4"><Link href={`/jurisprudencia/stj/tema/${t.slug}`} className="text-brand-deep underline font-medium">Ver tema geral STJ →</Link></p>
          </div>
        </div>
      </article>

      {vizinhas.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-lg font-bold text-brand-ink mb-3 inline-flex items-center gap-2"><MapPin className="w-5 h-5 text-brand-deep" aria-hidden />Mesmo ângulo nas cidades vizinhas</h2>
          <div className="flex flex-wrap gap-2">
            {vizinhas.map(v => (
              <Link key={v.slug} href={`/jurisprudencia/stj/tema/${t.slug}/em/${v.slug}-${v.uf.toLowerCase()}/area-${a.slug}`} className="chip text-brand-ink hover:bg-brand-deep hover:text-white hover:border-brand-deep transition text-xs">{v.nome_completo}</Link>
            ))}
          </div>
        </section>
      )}

      <JsonLd data={breadcrumbSchema([
        { name: "Início", url: "/" },
        { name: "Jurisprudência", url: "/jurisprudencia" },
        { name: "STJ", url: "/jurisprudencia/stj" },
        { name: t.titulo, url: `/jurisprudencia/stj/tema/${t.slug}` },
        { name: `${ci.cidadeNome}, ${ci.uf}`, url: `/jurisprudencia/stj/tema/${t.slug}/em/${params.cidade}` },
        { name: a.name, url: `/jurisprudencia/stj/tema/${t.slug}/em/${params.cidade}/area-${a.slug}` }
      ])} />
    </div>
  );
}
