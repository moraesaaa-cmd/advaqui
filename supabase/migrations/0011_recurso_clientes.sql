-- 0011_recurso_clientes.sql
-- Clientes da ferramenta de recurso de multa (subdomínio multas.advaqui.com).
-- Fluxo: pessoa faz a análise grátis → cadastra + paga Pix (status 'aguardando')
-- → admin ativa no painel ('ativo') → usa a geração por IA (gasta de
-- recursos_restantes). Acesso passwordless via access_token.
--
-- RLS habilitado SEM policies: só o service_role (servidor) lê/escreve.

create table if not exists public.recurso_clientes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  nome text,
  telefone text,
  fase text,
  infracao text,
  cpf text,
  placa text,
  ait text,
  orgao text,
  data_infracao text,
  cidade text,
  relato text,
  status text not null default 'aguardando',
  recursos_restantes int not null default 3,
  access_token uuid not null default gen_random_uuid(),
  activated_at timestamptz,
  ip_trunc text
);

create index if not exists recurso_clientes_status_idx on public.recurso_clientes(status);
create index if not exists recurso_clientes_token_idx on public.recurso_clientes(access_token);
create index if not exists recurso_clientes_created_idx on public.recurso_clientes(created_at desc);

alter table public.recurso_clientes enable row level security;
