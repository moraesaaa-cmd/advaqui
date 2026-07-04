import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Phone,
  MessageCircle,
  User,
  Globe,
  Instagram,
  Linkedin,
  Clock,
  AlertCircle,
  FileText,
  HelpCircle
} from "lucide-react";
import { findLawyerBySlug } from "@/lib/data/lawyers";
import { createAdminClient } from "@/lib/supabase/admin";
import { SPECIALTIES } from "@/lib/data/specialties";
import { getUsefulDocsForSpecialties } from "@/lib/data/specialty-descriptions";
import { DEFAULT_FAQS } from "@/lib/data/default-faqs";
import { JsonLd } from "@/components/JsonLd";
import { ExtraCitiesGroupedByUF } from "@/components/ExtraCitiesGroupedByUF";
import { ReaderQuestionForm } from "@/components/ReaderQuestionForm";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, lawyerSchema, lawyerPersonSchema } from "@/lib/seo/schema";
import { whatsappLink, telLink, formatDate } from "@/lib/utils/format";
import { SITE } from "@/lib/config";

/**
 * Página Profissional AdvAqui — URL canônica `/advogado/[slug]`.
 * Redesign claude_design (Apex): capa navy + coluna principal + sidebar fixa.
 *
 * Linguagem sóbria conforme Provimento OAB 205/2021. Diferenciais premium
 * (WhatsApp clicável, e-mail, presença digital, artigos, perguntas, atendimento)
 * seguem gated por `featured`. Nota/avaliações/formação/anos NÃO existem no
 * banco e NÃO são inventados — só exibimos dado real do profissional.
 */
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const l = await findLawyerBySlug(params.slug);
  if (!l)
    return buildMetadata({
      title: "Página Profissional",
      description: "Página não encontrada",
      noIndex: true
    });
  const isPaused = l.pageStatus === "paused" || l.isPublic === false;
  const noIndex = isPaused || l.isIndexable === false;
  if (isPaused) {
    return buildMetadata({
      title: "Página Profissional indisponível",
      description: "Esta Página Profissional não está disponível no momento.",
      path: `/advogado/${l.slug}`,
      noIndex: true
    });
  }
  const primarySlug =
    Array.isArray(l.primarySpecialties) && l.primarySpecialties[0]
      ? l.primarySpecialties[0]
      : l.specialties[0];
  const mainArea = primarySlug
    ? SPECIALTIES.find((s) => s.slug === primarySlug)?.name
    : undefined;
  const isFem = (l.name.trim().split(" ")[0] || "").toLowerCase().endsWith("a");
  const titleArea = mainArea
    ? `Advogad${isFem ? "a" : "o"} ${mainArea}`
    : `Advogad${isFem ? "a" : "o"}`;
  const title = `${l.name} — ${titleArea} em ${l.cityName}/${l.uf}`;
  const description =
    l.shortSummary ||
    l.bio ||
    `Perfil profissional de ${l.name}, OAB/${l.oabUf} ${l.oab}, com atuação em ${
      mainArea || "Direito"
    } em ${l.cityName}/${l.uf} e região.`;
  return buildMetadata({
    title,
    description,
    path: `/advogado/${l.slug}`,
    noIndex
  });
}

const labelOf = (slug: string) =>
  SPECIALTIES.find((s) => s.slug === slug)?.name || slug;

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (a + b).toUpperCase();
}

type PublicArticle = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  specialty_slug: string | null;
  published_at: string | null;
  read_time_minutes: number | null;
};
async function fetchPublishedArticles(lawyerId: string): Promise<PublicArticle[]> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("lawyer_articles")
      .select("id,slug,title,summary,specialty_slug,published_at,read_time_minutes")
      .eq("lawyer_id", lawyerId)
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(20);
    if (error) return [];
    return (data as PublicArticle[]) || [];
  } catch {
    return [];
  }
}

