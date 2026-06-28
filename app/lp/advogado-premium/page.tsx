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

// Estatica, mas revalida a cada 5 min para que atualizacoes apareçam rapido
// (antes ficava em cache de 1 ano e as mudanças nao apareciam no navegador).
export const revalidate = 300;

const passos = [
  { n: "1", t: "Crie seu perfil", d: "Leva menos de 2 minutos: nome, OAB, cidade e áreas de atuação." },
  { n: "2", t: "Ative seu perfil", d: "Mensalidade de " + PLAN.priceLabel + ". Sem fidelidade." },
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
    d: "Sem cartão e sem fidelidade. Cancele quando quiser. Seu perfil, seus dados, sem letra miúda."
  }
];

const onde = [
  { t: "No Google", d: "Quando alguém pesquisa por um advogado na própria cidade." },
  { t: "Na busca por cidade", d: "Em todas as cidades do Brasil cobertas pelo AdvAqui." },
  { t: "Na busca por área", d: "Trabalhista, família, criminal, previdenciário, cível e mais." },
  { t: "Direto no WhatsApp", d: "O cliente fala com você num clique, sem intermediário." }
];

const recursos = [
  "Selo de Destaque e prioridade em todo o AdvAqui",
  "Mais visibilidade nas buscas do Google",
  "Topo dos resultados na sua cidade e na sua área",
  "Apareça nas cidades de toda a sua região",
  "Página profissional com foto e OAB verificada",
  "Contato direto por WhatsApp, telefone e e-mail",
  "0% de comissão — o cliente é exclusivamente seu",
  "Sem leilão de leads e sem disputa de preço",
  "Publique artigos e apareça como autoridade",
  "Atendimento e suporte para configurar tudo",
  "Sem fidelidade — cancele quando quiser"
];

