import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  MessageCircle,
  ShieldCheck,
  MapPin,
  Search
} from "lucide-react";
import { PerfilAntesDepois } from "@/components/PerfilAntesDepois";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Exemplo de perfil — veja o que muda no premium",
  description:
    "Veja, lado a lado, como fica o perfil de um advogado no AdvAqui no plano gratuito e no premium: topo da cidade, WhatsApp clicável, selo e foto em destaque.",
  path: "/exemplo-perfil-premium"
});

export default function ExemploPerfilPremiumPage() {
  return (
    <div className="container-tight py-12">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-brand-accent text-brand-ink mb-4">
          <Search className="w-3.5 h-3.5" aria-hidden />
          Exemplo real de perfil
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-ink leading-tight">
          Veja o que muda quando você está no topo
        </h1>
        <p className="text-brand-ink/70 mt-4 text-base md:text-lg leading-relaxed">
          O mesmo advogado, do mesmo jeito — mas um aparece depois de todos os
          outros, e o outro aparece primeiro, com foto, selo e WhatsApp num
          clique. Veja a diferença com seus próprios olhos.
        </p>
      </div>

      {/* Antes / depois visual */}
      <section className="max-w-4xl mx-auto mb-12">
        <PerfilAntesDepois />
        <p className="text-center text-xs text-brand-ink/45 mt-4">
          Perfil fictício, criado apenas para demonstração. Não representa
          pessoa real.
        </p>
      </section>

      {/* O que muda na prática */}
      <section className="max-w-4xl mx-auto mb-12">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-ink text-center mb-8">
          O que muda na prática
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <MudaCard
            Icon={TrendingUp}
            title="Mais cliques"
            text="Quem aparece primeiro recebe a maior parte dos cliques. O perfil premium fica no topo da página da sua cidade — é o primeiro que o cliente vê."
          />
          <MudaCard
            Icon={MessageCircle}
            title="Mais contato"
            text="Botão de WhatsApp com mensagem pronta. O cliente fala com você em um clique, sem digitar número, sem fricção. Card só com telefone converte muito menos."
          />
          <MudaCard
            Icon={ShieldCheck}
            title="Mais confiança"
            text="Selo de OAB verificada, foto em destaque e bio completa. O cliente decide te contratar antes mesmo de ligar — chega na primeira conversa já decidido."
          />
          <MudaCard
            Icon={MapPin}
            title="Mais visibilidade"
            text="Atende em mais de uma cidade? Apareça nas buscas de cada uma delas, com um único cadastro. Mais alcance, sem manter vários perfis."
          />
        </div>
      </section>

      {/* Por que compensa — demanda, sem números */}
      <section className="max-w-3xl mx-auto mb-12 rounded-3xl bg-brand-bg/50 border border-brand-line p-6 md:p-8">
        <h2 className="font-display text-xl md:text-2xl font-bold text-brand-ink leading-tight">
          Por que isso compensa
        </h2>
        <p className="text-brand-ink/75 mt-3 text-base leading-relaxed">
          Todos os dias pessoas pesquisam <em>&ldquo;advogado na minha
          cidade&rdquo;</em> no Google. O AdvAqui organiza essas buscas por
          cidade e por especialidade. Enquanto outros advogados esperam
          indicação, você aparece exatamente onde o cliente está procurando — e
          fala direto com ele, sem leilão, sem comissão, sem intermediário.
        </p>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto text-center">
        <Link
          href="/planos"
          className="btn-accent inline-flex items-center gap-2 text-base"
        >
          Quero meu perfil assim
          <ArrowRight className="w-4 h-4" aria-hidden />
        </Link>
        <p className="text-sm text-brand-ink/60 mt-4">
          Cadastro grátis pra qualquer advogado. Leva menos de 30 segundos.
        </p>
      </section>
    </div>
  );
}

function MudaCard({
  Icon,
  title,
  text
}: {
  Icon: typeof TrendingUp;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-brand-line bg-white p-5">
      <div className="w-11 h-11 rounded-xl bg-brand-accent/15 flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-brand-accent2" aria-hidden />
      </div>
      <h3 className="font-display text-lg font-bold text-brand-ink mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-brand-ink/70 leading-relaxed">{text}</p>
    </div>
  );
}
