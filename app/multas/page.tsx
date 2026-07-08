import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import { buildMetadata } from "@/lib/seo/metadata";
import { RecursoMultaLanding } from "@/components/multas/RecursoMultaLanding";

/**
 * Landing standalone do recurso de multa (subdomínio multas.advaqui.com),
 * usada em campanhas de Google Ads. Reproduz o design próprio, sem as classes
 * de marca do restante do site. O funil é interativo e fala com /api/recurso-ia
 * e /api/recurso-acesso, por isso é renderização dinâmica.
 *
 * As fontes do design (Bricolage Grotesque + Plus Jakarta Sans) são carregadas
 * via next/font — auto-hospedadas no próprio domínio. Isso é obrigatório porque
 * a CSP do site é `style-src 'self' 'unsafe-inline'` e bloqueia o CSS do Google
 * Fonts via CDN; o next/font serve a fonte de /_next (mesma origem) e não viola
 * a política. As variáveis CSS (--rm-display/--rm-body) descem para o componente.
 */

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--rm-display",
  display: "swap"
});

const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--rm-body",
  display: "swap"
});

const SUBDOMINIO = "https://multas.advaqui.com/";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Recurso de multa de trânsito — exclusivo Premium",
    description:
      "Recurso de multa de trânsito com análise e peça completa (Defesa Prévia, JARI ou CETRAN) — ferramenta exclusiva dos advogados Premium do AdvAqui.",
    path: "/multas"
  }),
  // Canonical no subdomínio (alvo dos anúncios e do ranqueamento), não no path.
  alternates: { canonical: SUBDOMINIO }
};

export const dynamic = "force-dynamic";

export default function MultasPage() {
  return (
    <div className={`${display.variable} ${body.variable}`}>
      <RecursoMultaLanding />
    </div>
  );
}
