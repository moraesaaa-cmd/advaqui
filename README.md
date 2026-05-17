# AdvAqui

Plataforma de vitrine e diretório de advogados por cidade e especialidade, construída em **Next.js 14 + TypeScript + Tailwind CSS**, com cobertura de **todos os 5.571 municípios brasileiros** importados do IBGE.

---

## O que está incluído

- ✅ **Cobertura nacional total** — 5.571 cidades brasileiras (IBGE) + 27 estados, sem cidades órfãs
- ✅ **SEO local em escala** — URL própria para cada cidade (`/advogados/[uf]/[cidade]`) e para cada combinação cidade × especialidade (`/advogados/[uf]/[cidade]/[especialidade]`) — totalizando ~89 mil URLs indexáveis
- ✅ **Sitemap em escala** — sitemap principal + 27 sitemaps de cidades + 27 sitemaps de cidade × especialidade (sem estourar limite de 50k URLs por sitemap)
- ✅ **SSG + ISR híbrido** — capital de cada UF + cidades grandes pré-geradas no build; cidades menores geradas sob demanda no primeiro acesso (cacheadas via ISR)
- ✅ **Cidade sem advogado não retorna 404** — estado vazio útil, CTA de cadastro, links para cidades próximas e capital
- ✅ **Mais de 50 páginas estáticas e dinâmicas** — home, diretório, planos, sobre, FAQ, contato, termos, privacidade, aviso legal, busca, perfil individual, cadastro em 3 passos, login, recuperação de senha, painel do advogado, painel admin, fluxo Pix
- ✅ **Schema markup JSON-LD** — Organization, WebSite, BreadcrumbList, LegalService, Person, Service em todas as rotas relevantes
- ✅ **Painel admin completo** — gestão de cadastros, ativação manual de plano, respostas a mensagens, OAB verificada, exclusão de usuário
- ✅ **Pix Copia e Cola padrão Bacen** — QR Code gerado dinamicamente, payload conforme especificação oficial
- ✅ **Validações reais** — CPF com algoritmo, e-mail por regex, OAB, telefone, máscaras automáticas, hash SHA-256 de senha
- ✅ **Tipografia Inter + Fraunces**, paleta brand (ink/deep/accent/bg) sem azul jurídico genérico
- ✅ **Acessibilidade** — skip link, aria-labels, contraste WCAG AA, navegação por teclado
- ✅ **Responsivo** de 320px a 4K
- ✅ **Scripts de validação** — `npm run validate:cities`, `npm run validate:sitemap`, `npm run import:ibge`

---

## Comandos disponíveis

| Comando | O que faz |
|---|---|
| `npm install` | Instala dependências. Rode uma vez. |
| `npm run dev` | Roda o site localmente com hot reload em http://localhost:3000 |
| `npm run build` | Compila para produção. Pré-gera as cidades principais (capitais + grandes). |
| `npm run start` | Sobe servidor de produção (precisa rodar `build` antes). |
| `npm run lint` | Verifica problemas no código. |
| `npm run typecheck` | Verifica tipos TypeScript sem compilar. |
| `npm run import:ibge` | Re-busca a API IBGE e regenera `data/cities.json`. |
| `npm run validate:cities` | Valida que não há cidades órfãs, slugs duplicados ou advogados apontando para cidade inexistente. |
| `npm run validate:sitemap` | Confere se o sitemap contém todas as URLs esperadas. Aceita URL do servidor como argumento. |

---

## Estrutura do projeto

