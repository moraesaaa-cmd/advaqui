# AdvAqui — Decisões técnicas e de produto

Este documento registra as escolhas feitas ao longo da construção do AdvAqui, com a justificativa de cada uma e as alternativas que foram descartadas. Serve para você consultar quando precisar mudar algo, e para outra IA entender por que estamos onde estamos.

---

## 1. Decisões de produto

### 1.1 — Posicionamento

**AdvAqui é uma vitrine B2C** (cidadão buscando advogado) com SEO local agressivo. Não é marketplace de correspondência jurídica (B2B advogado x advogado, modelo do Jurídico Certo), não é portal de notícias jurídicas (Jusbrasil), não é leilão.

**Por quê** — análise inicial mostrou que o Jurídico Certo (concorrente direto) tem nota baixa no Reclame Aqui justamente por causa do modelo de leilão que avilta honorários. Posicionar como vitrine local, sem leilão, sem comissão sobre serviços, é defensável.

**Diferencial competitivo** — URLs por especialidade + cidade (ex.: `/advogados/sp/sao-paulo/trabalhista`). O Jurídico Certo não tem essa estrutura. É a maior oportunidade SEO local.

### 1.2 — Modelo financeiro

| Item | Valor | Justificativa |
|---|---|---|
| Plano gratuito | R$ 0 | Capta cadastros sem fricção, gera massa para tráfego SEO |
| Plano premium | R$ 19,90/mês | Preço vigente no site (lib/config.ts PIX_AMOUNT=19.90); abaixo dos concorrentes p/ ganhar base |
| Pagamento | Apenas Pix | Zero risco de chargeback, zero taxa de gateway, simples para advogado leigo |
| Ativação | Manual em até 48h pelo admin | Modelo bootstrap — não exige integração com webhook de pagamento |
| Fidelidade | Nenhuma, cancelamento livre | Diferencia do Jurídico Certo que tem reclamações de dificuldade de cancelar |
| Renovação | Manual (nova ativação a cada 30 dias) | Sem dor de chargeback, sem assinatura quebrada |
| Chave Pix | `68852fb1-adfe-4656-bb9a-63d20cd73ce1` (chave aleatória) | Fixa, configurada em `.env.local` |

**Por que Pix manual ao invés de assinatura recorrente** — assinatura recorrente exige integração com gateway (Stripe, MercadoPago, OpenPix), webhooks, idempotência, retry de falhas, etc. Pix manual é o caminho mais simples para começar e aceitável para R$ 19,90/mês com poucas dezenas de advogados.

**Quando trocar por Pix recorrente automatizado** — quando passar de 50 advogados pagantes e o trabalho manual da ativação virar gargalo. Pix Automático foi regulamentado pelo Bacen e tem APIs como OpenPix/Woovi.

### 1.3 — Comunicação ética

Todo texto do site segue regra rígida — **nunca prometer resultado**. Vocabulário aprovado:

- "Aumente sua visibilidade"
- "Melhore sua presença local"
- "Seja encontrado por mais pessoas"
- "Destaque seu perfil"
- "Potencialize suas oportunidades"
- "Ganhe mais exposição dentro da plataforma"

Vocabulário **proibido**:

- "Garantimos clientes"
- "Garantimos primeiro lugar no Google"
- "Você vai captar X clientes"
- "O melhor advogado"
- "O mais barato"
- "Resultado garantido"

**Por quê** — proteção contra Provimento 205/2021 da OAB (publicidade de advogados), CDC art. 37 (publicidade enganosa), e mantém credibilidade.

### 1.4 — Sortimento de cidades

Cobertura nacional **total** — todos os 5.571 municípios brasileiros (IBGE), incluindo Almenara/MG e Jequitinhonha/MG (cidades onde o Moraes trabalha como procurador).

**Por quê** — diferencia do Jurídico Certo que cobre 2.000 cidades e do Jusbrasil que prioriza grandes centros. Cobertura total cria milhares de páginas long-tail "advogado em [cidade pequena]" onde a concorrência é zero.

**Como** — base IBGE persistida em `data/cities.json` (338 KB), gerada via `scripts/import-ibge.mjs`. Não depende de API externa em runtime.

### 1.5 — Nomes considerados

| Nome | Status | Por quê descartado/escolhido |
|---|---|---|
| Advocacia Brasil | Descartado | "Advocacia" remete a escritório, queremos transmitir serviço/encontro |
| JurisAqui | Descartado | `.com.br` já tomado |
| DireitoPerto | Descartado | `.com.br` já tomado |
| JusPerto | Descartado | `.com.br` já tomado |
| AchaJus | Descartado | `.com.br` já tomado |
| **AdvAqui** | **ESCOLHIDO** | `.com.br` tomado, mas `.com` disponível |

