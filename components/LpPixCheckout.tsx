"use client";

import { useState } from "react";
import Link from "next/link";

type Props = {
  qr: string;
  payload: string;
  valor: string;
  chave: string;
  cadastroHref: string;
};

export function LpPixCheckout({ qr, payload, valor, chave, cadastroHref }: Props) {
  const [aberto, setAberto] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(payload);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      /* navegador sem permissão de clipboard — usuário copia manualmente */
    }
  };

  if (!aberto) {
    return (
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="inline-block w-full rounded-xl bg-amber-400 px-8 py-4 text-lg font-semibold text-slate-950 shadow-lg shadow-amber-400/20 transition hover:bg-amber-300 sm:w-auto"
      >
        Quero assinar agora →
      </button>
    );
  }

  return (
    <div className="mx-auto mt-2 max-w-md rounded-2xl border border-amber-400/30 bg-slate-900 p-6 text-center">
      <p className="text-base font-semibold text-amber-300">
        Pague {valor} via Pix para ativar
      </p>
      <p className="mt-1 text-xs text-slate-400">Pagamento único do mês · Sem fidelidade</p>

      <div className="mt-4 flex justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qr}
          alt="QR Code para pagamento via Pix"
          width={220}
          height={220}
          className="rounded-lg bg-white p-2"
        />
      </div>

      <p className="mt-4 text-xs font-medium text-slate-400">Ou use o Pix copia e cola:</p>
      <div className="mt-1 rounded-lg border border-slate-700 bg-slate-950 p-2">
        <code className="block max-h-24 overflow-auto break-all text-left text-xs text-slate-300">
          {payload}
        </code>
      </div>
      <button
        type="button"
        onClick={copiar}
        className="mt-2 w-full rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
      >
        {copiado ? "Copiado!" : "Copiar Pix copia e cola"}
      </button>
      <p className="mt-3 text-xs text-slate-500">Chave Pix: {chave}</p>

      <Link
        href={cadastroHref}
        className="mt-6 inline-block w-full rounded-xl bg-emerald-400 px-8 py-4 text-lg font-bold text-slate-950 shadow-lg shadow-emerald-400/20 transition hover:bg-emerald-300"
      >
        Já paguei → criar meu perfil
      </Link>
      <p className="mt-2 text-xs text-slate-500">
        Depois de pagar, clique acima para preencher seu cadastro. A ativação é confirmada em
        seguida.
      </p>
    </div>
  );
}
