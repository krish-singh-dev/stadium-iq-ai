import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TicketScanner } from "@/features/tickets/ticket-scanner";

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

describe("TicketScanner", () => {
  it("admits a valid demo ticket", async () => {
    const user = userEvent.setup();
    render(<TicketScanner />);
    await user.click(screen.getByRole("button", { name: /use demo ticket/i }));
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
