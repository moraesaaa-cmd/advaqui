/**
 * Helpers de leitura do módulo Jurisprudência (Fases 3-5 do portal).
 *
 * Lê do Supabase usando o admin client server-side. Sempre defensivo:
 * se a tabela ainda não existe (migration 0008 pendente), retorna lista
 * vazia em vez de quebrar o build/SSG.
 */
import { createAdminClient } from "@/lib/supabase/admin";

export type Tribunal = "STF" | "STJ";

export type DecisaoCard = {
  id: number;
  tribunal: Tribunal;
  classe: string | null;
  numero: string;
  processo: string | null;
  relator: string | null;
  orgao_julgador: string | null;
  data_julgamento: string | null;
  data_publicacao: string | null;
  ementa: string;
  temas: string[];
  area_relacionada: string | null;
  url_origem: string;
  slug: string;
  seo_title: string | null;
  seo_description: string | null;
};

export type DecisaoDetail = DecisaoCard & {
  tese: string | null;
  resumo_informativo: string | null;
  palavras_chave: string[];
};

const DECISOES_PUBLIC_COLS =
  "id,tribunal,classe,numero,processo,relator,orgao_julgador," +
  "data_julgamento,data_publicacao,ementa,temas,area_relacionada," +
  "url_origem,slug,seo_title,seo_description";

const DECISOES_DETAIL_COLS = DECISOES_PUBLIC_COLS + ",tese,resumo_informativo,palavras_chave";

function safeAdmin() {
  try {
    return createAdminClient();
  } catch {
    return null;
  }
}

/**
 * Busca decisões com filtros. Sempre exclui inteiro teor (otimização).
 */
export async function searchDecisoes(opts: {
  tribunal?: Tribunal | "ALL";
  q?: string;
  relator?: string;
  classe?: string;
  areaRelacionada?: string;
  orderBy?: "data_julgamento" | "data_publicacao";
  limit?: number;
  offset?: number;
}): Promise<{ items: DecisaoCard[]; count: number }> {
  const admin = safeAdmin();
  if (!admin) return { items: [], count: 0 };

  const limit = Math.min(50, Math.max(1, opts.limit ?? 20));
  const offset = Math.max(0, opts.offset ?? 0);
  const orderBy = opts.orderBy ?? "data_julgamento";

  try {
    let query = admin
      .from("jurisprudencia_decisoes")
      .select(DECISOES_PUBLIC_COLS, { count: "exact" })
      .eq("status", "publicado")
      .order(orderBy, { ascending: false, nullsFirst: false })
      .range(offset, offset + limit - 1);

    if (opts.tribunal && opts.tribunal !== "ALL") {
      query = query.eq("tribunal", opts.tribunal);
    }
    if (opts.relator) {
      query = query.ilike("relator", `%${opts.relator}%`);
    }
    if (opts.classe) {
      query = query.eq("classe", opts.classe);
    }
    if (opts.areaRelacionada) {
      query = query.eq("area_relacionada", opts.areaRelacionada);
    }
    // Busca textual: usa busca_tsv (full-text portuguese) via @@ websearch_to_tsquery
    if (opts.q && opts.q.trim().length >= 2) {
      const term = opts.q.trim().slice(0, 100);
      query = query.textSearch("busca_tsv", term, {
        type: "websearch",
        config: "portuguese",
      });
    }

    const { data, error, count } = await query;
    if (error) {
      // Tabela ainda não existe (migration pendente) ou outra falha
      return { items: [], count: 0 };
    }
    return {
      items: (data as unknown as DecisaoCard[]) || [],
      count: count ?? ((data as unknown as DecisaoCard[] | null)?.length ?? 0),
    };
  } catch {
    return { items: [], count: 0 };
  }
}

