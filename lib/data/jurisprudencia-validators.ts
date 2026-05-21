/**
 * Validadores de jurisprudência — segurança de conteúdo público.
 *
 * Centraliza três checks usados em listagem, detalhe, sitemap e coletor:
 *
 *   1. isOfficialSource(url) — valida que a fonte é STF/STJ/CNJ oficial
 *      e nunca example.invalid ou domínio aleatório.
 *
 *   2. looksLikeFixture(decisao) — detecta marcadores de dados sintéticos
 *      (AMOSTRA, fixture, mock, demo, sample, lorem). Decisão real
 *      jamais contém esses tokens em ementa/relator/seo_title.
 *
 *   3. mayBeSensitive(decisao) — sinaliza segredo de justiça e dados
 *      sensíveis (menor, vítima de violência sexual, processo sigiloso).
 *      Na dúvida, retorna true → caller marca noindex/oculta.
 *
 * Princípio: na dúvida, esconder. Nunca indexar lixo, nunca expor
 * conteúdo sigiloso.
 */

// --------------------------------------------------------------------------
// 1) Fontes oficiais — domínios permitidos
// --------------------------------------------------------------------------
const OFFICIAL_HOSTS = new Set<string>([
  "stf.jus.br",
  "portal.stf.jus.br",
  "redir.stf.jus.br",
  "jurisprudencia.stf.jus.br",
  "stj.jus.br",
  "www.stj.jus.br",
  "processo.stj.jus.br",
  "scon.stj.jus.br",
  "ww2.stj.jus.br",
  // Portal de Dados Abertos do STJ — fonte oficial dos "Espelhos de Acórdãos"
  "dadosabertos.web.stj.jus.br",
  "cnj.jus.br",
  "www.cnj.jus.br",
]);

const FORBIDDEN_HOSTS = new Set<string>([
  "example.invalid",
  "example.com",
  "example.org",
  "localhost",
  "127.0.0.1",
]);

export function isOfficialSource(url: string | null | undefined): boolean {
  if (!url || typeof url !== "string") return false;
  let host: string;
  try {
    const parsed = new URL(url.trim());
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;
    host = parsed.hostname.toLowerCase();
  } catch {
    return false;
  }
  if (FORBIDDEN_HOSTS.has(host)) return false;
  if (host.endsWith(".invalid")) return false;
  if (host.endsWith(".test")) return false;
  if (host.endsWith(".example")) return false;
  // Aceita subdomínios .jus.br oficiais explicitamente listados.
  return OFFICIAL_HOSTS.has(host);
}

// --------------------------------------------------------------------------
// 2) Marcadores de dados sintéticos
// --------------------------------------------------------------------------
// Tokens que jamais aparecem em ementa/relator/título reais.
// Case-insensitive. Decisão real do STF/STJ não contém nenhum desses.
const FAKE_TOKENS_RE = /\b(amostra|fixture|mockup?|demo(stra)?|sample|lorem\s+ipsum)\b/i;
const FAKE_DOMAIN_RE = /(example\.invalid|example\.com|\.invalid\b|\.test\b)/i;

type DecisaoMinimal = {
  ementa?: string | null;
  relator?: string | null;
  seo_title?: string | null;
  url_origem?: string | null;
  tribunal?: string | null;
};

export function looksLikeFixture(d: DecisaoMinimal): boolean {
  if (d.url_origem && FAKE_DOMAIN_RE.test(d.url_origem)) return true;
  if (d.ementa && FAKE_TOKENS_RE.test(d.ementa)) return true;
  if (d.relator && FAKE_TOKENS_RE.test(d.relator)) return true;
  if (d.seo_title && FAKE_TOKENS_RE.test(d.seo_title)) return true;
  return false;
}

// --------------------------------------------------------------------------
// 3) Detecção de dados sensíveis (segredo de justiça, menores, violência sexual)
// --------------------------------------------------------------------------
// Lista deliberadamente conservadora. Caller marca noindex quando true.
const SENSITIVE_RE = new RegExp(
  [
    "\\bsegredo\\s+de\\s+justi[çc]a\\b",
    "\\bsigilo(so)?\\b",
    "\\btramita[çc][ãa]o\\s+sigilosa\\b",
    "\\bprocesso\\s+sigiloso\\b",
    "\\bestatuto\\s+da\\s+crian[çc]a\\s+e\\s+do\\s+adolescente\\b",
    "\\beca\\b",
    "\\bviol[êe]ncia\\s+sexual\\b",
    "\\babuso\\s+sexual\\b",
    "\\bestupro\\s+de\\s+vulner[áa]vel\\b",
    "\\bcrime\\s+sexual\\s+contra\\s+menor\\b",
    "\\bado[çc][ãa]o\\s+(sigilosa|de\\s+menor)\\b",
    "\\bguarda\\s+de\\s+menor\\b",
    "\\bdesti(t|tuiç)[ãa]o\\s+do\\s+poder\\s+familiar\\b",
  ].join("|"),
  "i"
);

export function mayBeSensitive(d: DecisaoMinimal & { temas?: string[] | null }): boolean {
  const haystack = [
    d.ementa || "",
    d.relator || "",
    d.seo_title || "",
    ...(Array.isArray(d.temas) ? d.temas : []),
  ].join(" \n ");
  if (!haystack.trim()) return false;
  return SENSITIVE_RE.test(haystack);
}

// --------------------------------------------------------------------------
// 4) Helper composto: decisão é apresentável publicamente?
// --------------------------------------------------------------------------
export function isPubliclyDisplayable(
  d: DecisaoMinimal & { temas?: string[] | null; ementa?: string | null }
): { ok: boolean; reason?: string } {
  if (!d.ementa || d.ementa.trim().length < 20) {
    return { ok: false, reason: "ementa_vazia_ou_muito_curta" };
  }
  if (looksLikeFixture(d)) {
    return { ok: false, reason: "marcadores_de_fixture" };
  }
  if (!isOfficialSource(d.url_origem)) {
    return { ok: false, reason: "fonte_nao_oficial" };
  }
  if (mayBeSensitive(d)) {
    return { ok: false, reason: "possivel_sigilo_ou_dado_sensivel" };
  }
  return { ok: true };
}
