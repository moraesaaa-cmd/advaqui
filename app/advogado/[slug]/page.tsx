import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Phone,
  Mail,
  Star,
  ShieldCheck,
  MessageCircle,
  User,
  Globe,
  Instagram,
  Linkedin,
  Clock,
  AlertCircle,
  FileText,
  HelpCircle,
  Briefcase,
  Building2
} from "lucide-react";
import { findLawyerBySlug } from "@/lib/data/lawyers";
import { createAdminClient } from "@/lib/supabase/admin";
import { SPECIALTIES } from "@/lib/data/specialties";
import {
  getSpecialtyDescription,
  getUsefulDocsForSpecialties
} from "@/lib/data/specialty-descriptions";
import { DEFAULT_FAQS } from "@/lib/data/default-faqs";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { ShareLinkButton } from "@/components/ShareLinkButton";
import { ExtraCitiesGroupedByUF } from "@/components/ExtraCitiesGroupedByUF";
import { ReaderQuestionForm } from "@/components/ReaderQuestionForm";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, lawyerSchema } from "@/lib/seo/schema";
import { whatsappLink, telLink, formatDate } from "@/lib/utils/format";
import { SITE } from "@/lib/config";

/**
 * Página Profissional AdvAqui — URL canônica `/advogado/[slug]` (Maio/2026 v2).
 *
 * Versão expandida (Fase 2 do produto). Agora estruturada em seções:
 *   1. Cabeçalho profissional
 *   2. Sobre o profissional (bio)
 *   3. Como funciona o contato inicial (orientação ética)
 *   4. Áreas de atuação em cards com descrição
 *   5. Região de atendimento
 *   6. Documentos úteis para o primeiro contato
 *   7. Aviso ético
 *   8. Rodapé institucional
 *
 * Linguagem sóbria conforme Provimento OAB 205/2021.
 *
 * SEO básico: title, meta description, canonical, Open Graph, breadcrumbs,
 * LegalService schema. FAQ Schema fica pra rodada que liberar FAQs próprios
 * do advogado (depende de migration 0006).
 */
// SEMPRE AO VIVO (force-dynamic): o perfil reflete cadastro/edições NA HORA,
// sem cache que possa congelar (e sumir quando o disco enchia). Renderiza por
// requisição e NÃO grava em disco — imune a disco cheio.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const l = await findLawyerBySlug(params.slug);
  if (!l)
    return buildMetadata({
      title: "Página Profissional",
      description: "Página não encontrada",
      noIndex: true
    });
  // Quando pausada/não-indexável, mostra título genérico e marca noindex.
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
  // Title — usa área principal (1º item de primarySpecialties se houver, senão
  // 1º slug de specialties) pra ficar Advogado [Área] em [Cidade]/[UF].
  const primarySlug =
    Array.isArray(l.primarySpecialties) && l.primarySpecialties[0]
      ? l.primarySpecialties[0]
      : l.specialties[0];
  const mainArea = primarySlug
    ? SPECIALTIES.find((s) => s.slug === primarySlug)?.name
    : undefined;
  // Feminino quando nome do advogado termina em "a"
  const isFem = l.name.toLowerCase().endsWith("a");
  const titleArea = mainArea
    ? `Advogad${isFem ? "a" : "o"} ${mainArea}`
    : `Advogad${isFem ? "a" : "o"}`;
  const title = `${l.name} — ${titleArea} em ${l.cityName}/${l.uf}`;
  // Description — usa shortSummary se houver, senão bio, senão template.
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

/**
 * Busca artigos publicados pelo advogado. Defensive: se a tabela
 * lawyer_articles ainda não existe (migration 0006 pendente), retorna [].
 */
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
    if (error) {
      // Tabela ainda não existe? Trate como lista vazia.
      return [];
    }
    return (data as PublicArticle[]) || [];
  } catch {
    return [];
  }
}

