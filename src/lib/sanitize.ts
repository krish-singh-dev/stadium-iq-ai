/** Strip control chars and clamp length. Never trust free-form input. */
export function sanitizeUserText(input: string, maxLen = 500): string {
  const cleaned = input
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.slice(0, maxLen);
}
