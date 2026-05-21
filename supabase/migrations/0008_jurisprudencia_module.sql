-- =============================================================================
-- Migration 0008 — Maio/2026 — Módulo Jurisprudência (Portal Jurídico AdvAqui)
-- =============================================================================
-- Cria estrutura pra módulo público de Jurisprudência STF/STJ + camadas futuras
-- (modelos, peças, diários, temas). Apenas Jurisprudência é implementada nesta
-- fase. Outras camadas ficam preparadas via convenções de nomenclatura.
--
-- IMPORTANTE — princípio de armazenamento:
--   • Sempre salvar metadados + ementa (texto curto)
--   • Inteiro teor vai SEMPRE em tabela separada de CACHE com TTL 7 dias
--   • Cleanup diário apaga cache expirado mas mantém ementa/metadados
--   • Nada permanente automaticamente
--
-- Como rodar: cole este arquivo no SQL Editor do Supabase → Run.
-- =============================================================================

-- =====================================================================
-- 1) Tabela principal: jurisprudencia_decisoes
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.jurisprudencia_decisoes (
  id              BIGSERIAL PRIMARY KEY,
  tribunal        TEXT NOT NULL CHECK (tribunal IN ('STF', 'STJ')),
  classe          TEXT,
  numero          TEXT NOT NULL,
  processo        TEXT,
  relator         TEXT,
  orgao_julgador  TEXT,
  data_julgamento DATE,
  data_publicacao DATE,
  ementa          TEXT NOT NULL,
  tese            TEXT,
  resumo_informativo TEXT,    -- gerado pelo AdvAqui, opcional
  temas           TEXT[] NOT NULL DEFAULT '{}',
  palavras_chave  TEXT[] NOT NULL DEFAULT '{}',
  area_relacionada TEXT,
  url_origem      TEXT NOT NULL UNIQUE,
  slug            TEXT NOT NULL UNIQUE,
  hash_conteudo   TEXT,
  seo_title       TEXT,
  seo_description TEXT,
  status          TEXT NOT NULL DEFAULT 'publicado'
    CHECK (status IN ('publicado', 'rascunho', 'arquivado', 'removido')),
  indexavel       BOOLEAN NOT NULL DEFAULT TRUE,
  motivo_noindex  TEXT,
  busca_tsv       TSVECTOR,
  criado_em       TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em   TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.jurisprudencia_decisoes IS
  'Decisões jurídicas (STF, STJ) — apenas metadados + ementa. Inteiro teor vai em cache separado.';
COMMENT ON COLUMN public.jurisprudencia_decisoes.resumo_informativo IS
  'Resumo opcional gerado pelo AdvAqui. Sempre rotulado como tal nas páginas.';
COMMENT ON COLUMN public.jurisprudencia_decisoes.busca_tsv IS
  'Vetor de busca full-text PT-BR. Atualizado por trigger.';

-- =====================================================================
-- 2) Cache temporário do inteiro teor (NUNCA permanente)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.jurisprudencia_inteiro_teor_cache (
  id              BIGSERIAL PRIMARY KEY,
  decisao_id      BIGINT NOT NULL REFERENCES public.jurisprudencia_decisoes(id) ON DELETE CASCADE,
  inteiro_teor    TEXT NOT NULL,
  fonte_url       TEXT NOT NULL,
  baixado_em      TIMESTAMPTZ NOT NULL DEFAULT now(),
  ultimo_acesso   TIMESTAMPTZ NOT NULL DEFAULT now(),
  total_acessos   INT NOT NULL DEFAULT 0,
  expira_em       TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '7 days'),
  status          TEXT NOT NULL DEFAULT 'ativo'
    CHECK (status IN ('ativo', 'expirado', 'falha')),
  tamanho_bytes   INT,
  hash_inteiro_teor TEXT,
  criado_em       TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (decisao_id)
);

COMMENT ON TABLE public.jurisprudencia_inteiro_teor_cache IS
  'Cache temporário do inteiro teor. TTL padrão 7 dias. Cleanup diário remove expirados.';
COMMENT ON COLUMN public.jurisprudencia_inteiro_teor_cache.expira_em IS
  'Timestamp de expiração. Cleanup remove cache quando expira_em < now().';

