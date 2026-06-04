import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FileText,
  MapPin,
  Users,
  ListChecks,
  AlertCircle,
  Download,
  Clock,
  Scale
} from "lucide-react";
import {
  getAllTemplates,
  getTemplateBySlug
} from "@/lib/data/templates-docs";
import {
  getCidadesPrioritarias,
  cidadesPrioritariasMesmaRegiao
} from "@/lib/data/cidades-prioritarias";
import { findCity } from "@/lib/data/cities";
import { getLawyersForCity } from "@/lib/data/lawyers";
import { LawyerCard } from "@/components/LawyerCard";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";

/**
 * /modelos/[slug]/em/[cidade] — combinação modelo × cidade.
 *
 * 32 modelos × 5571 cidades IBGE = ~178 mil URLs cauda longa indexáveis.
 *
 * Estratégia híbrida:
 *  - SSG nas 50 cidades prioritárias × todos os modelos
 *  - ISR (dynamicParams = true) nas 5521 restantes
 *  - notFound() se "cidade-uf" não existir na base IBGE
 *
 * Conteúdo único por combinação:
 *  - H1 e meta contextualizam o modelo na cidade (cartório local, OAB seccional)
 *  - Reaproveita whenToUse, howToFill, notes do modelo base
 *  - Lista advogados que atuam na cidade pra revisão paga opcional
 *  - Disclaimer claro — modelo é geral, vale revisão de advogado local
 *  - Canonical próprio — não substitui /modelos/[slug] (geral)
 */

// force-dynamic: renderiza sob demanda SEM gravar em disco — impede o disco de
// reencher conforme o Google rastreia milhares de cidades. URL funciona normal.
export const dynamic = "force-dynamic";

const TEMPLATE_SLUGS = getAllTemplates().map((t) => t.slug);

