"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Edit3,
  FileText,
  Pause,
  Play,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Clock
} from "lucide-react";
import { toast } from "@/components/Toast";
import { SPECIALTIES } from "@/lib/data/specialties";

/**
 * /painel/artigos — Gerenciamento de Artigos próprios (premium).
 *
 * CRUD básico: lista, cria, edita, pausa, publica, exclui. Persistência via
 * /api/painel/articles. Defensive: se a tabela não existir (migration 0006
 * pendente), mostra aviso amigável e link pra suporte.
 *
 * Linguagem sóbria conforme Provimento OAB 205/2021 — Maio/2026 Fase 3.
 */

type ArticleStatus = "draft" | "scheduled" | "published" | "paused" | "archived";

type Article = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  body: string;
  specialty_slug: string | null;
  status: ArticleStatus;
  scheduled_for: string | null;
  published_at: string | null;
  word_count: number | null;
  read_time_minutes: number | null;
  created_at: string;
  updated_at: string;
};

const STATUS_LABELS: Record<ArticleStatus, { text: string; tone: string }> = {
  draft: { text: "Rascunho", tone: "bg-slate-100 text-slate-700 border-slate-200" },
  scheduled: { text: "Agendado", tone: "bg-blue-100 text-blue-800 border-blue-200" },
  published: { text: "Publicado", tone: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  paused: { text: "Pausado", tone: "bg-amber-100 text-amber-900 border-amber-300" },
  archived: { text: "Arquivado", tone: "bg-brand-line/40 text-brand-ink/70 border-brand-line" }
};

export default function PainelArtigosPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [migrationPending, setMigrationPending] = useState(false);
  const [editing, setEditing] = useState<Partial<Article> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setMigrationPending(false);
    try {
      const res = await fetch("/api/painel/articles", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (res.status === 503 && data.code === "migration_pending") {
        setMigrationPending(true);
        setArticles([]);
      } else if (!res.ok || data.ok === false) {
        toast(data.error || "Não foi possível carregar artigos.", "error");
        setArticles([]);
      } else {
        setArticles(data.articles || []);
      }
    } catch (err) {
      console.error("[painel/artigos] load failed", err);
      toast("Erro de conexão.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const startNew = () => {
    setEditing({
      title: "",
      summary: "",
      body: "",
      specialty_slug: null,
      status: "draft",
      scheduled_for: null
    });
  };

  const save = async () => {
    if (!editing || saving) return;
    if (!editing.title || editing.title.trim().length < 5) {
      toast("Informe um título com pelo menos 5 caracteres.", "error");
      return;
    }
    if (!editing.body || editing.body.trim().length < 50) {
      toast("O conteúdo do artigo precisa de pelo menos 50 caracteres.", "error");
      return;
    }
    setSaving(true);
    try {
      const isEdit = !!editing.id;
      const url = isEdit ? `/api/painel/articles/${editing.id}` : "/api/painel/articles";
      const method = isEdit ? "PATCH" : "POST";
      const payload = {
        title: editing.title,
        summary: editing.summary,
        body: editing.body,
        specialtySlug: editing.specialty_slug,
        status: editing.status,
        scheduledFor: editing.scheduled_for
      };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) {
        toast(data.error || "Erro ao salvar artigo.", "error");
      } else {
        toast(isEdit ? "Artigo atualizado." : "Artigo criado.");
        setEditing(null);
        await load();
      }
    } catch (err) {
      console.error("[painel/artigos] save failed", err);
      toast("Erro de conexão.", "error");
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (article: Article, status: ArticleStatus) => {
    try {
      const res = await fetch(`/api/painel/articles/${article.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) {
        toast(data.error || "Não foi possível alterar o status.", "error");
      } else {
        toast("Status atualizado.");
        await load();
      }
    } catch (err) {
      console.error("[painel/artigos] status change failed", err);
      toast("Erro de conexão.", "error");
    }
  };

  const remove = async (article: Article) => {
    if (!window.confirm(`Excluir o artigo "${article.title}"? Esta ação é definitiva.`)) return;
    try {
      const res = await fetch(`/api/painel/articles/${article.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) {
        toast(data.error || "Erro ao excluir.", "error");
      } else {
        toast("Artigo excluído.");
        await load();
      }
    } catch (err) {
      console.error("[painel/artigos] delete failed", err);
      toast("Erro de conexão.", "error");
    }
  };

  return (
    <div className="container-tight py-10">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <Link
            href="/painel"
            className="inline-flex items-center gap-1 text-sm text-brand-deep hover:text-brand-accent2 mb-2"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden />
            Voltar ao painel
          </Link>
          <h1 className="font-display text-3xl font-bold text-brand-ink">Artigos próprios</h1>
          <p className="text-sm text-brand-ink/65 mt-1">
            Publique conteúdo informativo nas suas áreas de atuação. Caráter
            exclusivamente informativo, sem promessa de resultado.
          </p>
        </div>
        {!migrationPending && (
          <button onClick={startNew} className="btn-accent text-sm">
            <Plus className="w-4 h-4" aria-hidden />
            Novo artigo
          </button>
        )}
      </div>

      {migrationPending && (
        <div className="card border-amber-200 bg-amber-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" aria-hidden />
            <div>
              <p className="font-semibold text-amber-900">Recurso ainda em liberação</p>
              <p className="text-sm text-amber-900/85 mt-1">
                Esta funcionalidade depende de uma atualização do banco de dados
                que ainda não foi aplicada. Avise o suporte (migration 0006
                pendente) — assim que aplicada, seus artigos poderão ser
                criados aqui.
              </p>
              <Link
                href="/contato"
                className="inline-flex items-center text-sm text-amber-900 underline mt-2"
              >
                Falar com o suporte →
              </Link>
            </div>
          </div>
        </div>
      )}

      {!migrationPending && loading && (
        <div className="card text-center py-10">
          <div
            aria-hidden
            className="mx-auto w-8 h-8 border-4 border-brand-line border-t-brand-deep rounded-full animate-spin"
          />
          <p className="text-sm text-brand-ink/65 mt-3">Carregando artigos...</p>
        </div>
      )}

      {!migrationPending && !loading && articles.length === 0 && !editing && (
        <div className="card text-center py-10">
          <FileText className="w-12 h-12 text-brand-line mx-auto mb-3" aria-hidden />
          <p className="text-sm text-brand-ink/65 mb-4">
            Você ainda não criou nenhum artigo.
          </p>
          <button onClick={startNew} className="btn-accent text-sm">
            <Plus className="w-4 h-4" aria-hidden />
            Criar primeiro artigo
          </button>
        </div>
      )}

      {/* Listagem */}
      {!migrationPending && !loading && articles.length > 0 && !editing && (
        <div className="space-y-3">
          {articles.map((a) => {
            const lbl = STATUS_LABELS[a.status];
            return (
              <article key={a.id} className="card">
                <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${lbl.tone}`}
                      >
                        {lbl.text}
                      </span>
                      {a.specialty_slug && (
                        <span className="text-xs text-brand-ink/55">
                          {SPECIALTIES.find((s) => s.slug === a.specialty_slug)?.name ||
                            a.specialty_slug}
                        </span>
                      )}
                      {a.read_time_minutes && (
                        <span className="inline-flex items-center gap-1 text-xs text-brand-ink/55">
                          <Clock className="w-3 h-3" aria-hidden />
                          {a.read_time_minutes} min
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-lg font-bold text-brand-ink">
                      {a.title}
                    </h3>
                    {a.summary && (
                      <p className="text-sm text-brand-ink/70 mt-1 line-clamp-2">{a.summary}</p>
                    )}
                    <p className="text-xs text-brand-ink/55 mt-2">
                      Atualizado em{" "}
                      {new Date(a.updated_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 md:flex-col md:gap-1.5 md:items-end">
                    <button
                      onClick={() => setEditing(a)}
                      className="btn-ghost border border-brand-line text-xs"
                      type="button"
                    >
                      <Edit3 className="w-3.5 h-3.5" aria-hidden />
                      Editar
                    </button>
                    {a.status === "published" && (
                      <button
                        onClick={() => changeStatus(a, "paused")}
                        className="btn-ghost border border-brand-line text-xs"
                        type="button"
                      >
                        <Pause className="w-3.5 h-3.5" aria-hidden />
                        Pausar
                      </button>
                    )}
                    {(a.status === "draft" || a.status === "paused") && (
                      <button
                        onClick={() => changeStatus(a, "published")}
                        className="text-xs inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500"
                        type="button"
                      >
                        <Play className="w-3.5 h-3.5" aria-hidden />
                        Publicar
                      </button>
                    )}
                    <button
                      onClick={() => remove(a)}
                      className="btn-ghost border border-red-200 text-red-700 text-xs"
                      type="button"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden />
                      Excluir
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Formulário de criar/editar */}
      {editing && (
        <div className="card">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-4">
            {editing.id ? "Editar artigo" : "Novo artigo"}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="label">Título</label>
              <input
                className="input"
                placeholder="Ex.: Como funciona a aposentadoria especial"
                value={editing.title || ""}
                maxLength={200}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Resumo (opcional, até 300 caracteres)</label>
              <textarea
                className="input min-h-16"
                value={editing.summary || ""}
                maxLength={300}
                onChange={(e) => setEditing({ ...editing, summary: e.target.value })}
                placeholder="Frase curta que descreve o artigo. Aparece na listagem e na metadescrição."
              />
            </div>
            <div>
              <label className="label">Conteúdo</label>
              <textarea
                className="input min-h-64 font-mono text-sm"
                value={editing.body || ""}
                maxLength={50000}
                onChange={(e) => setEditing({ ...editing, body: e.target.value })}
                placeholder="Texto do artigo. Mínimo 50 caracteres."
              />
              <p className="text-xs text-brand-ink/55 mt-1">
                {(editing.body || "").split(/\s+/).filter(Boolean).length} palavras —{" "}
                {Math.max(
                  1,
                  Math.round((editing.body || "").split(/\s+/).filter(Boolean).length / 200)
                )}{" "}
                min de leitura aproximadamente
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="label">Área relacionada</label>
                <select
                  className="input"
                  value={editing.specialty_slug || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, specialty_slug: e.target.value || null })
                  }
                >
                  <option value="">— Nenhuma —</option>
                  {SPECIALTIES.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Status</label>
                <select
                  className="input"
                  value={editing.status || "draft"}
                  onChange={(e) =>
                    setEditing({ ...editing, status: e.target.value as ArticleStatus })
                  }
                >
                  <option value="draft">Rascunho</option>
                  <option value="published">Publicado</option>
                  <option value="scheduled">Agendado</option>
                  <option value="paused">Pausado</option>
                  <option value="archived">Arquivado</option>
                </select>
              </div>
            </div>
            {editing.status === "scheduled" && (
              <div>
                <label className="label">
                  <Calendar className="w-3.5 h-3.5 inline mr-1" aria-hidden />
                  Data e hora de publicação (timezone do seu navegador)
                </label>
                <input
                  type="datetime-local"
                  className="input"
                  value={
                    editing.scheduled_for
                      ? editing.scheduled_for.slice(0, 16)
                      : ""
                  }
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      scheduled_for: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : null
                    })
                  }
                />
              </div>
            )}

            <p className="text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <strong>Aviso ético:</strong> seu artigo terá automaticamente um
              aviso de que o conteúdo é informativo e não substitui consulta
              individual. Evite expressões como &ldquo;melhor advogado&rdquo;,
              &ldquo;resultado garantido&rdquo;, &ldquo;ganhe sua causa&rdquo;.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={save}
                disabled={saving}
                className="btn-primary"
                type="button"
              >
                {saving ? "Salvando..." : editing.id ? "Salvar alterações" : "Criar artigo"}
              </button>
              <button
                onClick={() => setEditing(null)}
                className="btn-ghost border border-brand-line"
                type="button"
              >
                Cancelar
              </button>
              {editing.id && editing.status !== "published" && (
                <span className="text-xs text-brand-ink/50 ml-auto inline-flex items-center gap-1">
                  <EyeOff className="w-3.5 h-3.5" aria-hidden />
                  Não visível ao público
                </span>
              )}
              {editing.id && editing.status === "published" && (
                <span className="text-xs text-emerald-700 ml-auto inline-flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" aria-hidden />
                  Visível na sua Página Profissional
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
