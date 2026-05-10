// src/utils/helpers.ts
export function formatDate(iso?: string) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}
