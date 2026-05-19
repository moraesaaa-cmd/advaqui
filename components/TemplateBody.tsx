import React from "react";

/**
 * Renderiza o conteúdo de um modelo (string com quebras) em formato bonito:
 *
 *   - títulos em caixa alta detectados como heading (font-display)
 *   - "CLÁUSULA Xª — TÍTULO." detectado como subtítulo
 *   - assinatura ("_____") tratada como linha decorativa
 *   - placeholders [CAMPO] destacados em amarelo (chip)
 *   - linhas em branco viram espaço
 *
 * Tudo em sans-serif (Inter), zerando o aspecto datilografado do <pre>.
 *
 * Não é client component — recebe a string e devolve JSX rico.
 */

const HEADING_RE = /^[A-ZÁÂÃÀÉÊÍÓÔÕÚÇ0-9\s,.()ª]+$/;
const CLAUSE_RE = /^CLÁUSULA\s+\d+ª/i;
const SIGNATURE_RE = /^_{3,}\s*$/;
const NUMBERED_LIST_RE = /^\s*(\d+|[a-z]|[A-Z])[\.)]\s+/;

/** Substitui [CAMPO] por <span class="placeholder">[CAMPO]</span>. */
function renderInline(text: string, lineKey: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\[([^\]]+)\]/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;
  let pIdx = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.slice(lastIdx, match.index));
    }
    parts.push(
      <span
        key={`${lineKey}-p${pIdx}`}
        className="inline-block px-1.5 py-0.5 mx-0.5 rounded-md bg-brand-accent/25 text-brand-deep font-semibold text-[0.92em] border border-brand-accent/40"
      >
        [{match[1]}]
      </span>
    );
    pIdx += 1;
    lastIdx = match.index + match[0].length;
  }
  if (lastIdx < text.length) {
    parts.push(text.slice(lastIdx));
  }
  return parts;
}

export function TemplateBody({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let consecutiveEmpty = 0;

  lines.forEach((rawLine, idx) => {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();
    const key = `tl-${idx}`;

    if (trimmed === "") {
      consecutiveEmpty += 1;
      if (consecutiveEmpty <= 2) {
        elements.push(<div key={key} className="h-3" aria-hidden />);
      }
      return;
    }
    consecutiveEmpty = 0;

    // Assinatura ("________") — linha decorativa centralizada
    if (SIGNATURE_RE.test(trimmed)) {
      elements.push(
        <div key={key} className="my-6 flex flex-col items-center">
          <div className="w-full max-w-xs border-b-2 border-brand-ink/30" />
        </div>
      );
      return;
    }

    // Cláusula ("CLÁUSULA 1ª — OBJETO.")
    if (CLAUSE_RE.test(trimmed)) {
      const parts = trimmed.split(/\s+—\s+|\s+-\s+/, 2);
      const left = parts[0];
      const right = parts[1] || "";
      elements.push(
        <h4
          key={key}
          className="font-display text-base md:text-lg font-bold text-brand-deep mt-6 mb-2"
        >
          <span className="inline-block px-2 py-0.5 rounded-md bg-brand-deep/10 text-brand-deep mr-2 text-sm">
            {left}
          </span>
          {right}
        </h4>
      );
      return;
    }

    // Heading do documento (linha curta em caixa alta — só primeiras ocorrências)
    if (
      trimmed.length <= 80 &&
      HEADING_RE.test(trimmed) &&
      trimmed === trimmed.toUpperCase() &&
      /[A-ZÁÉÍÓÚÇÃÕ]/.test(trimmed) &&
      idx < 8 // só nas primeiras linhas — depois "OUTORGANTE:" etc são tratados como label
    ) {
      elements.push(
        <h3
          key={key}
          className="font-display text-xl md:text-2xl font-bold text-brand-ink mt-2 mb-4 text-center tracking-wide"
        >
          {trimmed}
        </h3>
      );
      return;
    }

    // Label de parte (OUTORGANTE:, LOCADOR:, etc) — começa com palavra em caixa alta + ":"
    const labelMatch = /^([A-ZÁÉÍÓÚÇÃÕ][A-ZÁÉÍÓÚÇÃÕ0-9\s]+):\s*(.*)$/.exec(trimmed);
    if (labelMatch && labelMatch[1].length <= 40) {
      const label = labelMatch[1];
      const rest = labelMatch[2];
      elements.push(
        <p key={key} className="mb-3 text-brand-ink leading-relaxed">
          <strong className="text-brand-deep font-bold">{label}:</strong>{" "}
          {renderInline(rest, key)}
        </p>
      );
      return;
    }

    // Lista numerada (1., 2., a), I., etc) — recua e mantém numeração
    if (NUMBERED_LIST_RE.test(line)) {
      const match = line.match(/^(\s*)(\d+|[a-z]|[A-Z])([\.)])\s+(.*)$/);
      if (match) {
        const [, , marker, sep, text] = match;
        elements.push(
          <p key={key} className="mb-2 ml-6 text-brand-ink leading-relaxed">
            <strong className="text-brand-deep mr-2">
              {marker}
              {sep}
            </strong>
            {renderInline(text, key)}
          </p>
        );
        return;
      }
    }

    // Parágrafo normal
    elements.push(
      <p key={key} className="mb-3 text-brand-ink leading-relaxed">
        {renderInline(trimmed, key)}
      </p>
    );
  });

  return (
    <div className="font-sans text-[15px] md:text-base text-brand-ink/90 leading-relaxed">
      {elements}
    </div>
  );
}
