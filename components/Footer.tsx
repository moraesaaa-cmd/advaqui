import Link from "next/link";
import { SITE } from "@/lib/config";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-20 bg-brand-ink text-brand-bg">
      <div className="container-tight py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2 md:col-span-2">
          <div className="text-white">
            <Logo light />
          </div>
          <p className="mt-3 text-sm text-brand-bg/80 max-w-sm leading-relaxed">
            {SITE.tagline}. Diretório nacional de advogados, organizado por cidade e especialidade.
          </p>
          <p className="mt-4 text-xs text-brand-bg/60">{SITE.email}</p>
        </div>
        <div>
          <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-3">
            Diretório
          </h4>
          <ul className="space-y-2 text-sm text-brand-bg/80">
            <li><Link href="/advogados" className="hover:text-brand-accent">Por estado</Link></li>
            <li><Link href="/buscar" className="hover:text-brand-accent">Buscar cidade</Link></li>
            <li><Link href="/planos" className="hover:text-brand-accent">Planos</Link></li>
            <li><Link href="/cadastro" className="hover:text-brand-accent">Cadastrar advogado</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-3">
            Conteúdo
          </h4>
          <ul className="space-y-2 text-sm text-brand-bg/80">
            <li><Link href="/blog" className="hover:text-brand-accent">Blog jurídico</Link></li>
            <li><Link href="/modelos" className="hover:text-brand-accent">Modelos gratuitos</Link></li>
            <li><Link href="/sobre" className="hover:text-brand-accent">Sobre o AdvAqui</Link></li>
            <li><Link href="/faq" className="hover:text-brand-accent">Perguntas frequentes</Link></li>
            <li><Link href="/contato" className="hover:text-brand-accent">Contato</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-3">
            Site
          </h4>
          <ul className="space-y-2 text-sm text-brand-bg/80">
            <li><Link href="/sitemap-html" className="hover:text-brand-accent">Mapa do site</Link></li>
            <li><Link href="/sitemap.xml" className="hover:text-brand-accent">Sitemap XML</Link></li>
            <li><Link href="/termos" className="hover:text-brand-accent">Termos de uso</Link></li>
            <li><Link href="/privacidade" className="hover:text-brand-accent">Privacidade</Link></li>
            <li><Link href="/aviso-legal" className="hover:text-brand-accent">Aviso legal</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-tight py-4 text-xs text-brand-bg/60 text-center">
          © {new Date().getFullYear()} {SITE.name}. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
