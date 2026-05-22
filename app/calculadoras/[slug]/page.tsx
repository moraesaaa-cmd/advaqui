import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calculator,
  ChevronRight,
  ListChecks,
  FileText,
  AlertCircle,
  Scale,
  MapPin
} from "lucide-react";
import {
  CALCULADORAS,
  findCalculadora,
  relatedCalculadoras
} from "@/lib/data/calculadoras";
import { getCidadesPrioritarias } from "@/lib/data/cidades-prioritarias";
import { findSpecialty } from "@/lib/data/specialties";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const revalidate = 86400;

export function generateStaticParams() {
  return CALCULADORAS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}) {
  const calc = findCalculadora(params.slug);
  if (!calc) {
    return buildMetadata({
      title: "Calculadora não encontrada",
      description: "Calculadora não encontrada",
      noIndex: true
    });
  }
  return buildMetadata({
    title: calc.titulo,
    description: calc.resumo.slice(0, 160),
    path: `/calculadoras/${calc.slug}`
  });
}

export default function CalculadoraPage({
  params
}: {
  params: { slug: string };
}) {
  const calc = findCalculadora(params.slug);
  if (!calc) notFound();
  const area = findSpecialty(calc.area_slug);
  const outras = relatedCalculadoras(calc.slug, 4);
  const cidadesPrior = getCidadesPrioritarias().slice(0, 12);

  return (
    <div className="container-narrow py-10">
      <Breadcrumb
        items={[
          { label: "Calculadoras", href: "/calculadoras" },
          { label: calc.titulo }
        ]}
      />

      <article className="card mb-6">
        <div className="flex items-start gap-3 mb-3">
          <Calculator className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              {calc.titulo}
            </h1>
            {area && (
              <p className="text-sm text-brand-ink/55 mt-1">
                <span className="chip text-xs">{area.name}</span>
              </p>
            )}
            <p className="text-base text-brand-ink/85 mt-3 leading-relaxed">
              {calc.resumo}
            </p>
          </div>
        </div>

        <section className="mt-6 p-4 rounded-xl bg-brand-deep/5 border border-brand-deep/20">
          <h2 className="font-display text-lg font-bold text-brand-ink mb-2 inline-flex items-center gap-2">
            <Scale className="w-5 h-5 text-brand-deep" aria-hidden />
            Fórmula
          </h2>
          <p className="text-sm md:text-base text-brand-ink/85 leading-relaxed">
            {calc.formula}
          </p>
        </section>

        <section className="mt-6">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-deep" aria-hidden />
            O que ter em mãos
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
      </article>

      <section className="card mb-6">
        <h2 className="font-display text-lg font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
          <MapPin className="w-5 h-5 text-brand-deep" aria-hidden />
          {calc.titulo} nas principais cidades
        </h2>
        <div className="flex flex-wrap gap-2">
          {cidadesPrior.map((c) => (
            <Link
              key={`${c.uf}-${c.slug}`}
              href={`/calculadoras/${calc.slug}/em/${c.slug}-${c.uf.toLowerCase()}`}
              className="chip text-brand-ink hover:bg-brand-deep hover:text-white hover:border-brand-deep transition text-xs"
            >
              {c.nome_completo}
            </Link>
          ))}
        </div>
      </section>

      {outras.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-lg font-bold text-brand-ink mb-3">
            Outras calculadoras
          </h2>
          <ul className="space-y-2">
            {outras.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/calculadoras/${o.slug}`}
                  className="inline-flex items-center gap-1 text-sm text-brand-deep hover:underline"
                >
                  <ChevronRight className="w-3.5 h-3.5" aria-hidden />
                  {o.titulo}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Calculadoras", url: "/calculadoras" },
          { name: calc.titulo, url: `/calculadoras/${calc.slug}` }
        ])}
      />
    </div>
  );
}
