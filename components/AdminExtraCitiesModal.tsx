"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X, Plus, Trash2, Save, Search } from "lucide-react";

/**
 * Modal de edição de cidades adicionais (extra_cities) no painel admin.
 *
 * Versão Fase 5 — autocomplete baseado na API /api/cities (5.571 municípios
 * IBGE). Quando o admin digita 2+ chars, sugere cidades reais do estado
 * selecionado, com slug oficial. Evita slugs incorretos e cidades
 * inexistentes.
 *
 * Maio/2026 — AdvAqui.
 */

const UFS = [
  "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MS", "MT",
  "PA", "PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO"
];

export type ExtraCity = { name: string; slug: string; uf: string };

type CitySuggestion = {
  name: string;
  slug: string;
  uf: string;
  isCapital: boolean;
};

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
      cities.map((c, i) => (i === idx ? { ...c, ...patch } : c))
    );
  };

  const save = async () => {
    const valid = cities.filter(
      (c) =>
        c.name.trim() &&
        c.slug.trim() &&
        /^[A-Z]{2}$/.test(c.uf || "")
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
              {cities.length} de 9 cidades. Escolha UF e busque a cidade na
              base oficial do IBGE.
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
                <CityRow
                  key={`row-${idx}`}
                  city={c}
                  onChange={(patch) => updateCity(idx, patch)}
                  onRemove={() => removeCity(idx)}
                  busy={busy}
                />
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

/**
 * Linha individual de cidade com:
 *   • UF (select)
 *   • Nome (input com autocomplete via /api/cities?uf=XX&q=...)
 *   • Botão remover
 *
 * Quando o usuário escolhe uma sugestão, name e slug são preenchidos
 * automaticamente com os valores oficiais do IBGE.
 */
function CityRow({
  city,
  onChange,
  onRemove,
  busy
}: {
  city: ExtraCity;
  onChange: (patch: Partial<ExtraCity>) => void;
  onRemove: () => void;
  busy: boolean;
}) {
  const [query, setQuery] = useState(city.name);
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sincroniza query com city.name vindo do parent quando muda externamente
  // (ex: UF mudou, clear no save). Mas só se a query NÃO foi modificada pelo
  // usuário recentemente.
  useEffect(() => {
    setQuery(city.name);
  }, [city.name]);

  // Fecha dropdown ao clicar fora.
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Busca sugestões com debounce.
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (!city.uf || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/cities?uf=${encodeURIComponent(city.uf)}&q=${encodeURIComponent(
            query.trim()
          )}&limit=12`
        );
        if (res.ok) {
          const data = (await res.json()) as CitySuggestion[];
          setSuggestions(Array.isArray(data) ? data : []);
        }
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [query, city.uf]);

  const pickSuggestion = (s: CitySuggestion) => {
    onChange({ name: s.name, slug: s.slug, uf: s.uf });
    setQuery(s.name);
    setShowSuggestions(false);
  };

  const isValidSelection = useMemo(
    () =>
      Boolean(city.name) &&
      Boolean(city.slug) &&
      /^[A-Z]{2}$/.test(city.uf || ""),
    [city.name, city.slug, city.uf]
  );

  return (
    <div className="rounded-xl border border-brand-line bg-brand-bg/40 p-3">
      <div className="grid grid-cols-12 gap-2 items-start">
        <div className="col-span-3">
          <label className="text-[10px] font-semibold uppercase tracking-wide text-brand-ink/60">
            UF
          </label>
          <select
            className="input text-sm w-full"
            value={city.uf || ""}
            onChange={(e) => {
              // Ao mudar UF, limpa cidade pra evitar combinação inválida
              onChange({ uf: e.target.value, name: "", slug: "" });
              setQuery("");
            }}
            disabled={busy}
          >
            {UFS.map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-8 relative" ref={wrapperRef}>
          <label className="text-[10px] font-semibold uppercase tracking-wide text-brand-ink/60">
            Cidade
          </label>
          <div className="relative">
            <input
              type="text"
              className="input text-sm w-full pr-8"
              placeholder={`Digite o nome (mín. 2 letras)`}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
                // Limpa slug enquanto o user digita — só revalida ao escolher
                onChange({ name: e.target.value, slug: "" });
              }}
              onFocus={() => setShowSuggestions(true)}
              disabled={busy}
              autoComplete="off"
            />
            <Search
              className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-ink/40 pointer-events-none"
              aria-hidden
            />
          </div>
          {showSuggestions && query.length >= 2 && (
            <div className="absolute z-10 top-full mt-1 left-0 right-0 bg-white border border-brand-line rounded-lg shadow-lg max-h-56 overflow-y-auto">
              {loading && (
                <p className="text-xs text-brand-ink/55 italic p-3">
                  Buscando...
                </p>
              )}
              {!loading && suggestions.length === 0 && (
                <p className="text-xs text-brand-ink/55 italic p-3">
                  Nenhuma cidade encontrada em {city.uf}.
                </p>
              )}
              {!loading &&
                suggestions.map((s) => (
                  <button
                    key={`${s.uf}-${s.slug}`}
                    type="button"
                    onClick={() => pickSuggestion(s)}
                    className="w-full text-left px-3 py-2 hover:bg-brand-bg text-sm border-b border-brand-line/60 last:border-0 flex items-center justify-between gap-2"
                  >
                    <span className="text-brand-ink">
                      {s.name}
                      {s.isCapital && (
                        <span className="ml-2 text-[10px] text-brand-deep font-bold">
                          capital
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] font-mono text-brand-ink/55">
                      {s.uf}
                    </span>
                  </button>
                ))}
            </div>
          )}
          {city.slug && (
            <p className="text-[10px] text-brand-ink/45 mt-1 font-mono">
              slug: {city.slug}
            </p>
          )}
          {!isValidSelection && query.length >= 2 && !showSuggestions && (
            <p className="text-[10px] text-amber-700 mt-1">
              Selecione uma cidade da lista pra registrar.
            </p>
          )}
        </div>
        <div className="col-span-1 flex justify-end pt-5">
          <button
            type="button"
            onClick={onRemove}
            disabled={busy}
            aria-label="Remover cidade"
            title="Remover cidade"
            className="w-8 h-8 rounded-lg hover:bg-red-50 text-red-600 flex items-center justify-center disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
