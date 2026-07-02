import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE } from "@/lib/config";

export const metadata = buildMetadata({
  title: "Sobre",
  description: `Conheça o ${SITE.name}, diretório nacional de advogados organizado por cidade e especialidade.`,
  path: "/sobre"
});

export default function SobrePage() {
  return (
    <div className="container-narrow py-12">
      <h1 className="font-display text-4xl font-bold text-brand-ink">Sobre o {SITE.name}</h1>
      <div className="prose prose-slate max-w-none mt-6 space-y-4 text-brand-ink/85 leading-relaxed">
        <p>
          O {SITE.name} é uma vitrine digital de advogados com cobertura em todo o Brasil. Reúne
          profissionais com inscrição ativa na OAB e organiza por cidade e especialidade, para que
          quem busca assessoria jurídica encontre rapidamente um nome confiável na sua região.
        </p>
        <p>
          Não somos intermediários. Não cobramos taxa sobre serviços, não fazemos leilão, não
          intermediamos a relação entre advogado e cliente. Funcionamos como diretório público — o
          contato é direto, por telefone, e-mail ou WhatsApp do próprio profissional.
        </p>
        <p>
          Para advogados, oferecemos visibilidade local sem fórmulas complicadas. O cadastro é
          gratuito e o plano premium garante posição de destaque na página da cidade, selo OAB verificada, foto em evidência e atuação em até 10 cidades. Tudo simples,
          tudo transparente, sem letras miúdas.
        </p>
        <p>
          Acreditamos que a advocacia brasileira merece uma vitrine profissional, limpa e funcional,
          sem complexidade desnecessária.
        </p>

        <h2 className="font-display text-2xl font-semibold text-brand-ink pt-4">
          Como conferimos quem entra no diretório
        </h2>
        <p>
          Todo perfil publicado informa o número de inscrição na OAB, que fica visível para
          qualquer visitante conferir no cadastro oficial da Ordem. Explicamos o passo a passo
          dessa conferência — e o que o selo &quot;OAB verificada&quot; significa — na página{" "}
          <Link
            href="/como-verificamos"
            className="text-brand-primary underline underline-offset-2 hover:text-brand-deep"
          >
            Como verificamos os cadastros
          </Link>
          .
        </p>

        <h2 className="font-display text-2xl font-semibold text-brand-ink pt-4">
          Quem responde pelo site
        </h2>
        <p>
          O {SITE.name} é mantido pela equipe {SITE.name}, responsável pela operação do site, pela
          conferência dos cadastros e pelo atendimento aos visitantes e advogados.
          {/* TODO: quando houver CNPJ/razão social formalizada, incluir aqui:
              "operado por [RAZÃO SOCIAL], CNPJ [XX.XXX.XXX/XXXX-XX]".
              Não inventar — dado não consta no código/config do projeto. */}
        </p>
        <p>
          Fale com a gente pela{" "}
          <Link
            href="/contato"
            className="text-brand-primary underline underline-offset-2 hover:text-brand-deep"
          >
            página de contato
          </Link>{" "}
          ou pelo e-mail{" "}
          <a
            href={`mailto:${SITE.email}`}
            className="text-brand-primary underline underline-offset-2 hover:text-brand-deep"
          >
            {SITE.email}
          </a>
          . Respondemos dúvidas, pedidos de correção de dados e reportes sobre perfis.
        </p>
      </div>
    </div>
  );
}