export async function getDecisaoBySlug(
  tribunal: Tribunal,
  slug: string
): Promise<DecisaoDetail | null> {
  const admin = safeAdmin();
  if (!admin) return null;
  try {
    const { data, error } = await admin
      .from("jurisprudencia_decisoes")
      .select(DECISOES_DETAIL_COLS)
      .eq("tribunal", tribunal)
      .eq("slug", slug)
      .eq("status", "publicado")
      .maybeSingle();
    if (error || !data) return null;
    return data as unknown as DecisaoDetail;
  } catch {
    return null;
  }
}

export async function getRelatedDecisoes(
  decisao: DecisaoDetail,
  limit = 5
): Promise<DecisaoCard[]> {
  const admin = safeAdmin();
  if (!admin) return [];
  try {
    let query = admin
      .from("jurisprudencia_decisoes")
      .select(DECISOES_PUBLIC_COLS)
      .eq("status", "publicado")
      .neq("id", decisao.id)
      .limit(limit);

    // Prioriza: mesmo tribunal + mesma área OR temas intersect
    if (decisao.temas && decisao.temas.length > 0) {
      query = query.overlaps("temas", decisao.temas);
    } else if (decisao.area_relacionada) {
      query = query.eq("area_relacionada", decisao.area_relacionada);
    } else {
      query = query.eq("tribunal", decisao.tribunal);
    }

    const { data, error } = await query;
    if (error || !data) return [];
    return data as unknown as DecisaoCard[];
  } catch {
    return [];
  }
}

export async function getIndexableDecisoesForSitemap(limit = 5000): Promise<
  Array<{ tribunal: Tribunal; slug: string; updated_at?: string }>
> {
  const admin = safeAdmin();
  if (!admin) return [];
  try {
    const { data, error } = await admin
      .from("jurisprudencia_decisoes")
      .select("tribunal,slug,atualizado_em")
      .eq("status", "publicado")
      .eq("indexavel", true)
      .order("atualizado_em", { ascending: false })
      .limit(limit);
    if (error || !data) return [];
    const rows = data as unknown as Array<{
      tribunal: string;
      slug: string;
      atualizado_em: string | null;
    }>;
    return rows.map((d) => ({
      tribunal: d.tribunal as Tribunal,
      slug: d.slug,
      updated_at: d.atualizado_em ?? undefined,
    }));
  } catch {
    return [];
  }
}

export async function getRecentByTribunal(tribunal: Tribunal, limit = 12): Promise<DecisaoCard[]> {
  const { items } = await searchDecisoes({ tribunal, limit });
  return items;
}

/**
 * Lê inteiro teor do cache se ativo e não expirado.
 * Atualiza ultimo_acesso e total_acessos. Renova expira_em.
 */
export async function getCachedInteiroTeor(decisaoId: number): Promise<{
  found: boolean;
  inteiro_teor?: string;
  fonte_url?: string;
} > {
  const admin = safeAdmin();
  if (!admin) return { found: false };
  try {
    const { data, error } = await admin
      .from("jurisprudencia_inteiro_teor_cache")
      .select("id,inteiro_teor,fonte_url,expira_em,status")
      .eq("decisao_id", decisaoId)
      .maybeSingle();
    if (error || !data) return { found: false };
    const row = data as unknown as {
      id: number;
      inteiro_teor: string;
      fonte_url: string;
      expira_em: string;
      status: string;
    };
    if (row.status !== "ativo") return { found: false };
    const exp = new Date(row.expira_em);
    if (exp.getTime() < Date.now()) return { found: false };

    // Renova TTL e contabiliza acesso
    const ttlDays = Number(process.env.JURIS_CACHE_TTL_DAYS || "7");
    const novoExp = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000).toISOString();
    try {
      await admin
        .from("jurisprudencia_inteiro_teor_cache")
        .update({
          ultimo_acesso: new Date().toISOString(),
          expira_em: novoExp,
        })
        .eq("id", row.id);
      // Incrementa via SQL RPC seria ideal — aqui é um SELECT+UPDATE rápido
    } catch {
      // ignora — cache continua válido
    }

    return {
      found: true,
      inteiro_teor: row.inteiro_teor,
      fonte_url: row.fonte_url,
    };
  } catch {
    return { found: false };
  }
}
