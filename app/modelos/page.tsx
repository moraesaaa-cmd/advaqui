import Link from "next/link";
import { FileText, Download, Clock } from "lucide-react";
import {
  TEMPLATE_CATEGORIES,
  getAllTemplates
} from "@/lib/data/templates-docs";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "Modelos gratuitos de documentos",
  description:
    "20 modelos extrajudiciais prontos para uso: procurações, contratos, recibos, declarações, notificações e autorizações. Baixe, preencha as lacunas, assine.",
  path: "/modelos"
});

// Cor única por categoria — para badges manterem coerência visual.
const CAT_CLASSES: Record<string, string> = {
  Procurações: "bg-sky-50 text-sky-800 border-sky-200",
  Contratos: "bg-emerald-50 text-emerald-800 border-emerald-200",
  "Recibos e quitações": "bg-amber-50 text-amber-800 border-amber-200",
  Declarações: "bg-rose-50 text-rose-800 border-rose-200",
  Notificações: "bg-purple-50 text-purple-800 border-purple-200",
  Autorizações: "bg-slate-50 text-slate-800 border-slate-200"
};

export default function ModelosPage() {
  const templates = getAllTemplates();

  return (
    <div className="container-tight py-10">
      <Breadcrumb items={[{ label: "Modelos gratuitos" }]} />

      <header className="max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-accent/15 text-brand-deep border border-brand-accent/30 mb-4">
          <FileText className="w-3.5 h-3.5" aria-hidden />
          Biblioteca jurídica
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-ink leading-tight">
          {templates.length} modelos gratuitos de documentos
        </h1>
        <p className="text-lg text-brand-ink/70 mt-4 leading-relaxed">
          Procurações, contratos, recibos, declarações e notificações com base
          legal citada. Baixe, preencha os campos entre [colchetes] e use. Cada
          modelo traz instruções de preenchimento e o que reconhecer em cartório.
        </p>
      </header>

      <section className="mt-8 rounded-2xl border border-brand-line bg-white p-5">
        <p className="text-sm text-brand-ink/70 leading-relaxed">
          <strong className="text-brand-ink">Importante:</strong> esses modelos
          são genéricos e funcionam para a maioria das situações cotidianas. Para
          casos complexos (alto valor, conflito iminente, situações específicas)
          recomendamos consultar um advogado.{" "}
          <Link
            href="/advogados"
            className="text-brand-deep font-semibold hover:text-brand-accent2 underline underline-offset-2"
          >
            Encontre um na sua cidade
          </Link>
          .
        </p>
      </section>

      {TEMPLATE_CATEGORIES.map((cat) => {
        const items = templates.filter((t) => t.category === cat);
        if (items.length === 0) return null;
        return (
          <section key={cat} className="mt-10">
            <div className="flex items-center justify-between border-b border-brand-line pb-2 mb-4">
              <h2 className="font-display text-2xl font-bold text-brand-ink">
                {cat}
              </h2>
              <span className="text-xs text-brand-ink/50">
                {items.length} modelo(s)
              </span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((t) => (
                <Link
                  key={t.slug}
                  href={`/modelos/${t.slug}`}
                  className="card group hover:border-brand-accent transition flex flex-col"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                        CAT_CLASSES[t.category]
                      }`}
                    >
                      {t.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-brand-ink/50">
                      <Clock className="w-3 h-3" aria-hidden />
                      {t.fillingMinutes} min
                    </span>
                  </div>
                  <h3 className="font-display text-base font-bold text-brand-ink group-hover:text-brand-deep leading-snug">
                    {t.title}
                  </h3>
                  <p className="text-xs text-brand-ink/65 mt-2 line-clamp-2 leading-relaxed flex-1">
                    {t.description}
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-brand-deep group-hover:text-brand-accent2">
                    <Download className="w-3.5 h-3.5" aria-hidden />
                    Ver modelo
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <section className="mt-12 rounded-2xl bg-gradient-to-br from-brand-deep to-brand-ink text-white p-6 md:p-8">
        <div className="grid md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            <h2 className="font-display text-2xl font-bold">
              Precisa de revisão por um advogado?
            </h2>
            <p className="text-brand-bg/85 mt-3 text-sm leading-relaxed">
              Esses modelos resolvem 90% dos casos cotidianos. Mas se houver
              valores altos, partes em conflito ou cláusulas especiais, vale
              uma revisão profissional. Encontre um advogado na sua cidade
              através do diretório AdvAqui.
            </p>
          </div>
          <div>
            <Link href="/advogados" className="inline-flex w-full justify-center btn-accent text-base">
              Encontrar advogado
            </Link>
          </div>
        </div>
      </section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Brasil", url: "/" },
          { name: "Modelos gratuitos", url: "/modelos" }
        ])}
      />
    </div>
  );
}
