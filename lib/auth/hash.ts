/**
 * Hash de senha para AMBIENTE DEMO (client-side, localStorage).
 *
 * Em produção, NUNCA use isso. Use Supabase Auth ou bcrypt server-side.
 * Este hash existe apenas para que o MVP local valide login básico
 * sem armazenar a senha em texto puro no localStorage.
 *
 * O salt é fixo no código apenas para demo. Em produção, o salt deve
 * ser por usuário e o hash deve usar bcrypt/argon2 server-side.
 */

const SALT_DEMO = "AdvAqui-demo-salt-2026";

const toHex = (buf: ArrayBuffer): string =>
  Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

export const hashPassword = async (password: string): Promise<string> => {
  if (typeof window === "undefined") return "";
  const data = new TextEncoder().encode(SALT_DEMO + password);
  const buf = await window.crypto.subtle.digest("SHA-256", data);
  return toHex(buf);
};

export const verifyPassword = async (
  password: string,
  hash?: string
): Promise<boolean> => {
  if (!hash) return false;
  const calc = await hashPassword(password);
  return calc === hash;
};
