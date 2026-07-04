"use client";

import { useState } from "react";
import { Copy, Check, FileText } from "lucide-react";
import { downloadLegalDoc } from "@/lib/peca/documento";
import { useDownloadGate } from "@/components/tools/useDownloadGate";

/**
 * Botão de download de modelo. Oferece DOIS formatos:
 *
 *   1) "Baixar para Word (.doc)" — gera arquivo (HTML com extensão .doc) que o
 *      Microsoft Word, Google Docs e LibreOffice abrem com a formatação
 *      profissional preservada (margens A4 forenses, serifa 12pt, títulos,
 *      placeholders destacados). Layout vem de lib/peca/documento.
 *
 *   2) "Copiar texto" — copia o texto puro para o clipboard.
 */
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
  // Download e cópia exigem conta grátis (lead) — a página segue indexável.
  const { guard, modal } = useDownloadGate(`modelo-${slug}`);

  const downloadWord = () => {
    downloadLegalDoc(slug, {
      title,
      content,
      highlight: true,
      sourceLine: `Modelo gerado em AdvAqui · advaqui.com/modelos/${slug} · ${new Date().toLocaleDateString("pt-BR")}`,
      footerNote:
        "Antes de assinar, revise os campos entre colchetes. Para casos complexos, consulte um advogado."
    });
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
        onClick={() => guard(downloadWord)}
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
        onClick={() => guard(() => void copyToClipboard())}
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
      {modal}
    </div>
  );
}
