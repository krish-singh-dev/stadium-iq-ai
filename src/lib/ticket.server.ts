import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Server-side ticket signing/verification using HMAC-SHA256.
 * The signing secret never leaves the server bundle.
 */

export interface TicketPayload {
  readonly match: string;
  readonly seat: string;
  readonly expiresAt: number;
}

export type VerificationReason = "format" | "signature" | "expired";

export interface VerificationResult {
  readonly ok: boolean;
  readonly reason?: VerificationReason;
  readonly payload?: TicketPayload;
}

function getSecret(): string {
  const s = process.env.TICKET_SIGNING_SECRET;
  if (!s) throw new Error("Missing TICKET_SIGNING_SECRET");
  return s;
}

function sign(base: string): string {
  return createHmac("sha256", getSecret()).update(base).digest("hex").slice(0, 32);
}

export function signTicket(payload: TicketPayload): string {
  const base = `WC26.${payload.match}.${payload.seat}.${payload.expiresAt}`;
  return `${base}.${sign(base)}`;
}

export function verifyTicket(
  code: string,
  now: number = Date.now(),
): VerificationResult {
  const parts = code.trim().split(".");
  if (parts.length !== 5 || parts[0] !== "WC26") return { ok: false, reason: "format" };
  const [, match, seat, expStr, mac] = parts;
  const expiresAt = Number(expStr);
  if (!Number.isFinite(expiresAt)) return { ok: false, reason: "format" };
  const base = `WC26.${match}.${seat}.${expiresAt}`;
  const expected = sign(base);
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(mac, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, reason: "signature" };
  }
  if (expiresAt < now) {
    return { ok: false, reason: "expired", payload: { match, seat, expiresAt } };
  }
  return { ok: true, payload: { match, seat, expiresAt } };
}
