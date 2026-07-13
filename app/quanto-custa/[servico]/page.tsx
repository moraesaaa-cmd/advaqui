import Link from "next/link";
import { notFound } from "next/navigation";
import {
  DollarSign,
  ChevronRight,
  ListChecks,
  AlertCircle,
  Clock,
  Scale,
  Check,
  X,
  MapPin
} from "lucide-react";
import {
  CUSTOS,
  findCusto,
  relatedCustos,
  formatFaixa
} from "@/lib/data/custos-juridicos";
import { findSpecialty } from "@/lib/data/specialties";
import { findGuiaByArea } from "@/lib/data/guias";
import { getCidadesPrioritarias } from "@/lib/data/cidades-prioritarias";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { CTAFinal } from "@/components/CTAFinal";
import { buildMetadata } from "@/lib/seo/metadata";
import { fitDescription } from "@/lib/seo/local-titles";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";

/**
 * /quanto-custa/[servico] — página-base (nacional) de cada serviço jurídico.
 *
 * Conteúdo canônico: faixa de honorário (com disclaimer), o que inclui e
 * exclui, quando pode ser gratuito, tempo estimado e links pras versões por
 * cidade. Páginas curtas e diretas. Estática sobre os ~23 serviços de CUSTOS.
 */
export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return CUSTOS.map((c) => ({ servico: c.slug }));
}

export async function generateMetadata({
  params
}: {
  params: { servico: string };
}) {
  const custo = findCusto(params.servico);
  if (!custo) {
    return buildMetadata({
      title: "Serviço não encontrado",
      description: "Página não encontrada.",
      noIndex: true
    });
  }
  const faixa = formatFaixa(custo.faixa_min, custo.faixa_max);
  return buildMetadata({
    title: custo.titulo,
    description: fitDescription(
      `${custo.titulo} — faixa típica ${faixa}. O que está incluído, opções gratuitas (defensoria, juizado) e prazos. Valor não é tabelado e varia por caso.`,
      158
    ),
    path: `/quanto-custa/${custo.slug}`
  });
}

