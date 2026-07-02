# CLAUDE.md — AdvAqui

Next.js 14 (App Router) + TypeScript strict + Tailwind + Supabase. Site no ar em advaqui.com.

## Design

**Antes de qualquer trabalho visual, leia `DESIGN.md` na raiz** — design system Apex completo: paleta navy/creme/âmbar com regra 60/30/10, regra dura de contraste (âmbar nunca como texto em fundo claro; usar `text-brand-accentText` #8A6E2B), tipografia Fraunces+Inter, radius, foco, espaçamento e sinais de layout genérico a evitar.

## Regras invioláveis

- Nunca `noindex`; nunca remover URL; nunca canonical para página genérica.
- Texto público sem menção a IA.
- Sem promessa de resultado nem superlativos ("melhor advogado") — compliance OAB.
- Não tocar no fluxo pago de multas.
- Colunas do banco: somente as definidas em `lib/supabase/types.ts` — não inventar nomes.

## Documentos úteis

- `DESIGN.md` — design system (obrigatório para UI).
- `ESTADO-ATUAL.md`, `DECISOES.md`, `PROXIMOS-PASSOS.md`, `CHANGELOG.md` — estado e histórico do projeto.
