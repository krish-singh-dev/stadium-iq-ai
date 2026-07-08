import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import { z } from "zod";
import { checkRateLimit } from "./rate-limit.server";

const VerifyInput = z.object({
  code: z.string().trim().min(1).max(200),
});

const DemoInput = z.object({
  match: z.string().trim().min(1).max(32),
  seat: z.string().trim().min(1).max(32),
});

async function ratelimit(key: string, limit: number, windowMs: number) {
  const rl = checkRateLimit(key, limit, windowMs);
  if (!rl.allowed) {
    throw new Error(`Rate limit exceeded. Retry in ${Math.ceil(rl.retryAfterMs / 1000)}s`);
  }
}

function ipKey(prefix: string): string {
  try {
    const ip = getRequestIP({ xForwardedFor: true }) ?? "unknown";
    return `${prefix}:${ip}`;
  } catch {
    return `${prefix}:unknown`;
  }
}

export const verifyTicketFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => VerifyInput.parse(data))
  .handler(async ({ data }) => {
    await ratelimit(ipKey("ticket-verify"), 20, 60_000);
    const { verifyTicket } = await import("./ticket.server");
    return verifyTicket(data.code);
  });

export const issueDemoTicket = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => DemoInput.parse(data))
  .handler(async ({ data }) => {
    await ratelimit(ipKey("ticket-demo"), 10, 60_000);
    const { signTicket } = await import("./ticket.server");
    return {
      code: signTicket({
        match: data.match,
        seat: data.seat,
        expiresAt: Date.now() + 1000 * 60 * 60 * 6,
      }),
    };
  });