Domínio final — **`advaqui.com`** (Hostinger, 3 anos, ~R$ 53/ano em média).

---

## 2. Decisões técnicas

### 2.1 — Stack frontend/backend

**Escolha — Next.js 14 (App Router) + TypeScript + Tailwind CSS**

Alternativas avaliadas:

| Stack | Por que não |
|---|---|
| WordPress + HivePress + WooCommerce | Performance ruim com 89k páginas, dependência de plugins, segurança de plugins terceiros |
| Bubble.io | No-code mas limita SEO técnico e custa USD 29-115/mês |
| Wix com Velo | CMS limitado, SEO técnico fraco, vendor lock-in |
| Sharetribe/Yclas | USD 99-299/mês, modelo de marketplace que não é o nosso |
| Next.js + Supabase | **Escolhido** — open source, performance otimizada, SEO técnico nativo |

**Por que Next.js 14 especificamente:**

- SSG + ISR (Incremental Static Regeneration) — pré-gera 4.077 páginas no build e gera as demais sob demanda
- App Router — Server Components reduzem JS no cliente, melhor para Core Web Vitals
- Server Actions e Route Handlers — backend integrado, sem precisar API separada
- next/font — fontes auto-hospedadas, sem chamada a Google Fonts no client (LCP melhor)
- Comunidade grande, documentação extensa, IA bem treinada nele

### 2.2 — Hospedagem

**Escolha — Hostinger VPS KVM 2 (Ubuntu 24.04, Boston)**

Alternativas avaliadas:

| Opção | Por que não |
|---|---|
| Vercel (free) | Tecnicamente melhor para Next.js (feito pelos criadores), grátis, deploy automático — mas você quis usar Hostinger porque já comprava lá. **Resolvido** — Hostinger VPS funciona |
| Hostinger Shared Hosting | Plano R$ 12/mês é só PHP/WordPress, não roda Node.js |
| Hostinger Cloud Hosting | Suporte Node.js parcial |
| AWS / DigitalOcean / Linode | Mais técnico para leigo, configuração de Linux do zero |

**Configuração escolhida** — KVM 2 com 8 GB RAM (sobrava com folga para build de 4.077 páginas), 2 vCPU, 100 GB NVMe. Custo R$ 43,99/mês promo → R$ 77,99/mês após 24 meses.

**Por que Ubuntu** e não Debian/AlmaLinux — Ubuntu é o sistema Linux mais documentado, tutoriais e Stack Overflow respondem em Ubuntu por padrão. Garante que comandos `apt install` funcionem direto.

### 2.3 — Estratégia SSG + ISR

**Escolha — híbrido SSG para páginas críticas + ISR para o resto**

| Tipo de página | Estratégia | Quantidade |
|---|---|---|
| Páginas estáticas (home, planos, sobre etc.) | SSG | ~17 |
| Estados (`/advogados/[uf]`) | SSG completo | 27 |
| Cidades grandes (estados com ≤200 cidades + 200 maiores dos estados grandes + capitais) | SSG | ~3.565 |
| Cidades restantes | ISR | ~2.006 |
| Capital × especialidade | SSG (405 = 27 × 15) | 405 |
| Demais cidade × especialidade | ISR | ~83.160 |
| Perfis individuais | ISR | dinâmico |

**Por que híbrido** — pré-gerar 89 mil páginas no build estouraria o tempo de build da Vercel (45 min) e da Hostinger. ISR gera sob demanda no primeiro acesso e cacheia, mantendo TTFB baixo após primeira visita.

**Garantia anti-órfã** — `dynamicParams = true` nas rotas dinâmicas + função `findCity` que valida contra cities.json IBGE. Toda cidade brasileira tem URL conhecida, todas estão no sitemap, ISR materializa quando precisar.

### 2.4 — Sitemap em escala

**Escolha — sitemap index + sitemaps por UF**

| Sitemap | Conteúdo |
|---|---|
| `/sitemap.xml` | Páginas estáticas + estados + capitais × especialidades + perfis |
| `/sitemap-cidades/sitemap/[0..26].xml` | Cidades de cada UF (max SP = 645 URLs) |
| `/sitemap-especialidades/sitemap/[0..26].xml` | Cidade × especialidade de cada UF (max SP = 9.675 URLs) |

**Por que** — limite do Google é 50.000 URLs por sitemap. Como temos ~89.000 URLs, precisamos dividir. Dividir por UF é semanticamente correto (cidades de SP vão num sitemap próprio, MG outro, etc.).

`robots.txt` lista todos os 55 sitemaps para o Google descobrir.

### 2.5 — Banco de dados

**Escolha inicial — `localStorage` do navegador (MVP visual)**
**Escolha atual — Supabase (PostgreSQL managed) — em migração**

