# AdvAqui — Próximos passos

Roadmap dividido por urgência. Os blocos do topo são bloqueadores — sem resolvê-los o site não fica completo. Conforme desce, vai virando melhoria estratégica.

---

## 🔴 Bloqueador imediato — disco cheio

O disco C: e G: estavam com menos de 250 MB livres. O Write tool falhou com ENOSPC e corrompeu `app/page.tsx`. Antes de qualquer trabalho de código, precisa liberar **pelo menos 5 GB livres no C:**.

### Como liberar espaço (escolha as opções que se aplicam)

1. **Lixeira do Windows** — botão direito → "Esvaziar Lixeira"
2. **Limpeza de Disco** — tecla Windows → digite "Limpeza de disco" → Enter → C: → marcar tudo → "Limpar arquivos do sistema" → OK
3. **Configurações → Sistema → Armazenamento** — abre visão visual do que está consumindo, com botões pra liberar
4. **Cache do Google Drive** — pode estar em `C:\Users\Pichau\AppData\Local\Google\DriveFS\` (verifique tamanho)
5. **Downloads antigos** — `C:\Users\Pichau\Downloads`
6. **Pasta `node_modules` em projetos antigos** — costuma ter centenas de MB cada
7. **Logs e cache de programas** — Chrome cache, Discord, etc.

### Como confirmar que liberou

No PowerShell:

```
Get-WmiObject Win32_LogicalDisk | Where-Object {$_.DeviceID -eq 'C:'} | Format-Table DeviceID, @{N='Livre(GB)';E={[math]::Round($_.FreeSpace/1GB,1)}}
```

Quando aparecer 5 GB ou mais → próximo passo.

---

## 🔴 Bloqueador imediato — finalizar migração Supabase

Depois de liberar disco, tem **4 arquivos para terminar de adaptar** e algumas tarefas operacionais. Aqui o passo a passo.

### Passo 1 — Restaurar `app/page.tsx`

No PowerShell, na pasta do projeto:

```
cd "G:\Meu Drive\claude juridico certo\advaqui"
git checkout app/page.tsx
```

Isso restaura a versão pré-migração (com MOCK_LAWYERS). Em seguida, adaptar manualmente trocando:

```ts
import { MOCK_LAWYERS } from "@/lib/data/mock-lawyers";
// ...
const totalLawyers = MOCK_LAWYERS.length;
```

Por:

```ts
import { getLawyerCount } from "@/lib/data/lawyers";
// ...
export const revalidate = 600;
export default async function HomePage() {
  const totalLawyers = await getLawyerCount();
```

(A função `HomePage` precisa ser `async`.)

### Passo 2 — Adaptar `app/buscar/page.tsx`

Trocar busca em MOCK_LAWYERS por chamada Supabase. Manter o componente Client + fetch para `/api/cities` que já existe e funciona.

### Passo 3 — Adaptar sitemap

`app/sitemap.ts`, `app/sitemap-cidades/sitemap.ts`, `app/sitemap-especialidades/sitemap.ts` ainda referenciam `MOCK_LAWYERS`. Trocar por `getAllLawyerSlugs()` (já criada em `lib/data/lawyers.ts`).

### Passo 4 — Atualizar `.env.example`

Adicionar:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxx
SUPABASE_SECRET_KEY=sb_secret_xxxxxxxxxxxx
ADMIN_SESSION_SECRET=defina_um_segredo_aleatorio_de_pelo_menos_32_caracteres
```

### Passo 5 — Criar `middleware.ts` (opcional, recomendado)

Para que a sessão Supabase Auth seja renovada automaticamente entre páginas. Documentação oficial Supabase tem snippet pronto.

### Passo 6 — Push para GitHub

GitHub Desktop → commit → push.

### Passo 7 — Configurar Supabase

#### 7.1 Rodar o schema SQL

1. Abrir https://supabase.com → seu projeto `advaqui`
2. Menu lateral → **SQL Editor** (ícone </> )
3. Botão **+ New query**
4. Abrir o arquivo `supabase/migrations/0001_initial_schema.sql` no PC
5. Copiar todo conteúdo, colar no editor
6. Botão **Run** (ou Ctrl+Enter)
7. Aguardar mensagem "Success. No rows returned"

Você verá no painel **Database → Tables** as 4 tabelas criadas (`lawyers`, `messages`, `plan_history`, `audit_logs`).

#### 7.2 Confirmar trigger criado

No painel → **Database → Triggers** → procurar `on_auth_user_created` ativo na tabela `auth.users`.

### Passo 8 — Atualizar `.env.local` no VPS

No Browser Terminal Hostinger:

```
cd /var/www/advaqui
nano .env.local
```

Adicionar no final do arquivo:

```
NEXT_PUBLIC_SUPABASE_URL=https://rtnxaqfhypbldztodlbz.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_uyVXC8BBUIJbKTQShGBrHQ_xFvrp_-s
SUPABASE_SECRET_KEY=<cole aqui a secret do seu arquivo de credenciais>
ADMIN_SESSION_SECRET=<gerar um valor aleatório de 32+ caracteres>
```

Para gerar o `ADMIN_SESSION_SECRET` automaticamente:

```
openssl rand -hex 32
```

Copie a saída (algo como `a1b2c3...`) e cole no `.env.local`.

Salvar — `Ctrl+X`, `Y`, Enter.

### Passo 9 — Deploy

Comando único:

```
cd /var/www/advaqui && git pull && npm install && npm run build && pm2 restart advaqui --update-env && pm2 status
```

Demora 5 a 10 min (o `npm install` traz @supabase/supabase-js e @supabase/ssr, depois o build de 4.077 páginas).

### Passo 10 — Testar

1. Abrir `https://advaqui.com` em aba anônima → home carrega
2. Clicar em "Cadastrar advogado" → preencher 3 passos → criar
3. Cair em `/painel` → ver perfil
4. Sair → tentar logar de novo → funciona
5. Painel admin (`/admin`) → ver o advogado recém-criado listado

Se algum passo falhar, ver logs no VPS — `pm2 logs advaqui --lines 100`.

---

## 🟠 Curto prazo (próximos dias)

### Rotacionar Secret Key Supabase

A `sb_secret_vmqk2o7LL_pzA2b0AYBWrA_dHMXvFtb` apareceu no chat. Como conversas podem ser armazenadas, gerar nova chave e desativar a antiga.

1. Painel Supabase → **Settings → API Keys**
2. Na seção "Secret keys", botão **+ New secret key** → criar
3. Copiar nova chave
4. No VPS — `nano /var/www/advaqui/.env.local` → trocar `SUPABASE_SECRET_KEY` → salvar
5. `pm2 restart advaqui --update-env`
6. Voltar no Supabase → apagar a chave antiga (menu de 3 pontinhos → Delete)

### Trocar senha admin do site

A `MoraesAdv@2026Forte` apareceu no chat várias vezes.

1. No VPS — `nano /var/www/advaqui/.env.local`
2. Trocar `ADMIN_PASSWORD=...` por senha nova (mínimo 15 caracteres com letras, números e símbolos)
3. Salvar — `Ctrl+X`, `Y`, Enter
4. `pm2 restart advaqui --update-env`
5. Anotar nova senha no arquivo `advaqui-credenciais.txt`

### Decidir mock-advogados

Depois da migração Supabase, o banco começa vazio. Você precisa decidir:

**Opção A — Não criar seeds, começar zerado**
- Site mostra "Nenhum advogado cadastrado em Almenara/MG" em todas as cidades
- Mais limpo eticamente
- CTA "Seja o primeiro a se cadastrar" começa a captar advogados reais

**Opção B — Criar seeds via SQL com os 10 mock-lawyers**
- Site mantém aparência "movimentada"
- Risco — cidadão pode pensar que são advogados reais
- Se for por essa via, adicionar badge "Perfil de demonstração" nos cards

### Convidar primeiros advogados reais

Sugestão de cold start — Almenara/MG e Jequitinhonha/MG. Você é procurador municipal lá. Vá presencialmente ou via WhatsApp a 10-20 advogados da OAB local. Ofereça plano premium grátis por 3 meses para os primeiros 20.

---

## 🟡 Médio prazo (próximas semanas)

### Configurar SMTP de produção no Supabase

Plano free do Supabase manda só 3 e-mails/hora. Para produção:

1. Criar conta em **Resend** (https://resend.com) — 3 mil e-mails grátis/mês
2. Verificar o domínio `advaqui.com` no Resend (passos automáticos via DNS)
3. Pegar a API key do Resend
4. No painel Supabase → **Settings → Auth → SMTP Settings**:
   - Host — `smtp.resend.com`
   - Port — `465` (SSL)
   - Username — `resend`
   - Password — sua API key Resend
5. Testar — `/recuperar-senha` agora envia e-mail real

### Google Search Console

Para o Google descobrir suas 89 mil URLs mais rápido:

1. Acessar https://search.google.com/search-console
2. Adicionar propriedade `https://advaqui.com`
3. Verificar via meta tag no Next.js (adicionar em `app/layout.tsx`) ou via DNS TXT
4. Enviar sitemap `https://advaqui.com/sitemap.xml`
5. Esperar — Google começa a indexar em dias, mas pode demorar semanas para crawl completo

### Analytics

Recomendação — **Microsoft Clarity** (grátis, mostra heatmap e gravação de sessão sem violar privacidade demais).

1. Criar conta em https://clarity.microsoft.com
2. Criar projeto AdvAqui
3. Pegar o script tag
4. Adicionar em `app/layout.tsx` dentro do `<head>` ou via `<Script>` do Next

Bônus — adicionar **Plausible** ou **Umami** para métricas agregadas (visitantes, páginas mais vistas).

### CAPTCHA

Hoje só honeypot. Adicionar Cloudflare Turnstile:

1. Criar conta Cloudflare (grátis, mesmo sem usar como CDN)
2. Turnstile → adicionar site `advaqui.com`
3. Pegar SITE_KEY e SECRET_KEY
4. Adicionar `<Turnstile />` no formulário de cadastro e contato

### Lighthouse + Core Web Vitals

Rodar https://pagespeed.web.dev/?url=https://advaqui.com e mirar 90+ em Performance, Acessibilidade, Best Practices, SEO.

Os pontos mais comuns que travam — imagens não otimizadas (não tem ainda), fontes externas (já resolvido com next/font), JS bloqueante (next chunks ok).

### Páginas de conteúdo (artigos)

10 artigos iniciais para tráfego orgânico — temas sugeridos no dossiê original:

1. "Quando procurar um advogado trabalhista"
2. "Como funciona uma ação de alimentos no Brasil"
3. "Direitos do consumidor — quando acionar um advogado"
4. "O que fazer quando é demitido sem justa causa"
5. "Como funciona o inventário e a partilha de bens"
6. "Seus direitos no plano de saúde"
7. "Como funciona a revisão de aposentadoria"
8. "Quando você precisa de um advogado criminal"
9. "Direito imobiliário — cuidados ao comprar imóvel"
10. "O que é correspondência jurídica"

Estrutura — criar `app/blog/[slug]/page.tsx` com MDX, escrever em `content/articles/*.mdx`.

---

## 🟢 Longo prazo (próximos meses)

### Riscos legais e regulatórios (sua dívida pendente)

Você adiou esses itens. Eles **não bloqueiam funcionamento** mas são importantes antes de divulgação ampla:

1. **Provimento 205/2021 da OAB** — revisar com advogado especialista todo texto comercial do site para garantir conformidade com regras de publicidade
2. **Procurador municipal × atividade comercial** — checar Estatuto da OAB art. 30 e regulamento interno da Procuradoria de Jequitinhonha sobre acumulação
3. **Registro INPI da marca AdvAqui** — busca em https://busca.inpi.gov.br/pePI/ classes 35, 42 e 45. Se livre, registrar (~R$ 800 para 10 anos)
4. **Tributação Pix mensal** — consultar contador. Possíveis caminhos — MEI (limita receita), Simples Nacional ME, abertura de PJ
5. **LGPD/ANPD** — encarregado de dados nomeado, política de privacidade revisada, processo de exclusão de dados implementado

### Migração de Hostinger Boston → São Paulo (opcional)

Latência ~150ms vai virar ~10ms. Melhora Core Web Vitals e experiência mobile no Brasil. Hostinger às vezes faz a migração via suporte, ou refazer no plano novo.

### Programa de indicação

Advogado indica colega → ganha 1 mês de premium quando o indicado paga. Lógica simples — campo `referred_by` na tabela `lawyers` + crédito quando o `plan_history` confirma pagamento.

### Calculadoras gratuitas

Páginas SEO bombadas com cálculos jurídicos comuns:

- Rescisão trabalhista
- FGTS
- Alimentos (porcentagem)
- INSS (revisão da vida toda)
- Inventário (ITCMD)

Cada calculadora vira página `/calculadoras/[slug]` com schema HowTo + FAQ. Trata-se de tráfego orgânico massivo de longa cauda.

### Glossário jurídico

Páginas em `/glossario/[termo]` para palavras-chave informacionais — usucapião, inventário, alimentos, divórcio, etc. 500 a 1.000 verbetes a custo zero de pesquisa, indexáveis.

### Pix recorrente automatizado

Quando passar de 50 advogados pagantes, integrar OpenPix/Woovi com Pix Automático (regulamentação Bacen 2025). Dispensa ativação manual.

### Mobile app (PWA primeiro)

Adicionar `manifest.json` + service worker para o site funcionar como PWA. Permite "instalar" como app no Android/iOS sem app store.

Eventualmente, app nativo via React Native com mesmo backend Supabase.

### Foto de perfil

Hoje cada perfil tem só ícone genérico. Adicionar upload de foto via Supabase Storage — `lawyers.photo_url` apontando para `https://xxx.supabase.co/storage/v1/object/public/photos/[id].jpg`.

### Tribunais e cartórios por cidade

Páginas auxiliares — `/tribunais/[uf]/[cidade]` com endereço, telefone, varas, horário de funcionamento. Dados públicos do TJ de cada estado. Tráfego SEO local enorme.

---

## Como esse documento foi pensado

Os blocos vermelhos (🔴) são tudo que precisa rodar para o produto ficar **funcional como diretório real** (com persistência de cadastros). Sem isso, o que está no ar hoje é só uma vitrine visual.

Os blocos laranja (🟠) são higiene de segurança + onboarding inicial — coisas que devem ser feitas em dias, não meses.

Os blocos amarelos (🟡) são melhorias que entram conforme o site cresce em uso e tráfego.

Os blocos verdes (🟢) são estratégia de longo prazo — adicionar valor sustentável, não urgente.

---

## Quando voltar — leia primeiro

1. `ESTADO-ATUAL.md` — para entender em que ponto parou
2. `DECISOES.md` — para lembrar por que cada escolha foi feita
3. `PROXIMOS-PASSOS.md` (este) — para saber o que fazer

Ou copie esses 3 arquivos para conversar com outra IA — eles são auto-contidos.
