-- Migration 002: Lead matcher + novos agents
-- Adiciona coluna para rastrear qual advogado foi associado ao lead
-- e registra os novos agentes no sistema

-- Coluna de match na tabela de leads
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS matched_lawyer_id uuid REFERENCES auth.users(id);
CREATE INDEX IF NOT EXISTS idx_leads_matched ON public.leads (matched_lawyer_id) WHERE matched_lawyer_id IS NOT NULL;

-- Registrar novos agentes
INSERT INTO public.agent_configs (agent_name, display_name, description, schedule, enabled, settings)
VALUES
  ('lead_matcher', 'Lead Matcher', 'Cruza leads novos com advogados por área e cidade', '0 */3 * * *', true, '{}'),
  ('ping_engines', 'Ping Mecanismos de Busca', 'Notifica Google, Bing e IndexNow sobre sitemaps atualizados', '0 6 * * *', true, '{}')
ON CONFLICT (agent_name) DO NOTHING;
