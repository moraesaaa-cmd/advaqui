# AdvAqui — Estado atual

Última atualização — 17 de maio de 2026.

Este documento é a fotografia do projeto neste momento. Lista o que está rodando, o que está pronto mas não foi publicado, o que falta, e quais são os pontos de atenção urgentes. Foi escrito para você consultar quando voltar ou repassar para outra IA continuar.

---

## 1. O que está no ar agora

Site público acessível em — **https://advaqui.com**

- ✅ HTTPS válido (Let's Encrypt, renovação automática a cada 60 dias)
- ✅ Redirecionamento `http://` → `https://`
- ✅ Domínio `advaqui.com` apontando para o IP `187.77.5.38`
- ✅ 5.571 cidades brasileiras (IBGE) com URL própria
- ✅ 4.077 páginas pré-renderizadas (SSG) + ~85.000 via ISR
- ✅ Sitemap em escala (1 principal + 27 sitemaps de cidades + 27 de especialidades)
- ✅ Robots.txt apontando para os 55 sitemaps
- ✅ Schema markup JSON-LD em todas as rotas indexáveis
- ✅ Painel admin acessível em `/admin` com login via endpoint server-side
- ✅ Rate limit 5 tentativas em 15 min + cookie httpOnly assinado (HMAC)
- ✅ Pix Copia e Cola com QR Code dinâmico (padrão Bacen)
- ✅ Tipografia Inter + Fraunces, paleta brand (ink/deep/accent/bg)
- ✅ Validação real de CPF (algoritmo), e-mail (regex), OAB, telefone com máscaras
- ✅ Acessibilidade — skip link, aria-labels, contraste WCAG AA, navegação por teclado
- ✅ Responsivo 320px a 4K

**Versão em produção** — commit que precede a migração Supabase. Funciona com `localStorage` (cada visitante vê seus próprios cadastros, sem sincronização).

---

## 2. Infraestrutura

| Item | Valor | Onde |
|---|---|---|
| VPS | KVM 2 (2 vCPU, 8 GB RAM, 100 GB NVMe) | Hostinger Boston |
| Sistema | Ubuntu 24.04 LTS | — |
| IP público | `187.77.5.38` | — |
| Hostname | `srv1679615.hstgr.cloud` | — |
| Custo VPS | R$ 43,99/mês (promo 24 meses) → R$ 77,99/mês depois | — |
| Domínio | `advaqui.com` (Hostinger, 3 anos) | Vencimento 2027-05-17 |
| Custo domínio | R$ 0,01 no 1º ano + ~R$ 80 nos anos 2 e 3 | — |
| Renovação automática | Desligada (manual) | — |
| Servidor web | Nginx 1.24 (proxy reverso 80/443 → 3000) | `/etc/nginx/sites-available/advaqui` |
| Runtime | Node.js 20.20.2 + npm 10.8.2 | — |
| Gerenciador | PM2 7.0.1 (rodando como systemd unit `pm2-root.service`) | — |
| Localização visitante | Backend em Boston (latência ~150ms para Brasil) | Aceitável para começar |

---

## 3. Stack tecnológica

| Camada | Tecnologia | Versão |
|---|---|---|
| Frontend + Backend | Next.js (App Router, SSR + SSG + ISR) | 14.2.30 (atualizado) |
| Linguagem | TypeScript (strict) | 5.5.4 |
| Estilo | Tailwind CSS 3.4 + Fontes Inter/Fraunces via next/font | — |
| Banco de dados | Supabase Postgres (managed) | Em configuração |
| Autenticação | Supabase Auth (bcrypt nativo) + cookie HMAC para admin | Adaptado, falta deploy |
| Storage | Supabase Storage (planejado para fotos) | — |
| Ícones | lucide-react | 0.439 |
| QR Code Pix | qrcode npm | 1.5 |
| Lint | eslint-config-next | 14.2.30 |
| Hospedagem | Hostinger VPS KVM 2 | — |
| Repositório | GitHub público `moraesaaa-cmd/advaqui` | — |

---

## 4. Status da migração para Supabase

**Por que migrar** — a versão em produção usa `localStorage` do navegador. Cada visitante vê apenas seus próprios cadastros, sem sincronização entre dispositivos. Inadequado para produto real.

**O que já está pronto localmente (15+ arquivos adaptados):**

| Status | Arquivo |
|---|---|
| ✅ | `package.json` — `@supabase/supabase-js` + `@supabase/ssr` adicionados, Next bumped para 14.2.30 |
| ✅ | `supabase/migrations/0001_initial_schema.sql` — 4 tabelas (lawyers, messages, plan_history, audit_logs), RLS, trigger `handle_new_user` |
| ✅ | `lib/supabase/client.ts` — browser client com publishable key |
| ✅ | `lib/supabase/server.ts` — server client para RSC e Route Handlers |
| ✅ | `lib/supabase/admin.ts` — service_role client (ignora RLS) |
| ✅ | `lib/supabase/types.ts` — tipos Database tipados |
| ✅ | `lib/data/lawyers.ts` — fetch + admin operations (sortLawyers, mapLawyerRow, getLawyersForCity, etc.) |
| ✅ | `lib/data/messages.ts` — insert + admin operations |
| ✅ | `lib/auth/adminSession.ts` — HMAC SHA-256 com salt para cookie httpOnly admin |
| ✅ | `app/cadastro/page.tsx` — `supabase.auth.signUp` com metadata (trigger cria lawyer) |
| ✅ | `app/login/page.tsx` — Supabase Auth para advogado + endpoint admin |
| ✅ | `app/recuperar-senha/page.tsx` — `resetPasswordForEmail` |
| ✅ | `app/redefinir-senha/page.tsx` (novo) — recebe link Supabase e troca senha |
| ✅ | `app/painel/page.tsx` — fetch user via Supabase, update via Supabase |
| ✅ | `app/painel/pagamento/page.tsx` — update + insert plan_history |
| ✅ | `app/admin/page.tsx` — chamadas para `/api/admin` (cookie verify) |
| ✅ | `app/api/admin/route.ts` — roteador unificado (10 ações, todas verificam isAdminRequest) |
| ✅ | `app/api/auth/admin/route.ts` — agora seta cookie httpOnly HMAC |
| ✅ | `app/api/auth/logout/route.ts` — limpa session Supabase + cookie admin |
| ✅ | `app/advogados/[uf]/page.tsx` — `getLawyerCountsByCity` (1 query, sem N+1) |
| ✅ | `app/advogados/[uf]/[cidade]/page.tsx` — `getLawyersForCity` |
| ✅ | `app/advogados/[uf]/[cidade]/[especialidade]/page.tsx` — `getLawyersBySpecialty` |
| ✅ | `app/p/[slug]/page.tsx` — `findLawyerBySlug` + `getAllLawyerSlugs` |
| ✅ | `app/contato/page.tsx` — `supabase.from("messages").insert` |

**O que falta adaptar (4 arquivos, edits pequenos):**

| Status | Arquivo | Pendência |
|---|---|---|
| ⚠ CORROMPIDO | `app/page.tsx` | Foi truncado para 0 bytes pelo ENOSPC. Restaurar com `git checkout app/page.tsx` e aplicar mudança simples |
| 🟡 | `app/buscar/page.tsx` | Trocar busca em MOCK_LAWYERS por chamada Supabase |
| 🟡 | `app/sitemap.ts` + `app/sitemap-cidades/sitemap.ts` + `app/sitemap-especialidades/sitemap.ts` | Adaptar fetch de perfis para Supabase |
| 🟡 | `.env.example` | Adicionar `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `ADMIN_SESSION_SECRET` |

**O que NÃO foi feito ainda (fica para depois do deploy):**

- README atualizado para refletir Supabase
- middleware.ts para refresh automático de session Supabase em rotas SSR

---

## 5. Credenciais (lista, sem valores)

Você tem **6 conjuntos de credenciais** que devem estar no arquivo `advaqui-credenciais.txt` no seu PC.

| # | Conjunto | Onde usar | Status |
|---|---|---|---|
| 1 | Conta Hostinger | hpanel.hostinger.com | ✅ Anotada |
| 2 | Senha root VPS (`ssh root@187.77.5.38`) | Browser Terminal Hostinger | ✅ Anotada |
| 3 | Domínio advaqui.com | Renovação manual em 2027-05-17 | ✅ |
| 4 | GitHub (`moraesaaa-cmd`) | Push de código | ✅ Anotada |
| 5 | Admin do site (`kellsons39@gmail.com` + senha) | `https://advaqui.com/admin` | ⚠ Senha apareceu no chat — **trocar** |
| 6 | Supabase (URL + publishable key + secret key + senha do banco) | Painel Supabase, `.env.local` do VPS | ⚠ Secret key apareceu no chat — **rotacionar** |

---

## 6. Pontos de atenção urgentes

### 🔴 Bloqueador imediato — disco cheio no PC

Drives C: e G: estão chegando ao limite (estavam com 200 MB livres, agora ~1.7 GB depois de você liberar algo). O Write tool falhou com ENOSPC e **corrompeu o `app/page.tsx`** (ficou 0 bytes). Antes de qualquer coisa daqui pra frente, garantir pelo menos 5 GB livres no C:. Veja `PROXIMOS-PASSOS.md` para o passo a passo.

### 🟠 Secret key Supabase exposta no chat

A Secret Key (que começa com `sb_secret_`) apareceu visualmente no print quando você clicou em "Reveal" durante o setup. Embora apenas eu (a IA) tenha visto, conversas podem ser armazenadas. **Rotacione no painel Supabase** depois de terminar a migração — gere uma nova em **Settings → API Keys → New secret key** e apague a antiga.

### 🟠 Senha admin do site exposta no chat

A senha admin (a que está no `ADMIN_PASSWORD` do `.env.local`) apareceu em vários momentos durante a conversa. Trocar via `nano /var/www/advaqui/.env.local`, alterando o valor para uma senha nova de pelo menos 15 caracteres (letras, números e símbolos).

### 🟡 Mock-lawyers de demonstração

Após o deploy Supabase, o banco vai começar vazio. Os 10 advogados fictícios (Dr. Rafael Cardoso, Dra. Camila Pereira, Dr. Lucas Andrade etc.) **não vão aparecer**. Decisão futura — inserir como seeds via SQL ou começar zerado e divulgar para advogados reais cadastrarem.

### 🟡 Localização do servidor — Boston

VPS está em Boston, não São Paulo. Latência para visitantes brasileiros ~150ms (aceitável, não bloqueia). Se quiser migrar, abrir ticket Hostinger ou trocar de plano.

### 🟡 Riscos legais OAB

Provimento 205/2021 sobre publicidade de advogados, possível captação indevida, depoimentos fictícios na home, impedimento de procurador municipal. **Você decidiu analisar depois**. Não bloqueia funcionamento técnico mas merece revisão por advogado antes de divulgação ampla.

---

## 7. Como saber se está tudo OK

Visite `https://advaqui.com` no navegador (preferencialmente aba anônima para evitar cache):

- [ ] Home carrega com logo "AdvAqui" e busca por cidade
- [ ] Clicar em MG vai para `/advogados/mg` e lista as 853 cidades
- [ ] Clicar em Almenara vai para `/advogados/mg/almenara` (200, não 404)
- [ ] `https://advaqui.com/sitemap.xml` baixa XML
- [ ] `https://advaqui.com/admin` pede login (admin@... + senha do .env.local)

Se algum desses estiver quebrado, primeiro suspeito do PM2:

```
ssh root@187.77.5.38
pm2 status
pm2 logs advaqui --lines 50
```

---

## 8. Arquivos importantes para consulta rápida

| O que | Onde |
|---|---|
| Configuração central do site | `lib/config.ts` |
| Variáveis de ambiente do servidor | `/var/www/advaqui/.env.local` (no VPS, não no PC) |
| Schema SQL completo | `supabase/migrations/0001_initial_schema.sql` |
| Diretório do projeto local | `G:\Meu Drive\claude juridico certo\advaqui\` |
| Diretório do projeto no servidor | `/var/www/advaqui/` |
| Logs do site | `/var/log/nginx/advaqui-access.log` e `/var/log/nginx/advaqui-error.log` |
| Logs do PM2 | `pm2 logs advaqui` |

Veja também — `DECISOES.md` (por que cada escolha) e `PROXIMOS-PASSOS.md` (o que fazer a seguir).
