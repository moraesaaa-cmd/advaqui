# Como fazer o AdvAqui aparecer no Google, Bing, Yahoo

Indexação não é automática. Mesmo com sitemap, robots e schema corretos, o
Google leva de **algumas horas a algumas semanas** para começar a mostrar
páginas novas. Você precisa **avisar manualmente** que o site existe via
Google Search Console (GSC) e Bing Webmaster Tools.

Yahoo usa os resultados do Bing, então cobrir Bing cobre Yahoo automaticamente.

---

## 1. Verificar que o site está "pronto" para indexação

Antes de submeter, confira:

### 1.1 — Sitemap acessível

Abra no navegador:

```
https://advaqui.com/sitemap.xml
```

Deve retornar **XML válido** com links para outros sitemaps (sitemap-index).
Cada sub-sitemap (`/sitemap-cidades/sitemap/0.xml`, etc) também deve abrir e
listar URLs.

### 1.2 — robots.txt permitindo acesso

Abra:

```
https://advaqui.com/robots.txt
```

Deve mostrar algo como:

```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /painel
Disallow: /api/

Sitemap: https://advaqui.com/sitemap.xml
Sitemap: https://advaqui.com/sitemap-cidades/sitemap/0.xml
... (54 sitemaps)
```

Se mostrar erro ou nada, há problema no servidor.

### 1.3 — Open Graph image

Abra:

```
https://advaqui.com/opengraph-image
```

Deve retornar uma imagem 1200×630 azul com a tagline. Essa imagem aparece
quando alguém compartilha o site no WhatsApp, Twitter, LinkedIn.

Validar com:
- https://www.opengraph.xyz/url/https%3A%2F%2Fadvaqui.com — pré-visualização
- https://cards-dev.twitter.com/validator — Twitter Card validator
- https://developers.facebook.com/tools/debug/ — Facebook OG debugger

### 1.4 — Páginas individuais acessíveis

Testa diretamente:

- https://advaqui.com — home
- https://advaqui.com/advogados — diretório
- https://advaqui.com/advogados/mg — Minas Gerais
- https://advaqui.com/advogados/mg/almenara — Almenara
- https://advaqui.com/p/kellsons-de-moraes-oliveira — perfil

Cada uma deve retornar **HTTP 200** com `<title>`, `<meta description>`,
`<link rel="canonical">` e JSON-LD no `<head>`.

---

## 2. Google Search Console (mais importante)

### 2.1 — Criar conta

1. Acessa **https://search.google.com/search-console**
2. Faz login com sua conta Google (a mesma do Gmail)
3. Clica em **"Adicionar propriedade"**

### 2.2 — Adicionar a propriedade

Tem 2 opções, escolhe a primeira:

- **Prefixo do URL** — digita `https://advaqui.com` (com https, sem barra final)
- **Domain** — exige verificação por DNS (mais complexo)

Vai com **Prefixo do URL**.

### 2.3 — Verificar propriedade

O Google vai pedir verificação. **Método mais fácil — meta tag HTML**:

1. Google mostra uma string tipo `<meta name="google-site-verification" content="ABC123XYZ..." />`
2. **Você copia a string `content`**
3. Me manda essa string que eu adiciono no `app/layout.tsx` via metadata
4. Subo no VPS
5. Você volta no GSC e clica em **"Verificar"**

⚠️ Atualmente o site **não tem essa meta tag**. Por isso GSC ainda não está
verificado. Quando você fizer o cadastro, me passa o código de verificação.

### 2.4 — Submeter sitemap

Depois de verificado:

1. No GSC, menu esquerdo → **Sitemaps**
2. Em "Adicionar novo sitemap", digita `sitemap.xml` (só isso, não o URL completo)
3. Clica em **"Enviar"**

GSC vai começar a ler o sitemap-index e descobrir os 54 sub-sitemaps. Em
**minutos** ele reporta quantas URLs descobriu. Em **dias/semanas** começa a
indexar as páginas.

### 2.5 — Acelerar indexação das páginas principais

GSC permite pedir indexação manual de até 10 URLs/dia:

1. Menu esquerdo → **Inspeção de URL**
2. Cola `https://advaqui.com`
3. Clica em **"Solicitar indexação"** (canto superior direito)
4. Repete com:
   - `https://advaqui.com/advogados`
   - `https://advaqui.com/planos`
   - `https://advaqui.com/sobre`
   - `https://advaqui.com/faq`
   - `https://advaqui.com/advogados/mg`
   - `https://advaqui.com/advogados/mg/almenara`
   - (capital de cada UF onde você tem advogados)

