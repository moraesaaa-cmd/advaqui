import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { CorrecaoMonetariaWidget } from "@/components/CorrecaoMonetariaWidget";

/**
 * /correcao-monetaria — correção de valores por índice oficial (IPCA, INPC,
 * IGP-M) com dados do Banco Central. Server component só para o SEO; a parte
 * interativa fica no widget client, que fala com /api/indices.
 */
export const metadata: Metadata = buildMetadata({
  title: "Correção monetária pelo IPCA, INPC e IGP-M",
  description:
    "Atualize um valor pela inflação oficial (IPCA, INPC ou IGP-M) com os índices do Banco Central. Mostra o percentual acumulado, o valor corrigido e a memória de cálculo mês a mês. Grátis.",
  path: "/correcao-monetaria"
});

export const dynamic = "force-dynamic";

export default function CorrecaoMonetariaPage() {
  return <CorrecaoMonetariaWidget />;
}
