import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { SeloSnippet } from "@/components/selo/SeloSnippet";
import {
  BadgeCheck,
  ArrowRight,
  Globe,
  Shield,
  TrendingUp
} from "lucide-react";

export const metadata = buildMetadata({
  title: "Selo AdvAqui — Perfil verificado",
  description:
    "Coloque o Selo AdvAqui no seu site e mostre aos clientes que seu registro na OAB foi conferido. Codigo HTML pronto, com link para o seu perfil.",
  path: "/selo"
});

const BENEFITS = [
  {
    Icon: Shield,
    title: "Registro conferido, à vista",
    text: "O selo diz um fato simples: seu perfil no AdvAqui passou pela conferência de registro na OAB. Quem visita o seu site vê isso antes de entrar em contato."
  },
  {
    Icon: TrendingUp,
    title: "Link para o seu perfil",
    text: "O selo aponta direto para a sua página no AdvAqui. Esse link ajuda os buscadores a entenderem que o seu site e o seu perfil falam do mesmo profissional."
  },
  {
    Icon: Globe,
    title: "Funciona em qualquer site",
    text: "O código é HTML puro com uma imagem leve. Cole em WordPress, Wix, blog ou landing page. Não precisa de plugin nem script."
  }
];

const STEPS = [
  {
    n: "1",
    title: "Entre na sua conta",
    text: "Faça login no AdvAqui (ou crie sua conta gratuita e complete o perfil)."
  },
  {
    n: "2",
    title: "Copie o código",
    text: "Nesta página, o código do selo já vem pronto, apontando para o seu perfil."
  },
  {
    n: "3",
    title: "Cole no seu site",
    text: "Rodapé, barra lateral ou página \"Sobre\" — onde seus clientes vão ver."
  }
];

export default function SeloPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-brand-ink text-white overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "none"
          }}
        />
        <div className="relative container-tight py-16 md:py-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-brand-accent text-brand-ink mb-5">
              <BadgeCheck className="w-3.5 h-3.5" aria-hidden />
              Selo AdvAqui
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight text-balance">
              Mostre no seu site que seu perfil foi verificado
            </h1>
            <p className="mt-5 text-lg md:text-xl text-brand-bg/85 leading-relaxed max-w-2xl">
              O Selo AdvAqui diz uma coisa concreta para quem visita seu site:
              seu registro foi conferido e seu perfil está ativo no AdvAqui. O
              código é gratuito e leva menos de um minuto para instalar.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#pegar-selo"
                className="btn-accent inline-flex items-center gap-2 text-base"
              >
                <BadgeCheck className="w-5 h-5" aria-hidden />
                Pegar meu selo
              </a>
              <Link
                href="/cadastro"
                className="btn-ghost text-white border border-white/25 hover:bg-white/10 inline-flex items-center gap-2"
              >
                Criar perfil grátis
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* O que é o selo (explicação leiga) */}
      <section className="container-tight py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              O que é o Selo AdvAqui
            </h2>
            <p className="text-brand-ink/70 mt-4 text-base md:text-lg leading-relaxed">
              É uma pequena imagem que o advogado coloca no próprio site. Ela
              informa que o perfil dele no AdvAqui existe, está ativo e teve o
              número de registro na OAB conferido. Quem clica no selo cai
              direto na página do advogado no AdvAqui, com foto, áreas de
              atuação e formas de contato.
            </p>
            <p className="text-brand-ink/70 mt-4 text-base md:text-lg leading-relaxed">
              Para quem procura um advogado, o selo é um atalho para conferir
              essas informações em uma fonte fora do site do próprio
              profissional.
            </p>
          </div>
          <div className="rounded-2xl border border-brand-line bg-white p-8 flex flex-col items-center gap-5">
            <p className="text-xs uppercase tracking-wider text-brand-ink/50 font-bold">
              Assim o selo aparece
            </p>
            <div className="p-6 bg-brand-bg rounded-xl flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/selo-advaqui.svg"
                alt="Perfil verificado no AdvAqui"
                width={196}
                height={67}
              />
            </div>
            <p className="text-sm text-brand-ink/60 text-center max-w-sm">
              Imagem leve, com fundo escuro e borda dourada. Fica legível sobre
              fundo claro ou escuro, a partir de 140 pixels de largura.
            </p>
          </div>
        </div>
      </section>

      {/* Gerador de snippet (logado) / CTA (deslogado) */}
      <section
        id="pegar-selo"
        className="bg-white border-y border-brand-line py-16"
      >
        <div className="container-tight max-w-3xl">
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              Pegue o código do seu selo
            </h2>
            <p className="text-brand-ink/65 mt-3">
              O código é gerado com o link do seu perfil — por isso pedimos que
              você esteja logado.
            </p>
          </div>
          <SeloSnippet />
        </div>
      </section>

      {/* Benefícios */}
      <section className="container-tight py-16">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
            Por que usar o selo
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {BENEFITS.map(({ Icon, title, text }) => (
            <div key={title} className="card">
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
      <section className="bg-brand-bg py-16">
        <div className="container-tight max-w-3xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-ink text-center mb-8">
            Como instalar em 3 passos
          </h2>
          <div className="space-y-4">
            {STEPS.map(({ n, title, text }) => (
              <div
                key={n}
                className="rounded-2xl border border-brand-line bg-white p-5 flex items-start gap-4"
              >
                <span className="w-9 h-9 rounded-full bg-brand-ink text-white font-display font-bold flex items-center justify-center flex-shrink-0">
                  {n}
                </span>
                <div>
                  <p className="font-semibold text-brand-ink">{title}</p>
                  <p className="text-sm text-brand-ink/70 mt-0.5 leading-relaxed">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-brand-ink/60 mt-6 leading-relaxed text-center">
            O selo informa que o perfil foi verificado no AdvAqui — ele não é
            um ranking nem uma recomendação.
          </p>
        </div>
      </section>

      {/* CTA final */}
      <section className="container-tight py-16">
        <div className="rounded-3xl bg-brand-ink text-white p-8 md:p-12 text-center relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-1/3 left-1/2 -translate-x-1/2 w-2/3 aspect-square hidden"
          />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight">
              Ainda não tem perfil no AdvAqui?
            </h2>
            <p className="text-brand-bg/85 mt-3 text-base md:text-lg max-w-xl mx-auto">
              Crie seu perfil gratuito, tenha sua página com foto, áreas de
              atuação e contato — e pegue seu selo em seguida.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 justify-center">
              <Link
                href="/cadastro"
                className="btn-accent inline-flex items-center gap-2 text-base"
              >
                <BadgeCheck className="w-5 h-5" aria-hidden />
                Criar perfil grátis
              </Link>
              <Link
                href="/login"
                className="btn-ghost text-white border border-white/25 hover:bg-white/10 inline-flex items-center gap-2"
              >
                Já tenho conta
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
