import Link from "next/link";
import { Newspaper, MessageSquare, ChevronRight, Scale } from "lucide-react";
import { getRecentByTribunal } from "@/lib/data/jurisprudencia";
import type { DecisaoCard, Tribunal } from "@/lib/data/jurisprudencia";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { fitDescription } from "@/lib/seo/local-titles";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { formatDate } from "@/lib/utils/format";
import { SITE } from "@/lib/config";

/**
 * /noticias — aba de notícias de decisões (STF + STJ).
 *
 * Mostra as decisões mais recentes do acervo (importadas de fontes oficiais)
 * em formato de notícia e leva à página da decisão, que tem espaço de
 * comentários (moderados). Movimento novo no site sem duplicar conteúdo:
 * a notícia é a porta; o texto vive na página canônica da decisão.
 */

// Sempre ao vivo: o acervo cresce por importação; o microcache do nginx
// (5 min) segura o custo por requisição.
export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Notícias de decisões — STF e STJ para acompanhar e comentar",
  description:
    "As decisões mais recentes do STF e do STJ, resumidas em linguagem clara e abertas a comentários. Fonte oficial citada em cada julgado.",
  path: "/noticias"
});

function dataDe(c: DecisaoCard): string {
  return c.data_publicacao || c.data_julgamento || "";
}

function tituloDe(c: DecisaoCard): string {
  if (c.seo_title) return c.seo_title;
  const cabeca = `${c.classe ?? ""} ${c.numero}`.trim();
  const tema = c.resumo_tema || c.temas?.[0];
  return [cabeca, tema].filter(Boolean).join(" — ");
}

function resumoDe(c: DecisaoCard): string {
  return fitDescription(
    c.resumo_decisao ||
      c.resumo_entendimento ||
      c.seo_description ||
      c.ementa ||
      "",
    220
  );
}

async function getNoticias(): Promise<DecisaoCard[]> {
  const [stf, stj] = await Promise.all([
    getRecentByTribunal("STF" as Tribunal, 15).catch(() => [] as DecisaoCard[]),
    getRecentByTribunal("STJ" as Tribunal, 15).catch(() => [] as DecisaoCard[])
  ]);
  return [...stf, ...stj]
    .sort((a, b) => (dataDe(a) < dataDe(b) ? 1 : -1))
    .slice(0, 24);
}

export default async function NoticiasPage() {
  const noticias = await getNoticias();

  return (
    <div className="container-narrow py-10">
      <Breadcrumb items={[{ label: "Início", href: "/" }, { label: "Notícias de decisões" }]} />

      <header className="mb-8">
        <span className="chip border-brand-accent/40 bg-brand-accent/10 text-brand-ink mb-3 inline-flex items-center gap-1.5">
          <Newspaper className="w-3.5 h-3.5" aria-hidden /> Notícias
        </span>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
          Notícias de decisões dos tribunais
        </h1>
        <p className="text-brand-ink/70 mt-3 max-w-2xl">
          As decisões mais recentes do STF e do STJ no acervo do AdvAqui, com a
          fonte oficial citada em cada julgado. Abra qualquer uma para ler o
          resumo em linguagem clara e deixar seu comentário.
        </p>
      </header>

      {noticias.length === 0 ? (
        <div className="card text-center py-12">
          <Scale className="w-8 h-8 text-brand-ink/30 mx-auto mb-3" aria-hidden />
          <p className="text-brand-ink/60">
            As próximas decisões importadas aparecem aqui. Enquanto isso, veja a{" "}
            <Link href="/jurisprudencia" className="text-brand-deep underline">
              busca de jurisprudência
            </Link>
            .
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {noticias.map((n) => {
            const href = `/jurisprudencia/${n.tribunal.toLowerCase()}/${n.slug}`;
            const dataFmt = dataDe(n) ? formatDate(dataDe(n)) : null;
            return (
              <li key={`${n.tribunal}-${n.slug}`}>
                <article className="card hover:border-brand-accent transition">
                  <div className="flex items-center gap-2.5 text-xs mb-2">
                    <span
                      className="inline-flex items-center gap-1 font-bold px-2 py-1 rounded-md"
                      style={{ background: "#0F1B2D", color: "#E9C87D" }}
                    >
                      <Scale className="w-3 h-3" aria-hidden /> {n.tribunal}
                    </span>
                    {dataFmt && <span className="text-brand-ink/50">{dataFmt}</span>}
                    {n.area_relacionada && (
                      <span className="text-brand-ink/50">· {n.area_relacionada}</span>
                    )}
                  </div>
                  <h2 className="font-display text-lg md:text-xl font-semibold text-brand-ink leading-snug">
                    <Link href={href} className="hover:underline underline-offset-2">
                      {tituloDe(n)}
                    </Link>
                  </h2>
                  {resumoDe(n) && (
                    <p className="text-sm text-brand-ink/75 leading-relaxed mt-2">
                      {resumoDe(n)}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                    <Link
                      href={href}
                      className="inline-flex items-center gap-1 font-semibold text-brand-deep hover:underline"
                    >
                      Ler a decisão <ChevronRight className="w-4 h-4" aria-hidden />
                    </Link>
                    <Link
                      href={`${href}#comentarios`}
                      className="inline-flex items-center gap-1.5 text-brand-ink/60 hover:text-brand-ink"
                    >
                      <MessageSquare className="w-4 h-4" aria-hidden /> Comentar
                    </Link>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}

      <p className="text-xs text-brand-ink/50 mt-8">
        Conteúdo informativo extraído de fontes oficiais dos tribunais. Não
        substitui a leitura do inteiro teor nem orientação de um advogado.
      </p>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Notícias de decisões", url: "/noticias" }
        ])}
      />
      {noticias.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Notícias de decisões — STF e STJ",
            numberOfItems: noticias.length,
            itemListElement: noticias.map((n, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: tituloDe(n),
              url: `${SITE.url}/jurisprudencia/${n.tribunal.toLowerCase()}/${n.slug}`
            }))
          }}
        />
      )}
    </div>
  );
}
