import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import type { LawyerRow, PublicLawyer } from "@/lib/supabase/types";
import { type Lawyer, mapLawyerRow } from "@/lib/data/lawyer-mapper";
import { PIX } from "@/lib/config";

/**
 * Funções server-side de acesso a `public.lawyers`.
 *
 * IMPORTANTE — as funções `get*` (leitura pública) usam `createAdminClient`
 * (service_role) em vez do server client com cookies. Motivo:
 *
 *   1. São chamadas em build time (`generateStaticParams`, `sitemap.ts`,
 *      Server Components no SSG) onde NÃO existe request scope, e o
 *      `createClient` do `lib/supabase/server.ts` quebra com erro
 *      "cookies was called outside a request scope".
 *
 *   2. Lêem apenas `PUBLIC_COLUMNS` (sem CPF, sem dados sensíveis), então
 *      ignorar RLS aqui não expõe nada que já não seja público pela API.
 *
 *   3. service_role roda só no servidor (nunca chega ao cliente).
 *
 * Funções `admin*` continuam usando service_role para escritas/leitura
 * completa (CPF, status) — chamadas só de Route Handlers protegidos.
 *
 * O tipo `Lawyer` e a função `mapLawyerRow` foram movidos para
 * `lib/data/lawyer-mapper.ts` para evitar que Client Components puxem
 * `next/headers` ao importarem só o mapper. Re-exportamos aqui por
 * compatibilidade com código já existente.
 */

export { type Lawyer, mapLawyerRow };

// Perfis de rede exibidos em páginas SEM advogado, para nenhuma página
// (cidade OU cidade+área) ficar vazia.
const FALLBACK_LAWYER_SLUGS = [
  "kellsons-de-moraes-oliveira",
  "barbara-de-oliveira-silva"
];
let _fallbackCache: Lawyer[] | undefined;
async function getFallbackLawyers(): Promise<Lawyer[]> {
  // Reusa o cache só quando ele está COMPLETO (todos os perfis de rede
  // resolvidos e visíveis). Nunca memoiza resultado vazio/parcial — assim um
  // erro transitório do Supabase, ou um perfil temporariamente pausado, não
  // congela um array errado em memória até o próximo restart (rota é
  // force-dynamic). No caminho normal (todos publicados) memoiza na 1ª chamada.
  if (_fallbackCache && _fallbackCache.length === FALLBACK_LAWYER_SLUGS.length) {
    return _fallbackCache;
  }
  const resolved = await Promise.all(
    FALLBACK_LAWYER_SLUGS.map((s) => findLawyerBySlug(s))
  );
  const arr = resolved.filter(
    (l): l is Lawyer => Boolean(l) && isLawyerPubliclyVisible(l as Lawyer)
  );
  if (arr.length === FALLBACK_LAWYER_SLUGS.length) _fallbackCache = arr;
  return arr;
}

/** Visibilidade pública aplicada ao Lawyer (camelCase), p/ os perfis de rede. */
function isLawyerPubliclyVisible(l: Lawyer): boolean {
  if (typeof l.pageStatus === "string" && HIDDEN_PAGE_STATUSES.has(l.pageStatus)) {
    return false;
  }
  if (l.isPublic === false) return false;
  return true;
}

/**
 * page_status que NUNCA devem aparecer no diretório público.
 */
const HIDDEN_PAGE_STATUSES = new Set<string>([
  "paused",
  "suspended"
]);

/**
 * Decide se um registro pode aparecer na listagem/contagem pública.
 *
 * Esconde quando `page_status` está num estado não-público OU `is_public`
 * é explicitamente `false`.
 *
 * DEFENSIVO/COMPAT: se `page_status` for null/undefined (registro antigo,
 * migration 0006 não aplicada) trata como visível; idem se `is_public` for
 * null/undefined. Só esconde quando há sinal EXPLÍCITO de não-visível.
 */
function isPubliclyVisible(row: {
  page_status?: string | null;
  is_public?: boolean | null;
}): boolean {
  if (
    typeof row.page_status === "string" &&
    HIDDEN_PAGE_STATUSES.has(row.page_status)
  ) {
    return false;
  }
  if (row.is_public === false) {
    return false;
  }
  return true;
}

