# CHANGELOG — AdvAqui

Cronologia das mudanças relevantes do projeto. Datas no formato `YYYY-MM-DD`.

---

## [Em produção] — 2026-05-18

### Bug fixes (críticos)

- **Header com auth** (`components/Header.tsx`)
  - Default `anonymous` no estado inicial — botões **Entrar** e **Cadastrar advogado** aparecem imediatamente no SSR/initial render, sem flicker.
  - `useEffect` com `supabase.auth.onAuthStateChange` substitui pelo dropdown "Olá, [nome]" quando sessão é confirmada.
  - Dropdown com **Meu painel** + **Sair** (overlay invisível pra fechar ao clicar fora).
  - Logout limpa sessão no cliente E no servidor em sequência (dispara `onAuthStateChange` cross-tab).

- **Plano free vs premium agora respeita o contrato** (`components/LawyerCard.tsx`, `app/p/[slug]/page.tsx`)
  - **Gratuito** — Apenas nome, OAB e cidade. Sem telefone, sem WhatsApp, sem endereço, sem bio.
  - **Premium** — Tudo do gratuito + telefone clicável (`tel:`), WhatsApp clicável (`wa.me`), endereço completo, bio, selo "Destaque" dourado, selo "OAB verificada", até 8 chips de especialidade (vs 5 no free).
  - Card free agora mostra "🔒 Contato direto no plano premium" em vez de WhatsApp.
  - Perfil free mostra caixa de upgrade "Telefone, WhatsApp e endereço completo disponíveis no plano premium" com link pra `/planos`.

- **Premium destaca o perfil na cidade imediatamente** (`app/api/admin/route.ts`)
  - Helper `revalidateLawyerPages(lawyerId)` busca slug/uf/city via service_role e chama `revalidatePath` em `/`, `/advogados/[uf]`, `/advogados/[uf]/[cidade]`, `/p/[slug]` e cidade-target (quando o admin redireciona).
  - Chamado em `activate-premium`, `deactivate-premium`, `toggle-featured`, `toggle-verified-oab`, `delete-lawyer`.
  - Resolve o cache SSG de 1h que mantinha o perfil free mesmo após admin ativar.

- **Chat de suporte do painel funciona com feedback** (`app/painel/page.tsx`)
  - Mínimo subiu para **10 caracteres** (operacionalmente útil).
  - Contador visual abaixo do textarea — `X / 10 caracteres mínimos` ou `✓ X caracteres` (verde).
  - `sendMessage` agora mostra toast vermelho com motivo específico se mensagem curta ou sessão expirada.
  - Erro de INSERT propaga `error.message` do Supabase no toast + `console.error` estruturado.
  - Toast de sucesso menciona "Responderemos em até 48h pelo seu e-mail".

- **Autocomplete de cidade clicável** (`app/cadastro/page.tsx`, `app/api/cities/route.ts`)
  - Estado `showSuggestions` controla quando a lista pode aparecer; ao selecionar, perde foco, clicar fora ou apertar Esc, a lista some.
  - `onMouseDown + preventDefault` no item garante seleção antes do blur.
  - Navegação por teclado completa — ↑/↓ navega, Enter seleciona, Esc fecha.
  - ARIA — `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-autocomplete`, `aria-activedescendant`; `role="listbox"`; `role="option"` + `aria-selected`.
  - Mínimo 44px de altura no item (mobile-friendly).
  - Mensagem "Nenhuma cidade encontrada" com link mailto pré-preenchido pra `contato@AdvAqui.com.br`.
  - Após seleção, foco move automaticamente pra CEP.
  - **ViaCEP** integrado — onBlur do CEP autopreenche logradouro, bairro, cidade e UF (sem dependência nova, fetch direto, timeout 3s, degradação graciosa).
  - Validação server-side derradeira contra IBGE no submit (não confia só no flag client).
  - Tolerância a hífens e pontuação na busca — "Sao Joao del-Rei" casa com "sao joao del rei".

- **Build SSG estabilizado** (3 commits encadeados)
  - `b403b8b` — Separação de `mapLawyerRow`/`Lawyer` em `lib/data/lawyer-mapper.ts` (Client Components não puxam `next/headers` indiretamente).
  - `73c715a` — `whatsappLink`/`telLink` aceitam `string | undefined | null`.
  - `2974625` — Funções `get*` em `lib/data/lawyers.ts` usam `createAdminClient` (service_role) — resolve `cookies was called outside a request scope` em `generateStaticParams` e Server Components em build time.

### SEO

- **`metadata.keywords` removido** (`app/layout.tsx`) — ignorado pelo Google desde 2009.
- **`alternates.canonical` absoluto** no layout root e em todas as páginas via `buildMetadata`.
- **`buildMetadata` retorna apenas título curto** — template `'%s — AdvAqui'` do layout aplica sufixo automaticamente. Detecção robusta caso o título já venha com sufixo (regex remove duplicação).
- **`app/opengraph-image.tsx`** — Open Graph image dinâmica via `next/og` (Edge runtime). Gradiente azul-marinho com tagline e métricas. Substitui PNG estático ausente em `public/`.
- **`lib/seo/schema.ts` enriquecido**:
  - `Organization` agora inclui `contactPoint` com email de suporte e idioma.
  - `WebSite` com `inLanguage: pt-BR` e `potentialAction.SearchAction` apontando para `/buscar?q=` (habilita sitelink searchbox no Google).

### LGPD

- **Checkbox de consentimento obrigatório em `/contato`** (`app/contato/page.tsx`)
  - Opt-in não pré-marcado.
  - Texto explícito citando art. 7º, V e art. 8º da LGPD.
  - Consentimento persistido no corpo da mensagem com timestamp ISO + texto exato exibido (até existir tabela dedicada de consentimentos).

### Polimento

- **`titleCaseNameBR`** (`lib/utils/format.ts`) — helper que normaliza "MARIA JOÃO DA SILVA" → "Maria João da Silva", mantendo conectivos `da`/`de`/`do`/`das`/`dos`/`e`/`del` em minúsculas (exceto no início). Aplicado no `signUp` do cadastro.

### Documentação

- `docs/AUDIT-FIXES.md` — FASE 1 do audit estruturado (mapeamento completo).
- `AUDITORIA-2026-05-17.md` — diário de auditoria.
- `CHANGELOG.md` — este arquivo.

---

## [Migração v0.2.0 — Supabase] — 2026-05-17

- **Migração completa de localStorage → Supabase** em produção.
- 4 tabelas criadas — `lawyers`, `messages`, `plan_history`, `audit_logs`.
- RLS policies por tabela.
- Trigger `handle_new_user()` cria linha em `lawyers` automaticamente após `signUp`.
- Admin via cookie HMAC SHA-256 httpOnly (não usa Supabase Auth).
- Build SSG de 5.571 cidades brasileiras (IBGE).
- 3.565 cidades pré-geradas + 2.006 sob demanda (ISR `dynamicParams: true`).
- Sitemap-index particionado por UF (54 sitemaps).
- HTTPS Let's Encrypt em advaqui.com via Nginx no VPS Hostinger.
