import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/leads/capture
 *
 * Captura leads de ferramentas gratuitas e formularios de contato.
 * Endpoint publico — nao exige autenticacao.
 *
 * Body: { nome, telefone, email, cidade, uf, area_juridica, resumo, origem, ferramenta, metadata }
 *
 * Protecoes:
 *   - Rate-limit: 10 leads por IP por hora (in-memory com TTL)
 *   - Sanitizacao: trim + limite de comprimento em todos os campos texto
 *   - Validacao: ao menos nome OU telefone obrigatorio
 *   - CORS restrito a advaqui.com
 *
 * Grava em public.leads com service_role (ignora RLS).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Rate limit — 10 leads / IP / hora (in-memory)
// ---------------------------------------------------------------------------
const WINDOW_MS = 60 * 60 * 1000; // 1 hora
const MAX_PER_WINDOW = 10;
const hits = new Map<string, number[]>();

// Limpa IPs expirados a cada 5 min para nao vazar memoria
let lastCleanup = Date.now();
function cleanupHits() {
  const now = Date.now();
  if (now - lastCleanup < 5 * 60_000) return;
  lastCleanup = now;
  for (const [ip, times] of hits) {
    const fresh = times.filter((t) => now - t < WINDOW_MS);
    if (fresh.length === 0) hits.delete(ip);
    else hits.set(ip, fresh);
  }
}

function isRateLimited(ip: string): boolean {
  cleanupHits();
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > MAX_PER_WINDOW;
}

function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for") || "";
  const parts = xff.split(",").map((s) => s.trim()).filter(Boolean);
  return (
    req.headers.get("x-real-ip") ||
    (parts.length ? parts[parts.length - 1] : "") ||
    "anon"
  );
}

// ---------------------------------------------------------------------------
// Sanitizacao
// ---------------------------------------------------------------------------
function sanitize(val: unknown, maxLen: number): string {
  if (typeof val !== "string") return "";
  return val.trim().slice(0, maxLen);
}

function sanitizeEmail(val: unknown): string {
  const s = sanitize(val, 254);
  if (!s) return "";
  // Validacao minima — so garante formato basico
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) ? s.toLowerCase() : "";
}

function sanitizeUf(val: unknown): string {
  const s = sanitize(val, 2).toUpperCase();
  const UFS = [
    "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
    "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
  ];
  return UFS.includes(s) ? s : "";
}

function sanitizeTelefone(val: unknown): string {
  const s = sanitize(val, 20);
  // Mantem apenas digitos, +, (, ), espaco e hifen
  return s.replace(/[^\d+() -]/g, "");
}

// ---------------------------------------------------------------------------
// CORS
// ---------------------------------------------------------------------------
const ALLOWED_ORIGINS = [
  "https://advaqui.com",
  "https://www.advaqui.com",
];

function corsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

// ---------------------------------------------------------------------------
// OPTIONS (preflight CORS)
// ---------------------------------------------------------------------------
export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin");
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}

// ---------------------------------------------------------------------------
// POST — captura lead
// ---------------------------------------------------------------------------
export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  const cors = corsHeaders(origin);

  // Rate limit
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Muitas solicitacoes. Tente novamente em alguns minutos." },
      { status: 429, headers: cors }
    );
  }

  // Parse body
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, error: "JSON invalido." },
      { status: 400, headers: cors }
    );
  }

  // Sanitize
  const nome = sanitize(body.nome, 200);
  const telefone = sanitizeTelefone(body.telefone);
  const email = sanitizeEmail(body.email);
  const cidade = sanitize(body.cidade, 120);
  const uf = sanitizeUf(body.uf);
  const area_juridica = sanitize(body.area_juridica, 100);
  const resumo = sanitize(body.resumo, 2000);
  const origem = sanitize(body.origem, 100);
  const ferramenta = sanitize(body.ferramenta, 100);

  // metadata: aceita objeto, serializa como JSON (limite de 5 KB)
  let metadata: Record<string, unknown> | null = null;
  if (body.metadata && typeof body.metadata === "object" && !Array.isArray(body.metadata)) {
    const raw = JSON.stringify(body.metadata);
    if (raw.length <= 5000) {
      metadata = body.metadata as Record<string, unknown>;
    }
  }

  // Validacao: ao menos nome OU telefone
  if (!nome && !telefone) {
    return NextResponse.json(
      { ok: false, error: "Informe ao menos o nome ou o telefone." },
      { status: 422, headers: cors }
    );
  }

  // Insert
  try {
    const admin = createAdminClient();
    const { data: lead, error } = await admin
      .from("leads")
      .insert({
        nome: nome || null,
        telefone: telefone || null,
        email: email || null,
        cidade: cidade || null,
        uf: uf || null,
        area_juridica: area_juridica || null,
        resumo: resumo || null,
        origem: origem || null,
        ferramenta: ferramenta || null,
        ...(metadata ? { metadata } : {}),
      })
      .select("id")
      .single();

    if (error) {
      // Tabela nao existe — migration pendente
      if (/relation .+ does not exist/i.test(error.message)) {
        console.warn("[leads:capture] tabela 'leads' nao existe — migration pendente");
        return NextResponse.json(
          { ok: false, error: "Servico temporariamente indisponivel." },
          { status: 503, headers: cors }
        );
      }
      console.error("[leads:capture] insert error", error.message);
      return NextResponse.json(
        { ok: false, error: "Erro ao registrar. Tente novamente." },
        { status: 500, headers: cors }
      );
    }

    return NextResponse.json(
      { ok: true, id: lead.id },
      { status: 201, headers: cors }
    );
  } catch (err) {
    console.error("[leads:capture] exception", err);
    return NextResponse.json(
      { ok: false, error: "Erro interno." },
      { status: 500, headers: cors }
    );
  }
}
