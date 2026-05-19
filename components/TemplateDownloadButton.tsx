"use client";

import { useState } from "react";
import { Copy, Check, FileText } from "lucide-react";

/**
 * Botão de download de modelo. Oferece DOIS formatos:
 *
 *   1) "Baixar para Word (.doc)" — gera arquivo HTML com extensão .doc, que
 *      o Microsoft Word, Google Docs e LibreOffice abrem com formatação
 *      preservada (parágrafos, títulos, negrito, espaçamento). É a forma
 *      mais simples de entregar algo "editável" sem incluir libs pesadas
 *      como docx.js. Apesar da extensão .doc, é HTML compatível.
 *
 *   2) "Copiar texto" — copia o texto puro para o clipboard.
 *
 * Renderiza igual ao TemplateBody — placeholders [CAMPO] em amarelo,
 * cláusulas em negrito, assinaturas como linha. Sai do "look datilografado".
 */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function highlightPlaceholders(html: string): string {
  // Aplica span de destaque AMARELO aos placeholders [CAMPO].
  // O Word lê o style inline.
  return html.replace(
    /\[([^\]]+)\]/g,
    `<span style="background-color:#FEF3C7;padding:1px 4px;border-radius:3px;color:#92400E;font-weight:600;">[$1]</span>`
  );
}

function isClauseHeading(line: string): boolean {
  return /^CL[AÁ]USULA\s+\d+ª/i.test(line.trim());
}

function isAllCapsHeading(line: string, idx: number): boolean {
  const t = line.trim();
  if (idx >= 8) return false;
  if (t.length === 0 || t.length > 80) return false;
  if (!/[A-ZÁÉÍÓÚÇÃÕ]/.test(t)) return false;
  if (t !== t.toUpperCase()) return false;
  if (!/^[A-ZÁÂÃÀÉÊÍÓÔÕÚÇ0-9\s,.()ª]+$/.test(t)) return false;
  return true;
}

function isSignatureLine(line: string): boolean {
  return /^_{3,}\s*$/.test(line.trim());
}

function buildDocHtml(title: string, slug: string, content: string): string {
  const dateBr = new Date().toLocaleDateString("pt-BR");

  // Constrói o corpo do documento parágrafo por parágrafo, com estilo inline
  // (sem CSS externo — Word ignora <link rel="stylesheet">).
  const lines = content.split("\n");
  let body = "";
  let prevEmpty = false;
  lines.forEach((rawLine, idx) => {
    const line = rawLine.trimEnd();
    if (line.trim() === "") {
      if (!prevEmpty) {
        body += '<p style="margin:6pt 0;line-height:1;">&nbsp;</p>\n';
      }
      prevEmpty = true;
      return;
    }
    prevEmpty = false;

    if (isSignatureLine(line)) {
      body += `<p style="text-align:center;margin:24pt 0 6pt 0;">${"_".repeat(40)}</p>\n`;
      return;
    }

    if (isAllCapsHeading(line, idx)) {
      body += `<h1 style="font-size:14pt;text-align:center;letter-spacing:1px;margin:0 0 18pt 0;font-family:Calibri,Arial,sans-serif;">${highlightPlaceholders(escapeHtml(line.trim()))}</h1>\n`;
      return;
    }

    if (isClauseHeading(line)) {
      body += `<p style="margin:12pt 0 4pt 0;font-weight:bold;color:#1B3A5C;font-family:Calibri,Arial,sans-serif;">${highlightPlaceholders(escapeHtml(line.trim()))}</p>\n`;
      return;
    }

    body += `<p style="text-align:justify;margin:6pt 0;line-height:1.5;font-family:Calibri,Arial,sans-serif;font-size:11pt;">${highlightPlaceholders(escapeHtml(line.trim()))}</p>\n`;
  });

  return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<meta name="ProgId" content="Word.Document">
<meta name="Generator" content="AdvAqui">
<title>${escapeHtml(title)}</title>
<style>
  @page { size: A4; margin: 2.5cm; }
  body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #0F1B2D; line-height: 1.5; }
</style>
</head>
<body>
<p style="font-size:9pt;color:#666;text-align:right;margin:0 0 18pt 0;">Modelo gerado em AdvAqui (advaqui.com.br/modelos/${escapeHtml(slug)}) — ${dateBr}</p>
${body}
<p style="font-size:9pt;color:#666;border-top:1px solid #ccc;padding-top:12pt;margin-top:24pt;">Antes de assinar, revise os campos preenchidos. Para casos complexos, consulte um advogado.</p>
</body>
</html>`;
}

export function TemplateDownloadButton({
  slug,
  title,
  content
}: {
  slug: string;
  title: string;
  content: string;
}) {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const downloadWord = () => {
    const html = buildDocHtml(title, slug, content);
    // O MIME 'application/msword' + extensão '.doc' faz o navegador entregar
    // pro Word/Google Docs/Libre. O conteúdo HTML é interpretado sem perder
    // negrito, cor de fundo e estrutura.
    const blob = new Blob(["﻿" + html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement("textarea");
      el.value = content;
      document.body.appendChild(el);
      el.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } finally {
        document.body.removeChild(el);
      }
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={downloadWord}
        className="inline-flex items-center gap-2 btn-accent"
      >
        {downloaded ? (
          <>
            <Check className="w-4 h-4" aria-hidden />
            Baixado
          </>
        ) : (
          <>
            <FileText className="w-4 h-4" aria-hidden />
            Baixar para Word (.doc)
          </>
        )}
      </button>
      <button
        type="button"
        onClick={copyToClipboard}
        className="inline-flex items-center gap-2 btn-ghost"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" aria-hidden />
            Copiado
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" aria-hidden />
            Copiar texto
          </>
        )}
      </button>
    </div>
  );
}
