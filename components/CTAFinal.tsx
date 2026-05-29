import Link from "next/link";
import {
  FileText,
  Calculator,
  Users,
  ChevronRight,
  ArrowLeft,
  Shield,
  type LucideIcon
} from "lucide-react";

/**
 * Bloco de chamada à ação no final de páginas pilar (blog, problemas-juridicos,
 * guias, calculadoras). Pergunta "O que você deseja fazer agora?" e oferece
 * 4 caminhos contextuais.
 *
 * Uso:
 *   <CTAFinal
 *     cidade="São Paulo"     // opcional — personaliza link de advogados
 *     uf="SP"                // opcional
 *     areaSlug="trabalhista" // opcional — filtra advogado por área
 *   />
 *
 * Sem cidade/uf, vai pro diretório geral. Com cidade/uf, vai pra cidade.
 * Com area, filtra por especialidade.
 */
type CTAAction = {
  href: string;
  label: string;
  desc: string;
  Icon: LucideIcon;
  primary?: boolean;
};

export function CTAFinal({
  cidade,
  uf,
  areaSlug,
  problemSlug
}: {
  cidade?: string;
  uf?: string;
  areaSlug?: string;
  problemSlug?: string;
}) {
  const ufLower = uf ? uf.toLowerCase() : null;
  const citySlug = cidade && uf ? cidade
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") : null;

  const advogadosHref =
    citySlug && ufLower
      ? areaSlug
        ? `/advogados/${ufLower}/${citySlug}/${areaSlug}`
        : `/advogados/${ufLower}/${citySlug}`
      : "/advogados";

  const modeloHref = "/modelos";
  const calculadoraHref = "/calculadoras";

  const actions: CTAAction[] = [
    {
      href: advogadosHref,
      label: cidade
        ? `Falar com advogado em ${cidade}`
        : "Encontrar advogado",
      desc: cidade
        ? `Veja perfis de profissionais que atuam em ${cidade}${uf ? `/${uf}` : ""}.`
        : "Diretório por cidade e área de atuação, com canal direto.",
      Icon: Users,
      primary: true
    },
    {
      href: modeloHref,
      label: "Gerar um documento",
      desc: "Procurações, contratos, notificações, declarações — modelos prontos pra usar."
    } as CTAAction & { Icon?: LucideIcon },
    {
      href: calculadoraHref,
      label: "Calcular meus direitos",
      desc: "Rescisão, FGTS, pensão, aposentadoria — fórmula explicada com exemplo."
    } as CTAAction & { Icon?: LucideIcon },
    {
      href: problemSlug
        ? `/problemas-juridicos/${problemSlug}`
        : "/problemas-juridicos",
      label: "Ver problemas e soluções",
      desc: "Diagnóstico em linguagem simples — o que fazer, prazos, como agir."
    } as CTAAction & { Icon?: LucideIcon }
  ];

  // Atribui ícones aos itens sem Icon (defaults)
  const enriched: CTAAction[] = [
    actions[0],
    { ...actions[1], Icon: FileText },
    { ...actions[2], Icon: Calculator },
    { ...actions[3], Icon: Shield }
  ];

  return (
    <section
      className="mt-12 rounded-3xl border-2 border-brand-accent/30 bg-gradient-to-br from-brand-bg via-white to-brand-accent/5 p-6 md:p-8"
      aria-labelledby="cta-final-titulo"
    >
      <header className="text-center mb-6 max-w-2xl mx-auto">
        <h2
          id="cta-final-titulo"
          className="font-display text-2xl md:text-3xl font-bold text-brand-ink"
        >
          O que você deseja fazer agora?
        </h2>
        <p className="text-sm md:text-base text-brand-ink/65 mt-2">
          Quatro caminhos práticos — escolha o mais útil pro seu caso{cidade ? ` em ${cidade}` : ""}.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
        {enriched.map((a) => (
          <Link
            key={a.href + a.label}
            href={a.href}
            className={`group flex items-start gap-3 rounded-2xl border-2 p-4 transition ${
              a.primary
                ? "border-brand-accent bg-brand-accent/10 hover:bg-brand-accent/20"
                : "border-brand-line bg-white hover:border-brand-accent/60 hover:shadow-card"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                a.primary
                  ? "bg-brand-accent text-brand-ink"
                  : "bg-brand-accent/15 text-brand-accent2"
              }`}
            >
              <a.Icon className="w-5 h-5" aria-hidden />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`font-display text-base font-bold ${
                  a.primary ? "text-brand-ink" : "text-brand-ink"
                }`}
              >
                {a.label}
              </p>
              <p className="text-sm text-brand-ink/65 mt-0.5 leading-relaxed">
                {a.desc}
              </p>
            </div>
            <ChevronRight
              className="w-5 h-5 text-brand-ink/30 group-hover:text-brand-accent transition flex-shrink-0 mt-1"
              aria-hidden
            />
          </Link>
        ))}
      </div>

      <div className="mt-5 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-brand-ink/55 hover:text-brand-deep transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden />
          Voltar ao início
        </Link>
      </div>
    </section>
  );
}
