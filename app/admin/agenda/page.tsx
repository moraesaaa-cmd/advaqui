import { AgendaAdminView } from "@/components/AgendaAdminView";
import { buildMetadata } from "@/lib/seo/metadata";

/**
 * /admin/agenda — visão administrativa dos pedidos de agendamento.
 * A proteção real está no endpoint /api/admin/agendamentos (cookie HMAC); esta
 * página é só o visualizador e fica fora dos índices.
 */
export const metadata = buildMetadata({
  title: "Agendamentos (admin)",
  description: "Painel de agendamentos.",
  path: "/admin/agenda",
  noIndex: true
});

export const dynamic = "force-dynamic";

export default function AdminAgendaPage() {
  return <AgendaAdminView />;
}
