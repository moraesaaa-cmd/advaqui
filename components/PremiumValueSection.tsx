import Link from "next/link";
import {
  TrendingUp,
  MapPin,
  ShieldCheck,
  MessageCircle,
  Star,
  Zap,
  Clock,
  X,
  type LucideIcon
} from "lucide-react";
import { PLAN } from "@/lib/config";
import { formatCurrency } from "@/lib/utils/format";

/**
 * Seção "Por que vale pagar pelo premium" — usada na home e em /planos.
 *
 * Comunica valor concreto, não abstrato:
 *   - Posicionamento (topo da lista da cidade)
 *   - Contato direto (WhatsApp + telefone)
 *   - Selo de OAB verificada
 *   - Bio livre 500 chars + cidades extras
 *   - Sem fidelidade, controle total
 *
 * Fontes visuais:
 *   - Mock de card grátis vs premium lado a lado
 *   - "X reais por dia" pra contextualizar o preço
 *   - Comparativo objetivo
 */
export function PremiumValueSection() {
  const dailyCost = (PLAN.price / 30).toFixed(2).replace(".", ",");

  return (
    <section className="container-tight py-16">
      <header className="text-center mb-10 max-w-2xl mx-auto">
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

      {/* Comparativo visual — card grátis vs premium */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
        <div className="rounded-2xl border-2 border-dashed border-brand-line p-5 bg-white">
          <p className="text-xs uppercase tracking-wider text-brand-ink/50 font-semibold mb-3 inline-flex items-center gap-1.5">
            <X className="w-3.5 h-3.5" aria-hidden /> Cadastro gratuito
          </p>
          <div className="rounded-xl border border-brand-line p-4 bg-brand-bg/50">
            <p className="font-semibold text-brand-ink/80">Dr. Exemplo Silva</p>
            <p className="text-xs text-brand-ink/60 mt-1">OAB/MG 123.456</p>
            <p className="text-xs text-brand-ink/60 mt-3 flex items-center gap-1">
              <MapPin className="w-3 h-3" aria-hidden /> Belo Horizonte/MG
            </p>
          </div>
          <ul className="mt-4 space-y-1.5 text-xs text-brand-ink/65">
            <li className="flex items-start gap-1.5">
              <span className="text-brand-ink/30 mt-0.5">▢</span> Aparece a partir da posição 15+ na cidade
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-brand-ink/30 mt-0.5">▢</span> Sem botão de WhatsApp clicável
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-brand-ink/30 mt-0.5">▢</span> Sem selo de OAB verificada
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-brand-ink/30 mt-0.5">▢</span> Sem bio expandida
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border-2 border-brand-accent shadow-cardHover ring-2 ring-brand-accent/30 p-5 bg-white relative">
          <div
            aria-hidden
            className="absolute -top-px left-4 right-4 h-1 bg-gradient-to-r from-brand-accent2 via-brand-accent to-brand-accent2 rounded-b"
          />
          <p className="text-xs uppercase tracking-wider font-semibold mb-3 inline-flex items-center gap-1.5 text-brand-accent2">
            <Star className="w-3.5 h-3.5 fill-brand-accent text-brand-accent" aria-hidden /> Plano Premium
          </p>
          <div className="rounded-xl border-2 border-brand-accent p-4 bg-white">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <p className="font-display font-bold text-brand-deep text-lg">
                Dr. Exemplo Silva
              </p>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-brand-accent text-brand-ink">
                <Star className="w-3 h-3" aria-hidden /> Destaque
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-2.5 h-2.5" aria-hidden /> OAB verificada
              </span>
            </div>
            <p className="text-xs text-brand-ink/70">OAB/MG 123.456</p>
            <p className="text-xs text-brand-ink/70 mt-2 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-brand-ink/40" aria-hidden /> Av. Afonso Pena, 1500 — Belo Horizonte/MG
            </p>
            <div className="mt-3 inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-600 text-white text-[10px] font-semibold">
              <MessageCircle className="w-3 h-3" aria-hidden /> WhatsApp
            </div>
          </div>
          <ul className="mt-4 space-y-1.5 text-xs text-brand-ink/85">
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-600 font-bold mt-0.5">✓</span>
              <strong>Topo da página</strong> da sua cidade
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-600 font-bold mt-0.5">✓</span>
              Botão <strong>WhatsApp direto</strong> com mensagem pronta
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-600 font-bold mt-0.5">✓</span>
              Selo de <strong>OAB verificada</strong> e moldura dourada
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-600 font-bold mt-0.5">✓</span>
              <strong>Bio até 500 chars</strong> e até 8 áreas de atuação
            </li>
          </ul>
        </div>
      </div>

      {/* 4 razões objetivas pra pagar */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
        <ValueCard
          Icon={TrendingUp}
          title="Mais visualizações"
          text="Perfis premium aparecem antes dos gratuitos em cada página de cidade — é o primeiro que o cliente vê."
        />
        <ValueCard
          Icon={MessageCircle}
          title="Contato direto"
          text="Botão WhatsApp clicável com mensagem pré-preenchida. Cliente fala com você em um clique, sem fricção."
        />
        <ValueCard
          Icon={ShieldCheck}
          title="Mais confiança"
          text="Selo de 'OAB verificada' visível em todos os locais — sinal claro de credibilidade para o cliente."
        />
        <ValueCard
          Icon={Zap}
          title="Sem fidelidade"
          text="Mensal, R$ 59,90 via Pix. Cancela quando quiser, sem multa, sem letra miúda, sem permanência."
        />
      </div>

      <div className="mt-10 max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 text-sm text-brand-ink/70 mb-4">
          <Clock className="w-4 h-4 text-brand-accent2" aria-hidden />
          Ativação em até {PLAN.activationHours}h após o Pix
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
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
