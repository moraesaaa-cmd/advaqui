import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  UserPlus,
  Search,
  Globe,
  BadgeCheck,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { SITE } from "@/lib/config";

export const metadata: Metadata = {
  title:
    "Para advogados — apareça quando procuram um advogado na sua cidade",
  description:
    "Crie seu perfil no AdvAqui e apareça nas buscas por advogado na sua cidade e área de atuação. Contato direto com o cliente, sem comissão e sem leilão de leads.",
  alternates: { canonical: `${SITE.url}/para-advogados` },
  openGraph: {
    title: "Apareça quando procuram um advogado na sua cidade — AdvAqui",
    description:
      "Perfil profissional que aparece nas buscas da sua cidade e área. Contato direto, sem comissão.",
    url: `${SITE.url}/para-advogados`,
    type: "website"
  }
};

const DIFERENCIAIS = [
  "Sem comissão sobre os seus honorários",
  "Sem leilão de leads — o cliente fala direto com você",
  "Página por cidade E por área de atuação",
  "Seu contato (telefone e WhatsApp) visível para quem precisa",
  "Você cria, edita e pausa seu perfil quando quiser"
];

const FAQ = [
  {
    q: "É realmente gratuito criar o perfil?",
    a: "Sim. Você cria seu perfil profissional e aparece nas buscas sem pagar nada ao AdvAqui. O plano de destaque é opcional, para quem quer aparecer no topo da sua cidade e área."
  },
  {
    q: "Como eu recebo os contatos dos clientes?",
    a: "Direto. O cliente vê seu telefone e WhatsApp no seu perfil e fala com você sem intermediário. Não há leilão de leads nem comissão sobre o que você cobrar."
  },
  {
    q: "Preciso ter OAB ativa?",
    a: "Sim. O AdvAqui é um diretório profissional de advogados, então o cadastro pede seu número de inscrição na OAB."
  },
  {
    q: "Quanto tempo leva para aparecer?",
    a: "O cadastro leva menos de um minuto. Depois de completar seu perfil, ele passa a aparecer na página da sua cidade e da sua área de atuação."
  }
];

