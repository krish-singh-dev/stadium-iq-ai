import { describe, expect, it, beforeAll } from "vitest";

// Provide a deterministic secret for tests before the module reads it.
beforeAll(() => {
  process.env.TICKET_SIGNING_SECRET = "test-secret-do-not-use-in-production-0123456789";
});

describe("ticket verifier (HMAC)", () => {
  it("round-trips a valid ticket", async () => {
    const { signTicket, verifyTicket } = await import("@/lib/ticket.server");
    const future = Date.now() + 60_000;
    const code = signTicket({ match: "USAMEX", seat: "N108R12S7", expiresAt: future });
    const res = verifyTicket(code);
    expect(res.ok).toBe(true);
    expect(res.payload?.match).toBe("USAMEX");
  });
  it("rejects a malformed ticket", async () => {
    const { verifyTicket } = await import("@/lib/ticket.server");
    expect(verifyTicket("hello").ok).toBe(false);
    expect(verifyTicket("hello").reason).toBe("format");
  });
  it("rejects a tampered ticket", async () => {
    const { signTicket, verifyTicket } = await import("@/lib/ticket.server");
    const code = signTicket({ match: "USAMEX", seat: "N108", expiresAt: Date.now() + 60_000 });
    const tampered = code.replace("N108", "S001");
    expect(verifyTicket(tampered).reason).toBe("signature");
  });
  it("rejects an expired ticket", async () => {
    const { signTicket, verifyTicket } = await import("@/lib/ticket.server");
    const past = Date.now() - 60_000;
    const code = signTicket({ match: "USAMEX", seat: "N108", expiresAt: past });
    const res = verifyTicket(code);
    expect(res.ok).toBe(false);
    expect(res.reason).toBe("expired");
  });
});