-- =====================================================================
-- 3) Logs de coleta
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.jurisprudencia_coleta_logs (
  id BIGSERIAL PRIMARY KEY,
  fonte TEXT NOT NULL,                       -- ex: 'stf-portal', 'stj-scon'
  tribunal TEXT NOT NULL CHECK (tribunal IN ('STF', 'STJ')),
  status TEXT NOT NULL CHECK (status IN ('iniciado', 'sucesso', 'erro', 'parcial')),
  mensagem TEXT,
  quantidade_encontrada INT NOT NULL DEFAULT 0,
  quantidade_inserida INT NOT NULL DEFAULT 0,
  quantidade_atualizada INT NOT NULL DEFAULT 0,
  quantidade_erro INT NOT NULL DEFAULT 0,
  iniciado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  finalizado_em TIMESTAMPTZ,
  detalhes JSONB
);

-- =====================================================================
-- 4) Temas programáticos (para futuras páginas /jurisprudencia/temas/[slug])
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.jurisprudencia_temas (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  descricao TEXT,
  area_relacionada TEXT,
  termos_busca TEXT[] NOT NULL DEFAULT '{}',
  indexavel BOOLEAN NOT NULL DEFAULT FALSE,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 5) Tabela genérica de redirects SEO (preparação pra portal completo)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.seo_redirects (
  id BIGSERIAL PRIMARY KEY,
  old_path TEXT NOT NULL UNIQUE,
  new_path TEXT NOT NULL,
  status_code INT NOT NULL DEFAULT 301 CHECK (status_code IN (301, 302, 307, 308)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 6) Índices
-- =====================================================================

-- Decisões — full-text + filtros frequentes
CREATE INDEX IF NOT EXISTS jurisprudencia_decisoes_busca_tsv_idx
  ON public.jurisprudencia_decisoes USING GIN (busca_tsv);
CREATE INDEX IF NOT EXISTS jurisprudencia_decisoes_temas_idx
  ON public.jurisprudencia_decisoes USING GIN (temas);
CREATE INDEX IF NOT EXISTS jurisprudencia_decisoes_palavras_chave_idx
  ON public.jurisprudencia_decisoes USING GIN (palavras_chave);
CREATE INDEX IF NOT EXISTS jurisprudencia_decisoes_tribunal_julg_idx
  ON public.jurisprudencia_decisoes (tribunal, data_julgamento DESC);
CREATE INDEX IF NOT EXISTS jurisprudencia_decisoes_tribunal_pub_idx
  ON public.jurisprudencia_decisoes (tribunal, data_publicacao DESC);
CREATE INDEX IF NOT EXISTS jurisprudencia_decisoes_relator_idx
  ON public.jurisprudencia_decisoes (relator);
CREATE INDEX IF NOT EXISTS jurisprudencia_decisoes_classe_idx
  ON public.jurisprudencia_decisoes (classe);
CREATE INDEX IF NOT EXISTS jurisprudencia_decisoes_area_idx
  ON public.jurisprudencia_decisoes (area_relacionada)
  WHERE area_relacionada IS NOT NULL;
CREATE INDEX IF NOT EXISTS jurisprudencia_decisoes_indexavel_idx
  ON public.jurisprudencia_decisoes (indexavel, status)
  WHERE indexavel = TRUE AND status = 'publicado';
CREATE INDEX IF NOT EXISTS jurisprudencia_decisoes_hash_idx
  ON public.jurisprudencia_decisoes (hash_conteudo)
  WHERE hash_conteudo IS NOT NULL;

-- Cache
CREATE INDEX IF NOT EXISTS jurisprudencia_cache_decisao_idx
  ON public.jurisprudencia_inteiro_teor_cache (decisao_id);
CREATE INDEX IF NOT EXISTS jurisprudencia_cache_expira_idx
  ON public.jurisprudencia_inteiro_teor_cache (expira_em)
  WHERE status = 'ativo';
CREATE INDEX IF NOT EXISTS jurisprudencia_cache_ultimo_acesso_idx
  ON public.jurisprudencia_inteiro_teor_cache (ultimo_acesso DESC);

-- Logs
CREATE INDEX IF NOT EXISTS jurisprudencia_logs_tribunal_idx
  ON public.jurisprudencia_coleta_logs (tribunal, iniciado_em DESC);

-- Temas
CREATE INDEX IF NOT EXISTS jurisprudencia_temas_indexavel_idx
  ON public.jurisprudencia_temas (indexavel)
  WHERE indexavel = TRUE;
CREATE INDEX IF NOT EXISTS jurisprudencia_temas_termos_idx
  ON public.jurisprudencia_temas USING GIN (termos_busca);

-- =====================================================================
-- 7) Função e trigger para atualizar busca_tsv automaticamente
-- =====================================================================
-- Pesos:
--   A — ementa, tese, resumo_informativo, temas (mais relevante)
--   B — relator, número, processo, palavras_chave
--   C — classe, tribunal, órgão julgador
CREATE OR REPLACE FUNCTION public.jurisprudencia_decisoes_tsv_trigger()
RETURNS trigger AS $$
BEGIN
  NEW.busca_tsv :=
    setweight(to_tsvector('portuguese', coalesce(NEW.ementa, '')), 'A') ||
    setweight(to_tsvector('portuguese', coalesce(NEW.tese, '')), 'A') ||
    setweight(to_tsvector('portuguese', coalesce(NEW.resumo_informativo, '')), 'A') ||
    setweight(to_tsvector('portuguese', coalesce(array_to_string(NEW.temas, ' '), '')), 'A') ||
    setweight(to_tsvector('portuguese', coalesce(NEW.relator, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(NEW.numero, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(NEW.processo, '')), 'B') ||
    setweight(to_tsvector('portuguese', coalesce(array_to_string(NEW.palavras_chave, ' '), '')), 'B') ||
    setweight(to_tsvector('portuguese', coalesce(NEW.classe, '')), 'C') ||
    setweight(to_tsvector('simple', coalesce(NEW.tribunal, '')), 'C') ||
    setweight(to_tsvector('portuguese', coalesce(NEW.orgao_julgador, '')), 'C');

  NEW.atualizado_em := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS jurisprudencia_decisoes_tsv_update
  ON public.jurisprudencia_decisoes;
CREATE TRIGGER jurisprudencia_decisoes_tsv_update
  BEFORE INSERT OR UPDATE ON public.jurisprudencia_decisoes
  FOR EACH ROW EXECUTE FUNCTION public.jurisprudencia_decisoes_tsv_trigger();

-- =====================================================================
-- 8) Trigger pra atualizado_em nas outras tabelas
-- =====================================================================
-- Reusa função set_updated_at_timestamp criada na migration 0006.
-- Se não existe (cenário improvável), recria.
CREATE OR REPLACE FUNCTION public.set_updated_at_timestamp()
RETURNS trigger AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS jurisprudencia_cache_updated_at ON public.jurisprudencia_inteiro_teor_cache;
CREATE TRIGGER jurisprudencia_cache_updated_at
  BEFORE UPDATE ON public.jurisprudencia_inteiro_teor_cache
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();

DROP TRIGGER IF EXISTS jurisprudencia_temas_updated_at ON public.jurisprudencia_temas;
CREATE TRIGGER jurisprudencia_temas_updated_at
  BEFORE UPDATE ON public.jurisprudencia_temas
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();

-- =====================================================================
-- 9) Row Level Security
-- =====================================================================
ALTER TABLE public.jurisprudencia_decisoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jurisprudencia_inteiro_teor_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jurisprudencia_coleta_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jurisprudencia_temas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_redirects ENABLE ROW LEVEL SECURITY;

