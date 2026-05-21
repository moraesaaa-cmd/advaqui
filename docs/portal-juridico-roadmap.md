# Portal Jurídico AdvAqui — Roadmap

Documento de planejamento das camadas públicas e programáticas que compõem o
Portal Jurídico do AdvAqui. A camada **Jurisprudência (STF/STJ)** foi
implementada em maio/2026 (migration 0008). As demais camadas estão previstas,
preservando a mesma arquitetura, disciplina de armazenamento e princípios
editoriais.

---

## 1. Princípios fixos (valem para todas as camadas)

1. **Não somos órgão público.** Em toda página é destacado que o AdvAqui é um
   portal independente que organiza informações públicas — nunca substitui a
   fonte oficial.
2. **Armazenamento contido.** Metadados + ementa/resumo ficam permanentes.
   Inteiro teor, peças completas e PDFs ficam em **cache temporário** com TTL
   curto (padrão 7 dias). Limpeza diária via cron.
3. **Indexação seletiva.** Só vai para o Google o que tem qualidade real —
   ementa não-trivial, classe canônica, tese ou tema mapeado. Caso contrário,
   `indexavel = false` + `noindex` no header.
4. **Coleta respeitosa.** User-Agent honesto (`advaqui.com {modulo}-bot
   (contato@advaqui.com.br)`), rate-limit ≤ 1 req/s por domínio, backoff
   exponencial nos códigos 429/500/502/503/504. Nunca rodar coletas em horário
   de pico do tribunal.
5. **Aviso ético sempre visível.** No rodapé de cada página o usuário lê de
   onde veio o dado e qual o link da fonte oficial.
6. **Sem cópia de concorrentes.** Não baixamos do Jusbrasil, JurisHand,
   Migalhas etc. Apenas fontes oficiais públicas.
7. **Sem logos oficiais sem autorização.** Apenas o nome do tribunal em texto.

---

## 2. Camadas

### 2.1 Jurisprudência (implementada — maio/2026)

- Cobertura: **STF** e **STJ**.
- Estrutura URL: `/jurisprudencia`, `/jurisprudencia/[tribunal]`,
  `/jurisprudencia/[tribunal]/[slug]`.
- Tabelas: `jurisprudencia_decisoes`, `jurisprudencia_inteiro_teor_cache`,
  `jurisprudencia_coleta_logs`, `jurisprudencia_temas`.
- Coletores Python em `scripts/jurisprudencia/`.
- Sitemap dedicado: `/sitemap-jurisprudencia.xml`.

**Próximas iterações da própria camada:**

- Coletores reais (STF Portal + STJ SCON) substituindo as fixtures.
- Páginas-tema `/jurisprudencia/temas/[slug]` com textos editoriais.
- Painel admin para curadoria (publicar/despublicar manualmente,
  ajustar ementa).
- Métricas de acessos por decisão e por tema.

---

### 2.2 Modelos de documentos (planejada)

Documentos jurídicos extrajudiciais e administrativos para uso livre. Já há
embrião em `/modelos` (templates próprios do AdvAqui). Próximo passo é
expandir para um catálogo maior + categorização + busca.

- URLs: `/modelos`, `/modelos/[categoria]`, `/modelos/[slug]`.
- Tabela proposta: `juridico_modelos` (id, slug, titulo, categoria,
  conteudo_md, area_relacionada, palavras_chave, indexavel, criado_em,
  atualizado_em).
- Indexação: cada modelo gera uma página única com botão "Baixar em .docx"
  (server-side render via `docx` package) e "Baixar em .pdf".
- Conteúdo: produzido pelo próprio AdvAqui — não copiamos modelos de
  concorrentes.

---

### 2.3 Peças processuais comentadas (planejada)

Não modelos genéricos, mas **peças reais** anonimizadas, comentadas por área
(ex: contestação trabalhista com voto vencido analisado).

- URLs: `/pecas`, `/pecas/[area]`, `/pecas/[slug]`.
- Tabela proposta: `juridico_pecas` (com `anonimizada = true` obrigatório
  + autoria explícita + autorização documentada).
- Risco-chave: anonimização incompleta. **Política**: só publicamos peças
  com anonimização verificada por dupla checagem + autorização do advogado
  signatário ou de fonte pública (DJe).
- Não copiamos peças de bancas alheias sem permissão.

---

### 2.4 Diários oficiais por estado (planejada)

Snippet diário de publicações relevantes do DJE estadual + DJU federal,
com filtro por advogado cadastrado (premium recebe alertas).

- URLs: `/diarios`, `/diarios/[uf]`, `/diarios/[uf]/[data]`.
- Tabela proposta: `juridico_diarios_publicacoes` (id, uf, data,
  tribunal, processo, texto, hash). TTL no texto integral (90 dias). Após,
  só metadados.
- Coletores Python: um por TJ + STJ + TST + TRF. Volume alto — exige
  particionamento por mês.
- Painel premium: alerta por e-mail quando o nome ou OAB do advogado
  cadastrado aparecer em uma publicação.

---

### 2.5 Consulta processual (planejada — mais distante)

Consulta de andamento por número CNJ. **Não vamos replicar o PJe**. A ideia é
encurtar a busca: usuário digita o número, redirecionamos para o sistema
oficial do tribunal correto (com aviso) e armazenamos apenas o **resumo
público** do andamento mais recente, com TTL 24h.

