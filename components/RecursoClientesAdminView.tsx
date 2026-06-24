"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { RefreshCw, FileBadge, ExternalLink, Copy, Check } from "lucide-react";

type RecursoCliente = {
  id: string;
  created_at: string;
  nome: string | null;
  email: string | null;
  telefone: string | null;
  fase: string | null;
  infracao: string | null;
  placa: string | null;
  ait: string | null;
  orgao: string | null;
  cidade: string | null;
  relato: string | null;
  status: string;
  recursos_restantes: number | null;
  access_token: string | null;
  activated_at: string | null;
};

const STATUS_LABEL: Record<string, string> = {
  aguardando: "Aguardando",
  ativo: "Ativo",
  cancelado: "Cancelado"
};

const STATUS_COR: Record<string, string> = {
  aguardando: "bg-amber-100 text-amber-900 border-amber-300",
  ativo: "bg-emerald-100 text-emerald-900 border-emerald-300",
  cancelado: "bg-gray-100 text-gray-700 border-gray-300"
};

function dataBR(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function waLink(telefone: string | null): string | null {
  if (!telefone) return null;
  const dig = telefone.replace(/\D/g, "");
  if (dig.length >= 10 && dig.length <= 13) {
    const full = dig.length <= 11 ? `55${dig}` : dig;
    return `https://wa.me/${full}`;
  }
  return null;
}

function acessoLink(token: string | null): string | null {
  if (!token) return null;
  return `https://multas.advaqui.com/multas?token=${token}`;
}

export function RecursoClientesAdminView() {
  const [lista, setLista] = useState<RecursoCliente[]>([]);
  const [estado, setEstado] = useState<"carregando" | "ok" | "naoauth" | "erro" | "vazio">("carregando");
  const [pendente, setPendente] = useState(false);
  const [copiado, setCopiado] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setEstado("carregando");
    try {
      const res = await fetch("/api/admin/recurso-clientes", { cache: "no-store" });
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
      setLista(json.clientes || []);
      setEstado((json.clientes || []).length === 0 ? "vazio" : "ok");
    } catch {
      setEstado("erro");
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const aplicarAcao = async (id: string, action: "ativar" | "cancelar") => {
    const anterior = lista.find((c) => c.id === id);
    const reverter = () => {
      if (anterior) {
        setLista((l) => l.map((c) => (c.id === id ? anterior : c)));
      }
    };
    // Otimista: reflete o resultado esperado da ação antes da resposta do servidor.
    setLista((l) =>
      l.map((c) =>
        c.id === id
          ? action === "cancelar"
            ? { ...c, status: "cancelado" }
            : { ...c, status: "ativo", recursos_restantes: 3 }
          : c
      )
    );
    try {
      const res = await fetch("/api/admin/recurso-clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action })
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

  const copiar = async (id: string, texto: string) => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(id);
      setTimeout(() => setCopiado((c) => (c === id ? null : c)), 2000);
    } catch {
      // sem clipboard disponível; ignora silenciosamente
    }
  };

  return (
    <div className="container-narrow py-10">
      <div className="flex items-center justify-between gap-3 mb-6">
        <h1 className="font-display text-2xl font-bold text-brand-ink inline-flex items-center gap-2">
          <FileBadge className="w-6 h-6 text-brand-deep" aria-hidden />
          Clientes do recurso de multa
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
            A tabela <code>recurso_clientes</code> ainda não existe no banco. Rode a
            migration correspondente no Supabase.
          </p>
        </div>
      )}

      {estado === "vazio" && !pendente && (
        <p className="text-sm text-brand-ink/60 italic">Nenhum cliente ainda.</p>
      )}

      {estado === "ok" && (
        <div className="space-y-3">
          {lista.map((c) => {
            const wa = waLink(c.telefone);
            const acesso = acessoLink(c.access_token);
            return (
              <div key={c.id} className="card">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-display font-bold text-brand-ink">{c.nome || "(sem nome)"}</p>
                    <p className="text-sm text-brand-ink/80">
                      {c.email || "—"}
                      {c.telefone && (
                        <>
                          {" · "}
                          {c.telefone}
                          {wa && (
                            <a href={wa} target="_blank" rel="noopener noreferrer" className="ml-2 inline-flex items-center gap-1 text-brand-deep hover:underline">
                              WhatsApp <ExternalLink className="w-3 h-3" aria-hidden />
                            </a>
                          )}
                        </>
                      )}
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full border ${STATUS_COR[c.status] || STATUS_COR.aguardando}`}>
                    {STATUS_LABEL[c.status] || c.status}
                  </span>
                </div>

                <div className="mt-2 text-sm text-brand-ink/75 grid sm:grid-cols-2 gap-x-4 gap-y-0.5">
                  {c.infracao && <p><span className="text-brand-ink/50">Infração:</span> {c.infracao}</p>}
                  {c.placa && <p><span className="text-brand-ink/50">Placa:</span> {c.placa}</p>}
                  {c.ait && <p><span className="text-brand-ink/50">AIT:</span> {c.ait}</p>}
                  {c.orgao && <p><span className="text-brand-ink/50">Órgão:</span> {c.orgao}</p>}
                  {c.cidade && <p><span className="text-brand-ink/50">Cidade:</span> {c.cidade}</p>}
                  <p><span className="text-brand-ink/50">Recursos restantes:</span> {c.recursos_restantes ?? "—"}</p>
                  <p><span className="text-brand-ink/50">Recebido:</span> {dataBR(c.created_at)}</p>
                </div>

                {c.relato && (
                  <p className="mt-2 text-sm text-brand-ink/85 bg-brand-deep/5 rounded-lg p-2 leading-relaxed">{c.relato}</p>
                )}

                {acesso && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <code className="text-xs text-brand-ink/80 bg-brand-deep/5 rounded-lg px-2 py-1 break-all min-w-0">{acesso}</code>
                    <button
                      onClick={() => void copiar(c.id, acesso)}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border-2 border-brand-line text-brand-ink/70 hover:border-brand-deep transition"
                    >
                      {copiado === c.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" aria-hidden /> Copiado
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" aria-hidden /> Copiar link
                        </>
                      )}
                    </button>
                  </div>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => void aplicarAcao(c.id, "ativar")}
                    disabled={c.status === "ativo"}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg border-2 transition ${
                      c.status === "ativo"
                        ? "border-emerald-300 bg-emerald-100 text-emerald-900 cursor-default"
                        : "border-brand-line text-brand-ink/70 hover:border-brand-deep"
                    }`}
                  >
                    Ativar
                  </button>
                  <button
                    onClick={() => void aplicarAcao(c.id, "cancelar")}
                    disabled={c.status === "cancelado"}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg border-2 transition ${
                      c.status === "cancelado"
                        ? "border-gray-300 bg-gray-100 text-gray-700 cursor-default"
                        : "border-brand-line text-brand-ink/70 hover:border-rose-400"
                    }`}
                  >
                    Cancelar
                  </button>
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
