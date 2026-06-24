import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { RecursoMultaLanding } from "@/components/multas/RecursoMultaLanding";

/**
 * Landing standalone do recurso de multa (subdomínio multas.advaqui.com),
 * usada em campanhas de Google Ads. Reproduz o design escuro próprio, sem as
 * classes de marca do restante do site. O funil é interativo e fala com
 * /api/recurso-ia e /api/recurso-acesso, por isso é renderização dinâmica.
 */

const SUBDOMINIO = "https://multas.advaqui.com/";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Recurso de multa de trânsito — análise grátis",
    description:
      "Multado injustamente? Analise o seu caso de graça e receba um recurso técnico (Defesa Prévia, JARI ou CETRAN) pronto para protocolar, a partir de R$9,90.",
    path: "/multas"
  }),
  // Canonical no subdomínio (alvo dos anúncios e do ranqueamento), não no path.
  alternates: { canonical: SUBDOMINIO }
};

export const dynamic = "force-dynamic";

export default function MultasPage() {
  return <RecursoMultaLanding />;
}
