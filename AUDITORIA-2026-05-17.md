# Auditoria AdvAqui — 17/05/2026

Auditoria completa do projeto solicitada pelo Moraes após falhas sucessivas
de build no VPS. Documento atualizado em tempo real conforme verifico cada
rota, fluxo e arquivo crítico.

---

## 1. Estado real do servidor (diagnóstico do print de 17/05)

| Item | Estado |
|---|---|
| Site no ar em `advaqui.com` | Sim, mas servindo **build corrompido** (HTML sem CSS) |
| PM2 (`advaqui`) | `online`, 33 minutos de uptime |
| `.next/` no VPS | **Corrompido** — `rm -rf` falhou parcialmente, sobrou só shell |
| Último build bem-sucedido | Build inicial (Next.js 14.2.5, antes da correção do cadastro) |
| Builds que falharam depois | 2 — primeiro por `next/headers` leak, segundo por type error |
| Commits no GitHub | Atualizados (`b403b8b` e `73c715a`) — VPS ainda não compilou |

### Por que o `rm -rf .next` falhou

Linha do print de terminal:
```
rm: cannot remove '.next/server/app/advogados/pb': Directory not empty
```

Causa raiz — o PM2 ainda estava rodando o processo `next start` que
mantinha file handles abertos em arquivos dentro de `.next/server/`.
O Linux não deixa remover diretórios não-vazios mesmo com `-rf` quando
arquivos estão sob lock. Como uso `&&` no comando, o resto (`npm run
build`, `pm2 restart`) **nunca executou**.

### Correção do comando

Solução definitiva — parar o PM2 antes do `rm`, com `;` em vez de `&&`
nas primeiras etapas:

```bash
cd /var/www/advaqui
pm2 stop advaqui
sleep 2
rm -rf .next
git pull origin main
npm run build && pm2 restart advaqui --update-env && pm2 status
```

---

## 2. Mapa de rotas

26 rotas no projeto. Status por categoria:

### 2.1 — Rotas públicas (server components)
| Rota | Arquivo | Status do código |
|---|---|---|
| `/` | `app/page.tsx` | OK |
| `/buscar` | `app/buscar/page.tsx` | `"use client"` — OK |
| `/advogados` | `app/advogados/page.tsx` | OK (server) |
| `/advogados/[uf]` | `app/advogados/[uf]/page.tsx` | OK (server) |
| `/advogados/[uf]/[cidade]` | `app/advogados/[uf]/[cidade]/page.tsx` | OK (server) |
| `/advogados/[uf]/[cidade]/[especialidade]` | `.../[especialidade]/page.tsx` | OK (server) |
| `/p/[slug]` | `app/p/[slug]/page.tsx` | Type error linha 40 — **corrigido** via assinatura whatsappLink |

### 2.2 — Páginas institucionais
| Rota | Arquivo |
|---|---|
| `/sobre` | `app/sobre/page.tsx` |
| `/faq` | `app/faq/page.tsx` |
| `/planos` | `app/planos/page.tsx` |
| `/contato` | `app/contato/page.tsx` (client) |
| `/termos` | `app/termos/page.tsx` |
| `/privacidade` | `app/privacidade/page.tsx` |
| `/aviso-legal` | `app/aviso-legal/page.tsx` |

### 2.3 — Autenticação
| Rota | Arquivo | Estado |
|---|---|---|
| `/login` | `app/login/page.tsx` | Funciona — tenta admin via API, depois Supabase Auth |
| `/cadastro` | `app/cadastro/page.tsx` | UX da cidade ajustada (commit `1747d09`) — **falta aplicar build** |
| `/recuperar-senha` | `app/recuperar-senha/page.tsx` | Dispara reset email via Supabase Auth |
| `/redefinir-senha` | `app/redefinir-senha/page.tsx` | Recebe link de reset e atualiza senha |

### 2.4 — Área restrita
| Rota | Arquivo | Estado |
|---|---|---|
| `/painel` | `app/painel/page.tsx` | Type fix aplicado (mapper isolado) |
| `/painel/pagamento` | `app/painel/pagamento/page.tsx` | Type fix aplicado |
| `/admin` | `app/admin/page.tsx` | Não importa lawyers.ts — sem efeito da migração |

### 2.5 — API
| Endpoint | Função |
|---|---|
| `POST /api/auth/admin` | Login admin com cookie HMAC |
| `POST /api/auth/logout` | Limpa sessão Supabase + cookie admin |
| `GET/POST /api/admin` | Router unificado de ações admin (10 ações) |
| `GET /api/cities` | Autocomplete de cidades IBGE |
| `GET /api/lawyers/search` | Busca pública de advogados |

