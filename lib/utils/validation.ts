export const isValidCpf = (raw: string): boolean => {
  const cpf = (raw || "").replace(/\D/g, "");
  if (cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
  let d1 = (sum * 10) % 11;
  if (d1 === 10) d1 = 0;
  if (d1 !== parseInt(cpf[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
  let d2 = (sum * 10) % 11;
  if (d2 === 10) d2 = 0;
  return d2 === parseInt(cpf[10]);
};

export const isValidEmail = (raw: string): boolean => {
  if (!raw) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return re.test(raw.trim());
};

export const isValidPhone = (raw: string): boolean => {
  const digits = (raw || "").replace(/\D/g, "");
  return digits.length === 10 || digits.length === 11;
};

export const isValidOab = (raw: string): boolean => {
  const cleaned = (raw || "").replace(/\D/g, "");
  return cleaned.length >= 3 && cleaned.length <= 8;
};

export const isStrongPassword = (raw: string): boolean => {
  if (!raw || raw.length < 8) return false;
  const hasLetter = /[a-zA-Z]/.test(raw);
  const hasNumber = /[0-9]/.test(raw);
  return hasLetter && hasNumber;
};

export const isValidCep = (raw: string): boolean => {
  const digits = (raw || "").replace(/\D/g, "");
  return digits.length === 8;
};
