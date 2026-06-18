import Link from "next/link";
import type { Metadata } from "next";
import QRCode from "qrcode";
import { PLAN, SITE, PIX } from "@/lib/config";
import { buildPixPayload } from "@/lib/pix/qrcode";
import { LpPixCheckout } from "@/components/LpPixCheckout";

const CADASTRO = "/cadastro?origem=ads-premium";

export const metadata: Metadata = {
  title: { absolute: "Apareça para quem procura advogado na sua cidade | AdvAqui" },
  description:
    "Perfil Premium no AdvAqui: apareça quando alguém busca advogado na sua cidade e na sua área. Contato direto por WhatsApp, sem comissão e sem fidelidade. Ative por Pix.",
  robots: { index: false, follow: false },
  alternates: { canonical: SITE.url + "/lp/advogado-premium" },
  openGraph: {
    title: "Apareça para quem procura advogado na sua cidade",
    description: "Perfil Premium no AdvAqui. Contato direto, sem comissão. Ative por Pix.",
    url: SITE.url + "/lp/advogado-premium",
    siteName: SITE.name,
    locale: "pt_BR",
    type: "website"
  }
};

export const dynamic = "force-static";

const passos = [
  { n: "1", t: "Crie seu perfil", d: "Leva menos de 2 minutos: nome, OAB, cidade e áreas de atuação." },
  { n: "2", t: "Ative por Pix", d: "Mensalidade de " + PLAN.priceLabel + " via Pix. Sem fidelidade." },
  { n: "3", t: "Seja encontrado", d: "Seu perfil entra em destaque e os clientes falam direto com você." }
];

const beneficios = [
  {
    t: "Destaque no topo da sua cidade",
    d: "Quando alguém busca um advogado na sua cidade, seu perfil aparece em posição de destaque — antes de quem não investe em visibilidade."
  },
  {
    t: "Contato direto, sem comissão",
    d: "O cliente fala com você por WhatsApp, telefone ou e-mail. Você fica com 100% — o AdvAqui não cobra nada por cliente fechado."
  },
  {
    t: "Página profissional pronta",
    d: "Foto, OAB verificada, áreas de atuação e seus artigos. Uma vitrine que transmite confiança antes mesmo do primeiro contato."
  },
  {
    t: "Encontrado no Google",
    d: "Seu perfil é otimizado para aparecer quando buscam a sua área na sua região — trabalho que normalmente custa caro, já incluído."
  },
  {
    t: "Mais visibilidade, mais contatos",
    d: "Quanto mais você aparece para quem já está procurando um advogado, mais oportunidades reais de fechar — sem leilão, sem disputa de preço."
  },
  {
    t: "No controle, sem amarras",
    d: "Sem fidelidade e sem multa. Cancele quando quiser. Seu perfil, seus dados, sem letra miúda."
  }
];

const onde = [
  { t: "No Google", d: "Quando alguém pesquisa “advogado em [sua cidade]”." },
  { t: "Na busca por cidade", d: "Nas 5.571 cidades do Brasil cobertas pelo AdvAqui." },
  { t: "Na busca por área", d: "Trabalhista, família, criminal, previdenciário, cível e mais." },
  { t: "Direto no WhatsApp", d: "O cliente fala com você num clique, sem intermediário." }
];

const garantias = [
  "Comece de graça, ative quando quiser",
  "Sem fidelidade — cancele a qualquer momento",
  "OAB verificada no seu perfil",
  "0% de comissão sobre seus clientes"
];

const recursos = [
  "Destaque no topo da sua cidade e áreas",
  "Página profissional com foto e OAB verificada",
  "Contato direto por WhatsApp, telefone e e-mail",
  "Sem comissão por cliente",
  "Publique artigos e responda dúvidas",
  "Apareça também nas buscas do Google"
];

const faqs = [
  { q: "Quanto custa?", a: PLAN.priceLabel + " por mês, via Pix. Sem fidelidade: renove ou cancele quando quiser." },
  { q: "O AdvAqui cobra comissão por cliente?", a: "Não. O contato é direto entre você e o cliente. Você paga apenas a mensalidade." },
  { q: "Como recebo os clientes?", a: "Seu perfil mostra seu WhatsApp, telefone e e-mail. O cliente fala direto com você." },
  { q: "Preciso saber de tecnologia?", a: "Não. A página profissional é montada para você. Basta preencher seus dados." },
  { q: "Em quanto tempo apareço?", a: "Assim que o pagamento por Pix é confirmado, seu perfil entra em destaque." },
  { q: "Posso cancelar?", a: "A qualquer momento, sem multa e sem fidelidade." }
];

