import { redirect } from "next/navigation";
import { isAdminRequest } from "@/lib/auth/adminSession";
import { buildMetadata } from "@/lib/seo/metadata";
import LeadsAdminView from "@/components/admin/LeadsAdminView";

/**
 * /admin/leads — caixa de entrada e gestão dos leads captados (chat
 * "Advogado Online", ferramentas e formulários). Casca fina: o gate de
 * admin fica aqui (cookie HMAC, igual antes) e toda a UI interativa
 * (busca, filtros, conversa completa, status, arquivar, excluir) vive em
 * <LeadsAdminView />, que fala com /api/admin/leads.
 */
export const metadata = buildMetadata({
  title: "Leads recebidos (admin)",
  description: "Caixa de entrada dos leads captados no site.",
  path: "/admin/leads",
  noIndex: true
});

export const dynamic = "force-dynamic";

export default function AdminLeadsPage() {
  if (!isAdminRequest()) {
    redirect("/login?redirect=/admin/leads");
  }
  return <LeadsAdminView />;
}
