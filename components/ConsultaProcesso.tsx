"use client";

import { useState } from "react";
import {
  Search,
  Loader2,
  FileText,
  Clock,
  AlertTriangle,
  Building2
} from "lucide-react";

/**
 * Consulta de processo por número CNJ via /api/consulta-processo (DataJud).
 * Mostra metadados públicos e a linha de movimentações. Client-side.
 */

type Movimento = { data: string | null; nome: string; codigo?: number };
type Processo = {
  numero: string;
  tribunal: string;
  classe: string | null;
  assuntos: string[];
  orgaoJulgador: string | null;
  grau: string | null;
  dataAjuizamento: string | null;
  ultimaAtualizacao: string | null;
  movimentos: Movimento[];
};

function dataBR(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function ConsultaProcesso() {
  const [numero, setNumero] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [proc, setProc] = useState<Processo | null>(null);

  const consultar = async () => {
    if (!numero.trim() || carregando) return;
    setCarregando(true);
    setErro(null);
    setProc(null);
    try {
      const res = await fetch("/api/consulta-processo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numero })
      });
      const json = await res.json();
      if (json.ok) setProc(json.processo);
      else setErro(json.mensagem || "Não foi possível consultar.");
    } catch {
      setErro("Falha de conexão. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <section
      className="card mb-6 border-2 border-brand-accent/40"
      aria-label="Consulta de processo"
    >
      <h2 className="font-display text-xl font-bold text-brand-ink mb-1 inline-flex items-center gap-2">
        <Search className="w-5 h-5 text-brand-deep" aria-hidden />
        Consultar andamento do processo
      </h2>
      <p className="text-sm text-brand-ink/65 mb-4">
        Digite o número único (padrão CNJ, 20 dígitos). A consulta usa a base
        pública oficial do DataJud (CNJ).
      </p>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") consultar();
          }}
          inputMode="numeric"
          placeholder="0000000-00.0000.8.13.0000"
          className="flex-1 rounded-lg border-2 border-brand-line bg-white px-3 py-2 text-sm text-brand-ink focus:border-brand-accent focus:outline-none"
        />
        <button
          onClick={consultar}
          disabled={carregando || !numero.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-deep px-5 py-2 text-sm font-bold text-white hover:bg-brand-ink transition disabled:opacity-40"
        >
          {carregando ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> Consultando...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" aria-hidden /> Consultar
            </>
          )}
        </button>
      </div>

      {erro && (
        <div className="mt-4 rounded-xl border-l-4 border-amber-400 bg-amber-50 p-3 text-sm text-amber-900 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden />
          <span>{erro}</span>
        </div>
      )}

      {proc && (
        <div className="mt-5">
          <div className="rounded-xl bg-brand-deep/5 border border-brand-deep/20 p-4">
            <p className="font-mono text-sm font-bold text-brand-ink">{proc.numero}</p>
            <div className="mt-2 grid sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-brand-ink/85">
              <p className="inline-flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-brand-deep" aria-hidden />
                {proc.tribunal}
                {proc.grau ? ` · ${proc.grau}` : ""}
              </p>
              {proc.classe && <p><span className="text-brand-ink/55">Classe:</span> {proc.classe}</p>}
              {proc.orgaoJulgador && (
                <p><span className="text-brand-ink/55">Órgão:</span> {proc.orgaoJulgador}</p>
              )}
              {proc.dataAjuizamento && (
                <p><span className="text-brand-ink/55">Ajuizado em:</span> {dataBR(proc.dataAjuizamento)}</p>
              )}
            </div>
            {proc.assuntos.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {proc.assuntos.slice(0, 6).map((a, i) => (
                  <span key={i} className="chip text-xs text-brand-ink">{a}</span>
                ))}
              </div>
            )}
          </div>

          <h3 className="font-display text-base font-bold text-brand-ink mt-5 mb-2 inline-flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-deep" aria-hidden />
            Movimentações ({proc.movimentos.length})
          </h3>
          {proc.movimentos.length === 0 ? (
            <p className="text-sm text-brand-ink/60 italic">Sem movimentações públicas registradas.</p>
          ) : (
            <ol className="relative border-l-2 border-brand-line ml-2 space-y-3 max-h-[28rem] overflow-auto pr-2">
              {proc.movimentos.slice(0, 100).map((m, i) => (
                <li key={i} className="ml-5">
                  <span className="absolute -left-[7px] w-3 h-3 rounded-full bg-brand-deep ring-4 ring-white" aria-hidden />
                  <p className="text-[11px] font-bold uppercase tracking-wide text-brand-deep">
                    {dataBR(m.data)}
                  </p>
                  <p className="text-sm text-brand-ink/85 leading-snug">{m.nome}</p>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}

      <aside
        role="note"
        className="mt-4 rounded-xl border-l-4 border-amber-400 bg-amber-50 p-3 text-xs text-amber-900 leading-relaxed flex items-start gap-2"
      >
        <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden />
        <span>
          Dados públicos do DataJud/CNJ — só metadados e movimentações, sem nomes
          das partes nem conteúdo das peças. Processos em segredo de justiça não
          aparecem. Para acompanhar o seu caso com segurança, conte com o seu
          advogado.
        </span>
      </aside>
    </section>
  );
}
