import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/agendamento
 *
 * Recebe um pedido de agendamento de consulta e grava em public.agendamentos.
 * Usa service_role (ignora RLS) — a tabela fica fechada para o público; só o
 * servidor escreve e só o admin lê (via /api/admin/agendamentos).
 *
 * Proteções: honeypot (campo "website"), rate-limit por IP, validação e corte
 * de tamanho dos campos. Defensive: se a tabela não existe, responde com aviso
 * claro (sem quebrar) para o build não depender da migration.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WINDOW_MS = 60_000;
const MAX_REQ = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > MAX_REQ;
}

function clamp(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function truncIp(xff: string): string | null {
  const ip = (xff || "").split(",")[0].trim();
  if (!ip) return null;
  if (ip.includes(":")) return ip.split(":").slice(0, 4).join(":") + "::0";
  const p = ip.split(".");
  return p.length === 4 ? `${p[0]}.${p[1]}.${p[2]}.0` : null;
}

export async function POST(req: Request) {
  const xff = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";
  const ip = xff.split(",")[0].trim() || "anon";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, mensagem: "Você enviou vários pedidos seguidos. Aguarde um minuto." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, mensagem: "Requisição inválida." }, { status: 400 });
  }

  // Honeypot: bot preenche; humano não vê o campo. Finge sucesso.
  if (clamp(body.website, 100)) {
    return NextResponse.json({ ok: true });
  }

  const nome = clamp(body.nome, 120);
  const contato = clamp(body.contato, 160);
  if (nome.length < 2 || contato.length < 5) {
    return NextResponse.json(
      { ok: false, mensagem: "Preencha pelo menos o nome e um contato (WhatsApp ou e-mail)." },
      { status: 400 }
    );
  }

  const registro = {
    nome,
    contato,
    area: clamp(body.area, 60) || null,
    assunto: clamp(body.assunto, 160) || null,
    data_preferida: clamp(body.data_preferida, 10) || null, // YYYY-MM-DD
    periodo: clamp(body.periodo, 20) || null,
    mensagem: clamp(body.mensagem, 1000) || null,
    status: "novo",
    ip_trunc: truncIp(xff)
  };

  try {
    const admin = createAdminClient();
    const { error } = await admin.from("agendamentos").insert(registro);
    if (error) {
      if (/relation .+ does not exist/i.test(error.message)) {
        return NextResponse.json(
          { ok: false, mensagem: "Sistema de agendamento em configuração. Tente pelo WhatsApp/diretório." },
          { status: 503 }
        );
      }
      console.warn("[agendamento] insert", error.message);
      return NextResponse.json({ ok: false, mensagem: "Não foi possível registrar agora." }, { status: 500 });
    }
  } catch (e) {
    console.warn("[agendamento] exception", e);
    return NextResponse.json({ ok: false, mensagem: "Não foi possível registrar agora." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
