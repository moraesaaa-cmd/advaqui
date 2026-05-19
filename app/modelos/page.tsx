import Link from "next/link";
import {
  FileText,
  Download,
  Clock,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Star
} from "lucide-react";
import {
  TEMPLATE_CATEGORIES,
  getAllTemplates,
  type Template
} from "@/lib/data/templates-docs";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "Modelos gratuitos de documentos",
  description:
    "20 modelos extrajudiciais prontos para uso: procurações, contratos, recibos, declarações, notificações e autorizações. Cadastre-se grátis para baixar e usar.",
  path: "/modelos"
});

// Cor única e VIBRANTE por categoria. Foco em legibilidade + impacto visual.
// Cada par tem bg suave + texto saturado + borda destacada.
const CAT_STYLES: Record<
  string,
  { chip: string; tile: string; iconBg: string; iconColor: string }
> = {
  Procurações: {
    chip: "bg-sky-100 text-sky-800 border-sky-300",
    tile: "from-sky-50 to-white border-sky-200 hover:border-sky-400",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-700"
  },
  Contratos: {
    chip: "bg-emerald-100 text-emerald-800 border-emerald-300",
    tile: "from-emerald-50 to-white border-emerald-200 hover:border-emerald-400",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700"
  },
  "Recibos e quitações": {
    chip: "bg-amber-100 text-amber-900 border-amber-300",
    tile: "from-amber-50 to-white border-amber-200 hover:border-amber-400",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-800"
  },
  Declarações: {
    chip: "bg-rose-100 text-rose-800 border-rose-300",
    tile: "from-rose-50 to-white border-rose-200 hover:border-rose-400",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-700"
  },
  Notificações: {
    chip: "bg-purple-100 text-purple-800 border-purple-300",
    tile: "from-purple-50 to-white border-purple-200 hover:border-purple-400",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-700"
  },
  Autorizações: {
    chip: "bg-slate-100 text-slate-800 border-slate-300",
    tile: "from-slate-50 to-white border-slate-200 hover:border-slate-400",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-700"
  }
};

// Os 10 modelos "Mais procurados" — destacados no topo. Pediido explícito do
// produto (Moraes, Maio/2026): a primeira tela é dominada por estes 10.
const TOP10_SLUGS: ReadonlyArray<string> = [
  "procuracao-particular-geral",
  "contrato-de-locacao-residencial-simples",
  "distrato-contrato-locacao",
  "recibo-pagamento-quitacao",
  "declaracao-de-domicilio-residencia",
  "autorizacao-viagem-menor-nacional",
  "contrato-prestacao-de-servicos",
  "termo-quitacao-debito",
  "declaracao-de-uniao-estavel",
  "notificacao-extrajudicial-cobranca"
];

const getStyle = (cat: Template["category"]) =>
  CAT_STYLES[cat] || CAT_STYLES["Declarações"];

