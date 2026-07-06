import { describe, expect, it } from "vitest";
import { generateAlerts } from "@/features/crowd/crowd-dashboard";
import type { Zone } from "@/types";

describe("generateAlerts", () => {
  it("emits reroute suggestion when a gate is critical", () => {
    const zones: Zone[] = [
      { id: "gate-a", name: "Gate A", type: "gate", capacity: 100, occupancy: 99, x: 0, y: 0, accessible: true },
      { id: "gate-b", name: "Gate B", type: "gate", capacity: 100, occupancy: 20, x: 0, y: 0, accessible: true },
    ];
    const alerts = generateAlerts(zones);
    expect(alerts.length).toBe(1);
    expect(alerts[0].recommendation).toContain("Gate B");
  });
  it("returns empty when nothing critical", () => {
    const zones: Zone[] = [
      { id: "g", name: "G", type: "gate", capacity: 100, occupancy: 10, x: 0, y: 0, accessible: true },
    ];
    expect(generateAlerts(zones)).toHaveLength(0);
  });
});
