"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { RefreshCw, CalendarCheck, ExternalLink } from "lucide-react";

type Agendamento = {
  id: string;
  created_at: string;
  nome: string;
  contato: string;
  area: string | null;
  assunto: string | null;
  data_preferida: string | null;
  periodo: string | null;
  mensagem: string | null;
  status: string;
};

const STATUS_LABEL: Record<string, string> = {
  novo: "Novo",
  em_contato: "Em contato",
  concluido: "Concluído",
  descartado: "Descartado"
};

const STATUS_COR: Record<string, string> = {
  novo: "bg-amber-100 text-amber-900 border-amber-300",
  em_contato: "bg-blue-100 text-blue-900 border-blue-300",
  concluido: "bg-emerald-100 text-emerald-900 border-emerald-300",
  descartado: "bg-gray-100 text-gray-700 border-gray-300"
};

function dataBR(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function waLink(contato: string): string | null {
  const dig = contato.replace(/\D/g, "");
  if (dig.length >= 10 && dig.length <= 13) {
    const full = dig.length <= 11 ? `55${dig}` : dig;
    return `https://wa.me/${full}`;
  }
  return null;
}

export function AgendaAdminView() {
  const [lista, setLista] = useState<Agendamento[]>([]);
  const [estado, setEstado] = useState<"carregando" | "ok" | "naoauth" | "erro" | "vazio">("carregando");
  const [pendente, setPendente] = useState(false);

  const carregar = useCallback(async () => {
    setEstado("carregando");
    try {
      const res = await fetch("/api/admin/agendamentos", { cache: "no-store" });
      if (res.status === 401) {
        setEstado("naoauth");
        return;
      }
      const json = await res.json();
      if (!json.ok) {
        setEstado("erro");
        return;
      }
      setPendente(!!json.migrationPending);
      setLista(json.agendamentos || []);
      setEstado((json.agendamentos || []).length === 0 ? "vazio" : "ok");
    } catch {
      setEstado("erro");
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const mudarStatus = async (id: string, status: string) => {
    const anterior = lista.find((a) => a.id === id)?.status;
    const reverter = () => {
      if (anterior !== undefined) {
        setLista((l) => l.map((a) => (a.id === id ? { ...a, status: anterior } : a)));
      }
    };
    setLista((l) => l.map((a) => (a.id === id ? { ...a, status } : a)));
    try {
      const res = await fetch("/api/admin/agendamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      if (!res.ok) {
        // 401 = sessão admin expirou; outros = erro no servidor. Reverte a UI.
        if (res.status === 401) setEstado("naoauth");
        reverter();
      }
    } catch {
      reverter();
    }
  };

  return (
    <div className="container-narrow py-10">
      <div className="flex items-center justify-between gap-3 mb-6">
        <h1 className="font-display text-2xl font-bold text-brand-ink inline-flex items-center gap-2">
          <CalendarCheck className="w-6 h-6 text-brand-deep" aria-hidden />
          Agendamentos
        </h1>
        <button
          onClick={() => void carregar()}
          className="inline-flex items-center gap-2 rounded-lg border-2 border-brand-line px-3 py-1.5 text-sm font-semibold text-brand-ink hover:border-brand-deep transition"
        >
          <RefreshCw className="w-4 h-4" aria-hidden /> Atualizar
        </button>
      </div>

      {estado === "carregando" && <p className="text-sm text-brand-ink/60">Carregando...</p>}

      {estado === "naoauth" && (
        <div className="card border-amber-200 bg-amber-50">
          <p className="text-sm text-amber-900">
            Você precisa estar logado como admin. Entre em{" "}
            <Link href="/admin" className="font-bold underline">/admin</Link> e volte a esta página.
          </p>
        </div>
      )}

      {estado === "erro" && (
        <div className="card border-rose-200 bg-rose-50">
          <p className="text-sm text-rose-900">Erro ao carregar. Tente atualizar.</p>
        </div>
      )}

      {pendente && (
        <div className="card border-amber-200 bg-amber-50 mb-4">
          <p className="text-sm text-amber-900">
            A tabela <code>agendamentos</code> ainda não existe no banco. Rode a
            migration <code>0010_agendamentos.sql</code> no Supabase.
          </p>
        </div>
      )}

      {estado === "vazio" && !pendente && (
        <p className="text-sm text-brand-ink/60 italic">Nenhum agendamento ainda.</p>
      )}

      {estado === "ok" && (
        <div className="space-y-3">
          {lista.map((a) => {
            const wa = waLink(a.contato);
            return (
              <div key={a.id} className="card">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-display font-bold text-brand-ink">{a.nome}</p>
                    <p className="text-sm text-brand-ink/80">
                      {a.contato}
                      {wa && (
                        <a href={wa} target="_blank" rel="noopener noreferrer" className="ml-2 inline-flex items-center gap-1 text-brand-deep hover:underline">
                          WhatsApp <ExternalLink className="w-3 h-3" aria-hidden />
                        </a>
                      )}
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full border ${STATUS_COR[a.status] || STATUS_COR.novo}`}>
                    {STATUS_LABEL[a.status] || a.status}
                  </span>
                </div>
                <div className="mt-2 text-sm text-brand-ink/75 grid sm:grid-cols-2 gap-x-4 gap-y-0.5">
                  {a.area && <p><span className="text-brand-ink/50">Área:</span> {a.area}</p>}
                  {a.assunto && <p><span className="text-brand-ink/50">Assunto:</span> {a.assunto}</p>}
                  {a.data_preferida && <p><span className="text-brand-ink/50">Data preferida:</span> {a.data_preferida.split("-").reverse().join("/")}{a.periodo ? ` (${a.periodo})` : ""}</p>}
                  <p><span className="text-brand-ink/50">Recebido:</span> {dataBR(a.created_at)}</p>
                </div>
                {a.mensagem && (
                  <p className="mt-2 text-sm text-brand-ink/85 bg-brand-deep/5 rounded-lg p-2 leading-relaxed">{a.mensagem}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  {(["novo", "em_contato", "concluido", "descartado"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => mudarStatus(a.id, s)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border-2 transition ${
                        a.status === s ? "border-brand-deep bg-brand-deep text-white" : "border-brand-line text-brand-ink/70 hover:border-brand-deep"
                      }`}
                    >
                      {STATUS_LABEL[s]}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-6 text-xs text-brand-ink/45">
        <Link href="/admin" className="hover:underline">← Voltar ao painel</Link>
      </p>
    </div>
  );
}
