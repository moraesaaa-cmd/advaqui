import Link from "next/link";
import { notFound } from "next/navigation";
import { HelpCircle, MapPin, Users, ChevronRight, Scale } from "lucide-react";
import { findProblema, PROBLEMAS } from "@/lib/data/problemas-juridicos";
import { findCity } from "@/lib/data/cities";
import { getCidadesPrioritarias, cidadesPrioritariasMesmaRegiao } from "@/lib/data/cidades-prioritarias";
import { findSpecialty, SPECIALTIES } from "@/lib/data/specialties";
import { getLawyersForCity } from "@/lib/data/lawyers";
import { LawyerCard } from "@/components/LawyerCard";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

/**
 * /problemas-juridicos/[slug]/em/[cidade]/area-[area] — 3D
 * 20 problemas × média 2 áreas × 5571 cidades = ~222k URLs cauda longa.
 */
export const revalidate = 86400;
export const dynamicParams = true;

export function generateStaticParams() {
  const cidades = getCidadesPrioritarias().slice(0, 30);
  const params: Array<{ slug: string; cidade: string; area: string }> = [];
  for (const p of PROBLEMAS) {
    for (const a of p.areas) {
      for (const c of cidades) {
        params.push({ slug: p.slug, cidade: `${c.slug}-${c.uf.toLowerCase()}`, area: a });
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

export async function generateMetadata({ params }: { params: { slug: string; cidade: string; area: string } }) {
  const p = findProblema(params.slug);
  const ci = parseCidade(params.cidade);
  const a = findSpecialty(params.area);
  if (!p || !ci || !a) return buildMetadata({ title: "Não encontrado", description: "", noIndex: true });
  return buildMetadata({
    title: `${p.titulo.replace(/[?.]$/, "")} em ${ci.cidadeNome}, ${ci.uf} — ângulo ${a.name}`,
    description: `${p.resumo} Veja o aspecto de ${a.name.toLowerCase()} para casos em ${ci.cidadeNome}/${ci.uf}.`.slice(0, 160),
    path: `/problemas-juridicos/${p.slug}/em/${params.cidade}/area/${a.slug}`
  });
}

export default async function ProblemaAreaCidadePage({ params }: { params: { slug: string; cidade: string; area: string } }) {
  const p = findProblema(params.slug);
  const ci = parseCidade(params.cidade);
  const a = findSpecialty(params.area);
  if (!p || !ci || !a) notFound();
  // Só geramos a URL se essa área está realmente listada no problema
  if (!p.areas.includes(a.slug)) notFound();

  const ufLower = ci.uf.toLowerCase();
  let lawyers: Awaited<ReturnType<typeof getLawyersForCity>> = [];
  try { lawyers = await getLawyersForCity(ci.uf, ci.citySlug); } catch {}
  const daArea = lawyers.filter(l => (l.specialties || []).some(s => s.toLowerCase() === a.slug.toLowerCase() || s.toLowerCase() === a.name.toLowerCase()));
  const top = (daArea.length > 0 ? daArea : lawyers).slice(0, 4);
  const vizinhas = cidadesPrioritariasMesmaRegiao(ci.uf, ci.citySlug, 6);

  return (
    <div className="container-narrow py-10">
      <Breadcrumb items={[
        { label: "Problemas jurídicos", href: "/problemas-juridicos" },
        { label: p.titulo, href: `/problemas-juridicos/${p.slug}` },
        { label: `${ci.cidadeNome}, ${ci.uf}`, href: `/problemas-juridicos/${p.slug}/em/${params.cidade}` },
        { label: `Ângulo: ${a.name}` }
      ]} />

      <article className="card mb-6">
        <div className="flex items-start gap-3">
          <HelpCircle className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              {p.titulo.replace(/[?.]$/, "")} em {ci.cidadeNome}, {ci.uf} — pelo ângulo do direito {a.name.toLowerCase()}
            </h1>
            <p className="text-sm text-brand-ink/55 mt-1 inline-flex items-center gap-2 flex-wrap">
              <MapPin className="w-3.5 h-3.5" aria-hidden />{ci.cidadeNome} · {ci.uf}
              <span className="chip text-xs">{a.name}</span>
            </p>
            <p className="text-base text-brand-ink/85 mt-3 leading-relaxed">{p.resumo}</p>
            <p className="text-sm text-brand-ink/75 mt-3 leading-relaxed">
              Esse problema, em {ci.cidadeNome}/{ci.uf}, frequentemente envolve aspectos do direito{" "}
              <strong>{a.name.toLowerCase()}</strong> — o que muda na prática são as varas competentes
              (especializadas em {a.name.toLowerCase()} quando há, ou cíveis comuns nas comarcas menores)
              e a doutrina aplicável. Procedimentos administrativos pela área específica (Procon, Defensoria,
              INSS, conforme o caso) são o primeiro passo antes da via judicial.
            </p>
          </div>
        </div>

        <section className="mt-6">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-2">O que considerar pelo viés de {a.name.toLowerCase()}</h2>
          <ul className="space-y-2">
            {p.situacao.slice(0, 4).map((s, i) => (
              <li key={i} className="text-sm md:text-base text-brand-ink/85 leading-relaxed pl-4 border-l-2 border-brand-line">{s}</li>
            ))}
          </ul>
        </section>

        <section className="mt-6">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-2">Passos iniciais em {ci.cidadeNome}</h2>
          <ol className="space-y-2 list-decimal list-inside">
            {p.passos.slice(0, 4).map((passo, i) => (
              <li key={i} className="text-sm md:text-base text-brand-ink/85 leading-relaxed">
                <strong>{passo.titulo}.</strong> {passo.texto}
              </li>
            ))}
          </ol>
        </section>
      </article>

      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-deep" aria-hidden />
          Advogados de {a.name.toLowerCase()} em {ci.cidadeNome}
        </h2>
        {top.length === 0 ? (
          <p className="text-sm text-brand-ink/80">Nenhum cadastrado ainda. <Link href="/cadastro" className="text-brand-deep underline">Seja o primeiro</Link>.</p>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2">{top.map(l => <LawyerCard key={l.id} lawyer={l} />)}</div>
            <p className="mt-4 text-sm"><Link href={`/advogados/${ufLower}/${ci.citySlug}/${a.slug}`} className="text-brand-deep hover:underline font-medium">Ver listagem completa →</Link></p>
          </>
        )}
      </section>

      {vizinhas.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-lg font-bold text-brand-ink mb-3 inline-flex items-center gap-2"><MapPin className="w-5 h-5 text-brand-deep" aria-hidden />Mesmo problema nas cidades vizinhas</h2>
          <div className="flex flex-wrap gap-2">
            {vizinhas.map(c => (
              <Link key={c.slug} href={`/problemas-juridicos/${p.slug}/em/${c.slug}-${c.uf.toLowerCase()}/area/${a.slug}`} className="chip text-brand-ink hover:bg-brand-deep hover:text-white hover:border-brand-deep transition text-xs">{c.nome_completo}</Link>
            ))}
          </div>
        </section>
      )}

      <JsonLd data={breadcrumbSchema([
        { name: "Início", url: "/" },
        { name: "Problemas jurídicos", url: "/problemas-juridicos" },
        { name: p.titulo, url: `/problemas-juridicos/${p.slug}` },
        { name: `${ci.cidadeNome}, ${ci.uf}`, url: `/problemas-juridicos/${p.slug}/em/${params.cidade}` },
        { name: a.name, url: `/problemas-juridicos/${p.slug}/em/${params.cidade}/area/${a.slug}` }
      ])} />
    </div>
  );
}
