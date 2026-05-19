"use client";

import { useState } from "react";
import { Download, Check } from "lucide-react";

/**
 * Botão de download do checklist em .txt.
 * Conteúdo é gerado no servidor (buildChecklistTxt) e passado como prop.
 * Tudo client-side: gera Blob e usa URL.createObjectURL.
 */
export function ChecklistDownload({ content }: { content: string }) {
  const [done, setDone] = useState(false);

  const downloadTxt = () => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "checklist-presenca-digital-juridica.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDone(true);
    setTimeout(() => setDone(false), 2500);
  };

  return (
    <button
      type="button"
      onClick={downloadTxt}
      className="btn-accent inline-flex items-center gap-2"
    >
      {done ? (
        <>
          <Check className="w-4 h-4" aria-hidden />
          Baixado
        </>
      ) : (
        <>
          <Download className="w-4 h-4" aria-hidden />
          Baixar checklist (.txt)
        </>
      )}
    </button>
  );
}
