import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("@/lib/ticket.functions", () => ({
  issueDemoTicket: vi.fn(async () => ({ code: "WC26.USAMEX.N108R12S07.9999999999999.deadbeef" })),
  verifyTicketFn: vi.fn(async ({ data }: { data: { code: string } }) => {
    if (data.code.startsWith("WC26.")) {
      return { ok: true, payload: { match: "USAMEX", seat: "N108R12S07", expiresAt: 9999999999999 } };
    }
    return { ok: false, reason: "format" as const };
  }),
}));

import { TicketScanner } from "@/features/tickets/ticket-scanner";

describe("TicketScanner", () => {
  it("admits a valid demo ticket", async () => {
    const user = userEvent.setup();
    render(<TicketScanner />);
    const demoBtn = await screen.findByRole("button", { name: /use demo ticket/i });
    // wait for the mocked demo code to enable the button
    await vi.waitFor(() => expect(demoBtn).not.toBeDisabled());
    await user.click(demoBtn);
    expect(await screen.findByText(/admitted/i)).toBeInTheDocument();
  });
  it("rejects a malformed code", async () => {
    const user = userEvent.setup();
    render(<TicketScanner />);
    await user.type(screen.getByLabelText(/ticket code/i), "not-a-ticket");
    await user.click(screen.getByRole("button", { name: /verify ticket/i }));
    expect(await screen.findByText(/rejected/i)).toBeInTheDocument();
  });
});
