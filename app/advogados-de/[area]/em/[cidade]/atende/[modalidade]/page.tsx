import Link from "next/link";
import { notFound } from "next/navigation";
import { Users, MapPin } from "lucide-react";
import { SPECIALTIES, findSpecialty } from "@/lib/data/specialties";
import { MODALIDADES_ATENDIMENTO } from "@/lib/data/modalidades";
import { findCity } from "@/lib/data/cities";
import { getCidadesPrioritarias, cidadesPrioritariasMesmaRegiao } from "@/lib/data/cidades-prioritarias";
import { getLawyersForCity } from "@/lib/data/lawyers";
import { LawyerCard } from "@/components/LawyerCard";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const revalidate = 86400;
export const dynamicParams = true;

export function generateStaticParams() {
  const cidades = getCidadesPrioritarias().slice(0, 20);
  const params: Array<{ area: string; cidade: string; modalidade: string }> = [];
  for (const sp of SPECIALTIES) for (const m of MODALIDADES_ATENDIMENTO) for (const c of cidades)
    params.push({ area: sp.slug, cidade: `${c.slug}-${c.uf.toLowerCase()}`, modalidade: m.slug });
  return params;
}

function parseCidade(s: string) {
  const m = s.match(/^(.+)-([a-z]{2})$/i);
  if (!m) return null;
  const c = findCity(m[2].toUpperCase(), m[1].toLowerCase());
  return c ? { uf: m[2].toUpperCase(), citySlug: m[1].toLowerCase(), cidadeNome: c.name } : null;
}

export async function generateMetadata({ params }: { params: { area: string; cidade: string; modalidade: string } }) {
  const a = findSpecialty(params.area);
  const ci = parseCidade(params.cidade);
  const m = MODALIDADES_ATENDIMENTO.find(x => x.slug === params.modalidade);
  if (!a || !ci || !m) return buildMetadata({ title: "Não encontrado", description: "", noIndex: true });
  return buildMetadata({
    title: `Advogado de ${a.name} em ${ci.cidadeNome}, ${ci.uf} — ${m.nome}`,
    description: `Profissionais de ${a.name.toLowerCase()} em ${ci.cidadeNome}/${ci.uf} com ${m.nome}.`.slice(0, 160),
    path: `/advogados-de/${a.slug}/em/${params.cidade}/atende/${m.slug}`
  });
}

export default async function Page({ params }: { params: { area: string; cidade: string; modalidade: string } }) {
  const a = findSpecialty(params.area);
  const ci = parseCidade(params.cidade);
  const m = MODALIDADES_ATENDIMENTO.find(x => x.slug === params.modalidade);
  if (!a || !ci || !m) notFound();

  let lawyers: Awaited<ReturnType<typeof getLawyersForCity>> = [];
  try { lawyers = await getLawyersForCity(ci.uf, ci.citySlug); } catch {}
  const daArea = lawyers.filter(l => (l.specialties || []).some(s => s.toLowerCase() === a.slug.toLowerCase() || s.toLowerCase() === a.name.toLowerCase()));
  const top = (daArea.length > 0 ? daArea : lawyers).slice(0, 6);
  const vizinhas = cidadesPrioritariasMesmaRegiao(ci.uf, ci.citySlug, 6);

  return (
    <div className="container-narrow py-10">
      <Breadcrumb items={[
        { label: "Advogados", href: "/advogados" },
        { label: a.name, href: `/advogados/${a.slug}` },
        { label: `${ci.cidadeNome}, ${ci.uf}`, href: `/advogados-de/${a.slug}/em/${params.cidade}` },
        { label: m.nome }
      ]} />

      <article className="card mb-6">
        <div className="flex items-start gap-3">
          <Users className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              Advogado de {a.name} em {ci.cidadeNome}, {ci.uf} — {m.nome}
            </h1>
            <p className="text-sm text-brand-ink/55 mt-1 inline-flex items-center gap-2 flex-wrap">
              <MapPin className="w-3.5 h-3.5" aria-hidden />{ci.cidadeNome} · {ci.uf}
              <span className="chip text-xs">{a.name}</span>
              <span className="chip text-xs">{m.nome}</span>
            </p>
            <p className="text-base text-brand-ink/85 mt-3 leading-relaxed">
              Encontre advogados que atuam em {a.name.toLowerCase()} em {ci.cidadeNome}/{ci.uf} oferecendo {m.nome}.
            </p>
            <p className="text-sm text-brand-ink/75 mt-3"><strong>Sobre essa modalidade:</strong> {m.descricao}</p>
          </div>
        </div>
      </article>

      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-3">Profissionais que aceitam {m.nome} em {ci.cidadeNome}</h2>
        {top.length === 0 ? (
          <p className="text-sm text-brand-ink/80">Nenhum cadastrado ainda. <Link href="/cadastro" className="text-brand-deep underline">Cadastre-se</Link>.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">{top.map(l => <LawyerCard key={l.id} lawyer={l} />)}</div>
        )}
        <p className="mt-4 text-sm"><Link href={`/advogados/${ci.uf.toLowerCase()}/${ci.citySlug}/${a.slug}`} className="text-brand-deep hover:underline font-medium">Ver listagem completa de {a.name.toLowerCase()} →</Link></p>
      </section>

      {vizinhas.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-lg font-bold text-brand-ink mb-3 inline-flex items-center gap-2"><MapPin className="w-5 h-5 text-brand-deep" aria-hidden />{m.nome} nas cidades vizinhas</h2>
          <div className="flex flex-wrap gap-2">
            {vizinhas.map(v => (
              <Link key={v.slug} href={`/advogados-de/${a.slug}/em/${v.slug}-${v.uf.toLowerCase()}/atende/${m.slug}`} className="chip text-brand-ink hover:bg-brand-deep hover:text-white hover:border-brand-deep transition text-xs">{v.nome_completo}</Link>
            ))}
          </div>
        </section>
      )}

      <JsonLd data={breadcrumbSchema([
        { name: "Início", url: "/" },
        { name: "Advogados", url: "/advogados" },
        { name: a.name, url: `/advogados/${a.slug}` },
        { name: `${ci.cidadeNome}, ${ci.uf}`, url: `/advogados-de/${a.slug}/em/${params.cidade}` },
        { name: m.nome, url: `/advogados-de/${a.slug}/em/${params.cidade}/atende/${m.slug}` }
      ])} />
    </div>
  );
}