```
advaqui/
├── app/
│   ├── page.tsx                                       # Home com busca
│   ├── advogados/
│   │   ├── page.tsx                                   # Diretório (5.571 cidades, 27 estados)
│   │   └── [uf]/
│   │       ├── page.tsx                               # Estado (lista cidades por inicial)
│   │       └── [cidade]/
│   │           ├── page.tsx                           # Cidade (SSG + ISR)
│   │           └── [especialidade]/
│   │               └── page.tsx                       # Cidade × especialidade (capital SSG, resto ISR)
│   ├── p/[slug]/page.tsx                              # Perfil individual
│   ├── planos/page.tsx
│   ├── sobre/page.tsx
│   ├── faq/page.tsx
│   ├── contato/page.tsx
│   ├── termos/page.tsx
│   ├── privacidade/page.tsx
│   ├── aviso-legal/page.tsx
│   ├── cadastro/page.tsx                              # Cadastro em 3 passos
│   ├── login/page.tsx
│   ├── recuperar-senha/page.tsx
│   ├── painel/
│   │   ├── page.tsx                                   # Área do advogado
│   │   └── pagamento/page.tsx                         # Pix
│   ├── admin/page.tsx                                 # Painel admin oculto
│   ├── buscar/page.tsx
│   ├── api/cities/route.ts                            # Endpoint server-side de busca
│   ├── sitemap.ts                                     # Sitemap principal (estáticas + estados + capitais × spec)
│   ├── sitemap-cidades/sitemap.ts                     # 27 sitemaps (uma por UF) com todas as cidades
│   ├── sitemap-especialidades/sitemap.ts              # 27 sitemaps (cidade × especialidade por UF)
│   ├── robots.ts                                      # robots.txt apontando para todos os sitemaps
│   ├── not-found.tsx, error.tsx, loading.tsx, icon.tsx
│   ├── layout.tsx                                     # Layout raiz com fontes, header, footer, JSON-LD
│   └── globals.css
├── components/                                        # UI compartilhada
├── lib/
│   ├── config.ts                                      # Configurações do site, Pix, admin
│   ├── data/
│   │   ├── states.ts                                  # 27 estados com região
│   │   ├── cities.ts                                  # Funções tipadas + cache, lê data/cities.json
│   │   ├── specialties.ts                             # 15 especialidades jurídicas
│   │   ├── mock-lawyers.ts                            # 10 advogados de demonstração
│   │   └── templates.ts                               # 5 variações de texto por cidade/especialidade
│   ├── utils/                                         # slug, validation, format, id
│   ├── auth/hash.ts                                   # SHA-256 com salt (demo) — trocar por bcrypt em produção
│   ├── pix/qrcode.ts                                  # Geração de payload Pix Bacen
│   ├── seo/                                           # metadata, schema (JSON-LD)
│   └── store/localStore.ts                            # localStorage temporário
├── data/
│   ├── cities.json                                    # 5.571 cidades IBGE (formato compacto, 338KB)
│   └── ibge-municipios.json                           # Raw IBGE (backup)
├── scripts/
│   ├── import-ibge.mjs                                # Re-importa IBGE atualizado
│   ├── validate-cities.mjs                            # Valida zero cidade órfã
│   └── validate-sitemap.mjs                           # Valida sitemap completo
├── .env.example
├── package.json, tsconfig.json, next.config.js, tailwind.config.ts
└── README.md (este arquivo)
```

---

## Como rodar localmente (passo a passo bem mastigado)

> Se você nunca usou linha de comando, siga exatamente nesta ordem.

### 1 — Instalar Node.js

