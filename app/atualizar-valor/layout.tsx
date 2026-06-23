import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Calculadora de atualização de valores (correção, juros e multa)",
  description:
    "Atualize uma dívida ou valor a receber somando correção monetária, juros de mora e multa. Cálculo na hora, no seu navegador, com a memória de cálculo aberta.",
  path: "/atualizar-valor"
});

export default function AtualizarValorLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
