export const generateId = (): string => {
  const t = Date.now().toString(36);
  const r = Math.random().toString(36).slice(2, 11);
  return `${t}${r}`;
};
