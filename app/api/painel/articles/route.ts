import { NextResponse } from "next/server";
import { getCurrentLawyer } from "@/lib/painel/server";
import { slugify } from "@/lib/utils/slug";

/**
 * API de Artigos próprios do advogado (premium).
 *
 *   GET  /api/painel/articles            → lista todos os artigos do user
 *   POST /api/painel/articles            → cria artigo (status default = draft)
 *
 * Edição/exclusão ficam em /api/painel/articles/[id]/route.ts.
 *
 * Defensive: se a tabela lawyer_articles não existe (migration 0006 ainda
 * não aplicada), retorna 503 com mensagem amigável.
 *
 * Maio/2026 — Fase 3 da Página Profissional AdvAqui.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ArticleStatus = "draft" | "scheduled" | "published" | "paused" | "archived";
const VALID_STATUSES: ArticleStatus[] = [
  "draft",
  "scheduled",
  "published",
  "paused",
  "archived"
];

const MIGRATION_PENDING_RESPONSE = NextResponse.json(
  {
    ok: false,
    code: "migration_pending",
    error:
      "Recurso de artigos ainda não foi liberado no banco. Avise o suporte (migration 0006 pendente)."
  },
  { status: 503 }
);

export async function GET() {
  const current = await getCurrentLawyer();
  if (!current.ok) return NextResponse.json(current, { status: current.status });

  const { data, error } = await current.admin
    .from("lawyer_articles")
    .select("*")
    .eq("lawyer_id", current.lawyer.id)
    .order("created_at", { ascending: false });

  if (error) {
    if (/relation .+ does not exist/i.test(error.message)) return MIGRATION_PENDING_RESPONSE;
    console.error("[painel:articles GET] failed", error);
    return NextResponse.json(
      { ok: false, code: "read_failed", error: "Não foi possível carregar os artigos." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, articles: data || [] });
}

export async function POST(req: Request) {
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
  if (!current.ok) return NextResponse.json(current, { status: current.status });

  if (current.lawyer.plan_status !== "active") {
    return NextResponse.json(
      {
        ok: false,
        code: "premium_required",
        error: "Artigos próprios são um recurso do plano premium ativo."
      },
      { status: 403 }
    );
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title || title.length < 5) {
    return NextResponse.json(
      {
        ok: false,
        code: "invalid_title",
        error: "Informe um título com pelo menos 5 caracteres."
      },
      { status: 400 }
    );
  }

  const bodyText = typeof body.body === "string" ? body.body.trim() : "";
  if (!bodyText || bodyText.length < 50) {
    return NextResponse.json(
      {
        ok: false,
        code: "invalid_body",
        error: "O conteúdo do artigo precisa ter pelo menos 50 caracteres."
      },
      { status: 400 }
    );
  }

  const summary = typeof body.summary === "string" ? body.summary.trim().slice(0, 300) : null;
  const specialtySlug =
    typeof body.specialtySlug === "string" ? body.specialtySlug.trim() : null;
  const slug = slugify(title);

  const wordCount = bodyText.split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.round(wordCount / 200));

  const status: ArticleStatus =
    typeof body.status === "string" && VALID_STATUSES.includes(body.status as ArticleStatus)
      ? (body.status as ArticleStatus)
      : "draft";

  const scheduledFor =
    typeof body.scheduledFor === "string" && body.scheduledFor.trim()
      ? new Date(body.scheduledFor).toISOString()
      : null;

  const now = new Date().toISOString();
  const insert = {
    lawyer_id: current.lawyer.id,
    slug,
    title: title.slice(0, 200),
    summary,
    body: bodyText.slice(0, 50000),
    specialty_slug: specialtySlug,
    status,
    scheduled_for: scheduledFor,
    published_at: status === "published" ? now : null,
    word_count: wordCount,
    read_time_minutes: readTime
  };

  const { data, error } = await current.admin
    .from("lawyer_articles")
    .insert(insert)
    .select("*")
    .maybeSingle();

  if (error) {
    if (/relation .+ does not exist/i.test(error.message)) return MIGRATION_PENDING_RESPONSE;
    // Slug duplicado pra mesmo lawyer — adiciona sufixo random
    if (/duplicate key|unique constraint/i.test(error.message)) {
      const fallbackSlug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
      const retry = await current.admin
        .from("lawyer_articles")
        .insert({ ...insert, slug: fallbackSlug })
        .select("*")
        .maybeSingle();
      if (retry.error || !retry.data) {
        console.error("[painel:articles POST] retry failed", retry.error);
        return NextResponse.json(
          { ok: false, code: "create_failed", error: "Não foi possível criar o artigo." },
          { status: 500 }
        );
      }
      return NextResponse.json({ ok: true, article: retry.data });
    }
    console.error("[painel:articles POST] failed", error);
    return NextResponse.json(
      { ok: false, code: "create_failed", error: error.message || "Erro ao criar artigo." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, article: data });
}
