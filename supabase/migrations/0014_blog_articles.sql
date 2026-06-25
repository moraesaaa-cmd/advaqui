-- =============================================================================
-- Migration 0014 — Junho/2026 — Blog articles auto-publisher (AdvAqui)
-- =============================================================================
-- Cria a tabela `blog_articles` para o blog institucional do AdvAqui.
-- Cada linha = 1 artigo publicado (gerado por auto-publisher ou manual).
--
-- Artigos publicados ficam acessiveis via anon (leitura publica).
-- Escrita, edicao e exclusao restritas a service_role.
--
-- Como rodar: cole no SQL Editor do Supabase → Run.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.blog_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,           -- URL-friendly, ex: direitos-trabalhistas-2026
  title text NOT NULL,                 -- titulo do artigo
  excerpt text NOT NULL,               -- resumo SEO, max 160 chars
  category text NOT NULL,              -- ex: Trabalhista, Familia, Previdenciario, Consumidor
  body text NOT NULL,                  -- conteudo HTML do artigo
  reading_minutes int NOT NULL DEFAULT 5,
  author text NOT NULL DEFAULT 'Equipe AdvAqui',
  published_at timestamptz,            -- data de publicacao (null = nao publicado ainda)
  created_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'published', -- draft, published, archived
  seo_keywords text[],                -- array de palavras-chave SEO
  topic_index int                      -- indice do topico usado de BLOG_TOPICS
);

CREATE INDEX IF NOT EXISTS blog_articles_published_at_idx
  ON public.blog_articles (published_at DESC);
CREATE INDEX IF NOT EXISTS blog_articles_category_idx
  ON public.blog_articles (category);
CREATE INDEX IF NOT EXISTS blog_articles_status_idx
  ON public.blog_articles (status);

COMMENT ON TABLE public.blog_articles IS
  'Artigos do blog AdvAqui. Publicados automaticamente pelo auto-publisher ou manualmente.';
COMMENT ON COLUMN public.blog_articles.slug IS
  'Slug unico URL-friendly. Usado na rota /blog/[slug].';
COMMENT ON COLUMN public.blog_articles.excerpt IS
  'Resumo curto (max 160 chars) para meta description e cards de listagem.';
COMMENT ON COLUMN public.blog_articles.category IS
  'Area do Direito: Trabalhista, Familia, Previdenciario, Consumidor, etc.';
COMMENT ON COLUMN public.blog_articles.body IS
  'Conteudo HTML completo do artigo.';
COMMENT ON COLUMN public.blog_articles.status IS
  'Estado do artigo: draft (rascunho), published (publicado), archived (arquivado).';
COMMENT ON COLUMN public.blog_articles.topic_index IS
  'Indice do topico usado de BLOG_TOPICS, para rastrear quais topicos ja foram usados.';

-- RLS: leitura publica de artigos publicados. Escrita apenas via service_role.
ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "blog_articles_anon_read" ON public.blog_articles;
CREATE POLICY "blog_articles_anon_read"
  ON public.blog_articles FOR SELECT
  USING (status = 'published');

DROP POLICY IF EXISTS "blog_articles_service_insert" ON public.blog_articles;
CREATE POLICY "blog_articles_service_insert"
  ON public.blog_articles FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "blog_articles_service_update" ON public.blog_articles;
CREATE POLICY "blog_articles_service_update"
  ON public.blog_articles FOR UPDATE
  USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "blog_articles_service_delete" ON public.blog_articles;
CREATE POLICY "blog_articles_service_delete"
  ON public.blog_articles FOR DELETE
  USING (auth.role() = 'service_role');
