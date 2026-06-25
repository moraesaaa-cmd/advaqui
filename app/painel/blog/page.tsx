"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Edit3,
  FileText,
  Plus,
  Send,
  XCircle
} from "lucide-react";
import { toast } from "@/components/Toast";

/**
 * /painel/blog — Artigos para o blog público do AdvAqui (UGC).
 *
 * Advogados premium podem submeter artigos para o blog público.
 * Artigos passam por revisão antes de serem publicados.
 *
 * Diferente de /painel/artigos (artigos na Página Profissional),
 * estes artigos aparecem no blog central /blog para todos os visitantes.
 *
 * Junho/2026 — UGC Blog AdvAqui.
 */

type UgcStatus = "draft" | "pending" | "published" | "rejected";

type BlogArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  meta_description: string | null;
  category: string | null;
  status: UgcStatus;
  author_name: string | null;
  created_at: string;
  published_at: string | null;
  reading_minutes: number | null;
};

const STATUS_CONFIG: Record<
  UgcStatus,
  { label: string; tone: string; Icon: typeof CheckCircle2 }
> = {
  draft: {
    label: "Rascunho",
    tone: "bg-slate-100 text-slate-700 border-slate-200",
    Icon: FileText
  },
  pending: {
    label: "Em revisão",
    tone: "bg-amber-100 text-amber-900 border-amber-300",
    Icon: Clock
  },
  published: {
    label: "Publicado",
    tone: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Icon: CheckCircle2
  },
  rejected: {
    label: "Recusado",
    tone: "bg-red-100 text-red-800 border-red-200",
    Icon: XCircle
  }
};

