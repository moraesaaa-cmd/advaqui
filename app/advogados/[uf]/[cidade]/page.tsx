import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { findState } from "@/lib/data/states";
import { findCity, nearbyCities, findCapital } from "@/lib/data/cities";
import { getLawyersForCity, sortLawyers, getLawyerCountsByCity } from "@/lib/data/lawyers";
import { SPECIALTIES } from "@/lib/data/specialties";
import { LawyerCard } from "@/components/LawyerCard";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, cityServiceSchema } from "@/lib/seo/schema";
import { cityIntro } from "@/lib/data/templates";
import { topCitiesForState } from "@/lib/seo/internal-links";
import { CidadeRecursos } from "@/components/CidadeRecursos";
import { CadastroCTA } from "@/components/PlanosCTAs";

// SEMPRE AO VIVO (force-dynamic): o advogado recém-cadastrado aparece NA HORA,
// sem depender de cache/ISR — que congelava esta página (e escondia o cadastro)
// quando o disco enchia. force-dynamic renderiza por requisição e NÃO grava em
// disco, então é imune ao problema de disco cheio. Conjunto pequeno e bounded
// (cidades × poucos advogados), custo de render desprezível.
export const dynamic = "force-dynamic";

const eyebrow = "text-xs font-bold uppercase tracking-wider";

export async function generateMetadata({
  params
}: {
  params: { uf: string; cidade: string };
}) {
  const st = findState(params.uf);
  const city = findCity(params.uf, params.cidade);
  if (!st || !city)
    return buildMetadata({ title: "Cidade", description: "Cidade não encontrada", noIndex: true });
  return buildMetadata({
    title: `Advogados em ${city.name}/${st.uf}`,
    description: `Encontre advogados em ${city.name}, ${st.uf} — perfis com OAB verificada, telefone, WhatsApp e contato direto. Trabalhista, família, criminal e mais. 100% gratuito.`,
    path: `/advogados/${st.uf.toLowerCase()}/${city.slug}`
  });
}

