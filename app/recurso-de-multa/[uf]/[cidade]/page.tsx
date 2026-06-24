import Link from "next/link";
import { notFound } from "next/navigation";
import { Car, Clock, ShieldCheck, HelpCircle, ListChecks, MapPin, Scale } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { RecursoMultaWidget } from "@/components/RecursoMultaWidget";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { findCity, findCapital, nearbyCities } from "@/lib/data/cities";
import { findState } from "@/lib/data/states";
import { conteudoRecurso } from "@/lib/data/transito";
import { SITE } from "@/lib/config";

/**
 * /recurso-de-multa/[uf]/[cidade] — landing local do recurso de multa.
 *
 * Uma URL indexável por município (5.571 cidades), com conteúdo único: órgão
 * de trânsito estadual correto, fases, prazos, FAQ e teses, variados pela
 * semente do IBGE. Renderização sob demanda (force-dynamic) como o diretório
 * de advogados — não infla o build nem grava em disco, e todas respondem 200.
 * O gerador gratuito (<RecursoMultaWidget>) vem embutido para converter.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: {
  params: { uf: string; cidade: string };
}) {
  const st = findState(params.uf);
  const city = findCity(params.uf, params.cidade);
  if (!st || !city) {
    return buildMetadata({
      title: "Recurso de multa",
      description: "Cidade não encontrada.",
      noIndex: true
    });
  }
  return buildMetadata({
    title: `Recurso de multa de trânsito em ${city.name}, ${st.uf} — modelo grátis`,
    description:
      `Foi multado em ${city.name}/${st.uf}? Gere grátis o recurso da sua multa com a fundamentação do ` +
      `Código de Trânsito Brasileiro. Veja as fases, os prazos e onde protocolar. Sem cadastro.`,
    path: `/recurso-de-multa/${st.uf.toLowerCase()}/${city.slug}`
  });
}

export default function RecursoMultaCidadePage({
  params
}: {
  params: { uf: string; cidade: string };
}) {
  const st = findState(params.uf);
  const city = findCity(params.uf, params.cidade);
  if (!st || !city) notFound();

  const ufLower = st.uf.toLowerCase();
  const c = conteudoRecurso(city);
  const capital = findCapital(st.uf);
  const neighbors = nearbyCities(city, 8);
  const path = `/recurso-de-multa/${ufLower}/${city.slug}`;

  return (
    <div className="container-narrow py-10">
      <Breadcrumb
        items={[
          { label: "Recurso de multa", href: "/recurso-de-multa" },
          { label: `${st.name}`, href: `/advogados/${ufLower}` },
          { label: city.name }
        ]}
      />

      <header className="card mb-6">
        <div className="flex items-start gap-3">
          <Car className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              Recurso de multa de trânsito em {city.name}, {st.uf}
            </h1>
            <p className="text-sm text-brand-ink/60 mt-2 inline-flex items-center gap-1.5">
              <MapPin className="w-4 h-4" aria-hidden />
              {st.name} · Região {city.region}
              {city.isCapital ? " · Capital" : ""}
            </p>
            <p className="text-base text-brand-ink/85 mt-3 leading-relaxed">{c.intro}</p>
          </div>
        </div>
      </header>

      {/* Gerador interativo (gratuito) */}
      <RecursoMultaWidget />

      {/* Por que recorrer */}
      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
          <Scale className="w-5 h-5 text-brand-deep" aria-hidden />
          Vale conferir antes de pagar
        </h2>
        <p className="text-sm md:text-base text-brand-ink/85 leading-relaxed">{c.porque}</p>
        <ul className="mt-4 grid sm:grid-cols-2 gap-2">
          {c.teses.slice(0, 4).map((t) => (
            <li key={t} className="flex items-start gap-2 text-sm text-brand-ink/80">
              <ShieldCheck className="w-4 h-4 mt-0.5 text-brand-deep flex-shrink-0" aria-hidden />
              {t}
            </li>
          ))}
        </ul>
      </section>

      {/* Como funciona em <cidade> */}
      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
          <ListChecks className="w-5 h-5 text-brand-deep" aria-hidden />
          As três fases do recurso em {city.name}
        </h2>
        <div className="space-y-3">
          {c.fases.map((e) => (
            <div key={e.titulo} className="pl-4 border-l-2 border-brand-line">
              <h3 className="font-semibold text-brand-ink">{e.titulo}</h3>
              <p className="text-sm text-brand-ink/80 mt-1 leading-relaxed">{e.texto}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-brand-ink/60 mt-4 leading-relaxed">
          Órgão estadual de trânsito de {st.name}: {c.detran.nome} ({c.detran.sigla}). Multas
          municipais são contestadas no órgão de trânsito do município.
        </p>
      </section>

      {/* Prazo */}
      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
          <Clock className="w-5 h-5 text-brand-deep" aria-hidden />
          O prazo é o que mais derruba recurso
        </h2>
        <p className="text-sm md:text-base text-brand-ink/85 leading-relaxed">
          A maioria dos recursos é perdida não pelo mérito, mas pelo prazo. Assim que receber a
          notificação em {city.name}, anote a data-limite indicada nela (em regra, ao menos 30
          dias) e junte cópia da notificação, do documento do veículo (CRLV) e da CNH. Precisa de
          um profissional?{" "}
          <Link href={`/advogados/${ufLower}/${city.slug}`} className="text-brand-deep font-medium hover:underline">
            Veja advogados em {city.name}
          </Link>{" "}
          ou use as{" "}
          <Link href="/calculadoras" className="text-brand-deep font-medium hover:underline">
            calculadoras
          </Link>
          .
        </p>
      </section>

      {/* FAQ local */}
      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-4 inline-flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-brand-deep" aria-hidden />
          Perguntas frequentes — multa em {city.name}
        </h2>
        <div className="space-y-4">
          {c.faq.map((f) => (
            <div key={f.q} className="pl-4 border-l-2 border-brand-line">
              <h3 className="font-semibold text-brand-ink">{f.q}</h3>
              <p className="text-sm text-brand-ink/80 mt-1 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Links internos: cidades próximas + capital */}
      {neighbors.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-lg font-bold text-brand-ink mb-3">
            Recurso de multa em outras cidades de {st.uf}
          </h2>
          <div className="flex flex-wrap gap-2">
            {capital && capital.slug !== city.slug && (
              <Link
                href={`/recurso-de-multa/${ufLower}/${capital.slug}`}
                className="text-sm px-3 py-1.5 rounded-full border border-brand-line hover:border-brand-deep hover:text-brand-deep transition"
              >
                {capital.name}
              </Link>
            )}
            {neighbors.map((n) => (
              <Link
                key={n.slug}
                href={`/recurso-de-multa/${ufLower}/${n.slug}`}
                className="text-sm px-3 py-1.5 rounded-full border border-brand-line hover:border-brand-deep hover:text-brand-deep transition"
              >
                {n.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <aside
        role="note"
        className="rounded-xl border-l-4 border-amber-400 bg-amber-50 p-4 text-xs md:text-sm text-amber-900 leading-relaxed flex items-start gap-2 mb-6"
      >
        <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden />
        <span>
          Ferramenta informativa e gratuita. O AdvAqui não é escritório de advocacia. O modelo
          gerado é um ponto de partida para você revisar e adaptar; não substitui a orientação de
          um advogado nem garante o deferimento. Use somente argumentos verdadeiros no seu caso.
        </span>
      </aside>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Recurso de multa", url: "/recurso-de-multa" },
          { name: city.name, url: path }
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: c.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a }
          }))
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: `Recurso de multa de trânsito em ${city.name}`,
          serviceType: "Recurso administrativo de trânsito",
          areaServed: {
            "@type": "City",
            name: city.name,
            addressRegion: st.uf,
            addressCountry: "BR"
          },
          provider: { "@type": "Organization", name: SITE.name, url: SITE.url },
          url: `${SITE.url}${path}`,
          description: `Gere grátis o recurso da sua multa de trânsito em ${city.name}, ${st.uf}, com a fundamentação do Código de Trânsito Brasileiro.`
        }}
      />
    </div>
  );
}
