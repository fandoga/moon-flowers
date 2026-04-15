export const normalizeProductName = (name: string): string => {
  return name.replace(/\s*\(.*?\)\s*/g, '').trim();
};