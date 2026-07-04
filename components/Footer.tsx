import Link from "next/link";
import { SITE } from "@/lib/config";
import { Logo } from "./Logo";

const COLUMNS: Array<{ title: string; links: Array<{ href: string; label: string }> }> = [
  {
    title: "Encontrar advogado",
    links: [
      { href: "/advogados", label: "Diretório por estado" },
      { href: "/advogados-de", label: "Áreas de atuação" },
      { href: "/buscar", label: "Buscar por cidade" },
      { href: "/central", label: "Por onde começar" }
    ]
  },
  {
    title: "Conteúdo",
    links: [
      { href: "/problemas-juridicos", label: "Problemas jurídicos" },
      { href: "/guias", label: "Guias por área" },
      { href: "/glossario", label: "Glossário jurídico" },
      { href: "/jurisprudencia", label: "Jurisprudência STF/STJ" }
    ]
  },
  {
    title: "Ferramentas",
    links: [
      { href: "/ferramentas", label: "Todas as ferramentas" },
      { href: "/ferramentas/pdf", label: "Ferramentas PDF" },
      { href: "/calculadoras", label: "Calculadoras" },
      { href: "/calculadora-prazos", label: "Calculadora de prazos" },
      { href: "/atualizar-valor", label: "Atualizar um valor" },
      { href: "/quanto-custa", label: "Quanto custa" },
      { href: "/modelos", label: "Modelos de documentos" },
      { href: "/montar-peticao", label: "Montar petição" },
      { href: "/tribunais", label: "Tribunais por cidade" }
    ]
  },
  {
    title: "AdvAqui",
    links: [
      { href: "/planos", label: "Para advogados" },
      { href: "/criar-perfil", label: "Montar meu perfil" },
      { href: "/cadastro", label: "Cadastrar advogado" },
      { href: "/blog", label: "Blog" },
      { href: "/marketing-juridico", label: "Marketing jurídico" },
      { href: "/selo", label: "Selo AdvAqui" },
      { href: "/sobre", label: "Sobre" },
      { href: "/como-verificamos", label: "Como verificamos os cadastros" },
      { href: "/faq", label: "FAQ" },
      { href: "/contato", label: "Contato" }
    ]
  }
];

const LEGAL: Array<{ href: string; label: string }> = [
  { href: "/sitemap-html", label: "Mapa do site" },
  { href: "/termos", label: "Termos de uso" },
  { href: "/privacidade", label: "Privacidade" },
  { href: "/aviso-legal", label: "Aviso legal" }
];

export function Footer() {
  return (
    <footer className="mt-20 bg-brand-ink text-brand-bg">
      <div className="container-tight py-12 grid grid-cols-2 md:grid-cols-6 gap-8">
        <div className="col-span-2">
          <div className="text-white">
            <Logo light />
          </div>
          <p className="mt-3 text-sm text-brand-bg/80 max-w-sm leading-relaxed">
            {SITE.tagline}. Diretório nacional de advogados e biblioteca
            jurídica em linguagem clara, organizada por cidade, área e problema.
          </p>
          <p className="mt-4 text-xs text-brand-bg/60">{SITE.email}</p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-3">
              {col.title}
            </h4>
            <ul className="space-y-2 text-sm text-brand-bg/80">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-brand-accent">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container-tight py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-brand-bg/60 text-center">
            © {new Date().getFullYear()} {SITE.name}. Todos os direitos reservados.
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-brand-bg/60">
            {LEGAL.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-brand-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