/**
 * Conta quantos advogados da lista realmente atendem a cidade (uf+slug),
 * seja pela cidade principal, pelo target_* legado ou por extra_cities.
 *
 * Serve para distinguir advogado REAL do fallback de rede (kellsons/barbara)
 * que `getLawyersForCity` injeta em cidade vazia: o perfil de rede injetado
 * NÃO tem vínculo com a cidade, então não conta; já nas cidades em que esses
 * mesmos perfis atendem de verdade (ex.: Almenara/MG), contam normalmente.
 */
export function countRealLawyersForCity(
  list: Lawyer[],
  uf: string,
  citySlug: string
): number {
  const ufUpper = uf.toUpperCase();
  const slugLower = citySlug.toLowerCase();
  return list.filter((l) => {
    if (l.uf?.toUpperCase() === ufUpper && l.citySlug?.toLowerCase() === slugLower) return true;
    if (l.targetUf?.toUpperCase() === ufUpper && l.targetCity?.toLowerCase() === slugLower) return true;
    return l.extraCities.some(
      (c) => c.uf.toUpperCase() === ufUpper && c.slug.toLowerCase() === slugLower
    );
  }).length;
}

/**
 * Lista advogados de uma cidade específica (uf+slug).
 * Inclui também advogados com `target_city/target_uf` apontando para essa cidade
 * (advogados redirecionados manualmente pelo admin).
 *
 * Envolvida em `cache()` do React: numa mesma request (rota force-dynamic),
 * generateMetadata e o componente da página compartilham UMA query — sem
 * custo duplicado no Supabase.
 */
export const getLawyersForCity = cache(async function getLawyersForCity(
  uf: string,
  citySlug: string
): Promise<Lawyer[]> {
  const supabase = createAdminClient();
  const ufUpper = uf.toUpperCase();

  // Match em 3 lugares — uf principal, target_uf legado e extra_cities[i].uf.
  //
  // BUG CRÍTICO RESOLVIDO (Maio/2026):
  // A versão anterior usava .or(`uf.eq.${ufUpper},target_uf.eq.${ufUpper}`)
  // que NUNCA trazia lawyers cuja cidade principal está em OUTRA UF mas
  // que tem extra_cities apontando pra essa UF. Exemplo: Kellsons (Almenara/MG)
  // adicionou Vitória da Conquista/BA como extra — a query buscava
  // "uf=BA OR target_uf=BA" e Kellsons (uf=MG) NÃO era retornado, então o
  // filter JS dos extras nem rodava nele. Resultado: a página
  // /advogados/ba/vitoria-da-conquista mostrava "Nenhum advogado".
  //
  // Solução: fazer 2 queries paralelas:
  //   Q1) uf.eq OR target_uf.eq — cidade principal/target
  //   Q2) lawyers com extra_cities não vazio — vamos filtrar em JS pelos
  //       que têm essa UF nos extras (operador @> do jsonb era instável
  //       com supabase-js 2.106; pegar todos com extras populados e filtrar
  //       em JS é robusto e performático — N de lawyers premium é pequeno)
  // Merge dos resultados (deduplicado por id) e filter JS final por (uf,slug).
  //
  // SELECT * — pra tolerar tanto pré quanto pós migration 0005.

  const [primaryRes, extrasRes] = await Promise.all([
    supabase
      .from("lawyers")
      .select("*")
      .or(`uf.eq.${ufUpper},target_uf.eq.${ufUpper}`),
    supabase
      .from("lawyers")
      .select("*")
      .not("extra_cities", "is", null)
  ]);

  if (primaryRes.error) {
    console.error("getLawyersForCity primary query error:", primaryRes.error.message);
  }
  if (extrasRes.error) {
    console.error("getLawyersForCity extras query error:", extrasRes.error.message);
  }

  // Merge dedup por id
  const byId = new Map<string, PublicLawyer>();
  for (const row of (primaryRes.data || []) as PublicLawyer[]) {
    byId.set(row.id, row);
  }
  for (const row of (extrasRes.data || []) as PublicLawyer[]) {
    if (!byId.has(row.id)) byId.set(row.id, row);
  }

  const matched: Lawyer[] = [];
  for (const row of byId.values()) {
    // Esconde registros não-públicos (paused/suspended/draft… ou is_public=false).
    if (!isPubliclyVisible(row)) continue;
    // 1) cidade principal
    if (row.uf === ufUpper && row.city_slug === citySlug) {
      matched.push(mapLawyerRow(row));
      continue;
    }
    // 2) cidade adicional legada (target_*)
    if (row.target_uf === ufUpper && row.target_city === citySlug) {
      matched.push(mapLawyerRow(row));
      continue;
    }
    // 3) extra_cities jsonb (nova lista até 9 entradas)
    const extras = Array.isArray(row.extra_cities) ? row.extra_cities : [];
    const found = extras.some((c) => {
      if (!c || typeof c !== "object") return false;
      const cityUf = typeof c.uf === "string" ? c.uf.toUpperCase() : "";
      const citySlugLower =
        typeof c.slug === "string" ? c.slug.toLowerCase() : "";
      return cityUf === ufUpper && citySlugLower === citySlug.toLowerCase();
    });
    if (found) matched.push(mapLawyerRow(row));
  }

  // Ordenação consistente: premium ativos primeiro, featured antes do resto,
  // depois alfabético pelo nome.
  // FALLBACK_EMPTY_CITY: nenhuma cidade fica vazia.
  if (matched.length === 0) {
    return await getFallbackLawyers();
  }
  return matched.sort((a, b) => {
    const aPrem = a.planStatus === "active" ? 1 : 0;
    const bPrem = b.planStatus === "active" ? 1 : 0;
    if (aPrem !== bPrem) return bPrem - aPrem;
    const aFeat = a.featured ? 1 : 0;
    const bFeat = b.featured ? 1 : 0;
    if (aFeat !== bFeat) return bFeat - aFeat;
    return a.name.localeCompare(b.name, "pt-BR");
  });
});

