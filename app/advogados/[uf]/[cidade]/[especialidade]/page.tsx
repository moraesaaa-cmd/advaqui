import Link from "next/link";
import { notFound } from "next/navigation";
import { findState } from "@/lib/data/states";
import { findCity, findCapital } from "@/lib/data/cities";
import { SPECIALTIES, findSpecialty } from "@/lib/data/specialties";
import { getLawyersBySpecialty, sortLawyers } from "@/lib/data/lawyers";
import { LawyerCard } from "@/components/LawyerCard";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { citySpecialtyIntro } from "@/lib/data/templates";
import { getUsefulDocsForSpecialties } from "@/lib/data/specialty-descriptions";
import { getProblemaIndex } from "@/lib/data/problema-index";
import { relatedCapitalsForSpecialty, relatedArticlesForSpecialty, toolsForSpecialty } from "@/lib/seo/internal-links";
import { getSpecialtyContent } from "@/lib/data/specialty-content";
import type { SpecialtyUrgency } from "@/lib/data/specialty-content";
import { nearbyCities } from "@/lib/data/cities";
import { getStateResources } from "@/lib/data/local-resources";
import { AlertTriangle, Clock, Info, ExternalLink } from "lucide-react";

// Sempre ao vivo (force-dynamic): o advogado por especialidade na cidade
// reflete o cadastro na hora, sem cache que congele.
export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const out: Array<{ uf: string; cidade: string; especialidade: string }> = [];
  const { getAllCities } = await import("@/lib/data/cities");
  const capitals = getAllCities().filter((c) => c.isCapital);
  for (const c of capitals) {
    for (const sp of SPECIALTIES) {
      out.push({ uf: c.uf.toLowerCase(), cidade: c.slug, especialidade: sp.slug });
    }
  }
  return out;
}

export async function generateMetadata({
  params
}: {
  params: { uf: string; cidade: string; especialidade: string };
}) {
  const st = findState(params.uf);
  const city = findCity(params.uf, params.cidade);
  const sp = findSpecialty(params.especialidade);
  if (!st || !city || !sp)
    return buildMetadata({ title: "Especialidade", description: "Não encontrado", noIndex: true });
  return buildMetadata({
    title: `Advogado ${sp.name} em ${city.name}/${st.uf}`,
    description: `Encontre advogado ${sp.name.toLowerCase()} em ${city.name}, ${st.uf} — perfis com OAB verificada, WhatsApp e contato direto. Compare profissionais e fale sem intermediário.`,
    path: `/advogados/${st.uf.toLowerCase()}/${city.slug}/${sp.slug}`
  });
}

const eyebrow = "text-xs font-bold uppercase tracking-wider";

const URGENCY_STYLES: Record<SpecialtyUrgency["level"], {
  bg: string;
  border: string;
  iconColor: string;
  badgeBg: string;
  badgeColor: string;
  textColor: string;
  label: string;
}> = {
  alta: {
    bg: "#FEF2F2",
    border: "#FECACA",
    iconColor: "#DC2626",
    badgeBg: "#DC2626",
    badgeColor: "#FFFFFF",
    textColor: "#7F1D1D",
    label: "Urgência alta"
  },
  media: {
    bg: "#FFFBEB",
    border: "#FDE68A",
    iconColor: "#D97706",
    badgeBg: "#D97706",
    badgeColor: "#FFFFFF",
    textColor: "#78350F",
    label: "Atenção ao prazo"
  },
  baixa: {
    bg: "#F0FDF4",
    border: "#BBF7D0",
    iconColor: "#16A34A",
    badgeBg: "#16A34A",
    badgeColor: "#FFFFFF",
    textColor: "#14532D",
    label: "Prazo flexível"
  }
};

function UrgencyIcon({ level }: { level: SpecialtyUrgency["level"] }) {
  const cls = "w-5 h-5 flex-shrink-0";
  switch (level) {
    case "alta":
      return <AlertTriangle className={cls} aria-hidden />;
    case "media":
      return <Clock className={cls} aria-hidden />;
    case "baixa":
      return <Info className={cls} aria-hidden />;
  }
}