1. Abra o navegador e vá em [nodejs.org/pt-br/download](https://nodejs.org/pt-br/download)
2. Baixe a versão **LTS** (botão verde, "Recomendado para a maioria dos usuários")
3. Execute o instalador, clique "Avançar" em tudo
4. **Reinicie o computador** quando terminar

### 2 — Confirmar instalação

1. Tecla **Windows** → digite `powershell` → Enter
2. Na janela preta, digite:
   ```
   node --version
   ```
3. Deve aparecer algo como `v20.18.0`

### 3 — Abrir a pasta do projeto

```
cd "G:\Meu Drive\claude juridico certo\advaqui"
```

### 4 — Instalar dependências

```
npm install
```

Demora 2 a 5 minutos. Muitas linhas vão aparecer — é normal.

### 5 — Validar a base de cidades

```
npm run validate:cities
```

Deve mostrar:

```
✓ data/cities.json — 5571 cidades
✓ Todos os campos obrigatórios presentes
✓ Slugs únicos dentro de cada UF (27 UFs)
✓ Todas as 27 capitais presentes
✓ Almenara/MG e Jequitinhonha/MG presentes
✓ Mock-lawyers — 10 advogados, 0 órfãos
✅ Validação passou. Zero cidades órfãs, zero slugs duplicados.
```

### 6 — Rodar o site

```
npm run dev
```

Vai aparecer `ready - started server on http://localhost:3000`. Abra esse endereço no navegador.

Para parar — Ctrl + C na janela preta.

### 7 — Compilar para produção (opcional)

```
npm run build
```

Pré-gera ~3 mil páginas (capitais + cidades grandes de cada estado). Demora 5 a 12 minutos.

```
npm run start
```

Sobe servidor de produção em http://localhost:3000.

---

## Como funciona a cobertura de cidades

### Base de dados

- **Fonte** — API oficial do IBGE (`https://servicodados.ibge.gov.br/api/v1/localidades/municipios`)
- **Total** — 5.571 municípios brasileiros (incluindo Brasília-DF)
- **Onde fica** — `data/cities.json` (versionado no Git, 338KB compactos)
- **Formato compacto** — `{ i: 1200013, n: "Acrelândia", s: "acrelandia", u: "AC" }`
- **Funções de acesso** — `lib/data/cities.ts` expõe `getAllCities()`, `findCity(uf, slug)`, `citiesByUf(uf)`, `findCapital(uf)`, `nearbyCities(city)`

### Estratégia de geração de páginas

| Tipo de página | Quantidade | Estratégia |
|---|---|---|
| Home, planos, sobre etc | 11 | Estática (SSG) |
| Estados | 27 | Estática (SSG) — listadas todas as cidades por inicial alfabética |
| Cidades de estados pequenos (≤200) | ~1.655 | SSG no build |
| 200 primeiras cidades alfabéticas dos estados grandes + capitais | ~2.000 | SSG no build |
| Demais ~1.916 cidades | ~1.916 | **ISR** — geradas sob demanda na primeira visita, depois cacheadas |
| Cidade × especialidade (capital) | 405 | SSG no build (27 × 15) |
| Cidade × especialidade (demais) | ~83.160 | ISR — geradas sob demanda |
| Perfis de advogado mock | 10 | SSG |

**Total esperado de páginas indexáveis** — aproximadamente **89.000 URLs**.

**Por que SSG + ISR?** Pré-gerar 89 mil páginas no build estouraria o tempo limite da maioria dos serviços de hospedagem. O ISR (Incremental Static Regeneration) gera cada página apenas quando o primeiro visitante acessa e cacheia. Resultado prático — todas as URLs respondem 200, todas estão no sitemap, mas o build fica viável (5 a 12 minutos).

### Zero cidades órfãs — garantia

- Cada uma das 5.571 cidades tem URL conhecida em `/advogados/[uf]/[slug]`
- O sitemap principal + 27 sitemaps secundários cobrem todas
- A página de cidade **sempre responde 200** se a cidade existe na base IBGE, mesmo sem advogado cadastrado (estado vazio útil)
- 404 só ocorre para slug inválido (cidade que não existe no Brasil)
- `npm run validate:cities` confirma zero órfãos antes de cada deploy

### Atualizar a base de cidades

Se o IBGE divulgar novos municípios (acontece raramente, ~1 por ano):

```
npm run import:ibge
npm run validate:cities
```

O script regrava `data/cities.json` e a validação confirma a integridade.

---

## SEO técnico implementado

### Metadados

- **Title único** em cada página — formato `Advogado em [Cidade] [UF] | Encontre profissionais jurídicos`
- **Meta description única** — variação por cidade/especialidade
- **Canonical** apontando para a URL final
- **Open Graph + Twitter Card** em todas as páginas
- **H1 único** com palavra-chave principal natural (sem stuffing)
- **H2/H3** estruturados semanticamente

### Schema.org (JSON-LD)

- **Organization** + **WebSite** com SearchAction no layout raiz
- **BreadcrumbList** em todas as páginas dinâmicas
- **Service** (cidade) — `cityServiceSchema`
- **LegalService + Person** nos perfis individuais

### Sitemap

- **sitemap.xml** — páginas estáticas + estados + capitais × especialidades + perfis (~470 URLs)
- **sitemap-cidades/sitemap/0..26.xml** — todas as 5.571 cidades distribuídas por UF
- **sitemap-especialidades/sitemap/0..26.xml** — todas as ~83 mil combinações cidade × especialidade
- Cada sitemap fica abaixo do limite de 50.000 URLs

### Robots.txt

- Permite crawling de todas as páginas públicas
- Bloqueia apenas `/admin`, `/painel`, `/api/`
- Lista os 55 sitemaps gerados (principal + 27 + 27)
- Diretiva específica para Googlebot

### Linkagem interna

- Breadcrumbs em todas as páginas dinâmicas
- Páginas de estado listam todas as cidades agrupadas por inicial alfabética
- Páginas de cidade têm chips clicáveis para 15 especialidades + cidades próximas (alfabéticas, mesma UF)
- Páginas de cidade × especialidade linkam para outras especialidades da mesma cidade
- Home linka para todos os estados + chips de especialidades

### Palavras-chave por página

| Página | Palavra-chave principal |
|---|---|
| Home | encontrar advogado, diretório jurídico |
| Estado | advogados em [estado], advogados em [UF] |
| Cidade | advogado em [cidade], advogado em [cidade] [UF], advogados em [cidade] |
| Cidade × especialidade | advogado [especialidade] em [cidade], advogado [especialidade] em [cidade] [UF] |
| Perfil | [nome do advogado], OAB/[UF] [número], advogado em [cidade] |

---

## Customização

### Trocar a chave Pix

Crie `.env.local` copiando `.env.example`:

```
PIX_KEY="sua-chave-pix"
PIX_RECEIVER_NAME="Seu Nome"
PIX_RECEIVER_CITY="JEQUITINHONHA"
PIX_AMOUNT="59.90"
```

Em produção (Vercel), configure em **Settings → Environment Variables**.

### Trocar credenciais admin

```
ADMIN_EMAIL="seu@email.com"
ADMIN_PASSWORD="SenhaForte@2026"
```

**Importante** — troque antes de publicar. As credenciais padrão (`Admin@2026`) são apenas para demonstração.

### Trocar paleta de cores

Edite `tailwind.config.ts`:

```ts
brand: {
  ink: "#0F1B2D",      // texto principal
  deep: "#1B3A5C",     // azul profundo
  primary: "#264E70",  // azul médio
  accent: "#C9A24C",   // dourado
  accent2: "#E8B856",  // dourado claro
  bg: "#FBF9F4",       // fundo
  line: "#E6E1D6"      // bordas
}
```

---

## Como publicar (Vercel grátis)

### 1 — Criar conta GitHub

1. Acesse [github.com/signup](https://github.com/signup)
2. Crie conta e confirme e-mail

### 2 — Subir o código no GitHub

Baixe [GitHub Desktop](https://desktop.github.com), faça login, **File → Add Local Repository** apontando para a pasta `advaqui`. Publique o repositório (marcando "Keep private" se preferir).

### 3 — Conectar Vercel

1. Acesse [vercel.com/signup](https://vercel.com/signup)
2. **Continue with GitHub** e autorize
3. **Add New → Project** → escolha o repo `advaqui` → **Deploy**

### 4 — Configurar variáveis de ambiente na Vercel

Em **Settings → Environment Variables**, copie cada linha do `.env.example` e cole com os valores reais. Depois **Deployments → Redeploy**.

### 5 — Conectar domínio próprio

Sobre o domínio — `advaqui.com.br` está registrado mas vence em abril/2026 (pode tentar comprar do dono). **`advaqui.adv.br`** está disponível e é uma boa alternativa.

1. Compre o domínio em [registro.br](https://registro.br) (R$ 40/ano)
2. Na Vercel, **Settings → Domains** → adicione
3. Configure os registros DNS que a Vercel mostrar no painel do registro.br

---

## Mock advogados de demonstração

10 advogados fictícios em `lib/data/mock-lawyers.ts` cobrindo Belo Horizonte (2), Almenara, Jequitinhonha, São Paulo, Campinas, Curitiba, Niterói, Fortaleza e Salvador.

**Importante** — remova ou substitua por cadastros reais antes de divulgar publicamente. Veja `mock-lawyers.ts` para edição.

---

## Pendências e o que ainda falta

### Coisas que você precisa fazer manualmente

- [ ] **Comprar domínio** — `advaqui.com.br` tomado; `advaqui.adv.br` disponível (R$ 40/ano)
- [ ] **Verificar marca no INPI** — busca em [gov.br/inpi](https://www.gov.br/inpi)
- [ ] **Criar conta no Google Search Console** e submeter os sitemaps
- [ ] **Trocar a senha padrão do admin** antes de publicar
- [ ] **Remover advogados de demonstração** antes de divulgar
- [ ] **Configurar Resend ou Brevo** para envio de e-mails reais

### Limitações conhecidas (MVP)

1. **localStorage** — cadastros não sincronizam entre dispositivos. Migrar para Supabase em fase 2
2. **Hash SHA-256 com salt fixo** — funciona para demo, não para produção (usar bcrypt server-side)
3. **Sem expiração automática do plano** — admin precisa desativar manualmente após 30 dias (resolver com cron Supabase)
4. **Sem upload de foto** — campo previsto mas storage não implementado
5. **Sem CAPTCHA** — só honeypot (adicionar Cloudflare Turnstile gratuito)
6. **Sem e-mail real** — recuperação de senha é simulada

### Riscos legais (analisar depois)

- Provimento 205/2021 da OAB sobre publicidade
- Procurador municipal × atividade comercial paralela
- INPI da marca
- Tributação da assinatura Pix

---

## Critérios de pronto

| Critério | Status |
|---|---|
| 5.571 cidades importadas do IBGE | ✅ |
| Zero cidades órfãs | ✅ (validado via `npm run validate:cities`) |
| Zero slugs duplicados | ✅ |
| Sitemap completo | ✅ (1 principal + 27 cidades + 27 especialidades) |
| Robots.txt correto | ✅ |
| Titles/meta descriptions únicos | ✅ |
| H1 único por página | ✅ |
| Schema markup | ✅ (Organization, WebSite, BreadcrumbList, Service, LegalService, Person) |
| Cidade sem advogado não retorna 404 | ✅ |
| Páginas indexáveis (SSR/SSG/ISR) | ✅ |
| Linkagem interna | ✅ |
| README com tutorial | ✅ |
| Scripts de validação | ✅ |
| Não bloqueia páginas no robots | ✅ |
| Pronto para `npm install && npm run dev` | ✅ (após instalar Node) |
| Pronto para deploy na Vercel | ✅ (com variáveis de ambiente configuradas) |

---

## Suporte

Em caso de erro técnico, copie a mensagem do PowerShell (em vermelho) e mande na conversa. Para dúvidas de produto/SEO, abra a conversa.

Bom lançamento. 🚀
