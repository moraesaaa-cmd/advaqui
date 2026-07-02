import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  revalidateLawyerPages,
  type RevalidatableLawyer
} from "@/lib/painel/revalidate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const CRON_SECRET = process.env.CRON_SECRET || "";

/**
 * Expira planos premium vencidos (roda 1x/dia via crontab do VPS).
 *
 * Regra: lawyers com plan_status = 'active' e plan_end preenchido no passado
 * viram 'expired' e perdem o destaque. Sem plan_end (ativação manual sem
 * vencimento) nada muda — expiração só quando há data explícita.
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") || "";
  if (!CRON_SECRET || token !== CRON_SECRET) {
    return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });
  }

  const supabase = createAdminClient({ noStore: true });
  const nowIso = new Date().toISOString();

  const { data: vencidos, error: selErr } = await supabase
    .from("lawyers")
    .select(
      "id, name, email, plan_end_date, slug, uf, city_slug, target_uf, target_city, extra_cities, specialties"
    )
    .eq("plan_status", "active")
    .not("plan_end_date", "is", null)
    .lt("plan_end_date", nowIso);

  if (selErr) {
    return NextResponse.json({ ok: false, error: selErr.message }, { status: 500 });
  }

  if (!vencidos || vencidos.length === 0) {
    return NextResponse.json({ ok: true, expired: 0, lawyers: [] });
  }

  const ids = vencidos.map((l) => l.id);
  const { error: updErr } = await supabase
    .from("lawyers")
    .update({ plan_status: "expired", featured: false })
    .in("id", ids);

  if (updErr) {
    return NextResponse.json({ ok: false, error: updErr.message }, { status: 500 });
  }

  // Revalida as páginas de cada advogado expirado (perfil, home, /advogados,
  // estado/cidade/especialidade, sitemap). Sem isso, páginas com ISR (ex.:
  // /advogado/[slug] com revalidate=3600, /advogados/[uf] com 3600, home e
  // /advogados com 600) continuavam exibindo o selo/topo premium por até 1h
  // depois da expiração.
  for (const l of vencidos) {
    revalidateLawyerPages(l as unknown as RevalidatableLawyer);
  }

  return NextResponse.json({
    ok: true,
    expired: ids.length,
    lawyers: vencidos.map((l) => ({ name: l.name, email: l.email, plan_end: l.plan_end_date }))
  });
}
