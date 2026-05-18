import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Recuperar senha",
  description: "Recupere o acesso ao seu painel de advogado no AdvAqui.",
  path: "/recuperar-senha",
  noIndex: true
});

export default function RecuperarSenhaLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return children;
}
