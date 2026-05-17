import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Phone, Mail, Star, ShieldCheck, MessageCircle, User } from "lucide-react";
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
          <div className="w-20 h-20 rounded-2xl bg-brand-deep/10 flex items-center justify-center flex-shrink-0">
            <User className="w-10 h-10 text-brand-deep" aria-hidden />
          </div>
          <div className="flex-1">
            <div className="flex items-center flex-wrap gap-2">
              <h1 className="font-display text-3xl font-bold text-brand-ink">{l.name}</h1>
              {featured && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-brand-accent text-brand-ink">
                  <Star className="w-3.5 h-3.5" aria-hidden /> Destaque
                </span>
              )}
              {l.verifiedOab && (
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
          <a
            href={`mailto:${l.email}`}
            className="flex items-center gap-3 rounded-xl border border-brand-line p-3 hover:border-brand-accent transition"
          >
            <Mail className="w-4 h-4 text-brand-ink/50" aria-hidden />
            <span className="break-all">{l.email}</span>
          </a>
          {wa && (
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
