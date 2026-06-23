import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Montar petição — rascunho guiado de peças jurídicas",
  description:
    "Monte o rascunho de uma peça jurídica passo a passo: reclamação trabalhista, ação de alimentos, consumo e notificação de cobrança. Modelo educativo para levar ao seu advogado.",
  path: "/montar-peticao"
});

export default function MontarPeticaoLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
