/**
 * Minimal demo ticket verifier. Not a real crypto scheme —
 * ticket format: `WC26-<MATCH>-<SEAT>-<EXP>-<CHK>` where CHK is a djb2 hash mod 9973.
 * The verifier is deterministic, dependency-free, and unit-testable.
 */

export interface TicketPayload {
  readonly match: string;
  readonly seat: string;
  readonly expiresAt: number;
}

export interface VerificationResult {
  readonly ok: boolean;
  readonly reason?: "format" | "checksum" | "expired";
  readonly payload?: TicketPayload;
}

function djb2(input: string): number {
  let h = 5381;
  for (let i = 0; i < input.length; i++) h = ((h << 5) + h + input.charCodeAt(i)) | 0;
  return Math.abs(h) % 9973;
}

export function signTicket(payload: TicketPayload): string {
  const base = `WC26-${payload.match}-${payload.seat}-${payload.expiresAt}`;
  return `${base}-${djb2(base).toString().padStart(4, "0")}`;
}

export function verifyTicket(code: string, now: number = Date.now()): VerificationResult {
  const parts = code.trim().split("-");
  if (parts.length !== 5 || parts[0] !== "WC26") return { ok: false, reason: "format" };
  const [, match, seat, expStr, chk] = parts;
  const expiresAt = Number(expStr);
  if (!Number.isFinite(expiresAt)) return { ok: false, reason: "format" };
  const base = `WC26-${match}-${seat}-${expiresAt}`;
  const expected = djb2(base).toString().padStart(4, "0");
  if (expected !== chk) return { ok: false, reason: "checksum" };
  if (expiresAt < now) return { ok: false, reason: "expired", payload: { match, seat, expiresAt } };
  return { ok: true, payload: { match, seat, expiresAt } };
}