/**
 * Filtra advogados de uma cidade que tenham uma especialidade específica.
 */
export async function getLawyersBySpecialty(
  uf: string,
  citySlug: string,
  specialty: string
): Promise<Lawyer[]> {
  const all = await getLawyersForCity(uf, citySlug);

  // Cidade SEM advogado real (getLawyersForCity devolveu só os perfis de
  // rede): mostra SEMPRE os dois perfis de rede em qualquer página de área,
  // sem filtrar por especialidade. Antes, ao filtrar por área aqui, uma
  // página tipo "Advogado previdenciário em X" só exibia o perfil de rede
  // que tinha aquela área (ex.: só Kellsons), deixando o outro de fora. Como
  // nessas cidades os perfis são só rede/apresentação, os dois devem aparecer
  // juntos em toda área. (Em cidade COM advogado real, mantém o filtro normal.)
  const onlyFallback =
    all.length > 0 &&
    all.every((l) => FALLBACK_LAWYER_SLUGS.includes(l.slug));
  if (onlyFallback) {
    return await getFallbackLawyers();
  }

  const filtered = all.filter((l) => l.specialties.includes(specialty));
  // Nenhuma página de área fica vazia — cai nos perfis de rede.
  if (filtered.length === 0) {
    return await getFallbackLawyers();
  }
  return filtered;
}

/**
 * Lista todos os advogados de um estado (qualquer cidade).
 *
 * Inclui lawyers cuja UF principal OU target_uf OU qualquer extra_cities.uf
 * é o estado pedido (mesmo bug do getLawyersForCity — Maio/2026).
 */
export async function getLawyersForState(uf: string): Promise<Lawyer[]> {
  const supabase = createAdminClient();
  const ufUpper = uf.toUpperCase();

  const [primaryRes, extrasRes] = await Promise.all([
    supabase
      .from("lawyers")
      .select("*")
      .or(`uf.eq.${ufUpper},target_uf.eq.${ufUpper}`)
      .order("name", { ascending: true }),
    supabase
      .from("lawyers")
      .select("*")
      .not("extra_cities", "is", null)
  ]);

  if (primaryRes.error) {
    console.error("getLawyersForState primary error:", primaryRes.error.message);
  }
  if (extrasRes.error) {
    console.error("getLawyersForState extras error:", extrasRes.error.message);
  }

  const byId = new Map<string, PublicLawyer>();
  for (const row of (primaryRes.data || []) as PublicLawyer[]) {
    byId.set(row.id, row);
  }
  for (const row of (extrasRes.data || []) as PublicLawyer[]) {
    if (byId.has(row.id)) continue;
    // Só inclui se algum extra_city tem essa UF
    const extras = Array.isArray(row.extra_cities) ? row.extra_cities : [];
    const matches = extras.some(
      (c) => c && typeof c.uf === "string" && c.uf.toUpperCase() === ufUpper
    );
    if (matches) byId.set(row.id, row);
  }

  return Array.from(byId.values())
    .filter((r) => isPubliclyVisible(r))
    .map((r) => mapLawyerRow(r))
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}