const faqs = [
  { q: "Quanto custa?", a: PLAN.priceLabel + " por mês, via Pix. Sem fidelidade: renove ou cancele quando quiser." },
  { q: "O AdvAqui cobra comissão por cliente?", a: "Não. O contato é direto entre você e o cliente. Você paga apenas a mensalidade." },
  { q: "Como recebo os clientes?", a: "Seu perfil mostra seu WhatsApp, telefone e e-mail. O cliente fala direto com você." },
  { q: "Preciso saber de tecnologia?", a: "Não. A página profissional é montada para você. Basta preencher seus dados." },
  { q: "Em quanto tempo apareço?", a: "Após o pagamento do Pix, a ativação acontece em até 48 horas. Na maioria dos casos, em poucas horas." },
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
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950" />
        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center">
          <div className="mx-auto mb-8 max-w-2xl rounded-xl border border-amber-400/50 bg-amber-400/10 px-5 py-3">
            <p className="text-base font-semibold text-amber-200 sm:text-lg">
              Quantos clientes você perdeu esta semana só porque não apareceu no Google?
            </p>
          </div>

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
            {PLAN.priceLabel}/mês · Sem fidelidade · Cancele quando quiser
          </p>
        </div>
      </section>

      {/* DOR */}
      <section className="border-t border-slate-800">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            Você fez tudo certo. Por que o cliente vai parar em{" "}
            <span className="text-amber-400">outro escritório?</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-slate-400">
            A pergunta incomoda. Mas é ela que decide quem é contratado.
          </p>

          <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-10">
            <div className="space-y-5 text-center text-lg leading-relaxed text-slate-300 sm:text-xl">
              <p>
                Você estudou anos.
                <br className="sm:hidden" />{" "}
                <span className="text-amber-300">Pagou faculdade.</span>{" "}
                <span className="text-amber-300">Pagou OAB.</span>
              </p>
              <p>
                Investe em cursos. Atende bem.
              </p>
              <p className="text-slate-400">
                Mas quando alguém procura um advogado na internet…
              </p>
              <p className="text-xl font-semibold text-slate-100 sm:text-2xl">
                o cliente encontra{" "}
                <span className="text-amber-300">outro profissional.</span>
              </p>
            </div>

            <div className="mx-auto my-8 h-px w-16 bg-slate-800" />

            <div className="space-y-2 text-center text-lg leading-relaxed sm:text-xl">
              <p className="text-slate-400">Não porque ele seja melhor.</p>
              <p className="font-semibold text-slate-100">
                Mas porque ele{" "}
                <span className="text-amber-300">apareceu primeiro.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRINTS REAIS */}
      <section className="border-t border-slate-800">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            Depois de assinar, é assim que você <span className="text-amber-400">aparece para o cliente</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-slate-400">
            Com a assinatura premium, seu perfil sobe ao topo e passa a aparecer assim para quem procura — no Google e em todo o AdvAqui, com OAB verificada e contato direto.
          </p>

          {/* SIMULACAO GOOGLE PESQUISA (desktop) */}
          <div className="mt-10">
            <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-slate-800 bg-white shadow-lg">
              <div className="border-b border-slate-200 p-4">
                <div className="flex items-center gap-3 rounded-full border border-slate-200 px-4 py-2.5 shadow-sm">
                  <span className="text-lg font-medium tracking-tight">
                    <span className="text-blue-500">G</span>
                    <span className="text-red-500">o</span>
                    <span className="text-amber-500">o</span>
                    <span className="text-blue-500">g</span>
                    <span className="text-green-600">l</span>
                    <span className="text-red-500">e</span>
                  </span>
                  <span className="h-4 w-px bg-slate-200" />
                  <span className="min-w-0 flex-1 truncate text-sm text-slate-700">
                    advogado trabalhista em Belo Horizonte
                  </span>
                  <span aria-hidden="true" className="text-slate-400">🔎</span>
                </div>
              </div>

              <div className="space-y-5 p-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">A</span>
                    <span className="leading-tight">
                      <span className="block text-sm text-slate-800">AdvAqui</span>
                      <span className="block text-xs text-green-700">advaqui.com › advogado › joao-pereira</span>
                    </span>
                  </div>
                  <p className="mt-1.5 text-lg leading-snug text-blue-800 sm:text-xl">
                    Dr. João Pereira — Advogado Trabalhista em Belo Horizonte
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    OAB/MG verificada. Atendimento direto por WhatsApp em demissões, rescisões e
                    verbas trabalhistas. Fale agora com um advogado na sua cidade.
                  </p>
                </div>

                <div className="space-y-4 opacity-50">
                  <div>
                    <p className="text-xs text-green-700">outro-site.com.br › lista-advogados</p>
                    <p className="text-lg leading-snug text-blue-800">Lista de advogados na região</p>
                    <p className="text-sm text-slate-600">Encontre profissionais de direito do trabalho perto de você…</p>
                  </div>
                  <div>
                    <p className="text-xs text-green-700">exemplo.adv.br › trabalhista</p>
                    <p className="text-lg leading-snug text-blue-800">Escritório de advocacia trabalhista</p>
                    <p className="text-sm text-slate-600">Atuação em causas trabalhistas e cíveis…</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SIMULACAO GOOGLE MOBILE (com botao de ligar) */}
          <div className="mt-12">
            <h3 className="text-center text-xl font-bold sm:text-2xl">
              No celular, com <span className="text-amber-400">botão de ligar</span>
            </h3>
            <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-slate-400">
              Quem procura pelo celular liga ou chama no WhatsApp com um toque.
            </p>
            <div className="mx-auto mt-6 w-full max-w-sm overflow-hidden rounded-3xl border border-slate-700 bg-white shadow-xl">
              <div className="border-b border-slate-200 p-3">
                <div className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2">
                  <span aria-hidden="true" className="text-slate-400">🔎</span>
                  <span className="min-w-0 flex-1 truncate text-sm text-slate-700">advogado perto de mim</span>
                </div>
              </div>
              <div className="p-4">
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">A</span>
                    <span className="text-xs text-green-700">advaqui.com</span>
                  </div>
                  <p className="mt-2 text-base font-medium leading-snug text-blue-800">
                    Dr. João Pereira — Advogado em Belo Horizonte
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    OAB/MG verificada · Direito Trabalhista, Família e Cível.
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <span className="flex items-center justify-center gap-1.5 rounded-full bg-blue-600 px-3 py-2 text-sm font-semibold text-white">
                      <span aria-hidden="true">📞</span> Ligar
                    </span>
                    <span className="flex items-center justify-center gap-1.5 rounded-full bg-emerald-500 px-3 py-2 text-sm font-semibold text-white">
                      <span aria-hidden="true">💬</span> WhatsApp
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <p className="mx-auto mt-4 max-w-2xl text-center text-xs text-slate-500">
              Simulações ilustrativas de resultado de busca. Nomes e textos são exemplos.
            </p>
          </div>

          {/* TELAS REAIS */}
          <div className="mt-14">
            <h3 className="text-center text-xl font-bold sm:text-2xl">
              Telas reais da <span className="text-amber-400">plataforma</span>
            </h3>
            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {[
                { src: "/prints/home.png", t: "Busca por cidade", d: "Onde o cliente começa a procurar um advogado." },
                { src: "/prints/cidade.png", t: "Diretório da cidade", d: "Quem tem Destaque aparece primeiro, com OAB verificada." },
                { src: "/prints/perfil.png", t: "Página profissional", d: "Foto, áreas de atuação e contato direto por WhatsApp." }
              ].map((p) => (
                <figure key={p.src} className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
                  <div className="aspect-[16/10] overflow-hidden border-b border-slate-800 bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.src} alt={p.t} className="h-full w-full object-cover object-top" loading="lazy" />
                  </div>
                  <figcaption className="p-5">
                    <p className="font-semibold text-amber-300">{p.t}</p>
                    <p className="mt-1 text-sm text-slate-400">{p.d}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="mx-auto mt-6 text-center text-xs text-slate-500">
              Capturas reais da plataforma AdvAqui.
            </p>
          </div>
        </div>
      </section>

      {/* NARRATIVA */}
      <section className="border-t border-slate-800">
  <div className="mx-auto max-w-5xl px-6 py-16">
    <h2 className="text-center text-2xl font-bold sm:text-3xl">
      Cinco nomes aparecem. <span className="text-amber-400">Quatro nunca souberam do cliente.</span>
    </h2>
    <p className="mx-auto mt-3 max-w-2xl text-center text-slate-400">
      Veja o que acontece, todos os dias, quando alguém procura um advogado na internet.
    </p>

    {/* CENA: cartao de busca + os 4 que ficaram para tras */}
    <div className="mt-10 grid grid-cols-1 items-start gap-6 lg:grid-cols-5">
      {/* Cartao de busca (resultado) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 lg:col-span-3">
        {/* barra de busca simulada */}
        <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 shrink-0 text-slate-500"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <span className="text-sm text-slate-300">advogado trabalhista em Montes Claros</span>
        </div>
        <p className="mt-4 text-xs uppercase tracking-wide text-slate-500">5 resultados encontrados</p>

        {/* lista de resultados */}
        <ul className="mt-4 space-y-3">
          {/* 1o resultado — destacado */}
          <li className="rounded-xl border border-amber-400/40 bg-amber-400/10 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-400 text-sm font-bold text-slate-950">
                1º
              </span>
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 font-semibold text-slate-100">
                  Dr. Você
                  <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-xs font-medium text-amber-300">
                    ★ Destaque
                  </span>
                </p>
                <p className="text-sm text-amber-300">OAB verificada · contato direto por WhatsApp</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm font-medium text-emerald-400">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden="true">
                <path d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.3-1.4A10 10 0 1 0 12 2Zm5.2 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.6-.6-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 .9-2.2.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.5c-.1.2-.3.3-.1.6.1.3.6 1 1.3 1.6.9.8 1.6 1 1.9 1.2.2.1.4.1.6-.1l.7-.8c.2-.2.4-.2.6-.1l1.8.9c.2.1.4.2.4.3.1.1.1.6-.1 1.2Z" />
              </svg>
              <span>O cliente liga. Fecha o contrato com você.</span>
            </div>
          </li>

          {/* 2o ao 5o — apagados/opacos */}
          {[
            { p: "2º", n: "Dra. Concorrente" },
            { p: "3º", n: "Dr. Concorrente" },
            { p: "4º", n: "Dra. Concorrente" },
            { p: "5º", n: "Dr. Concorrente" }
          ].map((r) => (
            <li key={r.p} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 opacity-40">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-slate-400">
                  {r.p}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-300">{r.n}</p>
                  <p className="text-sm text-slate-500">Nunca soube que esse cliente existiu.</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Linha do tempo da cena */}
      <ol className="space-y-4 lg:col-span-2">
        {[
          { ico: "🔎", t: "Alguém pesquisa", d: "“Advogado trabalhista em Montes Claros.” Um problema real, agora." },
          { ico: "📋", t: "Encontra cinco nomes", d: "A pessoa olha o primeiro resultado. Raramente passa do topo da lista." },
          { ico: "📞", t: "Liga para o primeiro", d: "Fala direto por WhatsApp. Tira a dúvida, sente confiança." },
          { ico: "✅", t: "Fecha contrato", d: "Os outros quatro nunca souberam que esse cliente existiu." }
        ].map((s, i, arr) => (
          <li key={s.t} className="relative flex gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-lg" aria-hidden="true">
              {s.ico}
            </span>
            <div>
              <p className={"font-semibold " + (i === arr.length - 1 ? "text-emerald-400" : "text-amber-300")}>
                {s.t}
              </p>
              <p className="mt-1 text-sm text-slate-400">{s.d}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>

    <p className="mx-auto mt-10 max-w-2xl text-center text-slate-300">
      A diferença entre ser o nome de cima e ser um dos quatro apagados não é talento.
      É <span className="text-amber-400">aparecer na hora em que procuram</span>. É exatamente o que o Perfil Premium faz por você.
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

      {/* DEMONSTRACAO */}
      {/* DEMONSTRACAO — mostrar, nao so dizer */}
      <section className="border-t border-slate-800">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            Veja como <span className="text-amber-400">funciona na prática</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-slate-400">
            Ilustrações do produto: do momento em que o cliente busca um advogado
            até a conversa chegar no seu WhatsApp.
          </p>

          <div className="mt-12 grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
            {/* (1) RESULTADO DO GOOGLE */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <p className="text-sm font-semibold text-amber-300">
                Quando alguém busca na internet
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Seu perfil aparece em destaque, acima dos cadastros comuns.
              </p>

              {/* mockup claro do buscador */}
              <div className="mt-5 rounded-xl bg-white p-4 text-slate-900 shadow-lg">
                {/* barra de busca */}
                <div className="flex items-center gap-3 rounded-full border border-slate-200 px-4 py-2.5">
                  <span aria-hidden="true" className="text-slate-400">🔎</span>
                  <span className="min-w-0 truncate text-sm text-slate-700">
                    advogado trabalhista em Belo Horizonte
                  </span>
                </div>

                {/* 1o resultado — DESTAQUE */}
                <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-3 ring-1 ring-amber-200">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-slate-900">
                      A
                    </span>
                    <span className="text-xs text-slate-600">
                      advaqui.com › perfil
                    </span>
                    <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-[11px] font-semibold text-slate-900">
                      <span aria-hidden="true">★</span> Perfil em destaque
                    </span>
                  </div>
                  <p className="mt-1.5 text-base font-medium leading-snug text-blue-800">
                    Dr. João Pereira, Advogado(a) — Direito Trabalhista
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-600">
                    <span>OAB verificada · Belo Horizonte e região</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    Atendimento direto por WhatsApp. Direito do trabalho,
                    rescisões e verbas. Fale agora com o advogado.
                  </p>
                </div>

                {/* resultados comuns (atenuados) */}
                <div className="mt-3 space-y-3 opacity-60">
                  <div>
                    <p className="text-sm font-medium leading-snug text-blue-800">
                      Lista de advogados na região
                    </p>
                    <p className="text-xs text-slate-500">
                      outro-site.com › advogados
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-snug text-blue-800">
                      Escritório de advocacia — contato
                    </p>
                    <p className="text-xs text-slate-500">
                      exemplo.com.br › trabalhista
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-center text-xs text-slate-500">
                Ilustração do produto. Nomes e telas são exemplos.
              </p>
            </div>

            {/* (2) CELULAR — conversa estilo WhatsApp */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <p className="text-sm font-semibold text-amber-300">
                O cliente fala direto com você
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Sem intermediário e sem comissão — a conversa chega no seu WhatsApp.
              </p>

              {/* moldura do celular */}
              <div className="mx-auto mt-5 w-full max-w-[280px] rounded-3xl border border-slate-700 bg-slate-950 p-2 shadow-xl">
                {/* topo / status bar */}
                <div className="flex items-center gap-3 rounded-t-2xl bg-emerald-600 px-4 py-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-semibold text-white">
                    JP
                  </span>
                  <span className="leading-tight">
                    <span className="block text-sm font-semibold text-white">
                      Dr. João Pereira
                    </span>
                    <span className="block text-xs text-emerald-100">online</span>
                  </span>
                  <span aria-hidden="true" className="ml-auto text-white">📞</span>
                </div>

                {/* corpo da conversa */}
                <div className="space-y-3 bg-slate-900 px-3 py-4">
                  {/* bolha do cliente (recebida) */}
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-slate-800 px-3 py-2 text-sm text-slate-100">
                      <p>
                        Olá! Vi seu perfil no AdvAqui e preciso de um advogado
                        trabalhista. Pode me atender?
                      </p>
                      <span className="mt-1 block text-right text-[10px] text-slate-400">
                        09:14
                      </span>
                    </div>
                  </div>

                  {/* bolha do advogado (enviada) */}
                  <div className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-emerald-500 px-3 py-2 text-sm text-white">
                      <p>
                        Olá! Claro, posso sim. Me conta rapidamente o que
                        aconteceu que eu já te oriento.
                      </p>
                      <span className="mt-1 block text-right text-[10px] text-emerald-50">
                        09:15 <span aria-hidden="true">✓✓</span>
                      </span>
                    </div>
                  </div>

                  {/* segunda do cliente */}
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-slate-800 px-3 py-2 text-sm text-slate-100">
                      <p>Fui demitido sem receber as verbas. Quando podemos conversar?</p>
                      <span className="mt-1 block text-right text-[10px] text-slate-400">
                        09:16
                      </span>
                    </div>
                  </div>
                </div>

                {/* barra de digitar */}
                <div className="flex items-center gap-2 rounded-b-2xl bg-slate-800 px-3 py-2.5">
                  <span className="flex-1 truncate rounded-full bg-slate-700 px-3 py-1.5 text-xs text-slate-400">
                    Mensagem
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm text-white">
                    <span aria-hidden="true">➤</span>
                  </span>
                </div>
              </div>

              <p className="mt-4 text-center text-xs text-slate-500">
                Ilustração do produto. Conversa fictícia para exemplo.
              </p>
            </div>

            {/* (3) PERFIL PROFISSIONAL */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <p className="text-sm font-semibold text-amber-300">Sua página profissional</p>
              <p className="mt-1 text-sm text-slate-400">
                Foto, OAB verificada, áreas de atuação e botão de contato — pronta para o cliente confiar.
              </p>
              <div className="mt-5 rounded-xl border border-slate-700 bg-slate-950 p-5">
                <div className="flex items-center gap-4">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-amber-400 text-xl font-bold text-slate-950">JP</span>
                  <div>
                    <p className="font-semibold text-slate-100">Dr. João Pereira</p>
                    <p className="text-sm text-amber-300">Advogado · Belo Horizonte/MG</p>
                    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
                      <span aria-hidden="true">✓</span> OAB verificada
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">Trabalhista</span>
                  <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">Família</span>
                  <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">Previdenciário</span>
                </div>
                <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white">
                  <span aria-hidden="true">💬</span> Falar no WhatsApp
                </div>
              </div>
              <p className="mt-4 text-center text-xs text-slate-500">Ilustração do produto.</p>
            </div>

            {/* (4) DESTAQUE / RANKING */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <p className="text-sm font-semibold text-amber-300">Sempre acima dos cadastros comuns</p>
              <p className="mt-1 text-sm text-slate-400">
                Com o selo de Destaque, seu perfil fica no topo — enquanto os cadastros gratuitos ficam para trás.
              </p>
              <div className="mt-5 space-y-4 rounded-xl border border-slate-700 bg-slate-950 p-5">
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-amber-300">Seu perfil — Premium</span>
                    <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-slate-900">TOPO</span>
                  </div>
                  <div className="mt-1.5 h-2.5 w-full rounded-full bg-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Cadastro comum</p>
                  <div className="mt-1.5 h-2.5 w-2/3 rounded-full bg-slate-700" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Cadastro comum</p>
                  <div className="mt-1.5 h-2.5 w-1/2 rounded-full bg-slate-700" />
                </div>
              </div>
              <p className="mt-4 text-center text-xs text-slate-500">Ilustração do produto.</p>
            </div>
          </div>

          {/* (3) FLUXO DO CLIENTE — 4 passos com setas */}
          <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <p className="text-center text-sm font-semibold text-amber-300">
              O caminho até o contrato
            </p>
            <div className="mt-6 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-center">
              {/* passo 1 */}
              <div className="flex-1 rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-center">
                <span aria-hidden="true" className="text-2xl">🔎</span>
                <p className="mt-2 text-sm font-medium text-slate-100">
                  Busca no Google
                </p>
              </div>
              <span aria-hidden="true" className="self-center text-2xl text-amber-400 sm:rotate-0 rotate-90">
                →
              </span>
              {/* passo 2 */}
              <div className="flex-1 rounded-xl border border-amber-400/30 bg-slate-950/60 p-4 text-center">
                <span aria-hidden="true" className="text-2xl">⭐</span>
                <p className="mt-2 text-sm font-medium text-slate-100">
                  Encontra seu perfil em destaque
                </p>
              </div>
              <span aria-hidden="true" className="self-center text-2xl text-amber-400 sm:rotate-0 rotate-90">
                →
              </span>
              {/* passo 3 */}
              <div className="flex-1 rounded-xl border border-emerald-500/30 bg-slate-950/60 p-4 text-center">
                <span aria-hidden="true" className="text-2xl">💬</span>
                <p className="mt-2 text-sm font-medium text-slate-100">
                  Fala no seu WhatsApp
                </p>
              </div>
              <span aria-hidden="true" className="self-center text-2xl text-amber-400 sm:rotate-0 rotate-90">
                →
              </span>
              {/* passo 4 */}
              <div className="flex-1 rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-center">
                <span aria-hidden="true" className="text-2xl">🤝</span>
                <p className="mt-2 text-sm font-medium text-slate-100">
                  Fecha o contrato
                </p>
              </div>
            </div>
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

      {/* COMPARACAO */}
      {/* COMPARACAO */}
      <section className="border-t border-slate-800">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            Sem AdvAqui x Com AdvAqui
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-slate-400">
            A diferença de estar — ou não — onde o cliente procura.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {/* SEM ADVAQUI */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 opacity-80">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-400">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </span>
                <p className="text-lg font-semibold text-slate-400">Sem AdvAqui</p>
              </div>
              <ul className="mt-6 space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-rose-400/80" aria-hidden="true">✕</span>
                  <span className="text-slate-400">Você depende de indicação para conseguir um novo cliente.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-rose-400/80" aria-hidden="true">✕</span>
                  <span className="text-slate-400">É difícil aparecer para quem está procurando.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-rose-400/80" aria-hidden="true">✕</span>
                  <span className="text-slate-400">A concorrência fica mais visível do que você.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-rose-400/80" aria-hidden="true">✕</span>
                  <span className="text-slate-400">O cliente simplesmente não te encontra.</span>
                </li>
              </ul>
            </div>

            {/* COM ADVAQUI */}
            <div className="rounded-2xl border border-amber-400/30 bg-slate-900/50 p-6 shadow-lg shadow-amber-400/10">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-400/15 text-amber-300">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <p className="text-lg font-semibold text-amber-400">Com AdvAqui</p>
              </div>
              <ul className="mt-6 space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-emerald-400" aria-hidden="true">✓</span>
                  <span className="text-slate-100">Seu perfil entra em destaque, na frente dos cadastros gratuitos.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-emerald-400" aria-hidden="true">✓</span>
                  <span className="text-slate-100">Você é encontrado na sua cidade e na sua área de atuação.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-emerald-400" aria-hidden="true">✓</span>
                  <span className="text-slate-100">O cliente fala com você direto pelo WhatsApp, sem intermediário.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-emerald-400" aria-hidden="true">✓</span>
                  <span className="text-slate-100">Sua página profissional já fica pronta, com OAB verificada.</span>
                </li>
              </ul>
            </div>
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

      {/* CUSTO DE NAO APARECER */}
      <section className="border-t border-slate-800">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            O custo de <span className="text-amber-400">não aparecer</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-slate-400">
            A busca por advogado acontece o tempo todo, em todas as cidades do Brasil.
            Quando alguém procura e você não está lá, quem aparece conversa com esse cliente
            no seu lugar.
          </p>

          {/* CONTRASTE: custo x oportunidade */}
          <div className="mt-10 grid items-stretch gap-5 lg:grid-cols-[1fr_auto_1fr]">
            {/* Lado: o que você economiza */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Quanto custa aparecer
              </p>
              <p className="mt-3 text-4xl font-bold text-slate-100 sm:text-5xl">{PLAN.priceLabel}</p>
              <p className="mt-1 text-sm text-slate-400">por mês · sem fidelidade · cancele quando quiser</p>
              <p className="mt-4 text-sm text-slate-400">
                É o valor do Perfil Premium. Sem comissão por cliente e sem cartão de crédito.
              </p>
            </div>

            {/* Separador "versus" */}
            <div className="flex items-center justify-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-800 bg-slate-900/50 text-sm font-bold text-amber-400">
                vs
              </span>
            </div>

            {/* Lado: o que pode ficar para trás */}
            <div className="rounded-2xl border border-amber-400/30 bg-slate-900/50 p-6 shadow-lg shadow-amber-400/10">
              <p className="text-sm font-semibold uppercase tracking-wide text-amber-300">
                O que pode ficar para trás
              </p>
              <p className="mt-3 text-4xl font-bold text-amber-400 sm:text-5xl">
                R$ 2.000<span className="align-top text-2xl">*</span>
              </p>
              <p className="mt-1 text-sm text-slate-400">um único contrato que você não chegou a fechar</p>
              <p className="mt-4 text-sm text-slate-300">
                Quando o cliente procura primeiro e fala com outro profissional, esse contato
                não volta. Não é uma promessa de resultado — é o tamanho da chance que passa
                quando você não aparece.
              </p>
            </div>
          </div>

          {/* Pergunta central (hipótese) */}
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-center sm:p-8">
            <p className="text-lg font-semibold text-slate-100 sm:text-xl">
              Se um único contrato deixa de acontecer porque você não apareceu primeiro,
              <span className="text-amber-300"> quanto custou economizar os {PLAN.priceLabel}?</span>
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400">
              <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-4 w-4">
                <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.3 3.3 6.8-6.8a1 1 0 0 1 1.9.5Z" clipRule="evenodd" />
              </svg>
              Aparecer custa menos do que um cliente perdido
            </p>
          </div>

          {/* Nota de transparência: exemplo ilustrativo */}
          <p className="mx-auto mt-6 max-w-3xl text-center text-xs text-slate-500">
            * Valor meramente ilustrativo, usado só para comparar grandezas — varia conforme a
            área, o caso e o profissional. O AdvAqui aumenta sua visibilidade para quem procura
            advogado; não garante a contratação nem o valor de honorários.
          </p>

          <div className="mt-10 text-center">
            <a
              href="#assinar"
              className="inline-block w-full rounded-xl bg-amber-400 px-8 py-4 text-lg font-semibold text-slate-950 transition hover:bg-amber-300 sm:w-auto"
            >
              Quero aparecer por {PLAN.priceLabel}/mês →
            </a>
          </div>
        </div>
      </section>

      {/* PRECO */}
      <section className="border-t border-slate-800">
        <div className="mx-auto max-w-md px-6 py-16">
          <div className="rounded-2xl border border-amber-400/30 bg-slate-900 p-8 text-center shadow-lg shadow-amber-400/10">
            <p className="text-lg font-semibold">Perfil Premium AdvAqui</p>
            <p className="mt-2 text-5xl font-bold text-amber-400">{PLAN.priceLabel}</p>
            <p className="text-sm text-slate-400">/mês · Sem fidelidade · Cancele quando quiser</p>
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
              Assinar agora
            </a>
          </div>
        </div>
      </section>

      {/* NUMEROS */}
      <section className="border-t border-slate-800">
        <div className="mx-auto grid max-w-4xl gap-8 px-6 py-12 text-center sm:grid-cols-3">
          <div>
            <p className="text-3xl font-bold text-amber-400">Nacional</p>
            <p className="text-sm text-slate-400">cobertura em todas as cidades do Brasil</p>
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
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-amber-500 text-base font-bold text-slate-950">
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
            Crie seu perfil e seja encontrado por quem já está procurando um advogado
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
            {PLAN.priceLabel}/mês · Sem fidelidade · Cancele quando quiser
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
