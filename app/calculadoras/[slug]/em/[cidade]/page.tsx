import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calculator,
  MapPin,
  ListChecks,
  AlertCircle,
  Scale,
  FileText,
  Users,
  ChevronRight
} from "lucide-react";
import {
  CALCULADORAS,
  findCalculadora,
  relatedCalculadoras
} from "@/lib/data/calculadoras";
import {
  getCidadesPrioritarias,
  getCidadesSSG,
  cidadesPrioritariasMesmaRegiao
} from "@/lib/data/cidades-prioritarias";
import { findCity } from "@/lib/data/cities";
import { findSpecialty } from "@/lib/data/specialties";
import { getLawyersForCity } from "@/lib/data/lawyers";
import { LawyerCard } from "@/components/LawyerCard";
import { CalculadoraWidget } from "@/components/CalculadoraWidget";
import { ToolGate } from "@/components/ToolGate";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

/**
 * /calculadoras/[slug]/em/[cidade] — calculadora jurídica × cidade.
 *
 * 8 calculadoras × 5571 cidades IBGE = 44.568 URLs cauda longa.
 *
 * Cada página explica a fórmula, dá exemplo numérico e localiza onde
 * resolver disputas (Vara do Trabalho, Vara de Família etc).
 */

// force-dynamic: renderiza sob demanda SEM gravar em disco — impede o disco de
// reencher conforme o Google rastreia milhares de cidades. URL funciona normal.
export const dynamic = "force-dynamic";

const CALC_SLUGS = CALCULADORAS.map((c) => c.slug);

export function generateStaticParams() {
  const cidades = getCidadesSSG();
  const params: Array<{ slug: string; cidade: string }> = [];
  for (const c of CALC_SLUGS) {
    for (const cid of cidades) {
      params.push({
        slug: c,
        cidade: `${cid.slug}-${cid.uf.toLowerCase()}`
      });
    }
  }
  return params;
}

function parseCidadeParam(
  param: string
): { uf: string; citySlug: string; cidadeNome: string } | null {
  const m = param.match(/^(.+)-([a-z]{2})$/i);
  if (!m) return null;
  const citySlug = m[1].toLowerCase();
  const uf = m[2].toUpperCase();
  const city = findCity(uf, citySlug);
  if (!city) return null;
  return { uf, citySlug, cidadeNome: city.name };
}

export async function generateMetadata({
  params
}: {
  params: { slug: string; cidade: string };
}) {
  const calc = findCalculadora(params.slug);
  const cidadeInfo = parseCidadeParam(params.cidade);
  if (!calc || !cidadeInfo) {
    return buildMetadata({
      title: "Página não encontrada",
      description: "Página não encontrada",
      noIndex: true
    });
  }
  return buildMetadata({
    title: `${calc.titulo} — guia para ${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}`,
    description: `${calc.resumo} Particularidades para ${cidadeInfo.cidadeNome}/${cidadeInfo.uf}.`.slice(
      0,
      160
    ),
    path: `/calculadoras/${calc.slug}/em/${params.cidade}`
  });
}

