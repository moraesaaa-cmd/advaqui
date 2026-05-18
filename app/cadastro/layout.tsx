import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Cadastrar advogado",
  description:
    "Crie seu perfil no AdvAqui em 5 minutos. Cadastro gratuito para advogados com OAB ativa. Apareça no diretório da sua cidade e atenda mais clientes.",
  path: "/cadastro"
});

export default function CadastroLayout({ children }: { children: React.ReactNode }) {
  return children;
}
