import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertCircle, ArrowLeft, Calendar, Clock, MessageCircle } from "lucide-react";
import { findLawyerBySlug } from "@/lib/data/lawyers";
import { createAdminClient } from "@/lib/supabase/admin";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { whatsappLink, formatDate } from "@/lib/utils/format";
import { SITE } from "@/lib/config";
import { SPECIALTIES } from "@/lib/data/specialties";

/**
 * Página pública de um artigo escrito pelo advogado.
 *
 * URL: /advogado/[slug]/artigos/[artigoSlug]
 *
 * Visível só quando lawyer está publicado E artigo.status === 'published'.
 * Caso contrário, retorna 404.
 *
 * Defensive: se a tabela lawyer_articles não existir (migration pendente)
 * retorna 404 silenciosamente — não quebra o build.
 *
 * Maio/2026 — Fase 3 da Página Profissional AdvAqui.
 */

export const revalidate = 600; // 10 min
export const dynamicParams = true;

type ArticleRow = {
  id: string;
  lawyer_id: string;
  slug: string;
  title: string;
  summary: string | null;
  body: string;
  specialty_slug: string | null;
  status: string;
  published_at: string | null;
  word_count: number | null;
  read_time_minutes: number | null;
  created_at: string;
  updated_at: string;
};

async function fetchPublishedArticle(
  lawyerId: string,
  artigoSlug: string
): Promise<ArticleRow | null> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("lawyer_articles")
      .select("*")
      .eq("lawyer_id", lawyerId)
      .eq("slug", artigoSlug)
      .eq("status", "published")
      .maybeSingle();
    if (error) {
      // Tabela ainda não existe ou outra falha — trate como "não encontrado"
      console.warn("[artigo público] read failed", error.message);
      return null;
    }
    return (data as ArticleRow) || null;
  } catch (err) {
    console.warn("[artigo público] exception", err);
    return null;
  }
}

export async function generateMetadata({
  params
}: {
  params: { slug: string; artigoSlug: string };
}) {
  const l = await findLawyerBySlug(params.slug);
  if (!l) return buildMetadata({ title: "Artigo", description: "Não encontrado", noIndex: true });
  const a = await fetchPublishedArticle(l.id, params.artigoSlug);
  if (!a) return buildMetadata({ title: "Artigo", description: "Não encontrado", noIndex: true });

  return buildMetadata({
    title: a.title,
    description:
      a.summary || a.body.slice(0, 160).replace(/\s+\S*$/, "") + "...",
    path: `/advogado/${l.slug}/artigos/${a.slug}`
  });
}

export default async function ArtigoPage({
  params
}: {
  params: { slug: string; artigoSlug: string };
}) {
  const l = await findLawyerBySlug(params.slug);
  if (!l) notFound();

  // Página do advogado pausada → artigos também ficam invisíveis.
  const isPaused = l.pageStatus === "paused" || l.isPublic === false;
  if (isPaused) notFound();

  const a = await fetchPublishedArticle(l.id, params.artigoSlug);
  if (!a) notFound();

  const wa = whatsappLink(
    l.whatsapp || l.phone,
    `Olá ${l.name}, li seu artigo "${a.title}" no ${SITE.name} e gostaria de conversar.`
  );

  const specialtyName = a.specialty_slug
    ? SPECIALTIES.find((s) => s.slug === a.specialty_slug)?.name
    : null;

  const publishedDate = a.published_at || a.created_at;
  const articleUrl = `${SITE.url}/advogado/${l.slug}/artigos/${a.slug}`;

  return (
    <div className="container-narrow py-10">
      <Breadcrumb
        items={[
          { label: "Diretório", href: "/advogados" },
          { label: l.uf, href: `/advogados/${l.uf.toLowerCase()}` },
          { label: l.cityName, href: `/advogados/${l.uf.toLowerCase()}/${l.citySlug}` },
          { label: l.name, href: `/advogado/${l.slug}` },
          { label: a.title }
        ]}
      />

      <article className="card">
        <Link
          href={`/advogado/${l.slug}`}
          className="inline-flex items-center gap-1 text-sm text-brand-deep hover:text-brand-accent2 mb-4"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden />
          Voltar para a Página Profissional
        </Link>

        <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink leading-tight">
          {a.title}
        </h1>

        {/* Metadados do artigo */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-brand-ink/60">
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" aria-hidden />
            {formatDate(publishedDate)}
          </span>
          {a.read_time_minutes && (
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" aria-hidden />
              {a.read_time_minutes} min de leitura
            </span>
          )}
          {specialtyName && (
            <span className="px-2 py-0.5 rounded-full bg-brand-deep/10 text-brand-deep font-medium">
              {specialtyName}
            </span>
          )}
        </div>

        {/* Autor */}
        <p className="mt-3 text-sm text-brand-ink/75">
          Por{" "}
          <Link
            href={`/advogado/${l.slug}`}
            className="font-semibold text-brand-deep hover:text-brand-accent2"
          >
            {l.name}
          </Link>
          {l.oab && (
            <>
              {" "}
              <span className="text-brand-ink/55">— OAB/{l.oabUf} {l.oab}</span>
            </>
          )}
        </p>

        {/* Resumo */}
        {a.summary && (
          <p className="mt-5 text-base md:text-lg text-brand-ink/85 leading-relaxed font-medium border-l-4 border-brand-accent2 pl-4 italic">
            {a.summary}
          </p>
        )}

        {/* Corpo */}
        <div className="mt-6 prose prose-sm md:prose-base max-w-none text-brand-ink/85 whitespace-pre-line leading-relaxed">
          {a.body}
        </div>

        {/* Aviso ético automático (Provimento OAB 205/2021) */}
        <aside
          className="mt-8 rounded-xl border-l-4 border-amber-400 bg-amber-50 p-4 text-xs md:text-sm text-amber-900 leading-relaxed"
          role="note"
        >
          <p className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden />
            <span>
              Este conteúdo tem caráter exclusivamente informativo e não
              substitui consulta individual com profissional habilitado. Cada
              caso possui particularidades que devem ser analisadas
              individualmente.
            </span>
          </p>
        </aside>

        {/* CTA final */}
        {wa && (
          <section className="mt-8 pt-6 border-t border-brand-line text-center">
            <p className="text-sm md:text-base font-semibold text-brand-ink mb-3">
              Tem uma dúvida sobre o tema deste artigo?
            </p>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm md:text-base hover:bg-emerald-500 transition"
            >
              <MessageCircle className="w-5 h-5" aria-hidden />
              Falar pelo WhatsApp
            </a>
          </section>
        )}
      </article>

      {/* Schema Article */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: a.title,
          description: a.summary || a.body.slice(0, 160),
          datePublished: publishedDate,
          dateModified: a.updated_at,
          author: {
            "@type": "Person",
            name: l.name,
            url: `${SITE.url}/advogado/${l.slug}`
          },
          publisher: {
            "@type": "Organization",
            name: SITE.name,
            url: SITE.url
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": articleUrl
          }
        }}
      />
    </div>
  );
}
