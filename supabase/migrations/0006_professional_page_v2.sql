-- =============================================================================
-- Migration 0006 — Maio/2026 — Página Profissional AdvAqui — Fase 2/3
-- =============================================================================
-- Esta migration prepara o banco pra próxima rodada do recurso "Página
-- Profissional". Não é aplicada automaticamente — o usuário roda manualmente
-- no SQL Editor do Supabase quando estiver pronto pra liberar os recursos
-- de Pausar/Republicar, Artigos próprios e Perguntas de Leitores.
--
-- O código TypeScript atual NÃO depende dessas colunas/tabelas. O mapper em
-- lib/data/lawyer-mapper.ts trata todos os campos novos como opcionais — se
-- a migration ainda não foi aplicada, simplesmente vêm undefined e os
-- recursos aparecem como "em desenvolvimento" no painel.
--
-- Como rodar: cole este arquivo inteiro no SQL Editor do Supabase
-- (https://supabase.com → projeto → SQL Editor → New query → cola → Run).
-- =============================================================================

-- =====================================================================
-- 1) Novas colunas em public.lawyers (controle de publicação + apresentação)
-- =====================================================================
ALTER TABLE public.lawyers
  -- Controle de publicação
  ADD COLUMN IF NOT EXISTS page_status text NOT NULL DEFAULT 'not_configured'
    CHECK (page_status IN (
      'not_configured',  -- usuário ainda não preencheu nada
      'incomplete',      -- faltam campos obrigatórios pra publicar
      'draft',           -- rascunho salvo mas não publicado
      'published',       -- publicado e visível
      'paused',          -- pausado pelo próprio advogado
      'review',          -- em revisão por algo (pagamento, OAB, denúncia)
      'suspended'        -- suspenso pelo admin (violação)
    )),
  ADD COLUMN IF NOT EXISTS is_indexable boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS last_published_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_unpublished_at timestamptz,
  ADD COLUMN IF NOT EXISTS paused_at timestamptz,
  ADD COLUMN IF NOT EXISTS paused_reason text,
  ADD COLUMN IF NOT EXISTS suspension_reason text,
  -- Conteúdo profissional
  ADD COLUMN IF NOT EXISTS short_summary text,           -- 160 chars no topo
  ADD COLUMN IF NOT EXISTS primary_specialties text[] NOT NULL DEFAULT '{}', -- até 3
  ADD COLUMN IF NOT EXISTS service_modalities text[] NOT NULL DEFAULT '{}',  -- ['in_person','online']
  ADD COLUMN IF NOT EXISTS service_region text,          -- "Almenara/MG e região"
  ADD COLUMN IF NOT EXISTS preferred_contact text
    CHECK (preferred_contact IS NULL OR preferred_contact IN ('whatsapp','phone','email')),
  -- Aparência / display preferences
  ADD COLUMN IF NOT EXISTS show_address boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_address_full boolean NOT NULL DEFAULT true, -- false = só cidade
  ADD COLUMN IF NOT EXISTS show_email boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_phone boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_extra_cities boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_useful_docs boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_articles boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_questions boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_faqs boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS allow_questions boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS accent_color text NOT NULL DEFAULT 'amber'
    CHECK (accent_color IN ('amber','emerald','blue','rose','slate')),
  ADD COLUMN IF NOT EXISTS header_layout text NOT NULL DEFAULT 'expanded'
    CHECK (header_layout IN ('compact','expanded'));

COMMENT ON COLUMN public.lawyers.page_status IS
  'Status detalhado da Página Profissional. Diferente de plan_status (que controla cobrança). Default not_configured pra cadastros novos.';
COMMENT ON COLUMN public.lawyers.is_indexable IS
  'Quando false, a página é renderizada com noindex (não aparece em buscadores). Útil pra premium pausado.';
COMMENT ON COLUMN public.lawyers.is_public IS
  'Quando false, a página retorna 404/mensagem neutra pra visitantes não-autenticados. Usado em rascunho/pausa/suspensão.';
COMMENT ON COLUMN public.lawyers.paused_at IS
  'Timestamp da última pausa voluntária. Null quando a página não está pausada.';
