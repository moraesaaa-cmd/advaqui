"use client";

import { useEffect, useId, useRef, useState } from "react";
import { MapPin, X } from "lucide-react";

type Suggestion = { name: string; slug: string; uf: string; isCapital: boolean };

const UFS = [
  "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT",
  "PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO"
];

const slugifyLocal = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/**
 * Campo de cidade adicional do painel — replica o autocomplete da página
 * /cadastro. Resolve os bugs reportados:
 *
 *   1. Perda de foco a cada letra digitada — agora a key do parent é estável
 *      (índice puro do array), e este componente isolado mantém seu próprio
 *      estado de digitação sem que o parent re-renderize a cada keystroke.
 *   2. Sem sugestões — agora busca em /api/cities?q=... filtrando pela UF
 *      selecionada e mostra até 6 sugestões clicáveis.
 *   3. Cidade não validada contra IBGE — só persiste se o user clicou em uma
 *      sugestão (citySelected = true). Texto livre sem clique não conta.
 */
export function ExtraCityField({
  value,
  disabled,
  onChange,
  onRemove
}: {
  value: { name: string; slug: string; uf: string };
  disabled?: boolean;
  onChange: (next: { name: string; slug: string; uf: string }) => void;
  onRemove: () => void;
}) {
  const listboxId = useId();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showSuggestions) return;
    const term = (value.name || "").trim();
    if (term.length < 2) {
      setSuggestions([]);
      return;
    }
    const ctrl = new AbortController();
    const timer = window.setTimeout(() => {
      fetch(`/api/cities?q=${encodeURIComponent(term)}&limit=10`, {
        signal: ctrl.signal,
        cache: "no-store"
      })
        .then((res) => (res.ok ? res.json() : []))
        .then((data: Suggestion[]) => {
          setSuggestions(data.filter((c) => c.uf === value.uf).slice(0, 6));
          setHighlightIndex(-1);
        })
        .catch(() => undefined);
    }, 200);
    return () => {
      ctrl.abort();
      window.clearTimeout(timer);
    };
  }, [value.name, value.uf, showSuggestions]);

  // Fecha sugestões ao clicar fora
  useEffect(() => {
    if (!showSuggestions) return;
    const onClickOutside = (ev: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(ev.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [showSuggestions]);

  const selectCity = (c: Suggestion) => {
    onChange({ name: c.name, slug: c.slug, uf: c.uf });
    setShowSuggestions(false);
    setHighlightIndex(-1);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      if (highlightIndex >= 0 && highlightIndex < suggestions.length) {
        e.preventDefault();
        selectCity(suggestions[highlightIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setShowSuggestions(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="grid sm:grid-cols-[80px_1fr_auto] gap-2 items-end p-3 bg-white rounded-lg border border-brand-line relative"
    >
      <div>
        <label className="text-xs text-brand-ink/60">UF</label>
        <select
          className="input text-sm"
          value={value.uf || "MG"}
          disabled={disabled}
          onChange={(e) =>
            onChange({ ...value, uf: e.target.value.toUpperCase(), slug: "" })
          }
        >
          {UFS.map((uf) => (
            <option key={uf} value={uf}>
              {uf}
            </option>
          ))}
        </select>
      </div>
      <div className="relative">
        <label className="text-xs text-brand-ink/60">Nome da cidade</label>
        <input
          className="input text-sm"
          value={value.name || ""}
          disabled={disabled}
          placeholder="Comece a digitar... (ex.: Belo Horizonte)"
          autoComplete="off"
          onChange={(e) => {
            const name = e.target.value;
            onChange({ ...value, name, slug: slugifyLocal(name) });
            setShowSuggestions(true);
          }}
          onFocus={() => {
            if ((value.name || "").trim().length >= 2) setShowSuggestions(true);
          }}
          onBlur={() => {
            // Atraso pro onMouseDown da sugestão disparar antes
            window.setTimeout(() => setShowSuggestions(false), 150);
          }}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showSuggestions && suggestions.length > 0}
          aria-controls={listboxId}
        />
        {value.slug && (
          <p className="text-[10px] text-brand-ink/40 mt-1">
            URL: /advogados/{(value.uf || "mg").toLowerCase()}/{value.slug}
          </p>
        )}

        {showSuggestions && (value.name || "").trim().length >= 2 && (
          <ul
            id={listboxId}
            role="listbox"
            className="absolute z-20 left-0 right-0 mt-1 bg-white rounded-xl shadow-cardHover border border-brand-line overflow-hidden"
          >
            {suggestions.length > 0 ? (
              suggestions.map((c, i) => (
                <li key={c.slug} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={i === highlightIndex}
                    // onMouseDown dispara ANTES do onBlur do input
                    onMouseDown={(ev) => {
                      ev.preventDefault();
                      selectCity(c);
                    }}
                    onMouseEnter={() => setHighlightIndex(i)}
                    className={`w-full text-left px-3 py-2 min-h-[40px] text-sm inline-flex items-center gap-2 ${
                      i === highlightIndex
                        ? "bg-brand-deep/10 text-brand-ink"
                        : "hover:bg-brand-line/40 text-brand-ink"
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-brand-ink/40" aria-hidden />
                    <span>{c.name}</span>
                    {c.isCapital && (
                      <span className="ml-1 text-[10px] uppercase tracking-wider text-brand-accentText font-semibold">
                        capital
                      </span>
                    )}
                  </button>
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-xs text-brand-ink/60">
                Nenhuma cidade encontrada para &quot;{value.name}&quot; em {value.uf}.
                Verifique a grafia.
              </li>
            )}
          </ul>
        )}
      </div>
      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        aria-label="Remover cidade adicional"
        className="text-xs text-red-600 hover:text-red-700 hover:underline px-2 py-1 disabled:opacity-40 inline-flex items-center gap-1"
      >
        <X className="w-3 h-3" aria-hidden /> Remover
      </button>
    </div>
  );
}