Cada URL leva 1-3 minutos pra processar. Em ~24h o Google começa a mostrar
nas buscas pra termos relacionados.

---

## 3. Bing Webmaster Tools (para Bing + Yahoo + DuckDuckGo parcial)

### 3.1 — Criar conta

1. Acessa **https://www.bing.com/webmasters**
2. Login com Microsoft ou Google
3. **Adicionar site**: `https://advaqui.com`

### 3.2 — Verificação

Bing aceita 3 métodos:

- **XML file upload** — gera um `BingSiteAuth.xml`, eu coloco em `public/`
- **Meta tag** — igual ao GSC
- **CNAME DNS** — mais técnico

Vai com **Meta tag** ou **XML file**. Me passa o que o Bing pedir, eu adiciono.

Atalho: o Bing tem **"Import from Google Search Console"** — se você já
verificou no GSC, importa direto sem nova verificação.

### 3.3 — Submeter sitemap

Mesmo procedimento do GSC: menu esquerdo → **Sitemaps** → adiciona
`https://advaqui.com/sitemap.xml`.

---

## 4. Outros buscadores menores

- **DuckDuckGo** — usa Bing como base. Quando aparece no Bing, aparece no DDG.
- **Yandex** (Rússia) — irrelevante pro mercado brasileiro.
- **Baidu** (China) — irrelevante.
- **Ecosia** — usa Bing.
- **Brave Search** — tem indexador próprio mas pega de outros.

**Foco em Google + Bing cobre 99% do tráfego brasileiro.**

---

## 5. Diagnóstico — porque o site não aparece ainda?

Se em 7 dias após submeter sitemap nada aparece, possíveis causas:

| Causa | Como detectar | Como resolver |
|---|---|---|
| Sitemap não verificado | GSC mostra "Não buscado" em Sitemaps | Re-enviar, esperar 48h |
| `robots.txt` bloqueando | GSC mostra "Bloqueado pelo robots.txt" | Conferir disallow em `app/robots.ts` |
| Página retornando 404 | Inspeção de URL mostra "Não disponível" | Conferir SSG do Next |
| Conteúdo "thin" / fraco | GSC mostra "Descoberta - atualmente não indexada" | Adicionar mais texto, parágrafos introdutórios |
| Conflito de canonical | GSC mostra "Canonical alternativo" | Confirmar canonical aponta pra si próprio |
| Site novo (1-3 meses) | Tempo passando, sem páginas | Normal. Google demora pra confiar em sites novos |

Para o **AdvAqui.com** especificamente, os pontos críticos são:

1. **Site recém-publicado** — Google nunca viu antes. Vai demorar 2-4 semanas
   pra começar a aparecer em buscas reais.
2. **Cidades sem advogados cadastrados** — páginas vazias podem ser
   classificadas como "thin content". Já mitigado pelos textos
   introdutórios e empty states com CTA.
3. **Domain authority zero** — sem backlinks externos, o ranking começa
   baixo. Estratégias para depois:
   - Publicar artigos em blogs jurídicos com link pro AdvAqui
   - Cadastrar no Google Business Profile
   - Listar em diretórios de empresas brasileiras

---

## 6. O que cabe a você (não-técnico)

| Passo | Onde | Tempo |
|---|---|---|
| Criar conta GSC | search.google.com/search-console | 5 min |
| Adicionar propriedade `https://advaqui.com` | GSC | 1 min |
| Me passar o código de verificação | Email pra mim | 1 min |
| Eu adiciono meta tag, faço deploy | (eu faço) | 10 min |
| Você verifica no GSC | GSC | 1 min |
| Submeter sitemap.xml | GSC → Sitemaps | 1 min |
| Solicitar indexação das 10 URLs principais | GSC → Inspeção | 15 min |
| Repetir tudo no Bing Webmaster | bing.com/webmasters | 20 min |
| Aguardar | — | 1 a 4 semanas |

**Total ativo da sua parte**: ~45 minutos. O resto é esperar.

---

## 7. Como saber se funcionou

Em 7-14 dias, faça essa busca no Google:

```
site:advaqui.com
```

Se retornar pelo menos uma página, o Google indexou. Em 30 dias, busca por:

```
advogado em almenara
```

Se o AdvAqui aparecer em algum lugar da primeira página, ótimo. Se aparecer
na segunda/terceira, normal (domínio novo). O ranking sobe com tempo +
conteúdo + backlinks.

---

**Próximo passo prático**: cria conta no Google Search Console e me passa o
código de verificação. O resto eu faço.
