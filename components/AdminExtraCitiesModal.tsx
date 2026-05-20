"use client";

import { useEffect, useState } from "react";
import { X, Plus, Trash2, Save } from "lucide-react";

/**
 * Modal de edição de cidades adicionais (extra_cities) no painel admin.
 *
 * Substitui o antigo `window.prompt()` multilinha — agora cada cidade
 * tem campos individuais (UF, slug, nome). Permite adicionar/remover
 * cidades uma a uma, com validação inline.
 *
 * Estado controlado: parent fornece initialValue + onSave/onCancel.
 * O save envia o array final pro endpoint admin.
 *
 * Maio/2026 — Fase 4 da Página Profissional AdvAqui.
 */

const UFS = [
  "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MS", "MT",
  "PA", "PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO"
];

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export type ExtraCity = { name: string; slug: string; uf: string };

type Props = {
  lawyerName: string;
  initialValue: ExtraCity[];
  busy: boolean;
  onSave: (cities: ExtraCity[]) => Promise<void>;
  onClose: () => void;
};

export function AdminExtraCitiesModal({
  lawyerName,
  initialValue,
  busy,
  onSave,
  onClose
}: Props) {
  const [cities, setCities] = useState<ExtraCity[]>(() =>
    initialValue.map((c) => ({ ...c }))
  );

  // ESC fecha o modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [busy, onClose]);

  const addCity = () => {
    if (cities.length >= 9) return;
    setCities([...cities, { name: "", slug: "", uf: "MG" }]);
  };

  const removeCity = (idx: number) => {
    setCities(cities.filter((_, i) => i !== idx));
  };

  const updateCity = (idx: number, patch: Partial<ExtraCity>) => {
    setCities(
      cities.map((c, i) => {
        if (i !== idx) return c;
        const next = { ...c, ...patch };
        // Se o nome mudou, recalcula slug automaticamente
        if (patch.name !== undefined) {
          next.slug = slugify(patch.name);
        }
        if (patch.uf !== undefined) {
          next.uf = patch.uf.toUpperCase();
        }
        return next;
      })
    );
  };

  const save = async () => {
    // Filtra cidades incompletas antes de enviar
    const valid = cities.filter(
      (c) =>
        c.name.trim() && c.slug.trim() && /^[A-Z]{2}$/.test(c.uf || "")
    );
    await onSave(valid);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Editar cidades adicionais de ${lawyerName}`}
      onClick={(e) => {
        if (e.target === e.currentTarget && !busy) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-cardHover p-5 md:p-6 max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-display text-lg font-bold text-brand-ink">
              Cidades adicionais de {lawyerName}
            </h3>
            <p className="text-xs text-brand-ink/65 mt-1">
              {cities.length} de 9 cidades. Cada cidade aparece nas buscas locais
              do estado correspondente.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="Fechar"
            className="w-8 h-8 rounded-full hover:bg-brand-line/40 flex items-center justify-center flex-shrink-0 disabled:opacity-50"
          >
            <X className="w-4 h-4 text-brand-ink/60" aria-hidden />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto -mx-2 px-2">
          {cities.length === 0 ? (
            <p className="text-sm text-brand-ink/55 italic text-center py-8">
              Nenhuma cidade adicional. Clique em &ldquo;Adicionar cidade&rdquo;
              para incluir.
            </p>
          ) : (
            <div className="space-y-3">
              {cities.map((c, idx) => (
                <div
                  key={`city-${idx}`}
                  className="rounded-xl border border-brand-line bg-brand-bg/40 p-3"
                >
                  <div className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-3">
                      <label className="text-[10px] font-semibold uppercase tracking-wide text-brand-ink/60">
                        UF
                      </label>
                      <select
                        className="input text-sm w-full"
                        value={c.uf}
                        onChange={(e) => updateCity(idx, { uf: e.target.value })}
                      >
                        {UFS.map((uf) => (
                          <option key={uf} value={uf}>
                            {uf}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-8">
                      <label className="text-[10px] font-semibold uppercase tracking-wide text-brand-ink/60">
                        Nome da cidade
                      </label>
                      <input
                        type="text"
                        className="input text-sm w-full"
                        placeholder="Ex.: Vitória da Conquista"
                        value={c.name}
                        onChange={(e) => updateCity(idx, { name: e.target.value })}
                      />
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeCity(idx)}
                        disabled={busy}
                        aria-label="Remover cidade"
                        title="Remover cidade"
                        className="w-8 h-8 rounded-lg hover:bg-red-50 text-red-600 flex items-center justify-center disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden />
                      </button>
                    </div>
                  </div>
                  {c.name && (
                    <p className="text-[10px] text-brand-ink/45 mt-1 font-mono">
                      slug: {c.slug || "(gerando...)"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-brand-line flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={addCity}
            disabled={busy || cities.length >= 9}
            className="btn-ghost border border-brand-line text-sm inline-flex items-center gap-2 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" aria-hidden />
            Adicionar cidade
          </button>
          <div className="flex-1" />
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="btn-ghost border border-brand-line text-sm"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={save}
            disabled={busy}
            className="btn-primary text-sm inline-flex items-center gap-2"
          >
            <Save className="w-4 h-4" aria-hidden />
            {busy ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
