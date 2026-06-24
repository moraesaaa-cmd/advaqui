-- Migration 0013 — controle de uso do revisor de petições por IA.
-- Limita o uso da ferramenta (que gasta tokens da OpenAI) a um número de
-- revisões por mês por advogado premium. Reset implícito por mês de referência.

alter table public.lawyers
  add column if not exists revisor_usos integer not null default 0,
  add column if not exists revisor_usos_ref text;
