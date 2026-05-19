import Link from "next/link";
import { MapPin, Phone, Star, User, MessageCircle, ShieldCheck } from "lucide-react";
import type { Lawyer } from "@/lib/data/lawyer-mapper";
import { SPECIALTIES } from "@/lib/data/specialties";
import { whatsappLink } from "@/lib/utils/format";

const labelOf = (slug: string) =>
  SPECIALTIES.find((s) => s.slug === slug)?.name || slug;

/**
 * Card de advogado no diretório.
 *
 * Contrato dos planos (definido pelo produto, Maio/2026):
 *
 * GRATUITO — dados públicos visíveis no diretório:
 *   • Nome
 *   • OAB e UF
 *   • Cidade
 *   • Endereço profissional (quando preenchido)
 *   • Telefone (clicável tel:)
 *   • Áreas de atuação (até 5 chips)
 *
 * PREMIUM — tudo do gratuito + diferenciais:
 *   • Selo "Destaque" dourado
 *   • Selo "OAB verificada" (quando validado pelo admin)
 *   • Botão WhatsApp clicável (wa.me) com mensagem pré-preenchida
 *   • Bio até 500 chars (no perfil individual)
 *   • Posição privilegiada (topo da página da cidade)
 *   • Card maior e moldura âmbar
 *   • Até 8 chips de especialidade (vs 5 no free)
 */
export function LawyerCard({ lawyer, featured }: { lawyer: Lawyer; featured?: boolean }) {
  const isFeatured = featured ?? (lawyer.planStatus === "active" || lawyer.featured);
  const tel = lawyer.phone ? `tel:+55${lawyer.phone.replace(/\D/g, "")}` : undefined;
  const wa = isFeatured
    ? whatsappLink(
        lawyer.whatsapp || lawyer.phone,
        `Olá ${lawyer.name}, encontrei seu perfil no AdvAqui e gostaria de conversar.`
      )
    : undefined;

  return (
    <article
      className={`rounded-2xl border-2 p-5 transition bg-white relative ${
        isFeatured
          ? "border-brand-accent shadow-cardHover ring-2 ring-brand-accent/20 hover:ring-brand-accent/40"
          : "border-brand-line shadow-card hover:shadow-cardHover"
      }`}
    >
      {isFeatured && (
        // Faixa dourada no topo do card premium — sinal visual imediato
        // de que esse perfil tem destaque pago.
        <div
          aria-hidden
          className="absolute -top-px left-4 right-4 h-1 bg-gradient-to-r from-brand-accent2 via-brand-accent to-brand-accent2 rounded-b"
        />
      )}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center flex-wrap gap-2">
            {/* Ícone de estrela inline antes do nome — reforço visual do premium */}
            {isFeatured && (
              <Star
                className="w-5 h-5 text-brand-accent fill-brand-accent flex-shrink-0"
                aria-label="Perfil em destaque"
              />
            )}
            <h3
              className={`font-display ${
                isFeatured ? "text-xl text-brand-deep" : "text-lg text-brand-ink"
              } font-bold`}
            >
              <Link href={`/p/${lawyer.slug}`} className="hover:underline underline-offset-2">
                {lawyer.name}
              </Link>
            </h3>
            {isFeatured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-brand-accent text-brand-ink uppercase tracking-wide">
                <Star className="w-3 h-3 fill-current" aria-hidden /> Destaque
              </span>
            )}
            {isFeatured && lawyer.verifiedOab && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3 h-3" aria-hidden /> OAB verificada
              </span>
            )}
          </div>
          <p className="text-sm text-brand-ink/70 mt-1">
            OAB/{lawyer.oabUf} {lawyer.oab}
          </p>
        </div>
        {lawyer.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={lawyer.photoUrl}
            alt={`Foto de ${lawyer.name}`}
            loading="eager"
            decoding="async"
            className={`${
              isFeatured ? "w-20 h-20" : "w-16 h-16"
            } rounded-full object-cover flex-shrink-0 bg-brand-bg ${
              isFeatured
                ? "ring-2 ring-brand-accent border-2 border-white shadow-card"
                : "border-2 border-brand-line"
            }`}
            style={{ imageRendering: "auto" }}
          />
        ) : (
          <div
            className={`${
              isFeatured ? "w-20 h-20" : "w-16 h-16"
            } rounded-full flex items-center justify-center flex-shrink-0 ${
              isFeatured
                ? "bg-brand-accent/20 ring-2 ring-brand-accent/40"
                : "bg-brand-line"
            }`}
            aria-hidden
          >
            <User
              className={`${isFeatured ? "w-8 h-8" : "w-7 h-7"} ${
                isFeatured ? "text-brand-accent2" : "text-brand-deep"
              }`}
              aria-hidden
            />
          </div>
        )}
      </div>

      <div className="mt-3 space-y-1.5 text-sm text-brand-ink/80">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 mt-0.5 text-brand-ink/50 flex-shrink-0" aria-hidden />
          <span>
            {lawyer.address ? `${lawyer.address}, ` : ""}
            {lawyer.cityName}/{lawyer.uf}
          </span>
        </div>
        {tel && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-brand-ink/50 flex-shrink-0" aria-hidden />
            <a
              href={tel}
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
      </div>
    </article>
  );
}
