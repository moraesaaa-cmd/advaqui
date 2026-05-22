import Link from "next/link";
import { notFound } from "next/navigation";
import { Scale, MapPin } from "lucide-react";
import { TEMAS_STF, findTemaStf } from "@/lib/data/jurisprudencia-temas-stf";
import { JURIS_ASPECTOS } from "@/lib/data/modalidades";
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
  const params: Array<{ slug: string; cidade: string; aspecto: string }> = [];
  for (const t of TEMAS_STF) for (const a of JURIS_ASPECTOS) for (const c of cidades)
    params.push({ slug: t.slug, cidade: `${c.slug}-${c.uf.toLowerCase()}`, aspecto: a.slug });
  return params;
}

function parseCidade(s: string) {
  const m = s.match(/^(.+)-([a-z]{2})$/i);
  if (!m) return null;
  const c = findCity(m[2].toUpperCase(), m[1].toLowerCase());
  return c ? { uf: m[2].toUpperCase(), citySlug: m[1].toLowerCase(), cidadeNome: c.name } : null;
}

export async function generateMetadata({ params }: { params: { slug: string; cidade: string; aspecto: string } }) {
  const t = findTemaStf(params.slug);
  const ci = parseCidade(params.cidade);
  const a = JURIS_ASPECTOS.find(x => x.slug === params.aspecto);
  if (!t || !ci || !a) return buildMetadata({ title: "Não encontrado", description: "", noIndex: true });
  return buildMetadata({
    title: `STF — ${t.titulo} (${a.nome}) em ${ci.cidadeNome}, ${ci.uf}`,
    description: `${t.descricao} Aspecto — ${a.nome} aplicado em ${ci.cidadeNome}/${ci.uf}.`.slice(0, 160),
    path: `/jurisprudencia/stf/tema/${t.slug}/em/${params.cidade}/aspecto/${a.slug}`,
    noIndex: true
  });
}

export default function Page({ params }: { params: { slug: string; cidade: string; aspecto: string } }) {
  const t = findTemaStf(params.slug);
  const ci = parseCidade(params.cidade);
  const a = JURIS_ASPECTOS.find(x => x.slug === params.aspecto);
  if (!t || !ci || !a) notFound();
  const vizinhas = cidadesPrioritariasMesmaRegiao(ci.uf, ci.citySlug, 6);

  return (
    <div className="container-narrow py-10">
      <Breadcrumb items={[
        { label: "Jurisprudência", href: "/jurisprudencia" },
        { label: "STF", href: "/jurisprudencia/stf" },
        { label: t.titulo, href: `/jurisprudencia/stf/tema/${t.slug}` },
        { label: `${ci.cidadeNome}, ${ci.uf}`, href: `/jurisprudencia/stf/tema/${t.slug}/em/${params.cidade}` },
        { label: a.nome }
      ]} />

      <article className="card mb-6">
        <div className="flex items-start gap-3">
          <Scale className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              STF — {t.titulo} (aspecto: {a.nome}) em {ci.cidadeNome}, {ci.uf}
            </h1>
            <p className="text-sm text-brand-ink/55 mt-1 inline-flex items-center gap-2 flex-wrap">
              <MapPin className="w-3.5 h-3.5" aria-hidden />{ci.cidadeNome} · {ci.uf}
              <span className="chip text-xs">{a.nome}</span>
            </p>
            <p className="text-base text-brand-ink/85 mt-3 leading-relaxed">{t.descricao}</p>
            <p className="text-sm text-brand-ink/75 mt-3"><strong>Aspecto desta versão:</strong> {a.descricao}</p>
            <p className="text-sm mt-4"><Link href={`/jurisprudencia/stf/tema/${t.slug}`} className="text-brand-deep underline font-medium">Ver tema geral STF →</Link></p>
          </div>
        </div>
      </article>

      {vizinhas.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-lg font-bold text-brand-ink mb-3 inline-flex items-center gap-2"><MapPin className="w-5 h-5 text-brand-deep" aria-hidden />Mesmo aspecto nas cidades vizinhas</h2>
          <div className="flex flex-wrap gap-2">
            {vizinhas.map(v => (
              <Link key={v.slug} href={`/jurisprudencia/stf/tema/${t.slug}/em/${v.slug}-${v.uf.toLowerCase()}/aspecto/${a.slug}`} className="chip text-brand-ink hover:bg-brand-deep hover:text-white hover:border-brand-deep transition text-xs">{v.nome_completo}</Link>
            ))}
          </div>
        </section>
      )}

      <JsonLd data={breadcrumbSchema([
        { name: "Início", url: "/" },
        { name: "Jurisprudência", url: "/jurisprudencia" },
        { name: "STF", url: "/jurisprudencia/stf" },
        { name: t.titulo, url: `/jurisprudencia/stf/tema/${t.slug}` },
        { name: `${ci.cidadeNome}, ${ci.uf}`, url: `/jurisprudencia/stf/tema/${t.slug}/em/${params.cidade}` },
        { name: a.nome, url: `/jurisprudencia/stf/tema/${t.slug}/em/${params.cidade}/aspecto/${a.slug}` }
      ])} />
    </div>
  );
}
