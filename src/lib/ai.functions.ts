import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const ChatInput = z.object({
  message: z.string().trim().min(1).max(500),
  language: z.enum(["en", "es", "fr", "ar"]),
  role: z.enum(["fan", "volunteer", "organizer", "staff"]),
  context: z.string().max(2000).optional(),
});

/** Server function: multilingual stadium assistant. */
export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => ChatInput.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3-flash-preview");
    const system = `You are StadiumIQ, a concise multilingual assistant for FIFA World Cup 2026 stadium operations.
Reply in the user's language: ${data.language}.
The user role is "${data.role}". Keep answers under 120 words, actionable, and stadium-context aware.
${data.context ? `Live stadium context:\n${data.context}` : ""}`;
    try {
      const { text } = await generateText({
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: data.message },
        ],
      });
      return { text };
    } catch (err) {
      return {
        text:
          "The assistant is temporarily unavailable. Please try again in a moment or contact a staff member.",
        error: err instanceof Error ? err.message : "unknown",
      };
    }
  });

const RecommendInput = z.object({
  scenario: z.string().trim().min(3).max(400),
  role: z.enum(["fan", "volunteer", "organizer", "staff"]),
});

/** Server function: prioritized action checklist. */
export const recommendActions = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => RecommendInput.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3-flash-preview");
    try {
      const { text } = await generateText({
        model,
        messages: [
          {
            role: "system",
            content: `You are an incident-response advisor for stadium operations at the FIFA World Cup 2026.
Given a scenario, return a numbered, prioritized checklist of 4-6 short actions for the ${data.role}.
Each action must start with a verb. Do not add prose before or after the list.`,
          },
          { role: "user", content: data.scenario },
        ],
      });
      return { text };
    } catch (err) {
      return {
        text:
          "1. Alert supervisor\n2. Secure area\n3. Notify medical/security as needed\n4. Log incident",
        error: err instanceof Error ? err.message : "unknown",
      };
    }
  });
