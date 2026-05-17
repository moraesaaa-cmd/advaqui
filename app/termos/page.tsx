import { buildMetadata } from "@/lib/seo/metadata";
import { SITE } from "@/lib/config";

export const metadata = buildMetadata({
  title: "Termos de uso",
  description: `Termos de uso do ${SITE.name}.`,
  path: "/termos"
});

export default function TermosPage() {
  return (
    <div className="container-narrow py-12">
      <h1 className="font-display text-4xl font-bold text-brand-ink mb-6">Termos de uso</h1>
      <article className="prose max-w-none text-brand-ink/85 space-y-4 leading-relaxed">
        <p>
          <strong>1. Da plataforma.</strong> O {SITE.name} é um diretório público de advogados
          organizado por cidade e região. Não intermediamos, agenciamos ou participamos de qualquer
          relação entre advogado e cliente. A plataforma funciona exclusivamente como vitrine
          profissional, sem captação de clientela e sem honorários intermediados.
        </p>
        <p>
          <strong>2. Do cadastro.</strong> O cadastro é gratuito e destinado a profissionais com
          inscrição regular na Ordem dos Advogados do Brasil. Os dados informados são de inteira
          responsabilidade do usuário, que declara sua veracidade e se compromete a mantê-los
          atualizados.
        </p>
        <p>
          <strong>3. Do plano premium.</strong> O plano premium confere destaque ao perfil na página
          da cidade por período mensal. O pagamento é feito via Pix e a ativação ocorre manualmente
          em até 48 horas. Não há fidelidade ou renovação automática. O cancelamento pode ser
          solicitado a qualquer tempo, mantendo o destaque até o término do mês pago.
        </p>
        <p>
          <strong>4. Da responsabilidade.</strong> O {SITE.name} não se responsabiliza pela
          qualidade, licitude ou resultado dos serviços jurídicos prestados pelos advogados
          cadastrados. Toda contratação é de responsabilidade exclusiva das partes envolvidas, sem
          ingerência da plataforma.
        </p>
        <p>
          <strong>5. Da publicidade.</strong> Os advogados cadastrados se comprometem a respeitar as
          normas éticas de publicidade da Ordem dos Advogados do Brasil, especialmente o Provimento
          205/2021 do Conselho Federal. A plataforma reserva-se o direito de remover conteúdo que
          configure captação indevida de clientela.
        </p>
        <p>
          <strong>6. Da propriedade intelectual.</strong> Todo o conteúdo, layout, código e marca do{" "}
          {SITE.name} são protegidos por direitos autorais e não podem ser reproduzidos sem
          autorização prévia e por escrito.
        </p>
        <p>
          <strong>7. Das alterações.</strong> Estes termos podem ser alterados a qualquer tempo,
          com notificação aos usuários cadastrados. O uso continuado da plataforma após alteração
          implica aceitação dos novos termos.
        </p>
        <p className="text-sm text-brand-ink/60 mt-8">
          Última atualização — 17 de maio de 2026.
        </p>
      </article>
    </div>
  );
}
