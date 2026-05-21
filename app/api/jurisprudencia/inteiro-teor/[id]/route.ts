import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCachedInteiroTeor } from "@/lib/data/jurisprudencia";

/**
 * GET /api/jurisprudencia/inteiro-teor/[id]
 *
 * Devolve o inteiro teor de uma decisão.
 *
 * Estratégia:
 *  1. Valida id e existência da decisão.
 *  2. Aplica rate limit em memória (10 req/min por IP). Em produção
 *     multi-instância isso é local — suficiente pro MVP.
 *  3. Se houver cache ativo (não-expirado), serve o texto e renova TTL
 *     via getCachedInteiroTeor.
 *  4. Se não houver cache, redireciona o usuário para a fonte oficial
 *     (url_origem da decisão). Não baixamos inteiro teor on-demand do
 *     servidor Next — isso é responsabilidade dos coletores Python que
 *     rodam em batch no VPS, respeitando rate-limit do tribunal.
 *
 * Aviso: o conteúdo do cache é apenas para consulta. Para fins oficiais,
 * o usuário deve sempre consultar a fonte original.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Rate limit em memória — 10 requisições por minuto por IP truncado.
const RATE_LIMIT = 10;
const WINDOW_MS = 60_000;
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }
  if (bucket.count >= RATE_LIMIT) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }
  bucket.count += 1;
  return { allowed: true };
}

function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";
  // IP truncado pra LGPD-friendly (mantém /24 IPv4 ou prefixo IPv6).
  const first = xff.split(",")[0].trim();
  if (!first) return "unknown";
  if (first.includes(":")) {
    return first.split(":").slice(0, 4).join(":") + "::";
  }
  return first.split(".").slice(0, 3).join(".") + ".0";
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const idNum = Number(params.id);
  if (!Number.isFinite(idNum) || idNum <= 0) {
    return NextResponse.json(
      { ok: false, code: "invalid_id", error: "ID inválido." },
      { status: 400 }
    );
  }

  // Rate limit
  const ip = getClientIp(req);
  const rl = checkRateLimit(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      {
        ok: false,
        code: "rate_limited",
        error: "Muitas requisições. Aguarde alguns segundos e tente de novo.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rl.retryAfter ?? 60),
          "Cache-Control": "no-store",
        },
      }
    );
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        code: "service_unavailable",
        error: "Serviço temporariamente indisponível.",
      },
      { status: 503 }
    );
  }

  // Lookup defensivo da decisão (só campos públicos necessários pra fallback).
  let decisao: {
    id: number;
    tribunal: string;
    slug: string;
    url_origem: string;
  } | null = null;
  try {
    const { data, error } = await admin
      .from("jurisprudencia_decisoes")
      .select("id,tribunal,slug,url_origem,status")
      .eq("id", idNum)
      .maybeSingle();
    if (error || !data) {
      // Tabela ainda não migrada ou decisão inexistente.
      return NextResponse.json(
        {
          ok: false,
          code: "not_found",
          error: "Decisão não encontrada.",
        },
        { status: 404 }
      );
    }
    if ((data as { status?: string }).status !== "publicado") {
      return NextResponse.json(
        {
          ok: false,
          code: "not_published",
          error: "Decisão indisponível para consulta pública.",
        },
        { status: 403 }
      );
    }
    decisao = data as {
      id: number;
      tribunal: string;
      slug: string;
      url_origem: string;
    };
  } catch {
    return NextResponse.json(
      {
        ok: false,
        code: "lookup_failed",
        error: "Não foi possível consultar a decisão agora.",
      },
      { status: 500 }
    );
  }

  // Tenta servir do cache (com renovação de TTL feita pela helper).
  const cache = await getCachedInteiroTeor(decisao.id);
  if (cache.found && cache.inteiro_teor) {
    return new NextResponse(cache.inteiro_teor, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "private, max-age=3600",
        "X-Content-Source": "advaqui-cache",
        "X-Source-Url": cache.fonte_url || decisao.url_origem,
      },
    });
  }

  // Sem cache: redireciona pra fonte oficial. O coletor Python é quem
  // popula o cache em batch (respeitando rate-limit do tribunal). O
  // navegador segue o 302 e o usuário lê direto na fonte.
  return NextResponse.redirect(decisao.url_origem, {
    status: 302,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Source": "official-fallback",
    },
  });
}
