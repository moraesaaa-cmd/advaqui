-- =====================================================================
-- 0022 — comentarios_decisoes  *** AINDA NÃO APLICADA ***
--
-- A v1 dos comentários de decisão (aba Notícias) usa arquivo JSON no VPS
-- (/var/www/advaqui-data/comentarios-decisoes.json — lib/comentarios-decisoes.ts)
-- porque o DDL exige o SQL Editor do Studio. Quando aplicar esta migração,
-- trocar a implementação de lib/comentarios-decisoes.ts para o Supabase e
-- importar o JSON existente.
-- =====================================================================

create table if not exists public.comentarios_decisoes (
  id uuid primary key default gen_random_uuid(),
  tribunal text not null check (tribunal in ('stf','stj')),
  slug text not null,
  nome text not null check (char_length(nome) between 2 and 60),
  texto text not null check (char_length(texto) between 5 and 800),
  status text not null default 'pendente' check (status in ('pendente','aprovado')),
  ip_trunc text,
  created_at timestamptz not null default now()
);

create index if not exists comentarios_decisoes_decisao_idx
  on public.comentarios_decisoes (tribunal, slug, status, created_at desc);

alter table public.comentarios_decisoes enable row level security;

-- Sem policies públicas: leitura e escrita passam pelo service_role
-- (API routes), igual às demais tabelas operacionais.
