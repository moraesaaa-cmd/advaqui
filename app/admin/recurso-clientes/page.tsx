import { RecursoClientesAdminView } from "@/components/RecursoClientesAdminView";
import { buildMetadata } from "@/lib/seo/metadata";

/**
 * /admin/recurso-clientes — visão administrativa dos clientes do recurso de multa.
 * A proteção real está no endpoint /api/admin/recurso-clientes (cookie HMAC); esta
 * página é só o visualizador e fica fora dos índices.
 */
export const metadata = buildMetadata({
  title: "Clientes do recurso (admin)",
  description: "Painel de clientes do recurso de multa.",
  path: "/admin/recurso-clientes",
  noIndex: true
});

export const dynamic = "force-dynamic";

export default function AdminRecursoClientesPage() {
  return <RecursoClientesAdminView />;
}
