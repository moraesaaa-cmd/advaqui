import Link from "next/link";
import { notFound } from "next/navigation";
import { Compass, MapPin } from "lucide-react";
import { GUIAS, findGuia } from "@/lib/data/guias";
import { GUIA_PUBLICOS } from "@/lib/data/modalidades";
import { findCity } from "@/lib/data/cities";
import { getCidadesPrioritarias, cidadesPrioritariasMesmaRegiao } from "@/lib/data/cidades-prioritarias";
import { findSpecialty } from "@/lib/data/specialties";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const revalidate = 86400;
export const dynamicParams = true;

export function generateStaticParams() {
  const cidades = getCidadesPrioritarias().slice(0, 20);
  const params: Array<{ slug: string; cidade: string; publico: string }> = [];
  for (const g of GUIAS) for (const p of GUIA_PUBLICOS) for (const c of cidades)
    params.push({ slug: g.slug, cidade: `${c.slug}-${c.uf.toLowerCase()}`, publico: p.slug });
  return params;
}

function parseCidade(s: string) {
  const m = s.match(/^(.+)-([a-z]{2})$/i);
  if (!m) return null;
  const c = findCity(m[2].toUpperCase(), m[1].toLowerCase());
  return c ? { uf: m[2].toUpperCase(), citySlug: m[1].toLowerCase(), cidadeNome: c.name } : null;
}

export async function generateMetadata({ params }: { params: { slug: string; cidade: string; publico: string } }) {
  const g = findGuia(params.slug);
  const ci = parseCidade(params.cidade);
  const p = GUIA_PUBLICOS.find(x => x.slug === params.publico);
  if (!g || !ci || !p) return buildMetadata({ title: "Não encontrado", description: "", noIndex: true });
  return buildMetadata({
    title: `${g.titulo} ${p.nome} em ${ci.cidadeNome}, ${ci.uf}`,
    description: `${g.tagline} ${p.descricao}`.slice(0, 160),
    path: `/guias/${g.slug}/em/${params.cidade}/publico-${p.slug}`
  });
}

export default function Page({ params }: { params: { slug: string; cidade: string; publico: string } }) {
  const g = findGuia(params.slug);
  const ci = parseCidade(params.cidade);
  const p = GUIA_PUBLICOS.find(x => x.slug === params.publico);
  if (!g || !ci || !p) notFound();
  const area = findSpecialty(g.area_slug);
  const vizinhas = cidadesPrioritariasMesmaRegiao(ci.uf, ci.citySlug, 6);

  return (
    <div className="container-narrow py-10">
      <Breadcrumb items={[
        { label: "Guias", href: "/guias" },
        { label: g.titulo, href: `/guias/${g.slug}` },
        { label: `${ci.cidadeNome}, ${ci.uf}`, href: `/guias/${g.slug}/em/${params.cidade}` },
        { label: p.nome }
      ]} />

      <article className="card mb-6">
        <div className="flex items-start gap-3">
          <Compass className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              {g.titulo} {p.nome} em {ci.cidadeNome}, {ci.uf}
            </h1>
            <p className="text-sm text-brand-ink/55 mt-1 inline-flex items-center gap-2 flex-wrap">
              <MapPin className="w-3.5 h-3.5" aria-hidden />{ci.cidadeNome} · {ci.uf}
              {area && <span className="chip text-xs">{area.name}</span>}
              <span className="chip text-xs">{p.nome}</span>
            </p>
            <p className="text-base text-brand-ink/85 mt-3 leading-relaxed">{g.tagline}</p>
            <p className="text-sm text-brand-ink/75 mt-3 leading-relaxed"><strong>Público desta versão:</strong> {p.descricao}</p>
          </div>
        </div>
        {g.introducao.map((para, i) => (
          <p key={i} className="text-sm md:text-base text-brand-ink/85 leading-relaxed mt-3">{para}</p>
        ))}
        <section className="mt-6">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-3">Pontos centrais — {p.nome}</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {g.temas_centrais.slice(0, 4).map((t, i) => (
              <div key={i} className="rounded-xl border border-brand-line bg-white p-4">
                <p className="font-semibold text-brand-ink">{t.titulo}</p>
                <p className="text-sm text-brand-ink/80 mt-1">{t.descricao}</p>
              </div>
            ))}
          </div>
        </section>
      </article>

      {vizinhas.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-lg font-bold text-brand-ink mb-3 inline-flex items-center gap-2"><MapPin className="w-5 h-5 text-brand-deep" aria-hidden />Mesmo guia {p.nome} nas cidades vizinhas</h2>
          <div className="flex flex-wrap gap-2">
            {vizinhas.map(v => (
              <Link key={v.slug} href={`/guias/${g.slug}/em/${v.slug}-${v.uf.toLowerCase()}/publico-${p.slug}`} className="chip text-brand-ink hover:bg-brand-deep hover:text-white hover:border-brand-deep transition text-xs">{v.nome_completo}</Link>
            ))}
          </div>
        </section>
      )}

      <JsonLd data={breadcrumbSchema([
        { name: "Início", url: "/" },
        { name: "Guias", url: "/guias" },
        { name: g.titulo, url: `/guias/${g.slug}` },
        { name: `${ci.cidadeNome}, ${ci.uf}`, url: `/guias/${g.slug}/em/${params.cidade}` },
        { name: p.nome, url: `/guias/${g.slug}/em/${params.cidade}/publico-${p.slug}` }
      ])} />
    </div>
  );
}