export default async function CitySpecialtyPage({
  params
}: {
  params: { uf: string; cidade: string; especialidade: string };
}) {
  const st = findState(params.uf);
  const city = findCity(params.uf, params.cidade);
  const sp = findSpecialty(params.especialidade);
  if (!st || !city || !sp) notFound();

  const lawyers = sortLawyers(await getLawyersBySpecialty(st.uf, city.slug, sp.slug));
  const capital = findCapital(st.uf);
  const areaLow = sp.name.toLowerCase();

  // Partição premium × gratuito (premium primeiro, já vem de sortLawyers).
  const premium = lawyers.filter((l) => l.planStatus === "active" || l.featured);
  const free = lawyers.filter((l) => !(l.planStatus === "active" || l.featured));
  const onlineCount = lawyers.filter((l) => l.serviceModalities?.includes("online")).length;

  // Conteúdo real por área: problemas comuns + documentos úteis.
  const problemas = getProblemaIndex()
    .filter((p) => p.area === sp.slug)
    .slice(0, 5);
  const docs = getUsefulDocsForSpecialties([sp.slug], 5);

  const spContent = getSpecialtyContent(sp.slug);
  const nearby = nearbyCities(city, 6);

  const genericFaqs = [
    {
      q: `Qual o prazo para procurar um advogado ${areaLow} em ${city.name}?`,
      a: `O prazo varia conforme o tipo de caso. Em geral, quanto antes você procurar orientação, mais opções terá — alguns direitos prescrevem com o tempo. Um advogado ${areaLow} na sua cidade pode avaliar o prazo específico da sua situação.`
    },
    {
      q: `Quanto custa um advogado ${areaLow} em ${city.name}/${st.uf}?`,
      a: `Os honorários variam de acordo com o caso e o profissional. Muitos atuam por honorários de êxito (percentual sobre o resultado) ou cobram a primeira consulta. Confirme sempre a forma de cobrança no primeiro contato, direto com o advogado.`
    },
    {
      q: `Preciso ir ao fórum pessoalmente?`,
      a: `Boa parte dos atos hoje é digital, pelo Processo Judicial Eletrônico (PJe). Audiências podem ser presenciais ou por videoconferência, conforme o caso e a Vara. O advogado orienta o que é necessário.`
    }
  ];
  const faqs = [...(spContent?.faqs ?? []), ...genericFaqs];

  const jump = [
    { href: "#advogados", label: `Ver advogados (${lawyers.length})`, primary: true },
    { href: "#problemas", label: "Problemas comuns" },
    { href: "#documentos", label: "Documentos" },
    { href: "#faq", label: "Dúvidas frequentes" }
  ];

  return (
    <div className="max-w-[1140px] mx-auto px-7">
      {/* BREADCRUMB */}
      <div className="flex gap-2 items-center text-[13px] py-[18px] flex-wrap" style={{ color: "#6B7689" }}>
        <Link href="/" className="hover:text-brand-deep">Brasil</Link>
        <span>›</span>
        <Link href="/advogados" className="hover:text-brand-deep">Áreas de atuação</Link>
        <span>›</span>
        <Link href={`/advogados/${st.uf.toLowerCase()}/${city.slug}`} className="hover:text-brand-deep">
          {sp.name}
        </Link>
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
          </div>
          <h1 className="font-display font-semibold text-3xl md:text-[42px] leading-[1.08] tracking-tight mb-4">
            Advogado {areaLow} em {city.name}, {st.uf}
          </h1>
          <p className="text-[17px] leading-relaxed max-w-[560px]" style={{ color: "#3C485A" }}>
            {citySpecialtyIntro(city, st, sp)}
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
                {lawyers.length}
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

      {/* URGÊNCIA — prazo prescricional */}
      {spContent?.urgency && (() => {
        const u = spContent.urgency;
        const s = URGENCY_STYLES[u.level];
        return (
          <div
            className="rounded-[14px] px-5 py-4 mb-6 flex items-start gap-4 flex-wrap sm:flex-nowrap"
            style={{ background: s.bg, border: `1px solid ${s.border}` }}
          >
            <div className="flex items-center gap-3 flex-shrink-0 pt-0.5" style={{ color: s.iconColor }}>
              <UrgencyIcon level={u.level} />
              <span
                className="text-[12px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                style={{ background: s.badgeBg, color: s.badgeColor }}
              >
                {s.label} · {u.prazo}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14.5px] leading-relaxed" style={{ color: s.textColor }}>
                {u.alerta}
              </p>
            </div>
            <a
              href="#advogados"
              className="text-[13px] font-bold px-4 py-2 rounded-lg whitespace-nowrap flex-shrink-0 self-center"
              style={{ background: s.badgeBg, color: s.badgeColor }}
            >
              Fale com um advogado agora
            </a>
          </div>
        );
      })()}

      {/* DIRETÓRIO */}
      <section id="advogados" className="pb-2 scroll-mt-20">
        <div className="flex items-baseline justify-between mb-[18px] gap-3 flex-wrap">
          <h2 className="font-display font-semibold text-[27px] tracking-tight">
            Advogados {areaLow} em {city.name}
          </h2>
          <span className="text-[13.5px]" style={{ color: "#6B7689" }}>
            Premium primeiro · depois por proximidade
          </span>
        </div>

        {lawyers.length === 0 ? (
          <div className="bg-white rounded-2xl p-7" style={{ border: "1px solid #E4E2DA" }}>
            <h3 className="font-display text-xl font-semibold text-brand-ink mb-2">
              Ainda não há advogado {areaLow} cadastrado em {city.name}
            </h3>
            <p className="text-brand-ink/70 mb-4 max-w-2xl text-[15px] leading-relaxed">
              Esta página existe para que pessoas que procuram advogado {areaLow} em {city.name}/{st.uf}
              encontrem profissionais à medida que se cadastram. Veja advogados de outras áreas em{" "}
              {city.name} ou consulte a capital.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/advogados/${st.uf.toLowerCase()}/${city.slug}`}
                className="inline-flex items-center text-sm font-semibold px-4 py-2.5 rounded-lg text-brand-deep bg-white"
                style={{ border: "1px solid #E0DED5" }}
              >
                Ver advogados em {city.name}
              </Link>
              {capital && capital.slug !== city.slug && (
                <Link
                  href={`/advogados/${st.uf.toLowerCase()}/${capital.slug}/${sp.slug}`}
                  className="inline-flex items-center text-sm font-semibold px-4 py-2.5 rounded-lg text-brand-deep bg-white"
                  style={{ border: "1px solid #E0DED5" }}
                >
                  Ver {areaLow} em {capital.name}
                </Link>
              )}
              <Link
                href="/cadastro"
                className="inline-flex items-center text-sm font-bold px-4 py-2.5 rounded-lg"
                style={{ background: "#C8A24A", color: "#0F1B2D" }}
              >
                É advogado? Cadastre-se grátis
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* PREMIUM */}
            {premium.length > 0 && (
              <>
                <div className="flex items-center gap-2.5 mb-3.5">
                  <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: "#A0843A" }}>
                    <span className="text-sm">★</span> Profissionais em destaque
                  </span>
                  <span className="h-px flex-1" style={{ background: "#EFEDE5" }} />
                </div>
                <div className="flex flex-col gap-4 mb-[30px]">
                  {premium.map((l) => (
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
                É advogado? <strong className="text-white">Apareça no topo desta página</strong> —
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

            {/* GRATUITOS */}
            {free.length > 0 && (
              <>
                <div className="flex items-center gap-2.5 mb-3.5">
                  <span className="text-[13px] font-semibold" style={{ color: "#5A6678" }}>
                    Outros advogados em {city.name}
                  </span>
                  <span className="h-px flex-1" style={{ background: "#EFEDE5" }} />
                </div>
                <div className="grid md:grid-cols-2 gap-3.5">
                  {free.map((l) => (
                    <LawyerCard key={l.id} lawyer={l} featured={false} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </section>

      {/* PROBLEMAS + DOCUMENTOS */}
      <div className="grid md:grid-cols-2 gap-7 pt-[42px] pb-2">
        <section id="problemas" className="scroll-mt-20">
          <h2 className="font-display font-semibold text-[23px] tracking-tight mb-4">
            Problemas comuns nesta área
          </h2>
          <div className="flex flex-col gap-2.5">
            {(problemas.length > 0
              ? problemas.map((p) => ({ label: p.titulo, href: `/problemas-juridicos/${p.slug}` }))
              : [{ label: `Ver problemas de Direito ${sp.name}`, href: "/problemas-juridicos" }]
            ).map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="bg-white rounded-[11px] px-[17px] py-[15px] flex items-center gap-3 hover:border-brand-accent transition"
                style={{ border: "1px solid #E4E2DA" }}
              >
                <span className="font-bold text-[15px]" style={{ color: "#274472" }}>→</span>
                <span className="text-[14.5px] font-medium" style={{ color: "#1A2433" }}>{p.label}</span>
              </Link>
            ))}
          </div>
        </section>
        <section id="documentos" className="scroll-mt-20">
          <h2 className="font-display font-semibold text-[23px] tracking-tight mb-4">
            Documentos para o primeiro contato
          </h2>
          <div className="bg-white rounded-[14px] px-5 py-2" style={{ border: "1px solid #E4E2DA" }}>
            {(docs.length > 0 ? docs : ["RG e CPF", "Comprovante de residência", "Documentos relacionados ao caso"]).map(
              (d) => (
                <div
                  key={d}
                  className="flex items-center gap-3 py-[13px] text-[14.5px]"
                  style={{ color: "#3C485A", borderBottom: "1px solid #EDEBE3" }}
                >
                  <span className="w-[7px] h-[7px] rounded-sm" style={{ background: "#C8A24A" }} />
                  {d}
                </div>
              )
            )}
          </div>
          <Link
            href="/calculadoras"
            className="rounded-[14px] px-5 py-[18px] mt-3.5 flex items-center justify-between text-white"
            style={{ background: "#0F1B2D" }}
          >
            <div>
              <div className="font-semibold text-[15px]">Calculadoras jurídicas</div>
              <div className="text-[13px]" style={{ color: "#A9B4C6" }}>Rescisão, prazos, correção e mais</div>
            </div>
            <span className="text-[13px] font-bold px-3.5 py-[9px] rounded-lg" style={{ background: "#C8A24A", color: "#0F1B2D" }}>
              Abrir
            </span>
          </Link>
        </section>
      </div>

      {/* CONTEÚDO DA ESPECIALIDADE — anti-thin content */}
      {spContent && (
        <section className="pt-[42px] pb-2">
          <h2 className="font-display font-semibold text-[23px] tracking-tight mb-4">
            O que faz um advogado {areaLow}
          </h2>
          <div className="space-y-4 text-[15px] leading-relaxed" style={{ color: "#3C485A" }}>
            {spContent.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <h3 className="font-display font-semibold text-[19px] tracking-tight mt-8 mb-3">
            Quando procurar um advogado {areaLow} em {city.name}
          </h3>
          <p className="text-[15px] leading-relaxed mb-6" style={{ color: "#3C485A" }}>
            {spContent.whenToHire}
          </p>

          <h3 className="font-display font-semibold text-[19px] tracking-tight mb-3">
            Casos mais comuns em direito {areaLow}
          </h3>
          <div className="bg-white rounded-[14px] px-5 py-2" style={{ border: "1px solid #E4E2DA" }}>
            {spContent.commonCases.map((c) => (
              <div
                key={c}
                className="flex items-center gap-3 py-[13px] text-[14.5px]"
                style={{ color: "#3C485A", borderBottom: "1px solid #EDEBE3" }}
              >
                <span className="w-[7px] h-[7px] rounded-sm flex-shrink-0" style={{ background: "#274472" }} />
                {c}
              </div>
            ))}
          </div>

          <div
            className="rounded-[14px] px-[22px] py-4 mt-6 flex items-center justify-between gap-5 flex-wrap"
            style={{ background: "linear-gradient(135deg, #0F1B2D 0%, #1A3050 100%)" }}
          >
            <div>
              <span className="text-sm text-white font-semibold">
                Precisa de ajuda com {areaLow}?
              </span>
              <span className="text-sm ml-2" style={{ color: "#A9B4C6" }}>
                Encontre um advogado na sua região
              </span>
            </div>
            <Link
              href={`/advogados-de/${sp.slug}`}
              className="text-[13.5px] font-bold px-4 py-[9px] rounded-lg whitespace-nowrap"
              style={{ background: "#C8A24A", color: "#0F1B2D" }}
            >
              Ver em outras cidades
            </Link>
          </div>
        </section>
      )}

      {/* BLOG + FERRAMENTAS — interlinking por especialidade */}
      {(() => {
        const blogPosts = relatedArticlesForSpecialty(sp.slug, 3);
        const tools = toolsForSpecialty(sp.slug, 3);
        if (blogPosts.length === 0 && tools.length === 0) return null;
        return (
          <section className="pt-[42px] pb-2">
            {blogPosts.length > 0 && (
              <>
                <h2 className="font-display font-semibold text-[23px] tracking-tight mb-4">
                  Artigos sobre direito {areaLow}
                </h2>
                <div className="grid sm:grid-cols-3 gap-2.5 mb-6">
                  {blogPosts.map((a) => (
                    <Link
                      key={a.slug}
                      href={`/blog/${a.slug}`}
                      className="bg-white rounded-[11px] px-[17px] py-[15px] hover:border-brand-accent transition"
                      style={{ border: "1px solid #E4E2DA" }}
                    >
                      <div className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: "#8A93A3" }}>
                        Blog · {a.readingMinutes} min
                      </div>
                      <div className="text-[14.5px] font-medium leading-snug" style={{ color: "#1A2433" }}>
                        {a.title}
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
            {tools.length > 0 && (
              <>
                <h2 className="font-display font-semibold text-[23px] tracking-tight mb-4">
                  Ferramentas de {areaLow}
                </h2>
                <div className="grid sm:grid-cols-3 gap-2.5">
                  {tools.map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      className="bg-white rounded-[11px] px-[17px] py-[15px] hover:border-brand-accent transition"
                      style={{ border: "1px solid #E4E2DA" }}
                    >
                      <div className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: "#C8A24A" }}>
                        Ferramenta
                      </div>
                      <div className="text-[14.5px] font-medium leading-snug" style={{ color: "#1A2433" }}>
                        {t.label}
                      </div>
                      <div className="text-[12px] mt-1" style={{ color: "#6B7689" }}>
                        {t.desc}
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </section>
        );
      })()}

      {/* ADVOGADOS EM CIDADES PRÓXIMAS */}
      {nearby.length > 0 && (
        <section className="pt-[42px] pb-2">
          <h2 className="font-display font-semibold text-[23px] tracking-tight mb-4">
            Advogado {areaLow} em cidades próximas a {city.name}
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {nearby.map((nc) => (
              <Link
                key={nc.slug}
                href={`/advogados/${nc.uf.toLowerCase()}/${nc.slug}/${sp.slug}`}
                className="bg-white rounded-[11px] px-[17px] py-[15px] flex items-center gap-3 hover:border-brand-accent transition"
                style={{ border: "1px solid #E4E2DA" }}
              >
                <span className="font-bold text-[15px]" style={{ color: "#274472" }}>→</span>
                <span className="text-[14.5px] font-medium" style={{ color: "#1A2433" }}>
                  {nc.name}/{nc.uf}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ÓRGÃOS E RECURSOS — dados reais por estado */}
      {(() => {
        const res = getStateResources(st.uf);
        if (!res) return null;
        return (
          <section className="pt-[42px] pb-2">
            <h2 className="font-display font-semibold text-[23px] tracking-tight mb-2">
              Órgãos úteis em {city.name}, {st.uf}
            </h2>
            <p className="text-sm mb-4" style={{ color: "#6B7689" }}>
              Comarca de {city.name} — Justiça Estadual de {st.name}
            </p>
            <div className="grid sm:grid-cols-2 gap-2.5">
              <a
                href={res.tj.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-[11px] px-[17px] py-[15px] flex items-center gap-3 hover:border-brand-accent transition"
                style={{ border: "1px solid #E4E2DA" }}
              >
                <span className="text-lg">🏛️</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[14.5px] font-medium" style={{ color: "#1A2433" }}>{res.tj.name}</div>
                  <div className="text-[12px]" style={{ color: "#6B7689" }}>Tribunal de Justiça — processos, pautas, jurisprudência</div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-brand-ink/30 shrink-0" aria-hidden />
              </a>
              <a
                href={res.oab.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-[11px] px-[17px] py-[15px] flex items-center gap-3 hover:border-brand-accent transition"
                style={{ border: "1px solid #E4E2DA" }}
              >
                <span className="text-lg">⚖️</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[14.5px] font-medium" style={{ color: "#1A2433" }}>{res.oab.name}</div>
                  <div className="text-[12px]" style={{ color: "#6B7689" }}>Consulte inscrição de advogado, denúncias, tabela de honorários</div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-brand-ink/30 shrink-0" aria-hidden />
              </a>
              <a
                href={res.defensoria.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-[11px] px-[17px] py-[15px] flex items-center gap-3 hover:border-brand-accent transition"
                style={{ border: "1px solid #E4E2DA" }}
              >
                <span className="text-lg">🛡️</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[14.5px] font-medium" style={{ color: "#1A2433" }}>{res.defensoria.name}</div>
                  <div className="text-[12px]" style={{ color: "#6B7689" }}>Assistência jurídica gratuita para quem não pode pagar advogado</div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-brand-ink/30 shrink-0" aria-hidden />
              </a>
              <a
                href={res.procon.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-[11px] px-[17px] py-[15px] flex items-center gap-3 hover:border-brand-accent transition"
                style={{ border: "1px solid #E4E2DA" }}
              >
                <span className="text-lg">📋</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[14.5px] font-medium" style={{ color: "#1A2433" }}>{res.procon.name}</div>
                  <div className="text-[12px]" style={{ color: "#6B7689" }}>Reclamações de consumidor, mediação, orientação gratuita</div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-brand-ink/30 shrink-0" aria-hidden />
              </a>
            </div>
            <div className="grid sm:grid-cols-3 gap-2.5 mt-2.5">
              <a
                href={res.pje}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-[11px] px-[17px] py-[15px] flex items-center gap-3 hover:border-brand-accent transition"
                style={{ border: "1px solid #E4E2DA" }}
              >
                <span className="text-lg">💻</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[14.5px] font-medium" style={{ color: "#1A2433" }}>PJe / e-SAJ</div>
                  <div className="text-[12px]" style={{ color: "#6B7689" }}>Processo eletrônico</div>
                </div>
              </a>
              <Link
                href={`/guias/direito-${sp.slug === "criminal" ? "criminal" : sp.slug === "familia" ? "de-familia" : sp.slug}`}
                className="bg-white rounded-[11px] px-[17px] py-[15px] flex items-center gap-3 hover:border-brand-accent transition"
                style={{ border: "1px solid #E4E2DA" }}
              >
                <span className="text-lg">📘</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[14.5px] font-medium" style={{ color: "#1A2433" }}>Guia de {sp.name}</div>
                  <div className="text-[12px]" style={{ color: "#6B7689" }}>Passo a passo</div>
                </div>
              </Link>
              <Link
                href="/glossario"
                className="bg-white rounded-[11px] px-[17px] py-[15px] flex items-center gap-3 hover:border-brand-accent transition"
                style={{ border: "1px solid #E4E2DA" }}
              >
                <span className="text-lg">📖</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[14.5px] font-medium" style={{ color: "#1A2433" }}>Glossário jurídico</div>
                  <div className="text-[12px]" style={{ color: "#6B7689" }}>Termos em linguagem simples</div>
                </div>
              </Link>
            </div>
          </section>
        );
      })()}

      {/* FAQ */}
      <section id="faq" className="pt-[42px] pb-2 scroll-mt-20">
        <div className="flex items-center gap-3 mb-[18px]">
          <h2 className="font-display font-semibold text-[23px] tracking-tight">
            Dúvidas sobre direito {areaLow} em {city.name}
          </h2>
        </div>
        <div className="flex flex-col gap-2.5">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group bg-white rounded-xl px-5 py-[17px]"
              style={{ border: "1px solid #E4E2DA" }}
            >
              <summary className="flex justify-between items-center gap-4 cursor-pointer list-none">
                <span className="font-semibold text-[15.5px]" style={{ color: "#1A2433" }}>{f.q}</span>
                <span className="text-xl group-open:rotate-45 transition-transform" style={{ color: "#8A93A3" }}>+</span>
              </summary>
              <p className="text-sm leading-relaxed mt-2.5" style={{ color: "#5A6678" }}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* INTERLINK SEO — outras áreas e capitais (preserva o ranqueamento) */}
      <section className="pt-[42px]">
        <h2 className="font-display font-semibold text-lg tracking-tight mb-3">
          Outras áreas em {city.name}
        </h2>
        <div className="flex flex-wrap gap-2">
          {SPECIALTIES.filter((s) => s.slug !== sp.slug).map((s) => (
            <Link
              key={s.slug}
              href={`/advogados/${st.uf.toLowerCase()}/${city.slug}/${s.slug}`}
              className="text-[13px] px-3 py-1.5 rounded-lg text-brand-ink/80 hover:text-brand-deep transition"
              style={{ background: "#F1F0EA" }}
            >
              {s.name}
            </Link>
          ))}
        </div>
        <h2 className="font-display font-semibold text-lg tracking-tight mb-3 mt-7">
          Advogado {areaLow} em outras capitais
        </h2>
        <div className="flex flex-wrap gap-2">
          {relatedCapitalsForSpecialty(sp, st.uf, 9).map(({ city: cap, state: ostate }) => (
            <Link
              key={`${ostate.uf}-${cap.slug}`}
              href={`/advogados/${ostate.uf.toLowerCase()}/${cap.slug}/${sp.slug}`}
              className="text-[13px] px-3 py-1.5 rounded-lg text-brand-ink/80 hover:text-brand-deep transition"
              style={{ background: "#F1F0EA" }}
            >
              {cap.name}/{ostate.uf}
            </Link>
          ))}
        </div>
      </section>

      {/* CTA ADVOGADO */}
      <section
        className="rounded-[18px] px-10 py-9 my-[42px] flex items-center justify-between gap-8 flex-wrap"
        style={{ background: "#0F1B2D" }}
      >
        <div>
          <h2 className="font-display font-semibold text-[26px] text-white tracking-tight mb-2">
            É advogado {areaLow} em {city.name}?
          </h2>
          <p className="text-[15px]" style={{ color: "#A9B4C6" }}>
            Apareça nesta página quando alguém procurar. Leva menos de 2 minutos e não custa nada para começar.
          </p>
          {lawyers.length > 0 && (
            <div className="flex gap-5 mt-4 text-[13px]" style={{ color: "#7E8BA1" }}>
              <span>✓ {lawyers.length} {lawyers.length === 1 ? "perfil ativo" : "perfis ativos"} aqui</span>
            </div>
          )}
        </div>
        <Link
          href="/cadastro"
          className="text-[15px] font-bold px-6 py-3.5 rounded-[10px] whitespace-nowrap"
          style={{ background: "#C8A24A", color: "#0F1B2D" }}
        >
          Criar meu perfil grátis
        </Link>
      </section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Brasil", url: "/" },
          { name: "Diretório", url: "/advogados" },
          { name: st.name, url: `/advogados/${st.uf.toLowerCase()}` },
          { name: city.name, url: `/advogados/${st.uf.toLowerCase()}/${city.slug}` },
          { name: sp.name, url: `/advogados/${st.uf.toLowerCase()}/${city.slug}/${sp.slug}` }
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a }
          }))
        }}
      />
    </div>
  );
}
