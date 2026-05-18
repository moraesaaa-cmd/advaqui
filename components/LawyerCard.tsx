import Link from "next/link";
import { MapPin, Phone, Star, User, MessageCircle, ShieldCheck, Lock } from "lucide-react";
import type { Lawyer } from "@/lib/data/lawyer-mapper";
import { SPECIALTIES } from "@/lib/data/specialties";
import { whatsappLink } from "@/lib/utils/format";

const labelOf = (slug: string) =>
  SPECIALTIES.find((s) => s.slug === slug)?.name || slug;

/**
 * Card de advogado no diretório.
 *
 * Contrato dos planos (definido pelo produto):
 *
 * GRATUITO — Apenas o que é estritamente necessário para o cliente identificar
 * que o profissional existe e atua naquela cidade. Sem contato direto exposto.
 *   • Nome
 *   • OAB e UF
 *   • Cidade
 *   • Áreas de atuação (chips)
 *
 * PREMIUM — Tudo do gratuito + experiência completa.
 *   • Selo "Destaque" dourado
 *   • Selo "OAB verificada" (quando validado pelo admin)
 *   • Telefone clicável (tel:)
 *   • WhatsApp clicável (wa.me)
 *   • Endereço profissional completo
 *   • Bio até 500 chars (no perfil individual)
 *   • Posição privilegiada (topo da página da cidade)
 *   • Card maior e moldura âmbar
 */
export function LawyerCard({ lawyer, featured }: { lawyer: Lawyer; featured?: boolean }) {
  const isFeatured = featured ?? (lawyer.planStatus === "active" || lawyer.featured);
  const wa = isFeatured
    ? whatsappLink(
        lawyer.whatsapp || lawyer.phone,
        `Olá ${lawyer.name}, encontrei seu perfil no AdvAqui e gostaria de conversar.`
      )
    : undefined;

  return (
    <article
      className={`rounded-2xl border p-5 transition hover:shadow-cardHover bg-white ${
        isFeatured
          ? "border-brand-accent/60 ring-1 ring-brand-accent/30 shadow-card"
          : "border-brand-line shadow-card"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center flex-wrap gap-2">
            <h3 className={`font-display ${isFeatured ? "text-xl" : "text-lg"} font-bold text-brand-ink`}>
              <Link href={`/p/${lawyer.slug}`} className="hover:underline underline-offset-2">
                {lawyer.name}
              </Link>
            </h3>
            {isFeatured && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-brand-accent text-brand-ink">
                <Star className="w-3 h-3" aria-hidden /> Destaque
              </span>
            )}
            {isFeatured && lawyer.verifiedOab && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium">
                <ShieldCheck className="w-3 h-3" aria-hidden /> OAB verificada
              </span>
            )}
          </div>
          <p className="text-sm text-brand-ink/70 mt-1">
            OAB/{lawyer.oabUf} {lawyer.oab}
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-brand-line flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 text-brand-deep" aria-hidden />
        </div>
      </div>

      <div className="mt-3 space-y-1.5 text-sm text-brand-ink/80">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 mt-0.5 text-brand-ink/50 flex-shrink-0" aria-hidden />
          <span>
            {isFeatured && lawyer.address ? `${lawyer.address}, ` : ""}
            {lawyer.cityName}/{lawyer.uf}
          </span>
        </div>
        {isFeatured && lawyer.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-brand-ink/50 flex-shrink-0" aria-hidden />
            <a
              href={`tel:+55${lawyer.phone.replace(/\D/g, "")}`}
              className="text-brand-ink hover:text-brand-deep hover:underline"
            >
              {lawyer.phone}
            </a>
          </div>
        )}
      </div>

      {lawyer.specialties.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {lawyer.specialties.slice(0, isFeatured ? 8 : 5).map((s) => (
            <span key={s} className="chip text-brand-ink/80">
              {labelOf(s)}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-4">
        <Link
          href={`/p/${lawyer.slug}`}
          className="btn-primary text-sm py-2 px-4"
        >
          Ver perfil completo
        </Link>
        {isFeatured && wa && (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 transition"
          >
            <MessageCircle className="w-4 h-4" aria-hidden />
            WhatsApp
          </a>
        )}
        {!isFeatured && (
          <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-brand-ink/60 bg-brand-line/40">
            <Lock className="w-3.5 h-3.5" aria-hidden />
            Contato direto no plano premium
          </span>
        )}
      </div>
    </article>
  );
}
