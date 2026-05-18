# AdvAqui — Auditoria Técnica e Plano de Correção

**Data inicial** — 18/05/2026
**Branch base** — `main`
**Responsável técnico** — Claude (assistente)
**Aprovador** — Moraes (procurador municipal, dono do projeto)

Este documento centraliza problema → solução → trade-off de cada item da
auditoria. Atualizado conforme cada épico avança.

---

## FASE 1 — Mapeamento (relatório, não modifica código)

### 1.1 — Estrutura de pastas

```
advaqui/
├── app/                          App Router (Next.js 14)
│   ├── admin/                    Painel admin (use client)
│   ├── advogados/                Diretório público
│   │   ├── [uf]/                 Estado (27 SSG)
│   │   │   ├── [cidade]/         Cidade (3.565 SSG + 2.006 ISR)
│   │   │   │   └── [especialidade]/ Cidade × especialidade
│   ├── api/                      Route Handlers
│   │   ├── admin/                Router unificado (10 ações)
│   │   ├── auth/{admin,logout}/  Cookie HMAC + logout Supabase
│   │   ├── cities/               Autocomplete IBGE
│   │   └── lawyers/search/       Busca pública
│   ├── aviso-legal/              Estática
│   ├── buscar/                   Busca (use client)
│   ├── cadastro/                 3 passos (use client)
│   ├── contato/                  Formulário (use client)
│   ├── faq/                      Accordion (use client)
│   ├── login/                    Tenta admin → Supabase Auth
│   ├── p/[slug]/                 Perfil público
│   ├── painel/                   Painel advogado (use client)
│   │   └── pagamento/            Fluxo Pix
│   ├── planos/                   Comparativo
│   ├── privacidade/              Estática
│   ├── recuperar-senha/          Reset email Supabase
│   ├── redefinir-senha/          Callback do reset
│   ├── sitemap-cidades/          Sub-sitemap por UF (27)
│   ├── sitemap-especialidades/   Sub-sitemap por UF (27)
│   ├── sobre/                    Estática
│   ├── termos/                   Estática
│   ├── layout.tsx                Root + metadata + fontes + JSON-LD
│   ├── globals.css               Tailwind + tokens
│   ├── not-found.tsx             ✅ existe (mas básico)
│   ├── robots.ts                 ✅ aponta pra sitemap + sub-sitemaps
│   ├── sitemap.ts                ✅ index principal
│   ├── icon.tsx                  ✅ favicon dinâmico
│   └── page.tsx                  Home
├── components/                   10 componentes
│   ├── Breadcrumb.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── JsonLd.tsx                Helper genérico de JSON-LD
│   ├── LawyerCard.tsx
│   ├── Logo.tsx
│   ├── PixDisplay.tsx
│   ├── PlanBadge.tsx
│   ├── SearchBox.tsx
│   └── Toast.tsx
├── lib/
│   ├── auth/adminSession.ts      HMAC SHA-256 cookie httpOnly
│   ├── data/
│   │   ├── cities.ts             Helpers IBGE
│   │   ├── lawyer-mapper.ts      Tipos puros (criado pra fix de build)
│   │   ├── lawyers.ts            CRUD Supabase
│   │   ├── messages.ts           CRUD mensagens
│   │   ├── mock-lawyers.ts       Dados fake (legado)
│   │   ├── specialties.ts        15 especialidades
│   │   ├── states.ts             27 UFs
│   │   └── templates.ts          Variações de texto SEO
│   ├── pix/                      Geração de payload Pix
│   ├── seo/{metadata,schema}.ts  Helpers SEO
│   ├── store/localStore.ts       DEPRECATED (stubs)
│   ├── supabase/
│   │   ├── admin.ts              service_role
│   │   ├── client.ts             Browser
│   │   ├── server.ts             SSR com cookies
│   │   └── types.ts              Database type
│   └── utils/{format,slug,validation}.ts
├── data/
│   ├── cities.json               5.571 cidades IBGE (487 KB)
│   └── ibge-municipios.json      Backup IBGE (220 KB)
├── public/                       ⚠️ VAZIA (sem favicon, sem og-default)
├── scripts/                      Scripts utilitários
├── supabase/migrations/          SQL inicial
└── Configurações na raiz
    ├── next.config.js
    ├── package.json
    ├── tailwind.config.ts
    └── tsconfig.json
```

**Sem `pages/` legacy.** App Router puro.

### 1.2 — Versões de dependências (package.json)

| Pacote | Versão | Categoria |
|---|---|---|
| `next` | **14.2.30** | Framework |
| `react` / `react-dom` | 18.3.1 | UI |
| `@supabase/supabase-js` | 2.45.4 | BaaS |
| `@supabase/ssr` | 0.5.1 | SSR auth |
| `lucide-react` | 0.439.0 | Ícones |
| `tailwindcss` | 3.4.10 | CSS |
| `clsx` | 2.1.1 | Class utils |
| `qrcode` | 1.5.4 | QR Code Pix |
| `typescript` | 5.5.4 | Tipos |
| `eslint` | 8.57.0 | Lint |

