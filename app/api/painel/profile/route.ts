import { NextResponse } from "next/server";
import { getCurrentLawyer, normalizeExtraCities, revalidateLawyerPages, toPanelLawyer } from "@/lib/painel/server";
import { titleCaseNameBR } from "@/lib/utils/format";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { LawyerRow } from "@/lib/supabase/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const optionalText = (value: unknown, max = 500): string | null => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
};

const normalizeSpecialties = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(
      value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
    )
  );
};

export async function GET() {
  const current = await getCurrentLawyer();
  if (!current.ok) {
    return NextResponse.json(current, { status: current.status });
  }

  return NextResponse.json({
    ok: true,
    lawyer: toPanelLawyer(current.lawyer)
  });
}

export async function PATCH(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, code: "invalid_json", error: "Requisicao invalida." },
      { status: 400 }
    );
  }

  const current = await getCurrentLawyer();
  if (!current.ok) {
    return NextResponse.json(current, { status: current.status });
  }

  const name =
    typeof body.name === "string"
      ? titleCaseNameBR(body.name)
      : current.lawyer.name;

  if (!name) {
    return NextResponse.json(
      { ok: false, code: "invalid_name", error: "Informe seu nome completo." },
      { status: 400 }
    );
  }

  const isPremium = current.lawyer.plan_status === "active";
  const update: Partial<LawyerRow> = {
    name,
    phone: optionalText(body.phone, 30),
    whatsapp: optionalText(body.whatsapp, 30),
    address: optionalText(body.address, 250),
    bio: optionalText(body.bio, 500),
    specialties: normalizeSpecialties(body.specialties)
  };

  if (isPremium) {
    update.target_city = optionalText(body.targetCity, 120);
    update.target_uf = optionalText(body.targetUf, 2)?.toUpperCase() || null;
    update.extra_cities = normalizeExtraCities(body.extraCities);
  } else {
    update.target_city = null;
    update.target_uf = null;
    update.extra_cities = [];
  }

  const { data, error } = await current.admin
    .from("lawyers")
    .update(update)
    .eq("id", current.lawyer.id)
    .select("*")
    .maybeSingle();

  if (error || !data) {
    console.error("[painel] profile update failed", error);
    return NextResponse.json(
      {
        ok: false,
        code: "update_failed",
        error: error?.message || "Nao foi possivel salvar o perfil."
      },
      { status: 500 }
    );
  }

  const row = data as LawyerRow;
  if (row.name !== current.lawyer.name) {
    try {
      await current.admin.auth.admin.updateUserById(row.id, {
        user_metadata: { name: row.name }
      });
    } catch (err) {
      console.warn("[painel] auth metadata sync failed", err);
    }
  }

  revalidateLawyerPages(row);

  return NextResponse.json({
    ok: true,
    lawyer: toPanelLawyer(row)
  });
}

/**
 * DELETE /api/painel/profile
 *
 * Apaga a conta do advogado logado. Remove tanto da tabela public.lawyers
 * (cascade na FK) quanto de auth.users (admin.auth.admin.deleteUser).
 * Operação irreversível. Não pede confirmação no server — confiamos no
 * confirm() do cliente que mostra modal antes de chamar.
 *
 * Antes de apagar, revalida as páginas onde o perfil aparece pra que o
 * card desapareça do diretório público imediatamente.
 */
export async function DELETE() {
  const current = await getCurrentLawyer();
  if (!current.ok) {
    return NextResponse.json(current, { status: current.status });
  }

  // Revalida ANTES do delete (depois não conseguimos buscar as cidades)
  revalidateLawyerPages(current.lawyer);

  // Apaga em auth.users — cascade em public.lawyers via FK (on delete cascade)
  const admin = createAdminClient();
  const { error: authError } = await admin.auth.admin.deleteUser(current.lawyer.id);

  if (authError) {
    console.error("[painel] account delete failed", authError);
    return NextResponse.json(
      {
        ok: false,
        code: "delete_failed",
        error: authError.message || "Não foi possível excluir a conta."
      },
      { status: 500 }
    );
  }

  // Limpa sessão do cliente (cookies httpOnly)
  try {
    const supabase = createClient();
    await supabase.auth.signOut();
  } catch {
    // ignore — o user já está sendo apagado
  }

  return NextResponse.json({ ok: true });
}
