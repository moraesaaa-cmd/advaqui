-- =============================================================================
-- AdvAqui — Schema inicial Supabase
-- =============================================================================
-- Este script cria as 4 tabelas principais do AdvAqui (lawyers, messages,
-- plan_history, audit_logs), os índices, as policies de Row Level Security (RLS)
-- e um trigger que cria automaticamente uma linha em `lawyers` quando um novo
-- usuário se registra via Supabase Auth.
--
-- Como rodar: cole este arquivo inteiro no SQL Editor do Supabase
-- (https://supabase.com → seu projeto → SQL Editor → New query → cola → Run).
-- =============================================================================

-- =========================
-- TABELA: lawyers
-- =========================
-- Perfil profissional do advogado. Cada linha corresponde a 1 usuário em auth.users.
create table if not exists public.lawyers (
  id uuid primary key references auth.users(id) on delete cascade,
  slug text unique not null,
  name text not null,
  oab text not null,
  oab_uf text not null,
  cpf text,                         -- privado, RLS bloqueia leitura externa
  email text not null,
  phone text,
  whatsapp text,
  address text,
  city_name text not null,
  city_slug text not null,
  uf text not null,
  specialties text[] not null default '{}',
  bio text,
  plan_status text not null default 'free'
    check (plan_status in ('free','pending','active','expired','cancelled')),
  plan_start_date timestamptz,
  plan_end_date timestamptz,
  payment_date timestamptz,
  featured boolean not null default false,
  verified_oab boolean not null default false,
  target_city text,
  target_uf text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lawyers_city_idx on public.lawyers (uf, city_slug);
create index if not exists lawyers_uf_idx on public.lawyers (uf);
create index if not exists lawyers_plan_idx on public.lawyers (plan_status);
create index if not exists lawyers_specialties_idx on public.lawyers using gin (specialties);
create index if not exists lawyers_email_idx on public.lawyers (lower(email));

-- =========================
-- TABELA: messages
-- =========================
-- Mensagens (formulário de contato + suporte interno + admin → user).
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid references public.lawyers(id) on delete set null,
  from_name text not null,
  from_email text,
  subject text not null default 'Contato',
  body text not null,
  source text not null default 'contact_form'
    check (source in ('contact_form','support','admin_to_user')),
  read boolean not null default false,
  reply text,
  reply_date timestamptz,
  reply_admin_email text,
  created_at timestamptz not null default now()
);

create index if not exists messages_read_idx on public.messages (read, created_at desc);
create index if not exists messages_from_user_idx on public.messages (from_user_id);

-- =========================
-- TABELA: plan_history
-- =========================
-- Histórico de pagamentos e ativações de plano premium.
create table if not exists public.plan_history (
  id uuid primary key default gen_random_uuid(),
  lawyer_id uuid not null references public.lawyers(id) on delete cascade,
  amount numeric(10,2) not null,
  status text not null default 'pending'
    check (status in ('pending','confirmed','expired','cancelled','refunded')),
  payment_date timestamptz,
  expires_at timestamptz,
  txid text,
  admin_notes text,
  created_at timestamptz not null default now()
);

create index if not exists plan_history_lawyer_idx on public.plan_history (lawyer_id, created_at desc);
create index if not exists plan_history_status_idx on public.plan_history (status);

-- =========================
-- TABELA: audit_logs
-- =========================
-- Logs de ações administrativas (quem ativou plano, quem deletou, etc).
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_email text not null,
  action text not null,
  target_id uuid,
  target_type text,
  details jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_created_idx on public.audit_logs (created_at desc);

-- =========================
-- Trigger: atualizar updated_at automaticamente
-- =========================
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_lawyers_updated_at on public.lawyers;
create trigger trg_lawyers_updated_at
  before update on public.lawyers
  for each row execute function public.touch_updated_at();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================
-- Garante que cada usuário só consegue ler/escrever os próprios dados,
-- enquanto o diretório público continua consultável (sem expor CPF).

alter table public.lawyers enable row level security;
alter table public.messages enable row level security;
alter table public.plan_history enable row level security;
alter table public.audit_logs enable row level security;

-- ============== lawyers ===========================================

-- Leitura pública dos perfis (campos profissionais). CPF não é lido aqui
-- pois consultas públicas devem usar a view `public_lawyers` abaixo, NÃO
-- a tabela direta. As policies permitem SELECT mas o app deve filtrar colunas.
drop policy if exists "lawyers_public_read" on public.lawyers;
create policy "lawyers_public_read"
  on public.lawyers
  for select
  to anon, authenticated
  using (true);

-- Insert só pelo trigger handle_new_user (ver no fim do arquivo).
-- Não criamos policy de INSERT explícita para usuários — só service_role insere.

-- Update do próprio perfil pelo usuário logado.
drop policy if exists "lawyers_self_update" on public.lawyers;
create policy "lawyers_self_update"
  on public.lawyers
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Delete só service_role (admin).

-- ============== messages ==========================================

-- Qualquer pessoa pode INSERIR mensagem (formulário de contato é público).
drop policy if exists "messages_public_insert" on public.messages;
create policy "messages_public_insert"
  on public.messages
  for insert
  to anon, authenticated
  with check (true);

-- O próprio usuário lê suas mensagens enviadas.
drop policy if exists "messages_self_select" on public.messages;
create policy "messages_self_select"
  on public.messages
  for select
  to authenticated
  using (auth.uid() = from_user_id);

-- ============== plan_history ======================================

-- O próprio usuário consulta seu histórico.
drop policy if exists "plan_history_self_select" on public.plan_history;
create policy "plan_history_self_select"
  on public.plan_history
  for select
  to authenticated
  using (auth.uid() = lawyer_id);

-- Inserts ficam só com service_role (admin marca pagamento).

-- ============== audit_logs ========================================
-- Sem policy para anon/authenticated — só service_role acessa.

-- =============================================================================
-- TRIGGER: criar linha em lawyers quando user se registra
-- =============================================================================
-- Quando alguém se cadastra via supabase.auth.signUp(), o Supabase cria uma
-- linha em auth.users automaticamente. Este trigger captura esse evento e
-- cria a linha correspondente em public.lawyers com os dados básicos passados
-- como metadata.

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

-- Garante que a extensão unaccent existe (usada no slugify)
create extension if not exists unaccent;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================================
-- FIM DO SCHEMA INICIAL
-- =============================================================================
-- Próximo passo: rodar este arquivo no SQL Editor do Supabase.
-- Para popular com mock-lawyers (opcional, demonstração), rode também:
--   supabase/migrations/0002_seed_mock_lawyers.sql
-- =============================================================================
