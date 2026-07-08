import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildPixPayload } from "@/lib/pix/qrcode";

// Preço único do recurso de multa (até 3 peças), conforme a landing.
const RECURSO_PRECO = 9.9;
const RECURSO_PRECO_LABEL = "R$ 9,90";

/**
 * Fluxo de acesso do recurso de multa (multas.advaqui.com).
 *
 * POST  → cadastra o cliente (status 'aguardando') com os dados da multa e
 *         devolve { token, pix, valor }. A pessoa paga o Pix; o admin ativa
 *         depois no painel (/admin/recurso-clientes).
 * GET ?token=... → devolve { status, recursos_restantes } para a página
 *         saber se já foi liberado.
 *
 * Escrita/leitura via service_role (tabela fechada por RLS). Rate-limit por IP.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WINDOW_MS = 60_000;
const MAX = 6;
const hits = new Map<string, number[]>();

function ipDe(req: Request): string {
  const xff = (req.headers.get("x-forwarded-for") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return req.headers.get("x-real-ip") || (xff.length ? xff[xff.length - 1] : "") || "anon";
}
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > MAX;
}
function clamp(v: unknown, n: number): string {
  return typeof v === "string" ? v.trim().slice(0, n) : "";
}
function truncIp(ipFull: string): string | null {
  const ip = (ipFull || "").split(",")[0].trim();
  if (!ip) return null;
  if (ip.includes(":")) return ip.split(":").slice(0, 4).join(":") + "::0";
  const p = ip.split(".");
  return p.length === 4 ? `${p[0]}.${p[1]}.${p[2]}.0` : null;
}

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token") || "";
  if (!token) return NextResponse.json({ ok: false }, { status: 400 });
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("recurso_clientes")
      .select("status,recursos_restantes,nome")
      .eq("access_token", token)
      .maybeSingle();
    if (error || !data) return NextResponse.json({ ok: false }, { status: 404 });
    return NextResponse.json({
      ok: true,
      status: data.status,
      recursos_restantes: data.recursos_restantes,
      nome: data.nome
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function POST(req: Request) {
  // Pagamento avulso DESCONTINUADO (2026-07-07, decisao do dono): o recurso de
  // multa e exclusivo dos advogados Premium. Clientes antigos com token seguem
  // atendidos pelo GET acima e pelo /api/recurso-ia.
  const AVULSO_DESATIVADO: boolean = true;
  if (AVULSO_DESATIVADO) {
    return NextResponse.json(
      { ok: false, mensagem: "O pagamento avulso foi descontinuado. O recurso de multa agora é exclusivo dos advogados com plano Premium do AdvAqui." },
      { status: 410 }
    );
  }
  const ip = ipDe(req);
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, mensagem: "Muitos envios seguidos. Aguarde um minuto." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, mensagem: "Requisição inválida." }, { status: 400 });
  }

  const email = clamp(body.email, 160);
  const nome = clamp(body.nome, 120);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || nome.length < 2) {
    return NextResponse.json(
      { ok: false, mensagem: "Informe um nome e um e-mail válidos." },
      { status: 400 }
    );
  }
  const dataInfracao = clamp(body.data, 10);

  const registro = {
    email,
    nome,
    telefone: clamp(body.telefone, 40) || null,
    fase: clamp(body.fase, 30) || null,
    infracao: clamp(body.infracao, 40) || null,
    cpf: clamp(body.cpf, 20) || null,
    placa: clamp(body.placa, 10) || null,
    ait: clamp(body.ait, 40) || null,
    orgao: clamp(body.orgao, 80) || null,
    data_infracao: /^\d{4}-\d{2}-\d{2}$/.test(dataInfracao) ? dataInfracao : null,
    cidade: clamp(body.cidade, 80) || null,
    relato: clamp(body.relato, 1500) || null,
    status: "aguardando",
    recursos_restantes: 3,
    ip_trunc: truncIp(req.headers.get("x-forwarded-for") || "")
  };

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("recurso_clientes")
      .insert(registro)
      .select("access_token")
      .single();
    if (error || !data) {
      if (error && /relation .+ does not exist/i.test(error.message)) {
        return NextResponse.json(
          { ok: false, mensagem: "Sistema em configuração. Tente em instantes." },
          { status: 503 }
        );
      }
      return NextResponse.json({ ok: false, mensagem: "Não foi possível registrar." }, { status: 500 });
    }
    const pix = buildPixPayload({ amount: RECURSO_PRECO, txid: "RECURSO" });
    return NextResponse.json({
      ok: true,
      token: data.access_token,
      pix,
      valor: RECURSO_PRECO_LABEL
    });
  } catch {
    return NextResponse.json({ ok: false, mensagem: "Não foi possível registrar." }, { status: 500 });
  }
}
