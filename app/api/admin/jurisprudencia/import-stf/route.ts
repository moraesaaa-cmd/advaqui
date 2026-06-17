/**
 * Endpoint admin para importar decisões STF coletadas via browser do usuário.
 *
 * Motivação (F21, 2026-05-22): o endpoint Elasticsearch interno da SPA do STF
 * (jurisprudencia.stf.jus.br/api/search/search) está protegido por AWS WAF que
 * retorna HTTP 202 com size=0 para requests de IPs de datacenter (incluindo
 * nosso VPS Hostinger). Do browser do usuário (IP residencial) retorna 200 OK
 * com JSON real. Solução pragmática — coletar pelo browser, postar aqui.
 *
 * Segurança:
 *  - Apenas admin autenticado (cookie HMAC)
 *  - Valida cada item antes de inserir (ementa real, classe, número)
 *  - Não aceita marcadores AMOSTRA/fixture/example.invalid
 *  - URL oficial obrigatória (jurisprudencia.stf.jus.br ou similar)
 *
 * Pipeline:
 *  1. Valida cada item (ementa >= 50, classe, número)
 *  2. Gera slug determinístico
 *  3. Faz UPSERT no Supabase via service_role
 *  4. Retorna stats { inseridas, atualizadas, ignoradas, erros }
 */
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminRequest } from "@/lib/auth/adminSession";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type STFRawItem = {
  id?: string;
  titulo?: string;
  classe_sigla?: string;
  numero?: string;
  relator?: string | null;
  orgao_julgador?: string;
  julgamento_data?: string;
  publicacao_data?: string;
  ementa_texto?: string;
  inteiro_teor_url?: string;
  acompanhamento_processual_url?: string;
  dje_url?: string;
};

const FORBIDDEN_TOKENS = /\b(amostra|fixture|mockup?|demo(stra)?|sample|lorem\s+ipsum|example\.invalid)\b/i;

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 120);
}

function buildSlug(item: STFRawItem): string {
  const classe = (item.classe_sigla || "").toLowerCase();
  const numero = (item.numero || "")
    .replace(/[^0-9]/g, "");
  const id = item.id ? item.id.toLowerCase() : "";
  // Ementa primeiros 50 chars como descritor
  const ementa = (item.ementa_texto || "").slice(0, 60);
  const parts: string[] = [];
  if (classe) parts.push(slugify(classe));
  if (numero) parts.push(numero);
  if (id && id !== `${classe}${numero}`) parts.push(slugify(id));
  const ementaSlug = slugify(ementa);
  if (ementaSlug) parts.push(ementaSlug);
  return parts.join("-").slice(0, 120) || `stf-${id || Date.now()}`;
}

function pickUrl(item: STFRawItem): string {
  const u =
    item.inteiro_teor_url ||
    item.acompanhamento_processual_url ||
    (item.id
      ? `https://jurisprudencia.stf.jus.br/pages/search/${item.id}/false`
      : null);
  return u || "";
}

function parseDate(v: string | undefined): string | null {
  if (!v) return null;
  // Aceita ISO ou DD/MM/YYYY
  const isoMatch = v.match(/^\d{4}-\d{2}-\d{2}/);
  if (isoMatch) return v.slice(0, 10);
  const brMatch = v.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (brMatch) return `${brMatch[3]}-${brMatch[2]}-${brMatch[1]}`;
  return null;
}

function looksLikeFake(item: STFRawItem): boolean {
  const haystack = [
    item.ementa_texto || "",
    item.relator || "",
    item.titulo || "",
    item.inteiro_teor_url || "",
  ].join(" \n ");
  return FORBIDDEN_TOKENS.test(haystack);
}

