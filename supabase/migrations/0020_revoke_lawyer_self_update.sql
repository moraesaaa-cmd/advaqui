-- 0020 — Fecha a brecha de auto-promoção a Premium (auditoria 2026-07-03).
--
-- PROBLEMA: a policy lawyers_self_update (0001) restringe o UPDATE à PRÓPRIA
-- linha (auth.uid() = id), mas RLS não restringe COLUNAS. Como o role
-- `authenticated` herda o GRANT padrão do Supabase, um advogado logado podia
-- fazer PATCH direto em /rest/v1/lawyers na própria linha e setar
-- plan_status='active', plan_end_date distante, featured=true e
-- verified_oab=true — furando o plano pago e forjando o selo de verificação.
--
-- CORREÇÃO: revogar UPDATE (e DELETE, por higiene) da tabela para os roles de
-- cliente. É seguro: TODA escrita legítima em lawyers passa pelo backend com
-- service_role (app/api/painel/profile, app/api/admin, crons) — nenhum código
-- cliente atualiza lawyers diretamente.
--
-- Aplicada em produção via SQL editor em 2026-07-03 (mesmo dia da auditoria).

revoke update, delete on table public.lawyers from authenticated;
revoke update, delete on table public.lawyers from anon;
