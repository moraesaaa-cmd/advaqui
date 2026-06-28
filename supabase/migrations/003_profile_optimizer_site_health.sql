-- Migration 003: Profile Optimizer + Site Health agents
-- Adiciona campos para score/sugestões de perfil e registra novos agentes

-- Campos de otimização de perfil na tabela de advogados
ALTER TABLE public.lawyers ADD COLUMN IF NOT EXISTS profile_score smallint;
ALTER TABLE public.lawyers ADD COLUMN IF NOT EXISTS profile_suggestions jsonb;

-- Registrar novos agentes
INSERT INTO public.agent_configs (agent_name, display_name, description, schedule, enabled, settings)
VALUES
  ('profile_optimizer', 'Profile Optimizer', 'Analisa perfis de advogados via IA e sugere melhorias', '0 10 * * *', true, '{}'),
  ('site_health', 'Site Health Monitor', 'Verifica saúde das páginas-chave do site', '0 */6 * * *', true, '{}')
ON CONFLICT (agent_name) DO NOTHING;
