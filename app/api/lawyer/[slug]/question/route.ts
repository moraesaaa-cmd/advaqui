import { NextResponse } from "next/server";
import { findLawyerBySlug } from "@/lib/data/lawyers";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/lawyer/[slug]/question
 *
 * Endpoint público pra visitante enviar pergunta a um advogado.
 * Pergunta entra como status='pending' e só fica pública quando o advogado
 * aprovar+responder via /painel/perguntas.
 *
 * Defensive: se a tabela lawyer_questions não existe (migration 0006
 * pendente), retorna 503 amigável.
 *
 * Anti-spam mínimo: pergunta deve ter ao menos 10 chars, máximo 2000.
 * Rate limit é responsabilidade da camada do front (debounce no botão);
 * em produção, considerar honeypot + reCAPTCHA mais robusto.
 *
 * Maio/2026 — Fase 3 da Página Profissional AdvAqui.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, code: "invalid_json", error: "Requisição inválida." },
      { status: 400 }
    );
  }

  // Honeypot: se o campo "website" do form estiver preenchido, é bot.
  if (typeof body.website === "string" && body.website.trim()) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const question = typeof body.question === "string" ? body.question.trim() : "";
  if (!question || question.length < 10) {
    return NextResponse.json(
      {
        ok: false,
        code: "invalid_question",
        error: "Escreva uma pergunta com pelo menos 10 caracteres."
      },
      { status: 400 }
    );
  }
  if (question.length > 2000) {
    return NextResponse.json(
      {
        ok: false,
        code: "question_too_long",
        error: "Limite de 2.000 caracteres."
      },
      { status: 400 }
    );
  }

  const askerName =
    typeof body.askerName === "string" ? body.askerName.trim().slice(0, 80) : null;
  const askerEmail =
    typeof body.askerEmail === "string" && /\S+@\S+\.\S+/.test(body.askerEmail)
      ? body.askerEmail.trim().slice(0, 120)
      : null;

  const lawyer = await findLawyerBySlug(params.slug);
  if (!lawyer) {
    return NextResponse.json(
      { ok: false, code: "not_found", error: "Profissional não encontrado." },
      { status: 404 }
    );
  }

  // Perguntas só são aceitas em Páginas Profissionais ativas e que não tenham
  // desativado o recurso.
  if (lawyer.planStatus !== "active") {
    return NextResponse.json(
      {
        ok: false,
        code: "not_available",
        error: "Esta Página Profissional não aceita perguntas no momento."
      },
      { status: 403 }
    );
  }
  if (lawyer.allowQuestions === false) {
    return NextResponse.json(
      {
        ok: false,
        code: "questions_disabled",
        error:
          "Este profissional não está aceitando perguntas via Página Profissional no momento."
      },
      { status: 403 }
    );
  }

  // Captura IP truncado pra anti-spam (LGPD-friendly).
  const xff = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";
  const ip = xff.split(",")[0].trim().split(".").slice(0, 3).join(".") + ".0";

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("lawyer_questions")
    .insert({
      lawyer_id: lawyer.id,
      question,
      asker_name: askerName,
      asker_email: askerEmail,
      asker_ip: ip,
      status: "pending"
    })
    .select("id")
    .maybeSingle();

  if (error) {
    if (/relation .+ does not exist/i.test(error.message)) {
      return NextResponse.json(
        {
          ok: false,
          code: "migration_pending",
          error: "Recurso ainda não disponível. Tente novamente em breve."
        },
        { status: 503 }
      );
    }
    console.error("[lawyer:question POST] failed", error);
    return NextResponse.json(
      { ok: false, code: "insert_failed", error: "Não foi possível enviar agora." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, id: data?.id });
}
