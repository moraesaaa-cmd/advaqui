"use client";

import { useRef, useState } from "react";
import { Camera, Trash2, Loader2, User, Link as LinkIcon } from "lucide-react";

/**
 * Uploader de foto de perfil — duas formas de adicionar foto:
 *
 *   1. Upload direto: input file → POST /api/painel/photo (multipart)
 *      → Supabase Storage bucket "avatars" (migration 0005) → public URL.
 *
 *   2. URL externa: o user cola URL pública (Imgur, Drive público etc.)
 *      → PATCH /api/painel/profile com { photoUrl } → salva direto.
 *
 * O segundo fluxo serve de fallback caso o bucket ainda não esteja
 * configurado, ou se o user prefere hospedar em outro lugar.
 *
 * Mostra preview circular, fallback de iniciais quando sem foto.
 */
export function PhotoUploader({
  initialPhotoUrl,
  fallbackName,
  onChange
}: {
  initialPhotoUrl?: string;
  fallbackName: string;
  /** Chamado quando a foto muda — pra parent componente re-renderizar. */
  onChange?: (url: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(initialPhotoUrl);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showExternal, setShowExternal] = useState(false);
  const [externalUrl, setExternalUrl] = useState("");

  const initials = fallbackName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  const upload = async (file: File) => {
    setError(null);
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/painel/photo", {
        method: "POST",
        body: fd
      });
      const data = (await res.json()) as {
        ok: boolean;
        code?: string;
        error?: string;
        photoUrl?: string;
      };
      if (!res.ok || !data.ok || !data.photoUrl) {
        throw new Error(data.error || "Falha ao enviar foto.");
      }
      setPhotoUrl(data.photoUrl);
      onChange?.(data.photoUrl);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro inesperado.";
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  const removePhoto = async () => {
    if (!confirm("Remover sua foto de perfil?")) return;
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/painel/photo", { method: "DELETE" });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Falha ao remover.");
      }
      setPhotoUrl(undefined);
      onChange?.(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro inesperado.";
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  const saveExternal = async () => {
    setError(null);
    const trimmed = externalUrl.trim();
    if (!trimmed) {
      setError("Cole uma URL válida.");
      return;
    }
    if (!/^https?:\/\//i.test(trimmed)) {
      setError("URL deve começar com http:// ou https://.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/painel/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoUrl: trimmed })
      });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        lawyer?: { photoUrl?: string };
      };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Falha ao salvar URL.");
      }
      const newUrl = data.lawyer?.photoUrl || trimmed;
      setPhotoUrl(newUrl);
      onChange?.(newUrl);
      setShowExternal(false);
      setExternalUrl("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro inesperado.";
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-brand-line bg-white p-5">
      <h3 className="font-display text-base font-bold text-brand-ink mb-1">
        Foto de perfil
      </h3>
      <p className="text-xs text-brand-ink/60 mb-4">
        Aparece nos cards do diretório e no seu perfil público. JPG, PNG ou WebP até 2 MB.
      </p>

      <div className="flex items-start gap-4">
        {/* Preview circular */}
        <div className="relative flex-shrink-0">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoUrl}
              alt="Sua foto de perfil"
              className="w-24 h-24 rounded-full object-cover border-2 border-brand-accent ring-2 ring-brand-accent/20"
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full bg-brand-deep/10 flex items-center justify-center font-display text-2xl font-bold text-brand-deep border-2 border-brand-line"
              aria-label={`Sem foto — iniciais ${initials}`}
            >
              {initials || <User className="w-10 h-10 text-brand-deep/60" aria-hidden />}
            </div>
          )}
          {busy && (
            <div className="absolute inset-0 rounded-full bg-white/70 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-brand-deep animate-spin" aria-hidden />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                void upload(file);
                // resetar pra permitir re-upload do mesmo arquivo
                event.target.value = "";
              }
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="btn-accent text-sm w-full sm:w-auto inline-flex items-center gap-2 justify-center"
          >
            <Camera className="w-4 h-4" aria-hidden />
            {photoUrl ? "Trocar foto" : "Enviar foto"}
          </button>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowExternal((v) => !v)}
              disabled={busy}
              className="text-xs inline-flex items-center gap-1.5 text-brand-deep hover:text-brand-accent2"
            >
              <LinkIcon className="w-3 h-3" aria-hidden />
              {showExternal ? "Cancelar" : "Tenho foto em outra URL"}
            </button>
            {photoUrl && (
              <button
                type="button"
                onClick={() => void removePhoto()}
                disabled={busy}
                className="text-xs inline-flex items-center gap-1.5 text-red-700 hover:text-red-900"
              >
                <Trash2 className="w-3 h-3" aria-hidden />
                Remover foto
              </button>
            )}
          </div>

          {showExternal && (
            <div className="mt-2 p-3 rounded-xl border border-brand-line bg-brand-bg/40">
              <label className="block text-xs font-medium text-brand-ink mb-1">
                Cole a URL da imagem (Imgur, Google Drive público, etc.)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://..."
                  className="input flex-1 text-sm"
                  value={externalUrl}
                  onChange={(event) => setExternalUrl(event.target.value)}
                />
                <button
                  type="button"
                  onClick={() => void saveExternal()}
                  disabled={busy || !externalUrl.trim()}
                  className="btn-primary text-sm"
                >
                  Salvar
                </button>
              </div>
            </div>
          )}

          {error && (
            <p className="text-xs text-red-700 mt-2" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
