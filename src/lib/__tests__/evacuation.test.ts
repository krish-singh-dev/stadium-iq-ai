import { describe, expect, it } from "vitest";
import { planEvacuation, zoneDistance } from "@/lib/evacuation";
import { ZONES } from "@/lib/mock-data";
import type { Zone } from "@/types";

describe("zoneDistance", () => {
  it("returns 0 for the same point", () => {
    expect(zoneDistance({ x: 5, y: 5 }, { x: 5, y: 5 })).toBe(0);
  });
  it("computes euclidean distance", () => {
    expect(zoneDistance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
  });
});

describe("planEvacuation", () => {
  it("routes every non-exit zone to a gate", () => {
    const routes = planEvacuation(ZONES);
    const nonExits = ZONES.filter((z) => z.type !== "exit" && z.type !== "gate");
    expect(routes).toHaveLength(nonExits.length);
    for (const r of routes) {
      const exit = ZONES.find((z) => z.id === r.exitId)!;
      expect(["gate", "exit"]).toContain(exit.type);
      expect(r.etaSeconds).toBeGreaterThan(0);
    }
  });
  it("respects accessibleOnly option", () => {
    const routes = planEvacuation(ZONES, { accessibleOnly: true });
    for (const r of routes) {
      const exit = ZONES.find((z) => z.id === r.exitId)!;
      expect(exit.accessible).toBe(true);
    }
  });
  it("returns empty when no exits", () => {
    const zones: Zone[] = [
      { id: "s", name: "S", type: "seating", capacity: 10, occupancy: 5, x: 0, y: 0, accessible: true },
    ];
    expect(planEvacuation(zones)).toHaveLength(0);
  });
});
