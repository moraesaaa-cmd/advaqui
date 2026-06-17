import Link from "next/link";
import type { Metadata } from "next";
import { PLAN, SITE } from "@/lib/config";

const CADASTRO = "/cadastro?origem=ads-premium";

export const metadata: Metadata = {
  title: { absolute: "Apareca para quem procura advogado na sua cidade | AdvAqui" },
  description:
    "Perfil Premium no AdvAqui: apareca quando alguem busca advogado na sua cidade. Contato direto por WhatsApp, sem comissao. Ativacao por Pix.",
  robots: { index: false, follow: false },
  alternates: { canonical: SITE.url + "/lp/advogado-premium" },
  openGraph: {
    title: "Apareca para quem procura advogado na sua cidade",
    description: "Perfil Premium no AdvAqui. Contato direto, sem comissao. Ativacao por Pix.",
    url: SITE.url + "/lp/advogado-premium",
    siteName: SITE.name,
    locale: "pt_BR",
    type: "website"
  }
};

export const dynamic = "force-static";

const passos = [
  { n: "1", t: "Crie seu perfil", d: "Leva menos de 2 minutos: nome, OAB, cidade e areas de atuacao." },
  { n: "2", t: "Ative por Pix", d: "Mensalidade de " + PLAN.priceLabel + " via Pix. Sem fidelidade." },
  { n: "3", t: "Seja encontrado", d: "Seu perfil entra em destaque e os clientes falam direto com voce." }
];

const beneficios = [
  { t: "Destaque na sua cidade", d: "Seu perfil aparece no topo das buscas por advogado na sua cidade e nas suas areas." },
  { t: "Contato direto, sem comissao", d: "O cliente fala com voce por WhatsApp, telefone ou e-mail. O AdvAqui nao cobra por cliente." },
  { t: "Pagina profissional pronta", d: "Foto, OAB verificada, areas, horarios e artigos seus. Uma vitrine que passa confianca." },
  { t: "Tambem no Google", d: "Seu perfil tem endereco proprio, otimizado para aparecer quando buscam sua area na regiao." }
];

const recursos = [
  "Destaque no topo da sua cidade e areas",
  "Pagina profissional com foto e OAB verificada",
  "Contato direto por WhatsApp, telefone e e-mail",
  "Sem comissao por cliente",
  "Publique artigos e responda duvidas",
  "Apareca tambem nas buscas do Google"
];

const faqs = [
  { q: "Quanto custa?", a: PLAN.priceLabel + " por mes, via Pix. Sem fidelidade: renove e cancele quando quiser." },
  { q: "O AdvAqui cobra comissao por cliente?", a: "Nao. O contato e direto entre voce e o cliente. Voce paga apenas a mensalidade." },
  { q: "Como recebo os clientes?", a: "Seu perfil mostra seu WhatsApp, telefone e e-mail. O cliente fala direto com voce." },
  { q: "Preciso saber de tecnologia?", a: "Nao. A pagina profissional e montada para voce. Basta preencher seus dados." },
  { q: "Em quanto tempo aparece?", a: "Assim que o pagamento por Pix e confirmado, seu perfil entra em destaque." },
  { q: "Posso cancelar?", a: "A qualquer momento, sem multa e sem fidelidade." }
];

