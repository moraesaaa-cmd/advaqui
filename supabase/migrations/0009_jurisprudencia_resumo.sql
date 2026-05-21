-- =============================================================================
-- Migration 0009 — Maio/2026 — Resumo informativo da jurisprudência + fonte clara
-- =============================================================================
-- Adiciona campos pra resumo conservador (extraído da ementa, não-LLM) e
-- metadados detalhados da fonte oficial (Portal de Dados Abertos).
--
-- Princípio: sem campos obrigatórios novos, todos opcionais. Não quebra
-- registros existentes — código defensivo já trata NULL.
-- =============================================================================

-- Resumo informativo (gerado a partir da própria ementa + tese)
ALTER TABLE public.jurisprudencia_decisoes
  ADD COLUMN IF NOT EXISTS resumo_tema           TEXT,
  ADD COLUMN IF NOT EXISTS resumo_decisao        TEXT,
  ADD COLUMN IF NOT EXISTS resumo_entendimento   TEXT,
  ADD COLUMN IF NOT EXISTS resumo_pontos         TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS resumo_gerado_em      TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS resumo_versao         TEXT,
  ADD COLUMN IF NOT EXISTS resumo_status         TEXT
    CHECK (resumo_status IS NULL OR resumo_status IN ('gerado','indisponivel','revisar','erro'));

COMMENT ON COLUMN public.jurisprudencia_decisoes.resumo_tema IS
  'Tema principal da decisão, extraído conservadoramente da ementa.';
COMMENT ON COLUMN public.jurisprudencia_decisoes.resumo_decisao IS
  'Resumo curto do que foi decidido, em linguagem clara, sem alucinação.';
COMMENT ON COLUMN public.jurisprudencia_decisoes.resumo_entendimento IS
  'Entendimento extraído da ementa, sempre prefixado com "A ementa indica que..." ou similar.';
COMMENT ON COLUMN public.jurisprudencia_decisoes.resumo_pontos IS
  'Lista de 3-5 pontos relevantes extraídos da ementa.';
COMMENT ON COLUMN public.jurisprudencia_decisoes.resumo_status IS
  'gerado | indisponivel | revisar | erro';

-- Metadados de fonte para exibição clara na UI (Portal de Dados Abertos)
ALTER TABLE public.jurisprudencia_decisoes
  ADD COLUMN IF NOT EXISTS source_portal        TEXT,
  ADD COLUMN IF NOT EXISTS dataset_name         TEXT,
  ADD COLUMN IF NOT EXISTS dataset_url          TEXT,
  ADD COLUMN IF NOT EXISTS resource_name        TEXT,
  ADD COLUMN IF NOT EXISTS resource_url         TEXT,
  ADD COLUMN IF NOT EXISTS source_format        TEXT;

COMMENT ON COLUMN public.jurisprudencia_decisoes.source_portal IS
  'Ex.: "Portal de Dados Abertos do STJ"';
COMMENT ON COLUMN public.jurisprudencia_decisoes.dataset_url IS
  'URL pública do conjunto de dados no Portal de Dados Abertos.';
COMMENT ON COLUMN public.jurisprudencia_decisoes.resource_url IS
  'URL do arquivo JSON oficial (download técnico).';

-- Índice pra listagem com resumo
CREATE INDEX IF NOT EXISTS jurisprudencia_decisoes_resumo_status_idx
  ON public.jurisprudencia_decisoes (resumo_status)
  WHERE resumo_status IS NOT NULL;

-- =============================================================================
-- FIM da migration 0009.
-- =============================================================================
