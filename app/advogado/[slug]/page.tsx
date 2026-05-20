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
import { findLawyerBySlug, getAllLawyerSlugs } from "@/lib/data/lawyers";
import { SPECIALTIES } from "@/lib/data/specialties";
import {
  getSpecialtyDescription,
  getUsefulDocsForSpecialties
} from "@/lib/data/specialty-descriptions";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { ShareLinkButton } from "@/components/ShareLinkButton";
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
export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllLawyerSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const l = await findLawyerBySlug(params.slug);
  if (!l)
    return buildMetadata({
      title: "Página Profissional",
      description: "Página não encontrada",
      noIndex: true
    });
  const mainArea = l.specialties[0]
    ? SPECIALTIES.find((s) => s.slug === l.specialties[0])?.name
    : undefined;
  const titleArea = mainArea
    ? `Advogad${l.name.toLowerCase().endsWith("a") ? "a" : "o"} de ${mainArea}`
    : "Advogado";
  return buildMetadata({
    title: `${l.name} — ${titleArea} em ${l.cityName}, ${l.uf}`,
    description:
      l.bio ||
      `Perfil profissional de ${l.name}, OAB/${l.oabUf} ${l.oab}. Atuação em ${l.cityName}/${l.uf}.`,
    path: `/advogado/${l.slug}`
  });
}

const labelOf = (slug: string) =>
  SPECIALTIES.find((s) => s.slug === slug)?.name || slug;

export default async function ProfessionalPage({
  params
}: {
  params: { slug: string };
}) {
  const l = await findLawyerBySlug(params.slug);
  if (!l) notFound();

  const featured = l.planStatus === "active" || l.featured;
  const wa = whatsappLink(
    l.whatsapp || l.phone,
    `Olá ${l.name}, encontrei seu perfil no ${SITE.name} e gostaria de conversar.`
  );
  const tel = telLink(l.phone);
  const publicUrl = `${SITE.url}/advogado/${l.slug}`;
  const usefulDocs = getUsefulDocsForSpecialties(l.specialties, 8);

  // Linguagem do título da área principal usado em h2
  const mainArea = l.specialties[0]
    ? SPECIALTIES.find((s) => s.slug === l.specialties[0])?.name
    : null;

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
            <div className="flex items-center gap-3 rounded-xl border border-brand-line p-3">
              <MapPin className="w-4 h-4 text-brand-ink/50 flex-shrink-0" aria-hidden />
              <span>
                {l.address ? `${l.address} — ` : ""}
                {l.cityName}/{l.uf}
              </span>
            </div>
            {tel && (
              <a
                href={tel}
                className="flex items-center gap-3 rounded-xl border border-brand-line p-3 hover:border-brand-accent transition"
              >
                <Phone className="w-4 h-4 text-brand-ink/50 flex-shrink-0" aria-hidden />
                <span>{l.phone}</span>
              </a>
            )}
            {featured && (
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
          <p className="text-sm text-brand-ink/70 leading-relaxed mt-2">
            O contato inicial não implica contratação automática de serviços
            jurídicos. Honorários, formas de pagamento e procedimentos serão
            esclarecidos diretamente com o profissional, se for o caso.
          </p>
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
              Áreas de atuação
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {l.specialties.map((s) => (
                <article
                  key={s}
                  className="rounded-xl border border-brand-line bg-white p-4 hover:border-brand-accent transition"
                >
                  <h3 className="font-display text-sm md:text-base font-bold text-brand-ink mb-1">
                    {labelOf(s)}
                  </h3>
                  <p className="text-xs md:text-sm text-brand-ink/70 leading-relaxed">
                    {getSpecialtyDescription(s)}
                  </p>
                  <Link
                    href={`/advogados/${l.uf.toLowerCase()}/${l.citySlug}/${s}`}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-deep hover:text-brand-accent2"
                  >
                    Ver mais advogados desta área →
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ===== 7. REGIÃO DE ATENDIMENTO ===== */}
        {(featured && (l.officeHours || (l.extraCities && l.extraCities.length > 0))) && (
          <section className="mt-8 pt-6 border-t border-brand-line">
            <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
              <Building2 className="w-5 h-5 text-brand-deep" aria-hidden />
              Região de atendimento
            </h2>

            <div className="rounded-xl border border-brand-line bg-brand-bg/30 p-4 space-y-3">
              <p className="text-sm text-brand-ink/85">
                <span className="font-semibold text-brand-ink">Cidade principal:</span>{" "}
                {l.cityName}/{l.uf}
              </p>

              {l.extraCities && l.extraCities.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-brand-ink mb-2">
                    Também atende em:
                  </p>
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
            </div>
          </section>
        )}

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

        {/* ===== 10. AVISO ÉTICO OBRIGATÓRIO ===== */}
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

        {/* ===== 11. RODAPÉ INSTITUCIONAL ===== */}
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
    </div>
  );
}
