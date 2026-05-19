import Link from "next/link";
import { BookOpen, Clock, User } from "lucide-react";
import { getAllArticles } from "@/lib/data/articles";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";

// ISR. Blog seed estatico — qualquer mudança em ARTICLES exige rebuild,
// mas a página em si revalida a cada hora caso algum dia o conteudo venha
// de banco (futuro).
export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "Blog jurídico",
  description:
    "Conteúdo prático sobre seus direitos: rescisão, divórcio, pensão alimentícia, INSS, inventário, despejo, multa de trânsito e mais. Linguagem direta, base legal citada.",
  path: "/blog"
});

const CATEGORIES = [
  { label: "Trabalhista", color: "bg-amber-50 text-amber-800 border-amber-200" },
  { label: "Família", color: "bg-rose-50 text-rose-800 border-rose-200" },
  { label: "Previdenciário", color: "bg-sky-50 text-sky-800 border-sky-200" },
  { label: "Consumidor", color: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  { label: "Sucessões", color: "bg-purple-50 text-purple-800 border-purple-200" },
  { label: "Imobiliário", color: "bg-orange-50 text-orange-800 border-orange-200" },
  { label: "Trânsito", color: "bg-slate-50 text-slate-800 border-slate-200" }
];

const catBadge = (cat: string) =>
  CATEGORIES.find((c) => c.label === cat)?.color ||
  "bg-brand-line/40 text-brand-ink border-brand-line";

export default function BlogIndexPage() {
  const articles = getAllArticles();

  return (
    <div className="container-tight py-10">
      <Breadcrumb items={[{ label: "Blog" }]} />

      <header className="max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-accent/15 text-brand-deep border border-brand-accent/30 mb-4">
          <BookOpen className="w-3.5 h-3.5" aria-hidden />
          Conteúdo jurídico
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-ink leading-tight">
          Seus direitos explicados em linguagem simples
        </h1>
        <p className="text-lg text-brand-ink/70 mt-4 leading-relaxed">
          Guias práticos sobre as situações mais comuns — rescisão, divórcio, pensão,
          INSS, inventário, dívida indevida, despejo, multa de trânsito. Cada artigo
          cita a base legal e indica quando procurar advogado.
        </p>
      </header>

      <div className="mt-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <span
            key={c.label}
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${c.color}`}
          >
            {c.label}
          </span>
        ))}
      </div>

      <section className="mt-10 grid md:grid-cols-2 gap-6">
        {articles.map((article) => (
          <article
            key={article.slug}
            className="card flex flex-col group hover:border-brand-accent transition"
          >
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${catBadge(
                  article.category
                )}`}
              >
                {article.category}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-brand-ink/50">
                <Clock className="w-3 h-3" aria-hidden /> {article.readingMinutes} min
              </span>
            </div>
            <h2 className="font-display text-xl font-bold text-brand-ink leading-snug">
              <Link
                href={`/blog/${article.slug}`}
                className="hover:text-brand-deep transition"
              >
                {article.title}
              </Link>
            </h2>
            <p className="text-sm text-brand-ink/70 mt-2 leading-relaxed flex-1">
              {article.excerpt}
            </p>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-brand-line text-xs text-brand-ink/60">
              <span className="inline-flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" aria-hidden />
                {article.author}
              </span>
              <Link
                href={`/blog/${article.slug}`}
                className="font-semibold text-brand-deep group-hover:text-brand-accent2 transition"
              >
                Ler artigo →
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-12 rounded-2xl bg-brand-ink text-white p-6 md:p-8">
        <div className="grid md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            <h2 className="font-display text-2xl font-bold">
              É advogado? Publique no AdvAqui
            </h2>
            <p className="text-brand-bg/85 mt-3 text-sm leading-relaxed">
              Membros do plano premium podem publicar artigos no blog com assinatura
              completa e link para o próprio perfil. Conteúdo bem feito constrói
              autoridade na sua especialidade — e o Google entende isso.
            </p>
            <p className="text-brand-bg/65 mt-2 text-xs">
              Submissão de artigos via painel (em desenvolvimento, lançamento em breve).
              Por enquanto, envie para {SITE.email}.
            </p>
          </div>
          <div>
            <Link
              href="/planos"
              className="inline-flex w-full justify-center btn-accent text-base"
            >
              Ver plano premium
            </Link>
          </div>
        </div>
      </section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Brasil", url: "/" },
          { name: "Blog", url: "/blog" }
        ])}
      />
    </div>
  );
}
