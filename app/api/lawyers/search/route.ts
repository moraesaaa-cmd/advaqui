import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Endpoint de busca pública por advogados (nome).
 *
 * Uso: /api/lawyers/search?q=joao&limit=10
 * Retorna: [{ id, slug, name, oab, oab_uf, city_name, uf }]
 *
 * Cache HTTP de 5 minutos. Pesquisa case-insensitive em `name`.
 */
export const runtime = "nodejs";

const normalize = (s: string): string =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();
  const limit = Math.min(20, Math.max(1, Number(url.searchParams.get("limit")) || 10));

  if (q.length < 2) {
    return NextResponse.json([], {
      headers: { "Cache-Control": "public, max-age=60" }
    });
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("lawyers")
    .select("id, slug, name, oab, oab_uf, city_name, uf")
    .ilike("name", `%${q}%`)
    .limit(limit);

  if (error) {
    console.error("/api/lawyers/search error:", error.message);
    return NextResponse.json([], { status: 500 });
  }

  return NextResponse.json(data || [], {
    headers: { "Cache-Control": "public, max-age=300, s-maxage=300" }
  });
}
