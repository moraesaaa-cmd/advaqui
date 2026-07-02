import Link from "next/link";
import {
  BookOpen,
  Clock,
  User,
  HelpCircle,
  Compass,
  FileText,
  Wrench,
  Calculator,
  ListChecks,
  ArrowRight
} from "lucide-react";
import { getAllArticles, getArticlesFromDB } from "@/lib/data/articles";
import { PROBLEMAS } from "@/lib/data/problemas-juridicos";
import { GUIAS } from "@/lib/data/guias";
import { GLOSSARIO } from "@/lib/data/glossario";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";

export const revalidate = 10800;

export const metadata = buildMetadata({
  title: "Blog jurídico — artigos, guias, problemas e glossário num lugar só",
  description:
    "Todo o conteúdo jurídico do AdvAqui reunido: artigos, problemas do dia a dia, guias por área, glossário e materiais práticos. Linguagem clara, base legal citada.",
  path: "/blog"
});

const CATEGORIES = [
  { label: "Tribunal do Júri", color: "bg-indigo-50 text-indigo-800 border-indigo-200" },
  { label: "Trabalhista", color: "bg-amber-50 text-amber-800 border-amber-200" },
  { label: "Família", color: "bg-rose-50 text-rose-800 border-rose-200" },
  { label: "Previdenciário", color: "bg-sky-50 text-sky-800 border-sky-200" },
  { label: "Consumidor", color: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  { label: "Sucessões", color: "bg-purple-50 text-purple-800 border-purple-200" },
  { label: "Imobiliário", color: "bg-orange-50 text-orange-800 border-orange-200" },
  { label: "Trânsito", color: "bg-slate-50 text-slate-800 border-slate-200" },
  { label: "Criminal", color: "bg-red-50 text-red-800 border-red-200" },
  { label: "Tributário", color: "bg-teal-50 text-teal-800 border-teal-200" },
  { label: "Administrativo", color: "bg-cyan-50 text-cyan-800 border-cyan-200" },
  { label: "Digital/LGPD", color: "bg-violet-50 text-violet-800 border-violet-200" },
  { label: "Contratual", color: "bg-lime-50 text-lime-800 border-lime-200" },
  { label: "Saúde", color: "bg-pink-50 text-pink-800 border-pink-200" },
  { label: "Ambiental", color: "bg-green-50 text-green-800 border-green-200" },
  { label: "Militar", color: "bg-stone-50 text-stone-800 border-stone-200" },
  { label: "Eleitoral", color: "bg-blue-50 text-blue-800 border-blue-200" },
  { label: "Idoso", color: "bg-yellow-50 text-yellow-800 border-yellow-200" },
  { label: "Criança e Adolescente", color: "bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200" },
  { label: "Bancário", color: "bg-zinc-50 text-zinc-800 border-zinc-200" },
  { label: "Empresarial", color: "bg-neutral-50 text-neutral-800 border-neutral-200" },
  { label: "Civil", color: "bg-gray-50 text-gray-800 border-gray-200" }
];

const catBadge = (cat: string) =>
  CATEGORIES.find((c) => c.label === cat)?.color ||
  "bg-brand-line/40 text-brand-ink border-brand-line";

const SECOES = [
  { href: "#artigos", label: "Artigos" },
  { href: "#problemas", label: "Problemas jurídicos" },
  { href: "#guias", label: "Guias por área" },
  { href: "#glossario", label: "Glossário" },
  { href: "#materiais", label: "Materiais" }
];

function SectionHead({
  Icon,
  titulo,
  desc,
  href,
  hrefLabel
}: {
  Icon: typeof BookOpen;
  titulo: string;
  desc: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
      <div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-ink inline-flex items-center gap-2">
          <Icon className="w-6 h-6 text-brand-deep" aria-hidden />
          {titulo}
        </h2>
        <p className="text-brand-ink/65 mt-1 text-sm md:text-base">{desc}</p>
      </div>
      {href && (
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-deep hover:text-brand-accent2 whitespace-nowrap"
        >
          {hrefLabel || "Ver todos"}
          <ArrowRight className="w-4 h-4" aria-hidden />
        </Link>
      )}
    </div>
  );
}

export default async function BlogHubPage() {
  // Busca artigos do banco (inclui seed + gerados pelo robo)
  let articles = getAllArticles();
  try {
    const result = await getArticlesFromDB({ limit: 50 });
    // getArticlesFromDB retorna seed + db combined; deduplica por slug
    const slugSet = new Set<string>();
    const deduped = result.articles.filter((a) => {
      if (slugSet.has(a.slug)) return false;
      slugSet.add(a.slug);
      return true;
    });
    articles = deduped;
  } catch {
    // Falha silenciosa — mostra apenas seed articles
  }

  const problemas = PROBLEMAS.slice(0, 8);
  const guias = GUIAS;
  const termos = GLOSSARIO.slice(0, 12);

  return (
    <div className="container-tight py-10">
      <Breadcrumb items={[{ label: "Blog" }]} />

      <header className="max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-accent/15 text-brand-deep border border-brand-accent/30 mb-4">
          <BookOpen className="w-3.5 h-3.5" aria-hidden />
          Conteúdo jurídico
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-ink leading-tight">
          Seus direitos explicados — tudo em um lugar só
        </h1>
        <p className="text-lg text-brand-ink/70 mt-4 leading-relaxed">
          Artigos, problemas do dia a dia, guias por área, glossário e materiais
          práticos, reunidos. Em linguagem clara, com a base legal citada — e
          sempre indicando quando procurar um advogado.
        </p>
      </header>

      {/* Navegação por seção */}
      <nav className="mt-6 flex flex-wrap gap-2" aria-label="Seções do conteúdo">
        {SECOES.map((s) => (
          <a
            key={s.href}
            href={s.href}
            className="chip text-brand-ink hover:bg-brand-deep hover:text-white hover:border-brand-deep transition text-sm"
          >
            {s.label}
          </a>
        ))}
      </nav>

      {/* ARTIGOS */}
      <section id="artigos" className="mt-12 scroll-mt-24">
        <SectionHead
          Icon={BookOpen}
          titulo="Artigos"
          desc="Análises e guias práticos — do consumidor ao Tribunal do Júri."
        />
        <div className="grid md:grid-cols-2 gap-6">
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
              <h3 className="font-display text-xl font-bold text-brand-ink leading-snug">
                <Link href={`/blog/${article.slug}`} className="hover:text-brand-deep transition">
                  {article.title}
                </Link>
              </h3>
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
        </div>
      </section>

      {/* PROBLEMAS JURÍDICOS */}
      <section id="problemas" className="mt-14 scroll-mt-24">
        <SectionHead
          Icon={HelpCircle}
          titulo="Problemas jurídicos do dia a dia"
          desc="Reconheça a sua situação e veja o passo a passo do que fazer."
          href="/problemas-juridicos"
          hrefLabel="Ver todos os problemas"
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {problemas.map((p) => (
            <Link
              key={p.slug}
              href={`/problemas-juridicos/${p.slug}`}
              className="group rounded-2xl border border-brand-line bg-white p-4 hover:border-brand-accent hover:shadow-card transition"
            >
              <h3 className="font-display text-base font-bold text-brand-ink group-hover:text-brand-deep leading-snug">
                {p.titulo}
              </h3>
              <p className="text-xs text-brand-ink/60 mt-1.5 leading-snug line-clamp-3">
                {p.intencao_curta}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* GUIAS POR ÁREA */}
      <section id="guias" className="mt-14 scroll-mt-24">
        <SectionHead
          Icon={Compass}
          titulo="Guias por área do direito"
          desc="Visão geral de cada ramo — consumidor, família, trabalho, INSS e mais."
          href="/guias"
          hrefLabel="Ver todos os guias"
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {guias.map((g) => (
            <Link
              key={g.slug}
              href={`/guias/${g.slug}`}
              className="group rounded-2xl border border-brand-line bg-white p-4 hover:border-brand-accent hover:shadow-card transition"
            >
              <h3 className="font-display text-base font-bold text-brand-ink group-hover:text-brand-deep leading-snug">
                {g.titulo}
              </h3>
              <p className="text-xs text-brand-ink/60 mt-1.5 leading-snug line-clamp-2">
                {g.tagline}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* GLOSSÁRIO */}
      <section id="glossario" className="mt-14 scroll-mt-24">
        <SectionHead
          Icon={BookOpen}
          titulo="Glossário jurídico"
          desc="Termos do direito traduzidos para o português do dia a dia."
          href="/glossario"
          hrefLabel="Ver glossário completo"
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {termos.map((t) => (
            <Link
              key={t.slug}
              href={`/glossario/${t.slug}`}
              className="group rounded-xl border border-brand-line bg-white p-3.5 hover:border-brand-accent hover:shadow-card transition"
            >
              <h3 className="font-semibold text-brand-ink group-hover:text-brand-deep text-sm">
                {t.termo}
              </h3>
              <p className="text-xs text-brand-ink/60 mt-1 leading-snug line-clamp-2">
                {t.definicao_curta}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* MATERIAIS E FERRAMENTAS */}
      <section id="materiais" className="mt-14 scroll-mt-24">
        <SectionHead
          Icon={Wrench}
          titulo="Materiais e ferramentas"
          desc="Modelos prontos, calculadoras e checklists para usar agora."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              href: "/modelos",
              Icon: FileText,
              titulo: "Modelos de documentos",
              desc: "Procuração, contrato, recibo, notificação e mais — prontos para baixar."
            },
            {
              href: "/calculadoras",
              Icon: Calculator,
              titulo: "Calculadoras",
              desc: "Rescisão, pensão, FGTS e outras contas em poucos cliques."
            },
            {
              href: "/quanto-custa",
              Icon: HelpCircle,
              titulo: "Quanto custa",
              desc: "Referências de custo de serviços jurídicos comuns."
            },
            {
              href: "/checklist",
              Icon: ListChecks,
              titulo: "Checklist de presença digital",
              desc: "Para advogados: como construir autoridade e ser encontrado online."
            }
          ].map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="group rounded-2xl border border-brand-line bg-white p-5 hover:border-brand-accent hover:shadow-card transition"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-deep/10 flex items-center justify-center mb-3">
                <m.Icon className="w-5 h-5 text-brand-deep" aria-hidden />
              </div>
              <h3 className="font-display text-base font-bold text-brand-ink group-hover:text-brand-deep">
                {m.titulo}
              </h3>
              <p className="text-xs text-brand-ink/60 mt-1.5 leading-snug">{m.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA — advogado publica */}
      <section className="mt-14 rounded-2xl bg-brand-ink text-white p-6 md:p-8">
        <div className="grid md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            <h2 className="font-display text-2xl font-bold">É advogado? Publique no AdvAqui</h2>
            <p className="text-brand-bg/85 mt-3 text-sm leading-relaxed">
              Conteúdo bem feito constrói autoridade na sua especialidade — e o Google
              entende isso. Membros do plano premium podem publicar artigos
              com assinatura e link direto para o próprio perfil.
            </p>
            <p className="text-brand-bg/65 mt-2 text-xs">
              Acesse seu painel e vá em Blog para enviar seu primeiro artigo.
            </p>
          </div>
          <div>
            <Link href="/planos" className="inline-flex w-full justify-center btn-accent text-base">
              Quero aparecer no AdvAqui
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