export default async function CityPage({
  params
}: {
  params: { uf: string; cidade: string };
}) {
  const st = findState(params.uf);
  const city = findCity(params.uf, params.cidade);
  if (!st || !city) notFound();

  const allLawyers = await getLawyersForCity(st.uf, city.slug);
  const sorted = sortLawyers(allLawyers);
  const featured = sorted.filter((l) => l.planStatus === "active" || l.featured);
  const regular = sorted.filter((l) => !(l.planStatus === "active" || l.featured));
  const isEmpty = allLawyers.length === 0;
  const onlineCount = sorted.filter((l) => l.serviceModalities?.includes("online")).length;

  const neighbors = nearbyCities(city, 6);
  const capital = findCapital(st.uf);

  // Quando a cidade está vazia, sugerimos cidades vizinhas MAIORES (top cities
  // do estado) que tenham advogados cadastrados. Isso substitui o estado vazio
  // por uma ação concreta: "Veja advogados em [cidade vizinha maior]".
  const lawyerCounts = isEmpty ? await getLawyerCountsByCity(st.uf) : {};
  const fallbackSuggestions = isEmpty
    ? topCitiesForState(st, 12)
        .filter((c) => c.slug !== city.slug && (lawyerCounts[c.slug] || 0) > 0)
        .slice(0, 6)
    : [];

  const jump = [
    { href: "#advogados", label: `Ver advogados (${allLawyers.length})`, primary: true },
    { href: "#areas", label: "Áreas de atuação" },
    ...(neighbors.length > 0 ? [{ href: "#proximas", label: "Cidades próximas" }] : [])
  ];

  return (
    <div className="max-w-[1140px] mx-auto px-7">
      {/* BREADCRUMB */}
      <div className="flex gap-2 items-center text-[13px] py-[18px] flex-wrap" style={{ color: "#6B7689" }}>
        <Link href="/" className="hover:text-brand-deep">Brasil</Link>
        <span>›</span>
        <Link href="/advogados" className="hover:text-brand-deep">Diretório</Link>
        <span>›</span>
        <Link href={`/advogados/${st.uf.toLowerCase()}`} className="hover:text-brand-deep">{st.name}</Link>
        <span>›</span>
        <span style={{ color: "#1A2433", fontWeight: 600 }}>{city.name}, {st.uf}</span>
      </div>

      {/* HERO */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-10 items-start pb-3.5">
        <div>
          <div
            className="inline-flex items-center gap-2 text-[12.5px] font-semibold px-[11px] py-[5px] rounded-full mb-[18px]"
            style={{ background: "#E8EEF6", color: "#274472" }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#2E7D5B" }} />
            Diretório verificado · OAB/{st.uf}
            {city.isCapital && <span style={{ color: "#A0843A" }}>· Capital</span>}
          </div>
          <h1 className="font-display font-semibold text-3xl md:text-[42px] leading-[1.08] tracking-tight mb-4">
            Advogados em {city.name}, {st.uf}
          </h1>
          <p className="text-[17px] leading-relaxed max-w-[560px]" style={{ color: "#3C485A" }}>
            {cityIntro(city, st)}
          </p>
        </div>

        {/* BLOCO DE DADOS LOCAIS */}
        <aside
          className="bg-white rounded-[14px] p-6"
          style={{ border: "1px solid #E4E2DA", boxShadow: "0 1px 2px rgba(15,27,45,0.04)" }}
        >
          <div className={`${eyebrow} mb-[18px]`} style={{ color: "#8A93A3" }}>
            Advogados em {city.name}
          </div>
          <div className="flex gap-3.5 mb-[18px]">
            <div className="flex-1 rounded-[11px] p-3.5" style={{ background: "#F7F6F2" }}>
              <div className="font-display text-[28px] font-semibold" style={{ color: "#0F1B2D" }}>
                {allLawyers.length}
              </div>
              <div className="text-[12.5px]" style={{ color: "#6B7689" }}>cadastrados</div>
            </div>
            <div className="flex-1 rounded-[11px] p-3.5" style={{ background: "#F7F6F2" }}>
              <div className="font-display text-[28px] font-semibold" style={{ color: "#0F1B2D" }}>
                {onlineCount}
              </div>
              <div className="text-[12.5px]" style={{ color: "#6B7689" }}>atendem online</div>
            </div>
          </div>
          <div
            className="flex flex-col gap-[11px] text-[13.5px] pt-4"
            style={{ color: "#3C485A", borderTop: "1px solid #EDEBE3" }}
          >
            <div className="flex gap-2.5 items-center"><span style={{ color: "#2E7D5B" }}>✓</span> OAB verificada em cada perfil</div>
            <div className="flex gap-2.5 items-center"><span style={{ color: "#2E7D5B" }}>✓</span> Contato direto por WhatsApp</div>
            <div className="flex gap-2.5 items-center"><span style={{ color: "#2E7D5B" }}>✓</span> Sem comissão e sem intermediário</div>
          </div>
        </aside>
      </div>

      {/* JUMP BAR */}
      <div className="flex gap-2 flex-wrap py-[22px]">
        {jump.map((j) => (
          <a
            key={j.href}
            href={j.href}
            className="text-[13.5px] px-4 py-[9px] rounded-lg font-semibold"
            style={
              j.primary
                ? { background: "#0F1B2D", color: "#fff" }
                : { background: "#fff", border: "1px solid #E0DED5", color: "#3C485A", fontWeight: 400 }
            }
          >
            {j.label}
          </a>
        ))}
      </div>

      {/* DIRETÓRIO */}
      <section id="advogados" className="pb-2 scroll-mt-20">
        <div className="flex items-baseline justify-between mb-[18px] gap-3 flex-wrap">
          <h2 className="font-display font-semibold text-[27px] tracking-tight">
            Advogados em {city.name}
          </h2>
          {!isEmpty && (
            <span className="text-[13.5px]" style={{ color: "#6B7689" }}>
              Premium primeiro · depois por proximidade
            </span>
          )}
        </div>

        {isEmpty ? (
          <div className="bg-white rounded-2xl p-7" style={{ border: "1px solid #E4E2DA" }}>
            <h3 className="font-display text-xl font-semibold text-brand-ink mb-2">
              Ainda não temos advogados em {city.name}/{st.uf}
            </h3>
            <p className="text-brand-ink/70 mb-5 max-w-2xl text-[15px] leading-relaxed">
              Estamos expandindo a cobertura no interior. Enquanto isso, veja
              profissionais que atendem em cidades maiores próximas — muitos
              recebem clientes de toda a região.
            </p>

            {fallbackSuggestions.length > 0 ? (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-brand-deep mb-3 uppercase tracking-wide">
                  Veja advogados que atendem nesta região
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {fallbackSuggestions.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/advogados/${st.uf.toLowerCase()}/${c.slug}`}
                      className="group flex items-center justify-between rounded-xl border border-brand-line bg-white px-4 py-3 hover:border-brand-accent hover:shadow-card transition"
                    >
                      <div>
                        <p className="font-display text-base font-bold text-brand-ink">
                          Advogados em {c.name}
                          {c.isCapital && (
                            <span className="ml-1.5 text-xs text-brand-accent2 font-normal">capital</span>
                          )}
                        </p>
                        <p className="text-xs text-brand-ink/55 mt-0.5">{c.region || st.name}</p>
                      </div>
                      <ArrowRight
                        className="w-5 h-5 text-brand-ink/40 group-hover:text-brand-accent transition flex-shrink-0"
                        aria-hidden
                      />
                    </Link>
                  ))}
                </div>
              </div>
            ) : capital && capital.slug !== city.slug ? (
              <div className="mb-6">
                <Link
                  href={`/advogados/${st.uf.toLowerCase()}/${capital.slug}`}
                  className="group inline-flex items-center gap-2 rounded-xl border border-brand-line bg-white px-5 py-3 hover:border-brand-accent hover:shadow-card transition"
                >
                  <span className="font-display font-bold text-brand-ink">
                    Ver advogados em {capital.name}
                  </span>
                  <ArrowRight
                    className="w-4 h-4 text-brand-ink/40 group-hover:text-brand-accent transition"
                    aria-hidden
                  />
                </Link>
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3 pt-4 border-t border-brand-line">
              <CadastroCTA
                anonLabel={`É advogado em ${city.name}? Cadastre-se grátis`}
                className="inline-flex items-center text-sm font-bold px-4 py-2.5 rounded-lg"
                style={{ background: "#C8A24A", color: "#0F1B2D" }}
              />
              <Link
                href={`/advogados/${st.uf.toLowerCase()}`}
                className="inline-flex items-center text-sm font-semibold px-4 py-2.5 rounded-lg text-brand-deep bg-white"
                style={{ border: "1px solid #E0DED5" }}
              >
                Ver todas as cidades de {st.name}
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* PREMIUM — coluna única, card largo */}
            {featured.length > 0 && (
              <>
                <div className="flex items-center gap-2.5 mb-3.5">
                  <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: "#A0843A" }}>
                    <span className="text-sm">★</span> Profissionais em destaque
                  </span>
                  <span className="h-px flex-1" style={{ background: "#EFEDE5" }} />
                </div>
                <div className="flex flex-col gap-4 mb-[30px]">
                  {featured.map((l) => (
                    <LawyerCard key={l.id} lawyer={l} featured />
                  ))}
                </div>
              </>
            )}

            {/* BANNER DE CONVERSÃO */}
            <div
              className="rounded-[14px] px-[22px] py-4 mb-6 flex items-center justify-between gap-5 flex-wrap"
              style={{ background: "#0F1B2D" }}
            >
              <span className="text-sm" style={{ color: "#DDE3EC" }}>
                É advogado em {city.name}? <strong className="text-white">Apareça no topo desta página</strong> —
                perfis em destaque recebem até 5× mais contatos.
              </span>
              <Link
                href="/planos"
                className="text-[13.5px] font-bold px-4 py-[9px] rounded-lg whitespace-nowrap"
                style={{ background: "#C8A24A", color: "#0F1B2D" }}
              >
                Quero aparecer aqui
              </Link>
            </div>

            {/* GRATUITOS — grade de 2 colunas */}
            {regular.length > 0 && (
              <>
                <div className="flex items-center gap-2.5 mb-3.5">
                  <span className="text-[13px] font-semibold" style={{ color: "#5A6678" }}>
                    Outros advogados em {city.name}
                  </span>
                  <span className="h-px flex-1" style={{ background: "#EFEDE5" }} />
                </div>
                <div className="grid md:grid-cols-2 gap-3.5">
                  {regular.map((l) => (
                    <LawyerCard key={l.id} lawyer={l} featured={false} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </section>

      {/* ÁREAS DE ATUAÇÃO */}
      <section id="areas" className="pt-[42px] scroll-mt-20">
        <h2 className="font-display font-semibold text-[23px] tracking-tight mb-4">
          Advogados em {city.name} por área de atuação
        </h2>
        <div className="flex flex-wrap gap-2">
          {SPECIALTIES.map((sp) => (
            <Link
              key={sp.slug}
              href={`/advogados/${st.uf.toLowerCase()}/${city.slug}/${sp.slug}`}
              className="text-[13.5px] px-[13px] py-2 rounded-lg font-medium text-brand-ink/80 hover:text-brand-deep transition"
              style={{ background: "#F1F0EA" }}
            >
              {sp.name}
            </Link>
          ))}
        </div>
      </section>

      {/* CIDADES PRÓXIMAS */}
      {neighbors.length > 0 && (
        <section id="proximas" className="pt-[42px] scroll-mt-20">
          <h2 className="font-display font-semibold text-[23px] tracking-tight mb-4">
            Cidades próximas em {st.name}
          </h2>
          <div className="flex flex-wrap gap-2">
            {neighbors.map((c) => (
              <Link
                key={c.slug}
                href={`/advogados/${st.uf.toLowerCase()}/${c.slug}`}
                className="text-[13.5px] px-[13px] py-2 rounded-lg font-medium text-brand-ink/80 hover:text-brand-deep transition"
                style={{ background: "#F1F0EA" }}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ÁREAS MAIS PROCURADAS — grid com cards descritivos */}
      <section className="pt-[42px] scroll-mt-20">
        <h2
          className="font-display font-semibold text-[23px] tracking-tight mb-2"
          style={{ color: "#0F1B2D" }}
        >
          Áreas de atuação mais procuradas em {city.name}
        </h2>
        <p className="text-[15px] mb-5" style={{ color: "#5A6678" }}>
          Conheça as principais especialidades jurídicas com advogados atuantes na cidade.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SPECIALTIES.map((sp) => (
            <Link
              key={sp.slug}
              href={`/advogados/${st.uf.toLowerCase()}/${city.slug}/${sp.slug}`}
              className="group bg-white rounded-[14px] p-5 flex flex-col justify-between hover:shadow-md transition"
              style={{ border: "1px solid #E4E2DA" }}
            >
              <div>
                <h3
                  className="font-display font-semibold text-[17px] mb-1.5"
                  style={{ color: "#0F1B2D" }}
                >
                  {sp.name}
                </h3>
                <p
                  className="text-[13.5px] leading-relaxed line-clamp-2"
                  style={{ color: "#5A6678" }}
                >
                  {sp.intro}
                </p>
              </div>
              <span
                className="inline-flex items-center gap-1 text-[13px] font-semibold mt-3 group-hover:gap-2 transition-all"
                style={{ color: "#C8A24A" }}
              >
                Ver advogados
                <ArrowRight className="w-3.5 h-3.5" aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* TRIBUNAL E RECURSOS JURÍDICOS */}
      <section className="pt-[42px] scroll-mt-20">
        <h2
          className="font-display font-semibold text-[23px] tracking-tight mb-2"
          style={{ color: "#0F1B2D" }}
        >
          Tribunal e recursos jurídicos
        </h2>
        <p className="text-[15px] mb-5" style={{ color: "#5A6678" }}>
          Informações úteis sobre a comarca de {city.name} e ferramentas jurídicas gratuitas.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              href: `/tribunais/${st.uf.toLowerCase()}/${city.slug}`,
              title: `Fórum e Comarca de ${city.name}`,
              description: "Endereço, telefone e informações do fórum local"
            },
            {
              href: "/glossario",
              title: "Glossário jurídico",
              description: "Termos jurídicos explicados em linguagem simples"
            },
            {
              href: "/calculadoras",
              title: "Calculadoras jurídicas",
              description: "Calcule prazos, correções monetárias e valores"
            },
            {
              href: "/ferramentas",
              title: "Ferramentas gratuitas",
              description: "Modelos, checklists e guias para seu caso"
            }
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group bg-white rounded-[14px] p-5 flex items-center justify-between gap-4 hover:shadow-md transition"
              style={{ border: "1px solid #E4E2DA" }}
            >
              <div>
                <h3
                  className="font-display font-semibold text-[16px] mb-1"
                  style={{ color: "#0F1B2D" }}
                >
                  {item.title}
                </h3>
                <p className="text-[13.5px]" style={{ color: "#5A6678" }}>
                  {item.description}
                </p>
              </div>
              <ArrowRight
                className="w-4 h-4 flex-shrink-0 text-brand-ink/30 group-hover:text-brand-accent transition"
                aria-hidden
              />
            </Link>
          ))}
        </div>
      </section>

      <CidadeRecursos cityName={city.name} uf={st.uf} citySlug={city.slug} region={city.region} />

      {/* CTA ADVOGADO */}
      <section
        className="rounded-[18px] px-10 py-9 my-[42px] flex items-center justify-between gap-8 flex-wrap"
        style={{ background: "#0F1B2D" }}
      >
        <div>
          <h2 className="font-display font-semibold text-[26px] text-white tracking-tight mb-2">
            É advogado em {city.name}?
          </h2>
          <p className="text-[15px]" style={{ color: "#A9B4C6" }}>
            Apareça nesta página quando alguém procurar. Leva menos de 2 minutos e não custa nada para começar.
          </p>
          {allLawyers.length > 0 && (
            <div className="flex gap-5 mt-4 text-[13px]" style={{ color: "#7E8BA1" }}>
              <span>✓ {allLawyers.length} {allLawyers.length === 1 ? "perfil ativo" : "perfis ativos"} aqui</span>
            </div>
          )}
        </div>
        <CadastroCTA
          anonLabel="Criar meu perfil grátis"
          className="inline-block text-[15px] font-bold px-6 py-3.5 rounded-[10px] whitespace-nowrap"
          style={{ background: "#C8A24A", color: "#0F1B2D" }}
        />
      </section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Brasil", url: "/" },
          { name: "Diretório", url: "/advogados" },
          { name: st.name, url: `/advogados/${st.uf.toLowerCase()}` },
          { name: city.name, url: `/advogados/${st.uf.toLowerCase()}/${city.slug}` }
        ])}
      />
      <JsonLd data={cityServiceSchema(city.name, st.uf, allLawyers.length)} />
    </div>
  );
}
