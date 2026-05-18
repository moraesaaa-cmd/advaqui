export const formatDate = (d?: string | Date | null): string => {
  if (!d) return "—";
  const dt = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleDateString("pt-BR");
};

export const formatPhone = (raw: string): string => {
  const d = (raw || "").replace(/\D/g, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return raw;
};

export const formatCpf = (raw: string): string => {
  const d = (raw || "").replace(/\D/g, "").slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
};

export const formatCep = (raw: string): string => {
  const d = (raw || "").replace(/\D/g, "").slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
};

export const formatCurrency = (value: number): string =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/**
 * Capitaliza nome de pessoa em padrão brasileiro:
 *
 *   "MARIA JOÃO DA SILVA" → "Maria João da Silva"
 *   "joão pereira"        → "João Pereira"
 *
 * Mantém conectivos comuns (da, de, do, das, dos, e) em minúsculas,
 * exceto quando primeira palavra. Preserva acentos e ç.
 */
export const titleCaseNameBR = (raw: string): string => {
  const connectives = new Set(["da", "de", "do", "das", "dos", "e", "del"]);
  return raw
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word, i) => {
      if (i > 0 && connectives.has(word)) return word;
      // Trata hífens (ex: "del-rei" → "Del-Rei")
      return word
        .split("-")
        .map((part) => part.charAt(0).toLocaleUpperCase("pt-BR") + part.slice(1))
        .join("-");
    })
    .join(" ");
};

export const whatsappLink = (
  raw: string | undefined | null,
  message?: string
): string | undefined => {
  const d = (raw || "").replace(/\D/g, "");
  if (d.length < 10) return undefined;
  const number = d.startsWith("55") ? d : `55${d}`;
  const params = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${number}${params}`;
};

export const telLink = (raw: string | undefined | null): string | undefined => {
  const d = (raw || "").replace(/\D/g, "");
  if (d.length < 10) return undefined;
  return `tel:+55${d}`;
};

export const daysBetween = (a: Date | string, b: Date | string): number => {
  const da = typeof a === "string" ? new Date(a) : a;
  const db = typeof b === "string" ? new Date(b) : b;
  const ms = db.getTime() - da.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
};

export const daysUntil = (date?: string | Date | null): number | null => {
  if (!date) return null;
  return daysBetween(new Date(), date);
};
