import crypto from "node:crypto";
import { cookies } from "next/headers";

/**
 * Sessão admin assinada (HMAC) em cookie httpOnly.
 *
 * O cookie carrega `<timestamp>.<hmac-sha256>` onde o HMAC é gerado com a
 * chave `ADMIN_SESSION_SECRET` (env var). Validade fixa de 24 horas.
 *
 * Por que não usar JWT? Não precisamos de claims complexos — só "este request
 * veio com a senha admin correta há menos de 24h". HMAC simples basta e evita
 * dependências externas.
 */

const SESSION_COOKIE = "advaqui_admin_session";
const MAX_AGE_SEC = 24 * 60 * 60; // 24h

const getSecret = (): string => {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 16) {
    throw new Error(
      "ADMIN_SESSION_SECRET ausente ou curto (mín. 16 caracteres). Defina no .env.local."
    );
  }
  return s;
};

const sign = (data: string): string =>
  crypto.createHmac("sha256", getSecret()).update(data).digest("hex");

export const createAdminToken = (): string => {
  const ts = Date.now().toString();
  const sig = sign(ts);
  return `${ts}.${sig}`;
};

export const verifyAdminToken = (token: string | undefined): boolean => {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [ts, sig] = parts;
  const tsNum = Number(ts);
  if (!tsNum || isNaN(tsNum)) return false;
  // Expirado?
  if (Date.now() - tsNum > MAX_AGE_SEC * 1000) return false;
  // Assinatura confere?
  try {
    const expected = sign(ts);
    if (sig.length !== expected.length) return false;
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
};

export const setAdminCookie = (response: Response, token: string): void => {
  const isProd = process.env.NODE_ENV === "production";
  response.headers.append(
    "Set-Cookie",
    `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE_SEC}${isProd ? "; Secure" : ""}`
  );
};

export const clearAdminCookie = (response: Response): void => {
  response.headers.append(
    "Set-Cookie",
    `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
  );
};

/**
 * Verifica via `cookies()` do Next se o request atual é de admin.
 * Use em Route Handlers e Server Components.
 */
export const isAdminRequest = (): boolean => {
  try {
    const token = cookies().get(SESSION_COOKIE)?.value;
    return verifyAdminToken(token);
  } catch {
    return false;
  }
};

export { SESSION_COOKIE as ADMIN_COOKIE_NAME };
