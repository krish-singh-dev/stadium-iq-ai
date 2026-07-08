import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { AccessibilityPanel } from "@/features/accessibility/accessibility-panel";
import { AssistantChat } from "@/features/assistant/assistant-chat";
import { useLiveStadium } from "@/features/stadium/use-live-stadium";
import { useSession } from "@/features/session/session-context";
import type { AssistanceRequest } from "@/types";
import { ZONES } from "@/lib/mock-data";

export const Route = createFileRoute("/volunteer")({
  head: () => ({
    meta: [
      { title: "Volunteer View — StadiumIQ" },
      { name: "description", content: "Assistance queue and support tools for stadium volunteers." },
    ],
  }),
  component: VolunteerView,
});

// Fixed timestamps so SSR and client hydration match.
const SEED: AssistanceRequest[] = [
  { id: "seed-1", zoneId: "sec-north", kind: "wheelchair", note: "Needs escort to section 108", createdAt: 1_700_000_000_000, status: "pending" },
  { id: "seed-2", zoneId: "gate-b", kind: "translation", note: "Arabic-speaking family looking for Gate B", createdAt: 1_700_000_220_000, status: "assigned" },
];

function formatTimeUTC(ms: number): string {
  const d = new Date(ms);
  const h = String(d.getUTCHours()).padStart(2, "0");
  const m = String(d.getUTCMinutes()).padStart(2, "0");
  const s = String(d.getUTCSeconds()).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function VolunteerView() {
  const { role, setRole } = useSession();
  const { zones } = useLiveStadium();
  const [queue, setQueue] = useState<AssistanceRequest[]>(SEED);
  useEffect(() => {
    if (role !== "volunteer") setRole("volunteer");
  }, [role, setRole]);

  const zoneById = new Map(ZONES.map((z) => [z.id, z.name] as const));

  function advance(id: string) {
    setQueue((prev) =>
      prev.map((r) =>
        r.id !== id
          ? r
          : {
              ...r,
              status: r.status === "pending" ? "assigned" : r.status === "assigned" ? "completed" : "completed",
            },
      ),
    );
  }

  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section
            aria-labelledby="queue-heading"
            className="rounded-xl border bg-card p-4 shadow-sm"
          >
            <header className="mb-3">
              <h2 id="queue-heading" className="text-base font-semibold">
                Assistance Queue
              </h2>
              <p className="text-xs text-muted-foreground">
                Incoming requests from fans across the venue
              </p>
            </header>
            <ul className="divide-y" role="list">
              {queue.map((r) => (
                <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="font-medium capitalize">
                      {r.kind} · {zoneById.get(r.zoneId) ?? r.zoneId}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {r.note || "No additional details"} ·{" "}
                      {formatTimeUTC(r.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        r.status === "completed"
                          ? "bg-density-low text-foreground"
                          : r.status === "assigned"
                            ? "bg-density-moderate text-foreground"
                            : "bg-density-high text-white"
                      }`}
                    >
                      {r.status}
                    </span>
                    {r.status !== "completed" && (
                      <button
                        type="button"
                        onClick={() => advance(r.id)}
                        className="min-h-11 rounded-md border px-3 py-1 text-sm hover:bg-accent"
                      >
                        {r.status === "pending" ? "Assign to me" : "Mark complete"}
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <AccessibilityPanel
            zones={zones}
            onRequest={(r) => setQueue((prev) => [r, ...prev])}
          />
        </div>
        <div className="lg:sticky lg:top-24 lg:h-fit">
          <AssistantChat zones={zones} />
        </div>
      </div>
    </AppShell>
  );
}
