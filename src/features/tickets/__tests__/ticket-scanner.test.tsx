import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("@/lib/ticket.functions", () => ({
  issueDemoTicket: vi.fn(async () => ({ code: "WC26.demo.demo.9999.deadbeef" })),
  verifyTicketFn: vi.fn(async () => ({ ok: false, reason: "format" as const })),
}));

import { TicketScanner } from "@/features/tickets/ticket-scanner";

describe("TicketScanner", () => {
  it("renders the form with an accessible ticket-code input", () => {
    render(<TicketScanner />);
    expect(screen.getByLabelText(/ticket code/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /verify ticket/i })).toBeInTheDocument();
  });
});