type PublicQuestion = {
  id: string;
  question: string;
  answer: string;
  answered_at: string | null;
};
async function fetchAnsweredQuestions(lawyerId: string): Promise<PublicQuestion[]> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("lawyer_questions")
      .select("id,question,answer,answered_at")
      .eq("lawyer_id", lawyerId)
      .eq("status", "answered")
      .order("answered_at", { ascending: false })
      .limit(10);
    if (error) return [];
    return (data as PublicQuestion[]) || [];
  } catch {
    return [];
  }
}

export default async function ProfessionalPage({
  params
}: {
  params: { slug: string };
}) {
  const l = await findLawyerBySlug(params.slug);
  if (!l) notFound();

  // Página pausada / não-pública → mensagem neutra e fim.
  const isPaused = l.pageStatus === "paused" || l.isPublic === false;
  if (isPaused) {
    return (
      <div className="container-narrow py-16">
        <article className="card text-center">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-brand-ink mb-3">
            Página Profissional indisponível
          </h1>
          <p className="text-sm md:text-base text-brand-ink/75 max-w-md mx-auto">
            Esta Página Profissional não está disponível no momento. Volte mais
            tarde ou utilize o diretório para encontrar outros profissionais.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link href="/advogados" className="btn-accent text-sm inline-flex items-center gap-2">
              Ver diretório
            </Link>
            <Link href="/" className="btn-ghost border border-brand-line text-sm">
              Voltar para a home
            </Link>
          </div>
        </article>
      </div>
    );
  }

  const featured = l.planStatus === "active" || l.featured;
  const wa = whatsappLink(
    l.whatsapp || l.phone,
    `Olá ${l.name}, encontrei seu perfil no ${SITE.name} e gostaria de conversar.`
  );
  const tel = telLink(l.phone);

  const showAddress = l.showAddress ?? true;
  const showAddressFull = l.showAddressFull ?? true;
  const showEmail = l.showEmail ?? true;
  const showPhone = l.showPhone ?? true;
  const showExtraCities = l.showExtraCities ?? true;
  const showUsefulDocs = l.showUsefulDocs ?? true;

  const usefulDocs = showUsefulDocs ? getUsefulDocsForSpecialties(l.specialties, 8) : [];

  const primaryList =
    Array.isArray(l.primarySpecialties) && l.primarySpecialties.length > 0
      ? l.primarySpecialties.filter((s) => l.specialties.includes(s)).slice(0, 3)
      : l.specialties.slice(0, 3);
  const otherList = l.specialties.filter((s) => !primaryList.includes(s));
  const mainAreaSlug = primaryList[0] || l.specialties[0];
  const mainArea = mainAreaSlug ? labelOf(mainAreaSlug) : null;
  const isFem = (l.name.trim().split(" ")[0] || "").toLowerCase().endsWith("a");
  const advWord = `Advogad${isFem ? "a" : "o"}`;

  // Artigos e perguntas em PARALELO (antes eram dois awaits sequenciais, o que
  // dobrava o TTFB e fazia a página cair no fallback de loading com mais
  // frequência — causa do "Carregando… fora de ordem" percebido pelo usuário).
  const [articles, answeredQuestions] = await Promise.all([
    featured && (l.showArticles ?? true) ? fetchPublishedArticles(l.id) : Promise.resolve([]),
    featured && (l.showQuestions ?? true) ? fetchAnsweredQuestions(l.id) : Promise.resolve([])
  ]);

  // Destaques reais (sem inventar números). Só para premium.
  const modalLabel = (() => {
    const m = l.serviceModalities;
    if (!m || m.length === 0) return null;
    if (m.includes("in_person") && m.includes("online")) return "Pres. + Online";
    if (m.includes("online")) return "Online";
    return "Presencial";
  })();
  const highlights: Array<{ value: string; label: string }> = [];
  const areaCount = l.primarySpecialties?.length || l.specialties.length;
  if (areaCount) highlights.push({ value: String(areaCount), label: areaCount === 1 ? "área de atuação" : "áreas de atuação" });
  if (modalLabel) highlights.push({ value: modalLabel, label: "atendimento" });
  if (l.verifiedOab) highlights.push({ value: "OAB", label: "verificada" });
  highlights.push({ value: l.cityName, label: "cidade base" });

  const sectionTitle = "font-display text-xl md:text-[22px] font-semibold text-brand-ink";
  const cardCls = "bg-white border border-brand-line rounded-[14px] p-6 md:p-7";

  return (
    <>
      {/* ===== CAPA NAVY ===== */}
      <div style={{ background: "linear-gradient(110deg,#0F1B2D 0%,#1B2D49 100%)" }} className="text-white">
        <div className="max-w-[1140px] mx-auto px-7 pt-[34px]">
          {/* breadcrumb */}
          <div className="flex gap-2 items-center text-[13px] mb-6 flex-wrap" style={{ color: "#CBD5E6" }}>
            <Link href={`/advogados/${l.uf.toLowerCase()}/${l.citySlug}`} className="hover:text-white">
              {l.cityName}, {l.uf}
            </Link>
            {mainArea && (
              <>
                <span>›</span>
                <span>{mainArea}</span>
              </>
            )}
            <span>›</span>
            <span style={{ color: "#fff", fontWeight: 600 }}>{l.name}</span>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-[26px] md:items-end pb-7">
            {/* avatar */}
            {l.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={l.photoUrl}
                alt={l.photoAltText || `Foto de ${l.name}`}
                loading="eager"
                decoding="async"
                className="w-[108px] h-[108px] rounded-[18px] object-cover flex-shrink-0"
                style={{ border: "3px solid rgba(200,162,74,0.55)" }}
              />
            ) : (
              <div
                className="w-[108px] h-[108px] rounded-[18px] flex items-center justify-center font-display text-[42px] font-semibold text-white flex-shrink-0"
                style={{ background: "#274472", border: "3px solid rgba(200,162,74,0.55)" }}
                aria-hidden
              >
                {initialsOf(l.name) || <User className="w-12 h-12" aria-hidden />}
              </div>
            )}

            <div className="flex-1 min-w-0">
              {featured && (
                <div
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-[11px] py-[5px] rounded-full mb-2.5"
                  style={{ background: "rgba(200,162,74,0.18)", color: "#E3C078", letterSpacing: "0.04em" }}
                >
                  ★ PERFIL PREMIUM
                </div>
              )}
              <h1 className="font-display font-semibold text-3xl md:text-[36px] tracking-tight mb-1.5">
                {l.name}
              </h1>
              <div className="text-[15px]" style={{ color: "#C2CBDA" }}>
                {advWord}
                {mainArea ? ` ${mainArea}` : ""} · OAB/{l.oabUf} {l.oab}
                {!l.verifiedOab && (
                  <span className="ml-1.5 text-[12px]" style={{ color: "#7E8BA1" }}>
                    (informada pelo profissional)
                  </span>
                )}
              </div>
              <div className="flex gap-[18px] mt-3.5 text-[13.5px] flex-wrap" style={{ color: "#CBD5E6" }}>
                {l.verifiedOab && <span>✓ OAB verificada</span>}
                {modalLabel && <span>{modalLabel}</span>}
                <span>📍 {l.cityName}/{l.uf}</span>
              </div>
            </div>

            {/* CTA (premium) */}
            {featured && wa && (
              <div className="flex flex-col gap-2 pb-1">
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 text-white text-[15px] font-semibold px-[26px] py-[13px] rounded-[10px]"
                  style={{ background: "#25D366" }}
                >
                  <MessageCircle className="w-4 h-4" aria-hidden /> Falar agora
                </a>
                <span className="text-center text-[12.5px]" style={{ color: "#CBD5E6" }}>
                  Sem custo de contato
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== CORPO ===== */}
      <div
        className={`max-w-[1140px] mx-auto px-7 py-8 grid gap-9 items-start ${
          featured ? "lg:grid-cols-[1fr_330px]" : ""
        }`}
      >
        {/* COLUNA PRINCIPAL */}
        <div className="flex flex-col gap-7 min-w-0">
          {/* destaques (premium) */}
          {featured && highlights.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {highlights.slice(0, 4).map((h) => (
                <div key={h.label} className="bg-white border border-brand-line rounded-xl p-4">
                  <div className="font-display text-[20px] md:text-[24px] font-semibold truncate" style={{ color: "#0F1B2D" }}>
                    {h.value}
                  </div>
                  <div className="text-[12.5px] mt-0.5" style={{ color: "#6B7689" }}>{h.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* upsell (free) */}
          {!featured && (
            <div className="rounded-2xl border border-brand-accent/40 bg-brand-accent/5 p-5">
              <p className="text-sm font-semibold text-brand-ink">
                Quer aparecer no topo de {l.cityName} e ter WhatsApp clicável no perfil?
              </p>
              <p className="text-xs text-brand-ink/70 mt-1.5 mb-3">
                O plano premium (<strong>R$ 19,90/mês</strong>, sem fidelidade) coloca seu perfil em
                destaque, libera botão WhatsApp clicável, bio completa e selo de OAB verificada.
              </p>
              <Link href="/planos" className="text-sm font-medium text-brand-deep underline">
                Conhecer o plano premium
              </Link>
            </div>
          )}

          {/* Sobre */}
          {l.bio && (
            <section className={cardCls}>
              <h2 className={`${sectionTitle} mb-3`}>Sobre</h2>
              <p className="text-[15.5px] leading-relaxed whitespace-pre-line" style={{ color: "#3C485A" }}>
                {l.bio}
              </p>
            </section>
          )}

          {/* Áreas de atuação */}
          {l.specialties.length > 0 && (
            <section>
              <h2 className={`${sectionTitle} mb-4`}>Áreas de atuação</h2>
              <div className="flex flex-wrap gap-2.5">
                {primaryList.map((s) => (
                  <span
                    key={`p-${s}`}
                    className="text-sm px-4 py-2.5 rounded-[9px] font-medium"
                    style={{ background: "#0F1B2D", color: "#fff" }}
                  >
                    {labelOf(s)}
                  </span>
                ))}
                {otherList.map((s) => (
                  <span
                    key={`o-${s}`}
                    className="text-sm px-4 py-2.5 rounded-[9px] bg-white"
                    style={{ border: "1px solid #E0DED5", color: "#3C485A" }}
                  >
                    {labelOf(s)}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Contato (free — sem WhatsApp clicável) */}
          {!featured && (
            <section className={cardCls}>
              <h2 className={`${sectionTitle} mb-4`}>Contato</h2>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                {showAddress && (
                  <div className="flex items-center gap-3 rounded-xl border border-brand-line p-3">
                    <MapPin className="w-4 h-4 text-brand-ink/50 flex-shrink-0" aria-hidden />
                    <span>
                      {l.address && showAddressFull ? `${l.address} — ` : ""}
                      {l.cityName}/{l.uf}
                    </span>
                  </div>
                )}
                {showPhone && tel && (
                  <a href={tel} className="flex items-center gap-3 rounded-xl border border-brand-line p-3 hover:border-brand-accent transition">
                    <Phone className="w-4 h-4 text-brand-ink/50 flex-shrink-0" aria-hidden />
                    <span>{l.phone}</span>
                  </a>
                )}
              </div>
            </section>
          )}

          {/* Como funciona o atendimento (premium, navy) */}
          {featured && (
            <section className="rounded-[14px] p-6 md:p-7 text-white" style={{ background: "#0F1B2D" }}>
              <h2 className="font-display text-xl md:text-[22px] font-semibold mb-[18px]">
                Como funciona o atendimento
              </h2>
              <div className="flex flex-col gap-4">
                {[
                  { n: "1", t: "Você manda sua situação no WhatsApp", d: "Sem compromisso. Explique do seu jeito o que aconteceu." },
                  { n: "2", t: "O profissional avalia e responde", d: "Recebe a mensagem, analisa as informações iniciais e retorna o contato." },
                  { n: "3", t: "Vocês combinam os próximos passos", d: "Honorários e atendimento são tratados diretamente, sem intermediário e sem comissão." }
                ].map((s) => (
                  <div key={s.n} className="flex gap-3.5 items-start">
                    <span className="font-display text-lg flex-shrink-0" style={{ color: "#C8A24A" }}>{s.n}</span>
                    <div>
                      <div className="font-semibold text-[15px]">{s.t}</div>
                      <div className="text-[13.5px] leading-relaxed" style={{ color: "#A9B4C6" }}>{s.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Região / extra cities (premium) */}
          {featured && showExtraCities && l.extraCities && l.extraCities.length > 0 && (
            <section className={cardCls}>
              <h2 className={`${sectionTitle} mb-3`}>Também atende em</h2>
              {l.extraCities.length >= 5 ? (
                <ExtraCitiesGroupedByUF cities={l.extraCities} />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {l.extraCities.map((c) => (
                    <Link
                      key={`${c.uf}-${c.slug}`}
                      href={`/advogados/${c.uf.toLowerCase()}/${c.slug}`}
                      className="text-sm px-3 py-1.5 rounded-lg bg-white hover:text-brand-deep transition"
                      style={{ border: "1px solid #E0DED5", color: "#3C485A" }}
                    >
                      {c.name}/{c.uf}
                    </Link>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Artigos (premium) */}
          {featured && (l.showArticles ?? true) && articles.length > 0 && (
            <section>
              <h2 className={`${sectionTitle} mb-3 inline-flex items-center gap-2`}>
                <FileText className="w-5 h-5 text-brand-deep" aria-hidden />
                Artigos informativos
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {articles.map((a) => (
                  <Link
                    key={a.id}
                    href={`/advogado/${l.slug}/artigos/${a.slug}`}
                    className="block rounded-xl border border-brand-line bg-white p-4 hover:border-brand-deep transition group"
                  >
                    {a.specialty_slug && (
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wide text-brand-deep mb-1.5">
                        {labelOf(a.specialty_slug)}
                      </span>
                    )}
                    <h3 className="font-display text-sm md:text-base font-bold text-brand-ink group-hover:text-brand-deep transition">
                      {a.title}
                    </h3>
                    {a.summary && (
                      <p className="text-xs md:text-sm text-brand-ink/70 leading-relaxed mt-1 line-clamp-3">
                        {a.summary}
                      </p>
                    )}
                    {a.read_time_minutes ? (
                      <p className="text-xs text-brand-ink/55 mt-2">{a.read_time_minutes} min de leitura</p>
                    ) : null}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Perguntas frequentes (premium) */}
          {featured && (l.showFaqs ?? true) && (
            <section>
              <h2 className={`${sectionTitle} mb-4`}>Perguntas que costumo responder</h2>
              <div className="flex flex-col gap-2.5">
                {DEFAULT_FAQS.map((faq, idx) => (
                  <details
                    key={`faq-${idx}`}
                    className="group bg-white rounded-xl px-5 py-[17px]"
                    style={{ border: "1px solid #E4E2DA" }}
                  >
                    <summary className="cursor-pointer font-semibold text-[15px] text-brand-ink list-none flex items-center justify-between gap-2">
                      {faq.question}
                      <span aria-hidden className="text-brand-deep text-lg group-open:rotate-45 transition-transform">+</span>
                    </summary>
                    <p className="mt-2 text-sm text-brand-ink/80 leading-relaxed">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Perguntas de leitores (premium) */}
          {featured && (l.showQuestions ?? true) && (
            <section>
              <h2 className={`${sectionTitle} mb-3 inline-flex items-center gap-2`}>
                <HelpCircle className="w-5 h-5 text-brand-deep" aria-hidden />
                Perguntas de leitores
              </h2>
              <p className="text-sm text-brand-ink/65 mb-4">
                Esclarecimentos de caráter educativo, que não substituem consulta jurídica individual.
              </p>
              {answeredQuestions.length > 0 && (
                <div className="flex flex-col gap-3 mb-5">
                  {answeredQuestions.map((q) => (
                    <article key={q.id} className="rounded-xl border border-brand-line bg-white p-4">
                      <p className="font-semibold text-brand-ink text-sm md:text-base">{q.question}</p>
                      <p className="mt-2 text-sm text-brand-ink/80 whitespace-pre-line leading-relaxed">{q.answer}</p>
                      {q.answered_at && (
                        <p className="text-[11px] text-brand-ink/50 mt-2">
                          Respondida em {new Date(q.answered_at).toLocaleDateString("pt-BR")}
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              )}
              {l.allowQuestions !== false && (
                <>
                  <h3 className="font-semibold text-sm md:text-base text-brand-ink mb-2">Enviar uma pergunta</h3>
                  <ReaderQuestionForm lawyerSlug={l.slug} />
                </>
              )}
            </section>
          )}

          {/* Documentos úteis */}
          {usefulDocs.length > 0 && l.specialties.length > 0 && (
            <section className={cardCls}>
              <h2 className={`${sectionTitle} mb-2 inline-flex items-center gap-2`}>
                <FileText className="w-5 h-5 text-brand-deep" aria-hidden />
                Documentos úteis para o primeiro contato
              </h2>
              <p className="text-sm text-brand-ink/65 mb-3">
                Lista informativa de documentos comuns nas áreas em que este profissional atua. Pode
                variar conforme o caso.
              </p>
              <ul className="grid sm:grid-cols-2 gap-2 mb-3">
                {usefulDocs.map((doc) => (
                  <li key={doc} className="text-sm text-brand-ink/85 flex items-start gap-2">
                    <span className="mt-0.5" style={{ color: "#C8A24A" }}>•</span>
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg p-3">
                <strong>Atenção:</strong> evite enviar dados sensíveis (CPF completo, comprovantes
                bancários, fotos pessoais) antes de orientação individual do profissional.
              </p>
            </section>
          )}

          {/* Presença digital (premium) */}
          {featured && (l.website || l.instagram || l.linkedin) && (
            <section>
              <h2 className={`${sectionTitle} mb-3`}>Presença digital</h2>
              <div className="flex flex-wrap gap-2">
                {l.website && (
                  <a href={l.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-brand-line bg-white hover:border-brand-accent transition text-sm text-brand-ink">
                    <Globe className="w-4 h-4 text-brand-deep" aria-hidden /> Site oficial
                  </a>
                )}
                {l.instagram && (
                  <a href={`https://instagram.com/${l.instagram}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-brand-line bg-white hover:border-brand-accent transition text-sm text-brand-ink">
                    <Instagram className="w-4 h-4 text-pink-600" aria-hidden /> @{l.instagram}
                  </a>
                )}
                {l.linkedin && (
                  <a
                    href={l.linkedin.startsWith("http") ? l.linkedin : `https://linkedin.com/in/${l.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-brand-line bg-white hover:border-brand-accent transition text-sm text-brand-ink"
                  >
                    <Linkedin className="w-4 h-4 text-blue-700" aria-hidden /> LinkedIn
                  </a>
                )}
              </div>
            </section>
          )}

          {/* Aviso ético */}
          <aside className="rounded-xl border-l-4 border-amber-400 bg-amber-50 p-4 text-xs md:text-sm text-amber-900 leading-relaxed" role="note">
            <p className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden />
              <span>
                As informações desta página têm caráter exclusivamente informativo e não substituem
                consulta individual com profissional habilitado. O contato inicial não implica
                contratação automática de serviços jurídicos.
              </span>
            </p>
          </aside>

          {/* Rodapé institucional */}
          <footer className="pt-2 border-t border-brand-line">
            <p className="text-xs text-brand-ink/60 mb-3 mt-4">
              Perfil cadastrado em {formatDate(l.createdAt)}.
              {l.updatedAt && l.updatedAt !== l.createdAt && (
                <> Última atualização em {formatDate(l.updatedAt)}.</>
              )}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
              <Link href="/contato" className="text-brand-deep hover:text-brand-accent2 underline-offset-2 hover:underline">
                Corrigir ou denunciar informação
              </Link>
              <Link href="/termos" className="text-brand-deep hover:text-brand-accent2 underline-offset-2 hover:underline">
                Termos de uso
              </Link>
              <Link href="/privacidade" className="text-brand-deep hover:text-brand-accent2 underline-offset-2 hover:underline">
                Política de privacidade
              </Link>
              <Link href="/" className="text-brand-deep hover:text-brand-accent2 underline-offset-2 hover:underline">
                Sobre o AdvAqui
              </Link>
            </div>
          </footer>
        </div>

        {/* SIDEBAR (premium) */}
        {featured && (
          <aside className="flex flex-col gap-[18px] lg:sticky lg:top-20">
            <div className={cardCls.replace("p-6 md:p-7", "p-[22px]")}>
              <div className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "#8A93A3" }}>
                Contato direto
              </div>
              <div className="flex flex-col gap-3 text-sm">
                {showPhone && l.phone && (
                  <div>
                    <div className="text-[12.5px]" style={{ color: "#6B7689" }}>WhatsApp / telefone</div>
                    <div className="font-semibold">{l.phone}</div>
                  </div>
                )}
                <div>
                  <div className="text-[12.5px]" style={{ color: "#6B7689" }}>E-mail</div>
                  <div className="font-semibold break-all">
                    {showEmail ? l.email : "Disponível após o contato"}
                  </div>
                </div>
                {showAddress && (
                  <div>
                    <div className="text-[12.5px]" style={{ color: "#6B7689" }}>Escritório</div>
                    <div className="font-semibold leading-snug">
                      {l.address && showAddressFull ? `${l.address} — ` : ""}
                      {l.cityName}/{l.uf}
                    </div>
                  </div>
                )}
              </div>
              {wa && (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-white text-[14.5px] font-semibold py-3 rounded-[10px] mt-[18px]"
                  style={{ background: "#25D366" }}
                >
                  <MessageCircle className="w-4 h-4" aria-hidden /> Falar no WhatsApp
                </a>
              )}
            </div>

            <div className={cardCls.replace("p-6 md:p-7", "p-[22px]")}>
              <div className="text-xs font-bold uppercase tracking-wider mb-3.5" style={{ color: "#8A93A3" }}>
                Atendimento
              </div>
              <div className="flex flex-col gap-[11px] text-sm" style={{ color: "#3C485A" }}>
                <div className="flex justify-between">
                  <span>Presencial</span>
                  <span className="font-semibold">{l.cityName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Online</span>
                  <span className="font-semibold" style={{ color: l.serviceModalities?.includes("online") ? "#2E7D5B" : undefined }}>
                    {l.serviceModalities?.includes("online") ? "Sim" : "—"}
                  </span>
                </div>
                {l.officeHours && (
                  <div className="flex justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" aria-hidden /> Horário
                    </span>
                    <span className="font-semibold text-right whitespace-pre-line">{l.officeHours}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[14px] px-5 py-[18px] text-[13px] leading-relaxed" style={{ background: "#FBF6EA", border: "1px solid #EAD9A8", color: "#7A6326" }}>
              <strong style={{ color: "#5E4C18" }}>Perfil Premium</strong> — aparece no topo das buscas
              da cidade, com foto, áreas e botão de WhatsApp em destaque.
            </div>
          </aside>
        )}
      </div>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Brasil", url: "/" },
          { name: "Diretório", url: "/advogados" },
          { name: l.uf, url: `/advogados/${l.uf.toLowerCase()}` },
          { name: l.cityName, url: `/advogados/${l.uf.toLowerCase()}/${l.citySlug}` },
          { name: l.name, url: `/advogado/${l.slug}` }
        ])}
      />
      <JsonLd data={lawyerSchema(l)} />
      <JsonLd data={lawyerPersonSchema(l)} />
      {featured && (l.showFaqs ?? true) && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: DEFAULT_FAQS.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer }
            }))
          }}
        />
      )}
    </>
  );
}
