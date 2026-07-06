import { describe, expect, it } from "vitest";
import { applyIncidentFilter, parseIncidentQuery } from "@/lib/query-incidents";
import { INITIAL_INCIDENTS, ZONES } from "@/lib/mock-data";

describe("parseIncidentQuery", () => {
  it("matches zone name", () => {
    const f = parseIncidentQuery("show issues in medical bay", ZONES);
    expect(f.zoneId).toBe("med-1");
  });
  it("extracts severity", () => {
    expect(parseIncidentQuery("high severity events", ZONES).severity).toBe("high");
  });
  it("parses last hour window", () => {
    const f = parseIncidentQuery("last 2 hours", ZONES);
    expect(f.since).toBeDefined();
    expect(Date.now() - (f.since ?? 0)).toBeGreaterThan(60 * 60 * 1000);
  });
});

describe("applyIncidentFilter", () => {
  it("filters by severity", () => {
    const res = applyIncidentFilter(INITIAL_INCIDENTS, { severity: "high" });
    expect(res.every((i) => i.severity === "high")).toBe(true);
    expect(res.length).toBeGreaterThan(0);
  });
  it("returns all when filter empty", () => {
    expect(applyIncidentFilter(INITIAL_INCIDENTS, {})).toHaveLength(INITIAL_INCIDENTS.length);
  });
});
