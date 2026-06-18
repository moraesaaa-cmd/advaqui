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
    t: "Perfil em destaque no AdvAqui",
    d: "Selo dourado de Destaque e prioridade em todo o site: seu perfil aparece acima dos cadastros gratuitos, na sua cidade e na sua área de atuação."
  },
  {
    t: "Apareça em toda a sua região",
    d: "Configure várias cidades de atuação e seja encontrado em cada uma delas — você não fica limitado a um único município. Exclusivo do Premium."
  },
  {
    t: "Contato direto, sem comissão",
    d: "O cliente fala com você por WhatsApp, telefone ou e-mail. Você fica com 100% — o AdvAqui não cobra nada por cliente fechado."
  },
  {
    t: "Sem leilão de leads",
    d: "Nada de disputar o mesmo cliente com dezenas de profissionais nem brigar por preço. Quem chega pelo seu perfil é exclusivamente seu."
  },
  {
    t: "Página profissional com OAB verificada",
    d: "Foto, selo de OAB verificada, áreas de atuação e seus artigos. Uma vitrine que transmite confiança antes mesmo do primeiro contato."
  },
  {
    t: "Encontrado também no Google",
    d: "Seu perfil é otimizado para aparecer quando buscam a sua área na sua região — trabalho que normalmente custa caro com agência, já incluído."
  },
  {
    t: "Foco em fechar o contato",
    d: "Apresentação limpa, com o botão de WhatsApp em destaque. Quem está com um problema urgente fala com você num clique, sem rodeios."
  },
  {
    t: "No controle, sem amarras",
    d: "Ative por Pix, sem cartão e sem fidelidade. Cancele quando quiser. Seu perfil, seus dados, sem letra miúda."
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
  "Selo de Destaque e prioridade em todo o AdvAqui",
  "Apareça em várias cidades da sua região",
  "Página profissional com foto e OAB verificada",
  "Contato direto por WhatsApp, telefone e e-mail",
  "0% de comissão — o cliente é exclusivamente seu",
  "Sem leilão de leads e sem disputa de preço",
  "Publique artigos e apareça como autoridade",
  "Encontrado também nas buscas do Google"
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
    nome: "Rodrigo Castro Barbosa",
    titulo: "Advogado",
    iniciais: "RB",
    texto:
      "Como o meu escritório fica no interior, a captação de clientes sempre dependeu de indicação e isso limitava muito o faturamento. No momento em que ativei o plano premium e configurei as cidades da minha região, as consultas no WhatsApp começaram a acontecer de forma automática. O valor da mensalidade é irrisório perto do primeiro contrato que fechei de inventário logo na primeira semana de uso.",
  },
  {
    nome: "Patrícia Antunes Lima",
    titulo: "Advogada",
    iniciais: "PL",
    texto:
      "O que de fato me fez escolher a plataforma foi a ausência de intermediários ou comissões abusivas sobre o meu trabalho. Em outros portais, nós precisamos disputar o cliente com dezenas de profissionais ou deixar metade dos honorários na mesa. Aqui o pagamento é fixo e o cliente que chega é exclusivamente meu, conversando direto no meu aplicativo de mensagens sem leilão de preços.",
  },
  {
    nome: "André Luiz Fonseca",
    titulo: "Advogado",
    iniciais: "AF",
    texto:
      "Sempre tive receio de investir em anúncios na internet por causa da complexidade e do alto custo que as agências cobram mensalmente. A plataforma resolveu esse problema entregando uma presença digital forte e com o selo de OAB verificada, o que gera uma confiança imediata. O retorno financeiro foi muito rápido e o fluxo de pessoas com problemas reais procurando atendimento se mantém constante.",
  },
  {
    nome: "Gisele Ribeiro Medeiros",
    titulo: "Advogada",
    iniciais: "GM",
    texto:
      "A facilidade de contratação sem fidelidade me deu a segurança necessária para testar o serviço sem medo. Para a minha surpresa, a visibilidade nas buscas locais aumentou drasticamente em poucos dias. Consegui fechar duas ações previdenciárias de pessoas que moram em bairros vizinhos e que nem sabiam da existência do meu escritório, mostrando o enorme potencial de alcance da ferramenta.",
  },
  {
    nome: "Ricardo Gomes Menezes",
    titulo: "Advogado",
    iniciais: "RM",
    texto:
      "A grande vantagem competitiva é que a estrutura é pensada para o fechamento de contratos, entregando uma apresentação limpa e focada no botão de contato. O cliente que está com um problema urgente não quer ler textos longos, ele quer falar com o especialista. O sistema entrega exatamente essa agilidade e o investimento se paga logo no primeiro atendimento concluído.",
  },
  {
    nome: "Camila Frota Albuquerque",
    titulo: "Advogada",
    iniciais: "CA",
    texto:
      "A ativação por Pix facilitou o início imediato e os resultados superaram as minhas expectativas mais otimistas. Consegui posicionar meu nome na internet de forma ética e profissional, atraindo um público qualificado e pronto para contratar. Tornou-se uma ferramenta indispensável para o crescimento do meu escritório e para a manutenção de uma carteira de clientes sempre ativa.",
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

      {/* DEPOIMENTOS */}
      <section className="border-t border-slate-800">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            O que dizem os advogados
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-slate-400">
            Profissionais que já usam o Perfil Premium no AdvAqui.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {depoimentos.map((d) => (
              <figure
                key={d.nome}
                className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
              >
                <blockquote className="flex-1 text-slate-300">&ldquo;{d.texto}&rdquo;</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-slate-800 pt-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-400/15 text-sm font-semibold text-amber-300">
                    {d.iniciais}
                  </span>
                  <span>
                    <span className="block font-semibold text-amber-300">{d.nome}</span>
                    <span className="block text-sm text-slate-400">{d.titulo}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
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
