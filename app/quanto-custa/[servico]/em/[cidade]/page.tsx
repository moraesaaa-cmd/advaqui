import Link from "next/link";
import { notFound } from "next/navigation";
import {
  DollarSign,
  MapPin,
  Users,
  ListChecks,
  AlertCircle,
  Clock,
  Scale,
  Check,
  X
} from "lucide-react";
import {
  CUSTOS,
  findCusto,
  relatedCustos,
  formatFaixa
} from "@/lib/data/custos-juridicos";
import {
  getCidadesPrioritarias,
  cidadesPrioritariasMesmaRegiao
} from "@/lib/data/cidades-prioritarias";
import { findCity } from "@/lib/data/cities";
import { findSpecialty } from "@/lib/data/specialties";
import { getLawyersForCity } from "@/lib/data/lawyers";
import { LawyerCard } from "@/components/LawyerCard";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";

/**
 * /quanto-custa/[servico]/em/[cidade] — combinação custo × cidade.
 *
 * 15 serviços × 5571 cidades IBGE = 83.565 URLs cauda longa indexáveis.
 *
 * Estratégia híbrida:
 *  - SSG nas 50 cidades prioritárias × 15 serviços (750 pré-geradas)
 *  - ISR (dynamicParams = true) nas 5521 restantes
 *  - notFound() se "cidade-uf" não existir na base IBGE
 *
 * Conteúdo único por combinação:
 *  - H1 e meta no formato de busca ("Quanto custa um divórcio em São Paulo")
 *  - Faixa de honorário (nacional, com disclaimer)
 *  - O que inclui e o que NÃO inclui (custas)
 *  - Quando o serviço pode ser gratuito (defensoria, justiça gratuita, juizado)
 *  - Lista de advogados da área que atuam na cidade
 *  - Disclaimer claro — valor não é tabelado, varia por caso
 *  - Canonical próprio
 */

// force-dynamic: renderiza sob demanda SEM gravar em disco — impede o disco de
// reencher conforme o Google rastreia milhares de cidades. URL funciona normal.
export const dynamic = "force-dynamic";

const CUSTO_SLUGS = CUSTOS.map((c) => c.slug);

