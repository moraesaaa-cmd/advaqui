-- Migration 0005 — Maio/2026
-- Expande perfil premium: foto, redes sociais, site, horário de atendimento.
-- Cria bucket "avatars" no Storage para upload das fotos.

-- =====================================================================
-- 1) Novas colunas em public.lawyers
-- =====================================================================
ALTER TABLE public.lawyers
  ADD COLUMN IF NOT EXISTS photo_url    text,
  ADD COLUMN IF NOT EXISTS website      text,
  ADD COLUMN IF NOT EXISTS instagram    text,
  ADD COLUMN IF NOT EXISTS linkedin     text,
  ADD COLUMN IF NOT EXISTS office_hours text;

-- Comentários documentando o propósito dos campos
COMMENT ON COLUMN public.lawyers.photo_url IS
  'URL da foto de perfil. Pode ser path do bucket avatars/{id}.jpg, ou URL externa (Imgur, Drive). Mostrado em LawyerCard e perfil público se preenchido.';
COMMENT ON COLUMN public.lawyers.website IS
  'Site profissional do advogado (URL completa com https). Premium only para exibição pública.';
COMMENT ON COLUMN public.lawyers.instagram IS
  'Handle do Instagram (sem @). Exemplo: "joao.advocacia". Premium only.';
COMMENT ON COLUMN public.lawyers.linkedin IS
  'Handle ou URL do LinkedIn. Premium only.';
COMMENT ON COLUMN public.lawyers.office_hours IS
  'Horários de atendimento em texto livre. Exemplo: "Seg-Sex 9h-18h, Sáb 9h-12h". Premium only.';

-- =====================================================================
-- 2) Bucket "avatars" no Storage
-- =====================================================================
-- Cria o bucket se ainda não existir. Public read = true porque a foto
-- precisa ser carregada nos cards/SEO sem precisar assinar URLs.
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- =====================================================================
-- 3) Políticas RLS do bucket avatars
-- =====================================================================
-- Read: público total — qualquer um pode ver fotos (necessário pro SSG)
DROP POLICY IF EXISTS "avatars_public_read" ON storage.objects;
CREATE POLICY "avatars_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Write/Update/Delete: apenas service_role (usado pelo endpoint upload).
-- O endpoint server-side autentica o lawyer e faz o upload em nome dele,
-- evitando a necessidade de o client ter token de service_role.
DROP POLICY IF EXISTS "avatars_service_write" ON storage.objects;
CREATE POLICY "avatars_service_write"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'service_role');

DROP POLICY IF EXISTS "avatars_service_update" ON storage.objects;
CREATE POLICY "avatars_service_update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.role() = 'service_role');

DROP POLICY IF EXISTS "avatars_service_delete" ON storage.objects;
CREATE POLICY "avatars_service_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.role() = 'service_role');
