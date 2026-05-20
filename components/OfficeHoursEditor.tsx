"use client";

import { useEffect, useState } from "react";

/**
 * Editor de horários de atendimento por dia da semana.
 *
 * O backend armazena `office_hours` como texto livre (text), pra manter
 * compatibilidade com cadastros antigos. Este componente serializa 7 dias
 * em uma única string formatada e parseia de volta quando recebe a string.
 *
 * Formato textual (uma linha por dia):
 *   "Segunda-feira: 09:00 – 18:00\nTerça-feira: 09:00 – 18:00\n..."
 *
 * Cada dia tem: abre (HH:MM) + fecha (HH:MM) ou está "Fechado".
 * Se TODOS os 7 dias estiverem "Fechado", retorna string vazia.
 */

type Day = {
  label: string;
  short: string;
  open: string;
  close: string;
  closed: boolean;
};

const DEFAULT_DAYS: ReadonlyArray<{ label: string; short: string; weekend?: boolean }> = [
  { label: "Segunda-feira", short: "Seg" },
  { label: "Terça-feira", short: "Ter" },
  { label: "Quarta-feira", short: "Qua" },
  { label: "Quinta-feira", short: "Qui" },
  { label: "Sexta-feira", short: "Sex" },
  { label: "Sábado", short: "Sáb", weekend: true },
  { label: "Domingo", short: "Dom", weekend: true }
];

function parseValue(raw: string | null | undefined): Day[] {
  // Defaults: dias úteis 09-18, fim de semana fechado.
  const defaults: Day[] = DEFAULT_DAYS.map((d) => ({
    label: d.label,
    short: d.short,
    open: d.weekend ? "" : "09:00",
    close: d.weekend ? "" : "18:00",
    closed: !!d.weekend
  }));

  if (!raw) return defaults;

  // Parse de tentativa: cada linha "Label: HH:MM – HH:MM" ou "Label: Fechado"
  const lines = raw.split(/\n/);
  for (const line of lines) {
    const m = line.match(/^([^:]+):\s*(.*)$/);
    if (!m) continue;
    const labelRaw = m[1].trim();
    const value = m[2].trim();
    const idx = defaults.findIndex(
      (d) => d.label.toLowerCase() === labelRaw.toLowerCase()
    );
    if (idx === -1) continue;
    if (/fechado/i.test(value)) {
      defaults[idx].closed = true;
      defaults[idx].open = "";
      defaults[idx].close = "";
    } else {
      const range = value.match(/(\d{1,2}:\d{2})\s*[–\-—]\s*(\d{1,2}:\d{2})/);
      if (range) {
        defaults[idx].closed = false;
        defaults[idx].open = range[1].padStart(5, "0");
        defaults[idx].close = range[2].padStart(5, "0");
      }
    }
  }
  return defaults;
}

function serializeValue(days: Day[]): string {
  const allClosed = days.every((d) => d.closed);
  if (allClosed) return "";
  return days
    .map((d) =>
      d.closed ? `${d.label}: Fechado` : `${d.label}: ${d.open} – ${d.close}`
    )
    .join("\n");
}

export function OfficeHoursEditor({
  value,
  onChange
}: {
  value: string | null | undefined;
  onChange: (next: string) => void;
}) {
  const [days, setDays] = useState<Day[]>(() => parseValue(value));

  // Sincroniza quando o valor externo muda (ex: reset do form).
  useEffect(() => {
    setDays(parseValue(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const updateDay = (i: number, patch: Partial<Day>) => {
    const next = days.map((d, idx) => (idx === i ? { ...d, ...patch } : d));
    setDays(next);
    onChange(serializeValue(next));
  };

  return (
    <div className="rounded-xl border border-brand-line bg-white">
      <div className="px-4 py-3 border-b border-brand-line bg-brand-bg/40">
        <p className="text-sm font-semibold text-brand-ink">
          Horários de atendimento
        </p>
        <p className="text-xs text-brand-ink/60 mt-0.5">
          Marque os dias que você atende e os horários. Dias marcados como
          fechado aparecem no perfil público.
        </p>
      </div>
      <ul className="divide-y divide-brand-line">
        {days.map((d, i) => (
          <li
            key={d.label}
            className="flex flex-wrap items-center gap-3 px-4 py-2.5"
          >
            <span className="w-28 text-sm font-medium text-brand-ink">
              {d.label}
            </span>
            <div className="flex items-center gap-2 text-sm flex-1">
              {d.closed ? (
                <span className="text-brand-ink/50 italic">Fechado</span>
              ) : (
                <>
                  <input
                    type="time"
                    aria-label={`Abre - ${d.label}`}
                    value={d.open}
                    onChange={(e) => updateDay(i, { open: e.target.value })}
                    className="px-2 py-1.5 rounded-md border border-brand-line text-sm bg-white"
                  />
                  <span className="text-brand-ink/50">às</span>
                  <input
                    type="time"
                    aria-label={`Fecha - ${d.label}`}
                    value={d.close}
                    onChange={(e) => updateDay(i, { close: e.target.value })}
                    className="px-2 py-1.5 rounded-md border border-brand-line text-sm bg-white"
                  />
                </>
              )}
            </div>
            <label className="inline-flex items-center gap-1.5 text-xs text-brand-ink/70 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={d.closed}
                onChange={(e) =>
                  updateDay(i, {
                    closed: e.target.checked,
                    open: e.target.checked ? "" : "09:00",
                    close: e.target.checked ? "" : "18:00"
                  })
                }
                className="w-4 h-4"
              />
              Fechado
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
