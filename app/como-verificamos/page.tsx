import Link from "next/link";
import { ShieldCheck, Search, BadgeCheck, Scale, Flag } from "lucide-react";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/config";

export const metadata = buildMetadata({
  title: "Como verificamos os cadastros",
  description:
    "Entenda como o AdvAqui confere os cadastros de advogados: número de OAB informado em todo perfil, conferência aberta no CNA (cna.oab.org.br) e o que significa o selo OAB verificada.",
  path: "/como-verificamos"
});

/**
 * Página E-E-A-T: explica em linguagem leiga a metodologia de verificação
 * dos cadastros. Conteúdo estático — SSG por padrão (sem fetch dinâmico).
 */
export default function ComoVerificamosPage() {
  return (
    <div className="container-narrow py-12">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Como verificamos os cadastros", url: "/como-verificamos" }
        ])}
      />

      <h1 className="font-display text-4xl font-bold text-brand-ink">
        Como verificamos os cadastros
      </h1>
      <p className="mt-4 text-lg text-brand-ink/85 leading-relaxed max-w-2xl">
        O {SITE.name} é um diretório de advogados. Antes de confiar em qualquer
        diretório, você tem o direito de saber como os perfis chegam até ele.
        Esta página explica, sem juridiquês, o que conferimos, o que você mesmo
        pode conferir e o que o site não faz.
      </p>

      <div className="mt-10 space-y-8">
        <section className="rounded-2xl border border-brand-line bg-white p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-brand-accentText shrink-0 mt-1" aria-hidden />
            <div>
              <h2 className="font-display text-2xl font-semibold text-brand-ink">
                Todo advogado listado informa o número de OAB
              </h2>
              <p className="mt-3 text-brand-ink/85 leading-relaxed">
                Para constar no diretório, o profissional precisa informar sua
                inscrição na OAB — a Ordem dos Advogados do Brasil, órgão que
                autoriza o exercício da advocacia no país. Esse número aparece
                no perfil público, no formato &quot;OAB/UF&quot; seguido da
                numeração (por exemplo, OAB/MG 123.456). Sem ele, o cadastro
                não é publicado.
              </p>
              <p className="mt-3 text-brand-ink/85 leading-relaxed">
                Exibir o número da OAB no perfil não é detalhe: é o que permite
                que qualquer pessoa confira a situação do profissional na fonte
                oficial, descrita a seguir.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-brand-line bg-white p-6">
          <div className="flex items-start gap-3">
            <Search className="w-6 h-6 text-brand-accentText shrink-0 mt-1" aria-hidden />
            <div>
              <h2 className="font-display text-2xl font-semibold text-brand-ink">
                Você mesmo pode conferir no CNA, o cadastro oficial da OAB
              </h2>
              <p className="mt-3 text-brand-ink/85 leading-relaxed">
                O Conselho Federal da OAB mantém o Cadastro Nacional dos
                Advogados (CNA), uma consulta pública e gratuita disponível em{" "}
                <a
                  href="https://cna.oab.org.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-primary underline underline-offset-2 hover:text-brand-deep"
                >
                  cna.oab.org.br
                </a>
                . Basta digitar o nome do advogado ou o número de inscrição e
                verificar se a situação aparece como regular.
              </p>
              <ol className="mt-4 space-y-2 text-brand-ink/85 leading-relaxed list-decimal pl-5">
                <li>Acesse cna.oab.org.br no navegador.</li>
                <li>Digite o nome completo ou o número da OAB que aparece no perfil.</li>
                <li>Confira se o nome, a seccional (o estado) e a foto correspondem.</li>
                <li>Verifique se a inscrição consta como ativa e regular.</li>
              </ol>
              <p className="mt-4 text-brand-ink/85 leading-relaxed">
                Recomendamos essa conferência antes de assinar contrato ou fazer
                qualquer pagamento — a quem quer que seja, dentro ou fora do{" "}
                {SITE.name}. Um profissional sério não se incomoda com a
                verificação.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-brand-line bg-white p-6">
          <div className="flex items-start gap-3">
            <BadgeCheck className="w-6 h-6 text-brand-accentText shrink-0 mt-1" aria-hidden />
            <div>
              <h2 className="font-display text-2xl font-semibold text-brand-ink">
                O que significa o selo &quot;OAB verificada&quot;
              </h2>
              <p className="mt-3 text-brand-ink/85 leading-relaxed">
                Alguns perfis exibem o selo &quot;OAB verificada&quot;. Ele
                indica que a nossa equipe conferiu manualmente o número de
                inscrição informado no cadastro contra o registro público da
                OAB, confirmando que o número existe e corresponde ao nome do
                profissional na data da conferência.
              </p>
              <p className="mt-3 text-brand-ink/85 leading-relaxed">
                O selo não substitui a sua própria consulta ao CNA. A situação
                de uma inscrição pode mudar depois da nossa conferência, por
                isso o número da OAB fica sempre visível no perfil — para que a
                checagem na fonte oficial esteja ao alcance de qualquer
                visitante, a qualquer momento.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-brand-line bg-white p-6">
          <div className="flex items-start gap-3">
            <Scale className="w-6 h-6 text-brand-accentText shrink-0 mt-1" aria-hidden />
            <div>
              <h2 className="font-display text-2xl font-semibold text-brand-ink">
                O {SITE.name} é um diretório — não intermedia nem garante
              </h2>
              <p className="mt-3 text-brand-ink/85 leading-relaxed">
                Funcionamos como uma vitrine: organizamos perfis por cidade e
                área de atuação para facilitar o encontro entre quem precisa de
                um advogado e quem advoga. O contato acontece diretamente com o
                profissional, pelos canais que ele mesmo informou — telefone,
                e-mail ou WhatsApp.
              </p>
              <ul className="mt-4 space-y-2 text-brand-ink/85 leading-relaxed list-disc pl-5">
                <li>Não intermediamos a contratação nem participamos dos honorários.</li>
                <li>Não somos parte da relação entre advogado e cliente.</li>
                <li>
                  Não avaliamos a qualidade do trabalho jurídico de cada
                  profissional — a verificação descrita aqui se refere à
                  inscrição na OAB, não ao desempenho em processos.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-brand-line bg-white p-6">
          <div className="flex items-start gap-3">
            <Flag className="w-6 h-6 text-brand-accentText shrink-0 mt-1" aria-hidden />
            <div>
              <h2 className="font-display text-2xl font-semibold text-brand-ink">
                Encontrou algo errado? Reporte o perfil
              </h2>
              <p className="mt-3 text-brand-ink/85 leading-relaxed">
                Se você identificou um perfil com dados incorretos, número de
                OAB que não confere no CNA ou qualquer indício de irregularidade,
                avise a nossa equipe. Analisamos todos os reportes e, quando a
                inconsistência se confirma, corrigimos ou retiramos o cadastro
                do ar.
              </p>
              <p className="mt-3 text-brand-ink/85 leading-relaxed">
                Use a{" "}
                <Link
                  href="/contato"
                  className="text-brand-primary underline underline-offset-2 hover:text-brand-deep"
                >
                  página de contato
                </Link>{" "}
                ou escreva para{" "}
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-brand-primary underline underline-offset-2 hover:text-brand-deep"
                >
                  {SITE.email}
                </a>
                , informando o link do perfil e o que você encontrou.
              </p>
            </div>
          </div>
        </section>
      </div>

      <p className="mt-10 text-sm text-brand-ink/70 leading-relaxed">
        Quer saber mais sobre quem está por trás do site? Veja a página{" "}
        <Link
          href="/sobre"
          className="text-brand-primary underline underline-offset-2 hover:text-brand-deep"
        >
          Sobre o {SITE.name}
        </Link>
        .
      </p>
    </div>
  );
}
