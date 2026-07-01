import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { CorrecaoMonetariaWidget } from "@/components/CorrecaoMonetariaWidget";
import { ToolGate } from "@/components/ToolGate";

export const metadata: Metadata = buildMetadata({
  title: "Correção monetária pelo IPCA, INPC e IGP-M",
  description:
    "Atualize um valor pela inflação oficial (IPCA, INPC ou IGP-M) com os índices do Banco Central. Mostra o percentual acumulado, o valor corrigido e a memória de cálculo mês a mês. Grátis.",
  path: "/correcao-monetaria"
});

export default function CorrecaoMonetariaPage() {
  return (
    <>
      <ToolGate>
        <CorrecaoMonetariaWidget />
      </ToolGate>
      <div className="container-narrow pb-10">
        <section className="rounded-2xl bg-brand-bg border border-brand-line p-6 mb-4">
          <h2 className="font-display text-lg font-bold text-brand-ink mb-3">
            Relacionado
          </h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <Link
              href="/atualizar-valor"
              className="rounded-lg border border-brand-line bg-white p-4 hover:border-brand-accent transition group"
            >
              <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#C8A24A" }}>Ferramenta</span>
              <p className="text-sm font-semibold text-brand-ink group-hover:text-brand-deep mt-1">
                Atualizar valor com juros e multa
              </p>
            </Link>
            <Link
              href="/calculadora-prazos"
              className="rounded-lg border border-brand-line bg-white p-4 hover:border-brand-accent transition group"
            >
              <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#C8A24A" }}>Ferramenta</span>
              <p className="text-sm font-semibold text-brand-ink group-hover:text-brand-deep mt-1">
                Calculadora de prazos processuais
              </p>
            </Link>
            <Link
              href="/blog/banco-cobrou-taxa-indevida"
              className="rounded-lg border border-brand-line bg-white p-4 hover:border-brand-accent transition group"
            >
              <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-ink/50">Blog</span>
              <p className="text-sm font-semibold text-brand-ink group-hover:text-brand-deep mt-1">
                Banco cobrou taxa indevida: como resolver
              </p>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
