import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Entrar",
  description:
    "Acesse seu painel de advogado no AdvAqui — edite seu perfil, ative o plano premium e fale com o suporte.",
  path: "/login",
  noIndex: true
});

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
