export const slugify = (s: string): string => {
  if (!s) return "";
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export const formatUf = (uf: string): string => uf.toUpperCase();
export const lowerUf = (uf: string): string => uf.toLowerCase();