function validate(item: STFRawItem): string | null {
  if (!item.ementa_texto || item.ementa_texto.trim().length < 50)
    return "ementa_curta_ou_vazia";
  if (!item.numero) return "sem_numero";
  if (looksLikeFake(item)) return "marcadores_proibidos";
  const url = pickUrl(item);
  if (!url) return "sem_url";
  // Garante host stf.jus.br
  try {
    const host = new URL(url).hostname.toLowerCase();
    if (host !== "stf.jus.br" && !host.endsWith(".stf.jus.br"))
      return "host_nao_oficial";
  } catch {
    return "url_invalida";
  }
  return null;
}

export async function POST(req: Request) {
  if (!isAdminRequest()) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const items = Array.isArray(body)
    ? (body as STFRawItem[])
    : Array.isArray((body as { items?: STFRawItem[] }).items)
      ? (body as { items: STFRawItem[] }).items
      : null;

  if (!items) {
    return NextResponse.json(
      { error: "payload_invalido", esperado: "array ou {items: array}" },
      { status: 400 }
    );
  }

  if (items.length > 500) {
    return NextResponse.json(
      { error: "batch_grande_demais", max: 500, recebido: items.length },
      { status: 413 }
    );
  }

  const supabase = createAdminClient();
  const stats = {
    recebidas: items.length,
    inseridas: 0,
    atualizadas: 0,
    ignoradas_invalidas: 0,
    erros: 0,
    motivos: {} as Record<string, number>,
    slugs_inseridos: [] as string[]
  };

  for (const item of items) {
    const motivo = validate(item);
    if (motivo) {
      stats.ignoradas_invalidas++;
      stats.motivos[motivo] = (stats.motivos[motivo] || 0) + 1;
      continue;
    }

    const slug = buildSlug(item);
    const url_origem = pickUrl(item);
    const seo_title = `${item.classe_sigla || "Decisão"} ${item.numero} | STF | AdvAqui`.slice(0, 200);
    const seo_description = (item.ementa_texto || "").slice(0, 160);

    // validate() já garantiu numero e ementa, mas TS precisa do hint explícito
    const numero = item.numero!;
    const ementa = item.ementa_texto!;
    const payload = {
      tribunal: "STF" as const,
      classe: item.classe_sigla || null,
      numero,
      processo: numero,
      relator: item.relator || null,
      orgao_julgador: item.orgao_julgador || null,
      data_julgamento: parseDate(item.julgamento_data),
      data_publicacao: parseDate(item.publicacao_data),
      ementa,
      url_origem,
      slug,
      seo_title,
      seo_description,
      status: "publicado" as const,
      indexavel: true,
      source_portal: "Portal de Jurisprudência do STF",
      dataset_name: "Acórdãos STF",
      dataset_url: "https://jurisprudencia.stf.jus.br/pages/search?base=acordaos",
      resource_name: item.id || null,
      resource_url: url_origem,
      source_format: "JSON (Elasticsearch interno)"
    };

    try {
      const { data, error } = await supabase
        .from("jurisprudencia_decisoes")
        .upsert(payload, { onConflict: "slug" })
        .select("id,slug")
        .single();
      if (error) {
        stats.erros++;
        stats.motivos[`db_${error.code || "unknown"}`] =
          (stats.motivos[`db_${error.code || "unknown"}`] || 0) + 1;
        continue;
      }
      // Heurística: novos têm id alto, mas sem coluna created_at confiável.
      // Tratamos tudo como inserida (upsert). Edge case raro.
      stats.inseridas++;
      if (data && data.slug) stats.slugs_inseridos.push(data.slug);
    } catch (exc) {
      stats.erros++;
      stats.motivos["exception"] = (stats.motivos["exception"] || 0) + 1;
    }
  }

  // Invalida cache do sitemap-jurisprudencia e hubs STF
  try {
    revalidatePath("/jurisprudencia");
    revalidatePath("/jurisprudencia/stf");
    revalidatePath("/sitemap-jurisprudencia.xml");
  } catch {
    // ignore
  }

  return NextResponse.json(stats);
}
