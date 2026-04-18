export const normalizeCategory = (value?: string) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/[-_]+/g, "")
    .replace(/\s+/g, "")
    .trim();