export default async function CalculadoraCidadePage({
  params
}: {
  params: { slug: string; cidade: string };
}) {
  const calc = findCalculadora(params.slug);
  const cidadeInfo = parseCidadeParam(params.cidade);
  if (!calc || !cidadeInfo) notFound();

  const area = findSpecialty(calc.area_slug);

  let lawyers: Awaited<ReturnType<typeof getLawyersForCity>> = [];
  try {
    lawyers = await getLawyersForCity(cidadeInfo.uf, cidadeInfo.citySlug);
  } catch {
    lawyers = [];
  }
  const lawyersDaArea = lawyers.filter((l) =>
    (l.specialties || []).some(
      (s) =>
        s.toLowerCase() === calc.area_slug.toLowerCase() ||
        (area && s.toLowerCase() === area.name.toLowerCase())
    )
  );
  const lawyersExibir = lawyersDaArea.length > 0 ? lawyersDaArea : lawyers;
  const lawyersTop = lawyersExibir.slice(0, 4);

  const cidadeRegional = cidadesPrioritariasMesmaRegiao(
    cidadeInfo.uf,
    cidadeInfo.citySlug,
    6
  );
  const outras = relatedCalculadoras(calc.slug, 4);
  const ufLower = cidadeInfo.uf.toLowerCase();

  return (
    <div className="container-narrow py-10">
      <Breadcrumb
        items={[
          { label: "Calculadoras", href: "/calculadoras" },
          { label: calc.titulo, href: `/calculadoras/${calc.slug}` },
          { label: `${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}` }
        ]}
      />

      <article className="card mb-6">
        <div className="flex items-start gap-3 mb-3">
          <Calculator className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              {calc.titulo} em {cidadeInfo.cidadeNome}, {cidadeInfo.uf}
            </h1>
            <p className="text-sm text-brand-ink/55 mt-1 inline-flex items-center gap-2 flex-wrap">
              <MapPin className="w-3.5 h-3.5" aria-hidden />
              {cidadeInfo.cidadeNome} · {cidadeInfo.uf}
              {area && <span className="chip text-xs">{area.name}</span>}
            </p>
            <p className="text-base text-brand-ink/85 mt-3 leading-relaxed">
              {calc.resumo}
            </p>
          </div>
        </div>

        {/* Calculadora interativa — usar exige conta grátis (página segue indexável) */}
        <ToolGate>
          <CalculadoraWidget slug={calc.slug} />
        </ToolGate>

        {/* Fórmula */}
        <section className="mt-6 p-4 rounded-xl bg-brand-deep/5 border border-brand-deep/20">
          <h2 className="font-display text-lg font-bold text-brand-ink mb-2 inline-flex items-center gap-2">
            <Scale className="w-5 h-5 text-brand-deep" aria-hidden />
            Como o cálculo funciona
          </h2>
          <p className="text-sm md:text-base text-brand-ink/85 leading-relaxed">
            {calc.formula}
          </p>
        </section>

        {/* Precisa ter */}
        <section className="mt-6">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-deep" aria-hidden />
            O que ter em mãos antes de calcular
          </h2>
          <ul className="space-y-2">
            {calc.precisa_ter.map((p, i) => (
              <li
                key={i}
                className="text-sm md:text-base text-brand-ink/85 leading-relaxed pl-4 border-l-2 border-brand-line"
              >
                {p}
              </li>
            ))}
          </ul>
        </section>

        {/* Exemplo */}
        <section className="mt-6 p-5 rounded-2xl bg-amber-50 border-2 border-amber-200">
          <h2 className="font-display text-xl font-bold text-amber-900 mb-3 inline-flex items-center gap-2">
            <ListChecks className="w-5 h-5" aria-hidden />
            Exemplo prático — passo a passo
          </h2>
          <p className="text-sm md:text-base text-amber-950 font-semibold leading-relaxed mb-3">
            {calc.exemplo.cenario}
          </p>
          <ol className="space-y-2 list-decimal list-inside">
            {calc.exemplo.passos.map((p, i) => (
              <li
                key={i}
                className="text-sm md:text-base text-amber-900 leading-relaxed"
              >
                {p}
              </li>
            ))}
          </ol>
          <p className="mt-4 p-3 rounded-xl bg-amber-100 border border-amber-300 text-sm md:text-base text-amber-950 font-semibold">
            Resultado — {calc.exemplo.resultado}
          </p>
        </section>

        {/* Observações */}
        {calc.observacoes.length > 0 && (
          <section className="mt-6">
            <h2 className="font-display text-lg font-bold text-brand-ink mb-2 inline-flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-brand-deep" aria-hidden />
              Atenção
            </h2>
            <ul className="space-y-2">
              {calc.observacoes.map((o, i) => (
                <li
                  key={i}
                  className="text-sm text-brand-ink/85 leading-relaxed pl-4 border-l-2 border-brand-line"
                >
                  {o}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Variação local */}
        <section className="mt-6 p-4 rounded-xl bg-brand-bg/40 border border-brand-line">
          <h2 className="font-display text-base font-bold text-brand-ink mb-2 inline-flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-deep" aria-hidden />
            Em {cidadeInfo.cidadeNome}/{cidadeInfo.uf}
          </h2>
          <p className="text-sm text-brand-ink/85 leading-relaxed">
            {calc.variacao_local}
          </p>
        </section>
      </article>

      {/* Advogados na área em CIDADE */}
      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-deep" aria-hidden />
          Advogados de {area?.name || "área correlata"} em {cidadeInfo.cidadeNome}
        </h2>
        <p className="text-sm text-brand-ink/75 mb-4 leading-relaxed">
          Cálculo orientativo. Variações no caso específico exigem revisão de
          advogado. Esses profissionais atuam na cidade — fale com 2 ou 3
          antes de decidir.
        </p>
        {lawyersTop.length === 0 ? (
          <p className="text-sm text-brand-ink/80 leading-relaxed">
            Ainda não temos advogados cadastrados em {cidadeInfo.cidadeNome}/
            {cidadeInfo.uf}.{" "}
            <Link href="/cadastro" className="text-brand-deep underline">
              Cadastre-se como o primeiro
            </Link>
            .
          </p>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              {lawyersTop.map((lawyer) => (
                <LawyerCard key={lawyer.id} lawyer={lawyer} />
              ))}
            </div>
            <p className="mt-4 text-sm">
              <Link
                href={`/advogados/${ufLower}/${cidadeInfo.citySlug}/${calc.area_slug}`}
                className="text-brand-deep hover:underline font-medium"
              >
                Ver todos os {area?.name?.toLowerCase() || "advogados"} em{" "}
                {cidadeInfo.cidadeNome} →
              </Link>
            </p>
          </>
        )}
      </section>

      {/* Outras calculadoras */}
      {outras.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-lg font-bold text-brand-ink mb-3">
            Outras calculadoras da mesma área
          </h2>
          <ul className="space-y-2">
            {outras.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/calculadoras/${o.slug}/em/${cidadeInfo.citySlug}-${ufLower}`}
                  className="inline-flex items-center gap-1 text-sm text-brand-deep hover:underline"
                >
                  <ChevronRight className="w-3.5 h-3.5" aria-hidden />
                  {o.titulo} em {cidadeInfo.cidadeNome}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Cidades vizinhas */}
      {cidadeRegional.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-lg font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-deep" aria-hidden />
            Mesma calculadora nas cidades vizinhas
          </h2>
          <div className="flex flex-wrap gap-2">
            {cidadeRegional.map((c) => (
              <Link
                key={c.slug}
                href={`/calculadoras/${calc.slug}/em/${c.slug}-${c.uf.toLowerCase()}`}
                className="chip text-brand-ink hover:bg-brand-deep hover:text-white hover:border-brand-deep transition text-xs"
              >
                {c.nome_completo}
              </Link>
            ))}
          </div>
        </section>
      )}

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Calculadoras", url: "/calculadoras" },
          { name: calc.titulo, url: `/calculadoras/${calc.slug}` },
          {
            name: `${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}`,
            url: `/calculadoras/${calc.slug}/em/${params.cidade}`
          }
        ])}
      />
    </div>
  );
}
