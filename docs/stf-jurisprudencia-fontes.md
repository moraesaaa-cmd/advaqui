# STF — fontes oficiais investigadas para jurisprudência

Documento técnico das tentativas reais de acessar a jurisprudência do
Supremo Tribunal Federal a partir do VPS, com foco em **fontes oficiais
públicas** (sem APIs comerciais, sem dados inventados).

Última atualização: maio/2026.

## TL;DR

- **Não há, hoje, API REST oficial pública do STF acessível por HTTP
  simples a partir do VPS** que entregue ementas/acórdãos estruturados.
- O Portal de Jurisprudência do STF (SPA Angular) é protegido por **AWS
  WAF com JavaScript challenge** (`x-amzn-waf-action: challenge`).
- O Portal de Dados Abertos do CNJ (DataJud) **não cobre o STF** —
  retorna `404 index_not_found_exception` no índice `api_publica_stf`.
- Para coletar acórdãos do STF em produção, será necessário usar um
  navegador headless (Playwright/Selenium) que execute o JS challenge.
  Trabalho específico, não implementado nesta fase.

## Tentativas realizadas (com logs reais)

### 1. API JSON do portal SPA

```bash
curl -X POST 'https://jurisprudencia.stf.jus.br/api/search/search?base=acordaos' \
  -d '{"query":{"match_all":{}},"size":3}'
```

Resultado: **HTTP 202 Accepted** com body vazio. Headers retornados:

```
Server: awselb/2.0
x-amzn-waf-action: challenge
Content-Type: text/html; charset=UTF-8
```

Diagnóstico: AWS WAF (Web Application Firewall) está apresentando um
desafio de JavaScript em vez de processar a busca. Curl/requests não
conseguem resolver esse desafio.

### 2. Portal antigo ASP

```bash
curl 'http://www.stf.jus.br/portal/jurisprudencia/listarJurisprudencia.asp?...'
```

Resultado: **HTTP 403 Forbidden**. O sistema antigo foi descontinuado
para acesso direto e redireciona para o portal SPA novo.

### 3. Feed RSS

```bash
curl 'https://noticias.stf.jus.br/feeds/posts/default?alt=rss'
```

Resultado: **HTTP 404**. O feed RSS clássico foi descontinuado quando
o STF migrou para WordPress.

### 4. DataJud do CNJ

```bash
curl -H "Authorization: APIKey ..." \
  'https://api-publica.datajud.cnj.jus.br/api_publica_stf/_search'
```

Resultado: **HTTP 404** com erro
`{"type":"index_not_found_exception","reason":"no such index [api_publica_stf]"}`.
O STF mantém seu próprio sistema e **não está no DataJud** do CNJ
(diferentemente do STJ, dos TRFs, dos TJs, etc.).

## Conclusão

A única forma honesta e oficial de obter acórdãos completos do STF
hoje envolve:

1. **Playwright headless** (Chromium) que executa o JS challenge do
   AWS WAF. Custo: ~500MB de disco extra, ~300MB de RAM por processo,
   ~10-30s por busca, 1-2 dias de desenvolvimento para fluxo robusto
   com retries e detecção de mudança de seletor.

2. **Acordo institucional com o STF** para acesso oficial via API
   privada (improvável e fora de escopo).

Por isso, esta fase do projeto entrega apenas **STJ via Portal de
Dados Abertos (CKAN)**, que funciona perfeitamente. A página
`/jurisprudencia/stf` permanece em **estado vazio honesto** até o
coletor Playwright ser construído em fase futura.

## Caminho técnico recomendado (futuro)

Quando for a hora de implementar:

```
scripts/jurisprudencia/collectors/stf_playwright.py
```

Pseudocódigo:

```python
from playwright.async_api import async_playwright

async def collect_stf(limit=50):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(
            user_agent="advaqui.com jurisprudencia-bot (contato@advaqui.com.br)"
        )
        page = await ctx.new_page()
        await page.goto("https://jurisprudencia.stf.jus.br/pages/search?base=acordaos&sort=_score&sortBy=desc")
        # Esperar o WAF challenge resolver sozinho
        await page.wait_for_selector("...resultado...", timeout=30000)
        # Extrair os primeiros N resultados
        # Para cada resultado, abrir a página de detalhe e extrair ementa
        # ...
```

Custo aproximado por execução diária com 50 decisões:
- ~30 minutos de wall time (Playwright sequencial, respeitando rate limit).
- ~700MB pico de RAM.
- ~100MB de tráfego (HTML + CSS + JS do portal).
