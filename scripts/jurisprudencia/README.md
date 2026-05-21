# Módulo de Coleta — Jurisprudência STF / STJ

Coletores Python pro AdvAqui. Roda no VPS Hostinger (cron). Insere/atualiza
decisões na tabela `jurisprudencia_decisoes` do Supabase via REST API (PostgREST).

## Arquitetura

```
scripts/jurisprudencia/
├── main.py                  # Orquestrador da coleta (cron diário)
├── cleanup_cache.py         # Limpa cache inteiro teor expirado
├── requirements.txt         # Dependências Python
├── .env.example             # Template de configuração
├── collectors/
│   ├── __init__.py
│   ├── base.py              # Coletor base (interface)
│   ├── stf.py               # Coletor STF
│   ├── stj.py               # Coletor STJ
│   └── fixtures.py          # Modo fixture (sem rede, pra testes)
└── services/
    ├── __init__.py
    ├── supabase_client.py   # Cliente Supabase via PostgREST
    ├── slug_service.py      # Geração de slugs únicos
    ├── seo_service.py       # Geração de title/description SEO
    ├── text_cleaner.py      # Limpeza/normalização de texto
    ├── rate_limiter.py      # Rate limit por domínio
    ├── topic_extractor.py   # Extração de temas/palavras-chave
    └── storage_report.py    # Relatório de armazenamento
```

## Modo de operação

O coletor lê `JURIS_MODE` do `.env`:

- **`disabled`** (DEFAULT EM PRODUÇÃO — SEGURO): o `main.py` retorna
  imediatamente sem coletar nada. Estado padrão até a coleta real ser
  validada manualmente.
- **`fixtures`**: gera decisões sintéticas com marcador `AMOSTRA AdvAqui`
  e domínio `example.invalid`. **NUNCA ATIVAR EM PRODUÇÃO.** Esses dados
  são filtrados em runtime mas poluem o banco.
- **`real-stf`** / **`real-stj`**: ativa scraping real dos portais oficiais
  (1 req/seg, User-Agent honesto, backoff exponencial). **Coletor real
  ainda em scaffolding — atualmente delega para o fixture e loga aviso.**
- **`real`**: equivalente a coletar `real-stf` + `real-stj`.

### Ativando coleta real

Quando o coletor real estiver implementado:

```bash
# .env do scripts/jurisprudencia
JURIS_MODE=real
JURIS_IMPORT_BATCH_SIZE=100
JURIS_CONTACT_EMAIL=contato@advaqui.com.br

# Testar manualmente uma execução antes de ativar via cron
source .venv/bin/activate
python3 main.py
```

## Princípio de armazenamento

- **Decisões**: ementa + metadados são permanentes
- **Inteiro teor**: SEMPRE em cache temporário (`jurisprudencia_inteiro_teor_cache`)
  com TTL 7 dias. Cleanup diário às 03h via cron remove expirados.
- **Listagens nunca carregam inteiro teor** (consulta SQL exclui o cache).
- **Nada permanente automaticamente**.

## Configuração no VPS

```bash
# Instalar dependências (uma vez)
cd /var/www/advaqui/scripts/jurisprudencia
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Copiar template de env e editar
cp .env.example .env
# editar .env com SUPABASE_URL e SUPABASE_SERVICE_KEY

# Rodar manualmente com 100 decisões (Onda 1)
JURIS_IMPORT_BATCH_SIZE=100 python3 main.py

# Limpar cache expirado manualmente
python3 cleanup_cache.py

# Relatório de storage
python3 -c "from services.storage_report import print_report; print_report()"
```

## Cron (instalar com `crontab -e` no VPS como root)

```cron
# Coleta diária às 2h (no-op se JURIS_MODE=disabled — estado padrão)
0 2 * * * cd /var/www/advaqui/scripts/jurisprudencia && /var/www/advaqui/scripts/jurisprudencia/.venv/bin/python3 main.py >> /var/log/juris-coleta.log 2>&1

# Limpeza de cache de inteiro teor às 3h
0 3 * * * cd /var/www/advaqui/scripts/jurisprudencia && /var/www/advaqui/scripts/jurisprudencia/.venv/bin/python3 cleanup_cache.py >> /var/log/juris-cleanup.log 2>&1

# Auditoria de dados às 4h (detecta fixtures/AMOSTRA/example.invalid em produção)
0 4 * * * cd /var/www/advaqui/scripts/jurisprudencia && /var/www/advaqui/scripts/jurisprudencia/.venv/bin/python3 audit_jurisprudencia.py >> /var/log/juris-audit.log 2>&1

# Health check das fontes às 4h30
30 4 * * * cd /var/www/advaqui/scripts/jurisprudencia && /var/www/advaqui/scripts/jurisprudencia/.venv/bin/python3 source_health_check.py >> /var/log/juris-source-health.log 2>&1

# Validador de sitemap às 5h
0 5 * * * cd /var/www/advaqui/scripts/jurisprudencia && /var/www/advaqui/scripts/jurisprudencia/.venv/bin/python3 sitemap_validator.py >> /var/log/juris-sitemap.log 2>&1
```

## Compliance

- User-Agent: `advaqui.com jurisprudencia-bot (contato@advaqui.com.br)`
- Respeita robots.txt antes de cada novo domínio
- Rate limit fixo de 1 req/s por domínio
- Backoff exponencial em 429/5xx
- Logs estruturados em `logs/`
- Não salva inteiro teor inteiro automaticamente — cache TTL 7 dias

## Carga progressiva (ondas)

| Onda | Quantidade | Quando |
|------|-----------|--------|
| 1    | 100 STF + 100 STJ | Inicial (após aplicar migration 0008) |
| 2    | 500 STF + 500 STJ | Após validar performance da onda 1 |
| 3    | 2.000 STF + 2.000 STJ | Após validar storage da onda 2 |
| 4    | 10.000 totais | Após relatório de storage OK |
| 5+   | Ampliar | Só após análise manual |

**Não ampliar sem rodar `storage_report.py` e revisar.**
