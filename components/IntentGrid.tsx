import Link from "next/link";
import {
  ShieldAlert,
  CreditCard,
  Briefcase,
  HeartPulse,
  Stethoscope,
  Users,
  Baby,
  ShoppingBag,
  Landmark,
  Car,
  Search,
  ArrowRight,
  type LucideIcon
} from "lucide-react";

/**
 * "O que você quer resolver?" — entrada por intenção na home.
 *
 * Cards diretos pros problemas mais buscados, em linguagem do cidadão
 * (não jurídiquês). Cada card aponta pra uma página de problema REAL que
 * existe (slug verificado). O objetivo é: a pessoa chega, reconhece o caso
 * dela em 1 segundo e clica — sem precisar saber a "área do direito".
 */
type Intent = { href: string; label: string; sub: string; Icon: LucideIcon };

const INTENTS: Intent[] = [
  {
    href: "/problemas-juridicos/fui-vitima-de-golpe-do-pix",
    label: "Caí em golpe do PIX",
    sub: "Transferência por fraude",
    Icon: ShieldAlert
  },
  {
    href: "/problemas-juridicos/nome-negativado-indevidamente",
    label: "Meu nome está negativado",
    sub: "SPC / Serasa indevido",
    Icon: CreditCard
  },
  {
    href: "/problemas-juridicos/fui-demitido-sem-receber-direitos",
    label: "Fui demitido",
    sub: "Verbas e direitos",
    Icon: Briefcase
  },
  {
    href: "/problemas-juridicos/beneficio-do-inss-foi-negado",
    label: "O INSS negou meu benefício",
    sub: "Aposentadoria, auxílio",
    Icon: HeartPulse
  },
  {
    href: "/problemas-juridicos/plano-de-saude-negou-cirurgia",
    label: "Plano de saúde negou",
    sub: "Cirurgia ou tratamento",
    Icon: Stethoscope
  },
  {
    href: "/problemas-juridicos/quero-me-divorciar",
    label: "Quero me divorciar",
    sub: "Como funciona",
    Icon: Users
  },
  {
    href: "/problemas-juridicos/pai-nao-paga-pensao",
    label: "Não recebo pensão",
    sub: "Cobrança de alimentos",
    Icon: Baby
  },
  {
    href: "/problemas-juridicos/comprei-produto-com-defeito",
    label: "Produto com defeito",
    sub: "Troca, conserto, dinheiro",
    Icon: ShoppingBag
  },
  {
    href: "/problemas-juridicos/fui-cobrado-juros-abusivos",
    label: "Juros abusivos do banco",
    sub: "Cartão, financiamento",
    Icon: Landmark
  },
  {
    href: "/problemas-juridicos/fui-vitima-de-acidente-de-transito",
    label: "Sofri acidente de trânsito",
    sub: "Indenização",
    Icon: Car
  }
];

export function IntentGrid() {
  return (
    <section className="container-tight py-14 md:py-16">
      <div className="text-center mb-8 max-w-2xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
          O que você quer resolver?
        </h2>
        <p className="text-brand-ink/65 mt-3 text-base md:text-lg">
          Escolha sua situação e veja o passo a passo — em linguagem clara, sem
          juridiquês. Depois, se precisar, encontre um advogado na sua cidade.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {INTENTS.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className="group flex flex-col items-start gap-2 rounded-2xl border-2 border-brand-line bg-white p-4 hover:border-brand-accent hover:shadow-card transition"
          >
            <div className="w-11 h-11 rounded-xl bg-brand-accent/15 flex items-center justify-center">
              <it.Icon className="w-5 h-5 text-brand-accent2" aria-hidden />
            </div>
            <div>
              <p className="font-display text-sm md:text-base font-bold text-brand-ink leading-snug group-hover:text-brand-deep transition">
                {it.label}
              </p>
              <p className="text-xs text-brand-ink/60 mt-0.5 leading-snug">
                {it.sub}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Card destacado: quem já sabe que quer um advogado vai direto ao diretório */}
      <Link
        href="/advogados"
        className="mt-4 group flex items-center justify-between gap-4 rounded-2xl border-2 border-brand-accent bg-gradient-to-br from-brand-accent/15 to-brand-accent2/10 p-5 hover:shadow-cardHover transition"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-brand-accent/30 flex items-center justify-center flex-shrink-0">
            <Search className="w-5 h-5 text-brand-deep" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="font-display text-base font-bold text-brand-ink leading-snug">
              Já sei: estou procurando um advogado
            </p>
            <p className="text-sm text-brand-ink/65 leading-snug">
              Encontre um advogado na sua cidade e fale direto pelo WhatsApp.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-bold text-brand-deep group-hover:text-brand-accent2 whitespace-nowrap">
          Encontrar
          <ArrowRight className="w-4 h-4" aria-hidden />
        </span>
      </Link>

      <div className="mt-6 text-center">
        <Link
          href="/problemas-juridicos"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-deep hover:text-brand-accent2 transition"
        >
          Ver todos os problemas jurídicos
          <ArrowRight className="w-4 h-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