export default function ModelosPage() {
  const templates = getAllTemplates();
  const top10 = TOP10_SLUGS
    .map((s) => templates.find((t) => t.slug === s))
    .filter((t): t is Template => Boolean(t));
  const rest = templates.filter((t) => !TOP10_SLUGS.includes(t.slug));

  return (
    <>
      {/* HERO — visual marcante, gradiente, destaque amarelo vivo */}
      <section className="relative bg-gradient-to-br from-brand-ink via-brand-deep to-brand-primary text-white overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 30%, rgba(245,158,11,0.55) 0%, transparent 45%), radial-gradient(circle at 85% 70%, rgba(251,191,36,0.45) 0%, transparent 45%)"
          }}
        />
        <div className="relative container-tight py-14 md:py-20">
          <div className="max-w-3xl">
            <Breadcrumb items={[{ label: "Modelos gratuitos" }]} />
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-accent text-brand-ink mb-4">
              <Sparkles className="w-3.5 h-3.5" aria-hidden />
              Biblioteca jurídica gratuita
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight text-balance">
              20 modelos prontos para usar
            </h1>
            <p className="text-lg md:text-xl text-brand-bg/85 mt-5 leading-relaxed">
              Procurações, contratos, recibos, declarações e notificações com base legal
              citada. Preencha os campos entre <code className="px-1.5 py-0.5 rounded bg-white/10 text-brand-accent font-mono text-sm">[colchetes]</code> e use.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4 text-sm text-brand-bg/80">
              <span className="inline-flex items-center gap-2">
                <Download className="w-4 h-4 text-brand-accent" aria-hidden />
                Download em .txt
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-accent" aria-hidden />
                Base legal em todos
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-accent" aria-hidden />
                Pronto em 3-10 min
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="container-tight py-12">
        {/* Bloco "Mais procurados" — Top 10 destacado */}
        <section className="mb-14">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-6 pb-3 border-b border-brand-line">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-accent text-brand-ink mb-2">
                <Star className="w-3 h-3 fill-current" aria-hidden />
                Top 10
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
                Mais procurados
              </h2>
              <p className="text-brand-ink/65 mt-1 text-sm md:text-base">
                Documentos com maior demanda real entre brasileiros — comece por aqui.
              </p>
            </div>
            <span className="text-xs text-brand-ink/50">{top10.length} de {templates.length}</span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {top10.map((t, i) => {
              const style = getStyle(t.category);
              return (
                <Link
                  key={t.slug}
                  href={`/modelos/${t.slug}`}
                  className={`group relative rounded-2xl border-2 bg-gradient-to-br ${style.tile} p-5 transition shadow-card hover:shadow-cardHover`}
                >
                  <span className="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-brand-accent text-brand-ink text-sm font-bold flex items-center justify-center shadow-card">
                    {i + 1}
                  </span>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className={`w-10 h-10 rounded-xl ${style.iconBg} flex items-center justify-center`}>
                      <FileText className={`w-5 h-5 ${style.iconColor}`} aria-hidden />
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs text-brand-ink/60 bg-white px-2 py-0.5 rounded-full border border-brand-line">
                      <Clock className="w-3 h-3" aria-hidden />
                      {t.fillingMinutes} min
                    </span>
                  </div>
                  <h3 className="font-display text-base md:text-lg font-bold text-brand-ink leading-snug group-hover:text-brand-deep transition">
                    {t.title}
                  </h3>
                  <p className="text-xs md:text-sm text-brand-ink/65 mt-2 line-clamp-2 leading-relaxed">
                    {t.description}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-deep group-hover:text-brand-accent2 transition">
                    Ver modelo
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" aria-hidden />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Bloco "Mais modelos" — restante por categoria */}
        {rest.length > 0 && (
          <>
            <div className="rounded-2xl border border-dashed border-brand-line bg-white p-5 mb-8 flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-brand-accent2 flex-shrink-0 mt-0.5" aria-hidden />
              <div className="text-sm text-brand-ink/75 leading-relaxed">
                <strong className="text-brand-ink">Não é só o top 10.</strong>{" "}
                Temos {rest.length} modelos adicionais organizados por categoria — confidencialidade,
                comodato, cessão de direitos, doação e mais. Veja abaixo.
              </div>
            </div>

            {TEMPLATE_CATEGORIES.map((cat) => {
              const items = rest.filter((t) => t.category === cat);
              if (items.length === 0) return null;
              const style = getStyle(cat);
              return (
                <section key={cat} className="mb-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${style.chip}`}
                    >
                      {cat}
                    </span>
                    <span className="text-xs text-brand-ink/45">
                      {items.length} modelo(s)
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((t) => (
                      <Link
                        key={t.slug}
                        href={`/modelos/${t.slug}`}
                        className={`group rounded-2xl border-2 bg-gradient-to-br ${style.tile} p-4 transition shadow-card hover:shadow-cardHover flex flex-col`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={`w-9 h-9 rounded-xl ${style.iconBg} flex items-center justify-center`}>
                            <FileText className={`w-4.5 h-4.5 ${style.iconColor}`} aria-hidden />
                          </div>
                          <span className="text-xs text-brand-ink/55">{t.fillingMinutes} min</span>
                        </div>
                        <h3 className="font-display text-base font-bold text-brand-ink group-hover:text-brand-deep leading-snug">
                          {t.title}
                        </h3>
                        <p className="text-xs text-brand-ink/60 mt-2 line-clamp-2 leading-relaxed flex-1">
                          {t.description}
                        </p>
                        <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-deep group-hover:text-brand-accent2">
                          Ver modelo
                          <ArrowRight className="w-3.5 h-3.5" aria-hidden />
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </>
        )}

        {/* CTA final */}
        <section className="mt-12 rounded-3xl bg-gradient-to-br from-brand-deep to-brand-ink text-white p-8 md:p-10 relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-1/4 -right-1/4 w-1/2 aspect-square rounded-full bg-brand-accent/20 blur-3xl"
          />
          <div className="relative grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-accent text-brand-ink mb-3">
                Para o seu caso específico
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight">
                Precisa de revisão profissional?
              </h2>
              <p className="text-brand-bg/85 mt-3 text-sm md:text-base leading-relaxed">
                Esses modelos cobrem 90% dos casos cotidianos. Em casos com valor alto,
                conflito real ou cláusulas específicas, vale uma revisão de advogado.
                Use o diretório AdvAqui pra encontrar um na sua cidade.
              </p>
            </div>
            <div>
              <Link
                href="/advogados"
                className="btn-accent w-full justify-center text-base inline-flex items-center gap-2"
              >
                Encontrar advogado
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      </div>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Brasil", url: "/" },
          { name: "Modelos gratuitos", url: "/modelos" }
        ])}
      />
    </>
  );
}
