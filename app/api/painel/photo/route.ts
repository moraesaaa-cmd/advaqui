import { NextResponse } from "next/server";
import { getCurrentLawyer, revalidateLawyerPages } from "@/lib/painel/server";
import type { LawyerRow } from "@/lib/supabase/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/painel/photo  — upload de foto de perfil.
 *
 * Aceita multipart/form-data com campo "file" (max 2MB, image/jpeg ou
 * image/png ou image/webp). Faz upload pro bucket "avatars" do Supabase
 * Storage com nome estável `{lawyer_id}.{ext}` (overwrites na atualização),
 * gera URL pública e salva em lawyers.photo_url.
 *
 * Se o bucket "avatars" não existir (migration 0005 não foi aplicada),
 * retorna erro claro indicando o problema.
 */
export async function POST(req: Request) {
  const current = await getCurrentLawyer();
  if (!current.ok) {
    return NextResponse.json(current, { status: current.status });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { ok: false, code: "invalid_form", error: "Formato de envio inválido." },
      { status: 400 }
    );
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, code: "no_file", error: "Envie um arquivo de imagem." },
      { status: 400 }
    );
  }

  // Validação de tamanho — 5MB max (permite fotos de boa resolução, ~800-1200px).
  const MAX_BYTES = 5 * 1024 * 1024;
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      {
        ok: false,
        code: "too_large",
        error: "Arquivo muito grande. Máximo 5 MB."
      },
      { status: 400 }
    );
  }

  // Validação de tipo — só imagens raster comuns.
  const allowed: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp"
  };
  const ext = allowed[file.type.toLowerCase()];
  if (!ext) {
    return NextResponse.json(
      {
        ok: false,
        code: "bad_format",
        error: "Use JPG, PNG ou WebP."
      },
      { status: 400 }
    );
  }

  const filename = `${current.lawyer.id}.${ext}`;
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  // Upload com upsert — sobrescreve a foto anterior do mesmo usuário.
  const { error: uploadError } = await current.admin.storage
    .from("avatars")
    .upload(filename, bytes, {
      contentType: file.type,
      upsert: true,
      cacheControl: "3600"
    });

  if (uploadError) {
    // Erro típico quando bucket não existe — migration 0005 pendente.
    const isBucketMissing = /bucket .*not found|not exist/i.test(
      uploadError.message
    );
    console.error("[photo] upload failed", uploadError);
    return NextResponse.json(
      {
        ok: false,
        code: isBucketMissing ? "storage_not_ready" : "upload_failed",
        error: isBucketMissing
          ? "Storage de fotos ainda não inicializado. Avise o administrador."
          : uploadError.message || "Falha ao subir a imagem."
      },
      { status: 500 }
    );
  }

  // URL pública. Bucket "avatars" é public read (configurado na migration 0005).
  const { data: publicData } = current.admin.storage
    .from("avatars")
    .getPublicUrl(filename);
  // Quebra de cache: força browser/CDN a buscar a nova foto após upload.
  const photoUrl = `${publicData.publicUrl}?v=${Date.now()}`;

  const { error: updateError } = await current.admin
    .from("lawyers")
    .update({ photo_url: photoUrl } as Partial<LawyerRow>)
    .eq("id", current.lawyer.id);

  if (updateError) {
    // Coluna photo_url ainda não existe (migration 0005 pendente).
    // A foto FOI subida pro Storage, então damos a URL pra UI mostrar
    // mesmo sem persistência no banco. Quando migration rodar, próximo
    // upload persiste normal.
    const isMissingColumn = /column .+ does not exist/i.test(updateError.message);
    if (isMissingColumn) {
      console.warn(
        "[photo] migration 0005 pending — photo uploaded to storage but not persisted",
        updateError.message
      );
      return NextResponse.json(
        {
          ok: false,
          code: "db_schema_pending",
          error:
            "A foto foi enviada, mas a coluna do banco ainda não foi criada. Avise o administrador para rodar a migration 0005."
        },
        { status: 503 }
      );
    }
    console.error("[photo] db update failed", updateError);
    return NextResponse.json(
      {
        ok: false,
        code: "db_update_failed",
        error: "Foto subida, mas não consegui salvar no perfil. Tente novamente."
      },
      { status: 500 }
    );
  }

  revalidateLawyerPages(current.lawyer);

  return NextResponse.json({ ok: true, photoUrl });
}

/**
 * DELETE /api/painel/photo — remove a foto atual.
 *
 * Apaga do Storage e zera lawyers.photo_url. Operação reversível pelo
 * próprio user (re-upload).
 */
export async function DELETE() {
  const current = await getCurrentLawyer();
  if (!current.ok) {
    return NextResponse.json(current, { status: current.status });
  }

  // Apaga as variações de extensão que podem existir (jpg, png, webp).
  const possible = [
    `${current.lawyer.id}.jpg`,
    `${current.lawyer.id}.png`,
    `${current.lawyer.id}.webp`
  ];
  await current.admin.storage.from("avatars").remove(possible).catch(() => {
    /* ignore — pode não existir */
  });

  const { error } = await current.admin
    .from("lawyers")
    .update({ photo_url: null } as Partial<LawyerRow>)
    .eq("id", current.lawyer.id);

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        code: "db_update_failed",
        error: "Não foi possível remover a foto."
      },
      { status: 500 }
    );
  }

  revalidateLawyerPages(current.lawyer);
  return NextResponse.json({ ok: true });
}
