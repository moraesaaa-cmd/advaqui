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
      { ok: false, code: "invalid_json", error: "Requisição inválida." },
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

  // Sanitiza URL: aceita https/http, rejeita javascript: e similares.
  const optionalUrl = (value: unknown, max = 250): string | null => {
    const t = optionalText(value, max);
    if (!t) return null;
    const lower = t.toLowerCase();
    if (lower.startsWith("javascript:") || lower.startsWith("data:")) return null;
    // Auto-prepend https:// se não tem protocolo (UX: user cola "instagram.com/xpto")
    if (!/^https?:\/\//i.test(t)) return `https://${t}`;
    return t;
  };

  // Normaliza handle do Instagram: remove @, espaços, URL completa.
  const normalizeHandle = (value: unknown, max = 60): string | null => {
    const t = optionalText(value, max);
    if (!t) return null;
    // Se for URL, extrai o último segmento
    const urlMatch = t.match(/(?:instagram\.com|linkedin\.com\/in)\/([^/?#]+)/i);
    if (urlMatch) return urlMatch[1].replace(/^@/, "").trim() || null;
    return t.replace(/^@/, "").trim() || null;
  };

  // BUG CRÍTICO RESOLVIDO (Maio/2026): antes, qualquer PATCH /api/painel/profile
  // setava photo_url = optionalText(body.photoUrl, 500), o que devolvia null
  // quando o painel não incluía esse campo no body (ex: user clica "Salvar
  // alterações" depois de editar só nome ou bio). Resultado: a FOTO ERA
  // APAGADA toda vez que o user salvava qualquer outra alteração.
  //
  // Solução: para os campos opcionais (foto + premium), só incluir no UPDATE
  // se a CHAVE estiver presente no body. Se o painel não mandou photoUrl, a
  // foto fica intacta no banco. Idem pra website, instagram, linkedin,
  // office_hours, target_city, target_uf, extra_cities — só atualiza quando
  // o cliente explicitamente envia.
  const update: Partial<LawyerRow> = {
    name,
    phone: optionalText(body.phone, 30),
    whatsapp: optionalText(body.whatsapp, 30),
    address: optionalText(body.address, 250),
    bio: optionalText(body.bio, 500),
    specialties: normalizeSpecialties(body.specialties)
  };

  // photo_url só é alterado se o cliente explicitamente enviou a key.
  // Aceita string vazia/null como "limpar a foto" (UX: PhotoUploader > Remover).
  if ("photoUrl" in body) {
    update.photo_url = optionalText(body.photoUrl, 500);
  }

  // ----- Fase 3 — campos de apresentação (aceitos só pra premium) ---------

  /** Normaliza array de strings, dedup, limita por count. */
  const normalizeStringArray = (
    value: unknown,
    allowed?: ReadonlyArray<string>,
    maxItems = 3
  ): string[] | null => {
    if (!Array.isArray(value)) return null;
    const out: string[] = [];
    const seen = new Set<string>();
    for (const v of value) {
      if (typeof v !== "string") continue;
      const trimmed = v.trim();
      if (!trimmed) continue;
      if (allowed && !allowed.includes(trimmed)) continue;
      if (seen.has(trimmed)) continue;
      seen.add(trimmed);
      out.push(trimmed);
      if (out.length >= maxItems) break;
    }
    return out;
  };

  const ALLOWED_MODALITIES = ["in_person", "online"] as const;
  const ALLOWED_CONTACT = ["whatsapp", "phone", "email"] as const;
  const ALLOWED_ACCENT = ["amber", "emerald", "blue", "rose", "slate"] as const;
  const ALLOWED_HEADER = ["compact", "expanded"] as const;

  /** Boolean coerce — só atualiza se vier explícito como bool. */
  const optionalBool = (value: unknown): boolean | undefined =>
    typeof value === "boolean" ? value : undefined;

  if (isPremium) {
    if ("targetCity" in body) update.target_city = optionalText(body.targetCity, 120);
    if ("targetUf" in body)
      update.target_uf = optionalText(body.targetUf, 2)?.toUpperCase() || null;
    if ("extraCities" in body) update.extra_cities = normalizeExtraCities(body.extraCities);
    if ("website" in body) update.website = optionalUrl(body.website, 250);
    if ("instagram" in body) update.instagram = normalizeHandle(body.instagram, 60);
    if ("linkedin" in body) update.linkedin = normalizeHandle(body.linkedin, 100);
    if ("officeHours" in body) update.office_hours = optionalText(body.officeHours, 200);

    // ----- Fase 3 -----
    if ("shortSummary" in body)
      (update as Record<string, unknown>).short_summary = optionalText(body.shortSummary, 160);
    if ("primarySpecialties" in body)
      (update as Record<string, unknown>).primary_specialties =
        normalizeStringArray(body.primarySpecialties, undefined, 3) || [];
    if ("serviceModalities" in body)
      (update as Record<string, unknown>).service_modalities =
        normalizeStringArray(body.serviceModalities, ALLOWED_MODALITIES, 2) || [];
    if ("serviceRegion" in body)
      (update as Record<string, unknown>).service_region = optionalText(body.serviceRegion, 200);
    if ("preferredContact" in body) {
      const pc = typeof body.preferredContact === "string" ? body.preferredContact.trim() : "";
      (update as Record<string, unknown>).preferred_contact =
        pc && (ALLOWED_CONTACT as ReadonlyArray<string>).includes(pc) ? pc : null;
    }
    if ("showAddress" in body) {
      const b = optionalBool(body.showAddress);
      if (b !== undefined) (update as Record<string, unknown>).show_address = b;
    }
    if ("showAddressFull" in body) {
      const b = optionalBool(body.showAddressFull);
      if (b !== undefined) (update as Record<string, unknown>).show_address_full = b;
    }
    if ("showEmail" in body) {
      const b = optionalBool(body.showEmail);
      if (b !== undefined) (update as Record<string, unknown>).show_email = b;
    }
    if ("showPhone" in body) {
      const b = optionalBool(body.showPhone);
      if (b !== undefined) (update as Record<string, unknown>).show_phone = b;
    }
    if ("showExtraCities" in body) {
      const b = optionalBool(body.showExtraCities);
      if (b !== undefined) (update as Record<string, unknown>).show_extra_cities = b;
    }
    if ("showUsefulDocs" in body) {
      const b = optionalBool(body.showUsefulDocs);
      if (b !== undefined) (update as Record<string, unknown>).show_useful_docs = b;
    }
    if ("showArticles" in body) {
      const b = optionalBool(body.showArticles);
      if (b !== undefined) (update as Record<string, unknown>).show_articles = b;
    }
    if ("showQuestions" in body) {
      const b = optionalBool(body.showQuestions);
      if (b !== undefined) (update as Record<string, unknown>).show_questions = b;
    }
    if ("showFaqs" in body) {
      const b = optionalBool(body.showFaqs);
      if (b !== undefined) (update as Record<string, unknown>).show_faqs = b;
    }
    if ("allowQuestions" in body) {
      const b = optionalBool(body.allowQuestions);
      if (b !== undefined) (update as Record<string, unknown>).allow_questions = b;
    }
    if ("accentColor" in body) {
      const c = typeof body.accentColor === "string" ? body.accentColor.trim() : "";
      if (c && (ALLOWED_ACCENT as ReadonlyArray<string>).includes(c))
        (update as Record<string, unknown>).accent_color = c;
    }
    if ("headerLayout" in body) {
      const c = typeof body.headerLayout === "string" ? body.headerLayout.trim() : "";
      if (c && (ALLOWED_HEADER as ReadonlyArray<string>).includes(c))
        (update as Record<string, unknown>).header_layout = c;
    }
  } else {
    // Quando o user perde o premium, zeramos os campos premium UMA VEZ.
    // Mas só se vier explicit no body (evita zerar a cada PATCH sem necessidade).
    if ("targetCity" in body) update.target_city = null;
    if ("targetUf" in body) update.target_uf = null;
    if ("extraCities" in body) update.extra_cities = [];
    if ("website" in body) update.website = null;
    if ("instagram" in body) update.instagram = null;
    if ("linkedin" in body) update.linkedin = null;
    if ("officeHours" in body) update.office_hours = null;
  }

  // Tenta o UPDATE completo. Se falhar com "column does not exist" (migration
  // 0005 ainda não aplicada no banco), refaz sem os campos novos. Isso evita
  // que o painel inteiro pare de salvar perfil enquanto a migration está
  // pendente — campos antigos continuam funcionando.
  // Colunas que podem não existir se a migration ainda não foi aplicada.
  // Em produção, se o UPDATE falhar com "column does not exist", removemos
  // essas e refazemos o UPDATE com o que restou — assim o painel não trava.
  const PREMIUM_NEW_COLS: string[] = [
    "photo_url",
    "website",
    "instagram",
    "linkedin",
    "office_hours",
    // Fase 3 — migration 0006
    "short_summary",
    "primary_specialties",
    "service_modalities",
    "service_region",
    "preferred_contact",
    "show_address",
    "show_address_full",
    "show_email",
    "show_phone",
    "show_extra_cities",
    "show_useful_docs",
    "show_articles",
    "show_questions",
    "show_faqs",
    "allow_questions",
    "accent_color",
    "header_layout"
  ];

  let { data, error } = await current.admin
    .from("lawyers")
    .update(update)
    .eq("id", current.lawyer.id)
    .select("*")
    .maybeSingle();

  if (error && /column .+ does not exist/i.test(error.message)) {
    console.warn(
      "[painel] migration 0005 pending — retrying update without new columns",
      error.message
    );
    const safeUpdate: Record<string, unknown> = { ...(update as Record<string, unknown>) };
    for (const col of PREMIUM_NEW_COLS) {
      delete safeUpdate[col];
    }
    const retry = await current.admin
      .from("lawyers")
      .update(safeUpdate as Record<string, unknown> as never)
      .eq("id", current.lawyer.id)
      .select("*")
      .maybeSingle();
    data = retry.data;
    error = retry.error;
  }

  if (error || !data) {
    console.error("[painel] profile update failed", error);
    return NextResponse.json(
      {
        ok: false,
        code: "update_failed",
        error: error?.message || "Não foi possível salvar o perfil."
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