**Não tem** — shadcn/ui, Radix UI, Headless UI, Prisma, Auth.js, web-vitals,
react-hook-form, zod, framer-motion, lodash.

### 1.3 — Roteamento dinâmico

| Rota | `generateStaticParams` | `dynamicParams` | `revalidate` | `notFound()` |
|---|---|---|---|---|
| `/advogados/[uf]` | Sim — 27 UFs do `STATES` | **`false`** | 3600 | Sim (se `findState()` retorna null) |
| `/advogados/[uf]/[cidade]` | Sim — `getSsgCityParams()` (3.565 paths) | **`true`** | 3600 | Sim |
| `/advogados/[uf]/[cidade]/[especialidade]` | Sim — 27 capitais × 15 especialidades = 405 | **`true`** | 3600 | Sim |
| `/p/[slug]` | Sim — `getAllLawyerSlugs()` (dinâmico) | **`true`** | 3600 | Sim |

**`not-found.tsx`** — só global em `app/not-found.tsx` (genérico). Sem
`not-found.tsx` por rota dinâmica (épico 1.3).

### 1.4 — Fonte de dados de cidades

| Arquivo | Tamanho | Conteúdo |
|---|---|---|
| `data/cities.json` | **487 KB** (linha única, formato compacto) | **5.571 municípios IBGE** — `{i, n, s, u}` (id, nome, slug, uf) |
| `data/ibge-municipios.json` | 220 KB | Backup com mesorregião/microrregião |
| `lib/data/cities.ts` | 209 linhas | `getAllCities()`, `findCity()`, `getSsgCityParams()`, slugs de capitais |

**Slugs determinísticos via IBGE — sem ambiguidade entre "São Paulo, SP" e "São Paulo do Potengi, RN".**

### 1.5 — Formulários

#### `/contato` (`app/contato/page.tsx`)
- Campos: `name`, `email`, `message`
- ✅ Honeypot (`form.honeypot`)
- ✅ Validação client (`isValidEmail`, mensagem ≥ 10 chars)
- ❌ **Sem checkbox LGPD** (épico 3.1)
- ❌ **Sem máscara** (não tem telefone)
- ❌ **Sem rate limit** (insert direto no Supabase via client browser)
- ❌ **Sem confirmação de consentimento persistida**

#### `/cadastro` (`app/cadastro/page.tsx`)
- 3 passos com progress bar
- ✅ Máscaras (`formatCpf`, `formatPhone`, `formatCep`)
- ✅ Validações (`isValidCpf` só conta dígitos — épico 3.3), `isValidEmail`, `isValidOab`, `isValidPhone`, `isStrongPassword`
- ✅ Honeypot
- ✅ Dois checkboxes (Termos + LGPD)
- ✅ **Autocomplete cidade já corrigido** (commit `1747d09`) — sugere só nome, hint claro, UF antes da cidade
- ❌ Validador CPF módulo 11 (épico 3.3)
- ❌ Sem CAPTCHA / rate limit
- ❌ Sem opção de adicionar nova cidade (todas as 5.571 IBGE já são aceitas — UX confusa)

#### `/faq` (`app/faq/page.tsx`)
- ✅ Accordion funciona via `useState<number | null>` + `aria-expanded`
- ✅ 10 perguntas
- ❌ **Sem JSON-LD `FAQPage`** (épico 4.1 / 2.9)
- ⚠️ Implementação custom em vez de `<details>` ou Radix — funcional mas sem fallback nativo

### 1.6 — Arquivos SEO

| Arquivo | Status |
|---|---|
| `app/layout.tsx` | ✅ `metadataBase`, ✅ `title.template`, ✅ Open Graph, ❌ `keywords` (deveria sair — épico 2.8) |
| `app/sitemap.ts` | ✅ Sitemap index principal |
| `app/sitemap-cidades/sitemap.ts` | ✅ Sub-sitemap por UF (27 sitemaps) |
| `app/sitemap-especialidades/sitemap.ts` | ✅ Sub-sitemap por UF (27 sitemaps) |
| `app/robots.ts` | ✅ Aponta pra sitemap + sub-sitemaps; bloqueia `/admin`, `/painel`, `/api/` |
| `app/icon.tsx` | ✅ Favicon dinâmico |
| `app/opengraph-image.tsx` | ❌ **Não existe** (épico 2.2) |
| `public/og-default.png` | ❌ **Não existe** — pasta `public/` está vazia (épico 2.1) |
| `lib/seo/schema.ts` | ✅ `orgSchema`, `websiteSchema`, `breadcrumbSchema`, `lawyerSchema`, `cityServiceSchema` |
| `lib/seo/metadata.ts` | ✅ `buildMetadata()` helper |
| `components/JsonLd.tsx` | ✅ Componente genérico |
| JSON-LD aplicado | Home (Org + WebSite), `/advogados/*` (Breadcrumb), `/p/[slug]` (LegalService) |
| JSON-LD faltando | `FAQPage`, `ItemList` em cidade, `SearchAction` no WebSite (épico 2.9) |

