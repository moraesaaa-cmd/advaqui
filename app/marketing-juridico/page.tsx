import Link from "next/link";
import {
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles,
  Target,
  Download
} from "lucide-react";
import { getAllMarketingArticles } from "@/lib/data/marketing-articles";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "Marketing jurídico para advogados",
  description:
    "Guias práticos sobre presença digital, SEO local, perfil profissional e captação de clientes — exclusivo para advogados que querem crescer em 2026.",
  path: "/marketing-juridico"
});

export default function MarketingJuridicoPage() {
  const articles = getAllMarketingArticles();

  return (
    <>
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-brand-ink via-brand-deep to-brand-primary text-white overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(245,158,11,0.55) 0%, transparent 45%), radial-gradient(circle at 80% 70%, rgba(251,191,36,0.4) 0%, transparent 45%)"
          }}
        />
        <div className="relative container-tight py-14 md:py-20">
          <div className="max-w-3xl">
            <Breadcrumb items={[{ label: "Marketing jurídico" }]} />
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-accent text-brand-ink mb-4">
              <Target className="w-3.5 h-3.5" aria-hidden />
              Para advogados
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight text-balance">
              Marketing jurídico para advogados
            </h1>
            <p className="text-lg md:text-xl text-brand-bg/85 mt-5 leading-relaxed">
              Guias práticos sobre presença digital, SEO local, perfil profissional, bio
              e captação de clientes — tudo dentro do que a OAB permite, com ROI real.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4 text-sm text-brand-bg/80">
              <span className="inline-flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-accent" aria-hidden />
                Guias completos
              </span>
              <span className="inline-flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-accent" aria-hidden />
                Foco em conversão real
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="container-tight py-12">
        {/* Card isca — checklist gratuito */}
        <section className="rounded-3xl bg-gradient-to-br from-brand-accent2/15 via-white to-brand-accent/10 border-2 border-brand-accent p-6 md:p-8 mb-12 relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-px left-6 right-6 h-1 bg-gradient-to-r from-brand-accent2 via-brand-accent to-brand-accent2 rounded-b"
          />
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-accent text-brand-ink mb-3 uppercase tracking-wide">
                <Sparkles className="w-3 h-3" aria-hidden />
                Material gratuito
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-ink leading-tight">
                Checklist: Como melhorar sua presença digital jurídica
              </h2>
              <p className="text-brand-ink/75 mt-3 leading-relaxed text-sm md:text-base">
                21 itens práticos pra você implementar em uma manhã. Cobre Google
                Business Profile, perfil em diretórios, WhatsApp, bio e primeiros passos
                de conteúdo. Cadastro grátis libera download em .txt.
              </p>
            </div>
            <div className="text-center md:text-right">
              <Link
                href="/checklist"
                className="btn-accent inline-flex items-center justify-center gap-2 w-full md:w-auto"
              >
                <Download className="w-4 h-4" aria-hidden />
                Baixar checklist grátis
              </Link>
              <p className="text-xs text-brand-ink/55 mt-2">Sem cartão, sem cobrança.</p>
            </div>
          </div>
        </section>

        {/* Artigos */}
        <section>
          <div className="flex items-end justify-between gap-4 mb-6 pb-3 border-b border-brand-line">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
                Guias completos
              </h2>
              <p className="text-brand-ink/65 mt-1 text-sm md:text-base">
                Material profundo sobre cada etapa do marketing jurídico moderno.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {articles.map((article, idx) => (
              <article
                key={article.slug}
                className="rounded-2xl border-2 border-brand-line bg-white p-6 hover:border-brand-accent transition shadow-card hover:shadow-cardHover group"
              >
                <div className="flex items-center gap-2 mb-3 text-xs text-brand-ink/55">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-brand-accent/15 text-brand-deep font-bold">
                    {idx + 1}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" aria-hidden /> {article.readingMinutes} min
                  </span>
                </div>
                <h3 className="font-display text-xl md:text-2xl font-bold text-brand-ink leading-snug">
                  <Link
                    href={`/marketing-juridico/${article.slug}`}
                    className="hover:text-brand-deep transition"
                  >
                    {article.title}
                  </Link>
                </h3>
                <p className="text-sm md:text-base text-brand-ink/70 mt-3 leading-relaxed">
                  {article.excerpt}
                </p>
                {article.keyTakeaways.length > 0 && (
                  <ul className="mt-4 space-y-1.5 text-sm text-brand-ink/85">
                    {article.keyTakeaways.slice(0, 3).map((k, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-brand-accent2 mt-0.5">▸</span>
                        <span>{k}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <Link
                  href={`/marketing-juridico/${article.slug}`}
                  className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-deep group-hover:text-brand-accent2"
                >
                  Ler guia completo
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" aria-hidden />
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* CTA premium AdvAqui */}
        <section className="mt-14 rounded-3xl bg-gradient-to-br from-brand-deep to-brand-ink text-white p-8 md:p-10 relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -bottom-1/4 -left-1/4 w-1/2 aspect-square rounded-full bg-brand-accent/20 blur-3xl"
          />
          <div className="relative grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-accent text-brand-ink mb-3">
                <TrendingUp className="w-3.5 h-3.5" aria-hidden />
                AdvAqui premium
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight">
                Aplique tudo isso em prática hoje
              </h2>
              <p className="text-brand-bg/85 mt-3 text-sm md:text-base leading-relaxed">
                Cadastro grátis + plano premium R$ 59,90/mês = perfil otimizado, WhatsApp
                clicável, selo de OAB verificada, posição no topo da cidade. Você aplica
                o conteúdo desses guias no AdvAqui sem precisar montar tudo do zero.
              </p>
            </div>
            <div className="space-y-2">
              <Link
                href="/cadastro"
                className="btn-accent inline-flex items-center justify-center gap-2 w-full"
              >
                Cadastrar grátis
              </Link>
              <Link
                href="/planos"
                className="btn-ghost text-white border border-white/20 hover:bg-white/10 inline-flex items-center justify-center gap-2 w-full"
              >
                Ver plano premium
              </Link>
            </div>
          </div>
        </section>
      </div>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Brasil", url: "/" },
          { name: "Marketing jurídico", url: "/marketing-juridico" }
        ])}
      />
    </>
  );
}