export function generateStaticParams() {
  const cidades = getCidadesPrioritarias();
  const params: Array<{ servico: string; cidade: string }> = [];
  for (const c of CUSTO_SLUGS) {
    for (const cid of cidades) {
      params.push({
        servico: c,
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
  params: { servico: string; cidade: string };
}) {
  const custo = findCusto(params.servico);
  const cidadeInfo = parseCidadeParam(params.cidade);
  if (!custo || !cidadeInfo) {
    return buildMetadata({
      title: "Página não encontrada",
      description: "Página não encontrada",
      noIndex: true
    });
  }
  const tituloLocal = `${custo.titulo} em ${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}`;
  const faixa = formatFaixa(custo.faixa_min, custo.faixa_max);
  const descricaoLocal = `Honorário típico em ${cidadeInfo.cidadeNome}/${cidadeInfo.uf} — ${faixa}. Veja o que está incluído, opções gratuitas (defensoria, juizado) e prazos esperados.`;
  return buildMetadata({
    title: tituloLocal,
    description: descricaoLocal.slice(0, 160),
    path: `/quanto-custa/${custo.slug}/em/${params.cidade}`,
    canonical: `/quanto-custa/${custo.slug}`
  });
}

export default async function CustoPorCidadePage({
  params
}: {
  params: { servico: string; cidade: string };
}) {
  const custo = findCusto(params.servico);
  const cidadeInfo = parseCidadeParam(params.cidade);
  if (!custo || !cidadeInfo) notFound();

  const area = findSpecialty(custo.area_slug);

  let lawyers: Awaited<ReturnType<typeof getLawyersForCity>> = [];
  try {
    lawyers = await getLawyersForCity(cidadeInfo.uf, cidadeInfo.citySlug);
  } catch {
    lawyers = [];
  }

  const lawyersDaArea = lawyers.filter((l) =>
    (l.specialties || []).some(
      (s) =>
        s.toLowerCase() === custo.area_slug.toLowerCase() ||
        (area && s.toLowerCase() === area.name.toLowerCase())
    )
  );
  const lawyersExibir = lawyersDaArea.length > 0 ? lawyersDaArea : lawyers;
  const lawyersExibirTop = lawyersExibir.slice(0, 4);

  const cidadeRegional = cidadesPrioritariasMesmaRegiao(
    cidadeInfo.uf,
    cidadeInfo.citySlug,
    6
  );

  const outrosCustos = relatedCustos(custo.slug, 4);

  const tituloLocal = `${custo.titulo} em ${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}`;
  const faixa = formatFaixa(custo.faixa_min, custo.faixa_max);
  const ufLower = cidadeInfo.uf.toLowerCase();

  const tipoCobrancaLabel = {
    honorario_fixo: "Honorário fixo (valor combinado antes)",
    percentual_causa: "Percentual sobre o que recuperar (success fee)",
    misto: "Misto — parte fixa + percentual sobre o resultado"
  }[custo.tipo_cobranca];

  return (
    <div className="container-narrow py-10">
      <Breadcrumb
        items={[
          { label: "Quanto custa", href: "/quanto-custa" },
          { label: custo.titulo, href: `/quanto-custa/${custo.slug}` },
          { label: `${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}` }
        ]}
      />

      <article className="card mb-6">
        <div className="flex items-start gap-3 mb-2">
          <DollarSign
            className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1"
            aria-hidden
          />
          <div className="flex-1">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              {tituloLocal}
            </h1>
            <p className="text-sm text-brand-ink/55 mt-1 inline-flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" aria-hidden />
                {cidadeInfo.cidadeNome} · {cidadeInfo.uf}
              </span>
              {area && <span className="chip text-xs">{area.name}</span>}
            </p>

            <div className="mt-4 p-5 rounded-2xl bg-brand-deep/5 border-2 border-brand-deep/20">
              <p className="text-xs uppercase tracking-wider text-brand-deep font-semibold">
                Faixa de honorário em {cidadeInfo.cidadeNome}
              </p>
              <p className="font-display text-3xl md:text-4xl font-extrabold text-brand-ink mt-1">
                {faixa}
              </p>
              <p className="text-sm text-brand-ink/70 mt-2">
                {tipoCobrancaLabel}
              </p>
              <p className="text-xs text-brand-ink/55 italic mt-3">
                Valores são FAIXAS REFERENCIAIS observadas no mercado
                brasileiro. Honorário NÃO é tabelado — cada advogado
                define o seu livremente, sujeito ao Código de Ética da OAB.
                Em {cidadeInfo.cidadeNome}, costumam variar conforme
                complexidade do caso, valor envolvido e quem é o
                profissional.
              </p>
            </div>
          </div>
        </div>

        {/* O que inclui */}
        {custo.inclui.length > 0 && (
          <section className="mt-6">
            <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600" aria-hidden />
              O que está incluso no valor
            </h2>
            <ul className="space-y-2">
              {custo.inclui.map((i, idx) => (
                <li
                  key={idx}
                  className="text-sm md:text-base text-brand-ink/85 leading-relaxed flex items-start gap-2"
                >
                  <Check className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" aria-hidden />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* O que NÃO inclui */}
        {custo.exclui.length > 0 && (
          <section className="mt-6">
            <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
              <X className="w-5 h-5 text-rose-600" aria-hidden />
              O que NÃO está incluso (cliente paga separado)
            </h2>
            <ul className="space-y-2">
              {custo.exclui.map((e, idx) => (
                <li
                  key={idx}
                  className="text-sm md:text-base text-brand-ink/85 leading-relaxed flex items-start gap-2"
                >
                  <X className="w-4 h-4 text-rose-500 mt-1 flex-shrink-0" aria-hidden />
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Quando é gratuito */}
        {custo.quando_gratis.length > 0 && (
          <section className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <h2 className="font-display text-xl font-bold text-emerald-900 mb-3 inline-flex items-center gap-2">
              <Check className="w-5 h-5" aria-hidden />
              Quando o serviço pode ser gratuito em {cidadeInfo.cidadeNome}
            </h2>
            <ul className="space-y-2">
              {custo.quando_gratis.map((g, idx) => (
                <li
                  key={idx}
                  className="text-sm md:text-base text-emerald-900/90 leading-relaxed pl-4 border-l-2 border-emerald-300"
                >
                  {g}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Tempo estimado */}
        <aside className="mt-6 rounded-xl border-l-4 border-amber-400 bg-amber-50 p-4 text-sm leading-relaxed flex items-start gap-2">
          <Clock className="w-4 h-4 mt-0.5 text-amber-700 flex-shrink-0" aria-hidden />
          <div>
            <p className="font-semibold text-amber-900">Tempo estimado</p>
            <p className="text-amber-900/85 mt-1">{custo.tempo_estimado}</p>
            <p className="text-xs text-amber-900/70 italic mt-2">
              Em {cidadeInfo.cidadeNome}/{cidadeInfo.uf}, prazos podem variar
              conforme a vara competente, volume da comarca e fatores
              específicos do caso.
            </p>
          </div>
        </aside>

        {/* Observações */}
        {custo.observacoes && custo.observacoes.length > 0 && (
          <section className="mt-6">
            <h2 className="font-display text-lg font-bold text-brand-ink mb-2">
              Observações importantes
            </h2>
            <ul className="space-y-2">
              {custo.observacoes.map((o, idx) => (
                <li
                  key={idx}
                  className="text-sm text-brand-ink/80 leading-relaxed pl-4 border-l-2 border-brand-line"
                >
                  {o}
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>

      {/* Advogados da área em CIDADE */}
      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-deep" aria-hidden />
          Advogados em {cidadeInfo.cidadeNome} para esse serviço
        </h2>
        <p className="text-sm text-brand-ink/75 mb-4 leading-relaxed">
          O melhor jeito de saber o valor exato é fazer uma consulta inicial
          com 2 ou 3 advogados que atuem em {cidadeInfo.cidadeNome}/{cidadeInfo.uf}
          {area && ` em ${area.name.toLowerCase()}`}. Muitos profissionais
          fazem a primeira reunião sem custo.
        </p>
        {lawyersExibirTop.length === 0 ? (
          <div className="rounded-xl bg-brand-bg/40 border border-brand-line p-4 text-sm text-brand-ink/80 leading-relaxed">
            <p>
              Ainda não temos advogados cadastrados em {cidadeInfo.cidadeNome}/
              {cidadeInfo.uf} para esta área. Veja{" "}
              <Link
                href={`/advogados/${ufLower}/${cidadeInfo.citySlug}`}
                className="text-brand-deep underline font-medium"
              >
                a página da cidade
              </Link>{" "}
              ou{" "}
              <Link href="/cadastro" className="text-brand-deep underline">
                cadastre-se
              </Link>
              .
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              {lawyersExibirTop.map((lawyer) => (
                <LawyerCard key={lawyer.id} lawyer={lawyer} />
              ))}
            </div>
            <p className="mt-4 text-sm">
              <Link
                href={`/advogados/${ufLower}/${cidadeInfo.citySlug}/${custo.area_slug}`}
                className="text-brand-deep hover:underline font-medium"
              >
                Ver todos os {area?.name?.toLowerCase() || "advogados"} em{" "}
                {cidadeInfo.cidadeNome} →
              </Link>
            </p>
          </>
        )}
      </section>

      {/* Outros custos da área */}
      {outrosCustos.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-lg font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
            <Scale className="w-5 h-5 text-brand-deep" aria-hidden />
            Outros honorários comuns da mesma área
          </h2>
          <ul className="space-y-2">
            {outrosCustos.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/quanto-custa/${c.slug}/em/${cidadeInfo.citySlug}-${ufLower}`}
                  className="inline-flex items-center gap-2 text-sm text-brand-deep hover:underline"
                >
                  <span>{c.titulo} em {cidadeInfo.cidadeNome}</span>
                  <span className="text-xs text-brand-ink/60 font-medium">
                    {formatFaixa(c.faixa_min, c.faixa_max)}
                  </span>
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
            Mesma faixa em cidades vizinhas
          </h2>
          <div className="flex flex-wrap gap-2">
            {cidadeRegional.map((c) => (
              <Link
                key={c.slug}
                href={`/quanto-custa/${custo.slug}/em/${c.slug}-${c.uf.toLowerCase()}`}
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
          { name: "Quanto custa", url: "/quanto-custa" },
          { name: custo.titulo, url: `/quanto-custa/${custo.slug}` },
          {
            name: `${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}`,
            url: `/quanto-custa/${custo.slug}/em/${params.cidade}`
          }
        ])}
      />
    </div>
  );
}
