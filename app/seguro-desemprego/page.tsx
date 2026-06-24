import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { SeguroDesempregoWidget } from "@/components/SeguroDesempregoWidget";

/**
 * /seguro-desemprego — simulador do número de parcelas e do valor do
 * seguro-desemprego pela tabela oficial do MTE. Server component só para SEO;
 * o cálculo é determinístico e fica no widget client.
 */
export const metadata: Metadata = buildMetadata({
  title: "Simulador de seguro-desemprego 2026: parcelas e valor",
  description:
    "Calcule quantas parcelas de seguro-desemprego você tem direito e o valor de cada uma pela tabela oficial do Ministério do Trabalho de 2026. Grátis e na hora.",
  path: "/seguro-desemprego"
});

export default function SeguroDesempregoPage() {
  return <SeguroDesempregoWidget />;
}
