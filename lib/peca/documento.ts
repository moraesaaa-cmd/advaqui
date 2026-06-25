/**
 * Geração de documento jurídico com layout profissional (peças e modelos).
 *
 * Saída em HTML com estilos inline — o MESMO HTML serve para:
 *   - baixar como .doc (Word/Google Docs/LibreOffice abrem com a formatação);
 *   - imprimir / salvar em PDF pelo navegador.
 *
 * Padrão forense brasileiro: A4, margens 3cm (esq.) / 2cm (demais), corpo em
 * serifa (Times New Roman) 12pt justificado, recuo de primeira linha, títulos
 * de seção em caixa-alta/negrito. Substitui o "look datilografado" monoespaçado.
 */

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlightPlaceholders(html: string): string {
  // Destaca [CAMPO] em amarelo — útil em modelos para o usuário ver o que falta
  // preencher. Não usar em peças que vão direto pra protocolo.
  return html.replace(
    /\[([^\]]+)\]/g,
    `<span style="background-color:#FEF3C7;padding:0 3px;border-radius:3px;color:#92400E;font-weight:600;">[$1]</span>`
  );
}

const isSignature = (l: string) => /^_{3,}\s*$/.test(l.trim());
const isClause = (l: string) => /^CL[AÁ]USULA\s+\d+/i.test(l.trim());
// Seção numerada em romano: "I — DOS FATOS", "II - DO DIREITO", "III — DOS PEDIDOS".
const isRomanSection = (l: string) => /^[IVXLCDM]{1,6}\s*[—–-]\s*\S/.test(l.trim());

function isUpper(t: string): boolean {
  return t.length > 0 && /[A-ZÁÉÍÓÚÂÊÔÃÕÇ]/.test(t) && t === t.toUpperCase();
}
// Linha curta em caixa-alta (nome da peça/contrato): "RECLAMAÇÃO TRABALHISTA".
function isShortCaps(l: string): boolean {
  const t = l.trim();
  if (t.length === 0 || t.length > 70) return false;
  if (!isUpper(t)) return false;
  return /^[A-ZÁÂÃÀÉÊÍÓÔÕÚÜÇ0-9\s,.()ºª:/-]+$/.test(t);
}

export type LegalDocOptions = {
  /** Título do documento (vai no <title>, usado pelo Word). */
  title: string;
  /** Texto da peça (linhas separadas por \n). */
  content: string;
  /** Destacar [placeholders] em amarelo (true só para modelos a preencher). */
  highlight?: boolean;
  /** Linha discreta no topo (origem/data). */
  sourceLine?: string;
  /** Nota de rodapé discreta. */
  footerNote?: string;
};

function formatBody(content: string, highlight: boolean): string {
  const hl = (s: string) => (highlight ? highlightPlaceholders(escapeHtml(s)) : escapeHtml(s));
  const lines = content.split("\n");
  let body = "";
  let prevEmpty = false;
  let bodyStarted = false;

  for (const raw of lines) {
    const line = raw.trimEnd();
    const t = line.trim();

    if (t === "") {
      if (!prevEmpty) body += '<p style="margin:0;line-height:1.5;">&nbsp;</p>\n';
      prevEmpty = true;
      continue;
    }
    prevEmpty = false;

    if (isSignature(line)) {
      body += `<p style="text-align:center;margin:30pt 0 4pt;">${"_".repeat(45)}</p>\n`;
      continue;
    }
    if (isClause(line)) {
      body += `<p style="margin:14pt 0 4pt;font-weight:bold;">${hl(t)}</p>\n`;
      continue;
    }
    if (isRomanSection(line)) {
      bodyStarted = true;
      body += `<p style="margin:18pt 0 8pt;font-weight:bold;text-align:center;letter-spacing:.4pt;">${hl(t)}</p>\n`;
      continue;
    }
    // Primeira linha relevante em caixa-alta = endereçamento (à esquerda, negrito).
    if (!bodyStarted && isUpper(t)) {
      bodyStarted = true;
      body += `<p style="margin:0 0 12pt;font-weight:bold;text-align:justify;">${hl(t)}</p>\n`;
      continue;
    }
    // Título curto em caixa-alta (nome da peça/contrato): centralizado e maior.
    if (isShortCaps(line)) {
      bodyStarted = true;
      body += `<p style="margin:16pt 0;font-weight:bold;text-align:center;font-size:13pt;letter-spacing:.5pt;">${hl(t)}</p>\n`;
      continue;
    }
    // Parágrafo normal: justificado, recuo de primeira linha.
    bodyStarted = true;
    body += `<p style="margin:0 0 10pt;text-align:justify;text-indent:1.25cm;line-height:1.5;">${hl(t)}</p>\n`;
  }
  return body;
}

export function buildLegalDocHtml(opts: LegalDocOptions): string {
  const dateBr = new Date().toLocaleDateString("pt-BR");
  const body = formatBody(opts.content, opts.highlight ?? false);
  const sourceLine = opts.sourceLine ?? `Documento gerado em AdvAqui · ${dateBr}`;
  const footerNote =
    opts.footerNote ??
    "Revise os campos preenchidos antes de assinar. Documento de apoio — não substitui a orientação de um advogado.";

  return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<meta name="ProgId" content="Word.Document">
<meta name="Generator" content="AdvAqui">
<title>${escapeHtml(opts.title)}</title>
<style>
  @page { size: A4; margin: 3cm 2cm 2cm 3cm; }
  * { box-sizing: border-box; }
  body { font-family: "Times New Roman", Georgia, serif; font-size: 12pt; color: #111; line-height: 1.5; margin: 0; }
  p { orphans: 2; widows: 2; }
</style>
</head>
<body>
<div style="font-size:8.5pt;color:#9aa1ad;text-align:right;border-bottom:1px solid #e6e1d6;padding-bottom:5pt;margin-bottom:20pt;letter-spacing:.3pt;font-family:Arial,sans-serif;">${escapeHtml(sourceLine)}</div>
${body}
<div style="font-size:8.5pt;color:#9aa1ad;border-top:1px solid #e6e1d6;padding-top:8pt;margin-top:30pt;font-family:Arial,sans-serif;">${escapeHtml(footerNote)}</div>
</body>
</html>`;
}

/** Abre uma janela com o documento formatado e dispara a impressão (salvar PDF). */
export function printLegalDoc(opts: LegalDocOptions): void {
  const html = buildLegalDocHtml(opts);
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => {
    try {
      w.print();
    } catch {
      /* alguns navegadores bloqueiam print automático */
    }
  }, 350);
}

/** Baixa o documento como .doc (abre no Word/Docs/LibreOffice com a formatação). */
export function downloadLegalDoc(filename: string, opts: LegalDocOptions): void {
  const html = buildLegalDocHtml(opts);
  // BOM UTF-8 evita problemas de acentuação ao abrir no Word.
  const blob = new Blob(["﻿" + html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".doc") ? filename : `${filename}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
