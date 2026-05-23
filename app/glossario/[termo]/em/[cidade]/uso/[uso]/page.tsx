import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, MapPin } from "lucide-react";
import { GLOSSARIO, findGlossarioTermo } from "@/lib/data/glossario";
import { GLOSSARIO_USOS } from "@/lib/data/modalidades";
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
  const params: Array<{ termo: string; cidade: string; uso: string }> = [];
  for (const t of GLOSSARIO) for (const u of GLOSSARIO_USOS) for (const c of cidades)
    params.push({ termo: t.slug, cidade: `${c.slug}-${c.uf.toLowerCase()}`, uso: u.slug });
  return params;
}

function parseCidade(s: string) {
  const m = s.match(/^(.+)-([a-z]{2})$/i);
  if (!m) return null;
  const c = findCity(m[2].toUpperCase(), m[1].toLowerCase());
  return c ? { uf: m[2].toUpperCase(), citySlug: m[1].toLowerCase(), cidadeNome: c.name } : null;
}

export async function generateMetadata({ params }: { params: { termo: string; cidade: string; uso: string } }) {
  const t = findGlossarioTermo(params.termo);
  const ci = parseCidade(params.cidade);
  const u = GLOSSARIO_USOS.find(x => x.slug === params.uso);
  if (!t || !ci || !u) return buildMetadata({ title: "Não encontrado", description: "", noIndex: true });
  return buildMetadata({
    title: `${t.termo} — ${u.nome} em ${ci.cidadeNome}, ${ci.uf}`,
    description: `O que significa ${t.termo.toLowerCase()} no ${u.nome.toLowerCase()}, com exemplos práticos em ${ci.cidadeNome}/${ci.uf}.`.slice(0, 160),
    path: `/glossario/${t.slug}/em/${params.cidade}/uso/${u.slug}`
  });
}

export default function Page({ params }: { params: { termo: string; cidade: string; uso: string } }) {
  const t = findGlossarioTermo(params.termo);
  const ci = parseCidade(params.cidade);
  const u = GLOSSARIO_USOS.find(x => x.slug === params.uso);
  if (!t || !ci || !u) notFound();
  const vizinhas = cidadesPrioritariasMesmaRegiao(ci.uf, ci.citySlug, 6);

  return (
    <div className="container-narrow py-10">
      <Breadcrumb items={[
        { label: "Glossário", href: "/glossario" },
        { label: t.termo, href: `/glossario/${t.slug}` },
        { label: `${ci.cidadeNome}, ${ci.uf}`, href: `/glossario/${t.slug}/em/${params.cidade}` },
        { label: u.nome }
      ]} />

      <article className="card mb-6">
        <div className="flex items-start gap-3">
          <BookOpen className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              {t.termo} — {u.nome} em {ci.cidadeNome}, {ci.uf}
            </h1>
            <p className="text-sm text-brand-ink/55 mt-1 inline-flex items-center gap-2 flex-wrap">
              <MapPin className="w-3.5 h-3.5" aria-hidden />{ci.cidadeNome} · {ci.uf}
              <span className="chip text-xs">{u.nome}</span>
            </p>
            <p className="text-base text-brand-ink/85 mt-3 leading-relaxed">{t.definicao_curta}</p>
            <p className="text-sm text-brand-ink/75 mt-3 leading-relaxed"><strong>Neste uso:</strong> {u.descricao}</p>
          </div>
        </div>
        <section className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <h2 className="font-display text-base font-bold text-amber-900 mb-1">Em {ci.cidadeNome}/{ci.uf}</h2>
          <p className="text-sm text-amber-900 leading-relaxed">
            O conceito de <strong>{t.termo.toLowerCase()}</strong> aplica-se uniformemente no Brasil. O que muda
            em {ci.cidadeNome} é o foro competente — varas cíveis ou especializadas — e os cartórios e órgãos
            administrativos da região (Procon, defensoria, OAB seccional) que costumam tratar do tema.
          </p>
        </section>
      </article>

      {vizinhas.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-lg font-bold text-brand-ink mb-3 inline-flex items-center gap-2"><MapPin className="w-5 h-5 text-brand-deep" aria-hidden />Mesmo termo, mesmo uso, cidades vizinhas</h2>
          <div className="flex flex-wrap gap-2">
            {vizinhas.map(v => (
              <Link key={v.slug} href={`/glossario/${t.slug}/em/${v.slug}-${v.uf.toLowerCase()}/uso/${u.slug}`} className="chip text-brand-ink hover:bg-brand-deep hover:text-white hover:border-brand-deep transition text-xs">{v.nome_completo}</Link>
            ))}
          </div>
        </section>
      )}

      <JsonLd data={breadcrumbSchema([
        { name: "Início", url: "/" },
        { name: "Glossário", url: "/glossario" },
        { name: t.termo, url: `/glossario/${t.slug}` },
        { name: `${ci.cidadeNome}, ${ci.uf}`, url: `/glossario/${t.slug}/em/${params.cidade}` },
        { name: u.nome, url: `/glossario/${t.slug}/em/${params.cidade}/uso/${u.slug}` }
      ])} />
    </div>
  );
}
