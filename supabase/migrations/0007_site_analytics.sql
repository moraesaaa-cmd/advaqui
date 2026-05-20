-- =============================================================================
-- Migration 0007 — Maio/2026 — Site analytics (AdvAqui)
-- =============================================================================
-- Cria a tabela `site_visits` para tracking básico de pageviews no AdvAqui.
-- Cada linha = 1 pageview (cliente reporta via /api/track no client-side).
--
-- Privacidade-friendly: IP truncado pra /24 antes de armazenar (LGPD).
-- Não armazena cookies, fingerprint, nem identificadores pessoais.
--
-- Como rodar: cole no SQL Editor do Supabase → Run.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.site_visits (
  id bigserial PRIMARY KEY,
  visited_at timestamptz NOT NULL DEFAULT now(),
  session_id text,                  -- gerado no client (32 chars), sem PII
  path text NOT NULL,               -- rota visitada (ex: /advogados/mg/almenara)
  referer text,                     -- URL anterior (sem query string)
  country text,                     -- ex: BR (pela header CF-IPCountry/X-Geo)
  region text,                      -- ex: MG (pela header X-Geo-Region)
  city text,                        -- ex: Almenara
  user_agent_short text,            -- bot/mobile/desktop label, não UA cru
  ip_trunc text,                    -- IP truncado /24, ex: 200.100.50.0
  is_bot boolean NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS site_visits_visited_at_idx
  ON public.site_visits (visited_at DESC);
CREATE INDEX IF NOT EXISTS site_visits_path_idx
  ON public.site_visits (path);
CREATE INDEX IF NOT EXISTS site_visits_session_idx
  ON public.site_visits (session_id);
CREATE INDEX IF NOT EXISTS site_visits_country_idx
  ON public.site_visits (country);

COMMENT ON TABLE public.site_visits IS
  'Pageviews do AdvAqui. IP truncado /24. Sem fingerprint, sem PII. LGPD-friendly.';
COMMENT ON COLUMN public.site_visits.ip_trunc IS
  'IP de origem com último octeto zerado (ex: 200.100.50.0). Anônimo conforme LGPD.';
COMMENT ON COLUMN public.site_visits.session_id IS
  'ID aleatório de sessão (32 chars), gerado no client, expira ao fechar aba. Não rastreia entre sessões.';

-- RLS: só service_role escreve. Leitura via service_role (admin endpoint).
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_visits_service_insert" ON public.site_visits;
CREATE POLICY "site_visits_service_insert"
  ON public.site_visits FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "site_visits_service_read" ON public.site_visits;
CREATE POLICY "site_visits_service_read"
  ON public.site_visits FOR SELECT
  USING (auth.role() = 'service_role');

-- Retenção: apaga visitas com mais de 90 dias automaticamente.
-- (Executado quando o admin abrir a dashboard — o endpoint chama esta query.)
COMMENT ON COLUMN public.site_visits.visited_at IS
  'Pra retenção LGPD, recomenda-se purge automático após 90 dias.';
