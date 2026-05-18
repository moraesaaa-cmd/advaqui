-- =============================================================================
-- AdvAqui — Migration 0004 — Normaliza nomes legados de advogados
-- =============================================================================
-- Cadastros antigos foram salvos com o nome em CAPS (KELLSONS DE MORAES
-- OLIVEIRA). Padrão do produto agora é Title Case BR (Kellsons de Moraes
-- Oliveira) — aplicado no signUp via titleCaseNameBR e no painel via
-- normalizeLawyerName.
--
-- Esta migration faz a correção one-time dos registros existentes no banco.
-- A função SQL replica a lógica do helper titleCaseNameBR do JavaScript:
--   • lowercase tudo
--   • capitaliza primeira letra de cada palavra
--   • conectivos (de, da, do, das, dos, e, del) ficam em minúsculas EXCETO
--     quando primeira palavra do nome
--
-- Como rodar:
--   1) Supabase Dashboard → SQL Editor → New query
--   2) Cola este arquivo inteiro → Run
--   3) Aguarda "Success. X rows updated"
-- =============================================================================

-- Função utilitária — title case brasileiro
create or replace function public.title_case_br(input text)
returns text
language plpgsql
immutable
as $$
declare
  result text := '';
  word text;
  i int := 0;
  connectives text[] := array['de','da','do','das','dos','e','del'];
begin
  if input is null or input = '' then
    return input;
  end if;

  for word in select unnest(string_to_array(trim(input), ' ')) loop
    i := i + 1;
    if word = '' then
      continue;
    end if;
    -- Conectivos em minúsculas, exceto se for a primeira palavra
    if i > 1 and lower(word) = any(connectives) then
      result := result || ' ' || lower(word);
    else
      result := result ||
        case when i > 1 then ' ' else '' end ||
        upper(substring(word from 1 for 1)) ||
        lower(substring(word from 2));
    end if;
  end loop;

  return result;
end;
$$;

-- Aplica title case nos nomes que estão em CAPS (ou tudo minúsculo)
update public.lawyers
set name = public.title_case_br(name)
where name is not null
  and name != ''
  and (
    name = upper(name)         -- tudo MAIÚSCULO
    or name = lower(name)      -- tudo minúsculo
  );

-- Sincroniza auth.users.raw_user_meta_data com o nome normalizado
-- (para o Header detectar imediatamente sem precisar do user logar)
update auth.users u
set raw_user_meta_data = jsonb_set(
  coalesce(raw_user_meta_data, '{}'::jsonb),
  '{name}',
  to_jsonb(l.name)
)
from public.lawyers l
where u.id = l.id
  and (
    coalesce(u.raw_user_meta_data->>'name', '') = ''
    or u.raw_user_meta_data->>'name' = upper(u.raw_user_meta_data->>'name')
  );

-- =============================================================================
-- FIM
-- =============================================================================
