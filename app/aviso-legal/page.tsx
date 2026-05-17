import { buildMetadata } from "@/lib/seo/metadata";
import { SITE } from "@/lib/config";

export const metadata = buildMetadata({
  title: "Aviso legal",
  description: `Aviso legal do ${SITE.name}.`,
  path: "/aviso-legal"
});

export default function AvisoLegalPage() {
  return (
    <div className="container-narrow py-12">
      <h1 className="font-display text-4xl font-bold text-brand-ink mb-6">Aviso legal</h1>
      <article className="prose max-w-none text-brand-ink/85 space-y-4 leading-relaxed">
        <p>
          O {SITE.name} é uma plataforma de vitrine e diretório de profissionais do direito,
          sem qualquer ingerência sobre a contratação, prestação de serviços, honorários ou
          relação entre advogado e cliente.
        </p>
        <p>
          Os perfis aqui listados são autodeclarados pelos próprios advogados, com validação do
          número de inscrição na OAB feita manualmente. A plataforma não se responsabiliza por
          informações desatualizadas, divergências de dados ou pela qualidade técnica dos serviços
          prestados.
        </p>
        <p>
          A publicidade dos advogados deve respeitar o Código de Ética da OAB e o Provimento
          205/2021 do Conselho Federal. Cabe ao próprio advogado zelar pela conformidade do seu
          perfil.
        </p>
        <p>
          O {SITE.name} não capta clientela, não distribui demandas, não medeia honorários e não
          atua como intermediário em nenhuma etapa do contrato entre advogado e cliente.
        </p>
        <p>
          Em caso de divergência ou solicitação de remoção de perfil, entre em contato pelo
          formulário de suporte ou pelo e-mail {SITE.email}.
        </p>
      </article>
    </div>
  );
}
