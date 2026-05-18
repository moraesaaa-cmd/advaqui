"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Check, Clock, Copy } from "lucide-react";
import { PIX, PLAN } from "@/lib/config";
import { buildPixPayload } from "@/lib/pix/qrcode";
import { formatCurrency } from "@/lib/utils/format";

export function PixDisplay({ txid }: { txid?: string }) {
  const [qrUrl, setQrUrl] = useState<string>("");
  const [copied, setCopied] = useState<"key" | "payload" | null>(null);
  const payload = buildPixPayload({ txid });

  useEffect(() => {
    QRCode.toDataURL(payload, { width: 280, margin: 1 })
      .then(setQrUrl)
      .catch(() => setQrUrl(""));
  }, [payload]);

  const copy = (kind: "key" | "payload") => {
    const value = kind === "key" ? PIX.key : payload;
    navigator.clipboard?.writeText(value);
    setCopied(kind);
    setTimeout(() => setCopied(null), 2500);
  };

  return (
    <div className="rounded-2xl bg-white border border-brand-line p-6 shadow-card">
      <p className="text-sm font-semibold text-brand-ink mb-1">Pague com Pix</p>
      <p className="text-2xl font-bold text-brand-deep mb-4">
        {formatCurrency(PLAN.price)}
      </p>

      {qrUrl && (
        <div className="flex justify-center bg-brand-bg rounded-xl p-4 mb-4">
          <Image
            src={qrUrl}
            width={240}
            height={240}
            alt="QR Code Pix para pagamento"
            className="rounded-md"
            unoptimized
          />
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={() => copy("payload")}
          className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition ${
            copied === "payload"
              ? "bg-emerald-100 text-emerald-900"
              : "bg-brand-ink text-white hover:bg-brand-deep"
          }`}
        >
          {copied === "payload" ? (
            <><Check className="w-4 h-4" /> Pix copia e cola copiado</>
          ) : (
            <><Copy className="w-4 h-4" /> Copiar Pix copia e cola</>
          )}
        </button>

        <div className="text-xs text-brand-ink/60 text-center">
          ou copie apenas a chave Pix
        </div>

        <div className="rounded-xl border border-brand-line p-3 flex items-center gap-2">
          <code className="text-xs text-brand-ink/80 break-all flex-1">
            {PIX.key}
          </code>
          <button
            onClick={() => copy("key")}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              copied === "key"
                ? "bg-emerald-100 text-emerald-900"
                : "bg-brand-line text-brand-ink hover:bg-brand-line/70"
            }`}
            aria-label="Copiar chave Pix"
          >
            {copied === "key" ? "Copiado" : "Copiar"}
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 text-sm text-amber-900 bg-amber-50 rounded-xl p-3 border border-amber-200">
        <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden />
        <span>
          Após o pagamento, a ativação será feita em até{" "}
          <strong>{PLAN.activationHours} horas</strong>. Você receberá confirmação no painel.
        </span>
      </div>
    </div>
  );
}
