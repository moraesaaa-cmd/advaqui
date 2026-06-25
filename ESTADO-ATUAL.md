# AdvAqui — Estado atual

Última atualização — 25 de junho de 2026.

Este documento é a fotografia do projeto neste momento. Lista o que está rodando, o que está pronto, e quais são os pontos de atenção. Foi escrito para consultar quando voltar ou repassar para outra IA continuar.

---

## 1. O que está no ar agora

Site público acessível em — **https://advaqui.com**

- ✅ Redesign Apex no ar (navy `#0F1B2D` + amber/dourado)
- ✅ Tipografia Newsreader (títulos) + Public Sans (corpo)
- ✅ HTTPS válido (Let's Encrypt, renovação automática)
- ✅ ~16.000+ páginas geradas no build (SSG)
- ✅ 5.571 cidades brasileiras (IBGE) com URL própria
- ✅ Sitemaps: 55+ sitemaps, ~480.000 URLs indexáveis (inclui artigos do DB desde commit 078681c)
- ✅ Schema markup JSON-LD em todas as rotas indexáveis
- ✅ Supabase integrado (auth, banco, storage)
- ✅ Painel do advogado com 21 ferramentas
- ✅ Painel admin com KPIs, gestão de blog e gestão de advogados
- ✅ Premium: R$19,90/mês, Pix manual, admin ativa
- ✅ 3 ferramentas premium-gated: montar-peticao, recurso-de-multa, revisor-peticao
- ✅ 10 artigos seed + 7+ artigos gerados por IA (cron diário: 10 artigos/dia via OpenAI gpt-4o-mini)
- ✅ 317 tópicos de blog na fila de geração
- ✅ 6 cron jobs de jurisprudência (STJ) + 10 cron jobs de geração de artigos
- ✅ 6+ calculadoras interativas
- ✅ Responsivo 320px a 4K
- ✅ Acessibilidade — skip link, aria-labels, contraste WCAG AA, navegação por teclado

**Subdomínio** — **multas.advaqui.com** NO AR (landing própria, recurso de multa avulso R$9,90, Pix → admin libera → até 3 recursos IA).

**Versão em produção** — commit `078681c`, deploy via VPS.

---

## 2. Páginas e rotas

| Seção | Rota |
|---|---|
| Home | `/` |
| Planos | `/planos` |
| Blog | `/blog` |
| Ferramentas | `/ferramentas` |
| Calculadoras | `/calculadoras/*` (6+) |
| Diagnóstico | `/diagnostico` |
| Linha do tempo | `/linha-do-tempo` |
| Recurso de multa | `/recurso-de-multa` |
| Divórcio | `/divorcio` |
| Previdência | `/previdencia` |
| Triagem | `/triagem` |
| Processos (DataJud) | `/processos` |
| Agenda | `/agenda` |
| Imobiliário | `/imobiliario` |
| Prazos | `/prazos` |
| Glossário | `/glossario` |
| Guias | `/guias` |
| Problemas jurídicos | `/problemas-juridicos` |
| Jurisprudência | `/jurisprudencia` |
| Tribunais | `/tribunais` |
| Modelos | `/modelos` |
| Advogados por UF/cidade | `/advogados/[uf]/[cidade]` |
| Perfil do advogado | `/p/[slug]` |
| Painel do advogado | `/painel` |
| Admin | `/admin` |

---

## 3. Infraestrutura

| Item | Valor |
|---|---|
| VPS | Hostinger KVM 2 (2 vCPU, 8 GB RAM, 100 GB NVMe) |
| Sistema | Ubuntu 24.04 LTS |
| IP público | `187.77.5.38` |
| Hostname | `srv1679615.hstgr.cloud` |
| PM2 | Online, rodando `advaqui` |
| Domínio | `advaqui.com` (Hostinger, vence 2027-05-17) |
| **VPS vence** | **2026-07-17 (auto-renovação DESLIGADA)** |
| Servidor web | Nginx (proxy reverso 80/443 → 3000) |
| Runtime | Node.js 20 + npm |
| Gerenciador | PM2 (systemd unit `pm2-root.service`) |
| Localização | Boston (latência ~150ms para Brasil) |

---

## 4. Stack tecnológica

| Camada | Tecnologia |
|---|---|
| Frontend + Backend | Next.js 14.2 (App Router, SSR + SSG + ISR) |
| Linguagem | TypeScript (strict) |
| Estilo | Tailwind CSS 3.4 + Newsreader/Public Sans via next/font |
| Banco de dados | Supabase Postgres (ref `rtnxaqfhypbldztodlbz`) |
| Autenticação | Supabase Auth + cookie HMAC para admin |
| IA | OpenAI gpt-4o-mini (geração de artigos + recurso de multa) |
| Repositório | GitHub `moraesaaa-cmd/advaqui` |

---

## 5. Variáveis de ambiente no VPS

Configuradas em `/var/www/advaqui/.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`
- `ADMIN_SESSION_SECRET`
- `ADMIN_PASSWORD`
- `OPENAI_API_KEY`
- `CRON_SECRET`
- `DATAJUD_API_KEY`

---

## 6. Credenciais (lista, sem valores)

| # | Conjunto | Status |
|---|---|---|
| 1 | Conta Hostinger (hpanel.hostinger.com) | ✅ |
| 2 | SSH root VPS (`ssh root@187.77.5.38`) | ✅ |
| 3 | Domínio advaqui.com (renovação 2027-05-17) | ✅ |
| 4 | GitHub (`moraesaaa-cmd`) | ✅ |
| 5 | Admin do site (`/admin`) | ✅ |
| 6 | Supabase (URL + keys + senha banco) | ⚠ Secret key exposta — **rotacionar** |
| 7 | OpenAI API Key | ✅ |
| 8 | DataJud API Key | ✅ |

---

## 7. Pontos de atenção

### 🔴 VPS vence 2026-07-17

Auto-renovação está desligada. Se não renovar ou migrar, o site sai do ar em 22 dias.

### 🟠 Secret Key Supabase exposta

A Secret Key apareceu em chat anterior. Rotacionar no painel Supabase → Settings → API Keys → gerar nova → atualizar `.env.local` no VPS → `pm2 restart advaqui --update-env` → apagar a antiga.

### 🟠 SMTP não configurado

E-mails de cadastro/reset usam o rate limit free do Supabase (3/hora). Produção exige Resend ou equivalente.

### 🟡 Cold start de advogados

6 cadastrados, 1 spam. Sem advogados reais ativos usando a plataforma.

### 🟡 Search Console não cadastrado

Sitemaps com ~480k URLs existem mas não foram submetidos ao Google.

### 🟡 Sem analytics

Nenhum Microsoft Clarity, Plausible ou GA configurado.

---

## 8. Como verificar se está tudo OK

1. `https://advaqui.com` — home carrega com design Apex (navy + dourado)
2. `/advogados/mg` — lista cidades de MG
3. `/blog` — artigos aparecem (seed + gerados)
4. `/admin` — painel admin com KPIs
5. `/sitemap.xml` — XML válido
6. `multas.advaqui.com` — landing de recurso de multa

Se algo estiver quebrado:

```
ssh root@187.77.5.38
pm2 status
pm2 logs advaqui --lines 50
```

---

## 9. Arquivos importantes

| O que | Onde |
|---|---|
| Projeto local | `G:\Meu Drive\claude juridico certo\advaqui\` |
| Projeto no VPS | `/var/www/advaqui/` |
| Variáveis de ambiente | `/var/www/advaqui/.env.local` |
| Logs Nginx | `/var/log/nginx/advaqui-access.log` e `error.log` |
| Logs PM2 | `pm2 logs advaqui` |
| Decisões | `DECISOES.md` |
| Próximos passos | `PROXIMOS-PASSOS.md` |
