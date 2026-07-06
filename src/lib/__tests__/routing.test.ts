import { describe, expect, it } from "vitest";
import { buildRoute } from "@/lib/routing";
import { ZONES } from "@/lib/mock-data";

describe("buildRoute", () => {
  it("produces at least a start and end step", () => {
    const from = ZONES[0];
    const to = ZONES[ZONES.length - 1];
    const steps = buildRoute(from, to, ZONES);
    expect(steps.length).toBeGreaterThanOrEqual(2);
    expect(steps[0].instruction).toContain(from.name);
    expect(steps[steps.length - 1].instruction).toContain(to.name);
  });
  it("restricts to accessible zones when requested", () => {
    const from = ZONES.find((z) => z.id === "gate-a")!;
    const to = ZONES.find((z) => z.id === "gate-b")!;
    const steps = buildRoute(from, to, ZONES, { accessibleOnly: true });
    const mid = steps.find((s) => s.zoneId && s.zoneId !== from.id && s.zoneId !== to.id);
    if (mid?.zoneId) {
      const zone = ZONES.find((z) => z.id === mid.zoneId);
      expect(zone?.accessible).toBe(true);
    }
  });
});
