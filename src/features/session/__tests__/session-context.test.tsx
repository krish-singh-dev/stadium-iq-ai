import { describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { SessionProvider, useSession } from "@/features/session/session-context";
import type { ReactNode } from "react";

const wrapper = ({ children }: { children: ReactNode }) => (
  <SessionProvider>{children}</SessionProvider>
);

describe("SessionContext", () => {
  it("defaults to fan/en", () => {
    const { result } = renderHook(() => useSession(), { wrapper });
    expect(result.current.role).toBe("fan");
    expect(result.current.language).toBe("en");
  });

  it("updates role and language via setters", () => {
    const { result } = renderHook(() => useSession(), { wrapper });
    act(() => result.current.setRole("staff"));
    act(() => result.current.setLanguage("ar"));
    expect(result.current.role).toBe("staff");
    expect(result.current.language).toBe("ar");
  });

  it("throws a clear error if used outside the provider", () => {
    // suppress React's error boundary noise
    const spy = console.error;
    console.error = () => {};
    try {
      expect(() => renderHook(() => useSession())).toThrow(/SessionProvider/);
    } finally {
      console.error = spy;
    }
  });
});
