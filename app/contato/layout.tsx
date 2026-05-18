import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Contato",
  description:
    "Fale com a equipe do AdvAqui. Tire dúvidas sobre cadastro, plano premium, pagamento via Pix ou parcerias. Resposta em até 48 horas úteis.",
  path: "/contato"
});

export default function ContatoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
