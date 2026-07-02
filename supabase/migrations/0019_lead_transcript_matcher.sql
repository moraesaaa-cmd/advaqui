-- Migration: 0019_lead_transcript_matcher
-- AdvAqui — transcript do chatbot no lead + status 'qualificado' do lead-matcher
-- Created: 2026-07-02
--
-- Contexto:
--  (1) O diálogo do chatbot (Marina) nunca era persistido — só um resumo curto.
--      A coluna transcript guarda o array [{role, content, ts}] completo para
--      exibição em /admin/leads.
--  (2) O cron lead-matcher gravava status 'qualificado', valor que a CHECK
--      constraint original rejeitava — o UPDATE falhava em 100% das execuções
--      em silêncio. A constraint agora aceita o valor.

-- 1. Transcript do chatbot
ALTER TABLE leads ADD COLUMN IF NOT EXISTS transcript JSONB;
COMMENT ON COLUMN leads.transcript IS 'Diálogo completo lead x chatbot Marina — array de {role, content, ts}';

-- 2. Status 'qualificado' (usado pelo cron lead-matcher)
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_status_check;
ALTER TABLE leads ADD CONSTRAINT leads_status_check CHECK (status IN (
  'novo','qualificado','em_analise','contato_realizado',
  'aguardando_docs','proposta_enviada',
  'contratado','perdido','arquivado'
));
