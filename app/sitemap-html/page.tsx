import Link from "next/link";
import {
  Map,
  Home,
  BookOpen,
  FileText,
  Users,
  Briefcase,
  type LucideIcon
} from "lucide-react";
import { STATES } from "@/lib/data/states";
import { SPECIALTIES } from "@/lib/data/specialties";
import { getAllArticles } from "@/lib/data/articles";
import { getAllTemplates, TEMPLATE_CATEGORIES } from "@/lib/data/templates-docs";
import { Breadcrumb } from "@/components/Breadcrumb";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "Mapa do site",
  description:
    "Navegue por todas as áreas do AdvAqui — diretório por estado, blog jurídico, modelos gratuitos, planos e mais.",
  path: "/sitemap-html"
});

export default function SitemapHtmlPage() {
  const articles = getAllArticles();
  const templates = getAllTemplates();

  return (
    <div className="container-tight py-10">
      <Breadcrumb items={[{ label: "Mapa do site" }]} />

      <header className="max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-accent/15 text-brand-deep border border-brand-accent/30 mb-4">
          <Map className="w-3.5 h-3.5" aria-hidden />
          Navegação completa
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-ink leading-tight">
          Mapa do site
        </h1>
        <p className="text-lg text-brand-ink/70 mt-4 leading-relaxed">
          Todas as seções, páginas e categorias do AdvAqui em uma única visão.
          Use este mapa para encontrar advogados por estado, ler artigos
          jurídicos ou baixar modelos de documentos.
        </p>
        <p className="text-sm text-brand-ink/55 mt-2">
          Sitemap XML para buscadores:{" "}
          <Link href="/sitemap.xml" className="underline text-brand-deep">
            /sitemap.xml
          </Link>
          .
        </p>
      </header>

      <div className="grid lg:grid-cols-2 gap-8 mt-10">
        {/* Páginas institucionais */}
        <SitemapBlock
          Icon={Home}
          title="Páginas principais"
          links={[
            { label: "Página inicial", href: "/" },
            { label: "Diretório de advogados", href: "/advogados" },
            { label: "Buscar por cidade", href: "/buscar" },
            { label: "Planos e preços", href: "/planos" },
            { label: "Sobre o AdvAqui", href: "/sobre" },
            { label: "Perguntas frequentes", href: "/faq" },
            { label: "Contato", href: "/contato" },
            { label: "Cadastro gratuito", href: "/cadastro" },
            { label: "Entrar (login)", href: "/login" }
          ]}
        />

        {/* Conteúdo */}
        <SitemapBlock
          Icon={BookOpen}
          title="Blog jurídico"
          links={[
            { label: "Todos os artigos", href: "/blog" },
            ...articles.map((a) => ({
              label: a.title,
              href: `/blog/${a.slug}`
            }))
          ]}
        />

        {/* Modelos */}
        <SitemapBlock
          Icon={FileText}
          title="Modelos gratuitos"
          links={[
            { label: "Todos os modelos", href: "/modelos" },
            ...TEMPLATE_CATEGORIES.map((cat) => {
              const count = templates.filter((t) => t.category === cat).length;
              return {
                label: `${cat} (${count})`,
                href: "/modelos"
              };
            }),
            ...templates.map((t) => ({
              label: t.title,
              href: `/modelos/${t.slug}`
            }))
          ]}
        />

        {/* Estados */}
        <SitemapBlock
          Icon={Users}
          title="Advogados por estado"
          links={STATES.map((s) => ({
            label: `${s.name} (${s.uf})`,
            href: `/advogados/${s.uf.toLowerCase()}`
          }))}
        />

        {/* Especialidades — apontam para SP capital como amostra */}
        <SitemapBlock
          Icon={Briefcase}
          title="Especialidades (exemplo: São Paulo/SP)"
          links={SPECIALTIES.map((sp) => ({
            label: sp.name,
            href: `/advogados/sp/sao-paulo/${sp.slug}`
          }))}
        />

        {/* Legal */}
        <SitemapBlock
          Icon={Map}
          title="Documentos legais"
          links={[
            { label: "Termos de uso", href: "/termos" },
            { label: "Política de privacidade", href: "/privacidade" },
            { label: "Aviso legal", href: "/aviso-legal" }
          ]}
        />
      </div>
    </div>
  );
}

function SitemapBlock({
  Icon,
  title,
  links
}: {
  Icon: LucideIcon;
  title: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <section className="rounded-2xl border border-brand-line bg-white p-5">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-brand-line">
        <div className="w-9 h-9 rounded-xl bg-brand-deep/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-brand-deep" aria-hidden />
        </div>
        <h2 className="font-display text-lg font-bold text-brand-ink">{title}</h2>
        <span className="ml-auto text-xs text-brand-ink/50">
          {links.length}
        </span>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-sm max-h-96 overflow-y-auto">
        {links.map((l, i) => (
          <li key={`${l.href}-${i}`}>
            <Link
              href={l.href}
              className="text-brand-ink/85 hover:text-brand-deep transition block py-0.5"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
