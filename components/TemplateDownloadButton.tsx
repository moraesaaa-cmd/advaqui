"use client";

import { useState } from "react";
import { Copy, Download, Check } from "lucide-react";

/**
 * Botão de download de modelo em .txt e botão de copiar conteúdo.
 *
 * Tudo client-side: gera Blob no navegador e usa URL.createObjectURL.
 * Não precisa de endpoint nem rota — funciona em SSG perfeitamente.
 *
 * Captura opcional de e-mail: chama /api/leads/template via POST quando
 * o usuário fornece e-mail. Não bloqueia o download — só registra.
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

  const downloadTxt = () => {
    const header = `Modelo: ${title}\nFonte: AdvAqui (https://advaqui.com/modelos/${slug})\nData de download: ${new Date().toLocaleDateString("pt-BR")}\n\n` +
      "ATENÇÃO: este é um modelo genérico. Preencha os campos entre [colchetes].\nPara situações complexas ou valores altos, consulte um advogado.\n\n" +
      "=".repeat(70) + "\n\n";
    const blob = new Blob([header + content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback antigo
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
        onClick={downloadTxt}
        className="inline-flex items-center gap-2 btn-accent"
      >
        {downloaded ? (
          <>
            <Check className="w-4 h-4" aria-hidden />
            Baixado
          </>
        ) : (
          <>
            <Download className="w-4 h-4" aria-hidden />
            Baixar modelo (.txt)
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
