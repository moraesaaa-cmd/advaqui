import Link from "next/link";
import {
  TrendingUp,
  MapPin,
  ShieldCheck,
  MessageCircle,
  Star,
  Zap,
  Search,
  Users,
  Sparkles,
  type LucideIcon
} from "lucide-react";
import { PLAN } from "@/lib/config";
import { formatCurrency } from "@/lib/utils/format";

/**
 * Seção "Por que advogados escolhem o plano premium" — usada na home e em
 * /planos. Refeita em Maio/2026 (3ª iteração) por pedido do produto:
 * REMOVIDA a comparação grátis x premium dessa seção (continua na /planos).
 * Aqui o foco é PERSUASÃO — argumentos concretos de por que o premium
 * compensa: mais clientes, presença em buscas, ROI.
 */
export function PremiumValueSection() {
  const dailyCost = (PLAN.price / 30).toFixed(2).replace(".", ",");

  return (
    <section className="container-tight py-16">
      <header className="text-center mb-10 max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-accent/20 text-brand-deep border border-brand-accent/40 mb-4">
          <Star className="w-3.5 h-3.5 fill-brand-accent text-brand-accent" aria-hidden />
          Plano Premium
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-ink leading-tight">
          Por que advogados escolhem o plano premium
        </h2>
        <p className="text-brand-ink/65 mt-3 text-base md:text-lg">
          Pelo preço de um café por dia (R$ {dailyCost}), seu perfil aparece
          antes dos demais na sua cidade — e o cliente fala direto com você
          pelo WhatsApp.
        </p>
      </header>

      {/* Como funciona — 3 passos do funil de captação premium */}
      <div className="rounded-3xl bg-gradient-to-br from-brand-bg via-white to-brand-accent/5 border-2 border-brand-accent/30 p-6 md:p-10 mb-12 max-w-5xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-deep mb-2 text-center">
          Como o premium atrai mais clientes pra você
        </p>
        <h3 className="font-display text-xl md:text-2xl font-bold text-brand-ink text-center leading-tight mb-8 max-w-2xl mx-auto">
          Um cliente que precisa de advogado abre o Google. O AdvAqui aparece. Seu perfil é o primeiro.
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <FunnelStep
            n={1}
            Icon={Search}
            title="Pessoa pesquisa no Google"
            text="Buscas como “advogado trabalhista em São Paulo” ou “advogado de família em Belo Horizonte” mostram o AdvAqui nos primeiros resultados orgânicos."
          />
          <FunnelStep
            n={2}
            Icon={TrendingUp}
            title="Seu perfil premium aparece em 1º"
            text="Na página da sua cidade e nas páginas por especialidade, perfis premium ocupam o topo. Antes dos demais."
          />
          <FunnelStep
            n={3}
            Icon={MessageCircle}
            title="Cliente fala com você direto"
            text="Botão WhatsApp com mensagem pronta. Sem leilão, sem comissão, sem intermediário. O cliente é seu, do começo ao fim."
          />
        </div>
      </div>

      {/* Argumentos de ROI / mais clientes */}
      <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto mb-12">
        <div className="rounded-2xl border-2 border-brand-line bg-white p-6">
          <div className="flex items-start gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-emerald-700" aria-hidden />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-brand-ink">
                Mais mensagens, mais reuniões agendadas
              </h3>
            </div>
          </div>
          <p className="text-sm text-brand-ink/70 leading-relaxed">
            Perfis premium ficam no topo das páginas de cidade e nas buscas por
            especialidade. Quanto mais alto na lista, mais cliques recebe — e
            cada clique vira mensagem pelo WhatsApp ou ligação direta. O custo
            por novo cliente cai drasticamente quando você está em destaque.
          </p>
        </div>

        <div className="rounded-2xl border-2 border-brand-line bg-white p-6">
          <div className="flex items-start gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Search className="w-5 h-5 text-amber-800" aria-hidden />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-brand-ink">
                Presença em buscas de toda a região
              </h3>
            </div>
          </div>
          <p className="text-sm text-brand-ink/70 leading-relaxed">
            Atende em mais de uma cidade? Cadastre cidades adicionais e
            apareça nas buscas de cada uma delas — sem precisar manter perfis
            separados. Multiplica seu alcance com um único cadastro premium.
          </p>
        </div>

        <div className="rounded-2xl border-2 border-brand-line bg-white p-6">
          <div className="flex items-start gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-sky-700" aria-hidden />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-brand-ink">
                Confiança antes do primeiro contato
              </h3>
            </div>
          </div>
          <p className="text-sm text-brand-ink/70 leading-relaxed">
            Selos visíveis, foto destacada, bio completa, áreas de atuação,
            horários, redes sociais e site no seu perfil. O cliente decide
            contratar antes mesmo de ligar — e quem chega na primeira reunião
            já está decidido.
          </p>
        </div>

        <div className="rounded-2xl border-2 border-brand-line bg-white p-6">
          <div className="flex items-start gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-rose-700" aria-hidden />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-brand-ink">
                Sem leilão, sem comissão
              </h3>
            </div>
          </div>
          <p className="text-sm text-brand-ink/70 leading-relaxed">
            Outros marketplaces jurídicos cobram comissão sobre causas, leiloam
            seu perfil pra quem dá mais lance, ou intermediam o pagamento. Aqui
            não. Você paga mensalidade fixa e fica com 100% do que cobrar do
            cliente.
          </p>
        </div>
      </div>

      {/* 4 razões objetivas pra pagar */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
        <ValueCard
          Icon={TrendingUp}
          title="Topo da cidade"
          text="Perfis premium aparecem antes dos gratuitos em cada página de cidade — é o primeiro que o cliente vê."
        />
        <ValueCard
          Icon={MessageCircle}
          title="Contato direto"
          text="Botão WhatsApp clicável com mensagem pré-preenchida. Cliente fala com você em um clique, sem fricção."
        />
        <ValueCard
          Icon={MapPin}
          title="Cidades extras"
          text="Apareça nas buscas de até 10 cidades onde você atende, com um único cadastro premium."
        />
        <ValueCard
          Icon={Zap}
          title="Sem fidelidade"
          text="Mensal, R$ 59,90. Cancela quando quiser, sem multa, sem letra miúda, sem permanência."
        />
      </div>

      <div className="mt-10 max-w-2xl mx-auto">
        <div className="rounded-3xl border-2 border-brand-accent bg-gradient-to-br from-brand-accent/15 via-white to-brand-accent2/10 p-6 md:p-8 shadow-cardHover text-center">
          <h3 className="font-display text-xl md:text-2xl font-bold text-brand-ink leading-snug">
            Pronto pra aparecer no topo da sua cidade?
          </h3>
          <div className="mt-5 flex flex-wrap gap-3 justify-center">
            <Link href="/planos" className="btn-accent text-base">
              Quero o plano premium por {formatCurrency(PLAN.price)}/mês
            </Link>
            <Link href="/cadastro" className="btn-ghost text-base">
              Começar pelo cadastro grátis
            </Link>
          </div>
          <p className="text-xs text-brand-ink/55 mt-3">
            Você pode começar grátis e ativar o premium quando quiser.
          </p>
        </div>
      </div>
    </section>
  );
}

function ValueCard({
  Icon,
  title,
  text
}: {
  Icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-brand-line bg-white p-5 hover:shadow-cardHover transition">
      <div className="w-11 h-11 rounded-xl bg-brand-accent/15 flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-brand-accent2" aria-hidden />
      </div>
      <h3 className="font-display text-base font-bold text-brand-ink mb-1">
        {title}
      </h3>
      <p className="text-sm text-brand-ink/65 leading-relaxed">{text}</p>
    </div>
  );
}

function FunnelStep({
  n,
  Icon,
  title,
  text
}: {
  n: number;
  Icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="relative rounded-2xl bg-white border border-brand-line p-5">
      <span className="absolute -top-3 -left-3 w-9 h-9 rounded-full bg-brand-accent text-brand-ink text-base font-bold flex items-center justify-center shadow-card border-2 border-white">
        {n}
      </span>
      <div className="w-11 h-11 rounded-xl bg-brand-deep/10 flex items-center justify-center mb-3 mt-1">
        <Icon className="w-5 h-5 text-brand-deep" aria-hidden />
      </div>
      <h4 className="font-display text-base font-bold text-brand-ink mb-1.5 leading-snug">
        {title}
      </h4>
      <p className="text-sm text-brand-ink/65 leading-relaxed">{text}</p>
    </div>
  );
}
