import Link from "next/link";
import { BookOpen, ChevronRight, Search } from "lucide-react";
import { GLOSSARIO, glossarioByLetter } from "@/lib/data/glossario";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";

/**
 * Glossário jurídico — index alfabético com todos os termos.
 *
 * SSG com revalidação semanal. Página pilar para captação SEO de termos
 * jurídicos sem juridiquês.
 */
export const revalidate = 604800;

export const metadata = buildMetadata({
  title: "Glossário jurídico",
  description:
    "Glossário jurídico em linguagem clara. Definições de termos como dano moral, prescrição, usucapião, inventário, pensão alimentícia e mais.",
  path: "/glossario"
});

export default function GlossarioIndexPage() {
  const grupos = glossarioByLetter();
  const letras = Object.keys(grupos).sort();

  return (
    <div className="container-narrow py-10">
      <Breadcrumb items={[{ label: "Glossário" }]} />

      <header className="card mb-6">
        <div className="flex items-start gap-3 mb-2">
          <BookOpen
            className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1"
            aria-hidden
          />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              Glossário jurídico
            </h1>
            <p className="text-sm md:text-base text-brand-ink/85 mt-3 leading-relaxed">
              Termos jurídicos comuns explicados em linguagem clara, organizados
              alfabeticamente, com conexão a problemas jurídicos reais,
              jurisprudência e advogados na sua cidade.
            </p>
          </div>
        </div>
      </header>

      {/* Índice alfabético rápido */}
      <nav
        aria-label="Índice alfabético"
        className="card mb-6 flex flex-wrap gap-2"
      >
        {letras.map((l) => (
          <a
            key={l}
            href={`#letra-${l}`}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-brand-line text-brand-ink font-semibold text-sm hover:bg-brand-deep hover:text-white transition"
          >
            {l}
          </a>
        ))}
      </nav>

      {letras.map((letra) => (
        <section key={letra} id={`letra-${letra}`} className="card mb-6 scroll-mt-24">
          <h2 className="font-display text-2xl font-bold text-brand-deep mb-3">
            {letra}
          </h2>
          <ul className="space-y-3">
            {grupos[letra].map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/glossario/${t.slug}`}
                  className="block group rounded-xl border border-brand-line p-4 hover:border-brand-deep/40 hover:shadow-card transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-brand-ink group-hover:text-brand-deep transition">
                        {t.termo}
                      </h3>
                      <p className="text-sm text-brand-ink/70 mt-1 leading-relaxed">
                        {t.definicao_curta}
                      </p>
                    </div>
                    <ChevronRight
                      className="w-5 h-5 text-brand-ink/30 group-hover:text-brand-deep flex-shrink-0 mt-1"
                      aria-hidden
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <aside className="card bg-brand-bg/30">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-2 inline-flex items-center gap-2">
          <Search className="w-5 h-5 text-brand-deep" aria-hidden />
          Não encontrou um termo?
        </h2>
        <p className="text-sm text-brand-ink/80 leading-relaxed mb-3">
          O glossário cresce com o tempo. Se você procura definição de um termo
          específico, vale conferir em{" "}
          <Link href="/jurisprudencia" className="text-brand-deep underline">
            decisões reais do STJ
          </Link>{" "}
          ou em{" "}
          <Link href="/blog" className="text-brand-deep underline">
            artigos do blog
          </Link>
          .
        </p>
        <p className="text-sm text-brand-ink/80 leading-relaxed">
          E lembrando — definições aqui são informativas. Para o seu caso
          concreto, vale falar com um advogado.{" "}
          <Link href="/advogados" className="text-brand-deep underline font-medium">
            Encontre um advogado por cidade.
          </Link>
        </p>
      </aside>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Glossário", url: "/glossario" }
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Glossário jurídico — AdvAqui",
          description:
            "Glossário jurídico em linguagem clara, com definições de termos comuns do direito brasileiro.",
          url: `${SITE.url}/glossario`,
          inLanguage: "pt-BR",
          isPartOf: { "@type": "WebSite", url: SITE.url, name: SITE.name }
        }}
      />
    </div>
  );
}
