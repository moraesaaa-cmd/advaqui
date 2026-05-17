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
          gratuito e o plano premium garante posição de destaque na página da cidade. Tudo simples,
          tudo transparente, sem letras miúdas.
        </p>
        <p>
          Acreditamos que a advocacia brasileira merece uma vitrine profissional, limpa e funcional,
          sem complexidade desnecessária.
        </p>
      </div>
    </div>
  );
}