/**
 * Busca perguntas respondidas pelo advogado (status='answered'). Defensive
 * igual ao fetch de artigos.
 */
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

  // Página pausada / não-pública → mensagem neutra e fim. Sem dados pessoais
  // expostos, sem schema de LegalService. Defensive: usa pageStatus se a
  // migration 0006 foi aplicada, senão respeita is_public como fallback.
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
            <Link
              href="/advogados"
              className="btn-accent text-sm inline-flex items-center gap-2"
            >
              Ver diretório
            </Link>
            <Link
              href="/"
              className="btn-ghost border border-brand-line text-sm"
            >
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
  const publicUrl = `${SITE.url}/advogado/${l.slug}`;

  // ----- Defaults pra display preferences -----
  // Premium-only respeitam as flags do banco. Quando vêm undefined (migration
  // 0006 não aplicada ou advogado free), tudo aparece (default true).
  const showAddress = l.showAddress ?? true;
  const showAddressFull = l.showAddressFull ?? true;
  const showEmail = l.showEmail ?? true;
  const showPhone = l.showPhone ?? true;
  const showExtraCities = l.showExtraCities ?? true;
  const showUsefulDocs = l.showUsefulDocs ?? true;

  const usefulDocs = showUsefulDocs
    ? getUsefulDocsForSpecialties(l.specialties, 8)
    : [];

  // ----- Separação áreas principais (até 3) × outras áreas -----
  const primaryList =
    Array.isArray(l.primarySpecialties) && l.primarySpecialties.length > 0
      ? l.primarySpecialties.filter((s) => l.specialties.includes(s)).slice(0, 3)
      : l.specialties.slice(0, 3);
  const otherList = l.specialties.filter((s) => !primaryList.includes(s));

  // Linguagem do título da área principal usado em h2
  const mainAreaSlug = primaryList[0] || l.specialties[0];
  const mainArea = mainAreaSlug
    ? SPECIALTIES.find((s) => s.slug === mainAreaSlug)?.name
    : null;

  // Conteúdo dinâmico (Fase 3) — busca em paralelo para não atrasar SSG.
  // Sem await Promise.all pra manter código simples; o Next.js otimiza.
  const articles =
    featured && (l.showArticles ?? true) ? await fetchPublishedArticles(l.id) : [];
  const answeredQuestions =
    featured && (l.showQuestions ?? true) ? await fetchAnsweredQuestions(l.id) : [];

  return (
    <div className="container-narrow py-10">
      <Breadcrumb
        items={[
          { label: "Diretório", href: "/advogados" },
          { label: l.uf, href: `/advogados/${l.uf.toLowerCase()}` },
          { label: l.cityName, href: `/advogados/${l.uf.toLowerCase()}/${l.citySlug}` },
          { label: l.name }
        ]}
      />

      {/* ===== 1. CABEÇALHO PROFISSIONAL ===== */}
      <article className="card">
        <header className="flex flex-col sm:flex-row items-start gap-5">
          {l.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={l.photoUrl}
              alt={`Foto de ${l.name}`}
              loading="eager"
              decoding="async"
              className={`w-32 h-32 md:w-36 md:h-36 rounded-2xl object-cover flex-shrink-0 bg-brand-bg ${
                featured ? "ring-2 ring-brand-accent border-2 border-white shadow-card" : "border-2 border-brand-line"
              }`}
              style={{ imageRendering: "auto" }}
            />
          ) : (
            <div className="w-32 h-32 md:w-36 md:h-36 rounded-2xl bg-brand-deep/10 flex items-center justify-center flex-shrink-0" aria-hidden>
              <User className="w-16 h-16 text-brand-deep" aria-hidden />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center flex-wrap gap-2">
              <h1 className="font-display text-3xl font-bold text-brand-ink">{l.name}</h1>
              {featured && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-brand-accent text-brand-ink">
                  <Star className="w-3.5 h-3.5" aria-hidden /> Destaque
                </span>
              )}
              {featured && l.verifiedOab && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" aria-hidden /> OAB verificada
                </span>
              )}
            </div>
            <p className="text-brand-ink/70 mt-1">
              OAB/{l.oabUf} {l.oab}
              {!l.verifiedOab && (
                <span className="text-xs text-brand-ink/50 ml-2">
                  (informada pelo profissional)
                </span>
              )}
            </p>

            {/* Resumo profissional curto (Fase 3) */}
            {l.shortSummary && (
              <p className="text-sm text-brand-ink/85 mt-2 leading-relaxed max-w-prose">
                {l.shortSummary}
              </p>
            )}

            {/* Áreas principais em destaque (chips de até 3) */}
            {primaryList.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {primaryList.map((slug) => (
                  <span
                    key={`primary-${slug}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-deep/10 text-brand-deep border border-brand-deep/15"
                  >
                    {labelOf(slug)}
                  </span>
                ))}
              </div>
            )}
            <p className="text-sm text-brand-ink/65 mt-1 inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" aria-hidden />
              {l.cityName}/{l.uf}
              {mainArea && (
                <>
                  <span className="text-brand-ink/30">·</span>
                  <span>{mainArea}</span>
                </>
              )}
            </p>

            {/* Botões de ação principais */}
            <div className="mt-4 flex flex-wrap gap-2">
              {featured && wa && (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-500 transition"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden />
                  Falar pelo WhatsApp
                </a>
              )}
              <ShareLinkButton url={publicUrl} title={`Perfil de ${l.name}`} />
            </div>
          </div>
        </header>

        {/* ===== 2. SOBRE O PROFISSIONAL ===== */}
        {l.bio && (
          <section className="mt-8 pt-6 border-t border-brand-line">
            <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
              <User className="w-5 h-5 text-brand-deep" aria-hidden />
              Sobre o profissional
            </h2>
            <p className="text-brand-ink/85 leading-relaxed whitespace-pre-line">
              {l.bio}
            </p>
          </section>
        )}

        {/* ===== 3. CONTATO E ENDEREÇO ===== */}
        <section className="mt-8 pt-6 border-t border-brand-line">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
            <Phone className="w-5 h-5 text-brand-deep" aria-hidden />
            Contato e endereço
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
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
              <a
                href={tel}
                className="flex items-center gap-3 rounded-xl border border-brand-line p-3 hover:border-brand-accent transition"
              >
                <Phone className="w-4 h-4 text-brand-ink/50 flex-shrink-0" aria-hidden />
                <span>{l.phone}</span>
              </a>
            )}
            {showEmail && featured && (
              <a
                href={`mailto:${l.email}`}
                className="flex items-center gap-3 rounded-xl border border-brand-line p-3 hover:border-brand-accent transition"
              >
                <Mail className="w-4 h-4 text-brand-ink/50 flex-shrink-0" aria-hidden />
                <span className="break-all">{l.email}</span>
              </a>
            )}
            {featured && wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 hover:bg-emerald-100 transition text-emerald-900"
              >
                <MessageCircle className="w-4 h-4 flex-shrink-0" aria-hidden />
                <span className="font-semibold">Falar pelo WhatsApp</span>
              </a>
            )}
          </div>
        </section>

        {/* ===== 4. COMO FUNCIONA O CONTATO INICIAL ===== */}
        <section className="mt-8 pt-6 border-t border-brand-line">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-brand-deep" aria-hidden />
            Como funciona o contato inicial
          </h2>
          <p className="text-sm text-brand-ink/85 leading-relaxed">
            Você pode enviar uma mensagem pelo canal informado nesta página. O
            profissional poderá avaliar as informações iniciais e, se
            necessário, combinar uma consulta ou orientação jurídica.
          </p>

          {/* CTA intermediário */}
          {featured && wa && (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="text-sm font-semibold text-emerald-900">
                Deseja enviar uma mensagem ao profissional?
              </p>
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-500 transition whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" aria-hidden />
                Falar pelo WhatsApp
              </a>
            </div>
          )}
        </section>

        {/* ===== 5. UPSELL PARA NÃO-PREMIUM (mantido) ===== */}
        {!featured && (
          <div className="mt-6 rounded-2xl border border-brand-accent/40 bg-brand-accent/5 p-5">
            <p className="text-sm font-semibold text-brand-ink">
              Quer aparecer no topo de {l.cityName} e ter WhatsApp clicável no perfil?
            </p>
            <p className="text-xs text-brand-ink/70 mt-1.5 mb-3">
              O plano premium (
              <strong>R$ 59,90/mês</strong>, sem fidelidade) coloca seu perfil em destaque,
              libera botão WhatsApp clicável, bio completa, e selo de OAB verificada.
            </p>
            <Link href="/planos" className="text-sm font-medium text-brand-deep underline">
              Conhecer o plano premium
            </Link>
          </div>
        )}

        {/* ===== 6. ÁREAS DE ATUAÇÃO (CARDS COM DESCRIÇÃO) ===== */}
        {l.specialties.length > 0 && (
          <section className="mt-8 pt-6 border-t border-brand-line">
            <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-brand-deep" aria-hidden />
              Principais áreas de atendimento
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {primaryList.map((s) => (
                <article
                  key={s}
                  className="rounded-xl border-2 border-brand-deep/15 bg-brand-deep/5 p-4"
                >
                  <h3 className="font-display text-sm md:text-base font-bold text-brand-ink mb-1">
                    {labelOf(s)}
                  </h3>
                  <p className="text-xs md:text-sm text-brand-ink/80 leading-relaxed">
                    {getSpecialtyDescription(s)}
                  </p>
                </article>
              ))}
            </div>

            {/* Outras áreas informadas (chips) */}
            {otherList.length > 0 && (
              <div className="mt-5">
                <h3 className="text-sm font-semibold text-brand-ink/75 mb-2">
                  Outras áreas informadas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {otherList.map((s) => (
                    <span
                      key={`other-${s}`}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-white border border-brand-line text-brand-ink/80"
                    >
                      {labelOf(s)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ===== 7. ATENDIMENTO ===== */}
        {featured && (
          <section className="mt-8 pt-6 border-t border-brand-line">
            <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
              <Building2 className="w-5 h-5 text-brand-deep" aria-hidden />
              Atendimento
            </h2>

            <div className="rounded-xl border border-brand-line bg-brand-bg/30 p-4 space-y-3">
              {/* Modalidade — premium pode marcar in_person/online */}
              {Array.isArray(l.serviceModalities) && l.serviceModalities.length > 0 && (
                <p className="text-sm text-brand-ink/85">
                  <span className="font-semibold text-brand-ink">Modalidade:</span>{" "}
                  {l.serviceModalities.includes("in_person") &&
                    l.serviceModalities.includes("online")
                    ? "Atendimento presencial e online"
                    : l.serviceModalities.includes("online")
                    ? "Atendimento online"
                    : "Atendimento presencial"}
                </p>
              )}

              <p className="text-sm text-brand-ink/85">
                <span className="font-semibold text-brand-ink">Cidade base:</span>{" "}
                {l.cityName}/{l.uf}
              </p>

              {l.serviceRegion && (
                <p className="text-sm text-brand-ink/85">
                  <span className="font-semibold text-brand-ink">Região atendida:</span>{" "}
                  {l.serviceRegion}
                </p>
              )}

              {showExtraCities && l.extraCities && l.extraCities.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-brand-ink mb-2">
                    Também atende em:
                  </p>
                  {/* Agrupado por UF quando houver muitas cidades (>= 5) */}
                  {l.extraCities.length >= 5 ? (
                    <ExtraCitiesGroupedByUF cities={l.extraCities} />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {l.extraCities.map((c) => (
                        <Link
                          key={`${c.uf}-${c.slug}`}
                          href={`/advogados/${c.uf.toLowerCase()}/${c.slug}`}
                          className="chip text-brand-ink hover:bg-brand-deep hover:text-white hover:border-brand-deep transition"
                        >
                          {c.name}/{c.uf}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {l.officeHours && (
                <div>
                  <p className="text-sm font-semibold text-brand-ink mb-1 inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-deep" aria-hidden />
                    Horário de atendimento:
                  </p>
                  <p className="text-sm text-brand-ink/85 whitespace-pre-line">
                    {l.officeHours}
                  </p>
                </div>
              )}

              {l.preferredContact && (
                <p className="text-sm text-brand-ink/85">
                  <span className="font-semibold text-brand-ink">
                    Canal preferencial de contato:
                  </span>{" "}
                  {l.preferredContact === "whatsapp"
                    ? "WhatsApp"
                    : l.preferredContact === "phone"
                    ? "Telefone"
                    : "E-mail"}
                </p>
              )}
            </div>
          </section>
        )}

        {/* ===== 7b. ANTES DE ENTRAR EM CONTATO ===== */}
        <section className="mt-8 pt-6 border-t border-brand-line">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-brand-deep" aria-hidden />
            Antes de entrar em contato
          </h2>
          <p className="text-sm text-brand-ink/85 leading-relaxed">
            Para facilitar o primeiro atendimento, envie uma mensagem objetiva
            com seu nome, cidade, área do assunto e um breve resumo da
            situação. Evite enviar dados sensíveis ou documentos antes de
            orientação individual do profissional.
          </p>
        </section>

        {/* ===== 8. DOCUMENTOS ÚTEIS PARA O PRIMEIRO CONTATO ===== */}
        {usefulDocs.length > 0 && l.specialties.length > 0 && (
          <section className="mt-8 pt-6 border-t border-brand-line">
            <h2 className="font-display text-xl font-bold text-brand-ink mb-2 inline-flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-deep" aria-hidden />
              Documentos úteis para o primeiro contato
            </h2>
            <p className="text-sm text-brand-ink/65 mb-3">
              Lista informativa de documentos comuns nos casos das áreas em que
              este profissional atua. Pode variar conforme o caso específico.
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
              {usefulDocs.map((doc) => (
                <li key={doc} className="text-sm text-brand-ink/85 flex items-start gap-2">
                  <span className="text-brand-accent2 mt-0.5">•</span>
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <strong>Atenção:</strong> evite enviar dados sensíveis (CPF
              completo, comprovantes bancários, fotos pessoais) antes de
              orientação individual do profissional.
            </p>
          </section>
        )}

        {/* ===== 8a. ARTIGOS DO ADVOGADO ===== */}
        {featured && (l.showArticles ?? true) && articles.length > 0 && (
          <section className="mt-8 pt-6 border-t border-brand-line">
            <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-deep" aria-hidden />
              Artigos informativos
            </h2>
            <p className="text-sm text-brand-ink/65 mb-4">
              Conteúdo informativo publicado por {l.name.split(" ")[0]}. Caráter
              exclusivamente educativo.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {articles.map((a) => (
                <Link
                  key={a.id}
                  href={`/advogado/${l.slug}/artigos/${a.slug}`}
                  className="block rounded-xl border border-brand-line bg-white p-4 hover:border-brand-deep transition group"
                >
                  {a.specialty_slug && (
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wide text-brand-deep mb-1.5">
                      {SPECIALTIES.find((s) => s.slug === a.specialty_slug)?.name ||
                        a.specialty_slug}
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
                  <p className="text-xs text-brand-ink/55 mt-2">
                    {a.read_time_minutes ? `${a.read_time_minutes} min de leitura` : ""}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ===== 8b. PERGUNTAS FREQUENTES ===== */}
        {featured && (l.showFaqs ?? true) && (
          <section className="mt-8 pt-6 border-t border-brand-line">
            <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-brand-deep" aria-hidden />
              Perguntas frequentes
            </h2>
            <div className="space-y-3">
              {DEFAULT_FAQS.map((faq, idx) => (
                <details
                  key={`faq-${idx}`}
                  className="group rounded-xl border border-brand-line bg-white p-4 open:border-brand-deep/30 open:bg-brand-bg/30"
                >
                  <summary className="cursor-pointer font-semibold text-sm md:text-base text-brand-ink list-none flex items-center justify-between gap-2">
                    {faq.question}
                    <span
                      aria-hidden
                      className="text-brand-deep text-lg leading-none group-open:rotate-45 transition-transform"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-2 text-sm text-brand-ink/80 leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* ===== 8c. PERGUNTAS DE LEITORES (respondidas + form) ===== */}
        {featured && (l.showQuestions ?? true) && (
          <section className="mt-8 pt-6 border-t border-brand-line">
            <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-brand-deep" aria-hidden />
              Perguntas de leitores
            </h2>
            <p className="text-sm text-brand-ink/65 mb-4">
              Perguntas informativas respondidas pelo profissional. Os
              esclarecimentos têm caráter educativo e não substituem consulta
              jurídica individual.
            </p>

            {/* Lista de respondidas */}
            {answeredQuestions.length > 0 && (
              <div className="space-y-3 mb-5">
                {answeredQuestions.map((q) => (
                  <article
                    key={q.id}
                    className="rounded-xl border border-brand-line bg-white p-4"
                  >
                    <p className="font-semibold text-brand-ink text-sm md:text-base">
                      {q.question}
                    </p>
                    <p className="mt-2 text-sm text-brand-ink/80 whitespace-pre-line leading-relaxed">
                      {q.answer}
                    </p>
                    {q.answered_at && (
                      <p className="text-[11px] text-brand-ink/50 mt-2">
                        Respondida em{" "}
                        {new Date(q.answered_at).toLocaleDateString("pt-BR")}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            )}

            {/* Formulário pra novas perguntas */}
            {l.allowQuestions !== false && (
              <>
                <h3 className="font-semibold text-sm md:text-base text-brand-ink mb-2">
                  Enviar uma pergunta
                </h3>
                <ReaderQuestionForm lawyerSlug={l.slug} />
              </>
            )}
          </section>
        )}

        {/* ===== 9. PRESENÇA DIGITAL (Premium) ===== */}
        {featured && (l.website || l.instagram || l.linkedin) && (
          <section className="mt-8 pt-6 border-t border-brand-line">
            <h2 className="font-display text-xl font-bold text-brand-ink mb-3">
              Presença digital
            </h2>
            <div className="flex flex-wrap gap-2">
              {l.website && (
                <a
                  href={l.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-brand-line bg-white hover:border-brand-accent transition text-sm text-brand-ink"
                >
                  <Globe className="w-4 h-4 text-brand-deep" aria-hidden />
                  Site oficial
                </a>
              )}
              {l.instagram && (
                <a
                  href={`https://instagram.com/${l.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-brand-line bg-white hover:border-brand-accent transition text-sm text-brand-ink"
                >
                  <Instagram className="w-4 h-4 text-pink-600" aria-hidden />
                  @{l.instagram}
                </a>
              )}
              {l.linkedin && (
                <a
                  href={
                    l.linkedin.startsWith("http")
                      ? l.linkedin
                      : `https://linkedin.com/in/${l.linkedin}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-brand-line bg-white hover:border-brand-accent transition text-sm text-brand-ink"
                >
                  <Linkedin className="w-4 h-4 text-blue-700" aria-hidden />
                  LinkedIn
                </a>
              )}
            </div>
          </section>
        )}

        {/* ===== 10. CTA FINAL ===== */}
        {featured && wa && (
          <section className="mt-8 pt-6 border-t border-brand-line">
            <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200 p-5 md:p-6 text-center">
              <p className="text-base md:text-lg font-semibold text-emerald-900 mb-3">
                Precisa de orientação sobre alguma dessas áreas?
              </p>
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm md:text-base hover:bg-emerald-500 transition shadow-sm"
              >
                <MessageCircle className="w-5 h-5" aria-hidden />
                Falar pelo WhatsApp
              </a>
            </div>
          </section>
        )}

        {/* ===== 11. AVISO ÉTICO OBRIGATÓRIO ===== */}
        <aside
          className="mt-8 rounded-xl border-l-4 border-amber-400 bg-amber-50 p-4 text-xs md:text-sm text-amber-900 leading-relaxed"
          role="note"
        >
          <p className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden />
            <span>
              As informações desta página têm caráter exclusivamente informativo
              e não substituem consulta individual com profissional habilitado.
              O contato inicial não implica contratação automática de serviços
              jurídicos.
            </span>
          </p>
        </aside>

        {/* ===== 12. RODAPÉ INSTITUCIONAL ===== */}
        <footer className="mt-6 pt-4 border-t border-brand-line">
          <p className="text-xs text-brand-ink/60 mb-3">
            Perfil cadastrado em {formatDate(l.createdAt)}.
            {l.updatedAt && l.updatedAt !== l.createdAt && (
              <> Última atualização em {formatDate(l.updatedAt)}.</>
            )}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <Link
              href="/contato"
              className="text-brand-deep hover:text-brand-accent2 underline-offset-2 hover:underline"
            >
              Corrigir ou denunciar informação
            </Link>
            <Link
              href="/termos"
              className="text-brand-deep hover:text-brand-accent2 underline-offset-2 hover:underline"
            >
              Termos de uso
            </Link>
            <Link
              href="/privacidade"
              className="text-brand-deep hover:text-brand-accent2 underline-offset-2 hover:underline"
            >
              Política de privacidade
            </Link>
            <Link
              href="/"
              className="text-brand-deep hover:text-brand-accent2 underline-offset-2 hover:underline"
            >
              Sobre o AdvAqui
            </Link>
          </div>
        </footer>
      </article>

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
      {/* FAQ schema — só quando exibimos perguntas frequentes na página */}
      {featured && (l.showFaqs ?? true) && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: DEFAULT_FAQS.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: f.answer
              }
            }))
          }}
        />
      )}
    </div>
  );
}
