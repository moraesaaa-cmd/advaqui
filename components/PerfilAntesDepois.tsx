import {
  Star,
  ShieldCheck,
  MessageCircle,
  MapPin,
  Phone,
  Globe,
  Clock,
  ArrowRight
} from "lucide-react";

/**
 * PerfilAntesDepois — "prova viva" visual: o MESMO advogado fictício mostrado
 * como perfil GRATUITO (pequeno, simples) e como perfil PREMIUM (card grande,
 * faixa dourada, selos, foto em destaque, WhatsApp clicável). O objetivo é o
 * advogado VER a diferença, não ler. Usado em /planos e /exemplo-perfil-premium.
 *
 * Tudo é fictício e rotulado como exemplo — não representa pessoa real.
 */
export function PerfilAntesDepois() {
  return (
    <div className="grid md:grid-cols-2 gap-5 items-start">
      {/* ANTES — perfil gratuito */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-brand-ink/50 mb-2 text-center">
          Perfil gratuito
        </p>
        <div className="rounded-xl border border-brand-line bg-white p-4 max-w-sm mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand-line/60 flex items-center justify-center text-brand-ink/50 font-bold flex-shrink-0">
              HC
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-brand-ink leading-tight">
                Dra. Helena Costa
              </p>
              <p className="text-xs text-brand-ink/55">
                OAB/MG 000.000 · Belo Horizonte
              </p>
            </div>
          </div>
          <p className="text-sm text-brand-ink/70 mt-3 leading-snug line-clamp-2">
            Advogada. Atua em Belo Horizonte e região.
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 text-sm text-brand-ink/60">
            <Phone className="w-4 h-4" aria-hidden />
            (00) 0000-0000
          </div>
          <p className="text-[11px] text-brand-ink/40 mt-3">
            Aparece depois dos perfis em destaque na página da cidade.
          </p>
        </div>
      </div>

      {/* DEPOIS — perfil premium */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-brand-accent2 mb-2 text-center">
          Perfil premium
        </p>
        <div className="relative rounded-2xl border-2 border-brand-accent bg-white p-5 shadow-cardHover overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-px left-5 right-5 h-1 bg-gradient-to-r from-brand-accent2 via-brand-accent to-brand-accent2 rounded-b"
          />
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide bg-brand-accent text-brand-ink">
            <Star className="w-3 h-3 fill-current" aria-hidden />
            Destaque
          </span>
          <div className="flex items-center gap-3.5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-deep to-brand-primary flex items-center justify-center text-white text-xl font-bold flex-shrink-0 ring-2 ring-brand-accent">
              HC
            </div>
            <div className="min-w-0">
              <p className="font-display font-bold text-lg text-brand-ink leading-tight">
                Dra. Helena Costa
              </p>
              <p className="text-xs text-brand-ink/60">
                OAB/MG 000.000 · Belo Horizonte/MG
              </p>
              <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden />
                OAB verificada
              </span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {["Trabalhista", "Família", "Consumidor"].map((a) => (
              <span
                key={a}
                className="text-[11px] rounded-full border border-brand-line bg-brand-bg/60 px-2 py-0.5 text-brand-deep"
              >
                {a}
              </span>
            ))}
          </div>

          <p className="text-sm text-brand-ink/75 mt-3 leading-snug">
            Atendimento humano e direto. Mais de 10 anos ajudando pessoas em
            Belo Horizonte e cidades da região metropolitana.
          </p>

          <div className="mt-3 space-y-1.5 text-xs text-brand-ink/65">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-deep" aria-hidden />
              Av. Exemplo, 1000 — Centro · atende toda a região
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand-deep" aria-hidden />
              Seg a sex, 9h às 18h
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-brand-deep" aria-hidden />
              site · Instagram · LinkedIn
            </span>
          </div>

          <div className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] text-white font-semibold text-sm py-2.5">
            <MessageCircle className="w-4 h-4 fill-current" aria-hidden />
            Falar no WhatsApp
            <ArrowRight className="w-4 h-4" aria-hidden />
          </div>
          <p className="text-[11px] text-brand-deep font-semibold mt-3 text-center">
            Aparece no topo da página da cidade.
          </p>
        </div>
      </div>
    </div>
  );
}