COMMENT ON COLUMN public.lawyers.short_summary IS
  'Resumo profissional curto, até 160 caracteres. Aparece no topo da Página Profissional, abaixo do nome/OAB.';
COMMENT ON COLUMN public.lawyers.primary_specialties IS
  'Slugs das áreas principais de atuação (até 3). Mostradas em destaque na seção Principais áreas. Demais áreas vão pra Outras áreas informadas.';
COMMENT ON COLUMN public.lawyers.service_modalities IS
  'Modalidades de atendimento — array com in_person e/ou online. Exibido em Atendimento.';
COMMENT ON COLUMN public.lawyers.preferred_contact IS
  'Canal preferencial pra primeiro contato. Mostrado em destaque na seção Atendimento.';

-- =====================================================================
-- 2) Tabela: lawyer_articles (artigos próprios do advogado)
-- =====================================================================
-- Cada advogado premium pode publicar artigos informativos sob seu nome.
-- Linguagem sóbria conforme Provimento OAB 205/2021 — moderação manual.
CREATE TABLE IF NOT EXISTS public.lawyer_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lawyer_id uuid NOT NULL REFERENCES public.lawyers(id) ON DELETE CASCADE,
  slug text NOT NULL,
  title text NOT NULL,
  summary text,
  body text NOT NULL,
  specialty_slug text,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN (
      'draft',       -- rascunho (não visível publicamente)
      'scheduled',   -- agendado pra publicar em scheduled_for
      'published',   -- publicado e visível
      'paused',      -- temporariamente despublicado pelo autor
      'archived',    -- arquivado, fora do ar
      'review',      -- em revisão pelo admin (suspeita de violação)
      'rejected'     -- rejeitado pela moderação
    )),
  scheduled_for timestamptz,
  published_at timestamptz,
  unpublished_at timestamptz,
  reviewed_by text,           -- e-mail do admin que aprovou (se moderado)
  reviewed_at timestamptz,
  word_count int,
  read_time_minutes int,
  view_count int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (lawyer_id, slug)
);

CREATE INDEX IF NOT EXISTS lawyer_articles_lawyer_idx
  ON public.lawyer_articles (lawyer_id, status);
