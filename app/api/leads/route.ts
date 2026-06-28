import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/leads
 *
 * Lista leads com paginacao e filtros. Protegido por CRON_SECRET
 * (mesmo padrao dos crons existentes).
 *
 * Query params:
 *   - token        (obrigatorio) CRON_SECRET
 *   - status       filtra por status do lead
 *   - area_juridica filtra por area juridica
 *   - limit        resultados por pagina (default 50, max 200)
 *   - offset       paginacao (default 0)
 *   - sort         campo de ordenacao: created_at (default), nome, cidade
 *   - order        asc | desc (default desc)
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CRON_SECRET = process.env.CRON_SECRET || "";

const SORTABLE_FIELDS = ["created_at", "nome", "cidade", "area_juridica", "uf"] as const;
type SortField = (typeof SORTABLE_FIELDS)[number];

export async function GET(req: NextRequest) {
  // Auth — mesmo padrao dos crons
  const token = req.nextUrl.searchParams.get("token");
  if (!CRON_SECRET || token !== CRON_SECRET) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Params
  const status = req.nextUrl.searchParams.get("status");
  const areaJuridica = req.nextUrl.searchParams.get("area_juridica");
  const limitRaw = parseInt(req.nextUrl.searchParams.get("limit") || "50", 10);
  const limit = Math.min(Math.max(1, isNaN(limitRaw) ? 50 : limitRaw), 200);
  const offsetRaw = parseInt(req.nextUrl.searchParams.get("offset") || "0", 10);
  const offset = Math.max(0, isNaN(offsetRaw) ? 0 : offsetRaw);

  const sortParam = req.nextUrl.searchParams.get("sort") || "created_at";
  const sort: SortField = SORTABLE_FIELDS.includes(sortParam as SortField)
    ? (sortParam as SortField)
    : "created_at";
  const order = req.nextUrl.searchParams.get("order") === "asc" ? true : false;

  try {
    const admin = createAdminClient();

    // Build query
    let query = admin.from("leads").select("*", { count: "exact" });

    if (status) {
      query = query.eq("status", status);
    }
    if (areaJuridica) {
      query = query.eq("area_juridica", areaJuridica);
    }

    query = query
      .order(sort, { ascending: order })
      .range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error) {
      if (/relation .+ does not exist/i.test(error.message)) {
        return NextResponse.json({
          ok: true,
          leads: [],
          total: 0,
          limit,
          offset,
          message: "Tabela 'leads' nao existe — migration pendente",
        });
      }
      console.error("[leads:list] query error", error.message);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      leads: data || [],
      total: count ?? 0,
      limit,
      offset,
    });
  } catch (err) {
    console.error("[leads:list] exception", err);
    return NextResponse.json(
      { ok: false, error: "Erro interno." },
      { status: 500 }
    );
  }
}
