import { NextResponse } from "next/server";
import { listAprovados, addComentario } from "@/lib/comentarios-decisoes";

/**
 * Comentários públicos das páginas de decisão (aba Notícias).
 *
 * GET  ?tribunal=stj&slug=... → aprovados (para o client component; a página
 *      da decisão é ISR e o comentário precisa aparecer sem esperar o cache).
 * POST { tribunal, slug, nome, texto, hp } → cria PENDENTE (moderação no
 *      admin). Anti-abuso: honeypot, limites de tamanho, sem links, rate
 *      limit por IP em memória.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const rate = new Map<string, number[]>();
const RATE_MAX = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;

function truncateIp(ip: string): string {
  const cleaned = ip.split(",")[0].trim();
  if (!cleaned) return "";
  if (cleaned.includes(":")) {
    return cleaned.split(":").slice(0, 4).join(":") + "::0";
  }
  const parts = cleaned.split(".");
  return parts.length === 4 ? `${parts[0]}.${parts[1]}.${parts[2]}.0` : "";
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tribunal = (url.searchParams.get("tribunal") || "").toLowerCase();
  const slug = url.searchParams.get("slug") || "";
  if (!["stf", "stj"].includes(tribunal) || !/^[a-z0-9-]{3,160}$/.test(slug)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const comentarios = await listAprovados(tribunal, slug);
  return NextResponse.json(
    { ok: true, comentarios },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(req: Request) {
  let body: {
    tribunal?: string;
    slug?: string;
    nome?: string;
    texto?: string;
    hp?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Honeypot: bot que preenche o campo escondido é descartado em silêncio.
  if (body.hp) return NextResponse.json({ ok: true, moderacao: true });

  const tribunal = (body.tribunal || "").toLowerCase();
  const slug = (body.slug || "").trim();
  const nome = (body.nome || "").trim().slice(0, 60);
  const texto = (body.texto || "").trim();

  if (!["stf", "stj"].includes(tribunal) || !/^[a-z0-9-]{3,160}$/.test(slug)) {
    return NextResponse.json({ ok: false, error: "Decisão inválida." }, { status: 400 });
  }
  if (nome.length < 2) {
    return NextResponse.json({ ok: false, error: "Informe seu nome." }, { status: 400 });
  }
  if (texto.length < 5 || texto.length > 800) {
    return NextResponse.json(
      { ok: false, error: "O comentário precisa ter entre 5 e 800 caracteres." },
      { status: 400 }
    );
  }
  if (/(https?:\/\/|www\.)/i.test(texto) || /(https?:\/\/|www\.)/i.test(nome)) {
    return NextResponse.json(
      { ok: false, error: "Comentários com links não são aceitos." },
      { status: 400 }
    );
  }

  const xff = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";
  const ipTrunc = truncateIp(xff) || null;
  const key = ipTrunc || "anon";
  const now = Date.now();
  const hits = (rate.get(key) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (hits.length >= RATE_MAX) {
    return NextResponse.json(
      { ok: false, error: "Muitos comentários seguidos. Tente mais tarde." },
      { status: 429 }
    );
  }
  hits.push(now);
  rate.set(key, hits);
  if (rate.size > 5000) rate.clear();

  try {
    await addComentario({
      tribunal: tribunal as "stf" | "stj",
      slug,
      nome,
      texto,
      ipTrunc
    });
  } catch (err) {
    console.warn("[comentarios] falha ao gravar", err);
    return NextResponse.json(
      { ok: false, error: "Não foi possível enviar agora. Tente de novo." },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true, moderacao: true });
}
