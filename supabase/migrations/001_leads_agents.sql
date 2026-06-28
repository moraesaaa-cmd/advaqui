-- Migration: 001_leads_agents
-- AdvAqui - Leads, Agent Logs, Agent Configs, Site Audits
-- Created: 2026-06-28

-- =============================================================
-- 1. LEADS
-- =============================================================
CREATE TABLE IF NOT EXISTS leads (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),
  nome            TEXT,
  telefone        TEXT,
  email           TEXT,
  cidade          TEXT,
  uf              CHAR(2),
  area_juridica   TEXT,
  resumo          TEXT,
  origem          TEXT,
  ferramenta      TEXT,
  status          TEXT        DEFAULT 'novo'
                              CHECK (status IN (
                                'novo','em_analise','contato_realizado',
                                'aguardando_docs','proposta_enviada',
                                'contratado','perdido','arquivado'
                              )),
  prioridade      TEXT        DEFAULT 'normal'
                              CHECK (prioridade IN ('baixa','normal','alta','urgente')),
  responsavel     TEXT,
  observacoes     TEXT,
  etiquetas       TEXT[]      DEFAULT '{}',
  proxima_acao    TEXT,
  ai_resumo       TEXT,
  ai_area         TEXT,
  ai_score        INTEGER     CHECK (ai_score >= 0 AND ai_score <= 100),
  metadata        JSONB       DEFAULT '{}'::jsonb
);

-- =============================================================
-- 2. AGENT_LOGS
-- =============================================================
CREATE TABLE IF NOT EXISTS agent_logs (
  id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at       TIMESTAMPTZ DEFAULT now(),
  agent_name       TEXT        NOT NULL,
  action           TEXT        NOT NULL,
  status           TEXT        DEFAULT 'success'
                               CHECK (status IN ('success','error','skipped','blocked')),
  details          JSONB       DEFAULT '{}'::jsonb,
  items_processed  INTEGER     DEFAULT 0,
  tokens_used      INTEGER     DEFAULT 0,
  cost_usd         NUMERIC(10,6) DEFAULT 0,
  duration_ms      INTEGER     DEFAULT 0
);

-- =============================================================
-- 3. AGENT_CONFIGS
-- =============================================================
CREATE TABLE IF NOT EXISTS agent_configs (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_name    TEXT        UNIQUE NOT NULL,
  display_name  TEXT        NOT NULL,
  description   TEXT,
  enabled       BOOLEAN     DEFAULT true,
  schedule      TEXT,
  last_run      TIMESTAMPTZ,
  total_runs    INTEGER     DEFAULT 0,
  total_tokens  INTEGER     DEFAULT 0,
  total_cost    NUMERIC(10,4) DEFAULT 0,
  settings      JSONB       DEFAULT '{}'::jsonb,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- =============================================================
-- 4. SITE_AUDITS
-- =============================================================
CREATE TABLE IF NOT EXISTS site_audits (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT now(),
  audit_type  TEXT        NOT NULL,
  url         TEXT,
  status      TEXT        DEFAULT 'ok'
                          CHECK (status IN ('ok','warning','error','critical')),
  details     JSONB       DEFAULT '{}'::jsonb,
  resolved    BOOLEAN     DEFAULT false,
  resolved_at TIMESTAMPTZ
);

-- =============================================================
-- 5. INDEXES
-- =============================================================
CREATE INDEX IF NOT EXISTS idx_leads_status        ON leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at    ON leads (created_at);
CREATE INDEX IF NOT EXISTS idx_leads_area_juridica ON leads (area_juridica);

CREATE INDEX IF NOT EXISTS idx_agent_logs_agent_name ON agent_logs (agent_name);
CREATE INDEX IF NOT EXISTS idx_agent_logs_created_at ON agent_logs (created_at);

CREATE INDEX IF NOT EXISTS idx_site_audits_status ON site_audits (status);

-- =============================================================
-- 6. UPDATED_AT TRIGGER (leads)
-- =============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_leads_updated_at ON leads;
CREATE TRIGGER trg_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- =============================================================
-- 7. ROW LEVEL SECURITY
-- =============================================================
ALTER TABLE leads         ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_logs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_audits   ENABLE ROW LEVEL SECURITY;

-- service_role full access
CREATE POLICY service_role_leads ON leads
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY service_role_agent_logs ON agent_logs
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY service_role_agent_configs ON agent_configs
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY service_role_site_audits ON site_audits
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =============================================================
-- 8. SEED DATA: agent_configs
-- =============================================================
INSERT INTO agent_configs (agent_name, display_name, description, enabled, schedule, settings)
VALUES
  (
    'seo_guardian',
    'SEO Guardian',
    'Monitora meta tags, sitemap, links quebrados e Core Web Vitals',
    true,
    '0 3 * * *',
    '{"check_meta": true, "check_sitemap": true, "check_broken_links": true, "check_cwv": true}'::jsonb
  ),
  (
    'content_monitor',
    'Content Monitor',
    'Verifica paginas com conteudo ausente, duplicado ou desatualizado',
    true,
    '0 4 * * *',
    '{"min_word_count": 300, "check_duplicates": true, "stale_days": 90}'::jsonb
  ),
  (
    'lead_analyzer',
    'Lead Analyzer',
    'Analisa leads recebidos com IA, classifica area juridica e atribui score',
    true,
    '*/15 * * * *',
    '{"model": "claude-sonnet-4-20250514", "auto_assign": false, "score_threshold": 60}'::jsonb
  ),
  (
    'article_publisher',
    'Article Publisher',
    'Publica artigos agendados e atualiza sitemap',
    true,
    '0 8 * * 1-5',
    '{"max_per_day": 3, "auto_sitemap": true, "notify_on_publish": true}'::jsonb
  ),
  (
    'article_enhancer',
    'Article Enhancer',
    'Melhora artigos existentes com links internos, FAQs e schema markup',
    true,
    '0 5 * * 3',
    '{"add_internal_links": true, "add_faq_schema": true, "max_articles_per_run": 10}'::jsonb
  ),
  (
    'faq_generator',
    'FAQ Generator',
    'Gera perguntas frequentes a partir de buscas e leads recebidos',
    true,
    '0 6 * * 0',
    '{"min_search_volume": 10, "max_faqs_per_run": 20, "auto_publish": false}'::jsonb
  )
ON CONFLICT (agent_name) DO NOTHING;
