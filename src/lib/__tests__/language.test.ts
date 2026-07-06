import { describe, expect, it } from "vitest";
import { detectLanguage, isRTL } from "@/lib/language";

describe("detectLanguage", () => {
  it("defaults to English", () => {
    expect(detectLanguage("Where is Gate C?")).toBe("en");
  });
  it("detects Spanish", () => {
    expect(detectLanguage("¿Dónde está el baño?")).toBe("es");
  });
  it("detects French", () => {
    expect(detectLanguage("Où sont les toilettes?")).toBe("fr");
  });
  it("detects Arabic via unicode range", () => {
    expect(detectLanguage("أين البوابة")).toBe("ar");
  });
});

describe("isRTL", () => {
  it("only Arabic is RTL", () => {
    expect(isRTL("ar")).toBe(true);
    expect(isRTL("en")).toBe(false);
  });
});
