import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCurrentLawyer } from "@/lib/painel/server";
import { slugify } from "@/lib/utils/slug";

/**
 * API de artigos UGC para o blog público do AdvAqui.
 *
 *   GET  /api/painel/blog   → lista artigos do advogado no blog público
 *   POST /api/painel/blog   → submete novo artigo (status = 'pending')
 *   PUT  /api/painel/blog   → atualiza artigo próprio (draft ou pending)
 *
 * Artigos submetidos passam por revisão antes de publicação.
 * Apenas advogados com plano premium ativo podem usar este recurso.
 *
 * Tabela: blog_articles (mesma dos artigos IA, com author_id preenchido).
 *
 * Junho/2026 — UGC Blog AdvAqui.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type UgcStatus = "draft" | "pending" | "published" | "rejected";

const migrationPendingResponse = () =>
  NextResponse.json(
    {
      ok: false,
      code: "migration_pending",
      error:
        "Recurso de blog UGC ainda não foi liberado no banco. Avise o suporte (migration 0015 pendente)."
    },
    { status: 503 }
  );

function isMigrationError(msg: string): boolean {
  return /relation .+ does not exist|column .+ does not exist/i.test(msg);
}

/* ─────────────────────────────────────────────────────────── GET ──── */

export async function GET() {
  const current = await getCurrentLawyer();
  if (!current.ok)
    return NextResponse.json(current, { status: current.status });

  const { data, error } = await current.admin
    .from("blog_articles")
    .select("id, slug, title, excerpt, meta_description, category, status, author_name, created_at, published_at, reading_minutes")
    .eq("author_id", current.lawyer.id)
    .order("created_at", { ascending: false });

  if (error) {
    if (isMigrationError(error.message)) return migrationPendingResponse();
    console.error("[painel:blog GET] failed", error);
    return NextResponse.json(
      { ok: false, code: "read_failed", error: "Não foi possível carregar os artigos." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, articles: data || [] });
}

/* ─────────────────────────────────────────────────────────── POST ──── */

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
  if (!current.ok)
    return NextResponse.json(current, { status: current.status });

  if (current.lawyer.plan_status !== "active") {
    return NextResponse.json(
      {
        ok: false,
        code: "premium_required",
        error: "Publicar no blog é um recurso exclusivo do plano premium."
      },
      { status: 403 }
    );
  }

  // Validação de campos
  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title || title.length < 5) {
    return NextResponse.json(
      { ok: false, code: "invalid_title", error: "Informe um título com pelo menos 5 caracteres." },
      { status: 400 }
    );
  }

  const content = typeof body.content === "string" ? body.content.trim() : "";
  if (!content || content.length < 100) {
    return NextResponse.json(
      {
        ok: false,
        code: "invalid_content",
        error: "O conteúdo do artigo precisa ter pelo menos 100 caracteres."
      },
      { status: 400 }
    );
  }

  const metaDescription =
    typeof body.meta_description === "string"
      ? body.meta_description.trim().slice(0, 160)
      : "";

  // Gera slug a partir do título
  const baseSlug = slugify(title);
  const slug = baseSlug || `artigo-${Date.now()}`;

  // Calcula tempo de leitura
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.round(wordCount / 200));

  // Categoria inferida (opcional — pode ser expandida no futuro)
  const category =
    typeof body.category === "string" && body.category.trim()
      ? body.category.trim()
      : "Artigo de advogado";

  const insert = {
    slug,
    title: title.slice(0, 200),
    excerpt: metaDescription || title.slice(0, 160),
    meta_description: metaDescription || null,
    category,
    body: content.slice(0, 50000),
    reading_minutes: readingMinutes,
    author: current.lawyer.name,
    author_id: current.lawyer.id,
    author_name: current.lawyer.name,
    status: "pending" as const,
    published_at: null
  };

  const { data, error } = await current.admin
    .from("blog_articles")
    .insert(insert)
    .select("id, slug, title, status, created_at")
    .maybeSingle();

  if (error) {
    if (isMigrationError(error.message)) return migrationPendingResponse();

    // Slug duplicado — adiciona sufixo
    if (/duplicate key|unique constraint/i.test(error.message)) {
      const fallbackSlug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
      const retry = await current.admin
        .from("blog_articles")
        .insert({ ...insert, slug: fallbackSlug })
        .select("id, slug, title, status, created_at")
        .maybeSingle();

      if (retry.error || !retry.data) {
        console.error("[painel:blog POST] retry failed", retry.error);
        return NextResponse.json(
          { ok: false, code: "create_failed", error: "Não foi possível criar o artigo." },
          { status: 500 }
        );
      }
      return NextResponse.json({ ok: true, article: retry.data });
    }

    console.error("[painel:blog POST] failed", error);
    return NextResponse.json(
      { ok: false, code: "create_failed", error: error.message || "Erro ao criar artigo." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, article: data });
}

/* ─────────────────────────────────────────────────────────── PUT ──── */

