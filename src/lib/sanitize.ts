/**
 * Sanitize free-form user text before rendering, logging, or sending to an LLM.
 * - Strips HTML tags (defense-in-depth against XSS if ever rendered as HTML)
 * - Strips control characters
 * - Collapses whitespace
 * - Clamps to `maxLen`
 */
export function sanitizeUserText(input: string, maxLen = 500): string {
  if (typeof input !== "string") return "";
  const cleaned = input
    // remove HTML tags and any script/style blocks entirely
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<\/?[a-z][^>]*>/gi, " ")
    // strip control chars
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    // collapse whitespace
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.slice(0, maxLen);
}

/** Escape a string for safe inclusion inside an HTML attribute or text node. */
export function escapeHtml(input: string): string {
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
