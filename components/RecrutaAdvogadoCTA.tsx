import Link from "next/link";
import { Scale, ArrowRight } from "lucide-react";

/**
 * Tarjeta de recrutamento de advogados — "Sou advogado e quero aparecer aqui".
 * Reutilizável: usada no fim das páginas públicas (via GlobalRecrutaCTA) para
 * captar advogados de qualquer ponto do site, levando à landing /para-advogados.
 */
export function RecrutaAdvogadoCTA() {
  return (
    <section className="container-tight py-8">
      <div className="rounded-3xl bg-brand-ink text-white p-7 md:p-10 relative overflow-hidden">
        <div
          aria-hidden
          className="absolute -top-1/4 -right-1/4 w-1/2 aspect-square rounded-full bg-brand-accent/20 blur-3xl"
        />
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-brand-accent text-brand-ink mb-4">
            <Scale className="w-3.5 h-3.5" aria-hidden />
            Para advogados
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight">
            Sou advogado e quero aparecer aqui
          </h2>
          <p className="text-brand-bg/85 mt-3 text-base leading-relaxed">
            Apareça quando alguém procura um advogado na sua cidade.{" "}
            <strong className="text-brand-accent">
              Leva menos de 2 minutos e não custa nada para começar.
            </strong>
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/cadastro"
              className="btn-accent inline-flex items-center gap-2"
            >
              Criar meu perfil grátis
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              href="/planos"
              className="btn-ghost text-white border border-white/25 hover:bg-white/10 inline-flex items-center gap-2"
            >
              Saiba mais
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