export async function PUT(req: Request) {
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
  if (!current.ok)
    return NextResponse.json(current, { status: current.status });

  if (current.lawyer.plan_status !== "active") {
    return NextResponse.json(
      {
        ok: false,
        code: "premium_required",
        error: "Publicar no blog é um recurso exclusivo do plano premium."
      },
      { status: 403 }
    );
  }

  const articleId = typeof body.id === "string" ? body.id.trim() : "";
  if (!articleId) {
    return NextResponse.json(
      { ok: false, code: "missing_id", error: "ID do artigo é obrigatório." },
      { status: 400 }
    );
  }

  // Verifica se o artigo pertence ao advogado e está em status editável
  const { data: existing, error: fetchError } = await current.admin
    .from("blog_articles")
    .select("id, status, author_id")
    .eq("id", articleId)
    .eq("author_id", current.lawyer.id)
    .maybeSingle();

  if (fetchError) {
    if (isMigrationError(fetchError.message)) return migrationPendingResponse();
    console.error("[painel:blog PUT] fetch failed", fetchError);
    return NextResponse.json(
      { ok: false, code: "read_failed", error: "Erro ao buscar artigo." },
      { status: 500 }
    );
  }

  if (!existing) {
    return NextResponse.json(
      { ok: false, code: "not_found", error: "Artigo não encontrado." },
      { status: 404 }
    );
  }

  // Só permite editar artigos em draft, pending ou rejected
  if (!["draft", "pending", "rejected"].includes(existing.status)) {
    return NextResponse.json(
      {
        ok: false,
        code: "not_editable",
        error: "Artigos publicados não podem ser editados. Entre em contato com o suporte."
      },
      { status: 403 }
    );
  }

  // Monta update
  const update: Record<string, unknown> = {};

  if (typeof body.title === "string" && body.title.trim()) {
    const newTitle = body.title.trim().slice(0, 200);
    update.title = newTitle;
    update.slug = slugify(newTitle) || existing.id;
    update.excerpt = typeof body.meta_description === "string"
      ? body.meta_description.trim().slice(0, 160) || newTitle.slice(0, 160)
      : newTitle.slice(0, 160);
  }

  if (typeof body.content === "string") {
    const newContent = body.content.trim().slice(0, 50000);
    if (newContent.length < 100) {
      return NextResponse.json(
        {
          ok: false,
          code: "invalid_content",
          error: "O conteúdo precisa ter pelo menos 100 caracteres."
        },
        { status: 400 }
      );
    }
    update.body = newContent;
    const wc = newContent.split(/\s+/).filter(Boolean).length;
    update.reading_minutes = Math.max(1, Math.round(wc / 200));
  }

  if (typeof body.meta_description === "string") {
    update.meta_description = body.meta_description.trim().slice(0, 160) || null;
    if (!update.excerpt) {
      update.excerpt = body.meta_description.trim().slice(0, 160);
    }
  }

  // Resubmeter para revisão (volta a 'pending')
  if (body.resubmit === true) {
    update.status = "pending";
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json(
      { ok: false, code: "nothing_to_update", error: "Nada para atualizar." },
      { status: 400 }
    );
  }

  const { data: updated, error: updateError } = await current.admin
    .from("blog_articles")
    .update(update as Record<string, unknown> as never)
    .eq("id", articleId)
    .eq("author_id", current.lawyer.id)
    .select("id, slug, title, status, created_at")
    .maybeSingle();

  if (updateError) {
    if (isMigrationError(updateError.message)) return migrationPendingResponse();

    // Slug duplicado ao editar título
    if (/duplicate key|unique constraint/i.test(updateError.message) && update.slug) {
      update.slug = `${update.slug}-${Math.random().toString(36).slice(2, 6)}`;
      const retry = await current.admin
        .from("blog_articles")
        .update(update as Record<string, unknown> as never)
        .eq("id", articleId)
        .eq("author_id", current.lawyer.id)
        .select("id, slug, title, status, created_at")
        .maybeSingle();
      if (retry.error || !retry.data) {
        console.error("[painel:blog PUT] retry failed", retry.error);
        return NextResponse.json(
          { ok: false, code: "update_failed", error: "Erro ao atualizar." },
          { status: 500 }
        );
      }
      return NextResponse.json({ ok: true, article: retry.data });
    }

    console.error("[painel:blog PUT] failed", updateError);
    return NextResponse.json(
      { ok: false, code: "update_failed", error: updateError.message || "Erro ao salvar." },
      { status: 500 }
    );
  }

  if (!updated) {
    return NextResponse.json(
      { ok: false, code: "not_found", error: "Artigo não encontrado." },
      { status: 404 }
    );
  }

  // Se voltou a pending, revalida o blog para garantir
  if (update.status === "pending" || existing.status === "published") {
    try {
      revalidatePath("/blog");
    } catch (err) {
      console.warn("[painel:blog PUT] revalidatePath failed", err);
    }
  }

  return NextResponse.json({ ok: true, article: updated });
}