export default function LandingAdvogadoPremium() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950" />
        <div className="relative mx-auto max-w-5xl px-6 py-20 text-center sm:py-28">
          <span className="inline-block rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1 text-sm font-medium text-amber-300">Para advogados e advogadas</span>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">Apareca quando alguem procura <span className="text-amber-400">advogado na sua cidade</span></h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">Todo dia pessoas buscam um advogado perto delas. Com o perfil Premium no AdvAqui, e o seu nome que aparece, com contato direto por WhatsApp, sem intermediario e sem comissao.</p>
          <div className="mt-10"><Link href={CADASTRO} className="inline-block w-full rounded-xl bg-amber-400 px-8 py-4 text-lg font-semibold text-slate-950 shadow-lg shadow-amber-400/20 transition hover:bg-amber-300 sm:w-auto">Quero aparecer agora</Link></div>
          <p className="mt-4 text-sm text-slate-400">Ativacao por Pix | {PLAN.priceLabel}/mes | Sem fidelidade</p>
        </div>
      </section>
      <section className="border-t border-slate-800">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Quem precisa de voce esta procurando agora</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">Quando alguem tem um problema juridico, a primeira coisa que faz e procurar um advogado na internet. Se o seu nome nao esta la, quem aparece leva o cliente. O Premium coloca voce na frente, na sua cidade e na sua area.</p>
        </div>
      </section>
      <section className="border-t border-slate-800">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">Como funciona</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {passos.map((p) => (
              <div key={p.n} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-400 text-xl font-bold text-slate-950">{p.n}</div>
                <h3 className="mt-4 text-lg font-semibold">{p.t}</h3>
                <p className="mt-2 text-sm text-slate-300">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="border-t border-slate-800">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">O que o Premium faz por voce</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {beneficios.map((b) => (
              <div key={b.t} className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                <span className="mt-2 h-2 w-2 flex-none rounded-full bg-amber-400" />
                <div><h3 className="text-lg font-semibold">{b.t}</h3><p className="mt-1 text-sm text-slate-300">{b.d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="border-t border-slate-800">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <div className="rounded-3xl border border-amber-400/30 bg-gradient-to-b from-slate-900 to-slate-950 p-8 text-center shadow-xl sm:p-12">
            <h2 className="text-2xl font-bold sm:text-3xl">Perfil Premium AdvAqui</h2>
            <div className="mt-6 flex items-end justify-center gap-1"><span className="text-5xl font-bold text-amber-400">{PLAN.priceLabel}</span><span className="mb-2 text-slate-400">/mes</span></div>
            <p className="mt-2 text-sm text-slate-400">Via Pix | Sem fidelidade | Cancele quando quiser</p>
            <ul className="mx-auto mt-8 max-w-md space-y-3 text-left">
              {recursos.map((f) => (<li key={f} className="flex items-start gap-3"><span className="mt-2 h-2 w-2 flex-none rounded-full bg-amber-400" /><span className="text-slate-200">{f}</span></li>))}
            </ul>
            <Link href={CADASTRO} className="mt-10 inline-block w-full rounded-xl bg-amber-400 px-8 py-4 text-lg font-semibold text-slate-950 transition hover:bg-amber-300 sm:w-auto sm:px-12">Criar meu perfil e ativar</Link>
          </div>
        </div>
      </section>
      <section className="border-t border-slate-800">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="grid gap-8 text-center sm:grid-cols-3">
            <div><div className="text-3xl font-bold text-amber-400">5.571</div><div className="mt-1 text-sm text-slate-300">cidades cobertas no Brasil</div></div>
            <div><div className="text-3xl font-bold text-amber-400">OAB</div><div className="mt-1 text-sm text-slate-300">perfis com registro verificado</div></div>
            <div><div className="text-3xl font-bold text-amber-400">0%</div><div className="mt-1 text-sm text-slate-300">de comissao sobre seus clientes</div></div>
          </div>
        </div>
      </section>
      <section className="border-t border-slate-800">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">Perguntas frequentes</h2>
          <div className="mt-10 space-y-4">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-xl border border-slate-800 bg-slate-900/50 p-5">
                <summary className="cursor-pointer list-none font-semibold text-slate-100">{f.q}</summary>
                <p className="mt-3 text-sm text-slate-300">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="border-t border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Comece a aparecer hoje</h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-300">Crie seu perfil, ative por Pix e seja encontrado por quem procura um advogado na sua cidade.</p>
          <Link href={CADASTRO} className="mt-8 inline-block rounded-xl bg-amber-400 px-12 py-4 text-lg font-semibold text-slate-950 transition hover:bg-amber-300">Quero aparecer agora</Link>
          <p className="mt-4 text-sm text-slate-400">{PLAN.priceLabel}/mes | Ativacao por Pix | Sem fidelidade</p>
        </div>
      </section>
      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-5xl px-6 py-8 text-center text-sm text-slate-500">
          <p>AdvAqui | {SITE.email}</p>
          <div className="mt-3 flex justify-center gap-6">
            <Link href="/termos" className="hover:text-slate-300">Termos</Link>
            <Link href="/privacidade" className="hover:text-slate-300">Privacidade</Link>
            <Link href="/contato" className="hover:text-slate-300">Contato</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