-- Leitura pública das decisões publicadas + indexáveis
DROP POLICY IF EXISTS "jurisprudencia_decisoes_public_read" ON public.jurisprudencia_decisoes;
CREATE POLICY "jurisprudencia_decisoes_public_read"
  ON public.jurisprudencia_decisoes FOR SELECT
  USING (status = 'publicado');

-- Cache: leitura pública (qualquer um pode pedir inteiro teor)
DROP POLICY IF EXISTS "jurisprudencia_cache_public_read" ON public.jurisprudencia_inteiro_teor_cache;
CREATE POLICY "jurisprudencia_cache_public_read"
  ON public.jurisprudencia_inteiro_teor_cache FOR SELECT
  USING (status = 'ativo');

-- Escrita só via service_role (coletor Python + Next.js admin)
DROP POLICY IF EXISTS "jurisprudencia_decisoes_service_write" ON public.jurisprudencia_decisoes;
CREATE POLICY "jurisprudencia_decisoes_service_write"
  ON public.jurisprudencia_decisoes FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "jurisprudencia_cache_service_write" ON public.jurisprudencia_inteiro_teor_cache;
CREATE POLICY "jurisprudencia_cache_service_write"
  ON public.jurisprudencia_inteiro_teor_cache FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "jurisprudencia_logs_service_all" ON public.jurisprudencia_coleta_logs;
