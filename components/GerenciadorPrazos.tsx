"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarClock, Plus, Trash2, AlertTriangle } from "lucide-react";

/**
 * Gerenciador de prazos pessoal — roda 100% no navegador (localStorage).
 *
 * A pessoa cadastra compromissos com data de vencimento; a lista mostra
 * quantos dias faltam, com cor por proximidade (vencido/urgente/atenção/ok).
 * Nada é enviado a servidor — é uma agenda local, privada, sem cadastro.
 *
 * Não confunde com contagem de prazo processual (essa fica em
 * /calculadora-prazos, que considera dias úteis e feriados).
 */

type Prazo = { id: string; titulo: string; data: string };

const KEY = "advaqui_prazos_v1";

function diasRestantes(dataISO: string): number {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const alvo = new Date(dataISO + "T00:00:00");
  return Math.round((alvo.getTime() - hoje.getTime()) / 86400000);
}

function classe(dias: number): { cor: string; rotulo: string } {
  if (dias < 0) return { cor: "bg-rose-50 border-rose-300 text-rose-900", rotulo: `Vencido há ${Math.abs(dias)} dia(s)` };
  if (dias === 0) return { cor: "bg-rose-50 border-rose-300 text-rose-900", rotulo: "Vence hoje" };
  if (dias <= 3) return { cor: "bg-rose-50 border-rose-300 text-rose-900", rotulo: `Faltam ${dias} dia(s)` };
  if (dias <= 7) return { cor: "bg-amber-50 border-amber-300 text-amber-900", rotulo: `Faltam ${dias} dias` };
  if (dias <= 30) return { cor: "bg-yellow-50 border-yellow-300 text-yellow-900", rotulo: `Faltam ${dias} dias` };
  return { cor: "bg-emerald-50 border-emerald-300 text-emerald-900", rotulo: `Faltam ${dias} dias` };
}

export function GerenciadorPrazos() {
  const [prazos, setPrazos] = useState<Prazo[]>([]);
  const [titulo, setTitulo] = useState("");
  const [data, setData] = useState("");
  const [carregado, setCarregado] = useState(false);

  // Carrega do localStorage só no cliente.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setPrazos(
            parsed.filter(
              (x) =>
                x &&
                typeof x.id === "string" &&
                typeof x.titulo === "string" &&
                typeof x.data === "string"
            )
          );
        }
      }
    } catch {
      /* localStorage corrompido/indisponível — ignora */
    }
    setCarregado(true);
  }, []);

  // Persiste a cada mudança (depois de carregado, pra não sobrescrever com []).
  useEffect(() => {
    if (!carregado) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(prazos));
    } catch {
      /* ignora */
    }
  }, [prazos, carregado]);

  const adicionar = () => {
    if (!titulo.trim() || !data) return;
    const id = `${data}-${titulo}-${prazos.length}`;
    setPrazos((p) => [...p, { id, titulo: titulo.trim(), data }]);
    setTitulo("");
    setData("");
  };

  const remover = (id: string) =>
    setPrazos((p) => p.filter((x) => x.id !== id));

  const ordenados = [...prazos].sort((a, b) => a.data.localeCompare(b.data));

  const inp =
    "rounded-lg border-2 border-brand-line bg-white px-3 py-2 text-sm text-brand-ink focus:border-brand-accent focus:outline-none";

  return (
    <section
      className="card mb-6 border-2 border-brand-accent/40"
      aria-label="Gerenciador de prazos"
    >
      <h2 className="font-display text-xl font-bold text-brand-ink mb-1 inline-flex items-center gap-2">
        <CalendarClock className="w-5 h-5 text-brand-deep" aria-hidden />
        Seus prazos
      </h2>
      <p className="text-sm text-brand-ink/65 mb-4">
        Cadastre compromissos e datas-limite. A cor avisa o que está chegando.
        Tudo fica salvo só no seu navegador — privado, sem cadastro.
      </p>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          className={`${inp} flex-1`}
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ex.: Entregar contestação / pagar boleto / audiência"
          onKeyDown={(e) => {
            if (e.key === "Enter") adicionar();
          }}
        />
        <input
          className={inp}
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          aria-label="Data de vencimento"
        />
        <button
          onClick={adicionar}
          disabled={!titulo.trim() || !data}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-deep px-4 py-2 text-sm font-bold text-white hover:bg-brand-ink transition disabled:opacity-40"
        >
          <Plus className="w-4 h-4" aria-hidden />
          Adicionar
        </button>
      </div>

      {carregado && ordenados.length === 0 && (
        <p className="text-sm text-brand-ink/55 italic">
          Nenhum prazo cadastrado ainda. Adicione o primeiro acima.
        </p>
      )}

      <ul className="space-y-2">
        {ordenados.map((p) => {
          const dias = diasRestantes(p.data);
          const { cor, rotulo } = classe(dias);
          const dataBR = p.data.split("-").reverse().join("/");
          return (
            <li
              key={p.id}
              className={`flex items-center justify-between gap-3 rounded-xl border-2 p-3 ${cor}`}
            >
              <div className="min-w-0">
                <p className="font-semibold truncate">{p.titulo}</p>
                <p className="text-xs opacity-80">
                  {dataBR} — {rotulo}
                </p>
              </div>
              <button
                onClick={() => remover(p.id)}
                aria-label={`Remover ${p.titulo}`}
                className="flex-shrink-0 p-1.5 rounded-lg hover:bg-black/5 transition"
              >
                <Trash2 className="w-4 h-4 opacity-70" aria-hidden />
              </button>
            </li>
          );
        })}
      </ul>

      <aside
        role="note"
        className="mt-4 rounded-xl border-l-4 border-amber-400 bg-amber-50 p-3 text-xs text-amber-900 leading-relaxed flex items-start gap-2"
      >
        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden />
        <span>
          Esta é uma agenda pessoal de lembretes. Para prazo processual (em dias
          úteis, com feriados), use a{" "}
          <Link href="/calculadora-prazos" className="font-semibold underline">
            calculadora de prazos
          </Link>
          . Os dados ficam só neste navegador — se limpar o histórico, eles somem.
        </span>
      </aside>
    </section>
  );
}
