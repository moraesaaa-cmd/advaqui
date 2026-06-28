import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buildMetadata } from "@/lib/seo/metadata";
import { SeguroDesempregoWidget } from "@/components/SeguroDesempregoWidget";

export const metadata: Metadata = buildMetadata({
  title: "Simulador de seguro-desemprego 2026: parcelas e valor",
  description:
    "Calcule quantas parcelas de seguro-desemprego você tem direito e o valor de cada uma pela tabela oficial do Ministério do Trabalho de 2026. Grátis e na hora.",
  path: "/seguro-desemprego"
});

export default function SeguroDesempregoPage() {
  return (
    <>
      <SeguroDesempregoWidget />
      <div className="container-narrow pb-10">
        <section className="rounded-2xl bg-brand-bg border border-brand-line p-6 mb-4">
          <h2 className="font-display text-lg font-bold text-brand-ink mb-3">
            Relacionado
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link
              href="/blog/fui-demitido-sem-justa-causa"
              className="rounded-lg border border-brand-line bg-white p-4 hover:border-brand-accent transition group"
            >
              <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-ink/50">Blog</span>
              <p className="text-sm font-semibold text-brand-ink group-hover:text-brand-deep mt-1">
                Fui demitido sem justa causa: direitos e como calcular a rescisão
              </p>
            </Link>
            <Link
              href="/problemas-juridicos/fui-demitido-sem-receber-direitos"
              className="rounded-lg border border-brand-line bg-white p-4 hover:border-brand-accent transition group"
            >
              <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-ink/50">Guia passo a passo</span>
              <p className="text-sm font-semibold text-brand-ink group-hover:text-brand-deep mt-1">
                Fui demitido sem receber direitos
              </p>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
