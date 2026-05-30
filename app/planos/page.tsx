import Link from "next/link";
import {
  Check,
  X,
  Star,
  ShieldCheck,
  TrendingUp,
  MessageCircle,
  Camera,
  Clock,
  Globe,
  MapPin,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Search,
  type LucideIcon
} from "lucide-react";
import { PLAN } from "@/lib/config";
import { formatCurrency } from "@/lib/utils/format";
import { buildMetadata } from "@/lib/seo/metadata";
import { PlanosCTAFree, PlanosCTAPremium } from "@/components/PlanosCTAs";
import { PerfilAntesDepois } from "@/components/PerfilAntesDepois";

export const metadata = buildMetadata({
  title: "Planos — apareça primeiro na sua cidade",
  description:
    "Plano premium do AdvAqui por R$ 59,90/mês. Apareça no topo das buscas da sua cidade, WhatsApp clicável, foto destacada, OAB verificada. Sem fidelidade.",
  path: "/planos"
});

const COMPARISON: Array<{
  group: string;
  rows: Array<{ feature: string; free: boolean | string; premium: boolean | string }>;
}> = [
  {
    group: "Visibilidade",
    rows: [
      { feature: "Perfil no diretório por cidade", free: true, premium: true },
      { feature: "Posição na página da cidade", free: "Após os premium", premium: "TOPO" },
      { feature: "Tamanho do card no diretório", free: "Padrão", premium: "Ampliado + faixa dourada" },
      { feature: "Aparecer em buscas por especialidade", free: true, premium: true },
      { feature: "Cidades adicionais de atuação", free: "0", premium: "Até 9" },
      { feature: "Selo de OAB verificada", free: false, premium: true },
      { feature: "Selo de Destaque dourado", free: false, premium: true }
    ]
  },
  {
    group: "Perfil e identidade",
    rows: [
      { feature: "Foto de perfil", free: true, premium: true },
      { feature: "Nome, OAB, cidade", free: true, premium: true },
      { feature: "Bio profissional", free: "200 chars", premium: "500 chars destacada" },
      { feature: "Áreas de atuação listadas", free: "Até 5", premium: "Até 8" },
      { feature: "Endereço profissional completo", free: "Parcial", premium: "Completo + mapa" },
      { feature: "Horários de atendimento", free: false, premium: true }
    ]
  },
  {
    group: "Canais de contato",
    rows: [
      { feature: "Telefone clicável (tel:)", free: true, premium: true },
      { feature: "Botão WhatsApp clicável (wa.me)", free: false, premium: "Com mensagem pronta" },
      { feature: "E-mail visível no perfil", free: false, premium: true },
      { feature: "Link para site profissional", free: false, premium: true },
      { feature: "Link para Instagram", free: false, premium: true },
      { feature: "Link para LinkedIn", free: false, premium: true }
    ]
  },
  {
    group: "Administração",
    rows: [
      { feature: "Painel pra editar perfil", free: true, premium: true },
      { feature: "Suporte por mensagem", free: "Resposta em 7 dias", premium: "Resposta em 48h" },
      { feature: "Fidelidade", free: "Sem", premium: "Sem (cancela quando quiser)" }
    ]
  }
];

const renderCell = (value: boolean | string, kind: "free" | "premium") => {
  if (value === true) {
    return (
      <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium text-sm">
        <Check className="w-4 h-4 flex-shrink-0" aria-hidden />
        Sim
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex items-center gap-1.5 text-brand-ink/40 text-sm">
        <X className="w-4 h-4 flex-shrink-0" aria-hidden />
        Não
      </span>
    );
  }
  // string
  return (
    <span className={`text-sm font-medium ${kind === "premium" ? "text-brand-deep" : "text-brand-ink/75"}`}>
      {value}
    </span>
  );
};

