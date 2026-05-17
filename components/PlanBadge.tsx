import type { PlanStatus } from "@/lib/data/mock-lawyers";
import { Award, Clock, AlertCircle, X } from "lucide-react";

const MAP: Record<PlanStatus, { label: string; cls: string; Icon: typeof Award | null }> = {
  free: { label: "Gratuito", cls: "bg-brand-line text-brand-ink/70", Icon: null },
  pending: { label: "Aguardando ativação", cls: "bg-amber-100 text-amber-900", Icon: Clock },
  active: { label: "Premium ativo", cls: "bg-emerald-100 text-emerald-900", Icon: Award },
  expired: { label: "Vencido", cls: "bg-red-100 text-red-900", Icon: AlertCircle },
  cancelled: { label: "Cancelado", cls: "bg-brand-line text-brand-ink/50", Icon: X }
};

export function PlanBadge({ status }: { status: PlanStatus }) {
  const cfg = MAP[status] || MAP.free;
  const Icon = cfg.Icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.cls}`}>
      {Icon ? <Icon className="w-3.5 h-3.5" aria-hidden /> : null}
      {cfg.label}
    </span>
  );
}
