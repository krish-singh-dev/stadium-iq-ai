import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AccessibilityPanel } from "@/features/accessibility/accessibility-panel";
import { ZONES } from "@/lib/mock-data";

vi.mock("sonner", () => ({ toast: { success: vi.fn() } }));

describe("AccessibilityPanel", () => {
  it("submits an assistance request", async () => {
    const user = userEvent.setup();
    const onRequest = vi.fn();
    render(<AccessibilityPanel zones={ZONES} onRequest={onRequest} />);
    await user.click(screen.getByRole("button", { name: /request assistance/i }));
    expect(onRequest).toHaveBeenCalledTimes(1);
    const arg = onRequest.mock.calls[0][0];
    expect(arg.status).toBe("pending");
    expect(arg.kind).toBe("wheelchair");
  });
});
