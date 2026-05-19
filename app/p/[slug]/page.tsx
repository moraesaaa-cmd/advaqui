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
  Clock
} from "lucide-react";
import { findLawyerBySlug, getAllLawyerSlugs } from "@/lib/data/lawyers";
import { SPECIALTIES } from "@/lib/data/specialties";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, lawyerSchema } from "@/lib/seo/schema";
import { whatsappLink, telLink, formatDate } from "@/lib/utils/format";
import { SITE } from "@/lib/config";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllLawyerSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const l = await findLawyerBySlug(params.slug);
  if (!l) return buildMetadata({ title: "Perfil", description: "Perfil não encontrado", noIndex: true });
  return buildMetadata({
    title: `${l.name} — Advogado em ${l.cityName}, ${l.uf}`,
    description: l.bio || `Perfil de ${l.name}, OAB/${l.oabUf} ${l.oab}, atuando em ${l.cityName}/${l.uf}.`,
    path: `/p/${l.slug}`
  });
}

const labelOf = (slug: string) =>
  SPECIALTIES.find((s) => s.slug === slug)?.name || slug;

export default async function ProfilePage({ params }: { params: { slug: string } }) {
  const l = await findLawyerBySlug(params.slug);
  if (!l) notFound();

  const featured = l.planStatus === "active" || l.featured;
  const wa = whatsappLink(
    l.whatsapp || l.phone,
    `Olá ${l.name}, encontrei seu perfil no ${SITE.name} e gostaria de conversar.`
  );
  const tel = telLink(l.phone);

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
            <p className="text-brand-ink/70 mt-1">OAB/{l.oabUf} {l.oab}</p>
            {l.bio && <p className="text-brand-ink/85 mt-3 leading-relaxed">{l.bio}</p>}
          </div>
        </header>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-3 rounded-xl border border-brand-line p-3">
            <MapPin className="w-4 h-4 text-brand-ink/50" aria-hidden />
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
              <Phone className="w-4 h-4 text-brand-ink/50" aria-hidden />
              <span>{l.phone}</span>
            </a>
          )}
          {featured && (
            <a
              href={`mailto:${l.email}`}
              className="flex items-center gap-3 rounded-xl border border-brand-line p-3 hover:border-brand-accent transition"
            >
              <Mail className="w-4 h-4 text-brand-ink/50" aria-hidden />
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
              <MessageCircle className="w-4 h-4" aria-hidden />
              <span className="font-semibold">Falar pelo WhatsApp</span>
            </a>
          )}
        </div>

        {!featured && (
          <div className="mt-6 rounded-2xl border border-brand-accent/40 bg-brand-accent/5 p-5">
            <p className="text-sm font-semibold text-brand-ink">
              Quer aparecer no topo de {l.cityName} e ter WhatsApp clicável no perfil?
            </p>
            <p className="text-xs text-brand-ink/70 mt-1.5 mb-3">
              O plano premium ({" "}
              <strong>R$ 59,90/mês</strong>, sem fidelidade) coloca seu perfil em destaque,
              libera botão WhatsApp clicável, bio completa, e selo de OAB verificada.
            </p>
            <Link href="/planos" className="text-sm font-medium text-brand-deep underline">
              Conhecer o plano premium
            </Link>
          </div>
        )}

        {l.specialties.length > 0 && (
          <section className="mt-6">
            <h2 className="font-display text-lg font-bold text-brand-ink mb-2">
              Áreas de atuação
            </h2>
            <div className="flex flex-wrap gap-2">
              {l.specialties.map((s) => (
                <Link
                  key={s}
                  href={`/advogados/${l.uf.toLowerCase()}/${l.citySlug}/${s}`}
                  className="chip text-brand-ink hover:bg-brand-deep hover:text-white hover:border-brand-deep transition"
                >
                  {labelOf(s)}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Horários de atendimento — exclusivo premium */}
        {featured && l.officeHours && (
          <section className="mt-6 rounded-2xl border border-brand-line bg-brand-bg/40 p-4">
            <h2 className="font-display text-lg font-bold text-brand-ink mb-2 inline-flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-accent2" aria-hidden />
              Horário de atendimento
            </h2>
            <p className="text-sm text-brand-ink/85 leading-relaxed">{l.officeHours}</p>
          </section>
        )}

        {/* Cidades adicionais (premium) — região de atendimento ampliada */}
        {featured && l.extraCities && l.extraCities.length > 0 && (
          <section className="mt-6">
            <h2 className="font-display text-lg font-bold text-brand-ink mb-2 inline-flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-accent2" aria-hidden />
              Também atendo em
            </h2>
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
          </section>
        )}

        {/* Links sociais — exclusivos premium */}
        {featured && (l.website || l.instagram || l.linkedin) && (
          <section className="mt-6">
            <h2 className="font-display text-lg font-bold text-brand-ink mb-2">
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

        <footer className="mt-8 pt-6 border-t border-brand-line text-xs text-brand-ink/60">
          Perfil cadastrado em {formatDate(l.createdAt)}.
        </footer>
      </article>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Brasil", url: "/" },
          { name: "Diretório", url: "/advogados" },
          { name: l.uf, url: `/advogados/${l.uf.toLowerCase()}` },
          { name: l.cityName, url: `/advogados/${l.uf.toLowerCase()}/${l.citySlug}` },
          { name: l.name, url: `/p/${l.slug}` }
        ])}
      />
      <JsonLd data={lawyerSchema(l)} />
    </div>
  );
}