CREATE INDEX IF NOT EXISTS lawyer_articles_published_idx
  ON public.lawyer_articles (published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS lawyer_articles_scheduled_idx
  ON public.lawyer_articles (scheduled_for) WHERE status = 'scheduled';
CREATE INDEX IF NOT EXISTS lawyer_articles_specialty_idx
  ON public.lawyer_articles (specialty_slug) WHERE status = 'published';

COMMENT ON TABLE public.lawyer_articles IS
  'Artigos informativos publicados pelos advogados (Fase 2 da Página Profissional). Moderação manual.';
COMMENT ON COLUMN public.lawyer_articles.scheduled_for IS
  'Quando status=scheduled, momento (timezone America/Sao_Paulo no front) em que vai publicar automaticamente.';
COMMENT ON COLUMN public.lawyer_articles.body IS
  'Corpo do artigo em Markdown ou texto plano. Limite recomendado 50.000 caracteres.';

-- RLS: leitura pública só de artigos published; escrita só pelo autor logado
ALTER TABLE public.lawyer_articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "lawyer_articles_public_read" ON public.lawyer_articles;
CREATE POLICY "lawyer_articles_public_read"
  ON public.lawyer_articles FOR SELECT
  USING (status = 'published');

DROP POLICY IF EXISTS "lawyer_articles_owner_all" ON public.lawyer_articles;
CREATE POLICY "lawyer_articles_owner_all"
  ON public.lawyer_articles FOR ALL
  USING (auth.uid() = lawyer_id)
  WITH CHECK (auth.uid() = lawyer_id);

-- =====================================================================
-- 3) Tabela: lawyer_questions (perguntas de leitores, moderadas)
-- =====================================================================
-- Visitantes podem enviar perguntas pra advogados. Moderação obrigatória.
-- Linguagem sóbria — sem promessas, sem CTAs de "contrate agora".
CREATE TABLE IF NOT EXISTS public.lawyer_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lawyer_id uuid NOT NULL REFERENCES public.lawyers(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text,
  asker_name text,
  asker_email text,
  asker_ip text,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN (
      'pending',     -- aguardando moderação
      'approved',    -- aprovada, aguardando resposta
      'answered',    -- respondida pelo advogado, visível
      'rejected',    -- rejeitada (spam, ofensa, fora de escopo)
      'spam',        -- marcada como spam (ocultada do advogado)
      'hidden'       -- ocultada pelo advogado depois de publicada
    )),
  rejected_reason text,
  answered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lawyer_questions_lawyer_idx
  ON public.lawyer_questions (lawyer_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS lawyer_questions_answered_idx
  ON public.lawyer_questions (answered_at DESC) WHERE status = 'answered';

COMMENT ON TABLE public.lawyer_questions IS
  'Perguntas enviadas por leitores. Moderadas (pendente → aprovada → respondida). Visíveis publicamente só quando answered.';
COMMENT ON COLUMN public.lawyer_questions.asker_email IS
  'E-mail opcional do remetente pra receber notificação quando respondida. Não exibido publicamente.';
COMMENT ON COLUMN public.lawyer_questions.asker_ip IS
  'IP de origem (anti-spam). Pode ser truncado/anonimizado conforme LGPD.';

ALTER TABLE public.lawyer_questions ENABLE ROW LEVEL SECURITY;

-- Leitura pública só das answered
DROP POLICY IF EXISTS "lawyer_questions_public_read" ON public.lawyer_questions;
CREATE POLICY "lawyer_questions_public_read"
  ON public.lawyer_questions FOR SELECT
  USING (status = 'answered');

-- Owner (advogado dono) pode ler tudo, responder, arquivar
DROP POLICY IF EXISTS "lawyer_questions_owner_all" ON public.lawyer_questions;
CREATE POLICY "lawyer_questions_owner_all"
  ON public.lawyer_questions FOR ALL
  USING (auth.uid() = lawyer_id)
  WITH CHECK (auth.uid() = lawyer_id);

-- INSERT público (qualquer um envia pergunta) — controlado por rate limit no endpoint
DROP POLICY IF EXISTS "lawyer_questions_public_insert" ON public.lawyer_questions;
CREATE POLICY "lawyer_questions_public_insert"
  ON public.lawyer_questions FOR INSERT
  WITH CHECK (status = 'pending');

-- =====================================================================
-- 4) Tabela: lawyer_metrics (métricas diárias por advogado)
-- =====================================================================
-- Cada linha = 1 dia × 1 advogado, com contadores. Painel mostra agregados
-- (últimos 7/30 dias) e gráficos simples.
CREATE TABLE IF NOT EXISTS public.lawyer_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lawyer_id uuid NOT NULL REFERENCES public.lawyers(id) ON DELETE CASCADE,
  metric_date date NOT NULL DEFAULT current_date,
  page_views int NOT NULL DEFAULT 0,
  whatsapp_clicks int NOT NULL DEFAULT 0,
  phone_clicks int NOT NULL DEFAULT 0,
  email_clicks int NOT NULL DEFAULT 0,
  share_clicks int NOT NULL DEFAULT 0,
  copy_link_clicks int NOT NULL DEFAULT 0,
  qr_code_views int NOT NULL DEFAULT 0,
  article_views int NOT NULL DEFAULT 0,
  question_received int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (lawyer_id, metric_date)
);

CREATE INDEX IF NOT EXISTS lawyer_metrics_lawyer_date_idx
  ON public.lawyer_metrics (lawyer_id, metric_date DESC);

COMMENT ON TABLE public.lawyer_metrics IS
  'Agregação diária de métricas de uso da Página Profissional. Uma linha por advogado por dia.';

ALTER TABLE public.lawyer_metrics ENABLE ROW LEVEL SECURITY;

-- Só o próprio advogado lê suas métricas
DROP POLICY IF EXISTS "lawyer_metrics_owner_read" ON public.lawyer_metrics;
CREATE POLICY "lawyer_metrics_owner_read"
  ON public.lawyer_metrics FOR SELECT
  USING (auth.uid() = lawyer_id);

-- Escrita via service_role (endpoint de tracking acumula contadores)
DROP POLICY IF EXISTS "lawyer_metrics_service_write" ON public.lawyer_metrics;
CREATE POLICY "lawyer_metrics_service_write"
  ON public.lawyer_metrics FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "lawyer_metrics_service_update" ON public.lawyer_metrics;
