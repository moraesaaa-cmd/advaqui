# DESIGN.md — Design System Apex (AdvAqui)

Guia obrigatório para qualquer trabalho visual neste repositório. Em caso de dúvida, este arquivo decide. Tokens implementados em `tailwind.config.ts` (`brand.*`) e componentes base em `app/globals.css`.

---

## 1. Paleta e papéis (regra 60/30/10)

| Papel | Cor | Token Tailwind | Uso |
|---|---|---|---|
| Moldura / autoridade | Navy `#0F1B2D` | `brand-ink` | Header, footer, seções de fechamento, títulos, texto principal |
| Apoio do navy | `#1B3A5C` / `#264E70` | `brand-deep` / `brand-primary` | Links, subtítulos, gradientes com ink |
| Fundo de leitura (~60%) | Creme `#FAF7F0` (implementado como `#FBF9F4`) | `brand-bg` | Fundo padrão de páginas e seções de conteúdo |
| Linhas / bordas | `#E6E1D6` | `brand-line` | Bordas de cards, divisores |
| Acento âmbar (~10%) | Referência Apex `#C8A24A`; implementado como `#F59E0B` (`brand-accent`) e `#FBBF24` (`brand-accent2`) | `brand-accent` / `brand-accent2` | CTAs, badges, ícones de destaque, foco. NUNCA mais que ~10% da tela |
| Âmbar para TEXTO em fundo claro | `#8A6E2B` | `brand-accentText` | Ver regra dura abaixo |
| Âmbar para texto sobre navy | `#E3C078` | `brand-accentSoft` | Texto dourado sobre `brand-ink`/`brand-deep` |

Distribuição alvo: ~60% creme (leitura), ~30% navy (moldura/autoridade), ~10% âmbar (acento). Se uma tela parece "dourada demais", está errada.

## 2. REGRA DURA de contraste (não negociável)

**Âmbar NUNCA como texto sobre fundo claro.**

- `#C8A24A` sobre creme/branco = 2.2:1 → REPROVA WCAG AA (mínimo 4.5:1).
- Os tokens implementados `brand-accent` (#F59E0B) e `brand-accent2` (#FBBF24) reprovam igual (~2:1) como texto em fundo claro.
- Texto âmbar em fundo claro → usar `#8A6E2B` (`text-brand-accentText`, ~4.8:1 sobre creme). Nas ferramentas (`app/ferramentas/page.tsx`) já existe a constante `GOLD_TEXT = "#8A6E2B"` — é o mesmo valor.
- Texto âmbar sobre navy → usar `#E3C078` (`text-brand-accentSoft`) ou os accents vivos (`brand-accent`/`accent2`), que passam sobre `brand-ink`.
- Âmbar vivo continua liberado como: fundo de botão com texto `brand-ink`, borda, ícone decorativo, marcador de foco.

## 3. Tipografia

- **Fraunces** (`font-display`, via `--font-fraunces`): headings, números de destaque, dados que precisam de autoridade.
- **Inter** (`font-sans`, via `--font-inter`): todo o resto — corpo, UI, formulários.
- Corpo de texto: 16–18px (`text-base`/`text-lg`). Nunca menos de 14px para conteúdo de leitura; 11–13px só para metadados/badges.
- Hierarquia por peso e tamanho, não por cor âmbar.

## 4. Raio de borda (dois radius, só)

- **4–6px** (`rounded`/`rounded-md`): inputs, badges, chips, elementos pequenos.
- **12–16px** (`rounded-xl`/`rounded-2xl`): cards, seções, modais.
- Não usar radius uniforme em tudo — a variação entre os dois níveis é intencional (ver §7).

## 5. Foco visível

- Outline âmbar de 2px em todo elemento interativo: `focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent focus-visible:outline-offset-2` (já aplicado globalmente em `globals.css`).
- Nunca remover outline sem substituto visível.

## 6. Espaçamento

- Escala 4/8: usar múltiplos de 4px (p-1, p-2, p-3...) com ritmo principal em 8px. Nada de valores arbitrários (`p-[13px]`) sem motivo forte.
- Seções: `py-12`/`py-16`; cards: `p-4` a `p-6`.

## 7. Sinais de "layout de IA" a evitar

- Radius idêntico em tudo (tudo `rounded-lg`).
- Grade de cards idênticos, mesmo peso visual, sem hierarquia.
- Gradiente roxo/azul-elétrico genérico. Os únicos gradientes permitidos usam navy (`from-brand-deep to-brand-ink`) ou véus sutis de accent (`bg-brand-accent/10` com blur).
- Headline genérica ("Soluções jurídicas para você"). Headlines dizem o que a página entrega, com especificidade.
- Emoji como ícone; usar lucide-react.

## 8. Tom de voz (compliance OAB)

- Sóbrio, direto, sem promessa de resultado ("garanta sua vitória" = proibido).
- Sem superlativos comparativos ("melhor advogado", "o mais rápido").
- Texto público nunca menciona IA na entrega ao cliente final.
- Sem urgência artificial falsa; escassez só quando verdadeira.

## 9. Regras invioláveis do repositório (contexto)

- Nunca `noindex`, nunca remover URL, nunca canonical apontando para página genérica.
- Não tocar no fluxo pago de multas (`multas/`, LpPixCheckout, Pix).
- Colunas de banco: só as que existem em `lib/supabase/types.ts`.
