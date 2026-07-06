import { describe, expect, it } from "vitest";
import { signTicket, verifyTicket } from "@/lib/ticket";

describe("ticket verifier", () => {
  const future = Date.now() + 60_000;
  const past = Date.now() - 60_000;

  it("round-trips a valid ticket", () => {
    const code = signTicket({ match: "USAMEX", seat: "N108R12S7", expiresAt: future });
    const res = verifyTicket(code);
    expect(res.ok).toBe(true);
    expect(res.payload?.match).toBe("USAMEX");
  });
  it("rejects a malformed ticket", () => {
    expect(verifyTicket("hello").ok).toBe(false);
    expect(verifyTicket("hello").reason).toBe("format");
  });
  it("rejects a tampered ticket", () => {
    const code = signTicket({ match: "USAMEX", seat: "N108", expiresAt: future });
    const tampered = code.replace("N108", "S001");
    expect(verifyTicket(tampered).reason).toBe("checksum");
  });
  it("rejects an expired ticket", () => {
    const code = signTicket({ match: "USAMEX", seat: "N108", expiresAt: past });
    const res = verifyTicket(code);
    expect(res.ok).toBe(false);
    expect(res.reason).toBe("expired");
  });
});
