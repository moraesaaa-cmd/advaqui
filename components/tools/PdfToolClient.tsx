"use client";

import { useMemo, useRef, useState } from "react";
import {
  UploadCloud,
  FileText,
  X,
  ArrowUp,
  ArrowDown,
  Download,
  Copy,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { QuickSignupModal } from "@/components/tools/QuickSignupModal";

type ToolOption = {
  name: string;
  label: string;
  type: "select" | "text" | "password" | "number";
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  help?: string;
  default?: string;
};

export type PdfToolClientProps = {
  slug: string;
  nome: string;
  ctaLabel: string;
  aceita: string[];
  multiplos: boolean;
  minArquivos?: number;
  resultado: "arquivo" | "texto";
  opcoes?: ToolOption[];
};

type Status = "idle" | "working" | "done";

const fmtSize = (n: number) =>
  n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(n / 1024)} KB`;

export function PdfToolClient(tool: PdfToolClientProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [options, setOptions] = useState<Record<string, string>>(() => {
    const o: Record<string, string> = {};
    for (const opt of tool.opcoes || []) if (opt.default) o[opt.name] = opt.default;
    return o;
  });
  const [status, setStatus] = useState<Status>("idle");
  const [erro, setErro] = useState("");
  const [drag, setDrag] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fileOut, setFileOut] = useState<{ url: string; name: string } | null>(null);
  const [textOut, setTextOut] = useState<{
    text: string;
    downloadUrl?: string;
    downloadName?: string;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const accept = useMemo(() => tool.aceita.join(","), [tool.aceita]);

  const addFiles = (list: FileList | File[]) => {
    setErro("");
    const incoming = Array.from(list).filter((f) =>
      tool.aceita.includes(`.${(f.name.split(".").pop() || "").toLowerCase()}`)
    );
    if (!incoming.length) {
      setErro(`Formato não aceito. Esta ferramenta trabalha com: ${tool.aceita.join(", ")}`);
      return;
    }
    setFiles((prev) => (tool.multiplos ? [...prev, ...incoming].slice(0, 20) : [incoming[0]]));
  };

  const move = (i: number, dir: -1 | 1) => {
    setFiles((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const reset = () => {
    setStatus("idle");
    setFileOut(null);
    setTextOut(null);
    setFiles([]);
    setErro("");
  };

  const processar = async () => {
    setErro("");
    const min = tool.minArquivos || 1;
    if (files.length < min) {
      setErro(min > 1 ? `Envie pelo menos ${min} arquivos.` : "Envie um arquivo para começar.");
      return;
    }
    for (const opt of tool.opcoes || []) {
      if (opt.required && !(options[opt.name] || "").trim()) {
        setErro(`Preencha o campo "${opt.label}".`);
        return;
      }
    }
    setStatus("working");
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append("files", f));
      fd.append("options", JSON.stringify(options));
      const res = await fetch(`/api/tools/pdf/${tool.slug}`, { method: "POST", body: fd });

      if (res.status === 401) {
        setStatus("idle");
        setShowSignup(true);
        return;
      }
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setStatus("idle");
        setErro(data?.error || "Não foi possível processar. Tente novamente.");
        return;
      }

      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const data = (await res.json()) as {
          text: string;
          downloadName?: string;
          downloadBase64?: string;
          downloadMime?: string;
        };
        let downloadUrl: string | undefined;
        if (data.downloadBase64 && data.downloadMime) {
          const bin = atob(data.downloadBase64);
          const arr = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
          downloadUrl = URL.createObjectURL(new Blob([arr], { type: data.downloadMime }));
        }
        setTextOut({ text: data.text, downloadUrl, downloadName: data.downloadName });
      } else {
        const blob = await res.blob();
        const dispo = res.headers.get("content-disposition") || "";
        const star = /filename\*=UTF-8''([^;]+)/.exec(dispo);
        const plain = /filename="([^"]+)"/.exec(dispo);
        const name = star ? decodeURIComponent(star[1]) : plain ? plain[1] : "resultado.pdf";
        setFileOut({ url: URL.createObjectURL(blob), name });
      }
      setStatus("done");
    } catch {
      setStatus("idle");
      setErro("Falha de conexão. Verifique sua internet e tente de novo.");
    }
  };

  const baixarTxt = () => {
    if (!textOut) return;
    const url = URL.createObjectURL(new Blob([textOut.text], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tool.slug}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copiar = async () => {
    if (!textOut) return;
    try {
      await navigator.clipboard.writeText(textOut.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard indisponível */
    }
  };

  // ------------------------------------------------------------------ UI

  if (status === "done" && (fileOut || textOut)) {
    return (
      <div className="rounded-2xl border border-brand-line bg-white p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-8 w-8 shrink-0 text-emerald-600" aria-hidden />
          <div>
            <h2 className="font-display text-xl font-semibold text-brand-ink">Pronto!</h2>
            <p className="text-sm text-brand-ink/70">
              {fileOut ? "Seu arquivo foi processado com sucesso." : "Resultado gerado com sucesso."}
            </p>
          </div>
        </div>

        {fileOut && (
          <a
            href={fileOut.url}
            download={fileOut.name}
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-brand-accent px-5 py-3 font-semibold text-brand-ink transition hover:bg-brand-accent2"
          >
            <Download className="h-5 w-5" aria-hidden />
            Baixar {fileOut.name}
          </a>
        )}

        {textOut && (
          <>
            <div className="mt-5 max-h-96 overflow-y-auto whitespace-pre-wrap rounded-md border border-brand-line bg-brand-bg p-4 text-sm leading-relaxed text-brand-ink">
              {textOut.text}
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={copiar}
                className="inline-flex items-center gap-2 rounded-md border border-brand-line px-4 py-2 text-sm font-medium text-brand-ink hover:bg-brand-bg"
              >
                <Copy className="h-4 w-4" aria-hidden />
                {copied ? "Copiado!" : "Copiar texto"}
              </button>
              <button
                type="button"
                onClick={baixarTxt}
                className="inline-flex items-center gap-2 rounded-md border border-brand-line px-4 py-2 text-sm font-medium text-brand-ink hover:bg-brand-bg"
              >
                <Download className="h-4 w-4" aria-hidden />
                Baixar .txt
              </button>
              {textOut.downloadUrl && (
                <a
                  href={textOut.downloadUrl}
                  download={textOut.downloadName || "documento.pdf"}
                  className="inline-flex items-center gap-2 rounded-md bg-brand-accent px-4 py-2 text-sm font-semibold text-brand-ink hover:bg-brand-accent2"
                >
                  <Download className="h-4 w-4" aria-hidden />
                  Baixar PDF
                </a>
              )}
            </div>
          </>
        )}

        <button
          type="button"
          onClick={reset}
          className="mt-6 block text-sm font-medium text-brand-deep underline-offset-2 hover:underline"
        >
          Processar outro arquivo
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-brand-line bg-white p-6 sm:p-8">
      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          addFiles(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${
          drag ? "border-brand-accent bg-brand-accent/10" : "border-brand-line bg-brand-bg hover:border-brand-accent/60"
        }`}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        aria-label="Selecionar arquivos"
      >
        <UploadCloud className="h-10 w-10 text-brand-deep" aria-hidden />
        <p className="mt-3 font-medium text-brand-ink">
          {tool.multiplos ? "Arraste os arquivos aqui ou clique para escolher" : "Arraste o arquivo aqui ou clique para escolher"}
        </p>
        <p className="mt-1 text-sm text-brand-ink/60">
          Formatos: {tool.aceita.join(", ")} · até 25 MB {tool.multiplos ? "· até 20 arquivos" : ""}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={tool.multiplos}
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {/* Lista de arquivos */}
      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="flex items-center gap-3 rounded-md border border-brand-line bg-white px-3 py-2"
            >
              <FileText className="h-5 w-5 shrink-0 text-brand-deep" aria-hidden />
              <span className="min-w-0 flex-1 truncate text-sm text-brand-ink">{f.name}</span>
              <span className="shrink-0 text-xs text-brand-ink/50">{fmtSize(f.size)}</span>
              {tool.multiplos && files.length > 1 && (
                <span className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    aria-label="Mover para cima"
                    className="rounded p-1 text-brand-ink/50 hover:bg-brand-bg hover:text-brand-ink"
                  >
                    <ArrowUp className="h-4 w-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    aria-label="Mover para baixo"
                    className="rounded p-1 text-brand-ink/50 hover:bg-brand-bg hover:text-brand-ink"
                  >
                    <ArrowDown className="h-4 w-4" aria-hidden />
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                aria-label={`Remover ${f.name}`}
                className="shrink-0 rounded p-1 text-brand-ink/50 hover:bg-brand-bg hover:text-red-700"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Opções */}
      {(tool.opcoes || []).length > 0 && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {(tool.opcoes || []).map((opt) => (
            <label key={opt.name} className="block">
              <span className="mb-1 block text-sm font-medium text-brand-ink">{opt.label}</span>
              {opt.type === "select" ? (
                <select
                  className="input w-full"
                  value={options[opt.name] ?? opt.default ?? ""}
                  onChange={(e) => setOptions((o) => ({ ...o, [opt.name]: e.target.value }))}
                >
                  {(opt.options || []).map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className="input w-full"
                  type={opt.type === "number" ? "number" : opt.type}
                  placeholder={opt.placeholder}
                  value={options[opt.name] ?? ""}
                  onChange={(e) => setOptions((o) => ({ ...o, [opt.name]: e.target.value }))}
                />
              )}
              {opt.help && <span className="mt-1 block text-xs text-brand-ink/60">{opt.help}</span>}
            </label>
          ))}
        </div>
      )}

      {erro && <p className="mt-4 text-sm font-medium text-red-700">{erro}</p>}

      <button
        type="button"
        onClick={processar}
        disabled={status === "working"}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand-accent px-6 py-3 text-base font-semibold text-brand-ink transition hover:bg-brand-accent2 disabled:opacity-60 sm:w-auto"
      >
        {status === "working" ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            Processando...
          </>
        ) : (
          tool.ctaLabel
        )}
      </button>
      <p className="mt-3 text-xs text-brand-ink/50">
        Arquivos processados com segurança e apagados automaticamente. Uso gratuito com conta.
      </p>

      {showSignup && (
        <QuickSignupModal
          ferramenta={tool.slug}
          onClose={() => setShowSignup(false)}
          onSuccess={() => {
            setShowSignup(false);
            void processar();
          }}
        />
      )}
    </div>
  );
}
