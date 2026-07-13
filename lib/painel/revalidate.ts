import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import type { LawyerRow } from "@/lib/supabase/types";
import { SPECIALTIES } from "@/lib/data/specialties";
import { slugify } from "@/lib/utils/slug";

/**
 * Módulo ÚNICO de revalidação de páginas de advogado.
 *
 * Antes existiam DUAS implementações divergentes:
 *  - lib/painel/server.ts → revalidateLawyerPages(lawyer)   [incluía /sitemap.xml]
 *  - app/api/admin/route.ts → revalidateLawyerPages(id)     [sem /sitemap.xml]
 * e o cron de expiração (app/api/cron/expire-premium) não revalidava NADA.
 *
 * Agora todos os call sites usam este módulo. O conjunto de paths é a UNIÃO
 * dos dois anteriores (nenhum path foi removido) + a família
 * /advogados-de/[area]/em/[cidade] por segurança (hoje é force-dynamic;
 * revalidar é no-op barato, mas protege se um dia virar ISR).
 */

/** Campos mínimos do lawyer necessários para montar os paths. */
export type RevalidatableLawyer = Pick<
  LawyerRow,
  | "slug"
  | "uf"
  | "city_slug"
  | "target_uf"
  | "target_city"
  | "extra_cities"
  | "specialties"
>;

/**
 * Normaliza um valor de `lawyers.specialties` para o slug canônico usado nas
 * rotas (/advogados/[uf]/[cidade]/[especialidade] e /advogados-de/[area]).
 *
 * O banco DEVERIA guardar slugs ("trabalhista"), mas registros antigos podem
 * ter o nome exibido ("Trabalhista", "Previdenciário"). Devolve TODOS os
 * candidatos plausíveis (valor cru + slug mapeado) para revalidar ambos
 * quando houver ambiguidade — revalidar um path inexistente é inofensivo.
 */
export function specialtySlugCandidates(raw: string): string[] {
  const out = new Set<string>();
  const trimmed = raw.trim();
  if (!trimmed) return [];
  out.add(trimmed);
  const lower = trimmed.toLowerCase();
  const bySlug = SPECIALTIES.find((s) => s.slug === lower);
  if (bySlug) {
    out.add(bySlug.slug);
    return Array.from(out);
  }
  const byName = SPECIALTIES.find(
    (s) => s.name.toLowerCase() === lower || slugify(s.name) === slugify(trimmed)
  );
  if (byName) out.add(byName.slug);
  else out.add(slugify(trimmed));
  return Array.from(out).filter(Boolean);
}

/** Monta o conjunto completo de paths afetados por mudanças nesse lawyer. */
export function buildLawyerPaths(lawyer: RevalidatableLawyer): string[] {
  const paths = new Set<string>();
  paths.add("/");
  paths.add(`/advogado/${lawyer.slug}`);
  paths.add(`/p/${lawyer.slug}`);
  paths.add("/advogados");
  // Sitemap principal — força regeneração pra Google/Bing verem mudanças
  paths.add("/sitemap.xml");

  const specsRaw = Array.isArray(lawyer.specialties)
    ? (lawyer.specialties as string[])
    : [];
  const specSlugs = new Set<string>();
  for (const sp of specsRaw) {
    if (typeof sp !== "string") continue;
    for (const candidate of specialtySlugCandidates(sp)) {
      specSlugs.add(candidate);
    }
  }

  // Todas as (uf, citySlug) onde o lawyer aparece: principal, target legado
  // e cidades adicionais (extra_cities).
  type CityPair = { uf: string; slug: string };
  const cityPairs: CityPair[] = [];
  if (lawyer.uf && lawyer.city_slug) {
    cityPairs.push({ uf: lawyer.uf, slug: lawyer.city_slug });
  }
  if (lawyer.target_uf && lawyer.target_city) {
    cityPairs.push({ uf: lawyer.target_uf, slug: lawyer.target_city });
  }
  const extras = Array.isArray(lawyer.extra_cities) ? lawyer.extra_cities : [];
  for (const c of extras as Array<{ uf?: string; slug?: string }>) {
    if (c && typeof c.uf === "string" && typeof c.slug === "string") {
      cityPairs.push({ uf: c.uf, slug: c.slug });
    }
  }

  for (const pair of cityPairs) {
    const ufLower = pair.uf.toLowerCase();
    const citySlug = pair.slug.toLowerCase();
    // Índice do estado + página da cidade
    paths.add(`/advogados/${ufLower}`);
    paths.add(`/advogados/${ufLower}/${citySlug}`);
    for (const sp of specSlugs) {
      // Rota do diretório por especialidade
      paths.add(`/advogados/${ufLower}/${citySlug}/${sp}`);
      // Família editorial "advogado [área] em [cidade]" (param cidade-uf)
      paths.add(`/advogados-de/${sp}/em/${citySlug}-${ufLower}`);
    }
  }
  return Array.from(paths);
}

