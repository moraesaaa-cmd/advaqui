# AdvAqui — Próximos passos

Última atualização — 25 de junho de 2026.

Roadmap dividido por urgência. Os blocos do topo são críticos — sem resolvê-los o site corre risco de sair do ar ou de segurança. Conforme desce, vira melhoria estratégica.

---

## 🔴 CRÍTICO

### VPS vence 2026-07-17 — renovar ou migrar

Auto-renovação está **desligada**. O site sai do ar em 22 dias se nada for feito.

**Opções:**
1. **Renovar** — hPanel → VPS → Billing → ativar auto-renovação ou pagar manualmente
2. **Migrar** — mover para outro provedor (Contabo, Hetzner, Oracle Cloud Free Tier) antes do vencimento
3. **Migrar para São Paulo** — reduz latência de ~150ms para ~10ms; Hostinger às vezes faz via suporte

Qualquer opção exige ação antes de 17/07.

### Rotacionar Secret Key Supabase

A Secret Key (começa com `sb_secret_`) foi exposta em chat anterior. Rotacionar:

1. Painel Supabase → **Settings → API Keys**
2. **+ New secret key** → criar
3. Copiar nova chave
4. No VPS — `nano /var/www/advaqui/.env.local` → trocar `SUPABASE_SECRET_KEY`
5. `pm2 restart advaqui --update-env`
6. Voltar no Supabase → apagar a chave antiga

### Configurar SMTP (Resend) para e-mails confiáveis

Supabase free envia apenas 3 e-mails/hora. Cadastro, reset de senha e notificações precisam de SMTP real.

1. Criar conta em **Resend** (https://resend.com) — 3.000 e-mails grátis/mês
2. Verificar domínio `advaqui.com` no Resend (DNS automático)
3. Pegar API key
4. No painel Supabase → **Settings → Auth → SMTP Settings**:
   - Host: `smtp.resend.com`
   - Port: `465` (SSL)
   - Username: `resend`
   - Password: API key do Resend
5. Testar — `/recuperar-senha` deve enviar e-mail real

---

## 🟠 URGENTE (próximos dias)

### Cadastrar Search Console e submeter sitemaps

~480.000 URLs indexáveis sem estar no Search Console. Cada dia sem isso é tráfego orgânico perdido.

1. Acessar https://search.google.com/search-console
2. Adicionar propriedade `https://advaqui.com`
3. Verificar via meta tag em `app/layout.tsx` ou DNS TXT
4. Enviar sitemap `https://advaqui.com/sitemap.xml`
5. Monitorar cobertura e erros

### Convidar primeiros advogados reais

6 cadastrados, 1 spam. Sem advogados reais, o diretório não tem valor. Cold start:

- Começar por Almenara/MG e Jequitinhonha/MG (rede local)
- WhatsApp ou presencial para 10-20 advogados da OAB local
- Oferecer premium grátis por 3 meses para os primeiros 20
- Depois expandir para BH e capitais

### Testar bug "save intermitente" no painel do advogado

Middleware fix foi deployado mas não confirmado em produção. Testar:

1. Logar como advogado em `/painel`
2. Editar perfil e salvar 3x seguidas
3. Confirmar que salva sem erro intermitente
4. Se persistir, verificar logs: `pm2 logs advaqui --lines 100`

### Configurar Microsoft Clarity ou analytics

Zero visibilidade sobre visitantes, páginas mais vistas, comportamento.

1. Criar conta em https://clarity.microsoft.com
2. Criar projeto AdvAqui
3. Pegar script tag
4. Adicionar em `app/layout.tsx` via `<Script>` do Next.js
5. Opcional: adicionar Plausible ou Umami para métricas agregadas

---

## 🟡 MÉDIO PRAZO (próximas semanas)

### Publicar artigos manualmente para complementar o cron

O cron gera 10 artigos/dia via gpt-4o-mini, mas qualidade varia. Complementar com artigos manuais de alto valor para termos competitivos.

### Criar LPs premium por cidade

Páginas indexáveis em `/lp/advogado-premium/[cidade]` para captar advogados via busca orgânica. Cada LP mostra benefícios do plano premium + CTA de cadastro.

### Chatbot determinístico para triagem

Sem IA paga. Árvore de decisão fixa:
- "Qual seu problema?" → opções → sub-opções → recomendação de especialidade + CTA para buscar advogado na cidade
- Reduz custo operacional e engaja visitante

### Checklist por situação jurídica

Páginas tipo "Foi demitido? 18 direitos que você tem" com checklist interativo. Alto potencial de compartilhamento e tráfego orgânico.

### Mais calculadoras interativas

6 já existem. Adicionar:
- Rescisão trabalhista detalhada (verbas rescisórias completas)
- Dano moral (estimativa por tipo de caso)
- Aposentadoria (simulação INSS)

Cada calculadora vira página `/calculadoras/[slug]` com schema HowTo + FAQ.

### Integrar premium do site com recurso de multa

Hoje são sistemas separados (advaqui.com premium R$19,90 vs multas.advaqui.com avulso R$9,90). Unificar para que premium tenha acesso ao recurso de multa incluído.

---

## 🟢 LONGO PRAZO (próximos meses)

### Pipeline de conteúdo automatizado

Já roda (1 artigo/dia via cron). Melhorias futuras:
- Revisão automática de qualidade antes de publicar
- Variação de formato (listas, guias, FAQ)
- Interlink automático entre artigos e páginas de cidade

### Painel Search Console integrado

Mostrar métricas do Search Console dentro do admin AdvAqui (cliques, impressões, posição média por página).

### WhatsApp via Evolution API

Notificações de lead, confirmação de cadastro e atendimento via WhatsApp Business API. Evolution API é self-hosted e gratuita.

### Captura de leads por diagnóstico

Página `/diagnostico` já existe. Adicionar captura de e-mail/WhatsApp no final do fluxo para remarketing.

### Compliance OAB/LGPD formal

- Provimento 205/2021 — revisar textos comerciais com advogado especialista
- LGPD — encarregado de dados, política de privacidade, processo de exclusão
- Procurador municipal × atividade comercial — verificar compatibilidade

### Registrar domínio advaqui.com.br

Garantir o `.com.br` antes que alguém registre. Registro.br ~R$40/ano.

### Outras melhorias planejadas

- Pix recorrente automatizado (OpenPix/Woovi quando passar de 50 pagantes)
- PWA (manifest.json + service worker)
- Upload de foto de perfil (Supabase Storage)
- Programa de indicação entre advogados
- Migração VPS para São Paulo (se não migrar no ciclo crítico)

---

## Quando voltar — leia primeiro

1. `ESTADO-ATUAL.md` — para entender em que ponto parou
2. `DECISOES.md` — para lembrar por que cada escolha foi feita
3. `PROXIMOS-PASSOS.md` (este) — para saber o que fazer

Esses 3 arquivos são auto-contidos. Copie para conversar com outra IA se necessário.
