import Link from "next/link";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-narrow py-20 text-center">
      <p className="text-6xl font-display font-bold text-brand-deep">404</p>
      <h1 className="font-display text-3xl font-bold text-brand-ink mt-2">
        Página não encontrada
      </h1>
      <p className="text-brand-ink/70 mt-3 max-w-md mx-auto">
        O endereço que você tentou acessar não existe ou foi removido. Volte ao diretório para
        encontrar um advogado.
      </p>
      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        <Link href="/" className="btn-primary">
          Voltar ao início
        </Link>
        <Link href="/advogados" className="btn-ghost border border-brand-line">
          <Search className="w-4 h-4" aria-hidden /> Buscar advogado
        </Link>
      </div>
    </div>
  );
}
