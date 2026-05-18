import { Check, Star, Award, MapPin, Phone, ShieldCheck } from "lucide-react";
import { PLAN } from "@/lib/config";
import { formatCurrency } from "@/lib/utils/format";
import { buildMetadata } from "@/lib/seo/metadata";
import { PlanosCTAFree, PlanosCTAPremium } from "@/components/PlanosCTAs";

export const metadata = buildMetadata({
  title: "Planos",
  description:
    "Compare o cadastro gratuito e o plano premium do AdvAqui. R$ 59,90/mês via Pix, sem fidelidade, com destaque no diretório da sua cidade.",
  path: "/planos"
});

const FREE_FEATURES = [
  "Perfil listado no diretório da sua cidade",
  "Nome, OAB e cidade visíveis",
  "Aparece em buscas por especialidade",
  "Cadastro em 5 minutos",
  "Sem cobrança, para sempre"
];

const PREMIUM_FEATURES = [
  "Tudo do plano gratuito",
  "Perfil no topo da página da sua cidade",
  "Selo de destaque dourado",
  "Telefone e WhatsApp clicáveis visíveis",
  "Endereço profissional completo",
  "Bio livre (até 500 caracteres)",
  "Áreas de atuação com filtro avançado",
  "Selo de OAB verificada (após validação)",
  "Estatísticas básicas (visualizações)",
  "Sem fidelidade, cancelamento livre"
];

export default function PlanosPage() {
  return (
    <div className="container-narrow py-12">
      <header className="text-center mb-10">
        <h1 className="font-display text-4xl font-bold text-brand-ink">Escolha seu plano</h1>
        <p className="text-brand-ink/60 mt-2">
          Cadastro gratuito para qualquer advogado. Destaque premium para quem quer ser encontrado primeiro.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card flex flex-col">
          <div className="mb-4">
            <h2 className="font-display text-2xl font-bold text-brand-ink">Gratuito</h2>
            <p className="text-3xl font-extrabold text-brand-deep mt-2">R$ 0</p>
            <p className="text-sm text-brand-ink/60">Sem cartão, sem cobrança</p>
          </div>
          <ul className="space-y-2.5 mb-6 flex-1">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-brand-ink/80">
                <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" aria-hidden />
                {f}
              </li>
            ))}
          </ul>
          <PlanosCTAFree />
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-brand-ink to-brand-deep text-white p-6 shadow-cardHover relative overflow-hidden flex flex-col">
          <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-brand-accent text-brand-ink">
            Mais popular
          </span>
          <div className="mb-4">
            <h2 className="font-display text-2xl font-bold">Premium</h2>
            <p className="text-3xl font-extrabold mt-2">
              {formatCurrency(PLAN.price)}
              <span className="text-base font-normal text-brand-bg/70">/mês</span>
            </p>
            <p className="text-sm text-brand-bg/70">Pix manual. Sem fidelidade.</p>
          </div>
          <ul className="space-y-2.5 mb-6 flex-1">
            {PREMIUM_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-brand-bg/90">
                <Star className="w-4 h-4 text-brand-accent mt-0.5 flex-shrink-0" aria-hidden />
                {f}
              </li>
            ))}
          </ul>
          <PlanosCTAPremium />
        </div>
      </div>

      <section className="mt-12 rounded-2xl border border-brand-line bg-white p-6">
        <h3 className="font-display text-2xl font-bold text-brand-ink mb-4">
          O que muda na prática
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-dashed border-brand-line p-4">
            <p className="text-xs uppercase tracking-wider text-brand-ink/60 mb-2">Gratuito</p>
            <div className="rounded-xl border border-brand-line p-4 bg-brand-bg/40">
              <p className="font-semibold text-brand-ink">Dr. Exemplo Silva</p>
              <p className="text-xs text-brand-ink/60">OAB/MG 123.456</p>
              <p className="text-xs text-brand-ink/60 mt-2">Belo Horizonte/MG</p>
            </div>
            <p className="text-xs text-brand-ink/60 mt-3">
              Listagem simples, sem destaque, abaixo dos premium.
            </p>
          </div>

          <div className="rounded-xl border-2 border-brand-accent p-4 bg-brand-accent/5">
            <p className="text-xs uppercase tracking-wider text-brand-ink/60 mb-2 inline-flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-brand-accent" aria-hidden /> Premium
            </p>
            <div className="rounded-xl border border-brand-accent p-4 bg-white">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-display font-bold text-brand-ink text-lg">Dr. Exemplo Silva</p>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-brand-accent text-brand-ink">
                  <Star className="w-3 h-3" aria-hidden /> Destaque
                </span>
              </div>
              <p className="text-sm text-brand-ink/70">OAB/MG 123.456</p>
              <p className="text-sm text-brand-ink/70 mt-2 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-ink/40" aria-hidden /> Av. Afonso Pena, 1500
              </p>
              <p className="text-sm text-brand-ink/70 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-brand-ink/40" aria-hidden /> (31) 99999-0001
              </p>
              <p className="text-sm text-brand-ink/70 mt-2 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" aria-hidden /> OAB verificada
              </p>
            </div>
            <p className="text-xs text-brand-ink/70 mt-3">
              Topo da página, selo, contato completo, mais conversão.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-2xl bg-brand-bg border border-brand-line p-6">
        <h3 className="font-display text-xl font-bold text-brand-ink mb-3">Perguntas comuns</h3>
        <dl className="space-y-3 text-sm text-brand-ink/80">
          <div>
            <dt className="font-semibold text-brand-ink">Como pago?</dt>
            <dd className="mt-1">Apenas via Pix. A chave aparece na etapa de pagamento, após o cadastro.</dd>
          </div>
          <div>
            <dt className="font-semibold text-brand-ink">Tem fidelidade?</dt>
            <dd className="mt-1">Não. O plano é mensal e pode ser cancelado a qualquer momento.</dd>
          </div>
          <div>
            <dt className="font-semibold text-brand-ink">Quanto tempo para ativar?</dt>
            <dd className="mt-1">Até {PLAN.activationHours} horas após sinalização do pagamento.</dd>
          </div>
          <div>
            <dt className="font-semibold text-brand-ink">Funciona em qualquer cidade?</dt>
            <dd className="mt-1">Sim. Mesmo cidades pequenas. Se a sua não estiver listada, o cadastro cria automaticamente.</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
