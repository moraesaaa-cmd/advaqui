-- Migration 0012 — peças de recurso geradas no painel do cliente de multa.
-- Cada linha é um recurso gerado por IA (até 3 por cliente, controlado em
-- recurso_clientes.recursos_restantes). Serve de histórico para o cliente
-- rever e baixar suas peças no painel (/recurso/painel).
--
-- RLS habilitado SEM policies: só o service_role (server) acessa, igual às
-- demais tabelas do projeto. O painel lê via API server-side com o token.

create table if not exists public.recurso_pecas (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  cliente_id  uuid not null references public.recurso_clientes(id) on delete cascade,
  fase        text,
  infracao    text,
  titulo      text,
  texto       text not null
);

create index if not exists recurso_pecas_cliente_idx
  on public.recurso_pecas (cliente_id, created_at desc);

alter table public.recurso_pecas enable row level security;
