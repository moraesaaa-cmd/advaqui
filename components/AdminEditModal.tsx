"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

/**
 * Modal de edição do painel admin — substitui os `window.prompt`/`window.confirm`
 * de entrada de texto por uma janela proper (campos tipados, validação no
 * handler, Esc/clique-fora para fechar). Genérico: 1+ campos, texto/área/senha,
 * e campos somente-leitura (ex.: exibir magic link copiável).
 */
export type AdminField = {
  key: string;
  label: string;
  value: string;
  type?: "text" | "textarea" | "email" | "password";
  readonly?: boolean;
  placeholder?: string;
  help?: string;
};

export type AdminEditConfig = {
  title: string;
  description?: string;
  submitLabel?: string;
  fields: AdminField[];
  onSubmit: (values: Record<string, string>) => void | Promise<void>;
};

export function AdminEditModal({
  config,
  busy,
  onClose
}: {
  config: AdminEditConfig;
  busy?: boolean;
  onClose: () => void;
}) {
  const [vals, setVals] = useState<Record<string, string>>(() =>
    Object.fromEntries(config.fields.map((f) => [f.key, f.value]))
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const editable = config.fields.some((f) => !f.readonly);

  const submit = async () => {
    if (submitting || busy) return;
    setSubmitting(true);
    try {
      await config.onSubmit(vals);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white border border-brand-line shadow-cardHover p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-display text-lg font-bold text-brand-ink">{config.title}</h3>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="text-brand-ink/50 hover:text-brand-ink transition"
          >
            <X className="w-5 h-5" aria-hidden />
          </button>
        </div>
        {config.description && (
          <p className="text-sm text-brand-ink/65 mb-3 leading-relaxed">{config.description}</p>
        )}
        <div className="space-y-3">
          {config.fields.map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-brand-ink mb-1">{f.label}</label>
              {f.type === "textarea" ? (
                <textarea
                  className="input min-h-24"
                  value={vals[f.key] ?? ""}
                  readOnly={f.readonly}
                  placeholder={f.placeholder}
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus={!f.readonly}
                  onChange={(e) => setVals((v) => ({ ...v, [f.key]: e.target.value }))}
                />
              ) : (
                <input
                  className="input"
                  // senha mostrada como texto: o admin precisa comunicar ao advogado
                  type={f.type === "email" ? "email" : "text"}
                  value={vals[f.key] ?? ""}
                  readOnly={f.readonly}
                  placeholder={f.placeholder}
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus={!f.readonly}
                  onFocus={f.readonly ? (e) => e.currentTarget.select() : undefined}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && editable) submit();
                  }}
                  onChange={(e) => setVals((v) => ({ ...v, [f.key]: e.target.value }))}
                />
              )}
              {f.help && <p className="text-xs text-brand-ink/50 mt-1">{f.help}</p>}
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="btn-ghost border border-brand-line text-sm">
            {editable ? "Cancelar" : "Fechar"}
          </button>
          {editable && (
            <button
              onClick={submit}
              disabled={submitting || busy}
              className="btn-primary text-sm disabled:opacity-50"
            >
              {submitting ? "Salvando..." : config.submitLabel || "Salvar"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
