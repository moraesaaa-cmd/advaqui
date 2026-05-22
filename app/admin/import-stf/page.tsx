"use client";

/**
 * Página admin para importar decisões STF coletadas via browser do usuário.
 *
 * Por que existe (F21, 2026-05-22): o endpoint Elasticsearch interno da SPA
 * do STF (jurisprudencia.stf.jus.br/api/search/search) está protegido por
 * AWS WAF que retorna HTTP 202 com size=0 pra requests de IPs de datacenter
 * (nosso VPS Hostinger). Do browser do user (IP residencial) retorna 200 OK
 * com JSON real. Solução pragmática — o user roda script no console do tab
 * STF, copia o array de decisões, cola aqui e clica importar. A página faz
 * POST same-origin pra /api/admin/jurisprudencia/import-stf (com cookie admin),
 * que valida cada item e faz upsert no Supabase.
 *
 * Fluxo do usuário:
 *  1. Abre jurisprudencia.stf.jus.br/pages/search?base=acordaos
 *  2. Faz busca (ex. "dano moral"), pageSize=50
 *  3. DevTools → Console → cola script que captura window.__stf_coletadas__
 *  4. Console: copy(JSON.stringify(window.__stf_coletadas__))
 *  5. Volta aqui, cola, clica Importar
 *  6. Vê stats — inseridas, atualizadas, ignoradas, motivos
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, CheckCircle2, AlertCircle, Loader2, FileJson } from "lucide-react";
import { toast } from "@/components/Toast";

type ImportStats = {
  recebidas: number;
  inseridas: number;
  atualizadas: number;
  ignoradas_invalidas: number;
  erros: number;
  motivos: Record<string, number>;
  slugs_inseridos: string[];
};

type ParseError = {
  message: string;
  details?: string;
};

export default function ImportSTFPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [jsonText, setJsonText] = useState("");
  const [busy, setBusy] = useState(false);
  const [stats, setStats] = useState<ImportStats | null>(null);
  const [parseError, setParseError] = useState<ParseError | null>(null);

  // Auth check — redireciona /login se não for admin
  useEffect(() => {
    (async () => {
      try {
        const check = await fetch("/api/admin", { method: "GET" });
        if (!check.ok) {
          router.push("/login");
          return;
        }
        setReady(true);
      } catch {
        router.push("/login");
      }
    })();
  }, [router]);

  const previewCount = (): { count: number; err: string | null } => {
    if (!jsonText.trim()) return { count: 0, err: null };
    try {
      const parsed = JSON.parse(jsonText);
      const arr = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed?.items)
          ? parsed.items
          : null;
      if (!arr) return { count: 0, err: "JSON precisa ser array ou {items: array}" };
      return { count: arr.length, err: null };
    } catch (e) {
      return { count: 0, err: (e as Error).message };
    }
  };

  const preview = previewCount();

  const handleImport = async () => {
    setParseError(null);
    setStats(null);

    if (!jsonText.trim()) {
      toast("Cole o JSON das decisões STF primeiro", "error");
      return;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonText);
    } catch (e) {
      setParseError({
        message: "JSON inválido",
        details: (e as Error).message
      });
      return;
    }

    const arr = Array.isArray(parsed)
      ? parsed
      : Array.isArray((parsed as { items?: unknown[] }).items)
        ? (parsed as { items: unknown[] }).items
        : null;

    if (!arr || arr.length === 0) {
      setParseError({
        message: "Payload vazio ou formato inválido",
        details: "Esperado array de objetos ou { items: [...] }"
      });
      return;
    }

    if (arr.length > 500) {
      setParseError({
        message: `Batch grande demais — máximo 500 itens por vez (recebido ${arr.length})`,
        details: "Divida em lotes menores e importe um por vez."
      });
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/admin/jurisprudencia/import-stf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(arr)
      });

      const json = await res.json();

      if (!res.ok) {
        setParseError({
          message: json.error || `HTTP ${res.status}`,
          details: JSON.stringify(json, null, 2)
        });
        toast(`Falha ao importar — ${json.error || res.status}`, "error");
        return;
      }

      setStats(json as ImportStats);
      const inseridas = (json as ImportStats).inseridas;
      const ignoradas = (json as ImportStats).ignoradas_invalidas;
      toast(
        `Importação concluída — ${inseridas} salvas${ignoradas > 0 ? `, ${ignoradas} ignoradas` : ""}`,
        inseridas > 0 ? "success" : "info"
      );
    } catch (e) {
      setParseError({
        message: "Erro de rede ou servidor",
        details: (e as Error).message
      });
      toast(`Erro — ${(e as Error).message}`, "error");
    } finally {
      setBusy(false);
    }
  };

  const handleClear = () => {
    setJsonText("");
    setStats(null);
    setParseError(null);
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Verificando autenticação...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FileJson className="w-7 h-7 text-amber-500" />
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Importar decisões STF
            </h1>
          </div>
          <p className="text-slate-600 max-w-3xl">
            Cole abaixo o array JSON com decisões coletadas do portal do STF
            (jurisprudencia.stf.jus.br) e clique Importar. Cada item é validado
            (ementa &ge; 50 caracteres, número, classe, URL oficial) antes de
            persistir.
          </p>
        </header>

        {/* Instruções */}
        <section className="mb-6 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800 mb-3 uppercase tracking-wide">
            Como coletar decisões no STF
          </h2>
          <ol className="space-y-2 text-sm text-slate-700 list-decimal list-inside">
            <li>
              Abra{" "}
              <a
                href="https://jurisprudencia.stf.jus.br/pages/search?base=acordaos"
                target="_blank"
                rel="noopener"
                className="text-amber-700 underline hover:text-amber-900"
              >
                jurisprudencia.stf.jus.br
              </a>{" "}
              e faça uma busca (ex. &quot;dano moral&quot;, pageSize=50).
            </li>
            <li>
              Abra <strong>DevTools</strong> (F12) →{" "}
              <strong>aba Console</strong>.
            </li>
            <li>
              Cole o script abaixo e dê Enter — ele captura os resultados da
              busca atual em <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">window.__stf_coletadas__</code>.
            </li>
            <li>
              No console, rode{" "}
              <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">
                copy(JSON.stringify(window.__stf_coletadas__))
              </code>{" "}
              — copia o JSON pra área de transferência.
            </li>
            <li>Volte aqui, cole na caixa abaixo e clique <strong>Importar</strong>.</li>
          </ol>

          <details className="mt-4 border-t border-slate-100 pt-4">
            <summary className="cursor-pointer text-sm font-medium text-slate-700 hover:text-slate-900">
              Ver script de captura (passo 3)
            </summary>
            <pre className="mt-3 bg-slate-900 text-slate-100 text-xs p-4 rounded-lg overflow-auto leading-relaxed">
{`// Cola no console de jurisprudencia.stf.jus.br
(async () => {
  const queries = ["dano moral", "habeas corpus"];
  window.__stf_coletadas__ = window.__stf_coletadas__ || [];
  for (const q of queries) {
    const r = await fetch(
      "https://jurisprudencia.stf.jus.br/api/search/search?index=acordaos",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: { query_string: { query: q, default_operator: "AND" } },
          size: 50, from: 0
        })
      }
    );
    const j = await r.json();
    const hits = j?.result?.hits?.hits || [];
    for (const h of hits) {
      const s = h._source || {};
      window.__stf_coletadas__.push({
        id: h._id || s.id,
        titulo: s.titulo,
        classe_sigla: s.processo_classe_processual_unificada_sigla,
        numero: s.processo_codigo_completo,
        relator: s.relator_acordao_nome || s.relator_processo_nome,
        orgao_julgador: s.orgao_julgador,
        julgamento_data: s.julgamento_data,
        publicacao_data: s.publicacao_data,
        ementa_texto: s.ementa_texto,
        inteiro_teor_url: s.inteiro_teor_url
      });
    }
    console.log(\`[\${q}] +\${hits.length}\`);
    await new Promise(r => setTimeout(r, 1500));
  }
  console.log("Total:", window.__stf_coletadas__.length);
})();`}
            </pre>
          </details>
        </section>

        {/* Textarea */}
        <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm mb-6">
          <label
            htmlFor="json-input"
            className="block text-sm font-semibold text-slate-800 mb-2"
          >
            JSON coletado{" "}
            {preview.count > 0 && (
              <span className="ml-2 text-xs font-normal text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                {preview.count} {preview.count === 1 ? "item" : "itens"} detectados
              </span>
            )}
          </label>

          <textarea
            id="json-input"
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            disabled={busy}
            placeholder='[ { "id": "sjur254711", "classe_sigla": "ARE-AgR", "numero": "ARE 713255 AgR", "ementa_texto": "...", ... }, ... ]'
            className="w-full h-72 sm:h-96 font-mono text-xs p-4 border border-slate-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-100 focus:outline-none resize-y bg-slate-50 text-slate-800"
            spellCheck={false}
          />

          {preview.err && (
            <p className="mt-2 text-xs text-rose-600 flex items-start gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span>{preview.err}</span>
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleImport}
              disabled={busy || preview.count === 0 || !!preview.err}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-sm transition"
            >
              {busy ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {busy ? "Importando..." : `Importar${preview.count ? ` (${preview.count})` : ""}`}
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={busy}
              className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-50 text-slate-700 font-medium rounded-lg transition"
            >
              Limpar
            </button>

            <p className="text-xs text-slate-500 self-center">
              Máximo 500 itens por importação.
            </p>
          </div>
        </section>

        {/* Erro de parse / HTTP */}
        {parseError && (
          <section className="bg-rose-50 border border-rose-200 rounded-xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-rose-900 mb-1">
                  {parseError.message}
                </h3>
                {parseError.details && (
                  <pre className="text-xs text-rose-800 bg-white/60 p-3 rounded mt-2 overflow-auto max-h-48">
                    {parseError.details}
                  </pre>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Stats */}
        {stats && (
          <section className="bg-white border border-emerald-200 rounded-xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="font-bold text-slate-900 text-lg">
                  Importação concluída
                </h2>
                <p className="text-sm text-slate-600">
                  Recebidas {stats.recebidas} • salvas {stats.inseridas} •{" "}
                  ignoradas {stats.ignoradas_invalidas} • erros {stats.erros}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              <StatCard label="Recebidas" value={stats.recebidas} tone="slate" />
              <StatCard
                label="Salvas no banco"
                value={stats.inseridas}
                tone="emerald"
              />
              <StatCard
                label="Ignoradas"
                value={stats.ignoradas_invalidas}
                tone="amber"
              />
              <StatCard label="Erros" value={stats.erros} tone="rose" />
            </div>

            {Object.keys(stats.motivos).length > 0 && (
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-slate-800 mb-2">
                  Motivos de descarte
                </h3>
                <ul className="space-y-1 text-sm">
                  {Object.entries(stats.motivos).map(([motivo, count]) => (
                    <li
                      key={motivo}
                      className="flex justify-between bg-slate-50 px-3 py-1.5 rounded"
                    >
                      <code className="text-slate-700">{motivo}</code>
                      <span className="font-semibold text-slate-900">
                        {count}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {stats.slugs_inseridos.length > 0 && (
              <details>
                <summary className="cursor-pointer text-sm font-medium text-slate-700 hover:text-slate-900">
                  Ver {stats.slugs_inseridos.length} slugs persistidos
                </summary>
                <ul className="mt-3 space-y-1 max-h-64 overflow-auto bg-slate-50 p-3 rounded">
                  {stats.slugs_inseridos.map((slug) => (
                    <li key={slug} className="text-xs font-mono">
                      <a
                        href={`/jurisprudencia/stf/${slug}`}
                        target="_blank"
                        rel="noopener"
                        className="text-amber-700 hover:text-amber-900 hover:underline"
                      >
                        /jurisprudencia/stf/{slug}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

type Tone = "slate" | "emerald" | "amber" | "rose";

const TONE_CLASSES: Record<Tone, string> = {
  slate: "bg-slate-50 border-slate-200 text-slate-700",
  emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
  amber: "bg-amber-50 border-amber-200 text-amber-700",
  rose: "bg-rose-50 border-rose-200 text-rose-700"
};

function StatCard({
  label,
  value,
  tone
}: {
  label: string;
  value: number;
  tone: Tone;
}) {
  return (
    <div className={`border rounded-lg p-3 ${TONE_CLASSES[tone]}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs uppercase tracking-wide font-medium opacity-80">
        {label}
      </div>
    </div>
  );
}
