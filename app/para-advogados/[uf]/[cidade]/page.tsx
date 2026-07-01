import Link from "next/link";
import { notFound } from "next/navigation";
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
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { findCity, findCapital, nearbyCities } from "@/lib/data/cities";
import { findState } from "@/lib/data/states";
import { seedFrom, pick } from "@/lib/utils/seed";
import { SITE, PLAN } from "@/lib/config";

/**
 * /para-advogados/[uf]/[cidade] — landing local de captação de advogados
 * (a oferta "premium" do AdvAqui, espelho indexável de /lp/advogado-premium,
 * que é noindex por ser campanha paga). Uma URL por município, conteúdo único
 * variado pela semente do IBGE. Renderização sob demanda (force-dynamic).
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: {
  params: { uf: string; cidade: string };
}) {
  const st = findState(params.uf);
  const city = findCity(params.uf, params.cidade);
  if (!st || !city) {
    return buildMetadata({
      title: "Para advogados",
      description: "Cidade não encontrada.",
      noIndex: true
    });
  }
  return buildMetadata({
    title: `Advogado em destaque em ${city.name}, ${st.uf} — apareça no topo das buscas`,
    description:
      `Quem procura advogado em ${city.name}/${st.uf} encontra primeiro os perfis em destaque. ` +
      `Ative o plano Premium do AdvAqui e apareça no topo das buscas da sua cidade — WhatsApp ` +
      `direto, selo de OAB verificada, sem comissão e sem fidelidade.`,
    path: `/para-advogados/${st.uf.toLowerCase()}/${city.slug}`
  });
}

const SUBTITULOS: Array<(cityName: string) => string> = [
  (n) =>
    `Todo dia, pessoas em ${n} pesquisam na internet por um advogado. Tenha um perfil profissional que aparece nessas buscas — com contato direto, sem intermediário e sem comissão.`,
  (n) =>
    `Quem precisa de advogado em ${n} começa no celular, pesquisando online. O AdvAqui coloca o seu perfil exatamente no caminho dessa pessoa, com seu telefone e WhatsApp à vista.`,
  (n) =>
    `Seus futuros clientes em ${n} já estão procurando. A questão é se vão encontrar você ou o concorrente. Um perfil no AdvAqui resolve isso por menos do que custa um café por dia.`,
  (n) =>
    `Apareça quando alguém em ${n} digita "advogado" no Google. Sem leilão de leads, sem comissão sobre seus honorários: o cliente fala direto com você.`
];

const PORQUE: Array<(cityName: string, region: string) => string> = [
  (n) =>
    `A maioria das contratações de advogado começa com uma busca online por cidade e área. Se você não aparece nessa busca em ${n}, está perdendo cliente para quem aparece.`,
  (n, r) =>
    `Na Região ${r}, a procura por advogados online cresce todo ano. Estar no AdvAqui significa ser encontrado por quem pesquisa especificamente por um profissional em ${n}.`,
  (n) =>
    `Indicação boca a boca é ótima, mas é limitada. Uma presença digital em ${n} amplia o seu alcance para todo mundo que procura um advogado e ainda não conhece você.`
];

export default function ParaAdvogadosCidadePage({
  params
}: {
  params: { uf: string; cidade: string };
}) {
  const st = findState(params.uf);
  const city = findCity(params.uf, params.cidade);
  if (!st || !city) notFound();

  const ufLower = st.uf.toLowerCase();
  const seed = seedFrom(city.id);
  const subtitulo = pick(SUBTITULOS, seed)(city.name);
  const porque = pick(PORQUE, seed >> 3)(city.name, city.region);
  const capital = findCapital(st.uf);
  const neighbors = nearbyCities(city, 8);
  const path = `/para-advogados/${ufLower}/${city.slug}`;
  const cadastro = `/cadastro?origem=premium-${ufLower}-${city.slug}`;

  const FAQ = [
    {
      q: `É gratuito criar o perfil de advogado em ${city.name}?`,
      a: `Sim. Você cria seu perfil e aparece nas buscas de ${city.name} sem pagar nada ao AdvAqui. O plano de destaque é opcional, para quem quer ficar no topo da cidade e da área.`
    },
    {
      q: `Como recebo os contatos dos clientes em ${city.name}?`,
      a: `Direto. O cliente vê seu telefone e WhatsApp no perfil e fala com você sem intermediário. Não há leilão de leads nem comissão sobre o que você cobrar.`
    },
    {
      q: `Preciso ter OAB ativa para aparecer em ${city.name}?`,
      a: `Sim. O AdvAqui é um diretório profissional de advogados, então o cadastro pede o seu número de inscrição na OAB.`
    },
    {
      q: `Quanto custa o destaque em ${city.name}?`,
      a: `${PLAN.priceLabel} por mês, sem fidelidade — você cancela quando quiser. O destaque coloca seu perfil acima dos demais na página de ${city.name} e da sua área de atuação.`
    }
  ];

  return (
    <>
      {/* Hero localizado */}
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
              <MapPin className="w-3.5 h-3.5" aria-hidden />
              Advogados em {city.name} · {st.uf}
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight text-balance">
              Apareça para quem procura advogado em {city.name}
            </h1>
            <p className="mt-5 text-lg md:text-xl text-brand-bg/85 leading-relaxed max-w-2xl">
              {subtitulo}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={cadastro} className="btn-accent inline-flex items-center gap-2 text-base">
                <Sparkles className="w-5 h-5" aria-hidden />
                Criar meu perfil grátis
              </Link>
              <Link
                href="/planos"
                className="btn-ghost text-white border border-white/25 hover:bg-white/10 inline-flex items-center gap-2"
              >
                Ver o plano de destaque ({PLAN.priceLabel}/mês)
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

      {/* Por que aparecer */}
      <section className="container-tight py-16">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
            Por que ter um perfil em {city.name}
          </h2>
          <p className="text-brand-ink/65 mt-3 text-base md:text-lg">{porque}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              Icon: MapPin,
              title: `Seja encontrado em ${city.name}`,
              text: `Seu perfil aparece na página de ${city.name} e da sua área de atuação — exatamente onde a pessoa procura.`
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
              <h3 className="font-display text-xl font-bold text-brand-ink mb-1">{title}</h3>
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
              Como funciona — leva menos de 2 minutos
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                n: "1",
                Icon: UserPlus,
                title: "Crie seu perfil",
                text: `Informe nome, número da OAB, cidade (${city.name}) e suas áreas de atuação. Rápido e sem burocracia.`
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
                title: `Apareça nas buscas de ${city.name}`,
                text: "Seu perfil entra na página da sua cidade e da sua área, pronto para ser encontrado."
              }
            ].map(({ n, Icon, title, text }) => (
              <div key={n} className="relative rounded-2xl border border-brand-line bg-brand-bg/40 p-6">
                <span className="absolute -top-3 -left-3 w-9 h-9 rounded-full bg-brand-deep text-white font-bold flex items-center justify-center text-sm shadow">
                  {n}
                </span>
                <Icon className="w-7 h-7 text-brand-deep mb-3" aria-hidden />
                <h3 className="font-display text-lg font-bold text-brand-ink mb-1">{title}</h3>
                <p className="text-sm text-brand-ink/70 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10 flex flex-wrap gap-3 justify-center">
            <Link href={cadastro} className="btn-accent inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4" aria-hidden />
              Criar meu perfil grátis
            </Link>
            <Link
              href={`/advogados/${ufLower}/${city.slug}`}
              className="btn-ghost border border-brand-line inline-flex items-center gap-2"
            >
              Ver advogados em {city.name}
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
            Você não precisa pagar para aparecer em {city.name}. O destaque é opcional, para quem
            quer ficar à frente na própria cidade.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="rounded-2xl border-2 border-brand-line bg-white p-6">
            <h3 className="font-display text-xl font-bold text-brand-ink">Perfil gratuito</h3>
            <ul className="mt-4 space-y-2.5">
              {[
                `Aparece nas buscas de ${city.name} e da sua área`,
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
            <Link href={cadastro} className="btn-primary w-full justify-center inline-flex items-center gap-2 mt-6">
              Criar perfil grátis
            </Link>
          </div>
          <div className="rounded-2xl border-2 border-brand-accent bg-gradient-to-br from-brand-accent/10 via-white to-brand-accent2/5 p-6 shadow-card relative">
            <span className="absolute -top-3 left-6 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-brand-accent text-brand-ink">
              Destaque · {PLAN.priceLabel}/mês
            </span>
            <h3 className="font-display text-xl font-bold text-brand-ink mt-1">Perfil em destaque</h3>
            <ul className="mt-4 space-y-2.5">
              {[
                "Tudo do perfil gratuito",
                `Aparece no topo de ${city.name} e da sua área`,
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
              Ativar destaque
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ local */}
      <section className="container-tight py-16 max-w-3xl">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-ink text-center mb-8">
          Perguntas frequentes — advogados em {city.name}
        </h2>
        <div className="space-y-3">
          {FAQ.map((f) => (
            <details key={f.q} className="group rounded-xl border border-brand-line bg-white p-4">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-3 font-semibold text-brand-ink">
                {f.q}
                <span className="text-brand-accent2 group-open:rotate-45 transition text-xl leading-none">+</span>
              </summary>
              <p className="mt-2 text-sm text-brand-ink/75 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Links internos: outras cidades */}
      {neighbors.length > 0 && (
        <section className="container-tight pb-8 max-w-4xl">
          <h2 className="font-display text-lg font-bold text-brand-ink mb-3">
            Apareça também em outras cidades de {st.uf}
          </h2>
          <div className="flex flex-wrap gap-2">
            {capital && capital.slug !== city.slug && (
              <Link
                href={`/para-advogados/${ufLower}/${capital.slug}`}
                className="text-sm px-3 py-1.5 rounded-full border border-brand-line hover:border-brand-deep hover:text-brand-deep transition"
              >
                {capital.name}
              </Link>
            )}
            {neighbors.map((n) => (
              <Link
                key={n.slug}
                href={`/para-advogados/${ufLower}/${n.slug}`}
                className="text-sm px-3 py-1.5 rounded-full border border-brand-line hover:border-brand-deep hover:text-brand-deep transition"
              >
                {n.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA final */}
      <section className="container-tight pb-16">
        <div className="rounded-3xl bg-gradient-to-br from-brand-ink to-brand-deep text-white p-8 md:p-12 text-center relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-1/3 left-1/2 -translate-x-1/2 w-2/3 aspect-square rounded-full bg-brand-accent/20 blur-3xl"
          />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight">
              Comece a aparecer em {city.name} hoje
            </h2>
            <p className="text-brand-bg/85 mt-3 text-base md:text-lg max-w-xl mx-auto">
              Leva menos de um minuto e não custa nada para começar.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 justify-center">
              <Link href={cadastro} className="btn-accent inline-flex items-center gap-2 text-base">
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
              O AdvAqui é um diretório profissional. A divulgação respeita as regras de publicidade
              da advocacia — sem promessa de resultado e sem captação indevida de clientela.
            </p>
          </div>
        </div>
      </section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Para advogados", url: "/para-advogados" },
          { name: city.name, url: path }
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a }
          }))
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: `Divulgação de advogados em ${city.name}`,
          serviceType: "Perfil profissional e destaque em diretório de advogados",
          areaServed: {
            "@type": "City",
            name: city.name,
            addressRegion: st.uf,
            addressCountry: "BR"
          },
          provider: { "@type": "Organization", name: SITE.name, url: SITE.url },
          url: `${SITE.url}${path}`,
          description: `Crie seu perfil de advogado e apareça nas buscas por advogado em ${city.name}, ${st.uf}.`
        }}
      />
    </>
  );
}