export default function PainelBlogPage() {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [migrationPending, setMigrationPending] = useState(false);
  const [editing, setEditing] = useState<{
    id?: string;
    title: string;
    content: string;
    meta_description: string;
    isResubmit?: boolean;
  } | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setMigrationPending(false);
    try {
      const res = await fetch("/api/painel/blog", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (res.status === 503 && data.code === "migration_pending") {
        setMigrationPending(true);
        setArticles([]);
      } else if (!res.ok || data.ok === false) {
        toast(data.error || "Não foi possível carregar os artigos.", "error");
        setArticles([]);
      } else {
        setArticles(data.articles || []);
      }
    } catch (err) {
      console.error("[painel/blog] load failed", err);
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
      content: "",
      meta_description: ""
    });
  };

  const startEdit = (article: BlogArticle) => {
    // Para editar, precisaríamos do body completo — por simplicidade,
    // permitimos apenas resubmeter com novo conteúdo
    setEditing({
      id: article.id,
      title: article.title,
      content: "",
      meta_description: article.meta_description || article.excerpt || "",
      isResubmit: article.status === "rejected"
    });
  };

  const submit = async () => {
    if (!editing || saving) return;

    if (!editing.title || editing.title.trim().length < 5) {
      toast("Informe um título com pelo menos 5 caracteres.", "error");
      return;
    }
    if (!editing.content || editing.content.trim().length < 100) {
      toast("O conteúdo do artigo precisa de pelo menos 100 caracteres.", "error");
      return;
    }

    setSaving(true);
    try {
      const isEdit = !!editing.id;
      const method = isEdit ? "PUT" : "POST";
      const payload = isEdit
        ? {
            id: editing.id,
            title: editing.title.trim(),
            content: editing.content.trim(),
            meta_description: editing.meta_description.trim(),
            resubmit: true
          }
        : {
            title: editing.title.trim(),
            content: editing.content.trim(),
            meta_description: editing.meta_description.trim()
          };

      const res = await fetch("/api/painel/blog", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.ok === false) {
        toast(data.error || "Erro ao enviar artigo.", "error");
      } else {
        toast(
          isEdit
            ? "Artigo reenviado para revisão."
            : "Artigo enviado para revisão."
        );
        setEditing(null);
        await load();
      }
    } catch (err) {
      console.error("[painel/blog] submit failed", err);
      toast("Erro de conexão.", "error");
    } finally {
      setSaving(false);
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
          <h1 className="font-display text-3xl font-bold text-brand-ink">
            Blog AdvAqui
          </h1>
          <p className="text-sm text-brand-ink/65 mt-1">
            Publique artigos no blog público do AdvAqui. Seu nome e perfil
            aparecerão como autor para todos os leitores.
          </p>
        </div>
        {!migrationPending && (
          <button onClick={startNew} className="btn-accent text-sm">
            <Plus className="w-4 h-4" aria-hidden />
            Novo artigo
          </button>
        )}
      </div>

      {/* Aviso: artigos passam por revisão */}
      {!migrationPending && !editing && (
        <div className="card border-brand-accent/30 bg-brand-accent/5 mb-6">
          <div className="flex items-start gap-3">
            <BookOpen
              className="w-5 h-5 text-brand-deep mt-0.5 flex-shrink-0"
              aria-hidden
            />
            <div>
              <p className="text-sm text-brand-ink/85 leading-relaxed">
                Seus artigos serão revisados antes de serem publicados no blog.
                O conteúdo deve ser informativo, sem promessa de resultado e em
                conformidade com o Provimento OAB 205/2021.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Migration pendente */}
      {migrationPending && (
        <div className="card border-amber-200 bg-amber-50">
          <div className="flex items-start gap-3">
            <AlertCircle
              className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0"
              aria-hidden
            />
            <div>
              <p className="font-semibold text-amber-900">
                Recurso ainda em liberação
              </p>
              <p className="text-sm text-amber-900/85 mt-1">
                Esta funcionalidade depende de uma atualização do banco de dados
                que ainda não foi aplicada (migration 0015). Avise o suporte.
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

      {/* Loading */}
      {!migrationPending && loading && (
        <div className="card text-center py-10">
          <div
            aria-hidden
            className="mx-auto w-8 h-8 border-4 border-brand-line border-t-brand-deep rounded-full animate-spin"
          />
          <p className="text-sm text-brand-ink/65 mt-3">
            Carregando artigos...
          </p>
        </div>
      )}

      {/* Estado vazio */}
      {!migrationPending && !loading && articles.length === 0 && !editing && (
        <div className="card text-center py-10">
          <BookOpen
            className="w-12 h-12 text-brand-line mx-auto mb-3"
            aria-hidden
          />
          <p className="font-display text-lg font-bold text-brand-ink mb-1">
            Nenhum artigo enviado ainda
          </p>
          <p className="text-sm text-brand-ink/65 mb-4">
            Publique conteúdo informativo e construa autoridade na sua
            especialidade.
          </p>
          <button onClick={startNew} className="btn-accent text-sm">
            <Plus className="w-4 h-4" aria-hidden />
            Escrever primeiro artigo
          </button>
        </div>
      )}

      {/* Listagem de artigos */}
      {!migrationPending && !loading && articles.length > 0 && !editing && (
        <div className="space-y-3">
          {articles.map((a) => {
            const cfg = STATUS_CONFIG[a.status] || STATUS_CONFIG.draft;
            const StatusIcon = cfg.Icon;
            return (
              <article key={a.id} className="card">
                <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg.tone}`}
                      >
                        <StatusIcon className="w-3 h-3" aria-hidden />
                        {cfg.label}
                      </span>
                      {a.reading_minutes && (
                        <span className="inline-flex items-center gap-1 text-xs text-brand-ink/55">
                          <Clock className="w-3 h-3" aria-hidden />
                          {a.reading_minutes} min
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-lg font-bold text-brand-ink">
                      {a.title}
                    </h3>
                    {a.excerpt && (
                      <p className="text-sm text-brand-ink/70 mt-1 line-clamp-2">
                        {a.excerpt}
                      </p>
                    )}
                    <p className="text-xs text-brand-ink/55 mt-2">
                      Enviado em{" "}
                      {new Date(a.created_at).toLocaleDateString("pt-BR")}
                      {a.status === "published" && a.published_at && (
                        <>
                          {" · Publicado em "}
                          {new Date(a.published_at).toLocaleDateString("pt-BR")}
                        </>
                      )}
                    </p>
                    {a.status === "published" && (
                      <Link
                        href={`/blog/${a.slug}`}
                        className="inline-flex items-center gap-1 text-xs text-brand-deep hover:text-brand-accent2 mt-1"
                      >
                        Ver no blog →
                      </Link>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5 md:flex-col md:gap-1.5 md:items-end">
                    {["draft", "pending", "rejected"].includes(a.status) && (
                      <button
                        onClick={() => startEdit(a)}
                        className="btn-ghost border border-brand-line text-xs"
                        type="button"
                      >
                        <Edit3 className="w-3.5 h-3.5" aria-hidden />
                        {a.status === "rejected" ? "Corrigir e reenviar" : "Editar"}
                      </button>
                    )}
                  </div>
                </div>
                {a.status === "rejected" && (
                  <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
                    <p className="text-xs text-red-800">
                      Este artigo não atendeu aos critérios de publicação. Você
                      pode editar o conteúdo e reenviar para nova revisão.
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Formulário de criar/editar */}
      {editing && (
        <div className="card">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-4">
            {editing.id
              ? editing.isResubmit
                ? "Corrigir e reenviar artigo"
                : "Editar artigo"
              : "Novo artigo para o blog"}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="label">Título</label>
              <input
                className="input"
                placeholder="Ex.: Como funciona a aposentadoria especial"
                value={editing.title}
                maxLength={200}
                onChange={(e) =>
                  setEditing({ ...editing, title: e.target.value })
                }
              />
            </div>

            <div>
              <label className="label">
                Meta descrição (até 160 caracteres)
              </label>
              <textarea
                className="input min-h-16"
                value={editing.meta_description}
                maxLength={160}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    meta_description: e.target.value
                  })
                }
                placeholder="Resumo curto que aparecerá no Google e na listagem do blog."
              />
              <p className="text-xs text-brand-ink/55 mt-1">
                {editing.meta_description.length}/160 caracteres
              </p>
            </div>

            <div>
              <label className="label">Conteúdo do artigo</label>
              <textarea
                className="input min-h-64 font-mono text-sm"
                value={editing.content}
                maxLength={50000}
                onChange={(e) =>
                  setEditing({ ...editing, content: e.target.value })
                }
                placeholder="Texto completo do artigo. Mínimo 100 caracteres. Escreva em parágrafos — o conteúdo será formatado automaticamente."
              />
              <p className="text-xs text-brand-ink/55 mt-1">
                {editing.content.split(/\s+/).filter(Boolean).length} palavras
                {" — "}
                {Math.max(
                  1,
                  Math.round(
                    editing.content.split(/\s+/).filter(Boolean).length / 200
                  )
                )}{" "}
                min de leitura
              </p>
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs text-amber-900">
                <strong>Revisão obrigatória:</strong> seu artigo será revisado
                pela equipe AdvAqui antes de ser publicado. Artigos com conteúdo
                promocional, promessa de resultado ou linguagem fora do padrão
                ético podem ser recusados.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={submit}
                disabled={saving}
                className="btn-primary"
                type="button"
              >
                <Send className="w-4 h-4" aria-hidden />
                {saving
                  ? "Enviando..."
                  : editing.id
                    ? "Reenviar para revisão"
                    : "Enviar para revisão"}
              </button>
              <button
                onClick={() => setEditing(null)}
                className="btn-ghost border border-brand-line"
                type="button"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
