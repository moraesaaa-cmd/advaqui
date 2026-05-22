import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText, MapPin } from "lucide-react";
import { getAllTemplates, getTemplateBySlug } from "@/lib/data/templates-docs";
import { MODELO_USOS } from "@/lib/data/modalidades";
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
  const params: Array<{ slug: string; cidade: string; uso: string }> = [];
  for (const tpl of getAllTemplates()) for (const u of MODELO_USOS) for (const c of cidades)
    params.push({ slug: tpl.slug, cidade: `${c.slug}-${c.uf.toLowerCase()}`, uso: u.slug });
  return params;
}

function parseCidade(s: string) {
  const m = s.match(/^(.+)-([a-z]{2})$/i);
  if (!m) return null;
  const c = findCity(m[2].toUpperCase(), m[1].toLowerCase());
  return c ? { uf: m[2].toUpperCase(), citySlug: m[1].toLowerCase(), cidadeNome: c.name } : null;
}

export async function generateMetadata({ params }: { params: { slug: string; cidade: string; uso: string } }) {
  const t = getTemplateBySlug(params.slug);
  const ci = parseCidade(params.cidade);
  const u = MODELO_USOS.find(x => x.slug === params.uso);
  if (!t || !ci || !u) return buildMetadata({ title: "Não encontrado", description: "", noIndex: true });
  return buildMetadata({
    title: `${t.title} — ${u.nome} em ${ci.cidadeNome}, ${ci.uf}`,
    description: `Modelo de ${t.title.toLowerCase()} para ${u.nome} em ${ci.cidadeNome}/${ci.uf}.`.slice(0, 160),
    path: `/modelos/${t.slug}/em/${params.cidade}/uso-${u.slug}`
  });
}

export default function Page({ params }: { params: { slug: string; cidade: string; uso: string } }) {
  const t = getTemplateBySlug(params.slug);
  const ci = parseCidade(params.cidade);
  const u = MODELO_USOS.find(x => x.slug === params.uso);
  if (!t || !ci || !u) notFound();
  const vizinhas = cidadesPrioritariasMesmaRegiao(ci.uf, ci.citySlug, 6);

  return (
    <div className="container-narrow py-10">
      <Breadcrumb items={[
        { label: "Modelos", href: "/modelos" },
        { label: t.title, href: `/modelos/${t.slug}` },
        { label: `${ci.cidadeNome}, ${ci.uf}`, href: `/modelos/${t.slug}/em/${params.cidade}` },
        { label: u.nome }
      ]} />

      <article className="card mb-6">
        <div className="flex items-start gap-3">
          <FileText className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              {t.title} — {u.nome} em {ci.cidadeNome}, {ci.uf}
            </h1>
            <p className="text-sm text-brand-ink/55 mt-1 inline-flex items-center gap-2 flex-wrap">
              <MapPin className="w-3.5 h-3.5" aria-hidden />{ci.cidadeNome} · {ci.uf}
              <span className="chip text-xs">{t.category}</span>
              <span className="chip text-xs">{u.nome}</span>
            </p>
            <p className="text-base text-brand-ink/85 mt-3 leading-relaxed">{t.description}</p>
            <p className="text-sm text-brand-ink/75 mt-3"><strong>Para {u.nome}:</strong> {u.descricao} Em {ci.cidadeNome}/{ci.uf}, os cartórios de notas locais reconhecem firma desse tipo de documento sem dificuldade.</p>
            <p className="text-sm mt-4"><Link href={`/modelos/${t.slug}`} className="text-brand-deep underline font-medium">Ver modelo completo →</Link></p>
          </div>
        </div>
      </article>

      {vizinhas.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-lg font-bold text-brand-ink mb-3 inline-flex items-center gap-2"><MapPin className="w-5 h-5 text-brand-deep" aria-hidden />Mesmo modelo {u.nome} nas cidades vizinhas</h2>
          <div className="flex flex-wrap gap-2">
            {vizinhas.map(v => (
              <Link key={v.slug} href={`/modelos/${t.slug}/em/${v.slug}-${v.uf.toLowerCase()}/uso-${u.slug}`} className="chip text-brand-ink hover:bg-brand-deep hover:text-white hover:border-brand-deep transition text-xs">{v.nome_completo}</Link>
            ))}
          </div>
        </section>
      )}

      <JsonLd data={breadcrumbSchema([
        { name: "Início", url: "/" },
        { name: "Modelos", url: "/modelos" },
        { name: t.title, url: `/modelos/${t.slug}` },
        { name: `${ci.cidadeNome}, ${ci.uf}`, url: `/modelos/${t.slug}/em/${params.cidade}` },
        { name: u.nome, url: `/modelos/${t.slug}/em/${params.cidade}/uso-${u.slug}` }
      ])} />
    </div>
  );
}
