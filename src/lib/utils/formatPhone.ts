const toPhoneString = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
};

export const formatPhone = (value: string): string => {
  const raw = toPhoneString(value);
  // Оставляем только цифры
  const numbers = raw.replace(/\D/g, "");
  // Удаляем первую 7 или 8 если есть
  const clean = numbers.replace(/^[78]/, "").slice(0, 10);

  if (clean.length === 0) return "";

  let result = "+7 ";
  if (clean.length > 0) result += `(${clean.slice(0, 3)}`;
  if (clean.length > 3) result += `) ${clean.slice(3, 6)}`;
  if (clean.length > 6) result += `-${clean.slice(6, 8)}`;
  if (clean.length > 8) result += `-${clean.slice(8, 10)}`;

  return result;
};

export const getCleanPhone = (value: unknown): string => {
  const numbers = toPhoneString(value).replace(/\D/g, "");
  return "7" + numbers.replace(/^[78]/, "").slice(0, 10);
};