**Por que migrar** — `localStorage` é isolado por navegador. Cada visitante vê só os próprios cadastros. Inadequado para diretório real. **Identificado tarde no projeto** (depois do site no ar). Migração em andamento.

**Por que Supabase** e não Firebase/MongoDB/MySQL próprio:

| Banco | Por que não |
|---|---|
| Firebase (Firestore) | NoSQL, queries complexas mais difíceis, vendor lock-in Google |
| MongoDB Atlas | Sem SQL nativo, custo escala mais rápido |
| MySQL/Postgres self-hosted | Backup, monitoring, replicação são trabalho extra |
| **Supabase** | **Escolhido** — Postgres real, autenticação pronta, Storage para fotos, plano free generoso (500 MB banco, 1 GB storage, 50 mil usuários ativos), RLS nativo, painel admin pronto, edge functions, SDK JavaScript que casa com React |

**Plano Supabase escolhido — Free** (R$ 0/mês). Suficiente até passar de 50 mil usuários ativos. Quando crescer, plano Pro custa USD 25/mês.

**Região do banco — South America (São Paulo)** — latência ~10ms para visitantes brasileiros, contrasta com VPS em Boston. Quem consulta dados (visitante carregando página de cidade) usa SDK Supabase no servidor (Boston → São Paulo ~150ms uma vez, depois cache ISR). Quem se cadastra (advogado) usa cliente direto no navegador → Supabase São Paulo (~10ms).

### 2.6 — Autenticação

**Escolha — Supabase Auth para advogados + cookie HMAC para admin**

Por que duas estratégias diferentes:

**Advogados (Supabase Auth):**

- Senha hashada com bcrypt pelo Supabase (seguro por padrão)
- Magic link possível no futuro
- Recuperação de senha via e-mail nativa
- Verificação de e-mail nativa
- Rate limiting do lado do Supabase
- Trigger `handle_new_user` cria linha em `lawyers` automaticamente quando user é criado em `auth.users`

**Admin (cookie HMAC simples):**

- Não há "admin signup" — credenciais fixas em `.env.local` (ADMIN_EMAIL + ADMIN_PASSWORD)
- Endpoint `/api/auth/admin` valida credenciais server-side e seta cookie httpOnly assinado com HMAC SHA-256 (`ADMIN_SESSION_SECRET`)
- Validade do cookie — 24h
- Rate limit em memória — 5 tentativas em 15 min → lock de 5 min
- Função `isAdminRequest()` verifica em Route Handlers e Server Components

**Por que não usar Supabase Auth também para admin** — admin é um usuário só, conhecido, fixo. Criar tabela `admins`, signup, magic link, etc. seria over-engineering. Cookie HMAC + env vars resolve com 50 linhas de código.

### 2.7 — Row Level Security (RLS)

**Política — RLS ativado em todas as tabelas**

| Tabela | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `lawyers` | público (sem CPF) | só trigger (signup) | próprio usuário | só service_role |
| `messages` | só dono ou admin | público (anon ou auth) | só admin | só admin |
| `plan_history` | só dono | só admin | só admin | só admin |
| `audit_logs` | só admin | só admin | não | não |

**Risco residual** — CPF está na tabela `lawyers` com RLS de SELECT público. Solução adotada — código nunca seleciona `cpf` em consultas públicas (`PUBLIC_COLUMNS` const explicita as colunas seguras). Mais robusto seria criar uma `view` `public_lawyers` sem CPF. Fica para refinamento.

### 2.8 — Pagamento Pix

**Escolha — payload Pix Bacen gerado client-side via biblioteca `qrcode`**

Por que não usar OpenPix/Woovi/PagBank/MercadoPago:

- Para gerar Pix estático (apenas chave + valor), não precisa de gateway
- Não precisamos de notificação automática (ativação é manual pelo admin)
- Economiza taxa do gateway (0.8% a 1%)
- Sem dependência de API externa
- Sem webhook (e portanto sem complexidade de idempotência)

Implementação — `lib/pix/qrcode.ts` constrói o payload conforme padrão Bacen (BR Code) — TLV (Tag-Length-Value), CRC-16 conforme spec. QR Code renderizado client-side em `<canvas>` via `qrcode` npm.

**Quando trocar por gateway com webhook** — quando volume de pagamentos manuais virar gargalo (provavelmente >50 advogados pagantes ativos).

---

## 3. Decisões adiadas

### 3.1 — Riscos legais e regulatórios

**Você decidiu adiar para análise futura.**

Itens conhecidos:

