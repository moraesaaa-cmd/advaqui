import { NextResponse } from "next/server";
import { createAdminToken, setAdminCookie } from "@/lib/auth/adminSession";
import { createHash, timingSafeEqual } from "crypto";

const safeEqual = (a: string, b: string): boolean => {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
};

/**
 * Endpoint server-side de autenticação admin.
 *
 * Por que existe — credenciais admin ficam em `ADMIN_EMAIL` / `ADMIN_PASSWORD`
 * no `.env.local` (sem prefixo `NEXT_PUBLIC_`), e variáveis sem esse prefixo só
 * são acessíveis no servidor. A página `/login` é client-side e não consegue
 * lê-las diretamente — daí a necessidade desse endpoint.
 *
 * Recursos de segurança:
 * - Rate limit em memória (5 tentativas erradas em 15 minutos = lock de 5 min)
 * - Resposta sem revelar se o e-mail existe
 * - Comparação case-insensitive no e-mail, exata na senha
 *
 * Limitações conhecidas:
 * - O Map em memória reseta a cada restart/deploy do servidor
 * - Em arquitetura multi-instância (LB), cada instância tem seu próprio Map
 * - Para produção em escala, migrar para Redis/Upstash
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AttemptState = { count: number; firstAt: number; lockedUntil: number };
const attempts = new Map<string, AttemptState>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const LOCK_MS = 5 * 60 * 1000;

const buildKey = (ip: string, email: string) =>
  `${ip}::${email.toLowerCase().trim()}`;

const getClientIp = (req: Request): string => {
  // x-real-ip e setado pelo proxy (Nginx) e nao e falsificavel pelo cliente.
  const xri = req.headers.get("x-real-ip");
  if (xri) return xri.trim();
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return "unknown";
};

export async function POST(req: Request) {
  let body: { email?: unknown; password?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Requisição inválida" },
      { status: 400 }
    );
  }

  const email = String(body?.email ?? "").trim();
  const password = String(body?.password ?? "");

  if (!email || !password) {
    return NextResponse.json(
      { ok: false, error: "Informe e-mail e senha" },
      { status: 400 }
    );
  }

  const expectedEmail = (process.env.ADMIN_EMAIL || "").toLowerCase();
  const expectedPassword = process.env.ADMIN_PASSWORD || "";

  if (!expectedEmail || !expectedPassword) {
    // Nao vazar detalhe de config pro cliente; motivo real so no log do servidor.
    console.error("[admin-login] ADMIN_EMAIL/ADMIN_PASSWORD ausentes no ambiente do servidor");
    return NextResponse.json(
      { ok: false, error: "Erro interno. Tente novamente mais tarde." },
      { status: 500 }
    );
  }

  // O /login manda TODO login primeiro para cá (para detectar o admin).
  // E-mail que não é o do admin nunca entra no rate limit — senão advogado
  // errando a própria senha acumulava 429 aqui e ficava travado no login.
  if (email.toLowerCase() !== expectedEmail) {
    return NextResponse.json(
      { ok: false, error: "E-mail ou senha incorretos" },
      { status: 401 }
    );
  }

  const ip = getClientIp(req);
  const key = buildKey(ip, email);
  const now = Date.now();
  const state = attempts.get(key);

  if (state && state.lockedUntil > now) {
    const waitSec = Math.ceil((state.lockedUntil - now) / 1000);
    return NextResponse.json(
      {
        ok: false,
        error: `Muitas tentativas. Tente novamente em ${waitSec}s.`,
        lockedSeconds: waitSec
      },
      { status: 429 }
    );
  }

  const ok =
    email.toLowerCase() === expectedEmail && safeEqual(password, expectedPassword);

  if (ok) {
    attempts.delete(key);
    const token = createAdminToken();
    const res = NextResponse.json({ ok: true, email: expectedEmail });
    setAdminCookie(res, token);
    return res;
  }

  const fresh = !state || now - state.firstAt > WINDOW_MS;
  const next: AttemptState = fresh
    ? { count: 1, firstAt: now, lockedUntil: 0 }
    : { count: state.count + 1, firstAt: state.firstAt, lockedUntil: 0 };
  if (next.count >= MAX_ATTEMPTS) {
    next.lockedUntil = now + LOCK_MS;
  }
  attempts.set(key, next);

  const attemptsRemaining = Math.max(0, MAX_ATTEMPTS - next.count);
  return NextResponse.json(
    {
      ok: false,
      error: "E-mail ou senha incorretos",
      attemptsRemaining,
      lockedSeconds: next.lockedUntil > now
        ? Math.ceil((next.lockedUntil - now) / 1000)
        : undefined
    },
    { status: 401 }
  );
}
