import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, MapPin } from "lucide-react";
import { getArticleBySlug } from "@/lib/data/articles";
import { ARTIGOS_LOCALIZAVEIS_SLUGS } from "@/lib/data/articles-cidades";
import { BLOG_SITUACOES } from "@/lib/data/modalidades";
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
  const params: Array<{ slug: string; cidade: string; situacao: string }> = [];
  for (const slug of ARTIGOS_LOCALIZAVEIS_SLUGS) for (const s of BLOG_SITUACOES) for (const c of cidades)
    params.push({ slug, cidade: `${c.slug}-${c.uf.toLowerCase()}`, situacao: s.slug });
  return params;
}

function parseCidade(s: string) {
  const m = s.match(/^(.+)-([a-z]{2})$/i);
  if (!m) return null;
  const c = findCity(m[2].toUpperCase(), m[1].toLowerCase());
  return c ? { uf: m[2].toUpperCase(), citySlug: m[1].toLowerCase(), cidadeNome: c.name } : null;
}

export async function generateMetadata({ params }: { params: { slug: string; cidade: string; situacao: string } }) {
  const art = getArticleBySlug(params.slug);
  const ci = parseCidade(params.cidade);
  const s = BLOG_SITUACOES.find(x => x.slug === params.situacao);
  if (!art || !ci || !s || !ARTIGOS_LOCALIZAVEIS_SLUGS.includes(params.slug)) {
    return buildMetadata({ title: "Não encontrado", description: "", noIndex: true });
  }
  return buildMetadata({
    title: `${art.title} — ${s.nome} em ${ci.cidadeNome}, ${ci.uf}`,
    description: `${art.excerpt} Caso ${s.nome}.`.slice(0, 160),
    path: `/blog/${art.slug}/em/${params.cidade}/situacao-${s.slug}`
  });
}

export default function Page({ params }: { params: { slug: string; cidade: string; situacao: string } }) {
  const art = getArticleBySlug(params.slug);
  const ci = parseCidade(params.cidade);
  const s = BLOG_SITUACOES.find(x => x.slug === params.situacao);
  if (!art || !ci || !s || !ARTIGOS_LOCALIZAVEIS_SLUGS.includes(params.slug)) notFound();
  const vizinhas = cidadesPrioritariasMesmaRegiao(ci.uf, ci.citySlug, 6);

  return (
    <div className="container-narrow py-10">
      <Breadcrumb items={[
        { label: "Blog", href: "/blog" },
        { label: art.title, href: `/blog/${art.slug}` },
        { label: `${ci.cidadeNome}, ${ci.uf}`, href: `/blog/${art.slug}/em/${params.cidade}` },
        { label: s.nome }
      ]} />

      <article className="card mb-6">
        <div className="flex items-start gap-3">
          <BookOpen className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              {art.title} — quando é {s.nome} em {ci.cidadeNome}, {ci.uf}
            </h1>
            <p className="text-sm text-brand-ink/55 mt-1 inline-flex items-center gap-2 flex-wrap">
              <MapPin className="w-3.5 h-3.5" aria-hidden />{ci.cidadeNome} · {ci.uf}
              <span className="chip text-xs">{s.nome}</span>
            </p>
            <p className="text-base text-brand-ink/85 mt-3 leading-relaxed">{art.excerpt}</p>
            <p className="text-sm text-brand-ink/75 mt-3"><strong>Contexto desta versão:</strong> {s.descricao}</p>
            <p className="text-sm mt-4"><Link href={`/blog/${art.slug}`} className="text-brand-deep underline font-medium">Ler artigo completo →</Link></p>
          </div>
        </div>
      </article>

      {vizinhas.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-lg font-bold text-brand-ink mb-3 inline-flex items-center gap-2"><MapPin className="w-5 h-5 text-brand-deep" aria-hidden />{s.nome} — nas cidades vizinhas</h2>
          <div className="flex flex-wrap gap-2">
            {vizinhas.map(v => (
              <Link key={v.slug} href={`/blog/${art.slug}/em/${v.slug}-${v.uf.toLowerCase()}/situacao-${s.slug}`} className="chip text-brand-ink hover:bg-brand-deep hover:text-white hover:border-brand-deep transition text-xs">{v.nome_completo}</Link>
            ))}
          </div>
        </section>
      )}

      <JsonLd data={breadcrumbSchema([
        { name: "Início", url: "/" },
        { name: "Blog", url: "/blog" },
        { name: art.title, url: `/blog/${art.slug}` },
        { name: `${ci.cidadeNome}, ${ci.uf}`, url: `/blog/${art.slug}/em/${params.cidade}` },
        { name: s.nome, url: `/blog/${art.slug}/em/${params.cidade}/situacao-${s.slug}` }
      ])} />
    </div>
  );
}