export default function ParaAdvogadosPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-brand-ink via-brand-deep to-brand-primary text-white overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 50%, rgba(201,162,76,0.45) 0%, transparent 50%), radial-gradient(circle at 85% 25%, rgba(232,184,86,0.3) 0%, transparent 45%)"
          }}
        />
        <div className="relative container-tight py-16 md:py-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-brand-accent text-brand-ink mb-5">
              <Sparkles className="w-3.5 h-3.5" aria-hidden />
              Para advogados
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight text-balance">
              Apareça quando procuram um advogado na sua cidade
            </h1>
            <p className="mt-5 text-lg md:text-xl text-brand-bg/85 leading-relaxed max-w-2xl">
              Todo dia, pessoas pesquisam na internet por um advogado na sua
              cidade e na sua área. Tenha um perfil profissional que aparece
              nessas buscas — com contato direto, sem intermediário e sem
              comissão.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/cadastro"
                className="btn-accent inline-flex items-center gap-2 text-base"
              >
                <UserPlus className="w-5 h-5" aria-hidden />
                Criar meu perfil grátis
              </Link>
              <Link
                href="/planos"
                className="btn-ghost text-white border border-white/25 hover:bg-white/10 inline-flex items-center gap-2"
              >
                Ver o plano de destaque
              </Link>
            </div>
            <p className="mt-5 text-sm text-brand-bg/70 flex flex-wrap items-center gap-x-5 gap-y-1.5">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-accent" aria-hidden />
                Sem comissão
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-accent" aria-hidden />
                Contato direto com o cliente
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-accent" aria-hidden />
                Cancele quando quiser
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Por que ter um perfil */}
      <section className="container-tight py-16">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
            Por que ter um perfil no AdvAqui
          </h2>
          <p className="text-brand-ink/65 mt-3 text-base md:text-lg">
            Quem precisa de um advogado começa pesquisando online. O AdvAqui
            coloca você no caminho dessa pessoa.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              Icon: MapPin,
              title: "Seja encontrado na sua cidade",
              text: "Seu perfil aparece nas páginas da sua cidade e da sua área de atuação — exatamente onde a pessoa procura."
            },
            {
              Icon: MessageCircle,
              title: "Contato direto, sem intermediário",
              text: "O cliente vê seu telefone e WhatsApp e fala com você na hora. Sem leilão de leads, sem comissão sobre seus honorários."
            },
            {
              Icon: Globe,
              title: "Sua presença profissional",
              text: "Você ganha uma página profissional própria, com suas áreas e contatos, para usar e compartilhar onde quiser."
            }
          ].map(({ Icon, title, text }, i) => (
            <div key={i} className="card">
              <div className="w-12 h-12 rounded-xl bg-brand-accent/15 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-brand-accent2" aria-hidden />
              </div>
              <h3 className="font-display text-xl font-bold text-brand-ink mb-1">
                {title}
              </h3>
              <p className="text-sm text-brand-ink/70 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Como funciona */}
      <section className="bg-white border-y border-brand-line py-16">
        <div className="container-tight">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              Como funciona — leva menos de 1 minuto
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                n: "1",
                Icon: UserPlus,
                title: "Crie seu perfil",
                text: "Informe nome, número da OAB, cidade e suas áreas de atuação. Rápido e sem burocracia."
              },
              {
                n: "2",
                Icon: BadgeCheck,
                title: "Complete com foto e contatos",
                text: "Adicione sua foto, telefone, WhatsApp e um resumo. Perfis completos passam mais confiança."
              },
              {
                n: "3",
                Icon: Search,
                title: "Apareça nas buscas",
                text: "Seu perfil entra na página da sua cidade e da sua área, pronto para ser encontrado."
              }
            ].map(({ n, Icon, title, text }) => (
              <div
                key={n}
                className="relative rounded-2xl border border-brand-line bg-brand-bg/40 p-6"
              >
                <span className="absolute -top-3 -left-3 w-9 h-9 rounded-full bg-brand-deep text-white font-bold flex items-center justify-center text-sm shadow">
                  {n}
                </span>
                <Icon className="w-7 h-7 text-brand-deep mb-3" aria-hidden />
                <h3 className="font-display text-lg font-bold text-brand-ink mb-1">
                  {title}
                </h3>
                <p className="text-sm text-brand-ink/70 leading-relaxed">
                  {text}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/cadastro"
              className="btn-accent inline-flex items-center gap-2"
            >
              Criar meu perfil grátis
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* Grátis vs Destaque */}
      <section className="container-tight py-16">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
            Comece grátis. Destaque quando quiser.
          </h2>
          <p className="text-brand-ink/65 mt-3">
            Você não precisa pagar para aparecer. O destaque é opcional, para
            quem quer ficar à frente na própria cidade.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="rounded-2xl border-2 border-brand-line bg-white p-6">
            <h3 className="font-display text-xl font-bold text-brand-ink">
              Perfil gratuito
            </h3>
            <ul className="mt-4 space-y-2.5">
              {[
                "Aparece nas buscas da sua cidade e área",
                "Telefone e WhatsApp visíveis",
                "Página profissional própria",
                "Edite e atualize quando quiser"
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-brand-ink/80">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 flex-shrink-0" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
            <Link
              href="/cadastro"
              className="btn-primary w-full justify-center inline-flex items-center gap-2 mt-6"
            >
              Criar perfil grátis
            </Link>
          </div>
          <div className="rounded-2xl border-2 border-brand-accent bg-gradient-to-br from-brand-accent/10 via-white to-brand-accent2/5 p-6 shadow-card relative">
            <span className="absolute -top-3 left-6 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-brand-accent text-brand-ink">
              Destaque
            </span>
            <h3 className="font-display text-xl font-bold text-brand-ink mt-1">
              Perfil em destaque
            </h3>
            <ul className="mt-4 space-y-2.5">
              {[
                "Tudo do perfil gratuito",
                "Aparece no topo da sua cidade e área",
                "Selo de destaque no seu perfil",
                "Mais visibilidade para quem está procurando"
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-brand-ink/80">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-brand-accent2 flex-shrink-0" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
            <Link
              href="/planos"
              className="btn-accent w-full justify-center inline-flex items-center gap-2 mt-6"
            >
              Ver como funciona o destaque
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="bg-brand-bg py-16">
        <div className="container-tight max-w-3xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-ink text-center mb-8">
            O que nos diferencia
          </h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {DIFERENCIAIS.map((d) => (
              <li
                key={d}
                className="flex items-start gap-2.5 rounded-xl bg-white border border-brand-line p-4"
              >
                <ShieldCheck className="w-5 h-5 text-brand-deep flex-shrink-0 mt-0.5" aria-hidden />
                <span className="text-sm text-brand-ink/85 leading-snug">{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-tight py-16 max-w-3xl">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-ink text-center mb-8">
          Perguntas frequentes
        </h2>
        <div className="space-y-3">
          {FAQ.map((f) => (
            <details
              key={f.q}
              className="group rounded-xl border border-brand-line bg-white p-4"
            >
              <summary className="cursor-pointer list-none flex items-center justify-between gap-3 font-semibold text-brand-ink">
                {f.q}
                <span className="text-brand-accent2 group-open:rotate-45 transition text-xl leading-none">
                  +
                </span>
              </summary>
              <p className="mt-2 text-sm text-brand-ink/75 leading-relaxed">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="container-tight pb-16">
        <div className="rounded-3xl bg-gradient-to-br from-brand-ink to-brand-deep text-white p-8 md:p-12 text-center relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-1/3 left-1/2 -translate-x-1/2 w-2/3 aspect-square rounded-full bg-brand-accent/20 blur-3xl"
          />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight">
              Crie seu perfil agora e comece a aparecer
            </h2>
            <p className="text-brand-bg/85 mt-3 text-base md:text-lg max-w-xl mx-auto">
              Leva menos de um minuto e não custa nada para começar.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 justify-center">
              <Link
                href="/cadastro"
                className="btn-accent inline-flex items-center gap-2 text-base"
              >
                <UserPlus className="w-5 h-5" aria-hidden />
                Criar meu perfil grátis
              </Link>
              <Link
                href="/exemplo-perfil-premium"
                className="btn-ghost text-white border border-white/25 hover:bg-white/10 inline-flex items-center gap-2"
              >
                Ver um perfil de exemplo
              </Link>
            </div>
            <p className="text-xs text-brand-bg/60 mt-6 max-w-lg mx-auto leading-relaxed">
              O AdvAqui é um diretório profissional. A divulgação respeita as
              regras de publicidade da advocacia — sem promessa de resultado e
              sem captação indevida de clientela.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
