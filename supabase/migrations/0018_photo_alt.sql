-- =============================================================================
-- Migration 0018 — Julho/2026 — Alt-text descritivo das fotos de advogados
-- =============================================================================
-- Adiciona coluna à tabela `lawyers` para o cron de alt-text de fotos
-- (app/api/cron/photo-alt-text):
--
--   alt_text — texto alternativo descritivo curto da foto de perfil
--              (acessibilidade + SEO de imagem). Ex.:
--              "Advogada em escritório, blazer azul — Maria Silva".
--
-- O código tolera a ausência desta coluna (log + segue), então esta migration
-- pode ser aplicada a qualquer momento sem quebrar o site. Sem a coluna, o
-- site continua usando o alt padrão "Foto de {nome}".
--
-- Como rodar: cole no SQL Editor do Supabase → Run.
-- =============================================================================

ALTER TABLE public.lawyers
  ADD COLUMN IF NOT EXISTS alt_text text;

-- Índice parcial: o cron busca advogados com foto e ainda sem alt_text —
-- um subconjunto que encolhe a cada execução.
CREATE INDEX IF NOT EXISTS lawyers_photo_alt_pending_idx
  ON public.lawyers (created_at)
  WHERE photo_url IS NOT NULL AND alt_text IS NULL;
