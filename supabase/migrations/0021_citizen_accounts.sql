-- =============================================================================
-- 0021 — Contas de cidadão (gate de download das ferramentas)
-- =============================================================================
-- O cadastro rápido das ferramentas (QuickSignupModal) cria usuários com
-- raw_user_meta_data->>'account_type' = 'cidadao'. Essas contas servem só
-- para autenticação/lead — NÃO são advogados e não podem ganhar perfil
-- público em public.lawyers. Este patch faz o trigger ignorá-las.
-- Todo o resto da função permanece idêntico à 0001.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  v_slug text;
  base_slug text;
  i int := 0;
begin
  -- Conta de cidadão (ferramentas/downloads): não cria perfil de advogado.
  if meta->>'account_type' = 'cidadao' then
    return new;
  end if;

  -- Gera slug base e garante unicidade
  base_slug := regexp_replace(
    lower(unaccent(coalesce(meta->>'name', new.email))),
    '[^a-z0-9]+', '-', 'g'
  );
  base_slug := regexp_replace(base_slug, '(^-+|-+$)', '', 'g');
  v_slug := base_slug;
  while exists (select 1 from public.lawyers where slug = v_slug) loop
    i := i + 1;
    v_slug := base_slug || '-' || i;
  end loop;

  insert into public.lawyers (
    id, slug, name, oab, oab_uf, cpf, email,
    phone, whatsapp, address, city_name, city_slug, uf,
    specialties, bio
  ) values (
    new.id,
    v_slug,
    coalesce(meta->>'name', new.email),
    coalesce(meta->>'oab', ''),
    coalesce(meta->>'oab_uf', ''),
    nullif(meta->>'cpf', ''),
    new.email,
    nullif(meta->>'phone', ''),
    nullif(meta->>'whatsapp', ''),
    nullif(meta->>'address', ''),
    coalesce(meta->>'city_name', 'Não informada'),
    coalesce(meta->>'city_slug', 'nao-informada'),
    coalesce(meta->>'uf', 'BR'),
    coalesce(
      (select array_agg(value) from jsonb_array_elements_text(meta->'specialties')),
      '{}'::text[]
    ),
    nullif(meta->>'bio', '')
  );
  return new;
end;
$$;