---

## 3. Correções aplicadas no código (pushadas no GitHub)

| Commit | Data | Arquivos | Descrição |
|---|---|---|---|
| `1747d09` | 17/05 | `app/cadastro/page.tsx` | Campo cidade — remove sufixo ", UF" do autocomplete, UF vem antes, hint claro |
| `b403b8b` | 17/05 | `lib/data/lawyer-mapper.ts` (novo) + 3 arquivos | Separa tipos puros do server.ts (corrige `next/headers` leak) |
| `73c715a` | 17/05 | `lib/utils/format.ts` | `whatsappLink` e `telLink` aceitam `string \| undefined` |

**Importante** — esses 3 commits **estão no GitHub e no VPS** (foram puxados pelo `git pull`). Mas como o build novo nunca terminou, eles **não estão sendo servidos** pelo PM2.

---

## 4. Bugs conhecidos que ainda precisam de fix

### 4.1 — Sem prioridade alta no momento (são UX)
- **Foto de perfil** — campo não existe no banco nem no cadastro
- **Validação CPF** — só conta dígitos, não valida algoritmo
- **CAPTCHA** — não tem (cadastro vulnerável a spam)
- **Rate limit** — não tem em formulários públicos
- **Política LGPD** — falta botão "Excluir minha conta" e "Exportar meus dados"

### 4.2 — Configuração pendente
- **SMTP transacional** — Resend não configurado; emails de confirmação/reset não saem do Supabase
- **Telegram bot** — `TELEGRAM_BOT_TOKEN` vazio; admin não recebe aviso de novo cadastro/pagamento
- **Analytics** — não tem Plausible/Umami ainda
- **Google Search Console** — não submetido

### 4.3 — Em verificação contínua
- **Outros type errors no build** — se aparecer no próximo build, corrigir
- **Páginas estáticas (5.571 cidades)** — ainda não chegamos a gerar com sucesso

---

## 5. Verificações pendentes (a fazer após build voltar)

### 5.1 — Fluxo usuário-final (cidadão buscando advogado)
- Home → busca por "Almenara" → página da cidade carrega lista
- Clique em perfil → página `/p/[slug]` mostra dados, botão WhatsApp/Telefone funciona
- Não conseguir achar a cidade → o que aparece?

### 5.2 — Fluxo advogado (cadastro novo)
- `/cadastro` em 3 passos — campo cidade aceita só "Almenara" sem ", MG"?
- Cadastro submete → `/painel` abre com nome correto
- Login em outro dispositivo funciona (após `Confirm email` desativado)
- Recuperar senha → recebe email? (deve falhar pq SMTP não configurado)
- Editar perfil → salva no Supabase
- Ativar premium → vai pra `/painel/pagamento`
- Marcar "Já paguei" → status muda pra `pending`

### 5.3 — Fluxo admin/dono (você)
- `/login` com credenciais do `.env.local` → vai pra `/admin`
- Aba Cadastros — lista todos os advogados
- Buscar por nome/cidade/OAB filtra
- Botão "Ativar premium" muda status do user
- Botão "Destacar" funciona
- Botão "Verificar OAB" funciona
- Botão "Excluir" remove user (com confirm)
- Aba Mensagens — lista mensagens, marca como lida, responde
- Aba Resumo — mostra totais corretos

### 5.4 — Páginas estáticas geradas (SSG)
- `/advogados/mg/almenara` existe e mostra advogados de Almenara?
- `/advogados/mg/almenara/trabalhista` existe?
- `/advogados/sp/sao-paulo` existe?
- Cidade aleatória do IBGE — gerada com `dynamicParams: true`?

### 5.5 — SEO técnico
- Sitemap XML em `/sitemap.xml` retorna XML válido?
- Schema markup nas páginas-chave (home, cidade, perfil)
- Open Graph nas páginas principais
- robots.txt aponta pra sitemap

### 5.6 — Performance
- Lighthouse score 90+?
- LCP < 2.5s?
- Imagens lazy-loaded?

---

## 6. Próximos passos práticos

1. **Aplicar build no VPS com comando defensivo** (parar PM2 antes de rm)
2. **Confirmar visualmente** que o site voltou ao normal (CSS, ícones, layout)
3. **Testar cadastro novo** com cidade simples ("Almenara") — verificar se passa
4. **Testar login no celular** — confirmar que funciona depois do Confirm Email desativado
5. **Testar admin** — entrar em `/login` com email/senha do `.env`
6. **Para fechar essa rodada**, validar visualmente cada rota crítica e marcar OK/bug

---

Atualização contínua. Próxima edição após o build aplicar com sucesso.