const depoimentos = [
  {
    perfil: "Advogada trabalhista",
    texto:
      "Quando alguém procura um advogado da minha área na minha cidade, meu perfil está lá para ser encontrado — não dependo mais só de indicação.",
  },
  {
    perfil: "Advogado de família",
    texto:
      "Meu WhatsApp fica no perfil e o cliente fala comigo direto, sem intermediário no meio do caminho.",
  },
  {
    perfil: "Advogada previdenciária",
    texto:
      "São 0% de comissão e a assinatura é fixa: fico com o honorário inteiro e sei exatamente quanto pago.",
  },
  {
    perfil: "Advogado cível",
    texto:
      "Ativei por Pix, sem cartão e sem fidelidade. Para quem não é da área de tecnologia, foi simples de colocar no ar.",
  },
];

export default async function LandingAdvogadoPremium() {
  const pixPayload = buildPixPayload();
  const qrDataUrl = await QRCode.toDataURL(pixPayload, { margin: 1, width: 320 });
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950" />
        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center">
          <span className="inline-block rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1 text-sm font-medium text-amber-300">
            Para advogados e advogadas
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Quando alguém procura advogado na sua cidade,{" "}
            <span className="text-amber-400">é o seu nome que aparece.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
            Todo dia, milhares de pessoas buscam um advogado perto delas. Com o Perfil Premium do
            AdvAqui, você aparece primeiro — com contato direto por WhatsApp, sem intermediário e
            sem comissão.
          </p>
          <div id="assinar" className="mt-10 scroll-mt-24">
            <LpPixCheckout
              qr={qrDataUrl}
              payload={pixPayload}
              valor={PLAN.priceLabel}
              chave={PIX.key}
              cadastroHref={CADASTRO}
            />
          </div>
          <p className="mt-4 text-sm text-slate-400">
            Ativação por Pix · {PLAN.priceLabel}/mês · Sem fidelidade · Cancele quando quiser
          </p>
        </div>
      </section>

      {/* PROBLEMA */}
      <section className="border-t border-slate-800">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Quem precisa de você está procurando agora</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Quando alguém tem um problema jurídico, a primeira coisa que faz é procurar um advogado
            na internet. Se o seu nome não está lá, quem aparece leva o cliente — mesmo sendo menos
            preparado que você. O Premium coloca você na frente, na sua cidade e na sua área.
          </p>
        </div>
      </section>

      {/* ONDE VOCE APARECE */}
      <section className="border-t border-slate-800">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">Onde o cliente vai te encontrar</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-slate-400">
            Você não fica preso a uma página esquecida. Aparece onde as pessoas realmente procuram.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {onde.map((o) => (
              <div key={o.t} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                <p className="font-semibold text-amber-300">{o.t}</p>
                <p className="mt-2 text-sm text-slate-400">{o.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="border-t border-slate-800">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">O que muda com o Premium</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {beneficios.map((b) => (
              <div key={b.t} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                <div className="flex items-start gap-3">
                  <span className="mt-1 text-amber-400">✓</span>
                  <div>
                    <p className="font-semibold">{b.t}</p>
                    <p className="mt-1 text-sm text-slate-400">{b.d}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="border-t border-slate-800">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">Como funciona</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {passos.map((p) => (
              <div key={p.n} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-400 text-lg font-bold text-slate-950">
                  {p.n}
                </div>
                <p className="mt-4 font-semibold">{p.t}</p>
                <p className="mt-2 text-sm text-slate-400">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRECO */}
      <section className="border-t border-slate-800">
        <div className="mx-auto max-w-md px-6 py-16">
          <div className="rounded-2xl border border-amber-400/30 bg-slate-900 p-8 text-center shadow-lg shadow-amber-400/10">
            <p className="text-lg font-semibold">Perfil Premium AdvAqui</p>
            <p className="mt-2 text-5xl font-bold text-amber-400">{PLAN.priceLabel}</p>
            <p className="text-sm text-slate-400">/mês · via Pix · Sem fidelidade · Cancele quando quiser</p>
            <ul className="mt-6 space-y-2 text-left text-sm">
              {recursos.map((r) => (
                <li key={r} className="flex items-start gap-2">
                  <span className="mt-0.5 text-amber-400">✓</span>
                  <span className="text-slate-300">{r}</span>
                </li>
              ))}
            </ul>
            <a
              href="#assinar"
              className="mt-8 inline-block w-full rounded-xl bg-amber-400 px-8 py-4 text-lg font-semibold text-slate-950 transition hover:bg-amber-300"
            >
              Assinar agora por Pix
            </a>
          </div>
        </div>
      </section>

      {/* NUMEROS */}
      <section className="border-t border-slate-800">
        <div className="mx-auto grid max-w-4xl gap-8 px-6 py-12 text-center sm:grid-cols-3">
          <div>
            <p className="text-3xl font-bold text-amber-400">5.571</p>
            <p className="text-sm text-slate-400">cidades cobertas no Brasil</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-amber-400">OAB</p>
            <p className="text-sm text-slate-400">perfil com registro verificado</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-amber-400">0%</p>
            <p className="text-sm text-slate-400">de comissão sobre seus clientes</p>
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS (ilustrativos) */}
      <section className="border-t border-slate-800">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="flex justify-center">
            <span className="inline-flex items-center rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-300">
              Exemplos ilustrativos
            </span>
          </div>
          <h2 className="mt-4 text-center text-2xl font-bold sm:text-3xl">
            Como advogados usam o AdvAqui
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-slate-400">
            Exemplos de como o Perfil Premium funciona no dia a dia: ser encontrado na sua
            cidade, falar direto com o cliente e ficar no controle do próprio atendimento.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {depoimentos.map((d) => (
              <figure
                key={d.perfil}
                className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
              >
                <blockquote className="text-slate-300">&ldquo;{d.texto}&rdquo;</blockquote>
                <figcaption className="mt-4 border-t border-slate-800 pt-4">
                  <span className="block font-semibold text-amber-300">{d.perfil}</span>
                  <span className="block text-sm text-slate-400">Cenário ilustrativo</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-slate-400">
            Textos ilustrativos, criados para demonstrar a proposta do AdvAqui. Não são
            avaliações de usuários reais nem representam pessoas específicas, e não prometem
            resultado.
          </p>
        </div>
      </section>

      {/* GARANTIAS / CONFIANCA */}
      <section className="border-t border-slate-800">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Sem pegadinha, sem risco</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-400">
            Seja um dos primeiros advogados a garantir destaque na sua cidade. E se não quiser
            continuar, é só cancelar.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {garantias.map((g) => (
              <div key={g} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/50 px-5 py-4 text-left">
                <span className="text-amber-400">✓</span>
                <span className="text-sm text-slate-200">{g}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-slate-800">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">Perguntas frequentes</h2>
          <div className="mt-8 space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-xl border border-slate-800 bg-slate-900/50 p-5">
                <summary className="cursor-pointer list-none font-semibold">{f.q}</summary>
                <p className="mt-3 text-sm text-slate-400">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="border-t border-slate-800">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Comece a aparecer hoje</h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-300">
            Crie seu perfil, ative por Pix e seja encontrado por quem já está procurando um advogado
            na sua cidade.
          </p>
          <div className="mt-8">
            <a
              href="#assinar"
              className="inline-block w-full rounded-xl bg-amber-400 px-8 py-4 text-lg font-semibold text-slate-950 transition hover:bg-amber-300 sm:w-auto"
            >
              Quero assinar agora →
            </a>
          </div>
          <p className="mt-4 text-sm text-slate-400">
            {PLAN.priceLabel}/mês · Ativação por Pix · Sem fidelidade
          </p>
        </div>
      </section>

      {/* RODAPE MINIMO */}
      <footer className="border-t border-slate-800">
        <div className="mx-auto max-w-4xl px-6 py-8 text-center text-sm text-slate-500">
          <p>{SITE.name} · contato@advaqui.com.br</p>
          <div className="mt-2 flex flex-wrap justify-center gap-4">
            <Link href="/termos" className="hover:text-slate-300">Termos</Link>
            <Link href="/privacidade" className="hover:text-slate-300">Privacidade</Link>
            <Link href="/contato" className="hover:text-slate-300">Contato</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
