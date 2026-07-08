import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLiveStadium } from "@/features/stadium/use-live-stadium";
import { ZONES } from "@/lib/mock-data";

describe("useLiveStadium", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("exposes zones and incidents on mount", () => {
    const { result } = renderHook(() => useLiveStadium());
    expect(result.current.zones.length).toBe(ZONES.length);
    expect(Array.isArray(result.current.incidents)).toBe(true);
  });

  it("appends reported incidents to the head of the list", () => {
    const { result } = renderHook(() => useLiveStadium());
    const before = result.current.incidents.length;
    act(() => {
      result.current.reportIncident({
        id: "test-1",
        zoneId: "sec-north",
        kind: "medical",
        severity: "low",
        createdAt: 1,
        status: "open",
        note: "test",
      });
    });
    expect(result.current.incidents.length).toBe(before + 1);
    expect(result.current.incidents[0].id).toBe("test-1");
  });

  it("does not tick when the tab is hidden", () => {
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => "hidden",
    });
    const { result } = renderHook(() => useLiveStadium());
    const before = result.current.zones.map((z) => z.occupancy);
    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    const after = result.current.zones.map((z) => z.occupancy);
    expect(after).toEqual(before);
  });
});
