import Link from "next/link";
import { notFound } from "next/navigation";
import { Calculator, MapPin } from "lucide-react";
import { CALCULADORAS, findCalculadora } from "@/lib/data/calculadoras";
import { CALCULADORA_TIPOS } from "@/lib/data/modalidades";
import { findCity } from "@/lib/data/cities";
import { getCidadesPrioritarias, cidadesPrioritariasMesmaRegiao } from "@/lib/data/cidades-prioritarias";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

/** Calculadora × tipo × cidade = 8 × 3 × 5571 ≈ 134k URLs. */
export const revalidate = 86400;
export const dynamicParams = true;

export function generateStaticParams() {
  const cidades = getCidadesPrioritarias().slice(0, 20);
  const params: Array<{ slug: string; cidade: string; tipo: string }> = [];
  for (const calc of CALCULADORAS) for (const t of CALCULADORA_TIPOS) for (const c of cidades)
    params.push({ slug: calc.slug, cidade: `${c.slug}-${c.uf.toLowerCase()}`, tipo: t.slug });
  return params;
}

function parseCidade(s: string) {
  const m = s.match(/^(.+)-([a-z]{2})$/i);
  if (!m) return null;
  const c = findCity(m[2].toUpperCase(), m[1].toLowerCase());
  return c ? { uf: m[2].toUpperCase(), citySlug: m[1].toLowerCase(), cidadeNome: c.name } : null;
}

export async function generateMetadata({ params }: { params: { slug: string; cidade: string; tipo: string } }) {
  const c = findCalculadora(params.slug);
  const ci = parseCidade(params.cidade);
  const t = CALCULADORA_TIPOS.find(x => x.slug === params.tipo);
  if (!c || !ci || !t) return buildMetadata({ title: "Não encontrado", description: "", noIndex: true });
  return buildMetadata({
    title: `${c.titulo} ${t.nome} em ${ci.cidadeNome}, ${ci.uf}`,
    description: `${c.resumo} Adaptação ${t.nome} em ${ci.cidadeNome}/${ci.uf}.`.slice(0, 160),
    path: `/calculadoras/${c.slug}/em/${params.cidade}/tipo/${t.slug}`
  });
}

export default function Page({ params }: { params: { slug: string; cidade: string; tipo: string } }) {
  const c = findCalculadora(params.slug);
  const ci = parseCidade(params.cidade);
  const t = CALCULADORA_TIPOS.find(x => x.slug === params.tipo);
  if (!c || !ci || !t) notFound();
  const vizinhas = cidadesPrioritariasMesmaRegiao(ci.uf, ci.citySlug, 6);

  return (
    <div className="container-narrow py-10">
      <Breadcrumb items={[
        { label: "Calculadoras", href: "/calculadoras" },
        { label: c.titulo, href: `/calculadoras/${c.slug}` },
        { label: `${ci.cidadeNome}, ${ci.uf}`, href: `/calculadoras/${c.slug}/em/${params.cidade}` },
        { label: t.nome }
      ]} />

      <article className="card mb-6">
        <div className="flex items-start gap-3">
          <Calculator className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              {c.titulo} {t.nome} em {ci.cidadeNome}, {ci.uf}
            </h1>
            <p className="text-sm text-brand-ink/55 mt-1 inline-flex items-center gap-2 flex-wrap">
              <MapPin className="w-3.5 h-3.5" aria-hidden />{ci.cidadeNome} · {ci.uf}
              <span className="chip text-xs">{t.nome}</span>
            </p>
            <p className="text-base text-brand-ink/85 mt-3 leading-relaxed">{c.resumo}</p>
            <p className="text-sm text-brand-ink/75 mt-3 leading-relaxed">
              <strong>Para esse regime:</strong> {t.descricao} Em {ci.cidadeNome}/{ci.uf}, a forma de cálculo segue
              o padrão nacional explicado abaixo, com as observações específicas do tipo de regime.
            </p>
          </div>
        </div>

        <section className="mt-6 p-4 rounded-xl bg-brand-deep/5 border border-brand-deep/20">
          <h2 className="font-display text-lg font-bold text-brand-ink mb-2">Fórmula base</h2>
          <p className="text-sm text-brand-ink/85 leading-relaxed">{c.formula}</p>
        </section>

        <section className="mt-6 p-5 rounded-2xl bg-amber-50 border-2 border-amber-200">
          <h2 className="font-display text-lg font-bold text-amber-900 mb-3">Exemplo prático</h2>
          <p className="text-sm text-amber-950 font-semibold mb-2">{c.exemplo.cenario}</p>
          <ol className="space-y-1 list-decimal list-inside">
            {c.exemplo.passos.map((p, i) => <li key={i} className="text-sm text-amber-900">{p}</li>)}
          </ol>
          <p className="mt-3 p-3 rounded-xl bg-amber-100 text-sm text-amber-950 font-semibold">Resultado — {c.exemplo.resultado}</p>
        </section>

        <section className="mt-6">
          <h2 className="font-display text-lg font-bold text-brand-ink mb-2">Em {ci.cidadeNome}</h2>
          <p className="text-sm text-brand-ink/85 leading-relaxed">{c.variacao_local}</p>
        </section>
      </article>

      {vizinhas.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-lg font-bold text-brand-ink mb-3 inline-flex items-center gap-2"><MapPin className="w-5 h-5 text-brand-deep" aria-hidden />Mesmo cálculo nas cidades vizinhas ({t.nome})</h2>
          <div className="flex flex-wrap gap-2">
            {vizinhas.map(v => (
              <Link key={v.slug} href={`/calculadoras/${c.slug}/em/${v.slug}-${v.uf.toLowerCase()}/tipo/${t.slug}`} className="chip text-brand-ink hover:bg-brand-deep hover:text-white hover:border-brand-deep transition text-xs">{v.nome_completo}</Link>
            ))}
          </div>
        </section>
      )}

      <JsonLd data={breadcrumbSchema([
        { name: "Início", url: "/" },
        { name: "Calculadoras", url: "/calculadoras" },
        { name: c.titulo, url: `/calculadoras/${c.slug}` },
        { name: `${ci.cidadeNome}, ${ci.uf}`, url: `/calculadoras/${c.slug}/em/${params.cidade}` },
        { name: t.nome, url: `/calculadoras/${c.slug}/em/${params.cidade}/tipo/${t.slug}` }
      ])} />
    </div>
  );
}
