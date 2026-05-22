import Link from "next/link";
import { notFound } from "next/navigation";
import { DollarSign, MapPin, ChevronRight } from "lucide-react";
import { CUSTOS, findCusto, formatFaixa } from "@/lib/data/custos-juridicos";
import { MODALIDADES_ATENDIMENTO } from "@/lib/data/modalidades";
import { findCity } from "@/lib/data/cities";
import { getCidadesPrioritarias, cidadesPrioritariasMesmaRegiao } from "@/lib/data/cidades-prioritarias";
import { findSpecialty } from "@/lib/data/specialties";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

/**
 * /quanto-custa/[servico]/em/[cidade]/modalidade-[m] — 3D
 * 15 serviços × 3 modalidades × 5571 cidades = 250k URLs.
 */
export const revalidate = 86400;
export const dynamicParams = true;

export function generateStaticParams() {
  const cidades = getCidadesPrioritarias().slice(0, 20);
  const params: Array<{ servico: string; cidade: string; modalidade: string }> = [];
  for (const c of CUSTOS) {
    for (const m of MODALIDADES_ATENDIMENTO) {
      for (const cid of cidades) {
        params.push({ servico: c.slug, cidade: `${cid.slug}-${cid.uf.toLowerCase()}`, modalidade: m.slug });
      }
    }
  }
  return params;
}

function parseCidade(s: string) {
  const m = s.match(/^(.+)-([a-z]{2})$/i);
  if (!m) return null;
  const c = findCity(m[2].toUpperCase(), m[1].toLowerCase());
  return c ? { uf: m[2].toUpperCase(), citySlug: m[1].toLowerCase(), cidadeNome: c.name } : null;
}

export async function generateMetadata({ params }: { params: { servico: string; cidade: string; modalidade: string } }) {
  const c = findCusto(params.servico);
  const ci = parseCidade(params.cidade);
  const m = MODALIDADES_ATENDIMENTO.find(x => x.slug === params.modalidade);
  if (!c || !ci || !m) return buildMetadata({ title: "Não encontrado", description: "", noIndex: true });
  return buildMetadata({
    title: `${c.titulo} em ${ci.cidadeNome}, ${ci.uf} — ${m.nome}`,
    description: `Faixa de honorário em ${ci.cidadeNome}/${ci.uf} com ${m.nome}. ${formatFaixa(c.faixa_min, c.faixa_max)}.`.slice(0, 160),
    path: `/quanto-custa/${c.slug}/em/${params.cidade}/modalidade/${m.slug}`
  });
}

export default function Page({ params }: { params: { servico: string; cidade: string; modalidade: string } }) {
  const c = findCusto(params.servico);
  const ci = parseCidade(params.cidade);
  const m = MODALIDADES_ATENDIMENTO.find(x => x.slug === params.modalidade);
  if (!c || !ci || !m) notFound();
  const area = findSpecialty(c.area_slug);
  const vizinhas = cidadesPrioritariasMesmaRegiao(ci.uf, ci.citySlug, 6);
  const faixa = formatFaixa(c.faixa_min, c.faixa_max);

  return (
    <div className="container-narrow py-10">
      <Breadcrumb items={[
        { label: "Quanto custa", href: "/quanto-custa" },
        { label: c.titulo, href: `/quanto-custa/${c.slug}` },
        { label: `${ci.cidadeNome}, ${ci.uf}`, href: `/quanto-custa/${c.slug}/em/${params.cidade}` },
        { label: m.nome }
      ]} />

      <article className="card mb-6">
        <div className="flex items-start gap-3">
          <DollarSign className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              {c.titulo} em {ci.cidadeNome}, {ci.uf} — com {m.nome}
            </h1>
            <p className="text-sm text-brand-ink/55 mt-1 inline-flex items-center gap-2 flex-wrap">
              <MapPin className="w-3.5 h-3.5" aria-hidden />{ci.cidadeNome} · {ci.uf}
              {area && <span className="chip text-xs">{area.name}</span>}
            </p>
            <div className="mt-4 p-5 rounded-2xl bg-brand-deep/5 border-2 border-brand-deep/20">
              <p className="text-xs uppercase tracking-wider text-brand-deep font-semibold">Faixa em {ci.cidadeNome} ({m.nome})</p>
              <p className="font-display text-3xl md:text-4xl font-extrabold text-brand-ink mt-1">{faixa}</p>
              <p className="text-sm text-brand-ink/70 mt-2">{c.resumo}</p>
              <p className="text-sm text-brand-ink/75 mt-3">
                Com <strong>{m.nome}</strong> — {m.descricao} Em {ci.cidadeNome}/{ci.uf}, advogados que oferecem essa
                modalidade costumam reduzir levemente o honorário (online) ou cobrar adicional (urgente). Pergunte antes
                de fechar.
              </p>
            </div>
          </div>
        </div>

        <section className="mt-6">
          <h2 className="font-display text-lg font-bold text-brand-ink mb-2">O que esperar em {ci.cidadeNome}</h2>
          <p className="text-sm text-brand-ink/85 leading-relaxed">{c.variacao_local}</p>
        </section>

        <div className="mt-6 p-4 rounded-xl bg-brand-bg/40 border border-brand-line">
          <p className="text-sm text-brand-ink/85">
            <strong>Encontrar advogado em {ci.cidadeNome}</strong> que aceite {m.nome}:{" "}
            <Link href={`/advogados/${ci.uf.toLowerCase()}/${ci.citySlug}/${c.area_slug}`} className="text-brand-deep underline font-medium">
              ver lista da área {area?.name?.toLowerCase() || ""} em {ci.cidadeNome} →
            </Link>
          </p>
        </div>
      </article>

      {vizinhas.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-lg font-bold text-brand-ink mb-3 inline-flex items-center gap-2"><MapPin className="w-5 h-5 text-brand-deep" aria-hidden />Mesma faixa nas cidades vizinhas ({m.nome})</h2>
          <div className="flex flex-wrap gap-2">
            {vizinhas.map(v => (
              <Link key={v.slug} href={`/quanto-custa/${c.slug}/em/${v.slug}-${v.uf.toLowerCase()}/modalidade/${m.slug}`} className="chip text-brand-ink hover:bg-brand-deep hover:text-white hover:border-brand-deep transition text-xs">{v.nome_completo}</Link>
            ))}
          </div>
        </section>
      )}

      <JsonLd data={breadcrumbSchema([
        { name: "Início", url: "/" },
        { name: "Quanto custa", url: "/quanto-custa" },
        { name: c.titulo, url: `/quanto-custa/${c.slug}` },
        { name: `${ci.cidadeNome}, ${ci.uf}`, url: `/quanto-custa/${c.slug}/em/${params.cidade}` },
        { name: m.nome, url: `/quanto-custa/${c.slug}/em/${params.cidade}/modalidade/${m.slug}` }
      ])} />
    </div>
  );
}