CREATE POLICY "jurisprudencia_logs_service_all"
  ON public.jurisprudencia_coleta_logs FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "jurisprudencia_temas_public_read" ON public.jurisprudencia_temas;
CREATE POLICY "jurisprudencia_temas_public_read"
  ON public.jurisprudencia_temas FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS "jurisprudencia_temas_service_write" ON public.jurisprudencia_temas;
CREATE POLICY "jurisprudencia_temas_service_write"
  ON public.jurisprudencia_temas FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "seo_redirects_service_all" ON public.seo_redirects;
CREATE POLICY "seo_redirects_service_all"
  ON public.seo_redirects FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- =====================================================================
-- 10) Fixtures (5 decisões sintéticas) — só pra validar o pipeline
-- =====================================================================
-- IMPORTANTE: estes são exemplos sintéticos rotulados como "amostra do
-- AdvAqui pra validação do sistema". Não substituem fontes oficiais.
-- Quando o coletor real rodar, dados oficiais sobrescrevem via UPSERT.

INSERT INTO public.jurisprudencia_decisoes
  (tribunal, classe, numero, processo, relator, orgao_julgador,
   data_julgamento, data_publicacao, ementa, tese, temas, palavras_chave,
   area_relacionada, url_origem, slug, seo_title, seo_description, status, indexavel)
VALUES
  ('STJ', 'REsp', '0000000-00.0000.0.00.0000', 'REsp 0000000', 'Min. (amostra AdvAqui)', 'Quarta Turma',
   '2026-01-15', '2026-01-22',
   'AMOSTRA AdvAqui — texto sintético para validação do sistema. Dano moral por inscrição indevida em cadastro de inadimplentes. Recurso conhecido e provido.',
   'A inscrição indevida em cadastro de inadimplentes configura dano moral in re ipsa.',
   ARRAY['dano moral', 'cadastro de inadimplentes', 'spc serasa'],
   ARRAY['inscrição indevida', 'in re ipsa', 'consumidor'],
   'Direito do Consumidor',
   'https://example.invalid/amostra-advaqui-stj-resp-1',
   'resp-amostra-1-dano-moral-cadastro-inadimplentes',
   'AMOSTRA REsp — Dano moral em cadastro de inadimplentes',
   'Amostra de decisão sintética usada para validação do sistema AdvAqui. Não é decisão real.',
   'publicado', FALSE),

  ('STJ', 'AgInt no REsp', '0000000-00.0000.0.00.0000', 'AgInt no REsp 0000000', 'Min. (amostra AdvAqui)', 'Terceira Turma',
   '2026-02-10', '2026-02-17',
   'AMOSTRA AdvAqui — texto sintético. Plano de saúde. Negativa de cobertura. Tratamento prescrito por médico. Súmula 102 STJ.',
   'A operadora não pode negar cobertura a tratamento expressamente prescrito.',
   ARRAY['plano de saúde', 'negativa de cobertura'],
   ARRAY['súmula 102', 'tratamento', 'cobertura'],
   'Direito do Consumidor',
   'https://example.invalid/amostra-advaqui-stj-agint-2',
   'agint-amostra-2-plano-de-saude-negativa-cobertura',
   'AMOSTRA AgInt — Plano de saúde negativa de cobertura',
   'Amostra de decisão sintética usada para validação do sistema AdvAqui. Não é decisão real.',
   'publicado', FALSE),

  ('STF', 'HC', '0000000', 'HC 0000000', 'Min. (amostra AdvAqui)', 'Primeira Turma',
   '2026-03-05', '2026-03-12',
   'AMOSTRA AdvAqui — texto sintético. Habeas corpus. Prisão preventiva. Ausência de fundamentação concreta. Ordem concedida.',
   'A decisão de prisão preventiva exige fundamentação concreta e individualizada.',
   ARRAY['habeas corpus', 'prisão preventiva', 'fundamentação concreta'],
   ARRAY['individualização', 'art. 312 cpp'],
   'Direito Criminal',
   'https://example.invalid/amostra-advaqui-stf-hc-3',
   'hc-amostra-3-prisao-preventiva-fundamentacao-concreta',
   'AMOSTRA HC — Prisão preventiva sem fundamentação concreta',
   'Amostra de decisão sintética usada para validação do sistema AdvAqui. Não é decisão real.',
   'publicado', FALSE),

  ('STJ', 'REsp', '0000000-00.0000.0.00.0000', 'REsp 0000000', 'Min. (amostra AdvAqui)', 'Segunda Seção',
   '2026-03-20', '2026-03-27',
   'AMOSTRA AdvAqui — texto sintético. Pensão alimentícia. Binômio necessidade-possibilidade. Revisão.',
   'A pensão alimentícia se rege pelo binômio necessidade do alimentando e possibilidade do alimentante.',
   ARRAY['pensão alimentícia', 'alimentos', 'revisão de alimentos'],
   ARRAY['binômio', 'necessidade', 'possibilidade'],
   'Direito de Família',
   'https://example.invalid/amostra-advaqui-stj-resp-4',
   'resp-amostra-4-pensao-alimenticia-binomio-necessidade',
   'AMOSTRA REsp — Pensão alimentícia binômio necessidade',
   'Amostra de decisão sintética usada para validação do sistema AdvAqui. Não é decisão real.',
   'publicado', FALSE),

  ('STF', 'RE', '0000000', 'RE 0000000', 'Min. (amostra AdvAqui)', 'Plenário',
   '2026-04-10', '2026-04-17',
   'AMOSTRA AdvAqui — texto sintético. Repercussão geral. Direito tributário. Tema 1234. Exclusão do ICMS da base de cálculo de PIS/COFINS.',
   'O ICMS não compõe a base de cálculo de PIS e COFINS.',
   ARRAY['repercussão geral', 'icms', 'pis cofins', 'base de cálculo'],
   ARRAY['tema 1234', 'exclusão', 'tributário'],
   'Direito Tributário',
   'https://example.invalid/amostra-advaqui-stf-re-5',
   're-amostra-5-icms-base-pis-cofins-repercussao-geral',
   'AMOSTRA RE — ICMS na base de PIS/COFINS (Tema 1234)',
   'Amostra de decisão sintética usada para validação do sistema AdvAqui. Não é decisão real.',
   'publicado', FALSE)
