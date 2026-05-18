import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Redefinir senha",
  description: "Defina uma nova senha para sua conta no AdvAqui.",
  path: "/redefinir-senha",
  noIndex: true
});

export default function RedefinirSenhaLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return children;
}
