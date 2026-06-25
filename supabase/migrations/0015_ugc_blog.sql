-- =============================================================================
-- Migration 0015 — Junho/2026 — UGC Blog (User-Generated Content)
-- =============================================================================
-- Adiciona colunas à tabela `blog_articles` para permitir que advogados
-- premium publiquem artigos no blog público do AdvAqui.
--
-- Artigos de IA/equipe continuam com author_id = NULL e status = 'published'.
-- Artigos de advogados iniciam com status = 'pending' até aprovação admin.
--
-- Status possíveis após esta migration:
--   draft     — rascunho do advogado (não visível)
--   pending   — enviado para revisão (não visível)
--   published — aprovado e público
--   rejected  — recusado pelo admin (não visível)
--   archived  — arquivado (status pré-existente)
--
-- Como rodar: cole no SQL Editor do Supabase → Run.
-- =============================================================================

-- Coluna: author_id — referência ao advogado autor (NULL = IA/equipe)
ALTER TABLE public.blog_articles
  ADD COLUMN IF NOT EXISTS author_id uuid REFERENCES public.lawyers(id) ON DELETE SET NULL;

-- Coluna: author_name — nome do advogado no momento da publicação (desnormalizado)
ALTER TABLE public.blog_articles
  ADD COLUMN IF NOT EXISTS author_name text;

-- Coluna: meta_description — descrição SEO do artigo UGC (excerpt já existe,
-- mas UGC pode ter meta_description independente)
ALTER TABLE public.blog_articles
  ADD COLUMN IF NOT EXISTS meta_description text;

-- Expandir CHECK do status para incluir 'pending' e 'rejected'.
-- O status anterior não tinha CHECK explícito (era só texto), então adicionamos.
-- Se já existir uma constraint, removemos primeiro para recriar.
DO $$
BEGIN
  -- Tenta remover constraint existente (ignora se não existir)
  ALTER TABLE public.blog_articles DROP CONSTRAINT IF EXISTS blog_articles_status_check;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

ALTER TABLE public.blog_articles
  ADD CONSTRAINT blog_articles_status_check
  CHECK (status IN ('draft', 'pending', 'published', 'rejected', 'archived'));

-- Índice para listar artigos por autor
CREATE INDEX IF NOT EXISTS blog_articles_author_id_idx
  ON public.blog_articles (author_id)
  WHERE author_id IS NOT NULL;

-- RLS: advogados autenticados podem ler seus próprios artigos (qualquer status)
DROP POLICY IF EXISTS "blog_articles_author_read_own" ON public.blog_articles;
CREATE POLICY "blog_articles_author_read_own"
  ON public.blog_articles FOR SELECT
  USING (auth.uid() = author_id);

COMMENT ON COLUMN public.blog_articles.author_id IS
  'UUID do advogado autor. NULL = artigo gerado por IA/equipe.';
COMMENT ON COLUMN public.blog_articles.author_name IS
  'Nome do advogado no momento da submissão (desnormalizado para exibição pública).';
COMMENT ON COLUMN public.blog_articles.meta_description IS
  'Meta description SEO do artigo UGC. Fallback para excerpt se ausente.';