/**
 * Busca um advogado pelo slug (URL pública /p/[slug]).
 */
export async function findLawyerBySlug(slug: string): Promise<Lawyer | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("lawyers")
    .select("*") // ver comentário em getLawyersForCity
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("findLawyerBySlug error:", error.message);
    return null;
  }
  if (!data) return null;
  return mapLawyerRow(data as PublicLawyer);
}

/**
 * Lista todos os slugs públicos (usado em generateStaticParams).
 */
export async function getAllLawyerSlugs(): Promise<string[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("lawyers")
    .select("slug")
    .limit(1000);

  if (error) {
    console.error("getAllLawyerSlugs error:", error.message);
    return [];
  }
  return (data || []).map((r) => r.slug);
}

/**
 * Contagem total de advogados cadastrados.
 */
export async function getLawyerCount(): Promise<number> {
  const supabase = createAdminClient();
  const { count, error } = await supabase
    .from("lawyers")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("getLawyerCount error:", error.message);
    return 0;
  }
  return count || 0;
}

/**
 * Retorna um mapa { uf: count } com a quantidade de advogados por estado.
 * Conta também onde o lawyer aparece via extra_cities (Maio/2026 fix).
 */
export async function getLawyerCountsByState(): Promise<Record<string, number>> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("lawyers")
    .select("uf,target_uf,extra_cities,page_status,is_public");

  if (error) {
    console.error("getLawyerCountsByState error:", error.message);
    return {};
  }
  const map: Record<string, number> = {};
  type Row = {
    uf?: string;
    target_uf?: string | null;
    extra_cities?: Array<{ uf?: string }> | null;
    page_status?: string | null;
    is_public?: boolean | null;
  };
  for (const r of (data || []) as Row[]) {
    // Não conta registros não-públicos no diretório.
    if (!isPubliclyVisible(r)) continue;
    const ufs = new Set<string>();
    if (r.uf) ufs.add(r.uf.toUpperCase());
    if (r.target_uf) ufs.add(r.target_uf.toUpperCase());
    if (Array.isArray(r.extra_cities)) {
      for (const c of r.extra_cities) {
        if (c && typeof c.uf === "string") ufs.add(c.uf.toUpperCase());
      }
    }
    for (const u of ufs) {
      map[u] = (map[u] || 0) + 1;
    }
  }
  return map;
}

/**
 * Retorna um mapa { citySlug: count } com a quantidade de advogados por cidade
 * de um estado. Inclui também extra_cities (Maio/2026 fix).
 */
export async function getLawyerCountsByCity(
  uf: string
): Promise<Record<string, number>> {
  const supabase = createAdminClient();
  const ufUpper = uf.toUpperCase();
  const { data, error } = await supabase
    .from("lawyers")
    .select("city_slug,uf,target_city,target_uf,extra_cities,page_status,is_public");

  if (error) {
    console.error("getLawyerCountsByCity error:", error.message);
    return {};
  }
  const map: Record<string, number> = {};
  type Row = {
    city_slug?: string;
    uf?: string;
    target_city?: string | null;
    target_uf?: string | null;
    extra_cities?: Array<{ uf?: string; slug?: string }> | null;
    page_status?: string | null;
    is_public?: boolean | null;
  };
  for (const r of (data || []) as Row[]) {
    // Não conta registros não-públicos no diretório.
    if (!isPubliclyVisible(r)) continue;
    // Coleta cidades únicas (por slug) onde esse lawyer aparece NESSE estado.
    // Set garante que o lawyer não é contado 2x na mesma cidade (caso
    // tenha um duplicado em extra_cities).
    const slugsInThisUf = new Set<string>();
    if (r.uf && r.uf.toUpperCase() === ufUpper && r.city_slug) {
      slugsInThisUf.add(r.city_slug);
    }
    if (r.target_uf && r.target_uf.toUpperCase() === ufUpper && r.target_city) {
      slugsInThisUf.add(r.target_city);
    }
    if (Array.isArray(r.extra_cities)) {
      for (const c of r.extra_cities) {
        if (
          c &&
          typeof c.uf === "string" &&
          c.uf.toUpperCase() === ufUpper &&
          typeof c.slug === "string"
        ) {
          slugsInThisUf.add(c.slug);
        }
      }
    }
    for (const s of slugsInThisUf) {
      map[s] = (map[s] || 0) + 1;
    }
  }
  return map;
}