export default function PlanosPage() {
  const dailyCost = (PLAN.price / 30).toFixed(2).replace(".", ",");

  return (
    <>
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-brand-ink via-brand-deep to-brand-primary text-white overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(245,158,11,0.6) 0%, transparent 45%), radial-gradient(circle at 80% 70%, rgba(251,191,36,0.4) 0%, transparent 45%)"
          }}
        />
        <div className="relative container-tight py-14 md:py-20">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white">
                <Star className="w-3.5 h-3.5 fill-current" aria-hidden />
                Planos AdvAqui
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-brand-accent text-brand-ink ring-2 ring-brand-accent2/70 shadow">
                ★ Cadastro grátis pra qualquer advogado
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight text-balance">
              Quando alguém procura advogado na sua cidade, você aparece ou desaparece?
            </h1>
            <p className="text-lg md:text-xl text-brand-bg/85 mt-5 leading-relaxed">
              O AdvAqui organiza buscas por cidade e especialidade. Enquanto outros
              advogados esperam indicação, você aparece onde o cliente procura — sem
              leilão, sem comissão, sem fidelidade.
            </p>
            <p className="mt-5 inline-flex items-start gap-2 text-sm md:text-base text-brand-bg/90 bg-white/10 rounded-xl px-4 py-2.5 border border-brand-accent/30">
              <ShieldCheck className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" aria-hidden />
              <span>
                <strong className="text-brand-accent">Teste o Premium por 7 dias.</strong>{" "}
                Se não fizer sentido para você, devolvemos seu dinheiro.
              </span>
            </p>
          </div>
        </div>
      </section>

      <div className="container-tight py-12">
        {/* PROBLEMA */}
        <section className="max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-red-100 text-red-800 border border-red-200 mb-3">
            <AlertCircle className="w-3.5 h-3.5" aria-hidden />
            O problema
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-ink leading-tight">
            Muitos advogados dependem apenas de indicação
          </h2>
          <p className="text-brand-ink/75 mt-3 text-base md:text-lg leading-relaxed">
            Quando alguém pesquisa <em>&ldquo;advogado em Belo Horizonte&rdquo;</em> no Google,
            o mapinha mostra 3 escritórios — quase nunca o seu. E mesmo no diretório local,
            só aparece quem investiu em presença digital. Resultado: o trabalho continua bom,
            mas o telefone toca menos do que deveria.
          </p>
        </section>

        {/* SOLUÇÃO */}
        <section className="max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-emerald-100 text-emerald-800 border border-emerald-200 mb-3">
            <Sparkles className="w-3.5 h-3.5" aria-hidden />
            A solução
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-ink leading-tight">
            O AdvAqui organiza sua presença em um diretório por cidade e especialidade
          </h2>
          <p className="text-brand-ink/75 mt-3 text-base md:text-lg leading-relaxed">
            Quando o cliente pesquisa &ldquo;advogado trabalhista em Belo Horizonte&rdquo;, sua ficha
            aparece organizada — nome, OAB, foto, áreas, contato direto. Sem leilão de lances,
            sem comissão sobre causa, sem intermediário. Você fala direto com quem te procurou.
          </p>
          <p className="text-brand-ink/75 mt-2 text-base md:text-lg leading-relaxed">
            O plano premium <strong>multiplica essa visibilidade</strong> — seu perfil sobe pro
            topo da cidade, ganha WhatsApp clicável, foto destacada e selo de OAB verificada.
          </p>
        </section>

        {/* BENEFÍCIOS */}
        <section className="mb-14">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-brand-accent text-brand-ink mb-3">
              <TrendingUp className="w-3.5 h-3.5" aria-hidden />
              O que muda com o premium
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-ink">
              Por {formatCurrency(PLAN.price)}/mês (R$ {dailyCost}/dia), você ganha:
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <BenefitCard
              Icon={TrendingUp}
              title="Topo da cidade"
              text="Seu perfil aparece em primeiro lugar quando alguém busca advogado na sua cidade ou especialidade."
            />
            <BenefitCard
              Icon={MessageCircle}
              title="WhatsApp clicável"
              text="Botão verde com mensagem pré-preenchida. Cliente fala com você em 1 clique, sem digitar."
            />
            <BenefitCard
              Icon={ShieldCheck}
              title="Selo OAB verificada"
              text="Sinal claro de credibilidade — após validação do nosso time. Mais confiança = mais contratação."
            />
            <BenefitCard
              Icon={Camera}
              title="Foto de destaque"
              text="Card maior, borda dourada, foto no destaque visual. Conversão de busca para clique sobe MUITO com foto."
            />
            <BenefitCard
              Icon={MapPin}
              title="+ 10 cidades adicionais"
              text="Atende em mais de uma comarca? Adicione cidades extras — apareça nas buscas de cada uma delas."
            />
            <BenefitCard
              Icon={Clock}
              title="Horários visíveis"
              text="Mostre quando você atende. Cliente não desiste por achar que você está fechado fora do comercial."
            />
            <BenefitCard
              Icon={Globe}
              title="Site, Insta, LinkedIn"
              text="Links pras suas redes e site profissional direto no perfil. Cliente conhece você antes de ligar."
            />
            <BenefitCard
              Icon={Sparkles}
              title="Sem fidelidade"
              text="Plano mensal. Cancela quando quiser, sem multa, sem letra miúda, sem permanência."
            />
          </div>
        </section>

        {/* DEMANDA — onde o cliente procura (sem números) */}
        <section className="mb-14 max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-brand-deep/10 text-brand-deep border border-brand-deep/20 mb-3">
              <Search className="w-3.5 h-3.5" aria-hidden />
              Onde está a demanda
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-ink leading-tight">
              Tem gente procurando advogado na sua cidade agora
            </h2>
            <p className="text-brand-ink/65 mt-3 text-base leading-relaxed">
              O AdvAqui cria uma página para cada cidade e cada especialidade. A
              pergunta não é se existe procura — é se vai ser o seu perfil a
              aparecer quando ela acontecer.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <DemandaCard
              Icon={Search}
              title="Áreas com mais procura"
              text="Trabalhista, família, consumidor, INSS e criminal estão entre as buscas mais frequentes do cidadão — e cada uma tem sua própria página por cidade no AdvAqui."
            />
            <DemandaCard
              Icon={TrendingUp}
              title="Espaço aberto no topo"
              text="Na maioria das cidades, a primeira posição ainda está livre. O premium ocupa esse lugar — antes que outro advogado da sua região ocupe."
            />
            <DemandaCard
              Icon={MessageCircle}
              title="O cliente chega pelo Google"
              text="Alguém pesquisa 'advogado trabalhista na minha cidade', encontra seu perfil organizado e fala com você pelo WhatsApp. Direto, sem intermediário."
            />
          </div>
        </section>

        {/* COMPARATIVO COM CONCORRENTES */}
        <section className="mb-14 max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-brand-accent/20 text-brand-deep border border-brand-accent/40 mb-3">
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden />
              Como nos comparamos
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-ink leading-tight">
              Marketplaces jurídicos no Brasil — comparação direta
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border-2 border-brand-line bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-brand-bg">
                  <th className="text-left p-3 md:p-4 font-display font-bold text-brand-ink">
                    Item
                  </th>
                  <th className="text-center p-3 md:p-4 font-display font-bold text-brand-deep">
                    AdvAqui
                  </th>
                  <th className="text-center p-3 md:p-4 font-display font-bold text-brand-ink/70">
                    Concorrente A
                  </th>
                  <th className="text-center p-3 md:p-4 font-display font-bold text-brand-ink/70">
                    Concorrente B
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-line">
                <CompareRow
                  label="Mensalidade premium"
                  advaqui={formatCurrency(PLAN.price)}
                  a="R$ 59 a R$ 199"
                  b="R$ 90 a R$ 250"
                />
                <CompareRow
                  label="Comissão sobre causas"
                  advaqui="Zero"
                  a="Em alguns planos"
                  b="Em alguns planos"
                />
                <CompareRow
                  label="Leilão de leads"
                  advaqui="Não"
                  a="Sim, paga por lance"
                  b="Sim, paga por lance"
                />
                <CompareRow
                  label="Fidelidade mínima"
                  advaqui="Sem (cancela quando quiser)"
                  a="Anual"
                  b="6 meses"
                />
                <CompareRow
                  label="Pagamento"
                  advaqui="Pix mensal"
                  a="Cartão recorrente"
                  b="Cartão recorrente"
                />
                <CompareRow
                  label="Páginas por especialidade e cidade"
                  advaqui="Sim, por todo o Brasil"
                  a="Limitado"
                  b="Limitado"
                />
                <CompareRow
                  label="Botão WhatsApp clicável"
                  advaqui="Sim, com mensagem pronta"
                  a="Depende do plano"
                  b="Depende do plano"
                />
              </tbody>
            </table>
          </div>

          <p className="text-xs text-brand-ink/55 italic mt-3">
            Comparação baseada em informações públicas dos sites concorrentes
            (Maio/2026). Valores e condições podem mudar — confira sempre na
            página oficial antes de decidir.
          </p>
        </section>

        {/* GARANTIAS */}
        <section className="mb-14 max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-brand-deep/5 via-white to-brand-accent/5 border-2 border-brand-accent/30 p-6 md:p-10">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-emerald-100 text-emerald-800 border border-emerald-200 mb-3">
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden />
              Sem letra miúda
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-ink leading-tight">
              Suas garantias no AdvAqui
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <GuaranteeCard
              title="Cancelamento livre"
              text="Você cancela quando quiser, no painel, sem precisar ligar pra ninguém. Não cobramos nada além daquele mês."
            />
            <GuaranteeCard
              title="Sem cobrança automática surpresa"
              text="Plano é Pix mensal. Você decide se quer renovar — não há débito automático no cartão."
            />
            <GuaranteeCard
              title="Saiu insatisfeito? Devolvemos"
              text="Se nos primeiros 7 dias depois da ativação seu plano não rendeu nada, devolvemos integralmente o valor pago. Basta pedir."
            />
            <GuaranteeCard
              title="Seus dados são seus"
              text="Pode exportar todos os contatos recebidos a qualquer momento. Excluir cadastro também é livre — sem perguntas."
            />
          </div>
        </section>

        {/* PROVA VIVA — antes/depois (ver, não ler) */}
        <section className="mb-14 max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-brand-accent/20 text-brand-deep border border-brand-accent/40 mb-3">
              <Sparkles className="w-3.5 h-3.5" aria-hidden />
              Veja a diferença
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-ink leading-tight">
              O mesmo advogado, no gratuito e no premium
            </h2>
            <p className="text-brand-ink/65 mt-3 text-base leading-relaxed">
              Não é pra ler — é pra ver. Olhe como o mesmo perfil aparece nos
              dois planos.
            </p>
          </div>
          <PerfilAntesDepois />
          <p className="text-center mt-5">
            <Link
              href="/exemplo-perfil-premium"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-deep hover:text-brand-accent2"
            >
              Ver a página de exemplo completa
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          </p>
        </section>

        {/* CARDS DE PLANO */}
        <section className="grid md:grid-cols-2 gap-6 mb-14 max-w-5xl mx-auto">
          {/* Gratuito */}
          <div className="rounded-2xl border-2 border-brand-line bg-white p-6 flex flex-col">
            <div className="mb-4">
              <h2 className="font-display text-2xl font-bold text-brand-ink">Cadastro gratuito</h2>
              <p className="text-3xl font-extrabold text-brand-deep mt-2">R$ 0</p>
              <p className="text-sm text-brand-ink/60">Sem cartão, sem cobrança, sempre</p>
            </div>
            <ul className="space-y-2.5 mb-6 flex-1 text-sm">
              <FreeItem text="Perfil listado no diretório da sua cidade" />
              <FreeItem text="Nome, OAB e cidade visíveis" />
              <FreeItem text="Foto de perfil" />
              <FreeItem text="Telefone clicável (tel:)" />
              <FreeItem text="Bio até 200 caracteres" />
              <FreeItem text="Até 5 áreas de atuação" />
              <FreeItem text="Aparece em buscas por especialidade" />
            </ul>
            <PlanosCTAFree />
          </div>

          {/* Premium */}
          <div className="rounded-2xl border-2 border-brand-accent bg-gradient-to-br from-brand-ink to-brand-deep text-white p-6 shadow-cardHover relative overflow-hidden flex flex-col">
            <div
              aria-hidden
              className="absolute -top-px left-6 right-6 h-1 bg-gradient-to-r from-brand-accent2 via-brand-accent to-brand-accent2 rounded-b"
            />
            <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-brand-accent text-brand-ink uppercase tracking-wide">
              Mais escolhido
            </span>
            <div className="mb-4">
              <h2 className="font-display text-2xl font-bold">Premium</h2>
              <p className="text-sm text-brand-bg/80 mt-1">
                Para advogados que querem mais presença dentro do AdvAqui.
              </p>
              <p className="text-3xl font-extrabold mt-3">
                {formatCurrency(PLAN.price)}
                <span className="text-base font-normal text-brand-bg/70">/mês</span>
              </p>
              <p className="text-sm text-brand-bg/70">
                R$ {dailyCost}/dia · Sem fidelidade
              </p>
              <div className="mt-3 rounded-lg bg-white/10 border border-brand-accent/40 px-3 py-2 text-xs text-brand-bg/90 flex items-start gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" aria-hidden />
                <span>
                  <strong className="text-brand-accent">Experimente por 7 dias.</strong>{" "}
                  Se não fizer sentido para você, seu dinheiro volta.
                </span>
              </div>
            </div>
            <ul className="space-y-2.5 mb-6 flex-1 text-sm">
              <PremiumItem text="Tudo do cadastro gratuito" />
              <PremiumItem text="Topo da página da sua cidade" />
              <PremiumItem text="Selo dourado de Destaque" />
              <PremiumItem text="Botão WhatsApp clicável" />
              <PremiumItem text="Selo OAB verificada" />
              <PremiumItem text="Card maior + foto destacada" />
              <PremiumItem text="Bio até 500 caracteres" />
              <PremiumItem text="+ de 10 áreas de atuação" />
              <PremiumItem text="Endereço completo + região" />
              <PremiumItem text="+ 10 cidades adicionais de atuação" />
              <PremiumItem text="Horários de atendimento visíveis" />
              <PremiumItem text="Link site + Instagram + LinkedIn" />
              <PremiumItem text="Suporte prioritário" />
            </ul>
            <PlanosCTAPremium />
          </div>
        </section>

        {/* COMPARAÇÃO COMPLETA */}
        <section className="mb-14">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-ink">
              Comparação completa, item por item
            </h2>
            <p className="text-brand-ink/65 mt-2">
              Nada escondido. Cada funcionalidade dos dois planos, lado a lado.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-brand-line bg-white">
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-brand-bg border-b border-brand-line">
                  <th className="text-left p-4 text-sm font-bold text-brand-ink uppercase tracking-wide">
                    Funcionalidade
                  </th>
                  <th className="text-center p-4 text-sm font-bold text-brand-ink/70 uppercase tracking-wide w-32">
                    Grátis
                  </th>
                  <th className="text-center p-4 text-sm font-bold uppercase tracking-wide w-32 bg-brand-accent/10 text-brand-deep border-l border-brand-line">
                    <span className="inline-flex items-center gap-1">
                      <Star className="w-4 h-4 text-brand-accent fill-brand-accent" aria-hidden />
                      Premium
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((group) => (
                  <>
                    <tr key={`g-${group.group}`} className="bg-brand-bg/40">
                      <td
                        colSpan={3}
                        className="px-4 py-2 text-xs font-bold text-brand-deep uppercase tracking-wider border-b border-brand-line"
                      >
                        {group.group}
                      </td>
                    </tr>
                    {group.rows.map((row, i) => (
                      <tr
                        key={`r-${group.group}-${i}`}
                        className="border-b border-brand-line/70 last:border-0 hover:bg-brand-bg/30"
                      >
                        <td className="p-4 text-sm text-brand-ink">{row.feature}</td>
                        <td className="text-center p-4">{renderCell(row.free, "free")}</td>
                        <td className="text-center p-4 bg-brand-accent/5 border-l border-brand-line">
                          {renderCell(row.premium, "premium")}
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="mb-14 rounded-3xl bg-gradient-to-br from-brand-deep to-brand-ink text-white p-8 md:p-12 relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-1/4 -right-1/4 w-1/2 aspect-square rounded-full bg-brand-accent/20 blur-3xl"
          />
          <div className="relative grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight">
                Não é mais uma assinatura. É um diferencial.
              </h2>
              <p className="text-brand-bg/85 mt-3 text-sm md:text-base leading-relaxed">
                Pelo preço de um café por dia, seu perfil aparece antes dos outros, com
                WhatsApp pronto, foto destacada e selo de verificação. O cliente já chega
                em você decidido — você só atende e fecha.
              </p>
              <p className="text-brand-bg/75 mt-2 text-xs">
                Sem fidelidade · Cancela quando quiser
              </p>
            </div>
            <div className="space-y-2">
              <Link
                href="/cadastro"
                className="btn-accent w-full justify-center inline-flex items-center gap-2"
              >
                Começar grátis agora
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
              <Link
                href="/login"
                className="btn-ghost text-white border border-white/20 hover:bg-white/10 w-full justify-center inline-flex items-center gap-2"
              >
                Já tenho conta — entrar
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}

function BenefitCard({
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
      <h3 className="font-display text-base font-bold text-brand-ink mb-1.5">{title}</h3>
      <p className="text-sm text-brand-ink/65 leading-relaxed">{text}</p>
    </div>
  );
}

function FreeItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-brand-ink/80">
      <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" aria-hidden />
      {text}
    </li>
  );
}

function PremiumItem({ text, highlight }: { text: string; highlight?: boolean }) {
  return (
    <li className={`flex items-start gap-2 ${highlight ? "text-white font-semibold" : "text-brand-bg/90"}`}>
      <Star className="w-4 h-4 text-brand-accent fill-brand-accent mt-0.5 flex-shrink-0" aria-hidden />
      {text}
    </li>
  );
}

function DemandaCard({
  Icon,
  title,
  text
}: {
  Icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border-2 border-brand-line bg-white p-5 hover:shadow-cardHover transition">
      <div className="w-11 h-11 rounded-xl bg-brand-accent/15 flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-brand-accent2" aria-hidden />
      </div>
      <h3 className="font-display text-base font-bold text-brand-ink mb-1.5">{title}</h3>
      <p className="text-sm text-brand-ink/70 leading-relaxed">{text}</p>
    </div>
  );
}

function CompareRow({
  label,
  advaqui,
  a,
  b
}: {
  label: string;
  advaqui: string;
  a: string;
  b: string;
}) {
  return (
    <tr className="hover:bg-brand-bg/30">
      <td className="p-3 md:p-4 text-brand-ink font-medium">{label}</td>
      <td className="p-3 md:p-4 text-center text-brand-deep font-semibold bg-brand-accent/5">
        {advaqui}
      </td>
      <td className="p-3 md:p-4 text-center text-brand-ink/70">{a}</td>
      <td className="p-3 md:p-4 text-center text-brand-ink/70">{b}</td>
    </tr>
  );
}

function GuaranteeCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-brand-line bg-white p-5">
      <h3 className="font-display text-base font-bold text-brand-ink mb-1.5 flex items-start gap-2">
        <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" aria-hidden />
        {title}
      </h3>
      <p className="text-sm text-brand-ink/65 leading-relaxed">{text}</p>
    </div>
  );
}