- URLs: `/consulta`, `/consulta/[numero-cnj]`.
- Tabela proposta: `juridico_andamentos_cache` com TTL agressivo (24h).
- Compliance: respeitamos `robots.txt` de cada PJe; quando o tribunal
  bloqueia consulta automatizada, exibimos o link oficial e paramos. Nunca
  fazemos scraping persistente em PJes que proíbem.

---

### 2.6 Temas e súmulas (parcialmente em jurisprudência)

A tabela `jurisprudencia_temas` já existe. Pode crescer para um catálogo
mais amplo de:

- Súmulas (STF/STJ/TST) cada uma com página própria.
- Teses de repercussão geral e recursos repetitivos.
- Temas editorialmente curados (overlap com a tabela atual).

Estrutura URL proposta:
- `/sumulas/[tribunal]/[numero]`
- `/jurisprudencia/temas/[slug]` (já reservada)

---

## 3. Disciplina técnica compartilhada

Cada camada nova deve seguir o mesmo padrão da Jurisprudência:

1. **Migration própria** com tabelas `juridico_*` ou `{modulo}_*`.
2. **Coletor em Python** sob `scripts/{modulo}/`, com:
   - `services/` (text_cleaner, slug, seo, rate_limiter, topic_extractor,
     supabase_client, storage_report)
   - `collectors/` (fixtures + real)
   - `main.py` (orquestrador)
   - `cleanup_cache.py` (limpeza diária)
3. **Cron VPS** (2h coleta, 3h limpeza).
4. **Páginas Next.js** sob `app/{modulo}/`.
5. **Endpoint cache** sob `app/api/{modulo}/...`.
6. **Sitemap próprio** sob `app/sitemap-{modulo}.xml/route.ts`, listado no
   `app/robots.ts`.
7. **JSON-LD** apropriado (Article, FAQPage, BreadcrumbList, CollectionPage).
8. **Logs** em `{modulo}_coleta_logs`.

---

## 4. Capacidade e custos

Premissas conservadoras para os próximos 12 meses, baseadas no plano grátis
do Supabase (500 MB de banco):

| Camada | Linhas estimadas | Tamanho ementa/peça | Tamanho médio |
|---|---|---|---|
| Jurisprudência decisoes | 50.000 | 3 KB (só ementa) | 150 MB |
| Modelos | 500 | 8 KB | 4 MB |
| Peças comentadas | 200 | 30 KB | 6 MB |
| Diários cache (90d) | 200.000 (rolagem) | 1 KB | 200 MB |
| Andamentos cache (24h) | 5.000 (rolagem) | 2 KB | 10 MB |

**Total estimado:** ~370 MB → cabe folgado no plano grátis do Supabase, com
margem para crescer. O `storage_report.py` alerta quando ultrapassar 400 MB.

---

## 5. Cronograma indicativo

Cronograma sem datas fixas — depende de validação de cada módulo
anterior e de feedback de usuários reais.

| Módulo | Ordem | Estado |
|---|---|---|
| Jurisprudência STF/STJ (fixtures) | 1 | **Pronto** (maio/2026) |
| Jurisprudência STF/STJ (coleta real) | 2 | Próximo |
| Páginas-tema editoriais | 3 | Próximo |
| Modelos expandido + .docx server-side | 4 | Médio prazo |
| Súmulas (STF/STJ/TST) | 5 | Médio prazo |
| Peças comentadas | 6 | Médio prazo (depende de curadoria) |
| Diários estaduais + alerta premium | 7 | Longo prazo (volume alto) |
| Consulta processual (encurtador) | 8 | Longo prazo (depende de tolerância dos PJes) |

---

## 6. O que **não** vai entrar no portal

Lista explícita para evitar pivôs ad-hoc:

- Sistema de petição automática (concorre direto com escritórios — sai do
  posicionamento neutro do AdvAqui).
- Conteúdo gerado por IA sem revisão humana.
- Conteúdo copiado de Jusbrasil, JurisHand, Migalhas, ConJur etc.
- Dados pessoais de partes em processos públicos sem anonimização.
- Logo de tribunais ou OAB sem autorização escrita.
- Receitas/honorários estimados por área (terreno minado da OAB).
- Ranking de advogados ("melhores").

---

## 7. Como contribuir com uma nova camada

Quando for hora de adicionar a próxima camada:

1. Criar migration `00XX_{modulo}.sql` com tabelas + RLS + indexes + fixtures.
2. Criar scaffolding em `scripts/{modulo}/` espelhando `scripts/jurisprudencia/`.
3. Criar helpers em `lib/data/{modulo}.ts` com padrão `safeAdmin()` e
   try/catch defensivo.
4. Criar páginas em `app/{modulo}/`.
5. Criar `app/sitemap-{modulo}.xml/route.ts` e referenciar em `app/robots.ts`.
6. Adicionar entrada no menu (`Header.tsx`) só depois da validação inicial.
7. Atualizar este documento com o status.

---

**Mantenedor:** equipe AdvAqui — contato@advaqui.com.br
**Última atualização:** maio/2026 (entrega da camada Jurisprudência).
