/**
 * Data estável de "última modificação" usada nos sitemaps.
 *
 * Antes cada request gerava `new Date()`, então TODO lastmod mudava a cada
 * hora — o Google aprende que o lastmod não é confiável e passa a ignorar os
 * sitemaps, prejudicando a indexação. Aqui fixamos uma data de release
 * honesta e única. Atualize esta constante quando houver mudança real e
 * relevante de conteúdo/estrutura no site (ex.: a cada deploy com conteúdo
 * novo). Páginas com data real (updated_at/atualizado_em) continuam usando a
 * data própria; RELEASE_DATE é só o fallback estável.
 */
export const RELEASE_DATE = new Date("2026-07-01T00:00:00.000Z");
