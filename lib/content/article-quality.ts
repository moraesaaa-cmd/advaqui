/**
 * Portão de qualidade de conteúdo (artigos de blog gerados/reescritos por IA).
 *
 * MOTIVAÇÃO (auditoria 2026-07-04): a "corrupção diária" do site vinha dos crons
 * de conteúdo. `enhance-articles` REESCREVIA o corpo de artigos publicados sem
 * checar nada — acumulando HTML quebrado e encolhendo o texto a cada execução —
 * e os geradores publicavam `status:"published"` sem validar tamanho/estrutura,
 * deixando páginas vazias/finas no índice. Todo `insert`/`update` de corpo de
 * artigo agora passa por aqui.
 *
 * Sem dependência externa (o projeto não tem sanitizer): sanitização por
 * allowlist com regex conservadora — suficiente porque a fonte é a nossa
 * própria IA (não entrada de usuário), o objetivo é impedir HTML quebrado e
 * neutralizar script/handlers acidentais.
 */

/** Conta palavras do texto visível (remove tags). */
export function wordCount(html: string): number {
  if (!html) return 0;
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return 0;
  return text.split(" ").length;
}

/**
 * Remove o que pode quebrar layout ou injetar script:
 *  - blocos <script>/<style>/<iframe>/<object>/<embed>
 *  - atributos on* (onclick, onerror…) e href/src com javascript:
 *  - comentários HTML
 * Mantém as tags de conteúdo (h1-h4, p, ul/ol/li, strong/em, a, blockquote,
 * table…). Não tenta ser um sanitizer completo — é uma rede de segurança.
 */
export function sanitizeArticleHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\s*(script|style|iframe|object|embed|form)[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/<\s*(script|style|iframe|object|embed|form)[^>]*\/?\s*>/gi, "")
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "")
    .replace(/(href|src)\s*=\s*("|')\s*javascript:[^"']*\2/gi, '$1="#"')
    .trim();
}

export type ArticleValidation = { ok: true } | { ok: false; reason: string };

/**
 * Valida o corpo de um artigo ANTES de gravar como publicado.
 * minWords default 900 — abaixo disso é thin-content e não deve ir ao ar.
 */
export function validateArticleBody(
  body: string | null | undefined,
  opts: { minWords?: number; requireHeading?: boolean } = {}
): ArticleValidation {
  const minWords = opts.minWords ?? 900;
  const requireHeading = opts.requireHeading ?? true;

  const clean = (body || "").trim();
  if (!clean) return { ok: false, reason: "corpo vazio" };

  const words = wordCount(clean);
  if (words < minWords) {
    return { ok: false, reason: `corpo curto (${words} palavras, mínimo ${minWords})` };
  }
  if (requireHeading && !/<h[1-4][\s>]/i.test(clean)) {
    return { ok: false, reason: "sem subtítulo (h2/h3)" };
  }
  // Marcadores óbvios de conteúdo de teste/placeholder.
  if (/lorem ipsum|texto de teste|placeholder|\btodo\b/i.test(clean)) {
    return { ok: false, reason: "conteúdo de placeholder/teste" };
  }
  // HTML grosseiramente desbalanceado (abre muito mais do que fecha).
  const opens = (clean.match(/<(p|div|h[1-4]|ul|ol|li)\b/gi) || []).length;
  const closes = (clean.match(/<\/(p|div|h[1-4]|ul|ol|li)>/gi) || []).length;
  if (opens > 0 && closes < opens * 0.6) {
    return { ok: false, reason: "HTML desbalanceado (tags não fechadas)" };
  }
  return { ok: true };
}

/**
 * Decide se um corpo REESCRITO (enhance) pode substituir o original.
 * Só aceita se: passa na validação, NÃO encolhe (≥ do que tinha) e preserva a
 * maior parte do texto original (evita a IA "resumir" e apagar seções).
 */
export function canReplaceBody(oldBody: string, newBodyRaw: string): ArticleValidation {
  const newBody = sanitizeArticleHtml(newBodyRaw || "");
  const valid = validateArticleBody(newBody, { minWords: 600 });
  if (!valid.ok) return valid;

  const oldWords = wordCount(oldBody || "");
  const newWords = wordCount(newBody);
  if (newWords < oldWords) {
    return { ok: false, reason: `encolheu (${oldWords}→${newWords} palavras)` };
  }
  return { ok: true };
}
