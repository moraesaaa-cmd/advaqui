import Link from "next/link";
import { MessageCircle, ShieldCheck, User } from "lucide-react";
import type { Lawyer } from "@/lib/data/lawyer-mapper";
import { SPECIALTIES } from "@/lib/data/specialties";
import { whatsappLink } from "@/lib/utils/format";

const labelOf = (slug: string) =>
  SPECIALTIES.find((s) => s.slug === slug)?.name || slug;

// Paleta de tints para avatares com iniciais (do claude_design).
const TINTS = ["#274472", "#2E7D5B", "#8A5A2B", "#5A3E7A", "#B4543F"];
function tintFor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return TINTS[h % TINTS.length];
}
function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (a + b).toUpperCase();
}

/**
 * Card de advogado no diretório — redesign claude_design (Apex).
 *
 * PREMIUM (featured): card largo, fundo creme com borda e sombra douradas,
 * avatar 78px, selo "OAB verificada" (quando validado), bio e botão verde
 * "Falar agora" (WhatsApp). GRATUITO: card branco simples, avatar 48px,
 * nome + OAB + bairro/cidade e botão "Contato" que leva ao perfil.
 *
 * Contrato dos planos (produto): premium = posição no topo + WhatsApp clicável
 * + selo + card ampliado + até 8 áreas; gratuito = dados públicos essenciais.
 *
 * Nota: nota/avaliações/contagem de clientes NÃO existem no banco e NÃO são
 * inventadas aqui — só exibimos o que é dado real do advogado.
 */
export function LawyerCard({ lawyer, featured }: { lawyer: Lawyer; featured?: boolean }) {
  const isFeatured = featured ?? (lawyer.planStatus === "active" || lawyer.featured);
  const profileHref = `/advogado/${lawyer.slug}`;
  const tint = tintFor(lawyer.name);
  const initials = initialsOf(lawyer.name);
  const mainAreaSlug = lawyer.primarySpecialties?.[0] || lawyer.specialties[0];
  const mainArea = mainAreaSlug ? labelOf(mainAreaSlug) : undefined;
  const bio = lawyer.shortSummary || lawyer.bio;
  const wa = isFeatured
    ? whatsappLink(
        lawyer.whatsapp || lawyer.phone,
        `Olá ${lawyer.name}, encontrei seu perfil no AdvAqui e gostaria de conversar.`
      )
    : undefined;

  if (isFeatured) {
    return (
      <article
        className="rounded-[18px] p-5 sm:p-6 flex flex-col sm:flex-row gap-5 sm:gap-[22px]"
        style={{
          background: "linear-gradient(180deg,#FFFDF7,#fff)",
          border: "1px solid #ECD9A6",
          boxShadow: "0 6px 22px -14px rgba(176,134,40,0.4)"
        }}
      >
        <div className="shrink-0">
          {lawyer.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={lawyer.photoUrl}
              alt={lawyer.photoAltText || `Foto de ${lawyer.name}`}
              loading="eager"
              decoding="async"
              className="w-[78px] h-[78px] rounded-full object-cover bg-brand-bg"
              style={{ border: "2px solid #ECD9A6" }}
            />
          ) : (
            <div
              className="w-[78px] h-[78px] rounded-full flex items-center justify-center font-display text-[28px] font-semibold text-white"
              style={{ background: tint }}
              aria-hidden
            >
              {initials}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="font-semibold text-[18.5px] text-brand-ink">
              <Link href={profileHref} className="hover:underline underline-offset-2">
                {lawyer.name}
              </Link>
            </h3>
            {lawyer.verifiedOab && (
              <span
                className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-[5px]"
                style={{ background: "#E6F1EA", color: "#2E7D5B" }}
              >
                <ShieldCheck className="w-3 h-3" aria-hidden /> OAB verificada
              </span>
            )}
          </div>
          <div className="text-[13.5px] mt-1 mb-3" style={{ color: "#6B7689" }}>
            OAB/{lawyer.oabUf} {lawyer.oab}
            {mainArea ? ` · ${mainArea}` : ""}
          </div>
          {bio && (
            <p
              className="text-sm leading-relaxed mb-3.5 max-w-[560px] line-clamp-3"
              style={{ color: "#3C485A" }}
            >
              {bio}
            </p>
          )}
          {lawyer.specialties.length > 0 && (
            <div className="flex gap-2.5 flex-wrap mb-4">
              <span
                className="inline-flex items-center gap-1.5 text-[12.5px] px-[11px] py-1.5 rounded-[7px]"
                style={{ background: "#F1F0EA", color: "#3C485A" }}
              >
                📍 {lawyer.address ? `${lawyer.address}, ` : ""}
                {lawyer.cityName}/{lawyer.uf}
              </span>
              {lawyer.specialties.slice(0, 3).map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center text-[12.5px] px-[11px] py-1.5 rounded-[7px]"
                  style={{ background: "#F1F0EA", color: "#3C485A" }}
                >
                  {labelOf(s)}
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-2.5 items-center flex-wrap">
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white text-sm font-bold px-[22px] py-[11px] rounded-[10px]"
                style={{ background: "#25D366" }}
              >
                <MessageCircle className="w-4 h-4" aria-hidden /> Falar agora
              </a>
            )}
            <Link
              href={profileHref}
              className="inline-flex items-center text-sm font-semibold px-4 py-[11px] rounded-[10px] text-brand-deep border border-brand-line bg-white hover:border-brand-accent transition"
            >
              Ver perfil completo
            </Link>
            <span className="text-[12.5px]" style={{ color: "#6B7689" }}>
              Sem custo de contato · honorários combinados direto
            </span>
          </div>
        </div>
      </article>
    );
  }

  // ----- GRATUITO -----
  return (
    <article
      className="bg-white rounded-[14px] p-[18px] flex gap-3.5 items-center"
      style={{ border: "1px solid #E4E2DA" }}
    >
      {lawyer.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={lawyer.photoUrl}
          alt={lawyer.photoAltText || `Foto de ${lawyer.name}`}
          loading="lazy"
          decoding="async"
          className="w-12 h-12 rounded-full object-cover flex-shrink-0 bg-brand-bg border border-brand-line"
        />
      ) : (
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center font-display text-[18px] font-semibold text-white flex-shrink-0"
          style={{ background: tint }}
          aria-hidden
        >
          {initials || <User className="w-6 h-6" aria-hidden />}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-[15px] text-brand-ink truncate">
          <Link href={profileHref} className="hover:underline underline-offset-2">
            {lawyer.name}
          </Link>
        </div>
        <div className="text-[12.5px] mt-0.5 truncate" style={{ color: "#6B7689" }}>
          OAB/{lawyer.oabUf} {lawyer.oab} · {lawyer.address || lawyer.cityName}
        </div>
      </div>
      <Link
        href={profileHref}
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold px-[13px] py-2 rounded-[9px] whitespace-nowrap"
        style={{ background: "#E9F2EC", color: "#25623F" }}
      >
        <MessageCircle className="w-3.5 h-3.5" aria-hidden /> Contato
      </Link>
    </article>
  );
}
