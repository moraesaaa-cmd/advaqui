import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Calculadora de prazos processuais (dias úteis)",
  description:
    "Calcule o vencimento de prazos processuais em dias úteis ou corridos, já considerando fins de semana e feriados nacionais (CPC, art. 219). Ferramenta gratuita para advogados e partes.",
  path: "/calculadora-prazos"
});

export default function CalculadoraPrazosLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