1. **Provimento 205/2021 da OAB** — regula publicidade de advogados. "Destaque", "mais clientes", "fechar contratos" podem ser interpretados como captação indevida de clientela (art. 7º do Código de Ética da OAB)
2. **Procurador municipal × atividade comercial paralela** — Estatuto da OAB art. 30, II e regulamentos da Procuradoria Geral do Município sobre acumulação de atividades
3. **Registro de marca "AdvAqui" no INPI** — busca em classe 35 (publicidade), 42 (tecnologia) e 45 (serviços jurídicos)
4. **Tributação da assinatura Pix mensal** — recebimento via chave pessoal pode configurar atividade profissional irregular (Receita Federal, ISS Jequitinhonha)
5. **Depoimentos fictícios** — risco de publicidade enganosa (CDC art. 37). **Já substituído** por prova social estrutural (números) na home
6. **LGPD e ANPD** — política de privacidade precisa de DPO real (e-mail/nome do encarregado). Hoje aponta para `kellsons39@gmail.com`

**Recomendação minha** — antes de divulgar para advogados além do círculo pessoal, consultar advogado especialista em direito empresarial e digital.

### 3.2 — SMTP de produção

Supabase usa SMTP de teste no plano free — limite 3 e-mails por hora. Para produção, configurar SMTP em **Project Settings → Auth → SMTP Settings** com:

- Resend (3 mil e-mails grátis/mês)
- Brevo (300 e-mails grátis/dia)
- AWS SES (custa USD 0,10 por mil)

### 3.3 — Analytics

Não tem nada instalado. Quando precisar, opções:

- **Plausible** (USD 9/mês ou self-host grátis) — privacy-friendly, sem cookies
- **Umami** (grátis self-host)
- **Microsoft Clarity** (grátis, mostra heatmap e gravação de sessão)
- **Google Analytics 4** (grátis, mais completo, mais invasivo)

### 3.4 — CAPTCHA

Hoje só honeypot (campo escondido). Para produção real, adicionar **Cloudflare Turnstile** (grátis, invisible, melhor que reCAPTCHA do Google).

### 3.5 — Backup automatizado

Supabase Free faz backup diário, mas só guarda 7 dias. Para mais retenção, pago. Para banco crítico, considerar export semanal automatizado para Google Drive ou S3.

---

## 4. Notas de implementação importantes

### 4.1 — Por que `getLawyerCountsByCity` em uma query só

A página `/advogados/[uf]` mostra todas as cidades do estado com contagem de advogados. Estado MG tem 853 cidades. Se fizesse `getLawyersForCity(uf, city)` para cada uma, seriam 853 queries (N+1 clássico). A função `getLawyerCountsByCity(uf)` faz **1 query** que retorna `{ city_slug: count }` agregado na aplicação. Ganho de performance ~800x.

### 4.2 — Por que slug do advogado é gerado no trigger

Quando user faz `supabase.auth.signUp({ email, password, options: { data: { name, ... } } })`, o trigger `handle_new_user` lê `raw_user_meta_data` e:

1. Gera slug base = `slugify(name)` via `unaccent + regex`
2. Verifica unicidade — se já existir, anexa `-1`, `-2`, etc.
3. Insere linha em `lawyers` com FK para `auth.users(id)`

Isso evita race conditions e garante que slug + perfil sejam criados atomicamente.

### 4.3 — Por que `dynamicParams = true` em quase todas as rotas

Significa que se o slug não estiver na lista do `generateStaticParams`, o Next.js gera a página sob demanda (ISR) em vez de retornar 404. Combina com nossa estratégia de cobertura nacional — qualquer cidade IBGE válida funciona, mesmo as não pré-renderizadas.

### 4.4 — Por que separar `lib/data/lawyers.ts` em funções públicas e admin

Funções `get*` usam `createClient` server (respeita RLS, anon key).
Funções `admin*` usam `createAdminClient` (service_role, ignora RLS).

A separação evita acidente — service_role nunca vai parar em código que renderiza no browser. Por isso `createAdminClient` está num arquivo separado (`lib/supabase/admin.ts`).

---

## 5. Recomendações para outra IA / dev assumindo

1. **Antes de qualquer mudança** — `npm run validate:cities` e `npm run build` localmente para garantir baseline
2. **Mudanças no schema** — adicionar nova migration em `supabase/migrations/` numerada (ex.: `0002_xxx.sql`), nunca editar a 0001
3. **Adicionar nova tabela** — atualizar `lib/supabase/types.ts` para tipos, criar `lib/data/[tabela].ts` para acesso, escrever RLS policies na migration
4. **Adicionar nova rota admin** — adicionar case no switch de `app/api/admin/route.ts`, sempre verificando `isAdminRequest()` no início
5. **Deploy** — push GitHub → `git pull && npm install && npm run build && pm2 restart advaqui` no VPS
6. **Rotação de SECRET KEY Supabase** — gerar nova em Supabase Settings → API Keys → criar nova → atualizar `.env.local` no VPS → `pm2 restart advaqui --update-env` → apagar a antiga
