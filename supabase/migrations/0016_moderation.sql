-- =============================================================================
-- Migration 0016 — Julho/2026 — Moderação automática de cadastros
-- =============================================================================
-- Adiciona colunas à tabela `lawyers` para o cron de moderação de cadastros
-- suspeitos (app/api/cron/moderate-signups):
--
--   moderation_status — 'ok' | 'suspect' | NULL (NULL = ainda não moderado)
--   moderation_note   — motivo curto quando suspect (uso interno/admin)
--
-- O código tolera a ausência dessas colunas (log + segue), então esta
-- migration pode ser aplicada a qualquer momento sem quebrar o site.
--
-- Como rodar: cole no SQL Editor do Supabase → Run.
-- =============================================================================

ALTER TABLE public.lawyers
  ADD COLUMN IF NOT EXISTS moderation_status text
    CHECK (moderation_status IN ('ok', 'suspect'));

ALTER TABLE public.lawyers
  ADD COLUMN IF NOT EXISTS moderation_note text;

-- Índice parcial: o cron busca cadastros ainda não moderados; o admin filtra
-- os suspeitos. Ambos são subconjuntos pequenos da tabela.
CREATE INDEX IF NOT EXISTS lawyers_moderation_status_idx
  ON public.lawyers (moderation_status)
  WHERE moderation_status IS NOT NULL;
