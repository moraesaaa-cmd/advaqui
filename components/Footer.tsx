import Link from "next/link";
import { SITE } from "@/lib/config";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-20 bg-brand-ink text-brand-bg">
      <div className="container-tight py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="text-white">
            <Logo light />
          </div>
          <p className="mt-3 text-sm text-brand-bg/80 max-w-sm leading-relaxed">
            {SITE.tagline}. Diretório nacional de advogados, organizado por cidade e especialidade.
          </p>
        </div>
        <div>
          <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-3">
            Navegação
          </h4>
          <ul className="space-y-2 text-sm text-brand-bg/80">
            <li><Link href="/advogados" className="hover:text-brand-accent">Diretório</Link></li>
            <li><Link href="/planos" className="hover:text-brand-accent">Planos</Link></li>
            <li><Link href="/sobre" className="hover:text-brand-accent">Sobre</Link></li>
            <li><Link href="/faq" className="hover:text-brand-accent">Perguntas frequentes</Link></li>
            <li><Link href="/contato" className="hover:text-brand-accent">Contato</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-3">
            Legal
          </h4>
          <ul className="space-y-2 text-sm text-brand-bg/80">
            <li><Link href="/termos" className="hover:text-brand-accent">Termos de uso</Link></li>
            <li><Link href="/privacidade" className="hover:text-brand-accent">Política de privacidade</Link></li>
            <li><Link href="/aviso-legal" className="hover:text-brand-accent">Aviso legal</Link></li>
          </ul>
          <p className="mt-4 text-xs text-brand-bg/60">{SITE.email}</p>
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
