import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { RevisorPeticaoWidget } from "@/components/RevisorPeticaoWidget";

/**
 * /revisor-peticao — revisor e humanizador de petições por IA. Página pública
 * (indexável) que explica a ferramenta; o uso real chama /api/painel/revisar-peticao
 * e exige plano premium ativo do advogado logado.
 */
export const metadata: Metadata = buildMetadata({
  title: "Revisor de petições com IA — revisar e humanizar texto jurídico",
  description:
    "Revise a gramática e a técnica da sua petição ou humanize um texto que ficou robótico, com IA — sem mudar fatos, valores ou pedidos. Recurso premium para advogados no AdvAqui.",
  path: "/revisor-peticao"
});

export const dynamic = "force-dynamic";

export default function RevisorPeticaoPage() {
  return <RevisorPeticaoWidget />;
}
