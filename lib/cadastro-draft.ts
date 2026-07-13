/**
 * Rascunho persistente do cadastro de advogado (localStorage).
 *
 * Dois produtores: o próprio formulário /cadastro (autosave, para refresh ou
 * queda não apagarem o progresso) e o assistente /criar-perfil (as respostas
 * do assistente pré-preenchem o cadastro real — antes eram descartadas).
 *
 * NUNCA guarda senha, confirmação ou honeypot. Expira em 7 dias.
 */

export const CADASTRO_DRAFT_KEY = "advaqui_cadastro_draft_v1";
const DRAFT_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type CadastroDraft = {
  name?: string;
  cpf?: string;
  oab?: string;
  oabUf?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  city?: string;
  uf?: string;
  cep?: string;
  specialties?: string[];
  bio?: string;
  /** origem do rascunho: "assistente" (=/criar-perfil) ou "cadastro" */
  from?: string;
  savedAt?: number;
};

const STRING_FIELDS: Array<keyof CadastroDraft> = [
  "name", "cpf", "oab", "oabUf", "email", "phone", "whatsapp",
  "address", "city", "uf", "cep", "bio", "from"
];

export function saveCadastroDraft(draft: CadastroDraft): void {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      CADASTRO_DRAFT_KEY,
      JSON.stringify({ ...draft, savedAt: Date.now() })
    );
  } catch {
    // storage cheio/indisponível — rascunho é conveniência, nunca erro
  }
}

/** Lê e SANITIZA o rascunho: só campos conhecidos, tipos certos, sem senha. */
export function loadCadastroDraft(): CadastroDraft | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(CADASTRO_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (
      typeof parsed.savedAt === "number" &&
      Date.now() - parsed.savedAt > DRAFT_TTL_MS
    ) {
      localStorage.removeItem(CADASTRO_DRAFT_KEY);
      return null;
    }
    const clean: CadastroDraft = {};
    for (const k of STRING_FIELDS) {
      const v = parsed[k];
      if (typeof v === "string" && v.trim()) {
        (clean as Record<string, unknown>)[k] = v.slice(0, 600);
      }
    }
    if (Array.isArray(parsed.specialties)) {
      const specs = parsed.specialties
        .filter((s): s is string => typeof s === "string")
        .slice(0, 20);
      if (specs.length > 0) clean.specialties = specs;
    }
    const hasData = Object.keys(clean).length > 0;
    if (typeof parsed.savedAt === "number") clean.savedAt = parsed.savedAt;
    return hasData ? clean : null;
  } catch {
    return null;
  }
}

export function clearCadastroDraft(): void {
  try {
    if (typeof window === "undefined") return;
    localStorage.removeItem(CADASTRO_DRAFT_KEY);
  } catch {
    // nada a fazer
  }
}
