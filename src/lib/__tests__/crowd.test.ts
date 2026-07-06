import { describe, expect, it } from "vitest";
import { densityLevel, densityLabel, summarizeCrowd } from "@/lib/crowd";

describe("densityLevel", () => {
  it("returns low for empty zones", () => {
    expect(densityLevel({ capacity: 100, occupancy: 10 })).toBe("low");
  });
  it("returns moderate around 50%", () => {
    expect(densityLevel({ capacity: 100, occupancy: 55 })).toBe("moderate");
  });
  it("returns high at 80%", () => {
    expect(densityLevel({ capacity: 100, occupancy: 80 })).toBe("high");
  });
  it("returns critical at 95%", () => {
    expect(densityLevel({ capacity: 100, occupancy: 95 })).toBe("critical");
  });
  it("handles zero capacity", () => {
    expect(densityLevel({ capacity: 0, occupancy: 0 })).toBe("low");
  });
});

describe("densityLabel", () => {
  it("labels every level", () => {
    expect(densityLabel("critical")).toBe("Critical");
    expect(densityLabel("high")).toBe("High");
    expect(densityLabel("moderate")).toBe("Moderate");
    expect(densityLabel("low")).toBe("Low");
  });
});

describe("summarizeCrowd", () => {
  it("counts each level", () => {
    const s = summarizeCrowd([
      { id: "a", name: "A", type: "gate", capacity: 100, occupancy: 10, x: 0, y: 0, accessible: true },
      { id: "b", name: "B", type: "gate", capacity: 100, occupancy: 95, x: 0, y: 0, accessible: true },
      { id: "c", name: "C", type: "gate", capacity: 100, occupancy: 80, x: 0, y: 0, accessible: true },
    ]);
    expect(s).toEqual({ low: 1, moderate: 0, high: 1, critical: 1 });
  });
});
