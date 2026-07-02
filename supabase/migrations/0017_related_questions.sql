-- =============================================================================
-- Migration 0017 — Julho/2026 — Perguntas relacionadas por artigo do blog
-- =============================================================================
-- Adiciona coluna à tabela `blog_articles` para o cron de perguntas
-- relacionadas (app/api/cron/article-related-questions):
--
--   related_questions — jsonb, array de objetos { "question": "...", "answer": "..." }
--                       (3-4 Q&A curtas derivadas do próprio conteúdo do artigo,
--                       renderizadas em /blog/[slug] como <details> + FAQPage JSON-LD)
--
-- O código tolera a ausência desta coluna (log + segue), então esta migration
-- pode ser aplicada a qualquer momento sem quebrar o site.
--
-- Como rodar: cole no SQL Editor do Supabase → Run.
-- =============================================================================

ALTER TABLE public.blog_articles
  ADD COLUMN IF NOT EXISTS related_questions jsonb;

-- Índice parcial: o cron busca artigos published ainda sem perguntas — um
-- subconjunto que encolhe a cada execução.
CREATE INDEX IF NOT EXISTS blog_articles_related_questions_pending_idx
  ON public.blog_articles (published_at)
  WHERE related_questions IS NULL AND status = 'published';