CREATE POLICY "lawyer_metrics_service_update"
  ON public.lawyer_metrics FOR UPDATE
  USING (auth.role() = 'service_role');

-- =====================================================================
-- 4b) Tabela: lawyer_faqs (perguntas frequentes editáveis pelo advogado)
-- =====================================================================
-- Cada FAQ é uma dupla pergunta+resposta. O sistema sempre exibe um set
-- mínimo de FAQs padrão (server-side) + o que o advogado cadastrar aqui.
CREATE TABLE IF NOT EXISTS public.lawyer_faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lawyer_id uuid NOT NULL REFERENCES public.lawyers(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL,
  position int NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lawyer_faqs_lawyer_idx
  ON public.lawyer_faqs (lawyer_id, position);

COMMENT ON TABLE public.lawyer_faqs IS
  'FAQs editáveis pelo advogado, exibidas em ordem de position. Visible=false esconde sem deletar.';

ALTER TABLE public.lawyer_faqs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "lawyer_faqs_public_read" ON public.lawyer_faqs;
CREATE POLICY "lawyer_faqs_public_read"
  ON public.lawyer_faqs FOR SELECT
  USING (visible = true);

DROP POLICY IF EXISTS "lawyer_faqs_owner_all" ON public.lawyer_faqs;
CREATE POLICY "lawyer_faqs_owner_all"
  ON public.lawyer_faqs FOR ALL
  USING (auth.uid() = lawyer_id)
  WITH CHECK (auth.uid() = lawyer_id);

-- =====================================================================
-- 5) Trigger pra manter updated_at automaticamente nas novas tabelas
-- =====================================================================
-- Reusa função existente (se foi criada em migration anterior) ou cria.
CREATE OR REPLACE FUNCTION public.set_updated_at_timestamp()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS lawyer_articles_set_updated_at ON public.lawyer_articles;
CREATE TRIGGER lawyer_articles_set_updated_at
  BEFORE UPDATE ON public.lawyer_articles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();

DROP TRIGGER IF EXISTS lawyer_questions_set_updated_at ON public.lawyer_questions;
CREATE TRIGGER lawyer_questions_set_updated_at
  BEFORE UPDATE ON public.lawyer_questions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();

DROP TRIGGER IF EXISTS lawyer_metrics_set_updated_at ON public.lawyer_metrics;
CREATE TRIGGER lawyer_metrics_set_updated_at
  BEFORE UPDATE ON public.lawyer_metrics
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();

DROP TRIGGER IF EXISTS lawyer_faqs_set_updated_at ON public.lawyer_faqs;
CREATE TRIGGER lawyer_faqs_set_updated_at
  BEFORE UPDATE ON public.lawyer_faqs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();

-- =====================================================================
-- 6) Backfill page_status pros lawyers já existentes
-- =====================================================================
-- Cadastros premium-ativos com whatsapp e ao menos uma área = published
UPDATE public.lawyers
SET page_status = 'published',
    last_published_at = COALESCE(last_published_at, plan_start_date, created_at),
    is_public = true,
    is_indexable = true
WHERE plan_status = 'active'
  AND (whatsapp IS NOT NULL OR phone IS NOT NULL)
  AND array_length(specialties, 1) > 0
  AND page_status = 'not_configured';

-- Cadastros premium-ativos sem dados completos = incomplete
UPDATE public.lawyers
SET page_status = 'incomplete'
WHERE plan_status = 'active'
  AND ((whatsapp IS NULL AND phone IS NULL) OR array_length(specialties, 1) IS NULL)
  AND page_status = 'not_configured';

-- Cadastros pending = review (em análise de pagamento)
UPDATE public.lawyers
SET page_status = 'review'
WHERE plan_status = 'pending'
  AND page_status = 'not_configured';

-- Backfill primary_specialties — pega as 3 primeiras de specialties
UPDATE public.lawyers
SET primary_specialties = (
  SELECT array_agg(s) FROM (
    SELECT unnest(specialties) AS s LIMIT 3
  ) sub
)
WHERE primary_specialties = '{}'::text[]
  AND array_length(specialties, 1) > 0;

-- =============================================================================
-- FIM da migration 0006.
-- =============================================================================