ON CONFLICT (url_origem) DO NOTHING;

-- Temas iniciais (não-indexáveis ainda — serão indexáveis quando tiverem 10+ decisões)
INSERT INTO public.jurisprudencia_temas (slug, nome, area_relacionada, termos_busca, indexavel)
VALUES
  ('dano-moral', 'Dano moral', 'Direito Civil', ARRAY['dano moral', 'in re ipsa'], FALSE),
  ('plano-de-saude', 'Plano de saúde', 'Direito do Consumidor', ARRAY['plano de saúde', 'cobertura', 'súmula 102'], FALSE),
  ('prisao-preventiva', 'Prisão preventiva', 'Direito Criminal', ARRAY['prisão preventiva', 'fundamentação', 'art. 312'], FALSE),
  ('pensao-alimenticia', 'Pensão alimentícia', 'Direito de Família', ARRAY['pensão alimentícia', 'binômio', 'alimentos'], FALSE),
  ('habeas-corpus', 'Habeas corpus', 'Direito Criminal', ARRAY['habeas corpus', 'hc'], FALSE),
  ('aposentadoria', 'Aposentadoria', 'Direito Previdenciário', ARRAY['aposentadoria', 'rgps', 'inss'], FALSE),
  ('rescisao-indireta', 'Rescisão indireta', 'Direito Trabalhista', ARRAY['rescisão indireta', 'falta grave do empregador'], FALSE),
  ('execucao-fiscal', 'Execução fiscal', 'Direito Tributário', ARRAY['execução fiscal', 'lei 6830'], FALSE),
  ('improbidade-administrativa', 'Improbidade administrativa', 'Direito Administrativo', ARRAY['improbidade', 'lei 8429'], FALSE),
  ('repercussao-geral', 'Repercussão geral', 'Constitucional', ARRAY['repercussão geral', 'tema'], FALSE)
ON CONFLICT (slug) DO NOTHING;

-- =============================================================================
-- FIM da migration 0008.
-- =============================================================================
