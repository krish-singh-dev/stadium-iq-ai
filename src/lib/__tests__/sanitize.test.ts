import { describe, expect, it } from "vitest";
import { sanitizeUserText } from "@/lib/sanitize";

describe("sanitizeUserText", () => {
  it("trims and collapses whitespace", () => {
    expect(sanitizeUserText("  hello   world  ")).toBe("hello world");
  });
  it("removes control characters", () => {
    expect(sanitizeUserText("hi\u0000there")).toBe("hi there");
  });
  it("clamps length", () => {
    expect(sanitizeUserText("a".repeat(1000), 10)).toHaveLength(10);
  });
  it("returns empty for whitespace only", () => {
    expect(sanitizeUserText("   ")).toBe("");
  });
});
