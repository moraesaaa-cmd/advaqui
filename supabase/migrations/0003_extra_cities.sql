-- =============================================================================
-- AdvAqui — Migration 0003 — Suporte a múltiplas cidades de atendimento
-- =============================================================================
-- Adiciona coluna `extra_cities` jsonb em public.lawyers para permitir que
-- advogados premium listem até 10 cidades adicionais de atendimento.
--
-- Contrato:
--   • FREE   — 1 cidade (a principal city_name/city_slug/uf do cadastro)
--   • PREMIUM — até 10 cidades (1 principal + 9 extras, totalizando 10)
--
-- Cada entrada de extra_cities é um objeto:
--   { "name": "Belo Horizonte", "slug": "belo-horizonte", "uf": "MG" }
--
-- A coluna target_city/target_uf legada continua existindo mas não é mais
-- atualizada via painel — quando preenchida (cadastros antigos), funciona
-- como uma 11ª entrada implícita. A função getLawyersForCity unifica.
--
-- Como rodar:
--   1) Supabase Dashboard → SQL Editor → New query
--   2) Cola este arquivo inteiro → Run
--   3) Aguarda "Success. No rows returned"
-- =============================================================================

-- 1. Coluna extra_cities (jsonb array, default vazio).
alter table public.lawyers
  add column if not exists extra_cities jsonb not null default '[]'::jsonb;

-- 2. Constraint — garante array com no máximo 9 elementos.
--    (9 extras + 1 principal = 10 total, conforme regra do produto.)
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'lawyers_extra_cities_max_check'
  ) then
    alter table public.lawyers
      add constraint lawyers_extra_cities_max_check
      check (jsonb_typeof(extra_cities) = 'array' and jsonb_array_length(extra_cities) <= 9);
  end if;
end $$;

-- 3. Índice GIN — busca rápida por matches em extra_cities
--    (consulta padrão: "advogados que atendem nesta cidade").
create index if not exists lawyers_extra_cities_gin_idx
  on public.lawyers using gin (extra_cities);

-- 4. Função utilitária — verifica se uma cidade está nas extra_cities
--    do advogado. Aceita uf maiúsculo e slug em formato `cidade-nome`.
create or replace function public.lawyer_serves_city(
  lawyer_extra_cities jsonb,
  target_uf text,
  target_slug text
) returns boolean
language sql
immutable
as $$
  select exists (
    select 1
    from jsonb_array_elements(lawyer_extra_cities) c
    where c->>'uf' = target_uf and c->>'slug' = target_slug
  );
$$;

-- =============================================================================
-- FIM
-- =============================================================================
-- Próximo passo: o código (lib/data/lawyers.ts) usa essa coluna no select
-- e na função getLawyersForCity inclui matches via or() do supabase-js.
-- =============================================================================