### 1.7 — Segurança e headers

`next.config.js` atual:
```js
async headers() {
  return [{
    source: "/(.*)",
    headers: [
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }
    ]
  }];
}
```

**Faltam** (épico 5.1):
- `Strict-Transport-Security` (HSTS)
- `Permissions-Policy`
- `Content-Security-Policy`

**Sem `middleware.ts`** — autenticação admin via cookie HMAC checado em
cada Route Handler manualmente (`lib/auth/adminSession.ts`).

**Auth**:
- Admin — endpoint `/api/auth/admin` com rate limit 5 tentativas / 5min
- Lawyer — Supabase Auth (signInWithPassword)
- Recuperação — Supabase Auth (`resetPasswordForEmail`)
- ⚠️ Mensagem de recuperação revela se email existe (épico 5.2)

### 1.8 — Resultado do `npm run build` (VPS 18/05)

**Build passou completo após commits `b403b8b`, `73c715a`, `2974625`.**

Resumo da árvore (do print do user):
```
o /                                                  Static
o /advogados                                         Static
o /advogados/[uf]                       191 B  96.1 kB   27 SSG
o /advogados/[uf]/[cidade]              191 B  96.1 kB   3.565 SSG + ISR
o /advogados/[uf]/[cidade]/[especialidade] 191 B 96.1 kB  405 SSG + ISR
o /aviso-legal                          155 B 87.4 kB
o /buscar                              2.23 kB 98.1 kB
o /cadastro                            7.58 kB  140 kB
o /contato                             3.81 kB  128 kB
o /faq                                 3.66 kB 90.9 kB
o /login                                  3 kB  136 kB
● /p/[slug]                             191 B 96.1 kB    Generated on demand
o /painel                              8.31 kB  141 kB
o /painel/pagamento                    14.4 kB  147 kB
o /planos                               191 B 96.1 kB
o /privacidade                          155 B 87.4 kB
o /recuperar-senha                      3.5 kB  136 kB
o /redefinir-senha                     2.56 kB  135 kB
o /robots.txt                              0 B    0 B
● /sitemap-cidades/sitemap/[__metadata_id__]            27 sub-sitemaps
● /sitemap-especialidades/sitemap/[__metadata_id__]     27 sub-sitemaps
o /sitemap.xml                             0 B    0 B
o /sobre                                155 B 87.4 kB
o /termos                               155 B 87.4 kB

f /api/admin                              0 B    0 B    Dynamic
f /api/auth/admin                         0 B    0 B    Dynamic
f /api/auth/logout                        0 B    0 B    Dynamic
f /api/cities                             0 B    0 B    Dynamic
f /api/lawyers/search                     0 B    0 B    Dynamic

First Load JS shared by all              87.2 kB
  ├ chunks/117-35d6eb6a2cec1129.js       31.6 kB
  ├ chunks/fd9d1056-16bf99f131ea3826.js  53.6 kB
  └ other shared chunks (total)          1.98 kB
```

**Nenhum erro fatal**. Único warning detectado:
- `./components/PixDisplay.tsx 37:11` — `<img>` em vez de `<Image />` (épico 7.2)

**PM2** — `advaqui | online | 14471 | 60.9mb | 33+ min uptime` (do último print).

---

## Conclusão da FASE 1

**Status geral** — Site funcional em produção após correções dos 3 commits
de build. Faltam refinamentos sistemáticos em SEO, LGPD, segurança e UX
que serão atacados na FASE 3 por épico.

**3 problemas reportados pelo Moraes que precisam de validação imediata**:

1. **404 em `/advogados/[uf]`** — provavelmente do build velho. O build novo
   gerou 27 páginas estáticas conforme árvore. **Pedindo confirmação por curl**.

2. **Cadastro exige "Almenara,MG"** — corrigido no commit `1747d09`. UX nova:
   UF antes da cidade, autocomplete mostra só nome, hint claro. **Pedindo
   teste no /cadastro passo 2**.

3. **"Não tem opção de adicionar cidade"** — todas as 5.571 cidades IBGE
   estão pré-cadastradas. A UX atual confunde porque o autocomplete
   só sugere; mas qualquer texto livre é aceito. **Endereçado no épico 4.3**
   (autocomplete melhor) e **épico 4.2** (empty state explica).

---

## Próximos passos

**FASE 2** — Plano priorizado por épico (P0 → P5). Será apresentado na
próxima rodada para aprovação do Moraes.

**FASE 3** — Execução épico por épico, com diff resumido e aguardando
revisão entre cada.