export function generateStaticParams() {
  const cidades = getCidadesPrioritarias();
  const params: Array<{ slug: string; cidade: string }> = [];
  for (const t of TEMPLATE_SLUGS) {
    for (const c of cidades) {
      params.push({
        slug: t,
        cidade: `${c.slug}-${c.uf.toLowerCase()}`
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
  const tpl = getTemplateBySlug(params.slug);
  const cidadeInfo = parseCidadeParam(params.cidade);
  if (!tpl || !cidadeInfo) {
    return buildMetadata({
      title: "Página não encontrada",
      description: "Página não encontrada",
      noIndex: true
    });
  }
  const tituloLocal = `${tpl.title} — modelo grátis para usar em ${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}`;
  const descricaoLocal = `${tpl.description.slice(0, 100)}... Modelo pronto para preencher, com adaptações específicas para ${cidadeInfo.cidadeNome}/${cidadeInfo.uf} (cartórios, OAB seccional).`;
  return buildMetadata({
    title: tituloLocal,
    description: descricaoLocal.slice(0, 160),
    path: `/modelos/${tpl.slug}/em/${params.cidade}`
  });
}

export default async function ModeloPorCidadePage({
  params
}: {
  params: { slug: string; cidade: string };
}) {
  const tpl = getTemplateBySlug(params.slug);
  const cidadeInfo = parseCidadeParam(params.cidade);
  if (!tpl || !cidadeInfo) notFound();

  let lawyers: Awaited<ReturnType<typeof getLawyersForCity>> = [];
  try {
    lawyers = await getLawyersForCity(cidadeInfo.uf, cidadeInfo.citySlug);
  } catch {
    lawyers = [];
  }
  const lawyersTop = lawyers.slice(0, 4);

  const cidadeRegional = cidadesPrioritariasMesmaRegiao(
    cidadeInfo.uf,
    cidadeInfo.citySlug,
    6
  );

  const tituloLocal = `${tpl.title} em ${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}`;
  const ufLower = cidadeInfo.uf.toLowerCase();

  return (
    <div className="container-narrow py-10">
      <Breadcrumb
        items={[
          { label: "Modelos", href: "/modelos" },
          { label: tpl.title, href: `/modelos/${tpl.slug}` },
          { label: `${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}` }
        ]}
      />

      <article className="card mb-6">
        <div className="flex items-start gap-3 mb-2">
          <FileText
            className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1"
            aria-hidden
          />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              {tituloLocal}
            </h1>
            <p className="text-sm text-brand-ink/55 mt-1 inline-flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" aria-hidden />
                {cidadeInfo.cidadeNome} · {cidadeInfo.uf}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" aria-hidden />
                {tpl.fillingMinutes} min para preencher
              </span>
              <span className="chip text-xs">{tpl.category}</span>
            </p>
            <p className="text-base md:text-lg text-brand-ink/85 mt-3 leading-relaxed">
              {tpl.description}
            </p>
            <p className="text-sm text-brand-ink/70 mt-3 leading-relaxed">
              Modelo gratuito de uso geral, baseado na redação tradicional
              brasileira. Em <strong>{cidadeInfo.cidadeNome}/{cidadeInfo.uf}</strong>
              , o conteúdo se aplica normalmente. Variações locais costumam
              ficar por conta do cartório (reconhecimento de firma, registro),
              da OAB seccional e da repartição administrativa onde o
              documento será apresentado. Quando exigido reconhecimento de
              firma ou assinatura digital, qualquer cartório de notas da
              cidade resolve.
            </p>
          </div>
        </div>

        {/* Base legal */}
        <aside
          className="mt-6 rounded-xl bg-brand-bg/40 border border-brand-line p-4 text-sm leading-relaxed flex items-start gap-2"
          role="note"
        >
          <Scale className="w-4 h-4 mt-0.5 text-brand-deep flex-shrink-0" aria-hidden />
          <div>
            <p className="font-semibold text-brand-ink">Base legal</p>
            <p className="text-brand-ink/85 mt-1">{tpl.legalBase}</p>
          </div>
        </aside>

        {/* Quando usar */}
        {tpl.whenToUse.length > 0 && (
          <section className="mt-6">
            <h2 className="font-display text-xl font-bold text-brand-ink mb-3">
              Quando esse modelo serve em {cidadeInfo.cidadeNome}
            </h2>
            <ul className="space-y-2">
              {tpl.whenToUse.map((u, i) => (
                <li
                  key={i}
                  className="text-sm md:text-base text-brand-ink/85 leading-relaxed pl-4 border-l-2 border-brand-line"
                >
                  {u}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Como preencher */}
        {tpl.howToFill.length > 0 && (
          <section className="mt-6">
            <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-brand-deep" aria-hidden />
              Como preencher
            </h2>
            <ol className="space-y-2 list-decimal list-inside">
              {tpl.howToFill.map((h, i) => (
                <li
                  key={i}
                  className="text-sm md:text-base text-brand-ink/85 leading-relaxed"
                >
                  {h}
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Avisos */}
        {tpl.notes.length > 0 && (
          <aside
            className="mt-6 rounded-xl border-l-4 border-amber-400 bg-amber-50 p-4 text-sm text-amber-900 leading-relaxed"
            role="note"
          >
            <p className="font-semibold inline-flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" aria-hidden />
              Atenção
            </p>
            <ul className="mt-2 space-y-1.5 list-disc list-inside">
              {tpl.notes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </aside>
        )}

        {/* Link pro modelo completo */}
        <div className="mt-6 rounded-xl bg-brand-deep/5 border border-brand-deep/20 p-4 flex items-start gap-3">
          <Download className="w-5 h-5 text-brand-deep flex-shrink-0 mt-0.5" aria-hidden />
          <div className="flex-1">
            <p className="font-semibold text-brand-ink">Pegar o modelo completo</p>
            <p className="text-sm text-brand-ink/75 mt-1">
              O texto completo do modelo, com placeholders prontos pra
              preenchimento, está em{" "}
              <Link
                href={`/modelos/${tpl.slug}`}
                className="text-brand-deep underline font-medium"
              >
                /modelos/{tpl.slug}
              </Link>
              . Lá você copia, edita e baixa.
            </p>
          </div>
        </div>
      </article>

      {/* Advogados na cidade — pra revisão paga */}
      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-deep" aria-hidden />
          Advogados em {cidadeInfo.cidadeNome} para revisar o documento
        </h2>
        <p className="text-sm text-brand-ink/75 mb-4 leading-relaxed">
          Modelo gratuito serve pra maioria dos casos cotidianos. Em
          situações com valor envolvido, prazo apertado ou texto que precisa
          se ajustar à sua realidade específica, vale a revisão de um
          advogado local. Em {cidadeInfo.cidadeNome}, esses profissionais
          atendem:
        </p>
        {lawyersTop.length === 0 ? (
          <div className="rounded-xl bg-brand-bg/40 border border-brand-line p-4 text-sm text-brand-ink/80 leading-relaxed">
            <p>
              Ainda não temos advogados cadastrados em{" "}
              {cidadeInfo.cidadeNome}/{cidadeInfo.uf}. Veja{" "}
              <Link
                href={`/advogados/${ufLower}/${cidadeInfo.citySlug}`}
                className="text-brand-deep underline font-medium"
              >
                a página da cidade
              </Link>{" "}
              ou{" "}
              <Link href="/cadastro" className="text-brand-deep underline">
                cadastre-se como o primeiro
              </Link>
              .
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              {lawyersTop.map((lawyer) => (
                <LawyerCard key={lawyer.id} lawyer={lawyer} />
              ))}
            </div>
            <p className="mt-4 text-sm">
              <Link
                href={`/advogados/${ufLower}/${cidadeInfo.citySlug}`}
                className="text-brand-deep hover:underline font-medium"
              >
                Ver todos os advogados em {cidadeInfo.cidadeNome} →
              </Link>
            </p>
          </>
        )}
      </section>

      {/* Cidades vizinhas */}
      {cidadeRegional.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-lg font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-deep" aria-hidden />
            Mesmo modelo em cidades vizinhas
          </h2>
          <div className="flex flex-wrap gap-2">
            {cidadeRegional.map((c) => (
              <Link
                key={c.slug}
                href={`/modelos/${tpl.slug}/em/${c.slug}-${c.uf.toLowerCase()}`}
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
          { name: "Modelos", url: "/modelos" },
          { name: tpl.title, url: `/modelos/${tpl.slug}` },
          {
            name: `${cidadeInfo.cidadeNome}, ${cidadeInfo.uf}`,
            url: `/modelos/${tpl.slug}/em/${params.cidade}`
          }
        ])}
      />
    </div>
  );
}
