import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import { buildMetadata } from "@/lib/seo/metadata";
import { RecursoPainelView } from "@/components/multas/RecursoPainelView";

/**
 * /recurso/painel — painel do cliente do recurso de multa. Área de acesso por
 * token (não indexável). O cliente gera os seus recursos por IA (até 3) e revê
 * o histórico. Mesmas fontes do design (next/font, auto-hospedadas).
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

export const metadata: Metadata = buildMetadata({
  title: "Meu painel de recursos de multa",
  description: "Gere e baixe os seus recursos de multa.",
  path: "/recurso/painel",
  noIndex: true
});

export const dynamic = "force-dynamic";

export default function RecursoPainelPage() {
  return (
    <div className={`${display.variable} ${body.variable}`}>
      <RecursoPainelView />
    </div>
  );
}
