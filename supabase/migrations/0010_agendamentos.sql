-- 0010_agendamentos.sql
-- Tabela de pedidos de agendamento de consulta (Projeto Agenda).
--
-- Escrita só pelo servidor (service_role, via /api/agendamento) e lida só pelo
-- admin (via /api/admin/agendamentos). RLS habilitado SEM policies: o acesso
-- anônimo/autenticado fica bloqueado; o service_role ignora RLS.

create table if not exists public.agendamentos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nome text not null,
  contato text not null,
  area text,
  assunto text,
  data_preferida date,
  periodo text,
  mensagem text,
  status text not null default 'novo',
  ip_trunc text
);

create index if not exists agendamentos_created_at_idx
  on public.agendamentos (created_at desc);
create index if not exists agendamentos_status_idx
  on public.agendamentos (status);

alter table public.agendamentos enable row level security;
-- Sem policies de propósito: nada de anon/auth. Só service_role escreve/lê.
