import { describe, expect, it } from "vitest";
import { escapeHtml, sanitizeUserText } from "@/lib/sanitize";

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
  it("strips HTML tags", () => {
    expect(sanitizeUserText("<b>hi</b> <i>there</i>")).toBe("hi there");
  });
  it("removes script blocks entirely", () => {
    expect(sanitizeUserText("safe <script>alert(1)</script> text")).toBe("safe text");
  });
  it("removes style blocks entirely", () => {
    expect(sanitizeUserText("a <style>.x{}</style> b")).toBe("a b");
  });
  it("handles non-string input", () => {
    // @ts-expect-error runtime guard
    expect(sanitizeUserText(null)).toBe("");
  });
});

describe("escapeHtml", () => {
  it("escapes dangerous chars", () => {
    expect(escapeHtml(`<img src=x onerror="alert('xss')">`)).toBe(
      "&lt;img src=x onerror=&quot;alert(&#39;xss&#39;)&quot;&gt;",
    );
  });
  it("escapes ampersands first", () => {
    expect(escapeHtml("a & b")).toBe("a &amp; b");
  });
});

