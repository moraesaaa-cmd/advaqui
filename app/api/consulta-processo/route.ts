import { NextResponse } from "next/server";
import {
  consultarProcesso,
  DATAJUD_PUBLIC_KEY
} from "@/lib/data/datajud";

/**
 * POST /api/consulta-processo  { numero: string }
 *
 * Consulta a API Pública do DataJud (CNJ) e devolve os metadados públicos do
 * processo (classe, órgão, movimentações). A chave do DataJud é pública e
 * documentada pelo CNJ; usamos DATAJUD_API_KEY do ambiente se existir, senão
 * a chave pública padrão. Roda só no servidor.
 *
 * Rate-limit simples por IP (proteção contra abuso e respeito ao CNJ).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WINDOW_MS = 60_000;
const MAX_REQ = 15; // por IP por minuto
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) {
    // limpeza preguiçosa
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return arr.length > MAX_REQ;
}

export async function POST(req: Request) {
  const ip =
    (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "anon";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, mensagem: "Muitas consultas seguidas. Aguarde um minuto e tente de novo." },
      { status: 429 }
    );
  }

  let body: { numero?: string };
  try {
    body = (await req.json()) as { numero?: string };
  } catch {
    return NextResponse.json({ ok: false, mensagem: "Requisição inválida." }, { status: 400 });
  }

  const numero = typeof body.numero === "string" ? body.numero.slice(0, 40) : "";
  if (!numero) {
    return NextResponse.json({ ok: false, mensagem: "Informe o número do processo." }, { status: 400 });
  }

  const apiKey = process.env.DATAJUD_API_KEY || DATAJUD_PUBLIC_KEY;
  const r = await consultarProcesso(numero, apiKey);

  if (!r.ok) {
    const status = r.status === "invalido" ? 422 : r.status === "nao_encontrado" ? 404 : 502;
    return NextResponse.json({ ok: false, mensagem: r.mensagem }, { status });
  }
  return NextResponse.json({ ok: true, processo: r.processo });
}
