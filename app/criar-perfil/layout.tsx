import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Monte seu perfil de advogado em 1 minuto",
  description:
    "Assistente guiado do AdvAqui: responda algumas perguntas e receba sua ficha profissional pronta, com bio sugerida e o que falta para o cliente te encontrar e te chamar.",
  path: "/criar-perfil"
});

export default function CriarPerfilLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