export default function CustoBasePage({
  params
}: {
  params: { servico: string };
}) {
  const custo = findCusto(params.servico);
  if (!custo) notFound();

  const area = findSpecialty(custo.area_slug);
  const guia = findGuiaByArea(custo.area_slug);
  const outros = relatedCustos(custo.slug, 4);
  const cidades = getCidadesPrioritarias().slice(0, 12);
  const faixa = formatFaixa(custo.faixa_min, custo.faixa_max);
  const tipoLabel =
    custo.tipo_cobranca === "honorario_fixo"
      ? "Honorário fixo"
      : custo.tipo_cobranca === "percentual_causa"
        ? "Percentual sobre a causa"
        : "Misto (fixo + percentual)";

  return (
    <div className="container-narrow py-10">
      <Breadcrumb
        items={[
          { label: "Quanto custa", href: "/quanto-custa" },
          { label: custo.titulo }
        ]}
      />

      <article className="card mb-6">
        <div className="flex items-start gap-3 mb-3">
          <DollarSign className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              {custo.titulo}
            </h1>
            {area && (
              <p className="text-sm text-brand-ink/55 mt-1">
                <span className="chip text-xs">{area.name}</span>
              </p>
            )}
          </div>
        </div>

        {/* Faixa de honorário */}
        <section className="mt-2 p-5 rounded-2xl bg-brand-deep/5 border border-brand-deep/20">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-ink/55">
            Faixa típica de honorário
          </p>
          <p className="font-display text-3xl font-extrabold text-brand-ink mt-1">
            {faixa}
          </p>
          <p className="text-sm text-brand-ink/70 mt-2 inline-flex items-center gap-2">
            <Scale className="w-4 h-4 text-brand-deep" aria-hidden />
            {tipoLabel}
            <span aria-hidden>·</span>
            <Clock className="w-4 h-4 text-brand-deep" aria-hidden />
            {custo.tempo_estimado}
          </p>
        </section>

        {/* O que inclui / exclui */}
        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          <section className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
            <h2 className="font-display text-base font-bold text-emerald-900 mb-2 inline-flex items-center gap-2">
              <Check className="w-4 h-4" aria-hidden />
              Costuma incluir
            </h2>
            <ul className="space-y-1.5">
              {custo.inclui.map((i, idx) => (
                <li key={idx} className="text-sm text-emerald-950/90 leading-relaxed flex gap-2">
                  <Check className="w-3.5 h-3.5 mt-1 flex-shrink-0 text-emerald-600" aria-hidden />
                  {i}
                </li>
              ))}
            </ul>
          </section>
          <section className="rounded-xl border border-rose-200 bg-rose-50/40 p-4">
            <h2 className="font-display text-base font-bold text-rose-900 mb-2 inline-flex items-center gap-2">
              <X className="w-4 h-4" aria-hidden />
              Geralmente não inclui
            </h2>
            <ul className="space-y-1.5">
              {custo.exclui.map((i, idx) => (
                <li key={idx} className="text-sm text-rose-950/90 leading-relaxed flex gap-2">
                  <X className="w-3.5 h-3.5 mt-1 flex-shrink-0 text-rose-500" aria-hidden />
                  {i}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Quando é gratuito */}
        <section className="mt-6">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-2 inline-flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-brand-deep" aria-hidden />
            Quando pode ser gratuito
          </h2>
          <ul className="space-y-2">
            {custo.quando_gratis.map((q, idx) => (
              <li
                key={idx}
                className="text-sm md:text-base text-brand-ink/85 leading-relaxed pl-4 border-l-2 border-brand-line"
              >
                {q}
              </li>
            ))}
          </ul>
        </section>

        {custo.observacoes && custo.observacoes.length > 0 && (
          <aside
            role="note"
            className="mt-6 rounded-xl border-l-4 border-amber-400 bg-amber-50 p-4 text-sm text-amber-900 leading-relaxed flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden />
            <div className="space-y-1">
              {custo.observacoes.map((o, idx) => (
                <p key={idx}>{o}</p>
              ))}
            </div>
          </aside>
        )}

        <aside
          role="note"
          className="mt-4 rounded-xl bg-brand-bg/50 border border-brand-line p-4 text-xs md:text-sm text-brand-ink/75 leading-relaxed"
        >
          Os valores são uma referência de mercado, não uma tabela oficial. O
          honorário é livremente combinado entre cliente e advogado e varia
          conforme a complexidade do caso, a comarca e a experiência do
          profissional. Confirme sempre por escrito antes de contratar.
        </aside>
      </article>

      {/* Versões por cidade */}
      <section className="card mb-6">
        <h2 className="font-display text-lg font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
          <MapPin className="w-5 h-5 text-brand-deep" aria-hidden />
          {custo.titulo} na sua cidade
        </h2>
        <div className="flex flex-wrap gap-2">
          {cidades.map((c) => (
            <Link
              key={`${c.uf}-${c.slug}`}
              href={`/quanto-custa/${custo.slug}/em/${c.slug}-${c.uf.toLowerCase()}`}
              className="chip text-brand-ink hover:bg-brand-deep hover:text-white hover:border-brand-deep transition text-xs"
            >
              {c.nome_completo}
            </Link>
          ))}
        </div>
      </section>

      {/* Guia relacionado */}
      {guia && (
        <section className="card mb-6">
          <Link
            href={`/guias/${guia.slug}`}
            className="block group rounded-xl border border-brand-line p-4 hover:border-brand-deep/40 hover:shadow-card transition"
          >
            <div className="flex items-start gap-3">
              <Scale className="w-5 h-5 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
              <div className="flex-1">
                <p className="text-xs text-brand-ink/55 font-semibold uppercase tracking-wide">
                  Guia da área
                </p>
                <p className="text-sm md:text-base font-semibold text-brand-ink group-hover:text-brand-deep transition mt-0.5">
                  {guia.titulo}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-brand-ink/30 group-hover:text-brand-deep flex-shrink-0 mt-1" aria-hidden />
            </div>
          </Link>
        </section>
      )}

      {/* Outros custos */}
      {outros.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-lg font-bold text-brand-ink mb-3">
            Veja também
          </h2>
          <ul className="space-y-2">
            {outros.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/quanto-custa/${o.slug}`}
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

      <CTAFinal areaSlug={custo.area_slug} />

      <p className="text-sm text-brand-ink/65 mt-6">
        <Link href="/quanto-custa" className="text-brand-deep hover:underline">
          ← Ver todos os custos
        </Link>
      </p>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Quanto custa", url: "/quanto-custa" },
          { name: custo.titulo, url: `/quanto-custa/${custo.slug}` }
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: custo.titulo,
          serviceType: area?.name || "Serviço jurídico",
          areaServed: { "@type": "Country", name: "Brasil" },
          provider: { "@type": "Organization", name: SITE.name, url: SITE.url },
          description: `Faixa típica de honorário: ${faixa}. ${tipoLabel}. Prazo estimado: ${custo.tempo_estimado}.`,
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "BRL",
            lowPrice: custo.faixa_min,
            highPrice: custo.faixa_max
          }
        }}
      />
    </div>
  );
}