// =====================================================================
// FUNÇÕES ADMIN — usam service_role, ignoram RLS
// USE APENAS em Route Handlers protegidos por verificação admin
// =====================================================================

/**
 * Lista TODOS os advogados (incluindo CPF, status, etc).
 */
export async function adminListLawyers(): Promise<LawyerRow[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("lawyers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("adminListLawyers error:", error.message);
    return [];
  }
  return data || [];
}

/**
 * Ativa plano premium para um advogado por X dias.
 */
export async function adminActivatePremium(
  lawyerId: string,
  days = 30
): Promise<{ ok: boolean; error?: string }> {
  const admin = createAdminClient();
  const now = new Date();
  const expires = new Date(now);
  expires.setDate(expires.getDate() + days);

  const { error } = await admin
    .from("lawyers")
    .update({
      plan_status: "active",
      plan_start_date: now.toISOString(),
      plan_end_date: expires.toISOString(),
      // Ao confirmar o pagamento, o advogado já sobe para o topo (destaque)
      // automaticamente — sem precisar de um segundo clique manual no admin.
      featured: true
    })
    .eq("id", lawyerId);

  if (error) return { ok: false, error: error.message };

  // BUG FIX (Maio/2026): antes, cada activatePremium criava NOVO registro
  // confirmed — o histórico ficava lotado de duplicatas quando o admin
  // clicava "Ativar" mais de uma vez por engano ou ao reativar.
  //
  // Solução: se existe entry pending nas últimas 7 dias, ATUALIZA esse
  // (pending → confirmed + expires_at preenchido). Caso contrário, cria
  // novo. Garante 1 entry por ciclo de pagamento.
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: pendingHist } = await admin
    .from("plan_history")
    .select("id")
    .eq("lawyer_id", lawyerId)
    .eq("status", "pending")
    .gte("created_at", sevenDaysAgo)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (pendingHist?.id) {
    await admin
      .from("plan_history")
      .update({
        status: "confirmed",
        expires_at: expires.toISOString()
      })
      .eq("id", pendingHist.id);
  } else {
    await admin.from("plan_history").insert({
      lawyer_id: lawyerId,
      amount: PIX.amount,
      status: "confirmed",
      payment_date: now.toISOString(),
      expires_at: expires.toISOString()
    });
  }

  return { ok: true };
}

export async function adminDeactivatePremium(
  lawyerId: string
): Promise<{ ok: boolean; error?: string }> {
  const admin = createAdminClient();
  const { error } = await admin
    .from("lawyers")
    .update({
      plan_status: "free",
      plan_start_date: null,
      plan_end_date: null,
      featured: false
    })
    .eq("id", lawyerId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function adminToggleFeatured(
  lawyerId: string,
  value: boolean
): Promise<{ ok: boolean; error?: string }> {
  const admin = createAdminClient();
  const { error } = await admin
    .from("lawyers")
    .update({ featured: value })
    .eq("id", lawyerId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function adminToggleVerifiedOab(
  lawyerId: string,
  value: boolean
): Promise<{ ok: boolean; error?: string }> {
  const admin = createAdminClient();
  const { error } = await admin
    .from("lawyers")
    .update({ verified_oab: value })
    .eq("id", lawyerId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function adminDeleteLawyer(
  lawyerId: string
): Promise<{ ok: boolean; error?: string }> {
  const admin = createAdminClient();
  // Apaga em auth.users (cascade apaga lawyers via FK)
  const { error } = await admin.auth.admin.deleteUser(lawyerId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/**
 * Ordena uma lista de advogados conforme regras do produto:
 * - Premium ativos e/ou featured no topo
 * - Resto alfabético
 */
export function sortLawyers(list: Lawyer[]): Lawyer[] {
  return [...list].sort((a, b) => {
    const aPrem = a.planStatus === "active" || a.featured;
    const bPrem = b.planStatus === "active" || b.featured;
    if (aPrem && !bPrem) return -1;
    if (!aPrem && bPrem) return 1;
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return a.name.localeCompare(b.name, "pt-BR");
  });
}