/**
 * Refresh do microcache do nginx para os paths do lawyer.
 *
 * As páginas públicas são cacheadas pelo nginx por 5 min (TTL curto). Em
 * mudança de perfil/plano, este hook rebusca cada URL com o header secreto
 * de bypass (CACHE_REFRESH_SECRET, o mesmo valor mapeado no nginx): o bypass
 * força ir ao Next e a resposta fresca SUBSTITUI a cópia em cache na hora —
 * ninguém espera o TTL para ver selo premium aparecer/sumir.
 *
 * Fire-and-forget: nunca lança, nunca bloqueia a resposta do painel/admin.
 * Sem o env configurado é no-op (o TTL de 5 min segue como teto).
 */
export function refreshNginxCacheForLawyer(lawyer: RevalidatableLawyer): void {
  const secret = process.env.CACHE_REFRESH_SECRET;
  if (!secret) return;
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://advaqui.com").replace(/\/$/, "");
  const paths = buildLawyerPaths(lawyer).filter(
    (p) => p !== "/sitemap.xml" && !p.startsWith("/p/")
  );
  for (const p of paths) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15000);
    fetch(`${base}${p}`, {
      headers: { "x-adv-cache-refresh": secret },
      cache: "no-store",
      signal: ctrl.signal
    })
      .catch(() => undefined)
      .finally(() => clearTimeout(timer));
  }
}

/**
 * Revalida todas as páginas afetadas por mudanças no perfil/plano do lawyer.
 * Versão síncrona (dados já em mãos) — usada pelo painel.
 */
export function revalidateLawyerPages(lawyer: RevalidatableLawyer): void {
  for (const path of buildLawyerPaths(lawyer)) {
    try {
      revalidatePath(path);
    } catch (err) {
      console.error("[revalidate] revalidatePath failed for", path, err);
    }
  }
  refreshNginxCacheForLawyer(lawyer);
}

/**
 * Versão por ID (busca os campos no banco antes) — usada pelo admin e pelo
 * cron de expiração de premium. Nunca lança: erros só vão pro log.
 */
export async function revalidateLawyerPagesById(lawyerId: string): Promise<void> {
  try {
    // noStore: read-after-write — o caller acabou de ALTERAR esse lawyer e
    // este SELECT precisa ver o estado novo (ex.: slug alterado) para
    // revalidar os paths certos. URL constante por id = cacheável sem isso.
    const supabase = createAdminClient({ noStore: true });
    const { data } = await supabase
      .from("lawyers")
      .select("slug,uf,city_slug,target_uf,target_city,extra_cities,specialties")
      .eq("id", lawyerId)
      .maybeSingle();
    if (!data) return;
    revalidateLawyerPages(data as unknown as RevalidatableLawyer);
  } catch (err) {
    console.error("[revalidate] revalidateLawyerPagesById failed", err);
  }
}
